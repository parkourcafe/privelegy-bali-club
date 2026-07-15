import "server-only";

import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

const PHOTO_TOKEN = /^[A-Za-z0-9_-]{32,256}$/;

function tokenHash(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("base64url");
}

export async function resolvePhotoOnboardingVenue(
  client: SupabaseClient,
  rawToken: string,
): Promise<string | null> {
  const token = rawToken.trim();
  if (!PHOTO_TOKEN.test(token)) return null;

  const { data: photoToken, error: photoTokenError } = await client
    .from("venue_photo_tokens")
    .select("venue_slug,expires_at")
    .eq("token_hash", tokenHash(token))
    .is("revoked_at", null)
    .maybeSingle();
  if (!photoTokenError && photoToken) {
    const expiry = photoToken.expires_at ? Date.parse(photoToken.expires_at) : null;
    return expiry === null || (Number.isFinite(expiry) && expiry > Date.now())
      ? String(photoToken.venue_slug)
      : null;
  }

  // Production invitations predate the optional photo schema. A missing
  // venue_photo_tokens table must not invalidate an otherwise current token.
  const { data: onboardingToken, error: onboardingError } = await client
    .from("venue_onboard_tokens")
    .select("venue_slug")
    .eq("token", token)
    .maybeSingle();
  if (onboardingError || !onboardingToken) return null;
  return String(onboardingToken.venue_slug);
}
