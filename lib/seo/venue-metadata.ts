import type { Metadata } from "next";
import { venueCategoryLabel } from "../venue-presentation";
import { buildCompactVenueTitle } from "./venue-title";

const BASE = "https://www.otherbali.com";

type VenueMetadataInput = {
  slug: string;
  name: string;
  category: string;
  district: string;
  area?: string;
  description: string;
  indexable: boolean;
  imageUrl?: string;
};

export function buildVenueMetadata(venue: VenueMetadataInput): Metadata {
  const canonical = `/places/${venue.slug}`;
  const category = venueCategoryLabel(venue.category);
  const title = buildCompactVenueTitle(venue);
  const socialTitle = `${venue.name} · Other Bali`;
  const imageUrl = venue.imageUrl ?? `${BASE}/opengraph-image`;
  const imageAlt = `${venue.name} — ${category} in ${venue.district}`;

  return {
    title: { absolute: title },
    description: venue.description,
    alternates: { canonical },
    robots: { index: venue.indexable, follow: venue.indexable },
    openGraph: {
      url: `${BASE}${canonical}`,
      title: socialTitle,
      description: venue.description,
      type: "article",
      images: [{ url: imageUrl, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: venue.description,
      images: [imageUrl],
    },
  };
}
