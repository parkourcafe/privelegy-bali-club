// Holds the line on public copy while the rewrite runs: no code file or resort
// page may gain a FAIL, and none may add WARN hits faster than it already has
// them. A rewrite wave lowers the numbers; after it is approved, `--write`
// records the new floor, so the baseline only ever moves down.
//
//   node scripts/copy/ratchet.mjs           # compare, exit 1 on a regression
//   node scripts/copy/ratchet.mjs --write   # record the current numbers
//
// Database copy is not ratcheted here: it does not live in the repository, and
// its gate is the per-row lint + fact-diff step before any SQL.

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "./lint.mjs";

const REPO = resolve(fileURLToPath(new URL("../..", import.meta.url)));
export const BASELINE_PATH = join(REPO, "scripts/copy/baseline.json");
// The crawl only lends venue names to the mask, so a venue called "Hidden Gem"
// in a code string is not counted as hype.
const PLACES = join(REPO, "docs/audits/2026-09-28-web/places.csv");

const sum = (o) => Object.values(o ?? {}).reduce((n, x) => n + x, 0);

export async function measure() {
  const { summary } = await run({ places: PLACES, code: true, resort: true });
  const pick = (entries, prefix) =>
    Object.fromEntries(
      Object.entries(entries).map(([k, v]) => [
        `${prefix}${k}`,
        { words: v.words, fails: v.fails, warns: sum(v.warns) },
      ]),
    );
  return { ...pick(summary.byFile, ""), ...pick(summary.byPage, "resort:") };
}

// A file passes when no FAIL code grew and its WARN hits either did not grow or
// grew more slowly than its words (density did not rise). The density branch
// lets clean new paragraphs in without a baseline update.
export function compare(baseline, current) {
  const problems = [];
  for (const [file, now] of Object.entries(current)) {
    const was = baseline[file];
    if (!was) {
      if (sum(now.fails)) problems.push(`${file}: new file with FAIL ${JSON.stringify(now.fails)}`);
      continue;
    }
    for (const [code, n] of Object.entries(now.fails)) {
      if (n > (was.fails[code] ?? 0)) problems.push(`${file}: ${code} FAIL ${was.fails[code] ?? 0} → ${n}`);
    }
    const densityWas = was.words ? was.warns / was.words : 0;
    const densityNow = now.words ? now.warns / now.words : 0;
    if (now.warns > was.warns && densityNow > densityWas) {
      problems.push(`${file}: WARN ${was.warns} → ${now.warns} (${(densityWas * 1000).toFixed(1)} → ${(densityNow * 1000).toFixed(1)} per 1,000 words)`);
    }
  }
  return problems;
}

export async function readBaseline() {
  return JSON.parse(await readFile(BASELINE_PATH, "utf8")).files;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const current = await measure();
  if (process.argv.includes("--write")) {
    const date = process.argv[process.argv.indexOf("--write") + 1];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
      console.error("usage: ratchet.mjs --write YYYY-MM-DD");
      process.exit(2);
    }
    const body = { date, note: "Per code file and resort page: words, FAIL counts by rule, WARN hits. Lower it after an approved rewrite wave; never raise it to make a test pass.", files: current };
    await writeFile(BASELINE_PATH, `${JSON.stringify(body, null, 2)}\n`);
    console.log(`baseline written: ${Object.keys(current).length} files`);
  } else {
    const problems = compare(await readBaseline(), current);
    if (problems.length) {
      console.error(problems.join("\n"));
      process.exit(1);
    }
    console.log(`copy ratchet: ${Object.keys(current).length} files at or below baseline`);
  }
}
