export interface Monster {
    id: string;
    name: string;
    defense: number;
    resistance: number;
}

export type DamageType = "melee" | "ranged" | "magic";

export type Skill = {
    talentId: number;
    name: string;
    damageType: DamageType;
    id: number;
    damage: number;
    calculate?: (parameter1: number, parameter2: number) => number;
    selected?: boolean; // 新增 selected 屬性
};

export type SkillBonus = {
    skillId: number;
    bonus: number;
};

export interface Weapon {
    name: string;
    maxAtk: number;
    id: number;
    damageType: "melee" | "ranged" | "magic";
    type: "melee";
    piercingLevel: number;
    skillBonus: SkillBonus[];
}

export type Talent = {
    name: string;
    id: number;
};

export interface CompareEntry {
    name: string;
    damage: number;
    pLevel: number;
}

export type AttackType = "physical" | "magical";

export type OperationType = "add" | "subtract" | "multiply" | "divide";

export interface EffectDetailEntry {
    operation: OperationType; // 進行加減乘除
    value: number; // 數值
    editable: boolean; // 是否允許在 UI 上手動編輯
}

export interface Debuff {
    active: boolean;
    name: string; // debuff 名稱（ex: 精準打擊）
    description: string; // debuff 描述
    physicalDefense: EffectDetailEntry; // 物理防禦變動
    physicalProtect: EffectDetailEntry; // 物理保護變動
    magicalDefense: EffectDetailEntry; // 魔法防禦變動
    magicalProtect: EffectDetailEntry; // 魔法保護變動
}

export interface MonsterEntry {
    id: string;
    name: string;
    physicalDefense: number; // 物理防禦
    physicalProtect: number; // 物理保護
    magicalDefense: number; // 魔法防禦
    magicalProtect: number; // 魔法保護
    isCustom: boolean; // 這一列是否自訂怪物
}

// 標準 select option 類型
export interface Option {
    value: number | string; // 值
    label: string; // 顯示名稱
}
