import "server-only";

import { createHash } from "node:crypto";
import { serviceClient } from "./supabase/service";

export function partnerClaimTokenHash(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("base64url");
}

export async function claimVenueForUser(token: string, userId: string): Promise<
  | { ok: true; venueSlug: string }
  | { ok: false; error: "not_configured" | "invalid_token" | "already_claimed" | "schema_unavailable" }
> {
  const normalized = token.trim();
  if (!normalized || !userId) return { ok: false, error: "invalid_token" };
  const client = serviceClient();
  if (!client) return { ok: false, error: "not_configured" };

  const { data: invite, error: inviteError } = await client
    .from("venue_onboard_tokens")
    .select("token,venue_slug")
    .eq("token", normalized)
    .maybeSingle();
  if (inviteError) return { ok: false, error: "schema_unavailable" };
  if (!invite?.venue_slug) return { ok: false, error: "invalid_token" };

  const tokenHash = partnerClaimTokenHash(normalized);
  const { data: previous, error: previousError } = await client
    .from("venue_onboarding_claims")
    .select("claimed_by,revoked_at")
    .eq("token_hash", tokenHash)
    .maybeSingle();
  if (previousError) return { ok: false, error: "schema_unavailable" };
  if (previous && !previous.revoked_at && previous.claimed_by !== userId) {
    return { ok: false, error: "already_claimed" };
  }

  const { error: claimError } = await client.from("venue_onboarding_claims").upsert({
    venue_slug: invite.venue_slug,
    token_hash: tokenHash,
    claimed_by: userId,
    claimed_at: new Date().toISOString(),
    revoked_at: null,
  }, { onConflict: "token_hash" });
  if (claimError) return { ok: false, error: "schema_unavailable" };

  const { error: membershipError } = await client.from("venue_memberships").upsert({
    venue_slug: invite.venue_slug,
    user_id: userId,
    role: "owner",
    status: "active",
    updated_at: new Date().toISOString(),
  }, { onConflict: "venue_slug,user_id" });
  if (membershipError) return { ok: false, error: "schema_unavailable" };

  return { ok: true, venueSlug: invite.venue_slug };
}
