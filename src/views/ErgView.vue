<script setup lang="ts">
import { ref, computed } from "vue";
import {
    ergGrades,
    ergWeapons,
    ergEffects,
    ergExpBetween,
    ergSMaterials,
    parseMaterial,
    ERG_MAX_LEVEL,
    type ErgGrade,
} from "../data/erg";

const activeTab = ref("effect");
const grade = ref<ErgGrade>("S");
const weaponName = ref(ergWeapons[0].name);
const level = ref(ERG_MAX_LEVEL);

const weapon = computed(() => ergWeapons.find((w) => w.name === weaponName.value)!);
const effects = computed(() => ergEffects(weapon.value, grade.value, level.value));

// 突破材料：從目前等級升到目標等級
const matGrade = ref<ErgGrade>("S");
// 活動道具可直接升到 S35，預設從 35 起算
const fromLevel = ref(35);
const toLevel = ref(ERG_MAX_LEVEL);
const totalExp = computed(() =>
    ergExpBetween(matGrade.value, fromLevel.value, Math.max(fromLevel.value, toLevel.value)),
);
// 每 5 級需突破等級上限（黑暗聚能不需要）
const breakthroughs = computed(() => {
    if (matGrade.value === "dark") return [];
    const list: number[] = [];
    for (let lv = Math.ceil(fromLevel.value / 5) * 5; lv < toLevel.value; lv += 5) list.push(lv);
    return list;
});
const matWeapon = ref(ergWeapons[0].name);
// 目前只收錄 S 等級材料；第 n 次突破在 Lv.5n
const matRows = computed(() => {
    const table = matGrade.value === "S" ? ergSMaterials[matWeapon.value] : undefined;
    return table ? breakthroughs.value.map((lv) => ({ lv, items: table[lv / 5 - 1] })) : null;
});
const matTotal = computed(() => {
    const sum = new Map<string, number>();
    for (const { items } of matRows.value ?? []) {
        for (const s of items) {
            const [name, n] = parseMaterial(s);
            sum.set(name, (sum.get(name) ?? 0) + n);
        }
    }
    return [...sum];
});
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-3xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    聚能查詢
                </h1>
                <p class="text-base text-gray-400 mt-3">查詢各武器聚能等級效果</p>
            </header>

            <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <el-tabs v-model="activeTab">
                    <el-tab-pane label="聚能效果查詢" name="effect">
                        <div class="flex flex-wrap gap-3 mb-4">
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                等級
                                <el-select v-model="grade" style="width: 140px">
                                    <el-option
                                        v-for="g in ergGrades"
                                        :key="g.value"
                                        :label="g.label"
                                        :value="g.value"
                                    />
                                </el-select>
                            </label>
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                武器種類
                                <el-select v-model="weaponName" filterable style="width: 160px">
                                    <el-option v-for="w in ergWeapons" :key="w.name" :label="w.name" :value="w.name" />
                                </el-select>
                            </label>
                        </div>

                        <div class="flex items-center gap-4 mb-4">
                            <span class="text-sm text-gray-400 shrink-0">Lv.</span>
                            <el-slider v-model="level" :min="1" :max="ERG_MAX_LEVEL" class="flex-1" />
                            <el-input-number
                                v-model="level"
                                :min="1"
                                :max="ERG_MAX_LEVEL"
                                size="small"
                                style="width: 100px"
                            />
                        </div>

                        <p v-if="grade === 'dark'" class="text-xs text-gray-500 mb-2">
                            黑暗聚能保留 S 等級 50 效果，並追加黑暗聚能效果
                        </p>
                        <ul class="space-y-2">
                            <li
                                v-for="(e, i) in effects"
                                :key="i"
                                class="rounded-lg px-4 py-2 border flex items-center gap-2"
                                :class="
                                    e.dark
                                        ? 'border-purple-500/60 bg-purple-900/30 text-purple-200'
                                        : e.unlocked
                                          ? 'border-gray-700 bg-gray-900/50 text-gray-200'
                                          : 'border-gray-800 bg-gray-900/20 text-gray-600'
                                "
                            >
                                <span v-if="e.dark" class="text-xs font-semibold text-purple-400 shrink-0">
                                    黑暗聚能
                                </span>
                                <span class="flex-1">{{ e.text }}</span>
                                <span v-if="!e.unlocked" class="text-xs shrink-0">Lv.{{ e.unlock }} 解鎖</span>
                            </li>
                        </ul>
                    </el-tab-pane>

                    <el-tab-pane label="聚能突破材料查詢" name="material">
                        <div class="flex flex-wrap items-end gap-3 mb-4">
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                等級
                                <el-select v-model="matGrade" style="width: 140px">
                                    <el-option
                                        v-for="g in ergGrades"
                                        :key="g.value"
                                        :label="g.label"
                                        :value="g.value"
                                    />
                                </el-select>
                            </label>
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                武器種類
                                <el-select v-model="matWeapon" filterable style="width: 160px">
                                    <el-option v-for="w in ergWeapons" :key="w.name" :label="w.name" :value="w.name" />
                                </el-select>
                            </label>
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                目前 Lv.
                                <el-input-number
                                    v-model="fromLevel"
                                    :min="1"
                                    :max="ERG_MAX_LEVEL"
                                    style="width: 120px"
                                />
                            </label>
                            <label class="flex flex-col gap-1 text-sm text-gray-400">
                                目標 Lv.
                                <el-input-number v-model="toLevel" :min="1" :max="ERG_MAX_LEVEL" style="width: 120px" />
                            </label>
                        </div>

                        <p v-if="toLevel <= fromLevel" class="text-sm text-gray-500">目標等級需高於目前等級</p>
                        <template v-else>
                            <div class="rounded-lg px-4 py-3 border border-gray-700 bg-gray-900/50 mb-3">
                                <span class="text-sm text-gray-400">所需經驗值合計</span>
                                <span class="ml-3 text-lg font-semibold text-accent">
                                    {{ totalExp.toLocaleString() }}
                                </span>
                            </div>
                            <template v-if="breakthroughs.length">
                                <p class="text-sm text-gray-400 mb-2">需突破等級上限 {{ breakthroughs.length }} 次</p>
                                <p v-if="!matRows" class="text-sm text-gray-500">
                                    {{ matGrade === "S" ? "此武器材料尚未收錄" : "未收錄 B / A 等級材料。過往活動曾推出可直升 S35 的道具，建議優先考慮，能省下不少培養時間" }}
                                </p>
                                <template v-else>
                                    <div class="rounded-lg px-4 py-3 border border-accent/40 bg-gray-900/50 mb-3">
                                        <p class="text-sm text-gray-400 mb-2">材料合計</p>
                                        <div class="flex flex-wrap gap-2">
                                            <span
                                                v-for="[name, n] in matTotal"
                                                :key="name"
                                                class="text-sm text-gray-200 bg-gray-700/60 rounded px-2 py-0.5"
                                            >
                                                {{ name }}
                                                <span class="text-accent font-semibold">×{{ n }}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        v-for="row in matRows"
                                        :key="row.lv"
                                        class="rounded-lg px-4 py-3 border border-gray-700 bg-gray-900/50 mb-2"
                                    >
                                        <p class="text-sm text-accent font-semibold mb-1">
                                            Lv.{{ row.lv }} → 上限 {{ row.lv + 5 }}
                                        </p>
                                        <p class="text-sm text-gray-300">{{ row.items.join("、") }}</p>
                                    </div>
                                </template>
                            </template>
                            <p v-else-if="matGrade === 'dark'" class="text-xs text-gray-500">
                                黑暗聚能不需突破，直接升級
                            </p>
                        </template>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </div>
    </div>
</template>
