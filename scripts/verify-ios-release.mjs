#!/usr/bin/env node

import { chmod, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { Transform } from "node:stream";
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

const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN?.trim() ?? "";
if (mapboxAccessToken && !/^pk\.[A-Za-z0-9._-]{20,}$/.test(mapboxAccessToken)) {
  console.error("MAPBOX_ACCESS_TOKEN must be blank or a restricted Mapbox public token");
  process.exit(2);
}

function createSecretRedactor(secret, destination) {
  if (!secret) {
    return new Transform({
      transform(chunk, _encoding, callback) {
        destination.write(chunk);
        callback();
      },
    });
  }
  const decoder = new StringDecoder("utf8");
  let retained = "";
  const marker = "<redacted-mapbox-token>";

  const drain = (final = false) => {
    let matchIndex;
    while ((matchIndex = retained.indexOf(secret)) >= 0) {
      destination.write(retained.slice(0, matchIndex));
      destination.write(marker);
      retained = retained.slice(matchIndex + secret.length);
    }
    if (final) {
      destination.write(retained);
      retained = "";
      return;
    }
    const safeLength = Math.max(retained.length - secret.length + 1, 0);
    destination.write(retained.slice(0, safeLength));
    retained = retained.slice(safeLength);
  };

  return new Transform({
    transform(chunk, _encoding, callback) {
      retained += decoder.write(chunk);
      drain();
      callback();
    },
    flush(callback) {
      retained += decoder.end();
      drain(true);
      callback();
    },
  });
}

const resultBundle = path.join(artifacts, archive ? "Archive.xcresult" : "App.xcresult");
await rm(resultBundle, { recursive: true, force: true });
const archivePath = path.join(artifacts, "App.xcarchive");
if (archive) await rm(archivePath, { recursive: true, force: true });
const secretConfigDirectory = await mkdtemp(path.join(os.tmpdir(), "other-bali-ios-verify."));
await chmod(secretConfigDirectory, 0o700);
const secretConfigPath = path.join(secretConfigDirectory, "ReleaseSecrets.xcconfig");
await writeFile(secretConfigPath, `MAPBOX_ACCESS_TOKEN = ${mapboxAccessToken}\n`, {
  encoding: "utf8",
  mode: 0o600,
});
await chmod(secretConfigPath, 0o600);

const xcodeArgs = [
  "-quiet",
  "-project", "ios/App/App.xcodeproj",
  "-scheme", "App",
  "-configuration", "Release",
  "-xcconfig", secretConfigPath,
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

let exitCode;
try {
  exitCode = await new Promise((resolve, reject) => {
    const child = spawn("xcodebuild", xcodeArgs, {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    child.stdout.pipe(createSecretRedactor(mapboxAccessToken, process.stdout));
    child.stderr.pipe(createSecretRedactor(mapboxAccessToken, process.stderr));
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (signal) reject(new Error(`xcodebuild ended with ${signal}`));
      else resolve(code ?? 1);
    });
  });
} finally {
  await rm(secretConfigDirectory, { recursive: true, force: true });
}
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
