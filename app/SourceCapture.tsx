"use client";

import { useEffect } from "react";
import { getOrCreateGuestRef, saveSourceIfFirst, getStoredSource } from "@/lib/guest";

// Runs on every page load. If the URL carries a source tag (?s=villa_01 — i.e.
// the guest scanned a villa/coliving/Reels QR), bind it to the anonymous guest
// once (first-touch). Always logs a landing_open for the funnel. This is the
// mechanism behind "source QR ≠ redemption QR" (§22).
export default function SourceCapture() {
  useEffect(() => {
    const guestRef = getOrCreateGuestRef();
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("s") || params.get("source");

    if (incoming && saveSourceIfFirst(incoming)) {
      fetch("/api/source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestRef, source: incoming }),
        keepalive: true,
      }).catch(() => {});
    }

    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "landing_open",
        guestRef,
        source: getStoredSource() ?? undefined,
      }),
      keepalive: true,
    }).catch(() => {});
  }, []);

  return null;
}
