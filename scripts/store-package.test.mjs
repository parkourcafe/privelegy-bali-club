import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { RELEASE_CONTRACT } from "./release-artifacts-core.mjs";
import {
  inspectStorePackage,
  requiredManifestSectionState,
} from "./validate-store-package.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("store package preflight reports every owner and signed-capture gate without claiming readiness", async () => {
  const result = await inspectStorePackage({ root });
  assert.equal(result.ok, true);
  assert.equal(result.ready, false);
  assert.equal(result.screenshots.iphone69.length, 5);
  assert.ok(result.screenshots.iphone69.every((shot) => shot.width === 1320 && shot.height === 2868 && shot.hasAlpha === false));
  assert.ok(result.pending.includes("deviceEvidence:iphoneIpa"));
  assert.ok(result.pending.includes("deviceEvidence:samsungPlayDistributedBuild"));
  assert.ok(!result.pending.some((item) => item.startsWith("androidPhone:")));
  assert.equal(result.screenshots.androidPhone.length, 5);
  assert.ok(result.screenshots.androidPhone.every((shot) => shot.width === 1080 && shot.height === 1920 && shot.hasAlpha === false));
  assert.equal(
    result.pending.includes("releaseArtifactsEvidence"),
    result.releaseEvidence === null,
  );
  assert.ok(result.pending.includes("ownerInputs:appReviewContact"));
  assert.ok(result.pending.some((item) => item.includes("APP REVIEW CONTACT")));
  assert.ok(result.metadataLengths["Apple promotional text"] <= 170);
  assert.ok(result.metadataLengths["Google short description"] <= 80);
  assert.ok(result.metadataLengths["RuStore full description"] <= 4000);
  await assert.rejects(() => inspectStorePackage({ root, strict: true }), /Store package is not ready/);
});

test("store package requires both screenshot sets and every fixed owner gate", () => {
  const result = requiredManifestSectionState({
    screenshots: { iphone69: {} },
    ownerInputs: {},
  });
  assert.ok(result.failures.some((failure) => /iphone69, androidPhone|androidPhone, iphone69/.test(failure)));
  assert.deepEqual(result.pending.sort(), [
    "ownerInputs:ageAndTargetAudience",
    "ownerInputs:androidDeveloperAndPackageVerification",
    "ownerInputs:appReviewContact",
    "ownerInputs:appleExportCompliance",
    "ownerInputs:copyrightRightsHolder",
    "ownerInputs:dsaTraderStatus",
    "ownerInputs:googlePlayAccountTypeAndCreationDate",
    "ownerInputs:googlePlayTestingAndDeviceVerification",
    "ownerInputs:legalAndActualAddress",
    "ownerInputs:privacyLawfulBasisAndConsent",
    "ownerInputs:responsibleLegalDeveloper",
    "ownerInputs:storePrimaryLocales",
    "ownerInputs:supportInboxAndDeletionProcedure",
    "ownerInputs:thirdPartyContentRightsConfirmation",
    "ownerInputs:vercelProcessorAgreementConfirmation",
  ]);
});

test("store package freezes screenshot paths and dimensions instead of trusting manifest overrides", async () => {
  const manifest = JSON.parse(await readFile(path.join(root, "store-assets/package-manifest.json"), "utf8"));
  manifest.screenshots.iphone69.directory = "store-assets/screenshots/android/en-US/phone-9x16";
  manifest.screenshots.iphone69.width = 1;
  manifest.screenshots.iphone69.fileSha256 = {};
  const result = requiredManifestSectionState(manifest);
  assert.ok(result.failures.includes(
    "iphone69: directory must equal store-assets/screenshots/app-store/en-US/iphone-6.9",
  ));
  assert.ok(result.failures.includes("iphone69: width must equal 1320"));
  assert.ok(result.failures.includes(
    "iphone69: fileSha256 must contain exactly the five canonical screenshot names",
  ));
});

test("store package rejects a screenshot replaced after capture", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "other-bali-store-screenshot-hash-"));
  try {
    await Promise.all([
      cp(path.join(root, "store-assets"), path.join(fixture, "store-assets"), { recursive: true }),
      mkdir(path.join(fixture, "docs/release"), { recursive: true }),
    ]);
    await Promise.all([
      cp(path.join(root, "docs/store-submission-package.md"), path.join(fixture, "docs/store-submission-package.md")),
      cp(path.join(root, "docs/release/device-matrix.json"), path.join(fixture, "docs/release/device-matrix.json")),
      cp(
        path.join(root, "store-assets/screenshots/app-store/en-US/iphone-6.9/02-place-detail.png"),
        path.join(fixture, "store-assets/screenshots/app-store/en-US/iphone-6.9/01-places.png"),
      ),
    ]);
    await assert.rejects(
      () => inspectStorePackage({ root: fixture }),
      /screenshot SHA-256 does not match package manifest/,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("passed device evidence requires complete device, time, cases and pointers", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "other-bali-store-device-shape-"));
  try {
    await Promise.all([
      cp(path.join(root, "store-assets"), path.join(fixture, "store-assets"), { recursive: true }),
      mkdir(path.join(fixture, "docs/release"), { recursive: true }),
    ]);
    await cp(path.join(root, "docs/store-submission-package.md"), path.join(fixture, "docs/store-submission-package.md"));
    const matrix = JSON.parse(await readFile(path.join(root, "docs/release/device-matrix.json"), "utf8"));
    matrix.requiredSignedEvidence.samsungRustoreApk.device.os = null;
    matrix.requiredSignedEvidence.samsungRustoreApk.testedAt = null;
    matrix.requiredSignedEvidence.samsungRustoreApk.cases.onlineCatalogue = "pending";
    matrix.requiredSignedEvidence.samsungRustoreApk.evidencePointers = [];
    await writeFile(
      path.join(fixture, "docs/release/device-matrix.json"),
      `${JSON.stringify(matrix, null, 2)}\n`,
    );
    await assert.rejects(
      () => inspectStorePackage({ root: fixture }),
      /passed evidence requires manufacturer, model and OS[\s\S]*no valid testedAt[\s\S]*every required device case must be passed[\s\S]*requires evidence pointers/,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("store package rejects simulator screenshots not bound to verified source", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "other-bali-store-package-"));
  try {
    await Promise.all([
      cp(path.join(root, "store-assets"), path.join(fixture, "store-assets"), { recursive: true }),
      mkdir(path.join(fixture, "docs"), { recursive: true }),
      mkdir(path.join(fixture, "docs/release"), { recursive: true }),
      mkdir(path.join(fixture, "ios-web"), { recursive: true }),
    ]);
    await Promise.all([
      cp(path.join(root, "docs/store-submission-package.md"), path.join(fixture, "docs/store-submission-package.md")),
      cp(path.join(root, "docs/release/device-matrix.json"), path.join(fixture, "docs/release/device-matrix.json")),
      cp(path.join(root, "ios-web/build-manifest.json"), path.join(fixture, "ios-web/build-manifest.json")),
    ]);
    const manifestPath = path.join(fixture, "store-assets/package-manifest.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.screenshots.iphone69.sourceHash = "0".repeat(64);
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    const shell = JSON.parse(await readFile(path.join(fixture, "ios-web/build-manifest.json"), "utf8"));
    const commit = "a".repeat(40);
    const artifactDefinitions = {
      ios: ["artifacts/release/ios/OtherBali.ipa", "ipa"],
      googlePlay: ["android/app-play-release.aab", "aab"],
      ruStore: ["android/app-rustore-release.apk", "apk"],
    };
    const artifacts = {};
    for (const [key, [relative, contents]] of Object.entries(artifactDefinitions)) {
      const absolute = path.join(fixture, relative);
      await mkdir(path.dirname(absolute), { recursive: true });
      await writeFile(absolute, contents);
      artifacts[key] = {
        path: relative,
        sha256: createHash("sha256").update(contents).digest("hex"),
        gitCommit: commit,
        sourceHash: shell.sourceHash,
      };
    }
    const reportPath = path.join(fixture, manifest.evidence.releaseArtifacts);
    await mkdir(path.dirname(reportPath), { recursive: true });
    await writeFile(reportPath, `${JSON.stringify({
      schemaVersion: 1,
      verdict: "verified-release-artifacts",
      git: { commit, clean: true },
      releaseContract: RELEASE_CONTRACT,
      mobileShell: { sourceHash: shell.sourceHash },
      artifacts,
    }, null, 2)}\n`);
    await assert.rejects(
      () => inspectStorePackage({ root: fixture }),
      /screenshot source hash does not match verified mobile-shell evidence/,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("store package rejects Android screenshots tied to a stale device-tested APK", async () => {
  const fixture = await mkdtemp(path.join(os.tmpdir(), "other-bali-store-device-evidence-"));
  try {
    await Promise.all([
      cp(path.join(root, "store-assets"), path.join(fixture, "store-assets"), { recursive: true }),
      mkdir(path.join(fixture, "docs/release"), { recursive: true }),
    ]);
    await Promise.all([
      cp(path.join(root, "docs/store-submission-package.md"), path.join(fixture, "docs/store-submission-package.md")),
      cp(path.join(root, "docs/release/device-matrix.json"), path.join(fixture, "docs/release/device-matrix.json")),
    ]);
    const manifestPath = path.join(fixture, "store-assets/package-manifest.json");
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    manifest.screenshots.androidPhone.status = "ready";
    manifest.screenshots.androidPhone.signedArtifactSha256 = "0".repeat(64);
    await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

    await assert.rejects(
      () => inspectStorePackage({ root: fixture }),
      /screenshot artifact SHA-256 does not match passed samsungRustoreApk device evidence/,
    );

    const matrixPath = path.join(fixture, "docs/release/device-matrix.json");
    const matrix = JSON.parse(await readFile(matrixPath, "utf8"));
    manifest.screenshots.androidPhone.signedArtifactSha256 = matrix.requiredSignedEvidence
      .samsungRustoreApk.artifact.releaseArtifactSha256;
    matrix.requiredSignedEvidence.samsungRustoreApk.artifact.sourceCommit = "b".repeat(40);
    await Promise.all([
      writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`),
      writeFile(matrixPath, `${JSON.stringify(matrix, null, 2)}\n`),
    ]);
    await assert.rejects(
      () => inspectStorePackage({ root: fixture }),
      /source commit does not match the device-matrix release/,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
