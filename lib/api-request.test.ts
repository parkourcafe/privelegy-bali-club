import assert from "node:assert/strict";
import test from "node:test";
import { readBoundedJson } from "./api/request";

function jsonRequest(body: BodyInit | null, headers: HeadersInit = {}): Request {
  return new Request("https://www.otherbali.com/api/test", {
    method: "POST",
    body,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });
}

test("reads a JSON body within the byte limit", async () => {
  assert.deepEqual(await readBoundedJson(jsonRequest('{"ok":true}'), 32), {
    ok: true,
    value: { ok: true },
  });
});

test("rejects a declared oversized body before parsing", async () => {
  assert.deepEqual(
    await readBoundedJson(jsonRequest("{}", { "content-length": "999" }), 32),
    { ok: false, error: "payload_too_large" },
  );
});

test("rejects a chunked body after the actual byte limit", async () => {
  const request = jsonRequest(JSON.stringify({ value: "x".repeat(128) }));
  assert.deepEqual(await readBoundedJson(request, 32), {
    ok: false,
    error: "payload_too_large",
  });
});

test("rejects malformed JSON, invalid UTF-8, and non-JSON content types", async () => {
  assert.deepEqual(await readBoundedJson(jsonRequest("{"), 32), {
    ok: false,
    error: "invalid_json",
  });
  assert.deepEqual(
    await readBoundedJson(
      jsonRequest(new Uint8Array([0xc3, 0x28])),
      32,
    ),
    { ok: false, error: "invalid_json" },
  );
  assert.deepEqual(
    await readBoundedJson(
      new Request("https://www.otherbali.com/api/test", {
        method: "POST",
        body: "{}",
        headers: { "content-type": "text/plain" },
      }),
      32,
    ),
    { ok: false, error: "invalid_content_type" },
  );
});
