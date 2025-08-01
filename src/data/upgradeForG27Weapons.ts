import { UpgradeMethodsForWeapons } from "../types/Upgrade";

export const upgradeForG27Weapons: UpgradeMethodsForWeapons[] = [
    {
        weaponId: 1200043,
        methods: [
            {
                id: "1200043-1",
                name: "靈魂解放之刃專用改造1",
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
                name: "靈魂解放之刃專用改造2",
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
                    { id: "HP", min: 10, max: 30 },
                    { id: "STR", min: 30, max: 50 },
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
    },
];
