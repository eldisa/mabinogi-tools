<script setup lang="ts">
import { ref, computed, reactive } from "vue";
import dollBagsData from "../data/doll_bags.json";

interface Effect {
    key: string;
    name: string;
    value: number;
    isPercent: boolean;
}

interface DollBag {
    id: number;
    name: string;
    image: string;
    bag_width: number;
    bag_height: number;
    bag_inner_width: number;
    bag_inner_height: number;
    summon_cost: number | null;
    summon_duration: number | null;
    effects: Effect[];
    auto_pick_list: string[];
    description_raw: string;
}

const dollBags = dollBagsData as DollBag[];
const baseUrl = import.meta.env.BASE_URL;
// 搜尋與篩選狀態
const searchQuery = ref("");
const selectedEffects = ref<string[]>([]);
const selectedAutoPickCategories = ref<string[]>([]);
const selectedBagSize = ref<string>("");
const summonCostRange = reactive({ min: 0, max: 1 });
const sortField = ref("id");
const sortOrder = ref<"asc" | "desc">("desc");

// 背包尺寸選項
const bagSizeOptions = ["2 X 3", "3 X 2", "3 X 3", "4 X 2", "4 X 3"];

// 展開的卡片
const expandedCardId = ref<number | null>(0);

// 取得所有可用的效果類型
const availableEffects = computed(() => {
    const effectSet = new Set<string>();
    dollBags.forEach((bag) => {
        bag.effects.forEach((effect) => {
            effectSet.add(effect.name);
        });
    });
    return Array.from(effectSet).sort();
});

// 取得所有可用的自動拾取分類
const availableAutoPickCategories = computed(() => {
    const categorySet = new Set<string>();
    dollBags.forEach((bag) => {
        bag.auto_pick_list.forEach((category) => {
            categorySet.add(category);
        });
    });
    return Array.from(categorySet).sort();
});

// 篩選後的娃娃背包
const filteredBags = computed(() => {
    let result = [...dollBags];

    // 搜尋名稱
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((bag) => bag.name.toLowerCase().includes(query));
    }

    // 篩選效果
    if (selectedEffects.value.length > 0) {
        result = result.filter((bag) =>
            selectedEffects.value.every((effectName) => bag.effects.some((e) => e.name === effectName)),
        );
    }

    // 篩選自動拾取分類
    if (selectedAutoPickCategories.value.length > 0) {
        result = result.filter((bag) =>
            selectedAutoPickCategories.value.every((category) => bag.auto_pick_list.includes(category)),
        );
    }

    // 篩選背包尺寸
    if (selectedBagSize.value) {
        const [width, height] = selectedBagSize.value.split(" X ").map(Number);
        result = result.filter((bag) => bag.bag_width === width && bag.bag_height === height);
    }

    // 篩選召喚重量
    result = result.filter((bag) => {
        if (bag.summon_cost === null) return true;
        return bag.summon_cost >= summonCostRange.min && bag.summon_cost <= summonCostRange.max;
    });

    // 排序
    result.sort((a, b) => {
        let aVal: any, bVal: any;

        // 如果有選擇效果篩選且排序為「依篩選效果」，按效果數值總和排序
        if (sortField.value === "selected_effects" && selectedEffects.value.length > 0) {
            const sumA = selectedEffects.value.reduce((sum, effectName) => {
                const effect = a.effects.find((e) => e.name === effectName);
                return sum + (effect?.value ?? 0);
            }, 0);
            const sumB = selectedEffects.value.reduce((sum, effectName) => {
                const effect = b.effects.find((e) => e.name === effectName);
                return sum + (effect?.value ?? 0);
            }, 0);
            return sortOrder.value === "asc" ? sumA - sumB : sumB - sumA;
        }

        // 效果/重量排序：篩選效果數值總和 / 召喚重量
        if (sortField.value === "effect_per_weight" && selectedEffects.value.length > 0) {
            const sumA = selectedEffects.value.reduce((sum, effectName) => {
                const effect = a.effects.find((e) => e.name === effectName);
                return sum + (effect?.value ?? 0);
            }, 0);
            const sumB = selectedEffects.value.reduce((sum, effectName) => {
                const effect = b.effects.find((e) => e.name === effectName);
                return sum + (effect?.value ?? 0);
            }, 0);
            const ratioA = a.summon_cost ? sumA / a.summon_cost : 0;
            const ratioB = b.summon_cost ? sumB / b.summon_cost : 0;
            return sortOrder.value === "asc" ? ratioA - ratioB : ratioB - ratioA;
        }

        switch (sortField.value) {
            case "id":
                aVal = a.id;
                bVal = b.id;
                break;
            case "name":
                aVal = a.name;
                bVal = b.name;
                break;
            case "summon_cost":
                aVal = a.summon_cost ?? 999;
                bVal = b.summon_cost ?? 999;
                break;
            case "summon_duration":
                aVal = a.summon_duration ?? 0;
                bVal = b.summon_duration ?? 0;
                break;
            case "bag_size":
                aVal = (a.bag_inner_width || 0) * (a.bag_inner_height || 0);
                bVal = (b.bag_inner_width || 0) * (b.bag_inner_height || 0);
                break;
            case "effects_count":
                aVal = a.effects.length;
                bVal = b.effects.length;
                break;
            default:
                aVal = a.name;
                bVal = b.name;
        }

        if (typeof aVal === "string") {
            return sortOrder.value === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return sortOrder.value === "asc" ? aVal - bVal : bVal - aVal;
    });

    return result;
});

// 格式化效果顯示
const formatEffect = (effect: Effect) => {
    const sign = effect.value >= 0 ? "+" : "";
    const suffix = effect.isPercent ? "%" : "";
    return `${effect.name} ${sign}${effect.value}${suffix}`;
};

// 格式化效果顯示（簡短版）
const formatEffectShort = (effect: Effect) => {
    const sign = effect.value >= 0 ? "+" : "";
    const suffix = effect.isPercent ? "%" : "";
    return `${sign}${effect.value}${suffix}`;
};

// 切換卡片展開狀態
const toggleCard = (id: number) => {
    expandedCardId.value = expandedCardId.value === id ? null : id;
};

// 清除所有篩選
const clearFilters = () => {
    searchQuery.value = "";
    selectedEffects.value = [];
    selectedAutoPickCategories.value = [];
    selectedBagSize.value = "";
    summonCostRange.min = 0;
    summonCostRange.max = 1;
};

// 效果分類
const effectCategories = {
    基礎屬性: ["力量", "敏捷", "智力", "意志", "幸運"],
    生命相關: ["最大生命力", "最大魔力值", "最大耐力"],
    傷害相關: ["最小傷害", "最大傷害", "暴擊率", "暴擊傷害", "魔法攻擊力"],
    防禦相關: ["防禦", "保護", "魔法防禦", "魔法保護"],
    煉金術: ["所有(水/火/風/土)屬性鍊金術傷害", "煉金術傷害"],
    其他: ["移動速度", "攻擊速度", "音樂增益技能持續時間"],
};

// 取得效果的 CSS 類別
const getEffectClass = (effectName: string) => {
    if (effectCategories["基礎屬性"].includes(effectName)) return "effect-stat";
    if (effectCategories["生命相關"].includes(effectName)) return "effect-hp";
    if (effectCategories["傷害相關"].includes(effectName)) return "effect-damage";
    if (effectCategories["防禦相關"].includes(effectName)) return "effect-defense";
    if (effectCategories["煉金術"].some((e) => effectName.includes("煉金") || effectName.includes("鍊金")))
        return "effect-alchemy";
    return "effect-other";
};
</script>

<template>
    <div class="doll-bag-search">
        <h1 class="page-title">
            <span class="text-gradient">娃娃背包查詢</span>
        </h1>

        <!-- 搜尋與篩選區 -->
        <div class="filter-section">
            <div class="filter-row">
                <!-- 搜尋框 -->
                <div class="search-box">
                    <el-input v-model="searchQuery" placeholder="搜尋娃娃背包名稱" clearable size="large">
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                </div>

                <!-- 排序 -->
                <div class="sort-controls">
                    <el-select v-model="sortField" placeholder="排序方式" size="large">
                        <el-option label="最近實裝" value="id" />
                        <el-option label="背包大小" value="bag_size" />
                        <el-option
                            label="依篩選效果"
                            value="selected_effects"
                            :disabled="selectedEffects.length === 0"
                        />
                        <el-option
                            label="效果/重量"
                            value="effect_per_weight"
                            :disabled="selectedEffects.length === 0"
                        />
                    </el-select>
                    <el-button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" size="large">
                        <el-icon>
                            <component :is="sortOrder === 'asc' ? 'SortUp' : 'SortDown'" />
                        </el-icon>
                    </el-button>
                </div>
            </div>

            <!-- 進階篩選 -->
            <div class="advanced-filters">
                <!-- 效果篩選 -->
                <div class="filter-group">
                    <label>效果篩選</label>
                    <el-select
                        v-model="selectedEffects"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        placeholder="選擇要包含的效果"
                        clearable
                        filterable
                    >
                        <el-option v-for="effect in availableEffects" :key="effect" :label="effect" :value="effect" />
                    </el-select>
                </div>

                <!-- 自動拾取分類篩選 -->
                <div class="filter-group">
                    <label>自動拾取分類</label>
                    <el-select
                        v-model="selectedAutoPickCategories"
                        multiple
                        collapse-tags
                        collapse-tags-tooltip
                        placeholder="選擇收集分類"
                        clearable
                        filterable
                    >
                        <el-option
                            v-for="category in availableAutoPickCategories"
                            :key="category"
                            :label="category"
                            :value="category"
                        />
                    </el-select>
                </div>

                <!-- 背包尺寸篩選 -->
                <div class="filter-group">
                    <label>佔格大小</label>
                    <el-select v-model="selectedBagSize" placeholder="選擇佔格大小" clearable>
                        <el-option v-for="size in bagSizeOptions" :key="size" :label="size" :value="size" />
                    </el-select>
                </div>

                <!-- 召喚重量篩選 -->
                <div class="filter-group summon-cost-filter">
                    <label>召喚重量範圍</label>
                    <div class="slider-container">
                        <el-slider
                            v-model="summonCostRange.max"
                            :min="0.1"
                            :max="1"
                            :step="0.1"
                            :format-tooltip="(val: number) => val.toFixed(1)"
                        />
                        <span class="slider-value">≤ {{ summonCostRange.max.toFixed(1) }}</span>
                    </div>
                </div>

                <!-- 清除篩選 -->
                <el-button type="info" plain @click="clearFilters">清除篩選</el-button>
            </div>
        </div>

        <!-- 結果統計 -->
        <div class="results-info">
            <span>
                共找到
                <strong>{{ filteredBags.length }}</strong>
                個娃娃背包
            </span>
        </div>

        <!-- 娃娃背包列表 -->
        <div class="bag-grid">
            <div
                v-for="bag in filteredBags"
                :key="bag.id"
                class="bag-card"
                :class="{ expanded: expandedCardId === bag.id }"
                @click="toggleCard(bag.id)"
            >
                <!-- 卡片頭部：圖片與名稱 -->
                <div class="bag-header">
                    <div class="bag-image">
                        <img :src="`${baseUrl}itemImage/${bag.id}.png`" :alt="bag.name" />
                    </div>
                    <div class="bag-info">
                        <h3 class="bag-name">{{ bag.name }}</h3>
                    </div>
                </div>

                <div class="bag-stats">
                    <div class="stat-item">
                        <span class="stat-label">背包大小</span>
                        <span class="stat-value">{{ bag.bag_inner_width }}×{{ bag.bag_inner_height }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">召喚重量</span>
                        <span class="stat-value">{{ bag.summon_cost?.toFixed(1) ?? "-" }}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">召喚時間</span>
                        <span class="stat-value">{{ bag.summon_duration ?? "-" }} 分</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">佔格</span>
                        <span class="stat-value">{{ bag.bag_width }}×{{ bag.bag_height }}</span>
                    </div>
                </div>

                <!-- 效果預覽 -->
                <div class="effects-preview">
                    <div
                        v-for="effect in bag.effects.slice(0, 6)"
                        :key="effect.key"
                        class="effect-chip"
                        :class="getEffectClass(effect.name)"
                    >
                        <span class="effect-name">{{ effect.name }}</span>
                        <span class="effect-value">{{ formatEffectShort(effect) }}</span>
                    </div>
                    <div v-if="bag.effects.length > 6" class="effect-chip more">+{{ bag.effects.length - 6 }} 更多</div>
                </div>

                <!-- 展開詳情 -->
                <div v-if="expandedCardId === bag.id" class="bag-details" @click.stop>
                    <div class="detail-section">
                        <h4>完整效果</h4>
                        <div class="effects-full">
                            <div
                                v-for="effect in bag.effects"
                                :key="effect.key"
                                class="effect-item"
                                :class="getEffectClass(effect.name)"
                            >
                                {{ formatEffect(effect) }}
                            </div>
                        </div>
                    </div>

                    <div class="detail-section" v-if="bag.auto_pick_list.length > 0">
                        <h4>自動拾取分類</h4>
                        <div class="auto-pick-list">
                            <span v-for="category in bag.auto_pick_list" :key="category" class="pick-category">
                                {{ category }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 無結果提示 -->
        <div v-if="filteredBags.length === 0" class="no-results">
            <el-icon :size="48"><Warning /></el-icon>
            <p>找不到符合條件的娃娃背包</p>
            <el-button type="primary" plain @click="clearFilters">清除篩選條件</el-button>
        </div>
    </div>
</template>

<style scoped>
.doll-bag-search {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
}

.page-title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
}

.text-gradient {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* 篩選區 */
.filter-section {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
}

.filter-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}

.search-box {
    flex: 1;
}

.sort-controls {
    display: flex;
    gap: 0.5rem;
}

.sort-controls .el-select {
    width: 140px;
}

.advanced-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: flex-end;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-width: 200px;
}

.filter-group label {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #9ca3af);
}

.summon-cost-filter {
    flex: 1;
    min-width: 200px;
    max-width: 300px;
}

.slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.slider-container .el-slider {
    flex: 1;
}

.slider-value {
    font-size: 0.9rem;
    color: var(--color-gold-400, #fbbf24);
    min-width: 50px;
}

/* 結果統計 */
.results-info {
    margin-bottom: 1rem;
    color: var(--color-text-secondary, #9ca3af);
}

.results-info strong {
    color: var(--color-gold-400, #fbbf24);
}

/* 娃娃背包網格 */
.bag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
}

.bag-card {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.bag-card:hover {
    border-color: var(--color-gold-400, #fbbf24);
    transform: translateY(-2px);
}

.bag-card.expanded {
    border-color: var(--color-gold-400, #fbbf24);
    box-shadow: 0 4px 20px rgba(251, 191, 36, 0.15);
}

.bag-header {
    display: flex;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.75rem;
}

.bag-image {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.bag-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.bag-info {
    flex: 1;
    min-width: 0;
}

.bag-name {
    font-size: 1.1rem;
    color: var(--color-text-primary, #f9fafb);
    margin: 0;
    flex: 1;
}

.bag-tags {
    display: flex;
    gap: 0.25rem;
    flex-wrap: wrap;
}

.tag {
    font-size: 0.7rem;
    padding: 0.15rem 0.4rem;
    background: rgba(251, 191, 36, 0.2);
    color: var(--color-gold-400, #fbbf24);
    border-radius: 4px;
}

/* 背包統計 */
.bag-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
}

.stat-item {
    text-align: center;
}

.stat-label {
    display: block;
    font-size: 0.7rem;
    color: var(--color-text-secondary, #6b7280);
    margin-bottom: 0.2rem;
}

.stat-value {
    font-size: 0.9rem;
    color: var(--color-text-primary, #f9fafb);
    font-weight: 500;
}

/* 效果預覽 */
.effects-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.effect-chip {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: rgba(100, 100, 100, 0.3);
}

.effect-chip .effect-name {
    color: var(--color-text-secondary, #9ca3af);
}

.effect-chip .effect-value {
    color: var(--color-text-primary, #f9fafb);
    font-weight: 500;
}

.effect-chip.more {
    background: rgba(251, 191, 36, 0.2);
    color: var(--color-gold-400, #fbbf24);
}

/* 效果顏色分類 */
.effect-chip.effect-stat {
    background: rgba(59, 130, 246, 0.2);
}
.effect-chip.effect-hp {
    background: rgba(34, 197, 94, 0.2);
}
.effect-chip.effect-damage {
    background: rgba(239, 68, 68, 0.2);
}
.effect-chip.effect-defense {
    background: rgba(168, 85, 247, 0.2);
}
.effect-chip.effect-alchemy {
    background: rgba(251, 191, 36, 0.2);
}

/* 展開詳情 */
.bag-details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border, #374151);
}

.detail-section {
    margin-bottom: 1rem;
}

.detail-section:last-child {
    margin-bottom: 0;
}

.detail-section h4 {
    font-size: 0.9rem;
    color: var(--color-gold-400, #fbbf24);
    margin-bottom: 0.5rem;
}

.effects-full {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.effect-item {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    background: rgba(100, 100, 100, 0.3);
    color: var(--color-text-primary, #f9fafb);
}

.effect-item.effect-stat {
    background: rgba(59, 130, 246, 0.2);
    border-left: 2px solid #3b82f6;
}
.effect-item.effect-hp {
    background: rgba(34, 197, 94, 0.2);
    border-left: 2px solid #22c55e;
}
.effect-item.effect-damage {
    background: rgba(239, 68, 68, 0.2);
    border-left: 2px solid #ef4444;
}
.effect-item.effect-defense {
    background: rgba(168, 85, 247, 0.2);
    border-left: 2px solid #a855f7;
}
.effect-item.effect-alchemy {
    background: rgba(251, 191, 36, 0.2);
    border-left: 2px solid #fbbf24;
}

.auto-pick-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
}

.pick-category {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    background: rgba(34, 197, 94, 0.2);
    color: #22c55e;
    border-radius: 4px;
}

.other-info {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #d1d5db);
}

.other-info p {
    margin: 0.25rem 0;
}

.other-info strong {
    color: var(--color-text-primary, #f9fafb);
}

/* 無結果 */
.no-results {
    text-align: center;
    padding: 3rem;
    color: var(--color-text-secondary, #9ca3af);
}

.no-results .el-icon {
    margin-bottom: 1rem;
    color: var(--color-gold-400, #fbbf24);
}

.no-results p {
    margin-bottom: 1rem;
}

/* 響應式 */
@media (max-width: 768px) {
    .doll-bag-search {
        padding: 1rem;
    }

    .filter-row {
        flex-direction: column;
    }

    .sort-controls {
        width: 100%;
    }

    .sort-controls .el-select {
        flex: 1;
    }

    .advanced-filters {
        flex-direction: column;
    }

    .filter-group {
        width: 100%;
        max-width: none;
    }

    .bag-grid {
        grid-template-columns: 1fr;
    }

    .bag-stats {
        grid-template-columns: repeat(2, 1fr);
    }

    .page-title {
        font-size: 1.5rem;
    }
}
</style>
