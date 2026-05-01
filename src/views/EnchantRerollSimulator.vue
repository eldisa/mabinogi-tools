<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Search } from "@element-plus/icons-vue";
import reforgeDataRaw from "../../scripts/reforge_data.json";

// ===== Data Types =====
interface ReforgeEntry {
    name: string;
    maxLevel: number;
    baseValue: number;
    maxValue: number;
    unit: string;
}

interface ReforgeData {
    library: Record<string, ReforgeEntry>;
    pools: {
        base: string[];
        heavyOnly: string[];
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
    limits: string[];
    isHeavy: boolean;
}
interface SlotGroup { slot: string; subtypes: EquipmentType[]; }

const ARMOR_SLOT_GROUPS: SlotGroup[] = [
    {
        slot: "帽子",
        subtypes: [
            { id: "hat_normal", name: "一般帽", limits: ["頭部裝備"], isHeavy: false },
            { id: "hat_heavy", name: "重甲頭盔", limits: ["頭部裝備", "重甲"], isHeavy: true },
        ],
    },
    {
        slot: "上衣",
        subtypes: [
            { id: "cloth", name: "布衣", limits: ["布衣", "衣物"], isHeavy: false },
            { id: "light_armor", name: "輕甲", limits: ["輕甲", "衣物"], isHeavy: false },
            { id: "heavy_armor", name: "重甲", limits: ["重甲", "衣物"], isHeavy: true },
        ],
    },
    {
        slot: "手套",
        subtypes: [
            { id: "glove_normal", name: "一般手套", limits: ["手部裝備", "手"], isHeavy: false },
            { id: "glove_heavy", name: "重甲手套", limits: ["手部裝備", "重甲", "手"], isHeavy: true },
        ],
    },
    {
        slot: "鞋子",
        subtypes: [
            { id: "shoe_normal", name: "一般鞋", limits: ["腳部裝備"], isHeavy: false },
            { id: "shoe_heavy", name: "重甲鞋", limits: ["腳部裝備", "重甲"], isHeavy: true },
        ],
    },
    { slot: "飾品", subtypes: [{ id: "accessory", name: "飾品", limits: ["飾品"], isHeavy: false }] },
    { slot: "盾牌", subtypes: [{ id: "shield", name: "盾牌", limits: ["盾牌"], isHeavy: false }] },
];

const WEAPON_SLOT_GROUPS: SlotGroup[] = [
    {
        slot: "近戰",
        subtypes: [
            { id: "one_hand", name: "單手武器", limits: ["單手武器"], isHeavy: false },
            { id: "two_hand", name: "雙手武器", limits: ["雙手武器"], isHeavy: false },
            { id: "lance", name: "騎槍", limits: ["騎槍"], isHeavy: false },
            { id: "knuckle_w", name: "手把", limits: ["手把"], isHeavy: false },
            { id: "glove_w", name: "拳套", limits: ["拳套"], isHeavy: false },
            { id: "chain", name: "鎖鏈鐮刃", limits: ["鎖鏈鐮刃"], isHeavy: false },
        ],
    },
    {
        slot: "遠程",
        subtypes: [
            { id: "bow", name: "弓", limits: ["弓"], isHeavy: false },
            { id: "crossbow", name: "弩", limits: ["弩"], isHeavy: false },
            { id: "dual_gun", name: "雙槍", limits: ["雙槍"], isHeavy: false },
            { id: "shuriken", name: "手裡劍", limits: ["手裡劍"], isHeavy: false },
        ],
    },
    {
        slot: "魔法",
        subtypes: [
            { id: "wand", name: "短杖（魔杖）", limits: ["魔杖", "單手魔杖、集魔杖"], isHeavy: false },
            { id: "staff", name: "集魔杖", limits: ["集魔杖", "單手魔杖、集魔杖"], isHeavy: false },
            { id: "grimoire", name: "魔導書/水晶球", limits: ["魔導書、水晶球"], isHeavy: false },
            { id: "cylinder", name: "鋼瓶", limits: ["鋼瓶"], isHeavy: false },
        ],
    },
    { slot: "其他", subtypes: [{ id: "instrument", name: "樂器", limits: ["樂器"], isHeavy: false }] },
];

// ===== 細工道具 =====
interface RerollTool { id: number; name: string; shortName: string; breakthroughProb: number; }
const REROLL_TOOLS: RerollTool[] = [
    { id: 5050006, name: "普通細工道具", shortName: "普通", breakthroughProb: 0 },
    { id: 5050005, name: "精緻細工道具", shortName: "精緻", breakthroughProb: 0.001 },
    { id: 5050013, name: "璀璨細工道具", shortName: "璀璨", breakthroughProb: 0.001 },
    { id: 5050020, name: "燦爛細工道具", shortName: "燦爛", breakthroughProb: 0.005 },
];

// Race → pool key
const RACE_POOL_KEY: Record<string, string | null> = {
    "全種族": null, "人類限定": "human", "精靈限定": "elf",
    "人類/精靈限定": "human_elf", "人類/巨人限定": "human_giant", "巨人限定": "giant",
};
const RACE_OPTIONS = Object.keys(RACE_POOL_KEY);

// ===== State =====
const selectedCategory = ref<"防具" | "武器" | null>(null);
const selectedEquipType = ref<EquipmentType | null>(null);
const selectedRace = ref<string>("全種族");
const selectedToolIdx = ref<number | null>(null);
const doubleBreakthrough = ref<boolean>(false);
const filterText = ref<string>("");
const selectedTargets = ref<TargetEntry[]>([]); // max 3
const costPerRoll = ref<number>(0);

// ===== Derived =====
const currentSlotGroups = computed<SlotGroup[]>(() => {
    if (selectedCategory.value === "防具") return ARMOR_SLOT_GROUPS;
    if (selectedCategory.value === "武器") return WEAPON_SLOT_GROUPS;
    return [];
});

const selectedTool = computed(() =>
    selectedToolIdx.value !== null ? REROLL_TOOLS[selectedToolIdx.value] : null,
);

const effectiveBreakthroughProb = computed((): number => {
    if (!selectedTool.value) return 0;
    const base = selectedTool.value.breakthroughProb;
    return doubleBreakthrough.value ? base * 2 : base;
});

const isReady = computed(
    () => selectedEquipType.value !== null && selectedToolIdx.value !== null,
);

// ===== Breakthrough helpers =====
const btMaxLevel = (entry: ReforgeEntry): number => Math.ceil(entry.maxLevel * 1.25);
const btLevelRange = (entry: ReforgeEntry): [number, number] => [entry.maxLevel + 1, btMaxLevel(entry)];

/** 一個詞條能填入的最低等級上限（考慮突破） */
const maxSettableMinLevel = (entry: ReforgeEntry): number =>
    effectiveBreakthroughProb.value > 0 ? btMaxLevel(entry) : entry.maxLevel;

// ===== Pool =====
const activePool = computed((): ReforgeEntry[] => {
    if (!isReady.value) return [];
    const names = new Set<string>(reforgeData.pools.base);
    if (selectedEquipType.value!.isHeavy)
        reforgeData.pools.heavyOnly.forEach((n) => names.add(n));
    const raceKey = RACE_POOL_KEY[selectedRace.value];
    if (raceKey && reforgeData.pools.races[raceKey])
        reforgeData.pools.races[raceKey].forEach((n) => names.add(n));
    return Array.from(names)
        .map((n) => reforgeData.library[n])
        .filter((e): e is ReforgeEntry => !!e);
});

const filteredPool = computed((): ReforgeEntry[] => {
    const q = filterText.value.trim();
    if (!q) return activePool.value;
    return activePool.value.filter((e) => e.name.includes(q));
});

// ===== Target Selection =====
const isTargeted = (name: string): boolean =>
    selectedTargets.value.some((t) => t.name === name);

const toggleTarget = (row: ReforgeEntry) => {
    const idx = selectedTargets.value.findIndex((t) => t.name === row.name);
    if (idx >= 0) {
        selectedTargets.value.splice(idx, 1);
    } else if (selectedTargets.value.length < 3) {
        selectedTargets.value.push({ name: row.name, minLevel: 1, entry: row });
    }
};

// ===== Probability Helpers =====
/** P(level >= minLv | one drawn stat) accounting for breakthrough */
const calcLevelProb = (entry: ReforgeEntry, minLv: number): number => {
    const btProb = effectiveBreakthroughProb.value;
    // Normal (no breakthrough): uniform over [1, maxLevel]
    const pNormal =
        minLv <= entry.maxLevel ? (entry.maxLevel - minLv + 1) / entry.maxLevel : 0;
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
    p: number; drawP: number; levelP: number;
    poolSize: number; targetCount: number;
    mean: number; p50: number; p90: number; p99: number;
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
const selectCategory = (cat: "防具" | "武器") => {
    selectedCategory.value = cat;
    selectedEquipType.value = null;
    selectedTargets.value = [];
};
const selectEquipType = (eq: EquipmentType) => {
    selectedEquipType.value = eq;
    selectedTargets.value = [];
};

watch([selectedToolIdx, selectedRace], () => { selectedTargets.value = []; });

// Clamp minLevel when breakthrough changes
watch(effectiveBreakthroughProb, () => {
    for (const t of selectedTargets.value) {
        const max = maxSettableMinLevel(t.entry);
        if (t.minLevel > max) t.minLevel = max;
    }
});

// ===== Formatting =====
const fmtValue = (baseValue: number, level: number, unit: string): string => {
    const v = baseValue * level;
    const s = Number.isInteger(v) ? v.toString() : v.toFixed(2).replace(/\.?0+$/, "");
    return `${s} ${unit}`.trim();
};

const fmtPct = (p: number): string =>
    p >= 0.01 ? `${(p * 100).toFixed(2)}%` : `1 / ${Math.round(1 / p).toLocaleString()}`;
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-5xl mx-auto">
            <header class="mb-8 text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    洗詞條模擬器
                </h1>
                <p class="text-lg text-gray-400 mt-4">模擬賦予洗詞條所需次數與費用</p>
            </header>

            <!-- ── Card 1: 選擇裝備 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">選擇裝備</h2>
                </div>

                <div class="mb-5">
                    <p class="step-label">① 裝備大分類</p>
                    <div class="flex gap-3 flex-wrap">
                        <el-tag
                            v-for="cat in ['防具', '武器'] as const" :key="cat"
                            :type="selectedCategory === cat ? 'warning' : 'info'"
                            :effect="selectedCategory === cat ? 'dark' : 'plain'"
                            size="large" class="cursor-pointer select-none"
                            @click="selectCategory(cat)"
                        >{{ cat }}</el-tag>
                    </div>
                </div>

                <div v-if="selectedCategory" class="mb-5">
                    <p class="step-label">② 裝備部位 / 類型</p>
                    <div v-for="group in currentSlotGroups" :key="group.slot" class="mb-3">
                        <span v-if="selectedCategory === '武器'"
                            class="text-xs text-gray-500 mr-2 font-semibold uppercase tracking-wide"
                        >{{ group.slot }}</span>
                        <div class="flex gap-2 flex-wrap mt-1">
                            <el-tag
                                v-for="eq in group.subtypes" :key="eq.id"
                                :type="selectedEquipType?.id === eq.id ? 'warning' : 'info'"
                                :effect="selectedEquipType?.id === eq.id ? 'dark' : 'plain'"
                                class="cursor-pointer select-none"
                                @click="selectEquipType(eq)"
                            >
                                {{ selectedCategory === "防具" ? `${group.slot}・${eq.name}` : eq.name }}
                            </el-tag>
                        </div>
                    </div>
                </div>

                <div v-if="selectedEquipType">
                    <p class="step-label">③ 穿戴限制</p>
                    <div class="flex gap-2 flex-wrap">
                        <el-tag
                            v-for="race in RACE_OPTIONS" :key="race"
                            :type="selectedRace === race ? 'success' : 'info'"
                            :effect="selectedRace === race ? 'dark' : 'plain'"
                            class="cursor-pointer select-none"
                            @click="selectedRace = race"
                        >{{ race }}</el-tag>
                    </div>
                </div>
            </el-card>

            <!-- ── Card 2: 細工道具 ── -->
            <el-card v-if="selectedEquipType"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">細工道具</h2>
                </div>
                <div class="mb-5">
                    <p class="step-label">④ 使用的道具</p>
                    <div class="flex gap-3 flex-wrap">
                        <div
                            v-for="(tool, idx) in REROLL_TOOLS" :key="tool.id"
                            class="tool-chip" :class="{ 'tool-chip--active': selectedToolIdx === idx }"
                            @click="selectedToolIdx = idx"
                        >
                            <img
                                :src="`${baseUrl}itemImage/${tool.id}.png`" :alt="tool.name"
                                class="tool-icon"
                                @error="($event.target as HTMLImageElement).style.display = 'none'"
                            />
                            <span class="tool-name">{{ tool.name }}</span>
                            <span class="tool-prob">
                                突破：{{ tool.breakthroughProb === 0 ? "無" : `${(tool.breakthroughProb * 100).toFixed(1)}%` }}
                            </span>
                        </div>
                    </div>
                </div>
                <el-checkbox v-model="doubleBreakthrough"
                    :disabled="!selectedTool || selectedTool.breakthroughProb === 0">
                    <span class="text-gray-200">突破機率加倍</span>
                    <span v-if="selectedTool && selectedTool.breakthroughProb > 0"
                        class="text-xs text-gray-400 ml-2">
                        {{ (selectedTool.breakthroughProb * 100).toFixed(1) }}% →
                        {{ (selectedTool.breakthroughProb * 2 * 100).toFixed(1) }}%
                    </span>
                </el-checkbox>
            </el-card>

            <!-- ── 設定摘要 ── -->
            <div v-if="isReady" class="mb-4 flex flex-wrap gap-2 items-center px-1">
                <el-tag type="warning" effect="dark">{{ selectedEquipType!.name }}</el-tag>
                <el-tag type="primary" effect="dark">{{ selectedTool!.name }}</el-tag>
                <el-tag v-if="effectiveBreakthroughProb > 0" type="warning" effect="plain">
                    突破 {{ (effectiveBreakthroughProb * 100).toFixed(1) }}%
                </el-tag>
                <el-tag type="info" effect="plain">
                    每次抽 3 個・池 {{ activePool.length }} 個
                </el-tag>
            </div>

            <!-- ── Card 3: 詞條池 ── -->
            <el-card v-if="isReady"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-3 border-b border-gray-700 pb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">詞條池</h2>
                    <el-tag type="info" size="small">{{ activePool.length }} 個</el-tag>
                    <span v-if="selectedEquipType!.isHeavy" class="text-xs text-yellow-500">含重甲專屬</span>
                    <span v-if="RACE_POOL_KEY[selectedRace]" class="text-xs text-green-500">含{{ selectedRace }}專屬</span>
                    <span class="ml-auto text-xs text-gray-500">
                        每次洗詞隨機抽 3 個不重複，點擊列可選為目標（至多 3 個）
                    </span>
                </div>

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
                    :row-class-name="({ row }: { row: ReforgeEntry }) => isTargeted(row.name) ? 'selected-row' : ''"
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

                    <el-table-column label="一般等級" width="110" align="center">
                        <template #default="{ row }">Lv.1 ～ {{ row.maxLevel }}</template>
                    </el-table-column>

                    <el-table-column label="最大效果" min-width="140" align="right">
                        <template #default="{ row }">
                            <span class="text-green-400">{{ fmtValue(row.baseValue, row.maxLevel, row.unit) }}</span>
                        </template>
                    </el-table-column>

                    <template v-if="effectiveBreakthroughProb > 0">
                        <el-table-column label="突破等級" width="120" align="center">
                            <template #default="{ row }">
                                <span class="text-yellow-400">
                                    Lv.{{ btLevelRange(row)[0] }} ～ {{ btLevelRange(row)[1] }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="突破最大效果" min-width="150" align="right">
                            <template #default="{ row }">
                                <span class="text-yellow-300">
                                    {{ fmtValue(row.baseValue, btLevelRange(row)[1], row.unit) }}
                                </span>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>

                <p v-if="selectedTargets.length >= 3" class="text-xs text-orange-400 mt-2">
                    已選 3 個目標（上限），請先移除才能繼續新增
                </p>
            </el-card>

            <!-- ── 目標設定 ── -->
            <el-card v-if="isReady && selectedTargets.length > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-3 border-b border-gray-700 pb-3 flex items-center gap-3">
                    <h2 class="text-xl font-bold text-accent">目標設定</h2>
                    <span class="text-xs text-gray-400">需在同一次洗詞中全部出現</span>
                    <el-button
                        size="small" type="danger" plain class="ml-auto"
                        @click="selectedTargets = []"
                    >清除全部</el-button>
                </div>

                <div class="flex flex-col gap-3">
                    <div
                        v-for="(target, idx) in selectedTargets"
                        :key="target.name"
                        class="target-row"
                    >
                        <!-- Index badge -->
                        <span class="target-badge">{{ idx + 1 }}</span>

                        <!-- Name -->
                        <span class="target-name">{{ target.name }}</span>

                        <!-- Level probability hint -->
                        <span class="text-xs text-gray-500 hidden sm:inline">
                            (Lv.1 ～ {{ target.entry.maxLevel }}
                            <template v-if="effectiveBreakthroughProb > 0">
                                / 突破 ～ {{ btMaxLevel(target.entry) }}
                            </template>)
                        </span>

                        <!-- Min Level input -->
                        <span class="text-xs text-gray-400 ml-auto">最低等級</span>
                        <el-input-number
                            v-model="target.minLevel"
                            :min="1"
                            :max="maxSettableMinLevel(target.entry)"
                            size="small"
                            controls-position="right"
                            style="width: 90px"
                        />

                        <!-- Level probability display -->
                        <span class="text-xs w-16 text-right"
                            :class="calcLevelProb(target.entry, target.minLevel) < 0.1 ? 'text-orange-400' : 'text-green-400'"
                        >
                            {{ (calcLevelProb(target.entry, target.minLevel) * 100).toFixed(1) }}%
                        </span>

                        <!-- Remove -->
                        <el-button size="small" type="danger" plain circle
                            @click="selectedTargets.splice(idx, 1)"
                        >×</el-button>
                    </div>
                </div>
            </el-card>

            <!-- ── Card 4: 模擬計算 ── -->
            <el-card v-if="isReady"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">模擬計算</h2>
                </div>

                <div class="mb-6">
                    <p class="text-sm text-gray-400 mb-2">每次洗詞花費（金幣，選填）</p>
                    <el-input-number
                        v-model="costPerRoll" :min="0" :step="10000" :precision="0"
                        style="width: 200px"
                    />
                </div>

                <template v-if="simResult">
                    <!-- 機率分解 -->
                    <div class="mb-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-sm space-y-1">
                        <div class="flex gap-2 flex-wrap items-center text-gray-300">
                            <span>抽中機率：</span>
                            <span class="text-blue-400 font-mono">
                                {{ simResult.targetCount === 1 ? `3/${simResult.poolSize}` :
                                   simResult.targetCount === 2 ? `6/(${simResult.poolSize}×${simResult.poolSize-1})` :
                                   `6/(${simResult.poolSize}×${simResult.poolSize-1}×${simResult.poolSize-2})` }}
                            </span>
                            <span class="text-gray-500">= {{ (simResult.drawP * 100).toFixed(3) }}%</span>
                        </div>
                        <div
                            v-for="t in selectedTargets" :key="t.name"
                            class="flex gap-2 items-center text-gray-300"
                        >
                            <span>等級達標（{{ t.name }} ≥ Lv.{{ t.minLevel }}）：</span>
                            <span class="font-mono"
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
                                {{ simResult.mean < 10000 ? simResult.mean.toFixed(1) : Math.round(simResult.mean).toLocaleString() }} 次
                            </div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.avgCost).toLocaleString() }} 金
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">中位數（P50）</div>
                            <div class="stat-value text-green-400">
                                {{ simResult.p50.toLocaleString() }} 次
                            </div>
                            <div class="stat-sub">50% 機率在此次數內</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">P90</div>
                            <div class="stat-value text-orange-400">
                                {{ simResult.p90.toLocaleString() }} 次
                            </div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.p90 * costPerRoll).toLocaleString() }} 金
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">P99（最壞情況）</div>
                            <div class="stat-value text-red-400">
                                {{ simResult.p99.toLocaleString() }} 次
                            </div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.p99 * costPerRoll).toLocaleString() }} 金
                            </div>
                        </div>
                    </div>

                    <!-- Cumulative probability -->
                    <p class="text-sm text-gray-400 mb-2">累積成功機率</p>
                    <div class="flex flex-wrap gap-2">
                        <div v-for="n in [1, 5, 10, 20, 50, 100, 200, 500]" :key="n" class="prob-chip">
                            <span class="text-gray-400 text-xs">{{ n }} 次</span>
                            <span class="font-semibold text-sm text-white">
                                {{ ((1 - Math.pow(1 - simResult.p, n)) * 100).toFixed(1) }}%
                            </span>
                        </div>
                    </div>
                </template>

                <el-empty v-else description="在上方詞條池點選目標後即可計算" :image-size="60" />
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.step-label { font-size: 0.8rem; color: #9ca3af; margin-bottom: 0.5rem; }

/* Tool chips */
.tool-chip {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 10px 14px; background: #1f2937; border: 1.5px solid #374151;
    border-radius: 10px; cursor: pointer;
    transition: border-color 0.15s, background 0.15s; min-width: 120px; user-select: none;
}
.tool-chip:hover { border-color: #6b7280; background: #263548; }
.tool-chip--active { border-color: #f59e0b; background: #2d2207; }
.tool-icon { width: 48px; height: 48px; object-fit: contain; image-rendering: pixelated; }
.tool-name { font-size: 0.8rem; font-weight: 600; color: #e5e7eb; text-align: center; }
.tool-prob { font-size: 0.68rem; color: #9ca3af; }
.tool-chip--active .tool-name { color: #fbbf24; }
.tool-chip--active .tool-prob { color: #d97706; }

/* Target rows */
.target-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    background: #111827; border: 1px solid #374151; border-radius: 8px; padding: 10px 14px;
}
.target-badge {
    width: 22px; height: 22px; border-radius: 50%; background: #f59e0b;
    color: #000; font-size: 0.75rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.target-name { font-weight: 600; color: #fbbf24; min-width: 120px; }

/* Stat cards */
.stat-card {
    background: #111827; border: 1px solid #374151; border-radius: 10px;
    padding: 1rem; display: flex; flex-direction: column; gap: 4px;
}
.stat-label { font-size: 0.75rem; color: #9ca3af; }
.stat-value { font-size: 1.4rem; font-weight: 700; line-height: 1.2; }
.stat-sub { font-size: 0.7rem; color: #6b7280; }

/* Probability chips */
.prob-chip {
    background: #1f2937; border: 1px solid #374151; border-radius: 8px;
    padding: 4px 12px; display: flex; flex-direction: column;
    align-items: center; gap: 2px; min-width: 64px;
}

/* Table */
:deep(.selected-row td) { background: #1c3a4f !important; border-color: #3b82f6 !important; }
:deep(.el-table__row) { cursor: pointer; }
:deep(.el-table__row:hover td) { background: #1f3040 !important; }
</style>
