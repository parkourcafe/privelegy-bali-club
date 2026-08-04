# Other Bali Intent OS — Live Supabase Verification v1.0

Date: 2026-07-28
Mode: strictly read-only.

## STATUS

**PARTIAL / AGGREGATE VERIFIED**

Owner-provided sanitized aggregate exports verified live schema presence, venue coverage counts and function inventory. No raw row export, personal data, secret or credential was accessed.

Still unverified: live grants, migration/deployment evidence and whether RPC execution is currently wired to the deployed migration state.

## Authorized verification scope

The owner authorized aggregate-only inspection of:

- schema/table presence;
- row-level coverage counts and null counts for intent-support fields;
- relevant RPC/function availability;
- grants visible to application roles;
- deployment/migration evidence where read-only inspection permits it.

The owner-provided aggregate exports cover schema presence, field coverage and function inventory. Grants and migration/deployment evidence still require separate read-only metadata.

## Live aggregate evidence received

### Tables/schema

The owner-provided schema export confirms these relevant tables:

```text
events
guest_refs
saved_places
shared_lists
venues
```

`shared_trips` was not present in the provided table/column export. This remains a schema/RPC reconciliation gap because `create_shared_trip` and `shared_list_trip` functions are present.

### Venue coverage

```text
total_rows: 1277
slug: 1277
 district: 1277
category: 1277
jobs: 248
practical_tags: 28
best_for: 1026
last_verified_at: 859
publication_status: 1277
```

Interpretation: identity, district and category are complete in the export; `jobs` and `practical_tags` are sparse; `best_for` and `last_verified_at` are partial.

### RPC/function inventory

The export confirms all requested functions are present in `public`:

```text
create_shared_list
create_shared_trip
log_event
log_event_v2
move_trip_place
reorder_trip_place
saved_trip_for
set_saved_place
shared_list_trip
upsert_trip_place
```

### Grants/deployment

Not supplied; status remains `BLOCKED_ACCESS` for grants and migration/deployment evidence.

## Static evidence available locally

### Venue mapping

`lib/data.ts` maps the venue intent-support contract, including:

```text
id, slug, name, district, category, area, status,
publication_status, photo_status, last_verified_at,
gmaps_url, official_url, instagram_url,
jobs, practical_tags, why_its_here, best_for, not_for,
what_to_order, price_anchor, owner_note
```

### Save/trip/share boundary

- `app/api/save/route.ts` calls `setSavedPlace` through the data layer.
- `app/api/trip/route.ts` calls add/move/reorder data operations.
- `app/api/list/route.ts` calls shared-list/shared-trip creation.
- `lib/data.ts:1235-1405` uses `serviceClient()` for protected operations.
- `supabase/migrations/0056_saved_place_trip_extension.sql` revokes protected RPCs from browser roles and grants service role.

### Local smoke evidence

- `scripts/wave1-trip-boundary.test.mjs`: 14/14 PASS.
- `bash scripts/wave2-event-db-smoke.sh`: PASS against an isolated local smoke database.

These are not production Supabase evidence.

## Required live checks when access is available

1. `information_schema.tables` for `venues`, `saved_places`, `shared_lists`, `events`, `guest_refs`.
2. `information_schema.columns` for the intent-support fields listed above.
3. Aggregate `count(*)` and `count(field)` only; no raw row export.
4. `pg_proc` / safe metadata inspection for `set_saved_place`, `saved_trip_for`, `upsert_trip_place`, `move_trip_place`, `reorder_trip_place`, `create_shared_list`, `create_shared_trip`, `shared_list_trip`, `log_event`, `log_event_v2`.
5. `information_schema.routine_privileges` or equivalent read-only grants inspection for `anon`, `authenticated`, `service_role`.
6. Migration/deployment evidence from read-only metadata only.

## ACCESS_BLOCKERS

- Live grants were not included in the sanitized export.
- Migration/deployment evidence was not included.
- `shared_trips` table presence is unresolved.
- Existing `scripts/export-venues-readonly.mjs` is a raw-row exporter containing personal fields such as email, phone and WhatsApp; it was not run under the aggregate-only policy.

## UNRESOLVED_ISSUES

- Row-level field coverage beyond the supplied aggregate fields: BLOCKED_ACCESS.
- Live grants: BLOCKED_ACCESS.
- Migration/deployment evidence: BLOCKED_ACCESS.
- `shared_trips` table/function relationship: unresolved.

## Handoff

STATUS: PARTIAL / AGGREGATE VERIFIED
FILES_CREATED: this verification report
FILES_CHANGED: no production files
LIVE_SYSTEMS_READ: owner-provided sanitized aggregate Supabase exports
ACCESS_BLOCKERS: grants, migration/deployment evidence and shared_trips reconciliation
UNRESOLVED_ISSUES: live grants; migration state; shared_trips table/function relationship
OWNER_DECISIONS_REQUIRED: provide grants/deployment metadata only if production readiness claim is required
QUALITY_SCORE: 78/100 for aggregate live verification
RECOMMENDED_NEXT_STEP: provide routine privileges/grants and migration metadata, still aggregate/read-only
