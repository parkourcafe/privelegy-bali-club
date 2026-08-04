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
import { Suspense } from "react";
import VenueCard from "@/components/VenueCard";
import DateNightRefine from "@/components/DateNightRefine";
import {
  DATE_NIGHT_INTENT_SLUG,
  dateNightModifiersEnabled,
  modifierAvailability,
  venueModifierKeys,
} from "@/lib/date-night-modifiers";

// The root layout resolves the explicit locale from a request header. Keep this
// dynamic route request-rendered: attempting on-demand ISR without request
// context turns a legitimate notFound() into DYNAMIC_SERVER_USAGE/500. Public
// venue reads retain their own bounded data cache.
export const dynamic = "force-dynamic";
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

  // Modifier refinement (Intent OS pilot OB-CAN-0011). Flag-gated and scoped to
  // the date-night spoke; every other spoke is untouched.
  //
  // The filter is deliberately NOT read from `searchParams` on the server: this
  // route is statically generated (generateStaticParams + revalidate), and
  // reading searchParams would force dynamic rendering for every district spoke.
  // Instead the server always renders the complete, unfiltered set — so crawlers
  // and no-JS visitors get everything — and the client narrows it after
  // hydration. Critical content is therefore never hydration-dependent.
  const refineEnabled =
    dateNightModifiersEnabled() && spoke.intent.urlSlug === DATE_NIGHT_INTENT_SLUG;
  const availability = refineEnabled ? modifierAvailability(spoke.venues) : [];
  const basePath = `/bali/${district}/${intent}`;

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

        {refineEnabled && (
          <Suspense fallback={null}>
            <DateNightRefine
              basePath={basePath}
              availability={availability}
              districtName={spoke.districtName}
              noun={spoke.intent.noun}
            />
          </Suspense>
        )}

        {/* Flag off renders exactly what shipped before: no wrapper element, so
            grid layout and equal-height rows are untouched. The wrapper exists
            only when the refinement is active and needs a filter target. */}
        <div
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          {...(refineEnabled ? { "data-refine-grid": "" } : {})}
        >
          {spoke.venues.map((v) =>
            refineEnabled ? (
              <div
                key={v.slug}
                className="contents"
                // Which modifiers this venue has positive evidence for. The
                // client filter hides non-matching wrappers; with no JS every
                // card shows. `contents` keeps the card itself the grid item.
                data-refine={venueModifierKeys(v).join(" ")}
              >
                <VenueCard v={v} actionMode={actionMode} showSimilar={false} linkToPage />
              </div>
            ) : (
              <VenueCard key={v.slug} v={v} actionMode={actionMode} showSimilar={false} linkToPage />
            )
          )}
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
