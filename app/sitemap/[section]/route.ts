import { buildSectionSitemap } from "@/lib/seo/sitemap-data";
import { isSitemapSection } from "@/lib/seo/sitemap-index";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function sitemapXml(entries: Awaited<ReturnType<typeof buildSectionSitemap>>): string {
  const rows = entries.map((entry) => {
    const lastModified = entry.lastModified
      ? `<lastmod>${escapeXml(typeof entry.lastModified === "string" ? entry.lastModified : entry.lastModified.toISOString())}</lastmod>`
      : "";
    const changeFrequency = entry.changeFrequency
      ? `<changefreq>${entry.changeFrequency}</changefreq>`
      : "";
    const priority = entry.priority === undefined ? "" : `<priority>${entry.priority}</priority>`;
    return `<url><loc>${escapeXml(entry.url)}</loc>${lastModified}${changeFrequency}${priority}</url>`;
  }).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${rows}</urlset>`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ section: string }> },
) {
  const { section } = await params;
  if (!isSitemapSection(section)) return new Response("Not Found", { status: 404 });
  return new Response(sitemapXml(await buildSectionSitemap(section)), {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
