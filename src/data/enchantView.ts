/** 賦予的顯示用小工具（賦予查詢頁與賦予快速檢視共用） */
import type { Enchant, EnchantAbility } from "../types/Enchant";
import { enchants, reward } from "./enchants";
import { abilitiesMap, abilitiesValueWithPercentArray } from "./abilities";

/** 能力選單順序 */
export const ABILITY_ORDER: string[] = [
    "lance_piercing",
    "attack_max",
    "AttMax",
    "Attmax",
    "wAttMax",
    "all_alchemy_damage",
    "music_buff_bonus",
    "magic_attack",
    "casting_speed",
    "critical_damage",
    "criticaldamage",
    "critical_cap_increase",
    "bonus_damage",
    "bonusdamage",
    // 基礎數值
    "HP",
    "LifeMax",
    "MP",
    "ManaMax",
    "SP",
    "StaminaMax",
    // 能力值
    "STR",
    "STR2",
    "Str",
    "DEX",
    "Dex",
    "dex",
    "WIL",
    "Will",
    "LUK",
    "Luck",
    "INT",
    "Int",
    "int",
    // 攻擊

    "attack_min",
    "AttMin",
    "wAttMin",
    "balance",
    "critical",
    "Crit",
    // 防禦
    "defense",
    "Def",
    "protection",
    "Prot",
    "prot",
    "protect",
    "magic_defense",
    "magicdefence",
    "magic_protection",
    "magicprotect",
    "damage_reduction_rate",
    // 移動
    "move_speed",
    "Hurry",
];

/** 根據自定義順序陣列排序（順序內的靠前，其餘依中文字母） */
export const sortWithOrder = <T extends string>(items: T[], order: string[], nameGetter: (id: T) => string): T[] => {
    const orderIndex = new Map(order.map((id, i) => [id, i]));
    return [...items].sort((a, b) => {
        const ai = orderIndex.get(a) ?? Infinity;
        const bi = orderIndex.get(b) ?? Infinity;
        if (ai !== bi) return ai - bi;
        return nameGetter(a).localeCompare(nameGetter(b), "zh-TW");
    });
};

/** 渲染能力效果（HTML） */
export const renderAbilities = (abilityIdArray: EnchantAbility[]): string => {
    const format = (num: number): string => {
        const color = num < 0 ? "#ef4444" : "#60a5fa"; // red-500 : blue-400
        const sign = num >= 0 ? "+" : "";
        return `<span style="color:${color}; font-weight: 600;">${sign}${num}</span>`;
    };

    return abilityIdArray
        .map((ability) => {
            const { id, min, max } = ability;
            const abilityName = abilitiesMap[id] || id;
            const suffix = abilitiesValueWithPercentArray.includes(id) ? "%" : "";

            if (min !== max) {
                return `<div style="margin: 2px 0;">${abilityName}: ${format(min)} ~ ${format(max)}${suffix}</div>`;
            } else {
                return `<div style="margin: 2px 0;">${abilityName}: ${format(min)}${suffix}</div>`;
            }
        })
        .join("");
};

// 從資料中動態推導所有出現過的能力（有中文名稱的才列出）
export const selectableAbility: string[] = sortWithOrder(
    Array.from(new Set(enchants.flatMap((e) => e.effect.map((eff) => eff.id)))).filter((id) => abilitiesMap[id]),
    ABILITY_ORDER,
    (id) => abilitiesMap[id] ?? id,
);

// enchant id → 副本名稱
const enchantSourceMap = new Map<number, string>();
reward.forEach((r) => r.list.forEach((id) => enchantSourceMap.set(id, r.raidName)));
export const getEnchantSource = (id: number): string => enchantSourceMap.get(id) ?? "—";

/** 出處標籤：G27 / VH / G28，其他有已知來源的給 ★，沒有來源給空字串 */
export const getSourceLabel = (id: number): string => {
    const src = getEnchantSource(id);
    if (src === "—") return "";
    if (src.includes("G27")) return "G27";
    if (src.includes("VH") || src.includes("格倫")) return "VH";
    if (src.includes("G28")) return "G28";
    return "★";
};

// desc 換行處理：相容舊格式（\\n 兩個字元）與新格式（真換行 \n）
export const descLines = (desc: string): string[] =>
    desc
        .replace(/\\+n/g, "\n")
        .split("\n")
        .filter((l) => l.trim() !== "");

/** 合併同 ID 的多個詞條（數值加總） */
export interface MergedEffect {
    id: string;
    min: number;
    max: number;
}
export const mergeEffects = (enchant: Enchant): MergedEffect[] => {
    const map = new Map<string, MergedEffect>();
    for (const eff of enchant.effect) {
        const ex = map.get(eff.id);
        if (ex) {
            ex.min += eff.min;
            ex.max += eff.max;
        } else {
            map.set(eff.id, { id: eff.id, min: eff.min, max: eff.max });
        }
    }
    return Array.from(map.values());
};
