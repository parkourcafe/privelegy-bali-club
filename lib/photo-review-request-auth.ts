import "server-only";

import { headers } from "next/headers";
import { configuredPhotoReviewToken, hasAdminBasicAccess } from "./admin-auth";

export async function requirePhotoReviewRequest(): Promise<void> {
  const token = configuredPhotoReviewToken();
  const requestHeaders = await headers();
  if (!token || !hasAdminBasicAccess(requestHeaders.get("authorization"), token)) {
    throw new Error("Photo review authorization required.");
  }
}
