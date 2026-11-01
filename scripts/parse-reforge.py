import re
import json
import math
import os

# 詞條名稱 → 技能 ID 的人工別名表
# 用於彌補 skillNames.ts 與細工/回音詞條命名不一致的少數案例（詞序相反、用字差異等）
SKILL_ALIASES = {
    "精通斧": 23013,  # 精通斧頭
    "連續技能 : 突拳": 24101,
    "連續技能:突拳": 24101,
    "連續技能 : 導電拳擊": 24102,
    "連續技能:導電拳擊": 24102,
    "連續技能 : 狂暴拳擊": 24103,
    "連續技能:狂暴拳擊": 24103,
    "連續技能 : 螺旋勾拳": 24201,
    "連續技能:螺旋勾拳": 24201,
    "連續技能 : 翻跟斗": 24202,  # 技能表作「翻筋斗」
    "連續技能:翻跟斗": 24202,
    "連續技能 : 飛踢": 24301,
    "連續技能:飛踢": 24301,
    "連續技能 : 猛烈突擊": 24302,
    "連續技能:猛烈突擊": 24302,
    "手裏劍精通": 26000,  # 精通手裏劍
    "戰鬥占星術": 27207,  # 精通戰鬥占星術
    "訓練野生動物": 10026,  # 野生動物訓練
    "變身精通": 56001,  # 精通變身
}


def load_skill_index(skill_names_ts_path):
    """從 skillNames.ts 解析出 (技能ID, 繁中名稱) 清單，依名稱長度由長到短排序，
    讓最長（最具體）的技能名稱優先比對，避免短名稱誤判。"""
    with open(skill_names_ts_path, "r", encoding="utf-8") as f:
        src = f.read()
    entries = []
    for m in re.finditer(r'id:\s*(\d+),\s*name:\s*\{[^}]*?tw:\s*"([^"]*)"', src, re.S):
        entries.append((int(m.group(1)), m.group(2)))
    for name, skill_id in SKILL_ALIASES.items():
        entries.append((skill_id, name))
    entries.sort(key=lambda e: -len(e[1]))
    return entries


def find_skill_id(name, skill_index, min_len=2):
    """僅回傳「明顯跟技能相關」的比對結果：詞條名稱以某技能名稱為前綴，
    且詞條名稱不等於技能名稱本身（純屬性如「力量」不視為技能相關）。"""
    for skill_id, tw in skill_index:
        if len(tw) >= min_len and name != tw and name.startswith(tw):
            return skill_id
    return None


def parse_mabi_reforge(file_path, skill_index):
    """解析格式：將一般區間上限設為 maxLevel，最終極限設為 maxLevelBreak"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        return {}

    # 1. 抓取基礎資訊區塊 (名稱、顯示上限、數值、單位、以及機率區塊)
    # 使用 [\s\S]+? 抓取直到下一個詞條開始前的所有內容
    pattern = r"(.+?)\s\(.*?(?:Max|Limit Break) Level\s+(\d+)\s*\)\s*\n\s*([\d\.-]+)\s*~\s*([\d\.-]+)\s*(.+?)\n\nLevel Probability\n([\s\S]+?)(?=\n\n|\Z)"
    matches = re.findall(pattern, content)
    
    data = {}
    for match in matches:
        raw_name, display_lvl, min_val, max_val, unit, prob_block = match
        name = re.sub(r'\[source:\s*\d+\]', '', raw_name).strip()
        
        # 2. 從機率區塊中解析 maxLevel
        # 我們尋找最後一個機率區間之前的那個 Level（即一般上限）
        # 或是直接從機率區塊中尋找包含較高機率（如 5% 或 7%）的最高等級
        prob_lines = prob_block.strip().split('\n')
        
        # 預設值
        final_limit = int(display_lvl)
        normal_max = final_limit
        
        if len(prob_lines) >= 2:
            # 範例：Level 7 ~ Level 20 : 7.1357%
            # 抓取第一行（通常是一般區間）的結束等級
            first_line_match = re.search(r"Level \d+ ~ Level (\d+)", prob_lines[0])
            if first_line_match:
                normal_max = int(first_line_match.group(1))
        
        # 3. 根據公式再次確認突破上限 (無條件進位)
        limit_break_calc = math.ceil(normal_max * 1.25)
        
        entry = {
            "name": name,
            "maxLevel": normal_max,      # 輸出為 20
            "maxLevelBreak": limit_break_calc, # 輸出為 25[cite: 7, 11]
            "stepValue": float(max_val) / final_limit if final_limit != 0 else 0,
            "unit": unit.strip()
        }
        skill_id = find_skill_id(name, skill_index)
        if skill_id is not None:
            entry["skillId"] = skill_id
        data[name] = entry
    return data

def generate_complete_slim_library():
    file_groups = {
        "body": ['cloth.txt'],
        "hat": ['hat.txt'],
        "glove": ['glove.txt'],
        "shoes": ['shoes.txt'],
        "accessory": ['Accessary.txt'],
        "weapon_melee_oh": ['OHAxe.txt'], # 單手近戰  3種一樣
        "THSword":['THSword.txt'], # 雙手近戰（僅劍）
        "weapon_melee_th": ['THAxe.txt', 'THBlunt.txt', 'THSword.txt'], # 雙手近戰(巨人爆裂猛擊專用武器)
        "weapon_range": ['Bow.txt'],    # 遠程武器（弓弩） 2個一樣
        "cylinder":['Cylinder.txt'], # 鋼瓶
        "chainblade":['chainblade.txt'],
        "dualgun": ['dualgun.txt'], # 雙槍
        "healingWand": ['healingWand.txt'], # 治癒魔杖
        "instrument": ['InstrumentLure.txt'], # 樂器
        "knuckle": ['knuckle.txt'], # 拳套
        "lance": ['lance.txt'], # 長槍
        "orb": ['orb.txt'], # 書 水晶球
        "scythe": ['Scythe.txt'], # 鐮刀
        "shield": ['shield.txt'], # 盾牌  盾鋼也在這
        "shuriken": ['shuriken.txt'], # 手裏劍
        "staff": ['staff.txt'], # 法杖
        "triboltWand": ['TriboltWand.txt'], # 三矛魔杖
        "handle": ['handle.txt'], # 把手
    }

    race_map = {
        "human": ["神聖之心", "渾沌之心", "闇影操控", "無限斬擊", "旋風箭"],
        "elf": ["克諾斯", "終極射擊", "魔箭迫擊", "毒雲箭"],
        "giant": ["菲西斯", "嘲諷", "暴風防護", "終焉斬擊", "跺腳", "蜂擁"],
        "human_giant": ["騎槍"],
        "human_elf": ["爆裂箭", "精通遠距離", "穿心箭", "支援箭"]
    }

    skill_index = load_skill_index(os.path.join('..', 'src', 'data', 'skillNames.ts'))

    full_library = {}
    category_name_pools = {cat: [] for cat in file_groups}  # 名稱列表（用於 race 過濾）
    category_data = {cat: {} for cat in file_groups}        # 各部位專屬的完整 entry data
    race_pools = {r: [] for r in race_map}

    for category, files in file_groups.items():
        for filename in files:
            if not os.path.exists(filename): continue
            file_data = parse_mabi_reforge(filename, skill_index)

            for name, attr in file_data.items():
                full_library[name] = attr                    # 仍保留共用 library（供 heavy extra 查詢）
                if name not in category_name_pools[category]:
                    category_name_pools[category].append(name)
                category_data[category][name] = attr        # 記錄此部位的專屬 data
                for race, keywords in race_map.items():
                    if any(kw in name for kw in keywords):
                        if name not in race_pools[race]:
                            race_pools[race].append(name)

    # categories 改存完整 entry list（避免不同部位同名詞條互相覆蓋 maxLevel）
    category_entry_pools = {
        cat: [category_data[cat][name] for name in names]
        for cat, names in category_name_pools.items()
    }

    output = {
        "library": full_library,
        "pools": {
            "categories": category_entry_pools,
            "races": race_pools
        }
    }

    with open('mabi_reforge_slim_with_race.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"解析完成！已整合詞條並正確處理 maxLevel。")

if __name__ == "__main__":
    generate_complete_slim_library()