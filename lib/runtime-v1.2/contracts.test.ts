import assert from "node:assert/strict";
import test from "node:test";
import {
  boundedRecord,
  boundedString,
  idempotencyKey,
  isFeedType,
  parseRuntimeBody,
} from "./contracts";

test("runtime contracts accept only canonical bounded feed/input data", () => {
  assert.equal(isFeedType("for_you"), true);
  assert.equal(isFeedType("sponsored"), false);
  assert.deepEqual(boundedRecord({ area: "canggu" }), { area: "canggu" });
  assert.equal(boundedRecord(["canggu"]), null);
  assert.equal(boundedString(" x ", 2), "x");
  assert.equal(boundedString("xxx", 2), null);
});

test("idempotency key is required and bounded", () => {
  assert.equal(idempotencyKey(new Request("https://otherbali.com"), {}), null);
  assert.equal(
    idempotencyKey(new Request("https://otherbali.com", { headers: { "Idempotency-Key": "sync-1" } }), {}),
    "sync-1",
  );
  assert.equal(idempotencyKey(new Request("https://otherbali.com"), { idempotencyKey: "body-1" }), "body-1");
});

test("runtime body rejects arrays, malformed JSON and oversized payloads", async () => {
  const good = new Request("https://otherbali.com", {
    method: "POST",
    body: JSON.stringify({ input: { title: "Bali" } }),
  });
  assert.deepEqual(await parseRuntimeBody(good), { input: { title: "Bali" } });
  const array = new Request("https://otherbali.com", { method: "POST", body: "[]" });
  assert.equal(await parseRuntimeBody(array), null);
  const malformed = new Request("https://otherbali.com", { method: "POST", body: "{" });
  assert.equal(await parseRuntimeBody(malformed), null);
});
