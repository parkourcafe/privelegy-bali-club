import assert from "node:assert/strict";
import test from "node:test";
import { evaluateActions, evaluateMenus, evaluateVenues, isPublishableHttpsUrl, sortFreshnessIssues } from "../components/admin/freshness-model";

const NOW = new Date("2026-07-13T00:00:00.000Z");
const evidence = { source_url: "https://venue.test/menu", source_label: "Official menu", captured_at: "2026-07-01T00:00:00.000Z", verified_at: "2026-07-02T00:00:00.000Z" };

test("rejects malformed, insecure and fixture URLs", () => {
  assert.equal(isPublishableHttpsUrl("http://venue.test"), false);
  assert.equal(isPublishableHttpsUrl("https://example.com/menu"), false);
  assert.equal(isPublishableHttpsUrl("https://venue.test/menu"), true);
});

test("reports stale and empty menus without deleting them", () => {
  const issues = evaluateMenus([{ id: "m1", venue_slug: "v1", status: "published", ...evidence, expires_at: "2026-07-01T00:00:00.000Z", section_count: 0, item_count: 0 }], NOW);
  assert.deepEqual(issues.map((issue) => issue.code).sort(), ["empty_menu", "stale_menu"]);
});

test("keeps draft replacement private and reports review work", () => {
  const issues = evaluateMenus([{ id: "m2", venue_slug: "v1", status: "draft", ...evidence, expires_at: "2099-01-01T00:00:00.000Z", section_count: 1, item_count: 1 }], NOW);
  assert.deepEqual(issues.map((issue) => issue.code), ["menu_needs_review"]);
});

test("blocks invalid and expired action handoffs", () => {
  const issues = evaluateActions([{ id: "a1", venue_slug: "v1", kind: "delivery", status: "confirmed", ...evidence, url: "javascript:alert(1)", expires_at: "2026-07-01T00:00:00.000Z" }], NOW);
  assert.deepEqual(issues.map((issue) => issue.code).sort(), ["invalid_provider_url", "stale_action"]);
});

test("reports venue publication and Maps blockers", () => {
  const issues = evaluateVenues([{ slug: "v1", status: "inactive", publication_status: "review", gmaps_url: null, last_verified_at: null }]);
  assert.deepEqual(issues.map((issue) => issue.code).sort(), ["missing_verified_maps", "venue_publication_blocker"]);
});

test("sorts blockers before warnings and informational work", () => {
  const sorted = sortFreshnessIssues([
    { code: "i", severity: "info", entity: "menu", entityId: "1", venueSlug: "v", message: "i" },
    { code: "b", severity: "blocker", entity: "menu", entityId: "1", venueSlug: "v", message: "b" },
    { code: "w", severity: "warning", entity: "menu", entityId: "1", venueSlug: "v", message: "w" },
  ]);
  assert.deepEqual(sorted.map((issue) => issue.severity), ["blocker", "warning", "info"]);
});

