import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { isIdentityFreePublicPath } from "@/lib/public-request-policy";
import {
  REQUEST_ID_HEADER,
  createRequestCorrelationId,
  requestHeadersWithCorrelationId,
  responseWithCorrelationId,
} from "@/lib/request-correlation";

function setGuestCookie(req: NextRequest, res: NextResponse) {
  if (req.cookies.get("bp_guest")) return;
  res.cookies.set("bp_guest", "g_" + nanoid(16), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

function isSensitivePath(pathname: string): boolean {
  return ["/admin", "/onboard", "/partner", "/me", "/v", "/list"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Guardrail #10: the anonymous GuestRef lives in a server-set httpOnly cookie,
// not localStorage. Set it on the first document request so every later fetch
// (source/event/redeem/dish) shares one stable id — no client-side identity, no
// races between concurrent first calls.
// (Next 16: this is the `proxy` file convention, formerly `middleware`.)
export function proxy(req: NextRequest) {
  // Admin authorization is enforced in the server layout/actions so both
  // Supabase operator roles and the restricted break-glass Basic secret work.
  // The proxy deliberately does not attempt to parse/verify Supabase sessions
  // at the edge; unauthorized requests are rendered as not-found server-side.

  const requestId = createRequestCorrelationId(req.headers.get(REQUEST_ID_HEADER));
  const requestHeaders = requestHeadersWithCorrelationId(req.headers, requestId);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (isSensitivePath(req.nextUrl.pathname)) {
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("Referrer-Policy", "no-referrer");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (!isIdentityFreePublicPath(req.nextUrl.pathname)) setGuestCookie(req, res);
  return responseWithCorrelationId(res, requestId);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|icon-192.png|icon-512.png|icon-maskable-512.png|manifest.webmanifest|sw.js).*)",
  ],
};
