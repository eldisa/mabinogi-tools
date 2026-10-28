<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { ElMessageBox } from "element-plus";
import {
    ELEMENTS,
    ELEMENT_LABELS,
    MASTERY_REFORGE_STEP,
    MASTERY_REFORGE_MAX,
    CYLINDER_OPTIONS,
    REFORGE_FIELDS,
    COMBO_META,
    COMBO_MAX_CRYSTALS,
    COMBO_OGHAM_MAX,
    RELIC_MAX_LEVEL,
    NIGHTMARE_RATIOS,
    CHEMICAL_FOLLOW_UP_AVG_RATIO,
    SKILL_META,
    createDefaultSettings,
    mergeSettings,
    calculateAlchemy,
    calculateTotalOutput,
    flamerHits,
    type ArcaneId,
    type CritMode,
    type AlchemySettings,
} from "../data/alchemyCalculator";
import { getSkillIcon } from "../utils/image";
import ProtectionBreakPanel from "../components/ProtectionBreakPanel.vue";

const settings = reactive<AlchemySettings>(createDefaultSettings());
const ARCANE_IDS: ArcaneId[] = ["spiral", "chemical", "nightmare"];
const ARCANE_LABELS: Record<ArcaneId, string> = { spiral: "地裂螺旋", chemical: "化學狂歡", nightmare: "召喚噩夢" };
const RELIC_NOTES: Record<ArcaneId, string> = {
    spiral: "秘法部分 ×(1 + 2%／級)，10 級 ×1.2（說明 200% ÷ 10）",
    chemical: "秘法部分 ×(1 + 3%／級)，10 級 ×1.3（說明 300% ÷ 10），第一次與後續爆炸相同",
    nightmare: "4 能量額外傷害值倍率 +5%／級，10 級 480% → 530%",
};

// 畫面偏好（分頁／暴擊顯示模式）：只存這台瀏覽器
const DISPLAY_PREFS_KEY = "alchemy_calc_display_v1";
const TAB_NAMES = ["attack", "reforge", "critextra", "skill", "armorbreak", "usage"];
const CRIT_MODES: CritMode[] = ["noCrit", "crit", "expected"];
function readJson<T>(key: string): T | null {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : null;
    } catch {
        return null;
    }
}
function writeJson(key: string, value: unknown) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* 瀏覽器禁用儲存時忽略 */
    }
}
const displayPrefs = readJson<{ tab?: string; critMode?: string }>(DISPLAY_PREFS_KEY) ?? {};
const activeTab = ref(TAB_NAMES.includes(displayPrefs.tab ?? "") ? (displayPrefs.tab as string) : "attack");
const critDisplayMode = ref<CritMode>(CRIT_MODES.includes(displayPrefs.critMode as CritMode) ? (displayPrefs.critMode as CritMode) : "expected");
watch([activeTab, critDisplayMode], () => writeJson(DISPLAY_PREFS_KEY, { tab: activeTab.value, critMode: critDisplayMode.value }));

// ── 破防：面板發出魔法側結果，存進 settings（跟著存檔走），是否套用由 settings.armorBreak.enabled 決定 ──
type ArmorBreakResult = { protBeforePierce: number; pierceResist: number; damageTakenPercent: number; critDamagePercent: number };
// 讀取存檔會蓋掉 settings.armorBreak，留一份面板最新結果，讀檔後再套回去（面板畫面才是目前的破防組合）
let latestArmorBreak: ArmorBreakResult | null = null;
function onArmorBreakResult(r: ArmorBreakResult) {
    latestArmorBreak = r;
    Object.assign(settings.armorBreak, {
        protBeforePierce: r.protBeforePierce,
        pierceResist: r.pierceResist,
        damageTakenPercent: r.damageTakenPercent,
        critExtraPercent: r.critDamagePercent, // 面板欄位名沿用：其實是暴擊時通用額外傷害（銳利目光）
    });
}

// ── 計算 ──
const calcResult = computed(() => calculateAlchemy(settings));
const cardSkills = computed(() => calculateAlchemy(settings, critDisplayMode.value).skills);
const totalOutput = computed(() => calculateTotalOutput(settings));
const hasAnyUsage = computed(() => SKILL_META.some((s) => settings.usage[s.id] > 0));
const usageRows = computed(() =>
    calcResult.value.skills.map((sk) => {
        const subtotal = sk.damage * (settings.usage[sk.id] ?? 0);
        return { ...sk, subtotal, share: totalOutput.value > 0 ? (subtotal / totalOutput.value) * 100 : 0 };
    }),
);
const expandedSkillIds = ref<string[]>([]);
function toggleExpanded(id: string) {
    const i = expandedSkillIds.value.indexOf(id);
    if (i >= 0) expandedSkillIds.value.splice(i, 1);
    else expandedSkillIds.value.push(id);
}

const fmtInt = (n: number): string => Math.round(n).toLocaleString("zh-Hant");
const fmtRatio = (n: number): string => String(Math.round(n * 100) / 100);
const fmtPct = (ratio: number): string => `${fmtRatio(ratio * 100)}%`;
const fmtMultiplier = (n: number): string => `×${n.toFixed(4)}`;

// ═══════════════════════════════════════════════════════
//  儲存 / 讀取（本機）＋ 自動存檔
// ═══════════════════════════════════════════════════════
const PRESET_KEY = "alchemy_calc_presets_v2";
const AUTOSAVE_KEY = "alchemy_calc_autosave_v2";
interface AlchemyPreset {
    name: string;
    timestamp: number;
    data: AlchemySettings;
}
const storedPresets = readJson<AlchemyPreset[]>(PRESET_KEY);
const presets = ref<AlchemyPreset[]>(Array.isArray(storedPresets) ? storedPresets : []);
const newPresetName = ref("");
const showPresetPanel = ref(false);
const loadedPresetTimestamp = ref<number | null>(null);
const loadedPreset = computed(() => presets.value.find((p) => p.timestamp === loadedPresetTimestamp.value) ?? null);
const persistPresets = () => writeJson(PRESET_KEY, presets.value);

function applyLoadedSettings(data: unknown) {
    Object.assign(settings, mergeSettings(data));
    if (latestArmorBreak) onArmorBreakResult(latestArmorBreak);
}
function saveAsNewPreset() {
    const timestamp = Date.now();
    presets.value.push({ name: newPresetName.value.trim() || `配置 ${presets.value.length + 1}`, timestamp, data: JSON.parse(JSON.stringify(settings)) });
    newPresetName.value = "";
    loadedPresetTimestamp.value = timestamp;
    persistPresets();
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
function loadPreset(idx: number) {
    const p = presets.value[idx];
    if (!p) return;
    applyLoadedSettings(p.data);
    loadedPresetTimestamp.value = p.timestamp;
}
function deletePreset(idx: number) {
    if (presets.value[idx]?.timestamp === loadedPresetTimestamp.value) loadedPresetTimestamp.value = null;
    presets.value.splice(idx, 1);
    persistPresets();
}
function renamePreset(idx: number, name: string) {
    const p = presets.value[idx];
    if (!p) return;
    p.name = name.trim() || p.name;
    persistPresets();
}
const fmtDate = (ts: number) => new Date(ts).toLocaleString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
function resetAll() {
    applyLoadedSettings(createDefaultSettings());
    loadedPresetTimestamp.value = null;
}

const autosaved = readJson<unknown>(AUTOSAVE_KEY);
if (autosaved) applyLoadedSettings(autosaved);
let autosaveTimer: ReturnType<typeof setTimeout> | undefined;
watch(
    settings,
    () => {
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => writeJson(AUTOSAVE_KEY, settings), 500);
    },
    { deep: true },
);

const RESULT_DETAILS: Record<string, string> = {
    alchDamage: "角色資訊上的屬性鍊金傷害，加上臨時加成（寵物等）。秘法部分用四屬性平均計算。",
    masteryZone:
        "精通區 = (1 + (精通效率 10% + 細工) ÷ 2) × 鋼瓶（四屬性 +30% 鋼瓶 ×1.30）；細工說明每級 0.5%（土 0.2%），實際生效一半。火／水、鋼瓶獨立乘算已實測（2026-10-25）。秘法的平均部分不吃精通區。",
    crit: "暴擊 = 本次傷害 + 最大傷害 × (150% + 暴擊傷害加成)，這裡一律以最大傷害計算，所以暴擊時 = 最大傷害 × (250% + 加成)。期望值 = 沒暴擊 + (暴擊 − 沒暴擊) × 暴擊率。",
    talentExtra: "才能技能：(1 + 武器額外) × (1 + 通用額外 + 才能額外)，武器額外獨立乘算（2026-10-25 實測，和物理公式一致）。",
    arcaneExtra: "秘法技能：才能部分先 × (1 + 才能額外) × 武器詞條，整體再 × (1 + 武器額外) × (1 + 通用額外 + 秘法額外)。秘法部分沒有平均加成。",
    independent: "優質戰鬥服務 1%、感應藥水 3%、其他獨立加成，各自獨立相乘。",
    totalOutput: "總輸出 = Σ（每個技能單次傷害期望值 × 使用次數），在「技能使用次數」分頁設定。",
};
</script>

<template>
    <div class="alchemy-calc">
        <h1 class="page-title">
            <span class="text-gradient">鍊金術傷害計算器</span>
            <span class="page-subtitle">鍊金傷害 → 精通細工 → 暴擊增傷 → 技能設定 → 技能傷害拆解</span>
        </h1>

        <div class="sim-layout">
            <!-- ════════ 左側 — 設定 ════════ -->
            <div class="form-panel">
                <el-card class="preset-card">
                    <div
                        class="preset-head"
                        :class="{ open: showPresetPanel }"
                        role="button"
                        tabindex="0"
                        :aria-expanded="showPresetPanel"
                        @click="showPresetPanel = !showPresetPanel"
                        @keyup.enter="showPresetPanel = !showPresetPanel"
                    >
                        <span class="preset-head-title">💾 儲存 / 讀取</span>
                        <span class="preset-head-count">{{ presets.length }} 套</span>
                        <span v-if="loadedPreset" class="preset-loaded">目前讀取：{{ loadedPreset.name }}</span>
                        <span class="preset-head-chevron" :style="{ transform: showPresetPanel ? 'rotate(180deg)' : 'rotate(0deg)' }">▼</span>
                    </div>
                    <template v-if="showPresetPanel">
                        <div class="preset-save-row">
                            <el-input v-model="newPresetName" placeholder="配置名稱（留空自動命名）" size="small" clearable maxlength="40" @keyup.enter="savePreset" />
                            <el-button type="primary" size="small" @click="savePreset">儲存目前設定</el-button>
                        </div>
                        <div v-if="presets.length === 0" class="preset-empty">尚無儲存配置</div>
                        <div v-else class="preset-list">
                            <div v-for="(preset, idx) in presets" :key="preset.timestamp" class="preset-item" :class="{ 'preset-item-loaded': preset.timestamp === loadedPresetTimestamp }">
                                <el-input :model-value="preset.name" size="small" maxlength="40" class="preset-name-input" @change="(v: string) => renamePreset(idx, v)" />
                                <span class="preset-date">{{ fmtDate(preset.timestamp) }}</span>
                                <el-button size="small" plain @click="loadPreset(idx)">讀取</el-button>
                                <el-button size="small" type="danger" plain aria-label="刪除" @click="deletePreset(idx)">✕</el-button>
                            </div>
                        </div>
                    </template>
                </el-card>

                <div class="quick-actions">
                    <el-button size="small" plain @click="resetAll">重置設定</el-button>
                </div>

                <el-tabs v-model="activeTab" type="border-card" class="setting-tabs">
                    <!-- 鍊金傷害 -->
                    <el-tab-pane label="鍊金傷害" name="attack">
                        <div class="tab-body">
                            <div class="field-section-label">屬性鍊金傷害</div>
                            <div v-for="el in ELEMENTS" :key="el" class="field-row">
                                <label class="field-label">{{ ELEMENT_LABELS[el] }}屬性鍊金傷害</label>
                                <el-input-number v-model="settings.alchDamage[el]" :min="0" :max="99999" :precision="0" size="small" class="field-select" />
                            </div>
                            <div class="field-hint">請填角色資訊上的數值（不含寵物等臨時加成）。</div>
                            <div class="field-row">
                                <label class="field-label">臨時鍊金傷害</label>
                                <el-input-number v-model="settings.tempAlchDamage" :min="0" :max="9999" :precision="0" size="small" class="field-select" />
                            </div>
                            <div class="field-hint">寵物 buff 等角色資訊沒有顯示的四屬性鍊金傷害，四個屬性同時加。</div>
                            <div class="field-row">
                                <label class="field-label">屬性能量加成（每屬性）</label>
                                <el-input-number v-model="settings.energyBonus" :min="0" :max="999" :precision="0" size="small" class="field-select" aria-label="屬性能量加成（每屬性）" />
                            </div>
                            <div class="field-hint">能力值未到上限時，屬性能量累積到一定程度會提升四屬性（面板請填提升後的數值）。化學狂歡、召喚噩夢消耗能量後才計算傷害，會自動扣掉這個值；能力值已到上限填 0（2026-10-29 實測）。</div>

                            <div class="field-section-label">鍊金攻擊力 buff</div>
                            <div class="field-hint">開了以下 buff 時，上方面板請填「沒開這些 buff」的數值，避免重複計算。最終 = ((面板 − 常數) × 係數 + 常數) × (1 + 戰場序曲% × 係數) × (1 + 狀態支援% × 係數) × (1 + 力量團聚% × 係數)；係數平常 1，喝鍊金攻擊力藥水 1.2。</div>
                            <div class="field-row">
                                <label class="field-label">戰場的序曲（活潑版）%</label>
                                <el-input-number v-model="settings.attackBuff.battlefieldPercent" :min="0" :max="100" :step="0.01" :precision="2" size="small" class="field-select-sm" aria-label="戰場的序曲（活潑版）%" />
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackBuff.statusSupport" />
                                <span class="switch-label">狀態支援（+12%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackBuff.strengthGather" />
                                <span class="switch-label">力量團聚（+15%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackBuff.potion" />
                                <span class="switch-label">鍊金攻擊力增加藥水（係數 ×1.2）</span>
                            </div>
                            <div class="field-section-label">常數攻擊力（不吃係數與 buff%）</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackBuff.arcanePassive" />
                                <span class="switch-label">秘法被動（4 屬 +200）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.attackBuff.grandmaster" />
                                <span class="switch-label">鍊金術宗師（火 +20、水 +15、風 +30、土 +30）</span>
                            </div>
                            <div class="field-hint">精靈武器 4 屬 +30 跟著「暴擊與額外傷害」分頁的精靈武器勾選。</div>

                            <div class="field-section-label">精通區</div>
                            <div class="field-hint">精通區 = (1 + (精通效率 10% + 細工) ÷ 2) × 鋼瓶，細工實際生效為說明的一半。</div>
                            <div class="field-row">
                                <label class="field-label">鋼瓶</label>
                                <el-select v-model="settings.cylinderPercent" size="small" class="field-select-wide">
                                    <el-option v-for="o in CYLINDER_OPTIONS" :key="o.value" :value="o.value" :label="o.label" />
                                </el-select>
                            </div>
                            <div class="field-hint">鋼瓶獨立乘算，只有水炮、火焰噴射、高壓火爆（說明有「使用對應屬性的鋼瓶時增加 30%」）吃；四屬性 +30% 與一般鋼瓶已實測，其他未實測。</div>
                        </div>
                    </el-tab-pane>

                    <!-- 精通與細工 -->
                    <el-tab-pane label="精通與細工" name="reforge">
                        <div class="tab-body">
                            <div class="field-section-label">精通效率細工（加進精通區）</div>
                            <div v-for="el in ELEMENTS" :key="el" class="field-row">
                                <label class="field-label">精通{{ ELEMENT_LABELS[el] }}鍊金術 效率</label>
                                <el-input-number v-model="settings.masteryReforge[el]" :min="0" :max="MASTERY_REFORGE_MAX" :precision="0" size="small" class="field-select-sm" :aria-label="`精通${ELEMENT_LABELS[el]}鍊金術效率 等級`" />
                                <span class="switch-label">每級 +{{ fmtPct(MASTERY_REFORGE_STEP[el]) }}</span>
                            </div>

                            <div class="field-section-label">技能細工（鑑定）等級</div>
                            <div class="equip-table-wrap">
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>細工</th>
                                            <th>每級</th>
                                            <th>等級</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="f in REFORGE_FIELDS" :key="f.key">
                                            <td class="equip-slot-label">{{ f.label }}</td>
                                            <td>{{ f.perLevel }}</td>
                                            <td>
                                                <el-input-number v-model="settings.reforge[f.key]" :min="0" :max="f.max" :precision="0" size="small" class="equip-input" :aria-label="`${f.label} 等級`" />
                                                <span class="field-max">/ {{ f.max }}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="field-hint">身上其他道具給的鑑定等級（例如水炮鑑定 +3）也要加進來。火焰噴射段數：{{ fmtRatio(flamerHits(settings)) }}</div>

                            <div class="field-section-label">秘法遺物等級</div>
                            <div v-for="id in ARCANE_IDS" :key="id" class="field-row">
                                <label class="field-label">{{ ARCANE_LABELS[id] }}</label>
                                <el-input-number v-model="settings.relic[id]" :min="0" :max="RELIC_MAX_LEVEL" :precision="0" size="small" class="field-select-sm" />
                                <span class="switch-label">{{ RELIC_NOTES[id] }}</span>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 暴擊與額外傷害 -->
                    <el-tab-pane label="暴擊與額外傷害" name="critextra">
                        <div class="tab-body">
                            <div class="field-section-label">暴擊率</div>
                            <div class="field-row">
                                <label class="field-label">面板暴擊率 %</label>
                                <el-input-number v-model="settings.crit.panelRatePercent" :min="0" :max="100" :step="0.5" :precision="1" size="small" class="field-select-sm" />
                            </div>

                            <div class="field-section-label">暴擊傷害（基礎 250%）</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.critDamage.grade" />
                                <span class="switch-label">評價滿（+10%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.critDamage.spiritWeapon" />
                                <span class="switch-label">精靈武器（+15%）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">其他 %</label>
                                <el-input-number v-model="settings.critDamage.other" :min="0" :max="300" :precision="0" size="small" class="field-select-sm" />
                            </div>
                            <div class="field-hint">裝備 R 改、套裝、農場物、圖騰等暴擊傷害加總。暴擊傷害合計：{{ fmtRatio(calcResult.critDamagePercent) }}%</div>

                            <div class="field-section-label">額外傷害 %</div>
                            <div class="field-row">
                                <label class="field-label">武器額外傷害</label>
                                <el-input-number v-model="settings.extra.weapon" :min="0" :max="300" :step="0.1" :precision="1" size="small" class="field-select-sm" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">通用額外傷害</label>
                                <el-input-number v-model="settings.extra.general" :min="0" :max="300" :step="0.1" :precision="1" size="small" class="field-select-sm" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">才能額外傷害</label>
                                <el-input-number v-model="settings.extra.talent" :min="0" :max="300" :step="0.1" :precision="1" size="small" class="field-select-sm" />
                            </div>
                            <div class="field-row">
                                <label class="field-label">鍊金術才能傷害（武器詞條）</label>
                                <el-input-number v-model="settings.extra.talentSkill" :min="0" :max="100" :step="0.01" :precision="2" size="small" class="field-select-sm" aria-label="鍊金術才能傷害（武器詞條）%" />
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.spiritWeakness" />
                                <span class="switch-label">精靈武器 弱點分析 5 等（目標有出血／暈眩／防保減少時，才能額外 +10%）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">秘法額外傷害</label>
                                <el-input-number v-model="settings.extra.arcane" :min="0" :max="300" :step="0.1" :precision="1" size="small" class="field-select-sm" />
                            </div>
                            <div class="field-hint">(1 + 武器額外) × (1 + 通用額外 + 才能額外／秘法額外)；才能額外只算才能技能與秘法借用的才能部分；秘法額外只算秘法技能。優質戰鬥服務在下方獨立加成；活動道具 1% 有效，填在下方獨立加成的「其他 %」。藍月亮（拉狄卡的氣息）、弱點分析等「才能技能傷害」和通用額外相加；武器詞條「鍊金術才能傷害」另外獨立乘算，秘法技能只乘才能部分（2026-10-27～29 實測）。</div>

                            <div class="field-section-label">獨立加成（各自獨立相乘）</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.independent.battleService" />
                                <span class="switch-label">優質戰鬥服務（+1%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.independent.sensePotion" />
                                <span class="switch-label">名匠的感應藥水（+3%）</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">其他 %</label>
                                <el-input-number v-model="settings.independent.otherPercent" :min="0" :max="100" :step="0.5" :precision="1" size="small" class="field-select-sm" />
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 技能設定 -->
                    <el-tab-pane label="技能設定" name="skill">
                        <div class="tab-body">
                            <div class="field-section-label">才能技能</div>
                            <div class="field-row">
                                <label class="field-label">火焰噴射集氣</label>
                                <el-input-number v-model="settings.flamerCharge" :min="1" :max="5" :precision="0" size="small" class="field-select-sm" />
                                <span class="switch-label">召喚噩夢固定用 5 集氣</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">召喚噩夢消耗能量</label>
                                <el-radio-group v-model="settings.nightmareEnergy" size="small">
                                    <el-radio-button v-for="(r, i) in NIGHTMARE_RATIOS" :key="i" :value="i">{{ i }} 個（{{ fmtPct(r) }}）</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="field-row">
                                <label class="field-label">化學狂歡消耗能量</label>
                                <el-radio-group v-model="settings.chemicalEnergy" size="small">
                                    <el-radio-button v-for="n in [0, 1, 2, 3, 4]" :key="n" :value="n">{{ n }} 個（後續 {{ n + 1 }} 段）</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="field-hint">化學狂歡後續爆炸每段 = (高壓火爆部分 + 平均 × 900% × {{ fmtPct(CHEMICAL_FOLLOW_UP_AVG_RATIO) }} × 遺物) × 元素組合，段數 = 能量 + 1，每次施放各段同值（2026-10-29 實測）。</div>
                            <div class="field-row">
                                <label class="field-label">武器 高壓火爆傷害 %</label>
                                <el-input-number v-model="settings.heatBusterWeaponPercent" :min="0" :max="1000" :precision="0" size="small" class="field-select-sm" />
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.elementWave" />
                                <span class="switch-label">元素波動（高壓火爆 +25%；化學狂歡不吃）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.rain" />
                                <span class="switch-label">造雨（水炮 +20%，細工每級 +5%；地裂螺旋的水炮部分也吃）</span>
                            </div>

                            <div class="field-section-label">套裝效果</div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.sets.waterCannon" />
                                <span class="switch-label">水炮強化（克雷西達套，水炮 +15%）</span>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="settings.sets.flamer" />
                                <span class="switch-label">火焰噴射強化（克雷西達套，火焰噴射 +15%）</span>
                            </div>

                            <template v-for="id in ARCANE_IDS" :key="id">
                                <div class="field-section-label">元素組合：{{ ARCANE_LABELS[id] }}（{{ ELEMENT_LABELS[COMBO_META[id].element] }}，每個結晶 +{{ fmtPct(COMBO_META[id].perCrystal) }}）</div>
                                <div class="field-row">
                                    <label class="field-label">{{ ELEMENT_LABELS[COMBO_META[id].element] }}結晶數</label>
                                    <el-input-number v-model="settings.combo[id].crystals" :min="0" :max="COMBO_MAX_CRYSTALS" :precision="0" size="small" class="field-select-sm" />
                                    <span class="switch-label">{{ COMBO_META[id].effect }}</span>
                                </div>
                                <div class="field-row">
                                    <el-checkbox v-model="settings.combo[id].elementHerb" />
                                    <span class="switch-label">屬性藥草（+10%）</span>
                                    <el-checkbox v-model="settings.combo[id].mandrake" />
                                    <span class="switch-label">曼德拉草（+5%）</span>
                                </div>
                                <div class="field-row">
                                    <label class="field-label">Ogham 效果 %</label>
                                    <el-input-number v-model="settings.combo[id].oghamPercent" :min="0" :max="COMBO_OGHAM_MAX" :step="0.2" :precision="1" size="small" class="field-select-sm" />
                                    <span class="switch-label">（{{ ELEMENT_LABELS[COMBO_META[id].element] }}鍊金術效果）最終傷害倍率增加，最多 5 條 × 0.2%</span>
                                </div>
                            </template>
                            <div class="field-hint">元素組合 = 1 + 結晶效果 × (1 + 藥草 + 效率)，效率 = 10% + 精通效率細工（遊戲畫面只顯示結晶效果）。化學狂歡的第一次與後續爆炸都吃火效果。</div>
                        </div>
                    </el-tab-pane>

                    <!-- 破防 -->
                    <el-tab-pane label="破防" name="armorbreak">
                        <div class="tab-body">
                            <div class="field-row">
                                <el-checkbox v-model="settings.armorBreak.enabled" />
                                <span class="switch-label">
                                    套用破防結果到傷害計算（魔法側：保護減傷 {{ fmtPct(calcResult.armor.single) }}、所受傷害 +{{ fmtRatio(settings.armorBreak.damageTakenPercent) }}%、暴擊時通用額外傷害 +{{ fmtRatio(settings.armorBreak.critExtraPercent) }}%）
                                </span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">穿刺等級</label>
                                <el-input-number v-model="settings.pierceLevel" :min="0" :max="11" :precision="0" size="small" class="field-select-sm" />
                                <span class="switch-label">每級 −5 魔法保護（扣除怪物穿刺抵抗）</span>
                            </div>
                            <div class="field-section-label">秘法技能借用的才能部分</div>
                            <el-radio-group v-model="settings.protectionMode" size="small">
                                <el-radio-button value="reference">參考（韓服計算器）</el-radio-button>
                                <el-radio-button value="twice">兩次保護減傷</el-radio-button>
                                <el-radio-button value="doublePierce">雙倍穿刺</el-radio-button>
                            </el-radio-group>
                            <div class="field-hint">
                                參考：才能部分 × 穿刺增益，整體再扣一次保護｜兩次保護減傷：才能部分先扣保護，整體再扣一次｜雙倍穿刺：才能部分用穿刺等級 ×2 扣一次保護（聖盾、魔法計算器）。尚未實測，木樁保護 0 時三者相同。
                            </div>
                        </div>
                        <div class="pb-embed">
                            <ProtectionBreakPanel single side="magic" storage-key="prot-break:alchemy" :pierce="settings.pierceLevel" @result="onArmorBreakResult" />
                        </div>
                    </el-tab-pane>

                    <!-- 技能使用次數 -->
                    <el-tab-pane label="技能使用次數" name="usage">
                        <div class="tab-body">
                            <div class="field-section-label">各技能使用次數（單次傷害為期望值）</div>
                            <div class="equip-table-wrap">
                                <table class="equip-table">
                                    <thead>
                                        <tr>
                                            <th>技能</th>
                                            <th>單次傷害</th>
                                            <th>使用次數</th>
                                            <th>小計</th>
                                            <th>占比</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="row in usageRows" :key="row.id">
                                            <td class="equip-slot-label">
                                                <img v-if="row.imageId" width="20" height="20" :src="getSkillIcon(row.imageId)" alt="" class="skill-icon-inline" />
                                                {{ row.label }}
                                            </td>
                                            <td>{{ fmtInt(row.damage) }}</td>
                                            <td>
                                                <el-input-number
                                                    v-model="settings.usage[row.id]"
                                                    :min="0"
                                                    :max="99999"
                                                    :precision="0"
                                                    :controls="false"
                                                    size="small"
                                                    class="equip-input"
                                                    :aria-label="`${row.label} 使用次數`"
                                                />
                                            </td>
                                            <td>{{ fmtInt(row.subtotal) }}</td>
                                            <td>{{ fmtRatio(row.share) }}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="field-hint">總輸出 ＝ Σ（單次傷害 × 使用次數）。</div>
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
                    <div class="result-group-label">
                        鍊金傷害
                        <el-popover trigger="click" :width="280" popper-class="detail-popover">
                            <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                            {{ RESULT_DETAILS.alchDamage }}
                        </el-popover>
                    </div>
                    <div v-for="el in ELEMENTS" :key="el" class="result-row">
                        <span class="result-label">{{ ELEMENT_LABELS[el] }}屬性</span>
                        <span class="result-value sub">{{ fmtInt(calcResult.alch[el]) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">4 屬性平均</span>
                        <span class="result-value">{{ fmtInt(calcResult.alch.average) }}</span>
                    </div>
                    <div class="result-group-label">
                        精通區
                        <el-popover trigger="click" :width="280" popper-class="detail-popover">
                            <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                            {{ RESULT_DETAILS.masteryZone }}
                        </el-popover>
                    </div>
                    <div v-for="el in ELEMENTS" :key="el" class="result-row">
                        <span class="result-label">{{ ELEMENT_LABELS[el] }}</span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.masteryZone[el]) }}</span>
                    </div>
                    <div class="result-group-label">暴擊</div>
                    <div class="result-row">
                        <span class="result-label">暴擊率</span>
                        <span class="result-value sub">{{ fmtRatio(calcResult.critRatePercent) }}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">暴擊傷害</span>
                        <span class="result-value sub">{{ fmtRatio(calcResult.critDamagePercent) }}%</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            暴擊期望值
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.crit }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.critMultiplier) }}</span>
                    </div>
                    <div class="result-group-label">增傷</div>
                    <div class="result-row">
                        <span class="result-label">
                            才能技能額外
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.talentExtra }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.talentExtra) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            秘法技能額外
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.arcaneExtra }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.arcaneExtra) }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">
                            獨立加成
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.independent }}
                            </el-popover>
                        </span>
                        <span class="result-value sub">{{ fmtMultiplier(calcResult.independent) }}</span>
                    </div>
                    <div class="result-group-label">總輸出（見「技能使用次數」分頁）</div>
                    <div class="result-row">
                        <span class="result-label">
                            總輸出
                            <el-popover trigger="click" :width="280" popper-class="detail-popover">
                                <template #reference><el-icon class="info-icon" aria-label="說明"><InfoFilled /></el-icon></template>
                                {{ RESULT_DETAILS.totalOutput }}
                            </el-popover>
                        </span>
                        <span class="result-value">{{ hasAnyUsage ? fmtInt(totalOutput) : "—" }}</span>
                    </div>
                </div>

                <div class="util-copyrights">公式來源：玩家實測（水炮、火焰噴射、高壓火爆、地裂螺旋、化學狂歡、召喚噩夢）＋韓服計算器對照，其餘照參考。大作（마그눔 오푸스）台服尚未實裝，暫不列出。</div>
            </div>
        </div>

        <!-- ════════ 技能傷害 ════════ -->
        <div class="skill-section">
            <div class="skill-section-header">
                <h2 class="skill-section-title">技能傷害（最大傷害）</h2>
                <el-radio-group v-model="critDisplayMode" size="small">
                    <el-radio-button value="noCrit">沒暴擊</el-radio-button>
                    <el-radio-button value="crit">暴擊</el-radio-button>
                    <el-radio-button value="expected">期望值</el-radio-button>
                </el-radio-group>
            </div>
            <div class="field-hint skill-section-hint">只影響這裡的卡片顯示；技能使用次數與總輸出固定用期望值計算。</div>
            <div class="skill-grid">
                <div v-for="skill in cardSkills" :key="skill.id" class="skill-card">
                    <div class="skill-card-header">
                        <span class="skill-name">
                            <img v-if="skill.imageId" width="24" height="24" :src="getSkillIcon(skill.imageId)" alt="" />
                            {{ skill.label }}
                        </span>
                        <span class="skill-damage">{{ fmtInt(skill.damage) }}</span>
                    </div>
                    <div class="skill-formula">{{ skill.formula }}</div>

                    <div v-if="skill.parts.length > 1" class="skill-terms">
                        <div v-for="p in skill.parts" :key="p.label" class="term-row">
                            <span class="term-label">{{ p.label }}</span>
                            <span class="term-value">{{ fmtInt(p.damage) }}</span>
                        </div>
                    </div>

                    <button type="button" class="detail-toggle" :aria-expanded="expandedSkillIds.includes(skill.id)" @click="toggleExpanded(skill.id)">
                        {{ expandedSkillIds.includes(skill.id) ? "▼" : "▶" }} 乘區拆解
                    </button>
                    <template v-if="expandedSkillIds.includes(skill.id)">
                        <div v-for="p in skill.parts" :key="p.label" class="skill-terms">
                            <div v-if="skill.parts.length > 1" class="part-label">{{ p.label }}</div>
                            <div v-for="f in p.factors" :key="f.label" class="factor-row">
                                <span class="term-label">
                                    {{ f.label }}
                                    <span v-if="f.note" class="factor-note">{{ f.note }}</span>
                                </span>
                                <span class="term-value">{{ f.int ? fmtInt(f.value) : fmtMultiplier(f.value) }}</span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.alchemy-calc {
    min-height: 100vh;
    padding: 1.5rem;
    box-sizing: border-box;
}
.page-title {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
}
.page-subtitle {
    font-size: 1rem;
    color: var(--color-text-muted, #6b7280);
    font-weight: 400;
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

/* ── 儲存 / 讀取 ── */
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
.setting-tabs :deep(.el-tabs__item) {
    padding: 0 10px;
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
.field-select-wide {
    width: 400px;
    max-width: 100%;
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
.field-max {
    margin-left: 0.3rem;
    font-size: 0.72rem;
    color: var(--color-text-disabled, #6b7280);
}

/* ── 小表格 ── */
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
.skill-icon-inline {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.3rem;
    border-radius: 4px;
}
.equip-input {
    width: 90px;
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
    display: flex;
    align-items: center;
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
.skill-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
    margin-bottom: 0.4rem;
}
.skill-section-title {
    font-size: 1.2rem;
    margin: 0;
    color: var(--color-text-primary, #f9fafb);
}
.skill-section-hint {
    margin-bottom: 0.75rem;
}
.skill-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
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
.skill-formula {
    font-size: 0.72rem;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-disabled, #6b7280);
    word-break: break-all;
}
.skill-terms {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
}
.term-row,
.factor-row {
    display: flex;
    justify-content: space-between;
    gap: 0.4rem;
    font-size: 0.78rem;
    color: var(--color-text-muted, #9ca3af);
}
.factor-note {
    display: block;
    font-size: 0.68rem;
    color: var(--color-text-disabled, #6b7280);
}
.term-value {
    text-align: right;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-secondary, #d1d5db);
    white-space: nowrap;
}
.part-label {
    margin-top: 0.3rem;
    font-size: 0.76rem;
    font-weight: 600;
    color: #7dd3fc;
}
.detail-toggle {
    align-self: flex-start;
    background: none;
    border: none;
    padding: 0.1rem 0;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--color-accent-hover, #fcd34d);
}
.detail-toggle:focus-visible {
    outline: 2px solid var(--color-accent-hover, #fcd34d);
    outline-offset: 2px;
}

/* 嵌入的破防面板：套用本頁的卡片／標題／表格樣式 */
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
