"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import {
  CONSENT_CHANGE_EVENT,
  readConsent,
  type ConsentValue,
} from "@/lib/consent";

declare global {
  interface Window {
    dataLayer?: unknown[][];
  }
}

const PRIVATE_PREFIXES = ["/admin", "/api", "/onboard", "/partner", "/me", "/v", "/list"];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export default function AnalyticsClient({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  const [consent, setConsentState] = useState<ConsentValue | null>(null);
  const [ready, setReady] = useState(false);
  const isPrivate = isPrivatePath(pathname);

  useEffect(() => {
    // Client cookie state is unavailable during SSR; synchronize once after
    // mount, then stay current through the consent event subscription.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConsentState(readConsent());
    const onConsentChange = (event: Event) => {
      setConsentState((event as CustomEvent<ConsentValue>).detail);
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
  }, []);

  useEffect(() => {
    if (consent === "granted") return;
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
  }, [consent]);

  useEffect(() => {
    if (!ready || consent !== "granted" || isPrivate || lastPage.current === pathname || !window.gtag) return;
    lastPage.current = pathname;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: `${window.location.origin}${pathname}`,
    });
  }, [consent, isPrivate, pathname, ready]);

  if (isPrivate || consent !== "granted") return null;

  function initializeAnalytics() {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = window.gtag ?? ((...args: unknown[]) => window.dataLayer?.push(args));
    window.gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false });
    setReady(true);
  }

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
      onReady={initializeAnalytics}
    />
  );
}
