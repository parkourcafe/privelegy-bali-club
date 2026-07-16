import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Other Bali handles your data: the httpOnly GuestRef model, what we do and don't store, and your choices. Travellers never need an account.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="page-dark">
      <main className="mx-auto w-full max-w-3xl px-5 py-12">
        <Link href="/" className="quiet-link">
          ← Home
        </Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-[var(--lagoon)]">
          Privacy
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Privacy Policy</h1>
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: July 18, 2026</p>

        <div className="mt-10 space-y-8 text-[var(--muted)]">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Mobile app
            </h2>
            <p className="mt-3">
              The Other Bali mobile app stores the catalogue cache, your Saved
              places and routes, and navigation state on your device. It does not
              require an account and does not include advertising, cross-app
              tracking, or third-party analytics SDKs.
            </p>
            <p className="mt-3">
              To load and refresh the catalogue, place details, and routes, the
              app sends encrypted HTTPS requests to www.otherbali.com. Our hosting provider,
              Vercel, processes the requested path, IP address and approximate
              city or country derived from it, user agent, request identifiers,
              response status, and operational diagnostics. Runtime logs are
              currently accessible to us for up to one day so we can operate,
              secure, and troubleshoot the service, after which they expire
              under the current hosting retention setting.
            </p>
            <p className="mt-3">
              These operational requests are necessary to deliver the online
              catalogue. Vercel processes this information to provide hosting,
              security, and troubleshooting under its applicable service and
              privacy terms. Other Bali does not use this operational data for
              advertising or cross-service tracking. If you do not want a new
              request processed, you can avoid refreshing while online, use
              material you already saved offline, or uninstall the app.
            </p>
            <p className="mt-3">
              Opening Maps, an official website, or the system share sheet is a
              user-initiated handoff. Those destinations handle information
              under their own policies. You can remove individual Saved items
              inside the app; uninstalling it removes its remaining local data.
              The privacy choices page below controls the browser website only,
              not the mobile app&apos;s on-device Saved data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Website data
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
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
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
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
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
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Services you choose to open
            </h2>
            <p className="mt-3">
              Other Bali may hand you to Google Maps, WhatsApp, or TablePilot.
              Those services are separate from Other Bali and handle the
              information you give them under their own policies.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Your choices
            </h2>
            <p className="mt-3">
              You can clear your browser cookies to reset the anonymous Other
              Bali device reference. You can also choose not to redeem an offer
              if you do not want a redemption recorded. To have the interaction
              events tied to your device reference deleted from our records,
              email us at{" "}
              <a
                className="inline-flex min-h-11 items-center text-[var(--lagoon)]"
                href="mailto:support@otherbali.com"
              >
                support@otherbali.com
              </a>{" "}
              and we will remove them.
            </p>
            <p className="mt-3">
              On the browser website, you can also turn analytics on or off, or
              forget the browser&apos;s device reference, on the{" "}
              <Link href="/privacy/choices" className="text-[var(--lagoon)] underline underline-offset-2">
                privacy choices
              </Link>{" "}
              page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Contact
            </h2>
            <p className="mt-3">
              For privacy or support questions, contact{" "}
              <a
                className="inline-flex min-h-11 items-center text-[var(--lagoon)]"
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
