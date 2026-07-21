import { NextResponse } from "next/server";
import { createSharedList, createSharedTrip, getSavedSlugs, getVenuesBySlugs } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";
import { normalizeVenueSlug } from "@/lib/trip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Create a read-only shareable list (master §6c, Rung 2). No identity is needed
// to open it later. Uses the given slugs, or the guest's own saved list.
export async function POST(req: Request) {
  let body: { slugs?: string[] };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { ref, created } = await resolveGuestRef();
  const provided = Array.isArray(body.slugs)
    ? [...new Set(body.slugs.map(normalizeVenueSlug).filter((slug): slug is string => Boolean(slug)))].slice(0, 200)
    : [];
  const published = provided.length > 0 ? await getVenuesBySlugs(provided) : [];
  const publishedSlugs = new Set(published.map((venue) => venue.slug));
  const slugs = provided.length > 0
    ? provided.filter((slug) => publishedSlugs.has(slug))
    : await getSavedSlugs(ref);

  const id = provided.length > 0
    ? await createSharedList(ref, slugs)
    : await createSharedTrip(ref);

  const res = NextResponse.json({ ok: Boolean(id), id });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
