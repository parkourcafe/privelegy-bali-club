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
import { serializeJsonLd } from "@/lib/seo/json-ld";
import {
  CANONICAL_SITE_ORIGIN,
  OTHER_BALI_BRAND_NAME,
  OTHER_BALI_CONTACT_EMAIL,
} from "@/lib/site-origin-policy";

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
  metadataBase: new URL(CANONICAL_SITE_ORIGIN),
  referrer: "origin",
  // Google Search Console ownership verification. Emits
  // <meta name="google-site-verification" ...> in <head> on every page.
  verification: {
    google: "H29WFsXupvBPxTgrs_jjH9oIa_Zi_yIdIcrj0t8oXSo",
  },
  title: {
    default: "Other Bali — the right place for the moment you're in",
    template: "%s · Other Bali",
  },
  description:
    "Discover Bali together with resident-curated places, routes and practical plans for every moment. Less searching. More Bali.",
  manifest: "/manifest.webmanifest?v=5",
  appleWebApp: { capable: true, title: OTHER_BALI_BRAND_NAME, statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Other Bali — the right place for the moment you're in",
    description:
      "Discover Bali together with resident-curated places, routes and practical plans for every moment.",
    siteName: OTHER_BALI_BRAND_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Other Bali — the right place for the moment you're in",
    description:
      "Resident-curated places, routes and plans for every Bali moment. Less searching. More Bali.",
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
const ORG_ID = `${CANONICAL_SITE_ORIGIN}/#organization`;
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: OTHER_BALI_BRAND_NAME,
      url: CANONICAL_SITE_ORIGIN,
      logo: `${CANONICAL_SITE_ORIGIN}/icon-512.png`,
      email: OTHER_BALI_CONTACT_EMAIL,
      description:
        "A Bali guide for moments, areas and trip plans.",
    },
    {
      "@type": "WebSite",
      "@id": `${CANONICAL_SITE_ORIGIN}/#website`,
      name: OTHER_BALI_BRAND_NAME,
      url: CANONICAL_SITE_ORIGIN,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${CANONICAL_SITE_ORIGIN}/places?q={search_term_string}`,
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
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(siteJsonLd) }}
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
