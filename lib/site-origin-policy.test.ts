import assert from "node:assert/strict";
import test from "node:test";
import { resolveSiteOrigin } from "./site-origin-policy";

test("preview links use the trusted preview host and ignore production configuration", () => {
  assert.equal(resolveSiteOrigin({
    vercelEnv: "preview",
    configuredSiteUrl: "https://otherbali.com",
    vercelUrl: "otherbali-git-audit-team.vercel.app",
    forwardedHost: "otherbali-git-audit-team.vercel.app",
    forwardedProto: "https",
  }), "https://otherbali-git-audit-team.vercel.app");
});

test("preview fails closed when the request or trusted host points at production", () => {
  assert.equal(resolveSiteOrigin({
    vercelEnv: "preview",
    vercelUrl: "otherbali-git-audit-team.vercel.app",
    forwardedHost: "otherbali.com",
    forwardedProto: "https",
  }), null);
  assert.equal(resolveSiteOrigin({
    vercelEnv: "preview",
    vercelUrl: "otherbali.com",
    forwardedHost: "otherbali.com",
  }), null);
});

test("production accepts only the canonical Other Bali origins", () => {
  assert.equal(resolveSiteOrigin({
    vercelEnv: "production",
    configuredSiteUrl: "https://www.otherbali.com/path",
  }), "https://www.otherbali.com");
  assert.equal(resolveSiteOrigin({
    vercelEnv: "production",
    configuredSiteUrl: "https://evil.test",
  }), "https://otherbali.com");
});
