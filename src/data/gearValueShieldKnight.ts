/**
 * 聖盾騎士的效益檔：把「傷害效益」的結果（1 單位等同多少大傷）對應到賦予／稱號／娃娃背包／細工的能力名稱。
 * 不同職業要另外建立自己的對照檔（哪些能力有用、細工詞條叫什麼名字）。
 */
import type { ValueProfile } from "./gearValue";
import type { DamageEfficiencyItem } from "./shieldKnightCalculator";

type EfficiencyLike = Pick<DamageEfficiencyItem, "id" | "equivalentMaxDamage">;

/** 效益檔裡聖盾騎士有用到的傷害效益項目 → 能力名稱／細工詞條名稱 */
const STAT_FROM_EFFICIENCY: [DamageEfficiencyItem["id"], string[]][] = [
    // 計算器的暴擊率視為已達上限，「傷害效益」的暴擊率是「暴擊率上限」+1% 的價值，對應「暴擊上限增加」，不是一般的「暴擊率」
    ["criticalRate", ["暴擊上限增加"]],
    ["criticalDamage", ["暴擊傷害"]],
    ["extraDamage", ["額外傷害"]],
    ["weaponExtraDamage", ["武器額外傷害"]],
    ["arcaneExtraDamage", ["秘法額外傷害"]],
    ["talentIncreaseDamage", ["才能增加傷害"]],
    ["finalIncreaseDamage", ["最終增加傷害"]],
    ["maxHp", ["最大生命值", "生命值"]],
    // 加護力 = 防禦 + 保護 + 魔法防禦 + 魔法保護，四個每點等值
    ["defense", ["防禦", "保護", "魔法防禦", "魔法保護"]],
    ["sharpLevel", ["銳利等級"]],
];

const LEVEL_FROM_EFFICIENCY: [DamageEfficiencyItem["id"], string][] = [
    ["smashReforge", "重擊傷害"],
    ["chargeReforge", "突擊傷害"],
    ["windmillReforge", "旋風擺蓮腿傷害"],
];

export function buildShieldKnightProfile(items: EfficiencyLike[]): ValueProfile {
    const eq = (id: DamageEfficiencyItem["id"]): number | null => items.find((i) => i.id === id)?.equivalentMaxDamage ?? null;
    const statWeights: Record<string, number> = { 最大傷害: 1 };
    for (const [id, names] of STAT_FROM_EFFICIENCY) {
        const w = eq(id);
        if (w !== null) names.forEach((n) => (statWeights[n] = w));
    }
    const levelWeights: Record<string, number> = {};
    for (const [id, name] of LEVEL_FROM_EFFICIENCY) {
        const w = eq(id);
        if (w !== null) levelWeights[name] = w;
    }
    // 遊戲有暴擊率上限，只能靠卡莉亞赫的結界或活動 buff 拉高，所以賦予／稱號／細工提供的「暴擊率」忽略（設 0）
    statWeights["暴擊率"] = 0;
    return {
        id: "shield-knight",
        label: "聖盾騎士",
        weaponTypes: ["單手武器+盾"],
        statWeights,
        levelWeights,
        aliases: {
            最大攻擊力: "最大傷害",
            最大生命力: "最大生命值",
            精通斧最大傷害: "最大傷害",
            精通斧暴擊率: "暴擊率",
            暴擊上限: "暴擊上限增加",
            暴擊率上限: "暴擊上限增加",
        },
    };
}
