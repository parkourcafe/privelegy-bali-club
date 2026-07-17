#!/usr/bin/env node

import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { inspectIosRelease } from "./ios-release-core.mjs";

const args = new Set(process.argv.slice(2));
const configOnly = args.has("--config-only");
const archive = args.has("--archive");
const unknown = [...args].filter((arg) => !["--config-only", "--archive"].includes(arg));
if (unknown.length || (configOnly && archive)) {
  console.error("Usage: verify-ios-release.mjs [--config-only | --archive]");
  process.exit(2);
}

const root = process.cwd();
const artifacts = path.resolve(root, process.env.IOS_ARTIFACTS_PATH ?? "artifacts/ios");
const derivedData = path.resolve(root, process.env.DERIVED_DATA_PATH ?? "artifacts/ios/DerivedData");
await mkdir(artifacts, { recursive: true });

const preflight = await inspectIosRelease({ root });
console.log(JSON.stringify({ phase: "preflight", ...preflight }, null, 2));
if (!preflight.ok) process.exit(1);
if (configOnly) process.exit(0);
if (process.platform !== "darwin") {
  console.error("A full ios:verify requires macOS with Xcode; use --config-only for portable checks");
  process.exit(2);
}

const resultBundle = path.join(artifacts, archive ? "Archive.xcresult" : "App.xcresult");
await rm(resultBundle, { recursive: true, force: true });
const archivePath = path.join(artifacts, "App.xcarchive");
if (archive) await rm(archivePath, { recursive: true, force: true });

const xcodeArgs = [
  "-project", "ios/App/App.xcodeproj",
  "-scheme", "App",
  "-configuration", "Release",
  "-derivedDataPath", derivedData,
  "-resultBundlePath", resultBundle,
  "CODE_SIGNING_ALLOWED=NO",
  "CODE_SIGNING_REQUIRED=NO",
  "COMPILER_INDEX_STORE_ENABLE=NO",
];
if (archive) {
  xcodeArgs.push(
    "-sdk", "iphoneos",
    "-destination", "generic/platform=iOS",
    "-archivePath", archivePath,
    "archive",
  );
} else {
  xcodeArgs.push(
    "-sdk", "iphonesimulator",
    "-destination", "generic/platform=iOS Simulator",
    "clean", "build",
  );
}

const exitCode = await new Promise((resolve, reject) => {
  const child = spawn("xcodebuild", xcodeArgs, { cwd: root, stdio: "inherit" });
  child.once("error", reject);
  child.once("exit", (code, signal) => {
    if (signal) reject(new Error(`xcodebuild ended with ${signal}`));
    else resolve(code ?? 1);
  });
});
if (exitCode !== 0) process.exit(exitCode);

const appPath = archive
  ? path.join(archivePath, "Products/Applications/App.app")
  : path.join(derivedData, "Build/Products/Release-iphonesimulator/App.app");
const finalReport = await inspectIosRelease({ root, appPath });
console.log(JSON.stringify({ phase: archive ? "archive" : "simulator-release", ...finalReport }, null, 2));
await writeFile(
  path.join(artifacts, "privacy-evidence.json"),
  `${JSON.stringify(finalReport.privacyEvidence, null, 2)}\n`,
  "utf8",
);
if (!finalReport.ok) process.exit(1);
