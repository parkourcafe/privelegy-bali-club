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

test("place sync mutations use the canonical venue slug rather than the local feed id", () => {
  assert.match(
    appSource,
    /const syncId = snapshot\.venue\.slug;[\s\S]{0,1200}?entityType: "saved",[\s\S]{0,120}?entityId: syncId,[\s\S]{0,180}?entityId: syncId/,
    "saved-place sync must use the venue slug expected by the server contract",
  );
  assert.match(
    appSource,
    /async function addToToday[\s\S]{0,900}?entityType: "trip_stop",[\s\S]{0,120}?entityId: snapshot\.venue\.slug/,
    "Today sync must use the venue slug expected by the server contract",
  );
});
