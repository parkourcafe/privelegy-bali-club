import assert from "node:assert/strict";
import test from "node:test";
import { createAssetLinks, normalizeSha256Fingerprint } from "./generate-assetlinks.mjs";

const play = Array.from({ length: 32 }, (_, index) => index.toString(16).padStart(2, "0")).join(":");
const rustore = Array.from({ length: 32 }, (_, index) => (255 - index).toString(16).padStart(2, "0")).join(":");

test("assetlinks uses only final Play and RuStore app-signing certificate fingerprints", () => {
  const statement = createAssetLinks({
    playAppSigningSha256: play,
    rustoreAppSigningSha256: rustore,
  });
  assert.deepEqual(statement, [{
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.otherbali.app",
      sha256_cert_fingerprints: [play.toUpperCase(), rustore.toUpperCase()],
    },
  }]);
});

test("assetlinks deduplicates a shared final signer and rejects placeholders", () => {
  const statement = createAssetLinks({
    playAppSigningSha256: play,
    rustoreAppSigningSha256: play.toUpperCase(),
  });
  assert.deepEqual(statement[0].target.sha256_cert_fingerprints, [play.toUpperCase()]);
  assert.throws(
    () => normalizeSha256Fingerprint("REPLACE_ME", "certificate"),
    /colon-separated SHA-256/,
  );
});
