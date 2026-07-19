import assert from "node:assert/strict";
import test from "node:test";
import { staticLastModified, validLastModified } from "./sitemap-last-modified";

test("static sitemap dates exist only for reviewed priority pages", () => {
  assert.equal(staticLastModified("/canggu/work-friendly-cafes"), "2026-07-15");
  assert.equal(staticLastModified("/unreviewed-route"), undefined);
});

test("venue lastmod accepts only real ISO calendar dates", () => {
  assert.equal(validLastModified("2026-07-14"), "2026-07-14");
  assert.equal(validLastModified("2026-02-30"), undefined);
  assert.equal(validLastModified("today"), undefined);
  assert.equal(validLastModified(undefined), undefined);
});
