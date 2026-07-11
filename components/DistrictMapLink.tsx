"use client";

import type { ReactNode } from "react";

// Growth-side planning signal (§18): which areas travellers actually explore.
// district_open is a growth metric only — it never enters partner-proof.
function logDistrictOpen(districtSlug: string) {
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "district_open", venueSlug: districtSlug }),
    keepalive: true,
  }).catch(() => {});
}

export default function DistrictMapLink({
  href,
  districtSlug,
  className,
  children,
}: {
  href: string;
  districtSlug: string;
  className?: string;
  children: ReactNode;
}) {
  // External map links open a new tab; in-site links (/places?district=…)
  // navigate normally so the traveller stays in the product.
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={() => logDistrictOpen(districtSlug)}
      className={className}
    >
      {children}
    </a>
  );
}
