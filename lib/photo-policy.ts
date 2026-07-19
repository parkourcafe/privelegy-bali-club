// Photo Policy v3 — Interim Pre-Launch Owner Preview (founder decision
// 2026-07-20; full text: docs/photo-policy-v3-interim-prelaunch.md).
//
// Encoded rules:
//  - Audience mode is a SERVER-side switch (env OTHER_BALI_AUDIENCE_MODE).
//    Missing/invalid values fail CLOSED to "tourist_public" (§9) — provisional
//    imagery can never be enabled from the client or by a query param.
//  - Provisional (official-source, not yet owner-approved) photos may render
//    on open pages only in "owner_prelaunch" mode; in tourist mode only
//    owner_approved / editorial_licensed / designed_fallback render (§8).
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

/** Interim bridge while venues carry a single photo_url column with no
 * per-photo status: every photo_url restored by migration 0043 is provisional
 * by definition (it exists precisely because no consent record covers it), so
 * catalogue/detail rendering treats photo_url as an official_provisional_preview
 * candidate. Known limitation, documented in AGENTS.md: an owner-approved
 * photo published through the consent pipeline is also suppressed in
 * tourist_public mode until per-photo statuses are joined into venue reads. */
export function venuePhotoUrlForDisplay(
  photoUrl: string | null | undefined,
  mode: AudienceMode = audienceMode(),
): string | undefined {
  if (!photoUrl) return undefined;
  return provisionalPhotosAllowed(mode) ? photoUrl : undefined;
}
