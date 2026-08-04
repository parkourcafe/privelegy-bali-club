# Other Bali Intent OS — Live Analytics Verification v1.0

Date: 2026-07-28
Mode: strictly read-only; aggregate-only.

## STATUS

**PARTIAL / AGGREGATE VERIFIED**

Owner-provided sanitized aggregate event exports were reviewed. No event payloads, user content, itinerary contents, identifiers or sensitive data were exported.

Live route-level attribution and raw payload compatibility remain unverified.

## Static event contract reviewed

Source: `lib/actions/event-safety.ts`

The allowlisted event taxonomy contains 30 event names, including:

```text
landing_open
venue_card_open
perk_open
direction_click
reservation_click
similar_open
district_open
district_page_view
editorial_page_view
venue_detail_view
venue_card_click
booking_click
official_website_click
instagram_click
menu_click
partner_offer_click
guide_form_started
guide_form_submitted
whatsapp_guide_click
internal_guide_click
menu_open
menu_item_open
action_handoff
delivery_click
takeaway_click
preorder_click
save
route_add
shortlist_generated
```

The parser rejects unknown event types, unsafe source/acquisition fields, malformed venue subjects and invalid action/menu payloads.

## Static storage contract

Sources:

- `app/api/event/route.ts`
- `lib/actions/event-compat.ts`
- `lib/actions/event-store.ts`
- `supabase/migrations/0058_shortlist_generated_event.sql`

Confirmed locally:

- explicit consent is required before guest identity/event storage;
- six additive action events use `log_event_v2`;
- legacy allowlisted events use `log_event`;
- missing v2 RPC codes can fall back to legacy;
- browser roles are not granted direct execution of `log_event`.

Local isolated smoke result:

```text
bash scripts/wave2-event-db-smoke.sh — PASS
```

This does not establish live analytics health.

## Live aggregate evidence received

The export contains 15 event types. All 15 have non-zero 30-day counts. Only 5 of 15 have non-zero 7-day counts:

```text
direction_click
district_page_view
editorial_page_view
landing_open
shortlist_generated
```

The remaining 10 event types have zero 7-day activity despite non-zero 30-day activity:

```text
action_handoff
booking_click
menu_item_open
menu_open
perk_open
reservation_click
similar_open
venue_card_click
venue_card_open
venue_detail_view
```

The export shows `source = null` for the supplied event-type summary. Therefore route/source attribution coverage cannot be certified from this export.

Notable 30-day totals from the export:

```text
landing_open: 448
editorial_page_view: 53
venue_card_open: 42
venue_detail_view: 34
venue_card_click: 21
```

## Required live checks when access is available

Aggregate only:

1. event names present in the last 7 days;
2. event names present in the last 30 days;
3. last-seen timestamp per event type;
4. counts by route/surface/source, without raw payloads;
5. invalid/rejected event counts if retained;
6. presence and compatibility of `log_event` and `log_event_v2`;
7. delivery gaps for key surfaces: `/places`, venue detail, `/my-day`, `/plan`, save, route add, shortlist generation, partner flow.

## ACCESS_BLOCKERS

- Event summary has `source = null` for all supplied rows.
- No route/surface breakdown was provided.
- No raw payload compatibility check was performed, correctly under the privacy constraint.
- No separate analytics API/tool is configured.

## UNRESOLVED_ISSUES

- 7-day counts: aggregate values verified; interpretation of zero activity for 10 event types remains open.
- 30-day counts: aggregate values verified.
- last-seen timestamps: aggregate values verified.
- route/surface coverage: BLOCKED_ACCESS because source is null and no route breakdown was supplied.
- delivery gaps: BLOCKED_ACCESS; cannot infer from low activity alone.
- live consent distribution: BLOCKED_ACCESS.

## Handoff

STATUS: PARTIAL / AGGREGATE VERIFIED
FILES_CREATED: this verification report
FILES_CHANGED: no production files
LIVE_SYSTEMS_READ: owner-provided sanitized aggregate event exports
ACCESS_BLOCKERS: null source attribution; no route/surface breakdown; no raw payload check
UNRESOLVED_ISSUES: event delivery interpretation for 10 zero-7d types; source attribution
OWNER_DECISIONS_REQUIRED: confirm whether zero-7d events are expected inactivity or delivery gaps
QUALITY_SCORE: 79/100 for aggregate live analytics verification
RECOMMENDED_NEXT_STEP: provide aggregate route/surface breakdown and routine event source summary
