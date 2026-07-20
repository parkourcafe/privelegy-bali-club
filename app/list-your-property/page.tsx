import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PropertySubmissionForm from "@/components/PropertySubmissionForm";
import { GuideFooter } from "@/components/GuideBlocks";
import { WHATSAPP_NUMBER_DISPLAY, whatsappLink } from "@/lib/contact";

// Unified property (villa + hotel) submission page — the intake behind the
// "Add your villa / hotel" CTAs on /villas and /hotels. A partner fills in
// their own details, links and (later) photos and sends a review request; we
// build the draft and publish only once they approve. Reuses the existing
// /api/venue-submission intake — no new DB entity, no payment, curated by hand.

export const metadata: Metadata = {
  title: "Add your property — partner with Other Bali",
  description:
    "Villa, hotel or resort in Bali? Add it to Other Bali, the resident-curated guide. Fill in your details and your own links, we build the page, and publish only once you approve — completely free.",
  alternates: { canonical: "/list-your-property" },
  openGraph: {
    title: "Add your property · Other Bali",
    description:
      "Add your villa or hotel to Other Bali — you send the details, we build the page, and publish only once you approve. Completely free.",
    url: "https://www.otherbali.com/list-your-property",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Add your property · Other Bali",
    description:
      "Add your villa or hotel to Other Bali — completely free, and travellers never pay.",
  },
};

const NEXT = [
  "You send this form.",
  "We build a draft page and send it to you.",
  "You approve — nothing goes live before that.",
  "Published on otherbali.com.",
];

const PROPERTY_WHATSAPP_URL = whatsappLink(
  "Hi Other Bali 👋 I'd like to add my property (villa / hotel). Here are the details:\n\nName:\nType (villa / hotel / resort):\nArea:\nLinks (website / booking / Instagram):"
);

export default async function ListYourPropertyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const initialKind = type === "villa" ? "villa" : "hotel";

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="list-your-property" />
        <div className="flex items-start justify-between">
          <BrandHomeLink />
          <Link href="/" className="quiet-link">
            Back to the guide →
          </Link>
        </div>

        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Add your property" }]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Partner submission · completely free</p>
          <h1 className="guide-title">Add your place to Other Bali.</h1>
          <p className="guide-standfirst">
            Fill in what you can, add your own links, and send it over. We&apos;ll
            build the page, send it back for your review, and publish only once
            you approve. No fees, and travellers never pay.
          </p>
        </header>

        <section className="guide-section" id="add">
          <PropertySubmissionForm initialKind={initialKind} />
        </section>

        <section className="guide-section">
          <h2>What happens next</h2>
          <ol className="guide-prose" style={{ marginTop: 12 }}>
            {NEXT.map((step) => (
              <li key={step} style={{ marginBottom: 8 }}>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-[var(--muted)]">
            We review by hand and reply on WhatsApp or email, usually within a
            couple of days. A request isn&apos;t a guaranteed listing — we check
            every place first.
          </p>
        </section>

        <section className="guide-section">
          <h2>Already have a page with us?</h2>
          <p className="guide-lede">
            Use the private link we sent on WhatsApp to confirm it — no need to
            submit again. Can&apos;t find the message?{" "}
            <a
              href={PROPERTY_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[var(--lagoon-strong)]"
            >
              Ask us on WhatsApp {WHATSAPP_NUMBER_DISPLAY}
            </a>
            .
          </p>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
