// Golden-page gate for parse.mjs. Expected values were read from the raw HTML
// independently (stdlib regex, not parse5) on 2026-09-28; the parser must
// reproduce them exactly before any check result is trusted.
//
//   PARSE5_DIR=<dir with node_modules/parse5> node --test parse.test.mjs

import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePage } from "./parse.mjs";

const FX = join(dirname(fileURLToPath(import.meta.url)), "../fixtures");
const index = JSON.parse(await readFile(join(FX, "index.json"), "utf8"));
const load = async (name) => parsePage(gunzipSync(await readFile(join(FX, `${name}.html.gz`))).toString("utf8"), index[name].url);
const pair = (p, block, label) => p.place.blocks[block]?.pairs.find((x) => x.label === label)?.value ?? null;
const rendered = (p) => new Set(p.links.filter((l) => !l.external && !l.chrome && !l.similar && l.path?.startsWith("/places/")).map((l) => l.path)).size;

test("registry place: Single Fin", async () => {
  const p = await load("place-registry-single-fin");
  assert.equal(p.title, "Single Fin — Bar in Suluban, Pecatu, Uluwatu · Other Bali");
  assert.deepEqual(p.canonicals, ["https://www.otherbali.com/places/single-fin"]);
  assert.deepEqual(p.h1, ["Single Fin"]);
  assert.equal(p.place.kicker, "Bar · Suluban, Pecatu · Uluwatu · $$");
  assert.equal(p.place.lastChecked, "2026-07-12");
  assert.equal(pair(p, "Quick decision", "Best for"), "sunset drinks with the surf view; group nights out; post-surf beers");
  assert.equal(pair(p, "Quick decision", "Not for"), "a quiet dinner for two, or working on a laptop");
  assert.equal(pair(p, "Practical", "Where"), "Pantai Suluban, Jl. Labuan Sait, Pecatu");
  assert.equal(pair(p, "Practical", "Spend"), "$$ — relative to the area");
  assert.equal(pair(p, "Practical", "Hours"), null);
  assert.deepEqual(p.place.actions.map((a) => a.label), ["Website", "Open in Google Maps"]);
  assert.ok(p.place.ld.type.includes("BarOrPub"));
  assert.equal(p.place.ld.streetAddress, "Pantai Suluban, Jl. Labuan Sait, Pecatu");
  assert.equal(p.place.ld.telephone, null);
  assert.equal(p.place.ld.openingHours, null);
  assert.equal(p.place.ldCount, 1);
  assert.equal(p.place.menus.length, 0);
  assert.equal(rendered(p), 0, "only 'Similar places nearby' links point to places");
  assert.equal(p.links.filter((l) => l.similar && l.path?.startsWith("/places/")).length > 0, true);
});

test("DB place: Milu by Nook — area note as visible address, no street address in markup", async () => {
  const p = await load("place-db-milu-by-nook");
  assert.equal(p.place.kicker, "Restaurant · Berawa · Canggu");
  assert.equal(p.place.lastChecked, "2026-08-08");
  assert.equal(pair(p, "Quick decision", "Not for"), "A budget breakfast — mains run 100-250K.");
  assert.equal(pair(p, "Practical", "Where"), "Tibubeneng / Canggu / Berawa");
  assert.equal(p.place.ld.streetAddress, null);
  assert.deepEqual(p.place.actions.map((a) => a.label), ["Open in Google Maps"]);
});

test("actions, hours, phone and menu: Billy Ho", async () => {
  const p = await load("place-actions-menu-billy-ho");
  assert.deepEqual(p.place.actions.map((a) => a.label), ["Reserve", "WhatsApp", "Website", "Open in Google Maps"]);
  assert.equal(pair(p, "Practical", "Hours"), "Mo 11:00-23:00, Tu 11:00-23:00, We 11:00-23:00, Th 11:00-23:00, Fr 11:00-23:00, Sa 11:00-23:00, Su 11:00-23:00");
  assert.equal(pair(p, "Practical", "Phone"), "+62 877-3552-2232");
  assert.equal(p.place.ld.telephone, "+62 877-3552-2232");
  assert.equal(p.place.ld.openingHours, "Mo 11:00-23:00, Tu 11:00-23:00, We 11:00-23:00, Th 11:00-23:00, Fr 11:00-23:00, Sa 11:00-23:00, Su 11:00-23:00");
  assert.equal(p.place.menus.length, 1);
  assert.equal(p.place.menus[0].currentUntil, "Nov 23, 2026");
  // The regex reader counted 201 = 3 × 67: its pattern also matched structured-menu-item-* child classes.
  assert.equal(p.place.menus[0].items, 67);
});

test("menu expiry and geo: AVLI", async () => {
  const p = await load("place-menu-avli");
  assert.equal(p.place.lastChecked, "2026-08-30");
  assert.equal(p.place.ld.priceRange, "$$$");
  assert.deepEqual(p.place.ld.geo, { lat: -8.8165625, lng: 115.0958125 });
  assert.equal(p.place.ld.streetAddress, null);
  assert.equal(p.place.menus[0].currentUntil, "Sep 30, 2026");
  // 13 items also matches data/data-ops/avli-uluwatu/production-publication-record-20260830.md (2 sections / 13 items);
  // the regex reader's 39 = 3 × 13 was a prefix-match error on structured-menu-item-* classes.
  assert.equal(p.place.menus[0].items, 13);
  assert.equal(p.place.menus[0].sections, 2);
});

test("published card without Best for: SiSi GeGe", async () => {
  const p = await load("place-no-bestfor-sisi-gege");
  assert.equal(p.place.kicker, "Restaurant · Unknown · bangli");
  assert.equal(pair(p, "Quick decision", "Best for"), null);
  assert.equal(pair(p, "Quick decision", "Not for"), null);
  assert.deepEqual(p.place.actions.map((a) => a.label), ["Reserve", "Open in Google Maps"]);
  assert.equal(p.place.lastChecked, "2026-07-28");
});

test("404 page", async () => {
  const p = await load("not-found-gildak-renon");
  assert.equal(index["not-found-gildak-renon"].status, 404);
  assert.equal(p.title, "Page not found · Other Bali");
  assert.match(p.robotsMeta, /noindex/);
  assert.equal(p.place, undefined);
});

test("best-* page is a whole-category catalogue on prod", async () => {
  const p = await load("best-restaurants");
  assert.deepEqual(p.h1, ["The best restaurants in Bali"]);
  assert.deepEqual(p.itemLists.map((l) => l.items), [718]);
  assert.equal(rendered(p), 718);
  assert.equal(p.faqSummaries, 4);
});

test("district hub, /bali district, guide, catalogue", async () => {
  const hub = await load("hub-uluwatu");
  assert.deepEqual(hub.h1, ["Is Uluwatu the right Bali base for you?"]);
  assert.equal(new Set(hub.links.filter((l) => !l.external && !l.chrome && l.path?.startsWith("/places/")).map((l) => l.path)).size, 3);
  const bali = await load("bali-district-kuta-legian");
  assert.deepEqual(bali.itemLists.map((l) => l.items), [132]);
  assert.equal(rendered(bali), 132);
  const guide = await load("guide-canggu-best-brunch");
  assert.equal(guide.faqSummaries, 8);
  assert.equal(rendered(guide), 43);
  const cat = await load("catalogue-places");
  assert.deepEqual(cat.itemLists.map((l) => l.items), [104]);
  assert.equal(rendered(cat), 104);
});

test("offer page emits InStock", async () => {
  const p = await load("offer-holiday-inn-fun-day-pass");
  assert.ok(p.forbiddenLd.some((f) => /InStock/.test(f.value ?? "")));
  assert.equal(p.lastCheckedText, "2026-07-19");
});
