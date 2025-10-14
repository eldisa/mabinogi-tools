<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const router = useRouter();

const menuItems = ref([
    // { name: "Grid Demo", path: "/", icon: "📊" },
    // { name: "Damage Analysis", path: "/pierecing-analysis", icon: "📈" },
    // { name: "裝備製作模擬器", path: "/equipment-craft-simulator", icon: "🛠️" },
    { name: "裝備改造模擬器", path: "/weapon-upgrade-simulator", icon: "⚙️" },
    { name: "材料計算機", path: "/material-simulator", icon: "📦" },
    { name: "裝備能力轉移費用估算", path: "/transfer-simulator", icon: "💰" },
    { name: "賦予查詢", path: "enchant", icon: "🪄" },
    { name: "農場模型查詢", path: "/farmModel", icon: "🏠" },
    // { name: "G27 1王", path: "/G27Raid1", icon: "🏠" },
    { name: "About", path: "/about", icon: "ℹ️" },
    // { name: "Settings", path: "/settings", icon: "⚙️" },
]);
</script>

<template>
    <aside
        :class="[
            'fixed left-0 w-4/5 lg:w-64 bg-gray-800 border-r border-gray-700 z-40',
            'transform transition-transform duration-300 ease-in-out',
            'lg:translate-x-0',
            isOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
        style="top: var(--header-height, 57px); height: calc(100vh - var(--header-height, 57px))"
    >
        <div class="flex flex-col h-full">
            <div class="flex-1 overflow-y-auto p-3 space-y-1">
                <div
                    v-for="item in menuItems"
                    :key="item.name"
                    class="px-3 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
                >
                    <div
                        class="flex items-start justify-between"
                        @click="
                            router.push(item.path);
                            emit('close');
                        "
                    >
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-200 truncate">
                                <span class="icon">{{ item.icon }}</span>
                                {{ item.name }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.icon {
    font-size: 1.2rem;
    min-width: 24px;
    text-align: center;
}
/* 假設 Sidebar 元件的容器是 <aside> 或 <div> */

/* 桌面版 Sidebar 的樣式 */
@media (min-width: 1024px) {
    /* lg: 斷點或你定義的桌面斷點 */
    .sidebar-container {
        position: fixed;
        top: var(--header-height, 0); /* 從 Header 下方開始 */
        left: 0;
        /* 高度計算：全螢幕高 - Header 高度 */
        height: calc(100vh - var(--header-height, 0px));
        z-index: 20; /* 確保它位於主內容之上 */
    }
}

/* 手機版 Sidebar 的樣式 */
@media (max-width: 1023px) {
    .sidebar-container {
        /* 手機上使用 inset-0 搭配 top: var(--header-height) */
        position: fixed;
        top: 0;
        bottom: 0;
        /* 或者如果想讓 Header 擋住它： */
        /* top: var(--header-height, 0); */
        /* height: calc(100vh - var(--header-height, 0px)); */
        z-index: 40;
    }
}
</style>
