#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const packArg = process.argv[2];

if (!packArg) {
  console.error("Usage: validate-draft-pack.mjs <venue-pack-directory>");
  process.exit(2);
}

const packDir = path.resolve(packArg);
const requiredFiles = [
  "RUNLOG.md",
  "evidence-pack.md",
  "source-manifest.json",
  "draft-venue-record.json",
  "entity-consistency.json",
  "citation-source-map.json",
  "measurement-plan.json",
];
const errors = [];

for (const filename of requiredFiles) {
  if (!fs.existsSync(path.join(packDir, filename))) {
    errors.push(`missing required file: ${filename}`);
  }
}

if (errors.length > 0) finish();

const runlog = fs.readFileSync(path.join(packDir, "RUNLOG.md"), "utf8");
const evidencePack = fs.readFileSync(
  path.join(packDir, "evidence-pack.md"),
  "utf8",
);
const manifest = readJson("source-manifest.json");
const draft = readJson("draft-venue-record.json");
const entityConsistency = readJson("entity-consistency.json");
const citationSourceMap = readJson("citation-source-map.json");
const measurementPlan = readJson("measurement-plan.json");

for (let phase = 0; phase <= 14; phase += 1) {
  if (!runlog.includes(`## Phase ${phase} `)) {
    errors.push(`RUNLOG.md is missing Phase ${phase}`);
  }
}

if (!evidencePack.includes("Publication:** forbidden")) {
  errors.push("evidence-pack.md must state that publication is forbidden");
}

if (
  draft.forbiddenToPublish !== true ||
  draft.publicationAllowed !== false ||
  draft.readyForImportDryRun !== false ||
  draft.readyToPublish !== false
) {
  errors.push("draft publication/import locks are not all enabled");
}

if (
  manifest.forbiddenToPublish !== true ||
  manifest.publicationAllowed !== false
) {
  errors.push("source manifest publication locks are not enabled");
}

for (const [label, artifact] of [
  ["entity consistency", entityConsistency],
  ["citation source map", citationSourceMap],
  ["measurement plan", measurementPlan],
]) {
  if (
    artifact.forbiddenToPublish !== true ||
    artifact.publicationAllowed !== false
  ) {
    errors.push(`${label} publication locks are not enabled`);
  }
}

if (!Array.isArray(entityConsistency.surfaces)) {
  errors.push("entity-consistency.json surfaces must be an array");
}
if (!Array.isArray(entityConsistency.conflicts)) {
  errors.push("entity-consistency.json conflicts must be an array");
}

if (!nonEmpty(citationSourceMap.measurementState)) {
  errors.push("citation-source-map.json needs a measurementState");
}
for (const field of [
  "queryClusters",
  "observedCitedUrls",
  "sourceGaps",
  "opportunities",
]) {
  if (!Array.isArray(citationSourceMap[field])) {
    errors.push(`citation-source-map.json ${field} must be an array`);
  }
}

if (measurementPlan.paidRunAuthorized !== false) {
  errors.push("measurement-plan.json must not authorize a paid run");
}
if (measurementPlan.promptSetApproved !== false) {
  errors.push("measurement-plan.json prompt set must remain unapproved");
}
if (!nonEmpty(measurementPlan.measurementState)) {
  errors.push("measurement-plan.json needs a measurementState");
}
if (!Array.isArray(measurementPlan.venueSpecificPrompts)) {
  errors.push("measurement-plan.json venueSpecificPrompts must be an array");
} else if (
  measurementPlan.promptSetApproved === false &&
  measurementPlan.venueSpecificPrompts.some((prompt) => prompt?.approved !== false)
) {
  errors.push("every venue-specific prompt must remain unapproved");
}
if (
  citationSourceMap.measurementState === "not_started" &&
  Array.isArray(citationSourceMap.observedCitedUrls) &&
  citationSourceMap.observedCitedUrls.length > 0
) {
  errors.push("citation map cannot contain observed URLs before measurement starts");
}

const sources = Array.isArray(manifest.sources) ? manifest.sources : [];
const sourceIds = new Set();

for (const source of sources) {
  if (!nonEmpty(source?.id)) {
    errors.push("source without a non-empty id");
    continue;
  }
  if (sourceIds.has(source.id)) errors.push(`duplicate source id: ${source.id}`);
  sourceIds.add(source.id);
  if (!validHttpUrl(source.url)) errors.push(`invalid source URL: ${source.id}`);
}

for (const surface of entityConsistency.surfaces ?? []) {
  requireSource(
    surface?.sourceManifestId,
    `entity-consistency surface ${surface?.surface ?? "unknown"}`,
  );
}

const candidate = draft.candidate ?? {};
for (const sourceId of candidate.sourceManifestIds ?? []) {
  requireSource(sourceId, "candidate.sourceManifestIds");
}

for (const action of candidate.actions ?? []) {
  if (action.status !== "draft") {
    errors.push(`action must remain draft: ${action.id ?? "unknown action"}`);
  }
  requireSource(action.sourceManifestId, `action ${action.id ?? "unknown"}`);
  if (!validHttpUrl(action.url)) {
    errors.push(`invalid action URL: ${action.id ?? "unknown action"}`);
  }
}

for (const menu of candidate.menus ?? []) {
  requireSource(menu.sourceManifestId, `menu ${menu.id ?? "unknown"}`);
  if (!nonEmpty(menu.status) || !menu.status.startsWith("draft")) {
    errors.push(`menu must remain draft: ${menu.id ?? "unknown menu"}`);
  }
  if (!Array.isArray(menu.items) || menu.items.length === 0) {
    errors.push(`menu needs captured items: ${menu.id ?? "unknown menu"}`);
  }
}

const fieldEvidence = candidate.fieldEvidence ?? {};
const evidenceRequiredPaths = [
  "name",
  "proposedCategory",
  "district",
  "area",
  "locality",
  "address",
  "officialUrl",
  "instagramUrl",
  "gmapsUrl",
  "cuisine",
  "phone",
  "photoUrl",
  "openingHoursText",
  "opening_hours_json",
  "last_verified_at",
  "editorial.why_its_here",
  "editorial.best_for",
  "editorial.not_for",
  "editorial.price_anchor",
  "editorial.what_to_order",
];

for (const fieldPath of evidenceRequiredPaths) {
  const value = get(candidate, fieldPath);
  const references = fieldEvidence[fieldPath];

  if (!Array.isArray(references)) {
    errors.push(`fieldEvidence entry missing: ${fieldPath}`);
    continue;
  }

  if (hasValue(value) && references.length === 0) {
    errors.push(`non-null field lacks evidence: ${fieldPath}`);
  }

  for (const sourceId of references) {
    requireSource(sourceId, `fieldEvidence.${fieldPath}`);
  }
}

if (!Array.isArray(candidate.blockers) || candidate.blockers.length === 0) {
  errors.push("draft candidate must retain at least one explicit blocker");
}

finish();

function readJson(filename) {
  try {
    return JSON.parse(fs.readFileSync(path.join(packDir, filename), "utf8"));
  } catch (error) {
    errors.push(`${filename} is not valid JSON: ${error.message}`);
    return {};
  }
}

function requireSource(sourceId, context) {
  if (!nonEmpty(sourceId) || !sourceIds.has(sourceId)) {
    errors.push(`unknown source id in ${context}: ${String(sourceId)}`);
  }
}

function get(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], object);
}

function hasValue(value) {
  if (value === null || value === undefined || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validHttpUrl(value) {
  if (!nonEmpty(value)) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function finish() {
  if (errors.length > 0) {
    console.error(`FAIL: ${errors.length} draft-pack issue(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log("PASS: draft pack is structurally safe for operator review");
  process.exit(0);
}
