#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_no_orphan_records } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_no_orphan_records()]);
