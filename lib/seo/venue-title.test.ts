import assert from "node:assert/strict";
import test from "node:test";
import { buildCompactVenueTitle } from "./venue-title";

test("deduplicates district names case-insensitively", () => {
  assert.equal(
    buildCompactVenueTitle({
      name: "Example",
      category: "villa",
      district: "ubud",
      area: "Ubud",
    }),
    "Example — Villa in Ubud · Other Bali",
  );
});

test("does not repeat a district already named by a micro-area", () => {
  assert.equal(
    buildCompactVenueTitle({
      name: "Big Dragon Villas Ubud",
      category: "villa",
      district: "Ubud",
      area: "Pejeng, near Ubud",
    }),
    "Big Dragon Villas Ubud — Villa in Ubud · Other Bali",
  );
});

test("uses a shorter factual variant before exceeding the SERP target", () => {
  const title = buildCompactVenueTitle({
    name: "A Considerably Longer Restaurant Name",
    category: "restaurant",
    district: "Ubud",
    area: "A Very Long Micro Area Beside the Rice Terraces",
  });

  assert.equal(title.length <= 60, true);
  assert.match(title, /^A Considerably Longer Restaurant Name/);
  assert.match(title, / · Other Bali$/);
  assert.equal(title.match(/Other Bali/g)?.length, 1);
});

test("truncates an unusually long venue name without exceeding the final title budget", () => {
  const title = buildCompactVenueTitle({
    name: "An Exceptionally Long Official Venue Name That Cannot Fit Any Normal Search Result",
    category: "restaurant",
    district: "Seminyak",
  });

  assert.equal(title.length <= 60, true);
  assert.match(title, /… · Other Bali$/);
});
