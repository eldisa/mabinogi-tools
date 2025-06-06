<script setup lang="ts">
import { StarFilled } from "@element-plus/icons-vue";

defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: "",
    },
});
import { defineComponent } from "vue";
defineComponent({
    name: "CardHeader",
});
</script>
<template>
    <div class="flex items-center gap-4 mb-2">
        <el-icon>
            <slot name="icon">
                <StarFilled />
            </slot>
        </el-icon>
        <div>
            <div class="text-lg font-bold">{{ title }}</div>
            <div v-if="subtitle" class="text-sm text-gray-500">{{ subtitle }}</div>
        </div>
    </div>
</template>

<style scoped>
.mb-2 {
    margin-bottom: 0.5rem;
}
</style>
