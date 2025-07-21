<template>
    <div class="craft-calculator min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto">
            <header class="mb-6 text-center">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">裝備能力轉移費用估算</h1>
                <p class="text-gray-600 mt-2">計算轉移的費用</p>
            </header>
            <div>
                <!-- 資料輸入區 -->

                <div class="mb-4">
                    <el-card class="mb-4 bg-gradient-to-r from-blue-100 to-white shadow-sm rounded-md">
                        <CardHeader title="填寫資料" subtitle="設定你想要模擬的目標與條件" />

                        <el-form :model="form" label-width="200px" class="mx-auto">
                            <el-form-item label="選擇要被繼承的項目">
                                <el-select v-model="selectedCategory" placeholder="" class="w-[200px] mb-4">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label="是否有 SR">
                                <el-switch v-model="form.hasSR" />
                            </el-form-item>
                            <el-form-item label="是否有祝福/聖火/聖水">
                                <el-switch v-model="form.hasBlessing" />
                            </el-form-item>
                            <el-form-item label="是否有賦予">
                                <el-switch v-model="form.hasEnhancement" />
                            </el-form-item>
                            <el-form-item label="是否有細工">
                                <el-switch v-model="form.hasReforge" />
                            </el-form-item>
                            <el-table :data="form.reforgeAbilityArray" style="width: 480px" border class="mb-4">
                                <el-table-column label="項目" width="80">
                                    <template #default="{ $index }">
                                        {{ $index + 1 }}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="currentLevel" label="當前等級" width="200">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.currentLevel" :min="0" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="maxLevel" label="最大等級" width="200">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.maxLevel" :min="0" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form>
                        <div class="text-center font-bold text-lg text-blue-700">
                            轉移費用總計：{{ evaluateCost.toLocaleString() }}
                        </div>
                    </el-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CardHeader from "../components/CardHeader.vue";
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
    targetCategory: 3, // 1: 凱爾特 2: 兇猛/章魚 3: 貓武 4: 靈魂/日月
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
    const { targetCategory, hasSR, hasBlessing, hasEnhancement, hasReforge, reforgeAbilityArray } = form.value;

    let totalCost = 0;

    const targetCost = costArray.find((cost) => cost.level === targetCategory) || costArray[0];

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

// watch(
//     () => form.value,
//     (newForm) => {
//         const { targetCategory, hasSR, hasBlessing, hasEnhancement, hasReforge, reforgeAbilityArray } = newForm;

//         let totalCost = 0;

//         const targetCost = costArray.find((cost) => cost.level === targetCategory) || costArray[0];

//         const { reforgeBasicCost, reforgeBreakCost, otherCost } = targetCost;

//         totalCost += (Number(hasSR) + Number(hasBlessing) + Number(hasEnhancement)) * otherCost;

//         if (hasReforge) {
//             reforgeAbilityArray.forEach((ability) => {
//                 // todo: 有些項目 max 為5, 可能要另外寫 case 處理
//                 const { currentLevel, maxLevel } = ability;
//                 if (currentLevel > maxLevel) {
//                     const breaks = currentLevel - maxLevel;
//                     totalCost += reforgeBreakCost * breaks + reforgeBasicCost * maxLevel;
//                 } else {
//                     totalCost += reforgeBasicCost * currentLevel;
//                 }

//                 //totalCost += reforgeBasicCost + reforgeBreakCost * currentLevel;
//             });
//         }

//         result.value = totalCost * basicCostUnit;
//     },
//     { deep: true }
// );

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};
</script>

<style scoped>
.el-input-number .el-input__inner {
    text-align: center;
}

.el-form-item {
    margin-bottom: 12px;
}

.el-table {
    margin-bottom: 12px;
}
</style>
