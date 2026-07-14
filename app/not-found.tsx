import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="page-dark flex min-h-[100svh] items-center">
      <main
        className="mx-auto w-full max-w-3xl px-5 py-16 sm:py-24"
        aria-labelledby="not-found-title"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ob-brass)]">
          404 · Off the map
        </p>
        <h1
          id="not-found-title"
          className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl"
        >
          This path does not lead anywhere yet.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-[var(--ob-sand-dim)] sm:text-lg">
          The page may have moved, or the link may be incomplete. Start again
          from the guide or browse places that are ready to visit.
        </p>
        <nav className="mt-9 flex flex-wrap gap-3" aria-label="Page recovery">
          <Link href="/" className="button-primary min-h-11 px-5">
            Go to Other Bali
          </Link>
          <Link href="/places" className="button-secondary min-h-11 px-5">
            Browse places
          </Link>
        </nav>
      </main>
    </div>
  );
}
