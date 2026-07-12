"use client";

import { useEffect, useRef } from "react";
import { track, type TrackedEvent } from "@/lib/analytics";

// Fires one view event per mount (venue_detail_view / district_page_view /
// editorial_page_view). Growth-only signals — never partner-proof.
export default function PageViewTracker({
  event,
  slug,
}: {
  event: TrackedEvent;
  slug: string;
}) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track(event, { pageSlug: slug, venueSlug: event === "venue_detail_view" ? slug : undefined });
  }, [event, slug]);
  return null;
}
