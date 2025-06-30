<template>
    <div class="craft-calculator min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div class="max-w-7xl mx-auto">
            <header class="mb-6 text-center">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">素材計算模擬器</h1>
                <p class="text-gray-600 mt-2">輕鬆計算還需要多少材料</p>
            </header>

            <div>
                <!-- 資料輸入區 -->

                <div class="mb-4">
                    <el-card class="mb-4 bg-gradient-to-r from-blue-100 to-white shadow-sm rounded-md">
                        <CardHeader title="製作項目資料" subtitle="設定你想要模擬的目標與條件" />
                        <div class="bg-white rounded-md shadow-sm p-4 mt-4 w-fit mx-auto border border-gray-200">
                            <el-button type="danger" @click="clearAll">清除</el-button>
                            <el-button @click="showInventoryDrawer = true">設定庫存</el-button>
                            <el-button @click="showTargetDrawer = true">設定目標</el-button>
                            <el-button type="primary" @click="calculate">計算</el-button>
                        </div>
                        <!-- select craft target-->
                        <!--  todo: optimized-->
                        <div>
                            <el-select
                                v-model="selectedWeapons"
                                filterable
                                multiple
                                placeholder="Select"
                                style="width: 240px"
                            >
                                <el-option
                                    v-for="item in craftWeaponOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                />
                            </el-select>
                        </div>
                    </el-card>
                    <el-card class="mb-8 p-4 rounded-xl shadow border border-gray-200 bg-white max-h-[800px]">
                        <el-tabs type="border-card" class="demo-tabs">
                            <el-tab-pane label="Preview">
                                <template v-if="displayData.length > 0">
                                    <div class="flex gap-8 px-8">
                                        <img
                                            v-for="(obj, index) in displayData"
                                            :src="`${baseUrl}itemImage/${obj.id}.png`"
                                            class="tab-icon"
                                            @click="handleSelectDisplayData(index)"
                                        />
                                    </div>
                                    <h2 class="text-lg font-semibold">所需材料</h2>
                                    <div class="mt-4">
                                        <el-table
                                            v-if="dataInPreviewTable?.children?.length"
                                            :data="dataInPreviewTable.children"
                                            style="width: 100%"
                                            :row-key="(row:CraftableItem ) => `preview-${row.id}`"
                                            border
                                            lazy
                                            height="500"
                                            :tree-props="{
                                                children: 'children',
                                            }"
                                        >
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
                                            <el-table-column prop="amount" label="需求數量" align="right" />
                                        </el-table>
                                    </div>
                                </template>
                            </el-tab-pane>
                            <el-tab-pane label="Stock">
                                <h2 class="text-lg font-semibold">庫存與所需材料</h2>
                                <div class="mt-4">
                                    <el-table
                                        :data="materialSummaryTable"
                                        style="width: 100%"
                                        :row-key="(row:CraftableItem ) => `stock-${row.id}`"
                                        border
                                        lazy
                                        height="500"
                                    >
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
                                        <el-table-column prop="owned" label="持有數量" align="right" sortable />
                                        <el-table-column prop="total" label="所需數量" align="right" sortable />
                                        <el-table-column prop="shortage" label="差額" align="right" sortable />
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane label="Result">Task</el-tab-pane>
                        </el-tabs>
                    </el-card>

                    <!-- origin -->
                    <!-- <div v-for="obj in displayData">
                        <CardHeader title="製作目標" subtitle="" />
                        <div class="flex gap-8 justify-center items-center w-full">
                            <img :src="`${baseUrl}itemImage/${obj.id}.png`" />
                            <span>{{ obj.name }}</span>
                        </div>
                        <CardHeader title="計算結果" subtitle="" />
                        <div class="p-4">
                            <el-table
                                v-if="obj?.children?.length"
                                :data="obj.children"
                                style="width: 100%"
                                row-key="id"
                                border
                                lazy
                                :tree-props="{
                                    children: 'children',
                                }"
                            >
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
                                <el-table-column label="持有數量" align="right">
                                    0
                                </el-table-column>
                                <el-table-column prop="amount" label="需求數量" align="right" />
                            </el-table>
                        </div>
                    </div> -->

                    <!-- 庫存展示 -->
                    <!-- <inventory-table :inventory="inventory" /> -->

                    <!-- 目標展示 -->
                    <!-- <target-table :targets="targets" /> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Option } from "../types";
import { CraftableItem, CraftTreeNode, MaterialSource } from "../types/CraftItem";
import CardHeader from "../components/CardHeader.vue";
import { materials } from "../data/materials";
import { G27Weapons } from "../data/G27Weapon";
// import InventoryTable from "@/components/InventoryTable.vue";
// import TargetTable from "@/components/TargetTable.vue";
// import InventoryDrawer from "@/components/InventoryDrawer.vue";
// import TargetDrawer from "@/components/TargetDrawer.vue";

interface TargetItem {
    id: number;
    count: number;
}

const baseUrl = import.meta.env.BASE_URL;

const selectedWeapons = ref<number[]>([]);
const craftTarget = ref<CraftableItem[]>([]);

const craftWeaponOptions: Option[] = G27Weapons.map((weapon) => {
    const { id, name } = weapon;
    return { label: name.tw || name.en, value: id };
});

const inventory = ref<Record<string, number>>({});
const targets = ref<TargetItem[]>([]);
const results = ref<any[]>([]);
const displayData = ref<CraftTreeNode[]>([]);
const selectedDisplayDataIndex = ref(0);
const showInventoryDrawer = ref(false);
const showTargetDrawer = ref(false);
const dataInPreviewTable = computed(() => displayData.value[selectedDisplayDataIndex.value]);

const clearAll = () => {
    inventory.value = {};
    targets.value = [];
    results.value = [];
};

const calculate = () => {
    // Example logic: 遍歷 targets，計算總缺少數量與總成本
    const res: any[] = [];
    for (const t of targets.value) {
        const mat = materials.find((m) => m.id === t.id);
        // TODO: 為每項目展開數量計算
        res.push({
            name: mat?.name,
            required: t.count,
            stock: inventory.value[t.id] || 0,
            missing: Math.max(0, t.count - (inventory.value[t.id] || 0)),
            unitCost: 1000, // placeholder
            totalCost: t.count * 1000,
        });
    }
    results.value = res;
};

const materialMap = ref<{ id: number; total: number }[]>([]);

const materialSummaryTable = computed(() => {
    return materials.map((item) => {
        const { id, name } = item;
        const total = materialMap.value.find((ele) => ele.id === id)?.total || 0;

        return {
            id,
            name: name.tw || name.en,
            total,
            owned: inventory.value[id] || 0,
            shortage: Math.max(0, total - (inventory.value[id] || 0)),
        };
    });
});
const buildCraftTree = (item: CraftableItem, allItems: CraftableItem[], multiplier: number = 1): CraftTreeNode => {
    const unitAmount = 1;
    const totalAmount = multiplier * unitAmount;

    const node: CraftTreeNode = {
        id: item.id,
        name: item.name.tw || item.name.en,
        amount: totalAmount,
        unitAmount: unitAmount,
        source: item.source,
        children: [],
    };

    if (item.source.type === "craft") {
        node.children = item.source.materials.map((mat) => {
            const matched = allItems.find((x) => x.id === mat.id);

            if (matched) {
                return buildCraftTree(matched, allItems, mat.amount * multiplier);
            } else {
                const fallback = {
                    id: mat.id,
                    name: `未知素材 #${mat.id}`,
                    amount: mat.amount * multiplier,
                    unitAmount: mat.amount,
                    source: { type: "" } as MaterialSource,
                    children: [],
                };

                const index = materialMap.value.findIndex((ele) => ele.id === mat.id) || -1;

                // ✅ 是 leaf node，可累加
                if (index === -1) {
                    materialMap.value.push({
                        id: mat.id,
                        total: 0,
                    });
                }
                materialMap.value[index].total += fallback.amount;

                return fallback;
            }
        });
    } else {
        // ✅ 非 craft，無 children，可累加
        const index = materialMap.value.findIndex((ele) => ele.id === item.id) || -1;
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

const handleSelectDisplayData = (index: number) => {
    const selectIndex = index > displayData.value.length - 1 ? 0 : index;
    selectedDisplayDataIndex.value = selectIndex;
};

watch(
    () => selectedWeapons.value,
    (newData) => {
        console.log(newData);
        if (newData) {
            craftTarget.value = G27Weapons.filter((weapon) => selectedWeapons.value.includes(weapon.id));
            displayData.value = craftTarget.value.map((target) => buildCraftTree(target, materials, 1));
        }
    },
    { immediate: true }
);
</script>

<style>
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
</style>
