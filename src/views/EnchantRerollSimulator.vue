<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { Search } from "@element-plus/icons-vue";
import reforgeDataRaw from "../../scripts/mabi_reforge_slim_with_race.json";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent, MarkLineComponent, MarkPointComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([LineChart, GridComponent, TooltipComponent, MarkLineComponent, MarkPointComponent, CanvasRenderer]);

// ===== Data Types =====
interface ReforgeEntry {
    name: string;
    maxLevel: number;
    maxLevelBreak: number; // explicit in new data (= ceil(maxLevel * 1.25))
    stepValue: number; // value per level
    unit: string;
}

interface ReforgeData {
    library: Record<string, ReforgeEntry>;
    pools: {
        categories: Record<string, ReforgeEntry[]>; // per-equipment-type, each with its own data
        races: Record<string, string[]>;
    };
}

interface TargetEntry {
    name: string;
    minLevel: number;
    entry: ReforgeEntry;
}

const reforgeData = reforgeDataRaw as ReforgeData;
const baseUrl = import.meta.env.BASE_URL;

// ===== Equipment Types =====
interface EquipmentType {
    id: string;
    name: string;
    categoryKey: string; // maps to pools.categories key in JSON
    isHeavy?: boolean; // 重甲部位：額外注入自動防禦三詞條
}
interface SlotGroup {
    slot: string;
    subtypes: EquipmentType[];
}

const ARMOR_SLOT_GROUPS: SlotGroup[] = [
    {
        slot: "帽子",
        subtypes: [
            { id: "hat_normal", name: "帽子", categoryKey: "hat" },
            { id: "hat_heavy", name: "重甲頭盔", categoryKey: "hat", isHeavy: true },
        ],
    },
    {
        slot: "盔甲裝備",
        subtypes: [
            { id: "cloth", name: "布衣", categoryKey: "body" },
            { id: "light_armor", name: "輕盔甲", categoryKey: "body" },
            { id: "heavy_armor", name: "重盔甲", categoryKey: "body", isHeavy: true },
        ],
    },
    {
        slot: "手套",
        subtypes: [
            { id: "glove_normal", name: "手套", categoryKey: "glove" },
            { id: "glove_heavy", name: "重甲手套", categoryKey: "glove", isHeavy: true },
        ],
    },
    {
        slot: "鞋子",
        subtypes: [
            { id: "shoe_normal", name: "鞋子", categoryKey: "shoes" },
            { id: "shoe_heavy", name: "重盔甲鞋子", categoryKey: "shoes", isHeavy: true },
        ],
    },
    { slot: "飾品", subtypes: [{ id: "accessory", name: "飾品", categoryKey: "accessory" }] },
    { slot: "盾牌", subtypes: [{ id: "shield", name: "盾牌", categoryKey: "shield" }] },
];

const WEAPON_SLOT_GROUPS: SlotGroup[] = [
    {
        slot: "近戰",
        subtypes: [
            { id: "one_hand", name: "單手武器", categoryKey: "weapon_melee_oh" },
            { id: "two_hand_sword", name: "雙手劍", categoryKey: "THSword" },
            { id: "two_hand", name: "雙手斧/鈍器", categoryKey: "weapon_melee_th" },
            { id: "lance", name: "騎槍", categoryKey: "lance" },
            { id: "handle", name: "手把", categoryKey: "handle" },
            { id: "knuckle", name: "拳套", categoryKey: "knuckle" },
            { id: "chain", name: "鎖鏈鐮刃", categoryKey: "chainblade" },
            { id: "scythe", name: "鐮刀", categoryKey: "scythe" },
        ],
    },
    {
        slot: "遠程",
        subtypes: [
            { id: "bow", name: "弓", categoryKey: "weapon_range" },
            { id: "crossbow", name: "弩", categoryKey: "weapon_range" },
            { id: "dual_gun", name: "雙槍", categoryKey: "dualgun" },
            { id: "shuriken", name: "手裡劍", categoryKey: "shuriken" },
        ],
    },
    {
        slot: "魔法",
        subtypes: [
            { id: "healing_wand", name: "魔杖（治癒）", categoryKey: "healingWand" },
            { id: "tribolt_wand", name: "三矛魔杖", categoryKey: "triboltWand" },
            { id: "staff", name: "集魔杖", categoryKey: "staff" },
            { id: "grimoire", name: "魔導書/水晶球", categoryKey: "orb" },
            { id: "cylinder", name: "鋼瓶", categoryKey: "cylinder" },
        ],
    },
    { slot: "其他", subtypes: [{ id: "instrument", name: "樂器", categoryKey: "instrument" }] },
];

// ===== 細工道具 =====
interface ToolMinLevelEntry {
    normal: number;
    activity: number;
}
type ToolMinLevelTable = Record<number, ToolMinLevelEntry>; // key = 詞條 maxLevel

interface RerollTool {
    id: number;
    name: string;
    shortName: string;
    breakthroughProb: number;
    minLevelTable: ToolMinLevelTable;
    excludeKeywords: string[];
}
const REROLL_TOOLS: RerollTool[] = [
    {
        id: 5050006,
        name: "普通細工道具",
        shortName: "普通",
        breakthroughProb: 0,
        minLevelTable: {
            1: { normal: 1, activity: 1 },
            3: { normal: 1, activity: 1 },
            5: { normal: 1, activity: 2 },
            6: { normal: 1, activity: 2 },
            7: { normal: 1, activity: 3 },
            8: { normal: 1, activity: 3 },
            10: { normal: 1, activity: 4 },
            12: { normal: 1, activity: 4 },
            15: { normal: 1, activity: 5 },
            20: { normal: 1, activity: 7 },
        },
        excludeKeywords: [],
    },
    {
        id: 5050005,
        name: "精緻細工道具",
        shortName: "精緻",
        breakthroughProb: 0.001,
        minLevelTable: {
            1: { normal: 1, activity: 1 },
            3: { normal: 1, activity: 1 },
            5: { normal: 2, activity: 2 },
            6: { normal: 2, activity: 2 },
            7: { normal: 3, activity: 3 },
            8: { normal: 3, activity: 3 },
            10: { normal: 4, activity: 4 },
            12: { normal: 4, activity: 5 },
            15: { normal: 5, activity: 6 },
            20: { normal: 7, activity: 8 },
        },
        excludeKeywords: [],
    },
    {
        id: 5050013,
        name: "璀璨細工道具",
        shortName: "璀璨",
        breakthroughProb: 0.001,
        minLevelTable: {
            1: { normal: 1, activity: 1 },
            3: { normal: 1, activity: 1 },
            5: { normal: 2, activity: 2 },
            6: { normal: 2, activity: 3 },
            7: { normal: 3, activity: 3 },
            8: { normal: 3, activity: 4 },
            10: { normal: 4, activity: 5 },
            12: { normal: 5, activity: 5 },
            15: { normal: 6, activity: 7 },
            20: { normal: 8, activity: 9 },
        },
        excludeKeywords: ["神聖之心", "渾沌之心", "闇影操控", "克諾斯", "菲西斯"],
    },
    {
        id: 5050020,
        name: "燦爛細工道具",
        shortName: "燦爛",
        breakthroughProb: 0.005,
        minLevelTable: {
            1: { normal: 1, activity: 1 },
            3: { normal: 1, activity: 2 },
            5: { normal: 2, activity: 3 },
            6: { normal: 3, activity: 3 },
            7: { normal: 3, activity: 4 },
            8: { normal: 4, activity: 4 },
            10: { normal: 5, activity: 5 },
            12: { normal: 5, activity: 6 },
            15: { normal: 7, activity: 8 },
            20: { normal: 9, activity: 10 },
        },
        excludeKeywords: ["神聖之心", "渾沌之心", "闇影操控", "克諾斯", "菲西斯", "修練"],
    },
];

// Race restriction → relevant pool keys to merge in
const RACE_POOL_KEYS: Record<string, string[]> = {
    全種族: Object.keys(reforgeData.pools.races), // 全部種族池
    人類限定: ["human"],
    精靈限定: ["elf"],
    巨人限定: ["giant"],
    "人類/精靈限定": ["human", "elf", "human_elf"], // 人 + 精 + 人精共通
    "人類/巨人限定": ["human", "giant", "human_giant"], // 人 + 巨 + 人巨共通
};
const RACE_OPTIONS = Object.keys(RACE_POOL_KEYS);

// ===== State =====
/** 依詞條、工具、活動狀態取得 minLevel 下限 */
const getToolMinForEntry = (entry: ReforgeEntry): number => {
    const row = selectedTool.value?.minLevelTable[entry.maxLevel];
    return row ? (activityMode.value ? row.activity : row.normal) : 1;
};

const selectedCategory = ref<"防具" | "武器" | null>(null);
const selectedEquipType = ref<EquipmentType | null>(null);
const selectedRace = ref<string>("全種族");
const selectedToolIdx = ref<number | null>(null);
const doubleBreakthrough = ref<boolean>(false);
const activityMode = ref<boolean>(false);
const filterText = ref<string>("");
const selectedTargets = ref<TargetEntry[]>([]); // max 3
const costPerRoll = ref<number>(0);

// ===== Derived =====
const currentSlotGroups = computed<SlotGroup[]>(() => {
    if (selectedCategory.value === "防具") return ARMOR_SLOT_GROUPS;
    if (selectedCategory.value === "武器") return WEAPON_SLOT_GROUPS;
    return [];
});

const selectedTool = computed(() => (selectedToolIdx.value !== null ? REROLL_TOOLS[selectedToolIdx.value] : null));

const effectiveBreakthroughProb = computed((): number => {
    if (!selectedTool.value) return 0;
    const base = selectedTool.value.breakthroughProb;
    return doubleBreakthrough.value ? base * 2 : base;
});

const isReady = computed(() => selectedEquipType.value !== null && selectedToolIdx.value !== null);

// ===== Breakthrough helpers =====
// maxLevelBreak is now stored directly in the data (= ceil(maxLevel * 1.25))
const btMaxLevel = (entry: ReforgeEntry): number => entry.maxLevelBreak;
const btLevelRange = (entry: ReforgeEntry): [number, number] => [entry.maxLevel + 1, entry.maxLevelBreak];

/** 一個詞條能填入的最低等級上限（考慮突破） */
const maxSettableMinLevel = (entry: ReforgeEntry): number =>
    effectiveBreakthroughProb.value > 0 ? btMaxLevel(entry) : entry.maxLevel;

// ===== Pool =====
const activePool = computed((): ReforgeEntry[] => {
    if (!isReady.value) return [];
    const catKey = selectedEquipType.value!.categoryKey;
    const catEntries = reforgeData.pools.categories[catKey] ?? [];

    // All stats that are race-restricted (appear in any race pool)
    const allRaceStats = new Set<string>(Object.values(reforgeData.pools.races).flat());
    // Stats allowed by the current race restriction setting
    const allowedRaceStats = new Set<string>(
        (RACE_POOL_KEYS[selectedRace.value] ?? []).flatMap((k) => reforgeData.pools.races[k] ?? []),
    );

    const excludeKws = selectedTool.value?.excludeKeywords ?? [];

    // 直接對 ReforgeEntry[] 過濾，每個部位使用自己的 data（避免跨部位 maxLevel 汙染）
    const basePool = catEntries
        .filter((e) => !allRaceStats.has(e.name) || allowedRaceStats.has(e.name))
        .filter((e) => excludeKws.length === 0 || !excludeKws.some((kw) => e.name.includes(kw)));

    // 重甲部位：額外注入自動防禦三詞條（歸屬 shield，需手動從 library 補入）
    if (selectedEquipType.value!.isHeavy) {
        const HEAVY_EXTRA = ["近距離戰鬥自動防禦", "遠距離攻擊自動防禦", "魔法攻擊自動防禦"];
        const existingNames = new Set(basePool.map((e) => e.name));
        for (const n of HEAVY_EXTRA) {
            const entry = reforgeData.library[n];
            if (entry && !existingNames.has(n)) basePool.push(entry);
        }
    }

    return basePool;
});

const filteredPool = computed((): ReforgeEntry[] => {
    const q = filterText.value.trim();
    if (!q) return activePool.value;
    return activePool.value.filter((e) => e.name.includes(q));
});

// ===== Target Selection =====
const isTargeted = (name: string): boolean => selectedTargets.value.some((t) => t.name === name);

const toggleTarget = (row: ReforgeEntry) => {
    const idx = selectedTargets.value.findIndex((t) => t.name === row.name);
    if (idx >= 0) {
        selectedTargets.value.splice(idx, 1);
    } else if (selectedTargets.value.length < 3) {
        selectedTargets.value.push({ name: row.name, minLevel: getToolMinForEntry(row), entry: row });
    }
};

// ===== Probability Helpers =====
/** P(level >= minLv | one drawn stat) accounting for tool min level & breakthrough */
const calcLevelProb = (entry: ReforgeEntry, minLv: number): number => {
    const btProb = effectiveBreakthroughProb.value;
    const toolMin = getToolMinForEntry(entry);
    // Normal: uniform over [toolMin, maxLevel]
    const normalRange = entry.maxLevel - toolMin + 1;
    const pNormal =
        normalRange > 0 && minLv <= entry.maxLevel
            ? Math.max(0, entry.maxLevel - Math.max(toolMin, minLv) + 1) / normalRange
            : 0;
    // Breakthrough: uniform over [maxLevel+1, btMax]
    let pBt = 0;
    if (btProb > 0) {
        const btMin = entry.maxLevel + 1;
        const btMax = btMaxLevel(entry);
        const btRange = btMax - btMin + 1;
        pBt = Math.max(0, btMax - Math.max(btMin, minLv) + 1) / btRange;
    }
    return (1 - btProb) * pNormal + btProb * pBt;
};

/** P(k specific targets all drawn when drawing 3 from N) */
const calcDrawProb = (k: number, N: number): number => {
    if (k === 0 || N < k) return k === 0 ? 1 : 0;
    if (k === 1) return Math.min(3, N) / N;
    if (k === 2) return N >= 2 ? 6 / (N * (N - 1)) : 0;
    if (k === 3) return N >= 3 ? 6 / (N * (N - 1) * (N - 2)) : 0;
    return 0;
};

// ===== Simulation =====
interface SimResult {
    p: number;
    drawP: number;
    levelP: number;
    poolSize: number;
    targetCount: number;
    mean: number;
    p50: number;
    p90: number;
    p99: number;
    avgCost: number;
}

const simResult = computed((): SimResult | null => {
    if (selectedTargets.value.length === 0 || activePool.value.length === 0) return null;
    const N = activePool.value.length;
    const k = selectedTargets.value.length;
    const drawP = calcDrawProb(k, N);
    if (drawP <= 0) return null;

    let levelP = 1;
    for (const t of selectedTargets.value) levelP *= calcLevelProb(t.entry, t.minLevel);

    const p = drawP * levelP;
    if (p <= 0) return null;

    const mean = 1 / p;
    const p50 = Math.ceil(Math.log(0.5) / Math.log(1 - p));
    const p90 = Math.ceil(Math.log(0.1) / Math.log(1 - p));
    const p99 = Math.ceil(Math.log(0.01) / Math.log(1 - p));
    return { p, drawP, levelP, poolSize: N, targetCount: k, mean, p50, p90, p99, avgCost: mean * costPerRoll.value };
});

// ===== Actions =====
const selectCategory = (cat: "防具" | "武器" | null) => {
    selectedCategory.value = cat;
    selectedEquipType.value = null;
    selectedTargets.value = [];
};
const selectEquipType = (eq: EquipmentType) => {
    selectedEquipType.value = eq;
    selectedTargets.value = [];
};

// el-select handlers
const onCategoryChange = (v: string) => {
    if (v === "防具" || v === "武器") selectCategory(v);
};
const onEquipTypeChange = (id: string) => {
    const eq = currentSlotGroups.value.flatMap((g) => g.subtypes).find((e) => e.id === id);
    if (eq) selectEquipType(eq);
};

watch([selectedToolIdx, selectedRace], () => {
    selectedTargets.value = [];
});

// 選好裝備後自動縮起裝備卡
watch(selectedEquipType, (v) => { if (v) showEquipCard.value = false; });
// 選好工具後自動縮起工具卡
watch(selectedToolIdx, (v) => { if (v !== null) showToolCard.value = false; });

// 突破設定或活動狀態改變時，確保 minLevel 在 [toolMin, maxSettable] 範圍內
watch([effectiveBreakthroughProb, activityMode], () => {
    for (const t of selectedTargets.value) {
        const lo = getToolMinForEntry(t.entry);
        const hi = maxSettableMinLevel(t.entry);
        t.minLevel = Math.max(lo, Math.min(hi, t.minLevel));
    }
});

// ===== Formatting =====
const fmtValue = (stepValue: number, level: number, unit: string): string => {
    const v = stepValue * level;
    const s = Number.isInteger(v) ? v.toString() : v.toFixed(2).replace(/\.?0+$/, "");
    return `${s} ${unit}`.trim();
};

const fmtPct = (p: number): string =>
    p >= 0.01 ? `${(p * 100).toFixed(2)}%` : `1 / ${Math.round(1 / p).toLocaleString()}`;

// ===== 進行細工 =====
interface RollResultItem {
    entry: ReforgeEntry;
    level: number;
    isBreakthrough: boolean;
}
interface RollState {
    items: RollResultItem[];
    isSuccess: boolean;
    thisRunCount: number; // 本次花了幾次
}

const lastRoll = ref<RollState | null>(null);
const rollCount = ref<number>(0);
const successCount = ref<number>(0);
const autoMode = ref<boolean>(false);

const isItemHit = (item: RollResultItem): boolean =>
    selectedTargets.value.some((t) => t.name === item.entry.name && item.level >= t.minLevel);

const isItemTargeted = (item: RollResultItem): boolean => selectedTargets.value.some((t) => t.name === item.entry.name);

/** 單次抽選核心邏輯 */
const rollOnce = (): RollResultItem[] => {
    const pool = activePool.value;
    const indices = Array.from({ length: pool.length }, (_, i) => i);
    const drawCount = Math.min(3, pool.length);
    for (let i = 0; i < drawCount; i++) {
        const j = i + Math.floor(Math.random() * (pool.length - i));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const btProb = effectiveBreakthroughProb.value;
    return indices.slice(0, drawCount).map((idx) => {
        const entry = pool[idx];
        const isBt = btProb > 0 && Math.random() < btProb;
        const toolMin = getToolMinForEntry(entry);
        const level = isBt
            ? entry.maxLevel + 1 + Math.floor(Math.random() * (btMaxLevel(entry) - entry.maxLevel))
            : toolMin + Math.floor(Math.random() * (entry.maxLevel - toolMin + 1));
        return { entry, level, isBreakthrough: isBt };
    });
};

const checkTargets = (items: RollResultItem[]): boolean =>
    selectedTargets.value.length > 0 &&
    selectedTargets.value.every((t) => items.some((item) => item.entry.name === t.name && item.level >= t.minLevel));

/** 單次細工 */
const performRoll = () => {
    if (activePool.value.length === 0) return;
    const items = rollOnce();
    const success = checkTargets(items);
    if (success) successCount.value++;
    rollCount.value++;
    lastRoll.value = { items, isSuccess: success, thisRunCount: 1 };
};

/**
 * 構造一次「必定成功」的抽選結果，供自動模式顯示用：
 * - 目標詞條保證抽中且等級達標
 * - 剩餘槽位隨機填入非目標詞條
 */
const constructWinningRoll = (): RollResultItem[] => {
    const pool = activePool.value;
    const btProb = effectiveBreakthroughProb.value;
    const targets = selectedTargets.value;

    const items: RollResultItem[] = targets.map((t) => {
        const entry = t.entry;
        const mustBt = t.minLevel > entry.maxLevel; // 必須突破才能達標

        let isBt: boolean;
        let level: number;
        if (mustBt) {
            isBt = true;
            const btMin = Math.max(entry.maxLevel + 1, t.minLevel);
            const btMax = btMaxLevel(entry);
            level = btMin + Math.floor(Math.random() * Math.max(1, btMax - btMin + 1));
        } else {
            isBt = btProb > 0 && Math.random() < btProb;
            if (isBt) {
                const btMin = entry.maxLevel + 1;
                const btMax = btMaxLevel(entry);
                level = btMin + Math.floor(Math.random() * (btMax - btMin + 1));
            } else {
                level = t.minLevel + Math.floor(Math.random() * (entry.maxLevel - t.minLevel + 1));
            }
        }
        return { entry, level, isBreakthrough: isBt };
    });

    // 剩餘槽位填入隨機非目標詞條
    const targetNames = new Set(targets.map((t) => t.name));
    const available = pool.filter((e) => !targetNames.has(e.name));
    const fillCount = Math.min(3 - items.length, available.length);
    for (let i = 0; i < fillCount; i++) {
        const j = i + Math.floor(Math.random() * (available.length - i));
        [available[i], available[j]] = [available[j], available[i]];
        const entry = available[i];
        const isBt = btProb > 0 && Math.random() < btProb;
        const toolMin = getToolMinForEntry(entry);
        const level = isBt
            ? entry.maxLevel + 1 + Math.floor(Math.random() * (btMaxLevel(entry) - entry.maxLevel))
            : toolMin + Math.floor(Math.random() * (entry.maxLevel - toolMin + 1));
        items.push({ entry, level, isBreakthrough: isBt });
    }
    return items;
};

/**
 * 自動細工：幾何分布直接採樣次數，瞬間完成、無 UI 阻塞。
 * 原理：若每次成功率為 p，所需次數 N ~ Geometric(p)。
 *       N = ceil(log(U) / log(1-p))，U ~ Uniform(0,1)
 * 等價於逐次模擬，但不論 p 多小都能即時得出結果。
 */
const performAutoRoll = () => {
    if (!simResult.value || simResult.value.p <= 0 || selectedTargets.value.length === 0) return;
    const p = simResult.value.p;
    const u = Math.max(Number.EPSILON, Math.random());
    const count = Math.ceil(Math.log(u) / Math.log(1 - p));

    rollCount.value += count;
    successCount.value++;
    lastRoll.value = { items: constructWinningRoll(), isSuccess: true, thisRunCount: count };
};

const doRoll = () => {
    if (autoMode.value && selectedTargets.value.length > 0) {
        performAutoRoll();
    } else {
        performRoll();
    }
};

const showEquipCard = ref<boolean>(true);
const showToolCard  = ref<boolean>(true);
const showPoolCard  = ref<boolean>(true);
const showSimCard   = ref<boolean>(false);

const resetRollHistory = () => {
    lastRoll.value = null;
    rollCount.value = 0;
    successCount.value = 0;
};

// Reset roll history when core settings that affect the pool change
watch([selectedEquipType, selectedToolIdx, selectedRace], resetRollHistory);

// ===== Distribution Chart =====
const distChartEl = ref<HTMLElement | null>(null);
let distChart: echarts.ECharts | null = null;

const buildDistOption = (): object => {
    const sr = simResult.value!;
    const { p, p50, p90, p99 } = sr;
    const rc = rollCount.value;

    // 常態分佈近似參數（幾何分佈的常態近似）
    // μ = 1/p，σ = √(1-p) / p
    const mu = 1 / p;
    const sigma = Math.sqrt(1 - p) / p;

    // erf 近似（Abramowitz & Stegun）
    const erfApprox = (x: number): number => {
        const t = 1 / (1 + 0.3275911 * Math.abs(x));
        const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))));
        const r = 1 - poly * Math.exp(-x * x);
        return x >= 0 ? r : -r;
    };
    // 常態 CDF：P(X ≤ x)
    const normalCDF = (x: number): number => 0.5 * (1 + erfApprox((x - mu) / (sigma * Math.SQRT2)));
    // 常態化 PDF（峰值 = 1）：方便在 0–1 Y 軸上顯示
    const normPDF = (x: number): number => {
        const z = (x - mu) / sigma;
        return Math.exp(-0.5 * z * z);
    };

    // 此次達成的次數（僅成功時有意義）
    const thisRun = lastRoll.value?.isSuccess ? lastRoll.value.thisRunCount : null;
    const thisRunPR = thisRun !== null ? normalCDF(thisRun) * 100 : null;
    // 避免與「目前」重疊（第一次自動細工時 rc === thisRun）
    const showThisRun = thisRun !== null && thisRun !== rc;

    // X 軸範圍：涵蓋鐘型曲線主體（±4σ）並延伸至 P99 及目前次數
    const xMax = Math.ceil(Math.max(mu + 4.5 * sigma, rc > 0 ? rc * 1.1 : 0, p99 * 1.05));
    const step = Math.max(1, Math.ceil(xMax / 300));

    // 生成常態化 PDF 資料（Y ∈ [0, 1]）
    const data: [number, number][] = [];
    for (let n = 0; n <= xMax; n += step) {
        data.push([n, +normPDF(n).toFixed(5)]);
    }

    const currentPR = rc > 0 ? normalCDF(rc) * 100 : null;
    const fmtX = (v: number) => (v >= 10000 ? `${+(v / 10000).toFixed(1)}w` : v.toLocaleString());

    // P50 / P90 / P99 標線（使用幾何分佈精確值）
    const pctLines = [
        { name: "P50", xAxis: p50, color: "#4ade80" },
        { name: "P90", xAxis: p90, color: "#fb923c" },
        { name: "P99", xAxis: p99, color: "#f87171" },
    ];

    const markLineData: object[] = pctLines.map(({ name, xAxis, color }) => ({
        name,
        xAxis,
        lineStyle: { color, type: "dashed", width: 1.5 },
        label: { show: true, formatter: `${name}\n${fmtX(xAxis)}次`, color, fontSize: 10, position: "end" },
    }));

    // 目前（累計總次數）— 頂端標籤
    if (currentPR !== null) {
        markLineData.push({
            name: "目前",
            xAxis: rc,
            lineStyle: { color: "#fbbf24", type: "solid", width: 2 },
            label: {
                show: true,
                formatter: `目前\n${currentPR.toFixed(1)}%`,
                color: "#fbbf24",
                fontSize: 11,
                fontWeight: "bold",
                position: "end",
            },
        });
    }

    // 此次達成（本次花幾次）— 底端標籤，青色區隔
    if (showThisRun && thisRunPR !== null && thisRun !== null) {
        markLineData.push({
            name: "此次",
            xAxis: thisRun,
            lineStyle: { color: "#38bdf8", type: "dashed", width: 2 },
            label: {
                show: true,
                formatter: `此次\n${thisRunPR.toFixed(1)}%`,
                color: "#38bdf8",
                fontSize: 11,
                fontWeight: "bold",
                position: "start",
            },
        });
    }

    const series: Record<string, unknown> = {
        type: "line",
        data,
        smooth: true,
        symbol: "none",
        lineStyle: { color: "#60a5fa", width: 2 },
        areaStyle: {
            color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    { offset: 0, color: "rgba(96,165,250,0.3)" },
                    { offset: 1, color: "rgba(96,165,250,0.03)" },
                ],
            },
        },
        markLine: { silent: true, symbol: ["none", "none"], data: markLineData },
    };

    // 曲線上的圓點（對應 PDF 高度）
    const markPointItems: object[] = [];
    if (currentPR !== null) {
        markPointItems.push({
            coord: [rc, +normPDF(rc).toFixed(5)],
            symbol: "circle",
            symbolSize: 8,
            itemStyle: { color: "#fbbf24", borderColor: "#1f2937", borderWidth: 2 },
            label: { show: false },
        });
    }
    if (showThisRun && thisRunPR !== null && thisRun !== null) {
        markPointItems.push({
            coord: [thisRun, +normPDF(thisRun).toFixed(5)],
            symbol: "circle",
            symbolSize: 8,
            itemStyle: { color: "#38bdf8", borderColor: "#1f2937", borderWidth: 2 },
            label: { show: false },
        });
    }
    if (markPointItems.length > 0) {
        series.markPoint = { data: markPointItems };
    }

    return {
        backgroundColor: "transparent",
        animation: false,
        grid: { top: 16, right: 20, bottom: 46, left: 20 },
        xAxis: {
            type: "value",
            name: "洗詞次數",
            nameLocation: "middle",
            nameGap: 30,
            nameTextStyle: { color: "#6b7280", fontSize: 11 },
            min: 0,
            max: xMax,
            axisLabel: { color: "#9ca3af", fontSize: 11, formatter: fmtX },
            splitLine: { lineStyle: { color: "#374151" } },
            axisLine: { lineStyle: { color: "#4b5563" } },
            axisTick: { lineStyle: { color: "#4b5563" } },
        },
        yAxis: {
            type: "value",
            min: 0,
            max: 1,
            axisLabel: { show: false },
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: "#1f2937",
            borderColor: "#374151",
            textStyle: { color: "#e5e7eb", fontSize: 12 },
            formatter: (params: unknown) => {
                const p0 = (params as { data: [number, number] }[])[0];
                if (!p0?.data) return "";
                const x = p0.data[0];
                const pr = normalCDF(x) * 100;
                return `${x.toLocaleString()} 次<br/>累積機率 <b style="color:#60a5fa">${pr.toFixed(2)}%</b>`;
            },
        },
        series: [series],
    };
};

const updateDistChart = () => {
    if (!distChartEl.value || !simResult.value) return;
    // Guard: if echarts instance is bound to a stale DOM node, dispose and recreate
    if (distChart && distChart.getDom() !== distChartEl.value) {
        distChart.dispose();
        distChart = null;
    }
    if (!distChart) {
        distChart = echarts.init(distChartEl.value, null, { renderer: "canvas" });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    distChart.setOption(buildDistOption() as any, true);
};

const handleChartResize = () => distChart?.resize();

onMounted(() => {
    window.addEventListener("resize", handleChartResize);
    updateDistChart();
});

onUnmounted(() => {
    window.removeEventListener("resize", handleChartResize);
    distChart?.dispose();
    distChart = null;
});

watch([simResult, rollCount, lastRoll], updateDistChart, { flush: "post" });
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-5xl mx-auto">
            <header class="mb-8 text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    細工模擬器
                </h1>
                <p class="text-lg text-gray-400 mt-4">
                    模擬細工洗詞條所需次數與費用
                    <s class="text-gray-600 ml-2">負債金額</s>
                </p>
            </header>

            <!-- ── Card 1: 選擇裝備 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showEquipCard ? 'mb-4 border-b border-gray-700 pb-3' : ''"
                    @click="showEquipCard = !showEquipCard"
                >
                    <h2 class="text-xl font-bold text-accent">選擇裝備</h2>
                    <span class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showEquipCard ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                </div>

                <div v-show="showEquipCard" class="flex flex-wrap gap-5 items-end">
                    <!-- ① 分類 -->
                    <div>
                        <p class="step-label">① 分類</p>
                        <el-select
                            :model-value="selectedCategory ?? ''"
                            placeholder="選擇分類"
                            clearable
                            style="width: 110px"
                            @change="onCategoryChange"
                            @clear="selectCategory(null)"
                        >
                            <el-option label="防具" value="防具" />
                            <el-option label="武器" value="武器" />
                        </el-select>
                    </div>

                    <!-- ② 部位 / 類型 -->
                    <div v-if="selectedCategory">
                        <p class="step-label">② 部位 / 類型</p>
                        <el-select
                            :model-value="selectedEquipType?.id ?? ''"
                            placeholder="選擇部位"
                            style="width: 210px"
                            @change="onEquipTypeChange"
                        >
                            <el-option-group v-for="group in currentSlotGroups" :key="group.slot" :label="group.slot">
                                <el-option
                                    v-for="eq in group.subtypes"
                                    :key="eq.id"
                                    :label="selectedCategory === '防具' ? `${group.slot}・${eq.name}` : eq.name"
                                    :value="eq.id"
                                />
                            </el-option-group>
                        </el-select>
                    </div>

                    <!-- ③ 穿戴限制 -->
                    <div v-if="selectedEquipType">
                        <p class="step-label">③ 穿戴限制</p>
                        <el-select v-model="selectedRace" style="width: 175px">
                            <el-option v-for="race in RACE_OPTIONS" :key="race" :label="race" :value="race" />
                        </el-select>
                    </div>
                </div>
            </el-card>

            <!-- ── Card 2: 細工道具 ── -->
            <el-card v-if="selectedEquipType" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showToolCard ? 'mb-4 border-b border-gray-700 pb-3' : ''"
                    @click="showToolCard = !showToolCard"
                >
                    <h2 class="text-xl font-bold text-accent">細工道具</h2>
                    <span class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showToolCard ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                </div>
                <template v-if="showToolCard">
                <div class="mb-5">
                    <p class="step-label">④ 使用的道具</p>
                    <div class="flex gap-3 flex-wrap">
                        <div
                            v-for="(tool, idx) in REROLL_TOOLS"
                            :key="tool.id"
                            class="tool-chip"
                            :class="{ 'tool-chip--active': selectedToolIdx === idx }"
                            @click="selectedToolIdx = idx"
                        >
                            <img
                                :src="`${baseUrl}itemImage/${tool.id}.png`"
                                :alt="tool.name"
                                class="tool-icon"
                                @error="($event.target as HTMLImageElement).style.display = 'none'"
                            />
                            <span class="tool-name">{{ tool.name }}</span>
                            <span class="tool-prob">
                                突破：{{
                                    tool.breakthroughProb === 0 ? "無" : `${(tool.breakthroughProb * 100).toFixed(1)}%`
                                }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-4">
                    <el-checkbox v-model="doubleBreakthrough">
                        <span class="text-gray-200">細工突破上限機率增加</span>
                        <span
                            v-if="selectedTool && selectedTool.breakthroughProb > 0"
                            class="text-xs text-gray-400 ml-2"
                        >
                            {{ (selectedTool.breakthroughProb * 100).toFixed(1) }}% →
                            {{ (selectedTool.breakthroughProb * 2 * 100).toFixed(1) }}%
                        </span>
                    </el-checkbox>
                    <el-checkbox v-model="activityMode">
                        <span class="text-gray-200">細工最少等級補正增加</span>
                    </el-checkbox>
                </div>
                </template><!-- /showToolCard -->
            </el-card>



            <!-- ── Card 3: 詞條池 ── -->
            <el-card v-if="isReady" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-3 flex-wrap cursor-pointer select-none"
                    :class="showPoolCard ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showPoolCard = !showPoolCard"
                >
                    <h2 class="text-xl font-bold text-accent">詞條池</h2>
                    <el-tag type="info" size="small" @click.stop>{{ activePool.length }} 個</el-tag>
                    <span v-if="selectedRace !== '全種族'" class="text-xs text-green-500">
                        含{{ selectedRace }}專屬
                    </span>
                    <span class="ml-auto text-xs text-gray-500 hidden sm:inline">
                        每次洗詞隨機抽 3 個不重複，點擊列可選為目標（至多 3 個）
                    </span>
                    <span class="text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showPoolCard ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                </div>

                <template v-if="showPoolCard">
                <!-- 搜尋過濾 -->
                <div class="mb-3">
                    <el-input
                        v-model="filterText"
                        placeholder="搜尋詞條名稱…"
                        clearable
                        size="small"
                        style="max-width: 280px"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                    <span v-if="filterText" class="text-xs text-gray-500 ml-3">
                        顯示 {{ filteredPool.length }} / {{ activePool.length }} 個
                    </span>
                </div>

                <el-table
                    :data="filteredPool"
                    size="small"
                    :max-height="420"
                    :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                    :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                    :row-class-name="({ row }: { row: ReforgeEntry }) => (isTargeted(row.name) ? 'selected-row' : '')"
                    @row-click="(row: ReforgeEntry) => toggleTarget(row)"
                >
                    <el-table-column width="32" align="center">
                        <template #default="{ row }">
                            <span v-if="isTargeted(row.name)" class="text-yellow-400 text-base">✓</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="詞條名稱" min-width="170">
                        <template #default="{ row }">
                            <span :class="isTargeted(row.name) ? 'text-yellow-300 font-semibold' : ''">
                                {{ row.name }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="等級" width="150" align="center">
                        <template #default="{ row }">
                            <div>Lv.1 ～ {{ row.maxLevel }}</div>
                            <div v-if="effectiveBreakthroughProb > 0" class="text-yellow-400 text-xs mt-0.5">
                                突破 Lv.{{ btLevelRange(row)[0] }} ～ {{ btLevelRange(row)[1] }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="最大效果" min-width="140" align="right">
                        <template #default="{ row }">
                            <div class="text-green-400">{{ fmtValue(row.stepValue, row.maxLevel, row.unit) }}</div>
                            <div v-if="effectiveBreakthroughProb > 0" class="text-yellow-300 text-xs mt-0.5">
                                突破 {{ fmtValue(row.stepValue, btLevelRange(row)[1], row.unit) }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <p v-if="selectedTargets.length >= 3" class="text-xs text-orange-400 mt-2">
                    已選 3 個目標（上限），請先移除才能繼續新增
                </p>
                <div class="mt-4 flex justify-end">
                    <el-button type="primary" size="small" @click="showPoolCard = false">
                        選好了 ✓
                    </el-button>
                </div>
                </template><!-- /showPoolCard -->
            </el-card>

            <!-- ── 目標設定 ── -->
            <el-card
                v-if="isReady && selectedTargets.length > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
            >
                <div class="mb-3 border-b border-gray-700 pb-3 flex items-center gap-3">
                    <h2 class="text-xl font-bold text-accent">目標設定</h2>
                    <span class="text-xs text-gray-400">需在同一次洗詞中全部出現</span>
                    <el-button size="small" type="danger" plain class="ml-auto" @click="selectedTargets = []">
                        清除全部
                    </el-button>
                </div>

                <div class="flex flex-col gap-3">
                    <div v-for="(target, idx) in selectedTargets" :key="target.name" class="target-row">
                        <!-- Index badge -->
                        <span class="target-badge">{{ idx + 1 }}</span>

                        <!-- Name -->
                        <span class="target-name">{{ target.name }}</span>

                        <!-- Level probability hint -->
                        <span class="text-xs text-gray-500 hidden sm:inline">
                            (Lv.1 ～ {{ target.entry.maxLevel }}
                            <template v-if="effectiveBreakthroughProb > 0">
                                / 突破 ～ {{ btMaxLevel(target.entry) }}
                            </template>
                            )
                        </span>

                        <!-- Min Level input -->
                        <span class="text-xs text-gray-400 ml-auto">最低等級</span>
                        <el-input-number
                            v-model="target.minLevel"
                            :min="getToolMinForEntry(target.entry)"
                            :max="maxSettableMinLevel(target.entry)"
                            size="small"
                            controls-position="right"
                            style="width: 90px"
                        />

                        <!-- Level probability display -->
                        <span
                            class="text-xs w-16 text-right"
                            :class="
                                calcLevelProb(target.entry, target.minLevel) < 0.1
                                    ? 'text-orange-400'
                                    : 'text-green-400'
                            "
                        >
                            {{ (calcLevelProb(target.entry, target.minLevel) * 100).toFixed(1) }}%
                        </span>

                        <!-- Remove -->
                        <el-button size="small" type="danger" plain circle @click="selectedTargets.splice(idx, 1)">
                            ×
                        </el-button>
                    </div>
                </div>
            </el-card>

            <!-- ── Card 4: 進行細工 ── -->
            <el-card v-if="isReady" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">進行細工</h2>
                    <template v-if="rollCount > 0">
                        <span class="text-sm text-gray-400 ml-auto">
                            已洗
                            <span class="text-white font-bold">{{ rollCount.toLocaleString() }}</span>
                            次
                        </span>
                        <span v-if="selectedTargets.length > 0" class="text-sm text-gray-400">
                            成功
                            <span class="text-green-400 font-bold">{{ successCount.toLocaleString() }}</span>
                            次
                            <span class="text-gray-600">（{{ ((successCount / rollCount) * 100).toFixed(1) }}%）</span>
                        </span>
                    </template>
                </div>

                <!-- 設定摘要 -->
                <div class="mb-4 flex flex-wrap gap-2 items-center">
                    <el-tag type="warning" effect="dark">{{ selectedEquipType!.name }}</el-tag>
                    <el-tag type="primary" effect="dark">{{ selectedTool!.name }}</el-tag>
                    <el-tag v-if="effectiveBreakthroughProb > 0" type="warning" effect="plain">
                        突破 {{ (effectiveBreakthroughProb * 100).toFixed(1) }}%
                    </el-tag>
                    <el-tag type="info" effect="plain">每次抽 3 個・池 {{ activePool.length }} 個</el-tag>
                </div>

                <div class="flex items-center gap-3 mb-5 flex-wrap">
                    <el-button type="warning" size="large" @click="doRoll">
                        ⚒ {{ autoMode && selectedTargets.length > 0 ? "自動細工" : "進行細工" }}
                    </el-button>
                    <el-checkbox v-model="autoMode" :disabled="selectedTargets.length === 0">
                        <span class="text-sm" :class="selectedTargets.length === 0 ? 'text-gray-600' : 'text-gray-300'">
                            自動衝到達標
                        </span>
                        <span class="text-xs text-gray-600 ml-1">（需設定目標）</span>
                    </el-checkbox>
                    <el-button v-if="rollCount > 0" size="small" plain class="ml-auto" @click="resetRollHistory">
                        重置紀錄
                    </el-button>
                </div>

                <!-- Roll result -->
                <Transition name="roll-fade" mode="out-in">
                    <div v-if="lastRoll" :key="rollCount">
                        <!-- Success / fail banner -->
                        <div
                            v-if="selectedTargets.length > 0"
                            class="mb-3 py-2 px-4 rounded-lg font-bold text-center text-base"
                            :class="
                                lastRoll.isSuccess
                                    ? 'bg-green-900/40 border border-green-500 text-green-400'
                                    : 'bg-gray-900/40 border border-gray-700 text-gray-500'
                            "
                        >
                            {{ lastRoll.isSuccess ? "🎉 成功！所有目標達標" : "未達標，繼續加油" }}
                        </div>

                        <!-- 本次花了幾次（自動模式才顯示） -->
                        <div
                            v-if="lastRoll.thisRunCount > 1"
                            class="mb-3 flex flex-wrap items-center gap-3 px-1 text-sm"
                        >
                            <span class="text-gray-400">本次花了</span>
                            <span class="text-yellow-400 font-bold text-lg">
                                {{ lastRoll.thisRunCount.toLocaleString() }}
                            </span>
                            <span class="text-gray-400">次</span>
                            <template v-if="costPerRoll > 0">
                                <span class="text-gray-600">≈</span>
                                <span class="text-orange-400 font-semibold">
                                    {{ (lastRoll.thisRunCount * costPerRoll).toLocaleString() }}
                                </span>
                                <span class="text-gray-400">金</span>
                            </template>
                        </div>

                        <!-- 3 stat tiles -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div
                                v-for="item in lastRoll.items"
                                :key="item.entry.name"
                                class="roll-tile"
                                :class="{
                                    'roll-tile--hit': isItemHit(item),
                                    'roll-tile--miss': isItemTargeted(item) && !isItemHit(item),
                                    'roll-tile--bt': item.isBreakthrough,
                                }"
                            >
                                <!-- breakthrough badge (top-left) -->
                                <span v-if="item.isBreakthrough" class="roll-bt-badge">突破</span>

                                <!-- hit/miss indicator (top-right) -->
                                <span v-if="isItemHit(item)" class="roll-status roll-status--hit">✓</span>
                                <span v-else-if="isItemTargeted(item)" class="roll-status roll-status--miss">✗</span>

                                <!-- content -->
                                <div
                                    class="roll-name"
                                    :class="
                                        isItemHit(item)
                                            ? 'text-green-300'
                                            : isItemTargeted(item)
                                              ? 'text-orange-300'
                                              : 'text-gray-200'
                                    "
                                >
                                    {{ item.entry.name }}
                                </div>

                                <div
                                    class="roll-level"
                                    :class="item.isBreakthrough ? 'text-yellow-400' : 'text-blue-400'"
                                >
                                    Lv.{{ item.level }}
                                    <span class="text-xs text-gray-500 font-normal">
                                        /{{ item.isBreakthrough ? btMaxLevel(item.entry) : item.entry.maxLevel }}
                                    </span>
                                </div>

                                <div
                                    class="roll-value"
                                    :class="item.isBreakthrough ? 'text-yellow-300' : 'text-green-400'"
                                >
                                    {{ fmtValue(item.entry.stepValue, item.level, item.entry.unit) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </el-card>

            <!-- ── Card 5: 模擬計算 ── -->
            <el-card v-if="isReady" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showSimCard ? 'mb-4 border-b border-gray-700 pb-3' : ''"
                    @click="showSimCard = !showSimCard"
                >
                    <h2 class="text-xl font-bold text-accent">模擬計算</h2>
                    <span class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showSimCard ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                </div>

                <template v-if="showSimCard">
                <div class="mb-6">
                    <p class="text-sm text-gray-400 mb-2">每次洗詞花費（金幣，選填）</p>
                    <el-input-number v-model="costPerRoll" :min="0" :step="10000" :precision="0" style="width: 200px" />
                </div>

                <template v-if="simResult">
                    <!-- 機率分解 -->
                    <div class="mb-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm space-y-1">
                        <div class="flex gap-2 flex-wrap items-center text-gray-300">
                            <span>抽中機率：</span>
                            <span class="text-blue-400 font-mono">
                                {{
                                    simResult.targetCount === 1
                                        ? `3/${simResult.poolSize}`
                                        : simResult.targetCount === 2
                                          ? `6/(${simResult.poolSize}×${simResult.poolSize - 1})`
                                          : `6/(${simResult.poolSize}×${simResult.poolSize - 1}×${simResult.poolSize - 2})`
                                }}
                            </span>
                            <span class="text-gray-500">= {{ (simResult.drawP * 100).toFixed(3) }}%</span>
                        </div>
                        <div v-for="t in selectedTargets" :key="t.name" class="flex gap-2 items-center text-gray-300">
                            <span>等級達標（{{ t.name }} ≥ Lv.{{ t.minLevel }}）：</span>
                            <span
                                class="font-mono"
                                :class="calcLevelProb(t.entry, t.minLevel) < 0.1 ? 'text-orange-400' : 'text-green-400'"
                            >
                                {{ (calcLevelProb(t.entry, t.minLevel) * 100).toFixed(1) }}%
                            </span>
                        </div>
                        <div class="border-t border-gray-700 pt-1 flex gap-2 items-center">
                            <span class="text-gray-400">每次成功率 =</span>
                            <span class="text-yellow-400 font-bold">{{ fmtPct(simResult.p) }}</span>
                        </div>
                    </div>

                    <!-- Stats grid -->
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                        <div class="stat-card">
                            <div class="stat-label">平均洗次數</div>
                            <div class="stat-value text-blue-400">
                                {{
                                    simResult.mean < 10000
                                        ? simResult.mean.toFixed(1)
                                        : Math.round(simResult.mean).toLocaleString()
                                }}
                                次
                            </div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.avgCost).toLocaleString() }} 金
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">中位數（P50）</div>
                            <div class="stat-value text-green-400">{{ simResult.p50.toLocaleString() }} 次</div>
                            <div class="stat-sub">50% 機率在此次數內</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">P90</div>
                            <div class="stat-value text-orange-400">{{ simResult.p90.toLocaleString() }} 次</div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.p90 * costPerRoll).toLocaleString() }} 金
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">P99（最壞情況）</div>
                            <div class="stat-value text-red-400">{{ simResult.p99.toLocaleString() }} 次</div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.p99 * costPerRoll).toLocaleString() }} 金
                            </div>
                        </div>
                    </div>

                    <!-- 累積分布圖 -->
                    <div
                        ref="distChartEl"
                        style="width: 100%; height: 260px"
                        class="mt-4 rounded-lg overflow-hidden"
                    ></div>
                </template>

                <el-empty v-else description="在上方詞條池點選目標後即可計算" :image-size="60" />
                </template><!-- /showSimCard -->
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.step-label {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-bottom: 0.5rem;
}

/* Tool chips */
.tool-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 14px;
    background: #1f2937;
    border: 1.5px solid #374151;
    border-radius: 10px;
    cursor: pointer;
    transition:
        border-color 0.15s,
        background 0.15s;
    min-width: 120px;
    user-select: none;
}
.tool-chip:hover {
    border-color: #6b7280;
    background: #263548;
}
.tool-chip--active {
    border-color: #f59e0b;
    background: #2d2207;
}
.tool-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
    image-rendering: pixelated;
}
.tool-name {
    font-size: 0.8rem;
    font-weight: 600;
    color: #e5e7eb;
    text-align: center;
}
.tool-prob {
    font-size: 0.68rem;
    color: #9ca3af;
}
.tool-chip--active .tool-name {
    color: #fbbf24;
}
.tool-chip--active .tool-prob {
    color: #d97706;
}

/* Target rows */
.target-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 10px 14px;
}
.target-badge {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: #f59e0b;
    color: #000;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.target-name {
    font-weight: 600;
    color: #fbbf24;
    min-width: 120px;
}

/* Stat cards */
.stat-card {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.stat-label {
    font-size: 0.75rem;
    color: #9ca3af;
}
.stat-value {
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.2;
}
.stat-sub {
    font-size: 0.7rem;
    color: #6b7280;
}

/* Table */
:deep(.selected-row td) {
    background: #1c3a4f !important;
    border-color: #3b82f6 !important;
}
:deep(.el-table__row) {
    cursor: pointer;
}
:deep(.el-table__row:hover td) {
    background: #1f3040 !important;
}

/* ── Roll tiles ── */
.roll-tile {
    position: relative;
    background: #111827;
    border: 2px solid #374151;
    border-radius: 12px;
    padding: 1rem 0.85rem 0.8rem;
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-height: 96px;
    transition:
        border-color 0.15s,
        box-shadow 0.15s;
}
.roll-tile--hit {
    border-color: #22c55e;
    background: rgba(5, 46, 22, 0.4);
}
.roll-tile--miss {
    border-color: #f97316;
    background: rgba(67, 20, 7, 0.3);
}
.roll-tile--bt {
    box-shadow: 0 0 14px rgba(251, 191, 36, 0.25);
}
.roll-tile--hit.roll-tile--bt {
    border-color: #fbbf24;
}

.roll-bt-badge {
    position: absolute;
    top: 7px;
    left: 9px;
    font-size: 0.58rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    background: #f59e0b;
    color: #000;
    padding: 1px 5px;
    border-radius: 4px;
}
.roll-status {
    position: absolute;
    top: 7px;
    right: 9px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
}
.roll-status--hit {
    background: #22c55e;
    color: #000;
}
.roll-status--miss {
    background: #f97316;
    color: #fff;
}

.roll-name {
    font-size: 0.88rem;
    font-weight: 600;
    padding-top: 0.2rem;
    line-height: 1.3;
}
.roll-level {
    font-size: 1.15rem;
    font-weight: 700;
    line-height: 1.1;
}
.roll-value {
    font-size: 0.82rem;
}

/* Animation */
.roll-fade-enter-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}
.roll-fade-leave-active {
    transition: opacity 0.1s ease;
}
.roll-fade-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}
.roll-fade-leave-to {
    opacity: 0;
}
</style>
