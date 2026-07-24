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
  venuePhotoSourceAllowed,
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

test("owner-approved venue photo_url bridge is public in every audience mode", () => {
  assert.equal(venuePhotoUrlForDisplay("x.jpg", "owner_prelaunch"), "x.jpg");
  assert.equal(venuePhotoUrlForDisplay("x.jpg", "tourist_public"), "x.jpg");
  assert.equal(venuePhotoUrlForDisplay(null, "owner_prelaunch"), undefined);
});

test("exact owner-approved venue photo is public without opening provisional media", () => {
  assert.equal(
    venuePhotoUrlForDisplay("approved.jpg", {
      photoStatus: "approved",
      mode: "tourist_public",
    }),
    "approved.jpg",
  );
  assert.equal(
    venuePhotoUrlForDisplay("published.jpg", {
      photoStatus: "published",
      mode: "tourist_public",
    }),
    "published.jpg",
  );
  assert.equal(
    venuePhotoUrlForDisplay("candidate.jpg", {
      photoStatus: "needs_verification",
      mode: "tourist_public",
    }),
    undefined,
  );
  assert.equal(
    venuePhotoUrlForDisplay("candidate.jpg", {
      photoStatus: "needs_verification",
      mode: "owner_prelaunch",
    }),
    "candidate.jpg",
  );
});

test("legacy draft object path requires exact-file rights approval", () => {
  const draft =
    "https://example.supabase.co/storage/v1/object/public/venue-photos/draft/place/photo.jpg";
  const approved =
    "https://example.supabase.co/storage/v1/object/public/owner-photo-candidates/owner-approved/place/photo.jpg";
  assert.equal(venuePhotoSourceAllowed(draft, false), false);
  assert.equal(venuePhotoSourceAllowed(draft, true), true);
  assert.equal(venuePhotoSourceAllowed(approved, false), true);
  assert.equal(venuePhotoSourceAllowed("not a URL", false), true);
});
