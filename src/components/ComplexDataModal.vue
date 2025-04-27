<script setup lang="ts">
import { ref, watch } from "vue";
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton } from "element-plus";

interface ComplexData {
    key1: string;
    key2: string;
}

const props = defineProps<{
    visible: boolean;
    rowData: {
        id: number;
        complexData: ComplexData;
    } | null;
}>();

const emit = defineEmits<{
    "update:visible": [value: boolean];
    save: [id: number, data: ComplexData];
}>();

const formData = ref<ComplexData>({
    key1: "",
    key2: "",
});

watch(
    () => props.rowData,
    (newData) => {
        if (newData) {
            formData.value = { ...newData.complexData };
        }
    },
    { immediate: true }
);

const handleClose = () => {
    emit("update:visible", false);
};

const handleSave = () => {
    if (props.rowData) {
        emit("save", props.rowData.id, formData.value);
        handleClose();
    }
};
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "ComplexDataModal",
});
</script>

<template>
    <el-dialog
        title="Edit Complex Data"
        :modelValue="visible"
        @update:modelValue="(val) => emit('update:visible', val)"
        width="500px"
    >
        <el-form v-if="rowData">
            <el-form-item label="Key 1">
                <el-input v-model="formData.key1" />
            </el-form-item>
            <el-form-item label="Key 2">
                <el-input v-model="formData.key2" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">Cancel</el-button>
                <el-button type="primary" @click="handleSave">Save</el-button>
            </span>
        </template>
    </el-dialog>
</template>
