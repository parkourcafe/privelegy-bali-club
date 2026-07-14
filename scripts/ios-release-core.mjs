import { access, readFile, readdir, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { inspectNativeReadiness } from "./ios-native-readiness-core.mjs";

const BUNDLE_ID = "com.otherbali.app";
const CANONICAL_ORIGIN = "https://www.otherbali.com";
const execFileAsync = promisify(execFile);

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function nonEmptyFile(file) {
  try {
    const metadata = await stat(file);
    return metadata.isFile() && metadata.size > 0;
  } catch {
    return false;
  }
}

async function sha256File(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

async function mobileSourceHash(root, inputs) {
  if (!Array.isArray(inputs) || inputs.length === 0) return null;
  const digest = createHash("sha256");
  for (const relative of inputs) {
    if (typeof relative !== "string" || !relative || path.isAbsolute(relative)) return null;
    const target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(`${root}${path.sep}`)) return null;
    if (!(await nonEmptyFile(target))) return null;
    digest.update(relative.split(path.sep).join("/"));
    digest.update("\0");
    digest.update(await readFile(target));
    digest.update("\0");
  }
  return digest.digest("hex");
}

async function json(file, failures, label) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    failures.push(`${label} is missing or invalid JSON`);
    return null;
  }
}

async function textFiles(directory) {
  if (!(await exists(directory))) return [];
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await textFiles(target));
    else if (/\.(?:html|js|css|json|txt|xml|plist)$/i.test(entry.name)) files.push(target);
  }
  return files;
}

async function bundleEvidence(directory, root = directory) {
  if (!(await exists(directory))) return { manifests: [], frameworks: [] };
  const manifests = [];
  const frameworks = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.endsWith(".framework")) frameworks.push(path.relative(root, target));
      const nested = await bundleEvidence(target, root);
      manifests.push(...nested.manifests);
      frameworks.push(...nested.frameworks);
    } else if (entry.name.endsWith(".xcprivacy")) {
      const metadata = await stat(target);
      manifests.push({ path: path.relative(root, target), bytes: metadata.size });
    }
  }
  return {
    manifests: manifests.sort((left, right) => left.path.localeCompare(right.path)),
    frameworks: [...new Set(frameworks)].sort(),
  };
}

async function privacyManifestEvidence(file, relativePath) {
  if (!(await nonEmptyFile(file))) return null;
  const contents = await readFile(file, "utf8");
  const metadata = await stat(file);
  const requiredKeys = [
    "NSPrivacyTracking",
    "NSPrivacyTrackingDomains",
    "NSPrivacyCollectedDataTypes",
    "NSPrivacyAccessedAPITypes",
  ];
  const missingKeys = requiredKeys.filter((key) => !contents.includes(`<key>${key}</key>`));
  const emptyDeclarations = [
    "NSPrivacyTrackingDomains",
    "NSPrivacyCollectedDataTypes",
    "NSPrivacyAccessedAPITypes",
  ].every((key) => new RegExp(`<key>${key}</key>\\s*<array\\s*/>`).test(contents));
  const userDefaultsReasonCA921 = contents.includes("NSPrivacyAccessedAPICategoryUserDefaults")
    && /<string>CA92\.1<\/string>/.test(contents);
  return {
    path: relativePath,
    bytes: metadata.size,
    missingKeys,
    userDefaultsReasonCA921,
    status: missingKeys.length
      ? "invalid"
      : emptyDeclarations
        ? "provisional-empty-declarations"
        : "declared-values-require-review",
  };
}

async function inspectPrivacyEvidence(root, appPath, failures) {
  const sourcePath = path.join(root, "ios/App/App/PrivacyInfo.xcprivacy");
  const sourceManifest = await privacyManifestEvidence(sourcePath, "ios/App/App/PrivacyInfo.xcprivacy");
  if (sourceManifest?.missingKeys.length) failures.push("PrivacyInfo.xcprivacy is missing required top-level privacy keys");
  const packageJson = await json(path.join(root, "package.json"), failures, "package.json");
  const usesPreferences = Boolean(packageJson?.dependencies?.["@capacitor/preferences"]);
  if (usesPreferences && !sourceManifest?.userDefaultsReasonCA921) {
    failures.push("PrivacyInfo.xcprivacy must declare UserDefaults reason CA92.1 for @capacitor/preferences");
  }

  let builtApp = null;
  if (appPath && await exists(appPath)) {
    const bundle = await bundleEvidence(appPath);
    const appManifest = await privacyManifestEvidence(
      path.join(appPath, "PrivacyInfo.xcprivacy"),
      "PrivacyInfo.xcprivacy",
    );
    if (usesPreferences && !appManifest?.userDefaultsReasonCA921) {
      failures.push("built app privacy manifest is missing UserDefaults reason CA92.1");
    }
    const executable = path.join(appPath, "App");
    let linkedLibraries = [];
    if (!(await nonEmptyFile(executable))) {
      failures.push("built app executable is missing for dependency privacy scan");
    } else {
      try {
        const { stdout } = await execFileAsync("/usr/bin/otool", ["-L", executable], { maxBuffer: 2_000_000 });
        linkedLibraries = stdout.split("\n").slice(1).map((line) => line.trim()).filter(Boolean);
      } catch {
        failures.push("could not scan linked iOS binary dependencies with otool");
      }
    }
    builtApp = {
      appManifest,
      embeddedManifests: bundle.manifests,
      embeddedFrameworks: bundle.frameworks,
      linkedLibraries,
    };
  }

  return {
    sourceManifest,
    builtApp,
    limitation: "The declared Preferences/UserDefaults reason and empty tracking/data arrays remain provisional until the built binary, linked dependencies, SDK manifests, App Store privacy report, and real-device behavior are reviewed.",
  };
}

function validateCapacitorConfig(config, failures, label) {
  if (!config || typeof config !== "object") return;
  if (config.appId !== BUNDLE_ID) failures.push(`${label} has unexpected appId`);
  if (config.webDir !== "ios-web") failures.push(`${label} must use ios-web`);
  if (typeof config.server?.url === "string" && config.server.url.trim()) {
    failures.push(`${label} contains server.url`);
  }
  if (config.loggingBehavior !== "none") {
    failures.push(`${label} loggingBehavior must be none for Release`);
  }
}

async function inspectLocalShell(root, failures) {
  const shell = path.join(root, "ios-web");
  const indexPath = path.join(shell, "index.html");
  const manifestPath = path.join(shell, "build-manifest.json");
  if (!(await nonEmptyFile(indexPath))) failures.push("ios-web/index.html is missing or empty");
  if (!(await nonEmptyFile(path.join(shell, "offline.html")))) failures.push("ios-web/offline.html is missing or empty");

  const manifest = await json(manifestPath, failures, "ios-web build manifest");
  if (manifest) {
    if (manifest.schemaVersion !== 1) failures.push("mobile shell manifest schemaVersion must equal 1");
    if (manifest.apiOrigin !== CANONICAL_ORIGIN) failures.push("mobile shell API origin is not canonical");
    if (!Array.isArray(manifest.assets) || manifest.assets.length < 2) {
      failures.push("mobile shell manifest must list bundled JavaScript and CSS assets");
    } else {
      for (const asset of manifest.assets) {
        if (typeof asset !== "string" || !asset.startsWith("./assets/")) {
          failures.push("mobile shell manifest contains a non-local asset");
          continue;
        }
        if (!(await nonEmptyFile(path.join(shell, asset.slice(2))))) {
          failures.push(`mobile shell asset is missing: ${asset}`);
        }
      }
    }
    if (!Array.isArray(manifest.sourceInputs) || !/^[0-9a-f]{64}$/.test(manifest.sourceHash ?? "")) {
      failures.push("mobile shell manifest is missing its source freshness proof");
    } else {
      const currentSourceHash = await mobileSourceHash(root, manifest.sourceInputs);
      if (!currentSourceHash || currentSourceHash !== manifest.sourceHash) {
        failures.push("ios-web is stale relative to mobile/shared source; run npm run mobile:build");
      }
    }
  }

  if (await nonEmptyFile(indexPath)) {
    const index = await readFile(indexPath, "utf8");
    if (!index.includes('id="root"')) failures.push("mobile shell index is missing its local root");
    if (/window\.location\.(?:replace|assign)|<iframe\b/i.test(index)) {
      failures.push("mobile shell index redirects to or embeds remote UI");
    }
    if (/(?:src|href)=["']https?:\/\//i.test(index)) {
      failures.push("mobile shell index loads a remote script or stylesheet");
    }
  }

  const forbidden = [
    { pattern: /https?:\/\/[^"'\s]*\.vercel\.app/i, label: "preview Vercel URL" },
    { pattern: /https?:\/\/(?:localhost|127\.0\.0\.1)(?=[:/"'\s]|$)/i, label: "development host URL" },
    { pattern: /\b(?:SUPABASE_SERVICE_ROLE_KEY|service_role)\b/i, label: "service-role marker" },
  ];
  for (const file of await textFiles(shell)) {
    const contents = await readFile(file, "utf8");
    for (const rule of forbidden) {
      if (rule.pattern.test(contents)) {
        failures.push(`${path.relative(root, file)} contains a ${rule.label}`);
      }
    }
  }
}

async function inspectXcodeProject(root, failures) {
  const projectPath = path.join(root, "ios/App/App.xcodeproj/project.pbxproj");
  const infoPath = path.join(root, "ios/App/App/Info.plist");
  const privacyPath = path.join(root, "ios/App/App/PrivacyInfo.xcprivacy");
  if (!(await nonEmptyFile(projectPath))) {
    failures.push("Xcode project is missing");
    return;
  }
  const project = await readFile(projectPath, "utf8");
  const objectIds = [...project.matchAll(/^\s*([A-Za-z0-9]{24})\s+\/\*/gm)].map((match) => match[1]);
  if (objectIds.some((identifier) => !/^[0-9A-F]{24}$/.test(identifier))) {
    failures.push("Xcode project contains a non-hex PBX object identifier");
  }
  const releaseDebugOff = project.match(/CAPACITOR_DEBUG = NO;/g)?.length ?? 0;
  if (releaseDebugOff < 2) failures.push("project and app Release configurations must disable CAPACITOR_DEBUG");
  if (!project.includes(`PRODUCT_BUNDLE_IDENTIFIER = ${BUNDLE_ID};`)) failures.push("unexpected iOS bundle identifier");
  if (!/MARKETING_VERSION = \d+(?:\.\d+){1,2};/.test(project)) failures.push("iOS marketing version is missing");
  if (!/CURRENT_PROJECT_VERSION = [1-9]\d*;/.test(project)) failures.push("iOS build number must be a positive integer");
  if (!project.includes('DEBUG_INFORMATION_FORMAT = "dwarf-with-dsym";')) failures.push("Release must generate dSYM information");
  if (!project.includes("IPHONEOS_DEPLOYMENT_TARGET = 15.0;")) failures.push("minimum iOS target changed without an ADR");
  if ((project.match(/TARGETED_DEVICE_FAMILY = 1;/g)?.length ?? 0) < 2) failures.push("initial release must be iPhone-only");

  if (!(await nonEmptyFile(infoPath))) failures.push("Info.plist is missing");
  else {
    const info = await readFile(infoPath, "utf8");
    if (/UIDesignRequiresCompatibility|<string>armv7<\/string>|UISupportedInterfaceOrientations~ipad/.test(info)) {
      failures.push("Info.plist contains obsolete or unverified device compatibility settings");
    }
  }
  if (!(await nonEmptyFile(privacyPath))) failures.push("PrivacyInfo.xcprivacy is missing");
}

async function inspectBuiltApp(root, appPath, failures) {
  if (!appPath) return;
  if (!(await exists(appPath))) {
    failures.push("built App.app is missing");
    return;
  }
  for (const relative of [
    "Info.plist",
    "PrivacyInfo.xcprivacy",
    "public/index.html",
    "public/build-manifest.json",
    "capacitor.config.json",
  ]) {
    if (!(await nonEmptyFile(path.join(appPath, relative)))) failures.push(`built app is missing ${relative}`);
  }
  const embedded = await json(path.join(appPath, "capacitor.config.json"), failures, "embedded Capacitor config");
  validateCapacitorConfig(embedded, failures, "embedded Capacitor config");

  const sourceManifestPath = path.join(root, "ios-web/build-manifest.json");
  const builtManifestPath = path.join(appPath, "public/build-manifest.json");
  if (await nonEmptyFile(sourceManifestPath) && await nonEmptyFile(builtManifestPath)) {
    const [sourceManifestText, builtManifestText] = await Promise.all([
      readFile(sourceManifestPath, "utf8"),
      readFile(builtManifestPath, "utf8"),
    ]);
    if (sourceManifestText !== builtManifestText) {
      failures.push("built app contains a stale mobile shell manifest; run npm run mobile:sync");
    } else {
      try {
        const sourceManifest = JSON.parse(sourceManifestText);
        for (const asset of sourceManifest.assets ?? []) {
          if (typeof asset !== "string" || !asset.startsWith("./assets/")) continue;
          const relative = asset.slice(2);
          const sourceAsset = path.join(root, "ios-web", relative);
          const builtAsset = path.join(appPath, "public", relative);
          if (
            !(await nonEmptyFile(sourceAsset))
            || !(await nonEmptyFile(builtAsset))
            || await sha256File(sourceAsset) !== await sha256File(builtAsset)
          ) {
            failures.push(`built app contains a stale or missing mobile shell asset: ${relative}`);
          }
        }
      } catch {
        failures.push("could not compare built mobile shell assets");
      }
    }
  }
}

export async function inspectIosRelease({ root = process.cwd(), appPath = null } = {}) {
  const failures = [];
  const generatedPath = path.join(root, "ios/App/App/capacitor.config.json");
  const generated = await json(generatedPath, failures, "generated Capacitor config");
  validateCapacitorConfig(generated, failures, "generated Capacitor config");
  await inspectLocalShell(root, failures);
  await inspectXcodeProject(root, failures);
  await inspectBuiltApp(root, appPath, failures);
  const privacyEvidence = await inspectPrivacyEvidence(root, appPath, failures);
  const nativeReadiness = await inspectNativeReadiness({ root });
  return {
    ok: failures.length === 0,
    bundleId: BUNDLE_ID,
    canonicalOrigin: CANONICAL_ORIGIN,
    localShell: generated ? !generated.server?.url : false,
    loggingBehavior: generated?.loggingBehavior ?? null,
    appPath: appPath ? path.relative(root, appPath) : null,
    releaseScope: "bundled-local-shell-foundation",
    nativeReadiness,
    privacyEvidence,
    failures,
  };
}
