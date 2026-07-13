#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { compileDataOps, loadDataOpsInputs } from "./data-ops-compiler-core.mjs";

function parseArgs(argv) {
  let root = process.cwd();
  let output = "data/data-ops/compiled";
  let check = false;
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--root") root = argv[++index];
    else if (arg === "--output") output = argv[++index];
    else if (arg === "--check") check = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return { root: resolve(root), output, check };
}

try {
  const args = parseArgs(process.argv.slice(2));
  const inputs = await loadDataOpsInputs(args.root);
  const compiled = compileDataOps(inputs);
  const outputRoot = resolve(args.root, args.output);
  const candidateMetadata = Object.fromEntries(
    Object.entries(compiled.candidates).filter(([key]) => !["menus", "capabilities", "venueMapsCandidates"].includes(key))
  );
  const files = {
    "candidates.json": compiled.candidates,
    "menus.json": {
      ...candidateMetadata,
      menus: compiled.candidates.menus,
    },
    "capabilities.json": {
      ...candidateMetadata,
      capabilities: compiled.candidates.capabilities,
    },
    "venue-maps.json": {
      ...candidateMetadata,
      targetField: "venues.gmaps_url",
      venueMapsCandidates: compiled.candidates.venueMapsCandidates,
    },
    "sources.json": compiled.sources,
    "rejections.json": compiled.rejections,
    "coverage-report.json": compiled.coverageReport,
  };
  if (args.check) {
    for (const [name, value] of Object.entries(files)) {
      const expected = `${JSON.stringify(value, null, 2)}\n`;
      const existing = await readFile(resolve(outputRoot, name), "utf8");
      if (existing !== expected) throw new Error(`Compiled artifact is stale: ${name}`);
    }
  } else {
    await mkdir(outputRoot, { recursive: true });
    for (const [name, value] of Object.entries(files)) {
      await writeFile(resolve(outputRoot, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
    }
  }
  console.log(JSON.stringify({
    mode: args.check ? "check" : "compile",
    output: args.check ? null : outputRoot,
    inputDigest: compiled.coverageReport.inputDigest,
    packageDigest: compiled.coverageReport.packageDigest,
    denominator: compiled.coverageReport.denominator,
    inputs: compiled.coverageReport.inputs,
    outputs: compiled.coverageReport.outputs,
    exclusions: compiled.coverageReport.exclusions,
    gates: compiled.coverageReport.gates,
  }, null, 2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
