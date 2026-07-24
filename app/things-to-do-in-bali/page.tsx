import Link from "next/link";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";
import { FaqBlock, RelatedGuides, GuideFooter } from "@/components/GuideBlocks";
import { GuideHeroMedia, GuideSectionMedia } from "@/components/GuideMedia";
import { getGuide, guideMetadata } from "@/lib/guides";
import {
  BALI_ICONS,
  BALI_THING_GROUPS,
  BALI_THINGS_FAQ,
  BALI_THINGS_REVIEW_DATE,
} from "@/lib/bali-things";

const BASE = "https://www.otherbali.com";
const guide = getGuide("things-to-do-in-bali")!;
export const metadata = guideMetadata(guide);

// Area guides this hub links into — the district things-to-do pages and pillars.
const BY_AREA: { href: string; title: string; blurb: string }[] = [
  { href: "/ubud/things-to-do", title: "Things to do in Ubud", blurb: "Rice terraces, the ridge walk, temples and the Monkey Forest." },
  { href: "/uluwatu", title: "Uluwatu & the Bukit", blurb: "Clifftop temples, the sunset Kecak and world-class surf." },
  { href: "/jimbaran/things-to-do", title: "Things to do in Jimbaran", blurb: "The fish market, Tegal Wangi tide pools and GWK." },
  { href: "/nusa-dua/things-to-do", title: "Things to do in Nusa Dua", blurb: "The promenade, Water Blow and Tanjung Benoa watersports." },
  { href: "/sanur/things-to-do", title: "Things to do in Sanur", blurb: "Sunrise walks, the beach path and the Nusa fast boats." },
  { href: "/canggu", title: "Things to do in Canggu", blurb: "Surf, café mornings, beach clubs and sunset." },
];

export default function ThingsToDoInBaliPage() {
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Things to do in Bali" }];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.description,
      url: `${BASE}/${guide.slug}`,
      about: "Things to do in Bali",
      isPartOf: { "@type": "WebSite", name: "Other Bali", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Best things to do in Bali",
      itemListElement: BALI_ICONS.map((t, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: t.title,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        ...(c.href ? { item: `${BASE}${c.href}` } : {}),
      })),
    },
  ];

  return (
    <div>
      <main className="site-shell">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="guide-hero">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-2">Best things to do in Bali</h1>
          <p className="guide-lede">
            Bali&apos;s sights are spread across the island, so the smart move is to
            plan around your base rather than chase everything. Here are the icons
            worth building a day around — temples, a volcano sunrise, waterfalls
            and the Nusa Penida cliffs — and then what to do in each area you might
            stay in.
          </p>
          <p className="guide-meta-line">
            Editorial review: {BALI_THINGS_REVIEW_DATE} · researched, not sponsored · no paid ranking
          </p>
          <GuideHeroMedia seed="things to do in bali temples waterfalls sunrise" />
        </header>

        {BALI_THING_GROUPS.map((group, index) => {
          const items = BALI_ICONS.filter((t) => t.group === group.key);
          if (items.length === 0) return null;
          return (
            <section key={group.key} className="guide-section">
              <h2>{group.heading}</h2>
              <GuideSectionMedia seed={`things to do ${group.key} ${group.heading}`} index={index} />
              <p className="text-sm leading-relaxed text-[var(--muted)]">{group.note}</p>
              <div className="guide-prose">
                {items.map((t) => (
                  <div key={t.title} className="mt-6">
                    <h3 className="!mt-0">
                      {t.mapsUrl ? (
                        <a href={t.mapsUrl} target="_blank" rel="noreferrer" className="text-[var(--lagoon-strong)]">
                          {t.title}
                        </a>
                      ) : (
                        t.title
                      )}
                    </h3>
                    <p className="text-sm font-semibold text-[var(--muted)]">{t.region}</p>
                    <p className="mt-1">{t.blurb}</p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <section className="guide-section">
          <h2>Things to do by area</h2>
          <GuideSectionMedia seed="things to do by area bali" index={8} />
          <p className="guide-lede">
            Wherever you base, there&apos;s a day or two of things to do on the
            doorstep. Pick your area:
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            {BY_AREA.map((a) => (
              <li key={a.href}>
                <Link href={a.href} className="font-semibold text-[var(--ink)]">
                  {a.title}
                </Link>
                <span className="text-[var(--muted)]"> · {a.blurb}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="guide-section">
          <h2>Practical notes (read before you plan)</h2>
          <GuideSectionMedia seed="things to do practical notes bali" index={9} />
          <div className="guide-prose">
            <ul>
              <li>
                <strong>Plan around your base.</strong> The icons are scattered —
                temples in the east, Batur and terraces in the highlands, Nusa
                Penida off the south-east. Cluster them by direction so you&apos;re
                not crossing the island twice.
              </li>
              <li>
                <strong>Some sights now require a guide.</strong> Besakih, the
                Mount Batur sunrise trek and Sekumpul waterfall all use a mandatory
                local guide — factor it into time and cost.
              </li>
              <li>
                <strong>Carry a sarong and cash.</strong> Temples need a sarong
                (most provide one) and charge small cash entry fees in rupiah.
                Bali also has a one-time foreign-tourist levy — pay it via the
                official Love Bali site and check current amounts.
              </li>
              <li>
                <strong>Time the tides and the light.</strong> Tanah Lot&apos;s
                rock base and Nusa Penida&apos;s Angel&apos;s Billabong are
                low-tide only; temples and terraces are best early, before the heat
                and the crowds.
              </li>
            </ul>
          </div>
        </section>

        <FaqBlock items={BALI_THINGS_FAQ} heading="Good to know" />

        <RelatedGuides
          heading="Keep planning"
          links={[
            { href: "/bali-itinerary-7-days", title: "7 days in Bali", blurb: "A first-trip route that fits the icons in." },
            { href: "/how-many-days-in-bali", title: "How many days in Bali", blurb: "How long you need for what you want to see." },
            { href: "/where-to-stay-in-bali", title: "Where to stay in Bali", blurb: "All the first-timer areas, compared." },
            { href: "/how-to-get-around-bali", title: "Getting around Bali", blurb: "Scooters, drivers and apps between the sights." },
          ]}
        />

        <GuideFooter />
      </main>
    </div>
  );
}
