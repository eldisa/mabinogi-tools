# -*- coding: utf-8 -*-
"""
compare-enchants.py
比較 enchants_generated.ts 與 enchants.ts 中相同 ID 的差異

使用方式：
    python scripts/compare-enchants.py
    python scripts/compare-enchants.py --output compare_result.txt
"""

import argparse
import re
import sys
from pathlib import Path

# ============================================================
# 路徑設定
# ============================================================
SCRIPT_DIR   = Path(__file__).parent
ROOT         = SCRIPT_DIR.parent
GENERATED_TS = ROOT / "src" / "data" / "enchants_generated.ts"
CURRENT_TS   = ROOT / "src" / "data" / "enchants.ts"
DEFAULT_OUT  = SCRIPT_DIR / "compare_result.txt"


# ============================================================
# 解析工具
# ============================================================

def find_bracket_end(text: str, start: int, open_ch: str, close_ch: str) -> int:
    """從 start 位置（open_ch 處）找到對應的 close_ch 位置"""
    depth = 0
    in_str = False
    escape = False
    for i in range(start, len(text)):
        ch = text[i]
        if escape:
            escape = False
            continue
        if ch == "\\" and in_str:
            escape = True
            continue
        if ch == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch == open_ch:
            depth += 1
        elif ch == close_ch:
            depth -= 1
            if depth == 0:
                return i
    return len(text) - 1


def split_entry_blocks(text: str) -> list[str]:
    """以大括號深度拆出 enchants 陣列裡的每一個 entry block"""
    # 找到 enchants 陣列的起點
    m = re.search(r'export const enchants[^=]*=\s*\[', text)
    if not m:
        return []
    array_start = m.end() - 1          # 指向 [
    array_end   = find_bracket_end(text, array_start, "[", "]")
    array_text  = text[array_start + 1 : array_end]

    # 以深度 0 的 { } 拆出每個 entry
    blocks: list[str] = []
    depth = 0
    in_str = False
    escape = False
    start = None
    for i, ch in enumerate(array_text):
        if escape:
            escape = False
            continue
        if ch == "\\" and in_str:
            escape = True
            continue
        if ch == '"':
            in_str = not in_str
            continue
        if in_str:
            continue
        if ch == "{":
            if depth == 0:
                start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and start is not None:
                blocks.append(array_text[start : i + 1])
                start = None
    return blocks


def parse_str_array(text: str, field: str) -> list[str] | None:
    """從 block 文字中提取 field: ["a", "b"] 的值"""
    idx = text.find(f"{field}: [")
    if idx < 0:
        return None
    arr_start = text.index("[", idx)
    arr_end   = find_bracket_end(text, arr_start, "[", "]")
    arr_text  = text[arr_start : arr_end + 1]
    return re.findall(r'"([^"]*)"', arr_text)


def parse_effects(text: str) -> list[dict]:
    """從 block 文字中提取 effect 陣列"""
    idx = text.find("effect: [")
    if idx < 0:
        return []
    arr_start = text.index("[", idx)
    arr_end   = find_bracket_end(text, arr_start, "[", "]")
    arr_text  = text[arr_start : arr_end + 1]

    effects: list[dict] = []
    for m in re.finditer(
        r'\{\s*id:\s*"([^"]+)"\s*,\s*min:\s*(-?\d+(?:\.\d+)?)\s*,\s*max:\s*(-?\d+(?:\.\d+)?)',
        arr_text,
    ):
        effects.append(
            {"id": m.group(1), "min": float(m.group(2)), "max": float(m.group(3))}
        )
    return effects


def parse_name(text: str) -> dict | None:
    """提取 name 物件（相容單行 / 多行格式）"""
    idx = text.find("name: {")
    if idx < 0:
        idx = text.find("name:{")
    if idx < 0:
        return None
    obj_start = text.index("{", idx)
    obj_end   = find_bracket_end(text, obj_start, "{", "}")
    obj_text  = text[obj_start : obj_end + 1]

    tw_m  = re.search(r'\btw:\s*"((?:[^"\\]|\\.)*)"', obj_text)
    en_m  = re.search(r'\ben:\s*"((?:[^"\\]|\\.)*)"', obj_text)
    tw2_m = re.search(r'\btw2:\s*"((?:[^"\\]|\\.)*)"', obj_text)
    if not tw_m:
        return None
    return {
        "tw":  tw_m.group(1),
        "en":  en_m.group(1)  if en_m  else "",
        "tw2": tw2_m.group(1) if tw2_m else "",
    }


def parse_block(block: str) -> dict | None:
    """將單一 entry block 解析成 dict"""
    id_m = re.search(r'\bid:\s*(\d+)', block)
    if not id_m:
        return None

    entry: dict = {"id": int(id_m.group(1)), "_raw": block}

    entry["name"] = parse_name(block)

    lv_m = re.search(r'\blevel:\s*(\d+)', block)
    entry["level"] = int(lv_m.group(1)) if lv_m else None

    tp_m = re.search(r'\btype:\s*"([^"]+)"', block)
    entry["type"] = tp_m.group(1) if tp_m else None

    entry["limit"] = parse_str_array(block, "limit")

    pe_m = re.search(r'\bpersonalize:\s*(true|false)', block)
    entry["personalize"] = (pe_m.group(1) == "true") if pe_m else None

    entry["effect"] = parse_effects(block)

    return entry


def load_file(path: Path) -> dict[int, dict]:
    """讀取 TS 檔，回傳 {id: entry_dict}"""
    text = path.read_text(encoding="utf-8")
    blocks = split_entry_blocks(text)
    result: dict[int, dict] = {}
    for b in blocks:
        e = parse_block(b)
        if e:
            result[e["id"]] = e
    return result


# ============================================================
# 比較邏輯
# ============================================================

def fmt_limit(lst: list[str] | None) -> str:
    if lst is None:
        return "(無)"
    return "[" + ", ".join(f'"{x}"' for x in lst) + "]"


def fmt_effect(effects: list[dict]) -> str:
    if not effects:
        return "[]"
    parts = []
    for e in effects:
        mn, mx = int(e["min"]) if e["min"] == int(e["min"]) else e["min"], \
                 int(e["max"]) if e["max"] == int(e["max"]) else e["max"]
        if mn == mx:
            parts.append(f'{e["id"]}({mn})')
        else:
            parts.append(f'{e["id"]}({mn}~{mx})')
    return "[" + ", ".join(parts) + "]"


def effects_equal(a: list[dict], b: list[dict]) -> bool:
    if len(a) != len(b):
        return False
    for ea, eb in zip(a, b):
        if ea["id"] != eb["id"]:
            return False
        if abs(ea["min"] - eb["min"]) > 0.001:
            return False
        if abs(ea["max"] - eb["max"]) > 0.001:
            return False
    return True


def compare_entries(gen: dict, cur: dict) -> list[str]:
    """回傳差異描述字串列表；空代表無差異"""
    diffs: list[str] = []

    # name
    gn, cn = gen.get("name"), cur.get("name")
    if gn and cn:
        if gn["tw"] != cn["tw"]:
            diffs.append(f'  name.tw  : gen="{gn["tw"]}"  |  cur="{cn["tw"]}"')
        if gn["en"] != cn["en"]:
            diffs.append(f'  name.en  : gen="{gn["en"]}"  |  cur="{cn["en"]}"')

    # level
    if gen.get("level") != cur.get("level"):
        diffs.append(f'  level    : gen={gen.get("level")}  |  cur={cur.get("level")}')

    # type
    if gen.get("type") != cur.get("type"):
        diffs.append(f'  type     : gen={gen.get("type")}  |  cur={cur.get("type")}')

    # personalize
    if gen.get("personalize") != cur.get("personalize"):
        diffs.append(f'  personalize: gen={gen.get("personalize")}  |  cur={cur.get("personalize")}')

    # limit
    gl, cl = gen.get("limit") or [], cur.get("limit") or []
    if sorted(gl) != sorted(cl):
        diffs.append(f'  limit    : gen={fmt_limit(gl)}')
        diffs.append(f'           : cur={fmt_limit(cl)}')

    # effect
    ge, ce = gen.get("effect") or [], cur.get("effect") or []
    if not effects_equal(ge, ce):
        diffs.append(f'  effect   : gen={fmt_effect(ge)}')
        diffs.append(f'           : cur={fmt_effect(ce)}')

    return diffs


# ============================================================
# 主程式
# ============================================================

def main() -> None:
    parser = argparse.ArgumentParser(description="Compare enchants_generated.ts vs enchants.ts")
    parser.add_argument("--generated", default=str(GENERATED_TS))
    parser.add_argument("--current",   default=str(CURRENT_TS))
    parser.add_argument("--output",    default=str(DEFAULT_OUT))
    args = parser.parse_args()

    gen_path = Path(args.generated)
    cur_path = Path(args.current)
    out_path = Path(args.output)

    print(f"[比較] 讀取 {gen_path.name} ...")
    gen_map = load_file(gen_path)
    print(f"       {len(gen_map)} 筆")

    print(f"[比較] 讀取 {cur_path.name} ...")
    cur_map = load_file(cur_path)
    print(f"       {len(cur_map)} 筆")

    gen_ids = set(gen_map)
    cur_ids = set(cur_map)
    both    = gen_ids & cur_ids
    only_gen = gen_ids - cur_ids
    only_cur = cur_ids - gen_ids

    lines: list[str] = []
    lines.append("=" * 72)
    lines.append(f"  enchants_generated.ts 與 enchants.ts 差異報告")
    lines.append("=" * 72)
    lines.append(f"  generated 筆數：{len(gen_map)}")
    lines.append(f"  current   筆數：{len(cur_map)}")
    lines.append(f"  共同 ID   筆數：{len(both)}")
    lines.append(f"  僅 generated  ：{len(only_gen)} 筆（current 裡沒有）")
    lines.append(f"  僅 current    ：{len(only_cur)} 筆（generated 裡沒有）")
    lines.append("")

    # ── 有差異的共同 ID ──────────────────────────────────────
    diff_entries: list[tuple[int, list[str]]] = []
    for eid in sorted(both):
        d = compare_entries(gen_map[eid], cur_map[eid])
        if d:
            diff_entries.append((eid, d))

    lines.append(f"  共同 ID 中有差異：{len(diff_entries)} 筆")
    lines.append("=" * 72)
    lines.append("")

    if diff_entries:
        lines.append("─" * 72)
        lines.append("【共同 ID 差異明細】")
        lines.append("─" * 72)
        for eid, diffs in diff_entries:
            name_tw = (gen_map[eid].get("name") or {}).get("tw", "")
            lines.append(f"  ID {eid}  「{name_tw}」")
            lines.extend(diffs)
            lines.append("")

    # ── 僅出現在 generated ──────────────────────────────────
    if only_gen:
        lines.append("─" * 72)
        lines.append("【僅在 generated（current 無此 ID）】")
        lines.append("─" * 72)
        for eid in sorted(only_gen):
            e = gen_map[eid]
            name_tw = (e.get("name") or {}).get("tw", "")
            lv = e.get("level", "?")
            tp = e.get("type", "?")
            lim = fmt_limit(e.get("limit"))
            lines.append(f"  ID {eid}  Lv{lv} {tp}  「{name_tw}」  limit={lim}")
        lines.append("")

    # ── 僅出現在 current ────────────────────────────────────
    if only_cur:
        lines.append("─" * 72)
        lines.append("【僅在 current（generated 無此 ID）】")
        lines.append("─" * 72)
        for eid in sorted(only_cur):
            e = cur_map[eid]
            name_tw = (e.get("name") or {}).get("tw", "")
            lv = e.get("level", "?")
            tp = e.get("type", "?")
            lim = fmt_limit(e.get("limit"))
            lines.append(f"  ID {eid}  Lv{lv} {tp}  「{name_tw}」  limit={lim}")
        lines.append("")

    output = "\n".join(lines)
    out_path.write_text(output, encoding="utf-8")
    print(f"\n[完成] 輸出至 {out_path}")
    print(f"       共同差異：{len(diff_entries)} 筆  |  僅 gen：{len(only_gen)}  |  僅 cur：{len(only_cur)}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
