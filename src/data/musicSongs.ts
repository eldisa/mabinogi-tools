/**
 * 音樂曲目效果表 — 各 rank 的詞條基礎值
 *
 * 來源：社群整理的技能效果表。原表欄位順序為 F→1（低→高），
 * 此處一律反轉成「1→F」(index 0 = Rank 1 最高)，方便預設取最高等級。
 *
 * 各詞條旗標：
 *   appliesExtra  — 是否吃「額外」評級倍率(里拉/SR/硬幣/禮物)。只有「戰場/活潑板攻擊力」性質的詞條為 true。
 *   appliesDragon — 是否吃紅炎精靈龍 base*0.02 攻擊加成。
 *   reforgeLine   — 該詞條吃哪條「技能細工」(自由點，加在 base 上)；undefined = 無。
 *   defaultShow   — 結果/分析預設是否顯示；省略視為 true。
 */

export interface SongOutputDef {
    name: string;
    baseByRank: number[]; // 對齊 ranks（1→F），該詞條每等級的基礎 %
    appliesExtra?: boolean;
    appliesDragon?: boolean;
    reforgeLine?: string;
    defaultShow?: boolean;
    raw?: boolean; // 固定值：直接取 base，不吃任何演奏/細工/buff 效果（如豐年成功率）
}

// 技能細工：以「部位 × 效果」grid 呈現，每格一個 select(0~breakMax，超過 normalMax 標突破限定)
export interface SongReforgeLineDef {
    id: string;
    label: string; // 效果名（grid 的欄標題）
    normalMax: number; // 每格上限（同一 group 的所有部位一致）
    breakMax: number;
}
// 一個 grid 群組：列=部位、欄=效果，組內每格皆存在；效果總和 = 該組各部位該欄相加
export interface SongReforgeGroup {
    parts: string[];
    lines: SongReforgeLineDef[];
}

export interface MusicSongDef {
    id: string;
    name: string;
    ranks: string[]; // 由高到低
    outputs: SongOutputDef[];
    // 一首歌可有多個 grid 群組（如忍耐：防禦/保護一組、魔恢/耐恢一組）
    reforge?: SongReforgeGroup[];
    /** 套裝強化項目（加進音樂效果總和）；戰場 2 件、其餘各 1 件 */
    enhanceItems?: { id: string; label: string; value: number; default?: boolean }[];
    /** 套裝強化是否互斥（只取最高 → 用 select 單選）；省略 = 各件獨立開關 */
    enhanceExclusive?: boolean;
    /** 對應的精靈龍顏色：吃到對應色才給該歌主詞條 base*0.02；無 = 該歌無對應龍（忍耐/進行） */
    dragonColor?: "red" | "blue" | "green";
}

// 共用 rank 標籤（1 為最高、F 為最低）
const RANKS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

export const MUSIC_SONGS: MusicSongDef[] = [
    {
        id: "battlefield",
        name: "戰場的序曲",
        ranks: RANKS,
        dragonColor: "red", // 紅炎：加成最大/最小傷害
        // 套裝強化（戰場 2 件，互斥只取最高）：熾天使預設選（與舊 setEffect 預設一致，維持 baseline）
        enhanceItems: [
            { id: "bfSeraphHand", label: "熾天使歌唱手部裝飾 (+5)", value: 5, default: true },
            { id: "bfRomanceBody", label: "特別的吟遊詩人浪漫服裝 (+3)", value: 3 },
        ],
        enhanceExclusive: true,
        outputs: [
            {
                name: "最大傷害",
                baseByRank: [20, 19, 18, 17, 16, 16, 15, 15, 14, 13, 13, 12, 12, 11, 10],
                appliesExtra: true,
                appliesDragon: true,
            },
            {
                name: "最小傷害",
                baseByRank: [20, 19, 18, 17, 16, 15, 15, 14, 14, 13, 12, 12, 11, 11, 10],
                appliesExtra: true,
                appliesDragon: true,
                defaultShow: false, // 最小傷害沒人在乎，預設收起（只顯示最大）
            },
            {
                name: "暴擊",
                baseByRank: [11, 10, 9, 8, 7, 6, 5, 5, 4, 3, 3, 2, 2, 1, 1],
                appliesExtra: false,
                appliesDragon: false,
                defaultShow: false, // 暴擊通常溢出，沒人在意
            },
        ],
    },
    {
        id: "lively",
        name: "活潑板",
        ranks: RANKS,
        dragonColor: "blue", // 藍龍：加成魔法攻擊力
        // 套裝強化（活潑板）：吟遊詩人頭 +3
        enhanceItems: [{ id: "livelyHead", label: "吟遊詩人頭 (+3)", value: 3 }],
        // 速度細工：飾品1/飾品2/鞋子 各 0~4（4 為突破限定）
        reforge: [
            {
                parts: ["飾品1", "飾品2", "鞋子"],
                lines: [
                    { id: "livelyMagicSpeed", label: "魔法施展速度", normalMax: 3, breakMax: 4 },
                    { id: "livelyAlchSpeed", label: "煉金術施展速度", normalMax: 3, breakMax: 4 },
                    { id: "livelyAtkSpeed", label: "攻擊速度", normalMax: 3, breakMax: 4 },
                ],
            },
        ],
        outputs: [
            {
                name: "魔法攻擊力",
                baseByRank: [20, 19, 18, 17, 16, 16, 15, 15, 14, 13, 13, 12, 12, 11, 10],
                appliesExtra: true,
                appliesDragon: true, // 藍龍加成
            },
            {
                name: "魔法施展速度",
                baseByRank: [11, 10, 9, 8, 7, 7, 6, 6, 5, 4, 4, 3, 2, 2, 2],
                appliesExtra: false,
                reforgeLine: "livelyMagicSpeed",
            },
            {
                name: "煉金術施展速度",
                baseByRank: [11, 10, 9, 8, 7, 6, 6, 5, 5, 4, 3, 3, 2, 2, 2],
                appliesExtra: false,
                reforgeLine: "livelyAlchSpeed",
            },
            {
                name: "攻擊速度",
                baseByRank: [11, 10, 9, 8, 7, 6, 5, 4, 4, 3, 3, 2, 2, 1, 1],
                appliesExtra: false,
                reforgeLine: "livelyAtkSpeed",
            },
        ],
    },
    {
        id: "march",
        name: "進行曲",
        ranks: RANKS,
        // 套裝強化（進行曲）：吟遊詩人鞋子 +3
        enhanceItems: [{ id: "marchShoe", label: "吟遊詩人鞋子 (+3)", value: 3 }],
        // 進行曲無對應精靈龍。速度細工：飾品1/飾品2/鞋子 各 0~4（4 為突破限定）
        reforge: [
            {
                parts: ["飾品1", "飾品2", "鞋子"],
                lines: [
                    { id: "marchWalkSpeed", label: "徒步移動速度", normalMax: 3, breakMax: 4 },
                    { id: "marchRideSpeed", label: "寵物搭乘移動速度", normalMax: 3, breakMax: 4 },
                ],
            },
        ],
        outputs: [
            {
                name: "徒步移動速度",
                baseByRank: [12, 10, 8, 8, 7, 7, 6, 6, 5, 3, 3, 2, 2, 1, 1],
                appliesExtra: false,
                reforgeLine: "marchWalkSpeed",
            },
            {
                name: "寵物搭乘移動速度",
                baseByRank: [9, 8, 8, 7, 7, 6, 6, 5, 5, 4, 3, 3, 2, 2, 1],
                appliesExtra: false,
                reforgeLine: "marchRideSpeed",
            },
        ],
    },
    {
        id: "harvest",
        name: "豐年歌",
        ranks: RANKS,
        dragonColor: "green", // 綠龍：加成豐年（待確認加成哪一條詞條）
        // 套裝強化（豐年歌）：吟遊詩人手套 +3
        enhanceItems: [{ id: "harvestGlove", label: "吟遊詩人手套 (+3)", value: 3 }],
        // 採集速度細工：飾品1/飾品2/手套 各 0~4（4 為突破限定）
        reforge: [
            {
                parts: ["飾品1", "飾品2", "手套"],
                lines: [{ id: "harvestGatherSpeed", label: "採集速度", normalMax: 3, breakMax: 4 }],
            },
        ],
        outputs: [
            {
                name: "採集成功率",
                baseByRank: [5, 5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1],
                appliesExtra: false,
                raw: true, // 固定值，不吃任何效果
            },
            {
                name: "生產成功率",
                baseByRank: [5, 5, 5, 4, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 0],
                appliesExtra: false,
                raw: true, // 固定值，不吃任何效果
            },
            {
                name: "採集速度",
                baseByRank: [25, 22, 20, 18, 16, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5],
                appliesExtra: false,
                appliesDragon: true, // 綠龍加成
                reforgeLine: "harvestGatherSpeed",
            },
        ],
    },
    {
        id: "endurance",
        name: "忍耐的音樂",
        ranks: RANKS,
        // 套裝強化（忍耐）：吟遊詩人衣服 +3
        enhanceItems: [{ id: "enduranceBody", label: "吟遊詩人衣服 (+3)", value: 3 }],
        // 防禦/保護：飾品1/飾品2/手套 各 0~4（4 突破）；魔力/耐力恢復：鞋子 0~13（10~13 突破）→ 拆成兩個 grid
        reforge: [
            {
                parts: ["飾品1", "飾品2", "手套"],
                lines: [
                    { id: "enduranceDef", label: "防禦", normalMax: 3, breakMax: 4 },
                    { id: "enduranceProtect", label: "保護", normalMax: 3, breakMax: 4 },
                ],
            },
            {
                parts: ["鞋子"],
                lines: [
                    { id: "enduranceMana", label: "魔力恢復速度", normalMax: 9, breakMax: 13 },
                    { id: "enduranceStamina", label: "耐力恢復速度", normalMax: 9, breakMax: 13 },
                ],
            },
        ],
        outputs: [
            {
                name: "防禦 / 魔法防禦",
                baseByRank: [11, 10, 9, 9, 8, 7, 7, 6, 5, 4, 3, 2, 2, 1, 1],
                appliesExtra: false,
                reforgeLine: "enduranceDef",
            },
            {
                name: "保護 / 魔法保護",
                baseByRank: [5, 4, 4, 3, 3, 3, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                appliesExtra: false,
                reforgeLine: "enduranceProtect",
            },
            {
                name: "魔法恢復速度",
                baseByRank: [410, 395, 380, 365, 350, 335, 320, 305, 290, 275, 260, 260, 230, 230, 200],
                appliesExtra: false,
                reforgeLine: "enduranceMana",
            },
            {
                name: "耐力恢復速度",
                baseByRank: [410, 395, 380, 365, 350, 335, 320, 305, 290, 275, 260, 260, 230, 230, 200],
                appliesExtra: false,
                reforgeLine: "enduranceStamina",
            },
        ],
    },
];
