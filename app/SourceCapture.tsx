"use client";

import { useEffect } from "react";
import { browserConsentState, CONSENT_EVENT } from "@/lib/privacy/consent";

// After explicit analytics consent, bind an incoming source tag to the
// anonymous guest server-side (first-touch wins there), then log landing_open.
// Merely loading the page or choosing Essential only creates no guest identity.
export default function SourceCapture() {
  useEffect(() => {
    let sent = false;
    const capture = async () => {
      if (sent || browserConsentState(document.cookie) !== "analytics_allowed") return;
      sent = true;
      const params = new URLSearchParams(window.location.search);
      const incoming = params.get("s") || params.get("source");

      if (incoming) {
        // Preserve first-touch identity deterministically: wait for the source
        // response (and its httpOnly cookie) before emitting landing_open.
        await fetch("/api/source", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source: incoming }),
          keepalive: true,
        }).catch(() => {});
      }

      fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "landing_open" }),
        keepalive: true,
      }).catch(() => {});
    };
    capture();
    window.addEventListener(CONSENT_EVENT, capture);
    return () => window.removeEventListener(CONSENT_EVENT, capture);
  }, []);

  return null;
}
