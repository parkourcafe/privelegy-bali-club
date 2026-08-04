#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_scorecard } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_scorecard()]);
