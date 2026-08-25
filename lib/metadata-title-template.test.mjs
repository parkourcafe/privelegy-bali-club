import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("public brand titles that already include Other Bali are absolute", () => {
  for (const file of [
    "app/page.tsx",
    "app/for-venues/page.tsx",
    "app/hotels/page.tsx",
    "app/villas/page.tsx",
    "app/list-your-property/page.tsx",
  ]) {
    assert.match(
      source(file),
      /title:\s*\{\s*absolute:\s*"[^"]*Other Bali[^"]*"\s*\}/,
      `${file} must avoid appending the sitewide title template to an already-branded title`,
    );
  }
});

test("private utility page titles do not embed the public brand suffix", () => {
  assert.match(source("app/admin/(protected)/photos/page.tsx"), /title:\s*"Photo review"/);
  assert.doesNotMatch(source("app/admin/(protected)/photos/page.tsx"), /Photo review · Other Bali/);

  assert.match(source("app/admin/(protected)/freshness/page.tsx"), /title:\s*"Freshness queue"/);
  assert.doesNotMatch(source("app/admin/(protected)/freshness/page.tsx"), /Freshness queue · Other Bali/);
});

test("dynamic shared plan metadata keeps its branded title absolute", () => {
  const sharedPlan = source("app/plan/shared/page.tsx");

  assert.match(sharedPlan, /title:\s*\{\s*absolute:\s*title\s*\}/);
  assert.doesNotMatch(sharedPlan, /export const metadata/);
});

test("My Day lets the shared metadata template add the brand once", () => {
  const myDay = source("app/my-day/page.tsx");

  assert.match(myDay, /title:\s*"Today in Bali — find a place for the moment you're in"/);
  assert.doesNotMatch(myDay, /title:\s*"[^"]*\| Other Bali"/);
});
