import type { MetadataRoute } from "next";
import { getRoutes } from "@/lib/data";

export const dynamic = "force-dynamic";

const BASE = "https://otherbali.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = await getRoutes();
  return [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    ...routes.map((r) => ({
      url: `${BASE}/route/${r.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
