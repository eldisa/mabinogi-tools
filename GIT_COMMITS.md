# Git Commit Messages

以下是本次更新的 Conventional Commits 格式提交訊息：

## 🎨 主要提交

### 1. 建立設計系統
```bash
git add src/styles/design-tokens.css
git commit -m "style: add design system tokens with dark theme variables

- Add comprehensive design tokens for colors, spacing, typography
- Define dark magic theme color palette with gold accents
- Include utility classes for gradients and effects
- Add custom scrollbar styling
- Set up CSS variables for consistent theming across app"
```

### 2. 自定義 Element Plus 深色主題
```bash
git add src/styles/element-dark-theme.css
git commit -m "style: customize Element Plus components for dark theme

- Override Element Plus CSS variables for dark mode
- Style all major components (Card, Table, Input, Select, etc.)
- Add dark theme colors with gold accent (#fbbf24)
- Improve component contrast and readability
- Add custom hover and focus states"
```

### 3. 更新 Tailwind 配置
```bash
git add tailwind.config.js
git commit -m "feat(config): extend Tailwind config with custom theme

- Add custom color palette matching design system
- Define accent colors (gold theme)
- Add custom spacing, border radius, and shadows
- Include custom animations (fade-in, slide-up, slide-down)
- Add background gradient utilities
- Configure custom font families"
```

### 4. 導入樣式到主程式
```bash
git add src/main.ts
git commit -m "chore: import design system and theme styles in main.ts

- Import design-tokens.css for global CSS variables
- Import element-dark-theme.css for component styling
- Ensure styles load before app initialization"
```

### 5. 轉換 MaterialSimulator 為深色主題
```bash
git add src/views/MaterialSimulator.vue
git commit -m "style: convert MaterialSimulator to dark theme

- Replace light background (bg-gray-100) with dark (bg-gray-900)
- Update cards to use dark theme styling
- Add texture background pattern
- Convert text colors for proper contrast
- Update header with gradient text effect
- Align with unified design system"
```

### 6. 建立主題使用指南
```bash
git add THEME_GUIDE.md
git commit -m "docs: add comprehensive theme usage guide

- Document color palette and design tokens
- Provide Vue component examples
- Include CSS variable reference
- Add migration checklist for existing pages
- Create troubleshooting section
- Add complete page template example"
```

## 📦 一次性提交（如果想要合併）

```bash
git add src/styles/ tailwind.config.js src/main.ts src/views/MaterialSimulator.vue THEME_GUIDE.md
git commit -m "style: establish unified dark theme design system

BREAKING CHANGE: Implement dark magic theme across application

Features:
- Add comprehensive design tokens (colors, spacing, typography)
- Customize Element Plus components for dark mode
- Extend Tailwind config with custom theme utilities
- Add gold accent color (#fbbf24) as primary theme
- Include texture backgrounds and gradient effects

Changes:
- Convert MaterialSimulator.vue to dark theme as reference
- Import design system in main.ts
- Add detailed theme usage guide (THEME_GUIDE.md)

Migration:
- See THEME_GUIDE.md for step-by-step migration instructions
- All new pages should follow dark theme guidelines
- Existing pages require gradual migration

Design System:
- Background: #111827 (gray-900)
- Cards: #1f2937 (gray-800)
- Accent: #fbbf24 (yellow-400 gold)
- Text: #f9fafb (gray-50)
- Borders: #374151 (gray-700)"
```

## 🔄 後續提交（轉換其他頁面時使用）

### 轉換單一頁面
```bash
# 例如：Enchant.vue
git add src/views/Enchant.vue
git commit -m "style(enchant): ensure consistent dark theme styling

- Verify all colors match design system
- Update any remaining light theme elements
- Align with THEME_GUIDE.md standards"
```

```bash
# 例如：WeaponUpgradeSimulator.vue
git add src/views/WeaponUpgradeSimulator.vue
git commit -m "style(weapon-upgrade): align with unified dark theme

- Ensure consistency with design tokens
- Update card styling to match standard
- Verify gold accent usage"
```

```bash
# 例如：TransferSimulator.vue
git add src/views/TransferSimulator.vue
git commit -m "style(transfer): convert to unified dark theme

- Replace custom colors with design tokens
- Update component styling
- Align with theme guide standards"
```

### 建立可重用組件
```bash
git add src/components/PageHeader.vue
git commit -m "feat(components): add reusable PageHeader component

- Create standardized page header component
- Include title and subtitle props
- Support optional icon prop
- Apply consistent gradient text styling
- Reduce code duplication across pages"
```

## 📝 Commit 類型說明

- **feat**: 新功能
- **fix**: Bug 修復
- **docs**: 文檔更新
- **style**: 代碼格式、樣式調整（不影響功能）
- **refactor**: 代碼重構
- **perf**: 性能優化
- **test**: 測試相關
- **chore**: 建構過程或輔助工具的變動
- **build**: 影響建構系統或外部依賴
- **ci**: CI 配置文件和腳本的更改

## 🎯 Commit 範圍 (scope)

- **config**: 配置文件
- **components**: 組件
- **views**: 頁面
- **styles**: 樣式
- **utils**: 工具函數
- **api**: API 相關
- **router**: 路由
- **store**: 狀態管理

## 💡 最佳實踐

1. **使用現在式**: "add feature" 而非 "added feature"
2. **首字母小寫**: "add" 而非 "Add"
3. **簡潔明瞭**: 第一行不超過 72 字符
4. **詳細說明**: 可以在空行後添加更多細節
5. **關聯 Issue**: 使用 "Closes #123" 關閉相關 issue

## 📌 範例

### 好的 Commit
```bash
git commit -m "feat(components): add loading skeleton for data tables

- Implement el-skeleton for loading states
- Add smooth fade-in animation
- Improve perceived performance
- Enhance user experience during data fetching

Closes #42"
```

### 不好的 Commit
```bash
git commit -m "updated stuff"
git commit -m "fix bug"
git commit -m "WIP"
```

---

**參考資料：**
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
