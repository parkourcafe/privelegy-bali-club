import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getPublishedVenues } from "@/lib/data";
import { publishedUluwatuVenues, ULUWATU_DB_SLUG } from "@/lib/uluwatu/venues";

export default async function UluwatuVenueGuideGate({ children }: { children: ReactNode }) {
  const active = new Set(
    (await getPublishedVenues())
      .filter((venue) => venue.district === ULUWATU_DB_SLUG)
      .map((venue) => venue.slug),
  );
  if (!publishedUluwatuVenues().every((venue) => active.has(venue.slug))) notFound();
  return children;
}
