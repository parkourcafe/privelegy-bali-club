import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, GuideFooter } from "@/components/GuideBlocks";
import {
  hotelRestaurants,
  districtHubPasses,
  globalHubPasses,
  previewEnabled,
} from "@/lib/domain/resort-repo";

const BASE = "https://www.otherbali.com";

// Category hub for hotel/resort restaurants (IA spec v1 §11.1). Renders the
// PUBLIC (whitelisted + gated) set as an indexable page when the §13.2 hub gate
// passes; otherwise the page is noindex and, in owner-prelaunch mode only,
// shows a clearly separated owner-preview of the review rows (never indexed,
// never in the sitemap). `district` null = global hub.
export function hotelRestaurantsHubIndexable(district: string | null): boolean {
  const pub = hotelRestaurants("public", district ?? undefined);
  return district ? districtHubPasses(pub) : globalHubPasses(pub);
}

export default function HotelRestaurantsHub({
  district,
  districtLabel,
  title,
  intro,
}: {
  district: string | null;
  districtLabel?: string;
  title: string;
  intro: string;
}) {
  const pub = hotelRestaurants("public", district ?? undefined);
  const indexable = hotelRestaurantsHubIndexable(district);
  const showPreview = !indexable && previewEnabled();
  const preview = showPreview ? hotelRestaurants("preview", district ?? undefined) : [];

  const crumbs: Crumb[] = [
    { name: "Other Bali", href: "/" },
    ...(district ? [{ name: "Hotel Restaurants", href: "/hotel-restaurants" }, { name: districtLabel ?? district }] : [{ name: "Hotel Restaurants" }]),
  ];

  const jsonLd = indexable
    ? [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: crumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            ...(c.href ? { item: `${BASE}${c.href}` } : {}),
          })),
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: title,
          numberOfItems: pub.length,
          itemListElement: pub.map((v, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `${v.property?.name ?? ""} — ${v.name}`.trim(),
          })),
        },
      ]
    : [];

  return (
    <div>
      <main className="site-shell">
        {jsonLd.length > 0 ? (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        ) : null}

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">{title}</h1>
          <p className="guide-lede">{intro}</p>
        </header>

        {indexable ? (
          <section className="guide-section">
            <ul className="mt-2 space-y-4">
              {pub.map((v) => (
                <li key={v.slug} className="fnb-card">
                  <h3 className="!mt-0">
                    {v.property?.name ? <span className="text-[var(--muted)]">{v.property.name} · </span> : null}
                    {v.name}
                  </h3>
                  {v.property?.starRating ? (
                    <p className="fnb-card-meta">{v.property.starRating}-star · {districtLabel ?? v.district}</p>
                  ) : null}
                  {v.editorialNote ? <p>{v.editorialNote}</p> : null}
                  <p className="fnb-checked">
                    {v.openToNonGuests === true
                      ? "Open to non-guests"
                      : v.openToNonGuests === null
                        ? "Non-guest access — confirm when booking"
                        : "Hotel guests only"}
                    {v.accessedAt ? ` · Checked ${v.accessedAt}` : ""}
                  </p>
                  {v.sourceUrl ? (
                    <a className="fnb-book" href={v.sourceUrl} rel="noopener external" target="_blank">
                      Official site →
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="guide-section">
            <p className="text-sm text-[var(--muted)]">
              This guide is being curated — resort restaurants are added once
              each is verified and has decision-ready English notes. Check back
              soon.
            </p>
          </section>
        )}

        {showPreview && preview.length > 0 ? (
          <section className="guide-section" aria-label="Operator preview">
            <h2>Operator preview · not public</h2>
            <p className="text-sm text-[var(--muted)]">
              {preview.length} imported rows awaiting review. Visible only in
              owner-prelaunch mode; never indexed, never in the sitemap.
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {preview.map((v) => (
                <li key={v.slug}>
                  <strong>{v.property?.name ? `${v.property.name} · ` : ""}{v.name}</strong>
                  {v.editorialNote ? <span className="text-[var(--muted)]"> — {v.editorialNote}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <FaqBlock
          heading="Good to know"
          items={[
            {
              q: "Can non-guests eat at hotel restaurants in Bali?",
              a: "Often yes — many resort restaurants take outside reservations, but some are guest-only and a few need advance booking. Each listing says whether non-guest access is confirmed; when it isn't, confirm directly with the hotel.",
            },
            {
              q: "How do you verify prices and access?",
              a: "From the venue's own official site or booking system, with the date we checked shown on each entry. Where a fixed price isn't published, we say so rather than guess.",
            },
          ]}
        />

        <p className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          Resident-curated · no paid ranking. Prices and access are from each
          venue&apos;s official source; confirm current terms at booking.
        </p>
      </main>
      <GuideFooter />
    </div>
  );
}
