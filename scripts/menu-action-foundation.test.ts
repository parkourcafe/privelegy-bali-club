import assert from "node:assert/strict";
import test from "node:test";
import { mapPublishedMenu } from "../lib/domain/menu.ts";
import {
  mapPublishedActionCapability,
  safeActionEventPayload,
  sortActionCapabilities,
} from "../lib/domain/actions.ts";
import { menuActionFixtures } from "../lib/contracts/menu-action.fixtures.ts";

function menuRow(menu: typeof menuActionFixtures.freshMenu) {
  return {
    id: menu.id, venue_slug: menu.venueSlug, title: menu.title, version: menu.version,
    status: menu.status, source_url: menu.sourceUrl, source_label: menu.sourceLabel,
    captured_at: menu.capturedAt, verified_at: menu.verifiedAt, expires_at: menu.expiresAt,
  };
}

test("published menu mapping suppresses expired fixtures", () => {
  assert.equal(mapPublishedMenu(menuRow(menuActionFixtures.staleMenu), [], []), null);
});

test("menu mapping is deterministic and preserves snake/camel boundary", () => {
  const fixture = menuActionFixtures.freshMenu;
  const sections = [{ id: "b", menu_id: fixture.id, name: "Second", position: 2 }, { id: "a", menu_id: fixture.id, name: "First", position: 1 }];
  const items = [{ id: "item", menu_id: fixture.id, section_id: "a", name: "Bowl", price_minor: 8500000, currency: "IDR", position: 0 }];
  const mapped = mapPublishedMenu(menuRow(fixture), sections, items);
  assert.deepEqual(mapped?.sections.map((section) => section.id), ["a", "b"]);
  assert.equal(mapped?.sections[0]?.items[0]?.priceMinor, 8500000);
});

test("action mapping rejects invalid and expired URLs, then sorts priority", () => {
  const rows = menuActionFixtures.capabilities.map((action) => ({
    id: action.id, venue_slug: action.venueSlug, kind: action.kind, provider: action.provider,
    url: action.url, label: action.label, status: action.status, priority: action.priority,
    confirmation_required: action.confirmationRequired, source_url: action.sourceUrl,
    source_label: action.sourceLabel, captured_at: action.capturedAt,
    verified_at: action.verifiedAt, expires_at: action.expiresAt,
  }));
  const mapped = rows.map((row) => mapPublishedActionCapability(row)).filter((row) => row !== null);
  assert.deepEqual(sortActionCapabilities(mapped).map((action) => action.kind), ["reserve", "maps"]);
  assert.equal(mapPublishedActionCapability({ ...rows[0], url: "javascript:alert(1)" }), null);
  assert.equal(mapPublishedActionCapability({ ...rows[0], expires_at: "2020-01-01T00:00:00Z" }), null);
});

test("safe event payload keeps only bounded contract fields", () => {
  assert.deepEqual(safeActionEventPayload({ action: "reserve", provider: "tablepilot", capabilityId: "cap-1", venueSlug: "fixture-venue" }), {
    action: "reserve", provider: "tablepilot", capabilityId: "cap-1", venueSlug: "fixture-venue",
  });
  assert.equal(safeActionEventPayload({ action: "reserve", provider: "", venueSlug: "fixture-venue" }), null);
});
