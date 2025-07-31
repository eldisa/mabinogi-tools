import { Ability } from "../types/Upgrade";

export const abilityIdArray: Ability[] = [
    { id: "attack_min", name: "最小傷害" },
    { id: "attack_max", name: "最大傷害" },
    { id: "lance_piercing", name: "銳利等級" },
    { id: "balance", name: "平衡性" },
    { id: "critical", name: "暴擊率" },
    { id: "durability_max ", name: "耐久度" },
    { id: "HP", name: "生命值" },
    { id: "SP", name: "耐力值" },
];

export const abilitiesMap: Record<string, string> = {
    attack_min: "最小傷害",
    attack_max: "最大傷害",
    lance_piercing: "銳利等級",
    balance: "平衡性",
    critical: "暴擊率",
    durability_max: "耐久度",
    HP: "生命值",
    SP: "耐力值",
};
