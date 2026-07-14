import assert from "node:assert/strict";
import test from "node:test";
import { parseDishFeedback } from "./dish-feedback";

test("dish feedback accepts one bounded explicit user-content shape", () => {
  assert.deepEqual(parseDishFeedback({
    venueSlug: " Sample-Cafe ",
    dish: "  nasi   goreng ",
    verdict: "worth_it",
  }), {
    venueSlug: "sample-cafe",
    dish: "nasi goreng",
    verdict: "worth_it",
  });
});

test("dish feedback rejects extra identity, malformed slugs, and oversized text", () => {
  assert.equal(parseDishFeedback({ venueSlug: "sample", verdict: "meh", guestRef: "g_attacker" }), null);
  assert.equal(parseDishFeedback({ venueSlug: "../admin", verdict: "meh" }), null);
  assert.equal(parseDishFeedback({ venueSlug: "sample", verdict: "meh", dish: "x".repeat(121) }), null);
  assert.equal(parseDishFeedback({ venueSlug: "sample", verdict: "great" }), null);
});
