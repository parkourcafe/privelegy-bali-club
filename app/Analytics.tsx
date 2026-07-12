import Script from "next/script";

// Google Analytics 4. The measurement ID is public by design (it ships in the
// page anyway), so it's a safe default in code; NEXT_PUBLIC_GA_ID lets a
// preview/staging deploy point at a different property without a code change.
// Loaded via next/script (afterInteractive) rather than a raw <script> in
// <head> — App Router optimizes and de-dupes it, and it won't block hydration.
// Aggregate analytics only; no PII is sent (privacy-default guardrail).
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-F3TEVWTWX4";

export default function Analytics() {
  if (!GA_ID) return null;

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
