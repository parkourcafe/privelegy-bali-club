import type { MetadataRoute } from "next";
import { getRoutes } from "@/lib/data";
import { indexableVenueSlugs } from "@/lib/publication";
import { SCENARIOS } from "@/lib/scenarios";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRoutes();
  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    // The working tool lives at /plan (landing funnels into it).
    { url: `${BASE}/plan`, changeFrequency: "daily", priority: 0.9 },
    // Bali-wide curated places catalogue.
    { url: `${BASE}/places`, changeFrequency: "daily", priority: 0.8 },
    // Trip-mission scenario landing pages (§6a.3).
    ...SCENARIOS.map((s) => ({
      url: `${BASE}/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Uluwatu district product: pillar + editorial children.
    { url: `${BASE}/uluwatu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/uluwatu/best-restaurants`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/uluwatu/best-brunch`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/uluwatu/beach-clubs-sunset`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/uluwatu/date-night-restaurants`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/uluwatu/48-hours`, changeFrequency: "weekly", priority: 0.8 },
    // Venue detail pages — ONLY those that passed the evidence-backed
    // publication gate (review/incomplete venues stay noindex + unlisted).
    ...indexableVenueSlugs().map((slug) => ({
      url: `${BASE}/places/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
