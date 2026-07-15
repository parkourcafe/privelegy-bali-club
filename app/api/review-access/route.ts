import { NextResponse } from "next/server";
import {
  configuredPhotoReviewShareToken,
  photoReviewSessionValue,
  timingSafeSecretEqual,
} from "@/lib/admin-auth";
import {
  PHOTO_REVIEW_COOKIE,
  PHOTO_REVIEW_COOKIE_MAX_AGE,
} from "@/lib/photo-review-access";
import { isTrustedSameOriginMutation } from "@/lib/same-origin-mutation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PRIVATE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function loginRedirect(request: Request, error = false): NextResponse {
  const target = new URL(error ? "/review?error=1" : "/developer/site", request.url);
  return NextResponse.redirect(target, { status: 303, headers: PRIVATE_HEADERS });
}

export async function POST(request: Request) {
  if (!isTrustedSameOriginMutation(request)) {
    return new NextResponse("Forbidden", { status: 403, headers: PRIVATE_HEADERS });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isFinite(contentLength) || contentLength > 4096) {
    return new NextResponse("Request too large", { status: 413, headers: PRIVATE_HEADERS });
  }

  const form = await request.formData();
  const password = form.get("password");
  const honeypot = form.get("website");
  const shareToken = configuredPhotoReviewShareToken();
  const accepted = typeof password === "string" &&
    password.length <= 200 &&
    (honeypot === null || honeypot === "") &&
    Boolean(shareToken && timingSafeSecretEqual(password, shareToken));

  if (!accepted || !shareToken) return loginRedirect(request, true);

  const response = loginRedirect(request);
  response.cookies.set(PHOTO_REVIEW_COOKIE, photoReviewSessionValue(shareToken), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: PHOTO_REVIEW_COOKIE_MAX_AGE,
  });
  return response;
}
