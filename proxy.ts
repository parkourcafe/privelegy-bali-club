import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import {
  configuredAdminToken,
  configuredPhotoReviewShareToken,
  configuredPhotoReviewToken,
  hasAdminBasicAccess,
  photoReviewSessionValue,
  timingSafeSecretEqual,
} from "@/lib/admin-auth";
import { PHOTO_REVIEW_COOKIE } from "@/lib/photo-review-access";

const ADMIN_REALM = "Other Bali Field Kit";
const PHOTO_REVIEW_REALM = "Other Bali Photo Review";

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

function isPhotoReviewPath(pathname: string): boolean {
  return pathname === "/developer/photo-review" ||
    pathname.startsWith("/developer/photo-review/") ||
    pathname === "/developer/site" ||
    pathname.startsWith("/developer/site/");
}

function isSensitivePath(pathname: string): boolean {
  return ["/admin", "/api/review-access", "/developer/photo-review", "/developer/site", "/review", "/onboard", "/partner", "/me", "/v", "/list"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function basicChallenge(realm: string): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function adminChallenge(): NextResponse {
  return basicChallenge(ADMIN_REALM);
}

function photoReviewChallenge(): NextResponse {
  return basicChallenge(PHOTO_REVIEW_REALM);
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
  const photoReviewRequest = isPhotoReviewPath(req.nextUrl.pathname) ||
    req.nextUrl.searchParams.get("photo-review") === "1";

  if (isAdminPath(req.nextUrl.pathname)) {
    const token = configuredAdminToken();
    if (!token) return adminNotFound();
    if (!hasAdminBasicAccess(req.headers.get("authorization"), token)) {
      return adminChallenge();
    }
  }

  if (photoReviewRequest) {
    const token = configuredPhotoReviewToken();
    const shareToken = configuredPhotoReviewShareToken();
    const cookieValue = req.cookies.get(PHOTO_REVIEW_COOKIE)?.value;
    const basicAllowed = hasAdminBasicAccess(req.headers.get("authorization"), token);
    const shareAllowed = Boolean(
      shareToken && cookieValue && timingSafeSecretEqual(cookieValue, photoReviewSessionValue(shareToken)),
    );
    if (!token && !shareToken) return adminNotFound();
    if (!basicAllowed && !shareAllowed) {
      return photoReviewChallenge();
    }
  }

  const res = NextResponse.next();
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (isSensitivePath(req.nextUrl.pathname) || photoReviewRequest) {
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
