import { UpgradeMethodsForWeapons } from "../types/Upgrade";

export const upgradeForG27Weapons: UpgradeMethodsForWeapons[] = [
    {
        weaponId: 1200043,
        methods: [
            {
                id: "1200043-1",
                name: "靈魂解放者雙手劍專用改造1",
                required: {
                    ep: 100,
                    gold: 330000,
                },
                abilities: [
                    { id: "critical", value: 5 },
                    { id: "attack_max", value: 30 },
                    { id: "lance_piercing", value: 1 },
                ],
                progress: [0],
            },
            {
                id: "1200043-2",
                name: "靈魂解放者雙手劍專用改造2",
                required: {
                    ep: 100,
                    gold: 330000,
                },
                abilities: [
                    { id: "critical", value: 5 },
                    { id: "attack_max", value: 80 },
                    { id: "attack_min", value: 50 },
                ],
                progress: [0],
            },
            {
                id: "1200043-3",
                name: "淬火 1",
                required: {
                    ep: 30,
                    gold: 77000,
                },
                abilities: [
                    { id: "attack_max", value: 10 },
                    { id: "lance_piercing", value: 1 },
                ],
                progress: [1],
            },
            {
                id: "1200043-4",
                name: "淬火 2",
                required: {
                    ep: 30,
                    gold: 77000,
                },
                abilities: [
                    { id: "attack_max", value: 60 },
                    { id: "attack_min", value: 50 },
                ],
                progress: [1],
            },
            {
                id: "1200043-5",
                name: "修整劍身1",
                required: {
                    ep: 40,
                    gold: 27000,
                },
                abilities: [
                    { id: "attack_max", value: 16 },
                    { id: "attack_min", value: 20 },
                ],
                progress: [2],
            },
            {
                id: "1200043-6",
                name: "修整劍身2",
                required: {
                    ep: 50,
                    gold: 48000,
                },
                abilities: [
                    { id: "attack_max", value: 18 },
                    { id: "attack_min", value: 30 },
                ],
                progress: [3],
            },
            {
                id: "1200043-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 97000,
                },
                abilities: [
                    { id: "attack_max", min: 5, max: 25 },
                    { id: "attack_min", min: 10, max: 30 },
                    { id: "STR", min: 30, max: 50 },
                    { id: "HP", min: 10, max: 30 },
                ],
                progress: [4],
            },
            {
                id: "1200043-g-1",
                name: "寶石修復1",
                required: {
                    ep: 100,
                    gold: 26000,
                    gems: [
                        { name: "鑽石", requiredSize: 1 },
                        { name: "碧玉", requiredSize: 1 },
                        { name: "紅寶石", requiredSize: 1 },
                    ],
                },
                abilities: [{ id: "durability_max", value: 4 }],
                progress: [5],
            },
            {
                id: "1200043-g-2",
                name: "寶石改造",
                required: {
                    ep: 100,
                    gold: 45000,
                    gems: [
                        { name: "金綠柱石", requiredSize: 5 },
                        { name: "青綠柱石", requiredSize: 5 },
                        { name: "紅金綠柱石", requiredSize: 5 },
                    ],
                },
                abilities: [
                    { id: "attack_max", value: 2 },
                    { id: "critical", value: 3 },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1000059,
        methods: [
            {
                id: "1000059-0",
                name: "寶石修復1",
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
                id: "1000059-1",
                name: "寶石改造",
                required: {
                    ep: 100,
                    gold: 45000,
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
            {
                id: "1000059-2",
                name: "修整劍身1",
                required: {
                    ep: 40,
                    gold: 40000,
                },
                abilities: [
                    {
                        id: "balance",
                        value: -2,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 14,
                    },
                    {
                        id: "attack_min",
                        value: 14,
                    },
                ],
                progress: [1],
            },
            {
                id: "1000059-3",
                name: "修整劍身2",
                required: {
                    ep: 45,
                    gold: 42000,
                },
                abilities: [
                    {
                        id: "balance",
                        value: -3,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 16,
                    },
                    {
                        id: "attack_min",
                        value: 16,
                    },
                ],
                progress: [2],
            },
            {
                id: "1000059-4",
                name: "修整劍身3",
                required: {
                    ep: 60,
                    gold: 47000,
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 23,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                    {
                        id: "attack_min",
                        value: 34,
                    },
                ],
                progress: [3],
            },
            {
                id: "1000059-5",
                name: "修整劍身4",
                required: {
                    ep: 90,
                    gold: 79000,
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 27,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                    {
                        id: "attack_min",
                        value: 39,
                    },
                ],
                progress: [4],
            },
            {
                id: "1000059-6",
                name: "削銳刀尖1",
                required: {
                    ep: 40,
                    gold: 40000,
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 26,
                    },
                    {
                        id: "attack_min",
                        value: 30,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1000059-7",
                name: "削銳刀尖2",
                required: {
                    ep: 45,
                    gold: 42000,
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 28,
                    },
                    {
                        id: "attack_min",
                        value: 30,
                    },
                    {
                        id: "critical",
                        value: -2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1000059-8",
                name: "磨利刀刃",
                required: {
                    ep: 23,
                    gold: 33000,
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
                id: "1000059-9",
                name: "靈魂解放者單手劍專用改造 1",
                required: {
                    ep: 100,
                    gold: 99000,
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1000059-10",
                name: "靈魂解放者單手劍專用改造 2",
                required: {
                    ep: 100,
                    gold: 99000,
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 57,
                    },
                    {
                        id: "attack_min",
                        value: 40,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                ],
                progress: [0],
            },
            {
                id: "1000059-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 50000,
                },
                abilities: [
                    { id: "STR", min: 1, max: 35 },
                    { id: "WIL", min: 7, max: 20 },
                    { id: "HP", min: 3, max: 20 },
                    { id: "STR2", min: 1, max: 14 },
                ],
                progress: [4],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1010070,
        methods: [
            {
                id: "1010070-0",
                name: "寶石修復1",
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
                id: "1010070-1",
                name: "調整重量 1",
                required: {
                    ep: 10,
                    gold: 10000,
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
                id: "1010070-2",
                name: "調整重量 2",
                required: {
                    ep: 30,
                    gold: 20000,
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
                id: "1010070-3",
                name: "調整重量 3",
                required: {
                    ep: 50,
                    gold: 27000,
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
                id: "1010070-4",
                name: "調整重量 4",
                required: {
                    ep: 60,
                    gold: 34000,
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
                id: "1010070-5",
                name: "淬火 1",
                required: {
                    ep: 5,
                    gold: 25000,
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
                id: "1010070-6",
                name: "淬火 2",
                required: {
                    ep: 15,
                    gold: 45000,
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
                progress: [1, 2, 3, 4],
            },
            {
                id: "1010070-7",
                name: "淬火 3",
                required: {
                    ep: 25,
                    gold: 65000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 10,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1010070-8",
                name: "淬火 4",
                required: {
                    ep: 35,
                    gold: 85000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "balance",
                        value: -8,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1010070-9",
                name: "淬火 5",
                required: {
                    ep: 45,
                    gold: 105000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 20,
                    },
                    {
                        id: "balance",
                        value: -10,
                    },
                ],
                progress: [4],
            },
            {
                id: "1010070-10",
                name: "輕量化1",
                required: {
                    ep: 10,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1010070-11",
                name: "修磨稜角",
                required: {
                    ep: 10,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 4,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [2],
            },
            {
                id: "1010070-12",
                name: "更換手把",
                required: {
                    ep: 30,
                    gold: 35000,
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
                id: "1010070-13",
                name: "庫魯格鐵錘強化",
                required: {
                    ep: 60,
                    gold: 48000,
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
                id: "1010070-14",
                name: "陶恩斯式鐵錘改造",
                required: {
                    ep: 50,
                    gold: 49000,
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
                id: "1010070-15",
                name: "陶恩斯式鐵錘強化",
                required: {
                    ep: 88,
                    gold: 88000,
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
                id: "1010070-16",
                name: "鐵錘寶石改造1",
                required: {
                    ep: 100,
                    gold: 73000,
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
            {
                id: "1010070-craftman",
                name: "工匠改造",
                required: {
                    ep: 80,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "STR",
                        min: 5,
                        max: 30,
                    },
                    {
                        id: "幸運增加",
                        min: 5,
                        max: 30,
                    },
                    {
                        id: "HP",
                        min: 3,
                        max: 6,
                    },
                    {
                        id: "最大耐力增加",
                        min: 3,
                        max: 6,
                    },
                ],
                progress: [4],
            },
            {
                id: "1010070-18",
                name: "靈魂解放者單手鎚專用改造1",
                required: {
                    ep: 100,
                    gold: 122000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 7,
                    },
                    {
                        id: "attack_max",
                        value: 33,
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
                id: "1010070-19",
                name: "靈魂解放者單手鎚專用改造2",
                required: {
                    ep: 100,
                    gold: 122000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 37,
                    },
                    {
                        id: "attack_max",
                        value: 55,
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
                id: "1010070-20",
                name: "輕量化2",
                required: {
                    ep: 70,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 40,
                    },
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                ],
                progress: [1],
            },
            {
                id: "1010070-21",
                name: "修磨稜角2",
                required: {
                    ep: 70,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 45,
                    },
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "critical",
                        value: 4,
                    },
                ],
                progress: [2],
            },
        ],
        weaponCategory: "melee_physical",
    },

    {
        weaponId: 1020004,
        methods: [
            {
                id: "1020004-0",
                name: "寶石修復1",
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
                id: "1020004-1",
                name: "調整重量",
                required: {
                    ep: 15,
                    gold: 10000,
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
                id: "1020004-2",
                name: "淬火1",
                required: {
                    ep: 20,
                    gold: 30000,
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
                id: "1020004-3",
                name: "淬火2",
                required: {
                    ep: 30,
                    gold: 40000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 14,
                    },
                    {
                        id: "balance",
                        value: -4,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1020004-4",
                name: "淬火3",
                required: {
                    ep: 50,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "balance",
                        value: -5,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1020004-5",
                name: "淬火4",
                required: {
                    ep: 80,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 17,
                    },
                    {
                        id: "balance",
                        value: -7,
                    },
                    {
                        id: "attack_min",
                        value: 5,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1020004-6",
                name: "淬火5",
                required: {
                    ep: 100,
                    gold: 95000,
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
                id: "1020004-7",
                name: "輕量化1",
                required: {
                    ep: 20,
                    gold: 15000,
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
                id: "1020004-8",
                name: "輕量化2",
                required: {
                    ep: 30,
                    gold: 20000,
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
                id: "1020004-9",
                name: "輕量化3",
                required: {
                    ep: 50,
                    gold: 35000,
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
                id: "1020004-10",
                name: "輕量化4",
                required: {
                    ep: 80,
                    gold: 40000,
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
                id: "1020004-11",
                name: "磨利斧刃1",
                required: {
                    ep: 100,
                    gold: 70000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 3,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 12,
                    },
                ],
                progress: [2],
            },
            {
                id: "1020004-12",
                name: "磨利斧刃2",
                required: {
                    ep: 20,
                    gold: 25000,
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
                id: "1020004-13",
                name: "磨利斧刃3",
                required: {
                    ep: 30,
                    gold: 50000,
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
                id: "1020004-14",
                name: "更換手把1",
                required: {
                    ep: 80,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 5,
                    },
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1020004-15",
                name: "艾頓式靈魂解放者單手斧強化",
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
                        value: 15,
                    },
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
                        value: -5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1020004-16",
                name: "崔弗式靈魂解放者單手斧改造",
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
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1020004-17",
                name: "艾波里恩靈魂解放者單手斧特殊改造",
                required: {
                    ep: 60,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: -10,
                    },
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [4],
            },
            {
                id: "1020004-18",
                name: "靈魂解放者單手斧寶石改造1",
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
                        value: 5,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [5],
            },
            {
                id: "1020004-19",
                name: "靈魂解放者單手斧專用改造1",
                required: {
                    ep: 100,
                    gold: 119000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 17,
                    },
                    {
                        id: "attack_max",
                        value: 31,
                    },
                    {
                        id: "critical",
                        value: 17,
                    },
                ],
                progress: [0],
            },
            {
                id: "1020004-20",
                name: "靈魂解放者單手斧專用改造2",
                required: {
                    ep: 100,
                    gold: 119000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 47,
                    },
                    {
                        id: "attack_max",
                        value: 49,
                    },
                    {
                        id: "critical",
                        value: 17,
                    },
                ],
                progress: [0],
            },
            {
                id: "1020004-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 89000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "HP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "SP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "STR",
                        min: 1,
                        max: 53,
                    },
                    {
                        id: "LUK",
                        min: 5,
                        max: 35,
                    },
                ],
                progress: [4],
            },
            {
                id: "1020004-22",
                name: "更換手把2",
                required: {
                    ep: 80,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 32,
                    },
                    {
                        id: "attack_max",
                        value: 26,
                    },
                ],
                progress: [1],
            },
            {
                id: "1020004-23",
                name: "磨利斧刃",
                required: {
                    ep: 100,
                    gold: 70000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 3,
                    },
                    {
                        id: "attack_min",
                        value: 28,
                    },
                    {
                        id: "attack_max",
                        value: 27,
                    },
                ],
                progress: [2],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1040054,
        methods: [
            {
                id: "1040054-0",
                name: "寶石修復1",
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
                id: "1040054-1",
                name: "弓線強化3",
                required: {
                    ep: 25,
                    gold: 36000,
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
                id: "1040054-2",
                name: "弓線強化4",
                required: {
                    ep: 37,
                    gold: 66600,
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
                id: "1040054-3",
                name: "弓線強化5",
                required: {
                    ep: 55,
                    gold: 136000,
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
                id: "1040054-4",
                name: "瞄準器更換1",
                required: {
                    ep: 90,
                    gold: 159000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 10,
                    },
                    {
                        id: "attack_max",
                        value: 10,
                    },
                ],
                progress: [1],
            },
            {
                id: "1040054-5",
                name: "瞄準器更換2",
                required: {
                    ep: 90,
                    gold: 159000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 30,
                    },
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "balance",
                        value: -7,
                    },
                ],
                progress: [1],
            },
            {
                id: "1040054-6",
                name: "瞄準器更換3",
                required: {
                    ep: 90,
                    gold: 159000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -7,
                    },
                ],
                progress: [1],
            },
            {
                id: "1040054-7",
                name: "強化箭尖",
                required: {
                    ep: 70,
                    gold: 75000,
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
                id: "1040054-8",
                name: "靈魂解放者弓封印解除1",
                required: {
                    ep: 100,
                    gold: 170000,
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
                id: "1040054-9",
                name: "靈魂解放者弓封印解除2",
                required: {
                    ep: 100,
                    gold: 170000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 34,
                    },
                    {
                        id: "attack_max",
                        value: 57,
                    },
                ],
                progress: [0],
            },
            {
                id: "1040054-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 110000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "DEX",
                        min: 5,
                        max: 30,
                    },
                    {
                        id: "LUK",
                        min: 10,
                        max: 70,
                    },
                    {
                        id: "HP",
                        min: 3,
                        max: 6,
                    },
                    {
                        id: "SP",
                        min: 3,
                        max: 6,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040054-11",
                name: "靈魂解放者弓寶石改造",
                required: {
                    ep: 100,
                    gold: 90000,
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
        weaponId: 1040055,
        methods: [
            {
                id: "1040055-0",
                name: "強化弓柄1",
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
                id: "1040055-2",
                name: "強化弓柄2",
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
                id: "1040055-5",
                name: "強化弓柄3",
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
                id: "1040055-7",
                name: "強化弓柄4",
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
                id: "1040055-8",
                name: "弓弦強化1",
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
                id: "1040055-10",
                name: "弓弦強化2",
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
                id: "1040055-12",
                name: "弓弦強化3",
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
                id: "1040055-14",
                name: "弓弦強化4",
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
                id: "1040055-16",
                name: "弓弦強化5",
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
                id: "1040055-18",
                name: "更換扣板機",
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
                id: "1040055-20",
                name: "更換接頭",
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
                id: "1040055-22",
                name: "強化弓身",
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
                id: "1040055-25",
                name: "強化奈麗絲式弩",
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
                id: "1040055-27",
                name: "改造阿蘭雯式弩",
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
                id: "1040055-28",
                name: "強化尼克式弩",
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
                id: "1040055-29",
                name: "改造尼克式弩",
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
                id: "1040055-30",
                name: "弩寶石改造1",
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
            {
                id: "1040055-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "HP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "SP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "LUK",
                        min: 10,
                        max: 70,
                    },
                ],
                progress: [4],
            },
            {
                id: "1040055-32",
                name: "靈魂解放者弩專用扳機更換",
                required: {
                    ep: 45,
                    gold: 47000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 10,
                    },
                    {
                        id: "attack_max",
                        value: 10,
                    },
                ],
                progress: [2],
            },
            {
                id: "1040055-33",
                name: "靈魂解放者弩專用弓線強化1",
                required: {
                    ep: 80,
                    gold: 97000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 30,
                    },
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [2],
            },
            {
                id: "1040055-34",
                name: "靈魂解放者弩專用弓線強化2",
                required: {
                    ep: 80,
                    gold: 97000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "balance",
                        value: -6,
                    },
                ],
                progress: [2],
            },
            {
                id: "1040055-35",
                name: "靈魂解放者弩專用改造",
                required: {
                    ep: 100,
                    gold: 88000,
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
                id: "1040055-36",
                name: "靈魂解放者弩專用收尾1",
                required: {
                    ep: 100,
                    gold: 150000,
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
                id: "1040055-37",
                name: "靈魂解放者弩專用收尾2",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 32,
                    },
                    {
                        id: "attack_min",
                        value: 30,
                    },
                ],
                progress: [4],
            },
        ],
        weaponCategory: "ranged_physical",
    },
    {
        weaponId: 1050017,
        methods: [
            {
                id: "1050017-0",
                name: "寶石修復1",
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
                id: "1050017-1",
                name: "魔杖寶石改造1",
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
                id: "1050017-2",
                name: "增強3屬性自然力1",
                required: {
                    ep: 15,
                    gold: 8000,
                    gems: [],
                },
                abilities: [{ id: "chain_casting", value: 1 }],
                progress: [3],
            },
            {
                id: "1050017-4",
                name: "增強3屬性自然力2",
                required: {
                    ep: 30,
                    gold: 12000,
                    gems: [],
                },
                abilities: [{ id: "chain_casting", value: 2 }],
                progress: [3],
            },

            {
                id: "1050017-7",
                name: "增強3屬性自然力3",
                required: {
                    ep: 50,
                    gold: 25000,
                    gems: [],
                },
                abilities: [{ id: "chain_casting", value: 3 }],
                progress: [3],
            },
            {
                id: "1050017-8",
                name: "增強3屬性自然力4",
                required: {
                    ep: 90,
                    gold: 50000,
                    gems: [],
                },
                abilities: [{ id: "chain_casting", value: 4 }],
                progress: [3],
            },
            {
                id: "1050017-10",
                name: "自然力共鳴",
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
                id: "1050017-11",
                name: "自然力加速 1",
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
                id: "1050017-12",
                name: "自然力加速 2",
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
                id: "1050017-13",
                name: "自然力加速 3",
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
                id: "1050017-14",
                name: "自然力凝聚 1",
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
                id: "1050017-15",
                name: "自然力凝聚 2",
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
                id: "1050017-16",
                name: "自然力凝聚 3",
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
                id: "1050017-17",
                name: "自然力凝聚 4",
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
                id: "1050017-18",
                name: "輕量化",
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
                id: "1050017-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "INT",
                        min: 10,
                        max: 100,
                    },
                    {
                        id: "MP",
                        min: 10,
                        max: 50,
                    },
                    {
                        id: "LUK",
                        min: 1,
                        max: 20,
                    },
                ],
                progress: [4],
            },
            {
                id: "1050017-20",
                name: "寶石修復 1",
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
                id: "1050017-21",
                name: "三矛魔杖寶石改造 1",
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
            {
                id: "1050017-22",
                name: "靈魂解放者魔杖寶石改造",
                required: {
                    ep: 100,
                    gold: 120000,
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
                        value: 2,
                    },
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1050017-23",
                name: "靈魂解放者魔杖封印解除1",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 50,
                    },
                    {
                        id: "durability_max",
                        value: 7,
                    },
                ],
                progress: [0],
            },
            {
                id: "1050017-24",
                name: "靈魂解放者魔杖封印解除2",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 20,
                    },
                    {
                        id: "durability_max",
                        value: 7,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1050017-25",
                name: "靈魂解放者魔自然力凝聚1",
                required: {
                    ep: 50,
                    gold: 85000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 35,
                    },
                ],
                progress: [4],
            },
            {
                id: "1050017-26",
                name: "靈魂解放者魔自然力凝聚2",
                required: {
                    ep: 50,
                    gold: 85000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 5,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [4],
            },
        ],
        weaponCategory: "magic_wand",
    },
    {
        weaponId: 1070014,
        methods: [
            {
                id: "1070014-0",
                name: "調整袋子1",
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
                id: "1070014-1",
                name: "調整袋子2",
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
                id: "1070014-2",
                name: "調整袋子3",
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
                id: "1070014-3",
                name: "核心零件強化1",
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
                id: "1070014-4",
                name: "核心零件強化2",
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
                id: "1070014-5",
                name: "核心零件強化3",
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
                id: "1070014-6",
                name: "增加金屬板重量1",
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
                id: "1070014-7",
                name: "增加金屬板重量2",
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
                id: "1070014-8",
                name: "增加金屬板重量3",
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
                id: "1070014-9",
                name: "修理手把寶石",
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
            {
                id: "1070014-10",
                name: "靈魂解放者手把養成1",
                required: {
                    ep: 50,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    { id: "marionette_hp", value: 1500 },
                    { id: "marionette_attack_max", value: 40 },
                    { id: "marionette_attack_min", value: 40 },
                    { id: "marionette_critical", value: 10 },
                ],
                progress: [0],
            },
            {
                id: "1070014-11",
                name: "靈魂解放者手把養成2",
                required: {
                    ep: 50,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1070014-12",
                name: "靈魂解放者手把客製化改造",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    // todo: check values
                    {
                        id: "attack_max",
                        value: 66,
                    },
                ],
                progress: [4],
            },
            {
                id: "1070014-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    { id: "marionette_attack_max", min: 20, max: 40 },
                    { id: "marionette_attack_min", min: 10, max: 30 },
                    { id: "marionette_critical", min: 5, max: 10 },
                ],
                progress: [4],
            },
            {
                id: "1070014-14",
                name: "靈魂解放者手把寶石修理1",
                required: {
                    ep: 100,
                    gold: 100000,
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
                    { id: "marionette_hp", value: 1500 },
                    { id: "marionette_attack_max", value: 40 },
                    { id: "marionette_attack_min", value: 40 },
                    { id: "marionette_critical", value: 10 },
                ],
                progress: [5],
            },
            {
                id: "1070014-15",
                name: "靈魂解放者手把寶石修理2",
                required: {
                    ep: 100,
                    gold: 100000,
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
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [5],
            },
        ],
        weaponCategory: "melee_physical", // todo: update category
    },
    {
        weaponId: 1090010,
        methods: [
            {
                id: "1090010-0",
                name: "修磨刀刃",
                required: {
                    ep: 50,
                    gold: 59000,
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
                progress: [1, 2],
            },
            {
                id: "1090010-1",
                name: "魔力賦予1",
                required: {
                    ep: 70,
                    gold: 77000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 4,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [2],
            },
            {
                id: "1090010-2",
                name: "修磨把手",
                required: {
                    ep: 90,
                    gold: 83000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 4,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [3],
            },
            {
                id: "1090010-3",
                name: "平衡錘輕量化",
                required: {
                    ep: 100,
                    gold: 99000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 6,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [4],
            },
            {
                id: "1090010-4",
                name: "靈魂解放者鐮刀專用改造1",
                required: {
                    ep: 100,
                    gold: 157000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                    {
                        id: "magic_damage",
                        value: -7,
                    },
                ],
                progress: [0],
            },
            {
                id: "1090010-5",
                name: "靈魂解放者鐮刀專用改造2",
                required: {
                    ep: 100,
                    gold: 157000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 18,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1090010-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "HP",
                        min: 10,
                        max: 50,
                    },
                ],
                progress: [4],
            },
            {
                id: "1090010-7",
                name: "寶石修理",
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
                id: "1090010-8",
                name: "寶石改造",
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
            {
                id: "1090010-9",
                name: "魔力賦予2",
                required: {
                    ep: 70,
                    gold: 77000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 29,
                    },
                ],
                progress: [2],
            },
        ],
        weaponCategory: "magic_staff",
    },
    {
        weaponId: 1210067,
        methods: [
            {
                id: "1210067-0",
                name: "寶石修復1",
                required: {
                    ep: 100,
                    gold: 23000,
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
                id: "1210067-1",
                name: "調整重量 1",
                required: {
                    ep: 20,
                    gold: 5000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 4,
                    },
                ],
                progress: [0, 1, 2, 3, 4],
            },
            {
                id: "1210067-2",
                name: "調整重量 2",
                required: {
                    ep: 30,
                    gold: 10000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 6,
                    },
                ],
                progress: [0, 1, 2, 3],
            },
            {
                id: "1210067-3",
                name: "調整重量 3",
                required: {
                    ep: 40,
                    gold: 15000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 8,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1210067-4",
                name: "調整重量 4",
                required: {
                    ep: 50,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: 10,
                    },
                ],
                progress: [0, 1],
            },
            {
                id: "1210067-5",
                name: "淬火 1",
                required: {
                    ep: 50,
                    gold: 25000,
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
                id: "1210067-6",
                name: "淬火 2",
                required: {
                    ep: 45,
                    gold: 45000,
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
                        value: -1,
                    },
                ],
                progress: [1, 2, 3, 4],
            },
            {
                id: "1210067-7",
                name: "淬火 3",
                required: {
                    ep: 50,
                    gold: 65000,
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
                    {
                        id: "attack_min",
                        value: -3,
                    },
                ],
                progress: [2, 3, 4],
            },
            {
                id: "1210067-8",
                name: "淬火 4",
                required: {
                    ep: 60,
                    gold: 77000,
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
                    {
                        id: "attack_min",
                        value: -5,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1210067-9",
                name: "淬火 5",
                required: {
                    ep: 80,
                    gold: 89000,
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
                    {
                        id: "attack_min",
                        value: -7,
                    },
                ],
                progress: [4],
            },
            {
                id: "1210067-10",
                name: "輕量化1",
                required: {
                    ep: 80,
                    gold: 133000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: -4,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1210067-11",
                name: "修磨稜角",
                required: {
                    ep: 10,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 5,
                    },
                ],
                progress: [1, 2],
            },
            {
                id: "1210067-12",
                name: "更換手把",
                required: {
                    ep: 30,
                    gold: 30000,
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
                id: "1210067-13",
                name: "庫魯格鐵錘強化",
                required: {
                    ep: 60,
                    gold: 38400,
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
                id: "1210067-14",
                name: "陶恩斯式鐵錘改造",
                required: {
                    ep: 50,
                    gold: 43300,
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
                        value: -8,
                    },
                ],
                progress: [3, 4],
            },
            {
                id: "1210067-15",
                name: "陶恩斯式鐵錘強化",
                required: {
                    ep: 88,
                    gold: 68500,
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
                        value: -2,
                    },
                    {
                        id: "splash_radius",
                        value: 50,
                    },
                ],
                progress: [0],
            },
            {
                id: "1210067-16",
                name: "鐵錘寶石改造",
                required: {
                    ep: 100,
                    gold: 20000,
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
            {
                id: "1210067-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "STR",
                        min: 5,
                        max: 35,
                    },
                    {
                        id: "LUK",
                        min: 1,
                        max: 20,
                    },
                    {
                        id: "HP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "SP",
                        min: 2,
                        max: 15,
                    },
                ],
                progress: [4],
            },
            {
                id: "1210067-18",
                name: "靈魂解放者雙手鎚用改造1",
                required: {
                    ep: 100,
                    gold: 110000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 7,
                    },
                    {
                        id: "attack_max",
                        value: 23,
                    },
                    {
                        id: "wound_max",
                        value: 10,
                    },
                    {
                        id: "balance",
                        value: 25,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1210067-19",
                name: "靈魂解放者雙手鎚用改造2",
                required: {
                    ep: 100,
                    gold: 110000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 37,
                    },
                    {
                        id: "attack_max",
                        value: 83,
                    },
                    {
                        id: "wound_max",
                        value: 10,
                    },
                    {
                        id: "balance",
                        value: 25,
                    },
                ],
                progress: [0],
            },
            {
                id: "1210067-20",
                name: "輕量化2",
                required: {
                    ep: 80,
                    gold: 133000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        value: -4,
                    },
                    {
                        id: "attack_min",
                        value: 17,
                    },
                    {
                        id: "attack_max",
                        value: 60,
                    },
                ],
                progress: [1],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1220018,
        methods: [
            {
                id: "1220018-0",
                name: "寶石修復1",
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
                id: "1220018-1",
                name: "淬火 2",
                required: {
                    ep: 70,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: -2,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1220018-2",
                name: "淬火 3",
                required: {
                    ep: 80,
                    gold: 85600,
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
                id: "1220018-3",
                name: "淬火 4",
                required: {
                    ep: 90,
                    gold: 95000,
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
                id: "1220018-4",
                name: "靈魂解放者雙手斧專用淬火",
                required: {
                    ep: 80,
                    gold: 47000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 21,
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
                        id: "splash_radius",
                        value: 60,
                    },
                ],
                progress: [4],
            },
            {
                id: "1220018-5",
                name: "靈魂解放者雙手斧寶石改造",
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
            {
                id: "1220018-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "HP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "SP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "STR",
                        min: 1,
                        max: 32,
                    },
                    {
                        id: "LUK",
                        min: 5,
                        max: 35,
                    },
                ],
                progress: [4],
            },
            {
                id: "1220018-7",
                name: "靈魂解放者雙手斧專用改造1",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "critical",
                        value: 25,
                    },
                    {
                        id: "balance",
                        value: 25,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1220018-8",
                name: "靈魂解放者雙手斧專用改造2",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 65,
                    },
                    {
                        id: "critical",
                        value: 25,
                    },
                    {
                        id: "balance",
                        value: 25,
                    },
                    {
                        id: "attack_min",
                        value: 30,
                    },
                ],
                progress: [0],
            },
            {
                id: "1220018-9",
                name: "淬火 1",
                required: {
                    ep: 70,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 33,
                    },
                    {
                        id: "attack_max",
                        value: 43,
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
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1230039,
        methods: [
            {
                id: "1230039-0",
                name: "寶石修復1",
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
                id: "1230039-1",
                name: "自然力凝聚1",
                required: {
                    ep: 25,
                    gold: 69000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 3,
                    },
                    {
                        id: "durability_max",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1230039-2",
                name: "自然力凝聚2",
                required: {
                    ep: 30,
                    gold: 73000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 4,
                    },
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1230039-3",
                name: "自然力凝聚3",
                required: {
                    ep: 35,
                    gold: 75000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 6,
                    },
                    {
                        id: "durability_max",
                        value: -4,
                    },
                ],
                progress: [3],
            },
            {
                id: "1230039-4",
                name: "自然力凝聚4",
                required: {
                    ep: 50,
                    gold: 85000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 42,
                    },
                    {
                        id: "durability_max",
                        value: -5,
                    },
                ],
                progress: [4],
            },
            {
                id: "1230039-5",
                name: "靈魂解放者集魔杖專用改造1",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 46,
                    },
                    {
                        id: "manause_revised",
                        value: 50,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [0],
            },
            {
                id: "1230039-6",
                name: "靈魂解放者集魔杖專用改造2",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 11,
                    },
                    {
                        id: "manause_revised",
                        value: 30,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1230039-7",
                name: "寶石修理",
                required: {
                    ep: 100,
                    gold: 70000,
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
                id: "1230039-8",
                name: "靈魂解放者集魔杖寶石改造",
                required: {
                    ep: 100,
                    gold: 80000,
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
                        value: 4,
                    },
                    {
                        id: "balance",
                        value: 5,
                    },
                ],
                progress: [5],
            },
            {
                id: "1230039-9",
                name: "自然力凝聚5",
                required: {
                    ep: 50,
                    gold: 85000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "magic_damage",
                        value: 7,
                    },
                    {
                        id: "durability_max",
                        value: -5,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [4],
            },
        ],
        weaponCategory: "magic_staff",
    },
    {
        weaponId: 1250026,
        methods: [
            {
                id: "1250026-0",
                name: "淬火 1",
                required: {
                    ep: 50,
                    gold: 59000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 35,
                    },
                    {
                        id: "attack_min",
                        value: 20,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1250026-1",
                name: "淬火 2",
                required: {
                    ep: 60,
                    gold: 68000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 40,
                    },
                    {
                        id: "attack_min",
                        value: 25,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1250026-2",
                name: "淬火 3",
                required: {
                    ep: 70,
                    gold: 79000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 45,
                    },
                    {
                        id: "attack_min",
                        value: 30,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1250026-3",
                name: "磨利刀刃1",
                required: {
                    ep: 70,
                    gold: 70000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 10,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1250026-4",
                name: "磨利刀刃2",
                required: {
                    ep: 80,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 15,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [2],
            },
            {
                id: "1250026-5",
                name: "磨利刀刃3",
                required: {
                    ep: 90,
                    gold: 110000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 20,
                    },
                    {
                        id: "balance",
                        value: -2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1250026-6",
                name: "靈魂解放者騎槍專用改造1",
                required: {
                    ep: 100,
                    gold: 153000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: -5,
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
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1250026-7",
                name: "靈魂解放者騎槍專用改造2",
                required: {
                    ep: 100,
                    gold: 153000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 25,
                    },
                    {
                        id: "attack_min",
                        value: 35,
                    },
                    {
                        id: "critical",
                        value: 5,
                    },
                    {
                        id: "durability_max",
                        value: -3,
                    },
                ],
                progress: [0],
            },
            {
                id: "1250026-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 45000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "STR",
                        min: 5,
                        max: 70,
                    },
                    {
                        id: "LUK",
                        min: 1,
                        max: 20,
                    },
                    {
                        id: "HP",
                        min: 3,
                        max: 20,
                    },
                    {
                        id: "SP",
                        min: 2,
                        max: 15,
                    },
                ],
                progress: [4],
            },
            {
                id: "1250026-9",
                name: "寶石改造",
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
                id: "1250026-10",
                name: "寶石修理",
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
        weaponId: 1260020,
        methods: [
            {
                id: "1260020-0",
                name: "寶石修復1",
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
            {
                id: "1260020-1",
                name: "鎖鏈研磨1(1改)",
                required: {
                    ep: 30,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [1],
            },
            {
                id: "1260020-2",
                name: "鎖鏈研磨2(1改)",
                required: {
                    ep: 30,
                    gold: 3000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1260020-3",
                name: "鎖鏈研磨1(2改)",
                required: {
                    ep: 40,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "durability_max",
                        value: 1,
                    },
                ],
                progress: [2],
            },
            {
                id: "1260020-4",
                name: "輕量化",
                required: {
                    ep: 50,
                    gold: 9000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 10,
                    },
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1260020-5",
                name: "靈魂解放者拳套封印解除",
                required: {
                    ep: 95,
                    gold: 100000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 10,
                    },
                    {
                        id: "critical",
                        value: 10,
                    },
                    {
                        id: "knuckle_chain_damage",
                        value: 30,
                    },
                ],
                progress: [0],
            },
            {
                id: "1260020-6",
                name: "靈魂解放者拳套專用改造",
                required: {
                    ep: 100,
                    gold: 150000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 20,
                    },
                    {
                        id: "attack_max",
                        value: 60,
                    },
                    {
                        id: "critical_chain_cooldown_reset",
                        value: 50,
                    },
                    {
                        id: "durability_max",
                        value: -2,
                    },
                ],
                progress: [4],
            },
            {
                id: "1260020-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "LUK",
                        min: 25,
                        max: 75,
                    },
                ],
                progress: [4],
            },
            {
                id: "1260020-8",
                name: "鎖鏈研磨2(2改)",
                required: {
                    ep: 40,
                    gold: 6000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 10,
                    },
                    {
                        id: "durability_max",
                        value: 1,
                    },
                ],
                progress: [2],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1270029,
        methods: [
            {
                id: "1270029-0",
                name: "彈匣替換",
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
                id: "1270029-1",
                name: "彈膛擴張",
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
                id: "1270029-2",
                name: "重量化 1",
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
                id: "1270029-3",
                name: "重量化 2",
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
                id: "1270029-4",
                name: "重量化 3",
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
                id: "1270029-5",
                name: "新增鋼線 1",
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
                id: "1270029-6",
                name: "新增鋼線 2",
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
                id: "1270029-7",
                name: "新增鋼線 3",
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
                id: "1270029-8",
                name: "槍管擴張",
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
                id: "1270029-9",
                name: "瞄準鏡裝置",
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
                id: "1270029-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 40000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        min: 4,
                        max: 12,
                    },
                    {
                        id: "balance",
                        min: 4,
                        max: 12,
                    },
                    {
                        id: "LUK",
                        min: 15,
                        max: 75,
                    },
                ],
                progress: [4],
            },
            {
                id: "1270029-11",
                name: "寶石修理 1",
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
                id: "1270029-12",
                name: "寶石改造 1",
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
            {
                id: "1270029-13",
                name: "靈魂解放者雙槍專用改造1",
                required: {
                    ep: 100,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 50,
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
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1270029-14",
                name: "靈魂解放者雙槍重量化1",
                required: {
                    ep: 70,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1270029-15",
                name: "靈魂解放者雙槍重量化2",
                required: {
                    ep: 70,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 30,
                    },
                    {
                        id: "attack_min",
                        value: 30,
                    },
                ],
                progress: [1],
            },
            {
                id: "1270029-16",
                name: "靈魂解放者雙槍專用改造2",
                required: {
                    ep: 100,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 70,
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
        ],
        weaponCategory: "ranged_physical",
    },
    {
        weaponId: 1280018,
        methods: [
            {
                id: "1280018-0",
                name: "磨刃 1",
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
                id: "1280018-1",
                name: "磨刃 3",
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
                id: "1280018-2",
                name: "磨刃 2",
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
                id: "1280018-3",
                name: "磨刃 4",
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
                id: "1280018-4",
                name: "丟掉刃 1",
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
                id: "1280018-5",
                name: "丟掉刃 2",
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
                id: "1280018-6",
                name: "丟掉刃 3",
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
                id: "1280018-7",
                name: "削刃4",
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
                id: "1280018-8",
                name: "削刃4",
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
                id: "1280018-9",
                name: "削刃5",
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
                id: "1280018-10",
                name: "削刃5",
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
                id: "1280018-11",
                name: "刀刃強化",
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
                id: "1280018-12",
                name: "手裏劍 寶石改造 1",
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
                id: "1280018-13",
                name: "手裏劍 寶石改造 2",
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
            {
                id: "1280018-14",
                name: "靈魂解放者手裏劍專用改造1",
                required: {
                    ep: 100,
                    gold: 143000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 30,
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
                id: "1280018-15",
                name: "靈魂解放者手裏劍專用改造2",
                required: {
                    ep: 100,
                    gold: 143000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 55,
                    },
                    {
                        id: "attack_min",
                        value: 20,
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
                id: "1280018-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 109000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "balance",
                        min: 5,
                        max: 15,
                    },
                    {
                        id: "attack_min",
                        min: 1,
                        max: 3,
                    },
                    {
                        id: "attack_max",
                        min: 18,
                        max: 38,
                    },
                ],
                progress: [4],
            },
            {
                id: "1280018-17",
                name: "靈魂解放者手裏劍特別改造1",
                required: {
                    ep: 80,
                    gold: 101000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: 1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1280018-18",
                name: "靈魂解放者手裏劍特別改造2",
                required: {
                    ep: 80,
                    gold: 101000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 26,
                    },
                    {
                        id: "durability_max",
                        value: 1,
                    },
                ],
                progress: [1],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1290021,
        methods: [
            {
                id: "1290021-0",
                name: "磨利刀尖",
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
                id: "1290021-1",
                name: "鎖鏈強化 1",
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
                id: "1290021-2",
                name: "鎖鏈強化 2",
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
                id: "1290021-3",
                name: "鎖鏈強化 3",
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
                id: "1290021-4",
                name: "磨利刀刃 1",
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
                id: "1290021-5",
                name: "磨利刀刃 2",
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
                id: "1290021-6",
                name: "磨利刀刃 3",
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
                id: "1290021-7",
                name: "艾頓式改造",
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
                id: "1290021-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 30000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        min: 1,
                        max: 10,
                    },
                    {
                        id: "LUK",
                        min: 1,
                        max: 20,
                    },
                    {
                        id: "HP",
                        min: 1,
                        max: 20,
                    },
                ],
                progress: [4],
            },
            {
                id: "1290021-9",
                name: "寶石修復",
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
            {
                id: "1290021-10",
                name: "靈魂解放者鎖鏈鐮刃專用改造1",
                required: {
                    ep: 100,
                    gold: 125000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 50,
                    },
                    {
                        id: "attack_max",
                        value: 90,
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
                id: "1290021-11",
                name: "靈魂解放者鎖鏈鐮刃專用改造2",
                required: {
                    ep: 100,
                    gold: 125000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 15,
                    },
                    {
                        id: "attack_max",
                        value: 40,
                    },
                    {
                        id: "balance",
                        value: 10,
                    },
                    {
                        id: "durability_max",
                        value: 4,
                    },
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [0],
            },
            {
                id: "1290021-craftman-2",
                name: "靈魂解放者鎖鏈鐮刃專用工匠改造",
                required: {
                    ep: 100,
                    gold: 88000,
                    gems: [],
                },
                abilities: [
                    { id: "attack_max", min: 5, max: 25 },
                    { id: "HP", min: 10, max: 50 },
                    { id: "LUK", min: 5, max: 30 },
                ],
                progress: [4],
            },
            {
                id: "1290021-13",
                name: "靈魂解放者鎖鏈鐮刃磨利刀刃 1",
                required: {
                    ep: 100,
                    gold: 125000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_min",
                        value: 50,
                    },
                    {
                        id: "attack_max",
                        value: 52,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                ],
                progress: [1],
            },
            {
                id: "1290021-14",
                name: "靈魂解放者鎖鏈鐮刃磨利刀刃 2",
                required: {
                    ep: 100,
                    gold: 125000,
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
                    {
                        id: "lance_piercing",
                        value: 1,
                    },
                ],
                progress: [1],
            },
        ],
        weaponCategory: "melee_physical",
    },
    {
        weaponId: 1650001,
        methods: [
            {
                id: "1650001-0",
                name: "寶石修復1",
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
                id: "1650001-1",
                name: "魔杖寶石改造1",
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
                id: "1650001-2",
                name: "自然力凝聚1",
                required: {
                    ep: 50,
                    gold: 77000,
                    gems: [],
                },
                abilities: [{ id: "party_healing_skill", value: 10 }],
                progress: [1],
            },
            {
                id: "1650001-3",
                name: "自然力凝聚2",
                required: {
                    ep: 50,
                    gold: 77000,
                    gems: [],
                },
                abilities: [{ id: "healing_skill", value: 10 }],
                progress: [1],
            },
            {
                id: "1650001-4",
                name: "自然力共鳴3",
                required: {
                    ep: 70,
                    gold: 99500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 11,
                    },
                ],
                progress: [2],
            },
            {
                id: "1650001-5",
                name: "自然力共鳴4",
                required: {
                    ep: 80,
                    gold: 105000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 15,
                    },
                ],
                progress: [3],
            },
            {
                id: "1650001-6",
                name: "自然力共鳴5",
                required: {
                    ep: 100,
                    gold: 110000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "manause_revised",
                        value: 20,
                    },
                ],
                progress: [4],
            },
            {
                id: "1650001-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 90000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "HP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "MP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "INT",
                        min: 5,
                        max: 80,
                    },
                ],
                progress: [4],
            },
            {
                id: "1650001-8",
                name: "靈魂解放者治癒魔杖封印解除1",
                required: {
                    ep: 100,
                    gold: 130000,
                    gems: [],
                },
                abilities: [{ id: "party_healing_skill", value: 20 }],
                progress: [0],
            },
            {
                id: "1650001-9",
                name: "靈魂解放者治癒魔杖封印解除2",
                required: {
                    ep: 100,
                    gold: 130000,
                    gems: [],
                },
                abilities: [{ id: "healing_skill", value: 20 }],
                progress: [0],
            },
        ],
        weaponCategory: "healing_wand",
    },
    {
        weaponId: 1400011,
        methods: [
            {
                id: "1400011-0",
                name: "寶石修復1",
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1400011-1",
                name: "寶石防衛改造",
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
                progress: [3],
            },
            // todo: 爬下來有重複
            // {
            //     id: "1400011-2",
            //     name: "寶石修復1",
            //     required: {
            //         ep: 100,
            //         gold: 13000,
            //         gems: [],
            //     },
            //     abilities: [
            //         {
            //             id: "durability_max",
            //             value: 2,
            //         },
            //     ],
            //     progress: [3],
            // },
            // {
            //     id: "1400011-3",
            //     name: "寶石防衛改造",
            //     required: {
            //         ep: 80,
            //         gold: 7300,
            //         gems: [
            //             {
            //                 name: "海藍寶石",
            //                 requiredSize: 5,
            //             },
            //             {
            //                 name: "綠寶石",
            //                 requiredSize: 3,
            //             },
            //             {
            //                 name: "碧玉",
            //                 requiredSize: 1,
            //             },
            //         ],
            //     },
            //     abilities: [
            //         {
            //             id: "defense",
            //             value: 2,
            //         },
            //     ],
            //     progress: [3],
            // },
            {
                id: "1400011-craftman-1",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "SP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "defense",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "protection",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "WIL",
                        min: 5,
                        max: 10,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400011-5",
                name: "表面強化",
                required: {
                    ep: 40,
                    gold: 54000,
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
                id: "1400011-6",
                name: "靈魂解放者盾牌別改造1",
                required: {
                    ep: 55,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400011-7",
                name: "靈魂解放者盾牌別改造2",
                required: {
                    ep: 55,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_ranged",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400011-8",
                name: "靈魂解放者盾牌別改造3",
                required: {
                    ep: 55,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_magic",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400011-9",
                name: "靈魂解放者盾牌專用改造1",
                required: {
                    ep: 100,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "defense",
                        value: 10,
                    },
                    {
                        id: "immune_melee",
                        value: 15,
                    },
                    {
                        id: "immune_ranged",
                        value: 15,
                    },
                    {
                        id: "immune_magic",
                        value: 15,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400011-10",
                name: "靈魂解放者盾牌專用改造2",
                required: {
                    ep: 100,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "protection",
                        value: 1,
                    },
                    {
                        id: "immune_melee",
                        value: 15,
                    },
                    {
                        id: "immune_ranged",
                        value: 15,
                    },
                    {
                        id: "immune_magic",
                        value: 15,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400011-craftman-2",
                name: "靈魂解放者之盾專用工匠改造",
                required: {
                    ep: 80,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "SP",
                        min: 3,
                        max: 6,
                    },
                    {
                        id: "defense",
                        min: 2,
                        max: 4,
                    },
                    {
                        id: "protection",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "WIL",
                        min: 7,
                        max: 20,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400011-12",
                name: "靈魂解放者盾牌寶石修理",
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
                progress: [3],
            },
            {
                id: "1400011-13",
                name: "寶石改造",
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
                        value: 5,
                    },
                ],
                progress: [3],
            },
        ],
        weaponCategory: "shield",
    },
    {
        weaponId: 1400012,
        methods: [
            {
                id: "1400012-0",
                name: "寶石修復1",
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1400012-1",
                name: "寶石防衛改造",
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
                progress: [3],
            },
            // todo: 爬下來有重複
            // {
            //     id: "1400012-2",
            //     name: "寶石修復1",
            //     required: {
            //         ep: 100,
            //         gold: 13000,
            //         gems: [],
            //     },
            //     abilities: [
            //         {
            //             id: "durability_max",
            //             value: 2,
            //         },
            //     ],
            //     progress: [3],
            // },
            // {
            //     id: "1400012-3",
            //     name: "寶石防衛改造",
            //     required: {
            //         ep: 80,
            //         gold: 7300,
            //         gems: [
            //             {
            //                 name: "海藍寶石",
            //                 requiredSize: 5,
            //             },
            //             {
            //                 name: "綠寶石",
            //                 requiredSize: 3,
            //             },
            //             {
            //                 name: "碧玉",
            //                 requiredSize: 1,
            //             },
            //         ],
            //     },
            //     abilities: [
            //         {
            //             id: "defense",
            //             value: 2,
            //         },
            //     ],
            //     progress: [3],
            // },
            {
                id: "1400012-craftman-1",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 20000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "SP",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "defense",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "protection",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "WIL",
                        min: 5,
                        max: 10,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400012-5",
                name: "靈魂解放者戰士盾牌別改造 1",
                required: {
                    ep: 55,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_melee",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400012-6",
                name: "靈魂解放者戰士盾牌別改造 2",
                required: {
                    ep: 55,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_ranged",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400012-7",
                name: "靈魂解放者戰士盾牌別改造 3",
                required: {
                    ep: 55,
                    gold: 80000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "immune_magic",
                        value: 10,
                    },
                ],
                progress: [0, 1, 2],
            },
            {
                id: "1400012-8",
                name: "靈魂解放者戰士盾牌專用改造1",
                required: {
                    ep: 100,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "defense",
                        value: 10,
                    },
                    {
                        id: "immune_melee",
                        value: 15,
                    },
                    {
                        id: "immune_ranged",
                        value: 15,
                    },
                    {
                        id: "immune_magic",
                        value: 15,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400012-9",
                name: "靈魂解放者戰士盾牌專用改造2",
                required: {
                    ep: 100,
                    gold: 60000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "protection",
                        value: 1,
                    },
                    {
                        id: "immune_melee",
                        value: 15,
                    },
                    {
                        id: "immune_ranged",
                        value: 15,
                    },
                    {
                        id: "immune_magic",
                        value: 15,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400012-craftman",
                name: "工匠改造",
                required: {
                    ep: 80,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "protection",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "magic_defense",
                        min: 2,
                        max: 5,
                    },
                    {
                        id: "magic_protection",
                        min: 1,
                        max: 3,
                    },
                    {
                        id: "HP",
                        min: 10,
                        max: 50,
                    },
                ],
                progress: [2],
            },
            {
                id: "1400012-11",
                name: "靈魂解放者戰士盾牌寶石修理",
                required: {
                    ep: 80,
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
                        id: "protection",
                        value: 5,
                    },
                ],
                progress: [3],
            },
        ],
        weaponCategory: "shield",
    },
    {
        weaponId: 1440006,
        methods: [
            {
                id: "1440006-0",
                name: "寶石修復1",
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1440006-1",
                name: "寶石修復1",
                required: {
                    ep: 100,
                    gold: 13000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "durability_max",
                        value: 2,
                    },
                ],
                progress: [3],
            },
            {
                id: "1440006-2",
                name: "更換扳機",
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
                progress: [0, 1, 2],
            },
            {
                id: "1440006-3",
                name: "{0}的輕量化1",
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
                progress: [0, 1, 2],
            },
            {
                id: "1440006-4",
                name: "{0}的輕量化2",
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
                progress: [1, 2],
            },
            {
                id: "1440006-5",
                name: "{0}的輕量化3",
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
                progress: [2],
            },
            {
                id: "1440006-6",
                name: "盾牌鋼瓶特殊改造 1",
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
                id: "1440006-7",
                name: "盾牌鋼瓶特殊改造 2",
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
                id: "1440006-8",
                name: "盾牌鋼瓶特殊改造 3",
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
                id: "1440006-9",
                name: "魔法改造 1",
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
                progress: [0, 1, 2],
            },
            {
                id: "1440006-10",
                name: "魔法改造 2",
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
                progress: [1, 2],
            },
            {
                id: "1440006-11",
                name: "魔法改造 3",
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
                progress: [2],
            },
            // {
            //     id: "1440006-12",
            //     name: "拜斯式盔甲強化",
            //     required: {
            //         ep: 80,
            //         gold: 80000,
            //         gems: [],
            //     },
            //     abilities: [
            //         {
            //             id: "durability_max",
            //             value: -8,
            //         },
            //         {
            //             id: "balance",
            //             value: 8,
            //         },
            //         {
            //             id: "defense",
            //             value: 10,
            //         },
            //         {
            //             id: "protection",
            //             value: 5,
            //         },
            //         {
            //             id: "magic_defense",
            //             value: 8,
            //         },
            //         {
            //             id: "magic_protection",
            //             value: 3,
            //         },
            //     ],
            //     progress: [],
            // },
            // {
            //     id: "1440006-craftman-1",
            //     name: "工匠改造",
            //     required: {
            //         ep: 100,
            //         gold: 45000,
            //         gems: [],
            //     },
            //     abilities: [
            //         {
            //             id: "defense",
            //             min: 2,
            //             max: 15,
            //         },
            //         {
            //             id: "protection",
            //             min: 1,
            //             max: 10,
            //         },
            //     ],
            //     progress: [],
            // },
            {
                id: "1440006-14",
                name: "寶石修理",
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
                progress: [3],
            },
            {
                id: "1440006-15",
                name: "修理寶石 1",
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
                progress: [3],
            },
            {
                id: "1440006-craftman-2",
                name: "工匠改造",
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
                id: "1440006-17",
                name: "靈魂解放者盾牌鋼瓶特別改造 1",
                required: {
                    ep: 50,
                    gold: 60000,
                    gems: [],
                },
                abilities: [{ id: "immune_melee", value: 10 }],
                progress: [2],
            },
            {
                id: "1440006-18",
                name: "靈魂解放者盾牌鋼瓶特別改造 2",
                required: {
                    ep: 50,
                    gold: 60000,
                    gems: [],
                },
                abilities: [{ id: "immune_ranged", value: 10 }],
                progress: [2],
            },
            {
                id: "1440006-19",
                name: "靈魂解放者盾牌鋼瓶特別改造 3",
                required: {
                    ep: 50,
                    gold: 60000,
                    gems: [],
                },
                abilities: [{ id: "immune_magic", value: 10 }],
                progress: [2],
            },
            {
                id: "1440006-20",
                name: "靈魂解放者盾牌鋼瓶專用改造1",
                required: {
                    ep: 100,
                    gold: 84000,
                    gems: [],
                },
                abilities: [
                    { id: "fire_alchemy_damage", value: 40 },
                    { id: "immune_melee", value: 5 },
                    { id: "immune_ranged", value: 5 },
                    { id: "immune_magic", value: 5 },
                ],
                progress: [0],
            },
            {
                id: "1440006-21",
                name: "靈魂解放者盾牌鋼瓶專用改造2",
                required: {
                    ep: 100,
                    gold: 84000,
                    gems: [],
                },
                abilities: [
                    { id: "water_alchemy_damage", value: 40 },
                    { id: "immune_melee", value: 5 },
                    { id: "immune_ranged", value: 5 },
                    { id: "immune_magic", value: 5 },
                ],
                progress: [0],
            },
            {
                id: "1440006-22",
                name: "靈魂解放者盾牌鋼瓶專用改造3",
                required: {
                    ep: 100,
                    gold: 84000,
                    gems: [],
                },
                abilities: [
                    { id: "earth_alchemy_damage", value: 40 },
                    { id: "immune_melee", value: 5 },
                    { id: "immune_ranged", value: 5 },
                    { id: "immune_magic", value: 5 },
                ],
                progress: [0],
            },
            {
                id: "1440006-23",
                name: "靈魂解放者盾牌鋼瓶專用改造4",
                required: {
                    ep: 100,
                    gold: 84000,
                    gems: [],
                },
                abilities: [
                    { id: "wind_alchemy_damage", value: 40 },
                    { id: "immune_melee", value: 5 },
                    { id: "immune_ranged", value: 5 },
                    { id: "immune_magic", value: 5 },
                ],
                progress: [0],
            },
            {
                id: "1440006-craftman",
                name: "靈魂解放者盾牌鋼瓶專用工匠改造",
                required: {
                    ep: 100,
                    gold: 65000,
                    gems: [],
                },
                abilities: [
                    { id: "HP", min: 10, max: 20 },
                    { id: "MP", min: 20, max: 65 },
                    { id: "SP", min: 8, max: 20 },
                    { id: "critical", min: 5, max: 12 },
                ],
                progress: [2],
            },
            {
                id: "1440006-25",
                name: "寶石修理",
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
                        value: 3,
                    },
                ],
                progress: [3],
            },
        ],
        weaponCategory: "shield_cylinder",
    },
    {
        weaponId: 1060011,
        methods: [
            {
                id: "1060011-0",
                name: "寶石修復1",
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
            {
                id: "1060011-1",
                name: "更換扳機",
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
            // {
            //     id: "1060011-2",
            //     name: "{0}的輕量化1",
            //     required: {
            //         ep: 5,
            //         gold: 500,
            //         gems: [],
            //     },
            //     abilities: [],
            //     progress: [0, 1, 2, 3, 4],
            // },
            // {
            //     id: "1060011-3",
            //     name: "{0}的輕量化2",
            //     required: {
            //         ep: 8,
            //         gold: 800,
            //         gems: [],
            //     },
            //     abilities: [],
            //     progress: [1, 2, 3, 4],
            // },
            // {
            //     id: "1060011-4",
            //     name: "{0}的輕量化3",
            //     required: {
            //         ep: 12,
            //         gold: 1200,
            //         gems: [],
            //     },
            //     abilities: [],
            //     progress: [2, 3, 4],
            // },
            // {
            //     id: "1060011-5",
            //     name: "{0}的輕量化4",
            //     required: {
            //         ep: 20,
            //         gold: 2000,
            //         gems: [],
            //     },
            //     abilities: [],
            //     progress: [3, 4],
            // },
            // {
            //     id: "1060011-6",
            //     name: "{0}的輕量化5",
            //     required: {
            //         ep: 30,
            //         gold: 7000,
            //         gems: [],
            //     },
            //     abilities: [],
            //     progress: [4],
            // },
            {
                id: "1060011-7",
                name: "四大屬性啟動2",
                required: {
                    ep: 30,
                    gold: 20000,
                    gems: [],
                },
                abilities: [{ id: "all_alchemy_damage", value: 5 }],
                progress: [1],
            },
            {
                id: "1060011-8",
                name: "四大屬性啟動3",
                required: {
                    ep: 42,
                    gold: 32000,
                    gems: [],
                },
                abilities: [{ id: "all_alchemy_damage", value: 10 }],
                progress: [2],
            },
            {
                id: "1060011-9",
                name: "四大屬性啟動4",
                required: {
                    ep: 50,
                    gold: 40000,
                    gems: [],
                },
                abilities: [{ id: "all_alchemy_damage", value: 15 }],
                progress: [3],
            },
            {
                id: "1060011-10",
                name: "四大屬性啟動5",
                required: {
                    ep: 60,
                    gold: 70000,
                    gems: [],
                },
                abilities: [{ id: "all_alchemy_damage", value: 7 }],
                progress: [4],
            },
            {
                id: "1060011-11",
                name: "火屬性啟動1",
                required: {
                    ep: 30,
                    gold: 20000,
                    gems: [],
                },
                abilities: [{ id: "fire_alchemy_damage", value: 20 }],
                progress: [1],
            },
            {
                id: "1060011-12",
                name: "火屬性啟動2",
                required: {
                    ep: 42,
                    gold: 32000,
                    gems: [],
                },
                abilities: [{ id: "fire_alchemy_damage", value: 40 }],
                progress: [2],
            },
            {
                id: "1060011-13",
                name: "火屬性啟動3",
                required: {
                    ep: 50,
                    gold: 40000,
                    gems: [],
                },
                abilities: [{ id: "fire_alchemy_damage", value: 60 }],
                progress: [3],
            },
            {
                id: "1060011-14",
                name: "火屬性啟動4",
                required: {
                    ep: 60,
                    gold: 70000,
                    gems: [],
                },
                abilities: [{ id: "fire_alchemy_damage", value: 20 }],
                progress: [4],
            },
            {
                id: "1060011-15",
                name: "水屬性啟動1",
                required: {
                    ep: 30,
                    gold: 20000,
                    gems: [],
                },
                abilities: [{ id: "water_alchemy_damage", value: 20 }],
                progress: [1],
            },
            {
                id: "1060011-16",
                name: "水屬性啟動2",
                required: {
                    ep: 42,
                    gold: 32000,
                    gems: [],
                },
                abilities: [{ id: "water_alchemy_damage", value: 40 }],
                progress: [2],
            },
            {
                id: "1060011-17",
                name: "水屬性啟動3",
                required: {
                    ep: 50,
                    gold: 40000,
                    gems: [],
                },
                abilities: [{ id: "water_alchemy_damage", value: 60 }],
                progress: [3],
            },
            {
                id: "1060011-18",
                name: "水屬性啟動4",
                required: {
                    ep: 60,
                    gold: 70000,
                    gems: [],
                },
                abilities: [{ id: "water_alchemy_damage", value: 80 }],
                progress: [4],
            },
            {
                id: "1060011-19",
                name: "土屬性啟動1",
                required: {
                    ep: 30,
                    gold: 20000,
                    gems: [],
                },
                abilities: [{ id: "earth_alchemy_damage", value: 20 }],
                progress: [1],
            },
            {
                id: "1060011-20",
                name: "土屬性啟動2",
                required: {
                    ep: 42,
                    gold: 32000,
                    gems: [],
                },
                abilities: [{ id: "earth_alchemy_damage", value: 40 }],
                progress: [2],
            },
            {
                id: "1060011-21",
                name: "土屬性啟動3",
                required: {
                    ep: 50,
                    gold: 40000,
                    gems: [],
                },
                abilities: [{ id: "earth_alchemy_damage", value: 60 }],
                progress: [3],
            },
            {
                id: "1060011-22",
                name: "土屬性啟動4",
                required: {
                    ep: 60,
                    gold: 70000,
                    gems: [],
                },
                abilities: [{ id: "earth_alchemy_damage", value: 80 }],
                progress: [4],
            },
            {
                id: "1060011-23",
                name: "風屬性啟動1",
                required: {
                    ep: 30,
                    gold: 20000,
                    gems: [],
                },
                abilities: [{ id: "wind_alchemy_damage", value: 20 }],
                progress: [1],
            },
            {
                id: "1060011-24",
                name: "風屬性啟動2",
                required: {
                    ep: 42,
                    gold: 32000,
                    gems: [],
                },
                abilities: [{ id: "wind_alchemy_damage", value: 40 }],
                progress: [2],
            },
            {
                id: "1060011-25",
                name: "風屬性啟動3",
                required: {
                    ep: 50,
                    gold: 40000,
                    gems: [],
                },
                abilities: [{ id: "wind_alchemy_damage", value: 60 }],
                progress: [3],
            },
            {
                id: "1060011-26",
                name: "風屬性啟動4",
                required: {
                    ep: 60,
                    gold: 70000,
                    gems: [],
                },
                abilities: [{ id: "wind_alchemy_damage", value: 80 }],
                progress: [4],
            },
            {
                id: "1060011-27",
                name: "靈魂解放者鋼瓶專用改造1",
                required: {
                    ep: 100,
                    gold: 170000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "HP",
                        value: 70,
                    },
                    {
                        id: "MP",
                        value: 70,
                    },
                    {
                        id: "SP",
                        value: 70,
                    },
                    {
                        id: "critical",
                        value: 15,
                    },
                    {
                        id: "all_alchemy_damage",
                        value: 70,
                    },
                ],
                progress: [0],
            },
            {
                id: "1060011-28",
                name: "靈魂解放者鋼瓶專用改造2",
                required: {
                    ep: 100,
                    gold: 170000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 15,
                    },
                    {
                        id: "lance_piercing",
                        value: 2,
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
                    {
                        id: "all_alchemy_damage",
                        value: 20,
                    },
                ],
                progress: [0],
            },
            {
                id: "1060011-29-craftman",
                name: "靈魂解放者鋼瓶專用工匠改造",
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "all_alchemy_damage",
                        min: 25,
                        max: 25,
                    },
                    { id: "HP", min: 30, max: 50 },
                    { id: "MP", min: 40, max: 70 },
                    { id: "SP", min: 30, max: 50 },
                ],
                progress: [4],
            },
        ],
        weaponCategory: "cylinder",
    },
    {
        weaponId: 1080048,
        methods: [
            {
                id: "1080048-0",
                name: "寶石修復",
                required: {
                    ep: 100,
                    gold: 20000,
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
                        value: 2,
                    },
                ],
                progress: [5],
            },
            {
                id: "1080048-1",
                name: "寶石改造1",
                required: {
                    ep: 100,
                    gold: 25000,
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
                abilities: [{ id: "music_buff_bonus", value: 2 }],
                progress: [5],
            },
            {
                id: "1080048-2",
                name: "乾燥",
                required: {
                    ep: 15,
                    gold: 1500,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 1,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                    {
                        id: "balance",
                        value: 1,
                    },
                    { id: "music_buff_bonus", value: 1 },
                ],
                progress: [0],
            },
            {
                id: "1080048-3",
                name: "更換零件",
                required: {
                    ep: 20,
                    gold: 4000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                    { id: "music_buff_bonus", value: 1 },
                ],
                progress: [1],
            },
            {
                id: "1080048-4",
                name: "內部清潔",
                required: {
                    ep: 20,
                    gold: 12000,
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
                    {
                        id: "critical",
                        value: -1,
                    },
                    {
                        id: "balance",
                        value: 1,
                    },
                    { id: "music_buff_bonus", value: 1 },
                ],
                progress: [2],
            },
            {
                id: "1080048-5",
                name: "調整共鳴",
                required: {
                    ep: 30,
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
                        value: -1,
                    },
                    {
                        id: "balance",
                        value: 1,
                    },
                    { id: "music_buff_bonus", value: 2 },
                ],
                progress: [3],
            },
            {
                id: "1080048-6",
                name: "俐落的收尾",
                required: {
                    ep: 70,
                    gold: 45000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 7,
                    },
                    {
                        id: "balance",
                        value: 8,
                    },
                    { id: "music_buff_bonus", value: 3 },
                ],
                progress: [4],
            },
            {
                id: "1080048-7-craftman",
                name: "工匠改造",
                required: {
                    ep: 100,
                    gold: 65000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "最小傷害",
                        min: 1,
                        max: 2,
                    },
                    {
                        id: "平衡",
                        min: 4,
                        max: 12,
                    },
                ],
                progress: [4],
            },
            {
                id: "1080048-8",
                name: "靈魂解放者里拉零件更換",
                required: {
                    ep: 70,
                    gold: 70000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                    {
                        id: "music_buff_duration",
                        value: 4,
                    },
                ],
                progress: [1],
            },
            {
                id: "1080048-9",
                name: "靈魂解放者里拉內部清理",
                required: {
                    ep: 70,
                    gold: 70000,
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
                    {
                        id: "critical",
                        value: -1,
                    },
                    {
                        id: "balance",
                        value: 1,
                    },
                    {
                        id: "music_buff_duration",
                        value: 6,
                    },
                ],
                progress: [2],
            },
            {
                id: "1080048-10",
                name: "靈魂解放者里拉調整共鳴",
                required: {
                    ep: 70,
                    gold: 70000,
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
                        value: -1,
                    },
                    {
                        id: "balance",
                        value: 1,
                    },
                    {
                        id: "music_buff_duration",
                        value: 9,
                    },
                ],
                progress: [3],
            },
            {
                id: "1080048-11",
                name: "靈魂解放者里拉封印解除",
                required: {
                    ep: 100,
                    gold: 130000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "critical",
                        value: 10,
                    },
                    {
                        id: "balance",
                        value: 8,
                    },
                    {
                        id: "music_buff_bonus",
                        value: 11,
                    },
                    {
                        id: "music_buff_duration",
                        value: 5,
                    },
                ],
                progress: [0],
            },
            {
                id: "1080048-craftman-2",
                name: "靈魂解放者里拉專用工匠改造",
                required: {
                    ep: 100,
                    gold: 50000,
                    gems: [],
                },
                abilities: [
                    { id: "music_buff_bonus", min: 3, max: 6 },
                    { id: "attack_max", min: 6, max: 18 },
                    { id: "balance", min: 5, max: 15 },
                ],
                progress: [4],
            },
            {
                id: "1080048-13",
                name: "靈魂解放者里拉寶石修理1",
                required: {
                    ep: 100,
                    gold: 70000,
                    gems: [
                        {
                            name: "鑽石",
                            requiredSize: 5,
                        },
                        {
                            name: "托帕石",
                            requiredSize: 5,
                        },
                        {
                            name: "星彩藍寶石",
                            requiredSize: 5,
                        },
                    ],
                },
                abilities: [
                    {
                        id: "music_buff_duration",
                        value: 5,
                    },
                ],
                progress: [5],
            },
            {
                id: "1080048-14",
                name: "靈魂解放者里拉零件更換2",
                required: {
                    ep: 70,
                    gold: 70000,
                    gems: [],
                },
                abilities: [
                    {
                        id: "attack_max",
                        value: 1,
                    },
                    {
                        id: "attack_min",
                        value: 1,
                    },
                    {
                        id: "durability_max",
                        value: -1,
                    },
                    {
                        id: "critical",
                        value: -1,
                    },
                    {
                        id: "music_buff_bonus",
                        value: 3,
                    },
                ],
                progress: [1],
            },
        ],
        weaponCategory: "instrument",
    },
];
