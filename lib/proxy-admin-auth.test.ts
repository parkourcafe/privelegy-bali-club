import assert from "node:assert/strict";
import test from "node:test";
import {
  configuredProxyAdminToken,
  hasProxyAdminBasicAccess,
} from "./proxy-admin-auth";

function basic(password: string, username = "operator"): string {
  return `Basic ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`;
}

test("proxy admin configuration retains the fail-closed token policy", () => {
  const previous = process.env.ADMIN_ACCESS_TOKEN;
  process.env.ADMIN_ACCESS_TOKEN = "example-secret-that-is-definitely-long-enough";
  assert.equal(configuredProxyAdminToken(), null);
  process.env.ADMIN_ACCESS_TOKEN = "u8k0C4qPz2Vm7Ns9Lx5Wa1Rd6Ht3YbEf";
  assert.equal(configuredProxyAdminToken(), "u8k0C4qPz2Vm7Ns9Lx5Wa1Rd6Ht3YbEf");
  if (previous === undefined) delete process.env.ADMIN_ACCESS_TOKEN;
  else process.env.ADMIN_ACCESS_TOKEN = previous;
});

test("Web Crypto proxy Basic Auth accepts only the exact UTF-8 password", async () => {
  const token = "u8k0C4qPz2Vm7Ns9Lx5Wa1Rd6Ht3YbEf";
  assert.equal(await hasProxyAdminBasicAccess(basic(token), token), true);
  assert.equal(await hasProxyAdminBasicAccess(basic(`${token} `), token), false);
  assert.equal(await hasProxyAdminBasicAccess("Bearer nope", token), false);
  assert.equal(await hasProxyAdminBasicAccess("Basic !!!", token), false);
  assert.equal(await hasProxyAdminBasicAccess(basic("päss:word"), "päss:word"), true);
});
