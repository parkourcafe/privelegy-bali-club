#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_csv_shapes } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_csv_shapes()]);
