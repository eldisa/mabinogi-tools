<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
        <div class="max-w-6xl mx-auto space-y-8">
            <header class="text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    <span class="inline-block relative">
                        <svg
                            class="w-8 h-8 sm:w-10 sm:h-10 text-accent absolute -left-12 top-1/2 -translate-y-1/2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1z"
                            />
                        </svg>
                        魔力賦予
                    </span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">賦予裝備能力。數值要抽，上爛要抽，你的$$還夠嗎</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                <div class="mb-6 border-b border-gray-700 pb-4">
                    <h2 class="text-2xl font-bold text-accent">查詢條件</h2>
                </div>

                <el-form label-width="140px" label-position="left">
                    <el-form-item label="搜尋模式">
                        <el-radio-group v-model="selectedCondition">
                            <el-radio label="依名稱搜尋" value="search" />
                            <el-radio label="依能力搜尋" value="ability" />
                            <el-radio label="依副本搜尋" value="raid" />
                        </el-radio-group>
                    </el-form-item>

                    <!-- 依名稱搜尋 -->
                    <el-form-item label="賦予名稱" v-if="selectedCondition === 'search'">
                        <el-input
                            v-model="searchName"
                            placeholder="請輸入賦予名稱關鍵字"
                            clearable
                            style="width: 300px"
                        />
                    </el-form-item>

                    <!-- 依能力搜尋 -->
                    <template v-if="selectedCondition === 'ability'">
                        <el-form-item label="選擇能力">
                            <el-select
                                v-model="searchAbility"
                                placeholder="請選擇能力"
                                clearable
                                filterable
                                style="width: 240px"
                            >
                                <el-option
                                    v-for="ability in selectableAbility"
                                    :key="ability"
                                    :label="abilitiesMap[ability] || ability"
                                    :value="ability"
                                />
                            </el-select>
                        </el-form-item>

                        <el-form-item label="數值條件" v-if="searchAbility">
                            <div class="flex gap-2 items-center">
                                <el-select v-model="searchValueOperator" style="width: 120px">
                                    <el-option label="大於等於" value="gte" />
                                    <el-option label="小於等於" value="lte" />
                                    <el-option label="等於" value="eq" />
                                </el-select>
                                <el-input-number
                                    v-model="searchValue"
                                    :min="-999"
                                    :max="999"
                                    style="width: 150px"
                                />
                            </div>
                        </el-form-item>
                    </template>

                    <!-- 依副本搜尋 -->
                    <el-form-item label="選擇副本" v-if="selectedCondition === 'raid'">
                        <el-select v-model="selectedRaid" placeholder="請選擇副本" style="width: 300px">
                            <el-option
                                v-for="item in raidOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>

                    <!-- 共用篩選條件 -->
                    <el-divider class="!my-6">
                        <span class="text-gray-400">進階篩選</span>
                    </el-divider>

                    <el-form-item label="接頭/接尾">
                        <el-radio-group v-model="selectedCategory">
                            <el-radio label="全部" value="all" />
                            <el-radio label="接頭" value="prefix" />
                            <el-radio label="接尾" value="suffix" />
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="賦予等級">
                        <div class="flex gap-2 items-center">
                            <el-select v-model="searchRankOperator" style="width: 120px">
                                <el-option label="全部" value="" />
                                <el-option label="等於" value="eq" />
                                <el-option label="大於等於" value="gte" />
                                <el-option label="小於等於" value="lte" />
                            </el-select>
                            <el-input-number
                                v-model="searchRank"
                                :min="1"
                                :max="20"
                                :disabled="!searchRankOperator"
                                style="width: 150px"
                            />
                        </div>
                    </el-form-item>

                    <el-form-item label="裝備類型">
                        <el-select
                            v-model="searchLimit"
                            placeholder="全部"
                            clearable
                            filterable
                            style="width: 240px"
                        >
                            <el-option
                                v-for="limitType in limitTypes"
                                :key="limitType"
                                :label="limitType"
                                :value="limitType"
                            />
                        </el-select>
                    </el-form-item>

                    <el-form-item>
                        <div class="flex gap-3">
                            <el-button type="primary" @click="handleSearch">
                                <el-icon class="mr-1"><Search /></el-icon>
                                搜尋
                            </el-button>
                            <el-button @click="handleReset">
                                <el-icon class="mr-1"><RefreshLeft /></el-icon>
                                重置
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-card>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                <div class="mb-6 border-b border-gray-700 pb-4 flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-accent">搜尋結果</h2>
                    <span class="text-gray-400">
                        找到 <span class="text-accent font-bold">{{ displayData.length }}</span> 個賦予
                    </span>
                </div>
                <div>
                    <el-empty
                        v-if="displayData.length === 0"
                        description="沒有符合條件的賦予"
                        :image-size="150"
                    />
                    <el-table
                        v-else
                        :data="displayData"
                        border
                        class="rounded-lg overflow-hidden"
                        :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                        :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                        max-height="600"
                    >
                        <el-table-column prop="name" label="名稱" width="280" align="center">
                            <template #default="{ row }">
                                <div class="flex flex-col items-center gap-1">
                                    <div>
                                        <el-tag v-if="row.type === 'prefix'" type="danger" size="small">接頭</el-tag>
                                        <el-tag v-else type="primary" size="small">接尾</el-tag>
                                    </div>
                                    <span class="font-medium">{{ row.name.tw || row.name.en }}</span>
                                    <span class="text-xs text-gray-400">Rank {{ row.level }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="limit" label="賦予限制" width="200" align="center">
                            <template #default="{ row }">
                                <div class="flex flex-wrap gap-1 justify-center">
                                    <el-tag
                                        v-for="(limit, idx) in row.limit"
                                        :key="idx"
                                        type="info"
                                        size="small"
                                    >
                                        {{ limit }}
                                    </el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="abilities" label="能力效果" min-width="300" align="center">
                            <template #default="{ row }">
                                <div v-html="renderAbilities(row.effect)" class="text-left"></div>
                            </template>
                        </el-table-column>
                    </el-table>
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
    color: #e2e8f0;
    background-color: #4a5568;
    border-color: #6b7280;
}

/* 針對 el-select 的調整 */
.el-select .el-input__inner {
    color: #e2e8f0;
    background-color: #4a5568;
    border-color: #6b7280;
}
.el-select-dropdown {
    background-color: #2d3748;
    border-color: #6b7280;
}
.el-select-dropdown__item {
    color: #e2e8f0;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item.selected {
    background-color: #4a5568;
    color: #fbd38d;
}

/* 針對 el-switch 的調整 */
.el-switch__core {
    background-color: #4a5568 !important;
    border-color: #6b7280 !important;
}
.el-switch.is-checked .el-switch__core {
    background-color: #fbd38d !important;
    border-color: #fbd38d !important;
}
.el-switch__core:after {
    background-color: #e2e8f0 !important;
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

.bg-gray-800 .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: #1f2937 !important;
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, RefreshLeft } from '@element-plus/icons-vue';
import { Enchant, EnchantAbility, EnchantSource } from "../types/Enchant";
import { enchants, reward } from "../data/enchants";
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";

// 搜尋條件
const selectedCondition = ref<string>("search");
const searchName = ref("");
const searchAbility = ref("");
const searchValue = ref<number | null>(null);
const searchValueOperator = ref("gte");
const selectedCategory = ref<string>("all");
const selectedRaid = ref<string>("G27/布里萊赫");
const searchRank = ref<number | null>(null);
const searchRankOperator = ref("");
const searchLimit = ref("");

// 可選擇的能力列表
const selectableAbility = [
    "attack_max",
    "attack_min",
    "balance",
    "critical",
    "magic_attack",
    "all_alchemy_damage",
    "HP",
    "MP",
    "SP",
    "STR",
    "INT",
    "DEX",
    "WIL",
    "LUK",
    "defense",
    "protection",
    "magic_defense",
    "magic_protection",
    "marionette_defense",
    "marionette_protect",
    "marionette_attack_max",
    "marionette_critical",
    "marionette_magic_defense",
    "wound_max",
    "wound_min",
    "musicbuff_bonus",
    "move_speed",
    "critical_damage",
];

// 副本選項
const raidOptions: { label: string; value: string }[] = [
    { label: "G27/布里萊赫", value: "G27/布里萊赫" },
    { label: "雪VH/格倫貝爾納-太古之冬", value: "雪VH/格倫貝爾納-太古之冬" },
];

// 裝備類型列表（從資料中自動提取）
const limitTypes = computed(() => {
    const types = new Set<string>();
    enchants.forEach(enchant => {
        enchant.limit.forEach(limit => types.add(limit));
    });
    return Array.from(types).sort();
});

// 搜尋結果
const displayData = computed(() => {
    const condition = selectedCondition.value;
    const name = searchName.value.trim();
    const ability = searchAbility.value;
    const value = searchValue.value;
    const valueOp = searchValueOperator.value;
    const category = selectedCategory.value;
    const raid = selectedRaid.value;
    const rank = searchRank.value;
    const rankOp = searchRankOperator.value;
    const limit = searchLimit.value;

    let filteredResult: Enchant[] = [];

    // 1. 主要搜尋邏輯
    if (condition === "search" && name) {
        // 依名稱搜尋（模糊搜尋）
        filteredResult = enchants.filter(item =>
            (item.name.tw && item.name.tw.includes(name)) ||
            (item.name.en && item.name.en.toLowerCase().includes(name.toLowerCase()))
        );
    } else if (condition === "ability" && ability) {
        // 依能力搜尋
        filteredResult = enchants.filter(item => {
            const abilityEffect = item.effect.find(e => e.id === ability);
            if (!abilityEffect) return false;

            // 如果有設定數值條件
            if (value !== null) {
                switch(valueOp) {
                    case 'gte':
                        return abilityEffect.max >= value;
                    case 'lte':
                        return abilityEffect.min <= value;
                    case 'eq':
                        return abilityEffect.min <= value && value <= abilityEffect.max;
                    default:
                        return true;
                }
            }
            return true;
        });
    } else if (condition === "raid") {
        // 依副本搜尋
        const foundReward = reward.find(r => r.raidName === raid);
        const list = foundReward ? foundReward.list : [];
        filteredResult = enchants.filter(item => list.includes(item.id));
    } else {
        // 沒有主要搜尋條件，顯示全部
        filteredResult = enchants;
    }

    // 2. 套用進階篩選條件

    // 接頭/接尾篩選
    if (category !== "all") {
        filteredResult = filteredResult.filter(item => item.type === category);
    }

    // 等級篩選
    if (rankOp && rank !== null) {
        filteredResult = filteredResult.filter(item => {
            switch(rankOp) {
                case 'eq':
                    return item.level === rank;
                case 'gte':
                    return item.level >= rank;
                case 'lte':
                    return item.level <= rank;
                default:
                    return true;
            }
        });
    }

    // 裝備類型篩選
    if (limit) {
        filteredResult = filteredResult.filter(item =>
            item.limit.includes(limit)
        );
    }

    return filteredResult;
});

// 搜尋按鈕
const handleSearch = () => {
    // 觸發重新計算（computed 會自動執行）
    // 可以在這裡添加搜尋統計或其他邏輯
};

// 重置按鈕
const handleReset = () => {
    searchName.value = "";
    searchAbility.value = "";
    searchValue.value = null;
    searchValueOperator.value = "gte";
    selectedCategory.value = "all";
    selectedRaid.value = "G27/布里萊赫";
    searchRank.value = null;
    searchRankOperator.value = "";
    searchLimit.value = "";
    selectedCondition.value = "search";
};

// 渲染能力效果
const renderAbilities = (abilityIdArray: EnchantAbility[]): string => {
    const format = (num: number): string => {
        const color = num < 0 ? "#ef4444" : "#60a5fa"; // red-500 : blue-400
        const sign = num >= 0 ? "+" : "";
        return `<span style="color:${color}; font-weight: 600;">${sign}${num}</span>`;
    };

    return abilityIdArray
        .map((ability) => {
            const { id, min, max } = ability;
            const abilityName = abilitiesMap[id] || id;
            const suffix = abilitiesValueWithPercentArray.includes(id) ? "%" : "";

            if (min !== max) {
                return `<div style="margin: 2px 0;">${abilityName}: ${format(min)} ~ ${format(max)}${suffix}</div>`;
            } else {
                return `<div style="margin: 2px 0;">${abilityName}: ${format(min)}${suffix}</div>`;
            }
        })
        .join("");
};
</script>
