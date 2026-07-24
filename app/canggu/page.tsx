import type { Metadata } from "next";
import Link from "next/link";
import PillarMasthead from "@/components/landing/PillarMasthead";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideSectionMedia } from "@/components/GuideMedia";
import CangguNow from "@/components/CangguNow";
import { guidesForDistrict } from "@/lib/guides";
import { getCangguVenues, toCangguPlaceCard, venueHasJob } from "@/lib/canggu";
import { CANGGU_GUIDES } from "@/lib/canggu-guides";
import type { VenueWithPerk } from "@/lib/data";
import StartYourShortlist from "@/components/StartYourShortlist";
import { buildStartShortlist } from "@/lib/start-shortlist";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Canggu guide — where to eat, work, reset and watch the sunset",
  description:
    "A resident-curated Canggu guide: how the areas differ, the best restaurants, work-friendly cafés, spas and sunset spots — and where to book a table in a tap.",
  alternates: { canonical: "/canggu" },
  openGraph: {
    title: "The Canggu guide · Other Bali",
    description:
      "Areas, the best restaurants, work-friendly cafés, spas and sunset spots — sorted by the decision you're making.",
    url: `${BASE}/canggu`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Canggu guide · Other Bali",
    description: "Restaurants, work cafés, spas and sunset — sorted by decision.",
  },
};

// The main areas of Canggu, north to south — names already used across our
// venue data (migration 0031). Character is fit-context; positions are
// established local geography.
const CANGGU_AREAS: { label: string; character: string; bestFor: string }[] = [
  {
    label: "Batu Bolong",
    character:
      "The busy heart — the beach temple, the café-and-surf strip, and the tightest cluster of restaurants and bars. Walkable in patches, and the most congested.",
    bestFor: "First-timers who want everything a short walk away.",
  },
  {
    label: "Berawa",
    character:
      "The polished side: big beach clubs, gyms and health cafés, and a fast-developing dining scene. A little more spread out, scooter-friendly.",
    bestFor: "Beach clubs, fitness and a livelier, upscale base.",
  },
  {
    label: "Pererenan",
    character:
      "The quieter, greener neighbour just west — rice fields, a growing crop of good restaurants, and a calmer pace while staying close to the action.",
    bestFor: "A calmer base that's still minutes from Batu Bolong.",
  },
  {
    label: "Echo Beach & Canggu village",
    character:
      "The surf-and-sunset end (Batu Mejan/Echo) and the more local village core inland — warungs, board rental and a less polished feel.",
    bestFor: "Surfers and a quieter, more local sunset base.",
  },
];

const FAQ = [
  {
    q: "What is Canggu best for?",
    a: "Surf, café-and-laptop mornings, sunset beach bars and a deep dinner scene. It's the island's busiest expat-and-traveller hub — energetic and walkable-ish in patches, with real traffic between areas.",
  },
  {
    q: "Do I need to book restaurants in Canggu?",
    a: "For the popular dinner rooms and weekend sunsets, yes — reserve a table in a tap where you see the Reserve button. Cafés, warungs and casual spots are walk-in.",
  },
  {
    q: "Which area of Canggu should I stay in?",
    a: "Batu Bolong for walk-everywhere convenience; Berawa for beach clubs and an upscale scene; Pererenan for a calmer, greener base; Echo Beach and the village for surf and a more local feel. The guides below sort places by decision so you can plan around wherever you land.",
  },
  {
    q: "Is Canggu walkable, or do I need a scooter?",
    a: "You can walk within an area — Batu Bolong especially — but getting between Berawa, Batu Bolong, Pererenan and Echo Beach means real traffic on narrow roads. Most people rent a scooter or use ride apps; leave extra time at sunset and on weekends.",
  },
  {
    q: "Is Canggu good for families or for nightlife?",
    a: "Both, in parts — Berawa's beach clubs and Canggu's bars run late for a night out, while the calmer Pererenan and village sides and daytime beach clubs suit families. It's less family-gentle than Sanur or Nusa Dua, and less of a party than the old Kuta scene.",
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
      <GuideSectionMedia seed={`canggu ${title}`} index={0} />
      <p className="text-sm text-[var(--muted)]">{note}</p>
      <div className="pick-grid" style={{ marginTop: 16 }}>
        {venues.slice(0, 3).map((v) => (
          <PlaceCard key={v.slug} place={toCangguPlaceCard(v)} />
        ))}
      </div>
    </section>
  );
}

export default async function CangguPillarPage() {
  const venues = await getCangguVenues();
  const restaurants = venues.filter((v) => v.category === "restaurant");
  const cafes = venues.filter((v) => v.category === "cafe" || venueHasJob(v, ["quiet-work-cafe", "brunch-after-surf"]));
  const spas = venues.filter((v) => v.category === "spa");
  const sunset = venues.filter((v) => v.category === "beach_club" || v.category === "bar" || venueHasJob(v, ["sunset-drinks-view"]));

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Canggu" }];

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
        <PageViewTracker event="district_page_view" slug="canggu" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <Breadcrumbs items={crumbs} />

        <PillarMasthead
          posterScene="district-canggu"
          variant="surf"
          videoSrc="/scenes/places-coast-loop.mp4"
          kicker="Canggu · Other Bali beta"
          title="Canggu, sorted by the decision you're making"
          copy="Surf, coffee, sunset and a deep dinner scene — and enough choice to lose an afternoon deciding. This guide sorts Canggu by what you're actually choosing: where to eat, where to work, where to reset, where to watch the sun go down. Confirmed offers and table reservations are one tap away."
          meta="Editorial review: 2026-07-14 · researched, not sponsored · no paid ranking"
          actions={
            <>
              <Link
                href="/plan#canggu-day-builder"
                className="inline-flex rounded-full bg-[#005962] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#003f46]"
              >
                Open the Canggu day builder
              </Link>
              <Link
                href="/places?district=canggu"
                className="inline-flex rounded-full border border-[rgba(250,246,239,0.45)] px-6 py-3 font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
              >
                Browse all Canggu places
              </Link>
            </>
          }
        />

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Canggu guides">
          {CANGGU_GUIDES.map((g) => (
            <Link key={g.slug} href={`/canggu/${g.slug}`} className="chip">
              {g.h1.replace(" in Canggu", "").replace("Canggu ", "")}
            </Link>
          ))}
        </nav>

        <CangguNow />

        <StartYourShortlist district="Canggu" items={buildStartShortlist(venues)} />

        <section className="guide-section">
          <h2>Who Canggu suits — and who it frustrates</h2>
          <div className="guide-prose">
            <p>
              <strong>It suits</strong> surfers, remote workers and travellers who
              want energy — café mornings, beach clubs, a deep dinner scene and a
              sunset every night. It&apos;s the island&apos;s busiest hub, and the
              easiest place to fill a day without planning one.
            </p>
            <p>
              <strong>It frustrates</strong> anyone chasing calm or classic Bali:
              the traffic between areas is real, the beaches are grey-sand surf
              beaches rather than swimming postcards, and construction is constant.
              For quiet, culture or gentle water, Ubud, Sanur or the Bukit fit
              better.
            </p>
          </div>
        </section>

        <section className="guide-section">
          <h2>The areas: where to base</h2>
          <p className="guide-lede">
            Canggu is really several villages that have grown together — the area
            you pick sets your whole day. From busiest to calmest:
          </p>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th scope="col">Area</th>
                  <th scope="col">Character</th>
                  <th scope="col">Best for</th>
                </tr>
              </thead>
              <tbody>
                {CANGGU_AREAS.map((a) => (
                  <tr key={a.label}>
                    <th scope="row">{a.label}</th>
                    <td>{a.character}</td>
                    <td>{a.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <TopPicks title="Best restaurants" note="From date-night rooms to group tables." venues={restaurants} href="/canggu/best-restaurants" />
        <TopPicks title="Work-friendly cafés" note="Wifi, sockets and a seat that lasts." venues={cafes} href="/canggu/work-friendly-cafes" />
        <TopPicks title="Spas & reset" note="Wind down after beach and board." venues={spas} href="/canggu/best-spas" />
        <TopPicks title="Beach clubs & sunset" note="Golden hour, from day clubs to quiet bars." venues={sunset} href="/canggu/beach-clubs-sunset" />

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>Traffic is the tax.</strong> The narrow roads between
                Berawa, Batu Bolong and Pererenan jam badly at sunset and on
                weekends — build in extra time, or walk within one area.
              </li>
              <li>
                <strong>The beach is for surf and sunset, not swimming.</strong>
                Grey-sand beach breaks with rips; great for learning to surf and
                for golden hour, less so for a calm dip.
              </li>
              <li>
                <strong>Book the popular rooms and weekend sunsets.</strong> Where
                you see a Reserve button, a table is one tap away; cafés and
                warungs stay walk-in.
              </li>
              <li>
                <strong>Mornings are for cafés and surf, afternoons for reset.</strong>
                Beat the heat and the crowds early — see the{" "}
                <Link href="/canggu/work-friendly-cafes" className="font-bold text-[var(--lagoon-strong)]">café</Link>,{" "}
                <Link href="/canggu/best-warungs" className="font-bold text-[var(--lagoon-strong)]">warung</Link> and{" "}
                <Link href="/canggu/best-spas" className="font-bold text-[var(--lagoon-strong)]">spa</Link> guides.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={[
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliffs, surf and the island's best sunsets." },
            { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first day without the rookie mistakes." },
            { href: "/plan#canggu-day-builder", title: "Canggu day builder", blurb: "Use the active-deep pilot for a Canggu day." },
          ]}
        />

        <div className="cta-band">
          <h2>Use the Canggu day builder</h2>
          <p>
            Surf or café in the morning, reset in the afternoon, a table or a
            beach club for sunset — build it around the moment you&apos;re in, with
            published Canggu places and confirmed actions where available.
          </p>
          <Link href="/plan#canggu-day-builder" className="cta-band-action">
            Open the Canggu builder →
          </Link>
        </div>

        <RelatedGuides heading="Bali planning guides" links={guidesForDistrict("canggu")} />

        <GuideFooter />
      </main>
    </div>
  );
}
