"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import OtherBaliLogo from "@/components/OtherBaliLogo";
import { NAV_GROUPS, NAV_ACTIONS } from "@/lib/navigation";

// Persistent site header for every inner page (IA spec v1 §5.1). Six category
// groups from the shared navigation registry render as <details> mega-menus —
// natively keyboard- and screen-reader-operable (summary acts as a button),
// no horizontal scrolling of loose links. The cinematic homepage keeps its own
// overlay nav (LandingChrome), so this returns null there. On small screens
// the groups hide and the bottom bar (components/MobileNav) takes over; the
// header keeps brand + Explore/Saved.
export default function GlobalHeader() {
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

  if (!pathname || pathname === "/") return null;

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
                  {g.label}
                  <svg className="ob-mega-caret" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </summary>
                <div className="ob-mega-panel" role="group" aria-label={g.label}>
                  {g.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="ob-mega-link"
                      aria-current={pathname === l.href ? "page" : undefined}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </details>
            );
          })}
        </nav>

        <nav className="ob-site-actions" aria-label="Quick actions">
          {NAV_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              aria-current={pathname === a.href || pathname.startsWith(`${a.href}/`) ? "page" : undefined}
              data-active={pathname === a.href || pathname.startsWith(`${a.href}/`) ? "true" : "false"}
            >
              {a.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
