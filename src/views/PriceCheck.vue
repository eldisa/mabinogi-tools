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
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";

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
    if (item.id) return item.id;
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

// 格式化賦予等級顯示 (1-6 => F-A, 7-15 => 9-1)，跟 Enchant.vue 的 formatRank 一致
const formatRank = (level: number): string => {
    if (level >= 1 && level <= 6) {
        const ranks = ["F", "E", "D", "C", "B", "A"];
        return ranks[level - 1];
    } else if (level >= 7 && level <= 15) {
        return String(16 - level);
    }
    return String(level);
};

// 渲染能力效果，跟 Enchant.vue 的 renderAbilities 一致
const renderAbilities = (enchant: (typeof enchants)[number]): string => {
    const format = (num: number): string => {
        const color = num < 0 ? "#ef4444" : "#60a5fa";
        const sign = num >= 0 ? "+" : "";
        return `<span style="color:${color}; font-weight: 600;">${sign}${num}</span>`;
    };

    return enchant.effect
        .map(({ id, min, max }) => {
            const abilityName = abilitiesMap[id] || id;
            const suffix = abilitiesValueWithPercentArray.includes(id) ? "%" : "";
            return min !== max
                ? `<div style="margin: 2px 0;">${abilityName}: ${format(min)} ~ ${format(max)}${suffix}</div>`
                : `<div style="margin: 2px 0;">${abilityName}: ${format(min)}${suffix}</div>`;
        })
        .join("");
};

const hideBrokenImage = (e: Event) => {
    (e.target as HTMLImageElement).style.display = "none";
};

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

const TYPE_LABEL_MAP: Record<string, string> = {
    item: "道具",
    enchant: "賦予",
};
const translateType = (type: string) => TYPE_LABEL_MAP[type] ?? type;

// 未對應到中文翻譯的資料不顯示
const mappedItemPrices = computed(() => itemPrices.value.filter((item) => item.name.tw !== "未對應"));

const availableTypes = computed(() => Array.from(new Set(mappedItemPrices.value.map((item) => item.type))));

const itemSearch = ref("");
const itemTypeFilter = ref("");
// 目前資料全部來自布里萊赫地城；雪本尚未有爬蟲資料，checkbox 先做起來，等資料補上再串
const showBriLeith = ref(true);
const showSnow = ref(true);

const filteredItemPrices = computed(() => {
    const q = itemSearch.value.trim();
    if (!showBriLeith.value) return []; // 目前所有資料都算布本，取消勾選就清空
    return mappedItemPrices.value.filter((item) => {
        const matchesQuery = !q || item.name.tw.includes(q) || item.name.kr.includes(q);
        const matchesType = !itemTypeFilter.value || item.type === itemTypeFilter.value;
        return matchesQuery && matchesType;
    });
});

// 未對應到中文翻譯的選項不顯示，並攤平成 職業/技能/等級/價格 一列一筆
const mappedRelicPrices = computed(() =>
    relicPrices.value.map((job) => ({
        ...job,
        options: job.options.filter((opt) => opt.name.tw !== "未對應"),
    })),
);

interface FlatRelicRow {
    jobKr: string;
    jobTw: string;
    skillId: number | null;
    skillTw: string;
    skillKr: string;
    max: string;
    level: number;
    price: number;
}

const flatRelicRows = computed<FlatRelicRow[]>(() => {
    const rows: FlatRelicRow[] = [];
    for (const job of mappedRelicPrices.value) {
        const jobTw = translateJob(job.job.kr);
        for (const opt of job.options) {
            for (const lv of opt.levels) {
                rows.push({
                    jobKr: job.job.kr,
                    jobTw,
                    skillId: opt.skillId,
                    skillTw: opt.name.tw,
                    skillKr: opt.name.kr,
                    max: opt.max,
                    level: lv.level,
                    price: lv.price,
                });
            }
        }
    }
    return rows;
});

const availableRelicJobs = computed(() =>
    mappedRelicPrices.value.map((job) => ({ kr: job.job.kr, tw: translateJob(job.job.kr) })),
);
const RELIC_LEVELS = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

const relicSearch = ref("");
const relicJobFilter = ref<string[]>([]);
const relicLevelFilter = ref<number[]>([]);
const relicGroupBySkill = ref(false);

const filteredFlatRelicRows = computed(() => {
    const q = relicSearch.value.trim();
    let rows = flatRelicRows.value;
    if (relicJobFilter.value.length > 0) rows = rows.filter((r) => relicJobFilter.value.includes(r.jobKr));
    if (relicLevelFilter.value.length > 0) rows = rows.filter((r) => relicLevelFilter.value.includes(r.level));
    if (q) {
        rows = rows.filter(
            (r) => r.skillTw.includes(q) || r.skillKr.includes(q) || r.jobTw.includes(q) || r.jobKr.includes(q),
        );
    }

    const sorted = [...rows];
    if (relicGroupBySkill.value) {
        sorted.sort((a, b) => a.skillTw.localeCompare(b.skillTw) || b.level - a.level);
    } else {
        sorted.sort((a, b) => a.jobTw.localeCompare(b.jobTw) || a.skillTw.localeCompare(b.skillTw) || b.level - a.level);
    }
    return sorted;
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

            <el-alert type="warning" effect="dark" :closable="false" show-icon class="mb-4">
                <template #title>
                    <span class="text-sm">
                        資料來源為韓服拍賣場，僅供參考，可能與台服實際行情有落差，且非即時更新。
                    </span>
                </template>
            </el-alert>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div v-if="loading" class="flex flex-col items-center justify-center py-16 text-gray-400">
                    <el-icon :size="32" class="animate-spin mb-3"><Loading /></el-icon>
                    載入價格資料中…
                </div>

                <div v-else-if="loadError" class="flex flex-col items-center justify-center py-16 text-gray-400">
                    <p class="mb-3">價格資料載入失敗，可能是後端服務尚未就緒。</p>
                    <el-button type="primary" plain @click="loadPrices">重新載入</el-button>
                </div>

                <el-tabs v-else type="border-card">
                    <el-tab-pane label="副本掉落">
                        <p class="text-xs text-gray-500 mt-3">更新於 {{ formatUpdatedAt(dungeonItemsUpdatedAt) }}</p>

                        <div class="mt-2 flex flex-wrap items-center gap-3">
                            <el-input
                                v-model="itemSearch"
                                placeholder="搜尋物品名稱…"
                                clearable
                                size="large"
                                style="max-width: 300px"
                            >
                                <template #prefix>
                                    <el-icon><Search /></el-icon>
                                </template>
                            </el-input>
                            <el-select
                                v-model="itemTypeFilter"
                                placeholder="依照類型"
                                clearable
                                size="large"
                                style="width: 140px"
                            >
                                <el-option v-for="t in availableTypes" :key="t" :label="translateType(t)" :value="t" />
                            </el-select>
                            <el-checkbox v-model="showBriLeith">布本</el-checkbox>
                            <el-checkbox v-model="showSnow">
                                雪本
                                <span class="text-xs text-gray-500">(尚無資料)</span>
                            </el-checkbox>
                        </div>

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
                                    <el-popover
                                        v-if="row.type === 'enchant' && getEnchantInfo(row.name.tw)"
                                        trigger="hover"
                                        placement="right"
                                        :width="300"
                                        :show-after="150"
                                        :hide-after="80"
                                        popper-class="qv-popover"
                                    >
                                        <template #reference>
                                            <el-icon class="ml-1 text-gray-400 align-middle"><InfoFilled /></el-icon>
                                        </template>
                                        <div class="qv-detail">
                                            <div class="qv-detail-header">
                                                <span class="qv-rank">
                                                    {{ formatRank(getEnchantInfo(row.name.tw)!.level) }}
                                                </span>
                                                <span class="font-medium text-sm">{{ row.name.tw }}</span>
                                                <el-tag
                                                    size="small"
                                                    :type="getEnchantInfo(row.name.tw)!.type === 'prefix' ? 'danger' : 'success'"
                                                    class="ml-1 !py-0"
                                                >
                                                    {{ getEnchantInfo(row.name.tw)!.type === 'prefix' ? '接頭' : '接尾' }}
                                                </el-tag>
                                                <el-tag
                                                    v-if="getEnchantInfo(row.name.tw)!.personalize"
                                                    size="small"
                                                    type="warning"
                                                    class="!py-0"
                                                >
                                                    專
                                                </el-tag>
                                            </div>
                                            <div
                                                v-if="getEnchantInfo(row.name.tw)!.limit.some((l) => l)"
                                                class="qv-detail-limit"
                                            >
                                                <el-tag
                                                    v-for="l in getEnchantInfo(row.name.tw)!.limit.filter((l) => l)"
                                                    :key="l"
                                                    type="info"
                                                    size="small"
                                                    class="mr-1 mb-1"
                                                >
                                                    {{ l }}
                                                </el-tag>
                                            </div>
                                            <div
                                                class="qv-detail-effects"
                                                v-html="renderAbilities(getEnchantInfo(row.name.tw)!)"
                                            ></div>
                                            <div
                                                v-if="descLines(getEnchantInfo(row.name.tw)!.desc).length"
                                                class="qv-detail-desc"
                                            >
                                                <div
                                                    v-for="(line, i) in descLines(getEnchantInfo(row.name.tw)!.desc)"
                                                    :key="i"
                                                    :class="line.startsWith('[') ? 'qv-desc-neg' : 'qv-desc-pos'"
                                                >
                                                    {{ line }}
                                                </div>
                                            </div>
                                        </div>
                                    </el-popover>
                                </template>
                            </el-table-column>
                            <el-table-column prop="type" label="類型" width="100" align="center">
                                <template #default="{ row }: { row: DungeonItemPrice }">
                                    <el-tag
                                        size="small"
                                        effect="dark"
                                        :type="row.type === 'enchant' ? 'warning' : 'success'"
                                    >
                                        {{ translateType(row.type) }}
                                    </el-tag>
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

                        <div class="mt-2 flex flex-wrap items-center gap-3">
                            <el-input
                                v-model="relicSearch"
                                placeholder="搜尋職業或技能名稱…"
                                clearable
                                size="large"
                                style="max-width: 300px"
                            >
                                <template #prefix>
                                    <el-icon><Search /></el-icon>
                                </template>
                            </el-input>
                            <el-checkbox v-model="relicGroupBySkill">依技能分類（取消則依職業分類）</el-checkbox>
                        </div>

                        <div class="mt-3 flex flex-wrap items-center gap-3">
                            <el-select
                                v-model="relicJobFilter"
                                multiple
                                collapse-tags
                                collapse-tags-tooltip
                                placeholder="篩選職業"
                                clearable
                                style="min-width: 220px"
                            >
                                <el-option v-for="job in availableRelicJobs" :key="job.kr" :label="job.tw" :value="job.kr" />
                            </el-select>
                            <el-select
                                v-model="relicLevelFilter"
                                multiple
                                collapse-tags
                                collapse-tags-tooltip
                                placeholder="篩選等級"
                                clearable
                                style="min-width: 180px"
                            >
                                <el-option v-for="lv in RELIC_LEVELS" :key="lv" :label="`等級 ${lv}`" :value="lv" />
                            </el-select>
                        </div>

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

                            <el-alert
                                v-if="relicConvertEnabled"
                                type="warning"
                                effect="dark"
                                :closable="false"
                                show-icon
                                class="mt-2"
                            >
                                <template #title>
                                    <span class="text-sm">因版本與環境不同，所以價格可能有差距，僅供參考。</span>
                                </template>
                            </el-alert>
                        </div>

                        <el-table
                            :data="filteredFlatRelicRows"
                            border
                            class="rounded-lg overflow-hidden mt-2"
                            :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                            :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                            empty-text="查無資料"
                        >
                            <el-table-column label="職業" width="110">
                                <template #default="{ row }: { row: FlatRelicRow }">{{ row.jobTw }}</template>
                            </el-table-column>
                            <el-table-column label="技能" min-width="220">
                                <template #default="{ row }: { row: FlatRelicRow }">
                                    <div class="flex items-center gap-2">
                                        <img
                                            v-if="row.skillId"
                                            :src="getSkillImageUrl(row.skillId)"
                                            class="w-6 h-6 object-contain flex-shrink-0"
                                            @error="hideBrokenImage"
                                        />
                                        <div>
                                            <span class="font-semibold text-gray-100">{{ row.skillTw }}</span>
                                            <span class="text-xs text-gray-500 ml-2">上限 {{ row.max }}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="等級" width="80" align="center" prop="level">
                                <template #default="{ row }: { row: FlatRelicRow }">{{ row.level }}</template>
                            </el-table-column>
                            <el-table-column label="價格" width="150" align="right" prop="price">
                                <template #default="{ row }: { row: FlatRelicRow }">
                                    <span class="text-accent font-semibold">{{ displayRelicPrice(row.price) }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
