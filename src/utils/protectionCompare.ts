import { protectionData } from "../data/protectionData";

// 怪物保護：破防前後實際減傷（不計承受傷害增加）

// 常見怪物（物理／魔法保護相同）；pierceResist：銳利抵抗，抵銷玩家銳利等級
export const MONSTERS = [
    { key: "renan", label: "雷楠（3、4王）", prot: 297, pierceResist: 2 },
    { key: "brentanas", label: "布倫塔納斯（2王）", prot: 297, pierceResist: 0 },
    { key: "petrak", label: "古樹的佩塔克（1王）", prot: 297, pierceResist: 0 },
];

export interface ProtCompareSettings {
    monster: string; // MONSTERS.key
    pierce: number; // 玩家銳利等級 0–11
    baseline: "pierce" | "raw"; // 比較基準：未破防（含銳利）／原始保護（不含銳利）
}

export const DEFAULT_PROT_COMPARE: ProtCompareSettings = { monster: "renan", pierce: 11, baseline: "pierce" };

export const findMonster = (key: string) => MONSTERS.find((m) => m.key === key) ?? MONSTERS[0];

// 保護 → 減傷率；官方說明保護為無條件捨去（之後可能調整）
export const protRate = (p: number) =>
    protectionData[Math.min(protectionData.length - 1, Math.max(0, Math.floor(p)))];

// 先扣 %、再扣固定（尚未扣銳利、未取整）
export const protBeforePierce = (monster: string, pct: number, fixed: number) =>
    Math.max(0, findMonster(monster).prot * Math.max(0, 1 - pct / 100) - fixed);

// 最後扣銳利（每級 -5，扣除怪物銳利抵抗）；銳利順序暫定
const protAfter = (s: ProtCompareSettings, pct: number, fixed: number, withPierce: boolean) => {
    const pierce = withPierce ? Math.max(0, s.pierce - findMonster(s.monster).pierceResist) : 0;
    return Math.max(0, protBeforePierce(s.monster, pct, fixed) - pierce * 5);
};

// pct：保護減少 % 合計；fixed：保護減少固定值合計
export const protCompare = (s: ProtCompareSettings, pct: number, fixed: number) => {
    const before = protAfter(s, 0, 0, s.baseline === "pierce");
    const after = protAfter(s, pct, fixed, true);
    const rb = protRate(before);
    const ra = protRate(after);
    return {
        before: Math.floor(before),
        after: Math.floor(after),
        rateBefore: Math.round(rb * 100),
        rateAfter: Math.round(ra * 100),
        mult: rb < 1 ? ((1 - ra) / (1 - rb)).toFixed(2) : "—", // 傷害倍率
    };
};
