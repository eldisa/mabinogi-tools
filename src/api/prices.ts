// api/prices.ts
import { API_BASE } from "./base";

export type DungeonSource = "brie-lech" | "snow";

export interface DungeonItemPrice {
    id: number | null;
    name: { tw: string; kr: string; en?: string };
    price: number;
    type: string;
    /** 掉落副本來源；舊資料（爬蟲補上這個欄位之前）沒有這個欄位，一律視為布里萊赫地城 */
    source?: DungeonSource;
}

export interface MuriasRelicLevelPrice {
    level: number;
    count: number;
    price: number;
}

export interface MuriasRelicOption {
    skillId: number | null;
    name: { kr: string; tw: string };
    max: string;
    levels: MuriasRelicLevelPrice[];
}

export interface MuriasRelicJobPrice {
    job: { kr: string };
    allLevel10Price: number;
    options: MuriasRelicOption[];
}

/** 布里萊赫地城掉落物／賦予料價格（韓服，爬蟲/後台更新） */
export async function fetchDungeonItemPrices(): Promise<DungeonItemPrice[]> {
    const res = await fetch(`${API_BASE}/prices/dungeon-items`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
}

/** 穆利亞斯遺物各職業技能選項價格（韓服，爬蟲/後台更新） */
export async function fetchMuriasRelicPrices(): Promise<MuriasRelicJobPrice[]> {
    const res = await fetch(`${API_BASE}/prices/murias-relic`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
}

export interface PricesMeta {
    dungeonItemsUpdatedAt: string | null;
    muriasRelicUpdatedAt: string | null;
}

/** 兩份價格資料各自最後一次寫入的時間 */
export async function fetchPricesMeta(): Promise<PricesMeta> {
    const res = await fetch(`${API_BASE}/prices/meta`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
}
