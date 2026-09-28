// 破防相關資料：條件、施加來源、數值設定與公式、統計分組
// 由 ArmorBreakTraining.vue（破防練習）與 ProtectionBreakView.vue（破保數據）共用

export interface Condition {
    id: number;
    name?: string; // hover 時顯示
    advanced?: boolean; // 進階，預設不顯示
    permanent?: boolean; // 永久，不倒數
    permLabel?: string; // 永久的顯示文字，預設「永久」（在場即永久者顯示「在場」）
    seconds?: number; // 持續秒數
    note?: string; // 例如「寵物在場即永久」
    side?: "phys" | "magic"; // 物理／魔法側；未標示者兩邊通用
    valueKind?: "prot" | "atk"; // 有數值者：prot=減防保護(-%/-固定)、atk=攻擊傷害(+%)
    cls?: string; // 職業專屬（未標示者為通用）
    optional?: boolean; // 非必要：及格判定不列入
}

export interface DebuffValue {
    pct: number;
    fixed: number;
}

export interface Source {
    id: number; // 技能 id / 寵物 id / condition id（self）
    kind: "skill" | "pet" | "self"; // self=以自身 condition 圖示施加
    name?: string; // 技能名稱（寵物／self 無）
    conditions: number[]; // 此來源會施加的 condition
    note?: string; // 觸發／取得條件（破保數據頁顯示）
}

// 名稱取自 src/data/conditions.ts 的繁中（tw）欄位；只列用到的幾筆，
// 避免為了幾個名稱 import 整份 336K 對照表
export const CONDITIONS: Condition[] = [
    { id: 1164, name: "減少防禦/保護", seconds: 300, side: "phys", valueKind: "prot" },
    { id: 1165, name: "減少魔法防禦/魔法保護", seconds: 300, side: "magic", valueKind: "prot" },
    { id: 1166, name: "所受傷害增加", seconds: 300, valueKind: "atk" },
    { id: 426, name: "死神烙印", seconds: 200 }, // 僅死神烙印施加
    { id: 392, name: "纏繞的閃電", seconds: 300, valueKind: "prot" },
    { id: 464, name: "冰雪狀態", permanent: true, permLabel: "在場", advanced: true, note: "在場即永久", valueKind: "prot" },
    { id: 594, name: "跑跑卡丁車水球", permanent: true, valueKind: "prot" },
    { id: 912, name: "喵喵的喵皇降臨", seconds: 300, valueKind: "prot" },
    { id: 1004, name: "銳利目光", permanent: true, permLabel: "在場", advanced: true, note: "寵物在場即永久（暴擊傷害）", valueKind: "atk" },
    { id: 1093, name: "保護最大減少", permanent: true, side: "phys", valueKind: "prot" },
    { id: 1094, name: "魔法保護最大減少", permanent: true, side: "magic", valueKind: "prot" },
    { id: 1138, name: "幸運草標記", seconds: 300, valueKind: "atk" },
    { id: 10001, name: "物理防禦和保護減少瑪奇魔法陣", advanced: true, seconds: 110, side: "phys", valueKind: "prot" },
    { id: 10002, name: "魔法防禦和保護減少瑪奇魔法陣", advanced: true, seconds: 110, side: "magic", valueKind: "prot" },
    // ===== 追加（皆以自身 condition 圖示施加；持續時間見 durationOf）=====
    { id: 521, name: "洞察之眼", advanced: true, optional: true, valueKind: "atk" }, // 增傷；120s(套裝+60)
    { id: 1026, name: "倒吊人", advanced: true, optional: true, valueKind: "atk" }, // 增傷；30+卡片 s
    { id: 578, name: "魔法光圈", permanent: true, permLabel: "在場", optional: true, valueKind: "prot" },
    { id: 803, name: "崩潰的波動", advanced: true, cls: "聖詠", optional: true, valueKind: "prot" }, // 10+遺物×0.5 s
    { id: 1176, name: "不協調感", advanced: true, cls: "聖詠", optional: true, valueKind: "prot", seconds: 180 },
    { id: 339, name: "憤怒衝擊", advanced: true, optional: true, valueKind: "atk", seconds: 7 }, // 近戰技能傷害
    { id: 1145, name: "觸媒效應", advanced: true, cls: "鍊金", optional: true, valueKind: "prot", seconds: 300 },
    { id: 1147, name: "召喚噩夢", advanced: true, cls: "鍊金", optional: true, valueKind: "prot", seconds: 120, note: "最終傷害 +0.9594%" },
];

// 技能名稱取自 src/data/skillNames.ts 的繁中（tw）欄位；寵物 id 該表查無名稱
export const SOURCES: Source[] = [
    { id: 27205, kind: "skill", name: "黃道蔓延", conditions: [1164, 1165, 1166] },
    { id: 26006, kind: "skill", name: "灰色煙幕術", conditions: [1164, 1165] },
    { id: 24201, kind: "skill", name: "連續技能: 螺旋勾拳", conditions: [1164] },
    { id: 35024, kind: "skill", name: "海德拉鍊成", conditions: [1165] },
    { id: 21006, kind: "skill", name: "支援箭", conditions: [1166] },
    { id: 27010, kind: "skill", name: "死神烙印", conditions: [1166, 426] },
    { id: 50226, kind: "skill", name: "水炸彈投擲", conditions: [594] },
    { id: 58018, kind: "skill", name: "刻印 : 弗拉加拉赫", conditions: [1093, 1094] },
    { id: 10103, kind: "skill", name: "瑪奇魔法陣發動", conditions: [10001, 10002], note: "定點且範圍小，目標移動後大機率脫離有效範圍" },
    { id: 59009, kind: "skill", name: "音波洗禮", conditions: [1176], note: "聖詠技能" }, // skillNames.ts 僅有韓文名，繁中為暫譯
    { id: 490105, kind: "pet", conditions: [392] },
    { id: 490253, kind: "pet", conditions: [392] },
    { id: 490229, kind: "pet", conditions: [464], note: "隊伍人少時多優先帶銳利目光；沒聖詠難以維持，滿層需時間，轉場後重新累積" },
    { id: 490411, kind: "pet", conditions: [912] },
    { id: 490431, kind: "pet", conditions: [1138] },
    { id: 491006, kind: "pet", conditions: [1004], note: "需要聖詠協助維持" },
    { id: 490279, kind: "pet", conditions: [578] }, // 天使貓 → 魔法光圈
    { id: 490280, kind: "pet", conditions: [578] }, // 天使貓 → 魔法光圈
    // 追加：以自身 condition 圖示施加
    { id: 521, kind: "self", conditions: [521] },
    { id: 1026, kind: "self", conditions: [1026] },
    { id: 803, kind: "self", conditions: [803], note: "聖詠技能；持續 10 秒、CD 5 分鐘" },
    { id: 339, kind: "self", conditions: [339] },
    { id: 1145, kind: "self", conditions: [1145], note: "鍊金技能" },
    { id: 1147, kind: "self", conditions: [1147], note: "鍊金技能" },
];

export const condById = new Map(CONDITIONS.map((c) => [c.id, c]));

// ===== 數值設定（裝備／技能等級等）=====
export interface ValueSettings {
    equip1: boolean; // 黃道 裝備1
    equip2: boolean; // 黃道 裝備2
    knuckleReforge: number; // 螺旋勾拳 細工等級 0–7
    hydraEcho: number; // 海德拉鍊成 回音石等級 0–20
    arrowCircle: number; // 支援箭 魔法陣等級 0–10
    arrowSet: boolean; // 支援箭 套裝效果
    reaperReforge: number; // 死神烙印 細工等級 0–25
    reaperSet: boolean; // 死神烙印 套裝效果
    totem: number; // 洞察之眼 指揮官圖騰 0–5
    insightSet: boolean; // 洞察之眼 套裝（持續+60s）
    card: number; // 倒吊人 卡片等級 0–30
    relic: number; // 崩潰的波動 遺物等級 0–10
    rageCircle: number; // 憤怒衝擊 魔法陣 0–10
    rageSet: boolean; // 憤怒衝擊 套裝（+2%）
    dissonance: number; // 不協調感 每層數值（玩家填寫）
    dissonanceStacks: number; // 不協調感 層數 1–5
    cloverStacks: number; // 幸運草標記 層數 1–4（疊滿共 +15%）
}
export const DEFAULT_SETTINGS: ValueSettings = {
    equip1: true,
    equip2: true,
    knuckleReforge: 5, // 6–7 需突破
    hydraEcho: 20,
    arrowCircle: 10,
    arrowSet: true,
    reaperReforge: 20, // 21–25 需突破
    reaperSet: true,
    totem: 5,
    insightSet: true,
    card: 30,
    relic: 10,
    rageCircle: 10,
    rageSet: true,
    dissonance: 4,
    dissonanceStacks: 5,
    cloverStacks: 4,
};

// 某技能對某條件的減益數值（依設定）
export const skillValue = (st: ValueSettings, skillId: number, condId: number): DebuffValue => {
    switch (skillId) {
        case 27205: // 黃道蔓延
            if (condId === 1166) return { pct: 45, fixed: 0 };
            return {
                pct: Math.min(11, (st.equip1 ? 5 : 0) + (st.equip2 ? 6 : 0)),
                fixed: Math.min(17, (st.equip1 ? 7 : 0) + (st.equip2 ? 10 : 0)),
            };
        case 26006: // 灰色煙幕術
            return { pct: 11, fixed: 20 };
        case 24201: // 螺旋勾拳
            return { pct: 11, fixed: 23 + st.knuckleReforge };
        case 35024: // 海德拉鍊成
            return { pct: 11, fixed: 31 + st.hydraEcho * 0.5 };
        case 21006: {
            // 支援箭
            const base = 48 + st.arrowCircle * 0.3;
            return { pct: st.arrowSet ? base * 1.15 : base, fixed: 0 };
        }
        case 27010: // 死神烙印
            if (condId === 426) return { pct: 0, fixed: 0 }; // 死神烙印標記本身無數值
            return { pct: 53 + st.reaperReforge * 0.25 + (st.reaperSet ? 3 : 0), fixed: 0 };
        case 58018: // 刻印 : 弗拉加拉赫 → 1093/1094 保護最大減少
            return { pct: 0, fixed: 16 };
        case 10103: // 瑪奇魔法陣發動 → 10001/10002
            return { pct: 0, fixed: 10 };
        // ===== 追加 =====
        case 521: // 洞察之眼（增傷）
            return { pct: 3 + st.totem * 0.4, fixed: 0 };
        case 1026: // 倒吊人（增傷）
            return { pct: 2 + 0.1 * st.card, fixed: 0 };
        case 490279: // 天使貓 → 578 魔法光圈（保護＋魔保）
        case 490280:
            return { pct: 0, fixed: 1 };
        case 803: // 崩潰的波動（保護＋魔保）
            return { pct: 0, fixed: 40 };
        case 59009: // 音波洗禮 → 1176 不協調感（保護＋魔保；層數×數值，無條件進位）
            return { pct: 0, fixed: Math.ceil(st.dissonanceStacks * st.dissonance) };
        case 339: // 憤怒衝擊（近戰技能傷害）
            return { pct: 15 + st.rageCircle * 0.3 + (st.rageSet ? 2 : 0), fixed: 0 };
        case 1145: // 觸媒效應（保護＋魔保）
            return { pct: 0, fixed: 3.68 };
        case 1147: // 召喚噩夢（保護＋魔保；最終傷害另計，不入 value）
            return { pct: 0, fixed: 1.845 };
        // ===== 寵物／其他（保護＋魔保 或 增傷）=====
        case 50226: // 水炸彈投擲 → 594 跑跑卡丁車水球
            return { pct: 0, fixed: 3 };
        case 490105: // 寵物 → 392 纏繞的閃電
        case 490253:
            return { pct: 0, fixed: 10 };
        case 490229: // 寵物 → 464 冰雪狀態
            return { pct: 0, fixed: 4 };
        case 490411: // 寵物 → 912 喵喵的喵皇降臨
            return { pct: 0, fixed: 15 };
        case 490431: // 寵物 → 1138 幸運草標記（增傷；最高 4 層，疊滿 +15%）
            return { pct: (15 * st.cloverStacks) / 4, fixed: 0 };
        case 491006: // 寵物 → 1004 銳利目光（暴擊傷害）
            return { pct: 3, fixed: 0 };
        default:
            return { pct: 0, fixed: 0 };
    }
};

// 依屬性把多個 debuff 的 %與固定分別相加（疊加相加）
export interface StatGroup {
    key: string;
    label: string;
    iconId: number;
    kind: "prot" | "atk";
    conds: number[];
}
export const STAT_GROUPS: StatGroup[] = [
    {
        key: "phys",
        label: "物理保護減少",
        iconId: 1164,
        kind: "prot",
        conds: [1164, 1093, 10001, 578, 803, 1176, 1145, 1147, 392, 464, 594, 912],
    },
    {
        key: "magic",
        label: "魔法保護減少",
        iconId: 1165,
        kind: "prot",
        conds: [1165, 1094, 10002, 578, 803, 1176, 1145, 1147, 392, 464, 594, 912],
    },
    { key: "atk", label: "所受傷害增加", iconId: 1166, kind: "atk", conds: [1166, 521, 1026, 1138] },
    { key: "melee", label: "近戰技能傷害", iconId: 339, kind: "atk", conds: [339] },
    { key: "crit", label: "暴擊傷害", iconId: 1004, kind: "atk", conds: [1004] },
];

// 數值後的單位：未分物理／魔法側的減保狀態 → 保護/魔法保護；增傷 → 所屬分組（名稱已是分組名者略過）
export const valueUnit = (c: Condition) => {
    if (c.valueKind === "prot") return c.side ? "" : " 保護/魔法保護";
    const g = STAT_GROUPS.find((g) => g.kind === "atk" && g.conds.includes(c.id));
    return g && g.label !== c.name ? ` ${g.label}` : "";
};
