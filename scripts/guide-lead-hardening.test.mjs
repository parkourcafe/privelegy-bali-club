import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const [migration, route, privacyPage, inventory, operations, blockers] = await Promise.all([
  readFile(new URL("supabase/migrations/0038_guide_lead_hardening.sql", root), "utf8"),
  readFile(new URL("app/api/guide-lead/route.ts", root), "utf8"),
  readFile(new URL("app/privacy/page.tsx", root), "utf8"),
  readFile(new URL("docs/launch/data-inventory.md", root), "utf8"),
  readFile(new URL("docs/launch/privacy-data-operations.md", root), "utf8"),
  readFile(new URL("docs/launch/manual-blockers.md", root), "utf8"),
]);

function functionBody(sql, name) {
  return sql.match(new RegExp(
    `create or replace function public\\.${name}\\b[\\s\\S]*?\\n\\$\\$;`,
    "i",
  ))?.[0] ?? "";
}

test("0038 makes guide-lead writes service-only", () => {
  const body = functionBody(migration, "submit_guide_lead");
  assert.match(migration, /^begin;[\s\S]*commit;\s*$/im);
  assert.match(migration, /to_regclass\('public\.guide_leads'\)/i);
  assert.match(body, /auth\.role\(\) is distinct from 'service_role'/i);
  assert.match(
    migration,
    /revoke all on function public\.submit_guide_lead\([\s\S]*?\) from public, anon, authenticated, service_role;/i,
  );
  assert.match(
    migration,
    /grant execute on function public\.submit_guide_lead\([\s\S]*?\) to service_role;/i,
  );
  assert.doesNotMatch(
    migration,
    /grant execute on function public\.submit_guide_lead[\s\S]*?to (?:anon|authenticated)/i,
  );
});

test("guide-lead dedupe and rate limit are one atomic no-IP transaction", () => {
  const body = functionBody(migration, "submit_guide_lead");
  const roleCheck = body.indexOf("auth.role() is distinct from 'service_role'");
  const lock = body.indexOf("pg_advisory_xact_lock");
  const rowLock = body.indexOf("for update");
  const limit = body.indexOf("v_window_count >= v_max_submissions");
  const upsert = body.indexOf("insert into public.guide_leads");
  assert.ok(roleCheck > 0 && lock > roleCheck && rowLock > lock && limit > rowLock && upsert > limit);
  assert.match(body, /v_window constant interval := interval '15 minutes'/i);
  assert.match(body, /v_max_submissions constant integer := 5/i);
  assert.match(body, /'error', 'rate_limited'[\s\S]*?'retry_after_seconds'/i);
  assert.match(migration, /submission_window_count between 0 and 5/i);
  assert.doesNotMatch(migration, /inet_client_addr|p_(?:client_)?ip|submitted_ip|x-forwarded-for/i);
});

test("guide-lead route cannot fall back to the public Supabase client", () => {
  assert.match(route, /import \{ serviceClient \} from "@\/lib\/supabase\/service"/);
  assert.match(route, /const sb = serviceClient\(\)/);
  assert.doesNotMatch(route, /anonClient/);
  assert.match(route, /interpretGuideLeadRpcResult\(data\)/);
  assert.match(route, /result\.status === "stored" \|\| result\.status === "rate_limited"[\s\S]*?acceptedResponse\(\)/);
  assert.match(route, /\{ ok: true, accepted: true \}[\s\S]*?status: 202/);
  assert.doesNotMatch(route, /Retry-After|duplicate:\s*result|spam:\s*true|status:\s*429/);
  assert.match(route, /user-agent"\)\?\.substring\(0, 400\)/);
  assert.match(route, /readBoundedJson\(req, MAX_GUIDE_LEAD_BODY_BYTES\)/);
});

test("unverified duplicate contacts cannot overwrite the original lead profile", () => {
  const body = functionBody(migration, "submit_guide_lead");
  const conflict = body.slice(body.indexOf("on conflict"));
  assert.match(conflict, /submission_window_started_at = excluded\.submission_window_started_at/i);
  assert.match(conflict, /submission_window_count = excluded\.submission_window_count/i);
  for (const protectedField of ["first_name", "travel_date", "interests", "language", "source", "utm"]) {
    assert.doesNotMatch(
      conflict,
      new RegExp(`${protectedField}\\s*=\\s*excluded\\.${protectedField}`, "i"),
    );
  }
});

test("privacy surfaces state the separate guide-lead rights boundary", () => {
  assert.match(privacyPage, /email or WhatsApp[\s\S]*?travel date[\s\S]*?interests/i);
  assert.match(privacyPage, /not included in the browser-linked[\s\S]*?export or deletion/i);
  assert.match(privacyPage, /support@otherbali\.com/i);
  assert.match(inventory, /Guide lead contact and trip preferences/i);
  assert.match(inventory, /5 submissions per 15 minutes/i);
  assert.match(operations, /Guide-lead access and deletion/i);
  assert.match(operations, /does not prove that the requester controls that contact/i);
  assert.match(blockers, /guide-lead retention/i);
});
