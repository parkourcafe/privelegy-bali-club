import Link from "next/link";
import Reveal from "@/components/landing/Reveal";
import HeroGlow from "@/components/landing/HeroGlow";
import SceneImage from "@/components/landing/SceneImage";
import { LandingNav, MobileStickyCTA } from "@/components/landing/LandingChrome";
import DistrictMapLink from "@/components/DistrictMapLink";
import { DISTRICT_GUIDE } from "@/lib/districts";

// Other Bali — cinematic launch surface (otherbali.com). The functional
// day-plan tool lives at /plan; every CTA here funnels into it. landing_open
// is already emitted globally by <SourceCapture/> in the root layout, so the
// event funnel (source_scan → landing_open → …) stays intact on this route.
// Copy is honest: no invented numbers, testimonials, logos, or offer claims.

export const metadata = {
  title: "Other Bali — the right place for the moment you're in",
  description:
    "A free, curated guide to Canggu. Pick a place by the moment you're in, grab a confirmed offer, and hand off to a booked table. Travellers never pay.",
};

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--ob-espresso)] font-sans text-[var(--ob-sand)] antialiased">
      <LandingNav />
      <MobileStickyCTA />

      <Hero />
      <ChaosToOrder />
      <Mechanism />
      <HowItWorks />
      <Moments />
      <ProofChain />
      <TrustCards />
      <WhatsInside />
      <Comparison />
      <AroundBali />
      <HumanMoment />
      <Faq />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}

/* ── 1 · Cinematic hero ─────────────────────────────────────────── */
function Hero() {
  return (
    <section className="ob-grain relative flex min-h-[100svh] items-center overflow-hidden">
      <SceneImage scene="hero-sunset" variant="sunset" imgClassName="opacity-90" />
      {/* legibility scrim over the photo, warm-graded */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--ob-espresso)]/80 via-[var(--ob-espresso)]/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--ob-espresso)] to-transparent" />
      <div className="ob-glow absolute inset-0" />
      <HeroGlow />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 pb-20 pt-32 md:grid-cols-[1.15fr_0.85fr] md:pt-24">
        <div>
          <p className="ob-in eyebrow text-[var(--ob-brass-2)]">Canggu Beta · Bali</p>
          <h1
            className="ob-in mt-4 font-display text-[2.05rem] font-semibold leading-[1.06] tracking-tight sm:text-5xl md:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            The right place for the moment you&rsquo;re in.
          </h1>
          <p
            className="ob-in mt-5 max-w-xl text-lg leading-relaxed text-[var(--ob-sand-dim)]"
            style={{ animationDelay: "160ms" }}
          >
            A free, curated guide to Canggu. Tell us the moment &mdash; slow
            morning, work session, sunset, late dinner &mdash; and Other Bali
            picks the place, hands you a confirmed offer, and passes you to a booked
            table.
          </p>
          <div
            className="ob-in mt-8 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/plan"
              className="rounded-full bg-[var(--ob-sand)] px-6 py-3.5 font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
            >
              Plan my Canggu day
            </Link>
            <a
              href="#how"
              className="rounded-full border border-[var(--ob-line)] px-6 py-3.5 font-medium text-[var(--ob-sand)] transition-colors hover:bg-white/5"
            >
              See how it works
            </a>
          </div>
          <p
            className="ob-in mt-6 text-sm text-[var(--ob-stone)]"
            style={{ animationDelay: "320ms" }}
          >
            Free for travellers. No account, no card. Venues pay only for guests
            who actually show up.
          </p>
        </div>

        {/* floating action card — illustrative UI, generic (no specific venue) */}
        <div
          className="ob-in justify-self-center md:justify-self-end"
          style={{ animationDelay: "200ms" }}
        >
          <div className="ob-float w-[19rem] rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)]/80 p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <p className="eyebrow text-[var(--ob-brass)]">Right now · 6:10 pm</p>
            <p className="mt-2 font-display text-2xl font-semibold">Sunset, beachfront</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-[var(--ob-sand-dim)]">
              <span className="rounded-full bg-white/5 px-2 py-0.5">view</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5">lively</span>
              <span className="rounded-full bg-white/5 px-2 py-0.5">beach club</span>
            </div>
            <div className="mt-4 rounded-2xl bg-[var(--ob-accent)]/15 p-3 text-sm">
              <span className="font-medium text-[var(--ob-accent-2)]">
                🎟️ Offer ready
              </span>
              <p className="mt-0.5 text-xs text-[var(--ob-sand-dim)]">
                Show the screen on arrival.
              </p>
            </div>
            <div className="mt-3 flex gap-2">
              <span className="flex-1 rounded-xl bg-[var(--ob-sand)] px-3 py-2 text-center text-sm font-semibold text-[var(--ob-espresso)]">
                Reserve
              </span>
              <span className="rounded-xl border border-[var(--ob-line)] px-3 py-2 text-sm">
                Directions
              </span>
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-[var(--ob-stone)]">
              Illustrative
            </p>
          </div>
        </div>
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
              price anchors, what to order, and a confirmed offer &mdash; ordered from
              morning to night. You choose, you go.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-sm">
              {["Curated, not ranked", "Verified in person", "Real offers", "Table ready"].map(
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
      d: "Choose by context — coffee & laptop, sunset drinks, date-night dinner. We surface the few right places, not a directory.",
    },
    {
      k: "Reserve",
      t: "Hand off to a booked table",
      d: "For bookable venues, Other Bali passes you straight to a reservation. We don't run the booking — we hand you to it, cleanly.",
    },
    {
      k: "Arrive",
      t: "Show the offer on the spot",
      d: "Your offer is a screen you show on arrival — the on-premise proof that you actually came, kept separate from anything billed.",
    },
    {
      k: "Seated",
      t: "The venue earns you as a guest",
      d: "When a booking through us becomes a real seated visit, the venue pays a fixed fee. That's the only money in the loop — and never from you.",
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
    { t: "Open the guide", d: "No signup. Canggu, ordered morning to night." },
    { t: "Pick your moment", d: "Filter by vibe and type — quiet, view, work-friendly, dinner." },
    { t: "Grab the offer", d: "A real offer you show on arrival. No card, no code to buy." },
    { t: "Reserve & go", d: "Hand off to a booked table, or get directions. Then enjoy it." },
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
            href="/plan"
            className="inline-flex rounded-full bg-[var(--ob-accent)] px-6 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Plan my Canggu day →
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
    moment: string; // slug in lib/moments.ts — deep-links into /plan?m=…
    tag: string;
    pain: string;
    move: string;
    result: string;
  }[] = [
    {
      variant: "ridge",
      scene: "moment-morning",
      moment: "slow-morning",
      tag: "Slow morning",
      pain: "You want good coffee and a table you can actually work at.",
      move: "Filter work-friendly · quiet — verified for wifi and sockets.",
      result: "A calm café that earns its flat white.",
    },
    {
      variant: "surf",
      scene: "moment-warung",
      moment: "midday-reset",
      tag: "Midday reset",
      pain: "Hot, hungry, and every warung looks the same from the road.",
      move: "See what to order and the honest price before you sit down.",
      result: "No tourist mark-up, no guessing.",
    },
    {
      variant: "sunset",
      scene: "moment-goldenhour",
      moment: "golden-hour",
      tag: "Golden hour",
      pain: "You want the view — without the influencer queue.",
      move: "A curated sunset spot with the offer ready and a table held.",
      result: "You arrive, you show the screen, you sit down.",
    },
    {
      variant: "night",
      scene: "moment-dinner",
      moment: "late-dinner",
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
      <div className="mt-10 space-y-6">
        {scenes.map((s, i) => (
          <Reveal key={s.tag} delay={i * 40}>
            <Link
              href={`/plan?m=${s.moment}`}
              className="group grid overflow-hidden rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso-2)] transition-colors hover:border-[rgba(198,154,92,0.45)] md:grid-cols-2"
            >
              <div className="ob-grain relative min-h-[13rem] overflow-hidden">
                <SceneImage scene={s.scene} variant={s.variant} />
                <span className="absolute left-5 top-5 rounded-full bg-black/35 px-3 py-1 text-xs font-medium backdrop-blur-sm">
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
                  Plan this moment →
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
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
      <div className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {chain.map((c, i) => (
          <Reveal key={c.t} delay={i * 60}>
            <div className="flex h-full flex-col rounded-2xl border border-[var(--ob-line)] bg-[var(--ob-espresso)] p-5">
              <span className="font-display text-2xl font-semibold text-[var(--ob-brass)]">
                {i + 1}
              </span>
              <span className="mt-2 font-semibold">{c.t}</span>
              <span className="mt-1 text-sm text-[var(--ob-sand-dim)]">{c.d}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={80}>
        <p className="mt-6 text-sm text-[var(--ob-stone)]">
          Canggu Beta is live in 2026. We publish real numbers to partners as
          they happen &mdash; never invented ones here.
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

/* ── 9 · Comparison (methods, not venues) ───────────────────────── */
function Comparison() {
  const rows = [
    ["Curated for your moment", true, false, false],
    ["Verified in person", true, false, false],
    ["Real offer on arrival", true, false, false],
    ["Hands you to a booked table", true, false, false],
    ["Free, and you're not the product", true, true, false],
    ["No paid rankings", true, false, true],
  ];
  const cols = ["Other Bali", "Maps & reviews", "Listing sites"];
  return (
    <Section id="compare" className="bg-[var(--ob-espresso)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Versus the old ways</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Not another directory. Not another review hole.
        </h2>
      </Reveal>
      <Reveal delay={100}>
        <div className="mt-9 overflow-x-auto rounded-3xl border border-[var(--ob-line)]">
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <thead>
              <tr className="bg-[var(--ob-espresso-2)]">
                <th className="p-4 text-sm font-medium text-[var(--ob-stone)]">&nbsp;</th>
                {cols.map((c, i) => (
                  <th
                    key={c}
                    className={`p-4 text-sm font-semibold ${
                      i === 0 ? "text-[var(--ob-brass-2)]" : "text-[var(--ob-sand-dim)]"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0] as string} className="border-t border-[var(--ob-line)]">
                  <td className="p-4 text-sm text-[var(--ob-sand)]">{r[0]}</td>
                  {(r.slice(1) as boolean[]).map((v, i) => (
                    <td key={i} className="p-4">
                      {v ? (
                        <span className="text-[var(--ob-accent-2)]">✓</span>
                      ) : (
                        <span className="text-[var(--ob-stone)]">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
                className={`flex h-full flex-col rounded-3xl border p-6 transition-colors ${
                  deep
                    ? "border-[rgba(198,154,92,0.5)] bg-[var(--ob-espresso-3)]"
                    : "border-[var(--ob-line)] bg-[var(--ob-espresso)] hover:border-[rgba(198,154,92,0.4)]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow text-[var(--ob-stone)]">{d.region}</span>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                      deep
                        ? "bg-[var(--ob-sand)] text-[var(--ob-espresso)]"
                        : d.status === "next_deep"
                          ? "border border-[rgba(198,154,92,0.5)] text-[var(--ob-brass-2)]"
                          : "border border-[var(--ob-line)] text-[var(--ob-stone)]"
                    }`}
                  >
                    {STATUS_LABEL[d.status]}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold text-[var(--ob-sand)]">
                  {d.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--ob-sand-dim)]">{d.moment}</p>
                <p className="mt-3 text-xs leading-relaxed text-[var(--ob-stone)]">
                  <span className="text-[var(--ob-brass)]">Best for</span>{" "}
                  {d.bestFor.join(" · ")}
                </p>
                <div className="mt-auto pt-5">
                  {deep ? (
                    <Link
                      href="/plan"
                      className="text-sm font-semibold text-[var(--ob-brass-2)] transition-colors hover:text-[var(--ob-sand)]"
                    >
                      Open the Canggu guide →
                    </Link>
                  ) : (
                    <DistrictMapLink
                      href={d.mapsUrl}
                      districtSlug={d.slug}
                      className="text-sm font-semibold text-[var(--ob-brass-2)] transition-colors hover:text-[var(--ob-sand)]"
                    >
                      Map →
                    </DistrictMapLink>
                  )}
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
      <SceneImage scene="human-dusk" variant="sunset" />
      <div className="absolute inset-0 bg-[var(--ob-espresso)]/60" />
      <div className="relative mx-auto max-w-3xl px-5 py-28 text-center">
        <Reveal>
          <p className="eyebrow text-[var(--ob-brass-2)]">Made on the island</p>
          <p className="mt-5 font-display text-2xl font-medium leading-snug sm:text-3xl">
            Built by people who live in Canggu, walk into every place before it
            goes in the guide, and would rather leave a spot out than pad a list.
          </p>
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
    { q: "Where does it work?", a: "Canggu first, in Beta. Island-wide planning content is growing; offers and reservations live in Canggu for now, Ubud next." },
  ];
  return (
    <Section id="faq" className="bg-[var(--ob-espresso-2)]">
      <Reveal>
        <p className="eyebrow text-[var(--ob-brass)]">Questions</p>
        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          The fair questions, answered straight.
        </h2>
      </Reveal>
      <div className="mt-8 divide-y divide-[var(--ob-line)] rounded-3xl border border-[var(--ob-line)] bg-[var(--ob-espresso)]">
        {qa.map((item) => (
          <details key={item.q} className="group px-6 py-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
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
            Your next place in Canggu is already picked.
          </h2>
        </Reveal>
        <Reveal delay={100}>
          <p className="mx-auto mt-5 max-w-xl text-lg text-[var(--ob-sand-dim)]">
            Open the guide, tell us the moment you&rsquo;re in, and go. Free,
            no account, table ready.
          </p>
        </Reveal>
        <Reveal delay={180}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/plan"
              className="rounded-full bg-[var(--ob-sand)] px-7 py-4 font-semibold text-[var(--ob-espresso)] transition-transform hover:-translate-y-0.5"
            >
              Plan my Canggu day
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

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--ob-line)] bg-[var(--ob-espresso)] px-5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold">Other Bali</p>
          <p className="mt-1 text-sm text-[var(--ob-stone)]">
            The right place for the moment you&rsquo;re in. · Canggu Beta
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--ob-sand-dim)]">
          <Link href="/plan" className="hover:text-[var(--ob-sand)]">
            Plan my day
          </Link>
          <a href="#how" className="hover:text-[var(--ob-sand)]">
            How it works
          </a>
          <a href="#trust" className="hover:text-[var(--ob-sand)]">
            Why free
          </a>
          <a href="#faq" className="hover:text-[var(--ob-sand)]">
            FAQ
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-6xl text-xs text-[var(--ob-stone)]">
        Free to use. We earn from venues only when a reservation made through us
        becomes a real seated visit — never from you.
      </p>
    </footer>
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
