import assert from "node:assert/strict";
import test from "node:test";

import { exactReleaseSchemaProbe } from "./release-schema-probe";

test("release schema probe accepts only an exact object revision", () => {
  assert.equal(exactReleaseSchemaProbe({ ok: true, version: 2, schemaRevision: "0041" }, 2, "0041"), true);
  for (const value of [
    true,
    null,
    { ok: true },
    { ok: true, version: 1, schemaRevision: "0041" },
    { ok: true, version: 2, schemaRevision: "0040" },
    { ok: false, version: 2, schemaRevision: "0041" },
  ]) {
    assert.equal(exactReleaseSchemaProbe(value, 2, "0041"), false);
  }
});
