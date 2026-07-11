import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";

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

function adminAuthConfigured(): string {
  return process.env.ADMIN_ACCESS_TOKEN?.trim() ?? "";
}

function hasAdminAccess(req: NextRequest, token: string): boolean {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) return false;

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    if (separator === -1) return false;
    const password = decoded.slice(separator + 1);
    return password === token;
  } catch {
    return false;
  }
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
    const token = adminAuthConfigured();
    if (!token && process.env.NODE_ENV === "production") return adminNotFound();
    if (token && !hasAdminAccess(req, token)) return adminChallenge();
  }

  const res = NextResponse.next();
  setGuestCookie(req, res);
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|icon-192.png|icon-512.png|icon-maskable-512.png|manifest.webmanifest|sw.js).*)",
  ],
};
