<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";
import {
    tradeVehicles,
    tradeCities,
    tradeSkillRanks,
    tradePetBonuses,
    tradeAffectionBonuses,
    lifeTradeLocations,
    lifeTradeLevelStats,
    lifeTradeMaterialCategories,
    skahaGoods,
    type TradeVehicle,
    type TradeGood,
    type TradeCity,
    type SkahaGood,
    type LifeTradeItem,
} from "../data/tradeGoods";

const baseUrl = import.meta.env.BASE_URL;
const iconSrc = (icon: string) => `${baseUrl}tradeImage/${icon}.png`;

interface TradeSettings {
    skillRank: string;
    hasTitle: boolean;
    hasAlpaca: boolean;
    partner: "none" | "william" | "lolo";
    affection: number;
    petBonus: number;
    petHarmony: number;
    eventBonus: number;
    hasBalloon: boolean;
    hasWeightVoucher: boolean;
    hasSlotVoucher: boolean;
    vehicles: Record<string, boolean>;
    vehiclePrinciple: "maxQty" | "efficiency";
}

// 飛行帆船僅商團貿易使用（克拉／比路里亞／科爾／巴雷斯），不列入個人貿易／生活貿易的一般載具
const toggleableVehicles = tradeVehicles.filter(
    (v) => v.toggleable && v.name !== "羊駝+馬車" && v.name !== "飛行帆船",
);

const settings = useLocalStorage<TradeSettings>("trade-calculator-settings", {
    skillRank: "沒有",
    hasTitle: false,
    hasAlpaca: true,
    partner: "none",
    affection: 0,
    petBonus: 0,
    petHarmony: 0,
    eventBonus: 0,
    hasBalloon: false,
    hasWeightVoucher: false,
    hasSlotVoucher: false,
    vehicles: Object.fromEntries(toggleableVehicles.map((v) => [v.name, true])),
    vehiclePrinciple: "maxQty",
});

// 個人貿易（羊駝／夥伴＋交通工具馱運）、商團貿易（商團馬車配送）與生活貿易（材料兌換）是三套不同機制，分開呈現
const mode = ref<"personal" | "guild" | "life" | "skaha" | "lifeMaterials">("life");

const personalCities = computed(() =>
    tradeCities.map((city) => ({ ...city, goods: city.goods.filter((g) => !g.guild) })),
);
const guildCities = computed(() =>
    tradeCities
        .map((city) => ({ ...city, goods: city.goods.filter((g) => g.guild) }))
        .filter((city) => city.goods.length > 0),
);

const activeCity = ref(personalCities.value[0].name);
const activeGuildCity = ref(guildCities.value[0]?.name ?? "");
const visibleLifeLocations = ref<Record<string, boolean>>(
    Object.fromEntries(lifeTradeLocations.map((l) => [l.name, true])),
);
const visibleLifeLocationsList = computed(() =>
    lifeTradeLocations.filter((loc) => visibleLifeLocations.value[loc.name] !== false),
);
const prices = ref<Record<string, number>>({});
const openSettings = ref(["settings"]);
const openLifeSelection = ref(["select"]);
const openLifeTotals = ref(["totals"]);

// 以名稱而非等級組 key：高難度商品同一地點內共用等級 6，等級無法唯一識別
function itemKey(location: string, name: string) {
    return `${location}-${name}`;
}

const flatLifeItems = lifeTradeLocations.flatMap((loc) =>
    loc.items.map((item) => ({ ...item, location: loc.name, key: itemKey(loc.name, item.name) })),
);
type FlatLifeItem = (typeof flatLifeItems)[number];

// 每個地點可輪替的高難度商品清單（每地點同時間只會開放其中一種，隨週次輪替）
const hardItemsByLocation: Record<string, LifeTradeItem[]> = Object.fromEntries(
    lifeTradeLocations.map((loc) => [loc.name, loc.items.filter((i) => i.hard)]),
);

// 每個地點目前選定的「本週高難度商品」名稱；空字串表示未設定（不顯示）
const activeHardItem = ref<Record<string, string>>(
    Object.fromEntries(lifeTradeLocations.map((loc) => [loc.name, ""])),
);

function isActiveHardItem(item: { location: string; name: string; hard?: boolean }) {
    return !item.hard || activeHardItem.value[item.location] === item.name;
}

function priceKey(city: TradeCity, good: TradeGood) {
    return `${city.name}-${good.name}`;
}

// 交易精通等級為基礎利潤率；未學習時視為 0（無利潤加成）
const skillValue = computed(
    () => tradeSkillRanks.find((r) => r.label === settings.value.skillRank)?.value ?? 0,
);

const mag = computed(() => {
    if (skillValue.value === 0) return 0;
    let m =
        skillValue.value +
        settings.value.affection +
        settings.value.petBonus +
        (Number(settings.value.petHarmony) || 0) / 100 +
        (Number(settings.value.eventBonus) || 0) / 100;
    m = Number(m.toFixed(4));
    return settings.value.hasBalloon ? m * 2 : m;
});

// solo：羊駝＋馬車／飛行帆船；partner：可搭配威廉／蘿莉的載具
const load = computed(() => {
    const solo: [number, number] = [0, 0];
    const partner: [number, number] = [0, 0];
    if (settings.value.hasTitle) {
        solo[0] += 100;
        solo[1] += 1;
        partner[0] += 100;
        partner[1] += 1;
    }
    if (settings.value.partner === "william") {
        partner[0] += 200;
        partner[1] += 1;
    } else if (settings.value.partner === "lolo") {
        partner[0] += 100;
        partner[1] += 1;
    }
    if (settings.value.hasWeightVoucher) {
        solo[0] += 100;
        partner[0] += 100;
    }
    if (settings.value.hasSlotVoucher) {
        solo[1] += 1;
        partner[1] += 1;
    }
    return { solo, partner };
});

const visibleVehicles = computed(() =>
    tradeVehicles.filter((v) => {
        if (v.name === "飛行帆船") return false;
        if (v.name === "羊駝+馬車") return settings.value.hasAlpaca;
        if (!v.toggleable) return true;
        return settings.value.vehicles[v.name] !== false;
    }),
);

function capacityOf(vehicle: TradeVehicle) {
    const [w, s] = vehicle.track === "solo" ? load.value.solo : load.value.partner;
    return { weight: vehicle.weight + w, slots: vehicle.slots + s };
}

function qtyOf(good: TradeGood, vehicle: TradeVehicle) {
    const cap = capacityOf(vehicle);
    let qty = Math.floor(cap.weight / good.weight);
    if (qty / good.stackSize > cap.slots) qty = cap.slots * good.stackSize;
    return qty;
}

function profitOf(city: TradeCity, good: TradeGood, vehicle: TradeVehicle) {
    const price = Number(prices.value[priceKey(city, good)]) || 0;
    return Math.floor(price * qtyOf(good, vehicle) * mag.value);
}

function bestVehicleNames(good: TradeGood): Set<string> {
    const withQty = visibleVehicles.value.map((v) => ({ v, qty: qtyOf(good, v) }));
    let candidates = withQty;
    if (settings.value.vehiclePrinciple === "efficiency") {
        // 效率＝利潤÷所需時間；同一商品下價格/加成係數為固定常數，等同比較「載貨量×速度」
        const scores = withQty.map((x) => x.qty * x.v.speed);
        const maxScore = scores.length ? Math.max(...scores) : 0;
        candidates = withQty.filter((_, i) => scores[i] === maxScore);
    } else {
        const maxQty = withQty.length ? Math.max(...withQty.map((x) => x.qty)) : 0;
        candidates = withQty.filter((x) => x.qty === maxQty);
        const maxSpeed = candidates.length ? Math.max(...candidates.map((x) => x.v.speed)) : 0;
        candidates = candidates.filter((x) => x.v.speed === maxSpeed);
    }
    return new Set(candidates.map((x) => x.v.name));
}

// ===== 商團貿易：飛行帆船配送 =====
const flyingBoat = tradeVehicles.find((v) => v.name === "飛行帆船")!;

const flyingBoatCapacity = computed(() => capacityOf(flyingBoat));

function guildQtyOf(good: TradeGood) {
    return qtyOf(good, flyingBoat);
}

const guildPrices = ref<Record<string, number>>({});

function guildPriceKey(city: TradeCity, good: TradeGood) {
    return `${city.name}-${good.name}`;
}

function guildValueOf(city: TradeCity, good: TradeGood) {
    const price = Number(guildPrices.value[guildPriceKey(city, good)]) || 0;
    return Math.floor(price * guildQtyOf(good));
}

// ===== 生活貿易材料計算 =====
// key -> 欲兌換次數；0／未設定視為未勾選
const lifeItemCounts = ref<Record<string, number>>({});
const lifeMaxQtyMode = ref(false);

function isLifeItemChecked(key: string) {
    return (lifeItemCounts.value[key] ?? 0) > 0;
}

function setLifeItemChecked(key: string, checked: boolean, level: number) {
    if (!checked) {
        lifeItemCounts.value[key] = 0;
        return;
    }
    lifeItemCounts.value[key] = lifeMaxQtyMode.value ? lifeTradeLevelStats[level].weeklyLimit : 1;
}

function toggleLifeItem(location: string, name: string, level: number) {
    const key = itemKey(location, name);
    setLifeItemChecked(key, !isLifeItemChecked(key), level);
}

// 資料裡的材料數量是「做滿每週兌換上限」所需的總量，換算單次需求要除以週上限
function perUnitQty(rawQty: number, level: number) {
    return rawQty / lifeTradeLevelStats[level].weeklyLimit;
}

// 卡片上顯示的材料數量：依目前選擇的兌換次數等比例換算；未勾選時以 1 次為預設參考值
function displayReqQty(rawQty: number, level: number, key: string) {
    const count = lifeItemCounts.value[key] || 1;
    return perUnitQty(rawQty, level) * count;
}

const showLifeCategory = ref(true);

// 開啟「數量全最大」時，已勾選項目立即補滿到每週兌換上限
watch(lifeMaxQtyMode, (enabled) => {
    if (!enabled) return;
    for (const item of flatLifeItems) {
        if ((lifeItemCounts.value[item.key] ?? 0) > 0) {
            lifeItemCounts.value[item.key] = lifeTradeLevelStats[item.level].weeklyLimit;
        }
    }
});

const selectedLifeCount = computed(
    () => Object.values(lifeItemCounts.value).filter((n) => n > 0).length,
);

// 全選只作用於目前「顯示地點」勾選中、且為本週已選定的高難度商品（或非高難度商品）
const visibleFlatLifeItems = computed(() =>
    flatLifeItems.filter(
        (item) => visibleLifeLocations.value[item.location] !== false && isActiveHardItem(item),
    ),
);

const allLifeItemsSelected = computed(
    () =>
        visibleFlatLifeItems.value.length > 0 &&
        visibleFlatLifeItems.value.every((item) => isLifeItemChecked(item.key)),
);

const someLifeItemsSelected = computed(
    () => !allLifeItemsSelected.value && visibleFlatLifeItems.value.some((item) => isLifeItemChecked(item.key)),
);

function toggleSelectAllLifeItems(checked: boolean) {
    for (const item of visibleFlatLifeItems.value) {
        setLifeItemChecked(item.key, checked, item.level);
    }
}

const lifeMaterialCategoryOrder = [
    "冶煉", "魔法製造", "希里原工學", "木工", "料理/食物",
    "藥水製作", "手工藝", "紡織", "芬恩手工藝", "文具的手工藝", "農場物產", "其他",
];

const lifeTotalGroupMode = ref<"location" | "category">("category");

const lifeMaterialTotals = computed(() => {
    const selected = flatLifeItems.filter((item) => (lifeItemCounts.value[item.key] ?? 0) > 0);

    if (lifeTotalGroupMode.value === "location") {
        const byLocation: Record<string, Record<string, number>> = {};
        for (const item of selected) {
            const count = lifeItemCounts.value[item.key] ?? 0;
            const bucket = (byLocation[item.location] ??= {});
            for (const req of item.requirements) {
                bucket[req.name] = (bucket[req.name] ?? 0) + perUnitQty(req.qty, item.level) * count;
            }
        }
        return lifeTradeLocations
            .filter((loc) => byLocation[loc.name])
            .map((loc) => ({
                group: loc.name,
                items: Object.entries(byLocation[loc.name])
                    .map(([name, qty]) => ({ name, qty }))
                    .sort((a, b) => b.qty - a.qty),
            }));
    }

    const totals: Record<string, number> = {};
    for (const item of selected) {
        const count = lifeItemCounts.value[item.key] ?? 0;
        for (const req of item.requirements) {
            totals[req.name] = (totals[req.name] ?? 0) + perUnitQty(req.qty, item.level) * count;
        }
    }
    const byCategory: Record<string, { name: string; qty: number }[]> = {};
    for (const [name, qty] of Object.entries(totals)) {
        const category = lifeTradeMaterialCategories[name] ?? "其他";
        (byCategory[category] ??= []).push({ name, qty });
    }
    for (const list of Object.values(byCategory)) {
        list.sort((a, b) => b.qty - a.qty);
    }
    return lifeMaterialCategoryOrder
        .filter((category) => byCategory[category]?.length)
        .map((category) => ({ group: category, items: byCategory[category] }));
});

function clearLifeSelection() {
    lifeItemCounts.value = {};
}

// ===== 生活貿易：城鎮收購比價 =====
// 生活貿易出發地不在 12 城鎮之中，換得的商品每座城鎮都可收購；實際可交易量上限取「載具容量」與「每週兌換上限」兩者較小值
function lifeQtyCap(level: number): number {
    const stats = lifeTradeLevelStats[level];
    if (!visibleVehicles.value.length) return 0;
    const vehicleQty = Math.max(
        ...visibleVehicles.value.map((v) => {
            const cap = capacityOf(v);
            let qty = Math.floor(cap.weight / stats.weight);
            if (qty / stats.stackSize > cap.slots) qty = cap.slots * stats.stackSize;
            return qty;
        }),
    );
    return Math.min(vehicleQty, stats.weeklyLimit);
}

// 顯示地點：篩選比價表要顯示哪些地點的商品欄位；預設只顯示佩拉
const pricingVisibleLocations = ref<Record<string, boolean>>(
    Object.fromEntries(lifeTradeLocations.map((l) => [l.name, l.name === "佩拉"])),
);
const pricingVisibleItems = computed(() =>
    flatLifeItems.filter(
        (item) => pricingVisibleLocations.value[item.location] !== false && isActiveHardItem(item),
    ),
);

// 項目可勾選：只有勾選的商品才會計入「總計」
const pricingSelected = ref<Record<string, boolean>>(
    Object.fromEntries(flatLifeItems.map((item) => [item.key, true])),
);

// 可交易數量可修改，但不能超過載具容量／每週兌換上限
const pricingQty = ref<Record<string, number>>(
    Object.fromEntries(flatLifeItems.map((item) => [item.key, lifeQtyCap(item.level)])),
);
const pricingMaxQtyMode = ref(false);

function pricingQtyOf(item: FlatLifeItem): number {
    return pricingQty.value[item.key] ?? lifeQtyCap(item.level);
}

watch(pricingMaxQtyMode, (enabled) => {
    if (!enabled) return;
    for (const item of flatLifeItems) {
        if (pricingSelected.value[item.key]) {
            pricingQty.value[item.key] = lifeQtyCap(item.level);
        }
    }
});

const lifePrices = ref<Record<string, number>>({});

function lifePriceKey(item: FlatLifeItem, cityName: string) {
    return `${item.key}-${cityName}`;
}

function lifeValueOf(item: FlatLifeItem, cityName: string): number {
    const price = Number(lifePrices.value[lifePriceKey(item, cityName)]) || 0;
    return Math.floor(price * pricingQtyOf(item));
}

function bestLifeCities(item: FlatLifeItem): Set<string> {
    const values = tradeCities.map((c) => lifeValueOf(item, c.name));
    const max = values.length ? Math.max(...values) : 0;
    const names = new Set<string>();
    if (max > 0) {
        tradeCities.forEach((c, i) => {
            if (values[i] === max) names.add(c.name);
        });
    }
    return names;
}

// 城鎮總計：加總該城鎮下所有「已勾選」商品的估值
function cityPricingTotal(cityName: string): number {
    return pricingVisibleItems.value
        .filter((item) => pricingSelected.value[item.key])
        .reduce((sum, item) => sum + lifeValueOf(item, cityName), 0);
}

const bestPricingCities = computed(() => {
    const values = tradeCities.map((c) => cityPricingTotal(c.name));
    const max = values.length ? Math.max(...values) : 0;
    const names = new Set<string>();
    if (max > 0) {
        tradeCities.forEach((c, i) => {
            if (values[i] === max) names.add(c.name);
        });
    }
    return names;
});

const showLifeBatch = ref(false);
const lifeBatchMode = ref<"single" | "multi">("multi");
const lifeBatchItemKey = ref("");
const lifeBatchText = ref("");

// 支援中文「萬」簡寫，例如 "16萬3486" -> 163486、"16萬" -> 160000
function parseTradeNumber(raw: string): number {
    const s = raw.trim();
    if (!s) return 0;
    const m = s.match(/^(-?\d+(?:\.\d+)?)萬(\d+)?$/);
    if (m) {
        return Math.round(parseFloat(m[1]) * 10000) + (m[2] ? parseInt(m[2], 10) : 0);
    }
    const n = Number(s.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
}

// 單項商品：每列對應一座城鎮（依 12 城鎮順序）的單一數值，套用到選定的商品
function applyLifeBatchSingle() {
    const item = pricingVisibleItems.value.find((i) => i.key === lifeBatchItemKey.value);
    if (!item) return;
    const lines = lifeBatchText.value.split("\n").map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, i) => {
        const city = tradeCities[i];
        if (!city) return;
        lifePrices.value[lifePriceKey(item, city.name)] = parseTradeNumber(line);
    });
}

// 多項商品（轉置後）：每列對應一座城鎮（依 12 城鎮順序），欄位依序對應目前顯示的商品
function applyLifeBatchMulti() {
    const lines = lifeBatchText.value.split("\n").map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, i) => {
        const city = tradeCities[i];
        if (!city) return;
        const cells = line.split(/\t+|\s{2,}/).map((c) => c.trim());
        pricingVisibleItems.value.forEach((item, j) => {
            const val = cells[j];
            if (val !== undefined && val !== "") {
                lifePrices.value[lifePriceKey(item, city.name)] = parseTradeNumber(val);
            }
        });
    });
}

function applyLifeBatch() {
    if (lifeBatchMode.value === "single") applyLifeBatchSingle();
    else applyLifeBatchMulti();
}

// ===== 斯卡哈貿易 =====
// 單一據點商品，沒有等級／每週上限概念，可交易數量僅取決於交通工具容量
function skahaQtyCap(good: SkahaGood): number {
    if (!visibleVehicles.value.length) return 0;
    return Math.max(...visibleVehicles.value.map((v) => qtyOf(good, v)));
}

const skahaSelected = ref<Record<string, boolean>>(
    Object.fromEntries(skahaGoods.map((g) => [g.name, true])),
);
const skahaQty = ref<Record<string, number>>(
    Object.fromEntries(skahaGoods.map((g) => [g.name, skahaQtyCap(g)])),
);

function skahaQtyOf(good: SkahaGood): number {
    return skahaQty.value[good.name] ?? skahaQtyCap(good);
}

const skahaPrices = ref<Record<string, number>>({});

function skahaPriceKey(good: SkahaGood, cityName: string) {
    return `${good.name}-${cityName}`;
}

function skahaValueOf(good: SkahaGood, cityName: string): number {
    const price = Number(skahaPrices.value[skahaPriceKey(good, cityName)]) || 0;
    return Math.floor(price * skahaQtyOf(good));
}

function bestSkahaCities(good: SkahaGood): Set<string> {
    const values = tradeCities.map((c) => skahaValueOf(good, c.name));
    const max = values.length ? Math.max(...values) : 0;
    const names = new Set<string>();
    if (max > 0) {
        tradeCities.forEach((c, i) => {
            if (values[i] === max) names.add(c.name);
        });
    }
    return names;
}

function citySkahaTotal(cityName: string): number {
    return skahaGoods
        .filter((g) => skahaSelected.value[g.name])
        .reduce((sum, g) => sum + skahaValueOf(g, cityName), 0);
}

const bestSkahaTotalCities = computed(() => {
    const values = tradeCities.map((c) => citySkahaTotal(c.name));
    const max = values.length ? Math.max(...values) : 0;
    const names = new Set<string>();
    if (max > 0) {
        tradeCities.forEach((c, i) => {
            if (values[i] === max) names.add(c.name);
        });
    }
    return names;
});

const showSkahaBatch = ref(false);
const skahaBatchMode = ref<"single" | "multi">("multi");
const skahaBatchItemName = ref("");
const skahaBatchText = ref("");

function applySkahaBatchSingle() {
    const good = skahaGoods.find((g) => g.name === skahaBatchItemName.value);
    if (!good) return;
    const lines = skahaBatchText.value.split("\n").map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, i) => {
        const city = tradeCities[i];
        if (!city) return;
        skahaPrices.value[skahaPriceKey(good, city.name)] = parseTradeNumber(line);
    });
}

function applySkahaBatchMulti() {
    const lines = skahaBatchText.value.split("\n").map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, i) => {
        const city = tradeCities[i];
        if (!city) return;
        const cells = line.split(/\t+|\s{2,}/).map((c) => c.trim());
        skahaGoods.forEach((good, j) => {
            const val = cells[j];
            if (val !== undefined && val !== "") {
                skahaPrices.value[skahaPriceKey(good, city.name)] = parseTradeNumber(val);
            }
        });
    });
}

function applySkahaBatch() {
    if (skahaBatchMode.value === "single") applySkahaBatchSingle();
    else applySkahaBatchMulti();
}
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-6xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    貿易計算機
                </h1>
                <p class="text-base text-gray-400 mt-3">輸入各城鎮商品單價，估算各交通工具的載貨量與貿易利潤</p>
            </header>

            <!-- 設定：獨立於個人／商團貿易切換之外，可摺疊 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl overflow-hidden">
                <el-collapse v-model="openSettings" class="settings-collapse">
                    <el-collapse-item name="settings">
                        <template #title>
                            <h2 class="text-xl font-bold text-accent px-1">設定</h2>
                        </template>
                        <div class="settings-grid px-1">
                            <div class="setting-row">
                                <span class="setting-label">交易精通 等級</span>
                                <el-select v-model="settings.skillRank" size="small" style="width: 110px">
                                    <el-option v-for="r in tradeSkillRanks" :key="r.label" :label="r.label" :value="r.label" />
                                </el-select>
                            </div>
                            <div class="setting-row">
                                <el-checkbox v-model="settings.hasTitle">一代宗師商人才能</el-checkbox>
                            </div>
                            <div class="setting-row">
                                <el-checkbox v-model="settings.hasAlpaca">羊駝</el-checkbox>
                            </div>

                            <div class="setting-row">
                                <span class="setting-label">貿易夥伴</span>
                                <el-radio-group v-model="settings.partner" size="small">
                                    <el-radio-button value="none">無</el-radio-button>
                                    <el-radio-button value="william">威廉</el-radio-button>
                                    <el-radio-button value="lolo">蘿莉</el-radio-button>
                                </el-radio-group>
                            </div>
                            <div class="setting-row">
                                <span class="setting-label">威廉好感度利潤增加</span>
                                <el-select
                                    v-model="settings.affection"
                                    size="small"
                                    style="width: 90px"
                                    :disabled="settings.partner !== 'william'"
                                >
                                    <el-option v-for="a in tradeAffectionBonuses" :key="a.label" :label="a.label" :value="a.value" />
                                </el-select>
                            </div>

                            <div class="setting-row">
                                <span class="setting-label">貿易保證書加成</span>
                                <el-select v-model="settings.petBonus" size="small" style="width: 170px">
                                    <el-option v-for="p in tradePetBonuses" :key="p.label" :label="p.label" :value="p.value" />
                                </el-select>
                            </div>
                            <div class="setting-row">
                                <span class="setting-label">寵物和聲 利潤增加</span>
                                <el-input-number v-model="settings.petHarmony" :min="0" :max="100" size="small" style="width: 110px" />
                                <span class="text-xs text-gray-500">%</span>
                            </div>
                            <div class="setting-row">
                                <span class="setting-label">活動 利潤增加</span>
                                <el-input-number v-model="settings.eventBonus" :min="0" :max="100" size="small" style="width: 110px" />
                                <span class="text-xs text-gray-500">%</span>
                            </div>
                            <div class="setting-row">
                                <el-checkbox v-model="settings.hasBalloon">發動效果的金牛座氣球</el-checkbox>
                            </div>
                            <div class="setting-row">
                                <el-checkbox v-model="settings.hasWeightVoucher">額外負重擴充券(+100負重)</el-checkbox>
                            </div>
                            <div class="setting-row">
                                <el-checkbox v-model="settings.hasSlotVoucher">額外格數擴充券(+1格)</el-checkbox>
                            </div>

                            <div class="setting-row wrap">
                                <span class="setting-label">貿易交通工具</span>
                                <el-checkbox v-for="v in toggleableVehicles" :key="v.name" v-model="settings.vehicles[v.name]">
                                    <img :src="iconSrc(v.icon)" :alt="v.name" class="inline-icon pixelated" />
                                    {{ v.name }}
                                </el-checkbox>
                            </div>
                            <div class="setting-row wrap">
                                <span class="setting-label">交通工具選擇原則</span>
                                <el-radio-group v-model="settings.vehiclePrinciple" size="small">
                                    <el-radio-button value="maxQty">最大載貨量（相同時比速度）</el-radio-button>
                                    <el-radio-button value="efficiency">最高效率（利潤÷所需時間）</el-radio-button>
                                </el-radio-group>
                            </div>
                        </div>
                        <p class="mt-3 px-1 text-xs text-gray-500">
                            利潤加成係數：{{ mag }}（未設定交易精通等級時不計算利潤，僅顯示載貨量；貿易夥伴／交通工具設定同時套用於個人貿易與生活貿易的載貨量計算，利潤加成係數僅適用於個人貿易）
                        </p>
                    </el-collapse-item>
                </el-collapse>
            </el-card>

            <el-tabs v-model="mode" type="border-card" class="mode-tabs">
                <el-tab-pane label="生活貿易" name="life">
                    <p class="text-sm text-gray-400 mb-4">
                        生活貿易的出發地不在下列 12 城鎮之中，換得的商品每座城鎮都可收購——與只能賣往「非出發地」的個人貿易不同。輸入各城鎮收購價即可比較利潤，支援批次貼上。
                    </p>
                    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                        <div class="setting-row wrap mb-2">
                            <span class="setting-label">顯示地點</span>
                            <el-checkbox v-for="loc in lifeTradeLocations" :key="loc.name" v-model="pricingVisibleLocations[loc.name]">
                                {{ loc.name }}
                            </el-checkbox>
                        </div>
                        <div class="setting-row mb-3">
                            <el-checkbox v-model="pricingMaxQtyMode">選定項目數量最大</el-checkbox>
                            <span class="text-xs text-gray-500">已勾選商品直接帶入最大可交易數量</span>
                        </div>
                        <div class="mb-3">
                            <p class="text-xs text-gray-500 mb-2">本週高難度商品（每地點同時僅開放一種，未設定則不顯示）</p>
                            <div class="hard-item-picker-row">
                                <span v-for="loc in lifeTradeLocations" :key="loc.name" class="hard-item-picker">
                                    <span class="text-xs text-gray-500">{{ loc.name }}</span>
                                    <el-select v-model="activeHardItem[loc.name]" size="small" clearable placeholder="未設定" style="width: 170px">
                                        <el-option v-for="hi in hardItemsByLocation[loc.name]" :key="hi.name" :label="hi.name" :value="hi.name" />
                                    </el-select>
                                </span>
                            </div>
                        </div>
                        <div class="mb-3">
                            <el-button size="small" plain @click="showLifeBatch = !showLifeBatch">
                                {{ showLifeBatch ? "收起批次輸入" : "批次輸入價格" }}
                            </el-button>
                        </div>
                        <div v-if="showLifeBatch" class="mb-4">
                            <el-radio-group v-model="lifeBatchMode" size="small" class="mb-2">
                                <el-radio-button value="single">單項商品</el-radio-button>
                                <el-radio-button value="multi">多項商品</el-radio-button>
                            </el-radio-group>

                            <template v-if="lifeBatchMode === 'single'">
                                <div class="mb-2">
                                    <el-select v-model="lifeBatchItemKey" placeholder="選擇商品" filterable style="width: 260px">
                                        <el-option
                                            v-for="item in pricingVisibleItems"
                                            :key="item.key"
                                            :label="`${item.hard ? '高難度' : 'LV' + item.level} ${item.name}（${item.location}）`"
                                            :value="item.key"
                                        />
                                    </el-select>
                                </div>
                                <p class="text-xs text-gray-500 mb-1">
                                    每列對應 12 座城鎮（堤爾克那～巴雷斯，依序由上至下）的單一數值，套用到上面選定的商品；支援「萬」簡寫，例如 16萬3486。
                                </p>
                            </template>
                            <template v-else>
                                <p class="text-xs text-gray-500 mb-1">
                                    每列對應 12 座城鎮（堤爾克那～巴雷斯，依序由上至下），欄位依序為下表由左至右目前顯示的商品，以 Tab 或連續空白分隔，可直接從試算表貼上；支援「萬」簡寫，例如 16萬3486。
                                </p>
                            </template>

                            <el-input
                                v-model="lifeBatchText"
                                type="textarea"
                                :rows="6"
                                placeholder="貼上價格表…"
                                class="life-batch-input"
                            />
                            <el-button
                                class="mt-2"
                                type="warning"
                                size="small"
                                :disabled="lifeBatchMode === 'single' && !lifeBatchItemKey"
                                @click="applyLifeBatch"
                            >
                                套用
                            </el-button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm trade-table">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-700 text-xs">
                                        <th class="text-left py-2 pr-3 font-normal">城鎮</th>
                                        <th
                                            v-for="item in pricingVisibleItems"
                                            :key="item.key"
                                            class="text-center py-2 px-2 font-normal whitespace-nowrap"
                                        >
                                            <el-checkbox v-model="pricingSelected[item.key]" />
                                            <img v-if="item.icon" :src="iconSrc(item.icon)" :alt="item.name" class="header-icon pixelated" />
                                            <div class="text-gray-200">
                                                <span class="life-level-badge mr-1" :class="{ 'life-level-badge-hard': item.hard }">
                                                    {{ item.hard ? "高難度" : `LV${item.level}` }}
                                                </span>{{ item.name }}
                                            </div>
                                            <div class="text-[10px] text-gray-500">（{{ item.location }}）</div>
                                            <el-input-number
                                                v-model="pricingQty[item.key]"
                                                :min="0"
                                                :max="lifeQtyCap(item.level)"
                                                size="small"
                                                style="width: 100px"
                                            />
                                            <div class="text-[10px] text-gray-500">上限 {{ lifeQtyCap(item.level) }}</div>
                                        </th>
                                        <th class="text-center py-2 px-2 font-normal">總計</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="city in tradeCities" :key="city.name" class="border-b border-gray-800/60">
                                        <th class="text-left py-2 pr-3 font-normal text-gray-200 whitespace-nowrap">
                                            {{ city.name }}
                                        </th>
                                        <td
                                            v-for="item in pricingVisibleItems"
                                            :key="item.key"
                                            class="text-center py-1 px-2"
                                            :class="bestLifeCities(item).has(city.name) ? 'bg-accent/10' : ''"
                                        >
                                            <el-input
                                                v-model="lifePrices[lifePriceKey(item, city.name)]"
                                                size="small"
                                                style="width: 90px"
                                                placeholder="單價"
                                                class="life-price-input"
                                            />
                                            <div v-if="lifeValueOf(item, city.name) > 0" class="text-[10px] opacity-70">
                                                {{ lifeValueOf(item, city.name).toLocaleString() }}
                                            </div>
                                        </td>
                                        <td
                                            class="text-center py-1 px-2 whitespace-nowrap"
                                            :class="bestPricingCities.has(city.name) ? 'bg-accent/20 text-accent font-semibold' : 'text-gray-300'"
                                        >
                                            {{ cityPricingTotal(city.name).toLocaleString() }} 杜卡
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-card>
                </el-tab-pane>

                <el-tab-pane label="個人貿易" name="personal">
                    <!-- 城鎮分頁 -->
            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <el-tabs v-model="activeCity" type="border-card" class="city-tabs personal-city-tabs">
                    <el-tab-pane v-for="city in personalCities" :key="city.name" :name="city.name">
                        <template #label>
                            <span class="flex items-center gap-1">
                                <img :src="iconSrc(city.icon)" :alt="city.name" class="inline-icon pixelated" />
                                {{ city.name }}
                            </span>
                        </template>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm trade-table">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-700 text-xs">
                                        <th class="text-left py-2 pr-3 font-normal">商品</th>
                                        <th class="text-left py-2 pr-3 font-normal">單價</th>
                                        <th
                                            v-for="v in visibleVehicles"
                                            :key="v.name"
                                            class="text-center py-2 px-2 font-normal whitespace-nowrap"
                                        >
                                            <img :src="iconSrc(v.icon)" :alt="v.name" class="header-icon pixelated" />
                                            <div>{{ v.name }}</div>
                                            <div class="text-[10px] text-gray-500 font-normal">
                                                負重{{ capacityOf(v).weight }}／{{ capacityOf(v).slots }}格
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr
                                        v-for="good in city.goods"
                                        :key="good.name"
                                        class="border-b border-gray-800/60"
                                    >
                                        <th class="text-left py-2 pr-3 font-normal text-gray-200 whitespace-nowrap">
                                            <span class="inline-flex items-center gap-1.5">
                                                <img :src="iconSrc(good.icon)" :alt="good.name" class="inline-icon pixelated" />
                                                {{ good.name }}
                                            </span>
                                        </th>
                                        <td class="py-2 pr-3">
                                            <el-input
                                                v-model="prices[priceKey(city, good)]"
                                                size="small"
                                                style="width: 90px"
                                                placeholder="單價"
                                            />
                                        </td>
                                        <td
                                            v-for="v in visibleVehicles"
                                            :key="v.name"
                                            class="text-center py-2 px-2 whitespace-nowrap"
                                            :class="bestVehicleNames(good).has(v.name) ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-300'"
                                        >
                                            {{ qtyOf(good, v) }} 個
                                            <div v-if="mag > 0" class="text-[10px] opacity-70">
                                                {{ profitOf(city, good, v).toLocaleString() }} 杜卡
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
                </el-tab-pane>

                <el-tab-pane label="商團貿易" name="guild">
                    <p class="text-sm text-gray-400 mb-4">
                        商團貿易統一使用飛行帆船配送，只往返克拉／比路里亞／科爾／巴雷斯這 4 座城鎮。輸入單價即可估算載運數量與收入。
                    </p>
                    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                        <el-tabs v-model="activeGuildCity" type="border-card" class="city-tabs">
                            <el-tab-pane v-for="city in guildCities" :key="city.name" :name="city.name">
                                <template #label>
                                    <span class="flex items-center gap-1">
                                        <img :src="iconSrc(city.icon)" :alt="city.name" class="inline-icon pixelated" />
                                        {{ city.name }}
                                    </span>
                                </template>
                                <table class="w-full text-sm trade-table">
                                    <thead>
                                        <tr class="text-gray-400 border-b border-gray-700 text-xs">
                                            <th class="text-left py-2 pr-3 font-normal">商品</th>
                                            <th class="text-left py-2 pr-3 font-normal">單價</th>
                                            <th class="text-center py-2 px-2 font-normal whitespace-nowrap">
                                                <img :src="iconSrc(flyingBoat.icon)" :alt="flyingBoat.name" class="header-icon pixelated" />
                                                <div>{{ flyingBoat.name }}</div>
                                                <div class="text-[10px] text-gray-500 font-normal">
                                                    負重{{ flyingBoatCapacity.weight }}／{{ flyingBoatCapacity.slots }}格
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="good in city.goods" :key="good.name" class="border-b border-gray-800/60">
                                            <th class="text-left py-2 pr-3 font-normal text-gray-200 whitespace-nowrap">
                                                <span class="inline-flex items-center gap-1.5">
                                                    <img :src="iconSrc(good.icon)" :alt="good.name" class="inline-icon pixelated" />
                                                    {{ good.name }}
                                                </span>
                                            </th>
                                            <td class="py-2 pr-3">
                                                <el-input
                                                    v-model="guildPrices[guildPriceKey(city, good)]"
                                                    size="small"
                                                    style="width: 90px"
                                                    placeholder="單價"
                                                />
                                            </td>
                                            <td class="text-center py-2 px-2 whitespace-nowrap text-gray-300">
                                                {{ guildQtyOf(good) }} 個
                                                <div v-if="guildValueOf(city, good) > 0" class="text-[10px] opacity-70">
                                                    {{ guildValueOf(city, good).toLocaleString() }} 杜卡
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </el-tab-pane>

                <el-tab-pane label="斯卡哈貿易" name="skaha">
                    <p class="text-sm text-gray-400 mb-4">
                        斯卡哈的商品每座城鎮都可收購，輸入各城鎮收購價即可比較利潤，支援批次貼上。
                    </p>
                    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                        <div class="mb-3">
                            <el-button size="small" plain @click="showSkahaBatch = !showSkahaBatch">
                                {{ showSkahaBatch ? "收起批次輸入" : "批次輸入價格" }}
                            </el-button>
                        </div>
                        <div v-if="showSkahaBatch" class="mb-4">
                            <el-radio-group v-model="skahaBatchMode" size="small" class="mb-2">
                                <el-radio-button value="single">單項商品</el-radio-button>
                                <el-radio-button value="multi">多項商品</el-radio-button>
                            </el-radio-group>

                            <template v-if="skahaBatchMode === 'single'">
                                <div class="mb-2">
                                    <el-select v-model="skahaBatchItemName" placeholder="選擇商品" filterable style="width: 200px">
                                        <el-option v-for="good in skahaGoods" :key="good.name" :label="good.name" :value="good.name" />
                                    </el-select>
                                </div>
                                <p class="text-xs text-gray-500 mb-1">
                                    每列對應 12 座城鎮（堤爾克那～巴雷斯，依序由上至下）的單一數值，套用到上面選定的商品；支援「萬」簡寫，例如 16萬3486。
                                </p>
                            </template>
                            <template v-else>
                                <p class="text-xs text-gray-500 mb-1">
                                    每列對應 12 座城鎮（堤爾克那～巴雷斯，依序由上至下），欄位依序為下表由左至右的商品，以 Tab 或連續空白分隔，可直接從試算表貼上；支援「萬」簡寫，例如 16萬3486。
                                </p>
                            </template>

                            <el-input
                                v-model="skahaBatchText"
                                type="textarea"
                                :rows="6"
                                placeholder="貼上價格表…"
                                class="life-batch-input"
                            />
                            <el-button
                                class="mt-2"
                                type="warning"
                                size="small"
                                :disabled="skahaBatchMode === 'single' && !skahaBatchItemName"
                                @click="applySkahaBatch"
                            >
                                套用
                            </el-button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm trade-table">
                                <thead>
                                    <tr class="text-gray-400 border-b border-gray-700 text-xs">
                                        <th class="text-left py-2 pr-3 font-normal">城鎮</th>
                                        <th
                                            v-for="good in skahaGoods"
                                            :key="good.name"
                                            class="text-center py-2 px-2 font-normal whitespace-nowrap"
                                        >
                                            <el-checkbox v-model="skahaSelected[good.name]" />
                                            <img :src="iconSrc(good.icon)" :alt="good.name" class="header-icon pixelated" />
                                            <div class="text-gray-200">{{ good.name }}</div>
                                            <el-input-number
                                                v-model="skahaQty[good.name]"
                                                :min="0"
                                                :max="skahaQtyCap(good)"
                                                size="small"
                                                style="width: 100px"
                                            />
                                            <div class="text-[10px] text-gray-500">上限 {{ skahaQtyCap(good) }}</div>
                                        </th>
                                        <th class="text-center py-2 px-2 font-normal">總計</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="city in tradeCities" :key="city.name" class="border-b border-gray-800/60">
                                        <th class="text-left py-2 pr-3 font-normal text-gray-200 whitespace-nowrap">
                                            {{ city.name }}
                                        </th>
                                        <td
                                            v-for="good in skahaGoods"
                                            :key="good.name"
                                            class="text-center py-1 px-2"
                                            :class="bestSkahaCities(good).has(city.name) ? 'bg-accent/10' : ''"
                                        >
                                            <el-input
                                                v-model="skahaPrices[skahaPriceKey(good, city.name)]"
                                                size="small"
                                                style="width: 90px"
                                                placeholder="單價"
                                                class="life-price-input"
                                            />
                                            <div v-if="skahaValueOf(good, city.name) > 0" class="text-[10px] opacity-70">
                                                {{ skahaValueOf(good, city.name).toLocaleString() }}
                                            </div>
                                        </td>
                                        <td
                                            class="text-center py-1 px-2 whitespace-nowrap"
                                            :class="bestSkahaTotalCities.has(city.name) ? 'bg-accent/20 text-accent font-semibold' : 'text-gray-300'"
                                        >
                                            {{ citySkahaTotal(city.name).toLocaleString() }} 杜卡
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </el-card>
                </el-tab-pane>

                <el-tab-pane label="生活貿易材料計算" name="lifeMaterials">
                    <p class="text-sm text-gray-400 mb-4">
                        勾選欲兌換的商品並輸入數量（上限為每週兌換上限），下方會加總所需材料總量。
                    </p>
                    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl overflow-hidden mb-4">
                        <el-collapse v-model="openLifeSelection" class="settings-collapse">
                            <el-collapse-item name="select">
                                <template #title>
                                    <h3 class="text-lg font-bold text-accent px-1">選擇兌換商品</h3>
                                </template>
                                <div class="px-1">
                                    <div class="setting-row wrap mb-2">
                                        <span class="setting-label">顯示地點</span>
                                        <el-checkbox v-for="loc in lifeTradeLocations" :key="loc.name" v-model="visibleLifeLocations[loc.name]">
                                            {{ loc.name }}
                                        </el-checkbox>
                                    </div>
                                    <div class="setting-row mb-4">
                                        <el-checkbox
                                            :model-value="allLifeItemsSelected"
                                            :indeterminate="someLifeItemsSelected"
                                            @change="(val) => toggleSelectAllLifeItems(Boolean(val))"
                                        >
                                            全選
                                        </el-checkbox>
                                        <el-checkbox v-model="lifeMaxQtyMode">數量全最大</el-checkbox>
                                        <span class="text-xs text-gray-500">勾選商品時直接帶入每週兌換上限</span>
                                        <el-checkbox v-model="showLifeCategory">顯示製作方式</el-checkbox>
                                    </div>

                                    <div v-for="loc in visibleLifeLocationsList" :key="loc.name" class="life-location-section">
                                        <div class="life-location-header">
                                            <h3 class="life-location-title">{{ loc.name }}</h3>
                                            <span v-if="hardItemsByLocation[loc.name]?.length" class="hard-item-picker">
                                                <span class="text-xs text-gray-500">本週高難度</span>
                                                <el-select v-model="activeHardItem[loc.name]" size="small" clearable placeholder="未設定" style="width: 160px">
                                                    <el-option v-for="hi in hardItemsByLocation[loc.name]" :key="hi.name" :label="hi.name" :value="hi.name" />
                                                </el-select>
                                            </span>
                                        </div>
                                        <div class="life-grid">
                                            <div
                                                v-for="item in loc.items.filter((i) => isActiveHardItem({ location: loc.name, name: i.name, hard: i.hard }))"
                                                :key="item.name"
                                                class="life-item-card"
                                                :class="{ 'life-item-card-selected': isLifeItemChecked(itemKey(loc.name, item.name)) }"
                                                @click="toggleLifeItem(loc.name, item.name, item.level)"
                                            >
                                                <div class="life-item-header">
                                                    <el-checkbox
                                                        :model-value="isLifeItemChecked(itemKey(loc.name, item.name))"
                                                        @change="(val) => setLifeItemChecked(itemKey(loc.name, item.name), Boolean(val), item.level)"
                                                        @click.stop
                                                    />
                                                    <img v-if="item.icon" :src="iconSrc(item.icon)" :alt="item.name" class="inline-icon pixelated" />
                                                    <span class="life-level-badge" :class="{ 'life-level-badge-hard': item.hard }">
                                                        {{ item.hard ? "高難度" : `LV${item.level}` }}
                                                    </span>
                                                    <span class="text-gray-200 font-semibold">{{ item.name }}</span>
                                                </div>
                                                <div
                                                    v-if="isLifeItemChecked(itemKey(loc.name, item.name))"
                                                    class="life-item-qty"
                                                    @click.stop
                                                >
                                                    <span class="text-xs text-gray-400">數量</span>
                                                    <el-input-number
                                                        v-model="lifeItemCounts[itemKey(loc.name, item.name)]"
                                                        :min="1"
                                                        :max="lifeTradeLevelStats[item.level].weeklyLimit"
                                                        size="small"
                                                        style="width: 110px"
                                                    />
                                                    <span class="text-[10px] text-gray-500">
                                                        / 上限 {{ lifeTradeLevelStats[item.level].weeklyLimit }}
                                                    </span>
                                                </div>
                                                <ul class="life-req-list">
                                                    <li v-for="req in item.requirements" :key="req.name">
                                                        {{ req.name }}
                                                        <span class="text-gray-500">
                                                            x{{ displayReqQty(req.qty, item.level, itemKey(loc.name, item.name)) }}
                                                        </span>
                                                        <span
                                                            v-if="showLifeCategory && lifeTradeMaterialCategories[req.name]"
                                                            class="life-req-category"
                                                        >
                                                            {{ lifeTradeMaterialCategories[req.name] }}
                                                        </span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>

                    <el-card v-if="selectedLifeCount > 0" class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl overflow-hidden">
                        <el-collapse v-model="openLifeTotals" class="settings-collapse">
                            <el-collapse-item name="totals">
                                <template #title>
                                    <h3 class="text-lg font-bold text-accent px-1">
                                        所需材料總計（已選 {{ selectedLifeCount }} 項）
                                    </h3>
                                </template>
                                <div class="px-1">
                                    <div class="flex items-center justify-end mb-3 flex-wrap gap-2">
                                        <el-radio-group v-model="lifeTotalGroupMode" size="small">
                                            <el-radio-button value="location">依地點分類</el-radio-button>
                                            <el-radio-button value="category">依製造方式分類</el-radio-button>
                                        </el-radio-group>
                                        <el-button size="small" plain @click="clearLifeSelection">清除已選</el-button>
                                    </div>
                                    <div v-for="group in lifeMaterialTotals" :key="group.group" class="life-total-group">
                                        <h4 class="life-total-group-title">{{ group.group }}</h4>
                                        <ul class="life-total-list">
                                            <li v-for="t in group.items" :key="t.name">
                                                <span>{{ t.name }}</span>
                                                <span class="text-accent font-semibold">x{{ t.qty }}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style scoped>
.settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 0.6rem 1.2rem;
    align-items: center;
}

.setting-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.setting-row.wrap {
    grid-column: 1 / -1;
    flex-wrap: wrap;
}

.setting-label {
    font-size: 0.83rem;
    color: #d1d5db;
    flex-shrink: 0;
}

.city-tabs :deep(.el-tabs__content) {
    padding-top: 0.75rem;
}

/* 個人貿易城鎮分頁固定分成兩排：前 8 座一排，克拉／比路里亞／科爾／巴雷斯另成一排 */
.personal-city-tabs :deep(.el-tabs__nav-wrap),
.personal-city-tabs :deep(.el-tabs__nav-scroll),
.personal-city-tabs :deep(.el-tabs__nav) {
    overflow: visible;
}

.personal-city-tabs :deep(.el-tabs__nav) {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    row-gap: 0.4rem;
}

.mode-tabs :deep(.el-tabs__content) {
    padding-top: 1rem;
}

.settings-collapse :deep(.el-collapse) {
    border: none;
}

.settings-collapse :deep(.el-collapse-item__header) {
    background: transparent;
    border: none;
    height: auto;
    padding: 1rem 0.5rem;
    font-size: 1rem;
}

.settings-collapse :deep(.el-collapse-item__wrap) {
    background: transparent;
    border: none;
}

.settings-collapse :deep(.el-collapse-item__content) {
    padding: 0 0.5rem 1rem;
}

.trade-table th,
.trade-table td {
    vertical-align: middle;
}

.inline-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    object-fit: contain;
}

.header-icon {
    display: block;
    width: 28px;
    height: 28px;
    margin: 0 auto 2px;
    object-fit: contain;
}

.pixelated {
    image-rendering: pixelated;
}

.life-location-section {
    margin-bottom: 1.25rem;
}

.life-location-section:last-child {
    margin-bottom: 0;
}

.life-location-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px dashed #374151;
}

.life-location-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: #d1d5db;
    margin: 0;
}

.hard-item-picker-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem 1.25rem;
}

.hard-item-picker {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
}

.life-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 0.75rem;
}

.life-item-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.life-level-badge {
    font-size: 0.7rem;
    font-weight: 700;
    color: #111827;
    background: var(--el-color-warning, #fbbf24);
    border-radius: 6px;
    padding: 0.1rem 0.4rem;
    flex-shrink: 0;
    white-space: nowrap;
}

.life-level-badge-hard {
    color: #fff;
    background: #dc2626;
}

.life-req-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    font-size: 0.83rem;
    color: #d1d5db;
}

.life-item-card {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: border-color 0.15s, background-color 0.15s;
}

.life-item-card:hover {
    border-color: #4b5563;
    background: #161f2e;
}

.life-item-card-selected {
    border-color: var(--el-color-primary, #fbbf24);
}

.life-item-qty {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
}

.life-req-category {
    margin-left: 0.35rem;
    font-size: 0.7rem;
    color: var(--el-color-primary, #fbbf24);
    background: rgba(251, 191, 36, 0.12);
    border-radius: 4px;
    padding: 0 0.3rem;
}

.life-total-group {
    margin-bottom: 1rem;
}

.life-total-group:last-child {
    margin-bottom: 0;
}

.life-total-group-title {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--el-color-primary, #fbbf24);
    margin-bottom: 0.4rem;
}

.life-total-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 0.4rem 1rem;
    font-size: 0.85rem;
    color: #d1d5db;
}

.life-total-list li {
    display: flex;
    justify-content: space-between;
    background: #111827;
    border: 1px solid #374151;
    border-radius: 8px;
    padding: 0.4rem 0.6rem;
}

/* 表格內以百分比撐開的 el-input 在多欄表格中常被瀏覽器算錯寬度，改用固定像素寬度 */
.life-price-input,
.life-price-input :deep(.el-input__wrapper),
.life-price-input :deep(.el-input__inner) {
    width: 90px !important;
}

.life-price-input :deep(.el-input__inner) {
    text-align: right;
}

.life-batch-input :deep(textarea) {
    font-family: ui-monospace, monospace;
    font-size: 0.8rem;
    background: #111827;
    color: #e5e7eb;
    border-color: #374151;
}
</style>
