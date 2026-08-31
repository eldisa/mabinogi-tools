import { chromium } from 'playwright';
import fs from 'fs';
import { pushPrices } from './pushPrices.js';

// 1. 準備資料庫 (你可以考慮之後抽出來放在獨立的 json 檔案)
const itemDb = [
    {
        id: 5040665,
        name: {
            en: "Stardust Shape Energy",
            us: "Shard of Solace Stardust",
            cn: "安乐碎片星尘形象",
            jp: "安らぎの破片スターダストの形",
            kr: "안락의 파편 스타더스트의 형상",
            tw: "安樂的碎片星塵形象",
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
    },
    {
        id: 5100304,
        name: {
            en: "Bri Leith's Essence",
            us: "Bri Leith Essence",
            cn: "布里列赫的精髓",
            jp: "ブリーレフのエセス",
            kr: "브리 레흐의 정수",
            "tw": "布里萊赫精髓"
        }
    },
    {
        id: 5100305,
        name: {
            "en": "Orange Ligt Memory Fragment",
            "kr": "주황빛 기억의 조각",
            "tw": "橘光記憶碎片",
            "tw2": "橘黃光記憶碎片"
        }
    },
    {
        id: 5100306,
        name: {
            "en": "Green Ligt Memory Fragment",
            "kr": "초록빛 기억의 조각",
            "tw": "綠光記憶碎片"
        }
    },
    {
        id: 5100307,
        name: {
            "en": "Gold Ligt Memory Fragment",
            "kr": "금빛 기억의 조각",
            "tw": "黃光記憶碎片"
        }
    },
    {
        id: 5100308,
        name: {
            "en": "Emblem Infused with the Aura of Bri Leith",
            "kr": "브리 레흐의 기운이 깃든 문장",
            "tw": "蘊含布里萊赫氣息的徽章"
        }
    },
    {
        id: 5100309,
        name: {
            "en": "Blunt Blade Fragments",
            "kr": "무딘 칼날 조각",
            "tw": "鈍刃碎片"
        }
    },
    {
        id: 5100310,
        name: {
            "en": "Soft Metal Piece",
            "kr": "무른 금속 파편",
            "tw": "柔軟的金屬碎片"
        }
    },
    {
        id: 5100311,
        name: {
            "en": "Faded Filoselle",
            "kr": "빛바랜 자수실",
            "tw": "褪色的刺繡線"
        }
    },
    {
        id: 5100312,
        name: {
            "en": "Empty Magic Stone",
            "kr": "텅 빈 마력석",
            "tw": "空的魔力石"
        }
    },
    {
        id: 5100313,
        name: {
            "en": "Aragonite",
            "kr": "아라고나이트",
            "tw": "霰石"
        }
    },
    {
        id: 5100314,
        name: {
            "en": "Variscite",
            "kr": "바리사이트",
            "tw": "透輝石",
            "tw2": "雲母"
        }
    },
    {
        id: 5100315,
        name: {
            "en": "Orpiment",
            "kr": "오피먼트",
            "tw": "鵝卵石"
        }
    },
    {
        id: 5100316,
        name: {
            "en": "Exquisite Metal Piece",
            "kr": "오묘한 금속 조각",
            "tw": "奧妙的金屬碎片"
        }
    },
    {
        id: 5100317,
        name: {
            "en": "Exquisite Magic Stone",
            "kr": "오묘한 마력석",
            "tw": "奧妙的魔力石"
        }
    },
    {
        id: 5100318,
        name: {
            "en": "Exquisite Leather Piece",
            "kr": "오묘한 가죽 조각",
            "tw": "奧妙的皮革碎片"
        }
    },
    {
        id: 5100319,
        name: {
            "en": "High Purity Magical Crystal",
            "kr": "순도 높은 마력의 결정",
            "tw": "高純度魔力結晶"
        }
    },
    {
        id: 5100320,
        name: {
            "en": "Verdant Tinged Blade Shard",
            "kr": "녹음이 감도는 칼날 조각",
            "tw": "綠意盎然的刀刃碎片"
        }
    },
    {
        id: 5100321,
        name: {
            "en": "Verdant Tinged Metal Shard",
            "kr": "녹음이 감도는 금속 조각",
            "tw": "綠意盎然的金屬碎片"
        }
    },
    {
        id: 5100322,
        name: {
            "en": "Verdant Tinged Ore",
            "kr": "녹음이 감도는 광석 조각",
            "tw": "綠意盎然的礦石碎片"
        }
    },
    {
        id: 5100323,
        name: {
            "en": "Verdant Tinged Firewood",
            "kr": "녹음이 감도는 나무 장작",
            "tw": "綠意盎然的木柴"
        }
    },
    {
        id: 5100324,
        name: {
            "en": "Sturdy Heulwn Ore",
            "kr": "단단한 힐웬 광석 조각",
            "tw": "堅硬的稀原礦石碎片"
        }
    },
    {
        id: 5100325,
        name: {
            "en": "Pure White Leather Fragment",
            "kr": "순백의 가죽 조각",
            "tw": "純白的皮革碎片",
            "tw2": "純白皮革碎片"
        }
    },
    {
        id: 5100326,
        name: {
            "en": "Pure White Feather",
            "kr": "순백의 깃털",
            "tw": "純白的羽毛",
            "tw2": "純白羽毛"
        }
    },
    {
        id: 5100327,
        name: {
            "en": "Transparent Alchemy Crystal",
            "kr": "투명한 연금술 결정",
            "tw": "透明的鍊金術結晶"
        }
    },
    {
        id: 5100328,
        name: {
            "en": "Verdant Infused Mage Jewel",
            "kr": "녹음이 깃든 마법사의 보석",
            "tw": "綠意盎然的法師的寶石"
        }
    },
    {
        id: 5100329,
        name: {
            "en": "Sturdy Wolf Fang",
            "kr": "단단한 늑대의 이빨",
            "tw": "堅硬的狼牙",
            "tw2": "堅硬的野狼牙齒"
        }
    },
    {
        id: 5100330,
        name: {
            "en": "Magical Crystal",
            "kr": "마력석",
            "tw": "魔力石"
        }
    },
    {
        id: 5100331,
        name: {
            "en": "Coin",
            "kr": "브리 레흐 구슬",
            "tw": "布里萊赫的珠子"
        }
    },
    {
        id: 5040986,
        name: {
            "en": "Holywater Effect Memory Scroll",
            "kr": "무리아스의 성수 효과 기억의 스크롤",
            "tw": "布里萊赫的珠子"
        }
    },
    {
        "id": 5040986,
        "name": {
            "en": "Holywater Effect Memory Scroll",
            "kr": "무리아스의 성수 효과 기억의 스크롤",
            "tw": "穆利亞斯聖水效果記憶卷軸"
        },
    },
    {
        "id": 5040985,
        "name": {
            "en": "Murias Treasure Platinum Hammer of Durability",
            "kr": "무리아스의 유물 내구도 상승의 플래티넘 망치",
            "tw": "穆利亞斯的遺物裝備耐久度提升的白金鐵鎚"
        },
    },
    {
        "id": 5040788,
        "name": {
            "en": "Palala Red Upgrade Stone",
            "kr": "8단계 붉은 개조석",
            "tw": "第8階段火紅改造石"
        },
    },
    {
        "id": 5040787,
        "name": {
            "en": "Lumila Blue Upgrade Stone",
            "kr": "8단계 푸른 개조석",
            "tw": "第8階段水藍改造石"
        },
    },
    {
        "id": 5170454,
        "name": {
            "en": "Stone of Bri Leith",
            "kr": "브리 레흐의 잔흔석",
            "tw": "布里萊赫的礫石"
        },
    },
    {
        "id": 4130569,
        "name": {
            "en": "Title Coupon",
            "kr": "브론타나스 2차 타이틀 획득 쿠폰",
            "tw": "布倫塔納斯第2稱號取得券"
        },
    },
    {
        "id": 4130568,
        "name": {
            "en": "Title Coupon",
            "kr": "고목의 페타크 2차 타이틀 획득 쿠폰",
            "tw": "古樹的佩塔克第2稱號取得券"
        },
    },
    {
        "id": 4130570,
        "name": {
            "en": "Title Coupon",
            "kr": "레넨의 미이르 2차 타이틀 획득 쿠폰",
            "tw": "雷楠的米勒第2稱號取得券"
        },
    },
    {
        "id": 4130571,
        "name": {
            "en": "Title Coupon",
            "kr": "레넨의 미이르: 회한 2차 타이틀 획득 쿠폰",
            "tw": "雷楠的米勒 : 悔恨第2稱號取得券"
        },
    },
    {
        "id": 5030668,
        "name": {
            "en": "Bri Leith Entrance Extra Miniature",
            "kr": "낭만 농장 브리 레흐 입구 엑스트라 미니어처",
            "tw": "浪漫農場布里萊赫入口模型"
        },
    },
    {
        "id": 3600006,
        "name": {
            "en": "Murias Treasure(Idea)",
            "kr": "무리아스의 유물(이데아)",
            "tw": "穆利亞斯的遺物(理念)"
        },
    }
];

const enchantDb = [
    {
        id: 21639,
        name: {
            tw: "薄暮的",
            en: "Dusky",
            kr: "어스름한",
            tw2: "朦朧的",
        },
    },
    {
        id: 21640,
        name: {
            tw: "朦朧的",
            en: "Dusky",
            kr: "어스름한",
            tw2: "朦朧的"
        }
    },
    {
        id: 21641,
        name: {
            tw: "無窮的",
            en: "Enduring",
            kr: "무궁한",
            tw2: "無窮的"
        }
    },
    {
        id: 21642,
        name: {
            tw: "無盡的",
            en: "Endless",
            kr: "끝없는",
            tw2: "無盡的"
        }
    },
    {
        id: 21643,
        name: {
            tw: "堅強的",
            en: "Resolute",
            kr: "굳센"
        }
    },
    {
        id: 21644,
        name: {
            tw: "銳不可擋的",
            en: "Unyielding",
            kr: "거침없는"
        }
    },
    {
        id: 21645,
        name: {
            tw: "破壞性的",
            en: "Destructive",
            kr: "파괴적인"
        }
    },
    {
        id: 21646,
        name: {
            tw: "解放的",
            en: "Freed",
            kr: "해방된"
        }
    },
    {
        id: 21647,
        name: {
            tw: "含蓄的",
            en: "Subtle",
            kr: "은은한"
        }
    },
    {
        id: 21648,
        name: {
            tw: "甦醒的",
            en: "Roused",
            kr: "깨어난"
        }
    },
    {
        id: 21649,
        name: {
            tw: "威脅性的",
            en: "Menacing",
            kr: "위협적인"
        }
    },
    {
        id: 21650,
        name: {
            tw: "關鍵的",
            en: "Decisive",
            kr: "결정적인"
        }
    },
    {
        id: 21651,
        name: {
            tw: "束縛的",
            en: "Bound",
            kr: "속박된"
        }
    },
    {
        id: 21652,
        name: {
            tw: "暗沉的",
            en: "Dim",
            kr: "어두운"
        }
    },
    {
        id: 21653,
        name: {
            tw: "傳說中的",
            en: "Legend’s",
            kr: "전설의"
        }
    },
    {
        id: 21654,
        name: {
            tw: "被遺忘的",
            en: "Forgotten",
            kr: "잊혀진"
        }
    },
    {
        id: 21655,
        name: {
            tw: "複調",
            en: "Polyphony",
            kr: "폴리포니"
        }
    },
    {
        id: 21656,
        name: {
            tw: "成果",
            en: "Harvest",
            kr: "결실"
        }
    },
    {
        id: 21657,
        name: {
            tw: "羈絆",
            en: "Shackle",
            kr: "굴레"
        }
    },
    {
        id: 21658,
        name: {
            tw: "投射",
            en: "Striker",
            kr: "투사"
        }
    },
    {
        id: 21659,
        name: {
            tw: "暴走",
            en: "Rampage",
            kr: "폭주"
        }
    },
    {
        id: 21660,
        name: {
            tw: "鬥志",
            en: "valor",
            kr: "투지"
        }
    },
    {
        id: 21661,
        name: {
            tw: "靈魂",
            en: "Soul",
            kr: "영혼"
        }
    },
    {
        id: 21662,
        name: {
            tw: "遺產",
            en: "Legacy",
            kr: "유산"
        }
    },
    {
        id: 21663,
        name: {
            tw: "銅像",
            tw2: "凍傷",
            en: "bronze statue",
            kr: "동상"
        }
    },
    {
        id: 21664,
        name: {
            tw: "重現",
            en: "Revive",
            kr: "재현"
        }
    },
    {
        id: 21665,
        name: {
            tw: "痛擊",
            en: "Smite",
            kr: "강타"
        }
    },
    {
        id: 21666,
        name: {
            tw: "殘渣",
            en: "Remnant",
            kr: "잔재"
        }
    },
    {
        id: 21667,
        name: {
            tw: "殘影",
            en: "Echo",
            kr: "잔상"
        }
    },
    {
        id: 21668,
        name: {
            tw: "防守者",
            en: "Defender",
            kr: "디펜더"
        }
    },
    {
        id: 21669,
        name: {
            tw: "空間",
            en: "space",
            kr: "공간"
        }
    },
    {
        id: 21670,
        name: {
            tw: "節拍",
            en: "Tempo",
            kr: "템포"
        }
    },
    {
        id: 21671,
        name: {
            tw: "受信賴的",
            en: "faithful",
            tw2: "受信賴的",
            kr: "신뢰하는"
        }
    },
    {
        id: 21672,
        name: {
            tw: "累積的",
            en: "accumulating",
            tw2: "累積的",
            kr: "쌓여가는"
        }
    },
    {
        id: 21673,
        name: {
            tw: "記憶的",
            en: "memorial",
            tw2: "記憶的",
            kr: "기억의"
        }
    },
    {
        id: 21674,
        name: {
            tw: "被蠶食的",
            en: "overwhelmed",
            tw2: "被蠶食的",
            kr: "잠식된"
        }
    },
    {
        id: 21675,
        name: {
            tw: "單純的",
            en: "genuine ",
            tw2: "單純的",
            kr: "순수한"
        }
    },
    {
        id: 31788,
        name: { tw: "管理者", en: "Administrator", tw2: "管理者", kr: "관리자" },
    },
    {
        id: 31789,
        name: {
            tw: "後悔",
            en: "Regret",
            tw2: "後悔",
            kr: "후회"
        }
    },
    {
        id: 31790,
        name: {
            tw: "片段",
            en: "Fragment",
            tw2: "片段",
            kr: "편린"
        }
    },
    {
        id: 31791,
        name: {
            tw: "自我",
            en: "Ego",
            tw2: "自我",
            kr: "자아"
        }
    },
    {
        id: 31792,
        name: {
            tw: "禮物",
            en: "Present",
            tw2: "禮物",
            kr: "선물"
        }
    },
];

(async () => {
    const browser = await chromium.launch(); // 如果你想看過程，可以加 { headless: false }
    const page = await browser.newPage();

    console.log('正在前往網頁...');
    await page.goto('https://mabi.labanyu.com/dungeon/brie-lech');

    // 等待卡片元素出現
    await page.waitForSelector('.item-card-box');

    // 2. 將邏輯與資料傳入瀏覽器環境執行
    const finalResults = await page.evaluate(({ itemDb, enchantDb }) => {

        // 內部的查詢 Map 建立
        const universalMap = new Map();
        itemDb.forEach(i => universalMap.set(i.name.kr, { ...i, category: 'item' }));
        enchantDb.forEach(e => universalMap.set(e.name.kr, { ...e, category: 'enchant' }));

        // 內部的價格轉換函數
        const parseKoreanPrice = (s) => {
            if (!s || s === '-') return 0;
            let clean = s.replace(/골드|,/g, '').trim();
            let total = 0;
            if (clean.includes('억')) {
                const p = clean.split('억');
                total += parseInt(p[0]) * 1e8;
                clean = p[1] || "";
            }
            if (clean.includes('만')) {
                const p = clean.split('만');
                total += parseInt(p[0]) * 1e4;
                clean = p[1] || "";
            }
            if (clean.trim()) total += parseInt(clean);
            return total;
        };

        // 執行抓取與 Join
        return Array.from(document.querySelectorAll('.item-card-box')).map(box => {
            const nameEl = box.querySelector('.name');
            const priceEl = box.querySelector('.item-price');

            const rawKr = nameEl ? nameEl.innerText.split('\n')[0].trim() : '未知';
            const price = priceEl ? parseKoreanPrice(priceEl.innerText) : 0;

            let match = universalMap.get(rawKr);

            if (!match && rawKr.includes(' - ')) {
                const subName = rawKr.split(' - ')[1].trim();
                match = universalMap.get(subName);
            }

            return {
                id: match?.id || null,
                name: {
                    tw: match?.name?.tw || "未對應",
                    kr: rawKr,
                    en: match?.name?.en || ""
                },
                price: price,
                type: match?.category || 'unknown'
            };
        });
    }, { itemDb, enchantDb }); // 傳入外部參數

    // 3. 輸出結果
    console.table(finalResults.filter(item => !item.name?.kr?.includes('특수한 옷본')).map(item => ({
        名稱: item.name.tw === "未對應" ? item.name.kr : item.name.tw,
        價格: item.price.toLocaleString(),
        類型: item.type
    })));

    finalResults.forEach(item => {
        console.log(
            `${(item.name.tw === "未對應" ? item.name.kr : item.name.tw).padEnd(30)} | ` +
            `${item.price.toLocaleString().padStart(12)} | ` +
            `${item.type}`
        );
    });

    // 將結果存成 JSON 檔案，方便之後前端調用
    const outputDir = './data';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(`${outputDir}/prices.json`, JSON.stringify(finalResults, null, 2));

    console.log(`\n抓取完成，共 ${finalResults.length} 筆資料已存至 ./data/prices.json`);

    await pushPrices('/internal/prices/dungeon-items', finalResults);

    await browser.close();
})();