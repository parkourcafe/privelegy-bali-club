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

// Public villa partner page (2026-07-17, photo-forward rebuild to match the
// founder's standalone mockup). Villas are a barter partnership, not a
// monetised tier: managers add their own details and photos, we review and
// publish, and travellers reach the villa directly; in return they link Other
// Bali (site + Instagram + an in-villa QR card). No fees either way, no
// booking-volume promises, no new DB entity — the "join" action is a WhatsApp
// handoff reviewed by hand.
//
// Product proof: the page SHOWS what an owner receives — an example listing
// card, the traveller action row, the guest concierge link and a "what your
// villa receives" checklist — so the value is visible, not just described.
// The demo venue ("Villa Kamala") is labelled an EXAMPLE everywhere it appears
// so it is never mistaken for a live listing (guardrail #10 — no invented
// content presented as real). The cinematic scene set (SVG art + build-fetched
// Higgsfield stills) is ATMOSPHERE ONLY — never a photo of a specific villa
// (editorial guardrail). Guardrails: no payment, no marketplace checkout, owner
// approves before anything publishes.

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

// The traveller action row that appears on a real villa page — shown here as
// product proof of what a page does. Presentational only on this page.
const EXAMPLE_ACTIONS = [
  { label: "Visit website", glyph: "↗" },
  { label: "WhatsApp", glyph: "◆" },
  { label: "Book direct", glyph: "▤" },
  { label: "Directions", glyph: "▸" },
  { label: "Request info", glyph: "✎" },
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
    body: "Travellers find you here — and continue straight to your site, WhatsApp or booking page.",
    scene: "moment-morning",
    variant: "ridge",
  },
  {
    title: "Digital concierge for guests",
    body: "One trusted link for restaurants, beaches, wellness, activities and delivery.",
    scene: "human-dusk",
    variant: "night",
  },
  {
    title: "Better guest experience",
    body: "Fewer repeat questions, faster guest decisions — no concierge platform to build.",
    scene: "moment-dinner",
    variant: "sunset",
  },
];

// The barter, stated symmetrically so the whole deal is visible at a glance.
const YOU_GET = [
  "A dedicated villa page with your photos, description and direct links.",
  "Travellers who reach you directly — no marketplace, no commission.",
  "A personalised guest QR — one link for restaurants, beaches, wellness.",
];
const WE_ASK = [
  "A link to Other Bali on your villa website.",
  "A mention of Other Bali on your Instagram.",
  "Our QR on your welcome / Wi-Fi card in the villa.",
];

// The barter as a directional flow — travellers arrive through us, guests
// discover Bali through you.
const EXCHANGE = [
  { label: "Travellers on Other Bali", note: "planning where to stay" },
  { label: "Discover & enquire", note: "your page, your links" },
  { label: "Your villa", note: "website · WhatsApp · direct booking" },
  { label: "Share the guide", note: "QR on the welcome card" },
  { label: "Your current guests", note: "one trusted local guide" },
];

// Everything a partner villa receives — product proof, shown as a checklist.
const RECEIVES = [
  "A dedicated villa page",
  "Official website link",
  "WhatsApp contact button",
  "Direct booking link",
  "Google Maps link",
  "Placement in areas & collections",
  "Personalised guest QR code",
  "Guest welcome link",
  "Photo & info updates",
  "Early partner visibility",
];

const CONCIERGE_WHERE = [
  "Reception card",
  "In-room card",
  "Wi-Fi card",
  "Digital guest book",
  "Pre-arrival message",
];
const CONCIERGE_WHY = [
  "Fewer repeat questions at reception.",
  "Recommendations ready before guests ask.",
  "One link, not many messages.",
];

const WHO = [
  "Independent villas & boutique stays",
  "Villa management companies & serviced villas",
  "Small hospitality groups (1–20 properties)",
  "Legal accommodation businesses seeking more direct visibility",
  "Operators who care about guest experience",
];

const CONTROL = [
  "You approve before publication",
  "All links belong to you",
  "Update any time",
  "No automatic charges",
  "No lock-in",
  "Your guest relationship stays yours",
];

const STEPS = [
  {
    title: "You add your villa",
    body: "Send your details and your own photos — right on WhatsApp. You fill it in, so the page is genuinely yours.",
  },
  {
    title: "We review and polish",
    body: "We tidy wording and layout — never invent facts or add photos you didn't send.",
  },
  {
    title: "You approve, we publish",
    body: "Nothing goes live until you confirm — all links stay yours.",
  },
  {
    title: "Share the guide with guests",
    body: "A QR code, welcome link or check-in message — one trusted local guide for their stay.",
  },
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
                  For villas · boutique stays · villa managers
                </span>
                <h1 className="hero-title mt-4 text-[#FAF6EF] drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  Get discovered by more travellers. Give every guest a better
                  Bali.
                </h1>
                <p className="hero-copy max-w-xl text-[#FAF6EF] drop-shadow-[0_2px_14px_rgba(0,0,0,0.92)]">
                  Travellers reach you directly — website, WhatsApp or booking
                  page — and your guests get one trusted local guide.
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

        {/* PRODUCT PROOF — this is your villa on Other Bali. An example listing
            card + the traveller action row, so an owner sees exactly what they
            receive. "Villa Kamala" is a labelled EXAMPLE, not a live listing. */}
        <section className="guide-section" id="example">
          <h2>This is your villa on Other Bali</h2>
          <p className="guide-lede">
            A real page with your photos and your own links — travellers reach
            you directly. Here&apos;s how it looks.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {/* The listing card as it appears in the guide. */}
            <figure className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)]">
              <div className="relative h-52 overflow-hidden">
                <SceneImage scene="district-canggu" variant="ridge" imgClassName="ob-grade" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16100c]/45 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#FAF6EF] backdrop-blur-sm">
                  Example
                </span>
              </div>
              <figcaption className="p-5">
                <h3 className="text-lg font-bold">Villa Kamala</h3>
                <p className="text-sm text-[var(--muted)]">Umalas · 3 BR</p>
                <p className="mt-2 text-sm">
                  Staffed pool villa between the rice fields, 10 min to Berawa.
                </p>
                <div className="mt-4 flex flex-wrap gap-2" aria-hidden="true">
                  {["Book direct", "WhatsApp", "Visit website", "View location"].map(
                    (a) => (
                      <span
                        key={a}
                        className="rounded-lg border border-[var(--line)] bg-[var(--paper)] px-3 py-1.5 text-xs font-bold text-[var(--ink)]"
                      >
                        {a}
                      </span>
                    )
                  )}
                </div>
              </figcaption>
            </figure>

            {/* The full action row + the honest framing. */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <h3 className="text-lg font-bold">
                Help travellers reach you directly
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Your page sends travellers to your channels — no marketplace
                checkout in between.
              </p>
              <div className="mt-4 grid gap-2" aria-hidden="true">
                {EXAMPLE_ACTIONS.map((a) => (
                  <div
                    key={a.label}
                    className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--paper)] px-4 py-3"
                  >
                    <span className="font-bold text-[var(--ink)]">{a.label}</span>
                    <span className="text-[var(--lagoon-strong)]">{a.glyph}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">
                Other Bali provides an additional discovery channel and does not
                guarantee booking volume. Travellers never pay.
              </p>
            </div>
          </div>
        </section>

        {/* The barter, both directions visible at once — that's the whole deal. */}
        <section className="guide-section" id="what-you-get">
          <h2>A partnership that works both ways</h2>
          <p className="guide-lede">
            No fees, no commission, no booking-volume promises. Travellers find
            you through us — your guests discover Bali through you. Travellers
            never pay.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <p className="guide-kicker" style={{ marginBottom: 6 }}>
                What you get from us
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {YOU_GET.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--lagoon-strong)]">
                      →
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-[var(--tint-best-line)] bg-[var(--tint-best-bg)] p-5">
              <p className="guide-kicker" style={{ marginBottom: 6 }}>
                What we ask in return
              </p>
              <ul className="mt-2 space-y-2 text-sm">
                {WE_ASK.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--lagoon-strong)]">
                      ←
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[var(--muted)]">
                That&apos;s the whole exchange — no fees on either side, and
                travellers never pay.
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

        {/* What your villa receives — the full product, as a checklist. */}
        <section className="guide-section" id="receives">
          <h2>What your villa receives</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RECEIVES.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon)] text-[11px] font-bold text-white"
                >
                  ✓
                </span>
                <span className="text-sm font-medium">{item}</span>
              </div>
            ))}
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-soft)] p-4">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--line)] text-[11px] text-[var(--muted)]"
              >
                ◦
              </span>
              <span className="text-sm font-medium text-[var(--muted)]">
                Performance reporting{" "}
                <span className="ml-1 rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">
                  planned
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Guest concierge — the one link guests will actually use. */}
        <section className="guide-section" id="concierge">
          <h2>Guest concierge</h2>
          <p className="guide-lede">
            One link your guests will actually use — restaurants, beaches,
            wellness and activities, selected by people who live here.
          </p>
          <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Guest welcome demo — clearly an example. */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <div className="flex items-center justify-between">
                <p className="guide-kicker">Guest welcome link</p>
                <span className="rounded-full bg-[var(--paper)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[var(--muted)]">
                  Example
                </span>
              </div>
              <div className="mt-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
                <p className="text-sm">
                  Welcome to Bali 🌴 Here&apos;s your local guide for the stay —
                  places we&apos;d send our own friends to.
                </p>
                <p className="mt-2 text-sm font-bold text-[var(--lagoon-strong)]">
                  otherbali.com/g/villa-kamala
                </p>
                <p className="mt-1 text-right text-[11px] text-[var(--muted)]">
                  09:14 ✓✓
                </p>
              </div>
              <p className="mt-3 text-xs text-[var(--muted)]">
                A sample guest message — your real link is personalised to your
                villa.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                <p className="guide-kicker" style={{ marginBottom: 8 }}>
                  Where it lives
                </p>
                <ul className="space-y-1.5 text-sm">
                  {CONCIERGE_WHERE.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span aria-hidden="true" className="text-[var(--lagoon-strong)]">
                        ·
                      </span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                <p className="guide-kicker" style={{ marginBottom: 8 }}>
                  Why villas do it
                </p>
                <ul className="space-y-1.5 text-sm">
                  {CONCIERGE_WHY.map((w) => (
                    <li key={w} className="flex gap-2">
                      <span aria-hidden="true" className="text-[var(--lagoon-strong)]">
                        ·
                      </span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Self-fill flow — owners add their own villa; we review and publish. */}
        <section className="guide-section" id="how">
          <h2>How it works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5"
              >
                <span className="text-xs font-extrabold uppercase tracking-wide text-[var(--lagoon-strong)]">
                  Step {i + 1}
                </span>
                <h3 className="mt-2 text-base font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who this is for. */}
        <section className="guide-section" id="who">
          <h2>Who this is for</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {WHO.map((w) => (
              <div
                key={w}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4"
              >
                <span aria-hidden="true" className="mt-0.5 text-[var(--lagoon-strong)]">
                  ◆
                </span>
                <span className="text-sm font-medium">{w}</span>
              </div>
            ))}
          </div>
        </section>

        {/* You stay in control. */}
        <section className="guide-section" id="control">
          <h2>You remain in control</h2>
          <p className="guide-lede">
            Guests connect directly with your preferred booking or contact
            channel.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CONTROL.map((c) => (
              <div
                key={c}
                className="flex items-start gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon)] text-[11px] font-bold text-white"
                >
                  ✓
                </span>
                <span className="text-sm font-medium">{c}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Join CTA — WhatsApp self-fill handoff, reviewed by hand. */}
        <section className="guide-section" id="join">
          <h2>Join the Other Bali villa partner network</h2>
          <p className="guide-lede">
            Send it on WhatsApp — two minutes. You add your details and your own
            photos, we review and polish, and once you approve, your villa is
            discoverable.
          </p>
          <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
            <p className="guide-kicker" style={{ marginBottom: 8 }}>
              What to send
            </p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-[var(--lagoon-strong)]">·</span>
                <span>Villa name &amp; area</span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-[var(--lagoon-strong)]">·</span>
                <span>
                  Short description + your links (website · booking · Instagram)
                </span>
              </li>
              <li className="flex gap-2">
                <span aria-hidden="true" className="text-[var(--lagoon-strong)]">·</span>
                <span>A few of your own photos 📷</span>
              </li>
            </ul>
          </div>
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
            We&apos;ll polish the page and send it back for your approval before
            anything is published — travellers never pay, and there are no fees
            on your side.
          </p>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
