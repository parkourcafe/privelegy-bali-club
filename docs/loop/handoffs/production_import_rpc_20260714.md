# Transactional production import rehearsal — 2026-07-14

## Scope

This rehearsal validates the production-only Data Ops import boundary introduced
by `0034_transactional_data_ops_import.sql` and
`/api/admin/data-ops-import`. It did not connect to or mutate production.

Reviewed immutable package:

- package digest: `ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081`
- input digest: `79eac95c0d8a93a18045b1a4d79691d2c1ac5fe869bd41ea9764010412844e9a`
- source files: `55`
- package rows: `127` menus, `165` sections, `881` items, `250` action drafts
- directions candidates intentionally not applied: `50`

## Exact-schema disposable rehearsal

Current `0032`, `0033` and `0034` SQL files were replayed as complete batches on
a disposable PostgreSQL 16.14 database. The package was then sent through
Supabase JS and PostgREST using a disposable local `service_role` JWT.

The target included one simulated confirmed WhatsApp compatibility action. The
import preserved it as version 1, created the reviewed package action as draft
version 2, and linked `replaces_capability_id` to the confirmed row.

Observed import response:

```json
{
  "ok": true,
  "alreadyImported": false,
  "packageDigest": "ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081",
  "menus": 127,
  "sections": 165,
  "items": 881,
  "capabilities": 250,
  "venueMapsNotApplied": 50
}
```

Post-apply reconciliation:

- imported menus/sections/items/action drafts: `127 / 165 / 881 / 250`
- menu state: `1 full draft`, `126 partial drafts`
- import ledger rows: `1`, attributed to `service_role`
- duplicate menu/action versions: `0 / 0`
- orphan sections/items: `0 / 0`
- anonymous menu visibility: `0`
- anonymous draft-action visibility: `0`
- KYND exact content: `22` sections and `120` items
- second exact call: `alreadyImported=true`
- modified package digest after the first call: rejected

## Rollback proof

A second disposable target retained only the simulated confirmed compatibility
action. A package copy was modified to create an item-position collision after
the transaction had begun. PostgreSQL rejected it with SQLSTATE `23505`.

Counts after failure:

```json
{
  "menus": 0,
  "menu_sections": 0,
  "menu_items": 0,
  "venue_action_capabilities": 1,
  "data_ops_import_runs": 0
}
```

The one remaining action was the pre-existing confirmed compatibility row. No
partial package row or ledger record survived.

## Application gate verification

- all repository Node tests: `57/57` passed
- TypeScript: passed
- ESLint with zero warnings: passed
- optimized Next.js production build: passed
- the import route is absent outside exact production context (`404`)
- production access requires a one-time secret of at least 48 characters, a
  timing-safe comparison, the exact target Supabase ref and both supplied and
  recomputed package digests
- the database RPC is executable only by `service_role`

Cloud preview verification:

- commit: `535586e`
- Vercel deployment: `dpl_4fRc6CzhZo3KdH6EPL6KMiWn4baU` (`READY`)
- preview URL: `https://privelegy-bali-club-7clmzin7b-yulaboober.vercel.app`
- authenticated preview request to `POST /api/admin/data-ops-import`: `404`
- response controls: `private, no-store` and `noindex, nofollow, noarchive`

Current production-content-integrated preview:

- release merge commit: `2d588b5` (includes production content SHA `0c532b0`)
- Vercel deployment: `dpl_GTBvzWh4rDCUVYugXFnGw9LLDWuf` (`READY`)
- `/`, `/ubud/things-to-do`, `/jimbaran` and `/places`: `200`
- `POST /api/admin/data-ops-import` in preview: fail-closed `404`
- build includes `39` application routes and preserves the service-worker
  cache purge/unregister kill-switch from current production

## Full production-order SQL rehearsal

The complete operator sequence was replayed on another disposable clone in the
same order required for production:

1. emergency token lockdown v3
2. zero-downtime service-role bridge
3. `0031_secure_partner_operator_rpcs.sql`
4. `0032_menu_action_foundation.sql`
5. `0033_venue_photo_consent_staging.sql`
6. `0034_transactional_data_ops_import.sql`

The first idempotency pass exposed three pre-existing policy-name collisions in
`0031`. The migration was repaired to drop both legacy and final policy names
before recreating them. The complete sequence then passed with stop-on-first-
error enabled.

Post-sequence assertions:

- onboarding tokens remained one per venue and exactly 64 lowercase hex chars
- `anon` cannot execute invite, redemption or package-import RPCs
- `service_role` can execute all three required boundaries
- venue, perk and plan public policies each exist exactly once
- an anonymous action read returns zero rows instead of a district ACL error
- menu, action, photo-staging and import-ledger tables all exist

## Remaining production sequence

This rehearsal does not authorize immediate public visibility. Production still
requires the zero-downtime service bridge, application promotion, exact schema
SQL `0031`–`0034`, one-time route invocation, operator verification and the
existing publication RPC. Partial menus remain technically unpublishable.
