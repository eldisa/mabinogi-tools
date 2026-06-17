<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from "vue";
import { enchants } from "../data/enchants";
import { abilitiesMap } from "../data/abilities";
import { stoneAbilities } from "../data/stoneData";
import type { AbilityOption } from "../data/stoneData";
import titleJsonData from "../data/title.json";
import { obsoleteTitleIds, isTimedTitle, isRankingTitle } from "../utils/titleFilters";
import dollBagsData from "../data/doll_bags.json";
import { farmModel as farmModelData } from "../data/farmModel";

// ── Basic Settings ─────────────────────────────────────────
const arcana = ref("");
const weaponType = ref("");
const armorType = ref("");
const weaponPanel = ref<number | undefined>(undefined);

const ARCANA_OPTIONS = [
    { value: "elemental_knight", label: "元素騎士 (魔劍) — 裝備近距離才能武器 大傷+200" },
    { value: "soul_binder", label: "縛魂者 (黑魔) — 魔法攻擊+250" },
    { value: "arcane_ranger", label: "秘術遊俠 (弓鋼) — 裝備弓/弩 大傷+100" },
    { value: "bard_sacred", label: "聖詠者 — 魔法攻擊+200、音樂效果+3、音樂持續時間+180秒" },
    { value: "holy_guard", label: "聖盾守衛" },
    { value: "burst_lancer", label: "爆裂槍兵 — 裝備騎槍 大傷+200" },
    { value: "phantom_gunner", label: "幻變槍手 — 裝備雙槍 大傷+100、暴傷+5%" },
    { value: "forbidden_alchemist", label: "禁忌鍊金士 — 4屬鍊金+200" },
];

const ARMOR_TYPE_OPTIONS = [
    { value: "cloth", label: "布衣" },
    { value: "light", label: "輕盔甲" },
    { value: "heavy", label: "重盔甲" },
];

const WEAPON_TYPE_OPTIONS = [
    { value: "oh_sword", label: "單手劍", limits: ["單手武器"] },
    { value: "th_sword", label: "雙手劍", limits: ["雙手武器"] },
    { value: "oh_axe", label: "單手斧", limits: ["單手武器"] },
    { value: "th_axe", label: "雙手斧", limits: ["雙手武器"] },
    { value: "oh_blunt", label: "單手鈍器", limits: ["單手武器"] },
    { value: "th_blunt", label: "雙手鈍器", limits: ["雙手武器"] },
    { value: "bow", label: "弓", limits: ["弓", "弩"] },
    { value: "crossbow", label: "弩", limits: ["弓", "弩"] },
    { value: "lance", label: "騎槍", limits: ["騎槍"] },
    { value: "scythe", label: "大型鐮刀", limits: ["大型鐮刀"] },
    { value: "chainblade", label: "鎖鏈鐮刃", limits: ["鎖鏈鐮刃"] },
    { value: "shuriken", label: "手裡劍", limits: ["手裡劍"] },
    { value: "dualgun", label: "雙槍", limits: ["雙槍"] },
    { value: "knuckle", label: "拳套", limits: ["拳套"] },
    { value: "wand", label: "單手魔杖", limits: ["單手魔杖、集魔杖"] },
    { value: "staff", label: "集魔杖", limits: ["集魔杖", "魔杖", "單手魔杖、集魔杖"] },
    { value: "book", label: "魔導書", limits: ["魔導書、水晶球"] },
    { value: "orb", label: "水晶球", limits: ["魔導書、水晶球"] },
    { value: "cylinder", label: "鋼瓶", limits: ["鋼瓶"] },
    { value: "handle", label: "手把", limits: ["手把"] },
    { value: "instrument", label: "樂器", limits: ["樂器"] },
    // ── arcana-specific combos (no enchant limits needed here) ──
    { value: "giant_th_sword_sh", label: "盾+雙手劍", limits: ["雙手武器"] },
    { value: "dualwield_sword", label: "雙持單手劍", limits: ["單手武器"] },
    { value: "dualwield_blunt", label: "雙持單手鈍器", limits: ["單手武器"] },
];

// ── Stats Table ────────────────────────────────────────────
const baseUrl = import.meta.env.BASE_URL;

const STATS = [
    { key: "str",  label: "力量"   },
    { key: "dex",  label: "敏捷"   },
    { key: "int",  label: "智力"   },
    { key: "will", label: "意志"   },
    { key: "luk",  label: "幸運"   },
    { key: "hp",   label: "生命值" },
    { key: "mp",   label: "魔力值" },
    { key: "sp",   label: "耐力值" },
] as const;

type StatKey   = (typeof STATS)[number]["key"];

const STAT_SELF_MAX = 2650; // 版本上限，需版本更新時調整
const STAT_ECHO_MAX = 130;

// Self defaults: str/dex/int/will/luk = cap, hp/mp/sp = 5000
const HP_DEFAULT = 5000;
const statsTable = reactive(
    Object.fromEntries(STATS.map(s => [
        s.key,
        ["hp", "mp", "sp"].includes(s.key) ? HP_DEFAULT : STAT_SELF_MAX,
    ]))
) as Record<StatKey, number>;

// ── Echo Stones ─────────────────────────────────────────────
const ECHO_COLORS = [
    { value: "red",    label: "紅色", img: `${baseUrl}itemImage/53934.png`, stats: ["str"]            as StatKey[] },
    { value: "blue",   label: "藍色", img: `${baseUrl}itemImage/53935.png`, stats: ["int"]            as StatKey[] },
    { value: "yellow", label: "黃色", img: `${baseUrl}itemImage/53936.png`, stats: ["dex"]            as StatKey[] },
    { value: "white",  label: "白色", img: `${baseUrl}itemImage/53937.png`, stats: ["will"]           as StatKey[] },
    { value: "black",  label: "黑色", img: `${baseUrl}itemImage/53938.png`, stats: ["hp", "mp", "sp"] as StatKey[] },
];

// Which stats have an echo color (luk has none)
const statHasEcho = (k: StatKey) => ECHO_COLORS.some(c => (c.stats as string[]).includes(k));

const selectedEchoColors = ref<string[]>([]);

// Echo values are editable; checked color sets them to 130, unchecked clears to 0
const echoStats = reactive(
    Object.fromEntries(STATS.map(s => [s.key, 0]))
) as Record<StatKey, number>;

watch(selectedEchoColors, (newVal, oldVal) => {
    if (newVal.length > 3) { selectedEchoColors.value = newVal.slice(-3); return; }
    const added   = newVal.filter(c => !oldVal.includes(c));
    const removed = oldVal.filter(c => !newVal.includes(c));
    for (const color of added) {
        const ec = ECHO_COLORS.find(c => c.value === color);
        if (ec) for (const st of ec.stats) echoStats[st] = STAT_ECHO_MAX;
    }
    for (const color of removed) {
        const ec = ECHO_COLORS.find(c => c.value === color);
        if (ec) for (const st of ec.stats) echoStats[st] = 0;
    }
}, { deep: true });

const statTotal = (statKey: StatKey) =>
    (statsTable[statKey] ?? 0) + (echoStats[statKey] ?? 0);

// ── Enchant Selects ────────────────────────────────────────
const SLOT_LIMITS: Record<string, string[]> = {
    head: ["頭部裝備", "頭部"],
    body: ["重甲", "布衣", "輕甲", "衣物"],
    hands: ["手", "手部裝備"],
    feet: ["腳部裝備"],
    acc: ["飾品"],
    mooncake: ["穆利亞斯的遺物"],
};

const ENCHANT_SLOT_DEFS = [
    { key: "head", label: "頭部" },
    { key: "body", label: "身體" },
    { key: "hands", label: "手部" },
    { key: "feet", label: "腳部" },
    { key: "acc1", label: "飾品1" },
    { key: "acc2", label: "飾品2" },
    { key: "weapon", label: "武器" },
    { key: "mooncake1", label: "月餅1" },
    { key: "mooncake2", label: "月餅2" },
    { key: "mooncake3", label: "月餅3" },
];

// ── Enchant effect labels ───────────────────────────────────
const EFFECT_LABEL: Record<string, string> = {
    attack_max: "最大傷害",
    attack_min: "最小傷害",
    magic_attack: "魔法攻擊力",
    all_alchemy_damage: "4大屬性鍊金術傷害",
    marionette_attack_max: "人偶最大傷害",
    marionette_attack_min: "人偶最小傷害",
    marionette_hp: "人偶生命值",
    marionette_defense: "人偶防禦",
    marionette_protect: "人偶保護",
    balance: "平衡性",
    defense: "防禦",
    protection: "保護",
    magic_defense: "魔法防禦",
    magic_protection: "魔法保護",
    HP: "生命值",
    MP: "魔力值",
    SP: "耐力值",
    STR: "力量",
    INT: "智力",
    DEX: "敏捷",
    WIL: "意志",
    LUK: "幸運",
    lance_piercing: "銳利等級",
    attack_speed_set: "攻擊速度",
    music_buff_bonus: "音樂效果",
    manause_revised_set: "魔力使用量削減",
    critical_damage: "暴擊傷害",
    critical: "暴擊率",
};
const effectLabel = (id: string) => EFFECT_LABEL[id] ?? id.replace(/_/g, " ");

interface EnchantSelectState {
    id: string;
    values: Record<string, number>;
    otherLabel?: string;
    otherValue?: number;
}

const enchantSlots = reactive(
    Object.fromEntries(
        [...ENCHANT_SLOT_DEFS.map((s) => s.key), "offhand"].map((k) => [
            k,
            {
                prefix: { id: "", values: {} } as EnchantSelectState,
                suffix: { id: "", values: {} } as EnchantSelectState,
            },
        ]),
    ),
) as Record<string, { prefix: EnchantSelectState; suffix: EnchantSelectState }>;

// ── Enchant ability filter (auto, based on arcana) ─────────
const ENCHANT_OTHER = { value: "_other", label: "其他（自訂）" };

// Primary damage ability ID inferred from arcana
const arcanaAbilityFilter = computed(() => {
    switch (arcana.value) {
        case "soul_binder":
            return "magic_attack";
        case "forbidden_alchemist":
            return "all_alchemy_damage";
        case "bard_sacred":
            return "music_buff_bonus";
        case "elemental_knight":
        case "arcane_ranger":
        case "holy_guard":
        case "burst_lancer":
        case "phantom_gunner":
            return "attack_max";
        default:
            return "";
    }
});

// Enchant options: filtered by arcana ability, sorted by max value desc, top 5, label includes range
function filteredEnchantOptions(slotKey: string, type: "prefix" | "suffix") {
    const base = enchantOptionsCache.value[slotKey]?.[type] ?? [];
    const ab   = arcanaAbilityFilter.value;

    if (!ab) return [...base, ENCHANT_OTHER];

    const noVal   = base.filter(o => !o.value);
    const withVal = base
        .filter(o => !!o.value)
        .map(opt => ({
            opt,
            eff: enchants.find(e => String(e.id) === opt.value)?.effect.find(ef => ef.id === ab),
        }))
        .filter(x => x.eff)
        .sort((a, b) => b.eff!.max - a.eff!.max)
        .slice(0, 5)
        .map(({ opt, eff }) => {
            const range = eff!.min === eff!.max ? `${eff!.max}` : `${eff!.min}～${eff!.max}`;
            return { ...opt, label: `${opt.label}　${EFFECT_LABEL[ab] ?? ab} ${range}` };
        });

    return [...noVal, ...withVal, ENCHANT_OTHER];
}

function getRangedEffects(enchant: import("../types/Enchant").Enchant | undefined) {
    if (!enchant) return [];
    return enchant.effect.filter((e) => e.min !== e.max && e.min > 0);
}

function getEnchant(slotKey: string, type: "prefix" | "suffix") {
    const id = enchantSlots[slotKey]?.[type]?.id;
    if (!id || id === "_other") return undefined;
    return enchants.find((e) => String(e.id) === id);
}

function onEnchantChange(slotKey: string, type: "prefix" | "suffix") {
    const sel = enchantSlots[slotKey][type];
    if (sel.id === "_other") {
        sel.values = {};
        return;
    }
    const enchant = enchants.find((e) => String(e.id) === sel.id);
    const vals: Record<string, number> = {};
    if (enchant) {
        for (const eff of enchant.effect) {
            if (eff.min !== eff.max && eff.min > 0) vals[eff.id] = eff.max;
        }
    }
    sel.values = vals;
}

function effectValueOptions(min: number, max: number): number[] {
    const opts: number[] = [];
    for (let v = min; v <= max; v++) opts.push(v);
    return opts;
}

// ── 月餅技能強化 ────────────────────────────────────────────
const ARCANA_JOB_MAP: Record<string, string> = {
    elemental_knight:    "元素騎士",
    soul_binder:         "縛魂者",
    arcane_ranger:       "秘術遊俠",
    bard_sacred:         "聖詠者",
    holy_guard:          "聖盾守衛",
    burst_lancer:        "爆裂槍兵",
    phantom_gunner:      "幻變槍手",
    forbidden_alchemist: "禁忌煉金士",
};

const arcanaSkillOptions = computed(() => {
    const job = ARCANA_JOB_MAP[arcana.value] ?? "";
    return job ? stoneAbilities.filter(s => s.job === job) : [];
});

// Auto-assign one skill per mooncake slot (read-only)
const mooncakeSlotSkill = computed<Record<string, AbilityOption | undefined>>(() => ({
    mooncake1: arcanaSkillOptions.value[0],
    mooncake2: arcanaSkillOptions.value[1],
    mooncake3: arcanaSkillOptions.value[2],
}));

// Only track levels (0 = not embedded)
const mooncakeLevels = reactive({ mooncake1: 0, mooncake2: 0, mooncake3: 0 }) as Record<string, number>;

watch(arcana, () => {
    mooncakeLevels.mooncake1 = 0;
    mooncakeLevels.mooncake2 = 0;
    mooncakeLevels.mooncake3 = 0;
});

// ── 遺物 ────────────────────────────────────────────────────
const RELIC_OPTIONS = [
    { value: "", label: "無" },
    { value: "str_axe", label: "力量之斧（最大傷害 +18）" },
    { value: "int_cape", label: "智慧披風（魔法攻擊 +16）" },
];
const relicItem = ref("");

const armorBodyLimits = computed(() => {
    switch (armorType.value) {
        case "cloth":
            return ["布衣", "衣物"];
        case "light":
            return ["輕甲", "盔甲"];
        case "heavy":
            return ["重甲", "盔甲"];
        default:
            return ["重甲", "布衣", "輕甲", "衣物", "盔甲"];
    }
});

const offhandEnchantLimits = computed(() => {
    switch (offhand.value) {
        case "shield":
            return ["盾牌"];
        case "book":
            return ["魔導書、水晶球", "魔導書"];
        case "orb":
            return ["魔導書、水晶球", "水晶球"];
        case "cylinder_sh":
            return ["鋼瓶"];
        default:
            return [];
    }
});

const enchantOptionsCache = computed(() => {
    const weaponLimits = WEAPON_TYPE_OPTIONS.find((w) => w.value === weaponType.value)?.limits ?? [];

    const getOptions = (slotKey: string, type: "prefix" | "suffix") => {
        let limits: string[];
        if (slotKey === "weapon") {
            limits = weaponLimits;
        } else if (slotKey === "offhand") {
            limits = offhandEnchantLimits.value;
        } else if (slotKey === "acc1" || slotKey === "acc2") {
            limits = SLOT_LIMITS["acc"];
        } else if (slotKey === "body") {
            // Always show all armor sub-types so no valid enchant is missed
            limits = ["重甲", "布衣", "輕甲", "衣物"];
        } else if (slotKey.startsWith("mooncake")) {
            limits = SLOT_LIMITS["mooncake"];
        } else {
            limits = SLOT_LIMITS[slotKey] ?? [];
        }
        return [
            { value: "", label: "無" },
            ...enchants
                .filter((e) => e.type === type && e.limit.some((l) => limits.includes(l)))
                .map((e) => ({ value: String(e.id), label: e.name.tw })),
        ];
    };

    const allKeys = [...ENCHANT_SLOT_DEFS.map((s) => s.key), "offhand"];
    return Object.fromEntries(
        allKeys.map((k) => [k, { prefix: getOptions(k, "prefix"), suffix: getOptions(k, "suffix") }]),
    ) as Record<string, { prefix: { value: string; label: string }[]; suffix: { value: string; label: string }[] }>;
});

// ── Titles ─────────────────────────────────────────────────
const title1 = ref("");
const title2 = ref("");

// ── Title Parsing ───────────────────────────────────────────
// Extract a numeric value for a stat keyword from the EffectDescription text
function extractTitleStat(desc: string, keyword: string): number {
    // Remove negative (bracketed) effects
    const positive = desc.replace(/\[([^\]]*)\]/g, "");
    const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Patterns:
    //   1. keyword + 增加 + number           e.g. 最大傷害增加25
    //   2. keyword + number + [%] + 增加     e.g. 暴擊傷害 20% 增加 / 最大傷害 35 增加
    const m =
        positive.match(new RegExp(esc + "[值]?增加\\s*(\\d+)")) ??
        positive.match(new RegExp(esc + "[值]?\\s*(\\d+)\\s*[%]?\\s*增加"));
    return m ? Number(m[1]) : 0;
}

// Pre-parse all title effects once at module load
interface TitleData { id: string; name: string; effects: Record<string, number>; }

interface TitleData { id: string; name: string; type: number; effects: Record<string, number>; }


const TITLE_LIST: TitleData[] = (titleJsonData.data as any[])
    .filter(t => t.EffectDescription?.trim() && !isTimedTitle(t) && !isRankingTitle(t) && !obsoleteTitleIds.has(t.ID))
    .map(t => {
        const name = t.UniName !== "none" ? t.UniName :
                     t.MaleName !== "none" ? t.MaleName :
                     t.FemaleName !== "none" ? t.FemaleName : "";
        if (!name) return null;
        const desc = t.EffectDescription as string;
        return {
            id:   t.ID,
            name,
            type: Number(t.Type),
            effects: {
                attack_max:         extractTitleStat(desc, "最大傷害"),
                magic_attack:       extractTitleStat(desc, "魔法攻擊力"),
                all_alchemy_damage: extractTitleStat(desc, "鍊金術傷害"),
                critical_damage:    extractTitleStat(desc, "暴擊傷害"),
                bonus_damage:       extractTitleStat(desc, "額外傷害"),
            },
        };
    })
    .filter(Boolean) as TitleData[];

// Separate lists by type
const TITLE_LIST_TYPE1 = TITLE_LIST.filter(t => t.type === 1 || t.type === 3); // 一般稱號
const TITLE_LIST_TYPE7 = TITLE_LIST.filter(t => t.type === 7); // 二次稱號

// ── Title Filter & Weights ──────────────────────────────────
const titleFilterAbilities = ref<string[]>(["critical_damage", "bonus_damage", "dmg"]);

const titleWeights = reactive({ critical_damage: 6, bonus_damage: 20, dmg: 1 });

// Damage stat key for the current arcana
const titleDmgKey = computed(() => {
    if (arcana.value === "soul_binder" || arcana.value === "bard_sacred") return "magic_attack";
    if (arcana.value === "forbidden_alchemist") return "all_alchemy_damage";
    return "attack_max";
});
const titleDmgLabel = computed(() => {
    if (titleDmgKey.value === "all_alchemy_damage") return "4大屬性鍊金術傷害";
    if (titleDmgKey.value === "magic_attack") return "魔法攻擊力";
    return "最大傷害";
});

const TITLE_ABILITY_OPTIONS = computed(() => [
    { value: "critical_damage", label: "暴擊傷害" },
    { value: "bonus_damage",    label: "額外傷害" },
    { value: "dmg",             label: titleDmgLabel.value },
]);

function titleScore(title: TitleData): number {
    return titleFilterAbilities.value.reduce((s, ab) => {
        const key = ab === "dmg" ? titleDmgKey.value : ab;
        return s + (title.effects[key] ?? 0) * (titleWeights[ab as keyof typeof titleWeights] ?? 1);
    }, 0);
}

function buildTitleOptions(list: TitleData[]): { value: string; label: string }[] {
    const anyFilter = titleFilterAbilities.value.length > 0;
    const dmgKey    = titleDmgKey.value;

    const buildLabel = (t: TitleData): string => {
        if (!anyFilter) return t.name;
        const parts = titleFilterAbilities.value
            .map(ab => {
                const key = ab === "dmg" ? dmgKey : ab;
                const v   = t.effects[key];
                if (!v) return null;
                const lbl  = ab === "critical_damage" ? "暴擊傷害" : ab === "bonus_damage" ? "額外傷" : titleDmgLabel.value;
                const unit = (ab === "critical_damage" || ab === "bonus_damage") ? "%" : "";
                return `${lbl} ${v}${unit}`;
            })
            .filter(Boolean);
        return parts.length ? `${t.name} · ${parts.join(" / ")}` : t.name;
    };

    const scored = list
        .map(t => ({ t, score: anyFilter ? titleScore(t) : 0 }))
        .filter(x => !anyFilter || x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, anyFilter ? 10 : list.length);

    return [
        { value: "", label: "無" },
        ...scored.map(({ t }) => ({ value: t.id, label: buildLabel(t) })),
    ];
}

// Type 1: 一般稱號, Type 7: 二次稱號
const title1Options = computed(() => buildTitleOptions(TITLE_LIST_TYPE1));
const title2Options = computed(() => buildTitleOptions(TITLE_LIST_TYPE7));


// ── Doll Bags ──────────────────────────────────────────────
const dollBag1 = ref("");
const dollBag2 = ref("");
const dollBag3 = ref("");

const dollBagOptions = computed(() => [
    { value: "", label: "無" },
    ...(dollBagsData as any[]).map((d) => ({ value: String(d.id), label: d.name })),
]);

// ── Race ───────────────────────────────────────────────────
const race = ref("");
const RACE_OPTIONS = [
    { value: "human_paladin", label: "人類-光騎" },
    { value: "human_darkknight", label: "人類-黑騎" },
    { value: "elf", label: "精靈" },
    { value: "giant", label: "巨人" },
];

// ── Arcana weapon constraints ──────────────────────────────
// base = always available; giant/human = additional for that race; raceForbidden = blocked
const ARCANA_WEAPON_MAP: Record<
    string,
    {
        base: string[];
        giant?: string[];
        human?: string[];
        raceForbidden?: ("elf" | "giant" | "human")[];
    }
> = {
    arcane_ranger: { base: ["bow", "crossbow"], raceForbidden: ["giant"] },
    soul_binder: { base: ["wand", "staff"] },
    forbidden_alchemist: { base: ["cylinder"] },
    burst_lancer: { base: ["lance"], raceForbidden: ["elf"] },
    phantom_gunner: { base: ["dualgun"] },
    holy_guard: { base: ["oh_sword", "oh_axe", "oh_blunt"], giant: ["th_sword"] },
    elemental_knight: {
        base: ["oh_sword", "oh_axe", "oh_blunt", "th_sword", "th_axe", "th_blunt"],
        giant: ["giant_th_sword_sh", "dualwield_blunt"],
        human: ["dualwield_sword"],
    },
    bard_sacred: { base: ["instrument", "wand", "scythe"] },
};

// Helper: map detailed race value → constraint key
const raceBase = computed((): "human" | "elf" | "giant" | "" => {
    if (!race.value) return "";
    if (race.value === "giant") return "giant";
    if (race.value === "elf") return "elf";
    return "human";
});

// Is the current race forbidden from the selected arcana?
// 基本設定完整性
const basicSettingsComplete = computed(() =>
    !!arcana.value && !!race.value && !!weaponType.value && !!armorType.value
);

const missingBasicSettings = computed(() => {
    const missing: string[] = [];
    if (!arcana.value)     missing.push("秘法");
    if (!race.value)       missing.push("種族與變身");
    if (!weaponType.value) missing.push("武器類型");
    if (!armorType.value)  missing.push("防具類型");
    return missing;
});

const arcanaRaceInvalid = computed(() => {
    if (!arcana.value || !race.value) return false;
    const c = ARCANA_WEAPON_MAP[arcana.value];
    return !!c?.raceForbidden?.includes(raceBase.value as any);
});

// Race options filtered by arcana restrictions
const filteredRaceOptions = computed(() => {
    const forbidden = ARCANA_WEAPON_MAP[arcana.value]?.raceForbidden ?? [];
    if (!forbidden.length) return RACE_OPTIONS;
    return RACE_OPTIONS.filter(opt => {
        const base = opt.value === "giant" ? "giant" : opt.value === "elf" ? "elf" : "human";
        return !forbidden.includes(base as any);
    });
});

// Filtered weapon options
const filteredWeaponOptions = computed(() => {
    const c = arcana.value ? ARCANA_WEAPON_MAP[arcana.value] : null;
    if (!c || arcanaRaceInvalid.value) return WEAPON_TYPE_OPTIONS;
    const allowed = new Set(c.base);
    if (raceBase.value === "giant" && c.giant) c.giant.forEach((w) => allowed.add(w));
    if (raceBase.value === "human" && c.human) c.human.forEach((w) => allowed.add(w));
    const opts = WEAPON_TYPE_OPTIONS.filter((w) => allowed.has(w.value));
    // 元素騎士：雙持 / 盾+劍 排最前
    if (arcana.value === "elemental_knight") {
        const PRIORITY = ["dualwield_sword", "dualwield_blunt", "giant_th_sword_sh"];
        return [
            ...opts.filter(o => PRIORITY.includes(o.value)),
            ...opts.filter(o => !PRIORITY.includes(o.value)),
        ];
    }
    return opts;
});

// ── Offhand ────────────────────────────────────────────────
const offhand = ref("");

const canHaveOffhand = computed(() => {
    const w = weaponType.value;
    if (!w) return false;
    if (["oh_sword", "oh_axe", "oh_blunt", "wand"].includes(w)) return true;
    if (arcana.value === "bard_sacred" && w === "scythe") return true;
    if (arcana.value === "forbidden_alchemist" && w === "cylinder") return true;
    if (arcana.value === "burst_lancer" && w === "lance" && raceBase.value === "giant") return true;
    return false;
});

const filteredOffhandOptions = computed((): { value: string; label: string }[] => {
    if (!canHaveOffhand.value) return [];
    const w = weaponType.value;
    switch (arcana.value) {
        case "soul_binder":
            return w === "wand"
                ? [
                      { value: "", label: "無" },
                      { value: "book", label: "魔導書" },
                  ]
                : [{ value: "", label: "無" }];
        case "forbidden_alchemist":
            return [
                { value: "", label: "無" },
                { value: "cylinder_sh", label: "盾牌鋼瓶" },
            ];
        case "burst_lancer":
            return [
                { value: "", label: "無" },
                { value: "shield", label: "盾牌" },
            ];
        case "bard_sacred":
            if (w === "wand")
                return [
                    { value: "", label: "無" },
                    { value: "book", label: "魔導書" },
                ];
            if (w === "scythe")
                return [
                    { value: "", label: "無" },
                    { value: "orb", label: "水晶球" },
                ];
            return [{ value: "", label: "無" }];
        case "holy_guard":
        case "elemental_knight":
            if (["oh_sword", "oh_axe", "oh_blunt"].includes(w)) return [{ value: "shield", label: "盾牌" }];
            return [{ value: "", label: "無" }];
        default:
            return [
                { value: "", label: "無" },
                { value: "shield", label: "盾牌" },
                { value: "orb", label: "水晶球" },
                { value: "book", label: "魔導書" },
                { value: "scythe", label: "鐮刀" },
            ];
    }
});

// Auto-clear invalid weapon / offhand when arcana or race changes
// Also auto-select when only one option is available
watch([arcana, race], () => {
    // Clear race if it's now forbidden by the current arcana
    if (race.value && !filteredRaceOptions.value.some(o => o.value === race.value)) {
        race.value = "";
    }
    const valid = filteredWeaponOptions.value.map((w) => w.value);
    if (weaponType.value && !valid.includes(weaponType.value)) {
        weaponType.value = "";
        offhand.value = "";
    }
    // Auto-select weapon if only one option exists
    if (valid.length === 1) weaponType.value = valid[0];
});

// Auto-set armor type based on arcana
watch(arcana, (val) => {
    if (!val) return;
    if (val === "soul_binder") armorType.value = "cloth";
    else if (val === "holy_guard") armorType.value = "heavy";
    else armorType.value = "light";
});
watch([weaponType, arcana, race], () => {
    if (!canHaveOffhand.value) {
        offhand.value = "";
        return;
    }
    // Default: auto-select first non-empty offhand option
    const nonEmpty = filteredOffhandOptions.value.map((o) => o.value).filter((v) => v !== "");
    offhand.value = nonEmpty[0] ?? "";
});

// Equipment slots (includes offhand when equipped)
const equipmentSlots = computed(() => {
    const slots: { key: string; label: string }[] = [...ENCHANT_SLOT_DEFS];
    if (offhand.value) slots.push({ key: "offhand", label: "副手" });
    return slots;
});

// ── Farm Model ─────────────────────────────────────────────
const farmNormal  = reactive({ dmg: "", magicAtk: "", critDmg: "", extra: "", music: "" });
const farmSpecial = reactive({ dmg: "", magicAtk: "", critDmg: "", extra: "", music: "" });
// MAX 模型（額外欄位）的 input 值，當選了 "MAX:n" 時生效
const farmSpecialMaxInputs = reactive({ dmg: 0, magicAtk: 0, critDmg: 0, extra: 0, music: 0 });
const farmModelBarrier = ref(false);

function isMaxOpt(v: string) { return v.startsWith("MAX:"); }
function maxValOf(v: string) { return Number(v.slice(4)); }
function parseFarmVal(v: string, maxInput: number): number {
    if (!v) return 0;
    if (isMaxOpt(v)) return maxInput;
    return Number(v) || 0;
}

function buildFarmOpts(abilityId: string, isExtra: boolean) {
    const models = farmModelData
        .filter(m =>
            (isExtra ? m.category === "extra" : m.category !== "extra") &&
            m.abilities.some(a => a.id === abilityId)
        )
        .sort((a, b) => {
            const av = a.abilities.find(x => x.id === abilityId)?.value ?? 0;
            const bv = b.abilities.find(x => x.id === abilityId)?.value ?? 0;
            return bv - av;
        });
    return [
        { value: "", label: "無" },
        ...models.map(m => {
            const val = m.abilities.find(x => x.id === abilityId)!.value;
            const isMax = m.id.endsWith("-MAX");
            return {
                value: isMax ? `MAX:${val}` : String(val),
                label: isMax ? `${m.name.tw} (+0~${val})` : `${m.name.tw} (+${val})`,
            };
        }),
    ];
}

const FARM_ABILITIES = ["attack_max", "magic_attack", "critical_damage", "bonus_damage", "music_buff_bonus"] as const;
type FarmAbilityKey = typeof FARM_ABILITIES[number];

const FARM_NORMAL_OPTS = Object.fromEntries(
    FARM_ABILITIES.map(id => [id, buildFarmOpts(id, false)])
) as Record<FarmAbilityKey, { value: string; label: string }[]>;

const FARM_EXTRA_OPTS = Object.fromEntries(
    FARM_ABILITIES.map(id => [id, buildFarmOpts(id, true)])
) as Record<FarmAbilityKey, { value: string; label: string }[]>;

// 全部最頂：一般 + 額外各取最高選項，MAX 模型填最大值
const FARM_FIELD_ABILITY: Array<{ f: keyof typeof farmNormal; key: FarmAbilityKey }> = [
    { f: "dmg",      key: "attack_max" },
    { f: "magicAtk", key: "magic_attack" },
    { f: "critDmg",  key: "critical_damage" },
    { f: "extra",    key: "bonus_damage" },
    { f: "music",    key: "music_buff_bonus" },
];
function setAllFarmTop() {
    for (const { f, key } of FARM_FIELD_ABILITY) {
        const nTop = FARM_NORMAL_OPTS[key]?.[1];
        if (nTop) farmNormal[f] = nTop.value;
        const eTop = FARM_EXTRA_OPTS[key]?.[1];
        if (eTop) {
            farmSpecial[f] = eTop.value;
            if (isMaxOpt(eTop.value)) farmSpecialMaxInputs[f] = maxValOf(eTop.value);
        }
    }
}

// ── Coin Totem ─────────────────────────────────────────────
const normalTotem = ref(35);
const badgeType = ref("");
const talisman = ref(22);
const learnCoin = ref(20);
const brylethType = ref("");
const bryleth = reactive({ val1: 0, val2: 0, val3: 0 });

watch(brylethType, () => {
    bryleth.val1 = 0;
    bryleth.val2 = 0;
    bryleth.val3 = 0;
});

const BADGE_OPTIONS = [
    { value: "", label: "無" },
    { value: "phys_max", label: "25 物理最大傷害" },
    { value: "magic_crit", label: "25 魔法攻擊 + 5% 暴擊傷害" },
    { value: "crit_only", label: "5% 暴擊傷害" },
];

const BRYLETH_TYPE_OPTIONS = [
    { value: "", label: "請選擇" },
    { value: "physical", label: "物理" },
    { value: "magic", label: "魔法" },
    { value: "alchemy", label: "煉金" },
    { value: "support", label: "支援" },
];

interface BrylethField {
    label: string;
    min: number;
    max: number;
    step: number;
    key: "val1" | "val2" | "val3";
}

const brylethFields = computed<BrylethField[]>(() => {
    switch (brylethType.value) {
        case "physical":
            return [
                { label: "最大傷害", min: 1, max: 20, step: 1, key: "val1" },
                { label: "暴擊傷害 (%)", min: 1, max: 10, step: 1, key: "val2" },
                { label: "秘法技能傷害加成 (%)", min: 0.15, max: 3, step: 0.15, key: "val3" },
            ];
        case "magic":
            return [
                { label: "魔法攻擊力", min: 1, max: 20, step: 1, key: "val1" },
                { label: "暴擊傷害 (%)", min: 1, max: 10, step: 1, key: "val2" },
                { label: "秘法技能傷害加成 (%)", min: 0.15, max: 3, step: 0.15, key: "val3" },
            ];
        case "alchemy":
            return [
                { label: "4屬性煉金傷害", min: 1, max: 20, step: 1, key: "val1" },
                { label: "暴擊傷害 (%)", min: 1, max: 10, step: 1, key: "val2" },
                { label: "秘法技能傷害加成 (%)", min: 0.15, max: 3, step: 0.15, key: "val3" },
            ];
        case "support":
            return [
                { label: "戰場、活潑板攻擊提昇 (%)", min: 0.1, max: 1, step: 0.1, key: "val1" },
                { label: "音樂增益持續時間", min: 1, max: 20, step: 1, key: "val2" },
                { label: "治癒效果 (%)", min: 1, max: 20, step: 1, key: "val3" },
            ];
        default:
            return [];
    }
});

// ── Holy Water ─────────────────────────────────────────────
const isWeaponAlchemy = computed(() => ["cylinder", "handle"].includes(weaponType.value));
const isWeaponMagic = computed(() => ["wand", "staff", "book", "orb"].includes(weaponType.value));

interface HolyWaterStat {
    value: string;
    label: string;
    min: number;
    max: number;
    fixed?: boolean;
}

// Arcana-level damage type (takes priority over weapon type for defaultFillStat)
const arcanaIsAlchemy = computed(() => arcana.value === "forbidden_alchemist");
const arcanaIsMagic = computed(() => arcana.value === "soul_binder");

const holyWaterStatOptions = computed((): HolyWaterStat[] => {
    if (arcana.value === "bard_sacred") {
        return [
            { value: "", label: "無", min: 0, max: 0, fixed: true },
            { value: "music", label: "音樂效果", min: 1, max: 1, fixed: true },
            { value: "heal", label: "治療效果 (%)", min: 1, max: 10 },
        ];
    }
    // Determine damage stat: arcana first, then weapon type, then default physical
    const dmg: HolyWaterStat =
        arcanaIsAlchemy.value || isWeaponAlchemy.value
            ? { value: "alchDmg", label: "4大屬性鍊金術傷害", min: 1, max: 50 }
            : arcanaIsMagic.value || isWeaponMagic.value
              ? { value: "magicAtk", label: "魔法攻擊力", min: 1, max: 30 }
              : { value: "maxDmg", label: "最大傷害", min: 1, max: 30 };
    // Damage stat first so defaultFillStat matches the first select item
    return [
        { value: "", label: "無", min: 0, max: 0, fixed: true },
        dmg,
        { value: "critDmg", label: "暴擊傷害 (%)", min: 1, max: 4 },
    ];
});

const holyWaterSlots = reactive(
    Object.fromEntries([...ENCHANT_SLOT_DEFS.map((s) => s.key), "offhand"].map((k) => [k, { stat: "", value: 1 }])),
) as Record<string, { stat: string; value: number }>;

const hwStatInfo = (slotKey: string): HolyWaterStat | undefined =>
    holyWaterStatOptions.value.find((o) => o.value === holyWaterSlots[slotKey]?.stat);

// ── Holy water fill helpers ─────────────────────────────────
const hwFillStatOptions = computed(() => holyWaterStatOptions.value.filter((o) => o.value !== ""));

// Default fill stat = first non-empty item in holyWaterStatOptions
// (damage stat is now first, so this naturally picks the weapon/arcana-appropriate stat)
const defaultFillStat = computed(() => hwFillStatOptions.value[0]?.value ?? "");

const hwFillStat = ref(defaultFillStat.value);
const hwFillAll = ref(false);

function applyHwFill() {
    const opt = holyWaterStatOptions.value.find((o) => o.value === hwFillStat.value);
    if (!opt) return;
    for (const slot of equipmentSlots.value) {
        holyWaterSlots[slot.key].stat = opt.value;
        holyWaterSlots[slot.key].value = opt.max;
    }
}

function onHwFillAllChange(checked: boolean) {
    if (checked) applyHwFill();
    else
        for (const slot of equipmentSlots.value) {
            holyWaterSlots[slot.key].stat = "";
            holyWaterSlots[slot.key].value = 1;
        }
}

// Re-apply when fill stat changes while checkbox is on
watch(hwFillStat, () => {
    if (hwFillAll.value) applyHwFill();
});

watch([arcana, weaponType], () => {
    const valid = new Set(holyWaterStatOptions.value.map((o) => o.value));
    // Clear all invalid holy water selections (including offhand)
    for (const key of Object.keys(holyWaterSlots)) {
        if (!valid.has(holyWaterSlots[key].stat)) {
            holyWaterSlots[key].stat = "";
            holyWaterSlots[key].value = 1;
        }
    }
    // Reset checkbox and auto-select the weapon-appropriate fill stat
    hwFillAll.value = false;
    hwFillStat.value = defaultFillStat.value;
});

function setAllHolyWaterMax() {
    for (const key of Object.keys(holyWaterSlots)) {
        const info = holyWaterStatOptions.value.find((o) => o.value === holyWaterSlots[key].stat);
        if (info && !info.fixed) holyWaterSlots[key].value = info.max;
    }
}

// ── 頂裝快捷 ───────────────────────────────────────────────
// 遺物依秘法自動選擇
const relicForArcana = computed(() => {
    if (!arcana.value) return "";
    if (arcana.value === "soul_binder" || arcana.value === "bard_sacred") return "int_cape";
    if (arcana.value === "forbidden_alchemist") return "";
    return "str_axe"; // all physical arcanas
});

const enchantFillTop  = ref(false);
const mooncakeFillTop = ref(false);
const allFillTop      = ref(false);

function applyEnchantTop() {
    for (const slot of equipmentSlots.value) {
        for (const type of ["prefix", "suffix"] as const) {
            const opts = filteredEnchantOptions(slot.key, type);
            const best = opts.find(o => o.value && o.value !== "_other");
            if (best) {
                enchantSlots[slot.key][type].id = best.value;
                onEnchantChange(slot.key, type);
            }
        }
    }
}

function clearEnchantTop() {
    for (const slot of equipmentSlots.value) {
        for (const type of ["prefix", "suffix"] as const) {
            enchantSlots[slot.key][type].id     = "";
            enchantSlots[slot.key][type].values  = {};
        }
    }
}

function applyMooncakeTop() {
    for (const k of ["mooncake1", "mooncake2", "mooncake3"]) {
        if (mooncakeSlotSkill.value[k]) mooncakeLevels[k] = 10;
    }
}

function clearMooncakeTop() {
    mooncakeLevels.mooncake1 = 0;
    mooncakeLevels.mooncake2 = 0;
    mooncakeLevels.mooncake3 = 0;
}

function onEnchantFillTopChange(v: boolean) {
    if (v) applyEnchantTop(); else clearEnchantTop();
    if (!v) allFillTop.value = false;
}

function onMooncakeFillTopChange(v: boolean) {
    if (v) applyMooncakeTop(); else clearMooncakeTop();
    if (!v) allFillTop.value = false;
}

function onAllFillTopChange(v: boolean) {
    enchantFillTop.value  = v;
    mooncakeFillTop.value = v;
    hwFillAll.value       = v;
    if (v) {
        applyEnchantTop();
        applyMooncakeTop();
        applyHwFill();
        relicItem.value = relicForArcana.value;
    } else {
        clearEnchantTop();
        clearMooncakeTop();
        onHwFillAllChange(false);
        relicItem.value = "";
    }
}

watch(armorType, () => {
    const newLimits = armorBodyLimits.value;
    for (const type of ["prefix", "suffix"] as const) {
        const cur = enchantSlots.body[type].id;
        if (!cur) continue;
        const e = enchants.find((en) => String(en.id) === cur);
        if (e && !e.limit.some((l) => newLimits.includes(l))) {
            enchantSlots.body[type].id = "";
            enchantSlots.body[type].values = {};
        }
    }
});

// ── Set Effects ────────────────────────────────────────────
const setEffects = reactive({
    lightSet25: false,
    heavySet25: false,
    arcanumAlchemy50: false,
    arcanumGlove100: false,
});

// ── 總和計算 ────────────────────────────────────────────────

// Normalize effect IDs to canonical forms
const EFFECT_CANONICAL: Record<string, string> = {
    attack_max: "attack_max", AttMax: "attack_max", Attmax: "attack_max", wAttMax: "attack_max",
    attack_min: "attack_min", AttMin: "attack_min", wAttMin: "attack_min",
    magic_attack: "magic_attack", MagicAttack: "magic_attack",
    all_alchemy_damage: "all_alchemy_damage",
    balance: "balance",
    critical: "critical", Crit: "critical",
    critical_damage: "critical_damage",
    bonus_damage: "bonus_damage",
    defense: "defense", Def: "defense",
    protection: "protection", Prot: "protection", prot: "protection", protect: "protection",
    magic_defense: "magic_defense", magicdefence: "magic_defense",
    magic_protection: "magic_protection", magicprotect: "magic_protection",
    HP: "HP", LifeMax: "HP",
    MP: "MP", ManaMax: "MP",
    SP: "SP", StaminaMax: "SP",
    STR: "STR", STR2: "STR", Str: "STR",
    DEX: "DEX", Dex: "DEX", dex: "DEX",
    WIL: "WIL", Will: "WIL",
    LUK: "LUK", Luck: "LUK",
    INT: "INT", Int: "INT", int: "INT",
    music_buff_bonus: "music_buff_bonus", musicbuff_bonus: "music_buff_bonus",
    marionette_attack_max: "marionette_attack_max", marionette_damage_max: "marionette_attack_max",
    marionette_attack_min: "marionette_attack_min", marionette_damage_min: "marionette_attack_min",
    healing_skill: "healing_skill", HealingUp: "healing_skill",
};
const toCanon = (id: string) => EFFECT_CANONICAL[id] ?? id;

interface StatRow { key: string; label: string; unit: string; category: string; }
const STAT_ROWS: StatRow[] = [
    { key: "STR",                 label: "力量",              unit: "",  category: "基本能力值" },
    { key: "DEX",                 label: "敏捷",              unit: "",  category: "基本能力值" },
    { key: "INT",                 label: "智力",              unit: "",  category: "基本能力值" },
    { key: "WIL",                 label: "意志",              unit: "",  category: "基本能力值" },
    { key: "LUK",                 label: "幸運",              unit: "",  category: "基本能力值" },
    { key: "HP",                  label: "生命值",            unit: "",  category: "基本能力值" },
    { key: "MP",                  label: "魔力值",            unit: "",  category: "基本能力值" },
    { key: "SP",                  label: "耐力值",            unit: "",  category: "基本能力值" },
    { key: "attack_max",          label: "最大傷害",          unit: "",  category: "攻擊" },
    { key: "attack_min",          label: "最小傷害",          unit: "",  category: "攻擊" },
    { key: "magic_attack",        label: "魔法攻擊力",        unit: "",  category: "攻擊" },
    { key: "all_alchemy_damage",  label: "4大屬性鍊金術傷害", unit: "",  category: "攻擊" },
    { key: "balance",             label: "平衡性",            unit: "%", category: "攻擊" },
    { key: "critical",            label: "暴擊率",            unit: "%", category: "攻擊" },
    { key: "critical_damage",     label: "暴擊傷害",          unit: "%", category: "攻擊" },
    { key: "bonus_damage",        label: "額外傷害",          unit: "%", category: "攻擊" },
    { key: "defense",             label: "防禦",              unit: "",  category: "防禦" },
    { key: "protection",          label: "保護",              unit: "",  category: "防禦" },
    { key: "magic_defense",       label: "魔法防禦",          unit: "",  category: "防禦" },
    { key: "magic_protection",    label: "魔法保護",          unit: "",  category: "防禦" },
    { key: "marionette_attack_max", label: "人偶最大傷害",    unit: "",  category: "人偶" },
    { key: "marionette_attack_min", label: "人偶最小傷害",    unit: "",  category: "人偶" },
    { key: "music_buff_bonus",    label: "音樂效果",          unit: "",  category: "特殊" },
    { key: "healing_skill",       label: "治癒效果",          unit: "%", category: "特殊" },
];

const ARCANA_BONUSES_MAP: Record<string, [string, number][]> = {
    elemental_knight:    [["attack_max", 200]],
    soul_binder:         [["magic_attack", 250]],
    arcane_ranger:       [["attack_max", 100]],
    bard_sacred:         [["magic_attack", 200], ["music_buff_bonus", 3]],
    burst_lancer:        [["attack_max", 200]],
    phantom_gunner:      [["attack_max", 100], ["critical_damage", 5]],
    forbidden_alchemist: [["all_alchemy_damage", 200]],
};

const HW_TO_EFF: Record<string, string> = {
    maxDmg: "attack_max", magicAtk: "magic_attack",
    alchDmg: "all_alchemy_damage", critDmg: "critical_damage",
    heal: "healing_skill", music: "music_buff_bonus",
};

const BADGE_EFF: Record<string, [string, number][]> = {
    phys_max:   [["attack_max", 25]],
    magic_crit: [["magic_attack", 25], ["critical_damage", 5]],
    crit_only:  [["critical_damage", 5]],
};

const totalStats = computed(() => {
    const m = new Map<string, number>();
    const add = (id: string, v: number) => { const k = toCanon(id); m.set(k, (m.get(k) ?? 0) + v); };

    // 能力值
    add("STR", statTotal("str"));
    add("DEX", statTotal("dex"));
    add("INT", statTotal("int"));
    add("WIL", statTotal("will"));
    add("LUK", statTotal("luk"));

    // 秘法 bonuses
    for (const [k, v] of ARCANA_BONUSES_MAP[arcana.value] ?? []) add(k, v);

    // 賦予
    for (const slot of equipmentSlots.value) {
        for (const type of ["prefix", "suffix"] as const) {
            const sel = enchantSlots[slot.key]?.[type];
            if (!sel?.id || sel.id === "_other") continue;
            const enc = enchants.find(e => String(e.id) === sel.id);
            if (!enc) continue;
            for (const eff of enc.effect) {
                add(eff.id, sel.values[eff.id] !== undefined ? sel.values[eff.id] : eff.max);
            }
        }
    }

    // 聖水（跳過月餅）
    for (const [key, slot] of Object.entries(holyWaterSlots)) {
        if (key.startsWith("mooncake") || !slot.stat) continue;
        const effId = HW_TO_EFF[slot.stat];
        if (effId) add(effId, slot.value);
    }

    // 農場模型
    const farmDmgKey = arcanaIsAlchemy.value ? "all_alchemy_damage" :
        (arcanaIsMagic.value || arcana.value === "bard_sacred") ? "magic_attack" : "attack_max";
    // 一般（無 MAX 模型，直接取數值）
    if (farmNormal.dmg)      add(farmDmgKey,          Number(farmNormal.dmg));
    if (farmNormal.magicAtk) add("magic_attack",      Number(farmNormal.magicAtk));
    if (farmNormal.critDmg)  add("critical_damage",   Number(farmNormal.critDmg));
    if (farmNormal.extra)    add("bonus_damage",       Number(farmNormal.extra));
    if (farmNormal.music)    add("music_buff_bonus",   Number(farmNormal.music));
    // 額外（可能是 MAX 模型，需解析）
    const spDmg = parseFarmVal(farmSpecial.dmg,      farmSpecialMaxInputs.dmg);
    const spMag = parseFarmVal(farmSpecial.magicAtk,  farmSpecialMaxInputs.magicAtk);
    const spCrt = parseFarmVal(farmSpecial.critDmg,   farmSpecialMaxInputs.critDmg);
    const spExt = parseFarmVal(farmSpecial.extra,     farmSpecialMaxInputs.extra);
    const spMus = parseFarmVal(farmSpecial.music,     farmSpecialMaxInputs.music);
    if (spDmg) add(farmDmgKey,        spDmg);
    if (spMag) add("magic_attack",    spMag);
    if (spCrt) add("critical_damage", spCrt);
    if (spExt) add("bonus_damage",    spExt);
    if (spMus) add("music_buff_bonus", spMus);

    // 訓練所徽章
    for (const [k, v] of BADGE_EFF[badgeType.value] ?? []) add(k, v);

    // 套裝效果
    if (setEffects.lightSet25)       add("attack_max", 50);
    if (setEffects.heavySet25)       add("attack_max", 25);
    if (setEffects.arcanumAlchemy50) add("all_alchemy_damage", 50);
    if (setEffects.arcanumGlove100)  add("magic_attack", 100);

    // 遺物
    if (relicItem.value === "str_axe")  add("attack_max",   18);
    if (relicItem.value === "int_cape") add("magic_attack", 16);

    // 布里萊赫硬幣
    const BRYLETH_EFF: Record<string, string[]> = {
        physical: ["attack_max",         "critical_damage", "bonus_damage"],
        magic:    ["magic_attack",        "critical_damage", "bonus_damage"],
        alchemy:  ["all_alchemy_damage",  "critical_damage", "bonus_damage"],
    };
    const bk = BRYLETH_EFF[brylethType.value];
    if (bk) {
        if (bryleth.val1) add(bk[0], bryleth.val1);
        if (bryleth.val2) add(bk[1], bryleth.val2);
        if (bryleth.val3) add(bk[2], bryleth.val3);
    }

    return m;
});

// 轉為顯示用陣列，依 STAT_ROWS 排序，只顯示非零項目
const displayStats = computed(() => {
    const shown = new Set<string>();
    const rows: (StatRow & { value: number })[] = [];
    for (const row of STAT_ROWS) {
        const v = totalStats.value.get(row.key);
        if (v !== undefined && v !== 0) { rows.push({ ...row, value: v }); shown.add(row.key); }
    }
    // Unknown stats
    for (const [key, v] of totalStats.value) {
        if (v === 0 || shown.has(key)) continue;
        rows.push({ key, label: abilitiesMap[key] ?? key, unit: "", category: "其他", value: v });
    }
    return rows;
});

// Group by category for display
const displayStatsByCategory = computed(() => {
    const map = new Map<string, (StatRow & { value: number })[]>();
    for (const row of displayStats.value) {
        if (!map.has(row.category)) map.set(row.category, []);
        map.get(row.category)!.push(row);
    }
    return map;
});

const CATEGORY_ORDER = ["基本能力值", "攻擊", "防禦", "人偶", "特殊", "其他"];

// ── Save / Load ─────────────────────────────────────────────
const STORAGE_KEY = "gear_gap_presets_v1";

interface GearPreset {
    name: string;
    timestamp: number;
    data: Record<string, unknown>;
}

const presets        = ref<GearPreset[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
const newPresetName  = ref("");
const showPresetPanel = ref(false);

function persistPresets() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets.value));
}

// 若有存檔，頁面載入時自動讀取第一筆
onMounted(() => {
    if (presets.value.length > 0) loadPreset(0);
});

function snapshot(): Record<string, unknown> {
    return {
        arcana: arcana.value, weaponType: weaponType.value, armorType: armorType.value,
        race: race.value, offhand: offhand.value, weaponPanel: weaponPanel.value,
        statsTable:  JSON.parse(JSON.stringify(statsTable)),
        echoStats:   JSON.parse(JSON.stringify(echoStats)),
        selectedEchoColors: [...selectedEchoColors.value],
        enchantSlots: JSON.parse(JSON.stringify(enchantSlots)),
        holyWaterSlots: JSON.parse(JSON.stringify(holyWaterSlots)),
        hwFillStat: hwFillStat.value,
        title1: title1.value, title2: title2.value,
        dollBag1: dollBag1.value, dollBag2: dollBag2.value, dollBag3: dollBag3.value,
        farmNormal:  JSON.parse(JSON.stringify(farmNormal)),
        farmSpecial: JSON.parse(JSON.stringify(farmSpecial)),
        farmSpecialMaxInputs: JSON.parse(JSON.stringify(farmSpecialMaxInputs)),
        farmModelBarrier: farmModelBarrier.value,
        normalTotem: normalTotem.value, badgeType: badgeType.value,
        talisman: talisman.value, learnCoin: learnCoin.value,
        brylethType: brylethType.value, bryleth: JSON.parse(JSON.stringify(bryleth)),
        setEffects:  JSON.parse(JSON.stringify(setEffects)),
        relicItem:   relicItem.value,
        mooncakeLevels: JSON.parse(JSON.stringify(mooncakeLevels)),
        titleFilterAbilities: [...titleFilterAbilities.value],
        titleWeights: JSON.parse(JSON.stringify(titleWeights)),
    };
}

function savePreset() {
    const name = newPresetName.value.trim() || `套裝 ${presets.value.length + 1}`;
    presets.value.push({ name, timestamp: Date.now(), data: snapshot() });
    persistPresets();
    newPresetName.value = "";
}

function loadPreset(idx: number) {
    const d = presets.value[idx]?.data;
    if (!d) return;
    const s = (k: string, fallback: unknown) => d[k] ?? fallback;

    arcana.value       = s("arcana", "")      as string;
    weaponType.value   = s("weaponType", "")  as string;
    armorType.value    = s("armorType", "")   as string;
    race.value         = s("race", "")        as string;
    offhand.value      = s("offhand", "")     as string;
    weaponPanel.value  = s("weaponPanel", undefined) as number | undefined;

    Object.assign(statsTable,  d.statsTable  ?? {});
    Object.assign(echoStats,   d.echoStats   ?? {});
    selectedEchoColors.value = (d.selectedEchoColors as string[]) ?? [];

    for (const [key, val] of Object.entries((d.enchantSlots ?? {}) as Record<string, unknown>)) {
        if (enchantSlots[key] && typeof val === "object" && val !== null) {
            const v = val as { prefix?: unknown; suffix?: unknown };
            if (v.prefix) Object.assign(enchantSlots[key].prefix, v.prefix);
            if (v.suffix) Object.assign(enchantSlots[key].suffix, v.suffix);
        }
    }
    for (const [key, val] of Object.entries((d.holyWaterSlots ?? {}) as Record<string, unknown>)) {
        if (holyWaterSlots[key] && typeof val === "object" && val !== null)
            Object.assign(holyWaterSlots[key], val);
    }

    hwFillStat.value = s("hwFillStat", defaultFillStat.value) as string;
    title1.value     = s("title1", "")     as string;
    title2.value     = s("title2", "")     as string;
    dollBag1.value   = s("dollBag1", "")   as string;
    dollBag2.value   = s("dollBag2", "")   as string;
    dollBag3.value   = s("dollBag3", "")   as string;

    Object.assign(farmNormal,  d.farmNormal  ?? {});
    Object.assign(farmSpecial, d.farmSpecial ?? {});
    Object.assign(farmSpecialMaxInputs, d.farmSpecialMaxInputs ?? {});
    farmModelBarrier.value = s("farmModelBarrier", false) as boolean;
    normalTotem.value = s("normalTotem", 35)  as number;
    badgeType.value   = s("badgeType", "")    as string;
    talisman.value    = s("talisman", 22)     as number;
    learnCoin.value   = s("learnCoin", 20)    as number;
    brylethType.value = s("brylethType", "")  as string;
    Object.assign(bryleth,     d.bryleth     ?? {});
    Object.assign(setEffects,  d.setEffects  ?? {});
    relicItem.value   = s("relicItem", "")    as string;
    Object.assign(mooncakeLevels, d.mooncakeLevels ?? {});
    if ("titleFilterAbilities" in d) titleFilterAbilities.value = (d.titleFilterAbilities as string[]);
    if ("titleWeights" in d)        Object.assign(titleWeights, d.titleWeights);
}

function deletePreset(idx: number) {
    presets.value.splice(idx, 1);
    persistPresets();
}

function renamePreset(idx: number, name: string) {
    if (presets.value[idx]) { presets.value[idx].name = name; persistPresets(); }
}

function fmtDate(ts: number): string {
    return new Date(ts).toLocaleString("zh-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
}
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

            <!-- Tabs: one per section -->
            <!-- ── 儲存 / 讀取 ── -->
            <el-card class="mb-4 bg-gray-800 border border-gray-700 rounded-xl">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showPresetPanel ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showPresetPanel = !showPresetPanel"
                >
                    <span class="text-sm font-semibold text-gray-300">💾 儲存 / 讀取</span>
                    <span class="text-xs text-gray-600 ml-2">{{ presets.length }} 套</span>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showPresetPanel ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >▼</span>
                </div>

                <template v-if="showPresetPanel">
                    <!-- 新增 -->
                    <div class="flex gap-2 mb-3">
                        <el-input
                            v-model="newPresetName"
                            placeholder="套裝名稱（留空自動命名）"
                            size="small"
                            clearable
                            @keyup.enter="savePreset"
                        />
                        <el-button type="primary" size="small" @click="savePreset">儲存目前</el-button>
                    </div>

                    <!-- 列表 -->
                    <div v-if="presets.length === 0" class="text-xs text-gray-600 py-2">尚無儲存套裝</div>
                    <div v-else class="space-y-1.5">
                        <div
                            v-for="(preset, idx) in presets"
                            :key="idx"
                            class="flex items-center gap-2 bg-gray-900/50 rounded-lg px-3 py-1.5"
                        >
                            <el-input
                                :model-value="preset.name"
                                size="small"
                                style="flex:1; min-width:80px"
                                @change="(v: string) => renamePreset(idx, v)"
                            />
                            <span class="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
                                {{ fmtDate(preset.timestamp) }}
                            </span>
                            <el-button size="small" plain @click="loadPreset(idx)">讀取</el-button>
                            <el-button size="small" type="danger" plain @click="deletePreset(idx)">✕</el-button>
                        </div>
                    </div>
                </template>
            </el-card>

            <!-- 基本設定未完成提示 -->
            <Transition name="fade">
                <div
                    v-if="!basicSettingsComplete"
                    class="mb-3 flex items-center gap-2 rounded-lg border border-yellow-600/50 bg-yellow-900/20 px-4 py-2.5 text-sm"
                >
                    <span class="text-yellow-400 flex-shrink-0">⚠</span>
                    <span class="text-yellow-300">
                        請先在「基本設定」填寫完整後才能進行後續設定：
                        <span class="font-semibold">{{ missingBasicSettings.join('、') }}</span>
                    </span>
                </div>
            </Transition>

            <el-tabs type="border-card">
                <!-- ① 基本設定 -->
                <el-tab-pane label="基本設定">
                    <div class="pt-4 space-y-3">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">秘法</p>
                                <el-select v-model="arcana" placeholder="請選擇秘法" class="w-full" clearable>
                                    <el-option
                                        v-for="opt in ARCANA_OPTIONS"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">種族與變身</p>
                                <el-select v-model="race" placeholder="請選擇種族與變身" class="w-full" clearable>
                                    <el-option
                                        v-for="opt in filteredRaceOptions"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                            </div>
                        </div>
                        <div
                            v-if="arcanaRaceInvalid"
                            class="text-xs text-red-400 bg-red-900/25 border border-red-700/40 rounded px-3 py-2"
                        >
                            ⚠ 此秘法不適用於所選種族
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">武器類型</p>
                                <el-select
                                    v-model="weaponType"
                                    placeholder="請選擇武器類型"
                                    class="w-full"
                                    clearable
                                    :disabled="arcanaRaceInvalid"
                                >
                                    <el-option
                                        v-for="opt in filteredWeaponOptions"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                            </div>
                            <div v-if="canHaveOffhand">
                                <p class="text-xs text-gray-400 mb-1">副手</p>
                                <el-select v-model="offhand" placeholder="請選擇副手" class="w-full" clearable>
                                    <el-option
                                        v-for="opt in filteredOffhandOptions"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">防具類型</p>
                                <el-select v-model="armorType" placeholder="請選擇防具類型" class="w-full" clearable>
                                    <el-option
                                        v-for="opt in ARMOR_TYPE_OPTIONS"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
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
                <el-tab-pane label="能力值" :disabled="!basicSettingsComplete">
                    <div class="pt-3 pb-1 text-xs text-gray-500">
                        自身上限 {{ STAT_SELF_MAX.toLocaleString() }}
                    </div>
                    <div class="pt-1 overflow-x-auto">
                        <table class="w-full text-sm border-collapse">
                            <thead>
                                <tr>
                                    <th class="text-left text-gray-400 py-2 pr-3 whitespace-nowrap min-w-[52px]">能力值</th>
                                    <th class="text-center text-gray-400 py-2 px-1 whitespace-nowrap">自身</th>
                                    <th class="text-center text-sky-400 py-2 px-1 whitespace-nowrap">回音</th>
                                    <th class="text-center text-yellow-400 py-2 pl-2 whitespace-nowrap">合計</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stat in STATS" :key="stat.key" class="border-t border-gray-700">
                                    <td class="py-2 pr-3 text-gray-300 font-medium whitespace-nowrap">{{ stat.label }}</td>
                                    <td class="py-1 px-1">
                                        <el-input-number
                                            v-model="statsTable[stat.key]"
                                            :min="0"
                                            :max="['hp','mp','sp'].includes(stat.key) ? undefined : STAT_SELF_MAX"
                                            controls-position="right"
                                            size="small"
                                            class="stat-input"
                                        />
                                    </td>
                                    <td class="py-1 px-1">
                                        <span v-if="!statHasEcho(stat.key)" class="text-gray-700 text-sm px-3">—</span>
                                        <el-input-number
                                            v-else
                                            v-model="echoStats[stat.key]"
                                            :min="0"
                                            :max="STAT_ECHO_MAX"
                                            controls-position="right"
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

                    <!-- Echo stone selection -->
                    <div class="mt-4 pt-3 border-t border-gray-700">
                        <p class="text-xs text-gray-400 mb-2">
                            回音石（最多選 3 顆，各 +{{ STAT_ECHO_MAX }}）
                            <span class="text-gray-600 ml-1">已選 {{ selectedEchoColors.length }} / 3</span>
                        </p>
                        <div class="flex flex-wrap gap-3">
                            <label
                                v-for="ec in ECHO_COLORS"
                                :key="ec.value"
                                class="flex items-center gap-2 cursor-pointer select-none rounded-lg px-3 py-1.5 border transition-colors"
                                :class="selectedEchoColors.includes(ec.value)
                                    ? 'border-sky-500 bg-sky-900/30'
                                    : 'border-gray-700 bg-gray-800 hover:border-gray-500'"
                            >
                                <input
                                    type="checkbox"
                                    :value="ec.value"
                                    v-model="selectedEchoColors"
                                    :disabled="!selectedEchoColors.includes(ec.value) && selectedEchoColors.length >= 3"
                                    class="hidden"
                                />
                                <img :src="ec.img" class="w-6 h-6 flex-shrink-0" style="image-rendering:pixelated" />
                                <span class="text-sm text-gray-300">{{ ec.label }}</span>
                                <span class="text-xs text-gray-500">{{ ec.stats.map(s => STATS.find(st => st.key === s)?.label).join('/') }}</span>
                            </label>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ③ 裝備 -->
                <el-tab-pane label="裝備" :disabled="!basicSettingsComplete">
                    <div class="pt-4 space-y-2">
                        <!-- 快捷操作 -->
                        <div class="flex flex-wrap items-center gap-3 pb-3 border-b border-gray-700">
                            <el-checkbox v-model="hwFillAll" @change="onHwFillAllChange">聖水全填</el-checkbox>
                            <el-select v-model="hwFillStat" size="small" style="width: 160px">
                                <el-option
                                    v-for="opt in hwFillStatOptions"
                                    :key="opt.value"
                                    :value="opt.value"
                                    :label="opt.label"
                                />
                            </el-select>
                            <el-button size="small" plain @click="setAllHolyWaterMax">聖水數值都最高</el-button>
                            <el-divider direction="vertical" class="!mx-1" />
                            <el-button size="small" plain @click="onEnchantFillTopChange(!enchantFillTop)">賦予最頂</el-button>
                            <el-button size="small" plain @click="onMooncakeFillTopChange(!mooncakeFillTop)">月餅最頂</el-button>
                            <el-button size="small" type="primary" plain @click="onAllFillTopChange(!allFillTop)">全部最頂</el-button>
                        </div>

                        <!-- header row -->
                        <div class="grid grid-cols-[56px_1fr_1fr_1fr] gap-2 px-1">
                            <span></span>
                            <span class="text-xs text-gray-500 text-center">聖水</span>
                            <span class="text-xs text-gray-500 text-center">接頭</span>
                            <span class="text-xs text-gray-500 text-center">接尾</span>
                        </div>

                        <div
                            v-for="slot in equipmentSlots"
                            :key="slot.key"
                            class="grid grid-cols-[56px_1fr_1fr_1fr] items-start gap-2"
                        >
                            <span class="text-sm text-gray-300 whitespace-nowrap pt-1">{{ slot.label }}</span>

                            <!-- 月餅：技能強化 | 其他槽：聖水 2 層 select -->
                            <div class="flex flex-col gap-1 min-w-0">
                                <template v-if="slot.key.startsWith('mooncake')">
                                    <template v-if="mooncakeSlotSkill[slot.key]">
                                        <!-- 技能名稱（固定，不可更動）+ 等級 同一 row -->
                                        <div class="flex items-center gap-1 min-w-0">
                                            <span class="text-xs text-gray-300 truncate flex-1">
                                                {{ mooncakeSlotSkill[slot.key]?.skillLocalName }}
                                            </span>
                                            <span class="text-xs text-gray-500 flex-shrink-0">Lv.</span>
                                            <el-select
                                                v-model="mooncakeLevels[slot.key]"
                                                size="small"
                                                style="width:60px"
                                            >
                                                <el-option v-for="lv in 11" :key="lv - 1" :value="lv - 1" :label="String(lv - 1)" />
                                            </el-select>
                                        </div>
                                    </template>
                                    <span v-else class="text-xs text-gray-600">（未選秘法）</span>
                                </template>
                                <template v-else>
                                    <div class="flex gap-1 items-center">
                                        <el-select
                                            v-model="holyWaterSlots[slot.key].stat"
                                            size="small"
                                            class="hw-stat-sel"
                                            placeholder="無"
                                        >
                                            <el-option
                                                v-for="opt in holyWaterStatOptions"
                                                :key="opt.value"
                                                :value="opt.value"
                                                :label="opt.label"
                                            />
                                        </el-select>
                                        <el-select
                                            v-if="hwStatInfo(slot.key) && !hwStatInfo(slot.key)!.fixed"
                                            v-model="holyWaterSlots[slot.key].value"
                                            size="small"
                                            class="hw-val-inp flex-shrink-0"
                                        >
                                            <el-option
                                                v-for="v in effectValueOptions(hwStatInfo(slot.key)!.min, hwStatInfo(slot.key)!.max)"
                                                :key="v" :value="v" :label="String(v)"
                                            />
                                        </el-select>
                                    </div>
                                </template>
                            </div>

                            <!-- 接頭：賦予 select（自動依秘法篩選能力） -->
                            <div class="flex flex-col gap-1">
                                <el-select
                                    v-model="enchantSlots[slot.key].prefix.id"
                                    placeholder="接頭"
                                    filterable
                                    clearable
                                    size="small"
                                    :disabled="
                                        (slot.key === 'weapon' && !weaponType) ||
                                        (slot.key === 'body' && !armorType) ||
                                        (slot.key.startsWith('mooncake') && mooncakeLevels[slot.key] === 0)
                                    "
                                    @change="onEnchantChange(slot.key, 'prefix')"
                                >
                                    <el-option
                                        v-for="opt in filteredEnchantOptions(slot.key, 'prefix')"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                                <!-- 其他：自訂輸入 -->
                                <template v-if="enchantSlots[slot.key].prefix.id === '_other'">
                                    <el-input
                                        v-model="enchantSlots[slot.key].prefix.otherLabel"
                                        placeholder="能力說明（選填）"
                                        size="small"
                                    />
                                    <el-input-number
                                        v-model="enchantSlots[slot.key].prefix.otherValue"
                                        placeholder="數值"
                                        size="small"
                                        controls-position="right"
                                        style="width: 100%"
                                    />
                                </template>
                                <!-- 已選賦予：浮動值 -->
                                <template v-if="getRangedEffects(getEnchant(slot.key, 'prefix')).length">
                                    <div
                                        v-for="eff in getRangedEffects(getEnchant(slot.key, 'prefix'))"
                                        :key="eff.id"
                                        class="flex items-center gap-1"
                                    >
                                        <span class="text-xs text-gray-500 flex-1 truncate">
                                            {{ effectLabel(eff.id) }}
                                        </span>
                                        <el-select
                                            v-model="enchantSlots[slot.key].prefix.values[eff.id]"
                                            size="small"
                                            style="width: 68px"
                                        >
                                            <el-option
                                                v-for="v in effectValueOptions(eff.min, eff.max)"
                                                :key="v"
                                                :value="v"
                                                :label="String(v)"
                                            />
                                        </el-select>
                                    </div>
                                </template>
                            </div>

                            <!-- 接尾：賦予 select（自動依秘法篩選能力） -->
                            <div class="flex flex-col gap-1">
                                <el-select
                                    v-model="enchantSlots[slot.key].suffix.id"
                                    placeholder="接尾"
                                    filterable
                                    clearable
                                    size="small"
                                    :disabled="
                                        (slot.key === 'weapon' && !weaponType) ||
                                        (slot.key === 'body' && !armorType) ||
                                        (slot.key.startsWith('mooncake') && mooncakeLevels[slot.key] === 0)
                                    "
                                    @change="onEnchantChange(slot.key, 'suffix')"
                                >
                                    <el-option
                                        v-for="opt in filteredEnchantOptions(slot.key, 'suffix')"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                                <template v-if="enchantSlots[slot.key].suffix.id === '_other'">
                                    <el-input
                                        v-model="enchantSlots[slot.key].suffix.otherLabel"
                                        placeholder="能力說明（選填）"
                                        size="small"
                                    />
                                    <el-input-number
                                        v-model="enchantSlots[slot.key].suffix.otherValue"
                                        placeholder="數值"
                                        size="small"
                                        controls-position="right"
                                        style="width: 100%"
                                    />
                                </template>
                                <template v-if="getRangedEffects(getEnchant(slot.key, 'suffix')).length">
                                    <div
                                        v-for="eff in getRangedEffects(getEnchant(slot.key, 'suffix'))"
                                        :key="eff.id"
                                        class="flex items-center gap-1"
                                    >
                                        <span class="text-xs text-gray-500 flex-1 truncate">
                                            {{ effectLabel(eff.id) }}
                                        </span>
                                        <el-select
                                            v-model="enchantSlots[slot.key].suffix.values[eff.id]"
                                            size="small"
                                            style="width: 68px"
                                        >
                                            <el-option
                                                v-for="v in effectValueOptions(eff.min, eff.max)"
                                                :key="v"
                                                :value="v"
                                                :label="String(v)"
                                            />
                                        </el-select>
                                    </div>
                                </template>
                            </div>
                        </div>

                        <!-- 遺物（無賦予，選擇加成項目）-->
                        <div
                            class="grid grid-cols-[56px_1fr_1fr_1fr] items-center gap-2 pt-2 border-t border-gray-700 mt-1"
                        >
                            <span class="text-sm text-gray-300 whitespace-nowrap">遺物</span>
                            <el-select v-model="relicItem" placeholder="無" clearable size="small">
                                <el-option
                                    v-for="opt in RELIC_OPTIONS"
                                    :key="opt.value"
                                    :value="opt.value"
                                    :label="opt.label"
                                />
                            </el-select>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ④ 稱號 -->
                <el-tab-pane label="稱號" :disabled="!basicSettingsComplete">
                    <div class="pt-4 space-y-4">

                        <!-- 篩選設定 -->
                        <div class="bg-gray-900/50 rounded-xl border border-gray-700 p-3 space-y-3">
                            <p class="text-xs text-gray-400 font-semibold">篩選 &amp; 排序條件（至少勾一個才會篩選）</p>

                            <!-- Checkboxes -->
                            <div class="flex flex-wrap gap-4">
                                <el-checkbox
                                    v-for="ab in TITLE_ABILITY_OPTIONS"
                                    :key="ab.value"
                                    v-model="titleFilterAbilities"
                                    :label="ab.value"
                                >{{ ab.label }}</el-checkbox>
                            </div>

                            <!-- Weight inputs（只顯示已勾選的） -->
                            <div v-if="titleFilterAbilities.length" class="flex flex-wrap gap-3 items-center">
                                <template v-for="ab in TITLE_ABILITY_OPTIONS" :key="ab.value">
                                    <div v-if="titleFilterAbilities.includes(ab.value)" class="flex items-center gap-1">
                                        <span class="text-xs text-gray-400">{{ ab.label }} 權重</span>
                                        <el-input-number
                                            v-model="titleWeights[ab.value as keyof typeof titleWeights]"
                                            :min="0.1" :max="100" :step="1" :precision="1"
                                            size="small" controls-position="right" style="width:100px"
                                        />
                                    </div>
                                </template>
                                <span class="text-xs text-gray-600">依 Σ(能力值×權重) 排序，最多顯示 10 項</span>
                            </div>
                        </div>

                        <!-- 稱號選擇 -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">第1稱號（一般稱號）</p>
                                <el-select v-model="title1" placeholder="請選擇" filterable clearable class="w-full">
                                    <el-option
                                        v-for="opt in title1Options"
                                        :key="opt.value" :label="opt.label" :value="opt.value"
                                    />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">第2稱號（二次稱號）</p>
                                <el-select v-model="title2" placeholder="請選擇" filterable clearable class="w-full">
                                    <el-option
                                        v-for="opt in title2Options"
                                        :key="opt.value" :label="opt.label" :value="opt.value"
                                    />
                                </el-select>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑤ 娃娃包 -->
                <el-tab-pane label="娃娃包" :disabled="!basicSettingsComplete">
                    <div class="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">娃娃包 1</p>
                            <el-select v-model="dollBag1" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option
                                    v-for="opt in dollBagOptions"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">娃娃包 2</p>
                            <el-select v-model="dollBag2" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option
                                    v-for="opt in dollBagOptions"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>
                        <div>
                            <p class="text-xs text-gray-400 mb-1">娃娃包 3</p>
                            <el-select v-model="dollBag3" placeholder="請選擇" filterable clearable class="w-full">
                                <el-option
                                    v-for="opt in dollBagOptions"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑥ 農場模型 -->
                <el-tab-pane label="農場模型" :disabled="!basicSettingsComplete">
                    <div class="pt-4 space-y-4">
                        <!-- 一般 -->
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">一般</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">最大傷害</p>
                                    <el-select v-model="farmNormal.dmg" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_NORMAL_OPTS.attack_max" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">魔法攻擊力</p>
                                    <el-select v-model="farmNormal.magicAtk" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_NORMAL_OPTS.magic_attack" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">暴擊傷害</p>
                                    <el-select v-model="farmNormal.critDmg" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_NORMAL_OPTS.critical_damage" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">額外傷害</p>
                                    <el-select v-model="farmNormal.extra" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_NORMAL_OPTS.bonus_damage" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">音樂效果</p>
                                    <el-select v-model="farmNormal.music" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_NORMAL_OPTS.music_buff_bonus" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                </div>
                            </div>
                        </div>

                        <div class="border-t border-gray-700" />

                        <!-- 額外 -->
                        <div>
                            <p class="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">額外</p>
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">最大傷害</p>
                                    <el-select v-model="farmSpecial.dmg" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_EXTRA_OPTS.attack_max" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                    <el-input-number v-if="isMaxOpt(farmSpecial.dmg)" v-model="farmSpecialMaxInputs.dmg"
                                        :min="0" :max="maxValOf(farmSpecial.dmg)" class="w-full mt-1" size="small" />
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">魔法攻擊力</p>
                                    <el-select v-model="farmSpecial.magicAtk" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_EXTRA_OPTS.magic_attack" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                    <el-input-number v-if="isMaxOpt(farmSpecial.magicAtk)" v-model="farmSpecialMaxInputs.magicAtk"
                                        :min="0" :max="maxValOf(farmSpecial.magicAtk)" class="w-full mt-1" size="small" />
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">暴擊傷害</p>
                                    <el-select v-model="farmSpecial.critDmg" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_EXTRA_OPTS.critical_damage" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                    <el-input-number v-if="isMaxOpt(farmSpecial.critDmg)" v-model="farmSpecialMaxInputs.critDmg"
                                        :min="0" :max="maxValOf(farmSpecial.critDmg)" class="w-full mt-1" size="small" />
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">額外傷害</p>
                                    <el-select v-model="farmSpecial.extra" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_EXTRA_OPTS.bonus_damage" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                    <el-input-number v-if="isMaxOpt(farmSpecial.extra)" v-model="farmSpecialMaxInputs.extra"
                                        :min="0" :max="maxValOf(farmSpecial.extra)" class="w-full mt-1" size="small" />
                                </div>
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">音樂效果</p>
                                    <el-select v-model="farmSpecial.music" placeholder="請選擇" clearable class="w-full">
                                        <el-option v-for="opt in FARM_EXTRA_OPTS.music_buff_bonus" :key="opt.label" :label="opt.label" :value="opt.value" />
                                    </el-select>
                                    <el-input-number v-if="isMaxOpt(farmSpecial.music)" v-model="farmSpecialMaxInputs.music"
                                        :min="0" :max="maxValOf(farmSpecial.music)" class="w-full mt-1" size="small" />
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-3 pt-1 border-t border-gray-700">
                            <el-checkbox v-model="farmModelBarrier" label="結界" />
                            <el-button size="small" @click="setAllFarmTop">全部最頂</el-button>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑦ 硬幣圖騰 -->
                <el-tab-pane label="硬幣圖騰" :disabled="!basicSettingsComplete">
                    <div class="pt-4 space-y-4">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <p class="text-xs text-gray-400 mb-1">一般圖騰</p>
                                <el-input-number
                                    v-model="normalTotem"
                                    :min="0"
                                    :max="35"
                                    :precision="0"
                                    controls-position="right"
                                    class="w-full"
                                />
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">訓練所徽章</p>
                                <el-select v-model="badgeType" placeholder="請選擇" clearable class="w-full">
                                    <el-option
                                        v-for="opt in BADGE_OPTIONS"
                                        :key="opt.value"
                                        :label="opt.label"
                                        :value="opt.value"
                                    />
                                </el-select>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">護身符</p>
                                <el-input-number
                                    v-model="talisman"
                                    :min="0"
                                    :max="22"
                                    :precision="0"
                                    controls-position="right"
                                    class="w-full"
                                />
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 mb-1">學會硬幣</p>
                                <el-input-number
                                    v-model="learnCoin"
                                    :min="0"
                                    :max="20"
                                    :precision="0"
                                    controls-position="right"
                                    class="w-full"
                                />
                            </div>
                        </div>

                        <div class="border-t border-gray-700 pt-4">
                            <p class="text-sm text-gray-300 mb-3">布里萊赫硬幣</p>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div>
                                    <p class="text-xs text-gray-400 mb-1">硬幣類型</p>
                                    <el-select v-model="brylethType" placeholder="選擇類型" class="w-full">
                                        <el-option
                                            v-for="opt in BRYLETH_TYPE_OPTIONS"
                                            :key="opt.value"
                                            :label="opt.label"
                                            :value="opt.value"
                                        />
                                    </el-select>
                                </div>
                                <template v-if="brylethFields.length">
                                    <div v-for="field in brylethFields" :key="field.key">
                                        <p class="text-xs text-gray-400 mb-1">{{ field.label }}</p>
                                        <el-input-number
                                            v-model="bryleth[field.key]"
                                            :min="field.min"
                                            :max="field.max"
                                            :step="field.step"
                                            :precision="field.step < 1 ? 2 : 0"
                                            controls-position="right"
                                            class="w-full"
                                        />
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>

                <!-- ⑧ 套裝效果 -->
                <el-tab-pane label="套裝效果" :disabled="!basicSettingsComplete">
                    <div class="pt-4 flex flex-wrap gap-x-6 gap-y-3">
                        <el-checkbox v-model="setEffects.lightSet25" label="輕靈套大傷 +50" />
                        <el-checkbox v-model="setEffects.heavySet25" label="重裝套大傷 +25" />
                        <el-checkbox v-model="setEffects.arcanumAlchemy50" label="秘術套鍊金強化 +50" />
                        <el-checkbox v-model="setEffects.arcanumGlove100" label="秘術套簽名手套魔法攻擊 +100" />
                    </div>
                </el-tab-pane>

                <!-- ⑨ 總和 -->
                <el-tab-pane label="總和" :disabled="!basicSettingsComplete">
                    <div class="pt-4">
                        <p class="text-xs text-gray-500 mb-4">整合所有欄位（能力值、秘法、賦予、聖水、農場、硬幣、套裝、遺物等），不含稱號與娃娃包</p>
                        <div v-if="displayStats.length === 0" class="text-gray-600 text-sm py-4">
                            尚未輸入任何資料
                        </div>
                        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <template v-for="cat in CATEGORY_ORDER" :key="cat">
                                <el-card
                                    v-if="displayStatsByCategory.get(cat)?.length"
                                    class="bg-gray-800 border border-gray-700 rounded-xl"
                                >
                                    <p class="text-xs text-gray-400 font-semibold mb-2 border-b border-gray-700 pb-1">
                                        {{ cat }}
                                    </p>
                                    <table class="w-full text-sm">
                                        <tbody>
                                            <tr
                                                v-for="row in displayStatsByCategory.get(cat)"
                                                :key="row.key"
                                                class="border-b border-gray-800/60 last:border-0"
                                            >
                                                <td class="py-1 text-gray-300">{{ row.label }}</td>
                                                <td
                                                    class="py-1 text-right font-bold tabular-nums"
                                                    :class="row.value < 0 ? 'text-red-400' : 'text-yellow-400'"
                                                >
                                                    {{ row.value > 0 ? '+' : '' }}{{ row.value }}{{ row.unit }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </el-card>
                            </template>
                        </div>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </div>
    </div>
</template>

<style scoped>
/* Stat input cells: narrow width, no extra padding */
.stat-input :deep(.el-input__wrapper) {
    padding: 0 4px;
}
.stat-input :deep(.el-input__inner) {
    text-align: center;
    min-width: 64px;
    max-width: 80px;
}

/* Holy water */
.hw-stat-sel {
    min-width: 110px;
    flex: 1;
}
.hw-val-inp {
    width: 78px;
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
