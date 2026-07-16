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

export interface VenueProfileDraftRow {
  id: string;
  venueSlug: string;
  aboutText: string;
  signatureItems: string;
  openingHours: string;
  priceRange: string;
  gmapsUrl: string;
  instagramUrl: string;
  websiteUrl: string;
  videoUrl: string;
  publishNotes: string;
  submitterName: string;
  submitterRole: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Operator read of owner self-fill profile drafts (migration 0036). These are
// the owner's own words and facts, submitted via their tokenized /onboard
// link. Editorial reviews and applies fields by hand — owner copy stays
// attributed as owner copy and never overwrites editorial voice.
export async function getVenueProfileDrafts(): Promise<VenueProfileDraftRow[]> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return [];
  const { data, error } = await client
    .from("venue_profile_drafts")
    .select(
      "id,venue_slug,about_text,signature_items,opening_hours,price_range,gmaps_url,instagram_url,website_url,video_url,publish_notes,submitter_name,submitter_role,status,created_at,updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(500);
  if (error || !Array.isArray(data)) return [];
  return (data as Record<string, unknown>[]).map((row) => ({
    id: String(row.id ?? ""),
    venueSlug: String(row.venue_slug ?? ""),
    aboutText: String(row.about_text ?? ""),
    signatureItems: String(row.signature_items ?? ""),
    openingHours: String(row.opening_hours ?? ""),
    priceRange: String(row.price_range ?? ""),
    gmapsUrl: String(row.gmaps_url ?? ""),
    instagramUrl: String(row.instagram_url ?? ""),
    websiteUrl: String(row.website_url ?? ""),
    videoUrl: String(row.video_url ?? ""),
    publishNotes: String(row.publish_notes ?? ""),
    submitterName: String(row.submitter_name ?? ""),
    submitterRole: String(row.submitter_role ?? ""),
    status: String(row.status ?? ""),
    createdAt: String(row.created_at ?? ""),
    updatedAt: String(row.updated_at ?? ""),
  }));
}
