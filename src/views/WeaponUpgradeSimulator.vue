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
                    <span class="inline-block relative">
                        <svg
                            class="w-8 h-8 sm:w-10 sm:h-10 text-yellow-400 absolute -left-12 top-1/2 -translate-y-1/2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1z"
                            />
                        </svg>
                        裝備改造模擬
                    </span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">為你的武器規劃最佳改造路線</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-yellow-500/50 shadow-inner rounded-xl p-6 sm:p-8 space-y-6">
                <div class="border-b border-gray-700 pb-4">
                    <h2 class="text-2xl font-bold text-yellow-300">武器選擇</h2>
                    <p class="text-gray-400 text-sm mt-1">請選擇你想要改造的武器。</p>
                </div>

                <el-form :model="form" label-width="160px" label-position="left">
                    <el-form-item label="選擇武器" class="text-gray-300">
                        <el-select v-model="selectedWeaponId" placeholder="請選擇" class="w-full sm:w-[280px]">
                            <el-option v-for="item in op" :key="item.value" :label="item.label" :value="item.value" />
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--武器數值設定-->
                <div class="flex flex-wrap gap-4 mt-4">
                    <!-- 左邊：武器素質設定 -->
                    <div class="flex-1 min-w-[320px]">
                        <div class="border-b border-gray-700 pb-4 pt-6">
                            <h2 class="text-2xl font-bold text-yellow-300">武器素質設定</h2>
                        </div>
                        <el-table
                            :data="weaponStatus?.status"
                            border
                            class="rounded-lg overflow-hidden mt-2"
                            :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                            :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                        >
                            <el-table-column label="屬性">
                                <template #default="{ row }">
                                    {{ abilitiesMap[row.id] || row.id }}
                                </template>
                            </el-table-column>
                            <el-table-column label="改造前">
                                <template #default="{ row }">
                                    <el-tooltip
                                        effect="dark"
                                        :content="`浮動範圍: ${row.min} ~ ${row.max}`"
                                        placement="top-end"
                                    >
                                        <el-input-number
                                            v-model="form.before[row.id]"
                                            :min="row.min"
                                            :max="row.max"
                                            class="w-full"
                                        />
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <!-- 右邊：工匠改 -->
                    <div
                        v-if="craftmanUpgrade && form.selectedUpgradeArray.includes(craftmanUpgrade.id)"
                        class="flex-1 min-w-[320px]"
                    >
                        <div class="border-b border-gray-700 pb-4 pt-6">
                            <h2 class="text-2xl font-bold text-yellow-300">工匠改造素質設定</h2>
                        </div>
                        <el-table
                            :data="craftmanUpgrade.abilities"
                            border
                            class="rounded-lg overflow-hidden mt-2"
                            :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                            :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                        >
                            <el-table-column label="屬性">
                                <template #default="{ row }">
                                    {{ abilitiesMap[row.id] || row.id }}
                                </template>
                            </el-table-column>
                            <el-table-column label="數值">
                                <template #default="{ row }">
                                    <el-tooltip
                                        effect="dark"
                                        :content="`浮動範圍: ${row.min} ~ ${row.max}`"
                                        placement="top-end"
                                    >
                                        <el-input-number
                                            v-model="form.craftmanUpgradeArray[row.id]"
                                            :min="row.min"
                                            :max="row.max"
                                            class="w-full"
                                        />
                                    </el-tooltip>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>

                <div class="border-b border-gray-700 pb-4 pt-6">
                    <h2 class="text-2xl font-bold text-yellow-300">選擇改造</h2>
                    <p class="text-gray-400 text-sm mt-1">選擇你要進行的改造項目，最多可選擇 6 項。</p>
                </div>
                <el-table
                    :data="upgradeList"
                    border
                    class="rounded-lg overflow-hidden"
                    :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                    :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                >
                    <el-table-column prop="name" label="名稱" width="200" />
                    <el-table-column prop="abilities" label="影響" min-width="150">
                        <template #default="{ row }">
                            <div v-html="renderAbilities(row.abilities)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="required" label="改造需求" min-width="100">
                        <template #default="{ row }">
                            <div class="flex flex-col">
                                <span v-if="row.required.ep" class="text-yellow-300">
                                    熟練度: {{ row.required.ep }}
                                </span>
                                <span v-if="row.required.gold" class="text-yellow-300">
                                    金幣: {{ row.required.gold.toLocaleString() }}
                                </span>
                                <span
                                    v-if="row.required.gems"
                                    class="text-yellow-300"
                                    v-html="renderGems(row.required.gems)"
                                ></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="required.ep" label="熟練度" width="80" />

                    <el-table-column label="選擇">
                        <template #default="{ row }">
                            <div class="flex items-center space-x-1">
                                <el-checkbox
                                    v-for="i in 5"
                                    :key="i - 1"
                                    :model-value="form.selectedUpgradeArray[i - 1] === row.id"
                                    @change="handleOptionChange(row.id, i - 1, $event)"
                                    :disabled="!row.progress || !row.progress.includes(i - 1)"
                                ></el-checkbox>

                                <el-checkbox
                                    :model-value="form.selectedUpgradeArray[5] === row.id"
                                    @change="handleOptionChange(row.id, 5, $event)"
                                    :disabled="!row.progress || !row.progress.includes(5)"
                                />
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="flex-1 min-w-[320px]">
                    <div class="border-b border-gray-700 pb-4 pt-6">
                        <h2 class="text-2xl font-bold text-yellow-300">武器改造結果</h2>
                    </div>
                    <el-table
                        :data="Object.keys(form.after).map((key) => ({ id: key }))"
                        border
                        class="rounded-lg overflow-hidden mt-2"
                        :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                        :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                    >
                        <el-table-column label="屬性">
                            <template #default="{ row }">
                                {{ abilitiesMap[row.id] || row.id }}
                            </template>
                        </el-table-column>
                        <el-table-column label="改造後">
                            <template #default="{ row }">
                                {{ form.after[row.id] || 0 }}
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>
    </div>
</template>

<style>
/* 這裡的 CSS 樣式與上一個頁面相同，請保留 */
/* 調整表格內部 InputNumber 的顏色 */
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

/* 針對 Checkbox 的顏色調整 */
.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #fbd38d;
    border-color: #fbd38d;
}
.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #fbd38d;
}
.el-checkbox__label {
    color: #e2e8f0;
}
.el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: #4a5568 !important;
    border-color: #6b7280 !important;
}
.el-checkbox__input.is-disabled + .el-checkbox__label {
    color: #6b7280 !important;
}

label.el-checkbox {
    margin: 0;
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
import { ref, computed, watch } from "vue";
import { Option } from "../types";
import { infoForG27Weapon } from "../data/infoForG27Weapon";
import { upgradeForG27Weapons } from "../data/upgradeForG27Weapons";
import { abilitiesMap } from "../data/abilities";
import { UpgradeAbility, CraftsManUpgradeAbility, Gems } from "../types/Upgrade";

interface UpgradeStatus {
    [key: string]: number;
}

const form = ref({
    before: {} as UpgradeStatus,
    after: {} as UpgradeStatus,
    craftmanUpgradeArray: {} as UpgradeStatus,
    // 儲存選中的改造 ID，每個 index 對應一個改造階段
    //selectedUpgradeArray: new Array(6).fill(""),
    selectedUpgradeArray: ["1200043-1", "1200043-3", "1200043-5", "1200043-6", "1200043-craftman", "1200043-g-2"],
    totalCost: 0,
    totalEp: 0,
});

const selectedWeaponId = ref(1200043);

const weaponStatus = ref(infoForG27Weapon.find((item) => item.id === selectedWeaponId.value));

const upgradeList = computed(() => {
    return upgradeForG27Weapons.find((item) => item.weaponId === selectedWeaponId.value)?.methods || [];
});

const craftmanUpgrade = ref(upgradeList.value.find((item) => item.id.includes("craftman")));

const options: Option[] = [{ label: "靈魂解放者雙手劍", value: 1200043 }];

// 使用 map 創建 options，確保下拉選單能動態顯示
const op: Option[] = infoForG27Weapon.map((item) => ({
    label: item.name.tw || item.name.en,
    value: item.id,
}));

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};

const renderGems = (gems: Gems[]): string => {
    return gems
        .map((gem) => {
            const { name, requiredSize } = gem;
            return `${name}: ${requiredSize} cm`;
        })
        .join("<br>");
};

const renderAbilities = (abilityIdArray: UpgradeAbility[] | CraftsManUpgradeAbility[]): string => {
    return abilityIdArray
        .map((ability) => {
            const { id } = ability;
            const abilityName = abilitiesMap[id] || id;

            if ("min" in ability && "max" in ability) {
                // CraftsManUpgradeAbility 類型
                return `${abilityName}: + ${ability.min}-${ability.max}`;
            } else {
                // UpgradeAbility 類型
                return `${abilityName}: + ${(ability as UpgradeAbility).value}`;
            }
        })
        .join("<br>");
};

const handleOptionChange = (rowId: string, optionIndex: number, checked: boolean) => {
    // 這裡的邏輯需要稍微調整，以確保同一個階段只能選擇一個改造
    if (checked) {
        // 如果被選中，將該 rowId 賦予給對應的階段
        form.value.selectedUpgradeArray[optionIndex] = rowId;
    } else {
        // 如果取消選中，將該階段的 rowId 設為空字串
        form.value.selectedUpgradeArray[optionIndex] = "";
    }
};

watch(
    () => selectedWeaponId.value,
    (newId) => {
        // debug
        // form.value.selectedUpgradeArray = ["", "", "", "", "", ""];
        form.value.before = {};
        form.value.after = {};
        const newStatus = infoForG27Weapon.find((item) => item.id === newId);
        if (newStatus) {
            weaponStatus.value = newStatus;

            // 使用 reduce 方法來創建新物件
            const newBeforeStatus = newStatus.status.reduce((acc, currentStatus) => {
                acc[currentStatus.id] = currentStatus.max;
                return acc;
            }, {} as { [key: string]: number }); // 這裡明確宣告了物件的型別

            form.value.before = newBeforeStatus;
            form.value.after = newBeforeStatus;

            if (craftmanUpgrade.value) {
                const craftmanUpgradeTableData = craftmanUpgrade.value.abilities.reduce((acc, currentStatus) => {
                    if ("min" in currentStatus && "max" in currentStatus) {
                        acc[currentStatus.id] = currentStatus.max;
                        return acc;
                    }
                    return {};
                }, {} as { [key: string]: number });
                form.value.craftmanUpgradeArray = craftmanUpgradeTableData;
            }
        }
    },
    { immediate: true }
);

watch(
    [() => form.value.selectedUpgradeArray, () => form.value.before],
    ([newSelectedUpgrades]) => {
        // 每次選擇改造後，計算總成本和總熟練度
        let totalCost = 0;
        let totalEp = 0;
        let totalStatus = { ...form.value.before };
        const selectedUpgradeMethodArray = upgradeList.value.filter((upgrade) =>
            newSelectedUpgrades.includes(upgrade.id)
        );

        selectedUpgradeMethodArray.forEach((upgrade) => {
            const { abilities, required } = upgrade;
            const { gold, ep } = required;
            totalCost += gold || 0;
            totalEp += ep || 0;

            // 累加能力值
            abilities.forEach((currentStatus) => {
                const { id } = currentStatus;
                let value = 0;

                // 分辨工匠改和一般改造
                if ("min" in currentStatus && "max" in currentStatus) {
                    value = currentStatus.max;
                } else {
                    value = (currentStatus as UpgradeAbility).value;
                }

                if (totalStatus[id]) {
                    totalStatus[id] += value;
                } else {
                    totalStatus[id] = value;
                }
            });
        });

        form.value.totalCost = totalCost;
        form.value.totalEp = totalEp;
        form.value.after = { ...totalStatus };
    },
    { immediate: true, deep: true }
);
</script>
