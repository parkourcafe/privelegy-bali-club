import assert from "node:assert/strict";
import test from "node:test";
import { structuralVerdicts } from "./check-rewrite.mjs";

const result = { label: "components/menu/MenuItem.tsx", structural: ["<JSX>: 3 unit(s) before, 2 after"] };

test("a unit that appears or disappears fails the gate by default", () => {
  assert.deepEqual(structuralVerdicts(result, []), { unaccepted: ["<JSX>: 3 unit(s) before, 2 after"], accepted: [] });
});

test("a structural change passes only when the run names its file or path", () => {
  assert.equal(structuralVerdicts(result, ["components/menu/MenuItem.tsx"]).unaccepted.length, 0);
  assert.equal(structuralVerdicts(result, ["components/menu/MenuItem.tsx:<JSX>"]).unaccepted.length, 0);
  assert.equal(structuralVerdicts(result, ["components/menu/Other.tsx"]).unaccepted.length, 1);
  assert.equal(structuralVerdicts(result, ["components/menu/MenuItem.tsx:GUIDES"]).unaccepted.length, 1);
});
