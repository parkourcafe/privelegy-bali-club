import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import PageViewTracker from "@/components/PageViewTracker";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { getGuide, guideMetadata } from "@/lib/guides";

// Topical explainer (P1-3): "Is Airbnb banned in Bali?" Built from a sourced
// research pack (2026-07). Every factual claim is attributed to its source and
// dated; nothing is invented (guardrail #10). It gives NO legal advice — it
// reports what authorities/media say and routes to planning, which is Other
// Bali's lane (we don't book or replace accommodation). Regulation evolves, so
// the page states its "as of" date and links official sources.

const SLUG = "is-airbnb-banned-in-bali";
const guide = getGuide(SLUG)!;
const BASE = "https://www.otherbali.com";
const PUBLISHED = "2026-07-18";

export const revalidate = 3600;

export const metadata: Metadata = guideMetadata(guide);

const FAQ = [
  {
    q: "Is Airbnb banned in Bali?",
    a: "No official source confirms an Airbnb app ban. Indonesia's Tourism Ministry said in December 2025 that the government does not prohibit booking platforms like Airbnb and has no plan to stop them operating — the focus is tourism accommodation that operates without a licence, not the platform itself.",
  },
  {
    q: "Is Airbnb legal in Bali?",
    a: "The official framing isn't \"Airbnb legal or illegal\" — it's whether a given villa or homestay listed through a platform holds the required business permit. That's the operator's licensing status, which isn't always visible to a guest browsing listings.",
  },
  {
    q: "Will my villa booking be cancelled?",
    a: "The official sources don't spell out what happens to an already-confirmed guest booking if a specific villa is later found non-compliant. Media coverage (NDTV, March 2026) noted travellers might see some listings temporarily disappear while owners update licences. The paperwork burden is described as falling on hosts and platforms, not guests — but keep your booking confirmation and host contact handy just in case.",
  },
  {
    q: "What are the Bali Airbnb regulations for 2026?",
    a: "The concrete rule reported by the Tourism Ministry and news outlets is that accommodation sold through booking platforms should hold valid business permits by 31 March 2026, tied to Indonesia's OSS licensing, safety, tax and fair-competition rules. Non-compliant listings can be stopped from selling on the platforms.",
  },
  {
    q: "Do I need to pay the Bali tourist tax?",
    a: "Yes — since 14 February 2024 foreign visitors pay a IDR 150,000 levy (BBC). It applies to foreign tourists entering Bali from abroad or from elsewhere in Indonesia; Indonesian domestic tourists are exempt. The official, recommended route is to pay before arrival through the government's Love Bali website (US Embassy alert). This levy is separate from the villa-licensing news.",
  },
  {
    q: "Is Bali stopping new villas and hotels?",
    a: "In September 2024 Indonesia agreed to a moratorium on new hotels, villas and nightclubs in some busy Bali areas (Reuters, via CNN and The Guardian). The exact scope and duration were still being discussed. It concerns new construction — not a rule about staying in existing accommodation.",
  },
];

const RELATED = [
  { href: "/plan", title: "Plan your Bali days", blurb: "Wherever you stay, build the days around the moment you're in." },
  { href: "/canggu", title: "The Canggu guide", blurb: "Surf mornings, café work, sunset beach clubs." },
  { href: "/first-time-in-bali", title: "First time in Bali", blurb: "A calm, confident first day without rookie mistakes." },
];

const SOURCES: { label: string; href: string }[] = [
  { label: "Indonesia Tourism Ministry (kemenpar.go.id), 8 Dec 2025", href: "https://kemenpar.go.id/berita/penataan-difokuskan-pada-akomodasi-pariwisata-tanpa-izin" },
  { label: "Bali Provincial Government (baliprov.go.id), 12 Feb 2026", href: "https://www.baliprov.go.id/web/gubernur-koster-minta-airbnb-keluarkan-usaha-dan-jasa-pariwisata-di-bali-yang-tak-berizin-dan-tak-bayar-pajak/" },
  { label: "Reuters via CNN — Bali construction moratorium, 10 Sep 2024", href: "https://www.cnn.com/2024/09/10/travel/bali-considering-ban-new-hotels-intl-hnk" },
  { label: "Reuters via Straits Times — OTA licence deadline, 28 Feb 2026", href: "https://www.straitstimes.com/asia/se-asia/indonesia-tightens-rules-for-airbnb-style-rentals" },
  { label: "The Jakarta Post — unlicensed-accommodation crackdown, May 2026", href: "https://www.thejakartapost.com/business/2026/05/25/bali-tightens-crackdown-on-unlicensed-tourist-accommodation" },
  { label: "BBC — Bali tourist levy, 14 Feb 2024", href: "https://www.bbc.com/news/world-asia-68291726" },
];

export default function IsAirbnbBannedInBaliPage() {
  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Guides", href: "/guides" },
    { name: "Is Airbnb banned in Bali?" },
  ];

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      ...(c.href ? { item: `${BASE}${c.href}` } : {}),
    })),
  };
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Is Airbnb Being Banned in Bali? What Travellers Actually Need to Know",
    description: guide.description,
    datePublished: PUBLISHED,
    dateModified: PUBLISHED,
    inLanguage: "en",
    mainEntityOfPage: `${BASE}/${SLUG}`,
    author: { "@type": "Organization", name: "Other Bali", url: BASE },
    publisher: {
      "@type": "Organization",
      name: "Other Bali",
      logo: { "@type": "ImageObject", url: `${BASE}/icon-512.png` },
    },
  };

  return (
    <div>
      <main className="site-shell">
        <PageViewTracker event="editorial_page_view" slug={SLUG} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

        <Breadcrumbs items={crumbs} />

        <header style={{ marginTop: 8 }}>
          <p className="topline">Bali travel · explainer</p>
          <h1 className="hero-title mt-2">
            Is Airbnb being banned in Bali? What travellers actually need to know
          </h1>
          <p className="hero-copy">
            Short answer: <strong>no — Bali isn&apos;t banning Airbnb.</strong>{" "}Indonesia&apos;s
            Tourism Ministry said in December 2025 that it is not blocking booking
            platforms like Airbnb; the effort targets tourism accommodation that
            operates <em>without a licence</em>. The compliance work — permits,
            registration, tax — sits with villa operators and the platforms, not
            with ordinary guests. Here&apos;s what&apos;s confirmed, what&apos;s rumour, and
            what it means for your trip.
          </p>
          <p className="text-sm text-[var(--muted)]">As of July 2026. Rules are evolving — official links are at the bottom.</p>
        </header>

        <section className="guide-section">
          <h2>What people are hearing — and what&apos;s actually confirmed</h2>
          <p className="hero-copy">
            The rumour doing the rounds is &quot;Bali is banning Airbnb in 2026.&quot; The
            confirmed reality is narrower. In a statement dated 8 December 2025,
            Indonesia&apos;s Tourism Ministry said the government <em>does not prohibit</em>{" "}
            online travel platforms such as Airbnb and does not plan to stop them
            operating — it calls them strategic tourism partners. What it is arranging
            is <em>unlicensed</em>{" "}tourism accommodation: places operating without an
            official accommodation-business permit. No official source names a specific
            &quot;August 2026 ban,&quot; so treat that framing as rumour.
          </p>
        </section>

        <section className="guide-section">
          <h2>The real rule: licences for platform-listed stays</h2>
          <p className="hero-copy">
            After an October 2025 meeting with the major booking platforms, the
            Tourism Ministry directed them to push hosts to register business permits.
            The stated target: accommodation marketed through platforms should hold
            valid permits by <strong>31 March 2026</strong>{" "}— a deadline the Tourism
            Minister reiterated in late February 2026 (reported by Reuters). Listings
            that don&apos;t comply can be stopped from selling on the platforms. The
            ministry ties this to Indonesia&apos;s OSS business licensing, safety and
            professional standards, tax obligations and fair competition.
          </p>
        </section>

        <section className="guide-section">
          <h2>Bali&apos;s government, Airbnb and enforcement</h2>
          <p className="hero-copy">
            Bali&apos;s governor, Wayan Koster, met Airbnb representatives in February 2026
            and asked the platform to remove Bali listings that aren&apos;t licensed or
            don&apos;t pay tax; the provincial government reported that Airbnb said it would
            comply with local regulations. In May 2026 The Jakarta Post reported that
            authorities were intensifying a crackdown on unlicensed accommodation, citing
            a ministry figure that of roughly 470,000 listings across nine platforms,
            only about 31,000 had verified business registration. The direction of travel
            is clear: licensed places stay, unlicensed ones get pushed to comply or come
            down.
          </p>
        </section>

        <section className="guide-section">
          <h2>What it means for your trip — the honest version</h2>
          <p className="hero-copy">
            The paperwork burden falls on hosts and the platforms, not on guests. Media
            coverage (NDTV, March 2026) noted travellers might see some villas temporarily
            disappear from listings while owners update licences, and Bali-based outlet
            The Bali Sun wrote in June 2026 that speculation about reforms leaving tourists
            &quot;in the lurch&quot; was &quot;not the case.&quot; What the official sources <em>don&apos;t</em>{" "}
            spell out is exactly what happens to an already-confirmed booking if a specific
            villa is later found non-compliant. So the honest read: some listing disruption
            is plausible, specific booking outcomes aren&apos;t defined — keep your plans a
            little flexible, hold on to your confirmation and host contact, and build your
            days around where you&apos;ll actually be. (That&apos;s our job, not legal advice.)
          </p>
        </section>

        <section className="guide-section">
          <h2>A separate thing people confuse it with: the tourist levy</h2>
          <p className="hero-copy">
            Often lumped in with the &quot;Airbnb&quot; news, but unrelated. Since 14 February 2024,
            foreign visitors pay a one-off <strong>IDR 150,000</strong>{" "}Bali tourist levy
            (BBC). It applies to foreign tourists entering Bali from abroad or elsewhere in
            Indonesia; Indonesian domestic tourists are exempt. The official, recommended
            route is to pay before arrival through the government&apos;s Love Bali website (US
            Embassy alert).
          </p>
        </section>

        <section className="guide-section">
          <h2>The bigger picture: a pause on new building</h2>
          <p className="hero-copy">
            In September 2024, Indonesia agreed to a moratorium on new hotels, villas and
            nightclubs in some busy Bali areas (Reuters, carried by CNN and The Guardian),
            aimed at overdevelopment; the exact scope and duration were still being
            discussed. It&apos;s about new construction — not a rule that affects staying in
            accommodation that already exists.
          </p>
        </section>

        <FaqBlock items={FAQ} heading="Bali Airbnb & villa rules — quick answers" />

        <section className="guide-section">
          <h2>Plan the part that&apos;s actually fun</h2>
          <p className="hero-copy">
            Your stay aside, the days are the trip. Wherever you end up based, we&apos;ll help
            you pick the right place for the moment you&apos;re in.
          </p>
          <div className="hero-actions">
            <Link href="/plan" className="button-primary button-large">Open the guide</Link>
            <Link href="/canggu" className="button-secondary button-large">The Canggu guide</Link>
          </div>
        </section>

        <RelatedGuides links={RELATED} />

        <section className="guide-section">
          <h2>Sources</h2>
          <ul className="text-sm text-[var(--muted)]">
            {SOURCES.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="nofollow noopener noreferrer" className="quiet-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-[var(--muted)]" style={{ marginTop: 8 }}>
            This page reports what these sources say and is not legal, visa or tax advice.
            Check official Indonesian government sources for your situation.
          </p>
        </section>

        <GuideFooter />
      </main>
    </div>
  );
}
