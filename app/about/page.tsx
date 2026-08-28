import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import SiteFooter from "@/components/SiteFooter";
import { CANONICAL_SITE_ORIGIN } from "@/lib/site-origin-policy";

export const metadata: Metadata = {
  title: "About Other Bali",
  description:
    "How Other Bali selects places, verifies changing facts and protects editorial recommendations from paid placement.",
  alternates: { canonical: "/about" },
  openGraph: {
    url: `${CANONICAL_SITE_ORIGIN}/about`,
    title: "About Other Bali",
    description:
      "Our editorial method, evidence rules and approach to changing Bali venue information.",
    type: "article",
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${CANONICAL_SITE_ORIGIN}/about#page`,
  url: `${CANONICAL_SITE_ORIGIN}/about`,
  name: "About Other Bali",
  description:
    "Other Bali's editorial method, evidence rules and approach to changing venue information.",
  isPartOf: { "@id": `${CANONICAL_SITE_ORIGIN}/#website` },
  about: { "@id": `${CANONICAL_SITE_ORIGIN}/#organization` },
  dateModified: "2026-08-28",
};

export default function AboutPage() {
  return (
    <div className="page-dark">
      <main className="site-shell venue-page-pad">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
        />
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "About" }]} />

        <header className="guide-section" style={{ marginTop: 28 }}>
          <p className="guide-kicker">Our method</p>
          <h1>Other Bali helps you decide where to go and why.</h1>
          <div className="guide-prose">
            <p>
              We are a resident-curated decision guide for Bali. We narrow a
              crowded market into useful choices for a particular moment, explain
              the fit and hand the next action to the venue, its provider or
              Google Maps.
            </p>
          </div>
        </header>

        <section className="guide-section">
          <h2>How a place becomes publishable</h2>
          <div className="guide-prose">
            <p>
              A public place page needs a clear identity and location, an
              editorial reason to choose it, who it suits, a practical offering or
              price anchor and a verified map handoff. Missing facts are omitted
              rather than guessed and recorded for editorial follow-up.
            </p>
            <p>
              We introduce publication checks in stages. An existing active,
              published venue is not removed solely because optional decision fields
              are incomplete; inactive, unpublished or structurally invalid records
              remain blocked.
            </p>
            <p>
              Public claims must come from an official venue or provider source,
              a partner submission, recorded editorial research or an approved
              internal evidence record. We do not republish Google review prose or
              turn unverified marketing copy into editorial fact.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>How we handle changing information</h2>
          <div className="guide-prose">
            <p>
              Menus, prices, opening details and action links change. Where a
              source and verification date are available, we show them. Expired or
              insufficiently supported structured data is removed from the public
              view or clearly downgraded to an official-source link.
            </p>
            <p>
              A checked date is evidence of the recorded review, not a promise of
              live availability. Confirm plans that matter directly with the
              venue.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Editorial order cannot be bought</h2>
          <div className="guide-prose">
            <p>
              Organic recommendations are selected for traveller fit. We do not sell sponsored placement, paid visibility or organic ranking.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>What Other Bali does not claim</h2>
          <div className="guide-prose">
            <ul>
              <li>We do not publish copied reviews or invented public ratings.</li>
              <li>We do not claim live tables, stock, prices or availability without provider data.</li>
              <li>We do not confirm bookings or process tourist payments.</li>
              <li>We do not replace Google Maps for routing, traffic or navigation.</li>
            </ul>
          </div>
        </section>

        <section className="guide-section">
          <h2>Corrections and questions</h2>
          <div className="guide-prose">
            <p>
              If a fact is outdated or you represent a listed venue, email{" "}
              <a href="mailto:hello@otherbali.com">hello@otherbali.com</a>. We use
              corrections to update the evidence record, not to sell organic
              placement.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
