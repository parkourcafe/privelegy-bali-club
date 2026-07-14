import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const config = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
const proxy = readFileSync(new URL("../proxy.ts", import.meta.url), "utf8");

test("Next security baseline disables fingerprinting and emits required headers", () => {
  assert.match(config, /poweredByHeader:\s*false/);
  for (const header of [
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy",
    "Content-Security-Policy",
    "Strict-Transport-Security",
  ]) assert.match(config, new RegExp(header));
  assert.match(config, /frame-ancestors 'none'/);
  assert.match(config, /VERCEL_ENV === "production"/);
});

test("shared Basic Auth cannot expose the admin UI in public production", () => {
  assert.match(proxy, /isAdminPath\(req\.nextUrl\.pathname\)/);
  assert.match(proxy, /VERCEL_ENV === "production"/);
  assert.match(proxy, /responseWithCorrelationId\(adminNotFound\(\), requestId\)/);
});
