"use client";

import type { ReactNode } from "react";
import { googleMapsHandoffLabel } from "@/lib/external-links";

function logDirectionClick(venueSlug: string) {
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "direction_click", venueSlug }),
    keepalive: true,
  }).catch(() => {});
}

export default function TrackedDirectionsLink({
  href,
  venueSlug,
  className,
  children,
}: {
  href: string;
  venueSlug: string;
  className?: string;
  children?: ReactNode;
}) {
  const label = children ?? googleMapsHandoffLabel(href) ?? "Open in Maps";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => logDirectionClick(venueSlug)}
      className={className}
    >
      {label}
    </a>
  );
}
