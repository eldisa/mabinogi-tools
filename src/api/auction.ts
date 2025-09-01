// api/auction.ts
const API_BASE = "https://api.mabi.zip/auction/history";

export interface AuctionHistoryItem {
    // 先用寬鬆型別，拿到實際回傳再收斂
    [k: string]: any;
}

export interface AuctionHistoryResponse {
    // 依實際回傳調整
    data?: AuctionHistoryItem[];
    page?: number;
    totalPages?: number;
    [k: string]: any;
}

/** 取得單頁歷史紀錄 */
export async function fetchAuctionHistory(
    itemName: string,
    page = 1,
    signal?: AbortSignal
): Promise<AuctionHistoryResponse> {
    const q = encodeURIComponent(JSON.stringify({ itemName }));
    const url = `${API_BASE}?q=${q}&page=${page}`;

    const res = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
    });

    if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
    }

    return res.json();
}

/** 連抓多頁（直到沒有資料或到達 totalPages） */
export async function fetchAuctionHistoryAll(
    itemName: string,
    startPage = 1,
    maxPages = 50,
    signal?: AbortSignal
): Promise<AuctionHistoryItem[]> {
    const all: AuctionHistoryItem[] = [];
    let page = startPage;

    // 如果 API 有 totalPages 就用；不然就抓到空頁停止
    while (page < startPage + maxPages) {
        const json = await fetchAuctionHistory(itemName, page, signal);
        const list = (json?.data ?? json ?? []) as AuctionHistoryItem[];

        if (!Array.isArray(list) || list.length === 0) break;
        all.push(...list);

        // 若回傳內含 totalPages，優先依它停止
        if (typeof json.totalPages === "number" && typeof json.page === "number") {
            if (json.page >= json.totalPages) break;
        }

        page += 1;
    }

    return all;
}

/** 韓文金額字串轉數字（單位：골드）*/
export function parseKoreanGold(str: string): number {
    let s = (str || "").replace(/골드/g, "").trim();
    let total = 0;

    const eok = s.match(/(\d+)\s*억/);
    if (eok) {
        total += parseInt(eok[1], 10) * 100_000_000;
        s = s.replace(/(\d+)\s*억/, "");
    }

    const man = s.match(/(\d+)\s*만/);
    if (man) {
        total += parseInt(man[1], 10) * 10_000;
        s = s.replace(/(\d+)\s*만/, "");
    }

    const rest = s.replace(/[^\d]/g, "");
    if (rest) total += parseInt(rest, 10);

    return total;
}
