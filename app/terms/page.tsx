import Link from "next/link";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-3xl px-5 py-12">
        <Link href="/" className="quiet-link">
          ← Other Bali
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[var(--ob-brass)]">
          Terms
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Terms of Use</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: July 14, 2026</p>

        <div className="mt-10 space-y-8 text-[var(--ob-sand-dim)]">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              What Other Bali is
            </h2>
            <p className="mt-3">
              Other Bali is a free curated guide for Bali travellers. We help you
              choose places, routes, directions, and confirmed venue offers where
              available. We are not the venue, restaurant operator, transport
              provider, or payment provider.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Offers and reservations
            </h2>
            <p className="mt-3">
              Venue offers depend on venue confirmation, availability, opening
              hours, and staff acceptance on the day. For bookable venues, Other
              Bali hands you to an external reservation product; we do not run an
              internal booking engine.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Traveller payments
            </h2>
            <p className="mt-3">
              Other Bali does not charge travellers to use the guide. Venues may
              pay Other Bali only when a reservation made through us becomes a
              real seated visit.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Venue content
            </h2>
            <p className="mt-3">
              A venue representative must confirm the rights for each submitted
              photo. By doing so, they grant Other Bali a non-exclusive licence
              to display that image on otherbali.com while the listing is active.
              A submitted image stays private and is not published unless an
              Other Bali operator approves the image and its linked consent record.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Use responsibly
            </h2>
            <p className="mt-3">
              Check opening hours, travel time, venue rules, and local conditions
              before you go. Other Bali is a planning guide, not emergency,
              medical, legal, or safety advice.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Support
            </h2>
            <p className="mt-3">
              For help with Other Bali, contact{" "}
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

        <div className="mt-10 flex flex-wrap gap-4 text-sm">
          <Link href="/privacy" className="quiet-link">
            Privacy
          </Link>
          <Link href="/support" className="quiet-link">
            Support
          </Link>
        </div>
      </main>
    </div>
  );
}
