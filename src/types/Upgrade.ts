export interface Gems {
    name: string; // 寶石名稱
    requiredSize: number; // size
}

export interface Required {
    ep: number; // 熟練度
    gold: number; // 金額
    gems?: Gems[]; // 宝石
}

export interface UpgradeAbility {
    id: string; // 升級能力ID
    value: number; // 升級能力值
}

export interface CraftsManUpgradeAbility {
    id: string; // 工匠升級能力ID
    min: number; // 最小值
    max: number; // 最大值
}

export interface UpgradeMethod {
    id: string;
    name: string;
    required: Required;
    abilities: UpgradeAbility[] | CraftsManUpgradeAbility[]; // 升級能力
    progress: number[]; // 可在哪階段使用此改造，1,2,3,4,5,6(寶石改)
}

export interface UpgradeMethodsForWeapons {
    weaponId: number;
    methods: UpgradeMethod[];
}
