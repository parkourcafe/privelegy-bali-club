import assert from "node:assert/strict";
import test from "node:test";
import { PersonalWriteBarrier } from "../src/personal-write-barrier";

test("deletion waits for an old write and prevents its stale continuation from reappearing", async () => {
  const barrier = new PersonalWriteBarrier();
  let releaseOldWrite!: () => void;
  const oldWrite = new Promise<void>((resolve) => {
    releaseOldWrite = resolve;
  });
  const localState: string[] = [];
  const pendingState: string[] = [];

  const operation = barrier.run(async (generation) => {
    await oldWrite;
    if (!barrier.isCurrent(generation)) return;
    localState.push("old-today-item");
    const queued = barrier.run(async () => {
      pendingState.push("old-sync-mutation");
    });
    if (queued) await queued;
  });
  assert.ok(operation);

  const deletionGeneration = barrier.block();
  let barrierSettled = false;
  const waiting = barrier.waitForSettled().then(() => {
    barrierSettled = true;
  });
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(barrierSettled, false, "deletion must wait for the already-started write");

  releaseOldWrite();
  await waiting;
  assert.equal(localState.length, 0);
  assert.equal(pendingState.length, 0);
  assert.equal(barrier.blocked, true);

  barrier.release(deletionGeneration);
  assert.equal(barrier.blocked, false);
  await barrier.run(async () => {
    localState.push("new-post-deletion-item");
  });
  assert.deepEqual(localState, ["new-post-deletion-item"]);
});

test("a blocked barrier rejects new personal writes until the matching generation releases", async () => {
  const barrier = new PersonalWriteBarrier();
  const firstGeneration = barrier.block();
  assert.equal(barrier.run(async () => undefined), null);
  const newerGeneration = barrier.block();
  barrier.release(firstGeneration);
  assert.equal(barrier.blocked, true);
  barrier.release(newerGeneration);
  assert.equal(barrier.blocked, false);
});
