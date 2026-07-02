// 祕法組合（오검 조합）查詢資料
// 資料來源：labanyu 韓服工具站，翻譯為繁中，圖片熱連結外站 CDN
// 註：部分技能/點數效果資料待補

const CDN = "https://tacask-cdn.com/mabi-labanyu/web-upload";

export interface ComboSkillButton {
    name: string; // 繁中技能名
    icon?: string; // 圖示 URL
    primary?: boolean; // 目前選中/主要組合技
    disabled?: boolean; // 未公開
}

export interface WordTile {
    label: string; // 詞條格文字
    color?: string; // 背景色（highlight）
}

// 點數效果：某技能在某點數下的說明
export interface PointEffect {
    title: string; // 例：暴風雪：過冷卻
    lines: string[]; // 說明段落
}

export interface ComboEffectRow {
    category: "祕法" | "主要才能" | "屬性";
    special?: boolean; // 祕法（特殊五劍專用）標紅
    option: string; // 選項說明
    skillName?: string; // 連結技能名
    skillIcon?: string; // 技能圖示
    base: string; // 個別最大倍率
    comboMax?: string; // 組合發動時最大
    noComboMax?: string; // 組合未發動時最大
}

export interface ArcanaCombo {
    id: string;
    name: string; // 祕法名（繁中）
    icon?: string;
    comboSkills: ComboSkillButton[];
    wordTiles: WordTile[];
    basicImage?: string; // 基本技能使用示意
    comboImage?: string; // 組合技能使用示意
    points: number[]; // 可選點數（如 5~9）
    activePoint: number; // 預設選中的點數
    // 以「技能名」對應點數效果（目前僅有選中技能的資料）
    pointEffects: Record<string, PointEffect>;
    effectTable: ComboEffectRow[];
}

export const arcanaCombos: ArcanaCombo[] = [
    {
        id: "dark_mage",
        name: "黑魔法師",
        icon: `${CDN}/img-1761974539533.webp`,
        comboSkills: [
            { name: "暴風雪", icon: `${CDN}/img-1762278428014.webp`, primary: true },
            { name: "爆裂突刺", icon: `${CDN}/img-1762278426208.webp` },
            { name: "未公開", disabled: true },
        ],
        wordTiles: [
            { label: "貝赫", color: "#f59b9b" },
            { label: "斯特拉夫" },
            { label: "伊蘭德" },
        ],
        basicImage: `${CDN}/img-1782748902126.webp`,
        comboImage: `${CDN}/img-1782749387445.webp`,
        points: [5, 6, 7, 8, 9],
        activePoint: 9,
        pointEffects: {
            暴風雪: {
                title: "暴風雪：過冷卻",
                lines: [
                    "以原攻擊持續時間內傷害總合的 130%",
                    "對原攻擊範圍內的敵人進行 1 次攻擊",
                    "",
                    "造成傷害並將敵人擊退向中心",
                    "消耗 3 點多爾卡",
                    "",
                    "對被擊中的敵人賦予過冷卻 Debuff",
                    "過冷卻狀態的敵人硬直 12 秒",
                    "對過冷卻狀態的敵人使用爆裂突刺、電氣鎖鏈、",
                    "箭系魔法、雷擊／冰矛／火球時，",
                    "以該技能最終傷害的 150% 傷害攻擊",
                    "過冷卻狀態解除時，造成暴風雪最終傷害的",
                    "70% 追加傷害",
                    "",
                    "冷卻時間 60 秒",
                ],
            },
        },
        effectTable: [
            { category: "祕法", special: true, option: "爆裂突刺 火 最大傷害倍率增加", skillName: "爆裂突刺", skillIcon: `${CDN}/img-1762278426208.webp`, base: "250%", comboMax: "750%", noComboMax: "1250%" },
            { category: "祕法", special: true, option: "電氣鎖鏈 電擊 最大傷害倍率增加", skillName: "電氣鎖鏈", skillIcon: `${CDN}/img-1762278427071.webp`, base: "20%", comboMax: "60%", noComboMax: "100%" },
            { category: "祕法", special: true, option: "暴風雪 每秒冰 最大傷害倍率增加", skillName: "暴風雪", skillIcon: `${CDN}/img-1762278428014.webp`, base: "35%", comboMax: "105%", noComboMax: "175%" },
            { category: "祕法", special: true, option: "潛伏點火 火 最大傷害倍率增加", skillName: "潛伏點火", skillIcon: `${CDN}/img-1782350228756.webp`, base: "300%", comboMax: "900%", noComboMax: "1500%" },
            { category: "主要才能", option: "精通火魔法 傷害倍率增加", skillName: "精通火魔法", skillIcon: `${CDN}/img-1762278219232.webp`, base: "1%", comboMax: "5%", noComboMax: "5%" },
            { category: "主要才能", option: "精通冰魔法 傷害倍率增加", skillName: "精通冰魔法", skillIcon: `${CDN}/img-1762278220105.webp`, base: "1%", comboMax: "5%", noComboMax: "5%" },
            { category: "主要才能", option: "精通雷魔法 傷害倍率增加", skillName: "精通雷魔法", skillIcon: `${CDN}/img-1762278221080.webp`, base: "1%", comboMax: "5%", noComboMax: "5%" },
            { category: "主要才能", option: "精通箭系魔法 傷害倍率增加", skillName: "精通箭系魔法", skillIcon: `${CDN}/img-1762278222106.webp`, base: "1%", comboMax: "5%", noComboMax: "5%" },
            { category: "主要才能", option: "雷矢魔法 最大傷害倍率增加", skillName: "雷矢魔法", skillIcon: `${CDN}/img-1762278223912.webp`, base: "2%", comboMax: "10%", noComboMax: "10%" },
            { category: "主要才能", option: "雷擊 最大傷害倍率增加", skillName: "雷擊", skillIcon: `${CDN}/img-1762278224921.webp`, base: "0.5%", comboMax: "2.5%", noComboMax: "2.5%" },
            { category: "主要才能", option: "火矢 最大傷害倍率增加", skillName: "火矢", skillIcon: `${CDN}/img-1762278226774.webp`, base: "2%", comboMax: "10%", noComboMax: "10%" },
            { category: "主要才能", option: "火球 最大傷害倍率增加", skillName: "火球", skillIcon: `${CDN}/img-1762278227829.webp`, base: "60%", comboMax: "300%", noComboMax: "300%" },
            { category: "主要才能", option: "冰矢 最大傷害倍率增加", skillName: "冰矢", skillIcon: `${CDN}/img-1762278229742.webp`, base: "2%", comboMax: "10%", noComboMax: "10%" },
            { category: "主要才能", option: "冰矛 最大傷害倍率增加", skillName: "冰矛", skillIcon: `${CDN}/img-1762278230633.webp`, base: "6%", comboMax: "30%", noComboMax: "30%" },
            { category: "主要才能", option: "箭系組合魔法 傷害倍率增加", skillName: "箭系組合魔法", skillIcon: `${CDN}/img-1762278233312.webp`, base: "1%", comboMax: "5%", noComboMax: "5%" },
            { category: "屬性", option: "魔法攻擊力增加", base: "10", comboMax: "50", noComboMax: "50" },
        ],
    },
];
