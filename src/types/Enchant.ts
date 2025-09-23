export interface EnchantAbility {
    id: string; // 能力ID
    min: number; // 最小值
    max: number; // 最大值
}

export interface Enchant {
    id: number;
    type: "prefix" | "suffix";
    level: number;
    list: string;
    desc: string;
    name: {
        tw: string;
        tw2?: string;
        kr?: string;
        en: string;
    };
    limit: string[];
    effect: EnchantAbility[];
    personalize: boolean;
    source?: string; // 來源
}

export interface EnchantSource {
    raidName: string;
    list: number[];
}
