<script setup lang="ts">
import { ref } from "vue";

const SHOW_CHANCE = 0.3;

const visible = ref(Math.random() < SHOW_CHANCE);

const dismiss = () => {
    visible.value = false;
};
</script>

<template>
    <div v-if="visible" class="birthday-marquee" role="status" aria-live="polite">
        <div class="marquee-track">
            <span class="marquee-text">🎂 憨比生日快樂 🎉　🎂 憨比生日快樂 🎉　🎂 憨比生日快樂 🎉　</span>
            <span class="marquee-text" aria-hidden="true">🎂 憨比生日快樂 🎉　🎂 憨比生日快樂 🎉　🎂 憨比生日快樂 🎉　</span>
        </div>
        <span class="marquee-static">🎂 憨比生日快樂 🎉</span>
        <button class="marquee-close" type="button" aria-label="關閉公告" @click="dismiss">✕</button>
    </div>
</template>

<style scoped>
.birthday-marquee {
    position: relative;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-bottom: 1.5rem;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid var(--color-border-accent, rgba(251, 191, 36, 0.3));
    border-radius: var(--radius-lg, 12px);
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.12), rgba(59, 130, 246, 0.12));
}

.marquee-track {
    display: flex;
    flex-shrink: 0;
    width: max-content;
    animation: marquee-scroll 16s linear infinite;
}

.marquee-text {
    flex-shrink: 0;
    padding-right: 2rem;
    color: var(--color-accent-primary, #fbbf24);
    font-weight: 700;
    font-size: 1rem;
    white-space: nowrap;
}

.marquee-static {
    display: none;
    color: var(--color-accent-primary, #fbbf24);
    font-weight: 700;
    font-size: 1rem;
    white-space: nowrap;
}

.marquee-close {
    position: absolute;
    right: 0.5rem;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: none;
    color: var(--color-text-muted, #9ca3af);
    font-size: 0.9rem;
    line-height: 1;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
}

.marquee-close:hover {
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

@keyframes marquee-glow {
    0%,
    100% {
        text-shadow: 0 0 0 rgba(251, 191, 36, 0);
    }
    50% {
        text-shadow: 0 0 12px rgba(251, 191, 36, 0.85);
    }
}

@media (prefers-reduced-motion: reduce) {
    .birthday-marquee {
        justify-content: center;
    }

    .marquee-track {
        display: none;
    }

    .marquee-static {
        display: inline-block;
        animation: marquee-glow 2.4s ease-in-out infinite;
    }
}
</style>
