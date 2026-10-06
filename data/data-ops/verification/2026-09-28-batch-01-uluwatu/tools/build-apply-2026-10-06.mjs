#!/usr/bin/env node
// Rebuilds apply-2026-10-01.sql for pasting, after the 2026-10-06 preflight against production.
//
// The 01.10 file wrote 24 of its 27 rows as "add": the guard only lets the value into an empty
// column. Production had 14 of those columns filled — an area note ("Uluwatu/Bukit") where the
// street address goes, a band ("$$") in price_anchor while price_band already holds it, and
// Papi Sapi's same hours as a text string. Founder decision 2026-10-06 («Заменить»): those
// become replacements guarded by the exact current value; seed-bingin keeps the full street
// address it already has. The three planned replacements get their preflight values here too.
//
//   node data/data-ops/verification/2026-09-28-batch-01-uluwatu/tools/build-apply-2026-10-06.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { asciiLit, lit, md5 } from "../../../../../scripts/copy/build-copy-sql.mjs";

const BATCH = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DATE = "2026-10-06";
const STATUS = "status = 'active' and publication_status = 'published'";

// Current values read from production on 2026-10-06 (preflight 0b). Each becomes the guard of a
// replacement; a value that has moved since makes the block raise instead of overwriting it.
const CURRENT = {
  "alchemy-uluwatu|price_anchor": lit("$$"),
  "alchemy-uluwatu|full_address": lit("Uluwatu/Bukit"),
  "bgs-uluwatu|full_address": lit("Uluwatu/Bukit"),
  "gooseberry-french-restaurant-uluwatu|full_address": lit("Pecatu / uluwatu bukit"),
  "papi-sapi|price_anchor": lit("$$$"),
  "papi-sapi|full_address": lit("Uluwatu/Bukit"),
  "papi-sapi|opening_hours_json": `to_jsonb(${asciiLit("Daily 16:00–23:30")}::text)`,
  "seed-bingin|price_anchor": lit("$$$"),
  "seed-bingin|opening_hours_json": `'{"Monday":["7.30am-11.00pm"],"Tuesday":["7.30am-11.00pm"],"Wednesday":["7.30am-11.00pm"],"Thursday":["7.30am-11.00pm"],"Friday":["7.30am-11.00pm"],"Saturday":["7.30am-11.00pm"],"Sunday":["7.30am-11.00pm"]}'::jsonb`,
  "single-fin|price_anchor": lit("$$"),
  "single-fin|full_address": lit("Pecatu / uluwatu bukit"),
  "suka-espresso|full_address": lit("Pecatu / uluwatu bukit"),
  "ulu-garden|full_address": lit("Uluwatu/Bukit"),
  "waatu|full_address": lit("Uluwatu/Bukit"),
  "yuki-uluwatu|full_address": lit("Pecatu / uluwatu bukit"),
  "zali-uluwatu|opening_hours_json": `'{"Monday":["8.00am-11.30pm"],"Tuesday":["8.00am-11.30pm"],"Wednesday":["8.00am-11.30pm"],"Thursday":["8.00am-11.30pm"],"Friday":["8.00am-11.30pm"],"Saturday":["8.00am-11.30pm"],"Sunday":["8.00am-11.30pm"]}'::jsonb`,
};
const SKIP = new Set(["seed-bingin|full_address"]);

const source = readFileSync(join(BATCH, "apply-2026-10-01.sql"), "utf8");
const STATEMENT = /^\s*update venues set (.+?) where slug = '([a-z0-9-]+)' and status = 'active' and publication_status = 'published' and (.+);$/;
const statements = source.split("\n").map((line) => STATEMENT.exec(line)).filter(Boolean);
if (statements.length !== 33) throw new Error(`expected 27 + 6 statements in apply-2026-10-01.sql, found ${statements.length}`);

// '...' -> its text; anything else (numbers, jsonb, null) is already ASCII and kept as written.
const textOf = (expr) => {
  const m = /^'((?:[^']|'')*)'$/.exec(expr.trim());
  return m ? m[1].replace(/''/g, "'") : null;
};
const reencode = (expr) => (textOf(expr) === null ? expr.trim() : asciiLit(textOf(expr)));

const emitted = [];
const kept = [];
for (const [, setClause, slug, guard] of statements) {
  const column = setClause.split(" = ")[0].trim();
  const key = `${slug}|${column}`;
  if (SKIP.has(key)) {
    kept.push(`${slug} / ${column}: not written, the column already holds a full street address`);
    continue;
  }
  let set;
  let checks;
  let text = null;
  if (column === "latitude") {
    set = setClause;
    const [lat, lon] = setClause.match(/-?\d+\.\d+/g);
    checks = [["latitude", `latitude is distinct from ${lat}`], ["longitude", `longitude is distinct from ${lon}`]];
  } else {
    const raw = setClause.slice(setClause.indexOf(" = ") + 3).replace(/::jsonb$/, "");
    if (!setClause.endsWith("::jsonb")) text = textOf(raw);
    const value = reencode(raw);
    const typed = setClause.endsWith("::jsonb") ? `${value}::jsonb` : value;
    set = `${column} = ${typed}`;
    checks = [[column, `${column} is distinct from ${typed}`]];
  }
  const newGuard = CURRENT[key] ? `${column} = ${CURRENT[key]}` : guard;
  if (!CURRENT[key] && guard.includes("EXPECTED_FROM_PREFLIGHT")) throw new Error(`${key}: no preflight value`);
  const where = `slug = '${slug}' and ${STATUS} and ${newGuard}`;
  const textOk = text === null ? "true" : `md5(${asciiLit(text)}) = '${md5(text)}'`;
  emitted.push({ slug, column, where, textOk, sql: `update venues set ${set} where ${where}`, checks, kind: CURRENT[key] ? "replace" : column === "official_url" ? "remove" : "add" });
}
for (const key of Object.keys(CURRENT)) if (!emitted.some((e) => `${e.slug}|${e.column}` === key)) throw new Error(`${key}: preflight value given but no statement uses it`);

const body = emitted.map((e, i) => [
  `  -- ${i + 1}. ${e.slug} / ${e.column} / ${e.kind}`,
  `  ${e.sql};`,
  `  get diagnostics n = row_count; if n <> 1 then raise exception 'batch-1 #${i + 1} (${e.slug} ${e.column}): expected 1 row, got %', n; end if;`,
].join("\n")).join("\n");
const mismatch = emitted.flatMap((e) => e.checks.map(([col, c]) => `select '${e.slug}' as slug, '${col}' as col from venues where slug = '${e.slug}' and ${c}`)).join("\nunion all ");
const counts = ["add", "replace", "remove"].map((k) => `${emitted.filter((e) => e.kind === k).length} ${k}`).join(", ");

const header = `-- batch-1 Uluwatu + audit P0, ${DATE}: ${emitted.length} statements (${counts}). Paste into the Supabase SQL editor and run.
-- Every statement must change exactly 1 row; if one does not, the whole block rolls back and nothing is written.
-- Built from apply-2026-10-01.sql by tools/build-apply-${DATE}.mjs. Replacements are guarded by the value production held on ${DATE}.
-- Not written: ${kept.join("; ")}. last_verified_at is not touched.`;

writeFileSync(join(BATCH, `apply-${DATE}.sql`), `${header}
do $apply$
declare n int;
begin
${body}
end $apply$;

-- Check: expect 0 rows.
${mismatch};
`);

writeFileSync(join(BATCH, `dryrun-${DATE}.sql`), `-- batch-1 Uluwatu + audit P0, ${DATE}: dry run. Always ends in an exception, so nothing is kept.
do $apply$
declare n int;
begin
${body}
  select count(*) into n from (${mismatch}) as mismatched;
  if n <> 0 then raise exception 'check: % column(s) differ from the intended value', n; end if;
  raise exception 'DRY RUN OK: % statement(s) applied and checked, rolled back', ${emitted.length};
end $apply$;
`);

writeFileSync(join(BATCH, `preflight-${DATE}.sql`), `-- batch-1 Uluwatu + audit P0, ${DATE}: read-only preflight of apply-${DATE}.sql. Expect 0 rows; a row names a
-- statement whose guard does not match exactly one card, or whose new text does not decode to the intended bytes.
select t.n, t.slug, t.col, t.rows_matched, t.text_ok
from (values
  ${emitted.map((e, i) => `(${i + 1}, '${e.slug}', '${e.column}', (select count(*)::int from venues where ${e.where}), ${e.textOk})`).join(",\n  ")}
) as t(n, slug, col, rows_matched, text_ok)
where t.rows_matched <> 1 or not t.text_ok
order by t.n;
`);

console.log(JSON.stringify({ statements: emitted.length, counts, notWritten: kept }));
