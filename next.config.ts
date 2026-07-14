import type { NextConfig } from "next";

// Baseline security headers (audit 2026-07, P1). These are the headers that are
// safe to apply globally without breaking third-party origins the app depends on
// (GA4, Supabase, Google Fonts via next/font, Google Maps deep links).
//
// NOTE: a full Content-Security-Policy is deliberately NOT set here yet — a
// strict CSP needs an allowlist verified against the live GA/Supabase/Maps
// origins and Next's inline runtime, and shipping an over-strict policy blind
// would break the site. Tracked as a follow-up in docs/audit-2026-07.md.
const securityHeaders = [
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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
