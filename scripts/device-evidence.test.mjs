import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const evidence = JSON.parse(await readFile(new URL("../docs/release/device-matrix.json", import.meta.url), "utf8"));

test("device matrix records exact debug and signed-device evidence", async () => {
  assert.equal(evidence.schemaVersion, 2);
  assert.match(evidence.release.commit, /^[a-f0-9]{40}$/);
  const debug = evidence.preliminaryDebugEvidence;
  assert.equal(debug.status, "passed-debug-only");
  assert.equal(debug.device.serialStored, false);
  assert.equal(debug.installation.cleanInstall, false);
  assert.equal(debug.installation.installedHashMatchedSourceApk, true);
  assert.match(debug.artifact.sha256, /^[a-f0-9]{64}$/);
  assert.equal(debug.artifact.signing.class, "android-debug");
  assert.ok(Object.values(debug.cases).every((status) => status === "passed"));
  assert.match(debug.limitation, /not store-signing or clean-install evidence/i);
  const signedEvidence = evidence.requiredSignedEvidence;
  const passedEntries = Object.entries(signedEvidence).filter(([, entry]) => entry.status === "passed");
  assert.deepEqual(passedEntries.map(([key]) => key), ["samsungRustoreApk"]);

  for (const [key, entry] of Object.entries(signedEvidence)) {
    assert.equal(entry.requiresCleanInstall, true);
    assert.match(entry.artifact.releaseEvidenceKey, /^(ios|googlePlay|ruStore)$/);
    assert.equal(entry.device.serialStored, false);

    if (key === "samsungRustoreApk") {
      assert.equal(entry.status, "passed");
      assert.match(entry.artifact.releaseArtifactSha256, /^[a-f0-9]{64}$/);
      assert.equal(entry.artifact.installedArtifactSha256, entry.artifact.releaseArtifactSha256);
      assert.equal(entry.artifact.sourceCommit, evidence.release.commit);
      assert.match(entry.artifact.signingCertificateSha256, /^[a-f0-9]{64}$/);
      assert.equal(entry.device.os, "Android 16");
      assert.match(entry.testedAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
      assert.ok(Object.values(entry.cases).every((status) => status === "passed"));
      assert.ok(entry.evidencePointers.length > 0);
      for (const pointer of entry.evidencePointers) {
        assert.match(pointer, /^docs\/release\/evidence\//);
        await access(new URL(`../${pointer}`, import.meta.url));
      }
      continue;
    }

    assert.equal(entry.status, "pending");
    assert.equal(entry.artifact.releaseArtifactSha256, null);
    assert.equal(entry.artifact.sourceCommit, null);
    assert.equal(entry.testedAt, null);
    assert.ok(Object.values(entry.cases).every((status) => status === "pending"));
    assert.deepEqual(entry.evidencePointers, []);
  }
});
