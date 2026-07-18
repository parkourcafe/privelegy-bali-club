import Link from "next/link";
import type { Metadata } from "next";

// App Review landing page (audit 2026-07, OB-APPLE-003). A stable, noindex URL
// to give Apple in Review Notes: https://www.otherbali.com/review. Public by
// default; set REVIEW_ACCESS_TOKEN to password-gate it (proxy.ts). Keep the copy
// accurate to the shipped product — do not describe features that aren't built.
export const metadata: Metadata = {
  title: "App Review",
  robots: { index: false, follow: false },
  alternates: { canonical: "/review" },
};

const testLinks: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/plan", label: "Build my Bali day (plan + routes)" },
  { href: "/places", label: "Browse curated places" },
  { href: "/privacy/choices", label: "Privacy choices (analytics on/off, forget device)" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms" },
  { href: "/support", label: "Support" },
];

export default function ReviewPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-3xl px-5 py-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--ob-brass)]">
          For App Review
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Reviewing Other Bali</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">
          A curated, free Bali travel guide. This page is for app reviewers.
        </p>

        <div className="mt-10 space-y-8 text-[var(--ob-sand-dim)]">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">No login required</h2>
            <p className="mt-3">
              There is no account, sign-up, or password to use Other Bali, and no
              paywall. Travellers never pay. Open the app and start.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">The core flow</h2>
            <ol className="mt-3 list-decimal space-y-1 pl-5">
              <li>Open the app.</li>
              <li>Tap <strong>Build my Bali day</strong> and choose what the day should feel like.</li>
              <li>Browse the filtered shortlist; each pick shows <em>why it fits</em>.</li>
              <li>Open a place for details and <strong>directions</strong> (opens Apple/Google Maps).</li>
              <li>Open a route to see its ordered stops.</li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">Reservations & external services</h2>
            <p className="mt-3">
              Other Bali does not process bookings, take payments, or sell digital
              content. Where a venue is bookable, the app <strong>hands off</strong> to
              that venue&apos;s own channel (an official website/booking page, or a
              pre-filled WhatsApp message). Other Bali does not confirm availability
              — a tap is intent, not a confirmed booking.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">Privacy</h2>
            <p className="mt-3">
              No Google Analytics and no third-party or cross-app tracking.
              First-party interaction analytics is opt-in. Reviewers can turn it on
              or off, or forget the device, at{" "}
              <Link href="/privacy/choices" className="text-[var(--ob-brass)] underline underline-offset-2">
                /privacy/choices
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">Test links</h2>
            <ul className="mt-3 space-y-2">
              {testLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[var(--ob-brass)] underline underline-offset-2">
                    {l.href}
                  </Link>{" "}
                  <span className="text-[var(--muted)]">— {l.label}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">Contact</h2>
            <p className="mt-3">
              Reviewer questions:{" "}
              <a
                className="inline-flex min-h-11 items-center text-[var(--ob-brass)]"
                href="mailto:support@otherbali.com"
              >
                support@otherbali.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
