// 符文模擬器資料 — 由 labanyu 站 __NEXT_DATA__ 抽取並翻譯繁中
// 詞條池（依祕法+符文）= 祕法專屬(特殊符文)+主要才能+副才能+屬性；每抽均勻隨機、等級 1~maxLevel 均勻

export interface SimOption {
    id: number;
    name: string;
    value: number;
    maxLevel: number;
    percent: boolean;
    kind: "arcana" | "talent" | "stat" | "other";
    arcanaId?: number | null;
    talentId?: number;
    skillName?: string;
    skillIcon?: string;
}
export interface SimWord {
    id: number; name: string; icon: string; iconPos: string;
    hasArcana: boolean; hasTalent: boolean;
}
export interface SimArcana {
    id: number; name: string; icon: string;
    mainTalentId: number; subTalentId: number; mainTalent: string; subTalent: string;
}
export interface SimPriceItem { name: string; thumbnail: string; count: number; }
export interface SimPrice { rockLine: number; gold: number; items: SimPriceItem[]; }

export const simArcanas: SimArcana[] = [
    {
        "id": 1,
        "name": "元素騎士",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974455716.webp",
        "mainTalentId": 1,
        "subTalentId": 2,
        "mainTalent": "近距離戰鬥",
        "subTalent": "魔法"
    },
    {
        "id": 2,
        "name": "聖詠者",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974506104.webp",
        "mainTalentId": 16,
        "subTalentId": 6,
        "mainTalent": "祝福",
        "subTalent": "音樂"
    },
    {
        "id": 3,
        "name": "縛魂者",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974539533.webp",
        "mainTalentId": 2,
        "subTalentId": 12,
        "mainTalent": "魔法",
        "subTalent": "鎖鏈斬"
    },
    {
        "id": 4,
        "name": "秘術遊俠",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974562311.webp",
        "mainTalentId": 3,
        "subTalentId": 4,
        "mainTalent": "弓術",
        "subTalent": "戰鬥鍊金術"
    },
    {
        "id": 5,
        "name": "聖盾守衛",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974584004.webp",
        "mainTalentId": 1,
        "subTalentId": 16,
        "mainTalent": "近距離戰鬥",
        "subTalent": "祝福"
    },
    {
        "id": 6,
        "name": "爆裂槍兵",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974606466.webp",
        "mainTalentId": 8,
        "subTalentId": 10,
        "mainTalent": "騎槍",
        "subTalent": "槍手"
    },
    {
        "id": 7,
        "name": "幻變槍手",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974664397.webp",
        "mainTalentId": 10,
        "subTalentId": 9,
        "mainTalent": "槍手",
        "subTalent": "煉成鍊金術"
    },
    {
        "id": 8,
        "name": "禁忌煉金士",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1761974686850.webp",
        "mainTalentId": 4,
        "subTalentId": 20,
        "mainTalent": "戰鬥鍊金術",
        "subTalent": "藥品研究"
    },
    {
        "id": 9,
        "name": "旋律人偶師",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770440624569.webp",
        "mainTalentId": 7,
        "subTalentId": 6,
        "mainTalent": "人偶術",
        "subTalent": "音樂"
    },
    {
        "id": 10,
        "name": "狂怒鬥士",
        "icon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770440758409.webp",
        "mainTalentId": 5,
        "subTalentId": 1,
        "mainTalent": "格鬥術",
        "subTalent": "近距離戰鬥"
    }
];
export const simWords: SimWord[] = [
    {
        "id": 1,
        "name": "貝赫",
        "icon": "ᚁ",
        "iconPos": "top",
        "hasArcana": true,
        "hasTalent": true
    },
    {
        "id": 2,
        "name": "里斯",
        "icon": "ᚂ",
        "iconPos": "top",
        "hasArcana": true,
        "hasTalent": true
    },
    {
        "id": 3,
        "name": "佩恩",
        "icon": "ᚃ",
        "iconPos": "top",
        "hasArcana": true,
        "hasTalent": true
    },
    {
        "id": 4,
        "name": "薩爾",
        "icon": "ᚄ",
        "iconPos": "top",
        "hasArcana": true,
        "hasTalent": true
    },
    {
        "id": 5,
        "name": "寧",
        "icon": "ᚅ",
        "iconPos": "top",
        "hasArcana": true,
        "hasTalent": true
    },
    {
        "id": 6,
        "name": "烏赫",
        "icon": "ᚆ",
        "iconPos": "bottom",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 7,
        "name": "達爾",
        "icon": "ᚇ",
        "iconPos": "bottom",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 8,
        "name": "提訥",
        "icon": "ᚈ",
        "iconPos": "bottom",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 9,
        "name": "科爾",
        "icon": "ᚉ",
        "iconPos": "bottom",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 10,
        "name": "凱爾特",
        "icon": "ᚊ",
        "iconPos": "bottom",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 11,
        "name": "敏",
        "icon": "ᚋ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 12,
        "name": "戈爾特",
        "icon": "ᚌ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 13,
        "name": "蓋塔爾",
        "icon": "ᚍ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 14,
        "name": "斯特拉夫",
        "icon": "ᚎ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 15,
        "name": "路斯",
        "icon": "ᚏ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 16,
        "name": "阿爾姆",
        "icon": "ᚐ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 17,
        "name": "溫",
        "icon": "ᚑ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 18,
        "name": "烏爾",
        "icon": "ᚒ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 19,
        "name": "埃達德",
        "icon": "ᚓ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 20,
        "name": "伊達德",
        "icon": "ᚔ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 21,
        "name": "埃巴德",
        "icon": "ᚕ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 22,
        "name": "奧爾",
        "icon": "ᚖ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 23,
        "name": "伊蘭德",
        "icon": "ᚗ",
        "iconPos": "top",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 24,
        "name": "伊芬",
        "icon": "ᚘ",
        "iconPos": "top",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 25,
        "name": "埃曼科爾",
        "icon": "ᚙ",
        "iconPos": "bottom",
        "hasArcana": false,
        "hasTalent": true
    },
    {
        "id": 26,
        "name": "佩赫",
        "icon": "ᚚ",
        "iconPos": "center",
        "hasArcana": false,
        "hasTalent": true
    }
];
export const simOptions: SimOption[] = [
    {
        "id": 1,
        "name": "火焰躍擊 傷害倍率增加",
        "value": 150,
        "maxLevel": 10,
        "percent": true,
        "skillName": "火焰躍擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278421478.webp",
        "kind": "arcana",
        "arcanaId": 1
    },
    {
        "id": 2,
        "name": "寒冰旋風 傷害倍率增加",
        "value": 200,
        "maxLevel": 10,
        "percent": true,
        "skillName": "寒冰旋風",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278422382.webp",
        "kind": "arcana",
        "arcanaId": 1
    },
    {
        "id": 3,
        "name": "閃電雷擊 傷害倍率增加",
        "value": 100,
        "maxLevel": 10,
        "percent": true,
        "skillName": "閃電雷擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278423237.webp",
        "kind": "arcana",
        "arcanaId": 1
    },
    {
        "id": 4,
        "name": "破陣突圍 傷害倍率增加",
        "value": 50,
        "maxLevel": 10,
        "percent": true,
        "skillName": "破陣突圍",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278425034.webp",
        "kind": "arcana",
        "arcanaId": 1
    },
    {
        "id": 5,
        "name": "活力之聲 每秒 生命力 恢復量 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "活力之聲",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278414788.webp",
        "kind": "arcana",
        "arcanaId": 2
    },
    {
        "id": 6,
        "name": "救贖的迴聲 傷害倍率增加",
        "value": 4,
        "maxLevel": 10,
        "percent": true,
        "skillName": "救贖的迴聲",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278413895.webp",
        "kind": "arcana",
        "arcanaId": 2
    },
    {
        "id": 7,
        "name": "淨化的鼓動 每秒 傷害 增加",
        "value": 1000,
        "maxLevel": 10,
        "percent": false,
        "skillName": "淨化的鼓動",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278415715.webp",
        "kind": "arcana",
        "arcanaId": 2
    },
    {
        "id": 8,
        "name": "音波洗禮 傷害倍率增加",
        "value": 7,
        "maxLevel": 10,
        "percent": true,
        "skillName": "音波洗禮",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1778732999727.webp",
        "kind": "arcana",
        "arcanaId": 2
    },
    {
        "id": 9,
        "name": "龍焰 火 最大傷害倍率增加",
        "value": 250,
        "maxLevel": 10,
        "percent": true,
        "skillName": "龍焰",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278426208.webp",
        "kind": "arcana",
        "arcanaId": 3
    },
    {
        "id": 10,
        "name": "暗雷連結 電擊 最大傷害倍率增加",
        "value": 20,
        "maxLevel": 10,
        "percent": true,
        "skillName": "暗雷連結",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278427071.webp",
        "kind": "arcana",
        "arcanaId": 3
    },
    {
        "id": 11,
        "name": "寒冰送葬 每秒 冰 最大傷害倍率增加",
        "value": 35,
        "maxLevel": 10,
        "percent": true,
        "skillName": "寒冰送葬",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278428014.webp",
        "kind": "arcana",
        "arcanaId": 3
    },
    {
        "id": 12,
        "name": "潛伏點火 火 最大傷害倍率增加",
        "value": 300,
        "maxLevel": 10,
        "percent": true,
        "skillName": "潛伏點火",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1782350228756.webp",
        "kind": "arcana",
        "arcanaId": 3
    },
    {
        "id": 13,
        "name": "爆炎箭 傷害倍率增加",
        "value": 50,
        "maxLevel": 10,
        "percent": true,
        "skillName": "爆炎箭",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278432654.webp",
        "kind": "arcana",
        "arcanaId": 4
    },
    {
        "id": 14,
        "name": "流水射擊 最大傷害倍率增加",
        "value": 150,
        "maxLevel": 10,
        "percent": true,
        "skillName": "流水射擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278433695.webp",
        "kind": "arcana",
        "arcanaId": 4
    },
    {
        "id": 15,
        "name": "界線之力 傷害倍率增加",
        "value": 200,
        "maxLevel": 10,
        "percent": true,
        "skillName": "界線之力",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278434671.webp",
        "kind": "arcana",
        "arcanaId": 4
    },
    {
        "id": 16,
        "name": "霰彈射擊 傷害倍率增加",
        "value": 200,
        "maxLevel": 10,
        "percent": true,
        "skillName": "霰彈射擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278435652.webp",
        "kind": "arcana",
        "arcanaId": 4
    },
    {
        "id": 17,
        "name": "三重極限 一般攻擊, 最後一擊的 傷害倍率增加",
        "value": 60,
        "maxLevel": 10,
        "percent": true,
        "skillName": "三重極限",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278436490.webp",
        "kind": "arcana",
        "arcanaId": 4
    },
    {
        "id": 18,
        "name": "聖域展開 傷害倍率增加",
        "value": 10,
        "maxLevel": 10,
        "percent": true,
        "skillName": "聖域展開",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278438379.webp",
        "kind": "arcana",
        "arcanaId": 5
    },
    {
        "id": 19,
        "name": "盾擊衝鋒 傷害倍率增加",
        "value": 100,
        "maxLevel": 10,
        "percent": true,
        "skillName": "盾擊衝鋒",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278440302.webp",
        "kind": "arcana",
        "arcanaId": 5
    },
    {
        "id": 20,
        "name": "盾崩強襲 傷害倍率增加",
        "value": 50,
        "maxLevel": 10,
        "percent": true,
        "skillName": "盾崩強襲",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278441243.webp",
        "kind": "arcana",
        "arcanaId": 5
    },
    {
        "id": 21,
        "name": "審判重擊 傷害倍率增加",
        "value": 200,
        "maxLevel": 10,
        "percent": true,
        "skillName": "審判重擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278442077.webp",
        "kind": "arcana",
        "arcanaId": 5
    },
    {
        "id": 22,
        "name": "光輝的斷罪 2以及後面階段的 傷害倍率增加",
        "value": 8,
        "maxLevel": 10,
        "percent": true,
        "skillName": "光輝的斷罪",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1778731662673.webp",
        "kind": "arcana",
        "arcanaId": 5
    },
    {
        "id": 23,
        "name": "衝擊粉碎 傷害倍率增加",
        "value": 80,
        "maxLevel": 10,
        "percent": true,
        "skillName": "衝擊粉碎",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278446822.webp",
        "kind": "arcana",
        "arcanaId": 6
    },
    {
        "id": 24,
        "name": "旋渦風暴 傷害倍率增加",
        "value": 200,
        "maxLevel": 10,
        "percent": true,
        "skillName": "旋渦風暴",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278447732.webp",
        "kind": "arcana",
        "arcanaId": 6
    },
    {
        "id": 25,
        "name": "衝鋒突擊 傷害倍率增加",
        "value": 80,
        "maxLevel": 10,
        "percent": true,
        "skillName": "衝鋒突擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278448747.webp",
        "kind": "arcana",
        "arcanaId": 6
    },
    {
        "id": 26,
        "name": "超載爆發 傷害倍率增加",
        "value": 40,
        "maxLevel": 10,
        "percent": true,
        "skillName": "超載爆發",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278449645.webp",
        "kind": "arcana",
        "arcanaId": 6
    },
    {
        "id": 27,
        "name": "湮滅一槍 傷害倍率增加",
        "value": 200,
        "maxLevel": 10,
        "percent": true,
        "skillName": "湮滅一槍",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278450531.webp",
        "kind": "arcana",
        "arcanaId": 6
    },
    {
        "id": 28,
        "name": "迅捷連射 傷害倍率增加",
        "value": 30,
        "maxLevel": 10,
        "percent": true,
        "skillName": "迅捷連射",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278623744.webp",
        "kind": "arcana",
        "arcanaId": 7
    },
    {
        "id": 29,
        "name": "重裝武力 傷害倍率增加",
        "value": 100,
        "maxLevel": 10,
        "percent": true,
        "skillName": "重裝武力",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278649869.webp",
        "kind": "arcana",
        "arcanaId": 7
    },
    {
        "id": 30,
        "name": "毀滅砲擊 傷害倍率增加",
        "value": 80,
        "maxLevel": 10,
        "percent": true,
        "skillName": "毀滅砲擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278701243.webp",
        "kind": "arcana",
        "arcanaId": 7
    },
    {
        "id": 31,
        "name": "死亡準星 傷害倍率增加",
        "value": 50,
        "maxLevel": 10,
        "percent": true,
        "skillName": "死亡準星",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278723055.webp",
        "kind": "arcana",
        "arcanaId": 7
    },
    {
        "id": 32,
        "name": "召喚噩夢 (土 鍊金術 效果) 技能 最終 傷害倍率增加",
        "value": 0.2,
        "maxLevel": 10,
        "percent": true,
        "skillName": "召喚噩夢",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278930240.webp",
        "kind": "arcana",
        "arcanaId": 8
    },
    {
        "id": 33,
        "name": "化學狂歡 (火 鍊金術 效果) 對主目標的 最終 傷害倍率增加",
        "value": 0.2,
        "maxLevel": 10,
        "percent": true,
        "skillName": "化學狂歡",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278947694.webp",
        "kind": "arcana",
        "arcanaId": 8
    },
    {
        "id": 34,
        "name": "地裂螺旋 (水 鍊金術 效果) 技能 技能 最終 傷害倍率增加",
        "value": 1,
        "maxLevel": 10,
        "percent": true,
        "skillName": "地裂螺旋",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278967471.webp",
        "kind": "arcana",
        "arcanaId": 8
    },
    {
        "id": 35,
        "name": "強拍重音 傷害倍率增加",
        "value": 250,
        "maxLevel": 10,
        "percent": true,
        "skillName": "強拍重音",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441613507.webp",
        "kind": "arcana",
        "arcanaId": 9
    },
    {
        "id": 36,
        "name": "追蹤步伐 傷害倍率增加",
        "value": 50,
        "maxLevel": 10,
        "percent": true,
        "skillName": "追蹤步伐",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441690885.webp",
        "kind": "arcana",
        "arcanaId": 9
    },
    {
        "id": 37,
        "name": "壯麗終章 콜로서스, 피에로, 에코 人偶 追加 傷害倍率增加",
        "value": 300,
        "maxLevel": 10,
        "percent": true,
        "skillName": "壯麗終章",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441797050.webp",
        "kind": "arcana",
        "arcanaId": 9
    },
    {
        "id": 38,
        "name": "鋼絲網 傷害倍率增加",
        "value": 500,
        "maxLevel": 10,
        "percent": true,
        "skillName": "鋼絲網",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441883324.webp",
        "kind": "arcana",
        "arcanaId": 9
    },
    {
        "id": 39,
        "name": "間奏斬擊 第四幕：嫉妒的化身 傷害倍率增加",
        "value": 3,
        "maxLevel": 10,
        "percent": true,
        "skillName": "間奏斬擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770441962685.webp",
        "kind": "arcana",
        "arcanaId": 9
    },
    {
        "id": 40,
        "name": "超越：連鎖打擊 3次攻擊 及 最後一擊的 傷害倍率增加",
        "value": 80,
        "maxLevel": 10,
        "percent": true,
        "skillName": "超越：連鎖打擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770442704738.webp",
        "kind": "arcana",
        "arcanaId": 10
    },
    {
        "id": 41,
        "name": "超越：衝擊俯衝 傷害倍率增加",
        "value": 100,
        "maxLevel": 10,
        "percent": true,
        "skillName": "超越：衝擊俯衝",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770442792340.webp",
        "kind": "arcana",
        "arcanaId": 10
    },
    {
        "id": 42,
        "name": "超越：力量猛擊 傷害倍率增加",
        "value": 500,
        "maxLevel": 10,
        "percent": true,
        "skillName": "超越：力量猛擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770442862350.webp",
        "kind": "arcana",
        "arcanaId": 10
    },
    {
        "id": 43,
        "name": "烈風穿刺 傷害倍率增加",
        "value": 260,
        "maxLevel": 10,
        "percent": true,
        "skillName": "烈風穿刺",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443293567.webp",
        "kind": "arcana",
        "arcanaId": 10
    },
    {
        "id": 44,
        "name": "終極打擊 2次攻擊 及 最後一擊的 傷害倍率增加",
        "value": 260,
        "maxLevel": 10,
        "percent": true,
        "skillName": "終極打擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443428941.webp",
        "kind": "arcana",
        "arcanaId": 10
    },
    {
        "id": 45,
        "name": "力量閃焰 傷害倍率增加",
        "value": 260,
        "maxLevel": 10,
        "percent": true,
        "skillName": "力量閃焰",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1770443353075.webp",
        "kind": "arcana",
        "arcanaId": 10
    },
    {
        "id": 46,
        "name": "雙槍 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通雙槍",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278306799.webp",
        "kind": "talent",
        "talentId": 10
    },
    {
        "id": 47,
        "name": "火 屬性 鍊金術 傷害 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "kind": "stat",
        "arcanaId": 8
    },
    {
        "id": 48,
        "name": "水 屬性 鍊金術 傷害 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "kind": "stat",
        "arcanaId": 8
    },
    {
        "id": 49,
        "name": "土 屬性 鍊金術 傷害 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "kind": "stat",
        "arcanaId": 8
    },
    {
        "id": 50,
        "name": "風 屬性 鍊金術 傷害 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "kind": "stat",
        "arcanaId": 8
    },
    {
        "id": 51,
        "name": "人偶 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "kind": "stat",
        "arcanaId": null
    },
    {
        "id": 52,
        "name": "魔法 攻擊力增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "kind": "stat",
        "arcanaId": 3
    },
    {
        "id": 53,
        "name": "重擊 傷害倍率增加",
        "value": 50,
        "maxLevel": 20,
        "percent": true,
        "skillName": "重擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278164255.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 54,
        "name": "突擊 傷害倍率增加",
        "value": 60,
        "maxLevel": 20,
        "percent": true,
        "skillName": "突擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278166033.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 55,
        "name": "躍擊 傷害倍率增加",
        "value": 30,
        "maxLevel": 20,
        "percent": true,
        "skillName": "躍擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278167060.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 56,
        "name": "騎槍衝擊 充能 傷害倍率增加",
        "value": 8,
        "maxLevel": 20,
        "percent": true,
        "skillName": "騎槍衝擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278168970.webp",
        "kind": "talent",
        "talentId": 8
    },
    {
        "id": 57,
        "name": "穿心箭 傷害倍率增加",
        "value": 20,
        "maxLevel": 20,
        "percent": true,
        "skillName": "穿心箭",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278174656.webp",
        "kind": "talent",
        "talentId": 3
    },
    {
        "id": 58,
        "name": "旋風擺蓮腿 傷害倍率增加",
        "value": 40,
        "maxLevel": 20,
        "percent": true,
        "skillName": "旋風擺蓮腿",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278182096.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 59,
        "name": "爆裂箭碎片 碎片 傷害倍率增加",
        "value": 20,
        "maxLevel": 20,
        "percent": true,
        "skillName": "爆裂箭碎片",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278186959.webp",
        "kind": "talent",
        "talentId": 3
    },
    {
        "id": 60,
        "name": "精通劍 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通劍",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278189840.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 61,
        "name": "精通斧 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通斧",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278190756.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 62,
        "name": "精通鈍器 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通鈍器",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278191623.webp",
        "kind": "talent",
        "talentId": 1
    },
    {
        "id": 63,
        "name": "精通弓 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通弓",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278200193.webp",
        "kind": "talent",
        "talentId": 3
    },
    {
        "id": 64,
        "name": "精通弩 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通弩",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278201056.webp",
        "kind": "talent",
        "talentId": 3
    },
    {
        "id": 65,
        "name": "精通騎槍 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通騎槍",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278201897.webp",
        "kind": "talent",
        "talentId": 8
    },
    {
        "id": 66,
        "name": "精通拳套 最大傷害增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "精通拳套",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278269637.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 67,
        "name": "精通連續技 傷害倍率增加",
        "value": 2,
        "maxLevel": 20,
        "percent": true,
        "skillName": "精通連續技",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278270518.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 68,
        "name": "連續技能：突拳 傷害倍率增加",
        "value": 6,
        "maxLevel": 20,
        "percent": true,
        "skillName": "連續技能：突拳",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278271376.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 69,
        "name": "連續技能：導電拳擊 傷害倍率增加",
        "value": 12,
        "maxLevel": 20,
        "percent": true,
        "skillName": "連續技能：導電拳擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278272230.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 70,
        "name": "連續技：螺旋勾拳 傷害倍率增加",
        "value": 18,
        "maxLevel": 20,
        "percent": true,
        "skillName": "連續技：螺旋勾拳",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278273220.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 71,
        "name": "連續技：翻筋斗 傷害倍率增加",
        "value": 22,
        "maxLevel": 20,
        "percent": true,
        "skillName": "連續技：翻筋斗",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278274146.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 72,
        "name": "連續技能：飛踢 傷害倍率增加",
        "value": 24,
        "maxLevel": 20,
        "percent": true,
        "skillName": "連續技能：飛踢",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278275101.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 73,
        "name": "連續技能：猛烈突擊 傷害倍率增加",
        "value": 24,
        "maxLevel": 20,
        "percent": true,
        "skillName": "連續技能：猛烈突擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278275959.webp",
        "kind": "talent",
        "talentId": 5
    },
    {
        "id": 74,
        "name": "治療 生命力 最大 恢復量 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "治療",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278216277.webp",
        "kind": "talent",
        "talentId": 16
    },
    {
        "id": 75,
        "name": "隊伍治療 生命力 最大 恢復量 增加",
        "value": 10,
        "maxLevel": 10,
        "percent": false,
        "skillName": "隊伍治療",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278218403.webp",
        "kind": "talent",
        "talentId": 16
    },
    {
        "id": 76,
        "name": "精通火魔法 傷害倍率增加",
        "value": 1,
        "maxLevel": 20,
        "percent": true,
        "skillName": "精通火魔法",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278219232.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 77,
        "name": "精通冰魔法 傷害倍率增加",
        "value": 1,
        "maxLevel": 20,
        "percent": true,
        "skillName": "精通冰魔法",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278220105.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 78,
        "name": "精通雷魔法 傷害倍率增加",
        "value": 1,
        "maxLevel": 20,
        "percent": true,
        "skillName": "精通雷魔法",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278221080.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 79,
        "name": "精通箭系魔法 傷害倍率增加",
        "value": 1,
        "maxLevel": 20,
        "percent": true,
        "skillName": "精通箭系魔法",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278222106.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 80,
        "name": "雷矢 最大傷害倍率增加",
        "value": 2,
        "maxLevel": 20,
        "percent": true,
        "skillName": "雷矢",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278223912.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 81,
        "name": "雷擊 最大傷害倍率增加",
        "value": 0.5,
        "maxLevel": 20,
        "percent": true,
        "skillName": "雷擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278224921.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 82,
        "name": "火焰 最大傷害倍率增加",
        "value": 2,
        "maxLevel": 20,
        "percent": true,
        "skillName": "火焰",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278226774.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 83,
        "name": "火球 最大傷害倍率增加",
        "value": 60,
        "maxLevel": 20,
        "percent": true,
        "skillName": "火球",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278227829.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 84,
        "name": "冰矛 最大傷害倍率增加",
        "value": 2,
        "maxLevel": 20,
        "percent": true,
        "skillName": "冰矛",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278229742.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 85,
        "name": "冰刃 最大傷害倍率增加",
        "value": 6,
        "maxLevel": 20,
        "percent": true,
        "skillName": "冰刃",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278230633.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 86,
        "name": "箭系組合魔法 傷害倍率增加",
        "value": 1,
        "maxLevel": 20,
        "percent": true,
        "skillName": "箭系組合魔法",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278233312.webp",
        "kind": "talent",
        "talentId": 2
    },
    {
        "id": 87,
        "name": "水砲 最大傷害倍率增加",
        "value": 2,
        "maxLevel": 20,
        "percent": true,
        "skillName": "水砲",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278247977.webp",
        "kind": "talent",
        "talentId": 4
    },
    {
        "id": 88,
        "name": "火焰噴射 最大傷害倍率增加",
        "value": 2,
        "maxLevel": 20,
        "percent": true,
        "skillName": "火焰噴射",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278252037.webp",
        "kind": "talent",
        "talentId": 4
    },
    {
        "id": 89,
        "name": "高壓火爆 最大傷害倍率增加",
        "value": 5,
        "maxLevel": 20,
        "percent": true,
        "skillName": "高壓火爆",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278250977.webp",
        "kind": "talent",
        "talentId": 4
    },
    {
        "id": 90,
        "name": "第一幕：偶然的衝突 傷害倍率增加",
        "value": 15,
        "maxLevel": 20,
        "percent": true,
        "skillName": "第一幕：偶然的衝突",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278299063.webp",
        "kind": "talent",
        "talentId": 7
    },
    {
        "id": 91,
        "name": "第二幕：激增的憤怒 傷害倍率增加",
        "value": 20,
        "maxLevel": 20,
        "percent": true,
        "skillName": "第二幕：激增的憤怒",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278298144.webp",
        "kind": "talent",
        "talentId": 7
    },
    {
        "id": 92,
        "name": "第四幕：嫉妒的化身 傷害倍率增加",
        "value": 10,
        "maxLevel": 20,
        "percent": true,
        "skillName": "第四幕：嫉妒的化身",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278300004.webp",
        "kind": "talent",
        "talentId": 7
    },
    {
        "id": 93,
        "name": "第七幕：狂亂的奔走 傷害倍率增加",
        "value": 10,
        "maxLevel": 20,
        "percent": true,
        "skillName": "第七幕：狂亂的奔走",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278302035.webp",
        "kind": "talent",
        "talentId": 7
    },
    {
        "id": 94,
        "name": "十字槍擊 傷害倍率增加",
        "value": 50,
        "maxLevel": 20,
        "percent": true,
        "skillName": "十字槍擊",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278307675.webp",
        "kind": "talent",
        "talentId": 10
    },
    {
        "id": 95,
        "name": "拉近 傷害倍率增加",
        "value": 100,
        "maxLevel": 20,
        "percent": true,
        "skillName": "拉近",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278308617.webp",
        "kind": "talent",
        "talentId": 10
    },
    {
        "id": 96,
        "name": "退遠 每發 傷害倍率增加",
        "value": 8,
        "maxLevel": 20,
        "percent": true,
        "skillName": "退遠",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278309610.webp",
        "kind": "talent",
        "talentId": 10
    },
    {
        "id": 97,
        "name": "衝射 每發 傷害倍率增加",
        "value": 10,
        "maxLevel": 20,
        "percent": true,
        "skillName": "衝射",
        "skillIcon": "https://tacask-cdn.com/mabi-labanyu/web-upload/img-1762278310521.webp",
        "kind": "talent",
        "talentId": 10
    }
];
export const simPrices: SimPrice[] = [
    {
        "rockLine": 0,
        "gold": 5000,
        "items": [
            {
                "name": "符文碎片",
                "thumbnail": "https://tacask-cdn.com/mabi-labanyu/mabi-labanyu/item-base-data/thumbnail/item-42897.png",
                "count": 1
            }
        ]
    },
    {
        "rockLine": 1,
        "gold": 10000,
        "items": [
            {
                "name": "符文碎片",
                "thumbnail": "https://tacask-cdn.com/mabi-labanyu/mabi-labanyu/item-base-data/thumbnail/item-42897.png",
                "count": 3
            },
            {
                "name": "火焰束",
                "thumbnail": "https://tacask-cdn.com/mabi-labanyu/item-base-data/thumbnail/item-31704.png",
                "count": 1
            }
        ]
    },
    {
        "rockLine": 2,
        "gold": 20000,
        "items": [
            {
                "name": "符文碎片",
                "thumbnail": "https://tacask-cdn.com/mabi-labanyu/mabi-labanyu/item-base-data/thumbnail/item-42897.png",
                "count": 5
            },
            {
                "name": "火焰束",
                "thumbnail": "https://tacask-cdn.com/mabi-labanyu/item-base-data/thumbnail/item-31704.png",
                "count": 1
            },
            {
                "name": "冰凍火焰束",
                "thumbnail": "https://tacask-cdn.com/mabi-labanyu/item-base-data/thumbnail/item-31723.png",
                "count": 1
            }
        ]
    }
];
