// api/userData.ts
// 通用的帳號資料儲存：GET/PUT /me/data/:key，body 為 { data: <任意 JSON> }。
// 後端以 key 白名單控管；尚無資料（或端點未部署）時回傳 null。
import { API_BASE } from "./base";

export async function fetchUserData<T>(token: string, key: string): Promise<T | null> {
    const res = await fetch(`${API_BASE}/me/data/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return ((await res.json()) as { data: T | null }).data;
}

export async function saveUserData(token: string, key: string, data: unknown): Promise<void> {
    const res = await fetch(`${API_BASE}/me/data/${key}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
}
