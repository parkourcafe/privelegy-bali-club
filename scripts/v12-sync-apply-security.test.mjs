import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/migrations/0064_v12_sync_apply.sql", import.meta.url),
  "utf8",
);

test("sync.push validates the supported mutation vocabulary instead of accepting arbitrary shapes", () => {
  assert.match(
    migration,
    /create or replace function public\.v12_runtime_mutate\s*\(\s*p_guest_ref text,\s*p_operation text,\s*p_input jsonb,\s*p_idempotency_key text\s*\)/is,
  );
  assert.match(migration, /p_operation\s*=\s*'sync\.push'/i);
  assert.match(migration, /p_input->>'entityType'/);
  assert.match(migration, /p_input->>'entityId'/);
  assert.match(migration, /p_input->>'operation'/);
  assert.match(migration, /jsonb_typeof\s*\(\s*p_input->'payload'\s*\)\s*(?:<>|!=)\s*'object'/i);
  assert.match(migration, /pg_column_size\s*\(\s*p_input->'payload'\s*\)/i);

  for (const token of [
    "'saved'",
    "'save'",
    "'remove'",
    "'trip_stop'",
    "'add_to_day'",
    "'trip_replace'",
    "'place'",
    "'event_occurrence'",
  ]) {
    assert.match(migration, new RegExp(token, "i"));
  }

  assert.match(migration, /'bad_request'/i);
  assert.doesNotMatch(migration, /'status'\s*,\s*'accepted'/i);
});

test("currently emitted saved, Today and Trip mutations have durable typed write paths", () => {
  assert.ok(
    /(?:insert into|update|delete from)\s+public\.saved_places\b/i.test(migration) ||
      /(?:insert into|update)\s+public\.v12_saved_(?:state|states)\b/i.test(migration),
    "saved save/remove must write saved_places or a dedicated typed saved-state table",
  );
  assert.ok(
    /(?:insert into|update)\s+public\.v12_today_(?:items|sessions)\b/i.test(migration),
    "trip_stop.add_to_day must write durable Today state",
  );
  assert.match(migration, /update\s+public\.v12_trips\b/i);

  assert.match(migration, /'saved'[\s\S]{0,3000}'save'/i);
  assert.match(migration, /'saved'[\s\S]{0,3000}'remove'/i);
  assert.match(migration, /'trip_stop'[\s\S]{0,5000}'add_to_day'/i);
  assert.match(migration, /'trip_stop'[\s\S]{0,5000}'trip_replace'/i);
});

test("visited and note mutations are typed durable state or are explicitly rejected", () => {
  const supportsTypedVisitedAndNotes =
    /create table if not exists public\.v12_visited_(?:state|states)\b/i.test(migration) &&
    /create table if not exists public\.v12_note_(?:state|states)\b/i.test(migration) &&
    /(?:insert into|update)\s+public\.v12_visited_(?:state|states)\b/i.test(migration) &&
    /(?:insert into|update)\s+public\.v12_note_(?:state|states)\b/i.test(migration);
  const explicitlyRejectsUnsupported =
    /(?:entity_type|p_input->>'entityType')[\s\S]{0,1200}(?:not in|<>)\s*\([\s\S]{0,300}'saved'[\s\S]{0,300}'trip_stop'[\s\S]{0,1200}'bad_request'/i.test(
      migration,
    );

  assert.ok(
    supportsTypedVisitedAndNotes || explicitlyRejectsUnsupported,
    "visited/note must be persisted in dedicated typed tables or rejected before acknowledgement",
  );
  assert.doesNotMatch(migration, /create table if not exists public\.v12_sync_(?:entity_)?state\b/i);
});

test("baseVersion conflicts do not apply and return a stable acknowledgement", () => {
  assert.match(migration, /p_input->>'baseVersion'/);
  assert.match(migration, /(?:baseVersion|base_version)[\s\S]{0,1500}(?:<>|!=|=)[\s\S]{0,300}(?:version|server_version)/i);

  const conflictResponse =
    /jsonb_build_object\s*\([\s\S]{0,1200}'ok'\s*,\s*true[\s\S]{0,1200}'status'\s*,\s*'conflict'[\s\S]{0,1200}'idempotencyKey'\s*,\s*p_idempotency_key[\s\S]{0,1200}'serverVersion'\s*,\s*(?:\w+_version|v_version)::text[\s\S]{0,500}\)/i;
  assert.match(migration, conflictResponse);

  const conflictAt = migration.search(/'status'\s*,\s*'conflict'/i);
  const firstStateWriteAt = migration.search(
    /(?:insert into|update|delete from)\s+public\.(?:saved_places|v12_saved_|v12_today_|v12_trips|v12_visited_|v12_note_)/i,
  );
  assert.ok(conflictAt >= 0 && firstStateWriteAt >= 0 && conflictAt < firstStateWriteAt);
});

test("successful mutations are logged as applied with the exact acknowledgement contract", () => {
  assert.match(
    migration,
    /'ok'\s*,\s*true[\s\S]{0,1200}'status'\s*,\s*'applied'[\s\S]{0,1200}'idempotencyKey'\s*,\s*p_idempotency_key[\s\S]{0,1200}'serverVersion'\s*,\s*(?:\w+_version|v_version)::text/i,
  );
  assert.ok(
    /insert into\s+public\.v12_sync_mutations[\s\S]{0,1800}'applied'/i.test(migration) ||
      /update\s+public\.v12_sync_mutations[\s\S]{0,1200}status\s*=\s*'applied'/i.test(
        migration,
      ),
    "the durable mutation ledger must record applied",
  );
  assert.ok(
    /insert into\s+public\.v12_sync_mutations[\s\S]{0,1800}'conflict'/i.test(migration) ||
      /update\s+public\.v12_sync_mutations[\s\S]{0,1200}status\s*=\s*'conflict'/i.test(
        migration,
      ),
    "the durable mutation ledger must record conflict",
  );
});

test("the pull cursor sequence is reconciled with the deployed mutation ledger before allocation", () => {
  const firstCursorAllocationAt = migration.search(
    /nextval\s*\(\s*['"]public\.v12_sync_cursor_seq['"]\s*\)/i,
  );
  assert.ok(firstCursorAllocationAt >= 0, "expected sync cursor allocation");

  const beforeFirstAllocation = migration.slice(0, firstCursorAllocationAt);
  const maxExistingCursorAt = beforeFirstAllocation.search(
    /max\s*\(\s*(?:[a-z_][a-z0-9_]*\.)?server_version\s*\)[\s\S]{0,500}from\s+public\.v12_sync_mutations\b/i,
  );
  assert.ok(
    maxExistingCursorAt >= 0,
    "upgrades must inspect the greatest cursor already issued by v12_sync_mutations",
  );

  const afterLedgerMaximum = beforeFirstAllocation.slice(maxExistingCursorAt);
  assert.ok(
    /setval\s*\(\s*['"]public\.v12_sync_cursor_seq['"][\s\S]{0,1200}\)/i.test(
      afterLedgerMaximum,
    ) ||
      /alter\s+sequence\s+public\.v12_sync_cursor_seq\s+restart(?:\s+with)?\b/i.test(
        afterLedgerMaximum,
      ),
    "the sequence must be advanced from the existing ledger maximum before nextval",
  );
});

test("idempotent replay returns the stored acknowledgement unchanged", () => {
  assert.match(
    migration,
    /select\s+operation\s*,\s*response\s+into\s+\w+\s*,\s*\w+[\s\S]{0,600}from\s+public\.v12_runtime_idempotency/i,
  );
  assert.match(migration, /return\s+v_existing\s*;/i);
  assert.doesNotMatch(migration, /v_existing\s*\|\|/i);
  assert.doesNotMatch(migration, /'replayed'\s*:/i);
});

test("sync idempotency binds the exact mutation request and rejects changed-key replays", () => {
  const fingerprintIdentifier =
    /(?:request|mutation)_(?:fingerprint|hash|digest)|(?:request|mutation)_(?:input|payload)/i;
  assert.match(
    migration,
    new RegExp(
      String.raw`alter\s+table\s+public\.v12_runtime_idempotency[\s\S]{0,1200}add\s+column[\s\S]{0,200}${fingerprintIdentifier.source}`,
      "i",
    ),
    "the deployed idempotency ledger needs a request-binding column",
  );

  const syncIdempotencyInsert =
    /insert\s+into\s+public\.v12_runtime_idempotency\s*\(([\s\S]{0,900})\)\s*values\s*\(([\s\S]{0,1400})\)/gi;
  const boundWrites = [...migration.matchAll(syncIdempotencyInsert)].filter(
    (match) =>
      fingerprintIdentifier.test(match[1]) &&
      /p_input|v_(?:request|mutation)_(?:fingerprint|hash|digest|input|payload)/i.test(
        match[2],
      ),
  );
  assert.ok(
    boundWrites.length >= 2,
    "both applied and conflict sync acknowledgements must persist the exact request binding",
  );

  const existingReplayAt = migration.search(/if\s+v_existing\s+is\s+not\s+null\s+then/i);
  const existingReturnAt = migration.search(/return\s+v_existing\s*;/i);
  assert.ok(existingReplayAt >= 0 && existingReturnAt > existingReplayAt);
  const replayGuard = migration.slice(existingReplayAt, existingReturnAt);
  assert.match(
    replayGuard,
    fingerprintIdentifier,
    "replay must compare the stored request binding, not only the high-level operation",
  );
  assert.match(replayGuard, /p_input|v_(?:request|mutation)_(?:fingerprint|hash|digest|input|payload)/i);
  assert.match(replayGuard, /idempotency_conflict/i);
});

test("legacy accepted sync acknowledgements are reconciled only for an exact matching retry", () => {
  const existingReplayAt = migration.search(/if\s+v_existing\s+is\s+not\s+null\s+then/i);
  const existingReturnAt = migration.search(/return\s+v_existing\s*;/i);
  assert.ok(existingReplayAt >= 0 && existingReturnAt > existingReplayAt);
  const replayGuard = migration.slice(existingReplayAt, existingReturnAt);

  assert.match(
    replayGuard,
    /(?:v_existing|response)\s*->>\s*'status'\s*(?:=|in\s*\()\s*'?accepted'?/i,
    "pre-0064 accepted acknowledgements need a dedicated reconciliation branch",
  );
  assert.match(
    migration,
    /from\s+public\.v12_sync_mutations[\s\S]{0,1000}(?:entity_type|entity_id|operation|payload|base_version)/i,
    "legacy retries must recover the originally accepted mutation from the durable ledger",
  );

  const legacyLedgerAt = migration.search(/from\s+public\.v12_sync_mutations/i);
  assert.ok(legacyLedgerAt >= 0);
  const legacyMatchGuard = migration.slice(
    legacyLedgerAt,
    Math.min(migration.length, legacyLedgerAt + 9000),
  );
  for (const [ledgerField, requestField] of [
    ["entity_type", "entityType"],
    ["entity_id", "entityId"],
    ["operation", "operation"],
    ["payload", "payload"],
    ["base_version", "baseVersion"],
  ]) {
    assert.match(legacyMatchGuard, new RegExp(ledgerField, "i"));
    assert.match(
      legacyMatchGuard,
      new RegExp(
        String.raw`p_input\s*(?:->|->>)\s*'${requestField}'`,
        "i",
      ),
      `legacy ${ledgerField} must be compared with ${requestField}`,
    );
  }
  assert.match(
    migration,
    /(?:accepted[\s\S]{0,5000}idempotency_conflict|idempotency_conflict[\s\S]{0,5000}accepted)/i,
    "a mismatched legacy accepted payload must be rejected",
  );
  assert.ok(
    /delete\s+from\s+public\.v12_runtime_idempotency[\s\S]{0,1800}(?:accepted|v_existing)/i.test(
      migration,
    ) ||
      /update\s+public\.v12_runtime_idempotency[\s\S]{0,1800}(?:accepted|v_existing)/i.test(
        migration,
      ) ||
      /(?:accepted|v_existing)[\s\S]{0,1800}(?:continue|v_existing\s*:=\s*null)/i.test(
        migration,
      ),
    "an exact legacy accepted retry must leave the old terminal-return path and be reconciled",
  );
});

test("new sync state and the RPC remain default-deny and service-role-only", () => {
  const createdTables = [
    ...migration.matchAll(/create table if not exists public\.(v12_[a-z0-9_]+)/gi),
  ].map((match) => match[1]);
  assert.ok(createdTables.length > 0, "expected at least one dedicated typed sync state table");

  for (const table of createdTables) {
    assert.match(
      migration,
      new RegExp(`alter table public\\.${table} enable row level security`, "i"),
    );
    assert.match(
      migration,
      new RegExp(`revoke all on public\\.${table} from public, anon, authenticated`, "i"),
    );
    assert.match(
      migration,
      new RegExp(
        `grant (?:select, insert, update, delete|all) on public\\.${table} to service_role`,
        "i",
      ),
    );
  }

  const signature = "v12_runtime_mutate\\(text,text,jsonb,text\\)";
  assert.match(
    migration,
    new RegExp(`grant execute on function public\\.${signature} to service_role`, "i"),
  );
  assert.doesNotMatch(
    migration,
    new RegExp(`grant execute on function public\\.${signature} to (?:anon|authenticated)`, "i"),
  );
});
