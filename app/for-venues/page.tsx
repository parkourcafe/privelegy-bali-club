import type { Metadata } from "next";
import Link from "next/link";
import BrandHomeLink from "@/components/BrandHomeLink";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import VenueSubmissionForm from "@/components/VenueSubmissionForm";
import { GuideFooter } from "@/components/GuideBlocks";
import { existsSync } from "node:fs";
import path from "node:path";
import { VENUES_WHATSAPP_URL, WHATSAPP_NUMBER_DISPLAY } from "@/lib/contact";

// Public venue self-submission page. This is a secondary operator/B2B route,
// not a traveller-primary homepage path. It should explain how a Bali venue can
// request a curated Other Bali page, update official facts and media, and keep
// the editorial boundary clear: no automatic listing, no paid ranking, no
// guaranteed visits or bookings from intent clicks.

export const metadata: Metadata = {
  title: { absolute: "List your Bali venue on Other Bali" },
  description:
    "Run a café, restaurant, warung, spa, bar, beach club or studio in Bali? Request a curated Other Bali page with official details, photos, video and verified action links.",
  alternates: { canonical: "/for-venues" },
  openGraph: {
    title: "List your Bali venue · Other Bali",
    description:
      "Request a curated Other Bali page for your café, restaurant, bar, beach club, spa or studio. Editorial order cannot be bought.",
    url: "https://www.otherbali.com/for-venues",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "List your Bali venue · Other Bali",
    description:
      "Request a curated Other Bali page with official venue details, media and verified action links.",
  },
};

const PROOF_CHIPS = [
  { title: "Free pilot review", note: "no card, no automatic charge" },
  { title: "Travellers never pay", note: "Other Bali stays free for visitors" },
  { title: "Editorial order", note: "placement and ranking cannot be bought" },
];

const VENUE_PAGE_ITEMS = [
  "Photos and short video you have rights to use",
  "Hours, area, menu source and official contact channels",
  "Maps, WhatsApp, booking, delivery or takeaway handoff when confirmed",
  "Clear fit context so travellers know when your place is right",
];

const STEPS = [
  {
    label: "01",
    title: "Send official basics",
    body: "Share the place name, area, website, Instagram, WhatsApp and email. If we already prepared a page for you, use the private confirmation link instead.",
  },
  {
    label: "02",
    title: "We review the fit",
    body: "Other Bali is curated, not an open directory. A request starts review; it does not guarantee publication or paid placement.",
  },
  {
    label: "03",
    title: "Confirm the page",
    body: "If it is a fit, we build or update the page and ask you to confirm facts, current media and photo/video rights before anything changes publicly.",
  },
  {
    label: "04",
    title: "Travellers take the next action",
    body: "They can save the place, open Maps or follow verified official handoffs. A click shows intent; it is not reported as a guaranteed booking, visit or sale.",
  },
];

const OWNER_PATHS = [
  {
    title: "We already messaged you",
    body: "Open the private link, check the drafted page, add current media or menu sources, then submit it for final review.",
    cta: "Ask for the private link",
    href: VENUES_WHATSAPP_URL,
    external: true,
  },
  {
    title: "You are not listed yet",
    body: "Send the official details through the form. We will check whether the place fits the guide and contact you if we can prepare a page.",
    cta: "Request a listing",
    href: "#submit",
  },
];

const GOOD_TO_KNOW = [
  "A request is reviewed by hand and is not an automatic listing.",
  "Organic order and editorial fit cannot be bought.",
  "We only publish photos or video you send and confirm you have rights to use.",
  "Aggregate clicks can be reported as intent only, not guaranteed visits or revenue.",
  "If your page already exists, use the private confirmation link instead of submitting twice.",
];

function MiniPagePreview() {
  return (
    <div className="rounded-[2rem] border border-[var(--line)] bg-white p-4 shadow-[0_18px_50px_rgba(43,26,19,0.12)]">
      <div className="overflow-hidden rounded-[1.5rem] bg-[var(--lagoon)] text-white">
        <div className="h-36 bg-[linear-gradient(135deg,#005962,#e08a5e)]" />
        <div className="space-y-3 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">
            Other Bali page preview
          </p>
          <h2 className="text-2xl font-black leading-tight">Your place, ready for the right moment.</h2>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded-full bg-white/14 px-3 py-1">Best for sunset</span>
            <span className="rounded-full bg-white/14 px-3 py-1">Official WhatsApp</span>
            <span className="rounded-full bg-white/14 px-3 py-1">Maps handoff</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between rounded-2xl bg-[var(--paper-soft)] px-3 py-2">
          <span>Photos</span>
          <strong>owner confirmed</strong>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--paper-soft)] px-3 py-2">
          <span>Menu / hours</span>
          <strong>reviewed</strong>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-[var(--paper-soft)] px-3 py-2">
          <span>Actions</span>
          <strong>verified links</strong>
        </div>
      </div>
    </div>
  );
}

export default function ForVenuesPage() {
  // The narrated story ships via the prebuild scene fetch; in environments
  // where the CDN is unreachable the file is absent and the page still renders
  // with a static product preview. Production currently serves the video.
  const storyReady = existsSync(
    path.join(process.cwd(), "public", "scenes", "venues-story.mp4"),
  );

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug="for-venues" />
        <div className="flex items-start justify-between gap-4">
          <BrandHomeLink />
          <Link href="/" className="quiet-link">
            Back to the guide →
          </Link>
        </div>

        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Add your place" }]} />

        <header className="guide-hero">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-center">
            <div>
              <p className="guide-kicker">For venues · free pilot review</p>
              <h1 className="guide-title">Get your Bali venue page ready for travellers.</h1>
              <p className="guide-standfirst">
                Other Bali helps travellers choose where to go, not scroll through
                endless listings. Send your official details, photos and action
                links so we can review whether your place fits the guide.
              </p>
              <div className="hero-actions" style={{ marginTop: 18 }}>
                <a href="#submit" className="button-primary button-large">
                  Request a listing
                </a>
                <a href="#how-it-works" className="button-secondary button-large">
                  See how it works
                </a>
              </div>
              <p className="mt-4 text-sm text-[var(--muted)]">
                Already received a private page link? Use that link to confirm
                details faster, or WhatsApp us at{" "}
                <a
                  href={VENUES_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--lagoon-strong)]"
                >
                  {WHATSAPP_NUMBER_DISPLAY}
                </a>
                .
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {PROOF_CHIPS.map((c) => (
                  <div
                    key={c.title}
                    className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4"
                  >
                    <p className="font-bold">{c.title}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{c.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {storyReady ? (
              <figure className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white shadow-[0_18px_50px_rgba(43,26,19,0.12)]">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  src="/scenes/venues-story.mp4"
                  className="block w-full"
                  aria-label="Other Bali for venues — a 35-second introduction"
                />
                <figcaption className="px-4 py-3 text-sm text-[var(--muted)]">
                  Other Bali in 35 seconds — what travellers see, and what your
                  place gets. Sound on 🔊
                </figcaption>
              </figure>
            ) : (
              <MiniPagePreview />
            )}
          </div>
        </header>

        <section className="guide-section" aria-labelledby="owner-paths">
          <p className="guide-kicker">Start from where you are</p>
          <h2 id="owner-paths">Two ways to update or request a page</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {OWNER_PATHS.map((pathItem) => (
              <div
                key={pathItem.title}
                className="rounded-3xl border border-[var(--line)] bg-[var(--paper-soft)] p-5"
              >
                <h3 className="text-xl font-black">{pathItem.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{pathItem.body}</p>
                <a
                  href={pathItem.href}
                  target={pathItem.external ? "_blank" : undefined}
                  rel={pathItem.external ? "noopener noreferrer" : undefined}
                  className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-black text-white"
                >
                  {pathItem.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="guide-section" aria-labelledby="page-can-include">
          <p className="guide-kicker">What the venue page can carry</p>
          <h2 id="page-can-include">Give travellers enough to choose and act</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {VENUE_PAGE_ITEMS.map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--line)] bg-white p-4">
                <p className="font-bold">{item}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-[var(--muted)]">
            Other Bali writes the traveller-facing fit context. Operators can
            correct facts and submit owned media, but editorial verdicts and
            organic ordering stay with Other Bali.
          </p>
        </section>

        <section className="guide-section" id="how-it-works" aria-labelledby="how-it-works-title">
          <p className="guide-kicker">Workflow</p>
          <h2 id="how-it-works-title">How a place moves from request to traveller action</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {STEPS.map((s) => (
              <article key={s.title} className="rounded-3xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--lagoon-strong)]">
                  {s.label}
                </p>
                <h3 className="mt-3 text-lg font-black">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="guide-section" id="submit" aria-labelledby="submit-title">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(320px,1.15fr)] lg:items-start">
            <div>
              <p className="guide-kicker">Request review</p>
              <h2 id="submit-title">Send your official venue details</h2>
              <p className="guide-lede">
                Tell us about your place. We will check the fit and contact you
                if we can prepare or update a page. Questions first?{" "}
                <a
                  href={VENUES_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[var(--lagoon-strong)]"
                >
                  Message us on WhatsApp
                </a>
                .
              </p>
              <div className="mt-5 rounded-3xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
                <h3 className="text-lg font-black">Before you submit</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <li>Use official contact channels only.</li>
                  <li>Send links where we can verify current information.</li>
                  <li>Do not send scraped or third-party media.</li>
                </ul>
              </div>
            </div>
            <div className="rounded-[2rem] border border-[var(--line)] bg-white p-4 shadow-[0_18px_50px_rgba(43,26,19,0.08)]">
              <VenueSubmissionForm />
            </div>
          </div>
        </section>

        <section className="guide-section" aria-labelledby="good-to-know">
          <p className="guide-kicker">Trust boundaries</p>
          <h2 id="good-to-know">Good to know</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {GOOD_TO_KNOW.map((item) => (
              <div key={item} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-4">
                <p className="text-sm font-bold">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
