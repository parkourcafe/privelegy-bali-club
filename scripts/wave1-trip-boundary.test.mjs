import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migration = await readFile(
  new URL("../supabase/migrations/0056_saved_place_trip_extension.sql", import.meta.url),
  "utf8",
);
const portabilityMigration = await readFile(
  new URL("../supabase/migrations/0057_shared_trip_id_portability.sql", import.meta.url),
  "utf8",
);
const saveRoute = await readFile(new URL("../app/api/save/route.ts", import.meta.url), "utf8");
const tripRoute = await readFile(new URL("../app/api/trip/route.ts", import.meta.url), "utf8");
const planner = await readFile(new URL("../components/TripPlanner.tsx", import.meta.url), "utf8");
const detailPage = await readFile(new URL("../app/places/[slug]/page.tsx", import.meta.url), "utf8");
const listRoute = await readFile(new URL("../app/api/list/route.ts", import.meta.url), "utf8");
const saveButton = await readFile(new URL("../components/SaveButton.tsx", import.meta.url), "utf8");
const addToTrip = await readFile(new URL("../components/AddToTripButton.tsx", import.meta.url), "utf8");

test("saved trip migration is additive and never introduces a parallel trip table", () => {
  assert.match(migration, /alter table public\.saved_places\s+add column if not exists day_number/i);
  assert.match(migration, /alter table public\.shared_lists\s+add column if not exists trip_entries/i);
  assert.doesNotMatch(migration, /create table[^;]*(?:trips|trip_items)/i);
});

test("write RPCs validate published active venues", () => {
  for (const fn of ["set_saved_place", "upsert_trip_place", "move_trip_place", "reorder_trip_place", "create_shared_trip"]) {
    assert.match(migration, new RegExp(`function public\\.${fn}`));
  }
  assert.match(migration, /publication_status = 'published'/i);
  assert.match(migration, /status = 'active'/i);
  assert.match(migration, /pg_advisory_xact_lock/i);
});

test("every trip RPC is revoked from browser roles and granted only to service role", () => {
  for (const signature of [
    "set_saved_place\\(text,text,boolean\\)",
    "saved_trip_for\\(text\\)",
    "upsert_trip_place\\(text,text,smallint\\)",
    "move_trip_place\\(text,text,smallint\\)",
    "reorder_trip_place\\(text,text,text\\)",
    "create_shared_trip\\(text\\)",
    "shared_list_trip\\(text\\)",
  ]) {
    assert.match(migration, new RegExp(`revoke all on function public\\.${signature} from public, anon, authenticated`));
    assert.match(migration, new RegExp(`grant execute on function public\\.${signature} to service_role`));
  }
  assert.match(migration, /grant execute on function public\.set_saved_place[\s\S]*to service_role/i);
  assert.doesNotMatch(migration, /grant execute on function public\.(?:set_saved_place|saved_trip_for|upsert_trip_place|move_trip_place|reorder_trip_place|create_shared_trip|shared_list_trip)[^;]*to (?:anon|authenticated)/i);
  assert.doesNotMatch(migration, /auth\.role\(\)/);
});

test("shared reader explicitly supports old slug-only rows", () => {
  assert.match(migration, /coalesce\(sl\.trip_entries/i);
  assert.match(migration, /unnest\(sl\.venue_slugs\) with ordinality/i);
});

test("shared trip IDs do not depend on Supabase's extensions search path", () => {
  assert.match(portabilityMigration, /create or replace function public\.create_shared_trip/);
  assert.match(portabilityMigration, /gen_random_uuid\(\)/);
  assert.doesNotMatch(portabilityMigration, /v_id\s*:=.*gen_random_bytes/);
  assert.match(portabilityMigration, /set search_path = public, pg_temp/);
  assert.match(portabilityMigration, /revoke all on function public\.create_shared_trip\(text\) from public, anon, authenticated/);
  assert.match(portabilityMigration, /grant execute on function public\.create_shared_trip\(text\) to service_role/);
});

test("all identity and private-link inputs are format guarded", () => {
  assert.ok((migration.match(/p_guest_ref !~ '\^g_\[A-Za-z0-9_-\]\{16\}\$'/g) ?? []).length >= 4);
  assert.match(migration, /p_id ~ '\^l_\[a-f0-9\]\{12,24\}\$'/);
  assert.doesNotMatch(migration, /\(\?:/);
});

test("Save uses desired state and trip mutations expose explicit operations", () => {
  assert.match(saveRoute, /typeof body\.saved !== "boolean"/);
  assert.match(saveRoute, /setSavedPlace\(ref, venueSlug, body\.saved\)/);
  assert.match(tripRoute, /export async function (?:PUT|PATCH|DELETE)/);
  assert.match(tripRoute, /normalizeVenueSlug/);
  assert.match(tripRoute, /normalizeTripDay/);
});

test("trip controls are keyboard-native and venue detail offers Add to trip", () => {
  assert.match(planner, /<button/);
  assert.match(planner, /aria-label=.*earlier/);
  assert.match(planner, /aria-label=.*later/);
  assert.match(planner, /<select/);
  assert.match(planner, /Choose day/);
  assert.match(planner, /TrackedDirectionsLink/);
  assert.match(detailPage, /<AddToTripButton venueSlug=\{slug\}/);
});

test("shared selections validate publication without changing caller order", () => {
  assert.match(listRoute, /new Set\(published\.map/);
  assert.match(listRoute, /provided\.filter\(\(slug\) => publishedSlugs\.has\(slug\)\)/);
});

test("Save and Add to trip enforce the canonical publication gate", () => {
  assert.match(saveRoute, /getVenueWithPerk\(venueSlug\)/);
  assert.match(saveRoute, /isPublicReadyVenue\(venue\)/);
  assert.match(tripRoute, /isPublicReadyVenue\(venue\)/);
});

test("trip upsert retries preserve position on the same day", () => {
  assert.match(migration, /v_exists and v_existing_day = p_day_number/);
  assert.match(migration, /'position', v_existing_position/);
});

test("card actions avoid eager per-card requests and option trees", () => {
  assert.match(saveButton, /variant === "card" \? true : !saved/);
  assert.match(saveButton, /if \(variant === "card"\) return/);
  assert.match(addToTrip, /useId\(\)/);
  assert.match(addToTrip, /!expanded/);
});

test("migration extends the bounded legacy event allowlist without browser grants", () => {
  assert.match(migration, /'preorder_click','save','route_add'/);
  assert.match(migration, /revoke all on function public\.log_event\(text,text,text,text\) from public, anon, authenticated/);
  assert.match(migration, /grant execute on function public\.log_event\(text,text,text,text\) to service_role/);
});

test("rollout contract is explicitly migration-first", () => {
  assert.match(migration, /Rollout order is migration first, then application deploy/);
});
