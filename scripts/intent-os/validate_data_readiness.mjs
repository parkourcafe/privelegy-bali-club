#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_data_readiness } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_data_readiness()]);
