// api/materialStock.ts
import { API_BASE } from "./base";

export type MaterialStockMap = Record<string, number>;

/** 取得目前帳號的材料庫存（key 為材料 id 字串） */
export async function fetchMaterialStock(token: string): Promise<MaterialStockMap> {
    const res = await fetch(`${API_BASE}/me/material-stock`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
}

/** 整包覆蓋帳號的材料庫存 */
export async function saveMaterialStock(token: string, stock: MaterialStockMap): Promise<void> {
    const res = await fetch(`${API_BASE}/me/material-stock`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(stock),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}
