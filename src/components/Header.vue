<script setup lang="ts">
defineEmits<{
    toggleSidebar: [];
}>();
</script>

<template>
    <header class="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center">
        <button
            @click="$emit('toggleSidebar')"
            class="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors mr-3"
            aria-label="Toggle sidebar"
        >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>

        <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center">
                <img src="/favicon.ico" />
            </div>
            <h1 class="text-xl font-semibold text-gray-100">瑪奇小工具</h1>
        </div>
    </header>
</template>
