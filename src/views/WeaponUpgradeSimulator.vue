<template>
    <div
        class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8"
        style="background-image: url('https://www.transparenttextures.com/patterns/dark-mosaic.png')"
    >
        <div class="max-w-7xl mx-auto space-y-8">
            <header class="text-center relative pt-8">
                <h1
                    class="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 mb-2 tracking-wide font-serif drop-shadow-lg"
                >
                    <span class="inline-block relative text-white">裝備改造模擬</span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">為你的武器規劃最佳改造路線</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-yellow-500/50 shadow-inner rounded-xl p-6 sm:p-8 space-y-6">
                <!--武器數值設定-->
                <div class="flex gap-4 mt-4">
                    <!-- 左邊：選擇武器 -->
                    <div class="w-1/6 flex flex-col">
                        <div class="border-b border-gray-700 pb-4 pt-6">
                            <h2 class="text-2xl font-bold text-yellow-300">選擇武器</h2>
                        </div>
                        <el-form-item class="text-gray-300">
                            <el-select v-model="selectedWeaponId" placeholder="請選擇" class="w-full sm:w-[280px]">
                                <el-option
                                    v-for="item in op"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </el-form-item>
                        <div class="flex-grow flex justify-center items-center mt-4">
                            <img
                                :src="`${baseUrl}itemImage/${selectedWeaponId}.png`"
                                class="w-1/2 h-1/2 object-contain rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                    <!-- 中間：武器素質設定 -->
                    <div class="w-1/2">
                        <div class="border-b border-gray-700 pb-4 pt-6">
                            <h2 class="text-2xl font-bold text-yellow-300">武器素質設定與改造前後比較</h2>
                        </div>
                        <el-table
                            :data="Object.keys(form.after).map((key) => ({ id: key }))"
                            border
                            class="rounded-lg overflow-hidden mt-2"
                            :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                            :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                        >
                            <el-table-column label="屬性" align="center">
                                <template #default="{ row }">
                                    {{ renderAbilitiesWithMinMax(row.id) }}
                                </template>
                            </el-table-column>
                            <el-table-column label="改造前" align="center">
                                <template #default="{ row }">
                                    <el-input-number
                                        v-if="form.before[row.id] && getMinMax(row.id).min !== getMinMax(row.id).max"
                                        v-model="form.before[row.id]"
                                        :min="getMinMax(row.id).min"
                                        :max="getMinMax(row.id).max"
                                        class="w-full"
                                    />
                                    <span v-else-if="form.before[row.id]" class="block w-full text-center">
                                        {{ form.before[row.id] || 0 }}
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column label="改造後" align="center">
                                <template #default="{ row }">
                                    {{ form.after[row.id] || 0 }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <!-- 右邊：工匠改 -->
                    <div v-if="craftmanUpgrade && form.selectedUpgradeArray.includes(craftmanUpgrade.id)" class="w-1/3">
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
                            <el-table-column label="屬性" align="center">
                                <template #default="{ row }">
                                    {{ `${abilitiesMap[row.id] || row.id}: ${row.min} ~ ${row.max}` }}
                                </template>
                            </el-table-column>
                            <el-table-column label="數值" align="center">
                                <template #default="{ row }">
                                    <el-input-number
                                        v-model="form.craftmanUpgradeArray[row.id]"
                                        :min="row.min"
                                        :max="row.max"
                                        class="w-full"
                                    />
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
                    <el-table-column prop="name" label="名稱" width="300" align="center">
                        <template #default="{ row }">
                            <span class="block text-center w-full">{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="abilities" label="影響" min-width="150" align="center">
                        <template #default="{ row }">
                            <div v-html="renderAbilities(row.abilities)"></div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="required" label="改造需求" min-width="100" align="center">
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

                    <el-table-column label="選擇" align="center">
                        <template #default="{ row }">
                            <div class="flex items-center space-x-2 w-full justify-center">
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
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";
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
const baseUrl = import.meta.env.BASE_URL;
const selectedWeaponId = ref(1200043);
const upgradeableWeapons: number[] = upgradeForG27Weapons.map((item) => item.weaponId);

const weaponStatus = ref(infoForG27Weapon.find((item) => item.id === selectedWeaponId.value));

const upgradeList = computed(() => {
    return upgradeForG27Weapons.find((item) => item.weaponId === selectedWeaponId.value)?.methods || [];
});

const craftmanUpgrade = computed(() => upgradeList.value.find((item) => item.id.includes("craftman")));

// 使用 map 創建 options，確保下拉選單能動態顯示
const op: Option[] = infoForG27Weapon
    .filter((weapon) => upgradeableWeapons.includes(weapon.id))
    .map((item) => ({
        label: item.name.tw || item.name.en,
        value: item.id,
    }));

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};

const getMinMax = (id: string) => {
    return (
        weaponStatus.value?.status.find((status) => status.id === id) || {
            min: -1,
            max: -1,
        }
    );
};

const renderAbilitiesWithMinMax = (id: string): string => {
    const { min, max } = getMinMax(id);
    const randomValue = min === max ? `` : `:${min} - ${max}`;
    const suffix = abilitiesValueWithPercentArray.includes(id) ? "(%)" : "";
    return `${abilitiesMap[id] || id} ${randomValue} ${suffix}`;
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
    const format = (num: number): string => {
        const color = num < 0 ? "red" : "#60a5fa"; // tailwind 的 blue-400
        const sign = num >= 0 ? "+" : "";
        return `<span style="color:${color}">${sign}${num}</span>`;
    };

    return abilityIdArray
        .map((ability) => {
            const { id } = ability;
            const abilityName = abilitiesMap[id] || id;
            const suffix = abilitiesValueWithPercentArray.includes(id) ? "%" : "";

            if ("min" in ability && "max" in ability) {
                return `${abilityName}: ${format(ability.min)} ~ ${format(ability.max)} ${suffix}`;
            } else {
                const value = (ability as UpgradeAbility).value;
                return `${abilityName}: ${format(value)} ${suffix}`;
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
        form.value.selectedUpgradeArray = ["", "", "", "", "", ""];
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
    [() => form.value.selectedUpgradeArray, () => form.value.before, () => form.value.craftmanUpgradeArray],
    ([newSelectedUpgrades]) => {
        // 每次選擇改造後，計算總成本和總熟練度
        let totalCost = 0;
        let totalEp = 0;
        let totalStatus = { ...form.value.before };

        newSelectedUpgrades.forEach((id) => {
            const upgrade = upgradeList.value.find((u) => u.id === id);
            if (!upgrade) return;

            const { abilities, required } = upgrade;
            const { gold, ep } = required;
            totalCost += gold ?? 0;
            totalEp += ep ?? 0;

            // 累加能力值
            abilities.forEach((currentStatus) => {
                const { id } = currentStatus;
                let value = 0;

                // 分辨工匠改和一般改造
                if ("min" in currentStatus && "max" in currentStatus) {
                    value = form.value.craftmanUpgradeArray[id] || 0;
                } else {
                    value = (currentStatus as UpgradeAbility).value;
                }

                totalStatus[id] = (totalStatus[id] ?? 0) + value;
            });
        });

        form.value.totalCost = totalCost;
        form.value.totalEp = totalEp;
        form.value.after = { ...totalStatus };
    },
    { immediate: true, deep: true }
);
</script>
