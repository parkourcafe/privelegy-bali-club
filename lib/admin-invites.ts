import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { serviceClient } from "./supabase/service";

export interface InviteRosterRow {
  slug: string;
  name: string;
  district: string;
  status: string;
  whatsapp: string;
  token: string;
  confirmed: boolean;
  hasPhoto: boolean;
}

// These RPCs expose or mint bearer credentials, so each data-boundary call
// re-checks operator authorization and can run only with the server role.
export async function getInviteRoster(): Promise<InviteRosterRow[]> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return [];
  const { data, error } = await client.rpc("invite_roster");
  if (error || !Array.isArray(data)) return [];
  return (data as Record<string, unknown>[]).map((row) => ({
    slug: String(row.slug ?? ""),
    name: String(row.name ?? ""),
    district: String(row.district ?? ""),
    status: String(row.status ?? ""),
    whatsapp: String(row.whatsapp ?? ""),
    token: String(row.token ?? ""),
    confirmed: Boolean(row.confirmed),
    hasPhoto: Boolean(row.has_photo),
  }));
}

export async function getOrCreateOnboardToken(venueSlug: string): Promise<string | null> {
  await requireAdminRequest();
  const slug = venueSlug.trim();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const client = serviceClient();
  if (!client) return null;
  const { data, error } = await client.rpc("get_or_create_onboard_token", {
    p_venue_slug: slug,
  });
  return error || typeof data !== "string" || !data ? null : data;
}
