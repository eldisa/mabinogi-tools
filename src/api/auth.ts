// api/auth.ts
import { API_BASE } from "./base";

export type OAuthProvider = "google" | "discord";

export interface AuthUser {
    id: string;
    email: string | null;
    displayName: string;
    avatarUrl: string | null;
}

/** 產生導向後端 OAuth 登入端點的網址（整頁跳轉用） */
export function getOAuthLoginUrl(provider: OAuthProvider): string {
    const redirect = encodeURIComponent(window.location.origin);
    return `${API_BASE}/auth/${provider}?redirect=${redirect}`;
}

/** 用 token 換取目前使用者資料，401 回傳 null（視為未登入） */
export async function fetchMe(token: string): Promise<AuthUser | null> {
    const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return null;
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    return res.json();
}
