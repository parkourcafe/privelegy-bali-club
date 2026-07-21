import test from "node:test";
import assert from "node:assert/strict";
import { quickDecisionRows } from "./quick-decision";

test("QuickDecision renders only supplied claims", () => {
  const rows = quickDecisionRows({ bestFor: "Families", whyGo: "Calm beach access" });
  assert.deepEqual(rows, [
    { label: "Best for", value: "Families" },
    { label: "Why go", value: "Calm beach access" },
  ]);
});

test("QuickDecision does not reconstruct or invent restricted claims", () => {
  const rows = quickDecisionRows({ notFor: "Laptop work", whatToOrder: [] });
  assert.deepEqual(rows, [{ label: "Not for", value: "Laptop work" }]);
  assert.equal(rows.some((row) => /open now|wait|dress|reservation/i.test(row.value)), false);
});

test("What to order is present only when the caller supplies evidence-gated items", () => {
  assert.deepEqual(
    quickDecisionRows({ whatToOrder: ["  grilled fish  ", "", "rice"] }),
    [{ label: "What to order", value: "grilled fish, rice" }],
  );
});
