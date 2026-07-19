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
  assert.equal(venuePhotoUrlForDisplay("x.jpg", "owner_prelaunch"), "x.jpg");
  assert.equal(venuePhotoUrlForDisplay("x.jpg", "tourist_public"), undefined);
  assert.equal(venuePhotoUrlForDisplay(null, "owner_prelaunch"), undefined);
});
