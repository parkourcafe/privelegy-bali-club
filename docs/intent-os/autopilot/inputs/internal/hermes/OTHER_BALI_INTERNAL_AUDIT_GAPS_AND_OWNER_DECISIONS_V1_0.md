# Other Bali — Internal Intent Audit Gaps & Owner Decisions v1.0

Status: **READ-ONLY / NO PRODUCTION CHANGES**

## Confirmed gaps

### G1 — no single canonical intent ID layer

`lib/intents.ts`, `lib/moments.ts`, `lib/catalogue-moments.ts`, `lib/trip-missions.ts`, `lib/scenarios.ts` and `lib/collections.ts` all encode user jobs at different levels. The shadow `docs/seo/os/intent-registry.json` does not yet govern them: many entries have `intent_id: null` and `os_gate_status: shadow_unreviewed`.

### G2 — duplicate vocabularies and matchers

The same user job may be evaluated by:

- exact `jobs` match (`lib/collections.ts`);
- job-first/category-fallback (`lib/moments.ts`);
- substring any-match over a haystack (`app/places/page.tsx` and `lib/catalogue-moments.ts`);
- query/category/district brief (`lib/trip-missions.ts` → `/places`).

These are not interchangeable. A venue can appear in one surface and not another without a row-level data change.

### G3 — scenario registry drift

`lib/trip-missions.ts` references `slow-living-bali`, `family-bali`, `bali-night-out`, and `bali-rainy-day`, while the inspected `SCENARIOS` array contains four scenarios: `first-time-in-bali`, `bali-for-a-month`, `romantic-bali`, `bali-retreat-reset`. This is a confirmed code/config conflict, not a venue issue.

### G4 — row-level support not proven

The code declares support for `jobs`, `vibe_tags`, `practical_tags`, `why_its_here`, `best_for`, `not_for`, `what_to_order`, `price_anchor`, publication fields and verification timestamps. A full current `public.venues` snapshot was not available, so actual coverage is PARTIAL/UNKNOWN.

### G5 — save/trip API boundary needs runtime proof

Migration `0056_saved_place_trip_extension.sql` defines trip functions and then revokes them from `public, anon, authenticated`, granting them to `service_role`. The UI calls `/api/trip`; the route/service-client path and current deployed grants were not runtime-verified here. Do not call this broken or live-verified without that proof.

### G6 — analytics counts unavailable

`lib/analytics.ts` defines an allowlist and consent gate. `0056` defines the corresponding `log_event` allowlist. The audit confirms taxonomy existence, not event volume, delivery success or current production consent configuration.

### G7 — web and mobile save semantics are separate

The web layer uses guest refs and Supabase saved places; the mobile layer uses local storage snapshots and separate saved venue/route IDs. There is no evidence in reviewed files of cross-device sync.

### G8 — SEO governance is partly explicit but partly shadow

`app/sitemap.ts`, `app/robots.ts`, `app/places/page.tsx` and collection gates have clear rules. The intent registry is still shadow, so declared intent ownership/gates do not fully cover the live route inventory.

## Owner decisions required

| ID | Decision | Why it matters |
|---|---|---|
| OD-01 | Approve one canonical internal intent vocabulary or approve explicit layers | Prevents drift between SEO, Plan, Today, Collections and `/places` |
| OD-02 | Define canonical aliases for date-night, special-occasion, sunset/golden-hour, work-friendly/work-session, family/family-easy and local/local-calm | Required for duplicate/conflict register closure |
| OD-03 | Decide whether `lib/moments.ts` or `lib/catalogue-moments.ts` owns public moment labels | Current surfaces use different matching logic |
| OD-04 | Decide whether `/plan` and `/my-day` remain separate products | Code states future planning versus current decision, but engines overlap |
| OD-05 | Classify missing mission scenario slugs as planned, deprecated or implementation gaps | Avoid dead links and false completeness claims |
| OD-06 | Decide whether all public `/places` search/filter combinations remain noindex | Current code noindexes filtered views while district hubs are canonical SEO surfaces |
| OD-07 | Approve the data contract for every decision-ready venue | At minimum: identity, district, category, publication, `why_its_here`, `best_for`, freshness, and appropriate action fields |
| OD-08 | Confirm whether saved trips are expected to sync between web and mobile | Current evidence shows separate persistence models |
| OD-09 | Verify API/RPC grants for save/trip/share before any UX claim | Migration history alone is not production proof |
| OD-10 | Decide whether the shadow intent registry becomes governance source of truth | Otherwise it should be clearly labeled audit-only |

## Not covered / deliberately not claimed

- No keyword research or external demand research.
- No new external intents were invented.
- No venue cleanup, deduplication, page creation, SEO rewrite, database write or production deploy.
- No claim that a given intent has current row-level coverage without a full DB snapshot.
- No claim that analytics events are currently arriving; only taxonomy/code support is confirmed.

## Recommended closure sequence

1. Owner approves vocabulary and layer boundaries.
2. Read-only live DB export validates row coverage for the data support matrix.
3. Read-only runtime/API inspection validates save/trip/share grants and event delivery.
4. Registry reconciliation maps canonical IDs to routes, UI, fields, matcher, sitemap and analytics events.
5. Only after those gates, separate implementation work may be proposed.

## Handoff

STATUS: PARTIAL / NO PRODUCTION CHANGE
FILES_CREATED: five audit artifacts
FILES_CHANGED: audit artifacts only
SOURCES_REVIEWED: architecture, Decision Log, intent/page registries, code, routes, UI, migrations
UNRESOLVED_ISSUES: G1-G8
OWNER_DECISIONS_REQUIRED: OD-01 to OD-10
QUALITY_SCORE: 78/100
RECOMMENDED_NEXT_STEP: owner vocabulary decision, then read-only DB/runtime closure
