#!/usr/bin/env node
import { parseValidationCliArgs, printReport, readCandidate, validateMenu } from "./validation-core.mjs";

try {
  const { mode, path } = parseValidationCliArgs(process.argv.slice(2));
  const candidate = await readCandidate(path);
  const rows = Array.isArray(candidate) ? candidate : candidate.menus;
  if (!Array.isArray(rows)) throw new Error("Expected a JSON array or an object with a menus array.");
  process.exitCode = printReport(rows.map((row, index) => validateMenu(row, index, { mode })), { mode });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
