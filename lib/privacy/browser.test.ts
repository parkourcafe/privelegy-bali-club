import assert from "node:assert/strict";
import test from "node:test";
import { cookieDomainCandidates, knownAnalyticsCookieNames } from "./browser";

test("analytics cookie inventory is narrow and deterministic", () => {
  assert.deepEqual(
    knownAnalyticsCookieNames("session=keep; _ga=one; _ga_PROPERTY=two; _gid=three; _gat_tag=four; ob_consent=essential_only"),
    ["_ga", "_ga_PROPERTY", "_gat_tag", "_gid"],
  );
  assert.deepEqual(knownAnalyticsCookieNames("_ga=first; _ga=second"), ["_ga"]);
});

test("cookie cleanup attempts current and parent domains but skips local hosts", () => {
  assert.deepEqual(cookieDomainCandidates("www.otherbali.com"), ["www.otherbali.com", "otherbali.com"]);
  assert.deepEqual(cookieDomainCandidates("otherbali.com"), ["otherbali.com"]);
  assert.deepEqual(cookieDomainCandidates("localhost"), []);
  assert.deepEqual(cookieDomainCandidates("127.0.0.1"), []);
});
