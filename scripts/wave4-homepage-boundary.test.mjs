import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
const read = (path) => readFileSync(path, "utf8");
const appSource = read("app/page.tsx");
const layoutSource = read("app/layout.tsx");
const trackerSource = read("components/HomeAnalyticsLink.tsx");
const configSource = read("lib/homepage.ts");
const mobileSource = read("mobile/src/App.tsx");
const togetherSource = read("public/together/index.html");
const messagingSource = read("docs/canon/OTHER_BALI_MESSAGING_SYSTEM.md");
const sharedPlanSource = read("app/plan/shared/page.tsx");
const sharedPlanOgSource = read("app/plan/shared/og/route.tsx");

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

async function assertDecodableWebp(path) {
  const image = sharp(path);
  const metadata = await image.metadata();
  assert.equal(metadata.format, "webp", `${path} is not WebP`);
  assert.equal(metadata.width, 1200, `${path} has the wrong width`);
  assert.equal(metadata.height, 896, `${path} has the wrong height`);
  const pixels = await image.clone().raw().toBuffer();
  assert.ok(pixels.length > 0, `${path} did not decode to pixels`);
}

test("Wave 4 homepage renders the approved section hierarchy", () => {
  assert.match(configSource, /h1: "The right place for the moment you’re in\."/);
  assert.match(appSource, /id="moments"/);
  assert.match(appSource, /What do you want to do\?/);
  assert.match(appSource, /Plan your Bali trip/);
  assert.match(appSource, /Explore Bali by category/);
  assert.match(appSource, /Start with Canggu, or compare it with the rest of Bali\./);
  assert.match(appSource, /Keep your Bali shortlist in one place\./);

  const moments = appSource.indexOf('id="moments"');
  const plan = appSource.indexOf('id="plan-title"');
  const categories = appSource.indexOf('id="categories-title"');
  const canggu = appSource.indexOf('id="canggu-title"');
  const trust = appSource.indexOf('id="trust-title"');
  assert.ok(moments > 0 && plan > moments && categories > plan && canggu > categories && trust > canggu);
});

test("canonical Other Bali messaging is aligned across web, mobile and store-facing surfaces", () => {
  for (const source of [configSource, mobileSource]) {
    assert.match(source, /Discover Bali together/);
    assert.match(source, /The right place for the moment you’re in\./);
    assert.match(source, /Resident-curated places, routes and plans/);
    assert.match(source, /Less searching\. More Bali\./);
  }
  for (const forbidden of ["Find new friends", "Meet people", "People near you"]) {
    const pattern = new RegExp(escapeRegExp(forbidden), "i");
    assert.doesNotMatch(configSource, pattern);
    assert.doesNotMatch(appSource, pattern);
    assert.doesNotMatch(mobileSource, pattern);
  }
  assert.match(configSource, /The right place for the moment you’re in\./);
  assert.match(messagingSource, /does not mean social discovery/i);
  assert.match(messagingSource, /do\s+not use `Find new friends`/i);
});

test("Together page supports planning with existing companions without simulating a social network", () => {
  const templateMatch = togetherSource.match(
    /<script type="__bundler\/template">([\s\S]*?)<\/script>/,
  );
  assert.ok(templateMatch, "Together canvas template is missing");
  const togetherHtml = JSON.parse(templateMatch[1]);

  assert.match(togetherSource, /<title>Discover Bali Together · Other Bali<\/title>/);
  assert.match(togetherHtml, /<title>Discover Bali Together · Other Bali<\/title>/);
  assert.match(
    togetherHtml,
    /\[data-screen-label="Share a public page — actual states"\]\{display:none!important\}/,
  );
  assert.match(togetherHtml, /Choose with your people\./);
  assert.match(togetherHtml, /Discover Bali <span style="color:#F6C688">together<\/span>\./);
  assert.match(togetherHtml, /window\.location\.assign\('\/places'\)/);
  assert.match(togetherHtml, /otherbali\.com\/places\//);
  assert.match(togetherHtml, /Compare before you go/);
  assert.match(togetherHtml, />Open place</);
  assert.match(togetherHtml, /Can I share my personal Trip from the app\?/);
  assert.match(
    togetherHtml,
    /Not in the current mobile release — share a place or ready-made route for now\./,
  );
  assert.doesNotMatch(togetherHtml, /Find new friends\./i);
  assert.doesNotMatch(togetherHtml, /Math\.random\(\)\.toString\(36\)/);
  assert.doesNotMatch(togetherHtml, /https:\/\/otherbali\.com\/r\//);
  for (const unsupported of [
    "Creating link",
    "Link copied",
    "Copy link",
    "Clipboard",
    "Help me choose",
    "Which of these three fits us best?",
    "Ask for a private choice",
    "editorial explainer",
    "вертикальная handoff-линия",
  ]) {
    assert.doesNotMatch(togetherHtml, new RegExp(escapeRegExp(unsupported), "i"));
  }
});

test("shared plan preview stays a bounded starting point without live booking claims", () => {
  assert.match(sharedPlanSource, /shared as a starting point/);
  assert.match(sharedPlanSource, /official actions where available/);
  assert.match(sharedPlanOgSource, /Public place guide/);
  for (const unsupported of [
    "saved as a starting point",
    "verified booking",
    "Live places & bookings",
  ]) {
    const pattern = new RegExp(escapeRegExp(unsupported), "i");
    assert.doesNotMatch(sharedPlanSource, pattern);
    assert.doesNotMatch(sharedPlanOgSource, pattern);
  }
});

test("Wave 4 homepage removes old Canggu-centre and directory-first messaging", () => {
  for (const forbidden of [
    "district depth claim",
    "deepest current guidance",
    "current district focus",
    "Browse all places",
    "Partner monetization is reserved during the pilot",
    "Partner with us — free",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(forbidden), "i"));
  }
});

test("approved homepage config has valid cardinality and existing required targets", () => {
  assert.equal(countItems(extractSection("HOME_MOMENTS")), 6);
  assert.equal(countItems(extractSection("HOME_AREAS")), 6);
  const planCount = countItems(extractSection("HOME_PLANS"));
  assert.ok(planCount >= 3 && planCount <= 6);
  const categoryCount = countItems(extractSection("HOME_CATEGORIES"));
  assert.equal(categoryCount, 4);
  for (const href of [
    ...hrefs(extractSection("HOME_MOMENTS")),
    ...hrefs(extractSection("HOME_AREAS")),
    ...hrefs(extractSection("HOME_PLANS")),
    ...hrefs(extractSection("HOME_CATEGORIES")),
  ]) {
    assert.ok(routeExists(href), `missing required target: ${href}`);
  }
});

test("homepage moments use the approved Bali scenario media without public AI disclosure labels", () => {
  const approvedScenes = [
    "home-bali-first-day",
    "home-bali-sunset",
    "home-bali-with-kids",
    "home-bali-rainy-day",
    "home-bali-romantic",
    "home-bali-trip-lengths",
  ];
  const supersededScenes = [
    "home-first-day",
    "home-sunset",
    "home-with-kids",
    "home-rainy-day",
    "home-romantic",
    "home-trip-lengths",
  ];

  for (const scene of approvedScenes) {
    assert.match(appSource, new RegExp(`scene: "${scene}"`));
  }
  for (const scene of supersededScenes) {
    assert.doesNotMatch(appSource, new RegExp(`scene: "${scene}"`));
  }
  for (const forbidden of [
    "Illustrative scenario",
    "Illustrative atmosphere",
    "Illustrative route",
    "Illustrative principle",
    "generated with Higgsfield",
  ]) {
    assert.doesNotMatch(appSource, new RegExp(escapeRegExp(forbidden), "i"));
  }
});

test("approved homepage scenario assets fully decode at the reviewed dimensions", async () => {
  for (const scene of [
    "home-bali-first-day",
    "home-bali-sunset",
    "home-bali-with-kids",
    "home-bali-rainy-day",
    "home-bali-romantic",
    "home-bali-trip-lengths",
  ]) {
    await assertDecodableWebp(join(process.cwd(), "public", "scenes", `${scene}.webp`));
  }
});

test("homepage does not introduce unsupported factual or paid claims", () => {
  for (const forbidden of [
    "Open now",
    "Top-rated",
    "Popular",
    "sponsored homepage placement",
    "sponsored inventory",
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
