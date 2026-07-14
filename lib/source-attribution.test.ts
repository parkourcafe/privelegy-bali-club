import assert from "node:assert/strict";
import test from "node:test";
import { isSourceId } from "./source-attribution";

test("source IDs are bounded, normalized attribution labels", () => {
  assert.equal(isSourceId("villa_01"), true);
  assert.equal(isSourceId("creator-reels_12"), true);
  assert.equal(isSourceId(""), false);
  assert.equal(isSourceId("Villa 01"), false);
  assert.equal(isSourceId("a".repeat(65)), false);
  assert.equal(isSourceId("venue/../../other"), false);
});
