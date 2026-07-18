import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const evidence = JSON.parse(await readFile(new URL("../docs/release/device-matrix.json", import.meta.url), "utf8"));

test("device matrix records exact debug evidence without claiming signed release QA", () => {
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
  for (const entry of Object.values(evidence.requiredSignedEvidence)) {
    assert.equal(entry.status, "pending");
    assert.equal(entry.requiresCleanInstall, true);
    assert.match(entry.artifact.releaseEvidenceKey, /^(ios|googlePlay|ruStore)$/);
    assert.equal(entry.artifact.releaseArtifactSha256, null);
    assert.equal(entry.artifact.sourceCommit, null);
    assert.equal(entry.device.serialStored, false);
    assert.equal(entry.testedAt, null);
    assert.ok(Object.values(entry.cases).every((status) => status === "pending"));
    assert.deepEqual(entry.evidencePointers, []);
  }
});
