import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
const read = (path) => readFileSync(path, "utf8");
const appSource = read("app/page.tsx");
const layoutSource = read("app/layout.tsx");
const trackerSource = read("components/HomeAnalyticsLink.tsx");
const configSource = read("lib/homepage.ts");

function extractSection(name) {
  const marker = `export const ${name}`;
  const start = configSource.indexOf(marker);
  assert.ok(start >= 0, `missing ${name}`);
  const next = configSource.indexOf("export const", start + marker.length);
  return configSource.slice(start, next === -1 ? configSource.length : next);
}
function countItems(section) {
  return (section.match(/id: "/g) || []).length;
}
function hrefs(section) {
  return [...section.matchAll(/href: "([^"]+)"/g)].map((m) => m[1]);
}
function routeExists(href) {
  if (!href.startsWith("/") || href.includes("?") || href.includes("#")) return true;
  return existsSync(join(process.cwd(), "app", href.slice(1), "page.tsx"));
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("Wave 4 homepage renders the approved section hierarchy", () => {
  assert.match(configSource, /h1: "The right Bali for the moment you’re in\."/);
  assert.match(appSource, /id="moments"/);
  assert.match(appSource, /What do you want to do\?/);
  assert.match(appSource, /Plan your Bali trip/);
  assert.match(appSource, /Explore Bali by category/);
  assert.match(appSource, /Keep your Bali shortlist in one place\./);

  const moments = appSource.indexOf('id="moments"');
  const plan = appSource.indexOf('id="plan-title"');
  const categories = appSource.indexOf('id="categories-title"');
  const trust = appSource.indexOf('id="trust-title"');
  assert.ok(moments > 0 && plan > moments && categories > plan && trust > categories);
});

test("Wave 4 homepage removes old Canggu-centre and directory-first messaging", () => {
  for (const forbidden of [
    "Canggu-deep",
    "deepest active guide",
    "right now that’s Canggu",
    "right now that&rsquo;s Canggu",
    "Open the Canggu guide",
    "Browse all places",
    "Partner monetization is reserved during the pilot",
    "Partner with us — free",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(forbidden), "i"));
  }
});

test("approved homepage config has valid cardinality and existing required targets", () => {
  assert.equal(countItems(extractSection("HOME_MOMENTS")), 8);
  assert.equal(countItems(extractSection("HOME_AREAS")), 6);
  const planCount = countItems(extractSection("HOME_PLANS"));
  assert.ok(planCount >= 3 && planCount <= 6);
  const categoryCount = countItems(extractSection("HOME_CATEGORIES"));
  assert.ok(categoryCount >= 6 && categoryCount <= 10);
  for (const href of [
    ...hrefs(extractSection("HOME_MOMENTS")),
    ...hrefs(extractSection("HOME_AREAS")),
    ...hrefs(extractSection("HOME_PLANS")),
    ...hrefs(extractSection("HOME_CATEGORIES")),
  ]) {
    assert.ok(routeExists(href), `missing required target: ${href}`);
  }
});

test("homepage does not introduce unsupported factual or paid claims", () => {
  for (const forbidden of [
    "Open now",
    "Top-rated",
    "Popular",
    "sponsored",
    "paid placement",
    "travel time",
    "booking difficulty",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(forbidden, "i"));
    assert.doesNotMatch(configSource, new RegExp(forbidden, "i"));
  }
});

test("homepage JSON-LD uses the safe serializer and does not duplicate WebSite schema", () => {
  assert.match(appSource, /serializeJsonLd\(HOME_JSON_LD\)/);
  assert.match(layoutSource, /serializeJsonLd\(siteJsonLd\)/);
  assert.doesNotMatch(appSource, /JSON\.stringify\(HOME_JSON_LD\)/);
  assert.doesNotMatch(layoutSource, /JSON\.stringify\(siteJsonLd\)/);
  assert.doesNotMatch(appSource, /"@type": "WebSite"/);
  assert.doesNotMatch(appSource, /FAQPage/);
});

test("homepage analytics uses stable IDs and does not post new home events to the internal DB endpoint", () => {
  for (const event of [
    "home_scenario_select",
    "home_area_select",
    "home_plan_select",
    "home_category_select",
    "home_cta_select",
  ]) {
    assert.match(trackerSource, new RegExp(event));
  }
  assert.match(trackerSource, /source_context: "homepage"/);
  assert.match(trackerSource, /section_id: sectionId/);
  assert.match(trackerSource, /event_id: eventId/);
  assert.doesNotMatch(trackerSource, /fetch\("\/api\/event"/);
});
