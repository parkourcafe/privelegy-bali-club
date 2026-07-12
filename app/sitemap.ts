import type { MetadataRoute } from "next";
import { getRoutes } from "@/lib/data";

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
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
