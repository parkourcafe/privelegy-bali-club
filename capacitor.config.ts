import type { CapacitorConfig } from "@capacitor/cli";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return false;
  }
  return parts[0] === 10
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 192 && parts[1] === 168);
}

function developmentServer(rawUrl: string): NonNullable<CapacitorConfig["server"]> {
  const url = new URL(rawUrl);
  const localHost = LOOPBACK_HOSTS.has(url.hostname) || isPrivateIpv4(url.hostname);
  if (!["http:", "https:"].includes(url.protocol) || !localHost || url.username || url.password) {
    throw new Error(
      "CAPACITOR_DEV_SERVER_URL must be an HTTP(S) loopback or private-network URL without credentials",
    );
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("CAPACITOR_DEV_SERVER_URL must be an origin without a path, query, or hash");
  }
  return {
    url: url.origin,
    cleartext: url.protocol === "http:",
    errorPath: "offline.html",
  };
}

export function createCapacitorConfig(
  environment: { CAPACITOR_DEV_SERVER_URL?: string } = {
    CAPACITOR_DEV_SERVER_URL: process.env.CAPACITOR_DEV_SERVER_URL,
  },
): CapacitorConfig {
  const devServerUrl = environment.CAPACITOR_DEV_SERVER_URL?.trim();
  return {
    appId: "com.otherbali.app",
    appName: "Other Bali",
    webDir: "ios-web",
    loggingBehavior: devServerUrl ? "debug" : "none",
    backgroundColor: "#20160f",
    ios: {
      contentInset: "automatic",
      preferredContentMode: "mobile",
      allowsLinkPreview: false,
    },
    ...(devServerUrl ? { server: developmentServer(devServerUrl) } : {}),
  };
}

const config = createCapacitorConfig();

export default config;
