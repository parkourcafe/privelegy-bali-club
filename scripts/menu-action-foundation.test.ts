import assert from "node:assert/strict";
import test from "node:test";
import { mapPublishedMenu, mapPublicMenuSummary } from "../lib/domain/menu.ts";
import {
  mapPublishedActionCapability,
  safeActionEventPayload,
  sortActionCapabilities,
} from "../lib/domain/actions.ts";
import { menuActionFixtures } from "../lib/contracts/menu-action.fixtures.ts";
import type { MenuRecord } from "../lib/contracts/menu-action.ts";
import { evaluateMenus } from "../components/admin/freshness-model.ts";
import { formatMenuDate, formatMenuPrice, getMenuFreshness } from "../components/menu/menu-model.ts";

function menuRow(menu: MenuRecord) {
  return {
    id: menu.id, venue_slug: menu.venueSlug, title: menu.title, version: menu.version,
    status: menu.status, completeness: menu.completeness, source_url: menu.sourceUrl, source_label: menu.sourceLabel,
    captured_at: menu.capturedAt, verified_at: menu.verifiedAt, expires_at: menu.expiresAt,
  };
}

test("published menu mapping suppresses expired fixtures", () => {
  assert.equal(mapPublishedMenu(menuRow(menuActionFixtures.staleMenu), [], []), null);
});

test("published menu mapping suppresses unsafe evidence URLs", () => {
  const unsafe = {
    ...menuActionFixtures.freshMenu,
    sourceUrl: "https://official.example@evil.test/menu",
  };
  assert.equal(mapPublishedMenu(menuRow(unsafe), [], []), null);
});

test("published menu mapping suppresses partial extracts", () => {
  assert.equal(mapPublishedMenu({ ...menuRow(menuActionFixtures.freshMenu), completeness: "partial" }, [], []), null);
});

test("public partial source snapshots stay unverified, fresh and nonempty", () => {
  const fixture: MenuRecord = {
    ...menuActionFixtures.freshMenu,
    id: "fixture-source-snapshot",
    status: "source_snapshot",
    completeness: "partial",
    verifiedAt: null,
  };
  const sections = [{
    id: "snapshot-section",
    menu_id: fixture.id,
    name: "Review subset",
    description: null,
    position: 0,
  }];
  const items = [{
    id: "snapshot-item",
    menu_id: fixture.id,
    section_id: "snapshot-section",
    name: "Listed dish",
    description: null,
    price_minor: null,
    currency: null,
    price_text: "56",
    dietary_tags: ["vegan"],
    verified_allergen_tags: ["nuts"],
    partner_recommended: true,
    editorial_pick: true,
    editorial_note: "Unreviewed internal note",
    position: 0,
  }];

  const mapped = mapPublishedMenu(menuRow(fixture), sections, items);
  assert.equal(mapped?.status, "source_snapshot");
  assert.equal(mapped?.verifiedAt, null);
  assert.equal(mapped?.sections[0]?.items[0]?.priceText, "56");
  assert.deepEqual(mapped?.sections[0]?.items[0]?.dietaryTags, []);
  assert.deepEqual(mapped?.sections[0]?.items[0]?.verifiedAllergenTags, []);
  assert.equal(mapped?.sections[0]?.items[0]?.partnerRecommended, false);
  assert.equal(mapped?.sections[0]?.items[0]?.editorialPick, false);
  assert.equal(mapped?.sections[0]?.items[0]?.editorialNote, null);
  assert.equal(getMenuFreshness(fixture), "fresh");
  assert.equal(mapPublicMenuSummary(menuRow(fixture))?.venueSlug, fixture.venueSlug);

  assert.equal(
    mapPublishedMenu({ ...menuRow(fixture), verified_at: "2026-07-14T00:00:00.000Z" }, sections, items),
    null,
  );
  assert.equal(
    mapPublishedMenu({ ...menuRow(fixture), expires_at: "2020-01-01T00:00:00.000Z" }, sections, items),
    null,
  );
  assert.equal(mapPublishedMenu(menuRow(fixture), [], []), null);
});

test("admin freshness labels source snapshots informationally without inventing verification", () => {
  const issues = evaluateMenus([{
    id: "fixture-source-snapshot",
    venue_slug: "fixture-venue",
    status: "source_snapshot",
    completeness: "partial",
    source_url: "https://fixturevenue.com/official-menu",
    source_label: "Official venue source",
    captured_at: "2026-07-13T00:00:00.000Z",
    verified_at: null,
    expires_at: "2099-01-01T00:00:00.000Z",
    section_count: 1,
    item_count: 1,
  }]);
  assert.deepEqual(issues.map(({ code, severity }) => ({ code, severity })), [
    { code: "partial_menu", severity: "info" },
  ]);
  assert.equal(issues.some((issue) => issue.code === "missing_verification"), false);
});

test("menu mapping is deterministic and preserves snake/camel boundary", () => {
  const fixture = menuActionFixtures.freshMenu;
  const sections = [{ id: "b", menu_id: fixture.id, name: "Second", position: 2 }, { id: "a", menu_id: fixture.id, name: "First", position: 1 }];
  const items = [{ id: "item", menu_id: fixture.id, section_id: "a", name: "Bowl", price_minor: 85000, currency: "IDR", price_text: "Rp 85,000", position: 0 }];
  const mapped = mapPublishedMenu(menuRow(fixture), sections, items);
  assert.deepEqual(mapped?.sections.map((section) => section.id), ["a", "b"]);
  assert.equal(mapped?.sections[0]?.items[0]?.priceMinor, 85000);
  assert.equal(mapped?.sections[0]?.items[0]?.priceText, "Rp 85,000");
});

test("menu prices preserve source text and do not scale zero-decimal IDR", () => {
  assert.equal(formatMenuPrice(85000, "IDR", "Rp 85k++"), "Rp 85k++");
  assert.equal(formatMenuPrice(56000, "IDR", "56"), "“56” as listed");
  const formatted = formatMenuPrice(85000, "IDR");
  assert.match(formatted ?? "", /85[,.]000/);
  assert.doesNotMatch(formatted ?? "", /8[,.]500[,.]000/);
});

test("menu dates are rendered in Bali time instead of the server timezone", () => {
  assert.equal(formatMenuDate("2026-07-13T16:30:00.000Z"), "14 Jul 2026");
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
