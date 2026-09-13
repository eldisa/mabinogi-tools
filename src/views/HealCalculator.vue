<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import {
    PRIMARY_TITLES,
    SECONDARY_TITLES,
    WEAPONS,
    WEAPON_GRADE_OPTIONS,
    WEAPON_UPGRADE_OPTIONS,
    NIGHTBRINGER_UPGRADE_OPTIONS,
    RELIC_ENCHANT_OPTIONS,
    HEALING_MINIATURES,
    SPECIAL_UPGRADE_STAGE_OPTIONS,
    WAND_REFORGE_OPTIONS,
    ARMOR_REFORGE_OPTIONS,
    ACCESSORY_PARTY_REFORGE_OPTIONS,
    ACCESSORY_HEALING_REFORGE_OPTIONS,
    ERG_RECOVERY_OPTIONS,
    ERG_HEAL_EFFICIENCY_OPTIONS,
    DARK_ERG_OPTIONS,
    AMULET_HEALING_OPTIONS,
    RELIC_GUME_OPTIONS,
    TOTEM_HEALING_OPTIONS,
    ACCESSORY_PREFIX_ENCHANT_OPTIONS,
    ACCESSORY_SUFFIX_ENCHANT_OPTIONS,
    HEAD_PREFIX_ENCHANT_OPTIONS,
    HEAD_SUFFIX_ENCHANT_OPTIONS,
    BODY_PREFIX_ENCHANT_OPTIONS,
    BODY_SUFFIX_ENCHANT_OPTIONS,
    HAND_PREFIX_ENCHANT_OPTIONS,
    HAND_SUFFIX_ENCHANT_OPTIONS,
    FOOT_PREFIX_ENCHANT_OPTIONS,
    FOOT_SUFFIX_ENCHANT_OPTIONS,
    DEFAULT_HEAL_CALC_SETTINGS,
    calculateAll,
    calculatePartyHealing,
    calculateHealing,
    calculateSonicBaptism,
    type HealCalcSettings,
    type RangeValue,
} from "../data/healCalculator";

const settings = reactive<HealCalcSettings>({ ...DEFAULT_HEAL_CALC_SETTINGS });
const activeTab = ref("base");

const isNightbringer = computed(() => settings.weaponId === "nightbringer_savior");
const isMasterGradeWeapon = computed(() => settings.weaponId === "soul_liberate_healing_wand");
const isNightbringerClassWeapon = computed(() => isNightbringer.value || isMasterGradeWeapon.value);
const upgradeOptions = computed(() => (isNightbringer.value ? NIGHTBRINGER_UPGRADE_OPTIONS : WEAPON_UPGRADE_OPTIONS));

const result = computed(() => calculateAll(settings));

const fmtRange = (r: RangeValue | undefined): string => {
    if (!r) return "-";
    return r.min === r.max ? r.max.toLocaleString("zh-Hant") : `${r.min.toLocaleString("zh-Hant")} ~ ${r.max.toLocaleString("zh-Hant")}`;
};

const resetAll = () => {
    Object.assign(settings, DEFAULT_HEAL_CALC_SETTINGS);
};

// ═══════════════════════════════════════════════════════
//  紀錄保存 / 讀取
// ═══════════════════════════════════════════════════════
const HEAL_CALC_STORAGE_KEY = "heal_calc_presets_v1";

interface HealCalcPreset {
    name: string;
    timestamp: number;
    data: HealCalcSettings;
}

function loadAllPresets(): HealCalcPreset[] {
    try {
        const raw = localStorage.getItem(HEAL_CALC_STORAGE_KEY);
        if (raw) return JSON.parse(raw) || [];
    } catch {
        /* ignore */
    }
    return [];
}

const presets = ref<HealCalcPreset[]>(loadAllPresets());
const newPresetName = ref("");
const showPresetPanel = ref(false);

function persistPresets() {
    localStorage.setItem(HEAL_CALC_STORAGE_KEY, JSON.stringify(presets.value));
}

function savePreset() {
    const name = newPresetName.value.trim() || `配置 ${presets.value.length + 1}`;
    presets.value.push({ name, timestamp: Date.now(), data: JSON.parse(JSON.stringify(settings)) });
    persistPresets();
    newPresetName.value = "";
}

function loadPreset(idx: number) {
    const data = presets.value[idx]?.data;
    if (!data) return;
    Object.assign(settings, DEFAULT_HEAL_CALC_SETTINGS, data);
}

function deletePreset(idx: number) {
    presets.value.splice(idx, 1);
    persistPresets();
}

function renamePreset(idx: number, name: string) {
    const item = presets.value[idx];
    if (item) {
        item.name = name;
        persistPresets();
    }
}

function fmtDate(ts: number): string {
    return new Date(ts).toLocaleString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}

onMounted(() => {
    if (presets.value.length > 0) loadPreset(0);
});

// ═══════════════════════════════════════════════════════
//  提升效益分析
// ═══════════════════════════════════════════════════════
type MetricKey = "party" | "heal" | "sonic";

/** 顯示哪些指標的提升幅度；同時決定「選項型」欄位該以哪個指標挑選最佳選項 */
const analysisTargets = reactive({ party: true, heal: true, sonic: false });
const priorityTarget = computed<MetricKey>(() =>
    analysisTargets.party ? "party" : analysisTargets.heal ? "heal" : "sonic",
);

function metricValue(target: MetricKey, s: HealCalcSettings): number {
    if (target === "party") return calculatePartyHealing(s).gume!.max;
    if (target === "heal") return calculateHealing(s).chison!.max;
    return calculateSonicBaptism(s).defensePerStack;
}

function metricSnapshot(s: HealCalcSettings) {
    return { party: metricValue("party", s), heal: metricValue("heal", s), sonic: metricValue("sonic", s) };
}

interface ImproveRow {
    id: string;
    name: string;
    curLabel: string;
    bestLabel: string;
    dParty: number;
    dHeal: number;
    dSonic: number;
    /** 目前值到最佳值的「數值差」，僅數值型欄位才有值，供每 1 點/級換算用 */
    steps?: number;
    apply: (target: HealCalcSettings) => void;
}

const improveItems = computed<ImproveRow[]>(() => {
    const base = metricSnapshot(settings);
    const priority = priorityTarget.value;
    const rows: ImproveRow[] = [];

    // 從候選清單中，挑出對「優先指標」增益最大的一個，並回傳三個指標各自的增益
    const tryField = (
        id: string,
        name: string,
        key: keyof HealCalcSettings,
        candidates: { value: unknown; label: string }[],
        curLabel: string,
    ) => {
        const usable = candidates.filter((c) => c.value !== (settings as Record<string, unknown>)[key]);
        if (usable.length === 0) return;
        let best = usable[0];
        let bestScore = -Infinity;
        for (const c of usable) {
            const score = metricValue(priority, { ...settings, [key]: c.value });
            if (score > bestScore) {
                bestScore = score;
                best = c;
            }
        }
        const after = metricSnapshot({ ...settings, [key]: best.value });
        const dParty = after.party - base.party;
        const dHeal = after.heal - base.heal;
        const dSonic = after.sonic - base.sonic;
        // 只有「優先指標」本身有正提升才列入，避免顯示對優先指標反而變差的選項
        const dPriority = priority === "party" ? dParty : priority === "heal" ? dHeal : dSonic;
        if (dPriority <= 0.0001) return;
        const curVal = (settings as Record<string, unknown>)[key];
        const steps = typeof curVal === "number" && typeof best.value === "number" ? Math.abs(best.value - curVal) : undefined;
        rows.push({
            id,
            name,
            curLabel,
            bestLabel: best.label,
            dParty,
            dHeal,
            dSonic,
            steps,
            apply: (target) => {
                (target as Record<string, unknown>)[key] = best.value;
            },
        });
    };

    // 數值上限型：目前值 → 該欄位的最高值
    const LEVEL_FIELDS: { key: keyof HealCalcSettings; label: string; max: number; visible?: () => boolean }[] = [
        { key: "wandReforgeLevel", label: "武器 · 組隊治療細工等級", max: 25 },
        { key: "darkErgLevel", label: "黑暗聚能 治癒效率", max: 50 },
        { key: "armorReforgeLevel", label: "身體 · 治癒細工等級", max: 25 },
        { key: "accessory1PartyHealingLevel", label: "飾品1 · 組隊治療細工", max: 4 },
        { key: "accessory1HealingLevel", label: "飾品1 · 治療細工", max: 4 },
        { key: "accessory2PartyHealingLevel", label: "飾品2 · 組隊治療細工", max: 4 },
        { key: "accessory2HealingLevel", label: "飾品2 · 治療細工", max: 4 },
        { key: "holyWaterPercent", label: "聖水 治癒效果%（總和）", max: 80 },
        { key: "accessoryPrefixEnchantPercent", label: "賦予 · 飾品接頭（贖罪的）", max: Math.max(...ACCESSORY_PREFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "accessorySuffixEnchantPercent", label: "賦予 · 飾品接尾（旅程）", max: Math.max(...ACCESSORY_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "headPrefixEnchantPercent", label: "賦予 · 頭接頭（救濟的）", max: Math.max(...HEAD_PREFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "headSuffixEnchantPercent", label: "賦予 · 頭接尾（恩寵）", max: Math.max(...HEAD_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "bodyPrefixEnchantPercent", label: "賦予 · 身接頭（慈悲的/包覆的）", max: Math.max(...BODY_PREFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "bodySuffixEnchantPercent", label: "賦予 · 身接尾（安息）", max: Math.max(...BODY_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "handPrefixEnchantPercent", label: "賦予 · 手接頭（誓約的）", max: Math.max(...HAND_PREFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "handSuffixEnchantPercent", label: "賦予 · 手接尾（渴望）", max: Math.max(...HAND_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "footPrefixEnchantPercent", label: "賦予 · 腳接頭（誓約的）", max: Math.max(...FOOT_PREFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "footSuffixEnchantPercent", label: "賦予 · 腳接尾（渴望）", max: Math.max(...FOOT_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value)) },
        { key: "amuletHealingPercent", label: "護身符 · 治癒效果 %", max: 12 },
        { key: "relicGumeEffect", label: "遺物 · 救贖回聲 %", max: 10 },
        { key: "brireheHealingPercent", label: "布里萊赫的硬幣（支援） · 治癒效果 %", max: 20 },
        { key: "totemHealingEffect", label: "圖騰 · 治癒效果 %", max: 10 },
        { key: "arcanaAwakeningHealingPercent", label: "奧秘覺醒獎勵 %", max: 20 },
        { key: "ergRecovery", label: "聚能 魔力恢復效果", max: 20 },
        { key: "ergHealEfficiency", label: "聚能 提高治癒效率", max: 20 },
        { key: "spiritYuksungLevel", label: "精靈育成", max: 5 },
        { key: "spiritYeonmaLevel", label: "精靈研磨", max: 5 },
        { key: "spiritJejeLevel", label: "精靈操控", max: 5 },
        { key: "oghamHealingMaxRecovery", label: "符文 · 治癒最大回復量", max: 50 },
        { key: "oghamPartyHealingMaxRecovery", label: "符文 · 組隊治療最大回復量", max: 50 },
        { key: "spiritMatBuffLevel", label: "精靈實體化強化階段", max: 5, visible: () => settings.isSpiritImplementationActive },
        { key: "specialUpgradeStage", label: "特別改造階段", max: 8, visible: () => isNightbringerClassWeapon.value },
        { key: "nightbringerHealingEfficiency", label: "暗夜使者救贖者 · 治癒效率 %", max: 30, visible: () => isNightbringer.value },
    ];
    LEVEL_FIELDS.forEach((f) => {
        if (f.visible && !f.visible()) return;
        const cur = settings[f.key] as number;
        if (cur >= f.max) return;
        tryField(`lvl-${f.key}`, f.label, f.key, [{ value: f.max, label: `${f.max}` }], `${cur}`);
    });

    // 開關型：關 → 開
    const TOGGLE_FIELDS: { key: keyof HealCalcSettings; label: string }[] = [
        { key: "hasSaintBardLink", label: "聖詠者同步10" },
        { key: "hasJeongwhaGodong", label: "淨化的鼓動發動中（+20%）" },
        { key: "isSpiritImplementationActive", label: "精靈實體化" },
        { key: "hasHealingEnhanceSet", label: "套裝效果 治癒強化 發動" },
    ];
    TOGGLE_FIELDS.forEach((f) => {
        if (settings[f.key]) return;
        tryField(`sw-${f.key}`, f.label, f.key, [{ value: true, label: "開" }], "關");
    });

    // 選項型：依優先指標，從清單中挑出最佳選項
    tryField(
        "sel-primaryTitleId",
        "第1稱號",
        "primaryTitleId",
        PRIMARY_TITLES.map((t) => ({ value: t.id, label: t.name })),
        PRIMARY_TITLES.find((t) => t.id === settings.primaryTitleId)?.name ?? "-",
    );
    tryField(
        "sel-secondaryTitleId",
        "第2稱號",
        "secondaryTitleId",
        SECONDARY_TITLES.map((t) => ({ value: t.id, label: t.name })),
        SECONDARY_TITLES.find((t) => t.id === settings.secondaryTitleId)?.name ?? "-",
    );
    tryField(
        "sel-weaponUpgradeOptionId",
        "武器 · 改造效果",
        "weaponUpgradeOptionId",
        upgradeOptions.value.map((u) => ({ value: u.id, label: u.name })),
        upgradeOptions.value.find((u) => u.id === settings.weaponUpgradeOptionId)?.name ?? "-",
    );
    tryField(
        "sel-relicEnchantHealingPercent",
        "遺物 · 賦予接尾",
        "relicEnchantHealingPercent",
        RELIC_ENCHANT_OPTIONS.map((o) => ({ value: o.healingPercent, label: o.label })),
        RELIC_ENCHANT_OPTIONS.find((o) => o.healingPercent === settings.relicEnchantHealingPercent)?.label ?? "-",
    );
    tryField(
        "sel-healingMiniatureId",
        "額外農場模型",
        "healingMiniatureId",
        HEALING_MINIATURES.map((m) => ({ value: m.id, label: m.name })),
        HEALING_MINIATURES.find((m) => m.id === settings.healingMiniatureId)?.name ?? "-",
    );

    rows.sort((a, b) => {
        const score = (r: ImproveRow) => (priority === "party" ? r.dParty : priority === "heal" ? r.dHeal : r.dSonic);
        return score(b) - score(a);
    });
    return rows;
});

// 魔攻邊際效益：魔攻沒有上限，無法套用「拉到最佳值」，改用取樣算出每 +1 點的平均提升率
const MAGIC_ATTACK_SAMPLE_STEP = 100;
const magicAttackRate = computed(() => {
    const base = metricSnapshot(settings);
    const after = metricSnapshot({ ...settings, magicAttack: settings.magicAttack + MAGIC_ATTACK_SAMPLE_STEP });
    return {
        party: (after.party - base.party) / MAGIC_ATTACK_SAMPLE_STEP,
        heal: (after.heal - base.heal) / MAGIC_ATTACK_SAMPLE_STEP,
        sonic: (after.sonic - base.sonic) / MAGIC_ATTACK_SAMPLE_STEP,
    };
});

// 勾選項目（僅模擬，不動到實際設定）
const selectedIds = reactive(new Set<string>());
function toggleSelected(id: string) {
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
}

// 勾選項目「全部套用後」的預估數值
const projection = computed(() => {
    const base = metricSnapshot(settings);
    const clone: HealCalcSettings = { ...settings };
    let count = 0;
    improveItems.value.forEach((it) => {
        if (selectedIds.has(it.id)) {
            it.apply(clone);
            count++;
        }
    });
    const after = metricSnapshot(clone);
    return {
        count,
        party: after.party,
        heal: after.heal,
        sonic: after.sonic,
        dParty: after.party - base.party,
        dHeal: after.heal - base.heal,
        dSonic: after.sonic - base.sonic,
    };
});

function applySelected() {
    improveItems.value.filter((it) => selectedIds.has(it.id)).forEach((it) => it.apply(settings));
    selectedIds.clear();
}

// ═══════════════════════════════════════════════════════
//  快速操作：全部最頂 / 當前 tab 最高
//  多數欄位對兩個指標（派對治癒／治癒）貢獻相同，可直接拉到已知最大值；
//  只有「武器改造效果」與「回音石選項」會依指標分歧，改用 priorityTarget 挑最佳。
// ═══════════════════════════════════════════════════════
const SEVA_INT_MAX = 2849; // 智力目前已知最高值

function scoreFor(overrides: Partial<HealCalcSettings>): number {
    return metricValue(priorityTarget.value, { ...settings, ...overrides } as HealCalcSettings);
}

function bestOf<T>(base: Partial<HealCalcSettings>, key: keyof HealCalcSettings, candidates: T[]): T {
    let best = candidates[0];
    let bestScore = -Infinity;
    for (const v of candidates) {
        const score = scoreFor({ ...base, [key]: v });
        if (score > bestScore) {
            bestScore = score;
            best = v;
        }
    }
    return best;
}

// 稱號加成對兩指標一視同仁，直接窮舉所有組合找最高總和
function topTitles() {
    let best = { primaryTitleId: settings.primaryTitleId, secondaryTitleId: settings.secondaryTitleId };
    let bestScore = -Infinity;
    for (const p of PRIMARY_TITLES) {
        for (const s of SECONDARY_TITLES) {
            const score = scoreFor({ primaryTitleId: p.id, secondaryTitleId: s.id });
            if (score > bestScore) {
                bestScore = score;
                best = { primaryTitleId: p.id, secondaryTitleId: s.id };
            }
        }
    }
    Object.assign(settings, best);
}

function topBase() {
    settings.sevaInt = SEVA_INT_MAX;
    settings.hasSaintBardLink = true;
    topTitles();
}

// 武器、等級、改造效果、特別改造階段、治癒效率彼此獨立疊加，
// 針對每把武器各自選出最佳搭配後，再比較哪把武器整體最好；防具／飾品／聖水一併拉滿
function topEquipment() {
    let bestCombo = {
        weaponId: settings.weaponId,
        weaponGrade: settings.weaponGrade,
        weaponUpgradeOptionId: settings.weaponUpgradeOptionId,
        specialUpgradeStage: settings.specialUpgradeStage,
        nightbringerHealingEfficiency: settings.nightbringerHealingEfficiency,
    };
    let bestScore = -Infinity;

    for (const w of WEAPONS) {
        const isNb = w.id === "nightbringer_savior";
        const isNbClass = isNb || w.hasMasterGrade;
        const grade = w.hasMasterGrade ? "master" : settings.weaponGrade;
        const upgradeList = isNb ? NIGHTBRINGER_UPGRADE_OPTIONS : WEAPON_UPGRADE_OPTIONS;
        const upgradeId = bestOf({ weaponId: w.id, weaponGrade: grade }, "weaponUpgradeOptionId", upgradeList.map((u) => u.id));
        const combo = {
            weaponId: w.id,
            weaponGrade: grade,
            weaponUpgradeOptionId: upgradeId,
            specialUpgradeStage: isNbClass ? 8 : settings.specialUpgradeStage,
            nightbringerHealingEfficiency: isNb ? 30 : settings.nightbringerHealingEfficiency,
        };
        const score = scoreFor(combo);
        if (score > bestScore) {
            bestScore = score;
            bestCombo = combo;
        }
    }

    Object.assign(settings, bestCombo);
    settings.darkErgLevel = 50;
    settings.ergRecovery = 20;
    settings.ergHealEfficiency = 20;
    settings.hasHealingEnhanceSet = true;
    settings.accessoryPrefixEnchantPercent = Math.max(...ACCESSORY_PREFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.accessorySuffixEnchantPercent = Math.max(...ACCESSORY_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.headPrefixEnchantPercent = Math.max(...HEAD_PREFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.headSuffixEnchantPercent = Math.max(...HEAD_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.bodyPrefixEnchantPercent = Math.max(...BODY_PREFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.bodySuffixEnchantPercent = Math.max(...BODY_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.handPrefixEnchantPercent = Math.max(...HAND_PREFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.handSuffixEnchantPercent = Math.max(...HAND_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.footPrefixEnchantPercent = Math.max(...FOOT_PREFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.footSuffixEnchantPercent = Math.max(...FOOT_SUFFIX_ENCHANT_OPTIONS.map((o) => o.value));
    settings.holyWaterPercent = 80;
}

// 武器／身體細工等級、飾品鑲嵌
function topReforge() {
    settings.wandReforgeLevel = 25;
    settings.armorReforgeLevel = 25;
    settings.accessory1PartyHealingLevel = 4;
    settings.accessory1HealingLevel = 4;
    settings.accessory2PartyHealingLevel = 4;
    settings.accessory2HealingLevel = 4;
}

function topMisc() {
    settings.amuletHealingPercent = 12;
    settings.relicGumeEffect = 10;
    settings.relicEnchantHealingPercent = Math.max(...RELIC_ENCHANT_OPTIONS.map((o) => o.healingPercent));
    settings.brireheHealingPercent = 20;
    settings.totemHealingEffect = 10;
    settings.arcanaAwakeningHealingPercent = 20;
    settings.healingMiniatureId = HEALING_MINIATURES.reduce((a, b) => (b.healingEffectPercent > a.healingEffectPercent ? b : a)).id;
    settings.hasJeongwhaGodong = true;
    settings.oghamHealingMaxRecovery = 50;
    settings.oghamPartyHealingMaxRecovery = 50;
    settings.spiritYuksungLevel = 5;
    settings.spiritYeonmaLevel = 5;
    settings.spiritJejeLevel = 5;
    settings.isSpiritImplementationActive = true;
    settings.spiritMatBuffLevel = 5;
}

const TAB_TOP_FNS: Record<string, () => void> = {
    base: topBase,
    equipment: topEquipment,
    reforge: topReforge,
    misc: topMisc,
};

function topTab(name: string) {
    TAB_TOP_FNS[name]?.();
}

function topAll() {
    topBase();
    topEquipment();
    topReforge();
    topMisc();
}
</script>

<template>
    <div class="heal-calc">
        <h1 class="page-title">
            <span class="text-gradient">治癒計算機</span>
            <span class="page-subtitle">治癒的手 / 組隊治療（救贖回聲）效果計算</span>
        </h1>

        <div class="sim-layout">
            <!-- ════════ 左側 — 設定 ════════ -->
            <div class="form-panel">
                <el-card class="preset-card">
                    <div class="preset-head" :class="{ open: showPresetPanel }" @click="showPresetPanel = !showPresetPanel">
                        <span class="preset-head-title">💾 儲存 / 讀取</span>
                        <span class="preset-head-count">{{ presets.length }} 套</span>
                        <span class="preset-head-chevron" :style="{ transform: showPresetPanel ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                    </div>
                    <template v-if="showPresetPanel">
                        <div class="preset-save-row">
                            <el-input v-model="newPresetName" placeholder="配置名稱（留空自動命名）" size="small" clearable @keyup.enter="savePreset" />
                            <el-button type="primary" size="small" @click="savePreset">儲存目前設定</el-button>
                        </div>
                        <div v-if="presets.length === 0" class="preset-empty">尚無儲存配置</div>
                        <div v-else class="preset-list">
                            <div v-for="(preset, idx) in presets" :key="idx" class="preset-item">
                                <el-input :model-value="preset.name" size="small" class="preset-name-input" @change="(v: string) => renamePreset(idx, v)" />
                                <span class="preset-date">{{ fmtDate(preset.timestamp) }}</span>
                                <el-button size="small" plain @click="loadPreset(idx)">讀取</el-button>
                                <el-button size="small" type="danger" plain @click="deletePreset(idx)">✕</el-button>
                            </div>
                        </div>
                    </template>
                </el-card>

                <div class="quick-actions">
                    <el-button size="small" type="primary" plain @click="topAll">全部最頂</el-button>
                    <el-button size="small" plain @click="topTab(activeTab)">當前 tab 最高</el-button>
                    <el-button size="small" plain @click="resetAll">重置設定</el-button>
                </div>

                <el-tabs v-model="activeTab" type="border-card" class="setting-tabs">
                    <!-- 基礎 / 稱號 -->
                    <el-tab-pane label="基礎/稱號" name="base">
                        <div class="tab-body">
                            <div class="field-row">
                                <label class="field-label">魔攻</label>
                                <el-input-number v-model="settings.magicAttack" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">智力</label>
                                <el-input-number v-model="settings.sevaInt" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <el-switch v-model="settings.hasSaintBardLink" />
                                <span class="switch-label">聖詠者同步10</span>
                            </div>

                            <div class="field-section-label">稱號</div>
                            <div class="field-row">
                                <label class="field-label">第1稱號</label>
                                <el-select v-model="settings.primaryTitleId" size="small" class="field-select">
                                    <el-option v-for="t in PRIMARY_TITLES" :key="t.id" :value="t.id" :label="t.name + (t.healingEffectPercent ? ` (+${t.healingEffectPercent}%)` : '')" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">第2稱號</label>
                                <el-select v-model="settings.secondaryTitleId" size="small" class="field-select">
                                    <el-option v-for="t in SECONDARY_TITLES" :key="t.id" :value="t.id" :label="t.name + (t.healingEffectPercent ? ` (+${t.healingEffectPercent}%)` : '')" />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 武器 -->
                    <el-tab-pane label="裝備" name="equipment">
                        <div class="tab-body">
                            <div class="field-section-label">武器</div>
                            <div class="field-row">
                                <label class="field-label">武器</label>
                                <el-select v-model="settings.weaponId" size="small" class="field-select">
                                    <el-option v-for="w in WEAPONS" :key="w.id" :value="w.id" :label="w.name" />
                                </el-select>
                            </div>
                            <div class="field-row" v-if="isMasterGradeWeapon">
                                <label class="field-label">等級</label>
                                <el-select v-model="settings.weaponGrade" size="small" class="field-select">
                                    <el-option v-for="g in WEAPON_GRADE_OPTIONS" :key="g.id" :value="g.id" :label="g.name" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">改造效果</label>
                                <el-select v-model="settings.weaponUpgradeOptionId" size="small" class="field-select" :disabled="settings.weaponId === 'none'">
                                    <el-option v-for="u in upgradeOptions" :key="u.id" :value="u.id" :label="u.name" />
                                </el-select>
                            </div>
                            <div class="field-row" v-if="isNightbringer">
                                <label class="field-label">治癒效率 %</label>
                                <el-input-number v-model="settings.nightbringerHealingEfficiency" :min="0" :max="30" size="small" class="field-select" />
                            </div>
                            <div class="field-row" v-if="isNightbringer || isMasterGradeWeapon">
                                <label class="field-label">特別改造階段</label>
                                <el-select v-model="settings.specialUpgradeStage" size="small" class="field-select">
                                    <el-option v-for="o in SPECIAL_UPGRADE_STAGE_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">聚能 魔力恢復效果</label>
                                <el-select v-model="settings.ergRecovery" size="small" class="field-select">
                                    <el-option v-for="o in ERG_RECOVERY_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">聚能 提高治癒效率</label>
                                <el-select v-model="settings.ergHealEfficiency" size="small" class="field-select">
                                    <el-option v-for="o in ERG_HEAL_EFFICIENCY_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">黑暗聚能 治癒效率</label>
                                <el-select v-model="settings.darkErgLevel" size="small" class="field-select">
                                    <el-option v-for="o in DARK_ERG_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>

                            <div class="field-section-label">防具</div>
                            <div class="field-row">
                                <el-switch v-model="settings.hasHealingEnhanceSet" />
                                <span class="switch-label">套裝效果 治癒強化 發動（+20%）</span>
                            </div>

                            <div class="field-section-label">賦予</div>
                            <p class="analysis-hint">除了身體接頭的「慈悲的」，以下賦予目前皆為未實裝資料，僅供試算參考。</p>
                            <div class="acc-grid acc-head">
                                <span></span>
                                <span class="armor-col-label">接頭</span>
                                <span class="armor-col-label">接尾</span>
                            </div>
                            <div class="acc-grid">
                                <span class="gear-slot-label">飾品</span>
                                <el-select v-model="settings.accessoryPrefixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in ACCESSORY_PREFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-select v-model="settings.accessorySuffixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in ACCESSORY_SUFFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="acc-grid">
                                <span class="gear-slot-label">頭</span>
                                <el-select v-model="settings.headPrefixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in HEAD_PREFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-select v-model="settings.headSuffixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in HEAD_SUFFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="acc-grid">
                                <span class="gear-slot-label">身</span>
                                <el-select v-model="settings.bodyPrefixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in BODY_PREFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-select v-model="settings.bodySuffixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in BODY_SUFFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="acc-grid">
                                <span class="gear-slot-label">手</span>
                                <el-select v-model="settings.handPrefixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in HAND_PREFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-select v-model="settings.handSuffixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in HAND_SUFFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="acc-grid">
                                <span class="gear-slot-label">腳</span>
                                <el-select v-model="settings.footPrefixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in FOOT_PREFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-select v-model="settings.footSuffixEnchantPercent" size="small" class="gear-select">
                                    <el-option v-for="o in FOOT_SUFFIX_ENCHANT_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>

                            <div class="field-section-label">聖水</div>
                            <div class="field-row">
                                <label class="field-label">治癒效果%（總和）</label>
                                <el-input-number v-model="settings.holyWaterPercent" :min="0" :max="80" size="small" class="field-select" />
                                <span class="field-hint">武器/副手/防具四件/飾品二件，共 8 個部位加總，單一部位最高 10%</span>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 細工 -->
                    <el-tab-pane label="細工" name="reforge">
                        <div class="tab-body">
                            <div class="field-section-label">武器</div>
                            <div class="field-row">
                                <label class="field-label">組隊治療細工等級</label>
                                <el-select v-model="settings.wandReforgeLevel" size="small" class="field-select">
                                    <el-option v-for="o in WAND_REFORGE_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>

                            <div class="field-section-label">身體</div>
                            <div class="field-row">
                                <label class="field-label">治癒細工等級</label>
                                <el-select v-model="settings.armorReforgeLevel" size="small" class="field-select">
                                    <el-option v-for="o in ARMOR_REFORGE_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>

                            <div class="field-section-label">飾品</div>
                            <div class="acc-grid acc-head">
                                <span></span>
                                <span class="armor-col-label">組隊治療細工</span>
                                <span class="armor-col-label">治療細工</span>
                            </div>
                            <div class="acc-grid" v-for="n in [1, 2]" :key="n">
                                <span class="gear-slot-label">飾品 {{ n }}</span>
                                <el-select v-model="(settings as any)['accessory' + n + 'PartyHealingLevel']" size="small" class="gear-select">
                                    <el-option v-for="o in ACCESSORY_PARTY_REFORGE_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-select v-model="(settings as any)['accessory' + n + 'HealingLevel']" size="small" class="gear-select">
                                    <el-option v-for="o in ACCESSORY_HEALING_REFORGE_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 其他加成 -->
                    <el-tab-pane label="其他加成" name="misc">
                        <div class="tab-body">
                            <div class="field-section-label">遺物</div>
                            <div class="field-row">
                                <label class="field-label">遺物 · 救贖回聲 %</label>
                                <el-select v-model="settings.relicGumeEffect" size="small" class="field-select">
                                    <el-option v-for="o in RELIC_GUME_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">遺物 · 賦予接尾</label>
                                <el-select v-model="settings.relicEnchantHealingPercent" size="small" class="field-select">
                                    <el-option v-for="o in RELIC_ENCHANT_OPTIONS" :key="o.healingPercent" :value="o.healingPercent" :label="o.label" />
                                </el-select>
                            </div>

                            <div class="field-section-label">精靈武器專用強化</div>
                            <div class="field-row">
                                <label class="field-label">精靈育成</label>
                                <el-input-number v-model="settings.spiritYuksungLevel" :min="0" :max="5" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">精靈研磨</label>
                                <el-input-number v-model="settings.spiritYeonmaLevel" :min="0" :max="5" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">精靈操控</label>
                                <el-input-number v-model="settings.spiritJejeLevel" :min="0" :max="5" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <el-switch v-model="settings.isSpiritImplementationActive" />
                                <span class="switch-label">精靈實體化</span>
                            </div>
                            <div class="field-row" v-if="settings.isSpiritImplementationActive">
                                <label class="field-label">實體化強化階段</label>
                                <el-input-number v-model="settings.spiritMatBuffLevel" :min="0" :max="5" size="small" class="field-select" />
                            </div>

                            <div class="field-section-label">其他</div>
                            <div class="field-row">
                                <label class="field-label">布里萊赫的硬幣（支援） 治癒效果 %</label>
                                <el-input-number v-model="settings.brireheHealingPercent" :min="0" :max="20" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">圖騰 治癒效果 %</label>
                                <el-select v-model="settings.totemHealingEffect" size="small" class="field-select">
                                    <el-option v-for="o in TOTEM_HEALING_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="settings.hasJeongwhaGodong" />
                                <span class="switch-label">淨化的鼓動發動中（+20%）</span>
                            </div>

                            <div class="field-section-label">未實裝</div>
                            <div class="field-row">
                                <label class="field-label">護身符 治癒效果 %</label>
                                <el-select v-model="settings.amuletHealingPercent" size="small" class="field-select">
                                    <el-option v-for="o in AMULET_HEALING_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">奧秘覺醒獎勵 %</label>
                                <el-input-number v-model="settings.arcanaAwakeningHealingPercent" :min="0" :max="20" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">符文 · 治癒最大回復量</label>
                                <el-input-number v-model="settings.oghamHealingMaxRecovery" :min="0" :max="50" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">符文 · 組隊治療最大回復量</label>
                                <el-input-number v-model="settings.oghamPartyHealingMaxRecovery" :min="0" :max="50" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">額外農場模型</label>
                                <el-select v-model="settings.healingMiniatureId" size="small" class="field-select">
                                    <el-option v-for="m in HEALING_MINIATURES" :key="m.id" :value="m.id" :label="m.name" />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 提升效益分析 -->
                    <el-tab-pane label="提升效益分析" name="analysis">
                        <div class="tab-body">
                            <div class="analysis-targets">
                                <el-checkbox v-model="analysisTargets.party">組隊治療 · 救贖回聲</el-checkbox>
                                <el-checkbox v-model="analysisTargets.heal">治癒 · 治癒的手</el-checkbox>
                                <el-checkbox v-model="analysisTargets.sonic">音波洗禮（每 1 疊）</el-checkbox>
                            </div>
                            <p class="analysis-hint">
                                列出尚未拉滿／未開啟的欄位；提升 = 將該欄位單獨拉到最佳值的邊際增益（選項型欄位以最上方勾選的指標挑選最佳選項），數值型欄位並附上每 1 點/級的平均提升幅度。
                                勾選只是「模擬」不會動到設定，要實際套用請按下方按鈕。
                            </p>

                            <!-- 魔攻沒有上限，無法「拉到最佳值」，改用每 +100 點取樣換算成每 1 點的平均提升率 -->
                            <div class="magic-attack-rate">
                                <span class="magic-attack-rate-label">魔攻每 +1 點（取樣自目前設定）：</span>
                                <span v-if="analysisTargets.party" class="magic-attack-rate-value col-party">
                                    救贖回聲 +{{ magicAttackRate.party.toFixed(2) }}
                                </span>
                                <span v-if="analysisTargets.heal" class="magic-attack-rate-value col-heal">
                                    治癒的手 +{{ magicAttackRate.heal.toFixed(2) }}
                                </span>
                                <span v-if="analysisTargets.sonic" class="magic-attack-rate-value col-sonic">
                                    音波洗禮 +{{ magicAttackRate.sonic.toFixed(4) }}
                                </span>
                            </div>

                            <table class="analysis-table">
                                <thead>
                                    <tr>
                                        <th class="ana-apply">選取</th>
                                        <th class="ana-name-h">項目</th>
                                        <th class="ana-diff-h">差異</th>
                                        <th v-if="analysisTargets.party" class="ana-gain-h col-party">救贖回聲</th>
                                        <th v-if="analysisTargets.heal" class="ana-gain-h col-heal">治癒的手</th>
                                        <th v-if="analysisTargets.sonic" class="ana-gain-h col-sonic">音波洗禮</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="item in improveItems"
                                        :key="item.id"
                                        :class="{ 'ana-row-selected': selectedIds.has(item.id) }"
                                    >
                                        <td class="ana-apply">
                                            <el-checkbox
                                                :model-value="selectedIds.has(item.id)"
                                                @change="toggleSelected(item.id)"
                                            />
                                        </td>
                                        <td class="ana-name">{{ item.name }}</td>
                                        <td class="ana-diff">{{ item.curLabel }} → {{ item.bestLabel }}</td>
                                        <td v-if="analysisTargets.party" class="ana-gain col-party">
                                            +{{ Math.round(item.dParty).toLocaleString("zh-Hant") }}
                                            <span v-if="item.steps && item.steps > 1" class="ana-perstep">
                                                {{ (item.dParty / item.steps).toFixed(2) }}/1
                                            </span>
                                        </td>
                                        <td v-if="analysisTargets.heal" class="ana-gain col-heal">
                                            +{{ Math.round(item.dHeal).toLocaleString("zh-Hant") }}
                                            <span v-if="item.steps && item.steps > 1" class="ana-perstep">
                                                {{ (item.dHeal / item.steps).toFixed(2) }}/1
                                            </span>
                                        </td>
                                        <td v-if="analysisTargets.sonic" class="ana-gain col-sonic">
                                            +{{ item.dSonic.toFixed(2) }}
                                            <span v-if="item.steps && item.steps > 1" class="ana-perstep">
                                                {{ (item.dSonic / item.steps).toFixed(4) }}/1
                                            </span>
                                        </td>
                                    </tr>
                                    <tr v-if="improveItems.length === 0">
                                        <td colspan="6" class="ana-empty">所有項目皆已達到最高 🎉</td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- 勾選項目的預估總提升 -->
                            <div v-if="projection.count > 0" class="ana-projection">
                                <div class="ana-proj-head">
                                    已選 {{ projection.count }} 項，全部套用後預估：
                                    <el-button type="primary" size="small" @click="applySelected">
                                        套用勾選項目
                                    </el-button>
                                    <el-button size="small" plain @click="selectedIds.clear()">清除勾選</el-button>
                                </div>
                                <div class="ana-proj-grid">
                                    <div v-if="analysisTargets.party" class="ana-proj-cell col-party">
                                        救贖回聲 {{ Math.round(projection.party).toLocaleString("zh-Hant") }}
                                        <span class="ana-proj-delta">(+{{ Math.round(projection.dParty).toLocaleString("zh-Hant") }})</span>
                                    </div>
                                    <div v-if="analysisTargets.heal" class="ana-proj-cell col-heal">
                                        治癒的手 {{ Math.round(projection.heal).toLocaleString("zh-Hant") }}
                                        <span class="ana-proj-delta">(+{{ Math.round(projection.dHeal).toLocaleString("zh-Hant") }})</span>
                                    </div>
                                    <div v-if="analysisTargets.sonic" class="ana-proj-cell col-sonic">
                                        音波洗禮 {{ projection.sonic.toFixed(2) }}
                                        <span class="ana-proj-delta">(+{{ projection.dSonic.toFixed(2) }})</span>
                                    </div>
                                </div>
                                <p class="ana-proj-note">
                                    註：單列的提升是各自單獨計算，因乘算交互作用，總提升不等於各列相加。
                                </p>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- ════════ 右側 — 結果 ════════ -->
            <div class="dashboard-panel">
                <div class="result-card grade-inspiring">
                    <div class="result-card-header">
                        <span class="grade-name">組隊治療 · 救贖回聲</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">救贖回聲</span>
                        <span class="result-value">{{ fmtRange(result.partyHealing.gume) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">救贖回聲 + 暴擊</span>
                        <span class="result-value sub">{{ fmtRange(result.partyHealing.gumeCritical) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">+ 暴擊 + 溫暖5</span>
                        <span class="result-value sub">{{ fmtRange(result.partyHealing.gumeCriticalWarmth5) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">一般</span>
                        <span class="result-value sub">{{ fmtRange(result.partyHealing.normal) }}</span>
                    </div>
                </div>

                <div class="result-card grade-excellent">
                    <div class="result-card-header">
                        <span class="grade-name">治癒 · 治癒的手</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">治癒的手</span>
                        <span class="result-value">{{ fmtRange(result.healing.chison) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">治癒的手 + 暴擊</span>
                        <span class="result-value sub">{{ fmtRange(result.healing.chisonCritical) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">+ 暴擊 + 溫暖5</span>
                        <span class="result-value sub">{{ fmtRange(result.healing.chisonCriticalWarmth5) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">一般</span>
                        <span class="result-value sub">{{ fmtRange(result.healing.normal) }}</span>
                    </div>
                </div>

                <div class="result-card grade-normal">
                    <div class="result-card-header">
                        <span class="grade-name">音波洗禮（每 1 疊）</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">防禦 / 魔防 減少</span>
                        <span class="result-value sub">{{ result.sonicBaptism.defensePerStack.toFixed(2) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">保護 / 魔保 減少</span>
                        <span class="result-value sub">{{ result.sonicBaptism.protectionPerStack.toFixed(2) }}</span>
                    </div>
                </div>

                <div class="util-copyrights">
                    公式還原自
                    <a href="https://itsmabi.com/heal-calculator" target="_blank" rel="noopener">itsmabi.com</a>
                    ，僅供參考，實際數值請以遊戲內為準
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.heal-calc {
    min-height: 100vh;
    padding: 1.5rem;
    box-sizing: border-box;
}

.page-title {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
}
.page-subtitle {
    font-size: 1rem;
    color: var(--color-text-muted, #6b7280);
    font-weight: 400;
}

/* 雙欄 */
.sim-layout {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 1.5rem;
    max-width: 1280px;
    margin: 0 auto;
    align-items: flex-start;
}

.form-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 0;
}

.quick-actions {
    display: flex;
    gap: 0.5rem;
}

/* ── 紀錄保存 / 讀取 ── */
.preset-card {
    background: var(--color-bg-secondary, #1f2937);
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 12px;
}
.preset-card :deep(.el-card__body) {
    padding: 0.85rem 1rem;
}
.preset-head {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
}
.preset-head.open {
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
}
.preset-head-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--color-text-secondary, #d1d5db);
}
.preset-head-count {
    font-size: 0.72rem;
    color: var(--color-text-disabled, #6b7280);
}
.preset-head-chevron {
    margin-left: auto;
    font-size: 0.8rem;
    color: var(--color-text-muted, #9ca3af);
    transition: transform 0.2s ease;
}
.preset-save-row {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}
.preset-empty {
    font-size: 0.78rem;
    color: var(--color-text-disabled, #6b7280);
    padding: 0.4rem 0;
}
.preset-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.preset-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 0.35rem 0.6rem;
}
.preset-name-input {
    flex: 1;
    min-width: 80px;
}
.preset-date {
    font-size: 0.7rem;
    color: var(--color-text-disabled, #6b7280);
    white-space: nowrap;
    flex-shrink: 0;
}

/* ── 設定分頁 ── */
.setting-tabs {
    border-radius: 12px;
    overflow: hidden;
}
.tab-body {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
    padding-top: 0.25rem;
}

.field-section-label {
    margin: 0.5rem 0 0.1rem;
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-accent-hover, #fcd34d);
    border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
    padding-bottom: 0.2rem;
}
.field-section-label:first-child {
    margin-top: 0;
}

.field-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
}
.field-select {
    width: 260px;
    max-width: 100%;
    flex-shrink: 0;
}
.field-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    width: 160px;
    flex-shrink: 0;
    line-height: 1.3;
}
.switch-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
}
.field-hint {
    font-size: 0.72rem;
    color: var(--color-text-disabled, #6b7280);
    flex-basis: 100%;
}

/* ── 飾品 grid ── */
.acc-grid {
    display: grid;
    grid-template-columns: 64px 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
}
.acc-head {
    margin-bottom: 0.1rem;
}
.armor-col-label {
    font-size: 0.78rem;
    font-weight: 700;
    text-align: center;
    color: var(--color-accent-primary, #fbbf24);
    letter-spacing: 0.02em;
}
.gear-slot-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    white-space: nowrap;
}
.gear-select {
    width: 100%;
}

/* ── 右側結果 ── */
.dashboard-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: 1rem;
}
.result-card {
    background: var(--color-bg-secondary, #1f2937);
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
    border: 1px solid var(--color-border-primary, #374151);
}
.grade-normal {
    border-color: #6b7280;
}
.grade-excellent {
    border-color: #38bdf8;
}
.grade-inspiring {
    border-color: var(--color-accent-primary, #fbbf24);
}
.result-card-header {
    margin-bottom: 0.6rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
}
.grade-name {
    font-size: 1rem;
    font-weight: 700;
    color: var(--color-text-primary, #f9fafb);
}
.grade-excellent .grade-name {
    color: #7dd3fc;
}
.grade-inspiring .grade-name {
    color: var(--color-accent-hover, #fcd34d);
}
.result-row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding: 0.2rem 0;
    gap: 0.5rem;
}
.result-label {
    font-size: 0.85rem;
    color: var(--color-text-muted, #9ca3af);
}
.result-value {
    font-size: 1.35rem;
    font-weight: 700;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-primary, #f9fafb);
    white-space: nowrap;
}
.grade-excellent .result-value {
    color: #7dd3fc;
}
.grade-inspiring .result-value {
    color: var(--color-accent-hover, #fcd34d);
}
.result-value.sub {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-secondary, #9ca3af);
}

.util-copyrights {
    font-size: 0.72rem;
    color: var(--color-text-disabled, #6b7280);
    line-height: 1.6;
}
.util-copyrights a {
    color: var(--color-info-light, #60a5fa);
    text-decoration: none;
}
.util-copyrights a:hover {
    text-decoration: underline;
}

/* ── 提升效益分析 ── */
.analysis-targets {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1rem;
    margin-bottom: 0.35rem;
}
.analysis-hint {
    font-size: 0.74rem;
    color: var(--color-text-muted, #9ca3af);
    line-height: 1.5;
    margin-bottom: 0.6rem;
}
.analysis-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.8rem;
}
.analysis-table th,
.analysis-table td {
    padding: 0.3rem 0.5rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
    text-align: left;
}
.analysis-table thead th {
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--color-text-muted, #9ca3af);
    border-bottom: 1px solid var(--color-border-secondary, #4b5563);
    white-space: nowrap;
}
.ana-apply {
    width: 3rem;
    text-align: center;
}
.ana-name {
    color: var(--color-text-secondary, #e5e7eb);
    white-space: nowrap;
}
.ana-diff,
.ana-diff-h {
    color: var(--color-text-muted, #9ca3af);
    font-size: 0.74rem;
}
.ana-gain,
.ana-gain-h {
    text-align: right;
    white-space: nowrap;
    font-family: var(--font-family-mono, monospace);
    font-weight: 700;
}
.ana-gain.col-party,
.ana-gain-h.col-party {
    color: var(--color-accent-hover, #fcd34d);
}
.ana-gain.col-heal,
.ana-gain-h.col-heal {
    color: #7dd3fc;
}
.ana-gain.col-sonic,
.ana-gain-h.col-sonic {
    color: #34d399;
}
.ana-perstep {
    display: block;
    font-size: 0.68rem;
    font-weight: 400;
    color: var(--color-text-muted, #9ca3af);
    margin-top: 0.05rem;
}
.magic-attack-rate {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 1rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    font-size: 0.78rem;
}
.magic-attack-rate-label {
    color: var(--color-text-muted, #9ca3af);
}
.magic-attack-rate-value {
    font-weight: 700;
    font-family: var(--font-family-mono, monospace);
}
.magic-attack-rate-value.col-party {
    color: var(--color-accent-hover, #fcd34d);
}
.magic-attack-rate-value.col-heal {
    color: #7dd3fc;
}
.magic-attack-rate-value.col-sonic {
    color: #34d399;
}
.ana-empty {
    text-align: center;
    color: var(--color-text-muted, #9ca3af);
    padding: 1rem;
}
.ana-row-selected {
    background: rgba(129, 140, 248, 0.1);
}
.ana-projection {
    margin-top: 0.9rem;
    padding: 0.75rem 0.9rem;
    background: rgba(129, 140, 248, 0.08);
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 10px;
}
.ana-proj-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.84rem;
    color: var(--color-text-secondary, #e5e7eb);
    margin-bottom: 0.6rem;
}
.ana-proj-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 1.25rem;
}
.ana-proj-cell {
    font-size: 1.05rem;
    font-weight: 700;
    font-family: var(--font-family-mono, monospace);
}
.ana-proj-cell.col-party {
    color: var(--color-accent-hover, #fcd34d);
}
.ana-proj-cell.col-heal {
    color: #7dd3fc;
}
.ana-proj-cell.col-sonic {
    color: #34d399;
}
.ana-proj-delta {
    font-size: 0.78rem;
    font-weight: 400;
    color: var(--color-success-light, #34d399);
}
.ana-proj-note {
    font-size: 0.7rem;
    color: var(--color-text-disabled, #6b7280);
    margin-top: 0.5rem;
}

/* 響應式 */
@media (max-width: 900px) {
    .sim-layout {
        grid-template-columns: 1fr;
    }
    .dashboard-panel {
        position: static;
    }
    .field-label {
        width: 130px;
    }
}
</style>
