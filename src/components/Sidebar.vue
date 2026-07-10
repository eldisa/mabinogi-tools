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
    Handbag,
    TrendCharts,
    Coin,
    Trophy,
    Headset,
    ArrowDown,
} from "@element-plus/icons-vue";

defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const router = useRouter();

const menuGroups = ref([
    {
        label: "裝備",
        collapsed: false,
        items: [
            { name: "裝備改造模擬器", path: "/weapon-upgrade-simulator", icon: markRaw(Setting) },
            { name: "材料計算機", path: "/material-simulator", icon: markRaw(Box) },
            { name: "裝備繼承費用估算", path: "/transfer-simulator", icon: markRaw(Money) },
        ],
    },
    {
        label: "資料查詢",
        collapsed: false,
        items: [
            { name: "賦予查詢", path: "enchant", icon: markRaw(MagicStick) },
            { name: "稱號查詢", path: "/title", icon: markRaw(Medal) },
            { name: "娃娃背包查詢", path: "/doll-bag", icon: markRaw(Handbag) },
            { name: "農場模型查詢", path: "/farmModel", icon: markRaw(HomeFilled) },
            { name: "魔法陣查詢", path: "/magic-circle", icon: markRaw(MagicStick) },
            { name: "符文", path: "/ogham", icon: markRaw(MagicStick), note: "暫譯・台服未實裝" },
        ],
    },
    {
        label: "機率模擬(要拚)",
        collapsed: false,
        items: [
            { name: "布里萊赫硬幣模擬器", path: "/brilaherec", icon: markRaw(Coin) },
            { name: "賭石小遊戲", path: "/stone-gambling", icon: markRaw(Present) },
            { name: "細工模擬器", path: "/reforge", icon: markRaw(MagicStick) },
            { name: "聖水模擬器", path: "/holy-water", icon: markRaw(MagicStick) },
            { name: "回音石模擬器", path: "/echostone-simulator", icon: markRaw(MagicStick) },
            { name: "符文模擬器", path: "/ogham-simulator", icon: markRaw(MagicStick), note: "暫譯・台服未實裝" },
            { name: "轉蛋模擬器", path: "/gacha-simulator", icon: markRaw(Present) },
        ],
    },
    {
        label: "戰鬥 / 分析",
        collapsed: false,
        items: [
            { name: "頂裝差距", path: "/gear-gap", icon: markRaw(TrendCharts) },
            { name: "音樂計算機", path: "/music-calculator", icon: markRaw(Headset) },
            { name: "傷害計算分析", path: "/dmg-analyzer", icon: markRaw(DataAnalysis) },
        ],
    },
    {
        label: "副本練習",
        collapsed: false,
        items: [
            { name: "1王機制練習", path: "/raid-petrak", icon: markRaw(Trophy) },
            { name: "2關機制練習", path: "/raid-stage2", icon: markRaw(Trophy) },
            { name: "4王安全屋計時", path: "/boss-timer", icon: markRaw(Trophy) },
            { name: "4王65%躲彈幕", path: "/raid-boss4-dodge", icon: markRaw(Trophy) },
        ],
    },
    {
        label: "其他",
        collapsed: false,
        items: [
            { name: "About", path: "/about", icon: markRaw(InfoFilled) },
        ],
    },
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
            <div v-for="group in menuGroups" :key="group.label">
                <button
                    class="group-header"
                    @click="group.collapsed = !group.collapsed"
                >
                    <span>{{ group.label }}</span>
                    <el-icon
                        :size="12"
                        class="arrow-icon"
                        :class="{ collapsed: group.collapsed }"
                    >
                        <ArrowDown />
                    </el-icon>
                </button>
                <div class="items-wrapper" :class="{ collapsed: group.collapsed }">
                    <div class="items-inner">
                        <div
                            v-for="item in group.items"
                            :key="item.name"
                            class="px-3 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                            @click="
                                router.push(item.path);
                                emit('close');
                            "
                        >
                            <div class="flex items-center gap-3">
                                <el-icon :size="18" class="text-accent flex-shrink-0">
                                    <component :is="item.icon" />
                                </el-icon>
                                <div class="min-w-0">
                                    <p class="text-sm font-medium text-gray-200 truncate">
                                        {{ item.name }}
                                    </p>
                                    <p v-if="item.note" class="text-[0.65rem] text-gray-500 leading-tight truncate">
                                        {{ item.note }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<style scoped>
.group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.375rem 0.75rem;
    margin-bottom: 0.125rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    border-radius: 0.375rem;
    transition: background-color 0.15s;
}

.group-header:hover {
    background-color: rgb(55 65 81 / 0.5);
    color: #d1d5db;
}

.arrow-icon {
    transition: transform 0.2s ease;
    flex-shrink: 0;
}

.arrow-icon.collapsed {
    transform: rotate(-90deg);
}

.items-wrapper {
    display: grid;
    grid-template-rows: 1fr;
    overflow: hidden;
    transition: grid-template-rows 0.2s ease;
}

.items-wrapper.collapsed {
    grid-template-rows: 0fr;
}

.items-inner {
    min-height: 0;
    overflow: hidden;
}

@media (min-width: 1024px) {
    .sidebar-container {
        position: fixed;
        top: var(--header-height, 0);
        left: 0;
        z-index: 20;
    }
}

@media (max-width: 1023px) {
    .sidebar-container {
        position: fixed;
        top: 0;
        bottom: 0;
        z-index: 40;
    }
}
</style>
