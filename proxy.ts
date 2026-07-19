import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { configuredReviewToken, hasBasicAccess } from "@/lib/admin-auth";
import { isIdentityFreePublicPath } from "@/lib/public-request-policy";
import {
  REQUEST_ID_HEADER,
  createRequestCorrelationId,
  requestHeadersWithCorrelationId,
  responseWithCorrelationId,
} from "@/lib/request-correlation";
import {
  CANONICAL_SITE_ORIGIN,
  isReviewHost,
  isVercelDeploymentHost,
  shouldNoindexHost,
} from "@/lib/site-origin-policy";

const REVIEW_REALM = "Other Bali App Review";

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

function isReviewPath(pathname: string): boolean {
  return pathname === "/review" || pathname.startsWith("/review/");
}

function isSensitivePath(pathname: string): boolean {
  // /review is noindex (reviewer instructions), but not no-store — it's fine to
  // cache the static page; it is listed here only for the noindex/no-referrer
  // treatment below.
  return ["/admin", "/onboard", "/partner", "/me", "/v", "/list", "/review"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function reviewChallenge(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${REVIEW_REALM}", charset="UTF-8"`,
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
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
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const vercelEnv = process.env.VERCEL_ENV;

  // Production deployment aliases are duplicate public origins. Preserve the
  // path/query and consolidate them onto www. Preview deployments remain
  // directly usable for QA and are handled by the noindex rule below.
  if (vercelEnv === "production" && isVercelDeploymentHost(host)) {
    const destination = new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, CANONICAL_SITE_ORIGIN);
    return responseWithCorrelationId(NextResponse.redirect(destination, 308), requestId);
  }

  // The review hostname is a separate, non-production-write deployment. Fail
  // closed when its password is missing or invalid so moving the custom domain
  // can never expose a public clone during configuration or redeployment.
  if (isReviewHost(host)) {
    const reviewToken = configuredReviewToken();
    if (!reviewToken || !hasBasicAccess(req.headers.get("authorization"), reviewToken)) {
      return responseWithCorrelationId(reviewChallenge(), requestId);
    }
  }

  // /review is public by default (Apple prefers no login barrier). If a
  // REVIEW_ACCESS_TOKEN is configured, gate it with Basic Auth — hand the URL +
  // that password to Apple in Review Notes.
  if (isReviewPath(req.nextUrl.pathname)) {
    const reviewToken = configuredReviewToken();
    if (reviewToken && !hasBasicAccess(req.headers.get("authorization"), reviewToken)) {
      return reviewChallenge();
    }
  }

  const requestHeaders = requestHeadersWithCorrelationId(req.headers, requestId);
  const res = NextResponse.next({ request: { headers: requestHeaders } });
  if (shouldNoindexHost({ host, vercelEnv })) {
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
