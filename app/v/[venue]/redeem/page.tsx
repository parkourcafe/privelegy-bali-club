import Link from "next/link";
import { getVenueWithPerk } from "@/lib/data";
import VenueVisual from "@/components/VenueVisual";
import RedeemFlow from "./RedeemFlow";

export const dynamic = "force-dynamic";

export default async function RedeemPage({
  params,
}: {
  params: Promise<{ venue: string }>;
}) {
  const { venue: slug } = await params;
  const venue = await getVenueWithPerk(slug);

  if (!venue) {
    return (
      <main className="redeem-shell text-center">
        <h1 className="text-xl font-semibold">Venue not found</h1>
        <Link href="/" className="quiet-link mt-4 inline-block">
          Back to Other Bali
        </Link>
      </main>
    );
  }

  return (
    <main className="redeem-shell">
      <Link href="/" className="quiet-link">
        ← Other Bali
      </Link>

      <div className="redeem-card mt-5">
        <VenueVisual name={venue.name} category={venue.category} photoUrl={venue.photoUrl} />
        <div className="redeem-card-body">
          <h1 className="venue-name">{venue.name}</h1>
          <p className="venue-meta">{venue.address}</p>

          {venue.perk ? (
            <>
              <div className="perk-strip">
                <p className="perk-title">{venue.perk.title}</p>
                <p className="perk-terms">{venue.perk.terms}</p>
              </div>

              <RedeemFlow
                venueSlug={venue.slug}
                venueName={venue.name}
                perkTitle={venue.perk.title}
              />
            </>
          ) : (
            <p className="mt-4 text-sm text-[var(--muted)]">
              No confirmed venue offer here right now.
            </p>
          )}
        </div>
      </div>

      <p className="redeem-note">
        Redeem only when you are at the venue. Staff will glance at the
        confirmation — that is the whole check-in.
      </p>
    </main>
  );
}
