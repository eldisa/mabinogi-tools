/**
 * 治癒計算機 — 聖歌手系「治癒的手 / 組隊治療（救贖回聲）」數值計算
 *
 * 演算法還原自 itsmabi.com（力量的힐량 계산기）前端程式碼（Next.js 打包後的
 * client bundle），非本站原創研究，資料如有出入請以遊戲內實測為準。
 */

export interface RangeValue {
    min: number;
    max: number;
}

// ===== 稱號 =====
export interface TitleOption {
    id: string;
    name: string;
    healingEffectPercent: number;
}

// 台灣伺服器目前僅實裝「組隊治癒大師」一項
export const PRIMARY_TITLES: TitleOption[] = [
    { id: "none", name: "選擇無", healingEffectPercent: 0 },
    { id: "party_healing_master", name: "組隊治癒大師", healingEffectPercent: 20 },
];

export const SECONDARY_TITLES: TitleOption[] = [
    { id: "none", name: "選擇無", healingEffectPercent: 0 },
    { id: "ohard", name: "歐哈德", healingEffectPercent: 20 },
    { id: "special_white_healer", name: "特殊白色的治癒師", healingEffectPercent: 18 },
    { id: "special_cotton_candy", name: "特別棉花糖", healingEffectPercent: 18 },
    { id: "bloni", name: "布蘿妮", healingEffectPercent: 17 },
    { id: "lili", name: "網路勝利組/莉莉", healingEffectPercent: 17 },
    { id: "pina_friend", name: "畢娜的朋友", healingEffectPercent: 15 },
    { id: "feris", name: "菲莉絲/Re:ZERO", healingEffectPercent: 10 },
    { id: "yuki", name: "網路勝利組/由紀", healingEffectPercent: 10 },
];

// ===== 武器 =====
export interface WeaponOption {
    id: string;
    name: string;
    healingEffectPercent: number;
    partyHealingEffectPercent: number;
    hasHealWandBonus: boolean;
    hasMasterGrade: boolean;
    hasVariableHealingEfficiency?: boolean;
}

export const WEAPONS: WeaponOption[] = [
    { id: "none", name: "選擇無", healingEffectPercent: 0, partyHealingEffectPercent: 0, hasHealWandBonus: false, hasMasterGrade: false },
    { id: "healing_wand_basic", name: "治癒魔杖 (+5)", healingEffectPercent: 0, partyHealingEffectPercent: 0, hasHealWandBonus: true, hasMasterGrade: false },
    { id: "nightbringer_savior", name: "暗夜使者救贖者", healingEffectPercent: 5, partyHealingEffectPercent: 5, hasHealWandBonus: true, hasMasterGrade: false, hasVariableHealingEfficiency: true },
    { id: "soul_liberate_healing_wand", name: "靈魂解放者治癒魔杖", healingEffectPercent: 10, partyHealingEffectPercent: 10, hasHealWandBonus: true, hasMasterGrade: true },
];

/** 武器等級加成（僅「靈魂解放者治癒魔杖」等 hasMasterGrade 武器適用） */
export const WEAPON_GRADE_BONUS: Record<string, number> = {
    normal: 0,
    rare: 0,
    elite: 0,
    epic: 0,
    master: 112,
};
export const WEAPON_GRADE_OPTIONS = [
    { id: "normal", name: "一般" },
    { id: "rare", name: "稀有" },
    { id: "elite", name: "精英" },
    { id: "epic", name: "史詩" },
    { id: "master", name: "大師" },
];

export interface UpgradeOption {
    id: string;
    name: string;
    healingEffectPercent: number;
    partyHealingEffectPercent: number;
}

/** 一般武器的「改造獎勵」 */
export const WEAPON_UPGRADE_OPTIONS: UpgradeOption[] = [
    { id: "none", name: "選擇無", healingEffectPercent: 0, partyHealingEffectPercent: 0 },
    { id: "healing_30", name: "治癒 +30%", healingEffectPercent: 30, partyHealingEffectPercent: 0 },
    { id: "party_healing_30", name: "組隊治療 +30%", healingEffectPercent: 0, partyHealingEffectPercent: 30 },
    { id: "healing_20_party_10", name: "治癒 +20%、組隊治療 +10%", healingEffectPercent: 20, partyHealingEffectPercent: 10 },
    { id: "party_20_healing_10", name: "組隊治療 +20%、治癒 +10%", healingEffectPercent: 10, partyHealingEffectPercent: 20 },
];

/** 夜行者救世者專用的「改造獎勵」 */
export const NIGHTBRINGER_UPGRADE_OPTIONS: UpgradeOption[] = [
    { id: "none", name: "選擇無", healingEffectPercent: 0, partyHealingEffectPercent: 0 },
    { id: "nightbringer_upgrade", name: "治癒 +5%、組隊治療 +5%", healingEffectPercent: 5, partyHealingEffectPercent: 5 },
];

// ===== 遺物 =====
export const RELIC_ENCHANT_OPTIONS = [
    { healingPercent: 0, label: "無" },
    { healingPercent: 5, label: "禮物（治癒 +5%）" },
    { healingPercent: 10, label: "禮物 ×2（治癒 +10%）" },
    { healingPercent: 15, label: "禮物 ×3（治癒 +15%）" },
];

// ===== 精靈武器（육성/연마/제어/실체화）=====
/** 精靈育成：等級 0~5，加成為「固定值」，直接加進基礎值 */
export const SPIRIT_YUKSUNG_FLAT = [0, 2, 4, 6, 8, 10];
/** 精靈研磨：等級 0~5，加成為「百分比」，僅在非舊精靈武器時生效 */
export const SPIRIT_YEONMA_PERCENT = [0, 1, 2, 3, 4, 5];
/** 精靈操控：等級 0~5，加成為「固定值」，加進最大值那一組的基礎值 */
export const SPIRIT_JEJE_FLAT = [0, 3, 6, 9, 12, 15];
/** 精靈實體化強化階段：等級 0~5，加成為「百分比」，疊乘進精靈倍率 */
export const SPIRIT_MATERIALIZE_PERCENT = [0, 3, 6, 9, 12, 15];

/** 特別改造階段（僅夜行者救世者 / 靈魂解放者治癒魔杖適用）加成百分比 */
export const SPECIAL_UPGRADE_STAGE_PERCENT = [0, 2, 3, 5, 7, 10, 13, 16, 20];

// ===== 細工 固定值加成表 =====
/** 治癒魔杖「組隊治療生命力恢復」細工：等級 0~25 */
export const WAND_PARTY_HEALING_REFORGE = Array.from({ length: 26 }, (_, l) => (l === 0 ? 0 : Math.floor(2.5 * l)));
/** 衣服「治癒生命力恢復」細工：等級 0~25 */
export const ARMOR_HEALING_REFORGE = Array.from({ length: 26 }, (_, l) => (l === 0 ? 0 : 24 + l));
/** 飾品「組隊治療細工」：等級 0~4 */
export const ACCESSORY_PARTY_HEALING_REFORGE = [0, 2.5, 5, 7.5, 10];
/** 飾品「治療細工」：等級 0~4 */
export const ACCESSORY_HEALING_REFORGE = [0, 25, 26, 27, 28];

// ===== 額外微縮模型（엑스트라 미니어처）=====
export const HEALING_MINIATURES = [
    { id: "none", name: "無", healingEffectPercent: 0 },
    { id: "flower_extra_miniature", name: "花朵額外農場模型", healingEffectPercent: 2 },
];

// ===== 下拉選單顯示用選項（等級 → 實際加成數值，直接由對照表換算，確保單一資料來源） =====
export interface LevelOption {
    value: number;
    label: string;
}

const BREAKTHROUGH = "（突破限定）";

export const SPECIAL_UPGRADE_STAGE_OPTIONS: LevelOption[] = SPECIAL_UPGRADE_STAGE_PERCENT.map((pct, i) => ({
    value: i,
    label: i === 0 ? "無" : `${i}階 (+${pct}%)`,
}));

/** 武器 組隊治療細工：21~25 級為突破限定 */
/** 由高到低排序的下拉選項：「無」固定在最上方，其餘依數值由高到低排列 */
function descendingLevelOptions(count: number, labelFor: (level: number) => string): LevelOption[] {
    return [
        { value: 0, label: "無" },
        ...Array.from({ length: count }, (_, i) => count - i).map((level) => ({ value: level, label: labelFor(level) })),
    ];
}

/** 依細工固定值對照表由高到低排序，可標記突破限定的門檻等級 */
function descendingReforgeOptions(flats: number[], breakthroughFrom: number): LevelOption[] {
    return [
        { value: 0, label: "無" },
        ...flats
            .map((flat, i) => ({ value: i, label: `${i}級 (+${flat})${i >= breakthroughFrom ? BREAKTHROUGH : ""}` }))
            .slice(1)
            .reverse(),
    ];
}

/** 武器 組隊治療細工：21~25 級為突破限定 */
export const WAND_REFORGE_OPTIONS: LevelOption[] = descendingReforgeOptions(WAND_PARTY_HEALING_REFORGE, 21);

/** 身體 治癒細工：21~25 級為突破限定 */
export const ARMOR_REFORGE_OPTIONS: LevelOption[] = descendingReforgeOptions(ARMOR_HEALING_REFORGE, 21);

/** 飾品 組隊治療細工：4 級為突破限定 */
export const ACCESSORY_PARTY_REFORGE_OPTIONS: LevelOption[] = descendingReforgeOptions(ACCESSORY_PARTY_HEALING_REFORGE, 4);

/** 飾品 治療細工：4 級為突破限定 */
export const ACCESSORY_HEALING_REFORGE_OPTIONS: LevelOption[] = descendingReforgeOptions(ACCESSORY_HEALING_REFORGE, 4);

export const ERG_RECOVERY_OPTIONS: LevelOption[] = descendingLevelOptions(20, (v) => `+${v}`);

export const ERG_HEAL_EFFICIENCY_OPTIONS: LevelOption[] = descendingLevelOptions(20, (v) => `+${v}%`);

export const DARK_ERG_OPTIONS: LevelOption[] = descendingLevelOptions(50, (v) => `${v}級 (+${(0.5 * v).toFixed(1)}%)`);

/** 護身符 治癒效果%：當前版本極限 12%（未實裝） */
export const AMULET_HEALING_OPTIONS: LevelOption[] = descendingLevelOptions(12, (v) => `+${v}%`);

/** 遺物 · 救贖回聲%：當前版本極限 10% */
export const RELIC_GUME_OPTIONS: LevelOption[] = descendingLevelOptions(10, (v) => `+${v}%`);

/** 圖騰 治癒效果%：當前版本極限 10% */
export const TOTEM_HEALING_OPTIONS: LevelOption[] = descendingLevelOptions(10, (v) => `+${v}%`);

// ===== 裝備賦予（접두／접미 인챈트）：治癒效果% =====
function makeEnchantOptions(name: string, min: number, max: number): LevelOption[] {
    const opts: LevelOption[] = [{ value: 0, label: "無" }];
    for (let v = max; v >= min; v--) {
        opts.push({ value: v, label: `${name} (+${v}%)` });
    }
    return opts;
}

export const ACCESSORY_PREFIX_ENCHANT_OPTIONS = makeEnchantOptions("贖罪的", 2, 6);
export const ACCESSORY_SUFFIX_ENCHANT_OPTIONS = makeEnchantOptions("旅程", 2, 6);
export const HEAD_PREFIX_ENCHANT_OPTIONS = makeEnchantOptions("救濟的", 1, 7);
export const HEAD_SUFFIX_ENCHANT_OPTIONS = makeEnchantOptions("恩寵", 1, 7);
// 身體 prefix 有「慈悲的」（固定 +10%）與「包覆的」（+1~+7%）兩種可能賦予
export const BODY_PREFIX_ENCHANT_OPTIONS: LevelOption[] = [
    { value: 0, label: "無" },
    { value: 10, label: "慈悲的 (+10%)" },
    ...makeEnchantOptions("包覆的", 1, 7).slice(1),
];
export const BODY_SUFFIX_ENCHANT_OPTIONS = makeEnchantOptions("安息", 1, 7);
export const HAND_PREFIX_ENCHANT_OPTIONS = makeEnchantOptions("誓約的", 1, 7);
export const HAND_SUFFIX_ENCHANT_OPTIONS = makeEnchantOptions("渴望", 1, 7);
export const FOOT_PREFIX_ENCHANT_OPTIONS = makeEnchantOptions("誓約的", 1, 7);
export const FOOT_SUFFIX_ENCHANT_OPTIONS = makeEnchantOptions("渴望", 1, 7);

// ===== 玩家全部設定 =====
export interface HealCalcSettings {
    magicAttack: number;
    sevaInt: number;
    /** 聖歌手連結 10 階：智力／遺物加成需要此連結才會套用 */
    hasSaintBardLink: boolean;

    primaryTitleId: string;
    secondaryTitleId: string;

    weaponId: string;
    weaponGrade: string;
    weaponUpgradeOptionId: string;
    /** 夜行者救世者專用：治癒效率 %（可變動） */
    nightbringerHealingEfficiency: number;
    wandReforgeLevel: number; // 治癒魔杖 派對治癒細工等級 0~25
    darkErgLevel: number; // 黑暗Erg等級，每級 +0.5% 治癒/派對治癒效果

    armorReforgeLevel: number; // 衣服 治癒細工等級 0~25
    /** 防具四件套裝效果「治癒強化」是否已發動（+20%） */
    hasHealingEnhanceSet: boolean;

    accessory1PartyHealingLevel: number; // 0~4
    accessory1HealingLevel: number; // 0~4
    accessory2PartyHealingLevel: number;
    accessory2HealingLevel: number;

    /** 聖水 治癒效果% 總和（武器/副手/防具四件/飾品二件，共 8 個部位，各部位最高各 10%） */
    holyWaterPercent: number;

    // 裝備賦予（접두/접미 인챈트）：治癒效果%
    accessoryPrefixEnchantPercent: number;
    accessorySuffixEnchantPercent: number;
    headPrefixEnchantPercent: number;
    headSuffixEnchantPercent: number;
    bodyPrefixEnchantPercent: number;
    bodySuffixEnchantPercent: number;
    handPrefixEnchantPercent: number;
    handSuffixEnchantPercent: number;
    footPrefixEnchantPercent: number;
    footSuffixEnchantPercent: number;

    amuletHealingPercent: number;

    relicGumeEffect: number; // 救贖回聲 %
    relicEnchantHealingPercent: number; // 接尾詞附魔 %

    brireheHealingPercent: number; // 布里萊赫的硬幣 治癒效果 %
    totemHealingEffect: number; // 圖騰 治癒效果 %
    arcanaAwakeningHealingPercent: number; // 奧秘覺醒獎勵 %
    healingMiniatureId: string;

    hasJeongwhaGodong: boolean; // 淨化悸動啟動中 (+20%)
    specialUpgradeStage: number; // 0~8，特別改造階段（夜行者/靈魂解放者系武器適用）

    ergRecovery: number; // Erg 魔法回復力（直接加進基礎值）
    ergHealEfficiency: number; // Erg 治癒效率 %

    spiritYuksungLevel: number; // 精靈育成 0~5
    spiritYeonmaLevel: number; // 精靈研磨 0~5
    spiritJejeLevel: number; // 精靈操控 0~5
    isSpiritImplementationActive: boolean; // 精靈實體化
    spiritMatBuffLevel: number; // 精靈實體化強化階段 0~5

    oghamHealingMaxRecovery: number; // 符文效果：治癒生命力最大回復量增加（固定值）
    oghamPartyHealingMaxRecovery: number; // 符文效果：組隊治療生命力最大回復量增加（固定值）
}

export const DEFAULT_HEAL_CALC_SETTINGS: HealCalcSettings = {
    magicAttack: 12000,
    sevaInt: 2849,
    hasSaintBardLink: true,
    primaryTitleId: "none",
    secondaryTitleId: "none",
    weaponId: "none",
    weaponGrade: "master",
    weaponUpgradeOptionId: "none",
    nightbringerHealingEfficiency: 0,
    wandReforgeLevel: 0,
    darkErgLevel: 0,
    armorReforgeLevel: 0,
    hasHealingEnhanceSet: false,
    accessory1PartyHealingLevel: 0,
    accessory1HealingLevel: 0,
    accessory2PartyHealingLevel: 0,
    accessory2HealingLevel: 0,
    holyWaterPercent: 0,
    accessoryPrefixEnchantPercent: 0,
    accessorySuffixEnchantPercent: 0,
    headPrefixEnchantPercent: 0,
    headSuffixEnchantPercent: 0,
    bodyPrefixEnchantPercent: 0,
    bodySuffixEnchantPercent: 0,
    handPrefixEnchantPercent: 0,
    handSuffixEnchantPercent: 0,
    footPrefixEnchantPercent: 0,
    footSuffixEnchantPercent: 0,
    amuletHealingPercent: 0,
    relicGumeEffect: 0,
    relicEnchantHealingPercent: 0,
    brireheHealingPercent: 0,
    totemHealingEffect: 0,
    arcanaAwakeningHealingPercent: 0,
    healingMiniatureId: "none",
    hasJeongwhaGodong: false,
    specialUpgradeStage: 0,
    ergRecovery: 0,
    ergHealEfficiency: 0,
    spiritYuksungLevel: 0,
    spiritYeonmaLevel: 0,
    spiritJejeLevel: 0,
    isSpiritImplementationActive: false,
    spiritMatBuffLevel: 0,
    oghamHealingMaxRecovery: 0,
    oghamPartyHealingMaxRecovery: 0,
};

// ===== 計算 =====

function isNightbringerClassWeapon(weaponId: string): boolean {
    return weaponId === "nightbringer_savior" || weaponId === "soul_liberate_healing_wand";
}

function getSpiritWeaponMultiplier(s: HealCalcSettings): number {
    if (s.isSpiritImplementationActive) {
        return 1.1 + (SPIRIT_MATERIALIZE_PERCENT[s.spiritMatBuffLevel] ?? 0) / 100;
    }
    return 1;
}

function getTitleBonusPercent(primaryTitleId: string, secondaryTitleId: string): number {
    const primary = PRIMARY_TITLES.find((t) => t.id === primaryTitleId);
    const secondary = SECONDARY_TITLES.find((t) => t.id === secondaryTitleId);
    return (primary?.healingEffectPercent || 0) + (secondary?.healingEffectPercent || 0);
}

function getWeaponBonus(weaponId: string, weaponGrade: string, weaponUpgradeOptionId: string, nightbringerHealingEfficiency = 0) {
    const weapon = WEAPONS.find((w) => w.id === weaponId);
    const isNightbringer = weaponId === "nightbringer_savior";
    const upgrade = (isNightbringer ? NIGHTBRINGER_UPGRADE_OPTIONS : WEAPON_UPGRADE_OPTIONS).find((u) => u.id === weaponUpgradeOptionId);
    const gradeBonus = weapon?.hasMasterGrade ? WEAPON_GRADE_BONUS[weaponGrade] ?? 0 : 0;
    const variableEfficiency = isNightbringer ? nightbringerHealingEfficiency : 0;
    return {
        healingEffectPercent: (weapon?.healingEffectPercent || 0) + (upgrade?.healingEffectPercent || 0) + gradeBonus + variableEfficiency,
        partyHealingEffectPercent: (weapon?.partyHealingEffectPercent || 0) + (upgrade?.partyHealingEffectPercent || 0) + gradeBonus + variableEfficiency,
        hasHealWandBonus: weapon?.hasHealWandBonus || false,
    };
}

/** 聖水／護符／遺物接尾詞／布里萊赫／圖騰／奧秘覺醒／額外微縮模型：全部是固定 % 相加，個人與派對共用同一組 */
function getMiscFlatPercent(s: HealCalcSettings): number {
    const miniature = HEALING_MINIATURES.find((m) => m.id === s.healingMiniatureId);
    return (
        s.holyWaterPercent +
        s.accessoryPrefixEnchantPercent +
        s.accessorySuffixEnchantPercent +
        s.headPrefixEnchantPercent +
        s.headSuffixEnchantPercent +
        s.bodyPrefixEnchantPercent +
        s.bodySuffixEnchantPercent +
        s.handPrefixEnchantPercent +
        s.handSuffixEnchantPercent +
        s.footPrefixEnchantPercent +
        s.footSuffixEnchantPercent +
        s.amuletHealingPercent +
        (s.hasSaintBardLink ? s.relicEnchantHealingPercent : 0) +
        s.brireheHealingPercent +
        (s.totemHealingEffect ?? 0) +
        (s.arcanaAwakeningHealingPercent ?? 0) +
        (miniature?.healingEffectPercent ?? 0)
    );
}

/** 稱號／武器／聖水等以外，兩者共用的加成總和（淨化悸動、特別改造、Erg治癒效率、黑暗Erg、精靈研磨） */
function getSharedBonusPercent(s: HealCalcSettings): number {
    return (
        20 * Number(!!s.hasJeongwhaGodong) +
        (isNightbringerClassWeapon(s.weaponId) ? SPECIAL_UPGRADE_STAGE_PERCENT[s.specialUpgradeStage] ?? 0 : 0) +
        (s.ergHealEfficiency ?? 0) +
        0.5 * s.darkErgLevel +
        (SPIRIT_YEONMA_PERCENT[s.spiritYeonmaLevel] ?? 0)
    );
}

/** 個人治癒（治癒的手）加成總百分比 */
export function getHealingPercent(s: HealCalcSettings): number {
    const titleBonus = getTitleBonusPercent(s.primaryTitleId, s.secondaryTitleId);
    const weaponBonus = getWeaponBonus(s.weaponId, s.weaponGrade, s.weaponUpgradeOptionId, s.nightbringerHealingEfficiency);
    return titleBonus + weaponBonus.healingEffectPercent + getMiscFlatPercent(s) + getSharedBonusPercent(s);
}

/** 派對治癒（救贖回聲）加成總百分比 */
export function getPartyHealingPercent(s: HealCalcSettings): number {
    const titleBonus = getTitleBonusPercent(s.primaryTitleId, s.secondaryTitleId);
    const weaponBonus = getWeaponBonus(s.weaponId, s.weaponGrade, s.weaponUpgradeOptionId, s.nightbringerHealingEfficiency);
    return titleBonus + weaponBonus.partyHealingEffectPercent + getMiscFlatPercent(s) + getSharedBonusPercent(s);
}

function getReforgeFlatBonus(s: HealCalcSettings) {
    const wandFlat = WAND_PARTY_HEALING_REFORGE[s.wandReforgeLevel] || 0;
    const armorFlat = ARMOR_HEALING_REFORGE[s.armorReforgeLevel] || 0;
    const acc1Party = ACCESSORY_PARTY_HEALING_REFORGE[s.accessory1PartyHealingLevel] || 0;
    const acc1Healing = ACCESSORY_HEALING_REFORGE[s.accessory1HealingLevel] || 0;
    const acc2Party = ACCESSORY_PARTY_HEALING_REFORGE[s.accessory2PartyHealingLevel] || 0;
    const acc2Healing = ACCESSORY_HEALING_REFORGE[s.accessory2HealingLevel] || 0;

    return {
        partyHealingFlat: wandFlat + acc1Party + acc2Party,
        healingFlat: armorFlat + acc1Healing + acc2Healing,
    };
}

export interface HealRollResult {
    normal: RangeValue;
    critical: RangeValue;
    /** 派對治癒限定：救贖回聲 */
    gume?: RangeValue;
    gumeCritical?: RangeValue;
    gumeWarmth5?: RangeValue;
    gumeCriticalWarmth5?: RangeValue;
    /** 個人治癒限定：治癒的手 */
    chison?: RangeValue;
    chisonCritical?: RangeValue;
    chisonWarmth5?: RangeValue;
    chisonCriticalWarmth5?: RangeValue;
}

/** 派對治癒（含救贖回聲）計算 */
export function calculatePartyHealing(s: HealCalcSettings): HealRollResult {
    const relicGumeEffect = s.hasSaintBardLink ? s.relicGumeEffect ?? 0 : 0;
    const intFloor10 = s.hasSaintBardLink ? Math.floor(s.sevaInt / 10) : 0;
    const intDiv10 = s.hasSaintBardLink ? s.sevaInt / 10 : 0;

    const flat = getReforgeFlatBonus(s);
    const percentMultiplier = (1 + getPartyHealingPercent(s) / 100) * getSpiritWeaponMultiplier(s);
    const ergRecoveryFlat = s.ergRecovery ?? 0;

    const spiritYuksungFlat = SPIRIT_YUKSUNG_FLAT[s.spiritYuksungLevel] ?? 0;
    const spiritJejeFlat = SPIRIT_JEJE_FLAT[s.spiritJejeLevel] ?? 0;
    const oghamPartyFlat = s.oghamPartyHealingMaxRecovery ?? 0;

    const roll = (baseConst: number, magicAttackCoeff: number) => {
        const base = baseConst + Math.floor(s.magicAttack * magicAttackCoeff + flat.partyHealingFlat) + intFloor10 + ergRecoveryFlat + spiritYuksungFlat;
        const afterPercent = base * percentMultiplier;
        const normalHeal = Math.floor(afterPercent);
        const gumeBase = (base - intFloor10) * 3 * percentMultiplier;
        const relicMultiplier = 1 + relicGumeEffect / 100;
        const gumeHeal = (500 + gumeBase + intDiv10) * relicMultiplier;
        const gumeCritHeal = (500 + 1.5 * gumeBase + intDiv10) * relicMultiplier;
        return {
            normalHeal,
            criticalHeal: Math.floor(1.5 * afterPercent),
            gumeHeal: Math.floor(gumeHeal),
            gumeCritHeal: Math.floor(gumeCritHeal),
            gumeWarmth5Heal: Math.floor(1.35 * gumeHeal),
            gumeCritWarmth5Heal: Math.floor(1.35 * gumeCritHeal),
        };
    };

    const minRoll = roll(205, 0.016);
    const maxRoll = roll(227 + spiritJejeFlat + oghamPartyFlat, 0.02);

    return {
        normal: { min: minRoll.normalHeal, max: maxRoll.normalHeal },
        critical: { min: minRoll.criticalHeal, max: maxRoll.criticalHeal },
        gume: { min: minRoll.gumeHeal, max: maxRoll.gumeHeal },
        gumeCritical: { min: minRoll.gumeCritHeal, max: maxRoll.gumeCritHeal },
        gumeWarmth5: { min: minRoll.gumeWarmth5Heal, max: maxRoll.gumeWarmth5Heal },
        gumeCriticalWarmth5: { min: minRoll.gumeCritWarmth5Heal, max: maxRoll.gumeCritWarmth5Heal },
    };
}

/** 個人治癒（含治癒的手）計算 */
export function calculateHealing(s: HealCalcSettings): HealRollResult {
    const intFloor10 = s.hasSaintBardLink ? Math.floor(s.sevaInt / 10) : 0;
    const intDiv10 = s.hasSaintBardLink ? s.sevaInt / 10 : 0;

    const weaponBonus = getWeaponBonus(s.weaponId, s.weaponGrade, s.weaponUpgradeOptionId, s.nightbringerHealingEfficiency);
    const flat = getReforgeFlatBonus(s);
    const setBonusMultiplier = 1 + (s.hasHealingEnhanceSet ? 20 : 0) / 100;
    const percentMultiplier = (1 + getHealingPercent(s) / 100) * getSpiritWeaponMultiplier(s);
    const ergRecoveryFlat = s.ergRecovery ?? 0;

    const spiritYuksungFlat = SPIRIT_YUKSUNG_FLAT[s.spiritYuksungLevel] ?? 0;
    const spiritJejeFlat = SPIRIT_JEJE_FLAT[s.spiritJejeLevel] ?? 0;
    const oghamHealingFlat = s.oghamHealingMaxRecovery ?? 0;

    const roll = (baseConst: number, magicAttackCoeff: number) => {
        const base =
            baseConst +
            Math.floor(s.magicAttack * magicAttackCoeff) +
            5 * Number(weaponBonus.hasHealWandBonus) +
            flat.healingFlat +
            intFloor10 +
            spiritYuksungFlat +
            ergRecoveryFlat;
        const normalHeal = Math.floor(base * setBonusMultiplier) * percentMultiplier;
        const chisonBase = 7 * Math.floor((base - intFloor10) * setBonusMultiplier) * percentMultiplier;
        const chisonHeal = Math.floor(800 + chisonBase + intDiv10);
        return {
            normalHeal: Math.floor(normalHeal),
            criticalHeal: Math.floor(1.5 * normalHeal),
            chisonHeal,
            chisonCritHeal: Math.floor(800 + 1.5 * chisonBase + intDiv10),
            chisonWarmth5Heal: Math.floor((800 + chisonBase + intDiv10) * 1.35),
            chisonCritWarmth5Heal: Math.floor((800 + 1.5 * chisonBase + intDiv10) * 1.35),
        };
    };

    const minRoll = roll(97, 0.012);
    const maxRoll = roll(106 + spiritJejeFlat + oghamHealingFlat, 0.015);

    return {
        normal: { min: minRoll.normalHeal, max: maxRoll.normalHeal },
        critical: { min: minRoll.criticalHeal, max: maxRoll.criticalHeal },
        chison: { min: minRoll.chisonHeal, max: maxRoll.chisonHeal },
        chisonCritical: { min: minRoll.chisonCritHeal, max: maxRoll.chisonCritHeal },
        chisonWarmth5: { min: minRoll.chisonWarmth5Heal, max: maxRoll.chisonWarmth5Heal },
        chisonCriticalWarmth5: { min: minRoll.chisonCritWarmth5Heal, max: maxRoll.chisonCritWarmth5Heal },
    };
}

export interface SonicBaptismResult {
    defensePerStack: number;
    protectionPerStack: number;
}

/** 音波洗禮：每 1 疊防禦／魔法防禦、保護／魔法保護 減少量（不含玩家魔攻/智力，僅取決於治癒%加成） */
export function calculateSonicBaptism(s: HealCalcSettings): SonicBaptismResult {
    const zeroStat: HealCalcSettings = { ...s, magicAttack: 0, sevaInt: 0 };
    const healingBase = calculateHealing(zeroStat).normal.max;
    const partyHealingBase = calculatePartyHealing(zeroStat).normal.max;
    const healingPct = getHealingPercent(s);
    const partyHealingPct = getPartyHealingPercent(s);

    const base =
        0.0045383 *
        (healingBase * (1 + healingPct / 90) / (1 + healingPct / 100) + partyHealingBase * (1 + partyHealingPct / 90) / (1 + partyHealingPct / 100));

    const isSoulLiberate = s.weaponId === "soul_liberate_healing_wand";
    return {
        defensePerStack: base + (isSoulLiberate ? 2 : 0),
        protectionPerStack: base / 5 + (isSoulLiberate ? 0.8 : 0),
    };
}

export interface HealCalcResult {
    healing: HealRollResult;
    partyHealing: HealRollResult;
    sonicBaptism: SonicBaptismResult;
}

export function calculateAll(s: HealCalcSettings): HealCalcResult {
    return {
        healing: calculateHealing(s),
        partyHealing: calculatePartyHealing(s),
        sonicBaptism: calculateSonicBaptism(s),
    };
}
