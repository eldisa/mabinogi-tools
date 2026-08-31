// spider/mergeDungeonItems.js
// 合併多份 dungeon-items JSON（例如布本 + 雪本），推送前用這支先合併成一份。
// PUT /internal/prices/dungeon-items 是整包覆蓋，分開推的話後推的會蓋掉前面的，
// 所以要推送前務必先合併。
//
// 用法：
//   node spider/mergeDungeonItems.js data/prices-brie-lech.json data/prices-snow.json > data/prices.json
import fs from 'fs';

const files = process.argv.slice(2);
if (files.length < 2) {
    console.error('用法: node spider/mergeDungeonItems.js <file1.json> <file2.json> [...]');
    process.exit(1);
}

const merged = files.flatMap((f) => JSON.parse(fs.readFileSync(f, 'utf-8')));
console.log(JSON.stringify(merged, null, 2));
