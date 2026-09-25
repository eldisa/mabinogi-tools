<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useAccountSync, mergeByTimestamp } from "../composables/useAccountSync";
import { InfoFilled } from "@element-plus/icons-vue";
import { ElMessageBox } from "element-plus";
import {
    WEAPON_TYPE_OPTIONS,
    WEAPON_PRESETS,
    SHIELD_PRESETS,
    HOLY_WATER_ABILITIES,
    HOLY_WATER_SLOTS,
    REFORGE_TYPE_COLUMNS,
    REFORGE_SLOTS,
    getReforgeLevelOptions,
    getReforgeLevelMax,
    BATTLE_CRY_REFORGE_LEVEL_OPTIONS,
    CHARACTER_BUILDS,
    getRaceSkillInfo,
    MAGIC_CIRCLE_OPTIONS,
    MAGIC_CIRCLE_LIMIT,
    createDefaultSettings,
    calculateAll,
    SKILL_VISIBILITY_SETTING_KEYS,
    calculateIronWallSacrifice,
    SACRIFICE_CAP,
    PET_BONUS_OPTIONS,
    TRANSFORMATION_OPTIONS,
    WEAPON_SPECIAL_REFORGE_CRIT,
    CRITICAL_DAMAGE_SET_BONUS,
    CRITICAL_RATE_ITEM_BONUS,
    MULIAS_RELIC_LEVEL_OPTIONS,
    MULIAS_RELIC_SACRIFICE_REGEN_PER_LEVEL,
    MULIAS_RELIC_REFLECTION_TRACE_PER_LEVEL,
    MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL,
    ALL_SKILL_META,
    calculateSkillsForSettings,
    calculateTotalOutput,
    calculateDamageEfficiency,
    calculateHolyWaterComparison,
    SET_EFFECT_TAG_LABELS,
    type ShieldKnightSettings,
    type HolyWaterSlotKey,
    type HolyWaterAbilityId,
} from "../data/shieldKnightCalculator";
import { getSkillIcon } from "../utils/image";
import ProtectionBreakPanel from "../components/ProtectionBreakPanel.vue";

const settings = reactive<ShieldKnightSettings>(createDefaultSettings());
const activeTab = ref("character");

const currentBuild = computed(() => CHARACTER_BUILDS.find((b) => b.id === settings.characterBuildId) ?? CHARACTER_BUILDS[0]);
const currentRaceSkill = computed(() => getRaceSkillInfo(currentBuild.value));
const currentTransformation = computed(() => TRANSFORMATION_OPTIONS.find((t) => t.id === currentBuild.value.transformationId) ?? TRANSFORMATION_OPTIONS[0]);
const transformationReforgeLocked = computed(() => currentBuild.value.transformationId === "none");
// 變身專屬細工：勾選＝未突破（20 級），再勾突破＝27 級（引擎仍以等級計算，舊存檔的等級會對應成勾選狀態）
const transformationReforgeEnabled = computed({
    get: () => settings.transformationReforgeLevel >= 1,
    set: (v: boolean) => {
        settings.transformationReforgeLevel = v ? (settings.transformationReforgeLevel >= 27 ? 27 : 20) : 0;
    },
});
const transformationBroken = computed({
    get: () => settings.transformationReforgeLevel >= 27,
    set: (v: boolean) => {
        settings.transformationReforgeLevel = v ? 27 : 20;
    },
});
const weaponOptions = computed(() => WEAPON_PRESETS[settings.weaponType]);
const shieldLocked = computed(() => settings.weaponType === "two_hand_sword" && !currentBuild.value.allowTwoHandSwordWithShield);

watch(
    () => settings.weaponType,
    (weaponType) => {
        settings.weaponId = "none";
        const max = getReforgeLevelMax("weapon", weaponType);
        (["smash", "windmill", "charge"] as const).forEach((t) => {
            if (settings.reforge.weapon[t] > max) settings.reforge.weapon[t] = max;
        });
    },
);
watch(shieldLocked, (locked) => {
    if (locked) settings.shieldId = "none";
});
watch(transformationReforgeLocked, (locked) => {
    if (locked) settings.transformationReforgeLevel = 0;
});

function holyWaterMax(slotKey: HolyWaterSlotKey): number {
    const sel = settings.holyWater[slotKey];
    return HOLY_WATER_ABILITIES.find((a) => a.id === sel.abilityId)?.max ?? 0;
}
function onHolyWaterAbilityChange(slotKey: HolyWaterSlotKey) {
    settings.holyWater[slotKey].value = 0;
}
function fillAllHolyWater(abilityId: HolyWaterAbilityId) {
    const max = HOLY_WATER_ABILITIES.find((a) => a.id === abilityId)?.max ?? 0;
    HOLY_WATER_SLOTS.forEach((slot) => {
        settings.holyWater[slot.key] = { abilityId, value: max };
    });
}

const calcResult = computed(() => calculateAll(settings));
const finalStats = computed(() => calcResult.value.finalStats);
const abilities = computed(() => calcResult.value.abilities);
const activeSetEffectLabels = computed(() => calcResult.value.activeTags.map((t) => SET_EFFECT_TAG_LABELS[t]));

const allSkills = computed(() => calculateSkillsForSettings(settings));
const skills = computed(() => allSkills.value.filter((skill) => settings[SKILL_VISIBILITY_SETTING_KEYS[skill.skillId]]));
const totalOutput = computed(() => calculateTotalOutput(settings, settings.skillUsageCounts));
const hasAnyUsageCount = computed(() => ALL_SKILL_META.some((s) => settings.skillUsageCounts[s.id] > 0));
const efficiencyItems = computed(() => calculateDamageEfficiency(settings));
const holyWaterComparison = computed(() => calculateHolyWaterComparison(settings));
const bestHolyWaterId = computed(() => holyWaterComparison.value.reduce((best, x) => (x.deltaOutput > best.deltaOutput ? x : best), holyWaterComparison.value[0])?.id);

const ironWallPreview = computed(() => calculateIronWallSacrifice(settings.ironWallHitCount, settings.currentSacrifice, settings.nobleOathEnabled));

function advanceRadiantStage() {
    settings.radiantJudgementStage = settings.radiantJudgementStage >= 3 ? 1 : ((settings.radiantJudgementStage + 1) as 1 | 2 | 3);
}

function applyIronWallSacrifice() {
    settings.currentSacrifice = ironWallPreview.value.newTotal;
    settings.ironWallHitCount = 0;
}

function resetAll() {
    Object.assign(settings, createDefaultSettings());
}

const fmtInt = (n: number): string => Math.round(n).toLocaleString("zh-Hant");
const fmtPercent = (ratio: number): string => `${(ratio * 100).toFixed(0)}%`;
/** 消除倍率計算（例如 ×1.15）造成的浮點數誤差，例如 873.9999999999999 顯示成 874 */
const fmtRatio = (n: number): string => String(Math.round(n * 100) / 100);
const fmtMultiplier = (n: number): string => `×${n.toFixed(3)}`;
const fmtDecimal = (n: number): string => n.toLocaleString("zh-Hant", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const skillImageId = (skillId: (typeof ALL_SKILL_META)[number]["id"]): number => ALL_SKILL_META.find((s) => s.id === skillId)?.imageId ?? 0;

/** 最終面板每個條目點擊 info 顯示的詳細說明（公式結構，非即時代入數值） */
const RESULT_DETAILS: Record<string, string> = {
    cleanMaxDamage: "乾淨最大傷害 = 面板最大傷害 − 髒髒總和（宗師／變身／寵物／辦桌／活動加成／聖水大傷）。",
    dirtyMaxDamageTotal: "髒髒總和 = 一代宗師 + 變身（含細工等級）+ 寵物加成 + 辦桌 + 活動加成 + 聖水大傷，這些來源在「攻擊力」分頁設定，不吃攻擊係數（藥水/三項注魔）。",
    finalMaxDamage:
        "最終最大傷害 = (乾淨最大傷害 × 攻擊係數 + 髒髒總和 + 常數攻擊力) × (1+戰場%×係數) × (1+特殊樂譜%×係數) × (1+狀態支援%×係數) × (1+力量團聚%×係數)。",
    maxHp: "最大生命值 = 角色基本數值.最大生命值 + 聖水HP加總（若「我的面板含聖水」未勾選）+ 盾牌固定HP（如靈魂解放者盾牌+1000）+ 高潔誓約加成（若數值基準=原始面板）。",
    defense:
        "防禦 = 角色基本數值.防禦 + 聖水防禦加總（若「我的面板含聖水」未勾選）+ 高潔誓約加成（若數值基準=原始面板）。備註：防禦和血量有許多疊加方式，且每個條件都遠比大傷複雜，所以聖水部分的加乘只會算進高潔誓約，建議自行填寫面板。",
    protection: "保護 = 角色基本數值.保護 + 高潔誓約加成（若數值基準=原始面板）。",
    magicDefense: "魔法防禦 = 角色基本數值.魔法防禦 + 高潔誓約加成（若數值基準=原始面板）。",
    magicProtection: "魔法保護 = 角色基本數值.魔法保護 + 高潔誓約加成（若數值基準=原始面板）。",
    defensePower: "防護 = 防禦 + 保護 + 魔法防禦 + 魔法保護 + 最終最大傷害 × 3%（職業被動：最大傷害轉化為防護）。",
    shieldDamageReduction: "盾牌減傷率 = 目前裝備的盾牌自帶減傷率，見「裝備」分頁的盾牌選單。",
    criticalRatePercent: "暴擊率 = 暴擊率基準值 + 道具加成（+1%），見「暴擊與額外傷害」分頁。",
    criticalDamagePercent:
        "暴擊傷害 = 基礎100% + 暴擊技能R1 + 評價滿 + 精靈武器 + 武器特殊改造 + 暴擊傷害套裝 + 圖騰 + 娃娃背包 + 農場模型 + 稱號 + 布里萊赫的硬幣 + 聖水暴擊傷害 + 刺客服裝，這是「暴擊當下」的傷害倍率。",
    criticalDamageExpected:
        "暴擊傷害期望值 = 100 + 暴擊率% × (暴擊傷害% − 100) / 100。把暴擊／不暴擊兩種結果依機率加權平均，才能/秘法技能公式實際套用這個值。",
    generalExtraDamageMultiplier: "通用額外傷害 = (1+武器額外傷害%) × (1+稱號+圖騰+農場模型+套裝效果%)，兩桶相乘。",
    arcaneExtraDamagePercent:
        "秘法額外傷害 = 不完美的空想王冠光環 + 布里萊赫的硬幣 + 穆利亞斯的遺物，加總後併入「(1+通用額外傷害+秘法額外傷害)」，只影響 7 個秘法技能（聖域展開/零秒嘲諷/盾擊衝鋒/盾崩強襲/審判重擊/犧牲懲戒/光輝斷罪），重擊/風車/突擊/猛擊等才能技能不吃。",
    protectionReduction: "保護減算 = 1 − 破後物理減傷率（怪物保護先扣破防%、再扣固定值、最後扣銳利，無條件捨去後查減傷表；銳利等級在「裝備」分頁填寫；「破防」分頁勾選套用時才生效，否則 ×1），乘進才能／秘法技能的目標傷害。",
    talentIncreaseDamageMultiplier: "才能增加傷害 =(1+種族技能%) × (1+猛擊層數對應%)，乘算，只影響才能技能（重擊/風車/突擊/猛擊）。",
    finalIncreaseDamageMultiplier:
        "最終增加傷害 = 戰鬥服務 × 達可達 × 死神烙印 × 憤怒衝擊 × 命運編織 × 洞察之眼 × 幸運草 × 反射的痕跡，共 8 個來源相乘。",
    windmillDamage: "風車傷害 = 才能技能公式：最終攻擊力 × 風車基礎倍率% × 暴擊傷害期望值% × (通用額外傷害+才能額外傷害) × 才能增加傷害 × 最終增加傷害。",
    chargeDamage: "突擊傷害 = 才能技能公式，結構同風車傷害，改套用突擊基礎倍率%。",
    smashDamage: "重擊傷害 = 才能技能公式，結構同風車傷害，改套用重擊基礎倍率%。",
    totalOutput: "總輸出 = Σ（每個技能單次傷害 × 該技能使用次數），使用次數在「技能使用次數」分頁設定。",
};

// ═══════════════════════════════════════════════════════
//  紀錄保存 / 讀取
// ═══════════════════════════════════════════════════════
const SHIELD_KNIGHT_STORAGE_KEY = "shield_knight_calc_presets_v3";

interface ShieldKnightPreset {
    name: string;
    timestamp: number;
    data: ShieldKnightSettings;
}

function loadAllPresets(): ShieldKnightPreset[] {
    try {
        const raw = localStorage.getItem(SHIELD_KNIGHT_STORAGE_KEY);
        if (raw) return JSON.parse(raw) || [];
    } catch {
        /* ignore */
    }
    return [];
}

const presets = ref<ShieldKnightPreset[]>(loadAllPresets());
const newPresetName = ref("");
const showPresetPanel = ref(false);

const saveLocalPresets = () => localStorage.setItem(SHIELD_KNIGHT_STORAGE_KEY, JSON.stringify(presets.value));
const accountSync = useAccountSync("shield_knight_presets", presets, mergeByTimestamp, saveLocalPresets);

function persistPresets() {
    saveLocalPresets();
    accountSync.push();
}

// 目前讀取的存檔（用 timestamp 當識別，刪除／排序不會錯位）
const loadedPresetTimestamp = ref<number | null>(null);
const loadedPreset = computed(() => presets.value.find((p) => p.timestamp === loadedPresetTimestamp.value) ?? null);

function saveAsNewPreset() {
    const name = newPresetName.value.trim() || `配置 ${presets.value.length + 1}`;
    const timestamp = Date.now();
    presets.value.push({ name, timestamp, data: JSON.parse(JSON.stringify(settings)) });
    persistPresets();
    newPresetName.value = "";
    loadedPresetTimestamp.value = timestamp;
}

async function savePreset() {
    const target = loadedPreset.value;
    if (!target) return saveAsNewPreset();
    try {
        await ElMessageBox.confirm(`目前讀取的是「${target.name}」，要更新這個存檔，還是另存新檔？`, "儲存", {
            confirmButtonText: "更新此存檔",
            cancelButtonText: "另存新檔",
            distinguishCancelAndClose: true,
            type: "info",
        });
        target.data = JSON.parse(JSON.stringify(settings));
        target.timestamp = Date.now();
        loadedPresetTimestamp.value = target.timestamp;
        persistPresets();
    } catch (action) {
        if (action === "cancel") saveAsNewPreset();
    }
}

function buildMergedSettings(data: Partial<ShieldKnightSettings> | undefined): ShieldKnightSettings {
    const defaults = createDefaultSettings();
    if (!data) return defaults;
    // 注意：每個巢狀物件都要對著 defaults（未被污染的預設值）合併，不能對著 merged 合併——
    // merged 在 Object.assign 之後，巢狀物件已經被舊存檔整組換掉，舊存檔缺的欄位會變 undefined。
    const merged = { ...defaults, ...data };
    merged.character = { ...defaults.character, ...(data.character ?? {}) };
    merged.holyWater = { ...defaults.holyWater, ...(data.holyWater ?? {}) };
    merged.reforge = Object.fromEntries(
        REFORGE_SLOTS.map((slot) => {
            const saved = (data.reforge as Record<string, Partial<Record<"smash" | "windmill" | "charge", number>>> | undefined)?.[slot.key];
            return [slot.key, { smash: saved?.smash ?? 0, windmill: saved?.windmill ?? 0, charge: saved?.charge ?? 0 }];
        }),
    ) as ShieldKnightSettings["reforge"];
    merged.magicCircleIds = Array.isArray(data.magicCircleIds) ? [...data.magicCircleIds] : [];
    merged.dirtyMaxDamage = { ...defaults.dirtyMaxDamage, ...(data.dirtyMaxDamage ?? {}) };
    merged.attackCoefficient = { ...defaults.attackCoefficient, ...(data.attackCoefficient ?? {}) };
    merged.criticalRate = { ...defaults.criticalRate, ...(data.criticalRate ?? {}) };
    merged.criticalDamage = { ...defaults.criticalDamage, ...(data.criticalDamage ?? {}) };
    merged.extraDamage = { ...defaults.extraDamage, ...(data.extraDamage ?? {}) };
    merged.arcaneExtraDamage = { ...defaults.arcaneExtraDamage, ...(data.arcaneExtraDamage ?? {}) };
    merged.finalIncreaseDamage = {
        ...defaults.finalIncreaseDamage,
        ...(data.finalIncreaseDamage ?? {}),
        deathBrand: { ...defaults.finalIncreaseDamage.deathBrand, ...(data.finalIncreaseDamage?.deathBrand ?? {}) },
        insightEye: { ...defaults.finalIncreaseDamage.insightEye, ...(data.finalIncreaseDamage?.insightEye ?? {}) },
    };
    merged.skillUsageCounts = { ...defaults.skillUsageCounts, ...(data.skillUsageCounts ?? {}) };
    merged.muliasRelic = { ...defaults.muliasRelic, ...(data.muliasRelic ?? {}) };
    merged.armorBreak = { ...defaults.armorBreak, ...(data.armorBreak ?? {}) };
    return merged;
}

type ArmorBreakResult = { protBeforePierce: number; pierceResist: number; damageTakenPercent: number; critDamagePercent: number };
// 面板在頁面 onMounted 還原自動存檔之前就會發第一次結果，這裡留一份，還原後再套一次，避免被舊存檔蓋掉
let latestArmorBreakResult: ArmorBreakResult | null = null;
function onArmorBreakResult(r: ArmorBreakResult) {
    latestArmorBreakResult = r;
    settings.armorBreak.protBeforePierce = r.protBeforePierce;
    settings.armorBreak.pierceResist = r.pierceResist;
    settings.armorBreak.damageTakenPercent = r.damageTakenPercent;
    settings.armorBreak.critDamagePercent = r.critDamagePercent;
}

function loadPreset(idx: number) {
    const data = presets.value[idx]?.data;
    if (!data) return;
    Object.assign(settings, buildMergedSettings(data));
    if (latestArmorBreakResult) onArmorBreakResult(latestArmorBreakResult);
    loadedPresetTimestamp.value = presets.value[idx].timestamp;
}

// ═══════════════════════════════════════════════════════
//  裝備比較（最多選 3 組已儲存配置）
// ═══════════════════════════════════════════════════════
const COMPARISON_SLOT_COUNT = 3;
const comparisonSlots = ref<(number | null)[]>(Array.from({ length: COMPARISON_SLOT_COUNT }, () => null));

interface ComparisonResult {
    name: string;
    skills: ReturnType<typeof calculateSkillsForSettings>;
    totalOutput: number;
}

const comparisonResults = computed<(ComparisonResult | null)[]>(() =>
    comparisonSlots.value.map((idx) => {
        if (idx === null) return null;
        const preset = presets.value[idx];
        if (!preset) return null;
        // 破防條件（來源、所受傷害、暴擊 debuff）一律用目前面板的，只保留各配置自己的銳利等級，才是同一破防條件下的差異
        const comparedSettings = { ...buildMergedSettings(preset.data), armorBreak: settings.armorBreak };
        return {
            name: preset.name,
            skills: calculateSkillsForSettings(comparedSettings, settings.skillUsageCounts["radiant-judgement"] ?? 0),
            totalOutput: calculateTotalOutput(comparedSettings, settings.skillUsageCounts),
        };
    }),
);

function comparisonDamageFor(result: ComparisonResult | null, skillId: (typeof ALL_SKILL_META)[number]["id"]): number | null {
    return result?.skills.find((s) => s.skillId === skillId)?.finalDamage ?? null;
}

/** 該欄位是否為目前有比較的配置中傷害最高者（只有 2 組以上、且數值有差異時才標亮） */
function isComparisonBest(values: (number | null)[], idx: number): boolean {
    const validValues = values.filter((v): v is number => v !== null);
    if (validValues.length < 2) return false;
    const max = Math.max(...validValues);
    const min = Math.min(...validValues);
    if (max === min) return false;
    return values[idx] === max;
}

function isSkillDamageBest(meta: (typeof ALL_SKILL_META)[number], idx: number): boolean {
    return isComparisonBest(
        comparisonResults.value.map((r) => comparisonDamageFor(r, meta.id)),
        idx,
    );
}

function isTotalOutputBest(idx: number): boolean {
    return isComparisonBest(
        comparisonResults.value.map((r) => (r ? r.totalOutput : null)),
        idx,
    );
}

function deletePreset(idx: number) {
    if (presets.value[idx]?.timestamp === loadedPresetTimestamp.value) loadedPresetTimestamp.value = null;
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

// ═══════════════════════════════════════════════════════
//  自動儲存（每次修改都存一份「目前設定」，跟已命名的配置分開存，
//  重新整理頁面時優先還原這份，不用怕手動忘記按「儲存目前設定」）
// ═══════════════════════════════════════════════════════
const SHIELD_KNIGHT_AUTOSAVE_KEY = "shield_knight_calc_autosave_v1";
let autosaveTimer: ReturnType<typeof setTimeout> | undefined;

function loadAutosave(): Partial<ShieldKnightSettings> | null {
    try {
        const raw = localStorage.getItem(SHIELD_KNIGHT_AUTOSAVE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {
        /* ignore */
    }
    return null;
}

function persistAutosaveNow() {
    localStorage.setItem(SHIELD_KNIGHT_AUTOSAVE_KEY, JSON.stringify(settings));
}

watch(
    settings,
    () => {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(persistAutosaveNow, 500);
    },
    { deep: true },
);

onMounted(() => {
    const autosaved = loadAutosave();
    if (autosaved) {
        Object.assign(settings, buildMergedSettings(autosaved));
    } else if (presets.value.length > 0) {
        loadPreset(0);
    }
    if (latestArmorBreakResult) onArmorBreakResult(latestArmorBreakResult);
});
</script>

<template>
    <div class="sk-calc">
        <h1 class="page-title">
            <span class="text-gradient">聖盾騎士傷害計算器</span>
            <span class="page-subtitle">角色 / 裝備 → 攻擊力 → 暴擊與額外傷害 → 最終面板 → 技能傷害拆解</span>
        </h1>

        <el-alert type="warning" :closable="false" show-icon class="verify-alert" title="此計算部分仍待驗證" />

        <div class="sim-layout">
            <!-- ════════ 左側 — 設定 ════════ -->
            <div class="form-panel">
                <el-card class="preset-card">
                    <div class="preset-head" :class="{ open: showPresetPanel }" @click="showPresetPanel = !showPresetPanel">
                        <span class="preset-head-title">💾 儲存 / 讀取</span>
                        <span class="preset-head-count">{{ presets.length }} 套</span>
                        <span v-if="loadedPreset" class="preset-loaded">目前讀取：{{ loadedPreset.name }}</span>
                        <span class="preset-head-chevron" :style="{ transform: showPresetPanel ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                    </div>
                    <template v-if="showPresetPanel">
                        <div class="preset-save-row">
                            <el-input v-model="newPresetName" placeholder="配置名稱（留空自動命名）" size="small" clearable @keyup.enter="savePreset" />
                            <el-button type="primary" size="small" @click="savePreset">儲存目前設定</el-button>
                        </div>
                        <div v-if="presets.length === 0" class="preset-empty">尚無儲存配置</div>
                        <div v-else class="preset-list">
                            <div v-for="(preset, idx) in presets" :key="idx" class="preset-item" :class="{ 'preset-item-loaded': preset.timestamp === loadedPresetTimestamp }">
                                <el-input :model-value="preset.name" size="small" class="preset-name-input" @change="(v: string) => renamePreset(idx, v)" />
                                <span class="preset-date">{{ fmtDate(preset.timestamp) }}</span>
                                <el-button size="small" plain @click="loadPreset(idx)">讀取</el-button>
                                <el-button size="small" type="danger" plain @click="deletePreset(idx)">✕</el-button>
                            </div>
                        </div>
                    </template>
                </el-card>

                <div class="quick-actions">
                    <el-button size="small" plain @click="resetAll">重置設定</el-button>
                </div>

                <el-tabs v-model="activeTab" type="border-card" class="setting-tabs">
                    <!-- 角色基本數值 -->
                    <el-tab-pane label="角色" name="character">
                        <div class="tab-body">
                            <div class="field-section-label">角色基本數值</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.character.panelIncludesHolyWater" />
                                <span class="switch-label">我的面板含聖水（勾選後最大生命值／防禦不會再自動加總聖水加成）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">數值基準</label>
                                <el-radio-group v-model="settings.character.statBaseline" size="small">
                                    <el-radio-button value="raw">原始面板</el-radio-button>
                                    <el-radio-button value="buffed">上完buff</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="field-hint">
                                「上完buff」只影響最大生命值／防禦／保護／魔法防禦／魔法保護（高潔誓約的加成不會再重複套用）；攻擊力的面板最大傷害不受影響，仍維持原始面板語意。
                            </div>
                            <div class="field-hint">
                                備註：防禦和血量有許多疊加方式，且每個條件都遠比大傷複雜，所以聖水部分的加乘只會算進高潔誓約（聖水的 HP／防禦會先加進基礎值再吃誓約加成）。建議自行填寫面板。
                            </div>
                            <div class="field-row">
                                <label class="field-label">最大生命值</label>
                                <el-input-number v-model="settings.character.maxHp" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">防禦</label>
                                <el-input-number v-model="settings.character.defense" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">保護</label>
                                <el-input-number v-model="settings.character.protection" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">魔法防禦</label>
                                <el-input-number v-model="settings.character.magicDefense" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">魔法保護</label>
                                <el-input-number v-model="settings.character.magicProtection" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-hint">最大傷害改到「攻擊力」分頁用面板數值＋各項加成推算，這裡不用填。</div>
                            <div class="field-hint" v-if="!settings.character.panelIncludesHolyWater">
                                最大生命值／防禦請填未計入聖水的數值，聖水加成會在「裝備」分頁填寫後自動加總進來。
                            </div>

                            <div class="field-section-label">角色型態</div>
                            <div class="field-row">
                                <label class="field-label">角色型態</label>
                                <el-select v-model="settings.characterBuildId" size="small" class="field-select">
                                    <el-option v-for="b in CHARACTER_BUILDS" :key="b.id" :value="b.id" :label="b.label" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.raceSkillActive" />
                                <span class="switch-label">種族特殊技能已開啟（主動技能，才能增加傷害）</span>
                            </div>
                            <div class="field-hint">{{ currentRaceSkill.label }}</div>
                            <div class="field-hint">對於秘法技能，只增傷秘法技能的才能技能部分傷害。</div>
                        </div>
                    </el-tab-pane>

                    <!-- 裝備 -->
                    <el-tab-pane label="裝備" name="equipment">
                        <div class="tab-body">
                            <div class="field-section-label">武器</div>
                            <div class="field-row">
                                <label class="field-label">武器種類</label>
                                <el-radio-group v-model="settings.weaponType" size="small">
                                    <el-radio-button v-for="t in WEAPON_TYPE_OPTIONS" :key="t.id" :value="t.id">{{ t.label }}</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="field-row">
                                <label class="field-label">武器</label>
                                <el-select v-model="settings.weaponId" size="small" class="field-select">
                                    <el-option v-for="w in weaponOptions" :key="w.id" :value="w.id" :label="`${w.label}${w.extraDamagePercent ? ` (額外傷害+${w.extraDamagePercent}%)` : ''}`" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">銳利等級</label>
                                <el-input-number v-model="settings.sharpLevel" :min="0" :max="11" size="small" class="field-select" />
                                <span class="switch-label">武器／裝備各自不同，手動輸入；套用破防結果時每級 −5 怪物保護（扣除怪物銳利抵抗）</span>
                            </div>

                            <div class="field-section-label">聚能</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.ergActive" />
                                <span class="switch-label">聚能已滿（單手斧：風車+100%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.darkErgActive" />
                                <span class="switch-label">黑暗聚能已滿（單手斧：風車+100%；雙手劍：重擊+150%）</span>
                            </div>

                            <div class="field-section-label">盾牌</div>
                            <div class="field-row">
                                <label class="field-label">盾牌</label>
                                <el-select v-model="settings.shieldId" size="small" class="field-select" :disabled="shieldLocked">
                                    <el-option v-for="s in SHIELD_PRESETS" :key="s.id" :value="s.id" :label="s.label" />
                                </el-select>
                            </div>
                            <div class="field-hint" v-if="shieldLocked">雙手劍無法與盾牌同時裝備（僅巨人型態例外），已鎖定為「無」。</div>

                            <div class="field-section-label">聖水（8 部位，各選一種能力＋填數值）</div>
                            <div class="field-row">
                                <el-button size="small" plain @click="fillAllHolyWater('maxDamage')">全滿大傷</el-button>
                                <el-button size="small" plain @click="fillAllHolyWater('criticalDamage')">全滿暴傷</el-button>
                                <el-button size="small" plain @click="fillAllHolyWater('maxHp')">全滿HP</el-button>
                                <el-button size="small" plain @click="fillAllHolyWater('defense')">全滿防禦</el-button>
                            </div>
                            <div class="equip-table-wrap">
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>部位</th>
                                            <th>聖水能力</th>
                                            <th>聖水數值</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="slot in HOLY_WATER_SLOTS" :key="slot.key">
                                            <td class="equip-slot-label">{{ slot.label }}</td>
                                            <td>
                                                <el-select v-model="settings.holyWater[slot.key].abilityId" size="small" class="holy-water-select" @change="onHolyWaterAbilityChange(slot.key)">
                                                    <el-option value="none" label="無" />
                                                    <el-option v-for="a in HOLY_WATER_ABILITIES" :key="a.id" :value="a.id" :label="`${a.label}（上限 ${a.max}）`" />
                                                </el-select>
                                            </td>
                                            <td>
                                                <el-input-number
                                                    v-model="settings.holyWater[slot.key].value"
                                                    :min="0"
                                                    :max="holyWaterMax(slot.key)"
                                                    :disabled="settings.holyWater[slot.key].abilityId === 'none'"
                                                    :controls="false"
                                                    size="small"
                                                    class="equip-input"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="field-section-label">細工（武器／飾品，重擊/風車/突擊各自獨立選等級）</div>
                            <div class="equip-table-wrap">
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>部位</th>
                                            <th v-for="col in REFORGE_TYPE_COLUMNS" :key="col.id">{{ col.label }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="slot in REFORGE_SLOTS" :key="slot.key">
                                            <td class="equip-slot-label">{{ slot.label }}</td>
                                            <td v-for="col in REFORGE_TYPE_COLUMNS" :key="col.id">
                                                <el-select v-model="settings.reforge[slot.key][col.id]" size="small" class="reforge-level-select">
                                                    <el-option v-for="o in getReforgeLevelOptions(slot.key, settings.weaponType)" :key="o.value" :value="o.value" :label="o.label" />
                                                </el-select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="field-hint">
                                武器選單手斧：0~13（≥11 突破限定）；武器選雙手劍：0~25（≥21 突破限定）；飾品：0~4（4 為突破限定）。
                            </div>

                            <div class="field-section-label">套裝效果（手動；風車最終倍率 +15% 由武器／盾牌自動帶出）</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.manualWindmillBase30Active" />
                                <span class="switch-label">風車基礎倍率 +30%（莊嚴騎士）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.manualChargeEnhanceActive" />
                                <span class="switch-label">突擊最終倍率 +15%</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.manualSmashEnhanceActive" />
                                <span class="switch-label">重擊最終倍率 +15%</span>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 攻擊力 -->
                    <el-tab-pane label="攻擊力" name="attack">
                        <div class="tab-body">
                            <div class="field-section-label">面板最大傷害</div>
                            <div class="field-row">
                                <label class="field-label">面板最大傷害</label>
                                <el-input-number v-model="settings.panelMaxDamage" :min="0" size="small" class="field-select" />
                            </div>
                            <div class="field-hint">
                                請輸入無狀態下（未使用藥水/狀態支援/力量團聚等技能buff）的面板數值，未計入聖水加成；聖水大傷會在「裝備」分頁填寫後自動加總進來，鍋子等其他永久裝備加成也會自動加總。
                            </div>

                            <div class="field-section-label">髒髒最大傷害</div>
                            <div class="field-row">
                                <el-radio-group v-model="settings.dirtyMaxDamage.panelAlreadyIncludesDirty" size="small">
                                    <el-radio-button :value="false">面板未記入</el-radio-button>
                                    <el-radio-button :value="true">面板已計入</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="field-hint">
                                面板未記入：以下欄位會從面板最大傷害扣除，算出乾淨最大傷害（照舊）。面板已計入：面板最大傷害已經含這些加成，以下欄位改為唯讀參考，不參與計算。
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.dirtyMaxDamage.masterGradeActive" :disabled="settings.dirtyMaxDamage.panelAlreadyIncludesDirty" />
                                <span class="switch-label">一代宗師已滿（+30）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">寵物加成</label>
                                <el-checkbox-group v-model="settings.dirtyMaxDamage.petIds" :disabled="settings.dirtyMaxDamage.panelAlreadyIncludesDirty">
                                    <el-checkbox v-for="p in PET_BONUS_OPTIONS" :key="p.id" :value="p.id" :label="`${p.label} (+${p.bonus})`" />
                                </el-checkbox-group>
                            </div>
                            <div class="field-row">
                                <label class="field-label">辦桌</label>
                                <el-input-number
                                    v-model="settings.dirtyMaxDamage.banquetBonus"
                                    :min="0"
                                    size="small"
                                    class="field-select"
                                    :disabled="settings.dirtyMaxDamage.panelAlreadyIncludesDirty"
                                />
                            </div>
                            <div class="field-row">
                                <label class="field-label">活動加成</label>
                                <el-input-number
                                    v-model="settings.dirtyMaxDamage.eventBonus"
                                    :min="0"
                                    size="small"
                                    class="field-select"
                                    :disabled="settings.dirtyMaxDamage.panelAlreadyIncludesDirty"
                                />
                            </div>
                            <div class="field-row">
                                <el-checkbox
                                    v-model="settings.dirtyMaxDamage.transformationActive"
                                    :disabled="transformationReforgeLocked || settings.dirtyMaxDamage.panelAlreadyIncludesDirty"
                                />
                                <span class="switch-label">變身中：{{ currentTransformation.label }}（依角色型態決定，固定 +{{ currentTransformation.baseDamage }}）</span>
                            </div>
                            <div class="field-row" v-if="!transformationReforgeLocked">
                                <el-checkbox
                                    v-model="transformationReforgeEnabled"
                                    :disabled="!settings.dirtyMaxDamage.transformationActive || settings.dirtyMaxDamage.panelAlreadyIncludesDirty"
                                />
                                <span class="switch-label">變身專屬細工（未突破 +{{ currentTransformation.untamedDamage }}）</span>
                                <el-checkbox
                                    v-model="transformationBroken"
                                    :disabled="!transformationReforgeEnabled || !settings.dirtyMaxDamage.transformationActive || settings.dirtyMaxDamage.panelAlreadyIncludesDirty"
                                />
                                <span class="switch-label">突破（+{{ currentTransformation.brokenDamage }}）</span>
                            </div>

                            <div class="field-section-label">常數攻擊力</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.spiritWeaponAttackActive" />
                                <span class="switch-label">精靈武器攻擊力強化（依武器種類：雙手劍+50，單手斧+40）</span>
                            </div>
                            <div class="field-hint">
                                精靈武器攻擊力通常已包含在無狀態面板內：計算時會先從面板扣掉（不吃攻擊係數），最後再加回常數攻擊力；「面板已計入」模式下不扣也不加。
                            </div>

                            <div class="field-section-label">攻擊係數</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackCoefficient.physicalPotionActive" />
                                <span class="switch-label">物理攻擊力增加藥水（×1.2）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackCoefficient.tripleEnchantActive" disabled />
                                <span class="switch-label">職業魔劍三項注魔（×1.1，僅魔劍職業適用，聖盾騎士非魔劍職業，暫時停用）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackCoefficient.statusSupportActive" />
                                <span class="switch-label">[狀態支援]（+12%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackCoefficient.strengthGatherActive" />
                                <span class="switch-label">[力量團聚]（+15%）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">戰場</label>
                                <el-input-number v-model="settings.attackCoefficient.battlefieldPercent" :min="0" :step="0.01" :precision="2" size="small" class="field-select" />
                                <span class="switch-label">%（跟下面的「戰場上的狂吼」是不同的獨立加成）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackCoefficient.battleCryActive" />
                                <span class="switch-label">[戰場上的狂吼]（31.2% + 細工樂器演奏等級×0.2%）</span>
                            </div>
                            <div class="field-row" v-if="settings.attackCoefficient.battleCryActive">
                                <label class="field-label">樂器演奏細工等級</label>
                                <el-select v-model="settings.attackCoefficient.battleCryReforgeLevel" size="small" class="field-select">
                                    <el-option v-for="o in BATTLE_CRY_REFORGE_LEVEL_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 暴擊與額外傷害 -->
                    <el-tab-pane label="暴擊與額外傷害" name="critextra">
                        <div class="tab-body">
                            <div class="field-section-label">暴擊率</div>
                            <div class="field-row">
                                <label class="field-label">暴擊率基準值</label>
                                <el-input-number v-model="settings.criticalRate.baseCriticalRatePercent" :min="0" :max="100" :step="0.1" :precision="1" size="small" class="field-select" />
                                <span class="switch-label">%（依角色屬性/裝備而定，自行輸入）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.criticalRate.itemBonusActive" />
                                <span class="switch-label">道具加成（+{{ CRITICAL_RATE_ITEM_BONUS }}%）</span>
                            </div>
                            <div class="field-hint">
                                暴擊率合計：{{ fmtRatio(calcResult.criticalRatePercent) }}%；暴擊傷害期望值＝100 + 暴擊率% × (暴擊傷害% − 100) / 100 ＝
                                {{ fmtRatio(calcResult.criticalDamageExpected) }}%，才能/秘法技能公式實際套用這個值。
                            </div>

                            <div class="field-section-label">暴擊傷害（基礎 100% 起跳）</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.criticalDamage.skillR1Active" />
                                <span class="switch-label">暴擊技能 R1（+150%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.criticalDamage.fullGradeActive" />
                                <span class="switch-label">評價滿（+10%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.criticalDamage.spiritWeaponCritActive" />
                                <span class="switch-label">精靈武器（+15%）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">武器特殊改造</label>
                                <el-select v-model="settings.criticalDamage.weaponSpecialReforgeTier" size="small" class="field-select">
                                    <el-option value="none" label="無" />
                                    <el-option value="r6" :label="`R6 (+${WEAPON_SPECIAL_REFORGE_CRIT.r6}%)`" />
                                    <el-option value="r7" :label="`R7 (+${WEAPON_SPECIAL_REFORGE_CRIT.r7}%)`" />
                                    <el-option value="r8" :label="`R8 (+${WEAPON_SPECIAL_REFORGE_CRIT.r8}%)`" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">暴擊傷害套裝</label>
                                <el-select v-model="settings.criticalDamage.setTier" size="small" class="field-select">
                                    <el-option value="none" label="無" />
                                    <el-option value="tier4" :label="`+${CRITICAL_DAMAGE_SET_BONUS.tier4}%`" />
                                    <el-option value="tier7" :label="`+${CRITICAL_DAMAGE_SET_BONUS.tier7}%`" />
                                    <el-option value="tier10" :label="`+${CRITICAL_DAMAGE_SET_BONUS.tier10}%（整套暮光）`" />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">艾爾班訓練所圖騰</label>
                                <el-radio-group v-model="settings.criticalDamage.totemChoice" size="small">
                                    <el-radio-button value="none">無</el-radio-button>
                                    <el-radio-button value="critical_damage">+5% 暴擊傷害</el-radio-button>
                                </el-radio-group>
                                <span class="switch-label">（+25 大傷選項已移除：填面板最大傷害時這個永久加成通常已經算進去了，避免重複計算）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">娃娃背包</label>
                                <el-input-number v-model="settings.criticalDamage.dollBagPercent" :min="0" :max="5" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">農場模型</label>
                                <el-input-number v-model="settings.criticalDamage.farmModelPercent" :min="0" :max="17" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">稱號</label>
                                <el-input-number v-model="settings.criticalDamage.titlePercent" :min="0" :max="3" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">布里萊赫的硬幣</label>
                                <el-input-number v-model="settings.criticalDamage.brireheCoinPercent" :min="0" :max="10" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <span class="switch-label">聖水暴擊傷害（自動讀取裝備分頁）：+{{ fmtRatio(calcResult.criticalDamagePercent - 100 - (settings.criticalDamage.skillR1Active ? 150 : 0) - (settings.criticalDamage.fullGradeActive ? 10 : 0) - (settings.criticalDamage.spiritWeaponCritActive ? 15 : 0) - WEAPON_SPECIAL_REFORGE_CRIT[settings.criticalDamage.weaponSpecialReforgeTier] - CRITICAL_DAMAGE_SET_BONUS[settings.criticalDamage.setTier] - (settings.criticalDamage.totemChoice === 'critical_damage' ? 5 : 0) - settings.criticalDamage.dollBagPercent - settings.criticalDamage.farmModelPercent - settings.criticalDamage.titlePercent - settings.criticalDamage.brireheCoinPercent - (settings.criticalDamage.assassinOutfitActive ? 12 : 0)) }}%</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.criticalDamage.assassinOutfitActive" />
                                <span class="switch-label">刺客服裝效果發動中（+12%，20 秒）</span>
                            </div>
                            <div class="field-hint">暴擊傷害總計：{{ fmtRatio(calcResult.criticalDamagePercent) }}%</div>

                            <div class="field-section-label">額外傷害（通用額外傷害 = (1+武器額外傷害) × (1+以下加總)）</div>
                            <div class="field-row">
                                <label class="field-label">稱號</label>
                                <el-input-number v-model="settings.extraDamage.titlePercent" :min="0" :max="1" :step="0.1" :precision="1" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">圖騰</label>
                                <el-input-number v-model="settings.extraDamage.totemPercent" :min="0" :max="1" :step="0.1" :precision="1" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">農場模型</label>
                                <el-input-number v-model="settings.extraDamage.farmModelPercent" :min="0" :max="5" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.extraDamage.setEffectActive" />
                                <span class="switch-label">套裝效果（日月之神隨機發動／暮光套被動，+5%）</span>
                            </div>
                            <div class="field-hint">通用額外傷害倍率：{{ fmtMultiplier(calcResult.generalExtraDamageMultiplier) }}</div>

                            <div class="field-section-label">秘法額外傷害（加總）</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.arcaneExtraDamage.imperfectCrownAuraActive" />
                                <span class="switch-label">不完美的空想王冠光環（+3%）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">布里萊赫的硬幣</label>
                                <el-input-number v-model="settings.arcaneExtraDamage.brireheCoinPercent" :min="0" :max="3" :step="0.05" :precision="2" size="small" class="field-select" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">穆利亞斯的遺物</label>
                                <el-input-number v-model="settings.arcaneExtraDamage.muliasRelicCount" :min="0" :max="3" size="small" class="field-select" />
                                <span class="switch-label">接尾賦予捲軸，身上 0~3 個，每個 +1%</span>
                            </div>
                            <div class="field-hint">
                                秘法額外傷害加總：+{{ fmtRatio(calcResult.arcaneExtraDamagePercent) }}%（已套用於 7 個秘法技能的傷害公式，重擊/風車/突擊/猛擊等才能技能不吃）
                            </div>

                            <div class="field-section-label">最終增加傷害（乘算）</div>
                            <div v-if="settings.armorBreak.enabled" class="field-hint">
                                已套用「破防」結果：死神烙印、命運編織．倒吊人、洞察之眼、幸運草標記已包含在破防的「所受傷害增加」，以下四項停用（改在「破防」分頁調整）。
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.finalIncreaseDamage.combatServiceBuffActive" />
                                <span class="switch-label">戰鬥服務 buff（+1%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.finalIncreaseDamage.dakotaGlowActive" />
                                <span class="switch-label">達可達的強力威光（+5%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.finalIncreaseDamage.deathBrand.active" :disabled="settings.armorBreak.enabled" />
                                <span class="switch-label">死神烙印（基礎 53%）</span>
                            </div>
                            <template v-if="settings.finalIncreaseDamage.deathBrand.active && !settings.armorBreak.enabled">
                                <div class="field-row">
                                    <el-checkbox v-model="settings.finalIncreaseDamage.deathBrand.setBonusActive" />
                                    <span class="switch-label">死神烙印套裝加成（+3%）</span>
                                    <label class="field-label">細工等級</label>
                                    <el-input-number v-model="settings.finalIncreaseDamage.deathBrand.reforgeLevel" :min="0" :max="25" size="small" class="field-select-sm" />
                                    <span class="switch-label">（×0.25%/級，21~25 突破限定）</span>
                                </div>
                            </template>
                            <div class="field-row">
                                <label class="field-label">憤怒衝擊魔法陣</label>
                                <el-input-number v-model="settings.finalIncreaseDamage.rageImpactMagicCircleLevel" :min="0" :max="10" size="small" class="field-select" />
                            </div>
                            <div class="field-hint">
                                憤怒衝擊本體開關在「技能設定」分頁的「近距離額外傷害中」；公式 = 15% + 魔法陣等級×0.3%。
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.finalIncreaseDamage.destinyWeaveActive" :disabled="settings.armorBreak.enabled" />
                                <span class="switch-label">命運編織．倒吊人（+5%，60 秒內）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.finalIncreaseDamage.insightEye.active" :disabled="settings.armorBreak.enabled" />
                                <span class="switch-label">特性．洞察之眼（+3%）</span>
                            </div>
                            <div class="field-row" v-if="settings.finalIncreaseDamage.insightEye.active && !settings.armorBreak.enabled">
                                <label class="field-label">指揮官的徽章等級</label>
                                <el-input-number v-model="settings.finalIncreaseDamage.insightEye.commanderBadgeLevel" :min="0" :max="5" size="small" class="field-select-sm" />
                                <span class="switch-label">（×0.4%/級，最高 +2%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.finalIncreaseDamage.cloverMarkActive" :disabled="settings.armorBreak.enabled" />
                                <span class="switch-label">幸運草標記（+15%）</span>
                            </div>
                            <div class="field-hint">最終增加傷害倍率：{{ fmtMultiplier(calcResult.finalIncreaseDamageMultiplier) }}</div>
                        </div>
                    </el-tab-pane>

                    <!-- 職業 / 技能設定 -->
                    <el-tab-pane label="技能設定" name="skill">
                        <div class="tab-body">
                            <div class="field-section-label">顯示的技能</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.showHolySanctuary" />
                                <span class="switch-label">聖域展開</span>
                                <el-checkbox v-model="settings.showInstantTaunt" />
                                <span class="switch-label">零秒嘲諷</span>
                                <el-checkbox v-model="settings.showShieldCharge" />
                                <span class="switch-label">盾擊衝鋒</span>
                                <el-checkbox v-model="settings.showIronWallStrike" />
                                <span class="switch-label">盾崩強襲</span>
                                <el-checkbox v-model="settings.showJudgementStrike" />
                                <span class="switch-label">審判重擊</span>
                                <el-checkbox v-model="settings.showSacrificePunishment" />
                                <span class="switch-label">犧牲懲戒</span>
                                <el-checkbox v-model="settings.showRadiantJudgement" />
                                <span class="switch-label">光輝斷罪</span>
                                <el-checkbox v-model="settings.showSmashSkill" />
                                <span class="switch-label">重擊</span>
                                <el-checkbox v-model="settings.showWindmillSkill" />
                                <span class="switch-label">風車</span>
                                <el-checkbox v-model="settings.showMengJiSkill" />
                                <span class="switch-label">猛擊</span>
                            </div>
                            <div class="field-row" v-if="settings.showMengJiSkill">
                                <label class="field-label">猛擊層數</label>
                                <el-radio-group v-model="settings.mengJiStack" size="small">
                                    <el-radio-button :value="1">1</el-radio-button>
                                    <el-radio-button :value="2">2</el-radio-button>
                                    <el-radio-button :value="3">3</el-radio-button>
                                    <el-radio-button :value="4">4</el-radio-button>
                                    <el-radio-button :value="5">5</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="field-hint" v-if="settings.showMengJiSkill">
                                每次使用 +1 階，滿 5 階持續 20 秒，時間到降 1 階；勾選「猛擊」即視為對應層數的近戰才能技能傷害 buff 生效中，併入才能增加傷害。
                            </div>

                            <div class="field-section-label">魔法陣（最多選 {{ MAGIC_CIRCLE_LIMIT }} 個）</div>
                            <div class="field-row">
                                <el-select v-model="settings.magicCircleIds" multiple :multiple-limit="MAGIC_CIRCLE_LIMIT" size="small" class="field-select" style="width: 100%">
                                    <el-option v-for="c in MAGIC_CIRCLE_OPTIONS" :key="c.id" :value="c.id" :label="c.label" />
                                </el-select>
                            </div>

                            <div class="field-section-label">狀態</div>
                            <div class="field-row">
                                <el-switch v-model="settings.nobleOathEnabled" />
                                <span class="switch-label">
                                    <img width="20" height="20" :src="getSkillIcon(59088)" alt="高潔誓約" class="skill-icon-inline" />
                                    高潔誓約
                                </span>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="settings.rageImpactBuffActive" />
                                <span class="switch-label">近距離額外傷害中（憤怒衝擊，觸發後 7 秒內；詳細數值在「暴擊與額外傷害」分頁調整）</span>
                            </div>

                            <div class="field-section-label">穆利亞斯的遺物（3 件，各自獨立 Lv0~10）</div>
                            <div class="field-row">
                                <label class="field-label">誓約每秒犧牲恢復</label>
                                <el-select v-model="settings.muliasRelic.sacrificeRegenLevel" size="small" class="field-select-sm">
                                    <el-option v-for="o in MULIAS_RELIC_LEVEL_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <span class="switch-label">高潔誓約每秒犧牲恢復量 +{{ (settings.muliasRelic.sacrificeRegenLevel * MULIAS_RELIC_SACRIFICE_REGEN_PER_LEVEL).toFixed(2) }}/秒（每級 +{{ MULIAS_RELIC_SACRIFICE_REGEN_PER_LEVEL }}，純顯示，尚無基準值可疊加）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">反射的痕跡</label>
                                <el-select v-model="settings.muliasRelic.reflectionTraceLevel" size="small" class="field-select-sm">
                                    <el-option v-for="o in MULIAS_RELIC_LEVEL_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <el-checkbox v-model="settings.muliasRelic.reflectionTraceActive" />
                                <span class="switch-label">犧牲懲戒觸發反射的痕跡中（+{{ (settings.muliasRelic.reflectionTraceLevel * MULIAS_RELIC_REFLECTION_TRACE_PER_LEVEL).toFixed(1) }}% 聖盾技能傷害，併入最終增加傷害）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">審判重擊基礎傷害</label>
                                <el-select v-model="settings.muliasRelic.judgementStrikeLevel" size="small" class="field-select-sm">
                                    <el-option v-for="o in MULIAS_RELIC_LEVEL_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                                <span class="switch-label">審判重擊基礎傷害比例 +{{ settings.muliasRelic.judgementStrikeLevel * MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL }}%（3500% → {{ 3500 + settings.muliasRelic.judgementStrikeLevel * MULIAS_RELIC_JUDGEMENT_STRIKE_BASE_PER_LEVEL }}%）</span>
                            </div>

                            <div class="field-section-label">施工中（公式尚待驗證，暫時停用）</div>
                            <div class="field-row">
                                <label class="field-label">目前犧牲</label>
                                <el-input-number v-model="settings.currentSacrifice" :min="0" :max="SACRIFICE_CAP" size="small" class="field-select" disabled />
                            </div>
                            <div class="field-row">
                                <label class="field-label">光輝斷罪階段</label>
                                <el-radio-group v-model="settings.radiantJudgementStage" size="small" disabled>
                                    <el-radio-button :value="1">1</el-radio-button>
                                    <el-radio-button :value="2">2</el-radio-button>
                                    <el-radio-button :value="3">3</el-radio-button>
                                </el-radio-group>
                                <el-button size="small" plain disabled @click="advanceRadiantStage">使用後推進</el-button>
                            </div>
                            <div class="field-row">
                                <label class="field-label">本次受到 HIT 數（盾崩強襲 → 犧牲）</label>
                                <el-input-number v-model="settings.ironWallHitCount" :min="0" size="small" class="field-select" disabled />
                            </div>
                            <div class="iron-wall-preview">
                                <span>本次獲得 <strong>+{{ ironWallPreview.gained }}</strong> 犧牲</span>
                                <span>犧牲：{{ settings.currentSacrifice }} → {{ ironWallPreview.newTotal }}<template v-if="ironWallPreview.capped">（已達上限 {{ SACRIFICE_CAP }}）</template></span>
                                <el-button size="small" type="primary" plain disabled @click="applyIronWallSacrifice">套用到目前犧牲</el-button>
                            </div>
                            <div class="field-hint">盾崩強襲的犧牲獲取僅在「高潔誓約」開啟時生效。</div>
                        </div>
                    </el-tab-pane>

                    <!-- 技能使用次數 -->
                    <el-tab-pane label="技能使用次數" name="usage">
                        <div class="tab-body">
                            <div class="field-section-label">各技能使用次數（用於計算總輸出／裝備比較／傷害效益）</div>
                            <div class="equip-table-wrap">
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>技能</th>
                                            <th>單次傷害</th>
                                            <th>使用次數</th>
                                            <th>小計</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="meta in ALL_SKILL_META" :key="meta.id">
                                            <td class="equip-slot-label">
                                                <img width="20" height="20" :src="getSkillIcon(meta.imageId)" :alt="meta.label" class="skill-icon-inline" />
                                                {{ meta.label }}
                                            </td>
                                            <td>{{ fmtInt(allSkills.find((s) => s.skillId === meta.id)?.finalDamage ?? 0) }}</td>
                                            <td>
                                                <el-input-number v-model="settings.skillUsageCounts[meta.id]" :min="0" :controls="false" size="small" class="equip-input" />
                                            </td>
                                            <td>{{ fmtInt((allSkills.find((s) => s.skillId === meta.id)?.finalDamage ?? 0) * settings.skillUsageCounts[meta.id]) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="field-hint">總輸出＝Σ（單次傷害 × 使用次數），供「裝備比較」與「傷害效益」分頁計算使用。</div>
                        </div>
                    </el-tab-pane>

                    <!-- 裝備比較 -->
                    <el-tab-pane label="裝備比較" name="compare">
                        <div class="tab-body">
                            <div class="field-section-label">最多選擇 3 組已儲存配置比較（依「技能使用次數」分頁的次數計算總輸出）</div>
                            <div v-if="presets.length === 0" class="field-hint">尚無儲存配置，請先在「儲存 / 讀取」保存至少一組設定。</div>
                            <template v-else>
                                <div class="field-row" v-for="(_slot, idx) in comparisonSlots" :key="idx">
                                    <label class="field-label">配置 {{ idx + 1 }}</label>
                                    <el-select v-model="comparisonSlots[idx]" size="small" class="field-select" clearable placeholder="未選擇">
                                        <el-option v-for="(p, pIdx) in presets" :key="pIdx" :value="pIdx" :label="p.name" />
                                    </el-select>
                                </div>

                                <div class="equip-table-wrap">
                                    <table class="equip-table">
                                        <thead>
                                            <tr>
                                                <th>技能</th>
                                                <th v-for="(r, idx) in comparisonResults" :key="idx">{{ r?.name ?? "-" }}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="meta in ALL_SKILL_META" :key="meta.id">
                                                <td class="equip-slot-label">
                                                    <img width="20" height="20" :src="getSkillIcon(meta.imageId)" :alt="meta.label" class="skill-icon-inline" />
                                                    {{ meta.label }}
                                                </td>
                                                <td v-for="(r, idx) in comparisonResults" :key="idx" :class="{ 'comparison-best': r && isSkillDamageBest(meta, idx) }">
                                                    {{ r ? fmtInt(comparisonDamageFor(r, meta.id) ?? 0) : "-" }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="equip-slot-label">總輸出（依技能使用次數）</td>
                                                <td v-for="(r, idx) in comparisonResults" :key="idx" :class="{ 'comparison-best': r && isTotalOutputBest(idx) }">
                                                    <strong>{{ r ? fmtInt(r.totalOutput) : "-" }}</strong>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </template>
                        </div>
                    </el-tab-pane>

                    <!-- 傷害效益 -->
                    <el-tab-pane label="傷害效益" name="efficiency">
                        <div class="tab-body">
                            <div class="field-section-label">各屬性 1 單位等同多少大傷（依目前設定 + 技能使用次數，微擾量測邊際效益）</div>
                            <div v-if="!hasAnyUsageCount" class="field-hint">請先在「技能使用次數」分頁設定至少一個技能的使用次數，才能計算屬性效益。</div>
                            <div class="equip-table-wrap" v-else>
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>屬性</th>
                                            <th>單位</th>
                                            <th>等同大傷</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in efficiencyItems" :key="item.id">
                                            <td class="equip-slot-label">{{ item.label }}</td>
                                            <td>{{ item.unit }}</td>
                                            <td>{{ item.equivalentMaxDamage === null ? "-" : fmtDecimal(item.equivalentMaxDamage) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div class="field-section-label">聖水單格比較（多一格聖水、填滿上限的直接結果，已含暴擊期望值）</div>
                            <div class="field-hint">HP／防禦的聖水加乘只會算進高潔誓約，其他疊加方式未計入，建議自行填寫面板。</div>
                            <div v-if="!hasAnyUsageCount" class="field-hint">請先在「技能使用次數」分頁設定至少一個技能的使用次數。</div>
                            <div class="equip-table-wrap" v-else>
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>聖水能力</th>
                                            <th>數值</th>
                                            <th>總輸出增加</th>
                                            <th>增幅</th>
                                            <th>等同大傷</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="item in holyWaterComparison" :key="item.id" :class="{ 'comparison-best': item.id === bestHolyWaterId }">
                                            <td class="equip-slot-label">{{ item.label }}</td>
                                            <td>{{ item.valueText }}</td>
                                            <td>{{ fmtInt(item.deltaOutput) }}</td>
                                            <td>{{ item.deltaPercent === null ? "-" : `${fmtDecimal(item.deltaPercent)}%` }}</td>
                                            <td>{{ item.equivalentMaxDamage === null ? "-" : fmtDecimal(item.equivalentMaxDamage) }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- Debug -->
                    <el-tab-pane label="破防" name="armorbreak">
                        <div class="tab-body">
                            <div class="field-row">
                                <el-checkbox v-model="settings.armorBreak.enabled" />
                                <span class="switch-label">
                                    套用破防結果到傷害計算（物理側：保護減算 ×{{ calcResult.protectionReduction.toFixed(2) }}、所受傷害
                                    +{{ fmtRatio(settings.armorBreak.damageTakenPercent) }}%、暴擊傷害 +{{ fmtRatio(settings.armorBreak.critDamagePercent) }}%）
                                </span>
                            </div>
                            <div class="field-hint">
                                聖盾騎士傷害全為物理。近戰技能傷害 debuff 已由「憤怒衝擊」計入最終增加傷害，這裡不重複套用；追加傷害尚未實作，也未接入。
                            </div>
                        </div>
                        <div class="pb-embed">
                            <ProtectionBreakPanel single :pierce="settings.sharpLevel" @result="onArmorBreakResult" />
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="Debug" name="debug">
                        <div class="tab-body">
                            <div class="field-section-label">settings（原始輸入值，會自動存檔的那份）</div>
                            <pre class="debug-dump">{{ JSON.stringify(settings, null, 2) }}</pre>
                            <div class="field-section-label">calcResult（依 settings 算出來的衍生數值）</div>
                            <pre class="debug-dump">{{ JSON.stringify(calcResult, null, 2) }}</pre>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- ════════ 右側 — 最終面板 ════════ -->
            <div class="dashboard-panel">
                <div class="result-card grade-inspiring">
                    <div class="result-card-header">
                        <span class="grade-name">最終面板</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            乾淨最大傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.cleanMaxDamage }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(calcResult.cleanMaxDamage) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            髒髒總和
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.dirtyMaxDamageTotal }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(calcResult.dirtyMaxDamageTotal) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            最終最大傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.finalMaxDamage }}
                            </el-popover>
                        </span>
                        <span class="result-value">{{ fmtInt(finalStats.maxDamage) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            最大生命值
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.maxHp }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(finalStats.maxHp) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            防禦
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.defense }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(finalStats.defense) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            保護
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.protection }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(finalStats.protection) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            魔法防禦
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.magicDefense }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(finalStats.magicDefense) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            魔法保護
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.magicProtection }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(finalStats.magicProtection) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            防護
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.defensePower }}
                            </el-popover>
                        </span>
                        <span class="result-value">{{ fmtInt(finalStats.defensePower) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            盾牌減傷率
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.shieldDamageReduction }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtPercent(finalStats.shieldDamageReduction) }}</span>
                    </div>
                    <div class="result-group-label">暴擊／額外傷害／增傷倍率</div>
                    <div class="result-row">
                        <span class="result-label">
                            暴擊率
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.criticalRatePercent }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtRatio(calcResult.criticalRatePercent) }}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            暴擊傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.criticalDamagePercent }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtRatio(calcResult.criticalDamagePercent) }}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            暴擊傷害期望值
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.criticalDamageExpected }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtRatio(calcResult.criticalDamageExpected) }}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            通用額外傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.generalExtraDamageMultiplier }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.generalExtraDamageMultiplier) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            秘法額外傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.arcaneExtraDamagePercent }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">+{{ fmtRatio(calcResult.arcaneExtraDamagePercent) }}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            保護減算
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.protectionReduction }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.protectionReduction) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            才能增加傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.talentIncreaseDamageMultiplier }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.talentIncreaseDamageMultiplier) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            最終增加傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.finalIncreaseDamageMultiplier }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.finalIncreaseDamageMultiplier) }}</span>
                    </div>
                    <div class="result-group-label">才能技能能力值（風車/突擊餵進秘法技能公式，重擊僅供參考）</div>
                    <div class="result-row">
                        <span class="result-label">
                            風車傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.windmillDamage }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(abilities.windmillDamage) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            突擊傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.chargeDamage }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(abilities.chargeDamage) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            重擊傷害
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.smashDamage }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtInt(abilities.smashDamage) }}</span>
                    </div>
                    <div class="result-group-label">發動中的套裝效果</div>
                    <div class="result-row" v-if="activeSetEffectLabels.length === 0">
                        <span class="result-label">無</span>
                    </div>
                    <div class="result-row" v-for="label in activeSetEffectLabels" :key="label">
                        <span class="result-label">{{ label }}</span>
                    </div>
                    <div class="result-group-label">總輸出（見「技能使用次數」分頁）</div>
                    <div class="result-row">
                        <span class="result-label">
                            總輸出
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.totalOutput }}
                            </el-popover>
                        </span>
                        <span class="result-value">{{ fmtInt(totalOutput) }}</span>
                    </div>
                </div>

                <div class="util-copyrights">
                    重擊/風車/突擊/猛擊（才能技能）已套用完整的攻擊力/暴擊傷害/額外傷害公式。7 個秘法技能也都已正式套用秘法技能公式：盾崩強襲/審判重擊/光輝斷罪借用風車傷害、盾擊衝鋒借用突擊傷害當「採計的才能技能目標傷害」，聖域展開/零秒嘲諷/犧牲懲戒則是純秘法技能（不借用任何才能技能）。
                </div>
            </div>
        </div>

        <!-- ════════ 技能傷害 ════════ -->
        <div class="skill-section">
            <h2 class="skill-section-title">技能傷害</h2>
            <div class="skill-grid">
                <div v-for="skill in skills" :key="skill.skillId" class="skill-card" :class="{ 'skill-card-locked': skill.locked }">
                    <div class="skill-card-header">
                        <span class="skill-name">
                            <img width="24" height="24" :src="getSkillIcon(skillImageId(skill.skillId))" :alt="skill.name" />
                            {{ skill.name }}
                        </span>
                        <span class="skill-damage">{{ fmtInt(skill.finalDamage) }}</span>
                    </div>
                    <div v-if="skill.locked" class="locked-badge">🔒 {{ skill.lockedReason }}</div>

                    <div class="skill-terms">
                        <div v-for="term in skill.terms" :key="term.label" class="term-row">
                            <span class="term-label">{{ term.label }}</span>
                            <span class="term-ratio">{{ fmtRatio(term.ratioPercent) }}%</span>
                            <span class="term-value">{{ fmtInt(term.amount) }}</span>
                        </div>
                    </div>

                    <div v-if="skill.passiveLabel" class="skill-passive">職業被動：{{ skill.passiveLabel }}</div>

                    <table v-if="skill.stages" class="stage-table">
                        <thead>
                            <tr>
                                <th>階段</th>
                                <th>傷害</th>
                                <th>犧牲</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="s in skill.stages" :key="s.stage" :class="{ 'stage-current': s.stage === settings.radiantJudgementStage }">
                                <td>{{ s.stage }}</td>
                                <td>{{ fmtInt(s.finalDamage) }}</td>
                                <td>{{ s.sacrificeGain ? `+${s.sacrificeGain}` : "-" }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div v-if="skill.totalOverDuration" class="skill-extra">15 秒總傷害：{{ fmtInt(skill.totalOverDuration) }}</div>

                    <div class="skill-footer">
                        <span class="skill-sacrifice" v-if="skill.sacrificeNote">{{ skill.sacrificeNote }}</span>
                        <span class="skill-sacrifice" v-else-if="skill.sacrificeGain">犧牲獲取：+{{ skill.sacrificeGain }}</span>
                        <span class="skill-cd">{{ skill.cooldownText }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sk-calc {
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
.verify-alert {
    max-width: 1280px;
    margin: 0 auto 1.5rem;
}

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
.preset-loaded {
    font-size: 0.72rem;
    color: var(--color-accent-hover, #fcd34d);
}
.preset-item-loaded {
    outline: 1px solid var(--color-accent-hover, #fcd34d);
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
    width: 220px;
    max-width: 100%;
    flex-shrink: 0;
}
.field-select-sm {
    width: 120px;
    max-width: 100%;
    flex-shrink: 0;
}
.field-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    width: 140px;
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
.debug-dump {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 8px;
    padding: 0.75rem;
    font-size: 0.7rem;
    line-height: 1.5;
    color: var(--color-text-secondary, #d1d5db);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 480px;
    overflow-y: auto;
}

/* ── 小表格（裝備欄位/聖水/細工共用） ── */
.equip-table-wrap {
    overflow-x: auto;
}
.equip-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.78rem;
}
.equip-table th,
.equip-table td {
    padding: 0.3rem 0.35rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
    text-align: left;
    white-space: nowrap;
}
.equip-table thead th {
    color: var(--color-text-muted, #9ca3af);
    font-weight: 600;
}
.equip-slot-label {
    color: var(--color-text-secondary, #d1d5db);
    font-weight: 600;
}
/* 嵌入的破防面板：套用本頁的卡片／標題／表格樣式（面板本身維持獨立頁面的樣式） */
.pb-embed :deep(.pb-panel) {
    font-size: 0.8rem;
}
.pb-embed :deep(.pb-panel .el-card) {
    background: var(--color-bg-secondary, #1f2937) !important;
    border: 1px solid var(--color-border-primary, #374151) !important;
    border-radius: 8px !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin-bottom: 0.75rem !important;
}
.pb-embed :deep(.pb-panel .el-card__body) {
    padding: 0.6rem 0.75rem;
}
.pb-embed :deep(.pb-panel h2) {
    font-size: 0.85rem;
    color: var(--color-accent-hover, #fcd34d);
}
.pb-embed :deep(.pb-panel .cfg-grid) {
    grid-template-columns: 1fr !important;
}
.pb-embed :deep(.pb-panel .cmp-table) {
    font-size: 0.78rem;
}
.skill-icon-inline {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.3rem;
    border-radius: 4px;
}
.equip-input {
    width: 90px;
}
.equip-input :deep(.el-input__inner) {
    text-align: left;
}
.holy-water-select {
    width: 190px;
}
.reforge-level-select {
    width: 110px;
}
.equip-na-cell {
    text-align: center;
    color: var(--color-text-disabled, #6b7280);
}
.comparison-best {
    background: rgba(251, 191, 36, 0.12);
    color: var(--color-accent-hover, #fcd34d);
    font-weight: 700;
}

/* ── 鐵壁猛擊 HIT 計算 ── */
.iron-wall-preview {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.04);
    border: 1px dashed rgba(255, 255, 255, 0.12);
    border-radius: 8px;
    font-size: 0.8rem;
    color: var(--color-text-secondary, #d1d5db);
}

/* ── 右側最終面板 ── */
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
    display: inline-flex;
    align-items: center;
    font-size: 0.85rem;
    color: var(--color-text-muted, #9ca3af);
}
.info-icon {
    margin-left: 0.3rem;
    font-size: 0.78rem;
    color: var(--color-text-disabled, #6b7280);
    cursor: pointer;
    flex-shrink: 0;
}
.info-icon:hover {
    color: var(--color-accent-hover, #fcd34d);
}
.result-value {
    font-size: 1.35rem;
    font-weight: 700;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-primary, #f9fafb);
    white-space: nowrap;
}
.result-value.sub {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--color-text-secondary, #9ca3af);
}
.result-group-label {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--color-border-primary, #374151);
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--color-text-disabled, #6b7280);
}

.util-copyrights {
    font-size: 0.72rem;
    color: var(--color-text-disabled, #6b7280);
    line-height: 1.6;
}

/* ── 技能傷害 ── */
.skill-section {
    max-width: 1280px;
    margin: 1.5rem auto 0;
}
.skill-section-title {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    color: var(--color-text-primary, #f9fafb);
}
.skill-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}
.skill-card {
    background: var(--color-bg-secondary, #1f2937);
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 12px;
    padding: 1rem 1.1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
.skill-card-locked {
    opacity: 0.75;
}
.skill-card-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
}
.skill-name {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--color-text-primary, #f9fafb);
}
.skill-name img {
    border-radius: 4px;
    flex-shrink: 0;
}
.skill-damage {
    font-size: 1.3rem;
    font-weight: 700;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-accent-hover, #fcd34d);
    white-space: nowrap;
}
.locked-badge {
    font-size: 0.74rem;
    color: #f87171;
}
.skill-terms {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.term-row {
    display: grid;
    grid-template-columns: 1fr 3.5rem 5rem;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: var(--color-text-muted, #9ca3af);
}
.term-ratio {
    text-align: right;
    color: var(--color-text-disabled, #6b7280);
}
.term-value {
    text-align: right;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-secondary, #d1d5db);
}
.skill-passive {
    font-size: 0.76rem;
    color: #7dd3fc;
}
.skill-extra {
    font-size: 0.76rem;
    color: var(--color-text-secondary, #d1d5db);
}
.stage-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.76rem;
}
.stage-table th,
.stage-table td {
    padding: 0.2rem 0.3rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
    text-align: left;
}
.stage-current {
    background: rgba(251, 191, 36, 0.1);
}
.skill-footer {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.72rem;
    color: var(--color-text-disabled, #6b7280);
    margin-top: auto;
    padding-top: 0.4rem;
    border-top: 1px dashed rgba(255, 255, 255, 0.12);
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

<style>
/* el-popover 的內容會 teleport 到 body，scoped 樣式碰不到，另外開一個全域區塊 */
.detail-popover {
    font-size: 0.78rem;
    line-height: 1.6;
}
</style>
