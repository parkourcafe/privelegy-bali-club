import {
  CONSENT_COOKIE,
  CONSENT_EVENT,
  LEGACY_CONSENT_COOKIE,
  type StoredConsentState,
} from "./consent";

const GA_COOKIE = /^(?:_ga(?:_.+)?|_gid|_gat(?:_.+)?|_gac_.+)$/;

export function knownAnalyticsCookieNames(cookie: string): string[] {
  return [...new Set(cookie
    .split(";")
    .map((part) => part.trim().split("=", 1)[0])
    .filter((name): name is string => Boolean(name) && GA_COOKIE.test(name)))]
    .sort();
}

export function cookieDomainCandidates(hostname: string): string[] {
  const host = hostname.trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  if (!host || host === "localhost" || host.includes(":")) return [];
  const labels = host.split(".");
  if (labels.length < 2 || labels.every((label) => /^\d+$/.test(label))) return [];

  // A browser ignores an invalid public-suffix deletion. Limiting attempts to
  // the current host and its registrable-looking parent covers host-only,
  // www.otherbali.com and .otherbali.com GA cookies without broad storage.
  const candidates = [host];
  if (labels.length > 2) candidates.push(labels.slice(-2).join("."));
  return [...new Set(candidates)];
}

function expireCookie(name: string, domain?: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const domainPart = domain ? `; Domain=${domain}` : "";
  document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax${domainPart}${secure}`;
}

export function announceConsent(state: StoredConsentState) {
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
}

export function stopAnalyticsImmediately() {
  document.cookie = `${CONSENT_COOKIE}=essential_only; Max-Age=31536000; Path=/; SameSite=Lax; Secure`;

  try {
    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    gtag?.("consent", "update", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  } catch {
    // Analytics shutdown and cookie cleanup still continue if a third-party
    // shim throws while processing Consent Mode.
  }

  const names = knownAnalyticsCookieNames(document.cookie);
  const domains = cookieDomainCandidates(window.location.hostname);
  expireCookie(LEGACY_CONSENT_COOKIE);
  for (const domain of domains) {
    expireCookie(LEGACY_CONSENT_COOKIE, domain);
    expireCookie(LEGACY_CONSENT_COOKIE, `.${domain}`);
  }
  for (const name of names) {
    expireCookie(name);
    for (const domain of domains) {
      expireCookie(name, domain);
      expireCookie(name, `.${domain}`);
    }
  }
  announceConsent("essential_only");
}
