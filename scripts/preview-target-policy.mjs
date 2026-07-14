import { isIP } from "node:net";

const HOST_TOKEN = /^\.?[a-z0-9*](?:[a-z0-9.*-]{0,251}[a-z0-9*])?$/;
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308]);

export function parseAllowedPreviewHosts(value = "") {
  return [...new Set(String(value)
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => {
      const stars = entry.match(/\*/g)?.length ?? 0;
      if (!HOST_TOKEN.test(entry) || entry.includes("..") || stars > 1) return false;
      if (stars === 0) return true;
      const starAt = entry.indexOf("*");
      // A wildcard must retain a concrete project prefix; `*.vercel.app`
      // would merely recreate the cross-project secret boundary we reject.
      return starAt >= 3 && entry.slice(starAt + 1).includes(".");
    }))]
    .sort();
}

export function hostMatchesPreviewAllowlist(hostname, allowedHosts) {
  const host = String(hostname).trim().toLowerCase().replace(/\.$/, "");
  return allowedHosts.some((allowed) => {
    if (allowed.includes("*")) {
      const [prefix, suffix] = allowed.split("*");
      return host.length >= prefix.length + suffix.length
        && host.startsWith(prefix)
        && host.endsWith(suffix);
    }
    return allowed.startsWith(".")
      ? host.length > allowed.length && host.endsWith(allowed)
      : host === allowed;
  });
}

export function isVercelPreviewHost(hostname) {
  const host = String(hostname).trim().toLowerCase().replace(/\.$/, "");
  return host.length > ".vercel.app".length && host.endsWith(".vercel.app");
}

export function parseTrustedPreviewUrl(rawUrl, allowedHosts = []) {
  let preview;
  try {
    preview = new URL(rawUrl);
  } catch {
    throw new Error("PREVIEW_URL must be an absolute URL");
  }
  if (
    preview.protocol !== "https:"
    || preview.username
    || preview.password
    || isIP(preview.hostname)
  ) {
    throw new Error("PREVIEW_URL must be a credential-free HTTPS hostname");
  }
  if (
    !isVercelPreviewHost(preview.hostname)
    && !hostMatchesPreviewAllowlist(preview.hostname, allowedHosts)
  ) {
    throw new Error(
      `Preview host ${preview.hostname.toLowerCase()} is not allowed; use a *.vercel.app URL or configure PREVIEW_ALLOWED_HOSTS`,
    );
  }
  return preview;
}

export function protectionBypassForTarget({
  secret,
  hostname,
  allowedHosts = [],
}) {
  if (!secret) return null;
  // Event provenance is not a project boundary. A deployment_status payload
  // can name another Vercel project, so every secret-bearing target must match
  // the repository's project-specific exact/suffix/wildcard allowlist.
  return hostMatchesPreviewAllowlist(hostname, allowedHosts) ? secret : null;
}

export async function fetchWithSameOriginRedirects(
  input,
  init = {},
  { fetchImpl = fetch, maxRedirects = 5 } = {},
) {
  const initial = new URL(input);
  let current = initial;
  for (let redirectCount = 0; redirectCount <= maxRedirects; redirectCount += 1) {
    const response = await fetchImpl(current, { ...init, redirect: "manual" });
    if (!REDIRECT_STATUSES.has(response.status)) return response;
    const location = response.headers.get("location");
    if (!location) return response;
    const next = new URL(location, current);
    await response.body?.cancel();
    if (next.origin !== initial.origin || next.username || next.password) {
      throw new Error(`cross-origin preview redirect blocked: ${next.origin}`);
    }
    if (redirectCount === maxRedirects) {
      throw new Error(`preview redirect limit exceeded (${maxRedirects})`);
    }
    current = next;
  }
  throw new Error("preview redirect loop");
}
