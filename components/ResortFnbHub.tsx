import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { GuideFooter } from "@/components/GuideBlocks";
import type { FnbPage } from "@/lib/resort-fnb";

// Server component. Renders a resort-F&B hub page from its generated config
// through the site's own design system. All inner HTML fragments (answer,
// callout, table cells, card fields, FAQ answers) were link-sanitised at
// extraction time, so dangerouslySetInnerHTML here carries no /places stubs and
// only the owned `ob-badge` provenance class.
export default function ResortFnbHub({ page }: { page: FnbPage }) {
  const crumbs: Crumb[] = [
    { name: "Other Bali", href: "/" },
    { name: page.breadcrumbLabel || page.title },
  ];

  // The source's own Breadcrumb/Article/ItemList blocks, plus a FAQPage built
  // from the FAQ (source blocks don't include FAQPage).
  const faqJsonLd =
    page.faq.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: page.faq.map((f) => ({
              "@type": "Question",
              name: f.q_text,
              acceptedAnswer: { "@type": "Answer", text: f.a_text },
            })),
          },
        ]
      : [];
  const jsonLd = [...page.jsonld, ...faqJsonLd];

  return (
    <div>
      <main className="site-shell">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">{page.h1}</h1>
          {page.sub ? (
            <p className="guide-lede" dangerouslySetInnerHTML={{ __html: page.sub }} />
          ) : null}
        </header>

        {page.answer ? (
          <section className="guide-section">
            <div className="fnb-answer" dangerouslySetInnerHTML={{ __html: page.answer }} />
          </section>
        ) : null}

        {page.callout ? (
          <p className="fnb-callout" dangerouslySetInnerHTML={{ __html: page.callout }} />
        ) : null}

        {page.tableRows.length > 0 ? (
          <section className="guide-section">
            <h2>Compare</h2>
            <div className="fnb-table-scroll">
              <table className="fnb-table">
                <thead>
                  <tr>
                    {page.tableHead.map((h, i) => (
                      <th key={i} dangerouslySetInnerHTML={{ __html: h }} />
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {page.tableRows.map((row, ri) => (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td key={ci} dangerouslySetInnerHTML={{ __html: cell }} />
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {page.checkedNote ? (
              <p className="fnb-checked" dangerouslySetInnerHTML={{ __html: page.checkedNote }} />
            ) : null}
          </section>
        ) : null}

        {page.cards.length > 0 ? (
          <section className="guide-section">
            {page.cards.map((c, i) => (
              <div key={i} className="fnb-card">
                {c.h3 ? <h3 dangerouslySetInnerHTML={{ __html: c.h3 }} /> : null}
                {c.meta ? (
                  <p className="fnb-card-meta" dangerouslySetInnerHTML={{ __html: c.meta }} />
                ) : null}
                {c.body ? <p dangerouslySetInnerHTML={{ __html: c.body }} /> : null}
                {c.kv.length > 0 ? (
                  <dl className="fnb-kv">
                    {c.kv.map(([dt, dd], ki) => (
                      <div key={ki} className="fnb-kv-row">
                        <dt>{dt}</dt>
                        <dd dangerouslySetInnerHTML={{ __html: dd }} />
                      </div>
                    ))}
                  </dl>
                ) : null}
                {c.book ? (
                  <Link href={c.book.href} className="fnb-book">
                    {c.book.label}
                  </Link>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}

        {page.faq.length > 0 ? (
          <section className="guide-section">
            <h2>Frequently asked</h2>
            {page.faq.map((f, i) => (
              <details key={i} className="fnb-faq">
                <summary>{f.q_text}</summary>
                <p dangerouslySetInnerHTML={{ __html: f.a_html }} />
              </details>
            ))}
          </section>
        ) : null}

        {page.related.length > 0 ? (
          <section className="guide-section">
            <h2>Plan the rest of your day</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {page.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="font-semibold text-[var(--ink)]">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-16 border-t border-[var(--line)] pt-6 text-xs text-[var(--muted)]">
          <strong>How we choose &amp; verify.</strong> Placement can&apos;t be bought — venues are
          ordered by price/value and fit, not by any payment. Prices marked <em>official</em> are
          from the venue or its booking engine; others are press-sourced and change seasonally.
          Confirm the current price at booking.
        </p>
      </main>
      <GuideFooter />
    </div>
  );
}
