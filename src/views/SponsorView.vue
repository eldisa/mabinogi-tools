<script setup lang="ts">
const baseUrl = import.meta.env.BASE_URL;

// ⚠ 待放入：把 banner 圖存到 public/sponsor-banner.png
const bannerSrc = `${baseUrl}sponsor-banner.png`;

// 歐付寶會員編號（歐付寶審核用）
const ecpayMemberId = "2515326";
// 歐付寶贊助連結與 QR
const donateUrl = "https://qr.opay.tw/wL8KF";
const qrSrc = `${baseUrl}opay-qrcode.png`;
</script>

<template>
    <div class="sponsor">
        <img :src="bannerSrc" alt="感謝贊助 — Mabinogi Tools" class="banner" />

        <div class="content">
            <section class="section">
                <h2>支持這個專案</h2>
                <p>
                    Mabinogi Tools 是一個免費、無廣告、由個人持續開發維護的瑪奇工具集合。
                    您的贊助能幫助網站持續維運、更新資料與新增功能。無論金額多寡，都由衷感謝 💙
                </p>
            </section>

            <section class="section">
                <h2>歐付寶贊助</h2>
                <div class="donate-box">
                    <a :href="donateUrl" target="_blank" rel="noopener noreferrer" class="qr-link">
                        <img :src="qrSrc" alt="歐付寶贊助 QR Code" class="qr" />
                    </a>
                    <div class="donate-info">
                        <a :href="donateUrl" target="_blank" rel="noopener noreferrer" class="donate-btn">
                            💙 前往歐付寶贊助
                        </a>
                        <p class="member-line">
                            歐付寶會員編號：
                            <strong class="member-id">{{ ecpayMemberId }}</strong>
                        </p>
                        <p class="note">掃描 QR 或點按鈕即可前往歐付寶贊助頁面。</p>
                    </div>
                </div>
            </section>

            <section class="section">
                <h2>其他聯絡方式</h2>
                <ul class="contact-list">
                    <li><strong>遊戲伺服器：</strong>娜歐</li>
                    <li><strong>角色 ID：</strong>楓羽戀情</li>
                    <li>
                        <strong>GitHub：</strong>
                        <a href="https://github.com/eldisa" target="_blank" rel="noopener noreferrer">eldisa</a>
                    </li>
                    <li><strong>Discord：</strong>eldisa</li>
                </ul>
            </section>

            <div class="thank-you">
                <p>感謝您的支持，讓網站持續成長與進步！</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sponsor {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
}

.banner {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 16px;
    margin-bottom: 2rem;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.content {
    background: var(--color-surface, #1f2937);
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid var(--color-border, #374151);
}

.section {
    margin-bottom: 2rem;
}
.section:last-child {
    margin-bottom: 0;
}

h2 {
    font-size: 1.25rem;
    color: var(--color-gold-400, #fbbf24);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border, #374151);
}

p {
    line-height: 1.8;
    color: var(--color-text-secondary, #d1d5db);
    margin-bottom: 1rem;
}
p:last-child {
    margin-bottom: 0;
}

.donate-box {
    display: flex;
    gap: 1.5rem;
    align-items: center;
    flex-wrap: wrap;
}
.qr-link {
    flex-shrink: 0;
    line-height: 0;
}
.qr {
    width: 160px;
    height: 160px;
    border-radius: 10px;
    background: #fff;
    padding: 8px;
}
.donate-info {
    flex: 1;
    min-width: 220px;
}
.donate-btn {
    display: inline-block;
    padding: 0.6rem 1.4rem;
    border-radius: 9999px;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: #fff;
    font-weight: 600;
    text-decoration: none;
    transition: filter 0.2s, transform 0.2s;
}
.donate-btn:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
}

.member-line {
    font-size: 1.05rem;
    margin-top: 1rem;
}
.member-id {
    color: var(--color-text-primary, #f9fafb);
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.05em;
    user-select: all;
}
.note {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #9ca3af);
}

.contact-list {
    list-style: none;
    padding: 0;
    margin: 0;
}
.contact-list li {
    padding: 0.5rem 0;
    color: var(--color-text-secondary, #d1d5db);
}
.contact-list strong {
    color: var(--color-text-primary, #f9fafb);
}
.contact-list a {
    color: var(--color-gold-400, #fbbf24);
    text-decoration: none;
    transition: color 0.2s;
}
.contact-list a:hover {
    color: var(--color-gold-300, #fcd34d);
    text-decoration: underline;
}

.thank-you {
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--color-border, #374151);
    text-align: center;
}
.thank-you p {
    font-size: 1.1rem;
    color: var(--color-text-primary, #f9fafb);
    font-weight: 500;
}

@media (max-width: 768px) {
    .sponsor {
        padding: 1rem;
    }
    .content {
        padding: 1.5rem;
    }
    .banner {
        border-radius: 10px;
        margin-bottom: 1.5rem;
    }
}
</style>
