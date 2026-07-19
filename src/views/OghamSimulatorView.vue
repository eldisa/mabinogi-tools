<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { simArcanas, simWords, simOptions, simPrices, type SimOption } from "../data/oghamSim";

const baseUrl = import.meta.env.BASE_URL;
const imgUrl = (p?: string | null) => (p ? baseUrl + p : "");

// ===== 選擇 =====
const selectedArcanaId = ref(simArcanas[0].id);
const arcana = computed(() => simArcanas.find((a) => a.id === selectedArcanaId.value)!);
const selectedWordId = ref(simWords[0].id);
const word = computed(() => simWords.find((w) => w.id === selectedWordId.value)!);
const isSpecialWord = computed(() => word.value.hasArcana); // 特殊符文固定大師級
const rockLine = ref(2); // 0/1/2 → 1/2/3 條詞條（精英/史詩/大師）
const lineCount = computed(() => rockLine.value + 1);
const gradeName = ["精英", "史詩", "大師"];
const price = computed(() => simPrices.find((p) => p.rockLine === rockLine.value) ?? simPrices[simPrices.length - 1]);

// ===== 詞條池 =====
// labanyu 設計：池子是「全部祕法 + 全部才能 + 全部屬性」（黑暗鍋，靠鎖詞條慢慢洗），
// 不依選的祕法收窄；符文只決定能不能出「祕法技能」(hasArcana)／「才能技能」(hasTalent)。
const pool = computed<SimOption[]>(() => {
    const w = word.value;
    return simOptions.filter((o) => {
        if (o.kind === "arcana") return w.hasArcana; // 特殊符文才出祕法技能，但涵蓋全部祕法
        if (o.kind === "talent") return w.hasTalent; // 全部才能
        if (o.kind === "stat") return true; // 全部屬性
        return false;
    });
});

// ===== 抽取 =====
interface Line {
    option: SimOption;
    level: number;
    locked: boolean;
}
const lines = ref<(Line | null)[]>(Array(lineCount.value).fill(null));

// 設定變更時重置詞條行（保留鎖定的合理性：條數變動就清空）
watch([selectedArcanaId, selectedWordId, rockLine], () => {
    lines.value = Array(lineCount.value).fill(null);
    targetOptionIds.value = [];
    autoResult.value = "";
});

// 特殊符文固定大師級（3 條）；一般符文可自由選等級
watch(
    isSpecialWord,
    (special) => {
        if (special) rockLine.value = 2;
    },
    { immediate: true },
);

const randInt = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo)) + lo; // [lo, hi)

const rollOnce = (): (Line | null)[] => {
    const p = pool.value;
    const usedIds = new Set<number>();
    lines.value.forEach((l) => {
        if (l?.locked) usedIds.add(l.option.id);
    });
    return Array.from({ length: lineCount.value }, (_, i) => {
        const existing = lines.value[i];
        if (existing?.locked) return existing;
        const avail = p.filter((o) => !usedIds.has(o.id));
        if (avail.length === 0) return null;
        const opt = avail[randInt(0, avail.length)];
        usedIds.add(opt.id);
        return { option: opt, level: randInt(1, opt.maxLevel + 1), locked: false };
    });
};

// ===== 花費統計 =====
const spentGold = ref(0);
const spentItems = ref<Record<string, number>>({});
const attempts = ref(0);
const payOnce = () => {
    spentGold.value += price.value.gold;
    attempts.value += 1;
    for (const it of price.value.items) spentItems.value[it.name] = (spentItems.value[it.name] ?? 0) + it.count;
};
const resetHistory = () => {
    spentGold.value = 0;
    spentItems.value = {};
    attempts.value = 0;
    autoResult.value = "";
};

const doRoll = () => {
    if (pool.value.length === 0) return;
    payOnce();
    lines.value = rollOnce();
};

const toggleLock = (i: number) => {
    const l = lines.value[i];
    if (l) lines.value[i] = { ...l, locked: !l.locked };
};

const fmtValue = (o: SimOption, level: number): string => {
    const v = (o.value / Math.max(1, o.maxLevel)) * level;
    const n = Number(v.toFixed(4));
    return o.percent ? `${n}%` : `${n}`;
};

// ===== 目標模式（抽到為止）=====
// 依祕法排除「對該職業實際沒用」的目標詞條（原始資料含原作者為方便加入的項目）。
// key = arcanaId(1~10)，value = 要排除的 option id。填了才會生效，空的維持全顯示。
// 對照表：selectedArcanaId 對應 simArcanas 的 id；option id/名稱見資料或 target 清單。
const TARGET_EXCLUDE: Record<number, number[]> = {
    // 例：1: [61, 62],  // 元素騎士排除 精通斧/精通鈍器
    // 元素騎士
    1: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86],
    2: [],
    3: [],
    // 秘術遊俠
    4: [87, 88, 89],
    // 聖盾守衛
    5: [53, 55, 74, 75],
    // 爆破槍兵
    6: [46, 96, 97],
    7: [],
    8: [],
    9: [],
    10: [53, 54, 55, 58, 60, 61, 62],
};

// 池子是全鍋，但「目標詞條」清單依選的祕法篩選，方便找自己職業的詞條
const targetOptions = computed<SimOption[]>(() => {
    const a = arcana.value;
    const ex = TARGET_EXCLUDE[a.id] ?? [];
    return pool.value.filter((o) => {
        if (ex.includes(o.id)) return false;
        if (o.kind === "arcana") return o.arcanaId === a.id;
        if (o.kind === "talent") return o.talentId === a.mainTalentId || o.talentId === a.subTalentId;
        if (o.kind === "stat") return o.arcanaId === a.id;
        return false;
    });
});
const targetOptionIds = ref<number[]>([]); // 最多 3 個目標詞條
const targetLimit = computed(() => Math.min(3, lineCount.value)); // 目標數 ≤ 詞條數
const targetMinLevel = ref(20);
const autoResult = ref("");
const MAX_TRIES = 1_000_000; // 安全上限，避免目標無法達成時無限迴圈
// 各目標最低等級上限取所選詞條 maxLevel 的最小值
const targetMaxLevel = computed(() => {
    const sel = pool.value.filter((o) => targetOptionIds.value.includes(o.id));
    return sel.length ? Math.min(...sel.map((o) => o.maxLevel)) : 20;
});
// 選擇目標時，最低等級預設為滿等（可再往下調）
watch(targetOptionIds, () => {
    targetMinLevel.value = targetMaxLevel.value;
});

const targetsSatisfied = (arr: (Line | null)[]) =>
    targetOptionIds.value.every((tid) => arr.some((l) => l && l.option.id === tid && l.level >= targetMinLevel.value));

const rollUntil = () => {
    if (pool.value.length === 0 || targetOptionIds.value.length === 0) return;
    const targets = targetOptionIds.value;
    let tries = 0;
    let hit = false;
    while (tries < MAX_TRIES) {
        tries++;
        payOnce();
        lines.value = rollOnce();
        // 命中目標的詞條行自動鎖定，避免下一次重抽被洗掉（模擬實際鎖詞條farming）
        lines.value.forEach((l, i) => {
            if (l && !l.locked && targets.includes(l.option.id) && l.level >= targetMinLevel.value) {
                lines.value[i] = { ...l, locked: true };
            }
        });
        if (targetsSatisfied(lines.value)) {
            hit = true;
            break;
        }
    }
    autoResult.value = hit
        ? `🎉 第 ${tries.toLocaleString()} 次湊齊全部目標`
        : `⚠ ${tries.toLocaleString()} 次仍未湊齊目標（已達上限）`;
};

const kindLabel = (o: SimOption): string => (o.kind === "arcana" ? "祕法" : o.kind === "stat" ? "屬性" : "才能");
const kindColor = (o: SimOption): string =>
    o.kind === "arcana" ? "text-red-400" : o.kind === "stat" ? "text-green-400" : "text-blue-400";

// ===== 各區塊收合 =====
const showSelectCard = ref(true);
const showTargetCard = ref(true);
const showRollCard = ref(true);
const showCostCard = ref(true);
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-4xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    符文模擬器
                </h1>
                <p class="text-base text-gray-400 mt-3">模擬符文（Ogham）詞條抽取，試試你的手氣與花費</p>
            </header>

            <!-- 選擇 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showSelectCard ? 'mb-4 border-b border-gray-700 pb-3' : ''"
                    @click="showSelectCard = !showSelectCard"
                >
                    <h2 class="text-xl font-bold text-accent">選擇</h2>
                    <span class="text-xs text-gray-500 hidden sm:inline">祕法 / 等級 / 符文</span>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showSelectCard ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>

                <div v-show="showSelectCard">
                    <div class="flex flex-wrap gap-5 items-end">
                        <div>
                            <p class="step-label">祕法</p>
                            <el-select v-model="selectedArcanaId" style="width: 200px">
                                <el-option v-for="a in simArcanas" :key="a.id" :label="a.name" :value="a.id">
                                    <span class="flex items-center gap-2">
                                        <img :src="imgUrl(a.icon)" alt="" class="h-5 w-5 object-contain" />
                                        {{ a.name }}
                                    </span>
                                </el-option>
                            </el-select>
                            <p class="text-xs text-gray-500 mt-1">{{ arcana.mainTalent }} / {{ arcana.subTalent }}</p>
                        </div>
                        <div>
                            <p class="step-label">等級（詞條數）</p>
                            <div class="flex gap-2">
                                <button
                                    v-for="p in simPrices"
                                    :key="p.rockLine"
                                    class="tier-btn"
                                    :class="{ 'tier-btn--active': rockLine === p.rockLine }"
                                    :disabled="isSpecialWord"
                                    @click="rockLine = p.rockLine"
                                >
                                    {{ gradeName[p.rockLine] }}（{{ p.rockLine + 1 }} 條）
                                </button>
                            </div>
                            <p v-if="isSpecialWord" class="text-xs text-accent mt-1">特殊符文固定為大師級（3 條）</p>
                        </div>
                    </div>

                    <!-- 符文選擇 -->
                    <p class="step-label mt-4">符文（★ 為特殊符文，可出祕法詞條）</p>
                    <div class="flex flex-wrap gap-1.5">
                        <button
                            v-for="w in simWords"
                            :key="w.id"
                            class="word-chip"
                            :class="{ 'word-chip--active': selectedWordId === w.id, 'word-chip--special': w.hasArcana }"
                            @click="selectedWordId = w.id"
                        >
                            <span class="word-rune">{{ w.icon }}</span>
                            <span>{{ w.name }}</span>
                            <span v-if="w.hasArcana" class="text-accent text-xs">★</span>
                        </button>
                    </div>

                    <!-- 成本 -->
                    <div class="mt-4 flex flex-wrap items-center gap-3 text-sm">
                        <span class="text-gray-400">每抽：</span>
                        <span class="text-yellow-400 font-semibold">{{ price.gold.toLocaleString() }} 金</span>
                        <span v-for="it in price.items" :key="it.name" class="flex items-center gap-1 text-gray-300">
                            <img :src="imgUrl(it.thumbnail)" alt="" class="h-5 w-5 object-contain" />
                            {{ it.name }} ×{{ it.count }}
                        </span>
                        <span class="text-xs text-gray-500">・符文池 {{ pool.length }} 種</span>
                    </div>
                </div>
            </el-card>

            <!-- 目標模式 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showTargetCard ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showTargetCard = !showTargetCard"
                >
                    <h2 class="text-xl font-bold text-accent">抽到目標為止</h2>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showTargetCard ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>

                <div v-show="showTargetCard">
                    <div class="flex flex-wrap items-end gap-3">
                        <div>
                            <p class="step-label">目標詞條（最多 {{ targetLimit }} 個）</p>
                            <el-select
                                v-model="targetOptionIds"
                                placeholder="選擇目標詞條"
                                multiple
                                :multiple-limit="targetLimit"
                                collapse-tags
                                collapse-tags-tooltip
                                filterable
                                clearable
                                style="width: 320px"
                            >
                                <el-option v-for="o in targetOptions" :key="o.id" :label="o.name" :value="o.id">
                                    <span class="flex items-center gap-1">
                                        <span :class="kindColor(o)" class="text-xs">{{ kindLabel(o) }}</span>
                                        {{ o.name }}
                                    </span>
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <p class="step-label">最低等級</p>
                            <el-input-number
                                v-model="targetMinLevel"
                                :min="1"
                                :max="targetMaxLevel"
                                size="default"
                                controls-position="right"
                                style="width: 110px"
                            />
                        </div>
                        <el-button type="warning" :disabled="targetOptionIds.length === 0" @click="rollUntil">
                            抽到為止
                        </el-button>
                    </div>
                    <p v-if="autoResult" class="mt-3 text-sm text-gray-200">{{ autoResult }}</p>
                    <p class="mt-1 text-xs text-gray-500">
                        自未鎖定的詞條行中重複抽取，命中的目標詞條會自動鎖定，直到湊齊全部目標（或達上限）。
                    </p>
                </div>
            </el-card>

            <!-- 抽取 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div
                    class="mb-4 flex items-center gap-3 flex-wrap cursor-pointer select-none"
                    @click="showRollCard = !showRollCard"
                >
                    <h2 class="text-xl font-bold text-accent">抽取</h2>
                    <span class="text-xs text-gray-500 hidden sm:inline">點詞條可鎖定，重抽時保留</span>
                    <span v-if="attempts > 0" class="text-sm text-gray-400 ml-auto">
                        已抽
                        <span class="text-white font-bold">{{ attempts.toLocaleString() }}</span>
                        次
                    </span>
                    <span
                        class="text-gray-400 text-sm transition-transform duration-200"
                        :class="attempts > 0 ? '' : 'ml-auto'"
                        :style="{ transform: showRollCard ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>

                <div v-show="showRollCard">
                    <!-- 詞條行 -->
                    <div class="flex flex-col gap-2">
                        <div
                            v-for="i in lineCount"
                            :key="i"
                            class="sim-line"
                            :class="{
                                'sim-line--locked': lines[i - 1]?.locked,
                                'sim-line--empty': !lines[i - 1],
                                'cursor-pointer': !!lines[i - 1],
                            }"
                            @click="lines[i - 1] && toggleLock(i - 1)"
                        >
                            <template v-if="lines[i - 1]">
                                <span
                                    :class="kindColor(lines[i - 1]!.option)"
                                    class="text-xs font-bold w-8 flex-shrink-0"
                                >
                                    {{ kindLabel(lines[i - 1]!.option) }}
                                </span>
                                <img
                                    v-if="lines[i - 1]!.option.skillIcon"
                                    :src="imgUrl(lines[i - 1]!.option.skillIcon)"
                                    alt=""
                                    class="h-5 w-5 object-contain flex-shrink-0"
                                />
                                <span class="text-sm text-gray-200 flex-1 min-w-0">
                                    {{ lines[i - 1]!.option.name }}
                                </span>
                                <span class="text-xs text-gray-500">Lv.{{ lines[i - 1]!.level }}</span>
                                <span class="text-accent font-semibold text-sm w-16 text-right">
                                    {{ fmtValue(lines[i - 1]!.option, lines[i - 1]!.level) }}
                                </span>
                                <span class="text-xs w-6 text-right">{{ lines[i - 1]!.locked ? "🔒" : "" }}</span>
                            </template>
                            <span v-else class="text-sm text-gray-600">— 尚未抽取 —</span>
                        </div>
                    </div>

                    <div class="mt-4 flex items-center gap-3 flex-wrap">
                        <el-button type="warning" size="large" :disabled="pool.length === 0" @click="doRoll">
                            ⚒ 抽一次
                        </el-button>
                        <el-button v-if="attempts > 0" size="small" plain class="ml-auto" @click="resetHistory">
                            重置統計
                        </el-button>
                    </div>
                </div>
            </el-card>

            <!-- 花費統計 -->
            <el-card
                v-if="attempts > 0"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6"
            >
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showCostCard ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showCostCard = !showCostCard"
                >
                    <h2 class="text-xl font-bold text-accent">累計花費</h2>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showCostCard ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>

                <div v-show="showCostCard">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div class="stat-card">
                            <div class="stat-label">抽取次數</div>
                            <div class="stat-value text-white">{{ attempts.toLocaleString() }}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">金幣</div>
                            <div class="stat-value text-yellow-400">{{ spentGold.toLocaleString() }}</div>
                        </div>
                        <div v-for="(count, name) in spentItems" :key="name" class="stat-card">
                            <div class="stat-label">{{ name }}</div>
                            <div class="stat-value text-blue-400">{{ count.toLocaleString() }}</div>
                        </div>
                    </div>
                </div>
            </el-card>

            <p class="text-center text-xs text-gray-600 pb-6">
                * 機制參考 labanyu 韓服工具站，資料翻譯自韓服，可能與正服有出入。
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

.tier-btn,
.word-chip {
    border: 1.5px solid #374151;
    background: #1f2937;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.15s;
}
.tier-btn {
    padding: 6px 12px;
    font-size: 0.85rem;
    border-radius: 8px;
}
.tier-btn:hover,
.word-chip:hover {
    border-color: #6b7280;
}
.tier-btn--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}
.tier-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
.tier-btn:disabled:hover {
    border-color: #374151;
}

.word-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 9px;
    font-size: 0.8rem;
    border-radius: 6px;
}
.word-chip--special {
    border-color: #7c5e12;
}
.word-chip--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}
.word-rune {
    font-size: 1rem;
    line-height: 1;
    color: #9ca3af;
}
.word-chip--active .word-rune {
    color: #fbbf24;
}

.sim-line {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    background: #111827;
    border: 1px solid #374151;
    transition:
        border-color 0.15s,
        background 0.15s;
}
.sim-line--locked {
    border-color: #f59e0b;
    background: #2d2207;
}
.sim-line--empty {
    border-style: dashed;
}

.stat-card {
    background: #111827;
    border: 1px solid #374151;
    border-radius: 10px;
    padding: 0.85rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.stat-label {
    font-size: 0.72rem;
    color: #9ca3af;
}
.stat-value {
    font-size: 1.3rem;
    font-weight: 700;
    line-height: 1.15;
}
</style>
