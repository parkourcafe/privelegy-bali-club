import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDistrictHubs, getIntentSpokes, type DistrictHub } from "@/lib/data";
import { SITE_ORIGIN, HUB_CATEGORY_LABEL, venueJsonLd } from "@/lib/hub";
import { normalizeJobs, INTENT_BY_URL } from "@/lib/intents";
import VenueVisual from "@/components/VenueVisual";
import ReserveButton from "@/components/ReserveButton";
import TrackedDirectionsLink from "@/components/TrackedDirectionsLink";

export const revalidate = 3600;
export const dynamicParams = false;

// Only active venues in published districts get a page — the same set the hubs
// list, so /place/[slug] never renders an archived or thin-district row.
async function findVenue(slug: string, hubs: DistrictHub[]) {
  for (const hub of hubs) {
    const v = hub.venues.find((x) => x.slug === slug);
    if (v) return { venue: v, hub };
  }
  return null;
}

export async function generateStaticParams() {
  const hubs = await getDistrictHubs();
  return hubs.flatMap((h) => h.venues.map((v) => ({ slug: v.slug })));
}

const CATEGORY_LABEL: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Spa",
  bar: "Bar",
  surf: "Surf",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hubs = await getDistrictHubs();
  const found = await findVenue(slug, hubs);
  if (!found) return {};
  const { venue, hub } = found;
  const cat = CATEGORY_LABEL[venue.category] ?? venue.category;
  const description =
    venue.whyItsHere ||
    `${venue.name} — a ${cat.toLowerCase()} in ${hub.name}${
      venue.area ? `, ${venue.area}` : ""
    }, Bali. What to order, price and directions.`;
  return {
    title: `${venue.name} — ${hub.name}`,
    description: description.slice(0, 158),
    alternates: { canonical: `/place/${venue.slug}` },
    openGraph: {
      title: `${venue.name} · Other Bali`,
      description: description.slice(0, 200),
      url: `${SITE_ORIGIN}/place/${venue.slug}`,
      type: "website",
    },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [hubs, allSpokes] = await Promise.all([getDistrictHubs(), getIntentSpokes()]);
  const found = await findVenue(slug, hubs);
  if (!found) notFound();
  const { venue: v, hub } = found;

  // Intent spokes this venue actually appears on (internal-link mesh).
  const onSpokes = allSpokes.filter(
    (s) => s.district === hub.slug && s.venues.some((x) => x.slug === v.slug)
  );
  // Its own intent tags that map to a known intent (even if the spoke is thin).
  const tags = normalizeJobs(v.jobs)
    .map((j) => [...INTENT_BY_URL.values()].find((i) => i.jobSlug === j))
    .filter(Boolean);
  const actionMode = hub.slug === "canggu" ? "full" : "directions";

  return (
    <div className="page-dark">
      <main className="site-shell">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)]">
          <Link href="/" className="quiet-link">
            Other Bali
          </Link>{" "}
          ›{" "}
          <Link href="/bali" className="quiet-link">
            Bali
          </Link>{" "}
          ›{" "}
          <Link href={`/bali/${hub.slug}`} className="quiet-link">
            {hub.name}
          </Link>{" "}
          › <span className="text-[var(--ink)]">{v.name}</span>
        </nav>

        <article className="mt-4 max-w-2xl">
          <VenueVisual name={v.name} category={v.category} photoUrl={v.photoUrl} />

          <h1 className="hero-title mt-5 !text-4xl">{v.name}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {CATEGORY_LABEL[v.category] ?? v.category}
            {v.area ? ` · ${v.area}` : ""}
            {v.address ? ` · ${v.address}` : ""}
          </p>

          {v.vibeTags && v.vibeTags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {v.vibeTags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-[rgba(169,189,158,0.16)] px-2 py-0.5 text-[11px] font-semibold text-[var(--moss)]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {v.whyItsHere && <p className="why-here mt-4">{v.whyItsHere}</p>}

          {(v.bestFor || v.notFor) && (
            <div className="fit-context mt-4">
              {v.bestFor && (
                <p className="fit-best">
                  <span className="font-semibold">Best for:</span> {v.bestFor}
                </p>
              )}
              {v.notFor && (
                <p className="fit-not">
                  <span className="font-semibold">Not for:</span> {v.notFor}
                </p>
              )}
            </div>
          )}

          {v.whatToOrder && (
            <p className="mt-4 text-sm text-[var(--ink)]">
              <span className="font-semibold">What to order:</span> {v.whatToOrder}
            </p>
          )}
          {v.priceAnchor && (
            <p className="mt-1 text-xs text-[var(--muted)]">{v.priceAnchor}</p>
          )}

          {v.perk && (
            <div className="perk-strip mt-4">
              <p className="perk-title">{v.perk.title}</p>
              <p className="perk-terms">{v.perk.terms}</p>
            </div>
          )}

          <div className="action-row mt-5">
            <TrackedDirectionsLink
              href={v.gmapsUrl}
              venueSlug={v.slug}
              className="button-secondary"
            >
              Directions
            </TrackedDirectionsLink>
            {actionMode === "full" && (
              <>
                <ReserveButton
                  venueSlug={v.slug}
                  tablepilotSlug={v.tablepilotSlug}
                  whatsapp={v.whatsapp}
                  perkTitle={v.perk?.title}
                />
                {v.perk && (
                  <Link
                    href={`/v/${v.slug}/redeem`}
                    className={v.tablepilotSlug ? "button-secondary" : "button-primary"}
                  >
                    Show offer
                  </Link>
                )}
              </>
            )}
          </div>
        </article>

        {(onSpokes.length > 0 || tags.length > 0) && (
          <section className="mt-10">
            <h2 className="section-title">Find it under</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/bali/${hub.slug}`}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                All of {hub.name}
              </Link>
              {(onSpokes.length > 0
                ? onSpokes.map((s) => ({ url: `/bali/${hub.slug}/${s.intent.urlSlug}`, label: `Best ${s.intent.short.toLowerCase()} in ${hub.name}` }))
                : tags.map((t) => ({ url: `/bali/${hub.slug}`, label: HUB_CATEGORY_LABEL[t!.jobSlug] ?? t!.short }))
              ).map((link) => (
                <Link
                  key={link.url + link.label}
                  href={link.url}
                  className="rounded-full border border-[rgba(198,154,92,0.35)] px-3 py-1 text-sm font-semibold text-[var(--lagoon-strong)] transition-colors hover:text-[var(--ink)]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(venueJsonLd(v, hub.name, hub.slug)) }}
      />
    </div>
  );
}
