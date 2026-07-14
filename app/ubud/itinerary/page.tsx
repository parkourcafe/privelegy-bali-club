import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { serializeJsonLd } from "@/lib/json-ld";

const BASE = "https://www.otherbali.com";

// Search intent: "ubud itinerary / 2 days in ubud / 3 days in ubud / ubud
// 2 day plan". A realistic sequenced plan that leans on the things-to-do sights
// and the Ubud pillar's food/wellness guides. Editorial only, planning_only.
export const metadata: Metadata = {
  title: "2 to 3 days in Ubud — a realistic itinerary",
  description:
    "A realistic Ubud itinerary for 2–3 days: a sunrise ridge walk, the Monkey Forest and temples, Tegallalang terraces, a waterfall, yoga and an evening dance — sequenced to beat the heat and the crowds.",
  alternates: { canonical: "/ubud/itinerary" },
  openGraph: {
    title: "2 to 3 days in Ubud · Other Bali",
    description:
      "A sequenced 2–3 day Ubud plan: ridge walk, Monkey Forest, rice terraces, a waterfall, yoga and a dance performance.",
    url: `${BASE}/ubud/itinerary`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "2 to 3 days in Ubud · Other Bali",
    description: "A realistic, sequenced 2–3 day Ubud plan.",
  },
};

interface Stop {
  time: string;
  title: string;
  note: string;
}

const DAY1: Stop[] = [
  { time: "Early morning", title: "Campuhan Ridge Walk", note: "Start at sunrise while it's cool and quiet — the ridge has little shade. A gentle hour on a paved path between two river valleys." },
  { time: "Breakfast", title: "Coffee and breakfast in town", note: "Ubud does calm, healthy mornings well. See our cafés & coffee guide for where to land." },
  { time: "Late morning", title: "Sacred Monkey Forest & Saraswati Temple", note: "The forest temple and its macaques, then the lotus-pond Saraswati Temple a short walk away in the centre." },
  { time: "Afternoon", title: "Rest, spa or a slow lunch", note: "Beat the midday heat. Ubud is the wellness capital — a massage or yoga class fits here." },
  { time: "Evening", title: "Balinese dance at Ubud Palace", note: "Nightly traditional performances in the palace courtyard. Buy tickets at the gate in the afternoon, then dinner nearby." },
];

const DAY2: Stop[] = [
  { time: "Early morning", title: "Tegallalang Rice Terraces", note: "Drive up early (~30 min) to walk the terraces before the crowds and the heat. Small donation gates on the way down." },
  { time: "Midday", title: "A waterfall — Tegenungan or Tibumana", note: "Cool off at an accessible waterfall south/east of town. Tegenungan is closest; Tibumana is quieter." },
  { time: "Afternoon", title: "Art & culture", note: "An art museum (Puri Lukisan, ARMA or Blanco) or the Ubud Art Market for crafts and textiles." },
  { time: "Evening", title: "A long, slow dinner", note: "Ubud's dinner scene rewards taking your time — see our best restaurants guide, sorted by the evening you want." },
];

const DAY3: Stop[] = [
  { time: "Morning", title: "Yoga or a cooking class", note: "A drop-in class, or a Balinese cooking class that starts with a market visit. Ubud's signature slow morning." },
  { time: "Late morning", title: "Goa Gajah (Elephant Cave)", note: "An ancient cave-temple site in green grounds, ~15 minutes east — sarong provided at the gate." },
  { time: "Afternoon", title: "One more terrace or village", note: "A quieter rice-field walk or a craft village (silver in Celuk, painting in Peliatan) before you move on." },
];

const FAQ = [
  { q: "How many days do you need in Ubud?", a: "Two days covers the highlights; three lets you add a waterfall, an art museum and a cooking or yoga class without rushing. Ubud rewards a slower pace." },
  { q: "What's the best order to see Ubud?", a: "Do the outdoor sights early — the ridge walk, rice terraces and waterfalls — before the heat and tour buses, and keep afternoons for rest, spa or indoor culture." },
  { q: "Should I stay in Ubud or day-trip from the coast?", a: "Staying at least one night is worth it: the early mornings and evening dance are the best of Ubud, and day-trips from the coast lose hours in traffic each way." },
  { q: "Is two days in Ubud enough?", a: "Yes for the essentials — ridge walk, Monkey Forest, a temple, rice terraces and a dance performance. Add a third day for waterfalls, art and a class." },
];

// Article schema only — the visible FaqBlock below emits its own FAQPage.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "2 to 3 days in Ubud — a realistic itinerary",
  description: metadata.description,
  url: `${BASE}/ubud/itinerary`,
  about: "Ubud itinerary",
  isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
};

function DayBlock({ n, title, stops }: { n: number; title: string; stops: Stop[] }) {
  return (
    <section className="guide-section">
      <h2>
        Day {n}: {title}
      </h2>
      <ol className="mt-3 space-y-4">
        {stops.map((s) => (
          <li key={s.title} className="flex gap-4">
            <span className="mt-0.5 w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-[var(--clay)]">
              {s.time}
            </span>
            <div>
              <h3 className="text-base font-semibold text-[var(--ink)]">{s.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">{s.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function UbudItineraryPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="district_page_view" slug="ubud/itinerary" />
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Ubud", href: "/ubud" },
            { name: "Itinerary" },
          ]}
        />

        <header className="guide-hero">
          <p className="guide-kicker">Ubud · Itinerary</p>
          <h1 className="guide-title">2 to 3 days in Ubud</h1>
          <p className="guide-standfirst">
            A realistic Ubud plan that front-loads the outdoor sights before the
            heat and the crowds, and keeps afternoons for rest and culture. Two
            days for the essentials; three to add a waterfall, art and a class.
            Pair it with our{" "}
            <Link href="/ubud/things-to-do">things to do in Ubud</Link> for the
            details on each sight.
          </p>
        </header>

        <DayBlock n={1} title="ridge, forest and a dance" stops={DAY1} />
        <DayBlock n={2} title="rice terraces, a waterfall and art" stops={DAY2} />
        <DayBlock n={3} title="(optional) a class and a quiet corner" stops={DAY3} />

        <section className="guide-section">
          <h2>Practical notes</h2>
          <ul className="mt-2 space-y-2 text-sm text-[var(--muted)]">
            <li>Start early — the terraces, ridge and waterfalls are far better before mid-morning.</li>
            <li>Book the palace dance and any special dinner ahead in high season.</li>
            <li>Distances are short but roads are slow; hire a driver for the terrace-and-waterfall day.</li>
            <li>Ubud is inland with no beach — pair it with a coastal area for the rest of your trip.</li>
          </ul>
        </section>

        <FaqBlock items={FAQ} heading="Good to know" />

        <RelatedGuides
          links={[
            { href: "/ubud", title: "The Ubud guide", blurb: "Where to eat, stay and slow down in Ubud." },
            { href: "/ubud/things-to-do", title: "Best things to do in Ubud", blurb: "The sights and experiences in detail." },
            { href: "/ubud/best-restaurants", title: "Best restaurants in Ubud", blurb: "Long slow dinners, sorted by the evening you want." },
            { href: "/how-many-days-in-bali", title: "How many days in Bali", blurb: "How Ubud fits into the wider trip." },
          ]}
        />

        <GuideFooter />
      </main>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    </div>
  );
}
