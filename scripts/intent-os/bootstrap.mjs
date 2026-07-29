#!/usr/bin/env node
// Stage 0 — bootstrap durable runtime state.
// Idempotent: re-running refreshes input hashes without destroying the event log.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { paths, sha256, nowIso, readState, writeState, appendEvent, GENERATOR, SOURCE_VERSION, REPO_ROOT } from './lib.mjs';

const rel = (p) => p.replace(REPO_ROOT + '/', '');

for (const dir of [paths.runtime, paths.canonical, paths.pilot]) mkdirSync(dir, { recursive: true });

const inputs = [paths.externalA, paths.externalB];
const missing = inputs.filter((p) => !existsSync(p));
if (missing.length > 0) {
  console.error('MISSING REQUIRED INPUT:\n' + missing.map(rel).join('\n'));
  process.exit(1);
}

const inputHashes = Object.fromEntries(inputs.map((p) => [rel(p), sha256(p)]));

const existing = readState();
const state = {
  program: 'other-bali-intent-os-autopilot',
  state: existing?.state ?? 'INGEST',
  initial_state: 'INGEST',
  created_at: existing?.created_at ?? nowIso(),
  updated_at: nowIso(),
  generator: GENERATOR,
  source_version: SOURCE_VERSION,
  input_hashes: inputHashes,
  stages_completed: existing?.stages_completed ?? [],
  terminal: existing?.terminal ?? null,
};
writeState(state);

if (!existsSync(paths.eventLog)) writeFileSync(paths.eventLog, '', 'utf8');
if (!existsSync(paths.errors)) writeFileSync(paths.errors, '', 'utf8');
if (!existsSync(paths.decisionLog)) {
  writeFileSync(paths.decisionLog,
    '# Intent OS Autopilot — Decision Log\n\n' +
    'Every material autonomous decision is appended here with its policy basis.\n' +
    'Policy source: `docs/intent-os/autopilot/04_AUTONOMOUS_DECISION_POLICY.yaml`.\n\n', 'utf8');
}

appendEvent({
  stage: 'BOOTSTRAP',
  status: 'PASS',
  inputs: inputs.map(rel),
  outputs: [rel(paths.state), rel(paths.eventLog), rel(paths.decisionLog), rel(paths.errors)],
  checks: [`input_files_present=${inputs.length}`],
  decisions: [`state=${state.state}`],
  next_state: state.state,
});

console.log(`state: ${state.state}`);
for (const [f, h] of Object.entries(inputHashes)) console.log(`  ${h.slice(0, 16)}  ${f}`);
