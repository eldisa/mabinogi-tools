<script setup lang="ts">
import { ref, watch } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { ColDef, GridApi, GridReadyEvent } from "ag-grid-community";
import { ElSelect, ElOption } from "element-plus";

const props = defineProps<{
    columnDefs: ColDef[];
    rowData: any[];
    visibleColumns?: string[];
    allColumns?: string[];
}>();

const emit = defineEmits<{
    "update:rowData": [rowData: any[]];
    cellValueChanged: [event: any];
}>();

const gridApi = ref<GridApi>();
const localVisibleColumns = ref(props.visibleColumns || []);

const defaultColDef = {
    sortable: true,
    filter: true,
};

const onGridReady = (params: GridReadyEvent) => {
    gridApi.value = params.api;
};

const copyFirstRow = () => {
    if (!gridApi.value || props.rowData.length === 0) return;
    const firstRow = props.rowData[0];
    const newData = props.rowData.map((row, index) => {
        if (index === 0) return row;
        return { ...row, ...firstRow };
    });
    emit("update:rowData", newData);
};

const handleColumnVisibilityChange = (values: string[]) => {
    localVisibleColumns.value = values;
    if (!gridApi.value) return;

    const updatedColumnDefs = props.columnDefs.map((col) => ({
        ...col,
        hide: col.field !== "actions" && !values.includes(col.field!),
    }));

    gridApi.value!.setGridOption("columnDefs", updatedColumnDefs);
};

const handleCellValueChanged = (event: any) => {
    emit("cellValueChanged", event);
};

watch(
    () => props.rowData,
    (newData) => {
        if (gridApi.value) {
            gridApi.value!.setGridOption("rowData", newData);
        }
    },
    { deep: true }
);

watch(
    () => props.visibleColumns,
    (newColumns) => {
        if (newColumns) {
            localVisibleColumns.value = newColumns;
            handleColumnVisibilityChange(newColumns);
        }
    },
    { immediate: true }
);
</script>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "DataGrid",
});
</script>
<template>
    <div class="data-grid">
        <div class="controls">
            <button @click="copyFirstRow">Copy First Row to All</button>

            <el-select
                v-if="allColumns"
                v-model="localVisibleColumns"
                multiple
                placeholder="Select visible columns"
                @change="handleColumnVisibilityChange"
            >
                <el-option v-for="col in allColumns" :key="col" :label="col" :value="col" />
            </el-select>
        </div>

        <div class="grid-container ag-theme-alpine">
            <AgGridVue
                class="ag-theme-alpine"
                :columnDefs="columnDefs"
                :rowData="rowData"
                :defaultColDef="defaultColDef"
                @grid-ready="onGridReady"
                @cell-value-changed="handleCellValueChanged"
                rowSelection="multiple"
                style="height: 500px; width: 100%"
            />
        </div>
    </div>
</template>

<style scoped>
.data-grid {
    width: 100%;
}

.controls {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.grid-container {
    height: 500px;
}

button {
    padding: 8px 16px;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}
</style>
