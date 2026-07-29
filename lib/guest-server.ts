import { cookies } from "next/headers";
import { nanoid } from "nanoid";

// Pseudonymous GuestRef. The website keeps it in an httpOnly cookie; the
// Capacitor app keeps an installation-scoped value and sends it in the explicit
// mobile header. Neither value contains profile or contact information.

export const GUEST_COOKIE = "bp_guest";
export const MOBILE_GUEST_HEADER = "X-Other-Bali-Guest";
const GUEST_REF = /^g_[A-Za-z0-9_-]{16}$/;

export function isGuestRef(value: unknown): value is string {
  return typeof value === "string" && GUEST_REF.test(value);
}

export class InvalidGuestRefError extends Error {
  constructor() {
    super("Invalid pseudonymous guest reference");
    this.name = "InvalidGuestRefError";
  }
}

/**
 * Resolve the pseudonymous guest reference supplied by a mobile shell.
 *
 * The explicit header takes precedence over the browser cookie so a Capacitor
 * install keeps one durable guest scope even when its WebView cookie jar is
 * recreated. A present-but-malformed header is rejected instead of silently
 * minting a different identity.
 */
export function readMobileGuestRef(request: Request): string | null | undefined {
  const value = request.headers.get(MOBILE_GUEST_HEADER);
  if (value === null) return undefined;
  return isGuestRef(value) ? value : null;
}

export async function readGuestRef(): Promise<string | null> {
  const c = await cookies();
  const value = c.get(GUEST_COOKIE)?.value;
  return isGuestRef(value) ? value : null;
}

// Returns the ref, minting one if the cookie is somehow absent (direct API hit
// before middleware ran). Caller sets the cookie on the response when created.
export async function resolveGuestRef(request?: Request): Promise<{ ref: string; created: boolean }> {
  if (request) {
    const mobileRef = readMobileGuestRef(request);
    if (mobileRef === null) throw new InvalidGuestRefError();
    if (mobileRef) return { ref: mobileRef, created: false };
  }
  const existing = await readGuestRef();
  if (existing) return { ref: existing, created: false };
  return { ref: "g_" + nanoid(16), created: true };
}

export interface ExistingGuestRefResolution {
  ref: string | null;
  invalid: boolean;
}

/**
 * Resolve an existing guest without creating one. Used by destructive privacy
 * actions where a fresh reference would erase nothing and could produce a
 * misleading success response.
 */
export async function resolveExistingGuestRef(
  request?: Request,
): Promise<ExistingGuestRefResolution> {
  if (request) {
    const mobileRef = readMobileGuestRef(request);
    if (mobileRef === null) return { ref: null, invalid: true };
    if (mobileRef) return { ref: mobileRef, invalid: false };
  }
  return { ref: await readGuestRef(), invalid: false };
}

/** Mobile privacy is header-only; a WebView cookie must never select its target. */
export async function resolveMobilePrivacyGuestRef(
  request: Request,
): Promise<ExistingGuestRefResolution> {
  const mobileRef = readMobileGuestRef(request);
  return {
    ref: mobileRef ?? null,
    invalid: mobileRef === null || mobileRef === undefined,
  };
}

export function guestCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}
