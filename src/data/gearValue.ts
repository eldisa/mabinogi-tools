/**
 * 裝備／道具效益換算（與職業無關的通用引擎）
 *
 * 做法：每個職業準備一份「效益檔」（ValueProfile），告訴引擎「1 單位某能力等同多少大傷」，
 * 賦予、稱號、娃娃背包、細工的素質就能換算成同一個單位（等同大傷）互相比較。
 * 效益檔可以由各職業計算器的「傷害效益」結果自動產生（見 gearValueShieldKnight.ts），也可以手動填寫。
 *
 * 注意：換算用的是目前設定下的「邊際效益」（多 1 單位的增幅），數值很大的組合會有些誤差。
 */

export interface ValueProfile {
    id: string;
    label: string;
    /** 能力名稱 → 每 1 單位（遊戲顯示的單位：點、%）等同多少大傷 */
    statWeights: Record<string, number>;
    /** 細工詞條名稱 → 每 1 級等同多少大傷（優先於 statWeights，用於「重擊傷害」這類以等級計的詞條） */
    levelWeights: Record<string, number>;
    /** 詞條別名 → 能力名稱（例如「精通斧最大傷害」→「最大傷害」） */
    aliases: Record<string, string>;
    /** 這個職業能用的武器類型（enchantSlots.ts 的 QUICK_WEAPON_OPTIONS.label），賦予查詢只列這些；沒填 = 全部 */
    weaponTypes?: string[];
}

export interface ValuedStat {
    name: string;
    /** 這項素質的數值（細工為等級 × 每級數值） */
    amount: number;
    /** 每單位（或每級）等同大傷；沒有對應的效益設定就是 null（不計入） */
    weight: number | null;
    /** 換算後等同大傷 */
    value: number;
}

export const resolveStatName = (profile: ValueProfile, name: string): string => profile.aliases[name] ?? name;

/** 一般能力（賦予、稱號、娃娃背包）：數值 × 每單位效益 */
export function valueOfStat(profile: ValueProfile, name: string, amount: number): ValuedStat {
    const weight = profile.statWeights[resolveStatName(profile, name)];
    return weight === undefined ? { name, amount, weight: null, value: 0 } : { name, amount, weight, value: amount * weight };
}

/** 細工詞條：有「每級效益」就用等級算，否則用 每級數值 × 每單位效益 */
export function valueOfReforge(profile: ValueProfile, entry: { name: string; stepValue: number }, level: number): ValuedStat {
    const perLevel = profile.levelWeights[entry.name];
    if (perLevel !== undefined) return { name: entry.name, amount: level, weight: perLevel, value: level * perLevel };
    const stat = valueOfStat(profile, entry.name, level * entry.stepValue);
    return stat;
}

export const sumValues = (items: ValuedStat[]): number => items.reduce((sum, i) => sum + i.value, 0);

/** 所有出現在效益檔裡的能力名稱（供文字解析用） */
export const profileStatNames = (profile: ValueProfile): string[] =>
    Array.from(new Set([...Object.keys(profile.statWeights), ...Object.keys(profile.aliases)])).sort((a, b) => b.length - a.length);

/**
 * 從稱號這類只有文字說明的效果，抓出已知能力的數值。
 * 支援「最大傷害增加25」「暴擊傷害 20% 增加」兩種寫法；中括號 [] 內視為負面效果，不計。
 */
export function parseEffectText(desc: string, statNames: string[]): { name: string; amount: number }[] {
    const positive = desc.replace(/\[([^\]]*)\]/g, "");
    const result: { name: string; amount: number }[] = [];
    for (const name of statNames) {
        const esc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const m =
            positive.match(new RegExp(esc + "[值]?增加\\s*(\\d+(?:\\.\\d+)?)")) ??
            positive.match(new RegExp(esc + "[值]?\\s*(\\d+(?:\\.\\d+)?)\\s*[%]?\\s*增加"));
        if (m) result.push({ name, amount: Number(m[1]) });
    }
    return result;
}

/** 手動調整過的效益覆蓋（只存有改的項目） */
export interface ProfileOverrides {
    statWeights: Record<string, number>;
    levelWeights: Record<string, number>;
}

export function applyOverrides(profile: ValueProfile, overrides: ProfileOverrides): ValueProfile {
    return {
        ...profile,
        statWeights: { ...profile.statWeights, ...overrides.statWeights },
        levelWeights: { ...profile.levelWeights, ...overrides.levelWeights },
    };
}
