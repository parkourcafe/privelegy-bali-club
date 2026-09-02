import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { curateByArea, hasCardCopy, lastCheckedFrom, recordDepth, selectCurated } from "./curated-list";
import type { Venue } from "../types";

const NOW = Date.parse("2026-09-01T00:00:00Z");

function venue(overrides: Partial<Venue> & { slug: string }): Venue {
  return {
    id: overrides.slug,
    name: overrides.slug,
    category: "restaurant",
    district: "canggu",
    address: "",
    gmapsUrl: "",
    tier: "editorial_seed",
    isSponsored: false,
    ...overrides,
  } as Venue;
}

const written = (slug: string, extra: Partial<Venue> = {}) =>
  venue({ slug, whyItsHere: "A reason.", bestFor: "A moment.", ...extra });

test("a venue without an editorial sentence and Best for is not a pick", () => {
  assert.equal(hasCardCopy(venue({ slug: "bare" })), false);
  assert.equal(hasCardCopy(venue({ slug: "why-only", whyItsHere: "A reason." })), false);
  assert.equal(hasCardCopy(venue({ slug: "blank", whyItsHere: "   ", bestFor: "  " })), false);
  assert.equal(hasCardCopy(written("full")), true);
});

test("thin records are excluded rather than padding the list", () => {
  const { picks, withoutCardCopy } = selectCurated(
    [written("a"), venue({ slug: "thin" }), written("b")],
    { limit: 10, now: NOW },
  );
  assert.deepEqual(picks.map((v) => v.slug), ["a", "b"]);
  assert.equal(withoutCardCopy, 1);
});

test("record depth counts evidence, never partner status", () => {
  const deep = written("deep", {
    notFor: "Not this.",
    priceAnchor: "Coffee 35k",
    whatToOrder: "The thing",
    lastVerifiedAt: "2026-08-20",
  });
  assert.equal(recordDepth(deep, NOW), 4);
  // A stale verification date stops earning the freshness point.
  assert.equal(recordDepth({ ...deep, lastVerifiedAt: "2024-01-01" }, NOW), 3);
  assert.equal(recordDepth(written("shallow"), NOW), 0);
});

test("ranking cannot be bought: tier and isSponsored change nothing", () => {
  const plain = written("plain", { lastVerifiedAt: "2026-08-01" });
  const paidLooking = written("paid-looking", {
    lastVerifiedAt: "2026-08-01",
    tier: "founding",
    isSponsored: true,
  });
  const ranked = selectCurated([paidLooking, plain], { limit: 10, now: NOW });
  // Equal records fall back to name order, not to tier.
  assert.deepEqual(ranked.picks.map((v) => v.slug), ["paid-looking", "plain"]);

  const flipped = selectCurated(
    [{ ...paidLooking, name: "z-paid" }, { ...plain, name: "a-plain" }],
    { limit: 10, now: NOW },
  );
  assert.deepEqual(flipped.picks.map((v) => v.name), ["a-plain", "z-paid"]);
});

test("the source file reads no field a partner could influence", () => {
  const source = readFileSync(new URL("./curated-list.ts", import.meta.url), "utf8");
  for (const forbidden of ["isSponsored", "tier", "perk", "tablepilotSlug"]) {
    assert.doesNotMatch(
      source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""),
      new RegExp(`\\b${forbidden}\\b`),
      `${forbidden} must not influence organic selection (AGENTS.md #7)`,
    );
  }
});

test("deeper records outrank shallower ones, then most recently verified", () => {
  const shallowFresh = written("shallow-fresh", { lastVerifiedAt: "2026-08-30" });
  const deepStale = written("deep-stale", {
    notFor: "Not this.",
    priceAnchor: "35k",
    whatToOrder: "x",
    lastVerifiedAt: "2026-08-01",
  });
  const { picks } = selectCurated([shallowFresh, deepStale], { limit: 10, now: NOW });
  assert.deepEqual(picks.map((v) => v.slug), ["deep-stale", "shallow-fresh"]);
});

test("selection is deterministic across runs", () => {
  const input = [written("c"), written("a"), written("b")];
  const first = selectCurated(input, { limit: 2, now: NOW }).picks.map((v) => v.slug);
  const second = selectCurated([...input].reverse(), { limit: 2, now: NOW }).picks.map((v) => v.slug);
  assert.deepEqual(first, second);
});

test("the cap is enforced per area and page-wide, and the remainder is reported", () => {
  const canggu = ["c1", "c2", "c3", "c4"].map((s) => written(s, { district: "canggu" }));
  const ubud = ["u1", "u2", "u3"].map((s) => written(s, { district: "ubud" }));
  const thin = [venue({ slug: "t1", district: "ubud" })];
  const result = curateByArea([...canggu, ...ubud, ...thin], [{ key: "canggu" }, { key: "ubud" }], {
    maxPicks: 5,
    maxPerArea: 3,
    now: NOW,
  });

  assert.equal(result.areas[0].venues.length, 3, "per-area cap applies first");
  assert.equal(result.areas[1].venues.length, 2, "page budget truncates the next area");
  assert.equal(result.shown.length, 5);
  // 8 published inputs, 5 shown — the 3 not shown include the thin record.
  assert.equal(result.remaining, 3);
});

test("an area with no eligible venue is dropped rather than promising an empty section", () => {
  const result = curateByArea(
    [written("a", { district: "canggu" }), venue({ slug: "thin", district: "ubud" })],
    [{ key: "canggu" }, { key: "ubud" }],
    { maxPicks: 10, maxPerArea: 10, now: NOW },
  );
  assert.deepEqual(result.areas.map((a) => a.key), ["canggu"]);
});

test("the last-checked date comes from the rendered venues, never from the clock", () => {
  assert.equal(
    lastCheckedFrom([written("a", { lastVerifiedAt: "2026-07-01" }), written("b", { lastVerifiedAt: "2026-08-14" })]),
    "2026-08-14",
  );
  // No evidence, no date — a build timestamp is not a verification.
  assert.equal(lastCheckedFrom([written("a")]), null);
  assert.equal(lastCheckedFrom([written("a", { lastVerifiedAt: "not-a-date" })]), null);
});
