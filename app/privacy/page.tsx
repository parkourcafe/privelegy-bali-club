import Link from "next/link";

export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-3xl px-5 py-12">
        <Link href="/" className="quiet-link">
          ← Other Bali
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[var(--ob-brass)]">
          Privacy
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: July 11, 2026</p>

        <div className="mt-10 space-y-8 text-[var(--ob-sand-dim)]">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              What we collect
            </h2>
            <p className="mt-3">
              Other Bali uses an anonymous browser cookie to keep your redeemed
              offers on this device and to count whether a guest came from an
              Other Bali link or QR code. We may record basic interaction events,
              such as source scans, card opens, directions clicks, reservation
              clicks, and offer redemptions.
            </p>
            <p className="mt-3">
              We do not ask travellers for an account, payment card, or profile.
              If a venue uses partner onboarding, the venue may submit a contact
              name, confirmation, and photos it chooses to upload.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              How we use it
            </h2>
            <p className="mt-3">
              We use this information to operate the guide, keep attribution
              accurate, prevent fake proof, show your own redeemed offers on this
              device, and give venues aggregate results. Venues see counts by
              default, not identifiable traveller data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Services you choose to open
            </h2>
            <p className="mt-3">
              Other Bali may hand you to Google Maps, WhatsApp, or TablePilot.
              Those services are separate from Other Bali and handle the
              information you give them under their own policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Your choices
            </h2>
            <p className="mt-3">
              You can clear your browser cookies to reset the anonymous Other
              Bali device reference. You can also choose not to redeem an offer
              if you do not want a redemption recorded.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
