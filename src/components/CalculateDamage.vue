<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Monster } from "../types";
import WeaponSelector from "./WeaponSelector.vue";
import DamageChart from "./DamageChart.vue";
import skills from "../data/skills";
import talents from "../data/talent";
import { Skill, SkillBonus, Talent, Weapon, DamageType } from "../types/index";

type TalentTabs = {
    name: string;
    id: number;
    skills: Skill[];
    selected: boolean;
};

const talentTabs = ref<TalentTabs[]>([
    // Add more jobs as needed
]);

const initialTalentTabs = () => {
    talents.forEach((talent) => {
        const filteredSkills: Skill[] = skills.filter((skill: Skill) => skill.talentId === talent.id);

        talentTabs.value.push({
            name: talent.name,
            id: talent.id,
            skills: filteredSkills,
            selected: false,
        });
    });
};

initialTalentTabs();

// const updateTalentTabs = (id: number, updatedTab: Partial<TalentTabs>) => {
//   const index = talentTabs.value.findIndex(tab => tab.id === id);
//   if (index !== -1) {
//     talentTabs.value[index] = { ...talentTabs.value[index], ...updatedTab };
//   }
// };

// const addTalentTab = (newTab: TalentTabs) => {
//   talentTabs.value.push(newTab);
// };

const selectedJob = ref(talentTabs.value[0]);
const selectedWeapons = ref<Weapon[]>([]);
const handleSkillToggle = (skillId: number) => {
    const job = selectedJob.value;
    const skill = job.skills.find((s) => s.id === Number(skillId));
    if (skill) {
        skill.selected = !skill.selected;
    }
};

watch(selectedWeapons, (newVal) => {
    // Handle weapon selection changes
    console.log("Selected Weapons:", newVal);
});
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "CaluculateDamage",
});
</script>

<template>
    <div class="p-6">
        <!-- Job Tabs -->
        <div class="mb-6">
            <div class="border-b border-gray-200">
                <nav class="-mb-px flex space-x-8">
                    <button
                        v-for="talent in talentTabs"
                        :key="talent.id"
                        @click="selectedJob = talent"
                        :class="[
                            selectedJob.id === talent.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                        ]"
                    >
                        {{ talent.name }}
                    </button>
                </nav>
            </div>
        </div>

        <!-- Skills Selection -->
        <div class="mb-6">
            <h3 class="text-lg font-medium mb-3">技能選擇</h3>
            <div class="flex flex-wrap gap-4">
                <label v-for="skill in selectedJob.skills" :key="skill.id" class="inline-flex items-center">
                    <input
                        type="checkbox"
                        :checked="skill.selected"
                        @change="handleSkillToggle(skill.id)"
                        class="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span class="ml-2">{{ skill.name }}</span>
                </label>
            </div>
        </div>
        <!--test-->
        <div class="m-4"></div>
        <!-- Weapon Selector -->
        <WeaponSelector />
        <!-- Monster Selection (Placeholder) -->
        <div class="mb-6">
            <h3 class="text-lg font-medium mb-3">選擇目標</h3>
            <input type="text" placeholder="搜尋或輸入目標" class="w-full max-w-xs px-4 py-2 border rounded-md" />
        </div>

        <!-- Damage Chart -->
        <div style="height: 400px">
            <DamageChart />
        </div>
    </div>
</template>
