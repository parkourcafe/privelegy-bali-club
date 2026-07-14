import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoute, getSavedSlugs } from "@/lib/data";
import { readGuestRefForDataAccess } from "@/lib/guest-data-access";
import VenueCard from "@/components/VenueCard";
import TrackedDirectionsLink from "@/components/TrackedDirectionsLink";
import { schemaTypeForVenueCategory } from "@/lib/schema-org";
import { serializeJsonLd } from "@/lib/json-ld";
import { canonicalRoutePath, presentRouteStops } from "@/lib/route-experience";
import RouteActions from "./RouteActions";
import { googleMapsHandoffLabel } from "@/lib/external-links";

export const dynamic = "force-dynamic";

const SITE = "https://www.otherbali.com";

function routeMapsLabel(url: string, venueName: string): string {
  const label = googleMapsHandoffLabel(url);
  if (label === "Directions") return `Directions to ${venueName}`;
  if (label === "Search in Google Maps") return `Search ${venueName} in Google Maps`;
  return `Open ${venueName} in Google Maps`;
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
    `An ordered Bali route with ${route.stops.length} published places.`;
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
  const guestRef = await readGuestRefForDataAccess();
  const [route, savedSlugs] = await Promise.all([
    getRoute(slug),
    getSavedSlugs(guestRef),
  ]);

  if (!route) notFound();
  const routePath = canonicalRoutePath(route.slug);
  if (!routePath) notFound();
  const stops = presentRouteStops(route.stops);
  const canonicalUrl = `${SITE}${routePath}`;

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
          <p className="text-sm font-bold text-[var(--ink)]">
            {stops.length} stop{stops.length === 1 ? "" : "s"}
          </p>
          <p className="mt-2 text-sm">
            Follow the published order, then open each stored Google Maps handoff.
          </p>
          <RouteActions
            routeTitle={route.title}
            canonicalUrl={canonicalUrl}
            stopSlugs={stops.map(({ venue }) => venue.slug)}
            initiallySavedSlugs={savedSlugs}
          />
        </div>
      </header>

      <section className="route-overview" aria-labelledby="route-overview-title">
        <div className="route-overview-heading">
          <div>
            <p className="topline">Route overview</p>
            <h2 id="route-overview-title">{stops.length} stops, in published order</h2>
          </div>
          <p>
            This overview shows sequence only. Live opening status and travel time are not shown
            because this route has no verified live provider data.
          </p>
        </div>
        <ol className="route-overview-stops">
          {stops.map(({ venue, position, anchorId }) => (
            <li key={venue.slug}>
              <Link href={`#${anchorId}`}>
                <span aria-hidden>{position}</span>
                <strong>{venue.name}</strong>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <ol className="timeline-list">
        {stops.map(({ venue: v, position, anchorId, detailHref, directions }) => (
          <li key={v.slug} id={anchorId} className="timeline-item scroll-mt-6">
            <span className="timeline-marker" aria-hidden>{position}</span>
            <div className="route-stop-content">
              <p className="route-stop-eyebrow">Stop {position} of {stops.length}</p>
              <VenueCard v={v} actionMode="none" showSimilar={false} />
              <div className="route-stop-actions">
                <Link href={detailHref} className="button-secondary">
                  View {v.name}
                </Link>
                {directions && (
                  <TrackedDirectionsLink
                    href={directions.href}
                    venueSlug={v.slug}
                    className="button-primary"
                  >
                    {routeMapsLabel(directions.href, v.name)}
                  </TrackedDirectionsLink>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd([
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
                  "@type": schemaTypeForVenueCategory(v.category),
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
