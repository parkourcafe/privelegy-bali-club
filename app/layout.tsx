import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";

// Editorial serif for display, clean grotesque for body — both self-hosted
// via next/font (no runtime requests, no layout shift).
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
});

// Public brand: Other Bali (decided 2026-07-08). The neutral field-test label
// ("Canggu Perks Map") stays only on already-printed partner artifacts —
// admin QR stickers and the partner invite message — until those are
// deliberately re-printed for Canggu Beta.
export const metadata: Metadata = {
  metadataBase: new URL("https://otherbali.com"),
  title: {
    default: "Other Bali — the right place for the moment you're in",
    template: "%s · Other Bali",
  },
  description:
    "A free, human-curated guide to Canggu: hand-picked places by time of day, vibe tags verified on-site, honest prices, and venue offers you redeem at the counter.",
  manifest: "/manifest.webmanifest?v=4",
  appleWebApp: { capable: true, title: "Other Bali", statusBarStyle: "default" },
  openGraph: {
    title: "Other Bali — the right place for the moment you're in",
    description:
      "A free, human-curated guide to Canggu. Hand-picked places by time of day, verified vibes, honest prices. You never pay.",
    url: "https://otherbali.com",
    siteName: "Other Bali",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#12211f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${fraunces.variable} ${instrumentSans.variable}`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SourceCapture />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
