import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { fetchMe, getOAuthLoginUrl, type AuthUser, type OAuthProvider } from "../api/auth";

const TOKEN_KEY = "auth_token";
export const AUTH_REDIRECT_KEY = "auth_redirect_path";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY));
    const user = ref<AuthUser | null>(null);

    const isLoggedIn = computed(() => !!user.value);

    function setToken(newToken: string) {
        token.value = newToken;
        localStorage.setItem(TOKEN_KEY, newToken);
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem(TOKEN_KEY);
    }

    /** 記住目前頁面後，整頁跳轉去後端 OAuth 登入 */
    function startLogin(provider: OAuthProvider) {
        sessionStorage.setItem(AUTH_REDIRECT_KEY, window.location.hash.replace(/^#/, "") || "/");
        window.location.href = getOAuthLoginUrl(provider);
    }

    /** 用現有 token 拉使用者資料；401 或無 token 視為未登入 */
    async function loadUser() {
        if (!token.value) {
            user.value = null;
            return;
        }

        try {
            const result = await fetchMe(token.value);
            if (!result) {
                logout();
                return;
            }
            user.value = result;
        } catch {
            // 網路錯誤等非 401 情況，保留 token，不強制登出
        }
    }

    return { token, user, isLoggedIn, setToken, logout, startLogin, loadUser };
});
