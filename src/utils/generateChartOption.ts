import { CompareEntry, Debuff, MonsterEntry } from "../types";
import { calculateMonsterStatusAfterDebuff } from "../utils/calculateDebuff";
import { calculateDamage } from "../utils/damageCalculate";

export const generateDamageCompareRadar = (
    statusData: CompareEntry[],
    debuffData: Debuff[],
    monsterData: MonsterEntry[],
    isPhysical: boolean
) => {
    type EChartsOption = echarts.EChartsOption;
    let option: EChartsOption;
    const monsterAfterDebuffArray: MonsterEntry[] = [];
    const legendData: string[] = []; //status name
    const indicatorData: { name: string; max: number }[] = []; // BOSS名稱
    const damages = statusData.map((status: CompareEntry) => status.damage);
    const rawMaxDamage = Math.max(...damages);
    const roundedMax = Math.ceil(rawMaxDamage / 100) * 100; // 進位到最接近的 100
    const finalMax = Math.ceil(roundedMax * 1); // 加個 buffer，例如再加 10%

    const seriesData: {
        value: number[];
        name: string;
    }[] = []; //各武器對不同BOSS的傷害

    const sortedDebuffArray = debuffData
        .filter((x: Debuff) => x.active)
        .sort((a, b) => {
            if (isPhysical) {
                return (
                    (b.physicalDefense.operation === "divide" ? 1 : 0) -
                    (a.physicalDefense.operation === "divide" ? 1 : 0)
                );
            } else {
                return (
                    (b.magicalDefense.operation === "divide" ? 1 : 0) -
                    (a.magicalDefense.operation === "divide" ? 1 : 0)
                );
            }
        });

    monsterData.forEach((monster: MonsterEntry) => {
        const monsterAfterDebuff = calculateMonsterStatusAfterDebuff(
            isPhysical,
            sortedDebuffArray,
            monster
        );
        const { name } = monster;
        monsterAfterDebuffArray.push(monsterAfterDebuff);

        indicatorData.push({ name, max: finalMax });
    });

    statusData.forEach((status: CompareEntry) => {
        const { name, damage, pLevel } = status;

        const valueOfSeriesData = monsterAfterDebuffArray.map(
            (monster: MonsterEntry) => {
                const protect = isPhysical
                    ? monster.physicalProtect
                    : monster.magicalProtect;
                return Math.floor(calculateDamage(damage, pLevel, protect));
            }
        );
        legendData.push(name);

        seriesData.push({
            name,
            value: valueOfSeriesData,
        });
    });

    option = {
        title: {
            text: "Basic Radar Chart",
        },

        legend: {
            data: legendData,
        },
        radar: {
            indicator: indicatorData,
            splitNumber: 5, // 分幾層
            axisName: {
                color: "#333",
            },
        },
        series: [
            {
                name: "Budget vs spending",
                type: "radar",
                data: seriesData,
            },
        ],
    };

    return option;
};

export const generateDamageCompareBar = (
    statusData: CompareEntry[],
    debuffData: Debuff[],
    monsterData: MonsterEntry[],
    isPhysical: boolean
) => {
    type EChartsOption = echarts.EChartsOption;
    let option: EChartsOption;

    const monsterAfterDebuffArray: MonsterEntry[] = [];
    const legendData: string[] = []; // status name
    const categoryAxisData: string[] = []; // BOSS名稱 (X軸)

    const seriesData: any[] = []; // 每個角色系列

    const sortedDebuffArray = debuffData
        .filter((x: Debuff) => x.active)
        .sort((a, b) => {
            if (isPhysical) {
                return (
                    (b.physicalDefense.operation === "divide" ? 1 : 0) -
                    (a.physicalDefense.operation === "divide" ? 1 : 0)
                );
            } else {
                return (
                    (b.magicalDefense.operation === "divide" ? 1 : 0) -
                    (a.magicalDefense.operation === "divide" ? 1 : 0)
                );
            }
        });

    monsterData.forEach((monster: MonsterEntry) => {
        const monsterAfterDebuff = calculateMonsterStatusAfterDebuff(
            isPhysical,
            sortedDebuffArray,
            monster
        );
        const { name, physicalProtect, magicalProtect } = monsterAfterDebuff;
        monsterAfterDebuffArray.push(monsterAfterDebuff);
        categoryAxisData.push(
            `${name} 保${isPhysical ? physicalProtect : magicalProtect}`
        );
    });

    statusData.forEach((status: CompareEntry) => {
        const { name, damage, pLevel } = status;

        const data = monsterAfterDebuffArray.map((monster: MonsterEntry) => {
            const protect = isPhysical
                ? monster.physicalProtect
                : monster.magicalProtect;
            return Math.floor(calculateDamage(damage, pLevel, protect));
        });

        legendData.push(name);

        seriesData.push({
            name,
            type: "bar",
            data,
        });
    });

    option = {
        title: {
            text: "Damage Comparison (Bar Chart)",
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
        },
        legend: {
            data: legendData,
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        xAxis: {
            type: "category",
            data: categoryAxisData,
            axisTick: { alignWithLabel: true },
        },
        yAxis: {
            type: "value",
            name: "Damage",
        },
        series: seriesData,
    };

    return option;
};
