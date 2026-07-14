export const CANONICAL_SITE_ORIGIN = "https://www.otherbali.com";

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
    const configured = httpsOrigin(input.configuredSiteUrl);
    return configured === CANONICAL_SITE_ORIGIN
      ? configured
      : CANONICAL_SITE_ORIGIN;
  }

  const current = requestOrigin(input);
  if (input.vercelEnv === "preview") {
    const trustedPreview = httpsOrigin(input.vercelUrl);
    if (!trustedPreview || trustedPreview === CANONICAL_SITE_ORIGIN) return null;
    if (!trustedPreview.endsWith(".vercel.app")) return null;
    if (current && current !== trustedPreview) return null;
    return trustedPreview;
  }

  return current;
}
