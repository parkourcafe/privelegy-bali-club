import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import TrackedOutboundLink from "@/components/TrackedOutboundLink";
import { GuideFooter } from "@/components/GuideBlocks";
import { HOTELS_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Public hotel partner page (2026-07-20) — the hotel counterpart to /villas.
// Same barter model: we prepare and host the hotel's page and send guests to
// their own channels directly; in return the hotel links Other Bali (site +
// Instagram + an in-hotel QR card). PARTNER / barter, no money: no fees either
// way, no commission, no booking-volume promises, travellers never pay. No new
// DB entity — "join" is a hand-reviewed WhatsApp handoff. Unlike the villa deal,
// a hotel carries facilities (restaurant, pool, spa, day pass) worth discovering
// on their own, so this page bridges to the existing F&B/beach-club guides.
// Guardrails: no payment, no marketplace checkout, owner approves before
// publish, and NO invented content — the sample-hotel card from the mockup is
// deliberately NOT reproduced; photos are honest empty placeholders (§5).

export const metadata: Metadata = {
  title: "Partner your hotel with Other Bali",
  description:
    "Hotel, resort or boutique property in Bali? Partner with Other Bali, the resident-curated guide. You add your own details and photos, we review and publish, and travellers reach you directly — for your rooms and your restaurant, pool, spa and day pass. Completely free.",
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "Partner your hotel with Other Bali",
    description:
      "Get discovered by more travellers — for your rooms and your restaurant, pool, spa and day pass. Add your own details and photos, we review and publish, travellers reach you directly. Completely free.",
    url: "https://www.otherbali.com/hotels",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Partner your hotel with Other Bali",
    description:
      "Partner with Other Bali — you add your details and photos, we review and publish. Completely free, no commission, travellers never pay.",
  },
};

const CHIPS = [
  { title: "Completely free", note: "a simple partnership, no fees" },
  { title: "Direct, no middleman", note: "guests reach you, not a marketplace" },
  { title: "You approve first", note: "nothing publishes without you" },
];

// Honest empty placeholder slots — real photos arrive later from the hotel via
// Supabase Storage. Never stock, AI or another venue's image (§5, guardrail #10).
const PHOTO_SLOTS = [
  { label: "Hotel cover", ratio: "aspect-[16/10]" },
  { label: "Hotel gallery — pool", ratio: "aspect-[4/3]" },
  { label: "Hotel film — 30s", ratio: "aspect-[4/3]" },
];

const YOU_GET = [
  "A dedicated hotel page with your photos, description and direct links",
  "Travellers who reach you directly — no marketplace, no commission",
  "A personalised guest QR — one link for restaurants, beaches, wellness",
];
const WE_ASK = [
  "A link to Other Bali on your hotel website",
  "A mention of Other Bali on your Instagram",
  "Our QR on your welcome / Wi-Fi card in the hotel",
];

const STEPS = [
  {
    title: "You add your hotel",
    body: "Fill the short form on this page with your details and your own photos (ones you have the rights to share). You fill it in, so the page is genuinely yours.",
  },
  {
    title: "We review and polish",
    body: "We tidy the wording and layout, and check everything reads right. We never invent facts or add photos you didn't send.",
  },
  {
    title: "You approve, we publish",
    body: "We send it back for a look. Nothing goes live until you confirm — and all your links stay yours.",
  },
  {
    title: "Share the guide with guests",
    body: "A QR code, welcome link or check-in message — one trusted local guide for their whole stay.",
  },
];

const RECEIVES = [
  "A dedicated hotel page",
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

const WHO_FOR = [
  "Independent hotels & boutique stays",
  "Hotel management companies & serviced hotels",
  "Small hospitality groups (1–20 properties)",
  "Legal accommodation businesses seeking more direct visibility",
  "Operators who care about guest experience",
];

const CONTROL = [
  {
    title: "You approve before publication",
    body: "You fill it in, we polish it; nothing goes live until you confirm it.",
  },
  {
    title: "All links belong to you",
    body: "Travellers connect directly with your own booking or contact channel — no marketplace checkout in between.",
  },
  {
    title: "Update any time",
    body: "Change details or pause the listing whenever you like — no lock-in.",
  },
  {
    title: "No automatic charges",
    body: "This is a free partnership, not a subscription — travellers never pay either.",
  },
  {
    title: "Your guest relationship stays yours",
    body: "We add a discovery channel; we don't step between you and your guests.",
  },
];

export default function HotelsPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="hotels" />
        <div className="flex items-start justify-between">
          <BrandHomeLink />
          <Link href="/" className="quiet-link">
            Back to the guide →
          </Link>
        </div>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "For hotels" }]} />

        <header className="guide-hero">
          <p className="guide-kicker">For hotels · resorts · boutique properties</p>
          <h1 className="guide-title">Partner your hotel with Other Bali.</h1>
          <p className="guide-standfirst">
            Get discovered by more travellers — for your rooms and your
            restaurant, pool, spa and day pass — and give every guest a better
            Bali experience. Completely free, as a simple partnership.
          </p>
          <div className="hero-actions" style={{ marginTop: 18 }}>
            <Link href="/list-your-property?type=hotel" className="button-primary button-large">
              Add your hotel — it&apos;s free
            </Link>
            <a href="#how" className="button-secondary button-large">
              See how it works
            </a>
          </div>
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

          {/* Honest placeholder slots — the hotel's own photos land here after
              they send them; we never fill these with stock or invented images. */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {PHOTO_SLOTS.map((slot) => (
              <div
                key={slot.label}
                className={`${slot.ratio} flex items-center justify-center rounded-2xl border border-dashed border-[var(--line)] bg-[var(--paper-warm)] p-4 text-center`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                  {slot.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-[var(--muted)]">
            Your own photos and a short film go here — you send them, we never add
            our own.
          </p>
        </header>

        {/* The barter, both directions visible at once — that's the whole deal. */}
        <section className="guide-section">
          <h2>A partnership that works in both directions</h2>
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
                That&apos;s the whole exchange — no fees on either side, and
                travellers never pay.
              </p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Why hotels join</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <h3 className="text-lg font-bold">Additional direct discovery</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Travellers find you here and continue straight to your website,
                WhatsApp or booking page.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <h3 className="text-lg font-bold">Digital concierge for guests</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                One trusted link for restaurants, beaches, wellness, activities and
                delivery — picked by residents.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
              <h3 className="text-lg font-bold">Better guest experience</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Fewer repeat questions at reception, faster guest decisions — no
                concierge platform to build.
              </p>
            </div>
          </div>

          {/* F&B bridge: link the hotel-facility mentions to guides that ALREADY
              exist in this repo (verified 2026-07-20). "Day pass" links to the
              real /bali-resort-day-passes hub — the original ticket assumed no
              day-pass route existed and asked for a plain-text TODO, but the
              resort-day-passes editorial hub now ships, so linking it beats
              sending readers nowhere (flagged in the PR for Selena). */}
          <div className="mt-4 rounded-2xl border border-[var(--tint-best-line)] bg-[var(--tint-best-bg)] p-5">
            <h3 className="text-lg font-bold">
              Your restaurant, pool &amp; day pass get found too
            </h3>
            <p className="mt-2 text-sm text-[var(--tint-best-text)]">
              Unlike a villa, a hotel has facilities worth discovering on their
              own. Run a{" "}
              <Link href="/best-restaurants-in-bali" className="font-semibold">
                restaurant
              </Link>
              ,{" "}
              <Link href="/canggu/best-brunch" className="font-semibold">
                Sunday brunch
              </Link>
              ,{" "}
              <Link href="/bali-resort-day-passes" className="font-semibold">
                day pass
              </Link>
              ,{" "}
              <Link href="/best-spas-in-bali" className="font-semibold">
                spa
              </Link>{" "}
              or{" "}
              <Link href="/best-beach-clubs-in-bali" className="font-semibold">
                beach club
              </Link>
              ? We send our guides&apos; readers straight to it — you&apos;re found
              for your rooms and everything around the pool.
            </p>
          </div>
        </section>

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
          <h2>What your hotel receives</h2>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {RECEIVES.map((r) => (
              <li key={r} className="flex items-start gap-2 text-[var(--ink)]">
                <span aria-hidden className="text-[var(--lagoon-strong)]">
                  ✓
                </span>
                {r}
              </li>
            ))}
            <li className="flex items-start gap-2 text-[var(--muted)]">
              <span aria-hidden className="text-[var(--muted)]">
                ○
              </span>
              Performance reporting{" "}
              <span className="text-xs font-semibold uppercase tracking-wide">
                (planned)
              </span>
            </li>
          </ul>
        </section>

        <section className="guide-section">
          <h2>Who this is for</h2>
          <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            {WHO_FOR.map((w) => (
              <li key={w} className="flex items-start gap-2 text-[var(--ink)]">
                <span aria-hidden className="text-[var(--lagoon-strong)]">
                  ·
                </span>
                {w}
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>You remain in control</h2>
          <div className="guide-prose">
            <ul>
              {CONTROL.map((c) => (
                <li key={c.title}>
                  <strong>{c.title}.</strong> {c.body}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Primary "join" path is the property intake form at /list-your-property
            — NOT WhatsApp. WhatsApp stays only as the secondary "prefer to ask a
            question first?" link below. */}
        <section className="guide-section" id="add">
          <h2>Add your hotel</h2>
          <p className="guide-lede">
            Tell us about your hotel — rooms, facilities and your own links. We
            review and polish the page, and nothing goes live until you approve
            it. It takes a few minutes — no fees, and travellers never pay.
          </p>
          <div className="hero-actions" style={{ marginTop: 16 }}>
            <Link href="/list-your-property?type=hotel" className="button-primary button-large">
              Add your hotel — it&apos;s free
            </Link>
          </div>
          {/* "View an example hotel page →" intentionally omitted until a real
              hotel /places/[slug] exists (ticket §3: link it once one ships,
              otherwise omit — never link a 404). */}
          <p className="mt-4 text-sm text-[var(--muted)]">
            Other Bali provides an additional discovery channel and does not
            guarantee booking volume.
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">
            Prefer to ask a question first?{" "}
            <TrackedOutboundLink
              href={HOTELS_WHATSAPP_URL}
              event="whatsapp_guide_click"
              label="hotels_secondary_whatsapp"
              className="font-bold text-[var(--lagoon-strong)]"
            >
              Message us on WhatsApp {WHATSAPP_NUMBER_DISPLAY}
            </TrackedOutboundLink>
            .
          </p>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
