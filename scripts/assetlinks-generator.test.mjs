import assert from "node:assert/strict";
import test from "node:test";
import { assertProductionCertificateEvidence, createAssetLinks, normalizeSha256Fingerprint } from "./generate-assetlinks.mjs";

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

test("certificate evidence rejects Android Debug and expired certificates", () => {
  const production = assertProductionCertificateEvidence({
    subject: "CN=Other Bali Android App Signing,O=Other Bali",
    validFrom: "2026-01-01T00:00:00Z",
    validTo: "2050-01-01T00:00:00Z",
    fingerprint256: play,
  }, "certificate");
  assert.equal(production.sha256, play.toUpperCase());
  assert.throws(() => assertProductionCertificateEvidence({
    subject: "C=US,O=Android,CN=Android Debug",
    validFrom: "2026-01-01T00:00:00Z",
    validTo: "2050-01-01T00:00:00Z",
    fingerprint256: play,
  }, "certificate"), /must not use an Android Debug/);
  assert.throws(() => assertProductionCertificateEvidence({
    subject: "CN=Other Bali",
    validFrom: "2020-01-01T00:00:00Z",
    validTo: "2021-01-01T00:00:00Z",
    fingerprint256: play,
  }, "certificate"), /not currently valid/);
});
