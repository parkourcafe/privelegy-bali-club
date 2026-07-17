import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import VenueSubmissionForm from "@/components/VenueSubmissionForm";
import { GuideFooter } from "@/components/GuideBlocks";
import { existsSync } from "node:fs";
import path from "node:path";
import { VENUES_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Public venue self-submission page — founder-approved redesign (2026-07-17):
// hero with proof chips, a two-path split (outreach recipients with a prepared
// page vs net-new requests), how-it-works, a resident-way video loop, then the
// request form. Net-new requests enter the needs_verification queue and are
// reviewed by hand — nothing publishes automatically. Indexable on purpose:
// owners search "how to get listed on <guide>". Guardrails: no paid ranking,
// no payment, curated (a request is not a guaranteed listing).

export const metadata: Metadata = {
  title: "Add your place — get listed on Other Bali",
  description:
    "Run a café, restaurant, warung, spa, bar or studio in Bali? Get listed on Other Bali, the resident-curated guide. First 2 months are free — no fees, and travellers never pay.",
  alternates: { canonical: "/for-venues" },
  openGraph: {
    title: "Add your place · Other Bali",
    description:
      "Get listed on Other Bali — the resident-curated Bali guide. First 2 months free, travellers never pay.",
    url: "https://www.otherbali.com/for-venues",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add your place · Other Bali",
    description:
      "Get listed on Other Bali — the resident-curated Bali guide. First 2 months free.",
  },
};

const CHIPS = [
  { title: "2 months free", note: "no fees, no card" },
  { title: "Travellers never pay", note: "free on their side, always" },
  { title: "Curated by hand", note: "placement can't be bought" },
];

const STEPS = [
  {
    title: "You send the basics",
    body: "Name, area, and one way to reach you — WhatsApp, email or Instagram. Two minutes.",
  },
  {
    title: "We check it by hand",
    body: "A curated guide, not an open directory. We look at every place first — a request isn't an automatic listing.",
  },
  {
    title: "We build your page",
    body: "If it's a fit, we write your card and send a private link so you confirm details and add your own photos and video.",
  },
];

export default function ForVenuesPage() {
  // The narrated story ships via the prebuild scene fetch; in environments
  // where the CDN is unreachable the file is absent and the block simply
  // doesn't render (checked at build time — the page is static).
  const storyReady = existsSync(
    path.join(process.cwd(), "public", "scenes", "venues-story.mp4")
  );
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="for-venues" />
        <div className="flex items-start justify-between">
          <BrandHomeLink />
          <Link href="/" className="quiet-link">
            Back to the guide →
          </Link>
        </div>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Add your place" }]} />

        <header className="guide-hero">
          <p className="guide-kicker">For venues · free listing</p>
          <h1 className="guide-title">Add your place to Other Bali.</h1>
          <p className="guide-standfirst">
            The resident-curated guide that helps travellers pick the right
            place for the moment they&apos;re in. Run a café, restaurant,
            warung, bar, beach club, spa or studio? Request a listing below.
          </p>
          <div className="hero-actions" style={{ marginTop: 18 }}>
            <a href="#submit" className="button-primary button-large">
              Request a listing
            </a>
            <a
              href={VENUES_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary button-large"
            >
              WhatsApp {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {CHIPS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4">
                <p className="font-bold">{c.title}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{c.note}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Two paths — outreach recipients already have a prepared page. */}
        <section className="guide-section">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <h2 className="text-lg font-bold">Already on the guide?</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Your page may already be prepared. If we messaged you on
                WhatsApp, it takes 2 minutes:
              </p>
              <ol className="guide-prose mt-3 text-sm">
                <li>Open your page via the private link</li>
                <li>Check the info — add photos, video or menu updates</li>
                <li>
                  Tick <strong>&ldquo;I agree&rdquo;</strong> — and we publish
                </li>
              </ol>
              <p className="mt-3 text-xs text-[var(--muted)]">
                We review all updates before they go live. Can&apos;t find the
                message?{" "}
                <a
                  href={VENUES_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--lagoon-strong)]"
                >
                  Ask us on WhatsApp
                </a>
                .
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <h2 className="text-lg font-bold">Not listed yet?</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Request a listing — two minutes. Name, area, one way to reach
                you. We check every place by hand and build the page for you.
              </p>
              <p className="mt-3 text-sm">
                <strong>Why it&apos;s worth it:</strong> travellers book a
                table, order delivery or takeaway, message you on WhatsApp or
                open directions — directly, no middleman. Travellers never pay.
              </p>
              <a href="#submit" className="mt-3 inline-block font-bold text-[var(--lagoon-strong)]">
                Fill the form ↓
              </a>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>How it works</h2>
          <ol className="guide-prose" style={{ marginTop: 12 }}>
            {STEPS.map((s) => (
              <li key={s.title} style={{ marginBottom: 10 }}>
                <strong>{s.title}.</strong> {s.body}
              </li>
            ))}
          </ol>
          {storyReady && (
            <figure
              className="overflow-hidden rounded-2xl border border-[var(--line)]"
              style={{ marginTop: 20 }}
            >
              {/* Click-to-play (browsers block autoplay with sound); subtitles
                  are burned in, so it also reads fine muted. */}
              <video
                controls
                playsInline
                preload="metadata"
                src="/scenes/venues-story.mp4"
                className="block w-full"
                aria-label="Other Bali for venues — a 35-second introduction"
              />
              <figcaption className="px-4 py-2 text-xs text-[var(--muted)]">
                Other Bali in 35 seconds — what travellers see, and what your
                place gets. Sound on 🔊
              </figcaption>
            </figure>
          )}
        </section>

        <section className="guide-section" id="submit">
          <h2>Request a listing</h2>
          <p className="guide-lede">
            Tell us about your place. We&apos;ll take it from there. Questions
            first?{" "}
            <a
              href={VENUES_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[var(--lagoon-strong)]"
            >
              Message us on WhatsApp
            </a>
            .
          </p>
          <div style={{ marginTop: 16, maxWidth: 520 }}>
            <VenueSubmissionForm />
          </div>
        </section>

        <section className="guide-section">
          <h2>Good to know</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>2 months free, no strings.</strong> No fees, no card,
                nothing automatic. After that — only if we&apos;re clearly
                bringing you guests — a light subscription or a small commission
                on confirmed bookings, always agreed with you first.
              </li>
              <li>
                <strong>Travellers never pay.</strong> The guide is free to use
                on their side, always. Placement is editorial — you can&apos;t
                buy a ranking.
              </li>
              <li>
                <strong>We curate.</strong> We add places we can stand behind, so a
                request is a request — not a guaranteed listing.
              </li>
              <li>
                <strong>Your photos stay yours.</strong> We only publish photos and
                video you send us and confirm you have the rights to — never
                scraped images.
              </li>
              <li>
                <strong>Already have a page?</strong> If we&apos;ve already built
                one for you, use the private link we sent on WhatsApp to confirm it
                — no need to submit here.
              </li>
            </ul>
          </div>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
