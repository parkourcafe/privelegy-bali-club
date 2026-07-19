"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PUBLIC_LOCALES, LOCALE_META, setLocaleCookie, type PublicLocale } from "@/lib/i18n/locales";

// Visible language switcher (Multi-locale public UI rule v1). Writes the
// same first-party cookie middleware.ts reads, then refreshes so every
// Server Component re-renders with the new locale on this same page — no
// full navigation, no URL change (Phase A is chrome-only, not URL-localized).
export default function LocaleSwitcher({ locale }: { locale: PublicLocale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  function choose(next: PublicLocale) {
    setLocaleCookie(next);
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="ob-locale-switcher" ref={ref}>
      <button
        type="button"
        className="ob-locale-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {LOCALE_META[locale].nativeName}
        <svg className="ob-mega-caret" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      {open ? (
        <ul className="ob-locale-menu" role="listbox" aria-label="Choose language">
          {PUBLIC_LOCALES.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                className="ob-locale-option"
                onClick={() => choose(code)}
              >
                {LOCALE_META[code].nativeName}
                <span className="ob-locale-option-en">{LOCALE_META[code].englishName}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
