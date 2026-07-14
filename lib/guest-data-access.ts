import "server-only";
import { resolveGuestRefAccess } from "./guest-server";

// Server-rendered saved state accepts only the protected signed session.
// Legacy unprefixed bearer cookies fail closed because their Domain/path
// provenance cannot be distinguished from sibling-subdomain cookie tossing.
export async function readGuestRefForDataAccess(): Promise<string | null> {
  const access = await resolveGuestRefAccess();
  if (access.status === "verified") return access.ref;
  if (access.status === "absent") return null;
  throw new Error("guest_identity_unavailable");
}
