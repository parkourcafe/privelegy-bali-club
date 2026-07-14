import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [
  venueSql,
  privacySql,
  eventSql,
  guideSql,
  repairSql,
  guardSql,
  rollbackSql,
  repairRollbackSql,
  guardRollbackSql,
  consentRoute,
  exportRoute,
  deleteRoute,
  privacyChoices,
  analyticsClient,
  onboardDraftRoute,
] = await Promise.all([
  readFile(new URL("supabase/migrations/0035_normalize_venue_model.sql", root), "utf8"),
  readFile(new URL("supabase/migrations/0036_privacy_guest_data_rpcs.sql", root), "utf8"),
  readFile(new URL("supabase/migrations/0037_atomic_event_rate_limit.sql", root), "utf8"),
  readFile(new URL("supabase/migrations/0038_guide_lead_hardening.sql", root), "utf8"),
  readFile(new URL("supabase/migrations/0039_idempotent_saves_and_source_capture.sql", root), "utf8"),
  readFile(new URL("supabase/migrations/0040_onboarding_token_amplification_guards.sql", root), "utf8"),
  readFile(new URL("supabase/rollback/0035_0037_launch_foundation.sql", root), "utf8"),
  readFile(new URL("supabase/rollback/0039_release_privacy_repairs.sql", root), "utf8"),
  readFile(new URL("supabase/rollback/0040_onboarding_token_amplification_guards.sql", root), "utf8"),
  readFile(new URL("app/api/privacy/consent/route.ts", root), "utf8"),
  readFile(new URL("app/api/privacy/export/route.ts", root), "utf8"),
  readFile(new URL("app/api/privacy/delete/route.ts", root), "utf8"),
  readFile(new URL("components/privacy/PrivacyChoices.tsx", root), "utf8"),
  readFile(new URL("lib/analytics.ts", root), "utf8"),
  readFile(new URL("app/api/onboard/draft/route.ts", root), "utf8"),
]);

function functionBody(sql, name) {
  return sql.match(new RegExp(
    `create or replace function public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("0035-0040 are explicit transactions", () => {
  for (const sql of [venueSql, privacySql, eventSql, guideSql, repairSql, guardSql]) {
    assert.match(sql, /^begin;[\s\S]*commit;\s*$/im);
  }
});

test("C-04 is additive and preserves ambiguous or unsourced legacy values", () => {
  for (const column of [
    "venue_type", "subarea", "full_address", "latitude", "longitude",
    "google_place_id", "price_min_idr", "price_max_idr", "price_band", "opening_hours_json",
    "verified_at", "verification_source", "editorial_status", "occasions",
    "meal_periods", "photo_status",
  ]) {
    assert.match(venueSql, new RegExp(`add column if not exists ${column}\\b`, "i"));
  }
  assert.doesNotMatch(venueSql, /drop column|rename column/i);
  assert.match(venueSql, /area !~ '\/'/i);
  assert.doesNotMatch(venueSql, /set price_min_idr[\s\S]*?price_anchor/i);
  assert.doesNotMatch(venueSql, /set occasions[\s\S]*?jobs/i);
  assert.match(venueSql, /publication_status = 'published'[\s\S]*?verified_at is not null[\s\S]*?verification_source[\s\S]*?then 'published'[\s\S]*?else 'review'/i);
  assert.match(venueSql, /venue_model_backfill_review/i);
});

test("venue and photo constraints encode the publication contract", () => {
  assert.match(venueSql, /price_min_idr <= price_max_idr/i);
  assert.match(venueSql, /latitude between -90 and 90/i);
  assert.match(venueSql, /longitude between -180 and 180/i);
  assert.match(venueSql, /editorial_status is distinct from 'published'[\s\S]*?verified_at is not null[\s\S]*?verification_source/i);
  assert.match(venueSql, /create table if not exists public\.venue_photos/i);
  assert.match(venueSql, /venue_photos_one_primary_idx[\s\S]*?where is_primary/i);
  assert.match(venueSql, /status <> 'published'[\s\S]*?verified_at is not null[\s\S]*?rights_basis[\s\S]*?rights_holder/i);
  assert.match(venueSql, /alter table public\.venue_photos enable row level security/i);
  assert.match(venueSql, /alter table public\.venue_photos force row level security/i);
  assert.match(venueSql, /revoke all on table public\.venue_photos from public, anon, authenticated/i);
});

test("consent is append-only, service-only and essential-only can avoid identity", () => {
  const consent = functionBody(privacySql, "record_guest_consent");
  assert.match(consent, /auth\.role\(\) is distinct from 'service_role'/i);
  const nullReturn = consent.indexOf("if p_guest_ref is null then");
  const insertGuest = consent.indexOf("insert into public.guest_refs");
  assert.ok(nullReturn > 0 && insertGuest > nullReturn, "fresh essential-only returns before identity insert");
  assert.match(consent, /insert into public\.consent_log/i);
  assert.match(consent, /scope,[\s\S]*?ts[\s\S]*?clock_timestamp\(\)/i);
  assert.match(consent, /order by consent\.ts desc, consent\.id desc/i);
  assert.doesNotMatch(consent, /update public\.consent_log|delete from public\.consent_log/i);
  assert.match(privacySql, /grant execute on function public\.record_guest_consent\(text,text,text,text\)[\s\S]*?to service_role/i);
  assert.doesNotMatch(privacySql, /grant execute on function public\.record_guest_consent[^;]+to (anon|authenticated)/i);
});

test("export and deletion are current-GuestRef service boundaries", () => {
  const exported = functionBody(privacySql, "export_guest_data");
  const deleted = functionBody(privacySql, "delete_guest_data");
  assert.match(exported, /'version', 1/i);
  for (const collection of ["consents", "events", "redemptions", "savedPlaces", "sharedLists"]) {
    assert.match(exported, new RegExp(`'${collection}'`, "i"));
  }
  assert.match(
    deleted,
    /delete from public\.events[\s\S]*?type = 'dish_feedback'[\s\S]*?delete from public\.shared_lists[\s\S]*?delete from public\.guest_refs/i,
  );
  assert.match(deleted, /jsonb_build_object\('ok', true, 'status', 'completed'\)/i);
  assert.doesNotMatch(deleted, /row_count|deleted_count|found/i);
  assert.match(privacySql, /grant execute on function public\.export_guest_data\(text\)[\s\S]*?to service_role/i);
  assert.match(privacySql, /grant execute on function public\.delete_guest_data\(text\)[\s\S]*?to service_role/i);
});

test("event v3 performs consent, dedupe, fixed limit and insert atomically", () => {
  const event = functionBody(eventSql, "log_event_v3");
  const lockAt = event.indexOf("pg_advisory_xact_lock");
  const consentAt = event.indexOf("consent_type = 'analytics'");
  const countAt = event.indexOf("select count(*)::integer");
  const insertAt = event.indexOf("insert into public.events");
  assert.ok(lockAt > 0 && consentAt > lockAt && countAt > consentAt && insertAt > countAt);
  assert.match(event, /order by consent\.ts desc, consent\.id desc/i);
  assert.match(event, /v_window constant interval := interval '60 seconds'/i);
  assert.match(event, /v_max_events constant integer := 30/i);
  assert.match(event, /'error', 'rate_limited'[\s\S]*?'retry_after_seconds'/i);
  assert.doesNotMatch(event, /p_ip|inet_client_addr|remote_addr/i);
  assert.match(event, /'source_scan'[\s\S]*?p_type = 'source_scan'[\s\S]*?p_source is null[\s\S]*?p_venue_slug is not null/i);
  assert.match(event, /p_source is not null[\s\S]*?public\.attribution_sources[\s\S]*?source\.active/i);
  assert.match(eventSql, /to_regclass\('public\.attribution_sources'\)[\s\S]*?requires the tracked schema chain/i);
  assert.match(eventSql, /events_guest_ts_idx[\s\S]*?where guest_ref_id is not null/i);
  assert.match(eventSql, /grant execute on function public\.log_event_v3\(text,text,text,text,jsonb\)[\s\S]*?to service_role/i);
});

test("0039 normalizes pgcrypto and enforces route, ownership and erasure invariants", () => {
  assert.match(repairSql, /create schema if not exists extensions/i);
  assert.match(repairSql, /alter extension pgcrypto set schema extensions/i);
  assert.match(repairSql, /to_regprocedure\('extensions\.digest\(text,text\)'\)/i);
  assert.match(repairSql, /route_stops contains duplicate \(route_slug, rank\)/i);
  assert.match(repairSql, /route_stops_route_rank_key unique \(route_slug, rank\)/i);

  const tombstones = repairSql.match(
    /create table if not exists public\.guest_ref_tombstones \([\s\S]*?\n\);/i,
  )?.[0] ?? "";
  assert.match(tombstones, /ref_hash bytea primary key/i);
  assert.match(tombstones, /deleted_at timestamptz not null/i);
  assert.doesNotMatch(tombstones, /\n\s*ref\s+text\b/i);
  assert.match(repairSql, /guest_ref_tombstones enable row level security/i);
  assert.match(repairSql, /guest_ref_tombstones force row level security/i);

  assert.match(repairSql, /shared_lists contains ownerless rows; reconcile before 0039/i);
  assert.match(repairSql, /alter column guest_ref_id set not null/i);
  assert.match(
    repairSql,
    /foreign key \(guest_ref_id\) references public\.guest_refs\(id\) on delete cascade/i,
  );
  assert.match(
    repairSql,
    /create trigger guest_refs_erasure_guard[\s\S]*?before insert or update of ref/i,
  );
  for (const table of ["consent_log", "redemption_events", "events", "saved_places", "shared_lists"]) {
    assert.match(repairSql, new RegExp(`create trigger ${table}_erasure_guard`, "i"));
  }
});

test("0039 RPCs serialize writes, export and deletion behind the tombstone barrier", () => {
  const consent = functionBody(repairSql, "record_guest_consent");
  const saved = functionBody(repairSql, "set_saved_place");
  const shared = functionBody(repairSql, "create_shared_list");
  const exported = functionBody(repairSql, "export_guest_data");
  const deleted = functionBody(repairSql, "delete_guest_data");
  const source = functionBody(repairSql, "capture_source_scan");
  const feedback = functionBody(repairSql, "log_dish_feedback");

  for (const body of [saved, shared, exported, deleted, source, feedback]) {
    assert.match(body, /auth\.role\(\) is distinct from 'service_role'/i);
    assert.match(body, /p_guest_ref is null/i);
  }
  assert.match(consent, /v_window constant interval := interval '24 hours'/i);
  assert.match(consent, /v_max_transitions constant integer := 20/i);
  const sameConsent = consent.indexOf("v_previous_granted is not distinct from v_granted");
  const countConsent = consent.indexOf("select count(*)::integer, min(consent.ts)");
  const limitConsent = consent.indexOf("v_count >= v_max_transitions");
  assert.ok(sameConsent > 0 && countConsent > sameConsent && limitConsent > countConsent);
  assert.match(
    consent,
    /if not v_granted then[\s\S]*?if v_previous_granted is true then[\s\S]*?insert into public\.consent_log[\s\S]*?'recorded', true[\s\S]*?'limit_reached', true[\s\S]*?'error', 'rate_limited'/i,
  );
  assert.match(saved, /p_venue_slug is null/i);
  assert.match(saved, /p_saved is null/i);
  assert.match(
    saved,
    /venue\.slug = p_venue_slug[\s\S]*?venue\.status = 'active'[\s\S]*?venue\.publication_status = 'published'[\s\S]*?for key share/i,
  );
  assert.match(saved, /where saved\.guest_ref_id = v_guest_id[\s\S]*?v_saved_count >= 500/i);
  assert.match(saved, /on conflict \(guest_ref_id, venue_slug\) do nothing/i);
  assert.match(shared, /where slug is null[\s\S]*?slug !~[\s\S]*?length\(slug\) > 120/i);
  assert.match(shared, /v_distinct_count not between 1 and 50/i);
  assert.match(
    shared,
    /venue\.slug = any\(v_slugs\)[\s\S]*?venue\.status = 'active'[\s\S]*?venue\.publication_status = 'published'[\s\S]*?for key share/i,
  );
  assert.match(shared, /where shared\.guest_ref_id = v_guest_id[\s\S]*?v_list_count >= 20/i);
  assert.match(shared, /encode\(extensions\.gen_random_bytes\(12\), 'hex'\)/i);

  const exportLock = exported.indexOf("pg_advisory_xact_lock");
  const exportTombstone = exported.indexOf("guest_ref_tombstones");
  const exportRead = exported.indexOf("from public.guest_refs guest");
  assert.ok(exportLock > 0 && exportTombstone > exportLock && exportRead > exportTombstone);
  for (const collection of ["consents", "events", "redemptions", "savedPlaces", "sharedLists"]) {
    assert.match(exported, new RegExp(`'${collection}'`, "i"));
  }

  const deleteLock = deleted.indexOf("pg_advisory_xact_lock");
  const deleteTombstone = deleted.indexOf("insert into public.guest_ref_tombstones");
  const deleteIdentity = deleted.indexOf("delete from public.guest_refs");
  assert.ok(deleteLock > 0 && deleteTombstone > deleteLock && deleteIdentity > deleteTombstone);
  assert.match(source, /public\.log_event_v3\([\s\S]*?update public\.guest_refs/i);
  assert.match(feedback, /pg_advisory_xact_lock[\s\S]*?guest_ref_tombstones/i);
  assert.match(feedback, /public\.redemption_events[\s\S]*?event\.type = 'dish_feedback'/i);
  assert.match(repairSql, /events contains duplicate dish feedback per guest and venue/i);
  assert.match(
    repairSql,
    /create unique index if not exists events_one_dish_feedback_per_guest_venue_idx[\s\S]*?where type = 'dish_feedback'/i,
  );

  for (const signature of [
    "record_guest_consent(text,text,text,text)",
    "set_saved_place(text,text,boolean)",
    "capture_source_scan(text,text)",
    "create_shared_list(text,text[])",
    "export_guest_data(text)",
    "delete_guest_data(text)",
    "log_dish_feedback(text,text,text,text)",
  ]) {
    assert.match(
      repairSql,
      new RegExp(`revoke all on function public\\.${escapeRegExp(signature)}[\\s\\S]*?grant execute[\\s\\S]*?to service_role`, "i"),
    );
  }
});

test("0039 exposes a service-only read-only schema readiness probe", () => {
  const readiness = functionBody(repairSql, "release_readiness_v1");
  assert.match(readiness, /stable[\s\S]*?security definer/i);
  assert.match(readiness, /auth\.role\(\) is distinct from 'service_role'/i);
  for (const dependency of [
    "public.guest_ref_tombstones",
    "public.venue_photos",
    "public.record_guest_consent(text,text,text,text)",
    "public.log_event_v3(text,text,text,text,jsonb)",
    "public.record_redemption(text,text,boolean,text)",
    "public.set_saved_place(text,text,boolean)",
    "public.capture_source_scan(text,text)",
    "public.log_dish_feedback(text,text,text,text)",
    "public.events_one_dish_feedback_per_guest_venue_idx",
  ]) {
    assert.ok(readiness.includes(dependency), `${dependency} must be covered by readiness`);
  }
  assert.doesNotMatch(readiness, /\binsert\b|\bupdate\b|\bdelete\b|\btruncate\b/i);
  assert.match(
    repairSql,
    /revoke all on function public\.release_readiness_v1\(\)[\s\S]*?grant execute[\s\S]*?to service_role/i,
  );
  assert.doesNotMatch(
    repairSql,
    /grant execute on function public\.release_readiness_v1\(\)[\s\S]*?to (anon|authenticated)/i,
  );
});

test("0040 makes listing confirmation immutable and first-write-wins", () => {
  const confirmation = functionBody(guardSql, "confirm_onboarding");
  assert.match(
    guardSql,
    /venue_confirmations contains duplicate agreed listing evidence; reconcile before 0040/i,
  );
  assert.match(
    guardSql,
    /create unique index if not exists venue_confirmations_one_agreed_per_venue_idx[\s\S]*?on public\.venue_confirmations\(venue_slug\)[\s\S]*?where agreed/i,
  );
  assert.match(confirmation, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(
    confirmation,
    /pg_advisory_xact_lock\([\s\S]*?'partner-onboard:' \|\| v_slug/i,
  );
  const existingAt = confirmation.indexOf("from public.venue_confirmations confirmation");
  const insertAt = confirmation.indexOf("insert into public.venue_confirmations");
  assert.ok(existingAt > 0 && insertAt > existingAt);
  assert.match(confirmation, /'deduplicated', true[\s\S]*?'deduplicated', false/i);
  assert.doesNotMatch(confirmation, /update public\.venue_confirmations|delete from public\.venue_confirmations/i);
});

test("0040 bounds owner-note transitions venue-wide without rewriting exact retries", () => {
  const ownerNote = functionBody(guardSql, "set_venue_jtbd");
  const ledger = guardSql.match(
    /create table if not exists public\.partner_note_submission_limits \([\s\S]*?\n\);/i,
  )?.[0] ?? "";

  assert.match(ledger, /submission_id uuid primary key/i);
  assert.match(ledger, /venue_slug text not null/i);
  assert.match(ledger, /token_hash bytea not null/i);
  assert.match(ledger, /note_hash bytea not null/i);
  assert.doesNotMatch(ledger, /references|on delete|unique\s*\(/i);
  assert.match(guardSql, /partner_note_submission_limits enable row level security/i);
  assert.match(guardSql, /partner_note_submission_limits force row level security/i);
  assert.match(
    guardSql,
    /create trigger partner_note_submission_limits_immutable[\s\S]*?before update or delete/i,
  );
  assert.match(
    guardSql,
    /revoke all on table public\.partner_note_submission_limits[\s\S]*?service_role/i,
  );

  assert.match(ownerNote, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(
    ownerNote,
    /v_owner_note text := nullif\(left\(btrim\(coalesce\(p_owner_note, ''\)\), 2000\), ''\)/i,
  );
  assert.match(ownerNote, /hashtextextended\('partner-onboard:' \|\| v_slug, 0\)/i);
  assert.match(ownerNote, /extensions\.digest\(p_token, 'sha256'\)/i);
  assert.match(
    ownerNote,
    /extensions\.digest\([\s\S]*?jsonb_build_object\('ownerNote', v_owner_note\)::text,[\s\S]*?'sha256'/i,
  );
  const currentAt = ownerNote.indexOf("v_current_owner_note is not distinct from v_owner_note");
  const totalAt = ownerNote.indexOf("select count(*)::integer into v_total_count");
  const updateAt = ownerNote.indexOf("update public.venues");
  const ledgerAt = ownerNote.indexOf("insert into public.partner_note_submission_limits");
  assert.ok(currentAt > 0 && totalAt > currentAt && updateAt > totalAt && ledgerAt > updateAt);
  assert.match(ownerNote, /v_max_per_24_hours constant integer := 10/i);
  assert.match(ownerNote, /v_max_per_venue constant integer := 50/i);
  assert.match(ownerNote, /created_at > v_now - interval '24 hours'/i);
  assert.doesNotMatch(ownerNote.slice(totalAt, updateAt), /token_hash = v_token_hash/i);
  assert.match(ownerNote, /set owner_note = v_owner_note/i);
  assert.match(ownerNote, /'deduplicated', true[\s\S]*?'deduplicated', false/i);
});

test("0040 token draft RPCs share a venue lock, deduplicate and have fixed budgets", () => {
  const menu = functionBody(guardSql, "create_partner_menu_draft");
  const action = functionBody(guardSql, "create_partner_action_draft");

  for (const body of [menu, action]) {
    assert.match(body, /auth\.role\(\) is distinct from 'service_role'/i);
    assert.match(body, /hashtextextended\('partner-onboard:' \|\| v_slug, 0\)/i);
    assert.match(body, /extensions\.digest\(p_token, 'sha256'\)/i);
    assert.match(body, /v_max_pending constant integer := 5/i);
    assert.match(body, /v_max_per_24_hours constant integer := 10/i);
    assert.match(body, /v_max_per_venue constant integer := 50/i);
    assert.match(body, /created_at > v_now - interval '24 hours'/i);
    assert.match(body, /'error', 'rate_limited'[\s\S]*?'retry_after_seconds'/i);
    assert.match(body, /'error', 'pending_limit_reached'/i);
    assert.match(body, /'error', 'submission_limit_reached'/i);
    assert.match(body, /'deduplicated', true[\s\S]*?'deduplicated', false/i);
  }

  const menuDedupeAt = menu.indexOf("from public.partner_menu_submission_limits submission");
  const menuCapAt = menu.indexOf("select count(*)::integer into v_total_count");
  const menuInsertAt = menu.indexOf("insert into public.menus");
  assert.ok(menuDedupeAt > 0 && menuCapAt > menuDedupeAt && menuInsertAt > menuCapAt);
  assert.doesNotMatch(menu.slice(menuDedupeAt, menuInsertAt), /token_hash = v_token_hash/i);
  assert.match(menu, /menu\.status in \('draft', 'review'\)/i);
  for (const key of ["sectionName", "itemName", "priceMinor", "currency"]) {
    assert.ok(menu.includes(`'${key}'`), `${key} must participate in menu idempotency`);
  }
  const menuParentInsertAt = menu.indexOf("insert into public.menus");
  const sectionInsertAt = menu.indexOf("insert into public.menu_sections");
  const itemInsertAt = menu.indexOf("insert into public.menu_items");
  const ledgerInsertAt = menu.indexOf("insert into public.partner_menu_submission_limits");
  assert.ok(
    menuParentInsertAt > 0
      && sectionInsertAt > menuParentInsertAt
      && itemInsertAt > sectionInsertAt
      && ledgerInsertAt > itemInsertAt,
  );
  assert.match(
    menu,
    /select count\(\*\)::integer into v_pending_count[\s\S]*?from public\.menus menu[\s\S]*?menu\.venue_slug = v_slug/i,
  );
  assert.match(menu, /insert into public\.partner_menu_submission_limits/i);
  assert.equal((menu.match(/v_source_url text/g) ?? []).length, 1);
  assert.equal((menu.match(/'deduplicated', false/g) ?? []).length, 1);

  const actionDedupeAt = action.indexOf("from public.partner_action_submission_limits submission");
  const actionCapAt = action.indexOf("select count(*)::integer into v_total_count");
  const actionInsertAt = action.indexOf("insert into public.venue_action_capabilities");
  assert.ok(actionDedupeAt > 0 && actionCapAt > actionDedupeAt && actionInsertAt > actionCapAt);
  assert.doesNotMatch(action.slice(actionDedupeAt, actionInsertAt), /token_hash = v_token_hash/i);
  assert.match(action, /capability\.status in \('draft', 'review'\)/i);
  assert.match(
    action,
    /select count\(\*\)::integer into v_pending_count[\s\S]*?from public\.venue_action_capabilities capability[\s\S]*?capability\.venue_slug = v_slug/i,
  );
  assert.match(action, /insert into public\.partner_action_submission_limits/i);
  assert.equal((action.match(/v_source_url text/g) ?? []).length, 1);
  assert.equal((action.match(/'deduplicated', false/g) ?? []).length, 1);

  assert.match(
    guardSql,
    /partner_menu_submission_limits \([\s\S]*?submission_id uuid primary key[\s\S]*?menu_id uuid unique references public\.menus\(id\) on delete set null/i,
  );
  assert.match(
    guardSql,
    /partner_action_submission_limits \([\s\S]*?submission_id uuid primary key[\s\S]*?capability_id uuid unique[\s\S]*?on delete set null/i,
  );

  for (const table of [
    "partner_menu_submission_limits",
    "partner_action_submission_limits",
    "partner_note_submission_limits",
  ]) {
    assert.match(guardSql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
    assert.match(guardSql, new RegExp(`alter table public\\.${table} force row level security`, "i"));
    assert.match(
      guardSql,
      new RegExp(`revoke all on table public\\.${table}[\\s\\S]*?service_role`, "i"),
    );
  }
  assert.doesNotMatch(guardSql, /create table[^;]+\btoken\s+text\b/i);
  assert.match(
    guardSql,
    /drop function if exists public\.create_partner_menu_draft\([\s\S]*?text,text,text,text,timestamptz,timestamptz/i,
  );
  assert.match(
    guardSql,
    /revoke all on function public\.upsert_partner_menu_item\([\s\S]*?service_role/i,
  );
  assert.match(onboardDraftRoute, /p_section_name: parsed\.section/i);
  assert.match(onboardDraftRoute, /p_item_name: parsed\.itemName/i);
  assert.match(onboardDraftRoute, /p_price_minor: parsed\.priceMinor/i);
  assert.doesNotMatch(onboardDraftRoute, /upsert_partner_menu_item/i);
});

test("0040 keeps the hardened token surfaces service-only and release-visible", () => {
  const compactGuardSql = guardSql.replace(/\s+/g, "").toLowerCase();
  for (const signature of [
    "confirm_onboarding(text,text,boolean,text)",
    "set_venue_jtbd(text,text,text,text[],text[],text)",
    "create_partner_menu_draft(text,text,text,text,text,text,bigint,text,timestamptz,timestamptz)",
    "create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz)",
    "release_readiness_v1()",
  ]) {
    assert.ok(
      compactGuardSql.includes(
        `revokeallonfunctionpublic.${signature}frompublic,anon,authenticated,service_role;`
        + `grantexecuteonfunctionpublic.${signature}toservice_role;`,
      ),
      `${signature} must be revoked from every role before its service grant`,
    );
  }
  assert.doesNotMatch(
    guardSql,
    /grant execute on function public\.(confirm_onboarding|create_partner_(menu|action)_draft)[\s\S]*?to (anon|authenticated)/i,
  );

  const readiness = functionBody(guardSql, "release_readiness_v1");
  assert.match(readiness, /stable[\s\S]*?security definer/i);
  assert.match(readiness, /'schemaRevision', '0040'/i);
  for (const dependency of [
    "public.partner_menu_submission_limits",
    "public.partner_action_submission_limits",
    "public.partner_note_submission_limits",
    "public.partner_note_submission_lookup_idx",
    "public.partner_note_submission_rate_idx",
    "public.prevent_partner_note_limit_mutation()",
    "public.venue_confirmations_one_agreed_per_venue_idx",
    "public.partner_menu_submission_lookup_idx",
    "public.partner_action_submission_lookup_idx",
    "public.confirm_onboarding(text,text,boolean,text)",
    "public.set_venue_jtbd(text,text,text,text[],text[],text)",
  ]) {
    assert.ok(readiness.includes(dependency), `${dependency} must be covered by 0040 readiness`);
  }
  assert.doesNotMatch(readiness, /\binsert\b|\bupdate\b|\bdelete\b|\btruncate\b/i);
});

test("privacy routes never accept a caller-supplied GuestRef", () => {
  for (const route of [exportRoute, deleteRoute]) {
    assert.match(route, /resolveGuestRefAccess\(/);
    assert.doesNotMatch(route, /resolveGuestRef\(\)/);
    assert.doesNotMatch(route, /req\.json|searchParams|p_guest_ref:\s*(body|query|params)/i);
  }
  assert.match(exportRoute, /Cache-Control["']?:?\s*["']no-store/i);
  for (const cookie of ["GUEST_COOKIE", "GUEST_PROOF_COOKIE", "CONSENT_COOKIE"]) {
    assert.match(
      deleteRoute,
      new RegExp(`cookies\\.set\\(${cookie}, "", \\{[\\s\\S]*?maxAge: 0 \\}\\)`, "i"),
    );
  }
  assert.doesNotMatch(deleteRoute, /cookies\.delete\(/i);
  assert.match(deleteRoute, /essential_only/);
  assert.match(deleteRoute, /Cache-Control["']?:?\s*["']no-store/i);
});

test("consent route requires a bootstrapped identity for opt-in and fails closed", () => {
  const read = consentRoute.indexOf("readGuestRef()");
  const optIn = consentRoute.indexOf('state === "analytics_allowed"');
  const rpc = consentRoute.indexOf("recordGuestConsent(client");
  assert.ok(read >= 0 && optIn > read && rpc > optIn);
  assert.doesNotMatch(consentRoute, /resolveGuestRef\(\)/);
  assert.match(consentRoute, /errorResponse\("guest_identity_required", 409\)/i);
  assert.match(consentRoute, /errorResponse\("consent_backend_unavailable", 503\)/i);
  assert.match(consentRoute, /readBoundedJson\(req, MAX_CONSENT_BODY_BYTES\)/i);
  assert.match(consentRoute, /parseConsentRequest\(body\.value\)/i);
  assert.doesNotMatch(consentRoute, /req\.json\(/i);
});

test("CL-08 choices expose processors, versioned export and confirmed deletion", () => {
  assert.match(privacyChoices, /Essential functionality[\s\S]*?Always on/i);
  assert.match(privacyChoices, /Vercel[\s\S]*?Supabase[\s\S]*?Google Analytics/i);
  assert.match(privacyChoices, /ANALYTICS_CONSENT_VERSION/);
  assert.match(privacyChoices, /ANALYTICS_CONSENT_EFFECTIVE_DATE/);
  assert.match(privacyChoices, /role="switch"[\s\S]*?aria-checked/i);
  assert.match(privacyChoices, /fetch\("\/api\/privacy\/export"/i);
  assert.match(privacyChoices, /fetch\("\/api\/privacy\/delete"/i);
  assert.match(privacyChoices, /Yes, permanently delete/i);
  assert.match(privacyChoices, /stopAnalyticsImmediately\(\)/i);
  assert.match(analyticsClient, /browserConsentState\(document\.cookie\) === "analytics_allowed"/i);
});

test("rollback removes callable surfaces without destroying normalized data", () => {
  assert.match(rollbackSql, /drop function if exists public\.log_event_v3/i);
  assert.match(rollbackSql, /drop function if exists public\.record_guest_consent/i);
  assert.doesNotMatch(rollbackSql, /drop table|drop column|truncate|delete from/i);
});

test("0039 rollback disables new surfaces but preserves privacy barriers and rights RPCs", () => {
  for (const signature of [
    "set_saved_place(text,text,boolean)",
    "capture_source_scan(text,text)",
    "create_shared_list(text,text[])",
    "release_readiness_v1()",
  ]) {
    assert.match(
      repairRollbackSql,
      new RegExp(`revoke all on function public\\.${escapeRegExp(signature)}[\\s\\S]*?service_role`, "i"),
    );
  }
  assert.doesNotMatch(
    repairRollbackSql,
    /drop table|drop column|drop trigger|truncate|delete from|drop function/i,
  );
  assert.doesNotMatch(repairRollbackSql, /revoke all on function public\.(export_guest_data|delete_guest_data)/i);
  assert.match(repairRollbackSql, /^begin;[\s\S]*commit;\s*$/im);
});

test("0040 rollback fails closed without deleting evidence or limit state", () => {
  const compactRollbackSql = guardRollbackSql.replace(/\s+/g, "").toLowerCase();
  for (const signature of [
    "confirm_onboarding(text,text,boolean,text)",
    "set_venue_jtbd(text,text,text,text[],text[],text)",
    "create_partner_menu_draft(text,text,text,text,text,text,bigint,text,timestamptz,timestamptz)",
    "upsert_partner_menu_item(text,uuid,text,integer,text,text,bigint,text,text[],text[],boolean,text,integer)",
    "create_partner_action_draft(text,text,text,text,text,integer,boolean,text,text,timestamptz,timestamptz)",
    "release_readiness_v1()",
  ]) {
    assert.ok(
      compactRollbackSql.includes(
        `revokeallonfunctionpublic.${signature}frompublic,anon,authenticated,service_role;`,
      ),
      `${signature} must fail closed during rollback`,
    );
  }
  assert.doesNotMatch(
    guardRollbackSql,
    /drop table|drop column|drop index|drop trigger|truncate|delete from|drop function/i,
  );
  assert.match(guardRollbackSql, /^begin;[\s\S]*commit;\s*$/im);
});
