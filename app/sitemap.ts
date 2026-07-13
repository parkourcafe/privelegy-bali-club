import type { MetadataRoute } from "next";
import { getRoutes, getDistrictHubs, getIntentSpokes } from "@/lib/data";
import { indexableVenueSlugs } from "@/lib/publication";
import { SCENARIOS } from "@/lib/scenarios";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [routes, hubs, spokes] = await Promise.all([
    getRoutes(),
    getDistrictHubs(),
    getIntentSpokes(),
  ]);
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
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Canggu district product: pillar + editorial children (active_deep).
    { url: `${BASE}/canggu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/canggu/best-restaurants`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/canggu/work-friendly-cafes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/canggu/best-spas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/canggu/beach-clubs-sunset`, changeFrequency: "weekly", priority: 0.8 },
    // Ubud district product: pillar + editorial children (planning / next_deep).
    { url: `${BASE}/ubud`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/ubud/best-restaurants`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ubud/best-cafes-coffee`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ubud/best-yoga-wellness`, changeFrequency: "weekly", priority: 0.8 },
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
