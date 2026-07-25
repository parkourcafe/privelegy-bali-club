# Other Bali — Data Dictionary V1

Status: `CONTRACTS_ONLY / DRAFT FOR APPROVAL`  
Recorded: 2026-07-25, Asia/Makassar  
Authority: V3.1 target master + dated Decision Log  
Implementation: none; this document does not authorize schema or migration changes

Media-specific requirements are normatively expanded in `OTHER_BALI_MEDIA_CONTRACT_V1.md` under `MEDIA-002`.

## Contract rules

- Canonical entities remain distinct: Organization, Place, Experience, Experience Offering, Event, Offer, Route, RouteStop, Collection, Area, MediaAsset, Source, Verification, Trip, InteractionEvent and PartnerAccount.
- Legacy tables/types are AS-IS carriers until Migration Map V1 is approved.
- Public reads expose published data; `unknown` is explicit (`null`, hidden or `needs_verification`).
- `verified` requires a verification status and date; `open_now` requires verified current hours.
- Official actions are individually verified. A click is Intent; only a supported seated reservation is an Outcome.
- Database names are `snake_case`; domain names are `camelCase`; mapping occurs once at the data boundary.

## Core field contract

| Canonical entity | Required contract fields | Evidence / owner | Publication rule | Current AS-IS carriers |
|---|---|---|---|---|
| Organization | `id`, `name`, `status`, `source_id`, `verified_at`, `verified_by` | official/provider source; data owner | publish only when identity is resolved | `venues` brand fields, `organizations` where present |
| Place | `id`, `organization_id?`, `name`, `area_id`, `place_type`, `publication_status`, `status`, `source_id`, `verified_at`, `verified_by` | official source + editorial review | `published` and not closed/stale beyond policy | `venues`, `districts`, `ContentPage` |
| Area | `id`, `slug`, `name`, `parent_area_id?`, `area_type`, `status` | canonical geography source | only approved taxonomy keys | `districts`, route geography |
| Experience | `id`, `title`, `experience_type`, `place_id?`, `publication_status`, `source_id`, `verified_at` | official/editorial | distinct traveller job + enough verified material | editorial/content tables |
| Experience Offering | `id`, `experience_id`, `provider_id?`, `title`, `schedule?`, `booking_capability?`, `source_id`, `verified_at`, `status` | operator/official source | do not imply availability without current evidence | legacy package/booking fields |
| Event | `id`, `title`, `start_at`, `end_at?`, `place_id?`, `source_id`, `verified_at`, `publication_status` | organizer/official source | hide expired or unverified volatile data | event/content records |
| Offer | `id`, `place_id?`, `experience_id?`, `offer_type`, `benefit`, `terms`, `valid_from?`, `valid_until?`, `status`, `source_id`, `verified_at` | official partner/source | contextual only; never organic rank | `perks`, `offers`, redemption migrations |
| Route | `id`, `title`, `area_id?`, `route_type`, `publication_status`, `source_id`, `verified_at` | editorial + source set | publish only with useful stops and action path | `plan_entries`, route/content pages |
| MediaAsset | `id`, `entity_type`, `entity_id`, `asset_type`, `url`, `source_id`, `rights_status`, `verified_at`, `status` | rights/source owner | public only when rights and source are known | `photo_url`, `image_url`, storage records |
| Source | `id`, `source_type`, `locator`, `owner`, `captured_at`, `expires_at?`, `status` | source steward | required for volatile/public claims | scattered URL/source fields |
| Verification | `id`, `entity_type`, `entity_id`, `field_name`, `status`, `verified_at`, `verified_by`, `method`, `notes?` | named verifier | `verified` is never a bare boolean | `verified_at`, `last_verified_at`, ad hoc flags |
| VenueActionCapability | `id`, `place_id`, `action`, `target`, `source_id`, `verified_at`, `expires_at?`, `status` | official action source | show only individually verified target | website/menu/social/booking fields |
| Trip | `id`, `guest_ref`, `title`, `status`, `created_at`, `updated_at` | user-owned state | private; preserve GuestRef semantics | `shared_lists`, `plan_entries` |
| InteractionEvent | `id`, `event_name`, `occurred_at`, `guest_ref?`, `place_id?`, `route?`, `metadata` | analytics owner | event taxonomy allowlist; no PII by default | existing analytics events |
| PartnerAccount | `id`, `organization_id`, `status`, `role`, `created_at` | partner/admin | partner writes cannot alter editorial verdict/rank | partner/admin tables |

## Truth and money fields

| Field | Type / allowed values | Rule |
|---|---|---|
| `publication_status` | `draft`, `published`, `unpublished`, `closed` | required for public reads |
| `verification_status` | `verified`, `needs_verification`, `disputed`, `stale` | pair with `verified_at` and `verified_by` |
| `hours_status` | `verified`, `stale`, `unknown` | `open_now` is derived only from verified current hours |
| `freshness_at` | timestamp | field-specific evidence timestamp; never derive from `updated_at` |
| `official_action_status` | `verified`, `unverified`, `expired`, `unknown` | hide or label unknown target; never imply officiality |
| `reservation_stage` | `intent`, `confirmed`, `seated` | only `seated` can be billable under MONEY-001 |
| `is_sponsored` | legacy only; not canonical | must not influence public rank, placement or copy |

## Approval and non-goals

This draft is ready for owner/data review. It does not create tables, fields, migrations, API contracts or UI. Any field addition, entity merge or money interpretation requires a dated Decision Log amendment.
