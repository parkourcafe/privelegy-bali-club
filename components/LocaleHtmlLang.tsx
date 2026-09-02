"use client";

import { useEffect } from "react";
import { useLocale } from "@/lib/i18n/client";
import { LOCALE_META } from "@/lib/i18n/locales";

// Keeps <html lang> in step with the chrome locale.
//
// The prerendered document ships lang="en" — the public product's canonical
// language (guardrail #15) and the first-visit default. A visitor who switched
// locale gets the document language updated here instead of in the root layout,
// which is what lets the layout stay static. Renders nothing.
export default function LocaleHtmlLang() {
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = LOCALE_META[locale].htmlLang;
  }, [locale]);

  return null;
}
