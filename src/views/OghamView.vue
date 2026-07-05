<script setup lang="ts">
import { ref, computed } from "vue";
import { InfoFilled } from "@element-plus/icons-vue";
import { oghamArcanas, type OghamComboEffect } from "../data/ogham";

const selectedId = ref(oghamArcanas[0].id);
const arcana = computed(() => oghamArcanas.find((a) => a.id === selectedId.value)!);

// 目前選中的組合技（預設第一個有說明的）
const activeComboId = ref(oghamArcanas[0].combos[0]?.id ?? 0);
const activeCombo = computed(() => arcana.value.combos.find((c) => c.id === activeComboId.value) ?? arcana.value.combos[0]);

const availablePoints = computed(() => Object.keys(activeCombo.value?.points ?? {}).map(Number).sort((a, b) => a - b));
const activePoint = ref(9);
const currentText = computed(() => activeCombo.value?.points[String(activePoint.value)] ?? "");

// 顯示韓文原文（翻譯對照用）
const showKo = ref(false);
const currentTextKo = computed(() => activeCombo.value?.pointsKo[String(activePoint.value)] ?? "");

const NUM_RE = /\d+(?:\.\d+)?%?/g;

// 找出此組合各點數之間「會變動」的數字位置（多半是倍率）
const changingPositions = computed<Set<number> | null>(() => {
    const combo = activeCombo.value;
    if (!combo) return null;
    const seqs = availablePoints.value.map((p) => combo.points[String(p)]?.match(NUM_RE) ?? []);
    if (seqs.length < 2) return null;
    const len = seqs[0].length;
    if (!seqs.every((s) => s.length === len)) return null; // 結構不一致 → 退回
    const set = new Set<number>();
    for (let i = 0; i < len; i++) {
        if (new Set(seqs.map((s) => s[i])).size > 1) set.add(i);
    }
    return set;
});

// 將目前點數說明切成段落，標示會變動的數字（倍率）
const currentSegments = computed(() => {
    const changing = changingPositions.value;
    const lines: { text: string; hi: boolean }[][] = [];
    let numIdx = 0;
    for (const line of currentText.value.split("\n")) {
        const segs: { text: string; hi: boolean }[] = [];
        let last = 0;
        let m: RegExpExecArray | null;
        NUM_RE.lastIndex = 0;
        while ((m = NUM_RE.exec(line)) !== null) {
            if (m.index > last) segs.push({ text: line.slice(last, m.index), hi: false });
            const hi = changing ? changing.has(numIdx) : m[0].endsWith("%");
            segs.push({ text: m[0], hi });
            last = m.index + m[0].length;
            numIdx++;
        }
        if (last < line.length) segs.push({ text: line.slice(last), hi: false });
        lines.push(segs);
    }
    return lines;
});

const onArcanaChange = () => {
    const a = arcana.value;
    activeComboId.value = a.combos[0]?.id ?? 0;
    const pts = availablePoints.value;
    if (!pts.includes(activePoint.value)) activePoint.value = pts[pts.length - 1] ?? 9;
};

const categoryColor = (cat: OghamComboEffect["category"]): string =>
    cat === "祕法" ? "text-red-400" : cat === "主要才能" ? "text-blue-400" : "text-green-400";
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-4xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    符文（Ogham）
                </h1>
                <p class="text-base text-gray-400 mt-3">查詢各祕法的符文組合技與詞條效果</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <!-- 祕法選擇 -->
                <el-select v-model="selectedId" size="large" style="width: 240px" @change="onArcanaChange">
                    <el-option v-for="a in oghamArcanas" :key="a.id" :label="a.name" :value="a.id">
                        <span class="flex items-center gap-2">
                            <img v-if="a.icon" :src="a.icon" alt="" class="h-5 w-5 object-contain" />
                            {{ a.name }}
                        </span>
                    </el-option>
                </el-select>
                <span class="ml-3 text-sm text-gray-500">{{ arcana.mainTalent }} / {{ arcana.subTalent }}</span>
                <el-checkbox v-model="showKo" class="ml-4">
                    <span class="text-sm text-gray-300">顯示韓文原文</span>
                    <span class="text-xs text-gray-500 ml-1">（對照用）</span>
                </el-checkbox>

                <!-- 組合技按鈕 -->
                <div class="mt-4 flex flex-wrap gap-2">
                    <button
                        v-for="c in arcana.combos"
                        :key="c.id"
                        class="combo-btn"
                        :class="{ 'combo-btn--active': activeComboId === c.id }"
                        @click="activeComboId = c.id"
                    >
                        <img v-if="c.skillIcon" :src="c.skillIcon" alt="" class="h-6 w-6 object-contain" />
                        {{ c.skillName }}
                    </button>
                </div>

                <!-- 符文格 -->
                <div v-if="activeCombo?.words.length" class="mt-4 flex flex-wrap gap-2">
                    <div v-for="(w, i) in activeCombo.words" :key="i" class="word-tile">{{ w }}</div>
                </div>

                <!-- 示意圖 -->
                <div v-if="activeCombo?.inGameImg" class="mt-5">
                    <p class="text-center font-semibold text-gray-300 mb-1">組合技能使用畫面</p>
                    <img :src="activeCombo.inGameImg" alt="組合技能" class="combo-img" />
                </div>

                <!-- 點數效果按鈕 -->
                <div v-if="availablePoints.length" class="mt-5 flex flex-wrap gap-2">
                    <button
                        v-for="p in availablePoints"
                        :key="p"
                        class="point-btn"
                        :class="{ 'point-btn--active': activePoint === p }"
                        @click="activePoint = p"
                    >
                        {{ p }} 點效果
                    </button>
                </div>

                <!-- 效果說明 -->
                <div class="mt-4 grid gap-3" :class="showKo && currentTextKo ? 'sm:grid-cols-2' : 'grid-cols-1'">
                    <div class="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                        <p
                            v-for="(segs, i) in currentSegments"
                            :key="i"
                            class="text-sm text-gray-300 leading-relaxed min-h-[0.5rem]"
                            :class="i === 0 ? 'font-bold text-accent mb-1' : ''"
                        >
                            <template v-for="(seg, j) in segs" :key="j">
                                <span :class="seg.hi && i !== 0 ? 'text-accent font-bold' : ''">{{ seg.text }}</span>
                            </template>
                        </p>
                        <p v-if="!currentText" class="text-sm text-gray-500">此組合的效果說明資料待補</p>
                    </div>
                    <div
                        v-if="showKo && currentTextKo"
                        class="p-4 rounded-lg bg-gray-900/30 border border-dashed border-gray-600"
                    >
                        <p class="text-xs text-gray-500 mb-1">韓文原文</p>
                        <p
                            v-for="(line, i) in currentTextKo.split('\n')"
                            :key="i"
                            class="text-sm text-gray-400 leading-relaxed min-h-[0.5rem]"
                        >
                            {{ line }}
                        </p>
                    </div>
                </div>

                <!-- 詞條效果總表 -->
                <h2 class="section-title text-xl font-bold text-accent mt-8 mb-2">
                    {{ arcana.name }} 相關符文詞條效果
                </h2>
                <p class="mb-3 flex items-center gap-1 text-xs text-gray-400">
                    <el-icon class="text-accent"><InfoFilled /></el-icon>
                    標示
                    <el-icon class="text-accent"><InfoFilled /></el-icon>
                    的「祕法」分類為特殊符文專用
                </p>
                <el-table
                    :data="arcana.effectTable"
                    border
                    class="rounded-lg overflow-hidden"
                    :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                    :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                >
                    <el-table-column label="分類" width="120" align="center">
                        <template #default="{ row }">
                            <span :class="categoryColor(row.category)" class="font-semibold">{{ row.category }}</span>
                            <el-icon v-if="row.special" class="text-accent ml-1 align-middle">
                                <InfoFilled />
                            </el-icon>
                        </template>
                    </el-table-column>

                    <el-table-column label="選項" min-width="260">
                        <template #default="{ row }">
                            <div class="flex items-start gap-1.5 text-sm text-gray-200">
                                <img
                                    v-if="row.skillIcon"
                                    :src="row.skillIcon"
                                    alt=""
                                    class="h-4 w-4 object-contain mt-0.5 flex-shrink-0"
                                />
                                <span>{{ row.option }}</span>
                            </div>
                            <div v-if="showKo" class="text-xs text-gray-500 mt-0.5 pl-5">{{ row.optionKo }}</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="個別最大倍率" width="110" align="right">
                        <template #default="{ row }">
                            <span class="font-semibold text-accent">{{ row.base }}</span>
                        </template>
                    </el-table-column>
                </el-table>

                <p class="mt-3 text-right text-xs text-gray-600">
                    * 資料翻譯自韓服，可能與正服有出入或翻譯誤差，歡迎回報。
                </p>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.combo-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    height: 38px;
    font-size: 0.9rem;
    border-radius: 8px;
    border: 1.5px solid #374151;
    background: #1f2937;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.15s;
}
.combo-btn:hover {
    border-color: #6b7280;
}
.combo-btn--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}

.word-tile {
    min-width: 64px;
    height: 48px;
    padding: 0 10px;
    border: 1px solid #4b5563;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #111827;
    color: #fbbf24;
    font-size: 0.85rem;
    font-weight: 600;
}

.combo-img {
    max-width: 100%;
    width: 600px;
    display: block;
    margin: 0 auto;
    border-radius: 8px;
}

.point-btn {
    padding: 5px 12px;
    font-size: 0.85rem;
    border-radius: 6px;
    border: 1.5px solid #374151;
    background: #1f2937;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.15s;
}
.point-btn:hover {
    border-color: #6b7280;
}
.point-btn--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}
</style>
