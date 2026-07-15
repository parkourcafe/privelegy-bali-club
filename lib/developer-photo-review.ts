import "server-only";

import candidatePackage from "@/data/photo-candidates/owner-review.json";
import { OWNER_PHOTO_CANDIDATE_BUCKET } from "@/lib/owner-photo-candidates";
import { requirePhotoReviewRequest } from "@/lib/photo-review-request-auth";
import { serviceClient } from "@/lib/supabase/service";

type ManifestCandidate = {
  id: string;
  objectPath: string;
  sourcePageUrl: string;
  sourceType: string;
  width: number;
  height: number;
};

type ManifestVenue = {
  slug: string;
  name: string;
  candidates: ManifestCandidate[];
};

export type DeveloperPhotoReviewCandidate = Omit<ManifestCandidate, "objectPath"> & {
  previewUrl: string;
};

export type DeveloperPhotoReviewVenue = {
  slug: string;
  name: string;
  candidates: DeveloperPhotoReviewCandidate[];
};

export type DeveloperPhotoReviewPage = {
  page: number;
  pageCount: number;
  pageSize: number;
  totalVenues: number;
  totalCandidates: number;
  query: string;
  venues: DeveloperPhotoReviewVenue[];
  unavailableCandidates: number;
};

const PAGE_SIZE = 10;
const manifestVenues = (candidatePackage.venues as ManifestVenue[])
  .slice()
  .sort((a, b) => a.name.localeCompare(b.name, "en"));

function normalizedQuery(value: string): string {
  return value.trim().slice(0, 80).toLocaleLowerCase("en");
}

export async function getDeveloperPhotoReviewPage(input: {
  page: number;
  query: string;
}): Promise<DeveloperPhotoReviewPage> {
  await requirePhotoReviewRequest();

  const query = normalizedQuery(input.query);
  const filtered = query
    ? manifestVenues.filter((venue) =>
        `${venue.name} ${venue.slug}`.toLocaleLowerCase("en").includes(query),
      )
    : manifestVenues;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requestedPage = Number.isFinite(input.page) ? Math.floor(input.page) : 1;
  const page = Math.min(pageCount, Math.max(1, requestedPage));
  const pageVenues = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalCandidates = filtered.reduce(
    (sum, venue) => sum + venue.candidates.length,
    0,
  );
  const client = serviceClient();
  if (!client) {
    return {
      page,
      pageCount,
      pageSize: PAGE_SIZE,
      totalVenues: filtered.length,
      totalCandidates,
      query,
      venues: [],
      unavailableCandidates: pageVenues.reduce(
        (sum, venue) => sum + venue.candidates.length,
        0,
      ),
    };
  }

  let unavailableCandidates = 0;
  const venues = await Promise.all(pageVenues.map(async (venue) => {
    const candidates = await Promise.all(venue.candidates.map(async (candidate) => {
      const signed = await client.storage
        .from(OWNER_PHOTO_CANDIDATE_BUCKET)
        .createSignedUrl(candidate.objectPath, 30 * 60);
      if (signed.error || !signed.data?.signedUrl) {
        unavailableCandidates += 1;
        return null;
      }
      return {
        id: candidate.id,
        sourcePageUrl: candidate.sourcePageUrl,
        sourceType: candidate.sourceType,
        width: candidate.width,
        height: candidate.height,
        previewUrl: signed.data.signedUrl,
      } satisfies DeveloperPhotoReviewCandidate;
    }));
    return {
      slug: venue.slug,
      name: venue.name,
      candidates: candidates.filter(
        (candidate): candidate is DeveloperPhotoReviewCandidate => candidate !== null,
      ),
    };
  }));

  return {
    page,
    pageCount,
    pageSize: PAGE_SIZE,
    totalVenues: filtered.length,
    totalCandidates,
    query,
    venues,
    unavailableCandidates,
  };
}
