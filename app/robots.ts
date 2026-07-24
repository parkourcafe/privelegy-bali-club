import type { MetadataRoute } from "next";

// Tourist surfaces are indexable; operational surfaces are not. Redemption
// pages carry an explicit noindex directive and must remain crawlable so search
// engines can read it. Blocking /v/ here would strand legacy URLs in search.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/partner/", "/onboard/", "/api/", "/me", "/list/", "/review"],
      },
    ],
    sitemap: "https://www.otherbali.com/sitemap.xml",
  };
}
