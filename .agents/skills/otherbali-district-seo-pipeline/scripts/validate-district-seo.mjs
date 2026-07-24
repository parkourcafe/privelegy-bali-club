#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const folder = path.resolve(process.argv[2] ?? "");
if (!process.argv[2] || !fs.existsSync(folder)) {
  console.error("Usage: validate-district-seo.mjs <district-folder>");
  process.exit(2);
}

const schemas = {
  SOURCE_REGISTRY: ["source_id", "title", "url", "source_type", "publisher", "published_or_updated", "retrieved_at", "evidence_label", "authority", "volatility", "notes"],
  ENTITY_MASTER: ["entity_id", "canonical_name", "entity_type", "admin_parent", "editorial_area", "official_url", "google_maps_url", "google_place_id", "identity_status", "evidence_label", "source_ids", "confidence", "notes"],
  CLAIM_LEDGER: ["claim_id", "page_id", "page_url", "action", "claim_text", "evidence_label", "source_ids", "confidence", "volatility", "allowed_wording", "prohibited_wording", "refresh_requirement", "publication_status"],
  MAPS: ["entity_id", "canonical_name", "maps_url", "google_place_id", "name_match", "address_match", "alias_risk", "status", "notes"],
};

const requiredFiles = [
  "SOURCE_REGISTRY.csv",
  "ENTITY_MASTER.csv",
  "P0_CLAIM_LEDGER.csv",
  "MAPS_MANUAL_CONFIRMATION_QUEUE.csv",
  "UNIFIED_CLUSTER_DECISION_V1.md",
  "P0_CONTENT_BRIEFS.md",
  "PUBLICATION_GATES.md",
];
const allowed = {
  action: new Set(["P0_UPDATE", "P0_CREATE", "P1_UPDATE", "P1_CREATE", "MERGE_INTO_EXISTING", "HOLD", "REJECT"]),
  evidence_label: new Set(["EXTRACTED", "INTERPRETED", "UNVERIFIED"]),
  publication_status: new Set(["READY_FOR_CODEX_DRAFT", "HOLD", "REJECT"]),
  maps_status: new Set(["CONFIRMED", "NEEDS_MANUAL_MAPS_CONFIRMATION", "HOLD_IDENTITY_RECONCILE"]),
};

function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '"' && quoted && text[i + 1] === '"') { cell += '"'; i += 1; }
    else if (char === '"') quoted = !quoted;
    else if (char === "," && !quoted) { row.push(cell); cell = ""; }
    else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cell); if (row.some(Boolean)) rows.push(row); row = []; cell = "";
    } else cell += char;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

const files = fs.readdirSync(folder).filter((name) => name.endsWith(".csv"));
const sourceIds = new Set();
let failures = 0;

for (const suffix of requiredFiles) {
  if (!fs.readdirSync(folder).some((name) => name.endsWith(suffix))) {
    console.error(`missing required artifact *${suffix}`); failures += 1;
  }
}

for (const name of files) {
  const schemaKey = Object.keys(schemas).find((key) => name.includes(key));
  if (!schemaKey) continue;
  const rows = parseCsv(fs.readFileSync(path.join(folder, name), "utf8"));
  const expected = schemas[schemaKey];
  if (JSON.stringify(rows[0]) !== JSON.stringify(expected)) {
    console.error(`${name}: invalid header`); failures += 1; continue;
  }
  const idIndex = 0;
  const seen = new Set();
  for (const row of rows.slice(1)) {
    if (row.length !== expected.length) { console.error(`${name}: invalid column count for ${row[idIndex]}`); failures += 1; continue; }
    const id = row[idIndex];
    if (seen.has(id)) { console.error(`${name}: duplicate ID ${id}`); failures += 1; }
    seen.add(id);
    if (schemaKey === "SOURCE_REGISTRY") sourceIds.add(id);
    const evidenceIndex = expected.indexOf("evidence_label");
    if (evidenceIndex >= 0 && !allowed.evidence_label.has(row[evidenceIndex])) {
      console.error(`${name}: invalid evidence_label for ${id}`); failures += 1;
    }
    if (schemaKey === "CLAIM_LEDGER") {
      const actionIndex = expected.indexOf("action");
      const publicationIndex = expected.indexOf("publication_status");
      if (!allowed.action.has(row[actionIndex])) { console.error(`${name}: invalid action for ${id}`); failures += 1; }
      if (!allowed.publication_status.has(row[publicationIndex])) { console.error(`${name}: invalid publication_status for ${id}`); failures += 1; }
    }
    if (schemaKey === "MAPS") {
      const statusIndex = expected.indexOf("status");
      if (!allowed.maps_status.has(row[statusIndex])) { console.error(`${name}: invalid Maps status for ${id}`); failures += 1; }
    }
  }
}

const claimFile = files.find((name) => name.includes("CLAIM_LEDGER"));
if (claimFile) {
  const rows = parseCsv(fs.readFileSync(path.join(folder, claimFile), "utf8"));
  const sourceIndex = rows[0].indexOf("source_ids");
  for (const row of rows.slice(1)) {
    for (const sourceId of row[sourceIndex].split(";").map((value) => value.trim()).filter(Boolean)) {
      if (!sourceIds.has(sourceId)) { console.error(`${claimFile}: unknown source ${sourceId}`); failures += 1; }
    }
  }
}

if (failures) process.exit(1);
console.log(`Validated ${files.length} CSV files in ${folder}`);
