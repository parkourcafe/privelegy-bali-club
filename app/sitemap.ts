import type { MetadataRoute } from "next";
import { getRoutes, getDistrictHubs } from "@/lib/data";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [routes, hubs] = await Promise.all([getRoutes(), getDistrictHubs()]);
  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    // The working tool lives at /plan (landing funnels into it).
    { url: `${BASE}/plan`, changeFrequency: "daily", priority: 0.9 },
    // SEO hub index + per-district hubs — the island-wide ranking surface.
    { url: `${BASE}/bali`, changeFrequency: "weekly", priority: 0.9 },
    ...hubs.map((h) => ({
      url: `${BASE}/bali/${h.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })),
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
