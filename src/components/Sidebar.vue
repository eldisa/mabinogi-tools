<script setup lang="ts">
import { ref } from "vue";

const menuItems = [
    { id: "damage-calc", name: "傷害計算與武器比較", active: true },
];
</script>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Sidebar",
});
</script>

<template>
    <div class="w-64 h-full bg-gray-800 text-white">
        <div class="p-4">
            <h2 class="text-xl font-bold mb-4">遊戲工具</h2>
            <nav>
                <ul>
                    <li
                        v-for="item in menuItems"
                        :key="item.id"
                        class="py-2 px-4 hover:bg-gray-700 rounded cursor-pointer"
                        :class="{ 'bg-gray-700': item.active }"
                    >
                        {{ item.name }}
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
