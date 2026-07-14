import type { SafeActionEventPayload } from "./contracts/menu-action";
import type { SafeEventPayload, SafeMenuEventPayload } from "./actions/event-payload";
import { isSafeActionEventPayload } from "./actions/event-payload";

// Client-side event tracking for the editorial/district surfaces.
//
// Two sinks, one call — with a documented difference (brief §21):
// - the INTERNAL event store (/api/event → version-compatible RPC) is the funnel
//   system of record (growth vs partner-proof separation lives there);
// - GA4 receives the same event name as a custom event for acquisition
//   analysis. GA4 is DISABLED by default (audit 2026-07 — no third-party
//   analytics until a consent flow exists; see components/Analytics.tsx). When
//   GA is off, `window.gtag` is never defined, so the GA4 leg below silently
//   no-ops. Re-enabling GA is a consent-gated env change, not a code edit here.
//
// Partner-proof events never go to GA4. trackVenueAction keeps TablePilot's
// reservation_click on the internal leg only.

import { analyticsAllowed } from "./consent";

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
  | "menu_open"
  | "menu_item_open"
  | "partner_offer_click"
  | "guide_form_started"
  | "guide_form_submitted"
  | "whatsapp_guide_click"
  | "internal_guide_click";

type ActionTrackedEvent =
  | "action_handoff"
  | "delivery_click"
  | "takeaway_click"
  | "preorder_click";

type GrowthEvent = TrackedEvent | ActionTrackedEvent;
type InternalEvent = GrowthEvent | "reservation_click";
type TrackParams = { venueSlug?: string; pageSlug?: string; label?: string };

function postInternal(
  type: InternalEvent,
  venueSlug?: string,
  payload?: SafeEventPayload
): void {
  const body: {
    type: InternalEvent;
    venueSlug?: string;
    payload?: SafeEventPayload;
  } = { type };
  if (venueSlug !== undefined) body.venueSlug = venueSlug;
  if (payload !== undefined) body.payload = payload;

  // Analytics is opt-in (audit 2026-07): skip entirely until the traveller has
  // accepted. The server route also guards, so this is the fast client path.
  if (!analyticsAllowed()) return;

  // Internal funnel store — best-effort, never blocks navigation.
  try {
    fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the UI for analytics */
  }
}

function emitGrowthEvent(
  type: GrowthEvent,
  params?: TrackParams,
  payload?: SafeEventPayload
): void {
  postInternal(type, params?.venueSlug ?? params?.pageSlug, payload);

  const actionPayload = payload && isSafeActionEventPayload(payload) ? payload : undefined;
  const menuPayload = payload && !isSafeActionEventPayload(payload) ? payload : undefined;

  try {
    window.gtag?.("event", type, {
      venue_slug: params?.venueSlug,
      page_slug: params?.pageSlug,
      link_label: params?.label,
      action: actionPayload?.action,
      provider: actionPayload?.provider,
      capability_id: actionPayload?.capabilityId,
      menu_id: menuPayload?.menuId,
      menu_item_id: menuPayload?.menuItemId,
    });
  } catch {
    /* gtag absent in dev — fine */
  }
}

export function track(
  type: TrackedEvent,
  params?: TrackParams
): void {
  emitGrowthEvent(type, params);
}

export function trackMenuOpen(payload: Omit<SafeMenuEventPayload, "menuItemId">): void {
  const safePayload: SafeMenuEventPayload = {
    venueSlug: payload.venueSlug,
    menuId: payload.menuId,
  };
  emitGrowthEvent("menu_open", { venueSlug: safePayload.venueSlug }, safePayload);
}

export function trackMenuItemOpen(payload: Required<SafeMenuEventPayload>): void {
  const safePayload: SafeMenuEventPayload = {
    venueSlug: payload.venueSlug,
    menuId: payload.menuId,
    menuItemId: payload.menuItemId,
  };
  emitGrowthEvent("menu_item_open", { venueSlug: safePayload.venueSlug }, safePayload);
}

export function trackVenueAction(payload: SafeActionEventPayload): void {
  // Rebuild the object so runtime-only extra properties can never cross the
  // analytics boundary even when a JavaScript caller bypasses TypeScript.
  const safePayload: SafeActionEventPayload = {
    action: payload.action,
    provider: payload.provider,
    ...(payload.capabilityId === undefined
      ? {}
      : { capabilityId: payload.capabilityId }),
    venueSlug: payload.venueSlug,
  };
  const params = { venueSlug: safePayload.venueSlug };

  emitGrowthEvent("action_handoff", params, safePayload);

  switch (safePayload.action) {
    case "reserve":
      if (safePayload.provider === "tablepilot") {
        postInternal("reservation_click", safePayload.venueSlug);
      } else {
        emitGrowthEvent("booking_click", params);
      }
      break;
    case "whatsapp":
      emitGrowthEvent("booking_click", params);
      break;
    case "delivery":
      emitGrowthEvent("delivery_click", params, safePayload);
      break;
    case "takeaway":
      emitGrowthEvent("takeaway_click", params, safePayload);
      break;
    case "preorder":
      emitGrowthEvent("preorder_click", params, safePayload);
      break;
    case "website":
      emitGrowthEvent("official_website_click", params);
      break;
    case "maps":
      emitGrowthEvent("direction_click", params);
      break;
  }
}
