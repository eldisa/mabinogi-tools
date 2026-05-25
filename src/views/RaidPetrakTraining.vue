<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useLocalStorage } from "../composables/useLocalStorage";

const canvasRef = ref<HTMLCanvasElement | null>(null);

// Reactive UI state
const currentModeRef = useLocalStorage("raid-petrak:mode", 1);
const speedFactorRef = useLocalStorage("raid-petrak:speed", 1.5);
const showCheatSheet = useLocalStorage("raid-petrak:showCheatSheet", false);
const cheatMode      = useLocalStorage<"number" | "arrow">("raid-petrak:cheatMode", "number");
const showSettings   = ref(false);

// 時鐘方向 → 箭頭符號（8 個主/斜方位）
const CLOCK_TO_ARROW: Record<number, string> = {
    12: "↑",
    1:  "↗",
    3:  "→",
    5:  "↘",
    6:  "↓",
    7:  "↙",
    9:  "←",
    11: "↖",
};

const CHEAT_55 = [6, 6, 9, 12, 3, 6, 9, 11, 12];
const CHEAT_15 = [12, 5, 7, 12, 6, 1, 12, 6, 9];

function cheatDisplay(n: number): string {
    return cheatMode.value === "arrow" ? (CLOCK_TO_ARROW[n] ?? String(n)) : String(n);
}

const startBtnText = ref("開始機制");
const startBtnDisabled = ref(false);
const statusTextContent = ref("");
const willVisible = ref(false);
const willCountDisplay = ref(0);
const willBorderStyle = ref("gold");
const willBgStyle = ref("#c0392b");
const hintVisible = ref(false);

let _startGame: (() => void) | null = null;
let _animationFrameId: number | null = null;
let _bgmAudio: HTMLAudioElement | null = null;
let _cleanup: (() => void) | null = null;

const onStartBtnClick = () => _startGame?.();

onMounted(() => {
    const canvas = canvasRef.value!;
    const ctx = canvas.getContext("2d")!;

    const PLAYER_RADIUS = 14;
    const BOSS_RADIUS_RATIO = 0.15;
    const CIRCLE_MARGIN = 25;

    let gameState = "idle";
    let currentMode = 1;
    let speedFactor = 1.5;

    let centerX = 0,
        centerY = 0,
        fieldRadius = 0,
        bossRadius = 0;
    let playerX = 0,
        playerY = 0;
    let targetX = 0,
        targetY = 0;
    let attackCooldown = 0,
        attackStopTimer = 0;
    let allyX = 0,
        allyY = 0;
    let allyActive = true;
    let willStacks = 0;
    let hasWillImmunity = false;
    let phaseIndex = 0;
    let totalPhases = 9;
    let safeZonesList: number[][] = [];
    let currentSafeZones: number[] = [];
    let phaseTimer: ReturnType<typeof setTimeout> | null = null;
    let dangerAnimation = 0;
    let dangerZones: number[] = [];
    let playerMarked = false;
    let playerInvulnerable = false;
    let fixedPlayerAngle = 0;
    let lastTimestamp = 0;

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
        computeGeometry();
    }

    function computeGeometry() {
        const minDim = Math.min(canvas.width, canvas.height);
        fieldRadius = minDim / 2 - CIRCLE_MARGIN;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
        bossRadius = fieldRadius * BOSS_RADIUS_RATIO;
        allyX = centerX;
        allyY = centerY - fieldRadius * 0.6;
        if (gameState === "idle") {
            playerX = centerX;
            playerY = centerY + fieldRadius * 0.3;
            targetX = playerX;
            targetY = playerY;
        }
    }

    function clampToField(x: number, y: number) {
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.hypot(dx, dy);
        if (dist > fieldRadius - PLAYER_RADIUS) {
            const angle = Math.atan2(dy, dx);
            return {
                x: centerX + (fieldRadius - PLAYER_RADIUS) * Math.cos(angle),
                y: centerY + (fieldRadius - PLAYER_RADIUS) * Math.sin(angle),
            };
        }
        return { x, y };
    }

    function getPlayerAngle() {
        return Math.atan2(playerY - centerY, playerX - centerX);
    }

    function getSectorAngle(baseAngle: number, zoneNumber: number) {
        return baseAngle + (zoneNumber - 1) * (Math.PI / 4);
    }

    function isPointInSector(px: number, py: number, baseAngle: number, zoneNumber: number) {
        const dx = px - centerX;
        const dy = py - centerY;
        const pointAngle = Math.atan2(dy, dx);
        let diff = pointAngle - baseAngle;
        diff = ((diff % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const sectorStart = (zoneNumber - 1) * (Math.PI / 4);
        const sectorHalf = Math.PI / 8;
        let rel = diff - sectorStart;
        if (rel > Math.PI) rel -= Math.PI * 2;
        if (rel < -Math.PI) rel += Math.PI * 2;
        return Math.abs(rel) <= sectorHalf;
    }

    function isAllyInDanger(baseAngle: number) {
        if (!allyActive) return false;
        for (const zone of dangerZones) {
            if (isPointInSector(allyX, allyY, baseAngle, zone)) return true;
        }
        return false;
    }

    function getSafeZonesForMode(mode: number): number[][] {
        if (mode === 1) return [[1, 3, 5, 7], [4, 5, 6], [3, 7], [1], [7], [5], [3], [2], [1]];
        if (mode === 2) return [[1], [6], [4], [1], [5], [8], [1], [5], [3]];
        return [];
    }

    function drawField() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.arc(centerX, centerY, fieldRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#1f2937";
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(centerX, centerY, bossRadius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(180, 70, 70, 0.7)";
        ctx.fill();
        ctx.strokeStyle = "#e65c3c";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = 'bold 16px "Noto Sans SC", sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("佩塔克", centerX, centerY + 5);

        if (allyActive && (currentMode === 1 || currentMode === 2)) {
            ctx.beginPath();
            ctx.arc(allyX, allyY, 12, 0, Math.PI * 2);
            ctx.fillStyle = "#4da6ff";
            ctx.fill();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = "white";
            ctx.font = 'bold 12px "Noto Sans SC", sans-serif';
            ctx.fillText("隊友", allyX, allyY - 15);
        }

        ctx.beginPath();
        ctx.arc(playerX, playerY, PLAYER_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = playerInvulnerable && gameState === "active" ? "#ffd700" : "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.font = 'bold 14px "Noto Sans SC", sans-serif';
        ctx.textAlign = "center";
        ctx.fillText("你", playerX, playerY - PLAYER_RADIUS - 4);

        if (playerMarked && gameState === "active") {
            ctx.beginPath();
            ctx.arc(playerX, playerY, PLAYER_RADIUS + 10, 0, Math.PI * 2);
            ctx.strokeStyle = "#4da6ff";
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.fillStyle = "rgba(77, 166, 255, 0.15)";
            ctx.fill();
        }

        if (dangerAnimation > 0 && dangerZones.length > 0 && gameState === "active") {
            const baseAngle = fixedPlayerAngle;
            const progress = 1 - dangerAnimation / 2000;
            const alpha = Math.sin(progress * Math.PI) * 0.6;
            for (const zone of dangerZones) {
                const sectorCenter = getSectorAngle(baseAngle, zone);
                const startAngle = sectorCenter - Math.PI / 8;
                const endAngle = sectorCenter + Math.PI / 8;
                const currentRadius = bossRadius + (fieldRadius - bossRadius) * progress;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, currentRadius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = `rgba(70, 130, 255, ${alpha})`;
                ctx.fill();
                ctx.strokeStyle = `rgba(100, 180, 255, ${alpha * 1.5})`;
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    function stopAllTimers() {
        if (phaseTimer) clearTimeout(phaseTimer);
        phaseTimer = null;
        dangerAnimation = 0;
        playerMarked = false;
    }

    function updateWillDisplay() {
        willCountDisplay.value = willStacks;
        if (willStacks >= 5) {
            hasWillImmunity = true;
            willBorderStyle.value = "#fbbf24";
            willBgStyle.value = "#27ae60";
        } else {
            hasWillImmunity = false;
            willBorderStyle.value = "#fbbf24";
            willBgStyle.value = "#c0392b";
        }
        if (currentMode === 3) willVisible.value = true;
    }

    function resetGame() {
        stopAllTimers();
        gameState = "idle";
        phaseIndex = 0;
        willStacks = 0;
        hasWillImmunity = false;
        attackCooldown = 0;
        attackStopTimer = 0;
        dangerZones = [];
        currentSafeZones = [];
        playerInvulnerable = currentMode === 1 || currentMode === 2;
        allyActive = currentMode === 1 || currentMode === 2;
        totalPhases = currentMode === 3 ? 10 : 9;
        safeZonesList = currentMode === 3 ? [] : getSafeZonesForMode(currentMode);
        playerMarked = false;
        dangerAnimation = 0;
        fixedPlayerAngle = 0;
        updateWillDisplay();
        statusTextContent.value = "";
        startBtnDisabled.value = false;
        startBtnText.value = "開始機制";
        hintVisible.value = true;
        willVisible.value = false;
        playerX = centerX;
        playerY = centerY + fieldRadius * 0.3;
        targetX = playerX;
        targetY = playerY;
        drawField();
    }

    function failGame(reason: string) {
        if (gameState !== "active") return;
        gameState = "ended";
        stopAllTimers();
        statusTextContent.value = `失敗：${reason}`;
        startBtnDisabled.value = false;
        startBtnText.value = "重新開始";
        hintVisible.value = false;
    }

    function successGame() {
        if (gameState !== "active") return;
        gameState = "ended";
        stopAllTimers();
        statusTextContent.value = "機制通過！";
        startBtnDisabled.value = false;
        startBtnText.value = "重新開始";
        hintVisible.value = false;
    }

    function startPhase() {
        if (gameState !== "active") return;
        if (phaseIndex >= totalPhases) {
            successGame();
            return;
        }

        playerMarked = true;
        statusTextContent.value = `第 ${phaseIndex + 1}/${totalPhases} 次點名`;

        phaseTimer = setTimeout(() => {
            if (gameState !== "active") return;
            playerMarked = false;
            fixedPlayerAngle = getPlayerAngle();

            if (currentMode === 3) {
                currentSafeZones = phaseIndex === 9 ? [] : [Math.random() < 0.5 ? 2 : 8];
            } else {
                currentSafeZones = safeZonesList[phaseIndex] || [];
            }

            dangerZones = [];
            for (let z = 1; z <= 8; z++) {
                if (!currentSafeZones.includes(z)) dangerZones.push(z);
            }
            dangerAnimation = 2000;

            phaseTimer = setTimeout(() => {
                if (gameState !== "active") return;
                dangerAnimation = 0;

                const playerInDanger = dangerZones.some((z) => isPointInSector(playerX, playerY, fixedPlayerAngle, z));

                if (currentMode === 1 || currentMode === 2) {
                    if (isAllyInDanger(fixedPlayerAngle)) {
                        failGame("隊友被擊中");
                        return;
                    }
                }
                if (currentMode === 3) {
                    if (playerInDanger) {
                        if (hasWillImmunity && willStacks >= 5) {
                            willStacks = 0;
                            hasWillImmunity = false;
                            updateWillDisplay();
                            statusTextContent.value = "意志抵擋了即死！";
                        } else {
                            failGame("你被擊中");
                            return;
                        }
                    }
                }

                if (currentMode === 3 && willStacks > 0) {
                    if (Math.hypot(playerX - centerX, playerY - centerY) < bossRadius) {
                        willStacks = 0;
                        hasWillImmunity = false;
                        updateWillDisplay();
                        statusTextContent.value = "意志被剝奪！";
                    }
                }

                phaseIndex++;
                dangerZones = [];
                if (phaseIndex < totalPhases) {
                    phaseTimer = setTimeout(startPhase, 1000);
                } else {
                    successGame();
                }
            }, 2000);
        }, 500);
    }

    function startGame() {
        if (gameState === "active") return;
        currentMode = currentModeRef.value;
        speedFactor = speedFactorRef.value;
        computeGeometry();
        resetGame();

        const audioFile = Math.random() < 0.5 ? "pzopen.MP3" : "pzopen2.MP3";
        try {
            if (_bgmAudio) _bgmAudio.pause();
            _bgmAudio = new Audio(audioFile);
            _bgmAudio.volume = 0.5;
            _bgmAudio.play().catch(() => {});
        } catch (_) {}

        gameState = "active";
        startBtnDisabled.value = true;
        startBtnText.value = "進行中...";
        hintVisible.value = false;
        if (currentMode === 3) {
            willVisible.value = true;
            updateWillDisplay();
        } else {
            willVisible.value = false;
        }
        statusTextContent.value = "準備階段 (3秒)";
        phaseTimer = setTimeout(() => {
            if (gameState !== "active") return;
            startPhase();
        }, 3000);
    }

    function performAttack() {
        if (currentMode !== 3 || gameState !== "active") return;
        if (attackCooldown > 0 || willStacks >= 5) return;
        attackCooldown = 1000;
        attackStopTimer = 700;
        willStacks++;
        updateWillDisplay();
        statusTextContent.value = willStacks >= 5 ? "意志已充滿！" : `攻擊！意志層數 ${willStacks}/5`;
    }

    function handleCanvasClick(e: MouseEvent) {
        if (gameState === "ended") return;
        const rect = canvas.getBoundingClientRect();
        const clamped = clampToField(
            (e.clientX - rect.left) * (canvas.width / rect.width),
            (e.clientY - rect.top) * (canvas.height / rect.height),
        );
        targetX = clamped.x;
        targetY = clamped.y;
    }

    function handleTouchStart(e: TouchEvent) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const clamped = clampToField(
            (touch.clientX - rect.left) * (canvas.width / rect.width),
            (touch.clientY - rect.top) * (canvas.height / rect.height),
        );
        targetX = clamped.x;
        targetY = clamped.y;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "1") {
            e.preventDefault();
            performAttack();
        }
    }

    function handleResize() {
        resizeCanvas();
        if (gameState === "idle") {
            playerX = centerX;
            playerY = centerY + fieldRadius * 0.3;
            targetX = playerX;
            targetY = playerY;
        }
    }

    function gameLoop(timestamp: number) {
        if (!lastTimestamp) lastTimestamp = timestamp;
        const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
        lastTimestamp = timestamp;

        if (attackCooldown > 0) attackCooldown = Math.max(0, attackCooldown - dt * 1000);
        if (attackStopTimer > 0) attackStopTimer = Math.max(0, attackStopTimer - dt * 1000);

        if ((gameState === "active" || gameState === "idle") && attackStopTimer <= 0) {
            const dx = targetX - playerX;
            const dy = targetY - playerY;
            const dist = Math.hypot(dx, dy);
            if (dist > 1.5) {
                const step = Math.min(dist, 220 * speedFactor * dt);
                const clamped = clampToField(playerX + (dx / dist) * step, playerY + (dy / dist) * step);
                playerX = clamped.x;
                playerY = clamped.y;
            } else if (dist > 0) {
                playerX = targetX;
                playerY = targetY;
            }
        }

        if (dangerAnimation > 0) dangerAnimation = Math.max(0, dangerAnimation - dt * 1000);

        drawField();
        _animationFrameId = requestAnimationFrame(gameLoop);
    }

    _startGame = startGame;

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("click", handleCanvasClick);
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("keydown", handleKeydown);
    _cleanup = () => {
        window.removeEventListener("resize", handleResize);
        canvas.removeEventListener("click", handleCanvasClick);
        canvas.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("keydown", handleKeydown);
    };

    resizeCanvas();
    resetGame();
    _animationFrameId = requestAnimationFrame(gameLoop);
});

onUnmounted(() => {
    if (_animationFrameId !== null) cancelAnimationFrame(_animationFrameId);
    if (_bgmAudio) _bgmAudio.pause();
    _cleanup?.();
});
</script>

<template>
    <div class="petrak-wrapper">
        <!-- 頂部控制欄 -->
        <div class="controls-bar">
            <span class="page-title">1王機制練習</span>
            <div class="controls-right">
                <button
                    class="settings-btn"
                    :class="{ active: showSettings }"
                    @click="showSettings = !showSettings"
                >⚙ 設定</button>
                <button class="start-btn" :disabled="startBtnDisabled" @click="onStartBtnClick">
                    {{ startBtnText }}
                </button>
            </div>
        </div>

        <!-- 設定列（可收合） -->
        <Transition name="slide-down">
            <div v-if="showSettings" class="settings-panel">
                <!-- 模式 -->
                <div class="ctrl-group">
                    <label>模式</label>
                    <select v-model="currentModeRef">
                        <option :value="1">55%血量</option>
                        <option :value="2">15%血量</option>
                        <option :value="3">聖盾改版</option>
                    </select>
                </div>

                <!-- 速度 -->
                <div class="ctrl-group">
                    <label>速度</label>
                    <input type="range" min="1" max="3" step="0.1" v-model.number="speedFactorRef" class="speed-slider" />
                    <span class="speed-val">{{ speedFactorRef.toFixed(1) }}x</span>
                </div>

                <!-- 小抄 -->
                <div class="cheat-controls">
                    <label class="cheatsheet-toggle">
                        <input type="checkbox" v-model="showCheatSheet" />
                        顯示小抄
                    </label>
                    <Transition name="cheat-mode-slide">
                        <div v-if="showCheatSheet" class="cheat-mode-group">
                            <label class="cheat-mode-radio" :class="{ active: cheatMode === 'number' }">
                                <input type="radio" v-model="cheatMode" value="number" />
                                數字
                            </label>
                            <label class="cheat-mode-radio" :class="{ active: cheatMode === 'arrow' }">
                                <input type="radio" v-model="cheatMode" value="arrow" />
                                箭頭
                            </label>
                        </div>
                    </Transition>
                </div>
            </div>
        </Transition>

        <!-- 畫布區域 -->
        <div class="canvas-area">
            <canvas ref="canvasRef" />

            <!-- 狀態訊息 -->
            <div class="status-overlay" v-show="statusTextContent">{{ statusTextContent }}</div>

            <!-- 意志 badge -->
            <div v-if="willVisible" class="will-badge" :style="{ borderColor: willBorderStyle }">
                ⚡ 意志層數
                <span class="will-layer" :style="{ background: willBgStyle }">{{ willCountDisplay }}</span>
                / 5
            </div>

            <!-- 提示 -->
            <div v-if="hintVisible" class="hint-text">
                點擊場內移動 · 模式3下按 1 鍵模擬攻擊，攻擊5次獲得意志
            </div>

            <!-- 小抄（pointer-events:none 不影響畫布操作） -->
            <Transition name="cheat-fade">
                <div v-if="showCheatSheet" class="cheat-sheet">
                    <div class="cheat-title">安全區小抄</div>
                    <table class="cheat-table">
                        <thead>
                            <tr>
                                <th>模式</th>
                                <th v-for="n in 9" :key="n">第{{ n }}次</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="cheat-label">55%</td>
                                <td v-for="(v, i) in CHEAT_55" :key="i"
                                    :class="cheatMode === 'arrow' ? 'cheat-arrow' : ''">{{ cheatDisplay(v) }}</td>
                            </tr>
                            <tr>
                                <td class="cheat-label">15%</td>
                                <td v-for="(v, i) in CHEAT_15" :key="i"
                                    :class="cheatMode === 'arrow' ? 'cheat-arrow' : ''">{{ cheatDisplay(v) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>
.petrak-wrapper {
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

.controls-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 16px;
    background: #1f2937;
    border-bottom: 1px solid #374151;
    z-index: 10;
}

.controls-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.page-title {
    font-size: 15px;
    font-weight: 700;
    color: #f9fafb;
    white-space: nowrap;
}

.settings-btn {
    background: #374151;
    border: 1px solid #4b5563;
    border-radius: 10px;
    color: #d1d5db;
    padding: 4px 12px;
    font-size: 13px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    white-space: nowrap;
}
.settings-btn:hover { background: #4b5563; color: #f9fafb; }
.settings-btn.active {
    background: #2563eb;
    border-color: #3b82f6;
    color: #fff;
}

.settings-panel {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(31, 41, 55, 0.7);
    border-bottom: 1px solid #374151;
}

/* slide-down 展開動畫 */
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

.ctrl-group {
    display: flex;
    align-items: center;
    gap: 6px;
}

.ctrl-group label {
    font-size: 12px;
    color: #9ca3af;
    white-space: nowrap;
}

select {
    background: #374151;
    border: 1px solid #4b5563;
    border-radius: 8px;
    color: #e5e7eb;
    padding: 4px 8px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
}

.speed-slider {
    -webkit-appearance: none;
    width: 90px;
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

.start-btn {
    background: #fbbf24;
    border: none;
    color: #111827;
    padding: 6px 22px;
    font-size: 14px;
    font-weight: 700;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    white-space: nowrap;
}

.start-btn:hover { background: #fcd34d; }
.start-btn:active { transform: scale(0.96); }
.start-btn:disabled { opacity: 0.5; pointer-events: none; }

.canvas-area {
    flex: 1;
    position: relative;
    overflow: hidden;
    min-height: 0;
}

canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.status-overlay {
    position: absolute;
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    text-align: center;
    background: rgba(17, 24, 39, 0.75);
    padding: 4px 18px;
    border-radius: 20px;
    white-space: nowrap;
    color: #f9fafb;
    border: 1px solid #374151;
}

.will-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(31, 41, 55, 0.88);
    backdrop-filter: blur(6px);
    color: #fbbf24;
    padding: 6px 14px;
    border-radius: 30px;
    font-weight: bold;
    font-size: 15px;
    z-index: 12;
    border: 1px solid #fbbf24;
    display: flex;
    align-items: center;
    gap: 6px;
}

.will-layer {
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
}

.hint-text {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(31, 41, 55, 0.75);
    padding: 5px 16px;
    border-radius: 20px;
    font-size: 13px;
    z-index: 8;
    color: #9ca3af;
    white-space: nowrap;
    border: 1px solid #374151;
}

/* ── 小抄 toggle ─────────────────────────────────── */
.cheat-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}
.cheatsheet-toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #9ca3af;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
}
.cheatsheet-toggle input {
    accent-color: #fbbf24;
    cursor: pointer;
}

/* 數字/箭頭 切換 */
.cheat-mode-group {
    display: flex;
    gap: 2px;
}
.cheat-mode-radio {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    color: #6b7280;
    cursor: pointer;
    user-select: none;
    padding: 2px 7px;
    border-radius: 10px;
    border: 1px solid transparent;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    white-space: nowrap;
}
.cheat-mode-radio input { display: none; }
.cheat-mode-radio.active {
    color: #fbbf24;
    border-color: rgba(251, 191, 36, 0.4);
    background: rgba(251, 191, 36, 0.08);
}
.cheat-mode-radio:not(.active):hover {
    color: #d1d5db;
    background: rgba(255, 255, 255, 0.05);
}

/* 切換動畫 */
.cheat-mode-slide-enter-active,
.cheat-mode-slide-leave-active {
    transition: opacity 0.15s, max-width 0.2s;
    overflow: hidden;
}
.cheat-mode-slide-enter-from,
.cheat-mode-slide-leave-to {
    opacity: 0;
    max-width: 0;
}
.cheat-mode-slide-enter-to,
.cheat-mode-slide-leave-from {
    max-width: 120px;
}

/* ── 小抄 overlay ────────────────────────────────── */
.cheat-sheet {
    position: absolute;
    bottom: 52px;           /* hint-text 上方，避免重疊 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 9;
    pointer-events: none;   /* ← 不攔截點擊 / 觸控 */
    background: rgba(17, 24, 39, 0.88);
    border: 1px solid #4b5563;
    border-radius: 12px;
    padding: 10px 14px;
    backdrop-filter: blur(6px);
    min-width: 0;
}
.cheat-title {
    font-size: 11px;
    color: #6b7280;
    text-align: center;
    margin-bottom: 6px;
    letter-spacing: 1px;
    text-transform: uppercase;
}
.cheat-table {
    border-collapse: collapse;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    color: #e5e7eb;
}
.cheat-table th,
.cheat-table td {
    padding: 3px 6px;
    text-align: center;
    border: 1px solid rgba(75, 85, 99, 0.5);
    white-space: nowrap;
}
.cheat-table th {
    font-size: 11px;
    color: #9ca3af;
    font-weight: 600;
    background: rgba(55, 65, 81, 0.6);
}
.cheat-label {
    font-weight: 700;
    color: #fbbf24;
    background: rgba(251, 191, 36, 0.08);
}

/* 箭頭模式：字型放大並居中 */
.cheat-arrow {
    font-size: 16px;
    line-height: 1;
}

/* ── 進場動畫 ─────────────────────────────────────── */
.cheat-fade-enter-active,
.cheat-fade-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}
.cheat-fade-enter-from,
.cheat-fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(6px);
}
</style>
