<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Search, Loading, InfoFilled } from "@element-plus/icons-vue";
import {
    fetchDungeonItemPrices,
    fetchMuriasRelicPrices,
    fetchPricesMeta,
    type DungeonItemPrice,
    type MuriasRelicJobPrice,
} from "../api/prices";
import { materials } from "../data/materials";
import { enchants } from "../data/enchants";

const baseUrl = import.meta.env.BASE_URL;
const ENCHANT_SCROLL_IMAGE_ID = 62025; // 賦予捲軸統一用這張圖，不分實際詞條

// 名稱(kr) -> 素材 id，用來找 public/itemImage 裡對應的圖片
const materialIdByKr = new Map(materials.map((m) => [m.name.kr, m.id]));
// 賦予詞條 tw/tw2 -> 賦予資料，用來顯示效果說明
const enchantByTw = new Map<string, (typeof enchants)[number]>();
enchants.forEach((e) => {
    if (!enchantByTw.has(e.name.tw)) enchantByTw.set(e.name.tw, e);
    if (e.name.tw2 && !enchantByTw.has(e.name.tw2)) enchantByTw.set(e.name.tw2, e);
});

const getItemImageId = (item: DungeonItemPrice): number | null => {
    if (item.type === "enchant") return ENCHANT_SCROLL_IMAGE_ID;
    return materialIdByKr.get(item.name.kr) ?? null;
};

const getEnchantInfo = (tw: string) => enchantByTw.get(tw);

const getSkillImageUrl = (skillId: number) =>
    `https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/${skillId}.png`;

// desc 換行處理：相容舊格式（\\n 兩個字元）與新格式（真換行 \n）
const descLines = (desc: string): string[] =>
    desc
        .replace(/\\+n/g, "\n")
        .split("\n")
        .filter((l) => l.trim() !== "");

const hideBrokenImage = (e: Event) => {
    (e.target as HTMLImageElement).style.display = "none";
};

const search = ref("");
const typeFilter = ref("");
const loading = ref(true);
const loadError = ref(false);

const itemPrices = ref<DungeonItemPrice[]>([]);
const relicPrices = ref<MuriasRelicJobPrice[]>([]);
const dungeonItemsUpdatedAt = ref<string | null>(null);
const muriasRelicUpdatedAt = ref<string | null>(null);

const formatUpdatedAt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("zh-TW") : "尚未更新");

// 穆利亞斯遺物職業韓文對照繁中，順序依 mabi.labanyu.com 頁面上的排列
const RELIC_JOB_NAME_MAP: Record<string, string> = {
    "엘레멘탈 나이트": "元素騎士",
    "세인트 바드": "聖詠者",
    "다크 메이지": "縛魂者",
    "알케믹 스팅어": "秘術遊俠",
    "세이크리드 가드": "聖盾騎士",
    "블래스트 랜서": "爆裂槍兵",
    "배리어블 거너": "幻變槍手",
    "포비든 알케미스트": "禁忌煉金士",
    "멜로딕 퍼피티어": "旋律人偶師",
    "퓨리 파이터": "狂怒鬥士",
};
const translateJob = (kr: string) => RELIC_JOB_NAME_MAP[kr] ?? kr;

// 未對應到中文翻譯的資料不顯示
const mappedItemPrices = computed(() => itemPrices.value.filter((item) => item.name.tw !== "未對應"));

const availableTypes = computed(() => Array.from(new Set(mappedItemPrices.value.map((item) => item.type))));

const filteredItemPrices = computed(() => {
    const q = search.value.trim();
    return mappedItemPrices.value.filter((item) => {
        const matchesQuery = !q || item.name.tw.includes(q) || item.name.kr.includes(q);
        const matchesType = !typeFilter.value || item.type === typeFilter.value;
        return matchesQuery && matchesType;
    });
});

const mappedRelicPrices = computed(() =>
    relicPrices.value.map((job) => ({
        ...job,
        options: job.options.filter((opt) => opt.name.tw !== "未對應"),
    })),
);

const filteredRelicPrices = computed(() => {
    const q = search.value.trim();
    if (!q) return mappedRelicPrices.value;
    return mappedRelicPrices.value
        .map((job) => ({
            ...job,
            options: job.options.filter((opt) => opt.name.tw.includes(q) || opt.name.kr.includes(q)),
        }))
        .filter((job) => translateJob(job.job.kr).includes(q) || job.job.kr.includes(q) || job.options.length > 0);
});

// 遺物價格台服換算：用「穆利亞斯的遺物(理念)」的韓服/台服價格算出倍率，套用在遺物選項價格上
const IDEA_ITEM_TW_NAME = "穆利亞斯的遺物(理念)";
const TW_IDEA_PRICE_KEY = "mabinogi-price-check-tw-idea-price";

const loadTwIdeaPrice = (): number | null => {
    const saved = localStorage.getItem(TW_IDEA_PRICE_KEY);
    return saved ? Number(saved) : null;
};

const relicConvertEnabled = ref(false);
const twIdeaPrice = ref<number | null>(loadTwIdeaPrice());
watch(twIdeaPrice, (v) => {
    if (v) localStorage.setItem(TW_IDEA_PRICE_KEY, String(v));
    else localStorage.removeItem(TW_IDEA_PRICE_KEY);
});

const ideaKrPrice = computed(() => itemPrices.value.find((i) => i.name.tw === IDEA_ITEM_TW_NAME)?.price ?? null);

const relicConvertRatio = computed(() => {
    if (!relicConvertEnabled.value || !twIdeaPrice.value || !ideaKrPrice.value) return null;
    return twIdeaPrice.value / ideaKrPrice.value;
});

const displayRelicPrice = (price: number) => {
    const ratio = relicConvertRatio.value;
    return ratio ? Math.round(price * ratio).toLocaleString() : price.toLocaleString();
};

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
                <div class="mb-4 flex flex-wrap gap-3">
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
                    <el-select
                        v-model="typeFilter"
                        placeholder="依照類型"
                        clearable
                        size="large"
                        style="width: 140px"
                        :disabled="loading || loadError"
                    >
                        <el-option v-for="t in availableTypes" :key="t" :label="t" :value="t" />
                    </el-select>
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
                            <el-table-column label="圖片" width="70" align="center">
                                <template #default="{ row }: { row: DungeonItemPrice }">
                                    <img
                                        v-if="getItemImageId(row)"
                                        :src="`${baseUrl}itemImage/${getItemImageId(row)}.png`"
                                        class="w-8 h-8 object-contain mx-auto"
                                        @error="hideBrokenImage"
                                    />
                                </template>
                            </el-table-column>
                            <el-table-column label="名稱" min-width="220">
                                <template #default="{ row }: { row: DungeonItemPrice }">
                                    <span class="font-semibold text-gray-100">{{ row.name.tw }}</span>
                                    <el-tooltip
                                        v-if="row.type === 'enchant' && getEnchantInfo(row.name.tw)"
                                        effect="dark"
                                        placement="right"
                                    >
                                        <template #content>
                                            <div
                                                v-for="(line, i) in descLines(getEnchantInfo(row.name.tw)!.desc)"
                                                :key="i"
                                            >
                                                {{ line }}
                                            </div>
                                        </template>
                                        <el-icon class="ml-1 text-gray-400 align-middle"><InfoFilled /></el-icon>
                                    </el-tooltip>
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

                        <div class="mt-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700">
                            <el-checkbox v-model="relicConvertEnabled">換算為台服價格參考</el-checkbox>

                            <div v-if="relicConvertEnabled" class="mt-2 flex flex-wrap items-center gap-3">
                                <span class="text-sm text-gray-400">台服「{{ IDEA_ITEM_TW_NAME }}」價格</span>
                                <el-input-number
                                    v-model="twIdeaPrice"
                                    :min="0"
                                    :step="1000"
                                    controls-position="right"
                                    style="width: 180px"
                                />
                                <span v-if="ideaKrPrice" class="text-xs text-gray-500">
                                    韓服理念價格：{{ ideaKrPrice.toLocaleString() }}
                                    <template v-if="relicConvertRatio">，換算倍率 {{ relicConvertRatio.toFixed(3) }}</template>
                                </span>
                                <span v-else class="text-xs text-red-400">
                                    找不到韓服「{{ IDEA_ITEM_TW_NAME }}」價格，無法換算
                                </span>
                            </div>

                            <el-alert v-if="relicConvertEnabled" type="warning" :closable="false" show-icon class="mt-2">
                                <template #title>
                                    <span class="text-sm">因版本與環境不同，所以價格可能有差距，僅供參考。</span>
                                </template>
                            </el-alert>
                        </div>

                        <el-collapse class="mt-2">
                            <el-collapse-item v-for="job in filteredRelicPrices" :key="job.job.kr" :name="job.job.kr">
                                <template #title>
                                    <span class="font-semibold text-gray-100">{{ translateJob(job.job.kr) }}</span>
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
                                            <div class="flex items-center gap-2">
                                                <img
                                                    v-if="opt.skillId"
                                                    :src="getSkillImageUrl(opt.skillId)"
                                                    class="w-6 h-6 object-contain flex-shrink-0"
                                                    @error="hideBrokenImage"
                                                />
                                                <div>
                                                    <span class="font-semibold text-gray-100">{{ opt.name.tw }}</span>
                                                    <span class="text-xs text-gray-500 ml-2">上限 {{ opt.max }}</span>
                                                </div>
                                            </div>
                                        </template>
                                        <template #default="{ row }">等級 {{ row.level }}</template>
                                    </el-table-column>
                                    <el-table-column label="價格" align="right">
                                        <template #default="{ row }">
                                            <span class="text-accent font-semibold">
                                                {{ displayRelicPrice(row.price) }}
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
