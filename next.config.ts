import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Canonical host is the bare apex otherbali.com. Everything in the app
      // (metadataBase, canonicals, sitemap, robots) emits non-www, so send the
      // www duplicate there with a 301/308 — one host for Search Console and to
      // avoid duplicate-host indexing. Path and query are preserved.
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.otherbali.com" }],
        destination: "https://otherbali.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
