// CLI for the deterministic resort-CSV importer (IA spec §9).
//
//   node --import tsx scripts/import-resort-csv.ts <input.csv> [--dry-run]
//
// Writes data/resort-import/{properties,venues,offers}.json + report.json
// (sorted, stable) unless --dry-run, which prints the review report only.
// Never publishes anything (all rows land as publicationStatus "review") and
// never touches a database.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { importResortCsv } from "../lib/domain/resort-import.ts";

const [input, flag] = process.argv.slice(2);
if (!input) {
  console.error("usage: node --import tsx scripts/import-resort-csv.ts <input.csv> [--dry-run]");
  process.exit(2);
}
const dryRun = flag === "--dry-run";
const out = importResortCsv(readFileSync(input, "utf8"));

const summary = {
  input,
  dryRun,
  accepted: out.report.accepted,
  rejected: out.report.rejected,
  warnings: out.report.warnings,
};

if (!dryRun) {
  const dir = join(process.cwd(), "data", "resort-import");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "properties.json"), JSON.stringify(out.properties, null, 2) + "\n");
  writeFileSync(join(dir, "venues.json"), JSON.stringify(out.venues, null, 2) + "\n");
  writeFileSync(join(dir, "offers.json"), JSON.stringify(out.offers, null, 2) + "\n");
  writeFileSync(join(dir, "report.json"), JSON.stringify(summary, null, 2) + "\n");
}
console.log(JSON.stringify(summary, null, 2));
process.exit(out.report.rejected.length > 0 ? 1 : 0);
