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
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: July 14, 2026</p>

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
              If you choose to join a guide list, we collect your first name,
              email address or WhatsApp number, optional travel date and trip
              interests, and your consent so we can keep the details and contact
              you about that guide.
            </p>
            <p className="mt-3">
              If a venue uses partner onboarding, its representative may submit
              a name, optional contact, confirmation, photo-rights consent, and
              photos for private operator review. We also retain limited consent
              evidence such as time, terms version, IP address, and user agent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              How we use it
            </h2>
            <p className="mt-3">
              We use this information to operate the guide, keep attribution
              accurate, prevent fake proof, show your own redeemed offers on this
              device, respond to guide requests, review licensed venue photos,
              and give venues aggregate results. Venues see counts by default,
              not identifiable traveller data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              What we do not do
            </h2>
            <p className="mt-3">
              We do not use Google Analytics or any third-party analytics or
              advertising trackers, and we do not track you across other apps or
              websites. The only analytics is the first-party interaction record
              described above, kept to run the guide and venue attribution.
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
              if you do not want a redemption recorded. To have the interaction
              events tied to your device reference deleted from our records,
              email us at{" "}
              <a
                className="inline-flex min-h-11 items-center text-[var(--ob-brass)]"
                href="mailto:support@otherbali.com"
              >
                support@otherbali.com
              </a>{" "}
              and we will remove them.
            </p>
            <p className="mt-3">
              You can also turn analytics on or off, or forget this device, on
              the{" "}
              <Link href="/privacy/choices" className="text-[var(--ob-brass)] underline underline-offset-2">
                privacy choices
              </Link>{" "}
              page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Contact
            </h2>
            <p className="mt-3">
              For privacy or support questions, contact{" "}
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
          <Link href="/terms" className="quiet-link">
            Terms
          </Link>
          <Link href="/support" className="quiet-link">
            Support
          </Link>
        </div>
      </main>
    </div>
  );
}
