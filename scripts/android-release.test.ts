import assert from "node:assert/strict";
import test from "node:test";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { inspectAndroidReleaseShell } from "./verify-android-release-shell.mjs";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const fixtureSourceRelative = "mobile/src/App.tsx";
const fixtureSourceContents = "export const fixture = 'current';\n";
const fixtureSourceHash = createHash("sha256")
  .update(fixtureSourceRelative)
  .update("\0")
  .update(fixtureSourceContents)
  .update("\0")
  .digest("hex");

const validManifest = {
  schemaVersion: 1,
  shellVersion: "test",
  apiOrigin: "https://www.otherbali.com",
  assets: ["./assets/app-test.js", "./assets/app-test.css"],
  sourceInputs: [fixtureSourceRelative],
  sourceHash: fixtureSourceHash,
};

async function releaseShellFixture() {
  const root = await mkdtemp(path.join(tmpdir(), "other-bali-android-release-shell-"));
  const canonicalRoot = path.join(root, "ios-web");
  const copiedRoot = path.join(root, "android/app/src/main/assets/public");
  await Promise.all([
    mkdir(path.join(canonicalRoot, "assets"), { recursive: true }),
    mkdir(path.join(copiedRoot, "assets"), { recursive: true }),
    mkdir(path.join(root, "mobile/src"), { recursive: true }),
  ]);
  const config = {
    appId: "com.otherbali.app",
    appName: "Other Bali",
    webDir: "ios-web",
    loggingBehavior: "none",
  };
  const sharedFiles = new Map([
    ["index.html", "<!doctype html><div id=\"root\"></div>\n"],
    ["offline.html", "<!doctype html><p>Offline</p>\n"],
    ["build-manifest.json", `${JSON.stringify(validManifest, null, 2)}\n`],
    ["assets/app-test.js", "console.log('release');\n"],
    ["assets/app-test.css", "body{color:#20160f}\n"],
  ]);
  await Promise.all([
    writeFile(path.join(root, "android/app/src/main/assets/capacitor.config.json"), `${JSON.stringify(config)}\n`),
    writeFile(path.join(root, fixtureSourceRelative), fixtureSourceContents),
    ...[...sharedFiles].flatMap(([relative, contents]) => [
      writeFile(path.join(canonicalRoot, relative), contents),
      writeFile(path.join(copiedRoot, relative), contents),
    ]),
  ]);
  return root;
}

test("Android uses the same bundled Capacitor shell as iOS", () => {
  const packageJson = JSON.parse(read("../package.json"));
  assert.equal(packageJson.dependencies["@capacitor/android"], "8.4.1");
  assert.equal(packageJson.scripts["mobile:sync:android"], "cap sync android");
  assert.match(packageJson.scripts["android:debug"], /mobile:build.*mobile:sync:android/);
  assert.equal(packageJson.scripts["android:release"], "npm run android:release:play && npm run android:release:rustore");
  assert.match(packageJson.scripts["android:release:play"], /bundlePlayRelease/);
  assert.match(packageJson.scripts["android:release:rustore"], /assembleRustoreRelease/);

  const activity = read("../android/app/src/main/java/com/otherbali/app/MainActivity.java");
  const appGradle = read("../android/app/build.gradle");
  assert.match(activity, /extends BridgeActivity/);
  assert.match(appGradle, /implementation project\(':capacitor-android'\)/);
  assert.doesNotMatch(appGradle, /androidbrowserhelper|TrustedWebActivity/);
});

test("Android release identity, SDK floor, version, and signing gate are fixed", () => {
  const appGradle = read("../android/app/build.gradle");
  const variables = read("../android/variables.gradle");

  assert.match(appGradle, /namespace = "com\.otherbali\.app"/);
  assert.match(appGradle, /applicationId "com\.otherbali\.app"/);
  assert.match(appGradle, /versionCode 2/);
  assert.match(appGradle, /versionName "1\.0\.0"/);
  assert.match(variables, /minSdkVersion = 24/);
  assert.match(variables, /compileSdkVersion = 36/);
  assert.match(variables, /targetSdkVersion = 36/);
  assert.match(appGradle, /JavaVersion\.VERSION_21/);
  assert.match(appGradle, /verifyPlayUploadSigning/);
  assert.match(appGradle, /verifyRuStoreReleaseSigning/);
  assert.match(appGradle, /OTHER_BALI_PLAY_UPLOAD_CERT_SHA256/);
  assert.match(appGradle, /OTHER_BALI_RUSTORE_APP_SIGNING_SHA256/);
  assert.match(appGradle, /MessageDigest\.getInstance\('SHA-256'\)/);
  assert.match(appGradle, /CN=Android Debug/);
  assert.match(appGradle, /gradle\.taskGraph\.whenReady/);
  assert.match(appGradle, /packagePlayReleaseBundle/);
  assert.match(appGradle, /packageRustoreRelease/);
  assert.match(appGradle, /bundlePlayRelease/);
  assert.match(appGradle, /assembleRustoreRelease/);
  assert.match(appGradle, /verifyAndroidReleaseShell/);
  assert.match(appGradle, /scripts\/verify-android-release-shell\.mjs/);
  assert.match(appGradle, /providers\.exec/);
  assert.match(
    appGradle,
    /if \(playReleaseRequested \|\| rustoreReleaseRequested\)[\s\S]*verifyReleaseShell\(\)[\s\S]*if \(playReleaseRequested\)[\s\S]*verifySigning\(playUpload/,
  );
});

test("Android Release shell preflight accepts an exact local synced shell", async () => {
  const root = await releaseShellFixture();
  try {
    assert.deepEqual(await inspectAndroidReleaseShell({ root }), {
      ok: true,
      appId: "com.otherbali.app",
      loggingBehavior: "none",
      assets: 2,
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("Android Release shell preflight fails closed for remote, verbose, malformed, and stale outputs", async (t) => {
  const cases: Array<{
    name: string;
    expected: RegExp;
    mutate: (root: string) => Promise<void>;
  }> = [
    {
      name: "server.url",
      expected: /forbidden server\.url/,
      mutate: async (root) => writeFile(
        path.join(root, "android/app/src/main/assets/capacitor.config.json"),
        `${JSON.stringify({
          appId: "com.otherbali.app",
          webDir: "ios-web",
          loggingBehavior: "none",
          server: { url: "https://preview.example" },
        })}\n`,
      ),
    },
    {
      name: "verbose logging",
      expected: /loggingBehavior must be none/,
      mutate: async (root) => writeFile(
        path.join(root, "android/app/src/main/assets/capacitor.config.json"),
        `${JSON.stringify({ appId: "com.otherbali.app", webDir: "ios-web", loggingBehavior: "debug" })}\n`,
      ),
    },
    {
      name: "malformed config",
      expected: /malformed JSON/,
      mutate: async (root) => writeFile(
        path.join(root, "android/app/src/main/assets/capacitor.config.json"),
        "{\n",
      ),
    },
    {
      name: "stale canonical source",
      expected: /stale relative to mobile\/shared source/,
      mutate: async (root) => writeFile(
        path.join(root, fixtureSourceRelative),
        "export const fixture = 'changed';\n",
      ),
    },
    {
      name: "stale manifest",
      expected: /build manifest is stale/,
      mutate: async (root) => writeFile(
        path.join(root, "android/app/src/main/assets/public/build-manifest.json"),
        `${JSON.stringify({ ...validManifest, shellVersion: "stale" }, null, 2)}\n`,
      ),
    },
    {
      name: "stale bundled asset",
      expected: /asset assets\/app-test\.js is stale/,
      mutate: async (root) => writeFile(
        path.join(root, "android/app/src/main/assets/public/assets/app-test.js"),
        "console.log('stale');\n",
      ),
    },
    {
      name: "missing bundled asset",
      expected: /asset set is stale/,
      mutate: async (root) => rm(
        path.join(root, "android/app/src/main/assets/public/assets/app-test.css"),
      ),
    },
  ];

  for (const fixtureCase of cases) {
    await t.test(fixtureCase.name, async () => {
      const root = await releaseShellFixture();
      try {
        await fixtureCase.mutate(root);
        await assert.rejects(inspectAndroidReleaseShell({ root }), fixtureCase.expected);
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    });
  }
});

test("Android app links are narrow, verified, and the local state is not backed up", () => {
  const manifest = read("../android/app/src/main/AndroidManifest.xml");

  assert.match(manifest, /android:allowBackup="false"/);
  assert.match(manifest, /android:usesCleartextTraffic="false"/);
  assert.match(manifest, /android:autoVerify="true"/);
  assert.match(manifest, /android:pathPrefix="\/places\/"/);
  assert.match(manifest, /android:pathPrefix="\/route\/"/);
  assert.equal((manifest.match(/android:host="www\.otherbali\.com"/g) ?? []).length, 2);
  assert.doesNotMatch(manifest, /location|camera|notification|billing/i);
});

test("Android test identity matches production and unused Google Services wiring is absent", () => {
  const instrumentedTest = read("../android/app/src/androidTest/java/com/otherbali/app/ExampleInstrumentedTest.java");
  const rootGradle = read("../android/build.gradle");
  const appGradle = read("../android/app/build.gradle");
  const gitignore = read("../android/.gitignore");

  assert.match(instrumentedTest, /package com\.otherbali\.app;/);
  assert.match(instrumentedTest, /assertEquals\("com\.otherbali\.app"/);
  assert.doesNotMatch(rootGradle, /google-services/);
  assert.doesNotMatch(appGradle, /google-services|Google Services|Firebase/);
  assert.match(gitignore, /^google-services\.json$/m);
  assert.match(gitignore, /^app\/google-services\.json$/m);
});
