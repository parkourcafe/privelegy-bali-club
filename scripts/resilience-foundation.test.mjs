import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
}

test("proxy forwards a fresh correlation ID upstream and returns it on every response branch", () => {
  const proxy = read("proxy.ts");
  assert.match(proxy, /createRequestCorrelationId\(req\.headers\.get\(REQUEST_ID_HEADER\)\)/);
  assert.match(proxy, /requestHeadersWithCorrelationId\(req\.headers, requestId\)/);
  assert.match(proxy, /NextResponse\.next\(\{ request: \{ headers: requestHeaders \} \}\)/);
  assert.match(proxy, /responseWithCorrelationId\(adminNotFound\(\), requestId\)/);
  assert.match(proxy, /responseWithCorrelationId\(adminChallenge\(\), requestId\)/);
  assert.match(proxy, /return responseWithCorrelationId\(res, requestId\)/);
  assert.doesNotMatch(proxy, /from ["'](?:node:|@\/lib\/admin-auth)/);
  assert.doesNotMatch(read("lib/proxy-admin-auth.ts"), /from ["']node:/);
});

test("client error boundaries expose only sanitized references and recovery actions", () => {
  const publicBoundary = read("components/errors/PublicRouteError.tsx");
  for (const source of [publicBoundary, read("app/global-error.tsx")]) {
    assert.match(source, /^"use client";/);
    assert.match(source, /publicErrorReference/);
    assert.match(source, /error\.digest/);
    assert.match(source, /error\.requestId/);
    assert.match(source, /unstable_retry\(\)/);
    assert.match(source, /href="\/"/);
    assert.doesNotMatch(source, /error\.(?:message|stack|cause)/);
    assert.doesNotMatch(source, /console\./);
  }

  for (const path of [
    "app/error.tsx",
    "app/places/error.tsx",
    "app/route/error.tsx",
    "app/plan/error.tsx",
  ]) {
    const source = read(path);
    assert.match(source, /^"use client";/);
    assert.match(source, /components\/errors\/PublicRouteError/);
  }
  const globalError = read("app/global-error.tsx");
  assert.match(globalError, /<html lang="en">/);
  assert.match(globalError, /<body style=/);
});

test("not-found UI is noindex, accessible, and offers useful exits", () => {
  const source = read("app/not-found.tsx");
  assert.match(source, /robots: \{ index: false, follow: false \}/);
  assert.match(source, /aria-labelledby="not-found-title"/);
  assert.match(source, /aria-label="Page recovery"/);
  assert.match(source, /href="\/"/);
  assert.match(source, /href="\/places"/);
});

test("required public data failures emit a correlated safe record before the boundary", () => {
  const source = read("lib/data.ts");
  assert.match(source, /headers\(\)/);
  assert.match(source, /REQUEST_ID_HEADER/);
  assert.match(source, /logServerFailure\(\{ event: "public_data_unavailable", requestId \}\)/);
  assert.match(source, /failPublicDataRead\(context\)/);
});

test("bounded structured failure logs cover mobile, event, and source storage paths", () => {
  const logger = read("lib/server-log.ts");
  assert.match(logger, /return \{ event, requestId, release \}/);
  assert.doesNotMatch(logger, /error\.(?:message|stack|cause)/);

  for (const path of ["lib/mobile-api/http.ts", "lib/mobile-api/handlers.ts"]) {
    const source = read(path);
    assert.match(source, /logRequestFailure\(/);
    assert.match(source, /mobile_api_(?:contract_rejected|load_failed)/);
  }

  const eventRoute = read("app/api/event/route.ts");
  assert.match(eventRoute, /logRequestFailure\(req, "event_storage_unavailable"\)/);

  const sourceRoute = read("app/api/source/route.ts");
  assert.match(sourceRoute, /logRequestFailure\(req, "source_(?:not_accepted|storage_unavailable)"\)/);
});
