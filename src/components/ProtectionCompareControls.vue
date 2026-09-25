<script setup lang="ts">
// 怪物／銳利等級／比較基準 選擇列；計算見 utils/protectionCompare.ts
import { computed } from "vue";
import { MONSTERS, findMonster, type ProtCompareSettings } from "../utils/protectionCompare";

const model = defineModel<ProtCompareSettings>({ required: true });
// 銳利等級由呼叫端各自設定時可隱藏（例如 A/B 比較）
withDefaults(defineProps<{ showPierce?: boolean }>(), { showPierce: true });
const monster = computed(() => findMonster(model.value.monster));
</script>

<template>
    <div class="flex items-center gap-2.5 flex-wrap">
        <el-select v-model="model.monster" size="small" style="width: 170px" aria-label="怪物">
            <el-option v-for="m in MONSTERS" :key="m.key" :label="m.label" :value="m.key" />
        </el-select>
        <span class="text-xs text-gray-400">
            保護 {{ monster.prot }}<template v-if="monster.pierceResist">・銳利抵抗 {{ monster.pierceResist }}</template>
        </span>
        <template v-if="showPierce">
            <span class="text-xs text-gray-400">銳利等級</span>
            <el-select v-model="model.pierce" size="small" style="width: 70px" aria-label="銳利等級">
                <el-option v-for="n in 12" :key="n - 1" :label="n - 1" :value="n - 1" />
            </el-select>
        </template>
        <span class="text-xs text-gray-400">比較基準</span>
        <el-select v-model="model.baseline" size="small" style="width: 150px" aria-label="比較基準">
            <el-option label="未破防（含銳利）" value="pierce" />
            <el-option label="原始保護（不含銳利）" value="raw" />
        </el-select>
    </div>
</template>
