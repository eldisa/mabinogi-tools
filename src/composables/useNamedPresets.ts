import { ref, type Ref } from "vue";
import { useAccountSync, mergeByTimestamp } from "./useAccountSync";

export interface NamedPreset<T> {
    name: string;
    timestamp: number;
    data: T;
}

/** 供「技能次數組合」「破防組合」等小型可命名存檔清單共用，行為比照裝備配置：本機 localStorage + 帳號同步。 */
export function useNamedPresetList<T>(storageKey: string, accountSyncKey: string) {
    function loadAll(): NamedPreset<T>[] {
        try {
            const raw = localStorage.getItem(storageKey);
            if (raw) return JSON.parse(raw) || [];
        } catch {
            /* ignore */
        }
        return [];
    }

    const presets = ref<NamedPreset<T>[]>(loadAll()) as Ref<NamedPreset<T>[]>;
    const saveLocal = () => localStorage.setItem(storageKey, JSON.stringify(presets.value));
    const accountSync = useAccountSync(accountSyncKey, presets, mergeByTimestamp<NamedPreset<T>>, saveLocal);

    function persist() {
        saveLocal();
        accountSync.push();
    }

    function saveAsNew(name: string, data: T): number {
        const timestamp = Date.now();
        presets.value.push({ name: name.trim() || `組合 ${presets.value.length + 1}`, timestamp, data: JSON.parse(JSON.stringify(data)) });
        persist();
        return timestamp;
    }

    function remove(idx: number) {
        presets.value.splice(idx, 1);
        persist();
    }

    function rename(idx: number, name: string) {
        const item = presets.value[idx];
        if (item) {
            item.name = name;
            persist();
        }
    }

    return { presets, saveAsNew, remove, rename };
}
