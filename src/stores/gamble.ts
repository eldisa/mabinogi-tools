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
    STONE_PRICE: 700_000_000, // 生月餅價格 7 億 Gold
    APPRAISAL_FEE: 3_000_000, // 鑑定費用 300 萬 Gold
    INITIAL_BALANCE: 5_000_000_000, // 初始餘額 50 億 Gold
    BASE_STONE_PRICE: 300_000_000, // 價格表基準石頭價格 3 億 Gold
};

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

    // State
    const balance = ref(saved?.balance ?? ECONOMY_CONFIG.INITIAL_BALANCE);
    const unappraised = ref(saved?.unappraised ?? 0); // 未鑑定的月餅數量
    const history = ref<AppraisalRecord[]>(saved?.history ?? []);

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
        const stoneCost = (history.value.length + unappraised.value) * ECONOMY_CONFIG.STONE_PRICE;
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
        const totalCost = count * ECONOMY_CONFIG.STONE_PRICE;
        if (!canAfford(totalCost)) return false;
        balance.value -= totalCost;
        unappraised.value += count;
        save();
        return true;
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
    };
});
