import type { Metadata, Viewport } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";

// Real loaded type (not system stacks): Fraunces (editorial serif) for display,
// Geist for body/UI. Exposed as CSS vars and consumed by --font-display /
// --font-body in globals.css, so the cinematic landing and the tool share one
// typographic voice.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });

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

// Sitewide brand entity: one Organization node (name/logo → knowledge panel)
// and one WebSite node with a SearchAction (sitelinks search box → /places?q=).
// No sameAs is emitted because no official social profile is recorded in the
// codebase and inventing one would violate the no-invented-content guardrail.
const ORG_ID = "https://www.otherbali.com/#organization";
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Other Bali",
      url: "https://www.otherbali.com",
      logo: "https://www.otherbali.com/icon-512.png",
      email: "support@otherbali.com",
      description:
        "A resident-curated guide to Bali — the right place for the moment you're in.",
    },
    {
      "@type": "WebSite",
      "@id": "https://www.otherbali.com/#website",
      name: "Other Bali",
      url: "https://www.otherbali.com",
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.otherbali.com/places?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full antialiased ${geist.variable} ${fraunces.variable}`}>
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
        <SourceCapture />
        <ServiceWorkerRegister />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
