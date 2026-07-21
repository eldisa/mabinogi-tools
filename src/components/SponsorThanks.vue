<script setup lang="ts">
import { computed } from "vue";
import sponsors, { type Sponsor } from "../data/sponsors";

type SponsorLink = {
    label: string;
    href: string;
    className?: string;
};

const baseUrl = import.meta.env.BASE_URL;

const visibleSponsors = computed(() =>
    [...sponsors]
        .filter((sponsor) => sponsor.visible !== false)
        .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER)),
);

const featuredSponsors = computed(() => visibleSponsors.value.filter((sponsor) => sponsor.type === "featured"));
const supporterSponsors = computed(() => visibleSponsors.value.filter((sponsor) => sponsor.type === "supporter"));
const hasSponsors = computed(() => visibleSponsors.value.length > 0);

const getSponsorName = (sponsor: Sponsor) => {
    if (sponsor.anonymous || sponsor.isAnonymous) {
        return "匿名贊助者";
    }

    return sponsor.name;
};

const getInitial = (sponsor: Sponsor) => getSponsorName(sponsor).trim().charAt(0).toUpperCase() || "S";

const getAvatarSrc = (avatar: string) => {
    if (/^(https?:)?\/\//.test(avatar) || avatar.startsWith("data:") || avatar.startsWith("blob:")) {
        return avatar;
    }

    return `${baseUrl}${avatar.replace(/^\/+/, "")}`;
};

const getSponsorLinks = (sponsor: Sponsor): SponsorLink[] =>
    [
        sponsor.donateUrl
            ? {
                  label: "❤️ Support Them",
                  href: sponsor.donateUrl,
                  className: "primary",
              }
            : undefined,
        sponsor.website
            ? {
                  label: "🌐 Website",
                  href: sponsor.website,
              }
            : undefined,
        sponsor.github
            ? {
                  label: "GitHub",
                  href: sponsor.github,
              }
            : undefined,
        sponsor.discord
            ? {
                  label: "Discord",
                  href: sponsor.discord,
              }
            : undefined,
    ].filter((link): link is SponsorLink => Boolean(link));
</script>

<template>
    <section v-if="hasSponsors" class="section sponsor-thanks" aria-labelledby="sponsor-thanks-title">
        <h2 id="sponsor-thanks-title">🌟 特別感謝</h2>

        <div v-if="featuredSponsors.length" class="thanks-group">
            <h3>Featured Supporters</h3>
            <div class="featured-grid">
                <article v-for="sponsor in featuredSponsors" :key="sponsor.id" class="thanks-card featured-card">
                    <img
                        v-if="sponsor.avatar"
                        :src="getAvatarSrc(sponsor.avatar)"
                        :alt="getSponsorName(sponsor)"
                        class="featured-avatar"
                    />
                    <div v-else class="featured-avatar avatar-fallback" aria-hidden="true">
                        {{ getInitial(sponsor) }}
                    </div>

                    <div class="featured-content">
                        <p v-if="sponsor.role" class="sponsor-role">{{ sponsor.role }}</p>
                        <h4>{{ getSponsorName(sponsor) }}</h4>
                        <p v-if="sponsor.description" class="sponsor-description">
                            {{ sponsor.description }}
                        </p>
                    </div>

                    <div v-if="getSponsorLinks(sponsor).length" class="sponsor-actions">
                        <a
                            v-for="link in getSponsorLinks(sponsor)"
                            :key="link.label"
                            :href="link.href"
                            :class="['sponsor-link', link.className]"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {{ link.label }}
                        </a>
                    </div>
                </article>
            </div>
        </div>

        <div v-if="supporterSponsors.length" class="thanks-group">
            <h3>Supporters</h3>
            <div class="supporter-grid">
                <article v-for="sponsor in supporterSponsors" :key="sponsor.id" class="thanks-card supporter-card">
                    <img
                        v-if="sponsor.avatar"
                        :src="getAvatarSrc(sponsor.avatar)"
                        :alt="getSponsorName(sponsor)"
                        class="supporter-avatar"
                    />
                    <div v-else class="supporter-avatar avatar-fallback" aria-hidden="true">
                        {{ getInitial(sponsor) }}
                    </div>
                    <div class="supporter-info">
                        <h4>{{ getSponsorName(sponsor) }}</h4>
                        <p v-if="sponsor.role">{{ sponsor.role }}</p>
                    </div>
                </article>
            </div>
        </div>
    </section>
</template>

<style scoped>
.sponsor-thanks {
    padding-top: 2rem;
    border-top: 1px solid var(--color-border-primary, #374151);
}

.thanks-group + .thanks-group {
    margin-top: 1.75rem;
}

h3 {
    margin: 0 0 1rem;
    color: var(--color-text-primary, #f9fafb);
    font-size: 1rem;
    font-weight: 700;
}

h4 {
    margin: 0;
    color: var(--color-text-primary, #f9fafb);
    font-size: 1.05rem;
    line-height: 1.35;
}

.featured-grid,
.supporter-grid {
    display: grid;
    gap: 1rem;
}

.featured-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.supporter-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
}

.thanks-card {
    border: 1px solid var(--color-border-primary, #374151);
    border-radius: 16px;
    background:
        linear-gradient(180deg, rgb(255 255 255 / 0.035), rgb(255 255 255 / 0.01)),
        var(--color-bg-secondary, #1f2937);
    box-shadow: 0 8px 24px rgb(0 0 0 / 0.18);
    transition:
        box-shadow 200ms ease,
        transform 200ms ease,
        border-color 200ms ease;
}

.thanks-card:hover {
    border-color: rgb(251 191 36 / 0.38);
    box-shadow: 0 14px 30px rgb(0 0 0 / 0.28);
    transform: translateY(-2px);
}

.featured-card {
    display: flex;
    min-height: 100%;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
}

.featured-avatar,
.supporter-avatar {
    display: grid;
    flex: 0 0 auto;
    place-items: center;
    overflow: hidden;
    border: 1px solid rgb(251 191 36 / 0.28);
    border-radius: 9999px;
    background: linear-gradient(135deg, #3b82f6, #fbbf24);
    color: #ffffff;
    font-weight: 800;
    object-fit: cover;
    box-shadow: 0 0 0 3px rgb(251 191 36 / 0.08);
}

.featured-avatar {
    width: 72px;
    height: 72px;
    margin-bottom: 1rem;
    font-size: 1.6rem;
}

.supporter-avatar {
    width: 44px;
    height: 44px;
    font-size: 1rem;
}

.featured-content {
    flex: 1;
}

.sponsor-role {
    margin: 0 0 0.35rem;
    color: var(--color-accent-primary, #fbbf24);
    font-size: 0.78rem;
    font-weight: 700;
    line-height: 1.3;
}

.sponsor-description {
    margin: 0.55rem 0 0;
    color: var(--color-text-secondary, #d1d5db);
    font-size: 0.95rem;
    line-height: 1.7;
    white-space: pre-line;
}

.sponsor-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
}

.sponsor-link {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 0.45rem 0.85rem;
    border: 1px solid var(--color-border-secondary, #4b5563);
    border-radius: 9999px;
    background: rgb(17 24 39 / 0.55);
    color: var(--color-text-secondary, #e5e7eb);
    font-size: 0.85rem;
    font-weight: 700;
    line-height: 1.2;
    text-decoration: none;
    transition:
        background-color 200ms ease,
        border-color 200ms ease,
        color 200ms ease,
        opacity 200ms ease;
}

.sponsor-link:hover {
    border-color: rgb(251 191 36 / 0.55);
    background: rgb(251 191 36 / 0.12);
    color: var(--color-accent-hover, #fcd34d);
    opacity: 0.9;
}

.sponsor-link.primary {
    border-color: transparent;
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: #ffffff;
}

.sponsor-link.primary:hover {
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: #ffffff;
}

.supporter-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
    padding: 0.9rem;
}

.supporter-info {
    min-width: 0;
}

.supporter-info h4 {
    overflow: hidden;
    color: var(--color-text-primary, #f9fafb);
    font-size: 0.95rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.supporter-info p {
    margin: 0.2rem 0 0;
    color: var(--color-text-muted, #9ca3af);
    font-size: 0.8rem;
    line-height: 1.4;
}

@media (max-width: 900px) {
    .supporter-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .featured-grid,
    .supporter-grid {
        grid-template-columns: 1fr;
    }

    .featured-card {
        padding: 1rem;
    }
}
</style>
