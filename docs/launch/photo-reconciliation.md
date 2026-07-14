# Venue-photo reconciliation and cleanup runbook

Status: implementation runbook; no production application or owner-rights approval is claimed.

## Safety boundary

- Operate only against the exact reviewed Supabase project and private `venue-photos` bucket. Keep the service-role key in protected operations; never put it in a browser, artifact or log.
- Back up the database and prove restore before applying `0041`. Apply the tracked migration chain in order and do not edit migration history to bypass a preflight failure.
- `0041` intentionally converts every historical submission to `reconcile_required`, so readiness remains closed until each row is checked. It does not infer Storage presence, SHA-256 or consent from a URL.
- Public reachability, an official source page or an existing `/venue-photos/draft/` URL is not exact-image owner consent. Never create consent on an owner's behalf and never publish a collected candidate automatically.

## Historical reconciliation

For every `reconcile_required` row, under an authorized operator record:

1. Read only the row ID, venue slug and private object path needed for the operation. Do not copy submitter contact/IP into tickets or artifacts.
2. Download the exact private object. If present, validate the supported image signature/size and compute SHA-256 from the downloaded bytes. Call `reconcile_venue_photo_storage(id, venue_slug, image_path, true, sha256_hex)`.
3. If the object is confirmed absent, call `reconcile_venue_photo_storage(id, venue_slug, image_path, false, null)`. Then use the consent-aware cleanup RPCs to close an unconsented missing row; never claim that a consented missing object is healthy.
4. Resolve `consent_reconciliation_required` manually against the exact submission IDs and consent row. Do not rewrite or fabricate evidence.
5. A present object without exact consent stays `staging`. Contact the representative through the approved process and obtain exact-image consent, or request cleanup after the retention/right-to-erasure decision. Only an uploaded digest-bound object with exact consent can become `pending` review.

Record aggregate counts by lifecycle state before and after reconciliation. Do not include record IDs, paths, contacts, IP addresses, credentials or object URLs in launch artifacts.

## Bounded cleanup operator

The repository command is dry-run by default and emits aggregate counts only:

```bash
npm run photo:cleanup -- --limit 25 --grace-minutes 60
```

After reviewing the target project, aggregate dry-run result and approved grace period, an authorized operator may apply one bounded batch:

```bash
npm run photo:cleanup -- --apply --limit 25 --grace-minutes 60
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are required in the protected execution environment. The limit is 1–100; grace is 15–10,080 minutes. The job considers only grace-aged `cleanup_pending` rows or stale unconsented `reserved`/`uploaded` rows. Before touching Storage it re-runs the row-locking consent-aware cleanup CAS. It treats confirmed object absence idempotently, verifies every Storage/RPC result and never processes `reconcile_required`, `missing`, consented, pending-review or approved rows.

Repeat bounded dry/apply batches until the approved queue is empty. A scheduler, alert owner, retry policy and grace value must be explicitly configured in production operations. This crash reconciler does not decide legal retention and must not be repurposed to delete consented evidence.

## Release verification

After reconciliation and cleanup:

1. Confirm aggregate lifecycle counts contain no `reconcile_required`, `missing` or `cleanup_pending` rows and no stale unconsented `reserved`/`uploaded` rows.
2. As `service_role`, require `release_readiness_v2()` to equal `{ "ok": true, "version": 2, "schemaRevision": "0041" }` exactly.
3. Verify `/api/health/ready` returns success in the production-like environment without exposing dependency details.
4. Exercise one new exact-consent submission, an exact retry, an ambiguous-response reconciliation, rejection, digest-checked approval/delivery and an unconsented grace-delayed cleanup.
5. Retain only aggregate evidence and the change/run identifiers approved by operations.

The non-destructive `0041` rollback revokes photo mutations/reconciliation and the v2 probe while retaining rows, consent, digests and objects. It does not make an unresolved production state launchable.
