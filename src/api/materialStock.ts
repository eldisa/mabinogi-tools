// api/materialStock.ts
// /me/material-stock 端點：每個材料存 { stock, price }。
// 原本只存 stock（純數字），讀取時仍相容舊格式（純數字視為 { stock, price: 0 }）。
import { API_BASE } from "./base";

export interface MaterialAccountEntry {
    stock: number;
    price: number;
}

/** 帳號的材料庫存與價格（key 為材料 id 字串） */
export type MaterialAccountMap = Record<string, MaterialAccountEntry>;

const normalize = (raw: unknown): MaterialAccountMap => {
    const out: MaterialAccountMap = {};
    for (const [id, v] of Object.entries((raw ?? {}) as Record<string, unknown>)) {
        if (typeof v === "number") {
            out[id] = { stock: v, price: 0 }; // 舊格式：只有庫存
        } else if (v && typeof v === "object") {
            const o = v as { stock?: unknown; price?: unknown };
            out[id] = {
                stock: typeof o.stock === "number" ? o.stock : 0,
                price: typeof o.price === "number" ? o.price : 0,
            };
        }
    }
    return out;
};

/** 取得目前帳號的材料庫存與價格 */
export async function fetchMaterialStock(token: string): Promise<MaterialAccountMap> {
    const res = await fetch(`${API_BASE}/me/material-stock`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return normalize(await res.json());
}

/** 整包覆蓋帳號的材料庫存與價格 */
export async function saveMaterialStock(token: string, data: MaterialAccountMap): Promise<void> {
    const res = await fetch(`${API_BASE}/me/material-stock`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}
