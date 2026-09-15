<script setup lang="ts">
import { ref } from "vue";

const SHOW_CHANCE = 0.3;
const REPEAT_COUNT = 10; // 確保單組寬度在桌面寬螢幕下仍大於可視窗口，避免捲動到後段出現空白
const SECONDS_PER_ITEM = 4; // 每組重複次數變動時同步縮放動畫時長，維持捲動速度一致

const visible = ref(Math.random() < SHOW_CHANCE);
const repeatItems = Array.from({ length: REPEAT_COUNT });
const scrollDuration = `${REPEAT_COUNT * SECONDS_PER_ITEM}s`;

const dismiss = () => {
    visible.value = false;
};
</script>

<template>
    <div v-if="visible" class="birthday-banner" role="status" aria-live="polite">
        <div class="banner-badge">🎉 慶祝</div>

        <div class="marquee-viewport">
            <div class="marquee-track" :style="{ animationDuration: scrollDuration }">
                <div class="marquee-group">
                    <span v-for="(_, i) in repeatItems" :key="i" class="marquee-item">🎂 憨比生日快樂 🎉</span>
                </div>
                <div class="marquee-group" aria-hidden="true">
                    <span v-for="(_, i) in repeatItems" :key="i" class="marquee-item">🎂 憨比生日快樂 🎉</span>
                </div>
            </div>
        </div>

        <button class="marquee-close" type="button" aria-label="關閉公告" @click="dismiss">✕</button>
    </div>
</template>

<style scoped>
.birthday-banner {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 42px;
    margin-bottom: 1.5rem;
    padding: 6px 16px;
    overflow: hidden;
    border: 1px solid var(--color-border-accent, rgba(251, 191, 36, 0.3));
    border-radius: var(--radius-full, 9999px);
    background: var(--color-bg-secondary, #1f2937);
    box-shadow: var(--shadow-lg, 0 4px 20px rgba(0, 0, 0, 0.3));
    color: var(--color-accent-primary, #fbbf24);
}

.banner-badge {
    flex-shrink: 0;
    margin-right: 10px;
    padding-right: 12px;
    border-right: 1px solid rgba(251, 191, 36, 0.2);
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
}

.marquee-viewport {
    position: relative;
    display: flex;
    flex: 1;
    overflow: hidden;
    mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
    -webkit-mask-image: linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%);
}

.marquee-track {
    display: flex;
    width: max-content;
    animation: marquee-scroll linear infinite;
}

.birthday-banner:hover .marquee-track {
    animation-play-state: paused;
}

.marquee-group {
    display: flex;
    flex-shrink: 0;
    align-items: center;
}

.marquee-item {
    padding: 0 24px;
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    white-space: nowrap;
}

.marquee-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8px;
    padding: 4px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: var(--color-text-muted, #9ca3af);
    font-size: 0.85rem;
    cursor: pointer;
    transition:
        color 0.2s,
        background-color 0.2s;
}

.marquee-close:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--color-text-primary, #f9fafb);
}

@keyframes marquee-scroll {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
}
</style>
