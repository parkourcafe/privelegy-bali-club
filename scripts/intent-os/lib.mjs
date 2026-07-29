// Shared helpers for the Other Bali Intent OS autopilot.
// Zero dependencies by design: 02_CLAUDE_CODE_MASTER_GOAL.md Stage 0 forbids
// adding a dependency stack for trivial validation.

import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const paths = {
  autopilot: join(REPO_ROOT, 'docs/intent-os/autopilot'),
  runtime: join(REPO_ROOT, 'docs/intent-os/runtime'),
  canonical: join(REPO_ROOT, 'docs/intent-os/canonical'),
  pilot: join(REPO_ROOT, 'docs/intent-os/pilot'),
  externalA: join(REPO_ROOT, 'docs/intent-os/autopilot/inputs/external/OTHER_BALI_EXTERNAL_INTENTS_0001_0100.md'),
  externalB: join(REPO_ROOT, 'docs/intent-os/autopilot/inputs/external/OTHER_BALI_EXTERNAL_INTENTS_0101_0200.md'),
  hermes: join(REPO_ROOT, 'docs/intent-os/autopilot/inputs/internal/hermes'),
  ledger: join(REPO_ROOT, 'docs/intent-os/canonical/01_SOURCE_RECORD_LEDGER_0001_0200.csv'),
  normalized: join(REPO_ROOT, 'docs/intent-os/canonical/02_NORMALIZED_SOURCE_RECORDS_V0_1.csv'),
  aliases: join(REPO_ROOT, 'docs/intent-os/canonical/03_ALIAS_AND_MODIFIER_REGISTER_V0_1.csv'),
  supporting: join(REPO_ROOT, 'docs/intent-os/canonical/04_SUPPORTING_JOB_REGISTER_V0_1.csv'),
  highRisk: join(REPO_ROOT, 'docs/intent-os/canonical/05_HIGH_RISK_AND_REJECT_REGISTER_V0_1.csv'),
  reconciliation: join(REPO_ROOT, 'docs/intent-os/canonical/06_EXTERNAL_INTERNAL_RECONCILIATION_V0_1.csv'),
  reconciliationReport: join(REPO_ROOT, 'docs/intent-os/canonical/07_RECONCILIATION_REPORT_V0_1.md'),
  libraryCsv: join(REPO_ROOT, 'docs/intent-os/canonical/08_CANONICAL_INTENT_LIBRARY_V0_1.csv'),
  libraryJson: join(REPO_ROOT, 'docs/intent-os/canonical/08_CANONICAL_INTENT_LIBRARY_V0_1.json'),
  surfaceMapping: join(REPO_ROOT, 'docs/intent-os/canonical/09_INTENT_SURFACE_MAPPING_V0_1.csv'),
  dataReadiness: join(REPO_ROOT, 'docs/intent-os/canonical/10_INTENT_DATA_READINESS_MATRIX_V0_1.csv'),
  shortlist: join(REPO_ROOT, 'docs/intent-os/pilot/11_ACTION_JOB_SHORTLIST_V0_1.csv'),
  serpScorecard: join(REPO_ROOT, 'docs/intent-os/pilot/12_KEYWORD_SERP_SCORECARD_V0_1.csv'),
  serpNotes: join(REPO_ROOT, 'docs/intent-os/pilot/13_SERP_RESEARCH_NOTES_V0_1.md'),
  reuseGate: join(REPO_ROOT, 'docs/intent-os/pilot/14_REUSE_GATE_REPORT_V0_1.md'),
  productBrief: join(REPO_ROOT, 'docs/intent-os/pilot/15_FIRST_PILOT_PRODUCT_BRIEF_V1_0.md'),
  state: join(REPO_ROOT, 'docs/intent-os/runtime/state.json'),
  eventLog: join(REPO_ROOT, 'docs/intent-os/runtime/event-log.ndjson'),
  decisionLog: join(REPO_ROOT, 'docs/intent-os/runtime/decision-log.md'),
  errors: join(REPO_ROOT, 'docs/intent-os/runtime/errors.ndjson'),
};

export const GENERATOR = 'other-bali-intent-os-autopilot';
export const SOURCE_VERSION = 'OB-INT-0001..0200@2026-07-29';

// --- RFC 4180 CSV -----------------------------------------------------------

export function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function csvStringify(rows, columns) {
  const lines = [columns.map(csvEscape).join(',')];
  for (const row of rows) lines.push(columns.map((c) => csvEscape(row[c])).join(','));
  return lines.join('\n') + '\n';
}

export function csvParse(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let i = 0;
  const src = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  while (i < src.length) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i += 2; continue; }
        quoted = false; i += 1; continue;
      }
      field += ch; i += 1; continue;
    }
    if (ch === '"') { quoted = true; i += 1; continue; }
    if (ch === ',') { row.push(field); field = ''; i += 1; continue; }
    if (ch === '\n') { row.push(field); rows.push(row); row = []; field = ''; i += 1; continue; }
    field += ch; i += 1;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  if (rows.length === 0) return { columns: [], records: [] };
  const columns = rows[0];
  const records = rows.slice(1)
    .filter((r) => !(r.length === 1 && r[0] === ''))
    .map((r) => Object.fromEntries(columns.map((c, idx) => [c, r[idx] ?? ''])));
  return { columns, records };
}

export function readCsv(path) {
  if (!existsSync(path)) return null;
  return csvParse(readFileSync(path, 'utf8'));
}

export function writeCsv(path, rows, columns) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, csvStringify(rows, columns), 'utf8');
}

// --- runtime state ----------------------------------------------------------

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

export function nowIso() {
  return new Date().toISOString();
}

export function readState() {
  if (!existsSync(paths.state)) return null;
  return JSON.parse(readFileSync(paths.state, 'utf8'));
}

export function writeState(state) {
  mkdirSync(dirname(paths.state), { recursive: true });
  writeFileSync(paths.state, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

export function appendEvent(event) {
  mkdirSync(dirname(paths.eventLog), { recursive: true });
  const record = {
    timestamp: nowIso(),
    stage: event.stage,
    status: event.status,
    inputs: event.inputs ?? [],
    outputs: event.outputs ?? [],
    checks: event.checks ?? [],
    decisions: event.decisions ?? [],
    errors: event.errors ?? [],
    next_state: event.next_state ?? null,
  };
  appendFileSync(paths.eventLog, JSON.stringify(record) + '\n', 'utf8');
  return record;
}

export function appendError(error) {
  mkdirSync(dirname(paths.errors), { recursive: true });
  appendFileSync(paths.errors, JSON.stringify({ timestamp: nowIso(), ...error }) + '\n', 'utf8');
}

export function appendDecision(markdown) {
  mkdirSync(dirname(paths.decisionLog), { recursive: true });
  appendFileSync(paths.decisionLog, markdown.endsWith('\n') ? markdown : markdown + '\n', 'utf8');
}

// --- validator result helpers ----------------------------------------------

export const PASS = 'PASS';
export const FAIL = 'FAIL';
export const SKIP = 'SKIP';

export function result(name, status, detail, findings = []) {
  return { name, status, detail, findings };
}

/** A check whose target artifact does not exist yet is SKIP, not FAIL. */
export function skipIfMissing(name, path, label) {
  if (existsSync(path)) return null;
  return result(name, SKIP, `${label} not yet produced: ${path.replace(REPO_ROOT + '/', '')}`);
}

export function reportAndExit(results) {
  let failed = 0;
  for (const r of results) {
    const icon = r.status === PASS ? 'PASS' : r.status === SKIP ? 'SKIP' : 'FAIL';
    console.log(`[${icon}] ${r.name} — ${r.detail}`);
    for (const f of (r.findings ?? []).slice(0, 10)) console.log(`         ${f}`);
    if ((r.findings ?? []).length > 10) console.log(`         … ${r.findings.length - 10} more`);
    if (r.status === FAIL) failed += 1;
  }
  console.log(`\n${results.filter((r) => r.status === PASS).length} passed, ` +
    `${results.filter((r) => r.status === SKIP).length} skipped, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

export const EXPECTED_IDS = Array.from({ length: 200 }, (_, i) => `OB-INT-${String(i + 1).padStart(4, '0')}`);
