<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const features = [
    {
        icon: "Tools",
        title: "裝備製作模擬器",
        description: "模擬裝備製作流程，計算所需材料與成本",
        path: "/equipment-craft-simulator",
    },
    {
        icon: "SetUp",
        title: "裝備改造模擬器",
        description: "規劃最佳改造路線，預覽改造後的能力數值",
        path: "/weapon-upgrade-simulator",
    },
    {
        icon: "Box",
        title: "材料計算機",
        description: "精確計算製作所需材料數量與來源",
        path: "/material-simulator",
    },
    {
        icon: "Money",
        title: "裝備能力轉移費用估算",
        description: "估算能力轉移所需的金幣成本",
        path: "/transfer-simulator",
    },
    {
        icon: "MagicStick",
        title: "賦予查詢",
        description: "查詢賦予卷軸資訊、能力加成與來源",
        path: "/enchant",
    },
    {
        icon: "House",
        title: "農場模型查詢",
        description: "查詢農場模型資料與相關資訊",
        path: "/farmModel",
    },
    {
        icon: "Medal",
        title: "稱號查詢",
        description: "查詢稱號能力加成與獲取方式",
        path: "/title",
    },
    {
        icon: "Coin",
        title: "賭石小遊戲",
        description: "模擬賭石體驗，試試你的手氣",
        path: "/stone-gambling",
    },
    {
        icon: "DataAnalysis",
        title: "煉金術傷害計算器",
        description: "計算煉金術技能傷害，支援水系、火系、大蛇等",
        path: "/alchemy-calculator",
    },
    {
        icon: "Handbag",
        title: "娃娃背包查詢",
        description: "查詢娃娃背包效果、召喚重量與自動拾取分類",
        path: "/doll-bag",
    },
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

        <section class="features">
            <h2 class="section-title">功能模組</h2>
            <div class="feature-grid">
                <div
                    v-for="feature in features"
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

        <section class="info">
            <div class="info-card">
                <h3>關於本工具</h3>
                <p>
                    本工具所使用的資料皆來自玩家社群的觀察與實測，力求接近實際數值，但仍可能有誤差。
                    如有發現錯誤或建議，歡迎回報。
                </p>
                <el-button type="primary" plain @click="navigateTo('/about')">了解更多</el-button>
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
