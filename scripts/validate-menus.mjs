#!/usr/bin/env node
import { printReport, readCandidate, validateMenu } from "./validation-core.mjs";

try {
  const candidate = await readCandidate(process.argv[2]);
  const rows = Array.isArray(candidate) ? candidate : candidate.menus;
  if (!Array.isArray(rows)) throw new Error("Expected a JSON array or an object with a menus array.");
  process.exitCode = printReport(rows.map(validateMenu));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}

