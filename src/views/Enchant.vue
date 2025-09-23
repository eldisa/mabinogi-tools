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
                        魔力賦予 (施工中)
                    </span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">賦予裝備能力。數值要抽，上爛要抽，你的$$還夠嗎</p>
            </header>
            <el-card class="bg-gray-800 border-2 border-yellow-500/50 shadow-inner rounded-xl p-6 sm:p-8">
                <div class="mb-6 border-b border-gray-700 pb-4">
                    <h2 class="text-2xl font-bold text-yellow-300">查詢條件</h2>
                </div>

                <el-form label-width="160px" label-position="left">
                    <el-form-item label="選擇搜尋模式">
                        <el-radio-group v-model="selectedCondition">
                            <el-radio label="依副本搜尋" value="raid" />
                            <el-radio label="依名稱搜尋" value="search" disabled />
                            <el-radio label="依條件搜尋" value="condition" disabled />
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="依副本搜尋" class="text-gray-300" v-if="selectedCondition === 'raid'">
                        <el-select v-model="selectedRaid" placeholder="請選擇副本" style="width: 240px">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="依名稱搜尋" class="text-gray-300" v-if="selectedCondition === 'search'">
                        <el-input v-model="inputText" style="width: 240px" placeholder="請輸入關鍵字" />
                    </el-form-item>
                    <el-form-item label="依條件搜尋" class="text-gray-300" v-if="selectedCondition === 'condition'">
                        <div class="grid grid-cols-4 gap-4">
                            <button
                                v-for="ability of selectableAbility"
                                :key="ability"
                                class="w-[150px] h-8 rounded text-sm transition-colors"
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
                    <el-form-item label="選擇接頭接尾">
                        <el-radio-group v-model="selectedCategory">
                            <el-radio label="全部" value="all" />
                            <el-radio label="接頭" value="prefix" />
                            <el-radio label="接尾" value="suffix" />
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
                        <el-table-column prop="name" label="名稱" width="300" align="center">
                            <template #default="{ row }">
                                <span class="block text-center w-full">
                                    <el-tag v-if="row.type === 'prefix'" type="danger">接頭</el-tag>
                                    <el-tag v-else type="primary">接尾</el-tag>
                                    {{ row.name.tw || row.name.en }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="賦予限制" width="300" align="center">
                            <template #default="{ row }">
                                <span class="block text-center w-full">{{ row.limit.join("、") }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="abilities" label="影響" min-width="150" align="center">
                            <template #default="{ row }">
                                <div v-html="renderAbilities(row.effect)"></div>
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
import { Option } from "../types";
import { Enchant, EnchantAbility, EnchantSource } from "../types/Enchant";
import { enchants, reward } from "../data/enchants";

import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";

const inputText = ref("");
const selectedCondition = ref<string>("raid");
const selectedCategory = ref<string>("all");
const orderBy = ref<string>("");
const selectedRaid = ref<string>("G27/布里萊赫");
const selectedAbility = ref<string[]>([]); // 預設沒有選擇任何能力
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
    "manause_revised_set",
    "lance_piercing",
    "marionette_hp",
    "attack_speed_set",
    "musicbuff_bonus",
    "marionette_attack_min",
    "wound_max",
    "wound_min",
    "synthesis",
    "commerce_discount",
    "commerce_credibility",
    "crystal_making",
    "bomb_expert_set",
    "stomp_defence_set",
    "poison_immune_set",
    "musicbuff_duration",
    "combatPower",
    "dissolution",
    "stamania_revised",
    "frozen_blast_duraion",
    "frozen_blast_degree",
    "fire_alchemy_damage",
    "earth_alchemy_damage",
    "water_alchemy_damage",
    "wind_alchemy_damage",
    "alchemist_product_success_rate",
    "product_quality_bonus",
    "magiclightning",
    "magicice",
    "magicfire",
    "casting_speed",
    "healing_skill",
    "move_speed",
    "timewarp_count",
    "shockcancellation_def",
    "shockcancellation_magicdefence",
    "barrier_life",
];

const displayData = computed(() => {
    // Step 1: Find the reward item for the selected category

    const condition = selectedCondition.value;
    const input = inputText.value;
    const selectedAbilities = selectedAbility.value;
    // const sortKey = orderBy.value;
    const category = selectedCategory.value; // 新增：追蹤分類

    // 將所有依賴變數放在函式開頭，確保 Vue 追蹤
    const sortKey = orderBy.value;

    let filteredResult: Enchant[] = [];

    // 1. 執行所有過濾邏輯 (Filter Logic)
    // 優先執行名稱或能力篩選
    if (condition === "raid") {
        const foundReward: EnchantSource | undefined = reward.find((r) => r.raidName === selectedRaid.value);
        const list = foundReward ? foundReward.list : [];
        filteredResult = enchants.filter((item) => list.includes(item.id));
        // } else if (condition === "search" && input !== "") {
        //     filteredResult = enchants.filter((item) => item.name.tw.includes(input));
        // } else if (condition === "condition" && selectedAbilities.length > 0) {
        //     filteredResult = enchants.filter((item) => {
        //         const itemAbilities = item.effect.map((ability) => ability.id);
        //         return selectedAbilities.every((ability) => itemAbilities.includes(ability));
        //     });
    } else {
        // filteredResult = enchants;
    }

    // 在完成名稱/能力篩選後，再執行分類過濾
    if (category !== "all") {
        // 只在不是「all」類別時進行過濾
        filteredResult = filteredResult.filter((item) => item.type === category);
    }

    // 2. 執行排序邏輯 (Sorting Logic)
    // if (sortKey) {
    //     const sortedResult = [...filteredResult].sort((a, b) => {
    //         const aAbility = a.effect.find((ability) => ability.id === sortKey);
    //         const bAbility = b.effect.find((ability) => ability.id === sortKey);
    //         const aValue = aAbility ? aAbility.max : 0;
    //         const bValue = bAbility ? bAbility.max : 0;
    //         return bValue - aValue; // 降序排列
    //     });
    //     return sortedResult;
    // }

    // 如果沒有排序，返回最終過濾後的結果
    return filteredResult;
});

const options: { label: string; value: string }[] = [
    { label: "G27/布里萊赫", value: "G27/布里萊赫" },
    { label: "雪VH/格倫貝爾納-太古之冬", value: "雪VH/格倫貝爾納-太古之冬" },
];

const clickAbility = (ability: string) => {
    if (selectedAbility.value.includes(ability)) {
        selectedAbility.value = selectedAbility.value.filter((a) => a !== ability);
    } else {
        selectedAbility.value.push(ability);
    }
};

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};

const renderType = (type: string): string => {
    switch (type) {
        case "prefix":
            return "接頭";
        case "suffix":
            return "接尾";
        default:
            return type;
    }
};

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
