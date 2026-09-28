import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, GuideFooter, RelatedGuides } from "@/components/GuideBlocks";

const BASE = "https://www.otherbali.com";
const PATH = "/bali-bird-park-tickets";
const BOOKING = "https://booking.balibirdpark.com/ticket-info?visitor_type=international";
const SCHEDULE = "https://www.balibirdpark.com/daily-schedule/";

export const metadata: Metadata = {
  title: "Bali Bird Park tickets: entry or lunch?",
  description:
    "Compare Bali Bird Park entry and lunch tickets: dated prices, what's included, children's tickets, meal times and booking terms to check.",
  alternates: { canonical: PATH },
  openGraph: {
    title: "Bali Bird Park tickets: entry or lunch? · Other Bali",
    description:
      "Choose between standard entry and the lunch package with checked prices and the practical differences.",
    url: BASE + PATH,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bali Bird Park tickets: entry or lunch? · Other Bali",
    description: "Compare the two official ticket options before you book.",
  },
};

const faq = [
  {
    q: "Do I need the lunch ticket to see the bird shows?",
    a: "No. Bali Bird Park lists its bird shows, feeding sessions and 4D Cinema with the standard Visit Only ticket. The lunch package adds a set-menu meal.",
  },
  {
    q: "What ages qualify for a child ticket?",
    a: "The official booking product describes the child ticket as ages 2–12 and says children under two enter free. The park's general FAQ says 'below 12', so check the age shown for your selected ticket if your child is 12.",
  },
  {
    q: "Can I change or refund a discounted Bali Bird Park ticket?",
    a: "Do not assume so. The booking form describes general advance-change rules, but separately says its Promo Rate cannot be changed or refunded. Check the terms attached to your selected price before paying.",
  },
  {
    q: "When is lunch served with the package?",
    a: "The official booking form lists 12:00 and 13:30 lunch slots at Bali Starling Restaurant. Choose a slot that leaves room for the programmes you want to see.",
  },
];

export default function BaliBirdParkTicketsPage() {
  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Bali travel guides", href: "/guides" },
    { name: "Bali Bird Park tickets" },
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Bali Bird Park tickets: entry or lunch?",
    description: metadata.description,
    url: BASE + PATH,
    datePublished: "2026-09-28",
    dateModified: "2026-09-28",
    isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
  };

  return (
    <div>
      <main className="site-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">Which Bali Bird Park ticket should you choose: entry or lunch?</h1>
          <p className="guide-lede">
            Choose <strong>Visit Only</strong> if you want the bird shows and the freedom to eat when you like.
            Choose <strong>Visit + Lunch with the Bird Stars</strong> if a set-menu meal inside the park is
            part of your plan and you can make a 12:00 or 13:30 lunch slot. The standard ticket already
            includes the main programmes.
          </p>
          <p className="guide-meta-line">
            Ticket prices checked 28 September 2026 for a visit that day · official sources · prices change
          </p>
        </header>

        <section className="guide-section">
          <h2>The difference between the two tickets</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border border-[var(--border)] p-5">
              <h3>Visit Only</h3>
              <p>Entry, bird shows, feeding sessions and 4D Cinema are listed in the standard ticket.</p>
              <p><strong>Good fit:</strong> You want to plan your own food break and keep the day flexible.</p>
              <p><strong>Less useful if:</strong> You specifically want lunch arranged at Bali Starling Restaurant.</p>
            </article>
            <article className="rounded-xl border border-[var(--border)] p-5">
              <h3>Visit + Lunch with the Bird Stars</h3>
              <p>Standard entry and programmes, plus a set-menu lunch at Bali Starling Restaurant.</p>
              <p><strong>Good fit:</strong> Eating in the park is part of your day and 12:00 or 13:30 works.</p>
              <p><strong>Less useful if:</strong> You prefer to choose your own meal or avoid a fixed lunch time.</p>
            </article>
          </div>
        </section>

        <section className="guide-section">
          <h2>Prices on the date we checked</h2>
          <p>
            The <a href={BOOKING} target="_blank" rel="noreferrer">official international booking form</a> showed
            these prices on 28 September 2026 for a visit on 28 September 2026:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li><strong>Visit Only:</strong> IDR 308,000 per adult; IDR 212,000 per child.</li>
            <li><strong>Visit + Lunch:</strong> IDR 428,000 per adult; IDR 300,000 per child.</li>
          </ul>
          <p className="mt-3">
            The lunch option therefore cost IDR 120,000 more per adult and IDR 88,000 more per child
            on that date. The booking form displayed reduced prices beside crossed-out base prices.
            Your date and selected rate may differ. Check the final amount in the official booking form.
          </p>
          <p className="mt-3">
            The ticket product describes child admission as ages <strong>2–12</strong> and entry below age two as free.
            The park's general FAQ uses different wording for the upper age limit, so check your chosen
            product if your child is 12.
          </p>
        </section>

        <section className="guide-section">
          <h2>What standard entry already includes</h2>
          <p>
            The Visit Only product lists park entry, bird shows and feeding sessions without an
            additional charge, plus 4D Cinema and the activities marked on the park map. Paying for
            lunch does not unlock a separate tier of access to those main programmes.
          </p>
          <p className="mt-3">
            The park's <a href="https://www.balibirdpark.com/faq/" target="_blank" rel="noreferrer">official FAQ</a> lists
            daily opening hours of <strong>09:00–17:30</strong>. Look at the{" "}
            <a href={SCHEDULE} target="_blank" rel="noreferrer">daily programme schedule</a> before choosing
            your arrival time. Programme times can change; this guide does not guarantee a particular show.
          </p>
        </section>

        <section className="guide-section">
          <h2>When the lunch package makes sense</h2>
          <p>
            The extra purchase is for a set-menu meal at Bali Starling Restaurant. The booking form
            gives two lunch times, <strong>12:00</strong> and <strong>13:30</strong>, and says you choose from the
            set menu at the restaurant. If you buy this ticket, pick your lunch time first and place
            the shows you care about around it.
          </p>
          <p className="mt-3">
            Visit Only gives you more room to change your pace, especially if a child needs an
            unscheduled break. That is an editorial judgement based on the fixed meal times;
            it is not a promise about queues or how long your visit will take.
          </p>
        </section>

        <section className="guide-section">
          <h2>Choose the right visitor rate and check cancellation terms</h2>
          <p>
            The booking form asks you to choose Domestic Guest or International Guest. The
            international ticket terms require a foreign passport or KITAS at entry and say a
            different ticket category may lead to an additional charge at the gate. Take the
            document that supports the category you book.
          </p>
          <p className="mt-3">
            The form gives general rules for changes or cancellations requested at least a day
            before the visit. It also says <strong>Promo Rate tickets are non-refundable and cannot be
            changed</strong>. We could not confirm which rule applied to the reduced price shown
            on the date checked. Read the terms attached to your selected rate before payment.
          </p>
        </section>

        <section className="guide-section">
          <h2>Make your choice</h2>
          <p>
            Buy <strong>Visit Only</strong> for the core park experience without a fixed meal. Buy
            <strong> Visit + Lunch with the Bird Stars</strong> if the set-menu lunch and one of its
            two time slots suit your day.
          </p>
          <p className="mt-3">
            <a href={BOOKING} target="_blank" rel="noreferrer">
              Check your date and ticket terms on Bali Bird Park's official booking site ↗
            </a>
            . The park handles payment, changes and refunds directly.
          </p>
        </section>

        <FaqBlock items={faq} heading="Bali Bird Park ticket questions" />

        <section className="guide-section">
          <h2>Sources and what we checked</h2>
          <p>
            Checked 28 September 2026:{" "}
            <a href={BOOKING} target="_blank" rel="noreferrer">official international tickets</a> for prices,
            inclusions, meal times, age and booking terms;{" "}
            <a href="https://www.balibirdpark.com/faq/" target="_blank" rel="noreferrer">the park FAQ</a> for
            opening hours; and{" "}
            <a href={SCHEDULE} target="_blank" rel="noreferrer">the daily schedule</a> for programmes.
            Price differences and advice on which option suits your day are our interpretation of
            those published terms. We did not personally inspect the park or measure queue times.
          </p>
        </section>

        <RelatedGuides
          links={[
            { href: "/bali-with-kids", title: "Bali with kids", blurb: "How to pace one main family activity and make room for rest." },
            { href: "/things-to-do-in-bali", title: "Things to do in Bali", blurb: "More ideas if you are comparing days out." },
            { href: "/guides", title: "Bali travel guides", blurb: "Plan the rest of your trip by decision and area." },
          ]}
        />
        <GuideFooter />
      </main>
    </div>
  );
}
