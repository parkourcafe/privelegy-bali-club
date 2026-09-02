import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { GuideFooter } from "@/components/GuideBlocks";
import type { OfferView } from "@/lib/domain/resort-repo";
import { publicPriceFallback, isPriceFresh } from "@/lib/domain/resort";

const HUB: Record<string, { path: string; label: string }> = {
  day_pass: { path: "/bali-resort-day-passes", label: "Hotel Day Passes" },
  brunch: { path: "/bali-hotel-brunches", label: "Brunches" },
  pool_day_use: { path: "/bali-resort-day-passes", label: "Pool Day-Use" },
  spa_package: { path: "/best-spas-in-bali", label: "Spas & Wellness" },
};

// Offer detail page (IA spec v1 §11.3). Only rendered for PUBLIC offers
// (whitelisted + gated) — the route calls notFound() otherwise. [NO DATA] is
// never shown: a missing price becomes the honest confirm-with-hotel line.
export default function OfferDetail({ offer }: { offer: OfferView }) {
  const hub = HUB[offer.offerType] ?? { path: "/bali", label: "Bali" };
  const crumbs: Crumb[] = [
    { name: "Other Bali", href: "/" },
    { name: hub.label, href: hub.path },
    { name: offer.name },
  ];
  const fresh = isPriceFresh(offer.priceVerifiedAt, offer.offerType, new Date());
  const priceLine =
    offer.priceStatus === "verified" && offer.priceText
      ? offer.priceText
      : offer.priceText && offer.priceStatus !== "not_published"
        ? `${offer.priceText} (reported${offer.accessedAt ? `, as of ${offer.accessedAt}` : ""})`
        : publicPriceFallback(offer.accessedAt);

  // Structured data only when the price is verified and fresh (§15.5) — never
  // mark a stale/reported price as an authoritative Offer.
  //
  // The BreadcrumbList lives in <Breadcrumbs> below, which emits it alongside
  // the visible trail. Emitting a second one here put two BreadcrumbList nodes
  // on every offer page.
  const jsonLd: Record<string, unknown>[] = [];
  if (offer.priceStatus === "verified" && fresh && offer.currency && offer.priceMinor) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Offer",
      name: offer.name,
      price: offer.priceMinor,
      priceCurrency: offer.currency,
      // No `availability`. This used to publish InStock unconditionally, which
      // asserts live availability we never receive — the partner owns
      // availability and confirmation (AGENTS.md §5, §11), and /about tells
      // readers we do not confirm it. A verified price is not a live seat.
      ...(offer.property?.name ? { seller: { "@type": "Organization", name: offer.property.name } } : {}),
    });
  }

  return (
    <div>
      <main className="site-shell">
        {jsonLd.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        ) : null}

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">{offer.name}</h1>
          {offer.property?.name ? (
            <p className="guide-lede">
              {offer.property.name}
              {offer.property.starRating ? ` · ${offer.property.starRating}-star` : ""} · {offer.district}
            </p>
          ) : null}
        </header>

        <section className="guide-section">
          <dl className="fnb-kv">
            <div className="fnb-kv-row"><dt>Price</dt><dd>{priceLine}</dd></div>
            {offer.whatsIncluded ? <div className="fnb-kv-row"><dt>Includes</dt><dd>{offer.whatsIncluded}</dd></div> : null}
            {offer.scheduleText ? <div className="fnb-kv-row"><dt>When</dt><dd>{offer.scheduleText}</dd></div> : null}
            <div className="fnb-kv-row">
              <dt>Access</dt>
              <dd>{offer.openToNonGuests ? "Open to non-guests" : "Confirm access with the hotel"}</dd>
            </div>
            {offer.bookingChannel ? <div className="fnb-kv-row"><dt>Book</dt><dd>{offer.bookingChannel}</dd></div> : null}
            {offer.audienceTags.length ? <div className="fnb-kv-row"><dt>Best for</dt><dd>{offer.audienceTags.join(" · ")}</dd></div> : null}
          </dl>

          {offer.editorialNote ? <p className="mt-4">{offer.editorialNote}</p> : null}

          <p className="fnb-checked mt-4">
            Information last checked {offer.accessedAt ?? "—"}
            {offer.sourceType ? ` · source: ${offer.sourceType}` : ""}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {offer.bookingUrl ? (
              <a className="fnb-book" href={offer.bookingUrl} rel="noopener external" target="_blank">Book on official site →</a>
            ) : offer.sourceUrl ? (
              <a className="fnb-book" href={offer.sourceUrl} rel="noopener external" target="_blank">Official page →</a>
            ) : null}
            <Link className="fnb-book" href={hub.path}>All {hub.label.toLowerCase()} →</Link>
          </div>
        </section>

        <p className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          Resident-curated · no paid ranking. Prices from the venue&apos;s official source; confirm at booking.
        </p>
      </main>
      <GuideFooter />
    </div>
  );
}
