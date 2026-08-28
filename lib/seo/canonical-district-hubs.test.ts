import assert from "node:assert/strict";
import test from "node:test";
import { canonicalProgrammaticDistrictHubs } from "./canonical-district-hubs";

test("keeps real programmatic hubs and removes districts with canonical editorial roots", () => {
  const hubs = canonicalProgrammaticDistrictHubs([
    { slug: "kuta-legian", name: "Kuta & Legian" },
    { slug: "munduk", name: "Munduk" },
    { slug: "lovina", name: "Lovina" },
    { slug: "sidemen", name: "Sidemen" },
  ]);

  assert.deepEqual(hubs.map((hub) => hub.slug), ["kuta-legian"]);
});
