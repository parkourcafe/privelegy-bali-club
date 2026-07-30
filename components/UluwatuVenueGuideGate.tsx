import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import {
  getPublishedVenues,
  getVenueWithPerk,
  isPublicReadyVenue,
} from "@/lib/data";
import { publishedUluwatuVenues, ULUWATU_DB_SLUG } from "@/lib/uluwatu/venues";

export default async function UluwatuVenueGuideGate({
  children,
  requiredSlugs,
}: {
  children: ReactNode;
  requiredSlugs?: readonly string[];
}) {
  if (requiredSlugs) {
    const required = await Promise.all(requiredSlugs.map((slug) => getVenueWithPerk(slug)));
    if (
      !required.every(
        (venue) =>
          venue?.district === ULUWATU_DB_SLUG && isPublicReadyVenue(venue),
      )
    ) {
      notFound();
    }
    return children;
  }

  const active = new Set(
    (await getPublishedVenues())
      .filter((venue) => venue.district === ULUWATU_DB_SLUG)
      .map((venue) => venue.slug),
  );
  if (!publishedUluwatuVenues().every((venue) => active.has(venue.slug))) notFound();
  return children;
}
