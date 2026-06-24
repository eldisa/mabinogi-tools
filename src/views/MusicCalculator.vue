<script setup lang="ts">
import { reactive, ref, computed, watch, nextTick, onMounted } from "vue";
import {
    type Option,
    battleSkillOptions,
    playSkillOptions,
    singSkillOptions,
    instrumentBaseOptions,
    instrumentPrefixOptions,
    instrumentSuffixOptions,
    reforgingPlayEffectOptions,
    reforgingNormalOptions,
    reforgingExcellentOptions,
    reforgingInspiringOptions,
    accessoryPrefixOptions,
    accessorySuffixOptions,
    accessoryReforgeNormalOptions,
    accessoryReforgeExcellentOptions,
    accessoryReforgeInspiringOptions,
    headPrefixOptions,
    headSuffixOptions,
    bodyPrefixOptions,
    bodySuffixOptions,
    handPrefixOptions,
    handSuffixOptions,
    footPrefixOptions,
    footSuffixOptions,
    wingPrefixOptions,
    wingSuffixOptions,
    relicPrefixOptions,
    relicSuffixOptions,
    titleOptions,
    secondTitleOptions,
    farmModelOptions,
    extraFarmModelOptions,
    muliasHolyWaterOptions,
    fluaCrownOptions,
    specialUpgradeOptions,
    fairyDragonOptions,
    dollOptions,
    bugleOptions,
    switchConst,
} from "../data/musicCalculator";
import { MUSIC_SONGS, type MusicSongDef, type SongOutputDef } from "../data/musicSongs";

// ═══════════════════════════════════════════════════════
//  選項對照表 — 每個下拉欄位以「選項索引」作為 v-model
// ═══════════════════════════════════════════════════════
const OPTIONS: Record<string, Option[]> = {
    battleSkill: battleSkillOptions,
    playSkill: playSkillOptions,
    singSkill: singSkillOptions,
    instrument: instrumentBaseOptions,
    instrumentPrefix: instrumentPrefixOptions,
    instrumentSuffix: instrumentSuffixOptions,
    reforgingPlayEffect: reforgingPlayEffectOptions,
    reforgingNormal: reforgingNormalOptions,
    reforgingExcellent: reforgingExcellentOptions,
    reforgingInspiring: reforgingInspiringOptions,
    accessory1Prefix: accessoryPrefixOptions,
    accessory1Suffix: accessorySuffixOptions,
    accessory1ReforgingNormal: accessoryReforgeNormalOptions,
    accessory1ReforgingExcellent: accessoryReforgeExcellentOptions,
    accessory1ReforgingInspiring: accessoryReforgeInspiringOptions,
    accessory2Prefix: accessoryPrefixOptions,
    accessory2Suffix: accessorySuffixOptions,
    accessory2ReforgingNormal: accessoryReforgeNormalOptions,
    accessory2ReforgingExcellent: accessoryReforgeExcellentOptions,
    accessory2ReforgingInspiring: accessoryReforgeInspiringOptions,
    headPrefix: headPrefixOptions,
    headSuffix: headSuffixOptions,
    bodyPrefix: bodyPrefixOptions,
    bodySuffix: bodySuffixOptions,
    handPrefix: handPrefixOptions,
    handSuffix: handSuffixOptions,
    footPrefix: footPrefixOptions,
    footSuffix: footSuffixOptions,
    wingPrefix: wingPrefixOptions,
    wingSuffix: wingSuffixOptions,
    relicPrefix1: relicPrefixOptions,
    relicSuffix1: relicSuffixOptions,
    relicPrefix2: relicPrefixOptions,
    relicSuffix2: relicSuffixOptions,
    relicPrefix3: relicPrefixOptions,
    relicSuffix3: relicSuffixOptions,
    title: titleOptions,
    secondTitle: secondTitleOptions,
    farmModel: farmModelOptions,
    extraFarmModel: extraFarmModelOptions,
    muliasHolyWater: muliasHolyWaterOptions,
    fluaCrown: fluaCrownOptions,
    fairyDragon: fairyDragonOptions,
    specialUpgrade: specialUpgradeOptions,
    doll: dollOptions,
    bugle: bugleOptions,
};

type SelectKey = keyof typeof OPTIONS;

// 各下拉欄位的預設選項索引（對應原作的 defaultSelect）
const DEFAULT_INDEX: Record<SelectKey, number> = {
    battleSkill: 0,
    playSkill: 0,
    singSkill: 0,
    instrument: 1,
    instrumentPrefix: 1,
    instrumentSuffix: 1,
    reforgingPlayEffect: 6,
    reforgingNormal: 0,
    reforgingExcellent: 0,
    reforgingInspiring: 4,
    accessory1Prefix: 1,
    accessory1Suffix: 1,
    accessory1ReforgingNormal: 0,
    accessory1ReforgingExcellent: 0,
    accessory1ReforgingInspiring: 2,
    accessory2Prefix: 1,
    accessory2Suffix: 1,
    accessory2ReforgingNormal: 0,
    accessory2ReforgingExcellent: 0,
    accessory2ReforgingInspiring: 2,
    headPrefix: 0,
    headSuffix: 1,
    bodyPrefix: 3,
    bodySuffix: 0,
    handPrefix: 3,
    handSuffix: 0,
    footPrefix: 3,
    footSuffix: 0,
    wingPrefix: 1,
    wingSuffix: 0,
    relicPrefix1: 0,
    relicSuffix1: 0,
    relicPrefix2: 0,
    relicSuffix2: 0,
    relicPrefix3: 0,
    relicSuffix3: 0,
    title: 1,
    secondTitle: 3,
    farmModel: 3,
    extraFarmModel: 2,
    muliasHolyWater: 0,
    fluaCrown: 0,
    fairyDragon: 2,
    specialUpgrade: 0,
    doll: 0,
    bugle: 0,
};

interface Switches {
    master: boolean;
    arcana: boolean;
    astro: boolean;
    farmTool: boolean;
    couple: boolean;
    silkWing: boolean;
    potion: boolean;
}

const DEFAULT_SWITCHES: Switches = {
    master: true,
    arcana: false,
    astro: false,
    farmTool: true,
    couple: true,
    silkWing: false,
    potion: false,
};

function makeDefaultSelects(): Record<SelectKey, number> {
    return { ...DEFAULT_INDEX };
}

const selects = reactive<Record<SelectKey, number>>(makeDefaultSelects());
const switches = reactive<Switches>({ ...DEFAULT_SWITCHES });
const noCoin = ref<boolean>(true); // 無硬幣（預設）
const totem = ref<number>(0.1); // 布里萊赫硬幣（%）
const otherBonus = ref<number>(0); // 其他項目（活動等）：一般音樂效果加成

// 解析欄位選中的 value
function val(key: SelectKey): number | string {
    return OPTIONS[key][selects[key]]?.value ?? 0;
}
function num(key: SelectKey): number {
    const v = val(key);
    return typeof v === "number" ? v : 0;
}

// 是否為里拉（影響 SR8 特殊改造與樂器演奏額外加成）
const isLira = computed(() => num("instrument") === 25 || num("instrument") === 22);

// SR8 僅限里拉可用
function specialUpgradeDisabled(opt: Option): boolean {
    return !isLira.value && opt.value === 0.055;
}

// 布本硬幣數值
const totemOptions = Array.from({ length: 11 }, (_, index) => index * 0.1);

// ═══════════════════════════════════════════════════════
//  計算 — 移植自原作 cal.ts
// ═══════════════════════════════════════════════════════
interface PerformanceScores {
    playNormal: number;
    playExcellent: number;
    playInspiring: number;
}

// 單一詞條的三段演奏值
interface GradeValues {
    normal: number;
    excellent: number;
    inspiring: number;
}

// ── 歌曲 / 等級 / 技能細工（自由點）狀態 ──
const activeSongId = ref("battlefield");
const activeSong = computed<MusicSongDef>(
    () => MUSIC_SONGS.find((s) => s.id === activeSongId.value) ?? MUSIC_SONGS[0],
);
const songRankIdx = ref(0); // 0 = Rank 1（最高）
const songReforge = reactive<Record<string, number>>({}); // 技能細工自由點：reforgeLine id -> 數值
const songEnhance = reactive<Record<string, boolean>>({}); // 套裝強化各件開關（key = item.id）
// 套用某歌曲的套裝強化預設（清空後把 default 件設為開）
function applyEnhanceDefaults(song: MusicSongDef) {
    for (const k of Object.keys(songEnhance)) delete songEnhance[k];
    for (const it of song.enhanceItems ?? []) if (it.default) songEnhance[it.id] = true;
}
applyEnhanceDefaults(MUSIC_SONGS[0]); // 初始：戰場（熾天使預設開，維持 baseline）
// 切換歌曲時重置等級/細工/套裝強化（讀取配置時以 restoringPreset 跳過，避免覆蓋還原值）
let restoringPreset = false;
watch(activeSongId, () => {
    if (restoringPreset) return;
    songRankIdx.value = 0;
    applyEnhanceDefaults(activeSong.value);
    for (const k of Object.keys(songReforge)) delete songReforge[k];
    // 進行/忍耐無對應龍：若仍選著「對應的精靈龍」(已 disable)，退回「非對應的精靈龍」(仍給 +3)
    if (!activeSong.value.dragonColor && OPTIONS.fairyDragon[selects.fairyDragon]?.value === "match") {
        selects.fairyDragon = OPTIONS.fairyDragon.findIndex((o) => o.value === "other");
    }
});

// 互斥套裝強化（戰場）：目前選中的 item id（"none" = 無），切換時清掉其它件
const enhanceSelectedId = computed(() => {
    for (const it of activeSong.value.enhanceItems ?? []) if (songEnhance[it.id]) return it.id;
    return "none";
});
function setEnhanceExclusive(id: string) {
    for (const it of activeSong.value.enhanceItems ?? []) songEnhance[it.id] = it.id === id;
}

interface CalcState {
    selects: Record<SelectKey, number>;
    switches: Switches;
    noCoin: boolean;
    totem: number;
    otherBonus: number;
}

// 共用計算上下文（音樂效果 / 細工倍率 / 額外 / 精靈龍是否對應），所有輸出詞條共享
interface BuffContext {
    musicEffect: number; // 音樂效果總和 (playBuff)
    gradeMults: GradeValues; // 普通 / 優秀 / 天籟 細工倍率
    extra: number; // 1 + 里拉 + SR + finalRate(硬幣+禮物)
    dragonMatch: boolean; // 是否為「對應的精靈龍」(給 appliesDragon 詞條 base×0.02)
}

// 由狀態快照算出共用上下文
function buildContext(s: CalcState): BuffContext {
    const valOf = (key: SelectKey): number | string => OPTIONS[key][s.selects[key]]?.value ?? 0;
    const numOf = (key: SelectKey): number => {
        const v = valOf(key);
        return typeof v === "number" ? v : 0;
    };

    const data: Record<string, number | string> = {};
    (Object.keys(OPTIONS) as SelectKey[]).forEach((key) => {
        if (key.startsWith("relicSuffix")) return; // 禮物為最終 % 加成，不計入音樂效果總和
        if (key === "battleSkill") return; // 歌曲技能等級值改由 musicSongs base 提供，不計入音樂效果
        data[key] = valOf(key);
    });
    data.otherBonus = Number(s.otherBonus) || 0;
    for (const key of Object.keys(switchConst)) {
        data[key] = s.switches[key as keyof Switches] ? "on" : "off";
    }

    // 精靈龍：對應龍(match)給色加成；任一龍(match/other)皆給音樂效果 +3；無=0
    const dragonMatch = data.fairyDragon === "match";
    const fairyDragonBase = data.fairyDragon !== 0 ? 3 : 0;

    let switchBuff = 0;
    for (const key in data) {
        if (typeof data[key] === "number" || key === "fairyDragon") continue;
        if (data[key] === "on") switchBuff += switchConst[key] ?? 0;
    }

    // 該歌專屬「套裝強化」各件（開啟者相加），併入音樂效果總和
    const song = activeSong.value;
    const enhanceAdd = (song.enhanceItems ?? []).reduce((sum, it) => sum + (songEnhance[it.id] ? it.value : 0), 0);

    // 音樂效果總和：所有 >= 1 的數值 + 精靈龍基礎 + 開關 + 套裝強化（歌曲技能 base 已排除）
    const musicEffect =
        Object.values(data).reduce<number>((acc, v) => (typeof v === "number" && v >= 1 ? acc + v : acc), 0) +
        fairyDragonBase +
        switchBuff +
        enhanceAdd;

    const normalBase = 1 + (data.accessory1ReforgingNormal as number) + (data.accessory2ReforgingNormal as number);
    const excellentBase =
        1.1 + (data.accessory1ReforgingExcellent as number) + (data.accessory2ReforgingExcellent as number);
    const inspiringBase =
        1.3 + (data.accessory1ReforgingInspiring as number) + (data.accessory2ReforgingInspiring as number);

    const totemValue = (s.noCoin ? 0 : Number(s.totem) || 0) / 100;
    const relicRate = (numOf("relicSuffix1") + numOf("relicSuffix2") + numOf("relicSuffix3")) / 1000;
    const finalRate = totemValue + relicRate;
    const isLiraV = numOf("instrument") === 25 || numOf("instrument") === 22;
    const rating = isLiraV ? 0.07 : 0; // 靈魂解放者里拉：戰場/活潑版攻擊力 +7.0%
    const extra = +(1 + rating + (data.specialUpgrade as number) + finalRate).toFixed(6);

    return {
        musicEffect,
        gradeMults: {
            normal: normalBase + (data.reforgingNormal as number),
            excellent: excellentBase + (data.reforgingExcellent as number),
            inspiring: inspiringBase + (data.reforgingInspiring as number),
        },
        extra,
        dragonMatch,
    };
}

// 某條效果的技能細工總和 = 所屬 group 各部位格子相加（key = `${lineId}:${part}`）
function reforgeLineTotal(lineId: string): number {
    for (const group of activeSong.value.reforge ?? []) {
        if (group.lines.some((l) => l.id === lineId)) {
            return group.parts.reduce((s, part) => s + (Number(songReforge[`${lineId}:${part}`]) || 0), 0);
        }
    }
    return 0;
}

// 解析詞條在目前 rank 的 base（含技能細工 grid 總和）
function outputBase(o: SongOutputDef): number {
    const b = o.baseByRank[songRankIdx.value] ?? 0;
    const r = o.reforgeLine ? reforgeLineTotal(o.reforgeLine) : 0;
    return b + r;
}

// 算單一詞條的三段演奏值
function computeBuff(o: SongOutputDef, ctx: BuffContext): GradeValues {
    const base = outputBase(o);
    // 固定值詞條（如豐年成功率）：三段皆為 base，不吃任何效果
    if (o.raw) return { normal: base, excellent: base, inspiring: base };
    const basePlay = base * (1 + ctx.musicEffect * 0.01);
    const fd = o.appliesDragon && ctx.dragonMatch ? base * 0.02 : 0;
    const ex = o.appliesExtra ? ctx.extra : 1;
    return {
        normal: (basePlay * ctx.gradeMults.normal + fd) * ex,
        excellent: (basePlay * ctx.gradeMults.excellent + fd) * ex,
        inspiring: (basePlay * ctx.gradeMults.inspiring + fd) * ex,
    };
}

// 該歌主詞條（第一個吃額外的攻擊詞條，否則第一條）— 供「提升效益分析」與 Debug 共用
function primaryOutput(song: MusicSongDef): SongOutputDef {
    return song.outputs.find((o) => o.appliesExtra) ?? song.outputs[0];
}

// 主詞條三段值（提升分析 / Debug 共用）
function computeScores(s: CalcState): PerformanceScores {
    const song = activeSong.value;
    const out = computeBuff(primaryOutput(song), buildContext(s));
    return { playNormal: out.normal, playExcellent: out.excellent, playInspiring: out.inspiring };
}

// 目前歌曲所有詞條（結果面板用）
function computeOutputs(s: CalcState) {
    const song = activeSong.value;
    const ctx = buildContext(s);
    return song.outputs.map((o) => ({
        name: o.name,
        defaultShow: o.defaultShow !== false,
        ...computeBuff(o, ctx),
    }));
}

// 目前狀態快照
function currentState(): CalcState {
    return {
        selects: { ...selects },
        switches: { ...switches },
        noCoin: noCoin.value,
        totem: totem.value,
        otherBonus: otherBonus.value,
    };
}

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

// 目前歌曲的所有詞條（結果面板）；只顯示 defaultShow 的詞條
const resultOutputs = computed(() => computeOutputs(currentState()).filter((o) => o.defaultShow));

// ═══════════════════════════════════════════════════════
//  Debug — 詞條分類明細
// ═══════════════════════════════════════════════════════
const showDebug = ref(false);

const SWITCH_LABELS: Record<keyof Switches, string> = {
    master: "一代宗師吟遊詩人",
    arcana: "聖詠者同步",
    astro: "戀人卡",
    farmTool: "雲朵坐墊(4階段)",
    couple: "情侶手鍊 / 婚戒",
    silkWing: "優雅絲緞翅膀",
    potion: "音樂強化藥水",
};

// 計入「音樂加成總和」(playBuff) 的詞條分類（值 >= 1 才有貢獻）
const DEBUG_GROUPS: { name: string; keys: SelectKey[] }[] = [
    { name: "技能", keys: ["playSkill", "singSkill"] },
    { name: "樂器（本體 + 賦予）", keys: ["instrument", "instrumentPrefix", "instrumentSuffix"] },
    { name: "細工·樂器演奏效果", keys: ["reforgingPlayEffect"] },
    { name: "飾品賦予", keys: ["accessory1Prefix", "accessory1Suffix", "accessory2Prefix", "accessory2Suffix"] },
    {
        name: "裝備賦予",
        keys: [
            "headPrefix",
            "headSuffix",
            "bodyPrefix",
            "bodySuffix",
            "handPrefix",
            "handSuffix",
            "footPrefix",
            "footSuffix",
            "wingPrefix",
            "wingSuffix",
        ],
    },
    // 宗師/稱號 與 農場合併為同一分類。
    { name: "才能/稱號/農場", keys: ["title", "secondTitle", "farmModel", "extraFarmModel"] },
    // 穆里亞斯聖水：音樂增益效果，計入加成總和（先前漏列，導致 debug playBuff 少算）。
    { name: "聖水", keys: ["muliasHolyWater"] },
    // 「套裝/寵物」改為很貴的項目；遺物接尾仍由最終倍率公式處理，不放入一般加成總和。
    { name: "很貴的項目", keys: ["fluaCrown", "relicPrefix1", "relicPrefix2", "relicPrefix3"] },
    { name: "娃娃背包 / 喇叭 / 寵物", keys: ["doll", "bugle", "fairyDragon"] },
];

const debug = computed(() => {
    const song = activeSong.value;
    const primary = primaryOutput(song);
    const battle = outputBase(primary); // 主詞條目前 rank 的 base（含技能細工）
    const rankBase = primary.baseByRank[songRankIdx.value] ?? 0; // 純 rank base
    const reforgeAdd = battle - rankBase; // 技能細工對主詞條 base 的加成

    // 加成分類（只列出有貢獻的詞條）
    const groups = DEBUG_GROUPS.map((g) => {
        const items = g.keys
            .map((k) => ({ label: OPTIONS[k][selects[k]]?.label ?? k, value: num(k) }))
            .filter((i) => i.value >= 1);
        return { name: g.name, total: items.reduce((s, i) => s + i.value, 0), items };
    });

    // 套裝強化（開啟者）：計入演奏加成總和
    const enhanceItemsOn = (song.enhanceItems ?? []).filter((it) => songEnhance[it.id]);
    const enhanceAdd = enhanceItemsOn.reduce((s, it) => s + it.value, 0);
    if (enhanceAdd >= 1) {
        groups.push({
            name: "套裝強化",
            total: enhanceAdd,
            items: enhanceItemsOn.map((it) => ({ label: it.label, value: it.value })),
        });
    }

    // 布里萊赫硬幣為最終 % 加成，只計入最終倍率（不放入一般加成總和），與遺物接尾「禮物」一致。
    const coin = noCoin.value ? 0 : Number(totem.value) || 0;
    // 其他項目維持在分類明細最下方。
    const ob = Number(otherBonus.value) || 0;
    if (ob >= 1) {
        groups.push({ name: "其他項目（活動等）", total: ob, items: [{ label: `其他項目 +${ob}`, value: ob }] });
    }

    // 開關
    const switchItems = (Object.keys(switchConst) as (keyof Switches)[])
        .filter((k) => switches[k] && (switchConst[k] ?? 0) > 0)
        .map((k) => ({ label: SWITCH_LABELS[k], value: switchConst[k] }));
    const switchBuff = switchItems.reduce((s, i) => s + i.value, 0);

    // 精靈龍：任一龍 +3；對應龍(match) 再給主詞條 base×0.02
    const fd = val("fairyDragon");
    const fairyDragonBase = fd !== 0 ? 3 : 0;
    const fairyDragonBuff = primary.appliesDragon && fd === "match" ? battle * 0.02 : 0;

    const additiveTotal = groups.reduce((s, g) => s + g.total, 0);
    const playBuff = additiveTotal + switchBuff + fairyDragonBase;
    const basePlay = battle * (1 + playBuff * 0.01);

    // 細工倍率（演奏）
    const normalBase = 1 + num("accessory1ReforgingNormal") + num("accessory2ReforgingNormal");
    const excellentBase = 1.1 + num("accessory1ReforgingExcellent") + num("accessory2ReforgingExcellent");
    const inspiringBase = 1.3 + num("accessory1ReforgingInspiring") + num("accessory2ReforgingInspiring");
    const mult = {
        normalPlay: normalBase + num("reforgingNormal"),
        excellentPlay: excellentBase + num("reforgingExcellent"),
        inspiringPlay: inspiringBase + num("reforgingInspiring"),
    };

    // 最終 % 加成
    const totemValue = coin / 100;
    const relicRate = (num("relicSuffix1") + num("relicSuffix2") + num("relicSuffix3")) / 1000;
    const finalRate = totemValue + relicRate;
    const rating = isLira.value ? 0.07 : 0;
    const su = num("specialUpgrade");
    const extra = +(1 + rating + su + finalRate).toFixed(6);

    return {
        songName: song.name,
        primaryName: primary.name,
        primaryAppliesExtra: !!primary.appliesExtra,
        rankLabel: song.ranks[songRankIdx.value] ?? "",
        rankBase,
        reforgeAdd,
        battle,
        groups,
        switchItems,
        switchBuff,
        fairyDragonBase,
        fairyDragonBuff,
        fairyLabel: OPTIONS.fairyDragon[selects.fairyDragon]?.label ?? "",
        playBuff,
        basePlay,
        mult,
        totemValue,
        relicRate,
        finalRate,
        rating,
        su,
        extra,
    };
});

// 各分頁的下拉欄位定義
const skillKeys = ["playSkill", "singSkill"] as const;
const skillFields = [
    { label: "樂器演奏", key: "playSkill" },
    { label: "歌唱", key: "singSkill" },
] as const;

// 細工與回音分頁：樂器演奏效果獨立，其餘為 普通/優秀/天籟 grid（樂器 / 飾品1 / 飾品2）
const reforgeRows = [
    {
        label: "樂器",
        normal: "reforgingNormal",
        excellent: "reforgingExcellent",
        inspiring: "reforgingInspiring",
    },
    {
        label: "飾品1",
        normal: "accessory1ReforgingNormal",
        excellent: "accessory1ReforgingExcellent",
        inspiring: "accessory1ReforgingInspiring",
    },
    {
        label: "飾品2",
        normal: "accessory2ReforgingNormal",
        excellent: "accessory2ReforgingExcellent",
        inspiring: "accessory2ReforgingInspiring",
    },
] as const;
const reforgeKeys: SelectKey[] = [
    "reforgingPlayEffect",
    ...reforgeRows.flatMap((r) => [r.normal as SelectKey, r.excellent as SelectKey, r.inspiring as SelectKey]),
];

// 技能細工每格以「等級 select」呈現（與演奏效果一致）；無在最上，其餘由大至小，超過常規上限標（突破限定）
function reforgeLevelOptions(cap: { normalMax: number; breakMax: number }) {
    const opts: { value: number; label: string }[] = [{ value: 0, label: "無" }];
    for (let v = cap.breakMax; v >= 1; v--) {
        opts.push({ value: v, label: `+${v}${v > cap.normalMax ? "（突破限定）" : ""}` });
    }
    return opts;
}

// 技能細工 grid 欄數動態（部位欄 + 各效果欄），依該 group 的效果數
function reforgeGridStyle(lineCount: number) {
    return { gridTemplateColumns: `72px repeat(${lineCount}, minmax(0, 1fr))` };
}

const talentTitleFarmFields = [
    { label: "第一稱號", key: "title" },
    { label: "第二稱號", key: "secondTitle" },
    { label: "一般農場模型", key: "farmModel" },
    { label: "特別農場模型", key: "extraFarmModel" },
] as const;

const expensiveItemFields = [{ label: "草冠", key: "fluaCrown" }] as const;

// 裝備分頁：每列一個部位（接頭 / 接尾），含樂器、飾品賦予；排版參考頂裝差距
const gearRows = [
    { label: "樂器", prefix: "instrumentPrefix", suffix: "instrumentSuffix" },
    { label: "飾品1", prefix: "accessory1Prefix", suffix: "accessory1Suffix" },
    { label: "飾品2", prefix: "accessory2Prefix", suffix: "accessory2Suffix" },
    { label: "頭部", prefix: "headPrefix", suffix: "headSuffix" },
    { label: "身體", prefix: "bodyPrefix", suffix: "bodySuffix" },
    { label: "手部", prefix: "handPrefix", suffix: "handSuffix" },
    { label: "腳部", prefix: "footPrefix", suffix: "footSuffix" },
    { label: "翅膀", prefix: "wingPrefix", suffix: "wingSuffix" },
] as const;

// 遺物 1/2/3 移至「很貴的項目」。
const relicRows = [
    { label: "遺物1", prefix: "relicPrefix1", suffix: "relicSuffix1" },
    { label: "遺物2", prefix: "relicPrefix2", suffix: "relicSuffix2" },
    { label: "遺物3", prefix: "relicPrefix3", suffix: "relicSuffix3" },
] as const;

const relicPrefixKeys = relicRows.map((row) => row.prefix as SelectKey);
const relicSuffixKeys = relicRows.map((row) => row.suffix as SelectKey);
const relicCountOptions = [0, 1, 2, 3];

function selectedRelicCount(keys: SelectKey[]): number {
    return keys.filter((key) => selects[key] > 0).length;
}

function setRelicCount(keys: SelectKey[], count: number) {
    keys.forEach((key, index) => {
        selects[key] = index < count ? 1 : 0;
    });
}

// 將三個遺物欄位濃縮成 0~3 數量選擇，底層仍寫回原本的 select key。
const relicPrefixCount = computed({
    get: () => selectedRelicCount(relicPrefixKeys),
    set: (count: number) => setRelicCount(relicPrefixKeys, count),
});

const relicSuffixCount = computed({
    get: () => selectedRelicCount(relicSuffixKeys),
    set: (count: number) => setRelicCount(relicSuffixKeys, count),
});

// ═══════════════════════════════════════════════════════
//  「最頂 / 最高」設定
// ═══════════════════════════════════════════════════════
const activeTab = ref("reforge");

const SELECTS_BY_TAB: Record<string, SelectKey[]> = {
    reforge: [...reforgeKeys],
    gear: [
        "instrument",
        ...gearRows.flatMap((r) => [r.prefix as SelectKey, r.suffix as SelectKey]),
        "specialUpgrade",
        "muliasHolyWater",
    ],
    title: ["title", "secondTitle", "farmModel", "extraFarmModel"],
    set: ["fluaCrown", ...relicRows.flatMap((r) => [r.prefix as SelectKey, r.suffix as SelectKey])],
    misc: ["fairyDragon", "doll", "bugle"],
    skill: [...skillKeys],
};

const SWITCHES_BY_TAB: Record<string, (keyof Switches)[]> = {
    reforge: [],
    gear: [],
    title: ["master", "arcana", "farmTool"],
    set: ["couple", "silkWing"],
    misc: ["astro", "potion"],
    skill: [],
};

// 取得某欄位「最高加成」的選項索引
function bestIndex(key: SelectKey): number {
    if (key === "fairyDragon") {
        // 有對應龍的歌挑「對應的精靈龍」(index 0)；進行/忍耐無對應龍 → 挑「非對應的精靈龍」(index 1，仍給 +3)
        return activeSong.value.dragonColor ? 0 : 1;
    }
    const opts = OPTIONS[key];
    let bi = 0;
    let bv = -Infinity;
    opts.forEach((o, i) => {
        if (key === "specialUpgrade" && specialUpgradeDisabled(o)) return;
        const v = typeof o.value === "number" ? o.value : -Infinity;
        if (v > bv) {
            bv = v;
            bi = i;
        }
    });
    return bi;
}

function topTab(name: string) {
    (SELECTS_BY_TAB[name] ?? []).forEach((k) => (selects[k] = bestIndex(k)));
    (SWITCHES_BY_TAB[name] ?? []).forEach((k) => (switches[k] = true));
    if (name === "set") {
        noCoin.value = false;
        totem.value = 1.0;
        topEnhance(); // 套裝強化也拉到最高
    }
    if (name === "reforge") {
        topReforge(); // 技能相關細工每格拉到突破上限
    }
    // 其他項目（活動加成用）不在「最頂」範圍，維持 0
}

// 技能相關細工：每格設為突破上限
function topReforge() {
    for (const group of activeSong.value.reforge ?? []) {
        for (const line of group.lines) {
            for (const part of group.parts) songReforge[`${line.id}:${part}`] = line.breakMax;
        }
    }
}

// 套裝強化最頂：互斥取最高 value 的件，非互斥則全部開。
// 例外：slot==="head" 的套裝與草冠同部位（草冠在 set 分頁已拉到最高且 ≥ 該套裝），最頂時不開、由草冠勝出。
function topEnhance() {
    const items = activeSong.value.enhanceItems ?? [];
    if (!items.length) return;
    if (activeSong.value.enhanceExclusive) {
        const best = items.reduce((a, b) => (b.value > a.value ? b : a));
        for (const it of items) songEnhance[it.id] = it.id === best.id;
    } else {
        for (const it of items) songEnhance[it.id] = it.slot !== "head";
    }
}

function topAll() {
    // 裝備先設定（最高樂器為里拉 → 解鎖 SR8），再套用其餘分頁
    ["gear", "reforge", "skill", "title", "set", "misc"].forEach(topTab);
}

// ═══════════════════════════════════════════════════════
//  提升效益分析
// ═══════════════════════════════════════════════════════
// 各 select 欄位的友善名稱
const SELECT_LABELS: Partial<Record<SelectKey, string>> = {
    playSkill: "樂器演奏",
    singSkill: "歌唱",
    instrument: "樂器本體",
    reforgingPlayEffect: "樂器演奏效果",
    title: "第一稱號",
    secondTitle: "第二稱號",
    farmModel: "一般農場模型",
    extraFarmModel: "特別農場模型",
    fluaCrown: "草冠",
    muliasHolyWater: "聖水",
    specialUpgrade: "樂器特殊改造",
    fairyDragon: "寵物",
    doll: "娃娃背包",
    bugle: "喇叭",
};
gearRows.forEach((r) => {
    SELECT_LABELS[r.prefix as SelectKey] = `${r.label}接頭`;
    SELECT_LABELS[r.suffix as SelectKey] = `${r.label}接尾`;
});
reforgeRows.forEach((r) => {
    SELECT_LABELS[r.normal as SelectKey] = `${r.label}細工-普通`;
    SELECT_LABELS[r.excellent as SelectKey] = `${r.label}細工-優秀`;
    SELECT_LABELS[r.inspiring as SelectKey] = `${r.label}細工-天籟`;
});

const analysisGrades = reactive({ inspiring: true, excellent: false, normal: false });
const showPerStep = ref(true); // 顯示每級/數值的提升
const showOtherItems = ref(false); // 顯示其他項目

function cloneState(s: CalcState): CalcState {
    return {
        selects: { ...s.selects },
        switches: { ...s.switches },
        noCoin: s.noCoin,
        totem: s.totem,
        otherBonus: s.otherBonus,
    };
}

interface ImproveMeta {
    id: string;
    name: string;
    curLabel: string;
    bestLabel: string;
    steps: number; // 從目前到最高的「級數 / 數值差」，供 per level 計算
    stepUnit: string; // 級 / 點 / 個 / 階
    apply: (st: CalcState) => void; // 套用至 clone
    applyReal: () => void; // 套用至實際設定
}

interface ImproveRow extends ImproveMeta {
    dN: number;
    dE: number;
    dI: number;
}

const improveItems = computed<ImproveRow[]>(() => {
    const cur = currentState();
    const base = computeScores(cur);
    const rows: ImproveRow[] = [];

    const evalItem = (meta: ImproveMeta) => {
        if (!showOtherItems.value && meta.name === "其他項目") return;
        const clone = cloneState(cur);
        meta.apply(clone);
        const s = computeScores(clone);
        const dN = s.playNormal - base.playNormal;
        const dE = s.playExcellent - base.playExcellent;
        const dI = s.playInspiring - base.playInspiring;
        if (Math.max(dN, dE, dI) <= 0.0001) return; // 沒有實際提升的不列
        rows.push({ ...meta, dN, dE, dI });
    };

    // 開關（未開啟）
    (Object.keys(SWITCH_LABELS) as (keyof Switches)[]).forEach((k) => {
        if (switches[k]) return;
        evalItem({
            id: `sw-${k}`,
            name: SWITCH_LABELS[k],
            curLabel: "關",
            bestLabel: "開",
            steps: switchConst[k] ?? 1,
            stepUnit: "點",
            apply: (st) => (st.switches[k] = true),
            applyReal: () => (switches[k] = true),
        });
    });

    // 下拉（未選到頂；以 value 比較，避免相同 value 的選項被誤判）
    (Object.keys(SELECT_LABELS) as SelectKey[]).forEach((k) => {
        // 細工分普通/優秀/天籟：對應演奏未勾選就不列該細工（reforgingPlayEffect 非分級，照列）
        const lk = k.toLowerCase();
        if (lk.includes("reforging")) {
            if (lk.endsWith("normal") && !analysisGrades.normal) return;
            if (lk.endsWith("excellent") && !analysisGrades.excellent) return;
            if (lk.endsWith("inspiring") && !analysisGrades.inspiring) return;
        }
        const bi = bestIndex(k);
        const curVal = OPTIONS[k][selects[k]]?.value;
        const bestVal = OPTIONS[k][bi]?.value;
        if (curVal === bestVal) return;
        // 計算級數差與單位
        let steps = 1;
        let stepUnit = "點";
        if (k === "reforgingPlayEffect") {
            steps = (bestVal as number) - (curVal as number);
            stepUnit = "級";
        } else if (k.toLowerCase().includes("reforging")) {
            steps = Math.round(((bestVal as number) - (curVal as number)) * 100);
            stepUnit = "級";
        } else if (k === "specialUpgrade") {
            steps = bi - selects[k];
            stepUnit = "級";
        } else if (typeof curVal === "number" && typeof bestVal === "number") {
            steps = bestVal - curVal;
            stepUnit = "點";
        } else {
            steps = 1;
            stepUnit = "";
        }
        evalItem({
            id: `sel-${k}`,
            name: SELECT_LABELS[k] ?? k,
            curLabel: OPTIONS[k][selects[k]]?.label ?? "—",
            bestLabel: OPTIONS[k][bi]?.label ?? "—",
            steps,
            stepUnit,
            apply: (st) => (st.selects[k] = bi),
            applyReal: () => (selects[k] = bi),
        });
    });

    // 月餅數量（接頭 / 接尾）
    if (relicPrefixCount.value < 3) {
        evalItem({
            id: "relic-pre",
            name: "月餅接頭-單純的",
            curLabel: `${relicPrefixCount.value} 個`,
            bestLabel: "3 個",
            steps: 3 - relicPrefixCount.value,
            stepUnit: "個",
            apply: (st) => relicPrefixKeys.forEach((k) => (st.selects[k] = 1)),
            applyReal: () => setRelicCount(relicPrefixKeys, 3),
        });
    }
    if (relicSuffixCount.value < 3) {
        evalItem({
            id: "relic-suf",
            name: "月餅接尾-禮物",
            curLabel: `${relicSuffixCount.value} 個`,
            bestLabel: "3 個",
            steps: 3 - relicSuffixCount.value,
            stepUnit: "個",
            apply: (st) => relicSuffixKeys.forEach((k) => (st.selects[k] = 1)),
            applyReal: () => setRelicCount(relicSuffixKeys, 3),
        });
    }

    // 布里萊赫硬幣
    if (noCoin.value || totem.value < 1.0) {
        evalItem({
            id: "coin",
            name: "布里萊赫硬幣",
            curLabel: noCoin.value ? "無" : `${totem.value}%`,
            bestLabel: "1.0%",
            steps: Math.max(1, Math.round((1.0 - (noCoin.value ? 0 : totem.value)) / 0.1)),
            stepUnit: "階",
            apply: (st) => {
                st.noCoin = false;
                st.totem = 1.0;
            },
            applyReal: () => {
                noCoin.value = false;
                totem.value = 1.0;
            },
        });
    }

    // 其他項目
    if ((Number(otherBonus.value) || 0) < 20) {
        evalItem({
            id: "other",
            name: "其他項目",
            curLabel: `${otherBonus.value || 0}`,
            bestLabel: "20",
            steps: 20 - (Number(otherBonus.value) || 0),
            stepUnit: "點",
            apply: (st) => (st.otherBonus = 20),
            applyReal: () => (otherBonus.value = 20),
        });
    }

    // 依主要演奏等級的提升排序（天籟 > 優秀 > 普通）
    const primary = (it: ImproveRow) =>
        analysisGrades.inspiring ? it.dI : analysisGrades.excellent ? it.dE : analysisGrades.normal ? it.dN : it.dI;
    rows.sort((a, b) => primary(b) - primary(a));
    return rows;
});

// 勾選的項目（僅模擬，不動到實際設定）
const selectedIds = reactive(new Set<string>());
function toggleSelected(id: string) {
    if (selectedIds.has(id)) selectedIds.delete(id);
    else selectedIds.add(id);
}

// 勾選項目「全部套用後」的預估演奏 % 與總提升
const projection = computed(() => {
    const cur = currentState();
    const base = computeScores(cur);
    const clone = cloneState(cur);
    let count = 0;
    improveItems.value.forEach((it) => {
        if (selectedIds.has(it.id)) {
            it.apply(clone);
            count++;
        }
    });
    const proj = computeScores(clone);
    return {
        count,
        normal: proj.playNormal,
        excellent: proj.playExcellent,
        inspiring: proj.playInspiring,
        dN: proj.playNormal - base.playNormal,
        dE: proj.playExcellent - base.playExcellent,
        dI: proj.playInspiring - base.playInspiring,
    };
});

// 把勾選的項目實際套用至設定
function applySelected() {
    improveItems.value.filter((it) => selectedIds.has(it.id)).forEach((it) => it.applyReal());
    selectedIds.clear();
}

// ═══════════════════════════════════════════════════════
//  配置儲存 (localStorage) — 依歌曲分別儲存（類配裝器）
// ═══════════════════════════════════════════════════════
const STORAGE_KEY = "music_calc_presets_v2"; // v2：依歌曲分組 { [songId]: build[] }
const LEGACY_KEY = "music_calc_presets_v1"; // v1：單一清單，載入時依各筆 songId 遷移

interface MusicPreset {
    name: string;
    timestamp: number;
    data: {
        selects: Record<SelectKey, number>;
        switches: Switches;
        noCoin: boolean;
        totem: number;
        otherBonus: number;
        // 歌曲專屬狀態（舊存檔可能沒有，讀取時以預設補上）
        songId?: string;
        songRankIdx?: number;
        songEnhance?: Record<string, boolean>;
        songReforge?: Record<string, number>;
    };
}

// 讀取所有存檔（v2 直接讀；否則由 v1 單一清單依 songId 遷移）
function loadAllPresets(): Record<string, MusicPreset[]> {
    try {
        const v2 = localStorage.getItem(STORAGE_KEY);
        if (v2) return JSON.parse(v2) || {};
        const v1 = localStorage.getItem(LEGACY_KEY);
        if (v1) {
            const map: Record<string, MusicPreset[]> = {};
            for (const p of (JSON.parse(v1) as MusicPreset[]) || []) {
                const sid = (p.data?.songId as string) || "battlefield";
                (map[sid] ??= []).push(p);
            }
            return map;
        }
    } catch {
        /* 損毀則回空 */
    }
    return {};
}

const allPresets = ref<Record<string, MusicPreset[]>>(loadAllPresets());
// 攤平所有歌曲的存檔（面板直接顯示全部，每筆標註所屬歌曲）
interface PresetEntry {
    songId: string;
    songName: string;
    idx: number; // 在該歌曲清單中的 index
    preset: MusicPreset;
}
const presetEntries = computed<PresetEntry[]>(() => {
    const out: PresetEntry[] = [];
    for (const song of MUSIC_SONGS) {
        (allPresets.value[song.id] ?? []).forEach((preset, idx) =>
            out.push({ songId: song.id, songName: song.name, idx, preset }),
        );
    }
    return out;
});
const newPresetName = ref("");
const showPresetPanel = ref(false);

function persistPresets() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPresets.value));
}

// 若當前歌曲有存檔，頁面載入時自動讀取第一筆
onMounted(() => {
    const list = allPresets.value[activeSongId.value];
    if (list && list.length > 0) loadPreset(activeSongId.value, 0);
});

function snapshot(): MusicPreset["data"] {
    return {
        selects: JSON.parse(JSON.stringify(selects)),
        switches: JSON.parse(JSON.stringify(switches)),
        noCoin: noCoin.value,
        totem: totem.value,
        otherBonus: otherBonus.value,
        songId: activeSongId.value,
        songRankIdx: songRankIdx.value,
        songEnhance: JSON.parse(JSON.stringify(songEnhance)),
        songReforge: JSON.parse(JSON.stringify(songReforge)),
    };
}

function savePreset() {
    const list = (allPresets.value[activeSongId.value] ??= []);
    const name = newPresetName.value.trim() || `配置 ${list.length + 1}`;
    list.push({ name, timestamp: Date.now(), data: snapshot() });
    persistPresets();
    newPresetName.value = "";
}

function loadPreset(songId: string, idx: number) {
    const d = allPresets.value[songId]?.[idx]?.data;
    if (!d) return;
    if (d.selects) {
        (Object.keys(selects) as SelectKey[]).forEach((k) => {
            if (typeof d.selects[k] === "number") selects[k] = d.selects[k];
        });
    }
    if (d.switches) {
        (Object.keys(switches) as (keyof Switches)[]).forEach((k) => {
            if (typeof d.switches[k] === "boolean") switches[k] = d.switches[k];
        });
    }
    noCoin.value = typeof d.noCoin === "boolean" ? d.noCoin : true;
    totem.value = Number(d.totem) || 0.1;
    otherBonus.value = Number(d.otherBonus) || 0;

    // 歌曲專屬狀態：先設歌曲（restoringPreset 跳過 watch 重置），再還原等級/細工/套裝強化
    restoringPreset = true;
    const targetSong = MUSIC_SONGS.find((s) => s.id === d.songId) ?? MUSIC_SONGS[0];
    activeSongId.value = targetSong.id;
    songRankIdx.value = Number(d.songRankIdx) || 0;
    if (d.songEnhance && typeof d.songEnhance === "object") {
        for (const k of Object.keys(songEnhance)) delete songEnhance[k];
        Object.assign(songEnhance, d.songEnhance);
    } else {
        applyEnhanceDefaults(targetSong);
    }
    Object.keys(songReforge).forEach((k) => delete songReforge[k]);
    Object.assign(songReforge, d.songReforge ?? {});
    nextTick(() => (restoringPreset = false));
}

function deletePreset(songId: string, idx: number) {
    const list = allPresets.value[songId];
    if (!list) return;
    list.splice(idx, 1);
    persistPresets();
}

function renamePreset(songId: string, idx: number, name: string) {
    const item = allPresets.value[songId]?.[idx];
    if (item) {
        item.name = name;
        persistPresets();
    }
}

function resetAll() {
    Object.assign(selects, makeDefaultSelects());
    Object.assign(switches, DEFAULT_SWITCHES);
    noCoin.value = true;
    totem.value = 0.1;
    otherBonus.value = 0;
    activeSongId.value = "battlefield";
    songRankIdx.value = 0;
    applyEnhanceDefaults(MUSIC_SONGS[0]);
    Object.keys(songReforge).forEach((k) => delete songReforge[k]);
}

function fmtDate(ts: number): string {
    return new Date(ts).toLocaleString("zh-TW", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
</script>

<template>
    <div class="music-calc">
        <h1 class="page-title">
            <span class="text-gradient">音樂計算機</span>
            <span class="page-subtitle">戰場的序曲 效果計算</span>
        </h1>

        <div class="sim-layout">
            <!-- ════════ 左側 — 設定 ════════ -->
            <div class="form-panel">
                <!-- ── 儲存 / 讀取（風格參考頂裝差距）── -->
                <el-card class="preset-card">
                    <div
                        class="preset-head"
                        :class="{ open: showPresetPanel }"
                        @click="showPresetPanel = !showPresetPanel"
                    >
                        <span class="preset-head-title">💾 儲存 / 讀取</span>
                        <span class="preset-head-count">{{ presetEntries.length }} 套</span>
                        <span
                            class="preset-head-chevron"
                            :style="{ transform: showPresetPanel ? 'rotate(180deg)' : 'rotate(0deg)' }"
                        >
                            ▼
                        </span>
                    </div>

                    <template v-if="showPresetPanel">
                        <div class="preset-save-row">
                            <el-input
                                v-model="newPresetName"
                                placeholder="配置名稱（留空自動命名）"
                                size="small"
                                clearable
                                @keyup.enter="savePreset"
                            />
                            <el-button type="primary" size="small" @click="savePreset">
                                儲存目前（{{ activeSong.name }}）
                            </el-button>
                            <el-button size="small" plain @click="resetAll">重設</el-button>
                        </div>

                        <div v-if="presetEntries.length === 0" class="preset-empty">尚無儲存配置</div>
                        <div v-else class="preset-list">
                            <div
                                v-for="entry in presetEntries"
                                :key="entry.songId + ':' + entry.idx"
                                class="preset-item"
                            >
                                <span
                                    class="preset-song-badge"
                                    :class="{ 'is-current': entry.songId === activeSongId }"
                                >
                                    {{ entry.songName }}
                                </span>
                                <el-input
                                    :model-value="entry.preset.name"
                                    size="small"
                                    class="preset-name-input"
                                    @change="(v: string) => renamePreset(entry.songId, entry.idx, v)"
                                />
                                <span class="preset-date">{{ fmtDate(entry.preset.timestamp) }}</span>
                                <el-button size="small" plain @click="loadPreset(entry.songId, entry.idx)">讀取</el-button>
                                <el-button
                                    size="small"
                                    type="danger"
                                    plain
                                    @click="deletePreset(entry.songId, entry.idx)"
                                >
                                    ✕
                                </el-button>
                            </div>
                        </div>
                    </template>
                </el-card>

                <!-- ── 歌曲選擇（情境切換；保留裝備）── -->
                <div class="song-selector">
                    <div class="field-row">
                        <label class="field-label">歌曲</label>
                        <el-select v-model="activeSongId" size="small" class="field-select">
                            <el-option
                                v-for="song in MUSIC_SONGS"
                                :key="song.id"
                                :label="song.name"
                                :value="song.id"
                            />
                        </el-select>
                    </div>
                </div>

                <!-- ── 快捷：最頂 ── -->
                <div class="quick-actions">
                    <el-button size="small" type="primary" plain @click="topAll">全部最頂</el-button>
                    <el-button size="small" plain @click="topTab(activeTab)">當前 tab 最高</el-button>
                </div>

                <!-- ── 設定分頁 ── -->
                <el-tabs v-model="activeTab" type="border-card" class="setting-tabs">
                    <!-- 細工（順序最前）-->
                    <el-tab-pane label="細工" name="reforge">
                        <div class="tab-body">
                            <div class="field-section-label">演奏相關</div>
                            <!-- 樂器演奏效果（獨立一條）-->
                            <div class="field-row">
                                <label class="field-label">樂器演奏效果</label>
                                <el-select v-model="selects.reforgingPlayEffect" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.reforgingPlayEffect"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                            <!-- 普通 / 優秀 / 天籟（樂器 / 飾品1 / 飾品2）-->
                            <div class="reforge-grid reforge-head">
                                <span></span>
                                <span class="reforge-col-label col-normal">普通演奏效果</span>
                                <span class="reforge-col-label col-excellent">優秀演奏效果</span>
                                <span class="reforge-col-label col-inspiring">天籟演奏效果</span>
                            </div>
                            <div class="reforge-grid" v-for="row in reforgeRows" :key="row.label">
                                <span class="gear-slot-label">{{ row.label }}</span>
                                <el-select
                                    v-for="col in [row.normal, row.excellent, row.inspiring]"
                                    :key="col"
                                    v-model="selects[col as SelectKey]"
                                    size="small"
                                    class="gear-select"
                                >
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS[col]"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>

                            <!-- 當前歌曲：技能相關（每個 group 一個 部位 × 效果 grid，每格 select）-->
                            <template v-if="(activeSong.reforge ?? []).length">
                                <div class="field-section-label">技能相關（{{ activeSong.name }}）</div>
                                <template v-for="(group, gi) in activeSong.reforge" :key="gi">
                                    <div class="reforge-grid reforge-head" :style="reforgeGridStyle(group.lines.length)">
                                        <span class="reforge-corner"></span>
                                        <span v-for="line in group.lines" :key="line.id" class="reforge-col-label">
                                            {{ line.label }}
                                        </span>
                                    </div>
                                    <div
                                        class="reforge-grid"
                                        v-for="part in group.parts"
                                        :key="part"
                                        :style="reforgeGridStyle(group.lines.length)"
                                    >
                                        <span class="gear-slot-label">{{ part }}</span>
                                        <el-select
                                            v-for="line in group.lines"
                                            :key="line.id"
                                            :model-value="songReforge[line.id + ':' + part] ?? 0"
                                            size="small"
                                            class="gear-select"
                                            @update:model-value="
                                                (v: number) => (songReforge[line.id + ':' + part] = Number(v) || 0)
                                            "
                                        >
                                            <el-option
                                                v-for="opt in reforgeLevelOptions(line)"
                                                :key="opt.value"
                                                :label="opt.label"
                                                :value="opt.value"
                                            />
                                        </el-select>
                                    </div>
                                </template>
                            </template>
                        </div>
                    </el-tab-pane>

                    <!-- 裝備與賦予（樂器本體 + 部位 | 接頭 | 接尾，排版參考頂裝差距）-->
                    <el-tab-pane label="裝備與賦予" name="gear">
                        <div class="tab-body">
                            <div class="field-row">
                                <label class="field-label">樂器本體</label>
                                <el-select v-model="selects.instrument" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.instrument"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">樂器特殊改造</label>
                                <el-select v-model="selects.specialUpgrade" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.specialUpgrade"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                        :disabled="specialUpgradeDisabled(opt)"
                                    />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">聖水音樂 buff 總和</label>
                                <el-select v-model="selects.muliasHolyWater" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.muliasHolyWater"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                            <div class="gear-grid gear-head">
                                <span></span>
                                <span class="gear-col-label">接頭</span>
                                <span class="gear-col-label">接尾</span>
                            </div>
                            <div class="gear-grid" v-for="row in gearRows" :key="row.label">
                                <span class="gear-slot-label">{{ row.label }}</span>
                                <el-select v-model="selects[row.prefix as SelectKey]" size="small" class="gear-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS[row.prefix]"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                                <el-select v-model="selects[row.suffix as SelectKey]" size="small" class="gear-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS[row.suffix]"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="才能/稱號/農場" name="title">
                        <div class="tab-body">
                            <div class="field-row">
                                <el-switch v-model="switches.master" />
                                <span class="switch-label">開啓一代宗師吟遊詩人效果</span>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="switches.arcana" />
                                <span class="switch-label">開啓聖詠者同步效果</span>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="switches.farmTool" />
                                <span class="switch-label">寵物小屋:雲朵坐墊 (4階段)</span>
                            </div>
                            <div class="field-row" v-for="field in talentTitleFarmFields" :key="field.key">
                                <label class="field-label">{{ field.label }}</label>
                                <el-select v-model="selects[field.key as SelectKey]" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS[field.key]"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="很貴的項目" name="set">
                        <div class="tab-body">
                            <div class="field-row">
                                <el-switch v-model="switches.couple" />
                                <span class="switch-label">玫瑰情侶手鍊 / 水晶婚戒</span>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="switches.silkWing" />
                                <span class="switch-label">特別的優雅絲緞翅膀</span>
                            </div>
                            <!-- 套裝強化（放在草冠上面）：互斥（戰場只取最高）→ select；其餘 → 開關 -->
                            <div
                                v-if="activeSong.enhanceExclusive && (activeSong.enhanceItems ?? []).length"
                                class="field-row"
                            >
                                <label class="field-label">套裝強化-{{ activeSong.name }}</label>
                                <el-select
                                    :model-value="enhanceSelectedId"
                                    size="small"
                                    class="field-select"
                                    @update:model-value="setEnhanceExclusive"
                                >
                                    <el-option label="無" value="none" />
                                    <el-option
                                        v-for="item in activeSong.enhanceItems"
                                        :key="item.id"
                                        :label="item.label"
                                        :value="item.id"
                                    />
                                </el-select>
                            </div>
                            <template v-else>
                                <div v-for="item in activeSong.enhanceItems ?? []" :key="item.id" class="field-row">
                                    <el-switch
                                        :model-value="songEnhance[item.id] ?? false"
                                        @update:model-value="(v: boolean) => (songEnhance[item.id] = !!v)"
                                    />
                                    <span class="switch-label">套裝強化：{{ item.label }}</span>
                                    <span v-if="item.slot === 'head'" class="field-hint">與草冠同部位（頭），擇一</span>
                                </div>
                            </template>
                            <div class="field-row" v-for="field in expensiveItemFields" :key="field.key">
                                <label class="field-label">{{ field.label }}</label>
                                <el-select v-model="selects[field.key as SelectKey]" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS[field.key]"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <el-checkbox v-model="noCoin">無硬幣</el-checkbox>
                            </div>
                            <div class="field-row">
                                <label class="field-label">布里萊赫硬幣</label>
                                <el-select v-model="totem" :disabled="noCoin" size="small" style="width: 130px">
                                    <el-option
                                        v-for="value in totemOptions"
                                        :key="value"
                                        :label="value.toFixed(1)"
                                        :value="value"
                                    />
                                </el-select>
                                <span class="field-hint">%</span>
                            </div>
                            <div class="subsection-label">月餅賦予數量</div>
                            <div class="field-row">
                                <label class="field-label">月餅接頭-單純的</label>
                                <el-select v-model="relicPrefixCount" size="small" class="field-select">
                                    <el-option
                                        v-for="count in relicCountOptions"
                                        :key="count"
                                        :label="`${count}`"
                                        :value="count"
                                    />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">月餅接尾-禮物</label>
                                <el-select v-model="relicSuffixCount" size="small" class="field-select">
                                    <el-option
                                        v-for="count in relicCountOptions"
                                        :key="count"
                                        :label="`${count}`"
                                        :value="count"
                                    />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 雜項 -->
                    <el-tab-pane label="雜項" name="misc">
                        <div class="tab-body">
                            <div class="field-desc">
                                各色精靈龍對應音樂：紅炎→戰場的序曲、蒼冰→活潑板、翠草→豐年歌（進行・忍耐無對應龍）。
                                <br />
                                對應龍：該歌主詞條 +base×2% 且音樂效果 +3；非對應龍：只 +3 音樂效果；無：無加成。
                            </div>
                            <div class="field-row">
                                <label class="field-label">寵物</label>
                                <el-select v-model="selects.fairyDragon" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.fairyDragon"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                        :disabled="OPTIONS.fairyDragon[idx].value === 'match' && !activeSong.dragonColor"
                                    />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="switches.astro" />
                                <span class="switch-label">戀人卡</span>
                            </div>
                            <div class="field-row">
                                <el-switch v-model="switches.potion" />
                                <span class="switch-label">音樂強化藥水</span>
                            </div>
                            <div class="field-row">
                                <label class="field-label">娃娃背包</label>
                                <el-select v-model="selects.doll" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.doll"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                            <div class="field-row">
                                <label class="field-label">喇叭</label>
                                <el-select v-model="selects.bugle" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS.bugle"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                            <!-- 其他項目固定放在雜項最下方 -->
                            <div class="field-row">
                                <label class="field-label">其他項目</label>
                                <el-input-number
                                    v-model="otherBonus"
                                    :min="0"
                                    :max="20"
                                    :step="1"
                                    :precision="0"
                                    size="small"
                                    style="width: 130px"
                                />
                                <span class="field-hint">音樂效果 +N（例：活動加成）</span>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 技能（移到最後）-->
                    <el-tab-pane label="技能" name="skill">
                        <div class="tab-body">
                            <!-- 當前歌曲：技能等級 -->
                            <div class="field-section-label">{{ activeSong.name }}（當前歌曲）</div>
                            <div class="field-row">
                                <label class="field-label">技能等級</label>
                                <el-select v-model="songRankIdx" size="small" class="field-select">
                                    <el-option
                                        v-for="(rank, idx) in activeSong.ranks"
                                        :key="idx"
                                        :label="`Rank ${rank}`"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>

                            <div class="field-section-label">通用音樂技能</div>
                            <div class="field-row" v-for="field in skillFields" :key="field.key">
                                <label class="field-label">{{ field.label }}</label>
                                <el-select v-model="selects[field.key as SelectKey]" size="small" class="field-select">
                                    <el-option
                                        v-for="(opt, idx) in OPTIONS[field.key]"
                                        :key="idx"
                                        :label="opt.label"
                                        :value="idx"
                                    />
                                </el-select>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 提升效益分析 -->
                    <el-tab-pane label="提升效益分析" name="analysis">
                        <div class="tab-body">
                            <div class="analysis-grades">
                                <el-checkbox v-model="analysisGrades.inspiring">顯示天籟演奏</el-checkbox>
                                <el-checkbox v-model="analysisGrades.excellent">顯示優秀演奏</el-checkbox>
                                <el-checkbox v-model="analysisGrades.normal">顯示普通演奏</el-checkbox>
                                <el-checkbox v-model="showPerStep">顯示每級/數值提升</el-checkbox>
                                <el-checkbox v-model="showOtherItems">顯示其他項目</el-checkbox>
                            </div>
                            <p class="analysis-hint">
                                列出「開關未開」與「下拉未選到頂」的項目；提升 =
                                將該項目單獨從目前狀態拉到最高的邊際增益。
                                勾選只是「模擬」不會動到設定，可自由勾／取消；要實際套用請按下方按鈕。
                            </p>
                            <table class="analysis-table">
                                <thead>
                                    <tr>
                                        <th class="ana-apply">選取</th>
                                        <th class="ana-name-h">項目</th>
                                        <th class="ana-diff-h">差異</th>
                                        <th v-if="analysisGrades.inspiring" class="ana-gain-h col-inspiring">
                                            天籟提昇
                                        </th>
                                        <th v-if="analysisGrades.excellent" class="ana-gain-h col-excellent">
                                            優秀提昇
                                        </th>
                                        <th v-if="analysisGrades.normal" class="ana-gain-h col-normal">普通提昇</th>
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
                                        <td v-if="analysisGrades.inspiring" class="ana-gain col-inspiring">
                                            +{{ item.dI.toFixed(2) }}%
                                            <span v-if="showPerStep && item.steps > 1" class="ana-perstep">
                                                {{ (item.dI / item.steps).toFixed(3) }}/{{ item.stepUnit }}
                                            </span>
                                        </td>
                                        <td v-if="analysisGrades.excellent" class="ana-gain col-excellent">
                                            +{{ item.dE.toFixed(2) }}%
                                            <span v-if="showPerStep && item.steps > 1" class="ana-perstep">
                                                {{ (item.dE / item.steps).toFixed(3) }}/{{ item.stepUnit }}
                                            </span>
                                        </td>
                                        <td v-if="analysisGrades.normal" class="ana-gain col-normal">
                                            +{{ item.dN.toFixed(2) }}%
                                            <span v-if="showPerStep && item.steps > 1" class="ana-perstep">
                                                {{ (item.dN / item.steps).toFixed(3) }}/{{ item.stepUnit }}
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
                                    <div v-if="analysisGrades.inspiring" class="ana-proj-cell col-inspiring">
                                        天籟 {{ fmt(projection.inspiring) }}%
                                        <span class="ana-proj-delta">(+{{ projection.dI.toFixed(2) }})</span>
                                    </div>
                                    <div v-if="analysisGrades.excellent" class="ana-proj-cell col-excellent">
                                        優秀 {{ fmt(projection.excellent) }}%
                                        <span class="ana-proj-delta">(+{{ projection.dE.toFixed(2) }})</span>
                                    </div>
                                    <div v-if="analysisGrades.normal" class="ana-proj-cell col-normal">
                                        普通 {{ fmt(projection.normal) }}%
                                        <span class="ana-proj-delta">(+{{ projection.dN.toFixed(2) }})</span>
                                    </div>
                                </div>
                                <p class="ana-proj-note">
                                    註：單列的提升是各自單獨計算，因乘算交互作用，總提升不等於各列相加。
                                </p>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <!-- ── Debug — 詞條分類明細 ── -->
                <el-card class="preset-card debug-card">
                    <div class="preset-head" :class="{ open: showDebug }" @click="showDebug = !showDebug">
                        <span class="preset-head-title">🐞 Debug — 詞條分類明細</span>
                        <span
                            class="preset-head-chevron"
                            :style="{ transform: showDebug ? 'rotate(180deg)' : 'rotate(0deg)' }"
                        >
                            ▼
                        </span>
                    </div>

                    <template v-if="showDebug">
                        <div class="debug-line muted">
                            歌曲：
                            <b>{{ debug.songName }}</b>
                            　主詞條：
                            <b>{{ debug.primaryName }}</b>
                            　Rank {{ debug.rankLabel }}
                        </div>
                        <!-- 音樂加成總和 -->
                        <div class="debug-section">演奏加成總和（%）</div>
                        <table class="debug-table">
                            <tbody>
                                <tr v-for="g in debug.groups" :key="g.name">
                                    <td class="dbg-cat">{{ g.name }}</td>
                                    <td class="dbg-total">+{{ g.total }}</td>
                                    <td class="dbg-items">{{ g.items.map((i) => i.label).join("、") || "—" }}</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">開關</td>
                                    <td class="dbg-total">+{{ debug.switchBuff }}</td>
                                    <td class="dbg-items">
                                        {{ debug.switchItems.map((i) => `${i.label}(+${i.value})`).join("、") || "—" }}
                                    </td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">精靈龍（基礎）</td>
                                    <td class="dbg-total">+{{ debug.fairyDragonBase }}</td>
                                    <td class="dbg-items">{{ debug.fairyLabel }}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="debug-line">
                            演奏 playBuff =
                            <b>{{ debug.playBuff }}</b>
                            %
                        </div>
                        <div class="debug-line">basePlay = {{ debug.basePlay.toFixed(3) }}</div>

                        <!-- 主詞條 base（rank base + 技能細工）-->
                        <div class="debug-section">主詞條 base — {{ debug.primaryName }}</div>
                        <table class="debug-table">
                            <tbody>
                                <tr>
                                    <td class="dbg-cat">rank base（Rank {{ debug.rankLabel }}）</td>
                                    <td class="dbg-total">{{ debug.rankBase }}</td>
                                    <td class="dbg-items">{{ debug.primaryName }} 基礎值</td>
                                </tr>
                                <tr v-if="debug.reforgeAdd > 0">
                                    <td class="dbg-cat">技能細工</td>
                                    <td class="dbg-total">+{{ debug.reforgeAdd }}</td>
                                    <td class="dbg-items">部位 × 效果加總</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat"><b>base 合計</b></td>
                                    <td class="dbg-total"><b>{{ debug.battle.toFixed(2) }}</b></td>
                                    <td class="dbg-items">rank base + 技能細工</td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- 評級倍率：只有吃額外的攻擊詞條才套用 = battle × extra -->
                        <div class="debug-section">評級倍率（里拉 / SR / 硬幣 / 禮物）</div>
                        <table v-if="debug.primaryAppliesExtra" class="debug-table">
                            <tbody>
                                <tr>
                                    <td class="dbg-cat">{{ debug.primaryName }} (base)</td>
                                    <td class="dbg-total">{{ debug.battle.toFixed(2) }}</td>
                                    <td class="dbg-items">×1.0</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">里拉</td>
                                    <td class="dbg-total">+{{ (debug.battle * debug.rating).toFixed(2) }}</td>
                                    <td class="dbg-items">base × {{ (debug.rating * 100).toFixed(1) }}%</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">SR 特改</td>
                                    <td class="dbg-total">+{{ (debug.battle * debug.su).toFixed(2) }}</td>
                                    <td class="dbg-items">base × {{ (debug.su * 100).toFixed(1) }}%</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">硬幣</td>
                                    <td class="dbg-total">+{{ (debug.battle * debug.totemValue).toFixed(2) }}</td>
                                    <td class="dbg-items">base × {{ (debug.totemValue * 100).toFixed(2) }}%</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">禮物</td>
                                    <td class="dbg-total">+{{ (debug.battle * debug.relicRate).toFixed(2) }}</td>
                                    <td class="dbg-items">base × {{ (debug.relicRate * 100).toFixed(2) }}%</td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat"><b>合計 (base + 評級)</b></td>
                                    <td class="dbg-total"><b>{{ (debug.battle * debug.extra).toFixed(2) }}</b></td>
                                    <td class="dbg-items">= base × extra ({{ debug.extra }})</td>
                                </tr>
                            </tbody>
                        </table>
                        <div v-else class="debug-line muted">
                            {{ debug.primaryName }} 不吃評級效果（extra = 1）；最終值 = basePlay × 細工倍率。
                        </div>

                        <!-- 細工倍率 -->
                        <div class="debug-section">細工倍率（演奏）</div>
                        <table class="debug-table">
                            <tbody>
                                <tr>
                                    <td class="dbg-cat">普通</td>
                                    <td class="dbg-total">{{ debug.mult.normalPlay.toFixed(2) }}</td>
                                    <td class="dbg-items"></td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">優秀</td>
                                    <td class="dbg-total">{{ debug.mult.excellentPlay.toFixed(2) }}</td>
                                    <td class="dbg-items"></td>
                                </tr>
                                <tr>
                                    <td class="dbg-cat">天籟</td>
                                    <td class="dbg-total">{{ debug.mult.inspiringPlay.toFixed(2) }}</td>
                                    <td class="dbg-items"></td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- 最終 % 加成 -->
                        <div class="debug-section">最終 % 加成 / 乘數</div>
                        <div class="debug-line">
                            硬幣 {{ (debug.totemValue * 100).toFixed(2) }}% + 遺物禮物
                            {{ (debug.relicRate * 100).toFixed(2) }}% = finalRate
                            <b>{{ (debug.finalRate * 100).toFixed(2) }}%</b>
                        </div>
                        <div class="debug-line">
                            演奏乘數 extra =
                            <b>{{ debug.extra }}</b>
                            <span class="muted">
                                （里拉 {{ debug.rating }} + SR {{ debug.su }} + finalRate
                                {{ debug.finalRate.toFixed(4) }}）
                            </span>
                        </div>
                        <div class="debug-line">精靈龍演奏額外 +{{ debug.fairyDragonBuff.toFixed(2) }}</div>
                    </template>
                </el-card>
            </div>

            <!-- ════════ 右側 — 結果 ════════ -->
            <div class="dashboard-panel">
                <div v-for="o in resultOutputs" :key="o.name" class="result-card grade-inspiring">
                    <div class="result-card-header">
                        <span class="grade-name">{{ o.name }}</span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">天籟之音</span>
                        <span class="result-value">
                            {{ fmt(o.inspiring) }}
                            <span class="unit">%</span>
                        </span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">優秀</span>
                        <span class="result-value sub">
                            {{ fmt(o.excellent) }}
                            <span class="unit">%</span>
                        </span>
                    </div>
                    <div class="result-row">
                        <span class="result-label">普通</span>
                        <span class="result-value sub">
                            {{ fmt(o.normal) }}
                            <span class="unit">%</span>
                        </span>
                    </div>
                </div>

                <div class="util-copyrights">
                    演算法來源：
                    <a
                        href="https://ccroxx.blogspot.com/2019/07/mabinogi-battlefield-effect.html"
                        target="_blank"
                        rel="noopener"
                    >
                        ccroxx.blogspot.com
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.music-calc {
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

/* ── 儲存 / 讀取卡片 ── */
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
.preset-song-badge {
    flex-shrink: 0;
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.08);
    color: var(--color-text-secondary, #9ca3af);
    white-space: nowrap;
}
.preset-song-badge.is-current {
    background: var(--color-accent-primary, #fbbf24);
    color: #1f2937;
    font-weight: 600;
}
.preset-date {
    font-size: 0.7rem;
    color: var(--color-text-disabled, #6b7280);
    white-space: nowrap;
    flex-shrink: 0;
}

/* ── 歌曲 / 等級 選擇 ── */
.song-selector {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.75rem 0.85rem;
    background: var(--color-bg-secondary, #1f2937);
    border: 1px solid var(--color-accent-primary, #fbbf24);
    border-radius: 10px;
}

/* 分頁內的小節標題（區隔當前歌曲專屬 vs 通用欄位）*/
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

/* ── 快捷操作 ── */
.quick-actions {
    display: flex;
    gap: 0.5rem;
}

/* ── Debug ── */
.debug-card :deep(.el-card__body) {
    padding: 0.85rem 1rem;
}
.debug-section {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--color-accent-hover, #fcd34d);
    margin: 0.75rem 0 0.35rem;
}
.debug-section:first-of-type {
    margin-top: 0.5rem;
}
.debug-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.74rem;
}
.debug-table td {
    padding: 0.18rem 0.4rem;
    border-bottom: 1px solid var(--color-border-primary, #374151);
    vertical-align: top;
}
.dbg-cat {
    color: var(--color-text-secondary, #d1d5db);
    white-space: nowrap;
    width: 8.5rem;
}
.dbg-total {
    color: var(--color-accent-primary, #fbbf24);
    font-family: var(--font-family-mono, monospace);
    text-align: right;
    white-space: nowrap;
    width: 3rem;
}
.dbg-items {
    color: var(--color-text-muted, #9ca3af);
    word-break: break-all;
}
.debug-line {
    font-size: 0.76rem;
    color: var(--color-text-secondary, #d1d5db);
    margin-top: 0.35rem;
    line-height: 1.5;
}
.debug-line b {
    color: var(--color-accent-hover, #fcd34d);
    font-family: var(--font-family-mono, monospace);
}
.debug-line.muted,
.debug-line .muted {
    color: var(--color-text-disabled, #6b7280);
    font-size: 0.72rem;
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
.subsection-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--color-accent-hover, #fcd34d);
    margin: 0.4rem 0 0.1rem 0;
}

.field-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
}
.field-row.column {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.35rem;
}
.field-select {
    width: 260px;
    max-width: 100%;
    flex-shrink: 0;
}
.field-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    width: 150px;
    flex-shrink: 0;
    line-height: 1.3;
}
.field-hint {
    font-size: 0.78rem;
    color: var(--color-text-muted, #9ca3af);
}
.field-desc {
    font-size: 0.78rem;
    line-height: 1.4;
    color: var(--color-text-muted, #9ca3af);
    background: rgba(255, 255, 255, 0.04);
    border-left: 2px solid var(--color-accent-primary, #fbbf24);
    border-radius: 4px;
    padding: 0.4rem 0.6rem;
    margin-bottom: 0.5rem;
}
.switch-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
}

/* ── 裝備 grid（部位 | 接頭 | 接尾）── */
.gear-grid {
    display: grid;
    grid-template-columns: 48px 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
}
.reforge-grid {
    display: grid;
    grid-template-columns: 48px 1fr 1fr 1fr;
    align-items: center;
    gap: 0.5rem;
}
.gear-head,
.reforge-head {
    margin-bottom: 0.1rem;
}
.reforge-col-label {
    font-size: 0.9rem;
    font-weight: 700;
    text-align: center;
    letter-spacing: 0.03em;
    line-height: 1.15;
    word-break: break-word;
}
.reforge-corner {
    font-size: 0.7rem;
    color: var(--color-text-disabled, #6b7280);
    white-space: nowrap;
}
.col-normal {
    color: #e5e7eb;
}
.col-excellent {
    color: #7dd3fc;
}
.col-inspiring {
    color: var(--color-accent-hover, #fcd34d);
}
.gear-col-label {
    font-size: 0.92rem;
    font-weight: 700;
    text-align: center;
    color: var(--color-accent-primary, #fbbf24);
    letter-spacing: 0.08em;
}
.gear-slot-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    white-space: nowrap;
}
.gear-select {
    width: 100%;
}

/* ── 提升效益分析 ── */
.analysis-grades {
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
.ana-gain.col-inspiring,
.ana-gain-h.col-inspiring {
    color: var(--color-accent-hover, #fcd34d);
}
.ana-gain.col-excellent,
.ana-gain-h.col-excellent {
    color: #7dd3fc;
}
.ana-gain.col-normal,
.ana-gain-h.col-normal {
    color: #e5e7eb;
}
.ana-perstep {
    display: block;
    font-size: 0.68rem;
    font-weight: 400;
    color: var(--color-text-muted, #9ca3af);
    margin-top: 0.05rem;
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
.ana-proj-cell.col-inspiring {
    color: var(--color-accent-hover, #fcd34d);
}
.ana-proj-cell.col-excellent {
    color: #7dd3fc;
}
.ana-proj-cell.col-normal {
    color: #e5e7eb;
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
}
.result-label {
    font-size: 0.85rem;
    color: var(--color-text-muted, #9ca3af);
}
.result-value {
    font-size: 1.6rem;
    font-weight: 700;
    font-family: var(--font-family-mono, monospace);
    color: var(--color-text-primary, #f9fafb);
}
.grade-excellent .result-value {
    color: #7dd3fc;
}
.grade-inspiring .result-value {
    color: var(--color-accent-hover, #fcd34d);
}
.result-value.sub {
    font-size: 1.15rem;
    font-weight: 600;
    color: var(--color-text-secondary, #9ca3af);
}
.unit {
    font-size: 0.9rem;
    font-weight: 400;
    margin-left: 0.15rem;
    color: var(--color-text-muted, #9ca3af);
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

/* 響應式 */
@media (max-width: 900px) {
    .sim-layout {
        grid-template-columns: 1fr;
    }
    .dashboard-panel {
        position: static;
    }
}
</style>
