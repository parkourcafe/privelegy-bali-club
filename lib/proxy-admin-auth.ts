const MAX_AUTHORIZATION_HEADER_LENGTH = 4096;
const BASE64_CREDENTIALS = /^[A-Za-z0-9+/]+={0,2}$/;

export function configuredProxyAdminToken(): string | null {
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

function basicPassword(authorization: string | null): string | null {
  if (!authorization || authorization.length > MAX_AUTHORIZATION_HEADER_LENGTH) return null;
  const match = /^Basic ([A-Za-z0-9+/]+={0,2})$/i.exec(authorization);
  if (!match || !BASE64_CREDENTIALS.test(match[1])) return null;
  try {
    const binary = atob(match[1]);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    const separator = decoded.indexOf(":");
    return separator < 0 ? null : decoded.slice(separator + 1);
  } catch {
    return null;
  }
}

async function sha256(value: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(value);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

function equalDigest(candidate: Uint8Array, expected: Uint8Array): boolean {
  if (candidate.length !== expected.length) return false;
  let difference = 0;
  for (let index = 0; index < candidate.length; index += 1) {
    difference |= candidate[index] ^ expected[index];
  }
  return difference === 0;
}

export async function hasProxyAdminBasicAccess(
  authorization: string | null,
  configuredToken = configuredProxyAdminToken(),
): Promise<boolean> {
  if (!configuredToken) return false;
  const password = basicPassword(authorization);
  if (password === null) return false;
  const [candidate, expected] = await Promise.all([
    sha256(password),
    sha256(configuredToken),
  ]);
  return equalDigest(candidate, expected);
}
