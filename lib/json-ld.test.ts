import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "./json-ld";

test("JSON-LD serialization cannot terminate its script element", () => {
  const value = {
    name: "</script><script>alert(1)</script>",
    text: "a&b>c\u2028next\u2029line",
  };
  const serialized = serializeJsonLd(value);
  assert.doesNotMatch(serialized, /[<>&\u2028\u2029]/u);
  assert.equal(serialized.includes("\\u003c/script\\u003e"), true);
  assert.deepEqual(JSON.parse(serialized), value);
});

test("JSON-LD serialization rejects undefined instead of emitting invalid content", () => {
  assert.throws(() => serializeJsonLd(undefined), /not serializable/);
});
