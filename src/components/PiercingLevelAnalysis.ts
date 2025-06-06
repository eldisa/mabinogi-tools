import { ref } from "vue";
import { protectionData } from "../data/protectionData";

export interface PiercingLevelData {
    protection: number;
    damages: number[];
}

export interface MonsterProtectRange {
    min: number;
    max: number;
    step: number;
}

export interface PiercingLevelConfig {
    baseDamageMultiplier: number;
    protectionReductionPerLevel: number;
}

export const usePiercingLevelAnalysis = () => {
    // Input values
    const damage = ref<number>(2100);
    const piercingLevelCost = ref<number>(50);
    const monsterProtect = ref<number>(50);
    const debuffProtection = 139;
    const testData = [0, 1, 5, 7, 9];

    // Configurable ranges
    const monsterProtectRange = ref<MonsterProtectRange>({
        min: 0,
        max: 100,
        step: 10,
    });

    // Piercing level configuration (currently not directly used in calculation)
    const config = ref<PiercingLevelConfig>({
        baseDamageMultiplier: 0.1, // 10% increase per level
        protectionReductionPerLevel: 10, // Reduces protection by 10% per level
    });

    const calculateDamage = (baseDmg: number, piercingLevel: number, protection: number): number => {
        // Calculate protection index after piercing and debuff
        let protectionIndex = protection - piercingLevel * 5 - debuffProtection;

        if (protectionIndex < 0) {
            protectionIndex = 0;
        }
        if (protectionIndex >= protectionData.length) {
            protectionIndex = protectionData.length - 1;
        }

        return baseDmg * (1 - protectionData[protectionIndex]);
    };

    const calculateIncrease = (base: number, value: number): number => {
        return base === 0 ? value : (value / base) * 100 - 100;
    };

    const generateChartData = (): PiercingLevelData[] => {
        const result: PiercingLevelData[] = [];

        for (let i = 0; i < protectionData.length - 1; i++) {
            const protection = i;
            const rawDamages = testData.map((level) => calculateDamage(damage.value, level, protection));

            if (i >= 350) {
                console.log("📈 高保護區測試", {
                    baseDmg: damage.value,
                    protection,
                    protectionIndex: i,
                    result: rawDamages,
                });
            }

            result.push({
                protection,
                damages: rawDamages.map((val) => calculateIncrease(rawDamages[0], val)),
            });
        }

        // slice 只取大於等於 debuffProtection 的部分
        return result.slice(debuffProtection);
    };

    return {
        // Input values
        damage,
        piercingLevelCost,
        monsterProtect,
        // Ranges
        monsterProtectRange,
        // Configuration
        config,
        // Functions
        generateChartData,
        calculateDamage,
    };
};
