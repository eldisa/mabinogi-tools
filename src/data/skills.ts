import { basicDamageCalculate } from "../utils/damageCalculate";
import { Skill, SkillBonus, DamageType } from "../types/index";

const skills: Skill[] = [
    {
        talentId: 1,
        name: "重擊",
        damageType: "melee",
        id: 20002,
        damage: 8,
        calculate: basicDamageCalculate,
    },
    {
        talentId: 1,
        name: "旋風擺連腿",
        damageType: "melee",
        id: 22001,
        damage: 8,
        calculate: basicDamageCalculate,
    },
    {
        talentId: 1,
        name: "躍擊",
        damageType: "melee",
        id: 20012,
        damage: 3.5,
        calculate: basicDamageCalculate,
    },
    {
        talentId: 2,
        name: "穿心箭",
        damageType: "ranged",
        id: 21002,
        damage: 5.9,
        calculate: basicDamageCalculate,
    },
    {
        talentId: 2,
        name: "爆裂箭",
        damageType: "ranged",
        id: 22011,
        damage: 3.7,
        calculate: basicDamageCalculate,
    },

    /*
  { name: '重擊', damageType: 'melee', id: 20002, damage: 800 },
  { name: '穿心箭', damageType: 'ranged', id: 21002, damage: 590 },
  { name: '躍擊', damageType: 'magic', id: 3, damage: 20 },
  */
];

export default skills;
