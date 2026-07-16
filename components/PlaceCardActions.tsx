"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

export function TrackedPlaceLink({
  href,
  venueSlug,
  className,
  children,
}: {
  href: string;
  venueSlug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("venue_card_click", { venueSlug })}
    >
      {children}
    </Link>
  );
}

export function TrackedGuideLink({
  href,
  pageSlug,
  className,
  children,
}: {
  href: string;
  pageSlug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => track("internal_guide_click", { pageSlug })}
    >
      {children}
    </Link>
  );
}

export function TrackedDirectionLink({
  href,
  venueSlug,
  className,
  children,
}: {
  href: string;
  venueSlug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track("direction_click", { venueSlug })}
    >
      {children}
    </a>
  );
}

export function TrackedReservationLink({
  href,
  venueSlug,
  className,
  children,
}: {
  href: string;
  venueSlug: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => {
        fetch("/api/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "reservation_click", venueSlug }),
          keepalive: true,
        }).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
