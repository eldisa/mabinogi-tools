import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pushPrices } from './pushPrices.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 從 skillNames.ts 讀取韓/繁中對照（純文字讀取，不需經過 TS 編譯）
function loadSkillList() {
    const raw = fs.readFileSync(path.join(__dirname, '../src/data/skillNames.ts'), 'utf-8');
    const skills = [];
    const entryRe = /id:\s*(\d+),\s*name:\s*\{([^}]*)\}/gs;
    let m;
    while ((m = entryRe.exec(raw))) {
        const krMatch = m[2].match(/kr:\s*"([^"]*)"/);
        const twMatch = m[2].match(/tw:\s*"([^"]*)"/);
        if (krMatch && twMatch) {
            skills.push({ id: Number(m[1]), kr: krMatch[1], tw: twMatch[1] });
        }
    }
    // 依韓文長度由長到短排序，方便用最長前綴比對出選項文字開頭的技能名稱
    return skills.sort((a, b) => b.kr.length - a.kr.length);
}

function matchSkill(rawName, skillList) {
    return skillList.find(s => rawName.startsWith(s.kr)) || null;
}

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

(async () => {
    const skillList = loadSkillList();

    const browser = await chromium.launch();
    const page = await browser.newPage();

    console.log('正在前往網頁...');
    await page.goto('https://mabi.labanyu.com/dungeon/brie-lech/murias-relic');
    await page.waitForSelector('.mb-2 table', { timeout: 60000 });

    // 只做純粹的 DOM 抓取，技能翻譯比對與價格換算留到瀏覽器外處理
    const rawArcanas = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.mb-2')).map(box => {
            const h2Text = box.querySelector('h2')?.innerText || '';
            const [, jobKr, allLevel10PriceRaw] =
                h2Text.match(/^\s*(.+?)\s*\(All 10렙[:：]\s*([^)]+)\)/) || [];

            const options = Array.from(box.querySelectorAll('.row > div')).map(col => {
                const rawName = (col.querySelector('.position-relative b')?.innerText || '').trim();
                const maxText = (col.querySelector('.position-relative small')?.innerText || '').trim();
                const levels = Array.from(col.querySelectorAll('table tbody tr')).map(tr => {
                    const tds = tr.querySelectorAll('td');
                    return {
                        level: parseInt(tr.querySelector('th')?.innerText || '0'),
                        count: parseInt(tds[0]?.innerText || '0'),
                        priceRaw: (tds[1]?.innerText || '-').trim(),
                    };
                });
                return { rawName, maxText, levels };
            });

            return { jobKr: (jobKr || '').trim(), allLevel10PriceRaw: allLevel10PriceRaw || '', options };
        });
    });

    await browser.close();

    const finalResults = rawArcanas.map(arcana => ({
        job: { kr: arcana.jobKr },
        allLevel10Price: parseKoreanPrice(arcana.allLevel10PriceRaw),
        options: arcana.options.map(opt => {
            const skill = matchSkill(opt.rawName, skillList);
            return {
                skillId: skill?.id || null,
                name: { kr: opt.rawName, tw: skill?.tw || "未對應" },
                max: opt.maxText,
                levels: opt.levels.map(lv => ({
                    level: lv.level,
                    count: lv.count,
                    price: parseKoreanPrice(lv.priceRaw),
                })),
            };
        }),
    }));

    console.table(finalResults.map(a => ({
        職業: a.job.kr,
        滿10級總價: a.allLevel10Price.toLocaleString(),
        選項數: a.options.length,
    })));

    const outputDir = './data';
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    fs.writeFileSync(`${outputDir}/murias-relic-prices.json`, JSON.stringify(finalResults, null, 2));

    console.log(`\n抓取完成，共 ${finalResults.length} 個職業資料已存至 ./data/murias-relic-prices.json`);

    await pushPrices('/internal/prices/murias-relic', finalResults);
})();
