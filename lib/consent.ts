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
export const CONSENT_CHANGE_EVENT = "otherbali:consent-change";
export type ConsentValue = "granted" | "denied";
export type ConsentState = ConsentValue | null;
export type ConsentGtag = (
  command: "consent",
  action: "update",
  parameters: { analytics_storage: "denied" },
) => void;
export type AnalyticsRuntimeGtag = (...args: unknown[]) => void;

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

/**
 * Apply the privacy-safe state to an already-loaded analytics runtime.
 * This is intentionally callable even after the Script component unmounts:
 * withdrawing or clearing consent must update a gtag instance that is already
 * present in the current page.
 */
export function denyAnalyticsUnlessGranted(
  state: ConsentState,
  gtag: ConsentGtag | undefined,
): void {
  if (state !== "granted") {
    gtag?.("consent", "update", { analytics_storage: "denied" });
  }
}

/**
 * Initialize an analytics runtime only when consent is still granted at the
 * exact moment the deferred script becomes ready.
 *
 * The cookie is deliberately re-read here instead of trusting React state from
 * the render that started loading the script. If consent was withdrawn while
 * the script was in flight, the first consent command is fail-closed and no
 * analytics configuration is sent.
 */
export function initializeAnalyticsRuntime(
  measurementId: string,
  gtag: AnalyticsRuntimeGtag,
  now: Date = new Date(),
): boolean {
  const granted = readConsent() === "granted";
  gtag("consent", "default", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  if (!granted) {
    gtag("consent", "update", { analytics_storage: "denied" });
    return false;
  }

  gtag("js", now);
  gtag("config", measurementId, { send_page_view: false });
  return true;
}

/** Client-only: persist the choice for a year. */
export function setConsent(value: ConsentValue): void {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${value}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_CHANGE_EVENT, { detail: value }));
  }
}

/**
 * Expire the readable consent choice and notify already-mounted analytics in
 * the same browser session. The forget endpoint also clears the cookie
 * server-side; this client helper makes the active React tree stop immediately
 * without waiting for a reload.
 */
export function clearConsent(): void {
  if (typeof document === "undefined") return;
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax${secure}`;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_CHANGE_EVENT, { detail: null }));
  }
}
