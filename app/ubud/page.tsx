import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideSectionMedia } from "@/components/GuideMedia";
import PillarMasthead from "@/components/landing/PillarMasthead";
import { guidesForDistrict } from "@/lib/guides";
import { getUbudVenues, toUbudPlaceCard } from "@/lib/ubud";
import { UBUD_GUIDES } from "@/lib/ubud-guides";
import { UBUD_REVIEW_DATE, UBUD_THINGS_TO_DO, UBUD_ZONES } from "@/lib/ubud-things";
import type { VenueWithPerk } from "@/lib/data";
import StartYourShortlist from "@/components/StartYourShortlist";
import { buildStartShortlist } from "@/lib/start-shortlist";

const BASE = "https://www.otherbali.com";

const previewThings = UBUD_THINGS_TO_DO.slice(0, 4);

export const metadata: Metadata = {
  title: "Ubud guide — where to eat, drink coffee and slow down",
  description:
    "A resident-curated Ubud guide: how the area feels, the restaurants and cafés worth your time, and how to plan a slow day in Bali's cultural heart.",
  alternates: { canonical: "/ubud" },
  openGraph: {
    title: "The Ubud guide · Other Bali",
    description: "Restaurants, cafés and how to plan a slow Ubud day.",
    url: `${BASE}/ubud`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Ubud guide · Other Bali",
    description: "Restaurants, cafés and how to plan a slow Ubud day.",
  },
};

const FAQ = [
  {
    q: "What is Ubud best for?",
    a: "Green, slower Bali: rice-terrace walks, jungle mornings, yoga and long healthy dinners. It's the cultural heart of the island — an inland base, not a beach one.",
  },
  {
    q: "Is Ubud walkable?",
    a: "Central Ubud is genuinely walkable — the Palace, market, Monkey Forest and much of the food are within about a 10-minute walk. Beyond the core, sights and cafés spread into the surrounding villages and rice fields, so a scooter or driver helps.",
  },
  {
    q: "How long should I spend in Ubud?",
    a: "Two to three days covers the food, a walk or two and a temple or market at an unhurried pace. Longer if you're here to slow down properly — see our 2–3 day itinerary.",
  },
  {
    q: "Which part of Ubud should I stay in?",
    a: "Central Ubud for walk-everywhere convenience (and the most noise); Nyuh Kuning or Penestanan for calm within walking reach; Sanggingan/Campuhan for art and ridge scenery; and the Sayan/Payangan river valleys for secluded jungle-resort luxury you'll drive to town from.",
  },
  {
    q: "Is Ubud good for beaches?",
    a: "No — Ubud is inland, in the central highlands, roughly an hour or more from the coast. Come for rice fields, jungle, culture and wellness; pair it with a beach district like Canggu or Sanur if you want both.",
  },
];

function TopPicks({ title, note, venues, href }: { title: string; note: string; venues: VenueWithPerk[]; href: string }) {
  if (venues.length === 0) return null;
  return (
    <section className="guide-section">
      <div className="flex items-baseline justify-between gap-4">
        <h2>{title}</h2>
        <Link href={href} className="quiet-link">See all →</Link>
      </div>
      <GuideSectionMedia seed={`ubud ${title}`} index={0} />
      <p className="text-sm text-[var(--muted)]">{note}</p>
      <div className="pick-grid" style={{ marginTop: 16 }}>
        {venues.slice(0, 3).map((v) => (
          <PlaceCard key={v.slug} place={toUbudPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function UbudPillarPage() {
  const venues = await getUbudVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant");
  const cafes = venues.filter((v) => v.category === "cafe");
  const wellness = venues.filter((v) => v.category === "spa");

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Ubud" }];

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
        <PageViewTracker event="district_page_view" slug="ubud" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <PillarMasthead
          posterScene="district-ubud"
          variant="ridge"
          videoSrc="/scenes/ubud-dawn-loop.mp4"
          kicker="Ubud · Central highlands"
          title="Ubud, the slow green heart of Bali"
          copy="Rice terraces, jungle mornings, yoga and long healthy dinners — Ubud is the island's cultural, inland base, not a beach one. This guide covers where to eat, where to drink coffee, and where to practise yoga, be worked on and reset — curated from places we actually rate."
          meta={`Editorial review: ${UBUD_REVIEW_DATE} · researched, not sponsored · no paid ranking`}
          actions={
            <Link
              href="/places?district=ubud"
              className="inline-flex rounded-full border border-[rgba(250,246,239,0.45)] px-6 py-3 font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
            >
              Browse all Ubud places
            </Link>
          }
        />

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Ubud guides">
          <Link href="/ubud/things-to-do" className="chip">
            Things to do
          </Link>
          <Link href="/ubud/itinerary" className="chip">
            2–3 day itinerary
          </Link>
          {UBUD_GUIDES.map((g) => (
            <Link key={g.slug} href={`/ubud/${g.slug}`} className="chip">
              {g.h1.replace(" in Ubud", "").replace("Ubud ", "")}
            </Link>
          ))}
        </nav>

        <StartYourShortlist district="Ubud" items={buildStartShortlist(venues)} />

        <section className="guide-section">
          <h2>Who Ubud suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> travellers here for culture, calm and
              wellness — rice-terrace walks, yoga and long healthy dinners — plus
              anyone who wants a green, inland base and doesn&apos;t mind that the
              beach is an hour or more away.
            </p>
            <p>
              <strong>It frustrates</strong> people who came for the coast: there
              is no beach, no surf and no sunset-on-the-sand, and the busy central
              loop jams with traffic in the evenings. For beaches and nightlife,
              base on the west or south coast and treat Ubud as a few slow days.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>Where to stay: the zones</h2>
          <p className="guide-lede">
            Ubud makes more sense sorted by neighbourhood than by star rating —
            pick the zone for the pace you want, the hotel second.
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
                {UBUD_ZONES.map((z) => (
                  <tr key={z.label}>
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
            The ridge walk, the Monkey Forest, rice terraces, temples and markets —
            an unhurried mix of culture and green.{" "}
            <Link href="/ubud/things-to-do" className="font-bold text-[var(--lagoon-strong)]">
              The full things-to-do guide →
            </Link>{" "}
            or follow the{" "}
            <Link href="/ubud/itinerary" className="font-bold text-[var(--lagoon-strong)]">
              2–3 day itinerary →
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

        <TopPicks title="Best restaurants" note="Long slow dinners and healthy plates." venues={restaurants} href="/ubud/best-restaurants" />
        <TopPicks title="Cafés & coffee" note="Serious coffee and calm mornings." venues={cafes} href="/ubud/best-cafes-coffee" />
        <TopPicks title="Yoga & wellness" note="Studios, spas, sound and retreats — Ubud's signature." venues={wellness} href="/ubud/best-yoga-wellness" />

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>It&apos;s inland — no beach.</strong> Ubud sits in the
                central highlands, roughly an hour or more from the coast. Come for
                rice fields, jungle and culture; pair it with a beach base if you
                want both.
              </li>
              <li>
                <strong>Walk the centre, drive the rest.</strong> Central Ubud is
                genuinely walkable, but the ridge walks, rice terraces and waterfalls
                spread out — a scooter or a half-day driver opens them up.
              </li>
              <li>
                <strong>Go early for the big sights.</strong> The Monkey Forest,
                Campuhan Ridge and Tegallalang are best at opening or late
                afternoon — cooler, quieter and better light than midday.
              </li>
              <li>
                <strong>Two to three days is the sweet spot.</strong> Enough for
                the food, a walk or two and a temple or market without rushing —
                follow the{" "}
                <Link href="/ubud/itinerary" className="font-bold text-[var(--lagoon-strong)]">2–3 day itinerary</Link>.
              </li>
              <li>
                <strong>Dress for temples.</strong> A sarong and covered shoulders
                are required at the temples and expected at the palace performances.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/ubud/itinerary", title: "2 to 3 days in Ubud", blurb: "A slow, well-paced route through the highlights." },
            { href: "/canggu", title: "The Canggu guide", blurb: "Surf, cafés and a deep dinner scene." },
            { href: "/bali-retreat-reset", title: "A Bali reset", blurb: "A calmer week for your nervous system." },
            { href: "/places", title: "All Bali places", blurb: "The full curated map by district." },
          ]}
        />

        <div className="cta-band">
          <h2>Use Ubud to slow down</h2>
          <p>
            Green mornings, a walk before the heat, a long healthy dinner, and a
            temple or market at an unhurried pace. Pick the zone for the pace you
            want, then plan the days.
          </p>
          <Link href="/ubud/itinerary" className="cta-band-action">
            See the 2–3 day itinerary →
          </Link>
        </div>

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("ubud")} />

        <GuideFooter />
      </main>
    </div>
  );
}
