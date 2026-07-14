import assert from "node:assert/strict";
import test from "node:test";
import { isSourceId, parseSourceCaptureRequest } from "./source-attribution";

test("source IDs are bounded, normalized attribution labels", () => {
  assert.equal(isSourceId("villa_01"), true);
  assert.equal(isSourceId("creator-reels_12"), true);
  assert.equal(isSourceId(""), false);
  assert.equal(isSourceId("Villa 01"), false);
  assert.equal(isSourceId("a".repeat(65)), false);
  assert.equal(isSourceId("venue/../../other"), false);
});

test("source capture accepts only one bounded source field", () => {
  assert.equal(parseSourceCaptureRequest({ source: "villa_01" }), "villa_01");
  for (const input of [
    { source: "villa_01", guestRef: "g_clientchosen1234" },
    { source: "villa_01", arbitraryDimension: "pollution" },
    { source: "a".repeat(65) },
    ["villa_01"],
    null,
  ]) {
    assert.equal(parseSourceCaptureRequest(input), null);
  }
});
