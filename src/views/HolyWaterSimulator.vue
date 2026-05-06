<script setup lang="ts">
import { ref, computed, watch } from "vue";

const baseUrl = import.meta.env.BASE_URL;

// ===== Stat Definitions =====
interface StatDef {
    key: string;
    label: string;
    max: number; // max === 1 → fixed value, no range input needed
    unit: string;
}

interface StatGroup {
    label: string;
    stats: StatDef[];
}

const STAT_GROUPS: StatGroup[] = [
    {
        label: "戰鬥",
        stats: [
            { key: "maxDmg", label: "最大傷害", max: 30, unit: "" },
            { key: "magicAtk", label: "魔法攻擊力", max: 30, unit: "" },
            { key: "alchDmg", label: "四大鍊金屬性", max: 50, unit: "" },
            { key: "dollDmg", label: "人偶最大傷害", max: 50, unit: "" },
            { key: "heal", label: "治療效果", max: 10, unit: "%" },
            { key: "critRate", label: "暴擊率", max: 5, unit: "%" },
            { key: "critDmg", label: "暴擊傷害", max: 4, unit: "%" },
            { key: "balance", label: "平衡性", max: 5, unit: "%" },
        ],
    },
    {
        label: "基本屬性",
        stats: [
            { key: "hp", label: "生命值", max: 300, unit: "" },
            { key: "mp", label: "魔力值", max: 300, unit: "" },
            { key: "sp", label: "耐力值", max: 300, unit: "" },
            { key: "str", label: "力量", max: 30, unit: "" },
            { key: "int", label: "智力", max: 30, unit: "" },
            { key: "dex", label: "敏捷", max: 30, unit: "" },
            { key: "will", label: "意志", max: 30, unit: "" },
            { key: "luck", label: "幸運", max: 30, unit: "" },
        ],
    },
    {
        label: "防禦",
        stats: [
            { key: "def", label: "防禦", max: 100, unit: "" },
            { key: "magicDef", label: "魔法防禦", max: 100, unit: "" },
            { key: "prot", label: "保護", max: 3, unit: "" },
            { key: "magicProt", label: "魔法保護", max: 3, unit: "" },
        ],
    },
    {
        label: "自然恢復速度",
        stats: [
            { key: "hpRegen", label: "自然恢復生命值速度", max: 500, unit: "%" },
            { key: "mpRegen", label: "自然恢復魔力值速度", max: 500, unit: "%" },
            { key: "spRegen", label: "自然恢復耐力值速度", max: 500, unit: "%" },
        ],
    },
    {
        label: "特殊",
        stats: [
            { key: "sharp", label: "銳利抵抗", max: 1, unit: "" },
            { key: "music", label: "音樂演奏效果", max: 1, unit: "" },
        ],
    },
    {
        label: "套裝效果強化",
        stats: [
            { key: "iceLance", label: "冰矛套裝效果強化", max: 1, unit: "" },
            { key: "fireBolt", label: "火焰套裝效果強化", max: 1, unit: "" },
            { key: "fireBreath", label: "火焰噴射套裝效果強化", max: 1, unit: "" },
            { key: "waterCannon", label: "水砲套裝效果強化", max: 1, unit: "" },
            { key: "lifeAbsorb", label: "生命吸收套裝效果強化", max: 1, unit: "" },
            { key: "atkSpeed", label: "攻擊速度套裝效果強化", max: 1, unit: "" },
            { key: "arrowPierce", label: "穿心箭套裝效果強化", max: 1, unit: "" },
            { key: "smash", label: "猛擊套裝效果強化", max: 1, unit: "" },
            { key: "supportArrow", label: "支援箭套裝效果強化", max: 1, unit: "" },
            { key: "shockAbsorb", label: "衝擊吸收套裝效果強化", max: 1, unit: "" },
            { key: "heavyStrike", label: "重擊套裝效果強化", max: 1, unit: "" },
            { key: "whirlwind", label: "旋風擺蓮腿套裝效果強化", max: 1, unit: "" },
            { key: "charge", label: "突擊套裝效果強化", max: 1, unit: "" },
            { key: "leapAtk", label: "躍擊套裝效果強化", max: 1, unit: "" },
        ],
    },
];

// Flat list for easy lookup
const ALL_STATS: StatDef[] = STAT_GROUPS.flatMap((g) => g.stats);
const POOL_SIZE = ALL_STATS.length;

// ===== State =====
interface UseResult {
    useId: number;
    stat: StatDef;
    value: number;
    isSuccess: boolean;
    thisRunCount: number;
}

const targetStatKey = ref<string | null>(null);
const targetMinValue = ref<number>(1);
const autoMode = ref(false);
const totalUses = ref(0);
const successCount = ref(0);
const costPerUse = ref(0);
const lastResult = ref<UseResult | null>(null);
const history = ref<UseResult[]>([]);
const showHistory = ref(false);

// ===== Derived =====
const targetStat = computed(() =>
    targetStatKey.value ? (ALL_STATS.find((s) => s.key === targetStatKey.value) ?? null) : null,
);
const isFixed = (s: StatDef) => s.max === 1;
const hasTarget = computed(() => targetStat.value !== null);

// P(success per use) = P(draw this stat) × P(value >= min)
const successProb = computed((): number => {
    if (!targetStat.value) return 0;
    const s = targetStat.value;
    const pStat = 1 / POOL_SIZE;
    if (s.max === 1) return pStat;
    const pVal = Math.max(0, s.max - targetMinValue.value + 1) / s.max;
    return pStat * pVal;
});

const fmtPct = (p: number): string =>
    p >= 0.01 ? `${(p * 100).toFixed(2)}%` : `1 / ${Math.round(1 / p).toLocaleString()}`;

const fmtVal = (s: StatDef, v: number): string => `${v}${s.unit}`;

// ===== Roll helpers =====
const rollStat = (): StatDef => ALL_STATS[Math.floor(Math.random() * POOL_SIZE)];

const rollValue = (s: StatDef, minVal = 1): number =>
    s.max === 1 ? 1 : minVal + Math.floor(Math.random() * (s.max - minVal + 1));

const checkSuccess = (s: StatDef, v: number): boolean => {
    if (!targetStat.value) return false;
    return s.key === targetStat.value.key && v >= targetMinValue.value;
};

// ===== Actions =====
const doUse = () => {
    let count = 1;
    let stat: StatDef;
    let value: number;
    let isSuccess: boolean;

    if (autoMode.value && hasTarget.value && successProb.value > 0) {
        // Geometric sampling
        const p = successProb.value;
        count = Math.ceil(Math.log(Math.max(Number.EPSILON, Math.random())) / Math.log(1 - p));
        stat = targetStat.value!;
        value = rollValue(stat, targetStat.value!.max === 1 ? 1 : targetMinValue.value);
        isSuccess = true;
        successCount.value++;
    } else {
        stat = rollStat();
        value = rollValue(stat);
        isSuccess = checkSuccess(stat, value);
        if (isSuccess) successCount.value++;
    }

    totalUses.value += count;

    const result: UseResult = { useId: totalUses.value, stat, value, isSuccess, thisRunCount: count };
    lastResult.value = result;
    history.value.unshift(result);
    if (history.value.length > 100) history.value.pop();
};

const resetAll = () => {
    totalUses.value = 0;
    successCount.value = 0;
    lastResult.value = null;
    history.value = [];
};

// Reset success count when target changes
watch([targetStatKey, targetMinValue], () => {
    successCount.value = 0;
});
// Reset min value when switching stat
watch(targetStatKey, () => {
    targetMinValue.value = 1;
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-2xl mx-auto">
            <header class="mb-8 text-center pt-8 pb-4">
                <div class="flex justify-center mb-3">
                    <img
                        :src="`${baseUrl}itemImage/5040566.png`"
                        alt="聖水"
                        class="w-16 h-16 pixelated"
                        @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />
                </div>
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    聖水模擬器
                </h1>
                <p class="text-lg text-gray-400 mt-2">
                    模擬使用聖水的素質分布
                    <span class="text-xs text-gray-600 ml-2">池：{{ POOL_SIZE }} 種</span>
                </p>
                <p class="text-lg text-gray-400 mt-2">目前沒機率表，當前是隨便設定的，所以機率非常低</p>
            </header>

            <!-- ── 目標設定 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-4 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">目標設定</h2>
                    <el-checkbox v-model="autoMode" :disabled="!hasTarget">
                        <span class="text-sm" :class="!hasTarget ? 'text-gray-600' : 'text-gray-300'">
                            自動衝到達標
                        </span>
                        <span class="text-xs text-gray-600 ml-1">（需選目標）</span>
                    </el-checkbox>
                </div>

                <!-- Stat select -->
                <div class="flex flex-wrap items-center gap-3 mb-4">
                    <span class="text-sm text-gray-400 whitespace-nowrap">目標素質</span>
                    <el-select
                        v-model="targetStatKey"
                        placeholder="不設定目標（隨機顯示）"
                        clearable
                        style="min-width: 240px; flex: 1"
                    >
                        <el-option-group v-for="group in STAT_GROUPS" :key="group.label" :label="group.label">
                            <el-option
                                v-for="s in group.stats"
                                :key="s.key"
                                :value="s.key"
                                :label="s.label + (s.max === 1 ? '' : `（1～${s.max}${s.unit}）`)"
                            />
                        </el-option-group>
                    </el-select>
                </div>

                <!-- Min value input (only for variable stats) -->
                <div v-if="targetStat && !isFixed(targetStat)" class="flex items-center gap-3 mb-4">
                    <span class="text-sm text-gray-400">最低數值</span>
                    <el-input-number
                        v-model="targetMinValue"
                        :min="1"
                        :max="targetStat.max"
                        :step="1"
                        :precision="0"
                        size="small"
                        controls-position="right"
                        style="width: 110px"
                    />
                    <span class="text-sm text-gray-500">{{ targetStat.unit }}</span>
                    <span class="text-xs text-gray-500 ml-1">
                        （範圍 1 ～ {{ targetStat.max }}{{ targetStat.unit }}）
                    </span>
                </div>

                <!-- Probability summary -->
                <div v-if="hasTarget" class="pt-3 border-t border-gray-700 flex flex-wrap items-center gap-3 text-sm">
                    <span class="text-gray-400">每次成功率：</span>
                    <span class="text-yellow-400 font-bold text-base">{{ fmtPct(successProb) }}</span>
                    <span class="text-gray-500 ml-auto">
                        = 1/{{ POOL_SIZE }}
                        <template v-if="targetStat && !isFixed(targetStat)">
                            × {{ targetStat.max - targetMinValue + 1 }}/{{ targetStat.max }}
                        </template>
                    </span>
                </div>
            </el-card>

            <!-- ── 使用聖水 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">使用聖水</h2>
                    <template v-if="totalUses > 0">
                        <span class="text-sm text-gray-400 ml-auto">
                            已用
                            <span class="text-white font-bold">{{ totalUses.toLocaleString() }}</span>
                            次
                        </span>
                        <span v-if="hasTarget" class="text-sm text-gray-400">
                            · 達標
                            <span class="text-green-400 font-bold">{{ successCount }}</span>
                            次
                        </span>
                        <span v-if="costPerUse > 0" class="text-sm text-gray-400">
                            ·
                            <span class="text-yellow-400 font-bold">
                                {{ (totalUses * costPerUse).toLocaleString() }}
                            </span>
                            金
                        </span>
                    </template>
                </div>

                <!-- Cost input -->
                <div class="mb-5 flex items-center gap-3">
                    <img
                        :src="`${baseUrl}itemImage/5040566.png`"
                        alt="聖水"
                        class="w-7 h-7 pixelated"
                        @error="($event.target as HTMLImageElement).style.display = 'none'"
                    />
                    <span class="text-sm text-gray-400">每次費用（選填）</span>
                    <el-input-number
                        v-model="costPerUse"
                        :min="0"
                        :step="10000"
                        :precision="0"
                        size="small"
                        style="width: 150px"
                    />
                </div>

                <!-- Action -->
                <div class="flex items-center gap-3 mb-5">
                    <el-button type="warning" size="large" @click="doUse">
                        💧 {{ autoMode && hasTarget ? "自動使用" : "使用聖水" }}
                    </el-button>
                    <el-button v-if="totalUses > 0" size="small" plain class="ml-auto" @click="resetAll">
                        重置紀錄
                    </el-button>
                </div>

                <!-- Result -->
                <Transition name="fade" mode="out-in">
                    <div v-if="lastResult" :key="totalUses">
                        <!-- Auto mode count -->
                        <div
                            v-if="lastResult.thisRunCount > 1"
                            class="mb-3 flex flex-wrap items-center gap-2 text-sm px-1"
                        >
                            <span class="text-gray-400">本次花了</span>
                            <span class="text-yellow-400 font-bold text-lg">
                                {{ lastResult.thisRunCount.toLocaleString() }}
                            </span>
                            <span class="text-gray-400">次</span>
                            <template v-if="costPerUse > 0">
                                <span class="text-gray-600">≈</span>
                                <span class="text-orange-400 font-semibold">
                                    {{ (lastResult.thisRunCount * costPerUse).toLocaleString() }}
                                </span>
                                <span class="text-gray-400">金</span>
                            </template>
                        </div>

                        <!-- Success / fail banner -->
                        <div
                            v-if="hasTarget"
                            class="mb-3 py-2 px-4 rounded-lg font-bold text-center text-base"
                            :class="
                                lastResult.isSuccess
                                    ? 'bg-green-900/40 border border-green-500 text-green-400'
                                    : 'bg-gray-900/40 border border-gray-700 text-gray-500'
                            "
                        >
                            {{ lastResult.isSuccess ? "🎉 達標！" : "未達標，繼續加油" }}
                        </div>

                        <!-- Result tile -->
                        <div
                            class="result-tile"
                            :class="{
                                'result-tile--hit': hasTarget && lastResult.isSuccess,
                                'result-tile--miss': hasTarget && !lastResult.isSuccess,
                            }"
                        >
                            <div class="text-sm text-gray-400 mb-1">獲得素質</div>
                            <div class="text-xl font-bold text-accent mb-0.5">
                                {{ lastResult.stat.label }}
                            </div>
                            <div
                                class="text-3xl font-bold"
                                :class="
                                    lastResult.isSuccess
                                        ? 'text-green-400'
                                        : hasTarget
                                          ? 'text-orange-400'
                                          : 'text-blue-400'
                                "
                            >
                                +{{ fmtVal(lastResult.stat, lastResult.value) }}
                            </div>
                            <div v-if="!isFixed(lastResult.stat)" class="text-xs text-gray-600 mt-1">
                                範圍 1 ～ {{ lastResult.stat.max }}{{ lastResult.stat.unit }}
                            </div>
                        </div>
                    </div>
                </Transition>
            </el-card>

            <!-- ── 歷史紀錄 ── -->
            <el-card v-if="history.length > 0" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showHistory ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showHistory = !showHistory"
                >
                    <h2 class="text-xl font-bold text-accent">歷史紀錄</h2>
                    <el-tag type="info" size="small" @click.stop>{{ history.length }} 筆</el-tag>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showHistory ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>

                <template v-if="showHistory">
                    <div class="overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="text-gray-500 border-b border-gray-700 text-xs">
                                    <th class="text-left py-2 pr-4 font-normal">#</th>
                                    <th class="text-left py-2 pr-4 font-normal">素質</th>
                                    <th class="text-center py-2 px-3 font-normal">數值</th>
                                    <th v-if="hasTarget" class="text-center py-2 px-3 font-normal">結果</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="r in history"
                                    :key="r.useId"
                                    class="border-b border-gray-800/60"
                                    :class="hasTarget && r.isSuccess ? 'bg-green-900/10' : ''"
                                >
                                    <td class="py-1.5 pr-4 text-gray-600 text-xs">{{ r.useId }}</td>
                                    <td
                                        class="py-1.5 pr-4"
                                        :class="
                                            hasTarget && r.stat.key === targetStatKey
                                                ? r.isSuccess
                                                    ? 'text-green-400 font-semibold'
                                                    : 'text-orange-400'
                                                : 'text-gray-300'
                                        "
                                    >
                                        {{ r.stat.label }}
                                    </td>
                                    <td
                                        class="text-center py-1.5 px-3"
                                        :class="
                                            hasTarget && r.isSuccess ? 'text-green-400 font-semibold' : 'text-gray-300'
                                        "
                                    >
                                        +{{ fmtVal(r.stat, r.value) }}
                                    </td>
                                    <td v-if="hasTarget" class="text-center py-1.5 px-3">
                                        <span v-if="r.isSuccess" class="text-green-400">✓</span>
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
.pixelated {
    image-rendering: pixelated;
}

.result-tile {
    background: #111827;
    border: 2px solid #374151;
    border-radius: 12px;
    padding: 1.2rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
    transition:
        border-color 0.15s,
        background 0.15s;
}
.result-tile--hit {
    border-color: #22c55e;
    background: rgba(5, 46, 22, 0.4);
}
.result-tile--miss {
    border-color: #f97316;
    background: rgba(67, 20, 7, 0.3);
}

/* Transition */
.fade-enter-active {
    transition:
        opacity 0.18s ease,
        transform 0.18s ease;
}
.fade-leave-active {
    transition: opacity 0.1s ease;
}
.fade-enter-from {
    opacity: 0;
    transform: translateY(-6px);
}
.fade-leave-to {
    opacity: 0;
}
</style>
