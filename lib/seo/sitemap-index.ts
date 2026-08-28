export const SITEMAP_SECTIONS = [
  "content",
  "guides",
  "routes",
  "places",
  "collections",
  "offers",
] as const;

export type SitemapSection = (typeof SITEMAP_SECTIONS)[number];

export function isSitemapSection(value: string): value is SitemapSection {
  return (SITEMAP_SECTIONS as readonly string[]).includes(value);
}

export function sitemapIndexXml(origin: string): string {
  const base = origin.replace(/\/+$/, "");
  const entries = SITEMAP_SECTIONS
    .map((section) => `<sitemap><loc>${base}/sitemap/${section}</loc></sitemap>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}
