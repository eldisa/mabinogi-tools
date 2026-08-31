// spider/pushFromFile.js
// 把手動用 console-*.js 抓好、存成本機 JSON 檔的資料推送到後端。
//
// 用法：
//   INGEST_TOKEN=xxx node spider/pushFromFile.js dungeon-items ./data/prices.json
//   INGEST_TOKEN=xxx node spider/pushFromFile.js murias-relic ./data/murias-relic-prices.json
import fs from 'fs';
import { pushPrices } from './pushPrices.js';

const TARGETS = {
    'dungeon-items': '/internal/prices/dungeon-items',
    'murias-relic': '/internal/prices/murias-relic',
};

const [, , target, filePath] = process.argv;

if (!target || !filePath || !TARGETS[target]) {
    console.error('用法: node spider/pushFromFile.js <dungeon-items|murias-relic> <json 檔案路徑>');
    process.exit(1);
}

if (!process.env.INGEST_TOKEN) {
    console.error('請設定 INGEST_TOKEN 環境變數');
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
console.log(`讀到 ${Array.isArray(data) ? data.length : '?'} 筆資料，推送到 ${TARGETS[target]}...`);

await pushPrices(TARGETS[target], data);
