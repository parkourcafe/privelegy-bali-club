import { App as CapacitorApp } from "@capacitor/app";
import { AppLauncher } from "@capacitor/app-launcher";
import { Browser } from "@capacitor/browser";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { Share } from "@capacitor/share";
import {
  hostMatches,
  resolveSafeExternalLink,
  type ExternalLinkKind,
} from "../../lib/external-links";
import { mobileShareUrl, type MobileDeepLinkTarget } from "./deep-links";

export interface NativeListenerHandle {
  remove(): Promise<void>;
}

export interface MobileNativeBridge {
  isNative(): boolean;
  getLaunchUrl(): Promise<string | null>;
  addAppUrlListener(listener: (url: string) => void): Promise<NativeListenerHandle>;
  getNetworkConnected(): Promise<boolean>;
  addNetworkListener(listener: (connected: boolean) => void): Promise<NativeListenerHandle>;
  launchUrl(url: string): Promise<boolean>;
  openBrowser(url: string): Promise<void>;
  canShare(): Promise<boolean>;
  share(options: { title: string; url: string; dialogTitle: string }): Promise<void>;
}

const capacitorBridge: MobileNativeBridge = {
  isNative: () => Capacitor.isNativePlatform(),
  async getLaunchUrl() {
    return (await CapacitorApp.getLaunchUrl())?.url ?? null;
  },
  addAppUrlListener(listener) {
    return CapacitorApp.addListener("appUrlOpen", ({ url }) => listener(url));
  },
  async getNetworkConnected() {
    return (await Network.getStatus()).connected;
  },
  addNetworkListener(listener) {
    return Network.addListener("networkStatusChange", ({ connected }) => listener(connected));
  },
  async launchUrl(url) {
    return (await AppLauncher.openUrl({ url })).completed;
  },
  async openBrowser(url) {
    await Browser.open({ url, presentationStyle: "fullscreen" });
  },
  async canShare() {
    return (await Share.canShare()).value;
  },
  async share(options) {
    await Share.share(options);
  },
};

export interface ControlledNativeOpenOptions {
  beforeOpen(): Promise<void> | void;
  allowedHosts?: readonly string[];
  openWindow?: (href: string, target: "_blank", features: string) => unknown;
}

export async function openControlledExternal(
  value: unknown,
  kind: ExternalLinkKind,
  options: ControlledNativeOpenOptions,
  bridge: MobileNativeBridge = capacitorBridge,
): Promise<boolean> {
  const link = resolveSafeExternalLink(value, kind);
  if (!link) return false;

  if (options.allowedHosts?.length) {
    const url = new URL(link.href);
    if (!options.allowedHosts.some((host) => hostMatches(url.hostname, host))) return false;
  }

  try {
    await options.beforeOpen();
    if (bridge.isNative()) {
      if (["apple_maps", "google_maps", "whatsapp"].includes(kind)) {
        try {
          if (await bridge.launchUrl(link.href)) return true;
        } catch {
          // Keep the exact validated URL and fall back to the controlled browser.
        }
      }
      await bridge.openBrowser(link.href);
      return true;
    }

    const openWindow = options.openWindow
      ?? (typeof window === "undefined" ? null : window.open.bind(window));
    if (!openWindow) return false;
    return openWindow(link.href, "_blank", "noopener,noreferrer") !== null;
  } catch {
    return false;
  }
}

export async function startNetworkMonitoring(
  listener: (connected: boolean) => void,
  bridge: MobileNativeBridge = capacitorBridge,
): Promise<NativeListenerHandle> {
  const handle = await bridge.addNetworkListener(listener);
  try {
    listener(await bridge.getNetworkConnected());
  } catch {
    // The active listener can still provide the next authoritative status.
  }
  return handle;
}

export async function startDeepLinkMonitoring(
  listener: (url: string) => void,
  bridge: MobileNativeBridge = capacitorBridge,
): Promise<NativeListenerHandle | null> {
  if (!bridge.isNative()) return null;
  const handle = await bridge.addAppUrlListener(listener);
  try {
    const launchUrl = await bridge.getLaunchUrl();
    if (launchUrl) listener(launchUrl);
  } catch {
    // Warm appUrlOpen events remain available if cold-start lookup fails.
  }
  return handle;
}

export async function shareMobileTarget(
  target: MobileDeepLinkTarget,
  title: string,
  bridge: MobileNativeBridge = capacitorBridge,
): Promise<boolean> {
  try {
    if (!await bridge.canShare()) return false;
    await bridge.share({
      title,
      url: mobileShareUrl(target),
      dialogTitle: "Share from Other Bali",
    });
    return true;
  } catch {
    return false;
  }
}
