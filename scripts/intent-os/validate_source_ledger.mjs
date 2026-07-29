#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_source_ledger } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_source_ledger()]);
