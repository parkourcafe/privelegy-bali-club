import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIntentSpokes } from "@/lib/data";
import {
  spokeTitle,
  spokeIntro,
  spokeMetaDescription,
  spokeFaqs,
  spokeJsonLd,
} from "@/lib/hub";
import VenueCard from "@/components/VenueCard";

export const revalidate = 3600;
// dynamicParams: true so a newly-qualifying district/intent spoke renders on
// first request under ISR instead of 404ing until redeploy. Non-qualifying
// combos still 404 via notFound() below.
export const dynamicParams = true;

export async function generateStaticParams() {
  const spokes = await getIntentSpokes();
  return spokes.map((s) => ({ district: s.district, intent: s.intent.urlSlug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ district: string; intent: string }>;
}): Promise<Metadata> {
  const { district, intent } = await params;
  const spokes = await getIntentSpokes();
  const spoke = spokes.find((s) => s.district === district && s.intent.urlSlug === intent);
  if (!spoke) return {};
  const title = spokeTitle(spoke);
  const description = spokeMetaDescription(spoke);
  const url = `https://www.otherbali.com/bali/${district}/${intent}`;
  return {
    title,
    description,
    alternates: { canonical: `/bali/${district}/${intent}` },
    openGraph: { title: `${title} · Other Bali`, description, url, type: "website" },
  };
}

export default async function IntentSpokePage({
  params,
}: {
  params: Promise<{ district: string; intent: string }>;
}) {
  const { district, intent } = await params;
  const spokes = await getIntentSpokes();
  const spoke = spokes.find((s) => s.district === district && s.intent.urlSlug === intent);
  if (!spoke) notFound();

  const faqs = spokeFaqs(spoke);
  // Other intents in the same district (up-link mesh) and the same intent in
  // other districts (lateral cluster) — the internal links that build authority.
  const siblingIntents = spokes.filter(
    (s) => s.district === district && s.intent.urlSlug !== intent
  );
  const sameIntentElsewhere = spokes.filter(
    (s) => s.intent.urlSlug === intent && s.district !== district
  );
  // Money surfaces only in the active deep district (guardrail #4).
  const actionMode = district === "canggu" ? "full" : "directions";

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
          <Link href={`/bali/${district}`} className="quiet-link">
            {spoke.districtName}
          </Link>{" "}
          › <span className="text-[var(--ink)]">{spoke.intent.label}</span>
        </nav>

        <header className="mt-3">
          <h1 className="hero-title">{spokeTitle(spoke)}</h1>
          <p className="hero-copy mt-3">{spokeIntro(spoke)}</p>
        </header>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spoke.venues.map((v) => (
            <VenueCard key={v.slug} v={v} actionMode={actionMode} showSimilar={false} linkToPage />
          ))}
        </div>

        {siblingIntents.length > 0 && (
          <section className="mt-12">
            <h2 className="section-title">More in {spoke.districtName}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/bali/${district}`}
                className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
              >
                All of {spoke.districtName}
              </Link>
              {siblingIntents.map((s) => (
                <Link
                  key={s.intent.urlSlug}
                  href={`/bali/${district}/${s.intent.urlSlug}`}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {s.intent.short}
                </Link>
              ))}
            </div>
          </section>
        )}

        {sameIntentElsewhere.length > 0 && (
          <section className="mt-10">
            <h2 className="section-title">
              {spoke.intent.label} in other districts
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {sameIntentElsewhere.map((s) => (
                <Link
                  key={s.district}
                  href={`/bali/${s.district}/${intent}`}
                  className="rounded-full border border-[var(--line)] px-3 py-1 text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                >
                  {s.districtName}
                </Link>
              ))}
            </div>
          </section>
        )}

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
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(spokeJsonLd(spoke)) }}
      />
    </div>
  );
}
