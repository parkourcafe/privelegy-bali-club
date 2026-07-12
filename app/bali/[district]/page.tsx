import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDistrictHubs, getIntentSpokes } from "@/lib/data";
import {
  SITE_ORIGIN,
  groupByCategory,
  hubIntro,
  hubMetaDescription,
  hubFaqs,
  hubJsonLd,
} from "@/lib/hub";
import VenueCard from "@/components/VenueCard";

// SEO hub. Server-rendered + ISR so crawlers and AI fetchers see full content.
export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const hubs = await getDistrictHubs();
  return hubs.map((h) => ({ district: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string }>;
}): Promise<Metadata> {
  const { district } = await params;
  const hubs = await getDistrictHubs();
  const hub = hubs.find((h) => h.slug === district);
  if (!hub) return {};
  const title = `Where to Eat & Go in ${hub.name}`;
  const description = hubMetaDescription(hub);
  const url = `${SITE_ORIGIN}/bali/${hub.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/bali/${hub.slug}` },
    openGraph: { title: `${title} · Other Bali`, description, url, type: "website" },
  };
}

export default async function DistrictHubPage({
  params,
}: {
  params: Promise<{ district: string }>;
}) {
  const { district } = await params;
  const hubs = await getDistrictHubs();
  const hub = hubs.find((h) => h.slug === district);
  if (!hub) notFound();

  const groups = groupByCategory(hub.venues);
  const faqs = hubFaqs(hub);
  const others = hubs.filter((h) => h.slug !== hub.slug);
  const spokes = (await getIntentSpokes()).filter((s) => s.district === hub.slug);
  // Money surfaces (reserve/offer) only in the active deep district; every other
  // hub is planning-only → directions/map actions only (guardrail #4).
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
          › <span className="text-[var(--ink)]">{hub.name}</span>
        </nav>

        <header className="hero-grid mt-3">
          <div>
            <h1 className="hero-title">Where to eat &amp; go in {hub.name}</h1>
            <p className="hero-copy mt-3">{hubIntro(hub)}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href="/plan" className="quiet-link">
                Build a Canggu day →
              </Link>
              <Link href={`/places?district=${hub.slug}`} className="quiet-link">
                Filter all {hub.name} places →
              </Link>
            </div>
          </div>
          <div className="editorial-signal" aria-label={`${hub.name} signal`}>
            <p className="editorial-signal-label">
              {hub.venues.length} curated places in {hub.name}.
            </p>
          </div>
        </header>

        {spokes.length > 0 && (
          <nav aria-label={`${hub.name} by the moment`} className="mt-8">
            <h2 className="section-title">By the moment</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {spokes.map((s) => (
                <Link
                  key={s.intent.urlSlug}
                  href={`/bali/${hub.slug}/${s.intent.urlSlug}`}
                  className="rounded-full border border-[rgba(198,154,92,0.35)] px-3 py-1 text-sm font-semibold text-[var(--lagoon-strong)] transition-colors hover:border-[rgba(198,154,92,0.65)] hover:text-[var(--ink)]"
                >
                  Best {s.intent.short.toLowerCase()} ({s.venues.length})
                </Link>
              ))}
            </div>
          </nav>
        )}

        {groups.map((g) => (
          <section key={g.key} className="mt-10">
            <h2 className="section-title">
              {g.label}{" "}
              <span className="text-sm font-normal text-[var(--muted)]">
                ({g.venues.length})
              </span>
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {g.venues.map((v) => (
                <VenueCard
                  key={v.slug}
                  v={v}
                  actionMode={actionMode}
                  showSimilar={false}
                  linkToPage
                />
              ))}
            </div>
          </section>
        ))}

        <section className="mt-12">
          <h2 className="section-title">Common questions</h2>
          <dl className="mt-4 space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-[var(--ink)]">{f.q}</dt>
                <dd className="mt-1 text-sm text-[var(--muted)]">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {others.length > 0 && (
          <section className="mt-12">
            <h2 className="section-title">More Bali districts</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {others.map((h) => (
                <Link
                  key={h.slug}
                  href={`/bali/${h.slug}`}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {h.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hubJsonLd(hub)) }}
      />
    </div>
  );
}
