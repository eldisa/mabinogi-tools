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
    cost: number; // 當前已投入成本
    expectedTimes: number; // 預期製作次數
    simulateResult: Record<number, SampleResult>; // 模擬結果，key 為製作次數，value 為對應結果
}
