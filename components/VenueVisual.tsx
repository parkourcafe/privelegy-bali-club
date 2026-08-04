import type { Venue } from "@/lib/types";
import VenueImage from "@/components/VenueImage";

export default function VenueVisual({
  name,
  category,
  photoUrl,
  photoRightsApproved,
}: {
  name: string;
  category: Venue["category"];
  photoUrl?: string;
  photoRightsApproved?: boolean;
}) {
  if (photoUrl) {
    return (
      <figure className="venue-visual">
        <VenueImage
          src={photoUrl}
          alt={name}
          variant="visual"
          rightsApproved={photoRightsApproved}
        />
      </figure>
    );
  }

  return (
    <figure
      className={`venue-visual scene-${category}`}
      aria-label={`${name} editorial scene`}
    />
  );
}
