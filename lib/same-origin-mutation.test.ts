import assert from "node:assert/strict";
import test from "node:test";
import { isTrustedSameOriginMutation } from "./same-origin-mutation";

function request(origin: string | null, fetchSite: string | null = "same-origin") {
  const headers = new Headers();
  if (origin !== null) headers.set("origin", origin);
  if (fetchSite !== null) headers.set("sec-fetch-site", fetchSite);
  return new Request("https://www.otherbali.com/api/privacy/delete", {
    method: "POST",
    headers,
  });
}

test("accepts exact-origin browser mutations", () => {
  assert.equal(isTrustedSameOriginMutation(request("https://www.otherbali.com")), true);
  assert.equal(isTrustedSameOriginMutation(request("https://www.otherbali.com", null)), true);
});

test("rejects missing, sibling and cross-site origins", () => {
  assert.equal(isTrustedSameOriginMutation(request(null)), false);
  assert.equal(isTrustedSameOriginMutation(request("https://otherbali.com")), false);
  assert.equal(isTrustedSameOriginMutation(request("https://evil.otherbali.com", "same-site")), false);
  assert.equal(isTrustedSameOriginMutation(request("https://www.otherbali.com", "cross-site")), false);
});
