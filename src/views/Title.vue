<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 bg-texture-dark">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="border-b border-gray-700 pb-6">
                <h1 class="text-4xl font-bold mb-2">
                    <span class="text-gradient">稱號查詢</span>
                </h1>
                <p class="text-gray-400 text-sm">查詢遊戲中的稱號資訊與能力加成</p>
            </div>

            <!-- 搜尋區域 -->
            <div class="mt-6 space-y-4">
                <!-- 搜尋模式 + 篩選設定 -->
                <div class="flex items-center gap-4">
                    <el-radio-group v-model="searchMode" size="large">
                        <el-radio value="name">關鍵字搜尋</el-radio>
                        <el-radio value="ability">依能力搜尋</el-radio>
                    </el-radio-group>

                    <el-popover placement="bottom" :width="320" trigger="click">
                        <template #reference>
                            <el-button :icon="Setting" circle />
                        </template>
                        <div class="space-y-3">
                            <h4 class="font-bold text-gray-200 mb-2">篩選設定</h4>
                            <div class="flex flex-col gap-2">
                                <el-checkbox v-model="filters.excludeObsolete">排除絕版稱號</el-checkbox>
                                <el-checkbox v-model="filters.excludeRanking">排除排名稱號</el-checkbox>
                                <el-checkbox v-model="filters.excludeHardcore">排除副本獎勵稱號</el-checkbox>
                                <el-checkbox v-model="filters.excludeTimed">排除期限稱號</el-checkbox>
                                <el-checkbox v-model="filters.excludeExclusive">排除封印碾碎相關稱號</el-checkbox>
                            </div>
                        </div>
                    </el-popover>
                </div>

                <!-- 搜尋輸入 -->
                <div class="flex gap-4">
                    <!-- 關鍵字搜尋 -->
                    <el-input
                        v-if="searchMode === 'name'"
                        v-model="searchText"
                        placeholder="搜尋稱號名稱、描述、獲得方式、效果..."
                        clearable
                        size="large"
                        class="flex-1"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                    </el-input>

                    <!-- 能力搜尋 -->
                    <el-select
                        v-if="searchMode === 'ability'"
                        v-model="selectedAbility"
                        placeholder="選擇能力類型"
                        clearable
                        filterable
                        size="large"
                        class="flex-1"
                    >
                        <el-option
                            v-for="ability in abilityOptions"
                            :key="ability.id"
                            :label="ability.name"
                            :value="ability.id"
                        />
                    </el-select>
                </div>

                <!-- 排序 + 分類 -->
                <div class="flex gap-4 items-center">
                    <div class="flex items-center gap-2" style="min-width: 200px">
                        <span class="text-sm text-gray-400 whitespace-nowrap">排序：</span>
                        <el-select v-model="sortMode" size="default" style="width: 140px">
                            <el-option label="依能力數值" value="ability" />
                            <el-option label="自訂權重" value="custom" />
                        </el-select>

                        <el-popover v-if="sortMode === 'custom'" placement="bottom" :width="400" trigger="click">
                            <template #reference>
                                <el-button :icon="Setting" circle />
                            </template>
                            <div class="space-y-3">
                                <h4 class="font-bold text-gray-200 mb-4">自訂權重設定</h4>
                                <div v-for="ability in allAbilities" :key="ability.id" class="flex items-center gap-3">
                                    <span class="text-sm text-gray-300 w-32">{{ ability.name }}</span>
                                    <el-input-number
                                        v-model="customWeights[ability.id]"
                                        :min="0"
                                        :max="100"
                                        size="small"
                                        class="flex-1"
                                    />
                                </div>
                            </div>
                        </el-popover>
                    </div>

                    <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-400 whitespace-nowrap">分類：</span>
                        <el-select v-model="typeFilter" size="default" style="width: 140px">
                            <el-option label="全部" :value="0" />
                            <el-option label="一般稱號" :value="1" />
                            <el-option label="打工稱號" :value="2" />
                            <el-option label="變身稱號" :value="4" />
                            <el-option label="寵物稱號" :value="5" />
                            <el-option label="假稱號" :value="6" />
                            <el-option label="二次稱號" :value="7" />
                        </el-select>
                    </div>
                </div>
            </div>

            <!-- 結果統計 -->
            <div class="mt-6 text-sm text-gray-400">
                找到
                <span class="text-accent font-bold">{{ filteredTitles.length }}</span>
                個稱號
            </div>

            <!-- 稱號列表 -->
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                    v-for="title in paginatedTitles"
                    :key="`${title.Type}-${title.ID}`"
                    class="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-accent/50 transition-colors"
                >
                    <!-- 稱號名稱 -->
                    <h3 class="text-lg font-bold text-accent mb-2">{{ title.DefaultName }}</h3>

                    <!-- 類型標籤 -->
                    <div class="flex gap-2 mb-3">
                        <el-tag size="small" :type="getTypeColor(title.Type)">
                            {{ getTypeName(title.Type) }}
                        </el-tag>
                        <el-tag v-if="title.Exclusive === '1'" size="small" type="danger">專屬</el-tag>
                    </div>

                    <!-- 描述 -->
                    <p v-if="title.Desc && title.Desc !== 'none'" class="text-sm text-gray-400 mb-3">
                        {{ title.Desc }}
                    </p>

                    <!-- 效果 -->
                    <div v-if="title.EffectDescription" class="mt-3 pt-3 border-t border-gray-700">
                        <h4 class="text-xs font-bold text-gray-300 mb-2">效果：</h4>
                        <div class="text-sm space-y-1">
                            <div
                                v-for="(line, idx) in parseEffectDescription(title.EffectDescription)"
                                :key="idx"
                                :class="line.startsWith('[') ? 'text-red-400' : 'text-green-400'"
                            >
                                {{ line }}
                            </div>
                        </div>
                    </div>

                    <!-- 獲得提示 -->
                    <div v-if="title.Hint && title.Hint !== 'none'" class="mt-3 pt-3 border-t border-gray-700">
                        <h4 class="text-xs font-bold text-gray-300 mb-1">獲得方式：</h4>
                        <p class="text-xs text-gray-400">{{ title.Hint }}</p>
                    </div>
                </div>
            </div>

            <!-- 分頁 -->
            <div v-if="filteredTitles.length > pageSize" class="mt-8 flex justify-center">
                <el-pagination
                    v-model:current-page="currentPage"
                    :page-size="pageSize"
                    :total="filteredTitles.length"
                    layout="prev, pager, next"
                    background
                />
            </div>

            <!-- 空狀態 -->
            <div
                v-if="filteredTitles.length === 0"
                class="mt-12 text-center text-gray-500 py-12 bg-gray-800 rounded-lg"
            >
                <p class="text-lg">找不到符合條件的稱號</p>
                <p class="text-sm mt-2">請調整搜尋條件或篩選設定</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Setting, Search } from "@element-plus/icons-vue";
import titleData from "../data/title.json";

// 能力資料類型
interface TitleAbility {
    id: string;
    value: number;
}

// 稱號資料類型
interface Title {
    ID: string;
    Type: string;
    Exclusive: string;
    Duration: string;
    DefaultName: string;
    MaleName: string;
    FemaleName: string;
    UniName: string;
    Desc: string;
    Hint: string;
    EffectDescription: string;
    abilities: TitleAbility[]; // 能力陣列
    __locale: "!korea" | "korea";
}

// 能力搜尋選項（顯示在下拉選單）
const abilityOptions = [
    { id: "AttMax", name: "最大傷害" },
    { id: "MagicAttack", name: "魔法攻擊力" },
    { id: "musicbuff_bonus", name: "音樂增益效果" },
    { id: "bonusdamage", name: "額外傷害" },
    { id: "criticaldamage", name: "暴擊傷害" },
    { id: "fire_alchemy_damage", name: "火屬性煉金術傷害" },
    { id: "water_alchemy_damage", name: "水屬性煉金術傷害" },
    { id: "earth_alchemy_damage", name: "土屬性煉金術傷害" },
    { id: "wind_alchemy_damage", name: "風屬性煉金術傷害" },
    { id: "Prot", name: "保護" },
];

// 完整能力列表（用於自訂權重設定）
const allAbilities = [
    { id: "Str", name: "力量" },
    { id: "Int", name: "智力" },
    { id: "Dex", name: "敏捷" },
    { id: "Will", name: "意志" },
    { id: "Luck", name: "幸運" },
    { id: "LifeMax", name: "最大生命值" },
    { id: "ManaMax", name: "最大魔力" },
    { id: "StaminaMax", name: "最大耐力" },
    { id: "AttMin", name: "最小傷害" },
    { id: "AttMax", name: "最大傷害" },
    { id: "MagicAttack", name: "魔法攻擊力" },
    { id: "bonusdamage", name: "額外傷害" },
    { id: "criticaldamage", name: "暴擊傷害" },
    { id: "Crit", name: "暴擊率" },
    { id: "Def", name: "防禦" },
    { id: "Prot", name: "保護" },
    { id: "Hurry", name: "移動速度" },
    { id: "musicbuff_bonus", name: "音樂增益效果" },
    { id: "musicbuff_duration", name: "音樂持續時間" },
];

// 狀態
const searchMode = ref<"name" | "ability">("name");
const searchText = ref("");
const selectedAbility = ref("");
const sortMode = ref<"ability" | "custom">("ability");
const typeFilter = ref(0); // 0=全部, 1=1稱號, 2=2稱號
const currentPage = ref(1);
const pageSize = 30;

// 篩選設定
const filters = ref({
    excludeObsolete: false, // 絕版稱號
    excludeRanking: false, // 排名/賽季稱號
    excludeHardcore: false, // 副本獎勵稱號（已移除的副本獎勵）
    excludeTimed: true, // 期限稱號（包含 Duration > 0 和特定 ID）
    excludeExclusive: true, // 封印碾碎相關稱號（每個伺服器只有一位）
});

// 自訂權重（使用 title.json 中的能力 ID 格式）
const customWeights = ref<Record<string, number>>({
    // LifeMax: 0,
    // ManaMax: 0,
    // StaminaMax: 0,
    // AttMin: 0,
    AttMax: 1,
    MagicAttack: 0,
    bonusdamage: 10,
    criticaldamage: 5,
    Def: 0,
    Prot: 0,
    Hurry: 0,
    musicbuff_bonus: 1,
    musicbuff_duration: 0,
    fire_alchemy_damage: 0,
    water_alchemy_damage: 0,
    earth_alchemy_damage: 0,
    wind_alchemy_damage: 0,
    Str: 0,
    Int: 0,
    Dex: 0,
    Will: 0,
    Luck: 0,
    // todo 技能權重  算法可能很複雜...
});

// 排除列表分類

// 絕版稱號（已無法獲得）
const obsoleteTitleIds = [
    "18153", // G27競速排名1
    "18154", // G27競速排名2
    "18155", // G27競速排名3
    "18158", // G27競速排名4
    "16028", // 變異體全服第一首通稱號
];

// 排名/賽季獎勵稱號（每月或賽季更新）
const rankingTitleIds = [
    // 法默思挑戰排名稱號
    "5011", // 1
    "5012", // 2
    "5013", // 3
    "5014", // 4
    "5015", // 5
    "5016", // 6
    "5017", // 7
    "5018", // 8
    "5019", // 9
    "5020", // 10
    "5021", // 11~50
    "5022", // 51~100
    // 小吉 VH 排名稱號
    "11015", // 1
    "11016", // 2
    "11017", // 3
    // 法默思第1
    "16032",
    // 貿易前100
    "16033",
];

// 副本獎勵稱號（已移除的副本，但老手玩家有很多兌換券）
const hardcoreTitleIds = [
    "5004", // 副本獎勵(已移除)
    "5005", // 副本獎勵(已移除)
    "5006", // 副本獎勵(已移除)
    // 這些稱號有限時但老手玩家有很多兌換券，接近常駐
];

// 期限稱號（沒設定 Duration 但實際有期限的）
const timedTitleIds = ["9053", "9054", "9055", "9056", "9057", "9058"];

// 稱號資料
const titles = computed<Title[]>(() => {
    return (titleData.data as Title[]).filter((title) => title.DefaultName !== "none" && title["__locale"] !== "korea");
});

// 解析效果描述
const parseEffectDescription = (description: string): string[] => {
    if (!description) return [];
    return description.split("\\n").filter((line) => line.trim());
};

// 計算稱號總分（自訂權重）
const calculateTitleScore = (title: Title): number => {
    let totalScore = 0;

    if (!title.abilities || title.abilities.length === 0) return 0;

    for (const [abilityId, weight] of Object.entries(customWeights.value)) {
        if (weight === 0) continue;

        const ability = title.abilities.find((a) => a.id === abilityId);
        if (ability) {
            totalScore += ability.value * weight;
        }
    }

    return totalScore;
};

// 取得類型顯示名稱
const getTypeName = (type: string): string => {
    const typeNames: Record<string, string> = {
        "1": "一般稱號",
        "2": "打工稱號",
        "3": "一般稱號", // 一般2稱號 - 與Type 1同類別
        "4": "變身稱號",
        "5": "寵物稱號",
        "6": "假稱號",
        "7": "二次稱號",
    };
    return typeNames[type] || `Type ${type}`;
};

// 取得類型標籤顏色
const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
        "1": "success", // 一般 - green
        "2": "warning", // 打工 - orange
        "3": "success", // 一般2 - green (與Type 1同色)
        "4": "danger", // 變身 - red
        "5": "", // 寵物 - default
        "6": "info", // 假 - blue
        "7": "success", // 二次 - green
    };
    return typeColors[type] || "";
};

// 篩選後的稱號
const filteredTitles = computed(() => {
    let result = titles.value;

    // 排除不應顯示的稱號
    result = result.filter((title) => {
        // 1. 排除怪物專用稱號
        if (title.Hint === "專用怪物稱號" || title.Desc === "專用怪物稱號") {
            return false;
        }

        // 2. 排除內容包含 _LT 的遺失稱號
        if (
            title.DefaultName.includes("_LT") ||
            title.Desc.includes("_LT") ||
            title.Hint.includes("_LT") ||
            title.EffectDescription.includes("_LT")
        ) {
            return false;
        }

        // 3. 排除測試用稱號 (GM, devCat)
        if (title.DefaultName.includes("GM") || title.DefaultName.includes("dev") || title.DefaultName === "") {
            return false;
        }

        // 4. 排除韓文稱號 (檢查是否包含韓文字元)
        const koreanRegex = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]/;
        if (
            koreanRegex.test(title.DefaultName) ||
            koreanRegex.test(title.Desc) ||
            koreanRegex.test(title.Hint) ||
            koreanRegex.test(title.EffectDescription)
        ) {
            return false;
        }
        return true;
    });

    // 類型篩選 (Type 1 和 Type 3 視為同類)
    if (typeFilter.value !== 0) {
        if (typeFilter.value === 1) {
            result = result.filter((title) => title.Type === "1" || title.Type === "3");
        } else {
            result = result.filter((title) => title.Type === String(typeFilter.value));
        }
    }

    // 篩選器篩選

    // 排除絕版稱號
    if (filters.value.excludeObsolete) {
        result = result.filter((title) => !obsoleteTitleIds.includes(title.ID));
    }

    // 排除排名/賽季稱號
    if (filters.value.excludeRanking) {
        result = result.filter((title) => !rankingTitleIds.includes(title.ID));
    }

    // 排除高難度稱號
    if (filters.value.excludeHardcore) {
        result = result.filter((title) => !hardcoreTitleIds.includes(title.ID));
    }

    // 排除期限稱號 (Duration > 0 或特定 ID)
    if (filters.value.excludeTimed) {
        result = result.filter((title) => {
            // 排除有設定 Duration 的稱號
            if (title.Duration !== "0") return false;
            // 排除沒設定 Duration 但實際有期限的稱號
            if (timedTitleIds.includes(title.ID)) return false;
            return true;
        });
    }

    // 排除專屬稱號 (Exclusive = "1")
    if (filters.value.excludeExclusive) {
        result = result.filter((title) => title.Exclusive !== "1");
    }

    // 搜尋篩選
    if (searchMode.value === "name" && searchText.value) {
        const keyword = searchText.value.toLowerCase();
        result = result.filter((title) => {
            // 搜尋所有文本欄位
            return (
                title.DefaultName.toLowerCase().includes(keyword) ||
                title.MaleName.toLowerCase().includes(keyword) ||
                title.FemaleName.toLowerCase().includes(keyword) ||
                title.UniName.toLowerCase().includes(keyword) ||
                title.Desc.toLowerCase().includes(keyword) ||
                title.Hint.toLowerCase().includes(keyword) ||
                title.EffectDescription.toLowerCase().includes(keyword)
            );
        });
    } else if (searchMode.value === "ability" && selectedAbility.value) {
        result = result.filter((title) => {
            // 使用 abilities 陣列搜尋
            if (!title.abilities || title.abilities.length === 0) return false;
            return title.abilities.some((ability) => ability.id === selectedAbility.value);
        });
    }

    // 排序
    if (sortMode.value === "custom") {
        result = [...result].sort((a, b) => calculateTitleScore(b) - calculateTitleScore(a));
    } else if (searchMode.value === "ability" && selectedAbility.value) {
        // 依照選擇的能力數值排序
        result = [...result].sort((a, b) => {
            const abilityA = a.abilities?.find((ability) => ability.id === selectedAbility.value);
            const abilityB = b.abilities?.find((ability) => ability.id === selectedAbility.value);
            const valueA = abilityA ? abilityA.value : 0;
            const valueB = abilityB ? abilityB.value : 0;
            return Math.abs(valueB) - Math.abs(valueA);
        });
    }

    return result;
});

// 分頁後的稱號
const paginatedTitles = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return filteredTitles.value.slice(start, end);
});
</script>

<style scoped>
.text-gradient {
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.bg-texture-dark {
    background-image: radial-gradient(rgba(251, 191, 36, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
}
</style>
