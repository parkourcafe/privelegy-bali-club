import type { MetadataRoute } from "next";
import { getRoutes, getDistrictHubs, getIntentSpokes, getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { SCENARIOS } from "@/lib/scenarios";
import { GUIDES } from "@/lib/guides";
import { PILLARS } from "@/lib/pillars";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [routes, hubs, spokes, catalogue] = await Promise.all([
    getRoutes(),
    getDistrictHubs(),
    getIntentSpokes(),
    getPublishedVenues(),
  ]);
  // Every venue whose detail page is indexable (publication bar), all districts.
  const indexableVenueSlugs = catalogue.filter(isVenueIndexable).map((v) => v.slug);
  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    // The working tool lives at /plan (landing funnels into it).
    { url: `${BASE}/plan`, changeFrequency: "daily", priority: 0.9 },
    // Bali-wide curated places catalogue.
    { url: `${BASE}/places`, changeFrequency: "daily", priority: 0.8 },
    // SEO hub index + per-district hubs — the programmatic ranking surface for
    // districts without a hand-crafted pillar (Uluwatu is excluded — it has its
    // own /uluwatu pillar below).
    { url: `${BASE}/bali`, changeFrequency: "weekly", priority: 0.9 },
    ...hubs.map((h) => ({
      url: `${BASE}/bali/${h.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // Intent spokes — the long-tail engine ("best {intent} in {district}").
    ...spokes.map((s) => ({
      url: `${BASE}/bali/${s.district}/${s.intent.urlSlug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Trip-mission scenario landing pages (§6a.3).
    ...SCENARIOS.map((s) => ({
      url: `${BASE}/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    // Long-form editorial guides (top-of-funnel SEO/AEO articles).
    ...GUIDES.map((g) => ({
      url: `${BASE}/${g.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // District pillars + their editorial children (driven by lib/pillars.ts so
    // the sitemap can't drift from the actual pages). The Ubud wellness guide is
    // registered there too.
    ...PILLARS.flatMap((p) => [
      { url: `${BASE}/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 },
      ...p.children.map((c) => ({
        url: `${BASE}${c.path}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ]),
    // Venue detail pages — ONLY those that passed the evidence-backed
    // publication gate (review/incomplete venues stay noindex + unlisted).
    ...indexableVenueSlugs.map((slug) => ({
      url: `${BASE}/places/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
