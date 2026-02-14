/**
 * 娃娃背包資料處理腳本
 * 將 item_bags_enhanced.json 中的娃娃背包資料轉換為結構化格式
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 讀取原始資料
const inputPath = path.join(__dirname, '../src/data/item_bags_enhanced.json');
const outputPath = path.join(__dirname, '../src/data/doll_bags.json');

const rawData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));

// 效果名稱對照表（中文 -> 英文 key）
const effectKeyMap = {
    '最大生命力': 'max_hp',
    '最大魔力值': 'max_mp',
    '最大耐力': 'max_stamina',
    '力量': 'str',
    '敏捷': 'dex',
    '智力': 'int',
    '意志': 'will',
    '幸運': 'luck',
    '最小傷害': 'min_damage',
    '最大傷害': 'max_damage',
    '暴擊率': 'critical_rate',
    '暴擊傷害': 'critical_damage',
    '保護': 'protection',
    '防禦': 'defense',
    '魔法保護': 'magic_protection',
    '魔法防禦': 'magic_defense',
    '魔法攻擊力': 'magic_attack',
    '移動速度': 'move_speed',
    '攻擊速度': 'attack_speed',
    '所有(水/火/風/土)屬性鍊金術傷害': 'alchemy_damage_all',
    '所有(水/火/風/土)屬性煉金術傷害': 'alchemy_damage_all',
    '水屬性鍊金術傷害': 'alchemy_damage_water',
    '火屬性鍊金術傷害': 'alchemy_damage_fire',
    '風屬性鍊金術傷害': 'alchemy_damage_wind',
    '土屬性鍊金術傷害': 'alchemy_damage_earth',
    '音樂增益技能持續時間': 'music_buff_duration',
    '最終傷害': 'final_damage',
    '鍊金術傷害': 'alchemy_damage',
    '煉金術傷害': 'alchemy_damage',
    '戰鬥EXP': 'combat_exp',
    '探索EXP': 'explore_exp',
    '生活EXP': 'life_exp',
    '經驗值': 'exp',
    '經驗': 'exp',
    '終結技傷害': 'finisher_damage',
    '終結技增傷': 'finisher_damage',
    '載入速度減少': 'loading_speed_reduction',
    '載入時間減少': 'loading_time_reduction',
    '受到傷害': 'damage_taken',
    '受傷': 'damage_taken',
    '金幣獲取率': 'gold_acquisition',
    '金幣獲得率': 'gold_acquisition',
    '技能連鎖次數': 'skill_chain_count',
    '普攻遠攻傷害增加': 'normal_ranged_damage',
    '普攻近戰傷害增加': 'normal_melee_damage',
    '弓傷害': 'bow_damage',
    '遠攻連續攻擊次數': 'ranged_chain_count',
    '精靈武器連線獎勵': 'spirit_weapon_bonus',
    '結晶製作成功率': 'crystal_craft_success',
    '合成成功率': 'synthesis_success',
    '分解等級': 'decompose_level',
    '天賦經驗值': 'talent_exp',
};

// 組合屬性解析（如 力量/敏捷/意志）
const combinedStatMap = {
    '力量/敏捷/意志/幸運/防禦': ['str', 'dex', 'will', 'luck', 'defense'],
    '力量/敏捷/智力/意志/幸運': ['str', 'dex', 'int', 'will', 'luck'],
    '敏捷/智力/幸運/保護': ['dex', 'int', 'luck', 'protection'],
    '力量/意志': ['str', 'will'],
    '智力/意志': ['int', 'will'],
    '力量/智力/敏捷/意志/幸運/保護/防禦': ['str', 'int', 'dex', 'will', 'luck', 'protection', 'defense'],
    '保護/防禦': ['protection', 'defense'],
    '魔法保護/魔法防禦': ['magic_protection', 'magic_defense'],
    '最小/最大傷害': ['min_damage', 'max_damage'],
    '最大傷害/魔法防禦/魔法保護': ['max_damage', 'magic_defense', 'magic_protection'],
};

/**
 * 解析背包空間（如 "14X14" -> { width: 14, height: 14 }）
 */
function parseBagInnerSize(description) {
    const match = description.match(/背包空間[:\s]*(\d+)[Xx×](\d+)/);
    if (match) {
        return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10)
        };
    }
    return null;
}

/**
 * 解析召喚時間（如 "召喚時間:150分" -> 150）
 */
function parseSummonDuration(description) {
    const match = description.match(/召喚時間[:\s]*(\d+)/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
}

/**
 * 解析召喚重量（如 "召喚重量:0.3" 或 "召喚重量:1"）
 */
function parseSummonCost(description) {
    const match = description.match(/召喚重量[:\s]*([\d.]+)/);
    if (match) {
        return parseFloat(match[1]);
    }
    return null;
}

/**
 * 解析召喚效果
 * 例如: "最大生命力+150,最大魔力值+150,力量+22,暴擊率+9%"
 */
function parseEffects(description) {
    const effectMatch = description.match(/召喚效果[:\s]*([^\\n]+?)(?:\\n|娃娃收集|$)/);
    if (!effectMatch) {
        return [];
    }

    const effectStr = effectMatch[1].trim();
    const effects = [];

    // 按逗號分割效果
    const effectParts = effectStr.split(/[,，]/);

    for (const part of effectParts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // 解析效果值（支援 +N, +N%, -N, -N%）
        const valueMatch = trimmed.match(/^(.+?)([+-]\d+(?:\.\d+)?)(%)?\s*$/);
        if (!valueMatch) {
            // 嘗試特殊格式
            continue;
        }

        const statName = valueMatch[1].trim();
        const value = parseFloat(valueMatch[2]);
        const isPercent = !!valueMatch[3];

        // 檢查是否為組合屬性
        if (combinedStatMap[statName]) {
            const keys = combinedStatMap[statName];
            for (const key of keys) {
                effects.push({
                    key,
                    name: getStatNameByKey(key),
                    value,
                    isPercent
                });
            }
        } else if (effectKeyMap[statName]) {
            effects.push({
                key: effectKeyMap[statName],
                name: statName,
                value,
                isPercent
            });
        } else {
            // 未知屬性，保留原始名稱
            effects.push({
                key: statName.toLowerCase().replace(/\//g, '_'),
                name: statName,
                value,
                isPercent
            });
        }
    }

    return effects;
}

/**
 * 根據 key 取得屬性名稱
 */
function getStatNameByKey(key) {
    const reverseMap = {
        'str': '力量',
        'dex': '敏捷',
        'int': '智力',
        'will': '意志',
        'luck': '幸運',
        'protection': '保護',
        'defense': '防禦',
        'magic_protection': '魔法保護',
        'magic_defense': '魔法防禦',
        'min_damage': '最小傷害',
        'max_damage': '最大傷害',
    };
    return reverseMap[key] || key;
}

/**
 * 解析娃娃收集分類
 */
function parseAutoPickList(description) {
    const match = description.match(/娃娃收集(?:分類|類別)[:\s]*([^\\n]+?)(?:\\n|$)/);
    if (match) {
        return match[1].split(/[,，]/).map(s => s.trim()).filter(s => s);
    }
    return [];
}

/**
 * 解析 inv_size（如 "4x2" -> { width: 4, height: 2 }）
 */
function parseInvSize(invSize) {
    const match = invSize.match(/(\d+)[xX×](\d+)/);
    if (match) {
        return {
            width: parseInt(match[1], 10),
            height: parseInt(match[2], 10)
        };
    }
    return { width: 0, height: 0 };
}

/**
 * 判斷是否為娃娃背包
 */
function isDollBag(item) {
    // 根據 category 或 tags 判斷
    if (item.category && item.category.includes('autobot')) {
        // 檢查描述中是否有娃娃背包資訊
        if (item.description && item.description.includes('娃娃背包資訊')) {
            return true;
        }
        // 或者名稱包含娃娃背包
        if (item.name && item.name.includes('娃娃背包')) {
            return true;
        }
        // 或者 tags 包含人偶袋子
        if (item.tags && item.tags.includes('人偶袋子')) {
            return true;
        }
    }
    return false;
}

/**
 * 處理單個娃娃背包資料
 */
function processDollBag(item) {
    const invSize = parseInvSize(item.inv_size || '');
    const innerSize = parseBagInnerSize(item.description || '');
    const summonDuration = parseSummonDuration(item.description || '');
    const summonCost = parseSummonCost(item.description || '');
    const effects = parseEffects(item.description || '');
    const autoPickList = parseAutoPickList(item.description || '');

    // 從 xml 中提取 bagshape（備用）
    let xmlInnerSize = null;
    if (item.xml) {
        const bagshapeMatch = item.xml.match(/bagshape="(\d+)\/(\d+)"/);
        if (bagshapeMatch) {
            xmlInnerSize = {
                width: parseInt(bagshapeMatch[1], 10),
                height: parseInt(bagshapeMatch[2], 10)
            };
        }
    }

    return {
        id: item.id,
        name: item.name,
        image: item.file_inv_image,
        bag_width: invSize.width,
        bag_height: invSize.height,
        bag_inner_width: innerSize?.width || xmlInnerSize?.width || 0,
        bag_inner_height: innerSize?.height || xmlInnerSize?.height || 0,
        summon_cost: summonCost,
        summon_duration: summonDuration,
        effects: effects,
        auto_pick_list: autoPickList,
        tags: item.tags || [],
        description_raw: item.description,
        price_buy: item.price_buy ? parseInt(item.price_buy, 10) : 0,
    };
}

// 主處理流程
console.log('開始處理娃娃背包資料...');

const dollBags = rawData
    .filter(isDollBag)
    .map(processDollBag);

console.log(`共找到 ${dollBags.length} 個娃娃背包`);

// 寫入輸出檔案
fs.writeFileSync(outputPath, JSON.stringify(dollBags, null, 2), 'utf-8');
console.log(`已輸出至: ${outputPath}`);

// 輸出一些範例以供驗證
console.log('\n=== 範例輸出 ===');
console.log(JSON.stringify(dollBags[0], null, 2));
if (dollBags.length > 1) {
    console.log('\n--- 另一個範例 ---');
    // 找一個有較多效果的
    const complexBag = dollBags.find(b => b.effects.length > 5) || dollBags[1];
    console.log(JSON.stringify(complexBag, null, 2));
}
