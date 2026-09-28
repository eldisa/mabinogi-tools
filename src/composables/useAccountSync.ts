import { watch, type Ref } from "vue";
import { ElMessage } from "element-plus";
import { useAuthStore } from "../stores/auth";
import { fetchUserData, saveUserData } from "../api/userData";

interface Timestamped {
    timestamp: number;
}

/** 合併兩份存檔清單（以 timestamp 當識別），本機獨有的也保留，避免登入時弄丟資料 */
export function mergeByTimestamp<P extends Timestamped>(local: P[], remote: P[]): P[] {
    const seen = new Set(remote.map((p) => p.timestamp));
    return [...remote, ...local.filter((p) => !seen.has(p.timestamp))];
}

/**
 * 讓 localStorage 的存檔同步到帳號。
 * - 登入時：拉帳號資料與本機合併，寫回本機並上傳合併結果
 * - 之後每次本機存檔完呼叫 push()，把整份資料覆蓋到帳號
 * 未登入或網路失敗時完全不影響本機行為。
 */
export function useAccountSync<T>(
    key: string,
    data: Ref<T>,
    merge: (local: T, remote: T) => T,
    saveLocal: () => void,
) {
    const auth = useAuthStore();

    async function pull() {
        if (!auth.token) return;
        try {
            const remote = await fetchUserData<T>(auth.token, key);
            if (remote != null) {
                data.value = merge(data.value, remote);
                saveLocal();
            }
            await saveUserData(auth.token, key, data.value);
        } catch {
            // 網路錯誤：維持本機資料
        }
    }

    async function push() {
        if (!auth.isLoggedIn || !auth.token) return;
        try {
            await saveUserData(auth.token, key, data.value);
        } catch {
            ElMessage.warning("帳號同步失敗，已儲存在本機");
        }
    }

    watch(() => auth.isLoggedIn, (loggedIn) => loggedIn && pull(), { immediate: true });

    return { push };
}
