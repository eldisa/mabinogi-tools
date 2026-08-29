// 貿易計算機資料：交通工具、城鎮貨物、各項加成係數
// 資料來源：玩家整理之貿易速查表（重量／堆疊量／基本速度為遊戲內數值，非著作內容）
// 圖示：public/tradeImage/ 下的遊戲道具圖示

export interface TradeVehicle {
    name: string;
    /** 基本負重上限 */
    weight: number;
    /** 基本格數上限 */
    slots: number;
    /** 基本移動速度（用於估算「效率」） */
    speed: number;
    /** solo：羊駝／飛行帆船，不受夥伴加成影響；partner：可搭配威廉／蘿莉的載具 */
    track: "solo" | "partner";
    /** 馬車固定顯示，其餘可由使用者勾選顯示與否 */
    toggleable: boolean;
    /** public/tradeImage/ 下的檔名（不含副檔名） */
    icon: string;
}

export const tradeVehicles: TradeVehicle[] = [
    { name: "羊駝+馬車", weight: 1100, slots: 10, speed: 716.087, track: "solo", toggleable: false, icon: "羊駝馬車" },
    { name: "馬車", weight: 900, slots: 8, speed: 714.285, track: "partner", toggleable: false, icon: "馬車" },
    { name: "大象", weight: 1700, slots: 7, speed: 512.284, track: "partner", toggleable: true, icon: "大象" },
    { name: "雪橇", weight: 700, slots: 11, speed: 700, track: "partner", toggleable: true, icon: "雪橇" },
    { name: "駱駝", weight: 1400, slots: 7, speed: 805, track: "partner", toggleable: true, icon: "駱駝" },
    { name: "浮船", weight: 1200, slots: 8, speed: 900, track: "partner", toggleable: true, icon: "浮船" },
    { name: "飛行帆船", weight: 2500, slots: 18, speed: 900, track: "solo", toggleable: true, icon: "飛行帆船" },
];

export interface TradeGood {
    name: string;
    /** 單件重量 */
    weight: number;
    /** 單格堆疊上限 */
    stackSize: number;
    /** 是否為商團貿易商品（僅部分城鎮開放） */
    guild: boolean;
    /** public/tradeImage/ 下的檔名（不含副檔名） */
    icon: string;
}

export interface TradeCity {
    name: string;
    /** public/tradeImage/ 下的檔名（不含副檔名） */
    icon: string;
    goods: TradeGood[];
}

function personal(list: [string, number, number, string][]): TradeGood[] {
    return list.map(([name, weight, stackSize, icon]) => ({ name, weight, stackSize, guild: false, icon }));
}

function guild(list: [string, number, number, string][]): TradeGood[] {
    return list.map(([name, weight, stackSize, icon]) => ({ name, weight, stackSize, guild: true, icon }));
}

export const tradeCities: TradeCity[] = [
    {
        name: "堤爾克那",
        icon: "堤爾克那",
        goods: personal([
            ["嬰孩藥水", 1, 35, "嬰孩藥水"],
            ["減肥藥水", 1, 30, "減肥藥水"],
            ["預防打鼾藥水", 2, 26, "預防打鼾藥水"],
            ["人蔘藥水", 3, 22, "人蔘藥水"],
            ["討喜藥水", 3, 25, "討喜藥水"],
        ]),
    },
    {
        name: "杜巴頓",
        icon: "杜巴頓",
        goods: personal([
            ["蜘蛛絲手套", 4, 14, "蜘蛛絲手套"],
            ["羊毛靴子", 8, 10, "羊毛靴子"],
            ["食人魔屠夫面具", 4, 26, "食人魔屠夫面具"],
            ["惡翅魅魔正裝", 25, 5, "惡翅魅魔正裝"],
            ["魅魔泳衣", 6, 5, "魅魔泳衣"],
        ]),
    },
    {
        name: "班克爾",
        icon: "班克爾",
        goods: personal([
            ["班克爾煤炭", 8, 10, "班克爾煤炭"],
            ["大理石", 20, 10, "大理石"],
            ["黃水晶", 18, 12, "黃水晶"],
            ["高地礦石", 25, 8, "高地礦石"],
            ["鉛", 18, 16, "鉛"],
        ]),
    },
    {
        name: "艾明馬夏",
        icon: "艾明馬夏",
        goods: personal([
            ["莓燕麥片", 3, 25, "莓燕麥片"],
            ["奶油啤酒", 4, 30, "奶油啤酒"],
            ["燻烤野生動物", 10, 40, "燻烤野生動物"],
            ["松露義大利麵", 4, 32, "松露義大利麵"],
            ["烤全熊", 14, 12, "烤全熊"],
        ]),
    },
    {
        name: "塔爾汀",
        icon: "塔爾汀",
        goods: personal([
            ["熱氣的結晶", 2, 33, "熱氣的結晶"],
            ["留聲石", 3, 24, "留聲石"],
            ["帕拉魯結晶", 6, 38, "帕拉魯結晶"],
            ["防護壁圓形結晶", 3, 30, "防護壁圓形結晶"],
            ["鍊金結晶", 5, 8, "鍊金結晶"],
        ]),
    },
    {
        name: "塔拉",
        icon: "塔拉",
        goods: personal([
            ["迷你梳妝台", 15, 10, "迷你梳妝台"],
            ["茶几", 38, 3, "茶几"],
            ["搖椅", 25, 5, "搖椅"],
            ["小朋友兩層樓床", 60, 3, "小朋友兩層樓床"],
            ["大型葡萄酒架", 90, 2, "大型葡萄酒架"],
        ]),
    },
    {
        name: "卡普",
        icon: "卡普",
        goods: personal([
            ["卡普海苔", 2, 32, "卡普海苔"],
            ["卡普牡蠣", 3, 26, "卡普牡蠣"],
            ["鯊魚魚鰭", 10, 25, "鯊魚魚鰭"],
            ["海蜇皮", 6, 30, "海蜇皮"],
            ["那伊德鱗片", 2, 28, "那伊德鱗片"],
        ]),
    },
    {
        name: "貝爾法斯特",
        icon: "貝爾法斯特",
        goods: personal([
            ["鐵鞭子", 8, 15, "鐵鞭子"],
            ["闇之劍", 12, 12, "闇之劍"],
            ["金庫", 90, 2, "金庫"],
            ["骷髏食人魔盔甲", 115, 1, "骷髏食人魔盔甲"],
            ["摩根特頭盔仿製品", 30, 6, "摩根特頭盔仿製品"],
        ]),
    },
    {
        name: "克拉",
        icon: "克拉",
        goods: [
            ...personal([
                ["薄荷巧克力粉末", 1, 60, "薄荷巧克力粉末"],
                ["新鮮的石榴", 2, 50, "新鮮的石榴"],
                ["魔法之門模型", 2, 65, "魔法之門模型"],
                ["探險用救助工具", 3, 38, "探險用救助工具"],
                ["卡比仙人掌精華", 2, 26, "卡比仙人掌精華"],
            ]),
            ...guild([
                ["建築用木材", 15, 8, "建築用木材"],
                ["古代生物的化石", 8, 10, "古代生物的化石"],
                ["個人用露營帳篷", 20, 7, "個人用露營帳篷"],
                ["魯特納淡水鰻魚", 7, 11, "魯特納淡水鰻魚"],
                ["卡比黃土", 6, 8, "卡比黃土"],
            ]),
        ],
    },
    {
        name: "比路里亞",
        icon: "比路里亞",
        goods: [
            ...personal([
                ["玻璃鵝卵石", 10, 60, "玻璃鵝卵石"],
                ["肉桂香水", 22, 15, "肉桂香水"],
                ["乾燥番紅花", 25, 10, "乾燥番紅花"],
                ["侖格天然岩鹽", 40, 5, "侖格天然岩鹽"],
                ["比路里亞肉乾", 20, 12, "比路里亞肉乾"],
            ]),
            ...guild([
                ["太陽的沙漏", 70, 12, "太陽的沙漏"],
                ["希里原保冷箱", 120, 5, "希里原保冷箱"],
                ["沙漠越野輪胎", 90, 7, "沙漠越野輪胎"],
                ["比路里亞傳統地毯", 35, 20, "比路里亞傳統地毯"],
                ["寶石陽傘", 20, 25, "寶石陽傘"],
            ]),
        ],
    },
    {
        name: "科爾",
        icon: "科爾",
        goods: [
            ...personal([
                ["庫爾克勒遺跡紀念品", 2, 50, "庫爾克勒遺跡紀念品"],
                ["儀式用大型面具", 3, 40, "儀式用大型面具"],
                ["拉圖勒覆盆莓", 2, 60, "拉圖勒覆盆莓"],
                ["遺物復原工具組合", 2, 70, "遺物復原工具組合"],
                ["庫爾克勒天然橡膠", 5, 8, "庫爾克勒天然橡膠"],
            ]),
            ...guild([
                ["莉菲花紋織物", 6, 15, "莉菲花紋織物"],
                ["科爾蜂巢", 12, 13, "科爾蜂巢"],
                ["沼澤梣木", 18, 9, "沼澤梣木"],
                ["玫瑰木", 25, 10, "玫瑰木"],
                ["烏木", 28, 8, "烏木"],
            ]),
        ],
    },
    {
        name: "巴雷斯",
        icon: "巴雷斯",
        goods: [
            ...personal([
                ["巴雷斯合成棉外套", 1, 50, "巴雷斯合成棉外套"],
                ["天然冰河礦泉水", 2, 35, "天然冰河礦泉水"],
                ["溜冰鞋", 1, 50, "溜冰鞋"],
                ["滑雪板", 3, 20, "滑雪板"],
                ["巴雷斯伏特加", 2, 16, "巴雷斯伏特加"],
            ]),
            ...guild([
                ["凱麗達隕石", 5, 10, "凱麗達隕石"],
                ["菲西斯雪橇", 10, 5, "菲西斯雪橇"],
                ["隨身型暖暖包", 2, 10, "隨身型暖暖包"],
                ["冰雕", 8, 8, "冰雕"],
                ["稀原紀念硬幣", 4, 15, "稀原紀念硬幣"],
            ]),
        ],
    },
];

/** 交易精通等級：等級對應的基礎利潤率 */
export const tradeSkillRanks: { label: string; value: number }[] = [
    { label: "R1", value: 1.15 },
    { label: "R2", value: 1.14 },
    { label: "R3", value: 1.13 },
    { label: "R4", value: 1.12 },
    { label: "R5", value: 1.11 },
    { label: "R6", value: 1.10 },
    { label: "R7", value: 1.09 },
    { label: "R8", value: 1.08 },
    { label: "R9", value: 1.07 },
    { label: "RA", value: 1.06 },
    { label: "RB", value: 1.05 },
    { label: "RC", value: 1.04 },
    { label: "RD", value: 1.03 },
    { label: "RE", value: 1.02 },
    { label: "RF", value: 1.01 },
    { label: "沒有", value: 0 },
];

/** 貿易保證書加成（食人魔／哥布林／妖魔，一般與高級） */
export const tradePetBonuses: { label: string; value: number }[] = [
    { label: "沒有", value: 0 },
    { label: "食人魔(+30%)", value: 0.3 },
    { label: "哥布林(+40%)", value: 0.4 },
    { label: "妖魔(+50%)", value: 0.5 },
    { label: "食人魔高級(+90%)", value: 0.9 },
    { label: "哥布林高級(+120%)", value: 1.2 },
    { label: "妖魔高級(+150%)", value: 1.5 },
];

/** 威廉好感度利潤加成 */
export const tradeAffectionBonuses: { label: string; value: number }[] = [
    { label: "沒有", value: 0 },
    { label: "+1%", value: 0.01 },
    { label: "+2%", value: 0.02 },
    { label: "+3%", value: 0.03 },
];

// 生活貿易：各地點以材料兌換各等級商品，換得的商品可載運至 12 城鎮販售（出發地不在此 12 城之內，故 12 城皆可收購）

/** 各等級兌換商品的每週兌換上限／單格堆疊上限／單件重量 */
export const lifeTradeLevelStats: Record<number, { weeklyLimit: number; stackSize: number; weight: number }> = {
    1: { weeklyLimit: 25, stackSize: 10, weight: 15 },
    2: { weeklyLimit: 15, stackSize: 7, weight: 15 },
    3: { weeklyLimit: 10, stackSize: 7, weight: 20 },
    4: { weeklyLimit: 8, stackSize: 7, weight: 25 },
    5: { weeklyLimit: 3, stackSize: 5, weight: 30 },
};

export interface LifeTradeRequirement {
    name: string;
    qty: number;
}

export interface LifeTradeItem {
    level: number;
    name: string;
    requirements: LifeTradeRequirement[];
}

export interface LifeTradeLocation {
    name: string;
    items: LifeTradeItem[];
}

function lifeItems(list: [number, string, [string, number][]][]): LifeTradeItem[] {
    return list.map(([level, name, reqs]) => ({
        level,
        name,
        requirements: reqs.map(([n, qty]) => ({ name: n, qty })),
    }));
}

export const lifeTradeLocations: LifeTradeLocation[] = [
    {
        name: "佩拉",
        items: lifeItems([
            [5, "拉斯帕黑豹的皮革", [["基因突變體", 3], ["特級木柴", 9], ["和諧的波斯菊香水", 6]]],
            [4, "火山蜥蜴的卵", [["強化生命藥水(效果500)", 16], ["優質布料", 40], ["閃光紙", 40]]],
            [3, "伊克西翁的角", [["金板", 50], ["人偶 500 藥水", 30]]],
            [2, "火山石", [["秘銀板", 30], ["大麥粉", 45]]],
            [1, "火山泥漿面膜", [["銅板", 50], ["神秘的香草粉", 75]]],
        ]),
    },
    {
        name: "凱麗達營地",
        items: lifeItems([
            [5, "玫瑰鹽", [["秘銀鐵釘", 9], ["優質木柴", 9], ["弩砲專用浸毒瓦伊凡弩箭", 9]]],
            [4, "大型露營帳篷", [["綠寶石保險絲", 8], ["人工草皮", 8], ["高級皮繩", 40]]],
            [3, "溫泉入浴劑", [["黏黏的草", 30], ["優質香草蠟燭", 20]]],
            [2, "凱麗達鮭魚", [["淨化的兔子腳", 15], ["能源轉換器", 15]]],
            [1, "麥飯石烤蛋", [["高級木柴", 50], ["強化魔法藥水(效果500)", 25]]],
        ]),
    },
    {
        name: "綠洲",
        items: lifeItems([
            [5, "巨大尖牙化石", [["聚集魔力的木柴", 15], ["乾草堆", 9], ["寵物遊戲組合", 3]]],
            [4, "仙人掌花", [["銀板", 16], ["精靈的白葡萄酒", 8], ["高級布料", 32]]],
            [3, "綠洲風景畫", [["優質皮繩", 10], ["粗線", 30]]],
            [2, "牢獄鬼魂的翅膀", [["抱枕用棉花", 15], ["優質絲網", 30]]],
            [1, "細沙", [["強化耐力藥水(效果500)", 75], ["纏結線", 50]]],
        ]),
    },
    {
        name: "卡魯",
        items: lifeItems([
            [5, "貝殼化石", [["能量增幅裝置", 6], ["堅固之鏈", 3], ["魔法的羽毛筆", 15]]],
            [4, "卡魯香菇", [["旋轉齒輪", 8], ["中級木柴", 40], ["高級絲網", 32]]],
            [3, "石頭戰馬雕刻像", [["稀原合金", 20], ["小麥粉", 50]]],
            [2, "木製工藝品", [["粗繩", 30], ["魔法的羊皮紙", 15]]],
            [1, "木製桌子", [["希里原", 50], ["鮮蝦訓練誘餌", 100]]],
        ]),
    },
];

/** 各材料對應的生活技能製作方法分類 */
export const lifeTradeMaterialCategories: Record<string, string> = {
    // 冶煉
    "銅板": "冶煉",
    "銀板": "冶煉",
    "金板": "冶煉",
    "秘銀板": "冶煉",
    "秘銀鐵釘": "冶煉",
    // 魔法製造
    "基因突變體": "魔法製造",
    "神秘的香草粉": "魔法製造",
    "黏黏的草": "魔法製造",
    "淨化的兔子腳": "魔法製造",
    "聚集魔力的木柴": "魔法製造",
    "希里原": "魔法製造",
    // 希里原工學
    "能源轉換器": "希里原工學",
    "能量增幅裝置": "希里原工學",
    "旋轉齒輪": "希里原工學",
    "稀原合金": "希里原工學",
    "綠寶石保險絲": "希里原工學",
    // 木工
    "中級木柴": "木工",
    "優質木柴": "木工",
    "高級木柴": "木工",
    "特級木柴": "木工",
    // 料理/食物
    "鮮蝦訓練誘餌": "料理/食物",
    "小麥粉": "料理/食物",
    "大麥粉": "料理/食物",
    // 藥水製作
    "強化生命藥水(效果500)": "藥水製作",
    "強化耐力藥水(效果500)": "藥水製作",
    "強化魔法藥水(效果500)": "藥水製作",
    "人偶 500 藥水": "藥水製作",
    "精靈的白葡萄酒": "藥水製作",
    // 手工藝
    "乾草堆": "手工藝",
    "抱枕用棉花": "手工藝",
    "優質香草蠟燭": "手工藝",
    "弩砲專用浸毒瓦伊凡弩箭": "手工藝",
    "人工草皮": "手工藝",
    // 紡織
    "高級絲網": "紡織",
    "優質絲網": "紡織",
    "高級布料": "紡織",
    "優質布料": "紡織",
    "優質皮繩": "紡織",
    "粗線": "紡織",
    "粗繩": "紡織",
    "纏結線": "紡織",
    "堅固之鏈": "紡織",
    "高級皮繩": "紡織",
    // 芬恩手工藝
    "和諧的波斯菊香水": "芬恩手工藝",
    "寵物遊戲組合": "芬恩手工藝",
    // 文具的手工藝
    "魔法的羊皮紙": "文具的手工藝",
    "魔法的羽毛筆": "文具的手工藝",
};
