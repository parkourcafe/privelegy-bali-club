"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { browserConsentState, CONSENT_EVENT } from "@/lib/privacy/consent";

const PRIVATE_PREFIXES = ["/admin", "/api", "/onboard", "/partner", "/me", "/v", "/list"];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function AnalyticsClient({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  const [allowed, setAllowed] = useState(false);
  const isPrivate = isPrivatePath(pathname);

  useEffect(() => {
    const sync = () => setAllowed(browserConsentState(document.cookie) === "analytics_allowed");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!allowed || isPrivate || lastPage.current === pathname || !window.gtag) return;
    lastPage.current = pathname;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
    });
  }, [allowed, isPrivate, pathname]);

  if (!allowed || isPrivate) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: false });`}
      </Script>
    </>
  );
}
