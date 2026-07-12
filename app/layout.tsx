import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";
import Analytics from "@/components/Analytics";

// Real loaded type (not system stacks): Fraunces (editorial serif) for display,
// Geist for body/UI. Exposed as CSS vars and consumed by --font-display /
// --font-body in globals.css, so the cinematic landing and the tool share one
// typographic voice.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

// Public launch label: Other Bali is the tourist-facing brand. "Bali Privilege"
// remains internal/technical only.
export const metadata: Metadata = {
  metadataBase: new URL("https://otherbali.com"),
  title: {
    default: "Other Bali — the right place for the moment you're in",
    template: "%s · Other Bali",
  },
  description:
    "The right place for the moment you're in. Curated Canggu places, routes, and confirmed venue offers where available.",
  manifest: "/manifest.webmanifest?v=4",
  appleWebApp: { capable: true, title: "Other Bali", statusBarStyle: "default" },
  icons: {
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "Other Bali — the right place for the moment you're in",
    description:
      "A free, curated guide to Canggu. Pick a place by the moment you're in, grab a confirmed offer, hand off to a booked table. Travellers never pay.",
    url: "https://otherbali.com",
    siteName: "Other Bali",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Other Bali — the right place for the moment you're in",
    description:
      "A free, curated guide to Bali. Tell us the day; get the places that actually fit — not another list to scroll. Travellers never pay.",
  },
};

export const viewport: Viewport = {
  themeColor: "#005962",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${geist.variable} ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SourceCapture />
        <ServiceWorkerRegister />
        <Analytics />
      </body>
    </html>
  );
}
