# Other Bali — Data Dictionary V1

Status: `CONTRACTS_ONLY / DRAFT FOR APPROVAL`  
Recorded: 2026-07-25, Asia/Makassar  
Authority: Decision Log → Source of Truth → V3.1 Master  
Implementation: none; this contract does not create or alter schema

## Contract conventions

`current_*` describes the repository/Supabase AS-IS carrier. `target_*` describes the V3.1 contract. Legacy carriers remain read-only until Migration Map V1 is approved and executed. Database columns are snake_case; domain fields are camelCase at one data-access boundary. Unknown is `null`, hidden or `needs_verification`, never an inferred value. Public reads require `publication_status = published` and field-specific evidence.

## A. Venue / target Place

The current `venues` row is the compatibility carrier for a target `Organization` + `Place` split. No rename or split is executed here.

| Field | Current table.column / type / nullability | Current meaning | Target meaning | Source / public render | Verification / freshness | PII / RLS | Status / migration |
|---|---|---|---|---|---|---|---|
| id | `venues.id`, text, not null | row identity | Place id; Organization relation where applicable | canonical DB; public if published | stable identity | no PII; public read policy | legacy bridge → map |
| slug | `venues.slug`, text, not null | public venue key | canonical Place slug | canonical DB; URL only after route review | uniqueness check | no PII; public read | legacy bridge → preserve |
| name | `venues.name`, text, not null | display name | Place name; Organization name is separate | official/editorial source | source timestamp | no PII; public read | canonical value |
| venue_type | `venues.venue_type`, text, nullable | broad place type | controlled Place type | taxonomy + editorial | taxonomy review | no PII; public read | map to Taxonomy |
| category | legacy category fields, nullable | UI grouping | public category key | approved taxonomy only | taxonomy review | no PII; public read | map |
| district | `venues.district`, text, nullable | legacy geography label | Area/district key | canonical Area mapping | mapping required | no PII; public read | map; aliases retained |
| area | legacy/derived, nullable | broad geography | Area parent | approved Area source | mapping required | no PII; public read | map |
| subarea | legacy/derived, nullable | local geography | Subarea key | approved taxonomy | mapping required | no PII; public read | map |
| coordinates | `latitude`/`longitude` where present, nullable | map point | Place coordinates | official/map source; verified only | source + date | no PII; public read | map; no routing |
| publication_status | `venues.status` and publication carriers, nullable | visible/hidden state | `draft/published/unpublished/closed` | canonical publication state | status transition audit | no PII; RLS public read | normalize later |
| editorial_status | editorial fields/status, nullable | content readiness | `draft/reviewed/approved/stale/disputed` | editorial owner | review timestamp | no PII; admin RLS | map |
| best_for | `best_for`, nullable | positive fit copy | verified fit claims | editorial source | claim status/date | no PII; public read | map; never invert not_for |
| not_for | `not_for`, nullable | contextual limitation | verified limitation | editorial source | claim status/date | no PII; public read | map; no anti-list |
| jobs | tags/json fields, nullable | traveller job tags | controlled job keys | Taxonomy V1 | taxonomy review | no PII; public read | map |
| occasions | tags/json fields, nullable | occasion tags | controlled occasion keys | Taxonomy V1 | taxonomy review | no PII; public read | map |
| meal_periods | tags/json fields, nullable | meal timing | controlled meal-period keys | official/editorial | date if volatile | no PII; public read | map |
| practical_tags | `vibe_tags`/practical fields, nullable | practical descriptors | controlled practical tags | editorial source | claim review | no PII; public read | split/map |
| price_anchor | `price_anchor`, nullable | editorial price cue | verified price band/anchor | official source | expiry/freshness required | no PII; public read | map |
| price_band | price fields, nullable | legacy price range | controlled price band | official source | stale after policy window | no PII; public read | map |
| hours | hours/json fields, nullable | opening schedule | verified current hours | official/provider source | `verified_at`; open_now derived only | no PII; public read | map |
| freshness_at | `last_verified_at`/field-specific fields, nullable | mixed freshness | field evidence timestamp | Source + Verification | never derive from updated_at | no PII; public read | split/map |
| verification_status | flags/status, nullable | inconsistent verified flag | `verified/needs_verification/disputed/stale` | Verification record | status + date + by | no PII; public read | canonical target |
| official_url | `official_url`, nullable | outbound URL | verified website capability | official source | URL check + verified_at | no PII; public read | map |
| menu_url | menu fields, nullable | menu handoff | verified menu capability | official source | URL/status/date | no PII; public read | map |
| instagram_url | `instagram_url`, nullable | social handoff | verified Instagram capability | official source | URL/status/date | no PII; public read | map |
| whatsapp_url | WhatsApp fields, nullable | contact handoff | verified WhatsApp capability | official source | target/status/date | no PII; public read | map |
| booking_url | booking fields, nullable | booking handoff | verified booking capability | official rail/provider | URL/status/date | no PII; public read | map |
| maps_url | map fields, nullable | Maps handoff | verified entity URL or explicit search | Maps/entity source | entity verification/date | no PII; public read | map |
| photo_url | `venues.photo_url`, text, nullable | single image URL | compatibility pointer to MediaAsset primary | media registry only | object/hash/dimensions | no PII; public read | bridge; no direct write |
| photo_status | photo status fields, nullable | pending/available state | derived MediaAsset status | MediaAsset + Verification | object availability/date | no PII; public read | map |
| partner_id | partner fields, nullable | partner relationship | Organization/PartnerAccount relation | partner/admin source | account status | partner metadata; partner RLS | map |
| is_sponsored | `venues.is_sponsored`, boolean, nullable | legacy sponsored flag | no canonical target field | never public rank/render | Decision Log MONEY-001 | non-PII; admin RLS | deprecated/quarantine |
| price/offer fields | price/perk columns, nullable | legacy offer/commercial data | Offer context only; no paid rank | official source + Offer | validity/status/date | no PII; partner RLS | map; MONEY-001 gate |

## B. Routes and saved state

| Carrier | Current AS-IS | Target contract | Persistence / analytics | Redirect preconditions |
|---|---|---|---|---|
| Today | `/my-day`, `app/my-day/page.tsx` | `/today` after ROUTE-001 | preserve district/query/hash, shortlist and event names | preservation review, Migration Map, link/SEO/regression checks |
| Saved | `/me`, `app/me/page.tsx` | `/my-bali` after ROUTE-002 | anonymous `GuestRef` state, saves/trips, internal links and analytics | target first, state/canonical/link/regression review |
| Saved state | `saved_places`, local-compatible state and GuestRef carriers | Trip + Place relation | no identity in localStorage/sessionStorage; preserve GuestRef | state parity and rollback |
| Primary navigation | Today, Explore, Plan, Saved | same labels; My Bali is target product naming only | event continuity | no navigation change in this stage |

## C. Official actions

| Action | Type / validation | Public label | Event | Fallback / freshness |
|---|---|---|---|---|
| Maps | verified entity URL; otherwise explicit search | Directions / Search Maps | `direction_click` | no routing/ETA; verify target/date |
| Website | verified official URL | Official website | `official_website_click` | hide or `not verified`; URL/date |
| Menu | verified official menu URL or structured source | Menu | `menu_click` / `menu_open` | unknown remains explicit; source/date |
| Instagram | individually verified official account | Instagram | `instagram_click` | hide if unverified; URL/date |
| WhatsApp | individually verified official target | WhatsApp | `whatsapp_guide_click` / `action_handoff` | no provider claim; target/date |
| Booking | supported official/provider handoff | Reserve / Check booking | `booking_click` / `reservation_click` | click is intent; source/date |
| TablePilot | attribution rail | Confirmed / Seated are internal stages | `reservation_click` → confirmed → seated | only seated billable; no PII by default |

## D. Money model

`reservation_click` is intent. Supported attribution may produce `confirmed`, then `seated`. Only a confirmed seated reservation is billable under MONEY-001. Maps, website, menu, Instagram, WhatsApp and other outbound clicks are non-billable. `is_sponsored`, Featured, paid visibility, paid route placement and category sponsorship cannot influence organic read models, ranking, UI or partner sales. Legacy fields remain mapped and unchanged.

## E. Canonical media registry

Target registry: `venue_photos` (fresh service snapshot: 48 rows, including published confirmed-official records). MEDIA-002 rights authorization is not represented by owner-confirmed fields. Existing rows are AS-IS and must be preserved/mapped, not overwritten by a dry run.

| Field | Type / nullable | Rule |
|---|---|---|
| `id` | text/uuid, not null | stable MediaAsset id |
| `venue_id` | text/uuid, nullable until mapping | Place/venue mapping; no invented match |
| `venue_slug` | text, nullable | current compatibility key |
| `storage_bucket` / `storage_path` | text, not null | exact object locator |
| `source_url` | text, nullable | original/reference URL |
| `content_hash` | text, not null | SHA-256 exact bytes |
| `mime_type` / `file_size` | text/int, not null | technical validation |
| `width` / `height` | int, not null | decoded dimensions |
| `media_scope` | enum, not null | `venue`, `branch`, `property`, `brand`, `shared_facility`, `unresolved` |
| `rights_basis` | enum, not null | `project_owner_global_authorization` for MEDIA-002 |
| `rights_grant_id` | text, not null | `MEDIA-002` |
| `provenance` / `source_project` / `source_record_id` | text, nullable | storage/submission/external evidence |
| `status` | enum, not null | `discovered`, `validated`, `mapping_required`, `ready`, `published`, `blocked_technical`, `superseded`, `archived` |
| `is_primary` / `display_order` | bool/int, nullable | one primary per venue; deterministic gallery ordering |
| `alt_text` / `credit_line` | text, nullable | factual alt; credit where applicable |
| `verified_at` / `published_at` | timestamp, nullable | evidence/publication timestamps |
| `created_at` / `updated_at` | timestamp, not null | registry audit fields |

## F. Privacy, RLS and legacy boundary

Public media and Place reads are published-only. Partner writes may update source facts but not editorial verdict, organic rank or money fields. Submission records, owner identity, tokens and internal notes are private/admin RLS. `owner_confirmed_by`, `venue_photo_consents`, `venue_photo_tokens`, admin upload and shared confirmation timestamps are not MEDIA-002 publication gates. Legacy `Venue`, `District`, `Perk`, `SavedPlace`, `is_sponsored` and `photo_url` are `HISTORICAL / READ-ONLY / NOT IMPLEMENTATION AUTHORITY` until migration.
