// 絕版稱號：無法再獲得的活動/首殺稱號，需手動維護
export const obsoleteTitleIds = new Set(["18153", "18154", "18155", "18158", "16028"]);

// 期限稱號：Duration != "0" 或 Hint 中明確說明會消失
export function isTimedTitle(t: { Duration: string; Hint: string }): boolean {
    if (t.Duration !== "0") return true;
    return /一定時間|一定期間|一段時間/.test(t.Hint ?? "");
}

// 排名稱號：Hint 中標示排名名次
export function isRankingTitle(t: { Hint: string }): boolean {
    return /排名第\s*\d|每週排名|TOP\s*\d/.test(t.Hint ?? "");
}
