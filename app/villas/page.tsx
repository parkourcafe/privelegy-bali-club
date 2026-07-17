import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { GuideFooter } from "@/components/GuideBlocks";
import { VILLAS_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Public villa partner page (2026-07-17). Villas are a barter partnership, not a
// monetised tier: we prepare and host the villa's page and send guests to their
// own channels directly; in return they link Other Bali (site + Instagram + an
// in-villa QR card). No fees either way, no booking-volume promises, no new DB
// entity — the "join" action is a WhatsApp handoff, reviewed by hand. Indexable:
// villa managers search "list my villa Bali guide". Guardrails: no payment, no
// marketplace checkout, owner approves before anything publishes.

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

const WHY = [
  {
    title: "Additional direct discovery",
    body: "Travellers find your villa here and continue straight to your website, WhatsApp or booking page.",
  },
  {
    title: "A concierge for your guests",
    body: "One trusted link for restaurants, beaches, wellness, activities and delivery — picked by residents.",
  },
  {
    title: "A better guest experience",
    body: "Fewer repeat questions at reception, faster guest decisions — no concierge platform to build.",
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

export default function VillasPage() {
  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="villas" />
        <div className="flex items-start justify-between">
          <BrandHomeLink />
          <Link href="/" className="quiet-link">
            Back to the guide →
          </Link>
        </div>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "For villas" }]} />

        <header className="guide-hero">
          <p className="guide-kicker">For villas · boutique stays</p>
          <h1 className="guide-title">Partner your villa with Other Bali.</h1>
          <p className="guide-standfirst">
            Get discovered by more travellers, and give every guest a better Bali
            experience. Travellers reach you directly — website, WhatsApp or
            booking page — and your guests get one trusted local guide.
            Completely free, as a simple partnership.
          </p>
          <div className="hero-actions" style={{ marginTop: 18 }}>
            <a
              href={VILLAS_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary button-large"
            >
              Add your villa — it&apos;s free
            </a>
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
        </header>

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

        <section className="guide-section">
          <h2>Why villas join</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {WHY.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5"
              >
                <h3 className="text-lg font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{w.body}</p>
              </div>
            ))}
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
