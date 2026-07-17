#!/usr/bin/env node

import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { build } from "esbuild";

const root = process.cwd();
const outputRoot = path.join(root, "ios-web");
const assetsRoot = path.join(outputRoot, "assets");
const canonicalOrigin = "https://www.otherbali.com";

function apiOrigin() {
  const raw = (process.env.MOBILE_API_ORIGIN ?? canonicalOrigin).trim();
  const url = new URL(raw);
  if (!/^https?:$/.test(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("MOBILE_API_ORIGIN must be a credential-free HTTP(S) origin");
  }
  if (url.origin !== canonicalOrigin && process.env.MOBILE_ALLOW_NON_PRODUCTION_API !== "1") {
    throw new Error("Non-production mobile API origins require MOBILE_ALLOW_NON_PRODUCTION_API=1");
  }
  return url.origin;
}

const origin = apiOrigin();
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
await rm(outputRoot, { recursive: true, force: true });
await mkdir(assetsRoot, { recursive: true });

const result = await build({
  absWorkingDir: root,
  entryPoints: ["mobile/src/main.tsx"],
  outdir: assetsRoot,
  entryNames: "app-[hash]",
  assetNames: "asset-[hash]",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["safari15"],
  minify: true,
  sourcemap: false,
  legalComments: "none",
  metafile: true,
  define: {
    __MOBILE_API_ORIGIN__: JSON.stringify(origin),
    __MOBILE_SHELL_VERSION__: JSON.stringify(String(packageJson.version)),
  },
});

const outputs = Object.keys(result.metafile.outputs).map((entry) => path.resolve(root, entry));
const javascript = outputs.find((entry) => entry.endsWith(".js"));
const stylesheet = outputs.find((entry) => entry.endsWith(".css"));
if (!javascript || !stylesheet) throw new Error("Mobile shell build did not emit JavaScript and CSS");

const relativeAsset = (file) => `./${path.relative(outputRoot, file).split(path.sep).join("/")}`;
const sourceInputs = [...new Set([
  ...Object.keys(result.metafile.inputs)
    .map((entry) => path.relative(root, path.resolve(root, entry)).split(path.sep).join("/"))
    .filter((entry) => (
      entry
      && entry !== ".."
      && !entry.startsWith("../")
      && !entry.startsWith("node_modules/")
      && !entry.includes("/node_modules/")
    )),
  "mobile/public/offline.html",
  "package.json",
  "package-lock.json",
  "scripts/build-mobile-shell.mjs",
])].sort();
const sourceDigest = createHash("sha256");
for (const relative of sourceInputs) {
  sourceDigest.update(relative);
  sourceDigest.update("\0");
  sourceDigest.update(await readFile(path.join(root, relative)));
  sourceDigest.update("\0");
}
const cspOrigin = new URL(origin).origin;
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#20160f" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self' capacitor:; connect-src 'self' ${cspOrigin}; img-src 'self' data: https:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self'" />
    <title>Other Bali</title>
    <link rel="stylesheet" href="${relativeAsset(stylesheet)}" />
    <script type="module" src="${relativeAsset(javascript)}"></script>
  </head>
  <body>
    <div id="root"><p>Opening the local Other Bali guide…</p></div>
    <noscript>Other Bali requires JavaScript to show the locally bundled guide.</noscript>
  </body>
</html>
`;

await writeFile(path.join(outputRoot, "index.html"), html, "utf8");
await copyFile(path.join(root, "mobile/public/offline.html"), path.join(outputRoot, "offline.html"));
await writeFile(
  path.join(outputRoot, "build-manifest.json"),
  `${JSON.stringify({
    schemaVersion: 1,
    shellVersion: String(packageJson.version),
    apiOrigin: origin,
    assets: outputs.map(relativeAsset).sort(),
    sourceInputs,
    sourceHash: sourceDigest.digest("hex"),
  }, null, 2)}\n`,
  "utf8",
);

console.log(`Built local Other Bali mobile shell in ${path.relative(root, outputRoot)}`);
