import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  parseCleanupArgs,
  runCleanupSweep,
} from "./reconcile-venue-photo-cleanup.mjs";

const [migration, rollback, sweeper] = await Promise.all([
  readFile(new URL("../supabase/migrations/0041_photo_submission_reconciliation.sql", import.meta.url), "utf8"),
  readFile(new URL("../supabase/rollback/0041_photo_submission_reconciliation.sql", import.meta.url), "utf8"),
  readFile(new URL("./reconcile-venue-photo-cleanup.mjs", import.meta.url), "utf8"),
]);

function functionBody(sql, name) {
  return sql.match(new RegExp(
    `create or replace function public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

test("0041 backfills historical rows to an explicit unresolved state", () => {
  assert.match(migration, /set storage_state = 'reconcile_required'/i);
  assert.match(migration, /status = case[\s\S]*?then 'staging'/i);
  assert.doesNotMatch(migration, /set storage_state = 'removed'[\s\S]*?where[\s\S]*?storage_state is null/i);
  for (const state of [
    "reserved",
    "uploaded",
    "cleanup_pending",
    "removed",
    "reconcile_required",
    "missing",
  ]) {
    assert.match(migration, new RegExp(`'${state}'`, "i"));
  }
});

test("reservation is non-review staging with active, rolling and lifetime bounds", () => {
  const body = functionBody(migration, "reserve_venue_photo_submission");
  assert.match(body, /status in \('staging', 'pending'\)/i);
  assert.match(body, /storage_state = 'cleanup_pending'/i);
  assert.match(body, /created_at >= clock_timestamp\(\) - interval '24 hours'/i);
  assert.match(body, /select count\(\*\) into v_total[\s\S]*?venue_slug = p_venue_slug/i);
  assert.match(body, /v_active >= 5 or v_recent >= 10 or v_total >= 50/i);
  assert.match(body, /'staging'[\s\S]*?'reserved'/i);
  assert.doesNotMatch(body, /delete from/i);
});

test("upload first-writes a 32-byte digest under a row lock", () => {
  const body = functionBody(migration, "mark_venue_photo_uploaded");
  assert.match(migration, /content_sha256 bytea/i);
  assert.match(migration, /octet_length\(content_sha256\) = 32/i);
  assert.match(body, /p_content_sha256 !~ '\^\[0-9A-Fa-f\]\{64\}\$'/i);
  assert.match(body, /decode\(lower\(p_content_sha256\), 'hex'\)/i);
  assert.match(body, /for update/i);
  assert.match(body, /storage_state <> 'reserved'/i);
  assert.match(body, /content_sha256 is not null/i);
});

test("consent serializes with cleanup, is exact-retry idempotent and promotes staging", () => {
  const body = functionBody(migration, "record_venue_photo_consent");
  assert.match(body, /order by submission\.id[\s\S]*?for update/i);
  assert.match(body, /submission\.status <> 'staging'/i);
  assert.match(body, /submission\.storage_state <> 'uploaded'/i);
  assert.match(body, /submission\.content_sha256 is null/i);
  assert.match(body, /consent\.submission_ids && v_ids/i);
  assert.match(body, /'deduplicated', true/i);
  assert.match(body, /status = 'pending'/i);
  assert.match(migration, /venue_photo_consent_log_integrity_guard/i);
  assert.match(migration, /photo consent evidence cannot be deleted/i);
});

test("cleanup proves no consent, scrubs PII and requires removal confirmation", () => {
  const request = functionBody(migration, "request_venue_photo_cleanup");
  const complete = functionBody(migration, "complete_venue_photo_cleanup");
  for (const body of [request, complete]) {
    assert.match(body, /for update/i);
    assert.match(body, /consent\.submission_ids @> array\[p_submission_id\]/i);
  }
  assert.match(request, /status = 'rejected'/i);
  assert.match(request, /submitter_name = null/i);
  assert.match(request, /submitter_contact = null/i);
  assert.match(request, /submitted_ip = null/i);
  assert.match(request, /submitted_ua = null/i);
  assert.match(migration, /photo cleanup request time is immutable/i);
  assert.match(complete, /p_storage_removal_confirmed/i);
  assert.match(complete, /storage_removal_unconfirmed/i);
  assert.match(complete, /storage_state = 'removed'/i);
});

test("approval and rejection require uploaded exact-byte consent", () => {
  for (const name of ["approve_venue_photo_submission", "reject_venue_photo_submission"]) {
    const body = functionBody(migration, name);
    assert.match(body, /status <> 'pending'/i);
    assert.match(body, /storage_state <> 'uploaded'/i);
    assert.match(body, /content_sha256 is null/i);
    assert.match(body, /consent\.submission_ids @> array\[p_submission_id\]/i);
  }
});

test("service role has read-only table access and mutation RPCs are explicit", () => {
  assert.match(
    migration,
    /revoke all on table public\.venue_photo_submissions[\s\S]*?service_role;[\s\S]*?grant select on table public\.venue_photo_submissions to service_role/i,
  );
  assert.match(migration, /revoke insert, update, delete on table public\.consent_log from service_role/i);
  assert.match(migration, /photo submission rows are durable and cannot be deleted/i);
  for (const name of [
    "reserve_venue_photo_submission",
    "mark_venue_photo_uploaded",
    "record_venue_photo_consent",
    "request_venue_photo_cleanup",
    "complete_venue_photo_cleanup",
    "reconcile_venue_photo_storage",
    "reject_venue_photo_submission",
    "approve_venue_photo_submission",
  ]) {
    assert.match(migration, new RegExp(`grant execute on function public\\.${name}[\\s\\S]*?to service_role`, "i"));
  }
});

test("readiness v2 pins 0040 and fails every unresolved or invalid photo state", () => {
  const body = functionBody(migration, "release_readiness_v2");
  assert.match(body, /v_v1 := public\.release_readiness_v1\(\)/i);
  assert.match(body, /v_v1->>'version' = '1'/i);
  assert.match(body, /v_v1->>'schemaRevision' = '0040'/i);
  assert.match(body, /'reconcile_required', 'missing', 'cleanup_pending'/i);
  assert.match(body, /current_timestamp - interval '1 hour'/i);
  assert.match(body, /status in \('pending', 'approved'\)/i);
  assert.match(body, /'version', 2/i);
  assert.match(body, /'schemaRevision', '0041'/i);
});

test("rollback is non-destructive and disables every photo mutation", () => {
  assert.doesNotMatch(rollback, /drop table|drop column|delete from|truncate/i);
  assert.match(rollback, /grant select on table public\.venue_photo_submissions to service_role/i);
  assert.match(rollback, /revoke all on function public\.release_readiness_v2\(\)/i);
  assert.doesNotMatch(rollback, /grant execute/i);
});

test("cleanup runner is bounded, dry-run by default and excludes unresolved reconciliation", () => {
  assert.deepEqual(parseCleanupArgs([]), {
    apply: false,
    limit: 25,
    graceMinutes: 60,
  });
  assert.equal(parseCleanupArgs(["--apply", "--limit", "7"]).apply, true);
  assert.throws(() => parseCleanupArgs(["--limit", "101"]));
  assert.throws(() => parseCleanupArgs(["--grace-minutes", "1"]));
  assert.match(sweeper, /\.eq\("storage_state", "cleanup_pending"\)/);
  assert.match(sweeper, /\.lt\("cleanup_requested_at", staleBefore\)/);
  assert.match(sweeper, /\.order\("cleanup_requested_at", \{ ascending: true \}\)/);
  assert.match(sweeper, /\.in\("storage_state", \["reserved", "uploaded"\]\)/);
  assert.doesNotMatch(sweeper, /\.in\("storage_state", \[[^\]]*reconcile_required/);
  assert.doesNotMatch(sweeper, /console\.log\([^)]*(candidate|imagePath|venueSlug)/i);
});

function query(result) {
  const chain = {
    select() { return chain; },
    eq() { return chain; },
    in() { return chain; },
    is() { return chain; },
    lt() { return chain; },
    order() { return chain; },
    limit() { return chain; },
    then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); },
  };
  return chain;
}

function fakeClient({ queryResults, rpcResults = [], storageResults = [] }) {
  const calls = [];
  return {
    calls,
    from() {
      const result = queryResults.shift();
      return query(result);
    },
    async rpc(name, payload) {
      calls.push({ kind: "rpc", name, payload });
      return rpcResults.shift() ?? { data: null, error: { code: "missing_mock" } };
    },
    storage: {
      from() {
        return {
          async remove(paths) {
            calls.push({ kind: "storage", pathCount: paths.length });
            return storageResults.shift() ?? { data: [], error: null };
          },
        };
      },
    },
  };
}

const stale = {
  id: "00000000-0000-4000-8000-000000000041",
  venue_slug: "test-venue",
  image_path: "test-venue/private-object.webp",
  storage_state: "uploaded",
  created_at: "2026-07-14T00:00:00.000Z",
  updated_at: "2026-07-14T00:00:00.000Z",
};

test("dry-run reads bounded work without mutating storage or rows", async () => {
  const client = fakeClient({
    queryResults: [
      { data: [], error: null },
      { data: [stale], error: null },
    ],
  });
  const summary = await runCleanupSweep(client, {
    apply: false,
    limit: 5,
    graceMinutes: 60,
    now: Date.parse("2026-07-14T02:00:00.000Z"),
  });
  assert.equal(summary.mode, "dry-run");
  assert.equal(summary.scanned, 1);
  assert.deepEqual(client.calls, []);
  assert.equal(JSON.stringify(summary).includes(stale.image_path), false);
});

test("apply survives the remove-before-complete crash boundary idempotently", async () => {
  const pending = { ...stale, storage_state: "cleanup_pending" };
  const client = fakeClient({
    queryResults: [
      { data: [pending], error: null },
      { data: [], error: null },
    ],
    storageResults: [{ data: null, error: { statusCode: 404 } }],
    rpcResults: [
      { data: { ok: true, storage_state: "cleanup_pending", deduplicated: true }, error: null },
      { data: { ok: true, storage_state: "removed" }, error: null },
    ],
  });
  const summary = await runCleanupSweep(client, {
    apply: true,
    limit: 5,
    graceMinutes: 60,
    now: Date.parse("2026-07-14T02:00:00.000Z"),
  });
  assert.equal(summary.removed, 1);
  assert.deepEqual(client.calls.map((call) => `${call.kind}:${call.name ?? call.pathCount}`), [
    "rpc:request_venue_photo_cleanup",
    "storage:1",
    "rpc:complete_venue_photo_cleanup",
  ]);
  assert.equal(
    client.calls[2].payload.p_storage_removal_confirmed,
    true,
  );
});

test("stale work must pass the consent-aware CAS before Storage removal", async () => {
  const client = fakeClient({
    queryResults: [
      { data: [], error: null },
      { data: [stale], error: null },
    ],
    rpcResults: [{ data: { ok: false, error: "consent_recorded" }, error: null }],
  });
  const summary = await runCleanupSweep(client, {
    apply: true,
    limit: 5,
    graceMinutes: 60,
    now: Date.parse("2026-07-14T02:00:00.000Z"),
  });
  assert.equal(summary.consentRecorded, 1);
  assert.deepEqual(client.calls.map((call) => call.kind), ["rpc"]);
});

test("every candidate query error fails the runner closed", async () => {
  const client = fakeClient({
    queryResults: [
      { data: null, error: { code: "db_unavailable" } },
      { data: [], error: null },
    ],
  });
  await assert.rejects(
    runCleanupSweep(client, { apply: false, limit: 5, graceMinutes: 60 }),
    /cleanup_pending_query_failed/,
  );
});
