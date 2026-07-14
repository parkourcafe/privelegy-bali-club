import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("./smoke-routes.mjs", import.meta.url), "utf8");

test("preview smoke fails closed and covers launch-critical assertions", () => {
  assert.match(source, /BASE_URL is required/);
  assert.match(source, /response\.status >= 500/);
  assert.match(source, /missing H1/);
  assert.match(source, /missing canonical link/);
  assert.match(source, /canonical host is not www\.otherbali\.com/);
  assert.match(source, /"\/privacy"/);
  assert.match(source, /"\/support"/);
  assert.match(source, /"\/api\/health\/ready"/);
  assert.match(source, /"\/api\/mobile\/v1\/bootstrap"/);
  assert.match(source, /slice\(0, 40\)/);
  assert.match(source, /VERCEL_AUTOMATION_BYPASS_SECRET/);
  assert.match(source, /protectionBypassForTarget/);
  assert.match(source, /fetchWithSameOriginRedirects/);
  assert.match(source, /expected application\/json/);
  assert.match(source, /invalid versioned mobile envelope/);
  assert.match(source, /If-None-Match expected 304/);
  assert.match(source, /\/plan\?m=morning/);
  assert.equal(source.includes('^\\/places\\/[^/?#]+'), true);
  assert.equal(source.includes('^\\/route\\/[^/?#]+'), true);
  assert.match(source, /discovery: no \$\{label\} link found/);
  assert.match(source, /expected real 404/);
  assert.match(source, /other-bali-smoke-missing-venue/);
  assert.match(source, /other-bali-smoke-missing-route/);
});
