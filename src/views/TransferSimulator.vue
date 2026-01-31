<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
        <div class="max-w-5xl mx-auto space-y-8">
            <header class="text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold mb-2 tracking-wide font-serif drop-shadow-lg">
                    <span class="inline-block relative text-gradient">
                        <svg
                            class="w-8 h-8 sm:w-10 sm:h-10 text-accent absolute -left-12 top-1/2 -translate-y-1/2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1z"
                            />
                        </svg>
                        裝備能力轉移
                    </span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">模擬轉移費用，為你的冒險旅程做足準備。</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                <div class="mb-6 border-b border-gray-700 pb-4">
                    <h2 class="text-2xl font-bold text-accent">填寫資料</h2>
                    <p class="text-gray-400 text-sm mt-1">設定你想要繼承的屬性與條件。</p>
                </div>

                <el-form :model="form" label-width="160px" label-position="left">
                    <el-form-item label="選擇要被繼承的項目" class="text-gray-300">
                        <el-select v-model="selectedCategory" placeholder="請選擇" class="w-full sm:w-[280px]">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                        <el-form-item label="是否有 SR" class="flex-grow text-gray-300">
                            <el-switch v-model="form.hasSR" />
                        </el-form-item>
                        <el-form-item label="是否有祝福/聖火/聖水" class="flex-grow text-gray-300">
                            <el-switch v-model="form.hasBlessing" />
                        </el-form-item>
                        <el-form-item label="是否有賦予" class="flex-grow text-gray-300">
                            <el-switch v-model="form.hasEnhancement" />
                        </el-form-item>
                        <el-form-item label="是否有細工" class="flex-grow text-gray-300">
                            <el-switch v-model="form.hasReforge" />
                        </el-form-item>
                    </div>
                </el-form>

                <div v-if="form.hasReforge" class="mt-8">
                    <h3 class="text-lg font-semibold text-accent mb-4">細工等級設定</h3>
                    <el-table
                        :data="form.reforgeAbilityArray"
                        border
                        class="rounded-lg overflow-hidden"
                        :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                        :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                    >
                        <el-table-column label="項目" width="80">
                            <template #default="{ $index }">
                                <span class="font-medium text-gray-300">{{ $index + 1 }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="currentLevel" label="當前等級">
                            <template #default="{ row }">
                                <el-input-number v-model="row.currentLevel" :min="0" class="w-full" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="maxLevel" label="最大等級">
                            <template #default="{ row }">
                                <el-input-number v-model="row.maxLevel" :min="0" class="w-full" />
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="mt-8 pt-6 border-t border-gray-700">
                    <div class="flex flex-col sm:flex-row items-center justify-between">
                        <span class="text-xl font-bold text-gray-300 mb-2 sm:mb-0">
                            <svg class="inline-block w-6 h-6 mr-2 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    d="M5 2a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2H5zM8 4h4a1 1 0 011 1v1a1 1 0 01-1 1H8a1 1 0 01-1-1V5a1 1 0 011-1zM5 9h10v2H5V9zM5 13h10v2H5v-2z"
                                />
                            </svg>
                            總費用估計：
                        </span>
                        <span class="text-3xl sm:text-4xl font-extrabold text-red-400 drop-shadow-md">
                            {{ evaluateCost.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style>
/* 保持 Element UI 預設樣式覆蓋，並調整輸入框的文字顏色 */
.el-form-item {
    margin-bottom: 1rem;
}
.el-input-number {
    width: 100%;
}
.el-table .el-input-number {
    width: 100%;
}
.el-table .el-input-number .el-input__inner {
    text-align: center;
    /* 調整輸入框內文字顏色以適應深色背景 */
    color: #e2e8f0;
    background-color: #4a5568; /* 稍微深一點的背景色 */
    border-color: #6b7280;
}

/* 針對 el-select 的調整 */
.el-select .el-input__inner {
    color: #e2e8f0;
    background-color: #4a5568;
    border-color: #6b7280;
}
.el-select-dropdown {
    background-color: #2d3748; /* 選項下拉選單的背景色 */
    border-color: #6b7280;
}
.el-select-dropdown__item {
    color: #e2e8f0;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item.selected {
    background-color: #4a5568;
    color: #fbd38d; /* 選中或hover的顏色 */
}

/* 針對 el-switch 的調整 */
/* 調整 Switch 的軌道顏色 (關閉時) */
.el-switch__core {
    background-color: #4a5568 !important; /* 灰藍色 */
    border-color: #6b7280 !important;
}
/* 調整 Switch 的軌道顏色 (開啟時) */
.el-switch.is-checked .el-switch__core {
    background-color: #fbd38d !important; /* 金黃色 */
    border-color: #fbd38d !important;
}
/* 調整 Switch 的滑塊顏色 */
.el-switch__core:after {
    background-color: #e2e8f0 !important; /* 淺色滑塊 */
}

/* 調整表格內部 InputNumber 的顏色 */
.el-table .el-input-number__increase,
.el-table .el-input-number__decrease {
    background-color: #6b7280;
    color: #e2e8f0;
    border-color: #6b7280;
}
.el-table .el-input-number__increase:hover,
.el-table .el-input-number__decrease:hover {
    background-color: #718096;
}

.el-input__wrapper {
    padding: 1px 30px !important;
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Option } from "../types";

interface Cost {
    level: number;
    reforgeBasicCost: number;
    reforgeBreakCost: number;
    otherCost: number;
}

interface Reforge {
    currentLevel: number;
    maxLevel: number;
}

const basicCostUnit = 10000; // 基礎費用單位

//level: 1: 凱爾特 2: 兇猛/章魚 3: 貓武 4: 靈魂/日月
const costArray: Cost[] = [
    {
        level: 1,
        reforgeBasicCost: 0.3,
        reforgeBreakCost: 25,
        otherCost: 1,
    },
    {
        level: 2,
        reforgeBasicCost: 1.2,
        reforgeBreakCost: 100,
        otherCost: 2,
    },
    {
        level: 3,
        reforgeBasicCost: 24,
        reforgeBreakCost: 2000,
        otherCost: 20,
    },
    {
        level: 4,
        reforgeBasicCost: 240,
        reforgeBreakCost: 20000,
        otherCost: 200,
    },
];

const form = ref({
    hasSR: true, // 是否有SR
    hasBlessing: true, // 是否有祝福/聖火/聖水
    hasEnhancement: true, // 是否有賦予
    // hasErg: true, // 是否有ERG
    hasReforge: true, // 是否有細工
    reforgeAbilityArray: [
        { currentLevel: 0, maxLevel: 20 },
        { currentLevel: 0, maxLevel: 20 },
        { currentLevel: 0, maxLevel: 20 },
    ] as Reforge[], // 細工能力數組
});

const selectedCategory = ref(3); // 預設選擇貓武

const options: Option[] = [
    { label: "凱爾特", value: 1 },
    { label: "兇猛/章魚", value: 2 },
    { label: "貓武", value: 3 },
    { label: "靈魂/日月", value: 4 },
];

const evaluateCost = computed(() => {
    const { hasSR, hasBlessing, hasEnhancement, hasReforge, reforgeAbilityArray } = form.value;

    let totalCost = 0;

    const targetCost = costArray.find((cost) => cost.level === selectedCategory.value) || costArray[0];

    const { reforgeBasicCost, reforgeBreakCost, otherCost } = targetCost;

    totalCost += (Number(hasSR) + Number(hasBlessing) + Number(hasEnhancement)) * otherCost;

    if (hasReforge) {
        reforgeAbilityArray.forEach((ability) => {
            const { currentLevel, maxLevel } = ability;
            if (currentLevel > maxLevel) {
                const breaks = currentLevel - maxLevel;
                totalCost += reforgeBreakCost * breaks + reforgeBasicCost * maxLevel;
            } else {
                totalCost += reforgeBasicCost * currentLevel;
            }
        });
    }

    return roundTo(totalCost * basicCostUnit);
});

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};
</script>
