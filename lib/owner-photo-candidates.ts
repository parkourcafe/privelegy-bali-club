import "server-only";

import candidatePackage from "@/data/photo-candidates/owner-review.json";
import {
  ownerCandidateConsentPath,
  ownerCandidateSubmissionId,
} from "@/lib/owner-photo-candidate-id";
import { resolvePhotoOnboardingVenue } from "@/lib/photo-onboarding-token";
import { serviceClient } from "@/lib/supabase/service";

export type OwnerPhotoCandidate = {
  id: string;
  objectPath: string;
  sourcePageUrl: string;
  sourceType: string;
  sha256: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/avif";
  bytes: number;
  width: number;
  height: number;
};

export type OwnerPhotoCandidatePreview = Pick<
  OwnerPhotoCandidate,
  "id" | "sourcePageUrl" | "sourceType" | "width" | "height"
> & {
  previewUrl: string;
  reviewStatus: "available" | "pending" | "approved" | "rejected";
};

type CandidateVenue = {
  slug: string;
  candidates: OwnerPhotoCandidate[];
};

const venues = new Map(
  (candidatePackage.venues as CandidateVenue[]).map((venue) => [venue.slug, venue]),
);

export const OWNER_PHOTO_PACKAGE_DIGEST = candidatePackage.packageDigest;
export const OWNER_PHOTO_CANDIDATE_BUCKET = "owner-photo-candidates";
export const OWNER_PHOTO_CONSENT_BUCKET = "owner-photo-consents";

export function ownerCandidatesForVenue(venueSlug: string): OwnerPhotoCandidate[] {
  return venues.get(venueSlug)?.candidates ?? [];
}

export async function getOwnerPhotoCandidatePreviews(
  token: string,
  photoSchemaReady: boolean,
): Promise<OwnerPhotoCandidatePreview[]> {
  const client = serviceClient();
  if (!client) return [];
  const venueSlug = await resolvePhotoOnboardingVenue(client, token);
  if (!venueSlug) return [];
  const candidates = ownerCandidatesForVenue(venueSlug);
  if (candidates.length === 0) return [];

  const submissionIds = candidates.map((candidate) =>
    ownerCandidateSubmissionId(venueSlug, candidate.id),
  );
  const states = new Map<string, OwnerPhotoCandidatePreview["reviewStatus"]>();
  const existing = photoSchemaReady
    ? await client
        .from("venue_photo_submissions")
        .select("id,status")
        .in("id", submissionIds)
    : { data: null, error: { message: "photo_schema_not_ready" } };
  if (photoSchemaReady && !existing.error) {
    for (const row of existing.data ?? []) {
      const status = String(row.status);
      states.set(
        String(row.id),
        status === "approved" || status === "rejected" ? status : "pending",
      );
    }
  }
  if (!photoSchemaReady || existing.error) {
    await Promise.all(candidates.map(async (candidate) => {
      const receipt = await client.storage
        .from(OWNER_PHOTO_CONSENT_BUCKET)
        .download(ownerCandidateConsentPath(venueSlug, candidate.id));
      if (!receipt.error && receipt.data) {
        states.set(ownerCandidateSubmissionId(venueSlug, candidate.id), "pending");
      }
    }));
  }

  const previews = await Promise.all(candidates.map(async (candidate) => {
    const signed = await client.storage
      .from(OWNER_PHOTO_CANDIDATE_BUCKET)
      .createSignedUrl(candidate.objectPath, 10 * 60);
    if (signed.error || !signed.data?.signedUrl) return null;
    return {
      id: candidate.id,
      sourcePageUrl: candidate.sourcePageUrl,
      sourceType: candidate.sourceType,
      width: candidate.width,
      height: candidate.height,
      previewUrl: signed.data.signedUrl,
      reviewStatus: states.get(ownerCandidateSubmissionId(venueSlug, candidate.id)) ?? "available",
    } satisfies OwnerPhotoCandidatePreview;
  }));

  return previews.filter((candidate): candidate is OwnerPhotoCandidatePreview => candidate !== null);
}
