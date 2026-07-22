import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/ubud/page.tsx", import.meta.url), "utf8");

test("Ubud pillar owns base fit and routes narrower decisions", () => {
  assert.match(page, /Is Ubud the right Bali base for you\?/);
  for (const href of [
    "/places/bali-buda-ubud",
    "/places/anomali-coffee-ubud",
    "/places/maya-ubud-yoga-ubud",
    "/places/suka-espresso-ubud",
  ]) assert.match(page, new RegExp(href));
});

test("Ubud pillar place CTAs do not point to generic district guides", () => {
  assert.doesNotMatch(page, /href="\/ubud\/(things-to-do|itinerary|best-restaurants|best-cafes-coffee|best-yoga-wellness)"/);
  assert.doesNotMatch(page, /href="\/places\?district=ubud"/);
});

test("Ubud pillar uses supported SEO contracts", () => {
  assert.match(page, /alternates: \{ canonical: canonicalUrl \}/);
  assert.match(page, /"Article"/);
  assert.match(page, /"TravelGuide"/);
  assert.match(page, /dateModified: reviewDate/);
});

test("Ubud pillar excludes unverified legacy claims", () => {
  assert.doesNotMatch(page, /genuinely walkable|10-minute walk|sweet spot|roughly an hour|~30 min|nightly traditional|best at opening/);
  assert.doesNotMatch(page, /UBUD_ZONES|UBUD_THINGS_TO_DO|getUbudVenues|StartYourShortlist/);
});
