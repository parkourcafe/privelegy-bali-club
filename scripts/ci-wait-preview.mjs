#!/usr/bin/env node

import {
  fetchWithSameOriginRedirects,
  parseAllowedPreviewHosts,
  parseTrustedPreviewUrl,
  protectionBypassForTarget,
} from "./preview-target-policy.mjs";

const rawUrl = process.env.PREVIEW_URL;
if (!rawUrl) {
  console.error("PREVIEW_URL is required");
  process.exit(2);
}

const configuredHosts = parseAllowedPreviewHosts(process.env.PREVIEW_ALLOWED_HOSTS);
let preview;
try {
  preview = parseTrustedPreviewUrl(rawUrl, configuredHosts);
} catch (error) {
  console.error(error instanceof Error ? error.message : "PREVIEW_URL is invalid");
  process.exit(2);
}
const hostname = preview.hostname.toLowerCase();

const timeoutMs = Number(process.env.PREVIEW_WAIT_TIMEOUT_MS ?? 600_000);
const intervalMs = Number(process.env.PREVIEW_WAIT_INTERVAL_MS ?? 10_000);
if (!Number.isFinite(timeoutMs) || timeoutMs < 1 || !Number.isFinite(intervalMs) || intervalMs < 1) {
  console.error("Preview wait durations must be positive numbers");
  process.exit(2);
}

const healthUrl = new URL("/api/health/live", preview);
const configuredBypass = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
const bypass = protectionBypassForTarget({
  secret: configuredBypass,
  hostname,
  allowedHosts: configuredHosts,
});
if (configuredBypass && !bypass) {
  console.warn("Protection bypass withheld: target must match project-specific PREVIEW_ALLOWED_HOSTS");
}
const headers = {
  accept: "application/json",
  "user-agent": "OtherBaliPreviewReadiness/1.0",
  ...(bypass ? { "x-vercel-protection-bypass": bypass } : {}),
};
const startedAt = Date.now();
let attempt = 0;
let lastFailure = "not requested";

while (Date.now() - startedAt < timeoutMs) {
  attempt += 1;
  try {
    const response = await fetchWithSameOriginRedirects(healthUrl, {
      headers,
      signal: AbortSignal.timeout(Math.min(15_000, timeoutMs)),
    });
    const contentType = response.headers.get("content-type") ?? "";
    let payload = null;
    if (contentType.includes("application/json")) {
      payload = await response.json().catch(() => null);
    } else {
      await response.body?.cancel();
    }

    if (response.ok && payload?.ok === true && payload?.status === "live") {
      console.log(JSON.stringify({
        ok: true,
        host: hostname,
        path: healthUrl.pathname,
        status: response.status,
        attempts: attempt,
        elapsedMs: Date.now() - startedAt,
        release: typeof payload.release === "string" ? payload.release : null,
      }));
      process.exit(0);
    }

    lastFailure = `HTTP ${response.status}${contentType ? ` (${contentType})` : ""}`;
    if ((response.status === 401 || response.status === 403) && !bypass) {
      console.error(
        "Preview is protected; configure a project-specific PREVIEW_ALLOWED_HOSTS pattern before using the bypass secret",
      );
      process.exit(2);
    }
  } catch (error) {
    lastFailure = error instanceof Error ? error.message : String(error);
  }

  console.log(`Preview not ready (attempt ${attempt}): ${lastFailure}`);
  await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

console.error(`Preview did not become ready within ${timeoutMs}ms: ${lastFailure}`);
process.exit(1);
