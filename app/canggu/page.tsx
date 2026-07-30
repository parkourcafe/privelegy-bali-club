import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PillarMasthead from "@/components/landing/PillarMasthead";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, RelatedGuides, GuideFooter, type GuideLink } from "@/components/GuideBlocks";
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
const CANGGU_AREAS = [
  {
    label: "Batu Bolong",
    character: "Cafés, surf and dinner close together.",
    bestFor: "First trip · busy base",
    imageSrc: "/scenes/canggu-area-batu-bolong.webp",
  },
  {
    label: "Berawa",
    character: "Beach clubs, wellness and a polished scene.",
    bestFor: "Social · upscale",
    imageSrc: "/scenes/canggu-area-berawa.webp",
  },
  {
    label: "Pererenan",
    character: "A calmer rhythm with strong cafés and dinner.",
    bestFor: "Slower · still close",
    imageSrc: "/scenes/canggu-area-pererenan.webp",
  },
  {
    label: "Echo Beach",
    character: "Surf mornings and an easy sunset finish.",
    bestFor: "Surf · sunset",
    imageSrc: "/scenes/canggu-area-echo-beach.webp",
  },
] as const;

const CANGGU_PRACTICAL_CARDS = [
  {
    title: "Stay within one area",
    copy: "Cross-area traffic can consume the day.",
    imageSrc: "/scenes/canggu-practical-stay-local.webp",
  },
  {
    title: "Surf, not swimming",
    copy: "Gentle swim? Choose another coast.",
    imageSrc: "/scenes/canggu-practical-surf.webp",
  },
  {
    title: "Book popular rooms",
    copy: "Reserve where a confirmed action is available.",
    imageSrc: "/scenes/canggu-practical-reserve.webp",
  },
  {
    title: "Start early, reset later",
    copy: "Café or surf first; spa and sunset after.",
    imageSrc: "/scenes/canggu-practical-day-rhythm.webp",
  },
] as const;

const CANGGU_GUIDE_MEDIA: Record<string, Pick<GuideLink, "mediaSrc" | "blurb">> = {
  "/uluwatu": {
    mediaSrc: "/scenes/plan-route-sunset-run.webp",
    blurb: "Cliffs, surf and sunset.",
  },
  "/first-time-in-bali": {
    mediaSrc: "/scenes/home-bali-first-day.webp",
    blurb: "A softer first day.",
  },
  "/plan#canggu-day-builder": {
    blurb: "Build one Canggu day.",
  },
  "/canggu-first-day": {
    blurb: "Coffee, beach, sunset, dinner.",
  },
  "/best-restaurants-in-bali": {
    mediaSrc: "/scenes/home-bali-romantic.webp",
    blurb: "Compare dinner scenes island-wide.",
  },
  "/best-cafes-in-bali": {
    mediaSrc: "/scenes/plan-route-cafe-work.webp",
    blurb: "Find the right café mood.",
  },
  "/ubud-vs-canggu": {
    mediaSrc: "/scenes/plan-route-ubud-culture.webp",
    blurb: "Energy or a slower cultural base.",
  },
  "/canggu-vs-uluwatu": {
    mediaSrc: "/scenes/guide-tanah-lot-sunset.webp",
    blurb: "Busy coast or cliff days.",
  },
  "/where-to-stay-in-bali": {
    mediaSrc: "/scenes/home-bali-trip-lengths.webp",
    blurb: "Choose the base that fits the trip.",
  },
  "/best-coffee-in-bali": {
    blurb: "Serious coffee across Bali.",
  },
  "/where-to-watch-sunset-in-bali": {
    mediaSrc: "/scenes/guide-jimbaran-bay-sunset.webp",
    blurb: "Choose your golden-hour coast.",
  },
};

function withCangguGuideMedia(links: GuideLink[]): GuideLink[] {
  return links.map((link) => ({ ...link, ...CANGGU_GUIDE_MEDIA[link.href] }));
}

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

function TopPicks({
  title,
  note,
  venues,
  href,
  mediaSrc,
}: {
  title: string;
  note: string;
  venues: VenueWithPerk[];
  href: string;
  mediaSrc: string;
}) {
  if (venues.length === 0) return null;
  return (
    <section className="guide-section">
      <GuideSectionMedia
        seed={`canggu ${title}`}
        index={0}
        src={mediaSrc}
        heading={title}
        support={note}
        actionHref={href}
        actionLabel="See all picks"
      />
      <div className="pick-grid" style={{ marginTop: 16 }}>
        {venues.slice(0, 3).map((v) => (
          <PlaceCard key={v.slug} place={toCangguPlaceCard(v)} visualFirst />
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
  const usedTopPickSlugs = new Set<string>();
  const uniqueTopPicks = (items: VenueWithPerk[]) => {
    const picks: VenueWithPerk[] = [];
    for (const venue of items) {
      if (picks.length === 3) break;
      if (usedTopPickSlugs.has(venue.slug)) continue;
      usedTopPickSlugs.add(venue.slug);
      picks.push(venue);
    }
    return picks;
  };
  const restaurantPicks = uniqueTopPicks(restaurants);
  const cafePicks = uniqueTopPicks(cafes);
  const spaPicks = uniqueTopPicks(spas);
  const sunsetPicks = uniqueTopPicks(sunset);
  const shortlist = buildStartShortlist(venues);
  const venueBySlug = new Map(venues.map((venue) => [venue.slug, venue]));
  const shortlistPlaces = shortlist.flatMap((item) => {
    const venue = venueBySlug.get(item.slug);
    return venue ? [toCangguPlaceCard(venue)] : [];
  });

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
          imageSrc="/scenes/canggu-hero-illustrative.webp"
          variant="surf"
          kicker="Canggu · Other Bali beta"
          title="Choose your Canggu day"
          copy="Eat, work, reset or catch sunset — start with the decision you are making now."
          actions={
            <Link
              href="/plan#canggu-day-builder"
              className="inline-flex min-h-11 items-center rounded-full bg-[#005962] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#003f46]"
            >
              Plan your Canggu day
            </Link>
          }
        />

        <div className="district-trust-strip">
          <p>
            <strong>Resident-curated.</strong> Editorial review: 2026-07-14 ·
            researched, not sponsored · no paid ranking.
          </p>
          <Link href="/places?district=canggu">Browse all Canggu places →</Link>
        </div>

        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Canggu guides">
          {CANGGU_GUIDES.map((g) => (
            <Link key={g.slug} href={`/canggu/${g.slug}`} className="chip">
              {g.h1.replace(" in Canggu", "").replace("Canggu ", "")}
            </Link>
          ))}
        </nav>

        <CangguNow />

        <StartYourShortlist district="Canggu" items={shortlist} visualPlaces={shortlistPlaces} />

        <section className="guide-section">
          <div className="canggu-section-heading">
            <div>
              <p className="eyebrow">Choose your base</p>
              <h2>The Canggu areas</h2>
            </div>
          </div>
          <div className="canggu-area-grid">
            {CANGGU_AREAS.map((area) => (
              <article key={area.label} className="canggu-visual-card canggu-area-card" data-canggu-area-card>
                <Image
                  src={area.imageSrc}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 759px) calc(100vw - 2rem), (max-width: 1199px) calc((100vw - 5rem) / 4), 270px"
                  className="canggu-visual-card-image ob-grade"
                />
                <span className="canggu-visual-card-scrim" aria-hidden="true" />
                <div className="canggu-visual-card-copy" data-media-copy>
                  <span className="canggu-card-kicker">{area.bestFor}</span>
                  <h3>{area.label}</h3>
                  <p>{area.character}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <TopPicks title="Best restaurants" note="From date-night rooms to group tables." venues={restaurantPicks} href="/canggu/best-restaurants" mediaSrc="/scenes/canggu-restaurants-illustrative.webp" />
        <TopPicks title="Work-friendly cafés" note="Wifi, sockets and a seat that lasts." venues={cafePicks} href="/canggu/work-friendly-cafes" mediaSrc="/scenes/canggu-cafes-illustrative.webp" />
        <TopPicks title="Spas & reset" note="Wind down after beach and board." venues={spaPicks} href="/canggu/best-spas" mediaSrc="/scenes/canggu-spas-illustrative.webp" />
        <TopPicks title="Beach clubs & sunset" note="Golden hour, from day clubs to quiet bars." venues={sunsetPicks} href="/canggu/beach-clubs-sunset" mediaSrc="/scenes/canggu-sunset-illustrative.webp" />

        <section className="guide-section">
          <p className="eyebrow">Before you plan</p>
          <h2>Four Canggu realities</h2>
          <div className="canggu-practical-grid">
            {CANGGU_PRACTICAL_CARDS.map((item) => (
              <article key={item.title} className="canggu-visual-card canggu-practical-card" data-canggu-practical-card>
                <Image
                  src={item.imageSrc}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(max-width: 759px) calc(100vw - 2rem), (max-width: 1199px) calc((100vw - 5rem) / 4), 270px"
                  className="canggu-visual-card-image ob-grade"
                />
                <span className="canggu-visual-card-scrim" aria-hidden="true" />
                <div className="canggu-visual-card-copy" data-media-copy>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FaqBlock items={FAQ} />
        <RelatedGuides
          links={withCangguGuideMedia([
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliffs, surf and the island's best sunsets." },
            { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first day without the rookie mistakes." },
            { href: "/plan#canggu-day-builder", title: "Canggu day builder", blurb: "Use the active-deep pilot for a Canggu day." },
          ])}
        />

        <section className="guide-section" data-canggu-visual-cta>
          <GuideSectionMedia
            seed="canggu day builder"
            index={0}
            src="/scenes/plan-route-canggu-food.webp"
            heading="Build one Canggu day"
            support="Morning, reset, sunset."
            actionHref="/plan#canggu-day-builder"
            actionLabel="Open the day builder"
          />
        </section>

        <RelatedGuides heading="Bali planning guides" links={withCangguGuideMedia(guidesForDistrict("canggu"))} />

        <GuideFooter />
      </main>
    </div>
  );
}
