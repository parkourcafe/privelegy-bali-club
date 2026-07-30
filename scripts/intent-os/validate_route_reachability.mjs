#!/usr/bin/env node
// Single-check entry point. See checks.mjs for the implementation.
import { validate_route_reachability } from './checks.mjs';
import { reportAndExit } from './lib.mjs';
reportAndExit([validate_route_reachability()]);
