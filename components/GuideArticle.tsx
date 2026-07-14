import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import type { Guide } from "@/lib/guides";

const BASE = "https://www.otherbali.com";

// Generic renderer for the long-form editorial guides that follow the standard
// structure (docs/content-style.md): answer-first lede, scannable sections,
// FAQ (→ FAQPage schema), related links. Data lives in lib/guides.ts; the route
// file just picks the guide and renders it. Emits Article + BreadcrumbList
// (via Breadcrumbs) + FAQPage (via FaqBlock) JSON-LD.
export default function GuideArticle({ guide }: { guide: Guide }) {
  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: guide.eyebrow ?? guide.title },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    url: `${BASE}/${guide.slug}`,
    about: guide.eyebrow ?? guide.title,
    isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
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
          <h1 className="mt-2">{guide.title}</h1>
          {guide.lede ? <p className="guide-lede">{guide.lede}</p> : null}
        </header>

        {(guide.sections ?? []).map((section) => (
          <section key={section.heading} className="guide-section">
            <h2>{section.heading}</h2>
            {section.paras.map((p, i) => (
              <p
                key={i}
                className="mt-2 text-sm leading-relaxed text-[var(--muted)]"
              >
                {p}
              </p>
            ))}
          </section>
        ))}

        {guide.faq && guide.faq.length > 0 ? (
          <FaqBlock items={guide.faq} heading="Good to know" />
        ) : null}

        {guide.related && guide.related.length > 0 ? (
          <RelatedGuides heading="Keep planning" links={guide.related} />
        ) : null}

        <GuideFooter />
      </main>

      {/* A quiet, always-present link row so every guide has crawlable internal
          links even if `related` is short. */}
      <nav aria-label="Bali guides" className="sr-only">
        <Link href="/where-to-stay-in-bali">Where to stay in Bali</Link>
        <Link href="/canggu">Canggu</Link>
        <Link href="/seminyak">Seminyak</Link>
        <Link href="/uluwatu">Uluwatu</Link>
        <Link href="/ubud">Ubud</Link>
        <Link href="/sanur">Sanur</Link>
      </nav>
    </div>
  );
}
