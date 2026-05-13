# -*- coding: utf-8 -*-
"""
parse-enchants.py
將 OptionSet.xml + OptionSet.taiwan.txt 轉換為 enchants.ts 格式的 TypeScript 陣列

使用方式：
    python scripts/parse-enchants.py
    python scripts/parse-enchants.py --xml-path "G:/..." --trans-path "G:/..." --output "src/data/enchants_generated.ts"
"""

import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Optional

# ============================================================
# 預設路徑
# ============================================================
DEFAULT_XML_PATH   = Path(r"G:\補釘測試\mabinogi_all_file_new\data\db\OptionSet.xml")
DEFAULT_TRANS_PATH = Path(r"G:\補釘測試\mabinogi_all_file_new\data\local\xml\OptionSet.taiwan.txt")
DEFAULT_OUTPUT     = Path("src/data/enchants_generated.ts")


# ============================================================
# 能力 ID 標準化表（大小寫不敏感查詢）
# ============================================================
ABILITY_ID_NORMALIZE_MAP: dict[str, str] = {
    # 傷害
    "attmax":              "attack_max",
    "attmin":              "attack_min",
    "wattmax":             "attack_max",
    "wattmin":             "attack_min",
    "rate":                "balance",
    # 魔法
    "magicattack":         "magic_attack",
    "magicdefence":        "magic_defense",
    "magicprotect":        "magic_protection",
    "magicfastcasting":    "magicfastcasting",
    # 防禦
    "def":                 "defense",
    "prot":                "protection",
    "protect":             "protection",
    # 暴擊
    "crit":                "critical",
    "criticaldamage":      "critical_damage",
    "bonusdamage":         "bonus_damage",
    # 生命/魔力/耐力
    "lifemax":             "HP",
    "manamax":             "MP",
    "staminamax":          "SP",
    # 屬性
    "str":                 "STR",
    "str2":                "STR",
    "dex":                 "DEX",
    "int":                 "INT",
    "wil":                 "WIL",
    "will":                "WIL",
    "luk":                 "LUK",
    "luck":                "LUK",
    # 移動速度
    "hurry":               "move_speed",
    # 音樂
    "musicbuff_bonus":     "music_buff_bonus",
    # 鐮刀鏈刃攻擊
    "chainblade_attmax":   "chainblade_attack_max",
    "chainblade_attmin":   "chainblade_attack_min",
}

# ============================================================
# AddBonusOnAlchemy type → ability ID
# ============================================================
ALCHEMY_TYPE_MAP: dict[str, str] = {
    "alchemy_all":   "all_alchemy_damage",
    "alchemy_fire":  "fire_alchemy_damage",
    "alchemy_water": "water_alchemy_damage",
    "alchemy_earth": "earth_alchemy_damage",
    "alchemy_wind":  "wind_alchemy_damage",
}

# ============================================================
# AllowItem 子 pattern → limit[] 名稱（優先由窄到寬）
# ============================================================
ALLOW_LIMIT_RULES: list[tuple[str, list[str]]] = [
    # ── 翅膀 / 袍 ──────────────────────────────────────────
    ("/enchantwing/",                       ["翅膀", "服裝"]),
    ("/xiyangyang/",                        ["服裝"]),
    # ── 樂器 ────────────────────────────────────────────────
    ("/righthand/tool/string/instrument/",  ["絃樂器"]),
    ("/twohand/tool/wind/instrument/",      ["管樂器"]),
    ("/twohand/tool/string/instrument/",    ["絃樂器"]),
    ("elecguitar",                          ["電子吉他"]),
    ("/instrument/",                        ["樂器"]),
    # ── 特定武器 ────────────────────────────────────────────
    ("/twohand/weapon/lance/",              ["騎槍"]),
    ("/twohand/weapon/scythe/",             ["大型鐮刀"]),
    ("dungeonguide_support_item",           ["支援用鎖鏈鐮刃"]),
    ("/chainblade/",                        ["鎖鏈鐮刃"]),
    ("/inverse_transmutator/",              ["鋼瓶"]),
    ("/cylinder_turret/",                   ["鋼瓶"]),
    ("/gun/dualgun/",                       ["雙槍"]),
    ("/twohand/weapon/knuckle/",            ["拳套"]),
    ("/righthand/weapon/wand/",             ["魔杖"]),
    ("/twohand/weapon/staff/",              ["集魔杖"]),
    ("/knuckle/staff/knuckle_staff/",       ["集魔杖"]),
    ("/righthand/weapon/bow",               ["弓"]),
    ("/twohand/weapon/bow",                 ["弓"]),
    ("/righthand/weapon/crossbow/",         ["弩"]),
    ("/righthand/weapon/edged/",            ["單手武器"]),
    ("/righthand/weapon/dreamcatcher/",     ["單手武器"]),
    ("/righthand/weapon/axe/",              ["斧"]),
    ("/twohand/weapon/axe/",                ["斧"]),
    ("/righthand/weapon/blunt/",            ["鈍器"]),
    ("/twohand/weapon/blunt/",              ["鈍器"]),
    ("handle",                              ["手把"]),
    ("/righthand/",                         ["單手武器"]),
    ("/twohand/",                           ["雙手武器"]),
    # ── 盔甲 ────────────────────────────────────────────────
    ("/armor/cloth/",                       ["衣服", "衣物"]),
    ("/armor/agelimit_cloth/",              ["衣物"]),
    ("lightarmor",                          ["輕甲", "輕盔甲"]),
    ("heavyarmor",                          ["重甲", "重盔甲"]),
    # steel 需在 /armor/ 前判斷（金屬手套/靴也含 steel，但這裡先擋 steel armor）
    ("/armor/steel/",                       ["重盔甲"]),
    ("/head/helmet/steel/",                 ["頭部裝備"]),
    ("/hand/gauntlet/steel/",               ["金屬手套"]),
    ("/foot/armorboots/steel/",             ["金屬靴"]),
    # /equip/armor/* 泛路徑涵蓋所有盔甲（含布甲），需在 /armor/ 前處理
    ("/equip/armor/",                       ["衣服", "衣物", "盔甲"]),
    ("/armor/",                             ["盔甲"]),
    # ── 頭 ──────────────────────────────────────────────────
    ("/equip/head/",                        ["頭部裝備"]),
    ("helmet",                              ["頭部裝備"]),
    ("headgear",                            ["頭部裝備"]),
    # ── 手 ──────────────────────────────────────────────────
    ("/equip/hand/",                        ["手套"]),
    ("gauntlet",                            ["金屬手套"]),
    ("ophelia_glove",                       ["手套"]),
    ("agelimit_glove",                      ["手套"]),
    ("glove",                               ["手套"]),
    ("bracelet",                            ["飾品"]),
    # ── 腳 ──────────────────────────────────────────────────
    ("/equip/foot/",                        ["鞋子"]),
    ("armorboots",                          ["金屬靴"]),
    ("agelimit_armorboots",                 ["金屬靴"]),
    ("shoes",                               ["鞋子"]),
    ("agelimit_shoes",                      ["鞋子"]),
    # foot 放在 equip/foot 之後，避免 /foot/ 路徑誤匹配
    ("foot",                                ["腳部裝備"]),
    # ── 飾品 ────────────────────────────────────────────────
    ("accessary",                           ["飾品"]),
    # ── 盾牌 ────────────────────────────────────────────────
    # /equip/lefthand/* 泛路徑→盾牌（需在 /lefthand/shield/ 前，避免被 /equip/ 兜底覆蓋）
    ("/equip/lefthand/",                    ["盾牌"]),
    ("/lefthand/shield/",                   ["盾牌"]),
    # ── 手裏劍 ──────────────────────────────────────────────
    ("shuriken",                            ["手裏劍"]),
    # ── 具名裝備通用後綴（& 模式用；需在對應 path 規則後）─────────
    # 用底線前綴避免誤匹配路徑（e.g. _bow ≠ /weapon/bow/）
    ("_crossbow",                           ["弩"]),          # divine_crossbow_enchant
    ("_dualgun",                            ["雙槍"]),        # divine_dualgun_enchant
    ("_lance",                              ["騎槍"]),        # divine_small_lance_enchant
    ("_bow",                                ["弓"]),          # ruin_bow, banana_bow, archer_bow, disciple_bow
    ("wand",                                ["魔杖"]),        # divine_wand_enchant, hardwand（/weapon/wand/ 已在前）
    ("_staff",                              ["集魔杖"]),      # ruin_staff, disciple_staff
    ("_knuckle",                            ["拳套"]),        # disciple_knuckle, tan_knuckle, ferocious_tormented_knuckle
    ("_cylinder",                           ["鋼瓶"]),        # disciple_cylinder, ferocious_tyrannous_cylinder
    ("_sword",                              ["單手武器"]),    # miku_sword, saber_sword, disciple_sword, divine_bastard_sword_enchant
    ("_blade",                              ["單手武器"]),    # disciple_blade, divine_blade_enchant
    ("_shield",                             ["盾牌"]),        # divine_shield_enchant
    ("_acc",                                ["飾品"]),        # blony_acc, palala_acc
    # ── 特定命名武器/裝備 ───────────────────────────────────
    ("trollblunt",                          ["鈍器"]),
    ("eldra_sword",                         ["單手武器"]),
    ("dustin",                              ["單手武器"]),
    ("spika_set",                           ["盔甲"]),
    ("royal_alchemist_suit",                ["鋼瓶"]),
    ("royal_alchemist_shoes",               ["鞋子"]),
    ("cookcap",                             ["頭部裝備"]),
    ("cooking",                             ["武器"]),
    # ── 費格修斯裝備（泛用） ───────────────────────────────
    ("ferghusious_equip",                   ["武器", "衣服", "手套", "鞋子", "飾品", "頭部裝備"]),
    # ── weapon 通用（放在具體武器之後）────────────────────────
    ("weapon",                              ["武器"]),
    # ── 全裝備（最後兜底）────────────────────────────────────
    ("/equip/",                             ["武器", "衣服", "手套", "鞋子", "飾品", "頭部裝備"]),
]


# ============================================================
# LT 參考 regex
# ============================================================
LT_RE = re.compile(r'_LT\[xml\.optionset\.(\d+)\]')


def load_translations(path: Path) -> dict[str, str]:
    """載入 OptionSet.taiwan.txt，回傳 {id_str: 中文名稱}"""
    text = path.read_text(encoding="utf-8-sig")
    result: dict[str, str] = {}
    for line in text.splitlines():
        if "\t" in line:
            k, v = line.split("\t", 1)
            result[k.strip()] = v.strip()
    print(f"[翻譯] 載入 {len(result)} 筆  ({path.name})")
    return result


def translate_lt(value: str, translations: dict[str, str]) -> str:
    """將 _LT[xml.optionset.XXXX] 替換為中文文字"""
    def replace(m: re.Match) -> str:
        return translations.get(m.group(1), m.group(0))
    return LT_RE.sub(replace, value)


def normalize_id(raw_id: str) -> str:
    """標準化 ability ID（小寫查表，找不到回傳原始值）"""
    return ABILITY_ID_NORMALIZE_MAP.get(raw_id.lower(), raw_id)


def parse_value(val_str: str) -> Optional[tuple[int, int]]:
    """
    解析數值字串，回傳 (min, max)。
    支援格式：+(20~25)、-(3~6)、+12~15（無括號範圍）、+15、-10、15
    回傳 None 若無法解析。
    """
    val_str = val_str.strip()
    # 有括號範圍：+(20~25) 或 -(3~6)
    m = re.match(r'^([+-]?)\((\d+)~(\d+)\)$', val_str)
    if m:
        sign, lo, hi = m.group(1), int(m.group(2)), int(m.group(3))
        if sign == "-":
            return (-hi, -lo)
        else:
            return (lo, hi)
    # 無括號範圍：+12~15 或 12~15
    m = re.match(r'^([+-]?)(\d+)~(\d+)$', val_str)
    if m:
        sign, lo, hi = m.group(1), int(m.group(2)), int(m.group(3))
        if sign == "-":
            return (-hi, -lo)
        else:
            return (lo, hi)
    # 單值格式：+15 或 -10 或 15
    m = re.match(r'^([+-]?\d+)$', val_str)
    if m:
        v = int(m.group(1))
        return (v, v)
    return None


# 數值 pattern：[+-]?(num~num)、[+-]?num~num（無括號）、[+-]?num  (允許浮點)
_VAL = r'[+-]?(?:\(\d+(?:\.\d+)?~\d+(?:\.\d+)?\)|\d+(?:\.\d+)?~\d+(?:\.\d+)?|\d+(?:\.\d+)?)'

# SetParamOnEquip / SetParamonEquip / SetSetItemEffectOnEquip
_FUNC_RE = re.compile(
    r'Set(?:Param|SetItemEffect)[oO]nEquip\s*\(\s*(\w+)\s*,\s*(' + _VAL + r')\s*\)',
    re.I,
)
# AddBonusOnAlchemy
_ALCHEMY_RE = re.compile(
    r'AddBonusOnAlchemy\s*\(\s*(\w+)\s*,\s*(' + _VAL + r')\s*\)',
    re.I,
)


def parse_option_list(option_list: str) -> tuple[list[dict], bool]:
    """
    解析 OptionList 字串，回傳 (effects, personalize)。

    effect 格式：{"id": str, "min": int, "max": int}
    同一 ID 多筆時累加 min/max。
    """
    totals: dict[str, list[int]] = {}  # id -> [sum_min, sum_max]
    personalize = False

    for stmt in option_list.split(";"):
        stmt = stmt.strip()
        if not stmt:
            continue

        # 取得 action 部分（格式：空 : 條件 : action）
        parts = stmt.split(":")
        action = parts[-1].strip() if len(parts) >= 2 else stmt

        # setpersonalize(true)
        if re.search(r'setpersonalize\s*\(\s*true\s*\)', action, re.I):
            personalize = True
            continue

        # SetParamOnEquip / SetSetItemEffectOnEquip
        m = _FUNC_RE.search(action)
        if m:
            raw_id = m.group(1)
            val_str = m.group(2)
            ability_id = normalize_id(raw_id)
            parsed = parse_value(val_str)
            if parsed:
                lo, hi = parsed
                if ability_id in totals:
                    totals[ability_id][0] += lo
                    totals[ability_id][1] += hi
                else:
                    totals[ability_id] = [lo, hi]
            continue

        # AddBonusOnAlchemy(type, value)
        m = _ALCHEMY_RE.search(action)
        if m:
            alchemy_type = m.group(1).lower()
            val_str = m.group(2)
            ability_id = ALCHEMY_TYPE_MAP.get(alchemy_type, alchemy_type)
            parsed = parse_value(val_str)
            if parsed:
                lo, hi = parsed
                if ability_id in totals:
                    totals[ability_id][0] += lo
                    totals[ability_id][1] += hi
                else:
                    totals[ability_id] = [lo, hi]
            continue

    effects = [{"id": k, "min": v[0], "max": v[1]} for k, v in totals.items()]
    return effects, personalize


def split_allow_item(allow_item: str) -> list[str]:
    """
    將 AllowItem 拆解為子 pattern 陣列（以 | 分割，去掉外層括號和空白）
    """
    # 去掉所有括號（對 pattern matching 無影響）
    cleaned = re.sub(r'[()]', ' ', allow_item)
    parts = [p.strip() for p in cleaned.split("|")]
    return [p for p in parts if p]


def allow_item_to_limits(allow_item: str) -> list[str]:
    """
    將 AllowItem 字串轉換為 limit[] 名稱陣列

    支援 | (OR) 和 & (AND) 運算子：
    - | 拆成多個子 pattern，各自產生 limit 並合併
    - & 拆成多個 AND-part，取最具體（最早命中 ALLOW_LIMIT_RULES）的那個結果
    """
    sub_patterns = split_allow_item(allow_item)
    seen: set[str] = set()
    result: list[str] = []

    for sub in sub_patterns:
        # 支援 & (AND) 運算子：取最具體 AND-part 的規則結果
        and_parts = [p.strip() for p in sub.split("&") if p.strip()]
        best_idx = len(ALLOW_LIMIT_RULES)   # 預設：無命中
        best_names: list[str] = []
        for and_part in and_parts:
            for idx, (keyword, names) in enumerate(ALLOW_LIMIT_RULES):
                if keyword in and_part:
                    if idx < best_idx:
                        best_idx = idx
                        best_names = names
                    break  # 只取此 and_part 的第一個命中

        for n in best_names:
            if n not in seen:
                seen.add(n)
                result.append(n)

    return result


def is_old_version(feature: str) -> bool:
    """判斷是否為舊版 feature（含 ! 前綴）"""
    if not feature:
        return False
    return "&!" in feature or feature.startswith("!")


def escape_ts_string(s: str) -> str:
    """轉義 TypeScript 字串中的特殊字元"""
    # 遊戲翻譯檔以字面 \\n 作為換行符號，先轉成 LF，再統一轉義為 \\n escape
    s = s.replace("\\n", "\n")
    s = s.replace("\\", "\\\\")
    s = s.replace('"', '\\"')
    s = s.replace("\n", "\\n")
    s = s.replace("\r", "")
    return s


def format_effect(eff: dict) -> str:
    lo, hi = eff["min"], eff["max"]
    eid = eff["id"]
    if lo == hi:
        return f'{{ id: "{eid}", min: {lo}, max: {hi} }}'
    return f'{{ id: "{eid}", min: {lo}, max: {hi} }}'


def convert(xml_path: Path, trans_path: Path, output_path: Path) -> None:
    # ── 1. 載入翻譯 ──────────────────────────────────────────
    translations = load_translations(trans_path)

    # ── 2. 解析 XML ──────────────────────────────────────────
    print(f"[XML] 解析 {xml_path.name} ...")
    raw = xml_path.read_bytes()
    text = raw.decode("utf-16")
    # 移除 XML 宣告中的 encoding 屬性，避免 ElementTree 二次解碼衝突
    text = re.sub(r'<\?xml[^?]*\?>', '', text, count=1)
    root = ET.fromstring(text)

    # ── 3. 遍歷所有 OptionSet 元素 ───────────────────────────
    records: list[dict] = []
    unknown_allow_items: list[str] = []

    def get_option_sets(element: ET.Element) -> list[ET.Element]:
        """遞迴找出所有 OptionSet 元素"""
        result = []
        if element.tag == "OptionSet":
            result.append(element)
        for child in element:
            result.extend(get_option_sets(child))
        return result

    all_option_sets = get_option_sets(root)
    print(f"[XML] 找到 {len(all_option_sets)} 個 OptionSet 元素")

    for elem in all_option_sets:
        attrib = elem.attrib

        # ── 過濾 ──
        # Usage: 0=接頭, 1=接尾
        try:
            usage = int(attrib.get("Usage", "-1"))
        except ValueError:
            continue
        if usage not in (0, 1):
            continue

        # 跳過舊版 feature
        feature = attrib.get("__feature", "")
        if is_old_version(feature):
            continue

        # 必須有 ID
        try:
            eid = int(attrib["ID"])
        except (KeyError, ValueError):
            continue

        # 跳過技能強化類（AllowItem 是技能路徑，不是裝備路徑）
        allow_item_raw = attrib.get("AllowItem", "")
        if "upper_skill" in allow_item_raw:
            continue

        # ── 欄位提取 ──
        name_en = attrib.get("Name", "")
        local_name_raw  = attrib.get("LocalName", "")
        local_name2_raw = attrib.get("LocalName2", "")
        name_tw  = translate_lt(local_name_raw,  translations)
        name_tw2 = translate_lt(local_name2_raw, translations)

        # 若翻譯後仍是 _LT 格式（找不到），用英文名
        if "_LT[" in name_tw:
            name_tw = name_en
        if "_LT[" in name_tw2:
            name_tw2 = name_en

        option_list_raw = attrib.get("OptionList", "")
        option_desc_raw = attrib.get("OptionDesc", "")
        option_desc     = translate_lt(option_desc_raw, translations)

        try:
            level = int(attrib.get("Level", "1"))
        except ValueError:
            level = 1

        # ── 解析效果 ──
        effects, personalize = parse_option_list(option_list_raw)

        # ── AllowItem → limit[] ──
        limits = allow_item_to_limits(allow_item_raw)
        if not limits and allow_item_raw:
            # 沒有匹配到任何規則
            unknown_allow_items.append(f"  ID={eid}  {allow_item_raw}")
            limits = [f"TODO:{allow_item_raw[:60]}"]

        enchant_type = "prefix" if usage == 0 else "suffix"

        records.append({
            "id":          eid,
            "name_tw":     name_tw,
            "name_en":     name_en,
            "name_tw2":    name_tw2,
            "list":        option_list_raw,
            "desc":        option_desc,
            "level":       level,
            "type":        enchant_type,
            "limit":       limits,
            "effect":      effects,
            "personalize": personalize,
        })

    # 依 ID 排序
    records.sort(key=lambda r: r["id"])
    print(f"[轉換] 有效賦予記錄：{len(records)} 筆")

    # ── 套用手動 patch ───────────────────────────────────────
    patch_path = Path(__file__).with_name("enchants-patches.json")
    if patch_path.exists():
        patch_data = json.loads(patch_path.read_text(encoding="utf-8"))
        patches: dict = patch_data.get("patches", {})
        id_to_rec = {r["id"]: r for r in records}
        applied, skipped = 0, 0
        for id_str, overrides in patches.items():
            # 跳過非數字 key（如範例、註解）
            if not id_str.isdigit():
                continue
            id_val = int(id_str)
            if id_val in id_to_rec:
                id_to_rec[id_val].update(overrides)
                applied += 1
            else:
                print(f"[patch] 警告：ID {id_val} 不存在於生成資料，跳過")
                skipped += 1
        if applied or skipped:
            print(f"[patch] 套用 {applied} 筆修正，{skipped} 筆找不到 ID")

    if unknown_allow_items:
        print(f"\n[警告] 未匹配的 AllowItem pattern（共 {len(unknown_allow_items)} 筆，需手動確認）：")
        for u in unknown_allow_items[:30]:
            print(u)
        if len(unknown_allow_items) > 30:
            print(f"  ... 還有 {len(unknown_allow_items) - 30} 筆")

    # ── 4. 輸出 TypeScript ───────────────────────────────────
    lines: list[str] = []
    lines.append('import type { Enchant, EnchantSource } from "../types/Enchant";')
    lines.append("")
    lines.append("// !! 自動產生，請勿手動修改 !!")
    lines.append("// 來源：OptionSet.xml + OptionSet.taiwan.txt")
    lines.append("// 產生方式：python scripts/parse-enchants.py")
    lines.append("")
    lines.append("export const enchants: Enchant[] = [")

    for r in records:
        lines.append("    {")
        lines.append(f'        id: {r["id"]},')

        tw  = escape_ts_string(r["name_tw"])
        en  = escape_ts_string(r["name_en"])
        tw2 = escape_ts_string(r["name_tw2"])
        lines.append(f'        name: {{ tw: "{tw}", en: "{en}", tw2: "{tw2}" }},')

        list_str = escape_ts_string(r["list"])
        lines.append(f'        list: "{list_str}",')

        desc_str = escape_ts_string(r["desc"])
        lines.append(f'        desc: "{desc_str}",')

        lines.append(f'        level: {r["level"]},')
        lines.append(f'        type: "{r["type"]}",')

        limit_items = ", ".join(f'"{lm}"' for lm in r["limit"])
        lines.append(f'        limit: [{limit_items}],')

        if r["effect"]:
            lines.append("        effect: [")
            for eff in r["effect"]:
                lines.append(f'            {format_effect(eff)},')
            lines.append("        ],")
        else:
            lines.append("        effect: [],")

        lines.append(f'        personalize: {"true" if r["personalize"] else "false"},')

        lines.append("    },")

    lines.append("];")
    lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"\n[完成] 輸出至 {output_path}  （{len(records)} 筆賦予）")


def main() -> None:
    parser = argparse.ArgumentParser(description="OptionSet.xml → enchants_generated.ts")
    parser.add_argument("--xml-path",   default=str(DEFAULT_XML_PATH),   help="OptionSet.xml 路徑")
    parser.add_argument("--trans-path", default=str(DEFAULT_TRANS_PATH), help="OptionSet.taiwan.txt 路徑")
    parser.add_argument("--output",     default=str(DEFAULT_OUTPUT),     help="輸出 .ts 路徑")
    args = parser.parse_args()

    xml_path   = Path(args.xml_path)
    trans_path = Path(args.trans_path)
    output_path = Path(args.output)

    if not xml_path.exists():
        print(f"[錯誤] XML 不存在：{xml_path}", file=sys.stderr)
        sys.exit(1)
    if not trans_path.exists():
        print(f"[錯誤] 翻譯檔不存在：{trans_path}", file=sys.stderr)
        sys.exit(1)

    convert(xml_path, trans_path, output_path)


if __name__ == "__main__":
    main()
