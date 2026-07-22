"use server";

import { cookies } from "next/headers";
import { configuredAdminToken, timingSafeSecretEqual } from "@/lib/admin-auth";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  mintAdminSessionToken,
} from "@/lib/admin-session";

// Return a plain result instead of calling redirect() here. The client does a
// HARD navigation (window.location) once it sees ok:true — App Router's
// client-side transition after a Server Action redirect() can, in practice,
// race the just-set cookie for the destination route's first request; a full
// browser navigation always carries whatever the cookie jar holds at that
// moment, so there's nothing to race.
export async function signInAdmin(formData: FormData): Promise<{ ok: boolean }> {
  const configured = configuredAdminToken();
  const submitted = String(formData.get("token") ?? "");

  if (!configured || !submitted || !timingSafeSecretEqual(submitted, configured)) {
    return { ok: false };
  }

  const session = mintAdminSessionToken(Date.now());
  if (!session) return { ok: false };

  (await cookies()).set(ADMIN_SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  return { ok: true };
}

export async function signOutAdmin(): Promise<{ ok: true }> {
  (await cookies()).delete({ name: ADMIN_SESSION_COOKIE, path: "/admin" });
  return { ok: true };
}
