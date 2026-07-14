export const CONSENT_COOKIE = "__Host-ob_consent";
export const LEGACY_CONSENT_COOKIE = "ob_consent";
export const CONSENT_EVENT = "otherbali:consent-change";
export const ANALYTICS_CONSENT_VERSION = "2026-07-14";
export const ANALYTICS_CONSENT_EFFECTIVE_DATE = "2026-07-14";

export const CONSENT_STATES = ["essential_only", "analytics_allowed"] as const;
export type StoredConsentState = (typeof CONSENT_STATES)[number];
export type ConsentState = "unknown" | StoredConsentState;

export function parseConsentState(value: unknown): ConsentState {
  return CONSENT_STATES.includes(value as StoredConsentState)
    ? (value as StoredConsentState)
    : "unknown";
}

// The consent endpoint accepts one decision and nothing else. In particular,
// browser identity is always resolved from the httpOnly cookie server-side;
// caller-supplied IDs or metadata are rejected as extra fields.
export function parseConsentRequest(value: unknown): StoredConsentState | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).length !== 1 || !Object.prototype.hasOwnProperty.call(record, "state")) return null;
  const state = parseConsentState(record.state);
  return state === "unknown" ? null : state;
}

export function browserConsentState(cookie = ""): ConsentState {
  const pairs = cookie
    .split(";")
    .map((part) => part.trim().split("=", 2));
  const current = pairs
    .filter(([name]) => name === CONSENT_COOKIE)
    .map(([, value]) => parseConsentState(value ? decodeURIComponent(value) : null));
  if (current.length === 1) return current[0];
  if (current.length > 1) return "essential_only";

  // A sibling-domain legacy cookie is not trustworthy enough to enable
  // analytics. Preserve only the privacy-safe opt-out interpretation.
  const legacyEssential = pairs.some(([name, value]) => (
    name === LEGACY_CONSENT_COOKIE
    && parseConsentState(value ? decodeURIComponent(value) : null) === "essential_only"
  ));
  return legacyEssential ? "essential_only" : "unknown";
}

export function consentCookieOptions() {
  return {
    httpOnly: false,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}
