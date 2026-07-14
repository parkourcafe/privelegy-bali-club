import "server-only";
import { headers } from "next/headers";
import { nanoid } from "nanoid";
import { rawCookieValues } from "./http-cookie";
import {
  configuredGuestRefSecret,
  configuredPreviousGuestRefSecret,
  isGuestRef,
  signGuestRef,
  verifyGuestRefProof,
} from "./guest-ref-proof";
export { isGuestRef } from "./guest-ref-proof";

// __Host- prevents a sibling subdomain from planting Domain/path-shadowing
// identity cookies. Legacy unprefixed cookies are detected but never trusted
// or upgraded into the protected session.
export const GUEST_COOKIE = "__Host-bp_guest";
export const GUEST_PROOF_COOKIE = "__Host-bp_guest_proof";
export const LEGACY_GUEST_COOKIE = "bp_guest";
export const LEGACY_GUEST_PROOF_COOKIE = "bp_guest_proof";

export type GuestRefCookieState =
  | { status: "absent" | "legacy" | "invalid" | "unavailable" }
  | { status: "valid_current" | "valid_previous"; ref: string };

export type GuestRefAccess =
  | { status: "absent" | "legacy" | "invalid" | "unavailable" }
  | { status: "verified"; ref: string; refreshedProof: string | null };

export async function readGuestRefCookieState(): Promise<GuestRefCookieState> {
  const cookieHeader = (await headers()).get("cookie");
  const refs = rawCookieValues(cookieHeader, GUEST_COOKIE);
  const proofs = rawCookieValues(cookieHeader, GUEST_PROOF_COOKIE);
  const legacyPresent = rawCookieValues(cookieHeader, LEGACY_GUEST_COOKIE).length > 0
    || rawCookieValues(cookieHeader, LEGACY_GUEST_PROOF_COOKIE).length > 0;

  if (refs.length === 0 && proofs.length === 0) {
    return { status: legacyPresent ? "legacy" : "absent" };
  }
  // Duplicate/path-shadowed or incomplete protected cookies fail closed.
  if (refs.length !== 1 || proofs.length !== 1 || !isGuestRef(refs[0])) {
    return { status: "invalid" };
  }

  const current = configuredGuestRefSecret();
  const previous = configuredPreviousGuestRefSecret();
  if (!current && !previous) return { status: "unavailable" };
  if (current && verifyGuestRefProof(refs[0], proofs[0], current)) {
    return { status: "valid_current", ref: refs[0] };
  }
  if (previous && verifyGuestRefProof(refs[0], proofs[0], previous)) {
    return { status: "valid_previous", ref: refs[0] };
  }
  return { status: "invalid" };
}

export async function readGuestRef(): Promise<string | null> {
  const state = await readGuestRefCookieState();
  return state.status === "valid_current" || state.status === "valid_previous"
    ? state.ref
    : null;
}

export async function resolveGuestRefAccess(): Promise<GuestRefAccess> {
  const state = await readGuestRefCookieState();
  if (
    state.status === "absent"
    || state.status === "legacy"
    || state.status === "invalid"
    || state.status === "unavailable"
  ) {
    return state;
  }
  if (state.status === "valid_current") {
    return { status: "verified", ref: state.ref, refreshedProof: null };
  }
  if (state.status !== "valid_previous") return { status: "unavailable" };

  const secret = configuredGuestRefSecret();
  if (!secret) return { status: "unavailable" };
  const refreshedProof = signGuestRef(state.ref, secret);
  return refreshedProof
    ? { status: "verified", ref: state.ref, refreshedProof }
    : { status: "unavailable" };
}

// Minting is used only by /api/guest/bootstrap. Identity-bearing mutations
// call readGuestRef and fail closed when either protected cookie is absent.
// A legacy-only session is kept intact and blocked for an approved migration
// or erasure procedure. Automatically adopting its bearer value would
// preserve sibling-domain session fixation; silently replacing it would
// orphan existing saves/redemptions and privacy rights.
export async function resolveGuestRef(): Promise<{
  ref: string;
  proof: string | null;
  created: boolean;
}> {
  const state = await readGuestRefCookieState();
  if (state.status === "valid_current") {
    return { ref: state.ref, proof: null, created: false };
  }
  const secret = configuredGuestRefSecret();
  if (!secret) throw new Error("guest_ref_signing_unconfigured");
  if (state.status === "valid_previous") {
    const proof = signGuestRef(state.ref, secret);
    if (!proof) throw new Error("guest_ref_signing_failed");
    return { ref: state.ref, proof, created: false };
  }
  if (state.status === "invalid" || state.status === "unavailable") {
    throw new Error("guest_ref_proof_required");
  }
  if (state.status === "legacy") throw new Error("legacy_identity_migration_required");
  const ref = "g_" + nanoid(16);
  const proof = signGuestRef(ref, secret);
  if (!proof) throw new Error("guest_ref_signing_failed");
  return { ref, proof, created: true };
}

export function guestCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}
