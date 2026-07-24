#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import {
  DEFAULT_T0_ORIGIN,
  runT0IndexabilityAudit,
} from "./t0-indexability-core.mjs";

function parseOptions(argv) {
  let baseUrl = process.env.OTHERBALI_T0_BASE_URL ?? DEFAULT_T0_ORIGIN;
  let includeBranchTargets = false;
  for (const argument of argv) {
    if (argument.startsWith("--base-url=")) {
      baseUrl = argument.slice("--base-url=".length);
    } else if (argument === "--include-branch-targets") {
      includeBranchTargets = true;
    } else if (!argument.startsWith("-")) {
      baseUrl = argument;
    } else {
      throw new Error(`Unknown option: ${argument}`);
    }
  }
  return { baseUrl, includeBranchTargets };
}

try {
  const manifest = JSON.parse(await readFile(new URL("./t0-indexability-samples.json", import.meta.url), "utf8"));
  const options = parseOptions(process.argv.slice(2));
  const selectedManifest = options.includeBranchTargets
    ? { ...manifest, samples: [...manifest.samples, ...(manifest.branchTargets ?? [])] }
    : manifest;
  const report = await runT0IndexabilityAudit({
    baseUrl: options.baseUrl,
    manifest: selectedManifest,
  });
  console.log(JSON.stringify(report, null, 2));
  if (!report.ok) process.exitCode = 1;
} catch (error) {
  console.log(JSON.stringify({
    ok: false,
    fatal: error instanceof Error ? error.message : String(error),
  }, null, 2));
  process.exitCode = 1;
}
