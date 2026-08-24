"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";

// Renders the shared footer for every public route from the root layout.
//
// Before this, each page opted in by rendering <GuideFooter />, and ~38 routes
// never did -- including every /places/[slug] venue page (the site's largest
// indexable family) and the /bali/* hubs, which therefore emitted almost no
// outbound internal links (2026-08-24 audit). Owning it in the layout makes
// that structural rather than per-page.
//
// Client component only to read the pathname: the tone follows the surface
// (the dark homepage keeps its dark footer), and operational surfaces -- admin,
// partner, owner onboarding, QR redemption -- render no marketing footer at
// all. It is still server-rendered into the HTML, so the links are crawlable.
const NO_FOOTER_PREFIXES = ["/admin", "/partner", "/onboard", "/v/", "/auth", "/dev/", "/review"];

export default function GlobalFooter() {
  const pathname = usePathname() ?? "/";
  if (NO_FOOTER_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix))) {
    return null;
  }
  return <SiteFooter tone={pathname === "/" ? "dark" : "light"} />;
}
