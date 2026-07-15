import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getVenueWithPerk, getPublishedVenues, isPublicReadyVenue, getSavedSlugs } from "@/lib/data";
import { readGuestRef } from "@/lib/guest-server";
import SaveButton from "@/components/SaveButton";
import {
  freshVerifiedUluwatuActionUrl,
  getUluwatuContent,
  ULUWATU_DB_SLUG,
  ULUWATU_PUBLIC_BASE,
} from "@/lib/uluwatu/venues";
import { isVenueIndexable } from "@/lib/publication";
import { rankSimilar } from "@/lib/similar";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PlaceCard from "@/components/PlaceCard";
import PageViewTracker from "@/components/PageViewTracker";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import VenueActionBar from "@/components/VenueActionBar";
import StructuredMenu from "@/components/menu/StructuredMenu";
import { menuActionFixtures } from "@/lib/contracts/menu-action.fixtures";
import type { MenuRecord, VenueActionBarProps } from "@/lib/contracts/menu-action";
import { getPublicVenueDetailExtension } from "@/lib/data/public-venue-detail";
import { safeTablePilotPublicBase } from "@/lib/integrations/tablepilot-environment";

export const dynamic = "force-dynamic";

const BASE = "https://www.otherbali.com";

const categoryLabel: Record<string, string> = {
  cafe: "Café",
  warung: "Warung",
  restaurant: "Restaurant",
  beach_club: "Beach club",
  spa: "Wellness",
  beauty: "Beauty & salon",
  fitness: "Fitness",
  yoga: "Yoga",
  bar: "Bar",
  surf: "Surf",
};

// Which Uluwatu guide a category belongs to (breadcrumb + related links).
const categoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/uluwatu/best-restaurants", label: "Restaurants" },
  cafe: { href: "/uluwatu/best-brunch", label: "Brunch & cafés" },
  beach_club: { href: "/uluwatu/beach-clubs-sunset", label: "Beach clubs & sunset" },
  bar: { href: "/uluwatu/beach-clubs-sunset", label: "Beach clubs & sunset" },
};

// Which Canggu guide a category belongs to (breadcrumb + related links).
const cangguCategoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/canggu/best-restaurants", label: "Restaurants" },
  cafe: { href: "/canggu/work-friendly-cafes", label: "Cafés" },
  spa: { href: "/canggu/best-spas", label: "Spas & wellness" },
  beach_club: { href: "/canggu/beach-clubs-sunset", label: "Beach clubs & sunset" },
  bar: { href: "/canggu/beach-clubs-sunset", label: "Beach clubs & sunset" },
};

// Which Ubud guide a category belongs to (breadcrumb + related links).
const ubudCategoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/ubud/best-restaurants", label: "Restaurants" },
  cafe: { href: "/ubud/best-cafes-coffee", label: "Cafés & coffee" },
  spa: { href: "/ubud/best-yoga-wellness", label: "Yoga & wellness" },
};

// Which Nusa Dua guide a category belongs to (breadcrumb + related links).
const nusaDuaCategoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/nusa-dua/best-restaurants", label: "Restaurants" },
  warung: { href: "/nusa-dua/best-restaurants", label: "Restaurants" },
  beach_club: { href: "/nusa-dua/best-restaurants", label: "Restaurants" },
  spa: { href: "/nusa-dua/spas-wellness", label: "Spas & wellness" },
  fitness: { href: "/nusa-dua/spas-wellness", label: "Spas & wellness" },
  yoga: { href: "/nusa-dua/spas-wellness", label: "Spas & wellness" },
};

// Which Sanur guide a category belongs to (breadcrumb + related links).
const sanurCategoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/sanur/best-restaurants", label: "Restaurants" },
  warung: { href: "/sanur/best-restaurants", label: "Restaurants" },
  cafe: { href: "/sanur/cafes-and-bars", label: "Cafés & bars" },
  bar: { href: "/sanur/cafes-and-bars", label: "Cafés & bars" },
  spa: { href: "/sanur/spas-wellness", label: "Spas & wellness" },
  yoga: { href: "/sanur/spas-wellness", label: "Spas & wellness" },
  beauty: { href: "/sanur/spas-wellness", label: "Spas & wellness" },
};

// Which Seminyak guide a category belongs to (breadcrumb + related links).
const seminyakCategoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/seminyak/best-restaurants", label: "Restaurants" },
  warung: { href: "/seminyak/best-restaurants", label: "Restaurants" },
  beach_club: { href: "/seminyak/beach-clubs-sunset", label: "Beach clubs & sunset" },
  bar: { href: "/seminyak/beach-clubs-sunset", label: "Beach clubs & sunset" },
  cafe: { href: "/seminyak/cafes-coffee", label: "Cafés & coffee" },
  spa: { href: "/seminyak/spas-salons-wellness", label: "Spas, salons & wellness" },
  beauty: { href: "/seminyak/spas-salons-wellness", label: "Spas, salons & wellness" },
  fitness: { href: "/seminyak/spas-salons-wellness", label: "Spas, salons & wellness" },
  yoga: { href: "/seminyak/spas-salons-wellness", label: "Spas, salons & wellness" },
};

// Which Jimbaran guide a category belongs to (breadcrumb + related links).
const jimbaranCategoryGuide: Record<string, { href: string; label: string }> = {
  restaurant: { href: "/jimbaran/best-restaurants", label: "Restaurants" },
  warung: { href: "/jimbaran/best-restaurants", label: "Restaurants" },
  beach_club: { href: "/jimbaran/best-restaurants", label: "Restaurants" },
  bar: { href: "/jimbaran/best-restaurants", label: "Restaurants" },
  spa: { href: "/jimbaran/spas-wellness", label: "Spas & wellness" },
  fitness: { href: "/jimbaran/spas-wellness", label: "Spas & wellness" },
  yoga: { href: "/jimbaran/spas-wellness", label: "Spas & wellness" },
  beauty: { href: "/jimbaran/spas-wellness", label: "Spas & wellness" },
};

const districtLabel: Record<string, string> = {
  canggu: "Canggu",
  ubud: "Ubud",
  seminyak: "Seminyak",
  "kuta-legian": "Kuta & Legian",
  jimbaran: "Jimbaran",
  "uluwatu-bukit": "Uluwatu",
  "nusa-dua": "Nusa Dua",
  sanur: "Sanur",
  sidemen: "Sidemen",
  amed: "Amed",
  munduk: "Munduk",
  lovina: "Lovina",
  "nusa-islands": "Nusa Penida",
  "gili-islands": "Gili Islands",
  lombok: "Lombok",
};

// Structured hours for JSON-LD — only for exact, official-domain-sourced
// daily ranges (free-text like "until late" stays out of schema).
const SCHEMA_HOURS: Record<string, string> = {
  "tropical-temptation-adult-only-beach-club": "Mo-Su 10:00-21:00",
  "papi-sapi": "Mo-Su 16:00-23:30",
};

const schemaType: Record<string, string> = {
  restaurant: "Restaurant",
  cafe: "CafeOrCoffeeShop",
  bar: "BarOrPub",
  beach_club: "LocalBusiness",
  warung: "Restaurant",
  spa: "HealthAndBeautyBusiness",
  beauty: "HealthAndBeautyBusiness",
  fitness: "ExerciseGym",
  yoga: "SportsActivityLocation",
  surf: "SportsActivityLocation",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getUluwatuContent(slug);
  const venue = await getVenueWithPerk(slug);
  if (!venue) {
    return {
      title: "Place not found",
      robots: { index: false, follow: false },
    };
  }

  const name = content?.displayName ?? venue?.name ?? "Place";
  const area = content?.microArea ?? venue?.area;
  const district = districtLabel[venue?.district ?? ULUWATU_DB_SLUG] ?? "Bali";
  const description = (content?.verdict ?? venue?.whyItsHere ??
    `${name} — ${categoryLabel[venue?.category ?? "restaurant"]} in ${district}, Bali.`)
    .slice(0, 158);
  // Index every venue whose page passes the publication bar — the Uluwatu
  // registry, or the decision-ready editorial bar for other districts. Falls
  // back to the slug-only Uluwatu check when there's no DB row.
  const indexable = isVenueIndexable(venue);

  return {
    title: `${name} — ${area ? `${area}, ` : ""}${district}`,
    description,
    alternates: { canonical: `/places/${slug}` },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title: `${name} · Other Bali`,
      description,
      url: `${BASE}/places/${slug}`,
      type: "article",
    },
    twitter: { card: "summary_large_image", title: `${name} · Other Bali`, description },
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [venue, all, savedSlugs, detailExtension] = await Promise.all([
    getVenueWithPerk(slug),
    getPublishedVenues(),
    getSavedSlugs(await readGuestRef()),
    getPublicVenueDetailExtension(slug),
  ]);
  const content = getUluwatuContent(slug);
  if (!venue) notFound();
  const saved = savedSlugs.includes(slug);

  const isUluwatu = venue.district === ULUWATU_DB_SLUG;
  const isCanggu = venue.district === "canggu";
  const isUbud = venue.district === "ubud";
  const isSeminyak = venue.district === "seminyak";
  const isSanur = venue.district === "sanur";
  const isNusaDua = venue.district === "nusa-dua";
  const isJimbaran = venue.district === "jimbaran";
  const published = isPublicReadyVenue(venue);
  if (!published) notFound();
  const name = content?.displayName ?? venue.name;
  // Official site + Instagram (identity links, also fed to JSON-LD sameAs).
  // Prefer a REGISTERED Uluwatu venue's registry value (freshness-gated), then
  // fall back to the venue's DB field. That fallback covers every other
  // district AND Uluwatu rows the registry doesn't cover (DB-only wellness) or
  // doesn't carry a link for. Neutral official links are allowed in any
  // district (guardrail); unlike a menu/booking action, an identity link
  // doesn't go stale, so the DB fallback is safe here.
  const officialUrl =
    (isUluwatu && content
      ? freshVerifiedUluwatuActionUrl(content, "official_url", content?.officialUrl)
      : undefined) ?? venue.officialUrl ?? undefined;
  const instagramUrl =
    (isUluwatu && content
      ? freshVerifiedUluwatuActionUrl(content, "instagram_url", content?.instagramUrl)
      : undefined) ?? venue.instagramUrl ?? undefined;
  const menuUrl = freshVerifiedUluwatuActionUrl(content, "menu_url", content?.menuUrl);
  const bookingUrl = freshVerifiedUluwatuActionUrl(content, "booking_url", content?.bookingUrl);
  const microArea = content?.microArea ?? venue.area;
  const catLabel = categoryLabel[venue.category] ?? venue.category;
  const guide = isUluwatu
    ? categoryGuide[venue.category]
    : isCanggu
    ? cangguCategoryGuide[venue.category]
    : isUbud
    ? ubudCategoryGuide[venue.category]
    : isSeminyak
    ? seminyakCategoryGuide[venue.category]
    : isSanur
    ? sanurCategoryGuide[venue.category]
    : isNusaDua
    ? nusaDuaCategoryGuide[venue.category]
    : isJimbaran
    ? jimbaranCategoryGuide[venue.category]
    : undefined;

  // Similar places: verified category/vibe/district match only — sponsored
  // status is never a ranking factor (rankSimilar scores category + tags).
  const similar = rankSimilar(
    venue,
    all.filter((v) => v.slug !== slug && isPublicReadyVenue(v)),
    3
  );

  const crumbs: Crumb[] = isUluwatu
    ? [
        { name: "Home", href: "/" },
        { name: "Uluwatu", href: ULUWATU_PUBLIC_BASE },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : isCanggu
    ? [
        { name: "Home", href: "/" },
        { name: "Canggu", href: "/canggu" },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : isUbud
    ? [
        { name: "Home", href: "/" },
        { name: "Ubud", href: "/ubud" },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : isSeminyak
    ? [
        { name: "Home", href: "/" },
        { name: "Seminyak", href: "/seminyak" },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : isSanur
    ? [
        { name: "Home", href: "/" },
        { name: "Sanur", href: "/sanur" },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : isNusaDua
    ? [
        { name: "Home", href: "/" },
        { name: "Nusa Dua", href: "/nusa-dua" },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : isJimbaran
    ? [
        { name: "Home", href: "/" },
        { name: "Jimbaran", href: "/jimbaran" },
        ...(guide ? [{ name: guide.label, href: guide.href }] : []),
        { name },
      ]
    : [{ name: "Home", href: "/" }, { name: "Places", href: "/places" }, { name }];

  // Entity-identity links (schema sameAs) — the venue's own site + Instagram.
  // Prefer the Uluwatu registry, fall back to the DB fields so EVERY district's
  // venue pages carry the signal, not just Uluwatu. Helps Google confirm this
  // page is about that exact venue (branded-query relevance).
  const schemaSameAs = [
    content?.officialUrl ?? venue.officialUrl,
    content?.instagramUrl ?? venue.instagramUrl,
  ].filter((u): u is string => Boolean(u));
  // priceRange as a "$"-band only (schema expects a band, not a live menu).
  const schemaPriceRange =
    content?.priceBand ?? venue.priceAnchor?.match(/\${1,4}/)?.[0];

  // LocalBusiness JSON-LD — verified facts only, no ratings, no invented
  // hours/prices (brief §15).
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": schemaType[venue.category] ?? "LocalBusiness",
    name,
    url: `${BASE}/places/${slug}`,
    address: {
      "@type": "PostalAddress",
      ...(content?.address ? { streetAddress: content.address } : {}),
      addressLocality: microArea ?? districtLabel[venue.district] ?? "Bali",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    ...(schemaSameAs.length ? { sameAs: schemaSameAs } : {}),
    ...(schemaPriceRange ? { priceRange: schemaPriceRange } : {}),
    ...(SCHEMA_HOURS[slug] ? { openingHours: SCHEMA_HOURS[slug] } : {}),
    hasMap: venue.gmapsUrl,
  };

  const bookHref = bookingUrl;
  const bookLabel = content?.bookingLabel ?? "Book direct";
  // Development fixtures override the repository only in local preview.
  const fixtureMode = process.env.NODE_ENV === "development" ? process.env.MENU_FIXTURE : undefined;
  const menu: MenuRecord | null = fixtureMode === "fresh"
    ? { ...menuActionFixtures.freshMenu, venueSlug: slug }
    : fixtureMode === "stale"
    ? { ...menuActionFixtures.staleMenu, venueSlug: slug }
    : detailExtension.menu;
  const actionSlotProps: VenueActionBarProps = {
    venueSlug: venue.slug,
    venueName: name,
    district: venue.district,
    // A TablePilot capability can reach this repository only when database RLS
    // confirms active-deep + monetization coverage. Derive the UI gate from
    // that returned capability rather than a hard-coded district slug.
    coverageMode: detailExtension.actionCapabilities.some(
      (capability) => capability.provider === "tablepilot" && capability.kind === "reserve",
    ) ? "active_deep" : isUbud ? "next_deep" : "planning_only",
    capabilities: published ? detailExtension.actionCapabilities : [],
    tablepilotBaseUrl: safeTablePilotPublicBase({
      vercelEnv: process.env.VERCEL_ENV,
      configuredBaseUrl: process.env.NEXT_PUBLIC_TABLEPILOT_URL,
    }),
    fallbacks: published ? {
      tablepilotSlug: undefined,
      whatsapp: undefined,
      officialMenuUrl: menuUrl,
      websiteUrl: officialUrl,
      googleMapsUrl: venue.gmapsUrl,
    } : {},
  };

  // Hero verdict — shown once in the masthead. "Why it's here" renders only
  // when it adds text beyond the verdict (kills the duplicated paragraph).
  const heroVerdict = content?.verdict ?? venue.whyItsHere;
  const whyHereText = content?.whyHere ?? venue.whyItsHere;
  const showWhyHere = Boolean(whyHereText && whyHereText.trim() !== heroVerdict?.trim());

  return (
    <div className="page-dark venue-page-pad">
      <main className="site-shell">
        {published && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <PageViewTracker event="venue_detail_view" slug={slug} />

        <Breadcrumbs items={crumbs} />

        {/* Editorial hero. With an approved photo → photo masthead; without →
            a designed typographic masthead (kicker + name + verdict laid over
            a category-graded field with film grain), never an empty box. */}
        {(() => {
          const kicker = [
            catLabel,
            microArea,
            districtLabel[venue.district] ?? venue.district,
            content?.priceBand ?? undefined,
          ]
            .filter(Boolean)
            .join(" · ");
          const verdict = heroVerdict;
          return (
            <header
              className={`venue-masthead ob-grain${venue.photoUrl ? " has-photo" : ` type-cover-${venue.category}`}`}
            >
              {venue.photoUrl ? (
                // Venue-approved photo (owner-uploaded during onboarding).
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="venue-masthead-photo"
                  src={venue.photoUrl}
                  alt={`${name} — ${catLabel}`}
                  fetchPriority="high"
                />
              ) : (
                // Category mood art — atmospheric editorial still, decorative
                // (alt="") and never presented as venue photography
                // (publication rule v2). The category gradient stays beneath
                // as the loading/fallback field.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="venue-masthead-photo venue-masthead-art"
                  src={`/covers/${venue.category}.webp`}
                  alt=""
                  aria-hidden="true"
                  fetchPriority="high"
                />
              )}
              <div className="venue-masthead-inner">
                <p className="venue-masthead-kicker">
                  {kicker}
                  {venue.isSponsored && <span className="sponsored-label ml-2">Sponsored</span>}
                </p>
                <h1 className="venue-masthead-title">{name}</h1>
                {verdict && <p className="venue-masthead-verdict">{verdict}</p>}
              </div>
            </header>
          );
        })()}

        {/* Save control (kept from mainline) sits just under the masthead. */}
        <div style={{ marginTop: 14 }}>
          <SaveButton venueSlug={slug} initialSaved={saved} variant="detail" />
        </div>

        <div className="venue-detail-grid">
          {/* ── Main column ── */}
          <div>
            {/* Why it's here — Other Bali editorial voice. Skipped when it
                would repeat the masthead verdict word for word. */}
            {showWhyHere && (
              <section className="guide-section" style={{ marginTop: 28 }}>
                <h2>Why it&apos;s here</h2>
                <div className="guide-prose">
                  <p>{whyHereText}</p>
                </div>
              </section>
            )}

            {/* What to expect — verified research only */}
            {content?.whatToExpect && (
              <section className="guide-section">
                <h2>What to expect</h2>
                <div className="guide-prose">
                  <p>{content.whatToExpect}</p>
                </div>
              </section>
            )}

            {/* What to order — research-sourced items, no invented signatures */}
            {(content?.whatToOrder?.length || venue.whatToOrder) && (
              <section className="guide-section">
                <h2>What to order</h2>
                <div className="guide-prose">
                  <ul>
                    {(content?.whatToOrder ?? venue.whatToOrder?.split(";").map((s) => s.trim()) ?? [])
                      .filter(Boolean)
                      .map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                  </ul>
                </div>
              </section>
            )}

            {/* Menu — rendered only when there is something real to show
                (verified menu or an official source). No big empty-state box
                on the 80% of venues without menu data. */}
            {(menu || menuUrl) && (
              <section className="guide-section" aria-labelledby="menu-heading">
                <h2 id="menu-heading">Menu</h2>
                <p className="guide-lede">Verified details when we have them; otherwise, the clearest official source available.</p>
                <div className="mt-4">
                  <StructuredMenu menu={menu} venueSlug={venue.slug} officialMenuUrl={menuUrl} />
                </div>
              </section>
            )}

            <VenueActionBar {...actionSlotProps} />

            {/* Confirmed offer (active_deep district only — guardrail #4) */}
            {venue.perk && (
              <section className="guide-section">
                <h2>Confirmed offer</h2>
                <div className="quick-block" style={{ marginTop: 14 }}>
                  <p className="font-bold text-[var(--lagoon-strong)]">{venue.perk.title}</p>
                  {venue.perk.terms && (
                    <p className="mt-1 text-sm text-[var(--muted)]">{venue.perk.terms}</p>
                  )}
                  <p className="mt-4 text-sm text-[var(--muted)]">
                    Redeem by scanning this venue&apos;s Other Bali counter QR when you arrive.
                  </p>
                </div>
              </section>
            )}

            {/* Owner voice — attributed, never blended into editorial */}
            {venue.ownerNote && (
              <section className="guide-section">
                <h2>From the owner</h2>
                <figure className="owner-voice">
                  <blockquote>{venue.ownerNote}</blockquote>
                  <figcaption>In the owner&apos;s own words</figcaption>
                </figure>
              </section>
            )}

            {/* Related Uluwatu guides */}
            {isUluwatu && published && (
              <section className="guide-section">
                <h2>Plan around it</h2>
                <div className="related-guides">
                  {guide && (
                    <Link href={guide.href} className="related-guide-card">
                      <h3>{guide.label} in Uluwatu</h3>
                      <p>Compare {name} against the rest of our verified picks.</p>
                    </Link>
                  )}
                  <Link href="/uluwatu/48-hours" className="related-guide-card">
                    <h3>48 hours in Uluwatu</h3>
                    <p>Slot this place into a realistic two-day route.</p>
                  </Link>
                  <Link href={ULUWATU_PUBLIC_BASE} className="related-guide-card">
                    <h3>The Uluwatu guide</h3>
                    <p>Micro-areas, quick picks and practical notes.</p>
                  </Link>
                </div>
              </section>
            )}

            {/* Similar places */}
            {similar.length > 0 && (
              <section className="guide-section">
                <h2>Similar places nearby</h2>
                <div className="pick-grid pick-grid-3" style={{ marginTop: 16 }}>
                  {similar.map((s) => {
                    const sc = getUluwatuContent(s.slug);
                    return (
                      <PlaceCard
                        key={s.slug}
                        place={{
                          slug: s.slug,
                          name: sc?.displayName ?? s.name,
                          category: s.category,
                          microArea: sc?.microArea ?? s.area,
                          editorialLine: sc?.verdict ?? s.whyItsHere,
                          bestFor: sc?.bestFor ?? s.bestFor,
                          priceBand: sc?.priceBand ?? undefined,
                          photoUrl: s.photoUrl,
                          isSponsored: s.isSponsored,
                          gmapsUrl: s.gmapsUrl,
                          tablepilotSlug: undefined,
                          coverageMode: "planning_only",
                          hasOffer: false,
                        }}
                      />
                    );
                  })}
                </div>
              </section>
            )}

            {/* Verification note */}
            {content?.lastVerifiedAt && (
              <p className="verification-note">
                Information last checked: {content.lastVerifiedAt}. Details like
                hours and menus change — confirm big plans with the venue.
              </p>
            )}
          </div>

          {/* ── Aside: quick decision block + practical info ── */}
          <aside className="venue-detail-aside">
            <div className="quick-block">
              <h2>The quick read</h2>
              <dl>
                {(content?.bestFor ?? venue.bestFor) && (
                  <div>
                    <dt>Best for</dt>
                    <dd>{content?.bestFor ?? venue.bestFor}</dd>
                  </div>
                )}
                {(content?.notFor ?? venue.notFor) && (
                  <div>
                    <dt>Not for</dt>
                    <dd>{content?.notFor ?? venue.notFor}</dd>
                  </div>
                )}
                {content?.atmosphere && (
                  <div>
                    <dt>Atmosphere</dt>
                    <dd>{content.atmosphere}</dd>
                  </div>
                )}
                {content?.visitContext && (
                  <div>
                    <dt>Good to know</dt>
                    <dd>{content.visitContext}</dd>
                  </div>
                )}
                {content?.reservation && (
                  <div>
                    <dt>Reservations</dt>
                    <dd>{content.reservation}</dd>
                  </div>
                )}
              </dl>

              {bookHref && !venue.tablepilotSlug && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <TrackedOutboundLink
                    href={bookHref}
                    event="booking_click"
                    venueSlug={venue.slug}
                    className="button-primary"
                  >
                    {bookLabel}
                  </TrackedOutboundLink>
                </div>
              )}
            </div>

            <div className="quick-block mt-4">
              <h2>Practical</h2>
              <dl className="practical-list">
                {(content?.address ?? venue.address) && (
                  <div>
                    <dt>Where</dt>
                    <dd>{content?.address ?? venue.address}</dd>
                  </div>
                )}
                {content?.openingHours && (
                  <div>
                    <dt>Hours</dt>
                    <dd>{content.openingHours}</dd>
                  </div>
                )}
                {content?.priceBand && (
                  <div>
                    <dt>Spend</dt>
                    <dd>{content.priceBand} — relative to the area</dd>
                  </div>
                )}
                {officialUrl && (
                  <div>
                    <dt>Website</dt>
                    <dd>
                      <TrackedOutboundLink
                        href={officialUrl}
                        event="official_website_click"
                        venueSlug={venue.slug}
                      >
                        Visit official website
                      </TrackedOutboundLink>
                    </dd>
                  </div>
                )}
                {menuUrl && (
                  <div>
                    <dt>Menu</dt>
                    <dd>
                      <TrackedOutboundLink
                        href={menuUrl}
                        event="menu_click"
                        venueSlug={venue.slug}
                      >
                        View the menu
                      </TrackedOutboundLink>
                    </dd>
                  </div>
                )}
                {instagramUrl && (
                  <div>
                    <dt>Instagram</dt>
                    <dd>
                      <TrackedOutboundLink
                        href={instagramUrl}
                        event="instagram_click"
                        venueSlug={venue.slug}
                      >
                        {instagramUrl.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "")}
                      </TrackedOutboundLink>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>
      </main>

    </div>
  );
}
