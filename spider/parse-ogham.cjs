// 從 labanyu 韓服工具站符文頁的完整存檔 HTML（另存新檔）抽取 __NEXT_DATA__，
// 並與目前的 src/data/ogham.ts / src/data/skillNames.ts 交叉比對，列出需要人工翻譯/更新的差異。
// 用法：node spider/parse-ogham.js "<存檔 html 路徑>"
// 純報告，不會修改 ogham.ts —— 翻譯與資料合併仍需人工（或 LLM 輔助）比對後手動編輯。
const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const htmlPath = process.argv[2];
if (!htmlPath) {
    console.error("用法：node spider/parse-ogham.js <labanyu 符文頁存檔 html 路徑>");
    process.exit(1);
}

function extractNextData(htmlPath) {
    const html = fs.readFileSync(htmlPath, "utf8");
    const marker = 'id="__NEXT_DATA__"';
    const idx = html.indexOf(marker);
    if (idx === -1) throw new Error("找不到 __NEXT_DATA__，確認存的是符文頁 (labanyu.com/skill/ogham) 且為完整 HTML");
    const start = html.indexOf(">", idx) + 1;
    const end = html.indexOf("</script>", start);
    return JSON.parse(html.slice(start, end));
}

function parseTs(file) {
    const text = fs.readFileSync(file, "utf8");
    return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}
function getStringProp(objLit, name) {
    for (const p of objLit.properties) {
        if (ts.isPropertyAssignment(p) && p.name && p.name.getText() === name && ts.isStringLiteralLike(p.initializer)) {
            return p.initializer.text;
        }
    }
    return undefined;
}

// ---- kr -> tw 對照表（來自 skillNames.ts） ----
const skillSf = parseTs(path.join(root, "src/data/skillNames.ts"));
const krToTw = new Map();
(function walk(node) {
    if (ts.isObjectLiteralExpression(node)) {
        const nameProp = node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === "name");
        if (nameProp && ts.isObjectLiteralExpression(nameProp.initializer)) {
            const kr = getStringProp(nameProp.initializer, "kr");
            const tw = getStringProp(nameProp.initializer, "tw");
            if (kr) krToTw.set(kr, tw || "");
        }
    }
    ts.forEachChild(node, walk);
})(skillSf);

// ---- 目前 ogham.ts 的 combos + effectTable ----
const oghamSf = parseTs(path.join(root, "src/data/ogham.ts"));
let currentArcana = null;
const existingCombos = []; // {arcana, skillName, skillNameKo, pointsKo}
const existingRows = []; // {arcana, option, optionKo, base, skillName}
(function walk(node) {
    if (ts.isObjectLiteralExpression(node)) {
        const hasNameKo = node.properties.some((p) => ts.isPropertyAssignment(p) && p.name.getText() === "nameKo");
        const hasCombosKey = node.properties.some((p) => ts.isPropertyAssignment(p) && p.name.getText() === "combos");
        if (hasNameKo && hasCombosKey) currentArcana = getStringProp(node, "name");

        const hasSkillNameKo = node.properties.some((p) => ts.isPropertyAssignment(p) && p.name.getText() === "skillNameKo");
        const hasWords = node.properties.some((p) => ts.isPropertyAssignment(p) && p.name.getText() === "words");
        if (hasSkillNameKo && hasWords) {
            const pointsKoProp = node.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === "pointsKo");
            const pointsKo = {};
            if (pointsKoProp && ts.isObjectLiteralExpression(pointsKoProp.initializer)) {
                for (const p of pointsKoProp.initializer.properties) {
                    if (ts.isPropertyAssignment(p) && ts.isStringLiteralLike(p.initializer)) {
                        pointsKo[p.name.getText().replace(/['"]/g, "")] = p.initializer.text;
                    }
                }
            }
            existingCombos.push({ arcana: currentArcana, skillName: getStringProp(node, "skillName"), skillNameKo: getStringProp(node, "skillNameKo"), pointsKo });
        }

        const hasOptionKo = node.properties.some((p) => ts.isPropertyAssignment(p) && p.name.getText() === "optionKo");
        if (hasOptionKo) {
            existingRows.push({ arcana: currentArcana, option: getStringProp(node, "option"), optionKo: getStringProp(node, "optionKo"), base: getStringProp(node, "base"), skillName: getStringProp(node, "skillName") });
        }
    }
    ts.forEachChild(node, walk);
})(oghamSf);

// ---- 新資料 ----
const data = extractNextData(htmlPath);
const pp = data.props.pageProps;
console.log(`來源頁 oghamCombinations: ${pp.oghamCombinations.length} 筆，oghamWordOptions: ${pp.oghamWordOptions.length} 筆\n`);

console.log("=== 組合技（skillName / 效果文字）差異 ===");
for (const c of pp.oghamCombinations) {
    const existing = existingCombos.find((e) => e.skillNameKo === c.skill.name);
    if (!existing) {
        console.log(`[新組合] arcana=${c.arcana.name} skill=${c.skill.name} (id=${c.id}) —— ogham.ts 尚無此組合，需新增`);
        continue;
    }
    const official = krToTw.get(c.skill.name);
    if (official && official !== existing.skillName) {
        console.log(`[技能名不符] arcana=${existing.arcana} kr="${c.skill.name}" 目前="${existing.skillName}" 官方tw="${official}"`);
    }
    for (const lvl of [5, 6, 7, 8, 9]) {
        const oldText = existing.pointsKo[String(lvl)] || "";
        const newText = c.options["point" + lvl] || "";
        if (oldText !== newText) {
            console.log(`[內容變動] arcana=${existing.arcana} skill=${c.skill.name} point${lvl} 的韓文已變更，需重新翻譯`);
        }
    }
}

console.log("\n=== 詞條效果（effectTable）差異 ===");
for (const o of pp.oghamWordOptions) {
    const matches = existingRows.filter((r) => r.optionKo === o.name);
    if (matches.length === 0) {
        console.log(`[新詞條] krOption="${o.name}" skill="${o.skill?.name}" value=${o.value} arcanaNameId=${o.arcanaNameId} —— 需新增到對應祕法/主要才能表`);
        continue;
    }
    for (const m of matches) {
        const baseNum = parseFloat(m.base);
        if (!isNaN(baseNum) && Math.abs(baseNum - o.value) > 0.001) {
            console.log(`[數值不符] optionKo="${o.name}" arcana=${m.arcana} 目前base="${m.base}" 新value=${o.value}`);
        }
    }
}

console.log("\n=== 圖片素材 ===");
const localFiles = new Set(fs.readdirSync(path.join(root, "public/oghamImage")));
const needed = new Map();
for (const c of pp.oghamCombinations) {
    if (c.inGameImg) needed.set(c.inGameImg, `combo#${c.id} inGameImg`);
    if (c.skill?.thumbnail) needed.set(c.skill.thumbnail, `combo#${c.id} skillIcon`);
}
for (const o of pp.oghamWordOptions) {
    if (o.skill?.thumbnail) needed.set(o.skill.thumbnail, `wordOption#${o.id} skillIcon`);
}
for (const [url, desc] of needed) {
    const filename = url.split("/").pop();
    if (!localFiles.has(filename)) console.log(`[缺圖] ${desc} -> ${url}`);
}
console.log("\n完成。此工具只列差異，實際翻譯與寫入 ogham.ts 仍需人工／LLM 輔助逐條核對。");
