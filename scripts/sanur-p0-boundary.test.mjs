import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pillar = await readFile(new URL("../app/sanur/page.tsx", import.meta.url), "utf8");
const stay = await readFile(new URL("../app/sanur/where-to-stay/page.tsx", import.meta.url), "utf8");

test("Sanur P0 pages preserve distinct intents and reciprocal links", () => {
  assert.match(pillar, /Is Sanur the right Bali base for you\?/);
  assert.match(pillar, /href="\/sanur\/where-to-stay"/);
  assert.match(stay, /Choose the part of Sanur before you choose the hotel/);
  assert.match(stay, /href:\s*"\/sanur"/);
  assert.match(stay, /(?:href=|href:)\s*"\/sanur\/best-hotels"/);
});

test("Sanur P0 pages declare canonical and supported structured data", () => {
  for (const source of [pillar, stay]) {
    assert.match(source, /alternates: \{ canonical: canonicalUrl \}/);
    assert.match(source, /"TravelGuide"/);
    assert.match(source, /"Article"/);
    assert.doesNotMatch(source, /mapsUrl|Place ID|ItemList/);
  }
});

test("Sanur pillar no longer renders unsupported legacy content modules", () => {
  assert.doesNotMatch(pillar, /SANUR_FAQ|SANUR_HOTELS|SANUR_THINGS_TO_DO|5 km|fully walkable/);
});
