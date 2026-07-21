import type { CraftableItem, MaterialUsage } from "../types/CraftItem";

export const materials: CraftableItem[] = [
    {
        id: 60054,
        name: {
            en: "Wood Plate",
            us: "Wood Board",
            cn: "木板",
            jp: "木の板",
            kr: "나무판",
            tw: "木板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 63221,
        name: {
            en: "The Highest Grade Firewood",
            us: "Finest Firewood",
            cn: "最高级木柴",
            jp: "最高級薪",
            kr: "최고급 나무장작",
            tw: "優質木柴",
        },
        source: {
            type: "",
        },
    },
    {
        id: 63348,
        name: {
            en: "Special Grade Firewood",
            us: "Special Firewood",
            cn: "特级木柴",
            jp: "特級薪",
            kr: "특급 나무장작",
            tw: "特級木柴",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 63221,
                    amount: 1,
                },
                {
                    id: 64639,
                    amount: 1,
                },
            ],
        },
    },
    {
        id: 63383,
        name: {
            en: "Strings of Technique",
            us: "Instrument Strings",
            cn: "技巧之弦",
            jp: "技巧の弦",
            kr: "기교의 현",
            tw: "技巧之弦",
        },
        source: {
            type: "",
        },
    },
    {
        id: 63384,
        name: {
            en: "Plank of Harmony",
            us: "Harmonic Wood Board",
            cn: "协调之木板",
            jp: "調和の木の板",
            kr: "조화의 나무판",
            tw: "協調的木板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 63385,
        name: {
            en: "Plate of Melody",
            us: "Melodic Metal Plate",
            cn: "旋律之金属板",
            jp: "旋律の金属板",
            kr: "선율의 금속판",
            tw: "旋律的金屬板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 63386,
        name: {
            en: "Starpowder of Song",
            us: "Song Stardust",
            cn: "歌声之星星粉",
            jp: "歌の星屑",
            kr: "노래의 별가루",
            tw: "歌曲的星星粉",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64025,
        name: {
            en: "Iron Plate",
            us: "Iron Plate",
            cn: "铁板",
            jp: "鉄板",
            kr: "철판",
            tw: "鐵板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64026,
        name: {
            en: "Copper Plate",
            us: "Copper Plate",
            cn: "铜板",
            jp: "銅板",
            kr: "동판",
            tw: "銅板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64027,
        name: {
            en: "Silver Plate",
            us: "Silver Plate",
            cn: "银板",
            jp: "銀板",
            kr: "은판",
            tw: "銀板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64028,
        name: {
            en: "Gold Plate",
            us: "Gold Plate",
            cn: "金板",
            jp: "金板",
            kr: "금판",
            tw: "金板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64029,
        name: {
            en: "Mythril Plate",
            us: "Mythril Plate",
            cn: "米斯里板",
            jp: "ミスリル板",
            kr: "미스릴판",
            tw: "秘銀板",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64099,
        name: {
            en: "Eroding Mineral Fragment",
            us: "Eroded Mineral Chunk",
            cn: "腐蚀的矿物碎块",
            jp: "破損した鉱物の欠片",
            kr: "침식된 광물 조각",
            tw: "被侵蝕的礦物碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64100,
        name: {
            en: "Cover of Battlefield's Energy",
            us: "Battleworn Covering",
            cn: "附有战场之息的盖子",
            jp: "戦場のオーラが宿ったカバー",
            kr: "전장의 기운이 깃든 덮개",
            tw: "聚集戰場氣息的蓋子",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64102,
        name: {
            en: "Faded Debris",
            us: "Faded Fragment",
            cn: "褪色的碎片",
            jp: "色あせた破片",
            kr: "빛 바랜 파편",
            tw: "閃爍的碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64105,
        name: {
            en: "Solidly Crystalized Mineral Shard",
            us: "Hard Crystallized Mineral",
            cn: "凝固的坚硬矿物碎块",
            jp: "硬く結晶化した鉱物の欠片",
            kr: "단단하게 결정화된 광물 조각",
            tw: "結晶結實的礦物碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64107,
        name: {
            en: "Heavy-duty Leather Piece",
            us: "Solid Leather Scrap",
            cn: "坚硬的皮革碎块",
            jp: "丈夫な革の切れ端",
            kr: "견고한 가죽 조각",
            tw: "堅固的皮革碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64109,
        name: {
            en: "Sharply Crystalized Mineral Shard",
            us: "Sharp Crystallized Mineral",
            cn: "凝固的锋利矿物碎块",
            jp: "鋭く結晶化した鉱物の欠片",
            kr: "날카롭게 결정화된 광물 조각",
            tw: "結晶尖銳的礦物碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64111,
        name: {
            en: "Sturdy Leather Piece",
            us: "Sturdy Leather Scrap",
            cn: "牢固的皮革碎块",
            jp: "不屈の革の切れ端",
            kr: "굳센 가죽 조각",
            tw: "堅硬的皮革碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64112,
        name: {
            en: "Exquisite Fragments",
            us: "Prismatic Shard",
            cn: "奥妙的碎块",
            jp: "神秘の破片",
            kr: "오묘한 파편",
            tw: "奧妙的碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64114,
        name: {
            en: "Tear Drop Gemstone",
            us: "Teardrop Gem",
            cn: "泪滴宝石",
            jp: "ティアドロップジェムストーン",
            kr: "티어드롭 젬스톤",
            tw: "淚滴寶石",
        },
        source: {
            // type: "shop",
            // price: 35000,
            // currency: "ducat",
            type: "shop",
            description: "貿易所商店購買 (35000 杜卡特)",
        },
    },
    {
        id: 64117,
        name: {
            en: "Stone Vine Mineral",
            us: "Stone Stalk Mineral",
            cn: "蔓藤矿石",
            jp: "石茎の鉱石",
            kr: "돌줄기 광석",
            tw: "藤條礦石",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64118,
        name: {
            en: "Thorn Tree Mineral",
            us: "Thornbush Mineral",
            cn: "荆棘矿石",
            jp: "イバラの鉱石",
            kr: "가시나무 광석",
            tw: "荊棘礦石",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64634,
        name: {
            en: "Magical Essence",
            us: "Magic Essence",
            cn: "魔力精华",
            jp: "魔力のエキス",
            kr: "마력의 정수",
            tw: "魔力精華液",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64636,
        name: {
            en: "Confusional Rune",
            us: "Chaotic Rune",
            cn: "混沌之轮",
            jp: "混沌のルーン",
            kr: "혼돈의 룬",
            tw: "渾沌符文石",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64638,
        name: {
            en: "Magical Golden Yarn",
            us: "Enchanted Thread",
            cn: "魔力黄金线",
            jp: "魔力の黄金の糸",
            kr: "마력의 황금 실",
            tw: "附有魔力的金絲線",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64639,
        name: {
            en: "Fine Strengthening",
            us: "Purified Enhancer",
            cn: "高纯度强化剂",
            jp: "純度の高い強化剤",
            kr: "순도 높은 강화제",
            tw: "高純度強化劑",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64640,
        name: {
            en: "Resurrective Powder",
            us: "Restorative Powder",
            cn: "再生粉末",
            jp: "再生の粉",
            kr: "재생의 가루",
            tw: "再生粉末",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64642,
        name: {
            en: "Awakening Force Powder",
            us: "Awakened Strength Powder",
            cn: "觉醒之力粉末",
            jp: "覚醒した力の粉",
            kr: "각성된 힘의 가루",
            tw: "擁有覺醒能量的粉末",
        },
        source: {
            type: "shop",
            description: "史蒂華秘密商店購買(50000)",
        },
    },
    {
        id: 64643,
        name: {
            en: "Awakening Force Piece",
            us: "Awakened Strength Fragment",
            cn: "觉醒之力碎片",
            jp: "覚醒した力の欠片",
            kr: "각성된 힘의 조각",
            tw: "擁有覺醒能量的碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64644,
        name: {
            en: "Awakening Force Crystal",
            us: "Awakened Strength Crystal",
            cn: "觉醒之力结晶",
            jp: "覚醒した力の結晶",
            kr: "각성된 힘의 결정",
            tw: "擁有覺醒能量的結晶",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64646,
        name: {
            en: "Shattered Black Metal",
            us: "Shattered Black Metal",
            cn: "被粉碎的黑金属",
            jp: "粉々になった黒い金属",
            kr: "산산조각난 검은 금속",
            tw: "支離破碎的黑色金屬",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64647,
        name: {
            en: "Firm Blade's Fragments",
            us: "Firm Blade Fragment",
            cn: "锐利的刀刃碎片",
            jp: "断固たる刃の破片",
            kr: "단호한 칼날의 파편",
            tw: "斷裂的刀刃碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64648,
        name: {
            en: "Destroyed Hard Chain",
            us: "Destroyed Seal Chain",
            cn: "被破坏的封印锁链",
            jp: "破壊された封印の鎖",
            kr: "파괴된 봉인의 사슬",
            tw: "破損的封印之鍊",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64649,
        name: {
            en: "Broken Black Metal",
            us: "Ruptured Black Metal",
            cn: "龟裂的黑金属",
            jp: "亀裂が生じた黒い金属",
            kr: "균열된 검은 금속",
            tw: "龜裂的黑色金屬",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64650,
        name: {
            en: "Sharpen Weapon Fragment",
            us: "Forged Weapon Piece",
            cn: "被磨损的武器碎片",
            jp: "鍛えられた武器の欠片",
            kr: "벼린 무기 조각",
            tw: "磨損的武器碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64652,
        name: {
            en: "Modify Loop",
            us: "Deformed Ring Frame",
            cn: "变形的构型构造体",
            jp: "変形された輪状構造体",
            kr: "변형된 고리형 구조체",
            tw: "扭曲的環狀結構物",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64653,
        name: {
            en: "Nightmare Catcher's Relic",
            us: "Nightmare Guard's Relic",
            cn: "噩梦守望者的遗物",
            jp: "悪夢の番人の遺物",
            kr: "악몽 파수꾼의 유물",
            tw: "噩夢守門人的遺物",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64654,
        name: {
            en: "Purified Mage's Jewel",
            us: "Cleansed Mage's Gem",
            cn: "被净化的魔法师宝石",
            jp: "浄化された魔法使いの宝石",
            kr: "정화된 마법사의 보석",
            tw: "精製的魔法師寶石",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64655,
        name: {
            en: "Amplified Alchemy Crystal",
            us: "Amplified Alchemy Crystal",
            cn: "增幅的炼金术结晶",
            jp: "増幅された錬金術の結晶",
            kr: "증폭된 연금술 결정",
            tw: "已強化的鍊金術結晶",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64658,
        name: {
            en: "Shining Crystal Piece",
            us: "Shining Crystal Shard",
            cn: "发光的结晶碎片",
            jp: "輝く結晶の破片",
            kr: "빛나는 결정 파편",
            tw: "發光的結晶碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64659,
        name: {
            en: "Heartless Sign",
            us: "Subtle Mark",
            cn: "冷酷的标志",
            jp: "冷酷さの証",
            kr: "냉혹함의 징표",
            tw: "冰冷的標誌",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64671,
        name: {
            en: "Crystal of Aurora",
            us: "Frosted Borealis Crystal",
            cn: "极光结晶",
            jp: "極光の結晶",
            kr: "극광의 결정",
            tw: "極光的結晶",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64674,
        name: {
            en: "Awakened Power Essence",
            us: "Essence of Raw Force",
            cn: "觉醒力量之精髓",
            jp: "目覚めた力の精髄",
            kr: "깨어난 힘의 정수",
            tw: "甦醒力量的精華液",
        },
        source: {
            type: "desc",
            description: "地城/影任務/G27副本獎勵/商店購買 (布里萊赫珠子:5)",
            token: 5,
        },
    },
    {
        id: 64675,
        name: {
            en: "Jewel of Brave Warrior",
            us: "Gem of Valor",
            cn: "勇猛战士之宝石",
            jp: "勇猛な戦士の宝石",
            kr: "용맹한 전사의 보석",
            tw: "勇猛戰士的寶石",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64678,
        name: {
            en: "Runestone of Sleeping Will",
            us: "Runestone of Daring",
            cn: "沉睡之志符文石",
            jp: "意志が込められたルーンストーン",
            kr: "의지가 잠든 룬스톤",
            tw: "沉睡意志的符文石",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64679,
        name: {
            en: "Blade Covered with Darkness",
            us: "Infernal Blade Fragment",
            cn: "黑化的刀片",
            jp: "闇が宿る刃の欠片",
            kr: "어둠이 깃든 칼날 조각",
            tw: "蘊藏黑暗的刀刃碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 67100,
        name: {
            en: "Fragment of Heulwen Ore",
            us: "Hillwen Ore Fragment",
            cn: "希尔文矿石碎片",
            jp: "ヒルウェン鉱石の欠片",
            kr: "힐웬 광석 조각",
            tw: "稀原礦石碎片",
        },
        source: {
            type: "",
        },
    },
    {
        id: 67101,
        name: {
            en: "Heulwen",
            us: "Hillwen",
            cn: "希尔文",
            jp: "ヒルウェン",
            kr: "힐웬",
            tw: "稀原",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 67100,
                    amount: 5,
                },
            ],
        },
    },
    {
        id: 67102,
        name: {
            en: "Hex Bolt",
            us: "Hexagonal Bolt",
            cn: "六角螺栓",
            jp: "六角ボルト",
            kr: "육각 볼트",
            tw: "六角螺絲",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 67100,
                    amount: 1,
                },
            ],
        },
    },
    {
        id: 67103,
        name: {
            en: "Hex Nut",
            us: "Hexagonal Nut",
            cn: "六角螺母",
            jp: "六角ナット",
            kr: "육각 너트",
            tw: "六角螺帽",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 67100,
                    amount: 1,
                },
            ],
        },
    },
    {
        id: 67110,
        name: {
            en: "Heulwen Alloy",
            us: "Hillwen Alloy",
            cn: "希尔文合金",
            jp: "ヒルウェン合金",
            kr: "힐웬 합금",
            tw: "稀原合金",
        },
        source: {
            type: "",
        },
    },
    {
        id: 67111,
        name: {
            en: "Spin Gear",
            us: "Spin Gear",
            cn: "自旋齿轮",
            jp: "スピンギア",
            kr: "스핀 기어",
            tw: "旋轉齒輪",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 67101,
                    amount: 2,
                },
                {
                    id: 67102,
                    amount: 5,
                },
                {
                    id: 67103,
                    amount: 5,
                },
            ],
        },
    },
    {
        id: 67209,
        name: {
            en: "Intact Sulien",
            us: "Intact Shyllien",
            cn: "完整的希里安",
            jp: "完全なシリエン",
            kr: "온전한 실리엔",
            tw: "完整的希里原",
        },
        source: {
            type: "",
        },
    },
    {
        id: 5100273,
        name: {
            en: "Gemstone Powder",
            us: "Gemstone Powder",
            cn: "晶石粉末",
            jp: "ジェムストーンパウダー",
            kr: "젬스톤 파우더",
            tw: "寶石粉末",
        },
        source: {
            type: "dissolution",
            description: "分解新寶石 (1~2)",
        },
    },
    {
        id: 5100274,
        name: {
            en: "Magic Infused Catalyst",
            us: "Enchanted Melding Agent",
            cn: "附魔的融合剂",
            jp: "魔力が宿る融合剤",
            kr: "마력이 깃든 융합제",
            tw: "聚集魔力的融合劑",
        },
        source: {
            // type: "shop",
            // price: 500000,
            // currency: "gold",

            type: "shop",
            description: "雷楠商店購買 (50萬)",
        },
    },
    {
        id: 5100275,
        name: {
            en: "Brilliant Memory Crystal",
            us: "Brilliant Memory Crystal",
            cn: "璀璨的记忆结晶",
            jp: "輝かしい記憶の結晶",
            kr: "찬란한 기억의 결정",
            tw: "燦爛的記憶結晶",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100305,
                    amount: 3,
                },
                {
                    id: 5100313,
                    amount: 10,
                },
                {
                    id: 5100274,
                    amount: 5,
                },
                {
                    id: 5100289,
                    amount: 2,
                },
            ],
        },
    },
    {
        id: 5100276,
        name: {
            en: "Intense Memory Crystal",
            us: "Intense Memory Crystal",
            cn: "强烈的记忆结晶",
            jp: "強烈な記憶の結晶",
            kr: "강렬한 기억의 결정",
            tw: "強烈的記憶結晶",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100306,
                    amount: 3,
                },
                {
                    id: 5100314,
                    amount: 10,
                },
                {
                    id: 5100274,
                    amount: 5,
                },
                {
                    id: 5100289,
                    amount: 2,
                },
            ],
        },
    },
    {
        id: 5100277,
        name: {
            en: "Sturdy Memory Crystal",
            us: "Steadfast Memory Crystal",
            cn: "坚固的记忆结晶",
            jp: "堅固な記憶の結晶",
            kr: "견고한 기억의 결정",
            tw: "堅固的記憶結晶",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100307,
                    amount: 3,
                },
                {
                    id: 5100315,
                    amount: 10,
                },
                {
                    id: 5100274,
                    amount: 5,
                },
                {
                    id: 5100289,
                    amount: 2,
                },
            ],
        },
    },
    {
        id: 5100278,
        name: {
            en: "Magic Charged Spin Gear",
            us: "Mana-Saturated Spin Gear",
            cn: "充满魔力的自旋齿轮",
            jp: "魔力に満ちたスピンギア",
            kr: "마력이 충만한 스핀 기어",
            tw: "充滿魔力的旋轉齒輪",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100308,
                    amount: 3,
                },
                {
                    id: 5100316,
                    amount: 10,
                },
                {
                    id: 5100274,
                    amount: 3,
                },
                {
                    id: 5100300,
                    amount: 3,
                },
            ],
        },
    },
    {
        id: 5100279,
        name: {
            en: "Magic Charged Magical Crystal",
            us: "Mana-Saturated Mana Stone",
            cn: "充满魔力的魔力石",
            jp: "魔力に満ちた魔力石",
            kr: "마력이 충만한 마력석",
            tw: "充滿魔力的魔力石",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100308,
                    amount: 3,
                },
                {
                    id: 5100317,
                    amount: 10,
                },
                {
                    id: 5100274,
                    amount: 3,
                },
                {
                    id: 5100301,
                    amount: 3,
                },
            ],
        },
    },
    {
        id: 5100280,
        name: {
            en: "Magic Charged Loop",
            us: "Mana-Saturated Loop",
            cn: "充满魔力的链",
            jp: "魔力に満ちた輪",
            kr: "마력이 충만한 고리",
            tw: "充滿魔力的指環",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100308,
                    amount: 3,
                },
                {
                    id: 5100318,
                    amount: 10,
                },
                {
                    id: 5100274,
                    amount: 3,
                },
                {
                    id: 5100302,
                    amount: 3,
                },
                {
                    id: 63348,
                    amount: 100,
                },
            ],
        },
    },
    {
        id: 5100281,
        name: {
            en: "High Purity Fusion Heulwen Alloy",
            us: "Pure Fused Hillwen Alloy",
            cn: "高纯度融合的希尔文合金",
            jp: "純度の高い融合のヒルウェン合金",
            kr: "순도 높은 융합의 힐웬 합금",
            tw: "高純度融合稀原合金",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100319,
                    amount: 10,
                },
                {
                    id: 5100284,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 67110,
                    amount: 100,
                },
            ],
        },
    },
    {
        id: 5100282,
        name: {
            en: "High Purity Fusion Sulien",
            us: "Pure Fused Shyllien",
            cn: "高纯度融合的希里安",
            jp: "純度の高い融合のシリエン",
            kr: "순도 높은 융합의 실리엔",
            tw: "高純度融合希里原",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100319,
                    amount: 10,
                },
                {
                    id: 5100284,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 67209,
                    amount: 100,
                },
            ],
        },
    },
    {
        id: 5100283,
        name: {
            en: "High Purity Fusion Wood Plate",
            us: "Pure Fused Wood Board",
            cn: "高纯度融合的木板",
            jp: "純度の高い融合の木の板",
            kr: "순도 높은 융합의 나무판",
            tw: "高純度融合木板",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100319,
                    amount: 10,
                },
                {
                    id: 5100284,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 63221,
                    amount: 100,
                },
            ],
        },
    },
    {
        id: 5100284,
        name: {
            en: "High Purity Force Crystal",
            us: "Pure Strength Crystal",
            cn: "精粹之力结晶",
            jp: "純度の高い力の結晶",
            kr: "순도 높은 힘의 결정",
            tw: "高純度力量結晶",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100274,
                    amount: 3,
                },
                {
                    id: 64643,
                    amount: 10,
                },
                {
                    id: 64644,
                    amount: 10,
                },
                {
                    id: 64674,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100285,
        name: {
            en: "Sharp Blade",
            us: "Honed Blade",
            cn: "锐利锋刃",
            jp: "鋭利な刃",
            kr: "예리한 칼날",
            tw: "異常鋒利的刀刃",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100309,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 5100289,
                    amount: 1,
                },
                {
                    id: 64109,
                    amount: 6,
                },
            ],
        },
    },
    {
        id: 5100286,
        name: {
            en: "Sturdy Metal",
            us: "Resilient Metal",
            cn: "坚硬的金属",
            jp: "硬い金属",
            kr: "단단한 금속",
            tw: "堅硬的金屬",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100310,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 5100289,
                    amount: 1,
                },
                {
                    id: 64105,
                    amount: 6,
                },
            ],
        },
    },
    {
        id: 5100287,
        name: {
            en: "Exquisite String",
            us: "Fine String",
            cn: "精密丝线",
            jp: "精巧なストリング",
            kr: "정교한 스트링",
            tw: "精巧的弦線",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100311,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 5100289,
                    amount: 1,
                },
                {
                    id: 64646,
                    amount: 6,
                },
            ],
        },
    },
    {
        id: 5100288,
        name: {
            en: "Magic Filled Magical Crystal",
            us: "Mana-Imbued Mana Stone",
            cn: "蕴含魔力的魔力石",
            jp: "魔力が宿る魔力石",
            kr: "마력이 담긴 마력석",
            tw: "聚集魔力的魔力石",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100312,
                    amount: 5,
                },
                {
                    id: 5100274,
                    amount: 1,
                },
                {
                    id: 5100289,
                    amount: 1,
                },
                {
                    id: 64099,
                    amount: 6,
                },
            ],
        },
    },
    {
        id: 5100289,
        name: {
            en: "Pure Gemstone",
            us: "Pure Gemstone",
            cn: "无暇晶石",
            jp: "ピュアジェムストーン",
            kr: "퓨어 젬스톤",
            tw: "純淨寶石",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100274,
                    amount: 3,
                },
                {
                    id: 5100273,
                    amount: 30,
                },
                {
                    id: 64114,
                    amount: 30,
                },
                {
                    id: 64639,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100290,
        name: {
            en: "Magic Infused Blade Shard",
            us: "Enchanted Blade",
            cn: "附魔的刀刃",
            jp: "魔力が宿る刃",
            kr: "마력이 깃든 칼날",
            tw: "聚集魔力的刀刃",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100320,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100291,
        name: {
            en: "Magic Infused Metal Shard",
            us: "Enchanted Metal",
            cn: "附魔的金属",
            jp: "魔力が宿る金属",
            kr: "마력이 깃든 금속",
            tw: "聚集魔力的金屬",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100321,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100292,
        name: {
            en: "Magic Infused Ore Fragment",
            us: "Enchanted Ore Fragment",
            cn: "附魔的矿石碎片",
            jp: "魔力が宿る鉱石の欠片",
            kr: "마력이 깃든 광석 조각",
            tw: "聚集魔力的礦石碎片",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100322,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100293,
        name: {
            en: "Magic Infused Wood Plate",
            us: "Enchanted Wood Board",
            cn: "附魔的木板",
            jp: "魔力が宿る木の板",
            kr: "마력이 깃든 나무판",
            tw: "聚集魔力的木板",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100323,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
                {
                    id: 60054,
                    amount: 30,
                },
            ],
        },
    },
    {
        id: 5100294,
        name: {
            en: "Magic Infused Heulwen Ore",
            us: "Enchanted Hillwen Ore Fragment",
            cn: "附魔的希尔文矿石碎片",
            jp: "魔力が宿るヒルウェン鉱石の欠片",
            kr: "마력이 깃든 힐웬 광석 조각",
            tw: "聚集魔力的稀原礦石碎片",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100324,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100295,
        name: {
            en: "Magic Infused Leather Piece",
            us: "Enchanted Leather Scrap",
            cn: "附魔的皮革碎片",
            jp: "魔力が宿る革の切れ端",
            kr: "마력이 깃든 가죽 조각",
            tw: "聚集魔力的皮革碎片",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100325,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100296,
        name: {
            en: "Magic Infused Feather",
            us: "Enchanted Feather",
            cn: "附魔的羽毛",
            jp: "魔力が宿る羽根",
            kr: "마력이 깃든 깃털",
            tw: "聚集魔力的羽毛",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100326,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100297,
        name: {
            en: "Magic Infused Alchemy Crystal",
            us: "Enchanted Alchemy Crystal",
            cn: "附魔的炼金术结晶",
            jp: "魔力が宿る錬金術の結晶",
            kr: "마력이 깃든 연금술 결정",
            tw: "聚集魔力的鍊金術結晶",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100327,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100298,
        name: {
            en: "Magic Infused Mage Jewel",
            us: "Enchanted Mage's Gem",
            cn: "附魔的魔法师宝石",
            jp: "魔力が宿る魔法使いの宝石",
            kr: "마력이 깃든 마법사의 보석",
            tw: "聚集魔力的法師的寶石",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100328,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100299,
        name: {
            en: "Magic Infused Wolf Fang",
            us: "Enchanted Wolf Tooth",
            cn: "附魔的狼牙",
            jp: "魔力が宿るオオカミの牙",
            kr: "마력이 깃든 늑대의 이빨",
            tw: "聚集魔力的狼牙",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 5100329,
                    amount: 7,
                },
                {
                    id: 5100330,
                    amount: 20,
                },
                {
                    id: 5100273,
                    amount: 20,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100300,
        name: {
            en: "Strengthen Spin Gear",
            us: "Enhanced Spin Gear",
            cn: "强化的自旋齿轮",
            jp: "強化されたスピンギア",
            kr: "강화된 스핀 기어",
            tw: "強化的旋轉齒輪",
            tw2: "強化旋轉齒輪",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 67111,
                    amount: 10,
                },
                {
                    id: 64639,
                    amount: 30,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100301,
        name: {
            en: "Strengthen Sulien",
            us: "Enhanced Shyllien",
            cn: "强化的希里安",
            jp: "強化されたシリエン",
            kr: "강화된 실리엔",
            tw: "強化的希里原",
            tw2: "強化希里原",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 67209,
                    amount: 70,
                },
                {
                    id: 64639,
                    amount: 30,
                },
                {
                    id: 64642,
                    amount: 10,
                },
            ],
        },
    },
    {
        id: 5100302,
        name: {
            en: "Strengthen Plate",
            us: "Enhanced Metal Plate",
            cn: "强化的金属板",
            jp: "強化された金属板",
            kr: "강화된 금속판",
            tw: "強化的金屬板",
            tw2: "強化金屬板",
        },
        source: {
            type: "craft",
            materials: [
                {
                    id: 64639,
                    amount: 30,
                },
                {
                    id: 64029,
                    amount: 50,
                },
                {
                    id: 64028,
                    amount: 50,
                },
                {
                    id: 64027,
                    amount: 50,
                },
                {
                    id: 64026,
                    amount: 50,
                },
                {
                    id: 64025,
                    amount: 50,
                },
            ],
        },
    },
    {
        id: 5100303,
        name: {
            en: "Bri Leith's Core",
            us: "Bri Leith Core",
            cn: "布里列赫的核心",
            jp: "ブリーレフのコア",
            kr: "브리 레흐의 코어",
            tw: "布里萊赫核心",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:100)",
            token: 100,
        },
    },
    {
        id: 5100304,
        name: {
            en: "Bri Leith's Essence",
            us: "Bri Leith Essence",
            cn: "布里列赫的精华",
            jp: "ブリーレフのエキス",
            kr: "브리 레흐의 정수",
            tw: "布里萊赫精髓",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:100)",
            token: 100,
        },
    },
    {
        id: 5100305,
        name: {
            en: "Orange Ligt Memory Fragment",
            us: "Orange Memory Fragment",
            cn: "橙色的记忆碎片",
            jp: "橙色の記憶の欠片",
            kr: "주황빛 기억의 조각",
            tw: "橘光記憶碎片",
            tw2: "橘黃光記憶碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:25)",
            token: 25,
        },
    },
    {
        id: 5100306,
        name: {
            en: "Green Ligt Memory Fragment",
            us: "Green Memory Fragment",
            cn: "绿色的记忆碎片",
            jp: "緑色の記憶の欠片",
            kr: "초록빛 기억의 조각",
            tw: "綠光記憶碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:25)",
            token: 25,
        },
    },
    {
        id: 5100307,
        name: {
            en: "Gold Ligt Memory Fragment",
            us: "Golden Memory Fragment",
            cn: "金色的记忆碎片",
            jp: "金色の記憶の欠片",
            kr: "금빛 기억의 조각",
            tw: "黃光記憶碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:25)",
            token: 25,
        },
    },
    {
        id: 5100308,
        name: {
            en: "Emblem Infused with the Aura of Bri Leith",
            us: "Bri Leith Empowered Crest",
            cn: "蕴含布里列赫气息的纹章",
            jp: "ブリーレフのオーラが宿った紋章",
            kr: "브리 레흐의 기운이 깃든 문장",
            tw: "蘊含布里萊赫氣息的徽章",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100309,
        name: {
            en: "Blunt Blade Fragments",
            us: "Dull Blade Fragment",
            cn: "钝刀刃碎片",
            jp: "鈍い刃の欠片",
            kr: "무딘 칼날 조각",
            tw: "鈍刃碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100310,
        name: {
            en: "Soft Metal Piece",
            us: "Malleable Metal Shard",
            cn: "软金属碎片",
            jp: "鈍い金属の破片",
            kr: "무른 금속 파편",
            tw: "柔軟的金屬碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100311,
        name: {
            en: "Faded Filoselle",
            us: "Faded Embroidery Thread",
            cn: "褪色的刺绣线",
            jp: "色あせた刺繍糸",
            kr: "빛바랜 자수실",
            tw: "褪色的刺繡線",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100312,
        name: {
            en: "Empty Magic Stone",
            us: "Depleted Mana Stone",
            cn: "空魔力石",
            jp: "空っぽの魔力石",
            kr: "텅 빈 마력석",
            tw: "空的魔力石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100313,
        name: {
            en: "Aragonite",
            us: "Aragonite",
            cn: "阿拉贡石",
            jp: "アラゴナイト",
            kr: "아라고나이트",
            tw: "霰石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100314,
        name: {
            en: "Variscite",
            us: "Variscite",
            cn: "重晶石",
            jp: "バリサイト",
            kr: "바리사이트",
            tw: "透輝石",
            tw2: "雲母",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100315,
        name: {
            en: "Orpiment",
            us: "Orpiment",
            cn: "雌黄矿",
            jp: "オフィメント",
            kr: "오피먼트",
            tw: "鵝卵石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100316,
        name: {
            en: "Exquisite Metal Piece",
            us: "Strange Metal Fragment",
            cn: "奥妙的金属碎片",
            jp: "不思議な金属の欠片",
            kr: "오묘한 금속 조각",
            tw: "奧妙的金屬碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100317,
        name: {
            en: "Exquisite Magic Stone",
            us: "Strange Mana Stone",
            cn: "奥妙的魔力石",
            jp: "不思議な魔力石",
            kr: "오묘한 마력석",
            tw: "奧妙的魔力石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100318,
        name: {
            en: "Exquisite Leather Piece",
            us: "Strange Leather Scrap",
            cn: "奥妙的皮革碎片",
            jp: "不思議な革の切れ端",
            kr: "오묘한 가죽 조각",
            tw: "奧妙的皮革碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100319,
        name: {
            en: "High Purity Magical Crystal",
            us: "Pure Magic Crystal",
            cn: "高纯度魔力结晶",
            jp: "純度の高い魔力の結晶",
            kr: "순도 높은 마력의 결정",
            tw: "高純度魔力結晶",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
            token: 3,
        },
    },
    {
        id: 5100320,
        name: {
            en: "Verdant Tinged Blade Shard",
            us: "Verdant Blade Fragment",
            cn: "青苔斑驳的刀刃碎片",
            jp: "緑色を帯びた刃の欠片",
            kr: "녹음이 감도는 칼날 조각",
            tw: "綠意盎然的刀刃碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100321,
        name: {
            en: "Verdant Tinged Metal Shard",
            us: "Verdant Metal Fragment",
            cn: "青苔斑驳的金属碎片",
            jp: "緑色を帯びた金属の欠片",
            kr: "녹음이 감도는 금속 조각",
            tw: "綠意盎然的金屬碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100322,
        name: {
            en: "Verdant Tinged Ore",
            us: "Verdant Ore Fragment",
            cn: "青苔斑驳的矿石碎片",
            jp: "緑色を帯びた鉱石の欠片",
            kr: "녹음이 감도는 광석 조각",
            tw: "綠意盎然的礦石碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100323,
        name: {
            en: "Verdant Tinged Firewood",
            us: "Verdant Firewood",
            cn: "青苔斑驳的木柴",
            jp: "緑色を帯びた薪",
            kr: "녹음이 감도는 나무 장작",
            tw: "綠意盎然的木柴",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100324,
        name: {
            en: "Sturdy Heulwn Ore",
            us: "Hard Hillwen Ore Fragment",
            cn: "坚硬的希尔文矿石碎片",
            jp: "頑丈なヒルウェン鉱石の欠片",
            kr: "단단한 힐웬 광석 조각",
            tw: "堅硬的稀原礦石碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100325,
        name: {
            en: "Pure White Leather Fragment",
            us: "Pure White Leather Scrap",
            cn: "纯白的皮革碎片",
            jp: "純白の革の切れ端",
            kr: "순백의 가죽 조각",
            tw: "純白的皮革碎片",
            tw2: "純白皮革碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100326,
        name: {
            en: "Pure White Feather",
            us: "Pure White Feather",
            cn: "纯白的羽毛",
            jp: "純白の羽根",
            kr: "순백의 깃털",
            tw: "純白的羽毛",
            tw2: "純白羽毛",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100327,
        name: {
            en: "Transparent Alchemy Crystal",
            us: "Transparent Alchemy Crystal",
            cn: "透明的炼金术结晶",
            jp: "透明な錬金術の結晶",
            kr: "투명한 연금술 결정",
            tw: "透明的鍊金術結晶",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100328,
        name: {
            en: "Verdant Infused Mage Jewel",
            us: "Verdant Mage's Gem",
            cn: "青苔斑驳的魔法师宝石",
            jp: "緑色を帯びた魔法使いの宝石",
            kr: "녹음이 깃든 마법사의 보석",
            tw: "綠意盎然的法師的寶石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100329,
        name: {
            en: "Sturdy Wolf Fang",
            us: "Hard Wolf Tooth",
            cn: "坚硬的狼牙",
            jp: "頑丈なオオカミの牙",
            kr: "단단한 늑대의 이빨",
            tw: "堅硬的狼牙",
            tw2: "堅硬的野狼牙齒",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5100330,
        name: {
            en: "Magical Crystal",
            us: "Mana Stone",
            cn: "魔力石",
            jp: "魔力石",
            kr: "마력석",
            tw: "魔力石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
            token: 1,
        },
    },
    {
        id: 5300217,
        name: {
            en: "Coin",
            us: "Bri Leith Obol",
            cn: "布里列赫宝珠",
            jp: "ブリーレフの玉",
            kr: "브리 레흐 구슬",
            tw: "布里萊赫的珠子",
        },
        source: {
            type: "reward",
            description: "G27副本獎勵",
        },
    },
];

export const G27bossDropsUsage: MaterialUsage[] = [
    {
        id: 5100303,
        usedIn: "全部",
        name: "布里萊赫核心",
        usedInDetail: [
            {
                id: 1200043,
                total: 9,
            },
            {
                id: 1210067,
                total: 9,
            },
            {
                id: 1220018,
                total: 9,
            },
            {
                id: 1230039,
                total: 9,
            },
            {
                id: 1250026,
                total: 9,
            },
            {
                id: 1260020,
                total: 9,
            },
            {
                id: 1270029,
                total: 9,
            },
            {
                id: 1280018,
                total: 9,
            },
            {
                id: 1290021,
                total: 9,
            },
            {
                id: 1080048,
                total: 8,
            },
            {
                id: 1000059,
                total: 5,
            },
            {
                id: 1010070,
                total: 5,
            },
            {
                id: 1020004,
                total: 5,
            },
            {
                id: 1040054,
                total: 5,
            },
            {
                id: 1040055,
                total: 5,
            },
            {
                id: 1050017,
                total: 5,
            },
            {
                id: 1060011,
                total: 5,
            },
            {
                id: 1070014,
                total: 5,
            },
            {
                id: 1090010,
                total: 5,
            },
            {
                id: 1650001,
                total: 5,
            },
            {
                id: 1400011,
                total: 4,
            },
            {
                id: 1400012,
                total: 4,
            },
            {
                id: 1420006,
                total: 4,
            },
            {
                id: 1420007,
                total: 4,
            },
            {
                id: 1430005,
                total: 4,
            },
            {
                id: 1440006,
                total: 4,
            },
            {
                id: 1460003,
                total: 4,
            },
            {
                id: 1640003,
                total: 4,
            },
            {
                id: 1640004,
                total: 4,
            },
        ],
    },
    {
        id: 5100304,
        usedIn: "全部",
        name: "布里萊赫精髓",
        usedInDetail: [
            {
                id: 1200043,
                total: 18,
            },
            {
                id: 1210067,
                total: 18,
            },
            {
                id: 1220018,
                total: 18,
            },
            {
                id: 1230039,
                total: 18,
            },
            {
                id: 1250026,
                total: 18,
            },
            {
                id: 1260020,
                total: 18,
            },
            {
                id: 1270029,
                total: 18,
            },
            {
                id: 1280018,
                total: 18,
            },
            {
                id: 1290021,
                total: 18,
            },
            {
                id: 1080048,
                total: 15,
            },
            {
                id: 1000059,
                total: 10,
            },
            {
                id: 1010070,
                total: 10,
            },
            {
                id: 1020004,
                total: 10,
            },
            {
                id: 1040054,
                total: 10,
            },
            {
                id: 1040055,
                total: 10,
            },
            {
                id: 1050017,
                total: 10,
            },
            {
                id: 1060011,
                total: 10,
            },
            {
                id: 1070014,
                total: 10,
            },
            {
                id: 1090010,
                total: 10,
            },
            {
                id: 1650001,
                total: 10,
            },
            {
                id: 1400011,
                total: 8,
            },
            {
                id: 1400012,
                total: 8,
            },
            {
                id: 1420006,
                total: 8,
            },
            {
                id: 1420007,
                total: 8,
            },
            {
                id: 1430005,
                total: 8,
            },
            {
                id: 1440006,
                total: 8,
            },
            {
                id: 1460003,
                total: 8,
            },
            {
                id: 1640003,
                total: 8,
            },
            {
                id: 1640004,
                total: 8,
            },
        ],
    },
    {
        id: 5100305,
        usedIn: "單手劍,單手錘,單手斧,弓,弩,鋼瓶,鐮刀",
        name: "橘光記憶碎片",
        usedInDetail: [
            {
                id: 1000059,
                total: 30,
            },
            {
                id: 1010070,
                total: 30,
            },
            {
                id: 1020004,
                total: 30,
            },
            {
                id: 1040054,
                total: 30,
            },
            {
                id: 1040055,
                total: 30,
            },
            {
                id: 1060011,
                total: 30,
            },
            {
                id: 1090010,
                total: 30,
            },
        ],
    },
    {
        id: 5100306,
        usedIn: "魔杖,手把,雙手劍,雙手鎚,雙手斧,集魔杖,騎槍,拳套,雙槍,手裏劍,鎖鏈鐮刃,治癒魔杖",
        name: "綠光記憶碎片",
        usedInDetail: [
            {
                id: 1200043,
                total: 45,
            },
            {
                id: 1210067,
                total: 45,
            },
            {
                id: 1220018,
                total: 45,
            },
            {
                id: 1230039,
                total: 45,
            },
            {
                id: 1250026,
                total: 45,
            },
            {
                id: 1260020,
                total: 45,
            },
            {
                id: 1270029,
                total: 45,
            },
            {
                id: 1280018,
                total: 45,
            },
            {
                id: 1290021,
                total: 45,
            },
            {
                id: 1050017,
                total: 30,
            },
            {
                id: 1070014,
                total: 30,
            },
            {
                id: 1650001,
                total: 30,
            },
        ],
    },
    {
        id: 5100307,
        usedIn: "盾牌,戰士盾牌,永恆之箭,永恆弩箭,魔導書,盾牌鋼瓶,水晶球,小丑模型,巨像模型",
        name: "黃光記憶碎片",
        usedInDetail: [
            {
                id: 1400011,
                total: 15,
            },
            {
                id: 1400012,
                total: 15,
            },
            {
                id: 1420006,
                total: 15,
            },
            {
                id: 1420007,
                total: 15,
            },
            {
                id: 1430005,
                total: 15,
            },
            {
                id: 1440006,
                total: 15,
            },
            {
                id: 1460003,
                total: 15,
            },
            {
                id: 1640003,
                total: 15,
            },
            {
                id: 1640004,
                total: 15,
            },
        ],
    },
    {
        id: 5100308,
        usedIn: "全部",
        name: "蘊含布里萊赫氣息的徽章",
        usedInDetail: [
            {
                id: 1200043,
                total: 9,
            },
            {
                id: 1210067,
                total: 9,
            },
            {
                id: 1220018,
                total: 9,
            },
            {
                id: 1230039,
                total: 9,
            },
            {
                id: 1250026,
                total: 9,
            },
            {
                id: 1260020,
                total: 9,
            },
            {
                id: 1270029,
                total: 9,
            },
            {
                id: 1280018,
                total: 9,
            },
            {
                id: 1290021,
                total: 9,
            },
            {
                id: 1000059,
                total: 6,
            },
            {
                id: 1010070,
                total: 6,
            },
            {
                id: 1020004,
                total: 6,
            },
            {
                id: 1040054,
                total: 6,
            },
            {
                id: 1040055,
                total: 6,
            },
            {
                id: 1050017,
                total: 6,
            },
            {
                id: 1060011,
                total: 6,
            },
            {
                id: 1070014,
                total: 6,
            },
            {
                id: 1090010,
                total: 6,
            },
            {
                id: 1650001,
                total: 6,
            },
            {
                id: 1080048,
                total: 3,
            },
            {
                id: 1400011,
                total: 3,
            },
            {
                id: 1400012,
                total: 3,
            },
            {
                id: 1420006,
                total: 3,
            },
            {
                id: 1420007,
                total: 3,
            },
            {
                id: 1430005,
                total: 3,
            },
            {
                id: 1440006,
                total: 3,
            },
            {
                id: 1460003,
                total: 3,
            },
            {
                id: 1640003,
                total: 3,
            },
            {
                id: 1640004,
                total: 3,
            },
        ],
    },
    {
        id: 5100309,
        usedIn: "單手劍,單手錘,單手斧,雙手劍,雙手鎚,雙手斧,騎槍,拳套,手裏劍,鎖鏈鐮刃",
        name: "鈍刃碎片",
        usedInDetail: [
            {
                id: 1200043,
                total: 100,
            },
            {
                id: 1210067,
                total: 100,
            },
            {
                id: 1220018,
                total: 100,
            },
            {
                id: 1250026,
                total: 100,
            },
            {
                id: 1260020,
                total: 100,
            },
            {
                id: 1280018,
                total: 100,
            },
            {
                id: 1290021,
                total: 100,
            },
            {
                id: 1000059,
                total: 50,
            },
            {
                id: 1010070,
                total: 50,
            },
            {
                id: 1020004,
                total: 50,
            },
        ],
    },
    {
        id: 5100310,
        usedIn: "鋼瓶,手把,雙槍,盾牌,戰士盾牌,永恆之箭,永恆弩箭,魔導書,盾牌鋼瓶,水晶球",
        name: "柔軟的金屬碎片",
        usedInDetail: [
            {
                id: 1270029,
                total: 100,
            },
            {
                id: 1060011,
                total: 50,
            },
            {
                id: 1070014,
                total: 50,
            },
            {
                id: 1400011,
                total: 50,
            },
            {
                id: 1400012,
                total: 50,
            },
            {
                id: 1420006,
                total: 50,
            },
            {
                id: 1420007,
                total: 50,
            },
            {
                id: 1430005,
                total: 50,
            },
            {
                id: 1440006,
                total: 50,
            },
            {
                id: 1460003,
                total: 50,
            },
        ],
    },
    {
        id: 5100311,
        usedIn: "弓,弩,小丑模型,巨像模型",
        name: "褪色的刺繡線",
        usedInDetail: [
            {
                id: 1040054,
                total: 50,
            },
            {
                id: 1040055,
                total: 50,
            },
            {
                id: 1640003,
                total: 50,
            },
            {
                id: 1640004,
                total: 50,
            },
        ],
    },
    {
        id: 5100312,
        usedIn: "魔杖,鐮刀,集魔杖,治癒魔杖",
        name: "空的魔力石",
        usedInDetail: [
            {
                id: 1230039,
                total: 100,
            },
            {
                id: 1050017,
                total: 50,
            },
            {
                id: 1090010,
                total: 50,
            },
            {
                id: 1650001,
                total: 50,
            },
        ],
    },
    {
        id: 5100313,
        usedIn: "單手劍,單手錘,單手斧,弓,弩,鋼瓶,鐮刀",
        name: "霰石",
        usedInDetail: [
            {
                id: 1000059,
                total: 100,
            },
            {
                id: 1010070,
                total: 100,
            },
            {
                id: 1020004,
                total: 100,
            },
            {
                id: 1040054,
                total: 100,
            },
            {
                id: 1040055,
                total: 100,
            },
            {
                id: 1060011,
                total: 100,
            },
            {
                id: 1090010,
                total: 100,
            },
        ],
    },
    {
        id: 5100314,
        usedIn: "魔杖,手把,雙手劍,雙手鎚,雙手斧,集魔杖,騎槍,拳套,雙槍,手裏劍,鎖鏈鐮刃,治癒魔杖",
        name: "透輝石",
        usedInDetail: [
            {
                id: 1200043,
                total: 150,
            },
            {
                id: 1210067,
                total: 150,
            },
            {
                id: 1220018,
                total: 150,
            },
            {
                id: 1230039,
                total: 150,
            },
            {
                id: 1250026,
                total: 150,
            },
            {
                id: 1260020,
                total: 150,
            },
            {
                id: 1270029,
                total: 150,
            },
            {
                id: 1280018,
                total: 150,
            },
            {
                id: 1290021,
                total: 150,
            },
            {
                id: 1050017,
                total: 100,
            },
            {
                id: 1070014,
                total: 100,
            },
            {
                id: 1650001,
                total: 100,
            },
        ],
    },
    {
        id: 5100315,
        usedIn: "盾牌,戰士盾牌,永恆之箭,永恆弩箭,魔導書,盾牌鋼瓶,水晶球,小丑模型,巨像模型",
        name: "鵝卵石",
        usedInDetail: [
            {
                id: 1400011,
                total: 50,
            },
            {
                id: 1400012,
                total: 50,
            },
            {
                id: 1420006,
                total: 50,
            },
            {
                id: 1420007,
                total: 50,
            },
            {
                id: 1430005,
                total: 50,
            },
            {
                id: 1440006,
                total: 50,
            },
            {
                id: 1460003,
                total: 50,
            },
            {
                id: 1640003,
                total: 50,
            },
            {
                id: 1640004,
                total: 50,
            },
        ],
    },
    {
        id: 5100316,
        usedIn: "單手劍,單手錘,單手斧,手把,雙手劍,雙手鎚,雙手斧,騎槍,拳套,雙槍,鎖鏈鐮刃,戰士盾牌",
        name: "奧妙的金屬碎片",
        usedInDetail: [
            {
                id: 1200043,
                total: 30,
            },
            {
                id: 1210067,
                total: 30,
            },
            {
                id: 1220018,
                total: 30,
            },
            {
                id: 1250026,
                total: 30,
            },
            {
                id: 1260020,
                total: 30,
            },
            {
                id: 1270029,
                total: 30,
            },
            {
                id: 1290021,
                total: 30,
            },
            {
                id: 1000059,
                total: 20,
            },
            {
                id: 1010070,
                total: 20,
            },
            {
                id: 1020004,
                total: 20,
            },
            {
                id: 1070014,
                total: 20,
            },
            {
                id: 1400012,
                total: 10,
            },
        ],
    },
    {
        id: 5100317,
        usedIn: "弓,弩,魔杖,鋼瓶,鐮刀,集魔杖,手裏劍,盾牌,魔導書,盾牌鋼瓶,水晶球,治癒魔杖",
        name: "奧妙的魔力石",
        usedInDetail: [
            {
                id: 1230039,
                total: 30,
            },
            {
                id: 1280018,
                total: 30,
            },
            {
                id: 1040054,
                total: 20,
            },
            {
                id: 1040055,
                total: 20,
            },
            {
                id: 1050017,
                total: 20,
            },
            {
                id: 1060011,
                total: 20,
            },
            {
                id: 1090010,
                total: 20,
            },
            {
                id: 1650001,
                total: 20,
            },
            {
                id: 1400011,
                total: 10,
            },
            {
                id: 1430005,
                total: 10,
            },
            {
                id: 1440006,
                total: 10,
            },
            {
                id: 1460003,
                total: 10,
            },
        ],
    },
    {
        id: 5100318,
        usedIn: "里拉,永恆之箭,永恆弩箭,小丑模型,巨像模型",
        name: "奧妙的皮革碎片",
        usedInDetail: [
            {
                id: 1080048,
                total: 10,
            },
            {
                id: 1420006,
                total: 10,
            },
            {
                id: 1420007,
                total: 10,
            },
            {
                id: 1640003,
                total: 10,
            },
            {
                id: 1640004,
                total: 10,
            },
        ],
    },
    {
        id: 5100319,
        usedIn: "全部",
        name: "高純度魔力結晶",
        usedInDetail: [
            {
                id: 1080048,
                total: 60,
            },
            {
                id: 1200043,
                total: 30,
            },
            {
                id: 1210067,
                total: 30,
            },
            {
                id: 1220018,
                total: 30,
            },
            {
                id: 1230039,
                total: 30,
            },
            {
                id: 1250026,
                total: 30,
            },
            {
                id: 1260020,
                total: 30,
            },
            {
                id: 1270029,
                total: 30,
            },
            {
                id: 1280018,
                total: 30,
            },
            {
                id: 1290021,
                total: 30,
            },
            {
                id: 1000059,
                total: 20,
            },
            {
                id: 1010070,
                total: 20,
            },
            {
                id: 1020004,
                total: 20,
            },
            {
                id: 1040054,
                total: 20,
            },
            {
                id: 1040055,
                total: 20,
            },
            {
                id: 1050017,
                total: 20,
            },
            {
                id: 1060011,
                total: 20,
            },
            {
                id: 1070014,
                total: 20,
            },
            {
                id: 1090010,
                total: 20,
            },
            {
                id: 1650001,
                total: 20,
            },
            {
                id: 1400011,
                total: 10,
            },
            {
                id: 1400012,
                total: 10,
            },
            {
                id: 1420006,
                total: 10,
            },
            {
                id: 1420007,
                total: 10,
            },
            {
                id: 1430005,
                total: 10,
            },
            {
                id: 1440006,
                total: 10,
            },
            {
                id: 1460003,
                total: 10,
            },
            {
                id: 1640003,
                total: 10,
            },
            {
                id: 1640004,
                total: 10,
            },
        ],
    },
    {
        id: 5100320,
        usedIn: "單手劍,單手錘,單手斧",
        name: "綠意盎然的刀刃碎片",
        usedInDetail: [
            {
                id: 1000059,
                total: 168,
            },
            {
                id: 1010070,
                total: 168,
            },
            {
                id: 1020004,
                total: 168,
            },
        ],
    },
    {
        id: 5100321,
        usedIn: "雙手劍,雙手鎚,雙手斧,騎槍",
        name: "綠意盎然的金屬碎片",
        usedInDetail: [
            {
                id: 1200043,
                total: 336,
            },
            {
                id: 1210067,
                total: 336,
            },
            {
                id: 1220018,
                total: 336,
            },
            {
                id: 1250026,
                total: 336,
            },
        ],
    },
    {
        id: 5100322,
        usedIn: "拳套,手裏劍",
        name: "綠意盎然的礦石碎片",
        usedInDetail: [
            {
                id: 1260020,
                total: 336,
            },
            {
                id: 1280018,
                total: 336,
            },
        ],
    },
    {
        id: 5100323,
        usedIn: "手把,小丑模型,巨像模型",
        name: "綠意盎然的木柴",
        usedInDetail: [
            {
                id: 1070014,
                total: 168,
            },
            {
                id: 1640003,
                total: 168,
            },
            {
                id: 1640004,
                total: 168,
            },
        ],
    },
    {
        id: 5100324,
        usedIn: "雙槍,鎖鏈鐮刃",
        name: "堅硬的稀原礦石碎片",
        usedInDetail: [
            {
                id: 1270029,
                total: 336,
            },
            {
                id: 1290021,
                total: 336,
            },
        ],
    },
    {
        id: 5100325,
        usedIn: "盾牌,戰士盾牌",
        name: "純白的皮革碎片",
        usedInDetail: [
            {
                id: 1400011,
                total: 168,
            },
            {
                id: 1400012,
                total: 168,
            },
        ],
    },
    {
        id: 5100326,
        usedIn: "弓,弩",
        name: "純白的羽毛",
        usedInDetail: [
            {
                id: 1040054,
                total: 168,
            },
            {
                id: 1040055,
                total: 168,
            },
        ],
    },
    {
        id: 5100327,
        usedIn: "鋼瓶,盾牌鋼瓶",
        name: "透明的鍊金術結晶",
        usedInDetail: [
            {
                id: 1060011,
                total: 168,
            },
            {
                id: 1440006,
                total: 168,
            },
        ],
    },
    {
        id: 5100328,
        usedIn: "魔杖,鐮刀,集魔杖,魔導書,水晶球,治癒魔杖",
        name: "綠意盎然的法師的寶石",
        usedInDetail: [
            {
                id: 1230039,
                total: 336,
            },
            {
                id: 1050017,
                total: 168,
            },
            {
                id: 1090010,
                total: 168,
            },
            {
                id: 1430005,
                total: 168,
            },
            {
                id: 1460003,
                total: 168,
            },
            {
                id: 1650001,
                total: 168,
            },
        ],
    },
    {
        id: 5100329,
        usedIn: "永恆之箭,永恆弩箭",
        name: "堅硬的狼牙",
        usedInDetail: [
            {
                id: 1420006,
                total: 168,
            },
            {
                id: 1420007,
                total: 168,
            },
        ],
    },
    {
        id: 5100330,
        usedIn: "除了里拉以外都需要",
        name: "魔力石",
        usedInDetail: [
            {
                id: 1200043,
                total: 960,
            },
            {
                id: 1210067,
                total: 960,
            },
            {
                id: 1220018,
                total: 960,
            },
            {
                id: 1230039,
                total: 960,
            },
            {
                id: 1250026,
                total: 960,
            },
            {
                id: 1260020,
                total: 960,
            },
            {
                id: 1270029,
                total: 960,
            },
            {
                id: 1280018,
                total: 960,
            },
            {
                id: 1290021,
                total: 960,
            },
            {
                id: 1000059,
                total: 480,
            },
            {
                id: 1010070,
                total: 480,
            },
            {
                id: 1020004,
                total: 480,
            },
            {
                id: 1040054,
                total: 480,
            },
            {
                id: 1040055,
                total: 480,
            },
            {
                id: 1050017,
                total: 480,
            },
            {
                id: 1060011,
                total: 480,
            },
            {
                id: 1070014,
                total: 480,
            },
            {
                id: 1090010,
                total: 480,
            },
            {
                id: 1400011,
                total: 480,
            },
            {
                id: 1400012,
                total: 480,
            },
            {
                id: 1420006,
                total: 480,
            },
            {
                id: 1420007,
                total: 480,
            },
            {
                id: 1430005,
                total: 480,
            },
            {
                id: 1440006,
                total: 480,
            },
            {
                id: 1460003,
                total: 480,
            },
            {
                id: 1640003,
                total: 480,
            },
            {
                id: 1640004,
                total: 480,
            },
            {
                id: 1650001,
                total: 480,
            },
        ],
    },
];
