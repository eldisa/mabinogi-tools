<script setup lang="ts">
import { ref, computed, watch } from "vue";
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

const reforgeData = reforgeDataRaw as ReforgeData;

// ===== Image base URL =====
const baseUrl = import.meta.env.BASE_URL;

// ===== Equipment Types =====
interface EquipmentType {
    id: string;
    name: string;
    limits: string[];
    isHeavy: boolean;
}

interface SlotGroup {
    slot: string;
    subtypes: EquipmentType[];
}

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
    {
        slot: "飾品",
        subtypes: [{ id: "accessory", name: "飾品", limits: ["飾品"], isHeavy: false }],
    },
    {
        slot: "盾牌",
        subtypes: [{ id: "shield", name: "盾牌", limits: ["盾牌"], isHeavy: false }],
    },
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
    {
        slot: "其他",
        subtypes: [{ id: "instrument", name: "樂器", limits: ["樂器"], isHeavy: false }],
    },
];

// ===== 細工道具 =====
interface RerollTool {
    id: number;
    name: string;
    shortName: string;
    breakthroughProb: number;
}

const REROLL_TOOLS: RerollTool[] = [
    { id: 5050006, name: "普通細工道具", shortName: "普通", breakthroughProb: 0 },
    { id: 5050005, name: "精緻細工道具", shortName: "精緻", breakthroughProb: 0.001 },
    { id: 5050013, name: "璀璨細工道具", shortName: "璀璨", breakthroughProb: 0.001 },
    { id: 5050020, name: "燦爛細工道具", shortName: "燦爛", breakthroughProb: 0.005 },
];

// ===== Min Level Table =====
// Column order: [普通, 精緻, 璀璨, 燦爛] — each { normal, event }
interface MinLevelEntry { normal: number; event: number; }
const MIN_LEVEL_TABLE: Array<{ maxLevel: number; tools: MinLevelEntry[] }> = [
    { maxLevel: 1,  tools: [{ normal:1,event:1 }, { normal:1,event:1 }, { normal:1,event:1 }, { normal:1,event:1 }] },
    { maxLevel: 3,  tools: [{ normal:1,event:1 }, { normal:1,event:1 }, { normal:1,event:1 }, { normal:1,event:2 }] },
    { maxLevel: 5,  tools: [{ normal:1,event:2 }, { normal:2,event:2 }, { normal:2,event:2 }, { normal:2,event:3 }] },
    { maxLevel: 6,  tools: [{ normal:1,event:2 }, { normal:2,event:2 }, { normal:2,event:3 }, { normal:3,event:3 }] },
    { maxLevel: 7,  tools: [{ normal:1,event:3 }, { normal:3,event:3 }, { normal:3,event:3 }, { normal:3,event:4 }] },
    { maxLevel: 8,  tools: [{ normal:1,event:3 }, { normal:3,event:3 }, { normal:3,event:4 }, { normal:4,event:4 }] },
    { maxLevel: 10, tools: [{ normal:1,event:4 }, { normal:4,event:4 }, { normal:4,event:5 }, { normal:5,event:5 }] },
    { maxLevel: 12, tools: [{ normal:1,event:4 }, { normal:4,event:5 }, { normal:5,event:5 }, { normal:5,event:6 }] },
    { maxLevel: 15, tools: [{ normal:1,event:5 }, { normal:5,event:6 }, { normal:6,event:7 }, { normal:7,event:8 }] },
    { maxLevel: 20, tools: [{ normal:1,event:7 }, { normal:7,event:8 }, { normal:8,event:9 }, { normal:9,event:10 }] },
];
const EQUIP_MAX_LEVELS = MIN_LEVEL_TABLE.map((r) => r.maxLevel);

// Race → pool key mapping
const RACE_POOL_KEY: Record<string, string | null> = {
    "全種族": null,
    "人類限定": "human",
    "精靈限定": "elf",
    "人類/精靈限定": "human_elf",
    "人類/巨人限定": "human_giant",
    "巨人限定": "giant",
};

const RACE_OPTIONS = Object.keys(RACE_POOL_KEY);

// ===== State =====
const selectedCategory = ref<"防具" | "武器" | null>(null);
const selectedEquipType = ref<EquipmentType | null>(null);
const selectedRace = ref<string>("全種族");
const selectedMaxLevel = ref<number | null>(null);
const selectedToolIdx = ref<number | null>(null);
const isEventPeriod = ref<boolean>(false);
const doubleBreakthrough = ref<boolean>(false);
const selectedTargetName = ref<string | null>(null);
const costPerRoll = ref<number>(0);

// ===== Derived: slot groups =====
const currentSlotGroups = computed<SlotGroup[]>(() => {
    if (selectedCategory.value === "防具") return ARMOR_SLOT_GROUPS;
    if (selectedCategory.value === "武器") return WEAPON_SLOT_GROUPS;
    return [];
});

// ===== Tool / Level Computeds =====
const selectedTool = computed(() =>
    selectedToolIdx.value !== null ? REROLL_TOOLS[selectedToolIdx.value] : null,
);

const minLevelEntry = computed((): MinLevelEntry | null => {
    if (selectedMaxLevel.value === null || selectedToolIdx.value === null) return null;
    const row = MIN_LEVEL_TABLE.find((r) => r.maxLevel === selectedMaxLevel.value);
    return row?.tools[selectedToolIdx.value] ?? null;
});

const effectiveMinLevel = computed((): number => {
    if (!minLevelEntry.value) return 1;
    return isEventPeriod.value ? minLevelEntry.value.event : minLevelEntry.value.normal;
});

const effectiveBreakthroughProb = computed((): number => {
    if (!selectedTool.value) return 0;
    const base = selectedTool.value.breakthroughProb;
    return doubleBreakthrough.value ? base * 2 : base;
});

const isReady = computed(
    () =>
        selectedEquipType.value !== null &&
        selectedMaxLevel.value !== null &&
        selectedToolIdx.value !== null,
);

// ===== Reforge Pool Construction =====
const activePool = computed((): ReforgeEntry[] => {
    if (!isReady.value) return [];
    const minLv = effectiveMinLevel.value;

    // 1. Base pool
    const names = new Set<string>(reforgeData.pools.base);

    // 2. Heavy armor addition
    if (selectedEquipType.value!.isHeavy) {
        reforgeData.pools.heavyOnly.forEach((n) => names.add(n));
    }

    // 3. Race pool
    const raceKey = RACE_POOL_KEY[selectedRace.value];
    if (raceKey && reforgeData.pools.races[raceKey]) {
        reforgeData.pools.races[raceKey].forEach((n) => names.add(n));
    }

    // 4. Level filter: item must be reachable (maxLevel >= minLv)
    return Array.from(names)
        .map((n) => reforgeData.library[n])
        .filter((e): e is ReforgeEntry => !!e && e.maxLevel >= minLv);
});

// Effective max level for each entry (capped by equipment)
const effectiveMaxLevelForEntry = (entry: ReforgeEntry): number =>
    Math.min(entry.maxLevel, selectedMaxLevel.value ?? entry.maxLevel);

const effectiveMaxValueForEntry = (entry: ReforgeEntry): number => {
    const lv = effectiveMaxLevelForEntry(entry);
    return entry.baseValue * lv;
};

// ===== Simulation =====
interface SimResult {
    p: number;
    poolSize: number;
    mean: number;
    p50: number;
    p90: number;
    p99: number;
    avgCost: number;
}

const simResult = computed((): SimResult | null => {
    if (!selectedTargetName.value || activePool.value.length === 0) return null;
    const poolSize = activePool.value.length;
    const p = 1 / poolSize;
    const mean = poolSize;
    const p50 = Math.ceil(Math.log(0.5) / Math.log(1 - p));
    const p90 = Math.ceil(Math.log(0.1) / Math.log(1 - p));
    const p99 = Math.ceil(Math.log(0.01) / Math.log(1 - p));
    return { p, poolSize, mean, p50, p90, p99, avgCost: mean * costPerRoll.value };
});

// ===== Actions =====
const selectCategory = (cat: "防具" | "武器") => {
    selectedCategory.value = cat;
    selectedEquipType.value = null;
    selectedMaxLevel.value = null;
    selectedTargetName.value = null;
};

const selectEquipType = (eq: EquipmentType) => {
    selectedEquipType.value = eq;
    selectedTargetName.value = null;
};

watch([selectedMaxLevel, selectedToolIdx, isEventPeriod, selectedRace], () => {
    selectedTargetName.value = null;
});

// ===== Formatting =====
const formatValue = (entry: ReforgeEntry): string => {
    const maxLv = effectiveMaxLevelForEntry(entry);
    const val = entry.baseValue * maxLv;
    // For negative values (reduction effects), show actual value
    const formatted = Number.isInteger(val) ? val.toString() : val.toFixed(2).replace(/\.?0+$/, "");
    return `${formatted} ${entry.unit}`.trim();
};

const formatLevelRange = (entry: ReforgeEntry): string => {
    const minLv = effectiveMinLevel.value;
    const maxLv = effectiveMaxLevelForEntry(entry);
    if (minLv === maxLv) return `Lv.${minLv}`;
    return `Lv.${minLv} ～ ${maxLv}`;
};
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

                <!-- ① 大分類 -->
                <div class="mb-5">
                    <p class="step-label">① 裝備大分類</p>
                    <div class="flex gap-3 flex-wrap">
                        <el-tag
                            v-for="cat in ['防具', '武器'] as const"
                            :key="cat"
                            :type="selectedCategory === cat ? 'warning' : 'info'"
                            :effect="selectedCategory === cat ? 'dark' : 'plain'"
                            size="large"
                            class="cursor-pointer select-none"
                            @click="selectCategory(cat)"
                        >
                            {{ cat }}
                        </el-tag>
                    </div>
                </div>

                <!-- ② 部位 / 類型 -->
                <div v-if="selectedCategory" class="mb-5">
                    <p class="step-label">② 裝備部位 / 類型</p>
                    <div v-for="group in currentSlotGroups" :key="group.slot" class="mb-3">
                        <span
                            v-if="selectedCategory === '武器'"
                            class="text-xs text-gray-500 mr-2 font-semibold uppercase tracking-wide"
                        >
                            {{ group.slot }}
                        </span>
                        <div class="flex gap-2 flex-wrap mt-1">
                            <el-tag
                                v-for="eq in group.subtypes"
                                :key="eq.id"
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

                <!-- ③ 穿戴限制 -->
                <div v-if="selectedEquipType" class="mb-5">
                    <p class="step-label">③ 穿戴限制</p>
                    <div class="flex gap-2 flex-wrap">
                        <el-tag
                            v-for="race in RACE_OPTIONS"
                            :key="race"
                            :type="selectedRace === race ? 'success' : 'info'"
                            :effect="selectedRace === race ? 'dark' : 'plain'"
                            class="cursor-pointer select-none"
                            @click="selectedRace = race"
                        >
                            {{ race }}
                        </el-tag>
                    </div>
                </div>

                <!-- ④ 選項最大值 -->
                <div v-if="selectedEquipType">
                    <p class="step-label">④ 選項最大值（裝備能賦予的最高等級）</p>
                    <div class="flex gap-2 flex-wrap">
                        <el-tag
                            v-for="lv in EQUIP_MAX_LEVELS"
                            :key="lv"
                            :type="selectedMaxLevel === lv ? 'warning' : 'info'"
                            :effect="selectedMaxLevel === lv ? 'dark' : 'plain'"
                            class="cursor-pointer select-none"
                            @click="selectedMaxLevel = lv"
                        >
                            Lv.{{ lv }}
                        </el-tag>
                    </div>
                </div>
            </el-card>

            <!-- ── Card 2: 細工道具 ── -->
            <el-card
                v-if="selectedEquipType && selectedMaxLevel !== null"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
            >
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">細工道具</h2>
                </div>

                <!-- 道具選擇 -->
                <div class="mb-5">
                    <p class="step-label">⑤ 使用的道具</p>
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
                                    tool.breakthroughProb === 0
                                        ? "無"
                                        : `${(tool.breakthroughProb * 100).toFixed(1)}%`
                                }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Checkboxes -->
                <div class="flex flex-wrap gap-6 items-center">
                    <el-checkbox
                        v-model="doubleBreakthrough"
                        :disabled="!selectedTool || selectedTool.breakthroughProb === 0"
                    >
                        <span class="text-gray-200">突破機率加倍</span>
                        <span
                            v-if="selectedTool && selectedTool.breakthroughProb > 0"
                            class="text-xs text-gray-400 ml-2"
                        >
                            {{ (selectedTool.breakthroughProb * 100).toFixed(1) }}% →
                            {{ (selectedTool.breakthroughProb * 2 * 100).toFixed(1) }}%
                        </span>
                    </el-checkbox>

                    <el-checkbox
                        v-model="isEventPeriod"
                        :disabled="!minLevelEntry || minLevelEntry.normal === minLevelEntry.event"
                    >
                        <span class="text-gray-200">最低等級補正（活動期間）</span>
                        <span
                            v-if="minLevelEntry && minLevelEntry.normal !== minLevelEntry.event"
                            class="text-xs text-gray-400 ml-2"
                        >
                            最低 Lv.{{ minLevelEntry.normal }} → Lv.{{ minLevelEntry.event }}
                        </span>
                    </el-checkbox>
                </div>
            </el-card>

            <!-- ── 設定摘要 ── -->
            <div v-if="isReady" class="mb-4 flex flex-wrap gap-2 items-center px-1">
                <el-tag type="warning" effect="dark">{{ selectedEquipType!.name }}</el-tag>
                <el-tag type="info" effect="dark">
                    選項最大 Lv.{{ selectedMaxLevel }}
                </el-tag>
                <el-tag type="primary" effect="dark">{{ selectedTool!.name }}</el-tag>
                <el-tag type="success" effect="dark">
                    範圍 Lv.{{ effectiveMinLevel }} ～ {{ selectedMaxLevel }}
                </el-tag>
                <el-tag v-if="effectiveBreakthroughProb > 0" type="warning" effect="plain">
                    突破 {{ (effectiveBreakthroughProb * 100).toFixed(1) }}%
                </el-tag>
                <el-tag v-if="isEventPeriod" type="success" effect="plain">活動期間</el-tag>
                <el-tag type="info" effect="plain">池 {{ activePool.length }} 個詞條</el-tag>
            </div>

            <!-- ── Card 3: 詞條池 ── -->
            <el-card
                v-if="isReady"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
            >
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">詞條池</h2>
                    <el-tag type="info" size="small">{{ activePool.length }} 個</el-tag>
                    <span
                        v-if="selectedEquipType!.isHeavy"
                        class="text-xs text-yellow-500"
                    >+ 重甲專屬</span>
                    <span
                        v-if="RACE_POOL_KEY[selectedRace]"
                        class="text-xs text-green-500"
                    >+ {{ selectedRace }}專屬</span>
                </div>

                <p class="text-xs text-gray-500 mb-3">點擊列以選擇模擬目標</p>

                <el-table
                    :data="activePool"
                    size="small"
                    :max-height="420"
                    :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                    :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                    :row-class-name="({ row }: { row: ReforgeEntry }) => selectedTargetName === row.name ? 'selected-row' : ''"
                    @row-click="(row: ReforgeEntry) => (selectedTargetName = selectedTargetName === row.name ? null : row.name)"
                >
                    <el-table-column label="詞條名稱" min-width="180">
                        <template #default="{ row }">
                            <span class="font-medium">{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="等級範圍" width="130" align="center">
                        <template #default="{ row }">
                            {{ formatLevelRange(row) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="最大效果" min-width="160" align="right">
                        <template #default="{ row }">
                            <span class="text-green-400">{{ formatValue(row) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>

            <!-- ── Card 4: 模擬計算 ── -->
            <el-card
                v-if="isReady"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
            >
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">模擬計算</h2>
                </div>

                <!-- Target -->
                <div class="mb-5 flex flex-wrap gap-3 items-center">
                    <span class="text-sm text-gray-400">目標詞條：</span>
                    <el-tag v-if="selectedTargetName" type="warning" effect="dark" size="large">
                        {{ selectedTargetName }}
                    </el-tag>
                    <el-tag v-else type="info" effect="plain">請在上方詞條池點選目標</el-tag>
                    <el-button
                        v-if="selectedTargetName"
                        size="small"
                        type="danger"
                        plain
                        @click="selectedTargetName = null"
                    >
                        清除
                    </el-button>
                </div>

                <!-- Cost -->
                <div class="mb-6">
                    <p class="text-sm text-gray-400 mb-2">每次洗詞花費（金幣，選填）</p>
                    <el-input-number
                        v-model="costPerRoll"
                        :min="0"
                        :step="10000"
                        :precision="0"
                        style="width: 200px"
                    />
                </div>

                <!-- Results -->
                <template v-if="simResult">
                    <div class="mb-4 border-b border-gray-700 pb-2">
                        <h3 class="text-base font-semibold text-gray-300">計算結果</h3>
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                        <div class="stat-card">
                            <div class="stat-label">每次成功率</div>
                            <div class="stat-value text-yellow-400">
                                {{ `1 / ${simResult.poolSize}` }}
                            </div>
                            <div class="stat-sub">池共 {{ simResult.poolSize }} 個詞條</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">平均洗次數</div>
                            <div class="stat-value text-blue-400">{{ simResult.mean }} 次</div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.avgCost).toLocaleString() }} 金
                            </div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">中位數（P50）</div>
                            <div class="stat-value text-green-400">
                                {{ simResult.p50.toLocaleString() }} 次
                            </div>
                            <div class="stat-sub">50% 機率在此次數內成功</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">P90</div>
                            <div class="stat-value text-orange-400">
                                {{ simResult.p90.toLocaleString() }} 次
                            </div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.p90 * costPerRoll).toLocaleString() }} 金
                            </div>
                            <div v-else class="stat-sub">90% 機率內成功</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">P99（最壞情況）</div>
                            <div class="stat-value text-red-400">
                                {{ simResult.p99.toLocaleString() }} 次
                            </div>
                            <div v-if="costPerRoll > 0" class="stat-sub">
                                ≈ {{ Math.round(simResult.p99 * costPerRoll).toLocaleString() }} 金
                            </div>
                            <div v-else class="stat-sub">99% 機率內成功</div>
                        </div>
                    </div>

                    <!-- Cumulative probability -->
                    <p class="text-sm text-gray-400 mb-2">累積成功機率</p>
                    <div class="flex flex-wrap gap-2">
                        <div
                            v-for="n in [1, 5, 10, 20, 50, 100, 200, 500]"
                            :key="n"
                            class="prob-chip"
                        >
                            <span class="text-gray-400 text-xs">{{ n }} 次</span>
                            <span class="font-semibold text-sm text-white">
                                {{ ((1 - Math.pow(1 - simResult.p, n)) * 100).toFixed(1) }}%
                            </span>
                        </div>
                    </div>
                </template>

                <el-empty
                    v-else
                    description="在上方詞條池中點擊選擇目標詞條，即可開始計算"
                    :image-size="60"
                />
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

/* 細工道具 chip */
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
    transition: border-color 0.15s, background 0.15s;
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
.tool-chip--active .tool-name { color: #fbbf24; }
.tool-chip--active .tool-prob { color: #d97706; }

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
.stat-label { font-size: 0.75rem; color: #9ca3af; }
.stat-value { font-size: 1.4rem; font-weight: 700; line-height: 1.2; }
.stat-sub { font-size: 0.7rem; color: #6b7280; }

/* Probability chips */
.prob-chip {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 4px 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 64px;
}

/* Selected row */
:deep(.selected-row td) {
    background: #1c3a4f !important;
    border-color: #3b82f6 !important;
}
:deep(.el-table__row) { cursor: pointer; }
:deep(.el-table__row:hover td) { background: #1f3040 !important; }
</style>
