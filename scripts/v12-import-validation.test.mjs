import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { candidateDigest, validateV12Import } from "./v12-import-validation.mjs";

const fixture = JSON.parse(await readFile(new URL("../data/fixtures/v12-import-valid.json", import.meta.url), "utf8"));
const clone = () => structuredClone(fixture);

test("valid fixture is dry-run ready and performs no writes", () => {
  const result = validateV12Import(clone());
  assert.equal(result.ERROR_STATUS, "PASS");
  assert.equal(result.IMPORT_STATUS, "READY_FOR_OWNER_APPROVAL");
  assert.equal(result.writesPerformed, false);
});

for (const [name, errorClass, mutate] of [
  ["missing source", "source_errors", (row) => { row.places[0].sourceUrl = null; }],
  ["broken action", "action_link_errors", (row) => { row.places[0].actions[0].url = "javascript:bad"; }],
  ["wrong action target", "action_link_errors", (row) => { row.places[0].actions[0].placeId = "other"; }],
  ["invalid coordinates", "coordinate_errors", (row) => { row.places[0].latitude = 999; }],
  ["unknown media rights", "media_errors", (row) => { row.places[0].media[0].rightsStatus = "unknown"; }],
  ["unsupported taxonomy", "schema_errors", (row) => { row.places[0].category = "mystery"; }],
  ["conflicting field values", "evidence_conflicts", (row) => {
    row.places[0].evidence.push({ ...row.places[0].evidence[0], value: "different" });
  }],
]) {
  test(name, () => {
    const candidate = clone();
    mutate(candidate);
    assert.ok(validateV12Import(candidate).errors[errorClass].length);
  });
}

test("probable duplicate is blocked but different district branches are distinct", () => {
  const duplicate = clone();
  duplicate.places[0].id = "candidate";
  const existing = { id: "existing", name: "Fixture Café", district: "canggu" };
  assert.ok(validateV12Import(duplicate, { existingPlaces: [existing] }).errors.duplicate_errors.length);

  existing.district = "ubud";
  assert.equal(validateV12Import(duplicate, { existingPlaces: [existing] }).errors.duplicate_errors.length, 0);
});

test("idempotent rerun accepts identical bytes and rejects key reuse with changed bytes", () => {
  const candidate = clone();
  const digest = candidateDigest(candidate);
  const repeated = validateV12Import(candidate, { importLedger: { [candidate.idempotencyKey]: digest } });
  assert.equal(repeated.ERROR_STATUS, "PASS_WITH_WARNINGS");
  assert.match(repeated.warnings[0].message, /idempotent rerun/);

  const changed = clone();
  changed.places[0].name = "Changed";
  assert.ok(validateV12Import(changed, { importLedger: { [candidate.idempotencyKey]: digest } }).errors.import_conflicts.length);
});
