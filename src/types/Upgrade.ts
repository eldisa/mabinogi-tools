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

export type WeaponCategory =
    | "melee_physical"        // 物理近戰（劍/斧/槌/鎖鍊/拳套/手把/騎槍/手裡劍）
    | "ranged_physical"       // 物理遠程（弓/弩/雙槍）
    | "magic_staff"           // 魔法長杖（長杖/鐮刀）
    | "magic_wand"            // 魔法短杖
    | "cylinder"              // 鋼瓶
    | "shield_cylinder"       // 盾牌鋼瓶
    | "healing_wand"          // 治癒杖
    | "shield"                // 盾牌
    | "combat_shield"         // 戰士盾牌
    | "instrument";           // 樂器

export interface UpgradeMethodsForWeapons {
    weaponId: number;
    methods: UpgradeMethod[];
    weaponCategory?: WeaponCategory; // 武器類型分類
}
