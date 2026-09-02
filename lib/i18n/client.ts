"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_CHANGE_EVENT,
  readLocaleCookie,
  type PublicLocale,
} from "./locales";

// Client-side locale resolution, and the reason it exists.
//
// The root layout used to resolve the locale through lib/i18n/server.ts's
// getLocale(), which calls headers(). A request header read in the ROOT layout
// opts every route below it out of static rendering — so all 144 public pages
// were request-rendered, answered `Cache-Control: private, no-cache, no-store`
// and never populated the CDN. The 13 pages that declared `revalidate` had it
// silently defeated, and app/places/[slug] carried an explicit `force-dynamic`
// documenting the trap.
//
// Nothing about the locale needs the server: the public product is English
// (guardrail #15), only UI chrome is translated, the choice lives in a
// non-httpOnly first-party cookie the client can read, and English is the
// first-visit default. So the chrome resolves the locale here instead and the
// HTML goes back to being static.
//
// Hydration contract: this returns DEFAULT_LOCALE for the server render AND
// the first client render, then syncs in an effect. Prerendered HTML and the
// hydrated tree therefore always agree; a visitor who chose a non-English
// locale sees English chrome for one frame, which is the cost of a cacheable
// page and applies to chrome only, never to a fact.
export function useLocale(): PublicLocale {
  const [locale, setLocale] = useState<PublicLocale>(DEFAULT_LOCALE);

  useEffect(() => {
    const sync = () => setLocale(readLocaleCookie());
    sync();
    window.addEventListener(LOCALE_CHANGE_EVENT, sync);
    return () => window.removeEventListener(LOCALE_CHANGE_EVENT, sync);
  }, []);

  return locale;
}
