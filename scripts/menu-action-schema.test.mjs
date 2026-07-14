import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const migrationDirectory = new URL("../supabase/migrations/", import.meta.url);
const migrationFiles = await readdir(migrationDirectory);
const [securitySql, menuSql, photoSql] = await Promise.all([
  readFile(new URL("0031_secure_partner_operator_rpcs.sql", migrationDirectory), "utf8"),
  readFile(new URL("0032_menu_action_foundation.sql", migrationDirectory), "utf8"),
  readFile(new URL("0033_venue_photo_consent_staging.sql", migrationDirectory), "utf8"),
]);

function functionBody(sql, name) {
  return sql.match(new RegExp(
    `create or replace function public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

test("release migrations preserve applied 0030 and sequence repairs after it", () => {
  assert.ok(migrationFiles.includes("0030_photo_consent.sql"));
  assert.ok(migrationFiles.includes("0031_secure_partner_operator_rpcs.sql"));
  assert.ok(migrationFiles.includes("0032_menu_action_foundation.sql"));
  assert.ok(migrationFiles.includes("0033_venue_photo_consent_staging.sql"));
  assert.ok(!migrationFiles.includes("0026_menu_action_foundation.sql"));
  assert.ok(!migrationFiles.includes("0027_venue_photo_consent_staging.sql"));
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
  for (const sql of [securitySql, menuSql, photoSql]) {
    assert.equal((sql.match(/\$\$/g) ?? []).length % 2, 0);
  }
});
