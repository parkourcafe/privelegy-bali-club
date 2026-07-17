import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import PlaceCard from "@/components/PlaceCard";
import { FaqBlock, GuideFooter } from "@/components/GuideBlocks";
import { getPublishedVenues, isPublicReadyVenue } from "@/lib/data";
import { toCangguPlaceCard } from "@/lib/canggu";
import type { QuestionPage, PlaceQuery } from "@/lib/question-pages";

// Renders the question-page structure (P2-5). A section shows its editorial
// prose when present; on an unpublished (draft) page a missing section renders
// an explicit draft marker instead — never lorem. "Places nearby" is resolved
// from the live catalogue so only covered venues appear.

async function resolvePlaces(query: PlaceQuery) {
  const all = (await getPublishedVenues()).filter(isPublicReadyVenue);
  const districts = query.districts;
  const categories = query.categories;
  return all
    .filter((v) => (!districts || districts.includes(v.district)) &&
      (!categories || categories.includes(v.category)))
    .slice(0, query.limit ?? 4);
}

function DraftMarker() {
  return (
    <p className="text-sm italic text-[var(--muted)]">
      Editorial copy pending — this page is a draft and stays unpublished until the
      text is final.
    </p>
  );
}

function Prose({ value, published }: { value?: string; published: boolean }) {
  if (value) return <p className="hero-copy">{value}</p>;
  return published ? null : <DraftMarker />;
}

function Section({
  title,
  value,
  published,
}: {
  title: string;
  value?: string;
  published: boolean;
}) {
  if (!value && published) return null; // published pages only show filled sections
  return (
    <section className="guide-section">
      <h2>{title}</h2>
      <Prose value={value} published={published} />
    </section>
  );
}

export default async function QuestionPageView({ page }: { page: QuestionPage }) {
  const places = page.places ? await resolvePlaces(page.places) : [];
  const hasFaqAnswers = Boolean(page.faq?.some((f) => f.a.trim().length > 0));

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    ...(page.breadcrumbParent ? [page.breadcrumbParent] : []),
    { name: page.h1 },
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `https://www.otherbali.com${c.href}` } : {}),
    })),
  };

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug={`q-${page.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">{page.cluster}</p>
          <h1 className="hero-title mt-2">{page.h1}</h1>
          <p className="text-sm text-[var(--muted)]" style={{ marginTop: 8 }}>
            {page.question}
          </p>
        </header>

        {/* Short answer — the AEO answer block, first thing on the page. */}
        <section className="guide-section">
          <h2>Short answer</h2>
          <Prose value={page.shortAnswer} published={page.published} />
        </section>

        {/* Who this is for / not for — fit-context, never an anti-list. */}
        {(page.whoFor?.length || page.notFor?.length || !page.published) && (
          <section className="guide-section">
            <h2>Who this is for — and who it isn&apos;t</h2>
            {page.whoFor?.length || page.notFor?.length ? (
              <div className="pick-grid" style={{ marginTop: 12 }}>
                <div>
                  <p className="topline">Good for</p>
                  <ul>{(page.whoFor ?? []).map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
                <div>
                  <p className="topline">Less so if</p>
                  <ul>{(page.notFor ?? []).map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </div>
            ) : (
              <DraftMarker />
            )}
          </section>
        )}

        <Section title="Best time" value={page.bestTime} published={page.published} />
        <Section
          title="How to do it without wasting the day"
          value={page.withoutWastingTheDay}
          published={page.published}
        />
        <Section title="What to combine it with" value={page.whatToCombine} published={page.published} />

        {page.suggestedRoute && (
          <section className="guide-section">
            <h2>A suggested route</h2>
            <div className="hero-actions">
              <Link href={page.suggestedRoute.href} className="button-primary button-large">
                {page.suggestedRoute.label}
              </Link>
            </div>
          </section>
        )}

        {places.length > 0 && (
          <section className="guide-section">
            <h2>Places nearby</h2>
            <div className="pick-grid" style={{ marginTop: 16 }}>
              {places.map((v) => (
                <PlaceCard key={v.slug} place={toCangguPlaceCard(v)} />
              ))}
            </div>
          </section>
        )}

        {/* FAQ: emit FAQPage schema only when answers are final; a draft shows
            the questions without schema so we never publish empty answers. */}
        {hasFaqAnswers && page.faq ? (
          <FaqBlock items={page.faq} heading="Good to know" />
        ) : page.faq?.length ? (
          <section className="guide-section">
            <h2>Good to know</h2>
            <ul>{page.faq.map((f) => <li key={f.q}>{f.q}</li>)}</ul>
            {!page.published && <DraftMarker />}
          </section>
        ) : null}

        <GuideFooter />
      </main>
    </div>
  );
}
