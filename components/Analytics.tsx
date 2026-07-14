import Script from "next/script";

// Google Analytics 4 (gtag.js).
//
// DISABLED by default (audit 2026-07, privacy P0). No third-party analytics
// ships until a real consent flow exists — loading GA before consent was the
// core App Store 5.1.1 / privacy-label risk. GA now loads ONLY when BOTH:
//   1. the build is production, AND
//   2. NEXT_PUBLIC_ENABLE_ANALYTICS === "1" is set in the environment.
// The first App Store build ships with the flag unset, so no Google script is
// injected and no data reaches Google. To turn it back on later: wire consent
// first, THEN set the env var — do not just flip this line.
//
// Rendered server-side (when enabled) so Google's tag detector can see it; a
// client-only injection would be invisible to that check.
const GA_ID = "G-F3TEVWTWX4";
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === "1";

export default function Analytics() {
  if (process.env.NODE_ENV !== "production" || !ANALYTICS_ENABLED) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
    </>
  );
}
