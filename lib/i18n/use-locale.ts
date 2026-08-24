"use client";

import { useEffect, useState } from "react";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_META, isPublicLocale, type PublicLocale } from "./locales";

// Client-side locale resolution for the chrome (header, mobile nav, switcher).
//
// The root layout used to resolve this with getLocale(), which reads headers()
// -- a dynamic API in the ROOT layout, which opted all 210 routes out of
// static/ISR rendering and cost the site its CDN-cacheable HTML (2026-08-24
// audit). The chrome components were already Client Components taking the
// locale as a prop, so the only thing the server read was that prop.
//
// Resolving it here instead keeps rendering cacheable. The first paint is the
// canonical English chrome -- which is what every first-time visitor and every
// crawler already got, because proxy.ts defaults to English and only an
// explicit switch writes the cookie (AGENTS.md §4.15). A returning visitor who
// chose another language sees their chrome swap in on hydration.
export function readLocaleCookie(): PublicLocale {
  if (typeof document === "undefined") return DEFAULT_LOCALE;
  const match = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]*)`));
  const value = match ? decodeURIComponent(match[1]) : null;
  return isPublicLocale(value) ? value : DEFAULT_LOCALE;
}

// Broadcast so every mounted chrome component re-reads the cookie the moment
// the switcher writes it. Without this the switch would need a full reload:
// the server no longer re-renders on a locale change, by design.
export const LOCALE_CHANGE_EVENT = "ob:locale-change";

export function useLocale(): PublicLocale {
  // Starts at the default so the hydrated tree matches the server HTML; the
  // effect below corrects it for visitors who switched.
  const [locale, setLocale] = useState<PublicLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const sync = () => {
      const next = readLocaleCookie();
      setLocale(next);
      // The served HTML carries the canonical English lang; keep the live
      // document honest for assistive tech once a chosen locale is applied.
      document.documentElement.lang = LOCALE_META[next].htmlLang;
    };
    sync();
    window.addEventListener(LOCALE_CHANGE_EVENT, sync);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, sync);
  }, []);

  return locale;
}
