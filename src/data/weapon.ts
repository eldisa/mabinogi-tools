import { SkillBonus } from "../types";
import { Weapon } from "../types/index";

const weapons: Weapon[] = [
    {
        name: "神聖雙手",
        maxAtk: 132,
        id: 1,
        damageType: "melee",
        type: "melee",
        piercingLevel: 1,
        skillBonus: [{ skillId: 20002, bonus: 0.15 }],
    },
    {
        name: "貓雙",
        maxAtk: 177,
        id: 2,
        damageType: "melee",
        type: "melee",
        piercingLevel: 4,
        skillBonus: [{ skillId: 22001, bonus: 0.15 }],
    },
    {
        name: "靈魂雙手(大76穿刺2)",
        maxAtk: 173 + 76,
        id: 3,
        damageType: "melee",
        type: "melee",
        piercingLevel: 3 + 2,
        skillBonus: [
            { skillId: 20012, bonus: 0.1 },
            { skillId: 20002, bonus: 0.2 },
        ],
    },
    {
        name: "靈魂雙手(大176穿刺0)",
        maxAtk: 173 + 176,
        id: 4,
        damageType: "melee",
        type: "melee",
        piercingLevel: 3,
        skillBonus: [
            { skillId: 20012, bonus: 0.1 },
            { skillId: 20002, bonus: 0.2 },
        ],
    },
    {
        name: "穹之奏鳴曲",
        maxAtk: 345,
        id: 5,
        damageType: "melee",
        type: "melee",
        piercingLevel: 3,
        skillBonus: [{ skillId: 22001, bonus: 0.3 }],
    },
];

export default weapons;
