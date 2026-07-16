import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";

const MOODS = {
  "slow-morning": "Slow morning",
  "work-session": "Work session",
  "midday-reset": "Midday reset",
  "golden-hour": "Golden hour",
  "late-dinner": "Late dinner",
  "special-occasion": "Special occasion",
} as const;

const DISTRICTS = {
  canggu: "Canggu",
  ubud: "Ubud",
  seminyak: "Seminyak",
  uluwatu: "Uluwatu",
  sanur: "Sanur",
  jimbaran: "Jimbaran",
  "nusa-dua": "Nusa Dua",
} as const;

type Mood = keyof typeof MOODS;
type District = keyof typeof DISTRICTS;

export const metadata: Metadata = {
  title: "Shared Other Bali day",
  description: "A Bali day shared from the Other Bali iPhone app.",
  alternates: { canonical: "/plan/shared" },
  robots: { index: false, follow: true },
};

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function allowedMood(value: string | undefined): Mood {
  return value && value in MOODS ? (value as Mood) : "slow-morning";
}

function allowedDistrict(value: string | undefined): District {
  return value && value in DISTRICTS ? (value as District) : "canggu";
}

function allowedDays(value: string | undefined) {
  return value === "3" || value === "7" ? value : "1";
}

export default async function SharedPlan({
  searchParams,
}: {
  searchParams: Promise<{
    m?: string | string[];
    district?: string | string[];
    days?: string | string[];
  }>;
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
