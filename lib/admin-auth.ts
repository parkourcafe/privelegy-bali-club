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

export function configuredPhotoReviewToken(): string | null {
  const token = process.env.PHOTO_REVIEW_ACCESS_TOKEN?.trim();
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

export function hasAdminBasicAccess(
  authorization: string | null,
  configuredToken = configuredAdminToken()
): boolean {
  if (!configuredToken) return false;
  const password = basicPassword(authorization);
  return password !== null && timingSafeSecretEqual(password, configuredToken);
}
