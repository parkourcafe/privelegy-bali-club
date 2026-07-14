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
              Other Bali uses a random browser reference to keep your redeemed
              offers, saved places, and owned shared lists connected to this
              browser. Merely browsing or choosing Essential only does not create
              that reference; it is created when you request a linked feature or
              allow analytics. If you allow analytics, that reference can also link basic
              interaction events such as source scans, card opens, directions
              clicks, and reservation clicks until you delete the linked data.
              Offer redemption records are created only when you explicitly use
              that feature.
            </p>
            <p className="mt-3">
              After browser-linked deletion, we keep only a one-way hash of the
              random reference and the deletion time so a delayed request cannot
              recreate the deleted identity. The raw reference is not retained in
              that barrier. Its final maximum retention period remains a launch
              policy requirement.
            </p>
            <p className="mt-3">
              We do not require travellers to create an account, provide a
              payment card, or build a profile. The optional guide form collects
              a first name, email or WhatsApp number, optional travel date and
              interests, language, source/UTM fields, consent time, and limited
              user-agent data so we can keep the requested guide contact and
              deduplicate submissions. Its fixed-window abuse counter is stored
              on the same contact record; it does not collect an IP address.
            </p>
            <p className="mt-3">
              If a venue uses partner onboarding, its representative may submit
              a name, optional contact, confirmation, photo-rights consent, and
              photos for private operator review. We also retain limited consent
              evidence such as time, terms version, and user agent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              No third-party tracking in the first build
            </h2>
            <p className="mt-3">
              Google Analytics and advertising trackers are disabled. We do not
              track you across other apps or websites. If third-party analytics
              is considered later, this policy and the consent surface must be
              updated before it is enabled.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              How we use it
            </h2>
            <p className="mt-3">
              We use this information to operate the guide, keep attribution
              accurate, prevent fake proof, show your own redeemed offers on this
              device, maintain the saves and lists you request, follow up through
              the guide-form channel you chose, prevent repeated automated
              submissions, and give venues aggregate results. Venues see counts
              by default, not identifiable traveller data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-[var(--ob-sand)]">
              Guide-form access and deletion
            </h2>
            <p className="mt-3">
              Guide-form contact details are stored separately from the random
              browser reference. They are not included in the browser-linked
              export or deletion available under Privacy Choices.
            </p>
            <p className="mt-3">
              To request access, correction, or deletion of a guide-form record,
              email{" "}
              <a className="text-[var(--ob-brass)]" href="mailto:support@otherbali.com">
                support@otherbali.com
              </a>{" "}
              and state whether you submitted an email or WhatsApp contact. We
              must verify control of the submitted contact before disclosing or
              deleting its record. The maximum retention period and final
              operator response procedure remain launch requirements and must be
              approved before the guide form is promoted.
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
              Analytics is optional and remains off until you allow it. You can
              change or withdraw that choice at any time. Essential features
              such as planning, directions, and booking handoffs still work.
              In the first build, an analytics choice controls only Other
              Bali&apos;s first-party usage records because Google Analytics is disabled.
            </p>
            <p className="mt-3">
              Use the{" "}
              <Link href="/privacy/choices" className="text-[var(--ob-brass)] underline underline-offset-2">
                privacy choices
              </Link>{" "}
              page to change consent, export browser-linked data, or request
              permanent browser-linked deletion without an account.
            </p>
            <p className="mt-3">
              Older unprefixed browser references are not automatically copied
              into the newer host-bound cookie because their domain origin
              cannot be proven safely. If Privacy Choices reports a legacy
              reference, it is kept intact; contact support for the secure
              export or erasure process before clearing it.
            </p>
            <Link href="/privacy/choices" className="mt-3 inline-flex min-h-11 items-center text-[var(--ob-brass)] underline">
              Manage privacy choices
            </Link>
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
