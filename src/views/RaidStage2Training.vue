<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

type WarningColor = 'red' | 'cyan' | 'yellow';
type WarningKind = 'periodic' | 'random';
type LineType = 'row' | 'col';
type GamePhase = 'ready' | 'playing' | 'celebrating' | 'lost';
type AxisKey = 'left' | 'center' | 'right';
type ControlMode = 'mouse' | 'keyboard';

interface ActiveWarning {
    id: number;
    type: LineType;
    axis: AxisKey;
    color: WarningColor;
    kind: WarningKind;
    startedAt: number;
}

interface Point { x: number; y: number; }
interface Range { start: number; size: number; }

const TARGET_SURVIVAL_MS = 15_000;
const CEREMONY_MS = 5_000;
const CEREMONY_WARNING_SPEED_MULTIPLIER = 1.2;
const FADE_INTO_DARK_MS = 2_000;
const DESKTOP_BOARD_SIZE = 660;
const MOBILE_SIDE_MARGIN = 24;
const DESKTOP_SIDE_MARGIN = 220;
const MOBILE_CLICK_AREA_PADDING = 8;
const DESKTOP_CLICK_AREA_PADDING = 60;
const BASE_PLAYER_SIZE = 28.8;
const OUTER_BAND_RATIO = 0.25;
const CENTER_BAND_RATIO = 0.5;
const WARNING_TOTAL_MS = 1000;
const WARNING_RED_MS = 500;
const WARNING_CYAN_MS = 500;
const WARNING_YELLOW_VISIBLE_MS = 90;
const RANDOM_WARNING_CHANCE = 0.3;
const RANDOM_WARNING_MIN_DELAY_MS = 100;
const PERIODIC_START_MIN_MS = 1_000;
const PERIODIC_START_MAX_MS = 2_000;
const PERIODIC_GAPS_MS = [1260, 1080, 945, 810, 756] as const;
const PLAYER_SPEED_PER_SECOND_RATIO = 2.5;

const START_WARNING_MESSAGE = '帷幕的力量開始甦醒...';
const CLEAR_WARNING_MESSAGE = '通關！能量共鳴，帷幕之力完全覺醒';
const LOSE_MESSAGE = '你的失誤讓大家陣亡了';

const CONTROL_LABELS: Record<ControlMode, string> = { mouse: '滑鼠', keyboard: '鍵盤' };
const AXIS_KEYS: readonly AxisKey[] = ['left', 'center', 'right'];

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);
const randomChoice = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

function getSegments(boardSize: number) {
    return {
        left: { start: 0, size: boardSize * OUTER_BAND_RATIO },
        center: { start: boardSize * OUTER_BAND_RATIO, size: boardSize * CENTER_BAND_RATIO },
        right: { start: boardSize * (OUTER_BAND_RATIO + CENTER_BAND_RATIO), size: boardSize * OUTER_BAND_RATIO },
    } as const;
}

function getFullWarningBandSize(boardSize: number) {
    return boardSize * CENTER_BAND_RATIO;
}

function getAxisByCoordinate(value: number, boardSize: number): AxisKey {
    const segments = getSegments(boardSize);
    if (value < segments.center.start) return 'left';
    if (value < segments.right.start) return 'center';
    return 'right';
}

function getAxisBandRange(axis: AxisKey, boardSize: number): Range {
    const segments = getSegments(boardSize);
    const centerStart = segments.center.start;
    const centerEnd = segments.center.start + segments.center.size;
    const fullWarningBandSize = getFullWarningBandSize(boardSize);
    if (axis === 'center') return { start: centerStart, size: fullWarningBandSize };
    if (axis === 'left') return { start: centerStart - fullWarningBandSize, size: fullWarningBandSize };
    return { start: centerEnd, size: fullWarningBandSize };
}

function getLineColor(color: WarningColor): string {
    if (color === 'red') return 'rgba(239,68,68,0.38)';
    if (color === 'cyan') return 'rgba(103,232,249,0.34)';
    return 'rgba(254,240,138,0.48)';
}

function getEdgeColor(color: WarningColor): string {
    if (color === 'red') return 'rgba(252,165,165,0.32)';
    if (color === 'cyan') return 'rgba(165,243,252,0.28)';
    return 'rgba(254,249,195,0.34)';
}

// ── Component state ───────────────────────────────────────────────────────────

const phase = ref<GamePhase>('ready');
const timeLeft = ref(TARGET_SURVIVAL_MS / 1000);
const message = ref('');
const messageVisible = ref(false);
const screenDarkness = ref(0);
const player = ref<Point>({ x: DESKTOP_BOARD_SIZE / 2, y: DESKTOP_BOARD_SIZE / 2 });
const warnings = ref<ActiveWarning[]>([]);
const speedMultiplier = ref(1.0);
const controlMode = ref<ControlMode>('mouse');
const arenaRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const gameAreaRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1280);
const gameAreaHeight = ref(400);

// Non-reactive mutable state for game loop (avoids stale closures)
let animationFrameId: number | null = null;
let periodicTimeoutId: number | null = null;
let fadeTimeoutId: number | null = null;
let ceremonyTimeoutId: number | null = null;
const pendingTimeouts: number[] = [];
let warningIdCounter = 0;
const pressedKeys: Record<string, boolean> = {
    ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false,
};
let periodicIndex = 0;
// Mirror refs for use inside rAF/timeout callbacks without stale captures
let playerInternal: Point = { x: DESKTOP_BOARD_SIZE / 2, y: DESKTOP_BOARD_SIZE / 2 };
let targetInternal: Point = { x: DESKTOP_BOARD_SIZE / 2, y: DESKTOP_BOARD_SIZE / 2 };
let insideAccumulatedMs = 0;
let enteredArenaMessageShown = false;
let clearMessageShown = false;

// ── Computed ──────────────────────────────────────────────────────────────────

const isMobile = computed(() => containerWidth.value < 768);

const boardSize = computed(() => {
    const horizontalMargin = isMobile.value ? MOBILE_SIDE_MARGIN : DESKTOP_SIDE_MARGIN;
    const availableWidth = containerWidth.value - horizontalMargin;
    const availableHeight = gameAreaHeight.value - (clickAreaPadding.value * 2) - 16;
    return Math.max(200, Math.min(DESKTOP_BOARD_SIZE, availableWidth, availableHeight));
});

const clickAreaPadding = computed(() => isMobile.value ? MOBILE_CLICK_AREA_PADDING : DESKTOP_CLICK_AREA_PADDING);

const playerSize = computed(() => (boardSize.value / DESKTOP_BOARD_SIZE) * BASE_PLAYER_SIZE * 2);

const playerRadius = computed(() => playerSize.value / 2);

const arenaRadius = computed(() => boardSize.value / 2 - playerRadius.value);

const segments = computed(() => getSegments(boardSize.value));
const verticalLines = computed(() => [segments.value.center.start, segments.value.right.start]);
const horizontalLines = computed(() => verticalLines.value);

const warningBands = computed(() => warnings.value.map(w => {
    const segment = getAxisBandRange(w.axis, boardSize.value);
    const edgeThickness = Math.max(6, boardSize.value * 0.012);
    return { ...w, segment, edgeThickness, lineColor: getLineColor(w.color), edgeColor: getEdgeColor(w.color) };
}));

// ── Helpers ───────────────────────────────────────────────────────────────────

function clearAllTimers() {
    if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    if (periodicTimeoutId !== null) window.clearTimeout(periodicTimeoutId);
    if (fadeTimeoutId !== null) window.clearTimeout(fadeTimeoutId);
    if (ceremonyTimeoutId !== null) window.clearTimeout(ceremonyTimeoutId);
    pendingTimeouts.forEach(id => window.clearTimeout(id));
    pendingTimeouts.length = 0;
    animationFrameId = null;
    periodicTimeoutId = null;
    fadeTimeoutId = null;
    ceremonyTimeoutId = null;
}

function registerTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
        const idx = pendingTimeouts.indexOf(id);
        if (idx !== -1) pendingTimeouts.splice(idx, 1);
        callback();
    }, delay);
    pendingTimeouts.push(id);
    return id;
}

function showTimedMessage(text: string, visibleMs: number) {
    message.value = text;
    messageVisible.value = true;
    registerTimeout(() => { messageVisible.value = false; }, visibleMs);
}

function isOutsideArena(point: Point) {
    const cx = boardSize.value / 2;
    const cy = boardSize.value / 2;
    return Math.hypot(point.x - cx, point.y - cy) > arenaRadius.value;
}

function isInsideWarning(type: LineType, axis: AxisKey) {
    const cur = playerInternal;
    const range = getAxisBandRange(axis, boardSize.value);
    const pr = playerRadius.value;
    if (type === 'row') return cur.y + pr >= range.start && cur.y - pr <= range.start + range.size;
    return cur.x + pr >= range.start && cur.x - pr <= range.start + range.size;
}

function resetToReady() {
    clearAllTimers();
    warnings.value = [];
    phase.value = 'ready';
    screenDarkness.value = 0;
    message.value = '';
    messageVisible.value = false;
    timeLeft.value = TARGET_SURVIVAL_MS / 1000;
    insideAccumulatedMs = 0;
    enteredArenaMessageShown = false;
    clearMessageShown = false;
    periodicIndex = 0;
    const center: Point = { x: boardSize.value / 2, y: boardSize.value / 2 };
    player.value = { ...center };
    playerInternal = { ...center };
    targetInternal = { ...center };
}

function endGame(result: GamePhase, text?: string) {
    clearAllTimers();
    warnings.value = [];
    phase.value = result;
    screenDarkness.value = 0;
    message.value = text ?? '';
    messageVisible.value = !!text;

    if (result === 'celebrating') {
        ceremonyTimeoutId = window.setTimeout(() => resetToReady(), CEREMONY_MS);
    }
}

function createWarning(type: LineType, axis: AxisKey, kind: WarningKind) {
    if (phase.value !== 'playing' && phase.value !== 'celebrating') return;

    const id = ++warningIdCounter;
    const w: ActiveWarning = { id, type, axis, color: 'red', kind, startedAt: Date.now() };
    warnings.value = [...warnings.value, w];

    registerTimeout(() => {
        warnings.value = warnings.value.map(x => x.id === id ? { ...x, color: 'cyan' as WarningColor } : x);
    }, WARNING_RED_MS);

    registerTimeout(() => {
        warnings.value = warnings.value.map(x => x.id === id ? { ...x, color: 'yellow' as WarningColor } : x);
        if (phase.value === 'playing' && insideAccumulatedMs < TARGET_SURVIVAL_MS && isInsideWarning(type, axis)) {
            endGame('lost', LOSE_MESSAGE);
        }
    }, WARNING_RED_MS + WARNING_CYAN_MS);

    registerTimeout(() => {
        warnings.value = warnings.value.filter(x => x.id !== id);
    }, WARNING_TOTAL_MS + WARNING_YELLOW_VISIBLE_MS);
}

function maybeScheduleRandomWarning(periodicType: LineType, periodicAxis: AxisKey, gap: number) {
    if (phase.value !== 'playing' && phase.value !== 'celebrating') return;
    if (Math.random() > RANDOM_WARNING_CHANCE) return;
    if (gap <= RANDOM_WARNING_MIN_DELAY_MS) return;

    const delay = randomBetween(RANDOM_WARNING_MIN_DELAY_MS, Math.max(RANDOM_WARNING_MIN_DELAY_MS, gap - 20));
    registerTimeout(() => {
        if (phase.value !== 'playing' && phase.value !== 'celebrating') return;
        const randomType: LineType = Math.random() > 0.5 ? 'row' : 'col';
        let randomAxis: AxisKey = randomChoice(AXIS_KEYS);
        if (randomType === periodicType && randomAxis === periodicAxis) {
            randomAxis = randomChoice(AXIS_KEYS.filter(a => a !== periodicAxis));
        }
        createWarning(randomType, randomAxis, 'random');
    }, delay);
}

function schedulePeriodicWarning() {
    if (phase.value !== 'playing' && phase.value !== 'celebrating') return;

    let type: LineType;
    let axis: AxisKey;

    if (phase.value === 'celebrating') {
        type = Math.random() > 0.5 ? 'row' : 'col';
        axis = randomChoice(AXIS_KEYS);
    } else {
        type = Math.random() > 0.5 ? 'row' : 'col';
        axis = type === 'row'
            ? getAxisByCoordinate(playerInternal.y, boardSize.value)
            : getAxisByCoordinate(playerInternal.x, boardSize.value);
    }

    createWarning(type, axis, 'periodic');

    const baseGap = PERIODIC_GAPS_MS[Math.min(periodicIndex, PERIODIC_GAPS_MS.length - 1)];
    const effectiveGap = phase.value === 'celebrating' ? baseGap / CEREMONY_WARNING_SPEED_MULTIPLIER : baseGap;

    maybeScheduleRandomWarning(type, axis, effectiveGap);

    if (periodicIndex < PERIODIC_GAPS_MS.length - 1) periodicIndex++;
    periodicTimeoutId = window.setTimeout(schedulePeriodicWarning, effectiveGap);
}

function startMovementLoop() {
    let lastTime = performance.now();

    const tick = (now: number) => {
        if (phase.value !== 'playing' && phase.value !== 'celebrating') return;

        const deltaSeconds = (now - lastTime) / 1000;
        lastTime = now;

        const cur = playerInternal;
        const tgt = targetInternal;
        const dx = tgt.x - cur.x;
        const dy = tgt.y - cur.y;
        const distance = Math.hypot(dx, dy);
        const maxStep = boardSize.value * PLAYER_SPEED_PER_SECOND_RATIO * speedMultiplier.value * deltaSeconds;

        if (controlMode.value === 'mouse' && distance > 0.01) {
            const next: Point = distance <= maxStep
                ? { ...tgt }
                : { x: cur.x + (dx / distance) * maxStep, y: cur.y + (dy / distance) * maxStep };
            playerInternal = next;
            player.value = { ...next };
        }

        if (controlMode.value === 'keyboard') {
            const horizontal = (pressedKeys.ArrowRight ? 1 : 0) - (pressedKeys.ArrowLeft ? 1 : 0);
            const vertical = (pressedKeys.ArrowDown ? 1 : 0) - (pressedKeys.ArrowUp ? 1 : 0);
            const keyDist = Math.hypot(horizontal, vertical);
            if (keyDist > 0) {
                const next: Point = {
                    x: cur.x + (horizontal / keyDist) * maxStep,
                    y: cur.y + (vertical / keyDist) * maxStep,
                };
                playerInternal = next;
                targetInternal = { ...next };
                player.value = { ...next };
            }
        }

        const outside = isOutsideArena(playerInternal);
        if (phase.value === 'playing' && !outside) {
            insideAccumulatedMs += deltaSeconds * 1000;
            const nextTime = Math.max(0, (TARGET_SURVIVAL_MS - insideAccumulatedMs) / 1000);
            timeLeft.value = nextTime;

            if (!enteredArenaMessageShown) {
                enteredArenaMessageShown = true;
                showTimedMessage(START_WARNING_MESSAGE, 1000);
            }

            if (!clearMessageShown && insideAccumulatedMs >= TARGET_SURVIVAL_MS) {
                clearMessageShown = true;
                showTimedMessage(CLEAR_WARNING_MESSAGE, 2000);
                phase.value = 'celebrating';
                timeLeft.value = 0;
                ceremonyTimeoutId = window.setTimeout(() => resetToReady(), CEREMONY_MS);
            }
        }

        animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
}

function startGame() {
    clearAllTimers();

    const cx = boardSize.value / 2;
    const cy = boardSize.value / 2;
    const angle = Math.random() * Math.PI * 2;
    const distance = boardSize.value / 2 + playerRadius.value + randomBetween(24, 120);
    const startPoint: Point = { x: cx + Math.cos(angle) * distance, y: cy + Math.sin(angle) * distance };

    player.value = { ...startPoint };
    playerInternal = { ...startPoint };
    targetInternal = { ...startPoint };
    warnings.value = [];
    phase.value = 'playing';
    timeLeft.value = TARGET_SURVIVAL_MS / 1000;
    screenDarkness.value = 0;
    message.value = '';
    messageVisible.value = false;
    enteredArenaMessageShown = false;
    clearMessageShown = false;
    insideAccumulatedMs = 0;
    periodicIndex = 0;
    pressedKeys.ArrowUp = false;
    pressedKeys.ArrowDown = false;
    pressedKeys.ArrowLeft = false;
    pressedKeys.ArrowRight = false;

    requestAnimationFrame(() => { screenDarkness.value = 0.78; });
    startMovementLoop();

    fadeTimeoutId = window.setTimeout(() => {
        const firstDelay = randomBetween(PERIODIC_START_MIN_MS, PERIODIC_START_MAX_MS);
        periodicTimeoutId = window.setTimeout(schedulePeriodicWarning, firstDelay);
    }, FADE_INTO_DARK_MS);
}

// ── Event handlers ────────────────────────────────────────────────────────────

function handleAreaClick(event: MouseEvent) {
    if (phase.value !== 'playing' && phase.value !== 'celebrating') return;
    if (!arenaRef.value) return;
    if (controlMode.value !== 'mouse') return;
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;

    const rect = arenaRef.value.getBoundingClientRect();
    targetInternal = { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

onMounted(() => {
    let resizeObserver: ResizeObserver | null = null;
    resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target === containerRef.value) {
                containerWidth.value = entry.target.clientWidth;
            } else if (entry.target === gameAreaRef.value) {
                gameAreaHeight.value = entry.target.clientHeight;
            }
        }
    });
    if (containerRef.value) {
        resizeObserver.observe(containerRef.value);
        containerWidth.value = containerRef.value.clientWidth;
    }
    if (gameAreaRef.value) {
        resizeObserver.observe(gameAreaRef.value);
        gameAreaHeight.value = gameAreaRef.value.clientHeight;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
        if (controlMode.value !== 'keyboard') return;
        e.preventDefault();
        pressedKeys[e.key] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            pressedKeys[e.key] = false;
        }
    };
    const handleBlur = () => {
        pressedKeys.ArrowUp = false;
        pressedKeys.ArrowDown = false;
        pressedKeys.ArrowLeft = false;
        pressedKeys.ArrowRight = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    onUnmounted(() => {
        clearAllTimers();
        resizeObserver?.disconnect();
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        window.removeEventListener('blur', handleBlur);
    });
});
</script>

<template>
    <div
        ref="containerRef"
        class="h-full overflow-hidden flex flex-col bg-gray-900 text-gray-100"
    >
        <!-- 控制欄 -->
        <div class="flex-shrink-0 flex items-center justify-between gap-3 w-full px-4 py-2 bg-gray-800 border-b border-gray-700">
            <span class="text-sm font-bold text-gray-100 whitespace-nowrap">2關機制練習</span>

            <div class="flex items-center gap-2 flex-wrap justify-end">
                <!-- 控制模式 -->
                <div class="flex items-center gap-1 rounded-xl bg-gray-700 border border-gray-600 px-2 py-1">
                    <button
                        v-for="mode in (Object.keys(CONTROL_LABELS) as ControlMode[])"
                        :key="mode"
                        @click="controlMode = mode"
                        :class="[
                            'px-2 py-1 rounded-lg text-xs font-medium transition',
                            controlMode === mode ? 'bg-accent text-gray-900' : 'text-gray-300 hover:bg-gray-600',
                        ]"
                    >{{ CONTROL_LABELS[mode] }}</button>
                </div>

                <!-- 速度滑條 -->
                <div class="flex items-center gap-1.5">
                    <span class="text-xs text-gray-400 whitespace-nowrap">速度</span>
                    <input type="range" min="0.4" max="1.5" step="0.05" v-model.number="speedMultiplier" class="speed-slider" />
                    <span class="text-xs text-gray-300 w-7 text-right">{{ speedMultiplier.toFixed(1) }}x</span>
                </div>

                <button
                    @click="startGame"
                    class="px-4 py-1.5 rounded-xl bg-accent text-gray-900 font-semibold hover:brightness-110 active:scale-[0.98] transition text-sm whitespace-nowrap"
                >開始</button>
            </div>
        </div>

        <!-- 遊戲區域（佔剩餘高度） -->
        <div
            ref="gameAreaRef"
            @click="handleAreaClick"
            class="relative flex-1 min-h-0 flex items-center justify-center"
            :style="{ padding: clickAreaPadding + 'px' }"
        >
                <!-- 計時器 -->
                <div class="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                    <span class="text-3xl font-bold tabular-nums text-accent drop-shadow-[0_0_8px_rgba(0,0,0,0.9)]">{{ timeLeft.toFixed(3) }}</span>
                </div>

                <!-- 訊息 -->
                <div class="absolute left-1/2 top-[42%] z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center whitespace-nowrap px-3 md:px-6">
                    <div
                        :class="[
                            'text-[14px] sm:text-[16px] md:text-[26px] font-semibold tracking-tight text-gray-100',
                            'drop-shadow-[0_0_14px_rgba(0,0,0,0.5)] transition-all duration-700',
                            messageVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
                        ]"
                    >{{ message }}</div>
                </div>

                <!-- 競技場 -->
                <div
                    ref="arenaRef"
                    class="relative overflow-visible border-4 border-gray-400/50 cursor-crosshair select-none"
                    :style="{
                        width: boardSize + 'px',
                        height: boardSize + 'px',
                        borderRadius: '999px',
                        background: 'rgba(17,24,39,0.15)',
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.06), 0 0 32px rgba(251,191,36,0.08), inset 0 0 20px rgba(255,255,255,0.04)',
                    }"
                >
                    <!-- 底層 -->
                    <div class="absolute inset-0 rounded-full bg-white/30" />

                    <!-- 暗幕淡入 -->
                    <div
                        class="absolute inset-0 rounded-full bg-gray-900 pointer-events-none transition-opacity ease-linear"
                        :style="{ opacity: screenDarkness, transitionDuration: FADE_INTO_DARK_MS + 'ms' }"
                    />

                    <!-- 警告帶 -->
                    <template v-for="w in warningBands" :key="w.id">
                        <!-- 橫向 -->
                        <template v-if="w.type === 'row'">
                            <div
                                class="absolute left-[-50vw] right-[-50vw] pointer-events-none transition-[background-color] duration-150"
                                :style="{ top: w.segment.start + 'px', height: w.segment.size + 'px', backgroundColor: w.lineColor }"
                            />
                            <div
                                class="absolute left-[-50vw] right-[-50vw] pointer-events-none transition-[background-color] duration-150"
                                :style="{ top: (w.segment.start - w.edgeThickness / 2) + 'px', height: w.edgeThickness + 'px', backgroundColor: w.edgeColor }"
                            />
                            <div
                                class="absolute left-[-50vw] right-[-50vw] pointer-events-none transition-[background-color] duration-150"
                                :style="{ top: (w.segment.start + w.segment.size - w.edgeThickness / 2) + 'px', height: w.edgeThickness + 'px', backgroundColor: w.edgeColor }"
                            />
                        </template>
                        <!-- 縱向 -->
                        <template v-else>
                            <div
                                class="absolute top-[-50vh] bottom-[-50vh] pointer-events-none transition-[background-color] duration-150"
                                :style="{ left: w.segment.start + 'px', width: w.segment.size + 'px', backgroundColor: w.lineColor }"
                            />
                            <div
                                class="absolute top-[-50vh] bottom-[-50vh] pointer-events-none transition-[background-color] duration-150"
                                :style="{ left: (w.segment.start - w.edgeThickness / 2) + 'px', width: w.edgeThickness + 'px', backgroundColor: w.edgeColor }"
                            />
                            <div
                                class="absolute top-[-50vh] bottom-[-50vh] pointer-events-none transition-[background-color] duration-150"
                                :style="{ left: (w.segment.start + w.segment.size - w.edgeThickness / 2) + 'px', width: w.edgeThickness + 'px', backgroundColor: w.edgeColor }"
                            />
                        </template>
                    </template>

                    <!-- 格線 -->
                    <div class="absolute inset-0 rounded-full overflow-hidden">
                        <div
                            v-for="(line, i) in verticalLines"
                            :key="'v-' + i"
                            class="absolute top-0 bottom-0 w-px bg-white/10"
                            :style="{ left: line + 'px' }"
                        />
                        <div
                            v-for="(line, i) in horizontalLines"
                            :key="'h-' + i"
                            class="absolute left-0 right-0 h-px bg-white/10"
                            :style="{ top: line + 'px' }"
                        />
                    </div>

                    <!-- 玩家 -->
                    <div
                        class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200 ring-8 ring-cyan-100/20 transition-none"
                        :style="{
                            left: player.x + 'px',
                            top: player.y + 'px',
                            width: playerSize + 'px',
                            height: playerSize + 'px',
                            boxShadow: '0 0 14px rgba(165,243,252,0.7)',
                        }"
                    />
                </div>
        </div>
    </div>
</template>

<style scoped>
.speed-slider {
    -webkit-appearance: none;
    width: 80px;
    height: 5px;
    background: #4b5563;
    border-radius: 3px;
    cursor: pointer;
    outline: none;
}
.speed-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fbbf24;
    cursor: pointer;
    border: 1px solid #111827;
}
.speed-slider::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fbbf24;
    cursor: pointer;
    border: 1px solid #111827;
}
</style>
