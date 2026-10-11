<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Enchant } from "../types/Enchant";
import EnchantQuickView from "../components/EnchantQuickView.vue";
import { abilitiesMap } from "../data/abilities";
import titleJsonData from "../data/title.json";
import dollBagsData from "../data/doll_bags.json";
import reforgeDataRaw from "../../scripts/mabi_reforge_slim_with_race.json";
import { obsoleteTitleIds, isTimedTitle, isRankingTitle } from "../utils/titleFilters";
import {
    applyOverrides,
    parseEffectText,
    profileStatNames,
    sumValues,
    valueOfReforge,
    valueOfStat,
    type ProfileOverrides,
    type ValuedStat,
} from "../data/gearValue";
import { buildShieldKnightProfile } from "../data/gearValueShieldKnight";
import { buildMergedSettings, calculateDamageEfficiency, USAGE_SCENARIOS, type DamageEfficiencyItem } from "../data/shieldKnightCalculator";

// ═══════════════ 效益來源 ═══════════════
const SK_AUTOSAVE_KEY = "shield_knight_calc_autosave_v1";
const SK_SNAPSHOT_KEY = "shield_knight_calc_efficiency_snapshots_v1";
const OVERRIDES_KEY = "gear_value_overrides_v1";
const SETS_KEY = "gear_value_reforge_sets_v1";

type SourceKind = "current" | "snapshot" | "manual";
const source = ref<SourceKind>("current");
const snapshotIndex = ref(0);
const reloadTick = ref(0);

function readJson<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

const snapshots = computed(() => {
    reloadTick.value;
    return readJson<{ name: string; timestamp: number; data: DamageEfficiencyItem[] }[]>(SK_SNAPSHOT_KEY, []);
});

/** 依來源取得「傷害效益」項目；current 直接用聖盾騎士計算器目前的設定即時計算 */
const efficiency = computed<{ items: Pick<DamageEfficiencyItem, "id" | "equivalentMaxDamage">[]; notice: string }>(() => {
    reloadTick.value;
    if (source.value === "snapshot") {
        const snap = snapshots.value[snapshotIndex.value];
        return snap ? { items: snap.data, notice: `使用快照「${snap.name}」` } : { items: [], notice: "沒有可用的快照，請先在聖盾騎士計算器的「傷害效益」分頁儲存。" };
    }
    if (source.value === "manual") return { items: [], notice: "手動模式：只有「最大傷害 = 1」，其餘請在下面的效益表自行填寫。" };
    const settings = buildMergedSettings(readJson(SK_AUTOSAVE_KEY, undefined));
    const notes: string[] = [];
    if (settings.panelMaxDamage <= 0) {
        settings.panelMaxDamage = 2000;
        notes.push("面板最大傷害未填，暫用 2000");
    }
    if (!Object.values(settings.skillUsageCounts).some((n) => n > 0)) {
        Object.assign(settings.skillUsageCounts, USAGE_SCENARIOS[0].counts);
        notes.push(`技能次數未填，暫用範本「${USAGE_SCENARIOS[0].label}」`);
    }
    const items = calculateDamageEfficiency(settings);
    return { items, notice: `使用聖盾騎士計算器目前的設定即時計算${notes.length ? `（${notes.join("、")}）` : ""}` };
});

// ═══════════════ 效益表（可手動覆蓋） ═══════════════
const overrides = ref<ProfileOverrides>(readJson<ProfileOverrides>(OVERRIDES_KEY, { statWeights: {}, levelWeights: {} }));
watch(overrides, (v) => localStorage.setItem(OVERRIDES_KEY, JSON.stringify(v)), { deep: true });

const baseProfile = computed(() => buildShieldKnightProfile(efficiency.value.items));
const profile = computed(() => applyOverrides(baseProfile.value, overrides.value));

interface WeightRow {
    kind: "stat" | "level";
    name: string;
    unit: string;
    weight: number;
    base: number | undefined;
    edited: boolean;
}
const weightRows = computed<WeightRow[]>(() => {
    const rows: WeightRow[] = [];
    for (const name of Object.keys(profile.value.statWeights)) {
        const base = baseProfile.value.statWeights[name];
        rows.push({ kind: "stat", name, unit: "每 1 單位", weight: profile.value.statWeights[name], base, edited: name in overrides.value.statWeights });
    }
    for (const name of Object.keys(profile.value.levelWeights)) {
        const base = baseProfile.value.levelWeights[name];
        rows.push({ kind: "level", name, unit: "每 1 級", weight: profile.value.levelWeights[name], base, edited: name in overrides.value.levelWeights });
    }
    return rows;
});
function setWeight(row: WeightRow, value: number | null | undefined) {
    const target = row.kind === "stat" ? overrides.value.statWeights : overrides.value.levelWeights;
    if (value === null || value === undefined) delete target[row.name];
    else target[row.name] = value;
}
function resetWeight(row: WeightRow) {
    const target = row.kind === "stat" ? overrides.value.statWeights : overrides.value.levelWeights;
    delete target[row.name];
}
const newStatName = ref("");
const newStatWeight = ref(0);
function addCustomStat() {
    const name = newStatName.value.trim();
    if (!name) return;
    overrides.value.statWeights[name] = newStatWeight.value;
    newStatName.value = "";
    newStatWeight.value = 0;
}
function resetAllWeights() {
    overrides.value = { statWeights: {}, levelWeights: {} };
}

const fmt = (n: number): string => (Math.abs(n) >= 100 ? Math.round(n).toLocaleString("zh-Hant") : n.toFixed(1));
const abilityLabel = (id: string): string => abilitiesMap[id] ?? id;

// ═══════════════ 資料查詢 ═══════════════
type QueryKind = "enchant" | "title" | "doll" | "reforge";
const queryKind = ref<QueryKind>("enchant");
const search = ref("");
const onlyValued = ref(true);
const MAX_ROWS = 200;

interface QueryRow {
    key: string;
    name: string;
    tag: string;
    effects: string;
    stats: ValuedStat[];
    value: number;
}
const toRow = (key: string, name: string, tag: string, stats: ValuedStat[]): QueryRow => ({
    key,
    name,
    tag,
    effects: stats.map((s) => `${s.name} ${s.amount}`).join("、"),
    stats,
    value: sumValues(stats),
});

// 賦予：用 EnchantQuickView（排版與賦予快速檢視相同），以效益換算的分數排序
/** 賦予換算成等同大傷；同一個能力出現多筆通常是「使用某稱號時」之類的條件效果，只取第一筆（無條件的基本值），其餘不計 */
const enchantScore = (e: Enchant): number => {
    const seen = new Set<string>();
    return e.effect
        .filter((ef) => !seen.has(ef.id) && !!seen.add(ef.id))
        .reduce((sum, ef) => sum + valueOfStat(profile.value, abilityLabel(ef.id), ef.max).value, 0);
};

// 稱號（只有文字說明，用已知能力名稱去解析）
interface TitleJson {
    ID: string;
    Type: string;
    UniName: string;
    MaleName: string;
    FemaleName: string;
    EffectDescription?: string;
    Duration: string;
    Hint: string;
}
const titleRows = computed<QueryRow[]>(() => {
    const names = profileStatNames(profile.value);
    return (titleJsonData.data as TitleJson[])
        .filter((t) => t.EffectDescription?.trim() && !isTimedTitle(t) && !isRankingTitle(t) && !obsoleteTitleIds.has(t.ID))
        .flatMap((t) => {
            const name = t.UniName !== "none" ? t.UniName : t.MaleName !== "none" ? t.MaleName : t.FemaleName !== "none" ? t.FemaleName : "";
            if (!name) return [];
            const stats = parseEffectText(t.EffectDescription ?? "", names).map((p) => valueOfStat(profile.value, p.name, p.amount));
            return [toRow(t.ID, name, t.Type === "7" ? "二次稱號" : "一般稱號", stats)];
        });
});

// 娃娃背包
interface DollBag {
    id: number;
    name: string;
    effects: { name: string; value: number }[];
}
const dollRows = computed<QueryRow[]>(() =>
    (dollBagsData as DollBag[]).map((b) => toRow(String(b.id), b.name, "娃娃背包", b.effects.map((e) => valueOfStat(profile.value, e.name, e.value)))),
);

// 細工
interface ReforgeEntry {
    name: string;
    maxLevel: number;
    maxLevelBreak: number;
    stepValue: number;
    unit: string;
}
interface ReforgeData {
    library: Record<string, ReforgeEntry>;
    pools: { categories: Record<string, ReforgeEntry[]> };
}
const reforgeData = reforgeDataRaw as unknown as ReforgeData;
const CATEGORY_LABELS: Record<string, string> = {
    body: "衣服",
    hat: "帽子",
    glove: "手套",
    shoes: "鞋子",
    accessory: "飾品",
    shield: "盾牌",
    weapon_melee_oh: "單手近戰武器",
    THSword: "雙手劍",
    weapon_melee_th: "雙手近戰武器",
    weapon_range: "遠距離武器",
    lance: "騎槍",
    scythe: "鐮刀",
    chainblade: "鎖鏈鐮刃",
    dualgun: "雙槍",
    knuckle: "拳套",
    shuriken: "手裡劍",
    staff: "法杖",
    triboltWand: "三叉魔杖",
    healingWand: "治癒魔杖",
    orb: "寶珠",
    cylinder: "圓筒",
    handle: "把手",
    instrument: "樂器",
};
const categoryOptions = Object.keys(reforgeData.pools.categories).map((k) => ({ value: k, label: CATEGORY_LABELS[k] ?? k }));
const reforgeQueryCategory = ref("body");
const reforgeUnitText = (e: ReforgeEntry) => `每級 ${e.stepValue}${e.unit}`;
const reforgeRows = computed<QueryRow[]>(() =>
    (reforgeData.pools.categories[reforgeQueryCategory.value] ?? []).map((e) => {
        const stat = valueOfReforge(profile.value, e, e.maxLevelBreak);
        return {
            key: e.name,
            name: e.name,
            tag: `${reforgeUnitText(e)}・最高 ${e.maxLevel} 級（突破 ${e.maxLevelBreak}）`,
            effects: `滿突破 ${e.maxLevelBreak} 級`,
            stats: [stat],
            value: stat.value,
        };
    }),
);

const queryRows = computed<QueryRow[]>(() => {
    if (queryKind.value === "enchant") return [];
    const base = { title: titleRows, doll: dollRows, reforge: reforgeRows }[queryKind.value].value;
    const keyword = search.value.trim();
    return base
        .filter((r) => (!onlyValued.value || r.value > 0) && (!keyword || r.name.includes(keyword) || r.effects.includes(keyword) || r.tag.includes(keyword)))
        .sort((a, b) => b.value - a.value);
});
const shownRows = computed(() => queryRows.value.slice(0, MAX_ROWS));
const unmappedNames = (stats: ValuedStat[]) => stats.filter((s) => s.weight === null).map((s) => s.name);

// ═══════════════ 細工評價 ═══════════════
interface SetRow {
    name: string;
    level: number;
}
interface EvalSet {
    label: string;
    rows: SetRow[];
}
interface SavedSets {
    category: string;
    sets: EvalSet[];
}
const saved = readJson<SavedSets>(SETS_KEY, {
    category: "body",
    sets: [
        { label: "目前", rows: [{ name: "", level: 1 }, { name: "", level: 1 }, { name: "", level: 1 }] },
        { label: "候選", rows: [{ name: "", level: 1 }, { name: "", level: 1 }, { name: "", level: 1 }] },
    ],
});
const evalCategory = ref(saved.category in reforgeData.pools.categories ? saved.category : "body");
const evalSets = ref<EvalSet[]>(saved.sets);
watch([evalCategory, evalSets], () => localStorage.setItem(SETS_KEY, JSON.stringify({ category: evalCategory.value, sets: evalSets.value })), { deep: true });

const evalEntries = computed(() => reforgeData.pools.categories[evalCategory.value] ?? []);
const entryByName = (name: string) => evalEntries.value.find((e) => e.name === name);
// 換部位時，清掉該部位沒有的細工詞條
watch(evalCategory, () => {
    evalSets.value.forEach((set) =>
        set.rows.forEach((row) => {
            if (row.name && !entryByName(row.name)) row.name = "";
        }),
    );
});

function evaluateSet(set: EvalSet): { rows: (ValuedStat | null)[]; total: number; unmapped: string[] } {
    const rows = set.rows.map((r) => {
        const entry = entryByName(r.name);
        return entry ? valueOfReforge(profile.value, entry, r.level) : null;
    });
    const valued = rows.filter((r): r is ValuedStat => r !== null);
    return { rows, total: sumValues(valued), unmapped: Array.from(new Set(unmappedNames(valued))) };
}
const evaluated = computed(() => evalSets.value.map(evaluateSet));
const evalDiff = computed(() => (evaluated.value.length >= 2 ? evaluated.value[1].total - evaluated.value[0].total : 0));

function addRow(set: EvalSet) {
    set.rows.push({ name: "", level: 1 });
}
function removeRow(set: EvalSet, index: number) {
    set.rows.splice(index, 1);
}
const maxLevelOf = (name: string): number => entryByName(name)?.maxLevelBreak ?? 20;

/** 這個部位效益最高的細工詞條（滿突破），供挑選配置參考 */
const bestEntries = computed(() =>
    evalEntries.value
        .map((e) => ({ entry: e, stat: valueOfReforge(profile.value, e, e.maxLevelBreak) }))
        .filter((x) => x.stat.value > 0)
        .sort((a, b) => b.stat.value - a.stat.value)
        .slice(0, 8),
);
</script>

<template>
    <div class="gv-page">
        <h1 class="gv-title">
            <span class="text-gradient">裝備效益換算</span>
            <span class="gv-subtitle">把賦予、稱號、娃娃背包、細工的素質換算成「等同大傷」，方便比較</span>
        </h1>

        <!-- 效益來源 -->
        <el-card class="gv-card">
            <div class="gv-section-title">效益來源（目前職業：聖盾騎士）</div>
            <div class="gv-row">
                <el-radio-group v-model="source" size="small">
                    <el-radio-button value="current">聖盾騎士計算器目前設定</el-radio-button>
                    <el-radio-button value="snapshot">已儲存的傷害效益快照</el-radio-button>
                    <el-radio-button value="manual">自行輸入</el-radio-button>
                </el-radio-group>
                <el-select v-if="source === 'snapshot'" v-model="snapshotIndex" size="small" style="width: 220px">
                    <el-option v-for="(s, i) in snapshots" :key="s.timestamp" :value="i" :label="s.name" />
                </el-select>
                <el-button size="small" plain @click="reloadTick++">重新讀取</el-button>
            </div>
            <div class="gv-hint">{{ efficiency.notice }}。換算用的是目前設定下的「邊際效益」，數值很大的組合會有些誤差。</div>

            <el-collapse class="gv-collapse">
                <el-collapse-item title="效益表（每 1 單位等同多少大傷，可自行修改）" name="weights">
                    <div class="gv-hint">聖盾騎士的「暴擊率」預設為 0：遊戲有暴擊率上限，只能靠卡莉亞赫的結界或活動 buff 拉高，裝備提供的暴擊率可忽略；「暴擊上限增加」才吃傷害效益的「暴擊率上限」。</div>
                    <table class="gv-table">
                        <thead>
                            <tr>
                                <th>能力／細工詞條</th>
                                <th>單位</th>
                                <th>等同大傷</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="row in weightRows" :key="row.kind + row.name">
                                <td>{{ row.name }}</td>
                                <td>{{ row.unit }}</td>
                                <td>
                                    <el-input-number
                                        :model-value="row.weight"
                                        size="small"
                                        :step="0.1"
                                        :precision="2"
                                        :controls="false"
                                        @change="(v: number | undefined) => setWeight(row, v)"
                                    />
                                </td>
                                <td>
                                    <el-button v-if="row.edited && row.base !== undefined" size="small" text @click="resetWeight(row)">還原（{{ fmt(row.base) }}）</el-button>
                                    <el-button v-else-if="row.edited" size="small" text @click="resetWeight(row)">移除</el-button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="gv-row">
                        <el-input v-model="newStatName" size="small" placeholder="新增能力名稱，例如：魔法攻擊力" style="width: 240px" />
                        <el-input-number v-model="newStatWeight" size="small" :step="0.1" :precision="2" :controls="false" />
                        <el-button size="small" type="primary" plain @click="addCustomStat">新增</el-button>
                        <el-button size="small" plain @click="resetAllWeights">全部還原</el-button>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </el-card>

        <el-tabs type="border-card" class="gv-tabs">
            <!-- 1. 資料查詢 -->
            <el-tab-pane label="資料查詢">
                <div class="gv-row">
                    <el-radio-group v-model="queryKind" size="small">
                        <el-radio-button value="enchant">賦予</el-radio-button>
                        <el-radio-button value="title">稱號</el-radio-button>
                        <el-radio-button value="doll">娃娃背包</el-radio-button>
                        <el-radio-button value="reforge">細工</el-radio-button>
                    </el-radio-group>
                    <el-select v-if="queryKind === 'reforge'" v-model="reforgeQueryCategory" size="small" style="width: 160px">
                        <el-option v-for="o in categoryOptions" :key="o.value" :value="o.value" :label="o.label" />
                    </el-select>
                    <template v-if="queryKind !== 'enchant'">
                        <el-input v-model="search" size="small" clearable placeholder="搜尋名稱或效果" style="width: 220px" />
                        <el-checkbox v-model="onlyValued">只顯示有換算值的</el-checkbox>
                    </template>
                </div>
                <EnchantQuickView
                    v-if="queryKind === 'enchant'"
                    :allowed-weapons="profile.weaponTypes"
                    :scorer="enchantScore"
                    :relevant-only="false"
                />
                <div v-else class="gv-hint">
                    依「相當大傷」由高到低排序，細工以滿突破計算；稱號只有文字說明，用已知能力名稱解析，可能有漏。共 {{ queryRows.length }} 筆，顯示前 {{ MAX_ROWS }} 筆。
                </div>
                <table v-if="queryKind !== 'enchant'" class="gv-table">
                    <thead>
                        <tr>
                            <th>名稱</th>
                            <th>類型／限制</th>
                            <th>效果</th>
                            <th class="gv-num">相當大傷</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="r in shownRows" :key="queryKind + r.key">
                            <td>{{ r.name }}</td>
                            <td class="gv-muted">{{ r.tag }}</td>
                            <td>
                                {{ r.effects }}
                                <span v-if="unmappedNames(r.stats).length" class="gv-muted">（未計入：{{ unmappedNames(r.stats).join("、") }}）</span>
                            </td>
                            <td class="gv-num">{{ fmt(r.value) }}</td>
                        </tr>
                        <tr v-if="shownRows.length === 0">
                            <td colspan="4" class="gv-muted">沒有符合的資料</td>
                        </tr>
                    </tbody>
                </table>
            </el-tab-pane>

            <!-- 2. 細工評價 -->
            <el-tab-pane label="細工評價">
                <div class="gv-row">
                    <label>裝備部位</label>
                    <el-select v-model="evalCategory" size="small" style="width: 180px">
                        <el-option v-for="o in categoryOptions" :key="o.value" :value="o.value" :label="o.label" />
                    </el-select>
                    <span class="gv-hint">先選部位，再選細工詞條並填等級（可填到突破等級）；左右兩組可以比較「目前」與「候選」。</span>
                </div>

                <div class="gv-sets">
                    <div v-for="(set, si) in evalSets" :key="si" class="gv-set">
                        <el-input v-model="set.label" size="small" class="gv-set-label" />
                        <div v-for="(row, ri) in set.rows" :key="ri" class="gv-set-row">
                            <el-select v-model="row.name" size="small" filterable clearable placeholder="選擇細工詞條" class="gv-entry">
                                <el-option v-for="e in evalEntries" :key="e.name" :value="e.name" :label="e.name" />
                            </el-select>
                            <el-input-number v-model="row.level" size="small" :min="1" :max="maxLevelOf(row.name)" :controls="false" class="gv-level" />
                            <span class="gv-value">{{ evaluated[si].rows[ri] ? fmt(evaluated[si].rows[ri]!.value) : "-" }}</span>
                            <el-button size="small" text @click="removeRow(set, ri)">✕</el-button>
                        </div>
                        <el-button size="small" plain @click="addRow(set)">新增一條</el-button>
                        <div class="gv-total">合計：相當 <b>{{ fmt(evaluated[si].total) }}</b> 大傷</div>
                        <div v-if="evaluated[si].unmapped.length" class="gv-hint">未計入：{{ evaluated[si].unmapped.join("、") }}（沒有對應的效益設定）</div>
                    </div>
                </div>
                <div v-if="evalSets.length >= 2" class="gv-total">
                    「{{ evalSets[1].label }}」比「{{ evalSets[0].label }}」{{ evalDiff >= 0 ? "多" : "少" }} <b>{{ fmt(Math.abs(evalDiff)) }}</b> 大傷
                </div>

                <div class="gv-section-title">此部位效益最高的細工詞條（滿突破）</div>
                <div v-if="bestEntries.length === 0" class="gv-hint">此部位沒有可換算的細工詞條，可到上方效益表新增對應的詞條效益。</div>
                <table v-else class="gv-table">
                    <thead>
                        <tr>
                            <th>細工詞條</th>
                            <th>每級數值</th>
                            <th>滿突破等級</th>
                            <th class="gv-num">相當大傷</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="b in bestEntries" :key="b.entry.name">
                            <td>{{ b.entry.name }}</td>
                            <td>{{ b.entry.stepValue }}{{ b.entry.unit }}</td>
                            <td>{{ b.entry.maxLevelBreak }}</td>
                            <td class="gv-num">{{ fmt(b.stat.value) }}</td>
                        </tr>
                    </tbody>
                </table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style scoped>
.gv-page {
    padding: 1.5rem;
    max-width: 1280px;
    margin: 0 auto;
    box-sizing: border-box;
}
.gv-title {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1rem;
    font-size: 1.8rem;
}
.gv-subtitle {
    font-size: 1rem;
    font-weight: 400;
    color: var(--color-text-muted, #9ca3af);
}
.gv-card {
    margin-bottom: 1rem;
}
.gv-section-title {
    margin: 0.5rem 0;
    font-weight: 700;
}
.gv-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
}
.gv-hint {
    font-size: 0.8rem;
    color: var(--color-text-muted, #9ca3af);
    margin: 0.35rem 0;
}
.gv-muted {
    color: var(--color-text-muted, #9ca3af);
    font-size: 0.85rem;
}
.gv-table {
    width: 100%;
    border-collapse: collapse;
    margin: 0.5rem 0;
}
.gv-table th,
.gv-table td {
    padding: 0.35rem 0.5rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
    text-align: left;
    vertical-align: top;
}
.gv-num {
    text-align: right !important;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
.gv-sets {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1rem;
    margin: 0.75rem 0;
}
.gv-set {
    padding: 0.75rem;
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 8px;
}
.gv-set-label {
    width: 140px;
    margin-bottom: 0.5rem;
}
.gv-set-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.4rem;
}
.gv-entry {
    flex: 1;
    min-width: 0;
}
.gv-level {
    width: 64px;
}
.gv-value {
    width: 64px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}
.gv-total {
    margin: 0.5rem 0;
}
.gv-tabs {
    margin-top: 1rem;
}
.gv-collapse {
    margin-top: 0.5rem;
}
</style>
