<template>
    <div class="craft-calculator min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto">
            <header class="mb-6 text-center">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">製作成本計算模擬器</h1>
                <p class="text-gray-600 mt-2">輕鬆計算各種裝備的完成度和成本預估</p>
            </header>
            <el-drawer v-model="drawer" title="輸入與參數設定">
                <div class="p-4 bg-gray-50 rounded-lg shadow">
                    <el-form :model="form" :label-position="'left'" label-width="auto" class="max-w-[600px]">
                        <!-- 參數調整區 -->
                        <div class="mb-4">
                            <h3 class="text-md font-medium mb-2">參數調整</h3>
                            <el-form-item label="是否顯示模擬的詳細結果">
                                <el-switch v-model="form.showResultDetails" size="small" />
                            </el-form-item>
                            <el-form-item label="模擬次數">
                                <el-input-number
                                    controls-position="right"
                                    v-model="form.simulateTimes"
                                    :min="1"
                                    :max="10000"
                                    :step="100"
                                />
                            </el-form-item>
                            <el-form-item label="是否顯示成本估算">
                                <el-switch v-model="form.showCost" size="small" />
                            </el-form-item>
                            <el-form-item label="金錢單位">
                                <el-switch
                                    v-model="form.isBillionUnit"
                                    class="mb-2"
                                    active-text="億"
                                    inactive-text="萬"
                                />
                            </el-form-item>
                            <el-form-item label="是否換算成台幣">
                                <el-switch v-model="form.showExchangeRate" size="small" />
                            </el-form-item>
                            <el-form-item label="匯率">
                                <el-input-number
                                    controls-position="right"
                                    v-model="form.exchangeRate"
                                    :min="1"
                                    :step="0.1"
                                    :disabled="!form.showExchangeRate"
                                >
                                    <template #prefix>1:</template>
                                    <template #suffix>萬</template>
                                </el-input-number>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </el-drawer>
            <div>
                <!-- 資料輸入區 -->

                <div class="mb-4">
                    <el-card class="mb-4 bg-gradient-to-r from-blue-100 to-white shadow-sm rounded-md">
                        <CardHeader title="製作項目資料" subtitle="設定你想要模擬的目標與條件" />
                        <div class="bg-white rounded-md shadow-sm p-4 mt-4 w-fit mx-auto border border-gray-200">
                            <el-table
                                :data="[
                                    {
                                        name: form.itemName,
                                        progress: form.baseProgressPerCraft,
                                        cost: form.costPerCraft,
                                    },
                                ]"
                                style="min-width: 900px; --el-table-border-color: #dcdfe6"
                                highlight-current-row
                            >
                                <el-table-column align="center" label="目標">
                                    <template #default>
                                        <div class="flex items-center gap-2">
                                            <el-icon>
                                                <Edit />
                                            </el-icon>
                                            <el-select v-model="form.itemName" @change="onSelectCraftItem" class="w-40">
                                                <el-option
                                                    v-for="opt in itemOptions"
                                                    :key="opt.value"
                                                    :label="opt.label"
                                                    :value="opt.label"
                                                />
                                            </el-select>
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="單次完成度">
                                    <template #default>
                                        <div class="flex items-center gap-2 p-1 rounded">
                                            <el-icon>
                                                <DataLine />
                                            </el-icon>
                                            <el-input-number
                                                controls-position="right"
                                                v-model="form.baseProgressPerCraft"
                                                :min="1"
                                                :max="100"
                                            />
                                            %
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="單次成本">
                                    <template #default>
                                        <div class="flex items-center gap-2">
                                            <el-icon>
                                                <Money />
                                            </el-icon>
                                            <el-input-number
                                                controls-position="right"
                                                v-model="form.costPerCraft"
                                                :min="1"
                                                :step="1"
                                                :max="1000000"
                                                :disabled="!form.showCost"
                                            >
                                                <template #suffix>{{ form.isBillionUnit ? "億" : "萬" }}</template>
                                            </el-input-number>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-card>

                    <!-- 新增列 -->
                    <el-card class="mb-4 bg-gradient-to-r from-blue-50 to-white shadow-sm rounded-md">
                        <CardHeader title="當前項目詳細資料" subtitle="設定目前完成度與投入資金以進行估算" />

                        <!-- ⚙️ 表單區（改為非卡片） -->
                        <div class="bg-white rounded-md shadow-sm p-4 mt-4 w-fit mx-auto border border-gray-200">
                            <el-table
                                :data="[newEstimateEntry]"
                                style="min-width: 900px; --el-table-border-color: #dcdfe6"
                                highlight-current-row
                            >
                                <el-table-column align="center" prop="name" label="名稱">
                                    <template #default="{ row }">
                                        <el-input v-model="row.name" />
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="王城製作">
                                    <template #default="{ row }">
                                        <div class="flex justify-center">
                                            <el-switch v-model="row.isRoyalCraft" />
                                        </div>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" prop="currentProgress" label="當前完成度">
                                    <template #default="{ row }">
                                        <el-input-number
                                            v-model="row.currentProgress"
                                            :min="0"
                                            :max="99.99"
                                            controls-position="right"
                                        >
                                            <template #suffix>%</template>
                                        </el-input-number>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" prop="cost" label="已投入之成本" width="180">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.cost" :min="0" controls-position="right">
                                            <template #suffix>{{ form.isBillionUnit ? "億" : "萬" }}</template>
                                        </el-input-number>
                                    </template>
                                </el-table-column>

                                <el-table-column align="center" label="操作" width="120">
                                    <template #default>
                                        <el-button
                                            type="success"
                                            plain
                                            @click="addEstimateEntry"
                                            :disabled="isCalculating"
                                        >
                                            ➕ 新增
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                        <!-- 📌 操作按鈕 -->
                        <div class="mt-4 flex gap-4 justify-center">
                            <el-button
                                type="danger"
                                size="large"
                                plain
                                @click="clearEstimateData"
                                :disabled="isCalculating"
                            >
                                🗑️ 清空
                            </el-button>
                            <el-button type="info" size="large" plain @click="testAllData" :disabled="isCalculating">
                                ⚙️ 全體測試
                            </el-button>
                            <el-button
                                type="warning"
                                size="large"
                                plain
                                @click="drawer = true"
                                :disabled="isCalculating"
                            >
                                ⚙️ 計算參數設定
                            </el-button>
                            <el-button
                                type="primary"
                                size="large"
                                plain
                                @click="startSimulate"
                                :disabled="isCalculating"
                            >
                                🚀 開始計算
                            </el-button>
                        </div>
                    </el-card>
                </div>

                <el-card class="bg-gradient-to-r from-blue-100 to-white shadow-sm rounded-md">
                    <CardHeader title="計算結果" subtitle="資料有更新，要再按一次計算才會更新唷" />
                    <div class="p-4 bg-white rounded-lg shadow">
                        <el-table
                            v-loading="isCalculating"
                            :data="estimateData"
                            stripe
                            border
                            style="width: 100%"
                            max-height="300"
                        >
                            <el-table-column align="center" prop="name" label="裝備名稱" />
                            <el-table-column align="center" label="已投入成本">
                                <template #default="{ row }">
                                    <span v-if="form.showExchangeRate">
                                        {{ convertToDisplayCurrency(row.baseCost) }}
                                    </span>
                                    <span v-else>
                                        {{ row.baseCost.toFixed(2) }} {{ form.isBillionUnit ? "億" : "萬" }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="expectedTimes" label="預期次數" />
                            <el-table-column align="center" v-if="form.showCost" label="預計要再投入">
                                <template #default="{ row }">
                                    <div v-if="row.expectedTimes && form.showCost">
                                        <span v-if="form.showExchangeRate">
                                            {{ convertToDisplayCurrency(row.expectedCost) }}
                                        </span>
                                        <span v-else>
                                            {{ row.expectedCost.toFixed(2) }} {{ form.isBillionUnit ? "億" : "萬" }}
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" v-if="form.showCost" label="總成本">
                                <template #default="{ row }">
                                    <div v-if="row.expectedTimes && form.showCost">
                                        <span v-if="form.showExchangeRate">
                                            {{ convertToDisplayCurrency(row.totalCost) }}
                                        </span>
                                        <span v-else>
                                            {{ row.totalCost.toFixed(2) }} {{ form.isBillionUnit ? "億" : "萬" }}
                                        </span>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column
                                align="center"
                                v-if="form.showResultDetails"
                                v-for="count in allCraftCounts"
                                :key="count"
                                :label="`製作 ${count} 次`"
                                :min-width="100"
                            >
                                <template #default="{ row }">
                                    <span v-if="row.simulateResult[count] && row.simulateResult[count].rate >= 0.1">
                                        {{ row.simulateResult[count].rate.toFixed(2) }}%
                                    </span>
                                    <span v-else>-</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Option } from "../types";
import { EstimatedCraftItem, SampleResult } from "../types/CraftItem";
import CardHeader from "../components/CardHeader.vue";

const drawer = ref(false);
const emptyEstimateEntry: EstimatedCraftItem = {
    id: -10000,
    name: "自訂",
    isRoyalCraft: true,
    currentProgress: 0,
    baseCost: 0,
    expectedCost: 0,
    totalCost: 0,
    expectedTimes: 0,
    simulateResult: [],
};
const isCalculating = ref(false);

const newEstimateEntry = ref({ ...emptyEstimateEntry });
const estimateData = ref<EstimatedCraftItem[]>([
    { ...emptyEstimateEntry, id: 0, name: "破滅長袍-0%" },
    { ...emptyEstimateEntry, currentProgress: 79, baseCost: 120, id: 1, name: "破滅長袍-70%" },
]);

const form = ref({
    itemName: "破滅長袍",
    baseProgressPerCraft: 10,
    simulateTimes: 100000,
    showResultDetails: false,
    showCost: true,
    costPerCraft: 20,
    showExchangeRate: false,
    exchangeRate: 20,
    isBillionUnit: true,
});

const itemOptions: Option[] = [
    { value: 10, label: "破滅長袍" },
    { value: 13, label: "安安輕靈系列" },
    { value: 13, label: "安安秘術系列" },
    { value: 13, label: "安安重甲系列" },
    { value: 13, label: "兇猛系列武器" },
    { value: 0, label: "自訂" },
];

const clearEstimateData = () => {
    estimateData.value = [];
};

const setupTestData = () => {
    const tmp: EstimatedCraftItem[] = [];
    const baseProgress = form.value.baseProgressPerCraft;
    const start = Math.round(baseProgress * 0.5);
    const end = 99.99 - baseProgress + 1;

    for (let i = start; i < end; i++) {
        const name = `進度${i}%`;
        const obj = {
            ...emptyEstimateEntry,
            currentProgress: i,
            cost: 0,
            id: i,
            name,
        };
        tmp.push(obj);
    }

    estimateData.value = [...tmp];
};

const testAllData = () => {
    const orignSimulateTimes = form.value.simulateTimes;
    form.value.simulateTimes = 10000;
    setupTestData();
    form.value.simulateTimes = orignSimulateTimes;
};

const startCraftv2 = (completeRate: number, baseProgress: number, isRoyal: boolean): number => {
    let result = completeRate;
    const successRate = 100; // 目前都預設100，之後或許要拉出來

    const randSuccess = Math.random() * 100;
    const randOffset = Math.random();
    /*
    成功    0.5~ 1 大成功 1~  1.5
    大失敗 -0.5~ 0 失敗   0~ -0.5
    */
    let base = randSuccess <= successRate ? 0.5 : -0.5; // 預設基礎值為0.5或-0.5
    const singleRate = baseProgress + (isRoyal ? 1 : 0);
    const progress = roundTo(singleRate * 1.45 * (base + randOffset));
    result = progress + result;
    return Math.max(0, Math.min(100, result));
};

const startSimulate = () => {
    isCalculating.value = true;
    setTimeout(() => {
        testCraftByInput();
        isCalculating.value = false;
    }, 1000);
};

const testCraftByInput = (data?: EstimatedCraftItem[]) => {
    const { simulateTimes, baseProgressPerCraft, costPerCraft } = form.value;
    const tobeEstimateData = data && data.length > 0 ? data : estimateData.value;

    tobeEstimateData.forEach((data, index) => {
        const { currentProgress, baseCost, isRoyalCraft } = data;
        const record: number[] = [];
        const freq = new Map<number, number>();
        const simulateResult: Record<number, SampleResult> = {};
        for (let i = 0; i < simulateTimes; i++) {
            let result = currentProgress;
            let count = 0;
            while (result < 99.99) {
                result = startCraftv2(result, baseProgressPerCraft, isRoyalCraft);
                count++;
            }
            record.push(count);
        }
        for (const num of record) {
            freq.set(num, (freq.get(num) || 0) + 1);
        }
        let expectValue = 0;

        [...freq.entries()]
            .sort(([a], [b]) => a - b)
            .forEach(([key, value]) => {
                expectValue += key * (value / simulateTimes);
                simulateResult[key] = {
                    count: key,
                    rate: roundTo((value / simulateTimes) * 100, 6),
                    times: value,
                };
            });
        const expectedCost = costPerCraft * expectValue;
        tobeEstimateData[index] = {
            ...tobeEstimateData[index],
            simulateResult,
            expectedCost,
            totalCost: expectedCost + baseCost,
            expectedTimes: roundTo(expectValue, 2),
        };
    });
};

const onSelectCraftItem = (item: any) => {
    if (item === "自訂") {
        form.value.baseProgressPerCraft = 0;
    } else {
        const matched = itemOptions.find((opt) => opt.label === item);
        if (matched) {
            form.value.baseProgressPerCraft = matched.value;
        }
    }
};

const addEstimateEntry = () => {
    const { itemName } = form.value;
    const { name: customedName, currentProgress, baseCost } = newEstimateEntry.value;
    const name = customedName && customedName !== "自訂" ? customedName : `${itemName}-${currentProgress}%`;
    const id = estimateData.value.length + 1;

    estimateData.value.push({
        ...newEstimateEntry.value,
        id,
        name,
        currentProgress,
        baseCost,
    });
    newEstimateEntry.value = { ...emptyEstimateEntry };
};

const handleDeleteEstimateEntry = (index: number) => {
    estimateData.value.splice(index, 1);
};

const allCraftCounts = computed(() => {
    const keys = new Set<number>();
    estimateData.value.forEach((item) => {
        Object.keys(item.simulateResult).forEach((k) => keys.add(Number(k)));
    });
    return Array.from(keys).sort((a, b) => a - b);
});

const convertToDisplayCurrency = (value: number): string => {
    const { exchangeRate, isBillionUnit } = form.value;
    const currency = exchangeRate || 1;
    const unit = isBillionUnit ? 10000 : 1;
    const base = (value / currency) * unit;

    return `$ ${base.toLocaleString()}`;
};

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};
watch(
    () => form.value.itemName,
    (newValue) => {
        const matched = itemOptions.find((opt) => opt.label === newValue);
        if (matched) {
            form.value.baseProgressPerCraft = matched.value;
        } else {
            form.value.baseProgressPerCraft = 0;
        }
    }
);
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

@media (max-width: 768px) {
    .flex {
        flex-direction: column;
    }
}

html,
body {
    font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.craft-calculator {
    transition: all 0.3s ease;
}

@media (prefers-color-scheme: dark) {
    :root {
        color: rgba(255, 255, 255, 0.87);
        background-color: #242424;
    }
}

@media (prefers-color-scheme: light) {
    :root {
        color: #213547;
        background-color: #ffffff;
    }
}
</style>
