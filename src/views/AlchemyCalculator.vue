<script setup lang="ts">
import { ref, computed, reactive } from "vue";

// ========== 全域基礎屬性 ==========
const globalStats = reactive({
    // A1 屬性傷害
    waterDmg: 500,      // 水屬性煉金傷害
    fireDmg: 500,       // 火屬性煉金傷害
    // A2 平均傷害
    avgDmg: 500,        // 四屬性平均煉金傷害
    // H 通用額外加成
    commonExtra: 0,     // 通用額外加成 %（裝等、農場物、圖騰、頭銜、特改、催化協同、犬靈等）
    // I 暴擊傷害
    critDmg: 150,       // 暴擊傷害 %（基礎 150%）
    // J 其他獨立加成
    independentMulti: 0, // 其他獨立加成 %（戰鬥 VIP 1%、三眼、致命穿透、威光等）
});

// ========== 精通與效率 ==========
const masteryStats = reactive({
    // 精通效率基礎值
    waterMasteryEff: 10,    // 水精通效率 %（基礎 10%）
    fireMasteryEff: 10,     // 火精通效率 %（基礎 10%）
    earthMasteryEff: 10,    // 土精通效率 %（基礎 10%）
    // 鑑定加成
    waterMasteryAppraisal: false,   // 水精通 20 級鑑定 +10%
    fireMasteryAppraisal: false,    // 火精通 20 級鑑定 +10%
    earthMasteryAppraisal: false,   // 土精通 20 級鑑定 +4%
    // E 鋼瓶加成
    cylinderBonus: 30,      // 屬性鋼瓶加成 %
    // G 才能額外
    talentBonus: 0,         // 才能額外加成 %（精靈武器、藍月亮等）
});

// ========== 套裝與組合式 ==========
const gearStats = reactive({
    // 套裝
    crewSetBonus: 15,       // 克雷套增幅 %
    // 組合式設定
    comboFinalDmgFire: 15,      // 四火：最終傷害 % (化學狂歡用)
    comboFinalDmgWater: 100,    // 四水：最終傷害 % (螺旋爆裂用)
    comboFinalDmgEarth: 20,     // 四土：最終傷害 % (召喚夢魘用)
    comboStatusEffect: 20,      // 四火：異常狀態效果 %
    comboHerbBlue: 15,          // 藍草+曼德拉 % (水系)
    comboHerbGreen: 15,         // 綠草+曼德拉 % (土系)
    comboHerbRed: 15,           // 紅草+曼德拉 % (火系)
});

// ========== 催化協同參數 ==========
const catalyticStats = reactive({
    baseValue: 8,           // 基礎值 %（四火+鏈接 = 8%）
    herbBonus: 15,          // 紅草+曼德拉 %
    linkAttributeAvg: 0,    // 平均屬性（每 500 +1%）
});

// ========== 水系技能參數 ==========
const waterSkillStats = reactive({
    // 水炮
    waterCannonMultiplier: 60.7,    // 水炮倍率 %（基礎）
    waterCannonAppraisalLevel: 0,   // 鑑定等級（每級 +0.6%）
    waterCannonChargeLevel: 5,      // 蓄力段數（1-5）
    // 雷雨增幅
    rainAmplify: 20,                // 雷雨增幅 %（基礎 20%）
    rainAmplifyAppraisalLevel: 0,   // 鑑定等級（每級 +5%）
    // 螺旋爆裂
    spiralBurstMultiplier: 1080,    // 地刺倍率 %（基礎）
    spiralBurstRelicLevel: 0,       // 遺物等級（每級 +20%）
});

// ========== 火系技能參數 ==========
const fireSkillStats = reactive({
    // 高溫爆發
    heatBusterMultiplier: 130.5,    // 高溫爆發倍率 %（基礎）
    heatBusterAppraisalLevel: 0,    // 鑑定等級（每級 +1%）
    heatBusterPressure: 100,        // 壓力值 %
    // 厄格增幅
    ergAmplify: 0,                  // 厄格增幅 %（S50 = 300%）
    // 元素波動增幅
    elementWaveAmplify: 25,         // 元素波動增幅 %
    // 化學狂歡
    chemicalMultiplier: 900,        // 瓶子倍率 %（基礎）
    chemicalRelicLevel: 0,          // 遺物等級（每級 +30%）
    chemicalExplosionRate: 50,      // 後續爆炸比例 %（30%+鏈接20%=50%）
    // 火焰噴射
    flameburstMultiplier: 33.5,     // 火焰噴射倍率 %（基礎）
    flameburstAppraisalLevel: 0,    // 鑑定等級（每級 +0.3%）
    flameburstChargeLevel: 5,       // 蓄力段數（1-5）
    flameburstHits: 5,              // 火焰噴射段數（基礎 5）
    flameburstHitAppraisal: 0,      // 0=基礎5段, 1=15級8段, 2=20級9段
    // 召喚夢魘
    nightmareMultiplier: 600,       // 大蛇倍率 %（4能量時）
    nightmareEnergyLevel: 4,        // 能量等級（1-4）
    // 大蛇減益
    nightmareDebuffBase: 0.65,      // 減益基礎值 %（如最終傷害增加）
    nightmareDebuffEnhance: 20,     // 4能量減益效果提升 %
    nightmareRelicLevel: 0,         // 遺物等級（每級 +30%）
});

// 當前選中的 Tab
const activeTab = ref("fire");

// ========== 計算輔助函數 ==========
const getFireMasteryEff = computed(() => {
    let eff = masteryStats.fireMasteryEff;
    if (masteryStats.fireMasteryAppraisal) eff += 10;
    return eff / 100;
});

const getWaterMasteryEff = computed(() => {
    let eff = masteryStats.waterMasteryEff;
    if (masteryStats.waterMasteryAppraisal) eff += 10;
    return eff / 100;
});

const getEarthMasteryEff = computed(() => {
    let eff = masteryStats.earthMasteryEff;
    if (masteryStats.earthMasteryAppraisal) eff += 4;
    return eff / 100;
});

const getFlameburstHits = computed(() => {
    if (fireSkillStats.flameburstHitAppraisal === 2) return 9;
    if (fireSkillStats.flameburstHitAppraisal === 1) return 8;
    return 5;
});

// ========== 催化協同計算 ==========
// 公式: A × (1 + B + C) + D
const catalyticSynergy = computed(() => {
    const A = catalyticStats.baseValue / 100;
    const B = catalyticStats.herbBonus / 100;
    const C = getFireMasteryEff.value;
    const D = Math.floor(catalyticStats.linkAttributeAvg / 500) / 100;

    const synergy = A * (1 + B + C) + D;

    return {
        A,
        B,
        C,
        D,
        result: synergy,
        resultPercent: (synergy * 100).toFixed(2),
    };
});

// ========== 水炮計算 ==========
// 公式: A1 × B1 × (1+C) × (1+D) × (1+E) × (1+F/2) × (1+G+H) × (1+I) × (1+J)
const waterCannonDamage = computed(() => {
    const A1 = globalStats.waterDmg;
    // B1: 水炮倍率 = (基礎 + 鑑定加成) × 蓄力段數 × 1.25（五蓄係數 6.25 / 5）
    const baseMultiplier = waterSkillStats.waterCannonMultiplier + waterSkillStats.waterCannonAppraisalLevel * 0.6;
    const chargeMultiplier = waterSkillStats.waterCannonChargeLevel === 5 ? 6.25 : waterSkillStats.waterCannonChargeLevel;
    const B1 = (baseMultiplier / 100) * chargeMultiplier;
    // C: 雷雨增幅
    const C = (waterSkillStats.rainAmplify + waterSkillStats.rainAmplifyAppraisalLevel * 5) / 100;
    // D: 套裝增幅（克雷套）
    const D = gearStats.crewSetBonus / 100;
    // E: 鋼瓶加成
    const E = masteryStats.cylinderBonus / 100;
    // F: 水精通效率
    const F = getWaterMasteryEff.value;
    // G: 才能額外
    const G = masteryStats.talentBonus / 100;
    // H: 通用額外
    const H = globalStats.commonExtra / 100;
    // I: 暴擊傷害
    const I = globalStats.critDmg / 100;
    // J: 其他獨立加成
    const J = globalStats.independentMulti / 100;

    const damage = A1 * B1 * (1 + C) * (1 + D) * (1 + E) * (1 + F / 2) * (1 + G + H) * (1 + I) * (1 + J);

    return {
        A1, B1, C, D, E, F, G, H, I, J,
        baseMultiplier,
        chargeMultiplier,
        result: damage,
    };
});

// ========== 螺旋爆裂（地刺）計算 ==========
// 公式: (X + Y) × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M))
// X = A1 × B1 × (1+C) × (1+D) × (1+E) × (1+F/2) × (1+G)
// Y = A2 × B2
const spiralBurstDamage = computed(() => {
    const A1 = globalStats.waterDmg;
    const A2 = globalStats.avgDmg;
    // B1: 固定五蓄倍率
    const baseMultiplier = waterSkillStats.waterCannonMultiplier + waterSkillStats.waterCannonAppraisalLevel * 0.6;
    const B1 = (baseMultiplier / 100) * 6.25;
    // B2: 地刺倍率
    const B2 = (waterSkillStats.spiralBurstMultiplier + waterSkillStats.spiralBurstRelicLevel * 20) / 100;
    // C: 雷雨增幅
    const C = (waterSkillStats.rainAmplify + waterSkillStats.rainAmplifyAppraisalLevel * 5) / 100;
    // D: 套裝增幅
    const D = gearStats.crewSetBonus / 100;
    // E: 鋼瓶加成
    const E = masteryStats.cylinderBonus / 100;
    // F: 水精通效率
    const F = getWaterMasteryEff.value;
    // G: 才能額外
    const G = masteryStats.talentBonus / 100;
    // H: 通用額外
    const H = globalStats.commonExtra / 100;
    // I: 暴擊傷害
    const I = globalStats.critDmg / 100;
    // J: 其他獨立加成
    const J = globalStats.independentMulti / 100;
    // K: 組合式最終傷害（四水）
    const K = gearStats.comboFinalDmgWater / 100;
    // L: 藍草+曼德拉
    const L = gearStats.comboHerbBlue / 100;
    // M: 水精通效率
    const M = getWaterMasteryEff.value;

    // X = A1 × B1 × (1+C) × (1+D) × (1+E) × (1+F/2) × (1+G)
    const X = A1 * B1 * (1 + C) * (1 + D) * (1 + E) * (1 + F / 2) * (1 + G);
    // Y = A2 × B2
    const Y = A2 * B2;

    const damage = (X + Y) * (1 + H) * (1 + I) * (1 + J) * (1 + K * (1 + L + M));

    return {
        A1, A2, B1, B2, C, D, E, F, G, H, I, J, K, L, M,
        X, Y,
        result: damage,
    };
});

// ========== 高溫爆發計算 ==========
// 公式: A1 × B1 × (1+C) × (1+D) × (1+E) × (1+F/2) × (1+G+H) × (1+I) × (1+J) × 壓力值
const heatBusterDamage = computed(() => {
    const A1 = globalStats.fireDmg;
    // B1: 高溫爆發倍率
    const B1 = (fireSkillStats.heatBusterMultiplier + fireSkillStats.heatBusterAppraisalLevel * 1) / 100;
    // C: 厄格增幅
    const C = fireSkillStats.ergAmplify / 100;
    // D: 元素波動增幅
    const D = fireSkillStats.elementWaveAmplify / 100;
    // E: 鋼瓶加成
    const E = masteryStats.cylinderBonus / 100;
    // F: 火精通效率
    const F = getFireMasteryEff.value;
    // G: 才能額外
    const G = masteryStats.talentBonus / 100;
    // H: 通用額外
    const H = globalStats.commonExtra / 100;
    // I: 暴擊傷害
    const I = globalStats.critDmg / 100;
    // J: 其他獨立加成
    const J = globalStats.independentMulti / 100;
    // 壓力值
    const pressure = fireSkillStats.heatBusterPressure / 100;

    const damage = A1 * B1 * (1 + C) * (1 + D) * (1 + E) * (1 + F / 2) * (1 + G + H) * (1 + I) * (1 + J) * pressure;

    return {
        A1, B1, C, D, E, F, G, H, I, J, pressure,
        result: damage,
    };
});

// ========== 化學狂歡（瓶子）計算 ==========
// 公式: (X + Y) × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M))
// X = A1 × B1 × (1+C) × (1+E) × (1+F/2) × (1+G)（不含元素波動 D）
// Y = A2 × B2
const chemicalDamage = computed(() => {
    const A1 = globalStats.fireDmg;
    const A2 = globalStats.avgDmg;
    // B1: 高溫爆發倍率
    const B1 = (fireSkillStats.heatBusterMultiplier + fireSkillStats.heatBusterAppraisalLevel * 1) / 100;
    // B2: 瓶子倍率
    const B2 = (fireSkillStats.chemicalMultiplier + fireSkillStats.chemicalRelicLevel * 30) / 100;
    // C: 厄格增幅
    const C = fireSkillStats.ergAmplify / 100;
    // E: 鋼瓶加成
    const E = masteryStats.cylinderBonus / 100;
    // F: 火精通效率
    const F = getFireMasteryEff.value;
    // G: 才能額外
    const G = masteryStats.talentBonus / 100;
    // H: 通用額外
    const H = globalStats.commonExtra / 100;
    // I: 暴擊傷害
    const I = globalStats.critDmg / 100;
    // J: 其他獨立加成
    const J = globalStats.independentMulti / 100;
    // K: 組合式最終傷害（四火）
    const K = gearStats.comboFinalDmgFire / 100;
    // L: 紅草+曼德拉
    const L = gearStats.comboHerbRed / 100;
    // M: 火精通效率
    const M = getFireMasteryEff.value;

    // X = A1 × B1 × (1+C) × (1+E) × (1+F/2) × (1+G)（不含元素波動）
    const X = A1 * B1 * (1 + C) * (1 + E) * (1 + F / 2) * (1 + G);
    // Y = A2 × B2
    const Y = A2 * B2;

    const damage = (X + Y) * (1 + H) * (1 + I) * (1 + J) * (1 + K * (1 + L + M));

    // 後續爆炸傷害
    const explosionRate = fireSkillStats.chemicalExplosionRate / 100;
    const explosionDamage = damage * explosionRate;

    return {
        A1, A2, B1, B2, C, E, F, G, H, I, J, K, L, M,
        X, Y,
        result: damage,
        explosionRate,
        explosionDamage,
    };
});

// ========== 火焰噴射計算 ==========
// 公式: A1 × B1 × (1+C) × (1+E) × (1+F/2) × (1+G+H) × (1+I) × (1+J)
const flameburstDamage = computed(() => {
    const A1 = globalStats.fireDmg;
    // B1: 火焰噴射倍率 = (基礎 + 鑑定加成) × 蓄力段數
    const baseMultiplier = fireSkillStats.flameburstMultiplier + fireSkillStats.flameburstAppraisalLevel * 0.3;
    const B1 = (baseMultiplier / 100) * fireSkillStats.flameburstChargeLevel;
    // C: 套裝增幅（克雷套）
    const C = gearStats.crewSetBonus / 100;
    // E: 鋼瓶加成
    const E = masteryStats.cylinderBonus / 100;
    // F: 火精通效率
    const F = getFireMasteryEff.value;
    // G: 才能額外
    const G = masteryStats.talentBonus / 100;
    // H: 通用額外
    const H = globalStats.commonExtra / 100;
    // I: 暴擊傷害
    const I = globalStats.critDmg / 100;
    // J: 其他獨立加成
    const J = globalStats.independentMulti / 100;

    const damage = A1 * B1 * (1 + C) * (1 + E) * (1 + F / 2) * (1 + G + H) * (1 + I) * (1 + J);

    return {
        A1, B1, C, E, F, G, H, I, J,
        baseMultiplier,
        result: damage,
    };
});

// ========== 召喚夢魘減益計算 ==========
// 公式: A × (1+B) × (1 + C×(1+D+E))
const nightmareDebuff = computed(() => {
    // A: 減益基礎值
    const A = fireSkillStats.nightmareDebuffBase / 100;
    // B: 減益效果提升（4能量基礎 + 遺物加成）
    const B = (fireSkillStats.nightmareDebuffEnhance + fireSkillStats.nightmareRelicLevel * 30) / 100;
    // C: 組合式異常狀態效果（四火）
    const C = gearStats.comboStatusEffect / 100;
    // D: 紅草+曼德拉
    const D = gearStats.comboHerbRed / 100;
    // E: 火精通效率
    const E = getFireMasteryEff.value;

    const debuff = A * (1 + B) * (1 + C * (1 + D + E));

    return {
        A, B, C, D, E,
        result: debuff,
        resultPercent: (debuff * 100).toFixed(2),
    };
});

// ========== 召喚夢魘傷害計算 ==========
// 公式: (A2 + X) × B2 × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M))
// X = A1 × B1 × (1+C) × D × (1+E) × (1+F/2) × (1+G)
const nightmareDamage = computed(() => {
    const A1 = globalStats.fireDmg;
    const A2 = globalStats.avgDmg;
    // B1: 火焰噴射倍率（五蓄）
    const baseMultiplier = fireSkillStats.flameburstMultiplier + fireSkillStats.flameburstAppraisalLevel * 0.3;
    const B1 = (baseMultiplier / 100) * 5; // 固定五蓄
    // B2: 大蛇倍率
    const B2 = fireSkillStats.nightmareMultiplier / 100;
    // C: 套裝增幅（克雷套）
    const C = gearStats.crewSetBonus / 100;
    // D: 火焰噴射段數
    const D = getFlameburstHits.value;
    // E: 鋼瓶加成
    const E = masteryStats.cylinderBonus / 100;
    // F: 火精通效率
    const F = getFireMasteryEff.value;
    // G: 才能額外
    const G = masteryStats.talentBonus / 100;
    // H: 通用額外
    const H = globalStats.commonExtra / 100;
    // I: 暴擊傷害
    const I = globalStats.critDmg / 100;
    // J: 其他獨立加成
    const J = globalStats.independentMulti / 100;
    // K: 組合式最終傷害（四土）
    const K = gearStats.comboFinalDmgEarth / 100;
    // L: 綠草+曼德拉
    const L = gearStats.comboHerbGreen / 100;
    // M: 土精通效率
    const M = getEarthMasteryEff.value;

    // X = A1 × B1 × (1+C) × D × (1+E) × (1+F/2) × (1+G)
    const X = A1 * B1 * (1 + C) * D * (1 + E) * (1 + F / 2) * (1 + G);

    // 基礎傷害 = (A2 + X) × B2 × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M))
    const baseDamage = (A2 + X) * B2 * (1 + H) * (1 + I) * (1 + J) * (1 + K * (1 + L + M));

    // 加上減益效果（大蛇可吃到自身減益）
    const debuffMultiplier = 1 + nightmareDebuff.value.result;
    const finalDamage = baseDamage * debuffMultiplier;

    return {
        A1, A2, B1, B2, C, D, E, F, G, H, I, J, K, L, M,
        X,
        baseDamage,
        debuffMultiplier,
        result: finalDamage,
    };
});

// 格式化數字
const formatNumber = (num: number) => {
    return num.toLocaleString("zh-TW", { maximumFractionDigits: 2 });
};

// 預設配置
const applyPreset = (preset: string) => {
    if (preset === "basic") {
        masteryStats.fireMasteryEff = 10;
        masteryStats.waterMasteryEff = 10;
        masteryStats.earthMasteryEff = 10;
        masteryStats.fireMasteryAppraisal = false;
        masteryStats.waterMasteryAppraisal = false;
        masteryStats.earthMasteryAppraisal = false;
        masteryStats.cylinderBonus = 30;
        gearStats.crewSetBonus = 0;
        fireSkillStats.flameburstHitAppraisal = 0;
        fireSkillStats.nightmareRelicLevel = 0;
        waterSkillStats.rainAmplifyAppraisalLevel = 0;
        fireSkillStats.ergAmplify = 0;
    } else if (preset === "advanced") {
        masteryStats.fireMasteryEff = 10;
        masteryStats.waterMasteryEff = 10;
        masteryStats.earthMasteryEff = 10;
        masteryStats.fireMasteryAppraisal = true;
        masteryStats.waterMasteryAppraisal = true;
        masteryStats.earthMasteryAppraisal = true;
        masteryStats.cylinderBonus = 30;
        gearStats.crewSetBonus = 15;
        fireSkillStats.flameburstHitAppraisal = 1;
        fireSkillStats.nightmareRelicLevel = 5;
        waterSkillStats.rainAmplifyAppraisalLevel = 10;
        fireSkillStats.ergAmplify = 150;
    } else if (preset === "maxed") {
        masteryStats.fireMasteryEff = 10;
        masteryStats.waterMasteryEff = 10;
        masteryStats.earthMasteryEff = 10;
        masteryStats.fireMasteryAppraisal = true;
        masteryStats.waterMasteryAppraisal = true;
        masteryStats.earthMasteryAppraisal = true;
        masteryStats.cylinderBonus = 30;
        gearStats.crewSetBonus = 15;
        fireSkillStats.flameburstHitAppraisal = 2;
        fireSkillStats.nightmareRelicLevel = 10;
        waterSkillStats.rainAmplifyAppraisalLevel = 20;
        fireSkillStats.ergAmplify = 300;
        fireSkillStats.flameburstAppraisalLevel = 20;
        fireSkillStats.heatBusterAppraisalLevel = 20;
        waterSkillStats.waterCannonAppraisalLevel = 20;
    }
};
</script>

<template>
    <div class="alchemy-calculator">
        <h1 class="page-title">
            <span class="text-gradient">煉金術傷害計算器</span>
        </h1>

        <div class="calculator-layout">
            <!-- 左側：全域屬性 -->
            <aside class="global-panel">
                <div class="panel-header">
                    <h2>全域屬性</h2>
                    <div class="preset-buttons">
                        <el-button size="small" @click="applyPreset('basic')">基礎</el-button>
                        <el-button size="small" @click="applyPreset('advanced')">進階</el-button>
                        <el-button size="small" type="primary" @click="applyPreset('maxed')">滿配</el-button>
                    </div>
                </div>

                <!-- 基礎屬性 -->
                <div class="stat-section">
                    <h3>基礎屬性 (A1, A2)</h3>
                    <div class="stat-row">
                        <label>火煉金傷害</label>
                        <el-input-number v-model="globalStats.fireDmg" :min="0" :max="9999" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>水煉金傷害</label>
                        <el-input-number v-model="globalStats.waterDmg" :min="0" :max="9999" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>四屬平均傷害</label>
                        <el-input-number v-model="globalStats.avgDmg" :min="0" :max="9999" size="small" />
                    </div>
                </div>

                <!-- 通用加成 -->
                <div class="stat-section">
                    <h3>通用加成 (H, I, J)</h3>
                    <div class="stat-row">
                        <label>通用額外 (H) %</label>
                        <el-input-number v-model="globalStats.commonExtra" :min="0" :max="500" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>暴擊傷害 (I) %</label>
                        <el-input-number v-model="globalStats.critDmg" :min="100" :max="500" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>獨立加成 (J) %</label>
                        <el-input-number v-model="globalStats.independentMulti" :min="0" :max="100" size="small" />
                    </div>
                </div>

                <!-- 精通效率 -->
                <div class="stat-section">
                    <h3>精通效率 (F)</h3>
                    <div class="stat-row">
                        <label>火精通效率 %</label>
                        <el-input-number v-model="masteryStats.fireMasteryEff" :min="0" :max="50" size="small" />
                    </div>
                    <div class="stat-row checkbox-row">
                        <el-checkbox v-model="masteryStats.fireMasteryAppraisal">20 級鑑定 (+10%)</el-checkbox>
                    </div>
                    <div class="stat-row">
                        <label>水精通效率 %</label>
                        <el-input-number v-model="masteryStats.waterMasteryEff" :min="0" :max="50" size="small" />
                    </div>
                    <div class="stat-row checkbox-row">
                        <el-checkbox v-model="masteryStats.waterMasteryAppraisal">20 級鑑定 (+10%)</el-checkbox>
                    </div>
                    <div class="stat-row">
                        <label>土精通效率 %</label>
                        <el-input-number v-model="masteryStats.earthMasteryEff" :min="0" :max="50" size="small" />
                    </div>
                    <div class="stat-row checkbox-row">
                        <el-checkbox v-model="masteryStats.earthMasteryAppraisal">20 級鑑定 (+4%)</el-checkbox>
                    </div>
                </div>

                <!-- 裝備加成 -->
                <div class="stat-section">
                    <h3>裝備加成 (E, G)</h3>
                    <div class="stat-row">
                        <label>鋼瓶加成 (E) %</label>
                        <el-input-number v-model="masteryStats.cylinderBonus" :min="0" :max="100" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>才能額外 (G) %</label>
                        <el-input-number v-model="masteryStats.talentBonus" :min="0" :max="100" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>克雷套增幅 %</label>
                        <el-input-number v-model="gearStats.crewSetBonus" :min="0" :max="50" size="small" />
                    </div>
                </div>

                <!-- 組合式設定 -->
                <div class="stat-section">
                    <h3>組合式設定 (K, L)</h3>
                    <div class="stat-row">
                        <label>四火最終傷害 %</label>
                        <el-input-number v-model="gearStats.comboFinalDmgFire" :min="0" :max="100" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>四水最終傷害 %</label>
                        <el-input-number v-model="gearStats.comboFinalDmgWater" :min="0" :max="200" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>四土最終傷害 %</label>
                        <el-input-number v-model="gearStats.comboFinalDmgEarth" :min="0" :max="100" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>四火異常效果 %</label>
                        <el-input-number v-model="gearStats.comboStatusEffect" :min="0" :max="100" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>紅草+曼德拉 %</label>
                        <el-input-number v-model="gearStats.comboHerbRed" :min="0" :max="50" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>藍草+曼德拉 %</label>
                        <el-input-number v-model="gearStats.comboHerbBlue" :min="0" :max="50" size="small" />
                    </div>
                    <div class="stat-row">
                        <label>綠草+曼德拉 %</label>
                        <el-input-number v-model="gearStats.comboHerbGreen" :min="0" :max="50" size="small" />
                    </div>
                </div>
            </aside>

            <!-- 右側：技能計算 -->
            <main class="skill-panel">
                <el-tabs v-model="activeTab" class="skill-tabs">
                    <!-- 火系 Tab -->
                    <el-tab-pane label="火系技能" name="fire">
                        <div class="skill-content">
                            <!-- 火焰噴射 -->
                            <div class="skill-card">
                                <h3>火焰噴射參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>基礎倍率 % (每級鑑定 +0.3%)</label>
                                        <el-input-number v-model="fireSkillStats.flameburstMultiplier" :min="1" :max="100" :step="0.1" :precision="1" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>鑑定等級</label>
                                        <el-input-number v-model="fireSkillStats.flameburstAppraisalLevel" :min="0" :max="20" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>蓄力段數</label>
                                        <el-input-number v-model="fireSkillStats.flameburstChargeLevel" :min="1" :max="5" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>噴射段數</label>
                                        <el-select v-model="fireSkillStats.flameburstHitAppraisal" size="small">
                                            <el-option :value="0" label="基礎 5 段" />
                                            <el-option :value="1" label="15 級鑑定 8 段" />
                                            <el-option :value="2" label="20 級鑑定 9 段" />
                                        </el-select>
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>火焰噴射傷害</h3>
                                <div class="result-value">{{ formatNumber(flameburstDamage.result) }}</div>
                                <div class="formula-breakdown">
                                    <p class="formula">A1 × B1 × (1+C) × (1+E) × (1+F/2) × (1+G+H) × (1+I) × (1+J)</p>
                                    <div class="breakdown-grid">
                                        <span>A1 = {{ flameburstDamage.A1 }}</span>
                                        <span>B1 = {{ flameburstDamage.B1.toFixed(4) }} ({{ flameburstDamage.baseMultiplier.toFixed(1) }}% × {{ fireSkillStats.flameburstChargeLevel }})</span>
                                        <span>C = {{ (flameburstDamage.C * 100).toFixed(1) }}%</span>
                                        <span>E = {{ (flameburstDamage.E * 100).toFixed(1) }}%</span>
                                        <span>F = {{ (flameburstDamage.F * 100).toFixed(1) }}%</span>
                                        <span>G = {{ (flameburstDamage.G * 100).toFixed(1) }}%</span>
                                        <span>H = {{ (flameburstDamage.H * 100).toFixed(1) }}%</span>
                                        <span>I = {{ (flameburstDamage.I * 100).toFixed(1) }}%</span>
                                        <span>J = {{ (flameburstDamage.J * 100).toFixed(1) }}%</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 召喚夢魘 -->
                            <div class="skill-card">
                                <h3>召喚夢魘（大蛇）參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>大蛇倍率 % (4 能量)</label>
                                        <el-input-number v-model="fireSkillStats.nightmareMultiplier" :min="100" :max="2000" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>減益基礎值 %</label>
                                        <el-input-number v-model="fireSkillStats.nightmareDebuffBase" :min="0" :max="10" :step="0.01" :precision="2" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>4 能量減益提升 %</label>
                                        <el-input-number v-model="fireSkillStats.nightmareDebuffEnhance" :min="0" :max="100" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>遺物等級 (每級 +30%)</label>
                                        <el-input-number v-model="fireSkillStats.nightmareRelicLevel" :min="0" :max="10" size="small" />
                                    </div>
                                </div>
                            </div>

                            <div class="result-card secondary">
                                <h3>大蛇減益效果</h3>
                                <div class="result-value">+{{ nightmareDebuff.resultPercent }}%</div>
                                <div class="formula-breakdown">
                                    <p class="formula">A × (1+B) × (1 + C×(1+D+E))</p>
                                    <div class="breakdown-grid">
                                        <span>A = {{ (nightmareDebuff.A * 100).toFixed(2) }}%</span>
                                        <span>B = {{ (nightmareDebuff.B * 100).toFixed(0) }}%</span>
                                        <span>C = {{ (nightmareDebuff.C * 100).toFixed(0) }}%</span>
                                        <span>D = {{ (nightmareDebuff.D * 100).toFixed(0) }}%</span>
                                        <span>E = {{ (nightmareDebuff.E * 100).toFixed(1) }}%</span>
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>召喚夢魘傷害</h3>
                                <div class="result-value">{{ formatNumber(nightmareDamage.result) }}</div>
                                <div class="formula-breakdown">
                                    <p class="formula">(A2 + X) × B2 × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M)) × 減益</p>
                                    <div class="breakdown-grid">
                                        <span>A2 = {{ nightmareDamage.A2 }}</span>
                                        <span>X = {{ formatNumber(nightmareDamage.X) }}</span>
                                        <span>B2 = {{ (nightmareDamage.B2 * 100).toFixed(0) }}%</span>
                                        <span>段數 D = {{ nightmareDamage.D }}</span>
                                        <span>K = {{ (nightmareDamage.K * 100).toFixed(0) }}%</span>
                                        <span>L = {{ (nightmareDamage.L * 100).toFixed(0) }}%</span>
                                        <span>M = {{ (nightmareDamage.M * 100).toFixed(1) }}%</span>
                                    </div>
                                    <div class="intermediate-values">
                                        <p>基礎傷害: {{ formatNumber(nightmareDamage.baseDamage) }}</p>
                                        <p>減益乘數: ×{{ nightmareDamage.debuffMultiplier.toFixed(4) }}</p>
                                    </div>
                                </div>
                            </div>

                            <!-- 高溫爆發 -->
                            <div class="skill-card">
                                <h3>高溫爆發參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>基礎倍率 % (每級鑑定 +1%)</label>
                                        <el-input-number v-model="fireSkillStats.heatBusterMultiplier" :min="1" :max="300" :step="0.5" :precision="1" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>鑑定等級</label>
                                        <el-input-number v-model="fireSkillStats.heatBusterAppraisalLevel" :min="0" :max="20" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>壓力值 %</label>
                                        <el-input-number v-model="fireSkillStats.heatBusterPressure" :min="0" :max="500" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>厄格增幅 % (S50=300%)</label>
                                        <el-input-number v-model="fireSkillStats.ergAmplify" :min="0" :max="500" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>元素波動增幅 %</label>
                                        <el-input-number v-model="fireSkillStats.elementWaveAmplify" :min="0" :max="100" size="small" />
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>高溫爆發傷害</h3>
                                <div class="result-value">{{ formatNumber(heatBusterDamage.result) }}</div>
                                <div class="formula-breakdown">
                                    <p class="formula">A1 × B1 × (1+C) × (1+D) × (1+E) × (1+F/2) × (1+G+H) × (1+I) × (1+J) × 壓力</p>
                                    <div class="breakdown-grid">
                                        <span>A1 = {{ heatBusterDamage.A1 }}</span>
                                        <span>B1 = {{ (heatBusterDamage.B1 * 100).toFixed(1) }}%</span>
                                        <span>C(厄格) = {{ (heatBusterDamage.C * 100).toFixed(0) }}%</span>
                                        <span>D(波動) = {{ (heatBusterDamage.D * 100).toFixed(0) }}%</span>
                                        <span>壓力 = {{ (heatBusterDamage.pressure * 100).toFixed(0) }}%</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 化學狂歡 -->
                            <div class="skill-card">
                                <h3>化學狂歡（瓶子）參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>瓶子倍率 % (每級遺物 +30%)</label>
                                        <el-input-number v-model="fireSkillStats.chemicalMultiplier" :min="100" :max="2000" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>遺物等級</label>
                                        <el-input-number v-model="fireSkillStats.chemicalRelicLevel" :min="0" :max="10" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>後續爆炸比例 %</label>
                                        <el-input-number v-model="fireSkillStats.chemicalExplosionRate" :min="0" :max="100" size="small" />
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>化學狂歡傷害</h3>
                                <div class="result-value">{{ formatNumber(chemicalDamage.result) }}</div>
                                <div class="formula-breakdown">
                                    <p class="formula">(X + Y) × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M))</p>
                                    <div class="breakdown-grid">
                                        <span>X = {{ formatNumber(chemicalDamage.X) }}</span>
                                        <span>Y = {{ formatNumber(chemicalDamage.Y) }}</span>
                                        <span>B2 = {{ (chemicalDamage.B2 * 100).toFixed(0) }}%</span>
                                        <span>K = {{ (chemicalDamage.K * 100).toFixed(0) }}%</span>
                                    </div>
                                    <div class="intermediate-values">
                                        <p>後續爆炸 ({{ chemicalDamage.explosionRate * 100 }}%): {{ formatNumber(chemicalDamage.explosionDamage) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 水系 Tab -->
                    <el-tab-pane label="水系技能" name="water">
                        <div class="skill-content">
                            <!-- 水炮設定 -->
                            <div class="skill-card">
                                <h3>水炮參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>基礎倍率 % (每級鑑定 +0.6%)</label>
                                        <el-input-number v-model="waterSkillStats.waterCannonMultiplier" :min="1" :max="200" :step="0.1" :precision="1" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>鑑定等級</label>
                                        <el-input-number v-model="waterSkillStats.waterCannonAppraisalLevel" :min="0" :max="20" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>蓄力段數 (5 蓄 = ×6.25)</label>
                                        <el-input-number v-model="waterSkillStats.waterCannonChargeLevel" :min="1" :max="5" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>雷雨增幅 % (每級鑑定 +5%)</label>
                                        <el-input-number v-model="waterSkillStats.rainAmplify" :min="0" :max="100" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>雷雨鑑定等級</label>
                                        <el-input-number v-model="waterSkillStats.rainAmplifyAppraisalLevel" :min="0" :max="20" size="small" />
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>水炮傷害</h3>
                                <div class="result-value">{{ formatNumber(waterCannonDamage.result) }}</div>
                                <div class="formula-breakdown">
                                    <p class="formula">A1 × B1 × (1+C) × (1+D) × (1+E) × (1+F/2) × (1+G+H) × (1+I) × (1+J)</p>
                                    <div class="breakdown-grid">
                                        <span>A1 = {{ waterCannonDamage.A1 }}</span>
                                        <span>B1 = {{ waterCannonDamage.B1.toFixed(4) }} ({{ waterCannonDamage.baseMultiplier.toFixed(1) }}% × {{ waterCannonDamage.chargeMultiplier }})</span>
                                        <span>C(雷雨) = {{ (waterCannonDamage.C * 100).toFixed(0) }}%</span>
                                        <span>D(套裝) = {{ (waterCannonDamage.D * 100).toFixed(0) }}%</span>
                                        <span>E = {{ (waterCannonDamage.E * 100).toFixed(0) }}%</span>
                                        <span>F = {{ (waterCannonDamage.F * 100).toFixed(1) }}%</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 螺旋爆裂設定 -->
                            <div class="skill-card">
                                <h3>螺旋爆裂（地刺）參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>地刺倍率 % (每級遺物 +20%)</label>
                                        <el-input-number v-model="waterSkillStats.spiralBurstMultiplier" :min="100" :max="3000" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>遺物等級</label>
                                        <el-input-number v-model="waterSkillStats.spiralBurstRelicLevel" :min="0" :max="10" size="small" />
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>螺旋爆裂傷害</h3>
                                <div class="result-value">{{ formatNumber(spiralBurstDamage.result) }}</div>
                                <div class="formula-breakdown">
                                    <p class="formula">(X + Y) × (1+H) × (1+I) × (1+J) × (1 + K×(1+L+M))</p>
                                    <div class="breakdown-grid">
                                        <span>X = {{ formatNumber(spiralBurstDamage.X) }}</span>
                                        <span>Y = {{ formatNumber(spiralBurstDamage.Y) }}</span>
                                        <span>B2 = {{ (spiralBurstDamage.B2 * 100).toFixed(0) }}%</span>
                                        <span>K = {{ (spiralBurstDamage.K * 100).toFixed(0) }}%</span>
                                        <span>L = {{ (spiralBurstDamage.L * 100).toFixed(0) }}%</span>
                                        <span>M = {{ (spiralBurstDamage.M * 100).toFixed(1) }}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>

                    <!-- 催化協同 Tab -->
                    <el-tab-pane label="催化協同" name="catalytic">
                        <div class="skill-content">
                            <div class="skill-card">
                                <h3>催化協同參數</h3>
                                <div class="skill-inputs">
                                    <div class="input-row">
                                        <label>基礎值 (A) % (四火+鏈接=8%)</label>
                                        <el-input-number v-model="catalyticStats.baseValue" :min="0" :max="50" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>紅草+曼德拉 (B) %</label>
                                        <el-input-number v-model="catalyticStats.herbBonus" :min="0" :max="50" size="small" />
                                    </div>
                                    <div class="input-row">
                                        <label>平均屬性（每 500 +1%）</label>
                                        <el-input-number v-model="catalyticStats.linkAttributeAvg" :min="0" :max="5000" :step="100" size="small" />
                                    </div>
                                </div>
                            </div>

                            <div class="result-card">
                                <h3>催化協同效果</h3>
                                <div class="result-value">+{{ catalyticSynergy.resultPercent }}%</div>
                                <div class="formula-breakdown">
                                    <p class="formula">A × (1 + B + C) + D</p>
                                    <div class="breakdown-grid">
                                        <span>A = {{ (catalyticSynergy.A * 100).toFixed(0) }}%</span>
                                        <span>B = {{ (catalyticSynergy.B * 100).toFixed(0) }}%</span>
                                        <span>C(火精通) = {{ (catalyticSynergy.C * 100).toFixed(1) }}%</span>
                                        <span>D(屬性) = {{ (catalyticSynergy.D * 100).toFixed(0) }}%</span>
                                    </div>
                                    <div class="intermediate-values">
                                        <p>計算過程: {{ (catalyticSynergy.A * 100).toFixed(0) }}% × (1 + {{ (catalyticSynergy.B * 100).toFixed(0) }}% + {{ (catalyticSynergy.C * 100).toFixed(1) }}%) + {{ (catalyticSynergy.D * 100).toFixed(0) }}%</p>
                                    </div>
                                </div>
                            </div>

                            <div class="info-card">
                                <h4>說明</h4>
                                <ul>
                                    <li>催化協同的效果會加入到「通用額外 (H)」中</li>
                                    <li>C 使用火煉金術精通效率，基礎 10%，20 級鑑定 +10%</li>
                                    <li>D 每 500 點平均屬性增加 1%，向下取整</li>
                                </ul>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </main>
        </div>
    </div>
</template>

<style scoped>
.alchemy-calculator {
    min-height: 100vh;
    padding: 1.5rem;
}

.page-title {
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1.5rem;
}

.text-gradient {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.calculator-layout {
    display: flex;
    gap: 1.5rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* 左側面板 */
.global-panel {
    width: 320px;
    flex-shrink: 0;
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1.25rem;
    height: fit-content;
    position: sticky;
    top: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
}

.panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--color-gold-400, #fbbf24);
}

.panel-header h2 {
    font-size: 1.25rem;
    color: var(--color-text-primary, #f9fafb);
    margin: 0;
}

.preset-buttons {
    display: flex;
    gap: 0.25rem;
}

.stat-section {
    margin-bottom: 1.25rem;
}

.stat-section h3 {
    font-size: 0.9rem;
    color: var(--color-gold-400, #fbbf24);
    margin-bottom: 0.75rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px solid var(--color-border, #374151);
}

.stat-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.stat-row label {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #d1d5db);
}

.stat-row .el-input-number {
    width: 120px;
}

.checkbox-row {
    justify-content: flex-start;
}

.checkbox-row .el-checkbox {
    --el-checkbox-text-color: var(--color-text-secondary, #d1d5db);
}

/* 右側面板 */
.skill-panel {
    flex: 1;
    min-width: 0;
}

.skill-tabs {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1rem;
}

.skill-tabs :deep(.el-tabs__header) {
    margin-bottom: 1rem;
}

.skill-tabs :deep(.el-tabs__item) {
    color: var(--color-text-secondary, #9ca3af);
}

.skill-tabs :deep(.el-tabs__item.is-active) {
    color: var(--color-gold-400, #fbbf24);
}

.skill-tabs :deep(.el-tabs__active-bar) {
    background-color: var(--color-gold-400, #fbbf24);
}

.skill-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.skill-card {
    background: var(--color-background, #111827);
    border: 1px solid var(--color-border, #374151);
    border-radius: 8px;
    padding: 1rem;
}

.skill-card h3 {
    font-size: 1rem;
    color: var(--color-text-primary, #f9fafb);
    margin-bottom: 0.75rem;
}

.skill-inputs {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
}

.input-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.input-row label {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #9ca3af);
}

.input-row .el-input-number,
.input-row .el-select {
    width: 100%;
}

/* 結果卡片 */
.result-card {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
    border: 1px solid var(--color-gold-400, #fbbf24);
    border-radius: 8px;
    padding: 1rem;
}

.result-card.secondary {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
    border-color: #3b82f6;
}

.result-card h3 {
    font-size: 1rem;
    color: var(--color-text-primary, #f9fafb);
    margin-bottom: 0.5rem;
}

.result-value {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-gold-400, #fbbf24);
    margin-bottom: 0.75rem;
}

.result-card.secondary .result-value {
    color: #3b82f6;
}

.formula-breakdown {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 6px;
    padding: 0.75rem;
}

.formula {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #9ca3af);
    font-family: monospace;
    margin-bottom: 0.5rem;
    word-break: break-all;
}

.breakdown-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
}

.breakdown-grid span {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #d1d5db);
    font-family: monospace;
}

.intermediate-values {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--color-border, #374151);
}

.intermediate-values p {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #9ca3af);
    margin: 0.25rem 0;
}

.info-card {
    background: var(--color-background, #111827);
    border: 1px solid var(--color-border, #374151);
    border-radius: 8px;
    padding: 1rem;
}

.info-card h4 {
    font-size: 0.9rem;
    color: var(--color-gold-400, #fbbf24);
    margin-bottom: 0.5rem;
}

.info-card ul {
    margin: 0;
    padding-left: 1.25rem;
}

.info-card li {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #9ca3af);
    margin-bottom: 0.25rem;
}

/* 響應式 */
@media (max-width: 1024px) {
    .calculator-layout {
        flex-direction: column;
    }

    .global-panel {
        width: 100%;
        position: static;
        max-height: none;
    }

    .stat-section {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 0.5rem;
    }

    .stat-section h3 {
        grid-column: 1 / -1;
    }
}

@media (max-width: 640px) {
    .alchemy-calculator {
        padding: 1rem;
    }

    .page-title {
        font-size: 1.5rem;
    }

    .skill-inputs {
        grid-template-columns: 1fr;
    }

    .result-value {
        font-size: 1.5rem;
    }

    .panel-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }
}
</style>
