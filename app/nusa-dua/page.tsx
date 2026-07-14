import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getNusaDuaVenues, toNusaDuaPlaceCard } from "@/lib/nusa-dua";
import {
  NUSA_DUA_FAQ,
  NUSA_DUA_REVIEW_DATE,
  NUSA_DUA_THINGS_TO_DO,
  NUSA_DUA_ZONES,
} from "@/lib/nusa-dua/content";
import type { VenueWithPerk } from "@/lib/data";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Nusa Dua guide — the calm, polished resort enclave",
  description:
    "A resident-curated Nusa Dua guide: who the gated resort enclave suits, its calm swimmable beaches, the best things to do, resort fine dining and some of Bali's biggest spas.",
  alternates: { canonical: "/nusa-dua" },
  openGraph: {
    title: "The Nusa Dua guide · Other Bali",
    description: "The resort enclave — calm beaches, things to do, fine dining and big resort spas.",
    url: `${BASE}/nusa-dua`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Nusa Dua guide · Other Bali",
    description: "The resort enclave — calm beaches, things to do, fine dining and big resort spas.",
  },
};

// Guide chips — quick nav to every Nusa Dua child (mirrors the Seminyak pillar).
const NUSA_DUA_CHIPS: { href: string; label: string }[] = [
  { href: "/nusa-dua/things-to-do", label: "Things to do" },
  { href: "/nusa-dua/best-restaurants", label: "Restaurants" },
  { href: "/nusa-dua/spas-wellness", label: "Spas & wellness" },
];

const previewThings = NUSA_DUA_THINGS_TO_DO.slice(0, 4);

function TopPicks({ title, note, venues, href }: { title: string; note: string; venues: VenueWithPerk[]; href: string }) {
  if (venues.length === 0) return null;
  return (
    <section className="guide-section">
      <div className="flex items-baseline justify-between gap-4">
        <h2>{title}</h2>
        <Link href={href} className="quiet-link">See all →</Link>
      </div>
      <p className="text-sm text-[var(--muted)]">{note}</p>
      <div className="pick-grid" style={{ marginTop: 16 }}>
        {venues.slice(0, 3).map((v) => (
          <PlaceCard key={v.slug} place={toNusaDuaPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function NusaDuaPillarPage() {
  const venues = await getNusaDuaVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant" || v.category === "warung" || v.category === "beach_club");
  const wellness = venues.filter((v) => v.category === "spa" || v.category === "fitness" || v.category === "yoga");

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Nusa Dua" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${BASE}${c.href}` } : {}),
    })),
  };

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="nusa-dua" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Nusa Dua · South-east coast</p>
          <h1 className="hero-title mt-2">Nusa Dua, the calm resort enclave</h1>
          <p className="hero-copy">
            A gated, manicured enclave of beachfront five-star resorts on Bali&apos;s
            south-east tip: calm swimmable beaches, a walkable seafront promenade,
            resort fine dining and some of the island&apos;s biggest spas. It&apos;s
            the low-friction, family-safe end of Bali — this guide covers who it
            suits, its beaches, what to do, where to eat and where to be looked
            after, curated from places we actually rate.
          </p>
          <p className="guide-meta-line">
            Editorial review: {NUSA_DUA_REVIEW_DATE} · researched, not sponsored · no paid ranking
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/places?district=nusa-dua" className="button-secondary button-large">Browse all Nusa Dua places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Nusa Dua guides">
          {NUSA_DUA_CHIPS.map((c) => (
            <Link key={c.href} href={c.href} className="chip">
              {c.label}
            </Link>
          ))}
        </nav>

        <section className="guide-section">
          <h2>Who Nusa Dua suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> families with young children, couples on a
              relaxed break, first-time visitors who want easy and secure
              logistics, and anyone who values a calm, swimmable beach and a
              polished resort over an independent scene.
            </p>
            <p>
              <strong>It frustrates</strong> travellers who want nightlife, a
              dense strip of independent cafés, or a walkable local neighbourhood —
              the enclave is intentionally manicured and quiet, and most character
              beyond the resorts sits a short drive away. Surfers belong on the
              west coast or the Bukit.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>The beaches: three zones</h2>
          <p className="guide-lede">
            Nusa Dua and its neighbours sit inside a reef-protected bay, so the
            water is genuinely calm — unusual for south Bali. Pick the zone by mood.
          </p>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Zone</th>
                  <th scope="col">Character</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                {NUSA_DUA_ZONES.map((z) => (
                  <tr key={z.key}>
                    <th scope="row">{z.label}</th>
                    <td>{z.character}</td>
                    <td>{z.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="guide-section">
          <h2>Best things to do</h2>
          <p className="guide-lede">
            More than the resort pool: a beach promenade, the Water Blow, a
            clifftop temple, a Pacific-art museum and the Tanjung Benoa
            watersports hub.{" "}
            <Link href="/nusa-dua/things-to-do" className="font-bold text-[var(--lagoon-strong)]">
              The full things-to-do guide →
            </Link>
          </p>
          <ul className="guide-prose">
            {previewThings.map((t) => (
              <li key={t.title}>
                <strong>{t.title}.</strong> {t.blurb}
              </li>
            ))}
          </ul>
        </section>

        <TopPicks title="Best restaurants" note="Resort fine dining, beachfront tables and a few local spots." venues={restaurants} href="/nusa-dua/best-restaurants" />
        <TopPicks title="Spas & wellness" note="Some of Bali's biggest resort spas, plus fitness and yoga." venues={wellness} href="/nusa-dua/spas-wellness" />

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>The water really is calm.</strong> A reef fronts the bay,
                so Nusa Dua and Tanjung Benoa are among the safest swimming beaches
                in south Bali — a big part of why families choose it.
              </li>
              <li>
                <strong>Time the tide at Geger.</strong> The southern beach is
                lovely but shows seaweed flats and rock pools at low tide; go at
                high tide for a proper swim.
              </li>
              <li>
                <strong>It&apos;s a base for calm, not chaos.</strong> Expect
                resort dining and a quiet promenade rather than nightlife or a
                café strip. For a livelier scene, Seminyak and Canggu are up the
                coast; the Bukit&apos;s cliffs are just west.
              </li>
              <li>
                <strong>Watersports mean Tanjung Benoa.</strong> The peninsula
                just north is the hub — parasailing, jet ski, banana boat and the
                glass-bottom boat to Turtle Island all launch from there.
              </li>
              <li>
                <strong>Eat and be looked after.</strong> See the{" "}
                <Link href="/nusa-dua/best-restaurants" className="font-bold text-[var(--lagoon-strong)]">restaurants</Link> and{" "}
                <Link href="/nusa-dua/spas-wellness" className="font-bold text-[var(--lagoon-strong)]">spas &amp; wellness</Link> guides.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={NUSA_DUA_FAQ} />

        <RelatedGuides
          links={[
            { href: "/nusa-dua/things-to-do", title: "Best things to do in Nusa Dua", blurb: "The promenade, Water Blow, Geger, Museum Pasifika and Tanjung Benoa." },
            { href: "/nusa-dua/best-restaurants", title: "Best restaurants in Nusa Dua", blurb: "Resort fine dining, beachfront tables and a few local spots." },
            { href: "/nusa-dua/spas-wellness", title: "Best spas & wellness in Nusa Dua", blurb: "Some of Bali's biggest resort spas, plus fitness and yoga." },
            { href: "/sanur", title: "The Sanur guide", blurb: "A calmer, walkable sunrise base up the coast." },
          ]}
        />

        <div className="cta-band">
          <h2>Use Nusa Dua as your calm base</h2>
          <p>
            Swim from a reef-protected beach, walk the promenade to dinner, and
            still reach the Bukit&apos;s cliffs and watersports in minutes. Start
            with the zone that fits your trip, then pick the resort.
          </p>
          <Link href="/nusa-dua/things-to-do" className="cta-band-action">
            See the things-to-do guide →
          </Link>
        </div>

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("nusa-dua")} />

        <GuideFooter />
      </main>
    </div>
  );
}
