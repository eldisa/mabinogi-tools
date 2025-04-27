<template>
    <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="space-y-6">
            <!-- Controls Section -->
            <div class="space-y-4">
                <el-tabs type="border-card">
                    <el-tab-pane label="角色素值設定" actived>
                        <StatusTable @updateStatus="handleStatusUpdate" />
                    </el-tab-pane>
                    <el-tab-pane label="破防保">
                        <DebuffTable @updateDebuff="handleDebuffUpdate" />
                    </el-tab-pane>
                    <el-tab-pane label="Buff(施工中)" disabled>Config</el-tab-pane>
                    <el-tab-pane label="選擇目標怪物"><!-- 🟨 怪物選擇區塊 -->
                        <MonsterTable @updateMonster="handleMonsterUpdate" />
                    </el-tab-pane>
                </el-tabs>
            </div>

            <!-- Analysis Results -->

            <!-- Chart -->
            <!-- <v-chart class="w-full h-[400px]" :option="option" /> -->
            <!-- <v-chart v-if="option && Array.isArray(option.series) && option.series.length" autoresize
                class="w-full h-[400px]" :option="option" /> -->
            <div v-if="!isReadyToDraw">資料設定完後才會顯示圖表</div>
            <div v-else>
                <v-chart autoresize class="w-full h-[400px]" :option="option" />
            </div>



        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart, LineChart, RadarChart } from "echarts/charts";
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
    LegendComponent,
    DataZoomComponent,
    RadarComponent,
} from "echarts/components";

import { CompareEntry, Debuff, MonsterEntry } from '../types';
import VChart from "vue-echarts";
import DebuffTable from "../components/DebuffTable.vue";
import StatusTable from "../components/StatusTable.vue";
import MonsterTable from "../components/MonsterTable.vue";
import { generateDamageCompareRadar, generateDamageCompareBar } from '../utils/generateChartOption';
import * as echarts from 'echarts';
use([
    CanvasRenderer,
    BarChart,
    LineChart,
    RadarChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    DataZoomComponent,
    RadarComponent,
]);

type EChartsOption = echarts.EChartsOption;

const statusData = ref<CompareEntry[]>([]);
const debuffData = ref<Debuff[]>([]);
const monsterData = ref<MonsterEntry[]>([]);
const isPhysical = ref<Boolean>(true);
const option = ref<EChartsOption>();

const applyChanges = (): void => {
    if (!isReadyToDraw) return;
    // radar
    // option.value = generateDamageCompareRadar(
    //     statusData.value,
    //     debuffData.value,
    //     monsterData.value,
    //     isPhysical.value as boolean
    // )
    option.value = generateDamageCompareBar(
        statusData.value,
        debuffData.value,
        monsterData.value,
        isPhysical.value as boolean
    )
};

const handleStatusUpdate = (data: CompareEntry[]) => {
    localStorage.setItem('statusData', JSON.stringify(data));
    statusData.value = data;
};

const handleDebuffUpdate = (data: Debuff[]) => {
    localStorage.setItem('debuffData', JSON.stringify(data));
    debuffData.value = data;
};

const handleMonsterUpdate = (data: MonsterEntry[]) => {
    localStorage.setItem('monsterData', JSON.stringify(data));
    monsterData.value = data;
};

const isReadyToDraw = computed(() => {
    return (
        Array.isArray(statusData.value) && statusData.value.length > 1 &&
        Array.isArray(debuffData.value) && debuffData.value.length > 1 &&
        Array.isArray(monsterData.value) && monsterData.value.length > 1
    );
});

watch(
    [statusData, debuffData, monsterData],
    ([,]) => {
        if (isReadyToDraw.value) {
            applyChanges();
        }
    },
    { deep: true }
);

</script>
<style scoped>
.radar-chart {
    width: 100%;
    height: 400px;
}
</style>
