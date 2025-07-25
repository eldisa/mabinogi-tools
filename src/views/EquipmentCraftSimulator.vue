<template>
    <div class="craft-calculator min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto">
            <header class="mb-6 text-center">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">製作成本計算模擬器</h1>
                <p class="text-gray-600 mt-2">輕鬆計算各種裝備的完成度和成本預估</p>
            </header>
            <el-drawer v-model="drawer" title="輸入與參數設定" size="500px" :with-header="true">
                <!-- 區塊：參數調整 -->
                <div class="p-5 bg-gradient-to-b from-blue-50 to-white rounded-lg shadow-sm mb-6">
                    <h3 class="text-base font-semibold mb-4 text-blue-800">🎯 模擬設定</h3>
                    <el-form :model="form" label-width="120px" label-position="left" class="space-y-4">
                        <el-form-item label="模擬次數">
                            <el-input-number
                                controls-position="right"
                                v-model="form.simulateTimes"
                                :min="1"
                                :max="10000"
                                :step="100"
                                class="w-40"
                            />
                        </el-form-item>
                        <el-form-item label="成功率">
                            <el-input-number
                                controls-position="right"
                                v-model="form.successRate"
                                :min="1"
                                :max="100"
                                :step="1"
                                class="w-40"
                            >
                                <template #suffix>%</template>
                            </el-input-number>
                        </el-form-item>
                    </el-form>
                </div>

                <!-- 區塊：顯示設定 -->
                <div class="p-5 bg-gradient-to-b from-gray-50 to-white rounded-lg shadow-sm">
                    <h3 class="text-base font-semibold mb-4 text-gray-700">📊 顯示設定</h3>
                    <el-form :model="form" label-width="140px" label-position="left" class="space-y-4">
                        <el-form-item label="顯示模擬詳細">
                            <el-switch v-model="form.showResultDetails" size="small" />
                        </el-form-item>
                        <el-form-item label="顯示成本估算">
                            <el-switch v-model="form.showCost" size="small" />
                        </el-form-item>
                        <el-form-item label="金錢單位（萬 / 億）">
                            <el-switch v-model="form.isBillionUnit" active-text="億" inactive-text="萬" class="w-20" />
                        </el-form-item>
                        <el-form-item label="金錢單位轉換">
                            <el-select v-model="form.currencyType" placeholder="選擇幣別" size="small" class="w-40">
                                <el-option label="遊戲幣" value="game" />
                                <el-option label="新台幣 (NTD)" value="ntd" />
                                <el-option label="港幣 (HKD)" value="hkd" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="匯率" v-if="form.currencyType === 'ntd'">
                            <el-input-number
                                controls-position="right"
                                v-model="form.exchangeRate"
                                :min="1"
                                :step="0.1"
                                class="w-40"
                            >
                                <template #prefix>1:</template>
                                <template #suffix>萬</template>
                            </el-input-number>
                        </el-form-item>
                        <el-form-item label="匯率" v-else-if="form.currencyType === 'hkd'">
                            <el-input-number
                                controls-position="right"
                                v-model="form.exchangeRate"
                                :min="1"
                                :step="1"
                                class="w-40"
                            >
                                <template #suffix>:1億</template>
                            </el-input-number>
                        </el-form-item>
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
                                        <div class="flex items-center justify-center gap-2">
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
                                        <div class="flex items-center justify-center gap-2 p-1 rounded">
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
                                        <div class="flex items-center justify-center gap-2">
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

                                <el-table-column align="center" prop="baseCost" label="已投入之成本" width="180">
                                    <template #default="{ row }">
                                        <el-input-number v-model="row.baseCost" :min="0" controls-position="right">
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
                                ⚙️ 模擬與顯示設定
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
                                    <span>{{ formatCurrency(row.baseCost) }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="expectedTimes" label="預期次數" />
                            <el-table-column align="center" v-if="form.showCost" label="預計要再投入">
                                <template #default="{ row }">
                                    <div v-if="row.expectedTimes && form.showCost">
                                        <span>{{ formatCurrency(row.expectedCost) }}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" v-if="form.showCost" label="總成本">
                                <template #default="{ row }">
                                    <div v-if="row.expectedTimes && form.showCost">
                                        <span>{{ formatCurrency(row.totalCost) }}</span>
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

const CUSTOM_LABEL = "自訂";
const drawer = ref(false);
const emptyEstimateEntry: EstimatedCraftItem = {
    id: -10000,
    name: CUSTOM_LABEL,
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
    currencyType: "game", // 遊戲幣
    exchangeRate: 20,
    isBillionUnit: true,
    successRate: 100,
});

const itemOptions: Option[] = [
    { value: 10, label: "破滅長袍" },
    { value: 13, label: "安安輕靈系列" },
    { value: 13, label: "安安秘術系列" },
    { value: 13, label: "安安重甲系列" },
    { value: 13, label: "兇猛系列武器" },
    { value: 0, label: CUSTOM_LABEL },
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
    const { successRate } = form.value; // 目前都預設100，之後或許要拉出來

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
    if (item === CUSTOM_LABEL) {
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
    const name = customedName && customedName !== CUSTOM_LABEL ? customedName : `${itemName}-${currentProgress}%`;
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

const formatCurrency = (value: number): string => {
    if (!value || value === 0) return "0";

    const { currencyType, exchangeRate, isBillionUnit } = form.value;

    if (currencyType === "game") {
        return `${value.toLocaleString()} ${isBillionUnit ? "億" : "萬"}`;
    }

    const rate = exchangeRate || 1;
    const unit = isBillionUnit ? 10000 : 1;
    const label = currencyType === "ntd" ? "NTD$" : "HKD$";
    let converted = 0;

    if (currencyType === "ntd") {
        converted = (value / rate) * unit;
    } else if (currencyType === "hkd") {
        const tmpRate = 10000 / rate; // rate HKD: 1E遊戲幣 => 1 HKD = tmpRate 遊戲幣
        converted = (value / tmpRate) * unit;
    } else {
        converted = value; // 遊戲幣不做轉換
    }

    return `${label} ${converted.toLocaleString()}`;
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
