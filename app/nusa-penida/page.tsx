import type { Metadata } from "next";
import Link from "next/link";
import PillarMasthead from "@/components/landing/PillarMasthead";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { guidesForDistrict } from "@/lib/guides";
import { getNusaPenidaVenues, toNusaPenidaPlaceCard } from "@/lib/nusa-penida";
import {
  NUSA_PENIDA_FAQ,
  NUSA_PENIDA_REVIEW_DATE,
  NUSA_PENIDA_THINGS_TO_DO,
  NUSA_PENIDA_ZONES,
} from "@/lib/nusa-penida/content";
import type { VenueWithPerk } from "@/lib/data";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Nusa Penida guide — cliffs, coves and manta rays",
  description:
    "A resident-curated Nusa Penida guide: who the island suits, the west and east loops, the headline viewpoints (Kelingking, Angel's Billabong, Broken Beach, Diamond Beach), manta snorkelling, and the water-safety you need before you go.",
  alternates: { canonical: "/nusa-penida" },
  openGraph: {
    title: "The Nusa Penida guide · Other Bali",
    description: "Cliffs, coves and manta rays — the west and east loops, the icons, and how to visit well.",
    url: `${BASE}/nusa-penida`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Nusa Penida guide · Other Bali",
    description: "Cliffs, coves and manta rays — the west and east loops, the icons, and how to visit well.",
  },
};

// Guide chips — quick nav within the pillar and out to the day-trip logistics
// companion (which owns the fast-boat / how-to-visit detail).
const NUSA_PENIDA_CHIPS: { href: string; label: string }[] = [
  { href: "#things-to-do", label: "Things to do" },
  { href: "#the-two-sides", label: "West vs east" },
  { href: "/nusa-penida-day-trip", label: "How to visit" },
  { href: "#practical", label: "Water safety" },
];

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
          <PlaceCard key={v.slug} place={toNusaPenidaPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function NusaPenidaPillarPage() {
  // Until island venues are curated, this is empty and every TopPicks below
  // renders null — correct (no invented placeholders, §4).
  const venues = await getNusaPenidaVenues();

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Nusa Penida" }];

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
        <PageViewTracker event="district_page_view" slug="nusa-penida" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <PillarMasthead
          posterScene="district-nusa-islands"
          variant="surf"
          kicker="Nusa Penida · Off the south-east coast"
          title="Nusa Penida, the island of cliffs and mantas"
          copy={`A rugged island a 30–45 minute fast boat off Bali's south-east coast, and the source of its most-photographed view: the Kelingking “T-Rex” cliff. It's big-landscape, adventure Bali — dramatic coves, clifftop stairways and year-round manta rays over comfort and polish. This guide covers who it suits, the two loops (west and east), the headline sights and the water-safety that genuinely matters here, curated from verified research — not sponsored.`}
          meta={`Editorial review: ${NUSA_PENIDA_REVIEW_DATE} · researched, not sponsored · no paid ranking`}
          actions={
            <Link
              href="/nusa-penida-day-trip"
              className="inline-flex rounded-full border border-[rgba(250,246,239,0.45)] px-6 py-3 font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
            >
              How to do the day trip →
            </Link>
          }
        />

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Nusa Penida guide">
          {NUSA_PENIDA_CHIPS.map((c) => (
            <Link key={c.href} href={c.href} className="chip">
              {c.label}
            </Link>
          ))}
        </nav>

        <section className="guide-section">
          <h2>Who Nusa Penida suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> travellers chasing big, dramatic
              scenery, keen snorkellers and divers who want mantas, and anyone
              happy to trade comfort for adventure and rough roads to reach
              near-empty viewpoints early or late in the day.
            </p>
            <p>
              <strong>It frustrates</strong> anyone after a polished, low-effort
              beach holiday. There&apos;s little of mainland Bali&apos;s resort
              infrastructure, the roads are genuinely rough, the headline sights
              involve steep stairways, and several famous spots are for looking,
              not swimming. Come for the landscape, not the loungers.
            </p>
          </div>
        </section>

        <section id="the-two-sides" className="guide-section">
          <h2>The island splits in two (plus the water)</h2>
          <p className="guide-lede">
            Nusa Penida is bigger and rougher than it looks on a map, so most
            visitors see one side per day. Pick your loop by what you&apos;re
            after — and read the{" "}
            <Link href="/nusa-penida-day-trip" className="font-bold text-[var(--lagoon-strong)]">
              day-trip guide
            </Link>{" "}
            for the fast-boat and driver logistics.
          </p>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Side</th>
                  <th scope="col">Character</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                {NUSA_PENIDA_ZONES.map((z) => (
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

        <section id="things-to-do" className="guide-section">
          <h2>The headline sights</h2>
          <p className="guide-lede">
            The icons the island is famous for — cliffs, coves and manta points.
            A few come with real water-danger, flagged below and in the safety
            notes.
          </p>
          <ul className="guide-prose">
            {NUSA_PENIDA_THINGS_TO_DO.map((t) => (
              <li key={t.title}>
                <strong>{t.title}.</strong> {t.blurb}
              </li>
            ))}
          </ul>
        </section>

        <TopPicks title="Curated places on the island" note="Stays and tables we stand behind — added as we verify them." venues={venues} href="/places?district=nusa-islands" />

        <section id="practical" className="guide-section">
          <h2>Water safety & practical notes (read before you go)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>Take the water seriously.</strong> Swimming is forbidden
                at Kelingking (deadly currents), and Angel&apos;s Billabong is
                safe to enter only at low tide — never on a rising tide, where
                people have been swept out. Check the tide and obey the signs.
              </li>
              <li>
                <strong>The stairways are a real climb.</strong> Diamond, Atuh
                and Kelingking all involve steep descents and hot climbs back up.
                Wear proper shoes, carry water, and go early before the heat and
                the crowds.
              </li>
              <li>
                <strong>No Grab, Gojek or taxis.</strong> Hire a car with a
                driver or take an organised tour rather than a self-drive
                scooter — the descents are steep enough to overwhelm scooter
                brakes. Arrange it before you arrive.
              </li>
              <li>
                <strong>Bring cash.</strong> ATMs are few, often don&apos;t take
                foreign cards and frequently run empty. Withdraw on mainland Bali
                before you cross.
              </li>
              <li>
                <strong>One side per day.</strong> Don&apos;t try to combine west
                and east in a single day — the drive eats it. If you can spare a
                night, staying over is the biggest upgrade there is.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={NUSA_PENIDA_FAQ} />

        <RelatedGuides
          links={[
            { href: "/nusa-penida-day-trip", title: "Nusa Penida day trip from Bali", blurb: "The fast boat from Sanur, the loops, and whether to day-trip or stay over." },
            { href: "/sanur", title: "The Sanur guide", blurb: "The calm base and fast-boat gateway to the Nusa islands." },
            { href: "/things-to-do-in-bali", title: "Best things to do in Bali", blurb: "The island icons and what to do in each area." },
            { href: "/is-bali-safe", title: "Is Bali safe?", blurb: "Water, roads and the practical safety basics." },
          ]}
        />

        <div className="cta-band">
          <h2>Do Nusa Penida without the rushed day</h2>
          <p>
            Pick one side, start on the first morning boat, and take the water
            safety seriously. If you can spare a night, you&apos;ll get the
            headline cliffs near-empty — the single biggest upgrade to the trip.
          </p>
          <Link href="/nusa-penida-day-trip" className="cta-band-action">
            Read the day-trip guide →
          </Link>
        </div>

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("nusa-penida")} />

        <GuideFooter />
      </main>
    </div>
  );
}
