import { cookies } from "next/headers";
import { nanoid } from "nanoid";

// Server-side anonymous GuestRef, backed by an httpOnly cookie (guardrail #10).
// The client never reads or sends the id; API routes resolve it here.

export const GUEST_COOKIE = "bp_guest";

export async function readGuestRef(): Promise<string | null> {
  const c = await cookies();
  return c.get(GUEST_COOKIE)?.value ?? null;
}

// Returns the ref, minting one if the cookie is somehow absent (direct API hit
// before middleware ran). Caller sets the cookie on the response when created.
export async function resolveGuestRef(): Promise<{ ref: string; created: boolean }> {
  const existing = await readGuestRef();
  if (existing) return { ref: existing, created: false };
  return { ref: "g_" + nanoid(16), created: true };
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
