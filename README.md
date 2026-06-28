# 瑪奇小工具 Mabinogi Tools

Vue 3 + TypeScript + Vite + Element Plus 打造的瑪奇遊戲工具集合

**線上版本**: https://eldisa.github.io/mabinogi-tools/

> 🎨 本專案採用統一的**深色魔幻風格**主題。完整的設計系統（配色方案、設計令牌、組件範例、設計檔案位置）已整理於 [主題使用指南 (THEME_GUIDE.md)](./THEME_GUIDE.md)。

## 🚀 功能模組

### 裝備
- ⚙️ **裝備改造模擬器** - 規劃最佳改造路線
- 📦 **材料計算機** - 精確計算製作所需材料
- 💰 **裝備繼承費用估算** - 估算能力轉移成本

### 資料查詢
- 🪄 **賦予查詢** - 查詢賦予卷軸資訊
- 🏷️ **稱號查詢** - 查詢稱號能力與來源
- 🎒 **娃娃背包查詢** - 查詢娃娃背包效果與自動拾取分類
- 🏠 **農場模型查詢** - 農場模型資料查詢

### 機率模擬（要拚）
- 🪙 **布里萊赫硬幣模擬器** - 模擬硬幣抽取
- 🎲 **賭石小遊戲** - 模擬賭石體驗
- 🔧 **細工模擬器** - 模擬細工強化
- 💧 **聖水模擬器** - 模擬聖水強化
- 🪨 **回音石模擬器** - 模擬回音石強化

### 戰鬥 / 分析
- 📈 **頂裝差距** - 比較頂裝能力差距
- 🎵 **音樂計算機** - 計算演奏增益（戰場的序曲 / 活潑板 / 進行曲 / 豐年歌 / 忍耐的音樂）
- 📊 **傷害計算分析** - 傷害組成分析

### 副本練習
- 🏆 **1王機制練習** ／ **2關機制練習** ／ **4王安全屋計時** ／ **4王65%躲彈幕**

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

- [主題使用指南](./THEME_GUIDE.md) - 設計系統完整說明（配色方案、設計令牌、組件範例、設計檔案）
- [Git 提交規範](./GIT_COMMITS.md) - Conventional Commits 格式

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
**Last Updated**: 2026-06-25
**Maintained by**: Bowei
