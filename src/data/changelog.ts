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
