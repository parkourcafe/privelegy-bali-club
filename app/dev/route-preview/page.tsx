import { notFound } from "next/navigation";
import Link from "next/link";
import VenueCard from "@/components/VenueCard";
import { DISTRICT_GUIDE } from "@/lib/districts";
import type { VenueWithPerk } from "@/lib/data";

// DEV-ONLY preview of the first non-Canggu "excursion" route (Stage:
// multi-district routes). The real render lives at /route/ubud-culture-day
// once supabase/migrations/0048 is applied; this harness renders the same
// dynamic back-link/breadcrumb logic against fixture venues, without a DB
// lookup, so it's reviewable locally. 404s in any non-development build.

function backLinkFor(district: string): { label: string; href: string } {
  if (district === "canggu") return { label: "Your Canggu day", href: "/plan" };
  const entry = DISTRICT_GUIDE.find((d) => d.slug === district);
  return { label: entry ? `${entry.name} guide` : "the Bali guide", href: entry?.guidePath ?? "/bali" };
}

const FIXTURE_STOPS: { venue: VenueWithPerk; note: string }[] = [
  {
    note: "Start at the holy spring for melukat — go early, before the tour buses.",
    venue: {
      id: "fixture-tirta-empul",
      slug: "tirta-empul",
      name: "Tirta Empul",
      category: "attraction",
      district: "ubud",
      tier: "editorial_seed",
      isSponsored: false,
      whyItsHere:
        "A temple built around a sacred spring where Balinese Hindus, and visitors, perform melukat, a purification ritual moving spout to spout through the bathing pool.",
      bestFor: "the melukat purification ritual; a culturally rich half-day near Ubud",
      gmapsUrl: "https://www.google.com/maps/search/?api=1&query=-8.4143876,115.3159951",
      officialUrl: "https://disparda.baliprov.go.id/tirta-empul/2021/01/",
    } as VenueWithPerk,
  },
  {
    note: "An easy waterfall stop on the way into Ubud — no trek required.",
    venue: {
      id: "fixture-tegenungan",
      slug: "air-terjun-tegenungan",
      name: "Air Terjun Tegenungan",
      category: "attraction",
      district: "ubud",
      tier: "editorial_seed",
      isSponsored: false,
      whyItsHere:
        "A waterfall about 10 kilometres outside Ubud, next to Tegenungan village — big falls with steps down, one of the easiest waterfalls on the island to reach.",
      bestFor: "an easy waterfall stop near Ubud; travellers who want falls without a trek",
      gmapsUrl: "https://www.google.com/maps/search/?api=1&query=-8.5752294,115.2907014",
      officialUrl: "https://disparda.baliprov.go.id/nungnung-waterfall/2020/04/",
    } as VenueWithPerk,
  },
  {
    note: "Lunch: the Ubud restaurant that popularised Balinese crispy duck.",
    venue: {
      id: "fixture-bebek-bengil",
      slug: "bebek-bengil",
      name: "Bebek Bengil",
      category: "restaurant",
      district: "ubud",
      area: "Padang Tegal, Ubud",
      tier: "editorial_seed",
      isSponsored: false,
      whyItsHere:
        "The Ubud restaurant that popularised Balinese-style crispy duck, open since 1990, set among rice-paddy garden pavilions.",
      bestFor: "first taste of Balinese crispy duck; rice-paddy garden dinner",
      priceAnchor: "$$",
      gmapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Bebek%20Bengil%20Dirty%20Duck%20Diner%20Padang%20Tegal%20Ubud%20Bali",
      officialUrl: "https://www.bebekbengil.co.id/en",
    } as VenueWithPerk,
  },
];

export default function RoutePreviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const back = backLinkFor("ubud");

  return (
    <div className="page-dark">
      <main className="site-shell-narrow">
        <Link href={back.href} className="quiet-link">
          ← {back.label}
        </Link>
        <header className="route-hero">
          <div>
            <p className="topline">Route</p>
            <h1 className="route-title mt-3">An Ubud culture day</h1>
            <p className="hero-copy">Holy spring, waterfall, crispy duck</p>
          </div>
          <div className="route-summary">
            <p className="text-sm font-bold text-[var(--ink)]">{FIXTURE_STOPS.length} stops</p>
            <p className="mt-2 text-sm">A clean line through the day.</p>
          </div>
        </header>

        <ol className="timeline-list">
          {FIXTURE_STOPS.map((s, i) => (
            <li key={s.venue.slug} className="timeline-item">
              <span className="timeline-marker">{i + 1}</span>
              <VenueCard v={{ ...s.venue, blurb: s.note }} />
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
