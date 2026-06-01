<script setup lang="ts">
import { ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { ECHOSTONE_OPTIONS, LEVEL_PROB_TABLE, type EchostoneOption } from "../data/echostoneOptions";

// ===== Types =====
interface AwakeningResult {
    name: string;
    level: number;
    maxLevel: number;
}

interface TargetEntry {
    name: string;
    minLevel: number;
    maxLevel: number;
    anyLevel?: boolean;
}

const baseUrl = import.meta.env.BASE_URL;

// ===== Stone color config =====
const STONE_COLORS = [
    { id: "red",    label: "紅色", img: `${baseUrl}itemImage/53934.png` },
    { id: "blue",   label: "藍色", img: `${baseUrl}itemImage/53935.png` },
    { id: "yellow", label: "黃色", img: `${baseUrl}itemImage/53936.png` },
    { id: "white",  label: "銀色", img: `${baseUrl}itemImage/53937.png` },
    { id: "black",  label: "黑色", img: `${baseUrl}itemImage/53938.png` },
];

const POLISH_IMG = `${baseUrl}itemImage/5040961.png`;

// ===== State =====
const selectedColor      = ref("red");
const rollCount          = ref(0);
const currentResult      = ref<AwakeningResult | null>(null);
const polishAvail        = ref(false);
const polishUsedThisTurn = ref(false);
const autoRunning        = ref(false);
const autoCount          = ref(0);
const autoMode           = ref(false);

interface PolishLog { before: number; rolled: number; final: number; }
const lastPolish = ref<PolishLog | null>(null);

// Pool / target state
const targets        = ref<TargetEntry[]>([]);
const filterText     = ref("");
const showPoolCard   = ref(true);
const showTargetCard = ref(true);

// ===== Computed =====
const options = computed<EchostoneOption[]>(() => ECHOSTONE_OPTIONS[selectedColor.value] ?? []);

const filteredPool = computed(() => {
    const q = filterText.value.trim();
    return q ? options.value.filter(o => o.name.includes(q)) : options.value;
});

const totalProb = computed(() => options.value.reduce((s, o) => s + o.prob, 0));

const canPolish = computed(() =>
    currentResult.value !== null && polishAvail.value && !polishUsedThisTurn.value
);

const isHit = computed(() => currentResult.value !== null && isMatch(currentResult.value));

const matchedTarget = computed(() => {
    if (!currentResult.value) return null;
    return targets.value.find(
        t => t.name === currentResult.value!.name && currentResult.value!.level >= t.minLevel
    ) ?? null;
});

// P(level >= minLv) for a given maxLevel
function levelHitProb(maxLevel: number, minLevel: number): number {
    const dist = LEVEL_PROB_TABLE[maxLevel];
    if (!dist) return 1;
    let sum = 0;
    for (let i = minLevel - 1; i < dist.length; i++) sum += dist[i];
    return sum / 100;
}

// P(this option is drawn AND level >= minLevel)
function targetProb(t: TargetEntry): number {
    const opt = options.value.find(o => o.name === t.name);
    if (!opt || totalProb.value === 0) return 0;
    return (opt.prob / totalProb.value) * levelHitProb(opt.maxLevel, t.minLevel);
}

// Total success prob per roll (union of independent single-option events)
const successProb = computed(() => targets.value.reduce((s, t) => s + targetProb(t), 0));

function fmtProb(p: number): string {
    if (p <= 0) return "0%";
    return `${(p * 100).toFixed(3)}%`;
}

// ===== Pool helpers =====
const isTargeted = (name: string) => targets.value.some(t => t.name === name);

function toggleTarget(row: EchostoneOption) {
    const idx = targets.value.findIndex(t => t.name === row.name);
    if (idx >= 0) {
        targets.value.splice(idx, 1);
    } else if (targets.value.length < 10) {
        targets.value.push({ name: row.name, minLevel: row.maxLevel, maxLevel: row.maxLevel });
    }
}

function removeTarget(name: string) {
    targets.value = targets.value.filter(t => t.name !== name);
}

// ===== Roll helpers =====
function buildCumulative(opts: EchostoneOption[]) {
    const cum: number[] = [];
    let acc = 0;
    for (const o of opts) { acc += o.prob; cum.push(acc); }
    return cum;
}

function pickLevel(maxLevel: number): number {
    const dist = LEVEL_PROB_TABLE[maxLevel];
    if (!dist) return 1;
    const r = Math.random() * 100;
    let acc = 0;
    for (let i = 0; i < dist.length; i++) {
        acc += dist[i];
        if (r < acc) return i + 1;
    }
    return dist.length;
}

function doRoll(): AwakeningResult {
    const opts = options.value;
    const cum  = buildCumulative(opts);
    const total = cum[cum.length - 1];
    const r = Math.random() * total;
    let idx = cum.findIndex(c => r < c);
    if (idx < 0) idx = opts.length - 1;
    const opt = opts[idx];
    return { name: opt.name, level: pickLevel(opt.maxLevel), maxLevel: opt.maxLevel };
}

function isMatch(result: AwakeningResult): boolean {
    return targets.value.some(t => t.name === result.name && result.level >= t.minLevel);
}

// ===== Actions =====
function roll() {
    if (autoRunning.value) return;
    if (autoMode.value && targets.value.length > 0) {
        autoRoll();
        return;
    }
    const result = doRoll();
    rollCount.value++;
    currentResult.value = result;
    polishAvail.value = true;
    polishUsedThisTurn.value = false;
    lastPolish.value = null;
}

function usePolish() {
    if (!canPolish.value || !currentResult.value) return;
    const before = currentResult.value.level;
    const rolled = pickLevel(currentResult.value.maxLevel);
    const final  = Math.max(before, rolled);
    currentResult.value = { ...currentResult.value, level: final };
    lastPolish.value = { before, rolled, final };
    polishUsedThisTurn.value = true;
}

function autoRoll() {
    if (autoRunning.value) { autoRunning.value = false; return; }
    if (targets.value.length === 0) return;
    autoRunning.value = true;
    autoCount.value = 0;

    const MAX = 10000;
    let count = 0;
    let found: AwakeningResult | null = null;

    while (count < MAX) {
        const result = doRoll();
        count++;
        if (isMatch(result)) { found = result; break; }
    }

    rollCount.value += count;
    autoCount.value = count;
    currentResult.value = found ?? doRoll();
    polishAvail.value = true;
    polishUsedThisTurn.value = false;
    lastPolish.value = null;
    autoRunning.value = false;
}

function resetAll() {
    rollCount.value = 0;
    currentResult.value = null;
    polishAvail.value = false;
    polishUsedThisTurn.value = false;
    autoCount.value = 0;
    lastPolish.value = null;
}

function selectColor(id: string) {
    selectedColor.value = id;
    resetAll();
    targets.value = [];
    filterText.value = "";
}
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-4xl mx-auto">
            <header class="mb-8 text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    回音石模擬器
                </h1>
                <p class="text-lg text-gray-400 mt-4">模擬回音石覺醒詞條，支援目標設定與連續覺醒</p>
            </header>

            <!-- ── 顏色選擇 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3">
                    <h2 class="text-xl font-bold text-accent">選擇回音石</h2>
                </div>
                <div class="flex items-center gap-4">
                    <el-select
                        :model-value="selectedColor"
                        size="large"
                        style="width: 180px"
                        @change="selectColor"
                    >
                        <el-option
                            v-for="c in STONE_COLORS"
                            :key="c.id"
                            :value="c.id"
                            :label="c.label + '回音石'"
                        >
                            <div class="flex items-center gap-2">
                                <img :src="c.img" class="w-6 h-6" style="image-rendering:pixelated" />
                                <span>{{ c.label }}回音石</span>
                            </div>
                        </el-option>
                    </el-select>
                    <img
                        :src="STONE_COLORS.find(c => c.id === selectedColor)?.img"
                        class="w-12 h-12"
                        style="image-rendering:pixelated"
                    />
                </div>
            </el-card>

            <!-- ── 覺醒結果 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="mb-4 border-b border-gray-700 pb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">覺醒結果</h2>
                    <template v-if="rollCount > 0">
                        <span class="text-sm text-gray-400 ml-auto">
                            已嘗試 <span class="text-white font-bold">{{ rollCount.toLocaleString() }}</span> 次
                        </span>
                        <span v-if="autoCount > 0" class="text-sm text-green-400">
                            本次連續 <span class="font-bold">{{ autoCount.toLocaleString() }}</span> 次
                        </span>
                    </template>
                </div>

                <!-- Banner -->
                <Transition name="roll-fade" mode="out-in">
                    <div
                        v-if="currentResult && targets.length > 0"
                        :key="rollCount"
                        class="mb-3 py-2 px-4 rounded-lg font-bold text-center text-base"
                        :class="isHit
                            ? 'bg-green-900/40 border border-green-500 text-green-400'
                            : 'bg-gray-900/40 border border-gray-700 text-gray-500'"
                    >
                        <span v-if="isHit">
                            🎉 目標達成！{{ matchedTarget?.name }} ≥ Lv.{{ matchedTarget?.minLevel }}
                        </span>
                        <span v-else>未達目標，繼續加油</span>
                    </div>
                </Transition>

                <!-- Result tile -->
                <Transition name="roll-fade" mode="out-in">
                    <div
                        :key="'tile-' + rollCount"
                        class="result-tile"
                        :class="[`tile-${selectedColor}`, { 'tile-hit': isHit }]"
                    >
                        <template v-if="currentResult">
                            <div class="result-name" :class="{ 'text-green-300': isHit }">
                                {{ currentResult.name }}
                            </div>
                            <div class="result-level" :class="isHit ? 'text-green-400' : 'text-yellow-400'">
                                Lv.{{ currentResult.level }}
                                <span class="text-sm text-gray-500 font-normal">/ {{ currentResult.maxLevel }}</span>
                            </div>
                        </template>
                        <div v-else class="text-gray-600 text-sm">尚未覺醒</div>
                    </div>
                </Transition>

                <!-- Polish log -->
                <div
                    v-if="lastPolish"
                    class="polish-log mt-3"
                    :class="lastPolish.final > lastPolish.before ? 'polish-up' : 'polish-same'"
                >
                    <img :src="POLISH_IMG" alt="" class="w-6 h-6 flex-shrink-0" style="image-rendering:pixelated" />
                    <span class="flex items-center flex-wrap gap-1 text-sm text-gray-300">
                        打磨結果：
                        <span class="text-gray-400 font-semibold">Lv.{{ lastPolish.before }}</span>
                        <span class="text-gray-600">→</span>
                        <span class="text-sky-400 font-semibold">抽到 Lv.{{ lastPolish.rolled }}</span>
                        <span class="text-gray-600">→</span>
                        <span class="text-yellow-400 font-bold">最終 Lv.{{ lastPolish.final }}</span>
                        <span
                            class="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
                            :class="lastPolish.final > lastPolish.before
                                ? 'bg-emerald-900 text-emerald-400'
                                : 'bg-gray-800 text-gray-500'"
                        >
                            {{ lastPolish.final > lastPolish.before ? '↑ 提升' : '持平' }}
                        </span>
                    </span>
                </div>

                <!-- Actions -->
                <div class="flex items-center gap-3 mt-4 flex-wrap">
                    <el-button
                        size="large"
                        :disabled="!canPolish"
                        :title="polishUsedThisTurn ? '需再次覺醒後才能使用' : '使用回音石打磨石'"
                        class="polish-btn"
                        @click="usePolish"
                    >
                        <img :src="POLISH_IMG" alt="" class="w-5 h-5 mr-1" style="image-rendering:pixelated;vertical-align:middle" />
                        回音石打磨石
                        <span v-if="polishUsedThisTurn" class="text-xs opacity-60 ml-1">（本輪已用）</span>
                    </el-button>
                    <el-button type="primary" size="large" :disabled="autoRunning" @click="roll">
                        ✦ 覺醒
                    </el-button>
                    <el-checkbox v-model="autoMode" size="large" class="!ml-1 text-gray-300">
                        自動到達標
                    </el-checkbox>
                    <el-button v-if="rollCount > 0" size="small" plain class="ml-auto" @click="resetAll">
                        重置次數
                    </el-button>
                </div>
            </el-card>

            <!-- ── 詞條池 ── -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showPoolCard ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showPoolCard = !showPoolCard"
                >
                    <h2 class="text-xl font-bold text-accent">詞條池</h2>
                    <el-tag type="info" size="small" @click.stop>{{ options.length }} 個</el-tag>
                    <span class="ml-auto text-xs text-gray-500 hidden sm:inline">
                        點擊列選為目標（至多 10 個）
                    </span>
                    <span
                        class="text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showPoolCard ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >▼</span>
                </div>

                <template v-if="showPoolCard">
                    <div class="mb-3">
                        <el-input
                            v-model="filterText"
                            placeholder="搜尋詞條名稱…"
                            clearable
                            size="small"
                            style="max-width: 280px"
                        >
                            <template #prefix><el-icon><Search /></el-icon></template>
                        </el-input>
                        <span v-if="filterText" class="text-xs text-gray-500 ml-3">
                            顯示 {{ filteredPool.length }} / {{ options.length }} 個
                        </span>
                    </div>

                    <el-table
                        :data="filteredPool"
                        size="small"
                        :max-height="400"
                        :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                        :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                        :row-class-name="({ row }: { row: EchostoneOption }) => isTargeted(row.name) ? 'selected-row' : ''"
                        @row-click="(row: EchostoneOption) => toggleTarget(row)"
                    >
                        <el-table-column width="32" align="center">
                            <template #default="{ row }">
                                <span v-if="isTargeted(row.name)" class="text-yellow-400 text-base">✓</span>
                            </template>
                        </el-table-column>

                        <el-table-column label="詞條名稱" min-width="180">
                            <template #default="{ row }">
                                <span :class="isTargeted(row.name) ? 'text-yellow-300 font-semibold' : ''">
                                    {{ row.name }}
                                </span>
                            </template>
                        </el-table-column>

                        <el-table-column label="等級範圍" width="100" align="center">
                            <template #default="{ row }">
                                Lv.1 ～ {{ row.maxLevel }}
                            </template>
                        </el-table-column>

                        <el-table-column label="出現機率" width="110" align="right">
                            <template #default="{ row }">
                                <span class="text-blue-400 font-mono text-xs">
                                    {{ fmtProb(row.prob / totalProb) }}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>

                    <p v-if="targets.length >= 10" class="text-xs text-orange-400 mt-2">
                        已選 10 個目標（上限），請先移除才能繼續新增
                    </p>
                    <div class="mt-4 flex justify-end">
                        <el-button type="primary" size="small" @click="showPoolCard = false">選好了 ✓</el-button>
                    </div>
                </template>
            </el-card>

            <!-- ── 目標設定 ── -->
            <el-card
                v-if="targets.length > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
            >
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showTargetCard ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showTargetCard = !showTargetCard"
                >
                    <h2 class="text-xl font-bold text-accent">目標設定</h2>
                    <span class="text-xs text-gray-400">出現任一詞條即達標</span>
                    <el-button
                        size="small" type="danger" plain class="ml-auto"
                        @click.stop="targets = []"
                    >清除全部</el-button>
                    <span
                        class="text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showTargetCard ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >▼</span>
                </div>

                <template v-if="showTargetCard">
                    <div class="flex flex-col gap-3 mb-4">
                        <div
                            v-for="(t, idx) in targets"
                            :key="t.name"
                            class="target-row"
                        >
                            <span class="target-badge">{{ idx + 1 }}</span>
                            <span class="target-name-text">{{ t.name }}</span>
                            <span class="text-xs text-gray-500 hidden sm:inline">
                                (Lv.1 ～ {{ t.maxLevel }})
                            </span>
                            <el-checkbox
                                v-model="t.anyLevel"
                                size="small"
                                class="ml-auto"
                                @change="(v: boolean) => { if (v) t.minLevel = 1; }"
                            >有就好</el-checkbox>
                            <el-input-number
                                v-model="t.minLevel"
                                :min="1"
                                :max="t.maxLevel"
                                :disabled="t.anyLevel"
                                size="small"
                                controls-position="right"
                                style="width: 90px"
                            />
                            <span
                                class="text-xs w-20 text-right font-mono"
                                :class="targetProb(t) < 0.01 ? 'text-orange-400' : 'text-green-400'"
                            >
                                {{ fmtProb(targetProb(t)) }}
                            </span>
                            <el-button size="small" type="danger" plain circle @click="removeTarget(t.name)">
                                ×
                            </el-button>
                        </div>
                    </div>

                    <!-- Success prob summary -->
                    <div class="prob-summary">
                        <span class="text-gray-400 text-sm">每次覺醒成功率 =</span>
                        <span class="text-yellow-400 font-bold text-base ml-2">{{ fmtProb(successProb) }}</span>
                        <span class="text-gray-600 text-xs ml-2">
                            （平均需 {{ successProb > 0 ? Math.round(1 / successProb).toLocaleString() : '∞' }} 次）
                        </span>
                    </div>

                </template>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
/* Color buttons */
.color-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    border: 2px solid transparent;
    background: #111827;
    cursor: pointer;
    transition: border-color 0.15s, transform 0.1s, background 0.15s;
    min-width: 68px;
}
.color-btn:hover { transform: scale(1.05); background: #1f2937; }
.color-btn--active { border-color: #f1f5f9; background: #1f2937; box-shadow: 0 0 0 2px rgba(255,255,255,0.12); }
.stone-img   { width: 44px; height: 44px; image-rendering: pixelated; }
.stone-label { font-size: 0.72rem; color: #94a3b8; font-weight: 500; }

/* Result tile */
.result-tile {
    border-radius: 10px;
    padding: 1.1rem 1.25rem;
    text-align: center;
    min-height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    border: 2px solid transparent;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.tile-red    { background: rgba(185,28,28,0.18);  border-color: #b91c1c; }
.tile-blue   { background: rgba(29,78,216,0.18);  border-color: #1d4ed8; }
.tile-yellow { background: rgba(202,138,4,0.18);  border-color: #ca8a04; }
.tile-white  { background: rgba(203,213,225,0.08); border-color: #94a3b8; }
.tile-black  { background: rgba(55,65,81,0.25);   border-color: #6b7280; }
.tile-hit    { border-color: #22c55e !important; box-shadow: 0 0 18px rgba(34,197,94,0.22); }

.result-name  { font-size: 1rem; font-weight: 600; color: #f8fafc; }
.result-level { font-size: 1.6rem; font-weight: 800; }

/* Polish log */
.polish-log {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    border: 1px solid transparent;
}
.polish-up   { background: rgba(16,185,129,0.08); border-color: #059669; }
.polish-same { background: rgba(100,116,139,0.1); border-color: #475569; }

/* Polish button */
.polish-btn {
    background: #4c1d95;
    border-color: #7c3aed;
    color: #e9d5ff;
}
.polish-btn:not(:disabled):hover { background: #5b21b6 !important; border-color: #8b5cf6 !important; }
.polish-btn:disabled { opacity: 0.45; }

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
.target-name-text {
    font-weight: 600;
    color: #fbbf24;
    min-width: 100px;
    flex: 1;
}

/* Prob summary */
.prob-summary {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 0.6rem 1rem;
}

/* Table */
:deep(.selected-row td) {
    background: #1c3a4f !important;
    border-color: #3b82f6 !important;
}
:deep(.el-table__row) { cursor: pointer; }
:deep(.el-table__row:hover td) { background: #1f3040 !important; }

/* Transition */
.roll-fade-enter-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.roll-fade-leave-active { transition: opacity 0.1s ease; }
.roll-fade-enter-from   { opacity: 0; transform: translateY(-5px); }
.roll-fade-leave-to     { opacity: 0; }
</style>
