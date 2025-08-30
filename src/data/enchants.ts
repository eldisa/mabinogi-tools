import type { Enchant } from "../types/Enchant";

export const enchants: Enchant[] = [
    {
        position: "單手武器",
        type: "prefix",
        name: {
            tw: "破壞性的",
            en: "Destructive",
            kr: "파괴적인",
        },
        effect: [
            {
                id: "attack_max",
                min: 45,
                max: 60,
            },
            {
                id: "attack_min",
                min: 30,
                max: 40,
            },
            {
                id: "STR2",
                min: 10,
                max: 10,
            },
        ],
    },
    {
        position: "雙手武器",
        type: "prefix",
        name: {
            tw: "銳不可擋的",
            en: "Unyielding",
            kr: "거침없는",
        },
        effect: [
            {
                id: "attack_max",
                min: 50,
                max: 60,
            },
            {
                id: "HP",
                min: 100,
                max: 100,
            },
        ],
    },
    {
        position: "弓弩",
        type: "prefix",
        name: {
            tw: "解放的",
            en: "Freed",
            kr: "해방된",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "attack_max",
                min: 70,
                max: 85,
            },
            {
                id: "DEX",
                min: 50,
                max: 50,
            },
        ],
    },
    {
        position: "騎槍",
        type: "prefix",
        name: {
            tw: "堅強的",
            en: "Resolute",
            kr: "굳센",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 3,
                max: 3,
            },
            {
                id: "attack_max",
                min: 50,
                max: 70,
            },
            {
                id: "attack_min",
                min: 20,
                max: 40,
            },
        ],
    },
    {
        position: "單手魔杖、集魔杖",
        type: "prefix",
        name: {
            tw: "薄暮的",
            en: "Dusky",
            kr: "어스름한",
        },
        effect: [
            {
                id: "magic_attack",
                min: 50,
                max: 65,
            },
            {
                id: "MP",
                min: 100,
                max: 100,
            },
            {
                id: "manause_revised_set",
                min: 5,
                max: 5,
            },
        ],
    },
    {
        position: "單手魔杖、集魔杖",
        type: "prefix",
        name: {
            tw: "無窮的",
            en: "Enduring",
            kr: "무궁한",
        },
        effect: [
            {
                id: "magic_attack",
                min: 50,
                max: 65,
            },
            {
                id: "INT",
                min: 20,
                max: 20,
            },
            {
                id: "MP",
                min: 50,
                max: 50,
            },
            {
                id: "manause_revised_set",
                min: 2,
                max: 6,
            },
        ],
    },
    {
        position: "魔導書、水晶球",
        type: "prefix",
        name: {
            tw: "被遺忘的",
            en: "Forgotten",
            kr: "잊혀진",
        },
        effect: [
            {
                id: "magic_attack",
                min: 10,
                max: 20,
            },
        ],
    },
    {
        position: "大型鐮刀",
        type: "prefix",
        name: {
            tw: "無盡的",
            en: "Endless",
            kr: "끝없는",
        },
        effect: [
            {
                id: "magic_attack",
                min: 25,
                max: 40,
            },
            {
                id: "MP",
                min: 100,
                max: 200,
            },
        ],
    },
    {
        position: "鋼瓶",
        type: "prefix",
        name: {
            tw: "含蓄的",
            en: "Subtle",
            kr: "은은한",
        },
        effect: [
            {
                id: "all_alchemy_damage",
                min: 100,
                max: 110,
            },
            {
                id: "HP",
                min: 100,
                max: 100,
            },
        ],
    },
    {
        position: "拳套",
        type: "prefix",
        name: {
            tw: "威脅性的",
            en: "Menacing",
            kr: "위협적인",
        },
        effect: [
            {
                id: "attack_max",
                min: 50,
                max: 60,
            },
            {
                id: "attack_min",
                min: 20,
                max: 20,
            },
            {
                id: "WIL",
                min: 10,
                max: 20,
            },
        ],
    },
    {
        position: "手把",
        type: "prefix",
        name: {
            tw: "甦醒的",
            en: "Roused",
            kr: "깨어난",
        },
        effect: [
            {
                id: "marionette_attack_max",
                min: 50,
                max: 60,
            },
            {
                id: "marionette_hp",
                min: 200,
                max: 200,
            },
            {
                id: "marionette_defense",
                min: 3,
                max: 3,
            },
            {
                id: "marionette_protect",
                min: 3,
                max: 3,
            },
        ],
    },
    {
        position: "雙槍",
        type: "prefix",
        name: {
            tw: "關鍵的",
            en: "Decisive",
            kr: "결정적인",
        },
        effect: [
            {
                id: "attack_max",
                min: 50,
                max: 60,
            },
            {
                id: "attack_min",
                min: 25,
                max: 25,
            },
            {
                id: "attack_speed_set",
                min: 4,
                max: 6,
            },
        ],
    },
    {
        position: "手裡劍",
        type: "prefix",
        name: {
            tw: "束縛的",
            en: "Bound",
            kr: "속박된",
        },
        effect: [
            {
                id: "attack_max",
                min: 50,
                max: 60,
            },
            {
                id: "HP",
                min: 100,
                max: 100,
            },
        ],
    },
    {
        position: "鎖鏈鐮刃",
        type: "prefix",
        name: {
            tw: "暗沉的",
            en: "Dim",
            kr: "어두운",
        },
        effect: [
            {
                id: "attack_max",
                min: 50,
                max: 60,
            },
            {
                id: "attack_min",
                min: 30,
                max: 30,
            },
            {
                id: "LUK",
                min: 10,
                max: 30,
            },
        ],
    },
    {
        position: "盾牌",
        type: "prefix",
        name: {
            tw: "傳說中的",
            en: "Legend’s",
            kr: "전설의",
        },
        effect: [
            {
                id: "defense",
                min: 30,
                max: 70,
            },
            {
                id: "HP",
                min: 100,
                max: 100,
            },
            {
                id: "MP",
                min: 100,
                max: 100,
            },
        ],
    },
    {
        position: "樂器",
        type: "prefix",
        name: {
            tw: "複調",
            en: "Polyphony",
            kr: "폴리포니",
        },
        effect: [
            {
                id: "musicbuff_bonus",
                min: 4,
                max: 7,
            },
            {
                id: "INT",
                min: 30,
                max: 30,
            },
            {
                id: "LUK",
                min: 30,
                max: 30,
            },
        ],
    },
    {
        position: "單手武器",
        type: "suffix",
        name: {
            tw: "鬥志",
            en: "valor",
            kr: "투지",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 1,
                max: 2,
            },
            {
                id: "attack_max",
                min: 60,
                max: 70,
            },
            {
                id: "HP",
                min: 100,
                max: 100,
            },
            {
                id: "STR2",
                min: 22,
                max: 22,
            },
        ],
    },
    {
        position: "雙手武器",
        type: "suffix",
        name: {
            tw: "暴走",
            en: "Rampage",
            kr: "폭주",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "attack_max",
                min: 60,
                max: 80,
            },
        ],
    },
    {
        position: "弓弩",
        type: "suffix",
        name: {
            tw: "靈魂",
            en: "Soul",
            kr: "영혼",
        },
        effect: [
            {
                id: "attack_max",
                min: 30,
                max: 50,
            },
            {
                id: "DEX",
                min: 20,
                max: 40,
            },
            {
                id: "critical",
                min: 15,
                max: 15,
            },
        ],
    },
    {
        position: "騎槍",
        type: "suffix",
        name: {
            tw: "投射",
            en: "Striker",
            kr: "투사",
        },
        effect: [
            {
                id: "attack_max",
                min: 100,
                max: 110,
            },
            {
                id: "attack_min",
                min: 50,
                max: 70,
            },
            {
                id: "SP",
                min: 100,
                max: 100,
            },
        ],
    },
    {
        position: "單手魔杖、集魔杖",
        type: "suffix",
        name: {
            tw: "成果",
            en: "Harvest",
            kr: "결실",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 1,
                max: 1,
            },
            {
                id: "magic_attack",
                min: 50,
                max: 60,
            },
            {
                id: "manause_revised_set",
                min: 4,
                max: 8,
            },
        ],
    },
    {
        position: "魔導書、水晶球",
        type: "suffix",
        name: {
            tw: "空間",
            en: "space",
            kr: "공간",
        },
        effect: [
            {
                id: "magic_attack",
                min: 10,
                max: 15,
            },
        ],
    },
    {
        position: "大型鐮刀",
        type: "suffix",
        name: {
            tw: "羈絆",
            en: "Shackle",
            kr: "굴레",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "magic_attack",
                min: 40,
                max: 55,
            },
            {
                id: "INT",
                min: 30,
                max: 30,
            },
        ],
    },
    {
        position: "鋼瓶",
        type: "suffix",
        name: {
            tw: "遺產",
            en: "Legacy",
            kr: "유산",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 1,
                max: 2,
            },
            {
                id: "all_alchemy_damage",
                min: 100,
                max: 110,
            },
        ],
    },
    {
        position: "拳套",
        type: "suffix",
        name: {
            tw: "重現",
            en: "Revive",
            kr: "재현",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "attack_max",
                min: 60,
                max: 80,
            },
            {
                id: "STR2",
                min: 50,
                max: 50,
            },
            {
                id: "WIL",
                min: 50,
                max: 50,
            },
        ],
    },
    {
        position: "手把",
        type: "suffix",
        name: {
            tw: "凍傷",
            en: "bronze statue",
            kr: "동상",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 1,
                max: 2,
            },
            {
                id: "marionette_attack_max",
                min: 55,
                max: 65,
            },
            {
                id: "marionette_attack_min",
                min: 80,
                max: 80,
            },
        ],
    },
    {
        position: "雙槍",
        type: "suffix",
        name: {
            tw: "痛擊",
            en: "Smite",
            kr: "강타",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "attack_max",
                min: 60,
                max: 80,
            },
            {
                id: "STR2",
                min: 50,
                max: 50,
            },
            {
                id: "INT",
                min: 50,
                max: 50,
            },
        ],
    },
    {
        position: "手裡劍",
        type: "suffix",
        name: {
            tw: "殘渣",
            en: "Remnant",
            kr: "잔재",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "attack_max",
                min: 60,
                max: 80,
            },
            {
                id: "STR2",
                min: 50,
                max: 50,
            },
            {
                id: "WIL",
                min: 50,
                max: 50,
            },
        ],
    },
    {
        position: "鎖鏈鐮刃",
        type: "suffix",
        name: {
            tw: "殘影",
            en: "Echo",
            kr: "잔상",
        },
        effect: [
            {
                id: "lance_piercing",
                min: 2,
                max: 3,
            },
            {
                id: "attack_max",
                min: 60,
                max: 80,
            },
            {
                id: "DEX",
                min: 50,
                max: 50,
            },
            {
                id: "LUK",
                min: 50,
                max: 50,
            },
        ],
    },
    {
        position: "盾牌",
        type: "suffix",
        name: {
            tw: "防守者",
            en: "Defender",
            kr: "디펜더",
        },
        effect: [
            {
                id: "protection",
                min: 3,
                max: 5,
            },
            {
                id: "magic_protection",
                min: 1,
                max: 2,
            },
            {
                id: "HP",
                min: 150,
                max: 150,
            },
        ],
    },
    {
        position: "樂器",
        type: "suffix",
        name: {
            tw: "節拍",
            en: "Tempo",
            kr: "템포",
        },
        effect: [
            {
                id: "musicbuff_bonus",
                min: 2,
                max: 3,
            },
            {
                id: "HP",
                min: 100,
                max: 100,
            },
            {
                id: "MP",
                min: 100,
                max: 100,
            },
        ],
    },
];
