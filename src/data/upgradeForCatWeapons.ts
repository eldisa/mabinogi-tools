import { UpgradeMethodsForWeapons } from "../types/Upgrade";

// 工匠改造的隨機能力 mabinogi.io 沒有提供，abilities 暫為空
export const upgradeForCatWeapons: UpgradeMethodsForWeapons[] = [
    {
        weaponId: 1000014,
        methods: [
            {
                id: "1000014-1",
                name: "修整劍身2",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 18,
                    gold: 3900,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                    {
                        id: "attack_min",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1000014-2",
                name: "修整劍身3",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 26,
                    gold: 6800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "balance",
                        value: -3,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1000014-3",
                name: "修整劍身4",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 33,
                    gold: 9700,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1000014-4",
                name: "修整劍身5",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 44,
                    gold: 13100,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                    {
                        id: "attack_min",
                        value: 3,
                    },
                ],
                progress: [4],
            },
            {
                id: "1000014-5",
                name: "磨利刀刃",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 23,
                    gold: 2800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1000014-6",
                name: "暗夜使者突襲專用改造",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 50,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1000014-craftman",
                name: "工匠改造",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "STR", min: 5, max: 35 },
                    { id: "WIL", min: 7, max: 20 },
                    { id: "HP", min: 3, max: 20 },
                    { id: "STR2", min: 1, max: 14 },
                ],
                progress: [4],
            },
            {
                id: "1000014-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "艾頓", "安德拉絲", "格拉納特", "卡芬"],
                required: {
                    ep: 100,
                    gold: 23000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "托帕石",
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
                id: "1000014-g-2",
                name: "寶石改造",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "金綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "青綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "紅金綠柱石",
                            requiredSize: 5,
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
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1010055,
        methods: [
            {
                id: "1010055-1",
                name: "調整重量 1",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 2,
                    gold: 500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 1,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1010055-2",
                name: "調整重量 2",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 4,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1010055-3",
                name: "調整重量 3",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 6,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 3,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1010055-4",
                name: "調整重量 4",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 8,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 4,
                    },
                ],
                progress: [0, 1],
            },
            {
                id: "1010055-5",
                name: "淬火 1",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 5,
                    gold: 2500,
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
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1010055-6",
                name: "淬火 2",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 15,
                    gold: 4500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1010055-7",
                name: "淬火 3",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 25,
                    gold: 6500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1010055-8",
                name: "淬火 4",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 35,
                    gold: 8500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "balance",
                        value: -8,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1010055-9",
                name: "淬火 5",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 45,
                    gold: 10500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "balance",
                        value: -10,
                    },
                ],
                progress: [4],
            },
            {
                id: "1010055-10",
                name: "輕量化",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 10,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 2,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1010055-11",
                name: "修磨稜角",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 10,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1010055-12",
                name: "更換手把",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 30,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: -5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1010055-13",
                name: "庫魯格鐵錘強化",
                npc: ["庫魯格"],
                required: {
                    ep: 60,
                    gold: 18400,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: -5,
                    },
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1010055-14",
                name: "陶恩斯式鐵錘改造",
                npc: ["陶恩斯"],
                required: {
                    ep: 50,
                    gold: 13300,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                    {
                        id: "attack_min",
                        value: -5,
                    },
                    {
                        id: "balance",
                        value: -10,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1010055-15",
                name: "陶恩斯式鐵錘強化",
                npc: ["陶恩斯"],
                required: {
                    ep: 88,
                    gold: 28500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: 20,
                    },
                    {
                        id: "durability_max",
                        value: -5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1010055-craftman",
                name: "工匠改造",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    { id: "STR", min: 5, max: 30 },
                    { id: "LUK", min: 5, max: 30 },
                    { id: "HP", min: 3, max: 6 },
                    { id: "SP", min: 3, max: 6 },
                ],
                progress: [4],
            },
            {
                id: "1010055-16",
                name: "專用改造",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 7,
                    },
                    {
                        id: "attack_max",
                        value: 35,
                    },
                    {
                        id: "wound_max",
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                    {
                        id: "balance",
                        value: 30,
                    },
                ],
                progress: [0],
            },
            {
                id: "1010055-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "庫魯格", "卡芬"],
                required: {
                    ep: 100,
                    gold: 19000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "綠寶石",
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
                id: "1010055-g-2",
                name: "鐵錘寶石改造1",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 2000,
                    gems: [
                        {
                            name: "星彩藍寶石",
                            requiredSize: 4,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 2,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 1,
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
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1020011,
        methods: [
            {
                id: "1020011-1",
                name: "調整重量",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 15,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 3,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1020011-2",
                name: "淬火 1",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 12,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "balance",
                        value: -3,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1020011-3",
                name: "淬火 2",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 18,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1020011-4",
                name: "淬火 3",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 24,
                    gold: 5000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1020011-5",
                name: "淬火 4",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 32,
                    gold: 10000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "balance",
                        value: -7,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1020011-6",
                name: "淬火 5",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 40,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 9,
                    },
                    {
                        id: "balance",
                        value: -9,
                    },
                ],
                progress: [4],
            },
            {
                id: "1020011-7",
                name: "輕量化1",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 14,
                    gold: 500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 2,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1020011-8",
                name: "輕量化 2",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 16,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 3,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1020011-9",
                name: "輕量化 3",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 18,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 4,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1020011-10",
                name: "輕量化 4",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 20,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 6,
                    },
                ],
                progress: [0, 1],
            },
            {
                id: "1020011-11",
                name: "磨利斧頭1",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 15,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 3,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1020011-12",
                name: "磨利斧頭2",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 20,
                    gold: 2500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1020011-13",
                name: "磨利斧頭3",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 30,
                    gold: 5000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 8,
                    },
                ],
                progress: [4],
            },
            {
                id: "1020011-14",
                name: "換手把",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 30,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: -5,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1020011-15",
                name: "艾頓式暗夜使者掠奪者強化",
                npc: ["艾頓"],
                required: {
                    ep: 80,
                    gold: 42000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: -5,
                    },
                    {
                        id: "attack_min",
                        value: 22,
                    },
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1020011-16",
                name: "崔弗式暗夜使者掠奪者改造",
                npc: ["崔弗"],
                required: {
                    ep: 50,
                    gold: 10000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: -5,
                    },
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1020011-17",
                name: "艾波里恩暗夜使者掠奪者特殊改造",
                npc: ["卡隆"],
                required: {
                    ep: 60,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: -9,
                    },
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "critical",
                        value: 12,
                    },
                ],
                progress: [4],
            },
            {
                id: "1020011-18",
                name: "暗夜使者掠奪者專用改造",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 22,
                    },
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "balance",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1020011-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "艾頓", "卡芬"],
                required: {
                    ep: 100,
                    gold: 21000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "托帕石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
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
                id: "1020011-g-2",
                name: "暗夜使者掠奪者寶石改造",
                npc: ["艾頓", "佛格斯", "崔弗"],
                required: {
                    ep: 100,
                    gold: 18000,
                    gems: [
                        {
                            name: "碧玉",
                            requiredSize: 4,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 2,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1040007,
        methods: [
            {
                id: "1040007-1",
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
                id: "1040007-2",
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
                id: "1040007-3",
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
                id: "1040007-4",
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
                id: "1040007-5",
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
                id: "1040007-6",
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
                id: "1040007-7",
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
                id: "1040007-8",
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
                id: "1040007-9",
                name: "終焉毀滅之弓封印解除",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_range",
                        value: 200,
                    },
                    {
                        id: "attack_max",
                        value: 17,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040007-10",
                name: "終焉毀滅之弓專用改造",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "aim_ratio_bonus",
                        value: 30,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040007-craftman",
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
                id: "1040007-g-1",
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
                id: "1040007-g-2",
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
        weaponId: 1040010,
        methods: [
            {
                id: "1040010-1",
                name: "強化弓弦3",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 25,
                    gold: 3600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "balance",
                        value: -3,
                    },
                ],
                progress: [2],
            },
            {
                id: "1040010-2",
                name: "強化弓弦4",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 37,
                    gold: 6600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [3],
            },
            {
                id: "1040010-3",
                name: "強化弓弦5",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 55,
                    gold: 13600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040010-4",
                name: "更換瞄準器",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 20,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                ],
                progress: [1],
            },
            {
                id: "1040010-5",
                name: "強化弓尖",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 20,
                    gold: 2500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1040010-6",
                name: "暗夜使者捕食者封印解除",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 4,
                    },
                    {
                        id: "attack_max",
                        value: 27,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040010-craftman",
                name: "工匠改造",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 50000,
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
                id: "1040010-g-1",
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
                id: "1040010-g-2",
                name: "暗夜使者捕食者寶石改造",
                npc: ["艾頓", "奈麗絲", "卡絲妮亞", "梅麗絲"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "翡翠",
                            requiredSize: 5,
                        },
                        {
                            name: "紫黃晶",
                            requiredSize: 5,
                        },
                        {
                            name: "蓮花剛玉",
                            requiredSize: 5,
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
        weaponId: 1040013,
        methods: [
            {
                id: "1040013-1",
                name: "強化弓柄1",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 10,
                    gold: 600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 1,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1040013-2",
                name: "強化弓柄2",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 12,
                    gold: 1200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1040013-3",
                name: "強化弓柄3",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 14,
                    gold: 1800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 3,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1040013-4",
                name: "強化弓柄4",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 17,
                    gold: 2400,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 4,
                    },
                ],
                progress: [0, 1],
            },
            {
                id: "1040013-5",
                name: "弓弦強化1",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 15,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1040013-6",
                name: "弓弦強化2",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 16,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1040013-7",
                name: "弓弦強化3",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 17,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 3,
                    },
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1040013-8",
                name: "弓弦強化4",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 18,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 4,
                    },
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -8,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1040013-9",
                name: "弓弦強化5",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 20,
                    gold: 5000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -10,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040013-10",
                name: "更換扣板機",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 15,
                    gold: 500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 2,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1040013-11",
                name: "更換接頭",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 15,
                    gold: 500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1040013-12",
                name: "強化弓身",
                npc: ["奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "尼克"],
                required: {
                    ep: 30,
                    gold: 8000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 6,
                    },
                    {
                        id: "attack_max",
                        value: -6,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040013-13",
                name: "強化奈麗絲式弩",
                npc: ["奈麗絲"],
                required: {
                    ep: 70,
                    gold: 14000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "wound_max",
                        value: -10,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: -5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040013-14",
                name: "改造阿蘭雯式弩",
                npc: ["阿蘭雯"],
                required: {
                    ep: 50,
                    gold: 12100,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_range",
                        value: -300,
                    },
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -10,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1040013-15",
                name: "強化尼克式弩",
                npc: ["尼克"],
                required: {
                    ep: 60,
                    gold: 11200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_range",
                        value: 200,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                    {
                        id: "critical",
                        value: -5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040013-16",
                name: "改造尼克式弩",
                npc: ["尼克"],
                required: {
                    ep: 50,
                    gold: 9400,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_range",
                        value: -100,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1040013-craftman",
                name: "工匠改造",
                npc: ["艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    { id: "HP", min: 2, max: 5 },
                    { id: "SP", min: 2, max: 5 },
                    { id: "LUK", min: 10, max: 70 },
                ],
                progress: [4],
            },
            {
                id: "1040013-17",
                name: "暗夜使者惡徒專用改造",
                npc: ["佛格斯"],
                required: {
                    ep: 100,
                    gold: 35000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: 5,
                    },
                ],
                progress: [3],
            },
            {
                id: "1040013-18",
                name: "暗夜使者惡徒專用收尾",
                npc: ["佛格斯"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 2,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040013-g-1",
                name: "弩寶石改造1",
                npc: ["艾頓", "阿蘭雯"],
                required: {
                    ep: 100,
                    gold: 2300,
                    gems: [
                        {
                            name: "碧玉",
                            requiredSize: 4,
                        },
                        {
                            name: "海藍寶石",
                            requiredSize: 2,
                        },
                        {
                            name: "石榴石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 3,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "ranged_physical",
    },
    {
        weaponId: 1050002,
        methods: [
            {
                id: "1050002-1",
                name: "3屬性自然力增強 1",
                npc: ["拜斯"],
                required: {
                    ep: 15,
                    gold: 8000,
                    gems: [],
                },
                abilities: [],
                progress: [3],
            },
            {
                id: "1050002-2",
                name: "3屬性自然力增強 2",
                npc: ["拜斯"],
                required: {
                    ep: 30,
                    gold: 12000,
                    gems: [],
                },
                abilities: [],
                progress: [3],
            },
            {
                id: "1050002-3",
                name: "3屬性自然力增強 3",
                npc: ["拜斯"],
                required: {
                    ep: 50,
                    gold: 25000,
                    gems: [],
                },
                abilities: [],
                progress: [3],
            },
            {
                id: "1050002-4",
                name: "3屬性自然力增強 4",
                npc: ["拜斯"],
                required: {
                    ep: 90,
                    gold: 50000,
                    gems: [],
                },
                abilities: [],
                progress: [3],
            },
            {
                id: "1050002-5",
                name: "自然力共鳴",
                npc: ["拜斯"],
                required: {
                    ep: 25,
                    gold: 8000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: 8,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1050002-6",
                name: "自然力加速 1",
                npc: ["拜斯"],
                required: {
                    ep: 30,
                    gold: 9500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "casting_speed",
                        value: 3,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1050002-7",
                name: "自然力加速 2",
                npc: ["拜斯"],
                required: {
                    ep: 40,
                    gold: 14300,
                    gems: [],
                },
                abilities: [
                    {
                        id: "casting_speed",
                        value: 4,
                    },
                ],
                progress: [2, 3],
            },
            {
                id: "1050002-8",
                name: "自然力加速 3",
                npc: ["拜斯"],
                required: {
                    ep: 50,
                    gold: 18700,
                    gems: [],
                },
                abilities: [
                    {
                        id: "casting_speed",
                        value: 5,
                    },
                ],
                progress: [3],
            },
            {
                id: "1050002-9",
                name: "自然力凝聚 1",
                npc: ["拜斯"],
                required: {
                    ep: 15,
                    gold: 8100,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 2,
                    },
                ],
                progress: [0, 1],
            },
            {
                id: "1050002-10",
                name: "自然力凝聚 2",
                npc: ["拜斯"],
                required: {
                    ep: 25,
                    gold: 11500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 3,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1050002-11",
                name: "自然力凝聚 3",
                npc: ["拜斯"],
                required: {
                    ep: 30,
                    gold: 14700,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 5,
                    },
                    {
                        id: "casting_speed",
                        value: -4,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1050002-12",
                name: "自然力凝聚 4",
                npc: ["拜斯"],
                required: {
                    ep: 40,
                    gold: 18200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 5,
                    },
                ],
                progress: [4],
            },
            {
                id: "1050002-13",
                name: "輕量化",
                npc: ["拜斯"],
                required: {
                    ep: 28,
                    gold: 8600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1050002-craftman",
                name: "工匠改造",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    { id: "INT", min: 10, max: 100 },
                    { id: "MP", min: 10, max: 50 },
                    { id: "LUK", min: 1, max: 20 },
                ],
                progress: [4],
            },
            {
                id: "1050002-14",
                name: "暗夜使者元素師封印解除",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 18,
                    },
                    {
                        id: "durability_max",
                        value: 7,
                    },
                ],
                progress: [0],
            },
            {
                id: "1050002-g-1",
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
                id: "1050002-g-2",
                name: "魔杖寶石改造1",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 100,
                    gold: 8800,
                    gems: [
                        {
                            name: "海藍寶石",
                            requiredSize: 4,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 2,
                        },
                        {
                            name: "石榴石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 4,
                    },
                ],
                progress: [5],
            },
            {
                id: "1050002-g-3",
                name: "寶石修復 1",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 15000,
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
                            name: "海藍寶石",
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
                id: "1050002-g-4",
                name: "三矛魔杖寶石改造 1",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "海藍寶石",
                            requiredSize: 3,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 3,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 3,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 4,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "magic_wand",
    },
    {
        weaponId: 1060004,
        methods: [
            {
                id: "1060004-1",
                name: "更換扳機",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 20,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1060004-2",
                name: "{0}的輕量化1",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 5,
                    gold: 500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 5,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1060004-3",
                name: "{0}的輕量化2",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 8,
                    gold: 800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 6,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1060004-4",
                name: "{0}的輕量化3",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 12,
                    gold: 1200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 7,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1060004-5",
                name: "{0}的輕量化4",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 20,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 8,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1060004-6",
                name: "{0}的輕量化5",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 30,
                    gold: 7000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 12,
                    },
                ],
                progress: [4],
            },
            {
                id: "1060004-7",
                name: "啟動四大屬性 2",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 8,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        value: 2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1060004-8",
                name: "啟動四大屬性 3",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 12,
                    gold: 3200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        value: 3,
                    },
                ],
                progress: [2],
            },
            {
                id: "1060004-9",
                name: "啟動四大屬性4",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 20,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        value: 5,
                    },
                ],
                progress: [3],
            },
            {
                id: "1060004-10",
                name: "啟動四大屬性 5",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 30,
                    gold: 7000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        value: 7,
                    },
                ],
                progress: [4],
            },
            {
                id: "1060004-11",
                name: "暗夜使者技術者專用改造",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 95,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        value: 20,
                    },
                    {
                        id: "critical",
                        value: 15,
                    },
                    {
                        id: "HP",
                        value: 60,
                    },
                    {
                        id: "MP",
                        value: 60,
                    },
                    {
                        id: "SP",
                        value: 60,
                    },
                ],
                progress: [0],
            },
            {
                id: "1060004-craftman",
                name: "暗夜使者技術者工匠改造",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "fire_alchemy_damage", min: 25, max: 25 },
                    { id: "water_alchemy_damage", min: 25, max: 25 },
                    { id: "earth_alchemy_damage", min: 25, max: 25 },
                    { id: "wind_alchemy_damage", min: 25, max: 25 },
                    { id: "MP", min: 40, max: 70 },
                    { id: "HP", min: 30, max: 50 },
                    { id: "SP", min: 30, max: 50 },
                ],
                progress: [4],
            },
            {
                id: "1060004-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "艾頓", "安德拉絲", "格拉納特", "卡芬"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "托帕石",
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
        ],
        weaponCategory: "cylinder",
    },
    {
        weaponId: 1070002,
        methods: [
            {
                id: "1070002-1",
                name: "調整袋子1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 12,
                    gold: 2200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 2,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1070002-2",
                name: "調整袋子2",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 17,
                    gold: 3800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: 3,
                    },
                ],
                progress: [2],
            },
            {
                id: "1070002-3",
                name: "調整袋子3",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 22,
                    gold: 4300,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: 4,
                    },
                ],
                progress: [3],
            },
            {
                id: "1070002-4",
                name: "核心零件強化1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 18,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 2,
                    },
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1070002-5",
                name: "核心零件強化2",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 23,
                    gold: 2800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 3,
                    },
                    {
                        id: "balance",
                        value: 3,
                    },
                ],
                progress: [2],
            },
            {
                id: "1070002-6",
                name: "核心零件強化3",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 28,
                    gold: 5200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: 4,
                    },
                ],
                progress: [3],
            },
            {
                id: "1070002-7",
                name: "增加金屬板重量1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 15,
                    gold: 2500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "critical",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1070002-8",
                name: "增加金屬板重量2",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 20,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 2,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "critical",
                        value: 2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1070002-9",
                name: "增加金屬板重量3",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 25,
                    gold: 7000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "critical",
                        value: 3,
                    },
                ],
                progress: [3],
            },
            {
                id: "1070002-10",
                name: "暗夜使者詐欺師調整",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 40,
                    gold: 2800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "marionette_attack_max",
                        value: 80,
                    },
                    {
                        id: "marionette_critical",
                        value: 20,
                    },
                    {
                        id: "marionette_hp",
                        value: 2500,
                    },
                ],
                progress: [0],
            },
            {
                id: "1070002-11",
                name: "符合暗夜使者詐欺師改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 57,
                    },
                    {
                        id: "marionette_protect",
                        value: 25,
                    },
                    {
                        id: "marionette_magic_protect",
                        value: 25,
                    },
                ],
                progress: [4],
            },
            {
                id: "1070002-craftman",
                name: "工匠改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "marionette_attack_min", min: 10, max: 30 },
                    { id: "marionette_attack_max", min: 20, max: 40 },
                    { id: "marionette_critical", min: 5, max: 10 },
                ],
                progress: [4],
            },
            {
                id: "1070002-g-1",
                name: "修理手把寶石",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特", "陶恩斯", "修斯"],
                required: {
                    ep: 100,
                    gold: 12000,
                    gems: [
                        {
                            name: "尖晶石",
                            requiredSize: 1,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "海藍寶石",
                            requiredSize: 2,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 3,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1090004,
        methods: [
            {
                id: "1090004-1",
                name: "修磨刀刃",
                npc: ["迪莉妮"],
                required: {
                    ep: 25,
                    gold: 25600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1090004-2",
                name: "魔力賦予",
                npc: ["迪莉妮"],
                required: {
                    ep: 35,
                    gold: 36300,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 1,
                    },
                ],
                progress: [2],
            },
            {
                id: "1090004-3",
                name: "修磨把手",
                npc: ["迪莉妮"],
                required: {
                    ep: 40,
                    gold: 42200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 2,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [3],
            },
            {
                id: "1090004-4",
                name: "平衡錘輕量化",
                npc: ["迪莉妮"],
                required: {
                    ep: 50,
                    gold: 50900,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 3,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [4],
            },
            {
                id: "1090004-5",
                name: "暗夜使者觀測者鐮刀專用改造",
                npc: ["迪莉妮"],
                required: {
                    ep: 50,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 5,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1090004-craftman",
                name: "工匠改造",
                npc: ["迪莉妮"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "LUK", min: 30, max: 80 },
                    { id: "HP", min: 10, max: 50 },
                ],
                progress: [4],
            },
            {
                id: "1090004-g-1",
                name: "寶石修理",
                npc: ["迪莉妮"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "海藍寶石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 5,
                    },
                ],
                progress: [5],
            },
            {
                id: "1090004-g-2",
                name: "寶石改造",
                npc: ["迪莉妮"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "電氣石",
                            requiredSize: 5,
                        },
                        {
                            name: "金綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "蓮花剛玉",
                            requiredSize: 5,
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
    {
        weaponId: 1200007,
        methods: [
            {
                id: "1200007-1",
                name: "淬火 2",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 25,
                    gold: 25000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                ],
                progress: [1],
            },
            {
                id: "1200007-2",
                name: "淬火3",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 30,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                ],
                progress: [2],
            },
            {
                id: "1200007-3",
                name: "淬火 4",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 35,
                    gold: 35000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                ],
                progress: [3],
            },
            {
                id: "1200007-4",
                name: "暗夜使者指揮官專用改造",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "lance_piercing",
                        value: 2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1200007-craftman",
                name: "工匠改造",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "STR", min: 15, max: 35 },
                    { id: "DEX", min: 5, max: 34 },
                    { id: "HP", min: 3, max: 20 },
                    { id: "SP", min: 2, max: 15 },
                ],
                progress: [4],
            },
            {
                id: "1200007-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "阿蘭雯", "安德拉絲", "格拉納特", "卡芬"],
                required: {
                    ep: 100,
                    gold: 26000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "碧玉",
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
                        id: "durability_max",
                        value: 4,
                    },
                ],
                progress: [5],
            },
            {
                id: "1200007-g-2",
                name: "寶石改造",
                npc: ["雷納德", "奈麗絲", "卡絲妮亞", "梅麗絲", "佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "金綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "青綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "紅金綠柱石",
                            requiredSize: 5,
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
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1220000,
        methods: [
            {
                id: "1220000-1",
                name: "淬火 2",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 18,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "critical",
                        value: -2,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1220000-2",
                name: "淬火3",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 27,
                    gold: 5600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: -3,
                    },
                    {
                        id: "balance",
                        value: -3,
                    },
                ],
                progress: [2],
            },
            {
                id: "1220000-3",
                name: "淬火 4",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 36,
                    gold: 9500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "critical",
                        value: -4,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [3],
            },
            {
                id: "1220000-4",
                name: "暗夜使者狂戰士專用淬火",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 80,
                    gold: 47000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 9,
                    },
                    {
                        id: "critical",
                        value: -5,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                    {
                        id: "splash_damage",
                        value: 10,
                    },
                    {
                        id: "splash_radius",
                        value: 60,
                    },
                ],
                progress: [4],
            },
            {
                id: "1220000-craftman",
                name: "工匠改造",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    { id: "HP", min: 2, max: 5 },
                    { id: "SP", min: 2, max: 5 },
                    { id: "STR", min: 1, max: 32 },
                    { id: "LUK", min: 5, max: 35 },
                ],
                progress: [4],
            },
            {
                id: "1220000-5",
                name: "暗夜使者狂戰士專用改造",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 200000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 35,
                    },
                    {
                        id: "critical",
                        value: 25,
                    },
                    {
                        id: "balance",
                        value: 25,
                    },
                ],
                progress: [0],
            },
            {
                id: "1220000-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆", "艾頓", "卡芬"],
                required: {
                    ep: 100,
                    gold: 21000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "托帕石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
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
                id: "1220000-g-2",
                name: "暗夜使者狂戰士寶石改造",
                npc: ["陶恩斯", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [
                        {
                            name: "青綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "黑煤玉",
                            requiredSize: 5,
                        },
                        {
                            name: "紫黃晶",
                            requiredSize: 5,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "balance",
                        value: 5,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1230008,
        methods: [
            {
                id: "1230008-1",
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
                id: "1230008-2",
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
                id: "1230008-3",
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
                id: "1230008-4",
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
                id: "1230008-5",
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
                id: "1230008-6",
                name: "終焉超載集魔杖封印解除",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 15,
                    },
                    {
                        id: "manause_revised",
                        value: 40,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1230008-7",
                name: "終焉超載集魔杖專用改造",
                npc: ["麗莎", "史帝華", "希布林", "拜斯"],
                required: {
                    ep: 100,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "elemental_damage",
                        value: 35,
                    },
                ],
                progress: [4],
            },
            {
                id: "1230008-craftman",
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
                id: "1230008-g-1",
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
                id: "1230008-g-2",
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
                id: "1230008-g-3",
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
    {
        weaponId: 1230010,
        methods: [
            {
                id: "1230010-1",
                name: "自然力凝聚 1",
                npc: ["拜斯"],
                required: {
                    ep: 25,
                    gold: 9000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1230010-2",
                name: "自然力凝聚 2",
                npc: ["拜斯"],
                required: {
                    ep: 30,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 3,
                    },
                ],
                progress: [2],
            },
            {
                id: "1230010-3",
                name: "自然力凝聚 3",
                npc: ["拜斯"],
                required: {
                    ep: 35,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 5,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1230010-4",
                name: "自然力凝聚 4",
                npc: ["拜斯"],
                required: {
                    ep: 50,
                    gold: 25000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 6,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                ],
                progress: [4],
            },
            {
                id: "1230010-5",
                name: "暗夜使者審問者專用改造",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 16,
                    },
                ],
                progress: [0],
            },
            {
                id: "1230010-craftman",
                name: "工匠改造",
                npc: ["拜斯"],
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
                id: "1230010-g-1",
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
                id: "1230010-g-2",
                name: "寶石修復",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [
                        {
                            name: "電氣石",
                            requiredSize: 1,
                        },
                        {
                            name: "幽靈水晶",
                            requiredSize: 1,
                        },
                        {
                            name: "丹泉石",
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
                id: "1230010-g-3",
                name: "寶石改造",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "電氣石",
                            requiredSize: 5,
                        },
                        {
                            name: "紅金綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "雞血石",
                            requiredSize: 5,
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
    {
        weaponId: 1250005,
        methods: [
            {
                id: "1250005-1",
                name: "淬火1",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 16,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1250005-2",
                name: "淬火2",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 22,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1250005-3",
                name: "淬火 3",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 28,
                    gold: 8000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 8,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1250005-4",
                name: "暗夜使者先鋒專用改造",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: -5,
                    },
                    {
                        id: "attack_max",
                        value: 25,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                    {
                        id: "lance_piercing",
                        value: 4,
                    },
                ],
                progress: [3],
            },
            {
                id: "1250005-craftman",
                name: "工匠改造",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 100,
                    gold: 45000,
                    gems: [],
                },
                abilities: [
                    { id: "STR", min: 5, max: 70 },
                    { id: "LUK", min: 1, max: 20 },
                    { id: "HP", min: 3, max: 20 },
                    { id: "SP", min: 2, max: 15 },
                ],
                progress: [4],
            },
            {
                id: "1250005-g-1",
                name: "寶石改造",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [
                        {
                            name: "雞血石",
                            requiredSize: 5,
                        },
                        {
                            name: "金綠柱石",
                            requiredSize: 5,
                        },
                        {
                            name: "翡翠",
                            requiredSize: 5,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "critical",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1250005-g-2",
                name: "寶石修復",
                npc: ["陶恩斯", "艾頓", "奈麗絲"],
                required: {
                    ep: 100,
                    gold: 10000,
                    gems: [
                        {
                            name: "雞血石",
                            requiredSize: 1,
                        },
                        {
                            name: "青綠柱石",
                            requiredSize: 1,
                        },
                        {
                            name: "電氣石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 3,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1260003,
        methods: [
            {
                id: "1260003-1",
                name: "鐵釘研磨",
                npc: ["普力斯", "卡隆", "艾頓", "艾琳", "佛格斯", "康娜", "梅麗絲", "奈麗絲", "尼克", "歐絲拉", "瓦安特", "庫魯格"],
                required: {
                    ep: 30,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                ],
                progress: [1],
            },
            {
                id: "1260003-2",
                name: "鎖鏈研磨",
                npc: ["普力斯", "卡隆", "艾頓", "艾琳", "佛格斯", "康娜", "梅麗絲", "奈麗絲", "尼克", "歐絲拉", "瓦安特", "庫魯格"],
                required: {
                    ep: 40,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                ],
                progress: [2],
            },
            {
                id: "1260003-3",
                name: "輕量化",
                npc: ["普力斯", "卡隆", "艾頓", "艾琳", "佛格斯", "康娜", "梅麗絲", "奈麗絲", "尼克", "歐絲拉", "瓦安特", "庫魯格"],
                required: {
                    ep: 50,
                    gold: 9000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 8,
                    },
                ],
                progress: [3],
            },
            {
                id: "1260003-4",
                name: "暗夜使者流浪者解除封印",
                npc: ["普力斯", "卡隆", "艾頓", "艾琳", "佛格斯", "康娜", "梅麗絲", "奈麗絲", "尼克", "歐絲拉", "瓦安特", "庫魯格"],
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 10,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                    {
                        id: "knuckle_chain_damage",
                        value: 30,
                    },
                ],
                progress: [0],
            },
            {
                id: "1260003-5",
                name: "暗夜使者流浪者專用改造",
                npc: ["普力斯", "卡隆", "艾頓", "艾琳", "佛格斯", "康娜", "梅麗絲", "奈麗絲", "尼克", "歐絲拉", "瓦安特", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 55,
                    },
                    {
                        id: "knuckle_reset_cooldown_on_critical",
                        value: 50,
                    },
                ],
                progress: [4],
            },
            {
                id: "1260003-craftman",
                name: "工匠改造",
                npc: ["普力斯", "卡隆", "艾頓", "艾琳", "佛格斯", "康娜", "梅麗絲", "奈麗絲", "尼克", "歐絲拉", "瓦安特", "庫魯格"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "WIL", min: 50, max: 100 },
                    { id: "LUK", min: 25, max: 75 },
                    { id: "HP", min: 50, max: 100 },
                ],
                progress: [4],
            },
            {
                id: "1260003-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "庫魯格", "格拉納特", "卡隆"],
                required: {
                    ep: 100,
                    gold: 22000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "海藍寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "石榴石",
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
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1270006,
        methods: [
            {
                id: "1270006-1",
                name: "彈匣替換",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 60,
                    gold: 6500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "max_bullet",
                        value: 8,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1270006-2",
                name: "彈膛擴張",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 80,
                    gold: 8000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "critical",
                        value: 4,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1270006-3",
                name: "重量化 1",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 12,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1270006-4",
                name: "重量化 2",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 22,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 4,
                    },
                ],
                progress: [2, 3],
            },
            {
                id: "1270006-5",
                name: "重量化 3",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 35,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 6,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1270006-6",
                name: "新增鋼線 1",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 20,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1270006-7",
                name: "新增鋼線 2",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 35,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [2, 3],
            },
            {
                id: "1270006-8",
                name: "新增鋼線 3",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 50,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
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
                id: "1270006-9",
                name: "槍管擴張",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 80,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_range",
                        value: 100,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1270006-10",
                name: "瞄準鏡裝置",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 80,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 8,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1270006-craftman",
                name: "工匠改造",
                npc: ["Hector"],
                required: {
                    ep: 100,
                    gold: 40000,
                    gems: [],
                },
                abilities: [
                    { id: "attack_max", min: 4, max: 12 },
                    { id: "balance", min: 4, max: 12 },
                    { id: "LUK", min: 15, max: 75 },
                ],
                progress: [4],
            },
            {
                id: "1270006-11",
                name: "暗夜使者征服者專用改造",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 24,
                    },
                    {
                        id: "max_bullet",
                        value: 10,
                    },
                    {
                        id: "critical",
                        value: 4,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                ],
                progress: [0],
            },
            {
                id: "1270006-g-1",
                name: "寶石修理 1",
                npc: ["Hector", "見習工程師"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
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
                id: "1270006-g-2",
                name: "寶石改造 1",
                npc: ["Hector"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 3,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 3,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 3,
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
                        value: 2,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "ranged_physical",
    },
    {
        weaponId: 1280003,
        methods: [
            {
                id: "1280003-1",
                name: "磨刃 1",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 12,
                    gold: 1000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1280003-2",
                name: "磨刃 3",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 22,
                    gold: 2000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 4,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                ],
                progress: [2, 3],
            },
            {
                id: "1280003-3",
                name: "磨刃 2",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 50,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 5,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1280003-4",
                name: "磨刃 4",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 65,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 6,
                    },
                    {
                        id: "critical",
                        value: -2,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1280003-5",
                name: "丟掉刃 1",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 20,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: 1,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1280003-6",
                name: "丟掉刃 2",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 35,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [2, 3],
            },
            {
                id: "1280003-7",
                name: "丟掉刃 3",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 50,
                    gold: 6500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 3,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1280003-8",
                name: "削刃4",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 65,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                    {
                        id: "critical",
                        value: -2,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1280003-9",
                name: "削刃5",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 80,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1280003-10",
                name: "刀刃強化",
                npc: ["佛格斯", "艾頓", "奈麗絲", "親衛隊武器修理兵", "康娜", "卡隆"],
                required: {
                    ep: 80,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 8,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1280003-11",
                name: "暗夜使者潛入者專用改造",
                npc: ["佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 26,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                ],
                progress: [0],
            },
            {
                id: "1280003-craftman",
                name: "工匠改造",
                npc: ["佛格斯", "艾頓"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "balance", min: 5, max: 15 },
                    { id: "attack_min", min: 1, max: 3 },
                    { id: "attack_max", min: 18, max: 38 },
                ],
                progress: [4],
            },
            {
                id: "1280003-g-1",
                name: "手裏劍 寶石改造 1",
                npc: ["安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "格拉納特", "卡芬"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
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
                    {
                        id: "balance",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1280003-g-2",
                name: "手裏劍 寶石改造 2",
                npc: ["安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "格拉納特", "卡芬"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 3,
                        },
                        {
                            name: "尖晶石",
                            requiredSize: 3,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 3,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 2,
                    },
                    {
                        id: "critical",
                        value: 2,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1290008,
        methods: [
            {
                id: "1290008-1",
                name: "磨利刀尖",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 80,
                    gold: 8000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1290008-2",
                name: "鎖鏈強化 1",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 20,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [1],
            },
            {
                id: "1290008-3",
                name: "鎖鏈強化 2",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 35,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [2],
            },
            {
                id: "1290008-4",
                name: "鎖鏈強化 3",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 50,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 6,
                    },
                ],
                progress: [3],
            },
            {
                id: "1290008-5",
                name: "磨利刀刃 1",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 20,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 2,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1290008-6",
                name: "磨利刀刃 2",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 35,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 3,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1290008-7",
                name: "磨利刀刃 3",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
                required: {
                    ep: 50,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 4,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                ],
                progress: [3],
            },
            {
                id: "1290008-8",
                name: "艾頓式改造",
                npc: ["艾頓"],
                required: {
                    ep: 80,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 6,
                    },
                    {
                        id: "durability_max",
                        value: 4,
                    },
                ],
                progress: [4],
            },
            {
                id: "1290008-craftman",
                name: "工匠改造",
                npc: ["艾頓"],
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    { id: "attack_max", min: 1, max: 10 },
                    { id: "LUK", min: 1, max: 20 },
                    { id: "HP", min: 1, max: 20 },
                ],
                progress: [4],
            },
            {
                id: "1290008-9",
                name: "暗夜使者遊魂專用改造",
                npc: ["艾頓"],
                required: {
                    ep: 80,
                    gold: 25000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 35,
                    },
                    {
                        id: "balance",
                        value: 10,
                    },
                    {
                        id: "durability_max",
                        value: 4,
                    },
                ],
                progress: [0],
            },
            {
                id: "1290008-craftman-2",
                name: "暗夜使者遊魂專用工匠改造",
                npc: ["艾頓"],
                required: {
                    ep: 100,
                    gold: 40000,
                    gems: [],
                },
                abilities: [
                    { id: "attack_max", min: 5, max: 25 },
                    { id: "LUK", min: 5, max: 30 },
                    { id: "HP", min: 10, max: 50 },
                ],
                progress: [4],
            },
            {
                id: "1290008-g-1",
                name: "寶石修復",
                npc: ["佛格斯", "梅麗絲", "陶恩斯", "奈麗絲", "艾頓", "安德拉絲", "格拉納特", "卡芬", "卡隆", "康娜", "尼克"],
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
                        id: "durability_max",
                        value: 3,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1400003,
        methods: [
            {
                id: "1400003-craftman",
                name: "工匠改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    { id: "SP", min: 2, max: 5 },
                    { id: "defense", min: 1, max: 2 },
                    { id: "protection", min: 1, max: 2 },
                    { id: "WIL", min: 5, max: 10 },
                ],
                progress: [2],
            },
            {
                id: "1400003-1",
                name: "表面強化",
                npc: ["艾頓", "佛格斯", "奈麗絲", "尼克"],
                required: {
                    ep: 10,
                    gold: 3600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "defense",
                        value: 5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1400003-2",
                name: "暗夜使者前鋒特殊改造1",
                npc: ["艾頓", "佛格斯", "奈麗絲", "尼克"],
                required: {
                    ep: 55,
                    gold: 10900,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 8,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400003-3",
                name: "暗夜使者前鋒特殊改造2",
                npc: ["艾頓", "佛格斯", "奈麗絲", "尼克"],
                required: {
                    ep: 50,
                    gold: 11400,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_ranged",
                        value: 8,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400003-4",
                name: "暗夜使者前鋒特殊改造3",
                npc: ["艾頓", "佛格斯", "奈麗絲", "尼克"],
                required: {
                    ep: 45,
                    gold: 12000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_magic",
                        value: 8,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400003-5",
                name: "暗夜使者前鋒專用改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "尼克"],
                required: {
                    ep: 95,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 8,
                    },
                    {
                        id: "immune_ranged",
                        value: 8,
                    },
                    {
                        id: "immune_magic",
                        value: 8,
                    },
                    {
                        id: "defense",
                        value: 2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400003-craftman-2",
                name: "暗夜使者前鋒專用工匠改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "尼克"],
                required: {
                    ep: 100,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    { id: "defense", min: 2, max: 4 },
                    { id: "protection", min: 1, max: 2 },
                    { id: "WIL", min: 7, max: 20 },
                    { id: "SP", min: 3, max: 6 },
                ],
                progress: [2],
            },
            {
                id: "1400003-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特"],
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 1.5,
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
                id: "1400003-g-2",
                name: "寶石防衛改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特"],
                required: {
                    ep: 80,
                    gold: 7300,
                    gems: [
                        {
                            name: "海藍寶石",
                            requiredSize: 5,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 3,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "defense",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1400003-g-3",
                name: "寶石修復1",
                npc: ["陶恩斯"],
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 1.5,
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
                id: "1400003-g-4",
                name: "寶石防衛改造",
                npc: ["陶恩斯"],
                required: {
                    ep: 80,
                    gold: 7300,
                    gems: [
                        {
                            name: "海藍寶石",
                            requiredSize: 5,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 3,
                        },
                        {
                            name: "碧玉",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "defense",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1400003-g-5",
                name: "暗夜使者前鋒寶石修復",
                npc: ["佛格斯", "奈麗絲", "艾頓", "尼克"],
                required: {
                    ep: 100,
                    gold: 25000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 6,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 6,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 6,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 5,
                    },
                ],
                progress: [5],
            },
            {
                id: "1400003-g-6",
                name: "寶石改造",
                npc: ["佛格斯", "奈麗絲", "艾頓", "尼克"],
                required: {
                    ep: 100,
                    gold: 35000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 7,
                        },
                        {
                            name: "托帕石",
                            requiredSize: 7,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 7,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "protection",
                        value: 3,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "shield",
    },
    {
        weaponId: 1440012,
        methods: [
            {
                id: "1440012-1",
                name: "更換扳機",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 20,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1440012-2",
                name: "{0}的輕量化1",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 5,
                    gold: 500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 5,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1440012-3",
                name: "{0}的輕量化2",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 8,
                    gold: 800,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 6,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1440012-4",
                name: "{0}的輕量化3",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 12,
                    gold: 1200,
                    gems: [],
                },
                abilities: [
                    {
                        id: "stamania_revised",
                        value: 7,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1440012-5",
                name: "盾牌鋼瓶特殊改造 1",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 30,
                    gold: 8600,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1440012-6",
                name: "盾牌鋼瓶特殊改造 2",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 40,
                    gold: 9500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_ranged",
                        value: 5,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1440012-7",
                name: "盾牌鋼瓶特殊改造 3",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 45,
                    gold: 9500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_magic",
                        value: 5,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1440012-8",
                name: "魔法改造 1",
                npc: ["拜斯"],
                required: {
                    ep: 15,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_defense",
                        value: 1,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1440012-9",
                name: "魔法改造 2",
                npc: ["拜斯"],
                required: {
                    ep: 20,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_defense",
                        value: 2,
                    },
                    {
                        id: "magic_protection",
                        value: 1,
                    },
                ],
                progress: [1, 2, 3],
            },
            {
                id: "1440012-10",
                name: "魔法改造 3",
                npc: ["拜斯"],
                required: {
                    ep: 25,
                    gold: 40000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_defense",
                        value: 3,
                    },
                    {
                        id: "magic_protection",
                        value: 2,
                    },
                ],
                progress: [2, 3],
            },
            {
                id: "1440012-11",
                name: "拜斯式盔甲強化",
                npc: ["拜斯"],
                required: {
                    ep: 80,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: -8,
                    },
                    {
                        id: "balance",
                        value: 8,
                    },
                    {
                        id: "defense",
                        value: 10,
                    },
                    {
                        id: "protection",
                        value: 5,
                    },
                    {
                        id: "magic_defense",
                        value: 8,
                    },
                    {
                        id: "magic_protection",
                        value: 3,
                    },
                ],
                progress: [4],
            },
            {
                id: "1440012-craftman",
                name: "匠人改造",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 45000,
                    gems: [],
                },
                abilities: [
                    { id: "HP", min: 3, max: 20 },
                    { id: "MP", min: 10, max: 50 },
                    { id: "SP", min: 2, max: 15 },
                    { id: "critical", min: 2, max: 7 },
                ],
                progress: [2],
            },
            {
                id: "1440012-12",
                name: "暗夜使者調解者特殊改造1",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 50,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 10,
                    },
                ],
                progress: [2],
            },
            {
                id: "1440012-13",
                name: "暗夜使者調解者特殊改造2",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 50,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_ranged",
                        value: 10,
                    },
                ],
                progress: [2],
            },
            {
                id: "1440012-14",
                name: "暗夜使者調解者特殊改造3",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 50,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_magic",
                        value: 10,
                    },
                ],
                progress: [2],
            },
            {
                id: "1440012-15",
                name: "暗夜使者調解者專用改造1",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 4,
                    },
                    {
                        id: "immune_ranged",
                        value: 4,
                    },
                    {
                        id: "immune_magic",
                        value: 4,
                    },
                    {
                        id: "fire_alchemy_damage",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1440012-16",
                name: "暗夜使者調解者專用改造2",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 4,
                    },
                    {
                        id: "immune_ranged",
                        value: 4,
                    },
                    {
                        id: "immune_magic",
                        value: 4,
                    },
                    {
                        id: "water_alchemy_damage",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1440012-17",
                name: "暗夜使者調解者專用改造3",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 4,
                    },
                    {
                        id: "immune_ranged",
                        value: 4,
                    },
                    {
                        id: "immune_magic",
                        value: 4,
                    },
                    {
                        id: "earth_alchemy_damage",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1440012-18",
                name: "暗夜使者調解者專用改造4",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 4,
                    },
                    {
                        id: "immune_ranged",
                        value: 4,
                    },
                    {
                        id: "immune_magic",
                        value: 4,
                    },
                    {
                        id: "wind_alchemy_damage",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1440012-craftman-2",
                name: "暗夜使者調解者工匠改造",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 65000,
                    gems: [],
                },
                abilities: [
                    { id: "HP", min: 10, max: 30 },
                    { id: "MP", min: 20, max: 65 },
                    { id: "SP", min: 8, max: 20 },
                    { id: "critical", min: 5, max: 12 },
                ],
                progress: [2],
            },
            {
                id: "1440012-19",
                name: "暗夜使者調解者封印解除",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        value: 3,
                    },
                    {
                        id: "immune_melee",
                        value: 4,
                    },
                    {
                        id: "immune_ranged",
                        value: 4,
                    },
                    {
                        id: "immune_magic",
                        value: 4,
                    },
                ],
                progress: [0],
            },
            {
                id: "1440012-g-1",
                name: "寶石修復1",
                npc: ["佛格斯", "奈麗絲", "艾頓", "梅麗絲", "安德拉絲", "親衛隊武器修理兵", "康娜", "卡隆", "卡芬", "格拉納特"],
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 1.5,
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
                id: "1440012-g-2",
                name: "寶石修復1",
                npc: ["陶恩斯"],
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 1.5,
                        },
                        {
                            name: "綠寶石",
                            requiredSize: 1.5,
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
                id: "1440012-g-3",
                name: "寶石修理",
                npc: ["拜斯"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 1,
                        },
                        {
                            name: "綠寶石",
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
                id: "1440012-g-4",
                name: "修理寶石 1",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 1,
                        },
                        {
                            name: "星彩藍寶石",
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
                id: "1440012-g-5",
                name: "寶石修復",
                npc: ["阿依巴", "多琳", "海蕾特"],
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 8,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 8,
                        },
                        {
                            name: "托帕石",
                            requiredSize: 8,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 4,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "shield_cylinder",
    },
    {
        weaponId: 1650002,
        methods: [
            {
                id: "1650002-1",
                name: "自然力共鳴1",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 70,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 10,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1650002-2",
                name: "自然力共鳴2",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 80,
                    gold: 40000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 11,
                    },
                ],
                progress: [3],
            },
            {
                id: "1650002-3",
                name: "自然力共鳴3",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 15,
                    },
                ],
                progress: [4],
            },
            {
                id: "1650002-craftman",
                name: "工匠改造",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 100,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    { id: "HP", min: 2, max: 5 },
                    { id: "MP", min: 2, max: 5 },
                    { id: "INT", min: 5, max: 80 },
                ],
                progress: [4],
            },
            {
                id: "1650002-4",
                name: "暗夜使者救贖者封印解除",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 100,
                    gold: 77000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "healing_skill",
                        value: 5,
                    },
                    {
                        id: "party_healing_skill",
                        value: 5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1650002-g-1",
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
                id: "1650002-g-2",
                name: "魔杖寶石改造1",
                npc: ["麗莎", "皮諾拉", "史帝華", "希布林", "卡絲妮亞", "姬琳", "貝瑞克希德"],
                required: {
                    ep: 100,
                    gold: 8800,
                    gems: [
                        {
                            name: "海藍寶石",
                            requiredSize: 4,
                        },
                        {
                            name: "紅寶石",
                            requiredSize: 2,
                        },
                        {
                            name: "石榴石",
                            requiredSize: 1,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 4,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "healing_wand",
    },
];
