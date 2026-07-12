// Client-side event tracking for the editorial/district surfaces.
//
// Two sinks, one call — with a documented difference (brief §21):
// - the INTERNAL event store (/api/event → log_event RPC) is the funnel
//   system of record (growth vs partner-proof separation lives there);
// - GA4 receives the same event name as a custom event for acquisition
//   analysis. GA4 is production-only (components/Analytics.tsx) and gtag is
//   absent in dev, so the GA4 leg silently no-ops outside production.
//
// Partner-proof events (redemption, reservation_click) are NOT routed through
// this helper — they keep their existing dedicated paths.

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
  }
}

export type TrackedEvent =
  | "district_page_view"
  | "editorial_page_view"
  | "venue_detail_view"
  | "venue_card_click"
  | "booking_click"
  | "direction_click"
  | "official_website_click"
  | "instagram_click"
  | "menu_click"
  | "partner_offer_click"
  | "guide_form_started"
  | "guide_form_submitted"
  | "whatsapp_guide_click"
  | "internal_guide_click";

export function track(
  type: TrackedEvent,
  params?: { venueSlug?: string; pageSlug?: string; label?: string }
): void {
  const slug = params?.venueSlug ?? params?.pageSlug;

  // Internal funnel store — best-effort, never blocks navigation.
  try {
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, venueSlug: slug }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the UI for analytics */
  }

  // GA4 custom event (same name; slug + label as params).
  try {
    window.gtag?.("event", type, {
      venue_slug: params?.venueSlug,
      page_slug: params?.pageSlug,
      link_label: params?.label,
    });
  } catch {
    /* gtag absent in dev — fine */
  }
}
