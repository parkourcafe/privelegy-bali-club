import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";
import {
  COPY_FIELDS,
  STATUS_GUARD,
  asciiLit,
  buildCopySql,
  grepPattern,
  md5,
  normaliseText,
  parseCsv,
  readCsvObjects,
  readExportJson,
  selectChanges,
} from "./build-copy-sql.mjs";

const execFileAsync = promisify(execFile);
const here = path.dirname(fileURLToPath(import.meta.url));
const script = path.join(here, "build-copy-sql.mjs");
const fixture = (name) => path.join(here, "fixtures", name);
const DATE = "2026-10-05";

const CHANGE_COLUMNS = ["unit_id", "surface", "slug_or_path", "field", "before", "after", "action", "reason", "source", "decision"];
const EXPORT_COLUMNS = ["slug", "status", "publication_status", ...COPY_FIELDS];

function loadFixtures() {
  return {
    changes: readCsvObjects(readFileSync(fixture("change-list.sample.csv"), "utf8"), CHANGE_COLUMNS, "changes"),
    venues: readCsvObjects(readFileSync(fixture("venues-export.sample.csv"), "utf8"), EXPORT_COLUMNS, "export"),
  };
}

function buildFixtures(options = {}) {
  const { changes, venues } = loadFixtures();
  return buildCopySql(changes, venues, { date: DATE, ...options });
}

const change = (overrides) => ({
  unit_id: "T-1", surface: "db", slug_or_path: "slug-a", field: "best_for", before: "Old", after: "New",
  action: "replace", reason: "", source: "", decision: "ДА", ...overrides,
});
const exported = (overrides) => ({
  slug: "slug-a", name: "A", district: "Canggu", status: "active", publication_status: "published",
  why_its_here: "", best_for: "Old", not_for: "", price_anchor: "", what_to_order: "", ...overrides,
});
const build = (changes, venues, options = {}) => buildCopySql(changes, venues, { date: DATE, ...options });

const count = (haystack, needle) => haystack.split(needle).length - 1;
function doBlock(sql) {
  const start = sql.indexOf("do $apply$");
  const end = sql.indexOf("end $apply$;");
  assert.ok(start >= 0 && end > start, "apply.sql has exactly one tagged DO block");
  assert.equal(count(sql, "do $apply$"), 1);
  return sql.slice(start, end);
}

const U01_AFTER = "Canggu''s longest-running warung — a 25-dish menu served from 7am to 3pm.\nPortions are large; the kitchen''s rice bowls are the anchor.";
const U03_BEFORE = "Anyone after a quiet laptop session — it''s loud by 10am";

// ---------------------------------------------------------------- fixture run

test("fixtures: 4 rows emitted, 2 held with the right reasons, the НЕТ row set aside", () => {
  const result = buildFixtures();
  assert.deepEqual(result.emitted.map((e) => [e.unit_id, e.action]), [["U-01", "replace"], ["U-02", "replace"], ["U-03", "null"], ["U-04", "null"]]);
  assert.deepEqual(result.held.map((h) => [h.unit_id, h.reason, h.export_value]), [
    ["U-05", "before mismatch", "IDR 55,000–95,000 mains"],
    ["U-06", "slug missing", ""],
  ]);
  assert.deepEqual(result.notApplied.map((n) => [n.unit_id, n.decision]), [["U-07", "НЕТ"]]);
});

test("apply.sql: every statement carries the status guard and the exact-text guard", () => {
  const apply = buildFixtures().files[`apply-${DATE}.sql`];
  const block = doBlock(apply);
  // A statement may span lines (U-01 carries an embedded newline), so guards are counted per
  // statement, not per line.
  const statements = block.split("\n  get diagnostics n = row_count;").slice(0, -1);
  assert.equal(statements.length, 4);
  for (const statement of statements) {
    assert.equal(count(statement, "update venues set"), 1, statement);
    assert.equal(count(statement, ` and ${STATUS_GUARD} and `), 1, statement);
  }
  assert.ok(block.includes(`where slug = 'warung-lembah-canggu' and ${STATUS_GUARD} and why_its_here = 'All-day warung with a big menu and a lively crowd.';`));
  assert.ok(block.includes(`where slug = 'kopi-tebing-uluwatu' and ${STATUS_GUARD} and best_for = 'Groups';`));
  assert.ok(block.includes(`where slug = 'warung-lembah-canggu' and ${STATUS_GUARD} and not_for = '${U03_BEFORE}';`));
  assert.ok(block.includes(`where slug = 'sari-garden-ubud' and ${STATUS_GUARD} and best_for = 'Everyone';`));
});

test("apply.sql: NULL rows render `= null`, quotes are doubled, embedded newline survives", () => {
  const block = doBlock(buildFixtures().files[`apply-${DATE}.sql`]);
  assert.ok(block.includes("update venues set not_for = null where slug = 'warung-lembah-canggu'"));
  assert.ok(block.includes("update venues set best_for = null where slug = 'sari-garden-ubud'"));
  assert.ok(block.includes(`update venues set why_its_here = '${U01_AFTER}' where slug = 'warung-lembah-canggu'`));
  assert.ok(!block.includes("Canggu's"), "an undoubled apostrophe would break the literal");
  assert.ok(!block.includes("kitchen's"));
  assert.ok(!block.includes("it's loud"));
});

test("apply.sql: exactly one row_count assertion per statement, naming number and slug", () => {
  const block = doBlock(buildFixtures().files[`apply-${DATE}.sql`]);
  assert.equal(count(block, "update venues set"), 4);
  assert.equal(count(block, "get diagnostics n = row_count;"), 4);
  assert.equal(count(block, "if n <> 1 then raise exception"), 4);
  assert.ok(block.includes(`raise exception 'copy-${DATE} #1 (warung-lembah-canggu · why_its_here): expected 1 row, got %', n; end if;`));
  assert.ok(block.includes(`raise exception 'copy-${DATE} #3 (warung-lembah-canggu · not_for): expected 1 row, got %', n; end if;`));
  assert.ok(block.includes(`raise exception 'copy-${DATE} #4 (sari-garden-ubud · best_for): expected 1 row, got %', n; end if;`));
  // Every assertion follows its own statement rather than being bunched at the end.
  const order = block.split("\n").map((l) => l.trim()).filter((l) => l.startsWith("update venues set") || l.startsWith("get diagnostics"));
  assert.deepEqual(order.map((l) => l.split(" ")[0]), ["update", "get", "update", "get", "update", "get", "update", "get"]);
});

test("apply.sql: never touches verification timestamps or publication state in a SET clause", () => {
  const apply = buildFixtures().files[`apply-${DATE}.sql`];
  assert.ok(!apply.includes("last_verified_at"));
  assert.ok(!apply.includes("verified_at"));
  assert.ok(!/set\s+(status|publication_status)\s*=/.test(apply));
  assert.ok(!/,\s*(status|publication_status|verified_at)\s*=/.test(apply));
});

test("apply.sql: the НЕТ row is not a statement but is recorded as not applied", () => {
  const apply = buildFixtures().files[`apply-${DATE}.sql`];
  const block = doBlock(apply);
  assert.ok(!block.includes("nasi-pagi-jimbaran"));
  assert.ok(!apply.includes("Jimbaran''s seafood row"));
  assert.ok(apply.includes("-- Not applied (surface = db, decision <> ДА):"));
  assert.ok(apply.includes("--   U-07 · nasi-pagi-jimbaran · why_its_here · decision=НЕТ · Owner disputes 'plainest'."));
  assert.ok(apply.includes("-- Held (see holds.csv):\n--   U-05 · pasar-senja-seminyak · price_anchor · before mismatch\n--   U-06 · blue-door-sanur · what_to_order · slug missing"));
});

test("apply.sql: preflight, dry-run and verify follow the skill's order", () => {
  const apply = buildFixtures().files[`apply-${DATE}.sql`];
  const sections = ["0. PREFLIGHT", "0a. Every slug exists (expect 0 rows)", "0b. Current values", "1. DRY-RUN", "2. APPLY", "3. VERIFY", "-- Not applied"];
  const positions = sections.map((s) => apply.indexOf(s));
  assert.ok(positions.every((p) => p >= 0), `missing section among ${sections.join(" | ")}`);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.ok(apply.includes("select d.slug from (values ('warung-lembah-canggu'), ('kopi-tebing-uluwatu'), ('sari-garden-ubud')) as d(slug)"));
  assert.ok(apply.includes("select slug, status, publication_status, why_its_here, best_for, not_for\nfrom venues where slug in ('warung-lembah-canggu', 'kopi-tebing-uluwatu', 'sari-garden-ubud')"));
  const dryRun = apply.slice(apply.indexOf("1. DRY-RUN"), apply.indexOf("2. APPLY"));
  assert.ok(dryRun.includes("begin;\nupdate venues set why_its_here = "));
  assert.ok(dryRun.includes("-- expect: UPDATE 1\nrollback;"));
  assert.equal(count(dryRun, "update venues set"), 1);
  assert.ok(apply.includes("3. VERIFY (expect 3 rows)"));
  assert.ok(apply.includes(`Generated ${DATE} by scripts/copy/build-copy-sql.mjs`));
  assert.ok(apply.includes("Counts: 4 statement(s) (2 replace, 2 null) · 2 held (holds.csv) · 1 not applied (decision <> ДА)"));
});

test("rollback.sql restores each before where the written value is still in place", () => {
  const rollback = buildFixtures().files[`rollback-${DATE}.sql`];
  assert.equal(count(rollback, "update venues set"), 4);
  assert.ok(rollback.includes(`update venues set why_its_here = 'All-day warung with a big menu and a lively crowd.' where slug = 'warung-lembah-canggu' and ${STATUS_GUARD} and why_its_here is not distinct from '${U01_AFTER}';`));
  assert.ok(rollback.includes(`update venues set best_for = 'Groups' where slug = 'kopi-tebing-uluwatu' and ${STATUS_GUARD} and best_for is not distinct from 'Long brunches for groups of 6–10 — the terrace tables seat ten.';`));
  assert.ok(rollback.includes(`update venues set not_for = '${U03_BEFORE}' where slug = 'warung-lembah-canggu' and ${STATUS_GUARD} and not_for is not distinct from null;`));
  assert.ok(rollback.includes(`update venues set best_for = 'Everyone' where slug = 'sari-garden-ubud' and ${STATUS_GUARD} and best_for is not distinct from null;`));
  assert.ok(!rollback.includes("last_verified_at"));
});

test("holds.csv lists held rows with reason and the export's value", () => {
  const holds = buildFixtures().files["holds.csv"];
  assert.equal(holds, [
    "unit_id,slug,field,reason,export_value",
    'U-05,pasar-senja-seminyak,price_anchor,before mismatch,"IDR 55,000–95,000 mains"',
    "U-06,blue-door-sanur,what_to_order,slug missing,",
    "",
  ].join("\n"));
});

test("summary.json counts emitted by field and district and held by reason", () => {
  assert.deepEqual(JSON.parse(buildFixtures().files["summary.json"]), {
    emitted: 4,
    held: 2,
    byField: { why_its_here: 1, best_for: 2, not_for: 1, price_anchor: 0, what_to_order: 0 },
    byDistrict: { Canggu: 2, Ubud: 1, Uluwatu: 1 },
    byReason: { "already applied": 0, "before mismatch": 1, "not published": 0, "slug missing": 1 },
  });
});

test("verify-live.txt: one curl line per touched slug, apostrophe-free patterns, Best for for a NULL best_for", () => {
  const lines = buildFixtures().files["verify-live.txt"].trimEnd().split("\n");
  assert.equal(lines.length, 3);
  for (const line of lines) assert.match(line, /^curl -s https:\/\/www\.otherbali\.com\/places\/[a-z0-9-]+ \| grep -c -F '[^']+'  # /);
  const warung = lines.find((l) => l.includes("/places/warung-lembah-canggu "));
  const pattern = warung.match(/grep -c -F '([^']+)'/)[1];
  assert.ok("Canggu's longest-running warung — a 25-dish menu".includes(pattern), pattern);
  assert.ok(pattern.length >= 10, "pattern is specific enough to be evidence");
  assert.ok(warung.endsWith("# U-01 why_its_here replaced; expect >= 1; also U-03 not_for null"));
  assert.ok(lines.includes("curl -s https://www.otherbali.com/places/kopi-tebing-uluwatu | grep -c -F 'Long brunches for groups of 6–'  # U-02 best_for replaced; expect >= 1"));
  assert.ok(lines.includes("curl -s https://www.otherbali.com/places/sari-garden-ubud | grep -c -F 'Best for'  # U-04 best_for -> null; expect the count to fall"));
});

test("a custom label names the DO block's assertions", () => {
  const block = doBlock(buildFixtures({ label: "Canggu copy wave 1 (50% done)" }).files[`apply-${DATE}.sql`]);
  assert.ok(block.includes("raise exception 'Canggu copy wave 1 (50%% done) #1 (warung-lembah-canggu · why_its_here): expected 1 row, got %', n;"));
});

// ---------------------------------------------------------------- selection rules

test("hold reasons: not published, already applied (text and NULL), slug missing", () => {
  const changes = [
    change({ unit_id: "T-1", slug_or_path: "slug-a" }),
    change({ unit_id: "T-2", slug_or_path: "slug-b" }),
    change({ unit_id: "T-3", slug_or_path: "slug-c", field: "not_for", before: "Noise", after: "", action: "null" }),
    change({ unit_id: "T-4", slug_or_path: "slug-d" }),
  ];
  const venues = [
    exported({ slug: "slug-a", publication_status: "review" }),
    exported({ slug: "slug-b", best_for: "New" }),
    exported({ slug: "slug-c", not_for: "" }),
  ];
  const { emitted, held } = build(changes, venues);
  assert.equal(emitted.length, 0);
  assert.deepEqual(held.map((h) => [h.unit_id, h.reason, h.export_value]), [
    ["T-1", "not published", "Old"],
    ["T-2", "already applied", "New"],
    ["T-3", "already applied", ""],
    ["T-4", "slug missing", ""],
  ]);
});

test("a row whose status is not active is held even when published", () => {
  const { held } = build([change()], [exported({ status: "inactive" })]);
  assert.deepEqual(held.map((h) => h.reason), ["not published"]);
});

test("trailing whitespace and CRLF do not count as a before mismatch, and the guard uses the clean text", () => {
  assert.equal(normaliseText("Groups \r\n"), "Groups");
  assert.equal(normaliseText("line one\r\nline two\n\n"), "line one\nline two");
  const result = build(
    [change({ before: "Two lines\r\nof text\n", after: "New copy  \r\n" })],
    [exported({ best_for: "Two lines\nof text   " })],
  );
  assert.equal(result.emitted.length, 1);
  const block = doBlock(result.files[`apply-${DATE}.sql`]);
  assert.ok(block.includes("update venues set best_for = 'New copy' where slug = 'slug-a' and status = 'active' and publication_status = 'published' and best_for = 'Two lines\nof text';"));
});

test("an empty before guards on NULL-or-blank and rolls back to NULL", () => {
  const result = build(
    [change({ field: "what_to_order", before: "", after: "Sate lilit" })],
    [exported({ what_to_order: "   " })],
  );
  assert.equal(result.emitted.length, 1);
  assert.ok(doBlock(result.files[`apply-${DATE}.sql`]).includes("and (what_to_order is null or length(trim(what_to_order)) = 0);"));
  assert.ok(result.files[`rollback-${DATE}.sql`].includes("update venues set what_to_order = null where slug = 'slug-a' and status = 'active' and publication_status = 'published' and what_to_order is not distinct from 'Sate lilit';"));
});

test("rows for other surfaces are ignored; db rows with other decisions are listed with their decision", () => {
  const result = build(
    [
      change({ unit_id: "C-1", surface: "code", slug_or_path: "app/canggu/page.tsx" }),
      change({ unit_id: "R-1", surface: "resort" }),
      change({ unit_id: "P-1", decision: "ПРАВКА" }),
      change({ unit_id: "E-1", decision: "" }),
      change({ unit_id: "D-1", decision: " да " }),
    ],
    [exported()],
  );
  assert.deepEqual(result.emitted.map((e) => e.unit_id), ["D-1"]);
  assert.deepEqual(result.held, []);
  assert.deepEqual(result.notApplied.map((n) => [n.unit_id, n.decision]), [["P-1", "ПРАВКА"], ["E-1", ""]]);
  const apply = result.files[`apply-${DATE}.sql`];
  assert.ok(apply.includes("--   P-1 · slug-a · best_for · decision=ПРАВКА"));
  assert.ok(apply.includes("--   E-1 · slug-a · best_for · decision=(empty)"));
  assert.ok(!apply.includes("C-1"));
  assert.ok(!apply.includes("R-1"));
});

test("malformed change rows stop the build instead of becoming holds", () => {
  const venues = [exported()];
  assert.throws(() => build([change({ field: "last_verified_at", before: "", after: "2026-10-05" })], venues), /T-1: field "last_verified_at" is not one of/);
  assert.throws(() => build([change({ field: "status", before: "active", after: "inactive" })], venues), /field "status"/);
  assert.throws(() => build([change({ action: "delete" })], venues), /action "delete" is not replace\|null/);
  assert.throws(() => build([change({ action: "null", after: "text" })], venues), /action null but after is not empty/);
  assert.throws(() => build([change({ action: "replace", after: "  \n" })], venues), /action replace but after is empty/);
  assert.throws(() => build([change({ after: "Price band $apply$ here" })], venues), /\$apply\$/);
  assert.throws(() => build([change()], [exported(), exported()]), /slug slug-a appears twice/);
  assert.throws(() => build([change()], venues, { date: "2026-13-01" }), /--date must be a real YYYY-MM-DD/);
  assert.throws(() => build([change()], venues, { date: "05.10.2026" }), /--date/);
});

test("a price band with $$ does not end the DO block", () => {
  const result = build([change({ field: "price_anchor", before: "", after: "$$ — mains IDR 90,000–150,000" })], [exported()]);
  const apply = result.files[`apply-${DATE}.sql`];
  const block = doBlock(apply);
  assert.ok(block.includes("set price_anchor = '$$ — mains IDR 90,000–150,000'"));
  assert.equal(count(apply, "$apply$"), 2);
});

test("nothing to apply still produces every file and says so", () => {
  const result = build([change({ decision: "НЕТ" })], [exported()]);
  assert.deepEqual(Object.keys(result.files).sort(), ["apply-2026-10-05.sql", "dryrun-2026-10-05.sql", "holds.csv", "paste-2026-10-05.sql", "preflight-2026-10-05.sql", "rollback-2026-10-05.sql", "summary.json", "verify-live.txt"]);
  assert.ok(result.files[`apply-${DATE}.sql`].includes("-- Nothing to apply"));
  assert.ok(!result.files[`apply-${DATE}.sql`].includes("do $apply$"));
  assert.ok(result.files[`rollback-${DATE}.sql`].includes("-- Nothing to roll back."));
  assert.equal(result.files["holds.csv"], "unit_id,slug,field,reason,export_value\n");
  assert.equal(result.files["verify-live.txt"], "");
  assert.ok(result.files[`paste-${DATE}.sql`].includes("-- Nothing to apply."));
  assert.equal(result.files[`dryrun-${DATE}.sql`], "-- Nothing to dry-run.\n");
  assert.equal(result.files[`preflight-${DATE}.sql`], "-- Nothing to check.\n");
  assert.equal(JSON.parse(result.files["summary.json"]).emitted, 0);
});

// ---------------------------------------------------------------- CSV and pattern helpers

test("parseCsv: comment lines anywhere, CRLF, BOM, doubled quotes and embedded newlines", () => {
  const text = '﻿# leading comment\r\na,b,c\r\n1,"x, ""y""",z\r\n# mid comment, with commas\r\n"multi\r\nline",,"#not a comment"\r\n\r\n4,5,6';
  assert.deepEqual(parseCsv(text), [
    ["a", "b", "c"],
    ["1", 'x, "y"', "z"],
    ["multi\r\nline", "", "#not a comment"],
    ["4", "5", "6"],
  ]);
  assert.throws(() => parseCsv('a,b\n"open'), /unterminated quoted field/);
});

test("readCsvObjects: header names are case-insensitive, extra columns pass through, short rows fail loudly", () => {
  const rows = readCsvObjects("Slug,Status,Publication_Status,why_its_here,best_for,not_for,price_anchor,what_to_order,extra\na,active,published,,,,,,ignored\n", EXPORT_COLUMNS, "export");
  assert.equal(rows[0].slug, "a");
  assert.equal(rows[0].extra, "ignored");
  assert.throws(() => readCsvObjects("slug,status\na\n", ["slug", "status"], "export"), /record 2 has 1 cells, header has 2/);
  assert.throws(() => readCsvObjects("slug\na\n", ["slug", "status"], "export"), /missing column\(s\) status/);
});

test("grepPattern stops before characters React escapes and keeps to the first line", () => {
  assert.equal(grepPattern("Best for"), "Best for");
  assert.equal(grepPattern("Why it's here"), "Why it");
  assert.equal(grepPattern("Long brunches for groups of 6–10 — the terrace tables seat ten."), "Long brunches for groups of 6–");
  assert.equal(grepPattern("First line of copy\nSecond line"), "First line of copy");
  assert.equal(grepPattern("Canggu's longest-running warung — a 25-dish menu"), "s longest-running warun");
  assert.equal(grepPattern('"Quoted" opening then text'), "opening then text");
  assert.equal(grepPattern("Fish & chips"), "chips");
});

// ---------------------------------------------------------------- CLI

test("CLI writes the eight files into --out and prints the summary", async () => {
  const out = await mkdtemp(path.join(os.tmpdir(), "copy-sql-"));
  try {
    const { stdout } = await execFileAsync(process.execPath, [
      script,
      "--changes", fixture("change-list.sample.csv"),
      "--export", fixture("venues-export.sample.csv"),
      "--out", out,
      "--date", DATE,
      "--label", "Sample wave",
    ]);
    const printed = JSON.parse(stdout);
    assert.equal(printed.emitted, 4);
    assert.equal(printed.held, 2);
    assert.equal(printed.notApplied, 1);
    assert.equal(printed.written.length, 8);
    assert.deepEqual((await readdir(out)).sort(), ["apply-2026-10-05.sql", "dryrun-2026-10-05.sql", "holds.csv", "paste-2026-10-05.sql", "preflight-2026-10-05.sql", "rollback-2026-10-05.sql", "summary.json", "verify-live.txt"]);
    const apply = await readFile(path.join(out, `apply-${DATE}.sql`), "utf8");
    assert.ok(apply.includes("raise exception 'Sample wave #1 (warung-lembah-canggu · why_its_here): expected 1 row, got %'"));
    assert.ok(apply.includes(`Inputs: changes=${fixture("change-list.sample.csv")} · export=${fixture("venues-export.sample.csv")}`));
    assert.equal(apply, buildFixtures({ label: "Sample wave", inputs: { changes: fixture("change-list.sample.csv"), export: fixture("venues-export.sample.csv") } }).files[`apply-${DATE}.sql`]);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

test("CLI refuses a bad date or a missing argument with exit code 1 and writes nothing", async () => {
  const out = await mkdtemp(path.join(os.tmpdir(), "copy-sql-"));
  try {
    const run = (args) => execFileAsync(process.execPath, [script, ...args]).then(
      () => assert.fail("expected a non-zero exit"),
      (error) => error,
    );
    const badDate = await run(["--changes", fixture("change-list.sample.csv"), "--export", fixture("venues-export.sample.csv"), "--out", out, "--date", "2026-10-5"]);
    assert.equal(badDate.code, 1);
    assert.match(badDate.stderr, /--date must be a real YYYY-MM-DD date/);
    const missing = await run(["--changes", fixture("change-list.sample.csv"), "--out", out, "--date", DATE]);
    assert.equal(missing.code, 1);
    assert.match(missing.stderr, /--export is required/);
    const unknown = await run(["--bogus", "x"]);
    assert.match(unknown.stderr, /Unknown argument: --bogus/);
    assert.deepEqual(await readdir(out), []);
  } finally {
    await rm(out, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------- hardening (2026-10-05 probes)

const hardeningExport = [
  { slug: "a-cafe", name: "A", district: "Canggu", status: "active", publication_status: "published", why_its_here: "Old A", best_for: "Old A best", not_for: "", price_anchor: "", what_to_order: "" },
];
const hardChange = (over) => ({ unit_id: "U1", surface: "db", slug_or_path: "a-cafe", field: "why_its_here", before: "Old A", after: "New A", action: "replace", reason: "r", source: "s", decision: "ДА", ...over });

test("a newline in unit_id or slug is refused: it would end the comment and run as SQL", () => {
  assert.throws(() => selectChanges([hardChange({ unit_id: "U1\ndrop table venues;" })], hardeningExport), /unit_id/);
  assert.throws(() => selectChanges([hardChange({ slug_or_path: "a-cafe\n; drop table venues" })], hardeningExport), /slug/);
  assert.throws(() => selectChanges([hardChange({ slug_or_path: "d'cafe" })], hardeningExport), /slug/);
});

test("two approved edits of one field in one list are refused before they reach the database", () => {
  assert.throws(
    () => selectChanges([hardChange({ field: "best_for", before: "Old A best", after: "One" }), hardChange({ unit_id: "U2", field: "best_for", before: "Old A best", after: "Two" })], hardeningExport),
    /already changed by U1/,
  );
});

test("only a plain ДА, in any case and with spaces trimmed, approves a row", () => {
  for (const decision of ["ДА", " да ", "Да"]) assert.equal(selectChanges([hardChange({ decision })], hardeningExport).emitted.length, 1, decision);
  for (const decision of ["ДА?", "да, но поправить", "yes", "ПРАВКА", "НЕТ", ""]) {
    const r = selectChanges([hardChange({ decision })], hardeningExport);
    assert.equal(r.emitted.length, 0, decision);
    assert.equal(r.notApplied.length, 1, decision);
  }
});

test("a multi-line --label is folded to one comment line", () => {
  const out = buildCopySql([hardChange({})], hardeningExport, { date: "2026-10-05", label: "batch\ndrop table venues;" });
  const apply = out.files["apply-2026-10-05.sql"];
  const hits = apply.split("\n").filter((line) => line.includes("drop table venues"));
  assert.ok(hits.length > 0);
  for (const line of hits) assert.match(line.trim(), /^--|raise exception/);
});

test("a JSON export from the connector reads like the CSV one, with SQL NULL as empty", () => {
  const rows = readExportJson(JSON.stringify([{ slug: "a-cafe", name: "A", district: "canggu", status: "active", publication_status: "published", why_its_here: "Old A", best_for: null, not_for: null, price_anchor: null, what_to_order: null }]));
  assert.equal(rows[0].best_for, "");
  const r = selectChanges([hardChange({ field: "best_for", before: "", after: "Surfers after a session" })], rows);
  assert.equal(r.emitted.length, 1);
  assert.throws(() => readExportJson(JSON.stringify([{ slug: "a-cafe" }])), /missing column/);
  assert.throws(() => readExportJson("[]"), /non-empty/);
});

// ---------------------------------------------------------------- paste file

// Postgres reads U&'…' as: '' is a quote, \\ a backslash, \XXXX and \+XXXXXX a code point.
function decodeLiteral(sql) {
  const plain = /^'((?:[^']|'')*)'$/.exec(sql);
  if (plain) return plain[1].replace(/''/g, "'");
  const unicode = /^U&'((?:[^']|'')*)'$/.exec(sql);
  assert.ok(unicode, `not a SQL string literal: ${sql}`);
  return unicode[1]
    .replace(/''/g, "'")
    .replace(/\\(\\|\+[0-9A-F]{6}|[0-9A-F]{4})/g, (_, x) => (x === "\\" ? "\\" : String.fromCodePoint(parseInt(x.replace("+", ""), 16))));
}

test("asciiLit: pure ASCII that decodes back to the exact text", () => {
  const texts = [
    "Plain text, no quotes",
    "Canggu's warung — 7am–3pm",
    "it\u2019s \u201cquoted\u201d a\u00a0b",
    "two\nlines",
    "back\\slash then \\0041",
    "palm \u{1F334} here",
    "é0041 is not an escape",
  ];
  for (const text of texts) {
    const sql = asciiLit(text);
    assert.match(sql, /^[\x20-\x7e]*$/, text);
    assert.equal(decodeLiteral(sql), text);
  }
  assert.equal(asciiLit("It's plain"), "'It''s plain'");
});

test("paste file: one ASCII DO block, md5 guards on the exported text, a check that wants the new text", () => {
  const result = buildFixtures();
  const paste = result.files[`paste-${DATE}.sql`];
  assert.match(paste, /^[\x00-\x7f]*$/);
  const block = doBlock(paste);
  assert.equal(count(block, "update venues set"), result.emitted.length);
  assert.equal(count(block, "get diagnostics n = row_count; if n <> 1 then raise exception"), result.emitted.length);
  for (const e of result.emitted) {
    if (e.exportRaw) assert.ok(block.includes(`and md5(${e.field}) = '${md5(e.exportRaw)}';`), e.unit_id);
    assert.ok(paste.includes(`('${e.slug}', '${e.field}', ${e.after === "" ? "null" : `'${md5(e.after)}'`})`), e.unit_id);
  }
  assert.ok(paste.includes("-- Check: expect 0 rows."));
});

test("paste guard hashes the raw exported bytes; an empty column is guarded as null-or-blank", () => {
  const trailing = build([change()], [exported({ best_for: "Old  " })]);
  assert.equal(trailing.emitted.length, 1);
  assert.ok(trailing.files[`paste-${DATE}.sql`].includes(`and md5(best_for) = '${md5("Old  ")}';`));
  const empty = build([change({ field: "not_for", before: "", after: "Groups over eight" })], [exported()]);
  assert.ok(empty.files[`paste-${DATE}.sql`].includes("and (not_for is null or length(trim(not_for)) = 0);"));
});

test("paste file: a null write sets null and its check wants null", () => {
  const paste = build([change({ after: "", action: "null" })], [exported()]).files[`paste-${DATE}.sql`];
  assert.ok(paste.includes("update venues set best_for = null where slug = 'slug-a' and status = 'active' and publication_status = 'published' and md5(best_for) = "));
  assert.ok(paste.includes("('slug-a', 'best_for', null)"));
});

test("paste file: a label with an apostrophe, % and a dash stays one valid exception message", () => {
  const paste = build([change()], [exported()], { label: "Ubud's wave (50% done) — v2" }).files[`paste-${DATE}.sql`];
  assert.ok(paste.includes("raise exception 'Ubud''s wave (50%% done) ? v2 #1 (slug-a best_for): expected 1 row, got %', n;"));
  assert.match(paste, /^[\x00-\x7f]*$/);
});

test("dry-run file: the paste statements, the check inside the block, and a closing raise", () => {
  const result = buildFixtures();
  const paste = doBlock(result.files[`paste-${DATE}.sql`]);
  const dry = result.files[`dryrun-${DATE}.sql`];
  const updates = paste.split("\n").filter((l) => l.trim().startsWith("update venues"));
  assert.equal(updates.length, result.emitted.length);
  for (const line of updates) assert.ok(dry.includes(line));
  assert.ok(dry.includes("if n <> 0 then raise exception 'check: % field(s) differ from the intended text', n; end if;"));
  assert.ok(dry.includes(`raise exception 'DRY RUN OK: % statement(s) applied and checked, rolled back', ${result.emitted.length};`));
  assert.match(dry, /^[\x00-\x7f]*$/);
});

test("preflight file: read-only, one row per statement counting its WHERE and checking its decoded text", () => {
  const result = buildFixtures();
  const pre = result.files[`preflight-${DATE}.sql`];
  assert.match(pre, /^[\x00-\x7f]*$/);
  assert.ok(!/\b(update|insert|delete)\s/i.test(pre.replace(/^--.*$/gm, "")), "no write keyword outside comments");
  for (const [i, e] of result.emitted.entries()) {
    const where = e.exportRaw ? `md5(${e.field}) = '${md5(e.exportRaw)}'` : `(${e.field} is null or length(trim(${e.field})) = 0)`;
    assert.ok(pre.includes(`(${i + 1}, '${e.slug}', '${e.field}', (select count(*)::int from venues where slug = '${e.slug}' and ${STATUS_GUARD} and ${where}), `), e.unit_id);
    assert.ok(pre.includes(e.after === "" ? `${where}), true)` : `, md5(${asciiLit(e.after)}) = '${md5(e.after)}')`), e.unit_id);
  }
  assert.ok(pre.includes("where t.rows_matched <> 1 or not t.text_ok"));
});
