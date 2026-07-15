export type AnnouncementType = "new" | "fix" | "update";

export interface Announcement {
    date: string;
    type: AnnouncementType;
    text: string;
}

export interface TodoItem {
    title: string;
    status: "planned" | "in_progress";
}

export const announcements: Announcement[] = [
    { date: "2026-07-16", type: "new", text: "新增 破防練習：練習維持破防條件同時在場，含技能／寵物施加與隨機出題 10 關" },
    { date: "2026-07-16", type: "update", text: "符文模擬器：目標詞條最低等級改為預設滿等、移除最多次數設定" },
    { date: "2026-07-14", type: "update", text: "符文查詢：符文格加上對應的歐甘符文字符" },
    { date: "2026-07-14", type: "update", text: "符文模擬器：特殊符文固定大師級、目標詞條可多選（抽到目標為止）、各區塊可收合" },
    { date: "2026-07-11", type: "update", text: "轉蛋模擬器：統計表新增等級／道具名稱篩選" },
    { date: "2026-07-10", type: "new", text: "新增 轉蛋模擬器：貼上機率表模擬抽取，支援多抽、抽到目標為止與統計" },
    { date: "2026-07-10", type: "new", text: "新增 符文模擬器：模擬符文詞條抽取，支援鎖定、抽到目標為止與花費統計" },
    { date: "2026-07-06", type: "update", text: "修正 武器改造 手把的推薦選擇大傷會異常的問題" },
    { date: "2026-07-06", type: "update", text: "更新 武器改造 改造式名稱的翻譯" },
    { date: "2026-07-05", type: "new", text: "新增 符文（Ogham）查詢：10 祕法組合技與詞條，含韓文原文對照" },
    { date: "2026-06-26", type: "new", text: "新增 魔法陣查詢" },
    { date: "2026-06-26", type: "update", text: "賦予快速檢視：新增月餅、副手部位，物理武器細分、改為大類+武器選擇" },
    { date: "2026-06-26", type: "update", text: "細工模擬器：達標時顯示與平均的倍數及 PR 百分位" },
    { date: "2026-06-26", type: "update", text: "材料計算機：新增價格匯出/匯入" },
    { date: "2026-06-25", type: "update", text: "音樂計算機 新增其他音樂的計算" },
    { date: "2026-06-18", type: "update", text: "修正 音樂計算機 錯誤" },
    { date: "2026-06-18", type: "update", text: "首頁與側邊欄重整，依分類顯示功能模組" },
    { date: "2026-06-17", type: "new", text: "新增 音樂計算機" },
    { date: "2026-06-01", type: "new", text: "新增 回音石模擬器" },
    { date: "2026-05-26", type: "new", text: "新增 4王65%躲彈幕練習" },
    { date: "2026-05-23", type: "new", text: "新增 4王安全屋計時" },
    { date: "2026-05-23", type: "update", text: "更新4王相關資料" },
];

export const todoItems: TodoItem[] = [
    { title: "頂裝差距", status: "in_progress" },
    { title: "更新與校正賦予資料", status: "in_progress" },
    { title: "普洛貓計算機整合", status: "planned" },
    { title: "跑商計算", status: "planned" },
    { title: "名片系統", status: "planned" },
];
