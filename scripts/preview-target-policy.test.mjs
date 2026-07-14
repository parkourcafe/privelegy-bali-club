import assert from "node:assert/strict";
import test from "node:test";
import {
  fetchWithSameOriginRedirects,
  hostMatchesPreviewAllowlist,
  parseAllowedPreviewHosts,
  parseTrustedPreviewUrl,
  protectionBypassForTarget,
} from "./preview-target-policy.mjs";

test("preview host policy is explicit and rejects credential/IP targets", () => {
  const allowed = parseAllowedPreviewHosts("Preview.Example.com, .team.example.com, https://bad.test, *.vercel.app");
  assert.deepEqual(allowed, [".team.example.com", "preview.example.com"]);
  assert.equal(hostMatchesPreviewAllowlist("branch.team.example.com", allowed), true);
  assert.equal(parseTrustedPreviewUrl("https://project-abc.vercel.app/path", allowed).hostname, "project-abc.vercel.app");
  assert.throws(() => parseTrustedPreviewUrl("https://127.0.0.1", allowed), /credential-free HTTPS hostname/);
  assert.throws(() => parseTrustedPreviewUrl("https://user:secret@preview.example.com", allowed), /credential-free HTTPS hostname/);
  assert.throws(() => parseTrustedPreviewUrl("https://attacker.example", allowed), /not allowed/);
});

test("no event type can send the protection secret outside the project allowlist", () => {
  const secret = "preview-bypass-secret";
  assert.equal(protectionBypassForTarget({
    secret,
    hostname: "attacker.vercel.app",
  }), null);
  assert.equal(protectionBypassForTarget({
    secret,
    hostname: "project.vercel.app",
  }), null);
  assert.equal(protectionBypassForTarget({
    secret,
    hostname: "preview.example.com",
    allowedHosts: ["preview.example.com"],
  }), secret);
  assert.equal(protectionBypassForTarget({
    secret,
    hostname: "otherbali-git-feature-team.vercel.app",
    allowedHosts: parseAllowedPreviewHosts("otherbali-*-team.vercel.app"),
  }), secret);
  assert.equal(protectionBypassForTarget({
    secret,
    hostname: "attacker-git-feature-team.vercel.app",
    allowedHosts: parseAllowedPreviewHosts("otherbali-*-team.vercel.app"),
  }), null);
});

test("secret-bearing fetch follows same-origin redirects and blocks external redirects", async () => {
  const requested = [];
  const sameOriginFetch = async (url, init) => {
    requested.push({ url: String(url), bypass: init.headers["x-vercel-protection-bypass"] });
    return requested.length === 1
      ? new Response(null, { status: 307, headers: { location: "/ready" } })
      : new Response("ok", { status: 200 });
  };
  const response = await fetchWithSameOriginRedirects(
    "https://preview.example.com/start",
    { headers: { "x-vercel-protection-bypass": "secret" } },
    { fetchImpl: sameOriginFetch },
  );
  assert.equal(response.status, 200);
  assert.deepEqual(requested, [
    { url: "https://preview.example.com/start", bypass: "secret" },
    { url: "https://preview.example.com/ready", bypass: "secret" },
  ]);

  let calls = 0;
  await assert.rejects(() => fetchWithSameOriginRedirects(
    "https://preview.example.com/start",
    { headers: { "x-vercel-protection-bypass": "secret" } },
    {
      fetchImpl: async () => {
        calls += 1;
        return new Response(null, { status: 302, headers: { location: "https://attacker.example/capture" } });
      },
    },
  ), /cross-origin preview redirect blocked/);
  assert.equal(calls, 1);
});
