import type { MetadataRoute } from "next";

// Tourist surfaces are indexable; operational surfaces are not.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/partner/", "/onboard/", "/api/", "/me", "/v/"],
      },
    ],
    sitemap: "https://otherbali.com/sitemap.xml",
  };
}
