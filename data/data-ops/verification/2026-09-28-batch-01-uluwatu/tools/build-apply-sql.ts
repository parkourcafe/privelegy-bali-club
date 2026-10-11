// Builds apply-2026-10-01.sql: the database half of batch 1 plus the audit's P0
// block, for the session that has access to the production database.
//
//   node_modules/.bin/tsx data/data-ops/verification/2026-09-28-batch-01-uluwatu/tools/build-apply-sql.ts
//
// Inputs: change-list.csv (ACCEPTED rows), reconfirm-2026-10-01.json (rows
// whose source changed are excluded) and the founder's decisions of 2026-10-01.
// Every opening_hours_json value is run through the site's own parser
// (lib/opening-hours.ts) and must yield exactly the expected days; a value that
// would be silently dropped on the page is refused here instead.

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { buildOpeningHoursSpec } from "../../../../../lib/opening-hours";

const BATCH = resolve(__dirname, "..");
const DATE = "2026-10-01";

function parseCsv(text: string): Record<string, string>[] {
  text = text.replace(/^(#[^\n]*\n)+/, "");
  const records: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (q) {
      if (ch === '"' && text[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') q = false;
      else cur += ch;
    } else if (ch === '"') q = true;
    else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i += 1;
      row.push(cur);
      cur = "";
      if (!(row.length === 1 && row[0] === "")) records.push(row);
      row = [];
    } else cur += ch;
  }
  if (cur !== "" || row.length) {
    row.push(cur);
    records.push(row);
  }
  const header = records[0];
  return records.slice(1).map((r) => Object.fromEntries(r.map((v, i) => [header[i], v])));
}

const lit = (v: string) => `'${v.replace(/'/g, "''")}'`;
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Corrections to the generated values, each with its reason. The collector wrote
// a post-midnight close as "23.59pm", which the site's parser rejects (hour 23
// with a meridiem), so those days would vanish from the markup. Store the
// official time instead; parseRange normalises a post-midnight close to 23:59.
const HOURS_FIX: Record<string, { value: Record<string, string[]>; why: string }> = {
  "zali-uluwatu": {
    value: Object.fromEntries(DAYS.map((d) => [d, ["8.00am-12.00am"]])),
    why: "official 'Everyday 8:00AM – 12:00AM'; '8.00am-23.59pm' would be dropped by toTime()",
  },
};

const rows = parseCsv(readFileSync(join(BATCH, "change-list.csv"), "utf8")).filter((r) => r.decision === "ACCEPTED" && r.target === "DB");
const reconfirm = JSON.parse(readFileSync(join(BATCH, `reconfirm-${DATE}.json`), "utf8"));
const held = new Set(reconfirm.results.filter((r: { result: string }) => r.result !== "RECONFIRMED").map((r: { claim_id: string }) => r.claim_id));

type Stmt = { label: string; sql: string; replace: boolean };
const stmts: Stmt[] = [];
const skipped: string[] = [];
const hoursChecks: string[] = [];
const guard = "status = 'active' and publication_status = 'published'";

for (const r of rows) {
  const id = `${r.slug} · ${r.field} · ${r.action}`;
  if (held.has(r.claim_id)) {
    skipped.push(`${id} — HOLD after re-confirmation on ${DATE} (see reconfirm-${DATE}.json)`);
    continue;
  }
  if (r.field === "opening_hours_json") {
    if (/late|last guest/i.test(r.proposed) && !r.proposed.trim().startsWith("{")) {
      skipped.push(`${id} — open-ended ("${r.proposed}"): stays as registry text; no structured closing time is invented`);
      continue;
    }
    const fix = HOURS_FIX[r.slug];
    const value = fix ? fix.value : JSON.parse(r.proposed);
    const spec = buildOpeningHoursSpec(value);
    const days = new Set(spec.map((s) => s.dayOfWeek.split("/").pop()));
    const missing = DAYS.filter((d) => (value[d] ?? []).length && !days.has(d));
    if (missing.length) throw new Error(`${r.slug}: parser drops ${missing.join(", ")} — refusing to write hours that vanish from the page`);
    hoursChecks.push(`${r.slug}: ${spec.map((s) => `${s.dayOfWeek.split("/").pop()?.slice(0, 2)} ${s.opens}-${s.closes}`).join(", ")}${fix ? `  [fixed: ${fix.why}]` : ""}`);
    const json = lit(JSON.stringify(value));
    stmts.push({
      label: `${id} · source ${r.source_url}${fix ? ` · value corrected: ${fix.why}` : ""}`,
      sql: r.action === "add"
        ? `update venues set opening_hours_json = ${json}::jsonb where slug = ${lit(r.slug)} and ${guard} and opening_hours_json is null`
        : `update venues set opening_hours_json = ${json}::jsonb where slug = ${lit(r.slug)} and ${guard} and opening_hours_json = /*EXPECTED_FROM_PREFLIGHT*/::jsonb`,
      replace: r.action !== "add",
    });
    continue;
  }
  if (r.field === "coordinates") {
    const [lat, lng] = JSON.parse(r.proposed) as [number, number];
    stmts.push({
      label: `${id} · source ${r.source_url} (official page's embedded map)`,
      sql: `update venues set latitude = ${lat}, longitude = ${lng} where slug = ${lit(r.slug)} and ${guard} and latitude is null and longitude is null`,
      replace: false,
    });
    continue;
  }
  const col = { phone: "phone", full_address: "full_address", price_anchor: "price_anchor" }[r.field];
  if (!col) {
    skipped.push(`${id} — no DB column mapping`);
    continue;
  }
  stmts.push({
    label: `${id} · source ${r.source_url}`,
    sql: r.action === "add"
      ? `update venues set ${col} = ${lit(r.proposed)} where slug = ${lit(r.slug)} and ${guard} and (${col} is null or length(trim(${col})) = 0)`
      : `update venues set ${col} = ${lit(r.proposed)} where slug = ${lit(r.slug)} and ${guard} and ${col} = /*EXPECTED_FROM_PREFLIGHT*/`,
    replace: r.action !== "add",
  });
}

// Audit P0: official websites whose domains now serve gambling sites
// (re-verified 2026-10-01). Five domains, six cards — sendokbali.com is on two.
const GAMBLING: [string, string, string][] = [
  ["the-elephant", "elephantbali\\.com", "https://www.elephantbali.com/ → OLXTOTO slot site"],
  ["karsa-cafe", "karsacafe\\.com", "https://www.karsacafe.com/ → PG Soft slot demo site"],
  ["seminyak-yoga-shala", "seminyakyogashala\\.com", "https://seminyakyogashala.com/ → Toto Macau site"],
  ["cantika-zest", "cantikazestbali\\.com", "http://www.cantikazestbali.com/ → tevitoto99.com"],
  ["sees-bali-cafe-and-eatery", "sendokbali\\.com", "http://sendokbali.com/ → NAGALIGA game platform"],
  ["the-tree-international-bar-and-restaurant", "sendokbali\\.com", "https://www.sendokbali.com/ → same hijacked domain"],
];
const p0 = GAMBLING.map(([slug, domain, note]) => ({
  label: `${slug} · official_url → null · ${note}`,
  sql: `update venues set official_url = null where slug = ${lit(slug)} and ${guard} and official_url ~* '^https?://(www\\.)?${domain}(/|$)'`,
}));

const batchSlugs = [...new Set(rows.map((r) => r.slug))].sort();
const allSlugs = [...batchSlugs, ...GAMBLING.map(([s]) => s)];
const doBlock = (items: { label: string; sql: string }[], name: string) => {
  const body = items
    .map((s, i) => `  -- ${i + 1}. ${s.label}\n  ${s.sql};\n  get diagnostics n = row_count;\n  if n <> 1 then raise exception '${name} #${i + 1} (${s.label.split(" · ").slice(0, 2).join(" · ").replace(/'/g, "''")}): expected 1 row, got %', n; end if;`)
    .join("\n\n");
  return `do $$\ndeclare n int;\nbegin\n${body}\nend $$;`;
};

const out: string[] = [];
out.push(`-- Batch 1 (Uluwatu 25) + audit P0 — apply file for the session WITH production database access.
-- Generated ${DATE} by tools/build-apply-sql.ts. NOT executed in the session that wrote it (no DB access).
--
-- Approved by the founder on ${DATE}: the ACCEPTED rows of CHANGE-LIST.md and removal of the
-- hijacked gambling websites. Not included: MANUAL_REVIEW rows, Single Fin hours and phone
-- (on hold after re-confirmation), open-ended hours. last_verified_at is not touched.
--
-- Order (otherbali-supabase-write):
--   0. Run the preflight SELECTs. Save the output in RUNLOG.md.
--   1. Fill every /*EXPECTED_FROM_PREFLIGHT*/ with the current value from step 0 (quoted literal).
--      Section A will not parse until this is done — deliberately.
--   2. Dry-run: run ONE statement from section A inside  begin; … ; rollback;  — expect UPDATE 1.
--   3. Run section A, then section B. Each is a single DO block: every statement asserts it
--      touched exactly 1 row, and any mismatch raises and rolls the whole block back.
--   4. Run the verification SELECTs; then check the live pages (DB-APPLY-NEXT-SESSION.md).
`);
out.push(`-- ===================== 0. PREFLIGHT (read-only) =====================

-- 0a. Every slug exists (expect 0 rows)
select d.slug from (values ${allSlugs.map((s) => `(${lit(s)})`).join(", ")}) as d(slug)
left join venues v on v.slug = d.slug where v.slug is null;

-- 0b. Current values of every column this file writes
select slug, status, publication_status, official_url, full_address, phone, price_anchor,
       opening_hours_json, latitude, longitude, verified_at, verification_source, last_verified_at
from venues where slug in (${allSlugs.map(lit).join(", ")})
order by slug;

-- 0c. Provider actions pointing at the hijacked domains (read-only; disabling them is a separate decision)
select venue_slug, kind, provider, url, status, verified_at, expires_at
from venue_action_capabilities
where url ~* '(elephantbali|karsacafe|seminyakyogashala|cantikazestbali|sendokbali)\\.com'
   or venue_slug in (${GAMBLING.map(([s]) => lit(s)).join(", ")});
`);
out.push(`-- ===================== A. BATCH 1 — ${stmts.length} rows (${stmts.filter((s) => s.replace).length} replacements need EXPECTED values) =====================\n`);
out.push(doBlock(stmts, "A"));
out.push(`\n-- ===================== B. AUDIT P0 — hijacked official websites: ${p0.length} cards, 5 domains =====================\n`);
out.push(doBlock(p0, "B"));
out.push(`\n-- ===================== 4. VERIFY =====================
select slug, official_url, full_address, phone, price_anchor, opening_hours_json, latitude, longitude, last_verified_at
from venues where slug in (${allSlugs.map(lit).join(", ")})
order by slug;

-- Not applied (kept for the record):
${skipped.map((s) => `--   ${s}`).join("\n")}

-- Hours as the site's parser reads them (lib/opening-hours.ts buildOpeningHoursSpec):
${hoursChecks.map((s) => `--   ${s}`).join("\n")}
`);
writeFileSync(join(BATCH, `apply-${DATE}.sql`), out.join("\n"));
console.log(JSON.stringify({ sectionA: stmts.length, replacements: stmts.filter((s) => s.replace).length, sectionB: p0.length, skipped: skipped.length, hoursChecked: hoursChecks.length }, null, 1));
