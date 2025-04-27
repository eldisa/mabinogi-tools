<script setup lang="ts">
import PierecingLevelChart from "./SimpleDamageCompare.vue";
</script>

<template>
    <div class="pierecing-analysis">
        <h1>穿刺效益分析</h1>
        <PierecingLevelChart />
    </div>
</template>

<style scoped>
.pierecing-analysis {
    padding: 20px;
}

h1 {
    margin-bottom: 20px;
    color: #2c3e50;
}
</style>
