import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const venueCard = readFileSync(new URL("../components/VenueCard.tsx", import.meta.url), "utf8");
const planner = readFileSync(new URL("../app/PlanView.tsx", import.meta.url), "utf8");
const routePage = readFileSync(new URL("../app/route/[slug]/page.tsx", import.meta.url), "utf8");

test("shared public venue cards link to detail pages by default", () => {
  assert.match(venueCard, /linkToPage = true/);
  assert.match(venueCard, /href={`\/places\/\$\{v\.slug\}`}/);
});

test("shared public cards have human-readable labels for every venue category", () => {
  for (const category of [
    "cafe", "warung", "restaurant", "beach_club", "spa",
    "fitness", "yoga", "beauty", "bar", "surf",
  ]) {
    assert.match(venueCard, new RegExp(`\\b${category}:`));
  }
});

test("planner and route surfaces cannot opt out of detail navigation", () => {
  assert.doesNotMatch(planner, /linkToPage=\{false\}/);
  assert.doesNotMatch(routePage, /linkToPage=\{false\}/);
  assert.match(planner, /<VenueCard v=\{v\}/);
  assert.match(routePage, /<VenueCard v=\{v\}/);
});
