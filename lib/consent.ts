// Analytics consent (audit 2026-07, privacy P0). OPT-IN: behavioral analytics
// (the /api/event funnel store + GA, which is separately off) fire only after
// the traveller explicitly accepts. Stored in a readable (non-httpOnly)
// first-party cookie — it records a *choice*, not identity, so it is allowed
// before consent (it IS the consent record) and it is a cookie, not
// localStorage (guardrail #10).
//
// What stays OUTSIDE this gate, as strictly-necessary/functional:
//   - /api/source  — the traveller arrived via a specific partner link/QR (?s=);
//     binding that source is what venue attribution needs, and it is a direct
//     response to a deliberate action, not blanket behavioural profiling.
//   - /api/redeem  — an explicit user action that already has its own on-screen
//     consent step (RedeemFlow).
// Those mint the functional bp_guest reference; general analytics does not.

export const CONSENT_COOKIE = "bp_consent";
export type ConsentValue = "granted" | "denied";

/** Parse the consent choice out of a raw Cookie header (server or client). */
export function parseConsentCookie(cookieHeader: string | null | undefined): ConsentValue | null {
  if (!cookieHeader) return null;
  const m = cookieHeader.match(/(?:^|;\s*)bp_consent=(granted|denied)/);
  return (m?.[1] as ConsentValue) ?? null;
}

/** Client-only: current choice, or null if the traveller hasn't decided. */
export function readConsent(): ConsentValue | null {
  if (typeof document === "undefined") return null;
  return parseConsentCookie(document.cookie);
}

/** Client-only: has the traveller opted in to analytics? */
export function analyticsAllowed(): boolean {
  return readConsent() === "granted";
}

/** Client-only: persist the choice for a year. */
export function setConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
}
