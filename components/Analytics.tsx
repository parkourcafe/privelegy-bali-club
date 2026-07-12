import Script from "next/script";

// Google Analytics 4 (gtag.js). Rendered server-side into the initial HTML so
// Google's "verify installation" / tag detector can see it (a client-only,
// post-hydration injection is invisible to that check). Loaded in production
// builds only — local `next dev` is NODE_ENV=development, so dev never reports.
// Preview deploys also report; filter those in GA if needed (data filter by
// hostname) rather than hiding the tag, which would break detection.
const GA_ID = "G-F3TEVWTWX4";

export default function Analytics() {
  if (process.env.NODE_ENV !== "production") return null;

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
