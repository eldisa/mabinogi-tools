/**
 * 最高效益配置：依武器類型與部位，替每個部位挑接頭＋接尾各一，總分最高。
 * 同一個賦予不能重複使用，所以是「指派問題」（匈牙利演算法），不是每格各取第一名。
 */
import type { Enchant } from "../types/Enchant";
import { enchantsForSlot, slotsForWeapon, type SlotDef } from "./enchantSlots";

export interface BestSlot {
    slot: SlotDef;
    prefix: Enchant | null;
    suffix: Enchant | null;
}

export interface BestSetOptions {
    /** 過濾綁定專用的賦予 */
    noPersonalize?: boolean;
    /** 裝備破袍：不使用袍/翅膀欄 */
    hideRobe?: boolean;
    /** 不使用月餅欄 */
    hideMoonCake?: boolean;
}

const FORBIDDEN = 1e9;

/** 最小成本指派（列 ≤ 欄）：回傳每列選到的欄 */
function hungarian(cost: number[][]): number[] {
    const n = cost.length;
    const m = cost[0]?.length ?? 0;
    const u = new Array(n + 1).fill(0);
    const v = new Array(m + 1).fill(0);
    const p = new Array(m + 1).fill(0);
    const way = new Array(m + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        p[0] = i;
        let j0 = 0;
        const minv = new Array(m + 1).fill(Infinity);
        const used = new Array(m + 1).fill(false);
        do {
            used[j0] = true;
            const i0 = p[j0];
            let delta = Infinity;
            let j1 = 0;
            for (let j = 1; j <= m; j++) {
                if (used[j]) continue;
                const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
                if (cur < minv[j]) {
                    minv[j] = cur;
                    way[j] = j0;
                }
                if (minv[j] < delta) {
                    delta = minv[j];
                    j1 = j;
                }
            }
            for (let j = 0; j <= m; j++) {
                if (used[j]) {
                    u[p[j]] += delta;
                    v[j] -= delta;
                } else minv[j] -= delta;
            }
            j0 = j1;
        } while (p[j0] !== 0);
        do {
            const j1 = way[j0];
            p[j0] = p[j1];
            j0 = j1;
        } while (j0);
    }
    const result = new Array(n).fill(-1);
    for (let j = 1; j <= m; j++) if (p[j]) result[p[j] - 1] = j - 1;
    return result;
}

/** 每個部位從候選名單挑一個（或不挑），總分最高；候選名單依部位給 */
function assignBest(candidates: Enchant[][], scorer: (e: Enchant) => number): (Enchant | null)[] {
    const n = candidates.length;
    // 最佳解不會用到某部位第 n 名之後的賦予（最多 n-1 個其他部位搶走前面的）
    const top = candidates.map((list) => list.slice().sort((a, b) => scorer(b) - scorer(a)).slice(0, n));
    const pool = Array.from(new Map(top.flat().map((e) => [e.id, e])).values());
    // 欄 = 候選賦予 + n 個「空著」，空著的分數是 0
    const cost = top.map((list) => {
        const ids = new Set(list.map((e) => e.id));
        return [...pool.map((e) => (ids.has(e.id) ? -scorer(e) : FORBIDDEN)), ...new Array(n).fill(0)];
    });
    return hungarian(cost).map((j) => (j >= 0 && j < pool.length ? pool[j] : null));
}

export function buildBestSet(allEnchants: Enchant[], weaponLabel: string, scorer: (e: Enchant) => number, opts: BestSetOptions = {}): BestSlot[] {
    const slots = slotsForWeapon(weaponLabel, opts.hideRobe).filter((s) => !(opts.hideMoonCake && s.label === "月餅"));
    const pick = (type: Enchant["type"]) =>
        assignBest(
            slots.map((slot) =>
                enchantsForSlot(allEnchants, slot, weaponLabel, { noPersonalize: opts.noPersonalize, relevantOnly: false }).filter(
                    (e) => e.type === type && scorer(e) > 0,
                ),
            ),
            scorer,
        );
    const prefixes = pick("prefix");
    const suffixes = pick("suffix");
    return slots.map((slot, i) => ({ slot, prefix: prefixes[i], suffix: suffixes[i] }));
}
