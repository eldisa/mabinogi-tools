<script setup lang="ts">
import { ref, computed } from "vue";
import { arcanaCombos, type ComboEffectRow } from "../data/arcanaCombo";

const selectedId = ref(arcanaCombos[0].id);
const arcana = computed(() => arcanaCombos.find((a) => a.id === selectedId.value)!);

// 目前選中的組合技（預設 primary）
const activeSkill = ref(arcanaCombos[0].comboSkills.find((s) => s.primary)?.name ?? "");
const activePoint = ref(arcanaCombos[0].activePoint);

const currentEffect = computed(() => arcana.value.pointEffects[activeSkill.value] ?? null);

const categoryColor = (cat: ComboEffectRow["category"]): string =>
    cat === "祕法" ? "text-red-400" : cat === "主要才能" ? "text-blue-400" : "text-green-400";

const onArcanaChange = () => {
    const a = arcana.value;
    activeSkill.value = a.comboSkills.find((s) => s.primary)?.name ?? a.comboSkills[0]?.name ?? "";
    activePoint.value = a.activePoint;
};
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-4xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    祕法組合
                </h1>
                <p class="text-base text-gray-400 mt-3">查詢各祕法的組合技與五劍詞條效果</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <!-- 祕法選擇 -->
                <el-select v-model="selectedId" size="large" style="width: 220px" @change="onArcanaChange">
                    <el-option v-for="a in arcanaCombos" :key="a.id" :label="a.name" :value="a.id">
                        <span class="flex items-center gap-2">
                            <img v-if="a.icon" :src="a.icon" alt="" class="h-5 w-5 object-contain" />
                            {{ a.name }}
                        </span>
                    </el-option>
                </el-select>

                <!-- 組合技按鈕 -->
                <div class="mt-4 flex flex-wrap gap-2">
                    <button
                        v-for="skill in arcana.comboSkills"
                        :key="skill.name"
                        class="combo-btn"
                        :class="{
                            'combo-btn--active': !skill.disabled && activeSkill === skill.name,
                            'combo-btn--disabled': skill.disabled,
                        }"
                        :disabled="skill.disabled"
                        @click="!skill.disabled && (activeSkill = skill.name)"
                    >
                        <img v-if="skill.icon" :src="skill.icon" alt="" class="h-6 w-6 object-contain" />
                        {{ skill.name }}
                    </button>
                </div>

                <!-- 五劍詞條格 -->
                <div class="mt-4 flex flex-wrap gap-2">
                    <div
                        v-for="(tile, i) in arcana.wordTiles"
                        :key="i"
                        class="word-tile"
                        :style="{ background: tile.color ?? '#ffffff' }"
                    >
                        {{ tile.label }}
                    </div>
                </div>

                <!-- 示意圖 -->
                <div class="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-if="arcana.basicImage">
                        <p class="text-center font-semibold text-gray-300 mb-1">基本技能使用畫面</p>
                        <img :src="arcana.basicImage" alt="基本技能" class="combo-img" />
                    </div>
                    <div v-if="arcana.comboImage">
                        <p class="text-center font-semibold text-gray-300 mb-1">組合技能使用畫面</p>
                        <img :src="arcana.comboImage" alt="組合技能" class="combo-img" />
                    </div>
                </div>

                <!-- 點數效果按鈕 -->
                <div class="mt-5 flex flex-wrap gap-2">
                    <button
                        v-for="p in arcana.points"
                        :key="p"
                        class="point-btn"
                        :class="{ 'point-btn--active': activePoint === p }"
                        @click="activePoint = p"
                    >
                        {{ p }} 點效果
                    </button>
                </div>

                <!-- 效果說明 -->
                <div class="mt-4 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                    <template v-if="currentEffect">
                        <p class="font-bold text-accent mb-2">{{ currentEffect.title }}</p>
                        <p
                            v-for="(line, i) in currentEffect.lines"
                            :key="i"
                            class="text-sm text-gray-300 leading-relaxed min-h-[0.5rem]"
                        >
                            {{ line }}
                        </p>
                    </template>
                    <p v-else class="text-sm text-gray-500">此組合的效果說明資料待補</p>
                </div>

                <!-- 詞條效果總表 -->
                <h2 class="section-title text-xl font-bold text-accent mt-8 mb-3">
                    {{ arcana.name }} 祕法相關五劍詞條效果
                </h2>
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
                            <div v-if="row.special" class="text-xs text-red-500 font-bold mt-0.5">(特殊五劍專用)</div>
                        </template>
                    </el-table-column>

                    <el-table-column label="選項" min-width="260">
                        <template #default="{ row }">
                            <div class="text-sm text-gray-200">{{ row.option }}</div>
                            <div v-if="row.skillName" class="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                <img
                                    v-if="row.skillIcon"
                                    :src="row.skillIcon"
                                    alt=""
                                    class="h-4 w-4 object-contain"
                                />
                                <span class="underline">{{ row.skillName }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="個別最大倍率" min-width="150" align="right">
                        <template #default="{ row }">
                            <div class="font-semibold text-gray-100">{{ row.base }}</div>
                            <div v-if="row.comboMax" class="text-xs text-gray-400 mt-0.5">
                                組合發動時最大：<span class="text-accent">{{ row.comboMax }}</span>
                            </div>
                            <div v-if="row.noComboMax" class="text-xs text-gray-500">
                                未發動時最大：{{ row.noComboMax }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>

                <p class="mt-3 text-right text-xs text-gray-600">
                    * 可能與正服有出入或有誤，若有錯誤歡迎回報。
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
.combo-btn:hover:not(:disabled) {
    border-color: #6b7280;
}
.combo-btn--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}
.combo-btn--disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.word-tile {
    width: 70px;
    height: 70px;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1f2937;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
}

.combo-img {
    max-width: 100%;
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
