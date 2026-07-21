import assert from "node:assert/strict";
import test from "node:test";
import {
  parseAnswers,
  hasAnyAnswer,
  nearestArea,
  buildArc,
  areaName,
} from "./day-builder";

test("parseAnswers keeps valid values and drops unknown / all", () => {
  const a = parseAnswers({ area: "canggu", group: "couple", vibe: "quiet", budget: "splurge", finish: "special" });
  assert.deepEqual(a, { area: "canggu", group: "couple", vibe: "quiet", budget: "splurge", finish: "special" });

  const b = parseAnswers({ area: "all", group: "aliens", vibe: "quiet" });
  assert.equal(b.area, null); // "all" => all Bali
  assert.equal(b.group, null); // unknown value dropped
  assert.equal(b.vibe, "quiet");

  const c = parseAnswers({ area: "atlantis" });
  assert.equal(c.area, null); // unknown district dropped
});

test("hasAnyAnswer reflects whether the traveller chose anything", () => {
  assert.equal(hasAnyAnswer(parseAnswers({})), false);
  assert.equal(hasAnyAnswer(parseAnswers({ vibe: "local" })), true);
});

test("nearestArea snaps a Canggu-ish fix to Canggu", () => {
  const near = nearestArea(-8.65, 115.14);
  assert.equal(near?.slug, "canggu");
});

test("nearestArea snaps an Ubud-ish fix to Ubud, not a coastal area", () => {
  assert.equal(nearestArea(-8.51, 115.26)?.slug, "ubud");
});

test("nearestArea returns null when the fix is far outside south Bali", () => {
  // North coast (Lovina ~ -8.16, 115.03) is well beyond the 35km cluster.
  assert.equal(nearestArea(-8.16, 115.03), null);
});

test("buildArc: default day is the four-slot arc", () => {
  const arc = buildArc(parseAnswers({}));
  assert.deepEqual(arc.map((s) => s.key), ["morning", "midday", "golden", "dinner"]);
  assert.equal(arc.find((s) => s.key === "morning")!.collection, "brunch-and-breakfast");
  assert.equal(arc.find((s) => s.key === "dinner")!.collection, "date-night");
});

test("buildArc: answers swap the collection each slot draws from", () => {
  const family = buildArc(parseAnswers({ group: "family" }));
  assert.equal(family.find((s) => s.key === "dinner")!.collection, "family-easy-dinners");

  const splurge = buildArc(parseAnswers({ budget: "splurge" }));
  assert.equal(splurge.find((s) => s.key === "dinner")!.collection, "worth-the-splurge");

  const cheapLocal = buildArc(parseAnswers({ budget: "cheap", vibe: "local" }));
  assert.equal(cheapLocal.find((s) => s.key === "morning")!.collection, "cheap-and-brilliant");
  assert.equal(cheapLocal.find((s) => s.key === "midday")!.collection, "balinese-and-local-food");

  // "special" wins over group/budget for the dinner slot.
  const special = buildArc(parseAnswers({ finish: "special", group: "friends", budget: "cheap" }));
  assert.equal(special.find((s) => s.key === "dinner")!.collection, "special-occasion");
});

test("buildArc: ending on dinner or an early night drops the golden-hour stop", () => {
  assert.ok(!buildArc(parseAnswers({ finish: "dinner" })).some((s) => s.key === "golden"));
  assert.ok(!buildArc(parseAnswers({ finish: "early" })).some((s) => s.key === "golden"));
  // Sunset finish keeps it.
  assert.ok(buildArc(parseAnswers({ finish: "sunset" })).some((s) => s.key === "golden"));
});

test("areaName resolves a slug to its display name", () => {
  assert.equal(areaName("uluwatu-bukit"), "Uluwatu & the Bukit");
  assert.equal(areaName(null), null);
});
