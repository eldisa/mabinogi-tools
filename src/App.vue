<template>
    <router-view />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useLayoutStore } from "./stores/layout";
import { useAuthStore } from "./stores/auth";

const layoutStore = useLayoutStore();
const authStore = useAuthStore();

const handleResize = () => {
    layoutStore.updateScreenSize(window.innerWidth);
};

onMounted(() => {
    layoutStore.initializeScreenSize();
    window.addEventListener("resize", handleResize);
    authStore.loadUser();
});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
});
</script>
