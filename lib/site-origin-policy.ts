const PRODUCTION_ORIGINS = new Set([
  "https://otherbali.com",
  "https://www.otherbali.com",
]);

export const CANONICAL_SITE_ORIGIN = "https://www.otherbali.com";

function normalizedHostname(value: string | null | undefined): string {
  const host = (value ?? "").split(",", 1)[0].trim().toLowerCase();
  if (!host || /[\s/@\\]/.test(host)) return "";
  try {
    return new URL(`https://${host}`).hostname;
  } catch {
    return "";
  }
}

export function isCanonicalProductionHost(value: string | null | undefined): boolean {
  const hostname = normalizedHostname(value);
  return hostname === "www.otherbali.com" || hostname === "otherbali.com";
}

export function isVercelDeploymentHost(value: string | null | undefined): boolean {
  const hostname = normalizedHostname(value);
  return Boolean(hostname && hostname.endsWith(".vercel.app"));
}

export function isReviewHost(value: string | null | undefined): boolean {
  return normalizedHostname(value) === "review.otherbali.com";
}

export function shouldNoindexHost(input: {
  host?: string | null;
  vercelEnv?: string;
}): boolean {
  if (!input.vercelEnv) return false;
  if (input.vercelEnv !== "production") return true;
  return !isCanonicalProductionHost(input.host);
}

function httpsOrigin(value: string | null | undefined): string | null {
  const candidate = value?.trim();
  if (!candidate) return null;
  try {
    const parsed = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
    if (parsed.protocol !== "https:" || parsed.username || parsed.password) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function requestOrigin(input: {
  forwardedHost?: string | null;
  host?: string | null;
  forwardedProto?: string | null;
}): string | null {
  const host = (input.forwardedHost ?? input.host ?? "").split(",", 1)[0].trim();
  if (!host || /[\s/@\\]/.test(host)) return null;
  const proto = (input.forwardedProto ?? "").split(",", 1)[0].trim().toLowerCase();
  const scheme = proto || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  if (scheme !== "http" && scheme !== "https") return null;
  try {
    const parsed = new URL(`${scheme}://${host}`);
    if (parsed.username || parsed.password || parsed.pathname !== "/") return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

export function resolveSiteOrigin(input: {
  vercelEnv?: string;
  configuredSiteUrl?: string;
  vercelUrl?: string;
  forwardedHost?: string | null;
  host?: string | null;
  forwardedProto?: string | null;
}): string | null {
  if (input.vercelEnv === "production") {
    return CANONICAL_SITE_ORIGIN;
  }

  const current = requestOrigin(input);
  if (input.vercelEnv === "preview") {
    const trustedPreview = httpsOrigin(input.vercelUrl);
    if (!trustedPreview || PRODUCTION_ORIGINS.has(trustedPreview)) return null;
    if (!trustedPreview.endsWith(".vercel.app")) return null;
    if (current && current !== trustedPreview) return null;
    return trustedPreview;
  }

  return current;
}
