import { requireAdminRequest } from "@/lib/admin-request-auth";
import { PHOTO_BUCKET } from "@/lib/photo-submission-policy";
import { serviceClient } from "@/lib/supabase/service";

export type PendingPhotoReview = {
  id: string;
  venueSlug: string;
  venueName: string;
  previewUrl: string | null;
  submitterName: string;
  submitterContact: string | null;
  consentGranted: boolean;
  consentTermsVersion: string | null;
  consentAt: string | null;
  hasConsentLog: boolean;
  createdAt: string;
};

export type PendingPhotoReviewResult = {
  configured: boolean;
  error: string | null;
  submissions: PendingPhotoReview[];
};

export async function getPendingPhotoReviews(): Promise<PendingPhotoReviewResult> {
  await requireAdminRequest();
  const client = serviceClient();
  if (!client) return { configured: false, error: null, submissions: [] };

  const { data, error } = await client
    .from("venue_photo_submissions")
    .select("id,venue_slug,image_path,submitter_name,submitter_contact,consent_granted,consent_terms_version,consent_at,consent_log_id,created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) return { configured: true, error: error.message, submissions: [] };

  const rows = data ?? [];
  const consentIds = [...new Set(rows.map((row) => row.consent_log_id).filter(Boolean).map(String))];
  const consentById = new Map<string, { venueSlug: string; submissionIds: Set<string> }>();
  if (consentIds.length) {
    const { data: consents, error: consentError } = await client
      .from("consent_log")
      .select("id,venue_slug,consent_type,granted,submission_ids")
      .in("id", consentIds)
      .eq("consent_type", "venue_photo_rights")
      .eq("granted", true);
    if (consentError) return { configured: true, error: consentError.message, submissions: [] };
    for (const consent of consents ?? []) {
      consentById.set(String(consent.id), {
        venueSlug: String(consent.venue_slug),
        submissionIds: new Set(Array.isArray(consent.submission_ids) ? consent.submission_ids.map(String) : []),
      });
    }
  }
  const venueSlugs = [...new Set(rows.map((row) => String(row.venue_slug)))];
  const venueNames = new Map<string, string>();
  if (venueSlugs.length) {
    const { data: venues, error: venueError } = await client
      .from("venues")
      .select("slug,name")
      .in("slug", venueSlugs);
    if (venueError) return { configured: true, error: venueError.message, submissions: [] };
    for (const venue of venues ?? []) {
      venueNames.set(String(venue.slug), String(venue.name ?? venue.slug));
    }
  }

  const submissions = await Promise.all(rows.map(async (row): Promise<PendingPhotoReview> => {
    const { data: signed } = await client.storage
      .from(PHOTO_BUCKET)
      .createSignedUrl(String(row.image_path), 5 * 60);
    const venueSlug = String(row.venue_slug);
    const linkedConsent = row.consent_log_id ? consentById.get(String(row.consent_log_id)) : null;
    return {
      id: String(row.id),
      venueSlug,
      venueName: venueNames.get(venueSlug) ?? venueSlug,
      previewUrl: signed?.signedUrl ?? null,
      submitterName: String(row.submitter_name ?? ""),
      submitterContact: row.submitter_contact ? String(row.submitter_contact) : null,
      consentGranted: Boolean(row.consent_granted),
      consentTermsVersion: row.consent_terms_version ? String(row.consent_terms_version) : null,
      consentAt: row.consent_at ? String(row.consent_at) : null,
      hasConsentLog: Boolean(linkedConsent && linkedConsent.venueSlug === venueSlug && linkedConsent.submissionIds.has(String(row.id))),
      createdAt: String(row.created_at),
    };
  }));

  submissions.sort((a, b) => a.venueName.localeCompare(b.venueName) || a.createdAt.localeCompare(b.createdAt));
  return { configured: true, error: null, submissions };
}
