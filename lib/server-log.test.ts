import assert from "node:assert/strict";
import test from "node:test";
import {
  createRequestCorrelationId,
  requestHeadersWithCorrelationId,
  REQUEST_ID_HEADER,
} from "./request-correlation";
import {
  logRequestFailure,
  logServerFailure,
  serverFailureRecord,
  type ServerFailureInput,
} from "./server-log";

const GENERATED_ID = "018f6007-25d3-477e-8bc3-352ce50454d9";
const SPOOFED_ID = "118f6007-25d3-477e-9bc3-352ce50454d9";
const RELEASE = "98c7c74aeade2a026a00ad8eeb64d255301ca082";

test("structured failures contain only bounded event, generated request ID, and release", () => {
  const record = serverFailureRecord({
    event: "mobile_api_load_failed",
    requestId: GENERATED_ID,
    release: RELEASE,
    error: new Error("database password secret"),
  } as ServerFailureInput & { error: Error });
  assert.deepEqual(record, {
    event: "mobile_api_load_failed",
    requestId: GENERATED_ID,
    release: "98c7c74aeade",
  });
  assert.equal(JSON.stringify(record).includes("database password secret"), false);
  assert.equal(JSON.stringify(record).includes("stack"), false);
});

test("request logging uses the proxy-generated ID instead of a spoofed header", () => {
  const requestId = createRequestCorrelationId(SPOOFED_ID, () => GENERATED_ID);
  const headers = requestHeadersWithCorrelationId(
    new Headers({ [REQUEST_ID_HEADER]: SPOOFED_ID }),
    requestId,
  );
  const lines: string[] = [];
  logRequestFailure(
    new Request("https://www.otherbali.com/api/mobile/v1/bootstrap", { headers }),
    "mobile_api_load_failed",
    (line) => lines.push(line),
  );
  assert.equal(lines.length, 1);
  assert.equal(JSON.parse(lines[0]).requestId, GENERATED_ID);
  assert.equal(lines[0].includes(SPOOFED_ID), false);
});

test("invalid log fields fail closed and raw error-shaped extras are discarded", () => {
  const lines: string[] = [];
  logServerFailure({
    event: "bad event with spaces",
    requestId: "attacker-controlled",
    release: "secret-branch-name",
    message: "private database detail",
    stack: "private stack",
  } as ServerFailureInput & { message: string; stack: string }, (line) => lines.push(line));
  assert.deepEqual(JSON.parse(lines[0]), {
    event: "server_failure",
    requestId: "unavailable",
    release: "local",
  });
});
