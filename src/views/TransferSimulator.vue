<template>
    <div class="page-wrap">
        <div class="form-card">
            <!-- 標題 -->
            <div class="card-header">
                <h1 class="page-title"><span class="title-gradient">裝備能力轉移</span></h1>
                <!-- 裝備類型 -->
                <div class="chip-row">
                    <label class="chip chip--type" :class="{ 'chip--active': equipType === 'weapon' }">
                        <input type="radio" value="weapon" v-model="equipType" hidden />
                        武器
                    </label>
                    <label class="chip chip--type" :class="{ 'chip--active': equipType === 'armor' }">
                        <input type="radio" value="armor" v-model="equipType" hidden />
                        防具
                    </label>
                </div>
            </div>

            <!-- 等級選擇 -->
            <div class="chip-row tier-row">
                <label
                    v-for="opt in currentOptions"
                    :key="opt.value"
                    class="chip"
                    :class="{ 'chip--active': selectedCategory === opt.value }"
                >
                    <input type="radio" :value="opt.value" v-model="selectedCategory" hidden />
                    {{ opt.label }}
                </label>
            </div>

            <div class="divider" />

            <!-- 繼承條件 -->
            <section class="form-section">
                <h2 class="section-label">繼承條件</h2>
                <div class="chip-row">
                    <label v-if="equipType === 'weapon'" class="chip" :class="{ 'chip--active': form.hasSR }">
                        <input type="checkbox" v-model="form.hasSR" hidden />
                        SR
                    </label>
                    <label
                        v-for="b in blessingOptions"
                        :key="b.value"
                        class="chip"
                        :class="{ 'chip--active': form.blessingType === b.value }"
                        @click.prevent="form.blessingType = form.blessingType === b.value ? null : b.value"
                    >{{ b.label }}</label>
                    <label class="chip" :class="{ 'chip--active': form.hasEnhancement }">
                        <input type="checkbox" v-model="form.hasEnhancement" hidden />
                        賦予
                    </label>
                    <label class="chip" :class="{ 'chip--active': form.hasReforge }">
                        <input type="checkbox" v-model="form.hasReforge" hidden />
                        細工
                    </label>
                </div>
            </section>

            <!-- 賦予詳細 -->
            <transition name="expand">
                <section v-if="form.hasEnhancement" class="form-section detail-section">
                    <h2 class="section-label section-label--sub">賦予詳細</h2>
                    <div class="enchant-grid">
                        <div class="enchant-row">
                            <label class="chip" :class="{ 'chip--active': form.hasEnchantPrefix }">
                                <input type="checkbox" v-model="form.hasEnchantPrefix" hidden />
                                接頭
                            </label>
                            <transition name="fade">
                                <label
                                    v-if="form.hasEnchantPrefix"
                                    class="chip chip--level"
                                    :class="{ 'chip--active': form.enchantPrefixAbove5 }"
                                >
                                    <input type="checkbox" v-model="form.enchantPrefixAbove5" hidden />
                                    等級 &gt; 5
                                </label>
                            </transition>
                        </div>

                        <div class="enchant-row">
                            <label class="chip" :class="{ 'chip--active': form.hasEnchantSuffix }">
                                <input type="checkbox" v-model="form.hasEnchantSuffix" hidden />
                                接尾
                            </label>
                            <transition name="fade">
                                <label
                                    v-if="form.hasEnchantSuffix"
                                    class="chip chip--level"
                                    :class="{ 'chip--active': form.enchantSuffixAbove5 }"
                                >
                                    <input type="checkbox" v-model="form.enchantSuffixAbove5" hidden />
                                    等級 &gt; 5
                                </label>
                            </transition>
                        </div>
                    </div>
                </section>
            </transition>

            <!-- 細工詳細 -->
            <transition name="expand">
                <section v-if="form.hasReforge" class="form-section detail-section">
                    <h2 class="section-label section-label--sub">細工詳細</h2>
                    <div class="reforge-list">
                        <div v-for="(row, i) in form.reforgeAbilityArray" :key="i" class="reforge-row">
                            <span class="reforge-idx">{{ i + 1 }}</span>
                            <div class="reforge-inputs">
                                <div class="reforge-field">
                                    <span class="reforge-field-label">當前</span>
                                    <el-input-number
                                        v-model="row.currentLevel"
                                        :min="0"
                                        :max="200"
                                        size="small"
                                        controls-position="right"
                                    />
                                </div>
                                <span class="reforge-sep">/</span>
                                <div class="reforge-field">
                                    <span class="reforge-field-label">最大</span>
                                    <el-input-number
                                        v-model="row.maxLevel"
                                        :min="0"
                                        :max="200"
                                        size="small"
                                        controls-position="right"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </transition>

            <!-- 費用結果 -->
            <div class="result-bar">
                <span class="result-label">估算費用</span>
                <span class="result-value">
                    {{ evaluateCost.toLocaleString() }}
                    <span class="result-unit">金幣</span>
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ── 頁面外框 ── */
.page-wrap {
    max-width: 40rem;
    margin: 0 auto;
    padding: 0.75rem 1rem;
}

/* ── 主卡片 ── */
.form-card {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 16px;
    padding: 0.9rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0;
}

/* ── 標題列 ── */
.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-bottom: 0.6rem;
}
.page-title {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin: 0;
    flex-shrink: 0;
}
.title-gradient {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.tier-row {
    padding: 0.4rem 0 0.1rem;
}

.chip--type {
    border-radius: 6px;
    font-size: 0.775rem;
    padding: 0.2rem 0.65rem;
}

.divider {
    border-top: 1px solid #374151;
    margin: 0;
}

/* ── Section ── */
.form-section {
    padding: 0.55rem 0;
}
.detail-section {
    border-top: 1px dashed #374151;
}

.section-label {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b7280;
    margin: 0 0 0.35rem;
}
.section-label--sub {
    color: #fbbf24;
    opacity: 0.7;
}

/* ── Chip ── */
.chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.chip {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    border: 1px solid #4b5563;
    background: #111827;
    color: #9ca3af;
    font-size: 0.825rem;
    cursor: pointer;
    user-select: none;
    transition:
        border-color 0.15s,
        background 0.15s,
        color 0.15s;
}
.chip:hover {
    border-color: #6b7280;
    color: #d1d5db;
}
.chip--active {
    border-color: #fbbf24;
    background: rgba(251, 191, 36, 0.1);
    color: #fbbf24;
}
.chip--level {
    font-size: 0.775rem;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
}

/* ── 賦予 ── */
.enchant-grid {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.enchant-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* ── 細工 ── */
.reforge-list {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}
.reforge-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
}
.reforge-idx {
    width: 1rem;
    text-align: center;
    font-size: 0.75rem;
    color: #6b7280;
    flex-shrink: 0;
}
.reforge-inputs {
    display: flex;
    align-items: center;
    gap: 0.4rem;
}
.reforge-field {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}
.reforge-field-label {
    font-size: 0.75rem;
    color: #6b7280;
    white-space: nowrap;
}
.reforge-sep {
    color: #4b5563;
    font-size: 0.9rem;
}

/* ── 結果 ── */
.result-bar {
    margin-top: 0.4rem;
    padding: 0.75rem 1rem;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}
.result-label {
    font-size: 0.8rem;
    color: #6b7280;
    white-space: nowrap;
}
.result-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #fbbf24;
    display: flex;
    align-items: baseline;
    gap: 0.35rem;
}
.result-unit {
    font-size: 0.8rem;
    font-weight: 400;
    color: #9ca3af;
}

/* ── 動畫 ── */
.expand-enter-active,
.expand-leave-active {
    transition:
        opacity 0.2s ease,
        max-height 0.25s ease;
    max-height: 400px;
    overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* ── 手機 ── */
@media (max-width: 480px) {
    .form-card {
        padding: 1.25rem;
    }
    .result-value {
        font-size: 1.4rem;
    }
    .reforge-inputs {
        flex-wrap: wrap;
    }
}
</style>

<style>
/* el-input-number 細工欄位調整 */
.reforge-field .el-input-number {
    width: 7rem;
}
.reforge-field .el-input__wrapper {
    background: #111827;
    border-color: #374151;
    box-shadow: none !important;
}
.reforge-field .el-input__inner {
    color: #e2e8f0;
}
.reforge-field .el-input-number__increase,
.reforge-field .el-input-number__decrease {
    background: #1f2937;
    border-color: #374151;
    color: #9ca3af;
}
.reforge-field .el-input-number__increase:hover,
.reforge-field .el-input-number__decrease:hover {
    color: #fbbf24;
}
</style>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Option } from "../types";

interface Cost {
    level: number;
    reforgeBasicCost: number;
    reforgeBreakCost: number;
    otherCost: number;
}

interface Reforge {
    currentLevel: number;
    maxLevel: number;
}

const basicCostUnit = 10000;

//level: 1: 凱爾特 2: 兇猛/章魚 3: 貓武 4: 靈魂/日月
const costArray: Cost[] = [
    { level: 1, reforgeBasicCost: 0.3, reforgeBreakCost: 25, otherCost: 1 },
    { level: 2, reforgeBasicCost: 1.2, reforgeBreakCost: 100, otherCost: 2 },
    { level: 3, reforgeBasicCost: 24, reforgeBreakCost: 2000, otherCost: 20 },
    { level: 4, reforgeBasicCost: 240, reforgeBreakCost: 20000, otherCost: 200 },
];

const blessingOptions = [
    { label: "祝福", value: "blessing" as const },
    { label: "聖火", value: "holyFire" as const },
    { label: "聖水", value: "holyWater" as const },
];

type BlessingType = "blessing" | "holyFire" | "holyWater" | null;

const form = ref({
    hasSR: true,
    blessingType: "blessing" as BlessingType,
    hasEnhancement: true,
    hasEnchantPrefix: true,
    enchantPrefixAbove5: false,
    hasEnchantSuffix: true,
    enchantSuffixAbove5: false,
    hasReforge: true,
    reforgeAbilityArray: [
        { currentLevel: 0, maxLevel: 20 },
        { currentLevel: 0, maxLevel: 20 },
        { currentLevel: 0, maxLevel: 20 },
    ] as Reforge[],
});

const equipType = ref<"weapon" | "armor">("weapon");
const selectedCategory = ref(3);

const weaponOptions: Option[] = [
    { label: "凱爾特", value: 1 },
    { label: "兇猛/章魚", value: 2 },
    { label: "貓武", value: 3 },
    { label: "靈魂/日月", value: 4 },
];

const armorOptions: Option[] = [
    { label: "精緻/蓋亞斯", value: 2 }, // 費用同兇猛/章魚
    { label: "安安套", value: 3 }, // 費用同貓武
    { label: "草頭", value: 4 }, // 費用同靈魂/日月
];

const currentOptions = computed(() => (equipType.value === "weapon" ? weaponOptions : armorOptions));

// 切換類型時重設選項
watch(equipType, (type) => {
    selectedCategory.value = type === "weapon" ? 3 : 1;
    if (type === "armor") form.value.hasSR = false;
});

const evaluateCost = computed(() => {
    const {
        hasSR,
        blessingType,
        hasEnhancement,
        hasEnchantPrefix,
        enchantPrefixAbove5,
        hasEnchantSuffix,
        enchantSuffixAbove5,
        hasReforge,
        reforgeAbilityArray,
    } = form.value;

    const { reforgeBasicCost, reforgeBreakCost, otherCost } =
        costArray.find((c) => c.level === selectedCategory.value) ?? costArray[0];

    let totalCost = 0;

    // SR（5× otherCost）
    totalCost += Number(hasSR) * otherCost * 5;
    // 祝福/聖火 → 1×，聖水 → 10×
    if (blessingType === "holyWater") totalCost += otherCost * 10;
    else if (blessingType !== null) totalCost += otherCost;

    // 賦予：每個槽位等級 ≤ 5 → 1×，等級 > 5 → 2×
    if (hasEnhancement) {
        if (hasEnchantPrefix) totalCost += (enchantPrefixAbove5 ? 5 : 1) * otherCost;
        if (hasEnchantSuffix) totalCost += (enchantSuffixAbove5 ? 5 : 1) * otherCost;
    }

    // 細工
    if (hasReforge) {
        reforgeAbilityArray.forEach(({ currentLevel, maxLevel }) => {
            if (currentLevel > maxLevel) {
                totalCost += reforgeBreakCost * (currentLevel - maxLevel) + reforgeBasicCost * maxLevel;
            } else {
                totalCost += reforgeBasicCost * currentLevel;
            }
        });
    }

    return roundTo(totalCost * basicCostUnit);
});

const roundTo = (value: number, digits: number = 2): number => {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
};
</script>
