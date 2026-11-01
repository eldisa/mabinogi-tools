// 秘法覺醒經驗（韓服資料，來源：mabi.labanyu.com/arcana/awakening-exp）

export const AWAKENING_MAX_LEVEL = 50;

// 各等級累積經驗，索引 = 等級 - 1
export const awakeningCumExp = [
    0, 700, 2135, 4306, 7214, 10859, 15241, 20360, 26215, 32807, 40136, 48202, 57005, 66545, 76822, 87835, 99585,
    112072, 125296, 139257, 153955, 169389, 185560, 202468, 220113, 238495, 257614, 277469, 298061, 319390, 341456,
    364259, 387799, 412076, 437089, 462839, 489326, 516550, 544511, 573209, 602643, 632814, 663722, 695367, 727749,
    760868, 794723, 829315, 864644, 900710,
];

// 可裝備符文詞數，索引 = 等級 - 1
export const awakeningOghamWordCount = [
    1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
];

// 覺醒技能 Rank（Lv.31 起），索引 = 等級 - 31
const skillRanks = ["F", "E", "D", "C", "B", "A", "9", "8", "7", "6", "6", "5", "5", "4", "4", "3", "3", "2", "2", "1"];
export const awakeningSkillRank = (level: number): string | undefined => skillRanks[level - 31];

export const levelFromExp = (exp: number) => {
    let lv = 1;
    while (lv < AWAKENING_MAX_LEVEL && awakeningCumExp[lv] <= exp) lv++;
    return lv;
};

export interface AwakeningDungeon {
    group: string;
    name: string;
    exp: number;
    // 每週預設通關次數
    weekly: number;
}

export const awakeningDungeons: AwakeningDungeon[] = [
    { group: "塔拉加赫", name: "一般", exp: 2500, weekly: 6 },
    { group: "布里萊赫", name: "1~3 階段", exp: 2000, weekly: 8 },
    { group: "布里萊赫", name: "信仰的裂痕", exp: 2200, weekly: 2 },
    { group: "格輪貝爾納", name: "簡單", exp: 1500, weekly: 0 },
    { group: "格輪貝爾納", name: "一般", exp: 1700, weekly: 0 },
    { group: "格輪貝爾納", name: "太古之冬", exp: 1900, weekly: 4 },
    { group: "喀輪巴斯", name: "簡單", exp: 1500, weekly: 0 },
    { group: "喀輪巴斯", name: "一般", exp: 1700, weekly: 10 },
    { group: "喀輪巴斯", name: "深淵", exp: 2000, weekly: 0 },
    { group: "夢幻萊比", name: "一般", exp: 200, weekly: 0 },
    { group: "夢幻萊比", name: "夢中的誘惑", exp: 300, weekly: 0 },
    { group: "高困地下城 / 泰赫圖殷", name: "高困地下城", exp: 50, weekly: 0 },
    { group: "高困地下城 / 泰赫圖殷", name: "泰赫圖殷（一般）", exp: 50, weekly: 0 },
    { group: "高困地下城 / 泰赫圖殷", name: "泰赫圖殷（困難）", exp: 100, weekly: 0 },
];
