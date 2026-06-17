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
    { date: "2026-06-18", type: "new",    text: "新增 Sidebar 分類群組，支援折疊" },
    { date: "2026-06-18", type: "update", text: "首頁重整，依分類顯示功能模組" },
    { date: "2026-06-18", type: "new",    text: "新增 4王65%躲彈幕練習" },
    { date: "2026-06-18", type: "fix",    text: "材料計算機新增價格匯出/匯入功能" },
    { date: "2026-06-18", type: "update", text: "頂裝差距：新增種族與變身、祕法武器限制、聖水欄位" },
    { date: "2026-06-18", type: "update", text: "娃娃背包查詢：新增排序 label 及效果/重量徽章" },
];

export const todoItems: TodoItem[] = [
    { title: "公告與 Todo 頁面", status: "in_progress" },
];
