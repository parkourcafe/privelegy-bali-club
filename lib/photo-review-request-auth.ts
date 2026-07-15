import "server-only";

import { cookies, headers } from "next/headers";
import {
  configuredPhotoReviewShareToken,
  configuredPhotoReviewToken,
  hasAdminBasicAccess,
  photoReviewSessionValue,
  timingSafeSecretEqual,
} from "./admin-auth";
import { PHOTO_REVIEW_COOKIE } from "./photo-review-access";

export async function requirePhotoReviewRequest(): Promise<void> {
  const token = configuredPhotoReviewToken();
  const shareToken = configuredPhotoReviewShareToken();
  const [requestHeaders, requestCookies] = await Promise.all([headers(), cookies()]);
  const basicAllowed = hasAdminBasicAccess(requestHeaders.get("authorization"), token);
  const cookieValue = requestCookies.get(PHOTO_REVIEW_COOKIE)?.value;
  const shareAllowed = Boolean(
    shareToken && cookieValue && timingSafeSecretEqual(cookieValue, photoReviewSessionValue(shareToken)),
  );
  if (!basicAllowed && !shareAllowed) throw new Error("Photo review authorization required.");
}
