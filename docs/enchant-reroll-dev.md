# 洗詞條模擬器 開發進度

**最後更新**: 2026-05-02  
**對應檔案**: `src/views/ReforgeSimulator.vue`  
**路由**: `/enchant-reroll`

---

## ✅ 已完成功能

### 1. 裝備與工具選擇
- 裝備大分類（防具 / 武器）→ `el-select`
- 裝備部位 / 類型 → `el-select` + `el-option-group` 分組
- 穿戴限制（種族）→ `el-select`
- 細工道具選擇（圖片 chip，4 種道具）
- 突破機率加倍 checkbox

### 2. 詞條池
- 依裝備類型 + 種族限制動態組合池子
- 搜尋過濾（`filterText`）
- 欄位：✓ 標記 ／ 名稱 ／ 等級（含突破小字）／ 最大效果（含突破小字）
- 點擊列切換為目標（最多 3 個）

### 3. 目標設定
- 多選目標（最多 3 個）
- 每個目標可設定最低等級（`el-input-number`）
- 即時顯示等級達標機率 %

### 4. 機率計算（模擬計算卡片）
- 每次花費輸入（金幣，選填）
- 機率分解：抽中機率（超幾何）+ 各目標等級達標機率 + 合併 p
- 統計表：平均次數 / P50 / P90 / P99 + 對應金幣
- 累積機率表（1、5、10、20、50、100、200、500 次）

### 5. 進行細工（實際抽選）
- **單次細工**：抽 3 個不重複詞條，各自獨立突破，展示結果
- **自動細工**：幾何分布採樣（`N = ceil(log(U)/log(1-p))`），瞬間完成，無 UI 阻塞
- 結果卡片：命中目標 → 綠色邊框 ✓，目標但等級不足 → 橘色 ✗，突破 → 黃色光暈 + badge
- 本次花了 N 次 + 換算金幣（自動模式）
- 累計洗次數 / 成功次數 / 重置紀錄

---

## 📦 資料來源

**檔案**: `scripts/mabi_reforge_slim_with_race.json`  
**解析腳本**: `scripts/parse-reforge.py`

### Library 欄位結構
```json
{
  "名稱": {
    "name": "名稱",
    "maxLevel": 20,
    "maxLevelBreak": 25,
    "stepValue": 1.5,
    "unit": "增加"
  }
}
```
- `maxLevelBreak` = `ceil(maxLevel × 1.25)`（突破上限，腳本計算後寫入）
- `stepValue` = 每等級數值（原 `baseValue`）

### Pools 結構
```json
{
  "categories": { "body": [...], "lance": [...], ... },
  "races": { "human": [...], "elf": [...], ... }
}
```

### 池子篩選邏輯
```
pool = categories[catKey] 中：
  • 不在任何 race pool 的詞條（通用）
  • OR 在當前種族設定允許的 race pool 裡的詞條
```
- 全種族：允許所有 race pool → 等同全部 category 詞條
- 人類/巨人限定 lance：36 通用 + 9 騎槍相關 = 45
- 精靈限定 lance：36 通用（lance 裡沒有純精靈詞條）

### 種族 pool key 映射
| UI 選項 | 包含的 pool keys |
|---------|----------------|
| 全種族 | 全部 |
| 人類限定 | human |
| 精靈限定 | elf |
| 巨人限定 | giant |
| 人類/精靈限定 | human + elf + human_elf |
| 人類/巨人限定 | human + giant + human_giant |

---

## 🗂️ 裝備類型 → Category Key 對照

### 防具
| UI 名稱 | id | categoryKey |
|---------|----|-------------|
| 一般帽 / 重甲頭盔 | hat_normal / hat_heavy | `hat` |
| 布衣 / 輕甲 / 重甲 | cloth / light_armor / heavy_armor | `body` |
| 一般手套 / 重甲手套 | glove_normal / glove_heavy | `glove` |
| 一般鞋 / 重甲鞋 | shoe_normal / shoe_heavy | `shoes` |
| 飾品 | accessory | `accessory` |
| 盾牌 | shield | `shield` |

### 武器
| UI 名稱 | id | categoryKey |
|---------|----|-------------|
| 單手武器 | one_hand | `weapon_melee_oh` |
| 雙手劍 | two_hand_sword | `THSword` |
| 雙手斧/鈍器 | two_hand | `weapon_melee_th` |
| 騎槍 | lance | `lance` |
| 手把 | handle | `handle` |
| 拳套 | knuckle | `knuckle` |
| 鎖鏈鐮刃 | chain | `chainblade` |
| 鐮刀 | scythe | `scythe` |
| 弓 / 弩 | bow / crossbow | `weapon_range` |
| 雙槍 | dual_gun | `dualgun` |
| 手裡劍 | shuriken | `shuriken` |
| 魔杖（治癒） | healing_wand | `healingWand` |
| 三矛魔杖 | tribolt_wand | `triboltWand` |
| 集魔杖 | staff | `staff` |
| 魔導書/水晶球 | grimoire | `orb` |
| 鋼瓶 | cylinder | `cylinder` |
| 樂器 | instrument | `instrument` |

---

## ⚠️ 待確認 / 待處理

### 資料面

| 問題 | 說明 |
|------|------|
| 弩 (`Crossbow.txt`) 獨立資料存在 | 目前 `weapon_range` 只用 `Bow.txt` 作為代表。若弩有不同詞條需拆分 |
| 單手劍 / 單手鈍器 (`OHSword.txt`, `OHBlunt.txt`) | 目前合併進 `weapon_melee_oh`（以 `OHAxe.txt` 為代表）。各種單手武器詞條是否相同待確認 |
| 魔導書 (`book.txt`) 與水晶球 (`orb.txt`) | 目前合併進 `orb`。若詞條不同需拆分 |
| 輕甲 / 重甲 (`lightArmor.txt`, `heavyArmor.txt`) | 目前合併進 `body`（以 `cloth.txt` 為代表）。三者詞條是否相同待確認 |
| 巨人盾牌 (`shield(giant).txt`) | 目前合併進 `shield`。若詞條不同需拆分 |

### 功能面

| 項目 | 狀態 |
|------|------|
| 連續自動細工（快速連點） | 未實作 |
| 歷史紀錄展示（最近 N 次結果） | 未實作 |
| 詞條值顯示格式（部分 unit 帶空格） | 可再打磨 |

---

## 🔧 技術備注

- **自動細工機率採樣**：幾何分布 `N = ceil(log(U) / log(1-p))`，等價於真實模擬，但無論 p 多小都是 O(1)
- **超幾何抽中機率**：k=1 → 3/N，k=2 → 6/(N×(N-1))，k=3 → 6/(N×(N-1)×(N-2))
- **突破等級範圍**：`[maxLevel+1, maxLevelBreak]`，`maxLevelBreak` 直接從資料讀取
- **`constructWinningRoll()`**：自動模式顯示用，保證目標達標，剩餘 slot 隨機填入非目標詞條
