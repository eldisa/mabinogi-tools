<script setup lang="ts">
import { ref, computed } from "vue";
import VChart from "vue-echarts";

// 🛠️ 模擬輸入資料：這裡以 protection 和各技能的傷害為例
// ⚡ 之後會改成由 statusData, debuffData, monsterData 公式推算後輸入
const protections = [50, 100, 150, 200, 250];
const skills = ["技能A", "技能B", "技能C"];
const damages = [
    [100, 120, 150, 170, 190], // 技能A對應的每個protection的傷害
    [90, 110, 140, 160, 185], // 技能B
    [80, 100, 130, 155, 180], // 技能C
];

// 📌 用來選擇目前顯示哪種圖表
const chartType = ref<"stacked" | "bar" | "radar">("stacked");

// 🎯 自動切換 option
const option = computed(() => {
    if (chartType.value === "stacked") {
        return generateStackedAreaOption();
    } else if (chartType.value === "bar") {
        return generateBarChartOption();
    } else if (chartType.value === "radar") {
        return generateRadarChartOption();
    }
});

// 🟦 疊層面積圖設定
function generateStackedAreaOption() {
    return {
        tooltip: { trigger: "axis" },
        legend: { data: skills },
        xAxis: { type: "category", data: protections },
        yAxis: { type: "value" },
        series: skills.map((skill, idx) => ({
            name: skill,
            type: "line",
            stack: "Total",
            areaStyle: {},
            data: damages[idx],
        })),
    };
}

// 🟨 長條圖設定
function generateBarChartOption() {
    return {
        tooltip: { trigger: "axis" },
        legend: { data: skills },
        xAxis: { type: "category", data: protections },
        yAxis: { type: "value" },
        series: skills.map((skill, idx) => ({
            name: skill,
            type: "bar",
            data: damages[idx],
        })),
    };
}

// 🟪 雷達圖設定
function generateRadarChartOption() {
    return {
        tooltip: {},
        radar: {
            indicator: protections.map((protect) => ({
                name: `保護${protect}`,
                max: 300, // 🛠️ 根據你的傷害範圍自行調整最大值
            })),
        },
        series: [
            {
                type: "radar",
                data: skills.map((skill, idx) => ({
                    name: skill,
                    value: damages[idx],
                })),
            },
        ],
    };
}
</script>

<template>
    <!-- 📌 Radio切換圖表種類 -->
    <div class="mb-4">
        <el-radio-group v-model="chartType" size="small">
            <el-radio-button label="stacked">疊層面積圖</el-radio-button>
            <el-radio-button label="bar">長條圖</el-radio-button>
            <el-radio-button label="radar">雷達圖</el-radio-button>
        </el-radio-group>
    </div>

    <!-- 📈 圖表顯示 -->
    <v-chart class="chart" :option="option" style="height: 400px" />
</template>

<style scoped>
.chart {
    margin-top: 20px;
}
</style>
