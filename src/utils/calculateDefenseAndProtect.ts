import { calculateMonsterStatusAfterDebuff } from "./calculateDebuff";
import { EffectDetailEntry } from "../types";

export function calculateProtectionReductionRate(protection: number): number {
    // The formula for calculating the protection reduction rate
    const sqrt2 = Math.sqrt(2);
    const base = 10 * sqrt2;
    return (100 / sqrt2) * Math.log10((protection + base) / base);
}
// Calculate the damage before and after Crombas
// Crombas is a game mechanic that changes how damage is calculated
export function calculateDamageBeforeCrombas(
    originalDamage: number,
    defense: number,
    sharpReduction: number,
    penetration: number,
    protection: number
): number {
    const protectionRate = calculateProtectionReductionRate(protection);
    const reducedDefense = Math.max(defense - sharpReduction - penetration, 0);
    return (originalDamage - reducedDefense) * (1 - protectionRate / 100);
}
//貓本後的怪物防保計算
export function calculateDamageAfterCrombas(
    originalDamage: number,
    defense: number,
    sharpReduction: number,
    penetration: number,
    protection: number
): number {
    const protectionRate = calculateProtectionReductionRate(protection);
    const reducedDefense = Math.max(defense - sharpReduction - penetration, 0);
    return originalDamage * (1 - protectionRate / 100) - reducedDefense;
}

export function listProtectionRate() {
    let p = 0;
    while (p < 354) {
        const protectionRate = calculateProtectionReductionRate(p);
        console.log(
            `Protection: ${p.toFixed(
                2
            )}, Protection Rate: ${protectionRate.toFixed(2)}`
        );

        p++;
    }
}

export const apply = (stat: number, effect: EffectDetailEntry) => {
    // issue:不確定遊戲中－％數的結果會不會進位，然而實際上在高保護可能也看不出來
    return effect.operation === "divide"
        ? Math.floor((stat * (100 - effect.value)) / 100)
        : stat - effect.value;
};
