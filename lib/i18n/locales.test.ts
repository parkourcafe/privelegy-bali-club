// Locale-resolution gates (Multi-locale public UI rule v1, AGENTS.md
// 2026-07-20). matchAcceptLanguage() is the sole thing standing between a
// visitor's browser header and which of the five public locales they land
// on — get the q-value ranking or the fallback wrong and every first-time
// visitor silently gets the wrong language.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  PUBLIC_LOCALES,
  PARTNER_LOCALES,
  LOCALE_META,
  isPublicLocale,
  matchAcceptLanguage,
  setLocaleCookie,
} from "./locales.ts";

test("DEFAULT_LOCALE is a public locale", () => {
  assert.ok(isPublicLocale(DEFAULT_LOCALE));
});

test("public and partner locale lists are disjoint", () => {
  for (const p of PARTNER_LOCALES) {
    assert.ok(!(PUBLIC_LOCALES as readonly string[]).includes(p), `"${p}" appears in both lists`);
  }
});

test("every locale has display metadata", () => {
  for (const code of [...PUBLIC_LOCALES, ...PARTNER_LOCALES]) {
    const meta = LOCALE_META[code];
    assert.ok(meta, `missing LOCALE_META for "${code}"`);
    assert.equal(meta.code, code);
    assert.ok(meta.nativeName.length > 0);
    assert.ok(meta.englishName.length > 0);
    assert.ok(meta.htmlLang.length > 0);
  }
});

test("isPublicLocale rejects the partner-only locale and junk input", () => {
  assert.ok(!isPublicLocale("id"));
  assert.ok(!isPublicLocale("xx"));
  assert.ok(!isPublicLocale(""));
  assert.ok(!isPublicLocale(null));
  assert.ok(!isPublicLocale(undefined));
  for (const code of PUBLIC_LOCALES) {
    assert.ok(isPublicLocale(code));
  }
});

test("matchAcceptLanguage falls back to English when the header is absent or empty", () => {
  assert.equal(matchAcceptLanguage(null), DEFAULT_LOCALE);
  assert.equal(matchAcceptLanguage(undefined), DEFAULT_LOCALE);
  assert.equal(matchAcceptLanguage(""), DEFAULT_LOCALE);
});

test("matchAcceptLanguage falls back to English when nothing matches a public locale", () => {
  assert.equal(matchAcceptLanguage("es-ES,es;q=0.9,tr;q=0.8"), DEFAULT_LOCALE);
  assert.equal(matchAcceptLanguage("id-ID,id;q=0.9"), DEFAULT_LOCALE);
});

test("matchAcceptLanguage picks a direct primary-tag match", () => {
  assert.equal(matchAcceptLanguage("fr-FR,fr;q=0.9,en;q=0.8"), "fr");
  assert.equal(matchAcceptLanguage("ko"), "ko");
  assert.equal(matchAcceptLanguage("ru-RU"), "ru");
});

test("matchAcceptLanguage respects q-value ranking over header order", () => {
  assert.equal(matchAcceptLanguage("es;q=0.9,ru;q=0.95"), "ru");
  assert.equal(matchAcceptLanguage("fr;q=0.5,ko;q=0.9,en;q=0.8"), "ko");
});

test("matchAcceptLanguage treats a missing q as 1.0 (highest)", () => {
  assert.equal(matchAcceptLanguage("en;q=0.5,fr"), "fr");
});

test("matchAcceptLanguage folds every zh-* variant onto the single zh dictionary", () => {
  for (const tag of ["zh-CN", "zh-TW", "zh-HK", "zh-Hant", "zh-Hans-SG"]) {
    assert.equal(matchAcceptLanguage(tag), "zh", `expected "${tag}" to resolve to zh`);
  }
});

test("matchAcceptLanguage skips an unsupported first choice and falls through to a supported one", () => {
  assert.equal(matchAcceptLanguage("tr-TR;q=1.0,zh;q=0.5"), "zh");
});

test("matchAcceptLanguage never resolves to the partner-only id locale", () => {
  assert.equal(matchAcceptLanguage("id-ID,id;q=0.9,en;q=0.1"), DEFAULT_LOCALE);
});

test("setLocaleCookie is a no-op outside the browser (no document global)", () => {
  assert.equal(typeof document, "undefined");
  assert.doesNotThrow(() => setLocaleCookie("fr"));
});

test("LOCALE_COOKIE is a stable, non-empty cookie name", () => {
  assert.equal(LOCALE_COOKIE, "ob_locale");
});
