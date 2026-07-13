import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getGuide } from "@/lib/guides";

const BASE = "https://otherbali.com";
const guide = getGuide("where-to-stay-in-bali")!;

export const metadata: Metadata = {
  title: guide.title,
  description: guide.description,
  alternates: { canonical: `/${guide.slug}` },
  openGraph: {
    title: `${guide.title} · Other Bali`,
    description: guide.description,
    url: `${BASE}/${guide.slug}`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `${guide.title} · Other Bali`,
    description: guide.description,
  },
};

// Each first-timer area: the honest "who it's for / what a day looks like /
// who it's not for", then a link up to the deep pillar. Fit-context only —
// never a quality warning (guardrail #7).
const AREAS = [
  {
    href: "/canggu",
    name: "Canggu",
    tag: "Surf, cafés and a young crowd",
    forWho: "First-timers who want energy — surf lessons, laptop cafés, beach clubs and a big dinner scene.",
    body: "The island's busiest traveller hub, spread across Batu Bolong, Berawa and Echo Beach. A day here runs: a surf or a work café in the morning, a long lunch, a sunset beach club, then dinner near your villa. It's built-up and there's real traffic between the areas — you come for the buzz, not empty sand.",
    notFor: "quiet, empty beaches or a traditional-Bali feel",
  },
  {
    href: "/seminyak",
    name: "Seminyak",
    tag: "Dining, beach clubs and easy comfort",
    forWho: "First-timers who want the polished side — good restaurants, sunset beach clubs, spas and walkable streets.",
    body: "Bali's original style strip, and the easiest area to enjoy without a plan: an all-day café, a spa in the afternoon, a west-facing beach for the sunset, a considered dinner — all close together. It's denser and pricier than Canggu, and less about surf.",
    notFor: "budget backpackers or anyone chasing nature",
  },
  {
    href: "/uluwatu",
    name: "Uluwatu",
    tag: "Clifftops, sunsets and world-class surf",
    forWho: "Sunset-and-view seekers, surfers, and couples who want a bit of drama.",
    body: "The southern Bukit peninsula — limestone cliffs, turquoise coves and clifftop bars where the sunset is the whole event. It's beautiful and spread out, so you'll scooter or drive between spots, and it's a longer haul from the airport and the rest of the island.",
    notFor: "walking everywhere or a lively town centre",
  },
  {
    href: "/ubud",
    name: "Ubud",
    tag: "Jungle, rice terraces and slow mornings",
    forWho: "First-timers who want culture, nature and calm over beach and nightlife.",
    body: "Inland in the hills: rice terraces, temples, yoga, waterfalls and long, slow dinners. It's cooler and greener than the coast and leans wellness over party. There's no beach — the sea is about an hour away — so most people pair Ubud with a coastal area rather than staying the whole trip.",
    notFor: "beach-first travellers who want the ocean at the door",
  },
  {
    href: "/sanur",
    name: "Sanur",
    tag: "Calm, walkable and easy on the family",
    forWho: "Families, older travellers, and anyone who wants a low-key base with a beach path.",
    body: "A quiet east-coast town with a long paved beach walk, calm swimmable water and fast boats to the Nusa islands. It faces east, so mornings bring sunrise rather than sunset. Relaxed and unflashy — the opposite of Canggu's noise.",
    notFor: "nightlife or a scene",
  },
];

const CHOOSE = [
  ["Surf, cafés and nightlife energy", "Canggu", "/canggu"],
  ["Polished dining and beach clubs, all walkable", "Seminyak", "/seminyak"],
  ["Clifftop sunsets, surf and romance", "Uluwatu", "/uluwatu"],
  ["Jungle, culture, yoga and calm", "Ubud", "/ubud"],
  ["Quiet, family-easy and walkable", "Sanur", "/sanur"],
];

const FAQ = [
  {
    q: "Which area is best for a first trip to Bali?",
    a: "If you want one easy answer: Seminyak or Canggu. Both put beaches, restaurants, cafés and sunsets within reach without much planning. Choose Seminyak for polish and walkability, Canggu for surf and a younger crowd.",
  },
  {
    q: "Where should families with kids stay in Bali?",
    a: "Sanur — calm, swimmable water, a flat beach path for strollers and bikes, and easy day trips to the Nusa islands. Nusa Dua is the other family pick, with gated resorts and safe beaches.",
  },
  {
    q: "Is Ubud good for a first-timer?",
    a: "Yes, for a few nights — it's the culture-and-nature half of Bali. Pair it with a beach area rather than staying inland the whole trip, since Ubud has no beach of its own.",
  },
  {
    q: "How many areas should I stay in on a first trip?",
    a: "One or two. A single base is easiest; if you want variety, do a few nights inland in Ubud and a few by the sea. Moving every day burns the trip in traffic.",
  },
  {
    q: "Where is the best sunset in Bali?",
    a: "The west coast — Seminyak, Canggu and Uluwatu all face the sunset. Sanur faces east (sunrise), and Ubud is inland with no sea view.",
  },
];

export default function WhereToStayPage() {
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Where to stay in Bali" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${BASE}/${guide.slug}`,
    about: "Where to stay in Bali",
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
          <h1 className="mt-2">{guide.title}</h1>
          <p className="guide-lede">
            Bali isn&apos;t one place, and where you stay decides your whole
            trip. For a first visit, five areas cover almost everyone:{" "}
            <Link href="/canggu">Canggu</Link> for surf-and-café energy,{" "}
            <Link href="/seminyak">Seminyak</Link> for polished dining and beach
            clubs, <Link href="/uluwatu">Uluwatu</Link> for clifftop sunsets,{" "}
            <Link href="/ubud">Ubud</Link> for jungle calm, and{" "}
            <Link href="/sanur">Sanur</Link> for a quiet, walkable base. Here&apos;s
            how they actually differ, and how to pick.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Short on time? Pick one and stay put — moving every two days is what
            burns a first trip.
          </p>
        </header>

        {AREAS.map((area) => (
          <section key={area.href} className="guide-section">
            <div className="flex items-baseline justify-between gap-4">
              <h2>{area.name}</h2>
              <Link href={area.href} className="quiet-link">
                The {area.name} guide →
              </Link>
            </div>
            <p className="text-sm font-semibold text-[var(--clay)]">{area.tag}</p>
            <p className="mt-1 text-sm text-[var(--ink)]">
              <span className="font-semibold">Best for:</span> {area.forWho}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {area.body}
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              <span className="font-semibold">Not for:</span> {area.notFor}.
            </p>
          </section>
        ))}

        <section className="guide-section">
          <h2>How to choose, quickly</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {CHOOSE.map(([want, area, href]) => (
              <li key={href} className="text-[var(--muted)]">
                Want <span className="text-[var(--ink)]">{want}</span> →{" "}
                <Link href={href} className="font-semibold">
                  {area}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>Can you split your stay?</h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
            Yes — the classic first-timer combo is a few nights inland in{" "}
            <Link href="/ubud">Ubud</Link> and a few by the sea in{" "}
            <Link href="/canggu">Canggu</Link>,{" "}
            <Link href="/seminyak">Seminyak</Link> or{" "}
            <Link href="/uluwatu">Uluwatu</Link>. Keep it to two bases, not five:
            every move costs you the better part of a day in traffic.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Distances matter here. The airport sits in the south, near Kuta.
            Seminyak and Canggu are roughly 30–60 minutes north; Uluwatu is 45–60
            minutes south; Sanur about 30 minutes east; Ubud 60–90 minutes
            inland. Traffic is real all day — plan your arrival and your flight
            out with a buffer.
          </p>
        </section>

        <FaqBlock items={FAQ} heading="First-timer questions" />

        <RelatedGuides
          heading="The area guides"
          links={[
            { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
            { href: "/seminyak", title: "The Seminyak guide", blurb: "Dining, sunset beach clubs and Bali's densest spa scene." },
            { href: "/uluwatu", title: "The Uluwatu guide", blurb: "Cliff-edge sunsets, world-class surf, dinners with a view." },
            { href: "/ubud", title: "The Ubud guide", blurb: "Jungle mornings, rice-terrace calm, long slow dinners." },
            { href: "/sanur", title: "The Sanur guide", blurb: "A calm, walkable, sunrise base with easy island connections." },
            { href: "/first-time-in-bali", title: "First time in Bali", blurb: "Your first day, without the rookie mistakes." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
