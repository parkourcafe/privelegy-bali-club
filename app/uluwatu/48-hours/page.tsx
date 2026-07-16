import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import GuideLeadForm from "@/components/GuideLeadForm";
import {
  FaqBlock,
  GuideFooter,
  PlaceLink,
  RelatedGuides,
} from "@/components/GuideBlocks";
import { getUluwatuContent } from "@/lib/uluwatu/venues";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";

// Search intent: "48 hours in uluwatu / uluwatu itinerary / 2 days uluwatu".
// Primary keyword: "48 hours in Uluwatu"; secondary: "Uluwatu itinerary",
// "one day in Uluwatu", "Uluwatu 2 day plan". This is also the lead magnet
// (brief §18): responsive web guide + working lead form; email/WhatsApp
// copies live in docs/uluwatu-48h-guide-versions.md until a delivery
// provider is wired (documented — we never claim a message was sent).
//
// Scope honesty: v1 covers verified food, drink and sunset decisions only —
// general attractions aren't in the verified data layer yet.

export const metadata: Metadata = {
  title: "48 hours in Uluwatu — a realistic two-day plan",
  description:
    "Two Uluwatu days that never cross the Bukit twice: west-cliff sunsets, a Bingin morning, a Melasti beach afternoon — with booking notes and rain alternatives.",
  alternates: { canonical: "/uluwatu/48-hours" },
  openGraph: {
    title: "48 hours in Uluwatu · Other Bali",
    description:
      "A realistic two-day Bukit plan: sequenced stops, booking notes, rain alternatives.",
    url: "https://www.otherbali.com/uluwatu/48-hours",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "48 hours in Uluwatu · Other Bali",
    description:
      "A realistic two-day Bukit plan: sequenced stops, booking notes, rain alternatives.",
  },
};

interface Stop {
  time: string;
  slug?: string;
  title: string;
  note: string;
}

const DAY1: Stop[] = [
  {
    time: "07:00",
    slug: "bgs-uluwatu",
    title: "BGS Uluwatu — coffee at the Suluban entrance",
    note: "Almond latte in hand, watch the dawn patrol paddle out below. If you surf, this is your window.",
  },
  {
    time: "09:30",
    slug: "suka-espresso",
    title: "Suka Espresso — the proper breakfast",
    note: "The Bukit's dependable all-day café since 2016. Walk-in; peak hours move fast.",
  },
  {
    time: "12:00",
    title: "Padang Padang Beach + the Labuan Sait strip",
    note: "Beach hours while the light is high. Everything on this stretch is minutes apart.",
  },
  {
    time: "13:30",
    slug: "ulu-fishmarket",
    title: "Ulu Fishmarket — garden seafood lunch",
    note: "Sashimi and grilled catch in an easy garden room. Walk-ins fine at lunch.",
  },
  {
    time: "17:00",
    slug: "single-fin",
    title: "Single Fin — the sunset",
    note: "Arrive 60–90 minutes before the sun for a rail spot. Wednesday or Sunday? That's the party — book instead.",
  },
  {
    time: "19:30",
    slug: "kala-uluwatu",
    title: "KALA — wood-fire dinner near Padang Padang",
    note: "Reserve via SevenRooms. Swap for YUKI if the evening wants volume.",
  },
];

const DAY2: Stop[] = [
  {
    time: "07:30",
    slug: "son-of-a-baker",
    title: "Son of a Baker — first-light pastry",
    note: "Open from around 6 a.m. (closed Mondays — check their Instagram). Swap: Alchemy for the plant-based version.",
  },
  {
    time: "09:00",
    title: "Bingin Beach morning",
    note: "Down the steps, along the shacks. Coffee refill two minutes back up at Seed if the tide steals the beach.",
  },
  {
    time: "12:00",
    slug: "laggas-uluwatu",
    title: "Laggas — dumpling lunch in Bingin",
    note: "The Fat Gajah lineage at fair prices. Roadside room; the food is the point.",
  },
  {
    time: "13:30",
    slug: "sundays-beach-club",
    title: "Sundays Beach Club — the beach afternoon",
    note: "Ride south to Ungasan; funicular down to the cove. Beach pass converts to food-and-drink credit. Adults-only alternative: Tropical Temptation on Melasti (18+).",
  },
  {
    time: "17:30",
    title: "Sunset from the south side",
    note: "Stay put: bonfires at Sundays, or daybeds at the Melasti clubs. Do NOT race back to the west cliffs — that's the classic 48-hour mistake.",
  },
  {
    time: "19:30",
    slug: "waatu",
    title: "WAATU — fire-cooked dinner above the cove",
    note: "Directly above Sundays at The Ungasan — zero transit from beach to table. Book ahead.",
  },
];

const FAQ = [
  {
    q: "Only have 24 hours?",
    a: "Run Day 1 and swap its dinner for WAATU or Gooseberry if you want the meal to be the memory. The west cliffs give you the densest version of Uluwatu: surf, strip, sunset, serious dinner — all within minutes.",
  },
  {
    q: "What if it rains?",
    a: "Our research tags real covered fallbacks: Suka, Artisan, YUKI, ZALI, Gooseberry, Mana and El Kabrón all handle a wet afternoon. Beach hours move indoors; sunset becomes a long dinner. The plan bends, it doesn't break.",
  },
  {
    q: "Scooter or driver?",
    a: "Scooter if you're confident — the cliff lanes are narrow and parking at Suluban is tight. With kids or bags, a driver for the Melasti half-day is money well spent. Either way, one zone per half-day.",
  },
  {
    q: "Why is there nothing about the temple or surf schools?",
    a: "Because we haven't verified them yet. This plan covers the food, drink and sunset layer we could stand behind; attractions and activities join once they pass the same evidence bar.",
  },
];

function Timeline({ stops }: { stops: Stop[] }) {
  return (
    <ol className="timeline-list" style={{ marginTop: 20 }}>
      {stops.map((stop, i) => {
        const content = stop.slug ? getUluwatuContent(stop.slug) : null;
        return (
          <li key={stop.title} className="timeline-item">
            <span className="timeline-marker">{i + 1}</span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--lagoon-strong)]">
                {stop.time}
              </p>
              <h3 className="mt-1 font-[family-name:var(--font-display)] text-xl font-semibold leading-tight">
                {stop.slug ? <PlaceLink slug={stop.slug}>{stop.title}</PlaceLink> : stop.title}
              </h3>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
                {stop.note}
              </p>
              {content && (
                <p className="mt-1 text-xs">
                  <TrackedOutboundLink
                    href={content.gmapsUrl}
                    event="direction_click"
                    venueSlug={content.slug}
                    className="font-bold text-[var(--lagoon-strong)]"
                  >
                    Map →
                  </TrackedOutboundLink>
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default function FortyEightHoursPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="uluwatu-48-hours" />
        <div className="flex items-start justify-between">
          <Link href="/uluwatu" className="topline">
            ← Uluwatu guide
          </Link>
          <Link href="/places?district=uluwatu" className="quiet-link">
            All Uluwatu places →
          </Link>
        </div>

        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Uluwatu", href: "/uluwatu" },
            { name: "48 hours" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Uluwatu · The plan</p>
          <h1 className="guide-title">48 hours in Uluwatu</h1>
          <p className="guide-standfirst">
            The Bukit punishes zigzagging: its zones look close and drive far.
            This plan gives each day one side of the peninsula — west cliffs
            first, Bingin-to-Melasti second — so you spend the hours on beaches
            and tables, not on the road. Every stop is a verified place with
            its own page and booking note.
          </p>
          <p className="guide-meta-line">
            Verified 2026-07-12 · food, drink & sunset scope · works by scooter or driver
          </p>
        </header>

        <section className="guide-section">
          <h2>Day 1 — the west cliffs</h2>
          <p className="guide-lede">
            Suluban, Labuan Sait and Padang Padang: the postcard day.
          </p>
          <Timeline stops={DAY1} />
        </section>

        <section className="guide-section">
          <h2>Day 2 — Bingin, then the south side</h2>
          <p className="guide-lede">
            A slow Bingin morning, one ride south, and an afternoon that ends
            where dinner starts.
          </p>
          <Timeline stops={DAY2} />
        </section>

        <section className="guide-section">
          <h2>Booking notes — the four that matter</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <PlaceLink slug="kala-uluwatu" /> — reserve dinner via
                SevenRooms, especially weekends.
              </li>
              <li>
                <PlaceLink slug="waatu" /> — book the Day-2 dinner ahead; it’s
                a destination room.
              </li>
              <li>
                <PlaceLink slug="single-fin" /> — walk-in normally, but book if
                your sunset lands on Wednesday or Sunday.
              </li>
              <li>
                <PlaceLink slug="sundays-beach-club" /> — passes are walk-in;
                cabanas and VIP set-ups pre-book.
              </li>
            </ul>
          </div>
        </section>

        <section className="guide-section" id="get-the-guide">
          <h2>Keep this plan with you</h2>
          <p className="guide-lede">
            Leave your details and the guide stays yours — plus you’ll get the
            next district plans as they pass verification. The full plan is
            already on this page; the form never hides it.
          </p>
          <GuideLeadForm />
        </section>

        <FaqBlock items={FAQ} heading="Before you commit the weekend" />

        <RelatedGuides
          links={[
            {
              href: "/uluwatu/best-restaurants",
              title: "Swap any dinner",
              blurb: "All twelve verified rooms, sorted by decision.",
            },
            {
              href: "/uluwatu/beach-clubs-sunset",
              title: "Swap the beach day",
              blurb: "Seven golden-hour venues compared honestly.",
            },
            {
              href: "/uluwatu/best-brunch",
              title: "Swap the mornings",
              blurb: "Seven verified breakfast answers, from 6 a.m.",
            },
          ]}
        />

        <div className="cta-band">
          <h2>Planning more than a weekend?</h2>
          <p>
            The pillar guide breaks Uluwatu into micro-areas with quick picks
            for every situation — and the island catalogue covers the rest of
            Bali.
          </p>
          <Link href="/uluwatu" className="cta-band-action">
            Open the Uluwatu guide →
          </Link>
        </div>

        <GuideFooter />
      </main>
    </div>
  );
}
