#!/usr/bin/env node
import { parseValidationCliArgs, printReport, readCandidate, validateCapability } from "./validation-core.mjs";

try {
  const { mode, path } = parseValidationCliArgs(process.argv.slice(2));
  const candidate = await readCandidate(path);
  const rows = Array.isArray(candidate) ? candidate : candidate.capabilities;
  if (!Array.isArray(rows)) throw new Error("Expected a JSON array or an object with a capabilities array.");
  process.exitCode = printReport(rows.map((row, index) => validateCapability(row, index, { mode })), { mode });
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}
