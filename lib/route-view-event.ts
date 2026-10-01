import type { AllowedEventType } from "./actions/event-safety";

// Opening a published route (/route/<slug>) is a growth signal (AGENTS.md §12),
// counted with the same consent-gated mechanism as guides and place cards.
//
// No new event type: log_event's type registry
// (supabase/migrations/0058_shortlist_generated_event.sql) would need a
// migration for one. Routes reuse `editorial_page_view` — the type guides
// already write (components/CangguGuideView.tsx) — with the subject
// `route/<slug>`, which the slash-separated subject rule in
// lib/actions/event-safety.ts and log_event already accepts. See
// docs/analytics/ANALYTICS_EVENT_MAP_2026-08-25.md.
export const ROUTE_VIEW_EVENT = "editorial_page_view" satisfies AllowedEventType;
export const ROUTE_VIEW_SUBJECT_PREFIX = "route/";

// Same shape log_event and parseEventRequest enforce on a single path segment.
const ROUTE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SUBJECT_LENGTH = 120;

export type RouteViewTracking = {
  event: typeof ROUTE_VIEW_EVENT;
  slug: string;
};

/**
 * The page-view event for a route page, or null when nothing should be
 * written: the route did not resolve (the "Route not found" branch) or its
 * slug would be rejected by the event validator anyway.
 */
export function routeViewTracking(route: { slug: string } | null | undefined): RouteViewTracking | null {
  if (!route || typeof route.slug !== "string" || !ROUTE_SLUG.test(route.slug)) return null;
  const subject = `${ROUTE_VIEW_SUBJECT_PREFIX}${route.slug}`;
  if (subject.length > MAX_SUBJECT_LENGTH) return null;
  return { event: ROUTE_VIEW_EVENT, slug: subject };
}
