import { sitemapIndexXml } from "@/lib/seo/sitemap-index";
import { CANONICAL_SITE_ORIGIN } from "@/lib/site-origin-policy";

export const revalidate = 3600;

export function GET() {
  return new Response(sitemapIndexXml(CANONICAL_SITE_ORIGIN), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
