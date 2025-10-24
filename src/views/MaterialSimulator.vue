<template>
    <div class="craft-calculator min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto">
            <header class="mb-6 text-center">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">素材計算模擬器</h1>
            </header>

            <!-- 資料輸入區 -->
            <div class="mb-4">
                <el-card class="mb-4 bg-gradient-to-r from-blue-100 to-white shadow-sm rounded-md">
                    <div class="flex justify-center">
                        <el-select
                            v-model="selectedWeapons"
                            filterable
                            multiple
                            placeholder="選擇製作項目"
                            class="w-full max-w-xl mb-4"
                        >
                            <el-option
                                v-for="item in craftWeaponOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                            <!-- <template #tag>
                                    {{ selectedWeapons.length > 0 ? `已選擇 ${selectedWeapons.length} 樣` : "" }}
                                </template> -->
                        </el-select>
                        <!-- <el-button type="danger" class="ml-4" @click="selectedWeapons = []">X</el-button>
                            <el-button
                                type="primary"
                                class="ml-4"
                                @click="selectedWeapons = craftWeaponOptions.map((ele) => Number(ele.value))"
                            >
                                全選
                            </el-button> -->
                    </div>
                    <!-- todo: 圖片右上新增 delete button -->
                    <!-- <div v-if="displayData.length > 0" class="mt-4">
                            <div
                                class="flex gap-8 px-8 justify-center scroll-row overflow-x-auto overflow-y-hidden"
                                ref="scrollRow"
                            >
                                <img
                                    v-for="(obj, index) in displayData"
                                    :src="`${baseUrl}itemImage/${obj.id}.png`"
                                    :class="`tab-icon p-2 ${
                                        obj.id === selectedWeapons[selectedDisplayDataIndex]
                                            ? 'ring-4 ring-blue-400 ring-offset-2 ring-offset-blue-100 animate-pulse scale-110 bg-white rounded-xl shadow-xl'
                                            : 'hover:scale-105 hover:ring-2 hover:ring-gray-300 rounded-md'
                                    }`"
                                    @click="handleSelectDisplayData(index)"
                                />
                            </div>
                        </div> -->
                </el-card>
                <el-card class="rounded-xl shadow border border-gray-200 bg-white">
                    <el-tabs type="border-card">
                        <el-tab-pane label="Total">
                            <h2 class="text-lg font-semibold">庫存與所需材料</h2>
                            <div class="mt-4 overflow-x-auto overflow-y-auto">
                                <!-- 手機版 -->
                                <div v-if="layoutStore.isMobile">
                                    <div class="md:hidden space-y-3 p-4">
                                        <el-table
                                            :data="sortedData"
                                            :row-key="'id'"
                                            border
                                            class="material-table"
                                            :preserve-expanded-content="preserveExpanded"
                                        >
                                            <el-table-column type="expand">
                                                <template #default="{ row }">
                                                    <div>{{ row.name }}</div>
                                                    <span class="text-sm">{{ row.source.description || "—" }}</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="id" label="素材" align="center">
                                                <template #default="{ row }">
                                                    <img
                                                        :src="`${baseUrl}itemImage/${row.id}.png`"
                                                        class="w-8 h-8 object-contain mx-auto"
                                                    />
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="total" label="數量" align="center" sortable />
                                        </el-table>
                                    </div>
                                </div>

                                <!-- 平板版 -->
                                <!-- 桌面版 -->
                                <!-- <div v-else-if="layoutStore.isTablet">平板版佈局</div> -->
                                <div v-else>
                                    <el-table :data="sortedData" :row-key="'id'" border class="material-table">
                                        <el-table-column prop="id" label="圖片" width="80" fixed="left">
                                            <template #default="{ row }">
                                                <img
                                                    :src="`${baseUrl}itemImage/${row.id}.png`"
                                                    class="w-8 h-8 object-contain mx-auto"
                                                />
                                            </template>
                                        </el-table-column>

                                        <el-table-column prop="name" label="名稱" width="250" fixed="left" sortable>
                                            <template #default="{ row }">
                                                <div class="flex items-center space-x-2">
                                                    <span>{{ row.name }}</span>
                                                    <el-tooltip
                                                        v-if="row.otherName"
                                                        effect="dark"
                                                        :content="row.otherName"
                                                        placement="right"
                                                    >
                                                        <el-icon><InfoFilled /></el-icon>
                                                    </el-tooltip>
                                                </div>
                                            </template>
                                        </el-table-column>

                                        <el-table-column
                                            prop="total"
                                            label="所需數量"
                                            width="120"
                                            align="center"
                                            sortable
                                        />

                                        <el-table-column
                                            prop="source"
                                            label="如何取得"
                                            min-width="300"
                                            align="left"
                                            sortable
                                        >
                                            <template #default="{ row }">
                                                <span class="text-sm">{{ row.source.description || "—" }}</span>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="Preview">
                            <template v-if="displayData.length > 0">
                                <h2 class="text-lg font-semibold">
                                    {{ displayData[selectedDisplayDataIndex].name }}
                                </h2>
                                <div class="mt-4">
                                    <el-table
                                        v-if="dataInPreviewTable?.children?.length"
                                        :data="dataInPreviewTable.children"
                                        style="width: 100%"
                                        :row-key="(row:CraftTreeNode) => row.uniqueKey"
                                        border
                                        lazy
                                        :tree-props="{
                                            children: 'children',
                                        }"
                                    >
                                        <el-table-column label="名稱" min-width="250">
                                            <template #default="{ row }">
                                                <div class="flex items-center gap-3 h-full">
                                                    <img
                                                        :src="`${baseUrl}itemImage/${row.id}.png`"
                                                        class="w-10 h-10 object-contain"
                                                    />
                                                    <span>{{ row.name }}</span>
                                                    <el-tooltip placement="top">
                                                        <template #content>
                                                            <div v-if="row.source.type === 'craft'">生產製作</div>
                                                            <div v-else-if="row.source.type === ''">-</div>
                                                            <div v-else>{{ row.source.description || "" }}</div>
                                                        </template>
                                                        <ElIcon class="ml-1">
                                                            <InfoFilled />
                                                        </ElIcon>
                                                    </el-tooltip>
                                                </div>
                                            </template>
                                        </el-table-column>
                                        <el-table-column prop="amount" label="數量" align="right" />
                                        <!-- <el-table-column label="如何獲得">
                                            <template #default="{ row }">
                                                <div v-if="row.source.type === 'craft'">生產製作</div>
                                                <div v-else-if="row.source.type === ''">-</div>
                                                <div v-else>{{ row.source.description || "" }}</div>
                                            </template>
                                        </el-table-column> -->
                                    </el-table>
                                </div>
                            </template>
                        </el-tab-pane>
                        <el-tab-pane label="Usage">
                            <h2 class="text-lg font-semibold">這個材料可以做什麼裝備</h2>
                            <div class="mt-4">
                                <el-table :data="materialUsageData" style="width: 100%" border lazy>
                                    <el-table-column label="名稱">
                                        <template #default="{ row }">
                                            <div class="flex items-center gap-3 h-full">
                                                <img
                                                    :src="`${baseUrl}itemImage/${row.id}.png`"
                                                    class="w-10 h-10 object-contain"
                                                />
                                                <span>{{ row.name }}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="usedIn" label="那些裝備需要" />
                                </el-table>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Option } from "../types";
import { CraftableItem, CraftTreeNode, MaterialSource, MaterialUsage } from "../types/CraftItem";
import { materials, G27bossDropsUsage } from "../data/materials";
import { G27Weapons } from "../data/productionForG27Weapon";
import { ElTooltip, ElIcon, TableV2SortOrder } from "element-plus";
import { InfoFilled } from "@element-plus/icons-vue";
import type { SortBy } from "element-plus";
import { useLayoutStore } from "../stores/layout";

const layoutStore = useLayoutStore();

interface MaterialSummary {
    id: number;
    name: string;
    total: number;
    owned: number;
    shortage: number;
}

const baseUrl = import.meta.env.BASE_URL;
const selectedWeapons = ref<number[]>([]);
const itemById = new Map(materials.map((m) => [m.id, m]));

const preserveExpanded = ref(false);
const craftWeaponOptions: Option[] = G27Weapons.map((weapon) => {
    const { id, name } = weapon;
    return { label: name.tw || name.en, value: id };
});

const scrollRow = ref<HTMLElement | null>(null);
const inventory = ref<Record<string, number>>({});
const displayData = ref<CraftTreeNode[]>([]);
const materialUsageData = ref<MaterialUsage[]>(G27bossDropsUsage);
const selectedDisplayDataIndex = ref(0);
const dataInPreviewTable = computed(() => displayData.value[selectedDisplayDataIndex.value]);

const materialMap = ref<{ id: number; total: number }[]>([]);

const materialSummaryTable = computed(() => {
    let tokenTotal = 0;
    let result = materials
        .map((item) => {
            const { id, name, source } = item;
            const total = materialMap.value.find((ele) => ele.id === id)?.total || 0;

            return {
                id,
                name: name.tw || name.en,
                otherName: name.tw2 || "",
                total,
                owned: inventory.value[id] || 0,
                shortage: Math.max(0, total - (inventory.value[id] || 0)),
                source,
            };
        })
        .filter((ele) => ele.total > 0);
    result.forEach((ele) => {
        if (ele.source.type === "desc" && ele.source.token) {
            tokenTotal += ele.source.token * ele.total;
        }
    });
    let tokenData = materials.find((ele) => ele.id === 5300217);

    if (materialMap.value.length > 0 && tokenData) {
        const tokenName = tokenData.name.tw || tokenData.name.en;
        const index = result.findIndex((ele) => ele.id === 5300217);
        if (index === -1) {
            result.push({
                id: 5300217,
                name: tokenName,
                otherName: "",
                total: tokenTotal,
                owned: inventory.value[5300217] || 0,
                shortage: Math.max(0, 0 - (inventory.value[5300217] || 0)),
                source: tokenData.source,
            });
        }
    }
    return result;
});

const buildCraftTree = (
    item: CraftableItem,
    allItems: CraftableItem[],
    multiplier: number = 1,
    path = ""
): CraftTreeNode => {
    const unitAmount = 1;
    const totalAmount = multiplier * unitAmount;
    const currentPath = `${path}-${item.id}`;

    const node: CraftTreeNode = {
        id: item.id,
        name: item.name.tw || item.name.en,
        amount: totalAmount,
        unitAmount: unitAmount,
        source: item.source,
        uniqueKey: currentPath,
        children: [],
    };

    if (item.source.type === "craft") {
        node.children = item.source.materials.map((mat) => {
            const matched = allItems.find((x) => x.id === mat.id);

            if (matched) {
                return buildCraftTree(matched, allItems, mat.amount * multiplier, currentPath);
            } else {
                const fallback = {
                    id: mat.id,
                    name: `未知素材 #${mat.id}`,
                    amount: mat.amount * multiplier,
                    unitAmount: mat.amount,
                    source: { type: "" } as MaterialSource,
                    uniqueKey: currentPath,
                    children: [],
                };

                const index = materialMap.value.findIndex((ele) => ele.id === mat.id);

                if (index === -1) {
                    materialMap.value.push({
                        id: mat.id,
                        total: fallback.amount,
                    });
                } else {
                    materialMap.value[index].total += fallback.amount;
                }

                return fallback;
            }
        });
    } else {
        // ✅ 非 craft，無 children，可累加
        const index = materialMap.value.findIndex((ele) => ele.id === item.id);
        if (index === -1) {
            materialMap.value.push({
                id: item.id,
                total: totalAmount,
            });
        } else {
            materialMap.value[index].total += totalAmount;
        }
    }

    return node;
};

const sortState = ref<SortBy>({
    key: "total",
    order: TableV2SortOrder.ASC,
});

const getTypeOrder = (type: string) => {
    switch (type) {
        case "craft":
            return 1;
        case "shop":
            return 2;
        case "drop":
            return 3;
        case "dissolution":
            return 4;
        case "desc":
            return 5;
        default:
            return -1;
    }
};

const sortedData = computed(() => {
    const { order } = sortState.value;
    const key = sortState.value.key as keyof MaterialSummary | "source";

    if (!key || !order) return materialSummaryTable.value;

    // 複製一份數據，避免直接修改原始數據
    return [...materialSummaryTable.value].sort((a, b) => {
        // 如果排序欄位是 'source'，使用自定義邏輯
        if (key === "source") {
            const aType = a.source?.type ?? "-";
            const bType = b.source?.type ?? "-";
            const aOrder = getTypeOrder(aType);
            const bOrder = getTypeOrder(bType);

            // 根據排序方向返回結果
            if (order === TableV2SortOrder.ASC) {
                return aOrder - bOrder;
            } else {
                return bOrder - aOrder;
            }
        }

        // 處理其他欄位的預設排序（數值排序）
        const aVal = a[key as keyof MaterialSummary];
        const bVal = b[key as keyof MaterialSummary];
        return order === TableV2SortOrder.ASC ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
});

// const handleSelectDisplayData = (index: number) => {
//     const selectIndex = index > displayData.value.length - 1 ? 0 : index;
//     selectedDisplayDataIndex.value = selectIndex;
// };

const hasAddEvent = ref(false);

watch(
    () => selectedWeapons.value,
    (newData) => {
        materialMap.value = []; // 清除歷史資料
        if (newData) {
            const craftTarget = G27Weapons.filter((weapon) => selectedWeapons.value.includes(weapon.id));
            displayData.value = craftTarget.map((target) => buildCraftTree(target, materials, 1));
        }

        if (!hasAddEvent.value && selectedWeapons.value.length >= 10) {
            scrollRow.value?.addEventListener("wheel", (e: WheelEvent) => {
                if (e.deltaY === 0) return;
                e.preventDefault();
                scrollRow.value!.scrollLeft += e.deltaY;
            });
            hasAddEvent.value = true;
        }
    },
    { immediate: true }
);
</script>

<style>
/* 不能用 scoped, or talbe tree 中的 > 會跑版*/
tr td:first-child .cell {
    display: flex;
    align-items: center;
}

.preview-header {
    display: flex;
    gap: 12px;
    padding: 0 16px;
    align-items: center;
    margin-bottom: 8px;
}

.tab-icon {
    /* width: 40px;
    height: 40px; */
    border-radius: 8px;
    object-fit: contain;
    cursor: pointer;
    transition: transform 0.2s ease;
}
.tab-icon:hover {
    transform: scale(1.1);
}

.title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 16px;
    margin-top: 12px;
}

::v-deep(.el-table .cell) {
    padding: 8px 12px;
    line-height: 1.5;
}

::v-deep(.el-table .el-table__row) {
    height: 56px;
}

::v-deep(.el-table img) {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.material-table {
    max-width: 1200px;
    margin: 0 auto;
}

@keyframes pulse {
    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(96, 165, 250, 0.6);
    }
    50% {
        box-shadow: 0 0 10px 8px rgba(96, 165, 250, 0.3);
    }
}
.animate-pulse {
    animation: pulse 2s infinite;
}
</style>
