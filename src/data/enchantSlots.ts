/**
 * 賦予的「武器類型／部位」篩選（賦予快速檢視與裝備效益換算共用）
 * 每個職業能用的武器類型不同，用 QUICK_WEAPON_OPTIONS 的 label 指定即可（見 ValueProfile.weaponTypes）。
 */
import type { Enchant } from "../types/Enchant";

export type WeaponCategory = "近距離" | "遠距離" | "魔法" | "音樂";

export interface WeaponOpt {
    label: string; // 內部 key（同時為能力對照表的鍵）
    display?: string; // 下拉顯示名稱，預設 = label
    category: WeaponCategory;
    limits: string[];
    topN?: number; // 每格最多顯示幾筆，預設 5
    strictFilter?: boolean; // true = 只顯示有相關能力的賦予，不包含中性賦予
}

export const QUICK_WEAPON_OPTIONS: WeaponOpt[] = [
    // 近距離
    {
        label: "雙持單手武器",
        category: "近距離",
        limits: ["武器", "近距離武器", "單手武器", "鈍器", "斧", "斧頭"],
        strictFilter: true,
    },
    {
        label: "單手武器+盾",
        category: "近距離",
        limits: ["武器", "近距離武器", "單手武器", "鈍器", "斧", "斧頭"],
        strictFilter: true,
    },
    {
        label: "雙手武器",
        category: "近距離",
        limits: ["武器", "近距離武器", "雙手武器", "雙手斧武器"],
        strictFilter: true,
    },
    {
        label: "雙手武器+盾",
        category: "近距離",
        limits: ["武器", "近距離武器", "雙手武器", "雙手斧武器"],
        strictFilter: true,
    },
    { label: "拳套", category: "近距離", limits: ["武器", "近距離武器", "雙手武器", "拳套"], strictFilter: true },
    { label: "騎槍", category: "近距離", limits: ["武器", "近距離武器", "雙手武器", "騎槍"], strictFilter: true },
    { label: "手把", category: "近距離", limits: ["武器", "手把"], strictFilter: true },
    {
        label: "鎖鏈",
        category: "近距離",
        limits: ["武器", "近距離武器", "雙手武器", "鎖鏈鐮刃", "支援用鎖鏈鐮刃"],
        strictFilter: true,
    },
    // 遠距離
    { label: "弓/弩", category: "遠距離", limits: ["武器", "弓", "弩"], strictFilter: true },
    { label: "雙槍", category: "遠距離", limits: ["武器", "雙槍"], strictFilter: true },
    { label: "手裏劍", category: "遠距離", limits: ["武器", "手裏劍", "手裡劍"], strictFilter: true },
    // 魔法
    { label: "魔杖", display: "短杖", category: "魔法", limits: ["魔杖", "單手魔杖、集魔杖"], strictFilter: true },
    {
        label: "集魔杖",
        display: "長杖/集魔杖",
        category: "魔法",
        limits: ["集魔杖", "單手魔杖、集魔杖"],
        strictFilter: true,
    },
    { label: "鐮刀", category: "魔法", limits: ["大型鐮刀"], strictFilter: true },
    {
        label: "鋼瓶",
        display: "煉金",
        category: "魔法",
        limits: ["鋼瓶", "兇猛暴君鋼瓶", "塔座鋼瓶", "福音鋼瓶"],
        strictFilter: true,
    },
    { label: "治癒杖", category: "魔法", limits: ["魔杖", "單手魔杖、集魔杖"], strictFilter: true },
    // 音樂
    { label: "音樂", category: "音樂", limits: ["樂器"], topN: 3, strictFilter: true },
];

export const WEAPON_CATEGORIES = [...new Set(QUICK_WEAPON_OPTIONS.map((w) => w.category))];

// 各武器類型「相關」能力 ID 集合
const MAGIC_IDS = new Set([
    "magic_attack",
    "MagicAttack",
    "magic_damage",
    "casting_speed",
    "magicice",
    "magicfire",
    "magiclightning",
]);
const ALCHEMY_IDS = new Set([
    "fire_alchemy_damage",
    "water_alchemy_damage",
    "earth_alchemy_damage",
    "wind_alchemy_damage",
    "all_alchemy_damage",
    "AlchemyElementalBonus",
    "elemental_wave_bonus",
]);
const PHYS_DMG_IDS = new Set(["attack_max", "AttMax", "Attmax", "wAttMax"]);
const CHAIN_IDS = new Set(["chainblade_attack_max", "chainblade_attack_min"]);
const MUSIC_IDS = new Set(["music_buff_bonus", "musicbuff_bonus", "musicbuff_duration"]);

// 所有武器專屬能力的聯集（用於判斷賦予是否「中性」）
export const ANY_EXCLUSIVE = new Set([...PHYS_DMG_IDS, ...MAGIC_IDS, ...ALCHEMY_IDS, ...CHAIN_IDS, ...MUSIC_IDS]);

// 物理系武器共用的攻擊/傀儡能力
const PHYS_PRIMARY = ["attack_max", "AttMax", "Attmax", "wAttMax"];
const PHYS_RELEVANT = [
    ...PHYS_DMG_IDS,
    "critical_damage",
    "criticaldamage",
    "critical_cap_increase",
    "lance_piercing",
    "bonus_damage",
    "bonusdamage",
    "ArcheryTalentAttMax",
    "CombatTalentAttMax",
    "arcana_skill_bonus_damage_rate",
];
const MARIONETTE_PRIMARY = ["marionette_attack_max"];
const MARIONETTE_RELEVANT = [
    "marionette_attack_max",
    ...PHYS_DMG_IDS,
    "lance_piercing",
    "arcana_skill_bonus_damage_rate",
];
// 共用 PHYS 設定的物理武器（手把為傀儡，單獨處理）
export const PHYS_WEAPON_LABELS = [
    "雙持單手武器",
    "單手武器+盾",
    "雙手武器",
    "雙手武器+盾",
    "拳套",
    "騎槍",
    "鎖鏈",
    "弓/弩",
    "雙槍",
    "手裏劍",
];

// 物理系「接尾」排除的例外賦予（舊版重複賦予）
export const PHYS_SUFFIX_EXCLUDE_IDS = new Set([30931]);
// 物理系「飾品」接尾強制納入的轉蛋特規品（原始 limit 標示為雙手武器，但實際可用於飾品）
export const PHYS_ACCESSORY_SUFFIX_GACHA_IDS = new Set([30619, 30620, 30921, 30927]);
export const isGachaSpecial = (id: number): boolean => PHYS_ACCESSORY_SUFFIX_GACHA_IDS.has(id);

// 各武器類型「主要數值」ID（排序用）
export const PRIMARY_IDS: Record<string, string[]> = {
    魔杖: ["magic_attack", "MagicAttack", "magic_damage"],
    集魔杖: ["magic_attack", "MagicAttack", "magic_damage"],
    鋼瓶: [
        "all_alchemy_damage",
        "fire_alchemy_damage",
        "water_alchemy_damage",
        "earth_alchemy_damage",
        "wind_alchemy_damage",
        "AlchemyElementalBonus",
    ],
    鐮刀: ["magic_attack", "MagicAttack", "magic_damage"],
    音樂: ["music_buff_bonus"],
    手把: MARIONETTE_PRIMARY,
    治癒杖: ["healing_skill"],
};
PHYS_WEAPON_LABELS.forEach((l) => (PRIMARY_IDS[l] = PHYS_PRIMARY));

// 各武器類型「顯示」能力 ID（效果摘要只顯示此集合內的屬性）
export const RELEVANT_IDS: Record<string, Set<string>> = {
    魔杖: new Set([...MAGIC_IDS, "arcana_skill_bonus_damage_rate"]),
    集魔杖: new Set([...MAGIC_IDS, "arcana_skill_bonus_damage_rate"]),
    鋼瓶: new Set([...ALCHEMY_IDS, "arcana_skill_bonus_damage_rate"]),
    鐮刀: new Set([
        "magic_attack",
        "MagicAttack",
        "magic_damage",
        "lance_piercing",
        "arcana_skill_bonus_damage_rate",
    ]),
    音樂: new Set(["music_buff_bonus"]),
    手把: new Set(MARIONETTE_RELEVANT),
    治癒杖: new Set(["healing_skill"]),
};
PHYS_WEAPON_LABELS.forEach((l) => (RELEVANT_IDS[l] = new Set(PHYS_RELEVANT)));

export interface SlotDef {
    label: string;
    isWeapon?: boolean;
    isOffhand?: boolean;
    exclusive?: boolean; // true = 只吃符合 limit 的賦予，不含中性（無限制）賦予
    limits: string[];
}

// 各武器類型對應的副手裝備限制（無此 key = 該武器無副手，不顯示副手列）
export const OFFHAND_LIMITS: Record<string, string[]> = {
    魔杖: ["魔導書、水晶球"],
    鐮刀: ["魔導書、水晶球"],
    鋼瓶: ["盾牌", "神聖盾牌", "鋼瓶", "兇猛暴君鋼瓶", "塔座鋼瓶", "福音鋼瓶"],
    "單手武器+盾": ["盾牌", "神聖盾牌"],
    "雙手武器+盾": ["盾牌", "神聖盾牌"],
};

export const QUICK_VIEW_SLOTS: SlotDef[] = [
    { label: "武器", isWeapon: true, limits: [] },
    { label: "副手", isOffhand: true, limits: [] },
    { label: "飾品", limits: ["飾品"] },
    { label: "頭", limits: ["頭部裝備", "頭", "頭部"] },
    {
        label: "身",
        limits: [
            "衣服",
            "衣物",
            "布衣",
            "皮質盔甲",
            "輕甲",
            "輕盔甲",
            "重甲",
            "重盔甲",
            "盔甲",
            "衣服、盔甲、手套、鞋子",
        ],
    },
    { label: "手", limits: ["手套", "金屬手套", "重盔甲手套", "手部裝備", "手", "衣服、盔甲、手套、鞋子"] },
    { label: "腳", limits: ["鞋子", "金屬靴", "腳", "腳部裝備", "衣服、盔甲、手套、鞋子"] },
    { label: "袍/翅膀", exclusive: true, limits: ["特定的翅膀", "特定翅膀", "翅膀", "服裝"] },
    { label: "月餅", exclusive: true, limits: ["穆利亞斯的遺物"] },
];


/** 武器類型有副手欄位的話才有「副手」部位 */
export const slotsForWeapon = (weaponLabel: string, hideRobe = false): SlotDef[] =>
    QUICK_VIEW_SLOTS.filter((slot) => !(hideRobe && slot.label === "袍/翅膀")).filter((slot) => !(slot.isOffhand && !OFFHAND_LIMITS[weaponLabel]));

export interface SlotFilterOptions {
    /** 過濾綁定專用的賦予 */
    noPersonalize?: boolean;
    /** true = 只留與該武器類型相關的賦予（快速檢視用）；false = 只看裝備限制（效益換算用，之後由效益值篩選） */
    relevantOnly?: boolean;
}

/** 某個武器類型下，該部位可以裝的賦予 */
export function enchantsForSlot(allEnchants: Enchant[], slot: SlotDef, weaponLabel: string, opts: SlotFilterOptions = {}): Enchant[] {
    const weaponOpt = QUICK_WEAPON_OPTIONS.find((w) => w.label === weaponLabel);
    const limits = slot.isWeapon ? (weaponOpt?.limits ?? []) : slot.isOffhand ? (OFFHAND_LIMITS[weaponLabel] ?? []) : slot.limits;
    const noPersonalize = opts.noPersonalize ?? false;

    // [""] 代表無裝備限制，應顯示於所有部位（exclusive 部位除外，只吃符合 limit 者）
    const isNoRestriction = (e: Enchant) => e.limit.length === 0 || (e.limit.length === 1 && e.limit[0] === "");
    let applicable = allEnchants.filter((e) =>
        slot.exclusive ? e.limit.some((l) => limits.includes(l)) : isNoRestriction(e) || e.limit.some((l) => limits.includes(l)),
    );

    // 篩選：strictFilter = 只顯示含相關能力的賦予；一般模式 = 有相關能力 OR 完全中性
    const relevant = RELEVANT_IDS[weaponLabel];
    if (opts.relevantOnly && relevant) {
        if (weaponOpt?.strictFilter) {
            applicable = applicable.filter((e) => e.effect.some((eff) => relevant.has(eff.id)));
        } else {
            applicable = applicable.filter((e) => e.effect.some((eff) => relevant.has(eff.id)) || !e.effect.some((eff) => ANY_EXCLUSIVE.has(eff.id)));
        }
    }

    // 排除無法提取魔力賦予的項目
    applicable = applicable.filter((e) => !e.list.includes("no_enchant_extract(true)"));
    if (noPersonalize) applicable = applicable.filter((e) => !e.personalize);

    // 物理系例外：排除舊版重複賦予／飾品欄強制納入轉蛋特規品
    if (PHYS_WEAPON_LABELS.includes(weaponLabel)) {
        applicable = applicable.filter((e) => !(e.type === "suffix" && PHYS_SUFFIX_EXCLUDE_IDS.has(e.id)));
        if (slot.label === "飾品") {
            const existingIds = new Set(applicable.map((e) => e.id));
            const gachaExtras = allEnchants.filter(
                (e) => PHYS_ACCESSORY_SUFFIX_GACHA_IDS.has(e.id) && !existingIds.has(e.id) && !(noPersonalize && e.personalize),
            );
            applicable = [...applicable, ...gachaExtras];
        }
    }
    return applicable;
}

// 格式化賦予等級顯示 (1-6 => F-A, 7-15 => 9-1)
export const formatRank = (level: number): string => {
    if (level >= 1 && level <= 6) {
        // 1=>F, 2=>E, 3=>D, 4=>C, 5=>B, 6=>A
        const ranks = ["F", "E", "D", "C", "B", "A"];
        return ranks[level - 1];
    } else if (level >= 7 && level <= 15) {
        // 7=>9, 8=>8, ..., 15=>1
        return String(16 - level);
    } else {
        // 超出範圍，直接顯示數字
        return String(level);
    }
};
