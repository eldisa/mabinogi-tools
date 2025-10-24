<template>
    <router-view />
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useLayoutStore } from "./stores/layout";

const layoutStore = useLayoutStore();

const handleResize = () => {
    layoutStore.updateScreenSize(window.innerWidth);
};

onMounted(() => {
    layoutStore.initializeScreenSize();
    window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
});
</script>
