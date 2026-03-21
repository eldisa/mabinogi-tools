# 瑪奇小工具 Mabinogi Tools

Vue 3 + TypeScript + Vite + Element Plus 打造的瑪奇遊戲工具集合

**線上版本**: https://eldisa.github.io/mabinogi-tools/

## 🎨 設計系統

本專案採用統一的**深色魔幻風格**主題設計：

- 🌑 **深色背景**: 減少眼睛疲勞，適合長時間使用
- ✨ **金黃強調**: 符合瑪奇魔幻奇幻的遊戲風格
- 📐 **設計令牌**: 完整的設計變數系統，確保一致性
- 🎯 **Element Plus 深色主題**: 所有組件統一深色樣式

詳細使用說明請參考 [主題使用指南 (THEME_GUIDE.md)](./THEME_GUIDE.md)

## 🚀 功能模組

- ⚙️ **裝備改造模擬器** - 規劃最佳改造路線
- 📦 **材料計算機** - 精確計算製作所需材料
- 💰 **裝備繼承費用估算** - 估算轉移成本
- 🪄 **賦予查詢** - 查詢賦予卷軸資訊
- 🏠 **農場模型查詢** - 農場模型資料查詢
- 🏷️ **稱號查詢** - 查詢稱號能力與來源
- 🎰 **賭石小遊戲** - 模擬賭石體驗
- 🧪 **煉金術傷害計算器** - 計算煉金術技能傷害
- 🎒 **娃娃背包查詢** - 查詢娃娃背包效果與自動拾取分類

## 🛠️ 技術棧

- **框架**: Vue 3 + TypeScript + Vite
- **UI 框架**: Element Plus + Tailwind CSS
- **狀態管理**: Pinia
- **路由**: Vue Router
- **圖表**: ECharts
- **表格**: AG Grid

## 📦 安裝與運行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建構生產版本
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 📚 文檔

- [主題使用指南](./THEME_GUIDE.md) - 設計系統完整說明
- [Git 提交規範](./GIT_COMMITS.md) - Conventional Commits 格式
- [整合指南](./INTEGRATION_GUIDE.md) - 新功能整合說明

## 🎨 設計資源

### 配色方案
```css
主背景: #111827 (gray-900)
卡片背景: #1f2937 (gray-800)
強調色: #fbbf24 (gold-400)
文字色: #f9fafb (gray-50)
```

### 設計檔案
- `src/styles/design-tokens.css` - 設計令牌
- `src/styles/element-dark-theme.css` - Element Plus 深色主題
- `tailwind.config.js` - Tailwind 自定義配置

## 🤝 貢獻指南

1. Fork 本專案
2. 創建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改（遵循 [Conventional Commits](./GIT_COMMITS.md)）
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

### Commit 格式
```bash
<type>(<scope>): <subject>

# 範例
feat(components): add PageHeader component
style(material): convert to dark theme
docs: update theme usage guide
```

## 📄 授權

本專案使用 MIT 授權條款

## 🔗 相關連結

- [瑪奇官方網站](https://mabinogi.nexon.com/)
- [Element Plus 文檔](https://element-plus.org/)
- [Vue 3 文檔](https://vuejs.org/)
- [Tailwind CSS 文檔](https://tailwindcss.com/)

---

**Version**: 0.0.0
**Last Updated**: 2025-02-05
**Maintained by**: Bowei
