import { NextResponse } from "next/server";
import { createSharedList, getSavedSlugs } from "@/lib/data";
import { resolveGuestRef, GUEST_COOKIE, guestCookieOptions } from "@/lib/guest-server";

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
    ? body.slugs.filter((s) => typeof s === "string" && s.length > 0).slice(0, 200)
    : [];
  const slugs = provided.length > 0 ? provided : await getSavedSlugs(ref);

  const id = slugs.length > 0 ? await createSharedList(ref, slugs) : null;

  const res = NextResponse.json({ ok: Boolean(id), id });
  if (created) res.cookies.set(GUEST_COOKIE, ref, guestCookieOptions());
  return res;
}
