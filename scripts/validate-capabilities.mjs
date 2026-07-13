#!/usr/bin/env node
import { printReport, readCandidate, validateCapability } from "./validation-core.mjs";

try {
  const candidate = await readCandidate(process.argv[2]);
  const rows = Array.isArray(candidate) ? candidate : candidate.capabilities;
  if (!Array.isArray(rows)) throw new Error("Expected a JSON array or an object with a capabilities array.");
  process.exitCode = printReport(rows.map(validateCapability));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
}

