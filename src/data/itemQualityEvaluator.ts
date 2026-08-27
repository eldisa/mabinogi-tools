/**
 * 道具數值評分與分級計算模組
 *
 * 三格素質各自乘上係數加總為總分（滿分 100），係數依硬幣種類而異：
 *   物理／煉金：大傷×0.18 + 暴傷×1.20 + 秘法×28.13
 *   魔法    ：魔傷×1.03 + 暴傷×5.68 + 秘法×7.53
 *   支援    ：戰場攻擊提昇×75 + 持續時間×0.25 + 治癒效果×1
 *
 * 分級門檻（SSS~D）以「排名百分位」為基準：在各硬幣自己 4,000 種組合的總分
 * 分佈中，取相同名次（27/119/294/894/2000/3181）對應的分數作為該硬幣的級距，
 * 因此不同硬幣的同一等級代表相同的稀有度，即使門檻分數不同。
 */

export type TierGrade = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D";
export type CoinFormulaId = "physAlch" | "magic" | "support";

export interface ItemRollInput {
    x1: number;
    x2: number;
    x3: number;
}

export interface TierInfo {
    grade: TierGrade;
    name: string;
    minScore: number;
    maxScore: number;
    percentileText: string; // e.g., "前 7.35%"
    expectedRollsText: string; // e.g., "約 14 次"
    description: string;
}

export interface EvaluationResult {
    inputs: ItemRollInput;
    totalScore: number;
    qualityPercentage: number; // 0.00 ~ 100.00
    tier: TierInfo;
}

interface StatWeight {
    min: number;
    max: number;
    step: number;
    weight: number;
}

const FORMULAS: Record<CoinFormulaId, [StatWeight, StatWeight, StatWeight]> = {
    physAlch: [
        { min: 1,    max: 20,   step: 1,    weight: 0.18 },  // 大傷 / 4屬性煉金傷害
        { min: 1,    max: 10,   step: 1,    weight: 1.20 },  // 暴擊傷害
        { min: 0.15, max: 3.00, step: 0.15, weight: 28.13 }, // 秘法技能傷害加成
    ],
    magic: [
        { min: 1,    max: 20,   step: 1,    weight: 1.03 },  // 魔法攻擊力
        { min: 1,    max: 10,   step: 1,    weight: 5.68 },  // 暴擊傷害
        { min: 0.15, max: 3.00, step: 0.15, weight: 7.53 },  // 秘法技能傷害加成
    ],
    support: [
        { min: 0.1, max: 1.0, step: 0.1, weight: 75 },   // 戰場・活潑板攻擊提昇
        { min: 1,   max: 20,  step: 1,   weight: 0.25 }, // 音樂增益持續時間
        { min: 1,   max: 20,  step: 1,   weight: 1 },    // 治癒效果
    ],
};

// 各等級在 4,000 種組合中的目標名次（由累積機率 0.68%/2.97%/7.35%/22.35%/50%/79.53% 換算）
const RANK_TARGETS: { grade: Exclude<TierGrade, "D">; rank: number }[] = [
    { grade: "SSS", rank: 27 },
    { grade: "SS",  rank: 119 },
    { grade: "S",   rank: 294 },
    { grade: "A",   rank: 894 },
    { grade: "B",   rank: 2000 },
    { grade: "C",   rank: 3181 },
];

const TIER_META: Record<TierGrade, Pick<TierInfo, "name" | "percentileText" | "expectedRollsText" | "description">> = {
    SSS: { name: "極品神裝", percentileText: "前 0.68%",  expectedRollsText: "約 148 次", description: "頂級天花板藏品" },
    SS:  { name: "終局畢業", percentileText: "前 2.97%",  expectedRollsText: "約 34 次",  description: "高端畢業，無需重洗" },
    S:   { name: "頂標主力", percentileText: "前 7.35%",  expectedRollsText: "約 14 次",  description: "高性價比畢業門檻" },
    A:   { name: "優質可用", percentileText: "前 22.35%", expectedRollsText: "約 4.5 次", description: "中上實用成品" },
    B:   { name: "普通及格", percentileText: "前 50.00%", expectedRollsText: "約 2.0 次", description: "高於均值，平民過渡" },
    C:   { name: "偏低過渡", percentileText: "前 79.53%", expectedRollsText: "約 1.3 次", description: "低於均值，建議重洗" },
    D:   { name: "廢品材料", percentileText: "墊底 20.47%", expectedRollsText: "1 次",    description: "建議直接重洗" },
};

const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

const scoreOf = (stats: [StatWeight, StatWeight, StatWeight], v1: number, v2: number, v3: number): number =>
    round2(v1 * stats[0].weight + v2 * stats[1].weight + v3 * stats[2].weight);

const buildTierTable = (stats: [StatWeight, StatWeight, StatWeight]): TierInfo[] => {
    const scores: number[] = [];
    for (let i1 = stats[0].min; i1 <= stats[0].max + 1e-9; i1 += stats[0].step)
        for (let i2 = stats[1].min; i2 <= stats[1].max + 1e-9; i2 += stats[1].step)
            for (let i3 = stats[2].min; i3 <= stats[2].max + 1e-9; i3 += stats[2].step)
                scores.push(scoreOf(stats, i1, i2, i3));
    scores.sort((a, b) => b - a);

    const table: TierInfo[] = [];
    let upperBound = Infinity;
    for (const { grade, rank } of RANK_TARGETS) {
        const minScore = scores[rank - 1];
        table.push({ grade, minScore, maxScore: upperBound, ...TIER_META[grade] });
        upperBound = round2(minScore - 0.01);
    }
    table.push({ grade: "D", minScore: scores[scores.length - 1], maxScore: upperBound, ...TIER_META.D });
    return table;
};

const scoreRangeOf = (stats: [StatWeight, StatWeight, StatWeight]) => ({
    min: round2(stats[0].min * stats[0].weight + stats[1].min * stats[1].weight + stats[2].min * stats[2].weight),
    max: round2(stats[0].max * stats[0].weight + stats[1].max * stats[1].weight + stats[2].max * stats[2].weight),
});

const TIER_TABLES: Record<CoinFormulaId, TierInfo[]> = {
    physAlch: buildTierTable(FORMULAS.physAlch),
    magic: buildTierTable(FORMULAS.magic),
    support: buildTierTable(FORMULAS.support),
};

const SCORE_RANGES: Record<CoinFormulaId, { min: number; max: number }> = {
    physAlch: scoreRangeOf(FORMULAS.physAlch),
    magic: scoreRangeOf(FORMULAS.magic),
    support: scoreRangeOf(FORMULAS.support),
};

const assertValid = (val: number, s: StatWeight, label: string) => {
    const steps = Math.round((val - s.min) / s.step);
    const isOnGrid = Math.abs(s.min + steps * s.step - val) < 1e-6;
    if (!isOnGrid || val < s.min - 1e-9 || val > s.max + 1e-9) {
        throw new Error(`${label} 需為 ${s.min}~${s.max}、間隔 ${s.step} 的數值，收到 ${val}`);
    }
};

export const evaluateItemQuality = (formulaId: CoinFormulaId, x1: number, x2: number, x3: number): EvaluationResult => {
    const stats = FORMULAS[formulaId];
    assertValid(x1, stats[0], "第一項素質");
    assertValid(x2, stats[1], "第二項素質");
    assertValid(x3, stats[2], "第三項素質");

    const totalScore = scoreOf(stats, x1, x2, x3);
    const { min, max } = SCORE_RANGES[formulaId];
    const qualityPercentage = Number((((totalScore - min) / (max - min)) * 100).toFixed(2));
    const tier = TIER_TABLES[formulaId].find((t) => totalScore >= t.minScore && totalScore <= t.maxScore)!;

    return { inputs: { x1, x2, x3 }, totalScore, qualityPercentage, tier };
};
