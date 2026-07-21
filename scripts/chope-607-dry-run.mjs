import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const inputPath = process.argv[2] || "data/data-ops/chope-607/sample-candidates.json";
const outputPath = process.argv[3] || "data/data-ops/chope-607/dry-run-output.json";

const source = JSON.parse(readFileSync(inputPath, "utf8"));
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

const staged = rows.map((row, index) => {
  const normalizedName = String(row.name || "").trim().toLowerCase();
  const slug = slugify(row.slug || row.name);
  const officialUrl = normalizeUrl(row.official_url);
  const instagramUrl = normalizeUrl(row.instagram_url);
  const dedupSignals = {
    normalized_name: normalizedName,
    slug,
    google_place_id: row.google_place_id || null,
    coordinates: row.lat && row.lng ? `${row.lat},${row.lng}` : null,
    address: row.address || null,
    official_url: officialUrl,
    instagram_url: instagramUrl,
    branch_identity: row.branch_identity || null,
    parent_venue: row.parent_venue || null,
  };

  return {
    candidate_id: row.source_id || `chope-sample-${String(index + 1).padStart(3, "0")}`,
    source_hash: hashRow(row),
    source: "chope",
    name: row.name,
    category: row.category || "restaurant",
    district: row.district || "needs_verification",
    slug,
    dedup_signals: dedupSignals,
    candidate_state: "dedup_pending",
    publication_status: "draft",
    verification_status: "verification_pending",
    editorial_status: "editorial_pending",
    seo_status: "hold",
    partner_status: "not_contacted",
    photo_permission_status: "not_granted",
    allowed_actions_after_dedup: ["create_new", "update_existing", "create_branch", "attach_as_child", "hold", "reject"],
    recommended_action: "hold",
    publication_guard: {
      can_insert_as_draft: true,
      can_publish: false,
      reason: "Chope row is a staged candidate only; dedup, verification, editorial QA and photo rights are incomplete.",
    },
  };
});

const counts = staged.reduce((acc, row) => {
  acc.total += 1;
  acc.by_candidate_state[row.candidate_state] = (acc.by_candidate_state[row.candidate_state] || 0) + 1;
  acc.by_publication_status[row.publication_status] = (acc.by_publication_status[row.publication_status] || 0) + 1;
  acc.publishable += row.publication_guard.can_publish ? 1 : 0;
  return acc;
}, { total: 0, publishable: 0, by_candidate_state: {}, by_publication_status: {} });

const output = {
  generated_at: new Date().toISOString(),
  input_path: inputPath,
  source_file_available: Boolean(source.source_file_available),
  limitations: source.source_file_available ? [] : ["Full 607-row Chope source was not available in the repository or inspected Downloads paths; this is a controlled sample dry run."],
  counts,
  staged,
};

writeFileSync(outputPath, JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify(counts));
