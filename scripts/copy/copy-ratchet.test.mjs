import assert from "node:assert/strict";
import test from "node:test";
import { compare, measure, readBaseline } from "./ratchet.mjs";

test("no code file or resort page has more machine-pattern hits than the recorded baseline", async () => {
  const problems = compare(await readBaseline(), await measure());
  assert.deepEqual(problems, [], `copy regressed against scripts/copy/baseline.json:\n${problems.join("\n")}`);
});

test("the ratchet rejects a new FAIL and a denser WARN, and lets cleaner text in", () => {
  const baseline = { "lib/guides.ts": { words: 1000, fails: { H1: 2 }, warns: 20 } };
  assert.deepEqual(compare(baseline, { "lib/guides.ts": { words: 1000, fails: { H1: 2 }, warns: 20 } }), []);
  assert.match(compare(baseline, { "lib/guides.ts": { words: 1000, fails: { H1: 3 }, warns: 20 } })[0], /H1 FAIL 2 → 3/);
  assert.match(compare(baseline, { "lib/guides.ts": { words: 1000, fails: { H1: 2, R2: 1 } , warns: 20 } })[0], /R2 FAIL 0 → 1/);
  assert.match(compare(baseline, { "lib/guides.ts": { words: 1010, fails: { H1: 2 }, warns: 25 } })[0], /WARN 20 → 25/);
  // 200 clean words with one WARN lower the density, so they pass without a baseline update.
  assert.deepEqual(compare(baseline, { "lib/guides.ts": { words: 1200, fails: { H1: 2 }, warns: 21 } }), []);
  assert.match(compare(baseline, { "lib/new-page.ts": { words: 50, fails: { S1: 1 }, warns: 0 } })[0], /new file with FAIL/);
  assert.deepEqual(compare(baseline, { "lib/new-page.ts": { words: 50, fails: {}, warns: 3 } }), []);
});
