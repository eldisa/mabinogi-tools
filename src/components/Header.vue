<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

defineEmits<{
    toggleSidebar: [];
}>();

const router = useRouter();
const authStore = useAuthStore();

const isMenuOpen = ref(false);

function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value;
}

function closeMenu() {
    isMenuOpen.value = false;
}

function login(provider: "google" | "discord") {
    authStore.startLogin(provider);
}

function logout() {
    authStore.logout();
    closeMenu();
}
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

        <div
            class="flex items-center space-x-3 cursor-pointer"
            @click="router.push('/')"
        >
            <div class="w-8 h-8 bg-gradient-to-br rounded-lg flex items-center justify-center">
                <img src="/favicon.ico" />
            </div>
            <h1 class="text-xl font-semibold text-gray-100 hover:text-yellow-400 transition-colors">瑪奇小工具</h1>
        </div>

        <div class="ml-auto relative">
            <button
                v-if="!authStore.isLoggedIn"
                @click="toggleMenu"
                class="px-3 py-1.5 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 transition-colors text-gray-100"
            >
                登入
            </button>

            <button
                v-else
                @click="toggleMenu"
                class="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-gray-700 transition-colors"
            >
                <img
                    v-if="authStore.user?.avatarUrl"
                    :src="authStore.user.avatarUrl"
                    class="w-7 h-7 rounded-full"
                    alt=""
                />
                <span class="text-sm text-gray-100">{{ authStore.user?.displayName }}</span>
            </button>

            <div
                v-if="isMenuOpen"
                class="absolute right-0 mt-2 w-44 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-40"
            >
                <template v-if="!authStore.isLoggedIn">
                    <button
                        @click="login('google')"
                        class="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 transition-colors"
                    >
                        使用 Google 登入
                    </button>
                    <button
                        @click="login('discord')"
                        class="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 transition-colors"
                    >
                        使用 Discord 登入
                    </button>
                </template>
                <template v-else>
                    <button
                        @click="router.push('/settings'); closeMenu()"
                        class="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 transition-colors"
                    >
                        帳號設定
                    </button>
                    <button
                        @click="logout"
                        class="w-full text-left px-4 py-2 text-sm text-gray-100 hover:bg-gray-700 transition-colors"
                    >
                        登出
                    </button>
                </template>
            </div>
        </div>

        <div
            v-if="isMenuOpen"
            class="fixed inset-0 z-30"
            @click="closeMenu"
        ></div>
    </header>
</template>
