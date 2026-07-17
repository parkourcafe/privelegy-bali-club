#!/usr/bin/env node

import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ID = "com.otherbali.app";
const WEB_DIR = "ios-web";
const API_ORIGIN = "https://www.otherbali.com";

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function requiredFile(file, label) {
  let metadata;
  try {
    metadata = await lstat(file);
  } catch {
    throw new Error(`${label} is missing`);
  }
  if (!metadata.isFile() || metadata.isSymbolicLink() || metadata.size === 0) {
    throw new Error(`${label} must be a non-empty regular file`);
  }
  return readFile(file);
}

async function requiredJson(file, label) {
  const contents = await requiredFile(file, label);
  let value;
  try {
    value = JSON.parse(contents.toString("utf8"));
  } catch {
    throw new Error(`${label} is malformed JSON`);
  }
  if (!isPlainObject(value)) throw new Error(`${label} must contain a JSON object`);
  return { contents, value };
}

function validateManifest(manifest, label) {
  if (manifest.schemaVersion !== 1) throw new Error(`${label} schemaVersion must equal 1`);
  if (manifest.apiOrigin !== API_ORIGIN) throw new Error(`${label} must use the canonical production API origin`);
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    throw new Error(`${label} must list bundled assets`);
  }
  const assets = [];
  for (const asset of manifest.assets) {
    if (
      typeof asset !== "string"
      || !/^\.\/assets\/[A-Za-z0-9._/-]+$/.test(asset)
      || asset.split("/").includes("..")
    ) {
      throw new Error(`${label} contains an unsafe or non-local asset path`);
    }
    assets.push(asset.slice(2));
  }
  if (new Set(assets).size !== assets.length) throw new Error(`${label} contains duplicate assets`);
  if (!Array.isArray(manifest.sourceInputs) || manifest.sourceInputs.length === 0) {
    throw new Error(`${label} is missing its source inputs`);
  }
  if (!manifest.sourceInputs.every((entry) => (
    typeof entry === "string"
    && entry.length > 0
    && !path.isAbsolute(entry)
    && !entry.split(/[\\/]/).includes("..")
  ))) {
    throw new Error(`${label} contains a malformed source input`);
  }
  if (typeof manifest.sourceHash !== "string" || !/^[0-9a-f]{64}$/.test(manifest.sourceHash)) {
    throw new Error(`${label} is missing its source freshness proof`);
  }
  return assets.sort();
}

async function assertCurrentSourceHash(root, manifest, label) {
  const digest = createHash("sha256");
  for (const relative of manifest.sourceInputs) {
    const absolute = path.resolve(root, relative);
    if (absolute !== root && !absolute.startsWith(`${root}${path.sep}`)) {
      throw new Error(`${label} contains a source input outside the repository`);
    }
    const contents = await requiredFile(absolute, `${label} source input ${relative}`);
    digest.update(relative.split(path.sep).join("/"));
    digest.update("\0");
    digest.update(contents);
    digest.update("\0");
  }
  if (digest.digest("hex") !== manifest.sourceHash) {
    throw new Error(`${label} is stale relative to mobile/shared source; run npm run mobile:build`);
  }
}

async function relativeFiles(directory, label, prefix = "") {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    throw new Error(`${label} is missing`);
  }
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`${label} contains a symbolic link: ${relative}`);
    if (entry.isDirectory()) files.push(...await relativeFiles(absolute, label, relative));
    else if (entry.isFile()) files.push(relative);
    else throw new Error(`${label} contains a non-regular entry: ${relative}`);
  }
  return files;
}

async function assertSameFile(canonical, copied, label) {
  const [canonicalContents, copiedContents] = await Promise.all([
    requiredFile(canonical, `canonical ${label}`),
    requiredFile(copied, `copied ${label}`),
  ]);
  if (sha256(canonicalContents) !== sha256(copiedContents)) {
    throw new Error(`copied ${label} is stale relative to canonical ios-web`);
  }
}

export async function inspectAndroidReleaseShell({ root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..") } = {}) {
  const canonicalRoot = path.join(root, WEB_DIR);
  const generatedRoot = path.join(root, "android/app/src/main/assets");
  const copiedRoot = path.join(generatedRoot, "public");

  const { value: config } = await requiredJson(
    path.join(generatedRoot, "capacitor.config.json"),
    "generated Android Capacitor config",
  );
  if (config.appId !== APP_ID) throw new Error("generated Android Capacitor config has an unexpected appId");
  if (config.webDir !== WEB_DIR) throw new Error("generated Android Capacitor config must use ios-web");
  if (Object.hasOwn(config, "server") && !isPlainObject(config.server)) {
    throw new Error("generated Android Capacitor config has a malformed server setting");
  }
  if (isPlainObject(config.server) && Object.hasOwn(config.server, "url")) {
    throw new Error("generated Android Capacitor config contains forbidden server.url");
  }
  if (config.loggingBehavior !== "none") {
    throw new Error("generated Android Capacitor config loggingBehavior must be none for Release");
  }

  const [canonicalManifest, copiedManifest] = await Promise.all([
    requiredJson(path.join(canonicalRoot, "build-manifest.json"), "canonical ios-web build manifest"),
    requiredJson(path.join(copiedRoot, "build-manifest.json"), "copied Android build manifest"),
  ]);
  const canonicalManifestAssets = validateManifest(canonicalManifest.value, "canonical ios-web build manifest");
  const copiedManifestAssets = validateManifest(copiedManifest.value, "copied Android build manifest");
  await assertCurrentSourceHash(root, canonicalManifest.value, "canonical ios-web build manifest");
  if (sha256(canonicalManifest.contents) !== sha256(copiedManifest.contents)) {
    throw new Error("copied Android build manifest is stale relative to canonical ios-web");
  }
  if (canonicalManifestAssets.join("\n") !== copiedManifestAssets.join("\n")) {
    throw new Error("copied Android build manifest asset list differs from canonical ios-web");
  }

  await Promise.all([
    assertSameFile(path.join(canonicalRoot, "index.html"), path.join(copiedRoot, "index.html"), "index.html"),
    assertSameFile(path.join(canonicalRoot, "offline.html"), path.join(copiedRoot, "offline.html"), "offline.html"),
  ]);

  const [canonicalAssetFiles, copiedAssetFiles] = await Promise.all([
    relativeFiles(path.join(canonicalRoot, "assets"), "canonical ios-web assets"),
    relativeFiles(path.join(copiedRoot, "assets"), "copied Android assets"),
  ]);
  if (canonicalAssetFiles.length === 0) throw new Error("canonical ios-web assets are empty");
  if (canonicalAssetFiles.join("\n") !== copiedAssetFiles.join("\n")) {
    throw new Error("copied Android asset set is stale relative to canonical ios-web");
  }

  const canonicalAssetSet = new Set(canonicalAssetFiles.map((entry) => `assets/${entry}`));
  if (
    canonicalManifestAssets.length !== canonicalAssetSet.size
    || canonicalManifestAssets.some((manifestAsset) => !canonicalAssetSet.has(manifestAsset))
  ) {
    throw new Error("canonical ios-web manifest does not exactly describe its bundled assets");
  }
  await Promise.all(canonicalAssetFiles.map((relative) => assertSameFile(
    path.join(canonicalRoot, "assets", relative),
    path.join(copiedRoot, "assets", relative),
    `asset assets/${relative}`,
  )));

  return {
    ok: true,
    appId: config.appId,
    loggingBehavior: config.loggingBehavior,
    assets: canonicalAssetFiles.length,
  };
}

const invokedAsCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsCli) {
  inspectAndroidReleaseShell()
    .then((result) => {
      console.log(`Android Release shell preflight passed (${result.assets} bundled assets).`);
    })
    .catch((error) => {
      console.error(`Android Release shell preflight failed: ${error instanceof Error ? error.message : "unknown error"}`);
      process.exitCode = 1;
    });
}
