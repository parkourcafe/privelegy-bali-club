"use server";

import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/supabase/auth-server";
import { claimVenueForUser } from "@/lib/partner-claims";

export async function claimPartnerVenue(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const user = await getAuthenticatedUser();
  if (!user) redirect(`/partner/sign-in?next=${encodeURIComponent(`/partner/claim/${token}`)}`);

  const result = await claimVenueForUser(token, user.id);
  if (result.ok) redirect(`/partner/venues/${result.venueSlug}`);
  redirect(`/partner/claim/${encodeURIComponent(token)}?error=${result.error}`);
}
