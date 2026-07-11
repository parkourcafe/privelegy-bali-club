"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#moments", label: "Moments" },
  { href: "/places", label: "Places" },
  { href: "#inside", label: "What's inside" },
  { href: "#trust", label: "Why free" },
];

// Top nav: transparent over the hero, frosts once you scroll past it.
// Simplified menu (Phase 7) — key anchors + one prominent primary CTA.
export function LandingNav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? "border-b border-[var(--ob-line)] bg-[var(--ob-espresso)]/85 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-[var(--ob-sand)]">
            Other Bali
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[var(--ob-brass)] sm:inline">
            Canggu Beta
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm text-[var(--ob-sand-dim)] transition-colors hover:text-[var(--ob-sand)]"
            >
              {n.label}
            </a>
          ))}
          <Link
            href="/plan"
            className="rounded-full bg-[var(--ob-sand)] px-4 py-2 text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
          >
            Plan my day
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--ob-line)] text-[var(--ob-sand)] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-[var(--ob-line)] bg-[var(--ob-espresso)]/95 px-5 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[var(--ob-sand-dim)]"
              >
                {n.label}
              </a>
            ))}
            <Link
              href="/plan"
              className="mt-2 rounded-full bg-[var(--ob-sand)] px-4 py-3 text-center font-semibold text-[var(--ob-espresso)]"
            >
              Plan my Canggu day
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

// Thumb-reach CTA that appears after the hero on phones (Phase 7/13 #8).
export function MobileStickyCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 640);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-transform duration-500 md:hidden ${
        show ? "translate-y-0" : "translate-y-[130%]"
      }`}
    >
      <Link
        href="/plan"
        className="flex items-center justify-center gap-2 rounded-full bg-[var(--ob-accent)] px-6 py-3.5 font-semibold text-white shadow-[0_10px_40px_-8px_rgba(14,116,144,0.7)]"
      >
        Plan my Canggu day →
      </Link>
    </div>
  );
}
