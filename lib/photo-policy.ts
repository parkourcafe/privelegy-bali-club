// Photo Policy v3 — Interim Pre-Launch Owner Preview (founder decision
// 2026-07-20; full text: docs/photo-policy-v3-interim-prelaunch.md).
//
// Encoded rules:
//  - Audience mode is a SERVER-side switch (env OTHER_BALI_AUDIENCE_MODE).
//    Missing/invalid values fail CLOSED to "tourist_public" (§9) — provisional
//    imagery can never be enabled from the client or by a query param.
//  - Existing venue photo_url values are owner-approved for public display per
//    the current owner publication instruction. They may render on open pages
//    in either audience mode. Schema/OG selection remains status-aware.
//  - Provisional photos are NEVER eligible for Open Graph, JSON-LD or sitemap
//    image fields, in any mode (§4) — publicImageForSchema() below.
//  - Selection priority (§3): owner_approved → editorial_licensed →
//    official_provisional_preview (allowed surfaces only) → designed_fallback;
//    revoked/expired/broken never selected.

export type AudienceMode = "owner_prelaunch" | "tourist_public";

export const CURRENT_MEDIA_PROJECT_REF = "egkdapqwkfprtyqvvnso";
export const LEGACY_MEDIA_PROJECT_REF = "xvhxyohqkkpaynrgrvvb";
export const PUBLIC_MEDIA_BUCKETS = ["venue-photos", "owner-photo-candidates"] as const;
export type PublicMediaBucket = (typeof PUBLIC_MEDIA_BUCKETS)[number];

export type VenuePhotoPolicyInput = {
  photoUrl: string | null | undefined;
  venueStatus?: string | null;
  publicationStatus?: string | null;
  photoStatus?: string | null;
};

export type VenuePhotoDecision = {
  src?: string;
  mediaState: "ready" | "blocked";
  reason?:
    | "missing"
    | "not_published"
    | "invalid_url"
    | "hard_blocked";
};

export type PhotoUsageStatus =
  | "owner_approved"
  | "editorial_licensed"
  | "official_provisional_preview"
  | "designed_fallback"
  | "revoked";

export interface PhotoCandidate {
  src: string;
  usageStatus: PhotoUsageStatus;
  expiresAt?: string | null;
}

export function parseAudienceMode(raw: string | undefined | null): AudienceMode {
  return raw === "owner_prelaunch" ? "owner_prelaunch" : "tourist_public";
}

export function audienceMode(): AudienceMode {
  return parseAudienceMode(process.env.OTHER_BALI_AUDIENCE_MODE);
}

const HARD_BLOCKED_MEDIA_STATES = new Set([
  "missing",
  "approved_no_photo",
  "blocked",
  "rejected",
  "removed",
  "archived",
  "revoked",
  "expired",
  "broken",
  "deleted",
]);

function normalized(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

/**
 * Validate a venue-bound public media URL. The URL is accepted only when it
 * points to the current project and an explicitly allowed media bucket. A
 * storage prefix (including `draft/`) is not a publication state.
 */
export function parseVenuePublicMediaUrl(
  photoUrl: string | null | undefined,
): { url: URL; bucket: PublicMediaBucket } | null {
  if (!photoUrl) return null;
  try {
    const url = new URL(photoUrl);
    if (url.hostname === `${LEGACY_MEDIA_PROJECT_REF}.supabase.co`) return null;
    if (url.protocol !== "https:" || url.hostname !== `${CURRENT_MEDIA_PROJECT_REF}.supabase.co`) return null;
    if (url.username || url.password || url.hash) return null;
    const prefix = "/storage/v1/object/public/";
    if (!url.pathname.startsWith(prefix)) return null;
    const remainder = url.pathname.slice(prefix.length);
    const [bucket, ...objectParts] = remainder.split("/");
    if (!PUBLIC_MEDIA_BUCKETS.includes(bucket as PublicMediaBucket) || objectParts.length === 0 || objectParts.join("/") === "") {
      return null;
    }
    return { url, bucket: bucket as PublicMediaBucket };
  } catch {
    return null;
  }
}

/**
 * Resolve the single venue-bound photo carrier for public venue surfaces.
 * MEDIA-002 permits current-project inventory media even when its storage path
 * is `draft/`; the venue publication gate and exact photo_url binding remain
 * mandatory, so this does not publish a bucket by URL knowledge alone.
 */
export function resolveVenuePhoto(
  input: VenuePhotoPolicyInput,
  mode: AudienceMode = audienceMode(),
): VenuePhotoDecision {
  // Retain the mode in this API for future audience-specific surfaces;
  // MEDIA-002 venue-bound authorization applies in both modes.
  void mode;
  if (!input.photoUrl) return { mediaState: "blocked", reason: "missing" };
  if (normalized(input.venueStatus) !== "active" || normalized(input.publicationStatus) !== "published") {
    return { mediaState: "blocked", reason: "not_published" };
  }
  if (HARD_BLOCKED_MEDIA_STATES.has(normalized(input.photoStatus))) {
    return { mediaState: "blocked", reason: "hard_blocked" };
  }
  if (!parseVenuePublicMediaUrl(input.photoUrl)) {
    return { mediaState: "blocked", reason: "invalid_url" };
  }
  return { src: input.photoUrl, mediaState: "ready" };
}

/** May provisional (not-yet-approved official-source) photos render on open
 * public surfaces right now? Server-side answer only. */
export function provisionalPhotosAllowed(mode: AudienceMode = audienceMode()): boolean {
  return mode === "owner_prelaunch";
}

function isExpired(c: PhotoCandidate, now: Date): boolean {
  if (!c.expiresAt) return false;
  const t = Date.parse(c.expiresAt);
  return Number.isFinite(t) && t <= now.getTime();
}

/** §3 priority resolver over candidate photos. Returns the src to render, or
 * null when only the designed fallback should be shown. Revoked and expired
 * candidates are never selected; provisional is selected only when the mode
 * (or an explicitly allowed preview surface) permits it. */
export function choosePhotoSrc(
  candidates: PhotoCandidate[],
  opts: { mode?: AudienceMode; allowProvisional?: boolean; now?: Date } = {},
): string | null {
  const now = opts.now ?? new Date();
  const provisionalOk =
    opts.allowProvisional ?? provisionalPhotosAllowed(opts.mode ?? audienceMode());
  const eligible = candidates.filter(
    (c) => c.usageStatus !== "revoked" && !isExpired(c, now) && c.src,
  );
  const byStatus = (s: PhotoUsageStatus) => eligible.find((c) => c.usageStatus === s);
  return (
    byStatus("owner_approved")?.src ??
    byStatus("editorial_licensed")?.src ??
    (provisionalOk ? byStatus("official_provisional_preview")?.src : undefined) ??
    null
  );
}

/** Image for OG / JSON-LD / sitemap: approved or licensed only — provisional
 * never qualifies regardless of audience mode (§4, §8). */
export function publicImageForSchema(candidates: PhotoCandidate[]): string | null {
  return choosePhotoSrc(candidates, { allowProvisional: false });
}

/** Resolve the venue-bound MEDIA-002 carrier for catalogue/detail surfaces.
 * This is intentionally separate from candidate selection and schema imagery:
 * a current-project URL is public only when its venue is active and published.
 * The storage folder name is not a publication state. */
export function venuePhotoUrlForDisplay(
  input: VenuePhotoPolicyInput,
  mode: AudienceMode = audienceMode(),
): string | undefined {
  return resolveVenuePhoto(input, mode).src;
}
