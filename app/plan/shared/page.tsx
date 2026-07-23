import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import {
  MOODS,
  DISTRICTS,
  allowedMood,
  allowedDistrict,
  allowedDays,
  daysLabel,
  first,
} from "./params";

type SharedPlanSearchParams = Promise<{
  m?: string | string[];
  district?: string | string[];
  days?: string | string[];
}>;

// Dynamic metadata so a shared link unfurls as the actual plan ("Slow
// morning in Canggu"), with a per-plan OG card (./og/route.tsx) instead of
// the generic site image. Params are whitelist-coerced, so titles and image
// URLs only ever contain known-safe values.
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SharedPlanSearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const mood = allowedMood(first(params.m));
  const district = allowedDistrict(first(params.district));
  const days = allowedDays(first(params.days));
  const title = `${MOODS[mood]} in ${DISTRICTS[district]} — a shared Other Bali day`;
  const description = `${daysLabel(days)} in ${DISTRICTS[district]}, shared with you as a starting point. Open the live guide for current places, menus and verified booking actions.`;
  const ogImage = `/plan/shared/og?m=${mood}&district=${district}&days=${days}`;
  return {
    title,
    description,
    alternates: { canonical: "/plan/shared" },
    robots: { index: false, follow: true },
    openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

export default async function SharedPlan({
  searchParams,
}: {
  searchParams: SharedPlanSearchParams;
}) {
  const params = await searchParams;
  const mood = allowedMood(first(params.m));
  const district = allowedDistrict(first(params.district));
  const days = allowedDays(first(params.days));
  const districtGuide =
    district === "canggu" ? `/plan?m=${encodeURIComponent(mood)}` : `/bali/${district}`;

  return (
    <div className="page-dark min-h-screen">
      <main className="site-shell max-w-3xl py-10 sm:py-16">
        <BrandHomeLink />

        <section className="mt-10 rounded-[2rem] border border-[var(--line)] bg-[var(--paper-soft)] p-6 shadow-2xl sm:p-10">
          <p className="topline text-[var(--lagoon)]">Shared from the iPhone app</p>
          <h1 className="mt-4 font-display text-5xl leading-none text-[var(--ink)] sm:text-7xl">
            {MOODS[mood]} in {DISTRICTS[district]}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[var(--muted)]">
            {days === "1" ? "One day" : `${days} days`} saved as a starting point.
            Open the live guide for current places, menus, directions and verified
            booking or delivery actions.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[var(--paper-warm)] p-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Mood</dt>
              <dd className="mt-2 font-semibold text-[var(--ink)]">{MOODS[mood]}</dd>
            </div>
            <div className="rounded-2xl bg-[var(--paper-warm)] p-4">
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">District</dt>
              <dd className="mt-2 font-semibold text-[var(--ink)]">{DISTRICTS[district]}</dd>
            </div>
            <div className="col-span-2 rounded-2xl bg-[var(--paper-warm)] p-4 sm:col-span-1">
              <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Length</dt>
              <dd className="mt-2 font-semibold text-[var(--ink)]">
                {days === "1" ? "One day" : `${days} days`}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={districtGuide} className="button-primary button-large">
              Open the live district guide
            </Link>
            <Link
              href={`/places?district=${encodeURIComponent(district)}`}
              className="button-secondary button-large"
            >
              Browse places
            </Link>
          </div>
        </section>

        <p className="mt-6 text-sm text-[var(--muted)]">
          Other Bali is free for travellers. Current venue actions open only through
          the official provider shown on each place page.
        </p>
      </main>
    </div>
  );
}
