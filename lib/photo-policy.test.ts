// Photo Policy v3 gates (docs/photo-policy-v3-interim-prelaunch.md):
// fail-closed audience mode, §3 selection priority, provisional exclusion from
// schema imagery, revoked/expired never selected.
import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  parseAudienceMode,
  provisionalPhotosAllowed,
  choosePhotoSrc,
  publicImageForSchema,
  parseVenuePublicMediaUrl,
  resolveVenuePhoto,
  venuePhotoUrlForDisplay,
  type PhotoCandidate,
} from "./photo-policy.ts";

test("audience mode fails closed to tourist_public (§9)", () => {
  assert.equal(parseAudienceMode(undefined), "tourist_public");
  assert.equal(parseAudienceMode(""), "tourist_public");
  assert.equal(parseAudienceMode("garbage"), "tourist_public");
  assert.equal(parseAudienceMode("OWNER_PRELAUNCH"), "tourist_public");
  assert.equal(parseAudienceMode("owner_prelaunch"), "owner_prelaunch");
  assert.equal(provisionalPhotosAllowed("tourist_public"), false);
  assert.equal(provisionalPhotosAllowed("owner_prelaunch"), true);
});

const approved: PhotoCandidate = { src: "a.webp", usageStatus: "owner_approved" };
const licensed: PhotoCandidate = { src: "l.webp", usageStatus: "editorial_licensed" };
const provisional: PhotoCandidate = { src: "p.webp", usageStatus: "official_provisional_preview" };
const revoked: PhotoCandidate = { src: "r.webp", usageStatus: "revoked" };

test("§3 priority: approved beats licensed beats provisional", () => {
  assert.equal(choosePhotoSrc([provisional, licensed, approved], { allowProvisional: true }), "a.webp");
  assert.equal(choosePhotoSrc([provisional, licensed], { allowProvisional: true }), "l.webp");
  assert.equal(choosePhotoSrc([provisional], { allowProvisional: true }), "p.webp");
});

test("provisional hidden in tourist mode; fallback state is null", () => {
  assert.equal(choosePhotoSrc([provisional], { mode: "tourist_public" }), null);
  assert.equal(choosePhotoSrc([], { allowProvisional: true }), null);
});

test("revoked and expired are never selected (§3)", () => {
  assert.equal(choosePhotoSrc([revoked], { allowProvisional: true }), null);
  const expired: PhotoCandidate = {
    src: "e.webp",
    usageStatus: "owner_approved",
    expiresAt: "2020-01-01T00:00:00Z",
  };
  assert.equal(choosePhotoSrc([expired], { allowProvisional: true, now: new Date("2026-07-20") }), null);
});

test("schema/OG image never uses provisional, in any mode (§4)", () => {
  assert.equal(publicImageForSchema([provisional]), null);
  assert.equal(publicImageForSchema([provisional, approved]), "a.webp");
});

test("interim venue photo_url bridge is mode-gated", () => {
  const input = {
    photoUrl: "https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/venue-photos/draft/venue/photo.webp",
    venueStatus: "active",
    publicationStatus: "published",
  };
  assert.equal(venuePhotoUrlForDisplay(input, "owner_prelaunch"), input.photoUrl);
  assert.equal(venuePhotoUrlForDisplay(input, "tourist_public"), input.photoUrl);
  assert.equal(venuePhotoUrlForDisplay({ ...input, photoUrl: null }, "tourist_public"), undefined);
});

test("MEDIA-002 accepts an exact current-project venue URL regardless of draft prefix", () => {
  const photoUrl = "https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/venue-photos/draft/lava/photo.webp";
  assert.deepEqual(parseVenuePublicMediaUrl(photoUrl)?.bucket, "venue-photos");
  assert.deepEqual(resolveVenuePhoto({
    photoUrl,
    venueStatus: "active",
    publicationStatus: "published",
  }), { src: photoUrl, mediaState: "ready" });
});

test("MEDIA-002 never publishes an arbitrary bucket URL or a legacy URL", () => {
  const base = { venueStatus: "active", publicationStatus: "published" };
  assert.equal(resolveVenuePhoto({ ...base, photoUrl: "https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/other-bucket/x.webp" }).mediaState, "blocked");
  assert.equal(resolveVenuePhoto({ ...base, photoUrl: "https://xvhxyohqkkpaynrgrvvb.supabase.co/storage/v1/object/public/venue-photos/draft/x.webp" }).mediaState, "blocked");
});

test("MEDIA-002 requires active published venue context and preserves hard blocks", () => {
  const photoUrl = "https://egkdapqwkfprtyqvvnso.supabase.co/storage/v1/object/public/owner-photo-candidates/draft/x.webp";
  assert.equal(resolveVenuePhoto({ photoUrl, venueStatus: "review", publicationStatus: "published" }).reason, "not_published");
  assert.equal(resolveVenuePhoto({ photoUrl, venueStatus: "active", publicationStatus: "review" }).reason, "not_published");
  assert.equal(resolveVenuePhoto({ photoUrl, venueStatus: "active", publicationStatus: "published", photoStatus: "missing" }).reason, "hard_blocked");
  assert.equal(resolveVenuePhoto({ photoUrl, venueStatus: "active", publicationStatus: "published", photoStatus: "approved_no_photo" }).reason, "hard_blocked");
  assert.equal(resolveVenuePhoto({ photoUrl, venueStatus: "active", publicationStatus: "published", photoStatus: "rejected" }).reason, "hard_blocked");
  assert.equal(resolveVenuePhoto({ photoUrl, venueStatus: "active", publicationStatus: "published", photoStatus: "provisional" }).mediaState, "ready");
});
