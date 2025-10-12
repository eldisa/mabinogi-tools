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
    <div class="flex flex-col h-screen bg-gray-900 text-gray-100 overflow-y-auto">
        <Header @toggle-sidebar="toggleSidebar" />

        <div class="flex flex-1 overflow-y-auto">
            <Sidebar :is-open="isSidebarOpen" @close="closeSidebar" />

            <main class="flex-1 overflow-y-auto lg:ml-64">
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
