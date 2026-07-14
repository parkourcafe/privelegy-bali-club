#!/usr/bin/env node

import { inspectNativeReadiness } from "./ios-native-readiness-core.mjs";

const args = new Set(process.argv.slice(2));
const strict = args.delete("--strict");
if (args.size) {
  console.error("Usage: ios-native-readiness.mjs [--strict]");
  process.exit(2);
}

const report = await inspectNativeReadiness();
console.log(JSON.stringify(report, null, 2));
if (strict && !report.ready) process.exit(1);
