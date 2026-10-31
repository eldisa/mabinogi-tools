<script setup lang="ts">
import { ref, computed } from "vue";
import {
    AWAKENING_MAX_LEVEL,
    awakeningCumExp,
    awakeningOghamWordCount,
    awakeningSkillRank,
    awakeningDungeons,
    levelFromExp,
} from "../data/arcanaAwakening";

const activeTab = ref("calc");
const MAX_EXP = awakeningCumExp[AWAKENING_MAX_LEVEL - 1];

const curLevel = ref(1);
const curExp = ref(0);
const targetLevel = ref(AWAKENING_MAX_LEVEL);
const clears = ref(awakeningDungeons.map((d) => d.weekly));

// 等級與累積經驗互相連動
const onLevel = (lv: number | undefined) => (curExp.value = awakeningCumExp[(lv ?? 1) - 1]);
const onExp = (exp: number | undefined) => (curLevel.value = levelFromExp(exp ?? 0));

const groups = computed(() => {
    const map = new Map<string, number[]>();
    awakeningDungeons.forEach((d, i) => map.set(d.group, [...(map.get(d.group) ?? []), i]));
    return [...map];
});

const weeklyExp = computed(() => awakeningDungeons.reduce((s, d, i) => s + d.exp * (clears.value[i] ?? 0), 0));
const needExp = computed(() => Math.max(0, awakeningCumExp[targetLevel.value - 1] - curExp.value));
const weeks = computed(() => (weeklyExp.value > 0 ? Math.ceil(needExp.value / weeklyExp.value) : null));

const tableRows = awakeningCumExp.map((cum, i) => ({
    level: i + 1,
    need: i === 0 ? null : cum - awakeningCumExp[i - 1],
    cum,
    words: awakeningOghamWordCount[i],
    rank: awakeningSkillRank(i + 1),
}));
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-3xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    阿卡那覺醒經驗
                </h1>
                <p class="text-base text-gray-400 mt-3">依每週副本通關次數，計算到目標覺醒等級所需經驗與週數</p>
                <p class="text-xs text-gray-500 mt-1">資料來自韓服（拉瓦努的瑪奇）</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <el-tabs v-model="activeTab">
                    <el-tab-pane label="經驗計算" name="calc">
                        <div class="flex flex-wrap gap-3 mb-4">
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                目前覺醒等級
                                <el-input-number
                                    v-model="curLevel"
                                    :min="1"
                                    :max="AWAKENING_MAX_LEVEL"
                                    style="width: 130px"
                                    @change="onLevel"
                                />
                            </label>
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                目前累積經驗
                                <el-input-number
                                    v-model="curExp"
                                    :min="0"
                                    :max="MAX_EXP"
                                    :step="100"
                                    style="width: 170px"
                                    @change="onExp"
                                />
                            </label>
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                目標覺醒等級
                                <el-input-number
                                    v-model="targetLevel"
                                    :min="1"
                                    :max="AWAKENING_MAX_LEVEL"
                                    style="width: 130px"
                                />
                            </label>
                        </div>

                        <div class="rounded-lg px-4 py-3 border border-gray-700 bg-gray-900/50 mb-4 space-y-1 text-sm">
                            <p>
                                <span class="text-gray-400">可裝備符文詞數：</span>
                                {{ awakeningOghamWordCount[curLevel - 1] }}
                                <template v-if="awakeningSkillRank(curLevel)">
                                    <span class="text-gray-400 ml-4">覺醒技能：</span>
                                    {{ awakeningSkillRank(curLevel) }} Rank
                                </template>
                            </p>
                            <p>
                                <span class="text-gray-400">每週預估經驗：</span>
                                {{ weeklyExp.toLocaleString() }}
                            </p>
                            <p v-if="needExp === 0" class="text-gray-400">已達目標等級</p>
                            <template v-else>
                                <p>
                                    <span class="text-gray-400">所需經驗：</span>
                                    <span class="text-accent font-semibold">{{ needExp.toLocaleString() }}</span>
                                    <span class="text-xs text-gray-500 ml-2">
                                        （Lv.{{ curLevel }} / {{ curExp.toLocaleString() }} → Lv.{{ targetLevel }}）
                                    </span>
                                </p>
                                <p>
                                    <span class="text-gray-400">所需週數：</span>
                                    <span class="text-accent text-lg font-semibold">
                                        {{ weeks === null ? "請輸入每週通關次數" : `${weeks} 週` }}
                                    </span>
                                </p>
                            </template>
                        </div>

                        <h2 class="text-sm font-semibold text-gray-300 mb-2">每週各副本通關次數</h2>
                        <div v-for="[group, idxs] in groups" :key="group" class="mb-3">
                            <p class="text-sm text-accent font-semibold mb-1">{{ group }}</p>
                            <div class="flex flex-wrap gap-3">
                                <label
                                    v-for="i in idxs"
                                    :key="i"
                                    class="flex flex-col gap-1 text-xs text-gray-400"
                                >
                                    {{ awakeningDungeons[i].name }}（每次 {{ awakeningDungeons[i].exp.toLocaleString() }}）
                                    <el-input-number v-model="clears[i]" :min="0" :max="999" size="small" style="width: 120px" />
                                </label>
                            </div>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="經驗表" name="table">
                        <el-table :data="tableRows" size="small" max-height="600">
                            <el-table-column prop="level" label="等級" width="70" />
                            <el-table-column label="升級所需" align="right">
                                <template #default="{ row }">{{ row.need?.toLocaleString() ?? "—" }}</template>
                            </el-table-column>
                            <el-table-column label="累積經驗" align="right">
                                <template #default="{ row }">{{ row.cum.toLocaleString() }}</template>
                            </el-table-column>
                            <el-table-column prop="words" label="符文詞數" width="90" align="center" />
                            <el-table-column label="覺醒技能" width="90" align="center">
                                <template #default="{ row }">{{ row.rank ?? "—" }}</template>
                            </el-table-column>
                        </el-table>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
