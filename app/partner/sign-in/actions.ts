"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authServerClient } from "@/lib/supabase/auth-server";

function requestOrigin(requestHeaders: Headers): string {
  const forwardedHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const forwardedProto = requestHeaders.get("x-forwarded-proto") ?? "https";
  if (forwardedHost) return `${forwardedProto}://${forwardedHost}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.otherbali.com";
}

export async function requestPartnerMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    redirect("/partner/sign-in?error=invalid_email");
  }

  const client = await authServerClient();
  if (!client) redirect("/partner/sign-in?error=not_configured");

  const origin = requestOrigin(await headers());
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/partner` },
  });

  redirect(error ? "/partner/sign-in?error=send_failed" : "/partner/sign-in?sent=1");
}
