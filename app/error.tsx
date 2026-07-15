"use client";

import { useEffect } from "react";
import Link from "next/link";
import BrandMark from "@/components/BrandMark";

// Route-level error boundary. Any uncaught render/runtime error inside a page
// is caught here and shown on-brand, with a retry that re-renders the segment
// and a way back to a working entry point — instead of Next's stark default.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console / Vercel logs for diagnosis. No PII.
    console.error("[route-error]", error?.message, error?.digest);
  }, [error]);

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
        Other Bali
      </p>
      <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
        Something went sideways.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--ob-sand-dim)]">
        A hiccup on our end, not yours. Try again — or head back and keep
        planning.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded-full bg-[var(--ob-sand)] px-6 py-3 text-sm font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
        >
          Try again
        </button>
        <Link
          href="/places"
          className="min-h-11 rounded-full border border-[var(--ob-line)] px-6 py-3 text-sm font-semibold text-[var(--ob-sand)] transition-colors hover:border-[var(--ob-brass)]"
        >
          Browse places
        </Link>
      </div>
    </main>
  );
}
