import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const eventRoute = await readFile(new URL("../app/api/event/route.ts", import.meta.url), "utf8");
const sourceRoute = await readFile(new URL("../app/api/source/route.ts", import.meta.url), "utf8");
const sourceCapture = await readFile(new URL("../app/SourceCapture.tsx", import.meta.url), "utf8");

test("event API is byte-bounded and uses only the atomic rate-limited RPC path", () => {
  assert.match(eventRoute, /readBoundedJson\(req, MAX_EVENT_BODY_BYTES\)/);
  assert.match(eventRoute, /storeRateLimitedEvent\(asEventV3RpcClient\(sb\)/);
  assert.match(eventRoute, /"Retry-After"/);
  assert.doesNotMatch(eventRoute, /req\.json\(\)/);
  assert.doesNotMatch(eventRoute, /storeEvent\(/);
});

test("source API is byte-bounded and delegates consent, allowlisting and mutation to one atomic RPC", () => {
  assert.match(sourceRoute, /readBoundedJson\(req, MAX_SOURCE_BODY_BYTES\)/);
  assert.match(sourceRoute, /parseSourceCaptureRequest\(body\.value\)/);
  assert.match(sourceRoute, /storeRateLimitedSourceScan\(asSourceScanRpcClient\(sb\)/);
  assert.doesNotMatch(sourceRoute, /set_guest_source/);
  assert.match(sourceRoute, /"Retry-After"/);
  assert.doesNotMatch(sourceRoute, /req\.json\(\)/);
  assert.doesNotMatch(sourceRoute, /logEvent\(/);
});

test("first-touch source capture completes before the landing event is sent", () => {
  const sourceRequest = sourceCapture.indexOf('await fetch("/api/source"');
  const eventRequest = sourceCapture.indexOf('fetch("/api/event"');
  assert.ok(sourceRequest >= 0);
  assert.ok(eventRequest > sourceRequest);
});
