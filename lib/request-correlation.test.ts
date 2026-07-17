import assert from "node:assert/strict";
import test from "node:test";
import {
  REQUEST_ID_HEADER,
  createRequestCorrelationId,
  isRequestCorrelationId,
  requestHeadersWithCorrelationId,
  responseWithCorrelationId,
} from "./request-correlation";

const FIRST_ID = "018f6007-25d3-477e-8bc3-352ce50454d9";
const SECOND_ID = "118f6007-25d3-477e-9bc3-352ce50454d9";

test("request correlation always replaces an untrusted incoming value", () => {
  assert.equal(
    createRequestCorrelationId("attacker-controlled", () => FIRST_ID.toUpperCase()),
    FIRST_ID,
  );
  assert.equal(
    createRequestCorrelationId(FIRST_ID, () => SECOND_ID),
    SECOND_ID,
  );
});

test("request correlation fails closed if the UUID generator is malformed", () => {
  assert.throws(
    () => createRequestCorrelationId(FIRST_ID, () => "not-a-uuid"),
    /request_id_generation_failed/,
  );
  assert.equal(isRequestCorrelationId(FIRST_ID), true);
  assert.equal(isRequestCorrelationId("018f6007-25d3-177e-8bc3-352ce50454d9"), false);
});

test("request and response headers receive the same generated correlation ID", () => {
  const incoming = new Headers({ [REQUEST_ID_HEADER]: "spoofed" });
  const upstream = requestHeadersWithCorrelationId(incoming, FIRST_ID);
  assert.equal(incoming.get(REQUEST_ID_HEADER), "spoofed", "input headers stay untouched");
  assert.equal(upstream.get(REQUEST_ID_HEADER), FIRST_ID);

  const response = responseWithCorrelationId(new Response(null), FIRST_ID);
  assert.equal(response.headers.get(REQUEST_ID_HEADER), FIRST_ID);
});
