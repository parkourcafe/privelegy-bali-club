import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/uluwatu/page.tsx", import.meta.url), "utf8");

test("Uluwatu pillar owns base fit and routes narrower decisions", () => {
  assert.match(page, /Is Uluwatu the right Bali base for you\?/);
  for (const href of ["/uluwatu/best-restaurants", "/uluwatu/best-brunch", "/uluwatu/beach-clubs-sunset", "/uluwatu/date-night-restaurants", "/uluwatu/48-hours"]) assert.match(page, new RegExp(href));
});

test("Uluwatu pillar uses supported SEO contracts and excludes legacy overclaims", () => {
  assert.match(page, /alternates: \{ canonical: canonicalUrl \}/);
  assert.match(page, /"Article"/);
  assert.match(page, /"TravelGuide"/);
  assert.doesNotMatch(page, /world-class|walk everywhere|You will be on a scooter|family fit|24 places|FAQ|VenuePicks/);
});
