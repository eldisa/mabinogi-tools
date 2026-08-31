// spider/console-dungeon-items.js
//
// 手動抓布里萊赫地城物品價格用。因為 mabi.labanyu.com 現在擋 headless 爬蟲（Cloudflare 驗證），
// 這支改成「你自己用瀏覽器手動開頁面、通過驗證後」，貼到 DevTools console 執行的版本。
// 邏輯跟 spider/scraper.js 完全一樣，只是把 Playwright 的部分拿掉，直接在頁面環境裡跑。
// itemDb / enchantDb 資料庫直接從 GitHub 上的 scraper.js 抓，避免手動複製一份容易對不齊。
//
// 用法：
// 1. 瀏覽器開 https://mabi.labanyu.com/dungeon/brie-lech，正常操作通過驗證、等頁面load完
// 2. F12 開 DevTools → Console
// 3. 把整份檔案內容貼進去，Enter
// 4. 結果會自動印出表格預覽，並觸發下載 prices.json（用 Blob，不依賴瀏覽器專屬的 copy()）
// 5. 把下載的 prices.json 移到 data/ 資料夾，或直接貼給推送腳本用

(async () => {
    // itemDb / enchantDb 跟著 scraper.js 走，用 fetch 抓最新版本，避免兩邊資料對不齊
    const res = await fetch('https://raw.githubusercontent.com/eldisa/mabinogi-tools/main/spider/scraper.js');
    const raw = await res.text();
    const itemDbMatch = raw.match(/const itemDb = (\[[\s\S]*?\n\]);/);
    const enchantDbMatch = raw.match(/const enchantDb = (\[[\s\S]*?\n\]);/);
    if (!itemDbMatch || !enchantDbMatch) {
        console.error('抓不到 itemDb / enchantDb，scraper.js 的格式可能改了');
        return;
    }
    const itemDb = new Function(`return ${itemDbMatch[1]}`)();
    const enchantDb = new Function(`return ${enchantDbMatch[1]}`)();

    const universalMap = new Map();
    itemDb.forEach((i) => universalMap.set(i.name.kr, { ...i, category: 'item' }));
    enchantDb.forEach((e) => universalMap.set(e.name.kr, { ...e, category: 'enchant' }));

    const parseKoreanPrice = (s) => {
        if (!s || s === '-') return 0;
        let clean = s.replace(/골드|,/g, '').trim();
        let total = 0;
        if (clean.includes('억')) {
            const p = clean.split('억');
            total += parseInt(p[0]) * 1e8;
            clean = p[1] || '';
        }
        if (clean.includes('만')) {
            const p = clean.split('만');
            total += parseInt(p[0]) * 1e4;
            clean = p[1] || '';
        }
        if (clean.trim()) total += parseInt(clean);
        return total;
    };

    const finalResults = Array.from(document.querySelectorAll('.item-card-box')).map((box) => {
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
                tw: match?.name?.tw || '未對應',
                kr: rawKr,
                en: match?.name?.en || '',
            },
            price: price,
            type: match?.category || 'unknown',
        };
    });

    console.table(
        finalResults
            .filter((item) => !item.name?.kr?.includes('특수한 옷본'))
            .map((item) => ({
                名稱: item.name.tw === '未對應' ? item.name.kr : item.name.tw,
                價格: item.price.toLocaleString(),
                類型: item.type,
            })),
    );

    const json = JSON.stringify(finalResults, null, 2);
    try {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'prices.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`已觸發下載 prices.json，共 ${finalResults.length} 筆資料，請移到 data/ 資料夾。`);
    } catch (e) {
        console.log('自動下載失敗，請手動複製下面這段 JSON：');
        console.log(json);
    }
})();
