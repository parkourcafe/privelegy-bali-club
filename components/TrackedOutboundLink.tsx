"use client";

import type { ReactNode } from "react";
import { track, type TrackedEvent } from "@/lib/analytics";

// Outbound commercial CTA (brief §17/§21): verified official links only —
// Book direct / Visit official website / Instagram / Message venue. Fires the
// matching growth event to the internal store + GA4, then hands off. Never a
// fee loop: TablePilot reservations keep their own ReserveButton path.
export default function TrackedOutboundLink({
  href,
  event,
  venueSlug,
  className,
  children,
  label,
}: {
  href: string;
  event: TrackedEvent;
  venueSlug?: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => track(event, { venueSlug, label })}
    >
      {children}
    </a>
  );
}
