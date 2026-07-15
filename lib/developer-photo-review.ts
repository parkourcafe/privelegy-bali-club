import "server-only";

import candidatePackage from "@/data/photo-candidates/owner-review.json";
import { getPublishedVenues, type VenueWithPerk } from "@/lib/data";
import { OWNER_PHOTO_CANDIDATE_BUCKET } from "@/lib/owner-photo-candidates";
import { requirePhotoReviewRequest } from "@/lib/photo-review-request-auth";
import { serviceClient } from "@/lib/supabase/service";
import type { VenueCategory, VenueTier } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

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

const PREVIEW_VENUE_COLUMNS = [
  "id",
  "slug",
  "name",
  "category",
  "district",
  "address",
  "tier",
  "status",
  "is_sponsored",
  "vibe_tags",
  "price_anchor",
  "what_to_order",
  "area",
  "why_its_here",
  "best_for",
  "not_for",
  "practical_tags",
  "jobs",
  "owner_note",
  "publication_status",
  "wellness_categories",
].join(",");

const venueCategories = new Set<VenueCategory>([
  "cafe",
  "warung",
  "restaurant",
  "beach_club",
  "fitness",
  "yoga",
  "spa",
  "beauty",
  "bar",
  "surf",
]);
const venueTiers = new Set<VenueTier>(["editorial_seed", "launch", "founding"]);

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function textList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()));
  return items.length > 0 ? items : undefined;
}

function previewVenue(
  manifest: ManifestVenue,
  row: Record<string, unknown> | undefined,
  photoUrl: string | undefined,
): VenueWithPerk {
  const rawCategory = text(row?.category) as VenueCategory;
  const rawTier = text(row?.tier) as VenueTier;
  const wellnessCategories = textList(row?.wellness_categories)?.filter(
    (value): value is VenueCategory => venueCategories.has(value as VenueCategory),
  );
  return {
    id: text(row?.id) || manifest.slug,
    slug: manifest.slug,
    name: text(row?.name) || manifest.name,
    category: venueCategories.has(rawCategory) ? rawCategory : "restaurant",
    district: text(row?.district) || "other-bali",
    address: text(row?.address),
    gmapsUrl: "",
    tier: venueTiers.has(rawTier) ? rawTier : "editorial_seed",
    status: text(row?.status) || "review",
    isSponsored: Boolean(row?.is_sponsored),
    vibeTags: textList(row?.vibe_tags),
    priceAnchor: text(row?.price_anchor) || undefined,
    whatToOrder: text(row?.what_to_order) || undefined,
    photoUrl,
    area: text(row?.area) || undefined,
    whyItsHere: text(row?.why_its_here) || undefined,
    bestFor: text(row?.best_for) || undefined,
    notFor: text(row?.not_for) || undefined,
    practicalTags: textList(row?.practical_tags),
    jobs: textList(row?.jobs),
    ownerNote: text(row?.owner_note) || undefined,
    publicationStatus: row?.publication_status === "published" ? "published" : "review",
    wellnessCategories,
    perk: null,
    blurb: "",
  };
}

async function signedUrlsForPaths(
  client: SupabaseClient,
  paths: string[],
): Promise<Map<string, string>> {
  const signedByPath = new Map<string, string>();
  for (let index = 0; index < paths.length; index += 100) {
    const chunk = paths.slice(index, index + 100);
    const response = await client.storage
      .from(OWNER_PHOTO_CANDIDATE_BUCKET)
      .createSignedUrls(chunk, 30 * 60);
    if (response.error) continue;
    for (const signed of response.data ?? []) {
      if (!signed.error && signed.path && signed.signedUrl) {
        signedByPath.set(signed.path, signed.signedUrl);
      }
    }
  }
  return signedByPath;
}

async function productionRows(client: SupabaseClient): Promise<Map<string, Record<string, unknown>>> {
  const response = await client.from("venues").select(PREVIEW_VENUE_COLUMNS);
  if (response.error || !Array.isArray(response.data)) return new Map();
  return new Map(
    (response.data as unknown as Record<string, unknown>[])
      .map((row) => [text(row.slug), row] as const)
      .filter(([slug]) => Boolean(slug)),
  );
}

export type DeveloperPhotoSiteCatalogue = {
  venues: VenueWithPerk[];
  totalCandidates: number;
  venuesWithCandidates: number;
  venuesWithoutCandidates: number;
  unavailableCovers: number;
};

export async function getDeveloperPhotoSiteCatalogue(): Promise<DeveloperPhotoSiteCatalogue> {
  await requirePhotoReviewRequest();
  const client = serviceClient();
  const publishedVenues = await getPublishedVenues();
  const manifestBySlug = new Map(manifestVenues.map((venue) => [venue.slug, venue] as const));
  const venuesWithCandidates = publishedVenues.filter(
    (venue) => (manifestBySlug.get(venue.slug)?.candidates.length ?? 0) > 0,
  ).length;
  const venuesWithoutCandidates = publishedVenues.length - venuesWithCandidates;
  if (!client) {
    return {
      venues: publishedVenues,
      totalCandidates: manifestVenues.reduce((sum, venue) => sum + venue.candidates.length, 0),
      venuesWithCandidates,
      venuesWithoutCandidates,
      unavailableCovers: venuesWithCandidates,
    };
  }

  const coverPaths = publishedVenues
    .map((venue) => manifestBySlug.get(venue.slug)?.candidates[0]?.objectPath)
    .filter((path): path is string => Boolean(path));
  const signedByPath = await signedUrlsForPaths(client, coverPaths);
  let unavailableCovers = 0;
  const venues = publishedVenues.map((venue) => {
    const manifest = manifestBySlug.get(venue.slug);
    const coverPath = manifest?.candidates[0]?.objectPath;
    const photoUrl = coverPath ? signedByPath.get(coverPath) : undefined;
    if (coverPath && !photoUrl) unavailableCovers += 1;
    return photoUrl ? { ...venue, photoUrl } : venue;
  });
  return {
    venues,
    totalCandidates: manifestVenues.reduce((sum, venue) => sum + venue.candidates.length, 0),
    venuesWithCandidates,
    venuesWithoutCandidates,
    unavailableCovers,
  };
}

export type DeveloperPhotoSiteVenue = {
  venue: VenueWithPerk;
  candidates: DeveloperPhotoReviewCandidate[];
};

export async function getDeveloperPhotoSiteVenue(
  slug: string,
): Promise<DeveloperPhotoSiteVenue | null> {
  await requirePhotoReviewRequest();
  const manifest = manifestVenues.find((venue) => venue.slug === slug);
  if (!manifest) return null;
  const client = serviceClient();
  if (!client) return null;
  const [rows, signedByPath] = await Promise.all([
    productionRows(client),
    signedUrlsForPaths(client, manifest.candidates.map((candidate) => candidate.objectPath)),
  ]);
  const candidates = manifest.candidates.flatMap((candidate) => {
    const previewUrl = signedByPath.get(candidate.objectPath);
    return previewUrl ? [{
      id: candidate.id,
      sourcePageUrl: candidate.sourcePageUrl,
      sourceType: candidate.sourceType,
      width: candidate.width,
      height: candidate.height,
      previewUrl,
    }] : [];
  });
  return {
    venue: previewVenue(manifest, rows.get(manifest.slug), candidates[0]?.previewUrl),
    candidates,
  };
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
