<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
        <div class="enchant-notice">
            🚧 施工中，資料待更新｜⚠️ 作者沒動力更新，沒用的捲那麼多，反正大家也就用那些而已
        </div>
        <div class="max-w-6xl mx-auto">
            <header class="text-center pt-8 pb-4">
                <h1 class="text-4xl sm:text-5xl font-bold mb-2 tracking-wide font-serif drop-shadow-lg">
                    <span class="inline-block relative text-gradient">
                        <svg
                            class="w-8 h-8 sm:w-10 sm:h-10 text-accent absolute -left-12 top-1/2 -translate-y-1/2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h8a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-8a.5.5 0 01-.5-.5V8zM10 5a1 1 0 00-1 1v1a1 1 0 002 0V6a1 1 0 00-1-1z"
                            />
                        </svg>
                        魔力賦予
                    </span>
                </h1>
                <p class="text-lg text-gray-400 mt-4 font-sans">賦予裝備能力。數值要抽，上爛要抽，你的$$還夠嗎</p>
            </header>

            <el-tabs v-model="activeTab" class="enchant-tabs mt-6" type="border-card">
                <el-tab-pane label="查詢" name="search">
                    <div class="space-y-6 pt-4">
                        <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                            <div class="mb-6 border-b border-gray-700 pb-4">
                                <h2 class="text-2xl font-bold text-accent">查詢條件</h2>
                            </div>

                            <el-form label-width="140px" label-position="left">
                                <el-form-item label="搜尋模式">
                                    <el-radio-group v-model="selectedCondition">
                                        <el-radio label="依名稱搜尋" value="search" />
                                        <el-radio label="依能力搜尋" value="ability" />
                                        <el-radio label="依副本搜尋" value="raid" />
                                    </el-radio-group>
                                </el-form-item>

                                <!-- 依名稱搜尋 -->
                                <el-form-item label="賦予名稱" v-show="selectedCondition === 'search'">
                                    <el-input
                                        v-model="searchName"
                                        placeholder="請輸入賦予名稱關鍵字"
                                        clearable
                                        style="width: 300px"
                                    />
                                </el-form-item>

                                <!-- 依能力搜尋 -->
                                <el-form-item label="選擇能力" v-show="selectedCondition === 'ability'">
                                    <el-select
                                        v-model="searchAbility"
                                        placeholder="請選擇能力"
                                        clearable
                                        filterable
                                        style="width: 240px"
                                    >
                                        <el-option
                                            v-for="ability in selectableAbility"
                                            :key="ability"
                                            :label="abilitiesMap[ability] || ability"
                                            :value="ability"
                                        />
                                    </el-select>
                                </el-form-item>

                                <el-form-item
                                    label="數值條件"
                                    v-show="selectedCondition === 'ability' && searchAbility"
                                >
                                    <div class="flex gap-2 items-center">
                                        <el-select v-model="searchValueOperator" style="width: 120px">
                                            <el-option label="大於等於" value="gte" />
                                            <el-option label="小於等於" value="lte" />
                                            <el-option label="等於" value="eq" />
                                        </el-select>
                                        <el-input-number
                                            v-model="searchValue"
                                            :min="-999"
                                            :max="999"
                                            style="width: 150px"
                                        />
                                    </div>
                                </el-form-item>

                                <!-- 依副本搜尋 -->
                                <el-form-item label="選擇副本" v-show="selectedCondition === 'raid'">
                                    <el-select v-model="selectedRaid" placeholder="請選擇副本" style="width: 300px">
                                        <el-option
                                            v-for="item in raidOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value"
                                        />
                                    </el-select>
                                </el-form-item>

                                <!-- 共用篩選條件 -->
                                <el-divider class="!my-6">
                                    <span class="text-gray-400">進階篩選</span>
                                </el-divider>

                                <el-form-item label="接頭/接尾">
                                    <el-radio-group v-model="selectedCategory">
                                        <el-radio label="全部" value="all" />
                                        <el-radio label="接頭" value="prefix" />
                                        <el-radio label="接尾" value="suffix" />
                                    </el-radio-group>
                                </el-form-item>

                                <el-form-item label="賦予等級">
                                    <div class="flex gap-2 items-center">
                                        <el-select v-model="searchRankOperator" style="width: 120px">
                                            <el-option label="全部" value="" />
                                            <el-option label="等於" value="eq" />
                                            <el-option label="大於等於" value="gte" />
                                            <el-option label="小於等於" value="lte" />
                                        </el-select>
                                        <el-select
                                            v-model="searchRank"
                                            placeholder="選擇等級"
                                            clearable
                                            :disabled="!searchRankOperator"
                                            style="width: 150px"
                                        >
                                            <el-option
                                                v-for="opt in rankSelectOptions"
                                                :key="opt.value"
                                                :label="opt.label"
                                                :value="opt.value"
                                            />
                                        </el-select>
                                    </div>
                                </el-form-item>

                                <el-form-item label="裝備類型">
                                    <el-select
                                        v-model="searchLimit"
                                        placeholder="全部"
                                        clearable
                                        filterable
                                        style="width: 240px"
                                    >
                                        <el-option
                                            v-for="limitType in limitTypes"
                                            :key="limitType"
                                            :label="limitType"
                                            :value="limitType"
                                        />
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="轉專用">
                                    <el-radio-group v-model="filterPersonalize">
                                        <el-radio label="全部" value="all" />
                                        <el-radio label="會轉專用" value="yes" />
                                        <el-radio label="不轉專用" value="no" />
                                    </el-radio-group>
                                </el-form-item>

                                <el-form-item label="排序">
                                    <el-radio-group v-model="sortBy">
                                        <el-radio label="預設" value="default" />
                                        <el-radio label="等級 ↑" value="rank_asc" />
                                        <el-radio label="等級 ↓" value="rank_desc" />
                                    </el-radio-group>
                                </el-form-item>

                                <el-form-item>
                                    <el-button @click="handleReset">
                                        <el-icon class="mr-1"><RefreshLeft /></el-icon>
                                        重置條件
                                    </el-button>
                                </el-form-item>
                            </el-form>
                        </el-card>

                        <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                            <div class="mb-6 border-b border-gray-700 pb-4 flex justify-between items-center">
                                <h2 class="text-2xl font-bold text-accent">搜尋結果</h2>
                                <span class="text-gray-400">
                                    找到
                                    <span class="text-accent font-bold">{{ displayData.length }}</span>
                                    個賦予
                                </span>
                            </div>
                            <div>
                                <el-empty
                                    v-if="displayData.length === 0"
                                    description="沒有符合條件的賦予"
                                    :image-size="150"
                                />
                                <el-table
                                    v-else
                                    :data="displayData"
                                    border
                                    class="rounded-lg overflow-hidden"
                                    :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                                    :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                                    max-height="600"
                                >
                                    <el-table-column prop="name" label="名稱" width="280" align="center">
                                        <template #default="{ row }">
                                            <div class="flex flex-col items-center gap-1 w-full">
                                                <div class="flex gap-1 flex-wrap justify-center">
                                                    <el-tag v-if="row.type === 'prefix'" type="danger" size="small">
                                                        接頭
                                                    </el-tag>
                                                    <el-tag v-else type="primary" size="small">接尾</el-tag>
                                                    <el-tag v-if="row.personalize" type="warning" size="small">
                                                        轉專用
                                                    </el-tag>
                                                </div>
                                                <span class="font-medium">{{ row.name.tw || row.name.en }}</span>
                                                <span class="text-xs text-gray-400">
                                                    Rank {{ formatRank(row.level) }}
                                                </span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="limit" label="賦予限制" width="200" align="center">
                                        <template #default="{ row }">
                                            <div class="flex flex-wrap gap-1 justify-center">
                                                <el-tag
                                                    v-for="(limit, idx) in row.limit"
                                                    :key="idx"
                                                    type="info"
                                                    size="small"
                                                >
                                                    {{ limit }}
                                                </el-tag>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="abilities" label="能力效果" min-width="300" align="center">
                                        <template #default="{ row }">
                                            <div v-html="renderAbilities(row.effect)" class="text-left"></div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="來源" width="200" align="center">
                                        <template #default="{ row }">
                                            <span
                                                v-if="getEnchantSource(row.id) !== '—'"
                                                class="text-yellow-400 text-sm"
                                            >
                                                {{ getEnchantSource(row.id) }}
                                            </span>
                                            <span v-else class="text-gray-600 text-sm">—</span>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-card>
                    </div>
                </el-tab-pane>

                <el-tab-pane label="快速檢視" name="quickview">
                    <div class="space-y-6 pt-4">
                        <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                            <div class="mb-4 border-b border-gray-700 pb-4">
                                <h2 class="text-2xl font-bold text-accent">快速檢視</h2>
                            </div>
                            <el-form label-width="100px" label-position="left">
                                <el-form-item label="武器類型">
                                    <el-select v-model="quickWeaponType" style="width: 160px">
                                        <el-option
                                            v-for="w in QUICK_WEAPON_OPTIONS"
                                            :key="w.label"
                                            :label="w.label"
                                            :value="w.label"
                                        />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label=" " class="!mb-0">
                                    <div class="flex flex-wrap gap-4">
                                        <el-checkbox v-model="filterNonPersonalize">
                                            <span class="text-sm text-gray-300">不綁專</span>
                                            <span class="text-xs text-gray-500 ml-1">（過濾轉專用）</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="showSourceHighlight">
                                            <span class="text-sm text-gray-300">標示 G27 / VH</span>
                                            <span class="text-xs text-gray-500 ml-1">（標示出處）</span>
                                        </el-checkbox>
                                        <el-checkbox v-model="wearBrokenRobe">
                                            <span class="text-sm text-gray-300">裝備破袍</span>
                                            <span class="text-xs text-gray-500 ml-1">（隱藏袍/翅膀欄）</span>
                                        </el-checkbox>
                                        <div class="flex items-center gap-2">
                                            <el-checkbox v-model="limitTopN">
                                                <span class="text-sm text-gray-300">最多顯示</span>
                                            </el-checkbox>
                                            <el-select
                                                v-model="quickViewTopN"
                                                :disabled="!limitTopN"
                                                style="width: 68px"
                                                size="small"
                                            >
                                                <el-option v-for="n in 5" :key="n" :label="`${n} 筆`" :value="n" />
                                            </el-select>
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-divider class="!my-4">
                                    <span class="text-gray-400 text-sm">自訂排序權重</span>
                                </el-divider>
                                <div class="space-y-2">
                                    <div
                                        v-for="(ws, idx) in weightSettings"
                                        :key="idx"
                                        class="flex items-center gap-2 flex-wrap"
                                    >
                                        <el-select
                                            v-model="ws.abilityId"
                                            placeholder="選擇能力"
                                            filterable
                                            clearable
                                            style="width: 200px"
                                        >
                                            <el-option
                                                v-for="ability in selectableAbility"
                                                :key="ability"
                                                :label="abilitiesMap[ability] || ability"
                                                :value="ability"
                                            />
                                        </el-select>
                                        <span class="text-gray-400 text-sm">×</span>
                                        <el-input-number
                                            v-model="ws.weight"
                                            :min="0.1"
                                            :max="10"
                                            :step="0.5"
                                            :precision="1"
                                            style="width: 110px"
                                        />
                                        <el-button type="danger" size="small" circle @click="removeWeightRow(idx)">
                                            <el-icon><Close /></el-icon>
                                        </el-button>
                                    </div>
                                    <div class="flex gap-2 mt-2">
                                        <el-button size="small" @click="addWeightRow">
                                            <el-icon class="mr-1"><Plus /></el-icon>新增權重
                                        </el-button>
                                        <el-button
                                            v-if="weightSettings.length > 0"
                                            size="small"
                                            @click="weightSettings = []"
                                        >
                                            清除全部
                                        </el-button>
                                    </div>
                                    <p
                                        v-if="weightSettings.some((ws) => ws.abilityId)"
                                        class="text-xs text-gray-500 mt-1"
                                    >
                                        排序分數 = Σ (能力數值 × 權重)，分數越高排越前面
                                    </p>
                                </div>
                            </el-form>
                        </el-card>

                        <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
                            <el-table
                                :data="quickViewData"
                                border
                                class="rounded-lg overflow-hidden"
                                :header-cell-style="{ background: '#4a5568', color: '#cbd5e0' }"
                                :row-style="{ background: '#2d3748', color: '#e2e8f0' }"
                            >
                                <el-table-column prop="label" label="部位" width="90" align="center" />
                                <el-table-column label="接頭" min-width="240">
                                    <template #default="{ row }">
                                        <div class="enchant-cell">
                                            <span v-if="!row.prefix.length" class="text-gray-600 text-xs">—</span>
                                            <el-popover
                                                v-for="e in row.prefix"
                                                :key="e.id"
                                                trigger="hover"
                                                placement="right"
                                                :width="300"
                                                :show-after="150"
                                                :hide-after="80"
                                                popper-class="qv-popover"
                                            >
                                                <template #reference>
                                                    <div
                                                        class="qv-entry"
                                                        :class="{
                                                            'qv-entry--source': showSourceHighlight && getSourceLabel(e.id),
                                                        }"
                                                    >
                                                        <div class="flex items-center gap-1">
                                                            <span class="qv-rank">{{ formatRank(e.level) }}</span>
                                                            <span class="text-xs font-medium leading-tight">
                                                                {{ e.name.tw || e.name.en }}
                                                            </span>
                                                            <el-tag
                                                                v-if="e.personalize"
                                                                type="warning"
                                                                size="small"
                                                                class="scale-75 origin-left !py-0"
                                                            >
                                                                轉
                                                            </el-tag>
                                                            <template v-if="getSourceLabel(e.id)">
                                                                <el-tag
                                                                    v-if="showSourceHighlight"
                                                                    type="success"
                                                                    size="small"
                                                                    class="scale-75 origin-left !py-0"
                                                                >
                                                                    {{ getSourceLabel(e.id) }}
                                                                </el-tag>
                                                                <span v-else class="text-yellow-400 text-xs">★</span>
                                                            </template>
                                                        </div>
                                                        <div class="text-xs text-gray-500 pl-5 leading-tight">
                                                            {{ formatEnchantEffects(e, quickWeaponType) }}
                                                        </div>
                                                    </div>
                                                </template>
                                                <!-- 詳細資訊 -->
                                                <div class="qv-detail">
                                                    <div class="qv-detail-header">
                                                        <span class="qv-rank">{{ formatRank(e.level) }}</span>
                                                        <span class="font-medium text-sm">{{ e.name.tw || e.name.en }}</span>
                                                        <el-tag size="small" type="danger" class="ml-1 !py-0">接頭</el-tag>
                                                        <el-tag v-if="e.personalize" size="small" type="warning" class="!py-0">轉</el-tag>
                                                    </div>
                                                    <div v-if="e.limit.some(l => l)" class="qv-detail-limit">
                                                        <el-tag
                                                            v-for="l in e.limit.filter(l => l)"
                                                            :key="l"
                                                            type="info"
                                                            size="small"
                                                            class="mr-1 mb-1"
                                                        >{{ l }}</el-tag>
                                                    </div>
                                                    <div class="qv-detail-desc">
                                                        <div
                                                            v-for="(line, i) in descLines(e.desc)"
                                                            :key="i"
                                                            :class="line.startsWith('[') ? 'text-gray-400' : 'text-gray-200'"
                                                        >{{ line }}</div>
                                                    </div>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column label="接尾" min-width="240">
                                    <template #default="{ row }">
                                        <div class="enchant-cell">
                                            <span v-if="!row.suffix.length" class="text-gray-600 text-xs">—</span>
                                            <el-popover
                                                v-for="e in row.suffix"
                                                :key="e.id"
                                                trigger="hover"
                                                placement="left"
                                                :width="300"
                                                :show-after="150"
                                                :hide-after="80"
                                                popper-class="qv-popover"
                                            >
                                                <template #reference>
                                                    <div
                                                        class="qv-entry"
                                                        :class="{
                                                            'qv-entry--source': showSourceHighlight && getSourceLabel(e.id),
                                                        }"
                                                    >
                                                        <div class="flex items-center gap-1">
                                                            <span class="qv-rank">{{ formatRank(e.level) }}</span>
                                                            <span class="text-xs font-medium leading-tight">
                                                                {{ e.name.tw || e.name.en }}
                                                            </span>
                                                            <el-tag
                                                                v-if="e.personalize"
                                                                type="warning"
                                                                size="small"
                                                                class="scale-75 origin-left !py-0"
                                                            >
                                                                轉
                                                            </el-tag>
                                                            <template v-if="getSourceLabel(e.id)">
                                                                <el-tag
                                                                    v-if="showSourceHighlight"
                                                                    type="success"
                                                                    size="small"
                                                                    class="scale-75 origin-left !py-0"
                                                                >
                                                                    {{ getSourceLabel(e.id) }}
                                                                </el-tag>
                                                                <span v-else class="text-yellow-400 text-xs">★</span>
                                                            </template>
                                                        </div>
                                                        <div class="text-xs text-gray-500 pl-5 leading-tight">
                                                            {{ formatEnchantEffects(e, quickWeaponType) }}
                                                        </div>
                                                    </div>
                                                </template>
                                                <!-- 詳細資訊 -->
                                                <div class="qv-detail">
                                                    <div class="qv-detail-header">
                                                        <span class="qv-rank">{{ formatRank(e.level) }}</span>
                                                        <span class="font-medium text-sm">{{ e.name.tw || e.name.en }}</span>
                                                        <el-tag size="small" type="primary" class="ml-1 !py-0">接尾</el-tag>
                                                        <el-tag v-if="e.personalize" size="small" type="warning" class="!py-0">轉</el-tag>
                                                    </div>
                                                    <div v-if="e.limit.some(l => l)" class="qv-detail-limit">
                                                        <el-tag
                                                            v-for="l in e.limit.filter(l => l)"
                                                            :key="l"
                                                            type="info"
                                                            size="small"
                                                            class="mr-1 mb-1"
                                                        >{{ l }}</el-tag>
                                                    </div>
                                                    <div class="qv-detail-desc">
                                                        <div
                                                            v-for="(line, i) in descLines(e.desc)"
                                                            :key="i"
                                                            :class="line.startsWith('[') ? 'text-gray-400' : 'text-gray-200'"
                                                        >{{ line }}</div>
                                                    </div>
                                                </div>
                                            </el-popover>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="mt-3 text-xs text-gray-500">
                                ★ /
                                <span class="text-green-400">G27</span>
                                <span class="text-green-400">VH</span>
                                = 目前有已知副本來源
                            </div>
                        </el-card>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<style>
.enchant-notice {
    max-width: 72rem;
    margin: 0 auto 1rem;
    padding: 0.6rem 1rem;
    background: #422006;
    border: 1px solid #92400e;
    border-radius: 8px;
    color: #fcd34d;
    font-size: 0.9rem;
}

/* 保持 Element UI 預設樣式覆蓋，並調整輸入框的文字顏色 */
.el-form-item {
    margin-bottom: 1rem;
}
.el-input-number {
    width: 100%;
}
.el-table .el-input-number {
    width: 100%;
}
.el-table .el-input-number .el-input__inner {
    text-align: center;
    color: #e2e8f0;
    background-color: #4a5568;
    border-color: #6b7280;
}

/* 針對 el-select 的調整 */
.el-select .el-input__inner {
    color: #e2e8f0;
    background-color: #4a5568;
    border-color: #6b7280;
}
.el-select-dropdown {
    background-color: #2d3748;
    border-color: #6b7280;
}
.el-select-dropdown__item {
    color: #e2e8f0;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item.selected {
    background-color: #4a5568;
    color: #fbd38d;
}

/* 針對 el-switch 的調整 */
.el-switch__core {
    background-color: #4a5568 !important;
    border-color: #6b7280 !important;
}
.el-switch.is-checked .el-switch__core {
    background-color: #fbd38d !important;
    border-color: #fbd38d !important;
}
.el-switch__core:after {
    background-color: #e2e8f0 !important;
}

/* 調整表格內部 InputNumber 的顏色 */
.el-table .el-input-number__increase,
.el-table .el-input-number__decrease {
    background-color: #6b7280;
    color: #e2e8f0;
    border-color: #6b7280;
}
.el-table .el-input-number__increase:hover,
.el-table .el-input-number__decrease:hover {
    background-color: #718096;
}

.el-input__wrapper {
    padding: 1px 30px !important;
}

.bg-gray-800 .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: #2d3748 !important;
}

/* ── Tab 樣式 (border-card) ────────────────────── */
.enchant-tabs .el-tabs__item {
    font-size: 1rem;
    font-weight: 600;
    padding: 0 28px;
}

/* ── 快速檢視 - 格內捲動列表 ──────────────────────── */
.enchant-cell {
    max-height: 260px;
    overflow-y: auto;
    padding: 2px 0;
}
.qv-rank {
    display: inline-block;
    min-width: 18px;
    text-align: center;
    font-size: 0.65rem;
    font-weight: 700;
    color: #fcd34d;
    border: 1px solid #92400e;
    border-radius: 3px;
    padding: 0 2px;
    flex-shrink: 0;
    line-height: 1.4;
}
.qv-entry {
    padding: 3px 0;
    border-bottom: 1px solid #374151;
}
.qv-entry:last-child {
    border-bottom: none;
}
.qv-entry--source {
    background: rgba(16, 185, 129, 0.06);
    border-radius: 4px;
    padding: 3px 4px;
    margin: 1px 0;
}

/* ── 快速檢視 - hover 詳細 popover ──────────────────── */
.qv-popover.el-popper {
    background: #1a2535 !important;
    border: 1px solid #4a5568 !important;
    color: #e2e8f0 !important;
    padding: 10px 12px !important;
}
.qv-popover .el-popper__arrow::before {
    background: #1a2535 !important;
    border-color: #4a5568 !important;
}
.qv-detail-header {
    display: flex;
    align-items: center;
    gap: 5px;
    padding-bottom: 7px;
    margin-bottom: 7px;
    border-bottom: 1px solid #374151;
    font-size: 0.82rem;
}
.qv-detail-limit {
    margin-bottom: 7px;
    line-height: 1.8;
}
.qv-detail-desc {
    max-height: 220px;
    overflow-y: auto;
    font-size: 0.78rem;
    line-height: 1.7;
}
.qv-detail-desc::-webkit-scrollbar {
    width: 4px;
}
.qv-detail-desc::-webkit-scrollbar-thumb {
    background: #4a5568;
    border-radius: 2px;
}
</style>

<script setup lang="ts">
import { ref, computed } from "vue";
import { RefreshLeft, Plus, Close } from "@element-plus/icons-vue";
import { Enchant, EnchantAbility, EnchantSource } from "../types/Enchant";
import { enchants, reward } from "../data/enchants";
import { abilitiesMap, abilitiesValueWithPercentArray } from "../data/abilities";

// ── 自定義排序設定 ──────────────────────────────────────────────
// 在陣列中列出的項目會優先顯示（依陣列順序），其餘依中文字母排序

/** 裝備類型選單順序 */
const LIMIT_ORDER: string[] = [
    // 身體部位
    "頭部裝備",
    "衣服",
    "衣物",
    "布衣",
    "皮質盔甲",
    "輕甲",
    "輕盔甲",
    "重甲",
    "重盔甲",
    "盔甲",
    "手套",
    "金屬手套",
    "重盔甲手套",
    "鞋子",
    "金屬靴",
    "盾牌",
    "飾品",
    // 武器（通用）
    "武器",
    "近距離武器",
    "單手武器",
    "雙手武器",
    // 武器（分類）
    "弓",
    "弩",
    "拳套",
    "鈍器",
    "斧",
    "斧頭",
    "手把",
    "鋼瓶",
    "雙槍",
    "魔杖",
    "集魔杖",
    "單手魔杖、集魔杖",
    "魔導書、水晶球",
    "騎槍",
    "大型鐮刀",
    "鎖鏈鐮刃",
    "手裏劍",
    "手裡劍",
    // 樂器
    "樂器",
    "管樂器",
    "絃樂器",
    "電子吉他",
];

/** 能力選單順序 */
const ABILITY_ORDER: string[] = [
    "lance_piercing",
    "attack_max",
    "AttMax",
    "Attmax",
    "wAttMax",
    "all_alchemy_damage",
    "music_buff_bonus",
    "magic_attack",
    "casting_speed",
    "critical_damage",
    "criticaldamage",
    "critical_cap_increase",
    "bonus_damage",
    "bonusdamage",
    // 基礎數值
    "HP",
    "LifeMax",
    "MP",
    "ManaMax",
    "SP",
    "StaminaMax",
    // 能力值
    "STR",
    "STR2",
    "Str",
    "DEX",
    "Dex",
    "dex",
    "WIL",
    "Will",
    "LUK",
    "Luck",
    "INT",
    "Int",
    "int",
    // 攻擊

    "attack_min",
    "AttMin",
    "wAttMin",
    "balance",
    "critical",
    "Crit",
    // 防禦
    "defense",
    "Def",
    "protection",
    "Prot",
    "prot",
    "protect",
    "magic_defense",
    "magicdefence",
    "magic_protection",
    "magicprotect",
    "damage_reduction_rate",
    // 移動
    "move_speed",
    "Hurry",
];

/** 根據自定義順序陣列排序（順序內的靠前，其餘依中文字母） */
const sortWithOrder = <T extends string>(items: T[], order: string[], nameGetter: (id: T) => string): T[] => {
    const orderIndex = new Map(order.map((id, i) => [id, i]));
    return [...items].sort((a, b) => {
        const ai = orderIndex.get(a) ?? Infinity;
        const bi = orderIndex.get(b) ?? Infinity;
        if (ai !== bi) return ai - bi;
        return nameGetter(a).localeCompare(nameGetter(b), "zh-TW");
    });
};

// 賦予等級選項（F/E/D/C/B/A → 9/8/7/.../1）
const rankSelectOptions = [
    { label: "F", value: 1 },
    { label: "E", value: 2 },
    { label: "D", value: 3 },
    { label: "C", value: 4 },
    { label: "B", value: 5 },
    { label: "A", value: 6 },
    { label: "9", value: 7 },
    { label: "8", value: 8 },
    { label: "7", value: 9 },
    { label: "6", value: 10 },
    { label: "5", value: 11 },
    { label: "4", value: 12 },
    { label: "3", value: 13 },
    { label: "2", value: 14 },
    { label: "1", value: 15 },
];

// 搜尋條件
const selectedCondition = ref<string>("search");
const searchName = ref("");
const searchAbility = ref("");
const searchValue = ref<number | null>(null);
const searchValueOperator = ref("gte");
const selectedCategory = ref<string>("all");
const selectedRaid = ref<string>("G27/布里萊赫");
const searchRank = ref<number | null>(null);
const searchRankOperator = ref("");
const searchLimit = ref("");
const filterPersonalize = ref<"all" | "yes" | "no">("all");
const sortBy = ref<"default" | "rank_asc" | "rank_desc">("default");

// 建立 enchant id → 副本名稱 的對照表（提前宣告供快速檢視使用）
const enchantSourceMap = new Map<number, string>();
reward.forEach((r) => r.list.forEach((id) => enchantSourceMap.set(id, r.raidName)));
const getEnchantSource = (id: number): string => enchantSourceMap.get(id) ?? "—";

// ── 快速檢視 ─────────────────────────────────────────────────────
const activeTab = ref<"search" | "quickview">("search");
const quickWeaponType = ref<string>("魔杖");
const filterNonPersonalize = ref<boolean>(false);
const showSourceHighlight = ref<boolean>(false);
const wearBrokenRobe = ref<boolean>(false);
const limitTopN = ref<boolean>(false);
const quickViewTopN = ref<number>(3);

interface WeightSetting {
    abilityId: string;
    weight: number;
}
const weightSettings = ref<WeightSetting[]>([]);
const addWeightRow = () => weightSettings.value.push({ abilityId: "", weight: 1 });
const removeWeightRow = (idx: number) => weightSettings.value.splice(idx, 1);
const getWeightedScore = (enchant: Enchant): number => {
    const merged = mergeEffects(enchant);
    const map = new Map(merged.map((e) => [e.id, e.max]));
    return weightSettings.value.reduce((sum, ws) => {
        if (!ws.abilityId) return sum;
        return sum + (map.get(ws.abilityId) ?? 0) * ws.weight;
    }, 0);
};

interface WeaponOpt {
    label: string;
    limits: string[];
    topN?: number; // 每格最多顯示幾筆，預設 5
    strictFilter?: boolean; // true = 只顯示有相關能力的賦予，不包含中性賦予
}

const QUICK_WEAPON_OPTIONS: WeaponOpt[] = [
    { label: "魔杖", limits: ["魔杖", "單手魔杖、集魔杖"], strictFilter: true },
    { label: "集魔杖", limits: ["集魔杖", "單手魔杖、集魔杖"], strictFilter: true },
    { label: "鐮刀", limits: ["大型鐮刀"], strictFilter: true },
    { label: "鋼瓶", limits: ["鋼瓶", "兇猛暴君鋼瓶", "塔座鋼瓶", "福音鋼瓶"], strictFilter: true },
    {
        label: "物理",
        limits: [
            "武器",
            "近距離武器",
            "單手武器",
            "雙手武器",
            "弓",
            "弩",
            "拳套",
            "鈍器",
            "斧",
            "斧頭",
            "手把",
            "雙槍",
            "騎槍",
        ],
        strictFilter: true,
    },
    { label: "音樂", limits: ["樂器"], topN: 3, strictFilter: true },
];

// 各武器類型「相關」能力 ID 集合
const MAGIC_IDS = new Set([
    "magic_attack",
    "MagicAttack",
    "magic_damage",
    "casting_speed",
    "magicice",
    "magicfire",
    "magiclightning",
]);
const ALCHEMY_IDS = new Set([
    "fire_alchemy_damage",
    "water_alchemy_damage",
    "earth_alchemy_damage",
    "wind_alchemy_damage",
    "all_alchemy_damage",
    "AlchemyElementalBonus",
    "elemental_wave_bonus",
]);
const PHYS_DMG_IDS = new Set(["attack_max", "AttMax", "Attmax", "wAttMax"]);
const CHAIN_IDS = new Set(["chainblade_attack_max", "chainblade_attack_min"]);
const MUSIC_IDS = new Set(["music_buff_bonus", "musicbuff_bonus", "musicbuff_duration"]);

// 所有武器專屬能力的聯集（用於判斷賦予是否「中性」）
const ANY_EXCLUSIVE = new Set([...PHYS_DMG_IDS, ...MAGIC_IDS, ...ALCHEMY_IDS, ...CHAIN_IDS, ...MUSIC_IDS]);

// 各武器類型「主要數值」ID（排序用）
const PRIMARY_IDS: Record<string, string[]> = {
    物理: ["attack_max", "AttMax", "Attmax", "wAttMax"],
    魔杖: ["magic_attack", "MagicAttack", "magic_damage"],
    集魔杖: ["magic_attack", "MagicAttack", "magic_damage"],
    鋼瓶: [
        "all_alchemy_damage",
        "fire_alchemy_damage",
        "water_alchemy_damage",
        "earth_alchemy_damage",
        "wind_alchemy_damage",
        "AlchemyElementalBonus",
    ],
    鐮刀: ["magic_attack", "MagicAttack", "magic_damage"],
    音樂: ["music_buff_bonus"],
};

// 各武器類型「顯示」能力 ID（效果摘要只顯示此集合內的屬性）
const RELEVANT_IDS: Record<string, Set<string>> = {
    物理: new Set([
        ...PHYS_DMG_IDS,
        "critical",
        "Crit",
        "critical_damage",
        "criticaldamage",
        "critical_cap_increase",
        "lance_piercing",
        "bonus_damage",
        "bonusdamage",
        "ArcheryTalentAttMax",
        "CombatTalentAttMax",
    ]),
    魔杖: new Set([...MAGIC_IDS]),
    集魔杖: new Set([...MAGIC_IDS]),
    鋼瓶: new Set([...ALCHEMY_IDS]),
    鐮刀: new Set(["magic_attack", "MagicAttack", "magic_damage", "lance_piercing"]),
    音樂: new Set(["music_buff_bonus"]),
};

/** 合併同 ID 的多個詞條（數值加總） */
interface MergedEff {
    id: string;
    min: number;
    max: number;
}
const mergeEffects = (enchant: Enchant): MergedEff[] => {
    const map = new Map<string, MergedEff>();
    for (const eff of enchant.effect) {
        const ex = map.get(eff.id);
        if (ex) {
            ex.min += eff.min;
            ex.max += eff.max;
        } else {
            map.set(eff.id, { id: eff.id, min: eff.min, max: eff.max });
        }
    }
    return Array.from(map.values());
};

const getPrimaryValue = (enchant: Enchant, weaponType: string): number => {
    const ids = PRIMARY_IDS[weaponType] ?? [];
    let best = 0;
    for (const eff of mergeEffects(enchant)) {
        if (ids.includes(eff.id)) best = Math.max(best, eff.max);
    }
    return best;
};

const formatEnchantEffects = (enchant: Enchant, weaponType: string): string => {
    const sign = (n: number) => (n >= 0 ? `+${n}` : `${n}`);
    const relevant = RELEVANT_IDS[weaponType];
    const merged = mergeEffects(enchant);
    // 只顯示對應武器的相關屬性；若無符合就不強制顯示其他屬性
    const toShow = relevant ? merged.filter((e) => relevant.has(e.id)) : merged;
    return toShow
        .map((eff) => {
            const name = abilitiesMap[eff.id] ?? eff.id;
            const pct = abilitiesValueWithPercentArray.includes(eff.id) ? "%" : "";
            return eff.min === eff.max
                ? `${name} ${sign(eff.max)}${pct}`
                : `${name} ${sign(eff.min)}~${sign(eff.max)}${pct}`;
        })
        .join("  ");
};

// desc 換行處理：相容舊格式（\n 兩字元）與新格式（真換行）
const descLines = (desc: string): string[] =>
    desc.replace(/\\n/g, "\n").split("\n").filter((l) => l.trim() !== "");

const getSourceLabel = (id: number): string => {
    const src = getEnchantSource(id);
    if (src === "—") return "";
    if (src.includes("G27")) return "G27";
    if (src.includes("VH") || src.includes("格倫")) return "VH";
    return "★";
};

interface SlotDef {
    label: string;
    isWeapon?: boolean;
    limits: string[];
}

const QUICK_VIEW_SLOTS: SlotDef[] = [
    { label: "武器", isWeapon: true, limits: [] },
    { label: "飾品", limits: ["飾品"] },
    { label: "頭", limits: ["頭部裝備", "頭", "頭部"] },
    {
        label: "身",
        limits: [
            "衣服",
            "衣物",
            "布衣",
            "皮質盔甲",
            "輕甲",
            "輕盔甲",
            "重甲",
            "重盔甲",
            "盔甲",
            "衣服、盔甲、手套、鞋子",
        ],
    },
    { label: "手", limits: ["手套", "金屬手套", "重盔甲手套", "手部裝備", "手", "衣服、盔甲、手套、鞋子"] },
    { label: "腳", limits: ["鞋子", "金屬靴", "腳", "腳部裝備", "衣服、盔甲、手套、鞋子"] },
    { label: "袍/翅膀", limits: ["特定的翅膀", "特定翅膀", "翅膀", "服裝"] },
];

interface QuickViewRow {
    label: string;
    prefix: Enchant[];
    suffix: Enchant[];
}

const quickViewData = computed((): QuickViewRow[] => {
    const wType = quickWeaponType.value;
    const weaponOpt = QUICK_WEAPON_OPTIONS.find((w) => w.label === wType);
    const weaponLimits = weaponOpt?.limits ?? [];
    const topN = limitTopN.value ? quickViewTopN.value : (weaponOpt?.topN ?? 5);
    const relevant = RELEVANT_IDS[wType];
    const noPersonalize = filterNonPersonalize.value;
    const hideRobe = wearBrokenRobe.value;

    return QUICK_VIEW_SLOTS.filter((slot) => !(hideRobe && slot.label === "袍/翅膀"))
        .map((slot) => {
            const limits = slot.isWeapon ? weaponLimits : slot.limits;

            let applicable = enchants.filter((e) => e.limit.some((l) => limits.includes(l)));

            // 篩選：strictFilter = 只顯示含相關能力的賦予；一般模式 = 有相關能力 OR 完全中性
            if (relevant) {
                const strict = weaponOpt?.strictFilter ?? false;
                if (strict) {
                    applicable = applicable.filter((e) => e.effect.some((eff) => relevant.has(eff.id)));
                } else {
                    applicable = applicable.filter(
                        (e) =>
                            e.effect.some((eff) => relevant.has(eff.id)) ||
                            !e.effect.some((eff) => ANY_EXCLUSIVE.has(eff.id)),
                    );
                }
            }

            // 排除無法提取魔力賦予的項目
            applicable = applicable.filter((e) => !e.list.includes("no_enchant_extract(true)"));

            // 不綁專 filter
            if (noPersonalize) applicable = applicable.filter((e) => !e.personalize);

            // 排序：有權重設定時依加權分數，否則依主要數值
            const hasWeights = weightSettings.value.some((ws) => ws.abilityId);
            const sorted = applicable.slice().sort((a, b) => {
                if (hasWeights) {
                    const diff = getWeightedScore(b) - getWeightedScore(a);
                    if (diff !== 0) return diff;
                } else {
                    const va = getPrimaryValue(a, wType);
                    const vb = getPrimaryValue(b, wType);
                    if (va !== vb) return vb - va;
                }
                return b.level - a.level;
            });

            return {
                label: slot.label,
                prefix: sorted.filter((e) => e.type === "prefix").slice(0, topN),
                suffix: sorted.filter((e) => e.type === "suffix").slice(0, topN),
            };
        })
        .filter((row) => row.prefix.length > 0 || row.suffix.length > 0);
});

// 從資料中動態推導所有出現過的能力（有中文名稱的才列出）
const selectableAbility = computed(() => {
    const seen = new Set<string>();
    enchants.forEach((e) => e.effect.forEach((eff) => seen.add(eff.id)));
    const ids = Array.from(seen).filter((id) => abilitiesMap[id]);
    return sortWithOrder(ids, ABILITY_ORDER, (id) => abilitiesMap[id] ?? id);
});

// 副本選項
const raidOptions: { label: string; value: string }[] = [
    { label: "G27/布里萊赫", value: "G27/布里萊赫" },
    { label: "雪VH/格倫貝爾納-太古之冬", value: "雪VH/格倫貝爾納-太古之冬" },
];

// 裝備類型列表（從資料中自動提取）
const limitTypes = computed(() => {
    const types = new Set<string>();
    enchants.forEach((enchant) => {
        enchant.limit.forEach((limit) => types.add(limit));
    });
    return sortWithOrder(Array.from(types), LIMIT_ORDER, (id) => id);
});

// 搜尋結果
const displayData = computed(() => {
    const condition = selectedCondition.value;
    const name = searchName.value.trim();
    const ability = searchAbility.value;
    const value = searchValue.value;
    const valueOp = searchValueOperator.value;
    const category = selectedCategory.value;
    const raid = selectedRaid.value;
    const rank = searchRank.value;
    const rankOp = searchRankOperator.value;
    const limit = searchLimit.value;

    let filteredResult: Enchant[] = [];

    // 1. 主要搜尋邏輯
    if (condition === "search" && name) {
        // 依名稱搜尋（模糊搜尋）
        filteredResult = enchants.filter(
            (item) =>
                (item.name.tw && item.name.tw.includes(name)) ||
                (item.name.en && item.name.en.toLowerCase().includes(name.toLowerCase())),
        );
    } else if (condition === "ability" && ability) {
        // 依能力搜尋
        filteredResult = enchants.filter((item) => {
            const abilityEffect = item.effect.find((e) => e.id === ability);
            if (!abilityEffect) return false;

            // 如果有設定數值條件
            if (value !== null) {
                switch (valueOp) {
                    case "gte":
                        return abilityEffect.max >= value;
                    case "lte":
                        return abilityEffect.min <= value;
                    case "eq":
                        return abilityEffect.min <= value && value <= abilityEffect.max;
                    default:
                        return true;
                }
            }
            return true;
        });
    } else if (condition === "raid") {
        // 依副本搜尋
        const foundReward = reward.find((r) => r.raidName === raid);
        const list = foundReward ? foundReward.list : [];
        filteredResult = enchants.filter((item) => list.includes(item.id));
    } else {
        // 沒有主要搜尋條件
        // 名稱和能力搜尋模式需要輸入條件才顯示結果
        if (condition === "search" || condition === "ability") {
            filteredResult = [];
        } else {
            filteredResult = enchants;
        }
    }

    // 2. 套用進階篩選條件

    // 接頭/接尾篩選
    if (category !== "all") {
        filteredResult = filteredResult.filter((item) => item.type === category);
    }

    // 等級篩選
    if (rankOp && rank !== null) {
        filteredResult = filteredResult.filter((item) => {
            switch (rankOp) {
                case "eq":
                    return item.level === rank;
                case "gte":
                    return item.level >= rank;
                case "lte":
                    return item.level <= rank;
                default:
                    return true;
            }
        });
    }

    // 裝備類型篩選
    if (limit) {
        filteredResult = filteredResult.filter((item) => item.limit.includes(limit));
    }

    // 轉專用篩選
    const personalize = filterPersonalize.value;
    if (personalize !== "all") {
        filteredResult = filteredResult.filter((item) =>
            personalize === "yes" ? item.personalize : !item.personalize,
        );
    }

    // 排序
    const sort = sortBy.value;
    if (sort === "rank_asc") filteredResult = [...filteredResult].sort((a, b) => a.level - b.level);
    if (sort === "rank_desc") filteredResult = [...filteredResult].sort((a, b) => b.level - a.level);

    return filteredResult;
});

// 重置
const handleReset = () => {
    searchName.value = "";
    searchAbility.value = "";
    searchValue.value = null;
    searchValueOperator.value = "gte";
    selectedCategory.value = "all";
    selectedRaid.value = "G27/布里萊赫";
    searchRank.value = null;
    searchRankOperator.value = "";
    searchLimit.value = "";
    selectedCondition.value = "search";
    filterPersonalize.value = "all";
    sortBy.value = "default";
};

// 格式化賦予等級顯示 (1-6 => F-A, 7-15 => 9-1)
const formatRank = (level: number): string => {
    if (level >= 1 && level <= 6) {
        // 1=>F, 2=>E, 3=>D, 4=>C, 5=>B, 6=>A
        const ranks = ["F", "E", "D", "C", "B", "A"];
        return ranks[level - 1];
    } else if (level >= 7 && level <= 15) {
        // 7=>9, 8=>8, ..., 15=>1
        return String(16 - level);
    } else {
        // 超出範圍，直接顯示數字
        return String(level);
    }
};

// 渲染能力效果
const renderAbilities = (abilityIdArray: EnchantAbility[]): string => {
    const format = (num: number): string => {
        const color = num < 0 ? "#ef4444" : "#60a5fa"; // red-500 : blue-400
        const sign = num >= 0 ? "+" : "";
        return `<span style="color:${color}; font-weight: 600;">${sign}${num}</span>`;
    };

    return abilityIdArray
        .map((ability) => {
            const { id, min, max } = ability;
            const abilityName = abilitiesMap[id] || id;
            const suffix = abilitiesValueWithPercentArray.includes(id) ? "%" : "";

            if (min !== max) {
                return `<div style="margin: 2px 0;">${abilityName}: ${format(min)} ~ ${format(max)}${suffix}</div>`;
            } else {
                return `<div style="margin: 2px 0;">${abilityName}: ${format(min)}${suffix}</div>`;
            }
        })
        .join("");
};
</script>
