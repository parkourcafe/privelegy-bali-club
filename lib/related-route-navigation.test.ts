import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const venuePage = readFileSync(
  new URL("../app/places/[slug]/page.tsx", import.meta.url),
  "utf8",
);

test("venue detail links only through the exact related-route data helper", () => {
  assert.match(venuePage, /getRelatedRoutesForVenue\(slug\)/);
  assert.match(venuePage, /relatedRoutes\.map/);
  assert.match(venuePage, /href=\{`\/route\/\$\{route\.slug\}`\}/);
  assert.match(venuePage, /Stop \{route\.venuePosition\} of \{route\.stopCount\}/);
});
