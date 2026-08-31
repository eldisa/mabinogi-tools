<script setup lang="ts">
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();

function login(provider: "google" | "discord") {
    authStore.startLogin(provider);
}
</script>

<template>
    <div class="p-6 max-w-md text-gray-100">
        <h1 class="text-xl font-semibold mb-4">帳號設定</h1>

        <div v-if="authStore.isLoggedIn && authStore.user" class="flex items-center space-x-4 mb-6">
            <img
                v-if="authStore.user.avatarUrl"
                :src="authStore.user.avatarUrl"
                class="w-14 h-14 rounded-full"
                alt=""
            />
            <div>
                <p class="font-medium">{{ authStore.user.displayName }}</p>
                <p v-if="authStore.user.email" class="text-sm text-gray-400">{{ authStore.user.email }}</p>
            </div>
        </div>

        <div v-if="authStore.isLoggedIn">
            <button
                @click="authStore.logout"
                class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
            >
                登出
            </button>
        </div>

        <div v-else class="space-y-2">
            <p class="text-sm text-gray-400 mb-3">登入後可以儲存進度到雲端。</p>
            <button
                @click="login('google')"
                class="w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
            >
                使用 Google 登入
            </button>
            <button
                @click="login('discord')"
                class="w-full px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-sm"
            >
                使用 Discord 登入
            </button>
        </div>
    </div>
</template>
