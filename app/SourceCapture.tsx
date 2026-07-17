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
// Normalise a raw tag to the server's source-id shape (a-z0-9_-, ≤64). The
// server re-validates with isSourceId and rejects anything invalid, so this is
// best-effort capture, not trust.
function toSourceId(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^[_-]+|[_-]+$/g, "")
    .slice(0, 64);
}

// Derive a source from UTM params when no explicit ?source=/?s= is present, so
// paid/organic campaigns attribute too (not only villa QR). Convention:
// utm_source[_utm_campaign] → e.g. utm_source=meta&utm_campaign=au ⇒ "meta_au",
// matching the campaign slugs (meta_bali, meta_au, …). The exact multi-param
// scheme is owned by docs/other-bali-egtm-content-pack-v1.md; adjust here if it
// diverges. An explicit ?source= always wins over UTM.
function sourceFromUtm(params: URLSearchParams): string | null {
  const utmSource = params.get("utm_source");
  if (!utmSource) return null;
  const utmCampaign = params.get("utm_campaign");
  const raw = utmCampaign ? `${utmSource}_${utmCampaign}` : utmSource;
  const id = toSourceId(raw);
  return id.length > 0 ? id : null;
}

export default function SourceCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const explicit = params.get("source") || params.get("s");
    const incoming = explicit ? toSourceId(explicit) : sourceFromUtm(params);

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
