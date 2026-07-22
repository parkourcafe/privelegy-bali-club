import assert from "node:assert/strict";
import test from "node:test";
import robots from "./robots";

test("production robots leaves noindex redemption URLs crawlable", () => {
  const previous = process.env.VERCEL_ENV;
  process.env.VERCEL_ENV = "production";
  try {
    const value = robots();
    const rules = Array.isArray(value.rules) ? value.rules : [value.rules];
    const disallowed = rules.flatMap((rule) => {
      if (!rule || typeof rule !== "object" || !("disallow" in rule)) return [];
      return Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
    });
    assert.equal(disallowed.includes("/v/"), false);
    assert.equal(disallowed.includes("/admin/"), true);
  } finally {
    if (previous === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previous;
  }
});
