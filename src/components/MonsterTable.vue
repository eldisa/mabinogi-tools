<template>
    <el-table :data="monsterTableData" style="width: 850px">
        <el-table-column prop="name" label="怪物名稱" width="150">
            <template #default="{ row }">
                <div>
                    <!-- 如果是自訂，顯示 input -->
                    <el-input v-if="row.isCustom" v-model="row.name" size="small" placeholder="輸入自訂怪物名稱" />

                    <!-- 如果是一般怪物，顯示 select -->
                    <el-select v-else v-model="row.id" size="small" @change="onSelectMonster(row)">
                        <el-option v-for="opt in monsterOptions" :key="opt.id" :label="opt.name" :value="opt.id" />
                    </el-select>
                </div>
            </template>
        </el-table-column>

        <el-table-column prop="physicalDefense" label="物理防禦" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.physicalDefense" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column prop="physicalProtect" label="物理保護" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.physicalProtect" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column prop="magicalDefense" label="魔法防禦" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.magicalDefense" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column prop="magicalProtect" label="魔法保護" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.magicalProtect" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column label="操作" width="100">
            <template #default="{ $index }">
                <el-button size="small" type="danger" @click="handleDeleteMonster($index)">刪除</el-button>
            </template>
        </el-table-column>
    </el-table>

    <!-- 新增列 -->
    <el-table
        :data="[newMonsterRow]"
        style="width: 850px; --el-table-border-color: none"
        :show-header="false"
        height="60"
    >
        <el-table-column width="150">
            <template #default="{ row }">
                <el-select v-model="row.name" size="small" @change="onSelectMonster(row)">
                    <el-option label="自訂" :value="'自訂'" />
                    <el-option v-for="opt in monsterOptions" :key="opt.name" :label="opt.name" :value="opt.name" />
                </el-select>
            </template>
        </el-table-column>

        <el-table-column prop="physicalDefense" label="物理防禦" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.physicalDefense" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column prop="physicalProtect" label="物理保護" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.physicalProtect" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column prop="magicalDefense" label="魔法防禦" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.magicalDefense" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column prop="magicalProtect" label="魔法保護" width="150">
            <template #default="{ row }">
                <el-input-number v-model="row.magicalProtect" :min="0" size="small" :disabled="!row.isCustom" />
            </template>
        </el-table-column>

        <el-table-column width="100">
            <template #default>
                <el-button size="small" type="primary" @click="addMonster">新增</el-button>
            </template>
        </el-table-column>
    </el-table>

    <div style="margin-top: 12px">
        <el-tooltip v-if="monsterTableData.length > 12" content="資料太多了" placement="top">
            <el-button type="success" size="small" :disabled="true">Apply</el-button>
        </el-tooltip>
        <el-tooltip v-else-if="monsterTableData.length < 1" content="資料不足，請至少填1組" placement="top">
            <el-button type="success" size="small" :disabled="true">Apply</el-button>
        </el-tooltip>
        <el-button v-else type="success" size="small" @click="apply">Apply</el-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MonsterEntry } from "../types";
import { monsterArray } from "../data/monster";

const monsterOptions: MonsterEntry[] = [...monsterArray];

const monsterTableData = ref<MonsterEntry[]>([]);

const newMonsterRow = ref({
    id: "custom",
    name: "自訂",
    physicalDefense: 0,
    physicalProtect: 0,
    magicalDefense: 0,
    magicalProtect: 0,
    isCustom: true,
});

const onSelectMonster = (row: MonsterEntry) => {
    const isCustom = row.name === "自訂";
    const matchedIndex = monsterOptions.findIndex((option) => option.name === row.name);

    if (isCustom) {
        row.name = `自訂${monsterTableData.value.length + 1}`;
    } else if (matchedIndex > -1) {
        newMonsterRow.value = {
            ...monsterOptions[matchedIndex],
        };
    }
};

const addMonster = () => {
    // todo: should identify by id
    // 檢查是不是非自訂的怪物
    const matched = monsterOptions.find((opt) => opt.name === newMonsterRow.value.name);

    if (matched) {
        // 如果有找到對應選項 → 用 monsterOptions 裡的防禦保護覆蓋
        monsterTableData.value.push({
            ...matched,
            isCustom: false,
        });
    } else {
        // 沒有找到，代表是自訂
        const { name, physicalDefense, physicalProtect, magicalDefense, magicalProtect, isCustom } =
            newMonsterRow.value;
        const counter: number = monsterTableData.value.length + 1;
        const id = `custom${counter}`;
        monsterTableData.value.push({
            id,
            name,
            physicalDefense,
            physicalProtect,
            magicalDefense,
            magicalProtect,
            isCustom,
        });
    }
    newMonsterRow.value = {
        id: "custom",
        name: "自訂",
        physicalDefense: 0,
        physicalProtect: 0,
        magicalDefense: 0,
        magicalProtect: 0,
        isCustom: true,
    };
};

const handleDeleteMonster = (index: number) => {
    monsterTableData.value.splice(index, 1);
};

const emit = defineEmits<{
    (e: "updateMonster", data: MonsterEntry[]): void;
}>();

const apply = () => {
    emit("updateMonster", monsterTableData.value);
};

const raw = localStorage.getItem("monsterData");

if (raw && raw.trim() !== "") {
    try {
        const storedData = JSON.parse(raw);
        monsterTableData.value = [...storedData];
        apply();
    } catch (error) {
        console.error("解析 localStorage 中的 monsterData 失敗:", error);
    }
}
</script>

<style scoped>
.el-input-number .el-input__inner {
    text-align: center;
}
</style>
