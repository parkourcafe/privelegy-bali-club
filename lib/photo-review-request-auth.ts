import "server-only";

import { headers } from "next/headers";
import {
  configuredPhotoReviewToken,
  hasProxyAdminBasicAccess,
} from "./proxy-admin-auth";

export async function requirePhotoReviewRequest(): Promise<void> {
  const token = configuredPhotoReviewToken();
  const requestHeaders = await headers();
  if (!token || !(await hasProxyAdminBasicAccess(requestHeaders.get("authorization"), token))) {
    throw new Error("Photo review authorization required.");
  }
}
