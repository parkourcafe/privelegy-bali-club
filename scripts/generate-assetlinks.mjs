import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const FINGERPRINT_PATTERN = /^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/;

export function normalizeSha256Fingerprint(value, label) {
  const fingerprint = String(value ?? "").trim().toUpperCase();
  if (!FINGERPRINT_PATTERN.test(fingerprint)) {
    throw new Error(`${label} must be a colon-separated SHA-256 certificate fingerprint`);
  }
  return fingerprint;
}

export function createAssetLinks({ playAppSigningSha256, rustoreAppSigningSha256 }) {
  const fingerprints = [...new Set([
    normalizeSha256Fingerprint(playAppSigningSha256, "Google Play app-signing certificate"),
    normalizeSha256Fingerprint(rustoreAppSigningSha256, "RuStore app-signing certificate"),
  ])];

  return [{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.otherbali.app",
      sha256_cert_fingerprints: fingerprints,
    },
  }];
}

export function writeAssetLinks({ outputPath, ...certificates }) {
  const resolvedOutput = resolve(outputPath);
  mkdirSync(dirname(resolvedOutput), { recursive: true });
  writeFileSync(resolvedOutput, `${JSON.stringify(createAssetLinks(certificates), null, 2)}\n`, {
    encoding: "utf8",
    mode: 0o644,
  });
  return resolvedOutput;
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (invokedPath === import.meta.url) {
  const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const outputPath = process.env.OTHER_BALI_ASSETLINKS_OUTPUT
    ?? resolve(repositoryRoot, "public/.well-known/assetlinks.json");
  const written = writeAssetLinks({
    outputPath,
    playAppSigningSha256: process.env.OTHER_BALI_PLAY_APP_SIGNING_SHA256,
    rustoreAppSigningSha256: process.env.OTHER_BALI_RUSTORE_APP_SIGNING_SHA256,
  });
  console.log(`Wrote verified Android App Links statement to ${written}`);
}
