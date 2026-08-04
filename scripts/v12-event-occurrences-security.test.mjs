import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const migration = readFileSync(
  new URL("../supabase/migrations/0063_v12_event_occurrences.sql", import.meta.url),
  "utf8",
);
const route = readFileSync(
  new URL("../app/api/mobile/v1/events/route.ts", import.meta.url),
  "utf8",
);
const adapter = readFileSync(
  new URL("../lib/mobile-api/events.ts", import.meta.url),
  "utf8",
);

test("event occurrences are default-deny and distinct from analytics events", () => {
  assert.match(migration, /create table if not exists public\.v12_event_occurrences/);
  assert.match(migration, /enable row level security/);
  assert.match(migration, /revoke all .* from public, anon, authenticated/);
  assert.match(migration, /grant select, insert, update, delete .* to service_role/);
  assert.match(migration, /ends_at > starts_at/);
  assert.match(migration, /expires_at > last_verified_at/);
  assert.doesNotMatch(migration, /create table if not exists public\.events\b/);
});

test("mobile event feed exposes published lifecycle records until reconciliation expiry", () => {
  assert.match(
    adapter,
    /\.select\("id,event_id,title,venue_slug,area,starts_at,ends_at,status,cancellation_reason,last_verified_at,expires_at"\)/,
  );
  assert.match(adapter, /\.eq\("publication_status", "published"\)/);
  assert.match(adapter, /\.gt\("expires_at", iso\)/);
  assert.match(adapter, /\.limit\(100\)/);
  assert.doesNotMatch(adapter, /\.eq\("status", "scheduled"\)/);
  assert.match(migration, /status <> 'cancelled' or cancellation_reason is not null/);
  assert.match(route, /"Access-Control-Allow-Methods": "GET, OPTIONS"/);
  assert.doesNotMatch(route, /POST|PATCH|DELETE/);
});
