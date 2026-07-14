import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getJimbaranVenues, toJimbaranPlaceCard } from "@/lib/jimbaran";
import { JIMBARAN_GUIDES } from "@/lib/jimbaran-guides";
import {
  JIMBARAN_FAQ,
  JIMBARAN_REVIEW_DATE,
  JIMBARAN_THINGS_TO_DO,
  JIMBARAN_ZONES,
} from "@/lib/jimbaran/content";
import type { VenueWithPerk } from "@/lib/data";

const BASE = "https://www.otherbali.com";

const previewThings = JIMBARAN_THINGS_TO_DO.slice(0, 4);

export const metadata: Metadata = {
  title: "Jimbaran guide — the seafood bay, sunset bars & resort dining",
  description:
    "A resident-curated Jimbaran guide: grilled seafood on the bay at sunset, cliff-edge sunset bars, calm swimmable beaches near the airport, and some of Bali's most serious resort spas.",
  alternates: { canonical: "/jimbaran" },
  openGraph: {
    title: "The Jimbaran guide · Other Bali",
    description: "Seafood on the sand, cliff-edge sunset bars, calm bay mornings near the airport.",
    url: `${BASE}/jimbaran`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Jimbaran guide · Other Bali",
    description: "Seafood on the sand, cliff-edge sunset bars, calm bay mornings near the airport.",
  },
};

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
          <PlaceCard key={v.slug} place={toJimbaranPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function JimbaranPillarPage() {
  const venues = await getJimbaranVenues();
  const dining = venues.filter(
    (v) =>
      v.category === "restaurant" ||
      v.category === "warung" ||
      v.category === "beach_club" ||
      v.category === "bar" ||
      v.category === "cafe"
  );
  const wellness = venues.filter(
    (v) => v.category === "spa" || v.category === "fitness" || v.category === "yoga" || v.category === "beauty"
  );

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Jimbaran" }];

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
        <PageViewTracker event="district_page_view" slug="jimbaran" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Jimbaran · South coast</p>
          <h1 className="hero-title mt-2">Jimbaran, the seafood bay</h1>
          <p className="hero-copy">
            A calm, west-facing bay a short hop from the airport, famous for one
            thing above all: grilled seafood eaten near the sand at sunset. Above
            it, the headland holds cliff-edge sunset bars and some of Bali&apos;s
            most serious resort spas. This guide covers who it suits, its beaches,
            what to do, where to eat and where to be looked after — curated from
            places we actually rate, never a directory.
          </p>
          <p className="guide-meta-line">
            Editorial review: {JIMBARAN_REVIEW_DATE} · researched, not sponsored · no paid ranking
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/places?district=jimbaran" className="button-secondary button-large">Browse all Jimbaran places</Link>
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Jimbaran guides">
          <Link href="/jimbaran/things-to-do" className="chip">Things to do</Link>
          {JIMBARAN_GUIDES.map((g) => (
            <Link key={g.slug} href={`/jimbaran/${g.slug}`} className="chip">
              {g.h1.replace(" in Jimbaran", "").replace("Jimbaran ", "")}
            </Link>
          ))}
        </nav>

        <section className="guide-section">
          <h2>Who Jimbaran suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> couples and families who want a calm,
              swimmable bay, the famous grilled-seafood dinner on the sand, and a
              quiet resort base — plus anyone who wants the closest relaxed area to
              the airport for a first or last night.
            </p>
            <p>
              <strong>It frustrates</strong> travellers after nightlife, a walkable
              café strip or an independent scene — Jimbaran is a seafood-and-resort
              bay, not a hangout district. For that energy, Canggu and Seminyak are
              up the coast; the surf and cliffs are on the Bukit, just south.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>The beaches</h2>
          <p className="guide-lede">
            Jimbaran is a west-facing bay sheltered by its own curve — which is why
            the water is calm where the surf coast is not.
          </p>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Beach</th>
                  <th scope="col">Character</th>
                  <th scope="col">Swimming</th>
                </tr>
              </thead>
              <tbody>
                {JIMBARAN_ZONES.map((z) => (
                  <tr key={z.label}>
                    <th scope="row">{z.label}</th>
                    <td>{z.character}</td>
                    <td>{z.swimming}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="guide-section">
          <h2>Best things to do</h2>
          <p className="guide-lede">
            More than the seafood dinner: a morning fish market, hidden tide pools,
            a cliff-base sunset bar and a giant cultural park up the hill.{" "}
            <Link href="/jimbaran/things-to-do" className="font-bold text-[var(--lagoon-strong)]">
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

        <TopPicks title="Where to eat & drink" note="Bay seafood grills, sunset bars and resort fine dining." venues={dining} href="/jimbaran/best-restaurants" />
        <TopPicks title="Spas & wellness" note="Cliff-top resort spas, plus fitness and yoga." venues={wellness} href="/jimbaran/spas-wellness" />

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>Closest calm base to the airport.</strong> Roughly 15–30
                minutes from Ngurah Rai depending on which end — an easy first or
                last night.
              </li>
              <li>
                <strong>Agree the seafood price by weight first.</strong> The bay
                grills sell by the kilo; confirm the weight and price before it
                goes on the coals.
              </li>
              <li>
                <strong>The bay is genuinely swimmable.</strong> Its shape blocks
                the swell that hits the surf coast, so it&apos;s calm and
                family-safe — a real contrast with nearby Balangan or the Bukit.
              </li>
              <li>
                <strong>Tegal Wangi is tide-dependent.</strong> The natural rock
                pools only work at low tide, and the access path is a steep,
                rocky descent — wear proper shoes.
              </li>
              <li>
                <strong>Eat and be looked after.</strong> See the{" "}
                <Link href="/jimbaran/best-restaurants" className="font-bold text-[var(--lagoon-strong)]">dining</Link> and{" "}
                <Link href="/jimbaran/spas-wellness" className="font-bold text-[var(--lagoon-strong)]">spas &amp; wellness</Link> guides.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={JIMBARAN_FAQ} />
        <RelatedGuides
          links={[
            { href: "/jimbaran/things-to-do", title: "Best things to do in Jimbaran", blurb: "The fish market, Tegal Wangi tide pools, Rock Bar and GWK." },
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets and world-class surf, just south." },
            { href: "/nusa-dua", title: "The Nusa Dua guide", blurb: "The calm resort enclave, next door to the east." },
            { href: "/places", title: "All Bali places", blurb: "The full curated map by district." },
          ]}
        />

        <div className="cta-band">
          <h2>Use Jimbaran for the seafood-and-sunset night</h2>
          <p>
            Swim the calm bay by day, watch the light drop from a table on the
            sand, and stay ten minutes from the airport. Start with the beach that
            fits your evening, then pick the grill.
          </p>
          <Link href="/jimbaran/things-to-do" className="cta-band-action">
            See the things-to-do guide →
          </Link>
        </div>

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("jimbaran")} />

        <GuideFooter />
      </main>
    </div>
  );
}
