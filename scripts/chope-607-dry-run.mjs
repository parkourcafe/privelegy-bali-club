import { extname } from "node:path";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const inputPath = process.argv[2] || "data/data-ops/chope-607/sample-candidates.json";
const outputPath = process.argv[3] || "data/data-ops/chope-607/dry-run-output.json";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = "";
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== '\r') {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function readSource(path) {
  const raw = readFileSync(path, "utf8");
  if (extname(path).toLowerCase() === ".csv") {
    const [headers, ...records] = parseCsv(raw).filter((r) => r.some((v) => v.trim() !== ""));
    const rows = records.map((values) => Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""])));
    return {
      provenance: `CSV input: ${path}`,
      source_file_available: true,
      rows,
    };
  }
  return JSON.parse(raw);
}

const source = readSource(inputPath);
const rows = Array.isArray(source.rows) ? source.rows : [];

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function hashRow(row) {
  return createHash("sha256")
    .update(JSON.stringify(row))
    .digest("hex")
    .slice(0, 16);
}

function normalizeUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

function normalizeText(value) {
  const text = String(value || "").trim();
  return text.length > 0 ? text : null;
}

function normalizeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function mapCategory(row) {
  const raw = `${row.category || ""} ${row.directory_tags_raw || ""} ${row.cuisine || ""}`.toLowerCase();
  if (/bar|lounge|cocktail|drinks/.test(raw)) return "bar";
  if (/cafe|coffee|brunch|breakfast/.test(raw)) return "cafe";
  if (/beach club|pool/.test(raw)) return "beach_club";
  return "restaurant";
}

function mapDistrict(row) {
  return slugify(row.district || row.area_inferred || row.address_locality || "needs-verification") || "needs-verification";
}

function candidateStateFor(row, signals) {
  if (!row.name || !signals.dedup_signals.normalized_name) return "hold";
  if (!signals.dedup_signals.slug) return "hold";
  return "dedup_pending";
}

const staged = rows.map((row, index) => {
  const normalizedName = String(row.name || "").trim().toLowerCase();
  const slug = slugify(row.slug || row.name || row.source_directory_name);
  const officialUrl = normalizeUrl(row.official_url || row.website);
  const instagramUrl = normalizeUrl(row.instagram_url || row.instagram);
  const chopeUrl = normalizeUrl(row.chope_url || row.url);
  const lat = normalizeNumber(row.latitude || row.lat);
  const lng = normalizeNumber(row.longitude || row.lng);
  const dedupSignals = {
    normalized_name: normalizedName || null,
    slug,
    google_place_id: normalizeText(row.google_place_id),
    coordinates: lat !== null && lng !== null ? `${lat},${lng}` : null,
    address: normalizeText(row.street_address || row.address),
    official_url: officialUrl,
    instagram_url: instagramUrl,
    branch_identity: normalizeText(row.branch_identity || row.source_directory_name),
    parent_venue: normalizeText(row.parent_venue),
  };

  const skeleton = {
    dedup_signals: dedupSignals,
  };
  const candidateState = candidateStateFor(row, skeleton);

  return {
    candidate_id: row.source_id || `chope-607-${String(index + 1).padStart(3, "0")}`,
    source_hash: hashRow(row),
    source: "chope",
    source_url: chopeUrl,
    name: normalizeText(row.name),
    category: mapCategory(row),
    district: mapDistrict(row),
    proposed_slug: slug,
    candidate_state: candidateState,
    publication_status: "draft",
    verification_status: candidateState === "hold" ? "needs_verification" : "verification_pending",
    editorial_status: "editorial_pending",
    seo_status: "hold",
    partner_status: "not_contacted",
    photo_permission_status: "not_granted",
    dedup_signals: dedupSignals,
    excluded_from_import: {
      chope_rating: row.rating_value || null,
      chope_review_count: row.review_count || null,
      chope_description_present: Boolean(row.description),
      chope_image_present: Boolean(row.image),
      reason: "Ratings, reviews, descriptions and images are not imported into public venue content.",
    },
    allowed_actions_after_dedup: ["create_new", "update_existing", "create_branch", "attach_as_child", "hold", "reject"],
    recommended_action: "hold",
    publication_guard: {
      can_insert_as_draft: candidateState !== "hold",
      can_publish: false,
      reason: "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete.",
    },
  };
});

const counts = staged.reduce((acc, row) => {
  acc.total += 1;
  acc.by_candidate_state[row.candidate_state] = (acc.by_candidate_state[row.candidate_state] || 0) + 1;
  acc.by_publication_status[row.publication_status] = (acc.by_publication_status[row.publication_status] || 0) + 1;
  acc.by_verification_status[row.verification_status] = (acc.by_verification_status[row.verification_status] || 0) + 1;
  acc.by_editorial_status[row.editorial_status] = (acc.by_editorial_status[row.editorial_status] || 0) + 1;
  acc.by_seo_status[row.seo_status] = (acc.by_seo_status[row.seo_status] || 0) + 1;
  acc.by_partner_status[row.partner_status] = (acc.by_partner_status[row.partner_status] || 0) + 1;
  acc.by_photo_permission_status[row.photo_permission_status] = (acc.by_photo_permission_status[row.photo_permission_status] || 0) + 1;
  acc.publishable += row.publication_guard.can_publish ? 1 : 0;
  acc.insertable_as_draft += row.publication_guard.can_insert_as_draft ? 1 : 0;
  return acc;
}, {
  total: 0,
  publishable: 0,
  insertable_as_draft: 0,
  by_candidate_state: {},
  by_publication_status: {},
  by_verification_status: {},
  by_editorial_status: {},
  by_seo_status: {},
  by_partner_status: {},
  by_photo_permission_status: {},
});

const output = {
  generated_at: new Date().toISOString(),
  input_path: inputPath,
  source_file_available: Boolean(source.source_file_available),
  provenance: source.provenance || null,
  guardrails: [
    "No Chope descriptions imported as editorial copy.",
    "No Chope ratings or review counts imported as public quality claims.",
    "No Chope images marked photo-publish-ready.",
    "No candidate auto-published.",
    "Import-ready remains separate from publish-ready.",
  ],
  limitations: source.source_file_available ? [] : ["Full 607-row Chope source was not available; this is a controlled sample dry run."],
  counts,
  staged,
};

writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify(counts));
