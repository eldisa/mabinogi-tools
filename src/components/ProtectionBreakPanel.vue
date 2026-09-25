<script setup lang="ts">
// 破保數據：A/B 兩組破防組合比較（破保數據頁、聖盾騎士計算器共用）
import { computed, ref, watch } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import ProtectionCompareControls from "./ProtectionCompareControls.vue";
import { DEFAULT_PROT_COMPARE, findMonster, protBeforePierce, protCompare, protRate } from "../utils/protectionCompare";
import { protectionData } from "../data/protectionData";
import {
    SOURCES,
    STAT_GROUPS,
    DEFAULT_SETTINGS,
    condById,
    valueUnit,
    skillValue,
    type DebuffValue,
    type Source,
    type ValueSettings,
} from "../data/armorBreak";

type KeysOf<T> = { [K in keyof ValueSettings]: ValueSettings[K] extends T ? K : never }[keyof ValueSettings];
interface Param {
    num?: { key: KeysOf<number>; label: string; min: number; max?: number; step?: number; precision?: number }[];
    bool?: { key: KeysOf<boolean>; label: string }[];
}
// 各來源在此頁可調整的裝備／等級（只列影響數值者，持續時間類不列）
const PARAMS: Record<number, Param> = {
    27205: { bool: [{ key: "equip1", label: "裝備1" }, { key: "equip2", label: "裝備2" }] },
    24201: { num: [{ key: "knuckleReforge", label: "細工", min: 0, max: 7 }] },
    35024: { num: [{ key: "hydraEcho", label: "回音石", min: 0, max: 20 }] },
    21006: { num: [{ key: "arrowCircle", label: "魔法陣", min: 0, max: 10 }], bool: [{ key: "arrowSet", label: "套裝" }] },
    27010: { num: [{ key: "reaperReforge", label: "細工", min: 0, max: 25 }], bool: [{ key: "reaperSet", label: "套裝" }] },
    59009: {
        num: [
            { key: "dissonance", label: "每層", min: 0, step: 0.01, precision: 2 },
            { key: "dissonanceStacks", label: "層數", min: 1, max: 5 },
        ],
    },
    521: { num: [{ key: "totem", label: "圖騰", min: 0, max: 5 }] },
    1026: { num: [{ key: "card", label: "卡片", min: 0, max: 30 }] },
    339: { num: [{ key: "rageCircle", label: "魔法陣", min: 0, max: 10 }], bool: [{ key: "rageSet", label: "套裝" }] },
    490431: { num: [{ key: "cloverStacks", label: "層數", min: 1, max: 4 }] },
};
// 寵物俗稱（未列者只顯示條件名）
const PET_NICK: Record<number, string> = { 490411: "貓", 490105: "蒼龍", 490431: "兔子", 490279: "天使貓" };

// 同條件的寵物（數值相同）只列一個
const PICKABLE = SOURCES.filter(
    (s, i) => s.kind !== "pet" || SOURCES.findIndex((t) => t.kind === "pet" && t.conditions.join() === s.conditions.join()) === i,
);
const GROUPS = [
    { kind: "skill", label: "技能" },
    { kind: "pet", label: "寵物" },
    { kind: "self", label: "其他" },
] as const;

const condName = (id: number) => condById.get(id)?.name ?? `#${id}`;
const sourceLabel = (s: Source) => {
    if (s.kind === "skill") return s.name!;
    const name = s.conditions.map(condName).join("、");
    return s.kind === "pet" && PET_NICK[s.id] ? `${name}（${PET_NICK[s.id]}）` : name;
};
const fmt = (n: number) => Number(n.toFixed(2)).toString();
const num = (n: number) => Number(n.toFixed(4)).toString(); // 來源數值保留原精度（1.845）
const valueText = (kind: "prot" | "atk" | undefined, v: DebuffValue) => {
    if (kind === "atk") return `+${num(v.pct)}%`;
    const parts = [];
    if (v.pct > 0) parts.push(`-${num(v.pct)}%`);
    if (v.fixed > 0) parts.push(`-${num(v.fixed)}`);
    return parts.join(" / ");
};
// 來源說明：條件名＋數值（無數值的條件略過）
const sourceDesc = (s: Source, st: ValueSettings) =>
    s.conditions
        .map((id) => {
            const c = condById.get(id);
            const v = skillValue(st, s.id, id);
            if (!c?.valueKind || (v.pct === 0 && v.fixed === 0)) return "";
            return `${c.name} ${valueText(c.valueKind, v)}${valueUnit(c)}`;
        })
        .filter(Boolean)
        .join("、");

// 與此來源施加同一有數值狀態的其他來源（同狀態不疊加，取最高）
const sharesWith = (s: Source) =>
    PICKABLE.filter(
        (t) => t !== s && t.conditions.some((id) => condById.get(id)?.valueKind && s.conditions.includes(id)),
    ).map(sourceLabel);
const SOURCE_NOTES = new Map(
    PICKABLE.map((s) => {
        const shared = sharesWith(s);
        return [s.id, [shared.length ? `與 ${shared.join("、")} 同狀態取最高` : "", s.note ?? ""].filter(Boolean)];
    }),
);

// ===== A / B 設定：銳利等級、施加的來源、裝備數值各自獨立；怪物與比較基準共用 =====
interface Config {
    pierce: number;
    sources: number[];
    settings: ValueSettings;
}
// 預設：勾拳、德拉、刻印、貓、蒼龍、死神烙印、兔子
const defaultConfig = (): Config => ({
    pierce: 11,
    sources: [24201, 35024, 58018, 490411, 490105, 27010, 490431],
    settings: { ...DEFAULT_SETTINGS },
});
const loadConfig = (key: string) => {
    const r = useLocalStorage<Config>(key, defaultConfig());
    r.value = { ...defaultConfig(), ...r.value, settings: { ...DEFAULT_SETTINGS, ...r.value.settings } }; // 舊存檔補新欄位
    return r;
};
// single：只有一組設定（聖盾騎士計算器用），設定另存，不影響破保數據頁的 A/B
// pierce：single 時由呼叫端提供銳利等級（取代內部值）；A/B 模式忽略
const props = defineProps<{ single?: boolean; pierce?: number }>();
const keyPrefix = props.single ? "prot-break:single" : "prot-break";
const protCalc = useLocalStorage(`${keyPrefix}:compare`, { ...DEFAULT_PROT_COMPARE });
const cfgA = loadConfig(props.single ? "prot-break:single:cfg" : "prot-break:cfg-a");
const cfgB = loadConfig("prot-break:cfg-b");
const configs = computed(() =>
    props.single
        ? [{ name: "A", o: cfgA.value }]
        : [
              { name: "A", o: cfgA.value },
              { name: "B", o: cfgB.value },
          ],
);
const cloneConfig = (o: Config): Config => ({ pierce: o.pierce, sources: [...o.sources], settings: { ...o.settings } });
const copyAtoB = () => (cfgB.value = cloneConfig(cfgA.value));
const copyBtoA = () => (cfgA.value = cloneConfig(cfgB.value));

// 各區塊摺疊狀態、物理／魔法結果顯示（只影響畫面，不影響 emit）
const collapsed = useLocalStorage(`${keyPrefix}:collapsed`, { monster: false, A: false, B: false, phys: false, magic: false });
const showSide = useLocalStorage(`${keyPrefix}:sides`, { phys: true, magic: true });

// 來源分類收合（A/B 共用，兩欄才能對齊）；未設定過時：第一類或有啟用來源的分類展開
const groupOpen = useLocalStorage<Record<string, boolean>>(`${keyPrefix}:groups`, {});
const isGroupOpen = (kind: string) =>
    groupOpen.value[kind] ??
    (kind === GROUPS[0].kind || configs.value.some((c) => PICKABLE.some((s) => s.kind === kind && c.o.sources.includes(s.id))));
const toggleGroup = (kind: string) => (groupOpen.value = { ...groupOpen.value, [kind]: !isGroupOpen(kind) });
const setAllGroups = (open: boolean) => (groupOpen.value = Object.fromEntries(GROUPS.map((g) => [g.kind, open])));

// 只顯示差異：勾選不同，或至少一邊有勾且裝備數值不同（會影響計算者）
const diffOnly = useLocalStorage(`${keyPrefix}:diff-only`, false);
const paramKeys = (id: number) => [...(PARAMS[id]?.num ?? []), ...(PARAMS[id]?.bool ?? [])].map((p) => p.key);
const differs = (id: number) => {
    if (props.single) return false;
    const a = cfgA.value;
    const b = cfgB.value;
    const inA = a.sources.includes(id);
    if (inA !== b.sources.includes(id)) return true;
    return inA && paramKeys(id).some((k) => a.settings[k] !== b.settings[k]);
};
const diffMode = computed(() => !props.single && diffOnly.value);
const groupSources = (kind: string) => PICKABLE.filter((s) => s.kind === kind && (!diffMode.value || differs(s.id)));
const diffCount = computed(() => PICKABLE.filter((s) => differs(s.id)).length);

// 窄版（手機）時以分頁切換 A / B，一次顯示一組
const activeCfg = ref<"A" | "B">("A");
const resultsEl = ref<HTMLElement>();
const scrollToResults = () => resultsEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
const toggleSource = (o: Config, id: number) => {
    o.sources = o.sources.includes(id) ? o.sources.filter((x) => x !== id) : [...o.sources, id];
};

// 同一條件由多個來源施加時各分量取高（與破防練習相同），再依 STAT_GROUPS 相加
const totalsOf = (o: Config) => {
    const best = new Map<number, DebuffValue>();
    for (const s of SOURCES) {
        if (!o.sources.includes(s.id)) continue;
        for (const id of s.conditions) {
            const v = skillValue(o.settings, s.id, id);
            const prev = best.get(id) ?? { pct: 0, fixed: 0 };
            best.set(id, { pct: Math.max(prev.pct, v.pct), fixed: Math.max(prev.fixed, v.fixed) });
        }
    }
    return Object.fromEntries(
        STAT_GROUPS.map((g) => [
            g.key,
            g.conds.reduce(
                (acc, id) => {
                    const v = best.get(id);
                    return v ? { pct: acc.pct + v.pct, fixed: acc.fixed + v.fixed } : acc;
                },
                { pct: 0, fixed: 0 },
            ),
        ]),
    ) as Record<string, DebuffValue>;
};

type Side = "phys" | "magic";
const resultOf = (o: Config, side: Side) => {
    const t = totalsOf(o);
    const { pct, fixed } = t[side];
    const pierce = props.single && props.pierce !== undefined ? props.pierce : o.pierce;
    const c = protCompare({ ...protCalc.value, pierce }, pct, fixed);
    const rb = c.rateBefore / 100;
    const dmgInc = t.atk.pct;
    const dealt = (1 - c.rateAfter / 100) * (1 + dmgInc / 100); // 實際承受比例，A/B 互比用
    return {
        ...c,
        pct,
        fixed,
        dmgInc,
        melee: t.melee.pct,
        crit: t.crit.pct,
        dealt,
        total: rb < 1 ? fmt(dealt / (1 - rb)) : "—",
    };
};

const signed = (n: number, unit = "") => (n === 0 ? "—" : `${n > 0 ? "+" : ""}${fmt(n)}${unit}`);

// 從 A、B 中較高的保護往下，依減傷率分段，直到較低者再往下 extra 段
const stepRows = (a: number, b: number, extra = 5) => {
    const low = Math.min(a, b);
    let hi = Math.max(a, b);
    while (hi + 1 < protectionData.length && protRate(hi + 1) === protRate(hi)) hi++;
    const rows = [];
    let below = 0;
    while (hi >= 0 && below < extra) {
        const rate = protRate(hi);
        let lo = hi;
        while (lo > 0 && protRate(lo - 1) === rate) lo--;
        const mark = (v: number) => (v >= lo && v <= hi ? "here" : v > hi ? v - hi : null); // 目前／還需／已低於
        rows.push({ hi, lo, rate: Math.round(rate * 100), a: mark(a), b: mark(b) });
        if (hi < low) below++;
        hi = lo - 1;
    }
    return rows;
};

const SIDES: { key: Side; label: string }[] = [
    { key: "phys", label: "物理" },
    { key: "magic", label: "魔法" },
];
// 對外輸出 A 組物理側結果（聖盾騎士計算器用）；掛載時與 A 組／怪物設定變動時發送
// protBeforePierce／pierceResist：讓呼叫端用自己的銳利等級重算（聖盾頁銳利由各配置提供）
const emit = defineEmits<{
    result: [
        payload: {
            rateAfter: number;
            damageTakenPercent: number;
            critDamagePercent: number;
            protBeforePierce: number;
            pierceResist: number;
        },
    ];
}>();
const resultA = computed(() => {
    const r = resultOf(cfgA.value, "phys");
    return {
        rateAfter: r.rateAfter,
        damageTakenPercent: r.dmgInc,
        critDamagePercent: r.crit,
        protBeforePierce: protBeforePierce(protCalc.value.monster, r.pct, r.fixed),
        pierceResist: findMonster(protCalc.value.monster).pierceResist,
    };
});
watch(resultA, (v) => emit("result", v), { immediate: true });

const sides = computed(() =>
    SIDES.filter(({ key }) => showSide.value[key]).map(({ key, label }) => {
        const a = resultOf(cfgA.value, key);
        const b = resultOf(cfgB.value, key);
        const ratio = b.dealt / a.dealt;
        const diff = !isFinite(ratio) || ratio === 1 ? "相同" : `B ${signed((ratio - 1) * 100, "%")}`;
        return {
            key,
            label,
            totalA: a.total,
            totalB: b.total,
            diff,
            rows: [
                { label: "保護減少", a: `-${fmt(a.pct)}% / -${fmt(a.fixed)}`, b: `-${fmt(b.pct)}% / -${fmt(b.fixed)}`, diff: "" },
                { label: "保護", a: `${a.before} → ${a.after}`, b: `${b.before} → ${b.after}`, diff: signed(b.after - a.after) },
                { label: "減傷率", a: `${a.rateBefore}% → ${a.rateAfter}%`, b: `${b.rateBefore}% → ${b.rateAfter}%`, diff: signed(b.rateAfter - a.rateAfter, "%") },
                { label: "保護倍率", a: `×${a.mult}`, b: `×${b.mult}`, diff: "" },
                { label: "所受傷害", a: `+${fmt(a.dmgInc)}%`, b: `+${fmt(b.dmgInc)}%`, diff: signed(b.dmgInc - a.dmgInc, "%") },
                { label: "總傷害倍率", a: `×${a.total}`, b: `×${b.total}`, diff, strong: true },
                { label: "近戰技能傷害＊", a: `+${fmt(a.melee)}%`, b: `+${fmt(b.melee)}%`, diff: signed(b.melee - a.melee, "%"), minor: true },
                { label: "暴擊傷害＊", a: `+${fmt(a.crit)}%`, b: `+${fmt(b.crit)}%`, diff: signed(b.crit - a.crit, "%"), minor: true },
            ],
            steps: stepRows(a.after, props.single ? a.after : b.after),
        };
    }),
);
</script>



<template>
    <div class="pb-panel">
        <!-- 結果顯示：物理／魔法 -->
        <div class="flex items-center gap-4 mb-3">
            <span class="src-label">顯示結果</span>
            <el-checkbox v-model="showSide.phys" label="物理" />
            <el-checkbox v-model="showSide.magic" label="魔法" />
        </div>

        <!-- 怪物 / 基準（兩組共用） -->
        <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
            <button type="button" class="card-toggle" :aria-expanded="!collapsed.monster" @click="collapsed.monster = !collapsed.monster">
                <h2 class="text-xl font-bold text-accent">怪物</h2>
                <span v-if="!single" class="text-xs text-gray-400">以下設定同時套用於 A / B</span>
                <span class="chevron" :class="{ 'is-collapsed': collapsed.monster }">▼</span>
            </button>
            <ProtectionCompareControls v-show="!collapsed.monster" v-model="protCalc" :show-pierce="false" class="mt-3" />
        </el-card>

        <!-- A / B 設定 -->
        <div class="toolbar mb-3">
            <el-button size="small" @click="setAllGroups(true)">展開全部</el-button>
            <el-button size="small" @click="setAllGroups(false)">收合全部</el-button>
            <el-radio-group v-if="!single" v-model="diffOnly" size="small" aria-label="來源顯示範圍">
                <el-radio-button :value="false">顯示全部</el-radio-button>
                <el-radio-button :value="true">只顯示差異（{{ diffCount }}）</el-radio-button>
            </el-radio-group>
        </div>
        <div v-if="!single" class="cfg-tabs mb-3" role="tablist" aria-label="切換方案">
            <button
                v-for="n in ['A', 'B'] as const"
                :key="n"
                type="button"
                role="tab"
                :aria-selected="activeCfg === n"
                class="cfg-tab"
                :class="[n === 'A' ? 'cfg-tab-a' : 'cfg-tab-b', { 'is-active': activeCfg === n }]"
                @click="activeCfg = n"
            >
                <span class="dot" :class="n === 'A' ? 'dot-a' : 'dot-b'"></span>{{ n }} 方案
            </button>
        </div>
        <div class="cfg-grid mb-4">
            <el-card
                v-for="c in configs"
                :key="c.name"
                class="cfg-card bg-gray-800 border-2 shadow-lg rounded-xl p-4 sm:p-6"
                :class="[single ? 'border-accent/30' : c.name === 'A' ? 'cfg-a' : 'cfg-b', { 'is-inactive': !single && activeCfg !== c.name }]"
            >
                <div class="flex items-center gap-3 flex-wrap">
                    <button
                        type="button"
                        class="card-toggle card-toggle--inline"
                        :aria-expanded="!collapsed[c.name as 'A' | 'B']"
                        @click="collapsed[c.name as 'A' | 'B'] = !collapsed[c.name as 'A' | 'B']"
                    >
                        <h2 v-if="single" class="text-xl font-bold text-accent">破防來源</h2>
                        <h2 v-else class="text-xl font-bold flex items-center gap-2" :class="c.name === 'A' ? 'text-a' : 'text-b'">
                            <span class="dot" :class="c.name === 'A' ? 'dot-a' : 'dot-b'"></span>{{ c.name }} 方案
                        </h2>
                        <span class="chevron" :class="{ 'is-collapsed': collapsed[c.name as 'A' | 'B'] }">▼</span>
                    </button>
                    <!-- single（聖盾頁）的銳利等級由呼叫端提供，不在此設定 -->
                    <template v-if="!single">
                        <span class="src-label">銳利等級</span>
                        <el-select v-model="c.o.pierce" size="small" style="width: 70px" :aria-label="`${c.name} 銳利等級`">
                            <el-option v-for="n in 12" :key="n - 1" :label="n - 1" :value="n - 1" />
                        </el-select>
                    </template>
                    <template v-if="!single">
                        <el-button v-if="c.name === 'A'" size="small" class="ml-auto" @click="copyAtoB">→ 複製到 B</el-button>
                        <el-button v-else size="small" class="ml-auto" @click="copyBtoA">← 複製到 A</el-button>
                    </template>
                </div>
                <div v-show="!collapsed[c.name as 'A' | 'B']" class="mt-3">
                    <p v-if="diffMode && diffCount === 0" class="text-sm text-gray-500 py-2">A、B 的來源設定相同</p>
                    <template v-for="g in GROUPS" :key="g.kind">
                        <template v-if="groupSources(g.kind).length">
                            <button
                                type="button"
                                class="group-title"
                                :aria-expanded="diffMode || isGroupOpen(g.kind)"
                                :disabled="diffMode"
                                @click="toggleGroup(g.kind)"
                            >
                                <span class="chevron" :class="{ 'is-collapsed': !(diffMode || isGroupOpen(g.kind)) }">▼</span>
                                {{ g.label }}
                                <span class="group-count">
                                    {{ groupSources(g.kind).filter((s) => c.o.sources.includes(s.id)).length }} / {{ groupSources(g.kind).length }}
                                </span>
                            </button>
                            <div v-show="diffMode || isGroupOpen(g.kind)" class="flex flex-col mb-2">
                                <div
                                    v-for="s in groupSources(g.kind)"
                                    :key="s.id"
                                    class="src-item"
                                    :class="{ 'is-diff': !diffMode && differs(s.id) }"
                                >
                                    <div class="src-row">
                                        <el-checkbox
                                            :model-value="c.o.sources.includes(s.id)"
                                            :label="sourceLabel(s)"
                                            @change="toggleSource(c.o, s.id)"
                                        />
                                        <template v-for="p in PARAMS[s.id]?.num ?? []" :key="p.key">
                                            <span class="src-label">{{ p.label }}</span>
                                            <el-input-number
                                                v-model="c.o.settings[p.key]"
                                                :min="p.min"
                                                :max="p.max"
                                                :step="p.step ?? 1"
                                                :precision="p.precision"
                                                size="small"
                                                controls-position="right"
                                                :style="{ width: p.precision ? '100px' : '80px' }"
                                                :aria-label="`${c.name} ${sourceLabel(s)} ${p.label}`"
                                            />
                                        </template>
                                        <el-checkbox
                                            v-for="p in PARAMS[s.id]?.bool ?? []"
                                            :key="p.key"
                                            v-model="c.o.settings[p.key]"
                                            :label="p.label"
                                        />
                                    </div>
                                    <div class="src-val" :class="{ 'opacity-50': !c.o.sources.includes(s.id) }">
                                        {{ sourceDesc(s, c.o.settings) }}
                                    </div>
                                    <div v-for="n in SOURCE_NOTES.get(s.id)" :key="n" class="src-note">{{ n }}</div>
                                </div>
                            </div>
                        </template>
                    </template>
                </div>
            </el-card>
        </div>

        <!-- 固定於畫面底部的傷害摘要（捲到結果區時回到原位） -->
        <div v-if="!single && sides.length" class="sticky-summary mb-4" aria-live="polite">
            <div v-for="s in sides" :key="s.key" class="sum-line">
                <span class="sum-side">{{ s.label }}</span>
                <span class="text-a font-semibold">A ×{{ s.totalA }}</span>
                <span class="text-gray-500">→</span>
                <span class="text-b font-semibold">B ×{{ s.totalB }}</span>
                <span class="sum-diff">{{ s.diff }}</span>
            </div>
            <el-button size="small" class="ml-auto" @click="scrollToResults">詳細結果 ↓</el-button>
        </div>

        <!-- 比較結果 -->
        <div ref="resultsEl" class="results-anchor"></div>
        <el-card
            v-for="s in sides"
            :key="s.key"
            class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6"
        >
            <button type="button" class="card-toggle" :aria-expanded="!collapsed[s.key]" @click="collapsed[s.key] = !collapsed[s.key]">
                <h2 class="text-xl font-bold text-accent">{{ s.label }}傷害</h2>
                <span class="chevron" :class="{ 'is-collapsed': collapsed[s.key] }">▼</span>
            </button>
            <div v-show="!collapsed[s.key]" class="mt-3">
                <!-- 結果摘要 -->
                <div class="summary">
                    <div class="summary-cell">
                        <div class="summary-label" :class="{ 'text-a': !single }">{{ single ? "總傷害倍率" : "A 方案" }}</div>
                        <div class="summary-val" :class="single ? 'text-amber-400' : 'text-a'">×{{ s.totalA }}</div>
                    </div>
                    <template v-if="!single">
                        <div class="summary-cell">
                            <div class="summary-label text-b">B 方案</div>
                            <div class="summary-val text-b">×{{ s.totalB }}</div>
                        </div>
                        <div class="summary-cell">
                            <div class="summary-label">實際傷害差異</div>
                            <div class="summary-val text-gray-100">{{ s.diff }}</div>
                        </div>
                    </template>
                </div>

                <div class="overflow-x-auto">
                    <table class="cmp-table">
                        <thead>
                            <tr>
                                <th>項目</th>
                                <th v-if="single">數值</th>
                                <template v-else>
                                    <th class="text-a">A</th>
                                    <th class="text-b">B</th>
                                    <th>差異（B − A）</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="r in s.rows" :key="r.label" :class="{ 'row-strong': r.strong, 'row-minor': r.minor }">
                                <th>{{ r.label }}</th>
                                <td>{{ r.a }}</td>
                                <template v-if="!single">
                                    <td>{{ r.b }}</td>
                                    <td>{{ r.diff }}</td>
                                </template>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3 class="text-sm font-semibold text-gray-300 mt-5 mb-2">破保區間</h3>
                <div class="overflow-x-auto">
                    <table class="cmp-table step-table">
                        <thead>
                            <tr>
                                <th>保護</th>
                                <th>減傷率</th>
                                <th v-if="single">還需</th>
                                <template v-else>
                                    <th class="text-a">A 還需</th>
                                    <th class="text-b">B 還需</th>
                                </template>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="r in s.steps"
                                :key="r.hi"
                                :class="{ 'row-a': r.a === 'here', 'row-b': !single && r.b === 'here' }"
                            >
                                <th>{{ r.lo === r.hi ? r.hi : `${r.lo}–${r.hi}` }}</th>
                                <td>{{ r.rate }}%</td>
                                <td>
                                    <span v-if="r.a === 'here'" class="badge badge-a">{{ single ? "目前" : "A 目前" }}</span>
                                    <template v-else-if="r.a !== null">-{{ r.a }}</template>
                                </td>
                                <td v-if="!single">
                                    <span v-if="r.b === 'here'" class="badge badge-b">B 目前</span>
                                    <template v-else-if="r.b !== null">-{{ r.b }}</template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </el-card>

        <p class="text-center text-xs text-gray-600 pb-6">
            同一狀態由多個來源施加時取數值較高者；不同狀態相加。先扣 %、再扣固定、最後扣銳利；保護無條件捨去後查表。<br />
            「還需」為額外的固定保護減少量。<template v-if="!single">差異百分比為 B 相對 A 的實際傷害（保護減傷 × 所受傷害），與比較基準無關。</template><br />
            ＊近戰技能傷害、暴擊傷害只適用部分攻擊，不計入總傷害倍率；召喚噩夢的最終傷害 +0.9594% 亦未計入。
        </p>
    </div>
</template>

<style scoped>
/* 依面板本身寬度（而非視窗）決定 A/B 並排或分頁切換，嵌入較窄的 tab 時也適用 */
.pb-panel {
    container-type: inline-size;
    --a: #38bdf8;
    --b: #a78bfa;
}
.cfg-grid {
    display: grid;
    gap: 1rem;
}
.cfg-tabs {
    display: none;
}
@container (min-width: 700px) {
    .cfg-grid {
        grid-template-columns: 1fr 1fr;
    }
}
@container (max-width: 699px) {
    .cfg-tabs {
        display: flex;
    }
    .cfg-card.is-inactive {
        display: none;
    }
}
.text-a {
    color: var(--a);
}
.text-b {
    color: var(--b);
}
.dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 9999px;
}
.dot-a {
    background: var(--a);
}
.dot-b {
    background: var(--b);
}
.cfg-a {
    border-color: rgba(56, 189, 248, 0.45);
}
.cfg-b {
    border-color: rgba(167, 139, 250, 0.45);
}
.cfg-a:hover {
    border-color: rgba(56, 189, 248, 0.7);
}
.cfg-b:hover {
    border-color: rgba(167, 139, 250, 0.7);
}
.toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
.toolbar .el-radio-group {
    margin-left: auto;
}
.cfg-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 6px 0;
    border: 1px solid #374151;
    background: #111827;
    color: #9ca3af;
    font-weight: 600;
    cursor: pointer;
}
.cfg-tab:first-child {
    border-radius: 8px 0 0 8px;
}
.cfg-tab:last-child {
    border-radius: 0 8px 8px 0;
}
.cfg-tab-a.is-active {
    color: var(--a);
    border-color: var(--a);
}
.cfg-tab-b.is-active {
    color: var(--b);
    border-color: var(--b);
}
.card-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    background: none;
    border: 0;
    padding: 0;
    color: inherit;
    cursor: pointer;
    text-align: left;
}
.card-toggle--inline {
    width: auto;
}
.chevron {
    font-size: 0.7rem;
    color: #9ca3af;
    transition: transform 0.2s;
}
.card-toggle:not(.card-toggle--inline) .chevron {
    margin-left: auto;
}
.chevron.is-collapsed {
    transform: rotate(-90deg);
}
.group-title {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    font-size: 0.8rem;
    font-weight: 600;
    color: #d1d5db;
    background: none;
    border: 0;
    border-bottom: 1px solid #374151;
    padding: 4px 0;
    margin: 6px 0 2px;
    cursor: pointer;
    text-align: left;
}
.group-title:disabled {
    cursor: default;
}
.group-count {
    margin-left: auto;
    font-weight: 400;
    font-size: 0.72rem;
    color: #6b7280;
}
.src-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}
/* 每個來源一組：勾選＋輸入 → 效果 → 補充說明 */
.src-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 6px;
    border-radius: 6px;
}
.src-item + .src-item {
    border-top: 1px solid #2a3441;
}
.src-item:hover {
    background: rgba(255, 255, 255, 0.03);
}
.src-item.is-diff {
    background: rgba(251, 191, 36, 0.06);
}
.src-val,
.src-note {
    padding-left: 24px;
}
.src-val {
    font-size: 0.75rem;
    color: #aab4c3;
    font-variant-numeric: tabular-nums;
}
.src-note {
    font-size: 0.7rem;
    color: #6b7280;
}
.src-label {
    font-size: 0.8rem;
    color: #9ca3af;
}
.sticky-summary {
    position: sticky;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 6px 20px;
    flex-wrap: wrap;
    padding: 10px 16px;
    background: rgba(17, 24, 39, 0.96);
    border: 1px solid #374151;
    border-radius: 10px;
    font-variant-numeric: tabular-nums;
}
.sum-line {
    display: flex;
    align-items: baseline;
    gap: 8px;
    font-size: 0.9rem;
}
.sum-side {
    font-size: 0.75rem;
    color: #9ca3af;
}
.sum-diff {
    font-weight: 700;
    color: #f3f4f6;
}
.results-anchor {
    scroll-margin-top: 16px;
}
.summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 8px;
    margin-bottom: 12px;
    padding: 10px 12px;
    border: 1px solid #374151;
    border-radius: 8px;
    background: #111827;
    font-variant-numeric: tabular-nums;
}
.summary-cell {
    text-align: center;
}
.summary-label {
    font-size: 0.75rem;
    color: #9ca3af;
}
.summary-val {
    font-size: 1.35rem;
    font-weight: 700;
}
.cmp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}
.cmp-table th,
.cmp-table td {
    padding: 5px 8px;
    border-bottom: 1px solid #374151;
    text-align: right;
}
.cmp-table thead th {
    font-weight: 600;
}
.cmp-table thead th:first-child {
    text-align: left;
}
.cmp-table tbody th {
    text-align: left;
    font-weight: 400;
    color: #9ca3af;
}
.row-strong td {
    font-weight: 700;
    font-size: 1rem;
    color: #fbbf24;
}
.row-minor th,
.row-minor td {
    font-size: 0.78rem;
    color: #6b7280;
}
/* 破保區間：非命中列低對比，命中列加底色 */
.step-table tbody th,
.step-table tbody td {
    color: #6b7280;
}
.step-table tbody tr.row-a th,
.step-table tbody tr.row-a td,
.step-table tbody tr.row-b th,
.step-table tbody tr.row-b td {
    color: #f3f4f6;
    font-weight: 600;
}
.row-a {
    background: rgba(56, 189, 248, 0.16);
}
.row-b {
    background: rgba(167, 139, 250, 0.16);
}
.row-a.row-b {
    background: linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(167, 139, 250, 0.18));
}
.badge {
    font-size: 0.72rem;
    font-weight: 700;
    padding: 1px 8px;
    border-radius: 9999px;
}
.badge-a {
    color: #082f49;
    background: var(--a);
}
.badge-b {
    color: #2e1065;
    background: var(--b);
}
</style>
