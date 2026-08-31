// api/materials.ts
import { API_BASE } from "./base";

export interface MaterialPriceFeedEntry {
    id: number;
    price: number;
    updatedAt?: string;
}

/** 公開的材料市價預設值（爬蟲/後台更新）。目前資料不齊，前端須自行 fallback。 */
export async function fetchMaterialPriceFeed(): Promise<MaterialPriceFeedEntry[]> {
    const res = await fetch(`${API_BASE}/materials/prices`);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
}
