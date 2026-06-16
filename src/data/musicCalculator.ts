/**
 * 音樂計算機 — 戰場的序曲 效果計算
 * 資料來源 (演算法與選項):
 *   https://ccroxx.blogspot.com/2019/07/mabinogi-battlefield-effect.html
 *
 * 注意：部分選項擁有相同的 value（例如戰場序曲不同 R 等級、第二稱號等），
 * 因此元件以「選項索引 (index)」作為 v-model，計算時再解析為 value。
 */

export interface Option {
    value: number | string;
    label: string;
    /** 用於區分相同 value 的選項（僅供識別，計算不使用） */
    id?: string;
    isDisabled?: boolean;
}

export const battleSkillOptions: Option[] = [
    { value: 20, label: "Rank 1" },
    { value: 19, label: "Rank 2" },
    { value: 18, label: "Rank 3" },
    { value: 17, label: "Rank 4" },
    { value: 16, label: "Rank 5" },
    { value: 16, label: "Rank 6" },
    { value: 15, label: "Rank 7" },
    { value: 15, label: "Rank 8" },
    { value: 14, label: "Rank 9" },
    { value: 14, label: "Rank A" },
    { value: 13, label: "Rank B" },
    { value: 13, label: "Rank C" },
    { value: 12, label: "Rank D" },
    { value: 12, label: "Rank E" },
    { value: 11, label: "Rank F" },
    { value: 10, label: "Rank 練習" },
];

export const playSkillOptions: Option[] = [
    { value: 15, label: "Rank 1" },
    { value: 14, label: "Rank 2" },
    { value: 13, label: "Rank 3" },
    { value: 12, label: "Rank 4" },
    { value: 11, label: "Rank 5" },
    { value: 10, label: "Rank 6" },
    { value: 9, label: "Rank 7" },
    { value: 8, label: "Rank 8" },
    { value: 7, label: "Rank 9" },
    { value: 6, label: "Rank A" },
    { value: 5, label: "Rank B" },
    { value: 4, label: "Rank C" },
    { value: 3, label: "Rank D" },
    { value: 2, label: "Rank E" },
    { value: 1, label: "Rank F" },
    { value: 0, label: "Rank 練習" },
];

export const singSkillOptions: Option[] = [
    { value: 15, label: "Rank 1" },
    { value: 14, label: "Rank 2" },
    { value: 13, label: "Rank 3" },
    { value: 12, label: "Rank 4" },
    { value: 11, label: "Rank 5" },
    { value: 10, label: "Rank 6" },
    { value: 9, label: "Rank 7" },
    { value: 8, label: "Rank 8" },
    { value: 7, label: "Rank 9" },
    { value: 6, label: "Rank A" },
    { value: 5, label: "Rank B" },
    { value: 4, label: "Rank C" },
    { value: 3, label: "Rank D" },
    { value: 2, label: "Rank E" },
    { value: 1, label: "Rank F" },
    { value: 0, label: "Rank 練習" },
];

export const instrumentBaseOptions: Option[] = [
    { value: 0, label: "空手" },
    { value: 25, label: "靈魂解放者里拉 (+25)" },
    { value: 22, label: "靈魂解放者里拉 (+22)" },
    { value: 16, label: "惡魔黑色星期天 (+16)" },
    { value: 10, label: "里拉 (+10)" },
    { value: 8, label: "普通樂器 (+8)" },
];

export const instrumentPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 9, label: "複調 (+9)(6/11韓國測服調整)" },
    { value: 8, label: "複調 (+8)(6/11韓國測服調整)" },
    { value: 7, label: "複調 (+7)" },
    { value: 6, label: "複調 (+6)" },
    { value: 5, label: "複調/融合 (+5)" },
    { value: 4, label: "複調 (+4)" },
    { value: 3, label: "快板 / 開心的 (+3)" },
    { value: 2, label: "中板 (+2)" },
    { value: 1, label: "行板 (+1)" },
];

export const instrumentSuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 5, label: "節拍 (+5)(6/11韓國測服調整)" },
    { value: 4, label: "節拍 (+4)(6/11韓國測服調整)" },
    { value: 3, label: "節拍 (+3)" },
    { value: 2, label: "節拍 (+2)" },
    { value: 1, label: "和音 (+1)" },
];

const BREAKTHROUGH = "（樂器突破限定）";

// 樂器演奏效果：1~25 等級，超過 21 為樂器突破限定
export const reforgingPlayEffectOptions: Option[] = [
    { value: 0, label: "無" },
    ...Array.from({ length: 25 }, (_, i) => 25 - i).map((lv) => ({
        value: lv,
        label: `${lv}等級${lv >= 21 ? BREAKTHROUGH : ""}`,
    })),
];

// 樂器細工：1~13 等級，11~13 為樂器突破限定
const makeReforgeOptions = (): Option[] => [
    { value: 0, label: "無" },
    ...Array.from({ length: 13 }, (_, i) => 13 - i).map((lv) => ({
        value: lv / 100,
        label: `${lv}等級${lv >= 11 ? BREAKTHROUGH : ""}`,
    })),
];

export const reforgingNormalOptions = makeReforgeOptions();
export const reforgingExcellentOptions = makeReforgeOptions();
export const reforgingInspiringOptions = makeReforgeOptions();

export const accessoryPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 2, label: "活潑的 (+2)" },
    { value: 1, label: "行板 / 活潑的 (+1)" },
];

export const accessorySuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 1, label: "裝飾樂段 (+1)" },
];

// 飾品細工：1~4 等級，4 為樂器突破限定
const makeAccessoryReforgeOptions = (): Option[] => [
    { value: 0, label: "無" },
    ...Array.from({ length: 4 }, (_, i) => 4 - i).map((lv) => ({
        value: lv / 100,
        label: `${lv}等級${lv >= 4 ? BREAKTHROUGH : ""}`,
    })),
];

export const accessoryReforgeNormalOptions = makeAccessoryReforgeOptions();
export const accessoryReforgeExcellentOptions = makeAccessoryReforgeOptions();
export const accessoryReforgeInspiringOptions = makeAccessoryReforgeOptions();

export const headPrefixOptions: Option[] = [{ value: 0, label: "頭部接頭：無相關賦予" }];

export const headSuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 3, label: "合唱 (+3)" },
    { value: 2, label: "合唱 (+2)" },
];

export const bodyPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 8, label: "清雅的 (+8)" },
    { value: 7, label: "清雅的 (+7)" },
    { value: 6, label: "清雅的 / 奏鳴曲 (+6)" },
    { value: 5, label: "清雅的 / 奏鳴曲 (+5)" },
    { value: 4, label: "清雅的 / 奏鳴曲 (+4)" },
    { value: 3, label: "清雅的 / 安可 (+3)" },
];

export const bodySuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 3, label: "輕聲細語 (+3)" },
    { value: 2, label: "輕聲細語 (+2)" },
    { value: 1, label: "輕聲細語 (+1)" },
];

export const handPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 4, label: "技巧的 (+4)" },
    { value: 3, label: "技巧的 (+3)" },
    { value: 2, label: "技巧的 / 獨奏 (+2)" },
    { value: 1, label: "技巧的 (+1)" },
];

export const handSuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 2, label: "音樂家 (+2)" },
    { value: 1, label: "音樂家 (+1)" },
];

export const footPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 4, label: "技巧的 (+4)" },
    { value: 3, label: "技巧的 (+3)" },
    { value: 2, label: "技巧的 / 獨奏 (+2)" },
    { value: 1, label: "技巧的 (+1)" },
];

export const footSuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 2, label: "音樂家 (+2)" },
    { value: 1, label: "音樂家 (+1)" },
];

export const wingPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 5, label: "艾伊洛 / 伊卡洛斯 (+5)" },
    { value: 4, label: "伊卡洛斯 (+4)" },
    { value: 3, label: "伊卡洛斯 (+3)" },
    { value: 2, label: "伊卡洛斯 (+2)" },
];

export const wingSuffixOptions: Option[] = [{ value: 0, label: "翅膀接尾：無相關賦予" }];

// 穆利亞斯的遺物 魔力賦予（id 21696 / 31792）
export const relicPrefixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 1, label: "單純的 (音樂效果 +1)" },
];

// 禮物：戰場的序曲 / 活潑板攻擊力 +0.3%（最終 % 加成，value=3 代表 0.3%）
export const relicSuffixOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 3, label: "禮物 (戰場序曲攻擊 +0.3%)" },
];

export const titleOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 8, label: "戰場的序曲大師 (+8)" },
    { value: 8, label: "音樂家 (+8)(改版後)" },
    { value: 5, label: "音樂家 (+5)" },
];

export const secondTitleOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 13, label: "歐哈德 (+13, 有祕法)" },
    { value: 12, label: "特別的夢幻之花 (+12)" },
    { value: 11, label: "特別甜蜜的皇家茶杯組合 / 黃色變異體碎片 (+11)" },
    { value: 10, label: "休憩的圖樣 / 皇家企鵝 / 朋友  (+10)" },
    { value: 9, label: "特殊紫色的吟遊詩人 / 極強的 / 跟卡泰爾一起  (+9)" },
    { value: 8, label: "摩勒愛德 / 里葆娜 / DIVA / 強而有力的 / 梅溫 / 特別太陽光彩 / 特別闇黑氣息(+8)" },
    { value: 7, label: "極弱的 / 娜歐特派員 (+7)" },
    { value: 5, label: "闇黑氣息 / 夢幻和音 / 梅溫 (+5)" },
    { value: 4, label: "米羅舞兒 (+4)" },
    { value: 3, label: "其他二稱 +3" },
    { value: 2, label: "其他二稱 +2" },
    { value: 1, label: "人氣王 (+1)" },
];

export const farmModelOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 5, label: "浪漫農場特殊場景傑作 Vol.4 (+5)" },
    { value: 4, label: "歐哈德模型 (+4)" },
    { value: 3, label: "太多了 自己查...(+3)" },
    { value: 2, label: "黛伊爾布拉模型 (+2)" },
    { value: 1, label: "大櫻花樹 / 跑跑卡丁車睏寶模型(黃色) (+1)" },
];

export const extraFarmModelOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 4, label: "浪漫農場雛菊特別飾品(隨機強化，要確認數值) (+4)" },
    { value: 3, label: "莎伊芙特別模型 (+3)" },
    { value: 2, label: "詩又特別模型 /伊魯夏的祭壇 (+2)" },
    { value: 1, label: "夢幻回憶黃金獎盃 (+1)" },
];

export const muliasHolyWaterOptions: Option[] = [
    { value: 0, label: "穆里亞斯聖水：無" },
    { value: 7, label: "穆里亞斯聖水：(+7)" },
    { value: 6, label: "穆里亞斯聖水：(+6)" },
    { value: 5, label: "穆里亞斯聖水：(+5)" },
    { value: 4, label: "穆里亞斯聖水：(+4)" },
    { value: 3, label: "穆里亞斯聖水：(+3)" },
    { value: 2, label: "穆里亞斯聖水：(+2)" },
    { value: 1, label: "穆里亞斯聖水：(+1)" },
];

export const fluaCrownOptions: Option[] = [
    { value: 0, label: "芙露亞的草葉頭冠：無" },
    { value: 4, label: "芙露亞的草葉頭冠 (+4)" },
    { value: 3, label: "芙露亞的草葉頭冠 (+3)" },
    { value: 2, label: "芙露亞的草葉頭冠 (+2)" },
];

export const specialUpgradeOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 0.005, label: "SR 1" },
    { value: 0.01, label: "SR 2" },
    { value: 0.015, label: "SR 3" },
    { value: 0.023, label: "SR 4" },
    { value: 0.03, label: "SR 5" },
    { value: 0.038, label: "SR 6" },
    { value: 0.045, label: "SR 7" },
    { value: 0.055, label: "SR 8（僅靈魂里拉）", isDisabled: true },
];

export const setEffectOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 5, label: "熾天使歌唱手部裝飾 (+5)" },
    { value: 3, label: "特別的吟遊詩人浪漫服裝 (+3)" },
];

export const fairyDragonOptions: Option[] = [
    { value: 0, label: "寵物精靈龍在場：無" },
    { value: "A", label: "精靈龍：紅炎的精靈龍" },
    { value: "B", label: "精靈龍：翠草/蒼冰/原初的精靈龍" },
];

export const dollOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 1, label: "杜巴頓名流 / 塔拉王城舞會組合娃娃背包" },
    { value: 2, label: "秘法火焰組合娃娃背包" },
];

export const bugleOptions: Option[] = [
    { value: 0, label: "無" },
    { value: 3, label: "柯勒斐雷的喇叭" },
    { value: 5, label: "柯勒斐雷的大喇叭" },
];

/** 開關效果固定加成值 */
export const switchConst: Record<string, number> = {
    master: 5, // 一代宗師吟遊詩人
    arcana: 3, // 聖詠者同步
    astro: 2, // 戀人卡
    farmTool: 1, // 寵物小屋雲朵坐墊
    couple: 1, // 玫瑰情侶手鍊 / 水晶婚戒
    silkWing: 1, // 特別的優雅絲緞翅膀
    potion: 1, // 音樂強化藥水
};
