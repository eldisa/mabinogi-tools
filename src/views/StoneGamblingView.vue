<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 p-3 md:p-6 bg-texture-dark overflow-x-hidden">
        <!-- 充值對話框 -->
        <el-dialog v-model="rechargeDialogVisible" title="充值 Gold" width="90%" class="max-w-md">
            <div class="space-y-4">
                <p class="text-gray-400 text-sm">選擇充值金額</p>
                <div class="flex flex-wrap gap-2">
                    <el-button
                        v-for="amount in rechargePresets"
                        :key="amount"
                        :type="rechargeAmount === amount ? 'primary' : 'default'"
                        @click="rechargeAmount = amount"
                    >
                        {{ formatGold(amount) }}
                    </el-button>
                </div>
            </div>
            <template #footer>
                <el-button @click="rechargeDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmRecharge">確認充值</el-button>
            </template>
        </el-dialog>

        <!-- ==================== Mobile Layout (<768px) ==================== -->
        <div class="md:hidden space-y-3">
            <!-- 1. 資源概覽 Card -->
            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="relative">
                            <img
                                :src="stoneImage"
                                alt="月餅"
                                class="w-14 h-14 object-contain"
                                :class="{ 'animate-pulse': store.unappraised > 0 }"
                            />
                            <div
                                v-if="store.unappraised > 0"
                                class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                            >
                                {{ store.unappraised }}
                            </div>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400">餘額</p>
                            <p class="text-xl font-bold text-accent">{{ formatGold(store.balance) }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">未鑑定</p>
                        <p class="text-xl font-bold text-orange-400">{{ store.unappraised }}</p>
                    </div>
                </div>
            </el-card>

            <!-- 2. 操作 Card -->
            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="space-y-4">
                    <!-- 數量調整區 -->
                    <div class="flex items-center justify-center gap-3">
                        <el-button
                            circle
                            size="large"
                            :disabled="buyCount <= 1"
                            @click="buyCount = Math.max(1, buyCount - 1)"
                        >
                            <span class="text-xl font-bold">−</span>
                        </el-button>
                        <span class="text-2xl font-bold w-20 text-center">{{ buyCount }}</span>
                        <el-button
                            circle
                            size="large"
                            :disabled="buyCount >= 99999"
                            @click="buyCount = Math.min(99999, buyCount + 1)"
                        >
                            <span class="text-xl font-bold">+</span>
                        </el-button>
                    </div>

                    <!-- 購買按鈕 (主 CTA) -->
                    <el-button
                        type="warning"
                        size="large"
                        class="!w-full !h-14 !text-lg !font-bold"
                        :disabled="!store.canAfford(ECONOMY_CONFIG.STONE_PRICE * buyCount)"
                        @click="buyStones"
                    >
                        購買 {{ buyCount }} 個（{{ formatGold(ECONOMY_CONFIG.STONE_PRICE * buyCount) }}）
                    </el-button>

                    <!-- 鑑定按鈕 -->
                    <div v-if="store.unappraised > 0" class="flex gap-2">
                        <el-button
                            type="primary"
                            class="!flex-1"
                            :disabled="!canAppraise(1)"
                            @click="appraiseStones(1)"
                        >
                            鑑定 1
                        </el-button>
                        <el-button
                            v-if="store.unappraised >= 10"
                            type="primary"
                            class="!flex-1"
                            :disabled="!canAppraise(10)"
                            @click="appraiseStones(10)"
                        >
                            鑑定 10
                        </el-button>
                        <el-button
                            type="primary"
                            class="!flex-1"
                            :disabled="!canAppraise(store.unappraised)"
                            @click="appraiseStones(store.unappraised)"
                        >
                            全部 ({{ store.unappraised }})
                        </el-button>
                    </div>
                </div>
            </el-card>

            <!-- 3. 成本回饋 Card -->
            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="flex justify-between items-center">
                    <div>
                        <p class="text-xs text-gray-400">本次花費</p>
                        <p class="text-lg font-bold text-red-400">
                            {{ formatGold(ECONOMY_CONFIG.STONE_PRICE * buyCount) }}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">購買後餘額</p>
                        <p
                            class="text-lg font-bold"
                            :class="
                                store.canAfford(ECONOMY_CONFIG.STONE_PRICE * buyCount)
                                    ? 'text-green-400'
                                    : 'text-red-400'
                            "
                        >
                            {{
                                store.canAfford(ECONOMY_CONFIG.STONE_PRICE * buyCount)
                                    ? formatGold(store.balance - ECONOMY_CONFIG.STONE_PRICE * buyCount)
                                    : "餘額不足"
                            }}
                        </p>
                    </div>
                </div>
            </el-card>

            <!-- 4. 次要操作 Row -->
            <div class="flex gap-2">
                <el-button class="!flex-1" @click="showRechargeDialog">充值</el-button>
                <el-button class="!flex-1" type="danger" plain @click="confirmReset">重置</el-button>
            </div>

            <!-- 統計資訊 -->
            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <div class="grid grid-cols-4 gap-2 text-center">
                    <div>
                        <p class="text-xs text-gray-400">鑑定</p>
                        <p class="text-base font-bold text-white">{{ store.history.length }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">收藏</p>
                        <p class="text-base font-bold text-blue-400">{{ store.collectedItems.length }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">花費</p>
                        <p class="text-base font-bold text-red-400">{{ formatGold(store.totalSpent) }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">收入</p>
                        <p class="text-base font-bold text-green-400">{{ formatGold(store.totalEarned) }}</p>
                    </div>
                </div>
            </el-card>

            <!-- 鑑定紀錄 -->
            <el-card v-if="store.history.length > 0" class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                <el-tabs v-model="activeTab" class="history-tabs">
                    <el-tab-pane label="全部" name="all">
                        <template #label>
                            <span class="text-sm">全部 ({{ store.history.length }})</span>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="收藏" name="collected">
                        <template #label>
                            <span class="text-sm">收藏 ({{ store.collectedItems.length }})</span>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="售出" name="sold">
                        <template #label>
                            <span class="text-sm">售出 ({{ store.soldItems.length }})</span>
                        </template>
                    </el-tab-pane>
                </el-tabs>

                <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                        v-for="record in filteredHistory"
                        :key="record.id"
                        class="flex items-center justify-between p-2 bg-gray-700/50 rounded-lg text-sm"
                    >
                        <div class="flex-1 min-w-0">
                            <p class="text-xs text-gray-400">{{ record.ability.job }}</p>
                            <p class="font-medium result-text truncate text-sm">
                                {{ record.ability.skillLocalName }} Lv.{{ record.level }}
                            </p>
                        </div>
                        <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                            <span
                                class="text-xs"
                                :class="record.status === 'collected' ? 'text-blue-400' : 'text-green-400'"
                            >
                                {{ record.status === "collected" ? "收藏" : formatGold(record.value) }}
                            </span>
                            <el-button
                                v-if="record.status === 'collected'"
                                type="success"
                                size="small"
                                @click="confirmSellCollected(record)"
                            >
                                售
                            </el-button>
                        </div>
                    </div>
                    <div v-if="filteredHistory.length === 0" class="text-center text-gray-400 py-4 text-sm">
                        暫無紀錄
                    </div>
                </div>
            </el-card>
        </div>

        <!-- ==================== Desktop Layout (>=768px) ==================== -->
        <div class="hidden md:block max-w-5xl mx-auto">
            <div class="flex gap-6">
                <!-- Left: 操作區 -->
                <div class="w-80 flex-shrink-0 space-y-4">
                    <!-- 月餅 + 操作 -->
                    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                        <div class="flex items-center gap-4 mb-5">
                            <div class="relative">
                                <img
                                    :src="stoneImage"
                                    alt="月餅"
                                    class="w-20 h-20 object-contain"
                                    :class="{ 'animate-pulse': store.unappraised > 0 }"
                                />
                                <div
                                    v-if="store.unappraised > 0"
                                    class="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                                >
                                    {{ store.unappraised }}
                                </div>
                            </div>
                            <div>
                                <p class="text-sm text-gray-400">餘額</p>
                                <p class="text-2xl font-bold text-accent">{{ formatGold(store.balance) }}</p>
                            </div>
                        </div>

                        <!-- 數量調整 -->
                        <div class="flex items-center gap-3 mb-4">
                            <el-button circle :disabled="buyCount <= 1" @click="buyCount = Math.max(1, buyCount - 1)">
                                <span class="text-lg font-bold">−</span>
                            </el-button>
                            <el-input
                                v-model.number="buyCount"
                                type="number"
                                class="buy-count-input !w-28"
                                :min="1"
                                :max="99999"
                                @blur="buyCount = Math.min(99999, Math.max(1, buyCount))"
                            />
                            <el-button
                                circle
                                :disabled="buyCount >= 99999"
                                @click="buyCount = Math.min(99999, buyCount + 1)"
                            >
                                <span class="text-lg font-bold">+</span>
                            </el-button>
                        </div>

                        <!-- 購買按鈕 -->
                        <el-button
                            type="warning"
                            size="large"
                            class="!w-full !font-bold !mb-3"
                            :disabled="!store.canAfford(ECONOMY_CONFIG.STONE_PRICE * buyCount)"
                            @click="buyStones"
                        >
                            購買 {{ buyCount }} 個（{{ formatGold(ECONOMY_CONFIG.STONE_PRICE * buyCount) }}）
                        </el-button>

                        <!-- 鑑定按鈕 -->
                        <div v-if="store.unappraised > 0" class="flex gap-2">
                            <el-button
                                type="primary"
                                class="!flex-1"
                                :disabled="!canAppraise(1)"
                                @click="appraiseStones(1)"
                            >
                                鑑定 1
                            </el-button>
                            <el-button
                                v-if="store.unappraised >= 10"
                                type="primary"
                                class="!flex-1"
                                :disabled="!canAppraise(10)"
                                @click="appraiseStones(10)"
                            >
                                鑑定 10
                            </el-button>
                            <el-button
                                type="primary"
                                class="!flex-1"
                                :disabled="!canAppraise(store.unappraised)"
                                @click="appraiseStones(store.unappraised)"
                            >
                                全部
                            </el-button>
                        </div>
                    </el-card>

                    <!-- 次要操作 -->
                    <div class="flex gap-2">
                        <el-button class="!flex-1" @click="showRechargeDialog">充值</el-button>
                        <el-button class="!flex-1" type="danger" plain @click="confirmReset">重置</el-button>
                    </div>
                </div>

                <!-- Right: 結果區 -->
                <div class="flex-1 space-y-4">
                    <!-- 統計 -->
                    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
                        <div class="grid grid-cols-4 gap-4 text-center">
                            <div>
                                <p class="text-xs text-gray-400">花費</p>
                                <p class="text-xl font-bold text-red-400">{{ formatGold(store.totalSpent) }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400">收入</p>
                                <p class="text-xl font-bold text-green-400">{{ formatGold(store.totalEarned) }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400">鑑定</p>
                                <p class="text-xl font-bold text-white">{{ store.history.length }}</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400">收藏</p>
                                <p class="text-xl font-bold text-blue-400">{{ store.collectedItems.length }}</p>
                            </div>
                        </div>
                    </el-card>

                    <!-- 鑑定紀錄 -->
                    <el-card
                        v-if="store.history.length > 0"
                        class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl"
                    >
                        <el-tabs v-model="activeTab" class="history-tabs">
                            <el-tab-pane label="全部" name="all">
                                <template #label>
                                    <span>全部 ({{ store.history.length }})</span>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="收藏" name="collected">
                                <template #label>
                                    <span>收藏 ({{ store.collectedItems.length }})</span>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="售出" name="sold">
                                <template #label>
                                    <span>售出 ({{ store.soldItems.length }})</span>
                                </template>
                            </el-tab-pane>
                        </el-tabs>

                        <div class="space-y-2 max-h-96 overflow-y-auto">
                            <div
                                v-for="record in filteredHistory"
                                :key="record.id"
                                class="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg"
                            >
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-400">{{ record.ability.job }}</p>
                                    <p class="font-medium result-text truncate">
                                        {{ formatAbilityText(record.ability, record.level) }}
                                    </p>
                                </div>
                                <div class="flex items-center gap-3 ml-2">
                                    <div class="text-right">
                                        <p class="text-accent font-bold">Lv.{{ record.level }}</p>
                                        <p
                                            class="text-sm"
                                            :class="record.status === 'collected' ? 'text-blue-400' : 'text-green-400'"
                                        >
                                            {{ record.status === "collected" ? "收藏" : formatGold(record.value) }}
                                        </p>
                                    </div>
                                    <el-button
                                        v-if="record.status === 'collected'"
                                        type="success"
                                        size="small"
                                        @click="confirmSellCollected(record)"
                                    >
                                        出售
                                    </el-button>
                                </div>
                            </div>
                            <div v-if="filteredHistory.length === 0" class="text-center text-gray-400 py-8">
                                暫無紀錄
                            </div>
                        </div>
                    </el-card>
                </div>
            </div>
        </div>

        <!-- ==================== 鑑定結果對話框 ==================== -->
        <el-dialog
            v-model="appraiseDialogVisible"
            title="鑑定結果"
            width="90%"
            class="max-w-lg"
            :close-on-click-modal="false"
        >
            <div class="space-y-2 max-h-[50vh] overflow-y-auto">
                <div
                    v-for="result in pendingResults"
                    :key="result.id"
                    class="flex items-center justify-between p-2 rounded-lg"
                    :class="
                        result.status === 'collected' ? 'bg-blue-900/30 border border-blue-500/50' : 'bg-gray-700/50'
                    "
                >
                    <div class="flex-1 min-w-0">
                        <p class="text-xs text-gray-400">{{ result.ability.job }}</p>
                        <p class="text-sm font-medium result-text truncate">
                            {{ result.ability.skillLocalName }} Lv.{{ result.level }}
                        </p>
                    </div>
                    <div class="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span class="text-sm text-green-400">{{ formatGold(result.value) }}</span>
                        <el-button-group size="small" class="status-btn-group">
                            <el-button
                                :type="result.status === 'sold' ? 'success' : 'default'"
                                :class="{ 'is-active': result.status === 'sold' }"
                                @click="result.status = 'sold'"
                            >
                                售
                            </el-button>
                            <el-button
                                :type="result.status === 'collected' ? 'primary' : 'default'"
                                :class="{ 'is-active': result.status === 'collected' }"
                                @click="result.status = 'collected'"
                            >
                                藏
                            </el-button>
                        </el-button-group>
                    </div>
                </div>
            </div>
            <div v-if="pendingResults.length > 0" class="mt-3 pt-3 border-t border-gray-700">
                <div class="flex justify-between text-sm text-gray-400">
                    <span>出售: {{ pendingSellCount }} 個</span>
                    <span>收藏: {{ pendingCollectCount }} 個</span>
                </div>
                <p class="text-center text-gray-400 mt-2">
                    出售可得:
                    <span class="text-accent font-bold">{{ formatGold(pendingSellValue) }}</span>
                </p>
            </div>
            <template #footer>
                <div class="flex gap-2">
                    <el-button class="!flex-1" @click="sellAllPending">全部出售</el-button>
                    <el-button class="!flex-1" @click="collectAllPending">全部收藏</el-button>
                    <el-button type="warning" class="!flex-1" @click="confirmPendingResults">確認</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { useGambleStore, ECONOMY_CONFIG, type AppraisalRecord } from "../stores/gamble";
import { stoneAbilities, type AbilityOption } from "../data/stoneData";

const store = useGambleStore();
const baseUrl = import.meta.env.BASE_URL;

// 充值相關
const rechargeDialogVisible = ref(false);
const rechargeAmount = ref(5_000_000_000);
const rechargePresets = [1_000_000_000, 5_000_000_000, 10_000_000_000, 50_000_000_000]; // 10億, 50億, 100億, 500億

// 購買數量
const buyCount = ref(1);

// 鑑定結果對話框
const appraiseDialogVisible = ref(false);
const pendingResults = ref<AppraisalRecord[]>([]);
const latestResults = ref<AppraisalRecord[]>([]);

// 歷史紀錄 Tab
const activeTab = ref("all");

// 月餅圖片
const stoneImage = computed(() => {
    return store.unappraised > 0 ? `${baseUrl}itemImage/3600006.png` : `${baseUrl}itemImage/3600007.png`;
});

// 篩選後的歷史紀錄
const filteredHistory = computed(() => {
    switch (activeTab.value) {
        case "collected":
            return store.collectedItems;
        case "sold":
            return store.soldItems;
        default:
            return store.history;
    }
});

// 待處理結果統計
const pendingTotalValue = computed(() => {
    return pendingResults.value.reduce((sum, r) => sum + r.value, 0);
});
const pendingSellCount = computed(() => {
    return pendingResults.value.filter((r) => r.status === "sold").length;
});
const pendingCollectCount = computed(() => {
    return pendingResults.value.filter((r) => r.status === "collected").length;
});
const pendingSellValue = computed(() => {
    return pendingResults.value.filter((r) => r.status === "sold").reduce((sum, r) => sum + r.value, 0);
});

// 等級權重：Lv 1-5 (60%), Lv 6-8 (25%), Lv 9 (10%), Lv 10 (5%)
const LEVEL_WEIGHTS = [
    { level: 1, weight: 12 },
    { level: 2, weight: 12 },
    { level: 3, weight: 12 },
    { level: 4, weight: 12 },
    { level: 5, weight: 12 },
    { level: 6, weight: 8.33 },
    { level: 7, weight: 8.33 },
    { level: 8, weight: 8.34 },
    { level: 9, weight: 10 },
    { level: 10, weight: 5 },
];

// 根據權重隨機選擇等級
function rollLevel(): number {
    const totalWeight = LEVEL_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of LEVEL_WEIGHTS) {
        random -= item.weight;
        if (random <= 0) {
            return item.level;
        }
    }
    return 1;
}

// 隨機選擇能力
function rollAbility(): AbilityOption {
    const index = Math.floor(Math.random() * stoneAbilities.length);
    return stoneAbilities[index];
}

// 格式化能力文字
function formatAbilityText(ability: AbilityOption, level: number): string {
    const rawValue = ability.parameter * level;
    // 處理浮點數精度問題：根據 parameter 的小數位數決定顯示精度
    const decimalPlaces = ability.parameter < 1 ? 1 : 0;
    const value = Number(rawValue.toFixed(decimalPlaces));
    const unit = ability.parameter >= 1 ? "%" : "";
    const maxUnit = ability.parameter >= 1 ? "%" : "";
    return `${ability.skillLocalName} 增加 ${value}${unit} (上限 ${ability.maxLimit}${maxUnit})`;
}

// 格式化數字
function formatNumber(num: number): string {
    return num.toLocaleString();
}

// 格式化 Gold
function formatGold(gold: number): string {
    if (gold >= 100000000) {
        return `${(gold / 100000000).toFixed(1)} 億`;
    } else if (gold >= 10000) {
        return `${(gold / 10000).toFixed(0)} 萬`;
    }
    return gold.toLocaleString();
}

// 檢查是否能鑑定
function canAppraise(count: number): boolean {
    return store.unappraised >= count && store.canAfford(ECONOMY_CONFIG.APPRAISAL_FEE * count);
}

// 購買月餅
function buyStones() {
    store.buyStones(buyCount.value);
    // 購買成功不顯示通知，UI 已經有即時回饋（數量變化、餘額變化）
}

// 計算價格倍率（根據當前石頭價格與基準價格的比例）
function getPriceMultiplier(): number {
    return ECONOMY_CONFIG.STONE_PRICE / ECONOMY_CONFIG.BASE_STONE_PRICE;
}

// 計算實際價值
function calculateValue(ability: AbilityOption, level: number): number {
    const basePrice = ability.prices[level - 1] * 10000; // prices 單位是萬 Gold，轉為 Gold
    return Math.round(basePrice * getPriceMultiplier());
}

// 鑑定月餅
function appraiseStones(count: number) {
    const actualCount = Math.min(count, store.unappraised);
    const totalFee = actualCount * ECONOMY_CONFIG.APPRAISAL_FEE;

    if (!store.canAfford(totalFee)) {
        ElMessage.error("餘額不足！");
        return;
    }

    // 使用 store 的 appraiseStones 來扣除費用和未鑑定數量
    store.appraiseStones(actualCount);

    // 生成鑑定結果
    const results: AppraisalRecord[] = [];
    for (let i = 0; i < actualCount; i++) {
        const ability = rollAbility();
        const level = rollLevel();
        const value = calculateValue(ability, level);

        results.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
            timestamp: Date.now(),
            ability,
            level,
            value,
            status: "sold", // 預設為售出
        });
    }

    pendingResults.value = results;
    latestResults.value = results.slice(0, 5);
    appraiseDialogVisible.value = true;
    // 移除鑑定時的通知，對話框已經提供完整回饋
}

// 全部標記為出售
function sellAllPending() {
    pendingResults.value.forEach((r) => (r.status = "sold"));
}

// 全部標記為收藏
function collectAllPending() {
    pendingResults.value.forEach((r) => (r.status = "collected"));
}

// 確認鑑定結果
function confirmPendingResults() {
    const sellValue = pendingSellValue.value;
    const collectCount = pendingCollectCount.value;
    const sellCount = pendingSellCount.value;

    store.addRecords(pendingResults.value);
    store.add(sellValue);
    appraiseDialogVisible.value = false;

    // 簡化通知：只顯示一則摘要
    const parts: string[] = [];
    if (sellCount > 0) parts.push(`售 ${sellCount} 個 +${formatGold(sellValue)}`);
    if (collectCount > 0) parts.push(`藏 ${collectCount} 個`);
    if (parts.length > 0) {
        ElMessage({ message: parts.join("，"), type: "success", duration: 2000 });
    }
    pendingResults.value = [];
}

// 確認出售收藏項目
function confirmSellCollected(record: AppraisalRecord) {
    ElMessageBox.confirm(
        `確定要出售「${record.ability.skillLocalName} Lv.${record.level}」嗎？將獲得 ${formatGold(record.value)}`,
        "確認出售",
        {
            confirmButtonText: "出售",
            cancelButtonText: "取消",
            type: "warning",
        },
    )
        .then(() => {
            if (store.sellCollectedItem(record.id)) {
                ElMessage({ message: `+${formatGold(record.value)}`, type: "success", duration: 1500 });
            }
        })
        .catch(() => {
            // 取消操作
        });
}

// 重置確認
function confirmReset() {
    ElMessageBox.confirm("確定要重置所有資料嗎？這將清除所有紀錄並重置餘額。", "警告", {
        confirmButtonText: "確定",
        cancelButtonText: "取消",
        type: "warning",
    })
        .then(() => {
            store.resetBalance();
            latestResults.value = [];
            pendingResults.value = [];
            ElMessage({ message: "已重置", type: "info", duration: 1500 });
        })
        .catch(() => {
            // 取消操作
        });
}

// 顯示充值對話框
function showRechargeDialog() {
    rechargeAmount.value = 5_000_000_000;
    rechargeDialogVisible.value = true;
}

// 確認充值
function confirmRecharge() {
    store.add(rechargeAmount.value);
    rechargeDialogVisible.value = false;
    ElMessage({ message: `+${formatGold(rechargeAmount.value)}`, type: "success", duration: 1500 });
}
</script>

<style scoped>
.result-text {
    color: #ffaa00;
    font-weight: bold;
}

.text-gradient {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.history-tabs :deep(.el-tabs__item) {
    color: #9ca3af;
}

.history-tabs :deep(.el-tabs__item.is-active) {
    color: #fbbf24;
}

.history-tabs :deep(.el-tabs__active-bar) {
    background-color: #fbbf24;
}

/* 鑑定結果按鈕樣式 */
.status-btn-group :deep(.el-button) {
    opacity: 0.5;
    transition: all 0.2s;
}

.status-btn-group :deep(.el-button.is-active) {
    opacity: 1;
    box-shadow: 0 0 8px currentColor;
}

.status-btn-group :deep(.el-button--success.is-active) {
    box-shadow: 0 0 8px #67c23a;
}

.status-btn-group :deep(.el-button--primary.is-active) {
    box-shadow: 0 0 8px #409eff;
}

/* 購買數量輸入框 */
.buy-count-input :deep(.el-input__wrapper) {
    background-color: #374151 !important;
    box-shadow: none !important;
}

.buy-count-input :deep(.el-input__inner) {
    color: #fff !important;
    font-size: 1.125rem;
    font-weight: bold;
    text-align: center;
}

/* 隱藏 number input 的上下箭頭 */
.buy-count-input :deep(.el-input__inner)::-webkit-outer-spin-button,
.buy-count-input :deep(.el-input__inner)::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>
