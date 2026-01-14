# 瑪奇小工具 - 主題使用指南

## 🎨 設計系統概覽

本專案採用 **深色魔幻風格** 主題，以下是統一的設計規範。

---

## 📦 已安裝的設計資源

### 1. **Design Tokens** (`src/styles/design-tokens.css`)
包含所有設計變數：顏色、間距、字體、陰影等

### 2. **Element Plus Dark Theme** (`src/styles/element-dark-theme.css`)
Element Plus 組件的深色主題自定義樣式

### 3. **Tailwind Config** (`tailwind.config.js`)
擴展的 Tailwind 配置，包含自定義顏色和工具類

---

## 🎨 配色方案

### 主色調
```css
背景色：
- bg-gray-900   (#111827)  - 主要背景
- bg-gray-800   (#1f2937)  - 卡片/面板
- bg-gray-700   (#374151)  - 懸停/次要元素

強調色（金黃主題）：
- accent        (#fbbf24)  - 主要強調
- accent-light  (#fcd34d)  - 淺色
- accent-dark   (#f59e0b)  - 深色

文字色：
- text-gray-50  (#f9fafb)  - 主要文字
- text-gray-200 (#e5e7eb)  - 次要文字
- text-gray-400 (#9ca3af)  - 輔助文字
```

### 狀態顏色
```css
成功: text-green-400  (#10b981)
警告: text-yellow-400 (#fbbf24)
錯誤: text-red-400    (#ef4444)
資訊: text-blue-400   (#3b82f6)
```

---

## 📝 使用範例

### 1. **頁面容器**
```vue
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
    <div class="max-w-7xl mx-auto">
      <!-- 內容 -->
    </div>
  </div>
</template>
```

### 2. **頁面標題**
```vue
<header class="text-center pt-8 pb-4">
  <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
    頁面標題
  </h1>
  <p class="text-lg text-gray-400 mt-4">頁面副標題描述</p>
</header>
```

**工具類說明：**
- `text-gradient`: 金黃色漸變文字（已預定義）
- `bg-texture-dark`: 深色紋理背景（已預定義）

### 3. **卡片組件**
```vue
<el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6">
  <!-- 卡片標題 -->
  <div class="border-b border-gray-700 pb-4 mb-6">
    <h2 class="text-2xl font-bold text-accent">卡片標題</h2>
  </div>
  
  <!-- 卡片內容 -->
  <div class="space-y-4">
    <!-- 內容 -->
  </div>
</el-card>
```

**樣式說明：**
- `border-accent/30`: 30% 透明度的金黃邊框
- `shadow-lg`: 大型陰影
- `rounded-xl`: 大圓角

### 4. **表格**
```vue
<el-table 
  :data="tableData"
  stripe
  style="width: 100%"
>
  <el-table-column prop="name" label="名稱" />
  <el-table-column prop="value" label="數值" align="right" />
</el-table>
```

Element Plus 表格已自動套用深色主題，無需額外配置。

### 5. **按鈕**
```vue
<!-- 主要按鈕 (金黃色) -->
<el-button type="primary">主要操作</el-button>

<!-- 次要按鈕 (透明邊框) -->
<el-button>次要操作</el-button>

<!-- 危險按鈕 -->
<el-button type="danger">刪除</el-button>

<!-- Plain 樣式 -->
<el-button type="primary" plain>Plain 按鈕</el-button>
```

### 6. **表單**
```vue
<el-form label-width="140px" label-position="left">
  <el-form-item label="選項">
    <el-select v-model="value" placeholder="請選擇">
      <el-option label="選項1" value="1" />
      <el-option label="選項2" value="2" />
    </el-select>
  </el-form-item>
  
  <el-form-item label="輸入">
    <el-input v-model="text" placeholder="請輸入" />
  </el-form-item>
</el-form>
```

### 7. **標籤 (Tag)**
```vue
<el-tag type="primary">主要</el-tag>
<el-tag type="success">成功</el-tag>
<el-tag type="warning">警告</el-tag>
<el-tag type="danger">危險</el-tag>
<el-tag type="info">資訊</el-tag>
```

### 8. **分隔線**
```vue
<el-divider content-position="center">
  <span class="text-xl font-bold text-accent">📊 統計分析</span>
</el-divider>
```

### 9. **空狀態**
```vue
<el-empty 
  description="沒有資料"
  :image-size="200"
/>
```

---

## 🎯 CSS 變數使用

### 在 Vue 組件中使用
```vue
<style scoped>
.custom-element {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-accent);
  color: var(--color-text-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-glow);
}
</style>
```

### 常用變數速查
```css
/* 背景 */
var(--color-bg-primary)       /* #111827 */
var(--color-bg-secondary)     /* #1f2937 */

/* 文字 */
var(--color-text-primary)     /* #f9fafb */
var(--color-text-secondary)   /* #e5e7eb */

/* 強調 */
var(--color-accent-primary)   /* #fbbf24 */
var(--color-accent-secondary) /* #f59e0b */

/* 邊框 */
var(--color-border-primary)   /* #374151 */
var(--color-border-accent)    /* rgba(251, 191, 36, 0.3) */

/* 間距 */
var(--spacing-sm)  /* 8px */
var(--spacing-md)  /* 16px */
var(--spacing-lg)  /* 24px */

/* 圓角 */
var(--radius-md)   /* 8px */
var(--radius-lg)   /* 12px */
var(--radius-xl)   /* 16px */

/* 陰影 */
var(--shadow-glow) /* 金黃發光效果 */
```

---

## 🚀 快速開始 Checklist

### 轉換現有頁面為深色主題

- [ ] 1. 更新主容器
```vue
<!-- 舊 -->
<div class="min-h-screen bg-gray-100 p-4">

<!-- 新 -->
<div class="min-h-screen bg-gray-900 text-gray-100 p-4 bg-texture-dark">
```

- [ ] 2. 更新標題
```vue
<!-- 舊 -->
<h1 class="text-3xl font-bold text-gray-800">標題</h1>

<!-- 新 -->
<h1 class="text-4xl sm:text-5xl font-bold text-gradient font-serif drop-shadow-lg">
  標題
</h1>
```

- [ ] 3. 更新卡片
```vue
<!-- 舊 -->
<el-card class="bg-white shadow-sm">

<!-- 新 -->
<el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl">
```

- [ ] 4. 更新文字顏色
```vue
<!-- 舊 -->
<p class="text-gray-600">描述文字</p>

<!-- 新 -->
<p class="text-gray-400">描述文字</p>
```

- [ ] 5. 檢查所有硬編碼的顏色值
搜尋 `bg-blue-`, `bg-white`, `text-gray-800` 等並替換

---

## 📊 完整頁面範例

```vue
<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 bg-texture-dark">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- 頁面標題 -->
      <header class="text-center pt-8 pb-4">
        <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
          頁面標題
        </h1>
        <p class="text-lg text-gray-400 mt-4">頁面副標題或描述</p>
      </header>

      <!-- 主要內容卡片 -->
      <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
        <!-- 卡片標題 -->
        <div class="border-b border-gray-700 pb-4 mb-6">
          <h2 class="text-2xl font-bold text-accent">功能區塊</h2>
        </div>

        <!-- 表單 -->
        <el-form label-width="140px" label-position="left">
          <el-form-item label="選擇選項">
            <el-select v-model="selectedValue" placeholder="請選擇">
              <el-option label="選項 1" value="1" />
              <el-option label="選項 2" value="2" />
            </el-select>
          </el-form-item>

          <el-form-item label="輸入文字">
            <el-input v-model="inputText" placeholder="請輸入" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary">提交</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- 結果展示 -->
      <el-card class="bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-6 sm:p-8">
        <div class="border-b border-gray-700 pb-4 mb-6">
          <h2 class="text-2xl font-bold text-accent">結果</h2>
        </div>

        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="name" label="名稱" />
          <el-table-column prop="value" label="數值" align="right" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const selectedValue = ref('');
const inputText = ref('');
const tableData = ref([
  { name: '項目 1', value: 100 },
  { name: '項目 2', value: 200 },
]);
</script>
```

---

## ⚠️ 注意事項

1. **避免使用淺色背景**
   - ❌ `bg-white`, `bg-gray-100`, `bg-blue-50`
   - ✅ `bg-gray-900`, `bg-gray-800`, `bg-gray-700`

2. **文字顏色對比度**
   - 深色背景上使用淺色文字
   - ✅ `text-gray-100`, `text-gray-200`
   - ❌ `text-gray-800`, `text-gray-900`

3. **強調色使用**
   - 主要 CTA 按鈕：`type="primary"` (金黃色)
   - 標題強調：`text-accent` 或 `text-gradient`
   - 邊框強調：`border-accent/30` (30% 透明度)

4. **響應式設計**
   - 保持使用 `sm:`, `md:`, `lg:` 斷點
   - 確保在手機、平板、桌面上都能正常顯示

5. **Element Plus 組件**
   - 大部分組件已自動套用深色主題
   - 如需自定義，使用 `:deep()` 選擇器

---

## 🔧 疑難排解

### Q: Element Plus 組件顏色沒變？
A: 確保 `src/styles/element-dark-theme.css` 已在 `main.ts` 中導入

### Q: 自定義樣式無效？
A: 使用 `:deep()` 穿透樣式作用域
```vue
<style scoped>
:deep(.el-card) {
  background-color: var(--color-bg-secondary);
}
</style>
```

### Q: 如何臨時使用淺色？
A: 為特定元素添加 `data-theme="light"` 屬性
```vue
<div data-theme="light">
  <!-- 這裡會使用淺色主題 -->
</div>
```

---

## 📚 參考資源

- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Element Plus 文檔](https://element-plus.org/)
- [設計令牌 (Design Tokens)](./design-tokens.css)
- [Element Plus 深色主題](./element-dark-theme.css)

---

**最後更新：** 2025-01-12
**維護者：** Bowei
