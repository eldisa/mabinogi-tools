type FarmModel = {
    id: string;
    name: {
        tw: string;
        en: string;
        kr?: string;
    };
    category: "normal" | "extra";
    abilities: { id: string; value: number }[];
    desc?: string;
};

export type { FarmModel };
