"use client";

import { track } from "@/lib/analytics";

// Sticky mobile action bar for venue pages (brief §10.3): View map +
// Book/Reserve + WhatsApp when verified. 46px targets, safe-area padded,
// hidden on desktop (CSS). Action is available without scrolling the article.
//
// Event contract: direction_click + booking_click are growth events (internal
// + GA4 via track()); the TablePilot handoff logs reservation_click to the
// internal store ONLY — it is a partner-proof demand signal (money model
// v0.3) and never goes to GA4.
function logReservationClick(venueSlug: string) {
  fetch("/api/event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "reservation_click", venueSlug }),
    keepalive: true,
  }).catch(() => {});
}

export default function VenueActionBar({
  slug,
  gmapsUrl,
  bookHref,
  bookLabel,
  whatsapp,
  isTablepilot,
}: {
  slug: string;
  gmapsUrl: string;
  bookHref: string | null;
  bookLabel: string;
  whatsapp?: string;
  isTablepilot: boolean;
}) {
  return (
    <div className="venue-action-bar" role="navigation" aria-label="Quick actions">
      <a
        href={gmapsUrl}
        target="_blank"
        rel="noreferrer"
        onClick={() => track("direction_click", { venueSlug: slug })}
      >
        View map
      </a>
      {bookHref ? (
        <a
          href={bookHref}
          target="_blank"
          rel="noreferrer"
          className="is-primary"
          onClick={() =>
            isTablepilot
              ? logReservationClick(slug)
              : track("booking_click", { venueSlug: slug })
          }
        >
          {bookLabel}
        </a>
      ) : whatsapp ? (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="is-primary"
          onClick={() => track("booking_click", { venueSlug: slug, label: "whatsapp" })}
        >
          WhatsApp
        </a>
      ) : null}
    </div>
  );
}
