import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Young_Serif, Gloock } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";

// Other Bali — Final type system (approved 2026-07): Hanken Grotesk for
// body/UI, Young Serif for headings, Gloock exclusively for the wordmark.
// Exposed as CSS vars and consumed by --font-body / --font-display in
// globals.css, so components stay untouched.
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap" });
const young = Young_Serif({ weight: "400", subsets: ["latin"], variable: "--font-young", display: "swap" });
const gloock = Gloock({ weight: "400", subsets: ["latin"], variable: "--font-gloock", display: "swap" });

// Public launch label: Other Bali is the tourist-facing brand. "Bali Privilege"
// remains internal/technical only.
export const metadata: Metadata = {
  metadataBase: new URL("https://www.otherbali.com"),
  referrer: "origin",
  title: {
    default: "Other Bali — the right place for the moment you're in",
    template: "%s · Other Bali",
  },
  description:
    "The right place for the moment you're in. Curated Bali places, routes, and confirmed venue offers where available.",
  manifest: "/manifest.webmanifest?v=5",
  appleWebApp: { capable: true, title: "Other Bali", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Other Bali — the right place for the moment you're in",
    description:
      "A free, curated guide to Canggu. Pick a place by the moment you're in, grab a confirmed offer, hand off to a booked table. Travellers never pay.",
    url: "https://www.otherbali.com",
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
    <html lang="en" className={`h-full antialiased ${hanken.variable} ${young.variable} ${gloock.variable}`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SourceCapture />
        <ServiceWorkerRegister />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
