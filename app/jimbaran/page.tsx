import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarMasthead from "@/components/landing/PillarMasthead";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import DecisionRail from "@/components/DecisionRail";
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

const visualChoices = [
  {
    href: "/jimbaran/best-restaurants",
    image: "/scenes/jimbaran-seafood-sunset-illustrative.webp",
    alt: "Illustrative Jimbaran bay at sunset with fishing boats and a seafood table",
    label: "Seafood sunset",
    title: "Eat by the bay",
    copy: "Start here if the evening is about grilled seafood, sand and the last light.",
  },
  {
    href: "/jimbaran/things-to-do",
    image: "/scenes/jimbaran-calm-bay-illustrative.webp",
    alt: "Illustrative calm sheltered bay and quiet beach in Jimbaran",
    label: "Calm bay",
    title: "Swim before dinner",
    copy: "Use the bay as a gentler beach day, then check the exact access and tide conditions.",
  },
  {
    href: "/where-to-stay-in-bali",
    image: "/scenes/jimbaran-airport-base-illustrative.webp",
    alt: "Illustrative tropical road and sea view representing an airport-near Jimbaran base",
    label: "Airport-near base",
    title: "Keep the route easy",
    copy: "A practical first or last night when proximity and a quiet resort rhythm matter.",
  },
] as const;

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

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="jimbaran" />

        <Breadcrumbs items={crumbs} />

        <PillarMasthead
          posterScene="district-jimbaran"
          variant="sunset"
          kicker="Jimbaran · South coast"
          title="Jimbaran, the seafood bay"
          copy="A calm, west-facing bay a short hop from the airport, famous for one thing above all: grilled seafood eaten near the sand at sunset. Above it, the headland holds cliff-edge sunset bars and some of Bali's most serious resort spas. This guide covers who it suits, its beaches, what to do, where to eat and where to be looked after — curated from places we actually rate, never a directory."
          meta={`Editorial review: ${JIMBARAN_REVIEW_DATE} · researched, not sponsored · no paid ranking`}
          actions={
            <Link
              href="/places?district=jimbaran"
              className="inline-flex rounded-full border border-[rgba(250,246,239,0.45)] px-6 py-3 font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
            >
              Browse all Jimbaran places
            </Link>
          }
        />

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Jimbaran guides">
          <Link href="/jimbaran/things-to-do" className="chip">Things to do</Link>
          {JIMBARAN_GUIDES.map((g) => (
            <Link key={g.slug} href={`/jimbaran/${g.slug}`} className="chip">
              {g.h1.replace(" in Jimbaran", "").replace("Jimbaran ", "")}
            </Link>
          ))}
        </nav>

        <section className="guide-section" aria-labelledby="jimbaran-visual-choices">
          <div className="visual-first-heading-row">
            <div>
              <p className="eyebrow">Choose the shape of the day</p>
              <h2 id="jimbaran-visual-choices">Start with the Jimbaran you need</h2>
            </div>
            <p>These area-mood scenes are illustrative, not photos of named restaurants, beaches or hotels. Use them to choose the decision; verify the exact place and conditions in the focused guides.</p>
          </div>
          <div className="visual-choice-grid visual-choice-grid-three">
            {visualChoices.map((choice) => (
              <Link key={choice.href} href={choice.href} className="visual-choice-card">
                <Image
                  src={choice.image}
                  alt={choice.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 759px) 100vw, (max-width: 1199px) 33vw, 360px"
                  className="object-cover transition duration-700"
                />
                <div className="visual-choice-card-copy">
                  <span>{choice.label}</span>
                  <h3>{choice.title}</h3>
                  <p>{choice.copy}</p>
                  <strong>Open the guide →</strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <DecisionRail area="jimbaran" areaLabel="Jimbaran" />

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
