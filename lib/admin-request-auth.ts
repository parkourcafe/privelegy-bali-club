import "server-only";

import { headers } from "next/headers";
import { configuredAdminToken, hasAdminBasicAccess } from "./admin-auth";
import { getAuthenticatedUser } from "./supabase/auth-server";

export class AdminAuthorizationError extends Error {
  constructor() {
    super("Operator authorization required.");
    this.name = "AdminAuthorizationError";
  }
}

export async function isCurrentAdminRequestAuthorized(): Promise<boolean> {
  const token = configuredAdminToken();
  const requestHeaders = await headers();
  if (token && hasAdminBasicAccess(requestHeaders.get("authorization"), token)) return true;

  // Authenticated operator roles are read from server-controlled app_metadata,
  // never user_metadata. The founder can keep the Basic secret as a restricted
  // break-glass path while Auth/RLS roles are rolled out.
  const user = await getAuthenticatedUser();
  if (!user) return false;
  const metadata = user.app_metadata as { role?: unknown; roles?: unknown } | undefined;
  const roles = [metadata?.role, ...(Array.isArray(metadata?.roles) ? metadata.roles : [])]
    .filter((role): role is string => typeof role === "string")
    .map((role) => role.trim().toLowerCase());
  return roles.some((role) => role === "operator" || role === "admin");
}

export async function requireAdminRequest(): Promise<void> {
  if (!(await isCurrentAdminRequestAuthorized())) {
    throw new AdminAuthorizationError();
  }
}
