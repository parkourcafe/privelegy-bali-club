#!/usr/bin/env node
// Stage 2 — normalize source records into typed rows plus three registers.
//
// Outputs:
//   02_NORMALIZED_SOURCE_RECORDS_V0_1.csv  (all 200, one type each)
//   03_ALIAS_AND_MODIFIER_REGISTER_V0_1.csv
//   04_SUPPORTING_JOB_REGISTER_V0_1.csv
//   05_HIGH_RISK_AND_REJECT_REGISTER_V0_1.csv
//
// Master goal Stage 2: "Do not force the output to contain 100 or 200 canonical
// parents." No target distribution is imposed anywhere below.

import {
  paths, readCsv, writeCsv, readState, writeState, appendEvent, appendDecision,
  nowIso, GENERATOR, SOURCE_VERSION, REPO_ROOT,
} from './lib.mjs';
import { RISK_RULES, TYPE_RULES, OVERRIDES, PARENTS } from './classify-rules.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

const NORMALIZED_COLUMNS = [
  'source_record_id', 'original_name', 'original_domain', 'original_status', 'original_confidence',
  'normalized_record_type', 'parent_source_record_id', 'risk_class', 'decision_rule',
  'auto_decision_reason', 'created_at', 'generator', 'source_version',
];

function classifyRisk(row) {
  const hay = `${row.original_name} ${row.original_domain}`;
  for (const r of RISK_RULES) if (r.re.test(hay)) return { risk: r.risk, rule: r.id };
  return { risk: 'LOW', rule: 'RISK.DEFAULT_LOW' };
}

function classifyType(row, risk) {
  for (const rule of TYPE_RULES) {
    if (rule.requiresRisk) {
      if (rule.requiresRisk.includes(risk)) return { type: rule.type, rule: rule.id };
      continue;
    }
    if (rule.reDomain && rule.reDomain.test(row.original_domain)) return { type: rule.type, rule: rule.id };
    if (rule.re && rule.re.test(row.original_name)) return { type: rule.type, rule: rule.id };
  }
  return { type: 'CANONICAL_USER_JOB', rule: 'TYPE.FALLBACK' };
}

const { records: ledger } = readCsv(paths.ledger);
const normalized = [];
const overridesApplied = [];

for (const row of ledger) {
  const { risk, rule: riskRule } = classifyRisk(row);
  let { type, rule } = classifyType(row, risk);
  let parent = PARENTS[row.source_record_id] ?? '';
  let reason = `matched ${rule}; risk via ${riskRule}`;

  const override = OVERRIDES[row.source_record_id];
  if (override) {
    type = override.type;
    if (override.parent) parent = override.parent;
    rule = 'OVERRIDE';
    reason = `override: ${override.reason} (rule table had ${rule})`;
    overridesApplied.push(row.source_record_id);
  }

  // A record with a parent that is not itself a child type is a CHILD_SCENARIO,
  // unless it is high-risk (risk classification always wins).
  if (parent && type === 'CANONICAL_USER_JOB') {
    type = 'CHILD_SCENARIO';
    reason += '; has parent -> CHILD_SCENARIO';
  }
  // Guard: a child must never point at itself.
  if (parent === row.source_record_id) parent = '';

  normalized.push({
    source_record_id: row.source_record_id,
    original_name: row.original_name,
    original_domain: row.original_domain,
    original_status: row.original_status,
    original_confidence: row.original_confidence,
    normalized_record_type: type,
    parent_source_record_id: parent,
    risk_class: risk,
    decision_rule: rule,
    auto_decision_reason: reason,
    created_at: nowIso(),
    generator: GENERATOR,
    source_version: SOURCE_VERSION,
  });
}

// Parent integrity: a parent must exist and must not itself be a child.
const byId = new Map(normalized.map((r) => [r.source_record_id, r]));
for (const r of normalized) {
  if (!r.parent_source_record_id) continue;
  const p = byId.get(r.parent_source_record_id);
  if (!p) { r.parent_source_record_id = ''; r.auto_decision_reason += '; parent not found, link dropped'; continue; }
  if (p.parent_source_record_id) {
    // Collapse two-level chains to the root so the hierarchy stays one deep.
    const root = p.parent_source_record_id;
    r.parent_source_record_id = root;
    r.auto_decision_reason += `; parent collapsed to root ${root}`;
  }
}

writeCsv(paths.normalized, normalized, NORMALIZED_COLUMNS);

// --- register 03: aliases and modifiers ------------------------------------
const aliasRows = normalized
  .filter((r) => ['CHILD_SCENARIO', 'MODIFIER'].includes(r.normalized_record_type))
  .map((r) => ({
    source_record_id: r.source_record_id,
    alias_or_modifier: r.original_name,
    register_type: r.normalized_record_type === 'MODIFIER' ? 'MODIFIER' : 'ALIAS_CHILD_SCENARIO',
    parent_source_record_id: r.parent_source_record_id,
    risk_class: r.risk_class,
    auto_decision_reason: r.auto_decision_reason,
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  }));
writeCsv(paths.aliases, aliasRows, [
  'source_record_id', 'alias_or_modifier', 'register_type', 'parent_source_record_id',
  'risk_class', 'auto_decision_reason', 'created_at', 'generator', 'source_version']);

// --- register 04: supporting jobs -------------------------------------------
const supportingRows = normalized
  .filter((r) => ['SUPPORTING_JOB', 'PRODUCT_ACTION', 'ENTITY_QUERY'].includes(r.normalized_record_type))
  .map((r) => ({
    source_record_id: r.source_record_id,
    supporting_job_name: r.original_name,
    register_type: r.normalized_record_type,
    original_domain: r.original_domain,
    risk_class: r.risk_class,
    auto_decision_reason: r.auto_decision_reason,
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  }));
writeCsv(paths.supporting, supportingRows, [
  'source_record_id', 'supporting_job_name', 'register_type', 'original_domain',
  'risk_class', 'auto_decision_reason', 'created_at', 'generator', 'source_version']);

// --- register 05: high risk and rejects -------------------------------------
const highRiskRows = normalized
  .filter((r) => ['HIGH_RISK_GUIDE', 'REJECT'].includes(r.normalized_record_type))
  .map((r) => ({
    source_record_id: r.source_record_id,
    record_name: r.original_name,
    register_type: r.normalized_record_type,
    risk_class: r.risk_class,
    publication_status: r.normalized_record_type === 'REJECT' ? 'REJECTED' : 'RESEARCH_ONLY',
    auto_build_allowed: 'false',
    policy_basis: r.normalized_record_type === 'REJECT'
      ? 'out of product scope'
      : '04_AUTONOMOUS_DECISION_POLICY.yaml risk_policy: SAFETY/MEDICAL/LEGAL_REGULATORY -> RESEARCH_ONLY',
    auto_decision_reason: r.auto_decision_reason,
    created_at: nowIso(), generator: GENERATOR, source_version: SOURCE_VERSION,
  }));
writeCsv(paths.highRisk, highRiskRows, [
  'source_record_id', 'record_name', 'register_type', 'risk_class', 'publication_status',
  'auto_build_allowed', 'policy_basis', 'auto_decision_reason', 'created_at', 'generator', 'source_version']);

// --- summary ----------------------------------------------------------------
const byType = {};
for (const r of normalized) byType[r.normalized_record_type] = (byType[r.normalized_record_type] ?? 0) + 1;
const byRisk = {};
for (const r of normalized) byRisk[r.risk_class] = (byRisk[r.risk_class] ?? 0) + 1;

const gatePass = normalized.length === 200
  && new Set(normalized.map((r) => r.source_record_id)).size === 200;

const state = readState() ?? {};
state.state = gatePass ? 'RECONCILE' : 'FAILED_GATE';
state.updated_at = nowIso();
state.stages_completed = [...new Set([...(state.stages_completed ?? []), 'NORMALIZE'])];
if (!gatePass) state.terminal = 'FAILED_GATE';
writeState(state);

appendDecision(`
## ${nowIso()} — NORMALIZE: type assignment

Assigned exactly one normalized record type to all ${normalized.length} source records using an
ordered rule table (\`scripts/intent-os/classify-rules.mjs\`). First match wins; the winning rule id
is stored per row in \`decision_rule\`, so every assignment is traceable and reproducible.

Type distribution: ${Object.entries(byType).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(', ')}

Risk distribution: ${Object.entries(byRisk).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}=${v}`).join(', ')}

Risk classification is evaluated before type, and MEDICAL / LEGAL_REGULATORY / SAFETY records become
\`HIGH_RISK_GUIDE\` regardless of how the text is phrased. Policy basis: \`risk_policy\` in
\`04_AUTONOMOUS_DECISION_POLICY.yaml\` sets \`auto_build_allowed: false\` and
\`publication_status: RESEARCH_ONLY\` for those three classes. This is why a record such as
"Find medical clinic / hospital in emergency" is not treated as an ordinary venue-selection job.

${overridesApplied.length} explicit per-record overrides were applied where the rule table misfired:
${overridesApplied.join(', ') || '(none)'}. Each carries a reason in \`classify-rules.mjs\`.

No target distribution was imposed: Stage 2 explicitly forbids forcing 100 or 200 canonical parents.
`);

appendEvent({
  stage: 'NORMALIZE',
  status: gatePass ? 'PASS' : 'FAIL',
  inputs: [rel(paths.ledger)],
  outputs: [rel(paths.normalized), rel(paths.aliases), rel(paths.supporting), rel(paths.highRisk)],
  checks: [`normalized_count=${normalized.length}`, `overrides=${overridesApplied.length}`,
    ...Object.entries(byType).map(([k, v]) => `${k}=${v}`)],
  decisions: [`risk_gate=HIGH_RISK_GUIDE:${byType.HIGH_RISK_GUIDE ?? 0}`],
  next_state: state.state,
});

console.log('type distribution:');
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log('risk distribution:');
for (const [k, v] of Object.entries(byRisk).sort((a, b) => b[1] - a[1])) console.log(`  ${String(v).padStart(3)}  ${k}`);
console.log(`overrides applied: ${overridesApplied.length}`);
console.log(`gate: ${gatePass ? 'PASS' : 'FAIL'} -> ${state.state}`);
process.exit(gatePass ? 0 : 1);
