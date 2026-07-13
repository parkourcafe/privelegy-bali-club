import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Where to Stay in Bali — Match the Area to Your Trip",
  description: "Choose a Bali area by daily rhythm, trip type and realistic trade-offs, based on recurring traveller discussions and Other Bali editorial checks.",
  alternates: { canonical: "/bali/where-to-stay" },
};

const areas = [
  { name: "Seminyak", href: "/bali/seminyak", stay: "3–5 nights", best: "Food, spas, shopping and polished evenings", tradeoff: "Traffic, tourist pricing and little reason to stay if dining and nightlife are not your priorities." },
  { name: "Sanur", href: "/sanur", stay: "3–5 nights", best: "Families, calm mornings, cycling and an easy final stop", tradeoff: "Quiet nights and tide-dependent swimming; calm can feel sleepy if you want a social scene." },
  { name: "Nusa Dua", href: "/bali/nusa-dua", stay: "2–4 nights", best: "Resort comfort, families and a predictable beach reset", tradeoff: "The resort enclave is the point. It can feel detached from everyday Bali." },
  { name: "Ubud", href: "/ubud", stay: "4–6 nights", best: "Culture, wellness, nature and slower creative days", tradeoff: "Central Ubud is busy, and it is a poor base for repeated south-coast beach trips." },
  { name: "Canggu", href: "/canggu", stay: "2–4 nights; longer for remote work", best: "Surf, cafés, gyms, coworking and social energy", tradeoff: "Severe traffic and a highly developed lifestyle bubble. Choose the exact micro-area carefully." },
  { name: "Uluwatu", href: "/uluwatu", stay: "3–5 nights", best: "Cliffs, surf beaches, sunsets and destination dining", tradeoff: "Spread-out roads, limited walking and beach access that often means stairs." },
  { name: "Jimbaran", href: "/bali/jimbaran", stay: "2–4 nights", best: "A quieter bay, seafood sunsets and an airport-friendly finish", tradeoff: "Less variety after dark; the beach and resort zones feel quite different." },
  { name: "Amed", href: "/bali/amed", stay: "3–5 nights", best: "Diving, snorkelling and a low-key east-coast rhythm", tradeoff: "Long transfers and limited nightlife; conditions and operator quality matter more than a generic ranking." },
  { name: "Sidemen", href: "/bali/sidemen", stay: "2–4 nights", best: "Rice-valley quiet, scenery and a deliberate reset", tradeoff: "Isolated stays require planning for meals and transport." },
  { name: "Kuta & Legian", href: "/bali/kuta-legian", stay: "1–3 nights", best: "Beginner surf, practical access and lively budget travel", tradeoff: "Crowds and an uneven nightlife scene; old recommendations age quickly." },
];

const sources = [
  ["Seminyak planning discussions", "https://www.reddit.com/r/bali/comments/1p0xt1a/things_to_do_in_seminyak_2025_edition/"],
  ["Sanur traveller tips", "https://www.reddit.com/r/BaliTravelTips/comments/1rnlxk5/sanur_tips/"],
  ["Nusa Dua resort discussion", "https://www.reddit.com/r/BaliTravelTips/comments/1rel7b8/nusa_dua_resort_recommendations/"],
  ["Ubud stay discussion", "https://www.reddit.com/r/bali/comments/1k51x1v"],
  ["Canggu expectations discussion", "https://www.reddit.com/r/bali/comments/18ztzho"],
] as const;

export default function WhereToStayPage() {
  return (
    <div className="page-dark">
      <main className="site-shell">
        <nav aria-label="Breadcrumb" className="text-xs text-[var(--muted)]">
          <Link href="/" className="quiet-link">Other Bali</Link> ›{" "}
          <Link href="/bali" className="quiet-link">Bali</Link> › Where to stay
        </nav>

        <header className="hero-grid mt-3">
          <div>
            <h1 className="hero-title">Choose the rhythm, then the area</h1>
            <p className="hero-copy mt-3">
              Bali is not one practical base. The right choice depends on the day you want to repeat: beach and resort, food and nightlife, yoga and culture, surf and social life, or genuine quiet.
            </p>
          </div>
          <div className="editorial-signal">
            <p className="editorial-signal-label">Traveller patterns, not a universal ranking.</p>
          </div>
        </header>

        <section className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--paper-soft)] p-5">
          <h2 className="section-title">The rule that saves the most time</h2>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
            Pick accommodation close to the places you will use every day. On Bali, travel time matters more than distance. A plan that crosses the island daily usually becomes a plan spent in traffic.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="section-title">Area-by-area fit</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {areas.map((area) => (
              <article key={area.name} className="venue-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="venue-name">{area.name}</h3>
                  <span className="text-xs font-semibold text-[var(--lagoon-strong)]">{area.stay}</span>
                </div>
                <p className="mt-3 text-sm"><strong>Best for:</strong> {area.best}</p>
                <p className="mt-2 text-sm text-[var(--muted)]"><strong>Know before booking:</strong> {area.tradeoff}</p>
                <Link href={area.href} className="mt-4 inline-block text-sm font-semibold text-[var(--lagoon-strong)]">Explore {area.name} →</Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-[var(--line)] pt-8">
          <h2 className="section-title">How this guide was built</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--muted)]">
            We mapped recurring themes across traveller discussions, then kept the contradictions: “quiet” can mean comfortable or boring; “resort bubble” can mean effortless or disconnected. Reddit is a perception signal, not proof of current opening hours, prices or safety. Venue facts are checked separately before publication.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs">
            {sources.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer" className="quiet-link">{label} ↗</a>)}
          </div>
        </section>
      </main>
    </div>
  );
}
