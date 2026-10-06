#!/usr/bin/env node
// Turns a reviewed copy change list into the SQL a human runs against production, in the
// shape of data/data-ops/verification/2026-09-28-batch-01-uluwatu/apply-2026-10-01.sql:
// preflight SELECTs, a one-statement dry run, one DO block whose every statement is guarded
// by the current text and asserts row_count = 1, a verify SELECT. This tool has no database
// access and writes files only.
//
// paste-<date>.sql is the same DO block in the form a person copies out of a chat window: no
// preflight, md5 guards, ASCII-only literals, a check that returns no rows when every write
// landed. preflight-<date>.sql proves it read-only: every guard matches exactly one card and
// every new text decodes to the intended bytes. dryrun-<date>.sql runs the block and its check
// and then raises, for a connector that may run writes.
//
//   node scripts/copy/build-copy-sql.mjs --changes <change-list.csv> --export <venues-export.csv> \
//     --out <dir> --date YYYY-MM-DD [--label <text>]

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const COPY_FIELDS = ["why_its_here", "best_for", "not_for", "price_anchor", "what_to_order"];
export const HOLD_REASONS = ["already applied", "before mismatch", "not published", "slug missing"];
export const STATUS_GUARD = "status = 'active' and publication_status = 'published'";

const CHANGE_COLUMNS = ["unit_id", "surface", "slug_or_path", "field", "before", "after", "action", "reason", "source", "decision"];
const EXPORT_COLUMNS = ["slug", "status", "publication_status", ...COPY_FIELDS];
const ACTIONS = ["replace", "null"];
const SITE = "https://www.otherbali.com/places/";

// Price copy legitimately contains "$$" (price bands), which would end an untagged
// `do $$ … $$` body in the middle of a string literal.
const DOLLAR_TAG = "$apply$";

// What the place page prints beside each field (lib/quick-decision.ts labels and the h2s in
// app/places/[slug]/page.tsx), so the live check of a NULL write has something to count.
const NULL_LABELS = {
  best_for: "Best for",
  not_for: "Not for",
  why_its_here: "Why it's here",
  what_to_order: "What to order",
};

// ---------------------------------------------------------------- CSV

export function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const records = [];
  let row = [];
  let cell = "";
  let quoted = false;
  let started = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') quoted = false;
      else cell += ch;
      continue;
    }
    if (ch === "#" && !started) {
      while (i < text.length && text[i] !== "\n") i += 1;
      continue;
    }
    if (ch === '"') {
      quoted = true;
      started = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
      started = true;
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      if (started) {
        row.push(cell);
        records.push(row);
      }
      row = [];
      cell = "";
      started = false;
    } else {
      cell += ch;
      started = true;
    }
  }
  if (quoted) throw new Error("CSV: unterminated quoted field");
  if (started) {
    row.push(cell);
    records.push(row);
  }
  return records;
}

export function readCsvObjects(text, required, what) {
  const records = parseCsv(text);
  if (!records.length) throw new Error(`${what}: no header row`);
  const header = records[0].map((h) => h.trim().toLowerCase());
  const missing = required.filter((c) => !header.includes(c));
  if (missing.length) throw new Error(`${what}: missing column(s) ${missing.join(", ")}`);
  return records.slice(1).map((cells, index) => {
    if (cells.length !== header.length) {
      throw new Error(`${what}: record ${index + 2} has ${cells.length} cells, header has ${header.length}`);
    }
    return Object.fromEntries(header.map((h, i) => [h, cells[i]]));
  });
}

function csvCell(value) {
  const s = String(value ?? "");
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// ---------------------------------------------------------------- text and SQL helpers

export function normaliseText(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n").replace(/\s+$/u, "");
}

export const lit = (value) => `'${String(value).replace(/'/g, "''")}'`;
const literalOrNull = (value) => (value === "" ? "null" : lit(value));
const oneLine = (value) => String(value ?? "").replace(/\s*\r?\n\s*/g, " ").trim();
const shellSingleQuoted = (value) => `'${String(value).replace(/'/g, "'\\''")}'`;

export function assertDate(date) {
  const parsed = new Date(`${date}T00:00:00Z`);
  const real = /^\d{4}-\d{2}-\d{2}$/.test(date ?? "") && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  if (!real) throw new Error(`--date must be a real YYYY-MM-DD date, got ${JSON.stringify(date)}`);
}

// An empty `before` means the column is unknown — NULL or blank, which the export cannot tell
// apart — so the guard accepts both rather than failing on the representation.
function fieldGuard(field, before) {
  return before === "" ? `(${field} is null or length(trim(${field})) = 0)` : `${field} = ${lit(before)}`;
}

export function updateSql(e) {
  return `update venues set ${e.field} = ${literalOrNull(e.after)} where slug = ${lit(e.slug)} and ${STATUS_GUARD} and ${fieldGuard(e.field, e.before)}`;
}

export function rollbackSql(e) {
  return `update venues set ${e.field} = ${literalOrNull(e.before)} where slug = ${lit(e.slug)} and ${STATUS_GUARD} and ${e.field} is not distinct from ${literalOrNull(e.after)}`;
}

export const md5 = (text) => createHash("md5").update(String(text), "utf8").digest("hex");

// The paste file travels through a chat window and a clipboard, which swap curly quotes, dashes
// and non-breaking spaces without saying so. Every character outside printable ASCII is
// therefore written as a U& escape: the statement is pure ASCII and decodes to the exact text.
export function asciiLit(value) {
  const text = String(value);
  if (/^[\x20-\x7e]*$/.test(text)) return lit(text);
  let body = "";
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (ch === "'") body += "''";
    else if (ch === "\\") body += "\\\\";
    else if (cp >= 0x20 && cp <= 0x7e) body += ch;
    else if (cp > 0xffff) body += `\\+${cp.toString(16).toUpperCase().padStart(6, "0")}`;
    else body += `\\${cp.toString(16).toUpperCase().padStart(4, "0")}`;
  }
  return `U&'${body}'`;
}

// Same exactness as the full-text guard, a fraction of the length: md5 of the exported bytes.
function pasteGuard(e) {
  return e.exportRaw === "" ? `(${e.field} is null or length(trim(${e.field})) = 0)` : `md5(${e.field}) = '${md5(e.exportRaw)}'`;
}

const pasteWhere = (e) => `slug = ${lit(e.slug)} and ${STATUS_GUARD} and ${pasteGuard(e)}`;

export function pasteUpdateSql(e) {
  const value = e.after === "" ? "null" : asciiLit(e.after);
  return `update venues set ${e.field} = ${value} where ${pasteWhere(e)}`;
}

// React's server renderer escapes ' " & < > in text, so a snippet containing one of them never
// matches the live HTML. Of the clean runs inside the first 30 characters the longest is kept:
// it is the most specific substring that can still be found on the page.
export function grepPattern(text) {
  const head = normaliseText(text).split("\n")[0].slice(0, 30);
  const runs = head.split(/['"&<>]/).map((s) => s.trim()).filter(Boolean);
  return runs.sort((a, b) => b.length - a.length)[0] ?? head.trim();
}

// ---------------------------------------------------------------- selection

function indexExport(exportRows) {
  const bySlug = new Map();
  for (const row of exportRows) {
    const slug = row.slug.trim();
    if (!slug) continue;
    if (bySlug.has(slug)) throw new Error(`export: slug ${slug} appears twice; the current value is ambiguous`);
    bySlug.set(slug, row);
  }
  return bySlug;
}

// unit_id and slug are printed into `--` comments of the apply file, where a
// newline would turn the rest of the cell into executable SQL. Both have a
// fixed alphabet, so anything else is a malformed list, not a value to escape.
const UNIT_ID = /^[\p{L}\p{N}_.:#\-/[\]]+$/u;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function selectChanges(changeRows, exportRows) {
  const exportBySlug = indexExport(exportRows);
  const emitted = [];
  const held = [];
  const notApplied = [];
  const decidedBy = new Map();
  for (const row of changeRows) {
    if (row.surface.trim().toLowerCase() !== "db") continue;
    const unitId = row.unit_id.trim();
    const slug = row.slug_or_path.trim();
    const field = row.field.trim();
    if (!UNIT_ID.test(unitId)) throw new Error(`unit_id ${JSON.stringify(unitId)} has characters outside letters, digits and _ . : # - / [ ]`);
    if (!SLUG.test(slug)) throw new Error(`${unitId}: slug ${JSON.stringify(slug)} is not a lowercase-hyphen slug`);
    const decision = row.decision.trim().toUpperCase();
    if (decision !== "ДА") {
      notApplied.push({ unit_id: unitId, slug, field, decision: row.decision.trim(), reason: row.reason });
      continue;
    }
    // A wrong column or action is a malformed change list, not a hold: holding it would let the
    // rest of the batch go out while the reviewer believes the row is merely waiting.
    if (!COPY_FIELDS.includes(field)) throw new Error(`${unitId}: field ${JSON.stringify(field)} is not one of ${COPY_FIELDS.join("|")}`);
    // Two approved edits of one field cannot both hold the same `before`: the
    // second statement would match 0 rows and roll the whole block back at
    // apply time, so the clash is reported here instead.
    const key = `${slug}\u0000${field}`;
    if (decidedBy.has(key)) throw new Error(`${unitId}: ${slug}.${field} is already changed by ${decidedBy.get(key)} in this list; keep one change per field per batch`);
    decidedBy.set(key, unitId);
    const action = row.action.trim().toLowerCase();
    if (!ACTIONS.includes(action)) throw new Error(`${unitId}: action ${JSON.stringify(row.action)} is not replace|null`);
    const before = normaliseText(row.before);
    const after = normaliseText(row.after);
    if (action === "null" && after !== "") throw new Error(`${unitId}: action null but after is not empty`);
    if (action === "replace" && after === "") throw new Error(`${unitId}: action replace but after is empty (use action null to clear)`);
    for (const value of [before, after, slug]) {
      if (value.includes(DOLLAR_TAG)) throw new Error(`${unitId}: value contains ${DOLLAR_TAG}, which would end the DO block`);
    }
    const current = exportBySlug.get(slug);
    if (!current) {
      held.push({ unit_id: unitId, slug, field, reason: "slug missing", export_value: "" });
      continue;
    }
    const exportValue = normaliseText(current[field]);
    if (current.status.trim() !== "active" || current.publication_status.trim() !== "published") {
      held.push({ unit_id: unitId, slug, field, reason: "not published", export_value: exportValue });
      continue;
    }
    if (exportValue === after) {
      held.push({ unit_id: unitId, slug, field, reason: "already applied", export_value: exportValue });
      continue;
    }
    if (exportValue !== before) {
      held.push({ unit_id: unitId, slug, field, reason: "before mismatch", export_value: exportValue });
      continue;
    }
    emitted.push({
      unit_id: unitId,
      slug,
      field,
      action,
      before,
      after,
      source: row.source.trim(),
      district: (current.district ?? "").trim(),
      // The column exactly as exported, before normaliseText: the paste guard hashes these
      // bytes, so trailing whitespace the comparison above forgave still has to match.
      exportRaw: String(current[field] ?? ""),
    });
  }
  return { emitted, held, notApplied };
}

// ---------------------------------------------------------------- renderers

const unique = (values) => [...new Set(values)];
const touchedFields = (emitted) => COPY_FIELDS.filter((f) => emitted.some((e) => e.field === f));
const touchedSlugs = (emitted) => unique(emitted.map((e) => e.slug));

function renderStatement(e, n, label) {
  // `%` is a format placeholder inside raise exception, so a literal one in the label is doubled.
  const where = `${label} #${n} (${e.slug} · ${e.field})`.replace(/%/g, "%%");
  const comment = [e.unit_id, e.slug, e.field, e.action].join(" · ") + (e.source ? ` · source ${oneLine(e.source)}` : "");
  return [
    `  -- ${n}. ${comment}`,
    `  ${updateSql(e)};`,
    "  get diagnostics n = row_count;",
    `  if n <> 1 then raise exception ${lit(`${where}: expected 1 row, got %`)}, n; end if;`,
  ].join("\n");
}

function renderDoBlock(emitted, label) {
  const body = emitted.map((e, i) => renderStatement(e, i + 1, label)).join("\n\n");
  return `do ${DOLLAR_TAG}\ndeclare n int;\nbegin\n${body}\nend ${DOLLAR_TAG};`;
}

function renderNotes(notApplied, held) {
  const lines = ["-- Not applied (surface = db, decision <> ДА):"];
  if (!notApplied.length) lines.push("--   (none)");
  for (const r of notApplied) {
    lines.push(`--   ${r.unit_id} · ${r.slug} · ${r.field} · decision=${r.decision || "(empty)"}${r.reason ? ` · ${oneLine(r.reason)}` : ""}`);
  }
  lines.push("", "-- Held (see holds.csv):");
  if (!held.length) lines.push("--   (none)");
  for (const r of held) lines.push(`--   ${r.unit_id} · ${r.slug} · ${r.field} · ${r.reason}`);
  return lines.join("\n");
}

export function renderApply({ emitted, held, notApplied, date, label, inputs }) {
  const slugs = touchedSlugs(emitted);
  const fields = touchedFields(emitted);
  const replaced = emitted.filter((e) => e.action === "replace").length;
  const out = [];
  out.push(`-- ${label} — venue copy (${COPY_FIELDS.join(", ")}): apply file for the session WITH production database access.
-- Generated ${date} by scripts/copy/build-copy-sql.mjs. NOT executed by the tool that wrote it (no DB access).
-- Inputs: changes=${inputs.changes ?? "(in memory)"} · export=${inputs.export ?? "(in memory)"}
-- Counts: ${emitted.length} statement(s) (${replaced} replace, ${emitted.length - replaced} null) · ${held.length} held (holds.csv) · ${notApplied.length} not applied (decision <> ДА)
-- Only the five copy columns above are written. Publication state and verification timestamps are not touched.
--
-- Order (otherbali-supabase-write):
--   0. Preflight (read-only): 0a every slug exists (expect 0 rows); 0b current values of the touched columns
--      for all slugs — compare with the \`before\` guard of every statement; a difference means the export is stale.
--   1. Dry-run: run section 1, ONE statement inside begin … rollback — expect UPDATE 1.
--   2. Run section 2, a single DO block: every statement asserts it touched exactly 1 row, and any
--      mismatch raises and rolls the whole block back.
--   3. Run the verify SELECT (section 3); then check the live pages with verify-live.txt.
--   To undo: rollback-${date}.sql restores every \`before\`.
`);
  if (!emitted.length) {
    out.push("-- Nothing to apply: no surface=db row with decision ДА passed the export checks.\n");
    out.push(renderNotes(notApplied, held));
    return `${out.join("\n")}\n`;
  }
  const slugList = slugs.map(lit).join(", ");
  out.push(`-- ===================== 0. PREFLIGHT (read-only) =====================

-- 0a. Every slug exists (expect 0 rows)
select d.slug from (values ${slugs.map((s) => `(${lit(s)})`).join(", ")}) as d(slug)
left join venues v on v.slug = d.slug where v.slug is null;

-- 0b. Current values of every column this file writes (expect ${slugs.length} rows; compare with the \`before\` guards)
select slug, status, publication_status, ${fields.join(", ")}
from venues where slug in (${slugList})
order by slug;
`);
  out.push(`-- ===================== 1. DRY-RUN (one statement, rolled back) =====================
begin;
${updateSql(emitted[0])};
-- expect: UPDATE 1
rollback;
`);
  out.push(`-- ===================== 2. APPLY — ${emitted.length} statement(s), one DO block =====================\n`);
  out.push(renderDoBlock(emitted, label));
  out.push(`\n-- ===================== 3. VERIFY (expect ${slugs.length} rows) =====================
select slug, ${fields.join(", ")}
from venues where slug in (${slugList})
order by slug;
`);
  out.push(renderNotes(notApplied, held));
  return `${out.join("\n")}\n`;
}

export function renderRollback({ emitted, date, label }) {
  const lines = [
    `-- ${label} — rollback for apply-${date}.sql: restores every \`before\` where the written value is still in place.`,
    `-- Generated ${date} by scripts/copy/build-copy-sql.mjs. Each statement is expected to report UPDATE 1;`,
    "-- UPDATE 0 means the column has changed since the apply and must be looked at by hand, not forced.",
    "",
  ];
  if (!emitted.length) lines.push("-- Nothing to roll back.");
  emitted.forEach((e, i) => {
    lines.push(`-- ${i + 1}. ${e.unit_id} · ${e.slug} · ${e.field} · restore ${e.before === "" ? "NULL" : "before"}`);
    lines.push(`${rollbackSql(e)};`);
    lines.push("-- expect: UPDATE 1", "");
  });
  return `${lines.join("\n").trimEnd()}\n`;
}

export function renderHolds(held) {
  const header = ["unit_id", "slug", "field", "reason", "export_value"];
  const rows = held.map((h) => header.map((k) => csvCell(h[k])).join(","));
  return `${[header.join(","), ...rows].join("\n")}\n`;
}

export function buildSummary({ emitted, held }) {
  const count = (items, key) => {
    const acc = {};
    for (const item of items) {
      const k = item[key] || "(unknown)";
      acc[k] = (acc[k] ?? 0) + 1;
    }
    return acc;
  };
  const byField = Object.fromEntries(COPY_FIELDS.map((f) => [f, emitted.filter((e) => e.field === f).length]));
  const byReason = Object.fromEntries(HOLD_REASONS.map((r) => [r, held.filter((h) => h.reason === r).length]));
  const districts = count(emitted, "district");
  const byDistrict = Object.fromEntries(Object.keys(districts).sort().map((d) => [d, districts[d]]));
  return { emitted: emitted.length, held: held.length, byField, byDistrict, byReason };
}

// One line per slug. A replace gives positive evidence (the new text should be on the page), so
// it wins over a null, whose only observable effect is a count that falls.
export function renderVerifyLive(emitted) {
  const lines = [];
  for (const slug of touchedSlugs(emitted)) {
    const forSlug = emitted.filter((e) => e.slug === slug);
    const lead = forSlug.find((e) => e.action === "replace") ?? forSlug[0];
    const pattern = lead.action === "replace"
      ? grepPattern(lead.after)
      : grepPattern(NULL_LABELS[lead.field] ?? lead.before);
    const note = lead.action === "replace"
      ? `${lead.unit_id} ${lead.field} replaced; expect >= 1`
      : `${lead.unit_id} ${lead.field} -> null; expect the count to fall`;
    const others = forSlug.filter((e) => e !== lead).map((e) => `${e.unit_id} ${e.field} ${e.action}`);
    lines.push(`curl -s ${SITE}${slug} | grep -c -F ${shellSingleQuoted(pattern || slug)}  # ${note}${others.length ? `; also ${others.join(", ")}` : ""}`);
  }
  return lines.length ? `${lines.join("\n")}\n` : "";
}

// ---------------------------------------------------------------- paste file

const asciiComment = (value) => oneLine(value).replace(/[^\x20-\x7e]/g, "?");

function pasteStatements(emitted, label) {
  return emitted.map((e, i) => {
    const where = asciiComment(`${label} #${i + 1} (${e.slug} ${e.field})`).replace(/%/g, "%%").replace(/'/g, "''");
    return [
      `  -- ${i + 1}. ${e.slug} / ${e.field} / ${e.action}`,
      `  ${pasteUpdateSql(e)};`,
      `  get diagnostics n = row_count; if n <> 1 then raise exception '${where}: expected 1 row, got %', n; end if;`,
    ].join("\n");
  }).join("\n");
}

const MD5_OF = (field) => `md5(v.${field})`;

// Rows whose column does not hold what the batch meant to write. A null write wants a null.
function pasteCheckFrom(emitted) {
  const values = emitted.map((e) => `(${lit(e.slug)}, ${lit(e.field)}, ${e.after === "" ? "null" : `'${md5(e.after)}'`})`).join(",\n  ");
  const pick = `case d.field ${COPY_FIELDS.map((f) => `when '${f}' then ${MD5_OF(f)}`).join(" ")} end`;
  return `from (values\n  ${values}\n) as d(slug, field, want)\nleft join venues v on v.slug = d.slug\nwhere v.slug is null or ${pick} is distinct from d.want`;
}

// What the founder pastes into the Supabase SQL editor: one DO block, nothing to fill in, then a
// check that should return no rows. Preflight and dry run are done by the session beforehand.
export function renderPaste({ emitted, date, label }) {
  const head = [
    `-- ${asciiComment(label)}: ${emitted.length} statement(s). Paste into the Supabase SQL editor and run.`,
    "-- Every statement must change exactly 1 row; if one does not, the whole block rolls back and nothing is written.",
    `-- Generated ${date} by scripts/copy/build-copy-sql.mjs. Guards: md5 of the current text; every literal is ASCII.`,
  ];
  if (!emitted.length) return `${head.join("\n")}\n-- Nothing to apply.\n`;
  return `${head.join("\n")}
do ${DOLLAR_TAG}
declare n int;
begin
${pasteStatements(emitted, label)}
end ${DOLLAR_TAG};

-- Check: expect 0 rows.
select d.slug, d.field
${pasteCheckFrom(emitted)}
order by 1, 2;
`;
}

// Read-only proof of the paste file, for a connector that will not run writes unattended: every
// statement's WHERE matches exactly one card, and every new text decodes to the intended bytes.
export function renderPreflight({ emitted, date, label }) {
  if (!emitted.length) return "-- Nothing to check.\n";
  const rows = emitted.map((e, i) => {
    const textOk = e.after === "" ? "true" : `md5(${asciiLit(e.after)}) = '${md5(e.after)}'`;
    return `(${i + 1}, ${lit(e.slug)}, ${lit(e.field)}, (select count(*)::int from venues where ${pasteWhere(e)}), ${textOk})`;
  }).join(",\n  ");
  return `-- ${asciiComment(label)}: read-only preflight of paste-${date}.sql. Expect 0 rows; a row names a statement whose
-- guard does not match exactly one card, or whose new text does not decode to the intended bytes.
select t.n, t.slug, t.field, t.rows_matched, t.text_ok
from (values
  ${rows}
) as t(n, slug, field, rows_matched, text_ok)
where t.rows_matched <> 1 or not t.text_ok
order by t.n;
`;
}

// The paste block's statements plus its check, closed by a raise so the transaction always rolls
// back, for a session whose connector may run writes.
export function renderDryRun({ emitted, date, label }) {
  if (!emitted.length) return "-- Nothing to dry-run.\n";
  return `-- ${asciiComment(label)}: dry run of paste-${date}.sql. Always ends in an exception, so nothing is kept.
do ${DOLLAR_TAG}
declare n int;
begin
${pasteStatements(emitted, label)}
  select count(*) into n
  ${pasteCheckFrom(emitted).replace(/\n/g, "\n  ")};
  if n <> 0 then raise exception 'check: % field(s) differ from the intended text', n; end if;
  raise exception 'DRY RUN OK: % statement(s) applied and checked, rolled back', ${emitted.length};
end ${DOLLAR_TAG};
`;
}

// ---------------------------------------------------------------- entry points

export function buildCopySql(changeRows, exportRows, options) {
  const { date, inputs = {} } = options;
  assertDate(date);
  // The label is printed into comment lines; one line only, for the same reason as unit_id.
  const label = oneLine(options.label ?? "") || `copy-${date}`;
  const selection = selectChanges(changeRows, exportRows);
  const ctx = { ...selection, date, label, inputs };
  return {
    ...selection,
    label,
    files: {
      [`apply-${date}.sql`]: renderApply(ctx),
      [`rollback-${date}.sql`]: renderRollback(ctx),
      "holds.csv": renderHolds(selection.held),
      "summary.json": `${JSON.stringify(buildSummary(selection), null, 2)}\n`,
      "verify-live.txt": renderVerifyLive(selection.emitted),
      [`paste-${date}.sql`]: renderPaste(ctx),
      [`preflight-${date}.sql`]: renderPreflight(ctx),
      [`dryrun-${date}.sql`]: renderDryRun(ctx),
    },
  };
}

export function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const key = { "--changes": "changes", "--export": "export", "--out": "out", "--date": "date", "--label": "label" }[arg];
    if (!key) throw new Error(`Unknown argument: ${arg}`);
    if (i + 1 >= argv.length) throw new Error(`${arg} needs a value`);
    args[key] = argv[++i];
  }
  for (const key of ["changes", "export", "out", "date"]) {
    if (!args[key]) throw new Error(`--${key} is required`);
  }
  return args;
}

// The Supabase connector returns rows as a JSON array; accepting that file as
// is avoids a hand conversion to CSV between the read and the build. SQL NULL
// arrives as null and is the same empty value the CSV path produces.
export function readExportJson(text) {
  const rows = JSON.parse(text);
  if (!Array.isArray(rows) || !rows.length) throw new Error("venues export: expected a non-empty JSON array of rows");
  const missing = EXPORT_COLUMNS.filter((c) => !(c in rows[0]));
  if (missing.length) throw new Error(`venues export: missing column(s) ${missing.join(", ")}`);
  return rows.map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v === null || v === undefined ? "" : String(v)])));
}

export function main(argv) {
  const args = parseArgs(argv);
  assertDate(args.date);
  const changeRows = readCsvObjects(readFileSync(args.changes, "utf8"), CHANGE_COLUMNS, "change list");
  const exportText = readFileSync(args.export, "utf8");
  const exportRows = args.export.endsWith(".json") ? readExportJson(exportText) : readCsvObjects(exportText, EXPORT_COLUMNS, "venues export");
  const result = buildCopySql(changeRows, exportRows, {
    date: args.date,
    label: args.label,
    inputs: { changes: args.changes, export: args.export },
  });
  const outDir = resolve(args.out);
  mkdirSync(outDir, { recursive: true });
  const written = [];
  for (const [name, content] of Object.entries(result.files)) {
    const path = join(outDir, name);
    writeFileSync(path, content);
    written.push(path);
  }
  return { summary: JSON.parse(result.files["summary.json"]), notApplied: result.notApplied.length, written };
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    const { summary, notApplied, written } = main(process.argv.slice(2));
    console.log(JSON.stringify({ ...summary, notApplied, written }, null, 2));
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
