<script setup lang="ts">
import { ref, markRaw } from "vue";
import { useRouter } from "vue-router";
import {
    Setting,
    Box,
    Money,
    MagicStick,
    HomeFilled,
    InfoFilled,
    Medal,
    Present,
    DataAnalysis,
} from "@element-plus/icons-vue";

defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const router = useRouter();

const menuItems = ref([
    { name: "裝備改造模擬器", path: "/weapon-upgrade-simulator", icon: markRaw(Setting) },
    { name: "材料計算機", path: "/material-simulator", icon: markRaw(Box) },
    { name: "裝備能力轉移費用估算", path: "/transfer-simulator", icon: markRaw(Money) },
    { name: "賦予查詢", path: "enchant", icon: markRaw(MagicStick) },
    { name: "稱號查詢", path: "/title", icon: markRaw(Medal) },
    { name: "煉金術傷害計算器", path: "/alchemy-calculator", icon: markRaw(DataAnalysis) },
    { name: "賭石小遊戲", path: "/stone-gambling", icon: markRaw(Present) },
    { name: "農場模型查詢", path: "/farmModel", icon: markRaw(HomeFilled) },
    { name: "About", path: "/about", icon: markRaw(InfoFilled) },
]);
</script>

<template>
    <aside
        :class="[
            'fixed left-0 w-4/5 lg:w-64 bg-gray-800 border-r border-gray-700 z-40',
            'transform transition-transform duration-300 ease-in-out',
            'lg:translate-x-0',
            'flex flex-col h-full',
            isOpen ? 'translate-x-0' : '-translate-x-full',
        ]"
        style="top: var(--header-height, 57px)"
        @click.stop
    >
        <div class="flex-1 overflow-y-auto p-3 space-y-1">
            <div
                v-for="item in menuItems"
                :key="item.name"
                class="px-3 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors group"
            >
                <div
                    class="flex items-center gap-3"
                    @click="
                        router.push(item.path);
                        emit('close');
                    "
                >
                    <el-icon :size="18" class="text-accent flex-shrink-0">
                        <component :is="item.icon" />
                    </el-icon>
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-200 truncate">
                            {{ item.name }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
/* 桌面版 Sidebar 的樣式 */
@media (min-width: 1024px) {
    .sidebar-container {
        position: fixed;
        top: var(--header-height, 0);
        left: 0;
        z-index: 20;
    }
}

/* 手機版 Sidebar 的樣式 */
@media (max-width: 1023px) {
    .sidebar-container {
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 40;
    }
}
</style>
