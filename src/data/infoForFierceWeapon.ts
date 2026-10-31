// 兇猛級武器（破碎）資料，來源 https://mabinogi.io/items/{id}
// status: min = 基礎值 + 生產隨機最小值, max = 基礎值 + 生產隨機最大值
export const infoForFierceWeapon = [
    {
        id: 1040006,
        name: {
            en: "Demolition Tactics Bow",
            tw: "破碎戰術之弓",
        },
        alias: "小弓",
        status: [
            {
                id: "attack_min",
                min: 17,
                max: 31,
            },
            {
                id: "attack_max",
                min: 30,
                max: 52,
            },
            {
                id: "critical",
                min: 18,
                max: 37,
            },
            {
                id: "balance",
                min: 25,
                max: 45,
            },
            {
                id: "durability_max",
                min: 15,
                max: 28,
            },
            {
                id: "attack_range",
                min: 2000,
                max: 2000,
            },
            {
                id: "lance_piercing",
                min: 1,
                max: 1,
            },
            {
                id: "crash_fragment_damage",
                min: 150,
                max: 150,
            },
            {
                id: "crash_fragment_range",
                min: 150,
                max: 150,
            },
            {
                id: "magnum_shot_damage_add",
                min: 50,
                max: 50,
            },
        ],
    },
    {
        id: 1230007,
        name: {
            en: "Demolition Luminous Staff",
            tw: "破碎夜光集魔杖",
        },
        alias: "小杖",
        status: [
            {
                id: "attack_min",
                min: 20,
                max: 20,
            },
            {
                id: "attack_max",
                min: 45,
                max: 45,
            },
            {
                id: "critical",
                min: 20,
                max: 40,
            },
            {
                id: "balance",
                min: 35,
                max: 35,
            },
            {
                id: "durability_max",
                min: 21,
                max: 45,
            },
            {
                id: "lightning_road_cooldown",
                min: 2,
                max: 2,
            },
            {
                id: "meteor_strike_cooldown",
                min: 250,
                max: 250,
            },
            {
                id: "magic_damage",
                min: 5,
                max: 14,
            },
        ],
    },
];
