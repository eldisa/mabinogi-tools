<script setup lang="ts">
import { ref } from "vue";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
};

const closeSidebar = () => {
    isSidebarOpen.value = false;
};
</script>

<template>
    <div class="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div class="flex flex-col flex-1 w-full lg:ml-64">
            <Header @toggle-sidebar="toggleSidebar" />
            <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />
            <main class="flex-1 overflow-hidden">
                <router-view />
            </main>
        </div>

        <div
            v-if="isSidebarOpen"
            class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            @click="closeSidebar"
        ></div>
    </div>
</template>
