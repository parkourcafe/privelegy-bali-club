import "server-only";

import { serviceClient } from "./supabase/service";
import { getAuthenticatedUser } from "./supabase/auth-server";

export type PartnerVenue = {
  venueSlug: string;
  role: "owner" | "manager" | "staff";
  name: string;
  district: string;
  address: string;
};

export type PartnerContext = {
  userId: string;
  email: string | null;
  venues: PartnerVenue[];
  schemaAvailable: boolean;
};

export async function getPartnerContext(): Promise<PartnerContext | null> {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const service = serviceClient();
  if (!service) {
    return { userId: user.id, email: user.email ?? null, venues: [], schemaAvailable: false };
  }

  const { data, error } = await service
    .from("venue_memberships")
    .select("venue_slug,role,status,venues(slug,name,district,address)")
    .eq("user_id", user.id)
    .eq("status", "active");

  if (error) {
    return { userId: user.id, email: user.email ?? null, venues: [], schemaAvailable: false };
  }

  const venues: PartnerVenue[] = [];
  for (const row of data ?? []) {
    const venue = Array.isArray(row.venues) ? row.venues[0] : row.venues;
    if (!venue || typeof venue !== "object") continue;
    const value = venue as Record<string, unknown>;
    const role = row.role;
    if (role !== "owner" && role !== "manager" && role !== "staff") continue;
    venues.push({
      venueSlug: String(row.venue_slug ?? ""),
      role,
      name: String(value.name ?? row.venue_slug ?? "Venue"),
      district: String(value.district ?? ""),
      address: String(value.address ?? ""),
    });
  }

  return { userId: user.id, email: user.email ?? null, venues, schemaAvailable: true };
}

export async function getPartnerVenue(slug: string): Promise<PartnerVenue | null> {
  const context = await getPartnerContext();
  return context?.venues.find((venue) => venue.venueSlug === slug) ?? null;
}
