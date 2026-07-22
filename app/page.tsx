import type { Metadata } from "next";
import Link from "next/link";
import HomeAnalyticsLink from "@/components/HomeAnalyticsLink";
import DistrictCover from "@/components/landing/DistrictCover";
import HeroLoop from "@/components/landing/HeroLoop";
import SceneImage from "@/components/landing/SceneImage";
import SiteFooter from "@/components/SiteFooter";
import {
  HOME_AREAS,
  HOME_CATEGORIES,
  HOME_HERO,
  HOME_MOMENTS,
  HOME_PLANS,
  HOME_TRUST_PRINCIPLES,
  type HomeLinkItem,
} from "@/lib/homepage";
import { DISTRICT_GRADIENT } from "@/lib/districts";
import { serializeJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Other Bali — Curated Places, Routes & Trip Plans",
  description:
    "Find curated places, routes and practical trip plans across Bali, with clear guidance on what fits your day or trip.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "The right Bali for the moment you’re in.",
    description: "Curated places, routes and practical plans for your Bali day or trip.",
    url: "https://www.otherbali.com/",
    siteName: "Other Bali",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The right Bali for the moment you’re in.",
    description: "Curated places, routes and practical plans for your Bali day or trip.",
  },
};

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.otherbali.com/#homepage",
  url: "https://www.otherbali.com/",
  name: "Other Bali — Curated Places, Routes & Trip Plans",
  description:
    "Find curated places, routes and practical trip plans across Bali, with clear guidance on what fits your day or trip.",
  isPartOf: { "@id": "https://www.otherbali.com/#website" },
  inLanguage: "en",
};

const AREA_DISTRICT_SLUG: Record<string, string> = {
  ubud: "ubud",
  canggu: "canggu",
  sanur: "sanur",
  uluwatu: "uluwatu-bukit",
  seminyak: "seminyak",
  nusa_dua: "nusa-dua",
};

const MOMENT_SCENE: Record<string, { scene: string; variant: "sunset" | "ridge" | "surf" | "night" }> = {
  first_day: { scene: "moment-morning", variant: "ridge" },
  sunset: { scene: "moment-goldenhour", variant: "sunset" },
  with_kids: { scene: "moment-warung", variant: "surf" },
  rainy_day: { scene: "moment-morning", variant: "ridge" },
  romantic: { scene: "moment-dinner", variant: "night" },
  trip_lengths: { scene: "hero-sunset", variant: "sunset" },
};

function CardGrid({ items }: { items: HomeLinkItem[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => {
        const scene = MOMENT_SCENE[item.id];
        return (
          <HomeAnalyticsLink
            key={item.id}
            href={item.href}
            sectionId={item.sectionId}
            itemId={item.id}
            itemKind={item.kind}
            position={index + 1}
            className="group flex min-h-64 overflow-hidden rounded-3xl border border-[#e4d8c8] bg-white text-[#2b1a13] shadow-sm transition hover:-translate-y-0.5 hover:border-[#005962]/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
          >
            <span className="flex w-full flex-col">
              <span className="relative block min-h-32 overflow-hidden bg-[#2b1a13]">
                {scene ? (
                  <SceneImage
                    scene={scene.scene}
                    variant={scene.variant}
                    imgClassName="transition duration-700 group-hover:scale-105"
                  />
                ) : null}
                <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              </span>
              <span className="flex flex-1 flex-col justify-between p-5">
                <span>
                  <span className="block font-display text-xl leading-tight">{item.label}</span>
                  {item.body ? <span className="mt-2 block text-sm leading-relaxed text-[#4d4036]">{item.body}</span> : null}
                </span>
                <span className="mt-5 text-sm font-semibold text-[#005962]" aria-hidden="true">
                  {item.ctaLabel ?? `View ${item.label}`} →
                </span>
              </span>
            </span>
          </HomeAnalyticsLink>
        );
      })}
    </div>
  );
}

function CompactLinkGrid({ items }: { items: HomeLinkItem[] }) {
  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item, index) => (
        <HomeAnalyticsLink
          key={item.id}
          href={item.href}
          sectionId={item.sectionId}
          itemId={item.id}
          itemKind={item.kind}
          position={index + 1}
          className="rounded-2xl border border-[#e4d8c8] bg-white px-4 py-3 text-sm font-semibold text-[#2b1a13] transition hover:border-[#005962]/40 hover:text-[#005962] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
        >
          {item.label}
        </HomeAnalyticsLink>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(HOME_JSON_LD) }}
      />
      <main data-page-shell="landing" className="bg-[#f7f0e7] pb-[calc(4.5rem+env(safe-area-inset-bottom,0px))] text-[#2b1a13] min-[1360px]:pb-0">
        <section className="relative overflow-hidden border-b border-[#e4d8c8] bg-[#2b1a13] text-white">
          <SceneImage scene="hero-sunset" variant="sunset" imgClassName="ob-grade ob-kenburns" />
          <HeroLoop src="/scenes/hero-loop.mp4" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2b1a13]/85 to-transparent" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-14 pt-8 sm:gap-10 sm:py-16 lg:min-h-[68svh] lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f1c987]">{HOME_HERO.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-display text-3xl font-normal leading-[1.05] tracking-tight sm:text-6xl lg:mt-5 lg:text-7xl">
                {HOME_HERO.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:mt-6 sm:text-xl">
                {HOME_HERO.body}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
                <HomeAnalyticsLink
                  href={HOME_HERO.primaryCta.href}
                  sectionId="home_hero"
                  itemId={HOME_HERO.primaryCta.id}
                  itemKind="cta"
                  position={1}
                  className="inline-flex min-h-12 items-center rounded-full bg-[#005962] px-5 text-sm font-semibold text-white transition hover:bg-[#003f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962] sm:px-6 sm:text-base"
                >
                  {HOME_HERO.primaryCta.label}
                </HomeAnalyticsLink>
                <HomeAnalyticsLink
                  href={HOME_HERO.secondaryCta.href}
                  sectionId="home_hero"
                  itemId={HOME_HERO.secondaryCta.id}
                  itemKind="cta"
                  position={2}
                  className="inline-flex min-h-12 items-center rounded-full border border-white/45 px-5 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:px-6 sm:text-base"
                >
                  {HOME_HERO.secondaryCta.label}
                </HomeAnalyticsLink>
              </div>
            </div>
            <div className="hidden rounded-[2rem] border border-white/25 bg-white/90 p-5 text-[#2b1a13] shadow-xl shadow-[#2b1a13]/20 backdrop-blur sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6b3e]">Start with your situation</p>
              <h2 className="mt-3 font-display text-3xl leading-tight">A short choice beats an endless list.</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4d4036]">
                Pick the kind of day or trip you need. Other Bali points you to a useful page, route or category that already exists.
              </p>
              <div className="mt-5 grid gap-2">
                {HOME_MOMENTS.slice(0, 3).map((item, index) => (
                  <HomeAnalyticsLink
                    key={item.id}
                    href={item.href}
                    sectionId={item.sectionId}
                    itemId={item.id}
                    itemKind={item.kind}
                    position={index + 1}
                    className="flex min-h-12 items-center justify-between rounded-2xl border border-[#e4d8c8] bg-[#faf7f1] px-4 text-sm font-semibold transition hover:border-[#005962]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
                  >
                    <span>{item.label}</span>
                    <span aria-hidden="true">→</span>
                  </HomeAnalyticsLink>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="moments" aria-labelledby="moments-title" className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#005962]">Choose by moment</p>
          <h2 id="moments-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
            What do you want to do?
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#44352b]">Start with the kind of day you want.</p>
          <CardGrid items={HOME_MOMENTS} />
        </section>

        <section aria-labelledby="plan-title" className="border-y border-[#e4d8c8] bg-[#fffaf3]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#005962]">Plan your Bali</p>
            <h2 id="plan-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Plan your Bali trip
            </h2>
            <div className="mt-10 grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="font-display text-2xl">Choose the part of Bali that fits your trip</h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {HOME_AREAS.map((area, index) => {
                    const slug = AREA_DISTRICT_SLUG[area.id] ?? area.id;
                    return (
                      <HomeAnalyticsLink
                        key={area.id}
                        href={area.href}
                        sectionId={area.sectionId}
                        itemId={area.id}
                        itemKind={area.kind}
                        position={index + 1}
                        className="group relative min-h-40 overflow-hidden rounded-3xl border border-[#e4d8c8] bg-[#2b1a13] p-5 text-white shadow-sm transition hover:border-[#005962]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
                      >
                        <DistrictCover slug={slug} gradient={DISTRICT_GRADIENT[slug] ?? DISTRICT_GRADIENT.canggu} />
                        <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <span className="relative flex min-h-28 flex-col justify-end">
                          <span className="block font-display text-2xl">{area.label}</span>
                          <span className="mt-2 block text-sm leading-relaxed text-white/85">{area.body}</span>
                        </span>
                      </HomeAnalyticsLink>
                    );
                  })}
                </div>
                <Link href="/bali" className="mt-5 inline-flex font-semibold text-[#005962] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]">
                  Explore Bali areas →
                </Link>
              </div>
              <div>
                <h3 className="font-display text-2xl">Ready-made Bali plans</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4d4036]">Start with a practical plan for your trip.</p>
                <div className="mt-5 grid gap-3">
                  {HOME_PLANS.map((plan, index) => (
                    <HomeAnalyticsLink
                      key={plan.id}
                      href={plan.href}
                      sectionId={plan.sectionId}
                      itemId={plan.id}
                      itemKind={plan.kind}
                      position={index + 1}
                      className="rounded-3xl border border-[#e4d8c8] bg-white p-5 transition hover:border-[#005962]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className="block font-display text-xl">{plan.label}</span>
                          <span className="mt-2 block text-sm leading-relaxed text-[#4d4036]">{plan.body}</span>
                        </span>
                        <span className="text-[#005962]" aria-hidden="true">→</span>
                      </span>
                    </HomeAnalyticsLink>
                  ))}
                </div>
                <Link href="/plan" className="mt-5 inline-flex font-semibold text-[#005962] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]">
                  See all Bali plans →
                </Link>
              </div>
            </div>
          </div>
        </section>


        <section aria-labelledby="categories-title" className="relative overflow-hidden border-y border-[#e4d8c8] bg-[#fffaf3]">
          <div className="pointer-events-none absolute inset-0 opacity-25">
            <SceneImage scene="moment-warung" variant="surf" imgClassName="blur-sm scale-105" />
          </div>
          <div className="absolute inset-0 bg-[#fffaf3]/85" />
          <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-20">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#005962]">Explore by category</p>
            <h2 id="categories-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Explore Bali by category
            </h2>
            <CompactLinkGrid items={HOME_CATEGORIES} />
          </div>
        </section>

        <section aria-labelledby="canggu-title" className="mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#005962]">Canggu deep guide</p>
            <h2 id="canggu-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Canggu has the deepest active guidance right now.
            </h2>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#e4d8c8] bg-white shadow-sm">
            <div className="relative min-h-52 overflow-hidden bg-[#2b1a13]">
              <DistrictCover slug="canggu" gradient={DISTRICT_GRADIENT.canggu} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-base leading-relaxed text-[#44352b]">
                Use Canggu for denser local scenarios, routes, decision-ready places and confirmed venue actions. The rest of Bali still keeps useful planning pages and published venue cards where the data passes the current rules.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
              <HomeAnalyticsLink
                href="/canggu"
                sectionId="home_canggu"
                itemId="canggu_deep"
                itemKind="cta"
                position={1}
                className="inline-flex min-h-12 items-center rounded-full bg-[#005962] px-5 font-semibold text-white transition hover:bg-[#003f46] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
              >
                Open the Canggu guide
              </HomeAnalyticsLink>
              <HomeAnalyticsLink
                href="/canggu-first-day"
                sectionId="home_canggu"
                itemId="canggu_first_day"
                itemKind="cta"
                position={2}
                className="inline-flex min-h-12 items-center rounded-full border border-[#cdbfab] px-5 font-semibold text-[#2b1a13] transition hover:border-[#005962]/50 hover:text-[#005962] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005962]"
              >
                Start with Canggu now
              </HomeAnalyticsLink>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="trust-title" className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:py-20 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#005962]">Trust</p>
            <h2 id="trust-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Built to make choosing Bali simpler.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#44352b]">
              Start with your moment, area or trip plan, then open the guide that fits.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {HOME_TRUST_PRINCIPLES.map((principle) => (
                <li key={principle} className="rounded-3xl border border-[#e4d8c8] bg-white p-5 text-sm font-semibold">
                  {principle}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[2rem] bg-[#005962] p-6 text-white sm:p-8">
            <h3 className="font-display text-3xl leading-tight">Keep your Bali shortlist in one place.</h3>
            <p className="mt-4 leading-relaxed text-white">
              Save places and plans so they’re easy to find when you need them.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <HomeAnalyticsLink
                href="/places"
                sectionId="home_trust_save"
                itemId="save_start"
                itemKind="cta"
                position={1}
                className="inline-flex min-h-12 items-center rounded-full bg-white px-5 font-semibold text-[#005962] transition hover:bg-[#f3ecdf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Build my shortlist
              </HomeAnalyticsLink>
              <HomeAnalyticsLink
                href="/me"
                sectionId="home_trust_save"
                itemId="saved_open"
                itemKind="cta"
                position={2}
                className="inline-flex min-h-12 items-center rounded-full border border-white/50 px-5 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                View my shortlist
              </HomeAnalyticsLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
