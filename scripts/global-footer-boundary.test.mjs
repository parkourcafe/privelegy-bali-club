import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

// The footer used to be opt-in per page, and ~38 routes never opted in --
// including every /places/[slug] venue page and the /bali/* hubs, the largest
// indexable families on the site. These assertions keep it structural.

test("the root layout owns the footer for every route", async () => {
  const layout = await read("app/layout.tsx");
  assert.match(layout, /<GlobalFooter \/>/);
  assert.match(layout, /import GlobalFooter from "@\/components\/GlobalFooter"/);
});

test("GuideFooter is a no-op so the pages that call it cannot double-render", async () => {
  const blocks = await read("components/GuideBlocks.tsx");
  assert.match(blocks, /export function GuideFooter\(\) \{\s*return null;\s*\}/);
  // The homepage must not render its own footer either.
  const home = await read("app/page.tsx");
  assert.doesNotMatch(home, /<SiteFooter/);
});

test("operational surfaces render no marketing footer", async () => {
  const footer = await read("components/GlobalFooter.tsx");
  for (const prefix of ["/admin", "/partner", "/onboard", "/v/", "/auth", "/dev/", "/review"]) {
    assert.ok(
      footer.includes(`"${prefix}"`),
      `${prefix} must stay in the no-footer list`
    );
  }
  // The homepage keeps its dark tone; everything else is the light footer.
  assert.match(footer, /pathname === "\/" \? "dark" : "light"/);
});

test("venue breadcrumbs climb to a district page, never dead-end at the catalogue", async () => {
  const venuePage = await read("app/places/[slug]/page.tsx");
  assert.match(venuePage, /districtHubPath/);
  assert.match(venuePage, /`\/bali\/\$\{venue\.district\}`/);
  // Canggu has a hand-crafted pillar, so it must be excluded from the
  // programmatic-hub fallback (its hub route does not exist).
  const districts = await read("lib/districts.ts");
  assert.match(districts, /canggu: "\/canggu"/);
});
