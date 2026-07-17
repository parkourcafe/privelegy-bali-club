import BrowsePill, { type BrowseOption } from "./BrowsePill";
import { PILLARS } from "@/lib/pillars";
import { COLLECTIONS, liveCollectionSlugs } from "@/lib/collections";

// Server wrapper for the Where · Taste · Moment browse pill. Supplies the live
// option sets so the pill never links to a held (404) collection: districts
// come from the hand-crafted pillars, tastes/moments from the collections that
// currently clear the publication gate. Async server component embedded in the
// (sync) landing page.
export default async function BrowseBar() {
  const live = new Set(await liveCollectionSlugs());

  const where: BrowseOption[] = PILLARS.map((p) => ({ label: p.name, href: `/${p.slug}` }));
  const taste: BrowseOption[] = COLLECTIONS.filter(
    (c) => c.kind === "taste" && live.has(c.slug),
  ).map((c) => ({ label: c.taste, href: `/collections/${c.slug}` }));
  const moment: BrowseOption[] = COLLECTIONS.filter(
    (c) => c.kind === "moment" && live.has(c.slug),
  ).map((c) => ({ label: c.taste, href: `/collections/${c.slug}` }));

  // Nothing to browse yet (no DB / no live collections) — render nothing.
  if (taste.length === 0 && moment.length === 0) return null;

  return (
    <section className="relative z-10 mx-auto -mt-8 w-full max-w-6xl px-5 pb-4">
      <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--ob-brass)]">
        Or jump straight in
      </p>
      <BrowsePill where={where} taste={taste} moment={moment} />
    </section>
  );
}
