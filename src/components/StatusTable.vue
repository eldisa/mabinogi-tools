<template>
    <el-table :data="tableData" style="width: 700px;">
        <el-table-column prop="name" label="自訂名稱" width="200">
            <template #default="{ row }">
                <el-input v-model="row.name" size="small" />
            </template>
        </el-table-column>

        <el-table-column prop="damage" label="大傷" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.damage" :min="0" size="small" />
            </template>
        </el-table-column>

        <el-table-column prop="pLevel" label="穿刺" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.pLevel" :min="0" size="small" />
            </template>
        </el-table-column>

        <el-table-column label="操作" width="100">
            <template #default="{ $index }">
                <el-button size="small" type="danger" @click="handleDelete($index)">刪除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 新增列區 -->
    <!-- <el-table :data="[newRow]" style="width: 100%; --el-table-border-color: none;" height="60" :show-header="false" -->
    <el-table :data="[newRow]" style="width: 700px;--el-table-border-color: none;" height="60" :show-header="false"
        class="custom-no-border">
        <el-table-column label=" 自訂名稱" width="200">
            <template #default="{ row }">
                <el-input placeholder="請填寫名稱" v-model="row.name" size="small" />
            </template>
        </el-table-column>

        <el-table-column label="大傷" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.damage" :min="0" size="small" />
            </template>
        </el-table-column>

        <el-table-column label="穿刺" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.pLevel" :min="0" size="small" />
            </template>
        </el-table-column>

        <el-table-column width="100">
            <template #default>
                <el-tooltip v-if="tableData.length >= 12" content="資料太多了" placement="top">
                    <el-button size="small" type="primary" :disabled="true">新增</el-button>
                </el-tooltip>
                <el-button v-else size="small" type="primary" @click="addRow">新增</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div style="margin-top: 12px">
        <el-tooltip v-if="tableData.length > 12" content="資料太多了" placement="top">
            <el-button type="success" size="small" :disabled="true">Apply</el-button>
        </el-tooltip>
        <el-tooltip v-else-if="tableData.length < 1" content="資料不足，請至少填1組" placement="top">
            <el-button type="success" size="small" :disabled="true">Apply</el-button>
        </el-tooltip>
        <el-button v-else type="success" size="small" @click="apply">
            Apply
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CompareEntry } from '../types';

defineOptions({
    name: "StatusTable",
});

const defaultData: CompareEntry = { name: '', damage: 0, pLevel: 0 };

const emit = defineEmits<{
    (e: 'updateStatus', data: CompareEntry[]): void
}>();

const tableData = ref<CompareEntry[]>([
    { name: '組合1', damage: 1500, pLevel: 0 },
]);

const newRow = ref<CompareEntry>({ ...defaultData });

const addRow = () => {
    if (!newRow.value.name) {
        newRow.value.name = `組合${tableData.value.length + 1}`;
    }
    tableData.value.push({ ...newRow.value });
    newRow.value = { name: '', damage: 0, pLevel: 0 };
};

const handleDelete = (index: number) => {
    tableData.value.splice(index, 1);
};

const apply = () => {
    emit('updateStatus', tableData.value);
};

const raw = localStorage.getItem('statusData');

if (raw && raw.trim() !== '') {
    try {
        const storedData = JSON.parse(raw);
        tableData.value = [...storedData]
        apply();
    } catch (error) {
        console.error('解析 localStorage 中的 statusData 失敗:', error);
    }
}
</script>


<style scoped>
.el-input-number .el-input__inner {
    text-align: center;
}
</style>