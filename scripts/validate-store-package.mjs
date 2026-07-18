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
const EXPECTED_CAPTURE_ARTIFACT = Object.freeze({ iphone69: "ios", androidPhone: "ruStore" });
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
  const expectedScreenshotKeys = Object.keys(EXPECTED_CAPTURE_ARTIFACT).sort();
  if (JSON.stringify(screenshotKeys) !== JSON.stringify(expectedScreenshotKeys)) {
    failures.push(`package manifest must contain exactly these screenshot sets: ${expectedScreenshotKeys.join(", ")}`);
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
  const metadataMarkdown = await readFile(
    repositoryPath(root, manifest.metadata.canonicalDocument, "canonical metadata document"),
    "utf8",
  );
  const metadataLengths = inspectMetadata(metadataMarkdown, failures, pending);
  const screenshots = {};
  for (const key of Object.keys(EXPECTED_CAPTURE_ARTIFACT)) {
    const set = manifest.screenshots?.[key];
    if (!set) continue;
    if (set.captureArtifact !== EXPECTED_CAPTURE_ARTIFACT[key]) {
      failures.push(`${key}: captureArtifact must equal ${EXPECTED_CAPTURE_ARTIFACT[key] ?? "a known signed artifact"}`);
    }
    if (JSON.stringify(set.files) !== JSON.stringify(EXPECTED_SCREENSHOT_FILES)) {
      failures.push(`${key}: the five canonical screenshot names are required in order`);
      continue;
    }
    const files = [];
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
      files.push({ file, width: png.width, height: png.height, hasAlpha: png.hasAlpha, sha256: sha256(bytes) });
    }
    if (set.status !== "ready") pending.push(`${key}:status`);
    if (!/^[a-f0-9]{64}$/.test(set.signedArtifactSha256 ?? "")) {
      pending.push(`${key}:signedArtifactSha256`);
    } else if (artifactReport) {
      const expectedHash = artifactReport.artifacts?.[set.captureArtifact]?.sha256;
      if (set.signedArtifactSha256 !== expectedHash) {
        failures.push(`${key}: screenshot artifact SHA-256 does not match verified ${set.captureArtifact} evidence`);
      }
    }
    if (!set.captureDevice) pending.push(`${key}:captureDevice`);
    if (!set.capturedAt || Number.isNaN(Date.parse(set.capturedAt))) pending.push(`${key}:capturedAt`);
    screenshots[key] = files;
  }

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
