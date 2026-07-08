import Link from "next/link";
import type { VenueWithPerk } from "@/lib/data";
import ReserveButton from "@/components/ReserveButton";
import SimilarPlaces from "@/components/SimilarPlaces";

// Presentational venue card — shared by the planning grid and route pages.

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export default function VenueCard({ v }: { v: VenueWithPerk }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      {v.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={v.photoUrl} alt={v.name} className="h-40 w-full object-cover" />
      )}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{v.name}</h3>
          {v.isSponsored && (
            <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500">
              <span className="h-1 w-1 rounded-full bg-stone-400" />
              Sponsored
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500">
          {categoryLabel[v.category] ?? v.category} · {v.address}
        </p>

        {v.vibeTags && v.vibeTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {v.vibeTags.map((t) => (
              <span key={t} className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600">
                {t}
              </span>
            ))}
          </div>
        )}

        {v.blurb && <p className="mt-2 text-sm text-stone-700">{v.blurb}</p>}

        {v.whatToOrder && (
          <p className="mt-2 text-sm text-stone-600">
            <span className="font-medium">What to order:</span> {v.whatToOrder}
          </p>
        )}
        {v.priceAnchor && <p className="mt-1 text-xs text-stone-400">{v.priceAnchor}</p>}

        {v.perk && (
          <div className="mt-3 rounded-xl bg-cyan-50 p-3">
            <p className="text-sm font-medium text-cyan-900">🎟️ {v.perk.title}</p>
            <p className="mt-0.5 text-xs text-cyan-700/80">{v.perk.terms}</p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={v.gmapsUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Directions
          </a>
          <ReserveButton
            venueSlug={v.slug}
            tablepilotSlug={v.tablepilotSlug}
            whatsapp={v.whatsapp}
            perkTitle={v.perk?.title}
          />
          <Link
            href={`/v/${v.slug}/redeem`}
            className="rounded-lg bg-cyan-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-cyan-800"
          >
            Show perk
          </Link>
        </div>

        <SimilarPlaces venue={v} />
      </div>
    </article>
  );
}
