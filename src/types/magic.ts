// 精煉 snapshot：已換算為 % 值（level × rate）
export interface RefinementSnapshot {
    firebolt: number; // 火焰細工 level×1%  → Mult_f
    lightningBolt: number; // 雷矢細工  level×1%  → Mult_l
    fireMastery: number; // 精通火細工 level×0.5% → fire mastery pool
    lightningMastery: number; // 精通雷細工 level×0.5% → lightning mastery pool
    boltMastery: number; // 精通箭系細工 level×1% → 同時加入 fire & lightning mastery
    comboBolt: number; // 組合魔法細工 level×1% → BonusCC
    fireball: number; // 火球細工 level×3%   → Mult_FB (Dragonfire)
    thunder: number; // 雷擊細工 level×0.5% → Mult_Thunder (reserved)
}

// 魔法陣 snapshot：已換算為 % 值
export interface MagicCircleSnapshot {
    firebolt: number; // 火焰魔法陣 level×1%  → Mult_f
    lightningBolt: number; // 雷矢魔法陣  level×1%  → Mult_l
    comboBolt: number; // 組合魔法陣 level×1%  → BonusCC
    fireball: number; // 火球魔法陣 level×5%  → Mult_FB (Dragonfire)
    thunder: number; // 雷擊魔法陣 level×1%  → Mult_Thunder (reserved)
}

export interface TitleEffectSnapshot {
    primaryCC: number; // 組合魔法大師 +5%（or 0）
    firemastery: number; // Butterfly +1% / Rowan +3%（or 0）
    lightmastery: number; // Butterfly +15% / Rowan +3%（or 0）
    cc: number; // Butterfly +5%（or 0）
}

export interface MasterySnapshot {
    hebona: boolean; // Hebona 套裝 +15%
    fireMastery: boolean; // 火系精通 +15%
    wandMastery: boolean; // 魔杖精通 +150%
    boltMastery: boolean; // 閃電精通 +20%
    elementalSet: boolean; // 元素套裝 +15%
    lightningMastery: boolean; // 雷系精通 +15%
    charge5: boolean; // 5段蓄力 +28%
}

export interface GlobalBuffSnapshot {
    magicAttack: number; // 計算後最終魔攻
    extra: number; // 全部 extra（含精靈武器，小數）
    extraNoSpirit: number; // 不含精靈武器的 extra（Dragonfire 用，小數）
    weapon: number; // 武器評價合計（小數）
    critRate: number; // 暴擊率（小數）
    critDamage: number; // 暴擊傷害倍率（小數，e.g. 2.5 = 250%）
    chain: boolean; // 連擊加成 ×1.1
    masterTitle: boolean; // 精通稱號 ×1.05
    weaponIsStaff: boolean; // 是否為長杖（法杖加成 +0.002）
    mastery: MasterySnapshot;
    refinement: RefinementSnapshot;
    magicCircles: MagicCircleSnapshot;
    titleEffects: TitleEffectSnapshot;
}

export interface SkillDamageResult {
    base: number; // 一般攻擊傷害
    crit: number; // 暴擊傷害
    expected: number; // 期望傷害：base×(1-critRate) + crit×critRate
    breakdown: Record<string, number>; // 中間計算值（供 UI breakdown 顯示）
}

export interface MagicSkillModule {
    id: string;
    name: string;
    comingSoon?: boolean;
    defaultParams: Record<string, number | boolean>;
    calculate(buffs: GlobalBuffSnapshot, params: Record<string, number | boolean>): SkillDamageResult;
}
