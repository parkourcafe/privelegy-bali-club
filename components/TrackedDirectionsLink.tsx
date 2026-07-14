"use client";

import type { ReactNode } from "react";

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
  children = "Open in Google Maps",
}: {
  href: string;
  venueSlug: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => logDirectionClick(venueSlug)}
      className={className}
    >
      {children}
    </a>
  );
}
