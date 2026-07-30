// Deterministic validators for every Intent OS autopilot artifact.
//
// Contract: a check whose target artifact does not exist yet returns SKIP.
// A check whose target exists but violates the spec returns FAIL.
// This lets `validate_all` be meaningful at every state of the pipeline, per the
// final completion condition ("exits successfully for the artifacts appropriate
// to the terminal state").

import { existsSync, readFileSync } from 'node:fs';
import { paths, readCsv, result, skipIfMissing, PASS, FAIL, EXPECTED_IDS, REPO_ROOT } from './lib.mjs';
import {
  NORMALIZED_RECORD_TYPES, SURFACES, DATA_READINESS, RISK_CLASSES, LIFECYCLE_STATUS,
  LIBRARY_COLUMNS, SCORECARD_WEIGHTS, INTERNAL_TYPES,
} from './enums.mjs';
import { loadRouteGates, reachabilityForSnapshot } from './route-reachability.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

// --- 1. source ledger -------------------------------------------------------

export function validate_source_ledger() {
  const name = 'validate_source_ledger';
  const skip = skipIfMissing(name, paths.ledger, 'source ledger');
  if (skip) return skip;
  const { records } = readCsv(paths.ledger);
  const ids = records.map((r) => r.source_record_id);
  const unique = new Set(ids);
  const missing = EXPECTED_IDS.filter((id) => !unique.has(id));
  const extra = [...unique].filter((id) => !EXPECTED_IDS.includes(id));
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  const findings = [];
  if (records.length !== 200) findings.push(`source_record_count=${records.length}, expected 200`);
  if (unique.size !== 200) findings.push(`unique_source_record_count=${unique.size}, expected 200`);
  if (missing.length) findings.push(`missing_ids=${missing.length}: ${missing.slice(0, 5).join(', ')}`);
  if (extra.length) findings.push(`extra_ids=${extra.length}: ${extra.slice(0, 5).join(', ')}`);
  if (dupes.length) findings.push(`duplicate_ids=${[...new Set(dupes)].join(', ')}`);
  return findings.length
    ? result(name, FAIL, 'source ledger violates the Stage 1 gate', findings)
    : result(name, PASS, '200 rows, 200 unique IDs, 0 missing, 0 extra');
}

// --- 2. unique IDs across every artifact ------------------------------------

export function validate_unique_ids() {
  const name = 'validate_unique_ids';
  const targets = [
    [paths.ledger, 'source_record_id'],
    [paths.normalized, 'source_record_id'],
    [paths.libraryCsv, 'canonical_intent_id'],
  ].filter(([p]) => existsSync(p));
  if (targets.length === 0) return result(name, 'SKIP', 'no ID-bearing artifacts yet');
  const findings = [];
  for (const [path, col] of targets) {
    const { records } = readCsv(path);
    const ids = records.map((r) => r[col]).filter(Boolean);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    if (dupes.length) findings.push(`${rel(path)}: duplicate ${col} -> ${dupes.slice(0, 5).join(', ')}`);
    const blank = records.filter((r) => !r[col]).length;
    if (blank) findings.push(`${rel(path)}: ${blank} rows with empty ${col}`);
  }
  return findings.length
    ? result(name, FAIL, 'duplicate or empty identifiers found', findings)
    : result(name, PASS, `${targets.length} artifact(s) have unique non-empty IDs`);
}

// --- 3. CSV shape -----------------------------------------------------------

export function validate_csv_shapes() {
  const name = 'validate_csv_shapes';
  const all = [paths.ledger, paths.normalized, paths.aliases, paths.supporting, paths.highRisk,
    paths.reconciliation, paths.libraryCsv, paths.surfaceMapping, paths.dataReadiness,
    paths.shortlist, paths.serpScorecard].filter((p) => existsSync(p));
  if (all.length === 0) return result(name, 'SKIP', 'no CSV artifacts yet');
  const findings = [];
  for (const path of all) {
    const raw = readFileSync(path, 'utf8');
    if (!raw.endsWith('\n')) findings.push(`${rel(path)}: missing trailing newline`);
    const { columns, records } = readCsv(path);
    if (columns.length === 0) { findings.push(`${rel(path)}: no header`); continue; }
    if (new Set(columns).size !== columns.length) findings.push(`${rel(path)}: duplicate column names`);
    const bad = records.filter((r) => Object.keys(r).length !== columns.length).length;
    if (bad) findings.push(`${rel(path)}: ${bad} rows with wrong column count`);
  }
  return findings.length
    ? result(name, FAIL, 'CSV shape violations', findings)
    : result(name, PASS, `${all.length} CSV artifact(s) well-formed (RFC 4180, header, trailing newline)`);
}

// --- 4. required fields -----------------------------------------------------

export function validate_required_fields() {
  const name = 'validate_required_fields';
  const specs = [
    [paths.ledger, ['source_record_id', 'source_document', 'parse_status']],
    [paths.normalized, ['source_record_id', 'normalized_record_type']],
    [paths.libraryCsv, LIBRARY_COLUMNS],
    [paths.surfaceMapping, ['canonical_intent_id', 'surface']],
    [paths.dataReadiness, ['canonical_intent_id', 'data_readiness']],
  ].filter(([p]) => existsSync(p));
  if (specs.length === 0) return result(name, 'SKIP', 'no artifacts requiring field checks yet');
  const findings = [];
  for (const [path, required] of specs) {
    const { columns, records } = readCsv(path);
    const absent = required.filter((c) => !columns.includes(c));
    if (absent.length) { findings.push(`${rel(path)}: missing columns ${absent.join(', ')}`); continue; }
    for (const col of required) {
      const blanks = records.filter((r) => r[col] === '' || r[col] === undefined).length;
      // parse_error is legitimately blank for OK rows; only key identity columns must be filled.
      if (blanks && /(_id|_type|_status|surface|data_readiness)$/.test(col)) {
        findings.push(`${rel(path)}: ${blanks} blank values in required column ${col}`);
      }
    }
  }
  return findings.length
    ? result(name, FAIL, 'required fields missing', findings)
    : result(name, PASS, `${specs.length} artifact(s) have all required fields populated`);
}

// --- 5. allowed enums -------------------------------------------------------

export function validate_allowed_enums() {
  const name = 'validate_allowed_enums';
  const specs = [
    [paths.normalized, 'normalized_record_type', NORMALIZED_RECORD_TYPES],
    [paths.reconciliation, 'internal_type', [...INTERNAL_TYPES, '']],
    [paths.libraryCsv, 'publication_risk', RISK_CLASSES],
    [paths.libraryCsv, 'data_readiness', DATA_READINESS],
    [paths.libraryCsv, 'lifecycle_status', LIFECYCLE_STATUS],
    [paths.surfaceMapping, 'surface', SURFACES],
    [paths.dataReadiness, 'data_readiness', DATA_READINESS],
  ].filter(([p]) => existsSync(p));
  if (specs.length === 0) return result(name, 'SKIP', 'no enum-bearing artifacts yet');
  const findings = [];
  for (const [path, col, allowed] of specs) {
    const { columns, records } = readCsv(path);
    if (!columns.includes(col)) continue;
    const bad = [...new Set(records.map((r) => r[col]).filter((v) => !allowed.includes(v)))];
    if (bad.length) findings.push(`${rel(path)}.${col}: illegal ${bad.slice(0, 5).map((v) => JSON.stringify(v)).join(', ')}`);
  }
  return findings.length
    ? result(name, FAIL, 'values outside the controlled vocabulary', findings)
    : result(name, PASS, `${specs.length} enum column(s) within the controlled vocabulary`);
}

// --- 6. parent links --------------------------------------------------------

export function validate_parent_links() {
  const name = 'validate_parent_links';
  const skip = skipIfMissing(name, paths.normalized, 'normalized records');
  if (skip) return skip;
  const { columns, records } = readCsv(paths.normalized);
  if (!columns.includes('parent_source_record_id')) {
    return result(name, 'SKIP', 'normalized records carry no parent_source_record_id column');
  }
  const known = new Set(records.map((r) => r.source_record_id));
  const findings = [];
  for (const r of records) {
    const parent = r.parent_source_record_id;
    if (!parent) continue;
    if (!known.has(parent)) findings.push(`${r.source_record_id} -> unknown parent ${parent}`);
    if (parent === r.source_record_id) findings.push(`${r.source_record_id} is its own parent`);
  }
  // child types must have a parent
  for (const r of records) {
    if (r.normalized_record_type === 'CHILD_SCENARIO' && !r.parent_source_record_id) {
      findings.push(`${r.source_record_id} is CHILD_SCENARIO with no parent`);
    }
  }
  return findings.length
    ? result(name, FAIL, 'broken parent links', findings)
    : result(name, PASS, 'all parent links resolve and no cycles of length 1');
}

// --- 7. no orphan records ---------------------------------------------------

export function validate_no_orphan_records() {
  const name = 'validate_no_orphan_records';
  if (!existsSync(paths.ledger)) return result(name, 'SKIP', 'no source ledger yet');
  const ledgerIds = new Set(readCsv(paths.ledger).records.map((r) => r.source_record_id));
  const findings = [];

  if (existsSync(paths.normalized)) {
    const norm = readCsv(paths.normalized).records;
    const normIds = new Set(norm.map((r) => r.source_record_id));
    const dropped = [...ledgerIds].filter((id) => !normIds.has(id));
    if (dropped.length) findings.push(`${dropped.length} ledger IDs absent from normalized set: ${dropped.slice(0, 5).join(', ')}`);
    const foreign = [...normIds].filter((id) => !ledgerIds.has(id));
    if (foreign.length) findings.push(`${foreign.length} normalized IDs not in ledger: ${foreign.slice(0, 5).join(', ')}`);
  }

  if (existsSync(paths.libraryCsv)) {
    const lib = readCsv(paths.libraryCsv).records;
    for (const r of lib) {
      const srcs = (r.source_record_ids || '').split(/[;,]/).map((s) => s.trim()).filter(Boolean);
      if (srcs.length === 0 && r.internal_support_status !== 'INTERNAL_ONLY') {
        findings.push(`${r.canonical_intent_id} has no source_record_ids and is not INTERNAL_ONLY`);
      }
      const unknown = srcs.filter((s) => !ledgerIds.has(s));
      if (unknown.length) findings.push(`${r.canonical_intent_id} cites unknown source ${unknown.slice(0, 3).join(', ')}`);
    }
  }
  if (!existsSync(paths.normalized) && !existsSync(paths.libraryCsv)) {
    return result(name, 'SKIP', 'no downstream artifacts to check for orphans yet');
  }
  return findings.length
    ? result(name, FAIL, 'orphaned or dropped records', findings)
    : result(name, PASS, 'every source record is accounted for downstream');
}

// --- 8. surface mapping -----------------------------------------------------

export function validate_surface_mapping() {
  const name = 'validate_surface_mapping';
  const skip = skipIfMissing(name, paths.surfaceMapping, 'surface mapping');
  if (skip) return skip;
  const { records } = readCsv(paths.surfaceMapping);
  const findings = [];
  const bad = [...new Set(records.map((r) => r.surface).filter((s) => !SURFACES.includes(s)))];
  if (bad.length) findings.push(`illegal surfaces: ${bad.join(', ')}`);
  if (existsSync(paths.libraryCsv)) {
    const libIds = new Set(readCsv(paths.libraryCsv).records.map((r) => r.canonical_intent_id));
    const unmapped = [...libIds].filter((id) => !records.some((r) => r.canonical_intent_id === id));
    if (unmapped.length) findings.push(`${unmapped.length} canonical intents unmapped (mapping must be exhaustive): ${unmapped.slice(0, 5).join(', ')}`);
    const foreign = [...new Set(records.map((r) => r.canonical_intent_id))].filter((id) => !libIds.has(id));
    if (foreign.length) findings.push(`${foreign.length} mapped IDs absent from the library: ${foreign.slice(0, 5).join(', ')}`);
  }
  return findings.length
    ? result(name, FAIL, 'surface mapping incomplete or invalid', findings)
    : result(name, PASS, `${records.length} mapping rows, all surfaces legal and exhaustive`);
}

// --- 9. data readiness ------------------------------------------------------

export function validate_data_readiness() {
  const name = 'validate_data_readiness';
  const skip = skipIfMissing(name, paths.dataReadiness, 'data readiness matrix');
  if (skip) return skip;
  const { records } = readCsv(paths.dataReadiness);
  const findings = [];
  const bad = [...new Set(records.map((r) => r.data_readiness).filter((s) => !DATA_READINESS.includes(s)))];
  if (bad.length) findings.push(`illegal readiness values: ${bad.join(', ')}`);
  // A high-risk intent may never be marked READY: policy high_risk_without_authority.
  for (const r of records) {
    if (['SAFETY', 'MEDICAL', 'LEGAL_REGULATORY'].includes(r.publication_risk)
      && ['READY', 'READY_WITH_LIMITED_DISTRICTS'].includes(r.data_readiness)) {
      findings.push(`${r.canonical_intent_id}: ${r.publication_risk} risk marked ${r.data_readiness} (must be HIGH_RISK_NOT_READY)`);
    }
  }
  return findings.length
    ? result(name, FAIL, 'data readiness violates risk policy', findings)
    : result(name, PASS, `${records.length} readiness rows, risk policy respected`);
}

// --- 10. scorecard ----------------------------------------------------------

export function validate_scorecard() {
  const name = 'validate_scorecard';
  const skip = skipIfMissing(name, paths.shortlist, 'action job shortlist');
  if (skip) return skip;
  const { columns, records } = readCsv(paths.shortlist);
  const findings = [];
  const factors = Object.keys(SCORECARD_WEIGHTS);
  const absent = factors.filter((f) => !columns.includes(f));
  if (absent.length) findings.push(`missing scorecard columns: ${absent.join(', ')}`);
  if (records.length < 20 || records.length > 30) {
    findings.push(`shortlist has ${records.length} rows, spec requires 20-30`);
  }
  for (const r of records) {
    let sum = 0;
    for (const [f, max] of Object.entries(SCORECARD_WEIGHTS)) {
      const v = Number(r[f]);
      if (Number.isNaN(v)) { findings.push(`${r.canonical_intent_id}: ${f} is not numeric`); continue; }
      if (v < 0 || v > max) findings.push(`${r.canonical_intent_id}: ${f}=${v} exceeds max ${max}`);
      sum += v;
    }
    if (columns.includes('total_score')) {
      const declared = Number(r.total_score);
      if (!Number.isNaN(declared) && Math.abs(declared - sum) > 0.001) {
        findings.push(`${r.canonical_intent_id}: total_score=${declared} but factors sum to ${sum}`);
      }
    }
  }
  return findings.length
    ? result(name, FAIL, 'scorecard invalid', findings)
    : result(name, PASS, `${records.length} shortlist rows, all factor scores within weight bounds`);
}

// Guards the failure mode that produced a shipped-but-unreachable pilot: the
// reuse gate certified /bali/ubud/date-night as "already served in production"
// on venue-coverage evidence alone, never checking that the route resolves.
// Data readiness and route reachability are separate questions; this check asks
// the second one.
export function validate_route_reachability() {
  const name = 'validate_route_reachability';
  const skip = skipIfMissing(name, paths.coverageSnapshot, 'coverage snapshot');
  if (skip) return skip;

  let gates;
  try {
    gates = loadRouteGates();
  } catch (e) {
    // A parser that silently defaults would re-create the original bug, so an
    // unreadable gate is a hard failure, not a shrug.
    return result(name, FAIL, 'cannot read route gates from lib/data.ts', [e.message]);
  }

  const { records } = readCsv(paths.coverageSnapshot);
  const cells = reachabilityForSnapshot(records, gates);
  const reachable = cells.filter((c) => c.verdict === 'REACHABLE');
  const indeterminate = cells.filter((c) => c.verdict === 'INDETERMINATE');

  // Which route does this run actually claim to build on? Take it from the
  // literal paths written into the pilot artifacts rather than inferring it
  // from prose — a district name appears in many sentences, but a
  // `/bali/<district>/<intent>` string is an unambiguous commitment.
  const findings = [];
  const claimedPaths = new Set();
  for (const artifact of [paths.productBrief, paths.reuseGate]) {
    if (!existsSync(artifact)) continue;
    for (const p of readFileSync(artifact, 'utf8').match(/\/bali\/[a-z-]+\/[a-z-]+/g) ?? []) {
      claimedPaths.add(p);
    }
  }

  // The winner's job slug comes from the shortlist, keyed by the id the run
  // recorded in state.json — so this follows the pipeline's own decision rather
  // than re-deriving it.
  let winnerJobSlug = null;
  if (existsSync(paths.state) && existsSync(paths.shortlist)) {
    const winnerId = JSON.parse(readFileSync(paths.state, 'utf8')).winner;
    if (winnerId) {
      const row = readCsv(paths.shortlist).records.find((r) => r.canonical_intent_id === winnerId);
      winnerJobSlug = row?.job_slug ?? null;
    }
  }

  for (const claimed of claimedPaths) {
    const district = claimed.split('/')[2];
    const cell = cells.find(
      (c) => c.district === district && (winnerJobSlug ? c.jobSlug === winnerJobSlug : true)
    );
    if (!cell) {
      findings.push(`${claimed} is claimed by the pilot but has no cell in the coverage snapshot`);
    } else if (cell.verdict !== 'REACHABLE') {
      findings.push(`${claimed} is claimed by the pilot but is ${cell.verdict}: ${cell.reasons.join('; ')}`);
    }
  }

  if (findings.length) {
    return result(name, FAIL, 'the pilot targets a route that does not resolve', findings);
  }

  const detail =
    `${cells.length} (district, job) cells: ${reachable.length} reachable` +
    (indeterminate.length ? `, ${indeterminate.length} indeterminate` : '') +
    `, ${cells.length - reachable.length - indeterminate.length} unreachable` +
    ` (gates read live from ${gates.source})`;

  // Zero reachable cells is not by itself a failure — a run may legitimately
  // precede any qualifying data — but it must never pass unremarked, because
  // that is the state in which a build decision is most likely to be wrong.
  return result(name, PASS, detail, reachable.length === 0
    ? ['NOTE: no (district, job) cell currently yields a spoke; any EXTEND_EXISTING decision on this route would be extending nothing']
    : undefined);
}

export const ALL_CHECKS = [
  validate_source_ledger,
  validate_unique_ids,
  validate_csv_shapes,
  validate_required_fields,
  validate_allowed_enums,
  validate_parent_links,
  validate_no_orphan_records,
  validate_surface_mapping,
  validate_data_readiness,
  validate_scorecard,
  validate_route_reachability,
];
