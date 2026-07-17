import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import VenueSubmissionForm from "@/components/VenueSubmissionForm";
import { GuideFooter } from "@/components/GuideBlocks";
import { VENUES_WHATSAPP_URL } from "@/lib/contact";

// Public venue self-submission page. Net-new venues (not yet in the catalogue)
// request a listing here; the request enters the needs_verification queue and
// is reviewed by hand — nothing publishes automatically. This is indexable on
// purpose: owners search "how to get listed on <guide>". Guardrails: no paid
// ranking, no payment, curated (a request is not a guaranteed listing).

export const metadata: Metadata = {
  title: "Add your place — get listed on Other Bali",
  description:
    "Run a café, restaurant, warung, spa, bar or studio in Bali? Get listed on Other Bali, the resident-curated guide. First 2 months are a free test — no fees, and travellers never pay.",
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

const STEPS = [
  {
    title: "You send the basics",
    body: "Name, area, and one way to reach you — WhatsApp, email or Instagram. Two minutes.",
  },
  {
    title: "We check it by hand",
    body: "We're a curated guide, not an open directory. We look at every place before adding it, so a request isn't an automatic listing.",
  },
  {
    title: "We build your page",
    body: "If it's a fit, we write your card, then send a private link so you can confirm the details and add your own photos.",
  },
];

export default function ForVenuesPage() {
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
          <h1 className="guide-title">Add your place to Other Bali</h1>
          <p className="guide-standfirst">
            Other Bali is a resident-curated guide that helps travellers pick the
            right place for the moment they&apos;re in. If you run a café,
            restaurant, warung, bar, beach club, spa or studio and you&apos;re not
            on the guide yet, request a listing below. Your first 2 months are a
            free test — no fees, and travellers never pay. After that, only if
            we&apos;re clearly bringing you guests, we&apos;d discuss a light
            subscription or a small commission on confirmed bookings — always
            agreed with you first, never automatic.
          </p>
        </header>

        <section className="guide-section">
          <h2>How it works</h2>
          <ol className="guide-prose" style={{ marginTop: 12 }}>
            {STEPS.map((s) => (
              <li key={s.title} style={{ marginBottom: 10 }}>
                <strong>{s.title}.</strong> {s.body}
              </li>
            ))}
          </ol>
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
                <strong>2 months free, no strings.</strong> Your first 2 months
                are a free test — no fees, no card, nothing automatic. After
                that, only if we&apos;re clearly bringing you guests, we&apos;d
                talk about a light subscription or a small commission on
                confirmed bookings — and only with your agreement.
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
                <strong>Your photos stay yours.</strong> We only publish photos you
                send us and confirm you have the rights to — never scraped images.
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
