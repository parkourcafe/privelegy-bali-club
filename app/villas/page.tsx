import type { Metadata } from "next";
import Link from "next/link";
import { existsSync } from "node:fs";
import path from "node:path";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter } from "@/components/GuideBlocks";
import SceneImage from "@/components/landing/SceneImage";
import Reveal from "@/components/landing/Reveal";
import { VILLAS_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Public villa partner page (2026-07-17, photo-forward rebuild). Villas are a
// barter partnership, not a monetised tier: villa managers add their own
// details and photos, we review and publish, and travellers reach the villa
// directly; in return they link Other Bali (site + Instagram + an in-villa QR
// card). No fees either way, no booking-volume promises, no new DB entity — the
// "join" action is a WhatsApp handoff reviewed by hand. Cinematic scene set
// (SVG art + build-fetched Higgsfield stills) is ATMOSPHERE ONLY — never
// presented as a photo of a specific villa (editorial guardrail). Guardrails:
// no payment, no marketplace checkout, owner approves before anything publishes.

export const metadata: Metadata = {
  title: "For villas — partner with Other Bali",
  description:
    "Independent villa or boutique stay in Bali? Partner with Other Bali, the resident-curated guide. You add your own details and photos, we review and publish, and travellers reach you directly — completely free.",
  alternates: { canonical: "/villas" },
  openGraph: {
    title: "For villas · Other Bali",
    description:
      "Partner with Other Bali — add your own details and photos, we review and publish, and travellers reach you directly. Completely free.",
    url: "https://www.otherbali.com/villas",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "For villas · Other Bali",
    description:
      "Partner with Other Bali — you add your details and photos, we review and publish. Completely free.",
  },
};

const CHIPS = [
  { title: "Completely free", note: "a simple partnership, no fees" },
  { title: "Direct, no middleman", note: "guests reach you, not a marketplace" },
  { title: "You approve first", note: "nothing publishes without you" },
];

// The barter, stated symmetrically so the whole deal is visible at a glance.
const YOU_GET = [
  "A dedicated villa page with your own photos, description and amenities, and direct links (website, WhatsApp, booking page)",
  "Travellers who discover you and reach you directly — no marketplace, no commission, no checkout in between",
  "A personalised guest QR: one link your guests scan for restaurants, beaches, wellness and activities picked by residents",
];
const WE_ASK = [
  "A link to Other Bali on your website",
  "A mention of Other Bali on your Instagram",
  "Our QR on your welcome / Wi-Fi card in the villa",
];

// Each "why" carries an atmospheric scene (mood only, never a specific villa).
const WHY: {
  title: string;
  body: string;
  scene: string;
  variant: "sunset" | "ridge" | "surf" | "night";
}[] = [
  {
    title: "Additional direct discovery",
    body: "Travellers find your villa here and continue straight to your website, WhatsApp or booking page.",
    scene: "moment-morning",
    variant: "ridge",
  },
  {
    title: "A concierge for your guests",
    body: "One trusted link for restaurants, beaches, wellness, activities and delivery — picked by residents.",
    scene: "human-dusk",
    variant: "night",
  },
  {
    title: "A better guest experience",
    body: "Fewer repeat questions at reception, faster guest decisions — no concierge platform to build.",
    scene: "moment-dinner",
    variant: "sunset",
  },
];

const STEPS = [
  {
    title: "You add your villa",
    body: "Send us your details and your own photos (ones you have the rights to share) — right here on WhatsApp. You fill it in, so the page is genuinely yours.",
  },
  {
    title: "We review and polish",
    body: "We tidy the page — wording, layout, translation — and check everything reads right. We never invent facts or add photos you didn't send.",
  },
  {
    title: "You approve, we publish",
    body: "We send it back for a look. Nothing goes live until you confirm — and all your links stay yours.",
  },
  {
    title: "You share the guide with guests",
    body: "A QR code, welcome link or check-in message — one trusted local guide for their whole stay.",
  },
];

// The barter as a directional flow — travellers arrive through us, guests
// discover Bali through you. Rendered over a cinematic band.
const EXCHANGE = [
  { label: "Travellers on Other Bali", note: "planning their Bali trip" },
  { label: "Discover & enquire", note: "your villa page, your links" },
  { label: "Your villa", note: "website · WhatsApp · direct booking" },
  { label: "You share the guide", note: "QR on the welcome card" },
  { label: "Your current guests", note: "one trusted local concierge" },
];

export default function VillasPage() {
  // The villa film ships via the prebuild scene fetch; where the CDN is
  // unreachable (e.g. the CI sandbox) the file is absent and the player simply
  // doesn't render — the block keeps its cinematic poster. Checked at build
  // time; the page is static.
  const filmReady = existsSync(
    path.join(process.cwd(), "public", "scenes", "villas-film.mp4")
  );
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="villas" />

        {/* Cinematic full-width masthead: a self-contained dark scene block
            (SVG art + build-fetched still) with its own scrim + hardcoded light
            text, dropped into the light editorial page — same pattern as
            /places. Atmosphere only, never a specific villa. */}
        <header className="places-masthead ob-grain relative -mx-4 mb-10 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[rgba(22,16,12,0.35)]">
          <div className="relative min-h-[22rem] md:min-h-[27rem]">
            <SceneImage scene="moment-morning" variant="ridge" imgClassName="ob-grade" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#16100c]/90 via-[#16100c]/55 to-[#16100c]/25" />
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#16100c] via-[#16100c]/78 to-transparent" />

            <div className="relative flex min-h-[22rem] flex-col justify-between p-6 sm:p-9 md:min-h-[27rem]">
              <div className="flex items-start justify-between gap-4">
                <BrandHomeLink tone="dark" />
                <Link
                  href="/"
                  className="text-sm font-medium text-[rgba(250,246,239,0.9)] transition-colors hover:text-white"
                >
                  Back to the guide →
                </Link>
              </div>
              <div className="max-w-2xl pt-10">
                <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(231,183,174,0.55)] bg-black/35 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#E7B7AE] backdrop-blur-sm">
                  For villas · boutique stays
                </span>
                <h1 className="hero-title mt-4 text-[#FAF6EF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  Partner your villa with Other Bali.
                </h1>
                <p className="hero-copy max-w-xl text-[#FAF6EF] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]">
                  Get discovered by more travellers, and give every guest a
                  better Bali. They reach you directly — website, WhatsApp or
                  booking page — and your guests get one trusted local guide.
                  Completely free, as a simple partnership.
                </p>
                <div className="hero-actions" style={{ marginTop: 22 }}>
                  <a
                    href={VILLAS_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-primary button-large"
                  >
                    Add your villa — it&apos;s free
                  </a>
                  <a
                    href="#how"
                    className="button-large inline-flex items-center justify-center rounded-lg border border-[rgba(250,246,239,0.5)] px-4 font-extrabold text-[#FAF6EF] transition-colors hover:bg-white/10"
                  >
                    See how it works
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "For villas" }]} />

        {/* Trust chips. */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {CHIPS.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4"
            >
              <p className="font-bold">{c.title}</p>
              <p className="mt-1 text-sm text-[var(--muted)]">{c.note}</p>
            </div>
          ))}
        </div>

        {/* The barter, both directions visible at once — that's the whole deal. */}
        <section className="guide-section">
          <h2>A partnership that works both ways</h2>
          <p className="guide-lede">
            No fees, no commission, no booking-volume promises. We grow together:
            travellers find you through us — your guests discover Bali through you.
            Travellers never pay.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <p className="guide-kicker" style={{ marginBottom: 6 }}>
                What you get from us
              </p>
              <ul className="guide-prose text-sm">
                {YOU_GET.map((t) => (
                  <li key={t} style={{ marginBottom: 8 }}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--tint-best-line)] bg-[var(--tint-best-bg)] p-5">
              <p className="guide-kicker" style={{ marginBottom: 6 }}>
                What we ask in return
              </p>
              <ul className="guide-prose text-sm">
                {WE_ASK.map((t) => (
                  <li key={t} style={{ marginBottom: 8 }}>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-[var(--muted)]">
                That&apos;s the whole exchange — no fees on either side.
              </p>
            </div>
          </div>
        </section>

        {/* Villa film — a prominent photo-forward block. The page leads with a
            short walkthrough and photos, not paragraphs. Dark self-contained
            band; the player renders only once the film is present. */}
        <section className="guide-section" id="film">
          <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[rgba(22,16,12,0.35)]">
            <div className="relative min-h-[26rem] md:min-h-[30rem]">
              <SceneImage scene="human-dusk" variant="night" imgClassName="ob-grade" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16100c] via-[#16100c]/70 to-[#16100c]/30" />
              <div className="relative flex min-h-[26rem] flex-col justify-between gap-8 p-6 sm:p-9 md:min-h-[30rem]">
                <div className="max-w-xl">
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#E7B7AE]">
                    Villa film
                  </p>
                  <p
                    className="mt-3 text-[#FAF6EF]"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(26px, 4.5vw, 42px)",
                      lineHeight: 1.04,
                    }}
                  >
                    Your villa page carries photos and a short film — not
                    paragraphs.
                  </p>
                  <p className="mt-3 max-w-md text-sm text-[rgba(250,246,239,0.86)]">
                    A 20–30 second walkthrough and your own gallery do the work.
                    Below, a short film on how the partnership works.
                  </p>
                </div>

                {filmReady ? (
                  <figure className="overflow-hidden rounded-2xl border border-[rgba(250,246,239,0.25)] bg-black/30">
                    {/* Click-to-play; subtitles are burned in so it reads muted. */}
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      src="/scenes/villas-film.mp4"
                      poster="/scenes/moment-morning.webp"
                      className="block w-full"
                      aria-label="Other Bali for villas — how the partnership works"
                    />
                    <figcaption className="px-4 py-2 text-xs text-[rgba(250,246,239,0.72)]">
                      How Other Bali works with villas — in under a minute. Sound
                      on 🔊
                    </figcaption>
                  </figure>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-[rgba(250,246,239,0.25)] bg-black/25 px-5 py-4">
                    <span
                      aria-hidden="true"
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[rgba(250,246,239,0.55)] text-lg text-[#FAF6EF]"
                    >
                      ▶
                    </span>
                    <p className="text-sm text-[rgba(250,246,239,0.86)]">
                      A short film on how we partner with villas is on its way —
                      it&apos;ll live right here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why villas join — three cards, each led by an atmospheric scene. */}
        <section className="guide-section">
          <h2>Why villas join</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal
                as="article"
                key={w.title}
                delay={i * 80}
                className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)]"
              >
                <div className="relative h-40 overflow-hidden">
                  <SceneImage
                    scene={w.scene}
                    variant={w.variant}
                    imgClassName="ob-grade"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16100c]/45 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold">{w.title}</h3>
                  <p className="mt-2 text-sm text-[var(--muted)]">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* The exchange, rendered as a directional flow over a cinematic band. */}
        <section className="guide-section" id="exchange">
          <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-3xl sm:border sm:border-[rgba(22,16,12,0.35)]">
            <div className="relative">
              <SceneImage scene="hero-sunset" variant="sunset" imgClassName="ob-grade" />
              <div className="absolute inset-0 bg-[#16100c]/72" />
              <div className="relative p-6 sm:p-9">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#E7B7AE]">
                  The exchange
                </p>
                <h2
                  className="mt-3 text-[#FAF6EF]"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 38px)", lineHeight: 1.05 }}
                >
                  A partnership that works in both directions.
                </h2>
                <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  {EXCHANGE.map((step, i) => (
                    <li
                      key={step.label}
                      className="rounded-2xl border border-[rgba(250,246,239,0.22)] bg-black/25 p-4"
                    >
                      <span className="text-xs font-extrabold text-[#E7B7AE]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-1 font-bold text-[#FAF6EF]">{step.label}</p>
                      <p className="mt-1 text-xs text-[rgba(250,246,239,0.78)]">
                        {step.note}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="mt-5 text-sm text-[rgba(250,246,239,0.82)]">
                  Travellers arrive through us; your guests discover Bali through
                  you. No fees on either side.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Self-fill flow — owners add their own villa; we review and publish. */}
        <section className="guide-section" id="how">
          <h2>How it works</h2>
          <ol className="guide-prose" style={{ marginTop: 12 }}>
            {STEPS.map((s) => (
              <li key={s.title} style={{ marginBottom: 10 }}>
                <strong>{s.title}.</strong> {s.body}
              </li>
            ))}
          </ol>
        </section>

        <section className="guide-section">
          <h2>You stay in control</h2>
          <div className="guide-prose">
            <ul>
              <li>
                <strong>You approve before publication.</strong> You fill it in,
                we polish it; nothing goes live until you confirm it.
              </li>
              <li>
                <strong>All the links belong to you.</strong> Travellers connect
                directly with your own booking or contact channel — no marketplace
                checkout in between.
              </li>
              <li>
                <strong>Update any time, no lock-in.</strong> Change details or
                pause the listing whenever you like.
              </li>
              <li>
                <strong>No automatic charges.</strong> This is a free partnership,
                not a subscription — travellers never pay either.
              </li>
              <li>
                <strong>An additional channel, honestly.</strong> We don&apos;t
                promise booking volume — we add a direct way for travellers to
                find and reach you.
              </li>
            </ul>
          </div>
        </section>

        <section className="guide-section" id="join">
          <h2>Join the villa partner network</h2>
          <p className="guide-lede">
            You add your details and your own photos, we review and polish, and
            once you approve, your villa is discoverable. It takes a few minutes.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <a
              href={VILLAS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary button-large"
            >
              Add your villa on WhatsApp
            </a>
            <a
              href={VILLAS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary button-large"
            >
              WhatsApp {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </div>
          <p className="mt-3 text-xs text-[var(--muted)]">
            Send your villa details and a few of your own photos — we&apos;ll
            polish the page and send it back for your approval before anything is
            published.
          </p>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
