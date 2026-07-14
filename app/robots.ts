import type { MetadataRoute } from "next";

// Tourist surfaces are indexable; operational surfaces are not.
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/partner/", "/onboard/", "/api/", "/me", "/v/", "/list/"],
      },
    ],
    sitemap: "https://www.otherbali.com/sitemap.xml",
  };
}
