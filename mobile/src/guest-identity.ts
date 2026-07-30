import { Preferences } from "@capacitor/preferences";

export const GUEST_IDENTITY_KEY = "otherbali.mobile.guest-identity.v1";
export const GUEST_IDENTITY_PATTERN = /^g_[A-Za-z0-9_-]{16}$/;

export interface GuestIdentityStore {
  get(options: { key: string }): Promise<{ value: string | null }>;
  set(options: { key: string; value: string }): Promise<void>;
  remove(options: { key: string }): Promise<void>;
}

export interface GuestIdentityOptions {
  preferences?: GuestIdentityStore;
  randomValues?: (bytes: Uint8Array) => Uint8Array;
}

interface GuestIdentityCoordinator {
  generation: number;
  deletingGeneration: number | null;
  tail: Promise<void>;
  activeGet: { generation: number; request: Promise<string> } | null;
}

const identityCoordinators = new WeakMap<GuestIdentityStore, GuestIdentityCoordinator>();

function coordinatorFor(preferences: GuestIdentityStore): GuestIdentityCoordinator {
  const existing = identityCoordinators.get(preferences);
  if (existing) return existing;
  const coordinator: GuestIdentityCoordinator = {
    generation: 0,
    deletingGeneration: null,
    tail: Promise.resolve(),
    activeGet: null,
  };
  identityCoordinators.set(preferences, coordinator);
  return coordinator;
}

function enqueueIdentityOperation<T>(
  coordinator: GuestIdentityCoordinator,
  operation: () => Promise<T>,
): Promise<T> {
  const result = coordinator.tail.catch(() => {}).then(operation);
  coordinator.tail = result.then(() => undefined, () => undefined);
  return result;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

export function createGuestIdentity(
  randomValues: (bytes: Uint8Array) => Uint8Array = (bytes) => crypto.getRandomValues(bytes),
): string {
  const bytes = randomValues(new Uint8Array(12));
  if (!(bytes instanceof Uint8Array) || bytes.byteLength !== 12) {
    throw new Error("Guest identity requires exactly 12 random bytes");
  }
  const identity = `g_${base64Url(bytes)}`;
  if (!GUEST_IDENTITY_PATTERN.test(identity)) {
    throw new Error("Guest identity generation failed");
  }
  return identity;
}

export async function getOrCreateGuestIdentity(
  options: GuestIdentityOptions = {},
): Promise<string> {
  const preferences = options.preferences ?? Preferences;
  const coordinator = coordinatorFor(preferences);
  if (coordinator.deletingGeneration !== null) {
    throw new Error("guest_identity_deletion_in_progress");
  }
  const generation = coordinator.generation;
  if (coordinator.activeGet?.generation === generation) {
    return await coordinator.activeGet.request;
  }

  const request = enqueueIdentityOperation(coordinator, async () => {
    const stored = await preferences.get({ key: GUEST_IDENTITY_KEY });
    if (coordinator.generation !== generation) {
      throw new Error("guest_identity_request_invalidated");
    }
    if (stored.value && GUEST_IDENTITY_PATTERN.test(stored.value)) return stored.value;

    const identity = createGuestIdentity(options.randomValues);
    await preferences.set({ key: GUEST_IDENTITY_KEY, value: identity });
    if (coordinator.generation !== generation) {
      throw new Error("guest_identity_request_invalidated");
    }
    return identity;
  });
  coordinator.activeGet = { generation, request };

  try {
    return await request;
  } finally {
    if (coordinator.activeGet?.request === request) coordinator.activeGet = null;
  }
}

export async function deleteGuestIdentity(
  options: Pick<GuestIdentityOptions, "preferences"> = {},
): Promise<void> {
  const preferences = options.preferences ?? Preferences;
  const coordinator = coordinatorFor(preferences);
  const deletionGeneration = coordinator.generation + 1;
  coordinator.generation = deletionGeneration;
  coordinator.deletingGeneration = deletionGeneration;
  coordinator.activeGet = null;
  try {
    await enqueueIdentityOperation(coordinator, async () => {
      await preferences.remove({ key: GUEST_IDENTITY_KEY });
    });
  } finally {
    if (coordinator.deletingGeneration === deletionGeneration) {
      coordinator.deletingGeneration = null;
    }
  }
}
