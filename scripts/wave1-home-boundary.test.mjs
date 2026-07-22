import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const homePath = new URL("../app/page.tsx", import.meta.url);
const homepageConfigPath = new URL("../lib/homepage.ts", import.meta.url);
const consentPath = new URL("../components/ConsentBanner.tsx", import.meta.url);
const mobileNavCssPath = new URL("../app/globals.css", import.meta.url);

const [homeSource, homepageConfigSource, consentSource, mobileNavCss] = await Promise.all([
  readFile(homePath, "utf8"),
  readFile(homepageConfigPath, "utf8"),
  readFile(consentPath, "utf8"),
  readFile(mobileNavCssPath, "utf8"),
]);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("homepage preserves the Wave 4 product promise and traveller journey", () => {
  assert.match(homepageConfigSource, /The right Bali for the moment you’re in\./);
  assert.match(homepageConfigSource, /Choose what to do/);
  assert.match(homepageConfigSource, /Plan my trip/);
  assert.match(homeSource, /id="moments-title"/);
  assert.match(homeSource, /id="plan-title"/);
  assert.match(homeSource, /id="categories-title"/);

  const moments = homeSource.indexOf('id="moments"');
  const categories = homeSource.indexOf('id="categories-title"');
  assert.ok(moments > 0 && categories > moments, "scenario layer must appear before category browsing");
});

test("homepage exposes approved scenario routes without creating a parallel system", () => {
  const required = [
    ["Eat somewhere special", "/best-restaurants-in-bali"],
    ["Watch the sunset", "/where-to-watch-sunset-in-bali"],
    ["Make the most of a rainy day", "/bali-rainy-day"],
    ["Plan a romantic evening", "/romantic-bali"],
    ["Explore Bali with kids", "/bali-with-kids"],
    ["Plan a temple day", "/bali-temples-which-one"],
    ["Take a day trip", "/bali-day-trips"],
    ["Explore Bali beaches", "/best-beach-clubs-in-bali"],
  ];

  for (const [label, href] of required) {
    assert.match(homepageConfigSource, new RegExp(`label: "${escapeRegExp(label)}"[\\s\\S]{0,220}href: "${escapeRegExp(href)}"`));
  }
  assert.doesNotMatch(homeSource, /DayIntentBuilder/);
});

test("homepage does not advertise the frozen paid-arrival model or Canggu-first positioning", () => {
  const forbiddenClaims = [
    "Venues pay only",
    "Venues pay for arrivals",
    "venue pays a fixed fee",
    "what the venue pays for",
    "only pays for a guest",
    "That seated visit",
    "Partner monetization is reserved during the pilot",
    "Canggu-deep",
    "Open the Canggu guide",
    "right now that’s Canggu",
  ];

  for (const claim of forbiddenClaims) {
    assert.ok(!homeSource.toLowerCase().includes(claim.toLowerCase()), `remove frozen/global-centre claim: ${claim}`);
  }

  assert.match(homepageConfigSource, /Editorial ranking is not for sale/);
});

test("mobile consent actions stay above the persistent bottom navigation", () => {
  assert.match(mobileNavCss, /@media \(min-width: 1360px\) \{ \.ob-mobile-nav \{ display: none; \} \}/);
  assert.match(consentSource, /bottom-\[calc\(56px\+env\(safe-area-inset-bottom,0px\)\)\]/);
  assert.match(consentSource, /min-\[1360px\]:bottom-0/);
});
