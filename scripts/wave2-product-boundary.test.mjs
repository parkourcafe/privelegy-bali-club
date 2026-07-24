import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("five pilot district pages mount Start your shortlist", () => {
  for (const district of ["canggu", "ubud", "uluwatu", "sanur", "seminyak"]) {
    const source = read(`app/${district}/page.tsx`);
    assert.match(source, /<StartYourShortlist/);
    assert.match(source, new RegExp(`district="${district[0].toUpperCase()}${district.slice(1)}"`));
  }
  assert.match(read("components/StartYourShortlist.tsx"), /event="shortlist_generated"/);
});

test("venue detail uses evidence-only QuickDecision projection", () => {
  const source = read("app/places/[slug]/page.tsx");
  assert.match(source, /<h2>Quick decision<\/h2>/);
  assert.match(source, /reservationNote: content\?\.reservation/);
  assert.doesNotMatch(source, /reservationNote:\s*Boolean\(bookHref/);
});

test("for-venues honours the pilot freeze and reports bounded metrics", () => {
  const source = read("app/for-venues/page.tsx");
  assert.match(source, /Pilot free through 21 September 2026/);
  assert.match(source, /nothing is charged automatically/);
  assert.match(source, /organic order\s+is never for sale/);
  assert.match(source, /Aggregate card views, saves, Maps clicks, WhatsApp clicks/);
  assert.doesNotMatch(source, /a light subscription or a small commission/);
  assert.doesNotMatch(source, /we guarantee\s+(traffic|bookings?|visits?|sales?)/i);
  assert.match(source, /not a guaranteed\s+booking, visit or sale/i);
  assert.doesNotMatch(source, /one way to reach you/i);
  assert.doesNotMatch(source, /and we publish/i);
});

test("changed public routes retain canonical metadata", () => {
  for (const route of ["canggu", "ubud", "uluwatu", "sanur", "seminyak", "for-venues"]) {
    assert.match(read(`app/${route}/page.tsx`), /alternates:\s*\{\s*canonical:/);
  }
});

test("shortlist analytics stays consent-gated and service-role-only", () => {
  const safety = read("lib/actions/event-safety.ts");
  const migration = read("supabase/migrations/0058_shortlist_generated_event.sql");
  assert.match(safety, /"shortlist_generated"/);
  assert.match(migration, /'shortlist_generated'/);
  assert.match(migration, /security definer\s+set search_path = public, pg_temp/i);
  assert.match(migration, /revoke all on function public\.log_event\(text,text,text,text\) from public, anon, authenticated/i);
  assert.match(migration, /grant execute on function public\.log_event\(text,text,text,text\) to service_role/i);
});
