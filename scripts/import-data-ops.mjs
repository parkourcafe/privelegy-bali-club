#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compileDataOps, loadDataOpsInputs } from "./data-ops-compiler-core.mjs";
import {
  applyImportPlan,
  assertCanonicalDataOpsCandidateBytes,
  assertStagingApplyEnvironment,
  buildImportPlan,
} from "./data-ops-import-core.mjs";

function parseArgs(argv) {
  let root = process.cwd();
  let input = "data/data-ops/compiled/candidates.json";
  let apply = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") input = argv[++index];
    else if (arg === "--root") root = argv[++index];
    else if (arg === "--apply") apply = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  const resolvedRoot = resolve(root);
  return { root: resolvedRoot, input: resolve(resolvedRoot, input), apply };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const candidateBytes = await readFile(args.input, "utf8");
  let plan;
  if (args.apply) {
    const canonicalInputs = await loadDataOpsInputs(args.root);
    const canonical = compileDataOps(canonicalInputs);
    plan = assertCanonicalDataOpsCandidateBytes(candidateBytes, canonical.candidates, canonicalInputs.inputFiles.length);
  } else {
    plan = buildImportPlan(JSON.parse(candidateBytes));
  }
  if (!args.apply) {
    console.log(JSON.stringify({
      mode: "dry-run",
      applied: false,
      input: args.input,
      inputDigest: plan.inputDigest,
      packageDigest: plan.packageDigest,
      counts: plan.counts,
      releaseGates: plan.releaseGates,
      next: plan.releaseGates.readyForStagingApply
        ? "The package may proceed only to an empty disposable staging target under the documented apply gates."
        : "Apply remains blocked by the compiled release gates; this command is review-only.",
    }, null, 2));
  } else {
    const staging = assertStagingApplyEnvironment(plan);
    const { createClient } = await import("@supabase/supabase-js");
    const client = createClient(staging.url, staging.serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
    const applied = await applyImportPlan(plan, client);
    console.log(JSON.stringify({
      mode: "staging-apply",
      applied: true,
      projectRef: staging.projectRef,
      inputDigest: plan.inputDigest,
      packageDigest: plan.packageDigest,
      counts: applied,
    }, null, 2));
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
