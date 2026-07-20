<script setup lang="ts">
import { ref, computed } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import { gachaPools } from "../data/gachaPools";

interface GachaItem {
    grade: string;
    name: string;
    prob: number;
}

const inputText = useLocalStorage<string>("gacha-sim-input", gachaPools[0].text);

// 內建池子下拉：選了就把該池子機率表載入文字框（仍可手動編輯／貼上覆蓋）
const selectedPool = ref("");
const loadPool = (name: string) => {
    const pool = gachaPools.find((p) => p.name === name);
    if (!pool) return;
    inputText.value = pool.text;
    applyInput();
};

const parsed = computed<{ title: string; items: GachaItem[] }>(() => {
    const lines = inputText.value.split("\n");
    let title = "";
    const items: GachaItem[] = [];
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) continue;
        const cells = line.split(/\t+|\s{2,}/).map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 3) {
            const prob = parseFloat(cells[cells.length - 1].replace(/[%％\s]/g, ""));
            if (!Number.isNaN(prob) && prob > 0) {
                items.push({ grade: cells[0], name: cells.slice(1, -1).join(" "), prob });
                continue;
            }
        }
        if (!title && !/等級|道具名稱|個別機率/.test(line)) title = line;
    }
    return { title, items };
});

const items = computed(() => parsed.value.items);
const totalProb = computed(() => items.value.reduce((s, i) => s + i.prob, 0));

// ===== 統計 =====
const counts = ref<Record<string, number>>({});
const totalPulls = ref(0);

const resetStats = () => {
    counts.value = {};
    totalPulls.value = 0;
    autoResult.value = "";
};

// 貼上新資料時清空統計
const applyInput = () => resetStats();

const pickOne = (): GachaItem => {
    const r = Math.random() * totalProb.value;
    let acc = 0;
    for (const it of items.value) {
        acc += it.prob;
        if (r < acc) return it;
    }
    return items.value[items.value.length - 1];
};

const lastResults = ref<GachaItem[]>([]);

const pull = (n: number) => {
    if (items.value.length === 0) return;
    const batch: GachaItem[] = [];
    for (let i = 0; i < n; i++) {
        const it = pickOne();
        counts.value[it.name] = (counts.value[it.name] ?? 0) + 1;
        batch.push(it);
    }
    totalPulls.value += n;
    lastResults.value = batch;
    autoResult.value = "";
};

// ===== 抽到目標為止 =====
const targetName = ref<string>("");
const maxTries = ref(100000);
const autoResult = ref("");

const pullUntil = () => {
    if (items.value.length === 0 || !targetName.value) return;
    let tries = 0;
    let hit = false;
    const batch: GachaItem[] = [];
    while (tries < maxTries.value) {
        tries++;
        const it = pickOne();
        counts.value[it.name] = (counts.value[it.name] ?? 0) + 1;
        batch.push(it);
        if (it.name === targetName.value) {
            hit = true;
            break;
        }
    }
    totalPulls.value += tries;
    lastResults.value = batch.slice(-10);
    const tgt = items.value.find((i) => i.name === targetName.value);
    const expect = tgt ? (100 / tgt.prob).toFixed(0) : "?";
    autoResult.value = hit
        ? `🎉 第 ${tries.toLocaleString()} 抽抽中「${targetName.value}」（理論期望 ${expect} 抽）`
        : `⚠ ${tries.toLocaleString()} 抽仍未抽中（已達上限）`;
};

// ===== 顯示 =====
const gradeColor = (grade: string): string => {
    const g = grade.trim()[0]?.toUpperCase();
    return g === "S" ? "text-yellow-400" : g === "A" ? "text-purple-400" : g === "B" ? "text-blue-400" : "text-gray-300";
};

// 統計篩選
const filterGrade = ref<string>("");
const filterName = ref<string>("");
const gradeOptions = computed(() => [...new Set(items.value.map((i) => i.grade))]);

const sortedStats = computed(() =>
    items.value
        .filter((it) => !filterGrade.value || it.grade === filterGrade.value)
        .filter((it) => !filterName.value.trim() || it.name.includes(filterName.value.trim()))
        .map((it) => {
            const c = counts.value[it.name] ?? 0;
            return { ...it, count: c, actual: totalPulls.value ? (c / totalPulls.value) * 100 : 0 };
        })
        .sort((a, b) => b.count - a.count),
);

// 各等級統計
const gradeStats = computed(() => {
    const m: Record<string, { count: number; prob: number }> = {};
    for (const it of items.value) {
        const g = it.grade;
        if (!m[g]) m[g] = { count: 0, prob: 0 };
        m[g].prob += it.prob;
        m[g].count += counts.value[it.name] ?? 0;
    }
    return Object.entries(m).map(([grade, v]) => ({ grade, ...v }));
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-4xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    轉蛋模擬器
                </h1>
                <p class="text-base text-gray-400 mt-3">貼上機率表即可模擬抽取，試手氣、算期望</p>
            </header>

            <!-- 輸入 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">機率表</h2>
                    <el-select
                        v-model="selectedPool"
                        placeholder="選擇內建池子"
                        size="small"
                        style="width: 220px"
                        @change="loadPool"
                    >
                        <el-option v-for="p in gachaPools" :key="p.name" :label="p.name" :value="p.name" />
                    </el-select>
                    <span class="text-xs text-gray-500 hidden sm:inline">或自行貼上機率表（Tab／多空格分隔）</span>
                    <span
                        class="ml-auto text-sm"
                        :class="Math.abs(totalProb - 100) < 0.5 ? 'text-green-400' : 'text-orange-400'"
                    >
                        機率總和 {{ totalProb.toFixed(2) }}%
                    </span>
                </div>
                <el-input
                    v-model="inputText"
                    type="textarea"
                    :rows="8"
                    placeholder="貼上箱子名稱與機率表…"
                    class="gacha-input"
                    @change="applyInput"
                />
                <p v-if="parsed.title" class="mt-2 text-sm text-gray-300">
                    <span class="text-gray-500">箱子：</span>{{ parsed.title }}
                    <span class="text-gray-500 ml-2">共 {{ items.length }} 項</span>
                </p>
            </el-card>

            <!-- 抽取 -->
            <el-card v-if="items.length" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="flex items-center gap-3 mb-4 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">抽取</h2>
                    <span v-if="totalPulls > 0" class="text-sm text-gray-400 ml-auto">
                        已抽 <span class="text-white font-bold">{{ totalPulls.toLocaleString() }}</span> 次
                    </span>
                </div>
                <div class="flex flex-wrap items-center gap-2 mb-4">
                    <el-button type="warning" size="large" @click="pull(1)">抽 1 次</el-button>
                    <el-button type="warning" plain @click="pull(10)">抽 10 次</el-button>
                    <el-button type="warning" plain @click="pull(100)">抽 100 次</el-button>
                    <el-button v-if="totalPulls > 0" size="small" plain class="ml-auto" @click="resetStats">
                        重置統計
                    </el-button>
                </div>

                <!-- 上次抽取結果 -->
                <div v-if="lastResults.length" class="flex flex-wrap gap-1.5">
                    <span
                        v-for="(it, i) in lastResults"
                        :key="i"
                        class="result-chip"
                        :class="gradeColor(it.grade)"
                    >
                        <b>{{ it.grade.trim()[0] }}</b> {{ it.name }}
                    </span>
                </div>
            </el-card>

            <!-- 抽到目標為止 -->
            <el-card v-if="items.length" class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <h2 class="text-xl font-bold text-accent mb-3">抽到目標為止</h2>
                <div class="flex flex-wrap items-end gap-3">
                    <div>
                        <p class="text-sm text-gray-400 mb-1">目標道具</p>
                        <el-select v-model="targetName" placeholder="選擇目標" filterable clearable style="width: 280px">
                            <el-option v-for="it in items" :key="it.name" :label="it.name" :value="it.name">
                                <span class="flex items-center gap-1">
                                    <b :class="gradeColor(it.grade)">{{ it.grade.trim()[0] }}</b>
                                    {{ it.name }}
                                    <span class="text-gray-500 text-xs">{{ it.prob }}%</span>
                                </span>
                            </el-option>
                        </el-select>
                    </div>
                    <div>
                        <p class="text-sm text-gray-400 mb-1">最多次數</p>
                        <el-input-number
                            v-model="maxTries"
                            :min="1"
                            :max="10000000"
                            :step="1000"
                            controls-position="right"
                            style="width: 140px"
                        />
                    </div>
                    <el-button type="warning" :disabled="!targetName" @click="pullUntil">抽到為止</el-button>
                </div>
                <p v-if="autoResult" class="mt-3 text-sm text-gray-200">{{ autoResult }}</p>
            </el-card>

            <!-- 統計 -->
            <el-card
                v-if="totalPulls > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6"
            >
                <h2 class="text-xl font-bold text-accent mb-3">統計（{{ totalPulls.toLocaleString() }} 抽）</h2>

                <!-- 各等級 -->
                <div class="flex flex-wrap gap-3 mb-4">
                    <div v-for="g in gradeStats" :key="g.grade" class="grade-card">
                        <div class="text-sm font-bold" :class="gradeColor(g.grade)">{{ g.grade }}</div>
                        <div class="text-lg font-bold text-white">{{ g.count.toLocaleString() }}</div>
                        <div class="text-xs text-gray-500">
                            {{ ((g.count / totalPulls) * 100).toFixed(2) }}% / 理論 {{ g.prob.toFixed(2) }}%
                        </div>
                    </div>
                </div>

                <!-- 各道具 -->
                <div class="flex flex-wrap items-center gap-2 mb-3">
                    <el-select v-model="filterGrade" placeholder="全部等級" clearable size="small" style="width: 130px">
                        <el-option v-for="g in gradeOptions" :key="g" :label="g" :value="g" />
                    </el-select>
                    <el-input
                        v-model="filterName"
                        placeholder="搜尋道具名稱"
                        clearable
                        size="small"
                        style="max-width: 220px"
                    />
                    <span class="text-xs text-gray-500">顯示 {{ sortedStats.length }} / {{ items.length }} 項</span>
                </div>
                <el-table
                    :data="sortedStats"
                    border
                    size="small"
                    :max-height="420"
                    class="rounded-lg overflow-hidden"
                    :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                    :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                >
                    <el-table-column label="等級" width="60" align="center">
                        <template #default="{ row }">
                            <b :class="gradeColor(row.grade)">{{ row.grade.trim()[0] }}</b>
                        </template>
                    </el-table-column>
                    <el-table-column prop="name" label="道具名稱" min-width="180" />
                    <el-table-column label="抽中次數" width="90" align="right">
                        <template #default="{ row }">{{ row.count.toLocaleString() }}</template>
                    </el-table-column>
                    <el-table-column label="實際 / 理論" min-width="130" align="right">
                        <template #default="{ row }">
                            <span class="text-gray-200">{{ row.actual.toFixed(2) }}%</span>
                            <span class="text-gray-500 text-xs"> / {{ row.prob }}%</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.gacha-input :deep(textarea) {
    font-family: ui-monospace, monospace;
    font-size: 0.85rem;
    background: #111827;
    color: #e5e7eb;
    border-color: #374151;
}

.result-chip {
    padding: 3px 8px;
    font-size: 0.8rem;
    border-radius: 6px;
    background: #111827;
    border: 1px solid #374151;
}

.grade-card {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 10px;
    padding: 0.6rem 1rem;
    min-width: 100px;
}
</style>
