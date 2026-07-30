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
  assert.match(
    appSource,
    /if \(privacyDeletionActive\.current \|\| controller\.signal\.aborted\) return;/,
    "an acknowledgement racing with privacy deletion must not recreate the pending queue",
  );
});

test("Trip notes persist while typing and queued replacements are coalesced", () => {
  assert.match(
    appSource,
    /aria-label=\{`Note for \$\{resolveStop\(stop\.entityType, stop\.entityId\)\}`\}[\s\S]{0,280}?onChange=\{\(event\) => onSaveNote\(/,
    "Trip note editing must persist on change because Android Back can hide the keyboard without blurring",
  );
  assert.match(
    appSource,
    /enqueuePendingSyncMutation\(pendingSyncRef\.current, next\)/,
    "rapid Trip edits must use the coalescing queue helper",
  );
  assert.match(
    appSource,
    /const pending = enqueuePendingSyncMutation\(pendingSyncRef\.current, next\);[\s\S]{0,100}?pendingSyncRef\.current = pending;[\s\S]{0,120}?await writePendingSync\(pending\)/,
    "enqueue must reserve the in-memory queue before awaiting its durable write",
  );
  assert.match(
    appSource,
    /const nextPending = \[\.\.\.remaining, \.\.\.appended\];[\s\S]{0,100}?pendingSyncRef\.current = nextPending;[\s\S]{0,160}?writePendingSync\(nextPending\)/,
    "sync acknowledgements must reserve their merged queue before awaiting persistence",
  );
  assert.match(
    appSource,
    /const next = typeof update === "function"[\s\S]{0,120}?update\(tripRef\.current\)[\s\S]{0,220}?tripRef\.current = next;[\s\S]{0,180}?const storageWrite = writeTrip\(next\)/,
    "Trip transforms must reserve the latest in-memory snapshot and durable write before awaiting",
  );
  assert.match(
    appSource,
    /const storageWrite = writeTrip\(next\);[\s\S]{0,260}?const syncWrite = queueMutation\(\{[\s\S]{0,140}?operation: "trip_replace"[\s\S]{0,220}?Promise\.all\(\[storageWrite, syncWrite\]\)/,
    "the latest Trip snapshot and its sync replacement must be crash-durably reserved together",
  );
  assert.doesNotMatch(
    appSource,
    /persistTrip\(transform\(trip\)\)/,
    "Trip edits must not derive from stale render state",
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

test("privacy deletion is confirmed remotely before local personal state is cleared", () => {
  const start = appSource.indexOf("async function deleteSyncedAndLocalPersonalData");
  const end = appSource.indexOf("\n  if (!storageReady)", start);
  assert.ok(start >= 0 && end > start);
  const handler = appSource.slice(start, end);
  const blockWrites = handler.indexOf("personalWriteBarrier.block()");
  const persistPendingQuarantine = handler.indexOf(
    'await writePrivacyDeletionQuarantine("pending_server")',
  );
  const settleWrites = handler.indexOf("await personalWriteBarrier.waitForSettled()");
  const remoteDelete = handler.indexOf("await requestSyncedDataDeletion()");
  const persistConfirmedQuarantine = handler.indexOf(
    'await writePrivacyDeletionQuarantine("server_confirmed")',
  );
  const queueQuarantine = handler.indexOf("quarantinePersonalStateInMemory()");
  const localDelete = handler.indexOf("await clearMobilePersonalData()");
  const identityDelete = handler.indexOf("await deleteGuestIdentity()");
  const clearDurableQuarantine = handler.indexOf("await clearPrivacyDeletionQuarantine()");
  const identityRotate = handler.indexOf("await getOrCreateGuestIdentity()", identityDelete);
  assert.ok(blockWrites >= 0);
  assert.ok(persistPendingQuarantine > blockWrites);
  assert.ok(settleWrites > persistPendingQuarantine);
  assert.ok(remoteDelete > settleWrites);
  assert.ok(persistConfirmedQuarantine > remoteDelete);
  assert.ok(queueQuarantine > persistConfirmedQuarantine);
  assert.ok(localDelete > queueQuarantine);
  assert.ok(identityDelete > localDelete);
  assert.ok(identityRotate > identityDelete);
  assert.ok(clearDurableQuarantine > identityRotate);
  assert.match(handler, /serverDeletionConfirmed\s*=\s*true/);
  assert.match(handler, /Synced data could not be deleted\. Nothing on this device was cleared\./);
  const quarantineStart = appSource.indexOf("function quarantinePersonalStateInMemory");
  assert.ok(quarantineStart >= 0 && quarantineStart < start);
  const quarantine = appSource.slice(quarantineStart, start);
  assert.match(quarantine, /pendingSyncRef\.current = \[\]/);
  assert.match(quarantine, /setSavedVenueIds\(\[\]\)/);
  assert.match(quarantine, /setTodayVenueIds\(\[\]\)/);
  assert.match(quarantine, /setTrip\(null\)/);
  assert.match(quarantine, /setPendingSyncCount\(0\)/);
  assert.match(quarantine, /feedSessionIdRef\.current = crypto\.randomUUID\(\)/);
  assert.match(
    handler,
    /finally \{[\s\S]{0,100}?if \(serverDeletionConfirmed\) quarantinePersonalStateInMemory\(\)/,
    "late pre-deletion writes must be re-quarantined after fallible cleanup settles",
  );
  assert.match(
    handler,
    /if \(safeRollbackConfirmed \|\| localCleanupConfirmed\)/,
    "a partial post-server cleanup must keep sync and personal writes quarantined",
  );
  assert.match(
    handler,
    /if \(safeRollbackConfirmed \|\| localCleanupConfirmed\) \{[\s\S]{0,220}?personalWriteBarrier\.release\(deletionWriteGeneration\)/,
    "personal writes may resume only after a safe failure or complete local cleanup",
  );
  assert.match(
    handler,
    /if \(!serverDeletionConfirmed && !alreadyQuarantined\) \{[\s\S]{0,180}?await clearPrivacyDeletionQuarantine\(\)[\s\S]{0,180}?safeRollbackConfirmed = true/,
    "an initial pre-server failure may resume only after the durable marker is cleared",
  );
  assert.match(handler, /storageMutationActive\.current = true/);
  assert.match(handler, /Sync and personal changes are paused/);
});

test("all durable personal navigation writes participate in the deletion barrier", () => {
  assert.match(
    appSource,
    /const trackPersonalStorageWrite = useCallback[\s\S]{0,220}?personalWriteBarrier\.run/,
  );
  assert.match(
    appSource,
    /function chooseSurface[\s\S]{0,700}?trackPersonalStorageWrite\(\(\) => writeNavigationState\(navigation\)\)/,
  );
  assert.match(
    appSource,
    /function changeDiscoveryIndex[\s\S]{0,1500}?trackPersonalStorageWrite\(\(\) => writeFeedResumeSnapshot\(resume\)\)[\s\S]{0,500}?trackPersonalStorageWrite\(\(\) => writeNavigationState/,
  );
  assert.match(
    appSource,
    /async function goNow[\s\S]{0,1800}?personalWriteBarrier\.run[\s\S]{0,300}?writeNavigationSession\(session\)/,
  );
  assert.match(
    appSource,
    /function completeNavigationSession[\s\S]{0,600}?personalWriteBarrier\.run[\s\S]{0,220}?writeNavigationSession\(completed\)/,
  );
});

test("My Bali exposes a two-step deletion action and names all removed plan state", () => {
  assert.match(appSource, /Privacy & device data/);
  assert.match(appSource, />\s*Delete synced data\s*</);
  assert.match(appSource, /role="alertdialog"/);
  assert.match(appSource, /"Confirm deletion"/);
  assert.match(
    appSource,
    /Saved places, Today, Trip, notes, visited states and pending sync changes/,
  );
  assert.match(
    appSource,
    /if \(privacyDeletionActive\.current\)[\s\S]{0,180}?before saving new personal changes/,
  );
  assert.match(
    appSource,
    /async function addToToday[\s\S]{0,180}?if \(privacyDeletionActive\.current\)/,
  );
  assert.match(
    appSource,
    /async function persistTrip[\s\S]{0,180}?if \(privacyDeletionActive\.current\)/,
  );
});

test("My Bali exposes the current anonymous support reference with a Copy action", () => {
  assert.match(appSource, /Anonymous Guest Reference/);
  assert.match(appSource, /<code>\{guestReference\}<\/code>/);
  assert.match(appSource, /onClick=\{\(\) => void copyGuestReference\(\)\}/);
  assert.match(appSource, /Share this code with support when asking us to locate synced data/);
  assert.match(appSource, /Save it before uninstalling if you may need help later/);
  assert.match(
    appSource,
    /if \(!storageReady \|\| privacyDeletionQuarantinePhase\) return;[\s\S]{0,180}?getOrCreateGuestIdentity\(\)/,
  );
});

test("relaunch detects durable privacy quarantine before enabling personal state", () => {
  const hydrationStart = appSource.indexOf("void hydrateMobileStorage()");
  const hydrationEnd = appSource.indexOf("\n  useEffect(() => {", hydrationStart + 1);
  assert.ok(hydrationStart >= 0 && hydrationEnd > hydrationStart);
  const hydration = appSource.slice(hydrationStart, hydrationEnd);
  const markerRead = hydration.indexOf("state.privacyDeletionQuarantine");
  const blockWrites = hydration.indexOf("personalWriteBarrier.block()");
  const storageReady = hydration.indexOf("setStorageReady(true)");
  assert.ok(markerRead >= 0);
  assert.ok(blockWrites > markerRead);
  assert.ok(storageReady > blockWrites);
  assert.match(hydration, /privacyDeletionActive\.current = true/);
  assert.match(hydration, /storageMutationActive\.current = true/);
  assert.match(hydration, /setPrivacyDeleteConfirming\(true\)/);
  assert.match(hydration, /surface: "saved" as const/);
  assert.match(appSource, /privacyDeletionQuarantinePhase[\s\S]{0,180}?Retry cleanup/);
});
