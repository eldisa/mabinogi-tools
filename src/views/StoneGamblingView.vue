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

        <!-- 設定對話框 -->
        <el-dialog v-model="settingsDialogVisible" title="設定" width="95%" class="max-w-2xl">
            <div class="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
                <!-- 月餅價格 -->
                <div>
                    <p class="text-gray-400 text-sm mb-2">月餅價格</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                        <el-button
                            v-for="price in stonePricePresets"
                            :key="price"
                            :type="tempStonePrice === price ? 'primary' : 'default'"
                            size="small"
                            @click="tempStonePrice = price"
                        >
                            {{ price / 100_000_000 }} 億
                        </el-button>
                    </div>
                    <el-input
                        v-model.number="tempStonePriceInYi"
                        type="number"
                        placeholder="自訂價格"
                        class="settings-input"
                    >
                        <template #append>億</template>
                    </el-input>
                </div>

                <!-- 自動化設定 -->
                <div class="border-t border-gray-700 pt-4">
                    <p class="text-gray-300 font-medium mb-3">自動化設定</p>

                    <!-- 自動充值 -->
                    <div class="flex items-center justify-between mb-4">
                        <div>
                            <p class="text-sm text-gray-300">自動充值</p>
                            <p class="text-xs text-gray-500">餘額不足時自動充值 100 億</p>
                        </div>
                        <el-switch v-model="tempAutoRecharge" />
                    </div>

                    <!-- 自動停止次數 -->
                    <div class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                            <p class="text-sm text-gray-300">自動停止次數</p>
                            <span class="text-accent font-bold">{{ tempAutoStopCount === 0 ? '不限' : tempAutoStopCount }}</span>
                        </div>
                        <el-slider v-model="tempAutoStopCount" :min="0" :max="10000" :step="100" :show-tooltip="false" />
                        <p class="text-xs text-gray-500 mt-1">執行指定次數後自動停止（0 = 不限制）</p>
                    </div>

                    <!-- 顯示項目設定 -->
                    <div class="mb-4">
                        <p class="text-sm text-gray-300 mb-2">歷史紀錄顯示</p>
                        <el-radio-group v-model="tempDisplayMode" size="small">
                            <el-radio-button value="all">全部</el-radio-button>
                            <el-radio-button value="highROI">高回報率</el-radio-button>
                            <el-radio-button value="none">不顯示</el-radio-button>
                        </el-radio-group>
                        <p class="text-xs text-gray-500 mt-1">控制「全部」和「售出」tab 顯示的項目</p>
                    </div>

                    <!-- 機率模式設定 -->
                    <div class="mb-4">
                        <p class="text-sm text-gray-300 mb-2">等級機率模式</p>
                        <el-select v-model="tempProbabilityMode" class="!w-full" placeholder="選擇機率模式">
                            <el-option
                                v-for="(config, mode) in PROBABILITY_CONFIGS"
                                :key="mode"
                                :value="mode"
                                :label="config.name"
                            />
                        </el-select>
                        <div class="mt-2 p-2 bg-gray-700/50 rounded text-xs">
                            <p class="text-gray-400 mb-1">各等級機率：</p>
                            <div class="grid grid-cols-5 gap-1">
                                <div v-for="(weight, idx) in PROBABILITY_CONFIGS[tempProbabilityMode].weights" :key="idx" class="text-center">
                                    <span class="text-gray-500">Lv{{ idx + 1 }}</span>
                                    <p class="text-accent font-medium">{{ weight.toFixed(2) }}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 保留清單 -->
                <div class="border-t border-gray-700 pt-4">
                    <p class="text-gray-300 font-medium mb-3">保留清單</p>
                    <p class="text-xs text-gray-500 mb-3">設定各技能的最低保留等級，低於該等級將自動出售</p>

                    <div class="space-y-4">
                        <div v-for="(skills, job) in skillsByJob" :key="job" class="bg-gray-800/50 rounded-lg p-3">
                            <p class="text-sm font-medium text-accent mb-2">{{ job }}</p>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
                                <div
                                    v-for="skill in skills"
                                    :key="skill.id"
                                    class="flex items-center justify-between bg-gray-700/50 rounded px-2 py-1"
                                >
                                    <span class="text-xs text-gray-300 truncate flex-1 mr-2">{{
                                        skill.skillLocalName
                                    }}</span>
                                    <el-select
                                        v-model="tempRetentionMap[skill.id]"
                                        size="small"
                                        class="!w-20"
                                        placeholder="賣"
                                    >
                                        <el-option :value="0" label="賣" />
                                        <el-option v-for="lv in 10" :key="lv" :value="lv" :label="`≥${lv}`" />
                                    </el-select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <el-button @click="settingsDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmSettings">確認</el-button>
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
                        :disabled="!store.canAfford(store.stonePrice * buyCount)"
                        @click="buyStones"
                    >
                        購買 {{ buyCount }} 個（{{ formatGold(store.stonePrice * buyCount) }}）
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
                            {{ formatGold(store.stonePrice * buyCount) }}
                        </p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">購買後餘額</p>
                        <p
                            class="text-lg font-bold"
                            :class="
                                store.canAfford(store.stonePrice * buyCount)
                                    ? 'text-green-400'
                                    : 'text-red-400'
                            "
                        >
                            {{
                                store.canAfford(store.stonePrice * buyCount)
                                    ? formatGold(store.balance - store.stonePrice * buyCount)
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
                <el-button class="!flex-1" @click="showSettingsDialog">設定</el-button>
            </div>

            <!-- Auto 模式按鈕 -->
            <el-button
                :type="isAutoRunning ? 'danger' : 'success'"
                size="large"
                class="!w-full !font-bold"
                @click="toggleAutoRun"
            >
                {{ isAutoRunning ? "停止自動" : "開始自動" }}
            </el-button>

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
                            <span class="text-sm">全部 ({{ displayedHistory.length }})</span>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="收藏" name="collected">
                        <template #label>
                            <span class="text-sm">收藏 ({{ store.collectedItems.length }})</span>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="售出" name="sold">
                        <template #label>
                            <span class="text-sm">售出 ({{ displayedSoldItems.length }})</span>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="報表" name="report">
                        <template #label>
                            <span class="text-sm">📊</span>
                        </template>
                    </el-tab-pane>
                </el-tabs>

                <!-- 歷史紀錄列表 -->
                <div v-if="activeTab !== 'report'" class="space-y-2 max-h-60 overflow-y-auto">
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
                                @click="sellCollected(record)"
                            >
                                售
                            </el-button>
                        </div>
                    </div>
                    <div v-if="filteredHistory.length === 0" class="text-center text-gray-400 py-4 text-sm">
                        暫無紀錄
                    </div>
                </div>

                <!-- 報表內容 (手機版) -->
                <div v-else class="space-y-3 max-h-60 overflow-y-auto text-sm">
                    <!-- 運氣評價 -->
                    <div class="text-center p-3 rounded-lg" :class="luckRating.bgClass">
                        <p class="text-xl font-bold">{{ luckRating.emoji }} {{ luckRating.title }}</p>
                        <p class="text-xs opacity-80">{{ luckRating.description }}</p>
                    </div>

                    <!-- 等級分佈 -->
                    <div class="grid grid-cols-5 gap-1">
                        <div
                            v-for="lv in 10"
                            :key="lv"
                            class="text-center p-1 rounded"
                            :class="lv >= 9 ? 'bg-yellow-500/20' : 'bg-gray-700/50'"
                        >
                            <p class="text-xs text-gray-400">{{ lv }}</p>
                            <p class="font-bold text-sm" :class="lv >= 9 ? 'text-yellow-400' : 'text-white'">
                                {{ reportData.levelDist[lv] || 0 }}
                            </p>
                        </div>
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
                            :disabled="!store.canAfford(store.stonePrice * buyCount)"
                            @click="buyStones"
                        >
                            購買 {{ buyCount }} 個（{{ formatGold(store.stonePrice * buyCount) }}）
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
                        <el-button class="!flex-1" @click="showSettingsDialog">設定</el-button>
                    </div>

                    <!-- Auto 模式按鈕 -->
                    <el-button
                        :type="isAutoRunning ? 'danger' : 'success'"
                        size="large"
                        class="!w-full !font-bold"
                        @click="toggleAutoRun"
                    >
                        {{ isAutoRunning ? "停止自動" : "開始自動" }}
                    </el-button>
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
                                    <span>全部 ({{ displayedHistory.length }})</span>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="收藏" name="collected">
                                <template #label>
                                    <span>收藏 ({{ store.collectedItems.length }})</span>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="售出" name="sold">
                                <template #label>
                                    <span>售出 ({{ displayedSoldItems.length }})</span>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="報表" name="report">
                                <template #label>
                                    <span>📊 報表</span>
                                </template>
                            </el-tab-pane>
                        </el-tabs>

                        <!-- 歷史紀錄列表 -->
                        <div v-if="activeTab !== 'report'" class="space-y-2 max-h-96 overflow-y-auto">
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
                                        @click="sellCollected(record)"
                                    >
                                        出售
                                    </el-button>
                                </div>
                            </div>
                            <div v-if="filteredHistory.length === 0" class="text-center text-gray-400 py-8">
                                暫無紀錄
                            </div>
                        </div>

                        <!-- 報表內容 -->
                        <div v-else class="space-y-4 max-h-96 overflow-y-auto">
                            <!-- 運氣評價 -->
                            <div class="text-center p-4 rounded-lg" :class="luckRating.bgClass">
                                <p class="text-2xl font-bold mb-1">{{ luckRating.emoji }} {{ luckRating.title }}</p>
                                <p class="text-sm opacity-80">{{ luckRating.description }}</p>
                                <p class="text-xs mt-2 opacity-60">
                                    高等級率: {{ luckRating.highLevelRate.toFixed(1) }}% |
                                    平均等級: {{ luckRating.avgLevel.toFixed(2) }}
                                </p>
                            </div>

                            <!-- 等級分佈 -->
                            <div>
                                <p class="text-sm font-medium text-gray-300 mb-2">等級分佈</p>
                                <div class="grid grid-cols-5 gap-1">
                                    <div
                                        v-for="lv in 10"
                                        :key="lv"
                                        class="text-center p-2 rounded"
                                        :class="lv >= 9 ? 'bg-yellow-500/20' : lv >= 6 ? 'bg-blue-500/20' : 'bg-gray-700/50'"
                                    >
                                        <p class="text-xs text-gray-400">Lv.{{ lv }}</p>
                                        <p class="font-bold" :class="lv >= 9 ? 'text-yellow-400' : 'text-white'">
                                            {{ reportData.levelDist[lv] || 0 }}
                                        </p>
                                        <p class="text-xs text-gray-500">
                                            {{ ((reportData.levelDist[lv] || 0) / Math.max(store.history.length, 1) * 100).toFixed(1) }}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- 職業分佈 -->
                            <div>
                                <p class="text-sm font-medium text-gray-300 mb-2">職業分佈</p>
                                <div class="grid grid-cols-2 gap-2">
                                    <div
                                        v-for="(count, job) in reportData.jobDist"
                                        :key="job"
                                        class="flex justify-between items-center p-2 bg-gray-700/50 rounded"
                                    >
                                        <span class="text-sm text-gray-300">{{ job }}</span>
                                        <span class="text-accent font-bold">{{ count }}</span>
                                    </div>
                                </div>
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
import { useGambleStore, ECONOMY_CONFIG, PROBABILITY_CONFIGS, type AppraisalRecord, type DisplayMode, type ProbabilityMode } from "../stores/gamble";
import { stoneAbilities, type AbilityOption } from "../data/stoneData";

const store = useGambleStore();
const baseUrl = import.meta.env.BASE_URL;

// 充值相關
const rechargeDialogVisible = ref(false);
const rechargeAmount = ref(5_000_000_000);
const rechargePresets = [1_000_000_000, 5_000_000_000, 10_000_000_000, 50_000_000_000]; // 10億, 50億, 100億, 500億

// 設定相關
const settingsDialogVisible = ref(false);
const tempStonePrice = ref(store.stonePrice);
const tempAutoRecharge = ref(store.autoRecharge);
const tempMinROI = ref(store.minROI);
const tempAutoStopCount = ref(store.autoStopCount);
const tempDisplayMode = ref(store.displayMode);
const tempProbabilityMode = ref<ProbabilityMode>(store.probabilityMode || "equal");
const tempRetentionMap = ref<Record<number, number>>({});
const stonePricePresets = [300_000_000, 500_000_000, 700_000_000, 1_000_000_000]; // 3億, 5億, 7億, 10億

// 按職業分組的技能列表
const skillsByJob = computed(() => {
    const grouped: Record<string, AbilityOption[]> = {};
    for (const skill of stoneAbilities) {
        if (!grouped[skill.job]) {
            grouped[skill.job] = [];
        }
        grouped[skill.job].push(skill);
    }
    return grouped;
});

// 用於輸入框的億單位轉換
const tempStonePriceInYi = computed({
    get: () => tempStonePrice.value / 100_000_000,
    set: (val: number) => {
        tempStonePrice.value = Math.max(1, val) * 100_000_000;
    },
});

// 購買數量
const buyCount = ref(1);

// 自動執行模式
const isAutoRunning = ref(false);
const autoRunInterval = ref<ReturnType<typeof setInterval> | null>(null);
const autoRunCount = ref(0); // 當前執行次數
const AUTO_RECHARGE_AMOUNT = 10_000_000_000; // 自動充值 100 億

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

// 根據顯示模式過濾的歷史紀錄
const displayedHistory = computed(() => {
    if (store.displayMode === "none") return [];
    if (store.displayMode === "highROI") {
        return store.history.filter((r) => calculateROI(r.value) >= store.minROI);
    }
    return store.history;
});

const displayedSoldItems = computed(() => {
    if (store.displayMode === "none") return [];
    if (store.displayMode === "highROI") {
        return store.soldItems.filter((r) => calculateROI(r.value) >= store.minROI);
    }
    return store.soldItems;
});

// 篩選後的歷史紀錄
const filteredHistory = computed(() => {
    switch (activeTab.value) {
        case "collected":
            return store.collectedItems;
        case "sold":
            return displayedSoldItems.value;
        default:
            return displayedHistory.value;
    }
});

// 報表數據
const reportData = computed(() => {
    const levelDist: Record<number, number> = {};
    const jobDist: Record<string, number> = {};

    for (const record of store.history) {
        // 等級分佈
        levelDist[record.level] = (levelDist[record.level] || 0) + 1;
        // 職業分佈
        jobDist[record.ability.job] = (jobDist[record.ability.job] || 0) + 1;
    }

    return { levelDist, jobDist };
});

// 運氣評價
const luckRating = computed(() => {
    const total = store.history.length;
    if (total === 0) {
        return {
            emoji: "🎲",
            title: "尚無數據",
            description: "開始鑑定來看看你的運氣！",
            bgClass: "bg-gray-700",
            highLevelRate: 0,
            avgLevel: 0,
        };
    }

    // 計算高等級 (Lv 8-10) 比率
    const highLevelCount = store.history.filter((r) => r.level >= 8).length;
    const highLevelRate = (highLevelCount / total) * 100;

    // 計算平均等級
    const avgLevel = store.history.reduce((sum, r) => sum + r.level, 0) / total;

    // 理論機率: Lv 8-10 約 23.34% (8.34 + 10 + 5)
    // 歐洲貴族: > 30% (遠超理論值)
    // 亞洲平民: 18-30% (接近理論值)
    // 非洲難民: < 18% (低於理論值)

    if (highLevelRate > 30) {
        return {
            emoji: "👑",
            title: "歐洲貴族",
            description: "運氣逆天！高等級出貨率驚人！",
            bgClass: "bg-gradient-to-r from-yellow-600/30 to-amber-500/30",
            highLevelRate,
            avgLevel,
        };
    } else if (highLevelRate >= 18) {
        return {
            emoji: "🙂",
            title: "亞洲平民",
            description: "運氣正常，符合統計預期",
            bgClass: "bg-gradient-to-r from-blue-600/30 to-cyan-500/30",
            highLevelRate,
            avgLevel,
        };
    } else {
        return {
            emoji: "😭",
            title: "非洲難民",
            description: "運氣欠佳，高等級出貨率偏低...",
            bgClass: "bg-gradient-to-r from-gray-600/30 to-slate-500/30",
            highLevelRate,
            avgLevel,
        };
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

// 根據權重隨機選擇等級
function rollLevel(): number {
    const mode = store.probabilityMode || "equal"; // 預設使用平均機率
    const weights = PROBABILITY_CONFIGS[mode].weights;
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            return i + 1; // 等級從 1 開始
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
    return store.stonePrice / ECONOMY_CONFIG.BASE_STONE_PRICE;
}

// 計算實際價值
function calculateValue(ability: AbilityOption, level: number): number {
    const basePrice = ability.prices[level - 1] * 10000; // prices 單位是萬 Gold，轉為 Gold
    return Math.round(basePrice * getPriceMultiplier());
}

// 計算回報率 (ROI)
function calculateROI(value: number): number {
    const cost = store.stonePrice + ECONOMY_CONFIG.APPRAISAL_FEE;
    return (value / cost) * 100;
}

// 判斷是否應該保留（只根據保留清單）
function shouldKeep(result: AppraisalRecord): boolean {
    // 只檢查保留清單
    const retentionLevel = store.getRetentionLevel(result.ability.id);
    if (retentionLevel > 0 && result.level >= retentionLevel) {
        return true;
    }
    return false;
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

        // 根據設定判斷預設狀態
        const tempResult = { ability, level, value } as AppraisalRecord;
        const defaultStatus = shouldKeep(tempResult) ? "collected" : "sold";

        results.push({
            id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2)}`,
            timestamp: Date.now(),
            ability,
            level,
            value,
            status: defaultStatus,
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

// 出售收藏項目（不需確認）
function sellCollected(record: AppraisalRecord) {
    if (store.sellCollectedItem(record.id)) {
        ElMessage({ message: `+${formatGold(record.value)}`, type: "success", duration: 1500 });
    }
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

// 顯示設定對話框
function showSettingsDialog() {
    tempStonePrice.value = store.stonePrice;
    tempAutoRecharge.value = store.autoRecharge;
    tempMinROI.value = store.minROI;
    tempAutoStopCount.value = store.autoStopCount;
    tempDisplayMode.value = store.displayMode;
    tempProbabilityMode.value = store.probabilityMode || "equal";
    // 初始化保留清單 map
    const map: Record<number, number> = {};
    for (const skill of stoneAbilities) {
        map[skill.id] = store.getRetentionLevel(skill.id);
    }
    tempRetentionMap.value = map;
    settingsDialogVisible.value = true;
}

// 確認設定
function confirmSettings() {
    store.setStonePrice(tempStonePrice.value);
    store.setAutoRecharge(tempAutoRecharge.value);
    store.setMinROI(tempMinROI.value);
    store.setAutoStopCount(tempAutoStopCount.value);
    store.setDisplayMode(tempDisplayMode.value);
    store.setProbabilityMode(tempProbabilityMode.value);
    // 儲存保留清單
    for (const [skillId, minLevel] of Object.entries(tempRetentionMap.value)) {
        store.setRetentionItem(Number(skillId), minLevel);
    }
    settingsDialogVisible.value = false;
    ElMessage({ message: "設定已儲存", type: "success", duration: 1500 });
}

// ==================== 自動執行模式 ====================

// 自動執行一輪
function autoRunOnce() {
    // 0. 檢查停止條件
    if (store.autoStopCount > 0 && autoRunCount.value >= store.autoStopCount) {
        stopAutoRun();
        ElMessage.success(`已執行 ${autoRunCount.value} 次，自動停止`);
        return;
    }

    // 1. 檢查是否需要自動充值
    const minRequired = store.stonePrice + ECONOMY_CONFIG.APPRAISAL_FEE;
    if (!store.canAfford(minRequired)) {
        if (store.autoRecharge) {
            store.add(AUTO_RECHARGE_AMOUNT);
        } else {
            // 餘額不足且未開啟自動充值，停止自動模式
            stopAutoRun();
            ElMessage.warning("餘額不足，自動模式已停止");
            return;
        }
    }

    // 2. 購買 1 個月餅
    if (!store.buyStones(1)) {
        stopAutoRun();
        ElMessage.warning("購買失敗，自動模式已停止");
        return;
    }

    // 3. 鑑定
    const totalFee = ECONOMY_CONFIG.APPRAISAL_FEE;
    if (!store.canAfford(totalFee)) {
        if (store.autoRecharge) {
            store.add(AUTO_RECHARGE_AMOUNT);
        } else {
            stopAutoRun();
            ElMessage.warning("餘額不足，自動模式已停止");
            return;
        }
    }

    store.appraiseStones(1);

    // 生成鑑定結果
    const ability = rollAbility();
    const level = rollLevel();
    const value = calculateValue(ability, level);

    const result: AppraisalRecord = {
        id: `${Date.now()}-auto-${Math.random().toString(36).slice(2)}`,
        timestamp: Date.now(),
        ability,
        level,
        value,
        status: shouldKeep({ ability, level, value } as AppraisalRecord) ? "collected" : "sold",
    };

    // 4. 根據設定決定保留或出售
    store.addRecord(result);
    if (result.status === "sold") {
        store.add(value);
    }

    // 5. 計數器增加
    autoRunCount.value++;
}

// 開始自動執行
function startAutoRun() {
    if (isAutoRunning.value) return;

    isAutoRunning.value = true;
    autoRunCount.value = 0; // 重置計數器
    // 每 100ms 執行一輪
    autoRunInterval.value = setInterval(() => {
        autoRunOnce();
    }, 100);
}

// 停止自動執行
function stopAutoRun() {
    if (autoRunInterval.value) {
        clearInterval(autoRunInterval.value);
        autoRunInterval.value = null;
    }
    isAutoRunning.value = false;
}

// 切換自動執行
function toggleAutoRun() {
    if (isAutoRunning.value) {
        stopAutoRun();
    } else {
        startAutoRun();
    }
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

/* 設定輸入框 */
.settings-input :deep(.el-input__wrapper) {
    background-color: #374151 !important;
    box-shadow: none !important;
}

.settings-input :deep(.el-input__inner) {
    color: #fff !important;
}

.settings-input :deep(.el-input-group__append) {
    background-color: #4b5563 !important;
    color: #fff !important;
    border: none !important;
    box-shadow: none !important;
}
</style>
