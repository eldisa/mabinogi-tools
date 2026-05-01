<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { enchants, reward } from "../data/enchants";
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";
import type { Enchant } from "../types/Enchant";

// ===== Types =====
interface EquipmentType {
    id: string;
    name: string;
    limits: string[];
}

interface SlotGroup {
    slot: string;
    subtypes: EquipmentType[];
}

// ===== Equipment Definitions =====
const ARMOR_SLOT_GROUPS: SlotGroup[] = [
    {
        slot: "帽子",
        subtypes: [
            { id: "hat_normal", name: "一般帽", limits: ["頭部裝備"] },
            { id: "hat_heavy", name: "重甲頭盔", limits: ["頭部裝備", "重甲"] },
        ],
    },
    {
        slot: "上衣",
        subtypes: [
            { id: "cloth", name: "布衣", limits: ["布衣", "衣物"] },
            { id: "light_armor", name: "輕甲", limits: ["輕甲", "衣物"] },
            { id: "heavy_armor", name: "重甲", limits: ["重甲", "衣物"] },
        ],
    },
    {
        slot: "手套",
        subtypes: [
            { id: "glove_normal", name: "一般手套", limits: ["手部裝備", "手"] },
            { id: "glove_heavy", name: "重甲手套", limits: ["手部裝備", "重甲", "手"] },
        ],
    },
    {
        slot: "鞋子",
        subtypes: [
            { id: "shoe_normal", name: "一般鞋", limits: ["腳部裝備"] },
            { id: "shoe_heavy", name: "重甲鞋", limits: ["腳部裝備", "重甲"] },
        ],
    },
    {
        slot: "飾品",
        subtypes: [{ id: "accessory", name: "飾品", limits: ["飾品"] }],
    },
    {
        slot: "盾牌",
        subtypes: [{ id: "shield", name: "盾牌", limits: ["盾牌"] }],
    },
];

const WEAPON_SLOT_GROUPS: SlotGroup[] = [
    {
        slot: "近戰",
        subtypes: [
            { id: "one_hand", name: "單手武器", limits: ["單手武器"] },
            { id: "two_hand", name: "雙手武器", limits: ["雙手武器"] },
            { id: "lance", name: "騎槍", limits: ["騎槍"] },
            { id: "knuckle_w", name: "手把", limits: ["手把"] },
            { id: "glove_w", name: "拳套", limits: ["拳套"] },
            { id: "chain", name: "鎖鏈鐮刃", limits: ["鎖鏈鐮刃"] },
        ],
    },
    {
        slot: "遠程",
        subtypes: [
            { id: "bow", name: "弓", limits: ["弓"] },
            { id: "crossbow", name: "弩", limits: ["弩"] },
            { id: "dual_gun", name: "雙槍", limits: ["雙槍"] },
            { id: "shuriken", name: "手裡劍", limits: ["手裡劍"] },
        ],
    },
    {
        slot: "魔法",
        subtypes: [
            { id: "wand", name: "短杖（魔杖）", limits: ["魔杖", "單手魔杖、集魔杖"] },
            { id: "staff", name: "集魔杖", limits: ["集魔杖", "單手魔杖、集魔杖"] },
            { id: "grimoire", name: "魔導書/水晶球", limits: ["魔導書、水晶球"] },
            { id: "cylinder", name: "鋼瓶", limits: ["鋼瓶"] },
        ],
    },
    {
        slot: "其他",
        subtypes: [{ id: "instrument", name: "樂器", limits: ["樂器"] }],
    },
];

// ===== Selection State =====
const selectedCategory = ref<"防具" | "武器" | null>(null);
const selectedEquipType = ref<EquipmentType | null>(null);
const selectedRace = ref<string>("全種族");
const selectedSources = ref<string[]>([]);

// Simulation state
const selectedPrefixId = ref<number | null>(null);
const selectedSuffixId = ref<number | null>(null);
const costPerRoll = ref<number>(0);

// ===== Static Data =====
const RACE_OPTIONS = [
    "全種族",
    "人類限定",
    "精靈限定",
    "人類/精靈限定",
    "人類/巨人限定",
    "巨人限定",
];

const SOURCE_OPTIONS = reward.map((r) => r.raidName);

// ===== Current Slot Groups for Selected Category =====
const currentSlotGroups = computed<SlotGroup[]>(() => {
    if (selectedCategory.value === "防具") return ARMOR_SLOT_GROUPS;
    if (selectedCategory.value === "武器") return WEAPON_SLOT_GROUPS;
    return [];
});

// ===== Enchant Source IDs =====
const sourceEnchantIds = computed((): Set<number> => {
    const ids = new Set<number>();
    for (const source of reward) {
        if (selectedSources.value.includes(source.raidName)) {
            source.list.forEach((id) => ids.add(id));
        }
    }
    return ids;
});

// ===== Enchant Pool =====
const eligibleEnchants = computed((): Enchant[] => {
    if (!selectedEquipType.value || selectedSources.value.length === 0) return [];
    const equipLimits = selectedEquipType.value.limits;
    return enchants.filter(
        (e) => sourceEnchantIds.value.has(e.id) && e.limit.some((l) => equipLimits.includes(l)),
    );
});

const prefixPool = computed(() => eligibleEnchants.value.filter((e) => e.type === "prefix"));
const suffixPool = computed(() => eligibleEnchants.value.filter((e) => e.type === "suffix"));

// ===== Helpers =====
const formatEffect = (id: string, min: number, max: number): string => {
    const name = abilitiesMap[id] ?? id;
    const isPercent = abilitiesValueWithPercentArray.includes(id);
    const unit = isPercent ? "%" : "";
    const fmt = (n: number) => `${n > 0 ? "+" : ""}${n}${unit}`;
    if (min === max) return `${name} ${fmt(min)}`;
    return `${name} ${fmt(min)}～${fmt(max)}`;
};

const getEnchantLabel = (enchant: Enchant): string =>
    `${enchant.name.tw}（Lv.${enchant.level}）`;

// ===== Simulation (Analytical Geometric Distribution) =====
interface SimResult {
    p: number;
    mean: number;
    p50: number;
    p90: number;
    p99: number;
    avgCost: number;
    prefixPoolSize: number;
    suffixPoolSize: number;
}

const simResult = computed((): SimResult | null => {
    const hasPrefixTarget = selectedPrefixId.value !== null;
    const hasSuffixTarget = selectedSuffixId.value !== null;
    if (!hasPrefixTarget && !hasSuffixTarget) return null;
    if (eligibleEnchants.value.length === 0) return null;

    let p = 1;
    const prefixSize = prefixPool.value.length;
    const suffixSize = suffixPool.value.length;

    if (hasPrefixTarget && prefixSize > 0) p *= 1 / prefixSize;
    if (hasSuffixTarget && suffixSize > 0) p *= 1 / suffixSize;
    if (p <= 0 || p > 1) return null;

    const mean = 1 / p;
    const p50 = Math.ceil(Math.log(0.5) / Math.log(1 - p));
    const p90 = Math.ceil(Math.log(0.1) / Math.log(1 - p));
    const p99 = Math.ceil(Math.log(0.01) / Math.log(1 - p));
    const avgCost = mean * costPerRoll.value;

    return { p, mean, p50, p90, p99, avgCost, prefixPoolSize: prefixSize, suffixPoolSize: suffixSize };
});

// ===== Watchers =====
const selectCategory = (cat: "防具" | "武器") => {
    selectedCategory.value = cat;
    selectedEquipType.value = null;
    selectedPrefixId.value = null;
    selectedSuffixId.value = null;
};

const selectEquipType = (eq: EquipmentType) => {
    selectedEquipType.value = eq;
    selectedPrefixId.value = null;
    selectedSuffixId.value = null;
};

watch(selectedSources, () => {
    selectedPrefixId.value = null;
    selectedSuffixId.value = null;
});
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

            <!-- Step 1 & 2: 選擇裝備 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">選擇裝備</h2>
                </div>

                <!-- Step 1: 大分類 -->
                <div class="mb-5">
                    <p class="text-sm text-gray-400 mb-2">① 裝備大分類</p>
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

                <!-- Step 2: 部位/類型選擇 -->
                <div v-if="selectedCategory" class="mb-5">
                    <p class="text-sm text-gray-400 mb-2">② 裝備部位 / 類型</p>
                    <div
                        v-for="group in currentSlotGroups"
                        :key="group.slot"
                        class="mb-3"
                    >
                        <!-- 顯示 slot group 名稱（防具用分隔線，武器用標籤） -->
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

                <!-- Step 3: 穿戴限制（僅顯示，不影響池） -->
                <div v-if="selectedEquipType" class="mb-5">
                    <p class="text-sm text-gray-400 mb-2">③ 穿戴限制（不影響詞條池）</p>
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

                <!-- Step 4: 洗詞條道具 -->
                <div v-if="selectedEquipType">
                    <p class="text-sm text-gray-400 mb-2">④ 洗詞條道具（可複選）</p>
                    <div class="flex gap-2 flex-wrap">
                        <el-tag
                            v-for="src in SOURCE_OPTIONS"
                            :key="src"
                            :type="selectedSources.includes(src) ? 'primary' : 'info'"
                            :effect="selectedSources.includes(src) ? 'dark' : 'plain'"
                            class="cursor-pointer select-none"
                            @click="
                                selectedSources.includes(src)
                                    ? (selectedSources = selectedSources.filter((s) => s !== src))
                                    : selectedSources.push(src)
                            "
                        >
                            {{ src }}
                        </el-tag>
                    </div>
                </div>
            </el-card>

            <!-- Enchant Pool -->
            <template v-if="eligibleEnchants.length > 0">
                <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                    <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-3">
                        <h2 class="text-xl font-bold text-accent">詞條池</h2>
                        <el-tag type="info" size="small">
                            共 {{ eligibleEnchants.length }} 個（前綴 {{ prefixPool.length }}、後綴
                            {{ suffixPool.length }}）
                        </el-tag>
                        <el-tag v-if="selectedEquipType" size="small" type="warning">
                            {{ selectedEquipType.name }}・{{ selectedRace }}
                        </el-tag>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Prefix Pool -->
                        <div>
                            <h3 class="text-base font-semibold text-gray-300 mb-2">
                                前綴
                                <span class="text-sm text-gray-500">（{{ prefixPool.length }} 個）</span>
                            </h3>
                            <el-table
                                :data="prefixPool"
                                size="small"
                                :max-height="400"
                                :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                                :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                                :row-class-name="
                                    ({ row }: { row: Enchant }) =>
                                        selectedPrefixId === row.id ? 'selected-row' : ''
                                "
                                @row-click="(row: Enchant) => (selectedPrefixId = selectedPrefixId === row.id ? null : row.id)"
                            >
                                <el-table-column label="名稱" min-width="120">
                                    <template #default="{ row }">
                                        <span class="font-medium">{{ row.name.tw }}</span>
                                        <el-tag size="small" class="ml-1" type="info">Lv.{{ row.level }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="效果" min-width="180">
                                    <template #default="{ row }">
                                        <div
                                            v-for="ef in row.effect"
                                            :key="ef.id"
                                            class="text-xs leading-relaxed"
                                            :class="ef.min < 0 ? 'text-red-400' : 'text-green-400'"
                                        >
                                            {{ formatEffect(ef.id, ef.min, ef.max) }}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <p class="text-xs text-gray-500 mt-1">點擊列以選擇目標前綴</p>
                        </div>

                        <!-- Suffix Pool -->
                        <div>
                            <h3 class="text-base font-semibold text-gray-300 mb-2">
                                後綴
                                <span class="text-sm text-gray-500">（{{ suffixPool.length }} 個）</span>
                            </h3>
                            <el-table
                                :data="suffixPool"
                                size="small"
                                :max-height="400"
                                :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                                :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                                :row-class-name="
                                    ({ row }: { row: Enchant }) =>
                                        selectedSuffixId === row.id ? 'selected-row' : ''
                                "
                                @row-click="(row: Enchant) => (selectedSuffixId = selectedSuffixId === row.id ? null : row.id)"
                            >
                                <el-table-column label="名稱" min-width="120">
                                    <template #default="{ row }">
                                        <span class="font-medium">{{ row.name.tw }}</span>
                                        <el-tag size="small" class="ml-1" type="info">Lv.{{ row.level }}</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column label="效果" min-width="180">
                                    <template #default="{ row }">
                                        <div
                                            v-for="ef in row.effect"
                                            :key="ef.id"
                                            class="text-xs leading-relaxed"
                                            :class="ef.min < 0 ? 'text-red-400' : 'text-green-400'"
                                        >
                                            {{ formatEffect(ef.id, ef.min, ef.max) }}
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <p class="text-xs text-gray-500 mt-1">點擊列以選擇目標後綴</p>
                        </div>
                    </div>
                </el-card>

                <!-- Simulation -->
                <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                    <div class="mb-4 border-b border-gray-700 pb-3">
                        <h2 class="text-xl font-bold text-accent">模擬計算</h2>
                    </div>

                    <!-- Target Summary -->
                    <div class="mb-5 flex flex-wrap gap-3 items-center">
                        <div class="text-sm text-gray-400">目標：</div>
                        <template v-if="selectedPrefixId !== null">
                            <el-tag type="warning" effect="dark">
                                前綴：{{
                                    prefixPool.find((e) => e.id === selectedPrefixId)?.name.tw ?? "—"
                                }}
                            </el-tag>
                        </template>
                        <template v-else>
                            <el-tag type="info" effect="plain">前綴：任意（不限）</el-tag>
                        </template>

                        <template v-if="selectedSuffixId !== null">
                            <el-tag type="primary" effect="dark">
                                後綴：{{
                                    suffixPool.find((e) => e.id === selectedSuffixId)?.name.tw ?? "—"
                                }}
                            </el-tag>
                        </template>
                        <template v-else>
                            <el-tag type="info" effect="plain">後綴：任意（不限）</el-tag>
                        </template>

                        <el-button
                            v-if="selectedPrefixId !== null || selectedSuffixId !== null"
                            size="small"
                            type="danger"
                            plain
                            @click="
                                selectedPrefixId = null;
                                selectedSuffixId = null;
                            "
                        >
                            清除目標
                        </el-button>
                    </div>

                    <!-- Cost Input -->
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
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div class="stat-card">
                                <div class="stat-label">每次成功率</div>
                                <div class="stat-value text-yellow-400">
                                    {{
                                        simResult.p >= 0.01
                                            ? `${(simResult.p * 100).toFixed(2)}%`
                                            : `1 / ${Math.round(1 / simResult.p).toLocaleString()}`
                                    }}
                                </div>
                                <div class="stat-sub">
                                    前綴池 {{ simResult.prefixPoolSize }} 個・後綴池
                                    {{ simResult.suffixPoolSize }} 個
                                </div>
                            </div>

                            <div class="stat-card">
                                <div class="stat-label">平均洗次數</div>
                                <div class="stat-value text-blue-400">
                                    {{ simResult.mean.toFixed(1).toLocaleString() }} 次
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
                                <div v-else class="stat-sub">90% 機率在此次數內成功</div>
                            </div>

                            <div class="stat-card">
                                <div class="stat-label">P99（最壞情況）</div>
                                <div class="stat-value text-red-400">
                                    {{ simResult.p99.toLocaleString() }} 次
                                </div>
                                <div v-if="costPerRoll > 0" class="stat-sub">
                                    ≈ {{ Math.round(simResult.p99 * costPerRoll).toLocaleString() }} 金
                                </div>
                                <div v-else class="stat-sub">99% 機率在此次數內成功</div>
                            </div>
                        </div>

                        <!-- Probability table -->
                        <div class="mt-5">
                            <p class="text-sm text-gray-400 mb-2">累積成功機率</p>
                            <div class="flex flex-wrap gap-2">
                                <div
                                    v-for="n in [1, 5, 10, 20, 50, 100, 200, 500]"
                                    :key="n"
                                    class="prob-chip"
                                >
                                    <span class="text-gray-400 text-xs">{{ n }} 次</span>
                                    <span class="font-semibold text-sm text-white">
                                        {{
                                            (
                                                (1 - Math.pow(1 - simResult.p, n)) *
                                                100
                                            ).toFixed(1)
                                        }}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </template>

                    <el-empty
                        v-else
                        description="在上方詞條池中點擊選擇目標前綴或後綴，即可開始計算"
                        :image-size="60"
                    />
                </el-card>
            </template>

            <!-- Empty state when conditions not met -->
            <el-card
                v-else-if="selectedEquipType && selectedSources.length > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
            >
                <el-empty description="所選裝備與道具組合沒有符合的詞條" :image-size="80" />
            </el-card>
        </div>
    </div>
</template>

<style scoped>
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
</style>
