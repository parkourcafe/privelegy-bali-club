# Other Bali Competitive Addendum — T0 Diagnostic Report

Date: 2026-07-24  
Scope: **Gate 0 / T0 diagnostics only**  
Baseline: `origin/main` at `291414c` (`Merge pull request #206`)  
Production: `https://www.otherbali.com`  
Local: `http://localhost:3000`

## Executive result

The repository and production product were inspected without implementing addendum features. The existing T0 indexability system remains healthy, but the competitive addendum is **not ready for P0 implementation** because the higher-authority V3.2/Decision Log/Data Dictionary/Taxonomy/Migration Map/PEA documents are absent and several live contracts conflict with the addendum or current money model.

No route, redirect, canonical, navigation, publication rule, schema, migration, ranking rule, offer, map, video, QR or commercial copy was changed.

Local reproducibility note: the first clean `npm run dev` browser pass logged 404s for scene assets because the build-time media fetch had not yet run. `npm run build` then fetched the assets and passed; production served the media correctly. This is a local setup gap, not a production media failure.

## Discovery and evidence boundary

The original local workspace contained multiple old/broken worktrees with `short read` and broken-HEAD errors. A clean checkout of current `origin/main` was created at:

`other-bali-t0-diagnostics`

This prevents stale worktrees from being treated as repository truth.

Read completely:

- `AGENTS.md`;
- `Other_Bali_Master_Architecture.md` V3.1 CORRECTED;
- user-supplied `OTHER_BALI_COMPETITIVE_FINDINGS_RECONCILED_CODEX_PLAN_2026-07-24.md`.

Inspected:

- repository reality, T0 verification and architecture implementation reports;
- Wave 1–3 discovery/verification;
- Phase 1 release-blocker report;
- visual redesign pilot handoff;
- money model;
- routes, sitemap, robots, canonical metadata and redirects;
- current TypeScript data contracts;
- all migration filenames and relevant schema/RLS;
- publication/indexability gates;
- place, Today, Plan, Saved, partner, villa, admin freshness, media and offer carriers;
- analytics event allowlist and safe payload rules.

## Canonical document inventory

| Authority level | Repository status | Evidence |
|---|---|---|
| Decision Log | MISSING as canonical source | References exist, but no approved canonical log file |
| Unified Master v3.2 | MISSING | Repository contains only V3.1 CORRECTED |
| Data Dictionary | MISSING | Master lists it as a required next document |
| Taxonomy v1 | MISSING | Runtime taxonomy exists, not an approved canonical document |
| Migration Map | MISSING | No approved Current-to-Target map |
| Public Experience Architecture v1.1 | MISSING | Also recorded missing by visual pilot handoff |
| T0–T10 | PRESENT as implementation reports | Architecture implementation report + Wave reports |
| Launch Stabilization | PARTIAL/DISTRIBUTED | Phase 1 release-blocker report and related handoffs |
| Competitive Addendum | USER-SUPPLIED | Treated as lowest authority in requested hierarchy |

```text
CANON_CONFLICT
Requires explicit Decision Log amendment
Do not implement automatically
```

## Repository inventory

- 156 App Router `page.tsx` files.
- 32 API route handlers.
- 69 SQL migration files.
- Latest filename: `0060_ubud_verified_restaurant_cards.sql`.
- Duplicate migration number prefixes: `0015`, `0016`, `0017`, `0018`, `0019`, `0031`, `0032`, `0035`.
- Public place detail: `/places/[slug]`.
- Explore catalogue: `/places`.
- Today AS-IS carrier: `/my-day`.
- Future planning: `/plan`.
- Saved/My Bali AS-IS carrier: `/me`.
- Target `/my-bali`: absent/404.
- Route canonical: `/route/[slug]`.
- Venue intake: `/for-venues` + `/api/venue-submission`.
- Verified owner update: `/onboard/[token]`.
- Partner claim/auth: `/partner/claim/[token]`, `/partner/*`.
- Villa distribution surfaces: `/villas`, `/hotels`, `/list-your-property`.
- Admin freshness and QR infrastructure exists.

## Route and canonical findings

| Surface | Local | Production | Canonical / robots | Diagnostic status |
|---|---|---|---|---|
| `/` | renders | renders | canonical home | PASS |
| `/my-day` | renders with no production data | renders real data | self-canonical | PASS as AS-IS carrier |
| `/places` | truthful 0-state | 68 published places observed | self-canonical, index/follow | PASS |
| `/places/12-kitchen-and-wine` | production data unavailable locally | renders | self-canonical, index/follow | PASS |
| `/plan` | renders, production data incomplete | renders real routes/data | self-canonical | PASS |
| `/for-venues` | renders | renders | self-canonical | ROUTE PASS; money copy conflict |
| `/villas` | renders | renders | self-canonical | PASS; QR demo deferred |
| `/my-bali` | 404 | 404 | no canonical, noindex | FAIL for requested target |
| `/me` | renders | renders | noindex/nofollow | AS-IS Saved carrier |

No `/today` route exists. This is consistent with live-preservation requirements: `/my-day` cannot be redirected until SEO/internal-link/analytics review.

## Redirect findings

No approved redirect from `/my-bali` to `/me` or from `/my-day` to `/today` exists. No redirect was added. Both require preservation review and an explicit canonical decision.

## Sitemap and publication state

Production T0 smoke at `2026-07-24T15:47:43Z`:

- `robots.txt`: 200 for browser, generic crawler and Googlebot smartphone;
- `/places` allowed;
- sitemap: 200;
- sitemap URL count: 690;
- 12 positive place samples;
- 1 negative control;
- 39 page fetches;
- 0 violations;
- all positive samples: HTTP 200, useful HTML, self-canonical, sitemap inclusion, equivalent content across UAs;
- negative `adda-yoga`: 404, no canonical, absent from sitemap.

Publication/indexability is centralized through:

- `lib/publication.ts`;
- venue presentation/validation helpers;
- `app/sitemap.ts`;
- place metadata helpers;
- T0 boundary and live-smoke tests.

Publication and indexability gates were not changed.

## Current data model and migration need

### Existing legacy carriers

- `districts`;
- `venues`;
- `perks`;
- `plan_entries`;
- `routes`, `route_stops`;
- `saved_places`, `shared_lists`;
- `events`;
- `venue_submissions`;
- `venue_onboarding_claims`, `venue_memberships`;
- `menus`, `menu_sections`, `menu_items`;
- `venue_action_capabilities`;
- photo consent/submission tables;
- attribution and redemption tables.

### Useful existing fields

Venue:

- identity, slug, category, district/area;
- publication and operational status;
- Maps/official/Instagram/booking URLs;
- `why_its_here`, `best_for`, `not_for`;
- practical tags/jobs;
- price and hours fields;
- `photo_url`;
- `last_verified_at`;
- TablePilot slug.

Offer/perk:

- title/terms;
- publication status;
- verification and expiry;
- confirmation evidence;
- redemption evidence.

Action capability:

- action kind;
- provider/handoff URL;
- evidence/source;
- captured/verified/expiry timestamps;
- publication state.

### Missing or unmapped addendum data

- canonical `media_status` / `media_provenance`;
- public field-level “what was checked”;
- canonical owner-confirmed state;
- issue report/category/status;
- canonical Offer mapping for all confirmed-extra fields;
- property-context QR carrier;
- Today role assignment;
- canonical claim event/state names.

No migration should be written until Data Dictionary/Migration Map and production-applied migration state are supplied.

## Homepage

Implemented:

- product promise;
- exactly two main tourist CTAs;
- decision/scenario links;
- partner entry is secondary;
- no horizontal overflow on desktop/mobile.

Partial/missing:

- H1 differs from addendum’s accepted H1 wording;
- no explicit four-step mechanism;
- DecisionDemo exists as page composition, not a stable standalone component contract;
- trust strip is not implemented as the approved safe block.

Recommended carrier: existing `app/page.tsx` and landing primitives; UI/copy only after canon blockers.

## Today / My Day

Implemented:

- URL-driven filters;
- area/group/vibe/budget/ending;
- selected summary after personalization;
- published collection data;
- Maps labels distinguish entity URLs from search URLs;
- truthful empty state;
- mobile has no horizontal overflow.

Conflicts/gaps:

- output is multiple time slots × up to three cards, not exactly three roles;
- hidden engine widens beyond selected area, though UI later discloses the widening;
- no best/backup/contrast event contract;
- no filtered map;
- no single triptych.

Recommended carrier: `/my-day`, `DayBuilderForm`, `lib/day-builder.ts`, existing `PlaceCard`; do not create `/today` or a second recommendation engine.

## Places and place pages

Implemented:

- catalogue and detail canonical URLs;
- publication/indexability protection;
- honest no-media state;
- decision summary/quick decision;
- Best for / Not ideal fields where available;
- Save and Add to trip;
- official website/Maps/action gateway;
- similar places;
- confirmed legacy offer block;
- Google Maps search/entity labels.

Missing/partial:

- no “Something changed?” flow;
- no issue events/data;
- public media provenance is incomplete;
- public freshness is inconsistent and does not describe what was checked;
- confirmed offer block does not satisfy the complete canonical Offer contract;
- canonical page order does not match addendum exactly.

## Plan and My Bali

`/plan` is correctly future-planning and contains existing route/trip carriers. It must remain separate from Today.

`/me` is the implemented anonymous saved list/trip surface using httpOnly GuestRef behavior. `/my-bali` is not implemented. The URL decision is blocked by canonical preservation governance.

## Venue claim/update

Implemented:

- public new-listing submission;
- duplicate update behavior;
- consent;
- operator review;
- private onboarding token;
- partner membership/claim infrastructure;
- media upload with rights workflow;
- partner draft actions/menus.

Gap:

- the first step is not the addendum’s two-field “place name + WhatsApp / find my page” lookup;
- current new-listing form requires website, Instagram, WhatsApp and email;
- canonical Organization/Place claim mapping is missing.

Recommended action: reuse existing claim/onboarding, add only a search-first UI after authorization and duplicate-branch tests.

## Maps, booking and actions

Existing action kinds:

- reserve;
- delivery;
- takeaway;
- preorder;
- website;
- WhatsApp;
- Maps.

Actions are evidence/freshness gated through `venue_action_capabilities` and fallbacks. The action gateway clearly states that providers own confirmation/fulfilment. Maps actions distinguish “Open in Google Maps” from “Search in Google Maps”.

No internal route/ETA/navigation map was found. The requested filtered map is correctly deferred.

## Analytics

Existing allowlisted events include:

`landing_open`, `venue_card_open`, `direction_click`, `reservation_click`, `venue_detail_view`, `venue_card_click`, `booking_click`, `official_website_click`, `instagram_click`, `menu_open`, `menu_item_open`, `action_handoff`, delivery/takeaway/preorder clicks, `save`, `route_add`, `shortlist_generated`, submission and guide events.

Analytics is consent-gated and best-effort. Safe payloads reject acquisition-source overwrites and PII-like unbounded properties.

Missing addendum coverage is documented in the route/data map; event renames require migration/report updates.

## Money model

Canonical repository rule:

> fixed fee per confirmed seated reservation through the approved rail; no listing fee, paid rank or tourist payment.

Conflict:

- `/for-venues` and the submission success copy say “2 months free” / “first 2 months are a free test”, implying a post-trial commercial listing;
- public data contracts retain `isSponsored` and a renderable `Sponsored` label.

```text
MONEY_MODEL_CONFLICT
No commercial copy changed
Decision Log amendment required
```

## Recommended next gate

Before P0 implementation:

1. supply/commit the canonical Decision Log and Unified Master v3.2;
2. supply/approve Data Dictionary, Taxonomy, Migration Map and PEA v1.1;
3. decide `/me` vs `/my-bali` preservation;
4. decide `/my-day` vs `/today` preservation;
5. confirm money model and approve a separate commercial-copy correction;
6. confirm no sponsored runtime/public contract;
7. assign canonical carriers/owners for issue reports, media provenance and freshness;
8. verify production-applied migration ledger because numeric prefixes are duplicated.

Only then should the smallest P0 UI/copy and existing-engine changes start.

## Final verdict

```text
T0_DIAGNOSTICS: FAIL
CANONICAL_URL_SAFETY: FAIL
DATA_TRUTHFULNESS: FAIL
MONEY_MODEL_CONSISTENCY: FAIL
READY_FOR_P0_IMPLEMENTATION: NO
```

Reasoning:

- engineering T0 indexability tests pass;
- the broader addendum Gate 0 fails because required canonical sources are unavailable;
- `/my-bali` is a 404 and lacks a preservation decision;
- issue/media/freshness/Offer truth contracts are incomplete;
- commercial trial wording and sponsored legacy contract conflict with the sole money model.
