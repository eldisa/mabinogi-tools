<script setup lang="ts">
import { ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import { magicCircleCategories, type MagicCircleBuff } from "../data/magicCircle";

interface BuffRow extends MagicCircleBuff {
    category: string;
}

const search = ref("");
const activeTab = ref("全部");

const allBuffs = computed<BuffRow[]>(() =>
    magicCircleCategories.flatMap((c) => c.buffs.map((b) => ({ ...b, category: c.label }))),
);

const isSearching = computed(() => search.value.trim().length > 0);
const showCategoryCol = computed(() => isSearching.value || activeTab.value === "全部");

const filteredRows = computed<BuffRow[]>(() => {
    const q = search.value.trim();
    // 搜尋時跨所有分類；未搜尋時依分頁
    let list: BuffRow[];
    if (q || activeTab.value === "全部") {
        list = allBuffs.value;
    } else {
        const cat = magicCircleCategories.find((c) => c.label === activeTab.value);
        list = cat ? cat.buffs.map((b) => ({ ...b, category: cat.label })) : [];
    }
    if (q) list = list.filter((b) => b.name.includes(q) || b.effect.includes(q));
    return list;
});

// 將效果字串中的 [數值] 標示出來
const effectSegments = (effect: string) =>
    effect.split(/(\[[^\]]*\])/g).map((text) => ({ text, highlight: /^\[.*\]$/.test(text) }));
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-5xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    魔法陣查詢
                </h1>
                <p class="text-base text-gray-400 mt-3">查詢各職業魔法陣（強化）的效果與類型</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <!-- 搜尋 -->
                <div class="mb-4">
                    <el-input
                        v-model="search"
                        placeholder="搜尋強化名稱或效果…"
                        clearable
                        size="large"
                        style="max-width: 360px"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>
                    <span v-if="isSearching" class="text-xs text-gray-500 ml-3">
                        找到 {{ filteredRows.length }} 筆（已跨全部分類）
                    </span>
                </div>

                <!-- 分類 tab（搜尋時停用，改為跨分類結果） -->
                <el-tabs v-model="activeTab" type="border-card" class="mc-tabs">
                    <el-tab-pane label="全部" name="全部" />
                    <el-tab-pane
                        v-for="cat in magicCircleCategories"
                        :key="cat.label"
                        :label="cat.label"
                        :name="cat.label"
                    />
                </el-tabs>

                <el-table
                    :key="showCategoryCol ? 'with-cat' : 'no-cat'"
                    :data="filteredRows"
                    border
                    class="rounded-lg overflow-hidden mt-3"
                    :header-cell-style="{ background: '#374151', color: '#d1d5db' }"
                    :row-style="{ background: '#1f2937', color: '#e5e7eb' }"
                    empty-text="查無資料"
                >
                    <el-table-column
                        v-if="showCategoryCol"
                        prop="category"
                        label="分類"
                        width="130"
                    >
                        <template #default="{ row }">
                            <span class="text-accent text-sm">{{ row.category }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="name" label="強化名稱" min-width="150">
                        <template #default="{ row }">
                            <span class="font-semibold text-gray-100">{{ row.name }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column label="效果" min-width="320">
                        <template #default="{ row }">
                            <span class="text-sm text-gray-300 leading-relaxed">
                                <span
                                    v-for="(seg, i) in effectSegments(row.effect)"
                                    :key="i"
                                    :class="seg.highlight ? 'text-accent font-semibold' : ''"
                                >
                                    {{ seg.text }}
                                </span>
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="type" label="類型" width="90" align="center">
                        <template #default="{ row }">
                            <el-tag :type="row.type === '地面' ? 'success' : 'info'" size="small" effect="dark">
                                {{ row.type }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </div>
    </div>
</template>

<style scoped>
.mc-tabs :deep(.el-tabs__content) {
    display: none;
}
</style>
