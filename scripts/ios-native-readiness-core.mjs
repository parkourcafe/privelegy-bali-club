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
  if (!/DEVELOPMENT_TEAM = [A-Z0-9]{10};/.test(project)) {
    add(blockers, "signing_team_missing", "A real 10-character Apple Developer Team ID is not configured");
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
      const details = aasaDetails(aasa);
      const appIds = details.flatMap((detail) => [detail?.appID, ...(Array.isArray(detail?.appIDs) ? detail.appIDs : [])]);
      if (!appIds.some((appId) => typeof appId === "string" && /^[A-Z0-9]{10}\.com\.otherbali\.app$/.test(appId))) {
        add(blockers, "aasa_app_id_unverified", "AASA has no verified TEAMID.com.otherbali.app application identifier");
      }
      if (!aasaSupports(details, "/places/") || !aasaSupports(details, "/route/")) {
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
  if (!/\bimport\s+MapKit\b/.test(swiftText)) {
    add(blockers, "native_map_missing", "no native MapKit route surface is present");
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
