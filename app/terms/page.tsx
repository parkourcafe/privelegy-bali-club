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
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: July 11, 2026</p>

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
              If a venue uploads photos or confirms listing content, it confirms
              it has the right to provide that material and allows Other Bali to
              show it in the guide while the listing is active.
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
        </div>
      </main>
    </div>
  );
}
