import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { isPublicSnapshotEnabled, PUBLIC_SNAPSHOT_DIR } from "./public-snapshot";

const read = (name: string) =>
  JSON.parse(readFileSync(path.join(PUBLIC_SNAPSHOT_DIR, name), "utf8"));

test("public pages read the snapshot unless live reads are asked for", () => {
  assert.equal(isPublicSnapshotEnabled({ source: undefined, seedAllowed: false }), true);
  assert.equal(isPublicSnapshotEnabled({ source: "live", seedAllowed: false }), false);
  assert.equal(isPublicSnapshotEnabled({ source: " LIVE ", seedAllowed: false }), false);
});

test("local fixture mode never mixes the snapshot with invented seed venues", () => {
  assert.equal(isPublicSnapshotEnabled({ source: undefined, seedAllowed: true }), false);
});

test("the committed snapshot holds only rows an anonymous visitor may read", () => {
  const venues = read("venues.json") as Record<string, unknown>[];
  assert.ok(venues.length > 1000, `expected the full catalogue, got ${venues.length}`);
  for (const v of venues) {
    assert.equal(v.status, "active", `${v.slug} is not active`);
    assert.equal(v.publication_status, "published", `${v.slug} is not published`);
  }
  assert.equal(new Set(venues.map((v) => v.slug)).size, venues.length, "duplicate slugs");

  const catalog = read("catalog.json") as Record<string, Record<string, unknown>[]>;
  for (const a of catalog.venue_action_capabilities) assert.equal(a.status, "confirmed");
  for (const m of catalog.menus) {
    assert.ok(["published", "source_snapshot"].includes(String(m.status)), `menu ${m.id}`);
    assert.ok(m.expires_at, `menu ${m.id} has no expiry, so it could never go stale`);
  }
});

test("snapshot rows carry no owner contact or partner-only fields", () => {
  const venues = read("venues.json") as Record<string, unknown>[];
  const forbidden = ["owner_email", "owner_phone", "contact_email", "contact_name", "partner_notes", "notes"];
  for (const key of forbidden) {
    assert.ok(!(key in venues[0]), `venues.json exposes ${key}`);
  }
});
