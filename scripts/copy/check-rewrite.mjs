// The gate a rewrite passes before it is kept. Compares prose in the working
// tree with the same file at a git ref (HEAD by default), pairs the units, and
// for every changed one checks that
//   - no fact was added: fact-diff against the same unit's old text. Only names
//     may come from elsewhere in the file (the page's own place names); a
//     number, price, dish or evaluative word must come from the unit itself,
//     because "three or four nights" elsewhere in a guide must not license
//     turning "three full days" into "four";
//   - no machine pattern was introduced: 0 FAIL, and the file's WARN total does
//     not rise;
//   - nothing a test pins, and no FAQ question, heading or title, was touched.
// Dropped facts are listed, never blocked: a deliberate deletion is allowed but
// has to be visible.
//
//   node scripts/copy/check-rewrite.mjs <file> [<file> …] [--ref HEAD] [--report out.csv] [--allow-structure <file>[:<path>]]
//   node scripts/copy/check-rewrite.mjs --resort [--ref HEAD] [--report out.csv]
//
// Exit 1 when any changed unit fails.

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractProse } from "./extract-code-prose.mjs";
import { extractFacts, factDiff } from "./fact-diff.mjs";
import { resortUnits } from "./lint.mjs";
import { lintText } from "./patterns.mjs";

const REPO = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const FROZEN_FIELDS = new Set(["faq_q", "heading", "title", "meta_title"]);
const RESORT_JSON = "data/resort-fnb/pages.generated.json";

const atRef = (ref, file) => {
  try {
    return execFileSync("git", ["show", `${ref}:${file}`], { cwd: REPO, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return null;
  }
};

// A record is the top-level entry a unit sits in (GUIDES[3], NUSA_DUA_FAQ, a
// resort page); facts may move freely inside it.
const recordOf = (path) => path.match(/^[^.[]*\[\d+\]/)?.[0] ?? path.split(/[.[]/)[0];

// Pairs units in order within each path: a rewrite changes text, not structure.
function pair(before, after) {
  const group = (units) => {
    const m = new Map();
    for (const u of units) m.set(u.path, [...(m.get(u.path) ?? []), u]);
    return m;
  };
  const b = group(before);
  const a = group(after);
  const pairs = [];
  const structural = [];
  for (const path of new Set([...b.keys(), ...a.keys()])) {
    const bl = b.get(path) ?? [];
    const al = a.get(path) ?? [];
    if (bl.length !== al.length) structural.push(`${path}: ${bl.length} unit(s) before, ${al.length} after`);
    for (let i = 0; i < Math.min(bl.length, al.length); i += 1) pairs.push([bl[i], al[i]]);
  }
  return { pairs, structural };
}

const failCodes = (r) => r.fails.map((f) => f.code);

export function checkUnits(beforeUnits, afterUnits, { label }) {
  const { pairs, structural } = pair(beforeUnits, afterUnits);
  const beforeByRecord = new Map();
  for (const u of beforeUnits) {
    const key = recordOf(u.path);
    beforeByRecord.set(key, `${beforeByRecord.get(key) ?? ""}\n${u.text}`);
  }
  const afterByRecord = new Map();
  for (const u of afterUnits) {
    const key = recordOf(u.path);
    afterByRecord.set(key, `${afterByRecord.get(key) ?? ""}\n${u.text}`);
  }
  const fileNames = [...new Set(extractFacts(beforeUnits.map((u) => u.text).join("\n")).facts.filter((f) => f.type === "PROPER").map((f) => f.token))];
  const rows = [];
  let warnBefore = 0;
  let warnAfter = 0;
  for (const [b, a] of pairs) {
    const lb = lintText(b.text, { field: b.field ?? b.lintField ?? null });
    const la = lintText(a.text, { field: a.field ?? a.lintField ?? null });
    warnBefore += lb.warns.length;
    warnAfter += la.warns.length;
    if (b.text === a.text) continue;
    const problems = [];
    if (b.pinned) problems.push("pinned by a test");
    if (FROZEN_FIELDS.has(b.field)) problems.push(`${b.field} is frozen (search intent / ranking)`);
    const fd = factDiff(b.text, a.text, { mode: "style", allowed: { names: fileNames } });
    if (fd.verdict !== "PASS") problems.push(`fact-diff REJECT: ${fd.rejects.map((r) => `${r.type}:${r.token}`).join(", ")}`);
    const newFails = failCodes(la).filter((c) => !failCodes(lb).includes(c));
    if (la.fails.length) problems.push(`lint FAIL after: ${la.fails.map((f) => `${f.code}:${f.match}`).join(", ")}${newFails.length ? "" : " (already in before)"}`);
    rows.push({
      file: label,
      path: b.path,
      line: b.line ?? "",
      before: b.text,
      after: a.text,
      verdict: problems.length ? "FAIL" : "PASS",
      problems: problems.join(" | "),
      lint_before: [...lb.fails.map((f) => `F:${f.code}`), ...lb.warns.map((w) => w.code)].join(" "),
      lint_after: [...la.fails.map((f) => `F:${f.code}`), ...la.warns.map((w) => w.code)].join(" "),
      warns: fd.warns.map((w) => `${w.type}:${w.token}`).join(" "),
    });
  }
  // Record-level drops: a fact that left the record entirely.
  const dropped = [];
  for (const [record, beforeText] of beforeByRecord) {
    const afterText = afterByRecord.get(record);
    if (afterText === undefined || afterText === beforeText) continue;
    const fd = factDiff(beforeText, afterText, { mode: "style" });
    for (const d of fd.dropped) dropped.push(`${record}: ${d.type}:${d.token}`);
  }
  return { rows, structural, dropped, warnBefore, warnAfter };
}

function codeFile(file, ref) {
  const old = atRef(ref, file);
  if (old === null) return { label: file, rows: [], structural: [`${file}: not in ${ref}`], dropped: [], warnBefore: 0, warnAfter: 0 };
  const before = extractProse(file, old);
  const after = extractProse(file, readFileSync(join(REPO, file), "utf8"));
  return { label: file, ...checkUnits(before, after, { label: file }) };
}

function resort(ref) {
  const toUnits = (pages) =>
    resortUnits(pages).map((u) => ({ path: `${u.slug}[0].${u.path}`, text: u.text, field: null, lintField: u.field, pinned: false }));
  const old = atRef(ref, RESORT_JSON);
  const before = toUnits(JSON.parse(old));
  const after = toUnits(JSON.parse(readFileSync(join(REPO, RESORT_JSON), "utf8")));
  return { label: RESORT_JSON, ...checkUnits(before, after, { label: RESORT_JSON }) };
}

// A unit that appears or disappears has no partner to be checked against, so
// it would skip the fact, pinned-copy and frozen-heading checks. It fails the
// gate unless the run names it with --allow-structure "<file>" (or
// "<file>:<path>") after a person has looked at the change.
export function structuralVerdicts(result, allowed) {
  const unaccepted = [];
  const accepted = [];
  for (const s of result.structural) {
    const ok = allowed.some((a) => a === result.label || `${result.label}:${s}`.startsWith(a));
    (ok ? accepted : unaccepted).push(s);
  }
  return { unaccepted, accepted };
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const take = (flag) => {
    const i = args.indexOf(flag);
    if (i < 0) return null;
    const v = args[i + 1];
    args.splice(i, 2);
    return v;
  };
  const ref = take("--ref") ?? "HEAD";
  const report = take("--report");
  const allowed = [];
  for (let a = take("--allow-structure"); a !== null; a = take("--allow-structure")) allowed.push(a);
  const wantResort = args.includes("--resort");
  const files = args.filter((a) => !a.startsWith("--"));
  const results = [...files.map((f) => codeFile(f, ref)), ...(wantResort ? [resort(ref)] : [])];
  let failed = 0;
  const all = [];
  for (const r of results) {
    const fails = r.rows.filter((x) => x.verdict === "FAIL");
    failed += fails.length;
    const { unaccepted, accepted } = structuralVerdicts(r, allowed);
    failed += unaccepted.length;
    const warnRise = r.warnAfter > r.warnBefore;
    if (warnRise) failed += 1;
    all.push(...r.rows);
    console.log(`${r.label}: ${r.rows.length} changed · ${fails.length} FAIL · WARN ${r.warnBefore} → ${r.warnAfter}${warnRise ? " (ROSE)" : ""}`);
    for (const x of fails) console.log(`  FAIL ${x.path}: ${x.problems}\n    after: ${x.after.slice(0, 160)}`);
    for (const s of unaccepted) console.log(`  STRUCTURE FAIL ${s}`);
    for (const s of accepted) console.log(`  STRUCTURE accepted ${s}`);
    for (const d of r.dropped) console.log(`  dropped ${d}`);
  }
  if (report) {
    const header = ["file", "path", "line", "verdict", "problems", "before", "after", "lint_before", "lint_after", "warns"];
    writeFileSync(report, `${header.join(",")}\n${all.map((r) => header.map((h) => csvCell(r[h])).join(",")).join("\n")}\n`);
  }
  process.exit(failed ? 1 : 0);
}
