<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useAuthStore, AUTH_REDIRECT_KEY } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const errorMessages: Record<string, string> = {
    access_denied: "登入已取消",
    login_failed: "登入失敗，請再試一次",
};

onMounted(async () => {
    const token = route.query.token;
    const error = route.query.error;

    if (typeof token === "string" && token) {
        authStore.setToken(token);
        await authStore.loadUser();
    } else if (typeof error === "string" && error) {
        ElMessage.warning(errorMessages[error] ?? "登入失敗，請再試一次");
    }

    const redirectPath = sessionStorage.getItem(AUTH_REDIRECT_KEY) || "/";
    sessionStorage.removeItem(AUTH_REDIRECT_KEY);
    router.replace(redirectPath);
});
</script>

<template>
    <div class="flex items-center justify-center h-screen text-gray-300">登入中...</div>
</template>
