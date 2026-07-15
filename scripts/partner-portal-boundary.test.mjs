import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const load = (path) => readFile(new URL(path, root), "utf8");

test("partner identity schema is server-controlled and RLS protected", async () => {
  const sql = await load("supabase/migrations/0035_partner_portal_identity.sql");
  assert.match(sql, /create table(?: if not exists)? public\.venue_memberships/i);
  assert.match(sql, /create table(?: if not exists)? public\.venue_onboarding_claims/i);
  assert.match(sql, /enable row level security/i);
  assert.match(sql, /revoke all on table public\.venue_memberships from public, anon, authenticated/i);
  assert.match(sql, /grant select, insert, update, delete on table public\.venue_memberships to service_role/i);
  assert.match(sql, /auth\.users/i);
  assert.doesNotMatch(sql, /user_metadata/i);
});

test("partner write routes stay draft-only and preserve editorial boundaries", async () => {
  const menu = await load("app/api/partner/menu-draft/route.ts");
  const actions = await load("app/api/partner/action-draft/route.ts");
  assert.match(menu, /getPartnerVenue/);
  assert.match(menu, /status:\s*"draft"/);
  assert.match(menu, /verified_at:\s*null/);
  assert.match(menu, /editorial_pick:\s*false/);
  assert.match(menu, /editorial_note:\s*null/);
  assert.match(actions, /getPartnerVenue/);
  assert.match(actions, /status:\s*"draft"/);
  assert.match(actions, /verified_at:\s*null/);
  assert.match(actions, /confirmation_required:\s*true/);
  assert.doesNotMatch(`${menu}\n${actions}`, /why_its_here|best_for|not_for/);
});

test("photo review records exact-image consent and remains non-publishable", async () => {
  const photos = await load("app/api/partner/photos/route.ts");
  assert.match(photos, /record_venue_photo_consent/);
  assert.match(photos, /owner_confirmed_at/);
  assert.match(photos, /publicationAllowed:\s*false/);
  assert.match(photos, /consent_granted/);
});

test("bookings are represented by the TablePilot aggregate bridge, not a local reservation table", async () => {
  const tablepilot = await load("lib/tablepilot.ts");
  assert.match(tablepilot, /TablePilotReservation/);
  assert.match(tablepilot, /reservationId/);
  assert.doesNotMatch(tablepilot, /create table|from\(["']reservations["']\)/i);
});
