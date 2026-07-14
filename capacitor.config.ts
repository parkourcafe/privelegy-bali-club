import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.otherbali.app",
  appName: "Other Bali",
  webDir: "ios-web",
  // Release builds must not emit verbose native logs (audit 2026-07, P0
  // "Release debug logging"). "none" silences the Capacitor bridge in
  // production; switch back to "debug" locally only when diagnosing the shell.
  loggingBehavior: "none",
  backgroundColor: "#20160f",
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    allowsLinkPreview: false,
  },
  server: {
    url: "https://www.otherbali.com",
    cleartext: false,
    errorPath: "offline.html",
  },
};

export default config;
