import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AbilityOption } from "../data/stoneData";

// 鑑定紀錄類型
export interface AppraisalRecord {
    id: string;
    timestamp: number;
    ability: AbilityOption;
    level: number;
    value: number; // Token 價值
    status: "collected" | "sold"; // 收藏或售出
}

// 經濟參數（單位：Gold）
export const ECONOMY_CONFIG = {
    DEFAULT_STONE_PRICE: 700_000_000, // 預設生月餅價格 7 億 Gold
    APPRAISAL_FEE: 3_000_000, // 鑑定費用 300 萬 Gold
    INITIAL_BALANCE: 5_000_000_000, // 初始餘額 50 億 Gold
    BASE_STONE_PRICE: 300_000_000, // 價格表基準石頭價格 3 億 Gold
};

// 設定 LocalStorage key
const SETTINGS_STORAGE_KEY = "mabinogi_gamble_settings";

// 保留清單項目
export interface RetentionItem {
    skillId: number;
    minLevel: number; // 0 表示全部賣出 (Sell All)
}

// 顯示模式
export type DisplayMode = "all" | "highROI" | "none";

// 機率模式
export type ProbabilityMode = "equal" | "custom" | "ingame";

// 機率模式配置
export const PROBABILITY_CONFIGS: Record<ProbabilityMode, { name: string; weights: number[] }> = {
    equal: {
        name: "平均 (10%)",
        weights: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
    },
    custom: {
        name: "自訂 (高等稀有)",
        weights: [12, 12, 12, 12, 12, 8.33, 8.33, 8.34, 10, 5],
    },
    ingame: {
        name: "遊戲內數據",
        weights: [16.81, 15.29, 13.78, 12.27, 10.76, 9.24, 7.73, 6.22, 4.71, 3.19],
    },
};

// 設定資料結構
export interface GambleSettings {
    stonePrice: number;
    autoRecharge: boolean; // 自動充值開關
    minROI: number; // 最低回報率過濾 (百分比，例如 200 表示 200%)
    retentionList: RetentionItem[]; // 保留清單
    autoStopCount: number; // 自動停止次數 (0 表示不限制)
    displayMode: DisplayMode; // 顯示模式
    probabilityMode: ProbabilityMode; // 機率模式
}

// 預設設定
function getDefaultSettings(): GambleSettings {
    return {
        stonePrice: ECONOMY_CONFIG.DEFAULT_STONE_PRICE,
        autoRecharge: false,
        minROI: 200,
        retentionList: [],
        autoStopCount: 0,
        displayMode: "all",
        probabilityMode: "equal", // 預設平均機率
    };
}

// 讀取設定
function loadSettings(): GambleSettings {
    try {
        const data = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (data) {
            const parsed = JSON.parse(data);
            // 合併預設值，確保新增的設定項有預設值
            return { ...getDefaultSettings(), ...parsed };
        }
    } catch (e) {
        console.error("Failed to load gamble settings:", e);
    }
    return getDefaultSettings();
}

// 儲存設定
function saveSettings(settings: GambleSettings) {
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error("Failed to save gamble settings:", e);
    }
}

// LocalStorage key
const STORAGE_KEY = "mabinogi_gamble_store";

// 儲存的資料結構
interface StoredData {
    balance: number;
    unappraised: number;
    history: AppraisalRecord[];
}

// 從 LocalStorage 讀取資料
function loadFromStorage(): StoredData | null {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Failed to load gamble store from localStorage:", e);
    }
    return null;
}

// 儲存到 LocalStorage
function saveToStorage(data: StoredData) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to save gamble store to localStorage:", e);
    }
}

export const useGambleStore = defineStore("gamble", () => {
    // 從 LocalStorage 初始化
    const saved = loadFromStorage();
    const settings = loadSettings();

    // State
    const balance = ref(saved?.balance ?? ECONOMY_CONFIG.INITIAL_BALANCE);
    const unappraised = ref(saved?.unappraised ?? 0); // 未鑑定的月餅數量
    const history = ref<AppraisalRecord[]>(saved?.history ?? []);
    const stonePrice = ref(settings.stonePrice); // 可配置的石頭價格
    const autoRecharge = ref(settings.autoRecharge); // 自動充值開關
    const minROI = ref(settings.minROI); // 最低回報率過濾
    const retentionList = ref<RetentionItem[]>(settings.retentionList); // 保留清單
    const autoStopCount = ref(settings.autoStopCount); // 自動停止次數
    const displayMode = ref<DisplayMode>(settings.displayMode); // 顯示模式
    const probabilityMode = ref<ProbabilityMode>(settings.probabilityMode); // 機率模式

    // 儲存
    function save() {
        saveToStorage({
            balance: balance.value,
            unappraised: unappraised.value,
            history: history.value,
        });
    }

    // Getters
    const collectedItems = computed(() => history.value.filter((r) => r.status === "collected"));
    const soldItems = computed(() => history.value.filter((r) => r.status === "sold"));
    const totalSpent = computed(() => {
        const stoneCost = (history.value.length + unappraised.value) * stonePrice.value;
        const appraisalCost = history.value.length * ECONOMY_CONFIG.APPRAISAL_FEE;
        return stoneCost + appraisalCost;
    });
    const totalEarned = computed(() => {
        return soldItems.value.reduce((sum, r) => sum + r.value, 0);
    });

    // Actions
    function canAfford(amount: number): boolean {
        return balance.value >= amount;
    }

    function deduct(amount: number): boolean {
        if (!canAfford(amount)) return false;
        balance.value -= amount;
        save();
        return true;
    }

    function add(amount: number) {
        balance.value += amount;
        save();
    }

    // 購買月餅
    function buyStones(count: number): boolean {
        const totalCost = count * stonePrice.value;
        if (!canAfford(totalCost)) return false;
        balance.value -= totalCost;
        unappraised.value += count;
        save();
        return true;
    }

    // 儲存所有設定
    function saveAllSettings() {
        saveSettings({
            stonePrice: stonePrice.value,
            autoRecharge: autoRecharge.value,
            minROI: minROI.value,
            retentionList: retentionList.value,
            autoStopCount: autoStopCount.value,
            displayMode: displayMode.value,
            probabilityMode: probabilityMode.value,
        });
    }

    // 更新石頭價格設定
    function setStonePrice(price: number) {
        stonePrice.value = price;
        saveAllSettings();
    }

    // 更新自動充值設定
    function setAutoRecharge(enabled: boolean) {
        autoRecharge.value = enabled;
        saveAllSettings();
    }

    // 更新最低回報率
    function setMinROI(roi: number) {
        minROI.value = roi;
        saveAllSettings();
    }

    // 更新保留清單中的某項
    function setRetentionItem(skillId: number, minLevel: number) {
        const existing = retentionList.value.find((item) => item.skillId === skillId);
        if (existing) {
            existing.minLevel = minLevel;
        } else {
            retentionList.value.push({ skillId, minLevel });
        }
        saveAllSettings();
    }

    // 更新自動停止次數
    function setAutoStopCount(count: number) {
        autoStopCount.value = count;
        saveAllSettings();
    }

    // 更新顯示模式
    function setDisplayMode(mode: DisplayMode) {
        displayMode.value = mode;
        saveAllSettings();
    }

    // 更新機率模式
    function setProbabilityMode(mode: ProbabilityMode) {
        probabilityMode.value = mode;
        saveAllSettings();
    }

    // 取得某技能的保留等級設定
    function getRetentionLevel(skillId: number): number {
        const item = retentionList.value.find((i) => i.skillId === skillId);
        return item?.minLevel ?? 0; // 0 表示 Sell All
    }

    // 鑑定月餅（回傳鑑定結果陣列）
    function appraiseStones(count: number): AppraisalRecord[] {
        const actualCount = Math.min(count, unappraised.value);
        const totalFee = actualCount * ECONOMY_CONFIG.APPRAISAL_FEE;
        if (!canAfford(totalFee) || actualCount === 0) return [];

        balance.value -= totalFee;
        unappraised.value -= actualCount;

        const results: AppraisalRecord[] = [];
        // 這裡只扣費，實際鑑定邏輯在 View 中處理
        save();
        return results;
    }

    function addRecord(record: AppraisalRecord) {
        history.value.unshift(record);
        save();
    }

    function addRecords(records: AppraisalRecord[]) {
        history.value.unshift(...records);
        save();
    }

    // 收藏轉售出
    function sellCollectedItem(recordId: string): boolean {
        const record = history.value.find((r) => r.id === recordId);
        if (record && record.status === "collected") {
            record.status = "sold";
            add(record.value);
            return true;
        }
        return false;
    }

    function resetBalance() {
        balance.value = ECONOMY_CONFIG.INITIAL_BALANCE;
        unappraised.value = 0;
        history.value = [];
        save();
    }

    return {
        // State
        balance,
        unappraised,
        history,
        stonePrice,
        autoRecharge,
        minROI,
        retentionList,
        autoStopCount,
        displayMode,
        probabilityMode,
        // Getters
        collectedItems,
        soldItems,
        totalSpent,
        totalEarned,
        // Actions
        canAfford,
        deduct,
        add,
        buyStones,
        appraiseStones,
        addRecord,
        addRecords,
        sellCollectedItem,
        resetBalance,
        setStonePrice,
        setAutoRecharge,
        setMinROI,
        setRetentionItem,
        getRetentionLevel,
        setAutoStopCount,
        setDisplayMode,
        setProbabilityMode,
    };
});
