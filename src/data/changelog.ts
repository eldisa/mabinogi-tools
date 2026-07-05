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
