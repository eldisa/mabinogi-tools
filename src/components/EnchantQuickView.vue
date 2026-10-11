<script setup lang="ts">
import { computed, ref } from "vue";
import { Plus, Close } from "@element-plus/icons-vue";
import type { Enchant } from "../types/Enchant";
import { enchants } from "../data/enchants";
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";
import {
    QUICK_WEAPON_OPTIONS,
    PRIMARY_IDS,
    RELEVANT_IDS,
    isGachaSpecial,
    enchantsForSlot,
    slotsForWeapon,
    formatRank,
} from "../data/enchantSlots";
import { descLines, getSourceLabel, mergeEffects, renderAbilities, selectableAbility } from "../data/enchantView";
import WeaponTypeSelect from "./WeaponTypeSelect.vue";

/**
 * 賦予快速檢視：依武器類型、部位列出接頭／接尾。
 * 各頁面共用：賦予查詢頁用自訂權重排序；其他頁面（例如裝備效益換算）傳入 scorer 用自己的評分排序。
 */
const props = withDefaults(
    defineProps<{
        /** 限定可選的武器類型（各職業能用的武器不同）；沒給 = 全部 */
        allowedWeapons?: string[];
        /** 外部評分（例如換算成等同大傷）：有給就依分數排序、只列分數 > 0 的，並隱藏自訂權重 */
        scorer?: (enchant: Enchant) => number;
        /** true = 只列與該武器類型相關的賦予；false = 只看裝備限制 */
        relevantOnly?: boolean;
    }>(),
    { relevantOnly: true },
);

const SIDES = [
    { key: "prefix", label: "接頭", placement: "right", tagType: "danger" },
    { key: "suffix", label: "接尾", placement: "left", tagType: "primary" },
] as const;

const quickWeaponType = ref<string>(props.allowedWeapons?.[0] ?? "魔杖");
const filterNonPersonalize = ref<boolean>(false);
const showSourceHighlight = ref<boolean>(false);
const wearBrokenRobe = ref<boolean>(false);
const limitTopN = ref<boolean>(false);
const quickViewTopN = ref<number>(3);

interface WeightSetting {
    abilityId: string;
    weight: number;
}
const weightSettings = ref<WeightSetting[]>([]);
const addWeightRow = () => weightSettings.value.push({ abilityId: "", weight: 1 });
const removeWeightRow = (idx: number) => weightSettings.value.splice(idx, 1);
const getWeightedScore = (enchant: Enchant): number => {
    const map = new Map(mergeEffects(enchant).map((e) => [e.id, e.max]));
    return weightSettings.value.reduce((sum, ws) => (ws.abilityId ? sum + (map.get(ws.abilityId) ?? 0) * ws.weight : sum), 0);
};

// 煉金（鋼瓶）排序權重：4屬性（all_alchemy_damage / AlchemyElementalBonus）權重 4，單一屬性權重 1
const ALCHEMY_SORT_WEIGHTS: Record<string, number> = {
    all_alchemy_damage: 4,
    AlchemyElementalBonus: 4,
    fire_alchemy_damage: 1,
    water_alchemy_damage: 1,
    earth_alchemy_damage: 1,
    wind_alchemy_damage: 1,
};

const getPrimaryValue = (enchant: Enchant, weaponType: string): number => {
    if (weaponType === "鋼瓶") {
        return mergeEffects(enchant).reduce((sum, eff) => sum + (ALCHEMY_SORT_WEIGHTS[eff.id] ?? 0) * eff.max, 0);
    }
    const ids = PRIMARY_IDS[weaponType] ?? [];
    let best = 0;
    for (const eff of mergeEffects(enchant)) {
        if (ids.includes(eff.id)) best = Math.max(best, eff.max);
    }
    return best;
};

const formatEnchantEffects = (enchant: Enchant, weaponType: string): string => {
    const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
    const relevant = props.relevantOnly ? RELEVANT_IDS[weaponType] : undefined;
    const merged = mergeEffects(enchant);
    // 只顯示對應武器的相關屬性；若無符合就不強制顯示其他屬性
    const toShow = relevant ? merged.filter((e) => relevant.has(e.id)) : merged;
    return toShow
        .map((eff) => {
            const name = abilitiesMap[eff.id] ?? eff.id;
            const pct = abilitiesValueWithPercentArray.includes(eff.id) ? "%" : "";
            return eff.min === eff.max ? `${name} ${sign(eff.max)}${pct}` : `${name} ${sign(eff.min)}~${sign(eff.max)}${pct}`;
        })
        .join("  ");
};

const fmtScore = (n: number): string => (Math.abs(n) >= 100 ? Math.round(n).toLocaleString("zh-Hant") : n.toFixed(1));
const scoreText = (e: Enchant): string => (props.scorer ? fmtScore(props.scorer(e)) : "");

interface QuickViewRow {
    label: string;
    prefix: Enchant[];
    suffix: Enchant[];
}

const quickViewData = computed((): QuickViewRow[] => {
    const wType = quickWeaponType.value;
    const topN = limitTopN.value ? quickViewTopN.value : (QUICK_WEAPON_OPTIONS.find((w) => w.label === wType)?.topN ?? 5);
    const hasWeights = weightSettings.value.some((ws) => ws.abilityId);
    const scorer = props.scorer;

    return slotsForWeapon(wType, wearBrokenRobe.value)
        .map((slot) => {
            let applicable = enchantsForSlot(enchants, slot, wType, {
                noPersonalize: filterNonPersonalize.value,
                relevantOnly: props.relevantOnly,
            });
            if (scorer) applicable = applicable.filter((e) => scorer(e) > 0);

            // 排序：外部評分 > 自訂權重 > 主要數值
            const sorted = applicable.slice().sort((a, b) => {
                if (scorer) {
                    const diff = scorer(b) - scorer(a);
                    if (diff !== 0) return diff;
                } else if (hasWeights) {
                    const diff = getWeightedScore(b) - getWeightedScore(a);
                    if (diff !== 0) return diff;
                } else {
                    const va = getPrimaryValue(a, wType);
                    const vb = getPrimaryValue(b, wType);
                    if (va !== vb) return vb - va;
                }
                return b.level - a.level;
            });

            return {
                label: slot.label,
                prefix: sorted.filter((e) => e.type === "prefix").slice(0, topN),
                suffix: sorted.filter((e) => e.type === "suffix").slice(0, topN),
            };
        })
        .filter((row) => row.prefix.length > 0 || row.suffix.length > 0);
});
</script>

<template>
    <div class="space-y-6">
        <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
            <div class="mb-4 border-b border-gray-700 pb-4">
                <h2 class="text-2xl font-bold text-accent">快速檢視</h2>
            </div>
            <el-form label-width="100px" label-position="left">
                <el-form-item label="武器類型">
                    <WeaponTypeSelect v-model="quickWeaponType" :allowed="allowedWeapons" />
                </el-form-item>
                <el-form-item label=" " class="!mb-0">
                    <div class="flex flex-wrap gap-4">
                        <el-checkbox v-model="filterNonPersonalize">
                            <span class="text-sm text-gray-300">不綁專</span>
                            <span class="text-xs text-gray-500 ml-1">（過濾轉專用）</span>
                        </el-checkbox>
                        <el-checkbox v-model="showSourceHighlight">
                            <span class="text-sm text-gray-300">標示 G27 / VH / G28</span>
                            <span class="text-xs text-gray-500 ml-1">（標示出處）</span>
                        </el-checkbox>
                        <el-checkbox v-model="wearBrokenRobe">
                            <span class="text-sm text-gray-300">裝備破袍</span>
                            <span class="text-xs text-gray-500 ml-1">（隱藏袍/翅膀欄）</span>
                        </el-checkbox>
                        <div class="flex items-center gap-2">
                            <el-checkbox v-model="limitTopN">
                                <span class="text-sm text-gray-300">最多顯示</span>
                            </el-checkbox>
                            <el-select v-model="quickViewTopN" :disabled="!limitTopN" style="width: 68px" size="small">
                                <el-option v-for="n in 5" :key="n" :label="`${n} 筆`" :value="n" />
                            </el-select>
                        </div>
                    </div>
                </el-form-item>
                <template v-if="!scorer">
                    <el-divider class="!my-4">
                        <span class="text-gray-400 text-sm">自訂排序權重</span>
                    </el-divider>
                    <div class="space-y-2">
                        <div v-for="(ws, idx) in weightSettings" :key="idx" class="flex items-center gap-2 flex-wrap">
                            <el-select v-model="ws.abilityId" placeholder="選擇能力" filterable clearable style="width: 200px">
                                <el-option
                                    v-for="ability in selectableAbility"
                                    :key="ability"
                                    :label="abilitiesMap[ability] || ability"
                                    :value="ability"
                                />
                            </el-select>
                            <span class="text-gray-400 text-sm">×</span>
                            <el-input-number v-model="ws.weight" :min="0.1" :max="10" :step="0.5" :precision="1" style="width: 110px" />
                            <el-button type="danger" size="small" circle @click="removeWeightRow(idx)">
                                <el-icon><Close /></el-icon>
                            </el-button>
                        </div>
                        <div class="flex gap-2 mt-2">
                            <el-button size="small" @click="addWeightRow">
                                <el-icon class="mr-1"><Plus /></el-icon>
                                新增權重
                            </el-button>
                            <el-button v-if="weightSettings.length > 0" size="small" @click="weightSettings = []">清除全部</el-button>
                        </div>
                        <p v-if="weightSettings.some((ws) => ws.abilityId)" class="text-xs text-gray-500 mt-1">
                            排序分數 = Σ (能力數值 × 權重)，分數越高排越前面
                        </p>
                    </div>
                </template>
            </el-form>
        </el-card>

        <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
            <el-table
                :data="quickViewData"
                border
                class="rounded-lg overflow-hidden"
                :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
            >
                <el-table-column prop="label" label="部位" width="90" align="center" />
                <el-table-column v-for="side in SIDES" :key="side.key" :label="side.label" min-width="240">
                    <template #default="{ row }">
                        <div class="enchant-cell">
                            <span v-if="!row[side.key].length" class="text-gray-600 text-xs">—</span>
                            <el-popover
                                v-for="e in (row[side.key] as Enchant[])"
                                :key="e.id"
                                trigger="hover"
                                :placement="side.placement"
                                :width="300"
                                :show-after="150"
                                :hide-after="80"
                                popper-class="qv-popover"
                            >
                                <template #reference>
                                    <div class="qv-entry" :class="{ 'qv-entry--source': showSourceHighlight && getSourceLabel(e.id) }">
                                        <div class="flex items-center gap-1">
                                            <span class="qv-rank">{{ formatRank(e.level) }}</span>
                                            <span class="text-xs font-medium leading-tight">{{ e.name.tw || e.name.en }}</span>
                                            <el-tag v-if="e.personalize" type="warning" size="small" class="qv-small-tag">專</el-tag>
                                            <template v-if="getSourceLabel(e.id)">
                                                <el-tag v-if="showSourceHighlight" type="success" size="small" class="qv-small-tag">
                                                    {{ getSourceLabel(e.id) }}
                                                </el-tag>
                                                <span v-else class="text-yellow-400 text-xs">★</span>
                                            </template>
                                            <el-tag v-if="isGachaSpecial(e.id)" type="danger" size="small" class="qv-small-tag">轉蛋特規品</el-tag>
                                            <span v-if="scorer" class="qv-score">{{ scoreText(e) }}</span>
                                        </div>
                                        <div class="text-xs text-gray-300 pl-5 leading-tight">
                                            {{ formatEnchantEffects(e, quickWeaponType) }}
                                        </div>
                                    </div>
                                </template>
                                <!-- 詳細資訊 -->
                                <div class="qv-detail">
                                    <div class="qv-detail-header">
                                        <span class="qv-rank">{{ formatRank(e.level) }}</span>
                                        <span class="font-medium text-sm">{{ e.name.tw || e.name.en }}</span>
                                        <el-tag size="small" :type="side.tagType" class="ml-1 !py-0">{{ side.label }}</el-tag>
                                        <el-tag v-if="e.personalize" size="small" type="warning" class="!py-0">專</el-tag>
                                    </div>
                                    <div v-if="e.limit.some((l: string) => l)" class="qv-detail-limit">
                                        <el-tag
                                            v-for="l in e.limit.filter((l: string) => l)"
                                            :key="l"
                                            type="info"
                                            size="small"
                                            class="mr-1 mb-1"
                                        >
                                            {{ l }}
                                        </el-tag>
                                    </div>
                                    <div class="qv-detail-effects" v-html="renderAbilities(e.effect)"></div>
                                    <div class="qv-detail-desc">
                                        <div
                                            v-for="(line, i) in descLines(e.desc)"
                                            :key="i"
                                            :class="line.startsWith('[') ? 'qv-desc-neg' : 'qv-desc-pos'"
                                        >
                                            {{ line }}
                                        </div>
                                    </div>
                                </div>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="mt-3 text-xs text-gray-500">
                ★ /
                <span class="text-green-400">G27</span>
                <span class="text-green-400">VH</span>
                <span class="text-green-400">G28</span>
                = 目前有已知副本來源
                <template v-if="scorer">；金色數字 = 換算後等同的大傷，每格依此由高到低排序</template>
            </div>
        </el-card>
    </div>
</template>

<style>
/* ── 快速檢視 - 格內捲動列表 ──────────────────────── */
.enchant-cell {
    max-height: 260px;
    overflow-y: auto;
    padding: 2px 0;
}
/* scale-75 會讓 tag 視覺縮小但佈局仍佔原始空間，造成對齊偏移 */
/* 改用直接縮小字體與 padding 的方式 */
.qv-small-tag.el-tag {
    font-size: 10px;
    padding: 0 4px;
    height: auto;
    line-height: 1.4;
    flex-shrink: 0;
}

.qv-rank {
    display: inline-block;
    min-width: 18px;
    text-align: center;
    font-size: 0.65rem;
    font-weight: 700;
    color: #fcd34d;
    border: 1px solid #92400e;
    border-radius: 3px;
    padding: 0 2px;
    flex-shrink: 0;
    line-height: 1.4;
}
.qv-entry {
    padding: 3px 0;
    border-bottom: 1px solid #374151;
}
.qv-entry:last-child {
    border-bottom: none;
}
.qv-entry--source {
    background: rgba(16, 185, 129, 0.06);
    border-radius: 4px;
    padding: 3px 4px;
    margin: 1px 0;
}

/* ── 快速檢視 - hover 詳細 popover ──────────────────── */
.qv-popover.el-popper {
    background: #1a2535 !important;
    border: 1px solid #4a5568 !important;
    color: #e2e8f0 !important;
    padding: 10px 12px !important;
}
.qv-popover .el-popper__arrow::before {
    background: #1a2535 !important;
    border-color: #4a5568 !important;
}
.qv-detail-header {
    display: flex;
    align-items: center;
    gap: 5px;
    padding-bottom: 7px;
    margin-bottom: 7px;
    border-bottom: 1px solid #374151;
    font-size: 0.82rem;
}
.qv-detail-limit {
    margin-bottom: 7px;
    line-height: 1.8;
}
.qv-detail-effects {
    font-size: 0.78rem;
    line-height: 1.7;
    padding-bottom: 6px;
    margin-bottom: 6px;
    border-bottom: 1px solid #374151;
    color: #e2e8f0;
}
.qv-detail-desc {
    max-height: 160px;
    overflow-y: auto;
    font-size: 0.78rem;
    line-height: 1.7;
}
.qv-desc-pos {
    color: #e2e8f0;
}
.qv-desc-neg {
    color: #9ca3af;
}
.qv-detail-desc::-webkit-scrollbar {
    width: 4px;
}
.qv-detail-desc::-webkit-scrollbar-thumb {
    background: #4a5568;
    border-radius: 2px;
}
.qv-score {
    margin-left: auto;
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
    color: #fcd34d;
}
</style>
