#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_unique_ids } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_unique_ids()]);
