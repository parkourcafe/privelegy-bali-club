import assert from "node:assert/strict";
import test from "node:test";

import { interpretGuideLeadRpcResult } from "./guide-lead-rpc";

test("guide lead RPC results expose only stored, rate-limited, or rejected states", () => {
  assert.deepEqual(interpretGuideLeadRpcResult({ ok: true, duplicate: false }), {
    status: "stored",
    duplicate: false,
  });
  assert.deepEqual(interpretGuideLeadRpcResult({ ok: true, duplicate: true }), {
    status: "stored",
    duplicate: true,
  });
  assert.deepEqual(
    interpretGuideLeadRpcResult({
      ok: false,
      error: "rate_limited",
      retry_after_seconds: 61.1,
    }),
    { status: "rate_limited", retryAfterSeconds: 62 },
  );
  assert.deepEqual(
    interpretGuideLeadRpcResult({
      ok: false,
      error: "rate_limited",
      retry_after_seconds: 100_000,
    }),
    { status: "rate_limited", retryAfterSeconds: 900 },
  );
  assert.deepEqual(
    interpretGuideLeadRpcResult({ ok: false, error: "rate_limited" }),
    { status: "rate_limited", retryAfterSeconds: 900 },
  );
  assert.deepEqual(interpretGuideLeadRpcResult({ ok: false, error: "bad_request" }), {
    status: "rejected",
  });
  assert.deepEqual(interpretGuideLeadRpcResult(null), { status: "rejected" });
});
