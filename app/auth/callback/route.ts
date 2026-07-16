import { NextResponse } from "next/server";
import { authServerClient } from "@/lib/supabase/auth-server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/partner";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/partner";
  const client = await authServerClient();

  if (!client || !code) return NextResponse.redirect(new URL("/partner/sign-in?error=callback", url.origin));
  const { error } = await client.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(new URL("/partner/sign-in?error=callback", url.origin));
  return NextResponse.redirect(new URL(safeNext, url.origin));
}
