import type { MetadataRoute } from "next";
import { getRoutes, getDistrictHubs, getIntentSpokes, getPublishedVenues } from "@/lib/data";
import { isVenueIndexable } from "@/lib/publication";
import { SCENARIOS } from "@/lib/scenarios";
import { GUIDES } from "@/lib/guides";
import { PILLARS } from "@/lib/pillars";
import { LIGHT_DISTRICT_SLUGS } from "@/lib/light-districts";
import { liveCollectionSlugs } from "@/lib/collections";

// Regenerate hourly (ISR) rather than on every crawler hit: the sitemap runs
// several Supabase reads, and a per-request rebuild is needless load on a hot
// endpoint. Newly published venues/districts still appear within the hour.
export const revalidate = 3600;

const BASE = "https://www.otherbali.com";

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
    // Venue self-submission intake ("add your place") — owners search for this.
    { url: `${BASE}/for-venues`, changeFrequency: "monthly", priority: 0.5 },
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
    // Guides hub + the long-form editorial guides (top-of-funnel SEO/AEO).
    { url: `${BASE}/guides`, changeFrequency: "weekly", priority: 0.8 },
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
    // registered there too. These are stable editorial pages and are ALWAYS
    // emitted — they must never drop out of the sitemap because a venue-set
    // completeness check drifted (the flagship /uluwatu tree was previously
    // gated on that and could silently vanish).
    ...PILLARS.flatMap((p) => [
      { url: `${BASE}/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.9 },
      ...p.children.map((c) => ({
        url: `${BASE}${c.path}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ]),
    // Lightweight editorial landings for Bali's quiet corners (Sidemen, Amed,
    // Munduk, Lovina). Hand-crafted planning_only pages — always emitted; they
    // carry no venue set to gate on.
    ...LIGHT_DISTRICT_SLUGS.map((slug) => ({
      url: `${BASE}/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Taste Collections — cuisine hub + the collections currently past the
    // publication gate. Held collections are omitted (they 404 until live).
    { url: `${BASE}/collections`, changeFrequency: "weekly" as const, priority: 0.8 },
    ...(await liveCollectionSlugs()).map((slug) => ({
      url: `${BASE}/collections/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Venue detail pages — ONLY those that passed the evidence-backed
    // publication gate (review/incomplete venues stay noindex + unlisted).
    ...indexableVenueSlugs.map((slug) => ({
      url: `${BASE}/places/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
