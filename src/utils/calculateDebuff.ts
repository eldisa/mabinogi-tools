import { Debuff, MonsterEntry, OperationType } from "../types";

const operations: Record<OperationType, (a: number, b: number) => number> = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => Math.floor(a * b),
    divide: (a, b) => Math.floor(a * (1 - b / 100)), // 這裡假設 b 是百分比，轉換為除法
};

export const sortDebuffArray = () => {};

export const calculateMonsterStatusAfterDebuff = (
    isPhysical: boolean,
    debuffArr: Debuff[],
    targetMonster: MonsterEntry
): MonsterEntry => {
    const activeDebuffs = debuffArr
        .filter((debuff) => debuff.active)
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
    const newMonsterStatus = { ...targetMonster };

    activeDebuffs.forEach((debuff) => {
        const {
            physicalDefense,
            physicalProtect,
            magicalDefense,
            magicalProtect,
        } = debuff;

        newMonsterStatus.physicalDefense = operations[
            physicalDefense.operation
        ](newMonsterStatus.physicalDefense, physicalDefense.value);
        newMonsterStatus.physicalProtect = operations[
            physicalProtect.operation
        ](newMonsterStatus.physicalProtect, physicalProtect.value);
        newMonsterStatus.magicalDefense = operations[magicalDefense.operation](
            newMonsterStatus.magicalDefense,
            magicalDefense.value
        );
        newMonsterStatus.magicalProtect = operations[magicalProtect.operation](
            newMonsterStatus.magicalProtect,
            magicalProtect.value
        );
    });

    return newMonsterStatus;
};
