"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OtherBaliLogo from "@/components/OtherBaliLogo";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { NAV_GROUPS, NAV_ACTIONS, NAV_SECONDARY_LINKS } from "@/lib/navigation";
import { t } from "@/lib/i18n/dictionaries";
import type { PublicLocale } from "@/lib/i18n/locales";

// Persistent site header for every public page (IA spec v1 §5.1). Six category
// groups from the shared navigation registry render as <details> mega-menus —
// natively keyboard- and screen-reader-operable (summary acts as a button),
// no horizontal scrolling of loose links. The cinematic homepage keeps its own
// hero, but the global header still renders there so users always have the
// same Explore menus and quick actions. On small screens the groups hide and
// the bottom bar (components/MobileNav) takes over; the header keeps brand +
// Explore/Saved.
export default function GlobalHeader({ locale }: { locale: PublicLocale }) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);

  // One open menu at a time; close on outside click / Esc / route change.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const closeAll = (except?: HTMLDetailsElement) => {
      root.querySelectorAll<HTMLDetailsElement>("details[open]").forEach((d) => {
        if (d !== except) d.open = false;
      });
    };
    const onToggle = (e: Event) => {
      const t = e.target as HTMLDetailsElement;
      if (t.tagName === "DETAILS" && t.open) closeAll(t);
    };
    const onClick = (e: MouseEvent) => {
      if (!root.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll();
    };
    root.addEventListener("toggle", onToggle, true);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    rootRef.current
      ?.querySelectorAll<HTMLDetailsElement>("details[open]")
      .forEach((d) => (d.open = false));
  }, [pathname]);

  if (!pathname) return null;

  return (
    <header className="ob-site-header" ref={rootRef}>
      <div className="ob-site-header-inner">
        <Link href="/" className="ob-site-brand" aria-label="Other Bali — home">
          <OtherBaliLogo size={20} />
        </Link>

        <nav className="ob-mega-nav" aria-label="Main">
          {NAV_GROUPS.map((g) => {
            const active = g.links.some(
              (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
            );
            return (
              <details key={g.key} className="ob-mega">
                <summary
                  className="ob-mega-summary"
                  data-active={active ? "true" : "false"}
                >
                  {t(locale, g.label)}
                  <svg className="ob-mega-caret" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="ob-mega-panel" role="group" aria-label={t(locale, g.label)}>
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="ob-mega-link"
                      aria-current={pathname === l.href ? "page" : undefined}
                    >
                      {t(locale, l.label)}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <nav className="ob-site-actions" aria-label="Quick actions">
          <details className="ob-compact-nav">
            <summary className="ob-compact-summary">
              <span aria-hidden="true" className="ob-compact-icon">☰</span>
              Explore
            </summary>
            <div className="ob-compact-panel" role="group" aria-label="Explore Other Bali">
              {NAV_GROUPS.map((g) => (
                <section key={g.key} className="ob-compact-group">
                  <p className="ob-compact-group-title">{t(locale, g.label)}</p>
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="ob-compact-link"
                      aria-current={pathname === l.href ? "page" : undefined}
                    >
                      {t(locale, l.label)}
                    </Link>
                  ))}
                </section>
              ))}
              <section className="ob-compact-group" aria-label="For businesses">
                <p className="ob-compact-group-title">For businesses</p>
                {NAV_SECONDARY_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="ob-compact-link"
                    aria-current={pathname === l.href ? "page" : undefined}
                  >
                    {t(locale, l.label)}
                  </Link>
                ))}
              </section>
            </div>
          </details>
          {NAV_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              aria-current={pathname === a.href || pathname.startsWith(`${a.href}/`) ? "page" : undefined}
              data-active={pathname === a.href || pathname.startsWith(`${a.href}/`) ? "true" : "false"}
            >
              {t(locale, a.label)}
            </Link>
          ))}
          <LocaleSwitcher locale={locale} />
        </nav>
      </div>
    </header>
  );
}
