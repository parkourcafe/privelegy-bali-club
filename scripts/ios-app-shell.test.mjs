import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const load = (path) => readFile(new URL(path, root), "utf8");

test("iOS ships a bundled app-only start screen instead of redirecting to the web", async () => {
  const index = await load("ios-web/index.html");
  const config = await load("capacitor.config.ts");
  assert.match(index, /app-shell\.js/);
  assert.doesNotMatch(index, /window\.location\.replace/);
  assert.doesNotMatch(config, /url:\s*["']https:\/\/www\.otherbali\.com/);
});

test("the bundled shell persists a plan, favourites, offline state and deep links", async () => {
  const shell = await load("ios-web/app-shell.js");
  assert.match(shell, /otherbali\.app\.plan\.v1/);
  assert.match(shell, /otherbali\.app\.favourites\.v1/);
  assert.match(shell, /addEventListener\("offline"/);
  assert.match(shell, /appUrlOpen/);
  assert.match(shell, /getLaunchUrl/);
  assert.match(shell, /otherbali:\/\/plan/);
  assert.match(shell, /kind === "place"/);
  assert.match(shell, /Plugins\.Share/);
  assert.match(shell, /navigator\.share/);
  assert.match(shell, /scrollIntoView/);
  assert.match(shell, /storedPlan && storedPlan\.district/);
  assert.match(shell, /planMood/);
  assert.match(shell, /id="plan"><\/div><section class="step"><span class="step-label">Saved places/);
  assert.doesNotMatch(shell, /navigator\.geolocation|SUPABASE|authToken/i);
});

test("the bundled shell prevents a pinched or horizontally shifted iPhone layout", async () => {
  const index = await load("ios-web/index.html");
  const styles = await load("ios-web/app-shell.css");
  assert.match(index, /maximum-scale=1/);
  assert.match(index, /user-scalable=no/);
  assert.match(styles, /overflow-x:\s*hidden/);
  assert.match(styles, /touch-action:\s*pan-y/);
  assert.match(styles, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
});

test("the iOS target declares the bundle ID and custom deep-link scheme", async () => {
  const plist = await load("ios/App/App/Info.plist");
  const project = await load("ios/App/App.xcodeproj/project.pbxproj");
  assert.match(project, /PRODUCT_BUNDLE_IDENTIFIER = com\.otherbali\.app/);
  assert.match(plist, /<string>otherbali<\/string>/);
});
