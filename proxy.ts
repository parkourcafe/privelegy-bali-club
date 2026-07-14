import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { configuredAdminToken, hasAdminBasicAccess } from "@/lib/admin-auth";

const ADMIN_REALM = "Other Bali Field Kit";

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

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isSensitivePath(pathname: string): boolean {
  return ["/admin", "/onboard", "/partner", "/me", "/v", "/list"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function adminChallenge(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function adminNotFound(): NextResponse {
  return new NextResponse("Not found", {
    status: 404,
    headers: { "X-Robots-Tag": "noindex, nofollow" },
  });
}

// Guardrail #10: the anonymous GuestRef lives in a server-set httpOnly cookie,
// not localStorage. Set it on the first document request so every later fetch
// (source/event/redeem/dish) shares one stable id — no client-side identity, no
// races between concurrent first calls.
// (Next 16: this is the `proxy` file convention, formerly `middleware`.)
export function proxy(req: NextRequest) {
  if (isAdminPath(req.nextUrl.pathname)) {
    const token = configuredAdminToken();
    if (!token) return adminNotFound();
    if (!hasAdminBasicAccess(req.headers.get("authorization"), token)) {
      return adminChallenge();
    }
  }

  const res = NextResponse.next();
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (isSensitivePath(req.nextUrl.pathname)) {
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("Referrer-Policy", "no-referrer");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  setGuestCookie(req, res);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|icon-192.png|icon-512.png|icon-maskable-512.png|manifest.webmanifest|sw.js).*)",
  ],
};
