/**
 * 聖盾騎士傷害計算器 — 資料表與計算邏輯
 *
 * 注意：以下技能公式（倍率 × 面板數值）只算出「聖盾騎士技能傷害」本身，
 * 還不是瑪奇最終顯示在畫面上的傷害（缺少對怪物防禦/保護的實際扣減）。
 * `applyFinalDamageFormula` 是刻意保留的介面，等之後用「面板數值 + 實測傷害」
 * 反推出真正公式後，只需要改那一個函式，不用動到上面的技能倍率。
 *
 * 攻擊力／暴擊傷害／額外傷害的通用公式（可供其他職業計算器 import）在
 * `src/data/mabinogiCombat.ts`；這個檔案只放聖盾騎士專屬的資料（武器/盾牌/
 * 套裝/聖水/細工/魔法陣/技能倍率），並把算好的百分比/倍率餵給那邊的函式。
 *
 * 聖盾騎士現有 7 個秘法技能（聖域展開、盾崩強襲…）都已經正式套用
 * `calculateArcaneSkillDamage`：借用風車/突擊傷害（才能技能目標傷害，見
 * `calculateTalentSkillTargetDamage`）當「採計的才能技能目標傷害」的技能（盾崩強襲/
 * 審判重擊/光輝斷罪借風車、盾擊衝鋒借突擊），其餘基礎/加護力/生命是純秘法部分；
 * 沒有借用任何才能技能的技能（聖域展開/零秒嘲諷/犧牲懲戒）則把「採計的才能技能
 * 目標傷害」傳 0，退化成純秘法技能。各技能既有的職業被動倍率（如審判重擊 +20%、
 * 犧牲懲戒 +15%、盾牌減傷）比照套用到才能與秘法兩部分。
 */

import {
    calculateDirtyMaxDamage,
    calculateCleanMaxDamage,
    calculateConstantAttackPower,
    calculateFinalMaxDamage,
    calculateCriticalDamagePercent,
    calculateCriticalRatePercent,
    calculateCriticalDamageExpected,
    calculateGeneralExtraDamageMultiplier,
    calculateGeneralExtraPercent,
    calculateTalentIncreaseDamageMultiplier,
    calculateTalentSkillTargetDamage,
    calculateTalentSkillDamage,
    calculateArcaneSkillDamage,
    calculateArcaneExtraDamagePercent,
    CRITICAL_RATE_ITEM_BONUS,
    RACE_SKILL_OPTIONS,
    PET_BONUS_OPTIONS,
    TRANSFORMATION_OPTIONS,
    SPIRIT_WEAPON_ATTACK_BONUS,
    CRITICAL_DAMAGE_SET_BONUS,
    type SpiritWeaponAttackType,
    type AttackCoefficientState,
    type CriticalDamageSetTier,
    type TotemChoice,
    type ArcaneExtraDamageState,
    type CriticalRateState,
    type RaceId,
} from "./mabinogiCombat";
import { protRate } from "../utils/protectionCompare";

export {
    PET_BONUS_OPTIONS,
    TRANSFORMATION_OPTIONS,
    CRITICAL_DAMAGE_SET_BONUS,
    CRITICAL_RATE_ITEM_BONUS,
    type CriticalDamageSetTier,
    type TotemChoice,
};

// ═══════════════════════════════════════════════════════
//  角色基本數值（最大傷害已移到「攻擊力」分頁的面板輸入，見下方 DirtyMaxDamage 相關型別）
// ═══════════════════════════════════════════════════════

export type CharacterStatBaseline = "raw" | "buffed";

export interface CharacterStats {
    maxHp: number;
    defense: number;
    protection: number;
    magicDefense: number;
    magicProtection: number;
    /** 面板數值是否已經含聖水加成；含的話就不會再自動把聖水加總進去（避免重複計算） */
    panelIncludesHolyWater: boolean;
    /**
     * 面板數值是「原始面板」（未套用高潔誓約等buff）還是「上完buff」（高潔誓約已經套用在數值裡，預設）。
     * 目前只影響最大生命值/防禦/保護/魔法防禦/魔法保護，攻擊力的面板最大傷害維持原本「原始面板」語意不受影響。
     */
    statBaseline: CharacterStatBaseline;
}

export const DEFAULT_CHARACTER_STATS: CharacterStats = {
    maxHp: 0,
    defense: 0,
    protection: 0,
    magicDefense: 0,
    magicProtection: 0,
    panelIncludesHolyWater: false,
    statBaseline: "buffed",
};

// ═══════════════════════════════════════════════════════
//  套裝效果（內部 tag，不直接讓 User 選，由武器/盾牌/護甲套裝自動帶出）
// ═══════════════════════════════════════════════════════

export type SetEffectTag =
    | "windmill_enhance2"
    | "windmill_enhance2_10"
    | "windmill_enhance"
    | "charge_enhance"
    | "smash_enhance"
    | "bash_enhance"
    | "bash_enhance_sp";

/** 套裝效果對應的顯示文字，供最終面板顯示「發動中的套裝效果」用 */
export const SET_EFFECT_TAG_LABELS: Record<SetEffectTag, string> = {
    windmill_enhance2: "風車套裝 +15%（武器/盾牌）",
    windmill_enhance2_10: "風車套裝 +10%（兇猛系列）",
    windmill_enhance: "風車基礎倍率 +30%（莊嚴騎士）",
    charge_enhance: "突擊最終倍率 ×1.15",
    smash_enhance: "重擊套裝 +15%",
    bash_enhance: "猛擊套裝 +10%",
    bash_enhance_sp: "猛擊套裝（象徵）+10%",
};

/** 各套裝 tag 的實際數值（%） */
const SET_EFFECT_VALUE_PERCENT = {
    windmill_enhance2: 15,
    windmill_enhance2_10: 10,
    windmill_enhance: 30,
    smash_enhance: 15,
    bash_enhance: 10,
    bash_enhance_sp: 10,
} as const;

// ═══════════════════════════════════════════════════════
//  武器（獨立區塊：先選種類，再選武器）
// ═══════════════════════════════════════════════════════

export type WeaponType = "one_hand_axe" | "two_hand_sword";

export const WEAPON_TYPE_OPTIONS: { id: WeaponType; label: string }[] = [
    { id: "one_hand_axe", label: "單手斧" },
    { id: "two_hand_sword", label: "雙手劍" },
];

export interface WeaponPreset {
    id: string;
    label: string;
    /** 額外傷害%，併入「武器額外傷害」桶 */
    extraDamagePercent: number;
    tags?: SetEffectTag[];
    /** 武器的重擊傷害增加%，加進重擊最後一格 (1+武器重擊傷害增加+套裝+連續技卡片) */
    smashDamageIncreasePercent?: number;
    /** 重擊最終傷害增加%（靈魂解放者系列），乘在重擊基礎倍率上 */
    smashFinalIncreasePercent?: number;
    /** 猛擊最終傷害增加%（靈魂解放者系列） */
    bashFinalIncreasePercent?: number;
}

/** 只列單手斧／雙手劍（本計算器只支援這兩種武器種類），其餘單手劍／鎚等不顯示 */
export const WEAPON_PRESETS: Record<WeaponType, WeaponPreset[]> = {
    one_hand_axe: [
        { id: "none", label: "其他", extraDamagePercent: 0 },
        { id: "celtic_axe", label: "凱爾特系列單手斧", extraDamagePercent: 14, tags: ["bash_enhance_sp"] },
        { id: "nightbringer_plunderer", label: "暗夜使者掠奪者", extraDamagePercent: 42, tags: ["windmill_enhance2"], smashDamageIncreasePercent: 5 },
        {
            id: "soul_liberator_axe",
            label: "靈魂解放者單手斧",
            extraDamagePercent: 56,
            tags: ["windmill_enhance2"],
            bashFinalIncreasePercent: 10,
        },
    ],
    two_hand_sword: [
        { id: "none", label: "其他", extraDamagePercent: 0 },
        { id: "fierce_titan_blade", label: "兇猛泰坦利刃", extraDamagePercent: 56, tags: ["windmill_enhance2_10"] },
        { id: "nightbringer_commander", label: "暗夜使者指揮官", extraDamagePercent: 84, smashDamageIncreasePercent: 15 },
        {
            id: "sky_sonata",
            label: "穹之奏鳴曲（日月劍）",
            extraDamagePercent: 112,
            tags: ["windmill_enhance2", "bash_enhance"],
            smashDamageIncreasePercent: 25,
        },
        { id: "soul_liberator_sword", label: "靈魂解放者雙手劍", extraDamagePercent: 112, smashFinalIncreasePercent: 20 },
    ],
};

function getWeaponPreset(weaponType: WeaponType, weaponId: string): WeaponPreset {
    return WEAPON_PRESETS[weaponType].find((w) => w.id === weaponId) ?? WEAPON_PRESETS[weaponType][0];
}

// ═══════════════════════════════════════════════════════
//  武器特殊改造：R 增加暴擊傷害%、S 增加追加傷害（算進通用額外傷害）% 與最大傷害（階段 1~8）
//  單手斧在 9/17 上修後與雙手劍數值相同；第 8 階只有靈魂解放者／日月劍（穹之奏鳴曲）才能強化
// ═══════════════════════════════════════════════════════

export const SPECIAL_REFORM_STAGE_COUNT = 8;
export const SPECIAL_REFORM_R_CRIT_PERCENT: readonly number[] = [6, 16, 26, 38, 50, 62, 74, 89];
export const SPECIAL_REFORM_S_EXTRA_PERCENT: readonly number[] = [2, 3, 4, 5, 6, 7, 9, 10];
/** S 改造附帶的最大傷害（面板最大傷害通常已含，只用於「特殊改造效益」比較階段價值） */
export const SPECIAL_REFORM_S_MAX_DAMAGE: readonly number[] = [50, 60, 70, 90, 110, 130, 155, 170];
const SPECIAL_REFORM_STAGE8_WEAPON_IDS = ["soul_liberator_axe", "sky_sonata", "soul_liberator_sword"];

/** 該武器能強化到第幾階：靈魂解放者／日月劍 8 階，其他 7 階 */
export function specialReformMaxStage(weaponId: string): number {
    return SPECIAL_REFORM_STAGE8_WEAPON_IDS.includes(weaponId) ? 8 : 7;
}

/** 舊存檔的階段是 "none"／"r6"／"r7"／"r8" 字串，統一轉成 0~maxStage 的整數 */
export function normalizeSpecialReformStage(value: unknown, maxStage: number): number {
    const n = typeof value === "number" ? value : typeof value === "string" ? parseInt(value.replace(/\D/g, ""), 10) || 0 : 0;
    return Math.min(Math.max(0, Math.round(n)), maxStage);
}

const reformValue = (table: readonly number[], stage: number): number => (stage > 0 ? (table[stage - 1] ?? 0) : 0);
export const specialReformRCrit = (stage: number) => reformValue(SPECIAL_REFORM_R_CRIT_PERCENT, stage);
export const specialReformSExtra = (stage: number) => reformValue(SPECIAL_REFORM_S_EXTRA_PERCENT, stage);
export const specialReformSMaxDamage = (stage: number) => reformValue(SPECIAL_REFORM_S_MAX_DAMAGE, stage);

// ═══════════════════════════════════════════════════════
//  盾牌（獨立區塊）
// ═══════════════════════════════════════════════════════

export interface ShieldPreset {
    id: string;
    label: string;
    /** 盾牌減傷率，例如 0.2 代表 -20% */
    reduction: number;
    hpFlat?: number;
    /** 併入常數攻擊力（不吃攻擊係數），例如鍋子 +40 */
    maxDamageFlat?: number;
    tags?: SetEffectTag[];
    /** 僅裝備單手武器時生效的額外傷害%，併入「武器額外傷害」桶 */
    oneHandWeaponExtraDamagePercent?: number;
}

export const SHIELD_PRESETS: ShieldPreset[] = [
    { id: "none", label: "無 / 其他", reduction: 0 },
    { id: "holy_shield", label: "神聖盾牌", reduction: 0.15, tags: ["bash_enhance_sp", "charge_enhance"], oneHandWeaponExtraDamagePercent: 14 },
    {
        id: "fierce_sentry",
        label: "兇猛哨兵盾牌",
        reduction: 0.2,
        tags: ["windmill_enhance2_10", "bash_enhance", "charge_enhance"],
        oneHandWeaponExtraDamagePercent: 28,
    },
    {
        id: "night_vanguard",
        label: "暗夜使者前鋒（貓盾）",
        reduction: 0.3,
        tags: ["windmill_enhance2", "bash_enhance", "charge_enhance"],
        oneHandWeaponExtraDamagePercent: 42,
    },
    { id: "soul_liberator", label: "靈魂解放者系列盾牌", reduction: 0.4, hpFlat: 1000, tags: ["windmill_enhance2", "charge_enhance"], oneHandWeaponExtraDamagePercent: 56 },
    { id: "pot", label: "鍋子", reduction: 0, maxDamageFlat: 40 },
];

export function getShieldPreset(shieldId: string): ShieldPreset {
    return SHIELD_PRESETS.find((s) => s.id === shieldId) ?? SHIELD_PRESETS[0];
}

// ═══════════════════════════════════════════════════════
//  聖水（8 個部位，各自選一種能力＋填數值，上限依能力）
// ═══════════════════════════════════════════════════════

export type HolyWaterAbilityId = "maxDamage" | "maxHp" | "defense" | "magicDefense" | "criticalDamage";

export interface HolyWaterAbility {
    id: HolyWaterAbilityId;
    label: string;
    max: number;
}

export const HOLY_WATER_ABILITIES: HolyWaterAbility[] = [
    { id: "maxDamage", label: "大傷", max: 30 },
    { id: "maxHp", label: "HP", max: 300 },
    { id: "defense", label: "防禦", max: 100 },
    { id: "magicDefense", label: "魔法防禦", max: 100 },
    { id: "criticalDamage", label: "暴擊傷害 %", max: 4 },
];

export const HOLY_WATER_SLOTS = [
    { key: "head", label: "頭部" },
    { key: "body", label: "身體" },
    { key: "hands", label: "手部" },
    { key: "feet", label: "腳部" },
    { key: "accessory1", label: "飾品 1" },
    { key: "accessory2", label: "飾品 2" },
    { key: "weapon", label: "武器" },
    { key: "shield", label: "盾牌" },
] as const;

export type HolyWaterSlotKey = (typeof HOLY_WATER_SLOTS)[number]["key"];

export interface HolyWaterSelection {
    abilityId: HolyWaterAbilityId | "none";
    value: number;
}

export type HolyWaterState = Record<HolyWaterSlotKey, HolyWaterSelection>;

export function createDefaultHolyWaterState(): HolyWaterState {
    return Object.fromEntries(HOLY_WATER_SLOTS.map((s) => [s.key, { abilityId: "none", value: 0 } as HolyWaterSelection])) as HolyWaterState;
}

function sumHolyWater(holyWater: HolyWaterState, abilityId: HolyWaterAbilityId): number {
    return HOLY_WATER_SLOTS.reduce((sum, slot) => {
        const sel = holyWater[slot.key];
        return sel.abilityId === abilityId ? sum + sel.value : sum;
    }, 0);
}

// ═══════════════════════════════════════════════════════
//  細工（武器／飾品 1／飾品 2，各部位重擊/風車/突擊三種各自獨立填等級）
// ═══════════════════════════════════════════════════════

export type ReforgeType = "smash" | "windmill" | "charge";

export const REFORGE_TYPE_COLUMNS: { id: ReforgeType; label: string }[] = [
    { id: "smash", label: "重擊（+10% / 級）" },
    { id: "windmill", label: "風車（+3% / 級）" },
    { id: "charge", label: "突擊（+15% / 級）" },
];

const REFORGE_PER_LEVEL: Record<ReforgeType, number> = {
    smash: 10,
    windmill: 3,
    charge: 15,
};

export const REFORGE_SLOTS = [
    { key: "weapon", label: "武器" },
    { key: "accessory1", label: "飾品 1" },
    { key: "accessory2", label: "飾品 2" },
] as const;

export type ReforgeSlotKey = (typeof REFORGE_SLOTS)[number]["key"];

export type ReforgeSelection = Record<ReforgeType, number>;

export type ReforgeState = Record<ReforgeSlotKey, ReforgeSelection>;

export function createDefaultReforgeState(): ReforgeState {
    return Object.fromEntries(REFORGE_SLOTS.map((s) => [s.key, { smash: 0, windmill: 0, charge: 0 }])) as ReforgeState;
}

function sumReforgeLevels(reforge: ReforgeState, type: ReforgeType): number {
    return REFORGE_SLOTS.reduce((sum, slot) => sum + reforge[slot.key][type], 0);
}

export interface ReforgeLevelOption {
    value: number;
    label: string;
}

const REFORGE_BREAKTHROUGH_SUFFIX = "（突破限定）";

/** 選單由高到低排序，預設值仍是 0（見 createDefaultReforgeState） */
function buildReforgeLevelOptions(max: number, breakthroughFrom: number): ReforgeLevelOption[] {
    return Array.from({ length: max + 1 }, (_, i) => {
        const level = max - i;
        return {
            value: level,
            label: level >= breakthroughFrom ? `${level}${REFORGE_BREAKTHROUGH_SUFFIX}` : `${level}`,
        };
    });
}

/** 細工等級選單：武器依單手斧(0~13，≥11突破限定)／雙手劍(0~25，≥21突破限定)而不同，飾品固定 0~4（4為突破限定） */
export function getReforgeLevelOptions(slotKey: ReforgeSlotKey, weaponType: WeaponType): ReforgeLevelOption[] {
    if (slotKey === "weapon") {
        return weaponType === "two_hand_sword" ? buildReforgeLevelOptions(25, 21) : buildReforgeLevelOptions(13, 11);
    }
    return buildReforgeLevelOptions(4, 4);
}

export function getReforgeLevelMax(slotKey: ReforgeSlotKey, weaponType: WeaponType): number {
    if (slotKey === "weapon") return weaponType === "two_hand_sword" ? 25 : 13;
    return 4;
}

/** 省察的痕跡細工等級選單：0~25，21~25 突破限定（兩個部位共用） */
export const REFLECTION_REFORGE_LEVEL_OPTIONS: ReforgeLevelOption[] = buildReforgeLevelOptions(25, 21);

/** [戰場上的狂吼] 樂器演奏細工等級選單：0~25，21~25 突破限定 */
export const BATTLE_CRY_REFORGE_LEVEL_OPTIONS: ReforgeLevelOption[] = buildReforgeLevelOptions(25, 21);

/** 變身細工等級選單：0~33，27~33 突破限定 */
export const TRANSFORMATION_REFORGE_LEVEL_OPTIONS: ReforgeLevelOption[] = buildReforgeLevelOptions(33, 27);

// ═══════════════════════════════════════════════════════
//  角色型態（種族 + 變身 合併選單；變身/種族技能資料來自 mabinogiCombat.ts）
// ═══════════════════════════════════════════════════════

export interface CharacterBuild {
    id: string;
    label: string;
    /** 對應 mabinogiCombat.ts 的 TRANSFORMATION_OPTIONS */
    transformationId: string;
    raceId: RaceId;
    /** 聖盾騎士的才能技能都屬於「一般/近戰」，精靈的弓術種族技能對聖盾無效 */
    raceSkillApplies: boolean;
    /** 巨人限定：可同時裝備雙手劍與盾牌 */
    allowTwoHandSwordWithShield: boolean;
}

export const CHARACTER_BUILDS: CharacterBuild[] = [
    { id: "holy_knight", label: "光之騎士（人類・神聖之刃）", transformationId: "sacred_blade", raceId: "human", raceSkillApplies: true, allowTwoHandSwordWithShield: false },
    { id: "dark_knight", label: "黑暗騎士（人類）", transformationId: "none", raceId: "human", raceSkillApplies: true, allowTwoHandSwordWithShield: false },
    { id: "giant", label: "巨人（菲西斯守護者）", transformationId: "physis_guardian", raceId: "giant", raceSkillApplies: true, allowTwoHandSwordWithShield: true },
    { id: "elf", label: "精靈（克諾斯之怒）", transformationId: "chaos_wrath", raceId: "elf", raceSkillApplies: false, allowTwoHandSwordWithShield: false },
];

function getCharacterBuild(id: string): CharacterBuild {
    return CHARACTER_BUILDS.find((b) => b.id === id) ?? CHARACTER_BUILDS[0];
}

export function getRaceSkillInfo(build: CharacterBuild): { label: string; percent: number } {
    const race = RACE_SKILL_OPTIONS.find((r) => r.id === build.raceId) ?? RACE_SKILL_OPTIONS[0];
    const label = build.raceSkillApplies
        ? `${race.label}．${race.skillName}：${race.description}`
        : `${race.label}．${race.skillName}（${race.description}，與聖盾騎士才能技能類型不符，不套用）`;
    return { label, percent: build.raceSkillApplies ? race.percent : 0 };
}

// ═══════════════════════════════════════════════════════
//  魔法陣（最多選 3 個）
// ═══════════════════════════════════════════════════════

export type MagicCircleId = "smash_damage" | "charge_damage" | "meng_ji_damage";

export const MAGIC_CIRCLE_OPTIONS: { id: MagicCircleId; label: string }[] = [
    { id: "smash_damage", label: "重擊傷害值 +100%（併入重擊基礎倍率）" },
    { id: "charge_damage", label: "突擊傷害 +60%（併入突擊基礎倍率）" },
    { id: "meng_ji_damage", label: "猛擊打擊傷害 +40%（併入猛擊基礎倍率）" },
];

export const MAGIC_CIRCLE_LIMIT = 3;

// ═══════════════════════════════════════════════════════
//  高潔誓約 / 職業被動 常數
// ═══════════════════════════════════════════════════════

type OathStatKey = "maxHp" | "defense" | "magicDefense" | "protection" | "magicProtection";

/**
 * 高潔誓約：最大生命值 +15%（最大 3000）；防禦／保護／魔法防禦／魔法保護 +10%（防禦／魔防最大 150，保護／魔保最大 15）。
 * 另外發動中生命值 +1000、防禦／魔防 +100（不包含在上面的百分比基礎裡，直接加在百分比加成之後）。
 */
const NOBLE_OATH_RULES: Record<OathStatKey, { percent: number; cap: number; flat: number }> = {
    maxHp: { percent: 0.15, cap: 3000, flat: 1000 },
    defense: { percent: 0.1, cap: 150, flat: 100 },
    magicDefense: { percent: 0.1, cap: 150, flat: 100 },
    protection: { percent: 0.1, cap: 15, flat: 0 },
    magicProtection: { percent: 0.1, cap: 15, flat: 0 },
};

/** 原始值 → 套用高潔誓約後的值 */
function applyNobleOath(key: OathStatKey, raw: number): number {
    const r = NOBLE_OATH_RULES[key];
    return raw + Math.min(raw * r.percent, r.cap) + r.flat;
}

/** 「上完buff」面板 → 還原成套用高潔誓約前的原始值（applyNobleOath 的反函數，含上限分段） */
function removeNobleOath(key: OathStatKey, buffed: number): number {
    const r = NOBLE_OATH_RULES[key];
    const x = Math.max(0, buffed - r.flat);
    const capStart = (r.cap * (1 + r.percent)) / r.percent;
    return x <= capStart ? x / (1 + r.percent) : x - r.cap;
}

/** 把「上完buff」的角色面板換算成原始面板（原始面板則原樣回傳），供以「誓約前基礎值」為單位的計算使用 */
export function toRawCharacterStats(character: CharacterStats): CharacterStats {
    if (character.statBaseline === "raw") return character;
    return {
        ...character,
        maxHp: removeNobleOath("maxHp", character.maxHp),
        defense: removeNobleOath("defense", character.defense),
        protection: removeNobleOath("protection", character.protection),
        magicDefense: removeNobleOath("magicDefense", character.magicDefense),
        magicProtection: removeNobleOath("magicProtection", character.magicProtection),
        statBaseline: "raw",
    };
}

/** 職業被動：最大傷害的 3% 增加加護力（官方職業被動說明），未來版本改動時只需改這個常數 */
export const MAX_DAMAGE_TO_DEFENSE_POWER_RATE = 0.03;

export const SACRIFICE_CAP = 100;

/** 才能技能基本倍率（重擊/風車/突擊），猛擊另見 MENG_JI_STACKS */
const BASE_SKILL_RATIOS = {
    smash: 900,
    windmill: 500,
    charge: 264,
};

// ═══════════════════════════════════════════════════════
//  連續技卡片：只能裝備一張，同一個技能連續使用 6 下，第 1~6 下依序再加成（秘法技能不吃）
// ═══════════════════════════════════════════════════════

/** 第 1~6 下各自的增傷%，總和 213% */
export const COMBO_CARD_BONUS_PERCENT: readonly number[] = [0, 10, 22, 37, 57, 87];

export type ComboCardSkillId = "none" | "smash-hit" | "meng-ji" | "windmill-hit";

export const COMBO_CARD_OPTIONS: { id: ComboCardSkillId; label: string }[] = [
    { id: "none", label: "不使用" },
    { id: "smash-hit", label: "重擊" },
    { id: "meng-ji", label: "猛擊" },
    { id: "windmill-hit", label: "風車" },
];

/**
 * 使用次數依 1→6→1 循環平均分配到 6 個位置（餘數優先給前面），回傳加權平均增傷%。
 * 次數為 0 時以完整 6 連的平均（213/6）當代表值，這樣沒填次數時卡片/單次傷害預覽也看得到連擊效果。
 */
export function comboCardAveragePercent(usageCount: number): number {
    const positions = COMBO_CARD_BONUS_PERCENT.length;
    if (usageCount <= 0) return COMBO_CARD_BONUS_PERCENT.reduce((s, p) => s + p, 0) / positions;
    const base = Math.floor(usageCount / positions);
    const remainder = usageCount % positions;
    const total = COMBO_CARD_BONUS_PERCENT.reduce((sum, p, i) => sum + p * (base + (i < remainder ? 1 : 0)), 0);
    return total / usageCount;
}

/** 目前選的連續技卡片套在 skillId 上，相對於「未含連續技卡片」倍率的放大比例：(1+加成+連續技平均)/(1+加成) */
function comboCardFactor(
    settings: { comboCardSkillId: ComboCardSkillId },
    usageCounts: Record<string, number>,
    skillId: Exclude<ComboCardSkillId, "none">,
    additive: number,
): number {
    if (settings.comboCardSkillId !== skillId) return 1;
    const combo = comboCardAveragePercent(usageCounts[skillId] ?? 0) / 100;
    return (1 + additive + combo) / (1 + additive);
}

/**
 * 猛擊：獨立技能（不影響鐵壁猛擊，鐵壁猛擊吃的是風車）。層數 1~5，每層基礎傷害倍率不同，
 * 並疊加「近戰才能技能傷害%」buff（才能增加傷害，乘算）。每次使用增加 1 階段，滿 5 階持續
 * 20 秒，時間到降 1 階，本計算器不做即時計時模擬，直接以「目前層數」視為 buff 生效中。
 */
export const MENG_JI_STACKS: { stack: 1 | 2 | 3 | 4 | 5; ratio: number; extraDamagePercent: number }[] = [
    { stack: 1, ratio: 620, extraDamagePercent: 2 },
    { stack: 2, ratio: 640, extraDamagePercent: 4 },
    { stack: 3, ratio: 660, extraDamagePercent: 6 },
    { stack: 4, ratio: 680, extraDamagePercent: 8 },
    { stack: 5, ratio: 700, extraDamagePercent: 10 },
];

// ═══════════════════════════════════════════════════════
//  穆利亞斯的遺物（3 件，各自獨立 Lv0~10，0＝未裝備）
// ═══════════════════════════════════════════════════════

/** 高潔誓約每秒犧牲恢復量，每級 +0.05 */
export const MULIAS_RELIC_SACRIFICE_REGEN_PER_LEVEL = 0.05;
/** 犧牲之懲戒觸發省察的痕跡時，7 個秘法技能傷害（最終增加傷害，不含重擊/風車/猛擊）每級 +0.5% */
export const MULIAS_RELIC_REFLECTION_TRACE_PER_LEVEL = 0.5;
/** 審判一擊基礎傷害比例額外加成，每級 +100% */
/** buff 覆蓋率（0~100%）轉成 0~1，舊存檔沒有這個欄位時視為 100% */
function coverageRatio(percent: number | undefined): number {
    return Math.min(100, Math.max(0, percent ?? 100)) / 100;
}
/** 憤怒衝擊套裝：近戰技能傷害 +2% */
const RAGE_IMPACT_SET_PERCENT = 2;
export const MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL = 100;

export const MULIAS_RELIC_LEVEL_OPTIONS: { value: number; label: string }[] = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i === 0 ? "無" : `Lv${i}`,
}));

export interface MuliasRelicSettings {
    /** 高潔誓約每秒犧牲恢復量增加，Lv0~10 */
    sacrificeRegenLevel: number;
    /** 犧牲之懲戒觸發省察的痕跡時，秘法技能傷害增加，Lv0~10 */
    reflectionTraceLevel: number;
    /** 省察的痕跡覆蓋率 0~100%：觸發中時，平均有多少比例的秘法技能施放吃得到加成 */
    reflectionTraceCoveragePercent: number;
    /** 審判一擊基礎傷害比例額外加成，Lv0~10 */
    judgementStrikeLevel: number;
}

// ═══════════════════════════════════════════════════════
//  攻擊力／暴擊傷害／額外傷害／最終增加傷害 — 頁面設定用的精簡型別
//  （對應 mabinogiCombat.ts 的完整型別，缺的欄位在 calculateAll 裡補上）
// ═══════════════════════════════════════════════════════

export interface DirtyMaxDamageSettings {
    /** 一代宗師已滿，聖盾騎士固定 +30 */
    masterGradeActive: boolean;
    petIds: string[];
    banquetBonus: number;
    eventBonus: number;
    /** 變身中才計入變身固定加成與專屬細工加成（哪種變身由角色型態決定） */
    transformationActive: boolean;
    /** true＝面板最大傷害已經算入以上這些髒髒加成，下面欄位只作唯讀參考，不參與乾淨/最終最大傷害計算 */
    panelAlreadyIncludesDirty: boolean;
}

/** 破防面板（A 組、物理側）的結果快照；enabled 才會套用到傷害計算 */
export const SHARP_LEVEL_MAX = 11;

export interface ArmorBreakSettings {
    enabled: boolean;
    /** 怪物保護：套用破防%與固定值後、還沒扣銳利的值（銳利由 settings.sharpLevel 提供，才能在裝備比較中各配置不同） */
    protBeforePierce: number;
    /** 怪物銳利抵抗，抵銷玩家銳利等級 */
    pierceResist: number;
    /** 所受傷害增加%，乘進最終增加傷害 */
    damageTakenPercent: number;
    /** 近戰技能傷害 +%（憤怒衝擊），「近距離額外傷害中」開啟時乘進最終增加傷害 */
    meleePercent: number;
    /**
     * 暴擊時才生效的通用額外傷害 +%（例如犬靈的銳利目光，語意是「暴擊時增加通用額外傷害」，不是暴擊傷害）。
     * 欄位名維持 critDamagePercent 不改（破防面板那邊沿用舊名），但意義已經不是暴擊傷害；
     * 非暴擊不套用，這裡用暴擊率換算成期望值近似，乘進通用額外傷害倍率。
     */
    critDamagePercent: number;
}

export interface CriticalDamageSettings {
    skillR1Active: boolean;
    fullGradeActive: boolean;
    spiritWeaponCritActive: boolean;
    /** 武器特殊改造 R 階段 0~8（舊存檔是 "r6"/"r7"/"r8" 字串，計算時會轉換） */
    weaponSpecialReforgeTier: number;
    setTier: CriticalDamageSetTier;
    totemChoice: TotemChoice;
    dollBagPercent: number;
    farmModelPercent: number;
    titlePercent: number;
    /** 布里萊赫的硬幣 1~10%（暴擊傷害） */
    brireheCoinPercent: number;
    assassinOutfitActive: boolean;
}

/** 暴擊率：基準值自由輸入（依角色屬性/裝備而定），道具加成 +1% 是否啟用 */
export type CriticalRateSettings = CriticalRateState;

export interface ExtraDamageSettings {
    titlePercent: number;
    totemPercent: number;
    farmModelPercent: number;
    setEffectActive: boolean;
}

/** 秘法額外傷害（不完美的空想王冠光環/布里萊赫的硬幣/穆利亞斯的遺物，加總），已套用到 7 個秘法技能的傷害公式。 */
export type ArcaneExtraDamageSettings = ArcaneExtraDamageState;

export interface FinalIncreaseDamageSettings {
    /** 戰鬥服務 buff +1% */
    combatServiceBuffActive: boolean;
    /** 達可達的強力威光 +5% */
    dakotaGlowActive: boolean;
}

// ═══════════════════════════════════════════════════════
//  最終面板 + 才能技能能力值
// ═══════════════════════════════════════════════════════

export interface FinalStats {
    maxDamage: number;
    maxHp: number;
    defense: number;
    protection: number;
    magicDefense: number;
    magicProtection: number;
    /** 加護力（遊戲內稱防禦力）= 防禦 + 保護 + 魔防 + 魔保（玩家實測）+ 職業被動(最大傷害 × 3%) */
    defensePower: number;
    shieldDamageReduction: number;
}

export interface AbilityValues {
    /** 以下 4 個倍率都是「未含連續技卡片」的有效倍率（已乘上武器/盾牌/套裝等加成），連續技卡片另依使用次數分配 */
    smashRatio: number;
    windmillRatio: number;
    chargeRatio: number;
    mengJiRatio: number;
    /** 各技能最後一格 (1+加成+連續技卡片) 裡、連續技卡片以外的加成（小數，0.2＝+20%），套用連續技卡片時用來換算比例 */
    ratioAdditives: { smash: number; windmill: number; mengJi: number };
    /** 細工 +1 級實際增加的倍率 = 每級倍率 × 該技能全部乘算加成，傷害效益算細工邊際效益用 */
    ratioMultipliers: { smash: number; windmill: number; charge: number };
    /** 才能技能最終傷害（重擊目前沒有任何秘法技能公式使用，先算出來顯示參考） */
    smashDamage: number;
    windmillDamage: number;
    chargeDamage: number;
    /** 風車才能技能目標傷害（還沒乘通用額外/才能增加/最終增加傷害），秘法技能借用風車時用這個 */
    windmillTargetDamage: number;
    /** 突擊才能技能目標傷害，秘法技能借用突擊時用這個 */
    chargeTargetDamage: number;
}

export interface CalculationResult {
    finalStats: FinalStats;
    abilities: AbilityValues;
    /** 乾淨最大傷害（面板輸入扣掉髒髒總和） */
    cleanMaxDamage: number;
    /** 髒髒最大傷害總和 */
    dirtyMaxDamageTotal: number;
    /** 常數攻擊力（精靈武器攻擊力強化/秘法同步/盾牌固定加成，不吃攻擊係數，直接加在最終最大傷害公式裡） */
    constantAttackPower: number;
    /** 暴擊傷害%（暴擊當下的傷害倍率，基礎100%起跳的加總） */
    criticalDamagePercent: number;
    /** 暴擊率%（基準值+道具加成） */
    criticalRatePercent: number;
    /** 暴擊傷害期望值＝100+暴擊率%×(暴擊傷害%−100)/100，才能/秘法技能公式實際用這個 */
    criticalDamageExpected: number;
    /** 通用額外傷害倍率＝(1+武器額外傷害)×(1+額外傷害) */
    generalExtraDamageMultiplier: number;
    /** 武器額外傷害%（武器本身 + 單手武器搭配盾牌的額外傷害），併入通用額外傷害的其中一桶 */
    weaponExtraDamagePercent: number;
    /** 才能增加傷害倍率（種族技能×猛擊，乘算） */
    talentIncreaseDamageMultiplier: number;
    /** 最終增加傷害倍率（戰鬥服務/達可達/死神烙印/憤怒衝擊/命運編織/洞察之眼/幸運草，乘算），所有技能都吃 */
    finalIncreaseDamageMultiplier: number;
    /** 秘法技能專用的最終增加傷害倍率 = 最終增加傷害 × 省察的痕跡（省察的痕跡只加成 7 個秘法技能） */
    arcaneFinalIncreaseDamageMultiplier: number;
    /** 秘法額外傷害%加總，已套用於 7 個秘法技能的傷害公式 */
    arcaneExtraDamagePercent: number;
    /** 穆利亞斯的遺物：高潔誓約每秒犧牲恢復量加成（純顯示用） */
    sacrificeRegenPerSecond: number;
    /** 保護減算（未套用破防結果時為 1） */
    protectionReduction: number;
    activeTags: SetEffectTag[];
}

function collectActiveTags(weapon: WeaponPreset, shield: ShieldPreset): Set<SetEffectTag> {
    const tags = new Set<SetEffectTag>();
    weapon.tags?.forEach((t) => tags.add(t));
    shield.tags?.forEach((t) => tags.add(t));
    return tags;
}

/** 職業被動：裝備單手武器和盾牌時，銳利增加 3 */
const ONE_HAND_AND_SHIELD_SHARP_BONUS = 3;

/** 實際銳利等級 = 手動輸入的裝備銳利 + 單手武器搭配盾牌的職業被動（雙手劍且無法配盾時盾牌視為無） */
export function getEffectiveSharpLevel(settings: ShieldKnightSettings): number {
    const build = getCharacterBuild(settings.characterBuildId);
    const shieldEquipped =
        settings.shieldId !== "none" && !(settings.weaponType === "two_hand_sword" && !build.allowTwoHandSwordWithShield);
    const passive = settings.weaponType === "one_hand_axe" && shieldEquipped ? ONE_HAND_AND_SHIELD_SHARP_BONUS : 0;
    return settings.sharpLevel + passive;
}

/**
 * 計算順序：
 * 面板最大傷害 → 髒髒/乾淨 → 攻擊係數/常數攻擊力 → 最終最大傷害
 * → 暴擊傷害% / 額外傷害倍率 / 才能增加傷害倍率 / 最終增加傷害倍率
 * → 重擊/風車/突擊 基礎倍率 → 才能技能最終傷害（餵給秘法技能當輸入項）
 * → 生命值/防禦（高潔誓約）→ 最終面板
 */
export function calculateAll(settings: ShieldKnightSettings): CalculationResult {
    const weapon = getWeaponPreset(settings.weaponType, settings.weaponId);
    const build = getCharacterBuild(settings.characterBuildId);
    // 只有巨人可以雙手劍+盾牌，其餘型態選雙手劍時盾牌強制視為「無」
    const effectiveShieldId = settings.weaponType === "two_hand_sword" && !build.allowTwoHandSwordWithShield ? "none" : settings.shieldId;
    const shield = getShieldPreset(effectiveShieldId);
    const tags = collectActiveTags(weapon, shield);
    if (settings.manualChargeEnhanceActive) tags.add("charge_enhance");
    if (settings.manualSmashEnhanceActive) tags.add("smash_enhance");
    if (settings.manualWindmillBase30Active) tags.add("windmill_enhance");
    const hasMagicCircle = (id: MagicCircleId) => settings.magicCircleIds.includes(id);

    // ── 最終最大傷害 ──
    const dirty = calculateDirtyMaxDamage({
        masterGradeActive: settings.dirtyMaxDamage.masterGradeActive,
        masterGradeCategory: "other",
        transformationId: settings.dirtyMaxDamage.transformationActive ? build.transformationId : "none",
        transformationReforgeLevel: settings.transformationReforgeLevel,
        petIds: settings.dirtyMaxDamage.petIds,
        banquetBonus: settings.dirtyMaxDamage.banquetBonus,
        eventBonus: settings.dirtyMaxDamage.eventBonus,
        holyWaterMaxDamage: sumHolyWater(settings.holyWater, "maxDamage"),
    });
    // 面板已計入髒髒加成時，髒髒欄位只作唯讀參考，不參與乾淨/最終最大傷害計算（避免重複扣/加）
    const effectiveDirtyTotal = settings.dirtyMaxDamage.panelAlreadyIncludesDirty ? 0 : dirty.total;
    const spiritWeaponType: SpiritWeaponAttackType = settings.weaponType === "two_hand_sword" ? "two_hand_sword" : "one_hand_axe";
    // 精靈武器攻擊力強化通常已包含在無狀態面板內：從面板扣掉（不吃攻擊係數）、最後再加回常數攻擊力；
    // 面板已計入模式下整組不參與，維持留在面板裡吃係數（同髒髒的規則）
    const spiritWeaponPart = settings.spiritWeaponAttackActive && !settings.dirtyMaxDamage.panelAlreadyIncludesDirty ? SPIRIT_WEAPON_ATTACK_BONUS[spiritWeaponType] : 0;
    const cleanMaxDamage = calculateCleanMaxDamage(settings.panelMaxDamage, effectiveDirtyTotal + spiritWeaponPart);
    const constantAttackPower = calculateConstantAttackPower({
        spiritWeaponActive: spiritWeaponPart > 0,
        spiritWeaponType,
        arcanaSyncClass: "none",
        extraFlat: shield.maxDamageFlat ?? 0,
    });
    const maxDamage = calculateFinalMaxDamage(cleanMaxDamage, effectiveDirtyTotal, constantAttackPower, settings.attackCoefficient);

    // ── 破防結果（A 組、物理側）：保護減算、所受傷害增加、暴擊傷害 debuff ──
    const armorBreak = settings.armorBreak.enabled ? settings.armorBreak : null;
    // 保護：先扣%、再扣固定（面板已算好 protBeforePierce）、最後扣銳利（每級 −5，扣除怪物銳利抵抗），無條件捨去後查減傷表
    const protectionReduction = armorBreak
        ? 1 - protRate(Math.max(0, armorBreak.protBeforePierce - Math.max(0, getEffectiveSharpLevel(settings) - armorBreak.pierceResist) * 5))
        : 1;

    // ── 暴擊傷害% ──
    const reformMaxStage = specialReformMaxStage(settings.weaponId);
    const reformRStage = normalizeSpecialReformStage(settings.criticalDamage.weaponSpecialReforgeTier, reformMaxStage);
    const reformSStage = normalizeSpecialReformStage(settings.weaponSpecialReformSStage, reformMaxStage);
    const criticalDamagePercent = calculateCriticalDamagePercent({
        ...settings.criticalDamage,
        weaponSpecialReforgeCritPercent: specialReformRCrit(reformRStage),
        classBonusPercent: 0,
        holyWaterPercent: sumHolyWater(settings.holyWater, "criticalDamage"),
    });
    const criticalRatePercent = calculateCriticalRatePercent(settings.criticalRate);
    const criticalDamageExpected = calculateCriticalDamageExpected(criticalDamagePercent, criticalRatePercent);

    // ── 額外傷害（通用額外傷害倍率） ──
    const isOneHandWeapon = settings.weaponType === "one_hand_axe";
    const weaponExtraDamagePercent = weapon.extraDamagePercent + (isOneHandWeapon ? (shield.oneHandWeaponExtraDamagePercent ?? 0) : 0);
    // 破防的「暴擊時通用額外傷害」（例如銳利目光）非暴擊不套用，用暴擊率換算成期望值近似，跟全引擎的期望值作法一致
    const critOnlyGeneralExtraPercent = ((armorBreak?.critDamagePercent ?? 0) * criticalRatePercent) / 100;
    const generalExtraDamageMultiplier =
        calculateGeneralExtraDamageMultiplier({
            ...settings.extraDamage,
            weaponExtraDamagePercent,
            generalBonusPercent: specialReformSExtra(reformSStage),
        }) * (1 + critOnlyGeneralExtraPercent / 100);

    // ── 才能增加傷害（種族技能 × 猛擊，乘算） ──
    // 種族特殊技能是主動開啟的技能，不是被動固定套用，所以要 raceSkillActive 開啟才算
    const raceSkill = getRaceSkillInfo(build);
    const mengJiPercent = settings.showMengJiSkill ? MENG_JI_STACKS[settings.mengJiStack - 1].extraDamagePercent : 0;
    const talentIncreaseDamageMultiplier = calculateTalentIncreaseDamageMultiplier({
        raceSkillPercent: settings.raceSkillActive ? raceSkill.percent : 0,
        mengJiPercent,
    });

    // ── 秘法額外傷害（僅套用於 7 個秘法技能的傷害公式，重擊/風車/突擊/猛擊等才能技能不吃） ──
    const arcaneExtraDamagePercent = calculateArcaneExtraDamagePercent(settings.arcaneExtraDamage);

    // ── 最終增加傷害（乘算） ──
    // 穆利亞斯的遺物：犧牲之懲戒觸發省察的痕跡時，秘法技能傷害（最終增加傷害）+0.5%/級，只乘在 7 個秘法技能
    const reflectionTracePercent =
        settings.muliasRelic.reflectionTraceLevel * MULIAS_RELIC_REFLECTION_TRACE_PER_LEVEL * coverageRatio(settings.muliasRelic.reflectionTraceCoveragePercent);
    // 死神烙印／憤怒衝擊／命運編織（倒吊人）／洞察之眼／幸運草標記都改由「破防」面板提供（所受傷害增加、近戰技能傷害），這裡只留戰鬥服務與強力威光
    const finalIncreaseDamageMultiplier =
        (1 + (settings.finalIncreaseDamage.combatServiceBuffActive ? 1 : 0) / 100) *
        (1 + (settings.finalIncreaseDamage.dakotaGlowActive ? 5 : 0) / 100) *
        (1 + (armorBreak?.damageTakenPercent ?? 0) / 100) *
        (1 + (armorBreak && settings.rageImpactBuffActive ? armorBreak.meleePercent * coverageRatio(settings.rageImpactCoveragePercent) : 0) / 100);
    const arcaneFinalIncreaseDamageMultiplier = finalIncreaseDamageMultiplier * (1 + reflectionTracePercent / 100);

    // 穆利亞斯的遺物：高潔誓約每秒犧牲恢復量 +0.05/級（純顯示用，目前無基準值可疊加）
    const sacrificeRegenPerSecond = settings.muliasRelic.sacrificeRegenLevel * MULIAS_RELIC_SACRIFICE_REGEN_PER_LEVEL;

    // ── 重擊 / 風車 / 突擊 / 猛擊 倍率（皆為未含連續技卡片的有效倍率，連續技卡片依使用次數另外處理） ──
    const tagPercent = (tag: keyof typeof SET_EFFECT_VALUE_PERCENT) => (tags.has(tag) ? SET_EFFECT_VALUE_PERCENT[tag] : 0);
    const isTwoHand = settings.weaponType === "two_hand_sword";

    // 重擊 = (基礎+魔法陣+細工) × 雙手武器 1.2 × (1+重擊最終傷害增加) × (1+武器重擊傷害增加+重擊套裝+連續技卡片)
    // 細工與聚能提供的倍率都算在基礎裡；重擊的單手武器聚能（+60%）只有單手劍才有，本計算器沒有單手劍，所以不計
    const smashBase =
        BASE_SKILL_RATIOS.smash +
        sumReforgeLevels(settings.reforge, "smash") * REFORGE_PER_LEVEL.smash +
        (hasMagicCircle("smash_damage") ? 100 : 0);
    const smashMultiplier = (isTwoHand ? 1.2 : 1) * (1 + (weapon.smashFinalIncreasePercent ?? 0) / 100);
    const smashAdditive = ((weapon.smashDamageIncreasePercent ?? 0) + tagPercent("smash_enhance")) / 100;

    // 風車 = (500%+細工+風車套裝30%+單手斧聚能) × (1+風車套裝_10) × (1+風車套裝_15) × (1+連續技卡片)
    // 單手斧聚能（S50）+100%，黑暗聚能（50）+100%
    const windmillBase =
        BASE_SKILL_RATIOS.windmill +
        sumReforgeLevels(settings.reforge, "windmill") * REFORGE_PER_LEVEL.windmill +
        tagPercent("windmill_enhance") +
        (!isTwoHand && settings.ergActive ? 100 : 0) +
        (!isTwoHand && settings.darkErgActive ? 100 : 0);
    const windmillMultiplier = (1 + tagPercent("windmill_enhance2_10") / 100) * (1 + tagPercent("windmill_enhance2") / 100);

    // 突擊維持原本算法
    const chargeBase =
        BASE_SKILL_RATIOS.charge + sumReforgeLevels(settings.reforge, "charge") * REFORGE_PER_LEVEL.charge + (hasMagicCircle("charge_damage") ? 60 : 0);
    const chargeMultiplier = tags.has("charge_enhance") ? 1.15 : 1;

    // 猛擊 = (層數基礎+魔法陣+單手精靈武器20%) × (1+猛擊最終傷害增加) × (1+猛擊套裝+猛擊套裝象徵+連續技卡片)
    const mengJiBase =
        MENG_JI_STACKS[settings.mengJiStack - 1].ratio +
        (hasMagicCircle("meng_ji_damage") ? 40 : 0) +
        (!isTwoHand && settings.spiritWeaponAttackActive ? 20 : 0);
    const mengJiMultiplier = 1 + (weapon.bashFinalIncreasePercent ?? 0) / 100;
    const mengJiAdditive = (tagPercent("bash_enhance") + tagPercent("bash_enhance_sp")) / 100;

    const smashRatio = smashBase * smashMultiplier * (1 + smashAdditive);
    const windmillRatio = windmillBase * windmillMultiplier;
    const chargeRatio = chargeBase * chargeMultiplier;
    const mengJiRatio = mengJiBase * mengJiMultiplier * (1 + mengJiAdditive);

    const talentDamage = (skillRatioPercent: number) =>
        calculateTalentSkillDamage({
            finalAttackPower: maxDamage,
            skillRatioPercent,
            criticalDamagePercent: criticalDamageExpected,
            generalExtraDamageMultiplier,
            talentExtraDamagePercent: 0,
            talentIncreaseDamageMultiplier,
            finalIncreaseDamageMultiplier,
            protectionReduction,
        });

    const abilities: AbilityValues = {
        smashRatio,
        windmillRatio,
        chargeRatio,
        mengJiRatio,
        ratioAdditives: { smash: smashAdditive, windmill: 0, mengJi: mengJiAdditive },
        ratioMultipliers: {
            smash: smashMultiplier * (1 + smashAdditive),
            windmill: windmillMultiplier,
            charge: chargeMultiplier,
        },
        smashDamage: talentDamage(smashRatio),
        windmillDamage: talentDamage(windmillRatio),
        chargeDamage: talentDamage(chargeRatio),
        windmillTargetDamage: calculateTalentSkillTargetDamage({
            finalAttackPower: maxDamage,
            skillRatioPercent: windmillRatio,
            criticalDamagePercent: criticalDamageExpected,
        }),
        chargeTargetDamage: calculateTalentSkillTargetDamage({
            finalAttackPower: maxDamage,
            skillRatioPercent: chargeRatio,
            criticalDamagePercent: criticalDamageExpected,
        }),
    };

    // ── 生命值 / 防禦 ──
    // 面板已含聖水時不再自動加總聖水（避免重複計算）；鍋子等盾牌固定加成跟聖水無關，維持自動加總
    // 「上完buff」面板先還原成高潔誓約前的原始值，再加聖水與盾牌固定值，最後依目前是否發動高潔誓約重新套用（含上限），
    // 這樣聖水的 HP／防禦／魔防會吃到高潔誓約的加乘，也會受上限限制
    const rawCharacter = toRawCharacterStats(settings.character);
    const holyWater = (id: HolyWaterAbilityId) => (settings.character.panelIncludesHolyWater ? 0 : sumHolyWater(settings.holyWater, id));
    const withOath = (key: OathStatKey, base: number) => (settings.nobleOathEnabled ? applyNobleOath(key, base) : base);
    const maxHp = withOath("maxHp", rawCharacter.maxHp + holyWater("maxHp") + (shield.hpFlat ?? 0));
    const defense = withOath("defense", rawCharacter.defense + holyWater("defense"));
    const magicDefense = withOath("magicDefense", rawCharacter.magicDefense + holyWater("magicDefense"));
    const protection = withOath("protection", rawCharacter.protection);
    const magicProtection = withOath("magicProtection", rawCharacter.magicProtection);

    const passiveDefensePower = maxDamage * MAX_DAMAGE_TO_DEFENSE_POWER_RATE;
    const defensePower = defense + protection + magicDefense + magicProtection + passiveDefensePower;

    const finalStats: FinalStats = {
        maxDamage,
        maxHp,
        defense,
        protection,
        magicDefense,
        magicProtection,
        defensePower,
        shieldDamageReduction: shield.reduction,
    };

    return {
        finalStats,
        abilities,
        cleanMaxDamage,
        dirtyMaxDamageTotal: dirty.total,
        constantAttackPower,
        weaponExtraDamagePercent,
        criticalDamagePercent,
        criticalRatePercent,
        criticalDamageExpected,
        generalExtraDamageMultiplier,
        talentIncreaseDamageMultiplier,
        finalIncreaseDamageMultiplier,
        arcaneFinalIncreaseDamageMultiplier,
        arcaneExtraDamagePercent,
        sacrificeRegenPerSecond,
        protectionReduction,
        activeTags: Array.from(tags),
    };
}

// ═══════════════════════════════════════════════════════
//  技能傷害
// ═══════════════════════════════════════════════════════

export type SkillId =
    | "holy-sanctuary"
    | "instant-taunt"
    | "shield-charge"
    | "iron-wall-strike"
    | "judgement-strike"
    | "sacrifice-punishment"
    | "radiant-judgement"
    | "smash-hit"
    | "windmill-hit"
    | "meng-ji";

/** 全部技能的顯示順序＋名稱＋技能圖示 ID（對應 src/utils/image.ts 的 getSkillIcon），供各分頁共用 */
export const ALL_SKILL_META: { id: SkillId; label: string; imageId: number }[] = [
    { id: "holy-sanctuary", label: "聖域展開", imageId: 59080 },
    { id: "instant-taunt", label: "零秒嘲諷", imageId: 59081 },
    { id: "shield-charge", label: "盾擊衝鋒", imageId: 59082 },
    { id: "iron-wall-strike", label: "盾崩強襲", imageId: 59083 },
    { id: "judgement-strike", label: "審判重擊", imageId: 59084 },
    { id: "sacrifice-punishment", label: "犧牲懲戒", imageId: 59085 },
    { id: "radiant-judgement", label: "光輝斷罪", imageId: 59087 },
    { id: "smash-hit", label: "重擊", imageId: 20002 },
    { id: "windmill-hit", label: "風車", imageId: 22001 },
    { id: "meng-ji", label: "猛擊", imageId: 20019 },
];

export type SkillUsageCounts = Record<SkillId, number>;

export function createDefaultSkillUsageCounts(): SkillUsageCounts {
    return Object.fromEntries(ALL_SKILL_META.map((s) => [s.id, 0])) as SkillUsageCounts;
}

export interface SkillDamageTerm {
    label: string;
    ratioPercent: number;
    statValue: number;
    amount: number;
}

export interface SkillDamageResult {
    skillId: SkillId;
    name: string;
    terms: SkillDamageTerm[];
    rawDamage: number;
    passiveLabel?: string;
    passiveMultiplier: number;
    finalDamage: number;
    sacrificeGain: number;
    sacrificeNote?: string;
    cooldownText: string;
    locked?: boolean;
    lockedReason?: string;
    /** 僅聖域庇護：15 秒內 10 次的總傷害 */
    totalOverDuration?: number;
    /** 僅光輝之審判：三個階段各自的結果 */
    stages?: RadiantJudgementStageResult[];
}

export interface RadiantJudgementStageResult {
    stage: 1 | 2 | 3;
    finalDamage: number;
    sacrificeGain: number;
}

/**
 * 預留：瑪奇實際傷害公式（對怪物防禦/保護的扣減）尚未用實測資料反推出來，
 * 目前直接四捨五入回傳「聖盾騎士技能傷害」本身。之後校正公式時只需要改這裡。
 */
export function applyFinalDamageFormula(damage: number, _context: { skillId: SkillId; finalStats: FinalStats }): number {
    return Math.round(damage);
}

function sumTerms(terms: SkillDamageTerm[]): number {
    return terms.reduce((sum, t) => sum + t.amount, 0);
}

function makeTerm(label: string, ratioPercent: number, statValue: number): SkillDamageTerm {
    return { label, ratioPercent, statValue, amount: (ratioPercent / 100) * statValue };
}

/** 秘法技能公式共用的攻擊力/暴擊傷害/額外傷害/增傷輸入，7 個秘法技能共用同一份 */
export interface ArcaneSharedParams {
    criticalDamagePercent: number;
    generalExtraDamageMultiplier: number;
    talentIncreaseDamageMultiplier: number;
    arcaneExtraDamagePercent: number;
    finalIncreaseDamageMultiplier: number;
    /** 保護減算（1＝不扣減；套用破防結果時為 1 − 破後物理減傷率） */
    protectionReduction: number;
}

/**
 * 統一呼叫 `calculateArcaneSkillDamage` 再走過預留的最終傷害公式介面。
 * 沒有借用才能技能的技能，`countedTalentSkillTargetDamage` 傳 0 即可（退化成純秘法技能）。
 */
function finalizeArcaneSkill(
    skillId: SkillId,
    finalStats: FinalStats,
    countedTalentSkillTargetDamage: number,
    arcaneOnlyRawDamage: number,
    shared: ArcaneSharedParams,
): number {
    return applyFinalDamageFormula(
        calculateArcaneSkillDamage({
            countedTalentSkillTargetDamage,
            arcaneOnlyRawDamage,
            criticalDamagePercent: shared.criticalDamagePercent,
            talentExtraDamagePercent: 0,
            talentIncreaseDamageMultiplier: shared.talentIncreaseDamageMultiplier,
            generalExtraDamageMultiplier: shared.generalExtraDamageMultiplier,
            arcaneExtraDamagePercent: shared.arcaneExtraDamagePercent,
            finalIncreaseDamageMultiplier: shared.finalIncreaseDamageMultiplier,
            protectionReduction: shared.protectionReduction,
        }),
        { skillId, finalStats },
    );
}

export function calculateHolySanctuary(finalStats: FinalStats, shared: ArcaneSharedParams): SkillDamageResult {
    const terms = [
        makeTerm("基礎傷害", 300, finalStats.maxDamage),
        makeTerm("加護力", 150, finalStats.defensePower),
        makeTerm("最大生命", 20, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const passiveMultiplier = 2; // 被動：聖域持續傷害 +100%
    const arcaneOnlyRawDamage = rawDamage * passiveMultiplier;
    const finalDamage = finalizeArcaneSkill("holy-sanctuary", finalStats, 0, arcaneOnlyRawDamage, shared);
    return {
        skillId: "holy-sanctuary",
        name: "聖域展開",
        terms,
        rawDamage,
        passiveLabel: "聖域持續傷害 +100%",
        passiveMultiplier,
        finalDamage,
        sacrificeGain: 1,
        sacrificeNote: "每次 tick +1（15 秒內共 10 次，總計 +10）",
        cooldownText: "CD 40 秒（持續 15 秒，每 1.5 秒觸發一次，共 10 次）",
        totalOverDuration: finalDamage * 10,
    };
}

export function calculateInstantTaunt(finalStats: FinalStats, shared: ArcaneSharedParams): SkillDamageResult {
    const terms = [
        makeTerm("基礎傷害", 0, finalStats.maxDamage),
        makeTerm("加護力", 200, finalStats.defensePower),
        makeTerm("最大生命", 15, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const finalDamage = finalizeArcaneSkill("instant-taunt", finalStats, 0, rawDamage, shared);
    return {
        skillId: "instant-taunt",
        name: "零秒嘲諷",
        terms,
        rawDamage,
        passiveMultiplier: 1,
        finalDamage,
        sacrificeGain: 0,
        cooldownText: "範圍 7.5m（主要用途：嘲諷拉怪）",
    };
}

export function calculateShieldCharge(finalStats: FinalStats, chargeDamage: number, chargeTargetDamage: number, shared: ArcaneSharedParams): SkillDamageResult {
    const chargeRatio = 150;
    const terms = [
        makeTerm("衝撞傷害", chargeRatio, chargeDamage),
        makeTerm("基礎傷害", 800, finalStats.maxDamage),
        makeTerm("加護力", 600, finalStats.defensePower),
        makeTerm("最大生命", 50, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const countedTalentSkillTargetDamage = (chargeRatio / 100) * chargeTargetDamage;
    const arcaneOnlyRawDamage = (800 / 100) * finalStats.maxDamage + (600 / 100) * finalStats.defensePower + (50 / 100) * finalStats.maxHp;
    const finalDamage = finalizeArcaneSkill("shield-charge", finalStats, countedTalentSkillTargetDamage, arcaneOnlyRawDamage, shared);
    return {
        skillId: "shield-charge",
        name: "盾擊衝鋒",
        terms,
        rawDamage,
        passiveMultiplier: 1,
        finalDamage,
        sacrificeGain: 0,
        cooldownText: "距離 ≤5m：3 秒；超過 5m 每 +2m 再 +1 秒",
    };
}

export function calculateIronWallStrike(finalStats: FinalStats, windmillDamage: number, windmillTargetDamage: number, shared: ArcaneSharedParams): SkillDamageResult {
    const windmillRatio = 150;
    const terms = [
        makeTerm("風車傷害", windmillRatio, windmillDamage),
        makeTerm("基礎傷害", 1200, finalStats.maxDamage),
        makeTerm("加護力", 600, finalStats.defensePower),
        makeTerm("最大生命", 100, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const countedTalentSkillTargetDamage = (windmillRatio / 100) * windmillTargetDamage;
    const arcaneOnlyRawDamage = (1200 / 100) * finalStats.maxDamage + (600 / 100) * finalStats.defensePower + (100 / 100) * finalStats.maxHp;
    const finalDamage = finalizeArcaneSkill("iron-wall-strike", finalStats, countedTalentSkillTargetDamage, arcaneOnlyRawDamage, shared);
    return {
        skillId: "iron-wall-strike",
        name: "盾崩強襲",
        terms,
        rawDamage,
        passiveMultiplier: 1,
        finalDamage,
        sacrificeGain: 0,
        sacrificeNote: "生效中 1.5 秒內受到傷害 -50%；高潔誓約狀態下，每受到一次符合條件的攻擊 +7 犧牲（見下方 HIT 數計算）",
        cooldownText: "CD 7 秒",
    };
}

export function calculateJudgementStrike(
    finalStats: FinalStats,
    windmillDamage: number,
    windmillTargetDamage: number,
    nobleOathEnabled: boolean,
    /** 穆利亞斯的遺物：審判一擊基礎傷害比例額外加成%（Lv×100） */
    baseRatioBonus: number,
    shared: ArcaneSharedParams,
): SkillDamageResult {
    const windmillRatio = 200;
    const baseRatio = 3500 + baseRatioBonus;
    const terms = [
        makeTerm("風車傷害", windmillRatio, windmillDamage),
        makeTerm("基礎傷害", baseRatio, finalStats.maxDamage),
        makeTerm("加護力", 2000, finalStats.defensePower),
        makeTerm("最大生命", 500, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const passiveMultiplier = 1.2; // 職業被動：傷害額外 +20%（審視的痕跡 +10% 屬第二階段功能，尚未實作）
    // 職業被動對整個技能傷害生效，才能部分與秘法部分都要各自乘上這個倍率
    const countedTalentSkillTargetDamage = (windmillRatio / 100) * windmillTargetDamage * passiveMultiplier;
    const arcaneOnlyRawDamage =
        ((baseRatio / 100) * finalStats.maxDamage + (2000 / 100) * finalStats.defensePower + (500 / 100) * finalStats.maxHp) * passiveMultiplier;
    const finalDamage = finalizeArcaneSkill("judgement-strike", finalStats, countedTalentSkillTargetDamage, arcaneOnlyRawDamage, shared);
    return {
        skillId: "judgement-strike",
        name: "審判重擊",
        terms,
        rawDamage,
        passiveLabel: "職業被動 +20%",
        passiveMultiplier,
        finalDamage,
        sacrificeGain: nobleOathEnabled ? 10 : 0,
        sacrificeNote: nobleOathEnabled ? "高潔誓約：+10 犧牲" : "需開啟高潔誓約才能獲得犧牲",
        cooldownText: "CD 9 秒",
    };
}

export function calculateSacrificePunishment(finalStats: FinalStats, currentSacrifice: number, shared: ArcaneSharedParams): SkillDamageResult {
    const terms = [
        makeTerm("基礎傷害", 6000, finalStats.maxDamage),
        makeTerm("加護力", 4000, finalStats.defensePower),
        makeTerm("最大生命", 1500, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const passiveMultiplier = 1.15; // 職業被動：犧牲之懲戒傷害 +15%
    const shieldMultiplier = 1 + finalStats.shieldDamageReduction;
    const arcaneOnlyRawDamage =
        ((6000 / 100) * finalStats.maxDamage + (4000 / 100) * finalStats.defensePower + (1500 / 100) * finalStats.maxHp) *
        shieldMultiplier *
        passiveMultiplier;
    const finalDamage = finalizeArcaneSkill("sacrifice-punishment", finalStats, 0, arcaneOnlyRawDamage, shared);
    const locked = currentSacrifice < SACRIFICE_CAP;
    return {
        skillId: "sacrifice-punishment",
        name: "犧牲懲戒",
        terms,
        rawDamage,
        passiveLabel: `盾牌減傷 ×${shieldMultiplier.toFixed(2)}、職業被動 +15%`,
        passiveMultiplier,
        finalDamage,
        sacrificeGain: 0,
        sacrificeNote: "使用後犧牲值歸零",
        cooldownText: "-",
        locked,
        lockedReason: locked ? `犧牲需達 ${SACRIFICE_CAP} 才能使用（目前 ${currentSacrifice}）` : undefined,
    };
}

const RADIANT_JUDGEMENT_STAGE_RATIOS = [
    { stage: 1 as const, base: 1500, defensePower: 900, maxHp: 150, sacrificeGain: 0 },
    { stage: 2 as const, base: 2250, defensePower: 1350, maxHp: 225, sacrificeGain: 1 },
    { stage: 3 as const, base: 3000, defensePower: 1800, maxHp: 300, sacrificeGain: 2 },
];
const RADIANT_JUDGEMENT_WINDMILL_RATIO = 175;

/**
 * 光輝之審判已正式套用秘法技能公式：借用風車傷害的 175%（風車目標傷害，尚未乘才能增加/最終增加傷害）
 * 當「採計的才能技能目標傷害」，基礎/加護力/最大生命 3 項是純秘法部分。
 */
export function calculateRadiantJudgement(
    finalStats: FinalStats,
    windmillDamage: number,
    windmillTargetDamage: number,
    nobleOathEnabled: boolean,
    currentStage: 1 | 2 | 3,
    shared: ArcaneSharedParams,
): SkillDamageResult {
    const countedTalentSkillTargetDamage = (RADIANT_JUDGEMENT_WINDMILL_RATIO / 100) * windmillTargetDamage;
    const stages: RadiantJudgementStageResult[] = RADIANT_JUDGEMENT_STAGE_RATIOS.map((r) => {
        const arcaneOnlyRawDamage = (r.base / 100) * finalStats.maxDamage + (r.defensePower / 100) * finalStats.defensePower + (r.maxHp / 100) * finalStats.maxHp;
        const finalDamage = finalizeArcaneSkill("radiant-judgement", finalStats, countedTalentSkillTargetDamage, arcaneOnlyRawDamage, shared);
        return {
            stage: r.stage,
            finalDamage,
            sacrificeGain: nobleOathEnabled ? r.sacrificeGain : 0,
        };
    });

    const currentRatios = RADIANT_JUDGEMENT_STAGE_RATIOS[currentStage - 1];
    const terms = [
        makeTerm("風車傷害", RADIANT_JUDGEMENT_WINDMILL_RATIO, windmillDamage),
        makeTerm("基礎傷害", currentRatios.base, finalStats.maxDamage),
        makeTerm("加護力", currentRatios.defensePower, finalStats.defensePower),
        makeTerm("最大生命", currentRatios.maxHp, finalStats.maxHp),
    ];
    const rawDamage = sumTerms(terms);
    const current = stages[currentStage - 1];

    return {
        skillId: "radiant-judgement",
        name: `光輝斷罪（第 ${currentStage} 階段）`,
        terms,
        rawDamage,
        passiveMultiplier: 1,
        finalDamage: current.finalDamage,
        sacrificeGain: current.sacrificeGain,
        sacrificeNote: nobleOathEnabled && currentRatios.sacrificeGain > 0 ? `高潔誓約：+${currentRatios.sacrificeGain} 犧牲` : undefined,
        cooldownText: "使用後階段循環 1 → 2 → 3 → 1",
        stages,
    };
}

/** 光輝斷罪 1/2/3 階段循環使用，依總使用次數平均分配到 3 階段，餘數依序給前面的階段（配合 1→2→3→1 循環順序） */
function distributeRadiantJudgementStageCounts(usageCount: number): [number, number, number] {
    if (usageCount <= 0) return [0, 0, 0];
    const base = Math.floor(usageCount / 3);
    const remainder = usageCount % 3;
    return [base + (remainder > 0 ? 1 : 0), base + (remainder > 1 ? 1 : 0), base];
}

/**
 * 依使用次數把光輝斷罪的 finalDamage 改成「依 1/2/3 階段分配後的加權平均單次傷害」，
 * 這樣既有的「finalDamage × 使用次數＝小計」架構不用改，小計就會自動變成三階段分配後的正確總和。
 */
function applyRadiantJudgementDistribution(result: SkillDamageResult, usageCount: number): SkillDamageResult {
    if (!result.stages || usageCount <= 0) return result;
    const [c1, c2, c3] = distributeRadiantJudgementStageCounts(usageCount);
    const subtotal = result.stages[0].finalDamage * c1 + result.stages[1].finalDamage * c2 + result.stages[2].finalDamage * c3;
    return {
        ...result,
        name: `光輝斷罪（1/2/3 階段：${c1}/${c2}/${c3}）`,
        finalDamage: Math.round(subtotal / usageCount),
    };
}

/** 重擊（顯示用）：與其他技能吃的「重擊傷害」才能技能最終傷害同一個基礎倍率 */
export function calculateSmashHit(finalStats: FinalStats, smashRatio: number, smashDamage: number): SkillDamageResult {
    const terms = [makeTerm("基礎傷害", smashRatio, finalStats.maxDamage)];
    return {
        skillId: "smash-hit",
        name: "重擊",
        terms,
        rawDamage: sumTerms(terms),
        passiveMultiplier: 1,
        finalDamage: Math.round(smashDamage),
        sacrificeGain: 0,
        cooldownText: "-",
    };
}

/** 風車（顯示用）：與鐵壁猛擊/審判一擊/光輝之審判吃的「風車傷害」才能技能最終傷害同一個基礎倍率 */
export function calculateWindmillHit(finalStats: FinalStats, windmillRatio: number, windmillDamage: number): SkillDamageResult {
    const terms = [makeTerm("基礎傷害", windmillRatio, finalStats.maxDamage)];
    return {
        skillId: "windmill-hit",
        name: "風車",
        terms,
        rawDamage: sumTerms(terms),
        passiveMultiplier: 1,
        finalDamage: Math.round(windmillDamage),
        sacrificeGain: 0,
        cooldownText: "-",
    };
}

/**
 * 猛擊：獨立技能，不影響鐵壁猛擊。ratio 是已經乘好魔法陣/精靈武器/猛擊套裝/連續技卡片等全部加成的有效倍率，
 * 由 calculateAll 算好傳進來（公式見該處）。
 */
export function calculateMengJi(
    finalStats: FinalStats,
    stack: 1 | 2 | 3 | 4 | 5,
    ratio: number,
    magicCircleActive: boolean,
    criticalDamagePercent: number,
    generalExtraDamageMultiplier: number,
    talentIncreaseDamageMultiplier: number,
    finalIncreaseDamageMultiplier: number,
    protectionReduction = 1,
): SkillDamageResult {
    const stackInfo = MENG_JI_STACKS[stack - 1];
    const terms = [makeTerm("基礎傷害", ratio, finalStats.maxDamage)];
    const finalDamage = Math.round(
        calculateTalentSkillDamage({
            finalAttackPower: finalStats.maxDamage,
            skillRatioPercent: ratio,
            criticalDamagePercent,
            generalExtraDamageMultiplier,
            talentExtraDamagePercent: 0,
            talentIncreaseDamageMultiplier,
            finalIncreaseDamageMultiplier,
            protectionReduction,
        }),
    );
    return {
        skillId: "meng-ji",
        name: `猛擊（第 ${stack} 層）`,
        terms,
        rawDamage: sumTerms(terms),
        passiveLabel: magicCircleActive ? "魔法陣：猛擊打擊傷害 +40%（已併入基礎倍率）" : undefined,
        passiveMultiplier: 1,
        finalDamage,
        sacrificeGain: 0,
        sacrificeNote: `近戰才能技能傷害 +${stackInfo.extraDamagePercent}%（已併入才能增加傷害）；每次使用 +1 階，滿 5 階持續 20 秒，時間到降 1 階`,
        cooldownText: "-",
    };
}

export function calculateAllSkills(
    finalStats: FinalStats,
    windmillDamage: number,
    chargeDamage: number,
    windmillTargetDamage: number,
    chargeTargetDamage: number,
    nobleOathEnabled: boolean,
    currentSacrifice: number,
    radiantJudgementStage: 1 | 2 | 3,
    /** 穆利亞斯的遺物：審判一擊基礎傷害比例額外加成%（Lv×100） */
    judgementStrikeBaseBonus: number,
    shared: ArcaneSharedParams,
): SkillDamageResult[] {
    return [
        calculateHolySanctuary(finalStats, shared),
        calculateInstantTaunt(finalStats, shared),
        calculateShieldCharge(finalStats, chargeDamage, chargeTargetDamage, shared),
        calculateIronWallStrike(finalStats, windmillDamage, windmillTargetDamage, shared),
        calculateJudgementStrike(finalStats, windmillDamage, windmillTargetDamage, nobleOathEnabled, judgementStrikeBaseBonus, shared),
        calculateSacrificePunishment(finalStats, currentSacrifice, shared),
        calculateRadiantJudgement(finalStats, windmillDamage, windmillTargetDamage, nobleOathEnabled, radiantJudgementStage, shared),
    ];
}

/** 技能卡片的暴擊顯示模式：沒暴擊＝固定用 100%（視為必定不暴擊）；暴擊＝固定用暴擊當下的原始暴擊傷害%（視為必定暴擊）；期望值＝預設，依暴擊率加權平均 */
export type CritDisplayMode = "noCrit" | "crit" | "expected";

/**
 * 依設定算出全部 10 個技能的傷害結果（不篩選顯示開關，供「技能使用次數」/「裝備比較」/「傷害效益」共用）。
 * radiantJudgementUsageCount：光輝斷罪用來分配 1/2/3 階段次數的使用次數，預設吃 settings 自己的
 * skillUsageCounts；「裝備比較」需要比較別的配置時，外部會改傳目前分頁的使用次數，維持跟「總輸出」一致。
 * critMode：只給「技能傷害」卡片顯示用的暴擊模式切換，預設「期望值」（跟其餘所有計算一致）；
 * 選「沒暴擊」「暴擊」時，連同風車/突擊/重擊/猛擊等才能技能餵給秘法技能的「才能技能目標傷害」都要重算，
 * 不能只換 shared.criticalDamagePercent，否則 7 個秘法技能借用的才能傷害還是用期望值算的。
 */
export function calculateSkillsForSettings(
    settings: ShieldKnightSettings,
    usageCounts: SkillUsageCounts = settings.skillUsageCounts,
    critMode: CritDisplayMode = "expected",
): SkillDamageResult[] {
    const radiantJudgementUsageCount = usageCounts["radiant-judgement"] ?? 0;
    const calcResult = calculateAll(settings);
    const { finalStats, abilities } = calcResult;
    const effectiveCritPercent =
        critMode === "noCrit" ? 100 : critMode === "crit" ? calcResult.criticalDamagePercent : calcResult.criticalDamageExpected;
    const talentDamage = (skillRatioPercent: number) =>
        calculateTalentSkillDamage({
            finalAttackPower: finalStats.maxDamage,
            skillRatioPercent,
            criticalDamagePercent: effectiveCritPercent,
            generalExtraDamageMultiplier: calcResult.generalExtraDamageMultiplier,
            talentExtraDamagePercent: 0,
            talentIncreaseDamageMultiplier: calcResult.talentIncreaseDamageMultiplier,
            finalIncreaseDamageMultiplier: calcResult.finalIncreaseDamageMultiplier,
            protectionReduction: calcResult.protectionReduction,
        });
    // 7 個秘法技能借用的才能技能傷害不吃連續技卡片，所以這組用「未含連續技卡片」的倍率
    const windmillDamage = critMode === "expected" ? abilities.windmillDamage : talentDamage(abilities.windmillRatio);
    const chargeDamage = critMode === "expected" ? abilities.chargeDamage : talentDamage(abilities.chargeRatio);
    // 目標傷害（還沒乘保護減算，秘法技能公式自己會乘一次）
    const targetDamage = (skillRatioPercent: number) =>
        calculateTalentSkillTargetDamage({
            finalAttackPower: finalStats.maxDamage,
            skillRatioPercent,
            criticalDamagePercent: effectiveCritPercent,
        });
    const windmillTargetDamage = critMode === "expected" ? abilities.windmillTargetDamage : targetDamage(abilities.windmillRatio);
    const chargeTargetDamage = critMode === "expected" ? abilities.chargeTargetDamage : targetDamage(abilities.chargeRatio);
    // 重擊／風車／猛擊技能本身（卡片與使用次數小計）才吃連續技卡片
    const smashRatio = abilities.smashRatio * comboCardFactor(settings, usageCounts, "smash-hit", abilities.ratioAdditives.smash);
    const windmillRatio = abilities.windmillRatio * comboCardFactor(settings, usageCounts, "windmill-hit", abilities.ratioAdditives.windmill);
    const mengJiRatio = abilities.mengJiRatio * comboCardFactor(settings, usageCounts, "meng-ji", abilities.ratioAdditives.mengJi);
    const smashDamage = talentDamage(smashRatio);
    const windmillHitDamage = talentDamage(windmillRatio);
    const mengJiMagicCircleActive = settings.magicCircleIds.includes("meng_ji_damage");
    const skills = [
        ...calculateAllSkills(
            finalStats,
            windmillDamage,
            chargeDamage,
            windmillTargetDamage,
            chargeTargetDamage,
            settings.nobleOathEnabled,
            settings.currentSacrifice,
            settings.radiantJudgementStage,
            settings.muliasRelic.judgementStrikeLevel * MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL,
            {
                criticalDamagePercent: effectiveCritPercent,
                generalExtraDamageMultiplier: calcResult.generalExtraDamageMultiplier,
                talentIncreaseDamageMultiplier: calcResult.talentIncreaseDamageMultiplier,
                arcaneExtraDamagePercent: calcResult.arcaneExtraDamagePercent,
                finalIncreaseDamageMultiplier: calcResult.arcaneFinalIncreaseDamageMultiplier,
                protectionReduction: calcResult.protectionReduction,
            },
        ),
        calculateSmashHit(finalStats, smashRatio, smashDamage),
        calculateWindmillHit(finalStats, windmillRatio, windmillHitDamage),
        calculateMengJi(
            finalStats,
            settings.mengJiStack,
            mengJiRatio,
            mengJiMagicCircleActive,
            effectiveCritPercent,
            calcResult.generalExtraDamageMultiplier,
            calcResult.talentIncreaseDamageMultiplier,
            calcResult.finalIncreaseDamageMultiplier,
            calcResult.protectionReduction,
        ),
    ];
    return skills.map((s) => (s.skillId === "radiant-judgement" ? applyRadiantJudgementDistribution(s, radiantJudgementUsageCount) : s));
}

/** 總輸出＝Σ（技能傷害 × 使用次數），供「技能使用次數」／「裝備比較」分頁共用 */
export function calculateTotalOutput(settings: ShieldKnightSettings, usageCounts: SkillUsageCounts): number {
    return calculateSkillsForSettings(settings, usageCounts).reduce((sum, skill) => sum + skill.finalDamage * (usageCounts[skill.skillId] ?? 0), 0);
}

// ═══════════════════════════════════════════════════════
//  傷害效益：各屬性 1 單位等同多少「大傷」
//  作法：用有限差分（finite difference）對最終最大傷害／暴擊傷害%／通用額外傷害／
//  才能增加傷害／最終增加傷害 這 5 個聚合槓桿，以及重擊/風車/突擊 3 個細工等級（直接
//  對基礎倍率 flat 加成），分別做極小擾動，量測「總輸出」的邊際變化量，
//  再除以「面板大傷 +1」造成的邊際變化量，換算成「等同多少大傷」。
// ═══════════════════════════════════════════════════════

interface DamageLevers {
    maxDamage: number;
    /** 暴擊傷害%（原始值，尚未換算成期望值） */
    criticalDamagePercent: number;
    criticalRatePercent: number;
    generalExtraDamageMultiplier: number;
    talentIncreaseDamageMultiplier: number;
    finalIncreaseDamageMultiplier: number;
    /** 秘法技能專用（含省察的痕跡），重擊/風車/猛擊不吃省察的痕跡 */
    arcaneFinalIncreaseDamageMultiplier: number;
    /** 秘法額外傷害%，只有 7 個秘法技能（走 calculateArcaneSkillDamage）吃得到，才能技能不吃 */
    arcaneExtraDamagePercent: number;
    protectionReduction: number;
}

function calculateTotalOutputWithLevers(
    levers: DamageLevers,
    finalStatsBase: Pick<FinalStats, "maxHp" | "defense" | "protection" | "magicDefense" | "magicProtection" | "shieldDamageReduction">,
    ratios: Pick<AbilityValues, "smashRatio" | "windmillRatio" | "chargeRatio" | "mengJiRatio" | "ratioAdditives">,
    settings: ShieldKnightSettings,
): number {
    const usageCounts = settings.skillUsageCounts;
    const passiveDefensePower = levers.maxDamage * MAX_DAMAGE_TO_DEFENSE_POWER_RATE;
    const defensePower =
        finalStatsBase.defense + finalStatsBase.protection + finalStatsBase.magicDefense + finalStatsBase.magicProtection + passiveDefensePower;
    const finalStats: FinalStats = { ...finalStatsBase, maxDamage: levers.maxDamage, defensePower };
    const criticalDamageExpected = calculateCriticalDamageExpected(levers.criticalDamagePercent, levers.criticalRatePercent);
    const talentDamage = (skillRatioPercent: number) =>
        calculateTalentSkillDamage({
            finalAttackPower: levers.maxDamage,
            skillRatioPercent,
            criticalDamagePercent: criticalDamageExpected,
            generalExtraDamageMultiplier: levers.generalExtraDamageMultiplier,
            talentExtraDamagePercent: 0,
            talentIncreaseDamageMultiplier: levers.talentIncreaseDamageMultiplier,
            finalIncreaseDamageMultiplier: levers.finalIncreaseDamageMultiplier,
            protectionReduction: levers.protectionReduction,
        });
    const windmillDamage = talentDamage(ratios.windmillRatio);
    const chargeDamage = talentDamage(ratios.chargeRatio);
    const smashRatioWithCombo = ratios.smashRatio * comboCardFactor(settings, usageCounts, "smash-hit", ratios.ratioAdditives.smash);
    const windmillRatioWithCombo = ratios.windmillRatio * comboCardFactor(settings, usageCounts, "windmill-hit", ratios.ratioAdditives.windmill);
    const mengJiRatioWithCombo = ratios.mengJiRatio * comboCardFactor(settings, usageCounts, "meng-ji", ratios.ratioAdditives.mengJi);
    const smashDamage = talentDamage(smashRatioWithCombo);
    const windmillHitDamage = talentDamage(windmillRatioWithCombo);
    const windmillTargetDamage = calculateTalentSkillTargetDamage({
        finalAttackPower: levers.maxDamage,
        skillRatioPercent: ratios.windmillRatio,
        criticalDamagePercent: criticalDamageExpected,
    });
    const chargeTargetDamage = calculateTalentSkillTargetDamage({
        finalAttackPower: levers.maxDamage,
        skillRatioPercent: ratios.chargeRatio,
        criticalDamagePercent: criticalDamageExpected,
    });
    const mengJiMagicCircleActive = settings.magicCircleIds.includes("meng_ji_damage");
    const skills = [
        ...calculateAllSkills(
            finalStats,
            windmillDamage,
            chargeDamage,
            windmillTargetDamage,
            chargeTargetDamage,
            settings.nobleOathEnabled,
            settings.currentSacrifice,
            settings.radiantJudgementStage,
            settings.muliasRelic.judgementStrikeLevel * MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL,
            {
                criticalDamagePercent: criticalDamageExpected,
                generalExtraDamageMultiplier: levers.generalExtraDamageMultiplier,
                talentIncreaseDamageMultiplier: levers.talentIncreaseDamageMultiplier,
                arcaneExtraDamagePercent: levers.arcaneExtraDamagePercent,
                finalIncreaseDamageMultiplier: levers.arcaneFinalIncreaseDamageMultiplier,
                protectionReduction: levers.protectionReduction,
            },
        ),
        calculateSmashHit(finalStats, smashRatioWithCombo, smashDamage),
        calculateWindmillHit(finalStats, windmillRatioWithCombo, windmillHitDamage),
        calculateMengJi(
            finalStats,
            settings.mengJiStack,
            mengJiRatioWithCombo,
            mengJiMagicCircleActive,
            criticalDamageExpected,
            levers.generalExtraDamageMultiplier,
            levers.talentIncreaseDamageMultiplier,
            levers.finalIncreaseDamageMultiplier,
            levers.protectionReduction,
        ),
    ];
    const radiantJudgementUsageCount = settings.skillUsageCounts["radiant-judgement"] ?? 0;
    return skills
        .map((s) => (s.skillId === "radiant-judgement" ? applyRadiantJudgementDistribution(s, radiantJudgementUsageCount) : s))
        .reduce((sum, s) => sum + s.finalDamage * (settings.skillUsageCounts[s.skillId] ?? 0), 0);
}

export interface DamageEfficiencyItem {
    id:
        | "maxDamage"
        | "criticalDamage"
        | "criticalRate"
        | "extraDamage"
        | "talentIncreaseDamage"
        | "finalIncreaseDamage"
        | "smashReforge"
        | "windmillReforge"
        | "chargeReforge"
        | "erg"
        | "darkErg"
        | "raceSkill"
        | "transformation"
        | "rageSet"
        | "battlefield"
        | "statusSupport"
        | "strengthGather"
        | "physicalPotion"
        | "rageCoverage"
        | "reflectionCoverage"
        | "arcaneExtraDamage"
        | "defense"
        | "maxHp"
        | "muliasSacrificeRegen"
        | "muliasReflectionTrace"
        | "muliasJudgementStrike"
        | "sharpLevel"
        | "weaponExtraDamage"
        | "manualWindmillBase30"
        | "manualChargeEnhance"
        | "manualSmashEnhance";
    label: string;
    unit: string;
    /** 1 單位等同多少大傷；目前總輸出為 0（尚未設定技能使用次數）時為 null，無法換算 */
    equivalentMaxDamage: number | null;
    /** 1 單位使總輸出增加的百分比（舊版快照沒有這個欄位） */
    deltaPercent?: number | null;
    /** 開關類項目目前已經是開啟的（畫面上不用再顯示「開了值多少」） */
    active?: boolean;
}

const outputPercent = (delta: number, base: number): number | null => (base !== 0 ? (delta / base) * 100 : null);

function buildLeverContext(settings: ShieldKnightSettings) {
    const calcResult = calculateAll(settings);
    const finalStatsBase = {
        maxHp: calcResult.finalStats.maxHp,
        defense: calcResult.finalStats.defense,
        protection: calcResult.finalStats.protection,
        magicDefense: calcResult.finalStats.magicDefense,
        magicProtection: calcResult.finalStats.magicProtection,
        shieldDamageReduction: calcResult.finalStats.shieldDamageReduction,
    };
    const ratios = calcResult.abilities;
    const baseLevers: DamageLevers = {
        maxDamage: calcResult.finalStats.maxDamage,
        criticalDamagePercent: calcResult.criticalDamagePercent,
        criticalRatePercent: calcResult.criticalRatePercent,
        generalExtraDamageMultiplier: calcResult.generalExtraDamageMultiplier,
        talentIncreaseDamageMultiplier: calcResult.talentIncreaseDamageMultiplier,
        finalIncreaseDamageMultiplier: calcResult.finalIncreaseDamageMultiplier,
        arcaneFinalIncreaseDamageMultiplier: calcResult.arcaneFinalIncreaseDamageMultiplier,
        arcaneExtraDamagePercent: calcResult.arcaneExtraDamagePercent,
        protectionReduction: calcResult.protectionReduction,
    };
    const compute = (levers: DamageLevers, stats = finalStatsBase) => calculateTotalOutputWithLevers(levers, stats, ratios, settings);
    return { calcResult, finalStatsBase, ratios, baseLevers, compute, baseTotal: compute(baseLevers) };
}

export interface HolyWaterComparisonItem {
    id: (typeof HOLY_WATER_ABILITIES)[number]["id"];
    label: string;
    /** 一格聖水選此能力並填滿上限的數值，例如「+30」「+4%」 */
    valueText: string;
    /** 相對於這格聖水不加任何能力的總輸出增加量 */
    deltaOutput: number;
    deltaPercent: number | null;
    /** 等同多少大傷（同傷害效益的換算基準） */
    equivalentMaxDamage: number | null;
}

/** 四種聖水能力各自「多一格、填滿上限」對總輸出的直接影響（已含暴擊期望值、破防、秘法技能吃到的 HP／防禦） */
export function calculateHolyWaterComparison(settings: ShieldKnightSettings): HolyWaterComparisonItem[] {
    const { baseLevers, compute, baseTotal } = buildLeverContext(settings);
    const maxDamageDelta = compute({ ...baseLevers, maxDamage: baseLevers.maxDamage + 1 }) - baseTotal;
    // HP／防禦加在高潔誓約之前的基礎值，整段重算，誓約的 %（HP 15%、防禦 10%）與上限會自動套用
    const withBaseStat = (key: "maxHp" | "defense" | "magicDefense", value: number) => {
        const raw = toRawCharacterStats(settings.character);
        return calculateTotalOutput({ ...settings, character: { ...raw, [key]: raw[key] + value } }, settings.skillUsageCounts);
    };
    return HOLY_WATER_ABILITIES.map((a) => {
        let total: number;
        if (a.id === "maxDamage") total = compute({ ...baseLevers, maxDamage: baseLevers.maxDamage + a.max });
        else if (a.id === "criticalDamage") total = compute({ ...baseLevers, criticalDamagePercent: baseLevers.criticalDamagePercent + a.max });
        else total = withBaseStat(a.id, a.max);
        const deltaOutput = total - baseTotal;
        return {
            id: a.id,
            label: a.label,
            valueText: a.id === "criticalDamage" ? `+${a.max}%` : `+${a.max}`,
            deltaOutput,
            deltaPercent: baseTotal !== 0 ? (deltaOutput / baseTotal) * 100 : null,
            equivalentMaxDamage: maxDamageDelta !== 0 ? deltaOutput / maxDamageDelta : null,
        };
    });
}

export function calculateDamageEfficiency(settings: ShieldKnightSettings): DamageEfficiencyItem[] {
    const { calcResult, finalStatsBase, ratios, baseLevers, compute, baseTotal } = buildLeverContext(settings);

    const probes: { id: DamageEfficiencyItem["id"]; label: string; unit: string; bump: DamageLevers }[] = [
        { id: "maxDamage", label: "面板最大傷害／常數攻擊力", unit: "1 點大傷", bump: { ...baseLevers, maxDamage: baseLevers.maxDamage + 1 } },
        { id: "criticalDamage", label: "暴擊傷害", unit: "1%", bump: { ...baseLevers, criticalDamagePercent: baseLevers.criticalDamagePercent + 1 } },
        { id: "criticalRate", label: "暴擊率上限", unit: "1%", bump: { ...baseLevers, criticalRatePercent: baseLevers.criticalRatePercent + 1 } },
        {
            id: "weaponExtraDamage",
            label: "武器額外傷害",
            unit: "1%",
            bump: {
                ...baseLevers,
                generalExtraDamageMultiplier:
                    (baseLevers.generalExtraDamageMultiplier * (1 + (calcResult.weaponExtraDamagePercent + 1) / 100)) /
                    (1 + calcResult.weaponExtraDamagePercent / 100),
            },
        },
        {
            id: "extraDamage",
            label: "額外傷害",
            unit: "1%",
            bump: { ...baseLevers, generalExtraDamageMultiplier: baseLevers.generalExtraDamageMultiplier + 0.01 },
        },
        {
            id: "arcaneExtraDamage",
            label: "秘法額外傷害",
            unit: "1%",
            bump: { ...baseLevers, arcaneExtraDamagePercent: baseLevers.arcaneExtraDamagePercent + 1 },
        },
        {
            id: "talentIncreaseDamage",
            label: "才能增加傷害",
            unit: "1%",
            bump: { ...baseLevers, talentIncreaseDamageMultiplier: baseLevers.talentIncreaseDamageMultiplier + 0.01 },
        },
        {
            id: "finalIncreaseDamage",
            label: "最終增加傷害",
            unit: "1%",
            bump: {
                ...baseLevers,
                finalIncreaseDamageMultiplier: baseLevers.finalIncreaseDamageMultiplier + 0.01,
                // 秘法技能的倍率 = 最終增加傷害 × 省察的痕跡，加 0.01 同樣要乘上省察的痕跡那一項
                arcaneFinalIncreaseDamageMultiplier:
                    baseLevers.arcaneFinalIncreaseDamageMultiplier +
                    0.01 * (baseLevers.arcaneFinalIncreaseDamageMultiplier / baseLevers.finalIncreaseDamageMultiplier),
            },
        },
    ];

    const maxDamageDelta = compute(probes[0].bump) - baseTotal;

    const results = probes.map((p) => {
        const delta = p.id === "maxDamage" ? maxDamageDelta : compute(p.bump) - baseTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit, equivalentMaxDamage, deltaPercent: outputPercent(delta, baseTotal) };
    });

    // ── 重擊／風車／突擊 細工等級效益：+1 級對應的基礎倍率 flat 加成，再乘上該技能全部乘算加成（雙手加成、套裝等） ──
    const reforgeProbes: { id: DamageEfficiencyItem["id"]; label: string; unit: string; ratios: typeof ratios }[] = [
        {
            id: "smashReforge",
            label: "重擊細工等級",
            unit: "1 級",
            ratios: { ...ratios, smashRatio: ratios.smashRatio + REFORGE_PER_LEVEL.smash * ratios.ratioMultipliers.smash },
        },
        {
            id: "windmillReforge",
            label: "風車細工等級",
            unit: "1 級",
            ratios: { ...ratios, windmillRatio: ratios.windmillRatio + REFORGE_PER_LEVEL.windmill * ratios.ratioMultipliers.windmill },
        },
        {
            id: "chargeReforge",
            label: "突擊細工等級",
            unit: "1 級",
            ratios: { ...ratios, chargeRatio: ratios.chargeRatio + REFORGE_PER_LEVEL.charge * ratios.ratioMultipliers.charge },
        },
    ];
    const reforgeResults = reforgeProbes.map((p) => {
        const delta = calculateTotalOutputWithLevers(baseLevers, finalStatsBase, p.ratios, settings) - baseTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit, equivalentMaxDamage, deltaPercent: outputPercent(delta, baseTotal) };
    });

    // ── 聚能／黑暗聚能：整個開關的價值（開啟 vs 關閉，跟目前實際是否勾選無關，方便評估要不要點聚能） ──
    const build = getCharacterBuild(settings.characterBuildId);
    const transformationMaxDamage = calculateDirtyMaxDamage({
        masterGradeActive: false,
        masterGradeCategory: "other",
        transformationId: build.transformationId,
        transformationReforgeLevel: settings.transformationReforgeLevel,
        petIds: [],
        banquetBonus: 0,
        eventBonus: 0,
        holyWaterMaxDamage: 0,
    }).total;
    const togglePairs: {
        id:
            | "erg"
            | "darkErg"
            | "raceSkill"
            | "transformation"
            | "rageSet"
            | "battlefield"
            | "statusSupport"
            | "strengthGather"
            | "physicalPotion"
            | "manualWindmillBase30"
            | "manualChargeEnhance"
            | "manualSmashEnhance";
        label: string;
        unit?: string;
        /** 目前是否已經開啟；不知道（例如憤怒衝擊套裝在破防面板）就省略 */
        isOn?: boolean;
        set: (on: boolean) => ShieldKnightSettings;
    }[] = [
        { id: "erg", label: "聚能已滿", isOn: settings.ergActive, set: (on) => ({ ...settings, ergActive: on }) },
        { id: "darkErg", label: "黑暗聚能已滿", isOn: settings.darkErgActive, set: (on) => ({ ...settings, darkErgActive: on }) },
        { id: "raceSkill", label: "種族特殊技能（拉狄卡）", isOn: settings.raceSkillActive, set: (on) => ({ ...settings, raceSkillActive: on }) },
        {
            id: "transformation",
            label: "變身",
            isOn: settings.dirtyMaxDamage.transformationActive,
            // 面板大傷已含變身加成：關閉時要從面板扣掉變身那一份，才是「沒變身」的狀態
            set: (on) => ({
                ...settings,
                panelMaxDamage: on ? settings.panelMaxDamage : settings.panelMaxDamage - transformationMaxDamage,
                dirtyMaxDamage: { ...settings.dirtyMaxDamage, transformationActive: on },
            }),
        },
        {
            id: "rageSet",
            label: "憤怒衝擊套裝（近戰技能傷害 +2%）",
            // 套裝是破防面板裡的選項，這裡只拿得到合計值：以目前近戰% 再 +2% 當作「有套裝」、現值當作「沒套裝」估算
            set: (on) => ({
                ...settings,
                rageImpactBuffActive: true,
                armorBreak: { ...settings.armorBreak, meleePercent: settings.armorBreak.meleePercent + (on ? RAGE_IMPACT_SET_PERCENT : 0) },
            }),
        },
        {
            id: "battlefield",
            label: "戰場的序曲 +1%",
            unit: "1%",
            set: (on) => ({
                ...settings,
                attackCoefficient: {
                    ...settings.attackCoefficient,
                    battlefieldActive: true,
                    battlefieldPercent: settings.attackCoefficient.battlefieldPercent + (on ? 1 : 0),
                },
            }),
        },
        { id: "statusSupport", label: "狀態支援（+12%）", isOn: settings.attackCoefficient.statusSupportActive, set: (on) => ({ ...settings, attackCoefficient: { ...settings.attackCoefficient, statusSupportActive: on } }) },
        { id: "strengthGather", label: "力量團聚（+15%）", isOn: settings.attackCoefficient.strengthGatherActive, set: (on) => ({ ...settings, attackCoefficient: { ...settings.attackCoefficient, strengthGatherActive: on } }) },
        { id: "physicalPotion", label: "物理攻擊力增加藥水（×1.2）", isOn: settings.attackCoefficient.physicalPotionActive, set: (on) => ({ ...settings, attackCoefficient: { ...settings.attackCoefficient, physicalPotionActive: on } }) },
        { id: "manualWindmillBase30", label: "風車基礎倍率 +30%", isOn: settings.manualWindmillBase30Active, set: (on) => ({ ...settings, manualWindmillBase30Active: on }) },
        { id: "manualChargeEnhance", label: "突擊最終倍率 ×1.15", isOn: settings.manualChargeEnhanceActive, set: (on) => ({ ...settings, manualChargeEnhanceActive: on }) },
        { id: "manualSmashEnhance", label: "重擊套裝 +15%", isOn: settings.manualSmashEnhanceActive, set: (on) => ({ ...settings, manualSmashEnhanceActive: on }) },
    ];
    const toggleResults = togglePairs.map((p) => {
        const onTotal = calculateTotalOutput(p.set(true), settings.skillUsageCounts);
        const offTotal = calculateTotalOutput(p.set(false), settings.skillUsageCounts);
        const delta = onTotal - offTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit ?? "開關", equivalentMaxDamage, deltaPercent: outputPercent(delta, offTotal), active: p.isOn };
    });

    // ── 防禦／最大生命值：+1 點對應多少大傷（跟其他槓桿一樣，全程套用暴擊率／暴擊傷害的期望值換算） ──
    const statProbes: { id: DamageEfficiencyItem["id"]; label: string; unit: string; finalStatsBase: typeof finalStatsBase }[] = [
        { id: "defense", label: "防禦", unit: "1 點", finalStatsBase: { ...finalStatsBase, defense: finalStatsBase.defense + 1 } },
        { id: "maxHp", label: "最大生命值", unit: "1 點", finalStatsBase: { ...finalStatsBase, maxHp: finalStatsBase.maxHp + 1 } },
    ];
    const statResults = statProbes.map((p) => {
        const delta = calculateTotalOutputWithLevers(baseLevers, p.finalStatsBase, ratios, settings) - baseTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit, equivalentMaxDamage, deltaPercent: outputPercent(delta, baseTotal) };
    });

    // ── 穆利亞斯的遺物：3 件各自 +1 級的效益（全設定複製後重算，正確反映對「最終增加傷害」／「審判重擊」的間接影響） ──
    const muliasProbes: { id: DamageEfficiencyItem["id"]; label: string; muliasRelic: MuliasRelicSettings }[] = [
        {
            id: "muliasSacrificeRegen",
            label: "誓約每秒犧牲恢復",
            muliasRelic: { ...settings.muliasRelic, sacrificeRegenLevel: settings.muliasRelic.sacrificeRegenLevel + 1 },
        },
        {
            id: "muliasReflectionTrace",
            label: "省察的痕跡",
            // 省察的痕跡固定以覆蓋率 100% 比較每一級的價值
            muliasRelic: { ...settings.muliasRelic, reflectionTraceCoveragePercent: 100, reflectionTraceLevel: settings.muliasRelic.reflectionTraceLevel + 1 },
        },
        {
            id: "muliasJudgementStrike",
            label: "審判重擊基礎傷害",
            muliasRelic: { ...settings.muliasRelic, judgementStrikeLevel: settings.muliasRelic.judgementStrikeLevel + 1 },
        },
    ];
    const muliasResults = muliasProbes.map((p) => {
        // 基準跟著探測的遺物設定走（省察的痕跡固定以覆蓋率 100% 比較，不受目前覆蓋率影響）
        const base = p.id === "muliasReflectionTrace"
            ? calculateTotalOutput({ ...settings, muliasRelic: { ...settings.muliasRelic, reflectionTraceCoveragePercent: 100 } }, settings.skillUsageCounts)
            : baseTotal;
        const total = calculateTotalOutput({ ...settings, muliasRelic: p.muliasRelic }, settings.skillUsageCounts);
        const delta = total - base;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: "1 級", equivalentMaxDamage, deltaPercent: outputPercent(delta, base) };
    });

    // ── 銳利等級：+1 級（已滿級 11 則以 −1 級反推），需套用破防結果才有效果 ──
    const sharpUp = settings.sharpLevel < SHARP_LEVEL_MAX;
    const sharpTotal = calculateTotalOutput({ ...settings, sharpLevel: settings.sharpLevel + (sharpUp ? 1 : -1) }, settings.skillUsageCounts);
    const sharpDelta = (sharpTotal - baseTotal) * (sharpUp ? 1 : -1) + 0; // + 0 避免顯示 -0
    const sharpResult = {
        id: "sharpLevel" as const,
        label: "銳利等級",
        unit: "1 級",
        equivalentMaxDamage: maxDamageDelta !== 0 ? sharpDelta / maxDamageDelta : null,
        deltaPercent: outputPercent(sharpDelta, baseTotal),
    };

    // ── buff 覆蓋率：+10 個百分點（已經 ≥ 90% 時改成 −10 反推），以 buff 觸發中計算 ──
    const COVERAGE_STEP = 10;
    const coverageProbes: { id: "rageCoverage" | "reflectionCoverage"; label: string; withCoverage: (percent: number) => ShieldKnightSettings; current: number }[] = [
        {
            id: "rageCoverage",
            label: "憤怒衝擊覆蓋率",
            current: settings.rageImpactCoveragePercent ?? 100,
            withCoverage: (percent) => ({ ...settings, rageImpactBuffActive: true, rageImpactCoveragePercent: percent }),
        },
        {
            id: "reflectionCoverage",
            label: "省察的痕跡覆蓋率",
            current: settings.muliasRelic.reflectionTraceCoveragePercent ?? 100,
            withCoverage: (percent) => ({
                ...settings,
                muliasRelic: { ...settings.muliasRelic, reflectionTraceCoveragePercent: percent },
            }),
        },
    ];
    const coverageResults = coverageProbes.map((p) => {
        const up = p.current <= 100 - COVERAGE_STEP;
        const base = calculateTotalOutput(p.withCoverage(p.current), settings.skillUsageCounts);
        const probed = calculateTotalOutput(p.withCoverage(p.current + (up ? COVERAGE_STEP : -COVERAGE_STEP)), settings.skillUsageCounts);
        const delta = (probed - base) * (up ? 1 : -1) + 0;
        return {
            id: p.id,
            label: p.label,
            unit: `${COVERAGE_STEP}%`,
            equivalentMaxDamage: maxDamageDelta !== 0 ? delta / maxDamageDelta : null,
            deltaPercent: outputPercent(delta, base),
        };
    });

    return [...results, ...reforgeResults, sharpResult, ...statResults, ...muliasResults, ...coverageResults, ...toggleResults];
}

export interface SpecialReformRow {
    stage: number;
    /** 這一階該武器是否能強化（第 8 階只有靈魂解放者／日月劍） */
    available: boolean;
    rCritPercent: number;
    sExtraPercent: number;
    sMaxDamage: number;
    /** 這一階 R 相當多少大傷（相對於完全沒有 R）；總輸出為 0 時 null */
    rEquivalentMaxDamage: number | null;
    sEquivalentMaxDamage: number | null;
    rDeltaPercent: number | null;
    sDeltaPercent: number | null;
}

/**
 * 特殊改造各階段的價值：把目前已選的 R／S 先拿掉當作「沒改造」，再逐階套上，
 * 量測總輸出增加量並換算成「相當大傷」。S 的最大傷害已含在面板內，這裡用「最終/面板」比例近似它吃到的攻擊係數。
 */
export function calculateSpecialReformTable(settings: ShieldKnightSettings): SpecialReformRow[] {
    const { baseLevers, compute, baseTotal } = buildLeverContext(settings);
    const maxDamageDelta = compute({ ...baseLevers, maxDamage: baseLevers.maxDamage + 1 }) - baseTotal;
    const maxStage = specialReformMaxStage(settings.weaponId);
    const curR = normalizeSpecialReformStage(settings.criticalDamage.weaponSpecialReforgeTier, maxStage);
    const curS = normalizeSpecialReformStage(settings.weaponSpecialReformSStage, maxStage);
    const coefficientRatio = settings.panelMaxDamage > 0 ? baseLevers.maxDamage / settings.panelMaxDamage : 1;

    const noR = { ...baseLevers, criticalDamagePercent: baseLevers.criticalDamagePercent - specialReformRCrit(curR) };
    const noRTotal = compute(noR);
    // 額外傷害那一桶（含目前的 S）扣掉目前的 S，就是「沒有 S」的基準
    const generalPercentWithS = calculateGeneralExtraPercent({
        ...settings.extraDamage,
        weaponExtraDamagePercent: 0,
        generalBonusPercent: specialReformSExtra(curS),
    });
    const generalPercentWithoutS = generalPercentWithS - specialReformSExtra(curS);
    const noS = {
        ...baseLevers,
        maxDamage: baseLevers.maxDamage - specialReformSMaxDamage(curS) * coefficientRatio,
        generalExtraDamageMultiplier: (baseLevers.generalExtraDamageMultiplier * (1 + generalPercentWithoutS / 100)) / (1 + generalPercentWithS / 100),
    };
    const noSTotal = compute(noS);

    return Array.from({ length: SPECIAL_REFORM_STAGE_COUNT }, (_, i) => {
        const stage = i + 1;
        const rCrit = specialReformRCrit(stage);
        const sExtra = specialReformSExtra(stage);
        const sMax = specialReformSMaxDamage(stage);
        const rDelta = compute({ ...noR, criticalDamagePercent: noR.criticalDamagePercent + rCrit }) - noRTotal;
        const sDelta =
            compute({
                ...noS,
                maxDamage: noS.maxDamage + sMax * coefficientRatio,
                generalExtraDamageMultiplier: (noS.generalExtraDamageMultiplier * (1 + (generalPercentWithoutS + sExtra) / 100)) / (1 + generalPercentWithoutS / 100),
            }) - noSTotal;
        return {
            stage,
            available: stage <= maxStage,
            rCritPercent: rCrit,
            sExtraPercent: sExtra,
            sMaxDamage: sMax,
            rEquivalentMaxDamage: maxDamageDelta !== 0 ? rDelta / maxDamageDelta : null,
            sEquivalentMaxDamage: maxDamageDelta !== 0 ? sDelta / maxDamageDelta : null,
            rDeltaPercent: outputPercent(rDelta, noRTotal),
            sDeltaPercent: outputPercent(sDelta, noSTotal),
        };
    });
}

// ═══════════════════════════════════════════════════════
//  鐵壁猛擊 HIT → 犧牲
// ═══════════════════════════════════════════════════════

export interface SacrificeGainResult {
    gained: number;
    newTotal: number;
    capped: boolean;
}

/** 高潔誓約狀態中，鐵壁猛擊期間每受到一次符合條件的攻擊 +7 犧牲，不限觸發次數，但犧牲總量封頂 100 */
export function calculateIronWallSacrifice(hitCount: number, currentSacrifice: number, nobleOathEnabled: boolean): SacrificeGainResult {
    const gained = nobleOathEnabled ? Math.max(0, hitCount) * 7 : 0;
    const rawTotal = currentSacrifice + gained;
    const newTotal = Math.min(SACRIFICE_CAP, rawTotal);
    return { gained, newTotal, capped: rawTotal > SACRIFICE_CAP };
}

// ═══════════════════════════════════════════════════════
//  頁面設定（存檔用）
// ═══════════════════════════════════════════════════════

export interface ShieldKnightSettings {
    character: CharacterStats;
    weaponType: WeaponType;
    weaponId: string;
    shieldId: string;
    /** 武器特殊改造 S 階段 0~8：追加傷害%算進通用額外傷害的「額外傷害」那一桶（和武器本身的額外傷害不同），最大傷害已含在面板 */
    weaponSpecialReformSStage: number;
    holyWater: HolyWaterState;
    reforge: ReforgeState;
    characterBuildId: string;
    /** 種族特殊技能（拉狄卡的氣息/視線/力量）是主動開啟的技能，預設關閉 */
    raceSkillActive: boolean;
    /** 突擊最終倍率 ×1.15（charge_enhance）：除了「無 / 其他」與鍋子，可選的盾牌都內建；這個手動勾選給沒選盾牌或其他來源用（效果不疊加） */
    manualChargeEnhanceActive: boolean;
    /** 重擊套裝 +15%（smash_enhance，加進重擊最後一格），目前沒有已知裝備資料來源，先開放手動勾選 */
    manualSmashEnhanceActive: boolean;
    /** 風車套裝 +30%（莊嚴騎士，windmill_enhance，最終乘算），手動勾選；欄位名沿用舊存檔的 Base30 */
    manualWindmillBase30Active: boolean;
    /** 連續技卡片（只能裝備一張，6 連擊依序增傷，秘法技能不吃） */
    comboCardSkillId: ComboCardSkillId;

    // 攻擊力
    /** 面板最大傷害（無狀態下，已含所有裝備/永久加成，不用另外加聖水/鍋子） */
    panelMaxDamage: number;
    dirtyMaxDamage: DirtyMaxDamageSettings;
    /** 變身細工等級 0~33（27~33 突破限定） */
    transformationReforgeLevel: number;
    /** 細工-XX魔法盾持續時間 等級 0~25（21~25 突破限定）：共 4 種詞條、只出在頭和身體，只取最高，影響省察的痕跡持續時間 */
    reflectionReforgeLevel: number;
    spiritWeaponAttackActive: boolean;
    attackCoefficient: AttackCoefficientState;

    // 暴擊率 / 暴擊傷害 / 額外傷害 / 最終增加傷害
    criticalRate: CriticalRateSettings;
    criticalDamage: CriticalDamageSettings;
    extraDamage: ExtraDamageSettings;
    arcaneExtraDamage: ArcaneExtraDamageSettings;
    finalIncreaseDamage: FinalIncreaseDamageSettings;
    muliasRelic: MuliasRelicSettings;
    armorBreak: ArmorBreakSettings;
    /** 銳利等級 0~11（武器／裝備各自不同，手動輸入），套用破防結果時每級 −5 怪物保護（扣除怪物銳利抵抗） */
    sharpLevel: number;

    ergActive: boolean;
    darkErgActive: boolean;
    magicCircleIds: MagicCircleId[];
    rageImpactBuffActive: boolean;
    /** 憤怒衝擊覆蓋率 0~100%：近距離額外傷害中時，平均有多少比例的技能施放吃得到加成 */
    rageImpactCoveragePercent: number;
    nobleOathEnabled: boolean;
    currentSacrifice: number;
    radiantJudgementStage: 1 | 2 | 3;
    ironWallHitCount: number;
    showHolySanctuary: boolean;
    showInstantTaunt: boolean;
    showShieldCharge: boolean;
    showIronWallStrike: boolean;
    showJudgementStrike: boolean;
    showSacrificePunishment: boolean;
    showRadiantJudgement: boolean;
    showSmashSkill: boolean;
    showWindmillSkill: boolean;
    showMengJiSkill: boolean;
    mengJiStack: 1 | 2 | 3 | 4 | 5;
    /** 技能使用次數（用於「總輸出」／「裝備比較」／「傷害效益」計算） */
    skillUsageCounts: SkillUsageCounts;
}

/** 全部 10 個技能 skillId → 顯示開關欄位名稱的對照，供 UI 篩選用 */
export const SKILL_VISIBILITY_SETTING_KEYS: Record<SkillId, keyof ShieldKnightSettings> = {
    "holy-sanctuary": "showHolySanctuary",
    "instant-taunt": "showInstantTaunt",
    "shield-charge": "showShieldCharge",
    "iron-wall-strike": "showIronWallStrike",
    "judgement-strike": "showJudgementStrike",
    "sacrifice-punishment": "showSacrificePunishment",
    "radiant-judgement": "showRadiantJudgement",
    "smash-hit": "showSmashSkill",
    "windmill-hit": "showWindmillSkill",
    "meng-ji": "showMengJiSkill",
};

export function createDefaultSettings(): ShieldKnightSettings {
    return {
        character: { ...DEFAULT_CHARACTER_STATS },
        weaponType: "one_hand_axe",
        weaponId: "none",
        shieldId: "none",
        weaponSpecialReformSStage: 0,
        holyWater: createDefaultHolyWaterState(),
        reforge: createDefaultReforgeState(),
        characterBuildId: "holy_knight",
        raceSkillActive: false,
        manualChargeEnhanceActive: false,
        manualSmashEnhanceActive: false,
        manualWindmillBase30Active: false,
        comboCardSkillId: "none",

        panelMaxDamage: 0,
        dirtyMaxDamage: {
            masterGradeActive: false,
            petIds: [],
            banquetBonus: 0,
            eventBonus: 0,
            transformationActive: true,
            panelAlreadyIncludesDirty: false,
        },
        transformationReforgeLevel: 0,
        reflectionReforgeLevel: 0,
        spiritWeaponAttackActive: true,
        attackCoefficient: {
            physicalPotionActive: true,
            tripleEnchantActive: false,
            statusSupportActive: true,
            strengthGatherActive: false,
            battlefieldActive: true,
            battlefieldPercent: 80,
            battleCryActive: false,
            battleCryReforgeLevel: 20,
        },

        criticalRate: {
            baseCriticalRatePercent: 54.5,
            itemBonusActive: false,
        },
        criticalDamage: {
            skillR1Active: true,
            fullGradeActive: true,
            spiritWeaponCritActive: true,
            weaponSpecialReforgeTier: 7,
            setTier: "tier7",
            totemChoice: "none",
            dollBagPercent: 0,
            farmModelPercent: 0,
            titlePercent: 0,
            brireheCoinPercent: 0,
            assassinOutfitActive: false,
        },
        extraDamage: {
            titlePercent: 0,
            totemPercent: 0,
            farmModelPercent: 0,
            setEffectActive: false,
        },
        arcaneExtraDamage: {
            imperfectCrownAuraActive: false,
            brireheCoinPercent: 0,
            muliasRelicCount: 0,
        },
        finalIncreaseDamage: {
            combatServiceBuffActive: true,
            dakotaGlowActive: true,
        },
        muliasRelic: {
            sacrificeRegenLevel: 0,
            reflectionTraceLevel: 0,
            reflectionTraceCoveragePercent: 100,
            judgementStrikeLevel: 0,
        },
        armorBreak: { enabled: true, protBeforePierce: 0, pierceResist: 0, damageTakenPercent: 0, critDamagePercent: 0, meleePercent: 0 },
        sharpLevel: 11,

        ergActive: false,
        darkErgActive: false,
        magicCircleIds: [],
        rageImpactBuffActive: false,
        rageImpactCoveragePercent: 100,
        nobleOathEnabled: true,
        currentSacrifice: 0,
        radiantJudgementStage: 1,
        ironWallHitCount: 0,
        showHolySanctuary: true,
        showInstantTaunt: true,
        showShieldCharge: true,
        showIronWallStrike: true,
        showJudgementStrike: true,
        showSacrificePunishment: true,
        showRadiantJudgement: true,
        showSmashSkill: true,
        showWindmillSkill: true,
        showMengJiSkill: true,
        mengJiStack: 1,
        skillUsageCounts: createDefaultSkillUsageCounts(),
    };
}
