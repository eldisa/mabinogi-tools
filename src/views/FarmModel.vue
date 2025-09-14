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
                        農場模型
                    </span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">設置以增加能力。坑錢的東西</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-yellow-500/50 shadow-inner rounded-xl p-6 sm:p-8">
                <div class="mb-6 border-b border-gray-700 pb-4">
                    <h2 class="text-2xl font-bold text-yellow-300">查詢條件</h2>
                </div>

                <el-form label-width="160px" label-position="left">
                    <el-form-item label="選擇搜尋模式">
                        <el-radio-group v-model="selectedCondition">
                            <el-radio label="依名稱搜尋" value="search" />
                            <el-radio label="依條件搜尋" value="condition" />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="選擇排序條件">
                        <el-select v-model="orderBy" filterable placeholder="請選擇排序條件" style="width: 240px">
                            <el-option
                                v-for="item in abilityOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="依名稱搜尋" class="text-gray-300" v-if="selectedCondition === 'search'">
                        <el-input v-model="inputText" style="width: 240px" placeholder="請輸入關鍵字" />
                    </el-form-item>
                    <el-form-item label="依條件搜尋" class="text-gray-300" v-if="selectedCondition === 'condition'">
                        <div class="grid grid-cols-5 gap-4">
                            <button
                                v-for="ability of selectableAbility"
                                :key="ability"
                                class="w-[120px] h-8 rounded text-sm transition-colors"
                                :class="{
                                    'bg-yellow-500 text-gray-800': selectedAbility.includes(ability),
                                    'bg-gray-700 hover:bg-yellow-500/80': !selectedAbility.includes(ability),
                                }"
                                @click="clickAbility(ability)"
                                type="button"
                            >
                                {{ abilitiesMap[ability] || ability }}
                            </button>
                        </div>
                    </el-form-item>
                    <el-form-item label="選擇分類">
                        <el-radio-group v-model="selectedCategory">
                            <el-radio label="全部" value="all" />
                            <el-radio label="一般" value="normal" />
                            <el-radio label="額外" value="extra" />
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card class="bg-gray-800 border-2 border-yellow-500/50 shadow-inner rounded-xl p-6 sm:p-8">
                <div class="mb-6 border-b border-gray-700 pb-4">
                    <h2 class="text-2xl font-bold text-yellow-300">搜尋結果</h2>
                </div>
                <div>
                    <el-table
                        :data="displayData"
                        border
                        class="rounded-lg overflow-hidden"
                        :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                        :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                    >
                        <el-table-column prop="category" label="分類" width="70">
                            <template #default="{ row }">
                                <span>{{ row.category === "extra" ? "額外" : "一般" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名稱">
                            <template #default="{ row }">
                                <div class="flex items-center space-x-4">
                                    <img
                                        :src="`https://mabires.pril.cc/privatefarmfacilityimage/tw/${row.id}/${row.id}.png`"
                                        :alt="row.name.tw"
                                        class="w-12 h-12 object-contain"
                                    />
                                    <span>{{ row.name.tw }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="abilities" label="能力">
                            <template #default="{ row }">
                                <div class="space-y-2">
                                    {{ parseAbilities(row.abilities) }}
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style>
button {
    padding: 8px 15px;
    border-radius: 4px;
    border: 1px solid #ccc;
    cursor: pointer;
}
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
import { ref, computed } from "vue";
import { farmModel } from "../data/farmModel";
import { FarmModel } from "../types/FarmModel";
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";

const selectedCondition = ref<string>("search");
const selectedCategory = ref<string>("all");

const orderBy = ref<string>("");

const inputText = ref("");

const selectedAbility = ref<string[]>([]); // 預設沒有選擇任何能力

const selectableAbility = [
    "attack_max",
    "critical_damage",
    "magic_attack",
    "musicbuff_bonus",
    "bonus_damage",
    "move_speed",
    "critical_cap_increase",
    "STR",
    "INT",
    "DEX",
    "WIL",
    "LUK",
    "HP",
    "MP",
    "SP",
    "defense",
    "protection",
    "magic_protection",
    "magic_defense",
];

const abilityOptions = computed(() => {
    if (selectedAbility.value.length > 0) {
        return selectedAbility.value.map((ability) => ({
            label: abilitiesMap[ability] || ability,
            value: ability,
        }));
    }
    return selectableAbility.map((ability) => ({
        label: abilitiesMap[ability] || ability,
        value: ability,
    }));
});

const displayData = computed(() => {
    // 將所有依賴變數放在函式開頭，確保 Vue 追蹤
    const condition = selectedCondition.value;
    const input = inputText.value;
    const selectedAbilities = selectedAbility.value;
    const sortKey = orderBy.value;

    let result = [];

    // 1. 過濾邏輯
    if (condition === "search" && input !== "") {
        result = farmModel.filter((item) => item.name.tw.includes(input));
    } else if (condition === "condition" && selectedAbilities.length > 0) {
        result = farmModel.filter((item) => {
            const itemAbilities = item.abilities.map((ability) => ability.id);
            return selectedAbilities.every((ability) => itemAbilities.includes(ability));
        });
    } else {
        result = farmModel;
    }

    // 2. 排序邏輯
    if (sortKey) {
        // 複製一份陣列再排序，避免改變原始數據
        const sortedResult = [...result].sort((a, b) => {
            const aAbility = a.abilities.find((ability) => ability.id === sortKey);
            const bAbility = b.abilities.find((ability) => ability.id === sortKey);
            const aValue = aAbility ? aAbility.value : 0;
            const bValue = bAbility ? bAbility.value : 0;
            return bValue - aValue; // 降序排列
        });
        return sortedResult;
    }

    // 如果沒有排序，返回過濾後的結果
    return result.filter((item) => {
        if (selectedCategory.value === "normal") {
            return item.category === "normal";
        } else if (selectedCategory.value === "extra") {
            return item.category === "extra";
        }
        return true; // "all" 類別，返回所有項目
    });
});

const parseAbilities = (abilities: { id: string; value: number }[]) => {
    const str = abilities
        .map(
            (abilitiy) =>
                `${abilitiesMap[abilitiy.id] || abilitiy.id}: +${abilitiy.value} ${
                    abilitiesValueWithPercentArray.includes(abilitiy.id) ? "%" : ""
                }`
        )
        .join(", ");
    return str;
};

const clickAbility = (ability: string) => {
    if (selectedAbility.value.includes(ability)) {
        selectedAbility.value = selectedAbility.value.filter((a) => a !== ability);
    } else {
        selectedAbility.value.push(ability);
    }
};
</script>
