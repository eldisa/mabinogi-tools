<script setup lang="ts">
import { announcements, todoItems } from "../data/changelog";

const typeLabel: Record<string, string> = {
    new:    "新功能",
    fix:    "修正",
    update: "更新",
};

const typeClass: Record<string, string> = {
    new:    "badge-new",
    fix:    "badge-fix",
    update: "badge-update",
};

const statusLabel: Record<string, string> = {
    planned:     "計畫中",
    in_progress: "進行中",
};

const statusClass: Record<string, string> = {
    planned:     "status-planned",
    in_progress: "status-in-progress",
};
</script>

<template>
    <div class="changelog-container">
        <section class="hero">
            <h1 class="title">更新紀錄</h1>
            <p class="subtitle">功能新增、修正與調整</p>
        </section>

        <section class="section">
            <h2 class="section-title">公告</h2>
            <ul class="announcement-list">
                <li v-for="(item, i) in announcements" :key="i" class="announcement-item">
                    <span class="date">{{ item.date }}</span>
                    <span :class="['badge', typeClass[item.type]]">{{ typeLabel[item.type] }}</span>
                    <span class="text">{{ item.text }}</span>
                </li>
            </ul>
        </section>

        <section class="section">
            <h2 class="section-title">Todo / 許願清單</h2>
            <p class="hint">有新功能想法？歡迎透過 Discord 或
                <a href="https://github.com/eldisa/mabinogi-tools/issues" target="_blank" rel="noopener">GitHub Issues</a>
                告知。
            </p>
            <ul class="todo-list">
                <li v-for="(item, i) in todoItems" :key="i" class="todo-item">
                    <span :class="['status', statusClass[item.status]]">{{ statusLabel[item.status] }}</span>
                    <span class="text">{{ item.title }}</span>
                </li>
            </ul>
        </section>
    </div>
</template>

<style scoped>
.changelog-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    padding: 2rem 1rem 1.5rem;
}

.title {
    font-size: 2rem;
    font-weight: bold;
    color: #fbbf24;
    margin-bottom: 0.5rem;
}

.subtitle {
    color: #9ca3af;
}

.section {
    margin-top: 2.5rem;
}

.section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #f9fafb;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #fbbf24;
    display: inline-block;
    margin-bottom: 1.25rem;
}

.hint {
    font-size: 0.875rem;
    color: #9ca3af;
    margin-bottom: 1rem;
}

.hint a {
    color: #fbbf24;
    text-decoration: none;
}

.hint a:hover {
    text-decoration: underline;
}

/* Announcements */
.announcement-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.announcement-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    font-size: 0.9rem;
}

.date {
    color: #6b7280;
    font-size: 0.8rem;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
}

.badge {
    flex-shrink: 0;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge-new    { background: #14532d; color: #4ade80; }
.badge-fix    { background: #450a0a; color: #f87171; }
.badge-update { background: #422006; color: #fbbf24; }

.text {
    color: #e5e7eb;
}

/* Todo */
.todo-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.todo-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    background: #1f2937;
    border: 1px solid #374151;
    border-radius: 8px;
    font-size: 0.9rem;
}

.status {
    flex-shrink: 0;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.status-planned     { background: #1e3a5f; color: #93c5fd; }
.status-in-progress { background: #3b1f5e; color: #c4b5fd; }

@media (max-width: 640px) {
    .changelog-container { padding: 1rem; }
    .announcement-item, .todo-item { flex-wrap: wrap; }
    .date { width: 100%; }
}
</style>
