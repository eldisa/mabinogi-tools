type CraftType = "Smithing" | "Alchemy" | "Cooking" | "Enchanting" | "MagicCraft";
// todo:　打鐵 裁縫 魔法製造 稀原工學

type Materials = {
    name: string; // Name of the material
    quantity: number; // Quantity required for crafting
};

type CraftBouns = {
    attribute: string;
    min: number;
    max: number;
};

interface Equipment {
    id: number;
    name: string;
    position: string;
    madeBy: string;
    minAtk: number;
    maxAtk: number;
    defense: number; // Defense value of the equipment
    protect: number;
    craftBonus: CraftBouns[];
}

interface CraftingEquipment extends Equipment {
    craftingType: CraftType; // e.g., "Smithing", "Alchemy"
    craftingMaterials: Materials[]; // Materials required for crafting
    processingCompletionRate: number; // Completion increase per processing step
}

export type { CraftType, Materials, Equipment, CraftingEquipment };
