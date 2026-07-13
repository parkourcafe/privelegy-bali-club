import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import {
  VALIDATION_MODES,
  classifyActionKind,
  normalizeActionProvider,
  validHttps,
  validateCapability,
  validateMenu,
} from "./validation-core.mjs";

export const DATA_OPS_COMPILER_VERSION = 1;
export const DATA_OPS_EXPECTED_INPUT_FILE_COUNT = 53;

const CANDIDATE_ELIGIBLE_SOURCE_OUTCOMES = new Set([
  "partial",
  "usable",
  "usable_with_caveat",
]);

function canonicalJsonValue(value) {
  if (Array.isArray(value)) return value.map(canonicalJsonValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort(compareText).map((key) => [key, canonicalJsonValue(value[key])])
    );
  }
  return value;
}

export function computeDataOpsPackageDigest(candidate) {
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("Compiled candidate must be an object before its digest can be computed");
  }
  const payload = { ...candidate };
  delete payload.packageDigest;
  return createHash("sha256").update(JSON.stringify(canonicalJsonValue(payload))).digest("hex");
}

export function serializeDataOpsCandidates(candidate) {
  return `${JSON.stringify(candidate, null, 2)}\n`;
}

function hashId(prefix, ...parts) {
  const digest = createHash("sha256").update(parts.join("\0")).digest("hex").slice(0, 24);
  return `${prefix}-${digest}`;
}

function compareText(left, right) {
  return String(left ?? "").localeCompare(String(right ?? ""), "en");
}

function sortBy(array, selector) {
  return [...array].sort((left, right) => compareText(selector(left), selector(right)));
}

function text(value) {
  if (value == null) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function stringArray(value) {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function sourceFreshnessErrors(rawSource) {
  const outcome = text(rawSource.outcome)?.toLowerCase() ?? "";
  const label = text(rawSource.label)?.toLowerCase() ?? "";
  const notes = text(rawSource.notes)?.toLowerCase() ?? "";
  const errors = [];
  if (!CANDIDATE_ELIGIBLE_SOURCE_OUTCOMES.has(outcome)) {
    errors.push("source_outcome_not_candidate_eligible");
  }
  if (
    /(^|_)(stale|recheck)(_|$)/.test(outcome) ||
    label.includes("stale-dated") ||
    notes.includes("freshness recheck required") ||
    notes.includes("stale/current mismatch blocks import") ||
    notes.includes("official-linked 2019 menu is stale")
  ) {
    errors.push("source_freshness_recheck_required");
  }
  return uniqueSorted(errors);
}

function timestamp(value) {
  return typeof value === "string" && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : value ?? null;
}

function uniqueSorted(values) {
  return [...new Set(values.filter((value) => value != null))].sort(compareText);
}

function countBy(values) {
  return Object.fromEntries(
    [...values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map()).entries()]
      .sort(([left], [right]) => compareText(left, right))
  );
}

function setDifference(left, right) {
  return [...left].filter((value) => !right.has(value)).sort(compareText);
}

function assertEqualSets(label, left, right) {
  const missing = setDifference(left, right);
  const extra = setDifference(right, left);
  if (missing.length || extra.length) {
    throw new Error(`${label} denominator mismatch: missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
}

function duplicateValues(values) {
  return Object.entries(countBy(values)).filter(([, count]) => count > 1).map(([value]) => value).sort(compareText);
}

function assertNonEmptyUniqueStrings(values, label) {
  if (!Array.isArray(values) || values.length === 0 || values.some((value) => !text(value))) {
    throw new Error(`${label} must be a non-empty string array`);
  }
  const duplicates = duplicateValues(values);
  if (duplicates.length) throw new Error(`${label} contains duplicates: ${JSON.stringify(duplicates)}`);
}

function sameStringSet(left, right) {
  const leftValues = uniqueSorted(left);
  const rightValues = uniqueSorted(right);
  return leftValues.length === rightValues.length && leftValues.every((value, index) => value === rightValues[index]);
}

export function assertCompiledDataOpsIntegrity(candidateCollections, sourceRecords, rejectionRecords) {
  const menus = candidateCollections?.menus;
  const capabilities = candidateCollections?.capabilities;
  const venueMapsCandidates = candidateCollections?.venueMapsCandidates;
  if (!Array.isArray(menus) || !Array.isArray(capabilities) || !Array.isArray(venueMapsCandidates)) {
    throw new Error("Compiled integrity requires menu, capability and venue-map arrays");
  }
  if (!Array.isArray(sourceRecords) || !Array.isArray(rejectionRecords)) {
    throw new Error("Compiled integrity requires source and rejection arrays");
  }

  const candidateRecords = [
    ...menus.map((record) => ({ entityType: "menu", record })),
    ...capabilities.map((record) => ({ entityType: "capability", record })),
    ...venueMapsCandidates.map((record) => ({ entityType: "venue_map", record })),
  ];
  const idEntries = [
    ...sourceRecords.map((record) => ({ id: record.id, label: "source" })),
    ...rejectionRecords.map((record) => ({ id: record.id, label: "rejection" })),
    ...candidateRecords.map(({ entityType, record }) => ({ id: record.id, label: entityType })),
    ...menus.flatMap((menu) => menu.sections.flatMap((section) => [
      { id: section.id, label: "menu_section" },
      ...section.items.map((item) => ({ id: item.id, label: "menu_item" })),
    ])),
  ];
  const missingIds = idEntries.filter(({ id }) => !text(id));
  if (missingIds.length) throw new Error(`Compiled records are missing IDs: ${JSON.stringify(missingIds)}`);
  const duplicateIds = duplicateValues(idEntries.map(({ id }) => id));
  if (duplicateIds.length) throw new Error(`Compiled IDs are not globally unique: ${JSON.stringify(duplicateIds)}`);

  const sourceById = new Map(sourceRecords.map((source) => [source.id, source]));
  const rejectedInputRefs = new Set(rejectionRecords.map((rejection) =>
    `${rejection.entityType}\0${rejection.packageId}\0${rejection.venueSlug}\0${rejection.inputId}`
  ));
  const candidateInputRefs = [];
  let sourceLinks = 0;
  for (const { entityType, record } of candidateRecords) {
    if (record.version !== 1) throw new Error(`Initial Data Ops candidate ${record.id} must use version 1`);
    const provenance = record.provenance;
    if (!provenance || typeof provenance !== "object") throw new Error(`Candidate ${record.id} is missing provenance`);
    for (const field of ["packageIds", "inputIds", "sourceIds", "originalSourceIds"]) {
      assertNonEmptyUniqueStrings(provenance[field], `Candidate ${record.id} provenance.${field}`);
    }
    const linkedSources = provenance.sourceIds.map((sourceId) => sourceById.get(sourceId));
    if (linkedSources.some((source) => !source)) {
      const missing = provenance.sourceIds.filter((sourceId) => !sourceById.has(sourceId));
      throw new Error(`Candidate ${record.id} has missing source links: ${JSON.stringify(missing)}`);
    }
    const invalidSources = linkedSources.filter((source) => !source.validForCandidate);
    if (invalidSources.length) {
      throw new Error(`Candidate ${record.id} links quarantined sources: ${JSON.stringify(invalidSources.map((source) => source.id))}`);
    }
    if (linkedSources.some((source) => source.venueSlug !== record.venueSlug)) {
      throw new Error(`Candidate ${record.id} links a source from another venue`);
    }
    if (!sameStringSet(provenance.packageIds, linkedSources.map((source) => source.packageId))) {
      throw new Error(`Candidate ${record.id} provenance package/source linkage is inconsistent`);
    }
    if (!sameStringSet(provenance.originalSourceIds, linkedSources.map((source) => source.originalId))) {
      throw new Error(`Candidate ${record.id} provenance original/canonical source linkage is inconsistent`);
    }
    if (!linkedSources.some((source) =>
      source.url === record.sourceUrl && source.label === record.sourceLabel && source.capturedAt === record.capturedAt
    )) {
      throw new Error(`Candidate ${record.id} evidence fields do not match a linked source record`);
    }
    sourceLinks += linkedSources.length;
    for (const packageId of provenance.packageIds) {
      for (const inputId of provenance.inputIds) {
        const ref = `${entityType}\0${packageId}\0${record.venueSlug}\0${inputId}`;
        if (rejectedInputRefs.has(ref)) {
          throw new Error(`Candidate ${record.id} provenance input also appears in rejections: ${ref.replaceAll("\0", ":")}`);
        }
        candidateInputRefs.push(ref);
      }
    }
  }
  const duplicateInputRefs = duplicateValues(candidateInputRefs);
  if (duplicateInputRefs.length) {
    throw new Error(`Compiled candidate provenance input refs are not unique: ${JSON.stringify(duplicateInputRefs)}`);
  }

  return {
    globallyUniqueIds: true,
    candidateIds: candidateRecords.length,
    nestedMenuIds: menus.reduce((total, menu) => total + menu.sections.length + menu.sections.reduce((sum, section) => sum + section.items.length, 0), 0),
    sourceIds: sourceRecords.length,
    rejectionIds: rejectionRecords.length,
    provenanceInputRefs: candidateInputRefs.length,
    linkedValidSourceRefs: sourceLinks,
    rejectedInputRefsExcluded: true,
    initialVersionOneOnly: true,
  };
}

function defaultPriority(kind) {
  return {
    reserve: 20,
    delivery: 30,
    takeaway: 40,
    preorder: 50,
    whatsapp: 80,
    website: 90,
    maps: 100,
  }[kind] ?? 100;
}

function canonicalUrl(value) {
  try {
    return new URL(value).toString();
  } catch {
    return value;
  }
}

function sourceLookupKey(packageId, venueSlug, sourceId) {
  return `${packageId}\0${venueSlug}\0${sourceId}`;
}

function rawEntityId(entity, fallback) {
  return text(entity?.id) ?? fallback;
}

function cleanMenuPart({ rawMenu, venue, packageId, source }) {
  const venueSlug = venue.venueSlug;
  const rawId = rawEntityId(rawMenu, `menu-${venueSlug}`);
  const sections = [];
  for (const rawSection of rawMenu.sections ?? []) {
    const items = [];
    for (const rawItem of rawSection.items ?? []) {
      items.push({
        id: hashId("item", packageId, venueSlug, rawId, rawEntityId(rawItem, String(items.length))),
        name: text(rawItem.name) ?? "",
        description: text(rawItem.description),
        priceMinor: rawItem.priceMinor ?? null,
        currency: text(rawItem.currency)?.toUpperCase() ?? null,
        sourceDisplayPrice: text(rawItem.sourceDisplayPrice),
        priceText: text(rawItem.sourceDisplayPrice),
        dietaryTags: stringArray(rawItem.dietaryTags),
        verifiedAllergenTags: stringArray(rawItem.verifiedAllergenTags),
        partnerRecommended: rawItem.partnerRecommended === true,
        editorialPick: false,
        editorialNote: null,
        availabilityNote: text(rawItem.availabilityNote),
        position: items.length,
      });
    }
    if (items.length === 0) continue;
    sections.push({
      id: hashId("section", packageId, venueSlug, rawId, rawEntityId(rawSection, String(sections.length))),
      name: text(rawSection.name) ?? "Menu",
      description: text(rawSection.description),
      position: sections.length,
      items,
    });
  }

  return {
    id: hashId("menu-part", packageId, venueSlug, rawId),
    venueSlug,
    title: text(rawMenu.title) ?? `${venue.name} Menu`,
    version: 1,
    status: "draft",
    sourceUrl: source.url,
    sourceLabel: source.label,
    capturedAt: source.capturedAt,
    verifiedAt: null,
    expiresAt: timestamp(rawMenu.expiresAt),
    sections,
    provenance: {
      packageId,
      inputIds: [rawId],
      sourceIds: [source.id],
      originalSourceIds: [source.originalId],
      collectionNotes: stringArray(rawMenu.collectionNotes),
    },
  };
}

function mergeMenuParts(parts, venue) {
  const ordered = sortBy(parts, (part) => `${part.title}\0${part.id}`);
  const primary = [...ordered].sort((left, right) => {
    const captured = Date.parse(right.capturedAt) - Date.parse(left.capturedAt);
    return captured || compareText(left.provenance.sourceIds[0], right.provenance.sourceIds[0]);
  })[0];
  const sections = ordered.flatMap((part) => part.sections).map((section, index) => ({
    ...section,
    id: hashId("section", venue.venueSlug, "compiled", String(index), section.id),
    position: index,
    items: section.items.map((item, itemIndex) => ({
      ...item,
      id: hashId("item", venue.venueSlug, "compiled", String(index), String(itemIndex), item.id),
      position: itemIndex,
    })),
  }));
  const inputIds = uniqueSorted(ordered.flatMap((part) => part.provenance.inputIds));
  const sourceIds = uniqueSorted(ordered.flatMap((part) => part.provenance.sourceIds));
  const originalSourceIds = uniqueSorted(ordered.flatMap((part) => part.provenance.originalSourceIds));
  return {
    id: hashId("menu", venue.venueSlug, ...inputIds),
    venueSlug: venue.venueSlug,
    title: ordered.length === 1 ? ordered[0].title : `${venue.name} Menus`,
    version: 1,
    status: "draft",
    sourceUrl: primary.sourceUrl,
    sourceLabel: primary.sourceLabel,
    capturedAt: primary.capturedAt,
    verifiedAt: null,
    expiresAt: ordered.length === 1 ? ordered[0].expiresAt : null,
    sections,
    provenance: {
      packageIds: uniqueSorted(ordered.map((part) => part.provenance.packageId)),
      inputIds,
      sourceIds,
      originalSourceIds,
      collectionNotes: uniqueSorted(ordered.flatMap((part) => part.provenance.collectionNotes)),
    },
  };
}

function asVenueRecord(rawVenue, packageRecord) {
  return {
    packageId: packageRecord.packageId,
    packageType: packageRecord.packageType,
    district: text(rawVenue.district) ?? text(packageRecord.evidence.district),
    name: text(rawVenue.venueName) ?? text(rawVenue.name) ?? text(rawVenue.venueSlug) ?? text(rawVenue.slug),
    venueSlug: text(rawVenue.venueSlug) ?? text(rawVenue.slug),
    raw: rawVenue,
  };
}

export async function loadDataOpsInputs(repoRoot = process.cwd()) {
  const root = resolve(repoRoot);
  const trackedFiles = [];
  async function load(relativePath) {
    const absolutePath = join(root, relativePath);
    const raw = await readFile(absolutePath, "utf8");
    trackedFiles.push({ path: relativePath, raw });
    return JSON.parse(raw);
  }

  const batchRoot = join(root, "data/data-ops/batches");
  const batchDirectories = (await readdir(batchRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(compareText);
  const packages = [];
  for (const directory of batchDirectories) {
    const evidence = await load(`data/data-ops/batches/${directory}/evidence.json`);
    const manifest = await load(`data/data-ops/batches/${directory}/source-manifest.json`);
    packages.push({
      packageId: text(evidence.batchId) ?? directory,
      packageType: "batch",
      evidence,
      manifest,
    });
  }

  const waveEvidence = await load("data/data-ops/wave-1/venues.json");
  const waveManifest = await load("data/data-ops/wave-1/source-manifest.json");
  packages.unshift({
    packageId: "canggu-wave-1",
    packageType: "wave",
    evidence: waveEvidence,
    manifest: waveManifest,
  });

  const ledger = await load("data/data-ops/coverage/coverage-ledger.json");
  const registry = await load("data/data-ops/coverage/canonical-venue-registry.json");
  const queue = await load("data/data-ops/coverage/resumable-queue.json");
  const digest = createHash("sha256");
  for (const file of sortBy(trackedFiles, (record) => record.path)) {
    digest.update(file.path).update("\0").update(file.raw).update("\0");
  }
  return {
    root,
    packages,
    ledger,
    registry,
    queue,
    inputDigest: digest.digest("hex"),
    inputFiles: sortBy(trackedFiles.map((file) => file.path), (path) => path),
  };
}

export function compileDataOps(inputs) {
  const packages = sortBy(inputs.packages, (record) => record.packageId);
  if (inputs.queue.currentBatchId != null) throw new Error("Data Ops queue is not closed: currentBatchId must be null");
  const incompleteBatches = (inputs.queue.batches ?? []).filter((batch) => batch.status !== "complete");
  if (incompleteBatches.length) throw new Error(`Data Ops queue has incomplete batches: ${incompleteBatches.map((batch) => batch.batchId).join(", ")}`);

  const venueRecords = packages.flatMap((packageRecord) =>
    (packageRecord.evidence.venues ?? []).map((rawVenue) => asVenueRecord(rawVenue, packageRecord))
  );
  const packageSlugs = venueRecords.map((venue) => venue.venueSlug);
  if (packageSlugs.some((slug) => !slug)) throw new Error("A Data Ops venue is missing its canonical slug");
  const duplicateVenueSlugs = Object.entries(countBy(packageSlugs)).filter(([, count]) => count > 1);
  if (duplicateVenueSlugs.length) throw new Error(`Duplicate Data Ops venues: ${JSON.stringify(duplicateVenueSlugs)}`);

  const ledgerMap = new Map((inputs.ledger.venues ?? []).map((venue) => [venue.slug, venue]));
  const registryMap = new Map((inputs.registry.venues ?? []).map((venue) => [venue.slug, venue]));
  const packageSet = new Set(packageSlugs);
  assertEqualSets("coverage-ledger/package", new Set(ledgerMap.keys()), packageSet);
  assertEqualSets("canonical-registry/package", new Set(registryMap.keys()), packageSet);

  const sourceRecords = [];
  const sourceMap = new Map();
  const originalSourceGroups = new Map();
  for (const packageRecord of packages) {
    for (const rawSource of packageRecord.manifest.sources ?? []) {
      const originalId = text(rawSource.id);
      const venueSlug = text(rawSource.venueSlug);
      if (!originalId || !venueSlug) throw new Error(`Malformed source in ${packageRecord.packageId}`);
      const key = sourceLookupKey(packageRecord.packageId, venueSlug, originalId);
      if (sourceMap.has(key)) throw new Error(`Duplicate source mapping within package: ${key}`);
      const errors = [];
      if (!validHttps(rawSource.url)) errors.push("source_url_not_https");
      if (!text(rawSource.label)) errors.push("source_label_missing");
      if (!Number.isFinite(Date.parse(rawSource.capturedAt ?? ""))) errors.push("source_captured_at_invalid");
      if (rawSource.verifiedAt != null) errors.push("source_verification_not_accepted_from_data_ops");
      errors.push(...sourceFreshnessErrors(rawSource));
      const uniqueErrors = uniqueSorted(errors);
      const source = {
        id: hashId("source", packageRecord.packageId, venueSlug, originalId),
        originalId,
        packageId: packageRecord.packageId,
        venueSlug,
        url: rawSource.url,
        label: text(rawSource.label) ?? "",
        capturedAt: timestamp(rawSource.capturedAt),
        verifiedAt: null,
        sourceType: text(rawSource.sourceType),
        officialControl: text(rawSource.officialControl),
        outcome: text(rawSource.outcome),
        notes: text(rawSource.notes),
        candidateState: uniqueErrors.length === 0 ? "eligible" : "quarantined",
        freshnessState: uniqueErrors.includes("source_freshness_recheck_required") ? "quarantined" : "eligible",
        validForCandidate: uniqueErrors.length === 0,
        errors: uniqueErrors,
      };
      sourceMap.set(key, source);
      sourceRecords.push(source);
      const group = originalSourceGroups.get(originalId) ?? [];
      group.push(source);
      originalSourceGroups.set(originalId, group);
    }
  }
  const sourceIdCollisions = [...originalSourceGroups.entries()]
    .filter(([, records]) => records.length > 1)
    .map(([originalId, records]) => ({
      originalId,
      canonicalIds: sortBy(records.map((record) => record.id), (value) => value),
      venues: uniqueSorted(records.map((record) => record.venueSlug)),
    }))
    .sort((left, right) => compareText(left.originalId, right.originalId));

  const rejections = [];
  const classifications = [];
  let sourceReferencesTotal = 0;
  let sourceReferencesMatched = 0;
  let actionDuplicatesMerged = 0;
  let venueMapDuplicatesMerged = 0;
  function reject(entityType, venue, inputId, reasons, details = {}) {
    const normalizedReasons = uniqueSorted(reasons);
    rejections.push({
      id: hashId("rejection", entityType, venue.packageId, venue.venueSlug, inputId, normalizedReasons.join("|")),
      entityType,
      packageId: venue.packageId,
      venueSlug: venue.venueSlug,
      inputId,
      reasons: normalizedReasons,
      ...details,
    });
  }
  function findSource(venue, rawEntity) {
    sourceReferencesTotal += 1;
    const originalId = text(rawEntity.sourceManifestId);
    if (!originalId) return null;
    const source = sourceMap.get(sourceLookupKey(venue.packageId, venue.venueSlug, originalId)) ?? null;
    if (source) sourceReferencesMatched += 1;
    return source;
  }

  const menuCandidates = [];
  const validRawActions = [];
  const validRawVenueMaps = [];
  for (const venue of venueRecords) {
    const ledgerVenue = ledgerMap.get(venue.venueSlug);
    const researchBlocked = ledgerVenue.researchStatus === "blocked" || ledgerVenue.blocked === true;
    const menuParts = [];
    for (const [menuIndex, rawMenu] of (venue.raw.menus ?? []).entries()) {
      const inputId = rawEntityId(rawMenu, `menu-${menuIndex}`);
      const source = findSource(venue, rawMenu);
      const reasons = [];
      if (researchBlocked) reasons.push("venue_blocked");
      if (!source) reasons.push("source_mapping_missing");
      else if (!source.validForCandidate) reasons.push(...source.errors);
      if (rawMenu.version != null && rawMenu.version !== 1) reasons.push("initial_version_must_equal_1");
      if (rawMenu.verifiedAt != null || venue.raw.verifiedAt != null) reasons.push("data_ops_verification_must_remain_null");
      const itemCount = (rawMenu.sections ?? []).reduce((total, section) => total + (section.items?.length ?? 0), 0);
      if (itemCount === 0) reasons.push("empty_menu_placeholder");
      if (reasons.length) {
        reject("menu", venue, inputId, reasons);
        continue;
      }
      const part = cleanMenuPart({ rawMenu, venue, packageId: venue.packageId, source });
      const result = validateMenu(part, menuIndex, { mode: VALIDATION_MODES.IMPORT_DRY_RUN });
      if (result.errors.length) reject("menu", venue, inputId, result.errors.map((error) => `validation:${error}`));
      else menuParts.push(part);
    }
    if (menuParts.length) {
      const candidate = mergeMenuParts(menuParts, venue);
      const result = validateMenu(candidate, menuCandidates.length, { mode: VALIDATION_MODES.IMPORT_DRY_RUN });
      if (result.errors.length) reject("menu", venue, candidate.id, result.errors.map((error) => `validation:${error}`));
      else menuCandidates.push(candidate);
    }

    for (const [actionIndex, rawAction] of (venue.raw.actions ?? []).entries()) {
      const inputId = rawEntityId(rawAction, `action-${actionIndex}`);
      const source = findSource(venue, rawAction);
      const provider = normalizeActionProvider(rawAction.provider);
      const classification = classifyActionKind(rawAction.kind, rawAction);
      classifications.push(classification.classification);
      const reasons = [];
      if (researchBlocked) reasons.push("venue_blocked");
      if (!source) reasons.push("source_mapping_missing");
      else if (!source.validForCandidate) reasons.push(...source.errors);
      if (!provider) reasons.push("unsupported_provider");
      if (!classification.kind) reasons.push(classification.classification);
      if (!validHttps(rawAction.url)) reasons.push("action_url_not_https");
      if (rawAction.version != null && rawAction.version !== 1) reasons.push("initial_version_must_equal_1");
      if (rawAction.verifiedAt != null || venue.raw.verifiedAt != null) reasons.push("data_ops_verification_must_remain_null");
      if (reasons.length) {
        reject("capability", venue, inputId, reasons, { rawKind: rawAction.kind ?? null, rawProvider: rawAction.provider ?? null });
        continue;
      }
      const candidate = {
        id: hashId("capability", venue.packageId, venue.venueSlug, inputId),
        venueSlug: venue.venueSlug,
        kind: classification.kind,
        provider,
        version: 1,
        url: canonicalUrl(rawAction.url),
        label: text(rawAction.label),
        status: "draft",
        priority: Number.isInteger(rawAction.priority) && rawAction.priority >= 0 ? rawAction.priority : defaultPriority(classification.kind),
        confirmationRequired: typeof rawAction.confirmationRequired === "boolean"
          ? rawAction.confirmationRequired
          : !["website", "maps"].includes(classification.kind),
        sourceUrl: source.url,
        sourceLabel: source.label,
        capturedAt: source.capturedAt,
        verifiedAt: null,
        expiresAt: timestamp(rawAction.expiresAt),
        provenance: {
          packageIds: [venue.packageId],
          inputIds: [inputId],
          sourceIds: [source.id],
          originalSourceIds: [source.originalId],
          classification: classification.classification,
          evidenceNotes: stringArray([rawAction.evidenceNote]),
        },
      };
      const result = validateCapability(candidate, actionIndex, { mode: VALIDATION_MODES.IMPORT_DRY_RUN });
      if (result.errors.length) {
        reject("capability", venue, inputId, result.errors.map((error) => `validation:${error}`), {
          rawKind: rawAction.kind ?? null,
          rawProvider: rawAction.provider ?? null,
        });
      } else if (candidate.kind === "maps") {
        validRawVenueMaps.push({
          candidate: {
            ...candidate,
            targetField: "venues.gmaps_url",
            canonicalActionType: "directions",
          },
          venue,
        });
      } else {
        validRawActions.push({ candidate, venue });
      }
    }
  }

  const capabilities = [];
  const actionGroups = new Map();
  for (const record of validRawActions) {
    const key = `${record.candidate.venueSlug}\0${record.candidate.kind}\0${record.candidate.provider}`;
    const group = actionGroups.get(key) ?? [];
    group.push(record);
    actionGroups.set(key, group);
  }
  for (const [key, group] of [...actionGroups.entries()].sort(([left], [right]) => compareText(left, right))) {
    const ordered = sortBy(group, (record) => `${record.candidate.url}\0${record.candidate.id}`);
    const urls = uniqueSorted(ordered.map((record) => record.candidate.url));
    if (urls.length > 1) {
      for (const record of ordered) {
        reject("capability", record.venue, record.candidate.provenance.inputIds[0], ["conflicting_action_candidates"], {
          canonicalKey: key.replaceAll("\0", ":"),
          conflictingUrls: urls,
        });
      }
      continue;
    }
    const base = ordered[0].candidate;
    const inputIds = uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.inputIds));
    const merged = {
      ...base,
      id: hashId("capability", key, ...inputIds),
      priority: Math.min(...ordered.map((record) => record.candidate.priority)),
      confirmationRequired: ordered.some((record) => record.candidate.confirmationRequired),
      provenance: {
        packageIds: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.packageIds)),
        inputIds,
        sourceIds: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.sourceIds)),
        originalSourceIds: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.originalSourceIds)),
        classifications: uniqueSorted(ordered.map((record) => record.candidate.provenance.classification)),
        evidenceNotes: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.evidenceNotes)),
      },
    };
    actionDuplicatesMerged += ordered.length - 1;
    capabilities.push(merged);
  }

  const venueMaps = [];
  const venueMapGroups = new Map();
  for (const record of validRawVenueMaps) {
    const group = venueMapGroups.get(record.candidate.venueSlug) ?? [];
    group.push(record);
    venueMapGroups.set(record.candidate.venueSlug, group);
  }
  for (const [venueSlug, group] of [...venueMapGroups.entries()].sort(([left], [right]) => compareText(left, right))) {
    const ordered = sortBy(group, (record) => `${record.candidate.url}\0${record.candidate.id}`);
    const urls = uniqueSorted(ordered.map((record) => record.candidate.url));
    if (urls.length > 1) {
      for (const record of ordered) {
        reject("venue_map", record.venue, record.candidate.provenance.inputIds[0], ["conflicting_venue_maps_candidates"], {
          targetField: "venues.gmaps_url",
          conflictingUrls: urls,
        });
      }
      continue;
    }
    const base = ordered[0].candidate;
    const inputIds = uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.inputIds));
    venueMaps.push({
      ...base,
      id: hashId("venue-map", venueSlug, ...inputIds),
      priority: Math.min(...ordered.map((record) => record.candidate.priority)),
      confirmationRequired: false,
      provenance: {
        packageIds: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.packageIds)),
        inputIds,
        sourceIds: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.sourceIds)),
        originalSourceIds: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.originalSourceIds)),
        classifications: uniqueSorted(ordered.map((record) => record.candidate.provenance.classification)),
        evidenceNotes: uniqueSorted(ordered.flatMap((record) => record.candidate.provenance.evidenceNotes)),
      },
    });
    venueMapDuplicatesMerged += ordered.length - 1;
  }

  const menus = sortBy(menuCandidates, (menu) => `${menu.venueSlug}\0${String(menu.version).padStart(6, "0")}`);
  const sortedCapabilities = sortBy(capabilities, (capability) =>
    `${capability.venueSlug}\0${String(capability.priority).padStart(6, "0")}\0${capability.kind}\0${capability.provider}`
  );
  const sortedVenueMaps = sortBy(venueMaps, (candidate) => `${candidate.venueSlug}\0${candidate.url}`);
  const sortedSources = sortBy(sourceRecords, (source) => `${source.venueSlug}\0${source.packageId}\0${source.originalId}`);
  const sortedRejections = sortBy(rejections, (rejection) =>
    `${rejection.venueSlug}\0${rejection.entityType}\0${rejection.inputId}\0${rejection.reasons.join("|")}`
  );

  const rawMenus = venueRecords.flatMap((venue) => venue.raw.menus ?? []);
  const rawActions = venueRecords.flatMap((venue) => venue.raw.actions ?? []);
  const rawItemCount = rawMenus.reduce((menuTotal, menu) => menuTotal +
    (menu.sections ?? []).reduce((sectionTotal, section) => sectionTotal + (section.items?.length ?? 0), 0), 0);
  const outputItemCount = menus.reduce((menuTotal, menu) => menuTotal +
    menu.sections.reduce((sectionTotal, section) => sectionTotal + section.items.length, 0), 0);
  const outputItems = menus.flatMap((menu) => menu.sections.flatMap((section) => section.items));
  const completeVenueSlugs = venueRecords
    .filter((venue) => ledgerMap.get(venue.venueSlug).researchStatus === "complete")
    .map((venue) => venue.venueSlug);
  const blockedVenueSlugs = venueRecords
    .filter((venue) => ledgerMap.get(venue.venueSlug).researchStatus === "blocked")
    .map((venue) => venue.venueSlug);
  const candidateVenueSlugs = new Set([
    ...menus.map((menu) => menu.venueSlug),
    ...sortedCapabilities.map((capability) => capability.venueSlug),
    ...sortedVenueMaps.map((candidate) => candidate.venueSlug),
  ]);
  const importVenueSlugs = new Set([
    ...menus.map((menu) => menu.venueSlug),
    ...sortedCapabilities.map((capability) => capability.venueSlug),
  ]);
  const maxCapturedAt = sortedSources
    .map((source) => source.capturedAt)
    .filter((value) => Number.isFinite(Date.parse(value ?? "")))
    .sort((left, right) => Date.parse(right) - Date.parse(left))[0] ?? null;
  const rejectionReasons = sortedRejections.flatMap((rejection) => rejection.reasons);
  const localBlockerMismatches = venueRecords.filter((venue) => {
    const local = venue.raw.blocked;
    if (typeof local !== "boolean") return false;
    const ledgerBlocked = ledgerMap.get(venue.venueSlug).researchStatus === "blocked";
    return local !== ledgerBlocked;
  }).map((venue) => venue.venueSlug).sort(compareText);

  const ledgerMetrics = inputs.ledger.metrics ?? {};
  const registryMetrics = inputs.registry.metrics ?? {};
  const repositoryCounts = [
    packageSet.size,
    ledgerMap.size,
    registryMap.size,
    ledgerMetrics.totalEligible,
    ledgerMetrics.repoCanonicalActiveFnb,
    registryMetrics.totalEligible,
    registryMetrics.repoCanonicalActiveFnb,
  ];
  const repositoryCountsAligned = repositoryCounts.every((count) => Number.isInteger(count) && count === packageSet.size);
  const ledgerLiveCandidate = ledgerMetrics.liveDatabaseCandidate;
  const registryLiveCandidate = registryMetrics.liveDatabaseCandidate;
  const liveCandidateSourcesAgree = Number.isInteger(ledgerLiveCandidate) && ledgerLiveCandidate === registryLiveCandidate;
  const liveDatabaseCandidate = liveCandidateSourcesAgree ? ledgerLiveCandidate : null;
  const ledgerLiveStatus = text(ledgerMetrics.liveDatabaseCandidateStatus);
  const registryLiveStatus = text(registryMetrics.liveDatabaseCandidateStatus);
  const liveCandidateStatusSourcesAgree = Boolean(ledgerLiveStatus) && ledgerLiveStatus === registryLiveStatus;
  const liveDatabaseCandidateStatus = liveCandidateStatusSourcesAgree ? ledgerLiveStatus : "source_mismatch";
  const unresolvedLiveCandidateSlugs = uniqueSorted([
    ...(inputs.ledger.liveDatabaseCandidates ?? []).map((candidate) => text(candidate.slug)),
    ...(inputs.registry.liveDatabaseCandidates ?? []).map((candidate) => text(candidate.slug)),
  ]);
  const liveCandidateConfirmed = liveCandidateStatusSourcesAgree &&
    ["confirmed", "reconciled"].includes(liveDatabaseCandidateStatus) && unresolvedLiveCandidateSlugs.length === 0;
  const liveCandidateMatchesRepository = liveCandidateSourcesAgree && liveDatabaseCandidate === packageSet.size;
  const denominatorReconciled = repositoryCountsAligned && liveCandidateConfirmed && liveCandidateMatchesRepository;
  const inputFileSetComplete = inputs.inputFiles?.length === DATA_OPS_EXPECTED_INPUT_FILE_COUNT;
  const candidateCollections = { menus, capabilities: sortedCapabilities, venueMapsCandidates: sortedVenueMaps };
  const integrity = assertCompiledDataOpsIntegrity(candidateCollections, sortedSources, sortedRejections);
  const queueClosed = inputs.queue.currentBatchId == null && incompleteBatches.length === 0;
  const candidateSafetyGatesPass = inputFileSetComplete &&
    sourceReferencesTotal === sourceReferencesMatched &&
    [...menus, ...sortedCapabilities, ...sortedVenueMaps].every((record) => record.version === 1 && record.verifiedAt == null);
  const releaseGates = {
    queueClosed,
    expectedInputFileSetComplete: inputFileSetComplete,
    repositoryDenominatorInternallyAligned: repositoryCountsAligned,
    liveCandidateSourcesAgree,
    liveCandidateStatusConfirmed: liveCandidateConfirmed,
    liveCandidateMatchesRepository,
    denominatorReconciled,
    candidateIntegrityPassed: true,
    readyForOperatorReview: candidateSafetyGatesPass,
    readyForImportDryRun: candidateSafetyGatesPass && denominatorReconciled,
    readyForStagingApply: candidateSafetyGatesPass && denominatorReconciled,
    readyForPublish: false,
  };
  const denominator = {
    packageVenues: packageSet.size,
    coverageLedgerVenues: ledgerMap.size,
    canonicalRegistryVenues: registryMap.size,
    ledgerTotalEligible: ledgerMetrics.totalEligible ?? null,
    registryTotalEligible: registryMetrics.totalEligible ?? null,
    liveDatabaseCandidate,
    liveDatabaseCandidateStatus,
    unresolvedLiveCandidateSlugs,
    repositoryCountsAligned,
    liveCandidateMatchesRepository,
    liveCandidateConfirmed,
    fullyReconciled: denominatorReconciled,
    complete: completeVenueSlugs.length,
    blocked: blockedVenueSlugs.length,
  };

  const metadata = {
    schemaVersion: 1,
    compilerVersion: DATA_OPS_COMPILER_VERSION,
    inputDigest: inputs.inputDigest,
    expectedInputFiles: DATA_OPS_EXPECTED_INPUT_FILE_COUNT,
    inputFiles: inputs.inputFiles?.length ?? null,
    asOf: maxCapturedAt,
    dataUseState: "draft_operator_review_only",
    forbiddenToPublish: true,
    denominator,
    integrity,
    releaseGates,
  };
  const candidatePayload = {
    ...metadata,
    menus,
    capabilities: sortedCapabilities,
    venueMapsCandidates: sortedVenueMaps,
  };
  const packageDigest = computeDataOpsPackageDigest(candidatePayload);
  const artifactMetadata = { ...metadata, packageDigest };
  const candidates = { ...artifactMetadata, menus, capabilities: sortedCapabilities, venueMapsCandidates: sortedVenueMaps };
  const sources = {
    ...artifactMetadata,
    sources: sortedSources,
  };
  const rejectionPackage = {
    ...artifactMetadata,
    rejections: sortedRejections,
  };
  const coverageReport = {
    ...artifactMetadata,
    denominator,
    inputs: {
      files: inputs.inputFiles?.length ?? null,
      packages: packages.length,
      wavePackages: packages.filter((record) => record.packageType === "wave").length,
      batchPackages: packages.filter((record) => record.packageType === "batch").length,
      sources: sortedSources.length,
      validSources: sortedSources.filter((source) => source.validForCandidate).length,
      quarantinedSources: sortedSources.filter((source) => !source.validForCandidate).length,
      freshnessQuarantinedSources: sortedSources.filter((source) => source.freshnessState === "quarantined").length,
      rawMenus: rawMenus.length,
      rawActions: rawActions.length,
      rawItems: rawItemCount,
      verifiedAtNonNull: [
        ...sortedSources.map((source) => source.verifiedAt),
        ...rawMenus.map((menu) => menu.verifiedAt),
        ...rawActions.map((action) => action.verifiedAt),
      ].filter((value) => value != null).length,
      publicationAllowedTrue: venueRecords.filter((venue) => venue.raw.publicationAllowed === true).length,
    },
    provenance: {
      sourceReferencesTotal,
      sourceReferencesMatched,
      sourceReferencesUnmatched: sourceReferencesTotal - sourceReferencesMatched,
      originalSourceIdsUnique: originalSourceGroups.size,
      canonicalSourceIdsUnique: new Set(sortedSources.map((source) => source.id)).size,
      sourceIdCollisionCount: sourceIdCollisions.length,
      sourceIdCollisions,
      integrity,
    },
    transformations: {
      actionKindClassifications: countBy(classifications),
      actionDuplicatesMerged,
      venueMapDuplicatesMerged,
      pricingPolicy: {
        IDR: "priceMinor is copied as an integer rupiah amount; zero-decimal currency, no x100 scaling",
        priceText: "sourceDisplayPrice is preserved exactly and maps to menu_items.price_text",
      },
      localBlockerMismatches,
    },
    outputs: {
      menuCandidates: menus.length,
      capabilityCandidates: sortedCapabilities.length,
      venueMapsVerificationCandidates: sortedVenueMaps.length,
      menuItems: outputItemCount,
      sourceDisplayPricesPreserved: outputItems.filter((item) => item.sourceDisplayPrice != null).length,
      sourceDisplayPriceOnly: outputItems.filter((item) => item.sourceDisplayPrice != null && item.priceMinor == null).length,
      idrZeroDecimalPriceMinorRecords: outputItems.filter((item) => item.currency === "IDR" && item.priceMinor != null).length,
      venuesWithAnyCandidate: candidateVenueSlugs.size,
      venuesInStructuredImportPlan: importVenueSlugs.size,
      completeVenuesWithoutCandidate: completeVenueSlugs.filter((slug) => !candidateVenueSlugs.has(slug)).sort(compareText),
      statuses: countBy([
        ...menus.map((menu) => menu.status),
        ...sortedCapabilities.map((capability) => capability.status),
        ...sortedVenueMaps.map((candidate) => candidate.status),
      ]),
      providers: countBy(sortedCapabilities.map((capability) => capability.provider)),
      kinds: countBy(sortedCapabilities.map((capability) => capability.kind)),
      verifiedAtNonNull: [...menus, ...sortedCapabilities, ...sortedVenueMaps].filter((record) => record.verifiedAt != null).length,
    },
    exclusions: {
      records: sortedRejections.length,
      byEntity: countBy(sortedRejections.map((rejection) => rejection.entityType)),
      byReason: countBy(rejectionReasons),
    },
    gates: {
      ...releaseGates,
      allCandidateSourcesMapped: sourceReferencesTotal === sourceReferencesMatched,
      allCandidatesDraftOrReview: [...menus, ...sortedCapabilities, ...sortedVenueMaps].every((record) => ["draft", "review"].includes(record.status)),
      allCandidatesUnverified: [...menus, ...sortedCapabilities, ...sortedVenueMaps].every((record) => record.verifiedAt == null),
      venueMapsExcludedFromCapabilityImport: sortedCapabilities.every((record) => record.kind !== "maps") && sortedVenueMaps.every((record) => record.targetField === "venues.gmaps_url"),
    },
  };

  return { candidates, sources, rejections: rejectionPackage, coverageReport };
}
