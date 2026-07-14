import assert from "node:assert/strict";
import test from "node:test";
import { parseMobileDeepLink } from "../src/deep-links";
import {
  startDeepLinkMonitoring,
  type MobileNativeBridge,
} from "../src/native-runtime";

function bridge(overrides: Partial<MobileNativeBridge> = {}): MobileNativeBridge {
  return {
    isNative: () => true,
    getLaunchUrl: async () => null,
    addAppUrlListener: async () => ({ remove: async () => undefined }),
    getNetworkConnected: async () => true,
    addNetworkListener: async () => ({ remove: async () => undefined }),
    launchUrl: async () => true,
    openBrowser: async () => undefined,
    canShare: async () => true,
    share: async () => undefined,
    ...overrides,
  };
}

test("deep-link parser accepts only exact canonical place and route URLs", () => {
  assert.deepEqual(
    parseMobileDeepLink("https://www.otherbali.com/places/sample-cafe"),
    { kind: "place", slug: "sample-cafe" },
  );
  assert.deepEqual(
    parseMobileDeepLink("https://www.otherbali.com/route/quiet-ubud"),
    { kind: "route", slug: "quiet-ubud" },
  );

  for (const candidate of [
    "https://otherbali.com/places/sample-cafe",
    "https://www.otherbali.com.evil.invalid/places/sample-cafe",
    "https://user@www.otherbali.com/places/sample-cafe",
    "https://www.otherbali.com:444/places/sample-cafe",
    "https://www.otherbali.com/places/sample-cafe/",
    "https://www.otherbali.com/places/Sample-Cafe",
    "https://www.otherbali.com/places/sample-cafe?utm_source=test",
    "https://www.otherbali.com/route/quiet-ubud#stop-1",
    "https://www.otherbali.com/privacy",
  ]) {
    assert.equal(parseMobileDeepLink(candidate), null, candidate);
  }
});

test("native lifecycle registers warm listener before resolving the cold launch URL", async () => {
  const calls: string[] = [];
  const targets: unknown[] = [];
  let warmListener: ((url: string) => void) | null = null;
  const handle = await startDeepLinkMonitoring(
    (url) => targets.push(parseMobileDeepLink(url)),
    bridge({
      async addAppUrlListener(listener) {
        calls.push("listener_registered");
        warmListener = listener;
        return { remove: async () => { calls.push("listener_removed"); } };
      },
      async getLaunchUrl() {
        calls.push("cold_requested");
        return "https://www.otherbali.com/places/sample-cafe";
      },
    }),
  );

  assert.deepEqual(calls, ["listener_registered", "cold_requested"]);
  assert.deepEqual(targets, [{ kind: "place", slug: "sample-cafe" }]);
  assert.ok(warmListener);
  (warmListener as (url: string) => void)("https://www.otherbali.com/route/quiet-ubud");
  assert.deepEqual(targets[1], { kind: "route", slug: "quiet-ubud" });
  await handle?.remove();
  assert.equal(calls.at(-1), "listener_removed");
});

test("web runtime does not claim native universal-link handling", async () => {
  let listenerRegistered = false;
  const handle = await startDeepLinkMonitoring(
    () => undefined,
    bridge({
      isNative: () => false,
      async addAppUrlListener() {
        listenerRegistered = true;
        return { remove: async () => undefined };
      },
    }),
  );
  assert.equal(handle, null);
  assert.equal(listenerRegistered, false);
});
