import assert from "node:assert/strict";
import test from "node:test";
import {
  compileDataOps,
  computeDataOpsPackageDigest,
  loadDataOpsInputs,
  serializeDataOpsCandidates,
} from "./data-ops-compiler-core.mjs";
import {
  applyImportPlan,
  assertCanonicalDataOpsCandidateBytes,
  assertStagingApplyEnvironment,
  buildImportPlan,
  preflightDisposableStagingTarget,
} from "./data-ops-import-core.mjs";

test("builds a review-only dry-run plan from compiled candidates", async () => {
  const compiled = compileDataOps(await loadDataOpsInputs(process.cwd()));
  const plan = buildImportPlan(compiled.candidates);
  assert.equal(plan.counts.menus, 127);
  assert.equal(plan.counts.sections, 165);
  assert.equal(plan.counts.items, 881);
  assert.equal(plan.counts.capabilities, 250);
  assert.equal(plan.counts.venueMapsVerificationCandidates, 50);
  assert.equal(plan.counts.venues, 147);
  assert.equal(plan.releaseGates.denominatorReconciled, true);
  assert.equal(plan.releaseGates.readyForStagingApply, true);
});

test("staging apply requires reconciled gates, explicit disposable target, digest and non-production URL", () => {
  const plan = {
    inputDigest: "source-digest",
    packageDigest: "digest",
    releaseGates: { denominatorReconciled: true, readyForStagingApply: true },
  };
  assert.throws(() => assertStagingApplyEnvironment(plan, {}), /ALLOW_STAGING_IMPORT/);
  const valid = {
    OTHER_BALI_ALLOW_STAGING_IMPORT: "YES",
    OTHER_BALI_STAGING_ENVIRONMENT: "staging",
    OTHER_BALI_STAGING_DISPOSABLE_EMPTY_TARGET: "YES",
    OTHER_BALI_STAGING_RECREATE_ON_FAILURE: "YES",
    OTHER_BALI_STAGING_IMPORT_DIGEST: "digest",
    OTHER_BALI_STAGING_SUPABASE_URL: "https://stagingref.supabase.co",
    OTHER_BALI_STAGING_SUPABASE_SERVICE_ROLE_KEY: "secret",
    OTHER_BALI_STAGING_PROJECT_REF: "stagingref",
    OTHER_BALI_PRODUCTION_SUPABASE_URL: "https://productionref.supabase.co",
    OTHER_BALI_PRODUCTION_PROJECT_REF: "productionref",
  };
  assert.deepEqual(assertStagingApplyEnvironment(plan, valid), {
    url: valid.OTHER_BALI_STAGING_SUPABASE_URL,
    serviceRoleKey: "secret",
    projectRef: "stagingref",
  });
  assert.throws(() => assertStagingApplyEnvironment(plan, {
    ...valid,
    OTHER_BALI_PRODUCTION_SUPABASE_URL: valid.OTHER_BALI_STAGING_SUPABASE_URL,
    OTHER_BALI_PRODUCTION_PROJECT_REF: valid.OTHER_BALI_STAGING_PROJECT_REF,
  }), /matches the declared production/);
  assert.throws(() => assertStagingApplyEnvironment(plan, {
    ...valid,
    OTHER_BALI_STAGING_SUPABASE_URL: "https://egkdapqwkfprtyqvvnso.supabase.co",
    OTHER_BALI_STAGING_PROJECT_REF: "egkdapqwkfprtyqvvnso",
  }), /known Other Bali production project/);
  assert.throws(() => assertStagingApplyEnvironment({
    ...plan,
    releaseGates: { denominatorReconciled: false, readyForStagingApply: false },
  }, valid), /fully reconciled denominator/);
});

test("apply inserts only draft/unverified version-1 records and omits editorial columns", async () => {
  const compiled = compileDataOps(await loadDataOpsInputs(process.cwd()));
  const fullPlan = buildImportPlan(compiled.candidates);
  const plan = {
    ...fullPlan,
    releaseGates: { ...fullPlan.releaseGates, denominatorReconciled: true, readyForStagingApply: true },
    menus: [fullPlan.menus.find((menu) => menu.venueSlug === "mason")],
    capabilities: fullPlan.capabilities.slice(0, 1),
  };
  const calls = [];
  const client = {
    from(table) {
      return {
        select() {
          return {
            limit() { return Promise.resolve({ data: [], error: null }); },
            in(_field, values) {
              return Promise.resolve({
                data: table === "venues" ? values.map((slug) => ({ slug })) : [],
                error: null,
              });
            },
          };
        },
        insert(payload) {
          calls.push({ table, payload });
          const result = { data: null, error: null };
          return {
            then(resolve, reject) { return Promise.resolve(result).then(resolve, reject); },
            select() {
              return {
                single() {
                  return Promise.resolve({ data: { id: `${table}-id-${calls.length}` }, error: null });
                },
              };
            },
          };
        },
      };
    },
  };
  const result = await applyImportPlan(plan, client);
  assert.equal(result.menus, 1);
  assert.equal(result.capabilities, 1);
  assert.equal(result.venueMapsNotApplied, 50);
  assert.ok(calls.filter((call) => call.table === "venue_action_capabilities").flatMap((call) => call.payload).every((row) => row.version === 1));
  assert.ok(calls.flatMap((call) => Array.isArray(call.payload) ? call.payload : [call.payload]).every((row) => row.verified_at === undefined || row.verified_at === null));
  assert.ok(calls.filter((call) => call.table === "menu_items").flatMap((call) => call.payload).every((row) =>
    !("editorial_pick" in row) && !("editorial_note" in row)
  ));
  const itemPayloads = calls.filter((call) => call.table === "menu_items").flatMap((call) => call.payload);
  assert.ok(itemPayloads.some((row) => row.price_text != null));
  const pricedIdr = itemPayloads.find((row) => row.currency === "IDR" && row.price_minor != null);
  assert.equal(pricedIdr.price_minor, plan.menus[0].sections.flatMap((section) => section.items).find((item) => item.currency === "IDR" && item.priceMinor != null).priceMinor);
});

test("apply preflight refuses any existing target menu or capability rows, including drafts", async () => {
  const plan = {
    menus: [{ venueSlug: "venue", version: 1 }],
    capabilities: [{ venueSlug: "venue", kind: "website", provider: "official", version: 1 }],
  };
  const client = {
    from(table) {
      return {
        select() {
          return {
            limit() {
              return Promise.resolve({
                data: table === "menus"
                  ? [{ id: "menu-existing", venue_slug: "venue", version: 1 }]
                  : table === "venue_action_capabilities"
                    ? [{ id: "cap-existing", venue_slug: "venue", kind: "website", provider: "official", version: 1 }]
                    : [],
                error: null,
              });
            },
            in(_field, values) {
              return Promise.resolve({
                data: table === "venues" ? values.map((slug) => ({ slug })) : [],
                error: null,
              });
            },
          };
        },
      };
    },
  };
  await assert.rejects(() => preflightDisposableStagingTarget(plan, client), /must be completely empty/);
});

test("apply preflight fails before writes when price_text schema support is absent", async () => {
  const plan = { menus: [], capabilities: [] };
  const client = {
    from(table) {
      return {
        select() {
          return {
            limit() {
              return table === "menu_items"
                ? Promise.resolve({ data: null, error: { message: "column price_text does not exist" } })
                : Promise.resolve({ data: [], error: null });
            },
          };
        },
      };
    },
  };
  await assert.rejects(() => preflightDisposableStagingTarget(plan, client), /preflight menu_items\.price_text schema and empty target/);
});

test("apply preflight requires every candidate venue in staging", async () => {
  const plan = { menus: [{ venueSlug: "missing", version: 1 }], capabilities: [] };
  const client = {
    from() {
      return {
        select() {
          return {
            limit() { return Promise.resolve({ data: [], error: null }); },
            in() { return Promise.resolve({ data: [], error: null }); },
          };
        },
      };
    },
  };
  await assert.rejects(() => preflightDisposableStagingTarget(plan, client), /staging is missing candidate venues/);
});

test("recomputes package digest and rejects tampered candidate content", async () => {
  const compiled = compileDataOps(await loadDataOpsInputs(process.cwd()));
  const tampered = structuredClone(compiled.candidates);
  tampered.menus[0].title = "Tampered title";
  assert.throws(() => buildImportPlan(tampered), /does not match the recomputed package content digest/);
});

test("canonical apply package must be rebuilt from exactly 55 files and match byte-for-byte", async () => {
  const inputs = await loadDataOpsInputs(process.cwd());
  const compiled = compileDataOps(inputs);
  const bytes = serializeDataOpsCandidates(compiled.candidates);
  assert.doesNotThrow(() => assertCanonicalDataOpsCandidateBytes(bytes, compiled.candidates, inputs.inputFiles.length));
  assert.throws(() => assertCanonicalDataOpsCandidateBytes(`${bytes} `, compiled.candidates, inputs.inputFiles.length), /not byte-identical/);
  assert.throws(() => assertCanonicalDataOpsCandidateBytes(bytes, compiled.candidates, 54), /exactly 55 raw Data Ops files/);
});

test("rejects duplicate IDs, missing provenance and non-v1 imports even with a recomputed digest", async () => {
  const compiled = compileDataOps(await loadDataOpsInputs(process.cwd()));

  const duplicateId = structuredClone(compiled.candidates);
  duplicateId.capabilities[0].id = duplicateId.menus[0].id;
  duplicateId.packageDigest = computeDataOpsPackageDigest(duplicateId);
  assert.throws(() => buildImportPlan(duplicateId), /candidate IDs are not unique/i);

  const missingProvenance = structuredClone(compiled.candidates);
  delete missingProvenance.capabilities[0].provenance;
  missingProvenance.packageDigest = computeDataOpsPackageDigest(missingProvenance);
  assert.throws(() => buildImportPlan(missingProvenance), /missing provenance/);

  const versionTwo = structuredClone(compiled.candidates);
  versionTwo.capabilities[0].version = 2;
  versionTwo.packageDigest = computeDataOpsPackageDigest(versionTwo);
  assert.throws(() => buildImportPlan(versionTwo), /initial Data Ops import version must equal 1|only version=1/);
});

test("direct apply refuses a package whose staging release gate is closed before touching a client", async () => {
  const compiled = compileDataOps(await loadDataOpsInputs(process.cwd()));
  const plan = buildImportPlan(compiled.candidates);
  plan.releaseGates = {
    ...plan.releaseGates,
    denominatorReconciled: false,
    readyForStagingApply: false,
  };
  let touched = false;
  const client = { from() { touched = true; throw new Error("must not touch client"); } };
  await assert.rejects(() => applyImportPlan(plan, client), /release gates do not authorize staging writes/);
  assert.equal(touched, false);
});
