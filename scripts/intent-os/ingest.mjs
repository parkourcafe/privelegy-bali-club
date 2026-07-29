#!/usr/bin/env node
// Stage 1 — ingest exactly 200 source records into the source ledger.
//
// Non-negotiable rule 1: preserve every original source ID OB-INT-0001..0200
// exactly once. Rule 2: never replace an original source meaning.
// Parse failures stay as rows with parse_status=ERROR; they never disappear.

import { readFileSync } from 'node:fs';
import {
  paths, readState, writeState, writeCsv, appendEvent, appendError, nowIso,
  GENERATOR, SOURCE_VERSION, EXPECTED_IDS, REPO_ROOT,
} from './lib.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

const COLUMNS = [
  'source_record_id',
  'original_name',
  'original_domain',
  'original_status',
  'original_confidence',
  'source_document',
  'source_line',
  'raw_notes',
  'parse_status',
  'parse_error',
  'created_at',
  'generator',
  'source_version',
];

// Table rows look like:
// | OB-INT-0001 | Find where to go on arrival day when jet-lagged | Arrival and first day | EVIDENCE_STRONG | 88 |
const ROW_RE = /^\|\s*(OB-INT-\d{4})\s*\|(.*)$/;

function parseFile(path) {
  const text = readFileSync(path, 'utf8');
  const lines = text.split(/\r?\n/);
  const out = [];
  lines.forEach((line, idx) => {
    const m = ROW_RE.exec(line.trim());
    if (!m) return;
    const id = m[1];
    // Split the remainder on '|' and drop the trailing empty cell from the closing pipe.
    const cells = m[2].split('|').map((c) => c.trim());
    if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
    const [name = '', domain = '', status = '', confidence = ''] = cells;
    const problems = [];
    if (!name) problems.push('missing canonical intent name');
    if (!domain) problems.push('missing domain');
    if (!status) problems.push('missing status');
    if (confidence !== '' && !/^\d{1,3}$/.test(confidence)) problems.push(`non-numeric confidence "${confidence}"`);
    out.push({
      source_record_id: id,
      original_name: name,
      original_domain: domain,
      original_status: status,
      original_confidence: confidence,
      source_document: rel(path),
      source_line: String(idx + 1),
      raw_notes: line.trim(),
      parse_status: problems.length === 0 ? 'OK' : 'ERROR',
      parse_error: problems.join('; '),
      created_at: nowIso(),
      generator: GENERATOR,
      source_version: SOURCE_VERSION,
    });
  });
  return out;
}

const parsed = [...parseFile(paths.externalA), ...parseFile(paths.externalB)];

// Duplicate detection — policy duplicate_uncertain says keep records separate and flag,
// but an ID appearing twice would break rule 1 (each ID exactly once), so it is a hard error.
const byId = new Map();
const duplicates = [];
for (const row of parsed) {
  if (byId.has(row.source_record_id)) duplicates.push(row.source_record_id);
  else byId.set(row.source_record_id, row);
}

const missing = EXPECTED_IDS.filter((id) => !byId.has(id));
const extra = [...byId.keys()].filter((id) => !EXPECTED_IDS.includes(id));

// Missing IDs are still emitted as ERROR rows so nothing silently disappears.
for (const id of missing) {
  byId.set(id, {
    source_record_id: id,
    original_name: '', original_domain: '', original_status: '', original_confidence: '',
    source_document: '', source_line: '', raw_notes: '',
    parse_status: 'ERROR',
    parse_error: 'source record not found in either external input file',
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  });
  appendError({ stage: 'INGEST', source_record_id: id, error: 'missing_source_record' });
}

const rows = EXPECTED_IDS.map((id) => byId.get(id))
  .concat([...byId.keys()].filter((id) => !EXPECTED_IDS.includes(id)).map((id) => byId.get(id)));

writeCsv(paths.ledger, rows, COLUMNS);

const errorRows = rows.filter((r) => r.parse_status === 'ERROR');
const checks = {
  source_record_count: rows.length,
  unique_source_record_count: new Set(rows.map((r) => r.source_record_id)).size,
  missing_ids: missing.length,
  extra_ids: extra.length,
  duplicate_ids: duplicates.length,
  parse_error_rows: errorRows.length,
};

const gatePass = checks.source_record_count === 200
  && checks.unique_source_record_count === 200
  && checks.missing_ids === 0
  && checks.extra_ids === 0
  && checks.duplicate_ids === 0;

const state = readState() ?? {};
state.state = gatePass ? 'NORMALIZE' : 'FAILED_GATE';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'INGEST'])];
if (!gatePass) state.terminal = 'FAILED_GATE';
writeState(state);

appendEvent({
  stage: 'INGEST',
  status: gatePass ? 'PASS' : 'FAIL',
  inputs: [rel(paths.externalA), rel(paths.externalB)],
  outputs: [rel(paths.ledger)],
  checks: Object.entries(checks).map(([k, v]) => `${k}=${v}`),
  decisions: [`gate=${gatePass ? 'PASS' : 'FAIL'}`],
  errors: errorRows.map((r) => `${r.source_record_id}: ${r.parse_error}`),
  next_state: state.state,
});

for (const [k, v] of Object.entries(checks)) console.log(`${k}: ${v}`);
console.log(`gate: ${gatePass ? 'PASS' : 'FAIL'} -> ${state.state}`);
process.exit(gatePass ? 0 : 1);
