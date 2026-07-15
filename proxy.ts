import { NextResponse, type NextRequest } from "next/server";
import {
  configuredPhotoReviewToken,
  configuredProxyAdminToken,
  hasProxyAdminBasicAccess,
} from "@/lib/proxy-admin-auth";
import {
  REQUEST_ID_HEADER,
  createRequestCorrelationId,
  requestHeadersWithCorrelationId,
  responseWithCorrelationId,
} from "@/lib/request-correlation";

const ADMIN_REALM = "Other Bali Field Kit";
const PHOTO_REVIEW_REALM = "Other Bali Photo Review";

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isPhotoReviewPath(pathname: string): boolean {
  return pathname === "/developer/photo-review" || pathname.startsWith("/developer/photo-review/");
}

function isSensitivePath(pathname: string): boolean {
  return ["/admin", "/developer/photo-review", "/onboard", "/partner", "/me", "/v", "/list"].some(
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

// Ordinary document requests remain identity-free. Identity-bearing actions
// first use the cross-tab coordinated /api/guest/bootstrap boundary.
// (Next 16: this is the `proxy` file convention, formerly `middleware`.)
export async function proxy(req: NextRequest) {
  const requestId = createRequestCorrelationId(req.headers.get(REQUEST_ID_HEADER));
  const requestHeaders = requestHeadersWithCorrelationId(req.headers, requestId);

  if (isAdminPath(req.nextUrl.pathname)) {
    // Shared Basic Auth is not an acceptable public-production admin boundary.
    // Until individual auth, roles, MFA and audit logging exist, the operator
    // UI is available only outside the production deployment.
    if (process.env.VERCEL_ENV === "production") {
      return responseWithCorrelationId(adminNotFound(), requestId);
    }
    const token = configuredProxyAdminToken();
    if (!token) return responseWithCorrelationId(adminNotFound(), requestId);
    if (!(await hasProxyAdminBasicAccess(req.headers.get("authorization"), token))) {
      return responseWithCorrelationId(adminChallenge(), requestId);
    }
  }

  if (isPhotoReviewPath(req.nextUrl.pathname)) {
    const token = configuredPhotoReviewToken();
    if (!token) return responseWithCorrelationId(adminNotFound(), requestId);
    if (!(await hasProxyAdminBasicAccess(req.headers.get("authorization"), token))) {
      return responseWithCorrelationId(photoReviewChallenge(), requestId);
    }
  }

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (isSensitivePath(req.nextUrl.pathname)) {
    res.headers.set("Cache-Control", "private, no-store, max-age=0");
    res.headers.set("Referrer-Policy", "no-referrer");
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  return responseWithCorrelationId(res, requestId);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|icon-maskable.svg|icon-192.png|icon-512.png|icon-maskable-512.png|manifest.webmanifest|sw.js).*)",
  ],
};
