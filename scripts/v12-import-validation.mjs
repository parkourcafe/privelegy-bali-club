import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

export const ERROR_CLASSES = [
  "source_errors",
  "schema_errors",
  "coordinate_errors",
  "duplicate_errors",
  "action_link_errors",
  "evidence_conflicts",
  "media_errors",
  "import_conflicts",
  "post_import_failures",
];

export const ACTION_TYPES = new Set([
  "booking", "delivery", "website", "instagram", "whatsapp", "directions",
  "grab", "save", "add_to_day", "add_to_trip", "view_details",
]);
const TAXONOMY = {
  categories: new Set(["restaurant", "cafe", "beach_club", "wellness", "activity", "attraction"]),
  districts: new Set(["canggu", "seminyak", "ubud", "uluwatu", "sanur", "nusa_dua", "jimbaran", "kuta"]),
};
const INTERNAL_ACTIONS = new Set(["save", "add_to_day", "add_to_trip", "view_details"]);

function emptyErrors() {
  return Object.fromEntries(ERROR_CLASSES.map((key) => [key, []]));
}
function issue(errors, type, id, message) {
  errors[type].push({ id: id ?? null, message });
}
function https(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const placeholder = host === "example.com" || host.endsWith(".example.com")
      || host === "example.org" || host.endsWith(".example.org")
      || host === "example.net" || host.endsWith(".example.net");
    return url.protocol === "https:" && !url.username && !url.password && !placeholder ? url : null;
  } catch {
    return null;
  }
}
function normalizedName(value) {
  return String(value ?? "").normalize("NFKD").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim();
}
function validCoordinate(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90
    && lng >= -180 && lng <= 180 && !(lat === 0 && lng === 0);
}
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}
export function candidateDigest(candidate) {
  return createHash("sha256").update(JSON.stringify(stable(candidate))).digest("hex");
}

export function validateV12Import(candidate, context = {}) {
  const errors = emptyErrors();
  const warnings = [];
  const places = Array.isArray(candidate?.places) ? candidate.places : [];
  if (!candidate || typeof candidate !== "object" || !Array.isArray(candidate.places)) {
    issue(errors, "schema_errors", null, "root.places must be an array");
  }
  if (!candidate?.packageId || !candidate?.idempotencyKey) {
    issue(errors, "schema_errors", null, "packageId and idempotencyKey are required");
  }

  const seenIds = new Set();
  const entityIndex = [...(context.existingPlaces ?? []), ...places];
  for (const place of places) {
    const id = place?.id;
    if (!id || !place.name || !place.category || !place.district) {
      issue(errors, "schema_errors", id, "place requires id, name, category and district");
      continue;
    }
    if (seenIds.has(id)) issue(errors, "duplicate_errors", id, "duplicate stable place id in package");
    seenIds.add(id);
    if (!TAXONOMY.categories.has(place.category) || !TAXONOMY.districts.has(place.district)) {
      issue(errors, "schema_errors", id, "unsupported category or district taxonomy");
    }
    if (!https(place.sourceUrl)) issue(errors, "source_errors", id, "valid official/evidence HTTPS sourceUrl is required");
    if (!validCoordinate(place.latitude, place.longitude)) {
      issue(errors, "coordinate_errors", id, "route coordinate is missing, zero-island, or out of range");
    } else if (place.coordinateStatus !== "confirmed") {
      issue(errors, "coordinate_errors", id, "route coordinate must be confirmed before import eligibility");
    }

    const peers = entityIndex.filter((peer) => peer.id !== id
      && peer.district === place.district
      && normalizedName(peer.name) === normalizedName(place.name));
    if (peers.length) issue(errors, "duplicate_errors", id, `probable same-district duplicate: ${peers.map((p) => p.id).join(", ")}`);

    const fieldNames = new Map();
    for (const evidence of place.evidence ?? []) {
      if (!evidence.field || !https(evidence.sourceUrl) || !evidence.verifiedAt) {
        issue(errors, "source_errors", id, "each evidence record requires field, HTTPS sourceUrl and verifiedAt");
        continue;
      }
      const values = fieldNames.get(evidence.field) ?? new Set();
      values.add(JSON.stringify(evidence.value));
      fieldNames.set(evidence.field, values);
    }
    for (const [field, values] of fieldNames) {
      if (values.size > 1) issue(errors, "evidence_conflicts", id, `conflicting verified values for ${field}`);
    }

    for (const action of place.actions ?? []) {
      if (!ACTION_TYPES.has(action.actionType)) {
        issue(errors, "schema_errors", id, `unsupported action type: ${action.actionType}`);
        continue;
      }
      if (action.placeId !== id) issue(errors, "action_link_errors", id, "action target placeId does not match owner");
      if (!INTERNAL_ACTIONS.has(action.actionType)) {
        const target = https(action.url);
        if (!target) issue(errors, "action_link_errors", id, `${action.actionType} requires a valid HTTPS target`);
        if (!https(action.sourceUrl)) issue(errors, "source_errors", id, `${action.actionType} requires evidence sourceUrl`);
        if (!action.isOfficial || action.verificationStatus !== "verified") {
          issue(errors, "action_link_errors", id, `${action.actionType} must be official and verified`);
        }
      }
    }

    for (const media of place.media ?? []) {
      if (!https(media.url) || !https(media.sourceUrl)) {
        issue(errors, "media_errors", id, "media and provenance source must be HTTPS");
      }
      if (media.rightsStatus !== "allowed") issue(errors, "media_errors", id, "media rights are not publication-safe");
      if (media.decoderStatus !== "passed") issue(errors, "media_errors", id, "media decoder validation did not pass");
    }
  }

  const digest = candidateDigest(candidate);
  const previous = (context.importLedger ?? {})[candidate?.idempotencyKey];
  if (previous && previous !== digest) {
    issue(errors, "import_conflicts", null, "idempotency key was previously used for different bytes");
  } else if (previous === digest) {
    warnings.push({ id: null, message: "idempotent rerun: identical package already recorded" });
  }

  const errorCount = ERROR_CLASSES.reduce((sum, key) => sum + errors[key].length, 0);
  return {
    architectureVersion: "v1.2",
    mode: "dry-run",
    packageId: candidate?.packageId ?? null,
    packageDigest: digest,
    counts: { places: places.length, errors: errorCount, warnings: warnings.length },
    errors,
    warnings,
    ERROR_STATUS: errorCount ? "BLOCKED" : warnings.length ? "PASS_WITH_WARNINGS" : "PASS",
    IMPORT_STATUS: errorCount ? "NOT_STARTED" : "READY_FOR_OWNER_APPROVAL",
    writesPerformed: false,
  };
}

function csvRows(rows) {
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return ["id,message", ...rows.map((row) => `${escape(row.id)},${escape(row.message)}`)].join("\n") + "\n";
}

export async function writeV12Artifacts(report, root = process.cwd()) {
  const outputs = {
    "reports/import-dry-run.json": JSON.stringify(report, null, 2) + "\n",
    "reports/import-dry-run.md": `# Import dry run\n\n- ERROR_STATUS: ${report.ERROR_STATUS}\n- IMPORT_STATUS: ${report.IMPORT_STATUS}\n- Writes performed: no\n- Package digest: \`${report.packageDigest}\`\n- Errors: ${report.counts.errors}\n- Warnings: ${report.counts.warnings}\n`,
    "data/source-errors.csv": csvRows(report.errors.source_errors),
    "data/duplicate-review.csv": csvRows(report.errors.duplicate_errors),
    "data/action-link-errors.csv": csvRows(report.errors.action_link_errors),
    "data/evidence-conflicts.csv": csvRows(report.errors.evidence_conflicts),
    "data/media-errors.csv": csvRows(report.errors.media_errors),
    "reports/post-import-validation.json": JSON.stringify({
      status: "NOT_RUN",
      reason: "Dry-run only; owner approval and an isolated target are required before import.",
      writesPerformed: false,
    }, null, 2) + "\n",
  };
  for (const [relative, bytes] of Object.entries(outputs)) {
    const path = resolve(root, relative);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, bytes, "utf8");
  }
  return Object.keys(outputs);
}

if (process.argv[1] && import.meta.url === new URL(`file://${resolve(process.argv[1])}`).href) {
  const input = process.argv[2];
  if (!input) throw new Error("Usage: node scripts/v12-import-validation.mjs <candidate.json>");
  const candidate = JSON.parse(await readFile(resolve(input), "utf8"));
  const report = validateV12Import(candidate);
  await writeV12Artifacts(report);
  console.log(JSON.stringify({ ERROR_STATUS: report.ERROR_STATUS, IMPORT_STATUS: report.IMPORT_STATUS, writesPerformed: false }));
  if (report.ERROR_STATUS === "BLOCKED") process.exitCode = 2;
}
