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
  if (previous) {
    if (previous.revoked_at || previous.claimed_by !== userId) {
      return { ok: false, error: "already_claimed" };
    }
    // A repeated claim is read-only. It must never restore a suspended or
    // demoted membership to active owner.
    const { data: membership, error: membershipError } = await client
      .from("venue_memberships")
      .select("status")
      .eq("venue_slug", invite.venue_slug)
      .eq("user_id", userId)
      .maybeSingle();
    if (membershipError) return { ok: false, error: "schema_unavailable" };
    return membership?.status === "active"
      ? { ok: true, venueSlug: invite.venue_slug }
      : { ok: false, error: "already_claimed" };
  }

  const { data: existingMembership, error: existingMembershipError } = await client
    .from("venue_memberships")
    .select("id")
    .eq("venue_slug", invite.venue_slug)
    .eq("user_id", userId)
    .maybeSingle();
  if (existingMembershipError) return { ok: false, error: "schema_unavailable" };
  if (existingMembership) return { ok: false, error: "already_claimed" };

  const { error: claimError } = await client.from("venue_onboarding_claims").insert({
    venue_slug: invite.venue_slug,
    token_hash: tokenHash,
    claimed_by: userId,
    claimed_at: new Date().toISOString(),
  });
  if (claimError) return {
    ok: false,
    error: claimError.code === "23505" ? "already_claimed" : "schema_unavailable",
  };

  const { error: membershipError } = await client.from("venue_memberships").insert({
    venue_slug: invite.venue_slug,
    user_id: userId,
    role: "owner",
    status: "active",
    updated_at: new Date().toISOString(),
  });
  if (membershipError) return { ok: false, error: "schema_unavailable" };

  return { ok: true, venueSlug: invite.venue_slug };
}
