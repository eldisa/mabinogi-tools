/**
 * 道具數值評分與分級計算模組
 *
 * 數學模型：X1 ∈ [1,20]（權重1） + X2 ∈ [1,10]（權重6） + X3 ∈ [1,20]（權重4）
 * 總分範圍 11 ~ 160，共 4,000 種組合，依總分區間映射至 SSS ~ D 七個等級。
 */

export type TierGrade = "SSS" | "SS" | "S" | "A" | "B" | "C" | "D";

export interface ItemRollInput {
    x1: number; // 1 ~ 20 (weight: 1)
    x2: number; // 1 ~ 10 (weight: 6)
    x3: number; // 1 ~ 20 (weight: 4)
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

const SCORE_MIN = 11;
const SCORE_MAX = 160;

const TIER_TABLE: TierInfo[] = [
    { grade: "SSS", name: "極品神裝", minScore: 150, maxScore: 160, percentileText: "前 0.68%", expectedRollsText: "約 148 次", description: "頂級天花板藏品" },
    { grade: "SS",  name: "終局畢業", minScore: 140, maxScore: 149, percentileText: "前 2.97%", expectedRollsText: "約 34 次",  description: "高端畢業，無需重洗" },
    { grade: "S",   name: "頂標主力", minScore: 130, maxScore: 139, percentileText: "前 7.35%", expectedRollsText: "約 14 次",  description: "高性價比畢業門檻" },
    { grade: "A",   name: "優質可用", minScore: 110, maxScore: 129, percentileText: "前 22.35%", expectedRollsText: "約 4.5 次", description: "中上實用成品" },
    { grade: "B",   name: "普通及格", minScore: 86,  maxScore: 109, percentileText: "前 50.00%", expectedRollsText: "約 2.0 次", description: "高於均值，平民過渡" },
    { grade: "C",   name: "偏低過渡", minScore: 60,  maxScore: 85,  percentileText: "前 79.53%", expectedRollsText: "約 1.3 次", description: "低於均值，建議重洗" },
    { grade: "D",   name: "廢品材料", minScore: 11,  maxScore: 59,  percentileText: "墊底 20.47%", expectedRollsText: "1 次",     description: "建議直接重洗" },
];

const assertInRange = (value: number, min: number, max: number, label: string) => {
    if (!Number.isInteger(value) || value < min || value > max) {
        throw new Error(`${label} 需為 ${min}~${max} 的整數，收到 ${value}`);
    }
};

export const evaluateItemQuality = (x1: number, x2: number, x3: number): EvaluationResult => {
    assertInRange(x1, 1, 20, "x1");
    assertInRange(x2, 1, 10, "x2");
    assertInRange(x3, 1, 20, "x3");

    const totalScore = x1 * 1 + x2 * 6 + x3 * 4;
    const qualityPercentage = Number((((totalScore - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100).toFixed(2));
    const tier = TIER_TABLE.find((t) => totalScore >= t.minScore && totalScore <= t.maxScore)!;

    return { inputs: { x1, x2, x3 }, totalScore, qualityPercentage, tier };
};
