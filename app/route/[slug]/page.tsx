import Link from "next/link";
import { getRoute } from "@/lib/data";
import VenueCard from "@/components/VenueCard";

export const dynamic = "force-dynamic";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = await getRoute(slug);

  if (!route) {
    return (
      <main className="site-shell-narrow text-center">
        <h1 className="text-xl font-semibold">Route not found</h1>
        <Link href="/" className="quiet-link mt-4 inline-block">
          Back to your Canggu day
        </Link>
      </main>
    );
  }

  return (
    <main className="site-shell-narrow">
      <Link href="/" className="quiet-link">
        ← Other Bali · the guide
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
  );
}
