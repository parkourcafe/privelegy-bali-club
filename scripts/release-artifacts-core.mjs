const EXPECTED_ANDROID_PERMISSIONS = [
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.INTERNET",
  "com.otherbali.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION",
];

export const RELEASE_CONTRACT = Object.freeze({
  appId: "com.otherbali.app",
  appleTeamId: "KB7VPWHTTM",
  iosVersion: "1.0",
  iosBuild: "4",
  iosMinimumVersion: "15.0",
  associatedDomains: ["applinks:www.otherbali.com"],
  systemBarsStyle: "DARK",
  androidVersion: "1.0.0",
  androidVersionCode: "2",
  androidMinSdk: "24",
  androidTargetSdk: "36",
  androidCompileSdk: "36",
  androidPermissions: EXPECTED_ANDROID_PERMISSIONS,
});

function fail(message) {
  throw new Error(message);
}

function uniqueSorted(values) {
  return [...new Set(values)].sort();
}

function xmlDecode(value) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function xmlAttributes(fragment) {
  const attributes = {};
  for (const match of fragment.matchAll(/([:\w.-]+)\s*=\s*(["'])(.*?)\2/gs)) {
    attributes[match[1]] = xmlDecode(match[3]);
  }
  return attributes;
}

function quotedAttributes(line) {
  const attributes = {};
  for (const match of line.matchAll(/([A-Za-z][\w.-]*)='([^']*)'/g)) {
    attributes[match[1]] = match[2];
  }
  return attributes;
}

export function normalizeFingerprint(value, label = "certificate fingerprint") {
  if (typeof value !== "string" || !value.trim()) fail(`${label} is missing`);
  const normalized = value.replaceAll(/[^0-9A-Fa-f]/g, "").toUpperCase();
  if (!/^[0-9A-F]{64}$/.test(normalized)) fail(`${label} must be a SHA-256 fingerprint`);
  return normalized;
}

export function assertReleaseCapacitorConfig(config, label = "Capacitor config") {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    fail(`${label} is missing or malformed`);
  }
  if (config.appId !== RELEASE_CONTRACT.appId || config.webDir !== "ios-web") {
    fail(`${label} embedded identity is incorrect`);
  }
  if (config.loggingBehavior !== "none") fail(`${label} embedded logging must be disabled`);
  if (typeof config.server?.url === "string" && config.server.url.trim()) {
    fail(`${label} embeds a forbidden remote server.url`);
  }
  if (config.plugins?.SystemBars?.style !== RELEASE_CONTRACT.systemBarsStyle) {
    fail(`${label} must embed SystemBars.style=${RELEASE_CONTRACT.systemBarsStyle}`);
  }
  return true;
}

export function parseAaptBadging(output) {
  const packageLine = output.split(/\r?\n/).find((line) => line.startsWith("package:"));
  if (!packageLine) fail("aapt2 badging is missing the package record");
  const packageAttributes = quotedAttributes(packageLine);
  const lineValue = (label) => {
    const match = output.match(new RegExp(`^${label}:'([^']+)'$`, "m"));
    return match?.[1] ?? null;
  };
  const permissions = [...output.matchAll(/^uses-permission(?:-sdk-\d+)?:\s+name='([^']+)'/gm)]
    .map((match) => match[1]);
  return {
    packageName: packageAttributes.name ?? null,
    versionCode: packageAttributes.versionCode ?? null,
    versionName: packageAttributes.versionName ?? null,
    compileSdk: packageAttributes.compileSdkVersion
      ?? packageAttributes.platformBuildVersionCode
      ?? null,
    minSdk: lineValue("minSdkVersion") ?? lineValue("sdkVersion"),
    targetSdk: lineValue("targetSdkVersion"),
    debuggable: /^application-debuggable\b/m.test(output)
      || packageAttributes.debuggable === "true",
    permissions: uniqueSorted(permissions),
  };
}

export function parseAaptPermissions(output) {
  const uses = [...output.matchAll(/^uses-permission(?:-sdk-\d+)?:\s+(?:name=)?'([^']+)'/gm)]
    .map((match) => match[1]);
  const declared = [...output.matchAll(
    /^permission:\s+(?:(?:name=)?'([^']+)'|([^\s']+))(?:\s+protectionLevel='([^']+)')?/gm,
  )].map((match) => ({ name: match[1] ?? match[2], protectionLevel: match[3] ?? null }));
  return { uses: uniqueSorted(uses), declared };
}

export function parseBundletoolManifest(output) {
  const manifestMatch = output.match(/<manifest\b([^>]*)>/s);
  const sdkMatch = output.match(/<uses-sdk\b([^>]*)\/?\s*>/s);
  if (!manifestMatch) fail("bundletool manifest is missing <manifest>");
  if (!sdkMatch) fail("bundletool manifest is missing <uses-sdk>");
  const manifest = xmlAttributes(manifestMatch[1]);
  const sdk = xmlAttributes(sdkMatch[1]);
  const permissions = [...output.matchAll(/<uses-permission(?:-sdk-\d+)?\b([^>]*)\/?\s*>/gs)]
    .map((match) => xmlAttributes(match[1])["android:name"])
    .filter(Boolean);
  const applicationMatch = output.match(/<application\b([^>]*)>/s);
  const application = applicationMatch ? xmlAttributes(applicationMatch[1]) : {};
  return {
    packageName: manifest.package ?? null,
    versionCode: manifest["android:versionCode"] ?? null,
    versionName: manifest["android:versionName"] ?? null,
    compileSdk: manifest["android:compileSdkVersion"]
      ?? manifest.platformBuildVersionCode
      ?? null,
    minSdk: sdk["android:minSdkVersion"] ?? null,
    targetSdk: sdk["android:targetSdkVersion"] ?? null,
    debuggable: application["android:debuggable"] === "true",
    permissions: uniqueSorted(permissions),
  };
}

export function parseApksignerOutput(output) {
  const booleanValue = (label) => {
    const match = output.match(new RegExp(`^${label}:\\s*(true|false)$`, "mi"));
    return match ? match[1].toLowerCase() === "true" : null;
  };
  const fingerprints = [...output.matchAll(/Signer #\d+ certificate SHA-256 digest:\s*([0-9a-f:]+)/gi)]
    .map((match) => normalizeFingerprint(match[1], "APK signer fingerprint"));
  const subjects = [...output.matchAll(/Signer #\d+ certificate DN:\s*(.+)$/gmi)]
    .map((match) => match[1].trim());
  return {
    verified: booleanValue("Verifies") ?? true,
    v1: booleanValue("Verified using v1 scheme \\(JAR signing\\)"),
    v2: booleanValue("Verified using v2 scheme \\(APK Signature Scheme v2\\)"),
    v3: booleanValue("Verified using v3 scheme \\(APK Signature Scheme v3\\)"),
    fingerprints: uniqueSorted(fingerprints),
    subjects,
  };
}

export function parseKeytoolCertificate(output) {
  const fingerprint = output.match(/SHA-?256:\s*([0-9A-Fa-f: ]{64,})/i)?.[1]
    ?? output.match(/SHA256:\s*([0-9A-Fa-f:]+)/i)?.[1];
  const owner = output.match(/^(?:Owner|Subject):\s*(.+)$/mi)?.[1]?.trim() ?? null;
  return {
    fingerprint: fingerprint ? normalizeFingerprint(fingerprint, "AAB signer fingerprint") : null,
    owner,
  };
}

export function parseJarSignerOutput(output) {
  return {
    verified: /\bjar verified\.\s*$/mi.test(output),
    hasUnsignedEntries: /^\s*\?\s+(?!=)\S+/m.test(output),
    hasSignatureErrors: /(?:jar is unsigned|signature (?:was not|is not) verified|invalid signature)/i.test(output),
  };
}

export function parseCodesignDetails(output) {
  const value = (name) => output.match(new RegExp(`^${name}=(.*)$`, "m"))?.[1]?.trim() ?? null;
  return {
    identifier: value("Identifier"),
    teamIdentifier: value("TeamIdentifier"),
    signature: value("Signature"),
    authorities: [...output.matchAll(/^Authority=(.*)$/gm)].map((match) => match[1].trim()),
  };
}

export function assertAndroidMetadata(metadata, label) {
  const expected = RELEASE_CONTRACT;
  const comparisons = [
    [metadata.packageName, expected.appId, "package"],
    [metadata.versionCode, expected.androidVersionCode, "versionCode"],
    [metadata.versionName, expected.androidVersion, "versionName"],
    [metadata.compileSdk, expected.androidCompileSdk, "compile SDK"],
    [metadata.minSdk, expected.androidMinSdk, "minimum SDK"],
    [metadata.targetSdk, expected.androidTargetSdk, "target SDK"],
  ];
  for (const [actual, wanted, field] of comparisons) {
    if (String(actual ?? "") !== wanted) fail(`${label} ${field} must equal ${wanted}`);
  }
  if (metadata.debuggable) fail(`${label} must not be debuggable`);
  const actualPermissions = uniqueSorted(metadata.permissions ?? []);
  if (JSON.stringify(actualPermissions) !== JSON.stringify(expected.androidPermissions)) {
    fail(`${label} permissions must exactly equal ${expected.androidPermissions.join(", ")}`);
  }
  return true;
}

export function assertReleaseCertificate({ fingerprint, subject, expectedFingerprint, label }) {
  const actual = normalizeFingerprint(fingerprint ?? "", `${label} certificate fingerprint`);
  const expected = normalizeFingerprint(expectedFingerprint ?? "", `${label} expected fingerprint`);
  if (actual !== expected) fail(`${label} certificate does not match the approved fingerprint`);
  if (!subject || /(?:CN=)?Android Debug/i.test(subject) || /androiddebugkey/i.test(subject)) {
    fail(`${label} uses a forbidden debug or unidentified certificate`);
  }
  return true;
}

function exactStringArray(value, expected) {
  return Array.isArray(value)
    && JSON.stringify(uniqueSorted(value.map(String))) === JSON.stringify(uniqueSorted(expected));
}

function falseValue(value) {
  return value === false || value === 0 || value === "0" || value === "NO" || value === "false";
}

export function assertIosMetadata({ info, entitlements, profile, codesign, now = new Date() }) {
  const expected = RELEASE_CONTRACT;
  if (!info || !entitlements || !profile || !codesign) fail("iOS metadata evidence is incomplete");
  if (info.CFBundleIdentifier !== expected.appId) fail("IPA bundle identifier is incorrect");
  if (String(info.CFBundleShortVersionString ?? "") !== expected.iosVersion) fail("IPA version must equal 1.0");
  if (String(info.CFBundleVersion ?? "") !== expected.iosBuild) fail("IPA build must equal 4");
  if (String(info.MinimumOSVersion ?? "") !== expected.iosMinimumVersion) fail("IPA minimum iOS version must equal 15.0");
  if (info.DTPlatformName !== "iphoneos" || !/^iphoneos\d+(?:\.\d+)*$/i.test(info.DTSDKName ?? "")) {
    fail("IPA must be built with an iPhoneOS SDK");
  }
  if (!exactStringArray(info.UIDeviceFamily?.map(String), ["1"])) fail("IPA must target iPhone only");
  if (!falseValue(info.CAPACITOR_DEBUG)) fail("IPA CAPACITOR_DEBUG must be disabled");
  const usageKeys = Object.keys(info).filter((key) => /^NS.+UsageDescription$/.test(key));
  if (usageKeys.length) fail(`IPA contains unapproved privacy permissions: ${usageKeys.join(", ")}`);

  if (codesign.identifier !== expected.appId || codesign.teamIdentifier !== expected.appleTeamId) {
    fail("IPA code signature identity does not match the approved app/team");
  }
  if (!codesign.authorities.some((authority) => /^Apple Distribution(?::|$)/.test(authority))) {
    fail("IPA is not signed by an Apple Distribution identity");
  }
  if (codesign.authorities.some((authority) => /^Apple Development(?::|$)/.test(authority))
    || codesign.signature?.toLowerCase() === "adhoc") {
    fail("IPA uses a development or ad-hoc signature");
  }

  const allowedEntitlements = new Set([
    "application-identifier",
    "beta-reports-active",
    "com.apple.developer.associated-domains",
    "com.apple.developer.team-identifier",
    "get-task-allow",
    "keychain-access-groups",
  ]);
  const unexpectedEntitlements = Object.keys(entitlements).filter((key) => !allowedEntitlements.has(key));
  if (unexpectedEntitlements.length) fail(`IPA contains unapproved entitlements: ${unexpectedEntitlements.join(", ")}`);
  const applicationIdentifier = `${expected.appleTeamId}.${expected.appId}`;
  if (entitlements["application-identifier"] !== applicationIdentifier
    || entitlements["com.apple.developer.team-identifier"] !== expected.appleTeamId) {
    fail("IPA entitlements do not match the approved app/team");
  }
  if (!falseValue(entitlements["get-task-allow"])) fail("IPA get-task-allow must be false");
  if (!exactStringArray(entitlements["com.apple.developer.associated-domains"], expected.associatedDomains)) {
    fail("IPA associated domains do not exactly match the release contract");
  }
  if (Object.hasOwn(entitlements, "keychain-access-groups")
    && !exactStringArray(entitlements["keychain-access-groups"], [applicationIdentifier])) {
    fail("IPA keychain access group does not exactly match the approved app");
  }
  if (Object.hasOwn(entitlements, "beta-reports-active")
    && entitlements["beta-reports-active"] !== true) {
    fail("IPA beta-reports-active entitlement is malformed");
  }

  const profileEntitlements = profile.Entitlements ?? {};
  if (!Array.isArray(profile.TeamIdentifier) || !profile.TeamIdentifier.includes(expected.appleTeamId)) {
    fail("embedded profile has the wrong Apple team");
  }
  if (profileEntitlements["application-identifier"] !== applicationIdentifier
    || profileEntitlements["com.apple.developer.team-identifier"] !== expected.appleTeamId) {
    fail("embedded profile has the wrong application identifier");
  }
  if (!falseValue(profileEntitlements["get-task-allow"])) fail("embedded profile allows debugging");
  const profileAssociatedDomains = profileEntitlements["com.apple.developer.associated-domains"];
  if (!exactStringArray(profileAssociatedDomains, expected.associatedDomains)
    && !exactStringArray(profileAssociatedDomains, ["*"])) {
    fail("embedded profile does not authorize the exact associated domain");
  }
  if ((Array.isArray(profile.ProvisionedDevices) && profile.ProvisionedDevices.length)
    || profile.ProvisionsAllDevices === true) {
    fail("embedded profile is a development/ad-hoc/enterprise profile, not App Store distribution");
  }
  const expiration = new Date(profile.ExpirationDate);
  if (!Number.isFinite(expiration.getTime()) || expiration <= now) fail("embedded profile is expired or invalid");
  if (!profile.UUID || !profile.Name) fail("embedded profile identity is missing");
  return true;
}
