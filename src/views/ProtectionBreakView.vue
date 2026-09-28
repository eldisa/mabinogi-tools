<script setup lang="ts">
import ProtectionBreakPanel from "../components/ProtectionBreakPanel.vue";
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-6xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    破保數據
                </h1>
                <p class="text-sm text-gray-400">比較 A、B 兩組裝備與破防組合，破保後的減傷與傷害倍率</p>
            </header>

            <ProtectionBreakPanel />
        </div>
    </div>
</template>
