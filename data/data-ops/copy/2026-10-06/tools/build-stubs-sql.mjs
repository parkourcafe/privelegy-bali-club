#!/usr/bin/env node
// Founder decision 2026-10-06: the 101 live cards that carry both machine stubs —
// why_its_here "<Name> is an owner-confirmed dining venue in <area>." and best_for
// "Travellers looking for a verified place to eat in <area>." — lose both, set to NULL.
// The class is read from the export, not retyped: each row is guarded by the md5 of the
// exact exported text of both columns, and the block asserts the whole class changed at once.
//
//   node data/data-ops/copy/2026-10-06/tools/build-stubs-sql.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { asciiLit, lit, md5, readCsvObjects } from "../../../../../scripts/copy/build-copy-sql.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DAY = resolve(HERE, "..");
const COPY = resolve(DAY, "..");
const DATE = "2026-10-06";
const EXPECTED = 101;

const WHY = / is an owner-confirmed dining venue in [^.]+\.$/;
const BEST = /^Travellers looking for a verified place to eat in .+\.$/;

const rows = JSON.parse(readFileSync(join(DAY, "venues-export.json"), "utf8"));
const stubs = rows.filter((r) => r.status === "active" && r.publication_status === "published" && WHY.test(r.why_its_here ?? "") && BEST.test(r.best_for ?? ""));

// A card another approved list also edits would make one of the two blocks miss its guard.
const touched = new Set();
for (const list of ["stage1/change-list.csv", "pilot/change-list.csv"]) {
  for (const r of readCsvObjects(readFileSync(join(COPY, list), "utf8"), ["slug_or_path"], list)) touched.add(r.slug_or_path.trim());
}
const clash = stubs.filter((r) => touched.has(r.slug)).map((r) => r.slug);
if (clash.length) throw new Error(`stub cards also edited by stage1/pilot: ${clash.join(", ")}`);
if (stubs.length !== EXPECTED) throw new Error(`expected ${EXPECTED} stub cards in the export, found ${stubs.length}`);

const values = stubs.map((r) => `(${lit(r.slug)}, '${md5(r.why_its_here)}', '${md5(r.best_for)}')`).join(",\n    ");
const slugList = stubs.map((r) => lit(r.slug)).join(", ");
const update = `  update venues v set why_its_here = null, best_for = null
  from (values
    ${values}
  ) as d(slug, why_md5, best_md5)
  where v.slug = d.slug and v.status = 'active' and v.publication_status = 'published'
    and md5(v.why_its_here) = d.why_md5 and md5(v.best_for) = d.best_md5;
  get diagnostics n = row_count;
  if n <> ${EXPECTED} then raise exception 'stubs: expected ${EXPECTED} rows, got %', n; end if;`;
const check = `from venues where slug in (${slugList}) and (why_its_here is not null or best_for is not null)`;

writeFileSync(join(DAY, "stubs", `paste-${DATE}.sql`), `-- copy-stubs-${DATE}: ${EXPECTED} cards, why_its_here and best_for -> NULL. Paste into the Supabase SQL editor and run.
-- One statement for the whole class; if it does not change exactly ${EXPECTED} rows, nothing is written.
-- Generated ${DATE} by data/data-ops/copy/${DATE}/tools/build-stubs-sql.mjs. Guards: md5 of both current texts.
do $apply$
declare n int;
begin
${update}
end $apply$;

-- Check: expect 0 rows.
select slug ${check}
order by slug;
`);

writeFileSync(join(DAY, "stubs", `dryrun-${DATE}.sql`), `-- copy-stubs-${DATE}: dry run. Always ends in an exception, so nothing is kept.
do $apply$
declare n int;
begin
${update}
  select count(*) into n ${check};
  if n <> 0 then raise exception 'check: % card(s) still carry a stub', n; end if;
  raise exception 'DRY RUN OK: % cards cleared and checked, rolled back', ${EXPECTED};
end $apply$;
`);

writeFileSync(join(DAY, "stubs", `preflight-${DATE}.sql`), `-- copy-stubs-${DATE}: read-only preflight. Expect one row: matched = ${EXPECTED}.
select count(*)::int as matched
from venues v join (values
    ${values}
  ) as d(slug, why_md5, best_md5) on v.slug = d.slug
where v.status = 'active' and v.publication_status = 'published'
  and md5(v.why_its_here) = d.why_md5 and md5(v.best_for) = d.best_md5;
`);

const rollback = stubs.map((r, i) => `-- ${i + 1}. ${r.slug}
update venues set why_its_here = ${asciiLit(r.why_its_here)}, best_for = ${asciiLit(r.best_for)} where slug = ${lit(r.slug)} and status = 'active' and publication_status = 'published' and why_its_here is null and best_for is null;`).join("\n");
writeFileSync(join(DAY, "stubs", `rollback-${DATE}.sql`), `-- copy-stubs-${DATE}: rollback. Restores both stubs where both columns are still NULL; UPDATE 0 means the card was edited since and must be looked at by hand.
${rollback}
`);

console.log(JSON.stringify({ cards: stubs.length, written: ["paste", "preflight", "dryrun", "rollback"].map((k) => `stubs/${k}-${DATE}.sql`) }));
