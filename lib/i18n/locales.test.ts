// Locale-resolution gates (Multi-locale public UI rule v2, AGENTS.md
// 2026-07-20; Accept-Language auto-detect removed same day per founder
// decision — every visitor now lands on DEFAULT_LOCALE and switches
// explicitly via LocaleSwitcher).
import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  PUBLIC_LOCALES,
  LOCALE_META,
  isPublicLocale,
  setLocaleCookie,
} from "./locales.ts";

test("DEFAULT_LOCALE is a public locale", () => {
  assert.ok(isPublicLocale(DEFAULT_LOCALE));
});

test("every public locale has display metadata", () => {
  for (const code of PUBLIC_LOCALES) {
    const meta = LOCALE_META[code];
    assert.ok(meta, `missing LOCALE_META for "${code}"`);
    assert.equal(meta.code, code);
    assert.ok(meta.nativeName.length > 0);
    assert.ok(meta.englishName.length > 0);
    assert.ok(meta.htmlLang.length > 0);
  }
});

test("isPublicLocale accepts every public locale and rejects junk input", () => {
  assert.ok(!isPublicLocale("xx"));
  assert.ok(!isPublicLocale(""));
  assert.ok(!isPublicLocale(null));
  assert.ok(!isPublicLocale(undefined));
  for (const code of PUBLIC_LOCALES) {
    assert.ok(isPublicLocale(code));
  }
});

test("setLocaleCookie is a no-op outside the browser (no document global)", () => {
  assert.equal(typeof document, "undefined");
  assert.doesNotThrow(() => setLocaleCookie("fr"));
});

test("LOCALE_COOKIE is a stable, non-empty cookie name", () => {
  assert.equal(LOCALE_COOKIE, "ob_locale");
});
