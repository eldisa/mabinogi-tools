/**
 * 瑪奇通用戰鬥公式引擎 — 攻擊力／暴擊傷害／額外傷害／才能技能與秘法技能傷害公式。
 *
 * 這個檔案刻意寫成 class-agnostic（不參考任何特定職業），供各職業計算器 import 使用。
 * 職業專屬的資料（例如聖盾騎士的武器/盾牌/套裝、技能倍率）留在各自的 data 檔案裡，
 * 只把「算出來的百分比/倍率」傳進這裡的函式。
 *
 * 保護減算／防禦減算（對怪物防禦/保護的實際扣減）目前沒有資料可以反推，先當作
 * 不扣減（保護減算×1、防禦減算-0）的佔位參數，等之後有實測資料再校正。
 */

// ═══════════════════════════════════════════════════════
//  髒髒最大傷害（宗師／變身／寵物／辦桌／活動加成）
// ═══════════════════════════════════════════════════════

export type MasterGradeWeaponCategory = "dual_gun" | "other";

/** 宗師：雙槍職業 12，其餘職業 30 */
export const MASTER_GRADE_BONUS: Record<MasterGradeWeaponCategory, number> = {
    dual_gun: 12,
    other: 30,
};

export interface PetBonusOption {
    id: string;
    label: string;
    bonus: number;
}

/** 寵物加成，可複選疊加 */
export const PET_BONUS_OPTIONS: PetBonusOption[] = [
    { id: "cat", label: "蹭蹭貓醬", bonus: 55 },
    { id: "hamster", label: "倉鼠", bonus: 40 },
    { id: "japari_bus", label: "Japari 巴士", bonus: 15 },
];

export interface TransformationOption {
    id: string;
    label: string;
    /** 變身固定加成 */
    baseDamage: number;
    /** 專屬細工：未突破 20 級內 */
    untamedDamage: number;
    /** 專屬細工：突破 21~25 級 */
    brokenDamage: number;
}

export const TRANSFORMATION_OPTIONS: TransformationOption[] = [
    { id: "none", label: "無變身", baseDamage: 0, untamedDamage: 0, brokenDamage: 0 },
    { id: "sacred_blade", label: "神聖之刃", baseDamage: 34, untamedDamage: 80, brokenDamage: 100 },
    { id: "chaos_wrath", label: "克諾斯之怒", baseDamage: 30, untamedDamage: 40, brokenDamage: 50 },
    { id: "physis_guardian", label: "菲西斯守護者", baseDamage: 18, untamedDamage: 40, brokenDamage: 50 },
];

export function getTransformationOption(transformationId: string): TransformationOption {
    return TRANSFORMATION_OPTIONS.find((t) => t.id === transformationId) ?? TRANSFORMATION_OPTIONS[0];
}

/**
 * 變身細工等級 0~33（27~33 為突破限定）：0 級無加成，1~26 級套用未突破數值，27~33 級套用突破數值。
 * 目前沒有逐級數值資料，同一區間內數值固定不隨等級變化，等之後有逐級資料再校正。
 */
export function calculateTransformationDirtyDamage(transformationId: string, reforgeLevel: number): number {
    const t = getTransformationOption(transformationId);
    const tierDamage = reforgeLevel >= 27 ? t.brokenDamage : reforgeLevel >= 1 ? t.untamedDamage : 0;
    return t.baseDamage + tierDamage;
}

export interface DirtyMaxDamageState {
    masterGradeActive: boolean;
    masterGradeCategory: MasterGradeWeaponCategory;
    transformationId: string;
    /** 變身細工等級 0~33（27~33 突破限定） */
    transformationReforgeLevel: number;
    petIds: string[];
    banquetBonus: number;
    eventBonus: number;
    /** 聖水大傷加總，由呼叫端從裝備資料算好傳入（面板最大傷害不計入聖水，這裡另外加總） */
    holyWaterMaxDamage: number;
}

export interface DirtyMaxDamageResult {
    masterGrade: number;
    transformation: number;
    pets: number;
    banquet: number;
    event: number;
    holyWater: number;
    total: number;
}

export function calculateDirtyMaxDamage(state: DirtyMaxDamageState): DirtyMaxDamageResult {
    const masterGrade = state.masterGradeActive ? MASTER_GRADE_BONUS[state.masterGradeCategory] : 0;
    const transformation = calculateTransformationDirtyDamage(state.transformationId, state.transformationReforgeLevel);
    const pets = state.petIds.reduce((sum, id) => sum + (PET_BONUS_OPTIONS.find((p) => p.id === id)?.bonus ?? 0), 0);
    const banquet = state.banquetBonus;
    const event = state.eventBonus;
    const holyWater = state.holyWaterMaxDamage;
    return { masterGrade, transformation, pets, banquet, event, holyWater, total: masterGrade + transformation + pets + banquet + event + holyWater };
}

/** 乾淨最大傷害 = 面板最大傷害（無狀態，未計入聖水） − 髒髒最大傷害總和（含聖水大傷） */
export function calculateCleanMaxDamage(panelMaxDamage: number, dirtyTotal: number): number {
    return panelMaxDamage - dirtyTotal;
}

// ═══════════════════════════════════════════════════════
//  常數攻擊力（職業附加傷害／精靈武器攻擊力強化，不吃攻擊係數）
// ═══════════════════════════════════════════════════════

export type SpiritWeaponAttackType = "bow" | "two_hand_sword" | "lance" | "one_hand_axe" | "other";

export const SPIRIT_WEAPON_ATTACK_BONUS: Record<SpiritWeaponAttackType, number> = {
    bow: 30,
    two_hand_sword: 50,
    lance: 50,
    one_hand_axe: 40,
    other: 0,
};

export type ArcanaSyncBonusClass = "elemental_archer" | "elemental_knight" | "burst_lancer" | "phantom_gunner" | "none";

/** 秘法同步獎勵的最大傷害，依職業而定；聖盾沒有這項加成 */
export const ARCANA_SYNC_BONUS: Record<ArcanaSyncBonusClass, number> = {
    elemental_archer: 100,
    elemental_knight: 250,
    burst_lancer: 200,
    phantom_gunner: 100,
    none: 0,
};

export interface ConstantAttackPowerState {
    spiritWeaponActive: boolean;
    spiritWeaponType: SpiritWeaponAttackType;
    arcanaSyncClass: ArcanaSyncBonusClass;
    /** 其他職業自訂的常數攻擊力來源（例如聖盾的鍋子盾牌 +40），直接加總進來 */
    extraFlat?: number;
}

export function calculateConstantAttackPower(state: ConstantAttackPowerState): number {
    const spiritWeapon = state.spiritWeaponActive ? SPIRIT_WEAPON_ATTACK_BONUS[state.spiritWeaponType] : 0;
    const arcanaSync = ARCANA_SYNC_BONUS[state.arcanaSyncClass];
    return spiritWeapon + arcanaSync + (state.extraFlat ?? 0);
}

// ═══════════════════════════════════════════════════════
//  攻擊係數 + 最終最大傷害
// ═══════════════════════════════════════════════════════

export interface AttackCoefficientState {
    /** 物理攻擊力增加藥水 ×1.2 */
    physicalPotionActive: boolean;
    /** 職業魔劍三項注魔 ×1.1（通用引擎保留此參數，非魔劍職業維持 false 即可） */
    tripleEnchantActive: boolean;
    /** [狀態支援] +12% */
    statusSupportActive: boolean;
    /** [力量團聚] +15% */
    strengthGatherActive: boolean;
    /** [戰場的序曲] 是否發動 */
    battlefieldActive: boolean;
    /** 戰場加成%，直接輸入數值（到小數點後兩位），跟「戰場上的狂吼」（特殊樂譜效果）是不同的獨立加成 */
    battlefieldPercent: number;
    /** 特殊樂譜效果：戰場上的狂吼 */
    battleCryActive: boolean;
    /** 細工樂器演奏效果等級，0~25（21~25 為突破限定） */
    battleCryReforgeLevel: number;
}

export function calculateAttackCoefficient(state: AttackCoefficientState): number {
    let coefficient = 1;
    if (state.physicalPotionActive) coefficient *= 1.2;
    if (state.tripleEnchantActive) coefficient *= 1.1;
    return coefficient;
}

/** 戰吼% = 31.2 + 細工樂器演奏效果等級 × 0.2 */
export function calculateBattleCryPercent(state: AttackCoefficientState): number {
    if (!state.battleCryActive) return 0;
    return 31.2 + state.battleCryReforgeLevel * 0.2;
}

/**
 * 最終最大傷害 = (乾淨最大傷害 × 攻擊係數 + 髒髒總和 + 常數攻擊力)
 *              × (1 + 戰場% × 攻擊係數) × (1 + 特殊樂譜效果% × 攻擊係數)
 *              × (1 + 狀態支援% × 攻擊係數) × (1 + 力量團聚% × 攻擊係數)
 *
 * 髒髒最大傷害與常數攻擊力不吃攻擊係數（藥水/三注魔）；戰場/特殊樂譜效果/狀支/團聚
 * 這 4 個 buff 各自的百分比在加回 1 之前，都要再各自乘上一次攻擊係數。
 */
export function calculateFinalMaxDamage(
    cleanMaxDamage: number,
    dirtyTotal: number,
    constantAttackPower: number,
    coefficientState: AttackCoefficientState,
): number {
    const coefficient = calculateAttackCoefficient(coefficientState);
    const base = cleanMaxDamage * coefficient + dirtyTotal + constantAttackPower;
    const battlefieldMultiplier = 1 + ((coefficientState.battlefieldActive ? coefficientState.battlefieldPercent : 0) / 100) * coefficient;
    const battleCryMultiplier = 1 + (calculateBattleCryPercent(coefficientState) / 100) * coefficient;
    const statusSupportMultiplier = 1 + ((coefficientState.statusSupportActive ? 12 : 0) / 100) * coefficient;
    const strengthGatherMultiplier = 1 + ((coefficientState.strengthGatherActive ? 15 : 0) / 100) * coefficient;
    return base * battlefieldMultiplier * battleCryMultiplier * statusSupportMultiplier * strengthGatherMultiplier;
}

// ═══════════════════════════════════════════════════════
//  暴擊傷害（加總）
// ═══════════════════════════════════════════════════════

export type CriticalDamageSetTier = "none" | "tier4" | "tier7" | "tier10";

/** 暴擊傷害套裝：4% / 7% / 10%（整套暮光） */
export const CRITICAL_DAMAGE_SET_BONUS: Record<CriticalDamageSetTier, number> = {
    none: 0,
    tier4: 4,
    tier7: 7,
    tier10: 10,
};

/** 艾爾班騎士團訓練所圖騰：+5% 暴擊傷害（25 大傷選項已移除，因為填面板最大傷害時這個永久加成通常已經算進去了，避免重複計算） */
export type TotemChoice = "none" | "critical_damage";

export interface CriticalDamageState {
    skillR1Active: boolean;
    fullGradeActive: boolean;
    spiritWeaponCritActive: boolean;
    /** 武器特殊改造 R 的暴擊傷害%（依武器種類與階段查表後傳入） */
    weaponSpecialReforgeCritPercent: number;
    setTier: CriticalDamageSetTier;
    totemChoice: TotemChoice;
    dollBagPercent: number;
    farmModelPercent: number;
    titlePercent: number;
    /** 布里萊赫的硬幣 1~10%（暴擊傷害） */
    brireheCoinPercent: number;
    /** 職業固定加成，例如元素騎士/幻變槍手 +5%，聖盾沒有，傳 0 */
    classBonusPercent: number;
    /** 聖水暴擊傷害加總%（8 部位），由呼叫端從裝備資料算好傳入 */
    holyWaterPercent: number;
    assassinOutfitActive: boolean;
}

export function calculateCriticalDamagePercent(state: CriticalDamageState): number {
    const base = 100;
    const skillR1 = state.skillR1Active ? 150 : 0;
    const fullGrade = state.fullGradeActive ? 10 : 0;
    const spiritWeapon = state.spiritWeaponCritActive ? 15 : 0;
    const weaponSpecialReforge = state.weaponSpecialReforgeCritPercent;
    const set = CRITICAL_DAMAGE_SET_BONUS[state.setTier];
    const totem = state.totemChoice === "critical_damage" ? 5 : 0;
    const assassinOutfit = state.assassinOutfitActive ? 12 : 0;
    return (
        base +
        skillR1 +
        fullGrade +
        spiritWeapon +
        weaponSpecialReforge +
        set +
        totem +
        state.dollBagPercent +
        state.farmModelPercent +
        state.titlePercent +
        state.brireheCoinPercent +
        state.classBonusPercent +
        state.holyWaterPercent +
        assassinOutfit
    );
}

// ═══════════════════════════════════════════════════════
//  暴擊率（決定暴擊傷害要不要換算成期望值）
// ═══════════════════════════════════════════════════════

export interface CriticalRateState {
    /** 暴擊率基準值%，依角色屬性/裝備而定，直接輸入 */
    baseCriticalRatePercent: number;
    /** 道具加成 +1% 是否啟用 */
    itemBonusActive: boolean;
}

/** 暴擊率道具加成 +1% */
export const CRITICAL_RATE_ITEM_BONUS = 1;

export function calculateCriticalRatePercent(state: CriticalRateState): number {
    return state.baseCriticalRatePercent + (state.itemBonusActive ? CRITICAL_RATE_ITEM_BONUS : 0);
}

/**
 * 暴擊傷害期望值＝ 100 + 暴擊率% × (暴擊傷害% − 100) / 100。
 * 未暴擊時只拿基礎 100% 傷害，暴擊時額外吃暴擊傷害加成，依暴擊率加權平均成一個固定倍率，
 * 這樣才能技能／秘法技能公式可以直接套用，不用另外模擬「這一擊是否暴擊」的隨機性。
 */
export function calculateCriticalDamageExpected(criticalDamagePercent: number, criticalRatePercent: number): number {
    return 100 + (criticalRatePercent / 100) * (criticalDamagePercent - 100);
}

// ═══════════════════════════════════════════════════════
//  額外傷害（通用額外傷害 = 兩桶相乘）
// ═══════════════════════════════════════════════════════

export interface ExtraDamageState {
    /** 武器額外傷害% + 盾牌單手武器額外傷害%，由呼叫端算好傳入 */
    weaponExtraDamagePercent: number;
    titlePercent: number;
    totemPercent: number;
    farmModelPercent: number;
    /** 套裝效果（日月之神隨機發動/暮光套被動）0% 或 5% */
    setEffectActive: boolean;
}

/** 通用額外傷害 = (1+武器額外傷害) × (1+額外傷害)，回傳完整倍率（例如 1.61） */
export function calculateGeneralExtraDamageMultiplier(state: ExtraDamageState): number {
    const generalPercent = state.titlePercent + state.totemPercent + state.farmModelPercent + (state.setEffectActive ? 5 : 0);
    return (1 + state.weaponExtraDamagePercent / 100) * (1 + generalPercent / 100);
}

// ═══════════════════════════════════════════════════════
//  才能增加傷害（乘算）
// ═══════════════════════════════════════════════════════

export interface TalentIncreaseDamageState {
    /** 種族技能換算成的%，由呼叫端依種族/技能類型算好傳入（人類5%全才能／巨人15%近戰鎖鏈／精靈10%弓術，只挑符合目前技能類型的才套用） */
    raceSkillPercent: number;
    /** 猛擊層數對應的近戰才能技能傷害%，由呼叫端傳入 */
    mengJiPercent: number;
}

export function calculateTalentIncreaseDamageMultiplier(state: TalentIncreaseDamageState): number {
    return (1 + state.raceSkillPercent / 100) * (1 + state.mengJiPercent / 100);
}

// ═══════════════════════════════════════════════════════
//  最終增加傷害（乘算）
// ═══════════════════════════════════════════════════════

export interface RageImpactState {
    active: boolean;
    /** 魔法陣等級 0~10，每級 0.3% */
    magicCircleLevel: number;
    /** 帝國騎士手套 +2% */
    imperialGauntletTagActive: boolean;
}

export function calculateRageImpactPercent(state: RageImpactState): number {
    if (!state.active) return 0;
    return 15 + state.magicCircleLevel * 0.3 + (state.imperialGauntletTagActive ? 2 : 0);
}

export interface DeathBrandState {
    active: boolean;
    setBonusActive: boolean;
    /** 細工等級，1~25（21~25 突破限定），每級 0.25% */
    reforgeLevel: number;
}

export function calculateDeathBrandPercent(state: DeathBrandState): number {
    if (!state.active) return 0;
    return 53 + (state.setBonusActive ? 3 : 0) + state.reforgeLevel * 0.25;
}

export interface InsightEyeState {
    active: boolean;
    /** 指揮官的徽章等級 0~5，每級 0.4% */
    commanderBadgeLevel: number;
}

export function calculateInsightEyePercent(state: InsightEyeState): number {
    if (!state.active) return 0;
    return 3 + state.commanderBadgeLevel * 0.4;
}

export interface FinalIncreaseDamageState {
    combatServiceBuffActive: boolean;
    dakotaGlowActive: boolean;
    deathBrand: DeathBrandState;
    rageImpact: RageImpactState;
    destinyWeaveActive: boolean;
    insightEye: InsightEyeState;
    cloverMarkActive: boolean;
}

export function calculateFinalIncreaseDamageMultiplier(state: FinalIncreaseDamageState): number {
    const combatService = state.combatServiceBuffActive ? 1 : 0;
    const dakota = state.dakotaGlowActive ? 5 : 0;
    const deathBrand = calculateDeathBrandPercent(state.deathBrand);
    const rageImpact = calculateRageImpactPercent(state.rageImpact);
    const destinyWeave = state.destinyWeaveActive ? 5 : 0;
    const insightEye = calculateInsightEyePercent(state.insightEye);
    const clover = state.cloverMarkActive ? 15 : 0;
    return (
        (1 + combatService / 100) *
        (1 + dakota / 100) *
        (1 + deathBrand / 100) *
        (1 + rageImpact / 100) *
        (1 + destinyWeave / 100) *
        (1 + insightEye / 100) *
        (1 + clover / 100)
    );
}

// ═══════════════════════════════════════════════════════
//  秘法額外傷害（先建資料，尚未接進最終公式）
// ═══════════════════════════════════════════════════════

export interface ArcaneExtraDamageState {
    /** 不完美的空想王冠光環 3% */
    imperfectCrownAuraActive: boolean;
    /** 布里萊赫的硬幣 0.15~3% */
    brireheCoinPercent: number;
    /** 穆利亞斯的遺物 接尾賦予捲軸 1% × 0~3 個 */
    muliasRelicCount: number;
}

export function calculateArcaneExtraDamagePercent(state: ArcaneExtraDamageState): number {
    const crown = state.imperfectCrownAuraActive ? 3 : 0;
    const brirehe = state.brireheCoinPercent;
    const mulias = state.muliasRelicCount * 1;
    return crown + brirehe + mulias;
}

// ═══════════════════════════════════════════════════════
//  才能技能 / 秘法技能 傷害公式
// ═══════════════════════════════════════════════════════

export interface TalentSkillTargetDamageInput {
    finalAttackPower: number;
    /** 技能傷害倍率% */
    skillRatioPercent: number;
    criticalDamagePercent: number;
    /** 保護減算，先當不扣減（1） */
    protectionReduction?: number;
    /** 防禦減算，先當不扣減（0） */
    defenseReduction?: number;
}

/**
 * 才能技能初始傷害 = 最終攻擊力 × 技能傷害倍率 × 暴擊傷害期望值
 * 才能技能目標傷害 = 初始傷害 × 保護減算 − 防禦減算
 *
 * 這是才能技能傷害算到一半的中間值（還沒乘「(1+通用額外傷害+才能額外傷害)×才能增加傷害×最終增加傷害」），
 * 秘法技能借用某個才能技能時，「採計的才能技能目標傷害」就是用這個函式算出來的值。
 */
export function calculateTalentSkillTargetDamage(input: TalentSkillTargetDamageInput): number {
    const initial = input.finalAttackPower * (input.skillRatioPercent / 100) * (input.criticalDamagePercent / 100);
    return initial * (input.protectionReduction ?? 1) - (input.defenseReduction ?? 0);
}

export interface TalentSkillDamageInput extends TalentSkillTargetDamageInput {
    /** (1+通用額外傷害) 的完整倍率，見 calculateGeneralExtraDamageMultiplier */
    generalExtraDamageMultiplier: number;
    /** 才能額外傷害加總%（精靈武器弱點分析/狂暴化/實體化、零秒狙擊等，聖盾通常為 0） */
    talentExtraDamagePercent: number;
    talentIncreaseDamageMultiplier: number;
    finalIncreaseDamageMultiplier: number;
    /** 追加傷害（固定值），沒有就是 0 */
    bonusFlatDamage?: number;
}

/**
 * 才能技能最終傷害 = [ 才能技能目標傷害 × (1+通用額外傷害+才能額外傷害) × 才能增加傷害 × 最終增加傷害 ] + 追加傷害
 */
export function calculateTalentSkillDamage(input: TalentSkillDamageInput): number {
    const target = calculateTalentSkillTargetDamage(input);
    const extraMultiplier = input.generalExtraDamageMultiplier + input.talentExtraDamagePercent / 100;
    return target * extraMultiplier * input.talentIncreaseDamageMultiplier * input.finalIncreaseDamageMultiplier + (input.bonusFlatDamage ?? 0);
}

export interface ArcaneSkillDamageInput {
    /** 採計的才能技能目標傷害：借用某個才能技能的目標傷害（用 calculateTalentSkillTargetDamage 算好、已含「採計」比例權重後傳入） */
    countedTalentSkillTargetDamage: number;
    /**
     * 秘法技能自己的傷害加總（不含借用才能技能的那部分項目，例如基礎傷害/加護力/最大生命等 ratio×stat 加總），
     * 尚未乘暴擊傷害期望值
     */
    arcaneOnlyRawDamage: number;
    criticalDamagePercent: number;
    talentExtraDamagePercent: number;
    talentIncreaseDamageMultiplier: number;
    generalExtraDamageMultiplier: number;
    arcaneExtraDamagePercent: number;
    finalIncreaseDamageMultiplier: number;
    protectionReduction?: number;
    defenseReduction?: number;
    bonusFlatDamage?: number;
}

/**
 * 秘法技能初始傷害 = [ 採計的才能技能目標傷害 × (1+才能額外傷害) × 才能增加傷害 ]
 *                  + [ 秘法技能自己的傷害加總 × 暴擊傷害期望值 ]
 * 秘法技能目標傷害 = 初始傷害 × 保護減算 − 防禦減算
 * 秘法技能最終傷害 = [ 目標傷害 × (1+通用額外傷害+秘法額外傷害) × 最終增加傷害 ] + 追加傷害
 */
export function calculateArcaneSkillDamage(input: ArcaneSkillDamageInput): number {
    const talentPortion = input.countedTalentSkillTargetDamage * (1 + input.talentExtraDamagePercent / 100) * input.talentIncreaseDamageMultiplier;
    const arcanePortion = input.arcaneOnlyRawDamage * (input.criticalDamagePercent / 100);
    const initial = talentPortion + arcanePortion;
    const target = initial * (input.protectionReduction ?? 1) - (input.defenseReduction ?? 0);
    const extraMultiplier = input.generalExtraDamageMultiplier + input.arcaneExtraDamagePercent / 100;
    return target * extraMultiplier * input.finalIncreaseDamageMultiplier + (input.bonusFlatDamage ?? 0);
}

// ═══════════════════════════════════════════════════════
//  種族技能對照（供各職業計算器參考套用，是否套用依技能類型而定）
// ═══════════════════════════════════════════════════════

export type RaceId = "human" | "elf" | "giant";

export interface RaceSkillOption {
    id: RaceId;
    label: string;
    skillName: string;
    description: string;
    /** 適用的才能技能類型 */
    appliesTo: "all" | "archery" | "melee_chain";
    percent: number;
}

export const RACE_SKILL_OPTIONS: RaceSkillOption[] = [
    { id: "human", label: "人類", skillName: "拉狄卡的氣息", description: "所有才能技能傷害 +5%", appliesTo: "all", percent: 5 },
    { id: "elf", label: "精靈", skillName: "拉狄卡的視線", description: "弓術才能技能傷害 +10%", appliesTo: "archery", percent: 10 },
    { id: "giant", label: "巨人", skillName: "拉狄卡的力量", description: "近戰／鎖鏈才能技能傷害 +15%", appliesTo: "melee_chain", percent: 15 },
];
