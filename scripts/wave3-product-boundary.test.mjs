import { strict as assert } from "node:assert";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

function read(path) {
  return readFileSync(path, "utf8");
}

test("Canggu Now contains the required scenario entries without current-open claims", () => {
  const source = read("components/CangguNow.tsx");
  for (const label of [
    "Near me",
    "Breakfast",
    "Restaurants",
    "Beach clubs",
    "Spa",
    "Sunset",
    "Rainy day",
    "First day",
    "Remote work",
    "With kids",
    "Saved",
    "My perks",
  ]) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing Canggu Now item: ${label}`);
  }
  assert.match(source, /Fits this moment/);
  assert.doesNotMatch(source, /Open now/i);
});

test("desktop navigation exposes Plan and mobile Plan is preserved", () => {
  assert.match(read("lib/navigation.ts"), /href: "\/plan", label: "Plan"/);
  assert.match(read("components/MobileNav.tsx"), /key: "plan"[\s\S]*href: "\/guides"/);
});

test("T10 missing editorial pages now exist", () => {
  for (const path of [
    "app/bali-itinerary-3-days/page.tsx",
    "app/bali-itinerary-5-days/page.tsx",
    "app/canggu-without-a-scooter/page.tsx",
  ]) {
    assert.ok(existsSync(path), `missing page: ${path}`);
  }
  const guides = read("lib/guides.ts");
  for (const slug of ["bali-itinerary-3-days", "bali-itinerary-5-days", "canggu-without-a-scooter"]) {
    assert.match(guides, new RegExp(`slug: "${slug}"`));
  }
});

test("Canggu food and rainy-day routes extend the existing route engine", () => {
  const migration = read("supabase/migrations/0059_wave3_canggu_routes.sql");
  assert.match(migration, /insert into public\.routes/);
  assert.match(migration, /canggu-food-route/);
  assert.match(migration, /canggu-rainy-day/);
  const data = read("lib/data.ts");
  assert.match(data, /canggu-food-route/);
  assert.match(data, /canggu-rainy-day/);
  assert.match(data, /const all = await getPublishedVenues\(\)/);
});

function assertChopeOutputIsNonPublishable(output, expectedTotal = null) {
  if (expectedTotal !== null) {
    assert.equal(output.counts.total, expectedTotal);
    assert.equal(output.staged.length, expectedTotal);
  }
  assert.equal(output.counts.publishable, 0);
  assert.ok(output.staged.length > 0);
  for (const row of output.staged) {
    assert.equal(row.publication_status, "draft");
    assert.equal(row.candidate_state, "dedup_pending");
    assert.equal(row.verification_status, "verification_pending");
    assert.equal(row.editorial_status, "editorial_pending");
    assert.equal(row.seo_status, "hold");
    assert.equal(row.photo_permission_status, "not_granted");
    assert.equal(row.publication_guard.can_publish, false);
  }
}

test("Chope dry-run cannot publish candidates", () => {
  assertChopeOutputIsNonPublishable(JSON.parse(read("data/data-ops/chope-607/dry-run-output.json")));
});

test("Full Chope-607 dry-run cannot publish candidates", () => {
  assertChopeOutputIsNonPublishable(JSON.parse(read("data/data-ops/chope-607/dry-run-output-full.json")), 607);
});
