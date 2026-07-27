import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const appSource = readFileSync(
  new URL("../src/App.tsx", import.meta.url),
  "utf8",
);

test("mobile application settles acknowledged sync responses before removing queued mutations", () => {
  assert.match(
    appSource,
    /import\s*\{[\s\S]*?\bflushPendingSyncQueue\b[\s\S]*?\}\s*from\s*["']\.\/sync-runtime["']/,
    "App must import the acknowledgement-aware queue flusher",
  );
  assert.match(
    appSource,
    /flushPendingSyncQueue\s*\(\s*pendingSyncRef\.current\s*,/,
    "App must pass its durable pending queue through the acknowledgement-aware flusher",
  );
  assert.doesNotMatch(
    appSource,
    /await\s+pushSyncMutation\([\s\S]{0,400}?pendingSyncRef\.current\.filter\(/,
    "App must not delete a mutation merely because the sync request returned",
  );
});
