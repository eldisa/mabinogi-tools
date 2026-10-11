<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { QUICK_WEAPON_OPTIONS, type WeaponCategory } from "../data/enchantSlots";

// 武器大類 + 武器類型兩段式選單。allowed 有給就只列出這些武器類型（各職業限定的武器）。
const props = defineProps<{ allowed?: string[] }>();
const model = defineModel<string>({ required: true });

const options = computed(() => QUICK_WEAPON_OPTIONS.filter((w) => !props.allowed || props.allowed.includes(w.label)));
const categories = computed(() => [...new Set(options.value.map((w) => w.category))]);
const current = ref<WeaponCategory>(options.value.find((w) => w.label === model.value)?.category ?? categories.value[0]);
const weapons = computed(() => options.value.filter((w) => w.category === current.value));

// 切換大類，或限定的武器清單改變而目前武器不在其中時，跳到第一個可選的
const pickFirst = () => {
    if (!weapons.value.some((w) => w.label === model.value)) model.value = weapons.value[0]?.label ?? "";
};
watch(current, pickFirst);
watch(options, () => {
    if (!options.value.some((w) => w.label === model.value)) {
        model.value = options.value[0]?.label ?? "";
        current.value = options.value[0]?.category ?? current.value;
    }
});
</script>

<template>
    <div class="flex gap-2">
        <el-select v-model="current" style="width: 110px" :disabled="categories.length <= 1">
            <el-option v-for="c in categories" :key="c" :label="c" :value="c" />
        </el-select>
        <el-select v-model="model" style="width: 160px" :disabled="weapons.length <= 1">
            <el-option v-for="w in weapons" :key="w.label" :label="w.display ?? w.label" :value="w.label" />
        </el-select>
    </div>
</template>
