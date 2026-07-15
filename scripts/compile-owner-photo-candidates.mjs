import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourcePath = process.argv[2];
const outputPath = process.argv[3] ?? "data/photo-candidates/owner-review.json";

if (!sourcePath) {
  throw new Error("Usage: node scripts/compile-owner-photo-candidates.mjs <source-manifest> [output]");
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right, "en"))
        .map(([key, nested]) => [key, canonical(nested)]),
    );
  }
  return value;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const raw = await readFile(sourcePath);
const source = JSON.parse(raw.toString("utf8"));
const extensions = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

const venues = source.results
  .map((venue) => ({
    slug: venue.slug,
    name: venue.name,
    candidates: venue.selected
      .map((candidate) => {
        const extension = extensions[candidate.mimeType];
        if (!extension) throw new Error(`Unsupported MIME for ${candidate.filePath}`);
        if (candidate.publicDisplayAllowed !== false || candidate.rightsStatus !== "awaiting_owner_consent") {
          throw new Error(`Unsafe rights state for ${candidate.filePath}`);
        }
        return {
          id: candidate.sha256,
          objectPath: `owner-candidates/v1/${venue.slug}/${candidate.sha256}.${extension}`,
          sourceFileName: candidate.fileName,
          sourcePageUrl: candidate.sourcePageUrl,
          sourceImageUrl: candidate.sourceImageUrl,
          sourceType: candidate.sourceType,
          evidence: candidate.evidence,
          sha256: candidate.sha256,
          perceptualHash: candidate.perceptualHash,
          mimeType: candidate.mimeType,
          bytes: candidate.bytes,
          width: candidate.width,
          height: candidate.height,
          rightsStatus: "awaiting_owner_consent",
          publicationAllowed: false,
        };
      })
      .sort((left, right) => left.id.localeCompare(right.id, "en")),
  }))
  .sort((left, right) => left.slug.localeCompare(right.slug, "en"));

const ids = venues.flatMap((venue) => venue.candidates.map((candidate) => candidate.id));
if (new Set(ids).size !== ids.length) throw new Error("Duplicate candidate digest");
if (venues.length !== 343 || ids.length !== 814) {
  throw new Error(`Unexpected denominator: ${venues.length} venues / ${ids.length} images`);
}

const payload = {
  schemaVersion: 1,
  sourceManifestSha256: sha256(raw),
  generatedAt: "2026-07-15T00:00:00.000Z",
  policy: {
    storage: "private",
    ownerConsentRequiredPerImage: true,
    operatorApprovalRequired: true,
    publicationAllowed: false,
    publicVenueCardsChangedByImport: false,
  },
  counts: { venues: venues.length, candidates: ids.length },
  venues,
};

const packageDigest = sha256(JSON.stringify(canonical(payload)));
const output = { ...payload, packageDigest };
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, packageDigest, ...payload.counts }));
