import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { inspectPng, STORE_ASSET_SPECS, validateStoreAssets } from "./validate-store-assets.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("canonical store assets match their exact dimensions and opacity requirements", async () => {
  const evidence = await validateStoreAssets(path.join(root, "store-assets"));
  assert.equal(evidence.length, STORE_ASSET_SPECS.length);
  assert.ok(evidence.every((asset) => /^[a-f0-9]{64}$/.test(asset.sha256)));
  assert.equal(evidence.find((asset) => asset.file === "google-play-icon-512.png")?.hasAlpha, true);
  assert.ok(evidence.filter((asset) => asset.file !== "google-play-icon-512.png").every((asset) => asset.hasAlpha === false));
});

test("PNG inspection rejects non-PNG content", () => {
  assert.throws(() => inspectPng(Buffer.from("not a png")), /not a valid PNG/);
});

test("PNG inspection rejects truncated or CRC-corrupted streams", async () => {
  const valid = await import("node:fs/promises").then(({ readFile }) => readFile(
    path.join(root, "store-assets/google-play-icon-512.png"),
  ));
  assert.throws(() => inspectPng(valid.subarray(0, valid.length - 12)), /IEND|chunk/);
  const corrupted = Buffer.from(valid);
  corrupted[29] ^= 0xff;
  assert.throws(() => inspectPng(corrupted), /invalid CRC/);
});
