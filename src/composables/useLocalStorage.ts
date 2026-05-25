import { ref, watch, type Ref } from 'vue';

/**
 * 與 localStorage 雙向同步的 ref。
 * 初始值優先讀取 localStorage，讀不到才用 defaultValue。
 */
export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
    let initial: T = defaultValue;
    try {
        const raw = localStorage.getItem(key);
        if (raw !== null) initial = JSON.parse(raw) as T;
    } catch { /* 解析失敗就用預設值 */ }

    const state = ref(initial) as Ref<T>;

    watch(state, (val) => {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch { /* 寫入失敗靜默忽略 */ }
    }, { deep: true });

    return state;
}
