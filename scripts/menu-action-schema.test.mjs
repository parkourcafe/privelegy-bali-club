import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const migrationDirectory = new URL("../supabase/migrations/", import.meta.url);
const migrationFiles = await readdir(migrationDirectory);
const [securitySql, menuSql, photoSql, importSql, sourceSnapshotSql] = await Promise.all([
  readFile(new URL("0031_secure_partner_operator_rpcs.sql", migrationDirectory), "utf8"),
  readFile(new URL("0032_menu_action_foundation.sql", migrationDirectory), "utf8"),
  readFile(new URL("0033_venue_photo_consent_staging.sql", migrationDirectory), "utf8"),
  readFile(new URL("0034_transactional_data_ops_import.sql", migrationDirectory), "utf8"),
  readFile(new URL("20260714115933_public_menu_source_snapshots.sql", migrationDirectory), "utf8"),
]);

function functionBody(sql, name) {
  return sql.match(new RegExp(
    `create or replace function public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

function qualifiedFunctionBody(sql, schema, name) {
  return sql.match(new RegExp(
    `create or replace function ${schema}\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

function policyBody(sql, name) {
  return sql.match(new RegExp(
    `create policy "${name}"[\\s\\S]*?\\n\\);`,
    "i",
  ))?.[0] ?? "";
}

test("release migrations preserve applied 0030 and sequence repairs after it", () => {
  assert.ok(migrationFiles.includes("0030_photo_consent.sql"));
  assert.ok(!migrationFiles.includes("0030_enrich_remaining_wellness.sql"));
  assert.ok(migrationFiles.includes("0031_secure_partner_operator_rpcs.sql"));
  assert.ok(migrationFiles.includes("0032_menu_action_foundation.sql"));
  assert.ok(migrationFiles.includes("0033_venue_photo_consent_staging.sql"));
  assert.ok(migrationFiles.includes("0034_transactional_data_ops_import.sql"));
  assert.ok(migrationFiles.includes("20260714115933_public_menu_source_snapshots.sql"));
  assert.ok(!migrationFiles.includes("0026_menu_action_foundation.sql"));
  assert.ok(!migrationFiles.includes("0027_venue_photo_consent_staging.sql"));
});

test("Data Ops import is atomic, immutable and service-only", () => {
  const importRpc = functionBody(importSql, "import_data_ops_package");
  assert.match(importSql, /create table if not exists public\.data_ops_import_runs/i);
  assert.match(importSql, /alter table public\.data_ops_import_runs enable row level security/i);
  assert.match(
    importSql,
    /revoke all on table public\.data_ops_import_runs from public, anon, authenticated/i,
  );
  assert.match(importRpc, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(importRpc, /pg_advisory_xact_lock/i);
  assert.match(importRpc, /ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081/i);
  assert.match(importRpc, /79eac95c0d8a93a18045b1a4d79691d2c1ac5fe869bd41ea9764010412844e9a/i);
  assert.match(importRpc, /jsonb_array_length\(p_package->'menus'\) <> 127/i);
  assert.match(importRpc, /v_nested_section_count <> 165 or v_nested_item_count <> 881/i);
  assert.match(importRpc, /jsonb_array_length\(p_package->'capabilities'\) <> 250/i);
  assert.match(importRpc, /jsonb_array_length\(p_package->'venueMapsCandidates'\) <> 50/i);
  assert.match(importRpc, /value->>'kind' = 'maps'/i);
  assert.match(importRpc, /exists \(select 1 from public\.menus\)/i);
  assert.match(importRpc, /Data Ops menu target is not empty/i);
  assert.match(importRpc, /Data Ops action target contains an unapproved pre-existing row/i);
  assert.match(importRpc, /\) is not true[\s\S]*?Data Ops action target/i);
  assert.match(importRpc, /v_capability_version := greatest/i);
  assert.match(importRpc, /v_replaces_capability_id/i);
  assert.match(importRpc, /md5\('otherbali:dataops:menu:'/i);
  assert.match(importRpc, /md5\('otherbali:dataops:section:'/i);
  assert.match(importRpc, /md5\('otherbali:dataops:item:'/i);
  assert.match(importRpc, /md5\('otherbali:dataops:capability:'/i);
  assert.match(
    importSql,
    /revoke all on function public\.import_data_ops_package\(jsonb\)[\s\S]*?from public, anon, authenticated/i,
  );
  assert.match(
    importSql,
    /grant execute on function public\.import_data_ops_package\(jsonb\) to service_role/i,
  );
});

test("legacy token minting and roster export are service-only", () => {
  for (const name of ["get_or_create_onboard_token", "invite_roster"]) {
    const rpc = functionBody(securitySql, name);
    assert.match(rpc, /auth\.role\(\) is distinct from 'service_role'/i);
  }
  assert.match(
    securitySql,
    /revoke all on function public\.get_or_create_onboard_token\(text\)[\s\S]*?from public, anon, authenticated/i,
  );
  assert.match(
    securitySql,
    /revoke all on function public\.invite_roster\(\)[\s\S]*?from public, anon, authenticated/i,
  );
  assert.match(
    securitySql,
    /grant execute on function public\.get_or_create_onboard_token\(text\) to service_role/i,
  );
  assert.match(
    securitySql,
    /grant execute on function public\.invite_roster\(\) to service_role/i,
  );
  assert.doesNotMatch(
    securitySql,
    /grant execute on function public\.get_or_create_onboard_token\(text\) to anon/i,
  );
  assert.doesNotMatch(
    securitySql,
    /grant execute on function public\.invite_roster\(\) to anon/i,
  );
  assert.doesNotMatch(functionBody(securitySql, "get_or_create_onboard_token"), /md5\(/i);
});

test("operator credential tables have explicit least-privilege ACLs", () => {
  assert.match(
    securitySql,
    /revoke all on table public\.venue_onboard_tokens from public, anon, authenticated/i,
  );
  assert.match(
    securitySql,
    /revoke all on table public\.venue_confirmations from public, anon, authenticated/i,
  );
});

test("public venue and partner-report boundaries fail closed", () => {
  assert.match(securitySql, /drop policy if exists "public read active published venues"/i);
  assert.match(securitySql, /drop policy if exists "public read eligible perks"/i);
  assert.match(securitySql, /drop policy if exists "public read published plan entries"/i);
  assert.match(securitySql, /create policy "public read active published venues"[\s\S]*?status = 'active'[\s\S]*?publication_status = 'published'/i);
  assert.match(securitySql, /revoke all on table public\.venues from anon, authenticated/i);
  for (const rpc of ["partner_report", "partner_notes", "venue_redemption_count"]) {
    assert.match(securitySql, new RegExp(`revoke all on function public\\.${rpc}\\(text\\) from public, anon, authenticated`, "i"));
    assert.match(securitySql, new RegExp(`grant execute on function public\\.${rpc}\\(text\\) to service_role`, "i"));
  }
  const ownerRpc = functionBody(securitySql, "set_venue_jtbd");
  assert.match(ownerRpc, /set owner_note =/i);
  assert.doesNotMatch(ownerRpc, /set[\s\S]*?best_for\s*=/i);
  assert.doesNotMatch(ownerRpc, /set[\s\S]*?not_for\s*=/i);
});

test("all enumerable legacy onboarding links are forcibly rotated", () => {
  assert.match(
    securitySql,
    /lock table public\.venue_onboard_tokens in access exclusive mode/i,
  );
  assert.match(
    securitySql,
    /row_number\(\) over \([\s\S]*?partition by venue_slug/i,
  );
  assert.match(
    securitySql,
    /update public\.venue_onboard_tokens[\s\S]*?gen_random_uuid\(\)[\s\S]*?gen_random_uuid\(\)/i,
  );
  assert.match(
    securitySql,
    /venue_onboard_tokens_strong_token_check[\s\S]*?token ~ '\^\[0-9a-f\]\{64\}\$'/i,
  );
  assert.match(
    securitySql,
    /create unique index if not exists venue_onboard_tokens_one_per_venue_idx[\s\S]*?\(venue_slug\)/i,
  );
  assert.match(securitySql, /operators must resend the rotated link/i);
  assert.doesNotMatch(securitySql, /delete from public\.venue_confirmations/i);
});

test("all menu/action stores enable RLS and public reads enforce freshness", () => {
  for (const table of [
    "menus",
    "menu_sections",
    "menu_items",
    "venue_action_capabilities",
  ]) {
    assert.match(
      menuSql,
      new RegExp(`alter table public\\.${table} enable row level security`, "i"),
    );
  }
  assert.match(menuSql, /status = 'published'[\s\S]*?verified_at is not null[\s\S]*?expires_at > now\(\)/i);
  assert.match(menuSql, /completeness = 'full'/i);
  assert.match(menuSql, /v_menu\.completeness <> 'full'/i);
  assert.match(menuSql, /status = 'confirmed'[\s\S]*?verified_at is not null[\s\S]*?expires_at > now\(\)/i);
  assert.match(menuSql, /publication_status = 'published'/i);
  assert.match(
    menuSql,
    /revoke all on table public\.venue_action_capabilities from public, anon, authenticated/i,
  );
  assert.match(
    menuSql,
    /grant select on table public\.districts to anon, authenticated/i,
  );
});

test("public source snapshots remain distinct from verified published menus", () => {
  assert.match(
    sourceSnapshotSql,
    /status in \([\s\S]*?'source_snapshot'[\s\S]*?'published'[\s\S]*?\)/i,
  );
  assert.match(
    sourceSnapshotSql,
    /status <> 'source_snapshot'[\s\S]*?completeness = 'partial'[\s\S]*?verified_at is null[\s\S]*?source_snapshot_published_at is not null[\s\S]*?expires_at is not null[\s\S]*?is_publishable_evidence_url\(source_url\)/i,
  );
  assert.match(
    sourceSnapshotSql,
    /menus_one_public_per_venue_idx[\s\S]*?where status in \('source_snapshot', 'published'\)/i,
  );
  assert.doesNotMatch(
    sourceSnapshotSql,
    /set[\s\S]{0,100}verified_at\s*=/i,
  );
});

test("source snapshot RLS exposes only fresh eligible parents and children", () => {
  for (const policy of [
    "public read fresh published menus",
    "public read published menu sections",
    "public read published menu items",
  ]) {
    const body = policyBody(sourceSnapshotSql, policy);
    assert.match(
      body,
      /status = 'source_snapshot'/i,
    );
    assert.equal((body.match(/publication_status = 'published'/gi) ?? []).length, 1);
    assert.equal((body.match(/status = 'active'/gi) ?? []).length, 1);
    assert.match(body, /menu_security\.is_active_source_snapshot_parent\(/i);
  }
  assert.match(
    sourceSnapshotSql,
    /status = 'source_snapshot'[\s\S]*?completeness = 'partial'[\s\S]*?verified_at is null[\s\S]*?expires_at > now\(\)/i,
  );
  assert.match(
    sourceSnapshotSql,
    /v\.status = 'active'[\s\S]*?v\.publication_status = 'published'/i,
  );
  assert.doesNotMatch(
    sourceSnapshotSql,
    /status = 'draft'[\s\S]{0,200}create policy/i,
  );

  const activeParentGate = qualifiedFunctionBody(
    sourceSnapshotSql,
    "menu_security",
    "is_active_source_snapshot_parent",
  );
  assert.match(activeParentGate, /m\.status = 'source_snapshot'/i);
  assert.match(activeParentGate, /m\.expires_at > now\(\)/i);
  assert.match(activeParentGate, /v\.status = 'active'/i);
  assert.doesNotMatch(activeParentGate, /publication_status/i);
  assert.match(
    sourceSnapshotSql,
    /revoke all on function menu_security\.is_active_source_snapshot_parent\(uuid\)[\s\S]*?from public, anon, authenticated/i,
  );
  assert.match(
    sourceSnapshotSql,
    /grant execute on function menu_security\.is_active_source_snapshot_parent\(uuid\)[\s\S]*?to anon, authenticated, service_role/i,
  );
  assert.match(sourceSnapshotSql, /revoke all on schema menu_security from public/i);
  assert.doesNotMatch(sourceSnapshotSql, /create or replace function public\.is_active_source_snapshot_parent/i);
});

test("public source snapshot parent and child evidence is immutable", () => {
  const parentProtection = functionBody(sourceSnapshotSql, "protect_verified_menu_record");
  const childProtection = functionBody(sourceSnapshotSql, "protect_verified_menu_children");
  const transitionGate = functionBody(sourceSnapshotSql, "validate_source_snapshot_transition");
  assert.match(parentProtection, /old\.verified_at is not null[\s\S]*?old\.source_snapshot_published_at is not null/i);
  assert.match(parentProtection, /public menu snapshot evidence is immutable/i);
  assert.match(childProtection, /m\.verified_at is not null[\s\S]*?m\.source_snapshot_published_at is not null/i);
  assert.match(childProtection, /public menu snapshot content is immutable/i);
  assert.match(transitionGate, /source snapshot cannot be empty/i);
  assert.match(transitionGate, /source snapshot parent is not publishable/i);
  assert.match(transitionGate, /is_publishable_evidence_url\(new\.source_url\)/i);
  assert.match(transitionGate, /v\.status = 'active'/i);
  assert.match(transitionGate, /source snapshot contains unverified signals/i);
  assert.match(transitionGate, /cardinality\(i\.dietary_tags\)/i);
  assert.match(transitionGate, /cardinality\(i\.verified_allergen_tags\)/i);
  assert.match(transitionGate, /i\.partner_recommended/i);
  assert.match(transitionGate, /i\.editorial_pick/i);
  assert.match(transitionGate, /i\.editorial_note is not null/i);
  assert.doesNotMatch(transitionGate, /publication_status/i);
});

test("verified full publication atomically archives a source snapshot", () => {
  const publishRpc = functionBody(sourceSnapshotSql, "publish_menu_version");
  assert.match(sourceSnapshotSql, /grant select on table public\.venues to service_role/i);
  assert.match(publishRpc, /security invoker/i);
  assert.doesNotMatch(publishRpc, /auth\.role\(\)/i);
  assert.match(publishRpc, /v_menu\.status <> 'review'/i);
  assert.match(publishRpc, /v_menu\.completeness <> 'full'/i);
  assert.match(publishRpc, /v_menu\.verified_at is null/i);
  assert.match(
    publishRpc,
    /status in \('source_snapshot', 'published'\)[\s\S]*?id <> p_menu_id/i,
  );
});

test("exact Data Ops source snapshot batch is atomic, idempotent and service-only", () => {
  const batchRpc = functionBody(sourceSnapshotSql, "publish_data_ops_source_snapshots");
  assert.match(batchRpc, /security invoker/i);
  assert.doesNotMatch(batchRpc, /auth\.role\(\)/i);
  assert.match(batchRpc, /ba8599b410eb19a0032484cecfb936ce01429004e16a865ad99bd16dcecce081/i);
  assert.match(batchRpc, /menus_count = 127/i);
  assert.match(batchRpc, /sections_count = 165/i);
  assert.match(batchRpc, /items_count = 881/i);
  assert.match(batchRpc, /capabilities_count = 250/i);
  assert.match(batchRpc, /m\.created_at = v_applied_at/i);
  assert.match(batchRpc, /v_verified_full_count <> 1/i);
  assert.match(batchRpc, /verified_full_menu_precondition_failed/i);
  assert.match(batchRpc, /m\.status = 'published'[\s\S]*?m\.completeness = 'full'[\s\S]*?m\.verified_at is not null/i);
  assert.match(batchRpc, /v_section_count <> 165 or v_item_count <> 881/i);
  assert.match(batchRpc, /live_menu_child_count_mismatch/i);
  assert.match(batchRpc, /v_candidate_count <> 126/i);
  assert.match(batchRpc, /m\.captured_at \+ interval '60 days' <= now\(\)/i);
  assert.match(batchRpc, /not public\.is_publishable_evidence_url\(m\.source_url\)/i);
  assert.match(batchRpc, /source_snapshot_gate_failed/i);
  assert.match(batchRpc, /v\.status = 'active'/i);
  assert.match(batchRpc, /v\.publication_status = 'published'/i);
  assert.match(batchRpc, /get diagnostics v_updated_count = row_count/i);
  assert.match(batchRpc, /v_updated_count <> 126/i);
  assert.match(batchRpc, /source_snapshot_published_at = now\(\)/i);
  assert.match(batchRpc, /'alreadyPublished', true/i);
  assert.match(batchRpc, /published_source_snapshot_gate_failed/i);
  assert.match(
    sourceSnapshotSql,
    /revoke all on function public\.publish_data_ops_source_snapshots\(text\)[\s\S]*?from public, anon, authenticated/i,
  );
  assert.match(
    sourceSnapshotSql,
    /grant execute on function public\.publish_data_ops_source_snapshots\(text\)[\s\S]*?to service_role/i,
  );
  assert.doesNotMatch(
    sourceSnapshotSql,
    /grant execute on function public\.publish_data_ops_source_snapshots\(text\) to (anon|authenticated)/i,
  );
  assert.match(
    sourceSnapshotSql,
    /do \$activate_reviewed_source_snapshots\$[\s\S]*?publish_data_ops_source_snapshots[\s\S]*?raise exception 'Public menu source snapshot activation failed/i,
  );
  assert.match(
    sourceSnapshotSql,
    /'verified_full_menus'[\s\S]*?'partial_source_snapshots'[\s\S]*?'total_public_menus'/i,
  );
});

test("partner menu writes force editorial fields off", () => {
  const partnerItemRpc = functionBody(menuSql, "upsert_partner_menu_item");
  assert.match(partnerItemRpc, /partner_recommended[\s\S]*?editorial_pick[\s\S]*?editorial_note/i);
  assert.match(partnerItemRpc, /coalesce\(p_partner_recommended, false\)[\s\S]*?false[\s\S]*?null/i);
  assert.match(partnerItemRpc, /editorial_pick = false/i);
  assert.match(partnerItemRpc, /editorial_note = null/i);
});

test("menu prices preserve official display text without losing numeric prices", () => {
  assert.match(
    menuSql,
    /price_text text check \(price_text is null or length\(price_text\) <= 120\)/i,
  );
  assert.match(menuSql, /price_minor bigint/i);
  assert.match(menuSql, /currency text/i);
});

test("verified menu snapshots and their child content are immutable", () => {
  assert.match(menuSql, /create or replace function public\.protect_verified_menu_record/i);
  assert.match(menuSql, /verified menu snapshot evidence is immutable/i);
  assert.match(menuSql, /create or replace function public\.protect_verified_menu_children/i);
  assert.match(menuSql, /before insert or update or delete on public\.menu_sections/i);
  assert.match(menuSql, /before insert or update or delete on public\.menu_items/i);
});

test("partner action proposals are immutable versioned drafts", () => {
  assert.match(menuSql, /version integer not null check \(version > 0\)/i);
  assert.match(menuSql, /replaces_capability_id uuid/i);
  assert.match(menuSql, /unique \(venue_slug, kind, provider, version\)/i);
  assert.match(
    menuSql,
    /venue_actions_one_confirmed_provider_idx[\s\S]*?where status = 'confirmed'/i,
  );

  const partnerActionRpc = functionBody(menuSql, "create_partner_action_draft");
  assert.match(partnerActionRpc, /insert into public\.venue_action_capabilities/i);
  assert.match(partnerActionRpc, /'draft'/i);
  assert.match(partnerActionRpc, /replaces_capability_id/i);
  assert.doesNotMatch(partnerActionRpc, /on conflict/i);
  assert.doesNotMatch(partnerActionRpc, /update public\.venue_action_capabilities/i);
  assert.doesNotMatch(partnerActionRpc, /status\s*=\s*'draft'/i);
});

test("verified action evidence is immutable and replacements stay versioned", () => {
  assert.match(menuSql, /create or replace function public\.protect_verified_action_record/i);
  assert.match(menuSql, /verified action capability evidence is immutable/i);
  assert.match(
    menuSql,
    /before update or delete on public\.venue_action_capabilities/i,
  );
});

test("action publication swaps the live row transactionally", () => {
  const publishRpc = functionBody(menuSql, "publish_action_capability");
  assert.match(publishRpc, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(publishRpc, /is_publishable_action_capability/i);
  const targetGate = functionBody(menuSql, "is_publishable_action_capability");
  assert.match(targetGate, /v_target_authority ~ '@'/i);
  assert.match(targetGate, /tablepilot-id\.vercel\.app/i);
  assert.match(targetGate, /right\(v_target_host, length\(allowed\.host\) \+ 1\)/i);
  assert.match(targetGate, /p_provider = 'official'/i);
  const archiveAt = publishRpc.indexOf("set status = 'archived'");
  const confirmAt = publishRpc.indexOf("set status = 'confirmed'");
  assert.ok(archiveAt > 0, "previous confirmed capability is archived");
  assert.ok(confirmAt > archiveAt, "replacement is confirmed only after archival");
  assert.match(
    menuSql,
    /grant execute on function public\.publish_action_capability\(uuid\) to service_role/i,
  );
  assert.match(menuSql, /^begin;[\s\S]*commit;\s*$/im);
});

test("TablePilot backfill is constrained to active-deep monetized coverage", () => {
  assert.match(menuSql, /d\.status = 'active_deep'[\s\S]*?d\.monetization_enabled/i);
  assert.match(menuSql, /on conflict \(venue_slug, kind, provider, version\) do nothing/i);
});

test("directions stay on venues.gmaps_url instead of capability rows", () => {
  assert.match(menuSql, /Directions remain on venues\.gmaps_url/i);
  const capabilityTable = menuSql.match(
    /create table if not exists public\.venue_action_capabilities \([\s\S]*?\n\);/i,
  )?.[0];
  assert.ok(capabilityTable, "capability table definition exists");
  assert.doesNotMatch(capabilityTable, /'maps'/i);
  assert.doesNotMatch(capabilityTable, /'google_maps'/i);
});

test("event v2 preserves acquisition source and whitelists payload keys", () => {
  assert.match(menuSql, /values \(p_type, v_id, p_venue_slug, p_source, v_clean\)/i);
  assert.match(
    menuSql,
    /key not in \('action','provider','capabilityId','venueSlug'\)/i,
  );
  assert.match(
    menuSql,
    /key not in \('venueSlug','menuId','menuItemId'\)/i,
  );
});

test("photo staging is private and legacy direct publication is disabled", () => {
  for (const table of ["venue_photo_tokens", "venue_photo_submissions"]) {
    assert.match(
      photoSql,
      new RegExp(`alter table public\\.${table} enable row level security`, "i"),
    );
    assert.match(
      photoSql,
      new RegExp(`revoke all on table public\\.${table} from public, anon, authenticated`, "i"),
    );
  }
  assert.match(photoSql, /'venue-photos'[\s\S]*?false/i);
  assert.match(photoSql, /drop policy if exists "onboard photo upload"/i);
  assert.match(photoSql, /drop policy if exists "public read venue photos"/i);
  assert.doesNotMatch(photoSql, /create or replace function public\.set_venue_photo/i);
  assert.match(
    photoSql,
    /drop function if exists public\.set_venue_photo\(text, text\)/i,
  );
  assert.match(
    photoSql,
    /drop function if exists public\.set_venue_photo\(text, text, boolean, text, text\)/i,
  );
});

test("legacy 0030 evidence is preserved but plaintext credentials are retired", () => {
  assert.match(photoSql, /to_regclass\('public\.venue_photo_consents'\)/i);
  assert.match(photoSql, /revoke all on table public\.venue_photo_consents from public, anon, authenticated/i);
  assert.match(photoSql, /alter table public\.venue_photo_consents drop column token/i);
  assert.match(photoSql, /create table if not exists public\.venue_photo_legacy_quarantine/i);
  assert.match(
    photoSql,
    /insert into public\.venue_photo_legacy_quarantine\(venue_slug, photo_url\)/i,
  );
  assert.match(
    photoSql,
    /update public\.venues v[\s\S]*?set photo_url = null[\s\S]*?approved\.id = any\(consent\.submission_ids\)/i,
  );
  assert.match(photoSql, /rows do not authorize publication/i);
});

test("photo consent is exact-image evidence and publication is service-only", () => {
  assert.match(photoSql, /consent_log_id uuid references public\.consent_log/i);
  assert.match(photoSql, /status <> 'approved'[\s\S]*?consent_granted/i);
  assert.match(photoSql, /create unique index if not exists venue_photo_submissions_primary_idx/i);

  const consentRpc = functionBody(photoSql, "record_venue_photo_consent");
  const reserveRpc = functionBody(photoSql, "reserve_venue_photo_submission");
  const approveRpc = functionBody(photoSql, "approve_venue_photo_submission");
  assert.match(reserveRpc, /pg_advisory_xact_lock/i);
  assert.match(reserveRpc, /v_pending >= 5 or v_recent >= 10/i);
  assert.match(reserveRpc, /'rate_limited'/i);
  assert.match(consentRpc, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(consentRpc, /consent_log/i);
  assert.match(consentRpc, /where id = any\(p_submission_ids\)/i);
  assert.match(approveRpc, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(approveRpc, /p_submission_id = any\(c\.submission_ids\)/i);
  assert.match(
    photoSql,
    /grant execute on function public\.reserve_venue_photo_submission[\s\S]*?to service_role/i,
  );
  assert.match(
    photoSql,
    /grant execute on function public\.record_venue_photo_consent[\s\S]*?to service_role/i,
  );
  assert.match(
    photoSql,
    /grant execute on function public\.approve_venue_photo_submission[\s\S]*?to service_role/i,
  );
  assert.doesNotMatch(photoSql, /grant execute[\s\S]*?to anon/i);
  assert.match(photoSql, /submission_ids is not null/i);
  assert.match(photoSql, /revoke all on table public\.consent_log from service_role/i);
});

test("migration function bodies have balanced dollar quotes", () => {
  for (const sql of [securitySql, menuSql, photoSql, importSql, sourceSnapshotSql]) {
    assert.equal((sql.match(/\$\$/g) ?? []).length % 2, 0);
  }
});
