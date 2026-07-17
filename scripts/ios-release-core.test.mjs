import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { copyFile, mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import test from "node:test";
import { privacyManifestEvidence } from "./ios-release-core.mjs";

const execFileAsync = promisify(execFile);
const sourceManifest = path.resolve("ios/App/App/PrivacyInfo.xcprivacy");

function assertPreferencesDeclaration(evidence) {
  assert.deepEqual(evidence?.missingKeys, []);
  assert.equal(evidence?.userDefaultsReasonCA921, true);
  assert.deepEqual(evidence?.collectedDataTypes, [
    "NSPrivacyCollectedDataTypeCoarseLocation",
    "NSPrivacyCollectedDataTypeOtherDiagnosticData",
    "NSPrivacyCollectedDataTypeProductInteraction",
  ]);
  assert.equal(evidence?.collectedDataTypesExact, true);
  assert.equal(evidence?.status, "declared-values-require-review");
}

test("privacy evidence reads the source XML manifest", async () => {
  assertPreferencesDeclaration(
    await privacyManifestEvidence(sourceManifest, "PrivacyInfo.xcprivacy"),
  );
});

test(
  "privacy evidence decodes the binary manifest emitted by Xcode",
  { skip: process.platform !== "darwin" },
  async () => {
    const directory = await mkdtemp(path.join(os.tmpdir(), "otherbali-privacy-"));
    const binaryManifest = path.join(directory, "PrivacyInfo.xcprivacy");
    try {
      await copyFile(sourceManifest, binaryManifest);
      await execFileAsync("/usr/bin/plutil", ["-convert", "binary1", binaryManifest]);
      assertPreferencesDeclaration(
        await privacyManifestEvidence(binaryManifest, "PrivacyInfo.xcprivacy"),
      );
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  },
);
