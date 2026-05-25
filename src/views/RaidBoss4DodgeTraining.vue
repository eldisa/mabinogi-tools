<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";

// ── Constants ──────────────────────────────────────────────────────────────
const INITIAL_TIME = 2 * 60;
const MAX_STACKS = 6;
const PLAYER_RADIUS = 14;
const BALL_RADIUS = 18;
const ARENA_MARGIN = 28;
const SKILL_STUN_MS = 500;
const SKILL_DMG_W = 200;
const PLAYER_SPEED = 240; // px/sec

interface Ball { id: number; x: number; y: number; vx: number; vy: number; type: 1 | 2 }

// ── Settings ───────────────────────────────────────────────────────────────
const showSettings  = ref(false);
const ballCount     = useLocalStorage("raid-boss4-dodge:ballCount", 10);
const speedMult     = useLocalStorage("raid-boss4-dodge:speedMult", 1.0);
const type2Chance   = useLocalStorage("raid-boss4-dodge:type2Chance", 35);
const playerSpeedMult = useLocalStorage("raid-boss4-dodge:playerSpeedMult", 1.0);
const visionRange   = useLocalStorage("raid-boss4-dodge:visionRange", 60); // % of fieldR

// ── UI reactive state ──────────────────────────────────────────────────────
const canvasRef = ref<HTMLCanvasElement | null>(null);
const stacksRef = ref(0);
const receivedDmgRef = ref(0);   // % damage received
const totalDmgRef = ref(0);      // 万 damage dealt via skills
const timeLeftRef = ref(INITIAL_TIME);
const gameStateRef = ref<"idle" | "countdown" | "active" | "dead" | "clear">("idle");
const countdownNum = ref(0);
const statusRef = ref("");
const castingSkillIdx = ref(-1); // 0-3 or -1
const skillUseCounts = ref([0, 0, 0, 0]);

// ── Internal game state (not reactive, updated in game loop) ───────────────
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let fogCanvas: HTMLCanvasElement | null = null;
let fogCtx: CanvasRenderingContext2D | null = null;
let animId: number | null = null;
let timerId: ReturnType<typeof setInterval> | null = null;
let lastTs = 0;

let cx = 0, cy = 0, fieldR = 0;
let px = 0, py = 0, tx = 0, ty = 0;
let balls: Ball[] = [];
let ballIdSeq = 0;
let stunMs = 0;
let gameState = "idle";
let stacks = 0;
const heldKeys = new Set<string>();

// ── Computed ───────────────────────────────────────────────────────────────
const stacksClass = computed(() => {
    const s = stacksRef.value;
    if (s <= 2) return "safe";
    if (s <= 4) return "warn";
    return "danger";
});

// ── Geometry ───────────────────────────────────────────────────────────────
function resize() {
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || window.innerHeight;
    const m = Math.min(canvas.width, canvas.height);
    fieldR = m / 2 - ARENA_MARGIN;
    cx = canvas.width  / 2;
    cy = canvas.height / 2;
}

function clamp(x: number, y: number, r = PLAYER_RADIUS) {
    const dx = x - cx, dy = y - cy;
    const d = Math.hypot(dx, dy), max = fieldR - r;
    if (d > max) {
        const a = Math.atan2(dy, dx);
        return { x: cx + max * Math.cos(a), y: cy + max * Math.sin(a) };
    }
    return { x, y };
}

// ── Ball helpers ───────────────────────────────────────────────────────────
function makeBall(awayFromPlayer = false): Ball {
    const pAngle = Math.atan2(py - cy, px - cx);
    const baseAngle = awayFromPlayer
        ? pAngle + Math.PI + (Math.random() - 0.5) * 1.4
        : Math.random() * Math.PI * 2;
    const r   = fieldR * (0.3 + Math.random() * 0.55);
    const bx  = cx + r * Math.cos(baseAngle);
    const by  = cy + r * Math.sin(baseAngle);
    const va  = Math.random() * Math.PI * 2;
    const spd = (70 + Math.random() * 90) * speedMult.value;
    const type: 1 | 2 = Math.random() * 100 >= type2Chance.value ? 1 : 2;
    return { id: ballIdSeq++, x: bx, y: by, vx: Math.cos(va) * spd, vy: Math.sin(va) * spd, type };
}

function spawnBalls() {
    const safeR = fieldR * 0.38;
    balls = Array.from({ length: ballCount.value }, () => {
        let b = makeBall(false);
        for (let i = 0; i < 40 && Math.hypot(b.x - px, b.y - py) < safeR; i++) {
            b = makeBall(false);
        }
        return b;
    });
}

function updateBalls(dt: number) {
    for (const b of balls) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        const dx = b.x - cx, dy = b.y - cy;
        const d = Math.hypot(dx, dy), max = fieldR - BALL_RADIUS;
        if (d > max) {
            const nx = dx / d, ny = dy / d;
            const dot = b.vx * nx + b.vy * ny;
            b.vx -= 2 * dot * nx;
            b.vy -= 2 * dot * ny;
            b.x -= nx * (d - max);
            b.y -= ny * (d - max);
        }
    }
}

function checkHits() {
    if (stacks >= MAX_STACKS) return;
    const hitIds: number[] = [];
    for (const b of balls) {
        if (Math.hypot(b.x - px, b.y - py) < PLAYER_RADIUS + BALL_RADIUS) {
            hitIds.push(b.id);
            const gain = b.type === 1 ? 1 : 2;
            stacks += gain;
            receivedDmgRef.value += gain * 50;
            if (stacks >= MAX_STACKS) break;
        }
    }
    stacksRef.value = Math.min(stacks, MAX_STACKS);
    if (hitIds.length) {
        balls = balls.filter(b => !hitIds.includes(b.id));
        if (stacks < MAX_STACKS) hitIds.forEach(() => balls.push(makeBall(true)));
    }
    if (stacks >= MAX_STACKS) endGame("dead");
}

// ── Player movement ────────────────────────────────────────────────────────
function movePlayer(dt: number) {
    if (stunMs > 0) return;
    let dx = 0, dy = 0;
    if (heldKeys.has("ArrowUp")    || heldKeys.has("KeyW")) dy -= 1;
    if (heldKeys.has("ArrowDown")  || heldKeys.has("KeyS")) dy += 1;
    if (heldKeys.has("ArrowLeft")  || heldKeys.has("KeyA")) dx -= 1;
    if (heldKeys.has("ArrowRight") || heldKeys.has("KeyD")) dx += 1;
    const spd = PLAYER_SPEED * playerSpeedMult.value;
    if (dx || dy) {
        const len = Math.hypot(dx, dy);
        const c = clamp(px + (dx / len) * spd * dt, py + (dy / len) * spd * dt);
        px = c.x; py = c.y; tx = px; ty = py;
    } else {
        const ddx = tx - px, ddy = ty - py;
        const dist = Math.hypot(ddx, ddy);
        if (dist > 1.5) {
            const step = Math.min(dist, spd * dt);
            const c = clamp(px + (ddx / dist) * step, py + (ddy / dist) * step);
            px = c.x; py = c.y;
        }
    }
}

// ── Fog of war ─────────────────────────────────────────────────────────────
function drawFog() {
    if (visionRange.value >= 100) return;
    const visionR = fieldR * (visionRange.value / 100);

    // 確保 offscreen canvas 尺寸正確
    if (!fogCanvas || fogCanvas.width !== canvas.width || fogCanvas.height !== canvas.height) {
        fogCanvas = document.createElement("canvas");
        fogCanvas.width  = canvas.width;
        fogCanvas.height = canvas.height;
        fogCtx = fogCanvas.getContext("2d")!;
    }
    const fc = fogCtx!;
    fc.clearRect(0, 0, fogCanvas.width, fogCanvas.height);

    // 填滿深色霧
    fc.fillStyle = "rgba(17, 24, 39, 0.94)";
    fc.fillRect(0, 0, fogCanvas.width, fogCanvas.height);

    // 用 destination-out 在玩家位置挖出可視圓
    fc.globalCompositeOperation = "destination-out";
    const grad = fc.createRadialGradient(px, py, visionR * 0.6, px, py, visionR);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    fc.fillStyle = grad;
    fc.beginPath();
    fc.arc(px, py, visionR, 0, Math.PI * 2);
    fc.fill();
    fc.globalCompositeOperation = "source-over";

    ctx.drawImage(fogCanvas, 0, 0);
}

// ── Draw ───────────────────────────────────────────────────────────────────
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Arena
    ctx.beginPath();
    ctx.arc(cx, cy, fieldR, 0, Math.PI * 2);
    ctx.fillStyle = "#1f2937";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.28)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Boss indicator (small center)
    const bossR = fieldR * 0.07;
    ctx.beginPath();
    ctx.arc(cx, cy, bossR, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(220,80,60,0.5)";
    ctx.fill();
    ctx.strokeStyle = "#e65c3c";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "white";
    ctx.font = `bold ${Math.max(11, bossR * 0.9)}px "Noto Sans SC", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("目標", cx, cy + 4);

    // Balls — black body + white center (size indicates type)
    for (const b of balls) {
        const innerR = BALL_RADIUS * (b.type === 1 ? 0.36 : 0.68);
        // outer body (dark)
        ctx.beginPath();
        ctx.arc(b.x, b.y, BALL_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#111";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        // white center
        ctx.beginPath();
        ctx.arc(b.x, b.y, innerR, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();
    }

    // Fog of war（ボールの後、プレイヤーの前）
    drawFog();

    // Player (yellow when casting, cyan otherwise)
    ctx.beginPath();
    ctx.arc(px, py, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = stunMs > 0 ? "#fbbf24" : "#22d3ee";
    ctx.fill();
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#111";
    ctx.font = 'bold 11px "Noto Sans SC", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("你", px, py + 4);

}

// ── Game loop ──────────────────────────────────────────────────────────────
function loop(ts: number) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (gameState === "active") {
        if (stunMs > 0) stunMs = Math.max(0, stunMs - dt * 1000);
        movePlayer(dt);
        updateBalls(dt);
        checkHits();
    }

    draw();
    animId = requestAnimationFrame(loop);
}

// ── Game control ───────────────────────────────────────────────────────────
function startGame() {
    if (gameState === "active" || gameState === "countdown") return;
    // reset state
    gameState = "countdown";
    gameStateRef.value = "countdown";
    stacks = 0;
    stacksRef.value = 0;
    receivedDmgRef.value = 0;
    totalDmgRef.value = 0;
    skillUseCounts.value = [0, 0, 0, 0];
    timeLeftRef.value = INITIAL_TIME;
    statusRef.value = "";
    stunMs = 0;
    balls = [];
    px = cx; py = cy + fieldR * 0.4;
    tx = px; ty = py;

    // 3-2-1 countdown
    countdownNum.value = 3;
    const tick = setInterval(() => {
        countdownNum.value--;
        if (countdownNum.value <= 0) {
            clearInterval(tick);
            countdownNum.value = 0;
            gameState = "active";
            gameStateRef.value = "active";
            spawnBalls();
            if (timerId) clearInterval(timerId);
            timerId = setInterval(() => {
                if (gameState !== "active") return;
                timeLeftRef.value--;
                if (timeLeftRef.value <= 0) endGame("clear");
            }, 1000);
        }
    }, 1000);
}

function endGame(result: "dead" | "clear") {
    gameState = result;
    gameStateRef.value = result;
    if (timerId) { clearInterval(timerId); timerId = null; }
    statusRef.value = result === "dead"
        ? `失敗：層數已滿`
        : `✓ 通關！共增傷 ${receivedDmgRef.value}% · 打出 ${totalDmgRef.value}萬`;
}

function resetGame() {
    gameState = "idle";
    gameStateRef.value = "idle";
    stacks = 0;
    stacksRef.value = 0;
    receivedDmgRef.value = 0;
    totalDmgRef.value = 0;
    timeLeftRef.value = INITIAL_TIME;
    statusRef.value = "";
    stunMs = 0;
    balls = [];
    castingSkillIdx.value = -1;
    skillUseCounts.value = [0, 0, 0, 0];
    countdownNum.value = 0;
    if (timerId) { clearInterval(timerId); timerId = null; }
    px = cx; py = cy + fieldR * 0.4;
    tx = px; ty = py;
}

function castSkill(idx: number) {
    if (gameState !== "active" || stunMs > 0) return;
    stunMs = SKILL_STUN_MS;
    castingSkillIdx.value = idx;
    totalDmgRef.value += SKILL_DMG_W;
    skillUseCounts.value[idx]++;
    setTimeout(() => { castingSkillIdx.value = -1; }, SKILL_STUN_MS);
}

function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// ── Input ──────────────────────────────────────────────────────────────────
function onCanvasClick(e: MouseEvent) {
    if (gameState !== "active") return;
    const rect = canvas.getBoundingClientRect();
    const c = clamp(
        (e.clientX - rect.left) * (canvas.width  / rect.width),
        (e.clientY - rect.top)  * (canvas.height / rect.height),
    );
    tx = c.x; ty = c.y;
}

function onTouchStart(e: TouchEvent) {
    e.preventDefault();
    if (gameState !== "active") return;
    const t = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const c = clamp(
        (t.clientX - rect.left) * (canvas.width  / rect.width),
        (t.clientY - rect.top)  * (canvas.height / rect.height),
    );
    tx = c.x; ty = c.y;
}

function onKeydown(e: KeyboardEvent) {
    heldKeys.add(e.code);
    const skillIdx = ["Digit1", "Digit2", "Digit3", "Digit4"].indexOf(e.code);
    if (skillIdx >= 0) { e.preventDefault(); castSkill(skillIdx); }
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code)) e.preventDefault();
}

function onKeyup(e: KeyboardEvent) { heldKeys.delete(e.code); }

// ── Lifecycle ──────────────────────────────────────────────────────────────
onMounted(() => {
    canvas = canvasRef.value!;
    ctx = canvas.getContext("2d")!;
    window.addEventListener("resize", resize);
    canvas.addEventListener("click", onCanvasClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("keydown", onKeydown);
    window.addEventListener("keyup", onKeyup);
    resize();
    px = cx; py = cy + fieldR * 0.4;
    tx = px; ty = py;
    animId = requestAnimationFrame(loop);
});

onUnmounted(() => {
    if (animId !== null) cancelAnimationFrame(animId);
    if (timerId) clearInterval(timerId);
    window.removeEventListener("resize", resize);
    canvas?.removeEventListener("click", onCanvasClick);
    canvas?.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("keyup", onKeyup);
});
</script>

<template>
    <div class="wrapper">
        <!-- ── Header bar ── -->
        <div class="header-bar">
            <span class="page-title">4王65% 躲彈幕練習</span>
            <div class="header-right">
                <button
                    class="settings-btn"
                    :class="{ active: showSettings }"
                    @click="showSettings = !showSettings"
                >⚙ 設定</button>
                <button
                    v-if="gameStateRef === 'idle'"
                    class="action-btn action-start"
                    @click="startGame"
                >開始</button>
                <template v-else-if="gameStateRef === 'countdown' || gameStateRef === 'active'">
                    <button class="action-btn action-give-up" @click="resetGame">放棄</button>
                </template>
                <template v-else>
                    <button class="action-btn action-start" @click="resetGame">重置</button>
                </template>
            </div>
        </div>

        <!-- ── Settings panel (slide-down) ── -->
        <Transition name="slide-down">
            <div v-if="showSettings" class="settings-panel">
                <div class="setting-row">
                    <label>球數</label>
                    <input type="range" min="4" max="50" step="1" v-model.number="ballCount" />
                    <span>{{ ballCount }}</span>
                </div>
                <div class="setting-row">
                    <label>球速</label>
                    <input type="range" min="0.5" max="2.5" step="0.1" v-model.number="speedMult" />
                    <span>{{ speedMult.toFixed(1) }}x</span>
                </div>
                <div class="setting-row">
                    <label>2層球</label>
                    <input type="range" min="0" max="100" step="5" v-model.number="type2Chance" />
                    <span>{{ type2Chance }}%</span>
                </div>
                <div class="setting-row">
                    <label>移動速</label>
                    <input type="range" min="0.5" max="3.0" step="0.1" v-model.number="playerSpeedMult" />
                    <span>{{ playerSpeedMult.toFixed(1) }}x</span>
                </div>
                <div class="setting-row">
                    <label>視野</label>
                    <input type="range" min="10" max="100" step="5" v-model.number="visionRange" />
                    <span>{{ visionRange }}%</span>
                </div>
            </div>
        </Transition>

        <!-- ── Canvas area ── -->
        <div class="canvas-area">
            <canvas ref="canvasRef" />

            <!-- Timer -->
            <div class="timer-overlay">{{ formatTime(timeLeftRef) }}</div>

            <!-- Stacks + received damage (top-right) -->
            <div class="stats-overlay">
                <div class="stat-stacks" :class="stacksClass">
                    {{ stacksRef }}/{{ MAX_STACKS }} 層
                </div>
                <div class="stat-dmg">增傷 {{ receivedDmgRef }}%</div>
            </div>

            <!-- Skill use counts (top-left) -->
            <div class="skill-count-overlay">
                <span v-for="(cnt, i) in skillUseCounts" :key="i" class="skill-count-item">
                    <span class="skill-count-key">{{ i + 1 }}</span>
                    <span class="skill-count-val">{{ cnt }}</span>
                </span>
            </div>

            <!-- Countdown 3-2-1 -->
            <Transition name="countdown-pop">
                <div v-if="gameStateRef === 'countdown' && countdownNum > 0" class="countdown-overlay">
                    {{ countdownNum }}
                </div>
            </Transition>

            <!-- Game result / status -->
            <Transition name="status-fade">
                <div
                    v-if="statusRef"
                    class="status-overlay"
                    :class="gameStateRef"
                >{{ statusRef }}</div>
            </Transition>

            <!-- Idle hint -->
            <div v-if="gameStateRef === 'idle'" class="hint-overlay">
                點擊/觸控 移動 · WASD/方向鍵 · 鍵盤 1 2 3 4 使用技能
            </div>

            <!-- Ball legend (idle only) -->
            <div v-if="gameStateRef === 'idle'" class="legend-overlay">
                <span class="legend-item">
                    <span class="legend-ball small"></span> 小白心 +1層
                </span>
                <span class="legend-item">
                    <span class="legend-ball large"></span> 大白心 +2層
                </span>
            </div>

            <!-- Skill bar -->
            <div class="skill-bar">
                <button
                    v-for="i in 4"
                    :key="i"
                    class="skill-btn"
                    :class="{ casting: castingSkillIdx === i - 1 }"
                    :disabled="gameStateRef !== 'active'"
                    @click="castSkill(i - 1)"
                >
                    <span class="skill-key">{{ i }}</span>
                    <span class="skill-label">技能{{ i }}</span>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* ── Layout ─────────────────────────────────────────── */
.wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    min-height: calc(100vh - 57px);
    background: #111827;
    font-family: "Segoe UI", "Noto Sans SC", sans-serif;
    user-select: none;
    color: #e5e7eb;
    overflow: hidden;
}

/* ── Header ─────────────────────────────────────────── */
.header-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 16px;
    background: #1f2937;
    border-bottom: 1px solid #374151;
}

.page-title {
    font-size: 15px;
    font-weight: 700;
    color: #f9fafb;
    white-space: nowrap;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.settings-btn {
    background: #374151;
    border: 1px solid #4b5563;
    border-radius: 10px;
    color: #d1d5db;
    padding: 4px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    white-space: nowrap;
}
.settings-btn:hover  { background: #4b5563; color: #f9fafb; }
.settings-btn.active { background: #2563eb; border-color: #3b82f6; color: #fff; }

.action-btn {
    border: none;
    border-radius: 20px;
    padding: 6px 20px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
}
.action-start    { background: #fbbf24; color: #111; }
.action-start:hover { background: #fcd34d; }
.action-give-up  { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #e0e0e0; }
.action-give-up:hover { background: rgba(255,255,255,0.18); }
.action-btn:active { transform: scale(0.96); }

/* ── Settings panel ─────────────────────────────────── */
.settings-panel {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(31,41,55,0.7);
    border-bottom: 1px solid #374151;
}

.setting-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
}
.setting-row label { color: #9ca3af; min-width: 42px; white-space: nowrap; }
.setting-row input[type="range"] { width: 120px; accent-color: #fbbf24; cursor: pointer; }
.setting-row span { color: #e5e7eb; min-width: 30px; }

.slide-down-enter-active,
.slide-down-leave-active { transition: all 0.25s ease; overflow: hidden; }
.slide-down-enter-from,
.slide-down-leave-to { opacity: 0; max-height: 0; padding-top: 0; padding-bottom: 0; }
.slide-down-enter-to,
.slide-down-leave-from { max-height: 150px; }

/* ── Canvas area ────────────────────────────────────── */
.canvas-area {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
}

canvas {
    display: block;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

/* ── Overlays ───────────────────────────────────────── */
.timer-overlay {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    font-weight: bold;
    font-variant-numeric: tabular-nums;
    color: #4facfe;
    text-shadow: 0 0 12px rgba(79,172,254,0.5);
    background: rgba(17,24,39,0.65);
    padding: 2px 18px;
    border-radius: 20px;
    pointer-events: none;
    z-index: 10;
}

.stats-overlay {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    pointer-events: none;
    z-index: 10;
}

.stat-stacks {
    font-size: 1rem;
    font-weight: bold;
    background: rgba(17,24,39,0.8);
    padding: 3px 14px;
    border-radius: 20px;
    border: 1px solid #374151;
}
.stat-stacks.safe   { color: #4ade80; border-color: rgba(74,222,128,0.35); }
.stat-stacks.warn   { color: #fbbf24; border-color: rgba(251,191,36,0.4); }
.stat-stacks.danger { color: #f87171; border-color: rgba(248,113,113,0.45); animation: danger-pulse 0.7s infinite alternate; }

@keyframes danger-pulse {
    from { box-shadow: 0 0 4px rgba(248,113,113,0.3); }
    to   { box-shadow: 0 0 14px rgba(248,113,113,0.8); }
}

.stat-dmg {
    font-size: 0.82rem;
    color: #94a3b8;
    background: rgba(17,24,39,0.65);
    padding: 2px 10px;
    border-radius: 12px;
}

.skill-count-overlay {
    position: absolute;
    top: 12px;
    left: 12px;
    display: flex;
    flex-direction: column;
    gap: 3px;
    pointer-events: none;
    z-index: 10;
}

.skill-count-item {
    display: flex;
    align-items: center;
    gap: 5px;
    background: rgba(17,24,39,0.75);
    padding: 2px 10px;
    border-radius: 10px;
    border: 1px solid #374151;
}

.skill-count-key {
    font-size: 11px;
    font-weight: bold;
    color: #9ca3af;
    width: 10px;
    text-align: center;
}

.skill-count-val {
    font-size: 13px;
    font-weight: bold;
    color: #fbbf24;
    min-width: 16px;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.status-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 1.4rem;
    font-weight: bold;
    text-align: center;
    background: rgba(17,24,39,0.9);
    padding: 14px 32px;
    border-radius: 16px;
    border: 1px solid #374151;
    z-index: 20;
    pointer-events: none;
    white-space: nowrap;
}
.status-overlay.dead  { color: #f87171; border-color: rgba(248,113,113,0.45); }
.status-overlay.clear { color: #4ade80; border-color: rgba(74,222,128,0.45); }

.status-fade-enter-active,
.status-fade-leave-active { transition: all 0.3s; }
.status-fade-enter-from,
.status-fade-leave-to { opacity: 0; transform: translate(-50%, calc(-50% + 10px)); }

/* ── Countdown ───────────────────────────────────────── */
.countdown-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: clamp(5rem, 20vw, 9rem);
    font-weight: 900;
    color: #fbbf24;
    text-shadow: 0 0 40px rgba(251,191,36,0.6), 0 2px 8px rgba(0,0,0,0.8);
    pointer-events: none;
    z-index: 25;
    line-height: 1;
}

.countdown-pop-enter-active {
    animation: countdown-in 0.25s ease-out;
}
.countdown-pop-leave-active {
    animation: countdown-out 0.35s ease-in forwards;
}
@keyframes countdown-in {
    from { opacity: 0; transform: translate(-50%, -50%) scale(1.6); }
    to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes countdown-out {
    from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    to   { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
}

.hint-overlay {
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(31,41,55,0.78);
    padding: 5px 18px;
    border-radius: 20px;
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
    border: 1px solid #374151;
    pointer-events: none;
    z-index: 8;
}

.legend-overlay {
    position: absolute;
    bottom: 104px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 16px;
    pointer-events: none;
    z-index: 8;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
    background: rgba(31,41,55,0.78);
    padding: 3px 12px;
    border-radius: 12px;
    border: 1px solid #374151;
}

.legend-ball {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #111;
    border: 2px solid #000;
    position: relative;
}
.legend-ball::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: #fff;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.legend-ball.small::after { width: 7px;  height: 7px; }
.legend-ball.large::after { width: 14px; height: 14px; }

/* ── Skill bar ──────────────────────────────────────── */
.skill-bar {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    z-index: 10;
}

.skill-btn {
    width: 56px;
    height: 56px;
    border-radius: 12px;
    background: rgba(31,41,55,0.88);
    border: 2px solid #4b5563;
    color: #e5e7eb;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
}
.skill-btn:hover:not(:disabled) { border-color: #6b7280; background: rgba(55,65,81,0.92); }
.skill-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.skill-btn.casting {
    border-color: #fbbf24;
    background: rgba(251,191,36,0.22);
    transform: scale(1.08);
}

.skill-key   { font-size: 18px; font-weight: bold; line-height: 1; }
.skill-label { font-size: 9px; color: #9ca3af; }
</style>
