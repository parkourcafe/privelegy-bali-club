# C-04 venue model migration

## Scope

`0035_normalize_venue_model.sql` adds the normalized venue fields and private `venue_photos` evidence table without removing or renaming legacy fields. `price_anchor`, `category`, `area`, `address`, `opening_hours`, `last_verified_at`, `publication_status`, `jobs`, `vibe_tags` and `photo_url` remain available during rollout.

Only unambiguous values are copied:

- an approved legacy category becomes `venue_type`;
- non-empty `address` becomes `full_address`;
- a single, non-slash-delimited `area` becomes `subarea`;
- `last_verified_at` becomes UTC `verified_at`;
- verified fact-ledger rows receive the provenance pointer `venue_fact_sources`;
- officially verified legacy hours are preserved as JSON;
- legacy photos are marked `needs_verification`, never approved or published.

Prices are not parsed from `price_anchor`. Jobs are not relabeled as occasions. Ambiguous areas such as `Batu Bolong / Berawa` remain unset.

## Apply procedure

1. Confirm production has the tracked chain through `0034_transactional_data_ops_import.sql`. Do not infer this from repository files.
2. Take a database backup and test restore.
3. Apply `0035` through `0041` in order in staging. `0040` deliberately fails if duplicate agreed listing confirmations require operator reconciliation. `0041` deliberately marks every historical photo submission `reconcile_required`; it never guesses object presence, content digest or consent.
4. Run `select * from public.venue_model_backfill_review();` as `service_role` and save the result as launch evidence.
5. Produce a complete operator snapshot, then run `tsx scripts/backfill-venue-model.ts --input <operator-snapshot.json>` for deterministic backfill/manual-review artifacts. The CLI is credential-free and has no write mode. It deliberately rejects anonymous DB mode because venue RLS hides review rows. Then run the public venue audit. A scrubbed fixture report is not production evidence.
6. Exercise signed identity bootstrap/legacy handling, consent accept/withdraw, export/deletion serialization, tombstone resurrection denial, idempotent save state, owned-list creation, atomic source capture, event rate limiting, direct anon denial for `submit_guide_lead`, and generic public guide-lead acknowledgement in staging.
7. Exercise listing-confirmation first-write, exact owner-note retry, venue-wide owner-note/menu/action ceilings, atomic menu creation and disabled legacy menu follow-up writes.
8. Reconcile every historical photo row from the actual private object: record presence plus downloaded-byte SHA-256, or record confirmed absence. Match any consent to the exact submission/image; retain unconsented present objects in staging until the owner acts, and safely close absent/unconsented rows. Run the cleanup operator dry-first after the configured grace. The exact procedure is in `docs/launch/photo-reconciliation.md`.
9. Require `release_readiness_v2()` to return exactly `{ "ok": true, "version": 2, "schemaRevision": "0041" }` as `service_role` in staging.
10. Apply in production using the normal Supabase migration workflow.
11. Deploy the runtime only after PostgREST sees the new RPC signatures and production reconciliation/readiness is complete.

## Data constraints

- venue type, editorial status, meal period, photo status and price band use controlled values;
- coordinates must be a complete in-range pair;
- minimum price cannot exceed maximum price;
- `editorial_status=published` requires timestamp and source;
- only one `venue_photos.is_primary=true` row is allowed per venue;
- a published photo requires verification plus rights basis and holder;
- `venue_photos` is RLS-enabled, forced-RLS and has no anon/authenticated policy.

## Rollback

Application rollback uses the unchanged legacy columns. Do not drop C-04 columns or `venue_photos` after writes begin. The non-destructive RPC rollback is `supabase/rollback/0035_0037_launch_foundation.sql`; it removes only new callable privacy/event surfaces and retains collected data and constraints.

`0038` is a privilege-repair migration. Application rollback may disable the guide form, but must not restore `anon`/`authenticated` execute access to `submit_guide_lead`. Its two fixed-window columns are harmless if the form is disabled and should be retained with existing lead evidence.

`0039` is also a safety migration. Its non-destructive rollback may revoke new callable surfaces, but must not drop the GuestRef tombstone table, resurrection triggers, shared-list ownership constraint or collected data. Reopening writes without the barrier is not an acceptable application rollback.

`0040` rollback revokes all hardened token-write RPCs and its readiness probe. It retains listing evidence, private hash ledgers, append-only protection and counters; restoring the prior unbounded functions is not an acceptable rollback.

`0041` rollback revokes all photo mutation/reconciliation RPCs and `release_readiness_v2`. It retains submission rows, consent, lifecycle state, digests and private objects. Never roll back by restoring direct service-role DML or by deleting unresolved evidence.

## Manual blockers

- highest applied production migration is not yet evidenced;
- production backfill-review output is not yet captured;
- ambiguous geography and jobs-to-occasion classification need editorial review;
- no legacy photo is promoted without exact rights evidence;
- every production historical photo row still requires an exact Storage/digest/consent reconciliation after `0041`;
- the protected cleanup schedule, owner, grace period and aggregate evidence are not configured;
- schema application requires authorized Supabase production access.

## Local replay evidence (2026-07-14)

A fresh disposable PostgreSQL 16 database applied the local Supabase bootstrap, `0001`, the seed and every tracked migration through `0041`. Onboarding and photo lifecycle smokes passed; `0040` and `0041` repeated cleanly; their non-destructive rollbacks removed service execution while preserving tables/state; reapply and both smokes passed; the final exact probe returned `{ "ok": true, "version": 2, "schemaRevision": "0041" }`. A separate seeded legacy-photo rehearsal moved a historical `pending` row to `staging/reconcile_required` before explicit reconciliation. This is migration-contract evidence only, not proof of production backup, data reconciliation or application.

## Read-only CLI evidence

`scripts/backfill-venue-model.ts` mirrors only the migration's one-to-one rules and writes `backfill-review.json` plus `backfill-review.md`. Snapshot mode is deterministic and credential-free. The CLI intentionally rejects anonymous database mode: RLS exposes only the public subset, so treating that as a complete manual-review report would be unsafe. It has no apply/write flag and never reads a service-role key; migration `0035` performs the transaction-safe deterministic updates, while the report keeps ambiguous geography, provenance, occasions and photo rights visible for editorial review. Production completeness is evidenced separately by the service-only `venue_model_backfill_review()` output and a controlled complete snapshot.
