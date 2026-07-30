import assert from "node:assert/strict";
import test from "node:test";
import {
  GUEST_IDENTITY_KEY,
  GUEST_IDENTITY_PATTERN,
  createGuestIdentity,
  deleteGuestIdentity,
  getOrCreateGuestIdentity,
  type GuestIdentityStore,
} from "../src/guest-identity";

class MemoryIdentityStore implements GuestIdentityStore {
  readonly values = new Map<string, string>();
  writes = 0;

  async get({ key }: { key: string }) {
    return { value: this.values.get(key) ?? null };
  }

  async set({ key, value }: { key: string; value: string }) {
    this.writes += 1;
    this.values.set(key, value);
  }

  async remove({ key }: { key: string }) {
    this.values.delete(key);
  }
}

class DeferredSetIdentityStore extends MemoryIdentityStore {
  readonly setStarted: Promise<void>;
  private markSetStarted!: () => void;
  private finishSet!: () => void;
  private readonly setGate: Promise<void>;

  constructor() {
    super();
    this.setStarted = new Promise<void>((resolve) => {
      this.markSetStarted = resolve;
    });
    this.setGate = new Promise<void>((resolve) => {
      this.finishSet = resolve;
    });
  }

  releaseSet() {
    this.finishSet();
  }

  override async set({ key, value }: { key: string; value: string }) {
    this.writes += 1;
    this.markSetStarted();
    await this.setGate;
    this.values.set(key, value);
  }
}

function deterministicBytes(offset = 0) {
  return (bytes: Uint8Array) => {
    bytes.forEach((_value, index) => {
      bytes[index] = (index + offset) % 256;
    });
    return bytes;
  };
}

test("guest identity uses exactly 12 random bytes and 16 base64url characters", () => {
  const identity = createGuestIdentity(deterministicBytes());
  assert.equal(identity, "g_AAECAwQFBgcICQoL");
  assert.match(identity, GUEST_IDENTITY_PATTERN);
  assert.equal(identity.length, 18);
});

test("guest identity is durable and concurrent callers share one persisted value", async () => {
  const preferences = new MemoryIdentityStore();
  const options = { preferences, randomValues: deterministicBytes(10) };

  const [first, second] = await Promise.all([
    getOrCreateGuestIdentity(options),
    getOrCreateGuestIdentity(options),
  ]);
  assert.equal(first, second);
  assert.equal(preferences.writes, 1);
  assert.equal(preferences.values.get(GUEST_IDENTITY_KEY), first);
  assert.equal(await getOrCreateGuestIdentity({
    preferences,
    randomValues: deterministicBytes(200),
  }), first);
});

test("deleting the guest identity rotates the next credential", async () => {
  const preferences = new MemoryIdentityStore();
  const first = await getOrCreateGuestIdentity({
    preferences,
    randomValues: deterministicBytes(),
  });
  await deleteGuestIdentity({ preferences });
  assert.equal(preferences.values.has(GUEST_IDENTITY_KEY), false);

  const next = await getOrCreateGuestIdentity({
    preferences,
    randomValues: deterministicBytes(1),
  });
  assert.notEqual(next, first);
  assert.match(next, GUEST_IDENTITY_PATTERN);
});

test("a concurrent delete waits for an in-flight set and prevents the old identity from resurrecting", async () => {
  const preferences = new DeferredSetIdentityStore();
  const oldIdentityRequest = getOrCreateGuestIdentity({
    preferences,
    randomValues: deterministicBytes(),
  });
  await preferences.setStarted;

  let deletionSettled = false;
  const deletion = deleteGuestIdentity({ preferences }).then(() => {
    deletionSettled = true;
  });
  await assert.rejects(
    getOrCreateGuestIdentity({
      preferences,
      randomValues: deterministicBytes(1),
    }),
    /guest_identity_deletion_in_progress/,
    "a caller arriving after deletion starts must not queue a replacement identity behind remove",
  );
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.equal(deletionSettled, false, "delete must serialize behind the in-flight identity write");

  preferences.releaseSet();
  await assert.rejects(oldIdentityRequest, /guest_identity_request_invalidated/);
  await deletion;
  assert.equal(preferences.values.has(GUEST_IDENTITY_KEY), false);

  const replacement = await getOrCreateGuestIdentity({
    preferences,
    randomValues: deterministicBytes(1),
  });
  assert.equal(replacement, "g_AQIDBAUGBwgJCgsM");
  assert.notEqual(replacement, "g_AAECAwQFBgcICQoL");
});

test("an invalid stored value is never used as a transport credential", async () => {
  const preferences = new MemoryIdentityStore();
  preferences.values.set(GUEST_IDENTITY_KEY, "guest-from-a-cookie");
  const identity = await getOrCreateGuestIdentity({
    preferences,
    randomValues: deterministicBytes(),
  });
  assert.equal(identity, "g_AAECAwQFBgcICQoL");
});
