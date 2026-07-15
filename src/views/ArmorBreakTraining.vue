<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";

interface Condition {
    id: number;
    name?: string; // hover 時顯示
    advanced?: boolean; // 進階，預設不顯示
    permanent?: boolean; // 永久，不倒數
    permLabel?: string; // 永久的顯示文字，預設「永久」（在場即永久者顯示「在場」）
    seconds?: number; // 持續秒數
    note?: string; // 例如「寵物在場即永久」
}

interface Source {
    id: number; // 技能 id / 寵物 id
    kind: "skill" | "pet";
    name?: string; // 技能名稱（寵物該表查無名稱）
    conditions: number[]; // 此來源會施加的 condition
}

// 名稱取自 src/data/conditions.ts 的繁中（tw）欄位；只列用到的幾筆，
// 避免為了幾個名稱 import 整份 336K 對照表
const CONDITIONS: Condition[] = [
    { id: 1164, name: "減少防禦/保護", seconds: 300 },
    { id: 1165, name: "減少魔法防禦/魔法保護", seconds: 300 },
    { id: 1166, name: "所受傷害增加", seconds: 300 },
    { id: 392, name: "纏繞的閃電", seconds: 300 },
    { id: 464, name: "冰雪狀態", permanent: true, permLabel: "在場", advanced: true, note: "在場即永久" },
    { id: 594, name: "跑跑卡丁車水球", permanent: true },
    { id: 912, name: "喵喵的喵皇降臨", seconds: 300 },
    { id: 1004, name: "銳利目光", permanent: true, permLabel: "在場", advanced: true, note: "寵物在場即永久" },
    { id: 1093, name: "保護最大減少", permanent: true },
    { id: 1094, name: "魔法保護最大減少", permanent: true },
    { id: 1138, name: "幸運草標記", seconds: 300 },
    { id: 10001, name: "物理防禦和保護減少瑪奇魔法陣", advanced: true, seconds: 110 },
    { id: 10002, name: "魔法防禦和保護減少瑪奇魔法陣", advanced: true, seconds: 110 },
];

// 技能名稱取自 src/data/skillNames.ts 的繁中（tw）欄位；寵物 id 該表查無名稱
const SOURCES: Source[] = [
    { id: 27205, kind: "skill", name: "黃道蔓延", conditions: [1164, 1165, 1166] },
    { id: 26006, kind: "skill", name: "灰色煙幕術", conditions: [1164, 1165] },
    { id: 24201, kind: "skill", name: "連續技能: 螺旋勾拳", conditions: [1164] },
    { id: 35024, kind: "skill", name: "海德拉鍊成", conditions: [1165] },
    { id: 21006, kind: "skill", name: "支援箭", conditions: [1166] },
    { id: 27010, kind: "skill", name: "死神烙印", conditions: [1166] },
    { id: 50226, kind: "skill", name: "水炸彈投擲", conditions: [594] },
    { id: 58018, kind: "skill", name: "刻印 : 弗拉加拉赫", conditions: [1093, 1094] },
    { id: 10103, kind: "skill", name: "瑪奇魔法陣發動", conditions: [10001, 10002] },
    { id: 490105, kind: "pet", conditions: [392] },
    { id: 490229, kind: "pet", conditions: [464] },
    { id: 490411, kind: "pet", conditions: [912] },
    { id: 490431, kind: "pet", conditions: [1138] },
    { id: 491006, kind: "pet", conditions: [1004] },
];

const SOURCE_GROUPS = [
    { kind: "skill", label: "技能" },
    { kind: "pet", label: "寵物" },
] as const;

const condIconUrl = (id: number) => `https://mabires.pril.cc/characterconditionimage/tw/${id}/${id}.png`;
const sourceIconUrl = (s: Source) =>
    s.kind === "skill"
        ? `https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/${s.id}.png`
        : `https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/pet/${s.id}.png`;

const condById = new Map(CONDITIONS.map((c) => [c.id, c]));
const condName = (c: Condition) => c.name || `#${c.id}`;
// 條件 hover：名稱（＋永久說明）
const condTitle = (c: Condition) => (c.note ? `${condName(c)}（${c.note}）` : condName(c));
// 來源 hover：技能名 → 施加的條件（寵物無名稱，只顯示條件）
const sourceTitle = (s: Source) => {
    const conds = s.conditions.map((id) => condTitle(condById.get(id)!)).join("、");
    return s.name ? `${s.name} → ${conds}` : conds;
};
// 來源施加的條件時間（皆相同時只顯示一個）
const sourceDurLabel = (s: Source) => [
    ...new Set(
        s.conditions.map((id) => {
            const c = condById.get(id)!;
            return c.permanent ? (c.permLabel ?? "永久") : fmt(c.seconds ?? 0);
        }),
    ),
].join("/");
// 條件全為進階者，該來源視為進階
const isAdvancedSource = (s: Source) => s.conditions.every((id) => condById.get(id)?.advanced);

// ===== 設定 =====
const showAdvanced = ref(false);
const advancedOptional = ref(true); // 隨機出題及格設定：進階項目可不補
const mode = ref<"scratch" | "random">("scratch"); // 從0到1 / 隨機出題；預設從0到1
const visibleConditions = computed(() => CONDITIONS.filter((c) => showAdvanced.value || !c.advanced));
// 及格所需的條件（進階可不補時，進階不列入）
const requiredConditions = computed(() =>
    visibleConditions.value.filter((c) => !(advancedOptional.value && c.advanced)),
);
const visibleSources = computed(() => SOURCES.filter((s) => showAdvanced.value || !isAdvancedSource(s)));
const sourcesOf = (kind: string) => visibleSources.value.filter((s) => s.kind === kind);

// ===== 進行中的條件：id -> 到期時間(ms)，永久為 Infinity =====
const active = ref<Record<number, number>>({});
const now = ref(Date.now());
let timer: number | undefined;
onMounted(() => {
    timer = window.setInterval(() => {
        now.value = Date.now();
        prune();
    }, 250);
});
onUnmounted(() => timer && clearInterval(timer));

// 時間到就移除
const prune = () => {
    const t = Date.now();
    const a = { ...active.value };
    let changed = false;
    for (const key of Object.keys(a)) {
        const id = Number(key);
        if (a[id] !== Infinity && a[id] <= t) {
            delete a[id];
            changed = true;
        }
    }
    if (changed) active.value = a;
};

// 剩餘秒數：null=未在場、Infinity=永久
const remainingOf = (id: number): number | null => {
    const e = active.value[id];
    if (e === undefined) return null;
    if (e === Infinity) return Infinity;
    return Math.max(0, Math.ceil((e - now.value) / 1000));
};
const isPresent = (id: number) => active.value[id] !== undefined;
// 該來源施加的條件是否全部在場
const sourcePresent = (s: Source) => s.conditions.every((id) => isPresent(id));

// 施加來源 → 套用其所有條件
const applySource = (s: Source) => {
    const next = { ...active.value };
    for (const id of s.conditions) {
        const c = condById.get(id);
        if (!c) continue;
        next[id] = c.permanent ? Infinity : Date.now() + (c.seconds ?? 0) * 1000;
    }
    active.value = next;
};
const remove = (id: number) => {
    const a = { ...active.value };
    delete a[id];
    active.value = a;
};
const clearAll = () => (active.value = {});

// ===== 隨機出題：10 關，全部在場即進入下一關 =====
const TOTAL_ROUNDS = 10;
const round = ref(1);
const finished = ref(false);

const seedRandom = () => {
    const a: Record<number, number> = {};
    for (const c of visibleConditions.value) {
        if (Math.random() < 0.6) {
            a[c.id] = c.permanent
                ? Infinity
                : Date.now() + Math.max(3, Math.floor((0.1 + Math.random() * 0.9) * (c.seconds ?? 0))) * 1000;
        }
    }
    // 保證至少缺一個「必補」條件，否則開局就及格
    const req = requiredConditions.value;
    if (req.length && req.every((c) => a[c.id] !== undefined)) {
        delete a[req[Math.floor(Math.random() * req.length)].id];
    }
    active.value = a;
};

// 依模式重新開始
const reseed = () => {
    if (mode.value === "scratch") {
        active.value = {};
        return;
    }
    round.value = 1;
    finished.value = false;
    seedRandom();
};
const setMode = (m: "scratch" | "random") => {
    mode.value = m;
    reseed();
};

// ===== 進行中清單（顯示順序固定，依 CONDITIONS 宣告順序）=====
const activeList = computed(() =>
    visibleConditions.value.filter((c) => isPresent(c.id)).map((c) => ({ c, remain: remainingOf(c.id)! })),
);
const presentCount = computed(() => activeList.value.length);

// 及格：所有「必補」條件都在場
const passed = computed(() => requiredConditions.value.length > 0 && requiredConditions.value.every((c) => isPresent(c.id)));

// 及格即進入下一關
watch(passed, (ok) => {
    if (!ok || mode.value !== "random" || finished.value) return;
    ElMessage.closeAll(); // 連續過關時避免提示疊在一起
    if (round.value >= TOTAL_ROUNDS) {
        finished.value = true;
        ElMessage.success({ message: `🎉 完成 ${TOTAL_ROUNDS} 關！`, duration: 2500 });
    } else {
        round.value++;
        ElMessage.success({ message: `過關！第 ${round.value} / ${TOTAL_ROUNDS} 關`, duration: 1200 });
        seedRandom();
    }
});

const hintText = computed(() => {
    if (mode.value !== "random") return "時間到會自動移除，歸零前再施加即可刷新";
    return advancedOptional.value && showAdvanced.value ? "非進階全部在場即進入下一關" : "全部在場即進入下一關";
});

function fmt(s: number): string {
    return s === Infinity ? "永久" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
// 永久者依條件顯示「永久」或「在場」
const remainLabel = (c: Condition, remain: number) => (remain === Infinity ? (c.permLabel ?? "永久") : fmt(remain));
const remainClass = (remain: number) =>
    remain === Infinity ? "text-accent" : remain <= 15 ? "text-amber-400" : "text-gray-100";
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-5xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    破防練習
                </h1>
                <p class="text-base text-gray-400 mt-3">練習維持破防條件同時在場，掌握各技能與寵物的重施時機</p>
            </header>

            <!-- 控制 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="flex flex-wrap items-center gap-4">
                    <div>
                        <p class="step-label">模式</p>
                        <div class="flex gap-2">
                            <button
                                class="tier-btn"
                                :class="{ 'tier-btn--active': mode === 'scratch' }"
                                @click="setMode('scratch')"
                            >
                                從 0 到 1
                            </button>
                            <button
                                class="tier-btn"
                                :class="{ 'tier-btn--active': mode === 'random' }"
                                @click="setMode('random')"
                            >
                                隨機出題（{{ TOTAL_ROUNDS }} 關）
                            </button>
                        </div>
                    </div>
                    <div>
                        <p class="step-label">選項</p>
                        <div class="flex items-center gap-4">
                            <el-checkbox v-model="showAdvanced" label="顯示進階" size="large" />
                            <el-tooltip
                                v-if="mode === 'random'"
                                content="及格判定時不要求補上進階項目"
                                placement="top"
                                :show-after="100"
                            >
                                <el-checkbox v-model="advancedOptional" label="進階項目可不補" size="large" />
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="ml-auto flex gap-2">
                        <el-button type="warning" @click="reseed">
                            {{ mode === "random" ? "重新出題" : "重新開始" }}
                        </el-button>
                        <el-button plain :disabled="activeList.length === 0" @click="clearAll">清除</el-button>
                    </div>
                </div>
            </el-card>

            <!-- 進行中 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="mb-4 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">進行中</h2>
                    <span class="text-sm text-gray-400">
                        在場 <span class="text-white font-bold">{{ presentCount }}</span> /
                        {{ visibleConditions.length }}
                    </span>
                    <span v-if="mode === 'random'" class="round-badge">
                        第 <span class="text-accent font-bold">{{ round }}</span> / {{ TOTAL_ROUNDS }} 關
                    </span>
                    <span class="text-xs text-gray-500 hidden sm:inline ml-auto">{{ hintText }}</span>
                </div>

                <p v-if="finished" class="mb-3 text-center text-accent font-bold">
                    🎉 完成 {{ TOTAL_ROUNDS }} 關！按「重新出題」再來一輪
                </p>

                <div v-if="activeList.length === 0" class="py-8 text-center text-gray-600 text-sm">
                    — 尚無在場條件，點下方技能／寵物施加 —
                </div>
                <div v-else class="icon-row">
                    <el-tooltip
                        v-for="item in activeList"
                        :key="item.c.id"
                        :content="condTitle(item.c)"
                        placement="top"
                        :show-after="100"
                    >
                        <div class="active-card">
                            <button class="active-remove" title="移除" @click="remove(item.c.id)">✕</button>
                            <img
                                :src="condIconUrl(item.c.id)"
                                :alt="condName(item.c)"
                                class="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                                loading="lazy"
                            />
                            <span class="text-xs font-bold tabular-nums" :class="remainClass(item.remain)">
                                {{ remainLabel(item.c, item.remain) }}
                            </span>
                        </div>
                    </el-tooltip>
                </div>
            </el-card>

            <!-- 施加來源 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <h2 class="text-xl font-bold text-accent mb-3">施加</h2>
                <div v-for="g in SOURCE_GROUPS" :key="g.kind">
                    <template v-if="sourcesOf(g.kind).length">
                        <p class="step-label mt-2">{{ g.label }}</p>
                        <div class="icon-row">
                            <el-tooltip
                                v-for="s in sourcesOf(g.kind)"
                                :key="s.id"
                                :content="sourceTitle(s)"
                                placement="top"
                                :show-after="100"
                            >
                                <button
                                    class="cond-btn"
                                    :class="{
                                        'cond-btn--present': mode !== 'random' && sourcePresent(s),
                                        'cond-btn--advanced': isAdvancedSource(s),
                                    }"
                                    @click="applySource(s)"
                                >
                                    <img
                                        :src="sourceIconUrl(s)"
                                        :alt="s.name || String(s.id)"
                                        class="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                                        loading="lazy"
                                    />
                                    <span class="text-xs text-gray-300">{{ sourceDurLabel(s) }}</span>
                                    <span v-if="isAdvancedSource(s)" class="cond-tag">進階</span>
                                </button>
                            </el-tooltip>
                        </div>
                    </template>
                </div>
            </el-card>

            <p class="text-center text-xs text-gray-600 pb-6">
                圖示來源：mabires.pril.cc、eldisa/mabinogiImage。資料為暫定，歡迎回報校正。
            </p>
        </div>
    </div>
</template>

<style scoped>
.step-label {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-bottom: 0.4rem;
}

.round-badge {
    font-size: 0.8rem;
    color: #d1d5db;
    padding: 2px 10px;
    border: 1px solid #4b5563;
    border-radius: 9999px;
    background: #111827;
}

.tier-btn {
    padding: 6px 14px;
    font-size: 0.85rem;
    border-radius: 8px;
    border: 1.5px solid #374151;
    background: #1f2937;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.15s;
}
.tier-btn:hover {
    border-color: #6b7280;
}
.tier-btn--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}

/* 放得下就一排，放不下自動換行（不橫向捲，確保全部同時可見） */
.icon-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 2px 2px 8px;
}
.icon-row > * {
    flex-shrink: 0;
}

/* 進行中卡片 */
.active-card {
    position: relative;
    min-width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 6px 6px;
    border: 1.5px solid #f59e0b;
    border-radius: 10px;
    background: #111827;
}
.active-remove {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    border: 1px solid #4b5563;
    background: #374151;
    color: #d1d5db;
    font-size: 0.7rem;
    line-height: 1;
    cursor: pointer;
}
.active-remove:hover {
    background: #ef4444;
    color: #fff;
}

/* 施加按鈕 */
.cond-btn {
    position: relative;
    min-width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 6px;
    border: 1.5px solid #374151;
    border-radius: 10px;
    background: #1f2937;
    cursor: pointer;
    transition: all 0.15s;
}
.cond-btn:hover {
    border-color: #6b7280;
    transform: translateY(-2px);
}
.cond-btn--present {
    border-color: #f59e0b;
    background: #2d2207;
}
.cond-btn--advanced {
    border-style: dashed;
}
.cond-tag {
    position: absolute;
    top: -7px;
    left: -6px;
    font-size: 0.55rem;
    padding: 1px 5px;
    border-radius: 6px;
    background: #4c1d95;
    color: #ddd6fe;
    line-height: 1.3;
}

/* 窄螢幕縮小卡片，讓每排多塞幾個（需放在基礎規則之後才蓋得過）
   40px 已足夠容納 icon(24) 與最寬的倒數文字(25) + 左右 padding */
@media (max-width: 639px) {
    .icon-row {
        gap: 6px;
    }
    .active-card,
    .cond-btn {
        min-width: 40px;
        padding: 6px 4px;
    }
}
</style>
