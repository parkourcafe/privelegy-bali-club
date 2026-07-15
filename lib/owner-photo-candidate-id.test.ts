import assert from "node:assert/strict";
import test from "node:test";

import {
  ownerCandidateConsentPath,
  ownerCandidateSubmissionId,
} from "./owner-photo-candidate-id";

test("owner photo candidate submission IDs are stable valid v5 UUIDs", () => {
  const digest = "a".repeat(64);
  const first = ownerCandidateSubmissionId("venue-one", digest);
  assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
  assert.equal(first, ownerCandidateSubmissionId("venue-one", digest));
  assert.notEqual(first, ownerCandidateSubmissionId("venue-two", digest));
  assert.notEqual(first, ownerCandidateSubmissionId("venue-one", "b".repeat(64)));
  assert.equal(
    ownerCandidateConsentPath("venue-one", digest),
    `owner-consents/v1/venue-one/${first}.json`,
  );
});
