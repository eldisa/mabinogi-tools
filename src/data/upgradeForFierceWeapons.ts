import { UpgradeMethodsForWeapons } from "../types/Upgrade";

// 工匠改造隨機能力來源：prilus 台服資料
export const upgradeForFierceWeapons: UpgradeMethodsForWeapons[] = [
    {
        weaponId: 1040006,
        methods: [
            {
                id: "1040006-1",
                name: "弓線強化1",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 15,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: -1,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1040006-2",
                name: "弓線強化2",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 20,
                    gold: 12000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1040006-3",
                name: "弓線強化3",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 35,
                    gold: 18000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: -3,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1040006-4",
                name: "弓線強化4",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 45,
                    gold: 33000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1040006-5",
                name: "弓線強化5",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 55,
                    gold: 48000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040006-6",
                name: "更換瞄準器",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 40,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                ],
                progress: [1, 2, 3],
            },
            {
                id: "1040006-7",
                name: "強化箭尖",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 30,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 6,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1040006-8",
                name: "潤油法",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 50,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 8,
                    },
                    {
                        id: "attack_max",
                        value: -8,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1040006-9",
                name: "破碎戰術之弓封印解除",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_range",
                        value: 100,
                    },
                    {
                        id: "attack_max",
                        value: 14,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040006-10",
                name: "破碎戰術之弓專用改造",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "aim_ratio_bonus",
                        value: 15,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040006-craftman",
                name: "工匠改造",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    { id: "DEX", min: 5, max: 30 },
                    { id: "LUK", min: 10, max: 70 },
                    { id: "HP", min: 3, max: 6 },
                    { id: "SP", min: 3, max: 6 },
                ],
                progress: [4],
            },
            {
                id: "1040006-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "格拉納特", "卡隆"],
                required: {
                    ep: 100,
                    gold: 25000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "石榴石",
                            requiredSize: 1,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1040006-g-2",
                name: "寶石改造",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 8,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 8,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 8,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 2,
                    },
                    {
                        id: "critical",
                        value: 3,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "ranged_physical",
    },
    {
        weaponId: 1230007,
        methods: [
            {
                id: "1230007-1",
                name: "自然力凝聚 1",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 25,
                    gold: 9000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 3,
                    },
                ],
                progress: [0, 1],
            },
            {
                id: "1230007-2",
                name: "自然力凝聚 2",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 30,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 4,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1230007-3",
                name: "自然力凝聚 3",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 35,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 6,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1230007-4",
                name: "自然力凝聚 4",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 50,
                    gold: 25000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 7,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                ],
                progress: [4],
            },
            {
                id: "1230007-5",
                name: "自然力共鳴",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 35,
                    gold: 10000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1230007-6",
                name: "破碎夜光集魔杖封印解除",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 12,
                    },
                    {
                        id: "manause_revised",
                        value: 30,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1230007-7",
                name: "破碎夜光集魔杖專用改造",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 100,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "elemental_damage",
                        value: 20,
                    },
                ],
                progress: [4],
            },
            {
                id: "1230007-craftman",
                name: "工匠改造",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "INT", min: 50, max: 150 },
                    { id: "MP", min: 40, max: 80 },
                    { id: "LUK", min: 15, max: 75 },
                ],
                progress: [4],
            },
            {
                id: "1230007-g-1",
                name: "寶石修復1",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 100,
                    gold: 28000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 1,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1230007-g-2",
                name: "寶石修復",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1230007-g-3",
                name: "寶石改造",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 8,
                        },
                        {
                            name: "托帕石",
                            requiredSize: 8,
                        },
                        {
                            name: "海藍寶石",
                            requiredSize: 8,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 3,
                    },
                    {
                        id: "balance",
                        value: 5,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "magic_staff",
    },
];
