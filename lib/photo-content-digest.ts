import { createHash } from "node:crypto";

export function photoContentSha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function storedPhotoSha256(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const candidate = value.startsWith("\\x") ? value.slice(2) : value;
  return /^[a-f0-9]{64}$/i.test(candidate) ? candidate.toLowerCase() : null;
}

export function photoDigestMatches(bytes: Uint8Array, stored: unknown): boolean {
  const expected = storedPhotoSha256(stored);
  return expected !== null && photoContentSha256(bytes) === expected;
}
