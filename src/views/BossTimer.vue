<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

// ── AudioContext 單例（解決 iOS 每次播完後重新失權的問題） ─
let audioCtx: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

function getCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
}

async function loadAudioBuffer(filename: string) {
    if (!filename) { audioBuffer = null; return; }
    try {
        const url = import.meta.env.BASE_URL + "sounds/" + encodeURIComponent(filename);
        const res  = await fetch(url);
        const arr  = await res.arrayBuffer();
        audioBuffer = await getCtx().decodeAudioData(arr);
    } catch {
        audioBuffer = null;
    }
}

// ============================================================
// ★ 音效設定說明
//
// 1. 將音效檔案放入：  happy-jang/public/sounds/  資料夾
//    （若資料夾不存在請自行建立）
//
// 2. 在下方 SOUND_OPTIONS 新增一筆：
//    { label: '顯示名稱', value: '檔名.mp3' }
//
//    範例：
//    { label: '警報音',   value: 'alert.mp3'     }
//    { label: '鈴聲',     value: 'bell.mp3'      }
//    { label: '語音倒數', value: 'countdown.mp3' }
//
//    → 對應檔案位置：public/sounds/alert.mp3
//
// ============================================================
const SOUND_OPTIONS: { label: string; value: string }[] = [
    { label: "無音效", value: "" },
    { label: "時間快到囉", value: "時間快到囉.mp3" },
    { label: "CS2 炸彈已安放", value: "CS2 炸彈已安放.mp3" },
    { label: "世紀帝國 號角響起", value: "世紀帝國號角響起.mp3" },
    { label: "世紀帝國 被攻擊", value: "世紀帝國 被攻擊.mp3" },
    { label: "LOL 消失問號", value: "LOL 英雄聯盟 消失問號.mp3" },
    { label: "Apple Pay", value: "Apple Pay.mp3" },
    { label: "Tuturu", value: "Tuturu.mp3" },
    { label: "魔術技巧~", value: "魔↗術↘技↗巧~.mp3" },
    { label: "烏薩奇 嗚啦", value: "烏薩奇-嗚啦.mp3" },
    { label: "烏薩奇 噗魯~~~", value: "烏薩奇-噗魯~~~.mp3" },
    { label: "JoJo Wryyyyy", value: "jojo Wryyyyy.mp3" },
    { label: "一代米要扛幾樓", value: "一代米要扛幾樓.mp3" },
    { label: "FBI Open Up!", value: "FBI Open Up!.mp3" },
    { label: "原神 啟動!!", value: "原神~ 啟動!!.mp3" },
    { label: "下面一位", value: "下面一位.mp3" },
    { label: "哩喜哩考哦", value: "哩喜哩考哦.mp3" },
];

// ============================================================
// 時間設定
// ============================================================
const INITIAL_TIME = 15 * 60; // 15 分鐘

// 安全屋出現時間點（倒數計時上的時間）
const TARGET_TIME_STRINGS = [
    "14:53",
    "13:50",
    "12:47",
    "11:44",
    "10:41",
    "09:38",
    "08:35",
    "07:32",
    "06:29",
    "05:26",
    "04:23",
    "03:20",
    "02:17",
    "01:14",
];

// ── 內部資料 ──────────────────────────────────────────────────
interface Target {
    display: string;
    seconds: number;
}

const targets: Target[] = TARGET_TIME_STRINGS.map((s) => {
    const [m, sec] = s.split(":").map(Number);
    return { display: s, seconds: m * 60 + sec };
});

// ── State ─────────────────────────────────────────────────────
const timeLeft = ref(INITIAL_TIME);
const isRunning = ref(false);
const selectedSound = ref("時間快到囉.mp3");
const alertBefore = ref(5); // 提前 N 秒播放
const showSettings = ref(false);

let timerId: ReturnType<typeof setInterval> | null = null;
const playedFor = new Set<number>(); // 已播音效的 target.seconds

// ── Helpers ───────────────────────────────────────────────────
function formatTime(secs: number): string {
    const m = Math.floor(secs / 60)
        .toString()
        .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// ── Computed ──────────────────────────────────────────────────
const remainingTargets = computed<Target[]>(() => targets.filter((t) => timeLeft.value >= t.seconds));

const nextTarget = computed<Target | null>(() => remainingTargets.value[0] ?? null);

const secondsToNext = computed<number | null>(() =>
    nextTarget.value !== null ? timeLeft.value - nextTarget.value.seconds : null,
);

const nextText = computed(() => {
    if (!nextTarget.value) return "已無剩餘安全屋";
    return `距離下一個安全屋還有：${formatTime(secondsToNext.value!)}`;
});

const nextStatus = computed(() => {
    const s = secondsToNext.value;
    if (s === null || s > 60) return "";
    if (s <= 10) return "status-10";
    if (s <= 30) return "status-30";
    return "status-60";
});

// 進入警示區間（到達時間點前後 3 秒內顯示大字警告）
const isAlertActive = computed(() =>
    targets.some((t) => timeLeft.value > t.seconds && timeLeft.value <= t.seconds + 3),
);

// ── Audio ─────────────────────────────────────────────────────
// 解除 iOS AudioContext 封鎖（必須在使用者手勢中呼叫一次）
function unlockAudio() {
    getCtx().resume().catch(() => {});
}

// 播放已載入的音效緩衝（不需要每次手勢授權）
function playSound() {
    if (!audioBuffer) return;
    const ctx = getCtx();
    const src = ctx.createBufferSource();
    src.buffer = audioBuffer;
    src.connect(ctx.destination);
    src.start(0);
}

function testSound() {
    unlockAudio();
    playSound();
}

// 音效檔切換時重新載入緩衝
watch(selectedSound, (val) => loadAudioBuffer(val));

// 初始化預設音效
onMounted(() => loadAudioBuffer(selectedSound.value));

// ── Timer logic ───────────────────────────────────────────────
function checkSound() {
    if (!nextTarget.value || secondsToNext.value === null) return;
    const key = nextTarget.value.seconds;
    if (secondsToNext.value <= alertBefore.value && !playedFor.has(key)) {
        playedFor.add(key);
        playSound();
    }
}

function tick() {
    if (timeLeft.value <= 0) {
        stop();
        return;
    }
    checkSound();
    timeLeft.value--;
}

function start() {
    if (isRunning.value) return;
    if (timeLeft.value === 0) {
        timeLeft.value = INITIAL_TIME;
        playedFor.clear();
    }
    // 利用使用者手勢解鎖 iOS 音訊，之後計時器自動觸發才能正常播放
    unlockAudio();
    isRunning.value = true;
    timerId = setInterval(tick, 1000);
}

function stop() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    isRunning.value = false;
}

function reset() {
    stop();
    timeLeft.value = INITIAL_TIME;
    playedFor.clear();
}

onUnmounted(() => {
    if (timerId) clearInterval(timerId);
    audioCtx?.close();
    audioCtx = null;
    audioBuffer = null;
});
</script>

<template>
    <div class="h-full flex flex-col bg-gray-900 text-gray-100 overflow-hidden">
        <!-- ── 控制列 ── -->
        <div
            class="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-2 bg-gray-800 border-b border-gray-700"
        >
            <span class="text-sm font-bold whitespace-nowrap">4王安全屋計時</span>
            <button
                @click="showSettings = !showSettings"
                :class="[
                    'px-3 py-1.5 rounded-xl text-sm border transition whitespace-nowrap',
                    showSettings
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600',
                ]"
            >
                ⚙ 設定
            </button>
        </div>

        <!-- ── 設定列（可收合） ── -->
        <Transition name="slide-down">
            <div
                v-if="showSettings"
                class="flex-shrink-0 flex flex-wrap items-start gap-x-6 gap-y-2 px-4 py-3 bg-gray-800/70 border-b border-gray-700"
            >
                <!-- 音效選擇 -->
                <div class="flex items-center gap-2">
                    <label class="text-xs text-gray-400 whitespace-nowrap">提示音效</label>
                    <select v-model="selectedSound" class="st-select">
                        <option v-for="opt in SOUND_OPTIONS" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>
                    <button
                        v-if="selectedSound"
                        @click="testSound"
                        class="px-2 py-1 text-xs rounded bg-gray-600 text-gray-200 hover:bg-gray-500 transition"
                    >
                        試聽
                    </button>
                </div>

                <!-- 提前秒數 -->
                <div class="flex items-center gap-2">
                    <label class="text-xs text-gray-400 whitespace-nowrap">提前播放</label>
                    <input type="number" min="1" max="60" v-model.number="alertBefore" class="st-input w-16" />
                    <span class="text-xs text-gray-400">秒前</span>
                </div>

                <!-- 說明 -->
                <!-- <p class="text-xs text-gray-500 w-full leading-relaxed">
                    音效檔案請放於
                    <code class="text-blue-400 bg-gray-900 px-1 rounded">public/sounds/</code>
                    資料夾，並在
                    <code class="text-blue-400 bg-gray-900 px-1 rounded">BossTimer.vue</code>
                    頂端的
                    <code class="text-blue-400 bg-gray-900 px-1 rounded">SOUND_OPTIONS</code>
                    陣列新增對應項目。
                </p> -->
            </div>
        </Transition>

        <!-- ── 主內容 ── -->
        <div class="flex-1 overflow-hidden flex flex-col md:flex-row gap-4 p-4 min-h-0">
            <!-- 左側：計時器 -->
            <div
                class="flex flex-col items-center justify-center flex-1 bg-gray-800/40 rounded-2xl border border-gray-700 p-6 gap-3 min-w-0"
            >
                <!-- 主計時 -->
                <div class="timer-main tabular-nums font-bold select-none">
                    {{ formatTime(timeLeft) }}
                </div>

                <!-- 下一個安全屋倒數 -->
                <div :class="['next-countdown', nextStatus]">{{ nextText }}</div>

                <!-- 警告訊息 -->
                <div class="h-12 flex items-center justify-center">
                    <Transition name="alert-fade">
                        <div v-if="isAlertActive" class="alert-text">⚠ 安全屋即將出現</div>
                    </Transition>
                </div>

                <!-- 開始 / 暫停 / 重置 按鈕 -->
                <div class="flex items-center gap-3 mt-2">
                    <button
                        v-if="!isRunning"
                        @click="start"
                        class="px-8 py-2.5 rounded-2xl bg-accent text-gray-900 font-bold hover:brightness-110 active:scale-[0.97] transition text-base whitespace-nowrap shadow-lg"
                    >
                        {{ timeLeft === 0 ? "重新開始" : "開始計時" }}
                    </button>
                    <button
                        v-else
                        @click="stop"
                        class="px-8 py-2.5 rounded-2xl bg-yellow-500 text-gray-900 font-bold hover:brightness-110 active:scale-[0.97] transition text-base whitespace-nowrap shadow-lg"
                    >
                        暫停
                    </button>
                    <button
                        @click="reset"
                        class="px-5 py-2.5 rounded-2xl bg-gray-700 text-gray-200 hover:bg-gray-600 active:scale-[0.97] transition text-base border border-gray-600 whitespace-nowrap"
                    >
                        重置
                    </button>
                </div>
            </div>

            <!-- 右側：時間表 -->
            <div
                class="flex flex-col w-full md:w-72 bg-gray-800/40 rounded-2xl border border-gray-700 p-4 min-h-0 overflow-hidden"
            >
                <h2 class="text-sm font-semibold text-blue-400 border-b border-blue-400/30 pb-2 mb-3 flex-shrink-0">
                    安全屋時間表
                </h2>
                <ul class="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
                    <li v-if="remainingTargets.length === 0" class="text-center text-gray-500 text-sm py-6">
                        已無剩餘安全屋
                    </li>
                    <li
                        v-for="(t, idx) in remainingTargets"
                        :key="t.display"
                        :class="[
                            'schedule-item',
                            idx === 0 && isAlertActive ? 'item-alerting' : '',
                            idx === 0 && !isAlertActive ? 'item-next' : '',
                        ]"
                    >
                        <span>⏱ 安全屋 {{ t.display }}</span>
                        <span v-if="idx === 0 && isAlertActive" class="item-badge badge-alert">⚠ 出現中</span>
                        <span v-else-if="idx === 0" class="item-badge badge-next">NEXT</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ── 主計時器 ────────────────────────────────────────────── */
.timer-main {
    font-size: clamp(3.5rem, 12vw, 5.5rem);
    line-height: 1;
    background: linear-gradient(45deg, #00f2fe, #4facfe);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 0 12px rgba(79, 172, 254, 0.25));
}

/* ── 下一個安全屋倒數小字 ────────────────────────────────── */
.next-countdown {
    font-size: 1rem;
    color: #888;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.5px;
    transition:
        color 0.3s,
        font-size 0.2s;
    text-align: center;
}
.next-countdown.status-60 {
    color: #2ed573;
    font-weight: bold;
}
.next-countdown.status-30 {
    color: #ffa500;
    font-weight: bold;
}
.next-countdown.status-10 {
    color: #ff4757;
    font-weight: bold;
    font-size: 1.1rem;
    animation: textPulse 0.5s infinite alternate;
}
@keyframes textPulse {
    from {
        text-shadow: 0 0 6px rgba(255, 71, 87, 0.4);
    }
    to {
        text-shadow: 0 0 18px rgba(255, 71, 87, 0.9);
        transform: scale(1.03);
    }
}

/* ── 警告大字 ────────────────────────────────────────────── */
.alert-text {
    font-size: 1.5rem;
    font-weight: bold;
    color: #ff4757;
    text-shadow: 0 0 15px rgba(255, 71, 87, 0.6);
    animation: alertPulse 1s infinite alternate;
}
@keyframes alertPulse {
    from {
        transform: scale(1);
        text-shadow: 0 0 12px rgba(255, 71, 87, 0.5);
    }
    to {
        transform: scale(1.05);
        text-shadow: 0 0 24px rgba(255, 71, 87, 0.9);
    }
}
.alert-fade-enter-active,
.alert-fade-leave-active {
    transition: all 0.3s;
}
.alert-fade-enter-from,
.alert-fade-leave-to {
    opacity: 0;
    transform: scale(0.8);
}

/* ── 時間表 ──────────────────────────────────────────────── */
.schedule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    font-size: 0.95rem;
    font-variant-numeric: tabular-nums;
    border: 1px solid transparent;
    transition: all 0.4s;
}
.item-next {
    background: rgba(255, 165, 0, 0.12);
    border-color: rgba(255, 165, 0, 0.6);
    color: #ffbe76;
    font-weight: bold;
    animation: borderGlow 1.5s infinite alternate;
}
.item-alerting {
    background: rgba(255, 71, 87, 0.15);
    border-color: rgba(255, 71, 87, 0.8);
    color: #ff6b81;
    font-weight: bold;
    animation: borderAlert 0.5s infinite alternate;
}
.item-badge {
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: bold;
    flex-shrink: 0;
}
.badge-next {
    background: #ffa500;
    color: #000;
}
.badge-alert {
    background: #ff4757;
    color: #fff;
}

@keyframes borderGlow {
    from {
        box-shadow: 0 0 4px rgba(255, 165, 0, 0.2);
    }
    to {
        box-shadow: 0 0 16px rgba(255, 165, 0, 0.5);
    }
}
@keyframes borderAlert {
    from {
        box-shadow: 0 0 4px rgba(255, 71, 87, 0.3);
    }
    to {
        box-shadow: 0 0 20px rgba(255, 71, 87, 0.7);
    }
}

/* ── 設定 ────────────────────────────────────────────────── */
.st-select,
.st-input {
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 6px;
    color: #e5e7eb;
    padding: 3px 8px;
    font-size: 0.8rem;
    outline: none;
    transition: border-color 0.2s;
}
.st-select:focus,
.st-input:focus {
    border-color: #4facfe;
}

/* ── 設定列滑入動畫 ──────────────────────────────────────── */
.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.25s ease;
    overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    max-height: 0;
    padding-top: 0;
    padding-bottom: 0;
}
.slide-down-enter-to,
.slide-down-leave-from {
    max-height: 200px;
}
</style>
