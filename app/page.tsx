import Link from "next/link";
import { getCangguPlan } from "@/lib/data";

export const dynamic = "force-dynamic";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export default async function Home() {
  const plan = await getCangguPlan();

  return (
    <main className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-cyan-700">
          Bali-wide planning · Canggu-deep
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Your Canggu day</h1>
        <p className="mt-2 text-stone-600">
          A hand-picked day, morning to night. Each spot has a real perk — show
          the QR at the counter, no card to buy.
        </p>
      </header>

      <div className="space-y-10">
        {plan.map((block) => (
          <section key={block.slot}>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">{block.label}</h2>
              <span className="text-xs text-stone-500">{block.hint}</span>
            </div>

            <ul className="space-y-3">
              {block.venues.map((v) => (
                <li
                  key={v.slug}
                  className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{v.name}</h3>
                        {v.isSponsored && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                            Sponsored
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        {categoryLabel[v.category] ?? v.category} · {v.address}
                      </p>
                      <p className="mt-2 text-sm text-stone-700">{v.blurb}</p>
                    </div>
                  </div>

                  {v.perk && (
                    <div className="mt-3 rounded-xl bg-cyan-50 p-3">
                      <p className="text-sm font-medium text-cyan-900">
                        🎟️ {v.perk.title}
                      </p>
                      <p className="mt-0.5 text-xs text-cyan-700/80">{v.perk.terms}</p>
                    </div>
                  )}

                  <div className="mt-3 flex gap-2">
                    <a
                      href={v.gmapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
                    >
                      Directions
                    </a>
                    <Link
                      href={`/v/${v.slug}/redeem`}
                      className="rounded-lg bg-cyan-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-800"
                    >
                      Redeem at venue
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <footer className="mt-12 border-t border-stone-200 pt-6 text-xs text-stone-400">
        Free to use. We earn from venues only when a guest actually redeems —
        never from you.
      </footer>
    </main>
  );
}
