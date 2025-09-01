export interface EnchantAbility {
    id: string; // 能力ID
    min: number; // 最小值
    max: number; // 最大值
}

export interface Enchant {
    name: {
        tw: string;
        kr: string;
        en: string;
    };
    position: string;
    type: "prefix" | "suffix";
    effect: EnchantAbility[];
    source?: string; // 來源
}
