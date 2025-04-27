<template>
    <div class="mb-6">
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium">武器選擇</h3>
            <button
                @click="isTableExpanded = !isTableExpanded"
                class="px-4 py-2 text-sm bg-gray-100 rounded-md"
            >
                {{ isTableExpanded ? "收合" : "展開" }}
            </button>
        </div>
        <div class="m-4">
            <el-select
                v-model="selectedWeapons"
                multiple
                :value-key="'id'"
                placeholder="請選擇武器"
                class="w-full"
            >
                <el-option
                    v-for="item in weapons"
                    :key="item.id"
                    :label="item.name"
                    :value="item"
                />
            </el-select>
        </div>
        <div v-if="isTableExpanded && weapons.length > 0" class="mt-4">
            <table class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            武器名稱
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            最大攻擊力
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            穿刺等級
                        </th>
                        <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                            技能加成
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="weapon in selectedWeapons" :key="weapon.id">
                        <td>{{ weapon.name }}</td>
                        <td>
                            <input
                                type="number"
                                v-model="weapon.maxAtk"
                                class="w-20 border rounded px-2 py-1"
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                v-model="weapon.piercingLevel"
                                class="w-20 border rounded px-2 py-1"
                            />
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <template v-if="weapon.skillBonus.length > 0">
                                <el-tag
                                    v-for="(bonus, idx) in weapon.skillBonus"
                                    :key="idx"
                                    size="small"
                                    type="success"
                                    effect="light"
                                    class="mr-1"
                                >
                                    <el-tooltip
                                        :content="`技能 ID：${bonus.skillId}`"
                                        placement="top"
                                    >
                                        <span>
                                            {{
                                                skillMap.get(bonus.skillId) ||
                                                "未知技能"
                                            }}:
                                            {{
                                                (bonus.bonus * 100).toFixed(0)
                                            }}%
                                        </span>
                                    </el-tooltip>
                                </el-tag>
                            </template>
                            <span v-else>—</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import weapons, { type Weapon } from "../data/weapon";
import skills, { type SkillBonus } from "../data/skills";

export interface WeaponWithExtras extends Weapon {
    extraDmg: number;
    extraPierce: number;
    extraSkillBonus: SkillBonus[];
}

const isTableExpanded = ref(true);
const selectedWeaponIds = ref<number[]>([]);
const selectedWeapons = ref<Weapon[]>([]);

const skillMap = computed(() => {
    const map = new Map<number, string>();
    for (const s of skills) {
        map.set(s.id, s.name);
    }
    return map;
});

watch(selectedWeapons, (newVal) => {
    //selectedWeapons.value = weapons.filter((weapon) => newVal.includes(weapon.id));
    console.log(newVal);
});
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "WeaponSelector",
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
