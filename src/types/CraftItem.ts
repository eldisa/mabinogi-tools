export interface SampleResult {
    count: number; // 製作次數
    rate: number; // 機率
    times: number; // 測試出現的次數
}

export interface EstimatedCraftItem {
    id: number; // 唯一識別符
    name: string; // 名稱
    isRoyalCraft: boolean; // 是否為王城製作
    currentProgress: number; // 當前完成度
    baseCost: number; // 當前已投入成本
    expectedCost: number; // 預期再投入成本
    totalCost: number; // 總成本
    expectedTimes: number; // 預期製作次數
    simulateResult: Record<number, SampleResult>; // 模擬結果，key 為製作次數，value 為對應結果
}

export interface LocalizedName {
    [lang: string]: string; // ex: { zh: '鐵劍', en: 'Iron Sword', ko: '철검' }
}

export interface CraftableItem {
    id: number;
    name: LocalizedName;
    source: MaterialSource;

    // 市價（例如來自玩家回報或手動填寫）
    marketPrice?: number;
}

export type CurrencyInGame = "gold" | "ducat"; // 遊戲內貨幣類型
export type Currency = "game" | "NTD" | "HKD";

export type MaterialSource =
    | { type: "drop"; monster: string } // 怪物掉落
    | { type: "reward"; dungeon: string } // 地下城獎勵
    | { type: "shop"; price: number; currency?: CurrencyInGame } // 商店購買，有分金幣和杜卡特
    | { type: "craft"; materials: { id: number; amount: number }[] } // 製作所需材料
    | { type: "dissolution"; materials: string } // 分解
    | { type: "" };
