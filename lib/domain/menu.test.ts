import assert from "node:assert/strict";
import test from "node:test";
import { mapPublishedMenu } from "./menu";

// Migration 0051 let a venue carry more than one published menu at once,
// distinguished by kind (food/rooms/spa/day_pass). The single point that
// reads that column back into a MenuRecord is mapPublishedMenu -- this test
// is the regression guard the kind change needed: a rooms/spa/day_pass menu
// must carry its real kind, never silently default to "food" (which would
// let it slip into the generic dining slot on an ordinary venue page).

const evidence = {
  status: "published",
  completeness: "full",
  verified_at: "2026-07-20T00:00:00.000Z",
  expires_at: "2099-01-01T00:00:00.000Z",
  source_url: "https://example-hotel.otherbali.dev/rates",
};

function row(overrides: Record<string, unknown>) {
  return {
    id: "menu-1",
    venue_slug: "fixture-hotel",
    title: "Fixture menu",
    version: 1,
    source_label: "Official source",
    captured_at: "2026-07-20T00:00:00.000Z",
    ...evidence,
    ...overrides,
  };
}

test("mapPublishedMenu carries a real, non-food kind through", () => {
  const menu = mapPublishedMenu(row({ kind: "rooms" }), [], []);
  assert.equal(menu?.kind, "rooms");
});

test("mapPublishedMenu defaults an unset/invalid kind to food, never silently to something else", () => {
  assert.equal(mapPublishedMenu(row({ kind: null }), [], [])?.kind, "food");
  assert.equal(mapPublishedMenu(row({ kind: undefined }), [], [])?.kind, "food");
  assert.equal(mapPublishedMenu(row({ kind: "not-a-real-kind" }), [], [])?.kind, "food");
});

test("mapPublishedMenu round-trips all four approved kinds", () => {
  for (const kind of ["food", "rooms", "spa", "day_pass"]) {
    assert.equal(mapPublishedMenu(row({ kind }), [], [])?.kind, kind);
  }
});

// The founder-approved 2026-08 publication policy renders partial menus as
// honest "menu highlights" instead of hiding them entirely. mapPublishedMenu
// must carry the real completeness through -- and keep rejecting everything
// that is not published, evidenced and fresh.

test("mapPublishedMenu accepts a partial published menu and preserves its completeness", () => {
  const partial = mapPublishedMenu(row({ completeness: "partial" }), [], []);
  assert.equal(partial?.completeness, "partial");
  const full = mapPublishedMenu(row({ completeness: "full" }), [], []);
  assert.equal(full?.completeness, "full");
});

test("mapPublishedMenu still rejects unpublished, unevidenced or stale rows", () => {
  assert.equal(mapPublishedMenu(row({ status: "review", completeness: "partial" }), [], []), null);
  assert.equal(mapPublishedMenu(row({ status: "source_snapshot", completeness: "partial" }), [], []), null);
  assert.equal(mapPublishedMenu(row({ completeness: "partial", verified_at: null }), [], []), null);
  assert.equal(mapPublishedMenu(row({ completeness: "unknown-completeness" }), [], []), null);
  assert.equal(
    mapPublishedMenu(row({ completeness: "partial", expires_at: "2020-01-01T00:00:00.000Z" }), [], []),
    null
  );
});
