#!/usr/bin/env node
// Umbrella validator. Exits non-zero if any check FAILs.
// Checks whose artifact does not exist yet report SKIP and do not fail the run,
// so this is meaningful at every pipeline state.
import { ALL_CHECKS } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit(ALL_CHECKS.map((c) => c()));
