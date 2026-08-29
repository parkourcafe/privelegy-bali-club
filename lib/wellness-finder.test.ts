import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  distanceKm,
  formatDistance,
  wellnessArea,
  wellnessKinds,
  wellnessPrice,
} from "./wellness-finder";

test("groups Ubud micro-areas without inventing a new district", () => {
  assert.equal(wellnessArea("Central Ubud (Jl. Goutama Selatan)"), "central");
  assert.equal(wellnessArea("Nyuh Kuning / Pengosekan, Ubud"), "south-east");
  assert.equal(wellnessArea("Penestanan Kelod, Ubud"), "west");
  assert.equal(wellnessArea("Kedewatan / Ayung River valley"), "river");
  assert.equal(wellnessArea("Bentuyung, north of Ubud"), "north");
});

test("derives finder kinds only from visible venue facts", () => {
  assert.deepEqual(
    wellnessKinds({
      category: "yoga",
      name: "Example Shala",
      editorialLine: "Daily yoga, meditation and sound-healing ceremonies.",
      bestFor: "A multi-day teacher training retreat.",
    }).sort(),
    ["retreat", "sound", "yoga"],
  );
  assert.deepEqual(
    wellnessKinds({
      category: "spa",
      name: "Example Spa",
      editorialLine: "Ayurvedic massage with an initial dosha consultation.",
    }).sort(),
    ["ayurveda", "spa"],
  );
});

test("normalizes price bands and leaves unknown prices explicit", () => {
  assert.equal(wellnessPrice("$$ · drop-in class ~165K"), "$$");
  assert.equal(wellnessPrice("$$$$"), "$$$$");
  assert.equal(wellnessPrice("from 250K"), "unlisted");
  assert.equal(wellnessPrice(), "unlisted");
});

test("calculates and formats useful in-memory distances", () => {
  const km = distanceKm(
    { latitude: -8.5069, longitude: 115.2625 },
    { latitude: -8.5193, longitude: 115.2633 },
  );
  assert.ok(km > 1 && km < 2);
  assert.equal(formatDistance(0.42), "420 m away");
  assert.equal(formatDistance(2.34), "2.3 km away");
});

test("scopes same-origin geolocation permission to the wellness finder route", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");

  assert.match(config, /source: "\/ubud\/best-yoga-wellness"/);
  assert.match(config, /geolocation=\(self\)/);
  assert.match(config, /geolocation=\(\)/);
});
