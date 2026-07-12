import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.otherbali.app",
  appName: "Other Bali",
  webDir: "ios-web",
  loggingBehavior: "debug",
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
