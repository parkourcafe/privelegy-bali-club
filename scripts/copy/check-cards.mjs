// The gate for a batch of rewritten venue cards (a change list in the
// build-copy-sql.mjs format). Per card, the three copy fields are one record:
// a fact may move from why_its_here to not_for, but nothing may be added that
// the card's live text, name, area or district did not already hold. Per
// field: 0 FAIL on the machine-pattern list, the category-formula opener
// included. Per batch: no field duplicated across cards and no cluster of three
// or more near-identical descriptions — a warmer template is still a template.
//
//   node scripts/copy/check-cards.mjs <change-list.csv> [--places <crawl.csv>] [--report out.csv]
//
// Exit 1 when any card fails.

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { factDiff } from "./fact-diff.mjs";
import { norm, parseCsv } from "./lint.mjs";
import { lintText } from "./patterns.mjs";

const REPO = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const FIELDS = ["why_its_here", "best_for", "not_for"];

// parseCsv skips leading "#" comment lines and returns header-keyed rows.
const readRows = (path) => parseCsv(readFileSync(path, "utf8")).map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v ?? ""])));

const words = (t) => (t.match(/\S+/g) ?? []).length;
const shingles = (s) => {
  const w = norm(s).split(" ").filter(Boolean);
  const out = new Set();
  for (let i = 0; i + 5 <= w.length; i += 1) out.add(w.slice(i, i + 5).join(" "));
  return out;
};

export function checkCards(changeRows, placesRows) {
  const live = new Map(placesRows.map((r) => [r.slug, r]));
  const bySlug = new Map();
  for (const r of changeRows) {
    if (r.surface.trim() !== "db") continue;
    // Controls and holds carry the live text on purpose; only real edits are gated.
    if (["HOLD", "NO CHANGE"].includes((r.decision ?? "").trim().toUpperCase()) || r.after === r.before) continue;
    bySlug.set(r.slug_or_path.trim(), [...(bySlug.get(r.slug_or_path.trim()) ?? []), r]);
  }
  const cards = [];
  for (const [slug, rows] of bySlug) {
    const p = live.get(slug);
    const problems = [];
    const notes = [];
    if (!p) {
      cards.push({ slug, verdict: "FAIL", problems: ["slug not in the crawl"], notes: [], rows });
      continue;
    }
    const current = { why_its_here: p.verdict || p.why_its_here || "", best_for: p.best_for || "", not_for: p.not_for || "" };
    const next = { ...current };
    for (const r of rows) {
      if (!FIELDS.includes(r.field)) problems.push(`${r.field}: not a card copy field`);
      if (r.before !== current[r.field]) problems.push(`${r.field}: before is not the live text`);
      next[r.field] = r.after;
    }
    const before = FIELDS.map((f) => current[f]).filter(Boolean).join("\n");
    const after = FIELDS.map((f) => next[f]).filter(Boolean).join("\n");
    const fd = factDiff(before, after, { mode: "style", allowed: { names: [p.name], area: p.where ?? "", district: p.district ?? "" } });
    if (fd.verdict !== "PASS") problems.push(`fact-diff REJECT: ${fd.rejects.map((x) => `${x.type}:${x.token}`).join(", ")}`);
    if (fd.dropped.length) notes.push(`dropped ${fd.dropped.map((x) => `${x.type}:${x.token}`).join(", ")}`);
    let warnBefore = 0;
    let warnAfter = 0;
    for (const r of rows) {
      const lb = lintText(r.before, { field: r.field, names: [p.name] });
      const la = lintText(r.after, { field: r.field, names: [p.name], isNew: true });
      warnBefore += lb.warns.length;
      warnAfter += la.warns.length;
      if (la.fails.length) problems.push(`${r.field}: FAIL ${la.fails.map((f) => `${f.code}:${f.match}`).join(", ")}`);
      if (r.field === "best_for" && /\.\s*$/.test(r.after)) problems.push("best_for ends with a full stop (the mobile API sets it inside a sentence)");
      if (r.field === "why_its_here" && r.after) {
        const n = words(r.after);
        if (n < 15 || n > 55) notes.push(`why_its_here is ${n} words (standard: 20–45)`);
      }
      if (!r.after && r.action !== "null") problems.push(`${r.field}: empty after without action null`);
    }
    if (warnAfter > warnBefore) problems.push(`WARN rose ${warnBefore} → ${warnAfter}`);
    cards.push({ slug, verdict: problems.length ? "FAIL" : "PASS", problems, notes, rows, warnBefore, warnAfter });
  }

  // Batch-level: exact duplicates and near-duplicate clusters among the new texts.
  const batch = [];
  for (const field of FIELDS) {
    const seen = new Map();
    for (const c of cards) {
      const r = c.rows.find((x) => x.field === field && x.after);
      if (!r) continue;
      const key = norm(r.after);
      if (seen.has(key)) batch.push(`${field}: "${r.after.slice(0, 60)}" on ${seen.get(key)} and ${c.slug}`);
      else seen.set(key, c.slug);
    }
  }
  const whys = cards.map((c) => ({ slug: c.slug, sh: shingles(c.rows.find((x) => x.field === "why_its_here")?.after ?? "") })).filter((x) => x.sh.size >= 3);
  const parent = whys.map((_, i) => i);
  const root = (i) => (parent[i] === i ? i : (parent[i] = root(parent[i])));
  for (let i = 0; i < whys.length; i += 1) {
    for (let j = i + 1; j < whys.length; j += 1) {
      let inter = 0;
      for (const x of whys[i].sh) if (whys[j].sh.has(x)) inter += 1;
      if (inter && inter / (whys[i].sh.size + whys[j].sh.size - inter) >= 0.8) parent[root(i)] = root(j);
    }
  }
  const clusters = new Map();
  whys.forEach((x, i) => clusters.set(root(i), [...(clusters.get(root(i)) ?? []), x.slug]));
  for (const list of clusters.values()) if (list.length >= 3) batch.push(`near-identical why_its_here (Jaccard ≥ 0.8): ${list.join(", ")}`);
  // Openings: five cards starting with the same three words read as one scheme.
  const openers = new Map();
  for (const c of cards) {
    const t = c.rows.find((x) => x.field === "why_its_here")?.after;
    if (!t) continue;
    const key = norm(t).split(" ").slice(0, 3).join(" ");
    openers.set(key, [...(openers.get(key) ?? []), c.slug]);
  }
  const openerNotes = [...openers].filter(([, l]) => l.length >= 5).map(([k, l]) => `"${k}…" opens ${l.length} cards`);
  return { cards, batch, openerNotes };
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const opt = (flag, fallback) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : fallback);
  const list = args.find((a, i) => !a.startsWith("--") && !["--places", "--report"].includes(args[i - 1]));
  const places = readRows(opt("--places", join(REPO, "docs/audits/2026-09-28-web/places.csv")));
  const { cards, batch, openerNotes } = checkCards(readRows(list), places);
  const fails = cards.filter((c) => c.verdict === "FAIL");
  console.log(`${list}: ${cards.length} cards · ${fails.length} FAIL · batch problems ${batch.length}`);
  for (const c of fails) console.log(`  FAIL ${c.slug}: ${c.problems.join(" | ")}`);
  for (const b of batch) console.log(`  BATCH ${b}`);
  for (const o of openerNotes) console.log(`  note ${o}`);
  const report = opt("--report", null);
  if (report) {
    const header = ["slug", "verdict", "problems", "notes", "warn_before", "warn_after"];
    writeFileSync(report, `${header.join(",")}\n${cards.map((c) => [c.slug, c.verdict, c.problems.join(" | "), c.notes.join(" | "), c.warnBefore ?? "", c.warnAfter ?? ""].map(csvCell).join(",")).join("\n")}\n`);
  }
  process.exit(fails.length || batch.length ? 1 : 0);
}
