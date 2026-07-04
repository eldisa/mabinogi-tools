// 符文（Ogham）祕法組合資料 — 由 labanyu 韓服工具站 __NEXT_DATA__ 抽取並翻譯繁中
// 圖片熱連結外站 CDN；技能名與說明為機器輔助翻譯，可能需校正

export interface OghamComboEffect {
    category: "祕法" | "主要才能" | "屬性";
    special?: boolean;
    option: string;
    base: string;
    skillName?: string;
    skillIcon?: string;
}
export interface OghamCombo {
    id: number;
    skillName: string;
    skillIcon?: string;
    inGameImg?: string | null;
    words: string[];
    points: Record<string, string>;
}
export interface OghamArcana {
    id: number;
    name: string;
    icon?: string;
    mainTalent: string;
    subTalent: string;
    combos: OghamCombo[];
    effectTable: OghamComboEffect[];
}

export const oghamArcanas: OghamArcana[] = [
    {
        "id": 1,
        "name": "元素騎士",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974455716.webp",
        "mainTalent": "近距離戰鬥",
        "subTalent": "魔法",
        "combos": [
            {
                "id": 1,
                "skillName": "閃電重擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278423237.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782745535218.webp",
                "words": [
                    "貝赫",
                    "科爾",
                    "凱爾特"
                ],
                "points": {
                    "5": "閃電重擊: 雷神\n\n閃電重擊 傷害倍率 400% 增加\n可攻擊距離 12m\n閃電重擊 指定的敵人 7次攻擊\n閃電重擊 使用時 4秒 持續 [雷神] 狀態獲得\n[雷神] 狀態下 重擊 使用時 重擊 傷害倍率 200% 增加, [雷神] 狀態 結束\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 600%,\n以冰風車 冰結的 對敵人 1680% 追加傷害\n冷卻時間 10秒",
                    "6": "閃電重擊: 雷神\n\n閃電重擊 傷害倍率 700% 增加\n可攻擊距離 12m\n閃電重擊 指定的敵人 7次攻擊\n閃電重擊 使用時 4秒 持續 [雷神] 狀態獲得\n[雷神] 狀態下 重擊 使用時重擊 傷害倍率 250% 增加, [雷神] 狀態 結束\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 600%,\n以冰風車 冰結的 對敵人 1680% 追加傷害\n冷卻時間 10秒",
                    "7": "閃電重擊: 雷神\n\n閃電重擊 傷害倍率 1000% 增加\n可攻擊距離 12m\n閃電重擊 指定的敵人 7次攻擊\n閃電重擊 使用時 4秒 持續 [雷神] 狀態獲得\n[雷神] 狀態下 重擊 使用時 重擊 傷害倍率 300% 增加, [雷神] 狀態 結束\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 600%,\n以冰風車 冰結的 對敵人 1680% 追加傷害\n冷卻時間 10秒",
                    "8": "閃電重擊: 雷神\n\n閃電重擊 傷害倍率 1300% 增加\n可攻擊距離 12m\n閃電重擊 指定的敵人 7次攻擊\n閃電重擊 使用時 4秒 持續 [雷神] 狀態獲得\n[雷神] 狀態下 重擊 使用時 重擊 傷害倍率 350% 增加, [雷神] 狀態 結束\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 600%,\n以冰風車 冰結的 對敵人 1680% 追加傷害\n冷卻時間 10秒",
                    "9": "閃電重擊: 雷神\n\n閃電重擊 傷害倍率 1600% 增加\n可攻擊距離 12m\n閃電重擊 指定的敵人 7次攻擊\n閃電重擊 使用時 4秒 持續 [雷神] 狀態獲得\n[雷神] 狀態下 重擊 使用時 重擊 傷害倍率 500% 增加, [雷神] 狀態 結束\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 600%,\n以冰風車 冰結的 對敵人 1680% 追加傷害\n冷卻時間 10秒"
                }
            },
            {
                "id": 2,
                "skillName": "火葉攻擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278421478.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782746427919.webp",
                "words": [
                    "寧",
                    "路斯",
                    "烏爾"
                ],
                "points": {
                    "5": "火葉攻擊: 完全燃燒\n\n使用者的倒地攻擊 傷害 + 技能 傷害 攻擊\n可攻擊距離 : 使用者的倒地攻擊 距離 +1.2m\n火葉攻擊 攻擊 半徑 +1.5m\n\n[燃燒], [完全燃燒] 狀態 全部 沒有時 時 火葉攻擊 使用時 [燃燒] 狀態獲得\n\n[燃燒] 狀態下 近距離 前투 才能/魔法 才能/火葉攻擊 除外 元素 騎士 技能 攻擊 時, [完全燃燒] 狀態 最大 5層直到 獲得\n\n[完全燃燒] 層 持有 中 火葉攻擊 使用時 火葉攻擊으로 目前 打擊한 敵人的數相當於 最大 5層直到 追加 轉換並, 最大 層일 情況 [燃燒]的持續時間 5秒 延長\n[燃燒]的持續時間 20秒 秒할 數 無\n[完全燃燒] 層 每 100%的追加傷害 倍率\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 800%, 攻擊 目標 5秒 移動速度 20%, 攻擊 速度 20% 減少, 受擊的 敵人 目標 到位置 牽引김\n\n冷卻時間 1秒 減少",
                    "6": "火葉攻擊: 完全燃燒\n\n使用者的倒地攻擊 傷害 + 技能 傷害 攻擊\n可攻擊距離 : 使用者的倒地攻擊 距離 +1.2m\n火葉攻擊 攻擊 半徑 +2m\n\n[燃燒], [完全燃燒] 狀態 全部 沒有時 時 火葉攻擊 使用時 [燃燒] 狀態獲得\n\n[燃燒] 狀態下 近距離 前투 才能/魔法 才能/火葉攻擊 除外 元素 騎士 技能 攻擊 時, [完全燃燒] 狀態 最大 5層直到 獲得\n\n[完全燃燒] 層 持有 中 火葉攻擊 使用時 火葉攻擊으로 目前 打擊한 敵人的數相當於 最大 5層直到 追加 轉換並, 最大 層일 情況 [燃燒]的持續時間 5秒 延長\n[燃燒]的持續時間 20秒 秒할 數 無\n[完全燃燒] 層 每 100%的追加傷害 倍率\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 800%, 攻擊 目標 5秒 移動速度 20%, 攻擊 速度 20% 減少, 受擊的 敵人 目標 到位置 牽引김\n\n冷卻時間 1秒 減少",
                    "7": "火葉攻擊: 完全燃燒\n\n使用者的倒地攻擊 傷害 + 技能 傷害 攻擊\n可攻擊距離 : 使用者的倒地攻擊 距離 +1.2m\n火葉攻擊 攻擊 半徑 +2.5m\n\n[燃燒], [完全燃燒] 狀態 全部 沒有時 時 火葉攻擊 使用時 [燃燒] 狀態獲得\n\n[燃燒] 狀態下 近距離 前투 才能/魔法 才能/火葉攻擊 除外 元素 騎士 技能 攻擊 時, [完全燃燒] 狀態 最大 5層直到 獲得\n\n[完全燃燒] 層 持有 中 火葉攻擊 使用時 火葉攻擊으로 目前 打擊한 敵人的數相當於 最大 5層直到 追加 轉換並, 最大 層일 情況 [燃燒]的持續時間 5秒 延長\n[燃燒]的持續時間 20秒 秒할 數 無\n[完全燃燒] 層 每 100%的追加傷害 倍率\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 800%, 攻擊 目標 5秒 移動速度 20%, 攻擊 速度 20% 減少, 受擊的 敵人 目標 到位置 牽引김\n\n冷卻時間 1秒 減少",
                    "8": "火葉攻擊: 完全燃燒\n\n使用者的倒地攻擊 傷害 + 技能 傷害 攻擊\n可攻擊距離 : 使用者的倒地攻擊 距離 +1.2m\n火葉攻擊 攻擊 半徑 +3m\n\n[燃燒], [完全燃燒] 狀態 全部 沒有時 時 火葉攻擊 使用時 [燃燒] 狀態獲得\n\n[燃燒] 狀態下 近距離 前투 才能/魔法 才能/火葉攻擊 除外 元素 騎士 技能 攻擊 時, [完全燃燒] 狀態 最大 5層直到 獲得\n\n[完全燃燒] 層 持有 中 火葉攻擊 使用時 火葉攻擊으로 目前 打擊한 敵人的數相當於 最大 5層直到 追加 轉換並, 最大 層일 情況 [燃燒]的持續時間 5秒 延長\n[燃燒]的持續時間 20秒 秒할 數 無\n[完全燃燒] 層 每 100%的追加傷害 倍率\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 800%, 攻擊 目標 5秒 移動速度 20%, 攻擊 速度 20% 減少, 受擊的 敵人 目標 到位置 牽引김\n\n冷卻時間 1秒 減少",
                    "9": "火葉攻擊: 完全燃燒\n\n使用者的倒地攻擊 傷害 + 技能 傷害 攻擊\n可攻擊距離 : 使用者的倒地攻擊 距離 +1.2m\n火葉攻擊 攻擊 半徑 +4m\n\n[燃燒], [完全燃燒] 狀態 全部 沒有時 時 火葉攻擊 使用時 [燃燒] 狀態獲得\n\n[燃燒] 狀態下 近距離 前투 才能/魔法 才能/火葉攻擊 除外 元素 騎士 技能 攻擊 時, [完全燃燒] 狀態 最大 5層直到 獲得\n\n[完全燃燒] 層 持有 中 火葉攻擊 使用時 火葉攻擊으로 目前 打擊한 敵人的數相當於 最大 5層直到 追加 轉換並, 最大 層일 情況 [燃燒]的持續時間 5秒 延長\n[燃燒]的持續時間 20秒 秒할 數 無\n[完全燃燒] 層 每 100%的追加傷害 倍率\n\n元素注入 使用中時 追加效果發動\n追加效果 : 追加傷害 800%, 攻擊 目標 5秒 移動速度 20%, 攻擊 速度 20% 減少, 受擊的 敵人 目標 到位置 牽引김\n\n冷卻時間 1秒 減少"
                }
            },
            {
                "id": 3,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "里斯",
                    "提訥",
                    "佩赫"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "火葉攻擊 傷害倍率增加",
                "base": "150",
                "special": true,
                "skillName": "火葉攻擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278421478.webp"
            },
            {
                "category": "祕法",
                "option": "冰風車 傷害倍率增加",
                "base": "200",
                "special": true,
                "skillName": "冰風車",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278422382.webp"
            },
            {
                "category": "祕法",
                "option": "閃電重擊 傷害倍率增加",
                "base": "100",
                "special": true,
                "skillName": "閃電重擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278423237.webp"
            },
            {
                "category": "祕法",
                "option": "破線 傷害倍率增加",
                "base": "50",
                "special": true,
                "skillName": "破線",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278425034.webp"
            },
            {
                "category": "主要才能",
                "option": "重擊 傷害倍率增加",
                "base": "50",
                "skillName": "重擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278164255.webp"
            },
            {
                "category": "主要才能",
                "option": "突進 傷害倍率增加",
                "base": "60",
                "skillName": "突進",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278166033.webp"
            },
            {
                "category": "主要才能",
                "option": "倒地攻擊 傷害倍率增加",
                "base": "30",
                "skillName": "倒地攻擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278167060.webp"
            },
            {
                "category": "主要才能",
                "option": "風車 傷害倍率增加",
                "base": "40",
                "skillName": "風車",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278182096.webp"
            },
            {
                "category": "主要才能",
                "option": "精通劍 最大傷害增加",
                "base": "10",
                "skillName": "精通劍",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278189840.webp"
            },
            {
                "category": "主要才能",
                "option": "精通斧 最大傷害增加",
                "base": "10",
                "skillName": "精通斧",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278190756.webp"
            },
            {
                "category": "主要才能",
                "option": "精通鈍器 最大傷害增加",
                "base": "10",
                "skillName": "精通鈍器",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278191623.webp"
            }
        ]
    },
    {
        "id": 2,
        "name": "聖詠者",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974506104.webp",
        "mainTalent": "祝福",
        "subTalent": "音樂",
        "combos": [
            {
                "id": 4,
                "skillName": "淨化的鼓動",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278415715.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782748273000.webp",
                "words": [
                    "薩爾",
                    "奧爾",
                    "佩赫"
                ],
                "points": {
                    "5": "淨化的鼓動: 共鳴\n\n攻擊範圍 半徑 7m\n1秒每 範圍內 技能 傷害 攻擊\n1秒每 範圍內 友軍 生命力, 魔力, 耐力 恢復\n領域 維持 中 時前者的治療 效果 增加\n\n範圍內 友軍 硬直, 倒地 免疫, 傷害 減少율 10% 增加, \n10每秒 首領怪物 部分 傷害 相關 有害的 效果 1疊加 減少\n領域 消滅 時 維持 時 依比例 追加 魔法 傷害\n\n領域 維持 時 16秒\n領域 維持 中 技能 재使用時 強制 消滅\n冷卻時間 60秒",
                    "6": "淨化的鼓動: 共鳴\n\n攻擊範圍 半徑 7m\n1秒每 範圍內 技能 傷害 攻擊\n1秒每 範圍內 友軍 生命力, 魔力, 耐力 恢復\n領域 維持 中 時前者的治療 效果 增加\n\n範圍內 友軍 硬直, 倒地 免疫, 傷害 減少율 20% 增加, \n9每秒 首領怪物 部分 傷害 相關 有害的 效果 1疊加 減少\n領域 消滅 時 維持 時 依比例 追加 魔法 傷害\n\n領域 維持 時 17秒\n領域 維持 中 技能 재使用時 強制 消滅\n冷卻時間 60秒",
                    "7": "淨化的鼓動: 共鳴\n\n攻擊範圍 半徑 7m\n1秒每 範圍內 技能 傷害 攻擊\n1秒每 範圍內 友軍 生命力, 魔力, 耐力 恢復\n領域 維持 中 時前者的治療 效果 增加\n\n範圍內 友軍 硬直, 倒地 免疫, 傷害 減少율 30% 增加, \n8每秒 首領怪物 部分 傷害 相關 有害的 效果 1疊加 減少\n領域 消滅 時 維持 時 依比例 追加 魔法 傷害\n\n領域 維持 時 18秒\n領域 維持 中 技能 재使用時 強制 消滅\n冷卻時間 60秒",
                    "8": "淨化的鼓動: 共鳴\n\n攻擊範圍 半徑 7m\n1秒每 範圍內 技能 傷害 攻擊\n1秒每 範圍內 友軍 生命力, 魔力, 耐力 恢復\n領域 維持 中 時前者的治療 效果 增加\n\n範圍內 友軍 硬直, 倒地 免疫, 傷害 減少율 40% 增加, \n6每秒 首領怪物 部分 傷害 相關 有害的 效果 1疊加 減少\n領域 消滅 時 維持 時 依比例 追加 魔法 傷害\n\n領域 維持 時 19秒\n領域 維持 中 技能 재使用時 強制 消滅\n冷卻時間 60秒",
                    "9": "淨化的鼓動: 共鳴\n\n攻擊範圍 半徑 7m\n1秒每 範圍內 技能 傷害 攻擊\n1秒每 範圍內 友軍 生命力, 魔力, 耐力 恢復\n領域 維持 中 時前者的治療 效果 增加\n\n範圍內 友軍 硬直, 倒地 免疫, 傷害 減少율 50% 增加, \n5每秒 首領怪物 部分 傷害 相關 有害的 效果 1疊加 減少\n領域 消滅 時 維持 時 依比例 追加 魔法 傷害\n\n領域 維持 時 20秒\n領域 維持 中 技能 재使用時 強制 消滅\n冷卻時間 60秒"
                }
            },
            {
                "id": 5,
                "skillName": "音波洗禮",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1778732999727.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782748076296.webp",
                "words": [
                    "寧",
                    "提訥",
                    "敏"
                ],
                "points": {
                    "5": "音波洗禮: 幅음\n\n最大 15m 距離 內的目標 다次攻擊\n音波洗禮 傷害倍率 100% 增加\n濺射 傷害 傷害倍率 10%, 範圍 半徑 0.5m 增加\n技能 使用時 救贖的回音 冷卻時間 0.5秒 減少\n受擊的 對敵人 不協和音 效果 180秒 套用 (最大 5疊加)\n\n不協和音 1疊加 每\n防禦, 魔法防禦 {n} 減少\n保護, 魔法保護 {n} 減少\n(治療 及 隊伍治療 技能 恢復量(魔法 攻擊力 除外) 依比例 效果 增加)\n\n恢復 效果 及 生命的溫氣 賦予 效果 停用\n冷卻時間 1秒",
                    "6": "音波洗禮: 幅음\n\n最大 15m 距離 內的目標 다次攻擊\n音波洗禮 傷害倍率 120% 增加\n濺射 傷害 傷害倍率 15%, 範圍 半徑 1m 增加\n技能 使用時 救贖的回音 冷卻時間 0.5秒 減少\n受擊的 對敵人 不協和音 效果 180秒 套用 (最大 5疊加)\n\n不協和音 1疊加 每\n防禦, 魔法防禦 {n} 減少\n保護, 魔法保護 {n} 減少\n(治療 及 隊伍治療 技能 恢復量(魔法 攻擊力 除外) 依比例 效果 增加)\n\n恢復 效果 及 生命的溫氣 賦予 效果 停用\n冷卻時間 1秒",
                    "7": "音波洗禮: 幅음\n\n最大 15m 距離 內的目標 다次攻擊\n音波洗禮 傷害倍率 140% 增加\n濺射 傷害 傷害倍率 20%, 範圍 半徑 1.5m 增加\n技能 使用時 救贖的回音 冷卻時間 1秒 減少\n受擊的 對敵人 不協和音 效果 180秒 套用 (最大 5疊加)\n\n不協和音 1疊加 每\n防禦, 魔法防禦 {n} 減少\n保護, 魔法保護 {n} 減少\n(治療 及 隊伍治療 技能 恢復量(魔法 攻擊力 除外) 依比例 效果 增加)\n\n恢復 效果 及 生命的溫氣 賦予 效果 停用\n冷卻時間 1秒",
                    "8": "音波洗禮: 幅음\n\n最大 15m 距離 內的目標 다次攻擊\n音波洗禮 傷害倍率 170% 增加\n濺射 傷害 傷害倍率 25%, 範圍 半徑 2m 增加\n技能 使用時 救贖的回音 冷卻時間 1.5秒 減少\n受擊的 對敵人 不協和音 效果 180秒 套用 (最大 5疊加)\n\n不協和音 1疊加 每\n防禦, 魔法防禦 {n} 減少\n保護, 魔法保護 {n} 減少\n(治療 及 隊伍治療 技能 恢復量(魔法 攻擊力 除外) 依比例 效果 增加)\n\n恢復 效果 及 生命的溫氣 賦予 效果 停用\n冷卻時間 1秒",
                    "9": "音波洗禮: 幅음\n\n最大 15m 距離 內的目標 다次攻擊\n音波洗禮 傷害倍率 200% 增加\n濺射 傷害 傷害倍率 30%, 範圍 半徑 2.5m 增加\n技能 使用時 救贖的回音 冷卻時間 2秒 減少\n受擊的 對敵人 不協和音 效果 180秒 套用 (最大 5疊加)\n\n不協和音 1疊加 每\n防禦, 魔法防禦 {n} 減少\n保護, 魔法保護 {n} 減少\n(治療 及 隊伍治療 技能 恢復量(魔法 攻擊力 除外) 依比例 效果 增加)\n\n恢復 效果 及 生命的溫氣 賦予 效果 停用\n冷卻時間 1秒"
                }
            },
            {
                "id": 6,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "佩恩",
                    "科爾",
                    "伊蘭德"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "活力之聲 每秒 生命力 恢復量 增加",
                "base": "10",
                "special": true,
                "skillName": "活力之聲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278414788.webp"
            },
            {
                "category": "祕法",
                "option": "救贖的回音 傷害倍率增加",
                "base": "4",
                "special": true,
                "skillName": "救贖的回音",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278413895.webp"
            },
            {
                "category": "祕法",
                "option": "淨化的鼓動 每秒 傷害 增加",
                "base": "1000",
                "special": true,
                "skillName": "淨化的鼓動",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278415715.webp"
            },
            {
                "category": "祕法",
                "option": "音波洗禮 傷害倍率增加",
                "base": "7",
                "special": true,
                "skillName": "音波洗禮",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1778732999727.webp"
            },
            {
                "category": "主要才能",
                "option": "治療 生命力 最大 恢復量 增加",
                "base": "10",
                "skillName": "治療",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278216277.webp"
            },
            {
                "category": "主要才能",
                "option": "隊伍治療 生命力 最大 恢復量 增加",
                "base": "10",
                "skillName": "隊伍治療",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278218403.webp"
            }
        ]
    },
    {
        "id": 3,
        "name": "黑魔法師",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974539533.webp",
        "mainTalent": "魔法",
        "subTalent": "鎖鏈斬",
        "combos": [
            {
                "id": 7,
                "skillName": "暴風雪",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278428014.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782749387445.webp",
                "words": [
                    "貝赫",
                    "斯特拉夫",
                    "伊蘭德"
                ],
                "points": {
                    "5": "暴風雪: 過冷卻\n\n原有 攻擊 持續時間內的 傷害 總合的 110% 原有 攻擊範圍內的敵人 1次攻擊\n\n傷害 連同 向中心 擊退\n多爾卡 3 消耗\n\n受擊 受到的 對敵人 12秒 維持的 過冷卻 減益 賦予 過冷卻 狀態的敵人 硬直\n過冷卻 狀態的敵人게 爆裂突刺, 電氣鎖鏈, 箭系魔法, 雷擊/冰矛/火球 使用時, 該 技能 最終 傷害的125% 傷害 攻擊\n過冷卻 狀態 解除時 暴風雪 最終 傷害的50% 追加傷害\n\n冷卻時間 60秒",
                    "6": "暴風雪: 過冷卻\n\n原有 攻擊 持續時間內的 傷害 總合的 115% 原有 攻擊範圍內的敵人 1次攻擊\n\n傷害 連同 向中心 擊退\n多爾卡 3 消耗\n\n受擊 受到的 對敵人 12秒 維持的 過冷卻 減益 賦予 過冷卻 狀態的敵人 硬直\n過冷卻 狀態的敵人게 爆裂突刺, 電氣鎖鏈, 箭系魔法, 雷擊/冰矛/火球 使用時, 該 技能 最終 傷害的125% 傷害 攻擊\n過冷卻 狀態 解除時 暴風雪 最終 傷害的55% 追加傷害\n\n冷卻時間 60秒",
                    "7": "暴風雪: 過冷卻\n\n原有 攻擊 持續時間內的 傷害 總合的 120% 原有 攻擊範圍內的敵人 1次攻擊\n\n傷害 連同 向中心 擊退\n多爾卡 3 消耗\n\n受擊 受到的 對敵人 12秒 維持的 過冷卻 減益 賦予 過冷卻 狀態的敵人 硬直\n過冷卻 狀態的敵人게 爆裂突刺, 電氣鎖鏈, 箭系魔法, 雷擊/冰矛/火球 使用時, 該 技能 最終 傷害的125% 傷害 攻擊\n過冷卻 狀態 解除時 暴風雪 最終 傷害的60% 追加傷害\n\n冷卻時間 60秒",
                    "8": "暴風雪: 過冷卻\n\n原有 攻擊 持續時間內的 傷害 總合的 125% 原有 攻擊範圍內的敵人 1次攻擊\n\n傷害 連同 向中心 擊退\n多爾卡 3 消耗\n\n受擊 受到的 對敵人 12秒 維持的 過冷卻 減益 賦予 過冷卻 狀態的敵人 硬直\n過冷卻 狀態的敵人게 爆裂突刺, 電氣鎖鏈, 箭系魔法, 雷擊/冰矛/火球 使用時, 該 技能 最終 傷害的125% 傷害 攻擊\n過冷卻 狀態 解除時 暴風雪 最終 傷害的65% 追加傷害\n\n冷卻時間 60秒",
                    "9": "暴風雪: 過冷卻\n\n原有 攻擊 持續時間內的 傷害 總合的 130% 原有 攻擊範圍內的敵人 1次攻擊\n\n傷害 連同 向中心 擊退\n多爾卡 3 消耗\n\n受擊 受到的 對敵人 12秒 維持的 過冷卻 減益 賦予 過冷卻 狀態的敵人 硬直\n過冷卻 狀態的敵人게 爆裂突刺, 電氣鎖鏈, 箭系魔法, 雷擊/冰矛/火球 使用時, 該 技能 最終 傷害的125% 傷害 攻擊\n過冷卻 狀態 解除時 暴風雪 最終 傷害的70% 追加傷害\n\n冷卻時間 60秒"
                }
            },
            {
                "id": 8,
                "skillName": "爆裂突刺",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278426208.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782749490300.webp",
                "words": [
                    "里斯",
                    "烏赫",
                    "溫"
                ],
                "points": {
                    "5": "爆裂突刺: 解放\n\n技能 使用時, 目前 持有한 多爾卡 前부 消耗\n多爾卡 消耗量 依照 攻擊 形態 變化\n\n多爾卡 1 以上 6 未滿 消耗 時\n原有 爆裂突刺 傷害的113% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 6 以上 11 未滿 消耗 時\n攻擊 幅 1m 增加 +\n原有 爆裂突刺 傷害的113% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 11 以上 消耗 時\n攻擊 幅 1m 增加 +\n原有 爆裂突刺 傷害的113% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害 +\n最終 傷害的50% 追加 攻擊\n\n消耗한 多爾卡的50% 恢復\n\n冷卻時間 10秒",
                    "6": "爆裂突刺: 解放\n\n技能 使用時, 目前 持有한 多爾卡 前부 消耗\n多爾卡 消耗量 依照 攻擊 形態 變化\n\n多爾卡 1 以上 6 未滿 消耗 時\n原有 爆裂突刺 傷害的116% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 6 以上 11 未滿 消耗 時\n攻擊 幅 1.2m 增加 +\n原有 爆裂突刺 傷害的116% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 11 以上 消耗 時\n攻擊 幅 1.2m 增加 +\n原有 爆裂突刺 傷害的116% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害 +\n最終 傷害的50% 追加 攻擊\n\n消耗한 多爾卡的50% 恢復\n\n冷卻時間 10秒",
                    "7": "爆裂突刺: 解放\n\n技能 使用時, 目前 持有한 多爾卡 前부 消耗\n多爾卡 消耗量 依照 攻擊 形態 變化\n\n多爾卡 1 以上 6 未滿 消耗 時\n原有 爆裂突刺 傷害的119% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 6 以上 11 未滿 消耗 時\n攻擊 幅 1.4m 增加 +\n原有 爆裂突刺 傷害的119% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 11 以上 消耗 時\n攻擊 幅 1.4m 增加 +\n原有 爆裂突刺 傷害的119% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害 +\n最終 傷害的50% 追加 攻擊\n\n消耗한 多爾卡的50% 恢復\n\n冷卻時間 10秒",
                    "8": "爆裂突刺: 解放\n\n技能 使用時, 目前 持有한 多爾卡 前부 消耗\n多爾卡 消耗量 依照 攻擊 形態 變化\n\n多爾卡 1 以上 6 未滿 消耗 時\n原有 爆裂突刺 傷害的122% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 6 以上 11 未滿 消耗 時\n攻擊 幅 1.7m 增加 +\n原有 爆裂突刺 傷害的122% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 11 以上 消耗 時\n攻擊 幅 1.7m 增加 +\n原有 爆裂突刺 傷害的122% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害 +\n最終 傷害的50% 追加 攻擊\n\n消耗한 多爾卡的50% 恢復\n\n冷卻時間 10秒",
                    "9": "爆裂突刺: 解放\n\n技能 使用時, 目前 持有한 多爾卡 前부 消耗\n多爾卡 消耗量 依照 攻擊 形態 變化\n\n多爾卡 1 以上 6 未滿 消耗 時\n原有 爆裂突刺 傷害的125% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 6 以上 11 未滿 消耗 時\n攻擊 幅 2m 增加 +\n原有 爆裂突刺 傷害的125% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害\n\n多爾卡 11 以上 消耗 時\n攻擊 幅 2m 增加 +\n原有 爆裂突刺 傷害的125% 攻擊 +\n斜線 상的其他 對敵人 50% 傷害 +\n最終 傷害的50% 追加 攻擊\n\n消耗한 多爾卡的50% 恢復\n\n冷卻時間 10秒"
                }
            },
            {
                "id": 9,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "薩爾",
                    "戈爾特",
                    "伊蘭德"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "爆裂突刺 火 最大傷害倍率增加",
                "base": "250",
                "special": true,
                "skillName": "爆裂突刺",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278426208.webp"
            },
            {
                "category": "祕法",
                "option": "電氣鎖鏈 電擊 最大傷害倍率增加",
                "base": "20",
                "special": true,
                "skillName": "電氣鎖鏈",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278427071.webp"
            },
            {
                "category": "祕法",
                "option": "暴風雪 每秒 冰 最大傷害倍率增加",
                "base": "35",
                "special": true,
                "skillName": "暴風雪",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278428014.webp"
            },
            {
                "category": "祕法",
                "option": "潛伏點火 火 最大傷害倍率增加",
                "base": "300",
                "special": true,
                "skillName": "潛伏點火",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782350228756.webp"
            },
            {
                "category": "主要才能",
                "option": "精通火魔法 傷害倍率增加",
                "base": "1",
                "skillName": "精通火魔法",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278219232.webp"
            },
            {
                "category": "主要才能",
                "option": "精通冰魔法 傷害倍率增加",
                "base": "1",
                "skillName": "精通冰魔法",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278220105.webp"
            },
            {
                "category": "主要才能",
                "option": "精通雷魔法 傷害倍率增加",
                "base": "1",
                "skillName": "精通雷魔法",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278221080.webp"
            },
            {
                "category": "主要才能",
                "option": "精通箭系魔法 傷害倍率增加",
                "base": "1",
                "skillName": "精通箭系魔法",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278222106.webp"
            },
            {
                "category": "主要才能",
                "option": "雷矢 最大傷害倍率增加",
                "base": "2",
                "skillName": "雷矢",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278223912.webp"
            },
            {
                "category": "主要才能",
                "option": "雷擊 最大傷害倍率增加",
                "base": "0.5",
                "skillName": "雷擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278224921.webp"
            },
            {
                "category": "主要才能",
                "option": "火矢 最大傷害倍率增加",
                "base": "2",
                "skillName": "火矢",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278226774.webp"
            },
            {
                "category": "主要才能",
                "option": "火球 最大傷害倍率增加",
                "base": "60",
                "skillName": "火球",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278227829.webp"
            },
            {
                "category": "主要才能",
                "option": "冰矢 最大傷害倍率增加",
                "base": "2",
                "skillName": "冰矢",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278229742.webp"
            },
            {
                "category": "主要才能",
                "option": "冰矛 最大傷害倍率增加",
                "base": "6",
                "skillName": "冰矛",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278230633.webp"
            },
            {
                "category": "主要才能",
                "option": "箭系組合魔法 傷害倍率增加",
                "base": "1",
                "skillName": "箭系組合魔法",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278233312.webp"
            },
            {
                "category": "屬性",
                "option": "魔法 攻擊力增加",
                "base": "10"
            }
        ]
    },
    {
        "id": 4,
        "name": "鍊金射手",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974562311.webp",
        "mainTalent": "弓術",
        "subTalent": "戰鬥鍊金術",
        "combos": [
            {
                "id": 10,
                "skillName": "三重突襲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278436490.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782823520396.webp",
                "words": [
                    "佩恩",
                    "伊達德",
                    "埃巴德"
                ],
                "points": {
                    "5": "三重突襲: 融合\n\n4종的能量 屬性 全部 消耗以 1次攻擊\n三重突襲 終結 攻擊 傷害倍率 3300% 增加\n火, 水, 風, 土 屬性 鍊金術 精通 효율에 依照 傷害 增加\n\n受擊的 所有 對敵人 [알케믹 時너지]的所有 效果 (증발, 과열, 前류, 분진, 냉각, 부식) 套用\n\n冷卻時間 36秒",
                    "6": "三重突襲: 融合\n\n4종的能量 屬性 全部 消耗以 1次攻擊\n三重突襲 終結 攻擊 傷害倍率 3600% 增加\n火, 水, 風, 土 屬性 鍊金術 精通 효율에 依照 傷害 增加\n\n受擊的 所有 對敵人 [알케믹 時너지]的所有 效果 (증발, 과열, 前류, 분진, 냉각, 부식) 套用\n\n冷卻時間 36秒",
                    "7": "三重突襲: 融合\n\n4종的能量 屬性 全部 消耗以 1次攻擊\n三重突襲 終結 攻擊 傷害倍率 3900% 增加\n火, 水, 風, 土 屬性 鍊金術 精通 효율에 依照 傷害 增加\n\n受擊的 所有 對敵人 [알케믹 時너지]的所有 效果 (증발, 과열, 前류, 분진, 냉각, 부식) 套用\n\n冷卻時間 36秒",
                    "8": "三重突襲: 融合\n\n4종的能量 屬性 全部 消耗以 1次攻擊\n三重突襲 終結 攻擊 傷害倍率 4200% 增加\n火, 水, 風, 土 屬性 鍊金術 精通 효율에 依照 傷害 增加\n\n受擊的 所有 對敵人 [알케믹 時너지]的所有 效果 (증발, 과열, 前류, 분진, 냉각, 부식) 套用\n\n冷卻時間 36秒",
                    "9": "三重突襲: 融合\n\n4종的能量 屬性 全部 消耗以 1次攻擊\n三重突襲 終結 攻擊 傷害倍率 4500% 增加\n火, 水, 風, 土 屬性 鍊金術 精通 효율에 依照 傷害 增加\n\n受擊的 所有 對敵人 [알케믹 時너지]的所有 效果 (증발, 과열, 前류, 분진, 냉각, 부식) 套用\n\n冷卻時間 36秒"
                }
            },
            {
                "id": 11,
                "skillName": "水流貫穿",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278433695.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782823954542.webp",
                "words": [
                    "薩爾",
                    "達爾",
                    "埃達德"
                ],
                "points": {
                    "5": "水流貫穿: 激流\n\n水流貫穿 차징 無法\n使用者的麥格農射擊 傷害 + 原有 水流貫穿 最大 傷害倍率的7% 攻擊\n\n[流動], [激流] 狀態 全部 持有並 있지 않을 時 水流貫穿 使用時 [流動] 獲得\n\n[流動] 狀態下 麥格農射擊 使用時 [激流] 狀態 最大 3層直到 獲得\n\n[激流] 層 持有 中 水流貫穿 使用時 層 全部 消耗並, 層 每 2次的追加 攻擊 發生\n\n冷卻時間 10秒",
                    "6": "水流貫穿: 激流\n\n水流貫穿 차징 無法\n使用者的麥格農射擊 傷害 + 原有 水流貫穿 最大 傷害倍率的9% 攻擊\n\n[流動], [激流] 狀態 全部 持有並 있지 않을 時 水流貫穿 使用時 [流動] 獲得\n\n[流動] 狀態下 麥格農射擊 使用時 [激流] 狀態 最大 3層直到 獲得\n\n[激流] 層 持有 中 水流貫穿 使用時 層 全部 消耗並, 層 每 2次的追加 攻擊 發生\n\n冷卻時間 10秒",
                    "7": "水流貫穿: 激流\n\n水流貫穿 차징 無法\n使用者的麥格農射擊 傷害 + 原有 水流貫穿 最大 傷害倍率的11% 攻擊\n\n[流動], [激流] 狀態 全部 持有並 있지 않을 時 水流貫穿 使用時 [流動] 獲得\n\n[流動] 狀態下 麥格農射擊 使用時 [激流] 狀態 最大 3層直到 獲得\n\n[激流] 層 持有 中 水流貫穿 使用時 層 全部 消耗並, 層 每 2次的追加 攻擊 發生\n\n冷卻時間 10秒",
                    "8": "水流貫穿: 激流\n\n水流貫穿 차징 無法\n使用者的麥格農射擊 傷害 + 原有 水流貫穿 最大 傷害倍率的13% 攻擊\n\n[流動], [激流] 狀態 全部 持有並 있지 않을 時 水流貫穿 使用時 [流動] 獲得\n\n[流動] 狀態下 麥格農射擊 使用時 [激流] 狀態 最大 3層直到 獲得\n\n[激流] 層 持有 中 水流貫穿 使用時 層 全部 消耗並, 層 每 2次的追加 攻擊 發生\n\n冷卻時間 10秒",
                    "9": "水流貫穿: 激流\n\n水流貫穿 차징 無法\n使用者的麥格農射擊 傷害 + 原有 水流貫穿 最大 傷害倍率的15% 攻擊\n\n[流動], [激流] 狀態 全部 持有並 있지 않을 時 水流貫穿 使用時 [流動] 獲得\n\n[流動] 狀態下 麥格農射擊 使用時 [激流] 狀態 最大 3層直到 獲得\n\n[激流] 層 持有 中 水流貫穿 使用時 層 全部 消耗並, 層 每 2次的追加 攻擊 發生\n\n冷卻時間 10秒"
                }
            },
            {
                "id": 12,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "寧",
                    "凱爾特",
                    "埃曼科爾"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "烈焰爆發 傷害倍率增加",
                "base": "50",
                "special": true,
                "skillName": "烈焰爆發",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278432654.webp"
            },
            {
                "category": "祕法",
                "option": "水流貫穿 最大傷害倍率增加",
                "base": "150",
                "special": true,
                "skillName": "水流貫穿",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278433695.webp"
            },
            {
                "category": "祕法",
                "option": "列陣 傷害倍率增加",
                "base": "200",
                "special": true,
                "skillName": "列陣",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278434671.webp"
            },
            {
                "category": "祕法",
                "option": "塵埃射擊 傷害倍率增加",
                "base": "200",
                "special": true,
                "skillName": "塵埃射擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278435652.webp"
            },
            {
                "category": "祕法",
                "option": "三重突襲 일반 攻擊, 終結 攻擊的傷害倍率增加",
                "base": "60",
                "special": true,
                "skillName": "三重突襲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278436490.webp"
            },
            {
                "category": "主要才能",
                "option": "麥格農射擊 傷害倍率增加",
                "base": "20",
                "skillName": "麥格農射擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278174656.webp"
            },
            {
                "category": "主要才能",
                "option": "碎裂射擊 파편 傷害倍率增加",
                "base": "20",
                "skillName": "碎裂射擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278186959.webp"
            },
            {
                "category": "主要才能",
                "option": "精通弓 最大傷害增加",
                "base": "10",
                "skillName": "精通弓",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278200193.webp"
            },
            {
                "category": "主要才能",
                "option": "精通弩 最大傷害增加",
                "base": "10",
                "skillName": "精通弩",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278201056.webp"
            }
        ]
    },
    {
        "id": 5,
        "name": "聖盾",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974584004.webp",
        "mainTalent": "近距離戰鬥",
        "subTalent": "祝福",
        "combos": [
            {
                "id": 13,
                "skillName": "光輝的斷罪",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1778731662673.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782835338035.webp",
                "words": [
                    "里斯",
                    "提訥",
                    "溫"
                ],
                "points": {
                    "5": "光輝的斷罪: 집행\n\n光輝的斷罪 상時 3階段 동작\n光輝的斷罪的基本 傷害, 防禦力, 最大 生命力 倍率 1.1배 增加\n\n敵人 혹은 指定的 곳으로 使用 可\n技能 移動 可 距離 : 最大 6m\n\n高潔的 誓約 啟用 狀態일 情況 犧牲 4 獲得\n\n冷卻時間 2.5秒",
                    "6": "光輝的斷罪: 집행\n\n光輝的斷罪 상時 3階段 동작\n光輝的斷罪的基本 傷害, 防禦力, 最大 生命力 倍率 1.2배 增加\n攻擊範圍 半徑 增加\n\n敵人 혹은 指定的 곳으로 使用 可\n技能 移動 可 距離 : 最大 6.5m\n\n高潔的 誓約 啟用 狀態일 情況 犧牲 4 獲得\n\n冷卻時間 2.5秒",
                    "7": "光輝的斷罪: 집행\n\n光輝的斷罪 상時 3階段 동작\n光輝的斷罪的基本 傷害, 防禦力, 最大 生命力 倍率 1.3배 增加\n攻擊範圍 半徑 增加\n\n敵人 혹은 指定的 곳으로 使用 可\n技能 移動 可 距離 : 最大 7m\n\n高潔的 誓約 啟用 狀態일 情況 犧牲 4 獲得\n\n冷卻時間 2.5秒",
                    "8": "光輝的斷罪: 집행\n\n光輝的斷罪 상時 3階段 동작\n光輝的斷罪的基本 傷害, 防禦力, 最大 生命力 倍率 1.4배 增加\n攻擊範圍 半徑 增加\n\n敵人 혹은 指定的 곳으로 使用 可\n技能 移動 可 距離 : 最大 7.5m\n\n高潔的 誓約 啟用 狀態일 情況 犧牲 4 獲得\n\n冷卻時間 2.5秒",
                    "9": "光輝的斷罪: 집행\n\n光輝的斷罪 상時 3階段 동작\n光輝的斷罪的基本 傷害, 防禦力, 最大 生命力 倍率 1.5배 增加\n攻擊範圍 半徑 增加\n\n敵人 혹은 指定的 곳으로 使用 可\n技能 移動 可 距離 : 最大 8m\n\n高潔的 誓約 啟用 狀態일 情況 犧牲 4 獲得\n\n冷卻時間 2.5秒"
                }
            },
            {
                "id": 14,
                "skillName": "鐵壁強打",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278441243.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782835547817.webp",
                "words": [
                    "薩爾",
                    "戈爾特",
                    "伊達德"
                ],
                "points": {
                    "5": "鐵壁強打: 요새\n\n鐵壁強打的風車 傷害倍率 5%,\n基本 傷害倍率 200%, 防禦力 倍率 300%,\n最大 生命力 倍率 50% 增加\n\n攻擊範圍 : 6m\n攻擊 각도 : 150\n高潔的 誓約 啟用 狀態下 技能 使用時, 犧牲 1 獲得\n\n使用 직後 1.5秒 받는 傷害 50% 減少 及\n首領怪物的部分 有害的 效果 免疫,\n敵人的攻擊 受擊 時 冷卻時間 秒氣化\n高潔的 誓約 啟用 狀態下 傷害 경감 성공 時,\n犧牲 2 獲得 及 自身게 要塞化 效果 賦予\n要塞化 持續時間 : 15秒\n\n要塞化 效果 : 所有 세이크리드 가드 攻擊 技能 犧牲 獲得量\n10% 增加, 犧牲的응징 技能 時 效果 제거\n\n要塞化 最大 疊加 數 : 3\n\n原有 冷卻時間 대신 累積 冷卻時間 套用\n累積 冷卻時間 한계 : 12秒\n(累積的 冷卻時間 한계점을 넘어가면 累積的 冷卻時間期間 技能 使用 無法) ",
                    "6": "鐵壁強打: 요새\n\n鐵壁強打的風車 傷害倍率 10%,\n基本 傷害倍率 300%, 防禦力 倍率 300%,\n最大 生命力 倍率 50% 增加\n\n攻擊範圍 : 6m\n攻擊 각도 : 150\n高潔的 誓約 啟用 狀態下 技能 使用時, 犧牲 1 獲得\n\n使用 직後 1.5秒 받는 傷害 50% 減少 及\n首領怪物的部分 有害的 效果 免疫,\n敵人的攻擊 受擊 時 冷卻時間 秒氣化\n高潔的 誓約 啟用 狀態下 傷害 경감 성공 時,\n犧牲 2 獲得 及 自身게 要塞化 效果 賦予\n要塞化 持續時間 : 15秒\n\n要塞化 效果 : 所有 세이크리드 가드 攻擊 技能 犧牲 獲得量\n15% 增加, 犧牲的응징 技能 時 效果 제거\n\n要塞化 最大 疊加 數 : 3\n\n原有 冷卻時間 대신 累積 冷卻時間 套用\n累積 冷卻時間 한계 : 12秒\n(累積的 冷卻時間 한계점을 넘어가면 累積的 冷卻時間期間 技能 使用 無法) ",
                    "7": "鐵壁強打: 요새\n\n鐵壁強打的風車 傷害倍率 15%,\n基本 傷害倍率 400%, 防禦力 倍率 300%,\n最大 生命力 倍率 50% 增加\n\n攻擊範圍 : 6m\n攻擊 각도 : 150\n高潔的 誓約 啟用 狀態下 技能 使用時, 犧牲 1 獲得\n\n使用 직後 1.5秒 받는 傷害 50% 減少 及\n首領怪物的部分 有害的 效果 免疫,\n敵人的攻擊 受擊 時 冷卻時間 秒氣化\n高潔的 誓約 啟用 狀態下 傷害 경감 성공 時,\n犧牲 2 獲得 及 自身게 要塞化 效果 賦予\n要塞化 持續時間 : 15秒\n\n要塞化 效果 : 所有 세이크리드 가드 攻擊 技能 犧牲 獲得量\n20% 增加, 犧牲的응징 技能 時 效果 제거\n\n要塞化 最大 疊加 數 : 3\n\n原有 冷卻時間 대신 累積 冷卻時間 套用\n累積 冷卻時間 한계 : 12秒\n(累積的 冷卻時間 한계점을 넘어가면 累積的 冷卻時間期間 技能 使用 無法) ",
                    "8": "鐵壁強打: 요새\n\n鐵壁強打的風車 傷害倍率 20%,\n基本 傷害倍率 500%, 防禦力 倍率 300%,\n最大 生命力 倍率 50% 增加\n\n攻擊範圍 : 6m\n攻擊 각도 : 150\n高潔的 誓約 啟用 狀態下 技能 使用時, 犧牲 1 獲得\n\n使用 직後 1.5秒 받는 傷害 50% 減少 及\n首領怪物的部分 有害的 效果 免疫,\n敵人的攻擊 受擊 時 冷卻時間 秒氣化\n高潔的 誓約 啟用 狀態下 傷害 경감 성공 時,\n犧牲 2 獲得 及 自身게 要塞化 效果 賦予\n要塞化 持續時間 : 15秒\n\n要塞化 效果 : 所有 세이크리드 가드 攻擊 技能 犧牲 獲得量\n25% 增加, 犧牲的응징 技能 時 效果 제거\n\n要塞化 最大 疊加 數 : 3\n\n原有 冷卻時間 대신 累積 冷卻時間 套用\n累積 冷卻時間 한계 : 12秒\n(累積的 冷卻時間 한계점을 넘어가면 累積的 冷卻時間期間 技能 使用 無法) ",
                    "9": "鐵壁強打: 요새\n\n鐵壁強打的風車 傷害倍率 25%,\n基本 傷害倍率 600%, 防禦力 倍率 300%,\n最大 生命力 倍率 50% 增加\n\n攻擊範圍 : 6m\n攻擊 각도 : 150\n高潔的 誓約 啟用 狀態下 技能 使用時, 犧牲 1 獲得\n\n使用 직後 1.5秒 받는 傷害 50% 減少 及\n首領怪物的部分 有害的 效果 免疫,\n敵人的攻擊 受擊 時 冷卻時間 秒氣化\n高潔的 誓約 啟用 狀態下 傷害 경감 성공 時,\n犧牲 2 獲得 及 自身게 要塞化 效果 賦予\n要塞化 持續時間 : 15秒\n\n要塞化 效果 : 所有 세이크리드 가드 攻擊 技能 犧牲 獲得量\n30% 增加, 犧牲的응징 技能 時 效果 제거\n\n要塞化 最大 疊加 數 : 3\n\n原有 冷卻時間 대신 累積 冷卻時間 套用\n累積 冷卻時間 한계 : 12秒\n(累積的 冷卻時間 한계점을 넘어가면 累積的 冷卻時間期間 技能 使用 無法) "
                }
            },
            {
                "id": 15,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "貝赫",
                    "蓋塔爾",
                    "伊芬"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "聖域展開 傷害倍率增加",
                "base": "10",
                "special": true,
                "skillName": "聖域展開",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278438379.webp"
            },
            {
                "category": "祕法",
                "option": "激突 傷害倍率增加",
                "base": "100",
                "special": true,
                "skillName": "激突",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278440302.webp"
            },
            {
                "category": "祕法",
                "option": "鐵壁強打 傷害倍率增加",
                "base": "50",
                "special": true,
                "skillName": "鐵壁強打",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278441243.webp"
            },
            {
                "category": "祕法",
                "option": "審判的一擊 傷害倍率增加",
                "base": "200",
                "special": true,
                "skillName": "審判的一擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278442077.webp"
            },
            {
                "category": "祕法",
                "option": "光輝的斷罪 2階段부터 階段每 傷害倍率增加",
                "base": "8",
                "special": true,
                "skillName": "光輝的斷罪",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1778731662673.webp"
            },
            {
                "category": "主要才能",
                "option": "重擊 傷害倍率增加",
                "base": "50",
                "skillName": "重擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278164255.webp"
            },
            {
                "category": "主要才能",
                "option": "突進 傷害倍率增加",
                "base": "60",
                "skillName": "突進",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278166033.webp"
            },
            {
                "category": "主要才能",
                "option": "倒地攻擊 傷害倍率增加",
                "base": "30",
                "skillName": "倒地攻擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278167060.webp"
            },
            {
                "category": "主要才能",
                "option": "風車 傷害倍率增加",
                "base": "40",
                "skillName": "風車",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278182096.webp"
            },
            {
                "category": "主要才能",
                "option": "精通劍 最大傷害增加",
                "base": "10",
                "skillName": "精通劍",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278189840.webp"
            },
            {
                "category": "主要才能",
                "option": "精通斧 最大傷害增加",
                "base": "10",
                "skillName": "精通斧",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278190756.webp"
            },
            {
                "category": "主要才能",
                "option": "精通鈍器 最大傷害增加",
                "base": "10",
                "skillName": "精通鈍器",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278191623.webp"
            }
        ]
    },
    {
        "id": 6,
        "name": "爆裂槍兵",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974606466.webp",
        "mainTalent": "騎槍",
        "subTalent": "槍手",
        "combos": [
            {
                "id": 16,
                "skillName": "衝鋒突襲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278448747.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782836374406.webp",
                "words": [
                    "寧",
                    "達爾",
                    "佩赫"
                ],
                "points": {
                    "5": "衝鋒突襲: 질풍\n\n衝鋒突襲 移動 距離 1m 增加\n캐릭터 後방 攻擊 距離 1m 增加\n攻擊 幅 10m 內 敵人 目標 밀어냄\n衝鋒突襲 傷害倍率 800% 增加\n累積 쿨 타임 대기 時 增加값 0.5秒 減少",
                    "6": "衝鋒突襲: 질풍\n\n衝鋒突襲 移動 距離 1m 增加\n캐릭터 後방 攻擊 距離 1m 增加\n攻擊 幅 10m 內 敵人 目標 밀어냄\n衝鋒突襲 傷害倍率 1100% 增加\n累積 쿨 타임 대기 時 增加값 0.5秒 減少",
                    "7": "衝鋒突襲: 질풍\n\n衝鋒突襲 移動 距離 2m 增加\n캐릭터 後방 攻擊 距離 1m 增加\n攻擊 幅 10m 內 敵人 目標 밀어냄\n衝鋒突襲 傷害倍率 1400% 增加\n累積 쿨 타임 대기 時 增加값 0.5秒 減少",
                    "8": "衝鋒突襲: 질풍\n\n衝鋒突襲 移動 距離 2m 增加\n캐릭터 後방 攻擊 距離 1m 增加\n攻擊 幅 10m 內 敵人 目標 밀어냄\n衝鋒突襲 傷害倍率 1700% 增加\n累積 쿨 타임 대기 時 增加값 0.5秒 減少",
                    "9": "衝鋒突襲: 질풍\n\n衝鋒突襲 移動 距離 3m 增加\n캐릭터 後방 攻擊 距離 1m 增加\n攻擊 幅 10m 內 敵人 目標 밀어냄\n衝鋒突襲 傷害倍率 2000% 增加\n累積 쿨 타임 대기 時 增加값 0.5秒 減少"
                }
            },
            {
                "id": 17,
                "skillName": "超載",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278449645.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782836723448.webp",
                "words": [
                    "貝赫",
                    "埃達德",
                    "埃巴德"
                ],
                "points": {
                    "5": "超載: 기幅\n\n技能 傷害 찌르기 攻擊\n使用者的騎槍衝擊 傷害 爆發 攻擊\n\n技能 使用時 기幅 魔力彈 45秒 套用 (最大 2疊加)\n기幅 魔力彈 套用 中 블래스트 랜서 技能 使用時 1% 追加傷害 (1次)\n殲滅 使用時 疊加每 대爆發 最終 傷害 0.5% 增加 及 疊加\n數 秒氣化\n\n冷卻時間 6秒 + 騎槍衝擊 冷卻時間",
                    "6": "超載: 기幅\n\n技能 傷害 찌르기 攻擊\n使用者的騎槍衝擊 傷害 爆發 攻擊\n\n技能 使用時 기幅 魔力彈 45秒 套用 (最大 3疊加)\n기幅 魔力彈 套用 中 블래스트 랜서 技能 使用時 1.5% 追加傷害 (1次)\n殲滅 使用時 疊加每 대爆發 最終 傷害 0.5% 增加 及 疊加\n數 秒氣化\n\n冷卻時間 6秒 + 騎槍衝擊 冷卻時間",
                    "7": "超載: 기幅\n\n技能 傷害 찌르기 攻擊\n使用者的騎槍衝擊 傷害 爆發 攻擊\n\n技能 使用時 기幅 魔力彈 45秒 套用 (最大 4疊加)\n기幅 魔力彈 套用 中 블래스트 랜서 技能 使用時 2% 追加傷害 (1次)\n殲滅 使用時 疊加每 대爆發 最終 傷害 0.5% 增加 及 疊加\n數 秒氣化\n\n冷卻時間 6秒 + 騎槍衝擊 冷卻時間",
                    "8": "超載: 기幅\n\n技能 傷害 찌르기 攻擊\n使用者的騎槍衝擊 傷害 爆發 攻擊\n\n技能 使用時 기幅 魔力彈 45秒 套用 (最大 5疊加)\n기幅 魔力彈 套用 中 블래스트 랜서 技能 使用時 2.5% 追加傷害 (1次)\n殲滅 使用時 疊加每 대爆發 最終 傷害 0.5% 增加 及 疊加\n數 秒氣化\n\n冷卻時間 6秒 + 騎槍衝擊 冷卻時間",
                    "9": "超載: 기幅\n\n技能 傷害 찌르기 攻擊\n使用者的騎槍衝擊 傷害 爆發 攻擊\n\n技能 使用時 기幅 魔力彈 45秒 套用 (最大 6疊加)\n기幅 魔力彈 套用 中 블래스트 랜서 技能 使用時 3ㅊ% 追加傷害 (1次)\n殲滅 使用時 疊加每 대爆發 最終 傷害 0.5% 增加 及 疊加\n數 秒氣化\n\n冷卻時間 6秒 + 騎槍衝擊 冷卻時間"
                }
            },
            {
                "id": 18,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "里斯",
                    "路斯",
                    "阿爾姆"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "衝擊粉碎 傷害倍率增加",
                "base": "80",
                "special": true,
                "skillName": "衝擊粉碎",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278446822.webp"
            },
            {
                "category": "祕法",
                "option": "螺旋漩渦 傷害倍率增加",
                "base": "200",
                "special": true,
                "skillName": "螺旋漩渦",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278447732.webp"
            },
            {
                "category": "祕法",
                "option": "衝鋒突襲 傷害倍率增加",
                "base": "80",
                "special": true,
                "skillName": "衝鋒突襲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278448747.webp"
            },
            {
                "category": "祕法",
                "option": "超載 傷害倍率增加",
                "base": "40",
                "special": true,
                "skillName": "超載",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278449645.webp"
            },
            {
                "category": "祕法",
                "option": "殲滅 傷害倍率增加",
                "base": "200",
                "special": true,
                "skillName": "殲滅",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278450531.webp"
            },
            {
                "category": "主要才能",
                "option": "騎槍衝擊 充能 傷害倍率增加",
                "base": "8",
                "skillName": "騎槍衝擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278168970.webp"
            },
            {
                "category": "主要才能",
                "option": "精通騎槍 最大傷害增加",
                "base": "10",
                "skillName": "精通騎槍",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278201897.webp"
            }
        ]
    },
    {
        "id": 7,
        "name": "幻變槍手",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974664397.webp",
        "mainTalent": "槍手",
        "subTalent": "煉成鍊金術",
        "combos": [
            {
                "id": 19,
                "skillName": "重型火砲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278649869.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782837751189.webp",
                "words": [
                    "佩恩",
                    "戈爾特",
                    "奧爾"
                ],
                "points": {
                    "5": "重型火砲: 연속 砲擊\n\n半徑 9m的領域 基本 傷害的600% +\n十字爆破 傷害 攻擊\n魔力彈 10 消耗\n煉成 能量 200 增加\n(煉成 能量彈 1個: 煉成 能量 100)\n\n煉成領域 존재할 時\n技能 使用 後 6秒每 最大 3次直到 追加 砲擊 發生\n\n冷卻時間 15秒 增加",
                    "6": "重型火砲: 연속 砲擊\n\n半徑 9m的領域 基本 傷害的600% +\n十字爆破 傷害 攻擊\n魔力彈 10 消耗\n煉成 能量 200 增加\n(煉成 能量彈 1個: 煉成 能量 100)\n\n煉成領域 존재할 時\n技能 使用 後 5.5秒每 最大 3次直到 追加 砲擊 發生\n\n冷卻時間 15秒 增加",
                    "7": "重型火砲: 연속 砲擊\n\n半徑 9m的領域 基本 傷害的600% +\n十字爆破 傷害 攻擊\n魔力彈 10 消耗\n煉成 能量 200 增加\n(煉成 能量彈 1個: 煉成 能量 100)\n\n煉成領域 존재할 時\n技能 使用 後 5秒每 最大 4次直到 追加 砲擊 發生\n\n冷卻時間 15秒 增加",
                    "8": "重型火砲: 연속 砲擊\n\n半徑 9m的領域 基本 傷害的600% +\n十字爆破 傷害 攻擊\n魔力彈 10 消耗\n煉成 能量 200 增加\n(煉成 能量彈 1個: 煉成 能量 100)\n\n煉成領域 존재할 時\n技能 使用 後 4.5秒每 最大 4次直到 追加 砲擊 發生\n\n冷卻時間 15秒 增加",
                    "9": "重型火砲: 연속 砲擊\n\n半徑 9m的領域 基本 傷害的600% +\n十字爆破 傷害 攻擊\n魔力彈 10 消耗\n煉成 能量 200 增加\n(煉成 能量彈 1個: 煉成 能量 100)\n\n煉成領域 존재할 時\n技能 使用 後 4秒每 最大 5次直到 追加 砲擊 發生\n\n冷卻時間 15秒 增加"
                }
            },
            {
                "id": 20,
                "skillName": "煉成領域",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278782490.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782838063465.webp",
                "words": [
                    "貝赫",
                    "烏赫",
                    "伊芬"
                ],
                "points": {
                    "5": "煉成領域: 록온\n\n단일 敵人 지정以 發動 可\n射擊突進 攻擊幅 2m를 더한 半徑的배리어블 거너\n技能 강화 領域 同時 3個 設置\n\n煉成領域 者동으로 指定的 敵人的위치를 依照감\n(領域 時前者게만 보이며 效果 또한 時前者的技能만 套用)\n領域 維持 時 : 10秒\n\n領域 效果\n快速射擊:\n領域 向上 攻擊 時 領域 內 敵人 1m 各 牽引김\n\n重型火砲:\n設置的 領域相當於 追加 攻擊\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 30% 增加)\n\n毀滅加農砲:\n領域 向上 攻擊 時 領域 內 所有 對敵人 攻擊 판정\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 30% 增加)\n\n致命瞄準:\n目標 領域 內 있을 情況 조준 速度 100% 增加\n(슈터스 아이 效果는 疊加되지 않음)\n\n魔力彈 4 消耗\n煉成 能量彈 3個 消耗",
                    "6": "煉成領域: 록온\n\n단일 敵人 지정以 發動 可\n射擊突進 攻擊幅 2m를 더한 半徑的배리어블 거너\n技能 강화 領域 同時 3個 設置\n\n煉成領域 者동으로 指定的 敵人的위치를 依照감\n(領域 時前者게만 보이며 效果 또한 時前者的技能만 套用)\n領域 維持 時 : 10秒\n\n領域 效果\n快速射擊:\n領域 向上 攻擊 時 領域 內 敵人 1m 各 牽引김\n\n重型火砲:\n設置的 領域相當於 追加 攻擊\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 35% 增加)\n\n毀滅加農砲:\n領域 向上 攻擊 時 領域 內 所有 對敵人 攻擊 판정\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 35% 增加)\n\n致命瞄準:\n目標 領域 內 있을 情況 조준 速度 100% 增加\n(슈터스 아이 效果는 疊加되지 않음)\n\n魔力彈 4 消耗\n煉成 能量彈 3個 消耗",
                    "7": "煉成領域: 록온\n\n단일 敵人 지정以 發動 可\n射擊突進 攻擊幅 2m를 더한 半徑的배리어블 거너\n技能 강화 領域 同時 3個 設置\n\n煉成領域 者동으로 指定的 敵人的위치를 依照감\n(領域 時前者게만 보이며 效果 또한 時前者的技能만 套用)\n領域 維持 時 : 10秒\n\n領域 效果\n快速射擊:\n領域 向上 攻擊 時 領域 內 敵人 1m 各 牽引김\n\n重型火砲:\n設置的 領域相當於 追加 攻擊\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 40% 增加)\n\n毀滅加農砲:\n領域 向上 攻擊 時 領域 內 所有 對敵人 攻擊 판정\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 40% 增加)\n\n致命瞄準:\n目標 領域 內 있을 情況 조준 速度 100% 增加\n(슈터스 아이 效果는 疊加되지 않음)\n\n魔力彈 4 消耗\n煉成 能量彈 3個 消耗",
                    "8": "煉成領域: 록온\n\n단일 敵人 지정以 發動 可\n射擊突進 攻擊幅 2m를 더한 半徑的배리어블 거너\n技能 강화 領域 同時 3個 設置\n\n煉成領域 者동으로 指定的 敵人的위치를 依照감\n(領域 時前者게만 보이며 效果 또한 時前者的技能만 套用)\n領域 維持 時 : 10秒\n\n領域 效果\n快速射擊:\n領域 向上 攻擊 時 領域 內 敵人 1m 各 牽引김\n\n重型火砲:\n設置的 領域相當於 追加 攻擊\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 50% 增加)\n\n毀滅加農砲:\n領域 向上 攻擊 時 領域 內 所有 對敵人 攻擊 판정\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 50% 增加)\n\n致命瞄準:\n目標 領域 內 있을 情況 조준 速度 100% 增加\n(슈터스 아이 效果는 疊加되지 않음)\n\n魔力彈 4 消耗\n煉成 能量彈 3個 消耗",
                    "9": "煉成領域: 록온\n\n단일 敵人 지정以 發動 可\n射擊突進 攻擊幅 2m를 더한 半徑的배리어블 거너\n技能 강화 領域 同時 3個 設置\n\n煉成領域 者동으로 指定的 敵人的위치를 依照감\n(領域 時前者게만 보이며 效果 또한 時前者的技能만 套用)\n領域 維持 時 : 10秒\n\n領域 效果\n快速射擊:\n領域 向上 攻擊 時 領域 內 敵人 1m 各 牽引김\n\n重型火砲:\n設置的 領域相當於 追加 攻擊\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 60% 增加)\n\n毀滅加農砲:\n領域 向上 攻擊 時 領域 內 所有 對敵人 攻擊 판정\n(重疊的 領域 傷害 10% 增加,\n重疊的 領域 2個人 情況 30% 增加,\n重疊的 領域 3個人 情況 60% 增加)\n\n致命瞄準:\n目標 領域 內 있을 情況 조준 速度 100% 增加\n(슈터스 아이 效果는 疊加되지 않음)\n\n魔力彈 4 消耗\n煉成 能量彈 3個 消耗"
                }
            },
            {
                "id": 21,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "薩爾",
                    "敏",
                    "伊達德"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "快速射擊 傷害倍率增加",
                "base": "30",
                "special": true,
                "skillName": "快速射擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278623744.webp"
            },
            {
                "category": "祕法",
                "option": "重型火砲 傷害倍率增加",
                "base": "100",
                "special": true,
                "skillName": "重型火砲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278649869.webp"
            },
            {
                "category": "祕法",
                "option": "毀滅加農砲 傷害倍率增加",
                "base": "80",
                "special": true,
                "skillName": "毀滅加農砲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278701243.webp"
            },
            {
                "category": "祕法",
                "option": "致命瞄準 傷害倍率增加",
                "base": "50",
                "special": true,
                "skillName": "致命瞄準",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278723055.webp"
            },
            {
                "category": "主要才能",
                "option": "듀얼건 最大傷害增加",
                "base": "10",
                "skillName": "精通雙槍",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278306799.webp"
            },
            {
                "category": "主要才能",
                "option": "十字爆破 傷害倍率增加",
                "base": "50",
                "skillName": "十字爆破",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278307675.webp"
            },
            {
                "category": "主要才能",
                "option": "終結 傷害倍率增加",
                "base": "100",
                "skillName": "終結",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278308617.webp"
            },
            {
                "category": "主要才能",
                "option": "遠退 1발每 傷害倍率增加",
                "base": "8",
                "skillName": "遠退",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278309610.webp"
            },
            {
                "category": "主要才能",
                "option": "射擊突進 1발每 傷害倍率增加",
                "base": "10",
                "skillName": "射擊突進",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278310521.webp"
            }
        ]
    },
    {
        "id": 8,
        "name": "禁忌煉金士",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974686850.webp",
        "mainTalent": "戰鬥鍊金術",
        "subTalent": "藥品研究",
        "combos": [
            {
                "id": 22,
                "skillName": "螺旋噴發",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278967471.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782839006456.webp",
                "words": [
                    "薩爾",
                    "阿爾姆",
                    "埃巴德"
                ],
                "points": {
                    "5": "螺旋噴發: 응축\n\n螺旋噴發的累積 冷卻時間 依照 可 最大 充能 次數相當於 一次 充能以,\n半徑 3m 範圍內的敵人 目標들을 中심으로 每기고 攻擊\n\n1充能 傷害: 原有 傷害的100%,\n1充能 追加 時每 38%相當於 傷害 增加\n充能 次數 依比例 홀딩 時 0.5秒各 增加\n\n技能 使用時, 4屬性 鍊金術 能量 恢復\n(元素 콤비네이션 조합식的결정 消耗量 依照 能量 恢復量 增加)\n充能 次數 依比例 能量 恢復量 增加",
                    "6": "螺旋噴發: 응축\n\n螺旋噴發的累積 冷卻時間 依照 可 最大 充能 次數相當於 一次 充能以,\n半徑 3m 範圍內的敵人 目標들을 中심으로 每기고 攻擊\n\n1充能 傷害: 原有 傷害的105%,\n1充能 追加 時每 41%相當於 傷害 增加\n充能 次數 依比例 홀딩 時 0.5秒各 增加\n\n技能 使用時, 4屬性 鍊金術 能量 恢復\n(元素 콤비네이션 조합식的결정 消耗量 依照 能量 恢復量 增加)\n充能 次數 依比例 能量 恢復量 增加",
                    "7": "螺旋噴發: 응축\n\n螺旋噴發的累積 冷卻時間 依照 可 最大 充能 次數相當於 一次 充能以,\n半徑 3m 範圍內的敵人 目標들을 中심으로 每기고 攻擊\n\n1充能 傷害: 原有 傷害的110%,\n1充能 追加 時每 44%相當於 傷害 增加\n充能 次數 依比例 홀딩 時 0.5秒各 增加\n\n技能 使用時, 4屬性 鍊金術 能量 恢復\n(元素 콤비네이션 조합식的결정 消耗量 依照 能量 恢復量 增加)\n充能 次數 依比例 能量 恢復量 增加",
                    "8": "螺旋噴發: 응축\n\n螺旋噴發的累積 冷卻時間 依照 可 最大 充能 次數相當於 一次 充能以,\n半徑 3m 範圍內的敵人 目標들을 中심으로 每기고 攻擊\n\n1充能 傷害: 原有 傷害的115%,\n1充能 追加 時每 47%相當於 傷害 增加\n充能 次數 依比例 홀딩 時 0.5秒各 增加\n\n技能 使用時, 4屬性 鍊金術 能量 恢復\n(元素 콤비네이션 조합식的결정 消耗量 依照 能量 恢復量 增加)\n充能 次數 依比例 能量 恢復量 增加",
                    "9": "螺旋噴發: 응축\n\n螺旋噴發的累積 冷卻時間 依照 可 最大 充能 次數相當於 一次 充能以,한\n最大 充能 次數相當於 一次 充能以,\n半徑 3m 範圍內的敵人 目標들을 中심으로 每기고 攻擊\n\n1充能 傷害: 原有 傷害的120%,\n1充能 追加 時每 50%相當於 傷害 增加\n充能 次數 依比例 홀딩 時 0.5秒各 增加\n\n技能 使用時, 4屬性 鍊金術 能量 恢復\n(元素 콤비네이션 조합식的결정 消耗量 依照 能量 恢復量 增加)\n充能 次數 依比例 能量 恢復量 增加"
                }
            },
            {
                "id": 23,
                "skillName": "化學嘉年華",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278947694.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782839222619.webp",
                "words": [
                    "里斯",
                    "科爾",
                    "烏爾"
                ],
                "points": {
                    "5": "化學嘉年華: 幅화\n\n半徑 2.5m 範圍內的敵人 對目標\n原有 技能 傷害 최秒 攻擊\n\n半徑 6.5m 範圍內的敵人 對目標\n첫 爆發 傷害的110% 該하는 後續 爆發 發生\n後續 爆發 屬性 能量 消耗量 관계없이 1次 發生\n屬性 能量 消耗量 依比例 後續 爆發 傷害 增加\n\n後續 爆發 맞은 敵人 對目標 8秒 期間 持續的 減益 賦予\n減益 賦予受到的 敵人 對目標 1秒 한 번\n4屬性 鍊金術 傷害 평균的10%的트 傷害 줌\n減益 賦予受到的 敵人 對目標\n포비든 알케미스트 技能 命中하면,\n化學嘉年華 使用時 消耗한 屬性 能量 10% 충前\n\n冷卻時間 6秒",
                    "6": "化學嘉年華: 幅화\n\n半徑 2.5m 範圍內的敵人 對目標\n原有 技能 傷害 최秒 攻擊\n\n半徑 6.5m 範圍內的敵人 對目標\n첫 爆發 傷害的120% 該하는 後續 爆發 發生\n後續 爆發 屬性 能量 消耗量 관계없이 1次 發生\n屬性 能量 消耗量 依比例 後續 爆發 傷害 增加\n\n後續 爆發 맞은 敵人 對目標 8秒 期間 持續的 減益 賦予\n減益 賦予受到的 敵人 對目標 1秒 한 번\n4屬性 鍊金術 傷害 평균的12%的트 傷害 줌\n減益 賦予受到的 敵人 對目標\n포비든 알케미스트 技能 命中하면,\n化學嘉年華 使用時 消耗한 屬性 能量 10% 충前\n\n冷卻時間 6秒",
                    "7": "化學嘉年華: 幅화\n\n半徑 2.5m 範圍內的敵人 對目標\n原有 技能 傷害 최秒 攻擊\n\n半徑 6.5m 範圍內的敵人 對目標\n첫 爆發 傷害的130% 該하는 後續 爆發 發生\n後續 爆發 屬性 能量 消耗量 관계없이 1次 發生\n屬性 能量 消耗量 依比例 後續 爆發 傷害 增加\n\n後續 爆發 맞은 敵人 對目標 8秒 期間 持續的 減益 賦予\n減益 賦予受到的 敵人 對目標 1秒 한 번\n4屬性 鍊金術 傷害 평균的14%的트 傷害 줌\n減益 賦予受到的 敵人 對目標\n포비든 알케미스트 技能 命中하면,\n化學嘉年華 使用時 消耗한 屬性 能量 10% 충前\n\n冷卻時間 6秒",
                    "8": "化學嘉年華: 幅화\n\n半徑 2.5m 範圍內的敵人 對目標\n原有 技能 傷害 최秒 攻擊\n\n半徑 6.5m 範圍內的敵人 對目標\n첫 爆發 傷害的140% 該하는 後續 爆發 發生\n後續 爆發 屬性 能量 消耗量 관계없이 1次 發生\n屬性 能量 消耗量 依比例 後續 爆發 傷害 增加\n\n後續 爆發 맞은 敵人 對目標 8秒 期間 持續的 減益 賦予\n減益 賦予受到的 敵人 對目標 1秒 한 번\n4屬性 鍊金術 傷害 평균的17%的트 傷害 줌\n減益 賦予受到的 敵人 對目標\n포비든 알케미스트 技能 命中하면,\n化學嘉年華 使用時 消耗한 屬性 能量 10% 충前\n\n冷卻時間 6秒",
                    "9": "化學嘉年華: 幅화\n\n半徑 2.5m 範圍內的敵人 對目標\n原有 技能 傷害 최秒 攻擊\n\n半徑 6.5m 範圍內的敵人 對目標\n첫 爆發 傷害的150% 該하는 後續 爆發 發生\n後續 爆發 屬性 能量 消耗量 관계없이 1次 發生\n屬性 能量 消耗量 依比例 後續 爆發 傷害 增加\n\n後續 爆發 맞은 敵人 對目標 8秒 期間 持續的 減益 賦予\n減益 賦予受到的 敵人 對目標 1秒 한 번\n4屬性 鍊金術 傷害 평균的20%的트 傷害 줌\n減益 賦予受到的 敵人 對目標\n포비든 알케미스트 技能 命中하면,\n化學嘉年華 使用時 消耗한 屬性 能量 10% 충前\n\n冷卻時間 6秒"
                }
            },
            {
                "id": 24,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "佩恩",
                    "路斯",
                    "溫"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "召喚夢魘 (土 鍊金術 效果) 技能 最終 傷害倍率增加",
                "base": "0.2",
                "special": true,
                "skillName": "召喚夢魘",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278930240.webp"
            },
            {
                "category": "祕法",
                "option": "化學嘉年華 (火 鍊金術 效果) 주 목표에게 주는 最終 傷害倍率增加",
                "base": "0.2",
                "special": true,
                "skillName": "化學嘉年華",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278947694.webp"
            },
            {
                "category": "祕法",
                "option": "螺旋噴發 (水 鍊金術 效果) 技能 技能 最終 傷害倍率增加",
                "base": "1",
                "special": true,
                "skillName": "螺旋噴發",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278967471.webp"
            },
            {
                "category": "主要才能",
                "option": "水砲 最大傷害倍率增加",
                "base": "2",
                "skillName": "水砲",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278247977.webp"
            },
            {
                "category": "主要才能",
                "option": "火焰噴射器 最大傷害倍率增加",
                "base": "1",
                "skillName": "火焰噴射器",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278252037.webp"
            },
            {
                "category": "主要才能",
                "option": "熱能爆破 最大傷害倍率增加",
                "base": "5",
                "skillName": "熱能爆破",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278250977.webp"
            },
            {
                "category": "屬性",
                "option": "火 屬性 鍊金術 傷害 增加",
                "base": "10"
            },
            {
                "category": "屬性",
                "option": "水 屬性 鍊金術 傷害 增加",
                "base": "10"
            },
            {
                "category": "屬性",
                "option": "風 屬性 鍊金術 傷害 增加",
                "base": "10"
            },
            {
                "category": "屬性",
                "option": "土 屬性 鍊金術 傷害 增加",
                "base": "10"
            }
        ]
    },
    {
        "id": 9,
        "name": "旋律人偶師",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770440624569.webp",
        "mainTalent": "人偶術",
        "subTalent": "音樂",
        "combos": [
            {
                "id": 25,
                "skillName": "間奏斬擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441962685.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782840551382.webp",
                "words": [
                    "里斯",
                    "蓋塔爾",
                    "斯特拉夫"
                ],
                "points": {
                    "5": "間奏斬擊: 漸強\n\n人偶 召喚 技能 攻擊 時 對敵人 最大 3次直到 쌓이는 層형 '漸強' 狀態 賦予\n\n層 쌓인 敵人 層 數 비례한 傷害 攻擊\n(人偶 1기 以上 召喚되었을 時 技能 使用 可)\n1層 傷害: 原有 間奏斬擊 傷害倍率 +5%\n層 5秒 維持되며, 維持 時 結束 時 層 秒氣化\n冷卻時間 4秒",
                    "6": "間奏斬擊: 漸強\n\n人偶 召喚 技能 攻擊 時 對敵人 最大 3次直到 쌓이는 層형 '漸強' 狀態 賦予\n\n層 쌓인 敵人 層 數 비례한 傷害 攻擊\n(人偶 1기 以上 召喚되었을 時 技能 使用 可)\n1層 傷害: 原有 間奏斬擊 傷害倍率 +8%\n層 5秒 維持되며, 維持 時 結束 時 層 秒氣化\n冷卻時間 4秒",
                    "7": "間奏斬擊: 漸強\n\n人偶 召喚 技能 攻擊 時 對敵人 最大 3次直到 쌓이는 層형 '漸強' 狀態 賦予\n\n層 쌓인 敵人 層 數 비례한 傷害 攻擊\n(人偶 1기 以上 召喚되었을 時 技能 使用 可)\n1層 傷害: 原有 間奏斬擊 傷害倍率 +12%\n層 5秒 維持되며, 維持 時 結束 時 層 秒氣化\n冷卻時間 4秒",
                    "8": "間奏斬擊: 漸強\n\n人偶 召喚 技能 攻擊 時 對敵人 最大 3次直到 쌓이는 層형 '漸強' 狀態 賦予\n\n層 쌓인 敵人 層 數 비례한 傷害 攻擊\n(人偶 1기 以上 召喚되었을 時 技能 使用 可)\n1層 傷害: 原有 間奏斬擊 傷害倍率 +16%\n層 5秒 維持되며, 維持 時 結束 時 層 秒氣化\n冷卻時間 4秒",
                    "9": "間奏斬擊: 漸強\n\n人偶 召喚 技能 攻擊 時 對敵人 最大 3次直到 쌓이는 層형 '漸強' 狀態 賦予\n\n層 쌓인 敵人 層 數 비례한 傷害 攻擊\n(人偶 1기 以上 召喚되었을 時 技能 使用 可)\n1層 傷害: 原有 間奏斬擊 傷害倍率 +20%\n層 5秒 維持되며, 維持 時 結束 時 層 秒氣化\n冷卻時間 4秒"
                }
            },
            {
                "id": 26,
                "skillName": "強拍重音",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441613507.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782840784984.webp",
                "words": [
                    "佩恩",
                    "敏",
                    "伊芬"
                ],
                "points": {
                    "5": "強拍重音: 앙상블\n\n召喚 可 人偶 全部 召喚\n\n人偶 3기 召喚 時, 각 人偶 幅 5m, 長度 10m 範圍 세 방향 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的60% 追加 攻擊\n\n人偶 2기 召喚 時, 人偶 2기가 幅 7.5m, 長度 10m 範圍 앞으로 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的70% 追加 攻擊\n\n人偶 1기 召喚 時, 人偶 1기가 半徑 2.5m 內 對敵人\n突進並 強拍重音的最終 傷害的80% 3次攻擊\n\n冷卻時間 8秒",
                    "6": "強拍重音: 앙상블\n\n召喚 可 人偶 全部 召喚\n\n人偶 3기 召喚 時, 각 人偶 幅 5m, 長度 10m 範圍 세 방향 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的65% 追加 攻擊\n\n人偶 2기 召喚 時, 人偶 2기가 幅 7.5m, 長度 10m 範圍 앞으로 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的75% 追加 攻擊\n\n人偶 1기 召喚 時, 人偶 1기가 半徑 2.5m 內 對敵人\n突進並 強拍重音的最終 傷害的85% 3次攻擊\n\n冷卻時間 8秒",
                    "7": "強拍重音: 앙상블\n\n召喚 可 人偶 全部 召喚\n\n人偶 3기 召喚 時, 각 人偶 幅 5m, 長度 10m 範圍 세 방향 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的70% 追加 攻擊\n\n人偶 2기 召喚 時, 人偶 2기가 幅 7.5m, 長度 10m 範圍 앞으로 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的80% 追加 攻擊\n\n人偶 1기 召喚 時, 人偶 1기가 半徑 2.5m 內 對敵人\n突進並 強拍重音的最終 傷害的90% 3次攻擊\n\n冷卻時間 8秒",
                    "8": "強拍重音: 앙상블\n\n召喚 可 人偶 全部 召喚\n\n人偶 3기 召喚 時, 각 人偶 幅 5m, 長度 10m 範圍 세 방향 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的75% 追加 攻擊\n\n人偶 2기 召喚 時, 人偶 2기가 幅 7.5m, 長度 10m 範圍 앞으로 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的85% 追加 攻擊\n\n人偶 1기 召喚 時, 人偶 1기가 半徑 2.5m 內 對敵人\n突進並 強拍重音的最終 傷害的95% 3次攻擊\n\n冷卻時間 8秒",
                    "9": "強拍重音: 앙상블\n\n召喚 可 人偶 全部 召喚\n\n人偶 3기 召喚 時, 각 人偶 幅 5m, 長度 10m 範圍 세 방향 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的80% 追加 攻擊\n\n人偶 2기 召喚 時, 人偶 2기가 幅 7.5m, 長度 10m 範圍 앞으로 突進並 2次攻擊\n強拍重音的最終 傷害 최秒 攻擊,\n최秒 攻擊的90% 追加 攻擊\n\n人偶 1기 召喚 時, 人偶 1기가 半徑 2.5m 內 對敵人\n突進並 強拍重音的最終 傷害的100% 3次攻擊\n\n冷卻時間 8秒"
                }
            },
            {
                "id": 27,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "寧",
                    "達爾",
                    "烏爾"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "強拍重音 傷害倍率增加",
                "base": "250",
                "special": true,
                "skillName": "強拍重音",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441613507.webp"
            },
            {
                "category": "祕法",
                "option": "追蹤步伐 傷害倍率增加",
                "base": "50",
                "special": true,
                "skillName": "追蹤步伐",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441690885.webp"
            },
            {
                "category": "祕法",
                "option": "壯麗終章 콜로서스, 피에로, 에코 마리오네트 追加 傷害倍率增加",
                "base": "300",
                "special": true,
                "skillName": "壯麗終章",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441797050.webp"
            },
            {
                "category": "祕法",
                "option": "鋼絲網 傷害倍率增加",
                "base": "500",
                "special": true,
                "skillName": "鋼絲網",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441883324.webp"
            },
            {
                "category": "祕法",
                "option": "間奏斬擊 第四幕：嫉妒的化身 傷害倍率增加",
                "base": "3",
                "special": true,
                "skillName": "間奏斬擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441962685.webp"
            },
            {
                "category": "主要才能",
                "option": "第一幕：偶然的衝突 傷害倍率增加",
                "base": "15",
                "skillName": "第一幕：偶然的衝突",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278299063.webp"
            },
            {
                "category": "主要才能",
                "option": "第二幕：激增的憤怒 傷害倍率增加",
                "base": "20",
                "skillName": "第二幕：激增的憤怒",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278298144.webp"
            },
            {
                "category": "主要才能",
                "option": "第四幕：嫉妒的化身 傷害倍率增加",
                "base": "10",
                "skillName": "第四幕：嫉妒的化身",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278300004.webp"
            },
            {
                "category": "主要才能",
                "option": "第七幕：狂亂的奔走 傷害倍率增加",
                "base": "10",
                "skillName": "第七幕：狂亂的奔走",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278302035.webp"
            },
            {
                "category": "屬性",
                "option": "마리오네트 最大傷害增加",
                "base": "10"
            }
        ]
    },
    {
        "id": 10,
        "name": "狂怒鬥士",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770440758409.webp",
        "mainTalent": "格鬥術",
        "subTalent": "近距離戰鬥",
        "combos": [
            {
                "id": 28,
                "skillName": "疾風穿刺",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443293567.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782841606401.webp",
                "words": [
                    "寧",
                    "阿爾姆",
                    "埃曼科爾"
                ],
                "points": {
                    "5": "疾風穿刺: 突進\n\n疾風穿刺 使用時 目標한 敵人 방향으로 5m 突進 後, 原有 疾風穿刺 傷害的100% 攻擊\n\n疾風穿刺 使用 後 5秒 內 연속기 3階段 技能 使用時, 原有 傷害的104% 敵人 攻擊\n\n力量 消耗量 1個\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並, 拳套 武器 使用以 攻擊 造成的 技能的傷害量 15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "6": "疾風穿刺: 突進\n\n疾風穿刺 使用時 目標한 敵人 방향으로 5m 突進 後, 原有 疾風穿刺 傷害的105% 攻擊\n\n疾風穿刺 使用 後 5秒 內 연속기 3階段 技能 使用時, 原有 傷害的106% 敵人 攻擊\n\n力量 消耗量 1個\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並, 拳套 武器 使用以 攻擊 造成的 技能的傷害量 15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "7": "疾風穿刺: 突進\n\n疾風穿刺 使用時 目標한 敵人 방향으로 5m 突進 後, 原有 疾風穿刺 傷害的110% 攻擊\n\n疾風穿刺 使用 後 5秒 內 연속기 3階段 技能 使用時, 原有 傷害的108% 敵人 攻擊\n\n力量 消耗量 1個\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並, 拳套 武器 使用以 攻擊 造成的 技能的傷害量 15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "8": "疾風穿刺: 突進\n\n疾風穿刺 使用時 目標한 敵人 방향으로 5m 突進 後, 原有 疾風穿刺 傷害的115% 攻擊\n\n疾風穿刺 使用 後 5秒 內 연속기 3階段 技能 使用時, 原有 傷害的110% 敵人 攻擊\n\n力量 消耗量 1個\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並, 拳套 武器 使用以 攻擊 造成的 技能的傷害量 15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "9": "疾風穿刺: 突進\n\n疾風穿刺 使用時 目標한 敵人 방향으로 5m 突進 後, 原有 疾風穿刺 傷害的120% 攻擊\n\n疾風穿刺 使用 後 5秒 內 연속기 3階段 技能 使用時, 原有 傷害的112% 敵人 攻擊\n\n力量 消耗量 1個\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並, 拳套 武器 使用以 攻擊 造成的 技能的傷害量 15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))"
                }
            },
            {
                "id": 29,
                "skillName": "終極一擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443428941.webp",
                "inGameImg": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782841801692.webp",
                "words": [
                    "佩恩",
                    "凱爾特",
                    "伊蘭德"
                ],
                "points": {
                    "5": "終極一擊: 극的\n\n原有 1,2타 攻擊 傷害的120% 2次攻擊\n原有 終結 攻擊 傷害的150% 終結 攻擊\n\n力量 消耗量 3個\n冷卻時間 45秒\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並,\n拳套 武器 使用以 攻擊 造成的 技能的傷害量\n15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "6": "終極一擊: 극的\n\n原有 1,2타 攻擊 傷害的130% 2次攻擊\n原有 終結 攻擊 傷害的170% 終結 攻擊\n\n力量 消耗量 3個\n冷卻時間 45秒\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並,\n拳套 武器 使用以 攻擊 造成的 技能的傷害量\n15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "7": "終極一擊: 극的\n\n原有 1,2타 攻擊 傷害的140% 2次攻擊\n原有 終結 攻擊 傷害的190% 終結 攻擊\n\n力量 消耗量 3個\n冷卻時間 45秒\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並,\n拳套 武器 使用以 攻擊 造成的 技能的傷害量\n15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "8": "終極一擊: 극的\n\n原有 1,2타 攻擊 傷害的150% 2次攻擊\n原有 終結 攻擊 傷害的210% 終結 攻擊\n\n力量 消耗量 3個\n冷卻時間 45秒\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並,\n拳套 武器 使用以 攻擊 造成的 技能的傷害量\n15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))",
                    "9": "終極一擊: 극的\n\n原有 1,2타 攻擊 傷害的160% 2次攻擊\n原有 終結 攻擊 傷害的230% 終結 攻擊\n\n力量 消耗量 3個\n冷卻時間 45秒\n\n自身게 狂怒 絕對 10秒 期間 套用\n(一定 數준 以下的重型 標準 者동 防禦 무時並,\n拳套 武器 使用以 攻擊 造成的 技能的傷害量\n15% 增加 效果 賦予 (狂暴 衝擊 效果 疊加 無法))"
                }
            },
            {
                "id": 30,
                "skillName": "未公開",
                "skillIcon": null,
                "inGameImg": null,
                "words": [
                    "貝赫",
                    "烏赫",
                    "斯特拉夫"
                ],
                "points": {}
            }
        ],
        "effectTable": [
            {
                "category": "祕法",
                "option": "超越：連鎖打擊 3次攻擊 及 終結 攻擊的傷害倍率增加",
                "base": "80",
                "special": true,
                "skillName": "超越：連鎖打擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770442704738.webp"
            },
            {
                "category": "祕法",
                "option": "超越：衝擊俯衝 傷害倍率增加",
                "base": "100",
                "special": true,
                "skillName": "超越：衝擊俯衝",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770442792340.webp"
            },
            {
                "category": "祕法",
                "option": "超越：力量猛擊 傷害倍率增加",
                "base": "500",
                "special": true,
                "skillName": "超越：力量猛擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770442862350.webp"
            },
            {
                "category": "祕法",
                "option": "疾風穿刺 傷害倍率增加",
                "base": "260",
                "special": true,
                "skillName": "疾風穿刺",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443293567.webp"
            },
            {
                "category": "祕法",
                "option": "終極一擊 2次攻擊 及 終結 攻擊的傷害倍率增加",
                "base": "260",
                "special": true,
                "skillName": "終極一擊",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443428941.webp"
            },
            {
                "category": "祕法",
                "option": "力量閃焰 傷害倍率增加",
                "base": "260",
                "special": true,
                "skillName": "力量閃焰",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443353075.webp"
            },
            {
                "category": "主要才能",
                "option": "精通拳套 最大傷害增加",
                "base": "10",
                "skillName": "精通拳套",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278269637.webp"
            },
            {
                "category": "主要才能",
                "option": "精通連續技 傷害倍率增加",
                "base": "2",
                "skillName": "精通連續技",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278270518.webp"
            },
            {
                "category": "主要才能",
                "option": "連續技：衝刺拳 傷害倍率增加",
                "base": "6",
                "skillName": "連續技：衝刺拳",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278271376.webp"
            },
            {
                "category": "主要才能",
                "option": "連續技：充能拳 傷害倍率增加",
                "base": "12",
                "skillName": "連續技：充能拳",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278272230.webp"
            },
            {
                "category": "主要才能",
                "option": "連續技：螺旋勾拳 傷害倍率增加",
                "base": "18",
                "skillName": "連續技：螺旋勾拳",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278273220.webp"
            },
            {
                "category": "主要才能",
                "option": "連續技：翻筋斗 傷害倍率增加",
                "base": "22",
                "skillName": "連續技：翻筋斗",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278274146.webp"
            },
            {
                "category": "主要才能",
                "option": "連續技：落踢 傷害倍率增加",
                "base": "24",
                "skillName": "連續技：落踢",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278275101.webp"
            },
            {
                "category": "主要才能",
                "option": "連續技：重搗 傷害倍率增加",
                "base": "24",
                "skillName": "連續技：重搗",
                "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278275959.webp"
            }
        ]
    }
];
