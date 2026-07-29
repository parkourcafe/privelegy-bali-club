import Link from "next/link";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How Other Bali handles mobile and website data, what we do and don't store, and your choices. Travellers never need an account.",
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
        <p className="mt-3 text-sm text-[var(--muted)]">Last updated: July 30, 2026</p>

        <div className="mt-10 space-y-8 text-[var(--muted)]">
          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Mobile app
            </h2>
            <p className="mt-3">
              The Other Bali mobile app does not require an account. It creates
              a random pseudonymous guest reference for the installation. The
              reference is not your name, email address, phone number or
              advertising identifier. The app sends it in encrypted HTTPS
              requests so Supabase can keep your cloud state associated with
              that installation.
            </p>
            <p className="mt-3">
              The app keeps a catalogue cache and navigation state on your
              device. When cloud sync is available, it sends the place or event
              references you save or add to Today, Trip titles and dates, chosen
              areas and travel style, Trip stops and order, notes, visited
              state, and the versions and request identifiers needed for
              reliable offline sync. Supabase stores this sync state for Other
              Bali. A Decision request transiently sends choices such as area,
              company, moment, budget and where you want the day to end so the
              server can return suggestions; the current mobile route does not
              store that Decision request or a guest-linked feed session.
            </p>
            <p className="mt-3">
              Location is requested only after you choose Use my current area.
              Your device converts the raw GPS coordinates to one of the
              supported Bali areas. Raw GPS coordinates are not stored by Other
              Bali or sent to our API through that feature; the derived area and
              the venue choices you make can be sent as part of decision or sync
              state. You can deny location and choose an area manually.
            </p>
            <p className="mt-3">
              Mutable cloud state remains associated with the active
              pseudonymous guest reference until you remove it with the
              in-app deletion action, use the external browser privacy choice
              for browser state, or ask support to review a deletion request.
            </p>
            <p className="mt-3">
              Offline Mapbox downloads and onboard routing are unavailable in
              this release. The native provider remains blocked and its
              telemetry is disabled. If a tested download or routing control is
              introduced later, this notice and the store disclosures will be
              updated before that feature is released.
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
              advertising or cross-service tracking.
            </p>
            <p className="mt-3">
              Opening Maps, an official website, or the system share sheet is a
              user-initiated handoff. Those destinations handle information
              under their own policies. You can remove individual items inside
              the app. Delete cloud data removes the app&apos;s pseudonymous
              Saved, Today, Trip, notes, visited, decision, feed and sync state
              from our database after the server confirms deletion. Uninstalling
              removes remaining local app data, but uninstalling alone cannot
              ask the server to delete cloud state; use the in-app action first
              or copy the displayed Anonymous Guest Reference and include it
              when contacting support through this external privacy page.
            </p>
            <p className="mt-3">
              After confirmed deletion, the server keeps only a bare revoked
              pseudonymous guest reference and its erasure timestamp under the
              old installation reference, so an old or delayed app request
              cannot recreate the deleted state. It has no Saved, Today, Trip,
              note, visited, decision, feed, source or area data attached to it.
              This revocation marker is kept indefinitely so the old reference
              cannot become active again. The separately detached redemption
              proof exception, when one exists, is described under Your choices
              below.
            </p>
            <p className="mt-3">
              The mobile app does not include advertising, cross-app tracking,
              advertising analytics SDKs, or a data-broker integration. Mapbox
              telemetry is disabled in the current release.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Website data
            </h2>
            <p className="mt-3">
              The website uses a random pseudonymous browser reference in a
              strictly necessary httpOnly cookie to keep requested Saved and
              redeemed-offer state associated with this browser and to count
              whether a guest came from an Other Bali link or QR code. We may
              record basic interaction events, such as source scans, card opens,
              directions clicks, reservation clicks, and offer redemptions.
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
              Optional analytics
            </h2>
            <p className="mt-3">
              Google Analytics 4 is off until you choose Accept. If you accept,
              Google processes page views and privacy-limited interaction events
              such as Maps, menu, reservation, WhatsApp, and delivery handoffs.
              Those events use page or venue references, not names, email
              addresses, phone numbers, payment details, or reservation details.
              Advertising storage, ad personalization, and cross-app tracking
              remain disabled.
            </p>
            <p className="mt-3">
              Choosing Essential only keeps Google Analytics unloaded. You can
              change or withdraw your choice at any time on the privacy choices
              page. Other Bali still uses the strictly necessary operational and
              attribution records described above to deliver requested features.
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
              The mobile app&apos;s Delete cloud data action removes its mutable
              pseudonymous cloud state and clears the app reference only after
              the server confirms deletion. The external privacy choices page
              can do the same for the separate browser reference. If you cannot
              access the app, send the displayed Anonymous Guest Reference that
              you copied before uninstalling to{" "}
              <a
                className="inline-flex min-h-11 items-center text-[var(--lagoon)]"
                href="mailto:support@otherbali.com"
              >
                support@otherbali.com
              </a>{" "}
              .
            </p>
            <p className="mt-3">
              If redemption proof already exists, the automated action keeps
              that proof and its corresponding granted redemption consent
              evidence, but moves both to a new internal pseudonymous anchor
              that is not returned to the app, is no longer linked to the
              installation reference, and removes device fields such as the
              consent user agent. These detached records are retained only
              while needed to substantiate the completed redemption, complete
              accounting, resolve a dispute, or meet an applicable legal
              requirement; they are deleted when none of those purposes remains.
              Other consent rows tied to that guest reference are deleted.
              Venue-photo rights consent is a separate operator record and is
              not tied to the mobile guest reference. Because the old Anonymous
              Guest Reference is intentionally detached, it cannot locate this
              proof after deletion. For a separately reviewed request, contact
              us with the venue, approximate redemption date and confirmation
              code if available. You can choose not to redeem an offer if you
              do not want a new redemption recorded.
            </p>
            <p className="mt-3">
              On the website, you can also turn optional analytics on or off, or
              delete the browser&apos;s mutable pseudonymous state, on the{" "}
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
