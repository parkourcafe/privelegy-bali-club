import Link from "next/link";
import { cache } from "react";
import PlaceCard from "@/components/PlaceCard";
import { getUluwatuContent, toPlaceCard } from "@/lib/uluwatu/venues";
import { getPublishedVenues } from "@/lib/data";

// Shared building blocks for the editorial guide pages (pillar + children).
// Server components; JSON-LD is emitted only for content visibly rendered on
// the page (brief §15 — no FAQ schema for invisible content).

const BASE = "https://www.otherbali.com";
const publicVenueSlugs = cache(async () =>
  new Set((await getPublishedVenues()).map((venue) => venue.slug))
);

export interface FaqItem {
  q: string;
  a: string;
}

export function FaqBlock({ items, heading = "Good to know" }: { items: FaqItem[]; heading?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <section className="guide-section">
      <h2>{heading}</h2>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.q} className="faq-item">
            <summary>{item.q}</summary>
            <p className="faq-answer">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// ItemList JSON-LD for editorial venue lists — order is editorial, never paid
// (guardrail #6).
export async function VenueItemListSchema({ name, slugs }: { name: string; slugs: string[] }) {
  const allowed = await publicVenueSlugs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: slugs
      .filter((slug) => allowed.has(slug))
      .map((slug, i) => {
        const content = getUluwatuContent(slug);
        if (!content) return null;
        return {
          "@type": "ListItem",
          position: i + 1,
          name: content.displayName,
          url: `${BASE}/places/${slug}`,
        };
      })
      .filter(Boolean),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// A grid of registry-driven place cards for a list of slugs. Unknown or
// unpublished slugs are silently skipped — the gate holds everywhere.
export async function VenuePicks({ slugs, columns = 2 }: { slugs: string[]; columns?: 2 | 3 }) {
  const allowed = await publicVenueSlugs();
  const places = slugs
    .filter((slug) => allowed.has(slug))
    .map((slug) => getUluwatuContent(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c && c.publication === "published"));
  if (places.length === 0) return null;
  return (
    <div className={`pick-grid${columns === 3 ? " pick-grid-3" : ""}`}>
      {places.map((content) => (
        <PlaceCard key={content.slug} place={toPlaceCard(content)} />
      ))}
    </div>
  );
}

export interface GuideLink {
  href: string;
  title: string;
  blurb: string;
}

export function RelatedGuides({ links, heading = "Keep planning" }: { links: GuideLink[]; heading?: string }) {
  return (
    <section className="guide-section">
      <h2>{heading}</h2>
      <div className="related-guides">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="related-guide-card">
            <h3>{link.title}</h3>
            <p>{link.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// Inline venue link for prose — always the internal place page.
export async function PlaceLink({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const content = getUluwatuContent(slug);
  if (!(await publicVenueSlugs()).has(slug)) {
    return <span>{children ?? content?.displayName ?? slug}</span>;
  }
  return (
    <Link href={`/places/${slug}`}>{children ?? content?.displayName ?? slug}</Link>
  );
}

export function GuideFooter() {
  return (
    <footer className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
      <p>
        Other Bali is free for travellers. Recommendations are editorial —
        sponsored placements are always labeled and never change the order.
      </p>
      <div className="mt-3 flex flex-wrap gap-4">
        <Link href="/places" className="quiet-link">
          All places
        </Link>
        <Link href="/bali" className="quiet-link">
          Bali by district
        </Link>
        <Link href="/guides" className="quiet-link">
          Travel guides
        </Link>
        <Link href="/privacy" className="quiet-link">
          Privacy
        </Link>
        <Link href="/terms" className="quiet-link">
          Terms
        </Link>
        <Link href="/support" className="quiet-link">
          Support
        </Link>
      </div>
    </footer>
  );
}
