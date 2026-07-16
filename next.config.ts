import type { NextConfig } from "next";

// Content-Security-Policy (audit 2026-07, P1). Allowlist derived from the
// origins the browser actually touches:
//   - scripts/styles: self + Next's inline bootstrap ('unsafe-inline'; the app
//     has no nonce pipeline). googletagmanager is pre-allowed so re-enabling GA
//     later needs no CSP change — it stays dormant while GA is off.
//   - connect: self (/api) + the browser Supabase client (*.supabase.co) +
//     dormant GA. No other external client calls exist (no iframes; fonts, hero
//     video and scenes are self-hosted via next/font + public/).
//   - img: open over https (venue photos may come from external CDNs) + data:.
//
// SHIPPED AS REPORT-ONLY: browsers never block on this header, so it cannot
// break the site — it only reports violations (to /api/csp-report and the
// devtools console). Once the logs are clean, enforce by renaming the header
// key to "Content-Security-Policy". See docs/audit-2026-07.md.
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://*.supabase.co https://*.google-analytics.com https://region1.google-analytics.com",
  "worker-src 'self'",
  "manifest-src 'self'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
  "report-uri /api/csp-report",
].join("; ");

// Baseline security headers (audit 2026-07, P1). Safe to apply globally.
const securityHeaders = [
  { key: "Content-Security-Policy-Report-Only", value: cspDirectives },
  // Clickjacking protection. frame-ancestors 'none' is the modern equivalent;
  // X-Frame-Options covers older UAs.
  { key: "X-Frame-Options", value: "DENY" },
  // Stop MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send origin only on cross-origin navigation; full URL same-origin.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny powerful features by default; the tourist product uses none of these
  // in-page (Maps opens externally, no in-app camera/mic).
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version.
  poweredByHeader: false,
  // Keep Turbopack scoped to this checkout even when a developer has another
  // package-lock.json higher in the home directory.
  turbopack: { root: process.cwd() },
  images: {
    formats: ["image/avif", "image/webp"],
    // Optimized-image responses are content-addressed (the `url` + params are
    // the cache key), so a long TTL is safe and cuts repeat-visit bytes — the
    // PageSpeed "efficient cache lifetime" flag. 30 days.
    minimumCacheTTL: 2592000,
    qualities: [70, 78],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/render/image/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/scenes/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/covers/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
