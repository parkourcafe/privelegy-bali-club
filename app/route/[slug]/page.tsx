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
      <main className="mx-auto w-full max-w-md px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Route not found</h1>
        <Link href="/" className="mt-4 inline-block text-cyan-700 underline">
          Back to your Canggu day
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8">
      <Link href="/" className="text-sm text-stone-500 hover:underline">
        ← Your Canggu day
      </Link>
      <header className="mt-3 mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">Route</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{route.title}</h1>
        {route.subtitle && <p className="mt-2 text-stone-600">{route.subtitle}</p>}
        <p className="mt-1 text-xs text-stone-400">{route.stops.length} stops</p>
      </header>

      <ol className="space-y-4">
        {route.stops.map((v, i) => (
          <li key={v.slug} className="relative pl-8">
            <span className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-cyan-700 text-xs font-bold text-white">
              {i + 1}
            </span>
            <VenueCard v={v} />
          </li>
        ))}
      </ol>
    </main>
  );
}
