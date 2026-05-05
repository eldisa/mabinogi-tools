<script setup lang="ts">
import { ref, computed, watch } from "vue";

const baseUrl = import.meta.env.BASE_URL;

// ===== Types =====
interface StatDef {
    key: string;
    label: string;
    min: number;
    max: number;
    step: number;
    unit: string;
    precision: number;
}

interface CoinType {
    id: string;
    name: string;
    textClass: string;
    borderActiveClass: string;
    bgActiveClass: string;
    stats: StatDef[];
}

// ===== Constants =====
const MATERIAL_PER_CRAFT = 3;

const COIN_TYPES: CoinType[] = [
    {
        id: "physical", name: "物理",
        textClass: "text-red-400", borderActiveClass: "border-red-500", bgActiveClass: "bg-red-900/30",
        stats: [
            { key: "maxDmg",    label: "最大傷害",        min: 1,    max: 20,   step: 1,    unit: "",  precision: 0 },
            { key: "critDmg",   label: "暴擊傷害",        min: 1,    max: 10,   step: 1,    unit: "%", precision: 0 },
            { key: "arcaneDmg", label: "秘法技能傷害加成", min: 0.15, max: 3.00, step: 0.15, unit: "%", precision: 2 },
        ],
    },
    {
        id: "magic", name: "魔法",
        textClass: "text-blue-400", borderActiveClass: "border-blue-500", bgActiveClass: "bg-blue-900/30",
        stats: [
            { key: "magicAtk",  label: "魔法攻擊力",      min: 1,    max: 20,   step: 1,    unit: "",  precision: 0 },
            { key: "critDmg",   label: "暴擊傷害",        min: 1,    max: 10,   step: 1,    unit: "%", precision: 0 },
            { key: "arcaneDmg", label: "秘法技能傷害加成", min: 0.15, max: 3.00, step: 0.15, unit: "%", precision: 2 },
        ],
    },
    {
        id: "alchemy", name: "煉金",
        textClass: "text-green-400", borderActiveClass: "border-green-500", bgActiveClass: "bg-green-900/30",
        stats: [
            { key: "alchDmg",   label: "4屬性煉金傷害",   min: 1,    max: 20,   step: 1,    unit: "",  precision: 0 },
            { key: "critDmg",   label: "暴擊傷害",        min: 1,    max: 10,   step: 1,    unit: "%", precision: 0 },
            { key: "arcaneDmg", label: "秘法技能傷害加成", min: 0.15, max: 3.00, step: 0.15, unit: "%", precision: 2 },
        ],
    },
    {
        id: "support", name: "支援",
        textClass: "text-yellow-400", borderActiveClass: "border-yellow-500", bgActiveClass: "bg-yellow-900/30",
        stats: [
            { key: "atkBoost",   label: "戰場・活潑板攻擊提昇", min: 0.1, max: 1.0, step: 0.1, unit: "%", precision: 1 },
            { key: "musicDur",   label: "音樂增益持續時間",    min: 1,   max: 20,  step: 1,   unit: "",  precision: 0 },
            { key: "healEffect", label: "治癒效果",           min: 1,   max: 20,  step: 1,   unit: "%", precision: 0 },
        ],
    },
];

// ===== State =====
interface CraftResult {
    craftId: number;
    typeId: string;
    stats: Record<string, number>;
    isSuccess: boolean;
    thisRunCount: number;
}

const selectedTypeId  = ref<string>("physical");
const totalCrafts     = ref(0);
const totalMaterials  = ref(0);
const successCount    = ref(0);
const lastResult      = ref<CraftResult | null>(null);
const history         = ref<CraftResult[]>([]);
const autoMode        = ref(false);
const costPerCraft    = ref(0);
const showHistory     = ref(false);

// Per-type target values and enabled flags
const targetValues = ref<Record<string, Record<string, number>>>(
    Object.fromEntries(
        COIN_TYPES.map((ct) => [ct.id, Object.fromEntries(ct.stats.map((s) => [s.key, s.min]))]),
    ),
);
const targetEnabled = ref<Record<string, Record<string, boolean>>>(
    Object.fromEntries(
        COIN_TYPES.map((ct) => [ct.id, Object.fromEntries(ct.stats.map((s) => [s.key, false]))]),
    ),
);

// ===== Derived =====
const selectedType = computed(() => COIN_TYPES.find((c) => c.id === selectedTypeId.value)!);
const curTargets   = computed(() => targetValues.value[selectedTypeId.value]);
const curEnabled   = computed(() => targetEnabled.value[selectedTypeId.value]);

const hasAnyTarget = computed(() => Object.values(curEnabled.value).some((v) => v));

// P(stat >= target): uses integer step counting to avoid float drift
const statProb = (s: StatDef, target: number): number => {
    if (target <= s.min + 1e-9) return 1;
    if (target > s.max + 1e-9)  return 0;
    const total  = Math.round((s.max - s.min) / s.step) + 1;
    const startI = Math.ceil((target - s.min) / s.step - 1e-9);
    return Math.max(0, total - startI) / total;
};

const successProb = computed((): number => {
    if (!hasAnyTarget.value) return 1;
    return selectedType.value.stats.reduce((p, s) => {
        if (!curEnabled.value[s.key]) return p;
        return p * statProb(s, curTargets.value[s.key]);
    }, 1);
});

const fmtStat = (val: number, s: StatDef): string =>
    `${val.toFixed(s.precision)}${s.unit}`;

const fmtPct = (p: number): string =>
    p >= 0.01 ? `${(p * 100).toFixed(2)}%` : `1 / ${Math.round(1 / p).toLocaleString()}`;

// ===== Roll helpers =====
const rollStat = (s: StatDef): number => {
    const steps = Math.round((s.max - s.min) / s.step);
    const i = Math.floor(Math.random() * (steps + 1));
    return +(s.min + i * s.step).toFixed(s.precision + 2);
};

// Roll within [minVal, max] for guaranteed target
const rollForcedStat = (s: StatDef, minVal: number): number => {
    const totalSteps = Math.round((s.max - s.min) / s.step);
    const startI = Math.ceil((minVal - s.min) / s.step - 1e-9);
    const i = startI + Math.floor(Math.random() * (totalSteps - startI + 1));
    return +(s.min + i * s.step).toFixed(s.precision + 2);
};

const checkSuccess = (stats: Record<string, number>): boolean => {
    if (!hasAnyTarget.value) return false;
    return selectedType.value.stats.every(
        (s) => !curEnabled.value[s.key] || stats[s.key] >= curTargets.value[s.key],
    );
};

// ===== Actions =====
const doCraft = () => {
    const ct = selectedType.value;
    let count = 1;
    const stats: Record<string, number> = {};

    if (autoMode.value && hasAnyTarget.value && successProb.value > 0) {
        // Geometric sampling
        const p = successProb.value;
        count = Math.ceil(Math.log(Math.max(Number.EPSILON, Math.random())) / Math.log(1 - p));
        for (const s of ct.stats) {
            stats[s.key] = curEnabled.value[s.key]
                ? rollForcedStat(s, curTargets.value[s.key])
                : rollStat(s);
        }
        successCount.value++;
    } else {
        for (const s of ct.stats) stats[s.key] = rollStat(s);
        if (checkSuccess(stats)) successCount.value++;
    }

    totalCrafts.value    += count;
    totalMaterials.value += count * MATERIAL_PER_CRAFT;

    const result: CraftResult = {
        craftId: totalCrafts.value,
        typeId: selectedTypeId.value,
        stats,
        isSuccess: autoMode.value && hasAnyTarget.value ? true : checkSuccess(stats),
        thisRunCount: count,
    };
    lastResult.value = result;
    history.value.unshift(result);
    if (history.value.length > 100) history.value.pop();
};

const resetAll = () => {
    totalCrafts.value    = 0;
    totalMaterials.value = 0;
    successCount.value   = 0;
    lastResult.value     = null;
    history.value        = [];
};

// Reset success count when targets change (old rate invalid)
watch([curTargets, curEnabled], () => { successCount.value = 0; }, { deep: true });

// Filtered history for current coin type
const filteredHistory = computed(() =>
    history.value.filter((r) => r.typeId === selectedTypeId.value),
);
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-3xl mx-auto">
            <header class="mb-8 text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    布里萊赫硬幣模擬器
                </h1>
                <p class="text-lg text-gray-400 mt-4">模擬製作硬幣的素質分布與材料消耗</p>
            </header>

            <!-- ── Card 1: 選擇硬幣類型 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">選擇硬幣類型</h2>
                </div>
                <div class="flex flex-wrap gap-3">
                    <div
                        v-for="ct in COIN_TYPES" :key="ct.id"
                        class="coin-chip"
                        :class="[
                            selectedTypeId === ct.id ? ['coin-chip--active', ct.borderActiveClass, ct.bgActiveClass] : '',
                        ]"
                        @click="selectedTypeId = ct.id"
                    >
                        <img
                            :src="`${baseUrl}itemImage/39664.png`"
                            :alt="ct.name + '硬幣'"
                            class="w-10 h-10 object-contain pixelated"
                            @error="($event.target as HTMLImageElement).style.display = 'none'"
                        />
                        <span class="font-bold text-sm" :class="selectedTypeId === ct.id ? ct.textClass : 'text-gray-300'">
                            {{ ct.name }}
                        </span>
                        <span class="text-xs text-gray-500">硬幣</span>
                    </div>
                </div>
            </el-card>

            <!-- ── Card 2: 目標設定 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-4 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">目標設定</h2>
                    <el-checkbox v-model="autoMode" :disabled="!hasAnyTarget">
                        <span class="text-sm" :class="!hasAnyTarget ? 'text-gray-600' : 'text-gray-300'">
                            自動衝到達標
                        </span>
                        <span class="text-xs text-gray-600 ml-1">（需勾選目標）</span>
                    </el-checkbox>
                </div>

                <div class="flex flex-col gap-2">
                    <div
                        v-for="s in selectedType.stats" :key="s.key"
                        class="target-row"
                        :class="curEnabled[s.key] ? 'border-gray-600' : 'border-gray-800'"
                    >
                        <el-checkbox v-model="targetEnabled[selectedTypeId][s.key]" />
                        <span class="text-sm min-w-[150px]"
                            :class="curEnabled[s.key] ? 'text-gray-200' : 'text-gray-500'">
                            {{ s.label }}
                        </span>
                        <span class="text-xs text-gray-500">≥</span>
                        <el-input-number
                            v-model="targetValues[selectedTypeId][s.key]"
                            :disabled="!curEnabled[s.key]"
                            :min="s.min" :max="s.max" :step="s.step" :precision="s.precision"
                            size="small" controls-position="right" style="width: 110px"
                        />
                        <span class="text-xs text-gray-500 w-4">{{ s.unit }}</span>
                        <span class="text-xs ml-auto w-20 text-right font-mono"
                            :class="curEnabled[s.key]
                                ? statProb(s, curTargets[s.key]) < 0.1 ? 'text-orange-400' : 'text-green-400'
                                : 'text-gray-700'">
                            {{ curEnabled[s.key]
                                ? (statProb(s, curTargets[s.key]) * 100).toFixed(1) + '%'
                                : '—' }}
                        </span>
                    </div>
                </div>

                <div v-if="hasAnyTarget" class="mt-4 pt-3 border-t border-gray-700 flex items-center gap-3 flex-wrap text-sm">
                    <span class="text-gray-400">綜合成功率：</span>
                    <span class="text-yellow-400 font-bold text-base">{{ fmtPct(successProb) }}</span>
                    <span class="text-gray-500 ml-auto">
                        平均 {{ successProb > 0 ? (1 / successProb).toFixed(1) : '∞' }} 次
                    </span>
                </div>
            </el-card>

            <!-- ── Card 3: 製作 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">製作</h2>
                    <template v-if="totalCrafts > 0">
                        <span class="text-sm text-gray-400 ml-auto">
                            已製作 <span class="text-white font-bold">{{ totalCrafts.toLocaleString() }}</span> 次
                        </span>
                        <span class="text-sm text-gray-400">
                            ·消耗
                            <img :src="`${baseUrl}itemImage/39663.png`" class="inline w-4 h-4 pixelated align-middle mx-0.5"
                                 @error="($event.target as HTMLImageElement).style.display='none'" />
                            <span class="text-orange-400 font-bold">{{ totalMaterials.toLocaleString() }}</span> 個
                        </span>
                        <span v-if="costPerCraft > 0" class="text-sm text-gray-400">
                            ·
                            <span class="text-yellow-400 font-bold">
                                {{ (totalMaterials * costPerCraft).toLocaleString() }}
                            </span> 金
                        </span>
                        <span v-if="hasAnyTarget" class="text-sm text-gray-400">
                            ·達標 <span class="text-green-400 font-bold">{{ successCount }}</span> 次
                        </span>
                    </template>
                </div>

                <!-- Material info + cost -->
                <div class="mb-5 flex flex-wrap items-center gap-4">
                    <div class="flex items-center gap-2">
                        <img :src="`${baseUrl}itemImage/39663.png`" class="w-8 h-8 pixelated"
                             @error="($event.target as HTMLImageElement).style.display='none'" />
                        <span class="text-sm text-gray-300">布里萊赫的殘渣</span>
                        <span class="text-yellow-400 font-semibold">× 3</span>
                        <span class="text-gray-600 text-sm">/ 次</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-400">每個殘渣金幣（選填）</span>
                        <el-input-number
                            v-model="costPerCraft" :min="0" :step="1000" :precision="0"
                            size="small" style="width: 140px"
                        />
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="flex items-center gap-3 mb-5 flex-wrap">
                    <el-button type="warning" size="large" @click="doCraft">
                        🪙 {{ autoMode && hasAnyTarget ? '自動製作' : '製作' }}
                    </el-button>
                    <el-button
                        v-if="totalCrafts > 0" size="small" plain class="ml-auto"
                        @click="resetAll"
                    >重置紀錄</el-button>
                </div>

                <!-- Result -->
                <Transition name="fade" mode="out-in">
                    <div v-if="lastResult" :key="totalCrafts">
                        <!-- Auto mode count banner -->
                        <div v-if="lastResult.thisRunCount > 1"
                            class="mb-3 flex flex-wrap items-center gap-3 px-1 text-sm">
                            <span class="text-gray-400">本次花了</span>
                            <span class="text-yellow-400 font-bold text-lg">
                                {{ lastResult.thisRunCount.toLocaleString() }}
                            </span>
                            <span class="text-gray-400">次</span>
                            <template v-if="costPerCraft > 0">
                                <span class="text-gray-600">≈</span>
                                <span class="text-orange-400 font-semibold">
                                    {{ (lastResult.thisRunCount * MATERIAL_PER_CRAFT * costPerCraft).toLocaleString() }}
                                </span>
                                <span class="text-gray-400">金</span>
                            </template>
                        </div>

                        <!-- Success / fail banner -->
                        <div v-if="hasAnyTarget"
                            class="mb-3 py-2 px-4 rounded-lg font-bold text-center text-base"
                            :class="lastResult.isSuccess
                                ? 'bg-green-900/40 border border-green-500 text-green-400'
                                : 'bg-gray-900/40 border border-gray-700 text-gray-500'"
                        >
                            {{ lastResult.isSuccess ? '🎉 達標！' : '未達標，繼續加油' }}
                        </div>

                        <!-- Stat tiles -->
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div
                                v-for="s in selectedType.stats" :key="s.key"
                                class="stat-tile"
                                :class="{
                                    'stat-tile--hit':  hasAnyTarget && curEnabled[s.key] && lastResult.stats[s.key] >= curTargets[s.key],
                                    'stat-tile--miss': hasAnyTarget && curEnabled[s.key] && lastResult.stats[s.key] <  curTargets[s.key],
                                }"
                            >
                                <div class="text-xs text-gray-400 mb-1">{{ s.label }}</div>
                                <div class="text-2xl font-bold" :class="selectedType.textClass">
                                    {{ fmtStat(lastResult.stats[s.key], s) }}
                                </div>
                                <div class="text-xs text-gray-600 mt-1">
                                    {{ fmtStat(s.min, s) }} ～ {{ fmtStat(s.max, s) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </el-card>

            <!-- ── Card 4: 歷史紀錄 ── -->
            <el-card v-if="filteredHistory.length > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showHistory ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showHistory = !showHistory"
                >
                    <h2 class="text-xl font-bold text-accent">歷史紀錄</h2>
                    <el-tag type="info" size="small" @click.stop>{{ filteredHistory.length }} 筆</el-tag>
                    <span class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                </div>

                <template v-if="showHistory">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="text-gray-400 border-b border-gray-700 text-xs">
                                    <th class="text-left py-2 pr-4 font-normal">#</th>
                                    <th v-for="s in selectedType.stats" :key="s.key"
                                        class="text-center py-2 px-3 font-normal whitespace-nowrap">
                                        {{ s.label }}
                                    </th>
                                    <th v-if="hasAnyTarget" class="text-center py-2 px-3 font-normal">結果</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="r in filteredHistory" :key="r.craftId"
                                    class="border-b border-gray-800/60"
                                    :class="hasAnyTarget && r.isSuccess ? 'bg-green-900/10' : ''">
                                    <td class="py-1.5 pr-4 text-gray-600 text-xs">{{ r.craftId }}</td>
                                    <td v-for="s in selectedType.stats" :key="s.key"
                                        class="text-center py-1.5 px-3">
                                        <span :class="{
                                            'text-green-400 font-semibold': hasAnyTarget && curEnabled[s.key] && r.stats[s.key] >= curTargets[s.key],
                                            'text-orange-400':              hasAnyTarget && curEnabled[s.key] && r.stats[s.key] <  curTargets[s.key],
                                            'text-gray-300':               !hasAnyTarget || !curEnabled[s.key],
                                        }">
                                            {{ fmtStat(r.stats[s.key], s) }}
                                        </span>
                                    </td>
                                    <td v-if="hasAnyTarget" class="text-center py-1.5 px-3">
                                        <span v-if="r.isSuccess" class="text-green-400 text-base">✓</span>
                                        <span v-else class="text-gray-700">✗</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </template>
            </el-card>

        </div>
    </div>
</template>

<style scoped>
/* Coin chips */
.coin-chip {
    display: flex; flex-direction: column; align-items: center; gap: 4px;
    padding: 12px 18px; background: #1f2937; border: 1.5px solid #374151;
    border-radius: 10px; cursor: pointer; min-width: 90px;
    transition: border-color 0.15s, background 0.15s; user-select: none;
}
.coin-chip:hover { border-color: #6b7280; background: #263548; }
.coin-chip--active { border-width: 2px; }

.pixelated { image-rendering: pixelated; }

/* Target row */
.target-row {
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
    padding: 8px 12px; background: #111827; border: 1px solid;
    border-radius: 8px; transition: border-color 0.15s;
}

/* Stat tiles */
.stat-tile {
    background: #111827; border: 2px solid #374151; border-radius: 12px;
    padding: 1rem; display: flex; flex-direction: column;
    transition: border-color 0.15s, background 0.15s;
}
.stat-tile--hit  { border-color: #22c55e; background: rgba(5, 46, 22, 0.4); }
.stat-tile--miss { border-color: #f97316; background: rgba(67, 20, 7,  0.3); }

/* Transition */
.fade-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.fade-leave-active { transition: opacity 0.1s ease; }
.fade-enter-from   { opacity: 0; transform: translateY(-6px); }
.fade-leave-to     { opacity: 0; }
</style>
