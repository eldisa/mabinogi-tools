<script setup lang="ts">
import { ref } from "vue";
import { ColDef, GridApi } from "ag-grid-community";
import DataGrid from "../components/DataGrid.vue";
import ComplexDataModal from "../components/ComplexDataModal.vue";

const gridApi = ref<GridApi>();
const rowData = ref([
    {
        id: 1,
        name: "John",
        age: 25,
        complexData: { key1: "value1", key2: "value2" },
    },
    {
        id: 2,
        name: "Jane",
        age: 30,
        complexData: { key1: "value3", key2: "value4" },
    },
    {
        id: 3,
        name: "Bob",
        age: 35,
        complexData: { key1: "value5", key2: "value6" },
    },
]);

const visibleColumns = ref(["id", "name", "age"]);
const allColumns = ["id", "name", "age"];

const modalVisible = ref(false);
const selectedRow = ref<any>(null);

const columnDefs = ref<ColDef[]>([
    { field: "id", checkboxSelection: true },
    {
        field: "name",
        editable: true,
        cellEditor: "agTextCellEditor",
    },
    {
        field: "age",
        editable: true,
        cellEditor: "agNumberCellEditor",
    },
    {
        field: "actions",
        headerName: "Actions",
        cellRenderer: (params: any) => {
            const rowId = params.data.id;
            return `
        <button onclick="document.dispatchEvent(new CustomEvent('editComplex', 
          { detail: ${rowId} }))">
          Edit Complex Data
        </button>
      `;
        },
    },
]);

const handleCellValueChanged = (event: any) => {
    const { data, colDef, newValue } = event;
    const rowIndex = rowData.value.findIndex((row) => row.id === data.id);
    if (rowIndex !== -1) {
        const updatedRowData = {
            ...rowData.value[rowIndex],
            [colDef.field]: newValue,
        };
        // if (gridApi.value) {
        //     gridApi.value!.setGridOption("rowData", newData);
        // }
        rowData.value[rowIndex] = {
            ...rowData.value[rowIndex],
            [colDef.field]: newValue,
        };
    }
};

const editComplexData = (event: CustomEvent) => {
    const rowId = event.detail;
    selectedRow.value = rowData.value.find((row) => row.id === rowId);
    modalVisible.value = true;
};

const handleSaveComplexData = (id: number, complexData: any) => {
    const rowIndex = rowData.value.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
        rowData.value[rowIndex] = {
            ...rowData.value[rowIndex],
            complexData,
        };
    }
    modalVisible.value = false;
};

const updateRowData = (newData: any[]) => {
    rowData.value = newData;
};

document.addEventListener("editComplex", editComplexData as EventListener);
</script>

<template>
    <div class="grid-demo">
        <h1>AG Grid Demo</h1>
        <DataGrid
            :rowData="rowData"
            :columnDefs="columnDefs"
            :visibleColumns="visibleColumns"
            :allColumns="allColumns"
            @update:rowData="updateRowData"
            @cellValueChanged="handleCellValueChanged"
        />

        <ComplexDataModal
            v-model:visible="modalVisible"
            :row-data="selectedRow"
            @save="handleSaveComplexData"
        />
    </div>
</template>

<style scoped>
.grid-demo {
    padding: 20px;
}

h1 {
    margin-bottom: 20px;
}
</style>
