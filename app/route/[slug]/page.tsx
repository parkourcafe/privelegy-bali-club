import type { Metadata } from "next";
import Link from "next/link";
import { getRoute, getRoutes } from "@/lib/data";
import VenueCard from "@/components/VenueCard";
import { GuideHeroMedia } from "@/components/GuideMedia";
import { DISTRICT_GUIDE } from "@/lib/districts";

// Route pages are ordered sequences. Back-links return to the relevant area
// guide, not /plan, so Plan can stay the future-trip surface.
const DISTRICT_BACK_OVERRIDE: Record<string, { label: string; crumbLabel: string; href: string }> = {
  canggu: { label: "Canggu guide", crumbLabel: "Canggu", href: "/canggu" },
};

function backLinkFor(district: string): { label: string; crumbLabel: string; href: string } {
  const override = DISTRICT_BACK_OVERRIDE[district];
  if (override) return override;
  const entry = DISTRICT_GUIDE.find((d) => d.slug === district);
  const label = entry ? `${entry.name} guide` : "the Bali guide";
  return { label, crumbLabel: label, href: entry?.guidePath ?? "/bali" };
}

// ISR: statically cached for speed/SEO, regenerated at most every 5 min so
// route/venue edits in Supabase surface without a redeploy. Build-safe now
// that public reads degrade instead of throwing (lib/data.ts).
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getRoutes()).map((route) => ({ slug: route.slug }));
}

const SITE = "https://www.otherbali.com";

// Route JSON-LD used to hardcode every stop as schema.org/Restaurant, which is
// wrong for cafés, bars, spas and studios (audit 2026-07, P1). Map the venue
// category to the closest schema.org type; unknown falls back to LocalBusiness.
const SCHEMA_TYPE_BY_CATEGORY: Record<string, string> = {
  cafe: "CafeOrCoffeeShop",
  warung: "Restaurant",
  restaurant: "Restaurant",
  beach_club: "Restaurant",
  bar: "BarOrPub",
  spa: "HealthAndBeautyBusiness",
  beauty: "HealthAndBeautyBusiness",
  fitness: "SportsActivityLocation",
  yoga: "SportsActivityLocation",
  surf: "SportsActivityLocation",
  hotel: "Hotel",
  resort: "Resort",
  attraction: "TouristAttraction",
  activity: "TouristAttraction",
};
function schemaTypeForCategory(category?: string): string {
  return (category && SCHEMA_TYPE_BY_CATEGORY[category]) || "LocalBusiness";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = await getRoute(slug);
  if (!route) return { title: "Route not found", robots: { index: false, follow: false } };
  const districtName = DISTRICT_GUIDE.find((d) => d.slug === route.district)?.name ?? "Bali";
  const description =
    route.subtitle || `A ${route.stops.length}-stop day in ${districtName}.`;
  return {
    title: route.title,
    description: description.slice(0, 158),
    alternates: { canonical: `/route/${slug}` },
    openGraph: {
      title: `${route.title} · Other Bali`,
      description: description.slice(0, 200),
      url: `${SITE}/route/${slug}`,
      type: "article",
    },
  };
}

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = await getRoute(slug);

  if (!route) {
    return (
      <div className="page-dark">
        <main className="site-shell-narrow text-center">
          <h1 className="text-xl font-semibold">Route not found</h1>
          <Link href="/plan" className="quiet-link mt-4 inline-block">
            Back to Bali planning
          </Link>
        </main>
      </div>
    );
  }

  const back = backLinkFor(route.district);

  return (
    <div className="page-dark">
    <main className="site-shell-narrow">
      <Link href={back.href} className="quiet-link">
        ← {back.label}
      </Link>
      <header className="route-hero">
        <div>
          <p className="topline">Route</p>
          <h1 className="route-title mt-3">{route.title}</h1>
          {route.subtitle && <p className="hero-copy">{route.subtitle}</p>}
          <p className="mt-3 text-sm text-[var(--muted)]">
            An ordered sequence of stops. Use this when you want the day in a
            clean line, not a catalogue or a generated shortlist.
          </p>
        </div>
        <div className="route-summary">
          <p className="text-sm font-bold text-[var(--ink)]">{route.stops.length} stops</p>
          <p className="mt-2 text-sm">A clean line through the day.</p>
        </div>
      </header>

      <GuideHeroMedia seed={`route ${route.slug} ${route.title}`} />

      <ol className="timeline-list">
        {route.stops.map((v, i) => (
          <li key={v.slug} className="timeline-item">
            <span className="timeline-marker">{i + 1}</span>
            <VenueCard v={v} />
          </li>
        ))}
      </ol>
    </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE },
                { "@type": "ListItem", position: 2, name: back.crumbLabel, item: `${SITE}${back.href}` },
                { "@type": "ListItem", position: 3, name: route.title, item: `${SITE}/route/${slug}` },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: route.title,
              numberOfItems: route.stops.length,
              itemListElement: route.stops.map((v, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": schemaTypeForCategory(v.category),
                  name: v.name,
                  ...(v.address ? { address: v.address } : {}),
                  ...(v.gmapsUrl ? { hasMap: v.gmapsUrl } : {}),
                },
              })),
            },
          ]),
        }}
      />
    </div>
  );
}
