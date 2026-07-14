import assert from "node:assert/strict";
import test from "node:test";
import {
  assertCompiledDataOpsIntegrity,
  compileDataOps,
  loadDataOpsInputs,
} from "./data-ops-compiler-core.mjs";

test("compiles all 25 batches plus Wave 1 deterministically without double-counting", async () => {
  const inputs = await loadDataOpsInputs(process.cwd());
  const first = compileDataOps(inputs);
  const second = compileDataOps(inputs);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.match(first.candidates.packageDigest, /^[a-f0-9]{64}$/);
  assert.equal(first.candidates.packageDigest, first.coverageReport.packageDigest);

  const report = first.coverageReport;
  assert.deepEqual(report.denominator, {
    packageVenues: 208,
    coverageLedgerVenues: 208,
    canonicalRegistryVenues: 208,
    ledgerTotalEligible: 208,
    registryTotalEligible: 208,
    liveDatabaseCandidate: 208,
    liveDatabaseCandidateStatus: "reconciled",
    unresolvedLiveCandidateSlugs: [],
    repositoryCountsAligned: true,
    liveCandidateMatchesRepository: true,
    liveCandidateConfirmed: true,
    fullyReconciled: true,
    complete: 153,
    blocked: 55,
  });
  assert.equal(report.inputs.files, 55);
  assert.equal(report.inputs.packages, 26);
  assert.equal(report.inputs.wavePackages, 1);
  assert.equal(report.inputs.batchPackages, 25);
  assert.equal(report.inputs.sources, 365);
  assert.equal(report.inputs.validSources, 292);
  assert.equal(report.inputs.quarantinedSources, 73);
  assert.equal(report.inputs.freshnessQuarantinedSources, 14);
  assert.equal(report.inputs.rawMenus, 149);
  assert.equal(report.inputs.rawActions, 394);
  assert.equal(report.inputs.rawItems, 939);
  assert.equal(report.inputs.verifiedAtNonNull, 0);
  assert.equal(report.inputs.publicationAllowedTrue, 0);
});

test("emits only mapped, unverified draft/review candidates and excludes blockers/placeholders", async () => {
  const inputs = await loadDataOpsInputs(process.cwd());
  const { candidates, coverageReport, rejections } = compileDataOps(inputs);
  assert.equal(candidates.menus.length, 127);
  assert.equal(coverageReport.outputs.fullMenuCandidates, 1);
  assert.equal(coverageReport.outputs.partialMenuCandidates, 126);
  assert.deepEqual(candidates.menus.filter((menu) => menu.completeness === "full").map((menu) => menu.venueSlug), ["kynd-community"]);
  assert.equal(candidates.capabilities.length, 250);
  assert.equal(candidates.venueMapsCandidates.length, 50);
  assert.equal(coverageReport.outputs.menuItems, 881);
  assert.ok(coverageReport.outputs.sourceDisplayPricesPreserved > 0);
  assert.ok(coverageReport.outputs.sourceDisplayPriceOnly > 0);
  assert.equal(coverageReport.outputs.venuesWithAnyCandidate, 147);
  assert.deepEqual(coverageReport.outputs.completeVenuesWithoutCandidate, [
    "arwana",
    "izakaya-by-oku",
    "manarai-beach-house",
    "masonry-restaurant",
    "massimo-italian-restaurant",
    "onion-collective",
  ]);
  assert.ok([...candidates.menus, ...candidates.capabilities, ...candidates.venueMapsCandidates].every((row) => row.status === "draft" && row.verifiedAt === null));
  assert.ok(candidates.menus.every((menu) => menu.sections.some((section) => section.items.length)));
  assert.ok(candidates.menus.some((menu) => menu.sections.some((section) => section.items.some((item) => item.sourceDisplayPrice))));
  assert.equal(coverageReport.provenance.sourceReferencesUnmatched, 0);
  assert.equal(rejections.rejections.filter((row) => row.reasons.includes("empty_menu_placeholder")).length, 11);
  assert.equal(coverageReport.gates.denominatorReconciled, true);
  assert.equal(coverageReport.gates.readyForImportDryRun, true);
  assert.equal(coverageReport.gates.readyForStagingApply, true);

  const blocked = new Set(inputs.ledger.venues.filter((venue) => venue.researchStatus === "blocked").map((venue) => venue.slug));
  assert.ok(candidates.menus.every((menu) => !blocked.has(menu.venueSlug)));
  assert.ok(candidates.capabilities.every((capability) => !blocked.has(capability.venueSlug)));
  assert.ok(candidates.venueMapsCandidates.every((candidate) => !blocked.has(candidate.venueSlug)));
});

test("canonicalizes the global source collision and action taxonomy safely", async () => {
  const inputs = await loadDataOpsInputs(process.cwd());
  const { candidates, coverageReport, sources, rejections } = compileDataOps(inputs);
  assert.equal(new Set(sources.sources.map((source) => source.id)).size, 365);
  assert.deepEqual(coverageReport.provenance.sourceIdCollisions.map((collision) => collision.originalId), ["src-yuki-menu"]);
  assert.equal(coverageReport.provenance.sourceIdCollisions[0].canonicalIds.length, 2);
  assert.ok(candidates.capabilities.every((capability) => !["directions", "map", "maps", "order"].includes(capability.kind)));
  assert.ok(candidates.capabilities.every((capability) => capability.version === 1));
  assert.ok(candidates.venueMapsCandidates.every((candidate) =>
    candidate.kind === "maps" && candidate.canonicalActionType === "directions" && candidate.targetField === "venues.gmaps_url"
  ));
  assert.equal(coverageReport.transformations.actionKindClassifications.normalized_map_alias, 49);
  assert.equal(coverageReport.transformations.actionKindClassifications.order_provider_delivery, 15);
  assert.equal(coverageReport.exclusions.byReason.ambiguous_order_kind, 2);
  assert.equal(coverageReport.exclusions.byReason.action_url_not_https, 3);
  assert.equal(coverageReport.exclusions.byReason.unsupported_provider, 42);
  assert.ok(rejections.rejections.some((row) => row.reasons.includes("conflicting_action_candidates")));
});

test("quarantines stale, recheck-required and non-candidate source outcomes", async () => {
  const { candidates, coverageReport, sources, rejections } = compileDataOps(await loadDataOpsInputs(process.cwd()));
  const sensoriumMenuSource = sources.sources.find((source) => source.originalId === "src-sensorium-menu");
  assert.equal(sensoriumMenuSource.venueSlug, "sensorium-bali");
  assert.equal(sensoriumMenuSource.validForCandidate, false);
  assert.equal(sensoriumMenuSource.candidateState, "quarantined");
  assert.equal(sensoriumMenuSource.freshnessState, "quarantined");
  assert.ok(sensoriumMenuSource.errors.includes("source_freshness_recheck_required"));
  assert.ok(!candidates.menus.some((menu) => menu.venueSlug === "sensorium-bali"));
  assert.ok(rejections.rejections.some((row) =>
    row.venueSlug === "sensorium-bali" && row.reasons.includes("source_freshness_recheck_required")
  ));
  assert.equal(coverageReport.exclusions.byReason.source_freshness_recheck_required, 12);
});

test("fails closed on duplicate IDs, broken provenance/source links and rejected input overlap", async () => {
  const compiled = compileDataOps(await loadDataOpsInputs(process.cwd()));
  assert.doesNotThrow(() => assertCompiledDataOpsIntegrity(
    compiled.candidates,
    compiled.sources.sources,
    compiled.rejections.rejections
  ));

  const duplicateId = structuredClone(compiled);
  duplicateId.candidates.capabilities[0].id = duplicateId.candidates.menus[0].id;
  assert.throws(() => assertCompiledDataOpsIntegrity(
    duplicateId.candidates,
    duplicateId.sources.sources,
    duplicateId.rejections.rejections
  ), /IDs are not globally unique/);

  const missingProvenance = structuredClone(compiled);
  delete missingProvenance.candidates.capabilities[0].provenance;
  assert.throws(() => assertCompiledDataOpsIntegrity(
    missingProvenance.candidates,
    missingProvenance.sources.sources,
    missingProvenance.rejections.rejections
  ), /missing provenance/);

  const invalidSource = structuredClone(compiled);
  const linkedSourceId = invalidSource.candidates.menus[0].provenance.sourceIds[0];
  invalidSource.sources.sources.find((source) => source.id === linkedSourceId).validForCandidate = false;
  assert.throws(() => assertCompiledDataOpsIntegrity(
    invalidSource.candidates,
    invalidSource.sources.sources,
    invalidSource.rejections.rejections
  ), /links quarantined sources/);

  const rejectedOverlap = structuredClone(compiled);
  const menu = rejectedOverlap.candidates.menus[0];
  rejectedOverlap.rejections.rejections.push({
    id: "rejection-negative-overlap",
    entityType: "menu",
    packageId: menu.provenance.packageIds[0],
    venueSlug: menu.venueSlug,
    inputId: menu.provenance.inputIds[0],
    reasons: ["negative_test"],
  });
  assert.throws(() => assertCompiledDataOpsIntegrity(
    rejectedOverlap.candidates,
    rejectedOverlap.sources.sources,
    rejectedOverlap.rejections.rejections
  ), /provenance input also appears in rejections/);
});

test("preserves price text and copies IDR rupiah integers without cent scaling", async () => {
  const { candidates, coverageReport } = compileDataOps(await loadDataOpsInputs(process.cwd()));
  const mason = candidates.menus.find((menu) => menu.venueSlug === "mason");
  assert.equal(mason.completeness, "partial");
  const flatBread = mason.sections.flatMap((section) => section.items).find((item) => item.name === "WOOD FIRED FLAT BREAD");
  assert.equal(flatBread.sourceDisplayPrice, "60");
  assert.equal(flatBread.priceText, "60");
  assert.equal(flatBread.currency, "IDR");
  assert.equal(flatBread.priceMinor, 60000);
  assert.notEqual(flatBread.priceMinor, 6000000);
  assert.equal(coverageReport.outputs.sourceDisplayPricesPreserved, 816);
  assert.equal(coverageReport.outputs.sourceDisplayPriceOnly, 242);
  assert.equal(coverageReport.outputs.idrZeroDecimalPriceMinorRecords, 574);
});
