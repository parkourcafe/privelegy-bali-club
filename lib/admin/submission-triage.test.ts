import test from "node:test";
import assert from "node:assert/strict";
import { orderSubmissionsForReview, submissionOrigin } from "./submission-triage";

test("namespaced internal batches classify as research, everything else as web", () => {
  assert.equal(submissionOrigin("otherbali-research-2026-07-23"), "research");
  assert.equal(submissionOrigin("otherbali-manus-wide-research-2026-07-24"), "research");
  assert.equal(submissionOrigin("otherbali-any-future-batch"), "research");
  assert.equal(submissionOrigin("web"), "web");
  // A missing source must read as a person, not as an import: misclassifying
  // a live request as research buries it, which is the bug this module fixes.
  assert.equal(submissionOrigin(""), "web");
  assert.equal(submissionOrigin(null), "web");
  assert.equal(submissionOrigin(undefined), "web");
});

test("live requests sort above research imports regardless of age", () => {
  const rows = [
    { id: "r-new", source: "otherbali-research-2026-07-23", createdAt: "2026-07-22T10:00:00Z" },
    { id: "w-old", source: "web", createdAt: "2026-07-16T09:00:00Z" },
    { id: "r-newer", source: "otherbali-manus-wide-research-2026-07-24", createdAt: "2026-07-24T10:00:00Z" },
    { id: "w-new", source: "web", createdAt: "2026-07-24T12:00:00Z" },
  ];

  assert.deepEqual(
    orderSubmissionsForReview(rows).map((r) => r.id),
    ["w-new", "w-old", "r-newer", "r-new"]
  );
});

test("ordering is a copy and leaves the input untouched", () => {
  const rows = [
    { id: "a", source: "otherbali-x", createdAt: "2026-01-02" },
    { id: "b", source: "web", createdAt: "2026-01-01" },
  ];
  const before = rows.map((r) => r.id);

  orderSubmissionsForReview(rows);

  assert.deepEqual(rows.map((r) => r.id), before);
});
