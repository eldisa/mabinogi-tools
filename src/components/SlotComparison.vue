<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { calculateDamageEfficiency, calculateTotalOutput, WEAPON_PRESETS, type ShieldKnightSettings } from "../data/shieldKnightCalculator";
import { applyPartDeltas, COMPARE_PARTS, createPartDelta, summarizePartDelta, type ComparePartKey, type PartDelta, type PartDeltas } from "../data/slotComparison";

/** 部位比較：上面設定條件，按「加入表格」新增一列；沒設定差異的部位視為與目前相同 */
const props = defineProps<{ settings: ShieldKnightSettings }>();

interface Row {
    id: number;
    name: string;
    deltas: PartDeltas;
}

const weaponOptions = computed(() => WEAPON_PRESETS[props.settings.weaponType]);
const weaponLabel = (id: string) => weaponOptions.value.find((w) => w.id === id)?.label ?? id;

// 表單：每個部位一個「與目前相同」checkbox，取消勾選才填差異
const same = reactive<Record<ComparePartKey, boolean>>(Object.fromEntries(COMPARE_PARTS.map((p) => [p.key, true])) as Record<ComparePartKey, boolean>);
const form = reactive<Record<ComparePartKey, PartDelta>>(Object.fromEntries(COMPARE_PARTS.map((p) => [p.key, createPartDelta()])) as Record<ComparePartKey, PartDelta>);
const hasReforge = (key: ComparePartKey) => key === "weapon" || key === "accessory1" || key === "accessory2";

const rows = ref<Row[]>([]);
let nextId = 1;
const canAdd = computed(() => COMPARE_PARTS.some((p) => !same[p.key]));

function addRow() {
    const deltas: PartDeltas = {};
    for (const p of COMPARE_PARTS) if (!same[p.key]) deltas[p.key] = { ...form[p.key] };
    rows.value.push({ id: nextId, name: `方案 ${nextId}`, deltas });
    nextId += 1;
}
const removeRow = (id: number) => (rows.value = rows.value.filter((r) => r.id !== id));
function resetForm() {
    for (const p of COMPARE_PARTS) {
        same[p.key] = true;
        form[p.key] = createPartDelta();
    }
}

// 結果：基準＝目前設定；每列完整重算
const counts = computed(() => props.settings.skillUsageCounts);
const baseTotal = computed(() => calculateTotalOutput(props.settings, counts.value));
/** 面板大傷 +1 約增加的總輸出%，用來把差距換算成「相當多少面板大傷」（線性近似） */
const percentPerPanelPoint = computed(() => calculateDamageEfficiency(props.settings).find((i) => i.id === "maxDamage")?.deltaPercent ?? 0);
const results = computed(() =>
    rows.value.map((r) => {
        const total = calculateTotalOutput(applyPartDeltas(props.settings, r.deltas), counts.value);
        const percent = baseTotal.value > 0 ? (total / baseTotal.value - 1) * 100 : 0;
        return { id: r.id, total, percent, equivalent: percentPerPanelPoint.value > 0 ? percent / percentPerPanelPoint.value : null };
    }),
);
const bestId = computed(() => (results.value.length > 0 ? results.value.reduce((a, b) => (b.total > a.total ? b : a)).id : null));

const fmtInt = (n: number) => Math.round(n).toLocaleString("zh-Hant");
const fmtPercent = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
const fmtEq = (n: number | null) => (n === null ? "-" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}`);
</script>

<template>
    <div class="sc">
        <div class="sc-hint">
            基準是目前頁面上的設定，其他部位全部維持不變。每個部位填的是「相較目前多或少多少」（面板大傷要填差值，不要重填整個面板，否則目前裝備的大傷會重複計算）；沒有差異就勾「與目前相同」。
        </div>

        <div class="sc-form">
            <div v-for="p in COMPARE_PARTS" :key="p.key" class="sc-part" :class="{ 'sc-part--off': same[p.key] }">
                <div class="sc-part-head">
                    <strong>{{ p.label }}</strong>
                    <el-checkbox v-model="same[p.key]">與目前相同</el-checkbox>
                </div>
                <div v-if="!same[p.key]" class="sc-fields">
                    <el-select v-if="p.key === 'weapon'" v-model="form.weapon.weaponId" size="small" clearable placeholder="換武器（不換就留空）" class="sc-wide">
                        <el-option v-for="w in weaponOptions" :key="w.id" :value="w.id" :label="w.label" />
                    </el-select>
                    <label>面板大傷差<el-input-number v-model="form[p.key].maxDamage" size="small" :controls="false" /></label>
                    <label>暴擊傷害 %<el-input-number v-model="form[p.key].criticalDamage" size="small" :controls="false" /></label>
                    <label>額外傷害 %<el-input-number v-model="form[p.key].extraDamage" size="small" :controls="false" /></label>
                    <template v-if="hasReforge(p.key)">
                        <label>重擊細工<el-input-number v-model="form[p.key].smash" size="small" :controls="false" /></label>
                        <label>風車細工<el-input-number v-model="form[p.key].windmill" size="small" :controls="false" /></label>
                        <label>突擊細工<el-input-number v-model="form[p.key].charge" size="small" :controls="false" /></label>
                    </template>
                </div>
            </div>
        </div>
        <div class="sc-actions">
            <el-button type="primary" size="small" :disabled="!canAdd" @click="addRow">加入表格</el-button>
            <el-button size="small" plain @click="resetForm">清除條件</el-button>
        </div>

        <div class="sc-table-wrap">
            <table class="sc-table">
                <thead>
                    <tr>
                        <th>方案</th>
                        <th v-for="p in COMPARE_PARTS" :key="p.key">{{ p.label }}</th>
                        <th class="sc-num">總輸出</th>
                        <th class="sc-num">相較目前</th>
                        <th class="sc-num">約等於面板大傷</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="sc-base">
                        <td>目前設定</td>
                        <td v-for="p in COMPARE_PARTS" :key="p.key" class="sc-same">—</td>
                        <td class="sc-num">{{ fmtInt(baseTotal) }}</td>
                        <td class="sc-num">—</td>
                        <td class="sc-num">—</td>
                        <td></td>
                    </tr>
                    <tr v-for="(r, i) in rows" :key="r.id" :class="{ 'sc-best': results[i].id === bestId && rows.length > 1 }">
                        <td><el-input v-model="r.name" size="small" /></td>
                        <td v-for="p in COMPARE_PARTS" :key="p.key" :class="{ 'sc-same': !r.deltas[p.key] }">
                            {{ summarizePartDelta(r.deltas[p.key], weaponLabel) ?? (r.deltas[p.key] ? "（無差異）" : "—") }}
                        </td>
                        <td class="sc-num">{{ fmtInt(results[i].total) }}</td>
                        <td class="sc-num" :class="results[i].percent >= 0 ? 'sc-up' : 'sc-down'">{{ fmtPercent(results[i].percent) }}</td>
                        <td class="sc-num">{{ fmtEq(results[i].equivalent) }}</td>
                        <td><el-button size="small" text @click="removeRow(r.id)">✕</el-button></td>
                    </tr>
                    <tr v-if="rows.length === 0">
                        <td :colspan="COMPARE_PARTS.length + 5" class="sc-same">還沒有方案，請在上方設定條件後按「加入表格」。</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="sc-hint">「約等於面板大傷」用面板大傷每點的邊際效益線性換算，差距很大時只當參考；總輸出依「技能使用次數」分頁的次數計算。</div>
    </div>
</template>

<style scoped>
.sc-hint {
    font-size: 0.8rem;
    color: var(--color-text-muted, #9ca3af);
    margin: 0.35rem 0;
}
.sc-form {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 0.5rem;
    margin: 0.5rem 0;
}
.sc-part {
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 8px;
    padding: 0.5rem 0.75rem;
}
.sc-part--off {
    opacity: 0.7;
}
.sc-part-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.sc-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem 0.6rem;
    margin-top: 0.4rem;
}
.sc-fields label {
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    gap: 2px;
}
.sc-fields :deep(.el-input-number) {
    width: 100%;
}
.sc-wide {
    grid-column: 1 / -1;
}
.sc-actions {
    display: flex;
    gap: 0.5rem;
    margin: 0.5rem 0;
}
.sc-table-wrap {
    overflow-x: auto;
}
.sc-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
}
.sc-table th,
.sc-table td {
    padding: 0.35rem 0.5rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
    text-align: left;
    vertical-align: top;
}
.sc-table td,
.sc-table th {
    min-width: 5.5rem;
}
.sc-table td:first-child {
    min-width: 7rem;
}
.sc-num {
    text-align: right !important;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
}
.sc-same {
    color: var(--color-text-muted, #9ca3af);
}
.sc-base td {
    font-weight: 600;
}
.sc-best td {
    background: rgba(16, 185, 129, 0.08);
}
.sc-up {
    color: #34d399;
}
.sc-down {
    color: #f87171;
}
</style>
