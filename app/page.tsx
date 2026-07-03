import Link from "next/link";
import { getCangguPlan, getRoutes } from "@/lib/data";
import PlanView from "./PlanView";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [plan, routes] = await Promise.all([getCangguPlan(), getRoutes()]);

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8">
      <header className="mb-6">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
            Canggu · free perks map
          </p>
          <Link href="/me" className="text-xs font-medium text-cyan-700 hover:underline">
            My perks →
          </Link>
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Your Canggu day</h1>
        <p className="mt-2 text-stone-600">
          Hand-picked spots, morning to night — each with a real perk.
        </p>
        <p className="mt-3 rounded-xl bg-white p-3 text-sm text-stone-600 shadow-sm">
          <b>How it works:</b> pick a place → show the perk to staff → enjoy. No
          signup, no card. Just show the screen.
        </p>
      </header>

      {routes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">Ready-made routes</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {routes.map((r) => (
              <Link
                key={r.slug}
                href={`/route/${r.slug}`}
                className="w-56 shrink-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm hover:border-cyan-300"
              >
                <p className="font-semibold">{r.title}</p>
                {r.subtitle && <p className="mt-0.5 text-xs text-stone-500">{r.subtitle}</p>}
                <p className="mt-3 text-xs font-medium text-cyan-700">{r.stopCount} stops →</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <PlanView plan={plan} />

      <footer className="mt-12 border-t border-stone-200 pt-6 text-xs text-stone-400">
        Free to use. We earn from venues only when a guest actually redeems —
        never from you.
      </footer>
    </main>
  );
}
