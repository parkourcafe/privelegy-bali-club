import "server-only";

import { requireAdminRequest } from "./admin-request-auth";
import { serviceClient } from "./supabase/service";

export interface VenueSubmissionRow {
  id: string;
  name: string;
  category: string;
  district: string;
  whatsapp: string;
  email: string;
  instagramUrl: string;
  websiteUrl: string;
  note: string;
  status: string;
  createdAt: string;
}

// Operator read of the public self-submission queue (migration 0035). Pending
// intake only — these are NOT venues and never appear on the public app until
// editorial promotes them by hand. Re-checks operator authorization; reads via
// the service role (the table is default-deny under RLS).
export async function getVenueSubmissions(): Promise<VenueSubmissionRow[]> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return [];
  const { data, error } = await client
    .from("venue_submissions")
    .select(
      "id,name,category,district,whatsapp,email,instagram_url,website_url,note,status,created_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);
  if (error || !Array.isArray(data)) return [];
  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id ?? ""),
    name: String(row.name ?? ""),
    category: String(row.category ?? ""),
    district: String(row.district ?? ""),
    whatsapp: String(row.whatsapp ?? ""),
    email: String(row.email ?? ""),
    instagramUrl: String(row.instagram_url ?? ""),
    websiteUrl: String(row.website_url ?? ""),
    note: String(row.note ?? ""),
    status: String(row.status ?? ""),
    createdAt: String(row.created_at ?? ""),
  }));
}
