import type { Metadata } from "next";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

// Branded 404. A mistyped or stale deep link (this is an 80+ page site with a
// lot of programmatic routes) should land on-brand and hand the traveller back
// to a real starting point — never Next's bare default dead-end.
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--ob-espresso)] px-6 py-20 text-center text-[var(--ob-sand)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 70% at 50% -10%, rgba(198,154,92,.14), transparent 55%)",
        }}
      />
      <Link href="/" aria-label="Other Bali home" className="inline-flex">
        <BrandMark className="h-12 w-12" />
      </Link>

      <p className="mt-8 text-[11px] uppercase tracking-[0.24em] text-[var(--ob-brass)]">
        Other Bali · 404
      </p>
      <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
        This page slipped off the map.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--ob-sand-dim)]">
        The link may be old or mistyped. Nothing is lost — pick up your day from
        one of these.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/#day-builder"
          className="min-h-11 rounded-full bg-[var(--ob-sand)] px-6 py-3 text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
        >
          Build my day
        </Link>
        <Link
          href="/places"
          className="min-h-11 rounded-full border border-[var(--ob-line)] px-6 py-3 text-sm font-semibold text-[var(--ob-sand)] transition-colors hover:border-[var(--ob-brass)]"
        >
          Browse places
        </Link>
      </div>

      <nav
        aria-label="Popular districts"
        className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] text-[var(--ob-sand-dim)]"
      >
        {[
          ["Canggu", "/canggu"],
          ["Uluwatu", "/uluwatu"],
          ["Ubud", "/ubud"],
          ["Seminyak", "/seminyak"],
          ["Sanur", "/sanur"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="transition-colors hover:text-[var(--ob-brass-2)]"
          >
            {label}
          </Link>
        ))}
      </nav>
    </main>
  );
}
