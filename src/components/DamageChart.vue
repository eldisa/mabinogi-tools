<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts/core";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
} from "echarts/components";
import { BarChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import weapons from "../data/weapon";
import skills from "../data/skills";
import { Skill, SkillBonus, Weapon } from "../types/index";

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    BarChart,
    CanvasRenderer,
]);

const chartContainer = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const talentId = 1; // todo: need to ref out from props
// const status= {
//     strength:2500,
//     enhanceAtk: 3000,
//     piercingLevel:5
// }
const strength = 2500,
    enhanceAtk = 300,
    piercingLevel = 5;
let series = [];
let atkWhenEquippedArray: number[] = [];
//process data and insert to series
skills
    .filter((skill) => skill.talentId === talentId)
    .forEach((skill) => {
        const data: number[] = [];
        let { id, name, damage, calculate } = skill;
        weapons.forEach((weapon: Weapon) => {
            const { maxAtk, skillBonus } = weapon;
            let index = skillBonus.findIndex(
                (bonus: SkillBonus) => bonus.skillId === id
            );
            if (index > -1) {
                damage *= 1 + skillBonus[index].bonus;
            }

            const atkWhenEquipped = maxAtk + strength / 2.5 + enhanceAtk;
            const calculateResult =
                typeof calculate === "function"
                    ? calculate(atkWhenEquipped, damage)
                    : 0;
            let result = Math.floor(calculateResult);
            atkWhenEquippedArray.push(atkWhenEquipped);
            data.push(result);
        });
        series.push({
            name,
            type: "bar",
            data,
        });
    });
series.push({
    name: "面板大傷",
    type: "bar",
    data: atkWhenEquippedArray,
});

onMounted(() => {
    if (chartContainer.value) {
        chart = echarts.init(chartContainer.value);

        const option = {
            title: {
                text: "Example Chart",
            },
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {},
            grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true,
            },
            xAxis: {
                type: "value",
                boundaryGap: [0, 0.01],
            },
            yAxis: {
                type: "category",
                data: weapons.map((weapon) => weapon.name),
            },
            // series: [
            //     {
            //         name: "2011",
            //         type: "bar",
            //         data: [18203, 23489, 29034, 104970, 131744, 630230],
            //     },
            series,
        };

        chart.setOption(option);
    }
});

onUnmounted(() => {
    if (chart) {
        chart.dispose();
    }
});
</script>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "WeaponSelector",
});
</script>

<template>
    <div class="h-[400px]" style="height: 400px">
        <div
            ref="chartContainer"
            class="w-full h-[400px]"
            style="height: 400px"
        ></div>
    </div>
</template>
