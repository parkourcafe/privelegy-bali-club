import { createHmac, timingSafeEqual } from "node:crypto";

const GUEST_REF = /^g_[A-Za-z0-9_-]{16}$/;
const PROOF = /^[A-Za-z0-9_-]{43}$/;

export function isGuestRef(value: unknown): value is string {
  return typeof value === "string" && GUEST_REF.test(value);
}

export function configuredGuestRefSecret(value = process.env.GUEST_REF_SIGNING_SECRET): string | null {
  const secret = value?.trim();
  return secret && secret.length >= 32 ? secret : null;
}

export function configuredPreviousGuestRefSecret(
  value = process.env.GUEST_REF_PREVIOUS_SIGNING_SECRET,
): string | null {
  return configuredGuestRefSecret(value);
}

export function signGuestRef(ref: string, secret: string): string | null {
  if (!isGuestRef(ref) || secret.length < 32) return null;
  return createHmac("sha256", secret).update(`otherbali:guest-ref:v1:${ref}`).digest("base64url");
}

export function verifyGuestRefProof(ref: unknown, proof: unknown, secret: string): ref is string {
  if (!isGuestRef(ref) || typeof proof !== "string" || !PROOF.test(proof)) return false;
  const expected = signGuestRef(ref, secret);
  if (!expected) return false;
  const actualBytes = Buffer.from(proof, "utf8");
  const expectedBytes = Buffer.from(expected, "utf8");
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}
