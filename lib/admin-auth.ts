import { createHash, timingSafeEqual } from "node:crypto";

const MAX_AUTHORIZATION_HEADER_LENGTH = 4096;
const BASE64_CREDENTIALS = /^[A-Za-z0-9+/]+={0,2}$/;

export function configuredAdminToken(): string | null {
  const token = process.env.ADMIN_ACCESS_TOKEN?.trim();
  if (!token || token.length < 32 || /^(change-me|example|password|admin)/i.test(token)) {
    return null;
  }
  return token;
}

export function timingSafeSecretEqual(candidate: string, expected: string): boolean {
  const candidateDigest = createHash("sha256").update(candidate, "utf8").digest();
  const expectedDigest = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

function basicPassword(authorization: string | null): string | null {
  if (
    !authorization ||
    authorization.length > MAX_AUTHORIZATION_HEADER_LENGTH
  ) {
    return null;
  }

  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(authorization);
  if (!match || !BASE64_CREDENTIALS.test(match[1])) return null;

  try {
    const decoded = Buffer.from(match[1], "base64").toString("utf8");
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return decoded.slice(separator + 1);
  } catch {
    return null;
  }
}

// Generic Basic-Auth password check against a configured token. Returns false
// when no token is configured (caller decides whether that means "open" or
// "not found").
export function hasBasicAccess(
  authorization: string | null,
  configuredToken: string | null
): boolean {
  if (!configuredToken) return false;
  const password = basicPassword(authorization);
  return password !== null && timingSafeSecretEqual(password, configuredToken);
}

export function hasAdminBasicAccess(
  authorization: string | null,
  configuredToken = configuredAdminToken()
): boolean {
  return hasBasicAccess(authorization, configuredToken);
}

// Optional password for the App Review page (/review). When set, the page is
// Basic-Auth gated (give Apple the URL + this password in Review Notes); when
// unset, the page is simply public + noindex. Lower length bar than the admin
// token — it guards only reviewer instructions, not operator tools.
export function configuredReviewToken(): string | null {
  const token = process.env.REVIEW_ACCESS_TOKEN?.trim();
  if (!token || token.length < 16 || /^(change-me|example|password|review)/i.test(token)) {
    return null;
  }
  return token;
}
