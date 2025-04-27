<template>
    <el-table :data="tableData" style="width: 100%;">
        <el-table-column prop="active" label="啟用" width="100">
            <template #default="{ row }">
                <el-switch v-model="row.active" />
            </template>
        </el-table-column>
        <el-table-column prop="name" label="名稱" width="200">
            <template #default="{ row }">
                <div class="flex items-center gap-1">
                    {{ row.name }}
                    <el-tooltip :content="row.description || '無說明'" placement="top">
                        <el-icon size="18">
                            <InfoFilled /> <!-- 這裡用的是 Element Plus 的 info icon -->
                        </el-icon>
                    </el-tooltip>
                </div>
            </template>
        </el-table-column>


        <el-table-column prop="physicalDefense" label="物理防禦" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.physicalDefense.value" :min="0" size="small"
                    :disabled="!row.physicalDefense.editable" />
            </template>
        </el-table-column>

        <el-table-column prop="physicalProtect" label="物理保護" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.physicalProtect.value" :min="0" size="small"
                    :disabled="!row.physicalProtect.editable" />
            </template>
        </el-table-column>

        <el-table-column prop="magicalDefense" label="魔法防禦" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.magicalDefense.value" :min="0" size="small"
                    :disabled="!row.magicalDefense.editable" />
            </template>
        </el-table-column>

        <el-table-column prop="magicalProtect" label="魔法保護" width="200">
            <template #default="{ row }">
                <el-input-number v-model="row.magicalProtect.value" :min="0" size="small"
                    :disabled="!row.magicalProtect.editable" />
            </template>
        </el-table-column>
    </el-table>

    <div style="margin-top: 12px">
        <el-button type="success" size="small" @click="apply">
            Apply
        </el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Debuff } from '../types';
import { debuffData } from '../data/debuff';
import { InfoFilled } from '@element-plus/icons-vue';

defineOptions({
    name: "DebuffTable",
});

const emit = defineEmits<{
    (e: 'updateDebuff', data: Debuff[]): void
}>();

const tableData = ref<Debuff[]>([
    ...debuffData
]);

const apply = () => {
    emit('updateDebuff', tableData.value);
};

const raw = localStorage.getItem('debuffData');

if (raw && raw.trim() !== '') {
    try {
        const storedData = JSON.parse(raw);
        tableData.value = [...storedData]
        apply();
    } catch (error) {
        console.error('解析 localStorage 中的 debuffData 失敗:', error);
    }
}
</script>


<style scoped>
.el-input-number .el-input__inner {
    text-align: center;
}
</style>