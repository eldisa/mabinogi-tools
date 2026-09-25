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
 * 審判重擊/光輝斷罪借風車、盾擊衝鋒借突擊），其餘基礎/防護/生命是純秘法部分；
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
    calculateTalentIncreaseDamageMultiplier,
    calculateFinalIncreaseDamageMultiplier,
    calculateTalentSkillTargetDamage,
    calculateTalentSkillDamage,
    calculateArcaneSkillDamage,
    calculateArcaneExtraDamagePercent,
    CRITICAL_RATE_ITEM_BONUS,
    RACE_SKILL_OPTIONS,
    PET_BONUS_OPTIONS,
    TRANSFORMATION_OPTIONS,
    SPIRIT_WEAPON_ATTACK_BONUS,
    WEAPON_SPECIAL_REFORGE_CRIT,
    CRITICAL_DAMAGE_SET_BONUS,
    type SpiritWeaponAttackType,
    type AttackCoefficientState,
    type WeaponSpecialReforgeTier,
    type CriticalDamageSetTier,
    type TotemChoice,
    type FinalIncreaseDamageState,
    type ArcaneExtraDamageState,
    type CriticalRateState,
    type RaceId,
} from "./mabinogiCombat";
import { protRate } from "../utils/protectionCompare";

export {
    PET_BONUS_OPTIONS,
    TRANSFORMATION_OPTIONS,
    WEAPON_SPECIAL_REFORGE_CRIT,
    CRITICAL_DAMAGE_SET_BONUS,
    CRITICAL_RATE_ITEM_BONUS,
    type WeaponSpecialReforgeTier,
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
     * 面板數值是「原始面板」（未套用高潔誓約等buff，預設）還是「上完buff」（高潔誓約已經套用在數值裡）。
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
    statBaseline: "raw",
};

// ═══════════════════════════════════════════════════════
//  套裝效果（內部 tag，不直接讓 User 選，由武器/盾牌/護甲套裝自動帶出）
// ═══════════════════════════════════════════════════════

export type SetEffectTag = "windmill_enhance2" | "charge_enhance" | "smash_enhance" | "windmill_base30";

/** 套裝效果對應的顯示文字，供最終面板顯示「發動中的套裝效果」用 */
export const SET_EFFECT_TAG_LABELS: Record<SetEffectTag, string> = {
    windmill_enhance2: "風車最終倍率 ×1.15（武器/盾牌）",
    charge_enhance: "突擊最終倍率 ×1.15",
    smash_enhance: "重擊最終倍率 ×1.15",
    windmill_base30: "風車基礎倍率 +30%（莊嚴騎士）",
};

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
    /** 僅少數武器專屬：加到重擊基礎倍率（例如穹之奏鳴曲 +25%） */
    smashRatioFlatBonus?: number;
}

export const WEAPON_PRESETS: Record<WeaponType, WeaponPreset[]> = {
    one_hand_axe: [
        { id: "none", label: "其他", extraDamagePercent: 0 },
        { id: "nightbringer_plunderer", label: "暗夜使者掠奪者", extraDamagePercent: 42 },
        { id: "soul_liberator_axe", label: "靈魂解放者單手斧", extraDamagePercent: 56, tags: ["windmill_enhance2"] },
    ],
    two_hand_sword: [
        { id: "none", label: "其他", extraDamagePercent: 0 },
        { id: "nightbringer_commander", label: "暗夜使者指揮官", extraDamagePercent: 84 },
        { id: "sky_sonata", label: "穹之奏鳴曲", extraDamagePercent: 112, tags: ["windmill_enhance2"], smashRatioFlatBonus: 25 },
        { id: "soul_liberator_sword", label: "靈魂解放者雙手劍", extraDamagePercent: 112 },
    ],
};

function getWeaponPreset(weaponType: WeaponType, weaponId: string): WeaponPreset {
    return WEAPON_PRESETS[weaponType].find((w) => w.id === weaponId) ?? WEAPON_PRESETS[weaponType][0];
}

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
    { id: "fierce_sentry", label: "兇猛哨兵盾牌", reduction: 0.2, tags: ["windmill_enhance2"], oneHandWeaponExtraDamagePercent: 28 },
    { id: "night_vanguard", label: "暗夜使者前鋒", reduction: 0.3, tags: ["windmill_enhance2"], oneHandWeaponExtraDamagePercent: 42 },
    { id: "soul_liberator", label: "靈魂解放者盾牌", reduction: 0.45, hpFlat: 1000, oneHandWeaponExtraDamagePercent: 56 },
    { id: "pot", label: "鍋子", reduction: 0, maxDamageFlat: 40 },
];

export function getShieldPreset(shieldId: string): ShieldPreset {
    return SHIELD_PRESETS.find((s) => s.id === shieldId) ?? SHIELD_PRESETS[0];
}

// ═══════════════════════════════════════════════════════
//  聖水（8 個部位，各自選一種能力＋填數值，上限依能力）
// ═══════════════════════════════════════════════════════

export type HolyWaterAbilityId = "maxDamage" | "maxHp" | "defense" | "criticalDamage";

export interface HolyWaterAbility {
    id: HolyWaterAbilityId;
    label: string;
    max: number;
}

export const HOLY_WATER_ABILITIES: HolyWaterAbility[] = [
    { id: "maxDamage", label: "大傷", max: 30 },
    { id: "maxHp", label: "HP", max: 300 },
    { id: "defense", label: "防禦", max: 100 },
    { id: "criticalDamage", label: "爆擊傷害 %", max: 4 },
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

const NOBLE_OATH_HP_PERCENT = 0.15;
const NOBLE_OATH_HP_CAP = 3000;
const NOBLE_OATH_HP_FLAT = 1000;

const NOBLE_OATH_DEF_PERCENT = 0.1;
const NOBLE_OATH_DEF_CAP = 150;
const NOBLE_OATH_DEF_FLAT = 100;

// Spec 原文僅寫「魔防／魔保同理」，沒有給出精確數字；此處假設魔防上限比照防禦、魔保上限比照保護，
// 待日後用實測數據校正。
const NOBLE_OATH_MAGIC_DEF_PERCENT = 0.1;
const NOBLE_OATH_MAGIC_DEF_CAP = 150;
const NOBLE_OATH_MAGIC_DEF_FLAT = 100;

const NOBLE_OATH_PROTECTION_PERCENT = 0.1;
const NOBLE_OATH_PROTECTION_CAP = 15;

const NOBLE_OATH_MAGIC_PROTECTION_PERCENT = 0.1;
const NOBLE_OATH_MAGIC_PROTECTION_CAP = 15;

/** 職業被動：最大傷害轉化為防護的比例，未來版本改動時只需改這個常數 */
export const MAX_DAMAGE_TO_DEFENSE_POWER_RATE = 0.03;

export const SACRIFICE_CAP = 100;

/** 才能技能基本倍率（重擊/風車/突擊），猛擊另見 MENG_JI_STACKS */
const BASE_SKILL_RATIOS = {
    smash: 900,
    windmill: 500,
    charge: 264,
};

/**
 * 猛擊：獨立技能（不影響鐵壁猛擊，鐵壁猛擊吃的是風車）。層數 1~5，每層攻擊傷害倍率不同，
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
/** 犧牲之懲戒觸發反射的痕跡時，聖盾技能傷害（最終增加傷害）每級 +0.5% */
export const MULIAS_RELIC_REFLECTION_TRACE_PER_LEVEL = 0.5;
/** 審判一擊基礎傷害比例額外加成，每級 +100% */
export const MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL = 100;

export const MULIAS_RELIC_LEVEL_OPTIONS: { value: number; label: string }[] = Array.from({ length: 11 }, (_, i) => ({
    value: i,
    label: i === 0 ? "無" : `Lv${i}`,
}));

export interface MuliasRelicSettings {
    /** 高潔誓約每秒犧牲恢復量增加，Lv0~10 */
    sacrificeRegenLevel: number;
    /** 犧牲之懲戒觸發反射的痕跡時，聖盾技能傷害增加，Lv0~10 */
    reflectionTraceLevel: number;
    /** 反射的痕跡是否已觸發（觸發中才套用加成） */
    reflectionTraceActive: boolean;
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
    /** 暴擊傷害 debuff %，加到暴擊傷害 */
    critDamagePercent: number;
}

export interface CriticalDamageSettings {
    skillR1Active: boolean;
    fullGradeActive: boolean;
    spiritWeaponCritActive: boolean;
    weaponSpecialReforgeTier: WeaponSpecialReforgeTier;
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

export interface FinalIncreaseDamageSettings extends Omit<FinalIncreaseDamageState, "rageImpact"> {
    /** 憤怒衝擊魔法陣等級 0~10，每級 0.3% */
    rageImpactMagicCircleLevel: number;
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
    /** 防護 = 防禦 + 保護 + 魔防 + 魔保 + 職業被動(最大傷害 × 3%) */
    defensePower: number;
    shieldDamageReduction: number;
}

export interface AbilityValues {
    smashRatio: number;
    windmillRatio: number;
    chargeRatio: number;
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
    /** 暴擊傷害%（暴擊當下的傷害倍率，基礎100%起跳的加總） */
    criticalDamagePercent: number;
    /** 暴擊率%（基準值+道具加成） */
    criticalRatePercent: number;
    /** 暴擊傷害期望值＝100+暴擊率%×(暴擊傷害%−100)/100，才能/秘法技能公式實際用這個 */
    criticalDamageExpected: number;
    /** 通用額外傷害倍率＝(1+武器額外傷害)×(1+額外傷害) */
    generalExtraDamageMultiplier: number;
    /** 才能增加傷害倍率（種族技能×猛擊，乘算） */
    talentIncreaseDamageMultiplier: number;
    /** 最終增加傷害倍率（戰鬥服務/達可達/死神烙印/憤怒衝擊/命運編織/洞察之眼/幸運草，乘算） */
    finalIncreaseDamageMultiplier: number;
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
    if (settings.manualWindmillBase30Active) tags.add("windmill_base30");
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
        ? 1 - protRate(Math.max(0, armorBreak.protBeforePierce - Math.max(0, settings.sharpLevel - armorBreak.pierceResist) * 5))
        : 1;

    // ── 暴擊傷害% ──
    const criticalDamagePercent =
        calculateCriticalDamagePercent({
            ...settings.criticalDamage,
            classBonusPercent: 0,
            holyWaterPercent: sumHolyWater(settings.holyWater, "criticalDamage"),
        }) + (armorBreak?.critDamagePercent ?? 0);
    const criticalRatePercent = calculateCriticalRatePercent(settings.criticalRate);
    const criticalDamageExpected = calculateCriticalDamageExpected(criticalDamagePercent, criticalRatePercent);

    // ── 額外傷害（通用額外傷害倍率） ──
    const isOneHandWeapon = settings.weaponType === "one_hand_axe";
    const weaponExtraDamagePercent = weapon.extraDamagePercent + (isOneHandWeapon ? (shield.oneHandWeaponExtraDamagePercent ?? 0) : 0);
    const generalExtraDamageMultiplier = calculateGeneralExtraDamageMultiplier({
        ...settings.extraDamage,
        weaponExtraDamagePercent,
    });

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
    // 穆利亞斯的遺物：犧牲之懲戒觸發反射的痕跡時，聖盾技能傷害（最終增加傷害）+0.5%/級
    const reflectionTracePercent = settings.muliasRelic.reflectionTraceActive ? settings.muliasRelic.reflectionTraceLevel * MULIAS_RELIC_REFLECTION_TRACE_PER_LEVEL : 0;
    const finalIncreaseDamageMultiplier =
        calculateFinalIncreaseDamageMultiplier({
            combatServiceBuffActive: settings.finalIncreaseDamage.combatServiceBuffActive,
            dakotaGlowActive: settings.finalIncreaseDamage.dakotaGlowActive,
            // 套用破防結果時，死神烙印／命運編織（倒吊人）／洞察之眼／幸運草已包含在破防的「所受傷害增加」，這裡停用避免重複計算
            deathBrand: armorBreak ? { ...settings.finalIncreaseDamage.deathBrand, active: false } : settings.finalIncreaseDamage.deathBrand,
            destinyWeaveActive: !armorBreak && settings.finalIncreaseDamage.destinyWeaveActive,
            insightEye: armorBreak ? { ...settings.finalIncreaseDamage.insightEye, active: false } : settings.finalIncreaseDamage.insightEye,
            cloverMarkActive: !armorBreak && settings.finalIncreaseDamage.cloverMarkActive,
            rageImpact: {
                active: settings.rageImpactBuffActive,
                magicCircleLevel: settings.finalIncreaseDamage.rageImpactMagicCircleLevel,
                imperialGauntletTagActive: false,
            },
        }) *
        (1 + reflectionTracePercent / 100) *
        (1 + (armorBreak?.damageTakenPercent ?? 0) / 100);

    // 穆利亞斯的遺物：高潔誓約每秒犧牲恢復量 +0.05/級（純顯示用，目前無基準值可疊加）
    const sacrificeRegenPerSecond = settings.muliasRelic.sacrificeRegenLevel * MULIAS_RELIC_SACRIFICE_REGEN_PER_LEVEL;

    // ── 重擊 / 風車 / 突擊 三個基礎倍率 ──
    const smashFlat =
        sumReforgeLevels(settings.reforge, "smash") * REFORGE_PER_LEVEL.smash +
        (weapon.smashRatioFlatBonus ?? 0) +
        (hasMagicCircle("smash_damage") ? 100 : 0) +
        (settings.weaponType === "two_hand_sword" && settings.darkErgActive ? 150 : 0);
    const windmillFlat =
        sumReforgeLevels(settings.reforge, "windmill") * REFORGE_PER_LEVEL.windmill +
        (tags.has("windmill_base30") ? 30 : 0) +
        (settings.weaponType === "one_hand_axe" && settings.ergActive ? 100 : 0) +
        (settings.weaponType === "one_hand_axe" && settings.darkErgActive ? 100 : 0);
    const chargeFlat =
        sumReforgeLevels(settings.reforge, "charge") * REFORGE_PER_LEVEL.charge +
        (hasMagicCircle("charge_damage") ? 60 : 0);

    // 套裝的「最終倍率」乘在（基礎＋固定加成）之後
    const smashRatio = (BASE_SKILL_RATIOS.smash + smashFlat) * (tags.has("smash_enhance") ? 1.15 : 1);
    const windmillRatio = (BASE_SKILL_RATIOS.windmill + windmillFlat) * (tags.has("windmill_enhance2") ? 1.15 : 1);
    const chargeRatio = (BASE_SKILL_RATIOS.charge + chargeFlat) * (tags.has("charge_enhance") ? 1.15 : 1);

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
    const holyWaterMaxHp = settings.character.panelIncludesHolyWater ? 0 : sumHolyWater(settings.holyWater, "maxHp");
    const holyWaterDefense = settings.character.panelIncludesHolyWater ? 0 : sumHolyWater(settings.holyWater, "defense");
    let maxHp = settings.character.maxHp + holyWaterMaxHp + (shield.hpFlat ?? 0);

    let defense = settings.character.defense + holyWaterDefense;
    let protection = settings.character.protection;
    let magicDefense = settings.character.magicDefense;
    let magicProtection = settings.character.magicProtection;

    // 面板已經是「上完buff」的數值時，高潔誓約的加成不再重複套用（避免重複計算）
    if (settings.nobleOathEnabled && settings.character.statBaseline === "raw") {
        maxHp += Math.min(maxHp * NOBLE_OATH_HP_PERCENT, NOBLE_OATH_HP_CAP) + NOBLE_OATH_HP_FLAT;
        defense += Math.min(defense * NOBLE_OATH_DEF_PERCENT, NOBLE_OATH_DEF_CAP) + NOBLE_OATH_DEF_FLAT;
        magicDefense += Math.min(magicDefense * NOBLE_OATH_MAGIC_DEF_PERCENT, NOBLE_OATH_MAGIC_DEF_CAP) + NOBLE_OATH_MAGIC_DEF_FLAT;
        protection += Math.min(protection * NOBLE_OATH_PROTECTION_PERCENT, NOBLE_OATH_PROTECTION_CAP);
        magicProtection += Math.min(magicProtection * NOBLE_OATH_MAGIC_PROTECTION_PERCENT, NOBLE_OATH_MAGIC_PROTECTION_CAP);
    }

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
        criticalDamagePercent,
        criticalRatePercent,
        criticalDamageExpected,
        generalExtraDamageMultiplier,
        talentIncreaseDamageMultiplier,
        finalIncreaseDamageMultiplier,
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
        makeTerm("防護", 150, finalStats.defensePower),
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
        makeTerm("防護", 200, finalStats.defensePower),
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
        makeTerm("防護", 600, finalStats.defensePower),
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
        makeTerm("防護", 600, finalStats.defensePower),
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
        makeTerm("防護", 2000, finalStats.defensePower),
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
        makeTerm("防護", 4000, finalStats.defensePower),
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
 * 當「採計的才能技能目標傷害」，基礎/防護/最大生命 3 項是純秘法部分。
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
        makeTerm("防護", currentRatios.defensePower, finalStats.defensePower),
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
        name: `光輝斷罪（依使用次數 ${usageCount} 次分配 1/2/3 階段：${c1}/${c2}/${c3}）`,
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

/** 猛擊：獨立技能，不影響鐵壁猛擊。魔法陣「猛擊打擊傷害+40%」併入本技能的基礎倍率 */
export function calculateMengJi(
    finalStats: FinalStats,
    stack: 1 | 2 | 3 | 4 | 5,
    magicCircleActive: boolean,
    criticalDamagePercent: number,
    generalExtraDamageMultiplier: number,
    talentIncreaseDamageMultiplier: number,
    finalIncreaseDamageMultiplier: number,
    protectionReduction = 1,
): SkillDamageResult {
    const stackInfo = MENG_JI_STACKS[stack - 1];
    const ratio = stackInfo.ratio + (magicCircleActive ? 40 : 0);
    const terms = [makeTerm("攻擊傷害", ratio, finalStats.maxDamage)];
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

/**
 * 依設定算出全部 10 個技能的傷害結果（不篩選顯示開關，供「技能使用次數」/「裝備比較」/「傷害效益」共用）。
 * radiantJudgementUsageCount：光輝斷罪用來分配 1/2/3 階段次數的使用次數，預設吃 settings 自己的
 * skillUsageCounts；「裝備比較」需要比較別的配置時，外部會改傳目前分頁的使用次數，維持跟「總輸出」一致。
 */
export function calculateSkillsForSettings(
    settings: ShieldKnightSettings,
    radiantJudgementUsageCount: number = settings.skillUsageCounts["radiant-judgement"] ?? 0,
): SkillDamageResult[] {
    const calcResult = calculateAll(settings);
    const { finalStats, abilities } = calcResult;
    const mengJiMagicCircleActive = settings.magicCircleIds.includes("meng_ji_damage");
    const skills = [
        ...calculateAllSkills(
            finalStats,
            abilities.windmillDamage,
            abilities.chargeDamage,
            abilities.windmillTargetDamage,
            abilities.chargeTargetDamage,
            settings.nobleOathEnabled,
            settings.currentSacrifice,
            settings.radiantJudgementStage,
            settings.muliasRelic.judgementStrikeLevel * MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL,
            {
                criticalDamagePercent: calcResult.criticalDamageExpected,
                generalExtraDamageMultiplier: calcResult.generalExtraDamageMultiplier,
                talentIncreaseDamageMultiplier: calcResult.talentIncreaseDamageMultiplier,
                arcaneExtraDamagePercent: calcResult.arcaneExtraDamagePercent,
                finalIncreaseDamageMultiplier: calcResult.finalIncreaseDamageMultiplier,
                protectionReduction: calcResult.protectionReduction,
            },
        ),
        calculateSmashHit(finalStats, abilities.smashRatio, abilities.smashDamage),
        calculateWindmillHit(finalStats, abilities.windmillRatio, abilities.windmillDamage),
        calculateMengJi(
            finalStats,
            settings.mengJiStack,
            mengJiMagicCircleActive,
            calcResult.criticalDamageExpected,
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
    return calculateSkillsForSettings(settings, usageCounts["radiant-judgement"] ?? 0).reduce(
        (sum, skill) => sum + skill.finalDamage * (usageCounts[skill.skillId] ?? 0),
        0,
    );
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
    /** 秘法額外傷害%，只有 7 個秘法技能（走 calculateArcaneSkillDamage）吃得到，才能技能不吃 */
    arcaneExtraDamagePercent: number;
    protectionReduction: number;
}

function calculateTotalOutputWithLevers(
    levers: DamageLevers,
    finalStatsBase: Pick<FinalStats, "maxHp" | "defense" | "protection" | "magicDefense" | "magicProtection" | "shieldDamageReduction">,
    ratios: { smashRatio: number; windmillRatio: number; chargeRatio: number },
    settings: ShieldKnightSettings,
): number {
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
    const smashDamage = talentDamage(ratios.smashRatio);
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
                finalIncreaseDamageMultiplier: levers.finalIncreaseDamageMultiplier,
                protectionReduction: levers.protectionReduction,
            },
        ),
        calculateSmashHit(finalStats, ratios.smashRatio, smashDamage),
        calculateWindmillHit(finalStats, ratios.windmillRatio, windmillDamage),
        calculateMengJi(
            finalStats,
            settings.mengJiStack,
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
        | "arcaneExtraDamage"
        | "defense"
        | "maxHp"
        | "muliasSacrificeRegen"
        | "muliasReflectionTrace"
        | "muliasJudgementStrike"
        | "sharpLevel";
    label: string;
    unit: string;
    /** 1 單位等同多少大傷；目前總輸出為 0（尚未設定技能使用次數）時為 null，無法換算 */
    equivalentMaxDamage: number | null;
}

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
    const withBaseStat = (key: "maxHp" | "defense", value: number) =>
        calculateTotalOutput({ ...settings, character: { ...settings.character, [key]: settings.character[key] + value } }, settings.skillUsageCounts);
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
        { id: "criticalRate", label: "暴擊率", unit: "1%", bump: { ...baseLevers, criticalRatePercent: baseLevers.criticalRatePercent + 1 } },
        {
            id: "arcaneExtraDamage",
            label: "秘法額外傷害（僅套用於 7 個秘法技能，重擊/風車/突擊/猛擊不吃）",
            unit: "1%",
            bump: { ...baseLevers, arcaneExtraDamagePercent: baseLevers.arcaneExtraDamagePercent + 1 },
        },
        {
            id: "extraDamage",
            label: "額外傷害（額外傷害桶內加總）",
            unit: "1%",
            bump: { ...baseLevers, generalExtraDamageMultiplier: baseLevers.generalExtraDamageMultiplier + 0.01 },
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
            bump: { ...baseLevers, finalIncreaseDamageMultiplier: baseLevers.finalIncreaseDamageMultiplier + 0.01 },
        },
    ];

    const maxDamageDelta = compute(probes[0].bump) - baseTotal;

    const results = probes.map((p) => {
        const delta = p.id === "maxDamage" ? maxDamageDelta : compute(p.bump) - baseTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit, equivalentMaxDamage };
    });

    // ── 重擊／風車／突擊 細工等級效益：+1 級對應的基礎倍率 flat 加成（再乘上各自的套裝最終倍率 ×1.15） ──
    const mult = (tag: SetEffectTag) => (calcResult.activeTags.includes(tag) ? 1.15 : 1);
    const reforgeProbes: { id: DamageEfficiencyItem["id"]; label: string; unit: string; ratios: typeof ratios }[] = [
        {
            id: "smashReforge",
            label: "重擊細工等級",
            unit: "1 級",
            ratios: { ...ratios, smashRatio: ratios.smashRatio + REFORGE_PER_LEVEL.smash * mult("smash_enhance") },
        },
        {
            id: "windmillReforge",
            label: "風車細工等級",
            unit: "1 級",
            ratios: { ...ratios, windmillRatio: ratios.windmillRatio + REFORGE_PER_LEVEL.windmill * mult("windmill_enhance2") },
        },
        {
            id: "chargeReforge",
            label: "突擊細工等級",
            unit: "1 級",
            ratios: { ...ratios, chargeRatio: ratios.chargeRatio + REFORGE_PER_LEVEL.charge * mult("charge_enhance") },
        },
    ];
    const reforgeResults = reforgeProbes.map((p) => {
        const delta = calculateTotalOutputWithLevers(baseLevers, finalStatsBase, p.ratios, settings) - baseTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit, equivalentMaxDamage };
    });

    // ── 聚能／黑暗聚能：整個開關的價值（開啟 vs 關閉，跟目前實際是否勾選無關，方便評估要不要點聚能） ──
    const togglePairs: { id: "erg" | "darkErg"; label: string; key: "ergActive" | "darkErgActive" }[] = [
        { id: "erg", label: "聚能已滿", key: "ergActive" },
        { id: "darkErg", label: "黑暗聚能已滿", key: "darkErgActive" },
    ];
    const toggleResults = togglePairs.map((p) => {
        const onTotal = calculateTotalOutput({ ...settings, [p.key]: true }, settings.skillUsageCounts);
        const offTotal = calculateTotalOutput({ ...settings, [p.key]: false }, settings.skillUsageCounts);
        const delta = onTotal - offTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: "開關", equivalentMaxDamage };
    });

    // ── 防禦／最大生命值：+1 點對應多少大傷（跟其他槓桿一樣，全程套用暴擊率／暴擊傷害的期望值換算） ──
    const statProbes: { id: DamageEfficiencyItem["id"]; label: string; unit: string; finalStatsBase: typeof finalStatsBase }[] = [
        { id: "defense", label: "防禦", unit: "1 點", finalStatsBase: { ...finalStatsBase, defense: finalStatsBase.defense + 1 } },
        { id: "maxHp", label: "最大生命值", unit: "1 點", finalStatsBase: { ...finalStatsBase, maxHp: finalStatsBase.maxHp + 1 } },
    ];
    const statResults = statProbes.map((p) => {
        const delta = calculateTotalOutputWithLevers(baseLevers, p.finalStatsBase, ratios, settings) - baseTotal;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: p.unit, equivalentMaxDamage };
    });

    // ── 穆利亞斯的遺物：3 件各自 +1 級的效益（全設定複製後重算，正確反映對「最終增加傷害」／「審判重擊」的間接影響） ──
    const muliasProbes: { id: DamageEfficiencyItem["id"]; label: string; muliasRelic: MuliasRelicSettings }[] = [
        {
            id: "muliasSacrificeRegen",
            label: "穆利亞斯的遺物：誓約每秒犧牲恢復（不影響傷害輸出，僅供參考）",
            muliasRelic: { ...settings.muliasRelic, sacrificeRegenLevel: settings.muliasRelic.sacrificeRegenLevel + 1 },
        },
        {
            id: "muliasReflectionTrace",
            label: "穆利亞斯的遺物：反射的痕跡（併入最終增加傷害，以全程觸發中計算）",
            muliasRelic: { ...settings.muliasRelic, reflectionTraceActive: true, reflectionTraceLevel: settings.muliasRelic.reflectionTraceLevel + 1 },
        },
        {
            id: "muliasJudgementStrike",
            label: "穆利亞斯的遺物：審判重擊基礎傷害（僅套用於審判重擊）",
            muliasRelic: { ...settings.muliasRelic, judgementStrikeLevel: settings.muliasRelic.judgementStrikeLevel + 1 },
        },
    ];
    const muliasResults = muliasProbes.map((p) => {
        // 基準跟著探測的遺物設定走（反射的痕跡固定以觸發中比較，不受目前勾選影響）
        const base = p.id === "muliasReflectionTrace"
            ? calculateTotalOutput({ ...settings, muliasRelic: { ...settings.muliasRelic, reflectionTraceActive: true } }, settings.skillUsageCounts)
            : baseTotal;
        const total = calculateTotalOutput({ ...settings, muliasRelic: p.muliasRelic }, settings.skillUsageCounts);
        const delta = total - base;
        const equivalentMaxDamage = maxDamageDelta !== 0 ? delta / maxDamageDelta : null;
        return { id: p.id, label: p.label, unit: "1 級", equivalentMaxDamage };
    });

    // ── 銳利等級：+1 級（已滿級 11 則以 −1 級反推），需套用破防結果才有效果 ──
    const sharpUp = settings.sharpLevel < SHARP_LEVEL_MAX;
    const sharpTotal = calculateTotalOutput({ ...settings, sharpLevel: settings.sharpLevel + (sharpUp ? 1 : -1) }, settings.skillUsageCounts);
    const sharpDelta = (sharpTotal - baseTotal) * (sharpUp ? 1 : -1) + 0; // + 0 避免顯示 -0
    const sharpResult = {
        id: "sharpLevel" as const,
        label: settings.armorBreak.enabled ? "銳利等級" : "銳利等級（需在「破防」分頁勾選套用破防結果才有效果）",
        unit: "1 級",
        equivalentMaxDamage: maxDamageDelta !== 0 ? sharpDelta / maxDamageDelta : null,
    };

    return [...results, ...reforgeResults, sharpResult, ...statResults, ...muliasResults, ...toggleResults];
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
    holyWater: HolyWaterState;
    reforge: ReforgeState;
    characterBuildId: string;
    /** 種族特殊技能（拉狄卡的氣息/視線/力量）是主動開啟的技能，預設關閉 */
    raceSkillActive: boolean;
    /** 突擊最終倍率 ×1.15（charge_enhance），目前沒有已知裝備資料來源，先開放手動勾選 */
    manualChargeEnhanceActive: boolean;
    /** 重擊最終倍率 ×1.15（smash_enhance），目前沒有已知裝備資料來源，先開放手動勾選 */
    manualSmashEnhanceActive: boolean;
    /** 風車基礎倍率 +30%（莊嚴騎士，windmill_base30），手動勾選 */
    manualWindmillBase30Active: boolean;

    // 攻擊力
    /** 面板最大傷害（無狀態下，已含所有裝備/永久加成，不用另外加聖水/鍋子） */
    panelMaxDamage: number;
    dirtyMaxDamage: DirtyMaxDamageSettings;
    /** 變身細工等級 0~33（27~33 突破限定） */
    transformationReforgeLevel: number;
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
        holyWater: createDefaultHolyWaterState(),
        reforge: createDefaultReforgeState(),
        characterBuildId: "holy_knight",
        raceSkillActive: false,
        manualChargeEnhanceActive: false,
        manualSmashEnhanceActive: false,
        manualWindmillBase30Active: false,

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
        spiritWeaponAttackActive: true,
        attackCoefficient: {
            physicalPotionActive: false,
            tripleEnchantActive: false,
            statusSupportActive: false,
            strengthGatherActive: false,
            battlefieldPercent: 0,
            battleCryActive: false,
            battleCryReforgeLevel: 0,
        },

        criticalRate: {
            baseCriticalRatePercent: 54.5,
            itemBonusActive: false,
        },
        criticalDamage: {
            skillR1Active: true,
            fullGradeActive: true,
            spiritWeaponCritActive: true,
            weaponSpecialReforgeTier: "r7",
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
            deathBrand: { active: true, setBonusActive: false, reforgeLevel: 0 },
            destinyWeaveActive: false,
            insightEye: { active: false, commanderBadgeLevel: 0 },
            cloverMarkActive: true,
            rageImpactMagicCircleLevel: 0,
        },
        muliasRelic: {
            sacrificeRegenLevel: 0,
            reflectionTraceLevel: 0,
            reflectionTraceActive: true,
            judgementStrikeLevel: 0,
        },
        armorBreak: { enabled: false, protBeforePierce: 0, pierceResist: 0, damageTakenPercent: 0, critDamagePercent: 0 },
        sharpLevel: 11,

        ergActive: false,
        darkErgActive: false,
        magicCircleIds: [],
        rageImpactBuffActive: false,
        nobleOathEnabled: false,
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
