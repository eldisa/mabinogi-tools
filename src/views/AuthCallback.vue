<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore, AUTH_REDIRECT_KEY } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    const token = route.query.token;
    if (typeof token === "string" && token) {
        authStore.setToken(token);
        await authStore.loadUser();
    }

    const redirectPath = sessionStorage.getItem(AUTH_REDIRECT_KEY) || "/";
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
    router.replace(redirectPath);
});
</script>

<template>
    <div class="flex items-center justify-center h-screen text-gray-300">登入中...</div>
</template>
