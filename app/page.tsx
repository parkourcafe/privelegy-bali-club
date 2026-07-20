import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/landing/Reveal";
import SceneImage from "@/components/landing/SceneImage";
import PhotoBand from "@/components/landing/PhotoBand";
import DistrictCover from "@/components/landing/DistrictCover";
import { LandingNav, MobileStickyCTA } from "@/components/landing/LandingChrome";
import DayIntentBuilder from "@/components/landing/DayIntentBuilder";
import BrowseBar from "@/components/landing/BrowseBar";
import HeroLoop from "@/components/landing/HeroLoop";
import ParallaxScene from "@/components/landing/ParallaxScene";
import DistrictMapLink from "@/components/DistrictMapLink";
import { DISTRICT_GUIDE, DISTRICT_GRADIENT } from "@/lib/districts";
import ArtCard from "@/components/ArtCard";
import { GATEWAY_PRIMARY, GATEWAY_SECONDARY } from "@/lib/navigation";
import { t } from "@/lib/i18n/dictionaries";
import { getLocale } from "@/lib/i18n/server";
import type { PublicLocale } from "@/lib/i18n/locales";

// Other Bali — cinematic launch surface (otherbali.com). The functional
// day-intent tool now lives in the hero and deep-links into /places. The Canggu
// /plan surface remains the deeper monetized Canggu layer where confirmed venue offers
// can appear. landing_open is emitted globally by <SourceCapture/> in layout.

export const metadata: Metadata = {
  title: "Other Bali — the right place for the moment you're in",
  description:
    "A curated Bali guide that turns how you want to spend the day into a working map of places across the island.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Other Bali — the right place for the moment you're in",
    description:
      "A curated Bali guide that turns how you want to spend the day into a working map of places across the island.",
    url: "https://www.otherbali.com/",
    siteName: "Other Bali",
    locale: "en_US",
    type: "website",
  },
};

// Brand-entity graph for the homepage: teaches Google that "Other Bali" is a
// distinct Organization/WebSite (not the generic phrase "other Bali"), and wires
// the sitelinks search box to the working /places?q= surface. No aggregateRating
// (guardrail: never republish Google ratings).
const BRAND_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.otherbali.com/#organization",
      name: "Other Bali",
      url: "https://www.otherbali.com/",
      logo: "https://www.otherbali.com/icon-512.png",
      description:
        "A resident-curated Bali guide that helps travellers choose the right place for the moment they're in, explains why it fits, and hands off a verified action.",
      sameAs: ["https://www.instagram.com/otherbali/"],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.otherbali.com/#website",
      url: "https://www.otherbali.com/",
      name: "Other Bali",
      inLanguage: "en",
      publisher: { "@id": "https://www.otherbali.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://www.otherbali.com/places?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function Landing() {
  const locale = await getLocale();
  return (
    <div
      data-page-shell="landing"
      className="ob-light min-h-screen overflow-x-hidden bg-[var(--ob-espresso)] font-sans text-[var(--ob-sand)] antialiased"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BRAND_JSON_LD) }}
      />
      <LandingNav />
      <MobileStickyCTA />

      <main>
        <Hero />
        <CategoryGateway locale={locale} />
        <BrowseBar />
        <ChaosToOrder />
        <Mechanism />
        <PhotoBand
          scene="moment-goldenhour"
          variant="sunset"
          kicker="Golden hour, Uluwatu"
          line="The island rewards a plan."
        />
        <HowItWorks />
        <Moments />
        <ProofChain />
        <TrustCards />
        <PhotoBand
          scene="moment-warung"
          variant="surf"
          kicker="A warung worth the detour"
          line="Everything here, we walked into first."
          align="center"
        />
        <WhatsInside />
        <Comparison />
        <AroundBali />
        <HumanMoment />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  );
}

/* ── 1 · Hero — Final canon: photo ≥70% of the frame, scrim bottom only,
   kicker → Young Serif headline → one line → teal CTA "Plan my day". The
   same Higgsfield sunset set stays (warm film, teal shadows — compatible
   with the light frame per the migration plan §05). ─────────────── */
function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      <SceneImage
        scene="hero-sunset"
        variant="sunset"
        imgClassName="ob-grade ob-kenburns"
      />
      {/* one muted loop, desktop only, loaded after window load; the Ken
          Burns poster above is the permanent fallback */}
      <HeroLoop src="/scenes/hero-loop.mp4" />
      {/* Final canon: legibility scrim at the bottom only. */}
      <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-[rgba(20,14,10,0.82)] via-[rgba(20,14,10,0.38)] to-transparent" />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-end gap-12 px-5 pb-16 pt-36 md:grid-cols-[1.15fr_0.85fr]">
        <div className="pb-2">
          <p className="ob-in text-[11px] font-bold uppercase tracking-[0.24em] text-[#E7B7AE]">
            Bali planning · Canggu confirmed offers
          </p>
          <h1
            className="ob-in mt-4 font-display text-[2.05rem] font-normal leading-[1.06] tracking-tight text-[#FAF6EF] sm:text-5xl md:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            The right place for the moment you&rsquo;re in.
          </h1>
          <p
            className="ob-in mt-5 max-w-xl text-lg leading-relaxed text-[rgba(250,246,239,0.85)]"
            style={{ animationDelay: "160ms" }}
          >
            Tell us how you want today to feel — Other Bali turns it into a
            curated map of places across the island.
          </p>
          <div
            className="ob-in mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="#day-builder"
              className="rounded-full bg-[#005962] px-7 py-3.5 font-semibold text-white transition-colors hover:bg-[#003f46]"
            >
              Plan my day
            </Link>
            <Link
              href="/places"
              className="rounded-full border border-[rgba(250,246,239,0.45)] px-6 py-3.5 font-medium text-[#FAF6EF] transition-colors hover:bg-white/10"
            >
              Browse all places
            </Link>
          </div>
          <p
            className="ob-in mt-6 max-w-xl text-sm font-medium leading-relaxed text-[rgba(250,246,239,0.75)]"
            style={{ animationDelay: "320ms" }}
          >
            Free to use. No account, no card. Venues pay only when a referred
            guest actually shows up.
          </p>
        </div>

        <div
          className="ob-in justify-self-center md:justify-self-end"
          style={{
            animationDelay: "200ms",
            width: "min(25rem, calc(100vw - 2.5rem))",
          }}
        >
          <DayIntentBuilder />
        </div>
      </div>
    </section>
  );
}

/* ── 1b · CategoryGateway (IA spec v1 §6): the permanent category entrances,
   straight after the hero. Cards come from the shared navigation registry, so
   the homepage and the header can never disagree about the taxonomy. ── */
function CategoryGateway({ locale }: { locale: PublicLocale }) {
  return (
    <section className="ob-gateway" aria-labelledby="gateway-title">
      <h2 id="gateway-title" className="ob-gateway-title">
        {t(locale, "What are you looking for?")}
      </h2>
      <div className="ob-gateway-grid">
        {GATEWAY_PRIMARY.map((c) => (
          <ArtCard
            key={c.group}
            href={c.href}
            art={c.art}
            title={t(locale, c.label)}
            blurb={t(locale, c.blurb)}
          />
        ))}
      </div>
      <div className="ob-gateway-secondary">
        {GATEWAY_SECONDARY.map((l) => (
          <Link key={l.href} href={l.href} className="ob-gateway-wide">
            <b>{t(locale, l.label)}</b>
            <span>{t(locale, l.blurb ?? "")} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── 2 · Chaos → Order ──────────────────────────────────────────── */
function ChaosToOrder() {
  const chaos = [
    "14 open Google Maps tabs",
    "Review rabbit holes",
    "“anyone been to…?” group chats",
    "Screenshots you never find again",
    "Closed on Mondays — found out on arrival",
  ];
  return (
    <Section id="chaos" className="bg-[var(--ob-espresso-2)]">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <Reveal>
          <p className="eyebrow text-[var(--ob-brass)]">The old way</p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Planning a day in Bali is death by a thousand tabs.
          </h2>
          <ul className="mt-6 space-y-2.5">
            {chaos.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[var(--ob-sand-dim)]">
                <span className="mt-2 h-1 w-4 shrink-0 rounded-full bg-[var(--ob-stone)]" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso)] p-7">
            <p className="eyebrow text-[var(--ob-accent-2)]">Other Bali</p>
            <h3 className="mt-3 font-display text-2xl font-semibold">
              One clear pick for the moment you&rsquo;re in.
            </h3>
            <p className="mt-3 text-[var(--ob-sand-dim)]">
              We do the narrowing. Curated places, verified vibe tags, honest
              price anchors, what to order, and offers only where they are
              confirmed. You choose, you go.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {["Curated map", "By mood", "By area", "Offers where confirmed"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--ob-line)] px-3 py-1 text-[var(--ob-sand)]"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ── 3 · Core mechanism (sticky) ────────────────────────────────── */
function Mechanism() {
  const steps = [
    {
      k: "Find",
      t: "You pick the moment",
      d: "Choose by context: coffee and laptop, sunset drinks, date-night dinner, family lunch. We surface the few right places, not a directory.",
    },
    {
      k: "Map",
      t: "Get a working shortlist",
      d: "The public map opens with your area, mood, group, and type already applied. You can widen it any time.",
    },
    {
      k: "Go",
      t: "Pick the place and move",
      d: "Use directions, check what to order, and keep the day moving without another round of tabs.",
    },
    {
      k: "Seated",
      t: "Venues pay only for real guests",
      d: "Where reservation tracking is active, a venue pays only when a referred guest becomes a real seated visit. You never pay Other Bali.",
    },
  ];
  return (
    <Section id="mechanism" className="bg-[var(--ob-espresso)]">
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="md:sticky md:top-28 md:self-start">
          <Reveal>
            <p className="eyebrow text-[var(--ob-brass)]">The loop</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              How Other Bali actually works, end to end.
            </h2>
            <p className="mt-4 text-[var(--ob-sand-dim)]">
              One quiet flywheel: the traveller finds the right place, the venue
              gets a guest who shows up. Everything else is in service of that.
            </p>
          </Reveal>
        </div>
        <ol className="space-y-5">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.k} delay={i * 60}>
              <div className="rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)] p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-semibold text-[var(--ob-brass)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="eyebrow text-[var(--ob-accent-2)]">{s.k}</span>
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">{s.t}</h3>
                <p className="mt-2 text-[var(--ob-sand-dim)]">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ── 4 · How it works (steps) ───────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { t: "Open the guide", d: "No signup. Start with how you want the day to feel." },
    { t: "Pick your context", d: "Choose mood, area, group, and the way the day should end." },
    { t: "Get the map", d: "The Bali places layer opens already filtered for that brief." },
    { t: "Go wider or deeper", d: "Browse all places, or use the Canggu guide where confirmed offers exist." },
  ];
  return (
    <Section id="how" className="bg-[var(--ob-espresso-2)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">In four steps</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          From &ldquo;where do we go?&rdquo; to a table, in under a minute.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <Reveal key={s.t} delay={i * 70}>
            <div className="h-full rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso)] p-6">
              <span className="font-display text-4xl font-semibold text-[var(--ob-brass)]">
                {i + 1}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
              <p className="mt-1.5 text-sm text-[var(--ob-sand-dim)]">{s.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={120}>
        <div className="mt-8">
          <Link
            href="#day-builder"
            className="inline-flex rounded-full bg-[var(--ob-accent)] px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Build my Bali day →
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── 5 · Moments / scenarios (sticky sequence) ──────────────────── */
function Moments() {
  const scenes: {
    variant: "surf" | "ridge" | "sunset" | "night";
    scene: string;
    href: string;
    tag: string;
    pain: string;
    move: string;
    result: string;
  }[] = [
    {
      variant: "ridge",
      scene: "moment-morning",
      href: "/places?intent=1&q=cafe%20quiet&category=cafe",
      tag: "Slow morning",
      pain: "You want good coffee and a table you can actually work at.",
      move: "Filter work-friendly · quiet — verified for wifi and sockets.",
      result: "A calm café that earns its flat white.",
    },
    {
      variant: "surf",
      scene: "moment-warung",
      href: "/places?intent=1&q=lunch%20reset",
      tag: "Midday reset",
      pain: "Hot, hungry, and every warung looks the same from the road.",
      move: "See what to order and the honest price before you sit down.",
      result: "No tourist mark-up, no guessing.",
    },
    {
      variant: "sunset",
      scene: "moment-goldenhour",
      href: "/places?intent=1&q=sunset%20view&category=beach_club",
      tag: "Golden hour",
      pain: "You want the view — without the influencer queue.",
      move: "A curated sunset spot with the offer ready and a table you can request.",
      result: "You arrive, you show the screen, you sit down.",
    },
    {
      variant: "night",
      scene: "moment-dinner",
      href: "/places?intent=1&q=dinner%20restaurant&category=restaurant",
      tag: "Late dinner",
      pain: "It's 9pm, the good places are full, plans are falling apart.",
      move: "Bookable venues hand you straight to a reservation.",
      result: "The night keeps going.",
    },
  ];
  return (
    <Section id="moments" className="bg-[var(--ob-espresso)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Moments</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Built around the moment you&rsquo;re actually in.
        </h2>
      </Reveal>
      <div className="ob-moment-strip mt-10 md:space-y-6">
        {scenes.map((s, i) => (
          <Reveal key={s.tag} delay={i * 40}>
            <Link
              href={s.href}
              className="ob-moment-card group grid h-full overflow-hidden rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)] transition-colors hover:border-[rgba(198,154,92,0.45)] md:grid-cols-2"
            >
              <div className="ob-grain relative min-h-[15rem] overflow-hidden md:min-h-[17rem]">
                <ParallaxScene className="absolute inset-0">
                  <SceneImage
                    scene={s.scene}
                    variant={s.variant}
                    imgClassName="ob-grade ob-moment-img"
                  />
                </ParallaxScene>
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ob-espresso)]/55 via-transparent to-[var(--ob-espresso)]/15" />
                <span className="ob-moment-tag absolute left-5 top-5 rounded-full bg-black/35 px-3.5 py-1 text-sm backdrop-blur-sm">
                  {s.tag}
                </span>
              </div>
              <div className="p-7">
                <p className="text-[var(--ob-sand-dim)]">{s.pain}</p>
                <p className="mt-4 flex gap-2 font-medium">
                  <span className="text-[var(--ob-accent-2)]">→</span> {s.move}
                </p>
                <p className="mt-3 font-display text-lg text-[var(--ob-sand)]">{s.result}</p>
                <p className="mt-4 text-sm font-semibold text-[var(--ob-brass-2)] opacity-80 transition-opacity group-hover:opacity-100">
                  Open this map →
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      <Reveal delay={120}>
        <div className="mt-8">
          <Link
            href="/my-day"
            className="inline-flex rounded-full border border-[rgba(198,154,92,0.4)] px-6 py-3.5 font-semibold text-[var(--ob-brass-2)] transition-colors hover:border-[rgba(198,154,92,0.7)] hover:text-[var(--ob-sand)]"
          >
            See all four as one plan — My Day →
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── 6 · Proof chain (honest — mechanism, not numbers) ──────────── */
function ProofChain() {
  const chain = [
    { t: "Found here", d: "You discover the venue in Other Bali." },
    { t: "Reserved through us", d: "You hand off to a booking tagged to us." },
    { t: "Confirmed", d: "The venue confirms the table." },
    { t: "Seated", d: "You actually arrive and sit down." },
    { t: "Reported", d: "That seated visit is what the venue pays for." },
  ];
  return (
    <Section id="proof" className="bg-[var(--ob-espresso-2)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Proof, not vanity</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          A venue only pays for a guest who genuinely showed up.
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--ob-sand-dim)]">
          We don&rsquo;t sell clicks, listings, or &ldquo;exposure.&rdquo; The
          chain below is the whole business model &mdash; and every step has to
          be real for it to count.
        </p>
      </Reveal>
      <Reveal className="ob-chain relative mt-9">
        <div className="ob-chain-thread hidden lg:block" aria-hidden="true" />
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {chain.map((c, i) => (
            <div
              key={c.t}
              className="ob-chain-step flex h-full flex-col rounded-2xl border border-[var(--ob-line)] bg-[var(--ob-espresso)] p-5"
            >
              <span className="flex items-center gap-2">
                <span className="ob-chain-dot" aria-hidden="true" />
                <span className="font-display text-2xl font-semibold text-[var(--ob-brass)]">
                  {i + 1}
                </span>
              </span>
              <span className="mt-2 font-semibold">{c.t}</span>
              <span className="mt-1 text-sm text-[var(--ob-sand-dim)]">{c.d}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <Reveal delay={80}>
        <p className="mt-6 text-sm text-[var(--ob-sand-dim)]">
          We publish real numbers to partners as they happen &mdash; never invented ones here.
        </p>
      </Reveal>
    </Section>
  );
}

/* ── 7 · Trust / why free ───────────────────────────────────────── */
function TrustCards() {
  const cards = [
    { t: "You never pay", d: "No tourist fees, ever. Not for the guide, not for an offer, not for a table." },
    { t: "Venues pay for arrivals", d: "A fixed fee per confirmed seated guest — not a cut of your bill, not a deposit." },
    { t: "No paid rankings", d: "Order is editorial. Anything sponsored is always labelled as such." },
    { t: "Your data stays yours", d: "Partners see aggregates. Nothing identifying leaves you without your say-so." },
  ];
  return (
    <Section id="trust" className="bg-[var(--ob-espresso)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Why it&rsquo;s free</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          If you&rsquo;re not paying, you should know who is.
        </h2>
      </Reveal>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={c.t} delay={i * 60}>
            <div className="h-full rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)] p-6">
              <h3 className="font-display text-lg font-semibold">{c.t}</h3>
              <p className="mt-2 text-sm text-[var(--ob-sand-dim)]">{c.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 8 · What's inside ──────────────────────────────────────────── */
function WhatsInside() {
  const items = [
    { t: "Curated places", d: "Hand-picked spots, not a scraped directory." },
    { t: "Ready-made routes", d: "A whole day or evening, sequenced for you." },
    { t: "Verified vibe tags", d: "Quiet, lively, view, work-friendly — checked in person." },
    { t: "Honest price anchors", d: "Roughly what you'll pay, before you sit down." },
    { t: "What to order", d: "The dish worth getting, per place." },
    { t: "Real offers", d: "A genuine offer you show on arrival — confirmed by the venue." },
  ];
  return (
    <Section id="inside" className="bg-[var(--ob-espresso-2)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">What&rsquo;s inside</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Everything you need to decide &mdash; nothing you have to wade through.
        </h2>
      </Reveal>
      <div className="mt-9 grid gap-px overflow-hidden rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-line)] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <Reveal key={it.t} delay={i * 40}>
            <div className="group h-full bg-[var(--ob-espresso)] p-7 transition-colors hover:bg-[var(--ob-espresso-3)]">
              <div className="h-1 w-8 rounded-full bg-[var(--ob-brass)] transition-all group-hover:w-14" />
              <h3 className="mt-4 font-display text-lg font-semibold">{it.t}</h3>
              <p className="mt-1.5 text-sm text-[var(--ob-sand-dim)]">{it.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ── 9 · Where the usual tools stop (honest, not a scoreboard) ───── */
function Comparison() {
  // Credit each tool for what it genuinely does well, then name the gap it
  // leaves for THIS job — picking the right place for the moment and handing
  // you off to book. Honest positioning, no self-serving all-✓ grid, no
  // unsupported claims about competitors (guardrail #9). Navigation stays
  // Google Maps' job — we say so.
  const tools = [
    {
      name: "Google Maps & reviews",
      goodFor: "Finding what exists, and the drive there.",
      gap: "Then it's forty tabs and two hundred opinions to referee — and nothing picked for the moment you're actually in.",
    },
    {
      name: "Listing & booking sites",
      goodFor: "Booking a room and scanning a ranked list.",
      gap: "But the top spots are sold, the lists blur together, and it's tuned for their commission — not your afternoon.",
    },
    {
      name: "Asking the group chat",
      goodFor: "One trusted tip from a friend who's been.",
      gap: "It's hit or miss, ages fast, and doesn't stretch to a whole trip.",
    },
  ];
  return (
    <Section id="compare" className="bg-[var(--ob-espresso)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Where the usual tools stop</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          The tools you use aren&rsquo;t wrong. They&rsquo;re built for a
          different job.
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--ob-sand-dim)]">
          Each one does its thing well. None of them picks the right place for
          the moment you&rsquo;re in and hands you off to book it.
          That&rsquo;s the gap.
        </p>
      </Reveal>

      <div className="mt-9 grid gap-4 md:grid-cols-3">
        {tools.map((t, i) => (
          <Reveal key={t.name} delay={i * 80}>
            <div className="flex h-full flex-col rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)] p-6">
              <h3 className="font-display text-lg font-semibold text-[var(--ob-sand)]">
                {t.name}
              </h3>
              <p className="mt-3 text-sm text-[var(--ob-sand-dim)]">
                <span className="font-semibold text-[var(--ob-accent-2)]">
                  Good for
                </span>{" "}
                {t.goodFor}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--ob-sand-dim)]">
                <span className="font-semibold text-[var(--ob-brass-2)]">
                  Where it leaves you
                </span>{" "}
                {t.gap}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <div className="mt-4 rounded-3xl border border-[rgba(198,154,92,0.5)] bg-[var(--ob-espresso-3)] p-7">
          <p className="eyebrow text-[var(--ob-accent-2)]">Other Bali</p>
          <p className="mt-3 max-w-3xl font-display text-xl font-semibold leading-snug text-[var(--ob-sand)] sm:text-2xl">
            We sit on top of all three: a resident&rsquo;s pick for the moment,
            checked in person, with the offer ready and a hand-off to book &mdash;
            then we hand you back to Google Maps for the drive.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

/* ── 9b · Around the island (Bali-wide planning layer) ──────────────
   Honest coverage map: deep in Canggu, planning notes island-wide, plus the
   fast-boat side-trips (Gili, Lombok) — clearly labelled "beyond Bali". No
   perks/QR/booking outside the active deep district (guardrail #4); these
   cards carry a map link and a growth-only district_open event, nothing
   money-shaped. Static editorial content from lib/districts.ts. */
function AroundBali() {
  const STATUS_LABEL: Record<(typeof DISTRICT_GUIDE)[number]["status"], string> = {
    active_deep: "Full guide",
    next_deep: "In depth next",
    planning_only: "Planning notes",
  };
  return (
    <Section id="bali" className="bg-[var(--ob-espresso-2)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Around the island</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          All of Bali, honestly mapped.
        </h2>
        <p className="mt-4 max-w-2xl text-[var(--ob-sand-dim)]">
          We plan island-wide but go deep one district at a time &mdash; right
          now that&rsquo;s Canggu. For the rest of Bali, and the classic
          fast-boat side-trips beyond it: who each area suits and when to go, so
          you can place it in your trip. Offers and routes arrive as each area
          gets the full treatment.
        </p>
      </Reveal>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DISTRICT_GUIDE.map((d, i) => {
          const deep = d.status === "active_deep";
          return (
            <Reveal key={d.slug} delay={(i % 3) * 60}>
              <div
                className={`group flex h-full flex-col overflow-hidden rounded-3xl border transition-colors ${
                  deep
                    ? "border-[rgba(198,154,92,0.5)] bg-[var(--ob-espresso-3)]"
                    : "border-[var(--ob-line)] bg-[var(--ob-espresso-2)] hover:border-[rgba(198,154,92,0.45)]"
                }`}
              >
                {/* District cover — a distinct light colour wash per area, with
                    the generated mood still on top when available (decorative,
                    never a photo of a specific venue). Only a soft bottom scrim
                    keeps the name legible, so the card stays light and each area
                    reads as its own place. */}
                <div className="relative h-44 shrink-0 overflow-hidden md:h-48">
                  <DistrictCover slug={d.slug} gradient={DISTRICT_GRADIENT[d.slug]} />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--ob-espresso-2)] via-[var(--ob-espresso-2)]/45 to-transparent" />
                  <span
                    className={`absolute right-4 top-4 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
                      deep
                        ? "bg-[var(--ob-sand)] text-[var(--ob-espresso)]"
                        : d.status === "next_deep"
                          ? "border border-[rgba(198,154,92,0.6)] bg-black/30 text-[var(--ob-brass-2)]"
                          : "border border-white/20 bg-black/30 text-[var(--ob-sand-dim)]"
                    }`}
                  >
                    {STATUS_LABEL[d.status]}
                  </span>
                  <div className="absolute inset-x-4 bottom-3">
                    <span className="eyebrow block text-[10px] text-[var(--ob-sand-dim)]">
                      {d.region}
                    </span>
                    <h3 className="mt-0.5 font-display text-2xl font-semibold leading-tight text-[var(--ob-sand)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                      {d.name}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6 pt-4">
                <p className="text-sm text-[var(--ob-sand-dim)]">{d.moment}</p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--ob-sand-dim)]">
                  <span className="text-[var(--ob-brass-2)]">Best for</span>{" "}
                  {d.bestFor.join(" · ")}
                </p>
                <div className="mt-auto flex items-baseline gap-4 pt-5">
                  {deep ? (
                    <Link
                      href="/plan"
                      className="inline-flex min-h-11 items-center rounded-full border border-[rgba(198,154,92,0.35)] px-4 text-sm font-semibold text-[var(--ob-brass-2)] transition-colors hover:border-[rgba(198,154,92,0.65)] hover:text-[var(--ob-sand)]"
                    >
                      Open the Canggu guide →
                    </Link>
                  ) : d.guidePath ? (
                    /* Districts with a published editorial guide lead there
                       first; the catalogue stays one tap away. */
                    <>
                      <Link
                        href={d.guidePath}
                        className="inline-flex min-h-11 items-center rounded-full border border-[rgba(198,154,92,0.35)] px-4 text-sm font-semibold text-[var(--ob-brass-2)] transition-colors hover:border-[rgba(198,154,92,0.65)] hover:text-[var(--ob-sand)]"
                      >
                        Open the {d.name.split(" ")[0]} guide →
                      </Link>
                      <DistrictMapLink
                        href={`/places?district=${d.slug}`}
                        districtSlug={d.slug}
                        className="inline-flex min-h-11 min-w-12 items-center rounded-full px-3 text-xs font-semibold text-[var(--ob-sand-dim)] transition-colors hover:text-[var(--ob-sand)]"
                      >
                        Places
                      </DistrictMapLink>
                    </>
                  ) : d.catalogued ? (
                    /* Areas with catalogue venues stay on-site — the places
                       layer is where reserve/offer actions live. The outside
                       map drops to a quiet secondary link. */
                    <>
                      <DistrictMapLink
                        href={`/places?district=${d.slug}`}
                        districtSlug={d.slug}
                        className="inline-flex min-h-11 items-center rounded-full border border-[rgba(198,154,92,0.35)] px-4 text-sm font-semibold text-[var(--ob-brass-2)] transition-colors hover:border-[rgba(198,154,92,0.65)] hover:text-[var(--ob-sand)]"
                      >
                        Browse places →
                      </DistrictMapLink>
                      <a
                        href={d.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-11 min-w-12 items-center rounded-full px-3 text-xs font-semibold text-[var(--ob-sand-dim)] transition-colors hover:text-[var(--ob-sand)]"
                      >
                        Map
                      </a>
                    </>
                  ) : (
                    <DistrictMapLink
                      href={d.mapsUrl}
                      districtSlug={d.slug}
                      className="inline-flex min-h-11 min-w-16 items-center rounded-full border border-[rgba(198,154,92,0.35)] px-4 text-sm font-semibold text-[var(--ob-brass-2)] transition-colors hover:border-[rgba(198,154,92,0.65)] hover:text-[var(--ob-sand)]"
                    >
                      Map →
                    </DistrictMapLink>
                  )}
                </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ── 10 · Human moment ──────────────────────────────────────────── */
function HumanMoment() {
  return (
    <section className="ob-grain relative overflow-hidden">
      <ParallaxScene className="absolute inset-0" amplitude={22}>
        <SceneImage scene="human-dusk" variant="sunset" imgClassName="ob-grade" />
      </ParallaxScene>
      <div className="absolute inset-0 bg-[var(--ob-espresso)]/60" />
      <div className="relative mx-auto max-w-3xl px-5 py-32 text-center">
        <Reveal>
          <p className="eyebrow text-[var(--ob-brass-2)]">Made on the island</p>
          <div className="ob-signature-rule mt-5" aria-hidden="true" />
          <p className="mt-6 font-display text-2xl font-medium leading-snug sm:text-3xl">
            Built by people who live in Bali, walk into places before they go in
            the guide, and would rather leave a spot out than pad a list.
          </p>
          <div className="ob-signature-rule mt-6" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}

/* ── FAQ (structured by fears) ──────────────────────────────────── */
function Faq() {
  const qa = [
    { q: "Is it really free?", a: "Yes. Travellers never pay — no fee for the guide, the offer, or a table. Venues pay only when a booking through us becomes a real seated guest." },
    { q: "Do I need an account or a card?", a: "No. Open it, pick a place, show the offer on arrival. Nothing to sign up for, nothing to buy." },
    { q: "What's the catch with the offers?", a: "There isn't one. An offer is a real incentive you show on arrival, confirmed by the venue. It's separate from anything a venue pays — it just proves you actually came." },
    { q: "Do you take a cut of my bill?", a: "Never. No percentage of your cheque, no deposit, no markup. The venue pays a fixed fee for a seated guest — that's the entire model." },
    { q: "How do you choose places?", a: "Editorially, and in person. We verify vibe, price, and what's worth ordering on-site. Order is never paid for; anything sponsored is labelled." },
    { q: "Where does it work?", a: "The public planning layer covers Bali districts. Confirmed offers and reservation tracking start in Canggu, then expand as partner proof is ready." },
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <Section id="faq" className="bg-[var(--ob-espresso-2)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Questions</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          The fair questions, answered straight.
        </h2>
      </Reveal>
      <div className="mt-8 divide-y divide-[var(--ob-line)] rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso)]">
        {qa.map((item) => (
          <details key={item.q} className="group px-6 py-4 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4">
              <span className="font-medium">{item.q}</span>
              <span className="text-[var(--ob-brass)] transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 text-[var(--ob-sand-dim)]">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/* ── 11 · Final CTA ─────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="ob-grain relative overflow-hidden bg-[var(--ob-espresso)]">
      <div className="ob-glow absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold leading-[1.08] sm:text-5xl">
            Your next Bali day starts with the right map.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--ob-sand-dim)]">
            Tell us the mood, the area, and who you are with. Open the filtered
            places layer, then decide where to go.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="#day-builder"
              className="rounded-full bg-[var(--ob-sand)] px-7 py-4 font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
            >
              Build my Bali day
            </Link>
            <a
              href="#how"
              className="rounded-full border border-[var(--ob-line)] px-7 py-4 font-medium transition-colors hover:bg-white/5"
            >
              How it works
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}


/* Shared section shell */
function Section({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`px-5 py-24 ${className}`}>
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
