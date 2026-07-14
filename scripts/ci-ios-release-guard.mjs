#!/usr/bin/env node

import { inspectIosRelease } from "./ios-release-core.mjs";

const [appPath] = process.argv.slice(2);
if (!appPath || process.argv.length !== 3) {
  console.error("Usage: ci-ios-release-guard.mjs <App.app>");
  process.exit(2);
}

const report = await inspectIosRelease({ appPath });
console.log(JSON.stringify(report, null, 2));
if (!report.ok) process.exit(1);
