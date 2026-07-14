"use client";

import { useEffect } from "react";
import { analyticsAllowed } from "@/lib/consent";

// On load: if the URL carries a source tag (?s=villa_01 — the guest scanned a
// villa/coliving/Reels QR), bind it to the anonymous guest server-side
// (first-touch wins there). That is functional attribution and always runs.
// The landing_open analytics event only fires once the traveller has opted in
// (audit 2026-07 — no analytics identity before consent; the banner fires the
// first landing_open itself on Accept). The guest id is a server httpOnly
// cookie — no client identity, no localStorage (guardrail #10).
export default function SourceCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const incoming = params.get("s") || params.get("source");

    if (incoming) {
      fetch("/api/source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: incoming }),
        keepalive: true,
      }).catch(() => {});
    }

    if (analyticsAllowed()) {
      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "landing_open" }),
        keepalive: true,
      }).catch(() => {});
    }
  }, []);

  return null;
}
