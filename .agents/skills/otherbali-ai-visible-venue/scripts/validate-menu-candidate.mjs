#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { VALIDATION_MODES, validateMenu } from "../../../../scripts/validation-core.mjs";

const candidatePath = process.argv[2];
if (!candidatePath) {
  console.error("Usage: validate-menu-candidate.mjs <menu-implementation-candidate.json>");
  process.exit(2);
}

let artifact;
try {
  artifact = JSON.parse(await readFile(resolve(candidatePath), "utf8"));
} catch (error) {
  console.error(`FAIL: cannot read candidate: ${error.message}`);
  process.exit(1);
}

const errors = [];
if (artifact.forbiddenToPublish !== true) errors.push("forbiddenToPublish must be true");
if (artifact.publicationAllowed !== false) errors.push("publicationAllowed must be false");
if (artifact.readyForImportDryRun !== false) errors.push("readyForImportDryRun must remain false before exact database dedupe");
if (artifact.databaseIdentityState !== "hold_database_dedupe_required") {
  errors.push("databaseIdentityState must retain the dedupe hold");
}
if (!Array.isArray(artifact.menu?.sourceManifestIds) || artifact.menu.sourceManifestIds.length === 0) {
  errors.push("menu.sourceManifestIds must name at least one preserved source");
}

const validation = validateMenu(artifact.menu, 0, { mode: VALIDATION_MODES.IMPORT_DRY_RUN });
errors.push(...validation.errors);

if (errors.length) {
  console.error("FAIL: menu implementation candidate is not safe for review");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const itemCount = artifact.menu.sections.reduce(
  (total, section) => total + section.items.length,
  0,
);
console.log(`PASS: draft ${artifact.menu.completeness} menu candidate has ${artifact.menu.sections.length} sections and ${itemCount} items`);
