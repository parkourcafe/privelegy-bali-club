import { VALIDATION_MODES, validateCapability, validateMenu } from "./validation-core.mjs";
import {
  DATA_OPS_EXPECTED_INPUT_FILE_COUNT,
  computeDataOpsPackageDigest,
  serializeDataOpsCandidates,
} from "./data-ops-compiler-core.mjs";

function countMenuItems(menus) {
  return menus.reduce((menuTotal, menu) => menuTotal +
    menu.sections.reduce((sectionTotal, section) => sectionTotal + section.items.length, 0), 0);
}

function duplicateKeys(rows, keyOf) {
  const counts = new Map();
  for (const row of rows) {
    const key = keyOf(row);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key).sort();
}

function assertCandidateIdsAndProvenance(menus, capabilities, venueMapsCandidates) {
  const records = [...menus, ...capabilities, ...venueMapsCandidates];
  const ids = [
    ...records.map((record) => record.id),
    ...menus.flatMap((menu) => menu.sections.flatMap((section) => [section.id, ...section.items.map((item) => item.id)])),
  ];
  if (ids.some((id) => typeof id !== "string" || !id.trim())) throw new Error("Compiled candidate records require stable IDs");
  const duplicateIds = duplicateKeys(ids, (id) => id);
  if (duplicateIds.length) throw new Error(`Compiled candidate IDs are not unique: ${JSON.stringify(duplicateIds)}`);

  const inputRefs = [];
  for (const record of records) {
    const provenance = record.provenance;
    if (!provenance || typeof provenance !== "object") throw new Error(`Candidate ${record.id} is missing provenance`);
    for (const field of ["packageIds", "inputIds", "sourceIds", "originalSourceIds"]) {
      const values = provenance[field];
      if (!Array.isArray(values) || values.length === 0 || values.some((value) => typeof value !== "string" || !value.trim())) {
        throw new Error(`Candidate ${record.id} provenance.${field} must be a non-empty string array`);
      }
      if (duplicateKeys(values, (value) => value).length) {
        throw new Error(`Candidate ${record.id} provenance.${field} contains duplicates`);
      }
    }
    const entityType = menus.includes(record) ? "menu" : venueMapsCandidates.includes(record) ? "venue_map" : "capability";
    for (const packageId of provenance.packageIds) {
      for (const inputId of provenance.inputIds) inputRefs.push(`${entityType}\0${packageId}\0${record.venueSlug}\0${inputId}`);
    }
  }
  const duplicateInputRefs = duplicateKeys(inputRefs, (ref) => ref);
  if (duplicateInputRefs.length) throw new Error(`Compiled provenance input refs are not unique: ${JSON.stringify(duplicateInputRefs)}`);
}

export function assertCanonicalDataOpsCandidateBytes(candidateBytes, canonicalCandidate, inputFileCount) {
  if (inputFileCount !== DATA_OPS_EXPECTED_INPUT_FILE_COUNT) {
    throw new Error(`Apply blocked: canonical rebuild must read exactly ${DATA_OPS_EXPECTED_INPUT_FILE_COUNT} raw Data Ops files; got ${inputFileCount}`);
  }
  const expected = serializeDataOpsCandidates(canonicalCandidate);
  if (candidateBytes !== expected) {
    throw new Error("Apply blocked: candidate file is not byte-identical to the package rebuilt from canonical raw Data Ops files");
  }
  return buildImportPlan(canonicalCandidate);
}

export function buildImportPlan(candidate) {
  const menus = candidate?.menus;
  const capabilities = candidate?.capabilities;
  const venueMapsCandidates = candidate?.venueMapsCandidates;
  if (!Array.isArray(menus) || !Array.isArray(capabilities) || !Array.isArray(venueMapsCandidates)) {
    throw new Error("Expected a compiled candidate object with menus, capabilities and venueMapsCandidates arrays");
  }
  if (!candidate.inputDigest) throw new Error("Compiled candidate inputDigest is required");
  if (!candidate.packageDigest) throw new Error("Compiled candidate packageDigest is required");
  if (candidate.expectedInputFiles !== DATA_OPS_EXPECTED_INPUT_FILE_COUNT || candidate.inputFiles !== DATA_OPS_EXPECTED_INPUT_FILE_COUNT) {
    throw new Error(`Compiled candidate must be derived from exactly ${DATA_OPS_EXPECTED_INPUT_FILE_COUNT} raw Data Ops files`);
  }
  const recomputedDigest = computeDataOpsPackageDigest(candidate);
  if (candidate.packageDigest !== recomputedDigest) {
    throw new Error("Compiled candidate packageDigest does not match the recomputed package content digest");
  }
  if (candidate.forbiddenToPublish !== true) throw new Error("Compiled candidates must remain forbidden to publish");
  if (!candidate.integrity?.globallyUniqueIds || !candidate.integrity?.rejectedInputRefsExcluded || !candidate.integrity?.initialVersionOneOnly) {
    throw new Error("Compiled candidate integrity attestation is missing or incomplete");
  }
  if (!candidate.denominator || !candidate.releaseGates) throw new Error("Compiled candidate denominator and release gates are required");
  if (candidate.releaseGates.denominatorReconciled !== candidate.denominator.fullyReconciled) {
    throw new Error("Compiled candidate denominator gates are internally inconsistent");
  }
  if (candidate.releaseGates.readyForStagingApply === true && candidate.releaseGates.denominatorReconciled !== true) {
    throw new Error("Compiled candidate cannot be apply-ready with an unreconciled denominator");
  }

  assertCandidateIdsAndProvenance(menus, capabilities, venueMapsCandidates);

  const validation = [
    ...menus.map((row, index) => validateMenu(row, index, { mode: VALIDATION_MODES.IMPORT_DRY_RUN })),
    ...capabilities.map((row, index) => validateCapability(row, index, { mode: VALIDATION_MODES.IMPORT_DRY_RUN })),
    ...venueMapsCandidates.map((row, index) => validateCapability(row, index, { mode: VALIDATION_MODES.IMPORT_DRY_RUN })),
  ];
  const blockers = validation.filter((result) => result.errors.length);
  if (blockers.length) throw new Error(`Import validation failed: ${JSON.stringify(blockers)}`);
  if (capabilities.some((row) => row.kind === "maps")) {
    throw new Error("Maps evidence must not enter venue_action_capabilities; use venueMapsCandidates for venues.gmaps_url review");
  }
  if (!venueMapsCandidates.every((row) =>
    row.kind === "maps" && row.provider === "google_maps" && row.targetField === "venues.gmaps_url"
  )) {
    throw new Error("venueMapsCandidates must target only venues.gmaps_url with Google Maps evidence");
  }
  const verified = [...menus, ...capabilities, ...venueMapsCandidates].filter((row) => row.verifiedAt != null);
  if (verified.length) throw new Error("Data Ops importer accepts only verifiedAt=null; verification belongs to the operator workflow");
  if (![...menus, ...capabilities, ...venueMapsCandidates].every((row) => ["draft", "review"].includes(row.status))) {
    throw new Error("Data Ops importer accepts only draft/review status");
  }
  if (![...menus, ...capabilities, ...venueMapsCandidates].every((row) => row.version === 1)) {
    throw new Error("Initial Data Ops import accepts only version=1 candidates");
  }

  const duplicateMenus = duplicateKeys(menus, (menu) => `${menu.venueSlug}\0${menu.version}`);
  const duplicateCapabilities = duplicateKeys(capabilities, (capability) =>
    `${capability.venueSlug}\0${capability.kind}\0${capability.provider}\0${capability.version}`
  );
  const duplicateVenueMaps = duplicateKeys(venueMapsCandidates, (candidate) => candidate.venueSlug);
  if (duplicateMenus.length || duplicateCapabilities.length || duplicateVenueMaps.length) {
    throw new Error(`Compiled candidate keys are not unique: menus=${JSON.stringify(duplicateMenus)} capabilities=${JSON.stringify(duplicateCapabilities)} venueMaps=${JSON.stringify(duplicateVenueMaps)}`);
  }

  return {
    inputDigest: candidate.inputDigest,
    packageDigest: candidate.packageDigest,
    denominator: candidate.denominator,
    releaseGates: candidate.releaseGates,
    menus,
    capabilities,
    venueMapsCandidates,
    counts: {
      menus: menus.length,
      sections: menus.reduce((total, menu) => total + menu.sections.length, 0),
      items: countMenuItems(menus),
      capabilities: capabilities.length,
      venueMapsVerificationCandidates: venueMapsCandidates.length,
      venues: new Set([...menus.map((menu) => menu.venueSlug), ...capabilities.map((capability) => capability.venueSlug)]).size,
    },
  };
}

export function assertStagingApplyEnvironment(plan, env = process.env) {
  const knownProductionProjectRef = "egkdapqwkfprtyqvvnso";
  if (plan.releaseGates?.denominatorReconciled !== true || plan.releaseGates?.readyForStagingApply !== true) {
    throw new Error("Apply blocked: compiled release gates require a confirmed, fully reconciled denominator before staging writes");
  }
  if (env.OTHER_BALI_ALLOW_STAGING_IMPORT !== "YES") {
    throw new Error("Apply blocked: set OTHER_BALI_ALLOW_STAGING_IMPORT=YES for the staging run");
  }
  if (env.OTHER_BALI_STAGING_ENVIRONMENT !== "staging") {
    throw new Error("Apply blocked: OTHER_BALI_STAGING_ENVIRONMENT must equal staging");
  }
  if (env.OTHER_BALI_STAGING_DISPOSABLE_EMPTY_TARGET !== "YES") {
    throw new Error("Apply blocked: OTHER_BALI_STAGING_DISPOSABLE_EMPTY_TARGET must acknowledge an empty disposable staging target");
  }
  if (env.OTHER_BALI_STAGING_RECREATE_ON_FAILURE !== "YES") {
    throw new Error("Apply blocked: OTHER_BALI_STAGING_RECREATE_ON_FAILURE must acknowledge recreation after any partial failure");
  }
  if (env.OTHER_BALI_STAGING_IMPORT_DIGEST !== plan.packageDigest) {
    throw new Error("Apply blocked: OTHER_BALI_STAGING_IMPORT_DIGEST must match the compiled packageDigest");
  }
  const url = env.OTHER_BALI_STAGING_SUPABASE_URL;
  const serviceRoleKey = env.OTHER_BALI_STAGING_SUPABASE_SERVICE_ROLE_KEY;
  const projectRef = env.OTHER_BALI_STAGING_PROJECT_REF;
  const productionUrl = env.OTHER_BALI_PRODUCTION_SUPABASE_URL;
  const productionProjectRef = env.OTHER_BALI_PRODUCTION_PROJECT_REF;
  if (!url || !serviceRoleKey || !projectRef || !productionUrl || !productionProjectRef) {
    throw new Error("Apply blocked: staging URL/key/ref and declared production URL/ref are required");
  }
  let parsed;
  let parsedProduction;
  try {
    parsed = new URL(url);
    parsedProduction = new URL(productionUrl);
  } catch {
    throw new Error("Apply blocked: staging or production Supabase URL is invalid");
  }
  const hostedStaging = parsed.protocol === "https:"
    && parsed.hostname === `${projectRef}.supabase.co`;
  const localDisposableStaging = env.OTHER_BALI_STAGING_LOCAL_DISPOSABLE === "YES"
    && projectRef === "local-disposable"
    && parsed.protocol === "http:"
    && ["127.0.0.1", "localhost"].includes(parsed.hostname)
    && parsed.port === "54321"
    && parsed.pathname === "/"
    && !parsed.search
    && !parsed.hash;
  if (!hostedStaging && !localDisposableStaging) {
    throw new Error("Apply blocked: staging URL must be an exact hosted project URL or the explicitly acknowledged local disposable Supabase target");
  }
  if (parsedProduction.protocol !== "https:" || parsedProduction.hostname !== `${productionProjectRef}.supabase.co`) {
    throw new Error("Apply blocked: production URL must exactly match https://<OTHER_BALI_PRODUCTION_PROJECT_REF>.supabase.co");
  }
  if (projectRef === knownProductionProjectRef || parsed.hostname === `${knownProductionProjectRef}.supabase.co`) {
    throw new Error("Apply blocked: staging target is the known Other Bali production project");
  }
  if (url === productionUrl || projectRef === productionProjectRef) {
    throw new Error("Apply blocked: staging target matches the declared production project");
  }
  return { url, serviceRoleKey, projectRef };
}

function menuRow(menu) {
  return {
    venue_slug: menu.venueSlug,
    title: menu.title,
    version: menu.version,
    status: menu.status,
    completeness: menu.completeness,
    source_url: menu.sourceUrl,
    source_label: menu.sourceLabel,
    captured_at: menu.capturedAt,
    verified_at: null,
    expires_at: menu.expiresAt,
  };
}

function sectionRow(menuId, section) {
  return {
    menu_id: menuId,
    name: section.name,
    description: section.description,
    position: section.position,
  };
}

function itemRow(menuId, sectionId, item) {
  return {
    menu_id: menuId,
    section_id: sectionId,
    name: item.name,
    description: item.description,
    price_minor: item.priceMinor,
    currency: item.currency,
    price_text: item.priceText ?? item.sourceDisplayPrice ?? null,
    dietary_tags: item.dietaryTags,
    verified_allergen_tags: item.verifiedAllergenTags,
    partner_recommended: item.partnerRecommended,
    availability_note: item.availabilityNote,
    position: item.position,
  };
}

function capabilityRow(capability) {
  return {
    venue_slug: capability.venueSlug,
    kind: capability.kind,
    provider: capability.provider,
    version: capability.version,
    replaces_capability_id: null,
    url: capability.url,
    label: capability.label,
    status: capability.status,
    priority: capability.priority,
    confirmation_required: capability.confirmationRequired,
    source_url: capability.sourceUrl,
    source_label: capability.sourceLabel,
    captured_at: capability.capturedAt,
    verified_at: null,
    expires_at: capability.expiresAt,
  };
}

function unwrap(result, operation) {
  if (result.error) throw new Error(`${operation}: ${result.error.message ?? String(result.error)}`);
  return result.data;
}

function chunks(values, size = 50) {
  const output = [];
  for (let index = 0; index < values.length; index += size) output.push(values.slice(index, index + size));
  return output;
}

export async function preflightDisposableStagingTarget(plan, client) {
  const targetSamples = {
    menus: unwrap(await client.from("menus").select("id,venue_slug,version").limit(1), "preflight empty menus target") ?? [],
    menu_sections: unwrap(await client.from("menu_sections").select("id,menu_id,position").limit(1), "preflight empty menu_sections target") ?? [],
    menu_items: unwrap(await client.from("menu_items").select("id,section_id,position,price_text").limit(1), "preflight menu_items.price_text schema and empty target") ?? [],
    venue_action_capabilities: unwrap(await client.from("venue_action_capabilities").select("id,venue_slug,kind,provider,version").limit(1), "preflight empty capabilities target") ?? [],
  };
  const nonEmptyTables = Object.entries(targetSamples)
    .filter(([, rows]) => rows.length > 0)
    .map(([table]) => table);
  if (nonEmptyTables.length) {
    throw new Error(`Apply blocked: disposable staging import tables must be completely empty; found rows in ${JSON.stringify(nonEmptyTables)}`);
  }

  const venueSlugs = [...new Set([
    ...plan.menus.map((menu) => menu.venueSlug),
    ...plan.capabilities.map((capability) => capability.venueSlug),
  ])].sort();
  const existingVenueSlugs = [];
  for (const venueChunk of chunks(venueSlugs)) {
    existingVenueSlugs.push(...((unwrap(await client
      .from("venues")
      .select("slug")
      .in("slug", venueChunk), "preflight venue coverage") ?? []).map((row) => row.slug)));
  }
  const existingVenueSet = new Set(existingVenueSlugs);
  const missingVenueSlugs = venueSlugs.filter((slug) => !existingVenueSet.has(slug));
  if (missingVenueSlugs.length) {
    throw new Error(`Apply blocked: staging is missing candidate venues: ${JSON.stringify(missingVenueSlugs)}`);
  }
  return {
    candidateVenues: venueSlugs.length,
    emptyTargetTables: Object.keys(targetSamples),
  };
}

export async function preflightDraftOnlyTargets(plan, client) {
  return preflightDisposableStagingTarget(plan, client);
}

export async function applyImportPlan(plan, client) {
  if (plan.releaseGates?.denominatorReconciled !== true || plan.releaseGates?.readyForStagingApply !== true) {
    throw new Error("Apply blocked: release gates do not authorize staging writes");
  }
  await preflightDisposableStagingTarget(plan, client);
  let menuCount = 0;
  let sectionCount = 0;
  let itemCount = 0;
  for (const menu of plan.menus) {
    const menuData = unwrap(await client
      .from("menus")
      .insert(menuRow(menu))
      .select("id")
      .single(), `insert menu ${menu.venueSlug}`);
    for (const section of menu.sections) {
      const sectionData = unwrap(await client
        .from("menu_sections")
        .insert(sectionRow(menuData.id, section))
        .select("id")
        .single(), `insert section ${menu.venueSlug}:${section.position}`);
      if (section.items.length) {
        unwrap(await client
          .from("menu_items")
          .insert(section.items.map((item) => itemRow(menuData.id, sectionData.id, item))), `insert items ${menu.venueSlug}:${section.position}`);
      }
      sectionCount += 1;
      itemCount += section.items.length;
    }
    menuCount += 1;
  }

  for (const capabilityChunk of chunks(plan.capabilities, 100)) {
    unwrap(await client
      .from("venue_action_capabilities")
      .insert(capabilityChunk.map(capabilityRow)), "insert capabilities");
  }
  return {
    menus: menuCount,
    sections: sectionCount,
    items: itemCount,
    capabilities: plan.capabilities.length,
    venueMapsNotApplied: plan.venueMapsCandidates.length,
  };
}
