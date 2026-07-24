# Other Bali — Current-to-Target Migration Map V1

Status: `CONTRACTS_ONLY / DRAFT FOR APPROVAL`  
Recorded: 2026-07-25, Asia/Makassar  
Authority: ROUTE-001, ROUTE-002, MONEY-001, TODAY-001, TRUTH-001  
Implementation: none; no migration, redirect or schema change is authorized

## Migration protocol

Every row requires a preservation review, owner approval, reversible rollout and production evidence before implementation. `KEEP` means preserve the current carrier for now; `MAP` means document a future transform; `DEPRECATE` means do not delete until all consumers are migrated.

## Route and state map

| Current carrier | Target carrier | Action now | Required transform / preservation | Gate |
|---|---|---|---|---|
| `/my-day` | `/today` | `KEEP` current; no redirect | preserve query/hash, district context, GuestRef, shortlist state, analytics and canonical/robots/sitemap behavior | approved route review + this map + regression |
| `/me` | `/my-bali` | `KEEP` current; no redirect | create/validate target first; preserve anonymous GuestRef saves, trips, internal links, metadata and noindex policy | state/link/canonical/regression review |
| `/bali/[district]/[intent]` | future district pillar/child pattern | `KEEP` | map each slug and incoming link; never mass-redirect by pattern alone | route inventory + owner approval |
| `/route/[slug]` | V3.1 Route | `KEEP` | preserve singular route URL and stop ordering | content/SEO regression |

## Legacy entity and field map

| Current AS-IS | Target V1 | Transform | Disposition |
|---|---|---|---|
| `venues` / `Venue` | Organization + Place | split brand identity from physical outlet; map `area_id`, publication and verification | keep legacy read path until data migration |
| `districts` / `District` | Area | normalize approved keys and parent/alias relationships | map; no route rename yet |
| `perks` / `Perk` | Offer | preserve terms, validity, source and verification; contextual only | map; no new public offer route |
| `plan_entries` | Trip + RouteStop | preserve GuestRef ownership, ordering and source route | map after state audit |
| `saved_places` / `SavedPlace` | Trip/interaction relation to Place | preserve anonymous saves and timestamps | map after `/my-bali` validation |
| `photo_url` / `image_url` | MediaAsset | attach source, rights, status and verification timestamp | map; no video rollout |
| `is_sponsored` / `isSponsored` | no canonical field | remove influence from read/rank/render only after approved deprecation migration | deprecate; MONEY-001 gate |
| `last_verified_at` | Verification + field freshness | split field-specific status/date/by/method | map; do not infer from `updated_at` |

## Event and attribution map

| Current event family | Target contract | Rule |
|---|---|---|
| `landing_open`, page/detail views | InteractionEvent growth family | preserve names until event taxonomy approval |
| `save`, `route_add`, `shortlist_generated` | My Bali / decision events | preserve GuestRef semantics; no PII in metadata |
| `direction_click`, `website_click`, `instagram_click`, `whatsapp_guide_click` | neutral action intent | never label as confirmed or billable |
| `reservation_click` / `booking_click` | reservation intent | separate from TablePilot confirmed and seated outcomes |
| `partner_offer_click`, legacy redemption | Offer interaction | map only if Offer evidence and validity are canonical |

## Migration blockers and rollback evidence

1. Verify production-applied migration state before adding any migration; current repository contains duplicate numeric prefixes (`0015`–`0019`, `0031`, `0032`, `0035`).
2. Inventory all internal links, canonical tags, robots, sitemap entries, analytics consumers and state/query forms for both route decisions.
3. Define rollback for route, saved/trip state, Sponsored deprecation, media provenance and event names.
4. Confirm data dictionary fields and taxonomy keys before writing transforms.
5. Keep legacy fields readable until target reads and production parity are proven.

## Approval and non-goals

This map is a contract draft, not an execution plan. It does not authorize SQL, redirects, code changes, route creation, UI/navigation changes, event renames, deletion of Sponsored fields or deployment. Each implementation batch requires a new dated Decision Log entry and QA evidence.
