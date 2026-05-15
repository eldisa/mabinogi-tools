<script setup lang="ts">
import { ref, computed, reactive, watch } from "vue";
import { enchants } from "../data/enchants";
import titleJsonData from "../data/title.json";
import dollBagsData from "../data/doll_bags.json";

// ── Tabs ───────────────────────────────────────────────────
const outerTab = ref("physical");

// ── Basic Settings ─────────────────────────────────────────
const arcana = ref("");
const weaponType = ref("");
const weaponPanel = ref<number | undefined>(undefined);

const ARCANA_OPTIONS = [
    { value: "elemental_knight",  label: "元素騎士 (魔劍) — 裝備近距離才能武器 大傷+200" },
    { value: "soul_binder",       label: "縛魂者 (黑魔) — 魔法攻擊+250" },
    { value: "arcane_ranger",     label: "秘術遊俠 (弓鋼) — 裝備弓/弩 大傷+100" },
    { value: "bard_sacred",       label: "聖詠者 — 魔法攻擊+200、音樂效果+3、音樂持續時間+180秒" },
    { value: "holy_guard",        label: "聖盾守衛" },
    { value: "burst_lancer",      label: "爆裂槍兵 — 裝備騎槍 大傷+200" },
    { value: "phantom_gunner",    label: "幻變槍手 — 裝備雙槍 大傷+100、暴傷+5%" },
    { value: "forbidden_alchemist", label: "禁忌鍊金士 — 4屬鍊金+200" },
];

const WEAPON_TYPE_OPTIONS = [
    { value: "oh_sword",   label: "單手劍",   limits: ["單手武器"] },
    { value: "th_sword",   label: "雙手劍",   limits: ["雙手武器"] },
    { value: "oh_axe",     label: "單手斧",   limits: ["單手武器"] },
    { value: "th_axe",     label: "雙手斧",   limits: ["雙手武器"] },
    { value: "oh_blunt",   label: "單手鈍器", limits: ["單手武器"] },
    { value: "th_blunt",   label: "雙手鈍器", limits: ["雙手武器"] },
    { value: "bow",        label: "弓",       limits: ["弓", "弩"] },
    { value: "crossbow",   label: "弩",       limits: ["弓", "弩"] },
    { value: "lance",      label: "騎槍",     limits: ["騎槍"] },
    { value: "scythe",     label: "大型鐮刀", limits: ["大型鐮刀"] },
    { value: "chainblade", label: "鎖鏈鐮刃", limits: ["鎖鏈鐮刃"] },
    { value: "shuriken",   label: "手裡劍",   limits: ["手裡劍"] },
    { value: "dualgun",    label: "雙槍",     limits: ["雙槍"] },
    { value: "knuckle",    label: "拳套",     limits: ["拳套"] },
    { value: "wand",       label: "單手魔杖", limits: ["單手魔杖、集魔杖"] },
    { value: "staff",      label: "集魔杖",   limits: ["集魔杖", "魔杖", "單手魔杖、集魔杖"] },
    { value: "book",       label: "魔導書",   limits: ["魔導書、水晶球"] },
    { value: "orb",        label: "水晶球",   limits: ["魔導書、水晶球"] },
    { value: "cylinder",   label: "鋼瓶",     limits: ["鋼瓶"] },
    { value: "handle",     label: "手把",     limits: ["手把"] },
    { value: "instrument", label: "樂器",     limits: ["樂器"] },
];

// ── Stats Table ────────────────────────────────────────────
const STATS = [
    { key: "str",  label: "力量" },
    { key: "dex",  label: "敏捷" },
    { key: "int",  label: "智力" },
    { key: "will", label: "意志" },
    { key: "luk",  label: "幸運" },
] as const;

const SOURCES = [
    { key: "self", label: "自身" },
    { key: "echo", label: "回音" },
] as const;

type StatKey   = typeof STATS[number]["key"];
type SourceKey = typeof SOURCES[number]["key"];

const SOURCE_DEFAULTS: Record<string, number> = { self: 2650, echo: 130 };

const statsTable = reactive(
    Object.fromEntries(
        SOURCES.map(s => [s.key, Object.fromEntries(STATS.map(st => [st.key, SOURCE_DEFAULTS[s.key] ?? 0]))])
    ) as Record<SourceKey, Record<StatKey, number>>
);

const statTotal = (statKey: StatKey) =>
    SOURCES.reduce((sum, src) => sum + (statsTable[src.key][statKey] ?? 0), 0);

// ── Enchant Selects ────────────────────────────────────────
const SLOT_LIMITS: Record<string, string[]> = {
    head:  ["頭部裝備", "頭部"],
    body:  ["重甲", "布衣", "輕甲", "衣物"],
    hands: ["手", "手部裝備"],
    feet:  ["腳部裝備"],
    acc:   ["飾品"],
};

const ENCHANT_SLOT_DEFS = [
    { key: "head",   label: "頭部" },
    { key: "body",   label: "身體" },
    { key: "hands",  label: "手部" },
    { key: "feet",   label: "腳部" },
    { key: "acc1",   label: "飾品1" },
    { key: "acc2",   label: "飾品2" },
    { key: "weapon", label: "武器" },
];

const enchantSlots = reactive(
    Object.fromEntries(
        ENCHANT_SLOT_DEFS.map(s => [s.key, { prefix: "", suffix: "" }])
    ) as Record<string, { prefix: string; suffix: string }>
);

const enchantOptionsCache = computed(() => {
    const weaponLimits = WEAPON_TYPE_OPTIONS.find(w => w.value === weaponType.value)?.limits ?? [];

    const getOptions = (slotKey: string, type: "prefix" | "suffix") => {
        let limits: string[];
        if (slotKey === "weapon") {
            limits = weaponLimits;
        } else if (slotKey === "acc1" || slotKey === "acc2") {
            limits = SLOT_LIMITS["acc"];
        } else {
            limits = SLOT_LIMITS[slotKey] ?? [];
        }
        return [
            { value: "", label: "無" },
            ...enchants
                .filter(e => e.type === type && e.limit.some(l => limits.includes(l)))
                .map(e => ({ value: String(e.id), label: e.name.tw })),
        ];
    };

    return Object.fromEntries(
        ENCHANT_SLOT_DEFS.map(s => [
            s.key,
            { prefix: getOptions(s.key, "prefix"), suffix: getOptions(s.key, "suffix") },
        ])
    ) as Record<string, { prefix: { value: string; label: string }[]; suffix: { value: string; label: string }[] }>;
});

// ── Titles ─────────────────────────────────────────────────
const title1 = ref("");
const title2 = ref("");

const titleOptions = computed(() => {
    const items = (titleJsonData.data as any[])
        .filter(t => t.EffectDescription && t.EffectDescription.trim() !== "")
        .map(t => {
            const name =
                t.UniName   !== "none" ? t.UniName   :
                t.MaleName  !== "none" ? t.MaleName  :
                t.FemaleName !== "none" ? t.FemaleName : "";
            return name ? { value: t.ID, label: name } : null;
        })
        .filter(Boolean) as { value: string; label: string }[];
    return [{ value: "", label: "無" }, ...items];
});

// ── Doll Bags ──────────────────────────────────────────────
const dollBag1 = ref("");
const dollBag2 = ref("");
const dollBag3 = ref("");

const dollBagOptions = computed(() => [
    { value: "", label: "無" },
    ...(dollBagsData as any[]).map(d => ({ value: String(d.id), label: d.name })),
]);

// ── Farm Model ─────────────────────────────────────────────
const farmModelDmg     = ref("");
const farmModelCritDmg = ref("");
const farmModelExtra   = ref("");

const farmDmgLabel = computed(() => {
    if (outerTab.value === "magic")   return "魔法傷害";
    if (outerTab.value === "alchemy") return "鍊金術傷害";
    return "物理傷害";
});

const FARM_DMG_OPTIONS = [
    { value: "", label: "無" },
    ...Array.from({ length: 12 }, (_, i) => ({ value: String((i + 1) * 5), label: `+${(i + 1) * 5}` })),
];
const FARM_CRIT_OPTIONS = [
    { value: "", label: "無" },
    { value: "5",  label: "+5%"  },
    { value: "7",  label: "+7%"  },
    { value: "10", label: "+10%" },
];
const FARM_EXTRA_OPTIONS = [
    { value: "", label: "無" },
    { value: "3", label: "+3%" },
    { value: "5", label: "+5%" },
    { value: "7", label: "+7%" },
];

// ── Coin Totem ─────────────────────────────────────────────
const normalTotem = ref(35);
const badgeType   = ref("");
const talisman    = ref(22);
const learnCoin   = ref(20);
const brylethType = ref("");
const bryleth     = reactive({ val1: 0, val2: 0, val3: 0 });

watch(brylethType, () => { bryleth.val1 = 0; bryleth.val2 = 0; bryleth.val3 = 0; });

const BADGE_OPTIONS = [
    { value: "",            label: "無" },
    { value: "phys_max",    label: "25 物理最大傷害" },
    { value: "magic_crit",  label: "25 魔法攻擊 + 5% 暴擊傷害" },
    { value: "crit_only",   label: "5% 暴擊傷害" },
];

const BRYLETH_TYPE_OPTIONS = [
    { value: "",          label: "請選擇" },
    { value: "physical",  label: "物理" },
    { value: "magic",     label: "魔法" },
    { value: "alchemy",   label: "煉金" },
    { value: "support",   label: "支援" },
];

interface BrylethField { label: string; min: number; max: number; step: number; key: "val1" | "val2" | "val3" }

const brylethFields = computed<BrylethField[]>(() => {
    switch (brylethType.value) {
        case "physical":
            return [
                { label: "最大傷害",           min: 1, max: 20,  step: 1,    key: "val1" },
                { label: "暴擊傷害 (%)",        min: 1, max: 10,  step: 1,    key: "val2" },
                { label: "秘法技能傷害加成 (%)", min: 0.15, max: 3, step: 0.15, key: "val3" },
            ];
        case "magic":
            return [
                { label: "魔法攻擊力",          min: 1, max: 20,  step: 1,    key: "val1" },
                { label: "暴擊傷害 (%)",        min: 1, max: 10,  step: 1,    key: "val2" },
                { label: "秘法技能傷害加成 (%)", min: 0.15, max: 3, step: 0.15, key: "val3" },
            ];
        case "alchemy":
            return [
                { label: "4屬性煉金傷害",       min: 1, max: 20,  step: 1,    key: "val1" },
                { label: "暴擊傷害 (%)",        min: 1, max: 10,  step: 1,    key: "val2" },
                { label: "秘法技能傷害加成 (%)", min: 0.15, max: 3, step: 0.15, key: "val3" },
            ];
        case "support":
            return [
                { label: "戰場、活潑板攻擊提昇 (%)", min: 0.1, max: 1,  step: 0.1, key: "val1" },
                { label: "音樂增益持續時間",          min: 1,   max: 20, step: 1,   key: "val2" },
                { label: "治癒效果 (%)",              min: 1,   max: 20, step: 1,   key: "val3" },
            ];
        default:
            return [];
    }
});

// ── Set Effects ────────────────────────────────────────────
const setEffects = reactive({
    lightSet25:        false,
    heavySet25:        false,
    arcanumAlchemy50:  false,
    arcanumGlove100:   false,
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4">
        <div class="construction-notice">🚧 施工中，功能尚未完成</div>
        <div class="max-w-6xl mx-auto space-y-4">

            <!-- Header -->
            <header class="text-center pt-4 pb-2">
                <h1 class="text-4xl font-bold text-gradient mb-2">頂裝差距</h1>
                <p class="text-gray-400">確認自己離頂裝有多遠</p>
            </header>

            <!-- Outer Tabs: 物理 / 魔法 / 鍊金術 / 音樂 -->
            <el-tabs v-model="outerTab" class="outer-tabs">
                <el-tab-pane label="物理"   name="physical" />
                <el-tab-pane label="魔法"   name="magic" />
                <el-tab-pane label="鍊金術" name="alchemy" />
                <el-tab-pane label="音樂"   name="music" />
            </el-tabs>

            <!-- Inner Tabs: one per section -->
            <el-tabs class="inner-tabs">

                <!-- ① 基本設定 -->
                <el-tab-pane label="基本設定">
                    <div class="pt-4">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">秘法</p>
                                <el-select v-model="arcana" placeholder="請選擇秘法" class="w-full" clearable>
                                    <el-option v-for="opt in ARCANA_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">武器類型</p>
                                <el-select v-model="weaponType" placeholder="請選擇武器類型" class="w-full" clearable>
                                    <el-option v-for="opt in WEAPON_TYPE_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">武器面板</p>
                                <el-input-number
                                    v-model="weaponPanel"
                                    :min="0"
                                    :precision="0"
                                    placeholder="輸入武器面板數值"
                                    class="w-full"
                                    controls-position="right"
                                />
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ② 能力值 -->
                <el-tab-pane label="能力值">
                    <div class="pt-4 overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr>
                                    <th class="text-left text-gray-400 py-2 pr-3 whitespace-nowrap min-w-[52px]">能力值</th>
                                    <th
                                        v-for="src in SOURCES"
                                        :key="src.key"
                                        class="text-center text-gray-400 py-2 px-1 whitespace-nowrap"
                                    >{{ src.label }}</th>
                                    <th class="text-center text-yellow-400 py-2 pl-2 whitespace-nowrap">合計</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stat in STATS" :key="stat.key" class="border-t border-gray-700">
                                    <td class="py-2 pr-3 text-gray-300 font-medium whitespace-nowrap">{{ stat.label }}</td>
                                    <td v-for="src in SOURCES" :key="src.key" class="py-1 px-1">
                                        <el-input-number
                                            v-model="statsTable[src.key][stat.key]"
                                            :min="0"
                                            :max="src.key === 'echo' ? 130 : 2650"
                                            :controls="false"
                                            size="small"
                                            class="stat-input"
                                        />
                                    </td>
                                    <td class="py-2 pl-2 text-center text-yellow-400 font-bold whitespace-nowrap">
                                        {{ statTotal(stat.key) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </el-tab-pane>

                <!-- ③ 賦予 -->
                <el-tab-pane label="賦予">
                    <div class="pt-4 space-y-3">
                        <div
                            v-for="slot in ENCHANT_SLOT_DEFS"
                            :key="slot.key"
                            class="grid grid-cols-[80px_1fr_1fr] items-center gap-2"
                        >
                            <span class="text-sm text-gray-300">{{ slot.label }}</span>
                            <el-select
                                v-model="enchantSlots[slot.key].prefix"
                                placeholder="接頭"
                                filterable
                                clearable
                                size="small"
                                :disabled="slot.key === 'weapon' && !weaponType"
                            >
                                <el-option
                                    v-for="opt in enchantOptionsCache[slot.key]?.prefix ?? []"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                            <el-select
                                v-model="enchantSlots[slot.key].suffix"
                                placeholder="接尾"
                                filterable
                                clearable
                                size="small"
                                :disabled="slot.key === 'weapon' && !weaponType"
                            >
                                <el-option
                                    v-for="opt in enchantOptionsCache[slot.key]?.suffix ?? []"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ④ 稱號 -->
                <el-tab-pane label="稱號">
                    <div class="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">第1稱號</p>
                            <el-select v-model="title1" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option v-for="opt in titleOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">第2稱號</p>
                            <el-select v-model="title2" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option v-for="opt in titleOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑤ 娃娃包 -->
                <el-tab-pane label="娃娃包">
                    <div class="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">娃娃包 1</p>
                            <el-select v-model="dollBag1" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option v-for="opt in dollBagOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">娃娃包 2</p>
                            <el-select v-model="dollBag2" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option v-for="opt in dollBagOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">娃娃包 3</p>
                            <el-select v-model="dollBag3" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option v-for="opt in dollBagOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑥ 農場模型 -->
                <el-tab-pane label="農場模型">
                    <div class="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">{{ farmDmgLabel }}</p>
                            <el-select v-model="farmModelDmg" placeholder="請選擇" clearable class="w-full">
                                <el-option v-for="opt in FARM_DMG_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">暴擊傷害</p>
                            <el-select v-model="farmModelCritDmg" placeholder="請選擇" clearable class="w-full">
                                <el-option v-for="opt in FARM_CRIT_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">額外傷害</p>
                            <el-select v-model="farmModelExtra" placeholder="請選擇" clearable class="w-full">
                                <el-option v-for="opt in FARM_EXTRA_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                            </el-select>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑦ 硬幣圖騰 -->
                <el-tab-pane label="硬幣圖騰">
                    <div class="pt-4 space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">一般圖騰</p>
                                <el-input-number v-model="normalTotem" :min="0" :max="35" :precision="0" controls-position="right" class="w-full" />
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">訓練所徽章</p>
                                <el-select v-model="badgeType" placeholder="請選擇" clearable class="w-full">
                                    <el-option v-for="opt in BADGE_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">護身符</p>
                                <el-input-number v-model="talisman" :min="0" :max="22" :precision="0" controls-position="right" class="w-full" />
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">學會硬幣</p>
                                <el-input-number v-model="learnCoin" :min="0" :max="20" :precision="0" controls-position="right" class="w-full" />
                            </div>
                        </div>

                        <div class="border-t border-gray-700 pt-4">
                            <p class="text-sm text-gray-300 mb-3">布里萊赫硬幣</p>
                            <div class="flex flex-wrap gap-3 items-start">
                                <el-select v-model="brylethType" placeholder="選擇類型" class="w-32">
                                    <el-option v-for="opt in BRYLETH_TYPE_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
                                </el-select>
                                <template v-if="brylethFields.length">
                                    <div v-for="field in brylethFields" :key="field.key" class="flex flex-col gap-1">
                                        <p class="text-xs text-gray-400">{{ field.label }}</p>
                                        <el-input-number
                                            v-model="bryleth[field.key]"
                                            :min="field.min"
                                            :max="field.max"
                                            :step="field.step"
                                            :precision="field.step < 1 ? 2 : 0"
                                            controls-position="right"
                                            class="w-36"
                                        />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑧ 套裝效果 -->
                <el-tab-pane label="套裝效果">
                    <div class="pt-4 flex flex-wrap gap-x-6 gap-y-3">
                        <el-checkbox v-model="setEffects.lightSet25"       label="輕靈套大傷 +25" />
                        <el-checkbox v-model="setEffects.heavySet25"       label="重裝套大傷 +25" />
                        <el-checkbox v-model="setEffects.arcanumAlchemy50" label="秘術套鍊金強化 +50" />
                        <el-checkbox v-model="setEffects.arcanumGlove100"  label="秘術套簽名手套魔法攻擊 +100" />
                    </div>
                </el-tab-pane>

            </el-tabs>

        </div>
    </div>
</template>

<style scoped>
.outer-tabs :deep(.el-tabs__nav-wrap::after) {
    background-color: #374151;
}
.outer-tabs :deep(.el-tabs__item) {
    color: #9ca3af;
    font-size: 1rem;
    font-weight: 600;
}
.outer-tabs :deep(.el-tabs__item.is-active) {
    color: var(--color-accent, #f5c842);
}
.outer-tabs :deep(.el-tabs__active-bar) {
    background-color: var(--color-accent, #f5c842);
}

.inner-tabs :deep(.el-tabs__nav-wrap::after) {
    background-color: #374151;
}
.inner-tabs :deep(.el-tabs__item) {
    color: #9ca3af;
}
.inner-tabs :deep(.el-tabs__item.is-active) {
    color: #d1d5db;
}
.inner-tabs :deep(.el-tabs__active-bar) {
    background-color: #d1d5db;
}

/* Stat input cells: narrow width, no extra padding */
.stat-input :deep(.el-input__wrapper) {
    padding: 0 4px;
}
.stat-input :deep(.el-input__inner) {
    text-align: center;
    min-width: 64px;
    max-width: 80px;
}

.el-card :deep(.el-card__header) {
    padding: 10px 16px;
    border-bottom-color: #374151;
}
.el-card :deep(.el-card__body) {
    padding: 16px;
}

/* Dark select/input overrides already handled by global dark theme */

.construction-notice {
    max-width: 72rem;
    margin: 0 auto 1rem;
    padding: 0.6rem 1rem;
    background: #1c1917;
    border: 1px solid #78716c;
    border-radius: 8px;
    color: #fcd34d;
    font-size: 0.9rem;
}
</style>
