import assert from "node:assert/strict";
import test from "node:test";
import {
  isCanonicalProductionHost,
  isVercelDeploymentHost,
  resolveSiteOrigin,
  shouldNoindexHost,
} from "./site-origin-policy";

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

test("production always resolves metadata to the canonical www origin", () => {
  assert.equal(resolveSiteOrigin({
    vercelEnv: "production",
    configuredSiteUrl: "https://www.otherbali.com/path",
  }), "https://www.otherbali.com");
  assert.equal(resolveSiteOrigin({
    vercelEnv: "production",
    configuredSiteUrl: "https://evil.test",
  }), "https://www.otherbali.com");
});

test("host policy consolidates production Vercel aliases and noindexes review", () => {
  assert.equal(isCanonicalProductionHost("www.otherbali.com"), true);
  assert.equal(isCanonicalProductionHost("otherbali.com:443"), true);
  assert.equal(isVercelDeploymentHost("otherbali-site.vercel.app"), true);
  assert.equal(shouldNoindexHost({
    host: "review.otherbali.com",
    vercelEnv: "production",
  }), true);
  assert.equal(shouldNoindexHost({
    host: "www.otherbali.com",
    vercelEnv: "production",
  }), false);
  assert.equal(shouldNoindexHost({
    host: "branch.vercel.app",
    vercelEnv: "preview",
  }), true);
});
