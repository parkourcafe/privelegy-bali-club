import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const manifest = JSON.parse(await readFile(
  new URL("../data/photo-candidates/owner-review.json", import.meta.url),
  "utf8",
));
const route = await readFile(
  new URL("../app/api/onboard/photo-candidates/route.ts", import.meta.url),
  "utf8",
);
const page = await readFile(
  new URL("../app/onboard/[token]/OnboardActions.tsx", import.meta.url),
  "utf8",
);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right, "en"))
      .map(([key, nested]) => [key, canonical(nested)]));
  }
  return value;
}

test("owner candidate package is exact, deterministic and publication-blocked", () => {
  const { packageDigest, ...payload } = manifest;
  const digest = createHash("sha256").update(JSON.stringify(canonical(payload))).digest("hex");
  const candidates = manifest.venues.flatMap((venue) => venue.candidates);
  assert.equal(manifest.counts.venues, 343);
  assert.equal(manifest.counts.candidates, 814);
  assert.equal(manifest.venues.length, 343);
  assert.equal(candidates.length, 814);
  assert.equal(new Set(candidates.map((candidate) => candidate.id)).size, 814);
  assert.equal(packageDigest, digest);
  assert.ok(candidates.every((candidate) =>
    candidate.rightsStatus === "awaiting_owner_consent"
    && candidate.publicationAllowed === false
    && candidate.objectPath.startsWith("owner-candidates/v1/")));
  assert.equal(manifest.policy.publicVenueCardsChangedByImport, false);
});

test("owner consent is exact-image, private, same-origin and never publishes", () => {
  assert.match(route, /isTrustedSameOriginMutation\(request\)/);
  assert.match(route, /candidate_mismatch/);
  assert.match(route, /photoContentSha256\(bytes\) !== candidate\.sha256/);
  assert.match(route, /rightsGranted: true/);
  assert.match(route, /publicationAllowed: false/);
  assert.match(route, /pending_review_staged/);
  assert.doesNotMatch(route, /photo_url|published_url/);
  assert.match(page, /Nothing appears publicly until an Other Bali operator approves it/);
  assert.match(page, /each selected photo/);
});
