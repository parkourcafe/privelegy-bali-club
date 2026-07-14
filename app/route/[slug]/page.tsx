import type { Metadata } from "next";
import Link from "next/link";
import { getRoute } from "@/lib/data";
import VenueCard from "@/components/VenueCard";

export const dynamic = "force-dynamic";

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
  const description =
    route.subtitle ||
    `A ${route.stops.length}-stop Canggu route — a clean line from first coffee to the last table.`;
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
            Back to your Canggu day
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="page-dark">
    <main className="site-shell-narrow">
      <Link href="/plan" className="quiet-link">
        ← Your Canggu day
      </Link>
      <header className="route-hero">
        <div>
          <p className="topline">Route</p>
          <h1 className="route-title mt-3">{route.title}</h1>
          {route.subtitle && <p className="hero-copy">{route.subtitle}</p>}
        </div>
        <div className="route-summary">
          <p className="text-sm font-bold text-[var(--ink)]">{route.stops.length} stops</p>
          <p className="mt-2 text-sm">
            A clean line from first coffee to the last table.
          </p>
        </div>
      </header>

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
                { "@type": "ListItem", position: 2, name: "Canggu day", item: `${SITE}/plan` },
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
