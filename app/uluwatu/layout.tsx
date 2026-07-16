import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getPublishedVenues } from "@/lib/data";
import {
  publishedUluwatuVenues,
  ULUWATU_DB_SLUG,
} from "@/lib/uluwatu/venues";

export const revalidate = 300;

// The prose-heavy Uluwatu guides reference the canonical static roster. If a
// single referenced venue is no longer active+published in the database, hide
// the whole guide subtree rather than leave a stale recommendation in prose or
// schema markup. Operators can restore it after reconciling the registry.
export default async function UluwatuPublicationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const active = new Set(
    (await getPublishedVenues())
      .filter((venue) => venue.district === ULUWATU_DB_SLUG)
      .map((venue) => venue.slug),
  );
  const complete = publishedUluwatuVenues().every((venue) => active.has(venue.slug));
  if (!complete) notFound();
  return children;
}
