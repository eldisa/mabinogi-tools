// spider/console-murias-relic.js
//
// 手動抓穆利亞斯遺物價格用。因為 mabi.labanyu.com 現在擋 headless 爬蟲（Cloudflare 驗證），
// 這支改成「你自己用瀏覽器手動開頁面、通過驗證後」，貼到 DevTools console 執行的版本。
// 邏輯跟 spider/scraper-murias-relic.js 完全一樣，只是把 Playwright 的部分拿掉，
// 直接在頁面環境裡跑。
//
// 用法：
// 1. 瀏覽器開 https://mabi.labanyu.com/dungeon/brie-lech/murias-relic，正常操作通過驗證、等頁面load完
// 2. F12 開 DevTools → Console
// 3. 貼上這整份程式碼，Enter
// 4. 結果會自動印出表格預覽，並觸發下載 murias-relic-prices.json（用 Blob，不依賴瀏覽器專屬的 copy()）
// 5. 把下載的檔案移到 data/ 資料夾，或直接貼給推送用的腳本

(async () => {
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

    // 從 GitHub 上的 skillNames.ts 讀韓/繁中對照（瀏覽器環境沒辦法讀本機檔案，改用 fetch）
    const loadSkillList = async () => {
        const res = await fetch(
            'https://raw.githubusercontent.com/eldisa/mabinogi-tools/main/src/data/skillNames.ts',
        );
        const raw = await res.text();
        const skills = [];
        const entryRe = /id:\s*(\d+),\s*name:\s*\{([^}]*)\}/g;
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
    };

    const matchSkill = (rawName, skillList) => skillList.find((s) => rawName.startsWith(s.kr)) || null;

    const skillList = await loadSkillList();

    // 純粹的 DOM 抓取，跟 scraper-murias-relic.js 裡 page.evaluate 的內容一致
    const rawArcanas = Array.from(document.querySelectorAll('.mb-2')).map((box) => {
        const h2Text = box.querySelector('h2')?.innerText || '';
        const [, jobKr, allLevel10PriceRaw] =
            h2Text.match(/^\s*(.+?)\s*\(All 10렙[:：]\s*([^)]+)\)/) || [];

        const options = Array.from(box.querySelectorAll('.row > div')).map((col) => {
            const rawName = (col.querySelector('.position-relative b')?.innerText || '').trim();
            const maxText = (col.querySelector('.position-relative small')?.innerText || '').trim();
            const levels = Array.from(col.querySelectorAll('table tbody tr')).map((tr) => {
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

    const finalResults = rawArcanas.map((arcana) => ({
        job: { kr: arcana.jobKr },
        allLevel10Price: parseKoreanPrice(arcana.allLevel10PriceRaw),
        options: arcana.options.map((opt) => {
            const skill = matchSkill(opt.rawName, skillList);
            return {
                skillId: skill?.id || null,
                name: { kr: opt.rawName, tw: skill?.tw || '未對應' },
                max: opt.maxText,
                levels: opt.levels.map((lv) => ({
                    level: lv.level,
                    count: lv.count,
                    price: parseKoreanPrice(lv.priceRaw),
                })),
            };
        }),
    }));

    console.table(
        finalResults.map((a) => ({
            職業: a.job.kr,
            滿10級總價: a.allLevel10Price.toLocaleString(),
            選項數: a.options.length,
        })),
    );

    const json = JSON.stringify(finalResults, null, 2);
    try {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'murias-relic-prices.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        console.log(`已觸發下載 murias-relic-prices.json，共 ${finalResults.length} 個職業資料，請移到 data/ 資料夾。`);
    } catch (e) {
        console.log('自動下載失敗，請手動複製下面這段 JSON：');
        console.log(json);
    }
})();
