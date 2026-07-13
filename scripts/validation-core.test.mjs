import assert from "node:assert/strict";
import test from "node:test";
import { validateCapability, validateMenu } from "./validation-core.mjs";

const evidence = { sourceUrl: "https://venue.test/source", sourceLabel: "Official", capturedAt: "2026-07-01T00:00:00Z", verifiedAt: "2026-07-02T00:00:00Z" };

test("accepts a sourced draft menu candidate", () => {
  const result = validateMenu({ ...evidence, venueSlug: "venue", title: "Menu", status: "draft", sections: [{ items: [{ name: "Dish", priceMinor: 1000 }] }] }, 0);
  assert.deepEqual(result.errors, []);
});

test("blocks editorial fields and publish status in imports", () => {
  const result = validateMenu({ ...evidence, venueSlug: "venue", title: "Menu", status: "published", sections: [{ items: [{ name: "Dish", editorialPick: true }] }] }, 0);
  assert.ok(result.errors.some((error) => error.includes("draft or review")));
  assert.ok(result.errors.some((error) => error.includes("editorial")));
});

test("blocks fixture provider URLs and confirmed imports", () => {
  const result = validateCapability({ ...evidence, venueSlug: "venue", kind: "delivery", url: "https://example.com/order", status: "confirmed", priority: 1 }, 0);
  assert.ok(result.errors.length >= 2);
});

