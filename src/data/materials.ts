import type { CraftableItem } from "../types/CraftItem";

export const materials: CraftableItem[] = [
    {
        id: 60054,
        name: {
            en: "Wood Plate",
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
            kr: "티어드롭 젬스톤",
            tw: "淚滴寶石",
        },
        source: {
            // type: "shop",
            // price: 35000,
            // currency: "ducat",
            type: "desc",
            description: "貿易所商店購買 (35000 杜卡特)",
        },
    },
    {
        id: 64117,
        name: {
            en: "Stone Vine Mineral",
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
            kr: "각성된 힘의 가루",
            tw: "擁有覺醒能量的粉末",
        },
        source: {
            type: "desc",
            description: "史蒂華秘密商店購買(50000)",
        },
    },
    {
        id: 64643,
        name: {
            en: "Awakening Force Piece",
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
            kr: "깨어난 힘의 정수",
            tw: "甦醒力量的精華液",
        },
        source: {
            type: "",
        },
    },
    {
        id: 64675,
        name: {
            en: "Jewel of Brave Warrior",
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
            kr: "젬스톤 파우더",
            tw: "寶石粉末",
        },
        source: {
            // type: "dissolution",
            // materials: "新寶石",
            type: "desc",
            description: "分解新寶石 (1~2)",
        },
    },
    {
        id: 5100274,
        name: {
            en: "Magic Infused Catalyst",
            kr: "마력이 깃든 융합제",
            tw: "聚集魔力的融合劑",
        },
        source: {
            // type: "shop",
            // price: 500000,
            // currency: "gold",

            type: "desc",
            description: "雷楠商店購買 (50萬)",
        },
    },
    {
        id: 5100275,
        name: {
            en: "Brilliant Memory Crystal",
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
            kr: "강화된 스핀 기어",
            tw: "強化旋轉齒輪",
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
            kr: "강화된 실리엔",
            tw: "強化希里原",
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
            kr: "강화된 금속판",
            tw: "強化金屬板",
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
            kr: "브리 레흐의 코어",
            tw: "布里萊赫核心",
        },
        source: {
            // type: "reward",
            // dungeon: "G27",
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:100)",
        },
    },
    {
        id: 5100304,
        name: {
            en: "Bri Leith's Essence",
            kr: "브리 레흐의 정수",
            tw: "布里萊赫精髓",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:100)",
        },
    },
    {
        id: 5100305,
        name: {
            en: "Orange Ligt Memory Fragment",
            kr: "주황빛 기억의 조각",
            tw: "橘黃光記憶碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:25)",
        },
    },
    {
        id: 5100306,
        name: {
            en: "Green Ligt Memory Fragment",
            kr: "초록빛 기억의 조각",
            tw: "綠光記憶碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:25)",
        },
    },
    {
        id: 5100307,
        name: {
            en: "Gold Ligt Memory Fragment",
            kr: "금빛 기억의 조각",
            tw: "黃光記憶碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:25)",
        },
    },
    {
        id: 5100308,
        name: {
            en: "Emblem Infused with the Aura of Bri Leith",
            kr: "브리 레흐의 기운이 깃든 문장",
            tw: "蘊含布里萊赫氣息的徽章",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100309,
        name: {
            en: "Blunt Blade Fragments",
            kr: "무딘 칼날 조각",
            tw: "鈍刃碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100310,
        name: {
            en: "Soft Metal Piece",
            kr: "무른 금속 파편",
            tw: "柔軟的金屬碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100311,
        name: {
            en: "Faded Filoselle",
            kr: "빛바랜 자수실",
            tw: "褪色的刺繡線",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100312,
        name: {
            en: "Empty Magic Stone",
            kr: "텅 빈 마력석",
            tw: "空的魔力石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100313,
        name: {
            en: "Aragonite",
            kr: "아라고나이트",
            tw: "霰石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100314,
        name: {
            en: "Variscite",
            kr: "바리사이트",
            tw: "雲母",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100315,
        name: {
            en: "Orpiment",
            kr: "오피먼트",
            tw: "鵝卵石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100316,
        name: {
            en: "Exquisite Metal Piece",
            kr: "오묘한 금속 조각",
            tw: "奧妙的金屬碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100317,
        name: {
            en: "Exquisite Magic Stone",
            kr: "오묘한 마력석",
            tw: "奧妙的魔力石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100318,
        name: {
            en: "Exquisite Leather Piece",
            kr: "오묘한 가죽 조각",
            tw: "奧妙的皮革碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100319,
        name: {
            en: "High Purity Magical Crystal",
            kr: "순도 높은 마력의 결정",
            tw: "高純度魔力結晶",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:3)",
        },
    },
    {
        id: 5100320,
        name: {
            en: "Verdant Tinged Blade Shard",
            kr: "녹음이 감도는 칼날 조각",
            tw: "綠意盎然的刀刃碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100321,
        name: {
            en: "Verdant Tinged Metal Shard",
            kr: "녹음이 감도는 금속 조각",
            tw: "綠意盎然的金屬碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100322,
        name: {
            en: "Verdant Tinged Ore",
            kr: "녹음이 감도는 광석 조각",
            tw: "綠意盎然的礦石碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100323,
        name: {
            en: "Verdant Tinged Firewood",
            kr: "녹음이 감도는 나무 장작",
            tw: "綠意盎然的木柴",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100324,
        name: {
            en: "Sturdy Heulwn Ore",
            kr: "단단한 힐웬 광석 조각",
            tw: "堅硬的稀原礦石碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100325,
        name: {
            en: "Pure White Leather Fragment",
            kr: "순백의 가죽 조각",
            tw: "純白皮革碎片",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100326,
        name: {
            en: "Pure White Feather",
            kr: "순백의 깃털",
            tw: "純白羽毛",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100327,
        name: {
            en: "Transparent Alchemy Crystal",
            kr: "투명한 연금술 결정",
            tw: "透明的鍊金術結晶",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100328,
        name: {
            en: "Verdant Infused Mage Jewel",
            kr: "녹음이 깃든 마법사의 보석",
            tw: "綠意盎然的法師的寶石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100329,
        name: {
            en: "Sturdy Wolf Fang",
            kr: "단단한 늑대의 이빨",
            tw: "堅硬的野狼牙齒",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
    {
        id: 5100330,
        name: {
            en: "Magical Crystal",
            kr: "마력석",
            tw: "魔力石",
        },
        source: {
            type: "desc",
            description: "G27副本獎勵/商店購買 (布里萊赫珠子:1)",
        },
    },
];
