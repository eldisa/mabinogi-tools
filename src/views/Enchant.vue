<template>
    <div
        class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8"
        style="background-image: url('https://www.transparenttextures.com/patterns/dark-mosaic.png')"
    >
        <div class="max-w-5xl mx-auto space-y-8">
            <header class="text-center relative pt-8">
                <h1
                    class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-2 tracking-wide font-serif drop-shadow-lg"
                >
                    <span class="inline-block relative text-white">
                        <svg
                            class="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 absolute -left-12 top-1/2 -translate-y-1/2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1z"
                            />
                        </svg>
                        賦予(施工中)
                    </span>
                </h1>
            </header>

            <el-table
                :data="rowData"
                border
                class="rounded-lg overflow-hidden"
                :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
            >
                <el-table-column prop="name" label="名稱" width="300" align="center">
                    <template #default="{ row }">
                        <span class="block text-center w-full">
                            [{{ row.type === "prefix" ? "接頭" : "接尾" }}] {{ row.name.tw || row.name.en }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="賦予限制" width="300" align="center">
                    <template #default="{ row }">
                        <span class="block text-center w-full">{{ row.position }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="abilities" label="影響" min-width="150" align="center">
                    <template #default="{ row }">
                        <div v-html="renderAbilities(row.effect)"></div>
                    </template>
                </el-table-column>
            </el-table>
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

.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: black !important;
}
</style>

<script setup lang="ts">
import { ref } from "vue";
import { Enchant, EnchantAbility } from "../types/Enchant";
import { enchants } from "../data/enchants";

import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";

const rowData = ref<Enchant[]>(enchants);

const renderAbilities = (abilityIdArray: EnchantAbility[]): string => {
    const format = (num: number): string => {
        const color = num < 0 ? "red" : "#60a5fa"; // tailwind 的 blue-400
        const sign = num >= 0 ? "+" : "";
        return `<span style="color:${color}">${sign}${num}</span>`;
    };

    return abilityIdArray
        .map((ability) => {
            const { id, min, max } = ability;
            const abilityName = abilitiesMap[id] || id;
            const suffix = abilitiesValueWithPercentArray.includes(id) ? "%" : "";

            if (min !== max) {
                return `${abilityName}: ${format(ability.min)} ~ ${format(ability.max)} ${suffix}`;
            } else {
                const value = min;
                return `${abilityName}: ${format(value)} ${suffix}`;
            }
        })
        .join("<br>");
};
</script>
