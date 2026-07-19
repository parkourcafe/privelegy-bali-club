// UI-chrome dictionary gates (Multi-locale public UI rule v2, AGENTS.md
// 2026-07-20). t() must never surface a blank/undefined label, and every
// public locale's dictionary must stay in sync with the strings the chrome
// actually renders — this catches a new nav entry shipping untranslated
// silently (it would still render fine via English fallback, but this test
// makes that a deliberate choice, not a gap nobody noticed).
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { t, DICTIONARIES } from "./dictionaries.ts";
import { PUBLIC_LOCALES } from "./locales.ts";
import { NAV_GROUPS, NAV_ACTIONS, GATEWAY_PRIMARY, GATEWAY_SECONDARY } from "../navigation.ts";

const TRANSLATABLE_LOCALES = PUBLIC_LOCALES.filter((l) => l !== "en");

// District/area proper nouns are deliberately excluded from the
// completeness check — see the place-name policy note atop dictionaries.ts.
// "All areas" is excluded from this exclusion: it's a UI action label, not a
// place name, and the dictionaries do translate it.
const AREAS_GROUP = NAV_GROUPS.find((g) => g.key === "areas");
if (!AREAS_GROUP) throw new Error("expected an 'areas' nav group to exist");
const PLACE_NAMES = new Set(
  AREAS_GROUP.links.filter((l) => l.label !== "All areas").map((l) => l.label),
);

// Includes MobileNav's TABS labels, which are literals local to that
// component rather than entries in the shared navigation registry.
const CHROME_LITERALS = [
  "Close",
  "Explore",
  "Explore Bali categories",
  "Plan",
  "Primary",
  "Search",
  "What are you looking for?",
];

const NAV_STRINGS = [
  ...NAV_GROUPS.flatMap((g) => [g.label, ...g.links.map((l) => l.label)]),
  ...NAV_ACTIONS.map((a) => a.label),
  ...GATEWAY_PRIMARY.flatMap((c) => [c.label, c.blurb]),
  ...GATEWAY_SECONDARY.flatMap((l) => [l.label, l.blurb].filter((v): v is string => !!v)),
];

const TRANSLATABLE_STRINGS = [...new Set([...NAV_STRINGS, ...CHROME_LITERALS])].filter(
  (s) => !PLACE_NAMES.has(s),
);

test("t() returns the English source unchanged for the 'en' locale", () => {
  for (const s of TRANSLATABLE_STRINGS) {
    assert.equal(t("en", s), s);
  }
});

test("t() falls back to the English source for a locale with no dictionary entry", () => {
  assert.equal(t("zh", "Some brand-new string nobody translated yet"), "Some brand-new string nobody translated yet");
});

test("t() never returns an empty string for a non-empty input", () => {
  for (const locale of TRANSLATABLE_LOCALES) {
    for (const s of TRANSLATABLE_STRINGS) {
      assert.ok(t(locale, s).length > 0, `${locale} translation of "${s}" is empty`);
    }
  }
});

test("every non-place-name chrome string has a translation in every public locale", () => {
  for (const locale of TRANSLATABLE_LOCALES) {
    const dict = DICTIONARIES[locale];
    assert.ok(dict, `missing dictionary for locale "${locale}"`);
    for (const s of TRANSLATABLE_STRINGS) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(dict, s),
        `locale "${locale}" is missing a translation for "${s}"`,
      );
    }
  }
});

test("dictionaries carry no stale keys the chrome no longer renders", () => {
  const known = new Set(TRANSLATABLE_STRINGS);
  for (const locale of TRANSLATABLE_LOCALES) {
    const dict = DICTIONARIES[locale];
    assert.ok(dict);
    for (const key of Object.keys(dict)) {
      assert.ok(known.has(key), `locale "${locale}" has a stale/unused key "${key}"`);
    }
  }
});
