# 🔄 Claude Code 交接文件

**專案名稱**: 瑪奇小工具 (Mabinogi Tools)
**交接日期**: 2026-01-18
**前置作業**: Claude Web (主題統一專案)
**接手環境**: Claude Code
**專案負責人**: Bowei (eldisa)

---

## 📋 專案概述

### 基本資訊
- **技術棧**: Vue 3 + TypeScript + Vite + Element Plus + Tailwind CSS
- **專案類型**: 瑪奇遊戲工具集合（裝備改造、賦予查詢、素材計算等）
- **倉庫**: https://github.com/eldisa/mabinogi-tools
- **部署**: GitHub Pages
- **開發伺服器**: `npm run dev`
- **構建指令**: `npm run build`

### 專案目標
統一所有頁面為深色主題，提供一致的使用體驗，並優化手機端使用。

---

## 🎯 當前進度總覽

```
┌─────────────────────────────────────────────────────┐
│  設計系統建立   ████████████████████ 100% ✅        │
│  頁面轉換進度   ███████████████░░░░░  57.1% (4/7)  │
│  文檔完整度     ███████████░░░░░░░░░  60% (3/5)    │
│  Git 整理       ████████████████████ 100% ✅        │
└─────────────────────────────────────────────────────┘

總體完成度: 79% (設計系統完成，部分頁面待轉換)
```

**重要更正**: 經實際檢查，目前只有 4 個主要頁面已完成深色主題轉換，並非原先認為的 6 個。

---

## ✅ 已完成項目

### 1. 設計系統建立 (100%)

#### 核心檔案
- ✅ `src/styles/design-tokens.css` (440+ 行)
  - 完整的 CSS 變數系統
  - 深色主題配色 (bg-gray-900, bg-gray-800)
  - 金黃強調色 (accent: #fbbf24)
  - 間距、字體、陰影、動畫變數
  - 自定義滾動條

- ✅ `src/styles/element-dark-theme.css` (500+ 行)
  - Element Plus 所有組件深色主題
  - Card, Table, Input, Select, Dialog, Tabs 等
  - 統一的交互狀態樣式

- ✅ `tailwind.config.js`
  - 擴展自定義顏色主題
  - 自定義動畫 (fade-in, slide-up, pulse-slow)
  - 背景漸變 (text-gradient, bg-texture-dark)

- ✅ `src/main.ts`
  - 已正確導入所有設計系統樣式

- ✅ `.gitattributes`
  - 統一換行符號為 LF
  - 解決跨平台開發問題

#### 配色方案
```css
/* 主要顏色 */
--bg-primary: #111827     /* gray-900 - 主背景 */
--bg-secondary: #1f2937   /* gray-800 - 卡片背景 */
--accent: #fbbf24         /* yellow-400 - 金黃強調色 */
--text-primary: #f9fafb   /* gray-50 - 主文字 */
--text-secondary: #e5e7eb /* gray-200 - 次要文字 */
--border: #374151         /* gray-700 - 邊框 */
```

### 2. 頁面轉換完成 (4/7 = 57.1%)

#### ✅ 已轉換頁面
| 頁面 | 檔案 | 狀態 | 日期 | 備註 |
|------|------|------|------|------|
| 素材計算器 | MaterialSimulator.vue | ✅ 完成 | 2026-01-14 | 553 行，完整轉換 |
| 裝備改造 | WeaponUpgradeSimulator.vue | ✅ 完成 | 2026-01-15 | 432 行，統一主題 |
| 賦予查詢 | Enchant.vue | ✅ 完成 | 2026-01-15 | 363 行，統一主題 |
| 能力轉移 | TransferSimulator.vue | ✅ 完成 | 2026-01-15 | 276 行，統一主題 |

**轉換統一樣式**:
```vue
<!-- 標準頁面結構 -->
<div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
  <div class="max-w-7xl mx-auto space-y-8">
    <header class="text-center pt-8 pb-4">
      <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
        標題
      </h1>
      <p class="text-lg text-gray-400 mt-4">副標題</p>
    </header>

    <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
      <!-- 內容 -->
    </el-card>
  </div>
</div>
```

#### ❌ 未轉換頁面 (3/7)
| 頁面 | 檔案 | 行數 | 狀態 | 優先級 |
|------|------|------|------|--------|
| 農場模型 | FarmModel.vue | 343 | ⏸️ 待轉換 | 🔴 高 |
| 關於頁面 | About.vue | 261 | ⏸️ 待轉換 | 🟡 中 |
| 裝備製作 | EquipmentCraftSimulator.vue | 587 | ⏸️ 待決定 | 🔵 低（可能刪除）|

**注意**: 這三個頁面目前仍使用淺色主題樣式（`bg-white`, `color: #2c3e50` 等）。

#### 🗑️ 不需要轉換的頁面
以下頁面不在路由中或功能未完整，不需要轉換：
- ❌ PierecingLevelAnalysis.vue (21 行，簡單包裝頁面)
- ❌ Settings.vue (14 行，空白頁)
- ❌ GachaSimulator.vue (0 行，空檔案)
- ❌ DamagePage.vue (122 行，未在路由中)
- ❌ SimpleDamageCompare.vue (135 行，未在路由中)
- ❌ GridDemo.vue (128 行，示例頁面)

### 3. 文檔完成 (3/5 = 60%)

#### 已建立文檔
- ✅ `THEME_GUIDE.md` (399 行) - 主題使用指南
- ✅ `GIT_COMMITS.md` (216 行) - Git 提交規範
- ✅ `README.md` (104 行) - 專案說明

#### 缺失文檔
原交接文件提到的以下文檔在專案中**不存在**：
- ❌ `COMMITS_PAGES.md` - 頁面轉換提交訊息
- ❌ `THEME_PROGRESS.md` - 進度追蹤
- ❌ `GIT_TROUBLESHOOTING.md` - Git 問題排查
- ❌ `PROJECT_STATUS.md` - 專案狀態
- ❌ `TODO_IMPLEMENTATION.md` - 實作計劃

**建議**: 這些文檔可以選擇性建立，或整合到本交接文件中。

### 4. Git 提交整理 (100%)

所有變更已正確提交到 `happy-jang` 分支：
```bash
f447a8e feat: remove unused link
710e97b style: unify dark theme across all priority page
b4eb829 chore: add .gitattributes for line ending normalization
4af3b93 docs: add comprehensive theme usage guide
46a5b9c style: convert MaterialSimulator to dark theme
39b7ecd chore: import design system and theme styles in main.ts
be46e76 feat(config): extend Tailwind config with custom theme
60bacd3 style: customize Element Plus components for dark theme
5997a32 style: add design system tokens with dark theme variables
```

**狀態**: 工作區乾淨 (`working tree clean`)

---

## 🚧 待完成項目 (優先順序)

### 🔴 高優先級 - 立即處理

#### 1. FarmModel.vue - 深色主題轉換 (預計 30-45 分鐘)

**需求描述**:
將農場模型查詢頁面轉換為深色主題，與其他已轉換頁面保持一致。

**目前狀態**:
- 343 行程式碼
- 目前可能使用淺色或混合主題
- 已在路由中啟用

**轉換內容**:
```vue
<!-- 需要更新的部分 -->
1. 主容器：改為 bg-gray-900 text-gray-100 bg-texture-dark
2. 標題：使用 text-gradient 漸變效果
3. 卡片：bg-gray-800 border-accent/30
4. 表格：確保 Element Plus 深色主題正常套用
5. 文字顏色：text-gray-200, text-gray-400
```

**檔案位置**:
- 主檔案: `src/views/FarmModel.vue`
- 參考範例: `src/views/MaterialSimulator.vue`

**提交訊息**:
```bash
git add src/views/FarmModel.vue
git commit -m "style(farm-model): convert to unified dark theme

- Replace light background with bg-gray-900
- Update cards to use dark theme styling (bg-gray-800)
- Add texture background pattern (bg-texture-dark)
- Convert text colors for proper contrast
- Update header with gradient text effect (text-gradient)
- Align with unified design system"
```

---

#### 2. Enchant.vue - 進階搜尋功能 (預計 2-3 小時)

**需求描述**:
參考日本 Mabinogi Wiki 的搜尋介面，實作多條件進階搜尋。

**目前狀態**:
- ✅ 深色主題已轉換
- ⏸️ 功能需要加強
- 363 行程式碼

**功能需求**:
- [ ] 賦予名稱搜尋 (文字輸入，模糊搜尋)
- [ ] 效果搜尋 (下拉選單選擇能力)
- [ ] 數值篩選 (輸入數值 + 以上/以下/等於)
- [ ] 位置篩選 (全部/接頭/接尾)
- [ ] 等級篩選 (數字 + 一致/以上/以下)
- [ ] 裝備類型篩選 (武器/盾牌/頭部等)
- [ ] 副本來源篩選 (保留原有功能)
- [ ] 搜尋按鈕 + 重置按鈕
- [ ] 結果數量顯示

**技術實作**:
```typescript
// 多條件 AND 邏輯
const filteredEnchants = enchants.filter(item => {
  // 名稱搜尋
  if (searchName && !item.name.tw.includes(searchName)) return false;

  // 能力 + 數值
  if (searchAbility) {
    const ability = item.effect.find(e => e.id === searchAbility);
    if (!ability) return false;

    if (searchValue) {
      switch(searchValueOperator) {
        case 'gte': return ability.max >= searchValue;
        case 'lte': return ability.min <= searchValue;
        case 'eq': return ability.min <= searchValue && searchValue <= ability.max;
      }
    }
  }

  // 位置
  if (selectedCategory !== 'all' && item.type !== selectedCategory) return false;

  // 等級
  if (searchRank) {
    switch(searchRankOperator) {
      case 'eq': return item.level === searchRank;
      case 'gte': return item.level >= searchRank;
      case 'lte': return item.level <= searchRank;
    }
  }

  // 裝備類型
  if (searchLimit && !item.limit.includes(searchLimit)) return false;

  // 副本
  if (selectedRaid) {
    const reward = findRewardByRaid(selectedRaid);
    return reward?.list.includes(item.id);
  }

  return true;
});
```

**待確認資訊**:
1. 完整的裝備類型列表（目前有：武器、盾牌、頭部、上衣、下衣、手套、鞋子、副裝備、飾品）
2. 是否需要排序功能
3. 是否需要分頁（還是一次顯示全部）

**檔案位置**:
- 主檔案: `src/views/Enchant.vue`
- 資料來源: `src/data/enchants.ts`
- 型別定義: `src/types/Enchant.ts`

**提交訊息**:
```bash
git add src/views/Enchant.vue src/data/enchants.ts src/types/Enchant.ts
git commit -m "feat(enchant): implement advanced search with multiple filters

- Add enchant name fuzzy search
- Add ability and value range filters
- Add position filter (prefix/suffix)
- Add rank filter with operators
- Add equipment type filter
- Preserve existing raid filter
- Add search and reset buttons
- Display result count
- Improve user search experience"
```

---

#### 3. WeaponUpgradeSimulator.vue - 手機版重構 + 快速選項 (預計 3-4 小時)

**需求描述**:
1. 手機版使用 Tabs 切換不同區塊（方案 B）
2. 新增快速配置選項（銳利優先、大傷優先等）

**目前狀態**:
- ✅ 深色主題已轉換
- ⏸️ 手機版佈局需要改善
- 432 行程式碼

**架構設計**:
```vue
<template>
  <!-- 桌面版：保持原有橫向佈局 -->
  <div class="hidden md:flex gap-4">
    <div class="w-1/6"><!-- 選擇武器 --></div>
    <div class="w-1/2"><!-- 武器素質 --></div>
    <div class="w-1/3"><!-- 工匠改 --></div>
  </div>

  <!-- 手機版：Tabs 切換 -->
  <el-tabs v-model="activeTab" class="md:hidden">
    <el-tab-pane label="選擇武器" name="weapon">
      <!-- 武器選擇器 + 圖片 -->
    </el-tab-pane>

    <el-tab-pane label="武器素質" name="stats">
      <!-- 改造前後比較表格 -->
    </el-tab-pane>

    <el-tab-pane label="選擇改造" name="upgrades">
      <!-- 改造選項列表 -->
    </el-tab-pane>

    <el-tab-pane label="工匠改" name="craftman" v-if="hasCraftman">
      <!-- 工匠改造設定 -->
    </el-tab-pane>
  </el-tabs>

  <!-- 快速配置 -->
  <div class="mb-4">
    <el-select v-model="selectedPreset" placeholder="選擇快速配置">
      <el-option
        v-for="preset in quickPresets"
        :key="preset.id"
        :label="preset.name"
        :value="preset.id"
      >
        <span>{{ preset.name }}</span>
        <span class="text-gray-400 text-sm ml-2">{{ preset.description }}</span>
      </el-option>
    </el-select>
    <el-button @click="applyPreset" type="primary">套用</el-button>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('weapon');
const selectedPreset = ref('');

const quickPresets = [
  {
    id: 'crit-focus',
    name: '銳利優先',
    description: '最大化爆擊率',
    upgrades: ['銳利改造', '銳利改造', '工匠改造', '銳利改造', '銳利改造', '銳利改造']
  },
  {
    id: 'damage-focus',
    name: '大傷優先',
    description: '最大化攻擊力',
    upgrades: ['攻擊改造', '破壞改造', '工匠改造', '攻擊改造', '攻擊改造', '破壞改造']
  },
  // 更多預設...
];

function applyPreset() {
  const preset = quickPresets.find(p => p.id === selectedPreset.value);
  if (preset) {
    form.selectedUpgradeArray = preset.upgrades;
    ElMessage.success(`已套用「${preset.name}」配置`);
  }
}
</script>
```

**待確認資訊**:
1. 需要哪些快速預設配置？
   - 銳利優先
   - 大傷優先
   - 平衡流
   - 速度流
   - 其他？
2. 每個預設的具體改造順序（6 階段的改造項目名稱）

**檔案位置**:
- 主檔案: `src/views/WeaponUpgradeSimulator.vue`
- 資料來源: `src/data/upgradeForG27Weapons.ts`

**提交訊息**:
```bash
git add src/views/WeaponUpgradeSimulator.vue
git commit -m "feat(weapon-upgrade): add mobile tabs and quick presets

Mobile Improvements:
- Add tab navigation for mobile devices
- Separate weapon selection, stats, upgrades into tabs
- Improve mobile user experience with focused views

Quick Presets:
- Add quick configuration dropdown
- Implement crit-focus preset (maximize crit rate)
- Implement damage-focus preset (maximize attack)
- Add apply button with success feedback
- Allow users to quickly try popular builds"
```

---

### 🟡 中優先級 - 後續處理

#### 4. About.vue - 深色主題轉換 (預計 30 分鐘)

**需求描述**:
將關於頁面轉換為深色主題。此頁面主要是文字內容，轉換相對簡單。

**目前狀態**:
- 261 行程式碼
- 使用淺色主題（`background: white`, `color: #2c3e50`）
- 包含正式和趣味兩種免責聲明

**轉換內容**:
```vue
<style scoped>
/* 舊 */
.content {
    background: white;
    color: #34495e;
}

/* 新 */
.content {
    background: var(--color-bg-secondary); /* #1f2937 */
    color: var(--color-text-primary); /* #f9fafb */
    border: 2px solid rgba(251, 191, 36, 0.3); /* 金黃邊框 */
}

h1 {
    /* 使用漸變效果 */
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
</style>
```

**檔案位置**:
- 主檔案: `src/views/About.vue`

**提交訊息**:
```bash
git add src/views/About.vue
git commit -m "style(about): convert to unified dark theme

- Replace white background with dark theme (bg-gray-800)
- Update text colors for better contrast
- Add gradient effect to page title
- Add golden accent border to content card
- Align with design system standards"
```

---

#### 5. EquipmentCraftSimulator.vue - 決定去留 (討論)

**需求描述**:
決定此頁面是否保留，如果保留則需要轉換為深色主題。

**目前狀態**:
- 587 行程式碼（最大的頁面）
- 使用淺色主題（`bg-gray-100`, `text-gray-800`）
- 功能：裝備製作成本計算

**選項**:
1. **保留並轉換** - 完整轉換為深色主題（預計 1-1.5 小時）
2. **暫時保留** - 暫不轉換，標註為「舊版樣式」
3. **刪除** - 從專案中移除（如原計劃）

**建議**: 與用戶討論後決定。如果功能仍有用，建議保留並轉換。

---

### 🔵 低優先級 - 未來改進

#### 6. 測試與優化 (預計 1-2 小時)

**測試清單**:
- [ ] 所有頁面在桌面版正常顯示
- [ ] 所有頁面在手機版正常顯示
- [ ] Element Plus 組件深色主題正確套用
- [ ] 交互狀態 (hover, focus, active) 正確
- [ ] 響應式斷點正常工作
- [ ] 無障礙性檢查 (對比度、鍵盤導航)

**測試指令**:
```bash
# 開發伺服器
npm run dev

# 構建測試
npm run build
npm run preview

# 型別檢查
npm run type-check

# Lint 檢查
npm run lint
```

---

#### 7. 組件化重構 (預計 4-6 小時)

**建立可重用組件**:
- [ ] `PageHeader.vue` - 統一頁面標題
- [ ] `StatsCard.vue` - 統計卡片
- [ ] `EmptyState.vue` - 空狀態組件
- [ ] `DataTable.vue` - 包裝 el-table

**重構現有頁面使用新組件**:
```vue
<!-- Before -->
<header class="text-center pt-8 pb-4">
  <h1 class="text-4xl sm:text-5xl font-bold text-gradient...">標題</h1>
  <p class="text-lg text-gray-400 mt-4">副標題</p>
</header>

<!-- After -->
<PageHeader title="標題" subtitle="副標題" />
```

---

## 📂 專案結構

```
mabinogi-tools/
├── src/
│   ├── api/                 # API 相關
│   │   └── auction.ts
│   ├── components/          # Vue 組件
│   │   ├── CalculateDamage.vue
│   │   ├── CardHeader.vue
│   │   ├── ComplexDataModal.vue
│   │   ├── DamageChart.vue
│   │   ├── DamageCompareChart.vue
│   │   ├── DataGrid.vue
│   │   ├── DebuffTable.vue
│   │   ├── Header.vue
│   │   ├── HelloWorld.vue
│   │   ├── MonsterTable.vue
│   │   ├── PiercingLevelAnalysis.ts
│   │   ├── Sidebar.vue
│   │   ├── StatusTable.vue
│   │   └── WeaponSelector.vue
│   ├── data/                # 資料檔案
│   │   ├── abilities.ts
│   │   ├── debuff.ts
│   │   ├── enchants.ts
│   │   ├── farmModel.ts
│   │   ├── infoForG27Weapon.ts
│   │   ├── materials.ts
│   │   ├── monster.ts
│   │   ├── productionForG27Weapon.ts
│   │   ├── protectionData.ts
│   │   ├── skills.ts
│   │   ├── talent.ts
│   │   ├── upgradeForG27Weapons.ts
│   │   ├── weapon.ts
│   │   └── weaponCategory.ts
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── stores/              # Pinia 狀態管理
│   │   └── layout.ts
│   ├── styles/              # 樣式檔案
│   │   ├── design-tokens.css       ✅ 設計系統
│   │   ├── element-dark-theme.css  ✅ Element Plus 深色主題
│   │   └── (已移除 style.css，使用 index.css)
│   ├── types/               # TypeScript 型別
│   │   ├── Ability.ts
│   │   ├── CraftItem.ts
│   │   ├── Enchant.ts
│   │   ├── Equipment.ts
│   │   ├── FarmModel.ts
│   │   ├── index.ts
│   │   └── Upgrade.ts
│   ├── utils/               # 工具函數
│   │   ├── calculateDebuff.ts
│   │   ├── calculateDefenseAndProtect.ts
│   │   ├── damageCalculate.ts
│   │   └── generateChartOption.ts
│   ├── views/               # 頁面組件
│   │   ├── About.vue                      ❌ 未轉換 (261行)
│   │   ├── DamagePage.vue                 🔵 未在路由 (122行)
│   │   ├── Enchant.vue                    ✅ 已轉換 (363行)
│   │   ├── EquipmentCraftSimulator.vue    ❌ 未轉換 (587行)
│   │   ├── FarmModel.vue                  ❌ 未轉換 (343行)
│   │   ├── GachaSimulator.vue             🔵 空檔案 (0行)
│   │   ├── GridDemo.vue                   🔵 示例頁面 (128行)
│   │   ├── MainLayout.vue                 ✅ 佈局組件 (52行)
│   │   ├── MaterialSimulator.vue          ✅ 已轉換 (553行)
│   │   ├── PierecingLevelAnalysis.vue     🔵 簡單包裝 (21行)
│   │   ├── Settings.vue                   🔵 空頁面 (14行)
│   │   ├── SimpleDamageCompare.vue        🔵 未在路由 (135行)
│   │   ├── TransferSimulator.vue          ✅ 已轉換 (276行)
│   │   └── WeaponUpgradeSimulator.vue     ✅ 已轉換 (432行)
│   ├── App.vue
│   ├── index.css            # 全域樣式
│   ├── main.ts              ✅ 已導入設計系統
│   └── vite-env.d.ts
├── public/                  # 靜態資源
├── .bolt/                   # Bolt.new 相關（可能）
├── .vscode/                 # VS Code 設定
├── .gitattributes          ✅ 行尾統一為 LF
├── .gitignore
├── .prettierrc
├── DisclaimerFun.md        # 趣味免責聲明
├── DisclaimerOfficial.md   # 正式免責聲明
├── GIT_COMMITS.md          ✅ Git 提交規範
├── HANDOVER.md             ✅ 本交接文件
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md               ✅ 專案說明
├── tailwind.config.js      ✅ Tailwind 配置
├── THEME_GUIDE.md          ✅ 主題使用指南
├── tsconfig.app.json
├── tsconfig.app.tsbuildinfo
├── tsconfig.json
├── tsconfig.node.json
├── tsconfig.node.tsbuildinfo
└── vite.config.ts
```

---

## 🔧 開發環境設定

### 必要工具
- Node.js: v18+ 或 v20+
- npm: v9+
- Git

### 安裝依賴
```bash
cd C:\Users\User\.claude-worktrees\mabinogi-tools\happy-jang
npm install
```

### 開發指令
```bash
npm run dev          # 啟動開發伺服器 (http://localhost:5173)
npm run build        # 構建生產版本
npm run preview      # 預覽構建結果
npm run type-check   # TypeScript 型別檢查
npm run lint         # ESLint 檢查
```

### 開發流程
```bash
# 1. 確認在正確分支
git branch  # 應該在 happy-jang

# 2. 確認工作區乾淨
git status  # 應該顯示 clean

# 3. 開始開發
npm run dev

# 4. 修改檔案後測試
# 瀏覽器會自動熱重載

# 5. 提交變更
git add <files>
git commit -m "type(scope): description"

# 6. 推送到遠端（如需要）
git push origin happy-jang
```

---

## 🎨 設計系統使用

### 快速參考

**顏色**:
```vue
<!-- 背景 -->
<div class="bg-gray-900">       <!-- 主背景 -->
<div class="bg-gray-800">       <!-- 卡片背景 -->

<!-- 文字 -->
<h1 class="text-gray-50">       <!-- 主標題 -->
<p class="text-gray-200">       <!-- 次要文字 -->
<span class="text-gray-400">   <!-- 輔助文字 -->
<span class="text-accent">     <!-- 強調文字（金黃色）-->

<!-- 邊框 -->
<div class="border-gray-700">   <!-- 一般邊框 -->
<div class="border-accent/30">  <!-- 強調邊框 -->
```

**工具類別**:
```vue
<!-- 標題漸變 -->
<h1 class="text-gradient">標題</h1>

<!-- 背景紋理 -->
<div class="bg-texture-dark">內容</div>

<!-- 陰影發光 -->
<div class="shadow-glow">卡片</div>
```

**完整指南**: 請參考 `THEME_GUIDE.md`

---

## 🐛 已知問題

### 1. Git 換行符號問題 ✅ 已解決
**問題**: Windows/Linux 換行符號不同導致 Git 顯示大量變更
**解決**: 已添加 `.gitattributes`，統一使用 LF

### 2. Element Plus 深色主題 ✅ 已解決
**問題**: 部分組件需要自定義樣式
**解決**: 已在 `element-dark-theme.css` 中處理
**注意**: 新增組件時記得檢查深色模式

### 3. 頁面轉換進度 ⏸️ 進行中
**問題**: 仍有 3 個頁面未轉換為深色主題
**狀態**: FarmModel.vue、About.vue、EquipmentCraftSimulator.vue 待處理
**優先級**: 高（FarmModel）、中（About）、待決定（EquipmentCraft）

### 4. 手機版佈局 ⏸️ 待改善
**問題**: WeaponUpgrade 在手機上佈局擠壓
**狀態**: 待解決
**優先級**: 高

### 5. 文檔完整性 ⏸️ 部分完成
**問題**: 部分文檔不存在（COMMITS_PAGES.md 等）
**狀態**: 可選擇性建立或整合
**優先級**: 低

---

## 📞 聯絡資訊

### 專案負責人
- **GitHub**: [@eldisa](https://github.com/eldisa)
- **遊戲伺服器**: 娜歐
- **角色ID**: 楓羽戀情

### 參考資源
- [Mabinogi JP Wiki](https://tw-mabinogi.netgamers.jp/)
- [Element Plus 文檔](https://element-plus.org/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)
- [Vue 3 文檔](https://vuejs.org/)

---

## 🚀 Claude Code 使用建議

### 開始工作
```
1. "請幫我打開專案並檢查當前狀態"
2. "執行 npm run dev 啟動開發伺服器"
3. "檢查 FarmModel.vue 的代碼結構"
```

### 實作功能
```
1. "我們開始轉換 FarmModel 為深色主題"
2. "幫我在 Enchant 加入進階搜尋功能"
3. "幫我在 WeaponUpgrade 加入手機版 Tabs"
```

### 測試與提交
```
1. "執行測試確保功能正常"
2. "幫我整理 git diff 並創建 commit"
3. "檢查是否有遺漏的檔案"
```

---

## ✅ 交接檢查清單

在開始工作前，請確認：

- [x] 已閱讀本文檔
- [x] 已查看 `THEME_GUIDE.md`
- [x] 已理解設計系統
- [x] 已了解待完成任務
- [ ] 已檢查專案可以正常運行 (`npm run dev`)
- [x] Git 狀態正常 (working tree clean)
- [ ] 已確認當前在 `happy-jang` 分支

**準備就緒？** 讓我們開始吧！🚀

---

## 📊 快速任務看板

| 任務 | 優先級 | 預計時間 | 狀態 | 負責人 |
|------|--------|----------|------|--------|
| FarmModel 深色主題轉換 | 🔴 高 | 30-45分鐘 | ⏸️ 待開始 | - |
| Enchant 進階搜尋 | 🔴 高 | 2-3小時 | ⏸️ 待開始 | - |
| WeaponUpgrade 手機版 | 🔴 高 | 3-4小時 | ⏸️ 待開始 | - |
| About 深色主題轉換 | 🟡 中 | 30分鐘 | ⏸️ 待開始 | - |
| EquipmentCraft 去留決定 | 🟡 中 | 討論 | ⏸️ 待討論 | - |
| 測試與優化 | 🔵 低 | 1-2小時 | ⏸️ 待開始 | - |
| 組件化重構 | 🔵 低 | 4-6小時 | ⏸️ 未來 | - |

---

**文檔版本**: 2.0
**最後更新**: 2026-01-18
**下次更新**: 功能實作完成後
**更新內容**:
- 修正頁面轉換進度（4/7 而非 6/7）
- 更新實際專案結構
- 移除不存在的文檔引用
- 補充詳細的檔案列表
- 新增快速任務看板
