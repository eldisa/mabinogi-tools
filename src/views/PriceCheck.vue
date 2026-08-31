<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Search, Loading } from "@element-plus/icons-vue";
import {
    fetchDungeonItemPrices,
    fetchMuriasRelicPrices,
    fetchPricesMeta,
    type DungeonItemPrice,
    type MuriasRelicJobPrice,
} from "../api/prices";

const search = ref("");
const loading = ref(true);
const loadError = ref(false);

const itemPrices = ref<DungeonItemPrice[]>([]);
const relicPrices = ref<MuriasRelicJobPrice[]>([]);
const dungeonItemsUpdatedAt = ref<string | null>(null);
const muriasRelicUpdatedAt = ref<string | null>(null);

const formatUpdatedAt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("zh-TW") : "尚未更新");

const filteredItemPrices = computed(() => {
    const q = search.value.trim();
    if (!q) return itemPrices.value;
    return itemPrices.value.filter((item) => item.name.tw.includes(q) || item.name.kr.includes(q));
});

const filteredRelicPrices = computed(() => {
    const q = search.value.trim();
    if (!q) return relicPrices.value;
    return relicPrices.value
        .map((job) => ({
            ...job,
            options: job.options.filter((opt) => opt.name.tw.includes(q) || opt.name.kr.includes(q)),
        }))
        .filter((job) => job.job.kr.includes(q) || job.options.length > 0);
});

const loadPrices = async () => {
    loading.value = true;
    loadError.value = false;
    try {
        const [items, relics] = await Promise.all([fetchDungeonItemPrices(), fetchMuriasRelicPrices()]);
        itemPrices.value = items;
        relicPrices.value = relics;
    } catch {
        loadError.value = true;
    } finally {
        loading.value = false;
    }

    try {
        const meta = await fetchPricesMeta();
        dungeonItemsUpdatedAt.value = meta.dungeonItemsUpdatedAt;
        muriasRelicUpdatedAt.value = meta.muriasRelicUpdatedAt;
    } catch {
        // 更新時間僅供顯示，取得失敗不影響價格資料
    }
};

onMounted(loadPrices);
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-5xl mx-auto">
            <header class="mb-4 text-center pt-8 pb-2">
                <h1
                    class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg flex items-center justify-center gap-3"
                >
                    物價
                    <el-tag type="warning" effect="dark" round size="small">測試中</el-tag>
                </h1>
                <p class="text-base text-gray-400 mt-3">布里萊赫地城掉落物與穆利亞斯遺物選項的市場價格</p>
            </header>

            <el-alert type="warning" :closable="false" show-icon class="mb-4">
                <template #title>
                    <span class="text-sm">
                        資料來源為韓服拍賣場，僅供參考，可能與台服實際行情有落差，且非即時更新。
                    </span>
                </template>
            </el-alert>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="mb-4">
                    <el-input
                        v-model="search"
                        placeholder="搜尋物品或選項名稱…"
                        clearable
                        size="large"
                        style="max-width: 360px"
                        :disabled="loading || loadError"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </div>

                <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-gray-400">
                    <el-icon :size="32" class="animate-spin mb-3"><Loading /></el-icon>
                    載入價格資料中…
                </div>

                <div v-else-if="loadError" class="flex flex-col items-center justify-center py-16 text-gray-400">
                    <p class="mb-3">價格資料載入失敗，可能是後端服務尚未就緒。</p>
                    <el-button type="primary" plain @click="loadPrices">重新載入</el-button>
                </div>

                <el-tabs v-else type="border-card">
                    <el-tab-pane label="布里萊赫地城">
                        <p class="text-xs text-gray-500 mt-3">更新於 {{ formatUpdatedAt(dungeonItemsUpdatedAt) }}</p>
                        <el-table
                            :data="filteredItemPrices"
                            border
                            class="rounded-lg overflow-hidden mt-2"
                            :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                            :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                            empty-text="查無資料"
                        >
                            <el-table-column label="名稱" min-width="220">
                                <template #default="{ row }: { row: DungeonItemPrice }">
                                    <span class="font-semibold text-gray-100">{{ row.name.tw }}</span>
                                    <span v-if="row.name.tw === '未對應'" class="text-xs text-gray-500 ml-2">
                                        {{ row.name.kr }}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="類型" width="100" align="center">
                                <template #default="{ row }: { row: DungeonItemPrice }">
                                    <el-tag size="small">{{ row.type }}</el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="價格" width="150" align="right" sortable prop="price">
                                <template #default="{ row }: { row: DungeonItemPrice }">
                                    <span class="text-accent font-semibold">{{ row.price.toLocaleString() }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>

                    <el-tab-pane label="穆利亞斯遺物">
                        <p class="text-xs text-gray-500 mt-3">更新於 {{ formatUpdatedAt(muriasRelicUpdatedAt) }}</p>
                        <el-collapse class="mt-2">
                            <el-collapse-item v-for="job in filteredRelicPrices" :key="job.job.kr" :name="job.job.kr">
                                <template #title>
                                    <span class="font-semibold text-gray-100">{{ job.job.kr }}</span>
                                    <span class="text-xs text-gray-500 ml-2">
                                        全選項滿 10 級：{{ job.allLevel10Price.toLocaleString() }}
                                    </span>
                                </template>

                                <el-table
                                    v-for="opt in job.options"
                                    :key="opt.name.kr"
                                    :data="opt.levels"
                                    border
                                    size="small"
                                    class="rounded-lg overflow-hidden mb-3"
                                    :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                                    :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                                >
                                    <template #empty>查無資料</template>
                                    <el-table-column width="220">
                                        <template #header>
                                            <span class="font-semibold text-gray-100">
                                                {{ opt.name.tw === "未對應" ? opt.name.kr : opt.name.tw }}
                                            </span>
                                            <span class="text-xs text-gray-500 ml-2">上限 {{ opt.max }}</span>
                                        </template>
                                        <template #default="{ row }">等級 {{ row.level }}</template>
                                    </el-table-column>
                                    <el-table-column label="所需數量" align="center">
                                        <template #default="{ row }">{{ row.count }}</template>
                                    </el-table-column>
                                    <el-table-column label="價格" align="right">
                                        <template #default="{ row }">
                                            <span class="text-accent font-semibold">
                                                {{ row.price.toLocaleString() }}
                                            </span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
