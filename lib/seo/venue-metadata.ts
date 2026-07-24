import type { Metadata } from "next";
import { venueCategoryLabel } from "../venue-presentation";

type VenueMetadataInput = {
  slug: string;
  name: string;
  category: string;
  district: string;
  area?: string;
  description: string;
  indexable: boolean;
};

export function buildVenueMetadata(venue: VenueMetadataInput): Metadata {
  const canonical = `/places/${venue.slug}`;
  const title = `${venue.name} — ${venueCategoryLabel(venue.category)} in ${[venue.area, venue.district].filter(Boolean).join(", ")}`;
  const socialTitle = `${venue.name} · Other Bali`;

  return {
    title,
    description: venue.description,
    alternates: { canonical },
    robots: { index: venue.indexable, follow: venue.indexable },
    openGraph: {
      url: `https://www.otherbali.com${canonical}`,
      title: socialTitle,
      description: venue.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: venue.description,
    },
  };
}
