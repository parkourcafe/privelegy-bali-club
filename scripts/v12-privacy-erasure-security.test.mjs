import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const migrationUrl = new URL(
  "../supabase/migrations/0065_v12_guest_privacy_erasure.sql",
  import.meta.url,
);
const helperUrl = new URL("../lib/mobile-privacy.ts", import.meta.url);
const webRouteUrl = new URL("../app/api/privacy/forget/route.ts", import.meta.url);
const mobileRouteUrl = new URL("../app/api/mobile/v1/privacy/route.ts", import.meta.url);
const choicesUrl = new URL("../app/privacy/choices/PrivacyChoices.tsx", import.meta.url);
const analyticsUrl = new URL("../components/AnalyticsClient.tsx", import.meta.url);

test("privacy erasure is a service-role-only SECURITY DEFINER RPC with an exact guest reference", async () => {
  const migration = await readFile(migrationUrl, "utf8");
  assert.match(
    migration,
    /create or replace function public\.forget_guest_v12\s*\(\s*p_guest_ref text\s*\)\s*returns jsonb[\s\S]{0,300}security definer[\s\S]{0,120}set search_path = public, pg_temp/i,
  );
  assert.match(migration, /\^g_\[A-Za-z0-9_-\]\{16\}\$/);
  assert.match(
    migration,
    /revoke all on function public\.forget_guest_v12\(text\)\s*from public, anon, authenticated/i,
  );
  assert.match(
    migration,
    /grant execute on function public\.forget_guest_v12\(text\)\s*to service_role/i,
  );
  assert.doesNotMatch(
    migration,
    /grant execute on function public\.forget_guest_v12\(text\)\s*to (?:anon|authenticated)/i,
  );
});

test("privacy erasure deletes every v1.2 guest-owned state table", async () => {
  const migration = await readFile(migrationUrl, "utf8");
  for (const table of [
    "v12_saved_states",
    "v12_today_items",
    "v12_visited_states",
    "v12_note_states",
    "v12_decision_runs",
    "v12_feed_sessions",
    "v12_today_sessions",
    "v12_trips",
    "v12_sync_mutations",
    "v12_runtime_idempotency",
  ]) {
    assert.match(
      migration,
      new RegExp(
        String.raw`delete\s+from\s+public\.${table}\s+where\s+guest_ref_id\s*=\s*v_guest_id`,
        "i",
      ),
      `${table} must be included in confirmed erasure`,
    );
  }
  for (const table of ["events", "saved_places", "shared_lists"]) {
    assert.match(
      migration,
      new RegExp(
        String.raw`to_regclass\('public\.${table}'\)[\s\S]{0,220}delete from public\.${table} where guest_ref_id = \$1[\s\S]{0,80}using v_guest_id`,
        "i",
      ),
      `${table} legacy state must be erased when its optional table exists`,
    );
  }
});

test("both write-first and erase-first races end with no recreated guest state", async () => {
  const migration = await readFile(migrationUrl, "utf8");
  const lockMatches = migration.match(
    /hashtextextended\('v12-guest-privacy:' \|\| p_guest_ref, 0\)/g,
  ) ?? [];
  assert.equal(lockMatches.length, 2);
  assert.match(
    migration,
    /to_regprocedure\(\s*'public\.v12_runtime_mutate_privacy_impl\(text,text,jsonb,text\)'\s*\) is null[\s\S]*?alter function public\.v12_runtime_mutate\(text, text, jsonb, text\)[\s\S]*?rename to v12_runtime_mutate_privacy_impl/i,
  );
  assert.match(
    migration,
    /return public\.v12_runtime_mutate_privacy_impl\(/i,
  );
  assert.match(
    migration,
    /create or replace function public\.guard_privacy_erased_guest_write\(\)[\s\S]*?select g\.privacy_erased_at[\s\S]*?where g\.id = new\.guest_ref_id[\s\S]*?for update[\s\S]*?privacy-erased guest reference cannot receive new data/i,
    "legacy and v1.2 child writes must lock and inspect the guest tombstone",
  );
  for (const table of [
    "events",
    "saved_places",
    "shared_lists",
    "consent_log",
    "redemption_events",
    "v12_saved_states",
    "v12_today_items",
    "v12_visited_states",
    "v12_note_states",
    "v12_decision_runs",
    "v12_feed_sessions",
    "v12_today_sessions",
    "v12_trips",
    "v12_sync_mutations",
    "v12_runtime_idempotency",
  ]) {
    assert.match(
      migration,
      new RegExp(`'${table}'`),
      `${table} must be protected by the tombstone write guard`,
    );
  }
  assert.match(
    migration,
    /create trigger guard_privacy_erased_guest_write\s+before insert or update/i,
  );
  assert.match(
    migration,
    /insert into public\.guest_refs\([\s\S]*?privacy_erased_at[\s\S]*?on conflict \(ref\) do update[\s\S]*?returning id into v_guest_id/i,
    "erase-first must create a tombstone even when no guest row exists yet",
  );
  assert.match(
    migration,
    /select g\.privacy_erased_at[\s\S]*?where g\.ref = p_guest_ref[\s\S]*?for update[\s\S]*?privacy_erased/i,
    "delayed v1.2 runtime writes must reject a tombstoned reference after waiting",
  );
});

test("the original revoked guest reference is immutable and cannot lose its replay marker", async () => {
  const migration = await readFile(migrationUrl, "utf8");
  assert.match(migration, /add column if not exists privacy_erased_at timestamptz/i);
  assert.match(
    migration,
    /create trigger guard_guest_ref_privacy_tombstone\s+before update or delete on public\.guest_refs/i,
  );
  assert.match(migration, /old\.privacy_erased_at is not null[\s\S]*?tg_op = 'DELETE'[\s\S]*?cannot be deleted/i);
  assert.match(migration, /new is distinct from old[\s\S]*?is immutable/i);
  assert.doesNotMatch(migration, /delete\s+from\s+public\.guest_refs/i);
  assert.match(
    migration,
    /set first_district = null,\s*source = null,\s*created_at = case[\s\S]*?privacy_erased_at = coalesce/i,
    "the original installation creation time must be normalized on first erasure",
  );
});

test("retained redemption proof is detached, minimized, and limited to actual proof", async () => {
  const migration = await readFile(migrationUrl, "utf8");
  assert.doesNotMatch(migration, /delete\s+from\s+public\.redemption_events/i);
  assert.match(
    migration,
    /select count\(\*\)[\s\S]*?from public\.redemption_events[\s\S]*?where guest_ref_id = v_guest_id/i,
  );
  assert.match(
    migration,
    /insert into public\.guest_refs\(ref\)[\s\S]*?returning id into v_proof_guest_id/i,
  );
  assert.match(
    migration,
    /update public\.redemption_events\s+set guest_ref_id = v_proof_guest_id\s+where guest_ref_id = v_guest_id/i,
  );
  assert.match(
    migration,
    /with retained_consent_ids as \([\s\S]*?consent_type = 'redemption_tracking_v1'[\s\S]*?and granted[\s\S]*?limit v_retained_redemptions[\s\S]*?update public\.consent_log consent[\s\S]*?set guest_ref_id = v_proof_guest_id[\s\S]*?user_agent = null[\s\S]*?actor_name = null[\s\S]*?actor_contact = null[\s\S]*?submitted_ip = null/i,
  );
  assert.match(
    migration,
    /delete from public\.consent_log\s+where guest_ref_id = v_guest_id/i,
    "consent not supporting an actual retained redemption must be erased",
  );
  assert.match(
    migration,
    /update public\.guest_refs\s+set first_district = null,\s*source = null,\s*created_at = v_now,\s*privacy_erased_at = v_now\s+where id = v_proof_guest_id/i,
    "the detached proof anchor must also be immutable",
  );
  assert.match(
    migration,
    /'retainedRedemptions', v_retained_redemptions[\s\S]*?'retainedConsents', v_retained_consents/i,
  );
});

test("server helper uses only the service client and both deletion routes share the confirmed path", async () => {
  const [helper, webRoute, mobileRoute] = await Promise.all([
    readFile(helperUrl, "utf8"),
    readFile(webRouteUrl, "utf8"),
    readFile(mobileRouteUrl, "utf8"),
  ]);
  assert.match(helper, /import \{ serviceClient \} from "@\/lib\/supabase\/service"/);
  assert.doesNotMatch(helper, /anonClient/);
  assert.match(helper, /\.rpc\("forget_guest_v12"/);
  assert.match(webRoute, /eraseGuestData/);
  assert.doesNotMatch(webRoute, /forgetGuest\s*\(/);
  assert.match(webRoute, /Deletion could not be confirmed/);
  assert.match(mobileRoute, /resolveGuest: GuestResolver = resolveMobilePrivacyGuestRef/);
  assert.match(mobileRoute, /A valid \$\{MOBILE_GUEST_HEADER\} header is required/);
  assert.doesNotMatch(mobileRoute, /current guest cookie is required/i);
});

test("confirmed web erasure clears consent and denies an already-loaded analytics session immediately", async () => {
  const [choices, analytics] = await Promise.all([
    readFile(choicesUrl, "utf8"),
    readFile(analyticsUrl, "utf8"),
  ]);
  assert.match(
    choices,
    /if \(result\.ok !== true\)[\s\S]*?throw new Error[\s\S]*?clearConsent\(\)/,
    "consent may be cleared only after the deletion response is confirmed",
  );
  assert.match(analytics, /CustomEvent<ConsentState>/);
  assert.match(analytics, /denyAnalyticsUnlessGranted\(consent, window\.gtag\)/);
});
