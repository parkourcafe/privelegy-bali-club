// Assembles the pilot's change-list.csv from drafts.json, the blind reader's
// verdicts and the two gates (copy-lint, fact-diff), so the founder reviews one
// table instead of four files.
//
//   node data/data-ops/copy/pilot/tools/build-change-list.mjs
//
// Writes change-list.csv and gates.json next to drafts.json. Nothing here
// touches the database or the site.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PILOT = resolve(HERE, "..");
const REPO = resolve(PILOT, "../../../..");

const { lintText } = await import(join(REPO, "scripts/copy/patterns.mjs"));
const { factDiff } = await import(join(REPO, "scripts/copy/fact-diff.mjs"));

const drafts = JSON.parse(readFileSync(join(PILOT, "drafts.json"), "utf8"));
const key = JSON.parse(readFileSync(join(PILOT, "ab-key.json"), "utf8"));
const verdicts = JSON.parse(readFileSync(join(PILOT, "reader-verdicts.json"), "utf8"));
const cards = JSON.parse(readFileSync(join(PILOT, "units-cards.json"), "utf8"));

const csvCell = (v) => {
  const s = v === null || v === undefined ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// The reader saw A/B in random order; the key says which side was the rewrite.
const readerByUnit = new Map();
for (const v of verdicts) {
  const k = key.find((x) => x.pair === v.pair);
  if (!k || k.kind === "canary") continue;
  const prefers = v.prefers === "A" || v.prefers === "B" ? k[v.prefers] : "none";
  readerByUnit.set(k.id, { prefers, sameFacts: v.same_facts, diff: v.fact_difference ?? "", note: v.note ?? "" });
}

const codes = (r) => [...r.fails.map((f) => f.code), ...r.warns.map((w) => w.code)].join(" ");
const lintOf = (text, field, ctx) => lintText(text, { field, names: ctx.names, areas: ctx.areas, isNew: true });

const rows = [];
const gates = [];
const FIELDS = ["why_its_here", "best_for", "not_for"];

for (const c of drafts.cards) {
  const meta = cards.find((x) => x.slug === c.slug) ?? {};
  const ctx = { names: [meta.name ?? c.slug], areas: [c.district, meta.where ?? ""].filter(Boolean) };
  // Facts may move between fields (rung 2), so the guard compares the whole
  // record, not field by field; the per-field lint still runs on each field.
  const beforeAll = FIELDS.map((f) => c.before[f] ?? "").join("\n");
  const afterAll = FIELDS.map((f) => c.after[f] ?? "").join("\n");
  const fd = factDiff(beforeAll, afterAll, { allowed: { names: ctx.names, area: meta.where ?? "", district: c.district }, mode: "style" });
  const reader = readerByUnit.get(c.slug) ?? {};
  gates.push({ unit: c.slug, factDiff: fd });
  for (const f of FIELDS) {
    const before = c.before[f] ?? "";
    const after = c.after[f] ?? "";
    if (!before && !after) continue;
    const lb = lintOf(before, f, ctx);
    const la = lintOf(after, f, ctx);
    rows.push({
      unit_id: `P-${c.slug}`,
      surface: "db",
      slug_or_path: c.slug,
      field: f,
      before,
      after,
      words_before: before.split(/\s+/).filter(Boolean).length,
      words_after: after.split(/\s+/).filter(Boolean).length,
      lint_before: `${lb.fails.length}F/${lb.warns.length}W ${codes(lb)}`.trim(),
      lint_after: `${la.fails.length}F/${la.warns.length}W ${codes(la)}`.trim(),
      fact_diff: f === "why_its_here" ? `${fd.verdict}; rejects ${fd.rejects.length}; dropped ${fd.dropped.length}; warns ${fd.warns.length}` : "see why_its_here row (record-level)",
      reader_same_facts: reader.sameFacts ?? "",
      reader_prefers: reader.prefers ?? "",
      dropped_named: (c.dropped ?? []).join(" | "),
      decision: "",
      note: f === "why_its_here" ? (reader.diff || reader.note || "") : "",
    });
  }
}

// Code units: guide, pillar. One row per text block.
const g = drafts.guide;
const guideBlocks = [["description", g.before.description, g.after.description], ["lede", g.before.lede, g.after.lede]];
for (const k of ["s1", "s2", "s3", "s4"]) g.before[k].forEach((b, i) => guideBlocks.push([`${k}[${i}]`, b, g.after[k][i]]));
g.before.faq.forEach((q, i) => guideBlocks.push([`faq[${i}].a`, q.a, g.after.faq[i].a]));
const guideBefore = guideBlocks.map((b) => b[1]).join("\n");
const guideAfter = guideBlocks.map((b) => b[2]).join("\n");
const gfd = factDiff(guideBefore, guideAfter, { allowed: { names: ["Bali", "Other Bali"], area: "", district: "" }, mode: "style" });
gates.push({ unit: "guide:how-many-days-in-bali", factDiff: gfd });
const greader = readerByUnit.get("guide:how-many-days-in-bali") ?? {};
guideBlocks.forEach(([path, before, after], i) => {
  const lb = lintText(before, { field: "prose" });
  const la = lintText(after, { field: "prose" });
  rows.push({
    unit_id: `P-guide-${i}`, surface: "code", slug_or_path: `lib/guides.ts how-many-days-in-bali.${path}`, field: path, before, after,
    words_before: before.split(/\s+/).length, words_after: after.split(/\s+/).length,
    lint_before: `${lb.fails.length}F/${lb.warns.length}W ${codes(lb)}`.trim(), lint_after: `${la.fails.length}F/${la.warns.length}W ${codes(la)}`.trim(),
    fact_diff: i === 0 ? `${gfd.verdict}; rejects ${gfd.rejects.length}; dropped ${gfd.dropped.length}; warns ${gfd.warns.length}` : "see first guide row (unit-level)",
    reader_same_facts: greader.sameFacts ?? "", reader_prefers: greader.prefers ?? "", dropped_named: i === 0 ? (g.dropped ?? []).join(" | ") : "", decision: "", note: i === 0 ? (greader.note || "") : "",
  });
});

const p = drafts.pillar;
const pfd = factDiff(`${p.before.masthead_copy}\n${p.before.meta_description}`, `${p.after.masthead_copy}\n${p.after.meta_description}`, { allowed: { names: ["Nusa Dua", "Bali", "Other Bali", "Tanjung Benoa"], area: "", district: "Nusa Dua" }, mode: "style" });
gates.push({ unit: "pillar:nusa-dua", factDiff: pfd });
const preader = readerByUnit.get("pillar:nusa-dua") ?? {};
for (const [k, field] of [["masthead_copy", "prose"], ["meta_description", "meta"]]) {
  const lb = lintText(p.before[k], { field });
  const la = lintText(p.after[k], { field });
  rows.push({
    unit_id: `P-pillar-${k}`, surface: "code", slug_or_path: `app/nusa-dua/page.tsx ${k}`, field: k, before: p.before[k], after: p.after[k],
    words_before: p.before[k].split(/\s+/).length, words_after: p.after[k].split(/\s+/).length,
    lint_before: `${lb.fails.length}F/${lb.warns.length}W ${codes(lb)}`.trim(), lint_after: `${la.fails.length}F/${la.warns.length}W ${codes(la)}`.trim(),
    fact_diff: k === "masthead_copy" ? `${pfd.verdict}; rejects ${pfd.rejects.length}; dropped ${pfd.dropped.length}; warns ${pfd.warns.length}` : "see masthead row",
    reader_same_facts: preader.sameFacts ?? "", reader_prefers: preader.prefers ?? "", dropped_named: k === "masthead_copy" ? (p.dropped ?? []).join(" | ") : "", decision: "", note: k === "masthead_copy" ? (preader.note || "") : "",
  });
}

for (const t of drafts.templates_not_rewritten) {
  rows.push({ unit_id: `P-hold-${t.slug}`, surface: "db", slug_or_path: t.slug, field: "why_its_here", before: t.before.why_its_here, after: "", words_before: t.before.why_its_here.split(/\s+/).length, words_after: 0, lint_before: codes(lintText(t.before.why_its_here, { field: "why_its_here" })), lint_after: "", fact_diff: "", reader_same_facts: "", reader_prefers: "", dropped_named: "", decision: "HOLD", note: t.why_not_yet });
}
for (const c of drafts.controls) {
  rows.push({ unit_id: `P-control-${c.slug}`, surface: "db", slug_or_path: c.slug, field: "why_its_here", before: c.why_its_here, after: c.why_its_here, words_before: c.why_its_here.split(/\s+/).length, words_after: c.why_its_here.split(/\s+/).length, lint_before: codes(lintText(c.why_its_here, { field: "why_its_here" })), lint_after: "", fact_diff: "", reader_same_facts: "", reader_prefers: "", dropped_named: "", decision: "NO CHANGE", note: c.recommendation });
}

const header = ["unit_id", "surface", "slug_or_path", "field", "before", "after", "words_before", "words_after", "lint_before", "lint_after", "fact_diff", "reader_same_facts", "reader_prefers", "dropped_named", "decision", "note"];
const preamble = "# одна строка = одно поле одной единицы пилота; before — текст с живого сайта (краул 28.09) или из кода; after — черновик v2; decision заполняет основательница: ДА / НЕТ / ПРАВКА (HOLD и NO CHANGE проставлены заранее)";
writeFileSync(join(PILOT, "change-list.csv"), `${preamble}\n${header.join(",")}\n${rows.map((r) => header.map((h) => csvCell(r[h])).join(",")).join("\n")}\n`);
writeFileSync(join(PILOT, "gates.json"), JSON.stringify(gates, null, 1));

const summary = {
  rows: rows.length,
  factDiff: Object.fromEntries(gates.map((x) => [x.unit, { verdict: x.factDiff.verdict, rejects: x.factDiff.rejects.map((r) => `${r.type}:${r.token}`), dropped: x.factDiff.dropped.map((r) => `${r.type}:${r.token}`), warns: x.factDiff.warns.map((w) => `${w.type}:${w.token}`) }])),
  lintAfterFails: rows.filter((r) => r.after && /^[1-9]\d*F/.test(r.lint_after)).map((r) => `${r.unit_id}.${r.field}: ${r.lint_after}`),
};
console.log(JSON.stringify(summary, null, 1));
