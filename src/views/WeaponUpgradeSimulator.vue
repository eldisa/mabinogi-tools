<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
        <div class="max-w-7xl mx-auto space-y-8">
            <header class="text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    裝備改造模擬
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">為你的武器規劃最佳改造路線</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8 space-y-6">
                <!-- 桌面版：保持原有佈局 -->
                <div class="hidden md:block">
                    <!--武器數值設定-->
                    <div class="flex gap-4 mt-4">
                        <!-- 左邊：選擇武器 -->
                        <div class="w-1/6 flex flex-col">
                            <div class="border-b border-gray-700 pb-4 pt-6">
                                <h2 class="text-2xl font-bold text-accent">選擇武器</h2>
                            </div>
                            <el-form-item class="text-gray-300">
                                <el-select
                                    v-model="selectedWeaponId"
                                    placeholder="請選擇"
                                    class="w-full sm:w-[280px]"
                                    filterable
                                >
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
                                <h2 class="text-2xl font-bold text-accent">武器素質設定與改造前後比較</h2>
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
                                            v-if="
                                                form.before[row.id] && getMinMax(row.id).min !== getMinMax(row.id).max
                                            "
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
                        <div
                            v-if="craftmanUpgrade && form.selectedUpgradeArray.includes(craftmanUpgrade.id)"
                            class="w-1/3"
                        >
                            <div class="border-b border-gray-700 pb-4 pt-6">
                                <h2 class="text-2xl font-bold text-accent">工匠改造素質設定</h2>
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
                        <h2 class="text-2xl font-bold text-accent">選擇改造</h2>
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
                                    <span v-if="row.required.ep" class="text-accent">
                                        熟練度: {{ row.required.ep }}
                                    </span>
                                    <span v-if="row.required.gold" class="text-accent">
                                        金幣: {{ row.required.gold.toLocaleString() }}
                                    </span>
                                    <span
                                        v-if="row.required.gems"
                                        class="text-accent"
                                        v-html="renderGems(row.required.gems)"
                                    ></span>
                                </div>
                            </template>
                        </el-table-column>

                        <!-- <el-table-column label="選擇" align="center">
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
                    </el-table-column> -->
                        <el-table-column label="選擇階段" align="center" width="200">
                            <template #default="{ row }">
                                <div class="flex items-center space-x-1 w-full justify-center">
                                    <el-checkbox
                                        v-for="i in 6"
                                        :key="i - 1"
                                        :model-value="form.selectedUpgradeArray[i - 1] === row.id"
                                        @change="handleOptionChange(row.id, i - 1, $event)"
                                        :disabled="!row.progress || !row.progress.includes(i - 1)"
                                    />
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!-- 桌面版結束 -->

                <!-- 手機版：Tabs 介面 -->
                <div class="md:hidden">
                    <el-tabs v-model="activeTab" type="border-card" class="mobile-tabs">
                        <!-- Tab 1: 選擇武器 -->
                        <el-tab-pane label="選擇武器" name="weapon">
                            <div class="space-y-4">
                                <el-form-item label="武器" class="text-gray-300">
                                    <el-select
                                        v-model="selectedWeaponId"
                                        placeholder="請選擇武器"
                                        class="w-full"
                                        filterable
                                    >
                                        <el-option
                                            v-for="item in op"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>

                                <div class="flex justify-center py-4">
                                    <img
                                        :src="`${baseUrl}itemImage/${selectedWeaponId}.png`"
                                        class="w-32 h-32 object-contain rounded-lg shadow-lg"
                                        alt="武器圖片"
                                    />
                                </div>

                                <div class="bg-gray-700 rounded-lg p-4 space-y-2">
                                    <h3 class="text-lg font-bold text-accent mb-3">基礎屬性</h3>
                                    <div
                                        v-for="key in Object.keys(form.before)"
                                        :key="key"
                                        class="flex justify-between text-sm"
                                    >
                                        <span class="text-gray-300">{{ abilitiesMap[key] || key }}</span>
                                        <span class="text-accent font-medium">{{ form.before[key] }}</span>
                                    </div>
                                </div>

                                <el-button type="primary" class="w-full" @click="activeTab = 'stats'">
                                    下一步：設定數值
                                </el-button>
                            </div>
                        </el-tab-pane>

                        <!-- Tab 2: 設定數值 -->
                        <el-tab-pane label="設定數值" name="stats">
                            <div class="space-y-3">
                                <p class="text-gray-400 text-sm mb-4">設定武器的初始數值</p>

                                <div
                                    v-for="key in Object.keys(form.before)"
                                    :key="key"
                                    class="bg-gray-700 rounded-lg p-3"
                                >
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-gray-200 font-medium">
                                            {{ renderAbilitiesWithMinMax(key) }}
                                        </span>
                                    </div>
                                    <el-input-number
                                        v-model="form.before[key]"
                                        :min="getMinMax(key).min"
                                        :max="getMinMax(key).max"
                                        class="w-full"
                                        controls-position="right"
                                    />
                                </div>

                                <div class="flex gap-2 mt-4">
                                    <el-button class="flex-1" @click="activeTab = 'weapon'">上一步</el-button>
                                    <el-button type="primary" class="flex-1" @click="activeTab = 'upgrades'">
                                        下一步：選擇改造
                                    </el-button>
                                </div>
                            </div>
                        </el-tab-pane>

                        <!-- Tab 3: 選擇改造 -->
                        <el-tab-pane label="選擇改造" name="upgrades">
                            <div class="space-y-3">
                                <!-- 快速配置 -->
                                <div class="bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg p-4 mb-4">
                                    <h4 class="text-sm font-bold text-accent mb-3">⚡ 快速配置</h4>
                                    <div class="flex gap-2">
                                        <el-select
                                            v-model="selectedPreset"
                                            placeholder="選擇配置"
                                            class="flex-1"
                                            size="small"
                                        >
                                            <el-option
                                                v-for="preset in quickPresets"
                                                :key="preset.id"
                                                :label="preset.name"
                                                :value="preset.id"
                                            >
                                                <div class="flex flex-col">
                                                    <span class="font-medium">{{ preset.name }}</span>
                                                    <span class="text-xs text-gray-400">{{ preset.description }}</span>
                                                </div>
                                            </el-option>
                                        </el-select>
                                        <el-button
                                            type="primary"
                                            size="small"
                                            @click="applyPreset"
                                            :disabled="!selectedPreset"
                                        >
                                            套用
                                        </el-button>
                                    </div>
                                </div>

                                <div class="bg-gray-700 rounded-lg p-3 mb-4">
                                    <p class="text-sm text-gray-300">
                                        已選擇：
                                        <span class="text-accent font-bold">
                                            {{ form.selectedUpgradeArray.filter((id) => id).length }}/6
                                        </span>
                                    </p>
                                </div>

                                <!-- 按階段顯示改造選項 -->
                                <div v-for="stage in 6" :key="stage" class="bg-gray-700 rounded-lg p-4 space-y-3">
                                    <div class="flex items-center justify-between border-b border-gray-600 pb-2">
                                        <h4 class="font-bold text-accent">階段 {{ stage }}</h4>
                                        <span
                                            v-if="form.selectedUpgradeArray[stage - 1]"
                                            class="text-xs text-green-400"
                                        >
                                            ✓ 已選擇
                                        </span>
                                    </div>

                                    <el-radio-group v-model="form.selectedUpgradeArray[stage - 1]" class="w-full">
                                        <div class="space-y-2">
                                            <!-- 清除選項 -->
                                            <el-radio value="" class="w-full">
                                                <div class="text-sm text-gray-400">不選擇改造</div>
                                            </el-radio>

                                            <!-- 當前階段可用的改造選項 -->
                                            <el-radio
                                                v-for="upgrade in getUpgradesForStage(stage - 1)"
                                                :key="upgrade.id"
                                                :value="upgrade.id"
                                                class="w-full upgrade-radio"
                                            >
                                                <div class="flex flex-col py-2 w-full">
                                                    <span class="font-medium text-gray-100">{{ upgrade.name }}</span>
                                                    <div
                                                        class="text-xs text-gray-300 mt-1"
                                                        v-html="renderAbilities(upgrade.abilities)"
                                                    ></div>
                                                    <div class="text-xs text-accent mt-1 space-y-0.5">
                                                        <div v-if="upgrade.required.ep">
                                                            熟練度: {{ upgrade.required.ep }}
                                                        </div>
                                                        <div v-if="upgrade.required.gold">
                                                            金幣: {{ upgrade.required.gold.toLocaleString() }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </el-radio>
                                        </div>
                                    </el-radio-group>
                                </div>

                                <div class="flex gap-2 mt-4">
                                    <el-button class="flex-1" @click="activeTab = 'stats'">上一步</el-button>
                                    <el-button
                                        type="primary"
                                        class="flex-1"
                                        @click="
                                            activeTab =
                                                craftmanUpgrade &&
                                                form.selectedUpgradeArray.includes(craftmanUpgrade.id)
                                                    ? 'craftman'
                                                    : 'result'
                                        "
                                    >
                                        下一步
                                    </el-button>
                                </div>
                            </div>
                        </el-tab-pane>

                        <!-- Tab 4: 工匠改設定 -->
                        <el-tab-pane
                            label="工匠改"
                            name="craftman"
                            v-if="craftmanUpgrade && form.selectedUpgradeArray.includes(craftmanUpgrade.id)"
                        >
                            <div class="space-y-3">
                                <p class="text-gray-400 text-sm mb-4">設定工匠改造的數值</p>

                                <div
                                    v-for="ability in craftmanUpgrade.abilities"
                                    :key="ability.id"
                                    class="bg-gray-700 rounded-lg p-3"
                                >
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-gray-200 font-medium">
                                            {{
                                                `${abilitiesMap[ability.id] || ability.id}: ${ability.min} ~ ${ability.max}`
                                            }}
                                        </span>
                                    </div>
                                    <el-input-number
                                        v-model="form.craftmanUpgradeArray[ability.id]"
                                        :min="ability.min"
                                        :max="ability.max"
                                        class="w-full"
                                        controls-position="right"
                                    />
                                </div>

                                <div class="flex gap-2 mt-4">
                                    <el-button class="flex-1" @click="activeTab = 'upgrades'">上一步</el-button>
                                    <el-button type="primary" class="flex-1" @click="activeTab = 'result'">
                                        查看結果
                                    </el-button>
                                </div>
                            </div>
                        </el-tab-pane>

                        <!-- Tab 5: 結果顯示 -->
                        <el-tab-pane label="結果" name="result">
                            <div class="space-y-4">
                                <div class="bg-gray-700 rounded-lg p-4">
                                    <h3 class="text-lg font-bold text-accent mb-3">改造前後對比</h3>
                                    <div class="space-y-2">
                                        <div
                                            v-for="key in Object.keys(form.after)"
                                            :key="key"
                                            class="flex justify-between text-sm"
                                        >
                                            <span class="text-gray-300">{{ abilitiesMap[key] || key }}</span>
                                            <span class="flex gap-2">
                                                <span class="text-gray-400">{{ form.before[key] }}</span>
                                                <span class="text-gray-500">→</span>
                                                <span
                                                    class="font-bold"
                                                    :class="
                                                        form.after[key] > form.before[key]
                                                            ? 'text-green-400'
                                                            : form.after[key] < form.before[key]
                                                              ? 'text-red-400'
                                                              : 'text-gray-300'
                                                    "
                                                >
                                                    {{ roundTo(form.after[key]) }}
                                                </span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="bg-gray-700 rounded-lg p-4">
                                    <h3 class="text-lg font-bold text-accent mb-3">總花費</h3>
                                    <div class="space-y-2 text-sm">
                                        <div class="flex justify-between">
                                            <span class="text-gray-300">總金幣</span>
                                            <span class="text-accent font-bold">
                                                {{ form.totalCost.toLocaleString() }}
                                            </span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-gray-300">總熟練度</span>
                                            <span class="text-accent font-bold">{{ form.totalEp }}</span>
                                        </div>
                                    </div>
                                </div>

                                <el-button class="w-full" @click="activeTab = 'weapon'">重新設定</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!-- 手機版結束 -->
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

/* 手機版 Tabs 樣式 */
.mobile-tabs {
    background: transparent !important;
    border: none !important;
}

.mobile-tabs .el-tabs__content {
    padding: 16px 0;
}

.mobile-tabs .el-tabs__header {
    margin-bottom: 16px;
}

.mobile-tabs .el-tabs__item {
    font-size: 14px;
    color: #9ca3af !important;
}

.mobile-tabs .el-tabs__item.is-active {
    color: #fbbf24 !important;
}

/* 手機版表單樣式優化 */
@media (max-width: 768px) {
    .el-input-number {
        width: 100% !important;
    }

    .el-input-number .el-input__inner {
        text-align: center;
    }
}

/* 改造選項 Radio 樣式 */
.upgrade-radio {
    width: 100%;
    height: auto !important;
    white-space: normal !important;
    margin-right: 0 !important;
    padding: 8px;
    border-radius: 8px;
    background: #374151;
    margin-bottom: 8px;
}

.upgrade-radio:hover {
    background: #4b5563;
}

.upgrade-radio.is-checked {
    background: rgba(251, 191, 36, 0.1);
    border: 1px solid rgba(251, 191, 36, 0.3);
}

.el-radio__label {
    width: 100%;
    white-space: normal !important;
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
const activeTab = ref("weapon"); // 手機版 Tabs 當前選中的 tab
const selectedPreset = ref(""); // 快速配置選項

// 快速配置預設
interface QuickPreset {
    id: string;
    name: string;
    description: string;
    abilityWeights: { [key: string]: number }; // 能力權重（正數=優先，負數=避免，0=忽略）
}

const quickPresets: QuickPreset[] = [
    {
        id: "crit-focus",
        name: "銳利優先",
        description: "最大化銳利",
        abilityWeights: {
            attack_max: 1, // 次要
            attack_min: 0,
            attack_range: 0.1, // 射程（弩/弓專用
            lance_piercing: 70, // 穿透 最高優先
        },
    },
    {
        id: "damage-focus",
        name: "大傷優先",
        description: "最大化攻擊力",
        abilityWeights: {
            attack_range: 0.1, // 射程最優先（弩/弓專用）
            attack_max: 1, // 最高優先
            attack_min: 0,
        },
    },
];
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

// 套用快速配置
const applyPreset = () => {
    if (!selectedPreset.value) return;

    const preset = quickPresets.find((p) => p.id === selectedPreset.value);
    if (!preset) return;

    // 清空現有選擇
    form.value.selectedUpgradeArray = ["", "", "", "", "", ""];

    // 為每個階段選擇最符合的改造
    for (let stage = 0; stage < 6; stage++) {
        // 取得這個階段可用的所有改造
        const availableUpgrades = upgradeList.value.filter(
            (upgrade) => upgrade.progress && upgrade.progress.includes(stage),
        );

        if (availableUpgrades.length === 0) continue;

        // 根據加權計算每個改造的得分
        const upgradesWithScore = availableUpgrades.map((upgrade) => {
            let totalScore = 0;
            const scoreDetails: string[] = [];

            upgrade.abilities.forEach((ability) => {
                const weight = preset.abilityWeights[ability.id];

                // 如果沒有定義權重，跳過（視為不重要）
                if (weight === undefined || weight === 0) return;

                // 取得能力的數值
                const abilityValue = "value" in ability ? ability.value : "max" in ability ? ability.max : 0;

                // 計算得分 = 權重 × 數值
                const score = weight * abilityValue;
                totalScore += score;

                if (score !== 0) {
                    scoreDetails.push(`${ability.id}:${abilityValue}×${weight}=${score}`);
                }
            });

            if (scoreDetails.length > 0) {
                console.log(`  ${upgrade.name}: ${scoreDetails.join(", ")} = ${totalScore}`);
            }

            return { upgrade, score: totalScore };
        });

        // 按分數排序，選擇最高分的
        upgradesWithScore.sort((a, b) => b.score - a.score);
        console.log(upgradesWithScore);
        if (upgradesWithScore.length > 0 && upgradesWithScore[0].score > 0) {
            form.value.selectedUpgradeArray[stage] = upgradesWithScore[0].upgrade.id;
            console.log(
                `階段 ${stage + 1}:`,
                upgradesWithScore[0].upgrade.name,
                `(得分: ${upgradesWithScore[0].score})`,
            );
        }
    }

    console.log("套用快速配置:", preset.name);
    console.log("選擇結果:", form.value.selectedUpgradeArray);
};

// 取得某個階段可用的改造選項
const getUpgradesForStage = (stage: number) => {
    return upgradeList.value.filter((upgrade) => upgrade.progress && upgrade.progress.includes(stage));
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
            const newBeforeStatus = newStatus.status.reduce(
                (acc, currentStatus) => {
                    acc[currentStatus.id] = currentStatus.max;
                    return acc;
                },
                {} as { [key: string]: number },
            ); // 這裡明確宣告了物件的型別

            form.value.before = newBeforeStatus;
            form.value.after = newBeforeStatus;

            if (craftmanUpgrade.value) {
                const craftmanUpgradeTableData = craftmanUpgrade.value.abilities.reduce(
                    (acc, currentStatus) => {
                        if ("min" in currentStatus && "max" in currentStatus) {
                            acc[currentStatus.id] = currentStatus.max;
                            return acc;
                        }
                        return {};
                    },
                    {} as { [key: string]: number },
                );
                form.value.craftmanUpgradeArray = craftmanUpgradeTableData;
            }
        }
    },
    { immediate: true },
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
    { immediate: true, deep: true },
);
</script>
