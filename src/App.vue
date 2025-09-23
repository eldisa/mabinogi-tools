<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isCollapsed = ref(false);

const menuItems = [
    // { name: "Grid Demo", path: "/", icon: "📊" },
    { name: "Damage Analysis", path: "/pierecing-analysis", icon: "📈" },
    { name: "裝備製作模擬器", path: "/equipment-craft-simulator", icon: "🛠️" },
    { name: "裝備改造模擬器", path: "/weapon-upgrade-simulator", icon: "⚙️" },
    { name: "材料計算機", path: "/material-simulator", icon: "📦" },
    { name: "裝備能力轉移費用估算", path: "/transfer-simulator", icon: "💰" },
    { name: "賦予查詢", path: "enchant", icon: "🪄" },
    { name: "農場模型查詢", path: "/farmModel", icon: "🏠" },
    // { name: "G27 1王", path: "/G27Raid1", icon: "🏠" },
    { name: "About", path: "/about", icon: "ℹ️" },
    // { name: "Settings", path: "/settings", icon: "⚙️" },
];

const toggleSidebar = () => {
    isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
    <div class="app-container">
        <aside :class="['sidebar', { collapsed: isCollapsed }]">
            <div class="sidebar-header">
                <h2 v-if="!isCollapsed">Menu</h2>
                <button class="toggle-btn" @click="toggleSidebar">
                    {{ isCollapsed ? "→" : "←" }}
                </button>
            </div>
            <nav class="sidebar-nav">
                <router-link
                    v-for="item in menuItems"
                    :key="item.path"
                    :to="item.path"
                    class="nav-item"
                    active-class="active"
                >
                    <span class="icon">{{ item.icon }}</span>
                    <span v-if="!isCollapsed" class="text">
                        {{ item.name }}
                    </span>
                </router-link>
            </nav>
        </aside>

        <main class="main-content">
            <router-view />
        </main>
    </div>
</template>

<style>
.app-container {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    transition: width 0.3s ease;
    display: flex;
    flex-direction: column;
}

.sidebar.collapsed {
    width: 60px;
}

.sidebar-header {
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toggle-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 1.2rem;
}

.sidebar-nav {
    padding: 1rem 0;
}

.nav-item {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: white;
    text-decoration: none;
    gap: 1rem;
    transition: background-color 0.2s;
}

.nav-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
    background-color: rgba(255, 255, 255, 0.2);
}

.icon {
    font-size: 1.2rem;
    min-width: 24px;
    text-align: center;
}

.main-content {
    flex: 1;
    background-color: #f5f5f5;
    overflow-y: auto;
}

body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
        "Helvetica Neue", sans-serif;
}
</style>
