import { protRate } from "../utils/protectionCompare";
import { calculateFinalMaxDamage, CRITICAL_DAMAGE_SET_BONUS, type CriticalDamageSetTier } from "./mabinogiCombat";
import { SPECIAL_REFORM_R_CRIT_PERCENT } from "./shieldKnightCalculator";

/**
 * 鍊金術傷害計算器（2026-10-23～25 實測＋韓服計算器對照，見 docs/alchemy-calculator-notes.md、damage-formula-common.md）
 *
 * 才能技能 = 鍊金術傷害 × (技能倍率 + 鑑定) × 集氣 × 精通區 × 套裝 × (1 + 武器額外) × (1 + 通用額外 + 才能額外)
 *   精通區 = (1 + (精通效率 10% + 細工) ÷ 2) × 鋼瓶；鋼瓶獨立乘算（2026-10-25 實測）
 * 秘法技能 = [才能部分 × (1+才能額外) × 黑暗聚能 + 4 屬性平均 × 秘法倍率 × 遺物] × 元素組合 × (1 + 武器額外) × (1 + 通用額外 + 秘法額外)
 *   召喚噩夢例外：(火焰噴射 5 集氣 + 4 屬性平均) × 額外傷害值倍率（2026-10-24 實測）
 *   元素組合 = 1 + 結晶效果 × (1 + 藥草 + 效率)；秘法部分沒有平均加成、不吃精通區與黑暗聚能（2026-10-28 三套裝備實測）
 *   化學狂歡、召喚噩夢消耗能量，用扣掉「屬性能量加成」的面板（2026-10-29 實測）
 * 暴擊 = 本次傷害 + 最大傷害 × (150% + 暴擊傷害加成)，這裡一律以最大傷害計算
 */

export type CritMode = "noCrit" | "crit" | "expected";
export type Element = "fire" | "water" | "wind" | "earth";
export type ArcaneId = "spiral" | "chemical" | "nightmare";
/** 秘法技能借用的才能部分怎麼扣保護：參考（韓服計算器）／兩次減傷／雙倍銳利（聖盾、魔法計算器） */
export type ProtectionMode = "reference" | "twice" | "doublePierce";

export const ELEMENTS: Element[] = ["fire", "water", "wind", "earth"];
export const ELEMENT_LABELS: Record<Element, string> = { fire: "火", water: "水", wind: "風", earth: "土" };

/** 精通效率細工每級：說明的 0.5%（土 0.2%）÷ 2，火／水／土實測 */
export const MASTERY_REFORGE_STEP: Record<Element, number> = { fire: 0.0025, water: 0.0025, wind: 0.0025, earth: 0.001 };
export const MASTERY_REFORGE_MAX = 25;

/** 精通區 = (1 + (精通效率 10% + 細工) ÷ 2) × 鋼瓶，國服 (1 + F/2) 寫法（2026-10-25 實測） */
export const MASTERY_BASE = 1.05;

/** 鋼瓶：獨立乘算，只限說明有「使用對應屬性的鋼瓶時增加 30%」的技能（水炮、火焰噴射、高壓火爆） */
export const CYLINDER_OPTIONS = [
    { value: 0, label: "一般鋼瓶／塔座鋼瓶（×1.00）" },
    { value: 9, label: "劇場產屬性鋼瓶（×1.09，未實測）" },
    { value: 18, label: "商店進階屬性鋼瓶（×1.18，未實測）" },
    { value: 30, label: "四屬性鋼瓶（×1.30）" },
];

/** 最大傷害細工上限 33 = 手套 25 + 飾品 4 × 2 */
export const REFORGE_FIELDS = [
    { key: "waterCannon", label: "水炮最大傷害", perLevel: "倍率 +0.6%", max: 33 },
    { key: "flamer", label: "火焰噴射最大傷害", perLevel: "倍率 +0.3%", max: 33 },
    { key: "flamerDuration", label: "火焰噴射持續時間", perLevel: "+0.2 段", max: 20 },
    { key: "heatBuster", label: "高壓火爆最大傷害", perLevel: "倍率 +1%", max: 33 },
    { key: "rain", label: "造雨水炮傷害", perLevel: "造雨 +5%", max: 25 },
] as const;
export type ReforgeKey = (typeof REFORGE_FIELDS)[number]["key"];

/**
 * 元素組合：每個結晶的最終傷害（地裂螺旋 水 20%、化學狂歡 火 3.75%（主目標，第一次與後續爆炸都吃）、召喚噩夢 土 5%）
 * 符文詞條「(X 鍊金術效果) 最終傷害倍率增加」每條最高：地裂螺旋 1%、化學狂歡／召喚噩夢 0.2%（韓服資料），最多 5 條
 */
export const COMBO_META: Record<ArcaneId, { element: Element; perCrystal: number; effect: string; herb: string; oghamPerLine: number }> = {
    spiral: { element: "water", perCrystal: 0.2, effect: "水鍊金術效果：技能最終傷害", herb: "魔力藥草", oghamPerLine: 1 },
    chemical: { element: "fire", perCrystal: 0.0375, effect: "火鍊金術效果：主目標最終傷害", herb: "生命藥草", oghamPerLine: 0.2 },
    nightmare: { element: "earth", perCrystal: 0.05, effect: "土鍊金術效果：技能最終傷害", herb: "基礎藥草", oghamPerLine: 0.2 },
};
export const COMBO_MAX_CRYSTALS = 4;
export const COMBO_OGHAM_LINES = 5;

/** 遺物 0~10 級。地裂螺旋、化學狂歡：秘法部分 ×(1 + 說明數字 ÷ 10)，即每級 2%／3%（地裂 1、10 級，化學 3、5 級實測）；召喚噩夢：4 能量倍率 +5%／級 */
export const RELIC_MAX_LEVEL = 10;
export const RELIC_ARCANE_STEP: Record<"spiral" | "chemical", number> = { spiral: 0.02, chemical: 0.03 };
/** 遺物說明原文（台服），數字 = 每級 × 等級 */
export const RELIC_DESC: Record<ArcaneId, (lv: number) => string> = {
    spiral: (lv) => `地裂螺旋傷害增加 ${lv * 20}%（上限 200%）`,
    chemical: (lv) => `化學狂歡傷害增加 ${lv * 30}%（上限 300%）`,
    nightmare: (lv) => `召喚噩夢消耗 4 個屬性能量，額外傷害值倍率增加 ${lv * 5}%（最大 50%）`,
};

/** 召喚噩夢：消耗屬性能量 0~4 個的額外傷害值倍率（不累加；0、1、4 能量實測，2、3 照參考） */
export const NIGHTMARE_RATIOS = [2, 2, 2.5, 3.3, 4.8];

/** 化學狂歡後續爆炸：段數 = 消耗能量 + 1（0～4），每段 = (高壓火爆部分 + 平均 × 900% × 50% × 遺物) × 元素組合（每次施放各段同值） */
export const CHEMICAL_FOLLOW_UP_AVG_RATIO = 0.5;

/** 鍊金常數攻擊力（不吃藥水係數與 buff%）：4 屬性鍊金術傷害 +200、精靈武器 4 屬 +30、一代宗師戰鬥鍊金術師 火 20／水 15／風 30／土 30（屬性共鳴面板實測吻合） */
export const ARCANE_PASSIVE_CONSTANT = 200;
export const SPIRIT_WEAPON_ALCH_CONSTANT = 30;
export const RESONANCE_RATE = 1.03;
export const GRANDMASTER_CONSTANT: Record<Element, number> = { fire: 20, water: 15, wind: 30, earth: 30 };
/** 臨時鍊金術傷害：寵物倉鼠 +40 */
export const HAMSTER_ALCH_DAMAGE = 40;
/** 鋼瓶特殊改造 R 1~7 階的暴擊傷害%（和其他武器同表） */
export const CYLINDER_REFORM_R_STAGES = 7;
export const cylinderReformRCrit = (stage: number) => (stage > 0 ? (SPECIAL_REFORM_R_CRIT_PERCENT[stage - 1] ?? 0) : 0);
export { CRITICAL_DAMAGE_SET_BONUS };

export const SKILL_META = [
    { id: "waterCannon", label: "水炮（5 集氣）", imageId: 35004, arcane: false },
    { id: "flamer", label: "火焰噴射（整段）", imageId: 35008, arcane: false },
    { id: "heatBuster", label: "高壓火爆（壓力 100%）", imageId: 35014, arcane: false },
    { id: "spiral", label: "地裂螺旋", imageId: 59145, arcane: true },
    { id: "chemical", label: "化學狂歡", imageId: 59144, arcane: true },
    { id: "nightmare", label: "召喚噩夢", imageId: 59143, arcane: true },
] as const;
export type SkillId = (typeof SKILL_META)[number]["id"];

interface ComboSettings {
    crystals: number;
    elementHerb: boolean; // 屬性藥草 +10%
    mandrake: boolean; // 曼德拉草 +5%
    oghamPercent: number;
}

export interface CritDamageSettings {
    grade: boolean; // 戰鬥系一代宗師全取得 +10%
    spiritWeapon: boolean; // 精靈武器 +15%（也給 4 屬 +30 常數）
    reformR: number; // 鋼瓶特殊改造 R 階段 0~7
    setTier: CriticalDamageSetTier;
    totem: boolean; // 艾爾班訓練所圖騰 +5%
    dollBag: number;
    farm: number;
    title: number;
    coin: number; // 布里萊赫的硬幣 暴擊傷害 1~10%
    other: number;
}

export interface AlchemySettings {
    alchDamage: Record<Element, number>; // 角色資訊的鍊金術傷害
    tempAlch: { hamster: boolean; banquet: number; event: number }; // 面板沒有的四屬性鍊金術傷害：寵物倉鼠 +40、辦桌、活動
    energyBonus: number; // 屬性能量累積觸發的四屬性提升（面板含此值）；化學狂歡、召喚噩夢消耗能量後扣掉
    // 鍊金術傷害 buff：面板填沒開這些 buff 的數值，依「(基礎 × 係數 + 常數) × Π(1 + buff% × 係數)」換算
    attackBuff: { battlefieldPercent: number; statusSupport: boolean; strengthGather: boolean; potion: boolean; arcanePassive: boolean; grandmaster: boolean };
    resonance: boolean; // 屬性共鳴：攻擊係數 ×1.03（buff% 也吃），且有完整造雨加成
    catalyst: boolean; // 觸媒效應（4 火＋全藥草）：通用額外 + 8% × (1 + 15% + 火效率) + floor(平均 ÷ 500)%
    cylinderPercent: number;
    masteryReforge: Record<Element, number>;
    reforge: Record<ReforgeKey, number>;
    heatBusterWeaponPercent: number; // 聚能 S50「高壓火爆傷害 +300%」
    sets: { waterCannon: boolean; flamer: boolean }; // 克萊希達套裝 +15%
    flamerCharge: number;
    nightmareEnergy: number; // 召喚噩夢消耗的屬性能量 0~4
    chemicalEnergy: number; // 化學狂歡消耗的屬性能量 0~4
    rain: boolean;
    elementWave: boolean; // 元素波動：高壓火爆 +25%（化學狂歡不吃）
    combo: Record<ArcaneId, ComboSettings>;
    relic: Record<ArcaneId, number>;
    crit: { panelRatePercent: number };
    critDamage: CritDamageSettings;
    // 武器額外 = 主手 + 副手；talentSkill：黑暗聚能「鍊金術才能技能傷害增加」，獨立乘算；talent／arcane 為下列來源以外的其他值
    extra: { weaponMain: number; weaponOff: number; general: number; talent: number; arcane: number; talentSkill: number };
    spiritWeakness: boolean; // 精靈武器弱點分析 5 等：目標有出血／暈眩／防保減少時才能額外 +10%
    talentSources: { radica: boolean; spiritBerserk: boolean; spiritTransform: boolean; spiritTransformEnhance: boolean };
    arcaneSources: { coin: number; crown: boolean; mooncake: number }; // 布里萊赫的硬幣 0.15~3%、不完美的空想王冠 3%、月餅賦予接尾捲 1% × 0~3
    independent: { battleService: boolean; sensePotion: boolean; otherPercent: number };
    protectionMode: ProtectionMode;
    pierceLevel: number;
    armorBreak: { enabled: boolean; protBeforePierce: number; pierceResist: number; damageTakenPercent: number; critExtraPercent: number };
    usage: Record<SkillId, number>;
}

const defaultCombo = (): ComboSettings => ({ crystals: 4, elementHerb: true, mandrake: true, oghamPercent: 0 });

export function createDefaultSettings(): AlchemySettings {
    return {
        alchDamage: { fire: 2000, water: 2000, wind: 2000, earth: 2000 },
        tempAlch: { hamster: false, banquet: 0, event: 0 },
        energyBonus: 0,
        attackBuff: { battlefieldPercent: 80, statusSupport: true, strengthGather: false, potion: false, arcanePassive: true, grandmaster: true },
        resonance: true,
        catalyst: true,
        cylinderPercent: 30,
        masteryReforge: { fire: 0, water: 0, wind: 0, earth: 0 },
        reforge: Object.fromEntries(REFORGE_FIELDS.map((f) => [f.key, 0])) as Record<ReforgeKey, number>,
        heatBusterWeaponPercent: 0,
        sets: { waterCannon: false, flamer: false },
        flamerCharge: 5,
        nightmareEnergy: 4,
        chemicalEnergy: 4,
        rain: true,
        elementWave: true,
        combo: { spiral: defaultCombo(), chemical: defaultCombo(), nightmare: defaultCombo() },
        relic: { spiral: 0, chemical: 0, nightmare: 0 },
        crit: { panelRatePercent: 50 },
        critDamage: { grade: true, spiritWeapon: true, reformR: 0, setTier: "none", totem: false, dollBag: 0, farm: 0, title: 0, coin: 0, other: 0 },
        extra: { weaponMain: 0, weaponOff: 0, general: 0, talent: 0, arcane: 0, talentSkill: 0 },
        spiritWeakness: false,
        talentSources: { radica: false, spiritBerserk: false, spiritTransform: false, spiritTransformEnhance: false },
        arcaneSources: { coin: 0, crown: false, mooncake: 0 },
        independent: { battleService: true, sensePotion: false, otherPercent: 0 },
        protectionMode: "reference",
        pierceLevel: 0,
        armorBreak: { enabled: false, protBeforePierce: 0, pierceResist: 0, damageTakenPercent: 0, critExtraPercent: 0 },
        usage: Object.fromEntries(SKILL_META.map((s) => [s.id, 0])) as Record<SkillId, number>,
    };
}

/** 讀檔用：只收預設設定裡存在、且型別相同的欄位（巢狀物件遞迴），其餘丟掉 */
export function mergeSettings(data: unknown): AlchemySettings {
    const merge = (base: Record<string, unknown>, src: unknown): Record<string, unknown> => {
        if (!src || typeof src !== "object" || Array.isArray(src)) return base;
        const s = src as Record<string, unknown>;
        for (const key of Object.keys(base)) {
            if (!Object.prototype.hasOwnProperty.call(s, key)) continue;
            const bv = base[key];
            const sv = s[key];
            if (bv && typeof bv === "object") base[key] = merge(bv as Record<string, unknown>, sv);
            else if (typeof sv === typeof bv && (typeof sv !== "number" || Number.isFinite(sv))) base[key] = sv;
        }
        return base;
    };
    const merged = merge(createDefaultSettings() as unknown as Record<string, unknown>, data) as unknown as AlchemySettings;
    if (!["reference", "twice", "doublePierce"].includes(merged.protectionMode)) merged.protectionMode = "reference";
    if (!(merged.critDamage.setTier in CRITICAL_DAMAGE_SET_BONUS)) merged.critDamage.setTier = "none";
    // 舊存檔：武器額外只有一個欄位、臨時鍊金術傷害只有一個數字 → 分別放進主手、活動
    const old = data as { extra?: Record<string, unknown>; tempAlchDamage?: unknown; tempAlch?: unknown } | null;
    const finite = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
    if (old?.extra && finite(old.extra.weapon) && !("weaponMain" in old.extra)) merged.extra.weaponMain = old.extra.weapon;
    if (finite(old?.tempAlchDamage) && old?.tempAlch === undefined) merged.tempAlch.event = old.tempAlchDamage;
    return merged;
}

export interface Factor {
    label: string;
    /** 乘數（例如 1.35） */
    value: number;
    note?: string;
    /** 以整數顯示（鍊金術傷害、傷害），否則顯示為乘數 */
    int?: boolean;
}
export interface DamagePart {
    label: string;
    damage: number;
    factors: Factor[];
}
export interface SkillResult {
    id: SkillId;
    label: string;
    imageId: number;
    damage: number;
    parts: DamagePart[];
    formula: string;
}

const pct = (n: number) => `${Math.round(n * 10000) / 100}%`;
const product = (factors: Factor[]) => factors.reduce((p, f) => p * f.value, 1);

/** 破防：保護先扣破防、再扣銳利（每級 −5，扣除怪物銳利抵抗）後查減傷表 */
export function calculateArmor(s: AlchemySettings) {
    const ab = s.armorBreak;
    const netPierce = Math.max(0, s.pierceLevel - ab.pierceResist);
    const reduction = (times: number) => (ab.enabled ? protRate(Math.max(0, ab.protBeforePierce - netPierce * 5 * times)) : 0);
    return {
        none: ab.enabled ? protRate(ab.protBeforePierce) : 0,
        single: reduction(1),
        double: reduction(2),
        damageTaken: ab.enabled ? ab.damageTakenPercent / 100 : 0,
        critExtra: ab.enabled ? ab.critExtraPercent / 100 : 0,
    };
}

/** 鍊金常數攻擊力（各屬性） */
export function calculateAlchConstant(s: AlchemySettings, el: Element): number {
    const b = s.attackBuff;
    return (b.arcanePassive ? ARCANE_PASSIVE_CONSTANT : 0) + (s.critDamage.spiritWeapon ? SPIRIT_WEAPON_ALCH_CONSTANT : 0) + (b.grandmaster ? GRANDMASTER_CONSTANT[el] : 0);
}

export function calculateAlchDamage(s: AlchemySettings, spent = false) {
    const b = s.attackBuff;
    const buffState = {
        physicalPotionActive: b.potion,
        tripleEnchantActive: false,
        statusSupportActive: b.statusSupport,
        strengthGatherActive: b.strengthGather,
        battlefieldActive: b.battlefieldPercent > 0,
        battlefieldPercent: b.battlefieldPercent,
        battleCryActive: false,
        battleCryReforgeLevel: 0,
        coefficientMultiplier: s.resonance ? RESONANCE_RATE : 1,
    };
    const buffed = (e: Element) => {
        const constant = calculateAlchConstant(s, e);
        // 屬性共鳴 ×1.03 乘在攻擊係數上（和藥水相乘，buff% 也吃），常數部分不乘（2026-10-27、10-29 實測）
        const base = s.alchDamage[e] - (spent ? s.energyBonus : 0) - constant;
        return calculateFinalMaxDamage(base, 0, constant, buffState);
    };
    const temp = calculateTempAlchDamage(s);
    const el = Object.fromEntries(ELEMENTS.map((e) => [e, buffed(e) + temp])) as Record<Element, number>;
    return { ...el, average: ELEMENTS.reduce((sum, e) => sum + el[e], 0) / ELEMENTS.length };
}

/** 臨時鍊金術傷害（四屬性同加）= 倉鼠 40 + 辦桌 + 活動 */
export function calculateTempAlchDamage(s: AlchemySettings): number {
    return (s.tempAlch.hamster ? HAMSTER_ALCH_DAMAGE : 0) + s.tempAlch.banquet + s.tempAlch.event;
}

/** 觸媒效應 = 8% × (1 + 藥草 15% + 火效率) + floor(平均 ÷ 500)%，配方固定 4 火＋生命藥草＋曼德拉草（2026-10-27、10-29 實測） */
export function calculateCatalyst(s: AlchemySettings, average: number): number {
    if (!s.catalyst) return 0;
    const fireEff = 0.1 + s.masteryReforge.fire * MASTERY_REFORGE_STEP.fire * 2;
    return 0.08 * (1 + 0.15 + fireEff) + Math.floor(average / 500) / 100;
}

/** 精通區 = (1 + (精通效率 10% + 細工) ÷ 2) × 鋼瓶 */
export function calculateMasteryZone(s: AlchemySettings, el: Element): number {
    return (MASTERY_BASE + s.masteryReforge[el] * MASTERY_REFORGE_STEP[el]) * (1 + s.cylinderPercent / 100);
}

/** 暴擊傷害％（含基礎 100%）= 250（100 + 暴擊 150）+ 一代宗師 10 + 精靈武器 15 + 鋼瓶 R + 套裝 + 圖騰 5 + 娃娃背包 + 農場 + 稱號 + 硬幣 + 其他（10/30 385% 實測） */
export function calculateCritDamagePercent(s: AlchemySettings): number {
    const cd = s.critDamage;
    return (
        250 +
        (cd.grade ? 10 : 0) +
        (cd.spiritWeapon ? 15 : 0) +
        cylinderReformRCrit(cd.reformR) +
        CRITICAL_DAMAGE_SET_BONUS[cd.setTier] +
        (cd.totem ? 5 : 0) +
        cd.dollBag +
        cd.farm +
        cd.title +
        cd.coin +
        cd.other
    );
}

/** 才能額外％ = 拉狄卡的氣息 5 + 弱點分析 10 + 狂暴化 10 + 實體化 10（強化再 +15）+ 其他 */
export function calculateTalentExtraPercent(s: AlchemySettings): number {
    const t = s.talentSources;
    return (
        s.extra.talent +
        (t.radica ? 5 : 0) +
        (s.spiritWeakness ? 10 : 0) +
        (t.spiritBerserk ? 10 : 0) +
        (t.spiritTransform ? 10 + (t.spiritTransformEnhance ? 15 : 0) : 0)
    );
}

/** 秘法額外％ = 布里萊赫的硬幣 + 不完美的空想王冠 3 + 月餅賦予接尾捲 1 × 個數 + 其他 */
export function calculateArcaneExtraPercent(s: AlchemySettings): number {
    const a = s.arcaneSources;
    return s.extra.arcane + a.coin + (a.crown ? 3 : 0) + a.mooncake;
}

export function calculateCritRatePercent(s: AlchemySettings): number {
    return Math.min(100, Math.max(0, s.crit.panelRatePercent));
}

/** 火焰噴射段數 = 5 + 0.2 × 持續時間細工：火焰噴射本身無條件捨去，召喚噩夢保留小數（8.6 段實測） */
export const flamerHits = (s: AlchemySettings) => 5 + 0.2 * s.reforge.flamerDuration;

function calculateRun(s: AlchemySettings, isCrit: boolean, critLabel: Factor) {
    const alch = calculateAlchDamage(s);
    const alchSpent = calculateAlchDamage(s, true);
    const armor = calculateArmor(s);
    const zone = (el: Element) => calculateMasteryZone(s, el);
    const rf = (k: ReforgeKey) => s.reforge[k] ?? 0;
    const critFactor: Factor = { ...critLabel, value: isCrit ? calculateCritDamagePercent(s) / 100 : 1 };

    // ── 額外傷害與獨立乘區 ──
    const sharpEye = isCrit ? armor.critExtra : 0;
    const W = (s.extra.weaponMain + s.extra.weaponOff) / 100;
    const catalyst = calculateCatalyst(s, alch.average);
    const G = s.extra.general / 100 + catalyst + sharpEye;
    const T = calculateTalentExtraPercent(s) / 100;
    const A = calculateArcaneExtraPercent(s) / 100;
    const N = (s.independent.battleService ? 1.01 : 1) * (s.independent.sensePotion ? 1.03 : 1) * (1 + s.independent.otherPercent / 100);
    const gNote = (catalyst ? `（含觸媒效應 ${pct(catalyst)}）` : "") + (sharpEye ? `（含暴擊時通用額外 ${pct(sharpEye)}）` : "");
    const fWeapon: Factor = { label: "武器額外（主手＋副手）", value: 1 + W };
    const fTalentExtra: Factor[] = [fWeapon, { label: "通用額外＋才能額外", value: 1 + G + T, note: `${pct(G)}${gNote} + ${pct(T)}` }];
    const fArcaneExtra: Factor[] = [fWeapon, { label: "通用額外＋秘法額外", value: 1 + G + A, note: `${pct(G)}${gNote} + ${pct(A)}` }];
    const fT: Factor = { label: "才能額外（只有才能部分）", value: 1 + T };
    // 黑暗聚能「鍊金術才能技能傷害增加」：獨立乘算，不和才能額外（拉狄卡的氣息等）同區；秘法技能只乘才能部分（2026-10-27～28 實測）
    const fTalentSkill: Factor = { label: "鍊金術才能技能傷害增加（黑暗聚能）", value: 1 + s.extra.talentSkill / 100 };
    const fN: Factor = { label: "獨立加成（戰鬥服務、感應藥水、其他）", value: N };
    const fTaken: Factor = { label: "所受傷害增加（破防）", value: 1 + armor.damageTaken };
    const reductionFactor = (r: number, label = "保護減傷"): Factor[] => (r ? [{ label, value: 1 - r, note: pct(r) }] : []);
    const tail = [fN, ...(armor.damageTaken ? [fTaken] : [])];
    const fAlch = (el: Element, a = alch): Factor => ({ label: `${ELEMENT_LABELS[el]}鍊金術傷害`, value: a[el], int: true });
    const fZone = (el: Element): Factor => ({
        label: `精通區（${ELEMENT_LABELS[el]}）`,
        value: zone(el),
        note: `(1 + (10% + 細工 ${pct(s.masteryReforge[el] * MASTERY_REFORGE_STEP[el] * 2)}) ÷ 2) × 鋼瓶 ${1 + s.cylinderPercent / 100}`,
    });
    const fAvg = (a = alch): Factor => ({ label: "4 屬性鍊金術傷害平均", value: a.average, int: true });

    // ── 才能技能（不含暴擊、保護、額外傷害），秘法技能也借用 ──
    const waterRatio = 0.607 + rf("waterCannon") * 0.006;
    const rainBonus = s.rain || s.resonance ? 0.2 + rf("rain") * 0.05 : 0;
    const waterCannonCore: Factor[] = [
        fAlch("water"),
        { label: "水炮倍率", value: waterRatio, note: pct(waterRatio) },
        { label: "5 集氣", value: 6.25, note: "5 × 1.25" },
        fZone("water"),
        { label: "造雨", value: 1 + rainBonus },
        { label: "水炮強化（克萊希達套裝）", value: s.sets.waterCannon ? 1.15 : 1 },
    ];
    const flamerRatio = 0.335 + rf("flamer") * 0.003;
    const flamerCore = (charge: number, hits: number, a = alch): Factor[] => [
        fAlch("fire", a),
        { label: "火焰噴射倍率", value: flamerRatio, note: pct(flamerRatio) },
        { label: `${charge} 集氣`, value: charge },
        fZone("fire"),
        { label: "火焰噴射強化（克萊希達套裝）", value: s.sets.flamer ? 1.15 : 1 },
        { label: "段數", value: hits, note: hits === 5 ? "基礎 5 段" : `5 + 0.2 × ${rf("flamerDuration")}${Number.isInteger(hits) ? "" : "（保留小數）"}` },
    ];
    const heatRatio = 1.305 + rf("heatBuster") * 0.01;
    const heatBusterCore = (a = alch): Factor[] => [
        fAlch("fire", a),
        { label: "高壓火爆倍率", value: heatRatio, note: pct(heatRatio) },
        { label: "聚能 S50 高壓火爆傷害", value: 1 + s.heatBusterWeaponPercent / 100 },
        fZone("fire"),
    ];

    const part = (label: string, factors: Factor[]): DamagePart => ({ label, damage: product(factors), factors });
    const talentSkill = (label: string, core: Factor[]) =>
        part(label, [...core, critFactor, ...reductionFactor(armor.single), ...fTalentExtra, fTalentSkill, ...tail]);

    // ── 秘法：才能部分 + 秘法部分，各自依保護模式扣保護 ──
    const combo = (id: ArcaneId): Factor => {
        const c = s.combo[id];
        const meta = COMBO_META[id];
        const effect = Math.min(Math.max(c.crystals, 0), COMBO_MAX_CRYSTALS) * meta.perCrystal + c.oghamPercent / 100;
        const herb = (c.elementHerb ? 0.1 : 0) + (c.mandrake ? 0.05 : 0);
        // 1 + 藥草 + 效率（10% + 細工），水火土結晶數、藥草有無、土效率 19 都實測吻合（2026-10-27～29）
        const eff = 0.1 + s.masteryReforge[meta.element] * MASTERY_REFORGE_STEP[meta.element] * 2;
        const effLabel = `${ELEMENT_LABELS[meta.element]}效率`;
        return { label: "元素組合", value: 1 + effect * (1 + herb + eff), note: `${meta.effect} ${pct(effect)} × (1 + 藥草 ${pct(herb)} + ${effLabel} ${pct(eff)})` };
    };
    const outerProtection = (): Factor[] => reductionFactor(armor.single);
    const talentPartProtection = (): Factor[] => {
        if (s.protectionMode === "doublePierce") return reductionFactor(armor.double, "保護減傷（雙倍銳利）");
        if (s.protectionMode === "twice") return [...reductionFactor(armor.single, "保護減傷（才能部分先扣一次）"), ...outerProtection()];
        const gain = armor.none < 1 ? (1 - armor.single) / (1 - armor.none) : 1;
        return [...(gain !== 1 ? [{ label: "銳利增益（參考：才能部分）", value: gain, note: "(1−銳利後減傷) ÷ (1−未銳利減傷)" }] : []), ...outerProtection()];
    };
    const arcaneSkill = (id: ArcaneId, talentLabel: string, talentCore: Factor[], fixedFactors: Factor[], shared: Factor[] = [], avg = fAvg(), avgLabel = "秘法部分") => {
        const c = [combo(id)];
        return [
            part(talentLabel, [...talentCore, fT, fTalentSkill, ...shared, ...c, critFactor, ...talentPartProtection(), ...fArcaneExtra, ...tail]),
            part(avgLabel, [avg, ...fixedFactors, ...shared, ...c, critFactor, ...outerProtection(), ...fArcaneExtra, ...tail]),
        ];
    };
    const fRelic = (id: "spiral" | "chemical"): Factor => ({
        label: "穆利亞斯的遺物",
        value: 1 + s.relic[id] * RELIC_ARCANE_STEP[id],
        note: `${s.relic[id]} 級 × ${pct(RELIC_ARCANE_STEP[id])}（說明數字 ÷ 10）`,
    });

    const skills: SkillResult[] = [];
    const push = (id: SkillId, parts: DamagePart[], formula: string) => {
        const m = SKILL_META.find((x) => x.id === id)!;
        skills.push({ id, label: m.label, imageId: m.imageId, damage: parts.reduce((sum, p) => sum + p.damage, 0), parts, formula });
    };

    push("waterCannon", [talentSkill("水炮", waterCannonCore)], "水鍊金術傷害·倍率·6.25·精通區·造雨·套裝·暴擊·(1+武器)·(1+通用+才能)");
    push("flamer", [talentSkill("火焰噴射", flamerCore(s.flamerCharge, Math.floor(flamerHits(s))))], "火鍊金術傷害·倍率·集氣·精通區·套裝·段數（捨去小數）·暴擊·(1+武器)·(1+通用+才能)");
    // 元素波動 +25% 只加在高壓火爆本身，化學狂歡借用的高壓火爆部分不吃（2026-10-25 實測）
    const fElementWave: Factor = { label: "元素波動", value: s.elementWave ? 1.25 : 1 };
    push("heatBuster", [talentSkill("高壓火爆", [...heatBusterCore(), fElementWave])], "火鍊金術傷害·倍率·(1+武器加成)·元素波動·精通區·暴擊·(1+武器)·(1+通用+才能)");

    push(
        "spiral",
        arcaneSkill("spiral", "水炮部分（5 集氣）", waterCannonCore, [{ label: "地裂螺旋倍率", value: 10.8, note: "1080%" }, fRelic("spiral")]),
        "[水炮·(1+才能額外)·黑暗聚能 + 平均·1080%·遺物] × 元素組合 × (1+武器)·(1+通用+秘法)",
    );

    // 第一次爆炸 = 高壓火爆 + 平均 × 900%；後續爆炸 (能量 + 1) 段，每段 = 高壓火爆 + 平均 × 900% × 50%；遺物都乘平均部分、都吃火效果
    // 消耗能量：用扣掉屬性能量加成的面板（施放前面板全滿，傷害吻合扣完的面板，2026-10-29）
    const chemicalEnergy = Math.min(Math.max(Math.round(s.chemicalEnergy), 0), 4);
    const fChemicalRatio: Factor = { label: "化學狂歡倍率", value: 9, note: "900%" };
    const fFollowUpAvg: Factor = { label: "後續爆炸倍率", value: 9 * CHEMICAL_FOLLOW_UP_AVG_RATIO, note: `900% × ${pct(CHEMICAL_FOLLOW_UP_AVG_RATIO)}` };
    const fFollowUpHits: Factor = { label: "後續爆炸段數", value: chemicalEnergy + 1, note: `能量 ${chemicalEnergy} + 1` };
    const spentAvg = fAvg(alchSpent);
    push(
        "chemical",
        [
            ...arcaneSkill("chemical", "第一次爆炸：高壓火爆部分", heatBusterCore(alchSpent), [fChemicalRatio, fRelic("chemical")], [], spentAvg, "第一次爆炸：平均部分"),
            ...arcaneSkill("chemical", "後續爆炸：高壓火爆部分", heatBusterCore(alchSpent), [fFollowUpAvg, fRelic("chemical")], [fFollowUpHits], spentAvg, "後續爆炸：平均部分"),
        ],
        "第一次爆炸 [高壓火爆·(1+才能額外)·黑暗聚能 + 平均·900%·遺物] + 後續 (能量+1) 段 × [高壓火爆·(1+才能額外)·黑暗聚能 + 平均·900%·50%·遺物]，各 × 元素組合 × (1+武器)·(1+通用+秘法)",
    );

    // (火焰噴射 5 集氣 × 段數 + 平均) × 額外傷害值倍率；段數 5（10-24）與 8.6（持續時間 18 級）都實測吻合，平均部分不乘段數
    const energy = Math.min(Math.max(Math.round(s.nightmareEnergy), 0), NIGHTMARE_RATIOS.length - 1);
    const relicBonus = energy === 4 ? s.relic.nightmare * 0.05 : 0;
    const nightmareRatio = NIGHTMARE_RATIOS[energy] + relicBonus;
    const fNightmareRatio: Factor = {
        label: "額外傷害值倍率",
        value: nightmareRatio,
        note: `${energy} 能量 ${pct(NIGHTMARE_RATIOS[energy])}${relicBonus ? ` + 遺物 ${pct(relicBonus)}` : ""}`,
    };
    push(
        "nightmare",
        arcaneSkill("nightmare", "火焰噴射部分（5 集氣 × 段數）", flamerCore(5, flamerHits(s), alchSpent), [], [fNightmareRatio], spentAvg),
        "(火焰噴射 5 集氣·段數·(1+才能額外)·黑暗聚能 + 平均) × 額外傷害值倍率 × 元素組合 × (1+武器)·(1+通用+秘法)",
    );

    return {
        skills,
        alch,
        masteryZone: Object.fromEntries(ELEMENTS.map((e) => [e, zone(e)])) as Record<Element, number>,
        talentExtra: (1 + W) * (1 + G + T),
        arcaneExtra: (1 + W) * (1 + G + A),
        independent: N,
    };
}

export function calculateAlchemy(s: AlchemySettings, critMode: CritMode = "expected") {
    const critRatePercent = calculateCritRatePercent(s);
    const critDamagePercent = calculateCritDamagePercent(s);
    const rate = critRatePercent / 100;
    const labels: Record<CritMode, Factor> = {
        noCrit: { label: "暴擊", value: 1, note: "沒暴擊" },
        crit: { label: "暴擊", value: 1, note: `暴擊 ${critDamagePercent}%` },
        expected: { label: "暴擊（以下為暴擊時的乘區）", value: 1, note: `期望值 = 沒暴擊 + (暴擊 − 沒暴擊) × 暴擊率 ${critRatePercent}%` },
    };
    const noCrit = calculateRun(s, false, labels[critMode]);
    const crit = calculateRun(s, true, labels[critMode]);
    const skills =
        critMode === "noCrit"
            ? noCrit.skills
            : critMode === "crit"
              ? crit.skills
              : crit.skills.map((sk, i) => {
                    const nc = noCrit.skills[i];
                    const parts = sk.parts.map((p, j) => ({ ...p, damage: nc.parts[j].damage + (p.damage - nc.parts[j].damage) * rate }));
                    return { ...sk, parts, damage: parts.reduce((sum, p) => sum + p.damage, 0) };
                });
    return {
        ...noCrit,
        critRatePercent,
        critDamagePercent,
        critMultiplier: critMode === "noCrit" ? 1 : critMode === "crit" ? critDamagePercent / 100 : 1 + rate * (critDamagePercent / 100 - 1),
        armor: calculateArmor(s),
        skills,
    };
}

/** 總輸出 = Σ 單次傷害（期望值）× 使用次數 */
export function calculateTotalOutput(s: AlchemySettings): number {
    return calculateAlchemy(s, "expected").skills.reduce((sum, sk) => sum + sk.damage * (s.usage[sk.id] ?? 0), 0);
}
