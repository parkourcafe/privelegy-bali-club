import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Young_Serif, Gloock } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegister from "./ServiceWorkerRegister";
import SourceCapture from "./SourceCapture";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";
import GlobalHeader from "@/components/GlobalHeader";
import MobileNav from "@/components/MobileNav";
import { getLocale } from "@/lib/i18n/server";
import { LOCALE_META } from "@/lib/i18n/locales";

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
      "A free, curated guide to Bali. Pick a place by the moment you're in, grab a confirmed offer, hand off to the venue to book. Travellers never pay.",
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
  // The palette is a designed light system with hand-tuned contrast. Declaring
  // it stops Android Chrome's forced auto-dark from recolouring backgrounds
  // while leaving ink variables dark — which rendered as "black text on black"
  // for users with system dark mode.
  colorScheme: "light",
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html
      lang={LOCALE_META[locale].htmlLang}
      className={`h-full antialiased ${hanken.variable} ${young.variable} ${gloock.variable}`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <GlobalHeader locale={locale} />
        {children}
        <MobileNav locale={locale} />
        <SourceCapture />
        <ServiceWorkerRegister />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
