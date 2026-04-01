// 1. 改用 import 語法
import { chromium } from 'playwright';
import fs from 'fs';

// 如果你需要讀取 JSON 檔案，ESM 模式下建議這樣做：
// import itemDb from '../data/itemDb.json' assert { type: 'json' };


(async () => {

    const browser = await chromium.launch();
    const page = await browser.newPage();

    // 前往目標網頁
    await page.goto('https://mabi.labanyu.com/dungeon/brie-lech');

    // 等待卡片載入
    await page.waitForSelector('.item-card-box');

    // 在瀏覽器環境中執行抓取邏輯
    const items = await page.evaluate(() => {
        const parsePrice = (s) => {
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

        return Array.from(document.querySelectorAll('.item-card-box')).map(box => {
            const rawKr = box.querySelector('.name').innerText.split('\n')[0].trim();
            const rawPrice = box.querySelector('.item-price').innerText;
            return {
                krName: rawKr,
                price: parsePrice(rawPrice),
                lastUpdate: new Date().toISOString()
            };
        });
    });



    // 將結果寫入檔案
    fs.writeFileSync('./data/prices.json', JSON.stringify(items, null, 2));

    await browser.close();
    console.log("執行完畢");
})();