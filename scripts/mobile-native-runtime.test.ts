import assert from "node:assert/strict";
import test from "node:test";
import {
  exitMobileApp,
  openControlledExternal,
  shareMobileTarget,
  startBackButtonMonitoring,
  startNetworkMonitoring,
  type MobileNativeBridge,
} from "../mobile/src/native-runtime";

function bridge(overrides: Partial<MobileNativeBridge> = {}): MobileNativeBridge {
  return {
    isNative: () => true,
    isAndroid: () => true,
    getLaunchUrl: async () => null,
    addAppUrlListener: async () => ({ remove: async () => undefined }),
    addBackButtonListener: async () => ({ remove: async () => undefined }),
    exitApp: async () => undefined,
    getNetworkConnected: async () => true,
    addNetworkListener: async () => ({ remove: async () => undefined }),
    launchUrl: async () => true,
    openBrowser: async () => undefined,
    canShare: async () => true,
    share: async () => undefined,
    ...overrides,
  };
}

test("native external handoff validates first, persists state, and keeps exact Maps URL", async () => {
  const calls: string[] = [];
  const exactUrl = "https://www.google.com/maps/place/Sample+Cafe";
  const runtime = bridge({
    async launchUrl(url) {
      calls.push(`launch:${url}`);
      return true;
    },
    async openBrowser(url) {
      calls.push(`browser:${url}`);
    },
  });

  assert.equal(await openControlledExternal(exactUrl, "google_maps", {
    beforeOpen: async () => { calls.push("persist"); },
  }, runtime), true);
  assert.deepEqual(calls, ["persist", `launch:${exactUrl}`]);

  calls.length = 0;
  assert.equal(await openControlledExternal(
    "https://www.google.com.evil.invalid/maps/place/Sample",
    "google_maps",
    { beforeOpen: async () => { calls.push("persist"); } },
    runtime,
  ), false);
  assert.deepEqual(calls, []);
});

test("native handoff falls back from AppLauncher to Browser without changing the URL", async () => {
  const calls: string[] = [];
  const exactUrl = "https://maps.app.goo.gl/abc123";
  const opened = await openControlledExternal(exactUrl, "google_maps", {
    beforeOpen: async () => { calls.push("persist"); },
  }, bridge({
    async launchUrl(url) {
      calls.push(`launch:${url}`);
      return false;
    },
    async openBrowser(url) {
      calls.push(`browser:${url}`);
    },
  }));
  assert.equal(opened, true);
  assert.deepEqual(calls, ["persist", `launch:${exactUrl}`, `browser:${exactUrl}`]);
});

test("official sites use Browser and remain restricted by a caller allowlist", async () => {
  const calls: string[] = [];
  const runtime = bridge({
    async launchUrl(url) { calls.push(`launch:${url}`); return true; },
    async openBrowser(url) { calls.push(`browser:${url}`); },
  });
  assert.equal(await openControlledExternal("https://www.otherbali.com/privacy", "official_website", {
    allowedHosts: ["www.otherbali.com"],
    beforeOpen: async () => { calls.push("persist"); },
  }, runtime), true);
  assert.deepEqual(calls, ["persist", "browser:https://www.otherbali.com/privacy"]);

  calls.length = 0;
  assert.equal(await openControlledExternal("https://lookalike.invalid/privacy", "official_website", {
    allowedHosts: ["www.otherbali.com"],
    beforeOpen: async () => { calls.push("persist"); },
  }, runtime), false);
  assert.deepEqual(calls, []);
});

test("network monitor registers before reading current status and cleans up", async () => {
  const calls: string[] = [];
  const statuses: boolean[] = [];
  let listener: ((connected: boolean) => void) | null = null;
  const handle = await startNetworkMonitoring((connected) => statuses.push(connected), bridge({
    async addNetworkListener(next) {
      calls.push("listener_registered");
      listener = next;
      return { remove: async () => { calls.push("listener_removed"); } };
    },
    async getNetworkConnected() {
      calls.push("status_requested");
      return false;
    },
  }));
  assert.deepEqual(calls, ["listener_registered", "status_requested"]);
  assert.deepEqual(statuses, [false]);
  assert.ok(listener);
  (listener as (connected: boolean) => void)(true);
  assert.deepEqual(statuses, [false, true]);
  await handle.remove();
  assert.equal(calls.at(-1), "listener_removed");
});

test("Share receives only a canonical bounded place or route URL", async () => {
  const shares: Array<{ title: string; url: string; dialogTitle: string }> = [];
  const runtime = bridge({
    async share(options) { shares.push(options); },
  });
  assert.equal(await shareMobileTarget({ kind: "route", slug: "quiet-ubud" }, "Quiet Ubud", runtime), true);
  assert.deepEqual(shares, [{
    title: "Quiet Ubud",
    url: "https://www.otherbali.com/route/quiet-ubud",
    dialogTitle: "Share from Other Bali",
  }]);
  assert.equal(await shareMobileTarget({ kind: "place", slug: "../unsafe" }, "Unsafe", runtime), false);
  assert.equal(shares.length, 1);
});

test("dismissing a native share chooser is not reported as an unavailable device capability", async () => {
  assert.equal(await shareMobileTarget(
    { kind: "place", slug: "sample-cafe" },
    "Sample Cafe",
    bridge({
      async share() { throw new Error("Share canceled"); },
    }),
  ), true);

  assert.equal(await shareMobileTarget(
    { kind: "place", slug: "sample-cafe" },
    "Sample Cafe",
    bridge({
      async share() { throw new Error("Native share bridge failed"); },
    }),
  ), false);
});

test("Android hardware-back monitoring is removable and root exit stays native-only", async () => {
  const calls: string[] = [];
  let listener: (() => void) | null = null;
  const runtime = bridge({
    async addBackButtonListener(next) {
      listener = next;
      return { remove: async () => { calls.push("removed"); } };
    },
    async exitApp() { calls.push("exit"); },
  });
  const handle = await startBackButtonMonitoring(() => calls.push("back"), runtime);
  assert.ok(handle);
  assert.ok(listener);
  (listener as () => void)();
  await handle.remove();
  await exitMobileApp(runtime);
  assert.deepEqual(calls, ["back", "removed", "exit"]);

  const iosRuntime = bridge({ isAndroid: () => false });
  assert.equal(await startBackButtonMonitoring(() => calls.push("unexpected"), iosRuntime), null);
  await exitMobileApp(iosRuntime);
  assert.deepEqual(calls, ["back", "removed", "exit"]);
});
