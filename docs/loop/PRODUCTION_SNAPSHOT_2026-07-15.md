# Production Supabase snapshot & migration reconciliation — 2026-07-15

Read-only snapshot of production project `egkdapqwkfprtyqvvnso` ("bali-privilege",
ap-southeast-1, Postgres 17.6, ACTIVE_HEALTHY), taken via the Supabase MCP from a
session that DOES have access (a prior session reported `permission denied`; this
one did not). Schema/metadata only — no row data was read, so no PII. This is the
fresh read-only snapshot required by P0.3 of
`docs/OTHER_BALI_PLATFORM_ARCHITECTURE_20260715.md`.

## Key finding (blocking for any Auth/RLS migration)

**The migration tracking table is NOT a reliable record of what is applied.**

- `supabase_migrations` records only **12** migrations, by name (below).
- The repo carries **42** migration files (`0001`–`0034`, with duplicate numbers).
- Yet the live schema contains objects from migrations well beyond the tracked
  12 — `menus` / `menu_items` / `menu_sections` / `venue_action_capabilities`
  (from `0032_menu_action_foundation`), `venue_photo_*` (from `0030`/`0033`),
  `data_ops_*` (from `0034`). Those were applied but never recorded.

Consequences for the next migration:

1. **Do not trust `supabase_migrations`; treat the live schema as truth.**
2. **Do not run a blind `supabase db push`** — it will try to re-apply objects
   that already exist and fail (or partially apply).
3. Reconcile the intended Auth/membership migration against the **actual schema**
   (introspect tables/columns/constraints), then write a forward-only migration
   that is idempotent (`IF NOT EXISTS` / guarded) and records itself cleanly.

## Applied migrations recorded in production (12)

```
20260626173847  init_schema
20260626173908  redemption_rpc
20260626191348  attribution_events
20260626194223  phase0_overview
20260706125243  venue_card_fields
20260706125304  routes
20260706125322  tablepilot_bridge
20260706162520  partner_onboarding
20260706162932  onboard_token_fix
20260711174018  onboard_jtbd
20260712025948  invite_roster
20260713155629  photo_consent
```

## Repo migration files (42) — duplicate numbers to resolve

Sets sharing a number (parallel-loop collisions; ordering is ambiguous):

```
0015  onboard_jtbd            | publish_collected_venues
0016  deepen_five_district_…  | invite_roster
0017  normalize_jobs_slugs    | owner_note
0018  dedupe_venue_twins      | uluwatu_launch
0019  saved_places_and_shar…  | ubud_brunch_venues
0031  canggu_local_food       | forget_guest            | secure_partner_operator_rpcs
0032  menu_action_foundation  | warungs_sanur_seminyak_nusadua
```

Also: `onboard_token_fix` is tracked in prod but has no exact repo-name match
(closest is `0012_onboard_status`); repo files `0006`, `0008`, `0009`, `0013`,
`0014`, `0017`–`0029`, `0031`–`0034` are not individually recorded in the prod
tracking table even though their schema objects are present.

## Live content counts (the "exact numbers" P0 asked for)

All tables have RLS enabled. Row counts:

| Table | Rows | Note |
|---|---|---|
| venues | 556 | |
| menus | 129 | structured menus (KYND etc. published) |
| menu_sections | 230 | |
| menu_items | 1232 | |
| venue_action_capabilities | 328 | reserve/delivery/takeaway/website/whatsapp |
| perks | 47 | |
| districts | 15 | |
| routes / route_stops | 3 / 10 | |
| events | 364 | |
| venue_fact_sources | 38 | provenance |
| venue_onboard_tokens | 462 | tokenized invites (the current "identity") |
| venue_photo_submissions | 91 | **private** candidates |
| venue_photos | 0 | none published (consent gate holding) |
| venue_photo_consents | 0 | no owner consent logged yet |
| menu_operator_review_events | 2 | |
| data_ops_import_runs / menu_import_runs | 1 / 1 | |
| guest_refs / saved_places / shared_lists / guide_leads / consent_log / redemption_events / attribution_sources / perk_offer_confirmations / venue_confirmations | 0 | |

The earlier "427 candidates" figure (127 menus + 250 actions + 50 Maps) is
superseded by live counts: **129 menus, 328 action capabilities, 556 venues,
1232 menu items.**

## Confirms for the architecture checkpoint

- **No durable restaurant identity exists** — there is no membership/user table
  in `public`; `venue_onboard_tokens` (462 rows) is still the only "credential."
  This is exactly what P1 step 4 must add.
- **Photo consent gate is holding** — 91 private submissions, 0 published photos,
  0 consents. Matches AGENTS.md content-publication rule v2.
- **Menu/action foundation is live** — the four approved entities exist and carry
  real data, so the partner workspace edits an existing schema, not a green field.

## Not done here (still founder/Codex actions)

- No migration was applied; no data written; production untouched.
- Codex still needs GitHub branch protection + `main` as default (external P0).
