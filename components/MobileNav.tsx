"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_GROUPS } from "@/lib/navigation";
import { t } from "@/lib/i18n/dictionaries";
import type { PublicLocale } from "@/lib/i18n/locales";

// Mobile bottom navigation (IA spec v1 §5.2): Explore · Search · Saved · Plan.
// Explore opens a full category sheet built from the shared navigation
// registry — no horizontal scrolling of primary links anywhere. The sheet is a
// dialog: focus moves in on open, Esc and backdrop close it, and it closes on
// navigation. Hidden on venue detail pages, where the sticky action bar
// (reserve/directions) owns the bottom edge — two stacked bars would bury the
// money CTA.
const TABS = [
  { key: "explore", label: "Explore", href: null },
  { key: "search", label: "Search", href: "/places" },
  { key: "saved", label: "Saved", href: "/me" },
  { key: "plan", label: "Plan", href: "/plan" },
] as const;

const ICONS: Record<string, React.ReactNode> = {
  explore: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  saved: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h12v18l-6-4.5L6 21z" />
    </svg>
  ),
  plan: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 5h16v14H4z" />
      <path d="M8 3v4M16 3v4M4 11h16" />
    </svg>
  ),
};

export default function MobileNav({ locale }: { locale: PublicLocale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close the sheet whenever the route changes (a link was followed) — the
  // React-sanctioned adjust-state-during-render pattern, not a setState effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Venue detail pages keep their sticky action bar as the bottom layer.
  if (!pathname || /^\/places\/[^/]+/.test(pathname)) return null;

  return (
    <>
      {open ? (
        <div className="ob-sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="ob-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, "Explore Bali categories")}
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ob-sheet-head">
              <p className="ob-sheet-title">{t(locale, "Explore")}</p>
              <button
                type="button"
                className="ob-sheet-close"
                onClick={() => setOpen(false)}
                aria-label={t(locale, "Close")}
              >
                ✕
              </button>
            </div>
            <div className="ob-sheet-groups">
              {NAV_GROUPS.map((g) => (
                <section key={g.key} className="ob-sheet-group">
                  <h2>{t(locale, g.label)}</h2>
                  <ul>
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link href={l.href} onClick={() => setOpen(false)}>
                          {t(locale, l.label)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <nav className="ob-mobile-nav" aria-label={t(locale, "Primary")}>
        {TABS.map((tab) => {
          if (tab.href === null) {
            return (
              <button
                key={tab.key}
                type="button"
                className="ob-mobile-tab"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {ICONS[tab.key]}
                <span>{t(locale, tab.label)}</span>
              </button>
            );
          }
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className="ob-mobile-tab"
              aria-current={active ? "page" : undefined}
              data-active={active ? "true" : "false"}
            >
              {ICONS[tab.key]}
              <span>{t(locale, tab.label)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
