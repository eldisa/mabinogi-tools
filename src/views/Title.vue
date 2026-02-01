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
                <!-- 篩選設定按鈕 -->
                <div class="flex items-center gap-4">
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

                <!-- 整合式搜尋輸入 + 能力 Chip -->
                <div class="space-y-2">
                    <!-- 能力 Chip -->
                    <div v-if="activeAbilityKey" class="flex items-center gap-2">
                        <el-tag closable type="success" size="large" @close="clearAbility">
                            能力：{{ abilitiesMap[activeAbilityKey] }}
                        </el-tag>
                    </div>

                    <!-- Autocomplete 搜尋框 -->
                    <el-autocomplete
                        v-model="searchInput"
                        :fetch-suggestions="handleSuggestions"
                        :trigger-on-focus="false"
                        placeholder="搜尋稱號或能力（例如：最大傷害、暴擊）"
                        clearable
                        size="large"
                        class="w-full"
                        @select="handleAbilitySelect"
                        @keydown.enter="handleEnter"
                        @input="handleInput"
                    >
                        <template #prefix>
                            <el-icon><Search /></el-icon>
                        </template>
                        <template #default="{ item }">
                            <div class="flex items-center justify-between">
                                <span>{{ item.value }}</span>
                                <el-tag size="small" type="info">能力</el-tag>
                            </div>
                        </template>
                    </el-autocomplete>
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
import { ref, computed, watch } from "vue";
import { Setting, Search } from "@element-plus/icons-vue";
import titleData from "../data/title.json";
import { abilitiesMap, reverseAbilitiesMap } from "../data/abilities";

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
    abilities: TitleAbility[];
    __locale: "!korea" | "korea";
}

// 建議項目類型
interface SuggestionItem {
    value: string; // 顯示名稱
    key: string;   // canonical key
}

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

// === 整合式搜尋狀態 ===
const searchInput = ref("");
const activeAbilityKey = ref<string | undefined>(undefined);

// === 其他狀態 ===
const sortMode = ref<"ability" | "custom">("ability");
const typeFilter = ref(0);
const currentPage = ref(1);
const pageSize = 30;

// 篩選設定
const filters = ref({
    excludeObsolete: false,
    excludeRanking: false,
    excludeHardcore: false,
    excludeTimed: true,
    excludeExclusive: true,
});

// 自訂權重
const customWeights = ref<Record<string, number>>({
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
});

// 排除列表
const obsoleteTitleIds = [
    "18153", "18154", "18155", "18158", "16028",
];

const rankingTitleIds = [
    "5011", "5012", "5013", "5014", "5015", "5016", "5017", "5018", "5019", "5020",
    "5021", "5022", "11015", "11016", "11017", "16032", "16033",
];

const hardcoreTitleIds = ["5004", "5005", "5006"];

const timedTitleIds = [
    "9053", "9054", "9055", "9056", "9057", "9058",
    "9088", "9089", "9090",
    "9150", "9151", "9152",
];

// === 能力匹配邏輯 ===
interface MatchResult {
    level: 1 | 2 | 3 | null;
    key?: string;
    candidates: Array<{ key: string; name: string; isUnique: boolean }>;
}

// 能力匹配函數
const matchAbility = (input: string): MatchResult => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
        return { level: null, candidates: [] };
    }

    const candidates: Array<{ key: string; name: string }> = [];

    // 檢查所有 reverseAbilitiesMap 的 key (alias)
    for (const alias of Object.keys(reverseAbilitiesMap)) {
        // Level 1: 完全匹配
        if (alias === trimmedInput) {
            const canonicalKey = reverseAbilitiesMap[alias];
            return {
                level: 1,
                key: canonicalKey,
                candidates: [{ key: canonicalKey, name: alias, isUnique: true }],
            };
        }

        // Level 2 & 3: 部分匹配
        if (alias.includes(trimmedInput)) {
            candidates.push({
                key: reverseAbilitiesMap[alias],
                name: alias,
            });
        }
    }

    // 去重（同一個 canonical key 可能有多個 alias）
    const uniqueCandidates = Array.from(
        new Map(candidates.map(c => [c.key, c])).values()
    );

    if (uniqueCandidates.length === 0) {
        return { level: null, candidates: [] };
    }

    if (uniqueCandidates.length === 1) {
        // Level 2: 唯一候選
        return {
            level: 2,
            candidates: uniqueCandidates.map(c => ({ ...c, isUnique: true })),
        };
    }

    // Level 3: 多候選
    return {
        level: 3,
        candidates: uniqueCandidates.map(c => ({ ...c, isUnique: false })),
    };
};

// Debounce timer
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// 處理建議（autocomplete fetch-suggestions）
const handleSuggestions = (queryString: string, cb: (suggestions: SuggestionItem[]) => void) => {
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
        const trimmedInput = queryString.trim();
        if (!trimmedInput) {
            cb([]);
            return;
        }

        const matchResult = matchAbility(trimmedInput);

        if (matchResult.level === 1) {
            // Level 1: 完全匹配 - 自動確認
            activeAbilityKey.value = matchResult.key;
            searchInput.value = "";
            cb([]);
        } else if (matchResult.candidates.length > 0) {
            // Level 2 or 3: 顯示建議
            const suggestions = matchResult.candidates.slice(0, 10).map(c => ({
                value: c.name,
                key: c.key,
            }));
            cb(suggestions);
        } else {
            // 無匹配 - 關鍵字搜尋
            cb([]);
        }
    }, 250); // 250ms debounce
};

// 處理輸入
const handleInput = (value: string) => {
    // 輸入時不做任何自動確認，等 debounce 或 Enter
};

// 處理選擇建議
const handleAbilitySelect = (item: SuggestionItem) => {
    activeAbilityKey.value = item.key;
    searchInput.value = "";
};

// 處理 Enter
const handleEnter = () => {
    // 這個會由 autocomplete 的 select 事件處理
    // 如果沒有建議項目，就維持關鍵字搜尋
};

// 清除能力 chip
const clearAbility = () => {
    activeAbilityKey.value = undefined;
    // 不清除 searchInput
};

// 監聽 activeAbilityKey 變化，立即觸發搜尋
watch(activeAbilityKey, () => {
    currentPage.value = 1; // 重置頁碼
});

// === 稱號資料 ===
const titles = computed<Title[]>(() => {
    return (titleData.data as Title[]).filter(
        (title) => title.DefaultName !== "none" && title["__locale"] !== "korea"
    );
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
        "3": "一般稱號",
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
        "1": "success",
        "2": "warning",
        "3": "success",
        "4": "danger",
        "5": "",
        "6": "info",
        "7": "success",
    };
    return typeColors[type] || "";
};

// 篩選後的稱號
const filteredTitles = computed(() => {
    let result = titles.value;

    // 自動排除
    result = result.filter((title) => {
        if (title.Hint === "專用怪物稱號" || title.Desc === "專用怪物稱號") return false;

        const monsterTitleIds = ["11007"];
        if (monsterTitleIds.includes(title.ID)) return false;

        if (
            title.DefaultName.includes("_LT") ||
            title.Desc.includes("_LT") ||
            title.Hint.includes("_LT") ||
            title.EffectDescription.includes("_LT")
        ) {
            return false;
        }

        if (title.DefaultName.includes("GM") || title.DefaultName.includes("dev") || title.DefaultName === "") {
            return false;
        }

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

    // 類型篩選
    if (typeFilter.value !== 0) {
        if (typeFilter.value === 1) {
            result = result.filter((title) => title.Type === "1" || title.Type === "3");
        } else {
            result = result.filter((title) => title.Type === String(typeFilter.value));
        }
    }

    // 篩選器
    if (filters.value.excludeObsolete) {
        result = result.filter((title) => !obsoleteTitleIds.includes(title.ID));
    }
    if (filters.value.excludeRanking) {
        result = result.filter((title) => !rankingTitleIds.includes(title.ID));
    }
    if (filters.value.excludeHardcore) {
        result = result.filter((title) => !hardcoreTitleIds.includes(title.ID));
    }
    if (filters.value.excludeTimed) {
        result = result.filter((title) => {
            if (title.Duration !== "0") return false;
            if (timedTitleIds.includes(title.ID)) return false;
            return true;
        });
    }
    if (filters.value.excludeExclusive) {
        result = result.filter((title) => title.Exclusive !== "1");
    }

    // Step 1: 能力篩選
    if (activeAbilityKey.value) {
        result = result.filter((title) => {
            if (!title.abilities || title.abilities.length === 0) return false;
            return title.abilities.some((ability) => ability.id === activeAbilityKey.value);
        });
    }

    // Step 2: 關鍵字篩選
    const trimmedInput = searchInput.value.trim();
    if (trimmedInput) {
        const keyword = trimmedInput.toLowerCase();
        result = result.filter((title) => {
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
    }

    // Step 3: 排序
    if (sortMode.value === "custom") {
        result = [...result].sort((a, b) => calculateTitleScore(b) - calculateTitleScore(a));
    } else if (activeAbilityKey.value) {
        // 依該能力數值排序
        result = [...result].sort((a, b) => {
            const abilityA = a.abilities?.find((ability) => ability.id === activeAbilityKey.value);
            const abilityB = b.abilities?.find((ability) => ability.id === activeAbilityKey.value);
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
</style>
