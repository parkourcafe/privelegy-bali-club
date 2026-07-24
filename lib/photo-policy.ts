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

export type PhotoUsageStatus =
  | "owner_approved"
  | "editorial_licensed"
  | "official_provisional_preview"
  | "designed_fallback"
  | "revoked";

export type VenuePhotoStatus =
  | "missing"
  | "needs_verification"
  | "approved_no_photo"
  | "approved"
  | "published"
  | "rejected";

export interface PhotoCandidate {
  src: string;
  usageStatus: PhotoUsageStatus;
  expiresAt?: string | null;
}

// This legacy project no longer serves its public venue-photos bucket
// (verified 2026-07-25: Storage returns `Bucket not found`). Keep the exact
// approved rows in the consent ledger, but fail closed in public rendering
// until the same file is migrated or a new owner-approved file replaces it.
const DECOMMISSIONED_PHOTO_HOSTS = new Set([
  "xvhxyohqkkpaynrgrvvb.supabase.co",
]);

function isDecommissionedPhotoSource(src: string): boolean {
  try {
    const url = new URL(src, "https://www.otherbali.com");
    return DECOMMISSIONED_PHOTO_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function parseAudienceMode(raw: string | undefined | null): AudienceMode {
  return raw === "owner_prelaunch" ? "owner_prelaunch" : "tourist_public";
}

export function audienceMode(): AudienceMode {
  return parseAudienceMode(process.env.OTHER_BALI_AUDIENCE_MODE);
}

/** Retained for compatibility with the pre-launch policy and preview tooling. */
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

/** Public display bridge for the legacy single-photo venue column. The owner
 * has confirmed publication rights for the existing photo catalogue, so every
 * non-empty URL is displayable on public cards and detail pages. Keep schema
 * selection separate because it requires an explicit rights-state candidate. */
export function venuePhotoUrlForDisplay(
  photoUrl: string | null | undefined,
  options:
    | AudienceMode
    | {
        photoStatus?: VenuePhotoStatus | string | null;
        mode?: AudienceMode;
      } = {},
): string | undefined {
  if (!photoUrl) return undefined;
  if (isDecommissionedPhotoSource(photoUrl)) return undefined;
  // Legacy callers passed only the audience mode after the owner-approved
  // publication decision. Preserve that contract; new data reads pass the
  // object form below so unapproved statuses still fail closed.
  if (typeof options === "string") return photoUrl;
  if (
    (options.photoStatus === "approved" || options.photoStatus === "published")
  ) {
    return photoUrl;
  }
  const mode = options.mode ?? audienceMode();
  return provisionalPhotosAllowed(mode) ? photoUrl : undefined;
}

/** Defense-in-depth for legacy object paths. A `/venue-photos/draft/` URL may
 * render only after the data boundary has confirmed the exact file's rights
 * state. Normal approved bucket URLs are unaffected. */
export function venuePhotoSourceAllowed(
  src: string,
  rightsApproved: boolean,
): boolean {
  try {
    const url = new URL(src, "https://www.otherbali.com");
    if (DECOMMISSIONED_PHOTO_HOSTS.has(url.hostname)) return false;
    const legacyDraft = url.pathname.includes(
      "/storage/v1/object/public/venue-photos/draft/",
    );
    return !legacyDraft || rightsApproved;
  } catch {
    return false;
  }
}
