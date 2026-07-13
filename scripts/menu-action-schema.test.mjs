import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const sql = await readFile(new URL("../supabase/migrations/0026_menu_action_foundation.sql", import.meta.url), "utf8");

test("all new stores enable RLS and public reads enforce freshness", () => {
  for (const table of ["menus", "menu_sections", "menu_items", "venue_action_capabilities", "venue_media_consents"]) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
  }
  assert.match(sql, /expires_at is null or expires_at > now\(\)/i);
  assert.match(sql, /publication_status = 'published'/i);
});

test("partner menu writes force editorial fields off", () => {
  const partnerItemRpc = sql.match(/create or replace function public\.upsert_partner_menu_item[\s\S]*?end; \$\$/i)?.[0] ?? "";
  assert.match(partnerItemRpc, /partner_recommended,editorial_pick,editorial_note/i);
  assert.match(partnerItemRpc, /coalesce\(p_partner_recommended,false\),false,null/i);
  assert.match(partnerItemRpc, /editorial_pick=false/i);
  assert.match(partnerItemRpc, /editorial_note=null/i);
});

test("TablePilot backfill is constrained to active-deep monetized coverage", () => {
  assert.match(sql, /d\.status='active_deep' and d\.monetization_enabled/i);
  assert.match(sql, /on conflict\(venue_slug,kind,provider\) do nothing/i);
});

test("event v2 preserves acquisition source and whitelists payload keys", () => {
  assert.match(sql, /values\(p_type,v_id,p_venue_slug,p_source,v_clean\)/i);
  assert.match(sql, /key not in \('action','provider','capabilityId','venueSlug'\)/i);
});

test("venue photo publication requires versioned granted consent", () => {
  assert.match(sql, /create table if not exists public\.venue_media_consents/i);
  assert.match(sql, /create or replace function public\.record_venue_media_consent/i);
  const photoRpc = sql.match(/create or replace function public\.set_venue_photo[\s\S]*?end; \$\$/i)?.[0] ?? "";
  assert.match(photoRpc, /media_consent_required/i);
  assert.match(photoRpc, /c\.granted/i);
});
