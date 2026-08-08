// The partner pages must stay reachable from the site itself.
//
// /hotels and /villas shipped, entered the sitemap, and were linked from
// nowhere: no footer entry, no header, no homepage, no mobile nav. An owner
// could reach them only from a direct message or a search result. That is the
// distribution channel the QR barter depends on, so the orphan state is a
// product defect rather than a cosmetic one, and it is invisible in every
// test that only checks whether a page renders.
//
// This asserts the link exists, not how it looks.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const FOOTER = readFileSync(join(ROOT, "components/SiteFooter.tsx"), "utf8");

const PARTNER_PAGES = ["/hotels", "/villas", "/for-venues"];

test("partner pages exist as routes", () => {
  for (const href of PARTNER_PAGES) {
    assert.ok(
      existsSync(join(ROOT, "app", href.slice(1), "page.tsx")),
      `${href} has no page.tsx`
    );
  }
});

test("every partner page is linked from the footer", () => {
  for (const href of PARTNER_PAGES) {
    assert.match(
      FOOTER,
      new RegExp(`href:\\s*"${href}"`),
      `${href} is not linked from the footer — an owner cannot reach it from the site`
    );
  }
});

test("the QR barter is stated as the return on both partner pages", () => {
  // The reciprocity ask is what makes the barter a barter. It was reported
  // missing during an audit and was in fact present; this keeps it present.
  for (const page of ["app/hotels/page.tsx", "app/villas/page.tsx"]) {
    const source = readFileSync(join(ROOT, page), "utf8");
    assert.match(source, /What we ask in return/, `${page} lost the reciprocity block`);
    assert.match(source, /QR on your welcome/, `${page} lost the QR ask`);
  }
});
