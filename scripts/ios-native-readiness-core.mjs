import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";

const REQUIRED_PLUGINS = [
  ["@capacitor/app", "App/deep-link lifecycle", "CapacitorApp"],
  ["@capacitor/app-launcher", "controlled app launching", "CapacitorAppLauncher"],
  ["@capacitor/browser", "controlled browser handoff", "CapacitorBrowser"],
  ["@capacitor/network", "native network status", "CapacitorNetwork"],
  ["@capacitor/preferences", "native preferences/storage", "CapacitorPreferences"],
  ["@capacitor/share", "native share sheet", "CapacitorShare"],
];

export const APPLE_TEAM_ID = "KB7VPWHTTM";
export const IOS_BUNDLE_ID = "com.otherbali.app";

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function sourceFiles(directory, extension) {
  if (!(await exists(directory))) return [];
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await sourceFiles(target, extension));
    else if (entry.name.endsWith(extension)) result.push(target);
  }
  return result;
}

function add(blockers, code, message) {
  blockers.push({ code, message });
}

function aasaDetails(aasa) {
  const details = aasa?.applinks?.details;
  return Array.isArray(details) ? details : details && typeof details === "object" ? [details] : [];
}

export function aasaDetailsForApplication(aasa, applicationIdentifier) {
  return aasaDetails(aasa).filter((detail) => [
    detail?.appID,
    ...(Array.isArray(detail?.appIDs) ? detail.appIDs : []),
  ].includes(applicationIdentifier));
}

function aasaSupports(details, prefix) {
  return details.some((detail) => {
    const components = Array.isArray(detail?.components) ? detail.components : [];
    const paths = Array.isArray(detail?.paths) ? detail.paths : [];
    return components.some((component) => typeof component?.["/"] === "string" && component["/"].startsWith(prefix))
      || paths.some((candidate) => typeof candidate === "string" && candidate.startsWith(prefix));
  });
}

export async function inspectNativeReadiness({ root = process.cwd() } = {}) {
  const blockers = [];
  const packagePath = path.join(root, "package.json");
  const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const spmPath = path.join(root, "ios/App/CapApp-SPM/Package.swift");
  const spm = await exists(spmPath) ? await readFile(spmPath, "utf8") : "";

  for (const [packageName, capability, productName] of REQUIRED_PLUGINS) {
    if (!dependencies[packageName]) {
      add(blockers, `plugin_missing:${packageName}`, `${capability} requires ${packageName}`);
    } else {
      if (!spm.includes(`name: "${productName}"`)) {
        add(blockers, `plugin_not_synced:${packageName}`, `${packageName} is declared but is not present in the synced iOS Swift package`);
      }
    }
  }

  const projectPath = path.join(root, "ios/App/App.xcodeproj/project.pbxproj");
  const project = await exists(projectPath) ? await readFile(projectPath, "utf8") : "";
  if (!project.includes(`DEVELOPMENT_TEAM = ${APPLE_TEAM_ID};`)) {
    add(blockers, "signing_team_mismatch", `The App target must use Apple Developer Team ${APPLE_TEAM_ID}`);
  }
  const automaticReleaseIdentity = /\/\* Release \*\/ = \{[^}]*buildSettings = \{[^}]*CODE_SIGN_IDENTITY = "Apple Development";[^}]*\};\s*name = Release;\s*\};/.test(project)
    && !project.includes('CODE_SIGN_IDENTITY = "Apple Distribution";');
  if (!automaticReleaseIdentity) {
    add(blockers, "release_identity_mismatch", "The Release project configuration must use Apple Development so Automatic signing can archive before App Store Connect export");
  }

  const entitlementsPath = path.join(root, "ios/App/App/App.entitlements");
  const entitlements = await exists(entitlementsPath) ? await readFile(entitlementsPath, "utf8") : "";
  if (!project.includes("CODE_SIGN_ENTITLEMENTS = App/App.entitlements;")) {
    add(blockers, "associated_domains_not_linked", "the App target does not link App/App.entitlements");
  }
  if (!entitlements.includes("com.apple.developer.associated-domains") || !entitlements.includes("applinks:www.otherbali.com")) {
    add(blockers, "associated_domains_missing", "the production applinks:www.otherbali.com entitlement is missing");
  }

  const aasaPath = path.join(root, "public/.well-known/apple-app-site-association");
  if (!(await exists(aasaPath))) {
    add(blockers, "aasa_missing", "public/.well-known/apple-app-site-association is missing");
  } else {
    try {
      const aasa = JSON.parse(await readFile(aasaPath, "utf8"));
      const expectedAppId = `${APPLE_TEAM_ID}.${IOS_BUNDLE_ID}`;
      const matchingDetails = aasaDetailsForApplication(aasa, expectedAppId);
      if (!matchingDetails.length) {
        add(blockers, "aasa_app_id_mismatch", `AASA must contain the exact application identifier ${expectedAppId}`);
      } else if (!aasaSupports(matchingDetails, "/places/") || !aasaSupports(matchingDetails, "/route/")) {
        add(blockers, "aasa_routes_missing", "AASA does not cover both /places/* and /route/*");
      }
    } catch {
      add(blockers, "aasa_invalid", "apple-app-site-association is not valid JSON");
    }
  }

  const mobileSources = await sourceFiles(path.join(root, "mobile/src"), ".ts");
  mobileSources.push(...await sourceFiles(path.join(root, "mobile/src"), ".tsx"));
  const mobileText = (await Promise.all(mobileSources.map((file) => readFile(file, "utf8")))).join("\n");
  if (!mobileText.includes("appUrlOpen") || !mobileText.includes("getLaunchUrl")) {
    add(blockers, "deep_link_handler_missing", "the local shell must handle warm appUrlOpen and cold getLaunchUrl routing");
  }

  const swiftSources = await sourceFiles(path.join(root, "ios/App/App"), ".swift");
  const swiftText = (await Promise.all(swiftSources.map((file) => readFile(file, "utf8")))).join("\n");
  const nativeMapKit = /\bimport\s+MapKit\b/.test(swiftText);
  const controlledMapHandoff = mobileText.includes('openControlledExternal')
    && mobileText.includes('"google_maps"')
    && mobileText.includes("AppLauncher.openUrl");
  if (!nativeMapKit && !controlledMapHandoff) {
    add(blockers, "map_handoff_missing", "neither a native MapKit surface nor a controlled native Maps handoff is present");
  }

  const deepLinkTestEvidence = [
    path.join(root, "ios/App/AppTests/DeepLinkTests.swift"),
    path.join(root, "mobile/tests/deep-links.test.ts"),
  ];
  if (!(await Promise.all(deepLinkTestEvidence.map(exists))).some(Boolean)) {
    add(blockers, "deep_link_tests_missing", "cold-start and warm-start deep-link tests are missing");
  }

  return {
    ready: blockers.length === 0,
    scope: "native-capabilities-and-universal-links",
    blockers,
  };
}
