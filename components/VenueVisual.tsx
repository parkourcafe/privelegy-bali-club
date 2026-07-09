import type { Venue } from "@/lib/types";

const categoryLabel: Record<string, string> = {
  cafe: "Cafe",
  warung: "Warung",
  restaurant: "Dinner",
  beach_club: "Sunset",
  spa: "Reset",
  bar: "Nightcap",
  surf: "Surf",
};

export default function VenueVisual({
  name,
  category,
  photoUrl,
}: {
  name: string;
  category: Venue["category"];
  photoUrl?: string;
}) {
  if (photoUrl) {
    return (
      <figure className="venue-visual">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photoUrl} alt={name} />
      </figure>
    );
  }

  return (
    <figure
      className={`venue-visual scene-${category}`}
      aria-label={`${name} editorial scene`}
    >
      <span className="venue-visual-label">{categoryLabel[category] ?? "Canggu"}</span>
    </figure>
  );
}
