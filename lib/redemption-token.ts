import { createHmac, timingSafeEqual } from "node:crypto";

const VENUE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOKEN = /^([0-9a-z]{6,12})\.([A-Za-z0-9_-]{43})$/;
const TOKEN_TTL_SECONDS = 90 * 24 * 60 * 60;

function validSecret(secret: string | undefined): secret is string {
  return Boolean(secret && secret.length >= 32 && !/^(change-me|example)/i.test(secret));
}

function safeAudience(value: string): string | null {
  try {
    const parsed = new URL(value);
    const local = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
    if ((!local && parsed.protocol !== "https:") || (local && !["http:", "https:"].includes(parsed.protocol))) {
      return null;
    }
    if (parsed.username || parsed.password) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

function digest(venueSlug: string, audience: string, expiresAt: number, secret: string): string {
  return createHmac("sha256", secret)
    .update(`other-bali-redemption-v2\0${venueSlug}\0${audience}\0${expiresAt}`, "utf8")
    .digest("base64url");
}

export function createRedemptionToken(
  venueSlug: string,
  secret: string | undefined,
  audience: string,
  nowMs = Date.now(),
): string | null {
  const safe = safeAudience(audience);
  if (!VENUE_SLUG.test(venueSlug) || !validSecret(secret) || !safe || !Number.isFinite(nowMs)) {
    return null;
  }
  const expiresAt = Math.floor(nowMs / 1000) + TOKEN_TTL_SECONDS;
  return `${expiresAt.toString(36)}.${digest(venueSlug, safe, expiresAt, secret)}`;
}

export function verifyRedemptionToken(
  venueSlug: string,
  token: string,
  secret: string | undefined,
  audience: string,
  nowMs = Date.now(),
): boolean {
  const match = TOKEN.exec(token);
  const safe = safeAudience(audience);
  if (!VENUE_SLUG.test(venueSlug) || !match || !validSecret(secret) || !safe || !Number.isFinite(nowMs)) {
    return false;
  }
  const expiresAt = Number.parseInt(match[1], 36);
  const nowSeconds = Math.floor(nowMs / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < nowSeconds || expiresAt > nowSeconds + TOKEN_TTL_SECONDS) {
    return false;
  }
  const expected = Buffer.from(digest(venueSlug, safe, expiresAt, secret), "utf8");
  const received = Buffer.from(match[2], "utf8");
  return expected.length === received.length && timingSafeEqual(expected, received);
}
