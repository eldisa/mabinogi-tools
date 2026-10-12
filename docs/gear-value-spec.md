# 裝備效益換算（/gear-value）規格與待辦

頁面：`src/views/GearValue.vue`，路由 `/gear-value`，側邊欄「裝備效益換算」。

## 目標
把賦予／稱號／娃娃背包／細工的素質換算成同一個單位「等同大傷」，用來比較裝備、稱號、道具的效益，並挑出最高效益的配置（例如賦予）。

## 架構
| 檔案 | 作用 |
| --- | --- |
| `src/data/gearValue.ts` | 與職業無關的通用引擎：`ValueProfile`（`statWeights` 每單位等同大傷、`levelWeights` 細工每級、`aliases` 詞條別名、`weaponTypes` 該職業可用武器類型）、`valueOfStat`、`valueOfReforge`、`parseEffectText`（解析稱號文字）、`applyOverrides` |
| `src/data/gearValueShieldKnight.ts` | 聖盾騎士的效益檔：把 `calculateDamageEfficiency` 的結果對應到能力名稱。**其他職業各自新增一份** |
| `src/data/enchantSlots.ts` | 武器類型（`QUICK_WEAPON_OPTIONS`）、部位、副手限制、`enchantsForSlot()`、`formatRank` |
| `src/data/enchantView.ts` | 賦予顯示用小工具（能力排序、`renderAbilities`、`getSourceLabel`、`mergeEffects` 等） |
| `src/components/EnchantQuickView.vue` | 賦予快速檢視（賦予查詢頁與效益換算共用）。`scorer` 外部評分、`showEffect` 只顯示必要詞條、`allowedWeapons` 限定職業武器、`relevantOnly` |
| `src/components/WeaponTypeSelect.vue` | 武器大類＋武器類型兩段式選單 |

資料來源：`src/data/enchants.ts`、`src/data/title.json`（稱號 EffectDescription 文字）、`src/data/doll_bags.json`、`scripts/mabi_reforge_slim_with_race.json`（細工，`pools.categories` 依部位）。

## 效益來源（頁面最上方）
1. 聖盾騎士計算器目前設定（讀 localStorage `shield_knight_calc_autosave_v1`，即時算 `calculateDamageEfficiency`；面板大傷／技能次數沒填時暫用 2000／範本並標明）。
2. 已儲存的傷害效益快照（`shield_knight_calc_efficiency_snapshots_v1`）。
3. 自行輸入。
效益表可逐項手動覆蓋（localStorage `gear_value_overrides_v1`）。

## 兩個 Tab
1. **資料查詢**：賦予（EnchantQuickView，依武器類型／部位排接頭接尾，只顯示有換算值的詞條）／稱號／娃娃背包／細工，依「相當大傷」排序。
2. **細工評價**：先選部位 → 選細工詞條 → 填等級（到突破等級），可比較「目前」與「候選」兩組（localStorage `gear_value_reforge_sets_v1`），並列出該部位效益最高的細工詞條。

## 已定案的規則
- 計算器的暴擊率視為已達上限（上限只能靠卡莉亞赫的結界或活動 buff 拉高）：賦予／稱號／細工提供的「暴擊率」忽略（權重 0）；傷害效益的「暴擊率上限」對應能力「暴擊上限增加」。
- 賦予同一個能力出現多筆通常是條件效果，只取第一筆（無條件基本值），並標示「另有條件效果未計」。
- 賦予以最大值、細工以滿突破等級換算；效益是邊際值（線性近似），一次加很多會有誤差。
- 聖盾騎士只能用「單手武器+盾」（`ValueProfile.weaponTypes`）。

## 待辦（依建議優先順序）
1. ✅ 已完成（`src/data/gearValueBestSet.ts`，匈牙利演算法做指派，頁面「最高效益配置」分頁；袍/翅膀、月餅可關）。**最高效益配置**：依部位自動組出整套賦予（每個部位挑接頭＋接尾各一，注意：同一個賦予不能重複、專用／綁定限制、袍/翅膀與月餅選填、武器與副手），顯示總分與每部位明細；可以選「不綁專」「裝備破袍」。目前只有每格前 N 名的排序。
2. ✅ 稱號解析覆蓋率已檢查：補了「增加保護 5」寫法、修正「魔法防禦」被重複算成「防禦」；其餘未解析寫法（防禦力、生命力、最大攻擊、沒寫「增加」的行等）經使用者決定**不補**，清單見 `parseEffectText` 的註解範圍外（稱號 ID：49、5038、9042、9184、10065、10190、10548、10602、10739、10997、11007、11024、30038）。
3. ✅ 已決定：力量／智力／敏捷／意志／最大耐力／最大魔法值維持「未計入」，細工「[變身中]」專用詞條維持未計入（使用者可在效益表自行新增）。
4. **整套裝備儲存／比較**：把賦予＋細工＋稱號的整套配置存成具名方案並比較總分。
5. **其他職業的效益檔**：仿 `gearValueShieldKnight.ts` 新增（含 `weaponTypes`），頁面加職業切換。需要先有該職業計算器的傷害效益輸出，沒有的先用手動輸入。
6. 檢視 UI：賦予區沒有標示條件效果未計、未對應能力的提示（EnchantQuickView 傳 `showEffect` 後只顯示必要詞條）。

## 注意
- 專案語言：回覆與 UI 一律繁體中文。
- `npm run type-check`（根 tsconfig）實際沒檢查到 `src`；請用只含自己檔案的暫時 tsconfig（`extends ./tsconfig.app.json`，`include` 指定檔案）跑 `npx vue-tsc -p … --noEmit`。
- 聖盾騎士計算器（`src/views/ShieldKnightCalculator.vue`、`src/data/shieldKnightCalculator.ts`、`src/data/mabinogiCombat.ts`）由另一個 session 持續修改，請不要改動這些檔案；需要新的匯出時先檢查是否已有。
- 不要 commit 其他 session 留在工作樹的未提交變更（README、scripts、Sidebar 其他行等）；不要 push，除非使用者要求。
