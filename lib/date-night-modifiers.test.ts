import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  DATE_NIGHT_MODIFIERS,
  applyModifier,
  dateNightModifiersEnabled,
  getModifier,
  isDateNightModifierKey,
  modifierAvailability,
  venueModifierKeys,
} from "./date-night-modifiers";
import type { Venue } from "./types";

function venue(over: Partial<Venue> = {}): Venue {
  return {
    slug: over.slug ?? "v",
    name: over.name ?? "Venue",
    category: "restaurant",
    district: "ubud",
    ...over,
  } as Venue;
}

// --- flag ---------------------------------------------------------------

test("flag defaults to off when unset or not exactly '1'", () => {
  assert.equal(dateNightModifiersEnabled({}), false);
  assert.equal(dateNightModifiersEnabled({ NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS: "0" }), false);
  assert.equal(dateNightModifiersEnabled({ NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS: "true" }), false);
  assert.equal(dateNightModifiersEnabled({ NEXT_PUBLIC_OB_DATE_NIGHT_MODIFIERS: "1" }), true);
});

// --- evidence, not inference -------------------------------------------

test("quiet matches the quiet vibe tag and quiet-enough-to-talk practical tag", () => {
  const m = getModifier("quiet")!;
  assert.equal(m.matches!(venue({ vibeTags: ["quiet"] })), true);
  assert.equal(m.matches!(venue({ practicalTags: ["quiet-enough-to-talk"] })), true);
  assert.equal(m.matches!(venue({ vibeTags: ["lively"] })), false);
  assert.equal(m.matches!(venue({})), false, "absent tags must never count as satisfied");
});

test("quiet uses an exact allowlist, not substring containment", () => {
  const m = getModifier("quiet")!;
  // A negating or ambiguous token must never satisfy the modifier just because
  // it contains the substring "quiet".
  for (const tag of ["not-quiet", "not_quiet", "quiet_unknown", "quietly-awful", "unquiet"]) {
    assert.equal(
      m.matches!(venue({ vibeTags: [tag] })),
      false,
      `${tag} must not count as positive evidence of a quiet room`
    );
  }
});

test("availability carries no functions so it can cross the server/client boundary", () => {
  // React cannot serialize a predicate into a Client Component; carrying the
  // whole modifier object would throw at render time once the flag is on.
  const rows = modifierAvailability([venue({ vibeTags: ["quiet"] })]);
  for (const row of rows) {
    for (const [k, v] of Object.entries(row)) {
      assert.notEqual(typeof v, "function", `availability.${k} must not be a function`);
    }
    assert.deepEqual(
      Object.keys(row).sort(),
      ["available", "count", "evidence", "key", "label"],
      "availability must expose exactly the plain-data fields"
    );
    assert.doesNotThrow(() => JSON.parse(JSON.stringify(row)));
  }
});

test("sunset-view requires the sunset_drinks_view job, not a bare view tag", () => {
  const m = getModifier("sunset-view")!;
  assert.equal(m.matches!(venue({ jobs: ["sunset_drinks_view"] })), true);
  assert.equal(m.matches!(venue({ jobs: ["sunset-drinks-view"] })), true, "kebab-case is normalized");
  assert.equal(
    m.matches!(venue({ vibeTags: ["view"] })),
    false,
    "a rice-field view is not a sunset view — no approximation"
  );
});

test("special-occasion requires the special_occasion job", () => {
  const m = getModifier("special-occasion")!;
  assert.equal(m.matches!(venue({ jobs: ["date_night_special", "special_occasion"] })), true);
  assert.equal(m.matches!(venue({ jobs: ["date_night_special"] })), false);
});

test("secluded has no predicate because no field evidences it", () => {
  const m = getModifier("secluded")!;
  assert.equal(m.matches, null);
  // It must never be silently satisfied by an adjacent signal such as romantic.
  const romantic = venue({ vibeTags: ["romantic"] });
  const avail = modifierAvailability([romantic]).find((a) => a.key === "secluded")!;
  assert.equal(avail.available, false);
  assert.equal(avail.count, 0);
});

// --- availability -------------------------------------------------------

test("a modifier with zero evidence in this district is not offered", () => {
  // Mirrors live Ubud: date-night venues carry jobs but no vibe/practical tags.
  const ubud = [
    venue({ slug: "a", jobs: ["date_night_special", "special_occasion"] }),
    venue({ slug: "b", jobs: ["date_night_special", "sunset_drinks_view"] }),
    venue({ slug: "c", jobs: ["date_night_special"] }),
  ];
  const byKey = Object.fromEntries(modifierAvailability(ubud).map((a) => [a.key, a]));
  assert.equal(byKey["special-occasion"].available, true);
  assert.equal(byKey["special-occasion"].count, 1);
  assert.equal(byKey["sunset-view"].available, true);
  assert.equal(byKey["sunset-view"].count, 1);
  assert.equal(byKey.quiet.available, false, "no quiet tag in this set");
  assert.equal(byKey.secluded.available, false);
});

test("every modifier key round-trips through the guard", () => {
  for (const m of DATE_NIGHT_MODIFIERS) assert.equal(isDateNightModifierKey(m.key), true);
  assert.equal(isDateNightModifierKey("nonsense"), false);
  assert.equal(isDateNightModifierKey(undefined), false);
});

// --- applying -----------------------------------------------------------

test("applying a modifier filters to venues with positive evidence", () => {
  const vs = [
    venue({ slug: "quiet-one", vibeTags: ["quiet"] }),
    venue({ slug: "loud-one", vibeTags: ["lively"] }),
    venue({ slug: "untagged" }),
  ];
  const { venues, applied } = applyModifier(vs, "quiet");
  assert.equal(applied, "quiet");
  assert.deepEqual(venues.map((v) => v.slug), ["quiet-one"]);
});

test("unknown, absent or evidence-less modifiers return the full set unchanged", () => {
  const vs = [venue({ slug: "a" }), venue({ slug: "b" })];
  for (const key of [undefined, "", "bogus", "secluded"]) {
    const { venues, applied } = applyModifier(vs, key);
    assert.equal(applied, null, `${String(key)} must not report as applied`);
    assert.equal(venues.length, 2, `${String(key)} must not empty the page`);
  }
});

test("applyModifier never mutates the input array", () => {
  const vs = [venue({ slug: "a", vibeTags: ["quiet"] }), venue({ slug: "b" })];
  const before = vs.map((v) => v.slug);
  applyModifier(vs, "quiet");
  applyModifier(vs, undefined);
  assert.deepEqual(vs.map((v) => v.slug), before);
});

test("no-match is representable: a valid modifier can legitimately return zero", () => {
  const vs = [venue({ slug: "a", vibeTags: ["lively"] })];
  const { venues, applied } = applyModifier(vs, "quiet");
  assert.equal(applied, "quiet", "still applied — the caller must render a no-match state");
  assert.equal(venues.length, 0);
});

test("venueModifierKeys lists only modifiers with positive evidence", () => {
  assert.deepEqual(
    venueModifierKeys(venue({ vibeTags: ["quiet"], jobs: ["special_occasion"] })).sort(),
    ["quiet", "special-occasion"]
  );
  assert.deepEqual(venueModifierKeys(venue({})), [], "an untagged venue claims nothing");
  assert.deepEqual(
    venueModifierKeys(venue({ vibeTags: ["romantic"] })),
    [],
    "romantic must not imply secluded"
  );
});

test("data-refine attribute value is safe for a CSS attribute selector", () => {
  // The client filter interpolates the key into [data-refine~="…"]; keys must
  // stay in a conservative character set so that stays inert.
  for (const m of DATE_NIGHT_MODIFIERS) assert.match(m.key, /^[a-z-]+$/);
});
