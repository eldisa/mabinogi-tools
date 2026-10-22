/**
 * 部位比較：只改某幾個部位的差異（面板大傷、暴擊傷害、額外傷害、細工、武器種類），其他維持目前設定，完整重算總輸出。
 * 填的都是「相較目前多或少多少」，避免面板大傷把目前裝備的賦予重複計算。
 */
import { WEAPON_PRESETS, getReforgeLevelMax, REFORGE_SLOTS, type ReforgeSlotKey, type ReforgeType, type ShieldKnightSettings } from "./shieldKnightCalculator";

export const COMPARE_PARTS = [
    { key: "weapon", label: "武器" },
    { key: "head", label: "頭" },
    { key: "body", label: "身" },
    { key: "hands", label: "手" },
    { key: "feet", label: "腳" },
    { key: "accessory1", label: "飾品 1" },
    { key: "accessory2", label: "飾品 2" },
    { key: "shield", label: "盾牌" },
] as const;

export type ComparePartKey = (typeof COMPARE_PARTS)[number]["key"];

/** 一個部位相較目前的差異；沒有設定的部位視為「相同」 */
export interface PartDelta {
    /** 面板最大傷害差（賦予、裝備給的大傷） */
    maxDamage: number;
    /** 暴擊傷害 %（加算進暴擊傷害） */
    criticalDamage: number;
    /** 額外傷害 %（加進額外傷害那一桶） */
    extraDamage: number;
    /** 細工等級差（只有武器與飾品有細工） */
    smash: number;
    windmill: number;
    charge: number;
    /** 換武器（同一種武器類型內），沒選就不換 */
    weaponId: string | null;
}

export const createPartDelta = (): PartDelta => ({ maxDamage: 0, criticalDamage: 0, extraDamage: 0, smash: 0, windmill: 0, charge: 0, weaponId: null });

export type PartDeltas = Partial<Record<ComparePartKey, PartDelta>>;

const REFORGE_TYPES: ReforgeType[] = ["smash", "windmill", "charge"];
const isReforgeSlot = (key: string): key is ReforgeSlotKey => REFORGE_SLOTS.some((s) => s.key === key);

/** 把各部位的差異套到目前設定上（不改動原設定） */
export function applyPartDeltas(settings: ShieldKnightSettings, deltas: PartDeltas): ShieldKnightSettings {
    const next: ShieldKnightSettings = JSON.parse(JSON.stringify(settings));
    for (const part of COMPARE_PARTS) {
        const d = deltas[part.key];
        if (!d) continue;
        next.panelMaxDamage += d.maxDamage;
        // 賦予的暴擊傷害／額外傷害只是加進對應的加總，借用稱號欄位當作加總載體
        next.criticalDamage.titlePercent += d.criticalDamage;
        next.extraDamage.titlePercent += d.extraDamage;
        if (isReforgeSlot(part.key)) {
            const max = getReforgeLevelMax(part.key, next.weaponType);
            for (const type of REFORGE_TYPES) next.reforge[part.key][type] = Math.min(max, Math.max(0, next.reforge[part.key][type] + d[type]));
        }
        if (part.key === "weapon" && d.weaponId && WEAPON_PRESETS[next.weaponType].some((w) => w.id === d.weaponId)) next.weaponId = d.weaponId;
    }
    return next;
}

/** 一個部位差異的文字摘要，沒有差異回傳 null */
export function summarizePartDelta(d: PartDelta | undefined, weaponLabel?: (id: string) => string): string | null {
    if (!d) return null;
    const sign = (n: number) => (n > 0 ? `+${n}` : `${n}`);
    const parts: string[] = [];
    if (d.weaponId && weaponLabel) parts.push(weaponLabel(d.weaponId));
    if (d.maxDamage) parts.push(`大傷 ${sign(d.maxDamage)}`);
    if (d.criticalDamage) parts.push(`暴傷 ${sign(d.criticalDamage)}%`);
    if (d.extraDamage) parts.push(`額外 ${sign(d.extraDamage)}%`);
    if (d.smash) parts.push(`重擊細工 ${sign(d.smash)}`);
    if (d.windmill) parts.push(`風車細工 ${sign(d.windmill)}`);
    if (d.charge) parts.push(`突擊細工 ${sign(d.charge)}`);
    return parts.length ? parts.join("、") : null;
}
