"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Google Analytics 4 (gtag.js). Loaded only on real deployed hosts — local dev
// (localhost / next dev) never reports, so the founder's analytics stay clean.
// GA4 enhanced measurement tracks SPA route changes via history events, so no
// manual page_view wiring is needed for client-side navigation.
const GA_ID = "G-F3TEVWTWX4";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", ""]);

export default function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!LOCAL_HOSTS.has(window.location.hostname)) setEnabled(true);
  }, []);

  if (!enabled) return null;

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
