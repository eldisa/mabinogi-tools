<script setup lang="ts">
import { useRouter } from "vue-router";
import { announcements } from "../data/changelog";

const router = useRouter();

const latestAnnouncements = announcements.slice(0, 3);

const typeLabel: Record<string, string> = { new: "新功能", fix: "修正", update: "更新" };
const typeClass: Record<string, string> = { new: "badge-new", fix: "badge-fix", update: "badge-update" };

const groups = [
    {
        label: "裝備",
        items: [
            { icon: "SetUp",    title: "裝備改造模擬器",   description: "規劃最佳改造路線，預覽改造後的能力數值",               path: "/weapon-upgrade-simulator" },
            { icon: "Box",      title: "材料計算機",       description: "精確計算製作所需材料數量與來源",                       path: "/material-simulator" },
            { icon: "Money",    title: "裝備繼承費用估算", description: "估算能力轉移所需的金幣成本",                           path: "/transfer-simulator" },
        ],
    },
    {
        label: "資料查詢",
        items: [
            { icon: "MagicStick", title: "賦予查詢",     description: "查詢賦予詞條資料",                                     path: "/enchant" },
            { icon: "Medal",      title: "稱號查詢",     description: "查詢稱號能力加成與獲取方式",                           path: "/title" },
            { icon: "Handbag",    title: "娃娃背包查詢", description: "查詢娃娃背包效果、召喚重量與自動拾取分類",             path: "/doll-bag" },
            { icon: "House",      title: "農場模型查詢", description: "查詢農場模型資料與相關資訊",                           path: "/farmModel" },
            { icon: "MagicStick", title: "魔法陣查詢",   description: "查詢各職業魔法陣（強化）的效果與類型",                 path: "/magic-circle" },
            { icon: "MagicStick", title: "符文",         description: "查詢各祕法的符文組合技與詞條效果",                     path: "/ogham" },
        ],
    },
    {
        label: "機率模擬(要拚)",
        items: [
            { icon: "Coin",       title: "布里萊赫硬幣模擬器", description: "模擬製作布里萊赫硬幣的素質分布，支援目標設定與自動製作", path: "/brilaherec" },
            { icon: "Coin",       title: "賭石小遊戲",         description: "模擬賭石體驗，試試你的手氣",                           path: "/stone-gambling" },
            { icon: "MagicStick", title: "細工模擬器",         description: "模擬細工洗詞條所需次數與費用，支援前綴後綴分別設定目標", path: "/reforge" },
            { icon: "MagicStick", title: "聖水模擬器",         description: "模擬聖水洗屬性所需次數，支援目標屬性設定與自動模擬",   path: "/holy-water" },
            { icon: "Star",       title: "回音石模擬器",       description: "模擬回音石覺醒詞條，支援目標設定與連續覺醒，含打磨石機制", path: "/echostone-simulator" },
            { icon: "MagicStick", title: "符文模擬器",         description: "模擬符文詞條抽取，支援鎖定、抽到目標為止與花費統計",   path: "/ogham-simulator" },
            { icon: "Present",    title: "轉蛋模擬器",         description: "貼上機率表模擬抽取，支援多抽、抽到目標為止與統計",     path: "/gacha-simulator" },
        ],
    },
    {
        label: "戰鬥 / 分析",
        items: [
            { icon: "TrendCharts",  title: "頂裝差距",     description: "比較與頂裝之間的差距",                   path: "/gear-gap" },
            { icon: "Headset",      title: "音樂計算機",   description: "計算音樂技能的傷害加成與樂器配置",       path: "/music-calculator" },
        ],
    },
    {
        label: "副本練習",
        items: [
            { icon: "Trophy", title: "1王機制練習",   description: "練習 G27 第一王 Petrak 的機制與走位", path: "/raid-petrak" },
            { icon: "Trophy", title: "2關機制練習",   description: "練習 G27 第二關的機制",               path: "/raid-stage2" },
            { icon: "Trophy", title: "4王安全屋計時", description: "計時 G27 四王安全屋的輪轉節奏",       path: "/boss-timer" },
            { icon: "Trophy", title: "4王65%躲彈幕", description: "練習 G27 四王 65% 階段的彈幕走位",    path: "/raid-boss4-dodge" },
            { icon: "Trophy", title: "破防練習",     description: "練習維持破防條件同時在場，掌握重施時機", path: "/armor-break" },
        ],
    },
];

const abandonedFeatures = [
    { icon: "DataAnalysis", title: "煉金術傷害計算器", description: "等待大佬提供公式和資料", path: "/alchemy-calculator" },
    { icon: "Lightning",    title: "魔法傷害計算器",   description: "等待大佬提供公式和資料", path: "/magic-calculator" },
];

const navigateTo = (path: string) => {
    router.push(path);
};
</script>

<template>
    <div class="home-container">
        <section class="hero">
            <h1 class="title">
                <span class="text-gradient">瑪奇小工具</span>
            </h1>
            <p class="subtitle">Mabinogi Tools</p>
            <p class="description">為瑪奇玩家打造的實用工具集合，幫助你更好地規劃裝備與資源</p>
        </section>

        <section class="announcements">
            <div class="announcements-header">
                <h2 class="section-title">最新公告</h2>
                <button class="view-all" @click="router.push('/changelog')">查看全部 →</button>
            </div>
            <ul class="announcement-list">
                <li v-for="(item, i) in latestAnnouncements" :key="i" class="announcement-item">
                    <span class="ann-date">{{ item.date }}</span>
                    <span :class="['badge', typeClass[item.type]]">{{ typeLabel[item.type] }}</span>
                    <span class="ann-text">{{ item.text }}</span>
                </li>
            </ul>
        </section>

        <section v-for="group in groups" :key="group.label" class="features">
            <h2 class="section-title">{{ group.label }}</h2>
            <div class="feature-grid">
                <div
                    v-for="feature in group.items"
                    :key="feature.path"
                    class="feature-card"
                    @click="navigateTo(feature.path)"
                >
                    <div class="feature-icon">
                        <el-icon :size="32">
                            <component :is="feature.icon" />
                        </el-icon>
                    </div>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-description">{{ feature.description }}</p>
                </div>
            </div>
        </section>

        <section class="features abandoned-section">
            <h2 class="section-title abandoned-title">棄坑中 💤</h2>
            <div class="feature-grid">
                <div
                    v-for="feature in abandonedFeatures"
                    :key="feature.path"
                    class="feature-card abandoned-card"
                >
                    <div class="feature-icon abandoned-icon">
                        <el-icon :size="32">
                            <component :is="feature.icon" />
                        </el-icon>
                    </div>
                    <h3 class="feature-title">{{ feature.title }}</h3>
                    <p class="feature-description abandoned-desc">{{ feature.description }}</p>
                </div>
            </div>
        </section>

        <section class="info">
            <div class="info-card">
                <h3>關於本工具</h3>
                <p>
                    本工具所使用的資料皆來自玩家社群的觀察與實測，力求接近實際數值，但仍可能有誤差。
                    如有發現錯誤或建議，歡迎回報。
                </p>
                <div class="info-actions">
                    <el-button type="primary" plain @click="navigateTo('/about')">了解更多</el-button>
                    <el-button plain @click="navigateTo('/changelog')">更新紀錄</el-button>
                    <el-button plain @click="navigateTo('/sponsor')">💙 贊助支持</el-button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.hero {
    text-align: center;
    padding: 3rem 1rem;
}

.title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.text-gradient {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.subtitle {
    font-size: 1.25rem;
    color: var(--color-text-secondary, #9ca3af);
    margin-bottom: 1rem;
}

.description {
    font-size: 1.1rem;
    color: var(--color-text-secondary, #9ca3af);
    max-width: 600px;
    margin: 0 auto;
}

/* 公告區 */
.announcements {
    margin-top: 2rem;
}

.announcements-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.view-all {
    background: none;
    border: none;
    color: #fbbf24;
    font-size: 0.85rem;
    cursor: pointer;
    padding: 0;
}

.view-all:hover {
    text-decoration: underline;
}

.announcement-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.announcement-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 8px;
    font-size: 0.875rem;
}

.ann-date {
    color: #6b7280;
    font-size: 0.8rem;
    flex-shrink: 0;
    font-variant-numeric: tabular-nums;
}

.badge {
    flex-shrink: 0;
    padding: 0.125rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 600;
}

.badge-new    { background: #14532d; color: #4ade80; }
.badge-fix    { background: #450a0a; color: #f87171; }
.badge-update { background: #422006; color: #fbbf24; }

.ann-text {
    color: #e5e7eb;
}

.features {
    margin-top: 3rem;
}

.section-title {
    font-size: 1.5rem;
    color: var(--color-text-primary, #f9fafb);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-gold-400, #fbbf24);
    display: inline-block;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.feature-card {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
}

.feature-card:hover {
    border-color: var(--color-gold-400, #fbbf24);
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(251, 191, 36, 0.15);
}

.feature-icon {
    color: var(--color-gold-400, #fbbf24);
    margin-bottom: 1rem;
}

.feature-title {
    font-size: 1.2rem;
    color: var(--color-text-primary, #f9fafb);
    margin-bottom: 0.5rem;
}

.feature-description {
    font-size: 0.9rem;
    color: var(--color-text-secondary, #9ca3af);
    line-height: 1.5;
}

.abandoned-section {
    margin-top: 2.5rem;
    opacity: 0.65;
}

.abandoned-title {
    border-bottom-color: #4b5563;
    color: #6b7280;
}

.abandoned-card {
    border-style: dashed;
    cursor: default;
}

.abandoned-card:hover {
    border-color: #4b5563;
    transform: none;
    box-shadow: none;
}

.abandoned-icon {
    color: #4b5563;
}

.abandoned-desc {
    color: #6b7280;
    font-style: italic;
}

.info {
    margin-top: 3rem;
}

.info-card {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
}

.info-card h3 {
    font-size: 1.25rem;
    color: var(--color-text-primary, #f9fafb);
    margin-bottom: 1rem;
}

.info-card p {
    color: var(--color-text-secondary, #9ca3af);
    margin-bottom: 1.5rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
}

.info-actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
}

@media (max-width: 768px) {
    .home-container {
        padding: 1rem;
    }

    .hero {
        padding: 2rem 0.5rem;
    }

    .title {
        font-size: 2rem;
    }

    .subtitle {
        font-size: 1rem;
    }

    .description {
        font-size: 1rem;
    }

    .feature-grid {
        grid-template-columns: 1fr;
    }
}
</style>
