// spider/pushPrices.js
// 把爬蟲結果推送到後端 ingest 端點。未設定 INGEST_TOKEN 時直接略過（本機開發只寫本地 JSON）。
export async function pushPrices(path, data) {
    const token = process.env.INGEST_TOKEN;
    if (!token) {
        console.log('INGEST_TOKEN 未設定，略過推送到後端（僅保留本機 JSON）');
        return;
    }

    const base = process.env.PRICE_API_BASE || 'https://api.eldisa.tw';
    const res = await fetch(`${base}${path}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(`推送失敗 ${path}: HTTP ${res.status} ${res.statusText}`);
    }

    console.log(`已推送至後端 ${base}${path}`);
}
