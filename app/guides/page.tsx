import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { GuideFooter } from "@/components/GuideBlocks";
import { GUIDE_GROUPS, getGuide } from "@/lib/guides";

const BASE = "https://www.otherbali.com";

export const metadata: Metadata = {
  title: "Bali travel guides — planning, areas and best-of",
  description:
    "Free Bali travel guides: how many days, when to go, how to get around, where to stay by area, and island-wide best-of picks. Practical, honest, no fluff.",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "Bali travel guides · Other Bali",
    description:
      "Planning, where to stay, and island-wide best-of — the guides that help you decide.",
    url: `${BASE}/guides`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bali travel guides · Other Bali",
    description: "Planning, where to stay, and island-wide best-of.",
  },
};

export default function GuidesIndexPage() {
  const groups = GUIDE_GROUPS.map((group) => ({
    ...group,
    guides: group.slugs.map((slug) => getGuide(slug)).filter((g): g is NonNullable<typeof g> => Boolean(g)),
  }));

  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Guides" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Bali travel guides",
    itemListElement: groups
      .flatMap((g) => g.guides)
      .map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.title,
        url: `${BASE}/${g.slug}`,
      })),
  };

  return (
    <div>
      <main className="site-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">Bali travel guides</h1>
          <p className="guide-lede">
            Practical, honest guides to help you decide — how long to go and
            when, where to stay for the trip you&apos;re taking, and the
            island-wide best-of. No fluff, just what actually helps you plan.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Looking for a specific district? Start with the deep area guides for{" "}
            <Link href="/canggu">Canggu</Link>,{" "}
            <Link href="/uluwatu">Uluwatu</Link>,{" "}
            <Link href="/ubud">Ubud</Link>,{" "}
            <Link href="/sanur">Sanur</Link>,{" "}
            <Link href="/seminyak">Seminyak</Link> and{" "}
            <Link href="/nusa-dua">Nusa Dua</Link>.
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.heading} className="guide-section">
            <h2>{group.heading}</h2>
            <p className="text-sm text-[var(--muted)]">{group.blurb}</p>
            <div className="related-guides" style={{ marginTop: 16 }}>
              {group.guides.map((g) => (
                <Link key={g.slug} href={`/${g.slug}`} className="related-guide-card">
                  <h3>{g.title}</h3>
                  <p>{g.description}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        <GuideFooter />
      </main>
    </div>
  );
}
