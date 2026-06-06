# 稱號資料更新指南

## 資料來源

`src/data/title.json` 由遊戲客戶端的兩個檔案解析而來：

| 檔案 | 內容 |
|------|------|
| `data/db/Title.xml` | 稱號基本資訊、效果數值、Duration、Exclusive |
| `data/local/xml/Title.taiwan.txt` | 繁中翻譯（名稱、EffectDescription、Hint） |

---

## title.json 結構

```json
{
  "_meta": { /* 來源路徑備忘，可更新 */ },
  "data": [
    {
      "ID": "16071",
      "Type": "3",           // 見下方類型說明
      "Exclusive": "0",      // "1" = 專屬稱號
      "Duration": "0",       // 0=永久；其他=秒數（e.g. 86400=1天）
      "DefaultName": "支配信仰裂隙之人",
      "MaleName": "...",
      "FemaleName": "...",
      "UniName": "...",
      "Desc": "...",
      "Hint": "...",         // 取得方式說明，過濾邏輯靠此欄位判斷
      "Effect": "...",       // 遊戲內 script，可不理
      "EffectDescription": "最大傷害值增加38\\n...",
      "ExpDungeonDisable": "false",
      "EnableSupportRace": "0",
      "OptionUsage": "0",
      "locale": {
        "include": null,     // null = 全地區；["taiwan"] = 限定地區
        "exclude": []        // ["taiwan"] = 台服排除
      },
      "abilities": [         // 預先解析的能力值，供程式直接使用
        { "id": "attack_max", "value": 38 }
      ]
    }
  ]
}
```

### Type 對應

| Type | 顯示名稱 | 說明 |
|------|---------|------|
| 1 | 一般稱號 | 一般獲得的第1稱號 |
| 2 | 打工稱號 | 生活技能相關 |
| 3 | 一般稱號 | 同 Type 1（首通/活動等也在此） |
| 4 | 變身稱號 | 種族/變身限定 |
| 5 | 寵物稱號 | 寵物用 |
| 6 | 假稱號 | 系統用，不實際展示 |
| 7 | 二次稱號 | 第2稱號 |

> **注意**：Type 1 與 Type 3 在功能上相同，皆屬「第1稱號」，程式過濾時需同時納入兩者。

---

## 更新流程（遊戲版本更新後）

### 步驟 1：解析遊戲客戶端

從補丁解壓取得以下兩個檔案：
- `data/db/Title.xml`
- `data/local/xml/Title.taiwan.txt`

將新增或修改的稱號條目手動（或用腳本）合併至 `src/data/title.json`。

**注意事項**：
- `abilities` 陣列需從 `Effect` 欄位中解析，常見的 ID 對照：
  ```
  AttMax         → attack_max
  MagicAttack    → magic_attack
  CritDamage     → critical_damage
  BonusDamage    → bonus_damage
  Hurry          → move_speed
  alchemy_water  → water_alchemy_damage
  alchemy_fire   → fire_alchemy_damage
  alchemy_wind   → wind_alchemy_damage
  alchemy_earth  → earth_alchemy_damage
  ```
- `EffectDescription` 中的換行用 `\\n` 表示（JSON 字串）

---

### 步驟 2：確認過濾邏輯是否需要更新

`src/utils/titleFilters.ts` 包含三個過濾函數，新稱號通常**不需要改動**，但有例外：

#### 自動偵測（不需維護）

```ts
// 期限稱號：Duration != 0 OR Hint 含時效說明
isTimedTitle(t)
// → 偵測：Duration !== "0"
// → 偵測 Hint 包含：一定時間 / 一定期間 / 一段時間

// 排名稱號：Hint 含排名資訊
isRankingTitle(t)
// → 偵測 Hint 包含：排名第\d / 每週排名 / TOP \d
```

新的期限或排名稱號**只要 Hint 寫法一致，會自動被過濾**，不需手動加 ID。

#### 手動維護（需要時更新）

```ts
// 絕版稱號：無法再獲得的活動/首殺稱號
export const obsoleteTitleIds = new Set([
  "18153", // 布里萊赫征服者（競速活動）
  "18154", // 布里萊赫擊破者（競速活動）
  "18155", // 布里萊赫巡行者（競速活動）
  "18158", // 布里萊赫挑戰者（競速活動）
  "16028", // 墳墓的關閉者（伺服器首殺）
]);
```

**何時需要新增**：
- 活動期間的特殊稱號（競速、首殺等），活動結束後加入
- 確認台服已不再發放

---

### 步驟 3：確認稱號頁面顯示正確

```bash
npm run dev
# 前往 /#/title
# 搜尋新稱號名稱，確認有出現
# 開啟「篩選設定」，確認 excludeTimed/excludeRanking 行為正確
```

---

## 常見問題排查

### 稱號搜不到

1. 確認已加入 `data` 陣列
2. 確認 `DefaultName` 不是 `"none"`
3. 確認 `locale.include` 不排除 taiwan
4. 確認 `DefaultName` / `Desc` / `Hint` / `EffectDescription` 沒有韓文字元（有韓文的會被自動過濾）
5. 確認稱號不符合 `isTimedTitle` 或 `isRankingTitle` 的條件（若符合，開啟篩選時會被隱藏）

### 頂裝差距的稱號選單沒有出現

- 確認稱號有 `EffectDescription` 欄位且不為空
- 確認 `UniName` / `MaleName` / `FemaleName` 至少一個不是 `"none"`
- 同樣適用 `isTimedTitle` / `isRankingTitle` 的過濾規則

### 期限稱號沒被過濾

- 若 `Duration === "0"` 但實際有時效，確認 Hint 是否包含「一定時間」等關鍵字
- 若關鍵字不同，可在 `isTimedTitle` 的正則中補充

---

## 相關檔案

| 檔案 | 用途 |
|------|------|
| `src/data/title.json` | 稱號資料本體 |
| `src/utils/titleFilters.ts` | 共用過濾函數（絕版/期限/排名） |
| `src/views/Title.vue` | 稱號查詢頁面 |
| `src/views/GearGapChecker.vue` | 頂裝差距（第1/第2稱號選單） |
