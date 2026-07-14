import "server-only";

import { headers } from "next/headers";
import { configuredAdminToken, hasAdminBasicAccess } from "./admin-auth";

export class AdminAuthorizationError extends Error {
  constructor() {
    super("Operator authorization required.");
    this.name = "AdminAuthorizationError";
  }
}

export async function isCurrentAdminRequestAuthorized(): Promise<boolean> {
  const token = configuredAdminToken();
  if (!token) return false;
  const requestHeaders = await headers();
  return hasAdminBasicAccess(requestHeaders.get("authorization"), token);
}

export async function requireAdminRequest(): Promise<void> {
  if (!(await isCurrentAdminRequestAuthorized())) {
    throw new AdminAuthorizationError();
  }
}
