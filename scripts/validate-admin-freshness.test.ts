import assert from "node:assert/strict";
import test from "node:test";
import { evaluateActions, evaluateMenus, evaluateVenues, isPublishableActionTarget, isPublishableHttpsUrl, sortFreshnessIssues } from "../components/admin/freshness-model";

const NOW = new Date("2026-07-13T00:00:00.000Z");
const evidence = { source_url: "https://venue.test/menu", source_label: "Official menu", captured_at: "2026-07-01T00:00:00.000Z", verified_at: "2026-07-02T00:00:00.000Z" };

test("rejects malformed, insecure and fixture URLs", () => {
  assert.equal(isPublishableHttpsUrl("http://venue.test"), false);
  assert.equal(isPublishableHttpsUrl("https://example.com/menu"), false);
  assert.equal(isPublishableHttpsUrl("https://official.test@evil.test/menu"), false);
  assert.equal(isPublishableHttpsUrl("https://venue.test/menu"), true);
});

test("requires provider/action/host agreement before action publication", () => {
  assert.equal(isPublishableActionTarget({ kind: "reserve", provider: "sevenrooms", url: "https://www.sevenrooms.com/reservations/venue", source_url: "https://venue.test" }), true);
  assert.equal(isPublishableActionTarget({ kind: "reserve", provider: "sevenrooms", url: "https://sevenrooms.com.evil.test/reservations/venue", source_url: "https://venue.test" }), false);
  assert.equal(isPublishableActionTarget({ kind: "website", provider: "official", url: "https://book.venue.test", source_url: "https://venue.test" }), true);
  assert.equal(isPublishableActionTarget({ kind: "website", provider: "official", url: "https://evil.test", source_url: "https://venue.test" }), false);
});

test("reports stale and empty menus without deleting them", () => {
  const issues = evaluateMenus([{ id: "m1", venue_slug: "v1", status: "published", ...evidence, expires_at: "2026-07-01T00:00:00.000Z", section_count: 0, item_count: 0 }], NOW);
  assert.deepEqual(issues.map((issue) => issue.code).sort(), ["empty_menu", "stale_menu"]);
});

test("keeps draft replacement private and reports review work", () => {
  const issues = evaluateMenus([{ id: "m2", venue_slug: "v1", status: "draft", ...evidence, verified_at: null, expires_at: null, section_count: 1, item_count: 1 }], NOW);
  assert.deepEqual(issues.map((issue) => issue.code), ["menu_needs_review"]);
});

test("requires real verification and expiry only after review/publication", () => {
  const menuIssues = evaluateMenus([{ id: "m3", venue_slug: "v1", status: "review", ...evidence, verified_at: null, expires_at: null, section_count: 1, item_count: 1 }], NOW);
  assert.deepEqual(menuIssues.map((issue) => issue.code).sort(), ["menu_needs_review", "missing_expiry", "missing_verification"]);
  const actionIssues = evaluateActions([{ id: "a2", venue_slug: "v1", kind: "website", provider: "official", status: "confirmed", ...evidence, verified_at: null, source_url: "https://venue.test", url: "https://venue.test/book", expires_at: null }], NOW);
  assert.deepEqual(actionIssues.map((issue) => issue.code).sort(), ["missing_expiry", "missing_verification"]);
});

test("blocks invalid and expired action handoffs", () => {
  const issues = evaluateActions([{ id: "a1", venue_slug: "v1", kind: "delivery", provider: "gofood", status: "confirmed", ...evidence, url: "javascript:alert(1)", expires_at: "2026-07-01T00:00:00.000Z" }], NOW);
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
