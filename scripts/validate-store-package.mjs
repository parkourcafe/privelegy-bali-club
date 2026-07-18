import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { RELEASE_CONTRACT } from "./release-artifacts-core.mjs";
import { inspectPng, validateStoreAssets } from "./validate-store-assets.mjs";

const EXPECTED_SCREENSHOT_FILES = [
  "01-places.png",
  "02-place-detail.png",
  "03-routes.png",
  "04-route-detail.png",
  "05-saved.png",
];
const EXPECTED_SCREENSHOT_PROVENANCE = Object.freeze({
  iphone69: {
    artifact: "ios",
    mode: "simulator-source",
    deviceEvidence: null,
    directory: "store-assets/screenshots/app-store/en-US/iphone-6.9",
    width: 1320,
    height: 2868,
    alpha: "forbidden",
    captureEvidence: "docs/release/evidence/iphone-simulator/capture.json",
  },
  androidPhone: {
    artifact: "ruStore",
    mode: "signed-device-artifact",
    deviceEvidence: "samsungRustoreApk",
    directory: "store-assets/screenshots/android/en-US/phone-9x16",
    width: 1080,
    height: 1920,
    alpha: "forbidden",
    captureEvidence: "docs/release/evidence/samsung-rustore/store-screenshot-capture.json",
    captureDisplay: {
      width: 1080,
      height: 1920,
      densityDpi: 450,
      orientation: "portrait",
    },
    captureSystemUi: {
      statusBar: "hidden",
      navigationBar: "hidden",
      mode: "immersive-full",
      restoredAfterCapture: true,
    },
  },
});
const REQUIRED_DEVICE_EVIDENCE = Object.freeze([
  "iphoneIpa",
  "samsungPlayDistributedBuild",
  "samsungRustoreApk",
]);
const DEVICE_EVIDENCE_ARTIFACT = Object.freeze({
  iphoneIpa: "ios",
  samsungPlayDistributedBuild: "googlePlay",
  samsungRustoreApk: "ruStore",
});
const ARTIFACT_KEYS = ["ios", "googlePlay", "ruStore"];
export const REQUIRED_OWNER_INPUTS = Object.freeze([
  "copyrightRightsHolder",
  "appReviewContact",
  "thirdPartyContentRightsConfirmation",
  "responsibleLegalDeveloper",
  "legalAndActualAddress",
  "dsaTraderStatus",
  "googlePlayAccountTypeAndCreationDate",
  "googlePlayTestingAndDeviceVerification",
  "vercelProcessorAgreementConfirmation",
  "supportInboxAndDeletionProcedure",
  "privacyLawfulBasisAndConsent",
  "androidDeveloperAndPackageVerification",
  "storePrimaryLocales",
  "ageAndTargetAudience",
  "appleExportCompliance",
]);

export function requiredManifestSectionState(manifest) {
  const failures = [];
  const pending = [];
  const screenshotKeys = Object.keys(manifest.screenshots ?? {}).sort();
  const expectedScreenshotKeys = Object.keys(EXPECTED_SCREENSHOT_PROVENANCE).sort();
  if (JSON.stringify(screenshotKeys) !== JSON.stringify(expectedScreenshotKeys)) {
    failures.push(`package manifest must contain exactly these screenshot sets: ${expectedScreenshotKeys.join(", ")}`);
  }
  for (const key of expectedScreenshotKeys) {
    const set = manifest.screenshots?.[key];
    if (!set) continue;
    const provenance = EXPECTED_SCREENSHOT_PROVENANCE[key];
    const expectedFields = {
      directory: provenance.directory,
      width: provenance.width,
      height: provenance.height,
      alpha: provenance.alpha,
      captureArtifact: provenance.artifact,
      captureMode: provenance.mode,
    };
    for (const [field, expected] of Object.entries(expectedFields)) {
      if (set[field] !== expected) failures.push(`${key}: ${field} must equal ${expected}`);
    }
    if (JSON.stringify(set.files) !== JSON.stringify(EXPECTED_SCREENSHOT_FILES)) {
      failures.push(`${key}: the five canonical screenshot names are required in order`);
    }
    const recordedHashKeys = Object.keys(set.fileSha256 ?? {}).sort();
    if (JSON.stringify(recordedHashKeys) !== JSON.stringify([...EXPECTED_SCREENSHOT_FILES].sort())) {
      failures.push(`${key}: fileSha256 must contain exactly the five canonical screenshot names`);
    }
  }
  const ownerKeys = Object.keys(manifest.ownerInputs ?? {});
  const unexpectedOwnerKeys = ownerKeys.filter((key) => !REQUIRED_OWNER_INPUTS.includes(key));
  if (unexpectedOwnerKeys.length) {
    failures.push(`package manifest has unexpected owner-input gates: ${unexpectedOwnerKeys.join(", ")}`);
  }
  for (const key of REQUIRED_OWNER_INPUTS) {
    if (!Object.hasOwn(manifest.ownerInputs ?? {}, key)) pending.push(`ownerInputs:${key}`);
  }
  return { failures, pending };
}

function repositoryPath(root, relative, label) {
  if (typeof relative !== "string" || !relative || path.isAbsolute(relative)
    || relative.split(/[\\/]/).includes("..")) {
    throw new Error(`${label} must be a safe repository-relative path`);
  }
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`${label} escapes the repository`);
  }
  return resolved;
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function isSha256(value) {
  return /^[a-f0-9]{64}$/.test(value ?? "");
}

function isCommit(value) {
  return /^[a-f0-9]{40}$/.test(value ?? "");
}

function isTimestamp(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function inspectReleaseDeclaration(release, failures) {
  const expected = {
    ios: {
      bundleId: RELEASE_CONTRACT.appId,
      version: RELEASE_CONTRACT.iosVersion,
      build: RELEASE_CONTRACT.iosBuild,
    },
    android: {
      applicationId: RELEASE_CONTRACT.appId,
      versionName: RELEASE_CONTRACT.androidVersion,
      versionCode: Number(RELEASE_CONTRACT.androidVersionCode),
    },
  };
  if (JSON.stringify(release) !== JSON.stringify(expected)) {
    failures.push("package manifest release identity/version does not match the signed release contract");
  }
}

function between(text, start, end) {
  const startIndex = text.indexOf(start);
  if (startIndex < 0) throw new Error(`Store metadata is missing ${start}`);
  const remainder = text.slice(startIndex + start.length);
  const endIndex = end ? remainder.indexOf(end) : -1;
  return endIndex >= 0 ? remainder.slice(0, endIndex) : remainder;
}

function codeValues(fieldBlock) {
  return [...fieldBlock.matchAll(/`([^`]+)`/g)].map((match) => match[1]);
}

function firstCodeAfter(section, heading, nextHeading) {
  const block = between(section, `**${heading}**`, nextHeading ? `**${nextHeading}**` : undefined);
  const [value] = codeValues(block);
  if (!value) throw new Error(`Store metadata field ${heading} has no value`);
  return value;
}

function codeParagraphsAfter(section, heading, nextHeading) {
  const values = codeValues(between(section, `**${heading}**`, `**${nextHeading}**`));
  if (!values.length) throw new Error(`Store metadata field ${heading} has no value`);
  return values.join("\n\n");
}

function characterCount(value) {
  return Array.from(value).length;
}

function inspectMetadata(markdown, failures, pending) {
  const apple = between(markdown, "## Apple App Store", "## Google Play");
  const google = between(markdown, "## Google Play", "## RuStore");
  const rustore = between(markdown, "## RuStore", "## Final screenshot shot list");
  const fields = [
    ["Apple name", firstCodeAfter(apple, "Name", "Subtitle"), 30],
    ["Apple subtitle", firstCodeAfter(apple, "Subtitle", "Promotional text"), 30],
    ["Apple promotional text", firstCodeAfter(apple, "Promotional text", "Description"), 170],
    ["Apple description", codeParagraphsAfter(apple, "Description", "Keywords"), 4000],
    ["Google app name", firstCodeAfter(google, "App name", "Short description"), 30],
    ["Google short description", firstCodeAfter(google, "Short description", "Full description"), 80],
    ["Google full description", codeParagraphsAfter(google, "Full description", "Release name"), 4000],
    ["RuStore name", firstCodeAfter(rustore, "Название", "Краткое описание"), 30],
    ["RuStore short description", firstCodeAfter(rustore, "Краткое описание", "Подробное описание"), 80],
    ["RuStore full description", codeParagraphsAfter(rustore, "Подробное описание", "Что нового в версии 1.0.0"), 4000],
  ];
  const keywords = firstCodeAfter(apple, "Keywords", "Primary category");
  if (Buffer.byteLength(keywords, "utf8") > 100) failures.push("Apple keywords exceed 100 UTF-8 bytes");
  for (const [label, value, maximum] of fields) {
    const length = characterCount(value);
    if (length > maximum) failures.push(`${label} exceeds ${maximum} characters (${length})`);
  }
  for (const match of markdown.matchAll(/\[[^\]\n]*(?:REQUIRED|HOLDER)[^\]\n]*\]/g)) {
    pending.push(`submissionDocument:${match[0]}`);
  }
  if (/\*\*Version 1\.0 release notes\*\*/.test(apple)) {
    failures.push("Apple What's New must not be supplied for the first version");
  }
  return Object.fromEntries(fields.map(([label, value]) => [label, characterCount(value)]));
}

async function fileBufferOrNull(file) {
  try {
    return await readFile(file);
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function releaseEvidence({ root, manifest, failures, pending }) {
  const relative = manifest.evidence?.releaseArtifacts;
  if (!relative) {
    failures.push("package manifest has no release-artifact evidence path");
    return null;
  }
  let evidencePath;
  try {
    evidencePath = repositoryPath(root, relative, "release-artifact evidence path");
  } catch (error) {
    failures.push(error.message);
    return null;
  }
  const bytes = await fileBufferOrNull(evidencePath);
  if (!bytes) {
    pending.push("releaseArtifactsEvidence");
    return null;
  }
  let report;
  try {
    report = JSON.parse(bytes.toString("utf8"));
  } catch {
    failures.push("release-artifact evidence is not valid JSON");
    return null;
  }
  if (report.schemaVersion !== 1 || report.verdict !== "verified-release-artifacts") {
    failures.push("release-artifact evidence has no verified release verdict");
  }
  if (!/^[a-f0-9]{40}$/.test(report.git?.commit ?? "") || report.git?.clean !== true) {
    failures.push("release-artifact evidence has no clean source commit");
  }
  if (!/^[a-f0-9]{64}$/.test(report.mobileShell?.sourceHash ?? "")) {
    failures.push("release-artifact evidence has no canonical mobile-shell hash");
  }
  const expectedContract = {
    ...RELEASE_CONTRACT,
    androidPermissions: [...RELEASE_CONTRACT.androidPermissions],
  };
  if (JSON.stringify(report.releaseContract) !== JSON.stringify(expectedContract)) {
    failures.push("release-artifact evidence contract differs from the current release contract");
  }
  const currentShellBytes = await fileBufferOrNull(path.join(root, "ios-web/build-manifest.json"));
  try {
    const currentShell = currentShellBytes ? JSON.parse(currentShellBytes.toString("utf8")) : null;
    if (currentShell?.sourceHash !== report.mobileShell?.sourceHash) {
      failures.push("release-artifact evidence does not match the current canonical mobile shell");
    }
  } catch {
    failures.push("current canonical mobile-shell manifest is malformed");
  }
  for (const key of ARTIFACT_KEYS) {
    const artifact = report.artifacts?.[key];
    if (!artifact || !/^[a-f0-9]{64}$/.test(artifact.sha256 ?? "")) {
      failures.push(`release-artifact evidence is missing ${key} SHA-256`);
      continue;
    }
    if (artifact.gitCommit !== report.git?.commit
      || artifact.sourceHash !== report.mobileShell?.sourceHash) {
      failures.push(`release-artifact evidence for ${key} is not bound to the verified source`);
    }
    let artifactPath;
    try {
      artifactPath = repositoryPath(root, artifact.path, `${key} artifact path`);
    } catch (error) {
      failures.push(error.message);
      continue;
    }
    const artifactBytes = await fileBufferOrNull(artifactPath);
    if (!artifactBytes) failures.push(`${key} artifact referenced by release evidence is missing`);
    else if (sha256(artifactBytes) !== artifact.sha256) {
      failures.push(`${key} artifact SHA-256 no longer matches release evidence`);
    }
  }
  return report;
}

async function deviceEvidence({ root, manifest, failures }) {
  const relative = manifest.evidence?.deviceMatrix;
  if (!relative) {
    failures.push("package manifest has no device-matrix evidence path");
    return null;
  }
  let evidencePath;
  try {
    evidencePath = repositoryPath(root, relative, "device-matrix evidence path");
  } catch (error) {
    failures.push(error.message);
    return null;
  }
  const bytes = await fileBufferOrNull(evidencePath);
  if (!bytes) {
    failures.push("device-matrix evidence is missing");
    return null;
  }
  try {
    const report = JSON.parse(bytes.toString("utf8"));
    if (report.schemaVersion !== 2) failures.push("device-matrix evidence has an unsupported schema");
    if (!isCommit(report.release?.commit)) failures.push("device-matrix release has no source commit");
    if (report.release?.verifiedAgainstCommit != null && !isCommit(report.release.verifiedAgainstCommit)) {
      failures.push("device-matrix verifiedAgainstCommit must be a full commit SHA when present");
    }
    return report;
  } catch {
    failures.push("device-matrix evidence is not valid JSON");
    return null;
  }
}

async function validateSimulatorCaptureEvidence({
  root,
  key,
  set,
  provenance,
  actualHashes,
  failures,
  pending,
}) {
  if (set.captureEvidence !== provenance.captureEvidence) {
    failures.push(`${key}: captureEvidence must equal ${provenance.captureEvidence}`);
    return;
  }
  let evidencePath;
  try {
    evidencePath = repositoryPath(root, set.captureEvidence, `${key} capture-evidence path`);
  } catch (error) {
    failures.push(error.message);
    return;
  }
  const bytes = await fileBufferOrNull(evidencePath);
  if (!bytes) {
    pending.push(`${key}:captureEvidence`);
    return;
  }
  let evidence;
  try {
    evidence = JSON.parse(bytes.toString("utf8"));
  } catch {
    failures.push(`${key}: capture evidence is not valid JSON`);
    return;
  }
  if (evidence.schemaVersion !== 1 || evidence.status !== "passed") {
    failures.push(`${key}: capture evidence has no passed verdict`);
  }
  if (evidence.sourceHash !== set.sourceHash) {
    failures.push(`${key}: capture evidence source hash does not match the screenshot set`);
  }
  if (evidence.captureDevice !== set.captureDevice || evidence.capturedAt !== set.capturedAt) {
    failures.push(`${key}: capture evidence device/time does not match the screenshot set`);
  }
  if (evidence.installationMode !== "clean-install") {
    failures.push(`${key}: Simulator capture evidence must come from a clean install`);
  }
  const expectedApp = {
    bundleId: RELEASE_CONTRACT.appId,
    version: RELEASE_CONTRACT.iosVersion,
    build: RELEASE_CONTRACT.iosBuild,
  };
  if (JSON.stringify(evidence.app) !== JSON.stringify(expectedApp)) {
    failures.push(`${key}: Simulator capture evidence has the wrong app identity/version`);
  }
  if (evidence.installation?.existingAppRemoved !== true
    || evidence.installation?.releaseSimulatorBuildInstalled !== true
    || evidence.installation?.firstLaunch !== "passed") {
    failures.push(`${key}: Simulator capture evidence has no complete installation record`);
  }
  const requiredCases = ["catalogLoaded", "routeLayout", "savePersistenceAfterRelaunch"];
  if (requiredCases.some((caseName) => evidence.cases?.[caseName] !== "passed")) {
    failures.push(`${key}: Simulator capture evidence is missing required passed cases`);
  }
  if (evidence.screenshotDirectory !== provenance.directory
    || JSON.stringify(evidence.screenshotSha256) !== JSON.stringify(actualHashes)) {
    failures.push(`${key}: capture evidence does not match the exact screenshot files`);
  }
  const expectedPointers = EXPECTED_SCREENSHOT_FILES.map((file) => path.join(provenance.directory, file));
  if (JSON.stringify(evidence.evidencePointers) !== JSON.stringify(expectedPointers)) {
    failures.push(`${key}: Simulator capture evidence must point to all five screenshot files`);
  }
}

async function validateSignedDeviceCaptureEvidence({
  root,
  key,
  set,
  provenance,
  actualHashes,
  artifactReport,
  deviceReport,
  manifest,
  failures,
  pending,
}) {
  if (set.captureEvidence !== provenance.captureEvidence) {
    failures.push(`${key}: captureEvidence must equal ${provenance.captureEvidence}`);
    return;
  }
  let evidencePath;
  try {
    evidencePath = repositoryPath(root, set.captureEvidence, `${key} capture-evidence path`);
  } catch (error) {
    failures.push(error.message);
    return;
  }
  const bytes = await fileBufferOrNull(evidencePath);
  if (!bytes) {
    pending.push(`${key}:captureEvidence`);
    return;
  }
  let evidence;
  try {
    evidence = JSON.parse(bytes.toString("utf8"));
  } catch {
    failures.push(`${key}: capture evidence is not valid JSON`);
    return;
  }
  if (evidence.schemaVersion !== 1 || evidence.status !== "passed") {
    failures.push(`${key}: capture evidence has no passed verdict`);
  }
  if (evidence.captureArtifact !== provenance.artifact || evidence.captureMode !== provenance.mode) {
    failures.push(`${key}: capture evidence has the wrong artifact or capture mode`);
  }
  if (evidence.sourceHash !== set.sourceHash) {
    failures.push(`${key}: capture evidence source hash does not match the screenshot set`);
  }
  if (!isCommit(evidence.sourceCommit)) {
    failures.push(`${key}: capture evidence has no source commit`);
  } else {
    if (artifactReport && evidence.sourceCommit !== artifactReport.git?.commit) {
      failures.push(`${key}: capture evidence source commit does not match release-artifact evidence`);
    }
    if (deviceReport && evidence.sourceCommit !== deviceReport.release?.commit) {
      failures.push(`${key}: capture evidence source commit does not match device evidence`);
    }
  }
  if (evidence.signedArtifactSha256 !== set.signedArtifactSha256) {
    failures.push(`${key}: capture evidence artifact SHA-256 does not match the screenshot set`);
  }
  if (evidence.captureDevice !== set.captureDevice || evidence.capturedAt !== set.capturedAt) {
    failures.push(`${key}: capture evidence device/time does not match the screenshot set`);
  }
  if (JSON.stringify(evidence.captureDisplay) !== JSON.stringify(provenance.captureDisplay)) {
    failures.push(`${key}: capture evidence does not match the frozen display configuration`);
  }
  if (JSON.stringify(evidence.captureSystemUi) !== JSON.stringify(provenance.captureSystemUi)) {
    failures.push(`${key}: capture evidence does not match the frozen system-UI configuration`);
  }
  const captureStartedAt = Date.parse(evidence.captureWindow?.startedAt ?? "");
  const captureCompletedAt = Date.parse(evidence.captureWindow?.completedAt ?? "");
  const capturedAt = Date.parse(evidence.capturedAt ?? "");
  if (Number.isNaN(captureStartedAt) || Number.isNaN(captureCompletedAt)
    || captureStartedAt > captureCompletedAt || captureCompletedAt !== capturedAt) {
    failures.push(`${key}: capture evidence has no valid ordered capture window`);
  }
  if (evidence.installationMode !== "clean-install") {
    failures.push(`${key}: signed-device capture evidence must come from a clean install`);
  }
  const expectedApp = {
    applicationId: RELEASE_CONTRACT.appId,
    versionName: RELEASE_CONTRACT.androidVersion,
    versionCode: Number(RELEASE_CONTRACT.androidVersionCode),
  };
  if (JSON.stringify(evidence.app) !== JSON.stringify(expectedApp)) {
    failures.push(`${key}: signed-device capture evidence has the wrong app identity/version`);
  }
  if (evidence.installation?.previousPackageRemoved !== true
    || evidence.installation?.signedReleaseApkInstalled !== true
    || evidence.installation?.installedArtifactHashMatched !== true) {
    failures.push(`${key}: signed-device capture evidence has no complete installation record`);
  }
  const requiredCases = ["catalogLoaded", "placeDetail", "routeLayout", "savePersistenceAfterRelaunch"];
  if (requiredCases.some((caseName) => evidence.cases?.[caseName] !== "passed")) {
    failures.push(`${key}: signed-device capture evidence is missing required passed cases`);
  }
  if (evidence.deviceQaEvidence !== manifest.evidence?.deviceMatrix) {
    failures.push(`${key}: capture evidence does not reference the canonical device matrix`);
  }
  const deviceEntry = deviceReport?.requiredSignedEvidence?.[provenance.deviceEvidence];
  if (deviceEntry?.status !== "passed") {
    failures.push(`${key}: capture evidence requires passed ${provenance.deviceEvidence} device evidence`);
  } else {
    const expectedDevice = `${deviceEntry.device?.manufacturer} ${deviceEntry.device?.model} / ${deviceEntry.device?.os}`;
    if (set.captureDevice !== expectedDevice || evidence.captureDevice !== expectedDevice) {
      failures.push(`${key}: capture device does not match passed ${provenance.deviceEvidence} device evidence`);
    }
    if (evidence.signedArtifactSha256 !== deviceEntry.artifact?.releaseArtifactSha256) {
      failures.push(`${key}: capture evidence artifact does not match passed ${provenance.deviceEvidence} evidence`);
    }
    const installedAt = Date.parse(deviceEntry.installation?.firstInstallTime ?? "");
    const testedAt = Date.parse(deviceEntry.testedAt ?? "");
    if (Number.isNaN(installedAt) || Number.isNaN(testedAt)
      || Number.isNaN(captureStartedAt) || captureStartedAt < installedAt || captureStartedAt < testedAt) {
      failures.push(`${key}: capture session predates the signed install or completed device test`);
    }
  }
  if (evidence.screenshotDirectory !== provenance.directory
    || JSON.stringify(evidence.screenshotSha256) !== JSON.stringify(actualHashes)) {
    failures.push(`${key}: capture evidence does not match the exact screenshot files`);
  }
  const expectedPointers = EXPECTED_SCREENSHOT_FILES.map((file) => path.join(provenance.directory, file));
  if (JSON.stringify(evidence.evidencePointers) !== JSON.stringify(expectedPointers)) {
    failures.push(`${key}: signed-device capture evidence must point to all five screenshot files`);
  }
}

async function validateRequiredDeviceEvidence({ root, deviceReport, artifactReport, failures, pending }) {
  if (!deviceReport) {
    for (const evidenceKey of REQUIRED_DEVICE_EVIDENCE) pending.push(`deviceEvidence:${evidenceKey}`);
    return;
  }
  if (artifactReport && deviceReport.release?.commit !== artifactReport.git?.commit) {
    failures.push("device-matrix source commit does not match release-artifact evidence");
  }
  for (const evidenceKey of REQUIRED_DEVICE_EVIDENCE) {
    const entry = deviceReport.requiredSignedEvidence?.[evidenceKey];
    if (entry?.status !== "passed") {
      pending.push(`deviceEvidence:${evidenceKey}`);
      continue;
    }
    const artifactKey = DEVICE_EVIDENCE_ARTIFACT[evidenceKey];
    const artifact = entry.artifact ?? {};
    if (artifact.releaseEvidenceKey !== artifactKey) {
      failures.push(`${evidenceKey}: releaseEvidenceKey must equal ${artifactKey}`);
    }
    if (!isSha256(artifact.releaseArtifactSha256)) {
      failures.push(`${evidenceKey}: passed evidence has no release artifact SHA-256`);
    } else if (artifactReport
      && artifactReport.artifacts?.[artifactKey]?.sha256 !== artifact.releaseArtifactSha256) {
      failures.push(`${evidenceKey}: passed artifact SHA-256 does not match release evidence`);
    }
    if (!isCommit(artifact.sourceCommit)) {
      failures.push(`${evidenceKey}: passed evidence has no source commit`);
    } else {
      if (artifact.sourceCommit !== deviceReport.release?.commit) {
        failures.push(`${evidenceKey}: source commit does not match the device-matrix release source`);
      }
      if (artifactReport && artifact.sourceCommit !== artifactReport.git?.commit) {
        failures.push(`${evidenceKey}: source commit does not match release-artifact evidence`);
      }
    }
    if (evidenceKey !== "iphoneIpa") {
      if (!isSha256(artifact.installedArtifactSha256)
        || artifact.installedArtifactSha256 !== artifact.releaseArtifactSha256) {
        failures.push(`${evidenceKey}: installed artifact hash does not match the release artifact`);
      }
    }
    if (!entry.device?.manufacturer || !entry.device?.model || !entry.device?.os) {
      failures.push(`${evidenceKey}: passed evidence requires manufacturer, model and OS`);
    }
    if (!isTimestamp(entry.testedAt)) failures.push(`${evidenceKey}: passed evidence has no valid testedAt`);
    if (typeof entry.installationMode !== "string" || !entry.installationMode.startsWith("clean-install")) {
      failures.push(`${evidenceKey}: passed evidence must come from a clean install`);
    }
    const cases = Object.values(entry.cases ?? {});
    if (!cases.length || cases.some((result) => result !== "passed")) {
      failures.push(`${evidenceKey}: every required device case must be passed`);
    }
    if (!Array.isArray(entry.evidencePointers) || entry.evidencePointers.length === 0) {
      failures.push(`${evidenceKey}: passed evidence requires evidence pointers`);
    } else {
      for (const pointer of entry.evidencePointers) {
        let pointerPath;
        try {
          pointerPath = repositoryPath(root, pointer, `${evidenceKey} evidence pointer`);
        } catch (error) {
          failures.push(error.message);
          continue;
        }
        if (!await fileBufferOrNull(pointerPath)) failures.push(`${evidenceKey}: evidence pointer is missing: ${pointer}`);
      }
    }
  }
}

export async function inspectStorePackage({ root, strict = false }) {
  const manifestPath = path.join(root, "store-assets/package-manifest.json");
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (manifest.schemaVersion !== 2) throw new Error("Unsupported store package manifest schema");
  await validateStoreAssets(path.join(root, "store-assets"));

  const failures = [];
  const pending = [];
  const requiredSections = requiredManifestSectionState(manifest);
  failures.push(...requiredSections.failures);
  pending.push(...requiredSections.pending);
  inspectReleaseDeclaration(manifest.release, failures);
  const artifactReport = await releaseEvidence({ root, manifest, failures, pending });
  const deviceReport = await deviceEvidence({ root, manifest, failures });
  const metadataMarkdown = await readFile(
    repositoryPath(root, manifest.metadata.canonicalDocument, "canonical metadata document"),
    "utf8",
  );
  const metadataLengths = inspectMetadata(metadataMarkdown, failures, pending);
  const screenshots = {};
  for (const key of Object.keys(EXPECTED_SCREENSHOT_PROVENANCE)) {
    const set = manifest.screenshots?.[key];
    if (!set) continue;
    const provenance = EXPECTED_SCREENSHOT_PROVENANCE[key];
    if (set.captureArtifact !== provenance.artifact) {
      failures.push(`${key}: captureArtifact must equal ${provenance.artifact}`);
    }
    if (set.captureMode !== provenance.mode) {
      failures.push(`${key}: captureMode must equal ${provenance.mode}`);
    }
    if (JSON.stringify(set.files) !== JSON.stringify(EXPECTED_SCREENSHOT_FILES)) {
      continue;
    }
    const files = [];
    const actualHashes = {};
    for (const file of set.files) {
      let relativeScreenshot;
      let absoluteScreenshot;
      try {
        relativeScreenshot = path.join(set.directory, file);
        absoluteScreenshot = repositoryPath(root, relativeScreenshot, `${key} screenshot path`);
      } catch (error) {
        failures.push(error.message);
        continue;
      }
      const bytes = await fileBufferOrNull(absoluteScreenshot);
      if (!bytes) {
        pending.push(`${key}:${file}`);
        continue;
      }
      const png = inspectPng(bytes);
      if (png.width !== set.width || png.height !== set.height) {
        failures.push(`${relativeScreenshot}: expected ${set.width}x${set.height}, found ${png.width}x${png.height}`);
      }
      if (set.alpha === "forbidden" && png.hasAlpha) failures.push(`${relativeScreenshot}: alpha/transparency is forbidden`);
      const actualSha256 = sha256(bytes);
      actualHashes[file] = actualSha256;
      if (!isSha256(set.fileSha256?.[file])) {
        if (set.status === "ready") failures.push(`${relativeScreenshot}: ready screenshot has no recorded SHA-256`);
        else pending.push(`${key}:${file}:sha256`);
      } else if (set.fileSha256[file] !== actualSha256) {
        failures.push(`${relativeScreenshot}: screenshot SHA-256 does not match package manifest`);
      }
      files.push({ file, width: png.width, height: png.height, hasAlpha: png.hasAlpha, sha256: actualSha256 });
    }
    if (set.status !== "ready") pending.push(`${key}:status`);
    if (!/^[a-f0-9]{64}$/.test(set.sourceHash ?? "")) {
      pending.push(`${key}:sourceHash`);
    } else if (artifactReport && set.sourceHash !== artifactReport.mobileShell?.sourceHash) {
      failures.push(`${key}: screenshot source hash does not match verified mobile-shell evidence`);
    }
    if (provenance.mode === "simulator-source") {
      if (set.signedArtifactSha256 !== null) {
        failures.push(`${key}: simulator screenshots must not claim a signed device artifact SHA-256`);
      }
      await validateSimulatorCaptureEvidence({
        root,
        key,
        set,
        provenance,
        actualHashes,
        failures,
        pending,
      });
    } else {
      if (!/^[a-f0-9]{64}$/.test(set.signedArtifactSha256 ?? "")) {
        pending.push(`${key}:signedArtifactSha256`);
      } else if (artifactReport) {
        const expectedHash = artifactReport.artifacts?.[set.captureArtifact]?.sha256;
        if (set.signedArtifactSha256 !== expectedHash) {
          failures.push(`${key}: screenshot artifact SHA-256 does not match verified ${set.captureArtifact} evidence`);
        }
      }
      await validateSignedDeviceCaptureEvidence({
        root,
        key,
        set,
        provenance,
        actualHashes,
        artifactReport,
        deviceReport,
        manifest,
        failures,
        pending,
      });
    }
    if (!set.captureDevice) pending.push(`${key}:captureDevice`);
    if (!set.capturedAt || Number.isNaN(Date.parse(set.capturedAt))) pending.push(`${key}:capturedAt`);
    if (set.status === "ready" && provenance.deviceEvidence) {
      const evidenceKey = provenance.deviceEvidence;
      const deviceEntry = deviceReport?.requiredSignedEvidence?.[evidenceKey];
      if (deviceEntry?.status !== "passed") {
        failures.push(`${key}: ready screenshots require passed ${evidenceKey} device evidence`);
      } else {
        const testedHash = deviceEntry.artifact?.releaseArtifactSha256;
        if (set.signedArtifactSha256 !== testedHash) {
          failures.push(`${key}: screenshot artifact SHA-256 does not match passed ${evidenceKey} device evidence`);
        }
        if (deviceEntry.installationMode !== "clean-install") {
          failures.push(`${key}: passed ${evidenceKey} evidence must come from a clean install`);
        }
        if (!isCommit(deviceEntry.artifact?.sourceCommit)) {
          failures.push(`${key}: passed ${evidenceKey} evidence has no source commit`);
        } else if (deviceEntry.artifact.sourceCommit !== deviceReport?.release?.commit) {
          failures.push(`${key}: passed ${evidenceKey} source commit does not match the device-matrix release`);
        }
        if (key === "androidPhone" && deviceEntry.artifact?.installedArtifactSha256 !== testedHash) {
          failures.push(`${key}: installed APK hash does not match passed ${evidenceKey} release artifact`);
        }
      }
    }
    screenshots[key] = files;
  }

  await validateRequiredDeviceEvidence({ root, deviceReport, artifactReport, failures, pending });

  for (const key of REQUIRED_OWNER_INPUTS) {
    if (manifest.ownerInputs?.[key] !== "complete" && !pending.includes(`ownerInputs:${key}`)) {
      pending.push(`ownerInputs:${key}`);
    }
  }

  if (failures.length || (strict && pending.length)) {
    const reasons = [...failures, ...(strict ? pending.map((item) => `pending:${item}`) : [])];
    throw new Error(`Store package is not ready:\n- ${reasons.join("\n- ")}`);
  }
  return {
    ok: true,
    ready: pending.length === 0,
    pending,
    metadataLengths,
    screenshots,
    releaseEvidence: artifactReport ? {
      commit: artifactReport.git.commit,
      sourceHash: artifactReport.mobileShell.sourceHash,
      artifactSha256: Object.fromEntries(ARTIFACT_KEYS.map((key) => [key, artifactReport.artifacts[key].sha256])),
    } : null,
  };
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  const strict = process.argv.slice(2).includes("--strict");
  const unknown = process.argv.slice(2).filter((arg) => arg !== "--strict");
  if (unknown.length) throw new Error("Usage: validate-store-package.mjs [--strict]");
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  process.stdout.write(`${JSON.stringify(await inspectStorePackage({ root, strict }), null, 2)}\n`);
}
