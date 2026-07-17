#!/usr/bin/env node

import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import {
  access,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { inspectIosRelease } from "./ios-release-core.mjs";
import {
  RELEASE_CONTRACT,
  assertAndroidMetadata,
  assertIosMetadata,
  assertReleaseCertificate,
  normalizeFingerprint,
  parseAaptBadging,
  parseAaptPermissions,
  parseApksignerOutput,
  parseBundletoolManifest,
  parseCodesignDetails,
  parseJarSignerOutput,
  parseKeytoolCertificate,
} from "./release-artifacts-core.mjs";

const execFileAsync = promisify(execFile);
const DEFAULTS = {
  ipa: "artifacts/release/ios/OtherBali.ipa",
  aab: "android/app/build/outputs/bundle/playRelease/app-play-release.aab",
  apk: "android/app/build/outputs/apk/rustore/release/app-rustore-release.apk",
  outputDir: "artifacts/release/evidence",
};
const MAX_COMMAND_BUFFER = 32 * 1024 * 1024;

function fail(message) {
  throw new Error(message);
}

function parseArgs(argv) {
  const options = { ...DEFAULTS };
  const names = new Map([
    ["--ipa", "ipa"],
    ["--aab", "aab"],
    ["--apk", "apk"],
    ["--output-dir", "outputDir"],
  ]);
  for (let index = 0; index < argv.length; index += 1) {
    const key = names.get(argv[index]);
    if (!key || !argv[index + 1] || argv[index + 1].startsWith("--")) {
      fail("Usage: verify-release-artifacts.mjs [--ipa FILE] [--aab FILE] [--apk FILE] [--output-dir DIR]");
    }
    options[key] = argv[index + 1];
    index += 1;
  }
  return options;
}

async function command(command, args, label, options = {}) {
  try {
    const result = await execFileAsync(command, args, {
      cwd: options.cwd,
      env: options.env ?? { ...process.env, LANG: "C", LC_ALL: "C" },
      maxBuffer: MAX_COMMAND_BUFFER,
      encoding: "utf8",
    });
    return {
      stdout: result.stdout ?? "",
      stderr: result.stderr ?? "",
      combined: `${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    };
  } catch (error) {
    const details = [error?.stdout, error?.stderr].filter(Boolean).join("\n").trim();
    fail(`${label} failed${details ? `: ${details.slice(0, 1600)}` : ""}`);
  }
}

async function regularArtifact(file, extension, label) {
  let metadata;
  try {
    metadata = await lstat(file);
  } catch {
    fail(`${label} is missing: ${file}`);
  }
  if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size === 0) {
    fail(`${label} must be a non-empty regular file`);
  }
  if (path.extname(file).toLowerCase() !== extension) fail(`${label} must have the ${extension} extension`);
  return metadata;
}

async function sha256File(file) {
  const digest = createHash("sha256");
  digest.update(await readFile(file));
  return digest.digest("hex");
}

async function gitEvidence(root) {
  const [{ stdout: commitOutput }, { stdout: treeOutput }, { stdout: statusOutput }] = await Promise.all([
    command("git", ["rev-parse", "HEAD"], "git commit lookup", { cwd: root }),
    command("git", ["rev-parse", "HEAD^{tree}"], "git tree lookup", { cwd: root }),
    command("git", ["status", "--porcelain=v1", "--untracked-files=all"], "git cleanliness check", { cwd: root }),
  ]);
  const commit = commitOutput.trim();
  const tree = treeOutput.trim();
  if (!/^[0-9a-f]{40}$/.test(commit) || !/^[0-9a-f]{40}$/.test(tree)) fail("git identity evidence is malformed");
  if (statusOutput.trim()) fail("tracked files are dirty; commit the exact release source before verifying artifacts");
  return { commit, tree, clean: true };
}

async function canonicalShellEvidence(root) {
  const manifestPath = path.join(root, "ios-web/build-manifest.json");
  const manifestText = await readFile(manifestPath, "utf8").catch(() => fail("canonical ios-web build manifest is missing"));
  let manifest;
  try {
    manifest = JSON.parse(manifestText);
  } catch {
    fail("canonical ios-web build manifest is malformed");
  }
  if (manifest.schemaVersion !== 1 || !/^[0-9a-f]{64}$/.test(manifest.sourceHash ?? "")) {
    fail("canonical ios-web build manifest lacks a valid sourceHash");
  }
  if (!Array.isArray(manifest.sourceInputs) || !manifest.sourceInputs.length) {
    fail("canonical ios-web build manifest lacks sourceInputs");
  }
  const sourceDigest = createHash("sha256");
  for (const relative of manifest.sourceInputs) {
    if (typeof relative !== "string" || !relative || path.isAbsolute(relative) || relative.split(/[\\/]/).includes("..")) {
      fail("canonical ios-web build manifest has an unsafe source input");
    }
    const contents = await readFile(path.join(root, relative)).catch(() => fail(`mobile shell source input is missing: ${relative}`));
    sourceDigest.update(relative.split(path.sep).join("/"));
    sourceDigest.update("\0");
    sourceDigest.update(contents);
    sourceDigest.update("\0");
  }
  if (sourceDigest.digest("hex") !== manifest.sourceHash) {
    fail("canonical ios-web is stale relative to its sourceInputs; run npm run mobile:build");
  }
  if (!Array.isArray(manifest.assets) || !manifest.assets.length) fail("canonical ios-web manifest has no assets");
  const files = ["index.html", "offline.html", "build-manifest.json"];
  for (const asset of manifest.assets) {
    if (typeof asset !== "string" || !/^\.\/assets\/[A-Za-z0-9._/-]+$/.test(asset) || asset.includes("..")) {
      fail("canonical ios-web manifest contains an unsafe asset path");
    }
    files.push(asset.slice(2));
  }
  const canonicalFiles = new Map();
  for (const relative of files) {
    const contents = await readFile(path.join(root, "ios-web", relative))
      .catch(() => fail(`canonical ios-web file is missing: ${relative}`));
    if (!contents.length) fail(`canonical ios-web file is empty: ${relative}`);
    canonicalFiles.set(relative, contents);
  }
  return { manifest, manifestText, canonicalFiles };
}

function validateZipEntries(output, label) {
  const entries = output.split(/\r?\n/).filter(Boolean);
  if (!entries.length) fail(`${label} is an empty archive`);
  if (new Set(entries).size !== entries.length) fail(`${label} contains duplicate ZIP entries`);
  for (const entry of entries) {
    if (entry.includes("\\") || entry.includes("\0") || entry.startsWith("/")
      || entry.split("/").includes("..")) {
      fail(`${label} contains an unsafe ZIP entry`);
    }
  }
  return entries;
}

async function zipEntries(file, label) {
  const result = await command("/usr/bin/unzip", ["-Z1", file], `${label} ZIP inventory`);
  return validateZipEntries(result.stdout, label);
}

async function assertNoSymlinks(directory, label) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`${label} contains a symbolic link`);
    if (entry.isDirectory()) await assertNoSymlinks(target, label);
  }
}

async function zipFileBytes(file, entry, label) {
  // execFile's default UTF-8 decoding is inappropriate for arbitrary assets.
  try {
    const { stdout } = await execFileAsync("/usr/bin/unzip", ["-p", file, entry], {
      encoding: "buffer",
      maxBuffer: MAX_COMMAND_BUFFER,
    });
    return stdout;
  } catch {
    fail(`${label} extraction failed`);
  }
}

async function verifyArchivedShell({ archive, prefix, entries, shell, label }) {
  const normalizedPrefix = prefix.endsWith("/") ? prefix : `${prefix}/`;
  for (const [relative, canonicalContents] of shell.canonicalFiles) {
    const entry = `${normalizedPrefix}${relative}`;
    if (!entries.includes(entry)) fail(`${label} is missing bundled shell file ${relative}`);
    const packagedContents = await zipFileBytes(archive, entry, `${label} ${relative}`);
    if (!packagedContents.equals(canonicalContents)) fail(`${label} has a stale bundled shell file ${relative}`);
  }
  const expectedAssetEntries = [...shell.canonicalFiles.keys()]
    .filter((relative) => relative.startsWith("assets/"))
    .map((relative) => `${normalizedPrefix}${relative}`)
    .sort();
  const packagedAssetEntries = entries
    .filter((entry) => entry.startsWith(`${normalizedPrefix}assets/`) && !entry.endsWith("/"))
    .sort();
  if (JSON.stringify(packagedAssetEntries) !== JSON.stringify(expectedAssetEntries)) {
    fail(`${label} bundled asset inventory differs from canonical ios-web`);
  }
  return { sourceHash: shell.manifest.sourceHash, assets: expectedAssetEntries.length };
}

async function verifyEmbeddedAndroidConfig(archive, entry, entries, label) {
  if (!entries.includes(entry)) fail(`${label} is missing embedded Capacitor config`);
  let config;
  try {
    config = JSON.parse((await zipFileBytes(archive, entry, `${label} Capacitor config`)).toString("utf8"));
  } catch {
    fail(`${label} embedded Capacitor config is malformed`);
  }
  if (config.appId !== RELEASE_CONTRACT.appId || config.webDir !== "ios-web") {
    fail(`${label} embedded Capacitor identity is incorrect`);
  }
  if (config.loggingBehavior !== "none") fail(`${label} embedded logging must be disabled`);
  if (typeof config.server?.url === "string" && config.server.url.trim()) {
    fail(`${label} embeds a forbidden remote server.url`);
  }
}

async function plistJson(source, temporaryDirectory, name, label) {
  const input = path.join(temporaryDirectory, `${name}.plist`);
  await writeFile(input, source, { mode: 0o600 });
  const { stdout } = await command("/usr/bin/plutil", ["-convert", "json", "-o", "-", input], label);
  try {
    return JSON.parse(stdout);
  } catch {
    fail(`${label} produced malformed JSON`);
  }
}

function plistPayload(output, label) {
  const start = output.indexOf("<?xml");
  const end = output.lastIndexOf("</plist>");
  if (start < 0 || end < 0) fail(`${label} did not emit a plist`);
  return output.slice(start, end + "</plist>".length);
}

async function verifyIpa({ root, file, metadata, shell, temporaryDirectory }) {
  if (process.platform !== "darwin") fail("IPA verification requires macOS codesign/security/plutil evidence");
  const entries = await zipEntries(file, "IPA");
  const appInfoEntries = entries.filter((entry) => /^Payload\/[^/]+\.app\/Info\.plist$/.test(entry));
  if (appInfoEntries.length !== 1) fail("IPA must contain exactly one Payload app bundle");
  const appRelative = appInfoEntries[0].slice(0, -"/Info.plist".length);
  const extractionRoot = path.join(temporaryDirectory, "ipa");
  await mkdir(extractionRoot, { recursive: true });
  await command("/usr/bin/ditto", ["-x", "-k", file, extractionRoot], "IPA extraction");
  await assertNoSymlinks(extractionRoot, "IPA payload");
  const appPath = path.join(extractionRoot, appRelative);
  const appMetadata = await stat(appPath).catch(() => fail("extracted IPA app is missing"));
  if (!appMetadata.isDirectory()) fail("extracted IPA payload is not an app directory");

  await command("/usr/bin/codesign", ["--verify", "--deep", "--strict", "--verbose=2", appPath], "IPA code signature verification");
  const detailsResult = await command("/usr/bin/codesign", ["-d", "--verbose=4", appPath], "IPA code signature inspection");
  const codesign = parseCodesignDetails(detailsResult.combined);
  const entitlementsResult = await command(
    "/usr/bin/codesign",
    ["-d", "--entitlements", ":-", appPath],
    "IPA entitlement extraction",
  );
  const entitlements = await plistJson(
    plistPayload(entitlementsResult.combined, "IPA entitlement extraction"),
    temporaryDirectory,
    "ipa-entitlements",
    "IPA entitlement decoding",
  );
  const info = await plistJson(
    await readFile(path.join(appPath, "Info.plist")),
    temporaryDirectory,
    "ipa-info",
    "IPA Info.plist decoding",
  );
  const profilePath = path.join(appPath, "embedded.mobileprovision");
  await access(profilePath).catch(() => fail("IPA embedded.mobileprovision is missing"));
  const profileResult = await command(
    "/usr/bin/security",
    ["cms", "-D", "-i", profilePath],
    "IPA provisioning profile verification",
  );
  const profile = await plistJson(
    plistPayload(profileResult.combined, "IPA provisioning profile verification"),
    temporaryDirectory,
    "ipa-profile",
    "IPA provisioning profile decoding",
  );
  assertIosMetadata({ info, entitlements, profile, codesign });

  const appInspection = await inspectIosRelease({ root, appPath });
  if (!appInspection.ok) fail(`IPA app-content verification failed: ${appInspection.failures.join("; ")}`);
  const shellEvidence = await verifyArchivedShell({
    archive: file,
    prefix: `${appRelative}/public`,
    entries,
    shell,
    label: "IPA",
  });
  return {
    ...metadata,
    identity: {
      bundleId: info.CFBundleIdentifier,
      version: String(info.CFBundleShortVersionString),
      build: String(info.CFBundleVersion),
      minimumOs: String(info.MinimumOSVersion),
      sdk: info.DTSDKName,
      deviceFamily: info.UIDeviceFamily,
    },
    signing: {
      authority: codesign.authorities.find((authority) => /^Apple Distribution(?::|$)/.test(authority)),
      teamId: codesign.teamIdentifier,
      profileUuid: profile.UUID,
      profileName: profile.Name,
      profileExpiration: profile.ExpirationDate,
      getTaskAllow: entitlements["get-task-allow"],
      associatedDomains: entitlements["com.apple.developer.associated-domains"],
    },
    privacyManifest: appInspection.privacyEvidence.builtApp?.appManifest ?? null,
    shell: shellEvidence,
  };
}

async function verifyAab({ file, metadata, shell, bundletoolJar, playFingerprint, javaRuntime }) {
  const entries = await zipEntries(file, "Play AAB");
  const jarResult = await command(
    javaRuntime.jarsigner,
    ["-verify", "-verbose", "-certs", file],
    "AAB JAR signature verification",
    { env: javaRuntime.env },
  );
  const jarEvidence = parseJarSignerOutput(jarResult.combined);
  if (!jarEvidence.verified || jarEvidence.hasUnsignedEntries || jarEvidence.hasSignatureErrors) {
    fail("AAB JAR signature evidence is incomplete or invalid");
  }
  const certificateResult = await command(
    javaRuntime.keytool,
    ["-printcert", "-jarfile", file],
    "AAB signer certificate inspection",
    { env: javaRuntime.env },
  );
  const certificate = parseKeytoolCertificate(certificateResult.combined);
  assertReleaseCertificate({
    fingerprint: certificate.fingerprint,
    subject: certificate.owner,
    expectedFingerprint: playFingerprint,
    label: "Google Play upload AAB",
  });
  const manifestResult = await command(
    javaRuntime.java,
    ["-jar", bundletoolJar, "dump", "manifest", `--bundle=${file}`, "--module=base"],
    "bundletool AAB manifest inspection",
    { env: javaRuntime.env },
  );
  const manifest = parseBundletoolManifest(manifestResult.stdout);
  assertAndroidMetadata(manifest, "Play AAB");
  await verifyEmbeddedAndroidConfig(file, "base/assets/capacitor.config.json", entries, "Play AAB");
  const shellEvidence = await verifyArchivedShell({
    archive: file,
    prefix: "base/assets/public",
    entries,
    shell,
    label: "Play AAB",
  });
  return {
    ...metadata,
    identity: manifest,
    signing: {
      scheme: "JAR",
      certificateSha256: normalizeFingerprint(certificate.fingerprint),
      subject: certificate.owner,
    },
    shell: shellEvidence,
  };
}

async function executable(file, label) {
  try {
    await access(file);
  } catch {
    fail(`${label} is missing: ${file}`);
  }
  return file;
}

function versionParts(value) {
  return value.split(/[.-]/).map((part) => (/^\d+$/.test(part) ? Number(part) : part));
}

function compareVersions(left, right) {
  const a = versionParts(left);
  const b = versionParts(right);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const av = a[index] ?? 0;
    const bv = b[index] ?? 0;
    if (typeof av === "number" && typeof bv === "number" && av !== bv) return av - bv;
    if (String(av) !== String(bv)) return String(av).localeCompare(String(bv));
  }
  return 0;
}

async function androidTool(name, environmentName) {
  if (process.env[environmentName]) return executable(path.resolve(process.env[environmentName]), environmentName);
  const sdkRoot = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME;
  if (!sdkRoot) fail(`${environmentName} or ANDROID_SDK_ROOT/ANDROID_HOME is required`);
  const buildToolsRoot = path.join(sdkRoot, "build-tools");
  let versions;
  try {
    versions = await readdir(buildToolsRoot, { withFileTypes: true });
  } catch {
    fail(`Android build-tools are missing under ${buildToolsRoot}`);
  }
  for (const entry of versions.filter((candidate) => candidate.isDirectory())
    .sort((left, right) => compareVersions(right.name, left.name))) {
    const candidate = path.join(buildToolsRoot, entry.name, name);
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next installed build-tools version.
    }
  }
  fail(`${name} is missing from installed Android build-tools`);
}

async function resolveJavaRuntime() {
  const homes = [
    process.env.JAVA_HOME,
    process.platform === "darwin"
      ? "/Applications/Android Studio.app/Contents/jbr/Contents/Home"
      : null,
  ].filter(Boolean);
  for (const home of homes) {
    const tools = {
      java: path.join(home, "bin/java"),
      jarsigner: path.join(home, "bin/jarsigner"),
      keytool: path.join(home, "bin/keytool"),
    };
    try {
      await Promise.all(Object.values(tools).map((tool) => access(tool)));
      return {
        ...tools,
        env: { ...process.env, JAVA_HOME: home, LANG: "C", LC_ALL: "C" },
      };
    } catch {
      // Continue to the next complete JDK candidate.
    }
  }
  fail("A complete JDK (java, jarsigner, keytool) is required; set JAVA_HOME");
}

async function verifyApk({ file, metadata, shell, apksigner, aapt2, rustoreFingerprint, javaRuntime }) {
  const entries = await zipEntries(file, "RuStore APK");
  const signatureResult = await command(
    apksigner,
    ["verify", "--verbose", "--print-certs", file],
    "APK signature verification",
    { env: javaRuntime.env },
  );
  const signature = parseApksignerOutput(signatureResult.combined);
  if (signature.fingerprints.length !== 1 || signature.subjects.length !== 1 || signature.v2 !== true) {
    fail("RuStore APK must have exactly one non-debug signer and a valid APK Signature Scheme v2 signature");
  }
  assertReleaseCertificate({
    fingerprint: signature.fingerprints[0],
    subject: signature.subjects[0],
    expectedFingerprint: rustoreFingerprint,
    label: "RuStore APK",
  });
  const [badgingResult, permissionsResult] = await Promise.all([
    command(aapt2, ["dump", "badging", file], "aapt2 APK badging inspection"),
    command(aapt2, ["dump", "permissions", file], "aapt2 APK permissions inspection"),
  ]);
  const badging = parseAaptBadging(badgingResult.stdout);
  const permissions = parseAaptPermissions(permissionsResult.stdout);
  assertAndroidMetadata(badging, "RuStore APK");
  if (JSON.stringify(permissions.uses) !== JSON.stringify(badging.permissions)) {
    fail("RuStore APK aapt2 permission reports disagree");
  }
  await verifyEmbeddedAndroidConfig(file, "assets/capacitor.config.json", entries, "RuStore APK");
  const shellEvidence = await verifyArchivedShell({
    archive: file,
    prefix: "assets/public",
    entries,
    shell,
    label: "RuStore APK",
  });
  return {
    ...metadata,
    identity: { ...badging, declaredPermissions: permissions.declared },
    signing: {
      schemes: { v1: signature.v1, v2: signature.v2, v3: signature.v3 },
      certificateSha256: signature.fingerprints[0],
      subject: signature.subjects[0],
    },
    shell: shellEvidence,
  };
}

async function artifactMetadata(file, root, git, shell) {
  const metadata = await stat(file);
  return {
    path: path.relative(root, file),
    fileName: path.basename(file),
    bytes: metadata.size,
    sha256: await sha256File(file),
    gitCommit: git.commit,
    sourceHash: shell.manifest.sourceHash,
  };
}

async function writeEvidence(outputDirectory, report) {
  await mkdir(outputDirectory, { recursive: true });
  const reportPath = path.join(outputDirectory, "release-artifacts.json");
  const sumsPath = path.join(outputDirectory, "SHA256SUMS");
  await Promise.all([rm(reportPath, { force: true }), rm(sumsPath, { force: true })]);
  const suffix = `${process.pid}-${Date.now()}`;
  const reportTemporary = `${reportPath}.${suffix}.tmp`;
  const sumsTemporary = `${sumsPath}.${suffix}.tmp`;
  const artifacts = [report.artifacts.ios, report.artifacts.googlePlay, report.artifacts.ruStore];
  const sums = artifacts.map((artifact) => `${artifact.sha256}  ${artifact.fileName}`).join("\n");
  await Promise.all([
    writeFile(reportTemporary, `${JSON.stringify(report, null, 2)}\n`, { mode: 0o644 }),
    writeFile(sumsTemporary, `${sums}\n`, { mode: 0o644 }),
  ]);
  await Promise.all([rename(reportTemporary, reportPath), rename(sumsTemporary, sumsPath)]);
  return { reportPath, sumsPath };
}

async function main() {
  const root = process.cwd();
  const options = parseArgs(process.argv.slice(2));
  const paths = {
    ipa: path.resolve(root, options.ipa),
    aab: path.resolve(root, options.aab),
    apk: path.resolve(root, options.apk),
    outputDirectory: path.resolve(root, options.outputDir),
  };
  if (paths.outputDirectory !== root && !paths.outputDirectory.startsWith(`${root}${path.sep}`)) {
    fail("release evidence output directory must stay inside the repository");
  }
  await mkdir(paths.outputDirectory, { recursive: true });
  const outputMetadata = await lstat(paths.outputDirectory);
  if (!outputMetadata.isDirectory() || outputMetadata.isSymbolicLink()) {
    fail("release evidence output must be a real directory, not a symbolic link");
  }
  await Promise.all([
    rm(path.join(paths.outputDirectory, "release-artifacts.json"), { force: true }),
    rm(path.join(paths.outputDirectory, "SHA256SUMS"), { force: true }),
  ]);
  await Promise.all([
    regularArtifact(paths.ipa, ".ipa", "final IPA"),
    regularArtifact(paths.aab, ".aab", "final Play AAB"),
    regularArtifact(paths.apk, ".apk", "final RuStore APK"),
  ]);
  const bundletoolJar = path.resolve(process.env.BUNDLETOOL_JAR ?? "");
  if (!process.env.BUNDLETOOL_JAR) fail("BUNDLETOOL_JAR is required for authoritative AAB inspection");
  await regularArtifact(bundletoolJar, ".jar", "bundletool");
  const playFingerprint = normalizeFingerprint(
    process.env.OTHER_BALI_PLAY_UPLOAD_CERT_SHA256 ?? "",
    "OTHER_BALI_PLAY_UPLOAD_CERT_SHA256",
  );
  const rustoreFingerprint = normalizeFingerprint(
    process.env.OTHER_BALI_RUSTORE_APP_SIGNING_SHA256 ?? "",
    "OTHER_BALI_RUSTORE_APP_SIGNING_SHA256",
  );
  const [apksigner, aapt2, javaRuntime, git, shell] = await Promise.all([
    androidTool("apksigner", "APKSIGNER"),
    androidTool("aapt2", "AAPT2"),
    resolveJavaRuntime(),
    gitEvidence(root),
    canonicalShellEvidence(root),
  ]);
  const temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "other-bali-release-verification-"));
  try {
    const [ipaMetadata, aabMetadata, apkMetadata] = await Promise.all([
      artifactMetadata(paths.ipa, root, git, shell),
      artifactMetadata(paths.aab, root, git, shell),
      artifactMetadata(paths.apk, root, git, shell),
    ]);
    // Verification is intentionally sequential: its error identifies the first
    // invalid store artifact without interleaving output from platform tools.
    const ios = await verifyIpa({ root, file: paths.ipa, metadata: ipaMetadata, shell, temporaryDirectory });
    const googlePlay = await verifyAab({
      file: paths.aab,
      metadata: aabMetadata,
      shell,
      bundletoolJar,
      playFingerprint,
      javaRuntime,
    });
    const ruStore = await verifyApk({
      file: paths.apk,
      metadata: apkMetadata,
      shell,
      apksigner,
      aapt2,
      rustoreFingerprint,
      javaRuntime,
    });
    const report = {
      schemaVersion: 1,
      verifiedAt: new Date().toISOString(),
      verdict: "verified-release-artifacts",
      releaseContract: RELEASE_CONTRACT,
      git,
      mobileShell: {
        schemaVersion: shell.manifest.schemaVersion,
        sourceHash: shell.manifest.sourceHash,
        sourceInputs: shell.manifest.sourceInputs,
      },
      artifacts: { ios, googlePlay, ruStore },
    };
    const evidence = await writeEvidence(paths.outputDirectory, report);
    console.log(`All three signed release artifacts passed.\n${evidence.reportPath}\n${evidence.sumsPath}`);
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(`Release artifact verification failed: ${error instanceof Error ? error.message : "unknown error"}`);
  process.exitCode = 1;
});
