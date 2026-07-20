import type { Venue } from "@/lib/types";
import VenueImage from "@/components/VenueImage";

const categoryLabel: Record<string, string> = {
  cafe: "Cafe",
  warung: "Warung",
  restaurant: "Dinner",
  beach_club: "Sunset",
  spa: "Reset",
  fitness: "Fitness",
  yoga: "Yoga",
  beauty: "Beauty",
  bar: "Nightcap",
  surf: "Surf",
  hotel: "Stay",
  resort: "Stay",
  attraction: "Explore",
  activity: "Adventure",
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
        <VenueImage src={photoUrl} alt={name} variant="visual" />
      </figure>
    );
  }

  return (
    <figure
      className={`venue-visual scene-${category}`}
      aria-label={`${name} editorial scene`}
    >
      <span className="venue-visual-label">{categoryLabel[category] ?? ""}</span>
    </figure>
  );
}
