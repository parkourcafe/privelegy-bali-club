# Live production forward-repair decision — 2026-07-14

## Decision

Do not replay or rename legacy migrations `0015`–`0019`. Their duplicated
repository versions do not describe the live database reliably, and editorial
changes in that range were historically applied outside the migration ledger.

For this release, apply only the reviewed forward repairs, as exact SQL batches,
in this order:

1. `0031_secure_partner_operator_rpcs.sql`
2. `0032_menu_action_foundation.sql`
3. retain the already-applied `0033_venue_photo_consent_staging.sql`
4. retain the already-applied `0034_transactional_data_ops_import.sql`

This is a direct forward repair, not a replay of the ambiguous legacy history.
Future migration-ledger cleanup must record a baseline without re-executing
legacy `0015`–`0019` bodies.

## Evidence

- The independent read-only production snapshot recorded 12 migration-ledger
  entries and confirmed that legacy editorial data exists outside that ledger.
- Emergency onboarding-token rotation and public RPC lockdown have already been
  applied independently.
- A corrected live Data API probe on 2026-07-14 found `0031` tables
  `perk_offer_confirmations` and `attribution_sources` absent, and `0032` tables
  `menus`, `menu_sections`, `menu_items`, and `venue_action_capabilities` absent.
- The same probe found `0033` tables `venue_photo_tokens` and
  `venue_photo_submissions` present, and the `0034` import ledger present.
- The `0034` RPC is visible to `service_role` and reaches its body, but correctly
  fails with SQLSTATE `42P01` until `0032` creates `public.menus`.
- Exact `0031`–`0034` production-order SQL was previously replayed successfully
  against a disposable PostgreSQL 16 clone with stop-on-first-error enabled.

## Safety boundary

- Apply `0031` and `0032` as their complete transactional batches; do not extract
  individual tables or functions.
- Do not import until both transactions commit and the Data API schema cache is
  reloaded.
- The first package apply must remain atomic and draft-only: `127` menus,
  `165` sections, `881` items, and `250` action drafts, with
  `verified_at = null` and no public visibility.
- Publication remains a separate operator action. Only the fully sourced KYND
  candidate may proceed to verification; partial menus, unverified actions, and
  photos without exact-image consent remain closed.
