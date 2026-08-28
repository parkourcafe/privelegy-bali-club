import assert from "node:assert/strict";
import test from "node:test";
import { SITEMAP_SECTIONS, sitemapIndexXml } from "./sitemap-index";

test("sitemap index exposes stable section URLs without pretending they are pages", () => {
  assert.deepEqual(SITEMAP_SECTIONS, [
    "content",
    "guides",
    "routes",
    "places",
    "collections",
    "offers",
  ]);
  const xml = sitemapIndexXml("https://www.otherbali.com");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<sitemapindex xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
  for (const section of SITEMAP_SECTIONS) {
    assert.match(xml, new RegExp(`<loc>https://www\\.otherbali\\.com/sitemap/${section}</loc>`));
  }
  assert.doesNotMatch(xml, /<urlset/);
});
