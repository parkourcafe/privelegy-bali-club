import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("./site-origin-policy.ts", import.meta.url), "utf8");

test("site origin policy has one canonical public origin", () => {
  assert.match(source, /OTHER_BALI_CANONICAL_HOST = "www\.otherbali\.com"/);
  assert.match(source, /CANONICAL_SITE_ORIGIN = `https:\/\/\$\{OTHER_BALI_CANONICAL_HOST\}`/);
});

test("site facts expose the current brand and contact facts for SEO surfaces", () => {
  assert.match(source, /OTHER_BALI_BRAND_NAME = "Other Bali"/);
  assert.match(source, /OTHER_BALI_CONTACT_EMAIL = "hello@otherbali\.com"/);
  assert.match(source, /lastVerifiedAt: "2026-08-25"/);
});
