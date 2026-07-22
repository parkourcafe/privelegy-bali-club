export type ExternalLinkKind =
  | "apple_maps"
  | "google_maps"
  | "official_website"
  | "whatsapp";

export type SafeExternalLink = {
  href: string;
  kind: ExternalLinkKind;
  external: true;
  rel: "external noopener noreferrer";
  target: "_blank";
};

export type ControlledExternalOpenOptions = {
  /** Persist the current in-app surface before handing control to another app. */
  beforeOpen: () => void;
  /** Narrow an official-site handoff to hosts explicitly trusted by the caller. */
  allowedHosts?: readonly string[];
  /** Injectable for deterministic tests; the browser implementation is used by default. */
  openWindow?: (href: string, target: "_blank", features: string) => unknown;
};

const INTERNATIONAL_PHONE = /^[1-9][0-9]{6,14}$/;
const REJECTED_HOST = /(?:^|\.)(?:localhost|local|example|invalid|test)$/i;
const IPV4 = /^\d{1,3}(?:\.\d{1,3}){3}$/;

export function hostMatches(hostname: string, allowedHost: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  const allowed = allowedHost.toLowerCase().replace(/\.$/, "");
  return host === allowed || host.endsWith(`.${allowed}`);
}

export function parseSafeHttpsUrl(value: unknown): URL | null {
  if (typeof value !== "string" || !value.trim() || value.length > 2_048) return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      !url.hostname ||
      (url.port && url.port !== "443")
    ) {
      return null;
    }
    return url;
  } catch {
    return null;
  }
}

function isPublicHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (
    !host.includes(".") ||
    REJECTED_HOST.test(host) ||
    host === "example.com" ||
    host.endsWith(".example.com") ||
    IPV4.test(host) ||
    (host.startsWith("[") && host.endsWith("]"))
  ) {
    return false;
  }
  return true;
}

export function validatePublicEvidenceUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  return url && isPublicHostname(url.hostname) ? url.toString() : null;
}

export function validateOfficialWebsiteUrl(value: unknown): string | null {
  return validatePublicEvidenceUrl(value);
}

export function validateInstagramUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  if (!url || !hostMatches(url.hostname, "instagram.com") || url.pathname === "/") return null;
  return url.toString();
}

/**
 * Normalize the two representations present in the venue registry: a complete
 * Instagram profile URL or an explicit @handle. Bare relative paths are never
 * accepted. Without this boundary, browsers resolve `@handle` against the
 * current venue route and create a public `/places/@handle` 404.
 */
export function normalizeInstagramProfileUrl(value: unknown): string | null {
  const validated = validateInstagramUrl(value);
  if (validated) return validated;
  if (typeof value !== "string") return null;
  const handle = value.trim().replace(/^@/, "");
  if (!/^[A-Za-z0-9._]{1,30}$/.test(handle)) return null;
  return `https://www.instagram.com/${handle}/`;
}

export function validateGoogleMapsUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  const accepted =
    host === "maps.app.goo.gl" ||
    (host === "goo.gl" && url.pathname.startsWith("/maps")) ||
    host === "maps.google.com" ||
    ((host === "google.com" || host === "www.google.com") &&
      url.pathname.startsWith("/maps"));
  return accepted ? url.toString() : null;
}

export type GoogleMapsHandoffKind = "exact" | "search" | "generic";

export function classifyGoogleMapsHandoff(value: unknown): GoogleMapsHandoffKind | null {
  const safe = validateGoogleMapsUrl(value);
  if (!safe) return null;
  const url = new URL(safe);
  const host = url.hostname.toLowerCase();
  if (host === "maps.app.goo.gl" || (host === "goo.gl" && url.pathname.startsWith("/maps"))) {
    // A credential-free short link is safe to open, but without resolving it
    // we cannot prove whether its target is a place listing, search or route.
    return "generic";
  }
  if (
    url.pathname.startsWith("/maps/place/")
    || url.searchParams.has("query_place_id")
    || url.searchParams.has("destination_place_id")
    || url.searchParams.has("place_id")
    || url.searchParams.has("cid")
  ) {
    return "exact";
  }
  return "search";
}

export function googleMapsHandoffLabel(
  value: unknown,
): "Directions" | "Search in Google Maps" | "Open in Google Maps" | null {
  const kind = classifyGoogleMapsHandoff(value);
  return kind === "exact"
    ? "Directions"
    : kind === "search"
      ? "Search in Google Maps"
      : kind === "generic"
        ? "Open in Google Maps"
        : null;
}

export function validateAppleMapsUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  return url && hostMatches(url.hostname, "maps.apple.com") ? url.toString() : null;
}

export function validateWhatsAppPhone(value: unknown): string | null {
  return typeof value === "string" && INTERNATIONAL_PHONE.test(value) ? value : null;
}

export function whatsAppPhoneFromUrl(value: unknown): string | null {
  const url = parseSafeHttpsUrl(value);
  if (!url) return null;
  const host = url.hostname.toLowerCase();
  if (host === "wa.me" || host === "www.wa.me") {
    return validateWhatsAppPhone(url.pathname.replace(/^\//, ""));
  }
  if (host === "api.whatsapp.com" && url.pathname === "/send") {
    return validateWhatsAppPhone(url.searchParams.get("phone"));
  }
  return null;
}

export function resolveSafeExternalLink(
  value: unknown,
  kind: ExternalLinkKind,
): SafeExternalLink | null {
  const href = kind === "google_maps"
    ? validateGoogleMapsUrl(value)
    : kind === "apple_maps"
      ? validateAppleMapsUrl(value)
      : kind === "whatsapp"
        ? (whatsAppPhoneFromUrl(value) ? parseSafeHttpsUrl(value)?.toString() ?? null : null)
        : validateOfficialWebsiteUrl(value);
  if (!href) return null;
  return {
    href,
    kind,
    external: true,
    rel: "external noopener noreferrer",
    target: "_blank",
  };
}

export function controlledExternalOpen(
  value: unknown,
  kind: ExternalLinkKind,
  options: ControlledExternalOpenOptions,
): boolean {
  const link = resolveSafeExternalLink(value, kind);
  if (!link) return false;

  if (options.allowedHosts?.length) {
    const url = new URL(link.href);
    if (!options.allowedHosts.some((host) => hostMatches(url.hostname, host))) return false;
  }

  const openWindow = options.openWindow
    ?? (typeof window === "undefined" ? null : window.open.bind(window));
  if (!openWindow) return false;

  try {
    options.beforeOpen();
    openWindow(link.href, link.target, "noopener,noreferrer");
    return true;
  } catch {
    return false;
  }
}
